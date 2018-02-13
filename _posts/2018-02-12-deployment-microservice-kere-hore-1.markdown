---
layout: post
title: "Deployment Microservice Kere Hore Bagian 1"
date: 2018-02-12 07:00
comments: true
categories:
- devops
---
Arsitektur Microservices saat ini sedang ngetren. Kami di ArtiVisi juga sudah mengadopsi arsitektur ini dalam beberapa projec terakhir. Dan bahkan sudah mengadakan trainingnya. Dilihat dari sisi development dan deployment, microservice memang memungkinkan organisasi untuk bisa membuat aplikasi sesuai kebutuhan dengan cepat. Proses yang dulunya memakan waktu berbulan-bulan dari konsep sampai go-live, sekarang bisa dipercepat menjadi beberapa minggu saja.

Salah satu ciri khas dari arsitektur microservices adalah ada banyak aplikasi kecil-kecil yang saling berkomunikasi satu dengan lainnya. Dengan demikian, kita dituntut untuk banyak mendeploy aplikasi. Masing-masing aplikasi juga bisa dibuat dengan teknologi yang berbeda-beda sesuai dengan kebutuhan dan trend masa kini.

Kalau mau diikuti idealnya, satu VPS berisi satu aplikasi. Atau satu docker container berisi satu aplikasi, dan satu VPS bisa berisi banyak docker container. Akan tetapi tentu saja kita tidak berada di dunia yang serba ideal. Ada kalanya kita harus berkompromi dengan budget, sehingga satu VPS harus rela menghosting banyak aplikasi sekaligus.

Pada artikel kali ini, kita akan mendeploy beberapa aplikasi microservices dalam satu host karena keterbatasan budget. Walaupun kantong kere, hanya mampu sewa satu VPS, tapi bisa tetap hore dengan arsitektur jaman now :D

Satu VPS biasanya hanya punya satu IP public. Dengan keterbatasan ini, maka kita perlu sedikit berakrobat supaya semua aplikasi kita bisa berbagai pakai port-port penting seperti misalnya port HTTPS (443). Sebagai studi kasus, pada artikel ini kita akan mendeploy beberapa aplikasi yang dibuat dengan bahasa pemrograman dan framework berbeda, yaitu Java dengan Spring Boot, NodeJS dengan Express, Ruby dengan Rails, dan tidak ketinggalan aplikasi sejuta umat Wordpress yang dibuat dengan PHP. Kita ingin mengakses keempatnya dengan alamat sebagai berikut:

* `https://app1.artivisi.id` : Aplikasi Java dengan Spring Boot
* `https://app2.artivisi.id` : Aplikasi NodeJS dengan ExpressJS
* `https://app3.artivisi.id` : Aplikasi Ruby dengan RubyOnRails
* `https://wp.artivisi.id` : Aplikasi PHP dengan Wordpress

