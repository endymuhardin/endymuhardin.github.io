---
comments: true
date: 2010-04-17 21:20:29
layout: post
slug: fase-requirement
title: Fase Requirement
wordpress_id: 522
categories:
- manajemen
---

Dari seluruh fase yang ada di project, fase Requirement Development adalah yang paling penting. Bila kita melakukan kegiatan requirement dengan asal-asalan, akibatnya antara lain : 




    
  * aplikasi sudah selesai dibuat, tapi tidak sesuai dengan keinginan user

    
  * pada fase coding, banyak terjadi delay karena ternyata ada requirement yang belum jelas

    
  * pada fase coding, banyak pekerjaan harus diulang karena salah memahami requirement



Kenapa saya sebut dengan istilah Requirement Development, bukan Requirement Gathering seperti yang umum dipakai orang? Sebabnya adalah karena requirement yang baik itu tidak didapat dengan mudah. Tidak seperti memungut barang di jalanan (gathering), melainkan harus melalui proses yang iteratif (development). Kita tidak bisa mendapatkan requirement yang baik sekali jalan. Kita harus terus menerus melakukan investigasi, klarifikasi, verifikasi, agar requirement yang didapat benar-benar bagus kualitasnya. 

Pada artikel ini, kita akan membahas bagaimana cara membuat requirement yang baik. 



Sebelum ke masalah teknis, kita lihat dulu, kenapa kita harus melalui fase requirement? Kenapa tidak langsung coding saja? Kan customer ingin aplikasi jadi, bukan notulensi meeting dan setumpuk dokumen?



## Tujuan Requirement



Kita melakukan requirement development karena kita ingin tahu apa yang ingin dibuat. Setelah mengetahui apa yang ingin dibuat, barulah kita bisa: 




    
  * memilih anggota tim yang tepat

    
  * memperkirakan biaya dan waktu yang dibutuhkan untuk membuatnya

    
  * memilih arsitektur dan teknologi yang sesuai



Jadi, proses requirement membantu kita untuk melakukan project planning. 
Selain itu, proses requirement juga membantu kita mencegah project menjadi molor dan merugi. Kalau kita langsung terjun coding, maka akan banyak waktu terbuang untuk melakukan perubahan. Misalnya, kalau kita sudah coding, ternyata user minta tambahan satu field entry, maka kita terpaksa mengubah tampilan, skema database, format report, dokumentasi user (kalau sudah ada), dan mungkin banyak lagi. Tapi kalau perubahan ini dilakukan pada fase requirement, paling effortnya cuma mengubah dummy dan dokumentasi user story saja. 

Requirement juga bisa membantu kita mengendalikan perubahan dalam project, seperti kita akan lihat di bagian selanjutnya. 

Setelah kita tahu tujuannya, mari kita ke langkah pertama yang paling menentukan.



## Identifikasi Usernya



Segera setelah project dimulai, kita akan segera dihujani jadwal meeting untuk membahas requirement. Nah di sini kita harus jeli. Mendengarkan user itu penting, tapi yang lebih penting lagi adalah menjawab pertanyaan, siapa usernya?

