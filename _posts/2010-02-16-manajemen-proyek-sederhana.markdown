---
comments: true
date: 2010-02-16 21:55:40
layout: post
slug: manajemen-proyek-sederhana
title: Manajemen Proyek Sederhana
wordpress_id: 508
categories:
- manajemen
---

Di berbagai milis yang saya ikuti, ada diskusi menarik yang muncul. Apa saja yang harus dilakukan untuk dalam project management? Bagaimana SOP (standard operating procedure) nya? Tools apa yang digunakan?

Saya sudah mencoba berbagai metodologi manajemen proyek sepanjang karir saya. Ala koboi di jaman jahiliah dulu, ala waterfall di perusahaan terdahulu, ala CMMI di BaliCamp, dan berbagai ala-ala lainnya. Sepanjang perjalanan tersebut, saya juga membaca tentang berbagai metodologi seperti XP, Scrum, Crystal, RUP, dsb.

Dari semuanya, tentu tidak ada metodologi yang bisa digunakan di semua kondisi. Segalanya serba tergantung keadaan. Walaupun demikian, hasil pengalaman bertahun-tahun tersebut sudah memberikan saya pemahaman tentang latar belakang di aturan-aturan CMMI maupun di metodologi lainnya. Begitu kita mendapatkan alasan dibalik aturan tersebut, kita bisa mengambil esensinya dan mengimplementasikannya dengan bentuk lain yang sesuai dengan situasi kita. 

Berikut adalah manajemen proyek ala ArtiVisi. 





## Fase dan Siklus



Sebelum membahas lebih jauh tentang manajemen proyek, kita luruskan dulu beberapa istilah. Kita mengenal istilah fase dan siklus (lifecycle)

Fase adalah tahapan yang dilalui dalam membuat aplikasi. Biasanya, dalam satu fase akan terdiri dari banyak task.  

Fase yang ada di internal ArtiVisi adalah sebagai berikut : 
1. Requirement Development
2. Coding
3. User Acceptance Test
4. Implementasi

Keempat fase ini berjalan secara serial, artinya, fase coding baru bisa dimulai setelah requirement development selesai, dsb. 
Mendengar ini, pembaca yang beraliran progresif revolusioner pasti langsung demo di Bundaran HI, "Waterfall is dead, long live Agile !!!"

Tunggu dulu sebentar, waterfall dan iteratif itu adalah lifecycle, bukan fase. 

Lalu apa itu lifecycle? Lifecycle adalah urutan kita menjalankan fase tersebut **di keseluruhan project**. Bagaimana maksudnya ini?

Begini, misalnya kita membuat aplikasi akunting. Aplikasi ini terdiri dari beberapa modul yaitu; ledger, hutang/piutang, dan manajemen kas. Lifecycle waterfall adalah apabila kita menjalankan project dengan urutan seperti ini : 




    
1. Project Planning
    
    1. Modul Ledger
    2. Modul Hutang/Piutang
    3. Modul Kas

2. Requirement Development

    1. Modul Ledger
    2. Modul Hutang/Piutang
    3. Modul Kas

3. Coding

    1. Modul Ledger
    2. Modul Hutang/Piutang
    3. Modul Kas

4. UAT

    1. Modul Ledger
    2. Modul Hutang/Piutang
    3. Modul Kas

5. Implementasi

    1. Modul Ledger
    2. Modul Hutang/Piutang
    3. Modul Kas

Lifecycle waterfall memang memiliki banyak kelemahan, apalagi kalau projectnya besar. Karena rentang waktu yang jauh antara fase requirement dan fase UAT, maka biasanya pada saat UAT user merasa kaget karena merasa aplikasi yang dibuat tidak sesuai ekspektasi. Entah karena user sudah lupa requirement yang dia bikin sendiri, ataupun karena proses bisnisnya memang sudah berubah. 

Lifecycle yang dijalankan ArtiVisi adalah Staged Delivery, seperti yang dijelaskan di bukunya Steve McConnell berjudul Rapid Development. Berikut urutannya. 

