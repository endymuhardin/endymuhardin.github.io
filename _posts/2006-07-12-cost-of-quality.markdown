---
comments: true
date: 2006-07-12 16:48:16
layout: post
slug: cost-of-quality
title: Cost of Quality
wordpress_id: 98
categories:
- manajemen
---

Mumpung sedang [hangat](http://endy.artivisi.com/blog/java/ruthless-testing-2/) membahas [testing](http://endy.artivisi.com/blog/java/ruthless-testing-1/), coba kita dengarkan apa pendapat manajemen. 

Programmer [P] : Bos, kata Mr. Endy, kita harus bikin unit test, integration test, coverage test dsb
Manager [M] : Stop, banyak sekali testnya? Memangnya kamu gak bisa bikin kode yang bener, sampe ditest segitu banyaknya?
[P] : Ya bisa bos, tapi .. 
[M] : Ya sudah kalo bisa coding sana yang bener, test nanti saja waktu sudah delivery. Kita sudah mepet deadline ini. Kita dibayar bukan untuk coding unit test. 
[P] : (kecewa, cuma bisa gigit mouse) Ya deh bos ... 

Umumnya, begitulah tanggapan pihak manajemen dalam menyikapi test. Test dianggap sebagai kegiatan yang (walaupun) penting, prioritasnya ada di kelas ekonomi. 
Saya sendiri, walaupun merupakan penggemar unit testing dan percaya akan manfaatnya, kadang merasa tidak pede untuk berargumen dengan manajemen tentang urusan ini. 

Sampai suatu hari, ada training di kantor tentang Software Engineering. Instrukturnya adalah konsultan manajemen yang ahli di bidang ISO dan CMMI. 

Biasanya, saya rada skeptis dengan yang namanya konsultan manajemen. Baik itu konsultan pemasaran, konsultan ISO, atau bidang manajemen yang lainnya. Kebanyakan dari mereka (tidak semua, tapi kebanyakan) biasanya cuma bisnis jargon saja. Cari uang dari menciptakan jargon aneh, menjelaskan jargon tersebut, dan menyuruh kita menggunakan jargon tersebut. Selebihnya nasihatnya mirip-mirip ramalan bintang, nasihat yang buram dan bisa ditafsirkan apa saja. 

Tapi kali ini, sang konsultan mengetengahkan jargon yang cukup menarik, yaitu **Cost of Quality**. Berikut penjelasannya. 

Biasanya, dalam mengerjakan project software, kegiatan apa yang ada di project schedule kita?
Umumnya seperti ini: 
1. Analisa : membuat spesifikasi requirement user
2. Desain : desain tampilan dan arsitektur aplikasi
3. Coding
4. User Testing
5. Implementasi : migrasi data, training user, tuning
6. Garansi
7. Makan-makan (kalo ada profit)

Si konsultan bilang, memang itu semua (1-6) adalah kegiatan utama. Tanpa kegiatan itu, project tidak bisa diutamakan. Tapi, dengan 6 aktifitas tersebut, kecil peluangnya kita akan sampai ke aktivitas #7, yaitu makan-makan. 

"Kenapa begitu ?", demikian para peserta training bertanya dengan antusias, nampaknya jelas kalau urusannya menyangkut perut (tidak jadi makan-makan) orang ngantuk bisa langsung jadi segar.

"Ya sebab di sana belum dianggarkan Biaya Kualitas (Cost of Quality), nantinya kualitas rendah, banyak perbaikan, sehingga profit terancam tergusur", jawab instruktur.

Nah, sekarang apa saja biaya kualitas itu? Diantaranya adalah:



	
  1. Training : memastikan pekerjaan tidak dikerjakan secara trial and error

	
  2. Review : mendeteksi kesalahan sedini mungkin. Kesalahan desain bisa diperbaiki dalam beberapa halaman dokumen desain. Tetapi jika dibiarkan sampai coding, banyak sekali effort untuk debug dan bugfix yang harus dikeluarkan. Misal: mengganti iBatis dengan Hibernate di dokumen desain cukup dengan Find and Replace. Mengganti iBatis dengan Hibernate di kode program? Bayangkan sendiri.

	
  3. Rework : harus ada anggaran untuk melakukan perbaikan dokumen, bugfix, dsb

	
  4. Audit : sebelum hasil pekerjaan dideliver ke client, harus diperiksa dulu secara internal. Audit proses juga dilakukan untuk memastikan semua Cost of Quality sudah diperhitungkan dan dijalankan.

	
  5. Testing : testing sebanyak mungkin dan seawal mungkin.



Dalam project software, kita mengenal fenomena bola salju. Tadinya kecil, menggelinding menjadi besar sehingga dapat menggulung satu desa (seperti di film kartun). Di software sama. Kita ingin mendeteksi kesalahan sedini mungkin, kalau bisa di tahap analisa semua kesalahan sudah dieliminasi, sehingga tidak merembet ke kode program. Jadi, perlu ada review dan audit untuk memastikan kesalahan tidak ditemukan di fase-fase akhir. Karena memperbaiki kesalahan di awal (requirement dan design) jauh lebih murah daripada di akhir (kode program, materi user training, user manual, dan script migrasi data). 

Baiklah, cost of quality itu penting. Sekarang bagaimana cara menjelaskan pada manajemen mengenai tambahan biaya tersebut? 

Mari kita rekonstruksi dialog Programmer dan Manager. 

Programmer [P] : Bos, kata Mr. Endy, kita harus bikin unit test, integration test, coverage test ...
Manager [M] : Stop, banyak sekali testnya? Memangnya kamu gak bisa bikin kode yang bener, sampe ditest segitu banyaknya?
[P] : Ya bisa bos, tapi .. 
[M] : Ya sudah kalo bisa coding sana yang bener, test nanti saja waktu sudah delivery. Kita sudah mepet deadline ini. Kita dibayar bukan untuk coding unit test. 
[P] : Memangnya kalo boleh tau, seperti apa jadwalnya Bos?
[M] : Kamu programmer mau tau saja. 
Tapi gpp, karena ini percakapan boongan baiklah akan saya kasi tau: 
1. Analisa : 2 minggu
2. Desain : 1 minggu
3. Coding : 4 minggu
4. User Testing dan Bugfix : 4 minggu 
5. Implementasi : 4 minggu
6. Garansi : 8 minggu
Total : 23 minggu

[P] : Kenapa User Testing dan Implementasi lama sekali Bos? Sama lamanya dengan Coding?
[M] : Ya itu karena kamu dan teman-temanmu kerjanya salah melulu, jadi di User Testing dan Implementasi banyak masalah. 

[P] : Bagaimana kalau saya usul jadwal seperti ini : 
1. Analisa : 2 minggu
2. Review dan rework : 1 minggu
3. Desain : 1 minggu
4. Review dan rework : 1 minggu
5. Training : 1 minggu
6. Coding + Unit Testing: 6 minggu
7. User Testing dan Bugfix: 2 minggu 
8. Implementasi : 1 minggu
9. Garansi : 8 minggu
Total : 23 minggu
Sama kan Bos, total waktunya. Saya yakin dengan tambahan aktifitas review, rework, dan training, kita akan bisa tangkap sebagian besar bug sebelum User Testing. Dengan demikian, bug yang terlihat sama user tinggal sedikit karena sudah kita temukan duluan. 
Kalau sebelum coding kita ditraining dulu, codingnya bisa lebih cepat dan bener Bos, sehingga bugnya lebih sedikit. Mudah-mudahan client jadi puas. 

[M] : Wah pintar juga kamu, di rumah dikasi makan apa sama Emaknya bisa pintar gini? Baiklah akan saya coba usul kamu. 

Demikianlah, cost of quality itu penting. Lebih penting lagi adalah cara kita menjual pada manajemen, supaya kegiatan testing dan training tidak dianggap sebagai kegiatan 'buang-buang uang' dan 'tidak dibayar client'. Sebenarnya, client membayar untuk mendapat hasil yang berkualitas dan memuaskan. Secara tidak langsung, mereka membayar kita untuk melakukan testing. 

Referensi : [Software Quality at Top Speed](http://www.stevemcconnell.com/articles/art04.htm)
