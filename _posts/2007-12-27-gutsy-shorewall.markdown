---
comments: true
date: 2007-12-27 16:51:27
layout: post
slug: gutsy-shorewall
title: Konfigurasi Shorewall di Ubuntu Gutsy
wordpress_id: 321
categories:
- aplikasi
- linux
---

Bila kita ingin mempublish komputer di internet, hal pertama yang kita pikirkan adalah firewall. Bagaimana membatasi akses hanya ke port-port yang kita ijinkan. 

Di Linux, firewall diimplementasikan dengan menggunakan aplikasi iptables. Aplikasi ini sangat powerful dan canggih. Menurut Peter Parker, with great power comes great responsibility. Akan tetapi, menurut saya, with great power comes great complexity. Untuk bisa mengoperasikan iptables dengan benar, setidaknya kita harus memahami konsep chain dan table. Setelah itu, baru kita bisa belajar tentang jenis-jenis protokol, state, port, dan hal-hal TCP/IP lainnya. 

Menjelaskan konsep ini saja butuh waktu setidaknya setengah hari pada rata-rata orang yang sudah memahami konsep dasar jaringan komputer. Daripada saya bolak-balik menjelaskan konsep chain dan table, baiklah kita cari saja aplikasi front end yang sederhana. 

Untungnya di Ubuntu tidak kekurangan aplikasi front end untuk iptables. Untuk komputer personal, kita bisa gunakan [Firestarter](http://www.fs-security.com/). Aplikasi ini sangat mudah digunakan. Tinggal jalankan wizardnya, dan dia akan segera mendeteksi segala perangkat jaringan yang kita miliki. Beri tahu Firestarter mana perangkat yang terhubung ke internet, dan mana perangkat yang terhubung ke jaringan lokal. Kemudian tentukan layanan atau port berapa yang ingin kita buka. Selesai sudah. Begitu mudah.

Selain Firestarter, kita juga bisa menggunakan [GuardDog](http://www.simonzone.com/software/guarddog/).

Sayangnya, kali ini saya ingin menginstal di server. Firestarter walaupun ampuh tapi kurang sesuai, karena dia berbasis GUI. Harus install Gnome dulu, kemudian kalau mau setting harus menggunakan X tunneling agar Firestarter bisa tampil di komputer yang me-remote. 

Setelah tanya kanan kiri, [Bos Ari](http://linux2.arinet.org) memberikan petuah agar sebaiknya saya pakai [Shorewall](http://www.shorewall.net/) saja. Selain Shorewall, masih ada beberapa alternatif, seperti [Arno's Firewall](http://rocky.molphys.leidenuniv.nl/) yang direkomendasikan [Anton](http://www.antonraharja.web.id). Tapi melihat sekilas dari tutorialnya, nampaknya Shorewall adalah yang paling intuitif untuk digunakan. 

Baiklah, mari kita install dan konfigurasi Shorewall. Sebagai gambaran, komputer yang ingin saya bentengi cuma memiliki satu kartu jaringan yang langsung terhubung ke internet. Saya ingin membuka layanan SSH di port 22 dan HTTP di port 80. 


Langkah pertama tentunya adalah menginstal Shorewall. Di Ubuntu tidak sulit, langsung saja


``` 
sudo apt-get install shorewall 
```



Shorewall akan segera terinstal, tapi tidak aktif. Kita harus mengkonfigurasi dulu, baru kemudian mengaktifkannya.

Konfigurasi Shorewall ada di folder `/etc/shorewall`. 

Setelah Shorewall terinstal, pertama kita tentukan dulu jaringan yang terhubung ke komputer kita. Untuk kasus saya tidak sulit, cuma ada satu jaringan terhubung ke eth0. 

Jaringan komputer, dalam dunia Shorewall disebut dengan istilah zone. Konfigurasinya ditulis di file bernama `zones`. Karena kita cuma punya satu jaringan, yaitu internet, berikut adalah isi file tersebut. 

    
```
fw	firewall
net	ipv4
```



Shorewall ingin menaruh dirinya sendiri ke dalam zone terpisah. Oleh karena itu kita punya dua zone di file tersebut, yaitu net dan fw. `ipv4` adalah jenis zone. Ada tiga jenis zone dalam shorewall, yaitu ipv4, firewall, dan ipsec. Bila kita menggunakan koneksi terenkripsi, kita bisa menggunakan opsi ipsec. 

Zone dan device dihubungkan di file yang namanya `interfaces`. Isinya adalah sebagai berikut


    
```
net     eth0            detect          tcpflags,logmartians,nosmurfs,norfc1918
```



Kolom pertama menyatakan bahwa zone `net` dilayani oleh kartu jaringan `eth0` yang disebutkan di kolom kedua. Selain kartu jaringan, kita juga bisa mendaftarkan perangkat lain seperti modem. 

Kolom ketiga adalah konfigurasi broadcast. Satu perangkat jaringan bisa saja memiliki banyak IP address, atau terhubung dengan koneksi peer to peer. Dengan demikian satu perangkat bisa memiliki banyak alamat broadcast. Untuk memudahkan konfigurasi, kita bisa suruh Shorewall mencari alamat broadcast yang sesuai. Inilah arti dari konfigurasi `detect`.

Kolom terakhir paling kanan memuat opsi. Banyak opsi yang disediakan, saya cuma jelaskan opsi yang digunakan di atas saja. 

  * tcpflags : ini memeriksa paket-paket yang memiliki kombinasi flags tidak lazim.
  * logmartians : ini artinya kita akan mencatat paket yang alamat asalnya aneh.
  * nosmurfs : ini mengatasi paket yang alamat asalnya sama dengan alamat broadcast.
  * norfc1918 : ini artinya kita akan mengabaikan semua paket dari dan menuju alamat private yang disebutkan di RFC 1918. Contoh alamat private antara lain adalah 192.168.0.1

Setelah selesai dengan zone dan interface, kita menentukan kebijakan global atau policy. Kebijakan ini berlaku apabila tidak ada aturan yang spesifik terhadap suatu paket. Biasanya, kebijakan global yang kita gunakan adalah: 

  * mesin kita ini boleh menghubungi siapa saja. Semua paket keluar diijinkan (ACCEPT)
  * paket yang berasal dari luar menuju firewall akan diabaikan (DROP)
  * paket yang berasal dari luar menuju komputer dibalik firewall akan diabaikan (DROP)
  * selain itu, tolak semua (REJECT)

Konfigurasi kebijakan di atas ditulis di file bernama `policy`. Berikut isinya

    
```
#SOURCE		DEST		POLICY		LOG LEVEL	LIMIT:BURST
$FW		net		ACCEPT
net		$FW		DROP		info
net		all		DROP		info
# The FOLLOWING POLICY MUST BE LAST
all		all		REJECT		info
#LAST LINE -- ADD YOUR ENTRIES ABOVE THIS LINE -- DO NOT REMOVE
```



Terakhir, baru kita buat pengecualian terhadap kebijakan di atas. Seperti disebutkan di awal artikel, saya ingin membuka akses untuk web server di port 80 dan ssh server di port 22. Sebagai tambahan pengamanan untuk mencegah flooding, kita juga akan menolak paket ping yang masuk. Tapi kita ingin tetap bisa ping keluar.

Shorewall sudah punya konfigurasi standar (disebut dengan istilah macro) untuk aplikasi server yang umum digunakan. Kita tulis aturan ini di file `rules`. Berikut isinya


    
```
Ping/REJECT	net		$FW

# Permit all ICMP traffic FROM the firewall TO the net zone
ACCEPT		$FW		net		icmp

# Open SSH Service
SSH/ACCEPT	net		$FW

# Open Web Server
Web/ACCEPT	net		$FW
```



`Ping/REJECT`, `SSH/ACCEPT` dan `Web/ACCEPT` di atas adalah macro. Sebetulnya kita juga bisa membuka akses webserver di port 80 tanpa macro dengan konfigurasi seperti ini


    
```
ACCEPT    net       $FW             tcp  80
```



Tapi biasanya ada beberapa layanan yang membuka beberapa port sekaligus, misalnya FTP. Daripada harus menghafalkan port berapa saja yang harus dibuka untuk FTP, akan lebih mudah kalau kita gunakan macro `FTP/ACCEPT`

Selanjutnya, kita edit file shorewall.conf. Ini adalah konfigurasi global. Isi konfigurasi yang disediakan Ubuntu Gutsy sudah cukup bagus. Saya cuma mengubah baris ini

`STARTUP_ENABLED=No`

menjadi 

`STARTUP_ENABLED=Yes`

Selain itu, juga ada satu file lagi, yaitu `/etc/default/shorewall`. Ganti baris

`startup=0`

menjadi

`startup=1`

Semuanya sudah siap. Silahkan nyalakan firewall Anda.


    
```
sudo /etc/init.d/shorewall start
```



Oh iya, berhati-hatilah kalau menginstal shorewall secara remote. Salah konfigurasi bisa menyebabkan kita terkunci di luar. 
