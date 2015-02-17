---
comments: true
date: 2006-01-24 16:36:45
layout: post
slug: windows-semakin-sulit
title: Windows semakin sulit
wordpress_id: 23
categories:
- aplikasi
---

Masih ingat cerita kemarin tentang [sulitnya menggunakan Windows](http://endy.artivisi.com/blog/aplikasi/sulitnya-menggunakan-windows/)? Ternyata kesulitan itu belum berakhir. 

Sedikit cerita latar belakang, saya ingin mengadakan training Bugzilla dan Subversion. Yang mana Bugzilla adalah aplikasi bug tracker berbasis web yang dibuat menggunakan Perl. Sedangkan Subversion adalah aplikasi version control yang salah satu metode aksesnya bisa melalui web. 

Berikut dependensi Bugzilla: 
1. Perl, berikut modul-modul khusus untuk Bugzilla
2. Webserver (Apache)
3. Database server (MySQL)

Dan dependensi Subversion + Akses HTTP adalah: 
1. Webserver (harus versi 2.0, 1.3 tidak bisa, 2.2 harus kompile sendiri)
2. mod_dav

Nah sekarang, Perl sudah berhasil diinstal menggunakan [ActivePerl](http://aspn.activestate.com/ASPN/Downloads/ActivePerl/), MySQL dan Apache juga sudah bisa diinstal dengan [XAMPP](http://www.apachefriends.org/en/xampp-windows.html). 

Masalahnya adalah, ternyata XAMPP itu menggunakan Apache 2.2. Dengan demikian, Bugzilla bisa jalan, Subversion tidak bisa. 

Kemudian saya coba pakai [Uniform server](http://www.uniformserver.com), yang menggunakan Apache 2.0. Setelah dicoba, entah kenapa Subversion tetap tidak bisa diakses, walaupun versi Apachenya benar. Tidak ada error message ataupun petunjuk mengapa Uniform server mogok jalan (setelah ditambah konfigurasi Subversion).

Ada lagi aplikasi paket yang lain, yaitu [Server2go](http://www.server2go-web.de). Tetapi setelah diperiksa ternyata Apachenya 1.3. Gagal maning.... :(

Alternatif terakhir: fully manual. 
Dijamin akan membuat peserta training histeris, karena harus:
1. Instal Perl
2. Instal Apache
3. Instal MySQL
4. Instal PHP (agar bisa manage MySQL pakai PHPMyAdmin)
5. Instal Subversion
6. Konfigurasi mod_dav
7. Instal Bugzilla
8. Instal Mail Server (supaya Bugzilla bisa kirim email)
9. Setup file hosts atau Instal DNS (supaya mail servernya gak cuma localhost)

Yah, kegiatan di atas akan memakan waktu 2 hari untuk dijelaskan ke peserta training. Belum lagi ada error. Dan itu baru kegiatan instalasi, belum masuk ke materi. Padahal alokasi waktu untuk training cuma 1 hari. 

Sekarang saya lagi mau coba [ApacheTriad](http://apache2triad.net/) dan XAMPP versi lebih rendah. Mudah-mudahan berhasil.

Seandainya para peserta itu pakai Linux saja .... 
