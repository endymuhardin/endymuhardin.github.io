---
layout: post
title: "Pembagian Kerja dalam Programming"
date: 2014-10-25 09:25
comments: true
categories: 
- manajemen
---

Ada pertanyaan bagus di Forum Java Programmer Indonesia di Facebook

![Foto](https://lh6.googleusercontent.com/-WwcyvgyzpyI/VEsOaOMQ3pI/AAAAAAAAG9Q/z_KHGG79bUY/w560-h174-no/Selection_023.png)

> Bagaimana cara pembagian tugas kalau mengerjakan aplikasi dengan tim?

Berikut pendekatan yang biasa saya gunakan

<!--more-->

Pada prinsipnya, ada dua pendekatan:

1. Bagi per fitur
2. Bagi per layer

### Pembagian per Fitur ###

Masing-masing programmer mengerjakan satu fitur lengkap mulai dari tampilan sampai ke database. Kelebihan dari pendekatan ini, project manager mudah memonitor progressnya. Tinggal cek saja fitur mana yang udah mana yang belum. Kalau ada fitur yang tidak selesai-selesai, mudah mencari siapa yang bertanggung jawab.


Kekurangannya, masing-masing programmer harus paham dari depan sampai ke belakang. Dengan [development stack yang kita gunakan di ArtiVisi](http://software.endy.muhardin.com/java/development-stack-2014/), berarti tiap programmer harus paham :

* HTML
* CSS dan Bootstrap
* JavaScript dan [AngularJS](https://www.youtube.com/playlist?list=PL9oC_cq7OYbza1Q1GfDxuy-0Q8EgkNlJQ)
* [Yeoman](https://www.youtube.com/playlist?list=PL9oC_cq7OYby1r_lG7eH2B2hz47MsRBek)
* Spring Framework
* Spring Data JPA
* [Hibernate ORM](https://www.youtube.com/playlist?list=PL9oC_cq7OYbzyEMil0SjN5Xl5vOmxGTRD)

Nah, ini cukup sulit dipenuhi. Dalam suatu perusahaan software development, biasanya ada junior programmer (fresh graduate) dan senior programmer (sudah pengalaman bertahun-tahun membuat berbagai macam aplikasi). Pendekatan seperti ini membuat junior programmer tidak ada kerjaan.

### Pembagian per Layer ###

Aplikasi bisnis pada umumnya bisa dibagi menjadi 3 layer:

* User Interface / Tampilan : terdiri dari tampilan aplikasi (web atau desktop) dan report (pdf,xls,csv)
* Implementasi Proses Bisnis
* Akses ke Sumber Data : biasanya database relasional. Tapi jaman sekarang mulai terdiversifikasi ke sumber data jenis lain seperti aplikasi lain (melalui web service), NoSQL (mongodb, redis, memcached, dsb), email, sms, cloud storage (Dropbox, Google Drive), dan sebagainya.

Dengan pembagian seperti ini, seluruh anggota tim mendapat pekerjaan yang sesuai dengan level kemampuannya. Junior programmer di ArtiVisi biasanya mendapat bagian User Interface. Yang lebih senior mengerjakan Implementasi Proses Bisnis dan Akses Data. Beberapa akses data yang mudah, misalnya CRUD satu tabel tanpa relasi, juga bisa diserahkan ke junior programmer supaya mereka bisa naik level.

Kelemahan cara ini, menambah kepusingan project manager. Apabila ada fitur yang delay, dia harus lihat secara detail ke proses development untuk menentukan bagian mana yang menemui kesulitan. Apakah sisi tampilan? Atau akses data?

## Kesimpulan ##

Nah, masing-masing pendekatan ada plus dan minusnya. Silahkan pilih yang sesuai. Tidak juga harus pilih salah satu, bisa juga kombinasi keduanya. Misalnya untuk CRUD tabel master, satu orang satu fitur. Tapi untuk yang kompleks seperti transaksi penjualan yang melibatkan update stok gudang, dibagi per layer.

