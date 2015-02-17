---
layout: post
title: "Belajar Project Management dari Ubuntu"
date: 2014-08-30 23:49
comments: true
categories: 
- manajemen
---

Hampir seluruh aktivitas yang saya lakukan dengan komputer (smartphone juga termasuk komputer) menggunakan aplikasi open source. Jaman sekarang, aplikasi open source sudah jauh mengungguli aplikasi closed source baik dalam hal fitur, user-friendliness, reliability, dan kecepatan development (bug fix, fitur baru, enhancement, dan sebagainya).

Selama ini kita hanya tahu pakai saja. Download, instal, pakai, happy. Kita juga hanya tahu bahwa open source = kode programnya bisa dilihat, dimodifikasi, dan dibagikan ke siapa saja. Sebenarnya ada aspek lain dari open source yang juga menarik, penting, dan banyak sekali manfaatnya buat para pembaca blog saya yang utamanya adalah programmer, software project manager, dan juga pengusaha di sektor IT. Aspek tersebut adalah software development process yang terjadi sehingga semua produk canggih ini bisa berada di tangan kita saat ini.


Kehandalan manajemen proyek open source bisa kita lihat bukti nyatanya di distro linux Ubuntu. Coba lihat beberapa fakta berikut:

* Ubuntu rilis setiap enam bulan sekali, yaitu tiap bulan April dan Oktober.
* Sejak rilis pertama, belum pernah terjadi keterlambatan rilis.
* Kontributor Ubuntu (programmer, pembuat dokumentasi, desain tampilan, tukang burn CD, tukang update website, tukang upload iso, admin server, dsb) datang dari seluruh dunia. Bekerja 24 jam sehari 7 hari seminggu dengan timezone yang berbeda-beda. Jadi kalau kita masih kerja di ruangan yang sama, hanya dipisahkan _cubicle_ saja, datang bareng, makan siang bareng, pulang bareng, sebaiknya jangan terlalu sering mengeluh di socmed ;p
* Jumlah kontributornya ribuan orang. Bahasanya berbeda-beda. Lokasinya juga berbeda-beda.
* Tulang punggung Ubuntu adalah kernel Linux dan desktop manager Gnome. Harus menunggu Gnome rilis dulu, baru Ubuntu bisa dikerjakan. Jangan sampai di tengah-tengah development Ubuntu, ada perubahan signifikan yang terjadi di Gnome sehingga Ubuntu harus rombak total.
* Ubuntu basisnya adalah distro Debian varian unstable. Proses development harus memperhatikan agar jangan sampai menyimpang terlalu jauh dari Debian supaya tetap bisa sinkronisasi pada saat Debian naik versi.
* Ubuntu digunakan orang dari seluruh dunia, sehingga harus bisa mendukung berbagai bahasa, format angka, format tanggal, dan berbagai variasi lainnya.
* [Kompatibilitas antar rilis](http://software.endy.muhardin.com/manajemen/release-management/) harus terjaga, supaya orang bisa [upgrade dengan mudah](http://software.endy.muhardin.com/linux/upgrade-ubuntu/).

> Nah, apa rahasianya supaya bisa seperti itu?

<!--more-->

Oh ternyata tidak rahasia, karena semua tahapnya dijelaskan [di sini](https://wiki.ubuntu.com/UbuntuDevelopment/ReleaseProcess). Ya namanya juga dibuat oleh orang seluruh dunia. Tentu saja tidak ada yang rahasia di sini. Ini namanya rahasia umum :D

Ubuntu menggunakan skema [Time Based Release](https://wiki.ubuntu.com/TimeBasedReleases). Skema ini juga digunakan banyak project open source lain, misalnya [Gnome](https://wiki.gnome.org/ReleasePlanning/TimeBased).

Proses development Ubuntu dimulai dari issue tracker, di mana semua user (dari seluruh dunia) menginputkan bug report dan feature request. Semua request ini kemudian akan divoting oleh sesama user untuk menunjukkan seberapa banyak orang yang membutuhkan request tersebut. Request populer tentu ratingnya akan naik. Untuk request fitur baru dibuatkan [spesifikasinya](https://wiki.ubuntu.com/FeatureSpecifications).

Selanjutnya, Canonical mengadakan [Ubuntu Developer Summit](http://uds.ubuntu.com/agenda/). Pesertanya ada yang datang secara fisik, ada juga yang ikutan secara remote. Eventnya terbuka untuk umum dan [semua sesi direkam sehingga semua orang tahu proses pengambilan keputusan yang terjadi](http://www.jonobacon.org/2014/02/11/the-next-ubuntu-developer-summit-11-13-march-2014/).

UDS ini akan menghasilkan gambaran umum fitur apa saja yang akan dibuat, bagaimana skala prioritasnya, dan apa saja kira-kira pekerjaan yang harus dilakukan. Output dari UDS dapat kita lihat contohnya di [blueprint rilis Karmic](https://blueprints.launchpad.net/ubuntu/karmic/+specs).

Tahap selanjutnya adalah coding/development. Semua kontributor bekerja membuat fitur sesuai wilayah masing-masing. Ini dilakukan sampai terjadi freeze (stop penambahan fitur). Ada macam-macam freeze, misalnya:

* [Feature Freeze](https://wiki.ubuntu.com/FeatureFreeze) : berhenti menambahkan fitur baru
* [User Interface Freeze](https://wiki.ubuntu.com/UserInterfaceFreeze) : berhenti mengubah tampilan, supaya bisa mulai membuat user manual / dokumentasi aplikasi
* [Documentation String Freeze](https://wiki.ubuntu.com/DocumentationStringFreeze) : berhenti mengubah tulisan di dokumentasi aplikasi utama yang berbahasa Inggris, supaya bisa mulai diterjemahkan ke berbagai bahasa

Setelah penambahan fitur berhenti, semua orang berkonsentrasi fixing bug, tuning performance, refactoring, membuat dokumentasi, dan kegiatan beres-beres lainnya untuk [mengubah barang prakarya menjadi barang production](http://software.endy.muhardin.com/manajemen/aplikasi-prakarya-vs-aplikasi-production/). Ada beberapa milestone di sini yang menunjukkan tingkat kematangan produk, yaitu Alpha, Beta, Release Candidate, sampai akhirnya Stable Release. Proses coding dan testing di berbagai milestone yang biasa kita lakukan di ArtiVisi bisa dibaca [di sini](http://software.endy.muhardin.com/java/staged-deployment/).

Setelah stable release, kembali ke awal proses, yaitu issue tracker. 

Simak juga [penjelasan Kate Stewart, Release Manager Ubuntu dari Canonical](http://www.ubuntu-user.com/Online/Blogs/Amber-Graner-You-in-Ubuntu/Interview-Kate-Stewart-Ubuntu-Release-Manager-at-Canonical).

Nah, demikianlah proses yang terjadi di dalam dapur Ubuntu. Sebagai bahan perbandingan, kita juga bisa menyimak skema project management yang terjadi di berbagai project open source lain, misalnya:

* [Eclipse](http://wiki.eclipse.org/SimRel/Overview)
* [Git](https://github.com/git/git/blob/master/Documentation/howto/maintain-git.txt)
* [Linux Kernel](https://www.kernel.org/doc/Documentation/development-process/2.Process), untuk yang butuh penjelasan dengan diagram bisa [baca ini](http://techblog.aasisvinayak.com/linux-kernel-development-process-how-it-works/)
* [Android OS](https://source.android.com/source/code-lines.html)
* masih banyak lagi, silahkan google sendiri

Semoga bermanfaat.

