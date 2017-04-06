---
comments: true
date: 2007-08-13 13:44:57
layout: post
slug: luntbuild
title: Continuous Integration dengan Luntbuild
wordpress_id: 243
categories:
- java
---

Setelah pada artikel sebelumnya kita menggunakan CruiseControl --sempat dikomentari sebagai XML Sit Ups--
kali ini kita akan menggunakan [Luntbuild](http://luntbuild.javaforge.com/proj/summary.do?proj_id=70),
Continuous Integration Tools yang konfigurasinya tidak menggunakan XML sama sekali.

Sama seperti CruiseControl, untuk menjalankan Continuous Integration, kita memerlukan:




  * Repository Subversion yang berisi source code, lengkap dengan folder trunk dan release


  * Code Review, Unit Test, Integration Test, Coverage Test yang lengkap


  * File build.xml yang memiliki target untuk menjalankan semua test



Struktur folder repository juga masih sama seperti artikel sebelumnya. Kita tidak membuat baru,
melainkan langsung menggunakan repository pada artikel sebelumnya.

Untuk menjalankan Luntbuild, kita memerlukan:


  * Luntbuild installer


  * Apache Ant 1.7.0


  * Apache Tomcat 5.5


  * Java SDK 6.0



Installer Luntbuild dapat diunduh [di sini](http://luntbuild.javaforge.com/proj/doc.do?doc_id=35767).

Cara instalasinya tidak sulit, begitu kita dapatkan file instalasinya, buka command prompt, dan masuk ke folder tempat installer tersebut berada.
Kemudian jalankan installernya.

```    
$ cd Downloads
$ java -jar luntbuild-1.4.2-installer.jar
```

Tampilan instalasi Luntbuild akan segera tampil. Klik saja Next untuk melewati Release Note dan License Agreement,
sampai pada pertanyaan lokasi instalasi.

[![Lokasi Instalasi Luntbuild ](/images/uploads/2007/08/luntbuild-install-dir.png)](/images/uploads/2007/08/luntbuild-install-dir.png)

Di komputer saya, saya pilih lokasi `/opt/luntbuild-1.4.2` sebagai lokasi instalasi.
Klik Next, dan lanjutkan ke konfigurasi database.

[![Instalasi Database ](/images/uploads/2007/08/luntbuild-install-db.png)](/images/uploads/2007/08/luntbuild-install-db.png)

Di sini saya tidak mengubah setting apa-apa. Langsung saja lanjutkan sampai menemui pertanyaan username dan password administrator.

[![Setup Administrator Password ](/images/uploads/2007/08/luntbuild-install-password.png)](/images/uploads/2007/08/luntbuild-install-password.png)

Saya masukkan `luntbuild123` sebagai passwordnya.
Kita juga akan ditanyai lokasi instalasi Tomcat agar Luntbuild bisa segera menginstal aplikasi webnya di sana.
Entah apa yang terjadi, di komputer saya pilihan ini tidak berpengaruh apa-apa. Seharusnya installer akan membuat folder `luntbuild` di dalam `[TOMCAT_INSTALL]/webapps`.
Setelah instalasi selesai saya tetap harus membuat folder `luntbuild` di dalam `[TOMCAT_INSTALL]/webapps` secara manual
dan mengkopi semua isi `[LUNTBUILD_INSTALL]/web` ke dalamnya.

Setelah semua layar berhasil dilalui, instalasi selesai. Kita bisa langsung jalankan Tomcat, dan browse ke http://localhost:8080/luntbuild.
Jika instalasi berjalan benar, maka kita akan disambut oleh Luntbuild

[![Halaman Depan Luntbuild ](/images/uploads/2007/08/luntbuild-frontpage.png)](/images/uploads/2007/08/luntbuild-frontpage.png)

Secara default, kita login secara anonymous. Untuk bisa mengkonfigurasi project, kita harus logout dulu.
Kita akan segera melihat halaman login.

[![Login Page ](/images/uploads/2007/08/luntbuild-login.png)](/images/uploads/2007/08/luntbuild-login.png)

Masukkan username luntbuild dan password luntbuild123, sesuai yang kita isikan pada waktu instalasi.
Kita akan melihat daftar builder yang masih kosong.

Segera klik tab Project, dan klik tombol New Project di kanan atas.
User interface Luntbuild kurang intuitif, sehingga saya harus berusaha keras mencari tombol tersebut.
Halaman New Project segera tampil.

[![Create New Project ](/images/uploads/2007/08/luntbuild-new-project.png)](/images/uploads/2007/08/luntbuild-new-project.png)

Masukkan nama project dan berikan keterangan, lalu Save.

Selanjutnya, kita klik tab VCS.

[![No VCS Yet ](/images/uploads/2007/08/luntbuild-no-vc.png)](/images/uploads/2007/08/luntbuild-no-vc.png)

Di tab ini kita melakukan konfigurasi untuk version control.
Luntbuild mendukung berbagai merek version control.
Pilih Subversion pada drop down yang tersedia.

[![Add New Subversion Repo ](/images/uploads/2007/08/luntbuild-vcs-svn.png)](/images/uploads/2007/08/luntbuild-vcs-svn.png)

Untuk konfigurasi di komputer saya, isinya adalah sebagai berikut:




  1. Repository url base : svn://localhost


  2. Directory for trunk : trunk


  3. Directory for branches : kosongkan saja, karena project contoh ini tidak memiliki branch


  4. Directory for releases : releases/daily-build


  5. Username : endy. Ini adalah username yang digunakan Luntbuild untuk checkout dan membuat tag.
Idealnya kita buatkan user khusus untuk Luntbuild


  6. Password : 123


  7. Quiet Period : kosongkan saja, ini tidak dibutuhkan untuk Subversion yang sudah mendukung atomic commit.



Ada sedikit keanehan Luntbuild. Dia mengharuskan kita membuat modul.
Kalau dia tidak menemukan modul, maka akan keluar pesan error.
Oleh karena itu, kita klik New Module, lalu langsung saja save tanpa mengisi apa-apa.

Hasil akhir dari tab VCS kita akan nampak seperti ini.

[![VCS Subversion ](/images/uploads/2007/08/luntbuild-vcs-svn-summary.png)](/images/uploads/2007/08/luntbuild-vcs-svn-summary.png)

Berikutnya, kita masuk ke tab berikutnya untuk konfigurasi Builder.

[![No Builder Yet ](/images/uploads/2007/08/luntbuild-no-builders.png)](/images/uploads/2007/08/luntbuild-no-builders.png)

Satu project bisa memiliki banyak builder.
Dengan builder, kita bisa mengatur sejauh mana kita ingin melakukan build.
Contoh beberapa build yang mungkin digunakan adalah:




  * Unit test: hanya menjalankan unit test saja, mungkin dijalankan setiap 1 jam sekali.


  * Full test: menjalankan semua jenis test, dijalankan sebelum jam makan siang dan sore sebelum pulang


  * Nightly/Daily build : dijalankan sekali sehari, selain menjalankan semua test, juga menghasilkan *jar atau *war.
Jenis build ini biasanya dikonfigurasi untuk menghasilkan tag di version control apabila sukses.



Klik tombol New Builder untuk mengkonfigurasi build. Karena kita menggunakan Ant, pilih Ant pada dropdown yang tersedia.

[![Ant Builder ](/images/uploads/2007/08/luntbuild-ant-builder.png)](/images/uploads/2007/08/luntbuild-ant-builder.png)

Pada contoh ini, kita akan mengkonfigurasi Build Jar.
Sekali sudah paham konsepnya, tidak sulit untuk mengkonfigurasi jenis build yang lain.
Berikut adalah nilai yang saya isikan:




  1. Name : Build Jar


  2. Command for Ant : /opt/apache-ant-1.7.0/bin/ant. Ini adalah path menuju Ant kita.


  3. Build script path : build.xml. Ini adalah nama file build.xml yang ada di project kita


  4. Build target : build-jar. Target Ant yang dipanggil pada saat build berjalan.
Saya pilih target build-jar yang mengeksekusi semua test, kemudian membuat *.jar bila test tidak ada yang gagal.


  5. Field sisanya, biarkan saja sesuai default.




Terakhir, kita mengkonfigurasi Schedule, alias jadwal. Ini menentukan kapan build dieksekusi.
Untuk Build Jar yang sudah kita konfigurasi, kita ingin dia dijalankan setiap jam 01 dini hari, setiap hari.
Berikut isian konfigurasinya.


  1. Name : Nightly Build


  2. Description : build setiap jam 01 dini hari


  3. Next build version : `nightly-${#currentDay=system.(year+"-"+numericMonth+"-"+dayOfMonth), #lastDay=project.var["day"].setValue(#currentDay), #dayIterator=project.var["dayIterator"].intValue, project.var["dayIterator"].setIntValue(#currentDay==#lastDay?#dayIterator+1:1), #currentDay}.${project.var["dayIterator"]}`.
Ini adalah label yang akan diberikan untuk setiap build.
String di atas akan menghasilkan label nightly-2007-08-17.1 bila dijalankan pada tanggal 17 Agustus 2007.

  4. Trigger Type: cron. Luntbuild menyediakan dua jenis trigger. Pertama, simple trigger yang berbasis interval.

Dengan simple trigger, kita dapat menjadwalkan build untuk berjalan misalnya setiap dua jam, atau setiap 30 menit.
Kedua, cron trigger, yang berbasis waktu. Dengan cron trigger, kita dapat menjalankan build setiap waktu tertentu,
misalnya setiap Sabtu, atau setiap hari jam 1 pagi. Untuk menjalankan build setiap jam satu pagi, gunakan cron trigger
dengan konfigurasi `0 0 1 * * ?`. Luntbuild menggunakan pustaka [Quartz](http://www.opensymphony.com/quartz/) untuk melakukan penjadwalan ini.
Lebih lanjut tentang konfigurasi jadwal Quartz dapat dilihat di [websitenya](http://www.opensymphony.com/quartz/wikidocs/TutorialLesson6.html).


  5. Build necessary condition: vcsModified or dependencyNewer. Buat apa melakukan build kalau belum ada perubahan
sejak terakhir kali build berjalan? Inilah maksud dari field ini. Dengan menyebutkan vcsModified, kita menjelaskan
bahwa kalau tidak ada perubahan di dalam version control, tidak perlu lakukan build. Selain nilai ini, kita juga
bisa menggunakan nilai always, yang artinya tetap build walaupun tidak ada yang commit.


  6. Associated builders. Di sini kita memilih builder mana yang ingin dijalankan.


  7. Associated post builder. Misalnya setelah build sukses dijalankan, kita ingin membuat installer yang siap diunduh.
Kita bisa sebutkan hal tersebut di sini.


  8. Label strategy: Label if success. Hanya buat tag di version control bila build sukses.


  9. Notify strategy: notify if status change. Artinya, kirim pemberitahuan apabila status build berbeda dari sebelumnya,
misalnya tadinya gagal menjadi sukses, atau sebaliknya.


Demikian sebagian nilai yang harus diisikan. Untuk field yang tidak saya jelaskan, silahkan baca keterangannya atau ikuti saja default.

Setelah semua konfigurasi selesai, kembali ke halaman depan untuk menyaksikan hasil pekerjaan kita.
Di sana akan terpampang semua build yang sudah dikonfigurasi.

[![Daftar build ](/images/uploads/2007/08/luntbuild-builds.png)](/images/uploads/2007/08/luntbuild-builds.png)

Kita bisa menjalankan build tersebut secara manual tanpa harus
menunggu jatuh temponya. Biasanya kita lakukan build manual untuk mengetes konfigurasi.
Build yang sedang berjalan ditandai dengan ikon roda gigi.

[![Building ](/images/uploads/2007/08/luntbuild-building.png)](/images/uploads/2007/08/luntbuild-building.png)

Build yang gagal akan ditandai dengan warna merah, sedangkan build yang berhasil diwarnai hijau.

[![Build Successful ](/images/uploads/2007/08/luntbuild-build-success.png)](/images/uploads/2007/08/luntbuild-build-success.png)

Bila build gagal, tentunya kita ingin melihat apa yang terjadi. Klik build info untuk menampilkan informasinya.

[![Build Info ](/images/uploads/2007/08/luntbuild-build-info.png)](/images/uploads/2007/08/luntbuild-build-info.png)

Kurang detail? Buka saja lognya. Di sini akan terlihat di langkah yang mana build tersebut berhenti.

[![Build Log ](/images/uploads/2007/08/luntbuild-build-log.png)](/images/uploads/2007/08/luntbuild-build-log.png)

Demikianlah cara penggunaan Luntbuild.
Mudah-mudahan dengan menggunakan perangkat ini proyek software Anda bisa dikelola dengan baik dan teratur.
