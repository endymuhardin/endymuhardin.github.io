---
comments: true
date: 2006-01-23 18:20:28
layout: post
slug: sulitnya-menggunakan-windows
title: Sulitnya menggunakan Windows
wordpress_id: 21
categories:
- aplikasi
---

Bulan depan saya akan menjadi instruktur untuk training [Bugzilla](http://www.bugzilla.org), [Subversion](http://subversion.tigris.org), dan [Ant](http://ant.apache.org). Sebetulnya tidak ada hambatan berarti, karena di proyek sebelumnya saya sudah banyak menggunakan aplikasi tersebut. Cara instalasi dan konfigurasi juga sudah banyak saya tulis di blog ini, antara lain: 




	
  * [Menggunakan Ant](http://endy.artivisi.com/downloads/slide/Tutorial-Ant.pdf)

	
  * [Cara Instalasi Subversion](http://endy.artivisi.com/blog/?p=7)

	
  * [Konfigurasi Apache + Subversion + OpenLDAP](http://endy.artivisi.com/blog/?p=8)



Masalahnya adalah, sekarang saya harus mengajarkan cara menginstal dan konfigurasi aplikasi tersebut di Windows. Lalu, apa sulitnya? Banyak .. berikut saya berikan listnya: 

1. Apache dan extension Subversion, instalasi Apache di linux (apalagi debian) sangat mudah. Cukup ketik: 
    
    <code># apt-get install  apache2 subversion libapache2-svn</code>



2. Bugzilla. Aplikasi ini membutuhkan Perl yang bisa diakses melalui Apache dengan mod_perl. Selain itu, kita perlu mendownload dan instal modul-modul tambahan. Lagi-lagi biasanya cukup: 
    
    <code># apt-get install  bugzilla</code>



3. Mail Server. Bugzilla membutuhkan mail server untuk mengirim email notifikasi. Di linux, aplikasi mail server biasanya terinstal secara default. Kalaupun tidak ada, bisa diselesaikan dengan satu baris.

Untungnya, seperti biasa telah ada orang lain di belahan dunia berbeda yang sudah pernah mengalami kepusingan yang sama, kemudian membuat solusinya. 

Cukup instal saja [XAMPP](http://www.apachefriends.org/en/xampp-windows.html). 

Paketnya memuat: 



	
  * Apache 2 dilengkapi WebDAV

	
  * Perl 5.8

	
  * Mail Server Mercury

        
  * FTP Server Filezilla



Sekarang tinggal memikirkan bagaimana cara konfigurasi mod_perl, mod_dav, dan dav_svn. Setelah itu, baru mencoba install [Bugzilla](http://www.bugzilla.org). Wuah, sangat tidak praktis. 

Kok masih ada orang yang berani-beraninya bilang pakai Windows lebih gampang ya? :D
