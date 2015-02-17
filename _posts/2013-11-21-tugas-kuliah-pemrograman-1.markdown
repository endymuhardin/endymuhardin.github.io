---
layout: post
title: "Tugas Kuliah Pemrograman 1"
date: 2013-11-21 19:54
comments: true
categories: 
- java
---

Pada posting sebelumnya, kita sudah membahas:

* [bagaimana cara belajar secara otodidak](http://software.endy.muhardin.com/life/otodidak/)
* [pentingnya menguasai konsep dasar / fundamental dari segala sesuatu](http://software.endy.muhardin.com/life/lan-na-zha/)
* pentingnya latihan [membaca dokumentasi](http://software.endy.muhardin.com/life/rtfm/), [menyelesaikan masalah](http://software.endy.muhardin.com/life/problem-solving/), dan [mencari solusi](http://software.endy.muhardin.com/aplikasi/teknik-menggunakan-google/)

> Lalu bagaimana kalau kita baru menguasai dasar-dasar Java? Bagaimana latihannya?

Nah, sebetulnya cuma masalah kreativitas saja. Banyak aplikasi yang bisa dibuat dengan teknik minimalis. Sebagai contoh, coba simak tugas kuliah yang saya berikan untuk mata kuliah Pemrograman 1 di Universitas Pancasila. Untuk bisa menyelesaikan tugas ini, skill yang dibutuhkan hanyalah:

* variabel dan tipe data
* looping (for,while) dan percabangan (if-else)
* menggunakan class `java.lang.String`
* baca/tulis file

Referensi yang dibutuhkan hanyalah:

* [Tutorial resmi dari Oracle](http://docs.oracle.com/javase/tutorial/index.html) atau [buku Java Desktop karangan Ifnu Bima](http://project-template.googlecode.com/files/Java%20Desktop%20-%20Ifnu%20Bima.pdf)
* [Dokumentasi API Java (JavaDocs)](http://docs.oracle.com/javase/7/docs/api/index.html)

Studi kasus pada tugas ini merupakan aplikasi yang benar-benar digunakan di dunia nyata.

Selamat mencoba.

> Update : tugas ini sudah saya kerjakan. Videonya bisa [dilihat di Youtube](http://www.youtube.com/playlist?list=PL9oC_cq7OYbx58s-eCBwP-5NxKnG8SHIr) dan source codenya bisa [dilihat di Github](https://github.com/endymuhardin/pemrograman-2-2013/tree/master/sample-code/aplikasi-payroll).

<!--more-->


# Deskripsi Aplikasi #

Aplikasi ini akan memproses perhitungan take home pay pegawai tiap bulannya. Tidak digunakan antarmuka pengguna (user interface) karena aplikasi bersifat `batch`, yaitu berjalan otomatis pada waktu yang ditentukan tanpa membutuhkan intervensi manusia. Input aplikasi berupa file text, dan outputnya juga berupa file text.

![Foto](http://lh5.googleusercontent.com/-zREpwzUHZVs/Uo4B8sUpjdI/AAAAAAAACT4/3HgNUTbbu1s/w909-h314-no/tugas-kuliah.jpg)

Pada pemakaian sebenarnya, data tarif gaji pegawai bisa diambil dari database. Data absensi diambil dari mesin fingerprint. Hasil perhitungan take home pay akan diupload ke bank untuk proses payroll otomatis.

# Proses Bisnis #

## Input dan Output ##

Aplikasi menerima input berupa file text sebagai berikut :

* `tarif.csv` : berisi nomer induk, nama, tarif gaji pokok, tarif denda, tarif lembur, tarif tunjangan transport
* `absen-MM.csv` : berisi nomer induk, tanggal, jam datang, jam pulang

Dari dua file input tersebut, aplikasi akan mengeluarkan file text sebagai berikut :

* takehome-MM.csv : berisi nomer induk, nama, gaji pokok, total denda, total lembur, total tunjangan transport, take home pay

`MM` adalah 2 digit bulan. Untuk bulan November, berarti `MM` akan terisi `11`.

## Aturan Bisnis ##

1. Hari kerja normal Senin - Jumat. Sabtu dan Minggu libur.
2. Jam kerja normal 09:00 - 17:00.
3. Bila hadir kerja pada hari normal, mendapatkan tunjangan transport harian sesuai tarif.
4. Bila datang terlambat, dikenakan denda per jam sesuai tarif denda per jam.
5. Bila pulang lebih cepat, dikenakan denda per jam sesuai tarif denda per jam.
6. Bila datang lebih cepat, tidak mendapatkan bonus.
7. Bila pulang lebih lambat dari jam normal, mendapatkan lembur sesuai tarif lembur per jam.
8. Bila masuk di hari libur, mendapatkan tunjangan transport dan bonus lembur dihitung per jam sesuai tarif.
9. Diasumsikan tidak ada hari libur di luar Sabtu-Minggu.
10. Rumus : `take home pay = gaji pokok - total denda + total lembur + total tunjangan transport`

## Contoh File ##

### tarif.csv ###

```
no,nama,gaji,denda,lembur,transport
1001,Endy,2000,10,15,30
1002,Adi,3000,15,20,50
1003,Jimmy,3500,15,20,50
1004,Doni,3250,10,10,35
```

### absen-11.csv ###

```
no,tanggal,datang,pulang
1001,2013-11-01,08:55,17:05
1002,2013-11-01,08:57,17:02
1003,2013-11-01,08:55,17:03
1004,2013-11-01,08:55,17:05
1001,2013-11-02,08:58,17:01
1002,2013-11-02,09:01,18:02
1003,2013-11-02,09:15,18:33
1004,2013-11-02,08:54,19:05
```

### takehome-11.csv ###

```
no,nama,gaji,denda,lembur,transport,takehome
1001,Endy,2000,100,150,600,2650
1002,Adi,3000,200,300,1000,4100
1003,Jimmy,3500,150,200,950,4500
1004,Doni,3250,250,300,550,3850
```