Keempat aplikasi akan dihosting/dijalankan di satu mesin yang sama. Saya akan gunakan VPS termurah yang disediakan [Digital Ocean](https://m.do.co/c/c5449509c33a), seharga $5 sebulan.

Pada bagian pertama ini, kita akan membahas cara setup VPS dan Nginx sebagai Front Proxy. Artikel selanjutnya akan membahas implementasi masing-masing backend.

<!--more-->

Tentunya tidak mungkin keempat aplikasi kita install di port 443 semua. Oleh karena itu kita harus menggunakan front proxy. Ada beberapa pilihan:

* Apache HTTPD
* Nginx
* HAProxy
* Netflix Zuul 
* dan sebagainya

Kemudian, kita harus memutuskan di mana kita ingin memasang sertifikat HTTPS. Bisa di masing-masing aplikasi, bisa juga disatukan di front proxy. Saya lebih suka setting di front proxy, supaya pengelolaannya lebih mudah.

Jadi, arsitektur yang kita akan buat kira-kira seperti ini:

[![Microservice Deployment]({{site.url}}/images/uploads/2018/msa-deployment/00-microservice-deployment.jpg)]({{site.url}}/images/uploads/2018/msa-deployment/00-microservice-deployment.jpg)

Walaupun di gambar terlihat ada 5 server, aslinya itu semua akan kita deploy ke satu tempat.

Ada beberapa istilah yang perlu diketahui dulu untuk membuat deployment seperti di atas:

* Virtual Host : Ini adalah istilah untuk masing-masing nama domain dan aplikasi yang dihosting di satu tempat. Pada waktu user mengakses alamat tertentu, misalnya `app1.artivisi.id`, maka akan diteruskan ke aplikasi A. Sedangkan bila alamat yang diketik di browser client `wp.artivisi.id`, maka yang akan dijalankan adalah aplikasi Wordpress.
* SNI : server name indication. Ini adalah fitur webserver agar bisa menghosting lebih dari satu situs SSL. Seperti sudah dibahas di artikel terdahulu, setiap nama domain butuh satu sertifikat. Jadi pada kasus kita di atas, kita akan punya 4 pasang public key dan private key. Satu pasang untuk masing-masing domain. Webserver harus bisa memilih sertifikat mana yang akan dipakai pada waktu ada request yang datang ke nama domain tertentu. Fitur ini disebut dengan SNI.
* SSL Termination : di mana koneksi HTTPS berakhir. Atau bisa juga disebut siapa yang memegang sertifikat SSL. Yang akan kita coba di sini semua SSL termination akan dilakukan di front proxy. Alternatif lain, SSL termination bisa dilakukan di masing-masing aplikasi.

Strategi kita untuk mengimplementasikan gambar di atas adalah sebagai berikut:

* Nginx akan dipilih sebagai Front Proxy, karena paling populer, mainstream, sehingga tutorialnya banyak di internet.
* Aplikasi Wordpress akan dihosting langsung oleh Nginx dengan modul PHP 7
* Aplikasi `app1.artivisi.id`, `app2.artivisi.id`, dan `app3.artivisi.id` akan berjalan di port `10001`, `10002`, dan `10003`.
* Kita akan menulis konfigurasi reverse proxy agar Nginx meneruskan request ke `https://app1.artivisi.id` ke `http://localhost:10001` dan seterusnya untuk aplikasi lainnya.

## Membuat VPS ##

Langkah pertama tentu kita siapkan dulu VPSnya. Saya biasanya menggunakan provider [Digital Ocean](https://m.do.co/c/c5449509c33a) yang murah, meriah, cepat, dan mudah digunakan. Dari sini kita mendapatkan alamat IP public server kita yaitu `159.65.3.157`.

## Setup DNS ##

Masukkan alamat IP tersebut ke konfigurasi DNS server. Pastikan masing-masing hostname yang kita inginkan sudah didaftarkan agar mengarah ke IP tersebut.

[![DNS Config]({{site.url}}/images/uploads/2018/msa-deployment/01-dns-config.png)]({{site.url}}/images/uploads/2018/msa-deployment/01-dns-config.png)

## Instalasi dan Konfigurasi VirtualHost dengan Nginx ##

Login ke server VPS sebagai root, kemudian lakukan instalasi Nginx

```
apt install nginx -y
```

### Folder Virtual Host ###

Selanjutnya, kita membuat placeholder dulu untuk masing-masing domain. Tujuannya supaya kita bisa mengkonfigurasi masing-masing domain dan mengetes konfigurasinya tanpa harus mendeploy aplikasi aslinya. Deployment aplikasi biasanya cukup ribet, sehingga kita ingin meminimasi kepusingan pada saat error.

Kita buat 4 folder di `/var/www` sesuai nama masing-masing domain.

```
mkdir -p /var/www/{app1.artivisi.id,app2.artivisi.id,app3.artivisi.id,wp.artivisi.id}/html
```

Hasilnya sebagai berikut:

```
ls -l /var/www/
total 20
drwxr-xr-x 3 root root 4096 Feb 12 07:44 app1.artivisi.id
drwxr-xr-x 3 root root 4096 Feb 12 07:44 app2.artivisi.id
drwxr-xr-x 3 root root 4096 Feb 12 07:44 app3.artivisi.id
drwxr-xr-x 2 root root 4096 Feb 12 07:42 html
drwxr-xr-x 3 root root 4096 Feb 12 07:44 wp.artivisi.id
```

Selanjutnya, kita buat placeholder halaman `index.html` agar keliatan bedanya pada waktu dibrowse. Isinya kira-kira seperti ini:

```html
<html>
  <head><title>app1.artivisi.id</title></head>
  <body><h1>app1.artivisi.id</h1></body>
</html>
```

Simpan di `/var/www/app1.artivisi.id/html/index.html` dan lakukan hal yang sama untuk semua domain.

### Konfigurasi Virtual Host ###

Kita akan membuat konfigurasi untuk masing-masing domain agar dilayani oleh folder yang sudah kita siapkan pada langkah sebelumnya. Berikut isi file konfigurasi untuk `app1.artivisi.id`

```
server {
  listen 80;
  listen [::]:80;

  root /var/www/app1.artivisi.id/html;
  index index.html index.htm index.nginx-debian.html;

  server_name app1.artivisi.id;

  location / {
    try_files $uri $uri/ =404;
  }
}
```

Simpan filenya di `/etc/nginx/sites-available/app1.artivisi.id`. Kemudian kita buat symlink ke `/etc/nginx/sites-enabled/` untuk mengaktifkannya

```
ln -s /etc/nginx/sites-available/app1.artivisi.id /etc/nginx/sites-enabled/
```

Periksa file konfigurasinya untuk memastikan tidak ada salah ketik

```
nginx -t
```

Hasilnya seperti ini

```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

Selanjutnya, kita restart Nginx

```
service nginx restart
```

Lalu kita test browse ke `http://app1.artivisi.id`, harusnya tampil seperti ini

[![Tampilan app1.artivisi.id]({{site.url}}/images/uploads/2018/msa-deployment/02-app1.png)]({{site.url}}/images/uploads/2018/msa-deployment/02-app1.png)

Kalau sudah berhasil, lakukan hal yang sama untuk semua domain yang lain. Pastikan semua domain bisa diakses dengan benar.

[![Tampilan semua app]({{site.url}}/images/uploads/2018/msa-deployment/03-semua-app.png)]({{site.url}}/images/uploads/2018/msa-deployment/03-semua-app.png)

## HTTPS dengan LetsEncrypt ##

Semua domain kita sudah bisa diakses dengan protokol `http`. Sekarang saatnya kita amankan dengan `https`. Kita akan menggunakan sertifikat gratisan dari LetsEncrypt. Proses pengambilan sertifikat sudah diotomasi dengan aplikasi yang bernama `certbot`. Kita install dulu `certbot`nya

```
add-apt-repository ppa:certbot/certbot
apt update
apt install certbot -y
```

Pada saat tulisan ini dibuat, ada sedikit masalah security sehingga prosesnya tidak bisa 100% otomatis. Kita harus mematikan Nginx dulu sementara `certbot` membuat sertifikat SSL. 

```
nginx -s stop
```

Selanjutnya, kita jalankan certbot

```
certbot certonly --standalone -d app1.artivisi.id
```

Ulangi perintah di atas untuk masing-masing domain.

Hasilnya bisa kita lihat di `/etc/letsencrypt/live`.

```
ls -l /etc/letsencrypt/live/
total 16
drwxr-xr-x 2 root root 4096 Feb 12 09:35 app1.artivisi.id
drwxr-xr-x 2 root root 4096 Feb 12 09:36 app2.artivisi.id
drwxr-xr-x 2 root root 4096 Feb 12 09:38 app3.artivisi.id
drwxr-xr-x 2 root root 4096 Feb 12 09:43 wp.artivisi.id
```

Sebetulnya kita bisa membuat satu sertifikat untuk semua domain. Perintahnya digabungkan menjadi satu

```
certbot certonly --standalone -d app1.artivisi.id -d app2.artivisi.id -d app3.artivisi.id -d wp.artivisi.id
```

Akan tetapi, nanti hasilnya menjadi satu sertifikat gabungan. Saya lebih suka sertifikat masing-masing agar lebih fleksibel dalam pengelolaannya nanti.

### Konfigurasi HTTPS ###

Selanjutnya, kita akan mengkonfigurasi masing-masing domain. Berikut konfigurasi untuk `app1.artivisi.id`

```
server {
    server_name app1.artivisi.id;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/app1.artivisi.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app1.artivisi.id/privkey.pem;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/app1.artivisi.id/html;
    index index.php index.html;

    location / {
      try_files $uri $uri/ =404;
    }
}
server {
    if ($host = app1.artivisi.id) {
        return 301 https://$host$request_uri;
    }

  listen 80;
  listen [::]:80;

  server_name app1.artivisi.id;
  return 404;
}
```

Test dulu apakah konfigurasinya sudah oke. Setelah berjalan dengan baik, kita replikasi ke domain lainnya. Tinggal copy paste saja, dan edit nama domainnya.

[![HTTPS semua domain sudah oke]({{site.url}}/images/uploads/2018/msa-deployment/04-semua-app-https.png)]({{site.url}}/images/uploads/2018/msa-deployment/04-semua-app-https.png)

### Test SSL Labs ###

Setelah semua sertifikat terpasang sempurna, kita coba dengan layanan auditor konfigurasi SSL, yaitu [SSL Labs](https://www.ssllabs.com/ssltest/). Layanan ini akan memberi tahu kita kalau ada kekurangan dalam konfigurasi https kita.

Buka [websitenya](https://www.ssllabs.com/ssltest/) kemudian masukkan nama domain kita di sana.

[![SSL Labs Homepage]({{site.url}}/images/uploads/2018/msa-deployment/05-ssllabs-homepage.png)]({{site.url}}/images/uploads/2018/msa-deployment/05-ssllabs-homepage.png)

Setelah itu, kita biarkan dia bekerja

[![SSL Labs in progress]({{site.url}}/images/uploads/2018/msa-deployment/06-ssllabs-in-progress.png)]({{site.url}}/images/uploads/2018/msa-deployment/06-ssllabs-in-progress.png)

Berikut hasilnya, not bad at all :D

[![Hasil SSL Labs Test]({{site.url}}/images/uploads/2018/msa-deployment/07-hasil-ssllabs.png)]({{site.url}}/images/uploads/2018/msa-deployment/07-hasil-ssllabs.png)

## Penutup ##

Sampai di sini, kita telah berhasil melakukan:

* Pembuatan VPS / VM / Host yang akan menjalankan aplikasi
* Konfigurasi nama domain agar mengarah ke VPS
* Setup Virtual Host dengan Nginx, sehingga semua nama domain bisa dilayani
* Pembuatan sertifikat SSL gratis dengan LetsEncrypt dan Certbot
* Konfigurasi masing-masing domain sehingga bisa diakses secara aman melalui `https`

Pada [artikel selanjutnya]({{site.url}}/devops/deployment-microservice-kere-hore-2/), kita akan membuat aplikasi web sederhana dengan Spring Boot untuk dideploy ke VPS ini. Stay tuned ... 