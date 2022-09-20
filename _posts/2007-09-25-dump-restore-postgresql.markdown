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

  * Nama Database : `buku_tamu`
  * Username : `belajar`
  * Password : `java`
  * File hasil dump : `buku_tamu-schema-20070925-2021.sql` dan `buku_tamu-data-20070925-2021.sql`

Untuk melakukan dump skema tabel, berikut adalah perintahnya: 
    
```
pg_dump --schema-only --no-owner -h localhost --username belajar buku_tamu | grep -v "^--"  > buku_tamu-schema.sql && sed -i '/^SET/d' buku_tamu-schema.sql && sed -i '/^SELECT/d' buku_tamu-schema.sql && mv buku_tamu-schema.sql buku_tamu-schema-`date +%Y%m%d-%H%M`.sql
```

Penjelasannya sebagai berikut: 

  * `--pg_dump` : adalah aplikasi command line untuk melakukan import
  * `--schema-only` : hanya membuat DDL statement, tanpa data
  * `--no-owner` : tidak perlu mengatur kepemilikan tabel dan view
  * `-h` : supaya koneksi dilakukan melalui TCP/IP, bukan Unix socket
  * `grep -v "^--"` : menghilangkan baris-baris comment di file hasil backup
  * `sed -i '/^SET/d'` : menghilangkan command-command `SET` yang kita tidak perlukan
  * `sed -i '/^SELECT/d'` : menghilangkan command-command `SELECT` yang kita tidak perlukan

Untuk melakukan dump data dalam database, berikut adalah perintahnya:

```
pg_dump --column-inserts --data-only -h localhost -U belajar buku_tamu | grep -v "^--" > buku_tamu-data.sql  && sed -i '/^SET/d' buku_tamu-data.sql && sed -i '/^SELECT/d' buku_tamu-data.sql && mv buku_tamu-data.sql buku_tamu-data-`date +%Y%m%d-%H%M`.sql
```

Penjelasannya sebagai berikut: 

  * `--column-inserts` : mencantumkan nama kolom dalam statement insert data
  * `--data-only` : hanya membuat `INSERT` statement

Selanjutnya, tiba saat melakukan restore. Parameternya sama dengan database development, kecuali nama databasenya adalah `buku_tamu_prod`. Bila database belum ada, buat dulu dengan user postgres. 

```
$ sudo su - postgres
$ createdb buku_tamu_prod
CREATE DATABASE
$ exit
```
    
Baru setelah itu kita lakukan restore. 

```
psql -h localhost -d buku_tamu_prod -U belajar -f buku_tamu-schema-20070925-2021.sql.sql
psql -h localhost -d buku_tamu_prod -U belajar -f buku_tamu-data-20070925-2021.sql.sql
``` 

Penjelasan opsinya adalah sebagai berikut: 

  * `-h` : supaya connect melalui TCP/IP, bukan lewat Unix socket
  * `-d` : nama database yang akan direstore
  * `-U` : username yang digunakan untuk koneksi
  * `-f` : file dump

Bila tidak ada pesan error, struktur tabel dan data seharusnya sudah masuk ke database baru.