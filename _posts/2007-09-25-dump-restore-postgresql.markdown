---
comments: true
date: 2007-09-25 15:01:48
layout: post
slug: dump-restore-postgresql
title: Dump Restore PostgreSQL
wordpress_id: 275
categories:
- aplikasi
---

Pada tahap implementasi, fitur dump-restore database sangat penting. Dengan fitur ini, kita bisa melakukan migrasi data di mesin development, melakukan troubleshoot, data cleansing, dan sebagainya dengan tenang. Begitu sudah selesai, kita dump struktur tabel berikut datanya dari mesin development, kemudian buat database baru di mesin production, lalu restore. 

Agar tidak lupa, berikut saya tulis rangkaian langkah-langkahnya. Diasumsikan kita sudah memiliki database development dengan parameter sebagai berikut: 



	
  * Nama Database : buku_tamu_devel

	
  * Username : belajar

	
  * Password : java

	
  * File hasil dump : buku_tamu-dump-sql



Untuk melakukan dump, berikut adalah perintahnya: 


    
```
pg_dump -CdD  -Fp -U belajar buku_tamu_devel > buku_tamu-dump.sql
```



Penjelasannya sebagai berikut: 



	
  * pg_dump : adalah aplikasi command line untuk melakukan import

	
  * C : opsi untuk create semua tabel. Selain opsi C, kita juga bisa menggunakan opsi c, yaitu DROP dulu tabelnya baru kemudian CREATE. Pada skenario ini, file dump akan diaplikasikan ke database baru, jadi tidak perlu DROP dulu tabel-tabel yang sudah ada.

	
  * d : opsi untuk mengisi data. Bila ada opsi ini, pg_dump akan menghasilkan statement INSERT dari data yang sudah ada.

	
  * D : opsi untuk menulis nama kolom. Dengan opsi ini, di statement INSERT akan ada nama kolom. 

	
  * Fp : format hasilnya adalah plain text

	
  * U : username untuk koneksi ke database



Selanjutnya, tiba saat melakukan restore. Parameternya sama dengan database development, kecuali nama databasenya adalah `buku_tamu_prod`. Bila database belum ada, buat dulu dengan user postgres. 

    
```
$ sudo su - postgres
$ createdb buku_tamu_prod
CREATE DATABASE
$ exit
```
    



Baru setelah itu kita lakukan restore. 


    
```
psql -d buku_tamu_prod -U belajar -f buku_tamu-dump.sql
``` 



Penjelasan opsinya adalah sebagai berikut: 




	
  * d : nama database yang akan direstore

	
  * U : username yang digunakan untuk koneksi

	
  * f : file dump



Bila tidak ada pesan error, struktur tabel dan data seharusnya sudah masuk ke database baru.
