---
layout: post
title: "Intermittent Moodle 502 Post Mortem"
date: 2021-01-15 07:00
comments: true
categories:
- devops
---

Beberapa hari terakhir, [aplikasi e-learning Tazkia](https://elearning.tazkia.ac.id) kadang menampilkan error 502 Bad Gateway pada saat diakses. Berikut adalah diagnosa, analisa, dan tindakan yang dilakukan untuk mengatasi masalah tersebut.

<!--more-->

* TOC
{:toc}

## Error yang terjadi ##

Beberapa user (lebih dari 5) melaporkan tampilnya halaman 502 Bad Gateway pada waktu mengakses aplikasi e-learning. Laporan user tidak menyebutkan detail lain seperti:

* perangkat yang digunakan untuk mengakses
* jenis dan versi browser yang digunakan
* koneksi internet yang dipakai
* fitur aplikasi yang diakses

Walaupun demikian, karena errornya terjadi di sisi server (kode error 5xx), maka harusnya error log akan ada di server, sehingga untuk diagnosa awal informasi tersebut belum perlu diminta.

## Skema dan Topologi Deployment E-Learning ##

Aplikasi e-learning Tazkia menggunakan Moodle, dideploy dengan skema seperti ini:


[![Moodle Deployment]({{site.url}}/images/uploads/2021/nginx-moodle-502/moodle-deployment.png)]({{site.url}}/images/uploads/2021/nginx-moodle-502/moodle-deployment.png)

Untuk itu, diagnosa error akan dilakukan dengan cara:

* Melihat isi file `/var/log/nginx/error.log`
* Melihat isi file `/var/log/php7.4-fpm.log`

## Error Log ##

Berikut adalah pesan error yang ditemukan di `/var/log/nginx/error.log`

```
2021/01/15 03:36:34 [error] 5451#5451: *2671271 connect() to unix:/run/php/php7.4-fpm.sock failed (11: Resource temporarily unavailable) while connecting to upstream, client: 114.122.234.47, server: elearning.tazkia.ac.id, request: "GET /lib/ajax/setuserpref.php?sesskey=abcdabcd&pref=filepicker_recentrepository&value=6 HTTP/2.0", upstream: "fastcgi://unix:/run/php/php7.4-fpm.sock:", host: "elearning.tazkia.ac.id", referrer: "https://elearning.tazkia.ac.id/mod/quiz/attempt.php?attempt=123456&cmid=123456"
2021/01/15 03:36:34 [error] 5451#5451: *2671271 connect() to unix:/run/php/php7.4-fpm.sock failed (11: Resource temporarily unavailable) while connecting to upstream, client: 114.122.234.47, server: elearning.tazkia.ac.id, request: "POST /repository/repository_ajax.php?action=list HTTP/2.0", upstream: "fastcgi://unix:/run/php/php7.4-fpm.sock:", host: "elearning.tazkia.ac.id", referrer: "https://elearning.tazkia.ac.id/mod/quiz/attempt.php?attempt=123456&cmid=123456"
2021/01/15 03:36:34 [error] 5451#5451: *2658592 connect() to unix:/run/php/php7.4-fpm.sock failed (11: Resource temporarily unavailable) while connecting to upstream, client: 203.153.22.41, server: elearning.tazkia.ac.id, request: "GET /mod/quiz/attempt.php?attempt=123456&cmid=123456 HTTP/2.0", upstream: "fastcgi://unix:/run/php/php7.4-fpm.sock:", host: "elearning.tazkia.ac.id", referrer: "https://elearning.tazkia.ac.id/mod/quiz/view.php?id=123456"
```

Dan ini error log di `/var/log/php7.4-fpm.log`

```
[15-Jan-2021 03:04:39] WARNING: [pool www] server reached pm.max_children setting (5), consider raising it
[15-Jan-2021 03:05:21] WARNING: [pool www] server reached pm.max_children setting (5), consider raising it
[15-Jan-2021 03:18:28] WARNING: [pool www] server reached pm.max_children setting (5), consider raising it
[15-Jan-2021 03:33:04] WARNING: [pool www] server reached pm.max_children setting (5), consider raising it
[15-Jan-2021 03:33:32] WARNING: [pool www] server reached pm.max_children setting (5), consider raising it
```

## Hasil Googling ##

Error message yang didapat bisa langsung kita copas ke Google, dan segera muncul beberapa artikel yang menjelaskan error tersebut.

[![Nginx 502]({{site.url}}/images/uploads/2021/nginx-moodle-502/nginx-502.png)]({{site.url}}/images/uploads/2021/nginx-moodle-502/nginx-502.png)

[![Server Reach PM Max]({{site.url}}/images/uploads/2021/nginx-moodle-502/server-reach-pm-max.png)]({{site.url}}/images/uploads/2021/nginx-moodle-502/server-reach-pm-max.png)

## Analisa ##

Beberapa artikel yang membahas masalah tersebut diantaranya:

* [Blog Ubiq](https://ubiq.co/tech-blog/fix-502-bad-gateway-error-nginx/)
* [Forum WebCore Cloud](https://community.webcore.cloud/tutorials/how_to_solve_php_fpm_server_reached_max_children/)
* [Support Forum Plesk](https://support.plesk.com/hc/en-us/articles/214528405--Websites-on-PHP-FPM-are-unavailable-or-loading-slowly-server-reached-max-children-setting-OR-pool-seems-busy-)

Pada artikel di atas, dijelaskan bahwa error 502 di Nginx disebabkan karena dia mencoba menghubungi PHP-7.4 FPM untuk memproses script Moodle, tapi tidak kunjung mendapatkan response sampai timeout. 

[![Ubiq 502]({{site.url}}/images/uploads/2021/nginx-moodle-502/ubiq-cause-502.png)]({{site.url}}/images/uploads/2021/nginx-moodle-502/ubiq-cause-502.png)

Beberapa kemungkinan penyebabnya adalah:

* ada script PHP yang membutuhkan waktu lama untuk dijalankan
* ada query yang membutuhkan waktu lama untuk dijalankan
* jumlah request yang datang melebihi worker yang tersedia dalam PHP-FPM pool, sehingga kelebihan request tersebut harus antri. Antrian tersebut tidak selesai dalam rentang waktu timeout Nginx, sehingga Nginx bosan menunggu (timeout) dan mengeluarkan error 502.

Beberapa alternatif solusi yang bisa diterapkan:

1. Menambah rentang waktu timeout di sisi Nginx, sehingga dia lebih sabar menunggu antrian atau eksekusi script/query
2. Menambah worker yang tersedia dalam PHP-FPM pool, sehingga bisa melayani lebih banyak request dan mengurangi antrian

## Pilihan dan implementasi solusi ##

Melihat pesan error dalam `/var/log/php7.4-fpm.log`, dapat disimpulkan bahwa penyebab masalah yang utama adalah kurangnya worker yang melayani request. Sedangkan timeout yang terjadi merupakan akibat dari panjangnya antrian request. 

Untuk itu, maka kita akan menambah worker dalam pool. Setelah ditambah, diharapkan antrian tidak akan terbentuk, atau ada dalam jumlah sedikit dan bisa dilayani sebelum mencapai batas timeout.

Implementasi solusi dilakukan dengan cara mengubah setting `pm.max_children` dalam file `/etc/php/7.4/fpm/pool.d/www.conf` menjadi seperti ini 

```
pm.max_children = 15
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 5
``` 

Jumlah `max_children` yang sesuai bisa dihitung dengan mengikuti petunjuk [di artikel ini](https://www.kinamo.be/en/support/faq/determining-the-correct-number-of-child-processes-for-php-fpm-on-nginx).

Setelah itu, restart `php7.4-fpm` dengan perintah berikut

```
systemctl restart php7.4-fpm
```

Selanjutnya, kita bisa memantau jumlah proses `php-fpm` dengan perintah `ps aux | grep php-fpm`.  Harusnya akan terlihat 5 proses, karena `pm.start_servers` dan `pm.min_spare_servers` diset di angka `5`

```
root@elearning:~# ps aux| grep php-fpm
root     21977  0.6  0.3 466004 30164 ?        Ss   06:40   0:00 php-fpm: master process (/etc/php/7.4/fpm/php-fpm.conf)
www-data 22007  5.6  0.7 472928 57468 ?        R    06:40   0:00 php-fpm: pool www
www-data 22008  6.5  0.7 473200 57968 ?        R    06:40   0:00 php-fpm: pool www
www-data 22021  4.2  0.6 470892 56608 ?        S    06:40   0:00 php-fpm: pool www
www-data 22023  1.7  0.5 470780 46716 ?        S    06:40   0:00 php-fpm: pool www
www-data 22024  1.6  0.5 470776 41048 ?        S    06:40   0:00 php-fpm: pool www
www-data 22025  2.0  0.5 474876 48412 ?        R    06:40   0:00 php-fpm: pool www
```

Saat ini perubahan tersebut sudah diimplementasikan dan akan dipantau pada saat load tinggi. Seharusnya sudah tidak terjadi lagi error 502. Bila masih terjadi, maka kita bisa meningkatkan lagi nilai `max_children` sesuai kebutuhan.

Semoga bermanfaat ... 