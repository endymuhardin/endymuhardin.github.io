---
layout: post
title: "Membuat Audit Log"
date: 2012-10-24 11:44
comments: true
categories: 
- java
---

# Membuat Audit Log dalam Aplikasi #

Dalam membuat aplikasi bisnis, kita sering diminta membuat audit log.

> Apa itu audit log?

Audit log adalah catatan mengenai perubahan data dalam aplikasi.
Yang dicatat biasanya : 

- kolom mana yang berubah
- siapa yang mengubah
- diubah dari apa menjadi apa
- kapan dia berubah

<!--more-->

Dengan menggunakan [Hibernate Envers](http://docs.jboss.org/hibernate/orm/4.1/devguide/en-US/html/ch15.html), 
audit log ini bisa dibuat dengan mudah sekali.
Hibernate Envers adalah salah satu modul tambahan [Hibernate](http://hibernate.org/) untuk keperluan ini.
Tentunya aplikasi kita harus menggunakan Hibernate supaya bisa memanfaatkan fitur ini.

## Konfigurasi Awal ##

Konfigurasi dan setup awal sangat mudah, yaitu:

1. Tambahkan JAR hibernate-envers ke dalam aplikasi
2. Tambahkan anotasi `@Audited` di class `@Entity` kita.

Contoh perubahan ini bisa dilihat [di sini](https://github.com/endymuhardin/belajar-auditlog/commit/05ca0c7c90b10cf64560d4cec933774aa91a8a81). 

## Audit Log Sederhana ##

Entity class yang sudah ditambahi dengan annotation `@Audited` tampak seperti ini:

```java Kategori.java
@Entity @Audited
@Table(name="m_kategori")
public class Kategori {
    @Id @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer id;
    
    @Column(nullable=false, unique=true)
    private String kode;
    private String nama;
    
    // getter setter tidak ditampilkan
}
```

Pada awalnya, mapping di atas akan menghasilkan skema database seperti ini:

```sql
CREATE TABLE `m_kategori` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kode` varchar(255) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode` (`kode`)
) ENGINE=InnoDB;
```

Setelah ditambahi `@Audited`, Envers akan menambahkan satu tabel untuk keperluan audit log `m_kategori` dengan nama tabel ditambahi akhiran `_AUD` dan memiliki skema seperti ini:

```sql
CREATE TABLE `m_kategori_AUD` (
  `id` int(11) NOT NULL,
  `REV` int(11) NOT NULL,
  `REVTYPE` tinyint(4) DEFAULT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`,`REV`),
  KEY `FK4263149C625F360` (`REV`),
  CONSTRAINT `FK4263149C625F360` FOREIGN KEY (`REV`) REFERENCES `REVINFO` (`id`)
) ENGINE=InnoDB;
```

Kolom dalam tabelnya tidak jauh berbeda, dengan perbedaan sebagai berikut:

* tambahan kolom `REV` yang menunjukkan urutan perubahan. 
    Nilai `REV` ini tidak berurut karena penambahannya (increment) sharing dengan semua tabel lain.
    Bisa saja `REV` `1` mencatat perubahan di `m_kategori` sedangkan `REV` `2` mencatat perubahan `m_produk`.

* kolom `REVTYPE` yang menunjukkan jenis perubahan. 
    Nilainya `0` untuk **insert** record baru, `1` untuk **modifikasi**, dan `2` untuk **hapus**

* kolom `id` tidak lagi menjadi primary key sendirian, tapi bersama dengan kolom `REV`

Kita juga lihat ada relasi ke tabel `REVINFO`. Skemanya sebagai berikut:

```sql
CREATE TABLE `REVINFO` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```

Kolom `id` merupakan nilai yang bertambah terus (auto increment). Tabel ini akan diisi setiap kali ada revisi di tabel yang dipantau oleh Envers seperti tabel `m_kategori` kita di atas. 
Tabel ini dishare oleh semua tabel audit log sehingga untuk satu tabel yang sama, nomer `REV` belum tentu berurutan. Bisa saja diselingi oleh nomer `REV` yang berkaitan dengan tabel lain. Kolom `timestamp` menunjukkan kapan revisi terjadi.

Untuk lebih memahami penggunaan tabel-tabel ini, mari kita lihat isi datanya.

Pertama, kita jalankan kode berikut dari aplikasi kita:

```java
@Test
public void testCrudKategori() {
    Kategori k = new Kategori();
    k.setKode("K-999");
    k.setNama("Kategori 999");

    assertNull(k.getId());
    belajarService.simpan(k);
    assertNotNull(k.getId());
    
    k.setKode("K-999-X");
    k.setNama("Kategori 999-X");
    belajarService.simpan(k);
    Kategori kx = belajarService.cariKategoriById(k.getId());
    assertEquals("K-999-X", kx.getKode());
    assertEquals("Kategori 999-X", kx.getNama());
    
    belajarService.hapus(k);
    assertNull(belajarService.cariKategoriById(k.getId()));
}
```

Operasi di atas akan mengisi tabel audit sebagai berikut:

```
select * from m_kategori_AUD order by id,REV,REVTYPE;
+-----+-----+---------+---------+-----------------------+
| id  | REV | REVTYPE | kode    | nama                  |
+-----+-----+---------+---------+-----------------------+
| 101 |   2 |       0 | K-999   | Kategori 999          |
| 101 |   3 |       1 | K-999-X | Kategori 999-X        |
| 101 |   4 |       2 | NULL    | NULL                  |
+-----+-----+---------+---------+-----------------------+
```

Data dengan `REV` `1` dan `2` tidak ditampilkan karena mencatat record lain.
Dari isi tabel ini, kita bisa melihat bahwa terjadi tiga kali operasi pada record kategori dengan id 101, yaitu:

1. Insert record baru. `REVTYPE` berisi `0`, artinya record baru. Kolom id, kode, dan nama berisi nilai yang pertama diisi.
2. Update kode dan nama. `REVTYPE` berisi `1`, artinya modifikasi. Kolom kode dan nama diisi dengan nilai setelah modifikasi
3. Delete record. `REVTYPE` berisi `2`, artinya hapus. Kolom kode dan nama diisi null karena datanya sudah tidak relevan (karena record dihapus).

Berikut isi tabel `REVINFO`

```
select * from REVINFO;
+----+---------------+
| id | timestamp     |
+----+---------------+
|  2 | 1351521839648 |
|  3 | 1351521839718 |
|  4 | 1351521839801 |
+----+---------------+
```

Karena hanya mencatat timestamp saja, maka tidak ada yang perlu dijelaskan mengenai isi tabel `REVINFO`.

## Penambahan informasi yang ingin dicatat ##

Secara default, Hibernate Envers hanya mencatat data yang berubah dan kapan dia berubah. 
Untuk menambahkan catatan tentang username, perlu ada sedikit coding seperti bisa dilihat [di sini](https://github.com/endymuhardin/belajar-auditlog/commit/e910b6bc5ef33ee61f0137c8297b0f2ec4f502fe). Kita harus :

1. Extends `DefaultRevisionEntity` dan menambahkan kolom username
2. Membuat `RevisionListener` untuk mengisi kolom username tersebut

Data username biasanya diambilkan dari user yang sedang login di aplikasi (dan dengan sendirinya dialah yang melakukan perubahan data).

Setelah dilakukan dua modifikasi di atas, skema REVINFO menjadi sebagai berikut:

```sql
CREATE TABLE `REVINFO` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` bigint(20) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```

Berikut yang sudah terisi data:

```
select * from REVINFO;
+----+---------------+----------+
| id | timestamp     | username |
+----+---------------+----------+
|  1 | 1351521839220 | endy     |
|  2 | 1351521839648 | endy     |
|  3 | 1351521839718 | endy     |
|  4 | 1351521839801 | endy     |
|  5 | 1351521840174 | endy     |
|  6 | 1351521840571 | endy     |
|  7 | 1351521840959 | endy     |
|  8 | 1351521841351 | endy     |
+----+---------------+----------+
```

## Penyesuaian Lain ##

Selain penambahan kolom yang ingin dicatat, biasanya kita juga ingin melakukan penyesuaian lain seperti:

* akhiran di nama tabel audit (`_AUD`)
* nama kolom nomer revisi (`REV`)
* nama kolom jenis revisi (`REVTYPE`)
* dan sebagainya

Keterangan apa saja yang bisa diubah dan cara mengubahnya dapat dilihat di [dokumentasi konfigurasi Envers](http://docs.jboss.org/hibernate/orm/4.1/devguide/en-US/html/ch15.html#d5e3937).

Contoh kode yang lengkap bisa diambil di [repository saya di Github](https://github.com/endymuhardin/belajar-auditlog).
