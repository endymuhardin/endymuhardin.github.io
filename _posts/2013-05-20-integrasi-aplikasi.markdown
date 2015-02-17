---
layout: post
title: "Integrasi Aplikasi"
date: 2013-05-20 21:20
comments: true
categories: 
- java
---

Aplikasi jaman sekarang jarang sekali yang berdiri sendiri. 
Umumnya aplikasi yang kita buat harus terhubung dengan aplikasi yang dibuat orang lain. 
Beberapa contohnya:

* kita membuat aplikasi mobile, terhubung ke social network seperti Facebook dan Twitter
* kita membuat aplikasi bisnis, harus terhubung ke aplikasi akunting yang sudah lebih dulu ada
* kita membuat aplikasi pembayaran tagihan, harus terhubung ke penyedia tagihan seperti PLN, Telkom, dsb

Pada artikel ini, kita akan membahas beberapa strategi untuk menghubungkan aplikasi yang kita buat dengan aplikasi lain.

<!--more-->

Secara umum, ada empat strategi untuk menghubungkan aplikasi satu dengan lainnya:

* pemanggilan prosedur/function
* messaging
* sharing database
* kirim/terima file

Mari kita bahas satu persatu.

## Pemanggilan prosedur ##

Pada metode ini, aplikasi yang akan melayani (kita sebut aplikasi server), 
harus menyediakan mekanisme agar bisa dipanggil aplikasi lain (kita sebut aplikasi client).

Ada beberapa protokol yang populer digunakan dalam strategi ini, misalnya:

* SOAP
* REST
* ISO-8583
* XMLRPC

Ciri utama dalam strategi ini adalah:

* ada kesepakatan nama method yang akan dipanggil
* ada kesepakatan jumlah dan tipe data yang dikirim dan diterima
* client dan server harus online dalam waktu yang berbarengan.
* setelah client memanggil server, dia akan menunggu sampai ada balasan dari server. Sebelum terima balasan, client tidak bisa melanjutkan. Fenomena ini dikenal dengan istilah synchronous invocation.

Berikut beberapa contoh implementasi dari strategi ini:

* [Remoting dengan Spring Framework](http://software.endy.muhardin.com/java/remoting-dengan-spring/)
* [Transaksi Finansial dengan ISO-8583](http://web.archive.org/web/20110324211627/http://martinusadyh.web.id/tulisanku/berkenalan-dengan-iso-8583-menggunakan-java)

## Messaging ##

Konsep messaging sebetulnya sudah tidak asing lagi bagi kita. Sering kita gunakan sehari-hari dalam bentuk email, chatting, sms, dan sejenisnya. 

Beberapa ciri dari messaging antara lain:

* pengirim dan penerima tidak harus online berbarengan. Bisa saja pengirim mengirim pesan pada saat penerima offline, setelah itu pengirim juga offline. Pada waktu penerima online, dia akan menerima pesan yang ditujukan kepadanya pada waktu dia sedang offline.
* ada satu pihak yang berfungsi sebagai penyimpan message. Dalam dunia messaging, pihak ini disebut sebagai message broker.
* karena sifatnya yang memungkinkan tidak online barengan, maka biasanya ada mekanisme status delivery
* biasanya ada juga masa kadaluarsa message di dalam database broker. Sebagai contoh, bila handphone kita mati lebih dari tiga hari, maka sms yang ditujukan ke handphone tersebut dan belum sampai di handphone kita akan dihapus oleh operator telekomunikasi.
* tidak ada aturan mengenai format dan tipe data. Pengirim bebas mengirim apa saja. Penerima yang harus melakukan validasi terhadap format message
* tidak ada mekanisme notifikasi ketika ada message baru. Penerima harus secara periodik mengecek (polling) ke broker untuk mengetahui ada-tidaknya message baru

Dalam Java, ada beberapa pilihan untuk implementasi strategi messaging, diantaranya:

* [melalui email](http://software.endy.muhardin.com/java/integrasi-pusat-cabang-2/)
* [melalui sms](http://www.playsms.org/)
* [menggunakan protokol JMS](http://software.endy.muhardin.com/java/intro-jms/)
* menggunakan protokol AMQP


## Sharing Database ##

Pada strategi ini, pengirim dan penerima menggunakan database sebagai media pertukaran data. Pengirim menaruh datanya ke suatu tabel di database untuk kemudian dibaca oleh penerima. 

Karena menggunakan database, maka mekanisme ini memiliki beberapa ciri khusus interaksi dengan database, yaitu:

* transaction. Pengirim bisa memastikan datanya terkirim secara utuh. Bila terjadi error di tengah pengiriman data, maka data yang sudah terlanjur ditulis bisa dibatalkan
* tipe data bisa di-enforce. Kita bisa menggunakan tipe data angka, text, dan tanggal. Bila pengirim salah memasukkan data, maka database server akan menolaknya.

Mirip dengan messaging, tidak ada mekanisme notifikasi ketika ada data baru yang ditaruh pengirim. Penerima harus secara periodik mengecek (polling) ke database untuk mengetahui ada-tidaknya data baru. Untuk memudahkan polling, biasanya tiap data diberikan kolom status untuk membedakan mana data yang sudah diproses dan mana yang belum.

Bila kita menggunakan Spring Integration, kita bisa langsung menggunakan [implementasi yang tersedia](http://static.springsource.org/spring-integration/reference/htmlsingle/#jdbc) sehingga tidak perlu lagi membuatkan mekanisme pengecekan data baru. [Contoh pemakaian juga sudah disediakan](https://github.com/SpringSource/spring-integration-samples/tree/master/basic/jdbc), tinggal diikuti.

## File Transfer ##

Sama seperti messaging, dengan strategi ini pengirim dan penerima tidak harus online berbarengan. Yang membedakannya dengan messaging adalah pada mekanisme ini biasanya format file dan struktur data di dalamnya sudah ditentukan. Demikian juga dengan lokasi penyimpanan file dan aturan penamaannya. 

Berbeda dengan sharing database, mekanisme file transfer tidak memiliki mekanisme untuk memastikan data sampai dengan utuh. Kita sendiri yang harus memastikan keutuhan data, misalnya dengan mengirim file checksum bersama dengan file berisi data. File checksum ini bisa digunakan untuk memastikan file data terkirim secara utuh.

Pada mekanisme ini kita juga tidak bisa tahu progress pengiriman data. Apakah pengirim masih dalam proses mengirim atau sudah selesai? Kita tidak tahu secara pasti. Biasanya diakali dengan cara memeriksa ukuran file dalam selang waktu tertentu. Bila ukurannya masih terus bertambah, berarti proses pengiriman masih berjalan. Bila ukurannya tidak membesar lagi, ada indikasi bahwa pengiriman sudah selesai. 

Untungnya prosedur pengecekan ini sudah dibuatkan [implementasinya](http://static.springsource.org/spring-integration/reference/htmlsingle/#files) oleh rekan-rekan Spring Integration, sehingga kita tinggal mengikuti [contoh yang tersedia](https://github.com/SpringSource/spring-integration-samples/tree/master/basic/file).

Demikianlah sedikit informasi mengenai integrasi antar aplikasi. Semoga bermanfaat :)