1. Global / High Level

    1. Project Planning
    2. Requirement Development

2. Modul Ledger
        
    1. Project Planning
    2. Requirement Development
    3. Coding
    4. UAT
    5. Implementasi
    
3. Modul Hutang/Piutang

    1. Project Planning
    2. Requirement Development
    3. Coding
    4. UAT
    5. Implementasi

4. Modul Kas
            
    1. Project Planning
    2. Requirement Development
    3. Coding
    4. UAT
    5. Implementasi

Pendekatan ini bukan waterfall, karena delivery-nya iteratif dan kecil-kecil. Satu modul biasanya berkisar 1 - 2 bulan saja, kira-kira sesuai dengan panjang sprint yang dianjurkan di metodologi Scrum. Tapi pendekatan ini juga bukan murni agile, karena ada global project planning dan requirement di awal. Untuk apa ada kegiatan itu? Tidak lain dan tidak bukan adalah untuk mengantisipasi interkoneksi antar modul. 

Bila kita langsung mengambil salah satu modul untuk diiterasi, maka ada resiko modul tersebut tidak nyambung dengan modul lainnya. Memang bisa disambungkan, tapi nanti akan berkesan tambal sulam. Istilahnya Fred Brooks dalam Mythical Man Month, tidak ada Conceptual Integrity. Oleh karena itu kita perlu melakukan global requirement development untuk melihat interaksi antar modul. 

Pembaca yang teliti mungkin juga akan bertanya, mengapa kita menggunakan istilah Requirement Development, bukannya Requirement Gathering? Ini karena untuk mendapatkan requirement, perlu usaha ekstra, tidak sekedar memungut (gathering) informasi di sana-sini. Seringkali kita harus menanyakan hal yang sama dari beberapa sudut pandang untuk mendapatkan apa maunya user. Di saat lain, kita harus bisa menebak fitur yang tersirat. Kalau user bilang, "Harus ada fitur untuk menyimpan data transaksi", berarti tidak cuma ada screen edit dan list. Tapi juga harus ada fitur search berdasarkan tanggal, produk, nilai transaksi, dan atribut lainnya. Kadangkala ini juga berarti harus ada fitur untuk export/import ke format file lainnya. Jadi, untuk mendapatkan requirement, perlu proses development. Mulai dari sedikit, lalu diakumulasi, dan dikristalisasi sehingga benar-benar akurat dan lengkap. Jangan sampai ada yang ketinggalan. 

Kelima fase yang dijelaskan di atas merupakan fase yang sekuensial. Artinya, satu fase dijalankan setelah fase lain selesai. Kita tidak bisa mulai implementasi sebelum UAT selesai. Well, bisa sih, tapi hasilnya _tidak akan menyenangkan_. Demikian juga, kalau belum selesai coding, ya jangan UAT dulu. Bisa sih maksain UAT, tapi tentu _tidak akan menyenangkan_. Begitu juga halnya kalau kita coding sebelum jelas requirementnya. 

Selain fase yang sekuensial tersebut, ada juga serangkaian kegiatan yang harus kita lakukan secara kontinyu sepanjang project. Yaitu project tracking dan change management. 



## Project Tracking



Project tracking tidak sulit. Setiap minggu, harus ada orang yang melihat project plan dan membandingkan dengan kondisi sekarang. Task mana yang sudah selesai, mana yang sedang dikerjakan, mana yang sudah selesai. Kondisi sekarang ini direkap ke dalam satu laporan, 1-2 halaman, dan dilaporkan ke client dan manajemen. Di ArtiVisi, mengadopsi dari BaliCamp, selain rekap task juga disertakan rekap resiko dan masalah yang terjadi dalam proyek. Ini akan menjadi bahan diskusi dengan client, bagaimana cara memecahkan masalah tersebut, dan bagaimana mencegah resiko agar tidak berdampak merugikan. 



