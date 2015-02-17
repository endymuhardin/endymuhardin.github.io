---
layout: post
title: "Ongoing Learning"
date: 2014-02-20 12:48
comments: true
categories: 
- life
---

Hidup sebagai programmer bisa diibaratkan seperti nyemplung di laut. Untuk bisa survive, kita harus terus bergerak dan berenang. Begitu kita diam, langsung deh tenggelam.

Ini juga berlaku buat saya yang sudah 12 tahun jadi programmer. Teknologi baru bermunculan dengan cepat dan kita harus _keep up to date_. Artikel ini adalah bagian pertama dari catatan perjalanan saya belajar teknologi baru. Seperti biasa, source code yang dihasilkan akan saya share di Github.

Mari kita mulai.

<!--more-->

## Pemilihan Teknologi ##

Pertama, saya tentukan dulu apa yang mau dipelajari. Sebetulnya ada banyak teknologi yang belum saya kuasai, misalnya:

* Grails
* Spring Roo
* Spring Batch
* Pentaho
* NoSQL
* NodeJS
* Android
* iOS Programming
* Advanced Functional Programming (LISP, Clojure, Scala)
* Amazon Cloud Services
* dan masih banyak lagi

Tapi kita harus memilih salah satu yang akan didahulukan. Tidak mungkin belajar semua.

Dari sekian banyak dalam list, saya akhirnya pilih NodeJS dan NoSQL.

> Kenapa?

Karena kedua hal itu memiliki ekosistem yang sangat berbeda dari yang selama ini saya tekuni. Kalau selama ini terbiasa dengan [ekosistem Java](http://software.endy.muhardin.com/java/development-stack-2014/) dan [database relasional](http://software.endy.muhardin.com/java/konfigurasi-koneksi-database-dengan-spring/), kali ini kita akan coba dunia di luar Java dan pemodelan data non-relasional.

Selanjutnya, seperti sering saya sarankan di berbagai forum, untuk belajar programming kita harus bikin aplikasi. Cuma baca-baca saja tidak akan banyak hasilnya.

## Contoh Aplikasi ##

Nah kebetulan istri saya dapat amanah jadi sekretaris di pengajiannya, dia butuh aplikasi untuk menyimpan data member. Tidak rumit-rumit, berikut daftar fitur yang dibutuhkan:

### Fitur Administrator ###

* Entri data member
* Entri data pembayaran iuran
* Entri pengumuman

### Fitur Member ###

* Lihat pengumuman
* Lihat data pembayaran iuran

Paling penting di sini adalah mulai dari hal yang sederhana dulu. Jangan terlalu ambisius ingin fitur canggih seperti:

* Mobile Interface
* Pemberian tugas/target individu
* Tracking progress penyelesaian tugas/target

Kalaupun mau fitur tersebut, bisa kita tunda di rilis versi selanjutnya.


## Langkah Pertama ##

Di jaman sekarang, jarang sekali aplikasi bisa dibangun hanya dengan satu library/framework saja. Beda dengan jaman VB 6 dulu. Sekali buka Visual Studio, beres langsung aplikasinya. Di jaman sekarang, kita harus pakai kombinasi teknologi atau yang biasa disebut _Development Stack_.

Karena ini dunia yang baru bagi saya, kombinasi stacknya masih belum saya pahami. Untuk itu perlu googling dulu. Beberapa link yang berhasil saya kumpulkan antara lain:

* Untuk deployment, kita bisa pakai [gratisan dari Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
* Framework MVC untuk di sisi server ada dua kandidat kuat yaitu [ExpressJS](http://expressjs.com/) dan [SailJS](http://sailsjs.org/#!documentation).
* Workflow tools (ala Maven) bisa pakai [Yeoman](http://yeoman.io/). Di dalamnya dia include [Bower](http://bower.io/) dan [Grunt](http://gruntjs.com/). Sekilas baca, Bower adalah dependency management (bertugas untuk mencarikan library yang kita butuhkan) dan Grunt adalah tools untuk build (compile, minify, optimize, dsb)
* [Integrasi antara NodeJS, ExpressJS, dan Redis](http://blog.modulus.io/nodejs-and-express-sessions)
* [Simpan data ke Redis dengan NodeJS](http://blog.semmy.me/post/46247962979/storing-simple-data-with-redis-and-node-js)
* [Deployment NodeJS dan Redis di Heroku](https://devcenter.heroku.com/articles/redistogo)

Perlu diketahui, NodeJS adalah JavaScript untuk di sisi server. Di sisi client, kita akan menggunakan AngularJS dan Twitter Bootstrap. Untuk itu, kita cari tahu dulu [bagaimana menyambungkan AngularJS dan NodeJS](https://www.google.com/search?q=sample+application+nodejs+angularjs). Terutama, bagaimana mengatur struktur folder aplikasinya.

Dari hasil pencarian di atas, saya menemukan beberapa artikel, yaitu:

* [Tutorial dari IBM, menggunakan ExpressJS, AngularJS, dan MongoDB](http://www.ibm.com/developerworks/library/wa-nodejs-polling-app/)
* [Membuat CRUD dengan AngularJS dan NodeJS](https://www.twilio.com/blog/2013/12/votr-part-5-angularjs-crud-restful-apis.html)
* [Aplikasi Sederhana dengan AngularJS dan NodeJS](http://bardevblog.wordpress.com/2013/08/14/understanding-angularjs-simple-example/)

## Langkah Selanjutnya ##

Setelah materi dan referensi terkumpul, saatnya kita mulai bekerja. Pertama tentu kita [install dulu NodeJS](http://askubuntu.com/a/83290). Setelah itu, kita buat [repository Githubnya](https://github.com/endymuhardin/aplikasi-membership).

Lalu, kita mulai coding. Follow terus repositorynya dan nantikan artikel lanjutannya ;)
