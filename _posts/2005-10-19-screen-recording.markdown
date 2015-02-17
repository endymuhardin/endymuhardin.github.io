---
comments: true
date: 2005-10-19 16:39:23
layout: post
slug: screen-recording
title: Screen Recording
wordpress_id: 10
categories:
- aplikasi
---

Jaman sekarang orang bikin tutorial udah gak PDF lagi. Ketinggalan jaman oom. 
Sekarang musimnya tutorial pake movie, baik AVI, MPG, atau SWF.
Jangan sampe kalah gaya sama situs porno. 

Di windows ada aplikasi gratis untuk merekam screen, namanya [AviScreen](http://www.bobyte.com/AviScreen/index.asp). Tapi masalahnya, saya sudah selamat tinggal sama sistem operasi yang ada [jendela](http://www.microsoft.com/windows/default.mspx)nya. Bukan apa-apa, namanya ada jendela, pasti debu dan serangga masuk membawa virus. Jadi, AviScreen tidak bisa digunakan. 

Untungnya di Linux, pilihan lebih banyak. Ada [vnc2swf](http://www.unixuser.org/~euske/vnc2swf/) atau [vncrec](http://www.sodan.org/~penny/vncrec/). vnc2swf outputnya Flash Movie, sedangkan vncrec punya format sendiri yang cuma dia sendiri yang bisa baca.

Update (6 Juni 2006): Ternyata ada lagi aplikasi yang namanya [Wink](http://www.debugmode.com/wink/). Tersedia untuk Windows maupun Linux.

Ada beberapa artikel yang membahas tentang cara penggunaan dan perbandingan aplikasi ini. [Newsforge](http://www.newsforge.com/article.pl?sid=04/08/16/2128226) dan [Linux.com](http://www.linux.com/article.pl?sid=04/07/26/1815242) membahas secara lengkap tentang cara penggunaanya. 

Berbeda dengan sistem operasi Jendela yang cuma bisa punya satu desktop, di linux desktop bisa sebanyak-banyaknya. Ini bisa menyenangkan (bagi yang sudah tahu), dan bisa juga membingungkan (bagi yang belum tahu). Jadi, kalo AviScreen kita cukup tekan tombol Record, kalau di linux ada beberapa langkah sebelum tekan tombol record, yaitu: 



	
  1. **Jalankan VNC server.** 
VNC server adalah aplikasi yang bertugas untuk mempublish desktop kita. Pada saat dijalankan, dia akan menjalankan desktop baru yang berbeda dengan screen yang kita hadapi sekarang. 
       

	
  2. **Jalankan vnc2swf.**
Setelah itu, kita bisa jalankan vnc2swf untuk connect ke VNC server yang telah kita publish pada langkah pertama. 
       

	
  3. **Mulai merekam.**
Setelah terhubung dengan VNC server, kita bisa langsung mulai merekam.
        



Jebakan VNC server : 
VNC server akan menjalankan desktop baru. Jadi, yang akan direkam adalah desktop baru tersebut, bukan desktop yang sekarang kita gunakan. Jadi kita harus menampilkan dulu desktop baru tersebut, baru mulai merekam. 
Untuk menampilkan desktop baru tersebut, kita bisa gunakan Remote Desktop Connection yang ada di KDE.

Kalau kita mau merekam desktop yang sedang kita gunakan saat ini, kita harus mempublish desktop dengan aplikasi lain yang namanya x11vnc. Jika dijalankan, aplikasi ini akan mempublish aktivitas desktop kita ke vnc server. 

Demikian cara merekam aktivitas desktop. 
Selamat mencoba.
