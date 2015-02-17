---
comments: true
date: 2006-12-28 16:45:57
layout: post
slug: starter-kit
title: Project Starter Kit
wordpress_id: 186
categories:
- manajemen
---

Mengelola project software tidak mudah. Ada berbagai aspek teknis dan non teknis. Apalagi kalau projectnya berkaitan dengan pemerintahan atau organisasi lain yang birokratis. Akan banyak pekerjaan dokumentasi. 

Di sisi lain, pekerjaan teknis selain coding juga tidak kalah banyaknya. Contohnya, dalam kehidupan sehari-hari programmer, dia harus: 

1. Menulis kode
2. Menyimpan kode di repository
3. Memberitahu programmer lain tentang perubahan yang dilakukan
4. Menulis dokumentasi kode
5. Menjalankan unit test
6. Membuat rilis 
7. Menjawab pertanyaan client/bos/tim user manual

Semua kegiatan ini harus dikelola dengan baik agar tidak saling tumpang tindih. Untungnya banyak perangkat pembantu yang dapat memudahkan hidup kita. Pastikan Anda menggunakan persenjataan ini agar proyek bisa berjalan dengan lebih lancar. Berikut daftarnya:

1. Version Control
2. Bug tracker
3. Mailing list
4. File server
5. Wiki
6. Forum
7. Build server

Mari kita bahas dengan lebih detail.




### Version Control


Semacam file server, tapi lebih sakti. Mampu menyimpan riwayat perubahan, perbedaan antar versi, dan lainnya. Silahkan download [presentasi saya tentang Subversion](http://endy.artivisi.com/downloads/writings/Subversion-presentation-20061129.pdf
) untuk pemahaman lebih lanjut. 



### Bug Tracker


Sepanjang perjalanan project, pasti banyak terjadi kesalahan. Baik kesalahan dokumen, kode program, permintaan yang kurang jelas, dan sebagainya. Daripada membuat mencatat di satu file khusus, lebih baik gunakan aplikasi bug tracker. Setiap entri di bug tracker bisa ditugaskan pada satu user. Status dari setiap entri (sedang dikerjakan, sudah selesai, selesai tapi tidak memuaskan) semua bisa ditentukan. 

Gunakan bug tracker untuk memberikan tugas pada orang lain. Bug tracker yang baik biasanya terintegrasi dengan mail server, sehingga begitu kita membuat entri, email akan dikirim ke orang yang menerima tugas. Pada waktu suatu entri selesai dikerjakan dan statusnya diganti, email akan dikirim ke si pemberi tugas. Dengan demikian, tidak ada hal yang tercecer atau terlupakan. 

Berikut daftar beberapa aplikasi bugtracker yang gratis dan open source:

