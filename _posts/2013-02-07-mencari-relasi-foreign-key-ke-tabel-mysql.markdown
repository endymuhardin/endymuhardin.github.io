---
layout: post
title: "Mencari Relasi Foreign Key ke Tabel MySQL"
date: 2013-02-07 15:24
comments: true
categories: 
- java
---

Di aplikasi yang kita buat, biasanya ada fitur untuk menghapus data atau record tertentu. 
Bila kita menggunakan database relasional yang memiliki fitur _referential integrity_, 
kita akan dicegah bila data yang ingin kita hapus memiliki relasi ke data lain. 

Contohnya, kita punya tabel `Produk`, yang kolom `id`nya digunakan sebagai _foreign key_
oleh tabel `Penjualan`. 
Dengan demikian, pada waktu ingin menghapus data `Produk`, terlebih dulu kita cek ke tabel 
`Penjualan`, apakah ada data transaksi yang berelasi ke `Produk` yang ingin kita hapus.

Akan menjadi masalah bila aplikasi kita sudah besar, tabelnya ada ratusan.
Bagaimana cara kita mencari tabel mana saja yang memiliki relasi ke tabel `Produk`?
Tentunya tidak mungkin dicek satu-persatu.

Dengan bantuan paman Google, berikut adalah cara mendapatkannya untuk database MySQL.

<!--more-->

Pertama, login dulu ke MySQL 

```
mysql -u root -p
Password: 
mysql>
```

Kemudian, gunakan database `information_schema`

```
use information_schema
```

Terakhir, jalankan query SQL berikut

```sql
SELECT TABLE_NAME,COLUMN_NAME,CONSTRAINT_NAME,
REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME 
FROM KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_NAME = 'produk' 
AND REFERENCED_COLUMN_NAME = 'id' 
AND TABLE_SCHEMA='db_penjualan';
```

Inilah hasilnya

```
+-------------------------------------------------------------------------------------------+
| TABLE_NAME         | COLUMN_NAME | CONSTRAINT_NAME     | REFERENCED_TABLE_NAME | REFERENCED_COLUMN_NAME |
+-------------------------------------------------------------------------------------------+
| penjualan          | id_produk   | fk_penjualan_produk | produk                | id                     |
| stok               | id_produk   | fk_stok_produk      | produk                | id                     |
+-------------------------------------------------------------------------------------------+
```

Penjelasan: 

* Table Name : Nama Tabel yang memiliki referensi
* Column Name : Nama Kolom yang merupakan _foreign key_
* Constraint Name : Nama constraint _foreign key_
* Referenced Table Name : Nama tabel yang dituju
* Referenced Column Name : Nama kolom yang dituju _foreign key_

Demikian sekilas tutorial. Semoga bermanfaat dalam membuat validasi.

