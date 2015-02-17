---
comments: true
date: 2006-04-28 11:43:54
layout: post
slug: belajar-java-mulai-dari-mana
title: Belajar Java, mulai dari mana?
wordpress_id: 60
categories:
- java
---

Ini adalah pertanyaan yang paling sering ditanyakan ke saya, baik melalui Y!, email, ataupun tatap muka di kelas. 

Saya sendiri belajar Java secara otodidak. Tidak melalui bangku kuliah (saya kuliah Teknik Industri), tidak juga ikut kursus atau pelatihan. Pada waktu itu -sekitar tahun 2002- milis [jug-indonesia](http://groups.yahoo.com/group/jug-indonesia/) dan [jlinux](http://groups.yahoo.com/group/jlinux/) belum seramai sekarang. Sehingga untuk konsultasi dan tanya-jawab agak sulit. Perlu diperhatikan juga bahwa pada masa itu blog belum ngetren. Jarang ada blog yang membahas pemrograman Java dalam bahasa Indonesia.

Singkat kata, resource di internet tidak sebanyak saat ini (awal 2006). 

Sebelum mulai belajar Java, kemampuan teknis saya adalah sebagai berikut: 



	
  * Bisa menggunakan Linux, tapi sebatas user, bukan administrator ahli.

	
  * Mengerti tentang basic networking (IP Address, Subnet, cara kerja DNS, dan sedikit tentang routing)

	
  * Mengerti sedikit tentang relational database. SELECT, INSERT, UPDATE sih bisa. 

	
  * Bisa PHP sedikit-sedikit. Cuma bisa HelloWorld, dan simpan isian form HTML ke dalam database. Tapi untuk aplikasi skala besar belum pernah buat. 



Dengan modal pas-pasan seperti itu, saya berhasil diterima bekerja di sebuah kursus pendidikan franchise dari India. Waktu itu mereka baru membuka cabang di Surabaya, dan saya masuk sebelum grand-launching dilakukan. 

Karena masih baru, siswa peserta kursus juga masih sedikit.Seingat saya, sehari cuma ada satu kelas selama 4 jam sehari. 4 jam sisanya, 20 perangkat komputer terbaru terhubung dengan jaringan termasuk satu asisten lab (tidak lain dan tidak bukan adalah saya) praktis menjadi pengangguran. Internet di sana dial-up, tapi ada beberapa buku pelajaran dan referensi di perpustakaan mini. 

Waktu luang banyak, komputer banyak, buku banyak, internet agak lemot. Ya sudah, akhirnya saya ngoprek saja sendirian. Instruktur di sana, walaupun native speaker India, nampaknya kurang kompeten, sehingga kalo tanya ke dia, yang ada malah tambah bingung. 

Minggu-minggu pertama saya habiskan membuat website dengan PHP. Berusaha bikin Content Management System kecil-kecilan. Tapi karena belum pengalaman, yang ada malah berantakan. Pengguna bukannya menjadi mudah malah menjadi sulit, karena untuk posting artikel harus mengerti HTML dan PHP :D. Padahal niatnya mau memudahkan. Yah, mau bagaimana lagi ... ada masanya ketika kita masih muda dan bodoh :P

Bosan dengan PHP, saya mulai lihat-lihat buku di perpustakaan. Ada VB, Java, Windows 2000 Server, Oracle, dan sebagainya. Entah karena background saya yang pengguna Linux, saya kurang tertarik belajar VB. Selain itu, instruktur di sana (menganggap dirinya) master VB. Jadi saya tidak mau kompetitif dengan belajar VB juga. Oracle terlalu sulit buat saya (waktu itu). Instalasi saja sulitnya setengah mati. Installernya terlalu banyak tanya ini-itu yang saya gak ngerti apa jawabannya. Windows 2000 Server juga kelihatan kurang menarik. Jadilah akhirnya saya pilih belajar Java saja. 

Saya coba belajar dari buku yang ada. Referensinya waktu itu Core Java vol 1 dan 2 karangan Cay Horstmann. Belakangan saya tau kalo buku itu sangat bagus dan lengkap. Ada beberapa konsep rumit seperti _anonymous inner class_ yang dijelaskan dengan sangat baik di sana. Tapi untuk pemula, Core Java itu relatif sulit dimengerti. 

Sekitar sebulan saya berputar-putar mencari cara belajar dan referensi yang bagus. Karena kualitas dan kecocokan referensi dengan cara belajar kita akan sangat berpengaruh terhadap kecepatan belajar. 

Setelah browsing ke [website Sun](http://java.sun.com), saya berhasil menemukan [tutorial Java](http://java.sun.com/docs/books/tutorial/index.html) dan [dokumentasi Java](http://java.sun.com/j2se/1.5.0/docs/api/index.html). Ini merupakan referensi yang benar-benar cocok buat saya. Dengan bermodalkan dua bahan tersebut, akhirnya dua bulan berikutnya menjadi terang-benderang. 

Satu demi satu konsep Java saya pelajari: 



	
  1. Sintaks dan Semantic (for loop, statement, if-else, dsb)

	
  2. Konsep OOP

	
  3. Implementasi Class dan Object di Java

	
  4. Package

	
  5. I/O

	
  6. Collection

	
  7. Swing

	
  8. Thread

	
  9. JDBC

	
  10. dsb



Sampai akhirnya saya lumayan bisa membuat aplikasi desktop sederhana yang mengakses database. 

Pada bulan keempat, saya masuk ke kantornya instruktur dan menemukan buku baru. Modul pelatihan Java Servlet. Wah, ada mainan baru. Segera saja saya coba semua contoh kodenya. Lumayan dari buku tersebut saya bisa memahami web.xml, servlet, dan application server. Waktu itu [Tomcat](http://tomcat.apache.org) belum terkenal seperti sekarang. Saya pakai Java Web Server untuk mendeploy servlet. 

Sekitar enam bulan kemudian, saya sudah cukup mengerti apa itu EJB (waktu itu masih versi 1.x) dan bisa mendeploy EJB kecil-kecilan.

Kemudian saya ditugaskan menjadi dosen di Stikom, sebagai bagian dari paket kerjasama kursus tempat saya bekerja dengan Stikom. Di sana lebih banyak teman diskusi dan buku. 

Dari titik ini, perjalanan belajar Java menjadi lebih mudah. Karena selain perpustakaan cukup lengkap, milis java juga sudah lumayan aktif. Sehingga saya dapat mainan baru seperti Hibernate dan Ant. 

Sudah cukup panjang ceritanya. Pesan moral dari cerita ini adalah: 



	
  1. Dengan waktu luang dan referensi yang tepat, belajar Java secara otodidak sangat mungkin dilakukan 

	
  2. Download [tutorial](http://java.sun.com/docs/books/tutorialNB/download/tutorial.zip) dan [dokumentasi](http://java.sun.com/j2se/1.5.0/download.jsp) Java yang dikeluarkan Sun. 

	
  3. Banyak berlatih (saya berlatih 6-8 jam sehari, setelah jam kantor saya masih stay untuk belajar)

	
  4. Untuk dapat melakukan poin #1 dan #2, kemampuan bahasa Inggris (read-only sudah cukup) wajib dimiliki. 



Sedikit saran dari saya, cobalah berkontribusi di milis. Baik bertanya maupun menjawab. "Bagaimana kalo saya menjawab tapi jawabannya salah? Nanti diketawain ...  "
Jangan takut. Menjawab itu bagian dari belajar. Ini berarti kita mengujicoba pemahaman kita terhadap sesuatu. 

Kalau pemahaman kita benar, komunitas akan memperkuat, dan kadang menambahkan sudut pandang yang berbeda sehingga pengetahuan kita semakin kaya. 
Kalau kita salah, akan ada yang mengoreksi. Sehingga pemahaman kita yang salah tersebut tidak akan terbawa sampai tua dan terungkap dalam event yang jauh lebih memalukan. 

Nada-nada pedas dan komentar tidak ramah jangan sampai mengendurkan semangat. Anggap saja sebagai biaya kursus, karena : "Hei, ternyata bertanya di milis gak bayar. GRATIISS !!!"

Ok, selamat belajar mandiri :D 
