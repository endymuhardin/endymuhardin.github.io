---
comments: true
date: 2011-05-10 23:37:12
layout: post
slug: estimasi-proyek-software
title: Estimasi Proyek Software
wordpress_id: 690
categories:
- manajemen
---

> Saya ingin membuat aplikasi akunting, berapa lama dan berapa biayanya?



Demikian pertanyaan yang amat sering kita temui di profesi software developer. 

Topik estimasi proyek merupakan topik yang sulit. Steve McConnell menyebutnya Black Art, 
sehingga dia mengarang buku yang sangat bagus tentang topik ini, 
judulnya Software Estimation, Demystifying the Black Art. 

Menurut Steve, dalam membuat estimasi, ada 3 metode yang dilakukan, yaitu 



	
  * count

	
  * compute

	
  * judge




Kita harus selalu berusaha count, karena ini yang paling akurat. 
Kalo ditanya berapa tinggi pohon, paling baik adalah ambil meteran dan ukur pohonnya. 
Dimana kita tidak bisa count, maka kita compute. 
Contohnya, di sebelah pohon ada pagar dan di atas pagar ada tiang lampu. 
Kita compute jumlah tinggi pagar dan tinggi tiang lampu, sehingga dapat tinggi pohon. 
Hanya kalau tidak ada cara lain, baru kita judge. 
Dikira2 tingginya berapa. 

Dalam kaitannya dalam estimasi, idealnya yang kita estimasi hanyalah project size. 
Metric lainnya akan kita compute dari project size ini. 




## Apa itu project size?


Project size merupakan ukuran suatu project. 
Dengan project size, kita bisa membandingkan dua aplikasi yang berbeda, 
misalnya aplikasi akunting dan aplikasi toko online. 

Ada banyak metric untuk mengukur ukuran project. Metric yang paling lazim digunakan 
adalah jumlah baris kode program, dalam bahasa Inggris disebut Source Lines of Code (SLOC)
atau Non Commenting Source Code (NCSS). 

Walaupun SLOC sangat akurat dalam menentukan ukuran project, tapi jumlah baris kode sulit diperkirakan di awal project. 
Oleh karena itu, beberapa orang kreatif lalu mengarang metode baru yang disebut Function Point Calculation. 
Metode ini pada intinya adalah menghitung berapa screen input, screen output, jumlah tabel database, dan interaksinya dengan aplikasi lain. 

Setelah kita mendapatkan estimasi ukuran project, kita akan menggunakannya untuk mengestimasi effort, durasi, dan cost. 

Sebelum lebih jauh, mari kita jelaskan istilah-istilahnya. 

Effort, adalah kerja real yang kita lakukan dalam menyelesaikan project. Satuannya adalah mandays atau manhour. 
Misalnya suatu aplikasi diestimasi membutuhkan effort 10 mandays. Artinya aplikasi ini akan selesai bila dikerjakan 1 orang selama 10 hari terus menerus. 
Atau 5 hari bila ada 2 pekerja. Effort tidak mempertimbangkan libur ataupun cuti. 

Durasi (bahasa Inggrisnya schedule), adalah jangka waktu penyelesaian project. Ini biasanya dinyatakan dalam satuan hari kerja atau hari kalender. 
Bila durasi project dinyatakan 10 hari kalender, maka bila dimulai tanggal 1, akan selesai tanggal 10.

Jadi, untuk mendapatkan durasi, kita harus punya asumsi berikut : 



	
  * berapa orang yang dipekerjakan

	
  * berapa hari libur

	
  * berapa alokasi waktu non-pekerjaan seperti meeting, presentasi, dsb




Asumsi tersebut, digabungkan dengan estimasi effort, akan menghasilkan estimasi durasi.

Setelah durasi didapatkan, menghitung estimasi cost mudah saja. Kita membutuhkan matriks gaji per role.
Berapa gaji project manager, gaji programmer, dan role lain dalam setahun, termasuk THR, tunjangan kesehatan, benefit lain dan bonus. 
Bagilah dengan hari kerja setahun sehingga didapatkan nilai gaji sehari. 
Kemudian petakan penggunaan masing-masing role dalam schedule yang sudah kita estimasi, dan kita akan mendapat biaya personel. 
Tambahkan dengan biaya lain-lain seperti transport, komunikasi, dsb untuk mendapatkan biaya total. 
Masukkan juga faktor resiko project, misalnya kalau clientnya terkenal sulit ditagih, tentu perlu ada koefisien pengali. 
Karena tagihan macet sama dengan kita memberi hutang ke client. 

Nah, akhirnya biaya total sudah didapatkan, silahkan tambahkan profit yang diinginkan, buffer negosiasi, dan voila, dapatlah harga penawaran. 

Selesai? Belum dong :D

Pembaca yang teliti tentu akan menemukan satu celah di penjelasan di atas. Bagaimana mengkonversi estimasi project size menjadi estimasi effort?
Nah disinilah bedanya perusahaan besar kaya pengalaman dengan startup mahasiswa baru lulus. Perusahaan dengan jam terbang tinggi biasanya punya data historis. 
Dia punya data misalnya berapa mandays yang dibutuhkan programmer untuk membuat aplikasi dengan 3 tabel database. 
Tentunya data ini harus dikumpulkan, diolah, dan diupdate agar bisa dijadikan pedoman. Ini sebabnya tidak semua perusahaan besar punya data ini. 
Dengan bermodalkan data ini, perusahaan tinggal mengkonversi project size menjadi effort. 
Setidaknya ada dua jenis data yang kita butuhkan, yaitu berapa effort yang dibutuhkan untuk menyelesaikan satu baris kode, dan bagaimana distribusi effort selama fase project. Maksudnya, bila project kita diestimasi 100 mandays, berapa mandays habis di analisa, coding, testing, implementasi, dan maintenance. 
Selain itu, juga perlu ada matriks distribusi effort per role. Dengan adanya matriks ini, kita akan lebih mudah menkonversi effort menjadi durasi dan cost. 

Startup mahasiswa, karena tidak punya data, maka cuma bisa tebak-tebak buah manggis. Atau kalo mau sedikit ilmiah, bisa mengikuti cara kami di ArtiVisi waktu baru mulai dulu. Kita membuat aplikasi kecil, kemudian datanya dikumpulkan dan dijadikan pedoman. 

Jadi, kesimpulannya, begini metode estimasinya. 

**Kebutuhan Data**



	
  1. Tabel konversi size ke mandays

	
  2. Tabel gaji pegawai per role per hari

	
  3. Tabel distribusi effort per fase

	
  4. Tabel distribusi effort per role





Flow Estimasi

	
  1. Estimasi Size

	
  2. Dari size, gunakan tabel #1 untuk mendapatkan effort

	
  3. Dari effort, gunakan tabel #3 untuk mendapatkan durasi

	
  4. Dari effort, gunakan tabel #4 untuk mendapatkan effort per personel

	
  5. Dari effort per personel, gunakan tabel #2 untuk menghitung biaya personel

	
  6. Gunakan durasi untuk menghitung biaya lain-lain





Demikian metodologi untuk melakukan estimasi project software. Membuat estimasi saja tidak cukup, kita juga harus bisa mempresentasikan dan mempertahankannya dari negosiasi pihak lain. Ini akan dibahas di lain kesempatan. 