## Requirement Development



Sebelum membahas change management, kita bahas dulu requirement. Di ArtiVisi, requirement bentuknya adalah daftar screen aplikasi, biasanya dibuat dengan Netbeans. Kami tidak menggunakan format naratif seperti yang dianut beberapa organisasi dan dinamai User Requirement Specification (URS), Business Requirement Specification (BRS), atau Software Requirement Specification (SRS), User Story, atau istilah-istilah lainnya. Berdasarkan pengalaman, dokumen naratif membuat user malas berinteraksi. Untuk aplikasi shopping cart sederhana saja, bila dibuatkan *RS, akan menjadi lebih dari 20 halaman. Apalagi untuk aplikasi yang besar. Client akan malas membaca, dan akibatnya pada saat aplikasi dideliver hasilnya tidak sesuai ekspektasi, walaupun sesuai dengan *RS. 

ArtiVisi menggunakan prototype aplikasi untuk requirement. Kita buatkan screen desktop ataupun web, diisi data hardcoded, dan sudah memiliki menu dan flow. Dari screen registrasi klik submit akan masuk screen konfirmasi, dst. Dengan menggunakan prototype yang bisa diisi dan diklik, user akan lebih bersemangat untuk berinteraksi, sehingga hasil requirement akan menjadi berkualitas. Pada fase requirement ini user bebas meminta modifikasi apapun asal masih dalam scope yang disepakati. 

Setelah tidak ada lagi perubahan signifikan, semua screen dicapture, dimasukkan ke dokumen, dan diapprove client (sign off). Ini akan menjadi patokan dalam proses development, diantaranya digunakan oleh programmer untuk coding, dan technical writer untuk membuat user manual. 



## Change Management



Perubahan setelah sign off harus melalui prosedur change management. Ini gunanya agar progress project bisa terkendali. Sering sekali banyak project molor dan tidak selesai-selesai karena banyak perubahan ini itu yang tidak dikelola dengan baik sehingga tidak terlihat titik akhirnya. 

[![Prosedur Change Management ](/images/uploads/2010/02/change-procedure_id-212x300.png)](/images/uploads/2010/02/change-procedure_id-212x300.png)


Prosedur change management tidak rumit. Hanya terdiri dari tiga langkah saja, yaitu : 

1. Requester menjelaskan perubahan yang diminta, apa alasan yang mendasari perubahan
2. Tim development menganalisa dampak perubahan, apakah ada coding yang berubah, user manual, test scenario, dsb. Output dari analisa ini adalah estimasi berapa tambahan waktu, tenaga, dan biaya untuk mengeksekusi perubahan ini
3. Manajemen di sisi client memutuskan berdasarkan estimasi tersebut, apakah perubahan ini akan : 
        
    * Dijalankan segera
    * Ditunda ke iterasi berikut
    * Ditolak, artinya tidak jadi dijalankan pada project ini, mungkin saja dijadikan project baru.

Dengan adanya proses ini, akan jelas berapa hari project akan mundur, dan berapa biaya tambahannya. 

Demikian sharing tentang praktek yang kita gunakan di ArtiVisi. Metodologi ini cukup sederhana, sehingga bisa dijalankan bahkan di project yang one-man-show. Project manager dia, business analyst dia, programmer dia juga, training lagi-lagi dia, terima transferan tidak lain dan tidak bukan adalah dia juga. Di project berskala besar, metodologi ini juga cukup efektif untuk membuat project berjalan secara predictable.

Masih ada penjelasan lebih lanjut yang harus ditulis, diantaranya bagaimana cara menghitung (estimasi) project, dan bagaimana melakukan project planning dan tracking yang efektif. Ini akan dibahas di tulisan yang lain. 

Bila ingin berkomentar atau berdiskusi, silahkan bergabung di milis it-project-indonesia@googlegroups.com dengan cara mengirim email kosong ke it-project-indonesia-subscribe@googlegroups.com

