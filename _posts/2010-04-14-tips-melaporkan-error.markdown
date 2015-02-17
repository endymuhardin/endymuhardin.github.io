---
comments: true
date: 2010-04-14 21:38:02
layout: post
slug: tips-melaporkan-error
title: Tips Melaporkan Error
wordpress_id: 519
categories:
- java
---

> Update 2011-12-02: karena masih aja banyak yang belum paham, saya tambahkan template pertanyaan di akhir artikel.



Sebagai programmer, setiap hari kita menghadapi software yang error. Bentuknya macam-macam, misalnya: 




  * Aplikasi yang kita buat error


  * Peserta milis menggunakan framework X dan mengalami masalah


  * Rekan sesama programmer membutuhkan bantuan


  * dsb



Pada sebagian besar kasus, kita dengan senang hati akan membantu. Sudah menjadi sifat programmer untuk memiliki rasa keingintahuan yang tinggi dan senang terhadap teka-teki. Aplikasi yang error adalah teka-teki yang menarik. 

Sayangnya, seringkali informasi error yang kita terima tidak lengkap sehingga butuh usaha tambahan untuk mengorek kejadian yang sebenarnya. Inilah yang membuat programmer seringkali keburu malas, sehingga akhirnya kegiatan solving error menjadi tidak fun lagi. 

Berikut adalah beberapa tips untuk membuat laporan error yang baik, supaya programmer yang akan memecahkan masalah tersebut bisa segera bekerja dengan efektif. 



Prinsip utama dalam melaporkan error adalah sebagai berikut



> Programmer bukan <del>Mama Loren</del> Baby Djenar atau Ki Joko Bodo. Dia tidak bisa membaca pikiran ataupun melakukan telepati. Jadi jangan menganggap programmer melihat apa yang dilihat user. User harus menjelaskan apa yang dia lihat.






## Jelaskan lokasinya


Seringkali si informan error berkata seperti ini, 



> Help, aplikasinya error nih



Nah, yang menerima informasi jelas bingung. Aplikasi yang mana? 
Kalo client yang jadi informan, bisa jadi kita punya banyak project di sana. 
Walaupun projectnya cuma satu, tapi aplikasi kan bisa terdiri dari banyak modul, screen, fitur, dsb. 

Jadi, jelaskan di mana errornya. Di aplikasi apa, modul apa, screen yang mana. Terdengar simple, tapi nyatanya ada saja yang melewatkan hal pertama ini. 

Mari kita lanjutkan.



## Tujuan


Kita menggunakan aplikasi tentu ingin mencapai tujuan tertentu. Ingin menyimpan data customer, menampilkan laporan bulanan, dan lain sebagainya. Nah, tujuan ini harus disampaikan ke programmer. Soalnya sering terjadi percakapan seperti ini : 

User (U) : Pak, fitur daftar produknya error.  
Programmer (P) : Harusnya bisa kok, sudah kami test di sini tidak ada masalah.  
U : Tapi saya coba tidak bisa  
P : Coba jelaskan langkahnya  
U : Saya buka menu daftar produk, muncul tabel berisi produk. 
Kemudian saya klik dua kali nama produk dalam tabel, saya ganti isinya. 
Setelah itu, saya tutup screennya.
Pas dibuka lagi, datanya tetap sama.  
P : Lho, memangnya Ibu mau melakukan apa?  
U : Saya mau edit harga produknya  
P : Walah, bukan dari situ Bu. Gunakan menu edit produk  

Nah, seringkali tujuan user tidak sesuai dengan fitur aplikasi. Jadi, beri tahukan tujuan user pada programmer. 




## Langkah Reproduksi


Begitu programmer akan mencoba memperbaiki error, dia akan mencoba mereproduksi error tersebut di komputernya sendiri. Nah di sinilah biasanya terjadi percakapan seperti ini : 

