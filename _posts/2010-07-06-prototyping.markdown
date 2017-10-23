---
comments: true
date: 2010-07-06 18:41:17
layout: post
slug: prototyping
title: Prototyping
wordpress_id: 562
categories:
- manajemen
---

Pada waktu kita melakukan requirement gathering, harapan kita adalah agar requirement yang kita dapatkan di fase requirement tidak jauh bergeser dari requirement final setelah project closing. Kalau pergeserannya jauh, akan mengakibatkan waktu dan biaya pengerjaan project menjadi molor dan akibatnya kedua belah pihak akan dirugikan.

Pergeseran requirement ini bisa disebabkan beberapa hal, misalnya :




  1. business analyst (BA) kurang pengalaman, sehingga tidak bisa mengidentifikasi varian-varian skenario. Akibatnya terjadi banyak 'hidden requirement'



  2. business analyst kurang teliti, sehingga salah memahami penjelasan user


  3. Perubahan bisnis client, sehingga requirementnya juga berubah



  4. perbedaan persepsi antara user dan analyst atau programmer




Untuk masalah 1 dan 2, solusinya adalah dengan mengganti BA dengan orang yang lebih berpengalaman. Newbie sebaiknya tidak menjadi BA. Bolehlah magang BA, tapi jangan diandalkan untuk jadi BA utama.

Poin 3 juga biasanya tidak masalah. Client biasanya cukup tahu diri kalau terjadi hal ini, sehingga tidak keberatan dimintai charge tambahan.

Nah untuk poin 4, biasanya sulit dideteksi sampai aplikasi kita deliver. Sering terjadi, usernya OK OK saja pada fase requirement, dan tiba-tiba pada waktu kita deliver aplikasinya, dia langsung bingung karena aplikasinya 'aneh'.

Agar poin 4 ini tidak terjadi, sebaiknya kita melakukan prototyping. Bagaimana cara melakukan prototyping yang baik?


Prototyping itu idealnya :

1. Murah meriah dan cepat
Dalam 1 hari kita harus bisa menggambar minimal 10 screen.
Begitu usernya selesai ngomong/gambar di papan tulis, screennya juga harus langsung jadi.
Jangan sampai effort untuk prototyping lebih besar dari effort untuk coding.

2. Gampang diubah
Tujuan prototype adalah supaya user bisa merasakan seperti apa aplikasinya nanti.
Kalau dirasakan kurang sesuai, tentunya dia ingin mengubahnya.
Nah, jangan sampai minta geser tombol aja harus nunggu 30 menit.

3. Mirip aslinya.
Kalo ini lebih ke sisi development.
Biar efisien, begitu prototype sign off, kita bisa mulai paralel coding dan bikin user manual.
Kalo prototypenya udah bener2 mirip, bisa langsung discreenshot dan dipasang di user manual.
Jadi begitu aplikasi jadi, user manual juga selesai.

4. Terlihat belum selesai
Ini agak kontradiktif dengan tips #3. Kalau prototype kita sangat mirip aplikasi betulan, client akan memiliki persepsi bahwa aplikasinya sudah hampir selesai. Padahal belum ada coding sama sekali. Oleh karena itu, sangat penting kita tekankan ke client bahwa masih ada jangka waktu yang lama sebelum aplikasi betulannya selesai.

Ada beberapa tools yang bisa digunakan untuk prototyping, yaitu



## [Netbeans](http://www.netbeans.org)


Untuk project aplikasi desktop, inilah yang biasa kami gunakan di ArtiVisi. Screen dapat dibuat dengan sangat cepat, lengkap dengan behavior standar seperti popup dialog, scroll table, dsb.

Untuk project web, biasanya kita langsung coding di HTML dan Dojo, tentunya tanpa koneksi ke back end.

Sebagai nilai tambah lain, setelah prototype di-approve client, programmer bisa langsung meneruskan coding.



## [Balsamiq Mockup](http://www.balsamiq.com/products/mockups)


Tools ini berbayar dan dijalankan menggunakan Adobe AIR.

[Pencil](http://pencil.evolus.vn)
Tools ini lumayan bagus, dijalankan sebagai Firefox Add Ons. Sudah ada palette untuk berbagai UI component seperti combo box, text area, dsb. Setelah selesai menggambar, kita bisa langsung mengekspornya menjadi image.

Berikut contoh mockup yang baru saja saya buat menggunakan Pencil.

Ini versi 'bagus' yang mirip aslinya.

[![Mockup Login Screen ala Windows XP ](/images/uploads/2010/07/windows_login-300x238.png)](/images/uploads/2010/07/windows_login-300x238.png)

Supaya client sadar bahwa ini adalah prototype, kita bisa gunakan versi yang coret-coretan.

[![Mockup versi coretan](https://lh4.googleusercontent.com/-1hcFb859pOI/U1acWK5Y8YI/AAAAAAAAFqw/KxhM_jXmybE/w771-h474-no/entri_anggota.png)](https://lh4.googleusercontent.com/-1hcFb859pOI/U1acWK5Y8YI/AAAAAAAAFqw/KxhM_jXmybE/w771-h474-no/entri_anggota.png)

Source file untuk mockup di atas bisa diunduh [di sini](../../downloads/aplikasi-perpustakaan.ep).

Demikianlah sedikit tips dan trik. Semoga bermanfaat.
