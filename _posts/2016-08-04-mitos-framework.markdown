
---
layout: post
title: "Mitos Framework"
date: 2016-08-04 17:00
comments: true
categories: 
- programming
---

Saya perhatikan, mungkin sekitar sebulan sekali, di grup facebook PHP akan muncul perdebatan berikut:

> Mendingan pakai framework atau tanpa framework (istilahnya di grup sana : native)

Well, daripada tiap bulan saya komen yang sama-sama terus, mending tulis di sini sekali. Lumayan paste link sebulan sekali, naikin pageview :D

Oke, beberapa mitos dan salah paham tentang urusan framework vs native ... Jreng jreng ...

<!--more-->

## Pake Framework berarti tidak (perlu) paham Native ##

Banyak orang yang menganggap kalau pakai Eloquent (PHP), ActiveRecords (Ruby), Hibernate (Java), gak perlu lagi paham SQL, relasi database, join, primary-foreign key, dan teman-temannya.

> Salah besar gan !!!

Yang benar, kita *gak perlu menulis SQL*. Beda ya *gak perlu nulis* sama *gak perlu paham*. Bukan beti ini (beda tipis), tapi beda banget.

> Gak percaya? 

Panjang jelasinnya gan. Coba deh google pake beberapa keyword ini:

* lazy loading
* n+1 problem
* cartesian problem

Itu masalah dan dilema yang terjadi kalau kita pakai framework akses database. Untuk bisa paham apa artinya dan bagaimana solusinya, kudu paham SQL dan konsep relasional database.

Jadi gak asal pake-pake aja gan. Iya kali situ main pake-pake aja buat bikin PR sekolah atau skripsi, gak paham jeroannya. Kalo yang udah kerja beneran, bikin aplikasi production, bener-bener aplikasinya dipake orang banyak, sekalinya error yang ngamuk 100 cabang se-Indonesia Raya atau rame di social media, pastinya arsiteknya paham lah luar dalam frameworknya.


## Pake Native lebih pintar/hebat daripada pake Framework ##

Ini ada hubungan dengan mitos pertama. Dianggapnya kalo pake framework, tinggal pake, gak perlu ngerti konsep dasar. Jadi kalo native pasti lebih ngerti pemrograman, algoritma, query, performance tuning, dan lain sebagainya.

Kalo menurut saya sih, yang beranggapan kayak gini kurang jam terbang aja. Coba nanti udah bikin lebih dari 3 aplikasi deh, gak usah banyak-banyak. Misalnya, 

* project pertama : dapat order bikin aplikasi kayak tokopedia/bukalapak
* project kedua : dapat order bikin aplikasi monitoring CCTV lewat web
* project ketiga : suruh bikin aplikasi penerimaan siswa baru

Dari ketiga project ini (dan semua project selanjutnya), pasti ada user management dan login kan ya?

> Nah, siapa orangnya yang di project keempat, masih mau coding user management dan login dari nol? Ayo tunjuk tangan ...

Coba kalo udah sampe sini. Mendingan belajar NoSQL atau masih mau `select * from tbl_user where username = $user` ?

Pinteran mana yang ngabisin waktu implement ulang fitur sama yang pakai framework trus waktunya dipake belajar MongoDB?

> So, pake framework itu bukan gara2 kurang pinter gan. Males aja ngabisin masa remaja coding itu-itu terus.

Jangan dibandingin sama temen kos agan yang bikin skripsi pake Laravel lah.

## Pake Native hasilnya lebih bagus daripada pakai Framework ##

Bagus di sini sering diartikan:

* lebih hemat resource (memori, CPU, harddisk, bandwidth)
* response lebih cepat
* query lebih efisien
* bugnya lebih sedikit
* dan sebagainya

Ya iya kali gan kalo yang bikin framework model-model saya gini yang kurang ilmu apalagi amalnya. Lah ini yang bikin framework orang-orang terhebat di bidangnya. 

Contohnya, framework akses database di Java. Namanya Hibernate. Kemampuannya, dia bisa generate SQL untuk berbagai merek dan versi database. Sekali tulis program, bisa jalan di MySQL versi 3, 4, 5 atau PostgreSQL versi 8, 9, dan merek lain seperti Oracle, SQL Server, DB2, dan masih banyak lagi. Pokoknya semua merek database populer dia bisa deh.

Nah, SQL yang dia generate, itu kan pastinya dicoding sama yang bikin Hibernate. Bikinnya rame-rame, namanya juga aplikasi open source. Jadi yang bikin generator SQL ke MySQL beda orang dengan yang bikin generator Oracle. Yang nulis generator MySQL orang yang udah puluhan tahun bikin SQL query buat MySQL. Demikian juga yang coding generator Oracle orang yang udah malang melintang bikin puluhan aplikasi pakai Oracle.

Jangan dibayangin pembuat framework kayak model-model agan, mau join tiga tabel aja nanya di fesbuk. Yang model gini sih, SQL yang dia tulis belum tentu lebih bagus daripada hasil generate framework :P

Quick test aja gan. Kalo ente nulis SQL, apa udah mikirin:

