---
comments: true
date: 2006-08-11 13:37:33
layout: post
slug: intro-framework
title: Intro Framework
wordpress_id: 100
categories:
- java
---

Hari ini di milis jug ada yang bertanya tentang framework. [Si penanya][] sendiri kelihatannya mengerti tentang framework, tapi kesulitan menjelaskan kepada orang lain. 

Ini umum terjadi, apalagi kalau programmer Java berbicara dengan programmer dari dunia lain, seperti PHP, C, C++, dsb. Ini bisa disebabkan karena penggunaan framework tidak umum di dunia lain tersebut, atau simply karena programmer lain tersebut fakir bandwidth, sehingga gak aware terhadap tren terbaru. 

Baiklah, mari kita bahas framework. Framework, sesuai dengan terjemahannya, adalah kerangka kerja. Jadi, di dalam framework ada beberapa kode program yang kalau kita gunakan, akan memberikan kerangka atau struktur ke aplikasi yang dihasilkan. Singkatnya seperti itu. Nanti akan lebih jelas setelah kita lihat contoh kasus dan contoh kode. 

Untuk memahami framework, mari kita lihat ke dunia yang minim framework, yaitu PHP. Sebelum tahun 2005-2006 ini, (setau saya) programmer PHP di Indonesia masih asing dengan framework. 

Misalnya saya buat aplikasi shopping cart. Aplikasi yang sangat umum dalam PHP. Setidaknya saya pernah mencoding ulang shopping cart minimal tiga kali. Dan semuanya arsitekturnya beda. 

Pertama, waktu masih belajar. Semua kode campur aduk jadi satu. Kalau ada perubahan warna font, beberapa kode SQL harus ikut diupdate. Ubah nama tabel, 7 file kode harus diedit. Singkatnya, perubahan sedikit saja memaksa saya mengubah di banyak tempat di kode program.

Kemudian, setelah semakin banyak pengalaman, saya mulai memisahkan kode HTML dengan kode SQL. Dengan ini, aplikasi bisa berganti wajah dengan mudah. Cukup edit satu file konfigurasi, tampilan berubah seketika. 

Terakhir, saya mulai mempertimbangkan multi bahasa. Semua string yang berkaitan dengan label, dikeluarkan dalam satu file sendiri. Jadi kalau kita mau ganti bahasa, cukup bikin replika file tersebut, dan terjemahkan. Kemudian edit file konfigurasi, dan bahasa berubah seketika. 

Rapi dan bersih .. 

Setelah mendapatkan struktur yang optimal, saya mulai me-reuse struktur tersebut. Kapan-kapan membuat aplikasi baru, saya akan langsung memisahkan kode HTML, SQL, dan bahasa. 

Skenario di atas terjadi karena saya tidak menggunakan framework. Butuh banyak sekali trial and error buat saya sampai menemukan struktur yang rapi dan bersih. Setelah ditemukan, struktur tersebut saya jadikan framework. Kerangka untuk membuat aplikasi selanjutnya. 

Sekarang kita pindah dari dunia yang minim framework, ke dunia yang kebanjiran framework, Java.

Di dunia Java, kelihatannya orang sangat suka coding framework, sehingga kalau kita search di sourceforge, mungkin lebih banyak framework daripada aplikasi siap pakai. Mengapa ini terjadi, saya tidak tahu. Yang jelas, kalau kita akrab dengan Java, pasti akan pakai framework. 

Framework yang ideal harusnya merupakan intisari dari best practices. Pengalaman bertahun-tahun membuat aplikasi yang mirip, disimpulkan dan dibakukan menjadi framework siap pakai. Tapi saking banyaknya framework di Java, akhirnya banyak juga framework sampah. Artinya, dibuat bukan dari best practices dan experiences, tapi lebih menjadi ajang belajar membuat framework. 

Penggunaan framework hasil belajar seperti ini sangat buruk dampaknya. APInya tidak stabil, sehingga kalau framework tersebut menerbitkan edisi baru, kode program kita harus diubah semua. Tentu saja, karena framework merupakan kerangka utama. Jadi kalau kerangkanya berubah, maka seluruh aplikasi akan terpengaruh. Selain itu, strukturnya juga belum terbukti keandalannya. Masalah sederhana menjadi kompleks, waktu banyak terbuang untuk 'mengurusi' framework. 
Menggunakan framework jelek lebih fatal akibatnya daripada tanpa framework.

Sampai sejauh ini, harusnya sudah ada gambaran tentang framework. 



### Framework vs Library


Jangan keliru membedakan framework dengan library. Framework, by definition, sangat invasif. Dia memaksakan bagaimana kita harus coding, bagaimana memberi nama class, di mana harus meletakkan file, dan banyak aturan-aturan lain. Sedangkan library, tinggal baca dokumentasi, daftar function, input dan output masing-masing function, selesai. 

Dengan demikian, menggunakan framework lebih sulit daripada library. 
Coba kita bedakan framework dengan library
Framework Java: 

  *  [Spring Framework][]
  *  [Struts][]


Library Java: 

  *  [Joda Time][]
  *  [JFreeChart][]
  *  [Freemarker][]
  *  [Jakarta Commons][]

Framework PHP: 

  *  [Seagull][]
  *  [Cake][]

Library PHP: 

  *  [PEAR][]
  *  [AdoDb][]
  *  [Smarty][]

Ada lagi satu kategori, yaitu toolkit. Toolkit adalah kode yang kita gunakan dalam development, tapi tidak disertakan dalam produk akhir. Contohnya di Java antara lain: [Ant][] dan [CruiseControl][]. 

Tapi ada juga beberapa yang tidak jelas pengelompokannya. JUnit misalnya, di satu sisi, dia menyediakan perlengkapan untuk testing sehingga bisa dikategorikan sebagai library. Di sisi lain, dia mengharuskan ada prefix test di setiap nama method, sehingga layak disebut framework. 



