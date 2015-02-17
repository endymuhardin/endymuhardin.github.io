---
comments: true
date: 2005-10-12 17:38:20
layout: post
slug: instalasi-subversion
title: Instalasi Subversion
wordpress_id: 7
categories:
- aplikasi
---

Setelah pindah ke rumah baru, tugas pertama adalah instalasi [Subversion](http://subversion.tigris.org) lengkap dengan akses melalui http.

[Subversion](http://subversion.tigris.org) adalah aplikasi version control system. Cara instalasi detail dan tutorial penggunaan sedang saya susun dalam sebuah tutorial terpisah. Sementara ini, berikut cara cepat instalasi Subversion dan aktivasi akses melalui WebDAV.

Untuk mengaktifkan akses WebDAV, dibutuhkan webserver [Apache 2](http://httpd.apache.org). Apache 2 digunakan (bukan Apache 1) karena telah menyediakan dukungan terhadap WebDAV. WebDAV sendiri adalah tambahan pada protokol HTTP yang memungkinkan aplikasi client memodifikasi file di server. Tanpa WebDAV, aplikasi client (misalnya Internet Explorer atau [Mozilla Firefox](http://mozilla.org)) hanya bisa membaca data dari webserver dan tidak bisa menyimpan data. 

Berikut adalah langkah-langkahnya : 

0. Install Subversion, Apache2 dan WebDAV module :

    
    
    # apt-get install subversion apache2 libapache2-svn



1. Khusus Linux, kita harus membuat wrapper script untuk : 
    * svn
    * svnadmin
    * svnlook
    * svnserve

   Gunanya agar folder repository dibuat dengan permission yang benar, yaitu 664. Artinya, user/pembuat repository bisa baca-tulis(rw=6), groupnya bisa baca-tulis, dan orang lain bisa baca(r=4). 

    Caranya adalah dengan mengganti script yang asli dengan wrappernya. Pertama, ganti dulu nama script yang asli sebagai berikut : 

    
    
            # mv svn svn-original
            # mv svnadmin svnadmin-original
            # mv svnlook svnlook-original
            # mv svnserve svnserve-original        
    


    Kemudian buat file text baru untuk wrappernya, jangan lupa untuk membuat file tersebut executable.

    
            
            # touch svn svnadmin svnlook svnserve
            # chmod 755 svn svnadmin svnlook svnserve        
    


    Berikut adalah contoh wrapper script untuk svn. 
File svnadmin, svnlook, dan lainnya mirip, cuma berbeda di baris keempat saja.

    
    
    #!/bin/sh
            
    umask 002
    /usr/bin/svn-original "$@"        
    


2. Buat repository, misalnya di folder /home/endy/svnrepo : 

    
    
            $ svnadmin create --fs-type fsfs /home/endy/svnrepo
    


3. Buat group untuk mengakses repository, misalnya group svnusers

    
    
            # groupadd repousers
    


4. Ubah kepemilikan repository menjadi milik group

    
    
            $ chgrp -R repousers /home/endy/svnrepo
    


5. Masukkan semua user yang akan mengakses repository ke dalam group repousers. Sekarang repository siap diakses secara ssh.

    
    
            $ svn list svn+ssh://localhost/home/endy/svnrepo
    


6. Edit Apache 2 agar berjalan dengan group repousers. 
Instruksi dibawah berlaku untuk Debian. Untuk distro lain silahkan lihat manualnya masing-masing. Pengguna Windows tidak perlu pusing-pusing tentang group, di OS anda fitur ini diabaikan :P

    
    
            mc -e /etc/apache2/apache2.conf
    


    ganti baris 

    
    
            Group www-data
    


    menjadi 

    
    
            Group repousers
    


7. Buat username dan password untuk mengakses repository melalui web. Debian menggunakan script htpasswd2. Distro Anda mungkin berbeda.

    
    
            # htpasswd2 -mc /etc/apache2/svnusers endy
    


    Lihat manual htpasswd untuk lebih jelasnya. 

8. Edit konfigurasi dav_svn. Intinya adalah, kita harus menambahkan Virtual Directory di Apache. Teknik konfigurasi yang 'benar' berbeda di masing-masing distro. 
Untuk cara paling mudah, tulis saja langsung di bagian paling bawah file httpd.conf.
Di Debian, cara paling 'bersih' adalah membuat file konfigurasi sendiri di folder /etc/apache2/mods-available. 

    Berikut adalah konfigurasi dav_svn. Pastikan file ini diload oleh Apache.

    
    
            <Location /svn>
            DAV svn
            SVNPath /home/endy/svnrepo
            AuthType Basic
            AuthName "Subversion Web Authentication"
            AuthUserFile /etc/apache2/svnusers
            AuthzSVNAccessFile /etc/apache2/dav_svn.authz
            Require valid-user
            </Location>
    


9. Mengaktifkan koneksi https

    * [Buat sertifikat](http://www.eclectica.ca/howto/ssl-cert-howto.php), menghasilkan file svn.cert.pem dan svn.key.pem

    * Aktifkan mod_ssl pada Apache. Caranya berbeda sesuai distro. Di debian adalah dengan cara dengan cara membuat symlink mod\_ssl.conf dan mod\_ssl.load ke folder /etc/apache2/mods-enabled

    * Edit konfigurasi default website (/etc/apache2/sites-available/default).
    
    
    
        SSLEngine on
        SSLCertificateFile /etc/apache2/ssl/svn.cert.pem
        SSLCertificateKeyFile /etc/apache2/ssl/svn.key.pem
        SetEnvIf User-Agent ".*MSIE.*" nokeepalive ssl-unclean-shutdown
        



    * Buka koneksi di port 443 dengan cara mengedit konfigurasi Apache dan menambahkan baris berikut :

    
    
    Listen 443



    * Restart apache


    Seharusnya sekarang repository kita sudah bisa :

    * diakses melalui ssh 
    * diakses melalui https dengan memasukkan username dan password yang benar


Selamat mencoba.


Referensi :

* [Setting up a secure server with Apache and mod-ssl](http://www.debian-administration.org/articles/31)

* [Debian, Apache2 and SSL](http://www.ianmiller.net/article.php?id=13)