U : Ini aplikasi error, tidak bisa simpan data  
P : Oh, di sini saya coba bisa kok  
U : Di sini tidak bisa  
P : Di sini bisa  
U : Tidak bisa  
P : Bisa  
dst  

Akan lebih produktif kalau percakapannya seperti ini : 

U : Ini aplikasi error, tidak bisa simpan data  
P : Apa yang dilakukan?  

U : Seperti ini :

1. Buka screen Edit Produk
2. Pilih kategori Komputer dan Elektronik
3. Isi kode produk
4. Isi nama produk
5. Harga dikosongkan
6. Tekan tombol simpan

Nah, dengan percakapan seperti ini, programmer bisa mengulangi apa yang dilakukan user. 
Apakah langkah repro saja sudah cukup? Belum, masih ada 1 hal penting lainnya.



## Harapan dan Kenyataan



Mari kita lanjutkan percakapan di atas. 

U : Setelah ditekan tombol simpan, datanya tidak tersimpan.  
P : Di tempat saya masuk kok ke database.  
U : Di sini, setelah ditekan simpan tidak terjadi apa-apa  
P : Maksudnya?  
U : Ya harusnya kan ada pesan, "Data sudah tersimpan"  
Ini tidak ada. 


Nah, di sini harapan user adalah ada notifikasi dari aplikasi bahwa data sudah tersimpan. Tapi kenyataannya tidak ada notifikasi apa-apa dari aplikasi. User mengira ini error, 
padahal programmer memang tidak menyediakan notifikasi tersebut, walaupun datanya sudah masuk ke database. Dari sini, programmer bisa menambahkan notifikasi sesuai harapan user. 

Jadi, harapan dan kenyataan harus disampaikan pada programmer.



## Environment


Ini maksudnya adalah kondisi di mana aplikasi dijalankan, seperti





  * Sistem Operasi


  * Versi Aplikasi


  * Aplikasi lain yang terinstal



Sering terjadi aplikasi error hanya di Linux saja, atau di Mac saja, tapi berjalan lancar di Windows. Atau sebaliknya. Dengan memberi informasi ini, programmer bisa lebih terarah dalam mencari kesalahan dalam kode program. 

Demikian juga dengan versi aplikasi dan aplikasi lain yang terinstal. Seringkali sudah diketahui bahwa aplikasi kita tidak kompatibel dengan versi library tertentu, versi OS tertentu, atau dengan aplikasi lain. Misalnya seperti ini : 

Tanya (T) : Saya instal Tomcat tapi error  
Jawab (J) : Errornya gimana?  
T : Katanya port 8080 tidak bisa digunakan.   
J : Apakah ada webserver lain yang terinstal?  
T : Web server sih tidak ada, saya cuma install database Oracle saja.  
J : Oh, Oracle itu membawa web server sendiri, jalannya juga di 8080.  
Coba matikan Oraclenya, atau ganti port Tomcat ke angka lain.  

Demikian beberapa tips melaporkan error. 

Berikut ringkasannya : 


  1. Jelaskan Lokasinya


  2. Sebutkan Tujuan


  3. Langkah Reproduksi


  4. Harapan dan Kenyataan


  5. Environment



Berikut template yang bisa digunakan untuk mengajukan pertanyaan. 

Saya ingin ...... (misal : mendeploy aplikasi di glassfish), 
untuk itu saya melakukan langkah2 berikut :

1. ....
2. .... 
3. ....

Setelah saya lakukan langkah di atas, saya mengharapkan hasil sbb:

1. .....
2. .....
3. .....

Tapi ternyata kok malah muncul hasil seperti ini :

1. .... 
2. ....
3. ....

Sebagai tambahan informasi, saya menggunakan :

1. Sistem Operasi ... versi ...
2. Bahasa Pemrograman ... versi ...
3. Database ... versi ...
4. Framework/Tools ... versi ...

Dengan mengikuti tips ini berarti Anda sudah membantu kami untuk membantu Anda. 
:D