Ada bermacam-macam jenis user, dan ini menentukan informasi apa yang ingin kita dengarkan, dan informasi mana yang kita abaikan. 




    
  * End User. Ini adalah user yang nantinya akan menggunakan aplikasi. Kita harus mendengarkan user ini, terutama dari sisi usability. Apakah aplikasi kita nyaman dipakai, mudah digunakan, indah dilihat, dan sebagainya. Tapi, jangan sekali-kali mengambil keputusan tentang proses bisnis dengan user ini. Jangan juga memutuskan untuk menambah/mengurangi fitur **hanya** berdasarkan pendapat user ini. Kita membutuhkan user selanjutnya, yaitu : 

    
    
  * Sponsor atau Client. Ini adalah orang yang akan membayar invoice untuk pembuatan aplikasi. Semua keputusan penting (proses bisnis dan list fitur adalah penting) harus disetujui Client. Dan jangan salah, seringkali pendapat End User tidak sama dengan pendapat Client. Misalnya, Client menginginkan suatu transaksi harus melalui approval supervisor, manager, dan direktur secara berjenjang. Tapi tentunya fitur ini akan memberatkan End User, karena ada banyak proses yang harus dilalui. Nah, tentunya Anda tahu siapa yang harus kita dengarkan. Nah, jadi kapan-kapan melakukan requirement development, cari tahu dulu siapa yang mengotorisasi bilyet giro :D


    
  * Konsultan Internal. Seringkali di organisasi client, ada seseorang yang cukup senior dari sisi teknis. Bisa jadi dia adalah divisi IT di organisasi client, atau orang luar yang dipercaya oleh client. Apakah orang ini harus kita dengarkan pendapatnya? Tergantung dari seberapa besar pengaruhnya terhadap client. Kita bisa mengetes pengaruhnya dengan membuat satu fitur yang tidak sesuai dengan pendapat konsultan internal ini, dan lihat apa reaksi client. Kalau client setuju dengan kita, berarti pengaruhnya tidak besar, dan pendapat selanjutnya bisa kita diabaikan.


    
  * Customer. Ada kalanya Client membeli aplikasi kita untuk dijual lagi ke orang lain. Nah orang lain ini disebut Customer. Sukses atau tidaknya project kita banyak ditentukan oleh berapa customer yang bisa didapatkan client. Jadi, penting juga untuk kita mengetahui profil customer (kalau ada). Apa business objective dari customer, sehingga bisa kita akomodasi dengan baik



Baiklah, saya sudah memetakan, si A adalah End User, si B Client, si C konsultan internal, dan si D adalah customernya. Apakah sekarang sudah bisa kita mulai interviewnya? Ok ok .. mari kita suruh Business Analyst (BA) untuk melakukan tugasnya. Oh, tunggu dulu, BA belum direkrut? Bagaimana kualifikasinya?



## Kualifikasi Business Analyst


Pertama, BA harus menguasai proses bisnis. Kalau kita ingin membuat aplikasi akunting, BAnya harus mengerti akuntansi. Aturan sederhana dan logis, tapi masih banyak saja perusahaan yang mengirim programmer untuk melakukan requirement development. 

Secara umum, BA harus sudah punya pengetahuan dasar dulu sebelum dia ketemu client. Kalau kita kirim programmer, maka dia bukan melakukan requirement development, tapi dia akan belajar bisnis proses ke client. Seperti kita akan lihat, ini pasti akan menimbulkan delay, karena : 



> Seorang BA harus bisa membedakan mana proses bisnis yang fundamental dan jarang berubah (karenanya boleh dihardcode), mana yang kondisional dan sering berubah (sehingga harus configurable)



Programmer yang belajar bisnis proses ke client tidak akan bisa membedakan ini. Sebagai contoh, mari kita lihat prosedur procurement. 

Proses bisnis fundamentalnya adalah, ada pengajuan (purchase request), kemudian dilanjutkan dengan minta quotation ke vendor (request for quotation), memilih vendor, baru melakukan pemesanan (purchase order). 
Ini adalah flow fundamental, dan boleh di-hardcode. 

Kemudian end user akan bilang, purchase request akan dilakukan oleh masing-masing dept, approval dilakukan manager, dst, dst. Siapa yang mengentri, siapa yang mengapprove, dan pada nilai transaksi berapa dia boleh approve, ini adalah kondisional dan harus bisa dikonfigurasi. 

Nah, seorang BA yang baik harus bisa membedakan kedua hal ini. 

Coba temani BA anda pada saat sesi interview dengan end user. Kalau dia pernah bilang begini, 



> Oh, di perusahaan Anda prosesnya begini ya? Biasanya yang umum dilakukan orang adalah seperti ini. Proses Anda kurang optimal karena blablabla. Apakah proses Anda mau berubah, atau aplikasi yang ingin ikut proses Anda dengan konsekuensi ABC?



