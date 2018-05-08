---
layout: post
title: "Deployment Microservice Kere Hore Bagian 6"
date: 2018-03-09 07:00
comments: true
categories:
- devops
---

Pada [artikel terdahulu]({{site.url}}/devops/deployment-microservice-kere-hore-1/), kita menggunakan Nginx sebagai reverse proxy. Semua request diterima Nginx dalam bentuk terenkripsi (SSL/TLS), didekripsi, kemudian diteruskan ke masing-masing backend.

Sebetulnya, selain Nginx masih banyak alternatif lain yang bisa dipakai sebagai reverse proxy, diantaranya:

* [HAProxy](http://www.haproxy.org/)
* dan yang paling senior, [Apache HTTPD](https://httpd.apache.org/docs/2.4/howto/reverse_proxy.html)

Selain reverse proxy biasa, jaman sekarang banyak juga yang menawarkan fitur-fitur lain seperti rate limiting, caching, logging, routing, authentication, dan sebagainya. Beberapa produk yang tersedia diantaranya:

* [Netflix Zuul](https://github.com/Netflix/zuul)
* [Traefik](https://traefik.io/)
* [Kong](https://getkong.org/)
* [Tyk](https://tyk.io/)
* [Envoy](https://www.envoyproxy.io/)

Pada artikel ini, kita akan bahas alternatif tradisional dulu, yaitu HAProxy. Seringkali kita hanya membutuhkan solusi sederhana, ringan, dan cepat. Tidak perlu aksesoris macam-macam.

HAProxy adalah aplikasi yang mengkhususkan diri menjadi reverse proxy. Dia bukan webserver seperti Nginx atau Apache HTTPD. Dengan demikian, ukurannya lebih kecil dan ringan. Dia juga memiliki mode `tcp` atau `Layer 4` buat aplikasi lain yang tidak menggunakan protokol `http`.

Kali ini, kita hanya akan menggunakan fitur berikut dari HAProxy:

* Reverse Proxy
* SSL Termination

<!--more-->

Tidak seperti Apache HTTPD dan Nginx, LetsEncrypt belum mendukung otomasi pengelolaan sertifikat SSL dengan HAProxy. Untuk itu, kita perlu melakukan sendiri konfigurasi dan otomasinya.

Berikut adalah skema proses permintaan dan perpanjangan sertifikat dengan menggunakan HAProxy.

[![Skema HAProxy]({{site.url}}/images/uploads/2018/msa-deployment/25-letsencrypt-haproxy.jpg)]

Kita meminta sertifikat SSL dari LetsEncrypt menggunakan aplikasi yang disebut `certbot`. Pada saat dijalankan, prosesnya yang terjadi kira-kira seperti ini:

1. Certbot menjalankan web server di port yang kita tentukan, misalnya port 8888.
2. Certbot mengirim request permintaan sertifikat ke server LetsEncrypt, misalnya untuk nama domain `app1.artivisi.id`. 
3. Server LetsEncrypt akan melakukan request ke `app1.artivisi.id` ke port 80 (untuk challenge `http-01`) atau port 443 (untuk challenge `tls-sni-01`). Port 80 dan 443 ini tidak bisa kita ubah, sudah wajib seperti itu dari LetsEncrypt. Url yang diminta adalah `.well-known/acme-challenge/random-string-disini/`. Jadi, LetsEncrypt akan melakukan http request ke `http://app1.artivisi.id/.well-known/acme-challenge/5ArBUB6d-r2lJaJ26NQFxG1zlkoR6GG5TD-Az11vcd8/`.
4. Kita konfigurasi HAProxy agar meneruskan request yang mengarah ke `/.well-known/acme-challenge/*` ke port `8888`. Di sana Certbot sudah menunggu dan menyediakan URL tersebut. Kita gunakan wildcard `*` supaya apapun random string yang digenerate kita tidak perlu mengubah konfigurasi lagi.

Konfigurasi untuk langkah `4` di HAProxy sebagai berikut

```
frontend http-in
    bind 0.0.0.0:80
    acl letsencrypt-acl path_beg /.well-known/acme-challenge/
    use_backend letsencrypt-backend if letsencrypt-acl 

backend letsencrypt-backend
  server letsencrypt localhost:8888
```

Setelah HAProxy dikonfigurasi seperti di atas, kita jalankan proses permintaan sertifikat dengan Certbot. Certbot akan menjalankan internal web server di port `8888`. Perintahnya sebagai berikut

```
certbot certonly --standalone --non-interactive --agree-tos --email endy@muhardin.com --http-01-port=8888 -d app.artivisi.id
```

Setelah sertifikat didapatkan, kita gabungkan `fullchain.pem` dan `privkey.pem` menjadi satu file, misalnya kita beri nama `haproxy.pem`

```
cd /etc/letsencrypt/live/app1.artivisi.id
cat fullchain.pem privkey.pem > haproxy.pem
```

Kita daftarkan semua sertifikat ke dalam satu file, misalnya kita beri nama `/etc/haproxy/daftar-sertifikat-ssl.txt`. Isinya seperti ini

```
/etc/letsencrypt/live/app1.artivisi.id/haproxy.pem app1.artivisi.id
/etc/letsencrypt/live/app2.artivisi.id/haproxy.pem app2.artivisi.id
/etc/letsencrypt/live/app3.artivisi.id/haproxy.pem app3.artivisi.id
```

Selanjutnya, kita tinggal pasang daftar file sertifikat tersebut dalam konfigurasi haproxy di file `/etc/haproxy/haproxy.cfg`. Isinya seperti ini

```
global
  log /dev/log local0
  log /dev/log local1 notice
  chroot /var/lib/haproxy
  stats socket /run/haproxy/admin.sock mode 660 level admin
  stats timeout 30s
  user  haproxy
  group haproxy
  daemon
  ssl-default-bind-options no-sslv3 no-tls-tickets
  ssl-default-bind-ciphers EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH
  tune.ssl.default-dh-param 2048

defaults
  log     global
  mode    http
  option  dontlognull
  timeout connect 5000
  timeout client  50000
  timeout server  50000

frontend http-in
    bind 0.0.0.0:80
    acl letsencrypt-acl path_beg /.well-known/acme-challenge/
    use_backend letsencrypt-backend if letsencrypt-acl 
 
frontend https-in
  bind 0.0.0.0:443 ssl crt-list /etc/haproxy/daftar-sertifikat-ssl.txt
  http-request set-header X-Forwarded-Proto https if { ssl_fc }
  http-response set-header Strict-Transport-Security "max-age=16000000; includeSubDomains; preload;"
  http-response set-header X-Frame-Options DENY
  http-response set-header X-Content-Type-Options nosniff
  option httplog
  use_backend backend_app1 if { ssl_fc_sni -i app1.artivisi.id }
  use_backend backend_app2 if { ssl_fc_sni -i app2.artivisi.id }
  use_backend backend_app3 if { ssl_fc_sni -i app3.artivisi.id }

backend backend_app1
  redirect scheme https code 301 if !{ ssl_fc }
  server app1 localhost:10001 check

backend backend_app2
  redirect scheme https code 301 if !{ ssl_fc }
  server app2 localhost:10002 check

backend backend_app3
  redirect scheme https code 301 if !{ ssl_fc }
  server app3 localhost:10003 check
```

Konfigurasi di atas akan menghasilkan hasil akhir yang sama dengan konfigurasi Nginx kita di [artikel pertama]({{site.url}}/devops/deployment-microservice-kere-hore-1/).

## Renewal ##

Sertifikat LetsEncrypt hanya berlaku 3 bulan. Untuk itu kita harus setup pembaruan (renewal) otomatis supaya tidak capek renew sertifikat setiap saat.

Berikut perintah untuk mengetes proses perpanjangan.

```
certbot renew --dry-run
```

Nantinya kita bisa hilangkan opsi `--dry-run` untuk menjalankan proses perpanjangan yang asli.

Untuk mengotomasi, kita bisa membuat script sederhana untuk melakukan perpanjangan, kemudian menggabungkan public key dan private key agar siap dipakai oleh HAProxy. Kita buatkan script `/opt/update-certs.sh` yang isinya seperti ini

```sh
#!/usr/bin/env bash

# lakukan renewal
certbot renew

# gabungkan script
bash -c "cat /etc/letsencrypt/live/app1.artivisi.id/fullchain.pem /etc/letsencrypt/live/app1.artivisi.id/privkey.pem > /etc/letsencrypt/live/app1.artivisi.id/haproxy.pem"

# restart haproxy
service haproxy restart
```

Terakhir, kita daftarkan script tersebut supaya dijalankan sebulan sekali. Berikut konfigurasi cron

```
0 0 1 * * root bash /opt/update-certs.sh
```

Selamat mencoba ...

## Referensi ##

* [https://serversforhackers.com/c/letsencrypt-with-haproxy](https://serversforhackers.com/c/letsencrypt-with-haproxy)
* [https://gist.github.com/thisismitch/7c91e9b2b63f837a0c4b](https://gist.github.com/thisismitch/7c91e9b2b63f837a0c4b)
* [https://skarlso.github.io/2017/02/15/how-to-https-with-hugo-letsencrypt-haproxy/](https://skarlso.github.io/2017/02/15/how-to-https-with-hugo-letsencrypt-haproxy/)
* [https://ops.tips/blog/tls-certificates-haproxy-letsencrypt/](https://ops.tips/blog/tls-certificates-haproxy-letsencrypt/)
* [https://fly.io/articles/load-balancing-https-with-lets-encrypt/](https://fly.io/articles/load-balancing-https-with-lets-encrypt/)
* [https://blog.georgejose.com/moving-my-http-website-to-https-using-letsencrypt-haproxy-and-docker-deb56ff6be9b](https://blog.georgejose.com/moving-my-http-website-to-https-using-letsencrypt-haproxy-and-docker-deb56ff6be9b)
* [https://poweruphosting.com/blog/secure-certbot-haproxy/](https://poweruphosting.com/blog/secure-certbot-haproxy/)