-  [Bugzilla](http://www.bugzilla.org/)
-  [Mantis](http://mantisbt.sourceforge.net/)
-  [Scarab](http://scarab.tigris.org)
-  [TrackIt](http://trackit.sourceforge.net/)



### Mailing List


Biasanya dalam project, kita akan sering mengirim email ke beberapa orang sekaligus. Misalnya pengumuman rilis, klarifikasi requirement, janji meeting, atau laporan kemajuan. Daripada mengetik banyak alamat sekaligus, lebih baik buat mailing list sesuai tujuan komunikasi. Buatlah mailing list untuk manajemen dan development. Segala pengumuman dan diskusi tentang manajemen proyek dikirim ke mailing list manajemen. Pembicaraan tentang pemrograman dilakukan di milis development. 

Dengan demikian, selain tidak perlu mengetik alamat email satu persatu dan beresiko lupa, semua pembicaraan juga terekam secara kronologis. 

Tidak mau repot menginstal aplikasi milis? Gunakan saja milis gratisan seperti [YahooGroups](http://groups.yahoo.com) atau [GoogleGroups](http://groups.google.com). 



### File Server


Selain melalui repository, kadang kita perlu bertukar file berukuran besar. Untuk itu, kita perlu file server. Banyak penyedia file server gratisan di internet, misalnya [Rapidshare](http://rapidshare.de) atau [Megaupload](http://www.megaupload.com).

Kalau tidak mau pakai gratisan --mungkin takut data penting diambil orang-- gunakan [XAMPP](http://www.apachefriends.org/en/xampp.html). 



### Wiki


 Wiki adalah website yang bisa diedit orang banyak. Contohnya [wiki ArtiVisi](http://tutorial.artivisi.com). Cara mengeditnya juga mudah dan sederhana. Tidak perlu keahlian HTML atau pemrograman web. Ideal digunakan untuk membuat dokumen yang sering berubah dan diakses sepanjang waktu, misalnya:

*  spesifikasi aplikasi
*  desain sistem
*  manual penggunaan aplikasi

Aplikasi wiki banyak tersedia secara gratis, misalnya:

*   [DokuWiki](http://wiki.splitbrain.org/wiki:dokuwiki) (yang digunakan ArtiVisi, berbasis PHP)
*   [JSPWiki](http://www.jspwiki.org/) (berbasis Java)
*   [pmWiki](http://www.pmichaud.com/wiki/PmWiki/PmWiki) (berbasis PHP)
*   [MediaWiki](http://www.mediawiki.org/wiki/MediaWiki) (yang digunakan [Wikipedia](http://www.wikipedia.org))
*   [MoinMoin](http://moinmoin.wikiwikiweb.de/) (berbasis Python)

dan masih banyak aplikasi lainnya.

Perbandingan antar aplikasi dapat dilihat di situs [MediaWiki](http://en.wikipedia.org/wiki/Comparison_of_wiki_software) dan [DokuWiki](http://wiki.splitbrain.org/wiki:compare)

Instalasi DokuWiki sangat mudah, cukup extract, kemudian publish melalui webserver yang support PHP. Pengguna Windows bisa menggunakan XAMPP dan menjalankan DokuWiki dalam 5 (lima) menit saja.



### Forum


Apabila proyek/produk kita digunakan masyarakat luas, pasti akan banyak interaksi dengan pengguna. Biasanya pengguna baru akan menemui kesulitan dan butuh tempat bertanya. Mereka ini biasanya malas ikut milis, karena mungkin cuma butuh satu jawaban dan tidak ingin mengikuti diskusi di milis. 

Kita bisa gunakan aplikasi forum yang banyak tersedia secara gratis. Salah satu yang terkenal adalah [phpBB](http://www.phpbb.com). Maniak Java bisa gunakan [mvnforum](http://www.mvnforum.com).



### Build Server


Apabila proyek kita sudah dilengkapi dengan version control, automated unit test, dan automated code review, kita bisa gunakan build server. Gunanya adalah agar secara berkala (misalnya sehari sekali), ada yang mengambil semua kode terbaru dari repository, melakukan kompilasi, menjalankan semua automated test, dan melaporkan hasilnya via website, email, rss, instant messenger, sms, atau media komunikasi lainnya. 

Berkat keajaiban open source, aplikasi ini tersedia secara gratis. Kita bisa gunakan [CruiseControl](http://cruisecontrol.sourceforge.net) atau [Luntbuild](http://luntbuild.javaforge.com). Buat yang nekat tetap ingin bayar, bisa gunakan [Pulse](http://zutubi.com/products/pulse/) atau [Bamboo](http://confluence.atlassian.com/display/BAMBOO). 





> Wow ... begitu banyak yang harus disiapkan?



Begitu dalam pikiran Anda. 

Jangan khawatir, ada aplikasi gratis untuk menyatukan semuanya. Gunakan [Trac](http://trac.edgewall.org/). 




> 
Bagaimana kalo projectnya banyak? Di kantor saya biasanya ada 10 project jalan berbarengan. Belum lagi 15 produk yang harus dikelola. 



Jangan khawatir. Bawa pulang [Sourceforge](http://www.vasoftware.com/sourceforge/) ke kantor Anda. Atau gunakan saingannya, [GForge](http://gforge.org/). Keduanya gratis dan open source. 

Demikianlah rangkaian persenjataan dalam mengelola proyek. Semoga bermanfaat. 


