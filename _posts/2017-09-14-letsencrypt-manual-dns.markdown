---
layout: post
title: "SSL Gratis dengan LetsEncrypt"
date: 2017-09-14 08:52
comments: true
categories:
- aplikasi
---
Di tahun 2017 ini, sudah tidak ada lagi alasan bagi kita untuk tidak menggunakan `HTTPS`. [Sertifikat SSL](https://software.endy.muhardin.com/aplikasi/apa-itu-ssl/) bisa didapatkan dengan mudah dan gratis dengan adanya [LetsEncrypt](https://letsencrypt.org/).

LetsEncrypt menyediakan beberapa metode yang bisa kita gunakan untuk membuktikan bahwa domain yang ingin kita buatkan sertifikatnya benar-benar kita miliki (Domain Validation), yaitu:

* apache
* nginx
* standalone
* manual

Metode `apache` dan `nginx` kita gunakan bila kita menggunakan webserver tersebut. Aplikasi Certbot dari LetsEncrypt akan membuat file khusus di webserver tersebut dan mencoba mengaksesnya dari internet. Bila berhasil, artinya kita benar-benar menguasai domain dan webservernya.

Metode standalone kita gunakan bila aplikasi kita tidak berjalan di atas `apache` atau `nginx`, misalnya bila kita menggunakan Tomcat, Jetty, dan sebagainya. Dengan metode ini, `certbot` akan menjalankan webserver dan menunggu request dari server LetsEncrypt. Bila server LetsEncrypt bisa mengakses webserver `certbot` tersebut, artinya kita benar-benar punya akses ke domain dan servernya. Cara menggunakan metode ini sudah kita bahas di [artikel terdahulu](https://software.endy.muhardin.com/java/instalasi-jenkins-ssl/).

Walaupun demikian, adakalanya kita belum punya server yang akan kita gunakan untuk menjalankan aplikasi. Belum tahu mau pakai webserver apa. Atau aplikasi kita berjalan di port non-standar (selain 80 dan 443). Karena servernya belum ada, maka kita tidak bisa menunggu request di server tersebut. Kita juga tidak bisa mengarahkan nama domain ke laptop kita, karena pada umumnya, laptop kita tidak memiliki IP publik. Untuk itu, pada artikel kali ini kita akan membahas metode `manual` dan verifikasi `dns`. Metode ini bisa dijalankan di laptop, tanpa harus punya server ataupun mendeploy aplikasi kita ke server tertentu.

<!--more-->

Pertama, kita harus instal dulu aplikasi `certbot` untuk berinteraksi dengan LetsEncrypt. Cara instalasinya tidak kita bahas di sini, silahkan langsung [baca dokumentasinya](https://certbot.eff.org/docs/install.html).

Misalnya, kita ingin membuat sertifikat SSL untuk domain `payment.tazkia.ac.id`. Kita harus punya akses ke DNS server yang mengelola domain induknya yaitu `tazkia.ac.id`. Nantinya kita akan menambahkan record khusus ke DNS server. LetsEncrypt akan mengecek keberadaan record tersebut untuk membuktikan bahwa kita benar-benar merupakan administrator untuk domain tersebut. Lebih lanjut mengenai proses validasi domain ini bisa dibaca pada [artikel tentang pembelian sertifikat SSL](https://software.endy.muhardin.com/aplikasi/membeli-sertifikat-ssl/).


Setelah aplikasi `certbot` terinstal, kita jalankan perintah untuk memulai proses Domain Validation. Berikut perintahnya

```
certbot certonly -d payment.tazkia.ac.id --manual --preferred-challenges dns --config-dir config --work-dir work --logs-dir logs
```

Berikut keterangan opsi-opsi yang digunakan:

* `-d payment.tazkia.ac.id` : nama domain yang akan dibuatkan sertifikat SSLnya. Jadi nantinya kita akan mengakses aplikasi/website dengan alamat `https://payment.tazkia.ac.id`
* `--manual` : metode yang kita gunakan adalah manual. Artinya kita akan menjalankan proses sendiri, tanpa dibantu fitur otomasi `certbot`
* `--preferred-challenges dns` : metode validasi yang kita gunakan adalah konfigurasi DNS server. Ini kita pilih karena kita belum punya server untuk menjalankan verifikasi dengan file.
* `--config-dir config --work-dir work --logs-dir logs` : folder kerja `certbot`. Ini saya arahkan sendiri karena saya ingin menyimpan hasilnya dalam Dropbox supaya terbackup secara otomatis.

Output dari perintah tersebut seperti ini:

```
Saving debug log to /Users/endymuhardin/Dropbox/Konfigurasi/LetsEncrypt/logs/letsencrypt.log
Plugins selected: Authenticator manual, Installer None
Obtaining a new certificate
Performing the following challenges:
dns-01 challenge for payment.tazkia.ac.id

-------------------------------------------------------------------------------
NOTE: The IP of this machine will be publicly logged as having requested this
certificate. If you're running certbot in manual mode on a machine that is not
your server, please ensure you're okay with that.

Are you OK with your IP being logged?
-------------------------------------------------------------------------------
(Y)es/(N)o: y

-------------------------------------------------------------------------------
Please deploy a DNS TXT record under the name
_acme-challenge.payment.tazkia.ac.id with the following value:

0wvNZdimx8RfsGO4Wm4a5HoC1CaUmtHQCsfuHNSjWOs

Before continuing, verify the record is deployed.
-------------------------------------------------------------------------------
Press Enter to Continue
```

Menurut instruksi di atas, kita disuruh membuat record baru di DNS server dengan tipe `TXT`, nama record `_acme-challenge.payment.tazkia.ac.id` berisi nilai `0wvNZdimx8RfsGO4Wm4a5HoC1CaUmtHQCsfuHNSjWOs`. Cara membuat recordnya berbeda-beda tergantung tempat kita membeli domain. Bila kita menggunakan CPanel, tampilannya kira-kira seperti ini

[![Konfigurasi DNS Record]({{site.url}}/images/uploads/2017/letsencrypt-manual-dns/cpanel-dns.png)]({{site.url}}/images/uploads/2017/letsencrypt-manual-dns/cpanel-dns.png)

Setelah kita masukkan, tekan `Save`, kita lanjutkan ke command prompt tadi. Tekan `Enter`. Prosesnya akan berlanjut. Server LetsEncrypt akan mengecek nilai tadi ke DNS server kita.

```
Waiting for verification...
Cleaning up challenges
Non-standard path(s), might not work with crontab installed by your operating system package manager

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /Users/endymuhardin/Dropbox/Konfigurasi/LetsEncrypt/config/live/payment.tazkia.ac.id/fullchain.pem
   Your key file has been saved at:
   /Users/endymuhardin/Dropbox/Konfigurasi/LetsEncrypt/config/live/payment.tazkia.ac.id/privkey.pem
   Your cert will expire on 2017-12-13. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

Selesai, kita sudah mendapatkan sertifikat di file `fullchain.pem` dan private key di file `privkey.pem`. Selanjutnya kita bisa memasangnya di webserver kita seperti sudah dijelaskan di [artikel ini](https://software.endy.muhardin.com/aplikasi/memasang-sertifikat-ssl/).

Jangan lupa bahwa sertifikat ini hanya berlaku selama 3 bulan. Sebelum berakhir masa berlakunya, kita harus memperbaruinya dengan perintah berikut:

```
certonly -d payment.tazkia.ac.id --manual --preferred-challenges dns --config-dir config --work-dir work --logs-dir logs --force-renew
```

Selamat mencoba, semoga bermanfaat.