* SQL injection
* [Database Transaction](http://software.endy.muhardin.com/java/database-transaction/)
* Optimasi generator primary key
* Pagination

Nah yang bikin framework populer itu udah mikirin hal-hal kayak gini. Pada saat artikel ini ditulis, Spring Framework udah versi 4, Hibernate versi 5, Laravel versi 5, Code Igniter versi 3, Ruby on Rails versi 5. Itu nomor versi sampe 5 gitu artinya udah ribuan bug yang difix, ribuan performance problem yang dituning, ribuan skenario aneh-aneh yang direquest user dan udah dibikinin.

Kalo masih nulis SQL model kayak gini ya kaga usah ngomong coding native lebih kenceng/bagus/sedikit bug gan.


```php
$kueri = 'select password from tbl_user where username = '.$_POST["username"];
```

atau versi Java

```java
String kueri = "select password from tbl_user where username = "+req.getParameter("username");
```

## Pake Native lebih fleksibel, Framework kaku ##

Yang punya klaim kayak gini, coba kasi contoh real world, fleksibilitas seperti apa yang mau dibikin, dan framework mana yang gak bisa akomodasi?

Pada sebagian besar kasus, yang berpendapat gini biasanya belum paham frameworknya. Sehingga dikira gak bisa, padahal fiturnya ada, dia aja yang belum baca dokumentasinya.

Contohnya relasi database. Framework Hibernate mendukung relasi:

* one to many biasa
* one to many dengan join table
* inheritance dengan single table
* inheritance, satu tabel per class
* dan kasus-kasus eksotik lainnya

Kurang fleksibel gimana lagi? Coba kasus mana yang gak ada solusinya?

Pada kasus sisanya, dia mencoba menggunakan framework tidak sesuai peruntukannya. Atau dia pengen melakukan hal yang semestinya tidak dilakukan, baik pakai framework ataupun ngga.

Contohnya:

> Pake Laravel ribet, masa gak bisa otomatis field di HTML masuk ke Model?

Bisa, di Laravel harus bikin variabel `$fillable`. Kalo bahasa di Rails, `$fillable` ini namanya `param permit`.

Nah, ini hal yang semestinya gak dilakukan. Ada security hole pada proses mass assignment.

> Apa itu mass assignment? Apa problemnya?

Nah good question. Silahkan digoogle sendiri apa itu mass assignment problem. Coba kamu bikin aplikasi tanpa framework. Kepikiran gak masalah ini?

Yang bikin framework udah kepentok masalah ini, dan udah bikin solusinya. Lah kalo istilahnya aja baru denger sekarang, masa iya udah terpasang solusinya di coding native yang kamu bikin?

Di 0.0001% kasus sisanya, mungkin memang ada skenario yang kita mau kerjain, dan belum disediakan sama framework. Trus gimana?

> Framework yang populer dan banyak digunakan orang, biasanya open source. Artinya source code ada, tersedia, bisa dimodif sesuka hati. Ya bikinlah solusinya.

## Penutup ##

Ini bukan belain framework dan native jelek ya. Cuma kebanyakan yang komentar framework jelek saya liat belum cukup melihat dunia. Coba deh bikin aplikasi barang 5 biji aja. Nanti baru paham plus minusnya.

Jangan baru bikin peer sekolah satu aplikasi, itupun [kualitasnya prakarya](http://software.endy.muhardin.com/manajemen/aplikasi-prakarya-vs-aplikasi-production/), trus komentar. Bukan apa-apa, kasian nanti menyesatkan orang.

Jangan juga karena males baca, males nyoba, susah dikit nyerah, trus berkesimpulan native lebih baik daripada framework. Kasian agan sendiri, gak maju-maju nanti hidupnya.

Ada banyak pertimbangan orang kenapa pakai framework, diantaranya:

* Konsistensi struktur. Misalnya kita udah bikin 4 aplikasi, gak pake framework. Kira-kira struktur foldernya sama gak antar aplikasi? Pastinya gak sama. Trus kalo disuruh nambah fitur lagi di aplikasi pertama, susah atau gampang mengingat lagi struktur kode programnya?
* Teamwork. Misalnya projectnya agak gede, dikerjain 3 orang, gak pake framework. Kira-kira seragam gak cara codingnya? Trus pas yang 1 orang sakit/resign/bosen/sibuk nyari pokemon, trus kita ganti orang baru, susah atau gampang transisinya? Emang mau tiap ada orang baru ngajarin lagi?

> Jadi, kita harus selalu pake framework dong??

Ya kalo peer sekolah, tugas kuliah, disuruh dosen jangan pake framework, ya jangan dipake. Bedain peer sekolah sama kerjaan. Tugas sekolah itu tujuannya biar ngerti. Kalo disuruh bikin aplikasi webmail, ya kerjain tuh parsing protokol POP3 dan IMAP. Jangan pakai library. Biar paham kalo mau ambil email, commandnya apa, mau hapus email sintaksnya gimana. Biar ngerti request HTTP itu gimana formatnya, response header apa artinya.

Kalo kerjaan komersil, harus deliver aplikasi ke client, on time, on budget, harus secure, performance kenceng, fungsi jalan bener, ya pake framework.

Paling penting, jangan ngejudge begini begitu padahal belum baca dokumentasi, belum pernah ngerjain kerjaan berbayar, belum pernah kerja tim, belum pernah maintain aplikasi bertahun-tahun.

Nah, demikian sedikit sharing. Semoga manfaat :D