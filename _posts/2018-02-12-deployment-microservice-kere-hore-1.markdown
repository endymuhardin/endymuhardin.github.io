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
snap install core
snap refresh core
snap install --classic certbot
```
Setelah terinstal, kita tinggal menjalankan `certbot`. Dia akan otomatis membaca konfigurasi virtualhost kita di Nginx, dan menawarkan untuk membuatkan sertifikat SSL untuk tiap domain.

```
certbot --nginx
```

Dia akan menanyakan beberapa pertanyaan, seperti ini:

```
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx
Enter email address (used for urgent renewal and security notices) (Enter 'c' to
cancel): it@tazkia.ac.id

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Please read the Terms of Service at
https://letsencrypt.org/documents/LE-SA-v1.2-November-15-2017.pdf. You must
agree in order to register with the ACME server at
https://acme-v02.api.letsencrypt.org/directory
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(A)gree/(C)ancel: a

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Would you be willing to share your email address with the Electronic Frontier
Foundation, a founding partner of the Let's Encrypt project and the non-profit
organization that develops Certbot? We'd like to send you email about our work
encrypting the web, EFF news, campaigns, and ways to support digital freedom.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
(Y)es/(N)o: n

Which names would you like to activate HTTPS for?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: app1.artivisi.id
2: app2.artivisi.id
3: app3.artivisi.id
4: wp.artivisi.id
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel): 1
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for app1.artivisi.id
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/app1.artivisi.id

Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/app1.artivisi.id

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://app1.artivisi.id

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=app1.artivisi.id
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/app1.artivisi.id/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/app1.artivisi.id/privkey.pem
   Your cert will expire on 2019-11-03. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the "certonly" option. To non-interactively renew *all* of
   your certificates, run "certbot renew"
 - Your account credentials have been saved in your Certbot
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Certbot so
   making regular backups of this folder is ideal.
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

Hasilnya bisa kita lihat di `/etc/letsencrypt/live`.

```
ls -l /etc/letsencrypt/live/
total 16
drwxr-xr-x 2 root root 4096 Feb 12 09:35 app1.artivisi.id
drwxr-xr-x 2 root root 4096 Feb 12 09:36 app2.artivisi.id
drwxr-xr-x 2 root root 4096 Feb 12 09:38 app3.artivisi.id
drwxr-xr-x 2 root root 4096 Feb 12 09:43 wp.artivisi.id
```

Certbot ini juga menginstal script untuk melakukan perpanjangan secara otomatis. Scriptnya ada di dalam folder `/etc/cron.d`. Dia akan mengecek apakah ada sertifikat yang mau expire. Kalau ada, maka akan dilakukan perpanjangan otomatis.

### Konfigurasi HTTPS ###

Bila kita memilih opsi 2 pada waktu menjalankan certbot seperti di atas, dia akan menambahkan konfigurasi secara otomatis. Kita tidak perlu lagi mengedit sendiri. Hasilnya seperti ini:

```
server {

  root /var/www/app1.artivisi.id/html;
  index index.html index.htm index.nginx-debian.html;

  server_name app1.artivisi.id;

  location / {
    try_files $uri $uri/ =404;
  }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/app1.artivisi.id/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/app1.artivisi.id/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = app1.artivisi.id) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  listen 80;
  listen [::]:80;

  server_name app1.artivisi.id;
    return 404; # managed by Certbot
}
```

Test dulu apakah konfigurasinya sudah oke. Setelah berjalan dengan baik, kita test juga ke domain lainnya. Tinggal copy paste saja, dan edit nama domainnya.

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