Nah, kapan-kapan dia minta naik gaji, jangan buru-buru ditolak. Ini BA bagus. Dia menguasai bidangnya, dan tahu best practices. 

Banyak perusahaan yang ingin bikin produk dari project tapi tidak kunjung berhasil. Misalnya, ada client minta dibuatkan aplikasi gudang, trus manajemen mikir, "Wah kayaknya ini kalo dibikin jadi produk bakalan prospek". Tapi ternyata setelah project selesai, aplikasinya tidak applicable di perusahaan lain. Ini salah satu sebabnya adalah BA yang kurang pengalaman sehingga tidak tahu mana fitur yang generik berlaku umum dan mana yang spesifik hanya untuk perusahaan tertentu saja. 

Tahu bisnis proses saja masih kurang, BA yang baik juga paham usability. Seperti kita tahu, ada banyak cara untuk mengentri transaksi. Bisa dientri via screen, bisa upload file, bisa via HP, bisa import dari aplikasi lain, dsb. BA yang baik bisa memberikan rekomendasi pada programmer mengenai user experience. Bagaimana urutan screen, penempatan komponen, apakah pilihan tertentu disajikan dengan dropdown, radio, atau lookup. 

Kalau BAnya tidak paham usability, aplikasi kita akan benar secara proses bisnis, tapi tidak enak digunakan. Programmer tidak bisa menentukan usability, karena dia tidak tahu bagaimana biasanya end-user menggunakan fitur tertentu.  

