---
comments: true
date: 2008-07-19 07:21:26
layout: post
slug: menggunakan-log4j
title: Menggunakan Log4J
wordpress_id: 337
categories:
- java
---

Menggunakan log4j

Pada waktu SMU dulu, saya dan teman-teman saya membentuk grup band. Sebagai band amatiran, kami hanya tampil kalau ada pentas seni di sekolah, atau kalau ada acara tujuh-belasan di lapangan dekat rumah. Yang ingin tampil di event tersebut tidak hanya band kami, tapi juga puluhan band amatir lainnya. Karena demand jauh melebihi supply, seringkali kami justru harus membayar uang pendaftaran agar bisa tampil. 

Sama dengan band remaja pada umumnya, kami punya impian menjadi rock-star. Tidak usah mengeluarkan album dulu lah ... setidaknya kami dibayar setiap kali tampil. Bukannya malah membayar. 

Suatu ketika, pemain bas kami mengajak kami berkenalan dengan salah satu sepupunya yang juga punya band. Tidak seperti kami yang amatiran, band sepupu ini lebih profesional. Mereka sudah punya slot tampil rutin di beberapa kafe, yang tentu saja ... dibayar :D

Setelah ngobrol kesana-sini, akhirnya kami diajak untuk datang ke kafe dan menonton penampilan mereka. 

Sesampainya di lokasi, terlihat jelas perbedaan level antara kami dan mereka. Band kami, sebelum tampil, semua anggotanya deg-degan dan gugup. Topik pembicaraan adalah tentang lagu yang dimainkan. Kami saling mengingatkan berapa kali harus mengulang refrain, berapa bar sesi gitar solo, pada ketukan berapa vokalis harus masuk, dan hal-hal sejenisnya. Dan tentunya, orang gemetaran tidak mungkin bercanda. 

Berbeda keadaannya dengan band sepupu tersebut. Begitu datang, mereka berhaha-hihi dengan gembira. Pada waktu kami mendekat, terdengar jelas bahwa topik pembicaraan bukanlah tentang teknis musik yang akan dimainkan, melainkan urusan ..... kostum !!!

Mereka sudah sedemikian terbiasa tampil di panggung, sehingga bermusik sudah seperti bernafas. Tidak perlu berpikir lagi. Oleh karena itu mereka bisa dengan tenang memikirkan kostum.

Lalu apa hubungannya band kafe dengan [Log4J](http://logging.apache.org/log4j)? 

Programmer pemula akan sangat concern dengan urusan algoritma, design pattern, normalisasi database, dan hal-hal teknis pemrograman. Programmer kawakan, sudah tidak lagi mengkhawatirkan hal-hal tersebut. Bukan karena tidak penting, tapi karena hal teknis tersebut sudah menjadi bagian dari dirinya. Coding sudah seperti bernafas. No mind .. demikian menurut Tom Cruise dalam film The Last Samurai.

Lalu apa yang dipikirkan programmer kawakan? Dia memikirkan pengguna aplikasinya. Bukan end-user atau operator, karena itu juga sudah refleks terpikirkan. Melainkan system administrator, first level technical support, dan maintainer programmer (programmer generasi kedua yang akan menambahkan fitur atau melakukan troubleshoot). 

Untuk kepentingan tersebut, maka yang harus dipikirkan adalah log message dan exception handling. Log message sangat dibutuhkan oleh sysdamin untuk mendeteksi masalah sedini mungkin. First level technical support juga harus membuat keputusan apakah masalah bisa diselesaikan melalui restart, atau butuh coding tambahan?

Nah, untuk itu kita harus mempertimbangkan : 




  1. Di titik mana harus menaruh log


  2. Informasi apa yang harus ditulis di log


  3. Di mana harus menulis log: konsol, file, database, syslog, Event Viewer?


  4. Bagaimana harus memformat log message agar mudah ditelusuri?


  5. Bagaimana memfilter log agar menampilkan hanya severity tertentu?


  6. Bagaimana memfilter log agar hanya meliput modul tertentu?



Beruntung bagi programmer Java, kita hanya perlu memikirkan nomer 1 dan 2. Sisanya sudah disediakan oleh logging framework seperti [log4j](http://logging.apache.org/log4j). 

Lalu bagaimana cara menggunakan log4j? Pelajari di [Minibook Log4J](http://endy.muhardin.googlepages.com/minibook-log4j.pdf). 
