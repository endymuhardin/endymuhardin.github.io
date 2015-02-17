---
comments: true
date: 2007-06-27 14:24:53
layout: post
slug: konfigurasi-svn-http-di-opensuse-102
title: Konfigurasi SVN-HTTP di OpenSuSE 10.2
wordpress_id: 222
categories:
- linux
---

Artikel ini akan menjelaskan tentang konfigurasi Apache dan OpenLDAP di OpenSuSE 10.2 agar Subversion Repository yang kita miliki bisa diakses melalui protokol HTTP. 



Pertama, instal software yang dibutuhkan. Jalankan Yast dan instal paket-paket berikut:



	
  * subversion

	
  * apache2

	
  * subversion-server

	
  * yast2-http-server




Setelah itu, modifikasi executable Subversion agar repository yang dihasilkan memiliki nilai umask yang tepat. Caranya dapat dilihat [di sini](http://endy.artivisi.com/blog/aplikasi/instalasi-subversion/). 

Lalu buat repository untuk percobaan, sebagai contoh saya akan membuat repository di folder `/opt/repository/repo-percobaan`. 


    
    <code>svnadmin create --fs-type fsfs /opt/repository/repo-percobaan</code>



Selanjutnya, kita akan mengkonfigurasi Apache agar membaca folder tersebut dan memetakannya ke URL /svn. Jadi, bila kita mengakses `http://localhost/svn/repo-percobaan` di browser, Apache akan menampilkan isi repository kita. 

Caranya, buka Yast, kemudian masuk ke Network Services > HTTP Server. 
![Yast Control Panel ](/images/uploads/2007/06/yast-http-server.png)

Ikuti wizard tanpa perubahan sampai layar terakhir. Setelah itu, klik Expert Configuration. 

![Expert Configuration ](/images/uploads/2007/06/yast-http-server5.png)

Layar pertama adalah pilihan port yang dilayani Apache. Tambahkan port 443 untuk mengaktifkan SSL. 

![Port SSL ](/images/uploads/2007/06/yast-http-server7.png)

Setelah itu, masuk ke tab Server Modules. Aktifkan module `dav`, `dav_fs`. 

![Apache Module ](/images/uploads/2007/06/yast-http-server8.png)

Kita juga butuh modul tambahan untuk Subversion. Klik Add Module, tambahkan modul `dav_svn` dan `authz_svn`. 

![Add Subversion Module ](/images/uploads/2007/06/yast-http-server9.png)

Selesai dengan Yast. Klik OK untuk menyimpan perubahan. Sekarang kita akan mengedit konfigurasi modul Subversion agar membaca folder repository kita. 

Buka file /etc/apache2/conf.d/subversion.conf. Di sana sudah disediakan template yang siap diedit sesuai kebutuhan. Untuk tahap pertama ini, ubah isi file tersebut menjadi seperti ini. 


    
    <code><IfModule mod_dav_svn.c>
    <Location /svn>
       DAV svn
       SVNParentPath /opt/repository
    </Location>
    
    </IfModule></code>



Server ini akan digunakan untuk beberapa project sekaligus. Untuk setiap repository baru yang dibuat di kemudian hari, tidak perlu setting ulang Apache. Cukup buat folder repository baru di dalam `/opt/repository`. 

Save file tersebut, dan restart Apache melalui Yast. Repository sudah bisa dibaca. Arahkan browser Anda ke `http://localhost/svn/repo-percobaan`. Instalasi yang sukses akan menghasilkan tampilan seperti ini.

![Browse Repository Content ](/images/uploads/2007/06/yast-http-server11.png)


Silahkan baca [artikel ini](http://endy.artivisi.com/blog/aplikasi/otentikasi-apache-menggunakan-ldap/) untuk mengaktifkan otentikasi melalui OpenLDAP. 

