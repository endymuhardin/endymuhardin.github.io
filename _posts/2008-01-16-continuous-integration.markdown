---
comments: true
date: 2008-01-16 15:37:23
layout: post
slug: continuous-integration
title: Continuous Integration
wordpress_id: 103
categories:
- manajemen
---

Tools untuk Continuous Integration sudah sering dibahas di sini. Ada [CruiseControl](http://endy.artivisi.com/blog/java/cruise-control/), [Luntbuild](http://endy.artivisi.com/blog/java/luntbuild/), dan [Hudson](http://endy.artivisi.com/blog/java/hudson/). Apa yang begitu pentingnya dari proses ini sehingga saya meluangkan waktu untuk melihat setiap tools yang ada?

Continuous Integration, [menurut Martin Fowler](http://martinfowler.com/articles/continuousIntegration.html), begini: 



> Continuous Integration is a software development practice where members of a team integrate their work frequently, usually each person integrates at least daily - leading to multiple integrations per day. 

Each integration is verified by an automated build (including test) to detect integration errors as quickly as possible. 

Many teams find that this approach leads to significantly reduced integration problems and allows a team to develop cohesive software more rapidly. 



Ada beberapa keyword di sini: 

  * integrate their work
  * frequently
  * verified by automated build (including test)
  * detect errors as quickly as possible
  * significant reduced problems
  * develop .. rapidly

Mari kita bahas lebih jauh.



Sebagai contoh, kita membuat aplikasi dengan bahasa pemrograman Java. Langkah-langkah yang harus dilakukan sampai suatu kode program bisa digunakan antara lain:

  1. tulis source code
  2. kompilasi
  3. coba dijalankan sendiri (unit-test)
  4. coba gabungkan dengan kode lain (integration-test)
  5. deploy / install
  6. coba fitur-fiturnya
  7. kalau semua OK, cepat-cepat diarsip


Cukup banyak kegiatan yang harus dilakukan untuk menambah satu fitur. Penggunaan bahasa dinamik (seperti PHP atau Ruby) hanya mengurangi langkah kedua. Sisanya sama.

Kegiatan yang banyak ini akan sangat membosankan kalau dikerjakan secara manual. Bukan cuma boring, tapi juga rawan error. Di tengah tekanan deadline, sangat mungkin kita akan melewatkan test yang sudah pernah dijalankan sebelumnya. 



> Hei, dulu saja jalan .. kenapa sekarang tidak? 



Ya belum tentu. Membangun aplikasi mirip seperti membangun rumah-rumahan dari kartu. Sedikit penambahan bisa merobohkan seluruh bangunan. Jadi sangat penting kita untuk sering-sering melakukan integrasi. Dan yang juga penting, test yang sudah ada harus dijalankan semuanya.

Sekarang sudah ada tools yang membantu kita melakukannya. Cukup investasi waktu 10 menit untuk melakukan instalasi dan konfigurasi. Investasi 10 menit ini akan menghasilkan: 

  * build scheduler
  * laporan kemajuan project setiap saat
  * notifikasi setiap ada error
  * arsip build


Lalu apa manfaat dari fitur-fitur ini?

Banyak, mari kita bahas satu persatu. 



### Build Scheduler


Semua kegiatan build kita tadi, mulai dari checkout dari version control sampai membuat installer aplikasi bisa dilakukan secara terjadwal. Misalnya satu jam sekali, satu hari tiga kali, dan sebagainya. 

Kita juga bisa mengkonfigurasi macam-macam jadwal. Misalnya untuk test dengan data sedikit bisa dijalankan sering-sering. Test yang melibatkan data banyak --seperti test End Of Day process atau simulasi performance aplikasi dengan satu tahun data-- bisa dijalankan di malam hari, waktu semua orang sedang tidur. 




### Laporan Kemajuan Project


Pernahkah Anda, sedang asyik coding, puluhan variabel beterbangan di dalam otak, tiba-tiba dipanggil oleh Project Manager. 



> Fitur XX sudah selesai?



Kita jawab, "Sudah". Kemudian balik lagi ke kode program, hanya untuk menyadari bahwa seluruh konsentrasi sudah buyar, sehingga butuh waktu 10 menit untuk mengingat-ingat apa yang tadi sedang dikerjakan.

Dengan adanya tools Continuous Integration, Project Manager bisa langsung melihat kemajuan project di websitenya. Sehingga dia tidak perlu mengganggu konsentrasi orang lain. 



### Notifikasi Error


Misalnya kita mengubah nama kolom di database, ternyata menyebabkan fungsi-fungsi lain jadi error. Akan lebih cepat untuk memperbaiki hal ini jika antara kita mengubah nama kolom dan saat error ketahuan selisihnya singkat. Bagaimana cara supaya error cepat ketahuan? Ada dua cara: 

  1. test suite harus lengkap, sehingga mencakup seluruh bagian kode. 
  2. test suite harus sering-sering dijalankan.


Tools CI membantu kita di item #2. Tetapi test suite tetap harus kita yang membuatnya.



### Arsip Build


Project Manager lagi-lagi mengganggu konsentrasi kita. Kali ini dia mau presentasi ke customer dan mau menunjukkan aplikasi terbaru. Sialnya, tadi pagi kita baru saja mulai mengganti framework, tadinya pakai [IceFaces](http://www.icefaces.org/main/home/index.jsp) mau diganti jadi [RichFaces](http://labs.jboss.com/jbossrichfaces/). Wow, kenapa harus diganti?? Hmm .. sayangnya itu diluar pembahasan artikel ini. 

Karena ada perombakan arsitektur besar-besaran, maka aplikasi saat ini sedang berantakan. Tidak mungkin kita memberikan aplikasi terbaru ini untuk dibawa presentasi. Bisa-bisa Project Manager kita mendapat malu karena bukannya mendemokan aplikasi, malah mendemokan stack trace. 

Untuk mengambil versi sebelum dirombak juga belum tentu pekerjaan mudah. Tergantung apakah Anda menggunakan Subversion atau tidak. Dan apakah kita rajin membuat tag untuk menandai titik-titik penting. 

Continuous Integration Tools to the rescue .... 

Langsung saja buka arsip build. Cari build terakhir yang sukses, dan berikan pada bos. Jangan lupa diberi pesan, "Kapan-kapan kalau butuh yang seperti ini lagi, langsung saja buka URL ini ya."

Bila proses CI ini berjalan lancar, hidup programmer jadi jauh lebih nyaman. Dia tinggal: 

  * coding
  * buat unit test dan integration test
  * jalankan dua-duanya
  * kalau OK, commit
  * balik lagi ke coding


Sekarang kita kembali ke daftar keywordnya Martin Fowler di atas. Agar proses CI ini bisa berjalan baik, semua orang harus _integrate their work_. Setiap kode yang ditulis harus segera digabungkan dengan kode yang lainnya (yang ditulis anggota tim lainnya). 

Ini harus dilakukan _frequently_, sering-sering. Ini agar error yang muncul bisa segera terdeteksi.

Seluruh kegiatan mulai dari kompilasi sampai [bikin installer](http://endy.artivisi.com/blog/java/membuat-installer-dengan-izpack/) harus diotomasi. Kalau sudah otomatis, CI tools akan bisa mengeksekusinya dengan mudah. 

Kalau semua ini dilakukan, Martin Fowler berjanji bahwa kegiatan coding akan menjadi lebih _rapid_ dan _significantly reduces problem_. 

Nah, investasinya cuma 5-10 menit instalasi dan konfigurasi, keuntungannya banyak sekali. Lalu kenapa tidak banyak yang mengimplementasikannya?

Oh iya, saya lupa kasi tau. Implementasi CI sendiri mungkin 5-10 menit. Tapi proses ini punya ketergantungan terhadap tools dan praktek lain, yaitu: 

  * Automated Testing
  * Version Control

Dua praktek ini mengharuskan kita mengubah pola pikir dan kebiasaan, mirip seperti orang yang mau kurus atau berhenti merokok. 

So ... Good Luck 

:D
