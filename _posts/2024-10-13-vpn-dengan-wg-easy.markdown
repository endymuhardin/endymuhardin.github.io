---
layout: post
title: "VPN dengan Wireguard Bagian VI : Setup VPN Server dengan wg-easy"
date: 2024-10-13 07:00
comments: true
categories:
- devops
---

Setup VPN Server dengan easy-wg

Beberapa waktu yang lalu, saya sudah pernah menulis tentang aplikasi VPN bernama Wireguard secara komprehensif. Total ada 5 artikel, yaitu :

* [Pengenalan Wireguard]({% post_url 2020-12-25-vpn-wireguard-01-intro %})
* [Membuat Internet Proxy]({% post_url 2020-12-28-vpn-wireguard-02-internet-proxy %})
* [Mengekspos aplikasi di laptop ke public IP]({% post_url 2020-12-30-vpn-wireguard-03-publish-laptop %})
* [Setup Road Warrior - Pekerja remote tapi ingin mengakses LAN kantor]({% post_url 2021-01-01-vpn-wireguard-04-roadwarrior %})
* [Menghubungkan Server di Cloud ke Server On-Premise]({% post_url 2021-01-03-vpn-wireguard-05-cloud-to-onpremise %})

Seiring dengan perkembangan zaman, saat ini setup Wireguard semakin mudah. Setidaknya untuk skenario seperti di artikel nomor 2 di atas, sudah banyak aplikasi yang memudahkan. Salah satu yang cukup mudah digunakan adalah [wg-easy](https://github.com/wg-easy/wg-easy). Dia menggunakan pendekatan Docker, sehingga kita tidak perlu repot melakukan setting server. Tinggal run saja docker imagenya.

Berikut adalah cara setup untuk menjalankan wg-easy yang dilengkapi dengan Nginx Front Proxy dengan sertifikat SSL dari Letsencrypt.

<!--more-->

Pertama, kita buat dulu file `docker-compose.yml` sebagai berikut


```yml
services:
  wg-easy:
    environment:
      - LANG=en
      - WG_HOST=vpn.artivisi.id
      - PASSWORD_HASH=$$2y$$10$$hBCoykrB95WSzuV4fafBzOHWKu9sbyVa34GJr8VV5R/pIelfEMYyG

    image: ghcr.io/wg-easy/wg-easy
    container_name: wg-easy
    volumes:
      - ~/.wg-easy:/etc/wireguard
    ports:
      - "51820:51820/udp"
    restart: unless-stopped
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1

  nginx:
    image: weejewel/nginx-with-certbot
    container_name: nginx
    hostname: nginx
    volumes:
      - ~/.nginx/servers/:/etc/nginx/servers/
      - ./.nginx/letsencrypt/:/etc/letsencrypt/
    ports:
      - "80:80/tcp"
      - "443:443/tcp"
    restart: unless-stopped
```

Untuk konfigurasi Nginx, kita perlu membuat file yang isinya seperti ini

```
server {
    server_name vpn.artivisi.id;

    location / {
        proxy_pass http://wg-easy:51821/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

Nama filenya bebas saja, saya beri nama `vpn.artivisi.id.conf`.

Selanjutnya, kita siapkan VPS. Saya biasanya [menggunakan Digital Ocean](https://m.do.co/c/910ad80271f7). Untuk VPN server, kita cukup menggunakan droplet termurah. 

Setelah dropletnya siap, kita masukkan dua file di atas ke lokasi berikut:

* `/root/docker-compose.yml`
* `/root/.nginx/server/vpn.artivisi.id.conf`

Silahkan sesuaikan lokasinya jika tidak ingin menggunakan user `root`. Di DigitalOcean secara default kita dibuatkan user `root`. Jadi saya gunakan itu saja.

Berikutnya, kita instal `Docker`. Cara instalasi yang lengkap bisa [dibaca di websitenya](https://docs.docker.com/engine/install/ubuntu/). Kita akan menggunakan cara cepat saja, sebagai berikut

```
curl -sSL https://get.docker.com | sh
```

Selanjutnya, kita bisa jalankan docker compose dengan perintah berikut di dalam folder tempat file `docker-compose.yml` berada.

```
docker compose up -d
```

Cek apakah containernya sudah berjalan

```
docker ps -a
```

Outputnya seharusnya menampilkan ada dua container yang berjalan seperti ini

```
CONTAINER ID   IMAGE                         COMMAND                  CREATED          STATUS                    PORTS                                                                      NAMES
1de5d9918e43   weejewel/nginx-with-certbot   "/docker-entrypoint.…"   44 minutes ago   Up 44 minutes             0.0.0.0:80->80/tcp, :::80->80/tcp, 0.0.0.0:443->443/tcp, :::443->443/tcp   nginx
e6f12e482af6   ghcr.io/wg-easy/wg-easy       "docker-entrypoint.s…"   44 minutes ago   Up 44 minutes (healthy)   0.0.0.0:51820->51820/udp, :::51820->51820/udp                              wg-easy
```

Berikutnya, kita akan menyiapkan sertifikat SSL dengan Letsencrypt. Login ke container nginx dengan perintah berikut

```
docker exec -it nginx /bin/sh
```

Setelah kita berada di dalam container `nginx`, kita setup virtualhost `vpn.artivisi.id` seperti di file konfigurasi.

```
cp /etc/nginx/servers/vpn.artivisi.id.conf /etc/nginx/conf.d/.
```

Selanjutnya, kita inisialisasi sertifikat SSL. Sebelum menjalankan perintah ini, pastikan bahwa setting DNS kita sudah mengarahkan hostname `vpn.artivisi.id` ke alamat IP VPS kita. Setelah itu siap, barulah kita bisa membuat sertifikat dengan perintah berikut

```
certbot --nginx --non-interactive --agree-tos -m webmaster@yopmail.com -d vpn.artivisi.id
```

Jangan lupa menyesuaikan nama domain dan email administrator pada perintah di atas.

Terakhir, kita restart `nginx`nya

```
nginx -s reload
```

Selesai. Kita bisa langsung buka urlnya, dan mendapatkan login screen

[![Contact Endy]({{site.url}}/images/uploads/2024/vpn-dengan-wg-easy/wg-easy-login.png)]({{site.url}}/images/uploads/2024/vpn-dengan-wg-easy/wg-easy-login.png)

Setelah login, kita bisa membuat client baru dan melihat aktifitas client yang sedang aktif

[![Contact Endy]({{site.url}}/images/uploads/2024/vpn-dengan-wg-easy/wg-easy-list.png)]({{site.url}}/images/uploads/2024/vpn-dengan-wg-easy/wg-easy-list.png)

Demikianlah artikel tentang cara setup VPN server. Semoga bermanfaat.