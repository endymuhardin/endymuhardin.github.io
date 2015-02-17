---
comments: true
date: 2010-03-10 00:41:06
layout: post
slug: dokumentasi-project
title: Dokumentasi Project
wordpress_id: 516
categories:
- manajemen
---

Pertanyaan yang sering muncul dalam pengelolaan proyek software adalah, "Dokumen apa saja yang harus dibuat?"

Tidak ada jawaban absolut untuk pertanyaan ini, semuanya tergantung situasi dan kondisi. Bahkan di satu perusahaan yang sama, kelengkapan dokumen projectnya bisa saja berbeda antar project. 

Dalam artikel ini, kita akan membahas bagaimana menentukan dokumen yang digunakan dalam project. 



> Disclaimer : Semua yang dijelaskan pada artikel ini ditulis berdasarkan pengalaman dan kebutuhan internal ArtiVisi. Kebutuhan Anda belum tentu sama dengan kami.





Pertama, kita harus tahu dulu latar belakang kenapa dokumen project dibutuhkan. Setidaknya ada beberapa kegunaan dokumen project, yaitu 




    
  * sebagai media komunikasi di internal tim, dengan client, dengan manajemen, dan pihak lain yang berkepentingan (stakeholder)

    
  * sebagai catatan historis jalannya project

    
  * sebagai alat bantu untuk melihat kondisi terkini project (project visibility)

    
  * sebagai kontrak legal bila terjadi perselisihan



Setelah kita mengetahui apa saja kegunaan dokumen, mari kita teliti satu persatu berdasarkan fase dalam project. 



## Fase Sales



Biasanya pada saat ada tawaran project, kita akan membuat proposal yang relatif tebal (> 10 halaman). Kami di ArtiVisi saat ini sudah hampir tidak pernah membuat proposal project, karena beberapa alasan berikut : 




    
  * semakin tebal dokumen, semakin tidak dibaca

    
  * membuang effort percuma untuk membuat dan maintenance



Fungsi proposal sebenarnya adalah panduan awal untuk membuat agreement. Poin-poin yang ada di proposal akan dipindahkan ke agreement yang selanjutnya akan ditandatangani kedua belah pihak. 

Kami menyederhanakan proposal menjadi quotation biasa, yang berisi informasi sbb : 


    
  * scope pekerjaan

    
  * out of scope

    
  * estimasi durasi

    
  * requirement khusus (misalnya performance requirement, integrasi dengan aplikasi lain, dsb)

    
  * nilai project

    
  * termin pembayaran



Ada beberapa informasi yang biasa ada di proposal dan tidak ada di quotation, yaitu 


    
  * teknologi yang digunakan. Biasanya client kami menurut saja apa solusi yang kita rekomendasikan. Kalaupun ada requirement khusus, akan ditulis di bagian requirement khusus di quotation

    
  * skema layer, tier, database diagram, dsb. Biasanya, implementasi internal aplikasi tidak perlu dipikirkan client. Client cukup menentukan what to be built, dan kami yang memikirkan how to build. Kalau client ingin ikut cawe-cawe urusan internal, biasanya kita tawarkan outsourcing programmer saja, bukan project software.



Selanjutnya, setelah quotation dinegosiasikan dan disetujui, tiba saatnya membuat agreement, atau perjanjian kerja sama. Ada beberapa poin yang dicantumkan dalam agreement, yaitu :


    
  * scope pekerjaan

    
  * out of scope

    
  * estimasi durasi

    
  * klausul keterlambatan delivery

    
  * termin pembayaran

    
  * klausul keterlambatan pembayaran

    
  * prosedur change management



Dari beberapa poin di atas, poin klausul keterlambatan delivery harus mendapat perhatian khusus. Keterlambatan delivery bisa terjadi karena banyak sekali sebab. Tidak semua diantaranya adalah kesalahan tim project. Oleh karena itu, kalau ada klausul seperti ini di agreement, tim project harus mengeluarkan effort ekstra untuk melakukan project tracking. Dengan demikian, bila terjadi keterlambatan, ada data yang lengkap mengenai riwayat dan penyebab keterlambatan tersebut. 

Selesai bagian agreement, mari kita masuk ke tahap berikutnya.



## Project Planning


Tujuan dari dilakukannya dokumentasi pada fase ini adalah untuk mengkomunikasikan bagaimana project akan berjalan, baik ke internal tim maupun ke client. Berikut informasi yang ada dalam project plan : 




    
  * Milestone dan Delivery : list urutan delivery yang akan disampaikan, isi dari masing-masing delivery, dan estimasi tanggalnya

    
  * Daftar Task untuk Milestone berikut. Kita tidak melakukan breakdown untuk milestone lainnya, karena masih banyak ketidakpastiannya. Breakdown task hanya dilakukan untuk milestone yang ada di depan mata. Begitu suatu milestone akan selesai, baru dilakukan breakdown task untuk milestone selanjutnya.

    
  * Daftar Resiko Project : ini adalah hal-hal yang berpotensi menghambat jalannya project, seperti misalnya ada PIC client yang akan resign, teknologi yang belum familiar, dsb



Kami tidak membuat Gantt chart. Sebabnya karena Gantt chart sangat menekankan pada dependensi antar task. Sedangkan di project software, dependensi sangat mudah berubah. Misalnya, kita definisikan Modul B dikerjakan setelah Modul A. Ternyata karena PIC client di modul A sedang ada training di luar kota, diputuskan bahwa Modul B akan dikerjakan duluan. Atau, tadinya direncanakan skema database akan dikerjakan sebelum desain UI. Tapi ternyata karena satu dan lain hal, terpaksa UI dikerjakan duluan. 

