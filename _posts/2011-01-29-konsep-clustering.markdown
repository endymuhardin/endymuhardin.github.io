---
comments: true
date: 2011-01-29 21:15:14
layout: post
slug: konsep-clustering
title: Konsep Clustering
wordpress_id: 654
categories:
- aplikasi
---

Di milis JUG, lagi-lagi ada yang tanya tentang load balancing, failover, dan clustering. Jawabannya masih sama sejak 10 tahun saya berkecimpung di urusan coding-mengcoding. Jadi, baiklah saya tulis di blog saja, supaya next time bisa jadi referensi. 

Ini sebetulnya dua hal yang berbeda. 
Load balancing ya membagi beban. 
Failover ya mencegah single point of failure. 

### Load Balancing ###

Load balancer terdiri dari satu balancer dan banyak worker. 
Bebannya dibagi2 ke semua worker dengan algoritma yang biasanya bisa dipilih. 
Bisa merata (round robin) bisa juga dengan bobot (weighted), misalnya worker X mendapat 2 kali worker Y karena dia specnya lebih tinggi.
Atau bisa juga dynamic, artinya si LB akan mengetes kondisi semua worker, mana yang kira2 sedang idle itu yang dikasi. 
Mana yang sedang idle ini nanti ada lagi settingnya, apakah melihat CPU usage pakai SNMP, melihat ping response time, whatever. 

Failover minimal harus ada 2 titik. 
Kalo kita implement LB aja, point of failure (POF) nya adalah si LB. 
Begitu LB nya mati, ya udah semua worker gak bisa diakses. 
Untuk mencegah ini, LB nya harus ada 2, satu aktif satu standby (pasif).

Contoh aplikasi load balancer : 

* HAProxy
* ldirectord (Ultra Monkey)
* Pound

Contoh aplikasi lain yang bisa jadi load balancer : 
	
* Apache (mod_proxy_balancer)
* Nginx
* lighttpd
* bind (DNS Server)

### Failover ###

Contoh aplikasi failover : 