### Plus Minus


Sekarang pertanyaan yang penting. Apa keuntungan dan kerugian menggunakan framework? Asumsikan framework yang ingin digunakan bagus dan teruji. 

Keuntungan

*  Struktur yang konsisten. Sangat berguna bila developer banyak dan turnover tinggi.
*  Struktur merupakan best practices. Semua sudah ditempatkan di tempat yang paling sesuai.
*  Dapat belajar tentang desain aplikasi yang baik. 


Kerugian

*  Butuh investasi waktu belajar dan adaptasi 
*  Ada overhead. Untuk project sangat kecil, mungkin overheadnya lebih besar dari projectnya sendiri. Lagipula, tidak semua fitur framework kita pakai, sehingga cuma akan menjadi bloat.
*  Menimbulkan dependensi. Ini terutama terasa di aplikasi yang berarsitektur plugin. Upgrade framework dapat merusak plugin. 



### Memilih Framework


Sekarang, bagaimana kita memutuskan pakai framework atau tidak? Kalau pakai, pilih yang mana? Sering sekali ada banyak framework yang menyelesaikan masalah yang sama.

Pertama, pertimbangkan benefit vs cost. 
Di beberapa project, saya lebih memilih tanpa framework, karena ukuran projectnya kecil. 

Untuk [playbilling][], saya pakai [iBatis][] alih-alih [Hibernate][] yang lebih lengkap fiturnya. Pertimbangannya adalah, saya tidak menggunakan banyak tipe database. Sehingga cross-database tidak terlalu dibutuhkan. Sekarang saya sedang mempertimbangkan menghilangkan [iBatis][], dan pakai JDBC biasa untuk mengurangi dependensi dan ukuran donlod. 

Kedua, lihat kualitas dokumentasinya. 
Alasan yang jelas adalah, kalau tidak ada dokumentasi, gimana tau cara pakainya? Kita butuh dokumentasi untuk bisa menggunakan framework. 

Ada alasan kedua yang juga penting. Kualitas dokumentasi mencerminkan kualitas framework. Mengapa? Karena dokumentasi biasanya adalah by product (produk sampingan), apalagi di project open source. Logikanya, jika tim developer menghasilkan dokumentasi bagus, pasti kualitas dan desain frameworknya sendiri lebih bagus lagi. 

Sejauh ini, kesimpulan saya konsisten. Framework terbaik secara desain dan kualitas kode adalah [Spring Framework][]. Coba lihat dokumentasinya. Sangat rinci, detail, dan minim kesalahan. 
Contoh lain adalah [Hibernate][]. Dokumentasinya sangat lengkap. Bahkan di dalamnya juga dijelaskan tentang konsep Object Relational Mapping. Dengan membaca dokumentasinya saja, kita akan menambah wawasan. Apalagi menggunakan frameworknya. 

Ketiga, lihat aktivitas komunitasnya. 
Framework, apalagi open source, membutuhkan interaksi dengan sesama pengguna. Keuntungan  utama tentu saja technical support dan tutorial gratis. Apalagi dengan perkembangan blog yang sangat pesat beberapa tahun terakhir. Semua pengalaman baik, buruk, mudah, sulit, semua diceritakan para pengguna framework di blognya masing-masing. 

Kalau kita menggunakan framework minoritas, jarang digunakan orang, tutorialnya sedikit, diskusi di berbagai forum juga tidak banyak. Jadi, kalau kita search dengan [Google][], lebih sulit menemukan permasalahan (dan solusi) yang sama dengan kebutuhan kita. 

Terakhir, learning curve, atau kurva belajar. Apakah framework tersebut sulit atau mudah dipelajari? 

Di bagian atas tadi saya menyebutkan keunggulan framework adalah dia dapat menyeragamkan struktur kode di antara banyak developer. Jadi, agar efektif, semua developer harus bisa menggunakan framework tersebut. 

Nah, seorang system architect, software designer, senior developer, development team leader, atau apapun istilahnya di tempat Anda, orang yang bertugas memilih framework, harus mempertimbangkan kurva belajar ini. 

Ini sering diabaikan banyak orang. Sebagai pemilih framework, tentunya orang tersebut memiliki keahlian/pengalaman teknis di atas rekan-rekannya. Penting bagi orang tersebut untuk memperhitungkan keahlian/pengalaman anggota tim yang lain yang tidak secanggih dirinya pada waktu memilih framework. Jangan sampai framework yang dipilih terlalu rumit, sehingga bukannya di-reuse malahan di-abuse. 

Demikian ulasan singkat tentang framework. Mudah-mudahan bermanfaat. 

[Si penanya]: http://dwiardiirawan.blogs.or.id
[Spring Framework]: http://www.springframework.org "Spring Framework Home Page"
[Hibernate]: http://www.hibernate.org "Hibernate Home Page"
[Joda Time]: http://joda-time.sourceforge.net/
[Google]: http://www.google.com "Oom Google"
[JFreechart]: http://www.jfree.org/jfreechart/
[Seagull]: http://seagullproject.org/
[Cake]: http://cakephp.org/
[iBatis]: http://ibatis.apache.org
[CruiseControl]: http://cruisecontrol.sourceforge.net/
[playbilling]: http://playbilling.sourceforge.net
[Smarty]: http://smarty.php.net/
[PEAR]: http://pear.php.net/
[AdoDb]: http://adodb.sourceforge.net/
[Ant]: http://ant.apache.org
[Jakarta Commons]: http://jakarta.apache.org/commons/index.html
[Freemarker]: http://freemarker.sourceforge.net
[Struts]: http://struts.apache.org
