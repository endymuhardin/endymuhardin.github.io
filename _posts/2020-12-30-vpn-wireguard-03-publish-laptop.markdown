---
layout: post
title: "VPN dengan Wireguard Bagian III : Expose Aplikasi di Laptop"
date: 2020-12-30 07:00
comments: true
categories:
- devops
---

Penggunaan VPN kali ini sangat bermanfaat bagi para programmer. Seringkali kita membuat aplikasi yang tentunya kita buat di laptop kita sendiri. Setelah kode program kita tulis, kita biasa jalankan aplikasinya di laptop kita dengan alamat `http://localhost` dan kita akses dari browser di laptop kita sendiri.

Akan tetapi, ada kalanya kita ingin mempresentasikan aplikasi kita tersebut untuk diakses oleh orang lain melalui internet. Atau kita ingin menyuruh orang lain mengakses aplikasi kita dari smartphone atau gadget lain yang menggunakan paket data. Karena browser/aplikasi yang mengakses aplikasi kita berjalan di perangkat yang berbeda, bahkan di jaringan yang berbeda juga (wifi rumah vs wifi kantor, wifi rumah vs paket data). Oleh karena itu kita tidak bisa menggunakan alamat `http://localhost` untuk mengaksesnya.

Solusinya adalah menghubungkan laptop kita ke VPN gateway yang memiliki IP public, kemudian membuat konfigurasi routing dan forwarding untuk meneruskan request ke port tertentu di gateway ke komputer kita di rumah.

Skema tersebut diilustrasikan seperti pada gambar berikut

[![VPN Expose Laptop]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-expose-laptop-app.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-expose-laptop-app.png)

Langkah-langkah implementasinya sebagai berikut:

<!--more-->

* TOC
{:toc}

## Konfigurasi VPN Gateway di Cloud Service ##

Pertama, kita butuh VPN gateway yang memiliki IP public. Kita bisa membuatnya dengan menggunakan VPS yang disediakan layanan cloud. Langkah instalasi dan konfigurasinya mirip dengan yang sudah kita bahas di artikel sebelumnya. Bedanya hanya di tambahan konfigurasi port forwardingnya.

Sebagai contoh, kita akan membuka port 8000 di VPN gateway dan meneruskan requestnya ke laptop kita. Jadi kalau VPN gatewaynya memiliki alamat IP publik `139.59.112.17`, maka aplikasi kita di laptop bisa diakses dengan alamat `http://139.59.112.17:8000`.

Konsep dan penjelasan tentang port forwarding ini bisa dibaca di artikel terdahulu tentang [Network Address Translation]({% post_url 2007-08-29-network-address-translation %})

Intinya adalah kita menambahkan rule di `iptables` untuk 

* mengubah tujuan paket (destination NAT - DNAT) yang tadinya ke IP public gateway menjadi ke IP private laptop kita sebelum gateway melakukan routing. Yang diubah kita batasi hanya yang mengarah ke port `8000` saja. Perintahnya sebagai berikut:

    ```
    iptables -t nat -A PREROUTING -d 139.59.112.17 -p tcp --dport 8000 -j DNAT --to-destination 10.100.100.22:8000
    ```

* setelah paket dirouting, sebelum dikirim ke laptop, alamat pengirim diubah (source NAT - SNAT) dari IP public perangkat yang mengirim menjadi alamat IP private gateway. Supaya laptop bisa mengirim response balik ke gateway. Perintahnya sebagai berikut:

    ```
    iptables -t nat -A POSTROUTING -p tcp --dport 8000 -j SNAT --to-source 10.100.100.11
    ```

Konfigurasi WireGuard untuk VPN gateway secara lengkapnya sebagai berikut

```
[Interface]
Address = 10.100.100.11/24
ListenPort = 51515
PrivateKey = mHDydqFCC7jcXgwn3TaMN718ekgaJmLOeQqgWxP5fUA=
PostUp = iptables -t nat -A PREROUTING -d 139.59.112.17 -p tcp --dport 8000 -j DNAT --to-destination 10.100.100.22:8000; iptables -t nat -A POSTROUTING -p tcp --dport 8000 -j SNAT --to-source 10.100.100.11
PostDown = iptables -t nat -D PREROUTING -d 139.59.112.17 -p tcp --dport 8000 -j DNAT --to-destination 10.100.100.22:8000; iptables -t nat -D POSTROUTING -p tcp --dport 8000 -j SNAT --to-source 10.100.100.11
```

