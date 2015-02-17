---
comments: true
date: 2006-03-01 16:25:57
layout: post
slug: upgrade-dan-migrasi
title: Upgrade dan Migrasi
wordpress_id: 30
categories:
- life
---

Sebetulnya sudah lama saya mau memindahkan hosting blog ini. Alasan pertama, blog ini menggunakan komputer kantor yang sewaktu-waktu bisa diminta yang punya. Kedua, kehadirannya di internet sangat ditentukan oleh sampai kapan saya mendapatkan IP Public. Kalau sewaktu-waktu pindah kantor, blog ini bisa terancam offline.

Jadi, mumpung masih ada akses internet bebas, bisa ftp sesuka hati, dan masih tidak diburu waktu, saya pindahkan **.artivisi.com sedikit demi sedikit ke [tempat yang baru](http://www.icthosting.com). [tutorial.artivisi.com](http://tutorial.artivisi.com) sudah pindah duluan. Karena dia tidak butuh database, migrasinya lebih mudah, tinggal upload dan edit config sedikit, beres.

Untuk blog ini, sekalian pindah saya mau upgrade ke versi 2.0.1 yang terbaru. Untungnya di website Wordpress sudah tersedia dokumentasinya. Berikut langkah-langkah yang saya lakukan:

**1. Backup dan Replikasi.  **

Duplikasi folder blog berikut isinya dan juga databasenya. Intinya adalah, saya ingin ada dua blog kembar yang berjalan bersamaan. Dengan demikian, tidak hanya backup yang dilakukan, tapi juga memastikan hasil backup bekerja dengan baik.

**2. Lakukan upgrade**

Upgrade saya lakukan di hasil **duplikasi**, bukan di blog asli. Jadi kalo terjadi sesuatu yang salah, blog asli tidak terpengaruh.

Langkah upgrade cukup mudah: matikan semua plugin, hapus semua file kecuali** wp-config.php**, ganti dengan file baru, browse ke halaman upgrade. Dengan satu kali tekan tombol, upgrade berjalan dengan sangat mulus. Luar biasa.

**3. Upload ke server baru**

Blog baru yang sudah versi 2.0.1 diupload ke tempat hosting baru dengan menggunakan FTP. Setelah itu, database dibuat dan diisi dengan menggunakan dump dari database di server lama (versi setelah upgrade). Sesuaikan file wp-config.php bila perlu (nama database, username, password biasanya berbeda).
**4. Verifikasi**

Terakhir, kontak teman-teman anda untuk mencoba mengunjungi blog yang baru. Mudah-mudahan tidak ada masalah. :D

Selamat mencoba
