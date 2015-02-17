---
comments: true
date: 2006-05-04 13:06:02
layout: post
slug: booklet-printing
title: Booklet Printing
wordpress_id: 73
categories:
- aplikasi
---

Jika Anda adalah kolektor PDF obsesif-kompulsif seperti saya, pasti cepat atau lambat Anda akan mencari cara yang paling efektif untuk mencetak koleksi PDF tersebut.

Misalnya, kita punya [Tutorial PHP-MySQL](http://ikc.cbn.net.id/umum/endy-php.php) seperti pada gambar berikut

![Modul PHP ](/images/uploads/2006/05/endy-php.png)

Berhubung ada 81 halaman di file tersebut, kita ingin menghemat kertas dengan cara print bolak balik. Selain itu, kita juga mau cetak 2 halaman per lembar, sehingga yang tadinya seperti ini

![Normal Page Print ](/images/uploads/2006/05/normal.png)

menjadi seperti ini

![Two Sheet per Page ](/images/uploads/2006/05/2sheet.png)

Tapi sebetulnya, ada lagi yang lebih optimal, yaitu teknik yang dikenal dengan nama keren "booklet printing", menjadikan susunan halaman menjadi seperti ini: 

![Booklet Print ](/images/uploads/2006/05/booklet.png)

Saya pernah membuat buku dengan cetakan seperti itu menggunakan printer Canon di Windows. Driver printer Canon tersebut sudah menyertakan fasilitas untuk melakukan booklet printing. Tetapi kalau menggunakan printer selain Canon, yah kita harus cari cara lain. 

Setelah googling ke sana kemari, dengan menggunakan keyword "booklet printing kprinter", akhirnya saya berhasil menemukan [tutorial ini](http://wiki.scribus.net/index.php/How_to_make_a_booklet), yang menjelaskan cara melakukan booklet printing dengan KDE. Berikut langkah-langkahnya, saya contohkan dengan Acrobat Reader. 



## 1. Buka Print Dialog, pilih kprinter sebagai print command, dan tekan Print



![Acrobat Reader Print Dialog ](/images/uploads/2006/05/acroprint.png)



## 2. Dialog KPrinter muncul, klik tombol Properties di pojok kanan atas



![KPrinter Dialog ](/images/uploads/2006/05/kprinter.png)



## 3. Pilih tab Filter, kemudian tambah filter baru dengan cara menekan tombok corong



![KPrinter Properties ](/images/uploads/2006/05/kprinter-properties.png)



## 4. Tambah filter baru dengan cara menekan tombol corong


Untuk tahap pertama, yang dipilih adalah Pamphlet Printing - Even Page (step 1)

![Pamphlet Printing - Even Page (step 1) ](/images/uploads/2006/05/kprinter-select-filter-1.png)



## 5. Balikkan kertas


Setelah hasil print keluar, balikkan susunan kertas dan letakkan kembali di printer. Untuk tahap ini, kita perlu trial-and error untuk mendapatkan teknik yang tepat. Coba print halaman 1-8 dulu sebagai percobaan. 



## 6. Print sekali lagi


Lakukan langkah 1-6, dengan sedikit perbedaan. Pada langkah #6, pilih Pamphlet Printing - Odd Page (step 2)

![Pamphlet Printing - Odd Page (step 2) ](/images/uploads/2006/05/kprinter-select-filter-2.png)

Selesai. Sekarang tinggal diberikan ke tukang jilid. :D
