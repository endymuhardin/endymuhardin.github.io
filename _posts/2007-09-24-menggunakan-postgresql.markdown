---
comments: true
date: 2007-09-24 11:35:16
layout: post
slug: menggunakan-postgresql
title: Menggunakan PostgreSQL
wordpress_id: 273
categories:
- java
---

Saya baru saja memporting project yang sedang saya kerjakan, dari menggunakan [ikan lumba-lumba](http://www.mysql.org) menjadi [gajah](http://www.postgresql.org). Sebetulnya saya pernah menggunakan database gajah ini pada tahun 2005, tapi setelah itu jarang digunakan sehingga butuh waktu agak lama untuk melakukan porting ini. 

Agar lain kali tidak lupa lagi, baiklah saya tulis di sini saja. Mudah-mudahan bermanfaat juga untuk pembaca :D




### Instalasi


Saya menggunakan Ubuntu, jadi instalasi tidak sulit. Cukup lakukan:
`sudo apt-get install postgresql-8.2 `
Beres .. :D




### Konfigurasi Akses Jaringan


Selanjutnya, konfigurasi Postgre agar meminta password setiap ada koneksi masuk, termasuk dari localhost. Ini dilakukan agar konfigurasi JDBCnya tidak terlalu berbeda dengan konfigurasi sebelumnya yang menggunakan MySQL.

Ganti otentikasi dalam `pg_hba.conf` menjadi 

    
```
local   all         all                           password
host    all         all         127.0.0.1/32      password
host    all         all         ::1/128           password
```



Konfigurasi di atas artinya, koneksi ke semua database, dari local maupun remote, mintalah password. File `pg_hba.conf` ini lokasinya tergantung distro yang digunakan. Di tempat saya, ada di folder `/etc/postgresql/8.2/main`. Jangan lupa merestart PostgreSQL setelah memodifikasi file ini. 

    
```
sudo /etc/init.d/postgresql restart
```





### Menambahkan User


Untuk menambahkan user, kita perlu _menyamar_ sebagai user `postgres`.  Gunakan `su`. 
`sudo su - postgres`

Selanjutnya, jalankan perintah `createuser` dengan argumen P untuk meminta password.


    
```
createuser -P
Enter name of role to add: belajar
Enter password for new role: 
Enter it again: 
Shall the new role be a superuser? (y/n) n
Shall the new role be allowed to create databases? (y/n) y
Shall the new role be allowed to create more new roles? (y/n) n
CREATE ROLE
```



Perintah di atas menambahkan user dengan username `belajar` yang memiliki ijin untuk membuat database baru. 

Selanjutnya, keluar dari user postgres dengan menggunakan perintah `exit`. 



### Membuat Database


Agar bisa menyimpan data, kita harus punya database. Mari kita buat database yang namanya `buku_tamu`. Gunakan perintah `createdb` dengan argumen U untuk menyebutkan username. 


    
```
createdb -U belajar buku_tamu
Password: 
CREATE DATABASE
```



Setelah selesai, coba koneksi ke database tersebut. 

`psql -U belajar -d buku_tamu`



### Konfigurasi JDBC


Kalau sudah OK, berikut adalah konfigurasi JDBC untuk mengakses database tersebut. 

    
```
jdbc.driver      = org.postgresql.Driver
jdbc.url         = jdbc:postgresql://localhost/buku_tamu
jdbc.username    = belajar
jdbc.password    = java
```



Saya menggunakan Hibernate, sehingga butuh satu parameter lagi, yaitu dialek SQL yang digunakan. 

`hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect`

Dengan menggunakan Hibernate, maka porting database hanyalah perkara mengganti lima baris konfigurasi (bukan source code), dari seperti ini: 


    
```
jdbc.driver      = com.mysql.jdbc.Driver
jdbc.url         = jdbc:mysql://localhost/buku_tamu
jdbc.username    = belajar
jdbc.password    = java
hibernate.dialect=org.hibernate.dialect.MySQLInnoDBDialect
```



Menjadi seperti ini: 


    
```
jdbc.driver      = org.postgresql.Driver
jdbc.url         = jdbc:postgresql://localhost/buku_tamu
jdbc.username    = belajar
jdbc.password    = java
hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```



Oh iya, jangan lupa [unduh dulu driver JDBC untuk PostgreSQL](http://jdbc.postgresql.org/download.html). Saya menggunakan versi **8.2-506 JDBC 4**.

Demikian setup PostgreSQL agar bisa diakses dari Java.