Hal-hal seperti ini cukup sering terjadi dalam project. Sehingga penggunaan Gantt chart justru akan merepotkan kita dalam mengupdate project plan. Kita tahu, semakin sulit dokumen diubah, semakin malas kita mengubahnya, dan akhirnya dokumen tersebut menjadi tidak up to date. 



## Project Tracking


Project tracking adalah kegiatan untuk memantau jalannya project. Dalam kegiatan ini, project manager melihat kemajuan project, mengidentifikasi masalah yang terjadi, dan mencarikan solusinya. Kalau masalah yang terjadi berada di luar kemampuan PM, dia akan melakukan eskalasi, yaitu meminta bantuan ke atasannya. 

Di ArtiVisi, kita cuma menggunakan satu dokumen untuk melakukan project tracking, yaitu progress report mingguan, yang berisi informasi sbb:




    
  * Daftar task yang dikerjakan minggu ini dan statusnya, apakah sudah selesai, sedang dikerjakan, atau belum dimulai

    
  * Daftar task yang akan dikerjakan minggu depan

    
  * Daftar deliverable yang akan diberikan minggu depan

    
  * Resiko project saat ini. Daftar ini dibuat pada saat planning, terus menerus dipantau setiap minggu, dan dilaporkan statusnya

    
  * Masalah yang terjadi dalam project dan action plan yang dilakukan

    
  * Perubahan terhadap estimasi awal



Dokumen ini dibuat oleh PM setelah berkonsultasi dengan pasukannya, kemudian dikirim ke manajemen internal dan client. Dengan tidak adanya Gantt chart, kita tidak perlu mengeluarkan effort ekstra untuk mengupdate Gantt chart.



## Fase Requirement


Pada fase ini, tim project menganalisa kebutuhan user sebagai patokan di fase coding. ArtiVisi cuma membuat satu dokumen pada fase ini, yaitu User Story. Dokumen user story berisi informasi sbb: 




    
  * User Goal : tujuan yang ingin dicapai client dalam menggunakan fitur ini

    
  * Ijin Akses : security level untuk menjalankan fitur ini

    
  * Penjelasan : deskripsi naratif tentang fitur ini

    
  * Flow aplikasi : langkah-langkah untuk menjalankan fitur ini

    
  * Desain screen : screenshot prototype atau scan paper prototype

    
  * Rincian field : penjelasan masing-masing komponen dalam desain screen

    
  * Prasyarat : hal-hal yang harus terjadi/ada sebelum fitur ini bisa dijalankan

    
  * Kondisi awal : kondisi aplikasi (data, screen, dsb) sebelum fitur dijalankan

    
  * Kondisi akhir : kondisi aplikasi setelah fitur selesai dijalankan

    
  * Karakteristik khusus : kebutuhan khusus seperti response time, usability, dsb

    
  * Flow pengetesan : bagaimana cara mengetes fitur ini

    
  * Sign Off : persetujuan user bahwa deskripsi dalam fitur ini sudah sesuai keinginan



Nantinya akan ada banyak dokumen User Story sesuai jumlah fitur dalam aplikasi. Setelah User Story ditandatangani, semua perubahan harus melalui change procedure, yaitu dengan mengisi change request form. Berikut informasi yang ada di dalam change request form :


    
  * Penjelasan Perubahan : deskripsi dari apa saja yang ingin diubah

    
  * Alasan Perubahan : mengapa perubahan ini diajukan

    
  * Benefit : keuntungan bila perubahan diimplementasikan

    
  * Dampak : akibat terhadap durasi, effort, dokumen, source code bila perubahan jadi diimplementasikan

    
  * Estimasi : estimasi effort, durasi, cost untuk menjalankan perubahan ini

    
  * Approval : persetujuan manajemen baik kedua belah pihak terhadap perubahan ini





## Fase Desain


Di fase desain biasanya kami mendesain beberapa hal berikut:
 



    
  * skema database

    
  * interkoneksi antar modul

    
  * protokol komunikasi

    
  * format data



Walaupun prosesnya dilakukan, tapi tidak ada dokumen permanen yang dihasilkan. Skema database misalnya. Desain dibuat di papan tulis, dan langsung ditulis dalam bentuk source code (SQL atau Hibernate mapping). Bila suatu saat diperlukan diagram, akan digenerate dengan tools dari database development. Protokol komunikasi dan format data akan dibuat di dokumen user story sebagai requirement internal. 



## Fase Coding


Pada fase ini, kita menghasilkan source code dan user manual.



## Fase UAT


Pada fase ini, kita membuat dua dokumen, yaitu hasil pengetesan sesuai skenario di User Story dan Berita Acara UAT. Biasanya (tapi tidak selalu), berita acara dan hasil pengetesan digunakan sebagai lampiran penagihan.



## Fase Implementasi


Pada fase ini, cuma satu dokumen yang dihasilkan, yaitu Berita Acara Serah Terima Aplikasi. Dokumen ini dibuat dan ditandatangani setelah kegiatan implementasi selesai dilakukan. Beberapa kegiatan dalam fase ini antara lain : 




    
  * Instalasi Aplikasi

    
  * Training User

    
  * Deployment Aplikasi

    
  * Paralel Run



Demikian dokumentasi project yang kita buat selama project. Tidak terlalu banyak kan? Berikut daftarnya 


    
  1. Quotation

    
  2. Agreement

    
  3. Project Plan

    
  4. Progress Report

    
  5. User Story

    
  6. Requirement Sign Off

    
  7. Change Request Form (kalau perlu)

    
  8. User Manual

    
  9. Berita Acara UAT

    
  10. Berita Acara Serah Terima Aplikasi



Kesimpulannya, buatlah dokumen sesuai kebutuhan, bukan sesuai hype yang sedang trend saat ini dan bukan juga sesuai warisan leluhur. 
