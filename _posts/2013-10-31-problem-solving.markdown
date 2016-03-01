---
layout: post
title: "Problem Solving"
date: 2013-10-31 11:00
comments: true
categories: 
- life
---

Saya aktif berbagai forum diskusi di internet, mostly mengenai pemrograman. Dari apa yang saya amati di forum tersebut, begitu ada pertanyaan, umumnya selalu disambut dengan alternatif solusi yang bermacam-macam. Padahal seharusnya, kita fokus dulu dalam memahami masalahnya. Begitu kita paham masalahnya, solusinya akan mudah ditemukan.

Ada [cerita _urban legend_ di internet yang menggambarkan pendekatan ini](http://www.snopes.com/business/genius/where.asp). Berikut terjemahan bebas dari saya.

<!--more-->

> Budi adalah seorang pemilik pabrik yang sedang pusing tujuh keliling.
> Salah satu mesinnya rusak sehingga produksi terhenti. 
> Padahal minggu depan tanggal gajian dan barang harus segera dikirim agar ada uang masuk.

> Semua teknisi sudah dikerahkan, tapi tidak bisa memperbaiki mesin tersebut.
> Akhirnya dia mendatangkan temannya bernama Agus.

> Agus mulai beraksi. Tanya kiri-kanan, melihat ke dalam kap mesin, dan berkeliling pabrik seharian.
> Di sore hari, dia mengambil spidol dan membuat tanda X di salah satu komponen mesin.
> Teknisi mengganti komponen tersebut, dan mesin berjalan kembali dengan normal.

> Agus kemudian memberikan invoice senilai 100 juta. Budi terkejut, "Masa menulis X saja 100 juta??"
> Agus mengambil kembali invoice tersebut dan merevisinya sebagai berikut


Pekerjaan             | Biaya
----------------------|--------------------
Menulis X             |             10.000
Menentukan lokasi X   |         99.990.000
Total                 |        100.000.000


Anda mungkin berkomentar, 

> Ah itu kan cuma cerita dongeng saja.

Kenyataannya, saya beberapa kali menemui kasus seperti ini. Contohnya:

[![Foto](/images/uploads/2013/10/problem-solving/floating-point-problem.png)](/images/uploads/2013/10/problem-solving/floating-point-problem.png)

Kenapa hasilnya tidak sama? Karena memang itu sifat dari bilangan `floating-point`.
Begitu kita paham problemnya (yaitu karakteristik bilangan `floating-point`), fenomena di atas tidak lagi membingungkan buat kita, 
dan solusinya langsung terang benderang.

Contoh lain, di milis ada yang bertanya begini

> Saya ingin menggunakan icon di aplikasi Eclipse dalam aplikasi saya.
> Lisensinya [EPL](http://en.wikipedia.org/wiki/Eclipse_Public_License), apakah boleh saya pakai gratis atau harus bayar?

Diskusi berlanjut dengan orang-orang menjelaskan rincian lisensi EPL apa yang boleh apa yang tidak boleh
berikut referensi ke berbagai website.

Saya melihat masalahnya lebih sederhana

> Ada orang ingin pakai icon bagus di aplikasi yang dia buat.

Kemudian saya memberikan rekomendasi yang lebih simple

> Coba google dengan keyword `free icon`. 
> Nanti ketemu banyak, salah satunya [famfamfam](http://www.famfamfam.com/lab/icons/).

Nah, itu sudah jelas gratis, tidak perlu pusing _terms & conditions_ dari lisensi [EPL](http://en.wikipedia.org/wiki/Eclipse_Public_License).

## Problem Worth Solving ##

Satu hal lagi yang penting, problem solving itu butuh cost. Baik waktu, tenaga, maupun uang. Jadi sebelum kita mulai, dipastikan dulu bahwa cost tersebut ada justifikasinya.

Kalo kita cari solusi di google dan gak nemu, baiknya introspeksi dulu.

> Apakah problem saya sedemikian uniknya sehingga sedunia gak ada yang pernah mengalami?

Tanyakan juga ke diri sendiri

> Atau jangan2, problem kita sedemikian worthless sehingga gak ada yang mau repot2 bikinin solusi?

## Kesimpulan ##

Dengan menjabarkan problemnya dengan baik, solusi yang sederhana bisa didapatkan. Tim saya di [ArtiVisi](http://www.artivisi.com) sudah terbiasa dengan pendekatan seperti ini. Setiap kali mereka minta solusi untuk suatu hal teknis yang rumit, saya akan selalu mengarahkan untuk menganalisa ulang requirement. Apakah memang harus demikian solusinya? Bila iya, coba lagi negosiasikan requirement supaya bisa menggunakan solusi yang lebih sederhana. Lebih baik negosiasi requirement seharian daripada harus coding solusi rumit dua minggu (belum lagi testing, debugging, maintenance, dst).

Jangan lupa ditimbang-timbang dulu, apakah problemnya `layak` dicarikan solusinya. Supaya waktu, tenaga, uang kita bisa dialokasikan seoptimal mungkin.
