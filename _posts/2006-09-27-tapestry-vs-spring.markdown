---
comments: true
date: 2006-09-27 08:13:51
layout: post
slug: tapestry-vs-spring
title: Tapestry vs Spring MVC
wordpress_id: 137
categories:
- java
---

Dalam beberapa project terakhir, saya menggunakan [Spring][] MVC untuk membuat presentation layer. Spring sangat fleksibel dan mudah dipelajari. Ini menambah fleksibilitas dalam menyusun tim programmer. Dengan kemudahannya, programmer yang sudah pernah membuat aplikasi web --baik menggunakan Struts, PHP, Ruby on Rails, atau bahkan yang cuma mengerti servlet-- dapat beradaptasi dalam hitungan hari dan langsung produktif. 

Di lain pihak, saya sering sekali mendengar kehebatan [Tapestry][]. Para pendukungnya menggembar-gemborkan peningkatan produktifitas (baca: kecepatan membuat aplikasi) yang signifikan. Harga yang harus dibayar untuk produktifitas tersebut adalah kompleksitas. Tapestry terkenal sulit. Dia menggunakan paradigma event-driven. Jadi kita harus berpikir seolah-olah kita membangun aplikasi desktop dengan Swing atau VB. Kompleksitas ini menyebabkan kita tidak bisa sembarangan menyusun tim programmer. Butuh orang yang pemahaman Java-nya menengah ke atas agar aplikasi dapat diselesaikan dengan baik. 



Setelah merasa nyaman menggunakan Spring di beberapa project terakhir, saya putuskan untuk keluar dari zona aman dan belajar Tapestry. Masa depan aplikasi web nampaknya adalah component-mania. Berbagai komponen siap pakai yang tersedia di pasaran (baik gratis maupun bayar) yang tinggal kita tempelkan di aplikasi kita, akan menjadi trend. Terutama dengan maraknya penggunaan Ajax belakangan ini. Pasti akan banyak orang yang membuat komponen Ajax-ready yang bisa langsung digunakan. 

Prediksi ini diperkuat dengan presentasi Chuk Mun Lee di Sun Developer Day 2006 kemarin. Dia menunjukkan bagaimana cepatnya orang bisa membuat aplikasi web. Cukup mendownload kumpulan komponen dari [jMaki][], dan langsung *menggambar* di IDE. Kalau para pesaing bekerja seperti ini, sementara kita masih secara manual memparsing request, wah ... kita akan ketinggalan.

Sebagai titik awal pelajaran, saya akan mulai dari Spring Framework. Ada beberapa kegiatan utama dalam pembangunan aplikasi web yang terjadi berulang-ulang. Dalam membandingkan Spring vs Tapestry, kegiatan-kegiatan ini akan menjadi kriteria penilaian. Dalam setiap kegiatan, saya akan memberi nilai dan menyatakan pemenangnya. Masing-masing kegiatan bobotnya berbeda, tergantung frekuensi kemunculannya dalam aplikasi. 

Berikut adalah kriteria penilaiannya : 

1. Hello World. Yaitu kegiatan setup pertama kali sampai Hello World muncul. Bobotnya cuma 5%, karena kegiatan ini cuma dilakukan sekali saja di awal. 
2. Form binding. Bagaimana semua variabel dalam form bisa diambil sebagai satu domain object. Bobotnya 20%, karena ini adalah kegiatan wajib, inti dari aplikasi. 
3. Validasi form. Bagaimana mencegah invalid input, baik secara server-side maupun client-side. Bobotnya 20%, saudara kembar dengan Form Binding. 
4. Web Asset. Bagaimana penanganan image, css, javascript. Bobotnya 10%.
5. Security. Bagaimana kemudahan mengaktifkan otentikasi dan otorisasi. Bobotnya 20%. Ini juga bagian yang penting. Kalau penanganan di sisi ini tidak elegan, akan banyak duplikasi kode bertebaran di dalam kode program.
6. Ajax readiness. Bobotnya 10%.
7. Reusability. Bagaimana kemudahan menggunakan komponen/library yang sudah ada. Bobotnya 10%. 


*Disclaimer: dalam kegiatan membandingkan ini, tidak ada tujuan untuk menjelekkan yang satu terhadap yang lainnya. Ini murni adalah pekerjaan harian software designer, yaitu memilih framework dan teknologi. Berbagai saran dan masukan dari pendukung masing-masing framework sangat diharapkan.*

Hello World akan dibahas di artikel selanjutnya.


[Spring]: http://www.springframework.org "Spring Framework"
[Tapestry]: http://tapestry.apache.org "Tapestry Framework"
[jMaki]: https://ajax.dev.java.net "Ajax-based component"
