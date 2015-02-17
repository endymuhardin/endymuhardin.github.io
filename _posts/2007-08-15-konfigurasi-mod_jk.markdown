---
comments: true
date: 2007-08-15 15:52:26
layout: post
slug: konfigurasi-mod_jk
title: Konfigurasi mod_jk
wordpress_id: 260
categories:
- aplikasi
---

Ada kalanya, kita ingin mempublikasikan aplikasi Java kita melalui Apache HTTPD, webserver paling populer dan paling banyak digunakan di dunia. 

Beberapa alasan untuk melakukan ini antara lain: 




  * Kita ingin menjalankan Tomcat dalam cluster, diakses melalui satu pintu gerbang, yaitu Apache HTTPD


  * Kita tidak ingin membuka port 8080 ke seluruh dunia, cukup buka port 80 dan 443 saja. Sedangkan di port 80 sudah ada aplikasi lain (PHP, Rails, whatever) yang dihosting di atas Apache HTTPD


  * Kita ingin melayani static page dengan Apache HTTPD, dan dynamic page dengan Tomcat


  * Dan masih banyak alasan lain.



Konfigurasi ini saya lakukan di Ubuntu Feisty 7.04. Langkah-langkahnya relatif mirip untuk distro lain, yang kalau disimpulkan terdiri dari: 


  1. Install Apache


  2. Install Tomcat


  3. Deploy Aplikasi Java di Tomcat


  4. Install mod_jk


  5. Konfigurasi worker


  6. Konfigurasi virtual host



Baiklah, mari kita mulai saja. 




### Instalasi Apache


Saya gunakan Apache 2.2 yang disediakan oleh repository Ubuntu. Instalasi sangat mudah: 
`sudo apt-get install apache2`

Setelah instalasi selesai pastikan webserver sudah berjalan dengan baik dengan cara mengakses `http://localhost`



### Instalasi Tomcat


Kita bisa menginstal Tomcat melalui apt-get, tetapi saya lebih suka menggunakan cara manual. 
Unduh dari [situsnya](http://tomcat.apache.org), kemudian ekstrak di folder /opt. 

    
```
cd /opt
sudo tar xvzf apache-tomcat-xx.tar.gz
```



Setelah itu, jalankan Tomcat. 

    
```
sudo /opt/tomcat/bin/startup.sh
```



Jangan lupa mengatur environment variable `JAVA_HOME` ke tempat instalasi Java SDK Anda sebelum menjalankan Tomcat.

Periksa keberhasilan instalasi Tomcat dengan cara browse ke `http://localhost:8080`



### Deploy Aplikasi Java


Pada saat ini, kita sudah bisa mendeploy aplikasi Java ke Tomcat, tepatnya di folder `[TOMCAT_HOME]/webapps`. 
Untuk mudahnya, kita tidak akan instal aplikasi, tapi menggunakan tomcat-docs yang sudah disediakan Tomcat. 



### Install mod_jk


Instalasi mod_jk di Ubuntu sangat mudah, cukup lakukan `sudo apt-get install libapache2-mod-jk`

`mod_jk` akan diinstal dan langsung diaktifkan. 

Sebelum `mod_jk` bisa bekerja dengan benar, kita harus melakukan sedikit konfigurasi. Saya membuat file konfigurasi di `/etc/apache2/mods-available/jk.conf`. 
Letak file konfigurasi tidak penting, yang penting adalah file tersebut dibaca oleh Apache. Silahkan baca-baca manual konfigurasi untuk distro Anda

Berikut adalah isi file `/etc/apache2/mods-available/jk.conf`. 

    
```
JkWorkersFile /etc/apache2/mods-available/workers.properties
JkShmFile     /var/log/apache2/mod_jk.shm
JkLogFile     /var/log/apache2/mod_jk.log
JkLogLevel    info
JkLogStampFormat "[%a %b %d %H:%M:$S %Y] "
```



Seperti kita lihat di baris pertama, ada referensi ke file `workers.properties`. Kita akan bahas file ini di bagian selanjutnya.

Sisa file ini mendefinisikan konfigurasi log file. 



### Konfigurasi Workers


File `workers.properties` mendefinisikan semua worker yang tersedia. Worker adalah Tomcat yang akan melayani request ke aplikasi Java. Untuk mengaktifkan clustering, kita bisa mengkonfigurasi banyak worker sekaligus.
Saat ini, sebagai contoh kita akan mengkonfigurasi satu saja dulu. 

Berikut adalah isi file `workers.properties`

    
```
worker.list=worker1
worker.worker1.type=ajp13
worker.worker1.host=localhost
worker.worker1.port=8009
```





### Konfigurasi Virtual Host


Terakhir, kita akan mengkonfigurasi virtual host agar Apache HTTPD dapat melakukan forwarding dengan benar. Pada contoh ini, kita akan mengarahkan request ke `http://localhost/tomcat-docs` agar dilayani oleh Tomcat. Berikut konfigurasi Virtual Hostnya. 

    
``` xml
<VirtualHost>
    JkMount /tomcat-docs/* worker1
</VirtualHost>
```


Jika ingin mempublikasikan banyak aplikasi Java sekaligus, duplikasi saja baris `JkMount` di atas agar mengarah ke masing-masing aplikasi kita yang sudah dideploy di dalam folder `[TOMCAT_HOME]/webapps`. 

Konfigurasi virtual host di atas bisa digabungkan dengan konfigurasi lain seperti [repository Subversion](http://endy.artivisi.com/blog/aplikasi/instalasi-subversion/), Ruby on Rails, dan sebagainya. Cukup selipkan baris `JkMount` di dalam blok `VirtualHost`. 

Letak konfigurasi Virtual Host berbeda antar distro. Di keluarga Debian, konfigurasinya ada di folder `/etc/apache2/sites-available`.

Setelah selesai, coba restart Apache HTTPD. Kalau semua berjalan lancar, dokumentasi Tomcat yang tadinya hanya bisa diakses di `http://localhost:8080/tomcat-docs/` sekarang juga bisa diakses di `http://localhost/tomcat-docs/`. Perhatikan perbedaan portnya, yang belakangan dilayani oleh Apache HTTPD.

Selamat mencoba :D