Ok, BA saya sudah canggih, paham bisnis proses, tau best practices, dan pernah magang sama [Jakob Nielsen](http://www.useit.com). Bisa kita mulai interview user?



## Interview User


Pada fase ini, biarkan saja BA menjalankan tugasnya. Dia akan berbicara dengan user, dan menanyakan hal-hal berikut: 




    
  * Flow global dari awal sampai akhir. Untuk aplikasi procurement, berarti dari request pembelian, sampai barang diterima. 

    
  * Flow detail untuk masing-masing tahap. Contohnya, bagaimana detail flow proses request pembelian

    
  * Variasi skenario. Di sini BA akan mengidentifikasi percabangan dari tiap flow. Apa saja variasi skenarionya, perbedaan datanya, role user yang mengaksesnya, kondisi outputnya, dan sebagainya.



Jangan lupa untuk meminta : 

    
  * Contoh report yang diinginkan

    
  * Sampel data transaksi untuk kita test di internal

    
  * Rumus atau formula perhitungan



Tergantung clientnya, ada kemungkinan dia akan meminta perjanjian kerahasiaan sebelum mengeluarkan data-data di atas. 

Setelah interview, BA pulang ke kantor, dan akan membuat dokumentasi requirement.



## Dokumentasi Requirement



Untuk apa kita membuat dokumentasi? Tujuannya adalah 



    
  * Untuk mengidentifikasi kalau ada hal yang kurang jelas, sehingga bisa langsung ditanyakan

    
  * Sebagai bahan untuk verifikasi dengan user, apakah pemahaman kita sudah sama dengan yang dimaksud user.

    
  * Sebagai pedoman untuk programmer

    
  * Untuk mencegah project molor



Lho, bagaimana bisa dokumen requirement mencegah project molor? Ya bisa saja, berikut alasannya


    
  * Kalau ada kesalahan dan ditemukan pada fase ini, biaya perbaikannya jauh lebih kecil daripada kalau ditemukan pada fase coding. Misalnya ada kesalahan rumus perhitungan. Kalau kesalahan ini ditemukan pada fase requirement, paling biayanya cuma mengedit user story. Tapi kalau ditemukan pada waktu UAT, bisa-bisa butuh 2-3 hari untuk fixingnya. Ini [katanya Steve McConnell](http://www.stevemcconnell.com/articles/art08.htm), bukan bikin-bikinan saya. 

    
  * Setelah requirement disign off, semua perubahan harus melalui change procedure. Ini mencegah project molor karena user terus menerus berubah pikiran. Sekarang maunya A, besok B, lusa ganti lagi.



Lalu, apa saja yang harus didokumentasikan? Daripada panjang lebar, silahkan lihat [template User Story ArtiVisi](http://software.endy.muhardin.com/downloads/user-story.odt). Di situ sudah kita siapkan form isian apa saja yang harus dicantumkan. 

Coba lihat dulu, supaya nyambung dengan pembahasan di bawah. 



> Lho kenapa ada flow pengetesan? Apa bedanya dengan test scenario?



Sama saja, yang kita maksud flow pengetesan memang adalah test scenario. Lalu apakah wajib dibuat pada fase requirement? Kami sangat menganjurkan untuk membuatnya, dengan alasan sebagai berikut: 




    
  * Dengan memikirkan bagaimana nanti pengetesannya, kualitas user story akan meningkat. BA terpaksa memikirkan step-by-step bagaimana aplikasi akan digunakan, apa inputnya, dan apa outputnya. Dengan memikirkan ini, semua variasi dan kebutuhan input, dan ekspektasi output mau tidak mau akan terpikirkan dan teridentifikasi sejak dini. Ini akan mengurangi requirement yang ambigu, tidak lengkap, atau tidak mungkin diimplementasikan

    
  * Test scenario yang ditandatangani user merupakan exit strategy bagi vendor. Kalau client sudah setuju dengan skenario testnya, maka vendor cukup membuat aplikasi yang lulus test tersebut. Setelah lulus test, jangan ditambah-tambahi lagi. Ini akan mencegah programmer menambah fitur-fitur menarik namun tidak memiliki business value.



Seperti bisa dilihat pada template, kita mengharuskan adanya screen prototype di dokumen requirement. Screen ini dirancang oleh BA (makanya dia harus paham usability), dan kalau mau, bisa dibuatkan dummy-nya. Dummy bisa dibuat dengan apapun teknologi yang murah dan cepat. Begitu desain screen jadi, seharusnya tidak lebih dari 2 jam waktu yang dibutuhkan untuk membuat dummy-nya, bahkan untuk screen kompleks sekalipun.

Yang harus ada di desain screen adalah : 

    
  * Input field, harus jelas komponennya, apakah text, radio, dsb

    
  * Contoh isian. Jangan membuat input kosong, buatlah seolah-olah sudah diisi user. Ini akan memudahkan pada saat presentasi

    
  * Contoh output. Demikian juga dengan output hasil query, report, dsb. Jangan tampilkan tabel kosong. Isilah dengan data statis barang beberapa baris, agar user mempunyai gambaran bagaimana hasil akhirnya



Tidak perlu repot-repot mengimplementasikan dummy ini. Semuanya adalah data statis yang langsung diketik apa adanya. 

Dokumen user story dan dummy dipresentasikan ke end user dan direvisi sesuai input. Pada fase ini, end user bebas membuat perubahan apapun yang diinginkan. Perubahan bebas untuk diakomodasi, asal jangan pernah melupakan siapa yang tandatangan otorisasi bilyet giro :D



## Sign Off


Setelah semua user story diiterasi dengan end user sampai puas, maka tiba saatnya untuk melakukan feature-freeze. Semua dokumentasi requirement diupdate sehingga sesuai kondisi terakhir, lalu minta approval tertulis dari client. Ingatlah selalu, **approval client, bukan end-user, bukan konsultan internal**. Ini adalah aktivitas paling critical dan harus dilakukan. Segala usaha proses requirement akan percuma tanpa sign off client. 



## Change Management


Sebelum sign off, end user bebas mengajukan perubahan apapun. Setelah sign off, semua perubahan harus melalui change procedure. Intinya adalah, perubahan diajukan secara tertulis, diestimasi penambahan durasi dan costnya, lalu diajukan ke manajemen, baik vendor maupun client. Kalau salah satu pihak tidak setuju, maka perubahan tidak akan dijalankan. 

![Prosedur Change Management ](/images/uploads/2010/02/change-procedure_id-724x1024.png)

Lebih jelas tentang informasi apa saja yang dibahas di change management, bisa melihat [template change request ArtiVisi](http://software.endy.muhardin.com/downloads/change-request.odt). 

Seperti kita lihat, di sini faktor sign off sangat berperan. Tanpa ada sign off, tidak ada batas kapan user bisa berubah seenaknya, dan kapan tidak boleh. 

Kalau change management dijalankan dengan baik, project akan lebih terkontrol. Walaupun ada kemunduran, kedua belah pihak sadar apa sebabnya. Semua perubahan diketahui manajemen, sehingga tidak ada bos yang tiba-tiba muncul dan bilang



> Ini project kenapa gak beres-beres?



Kunci sukses change management adalah mulai dari awal, dan perhatikan hal kecil. Kita sebagai vendor sering mengabaikan prosedur ini dengan berbagai alasan, diantaranya




    
  * Ah perubahannya terlalu kecil, kalo langsung diimplement cuma 5 menit, tapi kalo change procedure bisa 2 hari.

    
  * Kita tidak mau terlihat birokratis seperti pegawai kelurahan perpanjang KTP

    
  * Kita berbaik hati pada client, masa perubahan sedikit saja hitung-hitungan banget



Ini merupakan kesalahan besar. Dengan memberlakukan change procedure bahkan untuk hal kecil, kita akan menimbulkan kesadaran di client bahwa kita mengelola project dengan ketat. Dengan demikian, mereka tidak sembarangan meminta perubahan. Client juga akan menyadari bahwa perubahan kecil saja akan berdampak pada keseluruhan project. 

Kalau kita memang ingin berbaik hati pada client, silahkan digratiskan. Tapi prosedur tetap dijalankan. Jadi kalo tiba-tiba ada bos client yang tanya seperti di atas, tinggal kita sodori binder berisi daftar change request yang sudah diapprove. 

Change procedure juga ada bonusnya, yaitu tidak banyak mengganggu programmer. Estimasi dan approval mostly dilakukan oleh business analyst dan project manager. Dan belum tentu juga client setuju. Kita akan menghemat banyak waktu, konsentrasi, dan pikiran programmer yang tidak perlu memikirkan usulan perubahan yang ternyata tidak disetujui. 

Di change request juga ada timing kapan change akan diberlakukan. Untuk menjaga konsentrasi dan ritme tim, PM bisa menggunakan opsi ini untuk menunda change ke iterasi selanjutnya. 



## Requirement Traceability


Yang satu ini titipan dari CMMI. Di process area Requirement Management, CMMI mengharuskan adanya _bidirectional traceability_. Artinya, setiap hal di requirement harus bisa ditelusuri dokumen desain mana yang membahasnya, baris kode mana yang mengimplementasikannya, test scenario mana yang memverifikasinya. Demikian juga sebaliknya (makanya disebut bidirectional), setiap baris kode, harus bisa ditelusuri requirement mana yang membutuhkannya. 

Ini ide yang bagus. Dengan melaksanakan ini, kita memastikan bahwa effort coding kita benar-benar efisien. Tidak ada effort terbuang percuma untuk fitur-fitur yang tidak perlu. Demikian juga sebaliknya, kita memastikan bahwa semua requirement sudah diimplementasikan dan tidak ada yang ketinggalan. 

Walaupun demikian, ide bagus belum tentu realistis di lapangan. Saat ini di ArtiVisi, kita baru bisa merelasikan antara baris kode dengan requirement dengan menggunakan Trac. Tapi tidak untuk dokumen lainnya seperti user manual, test scenario, dsb. Dan itupun tidak bidirectional. 

Kalau ingin tahu bagaimana ini diimplementasikan, silahkan lihat [aplikasi ini](http://sourceforge.net/projects/osrmt/). 

Oh iya, kalau kita sudah melakukan semua anjuran di artikel ini, lengkap dengan Requirement Traceability, kita sudah siap untuk diaudit untuk proses area Requirement Management (Maturity Level 2) dan Requirement Development (Maturity Level 3) :D

Demikian penjelasan tentang fase requirement. Semoga bermanfaat. 

