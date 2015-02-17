---
comments: true
date: 2005-10-14 11:15:50
layout: post
slug: otentikasi-apache-menggunakan-ldap
title: Otentikasi Apache menggunakan LDAP
wordpress_id: 8
categories:
- aplikasi
---

Pada tulisan sebelumya, saya telah menceritakan cara instalasi dan konfigurasi [Subversion](http://subversion.tigris.org). Juga telah diceritakan cara mengaktifkan mode akses HTTP melalui [Apache 2 + WebDAV](http://httpd.apache.org).

Setelah sistem berjalan, ternyata ada kekurangnyamanan dalam mengelola repository. Seperti kita ketahui, yang menggunakan repository adalah para programmer dan tim ofisialnya, semuanya terlibat dalam suatu project. Project datang dan pergi, demikian juga username bertambah dan berkurang. 

Cara manajemen username melalui htpasswd tidak scalable. Tambah user harus lapor, ganti password harus dibantu, hapus user juga sama, semua tidak bisa diotomasi. Setidaknya saya belum tau cara mengelola file htpasswd yang lebih efisien. Keinginan saya adalah, untuk menambah dan menghapus username dilakukan administrator, tapi untuk urusan ganti password silahkan ganti sendiri melalui web.

Setelah google ke sana kemari, metode yang umum digunakan orang adalah otentikasi melalui LDAP server. Dan ternyata, memindahkan otentikasi dari file htpasswd ke LDAP tidak sulit, cukup ganti konfigurasi `dav_svn.conf` dalam folder `/etc/apache2/mods-available` ini : 

    
    AuthUserFile /etc/apache2/htpasswd


menjadi ini : 

    
    AuthBasicProvider ldap
    AuthLDAPURL ldap://localhost/dc=artivisi,dc=com?uid?sub?
    AuthLDAPBindDN uid=apache,dc=artivisi,dc=com
    AuthLDAPBindPassword "passwd-user-apache-dalam-ldap"





> Perhatian !!! Konfigurasi ini berjalan di Ubuntu 7.04 dengan Apache 2.2. Bila Anda menggunakan distro lain atau Apache 2.0, konfigurasi ini mungkin harus dimodifikasi agar bisa berjalan dengan baik.



Kita membutuhkan modul `mod\_authnz\_ldap` agar Apache bisa melakukan otentikasi ke LDAP.

Lebih lanjut tentang otentikasi LDAP ini bisa dilihat di [manualnya Apache](http://httpd.apache.org/docs/2.2/mod/mod_authnz_ldap.html).

Untuk mengaktifkan modul ini, cukup gunakan perintah berikut: 

`a2enmod authnz\_ldap`

Nah, di sisi Apache tidak sulit. Instalasi LDAP di Debian juga sama mudahnya, cukup : 

`# apt-get install slapd`

untuk menginstal OpenLDAP, dan 

`# apt-get install phpldapadmin`

untuk menginstal [PHPLDAPAdmin](http://phpldapadmin.sourceforge.net). Ya benar ... LDAP Admin, bukan phpmyadmin. 

Ternyata merek phpXXadmin ini telah sangat kuat. Mungkin kalau [Hermawan Kartajaya](http://www.hermawankartajaya.com) pernah menggunakan [MySQL](http://www.mysql.org), [PostgreSQL](http://www.postgresql.org), dan [OpenLDAP](http://www.openldap.org), dia juga akan membahas mengenai kekuatan merek phpXXadmin ini. Sejauh ini saya telah menggunakan [phpmyadmin](http://www.phpmyadmin.net) dan [phppgadmin](http://phppgadmin.sourceforge.net). Dan sekarang ada [phpldapadmin](http://phpldapadmin.sourceforge.net). Luar biasa. 

Instalasi [OpenLDAP](http://www.openldap.org) mudah sekali, kita hanya ditanya nama domain yang akan disimpan, saya jawab **artivisi.com**. Kemudian ditanya password untuk administrator dan metode enkripsinya. OpenLDAP menyediakan clear, crypt, dan md5. 
Setelah itu ... selesai.

Instalasi phpldapadmin sedikit bermasalah. Masalah utama adalah permission. Entah kenapa, debian menginstalnya dengan permission yang tidak sesuai. 
Ini menyebabkan beberapa halaman tidak bisa diakses karena web server tidak diijinkan untuk membacanya.
Untuk mudahnya, saya melakukan : 

    
    # chown -R www-data.www-data /etc/phpldapadmin
    # chown -R www-data.www-data /usr/share/phpldapadmin


Ok, selesailah sudah.
Sekarang untuk menambah user dapat dilakukan melalui web. Konfigurasi default OpenLDAP juga sangat bagus. Hanya admin yang dapat memanipulasi data. User biasa (uid) hanya bisa mengganti atributnya sendiri (termasuk password).

Jadi berikutnya, kalau ada user baru, tinggal tambahkan melalui web dengan password standar. Kemudian suruh user tersebut login dan ganti password. Beres ... 

Referensi :  
[Google](http://www.google.com)

[Scratchbox](http://www.scratchbox.org/documentation/docbook/svn.html)
