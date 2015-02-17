---
comments: true
date: 2008-06-17 18:17:17
layout: post
slug: apa-itu-cmmi
title: Apa itu CMMI?
wordpress_id: 333
categories:
- manajemen
tags:
- cmmi
- management
---

Di [milis Asosiasi Pengembang Perangkat Lunak Indonesia (APPLI)](http://tech.groups.yahoo.com/group/appli-member) ramai dibahas mengenai standarisasi dalam pengembangan perangkat lunak. Salah satu standar yang populer digunakan adalah CMMI (Capability Maturity Model Integration) yang dikembangkan oleh Carnegie-Mellon University, untuk lebih tepatnya dalam departemen Software Engineering Institute. Selain itu, ada juga blog [ini](http://arian75.wordpress.com/2008/06/16/sei-cmmi-maturity-apakah-ada-perusahaan-it-indonesia-yang-mendapatkannya/) dan [ini](http://santus.wordpress.com/2008/02/04/cmmi-what-is-it-for/) yang membahas tentang CMMI.

Dengan adanya standar, organisasi dapat berkembang dengan lebih terarah. Semua anggota organisasi mulai dari programmer, analis, tester, manajer, dan direktur menjadi tahu apa ruang lingkup pekerjaannya. Apa yang harus disediakan bagi pihak lain, dan juga apa yang bisa diharapkan dari departemen lain. Dengan demikian, tidak banyak effort yang terbuang karena miskomunikasi atau kurang koordinasi. 

Sayangnya, dunia enterpreneur IT di Indonesia masih jarang yang hirau terhadap masalah standarisasi ini. Berbagai alasan dikemukakan, antara lain: 



	
  * Tidak mengerti bahasa Inggris

	
  * Standar luar negeri tidak cocok untuk kondisi lokal

	
  * Standar membuat organisasi monoton dan membosankan

	
  * dan segudang alasan lainnya



Menurut saya, segala alasan itu cuma pembenaran saja untuk sifat malas belajar. Sebagai praktisi IT, tentunya kita sadar bahwa dunia tempat kita hidup sekarang (internet) dibangun di atas standar. Untuk bisa browsing, kita menggunakan protokol HTTP. Memeriksa email, menggunakan protokol POP3, IMAP, dan SMTP. Chatting, menggunakan protokol IRC, XMPP. Voice chat, menggunakan protokol SIP. 

Protokol adalah nama lain dari standar. So, standar membuat hidup kita menjadi lebih baik. Setidaknya, standar apapun lebih baik daripada tanpa standar. Melalui artikel ini, mudah-mudahan para praktisi tergerak untuk setidaknya mempelajari dulu standar sebelum mengeluarkan vonis "tidak perlu" atau "tidak sesuai".

Sekarang, mari kita lihat standarisasi dalam pengembangan perangkat lunak. Standar yang populer dan cukup saya kuasai adalah CMMI, jadi mari kita bahas tentang CMMI. Kebetulan saya pernah ikutan mengantarkan BaliCamp meraih CMMI Maturity Level 3. 



### Apa itu CMMI


CMMI adalah singkatan dari Capability Maturity Model Integration. Ini adalah kerangka kerja (framework) yang bisa digunakan untuk mengembangkan proses di dalam perusahaan. 

Apa itu proses? Proses adalah cara kita melakukan suatu tugas. Misalnya, membuat proposal, menganalisa kebutuhan client, membuat kode program, dan kegiatan lainnya. Semua tata laksana kegiatan tersebut dikenal dengan nama proses atau prosedur. 

CMMI membantu kita untuk memperbaiki proses di perusahaan/organisasi kita. Dengan membaiknya proses, diharapkan produk yang dihasilkan akan ikut menjadi baik. 

CMMI dirumuskan oleh Software Engineering Institute di Carnegie Mellon University. Para peneliti di SEI telah mengamati proyek pembangunan perangkat lunak di seluruh dunia, mulai dari proyek kecil sampai proyek raksasa. Organisasi yang diteliti meliputi NASA, IBM, dan kontraktor Departemen Pertahanan Amerika Serikat. Pengalaman yang dimiliki organisasi tersebut dirangkum dalam seperangkat aturan yang disebut CMMI. Nah, apakah perusahaan kita sudah lebih canggih daripada organisasi di atas, dalam hal mengelola proyek software? Kalau belum, mari kita belajar dari mereka.



### Apa sih isinya CMMI ??


CMMI terdiri dari rangkaian practices. Dalam rangkaian practices ini ada rambu-rambu atau rekomendasi yang dapat diikuti. Practices dalam CMMI dibagi menjadi dua, yaitu Generic Practices (GP) dan Specific Practices (SP). 

Bila kita sudah mengimplementasikan practices dengan sempurna, kita dianggap sudah memenuhi Goals. Sama seperti practices, ada Generic Goals (GG) dan Specific Goals (SG). 

SG dan SP dikelompokkan menjadi Process Area (PA). Total ada 22 Process Area dalam CMMI for Development versi 1.2.

Daftar PA, GG, SG, GP, dan SP dapat dilihat di spesifikasi CMMI yang bisa didonlod gratis [di sini](http://www.sei.cmu.edu/publications/documents/06.reports/06tr008.html). 



### Apa hubungannya CMMI dengan standarisasi ISO


CMMI dan ISO sama-sama standar yang digunakan untuk menilai proses suatu organisasi. Kalau kita programmer Java, kita punya sertifikasi SCJP, SCWD, SCBCD, dan sebagainya. Nah, anggap saja CMMI atau ISO ini adalah sertifikasinya perusahaan. 

Kalau di SCJP yang dinilai adalah penguasaan kita terhadap bahasa pemrograman Java, maka di ISO/CMMI yang dinilai adalah penguasaan perusahaan terhadap prosesnya sendiri.

Perbedaan CMMI dan ISO terletak pada ketelitiannya. Bila kita ingin perusahaan kita mendapat sertifikasi ISO, perusahaan kita harus memiliki Standard Operating Procedure (SOP) yang tertulis. Kemudian kita harus membuktikan pada badan sertifikasi bahwa SOP tersebut kita jalankan dengan baik. Apa saja yang kita tulis dalam SOP bebas terserah kita. ISO tidak mengatur sampai ke tingkat itu.

Berbeda dengan CMMI, selain kita punya SOP, dia punya aturan khusus tentang isi SOP. Misalnya, kalau kita melakukan analisa kebutuhan (requirement gathering), ada beberapa aturan yang harus diikuti, misalnya: 



	
  * Pernyataan kebutuhan user harus dicatat

	
  * Pernyataan kebutuhan harus dikonfirmasi ke user

	
  * Pernyataan kebutuhan harus disetujui kedua pihak

	
  * Kalau ada perubahan, harus dicatat

	
  * Antara kebutuhan dan software yang dideliver, harus bisa dilacak bolak-balik



Singkatnya, kalau kita lulus ISO, belum tentu lulus CMMI. Sebaliknya, kalau kita lulus CMMI, besar kemungkinan kita akan langsung lulus ISO bila ikut sertifikasinya.



### Apa yang dimaksud Maturity Level ??


Tujuan awal dirumuskannya CMMI sebenarnya adalah untuk mendukung proses tender di lingkungan Departemen Pertahanan Amerika Serikat (US-DoD). Mereka ingin memiliki sistem penilaian terhadap semua vendor yang mengajukan proposal. Untuk itu dirumuskanlah sistem penilaian vendor berupa Maturity Level (ML).  

Maturity Level di CMMI ada 5, mulai dari yang terendah ML 1, sampai yang paling canggih ML 5. Bila perusahaan kita sudah ML-5, maka kita bisa ikut dalam tender proyek software rudal Patriot. Begitu kira-kira. 

Setiap ML memiliki seperangkat PA yang harus dipenuhi agar kita berhak menggunakan titel ML tersebut. Sebagai contoh, bila kita ingin lulus ML-2, maka kita harus mengimplementasikan 7 PA. Untuk mencapai ML-3, kita harus mengimplementasikan 7 PA dari ML-2 ditambah dengan 11 PA dari ML-3. Demikian seterusnya, sehingga ML-5 yang sudah mengimplementasikan 22 PA. 

Bila kita sama sekali belum mengimplementasikan apa-apa, perusahaan kita dikategorikan sebagai ML-1. Level ini diadakan sebagai hiburan bagi perusahaan yang sudah ikut SCAMPI Class A, tapi tidak lulus bahkan di ML-2. Well, ML-1 kedengarannya lebih baik daripada No-ML atau ML-0 :p

Daftar lengkap PA per ML bisa dilihat di [spesifikasi CMMI](http://www.sei.cmu.edu/publications/documents/06.reports/06tr008.html).



### Perusahaan saya ingin mendapat ML-5, bagaimana caranya?


Pertama, tentunya perusahaan kita harus memenuhi semua persyaratan mulai dari ML-2 sampai ML-5. Perusahaan kita harus sudah punya SOP yang mengatur semua proses sesuai aturan CMMI. Bila ada aturan yang tidak kita pahami, kita bisa datangkan konsultan untuk menjelaskan. 

Setelah ada SOP tersebut, setiap orang dalam perusahaan harus memahami dan menjalankannya dengan benar. Setelah kita yakin bahwa perusahaan kita mampu, kita mendatangkan appraiser atau auditor untuk memeriksa proses kita. 

Kegiatan appraisal ini disebut dengan SCAMPI. Ada macam-macam SCAMPI, tapi yang berhak mengeluarkan peringkat ML hanyalah SCAMPI Class A. 

Dalam SCAMPI, Lead Appraiser(LA) akan merekrut beberapa orang dari perusahaan kita untuk membantunya mengaudit. Tim auditor ini disebut Appraisal Team Member (ATM). Perusahaan kita juga juga harus menyediakan tim yang akan diwawancarai oleh ATM, yang disebut dengan Functional Area Representative (FAR). 

FAR merupakan perwakilan dari berbagai departemen dalam organisasi. Mungkin nantinya akan ada kelompok FAR dari procurement, tim project, network administrator, programmer, tester, dan lainnya.

ATM dibutuhkan untuk menterjemahkan aturan CMMI ke dalam SOP perusahaan. Misalnya, dalam CMMI ada aturan mengenai analisa kebutuhan, yaitu process area Requirement Management (REQM) dan Requirement Development (RD). Process area ini di perusahaan A mungkin diimplementasikan dengan dokumen Software Requirement Specification (SRS), tapi di perusahaan B mungkin namanya User Requirement Specification (URS), dan di perusahaan C berupa Use Case Diagram dan User Stories. Nah, tugas ATM adalah menjembatani antara istilah CMMI dan istilah internal perusahaan.

Wawancara ATM tidak aneh-aneh. Untuk setiap proses area, mereka akan tanya apakah FAR sudah mengimplementasikan. Bila sudah, mana buktinya. Bukti ini bisa berupa hard-copy, bisa juga soft-copy. Kita bisa mengajukan email sebagai evidence. Bahkan kita juga bisa menunjukkan log Subversion atau item bug dalam aplikasi bug tracker.

Dalam sintaks Java 5, proses appraisal dalam SCAMPI Class A bisa digambarkan sebagai berikut.

    
    
    int level = 1;
    
    appraisal:
    for(int i=1; i<=5; i++) {
        List allProcessAreas = maturityLevel[i].getProcessAreas();
        for(ProcessArea pa : allProcessAreas) {
            for(GenericPractice gp : allGenericPractices) {
                if(!far.isImplement(pa, gp) { break appraisal; }
            }
    
            for(SpecificPractice sp : pa.getSpecificPractices()) {
                if(!far.isImplement(sp)) { break appraisal; }
            }
    
            level++;
        }
    }
    


Berdasarkan hasil wawancara FAR oleh ATM, LA akan memutuskan ML berapa yang pantas untuk perusahaan kita. 

Semua hasil SCAMPI Class A akan dilaporkan pada SEI dan akan [dipublikasikan di internet](http://sas.sei.cmu.edu/pars/pars.aspx). Sebagai contoh, kita bisa melihat [hasil appraisal BaliCamp pada tahun 2006](http://sas.sei.cmu.edu/pars/pars_detail.aspx?a=7546). 

Sayangnya, sampai sekarang belum ada appraiser lokal. Jadi kita harus mendatangkan appraiser dari luar negeri. 

Informasi lebih rinci mengenai SCAMPI dapat dilihat [di spesifikasi resminya](http://www.sei.cmu.edu/publications/documents/06.reports/06hb002.html). Di sana ada penjelasan rinci tentang apa saja syarat menjadi ATM, bagaimana proses interview dilakukan, dan bagaimana cara memutuskan apakah suatu evidence sudah memenuhi syarat atau belum.



### Apa yang dimaksud Continuous Representation?


Perusahaan mengadopsi CMMI untuk berbagai tujuan. Ada yang bermotif marketing, yaitu meraih ML tertentu dengan harapan akan mendapat project dari US-DoD, ataupun simply memperkeren Company Profile. Sama saja dengan kita ambil SCJP. 

Ada juga yang memang berniat meningkatkan kualitas prosesnya. Mengadopsi CMMI dengan harapan perusahaan akan menjadi lebih baik. 

Kita kesampingkan dulu motif marketing. Mari kita lihat motif peningkatan kualitas. Ada beberapa pendekatan untuk mengadopsi CMMI. Kita bisa mengadopsi per ML, misalnya tahun ini ML-3, berikutnya ML-4, dan seterusnya. Atau bisa juga kita hanya memfokuskan perbaikan pada satu process area tertentu saja, misalnya Requirement Management, atau Risk Management. 

Bila kita berorientasi ML, maka kita mengambil pendekatan Staged Representation. Sedangkan bila kita berorientasi PA, maka kita mengambil pendekatan Continuous Representation. 



### Bila perusahaan saya sudah ML-5, apakah perusahaan akan menjadi monoton dan membosankan? Apakah karyawannya akan menjadi seperti robot belaka??


Bagi programmer seperti saya dan Anda, kreativitas dan improvisasi adalah kenikmatan kerja yang utama. Itulah yang membuat kita memilih profesi software developer. Oleh karena itu, wajar bila kita mengkhawatirkan masalah ini. 

Well, saya sudah pernah mengantarkan BaliCamp meraih ML-3, dan ikut terlibat dalam persiapan mencapai ML-5. Jadi, yang akan saya ceritakan ini adalah pengalaman nyata, bukan FUD (Fear, Uncertainty, Doubt). 

Sebagai programmer yang terlibat dalam project, hal yang paling menyebalkan bagi kita bukanlah kesulitan teknis atau kerumitan algoritma. Semakin sulit, semakin menantang bagi kita. Hal yang paling menyebalkan adalah perubahan requirement di tengah jalan. Fitur yang kita implementasi dengan susah payah, bertampilan Web 2.0, menggunakan teknologi AJAX, tiba-tiba divonis client, "Ini bukan yang saya mau, GANTI !!!". 

Atau mungkin tidak se-ekstrim itu. End-user hanya minta geser tombol sedikit, tambah fitur sedikit, dan sedikit-sedikit lainnya, yang lama-lama tentunya akan menjadi bukit. Tiba-tiba, project sudah telat 2 bulan, dan fitur baru 50% terimplementasi. Bukan karena kita codingnya lama, tapi karena user minta perubahan melulu.

Nah, urusan perubahan requirement ini wajib hukumnya untuk dikelola dengan baik. Diatur dalam process area Requirement Management (REQM) yang ada di ML-2 dalam SP 1.3. Kalau perusahaan kita mengimplementasi REQM dengan baik, kita sebagai programmer akan lebih tenang hidupnya. Semua perubahan terhadap aplikasi yang sedang dibuat harus melalui rangkaian prosedur untuk memastikan perubahan tersebut benar-benar diinginkan dan sudah dipertimbangkan konsekuensinya. End-user tidak akan semena-mena meminta perubahan, tapi harus melalui persetujuan atasannya dan atasan kita. Dengan demikian, perubahan yang sampai pada programmer sudah pasti adalah perubahan yang penting, bukan hanya menurut end-user, tapi juga menurut sponsor project. Bahkan, adanya prosedur ini saja sudah cukup untuk membatasi _liarnya imajinasi_ end-user.

Ini hanya satu contoh saja bagaimana implementasi CMMI memudahkan hidup kita sebagai programmer. Silahkan baca-baca spesifikasinya untuk mengetahui aturan-aturan lainnya. Secara umum, CMMI sama sekali tidak menyinggung tentang teknologi, IDE, tools, bahasa pemrograman yang digunakan. Bahkan kegiatan coding sendiri cuma dibahas dalam 2 PA dari 22 yang ada, yaitu Technical Solution dan Product Integration. 

Technical Solution mengharuskan kita untuk mengidentifikasi alternatif pendekatan yang tersedia. Kemudian dari alternatif tersebut, kita pilih yang paling baik, berdasarkan kriteria yang kita tentukan sendiri. Jadi tidak boleh langsung coding, melainkan harus mikir dulu. 

ML-4 dan ML-5 banyak menitikberatkan pada analisa kuantitatif dan continuous improvement. Sukakah anda terlibat dalam project yang selesai tepat waktu, tidak lembur, libur pada hari Sabtu-Minggu? Nah, kalau sudah ML-5, project seperti ini bukan lagi impian, tapi sudah menjadi hal yang biasa. Delay dalam project sudah bisa diketahui sejak dini. Dari mulai telat 1 hari, project manager sudah bisa tahu dan mengambil tindakan antisipasi seperti minta pengunduran jadwal, mengurangi requirement, dan sebagainya.

Sebagai programmer, tidak banyak perubahan yang kita rasakan selain project menjadi lebih tenang dan teratur. Yang paling besar terkena dampak implementasi CMMI adalah Project Manager. Tiba-tiba saja dia akan diharuskan membuat banyak dokumen dan menyediakan data. Pekerjaan administratifnya akan menjadi jauh lebih banyak. 

Tentunya hal ini bisa diatasi dengan otomasi proses. Begitu prosesnya sudah rapi, kegiatan administrasi bisa di-online-kan. Masalah versioning dokumen bisa diatasi dengan Subversion. Daftar resiko project, task management, bug report, bisa diotomasi dengan Bug/Issue Tracker. Lagipula, bila perusahaan kita bergerak di bidang IT, tentunya persenjataan seperti itu sudah seharusnya menjadi lifestyle kita. 

Demikianlah penjelasan singkat tentang CMMI. Lain waktu kita akan bahas satu persatu Process Area yang ada. 

Semoga bermanfaat. 
