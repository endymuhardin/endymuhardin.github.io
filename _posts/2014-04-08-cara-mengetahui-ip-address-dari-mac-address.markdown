---
layout: post
title: "Cara Mengetahui IP Address dari MAC Address"
date: 2014-04-08 11:59
comments: true
categories: 
- linux
---



Jaman sekarang banyak sekali perangkat-perangkat aneh yang menarik untuk dioprek, misalnya [Raspberry PI](http://en.wikipedia.org/wiki/Raspberry_Pi), [PC on a stick](http://en.wikipedia.org/wiki/PC-on-a-stick), Smart TV, [Harddisk NAS](http://www.wd.com/en/products/products.aspx?id=280), dan sebagainya. Semua perangkat aneh ini terhubung ke jaringan baik melalui kabel maupun WiFi.

Di mayoritas jaringan WiFi yang ada, alamat IP diberikan secara otomatis (DHCP), sehingga kita tidak tahu berapa alamat IP untuk perangkat yang ingin kita akses. Tambahan lagi, beberapa router wifi juga kurang bagus antarmukanya seperti pada gambar berikut

![Foto](https://lh5.googleusercontent.com/-nZMqJy94dy8/U0OD8iwCKAI/AAAAAAAAFjg/sxw8F4pe2XI/w917-h429-no/bolt-dhcp-client-list.png)

Masa yang dicantumkan cuma MAC Address saja? Hostnamenya juga `Unknown` lagi -_-

Untungnya, ada cara untuk mengkonversi MAC Address menjadi IP. Berikut caranya

<!--more-->

Pertama, kita gunakan aplikasi `nmap` untuk mencari daftar alamat IP yang sedang aktif di jaringan kita.

Jalankan perintah berikut
```
nmap -nsP 192.168.1.0/24
```

Berikut penjelasan opsi yang kita gunakan:

* n  : jangan cari nama host melalui DNS. Cukup IP Address saja
* sP : ping scan. Cari IP mana yang aktif dengan ping. Di versi terbaru opsi `sP` ini diganti namanya menjadi `sn`
* `192.168.1.0/24` : network address dan subnet tempat kita berada

Outputnya seperti ini

```
Starting Nmap 6.40 ( http://nmap.org ) at 2014-04-08 11:21 WIB
Nmap scan report for 192.168.1.1
Host is up (0.0031s latency).
MAC Address: XX:XX:XX:XX:XX:XX (zte)

Nmap scan report for 192.168.1.2
Host is up (0.0031s latency).
MAC Address: XX:XX:XX:XX:XX:XX (zte)

Nmap scan report for 192.168.1.103
Host is up (0.014s latency).
MAC Address: XX:XX:XX:XX:XX:XX (Samsung Electro-mechanics CO.)

Nmap scan report for 192.168.1.107
Host is up (0.015s latency).
MAC Address: XX:XX:XX:XX:XX:XX (Samsung Electronics Co.)

Nmap scan report for 192.168.1.144
Host is up (0.019s latency).
MAC Address: XX:XX:XX:XX:XX:XX (Unknown)

Nmap scan report for 192.168.1.149
Host is up (0.059s latency).
MAC Address: XX:XX:XX:XX:XX:XX (Samsung Electronics Co.)

Nmap scan report for 192.168.1.115
Host is up.
Nmap done: 256 IP addresses (7 hosts up) scanned in 3.09 seconds
```

Dari output di atas, kita mendapatkan informasi yang cukup banyak, yaitu:

* Alamat IP
* Mac Address
* Vendor pembuat hardware

Kita tinggal bandingkan dengan MAC Address perangkat yang kita ingin cari, korelasikan dengan output di atas, dan kita bisa mendapatkan IPnya. Kita bisa mempersempit pencarian dengan mengeliminasi berdasarkan nama vendor pembuatnya.
