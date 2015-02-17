---
layout: post
title: "Prasyarat Integrasi Aplikasi"
date: 2014-01-03 10:43
comments: true
categories: 
- java
---

Posting kali ini jawaban dari pertanyaan yang masuk melalui email:

> Saya membaca tulisan anda [di sini](http://software.endy.muhardin.com/java/integrasi-aplikasi/)
> Cukup menarik, dan saya ingin bertanya jika berkenan, sehubungan dengan payment gateway.

> Apakah kita bisa mengimplementasikan sendiri ISO-8583 pada aplikasi kita untuk terhubung ke bank di Indonesia ?
> Misal kita bisa cek saldo tabungan melalui aplikasi kita sendiri ?

> Atas sharing pengetahuannya saya ucapkan terima kasih.

Berikut jawaban saya

<!--more-->

Untuk bisa connect ke aplikasi lain (misalnya aplikasi bank), ada beberapa prasyarat yang harus dipenuhi **secara berurutan**:

1. aksesnya harus dibuka (ip address, port, firewall, dsb). Biasanya ini melibatkan faktor non-teknis seperti deal bisnis, non-disclosure agreement, perjanjian berkekuatan hukum, dan sejenisnya.
2. protokol komunikasinya harus diketahui (http, iso8583, dsb)
3. kita harus bikin aplikasi yg bisa berkomunikasi dengan aplikasi yang dituju menggunakan protokol yang ditentukan di poin #2. Jadi harus tahu fitur apa saja yang tersedia, bagaimana memanggilnya, apa inputnya, bagaimana format outputnya, apa tipe datanya, dsb.

Kalau tiga faktor di atas terpenuhi, jangankan cuma aplikasi bank di Indonesia, aplikasinya Snowden juga bisa kita akses ;)

Oh, sebelum artikel ini diakhiri, saya harus bikin disclaimer dulu.

> Saya tidak bertanggung jawab kalau ada _smarta$$_ yang setelah baca artikel ini lalu nekat mengakses aplikasi orang lain hanya bermodalkan #2 dan #3 tanpa punya #1.