* [heartbeat](http://www.linux-ha.org/wiki/Heartbeat)
* [pacemaker](http://clusterlabs.org/wiki/Main_Page)
* [corosync](http://corosync.github.io/corosync/)
* [ucarp](http://www.pureftpd.org/project/ucarp)
* [keepalived](http://www.keepalived.org/)

Failover artinya mengatasi kalau ada service yang mati. Ada dua jenis aplikasi untuk menangani failover :

* Network Oriented : keepalived, ucarp
* Cluster Oriented : corosync, heartbeat

Penjelasan lengkapnya bisa dibaca [di sini](http://www.formilux.org/archives/haproxy/1003/3259.html). Namun ringkasnya seperti ini:

Network oriented failover memastikan **minimal satu** service aktif, dan **tidak apa-apa** bila ada lebih dari satu service yang aktif. Ini cocok untuk dipasang di load balancer, karena load balancer tidak menyimpan state. Tidak masalah kalau user melihat ada dua LB, kadang diarahkan ke LB-1 dan kadang ke LB-2.

Cluster oriented failover memastikan **hanya satu** service yang aktif, dan **tidak apa-apa** bila tidak ada service yang aktif. Ini cocok untuk dipasang di database server, karena kita tidak mau database utama dan cadangan dua-duanya aktif. Bisa-bisa datanya tidak tersimpan dengan benar ([split brain](http://en.wikipedia.org/wiki/Split-brain_(computing\))). Untuk lebih jelas tentang cara kerja cluster-oriented failover, bisa dibaca [di sini](http://blog.clusterlabs.org/blog/2010/pacemaker-heartbeat-corosync-wtf/).

Nah, mudah2an sampe di sini jelas bahwa load balancing dan failover itu dua hal yang tidak saling terkait (orthogonal) dan biasanya dikombinasikan untuk mendapatkan konfigurasi yang robust dan performant. 


>
>> 
Setahu saya konsep2x Clustering diatas berlaku pada saat hit pertama.
Pertanyaan saya.. Bagaimana jika request sudah terlayani tetapi ditengah-tengah proses server tiba2x down.. Apakah proses tersebut langsung di alihkan ke server yang lagi up? Jika iya apakah proses akan di restart dari awal atau server yang sedang up bisa melanjutkan sisa dari proses yang belum dikerjakan di server yang telah down?

> 
> 

### Sticky Session ###

Tidak selalu, tergantung konfigurasinya. 
Ada konfigurasi sticky session. 
Artinya, pada hit pertama, si user akan diberikan penanda, biasanya berbentuk cookie. 
Pada hit berikutnya, LB akan melihat cookienya, dan mengarahkan ke server yang sebelumnya sudah mengurus si user ini. 

Ada juga konfigurasi non-sticky. 
Artinya tiap hit dianggap hit baru, dan didistribusikan ke semua server sesuai algoritma yang dipilih, round robin, weighted, atau dynamic, sesuai penjelasan di atas. 

Mau pilih yang mana? Ya tergantung kemampuan LB nya. 
Ada yang bisa 2-2 nya sehingga bisa pilih, dan ada juga yang rada stupid sehingga terpaksa pakai non-sticky. 
Istilahnya, LBnya layer berapa? Kalo layer 7 biasanya bisa sticky, kalo layer 4 ya gak bisa. 
Lebih jauh tentang urusan layer-layeran ini bisa dibaca [di sini](http://blog.loadbalancer.org/why-layer-7-sucks/) dan [di sini](http://1wt.eu/articles/2006_lb/) 

Nah, apa impact sticky vs non-sticky? 
Ini pengaruhnya ke session data. 
Session data adalah data sementara masing-masing user. 
Karena sifatnya sementara, maka biasanya tidak disimpan secara persistent di tabel database. 
Contoh paling klasik adalah isi shopping cart. 
Itu barang belum diorder, tapi sudah dipilih, sehingga biasanya belum disimpan di database. 

Kalo pake non-sticky, si user pertama milih barang di server X. 
Pada saat dia pilih barang kedua, dilayani server Y. 
Karena pilihan pertama ada di server X, ya pas dia pilih barang kedua, cuma tercatat 1 barang padahal harusnya 2. 

Ini tidak terjadi kalo kita pakai sticky balancer. 
Request kedua dan seterusnya akan diarahkan ke server X lagi. 

Jadi, sticky atau non-sticky itu impactnya ke temporary data user, sering disebut dengan istilah session data atau user state.

Nah, setelah jelas apa dampaknya sticky vs non-sticky, mari kita lanjut ke pertanyaan selanjutnya. 


>
>> 
Kalau untuk Java EE Application Server apakah untuk pertanyaan saya di atas sudah ada featurenya atau perlu ada tambahan produk lagi untuk bisa sharing informasi terhadap state suatu proses yang dijalankan di satu server sehingga jika server tersebut down proses bisa dilanjutkan di server yang lain tanpa merestart proses?

> 
> 

### Session Replication ###

Mengenai urusan session/state management, ini sangat tergantung merek application server yang digunakan. 
Secara umum, settingan standar appserver biasanya simpan data session di memori. 
Kalau kita enable cluster, misalnya terdiri dari 4 worker, maka data session ini biasanya akan direplikasi ke satu worker lain. 
Pada saat worker utama mati, request berikutnya akan diarahkan ke worker cadangannya, sehingga user gak kehilangan data belanjaan. 
Biasanya, satu state itu disimpan ke 2 worker saja, bukan direplikasi ke semua untuk alasan efisiensi bandwidth. 

Pada penjelasan di atas banyak sekali saya gunakan kata 'biasanya'. Ini karena kapabilitas dan konfigurasi masing-masing merek appserver sangat berbeda sehingga sulit untuk menggeneralisir kondisinya. 

Lalu bagaimana? 
Saya biasanya mengambil pendekatan yang universal, yang jalan di semua appserver, sehingga tidak perlu pusing menghafal appserver apa bisa apa settingnya gimana. 
Teknik universalnya sederhana: aplikasi webnya dibuat stateless. 
Jangan ada simpan data di memori. Simpan semua di database, atau di distributed cache (misalnya memcached). 

Di Java, data yang ada di memori antara lain : session variable, static variable, context variable. 
Di PHP, CMIIW cuma session dan global variable aja. 
 
Karena selama ini saya menggunakan teknik ini, jadi saya kurang up to date terhadap appserver apa bisa apa settingnya gimana. 
Demikian juga tentang load balancer apa support sticky atau tidak, saya tidak pernah memikirkannya. 
Pokoknya simpan state di distributed cache atau database, setelah itu mau pakai appserver Tomcat, Jetty, Glassfish, Weblogic, terserah. 
Mau pakai load balancer Apache HTTPD, Nginx, lighty, HAProxy, Pound, Ultramonkey, juga terserah. 


Demikian sekilas sharing mengenai load balancing dan clustering. Semoga menjadi cerah. 

