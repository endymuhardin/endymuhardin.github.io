---
comments: true
date: 2008-09-03 16:54:21
layout: post
slug: instalasi-trac
title: Instalasi Trac
wordpress_id: 359
categories:
- linux
---

Mulai beberapa minggu ini, ArtiVisi kebanjiran project. Ini tentu harus dikelola dengan baik. Semua orang harus bekerja se-efisien mungkin. Menjadi tugas saya sebagai manager untuk memudahkan orang-orang bekerja. 

Opa Abe Lincoln pernah bilang gini, jauh sebelum mas Barry masuk sekolah di SD Besuki, Menteng.



> If I had eight hours to chop down a tree, I'd spend six hours sharpening my axe



So be it .... 

Hal pertama yang harus dilakukan sebelum mulai bekerja adalah mempersiapkan environment. Ada beberapa tools yang dapat digunakan untuk mempercepat kegiatan software development, terutama di Java. Ini pernah saya bahas di [artikel ini](http://endy.artivisi.com/blog/manajemen/starter-kit/).  

[Subversion sudah terinstal](http://endy.artivisi.com/blog/aplikasi/instalasi-subversion/) sejak hari pertama ArtiVisi buka warung. Bahkan sebelum websitenya jadi, repository sudah siap digunakan dan [diamankan melalui prosedur backup](http://endy.artivisi.com/blog/aplikasi/svn-parentpath-backup/). Ant-Ivy juga sudah terinstal dan terkonfigurasi. Tinggal menunggu terisi dengan *.jar external dari [repository ibiblio](http://www.ibiblio.org/maven/) dan [repository springsource](http://www.springsource.com/repository/).

Hal berikutnya adalah mempersiapkan bug tracker dan project management tools. Karena saya menggunakan Eclipse, maka kriteria pemilihan bug tracker tentu saja adalah kompatibilitasnya dengan [Mylyn](http://www.eclipse.org/mylyn/). [Bugzilla](http://www.bugzilla.org/) cuma bisa untuk bug-tracker, jadi saya pilih saja [Trac](http://trac.edgewall.org/). 

Berikut langkah instalasi di Ubuntu Gutsy Server. 





### Instalasi Trac


Instalasi Trac tidak sulit, cukup satu baris perintah saja. 

    
    
    sudo apt-get install trac libapache2-mod-python python-setuptools
    



Selanjutnya, kita konfigurasi VirtualHost Apache. Saya buatkan satu subdomain khusus yang namanya trac.artivisi.com. Jadi, kita buat file `/etc/apache2/sites-available/trac.artivisi.com`. 

Subdomain ini nantinya akan menampung data Trac untuk banyak project. Jadi, kita harus mengkonfigurasi parent path yang menyatakan folder tempat data trac untuk masing-masing project disimpan. 

Berikut isi filenya.


    
    
     <Location /trac>
        
    	SetHandler mod_python
    	PythonHandler trac.web.modpython_frontend
    	PythonOption TracEnvParentDir /var/lib/trac
    	PythonOption TracUriRoot /trac
        
     </Location>
    



Selanjutnya, kita konfigurasi otentikasinya supaya mengacu ke LDAP tempat menyimpan username dan password Subversion. Jadi username dan password untuk svn commit sama dengan untuk login ke Trac.


    
    
     <LocationMatch "/trac/[^/]+/login">
        
    	AuthType Basic
    	AuthName "ArtiVisi Trac Server"
    	
    	AuthBasicProvider ldap
            AuthLDAPURL url-ldap-server
    	AuthLDAPBindDN dn-untuk-apache-login-di-ldap
    	AuthLDAPBindPassword password-dn-tersebut
      
    	AuthzLDAPAuthoritative off
    	
    	Require valid-user
        
     </LocationMatch>
    



Sekarang konfigurasi Apache sudah selesai. Jangan lupa me-restart apache. 


    
    sudo /etc/init.d/apache2/restart



Berikutnya, membuat project baru. 



### Membuat Project


Misalnya kita ingin membuat project bernama hello-world. Sebagai root, masuk ke folder /var/lib/trac. Kemudian buat projectnya. Jangan lupa tambahkan user administratornya sekaligus.Terakhir, ganti kepemilikan folder sesuai dengan user yang digunakan proses webserver. 

    
    
    sudo -i
    cd /var/lib/trac
    trac-admin hello-world initenv
    trac-admin hello-world permission add endy TRAC_ADMIN
    chown -R www-data.www-data hello-world
    



Langkah di atas akan menginisialisasi Trac dengan satu username --yaitu endy-- sebagai administrator. Selanjutnya, kita edit konfigurasinya agar setiap perubahan bug/task akan mengirim notifikasi ke email. Edit file /var/lib/trac/hello-world/conf/trac.ini


    
    
    
    smtp_enabled = true
    smtp_default_domain = artivisi.com
    smtp_from_name = ArtiVisi Trac Server
    smtp_from = artivisi.dev@gmail.com
    smtp_replyto = artivisi.dev@gmail.com
    
    smtp_server = smtp.gmail.com
    smtp_port = 587
    smtp_user = artivisi.dev
    smtp_password = rahasia_dong
    use_tls = true
    
    



Pada konfigurasi di atas, kita menggunakan Gmail yang gratis dan mudah. Kita buat account di Gmail bernama artivisi.dev dan kita berikan password rahasia_dong. 

Selesai sudah. Sekarang silahkan browse ke URLnya. 



### Plugin WebAdmin



Sebagai tambahan, kita bisa menambahkan plugin webadmin supaya kita bisa menambah user dan mengatur permission melalui interface web. 

Ubuntu secara default menginstal Trac versi 0.10, jadi kita harus menginstal plugin WebAdmin secara manual. Di versi 0.11 Trac sudah menyertakan WebAdmin secara default. 

Instalasi dijalankan langsung dari subversion repository. 

    
    
    sudo easy_install http://svn.edgewall.org/repos/trac/sandbox/webadmin/
    



Untuk menjalankan plugin, kita perlu membuat file `/etc/trac/trac.ini`. Berikut isinya. 

    
    
    [components]
    webadmin.* = enabled
    



Voila, nanti akan muncul tombol admin setelah kita login.
