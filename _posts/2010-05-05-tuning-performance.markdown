---
comments: true
date: 2010-05-05 08:24:18
layout: post
slug: tuning-performance
title: Tuning Performance
wordpress_id: 529
categories:
- programming
---

Setelah aplikasi dicoding dengan benar, biasanya langkah berikutnya adalah tuning performance. Hal ini banyak ditanyakan di berbagai milis pemrograman yang saya ikuti. Agar tidak berkali-kali menulis jawaban yang sama, berikut artikel tentang metodologi saya dalam melakukan tuning performance aplikasi. 





## 0. Miliki tujuan yang jelas


Misalnya : 
Mampu menghandle 100 request/detik dengan response time < 2 detik
dengan 1 juta record di database. Bisa jadi pada tahap ini, ternyata keputusannya adalah tidak perlu tuning, karena performance aplikasi yang sekarang sudah memenuhi keinginan. 



## 1. Pastikan aplikasinya berjalan benar


Make it right, then make it fast. 
Gak ada gunanya mentuning aplikasi buggy. 
Kita juga harus punya perangkat pengetes yang lengkap. 
Supaya nanti setelah tuning, bisa dipastikan bahwa tuningnya tidak menimbulkan bug baru.



## 2. Pasang monitor di aplikasi


Misalnya : 
- CPU usage
- Memory usage
- Aktifitas harddisk
- Aktifitas database

Di linux, CPU dan Memory usage bisa [dipantau dengan top](http://www.linuxforums.org/articles/using-top-more-efficiently_89.html), 
sedangkan aktifitas harddisk dengan [iostat](http://royontechnology.blogspot.com/2007/06/using-iostat-for-monitoring-disk.html). 
Di MySQL, aktifitas database bisa dimonitor dengan perintah [show processlist](http://dev.mysql.com/doc/refman/5.1/en/show-processlist.html). 



## 3. Setelah monitor siap, penyiksaan dimulai


Berikan load yang tinggi ke aplikasi dengan menggunakan tools penyiksaan seperti misalnya [JMeter](http://jakarta.apache.org/jmeter/). 
Tingkatkan terus loadnya sampai response time tidak lagi memenuhi syarat. 
Misalnya, pada 30 request/detik, response time menjadi 10 detik. 



## 4. Cari bottlenecknya


Amati monitor, aspek mana yang overload. 
Apakah CPU, I/O, atau memori. 
Perhatikan juga aktifitas database untuk mencari penyebabnya. 



## 5. Lakukan tuning


Silahkan dioprek dengan metode trial and error. 
Biasanya pada tahap ini saya mencari kolom mana yang perlu diindex, 
bagian mana di source code yang perlu diperbaiki, 
atau konfigurasi seperti apa yang optimal. 



## 6. Test lagi


Setelah dioprek, jalankan lagi tools penyiksaan. 
Kalau langkah no #5 benar, biasanya bottlenecknya akan pindah. 
Misalnya, tadinya CPU maxed out 100%, setelah tuning jadi santai 10%, 
tapi memory usage jadi 80%. 



## 7. Ulangi langkah #5 dan #6


Ulangi terus tuning dan test sampai aplikasi memenuhi tujuan yang diset di langkah #0. 
Inilah pentingnya langkah #0, supaya kita tahu kapan harus berhenti.

Beberapa hal yang harus diingat dalam tuning performance: 



	
  1. Tidak ada pil ajaib, masing-masing kasus berbeda. Kadang masalahnya ada di index database, kadang di prosesor, dsb. 

	
  2. Jangan main tebak-tebakan, semua keputusan harus berdasarkan hasil monitoring. Soalnya seringkali tebakan kita salah. 

	
  3. Jangan lupakan maintenance source code. Proses tuning mungkin saja akan membuat source code menjadi kompleks dan sulit dibaca. Jangan sampai kita mengorbankan kerapian coding demi sedikit peningkatan performance. Lebih baik upgrade hardware daripada mengotori source code.

	
  4. Tahu kapan harus berhenti. Tuning merupakan pekerjaan yang menarik, mirip seperti bermain game. Oleh karena itu penting bagi kita untuk punya tujuan. Begitu tujuan dicapai, segera berhenti. Lebih baik menambah fitur yang memiliki business value daripada terus menerus berkutat dengan performance. 



Demikian sekilas tentang tuning. Semoga bermanfaat. 
 