Kemudian kita tambahkan setting `Peer` untuk laptop yang ingin dipublish port `8000` nya

```
[Peer]
PublicKey = YQJ8wfZ++ebVPlJas9iNmgk5zxyuA1Cav9Exo4CvSQQ=
AllowedIPs = 10.100.100.22/32
```

## Konfigurasi VPN di Laptop  ##

Di sisi laptop, konfigurasinya sebagai berikut 

```
[Interface]
PrivateKey = YJBfmlovRqQgDjj9zZ46+gMZaWR62QFLNkFOOhQRIEc=
Address = 10.100.100.22/24

[Peer]
PublicKey = FQcUiIzvvvQ2hHplCsUgR+RN4avDWi/ucF57LTvq11k=
AllowedIPs = 10.100.100.11/32
Endpoint = 139.59.112.17:51515
PersistentKeepalive = 25
```

Ada dua hal yang berbeda dengan konfigurasi internet gateway pada artikel sebelumnya, yaitu:

* `AllowedIPs` hanya diisi IP VPN di sisi gateway. Artinya koneksi internet tetap diarahkan melalui router wifi kita di rumah. Hanya paket yang menuju VPN gateway yang dikirim melalui interface WireGuard

* `PersistentKeepalive` adalah konfigurasi agar WireGuard di laptop mengirim data setiap 25 detik ke VPN gateway. Karena posisi laptop kita berada di balik router wifi rumah (istilahnya : _behind NAT proxy_), maka jalur datanya akan tertutup bila dia nganggur selama periode waktu tertentu. Kalau sudah tertutup, VPN gateway tidak bisa mengirim request lagi ke laptop kita. Dengan konfigurasi `PersistentKeepalive` ini, laptop kita akan mengirim data secara periodik untuk menjaga agar jalurnya tetap terbuka, sehingga request dari luar bisa tetap masuk menembus NAT router wifi kita.

## Pengetesan ##

Untuk mengetesnya, kita bisa menjalankan aplikasi web dengan sebaris perintah. Silahkan pilih metode yang disukai dari [gist ini](https://gist.github.com/willurd/5720255)

Kita sediakan dulu satu file html sederhana seperti ini

```html
<html>
  <head><title>Belajar Wireguard</title></head>
  <body><h1>Belajar Wireguard</h1></body>
</html>
```

Save dengan nama `index.html`

Kemudian, jalankan webserver di folder yang berisi file `index.html` tersebut

```
$ python -m SimpleHTTPServer 8000
Serving HTTP on 0.0.0.0 port 8000
```

Kita test dulu di laptop sendiri dengan cara browse ke [http://localhost:8000](http://localhost:8000)

[![Laptop Localhost]({{site.url}}/images/uploads/2020/vpn-wireguard/laptop-localhost.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/laptop-localhost.png)

Setelah itu kita nyalakan WireGuard, kemudian coba akses melalui IP public VPN gateway kita

[![VPN Expose Laptop]({{site.url}}/images/uploads/2020/vpn-wireguard/laptop-ip-public.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/laptop-ip-public.png)

## Bonus : SSL Termination ##

Selain menggunakan port forwarding dengan `iptables`, sebetulnya kita juga bisa menggunakan `Nginx` sebagai reverse proxy, dan memasang sertifikat SSL di situ. Cara setupnya bisa dibaca di artikel terdahulu tentang [Deployment Aplikasi Kere Hore Bagian 1]({% post_url 2018-02-12-deployment-microservice-kere-hore-1 %})

Bila kita sudah menggunaakn reverse proxy dengan `Nginx`, maka tidak perlu lagi memasang `DNAT` dan `SNAT` dengan `iptables`. 

Demikianlah cara setup VPN agar aplikasi di laptop kita bisa diakses dari internet. Semoga bermanfaat ... 