---
comments: true
date: 2006-03-20 18:35:47
layout: post
slug: pengetahuan-wajib-buat-programmer
title: Pengetahuan wajib buat programmer
wordpress_id: 40
categories:
- life
---

Setelah beberapa kali mewawancara calon programmer baru, saya menemukan bahwa cukup banyak dari kandidat pelamar kerja, baik _fresh graduate_ maupun yang (ngakunya) _experienced_ masih belum memahami beberapa pengetahuan dasar.

Entah apa sebabnya. Beberapa kemungkinan bisa saya perkirakan, sebagai berikut:



	
  * Tidak diajarkan di kuliah

	
  * Diajarkan, tapi mahasiswa bersangkutan lebih banyak dugem daripada kuliah

	
  * Diajarkan dan _pernah_ mengerti, tapi karena jarang digunakan jadi lupa


Apapun masalahnya, yang jelas kenyataan ini sangat memprihatinkan. Indonesia tidak akan maju jika bibit tenaga kerjanya mudah merasa cukup.

Secara pribadi, saya punya standar sendiri dalam melakukan seleksi. Jadi buat yang mau melamar kerja, silahkan berlatih. Siapa tahu Anda berhadapan dengan saya di meja wawancara :D

Berikut menu wajib programmer:

	
  * Konsep dasar sistem operasi.

	
  * Konsep dasar jaringan.

	
  * Konsep dasar relational database.

	
  * Karena sekarang jaman internet, maka wajib memahami protokol HTTP, FTP, POP3, SMTP, SSH.

	
  * Karena sekarang jaman globalisasi, maka [wajib memahami Unicode](http://joelonsoftware.com/articles/Unicode.html).

	
  * Lebih dari satu bahasa pemrograman.

	
  * Cara menggunakan Version Control.


Berikut pertimbangannya.

Kebanyakan dari programmer Indonesia biasanya membuat aplikasi di atas sistem operasi, sehingga banyak yang berpendapat bahwa tidak perlu memahami cara kerja sistem operasi. Pendapat ini boleh saja, kalau Anda adalah staf akunting yang kebetulan dipaksa bos untuk membuat aplikasi _general ledger_. Untuk programmer profesional, pemahaman ini akan membuat Anda lebih siap untuk membuat aplikasi server yang biasanya _multithreaded_ dan harus efisien digunakan dalam waktu yang lama.

Pemahaman mendalam di salah satu sistem operasi juga merupakan nilai tambah yang signifikan. Dengan mengetahui struktur internal sistem operasi (misalnya Linux), kita dapat mengetahui berbagai pertimbangan dalam merancang aplikasi besar yang terus berkembang.

Saat ini, kalau kita harus membuat aplikasi, besar kemungkinannya aplikasi kita tidak berjalan sendiri. Aplikasi tersebut pasti harus berhubungan dengan internet, melayani banyak pengguna, atau berhubungan dengan perangkat lain seperti handphone atau PDA. Untuk itu, pemahaman atas konsep jaringan sangat penting.

Tes sederhana untuk menguji pemahaman Anda. Coba jelaskan proses yang terjadi mulai dari Anda mengetik http://endy.artivisi.com di browser Anda, sampai halaman ini terbentang di depan mata Anda. Dengan mendengarkan jawaban Anda, saya akan tahu kualitas Anda. Jawaban yang saya harapkan mengandung istilah name-resolve, http-request, virtual directory, query database, HTML response, dan CSS. Kalau Anda menyebutkan (apalagi menjelaskan) tentang routing, gateway, proxy, port 80, saya akan lebih senang lagi.

Tentang relational database. Saya tahu ini pasti pernah diajarkan di kuliah. Jadi lulusan informatika dan sejenisnya jangan bilang belum diajarkan. Yang saya maksud bukan sekedar sintaks SQL. Sintaks itu gampang, [bisa dicari dengan mudah di internet](http://www.google.co.id/search?q=sql+tutorial). Yang saya inginkan adalah penjelasan tentang Boyce-Codd Normal Form, lengkap dengan contoh kasusnya, di luar kepala. Kalau sudah bisa menjelaskan ini, inner join, subquery, union, itu perkara sepele.

Protokol HTTP sekarang adalah protokol yang paling banyak digunakan di internet. Jangan salah, ini bukan tentang sintaks HTML atau CSS. Jadi apa? Begini, coba tampilkan halaman website ini dengan menggunakan telnet. Benar, bukan browser, tapi telnet.

Kalau sudah bisa browsing dengan telnet, sekarang coba untuk baca email via telnet. Menggunakan protokol POP3 atau IMAP tentunya. Punya account Gmail kan? Hare gene gak punya? Ya bagus, kalo punya coba aktifkan fitur POP3nya, setelah itu buka dengan telnet.

Unicode itu penting supaya aplikasi kita tetap bisa diinstal di komputer orang Jepang atau Korea, atau komputer berbahasa Sansekerta.

Pemahaman lebih dari satu bahasa itu penting agar wawasan kita terbuka. Bahwa tidak ada bahasa yang one-fit-all, bahwa ada cara berpikir yang berbeda dalam tiap bahasa, bahwa komunitas tiap bahasa berbeda budayanya. Semua ini akan berkontribusi dalam pendewasaan kita dalam berdiskusi dan menanggapi perbedaan (terutama pendapat).

Satu lagi, trend bahasa pemrograman adalah, tiap sepuluh tahun, market leader berganti. Dulu COBOL, kemudian C++, sekarang Java. Jadi, kemampuan belajar bahasa baru sangat penting. Bukan cuma bahasanya yang penting, tapi kemampuan belajarnya yang lebih penting.

Di tempat saya bekerja, penggunaan version control adalah wajib. Ini standar (de facto) internasional. Kalau kita punya project opensource, baik di Sourceforge, Apache, Codehaus, dan semua hosting project opensource, pasti kita akan diberikan version control. Silahkan download dan coba gunakan [CVS](http://www.cvshome.org) atau [Subversion](http://subversion.tigris.org).

Ok, itu standar minimal saya. Menurut Anda terlalu sulit? Hmm .. kalau begitu <strike>dunia IT</strike> menjadi programmer nampaknya kurang cocok buat Anda. Silahkan coba karir lainnya, misalnya notaris atau sopir busway :D
