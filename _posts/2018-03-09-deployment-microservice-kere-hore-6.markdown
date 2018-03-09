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

Untuk melakukan SSL termination, kita perlu mendapatkan sertifikat SSL dulu. Caranya sama dengan yang sudah dibahas di [artikel sebelumnya]({{site.url}}/devops/letsencrypt-manual-dns/).

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
    redirect scheme https code 301 if !{ ssl_fc }
 
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
  server app1 localhost:10001 check

backend backend_app2
  server app2 localhost:10002 check

backend backend_app3
  server app3 localhost:10003 check
```

Konfigurasi di atas akan menghasilkan hasil akhir yang sama dengan konfigurasi Nginx kita di [artikel pertama]({{site.url}}/devops/deployment-microservice-kere-hore-1/).

Selamat mencoba ...