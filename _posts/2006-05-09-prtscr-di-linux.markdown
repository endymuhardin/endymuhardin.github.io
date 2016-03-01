---
comments: true
date: 2006-05-09 10:03:45
layout: post
slug: prtscr-di-linux
title: PrtScr di Linux
wordpress_id: 90
categories:
- aplikasi
---

Membuat screenshot di Windows itu gampang. Tinggal ikuti [langkah-langkah yang dijelaskan Oom Mbot](http://mbot.multiply.com/journal/item/225), beres. Tapi bagaimana caranya membuat screenshot di Linux?

Gampang, jika Anda pengguna KDE, instal saja KSnapshot. Ini adalah aplikasi kecil yang bisa menangkap tampilan layar. 

[![KSnapshot ](/images/uploads/2006/05/ksnapshot.png)](/images/uploads/2006/05/ksnapshot.png)

Ada beberapa mode yang bisa digunakan, yaitu Full Screen, Region, dan Window under cursor. Full screen menangkap seluruh layar, termasuk menunya. Window under cursor hanya menangkap aplikasi yang sedang kita gunakan. Sedangkan Region hanya menangkap wilayah yang kita pilih saja. 

[![KSnapshot Mode ](/images/uploads/2006/05/ksnapshot-mode.png)](/images/uploads/2006/05/ksnapshot-mode.png)

Bagaimana kalau kita mau menampilkan popup-menu klik-kanan? Gampang, atur saja delay menjadi beberapa detik. Kemudian klik New Snapshot, dan lakukan klik kanan di aplikasi yang diinginkan. Selang beberapa detik kemudian, KSnapshot akan menangkap gambar.

Berbeda dengan di Windows, di Linux tombol PrtScr tidak secara otomatis menangkap tampilan layar. Tetapi masalah ini mudah diatasi. Kita dapat menyambungkan tombol PrtScr dengan KSnapshot, sehingga apabila tombol tersebut kita tekan, KSnapshot akan muncul. 

Caranya, klik kanan tombol K di pojok kiri bawah. Kemudian pilih Menu Editor

[![Right Click K ](/images/uploads/2006/05/kmenu-properties.png)](/images/uploads/2006/05/kmenu-properties.png)

Di panel sebelah kiri, cari aplikasi KSnapshot. Di Debian Sarge, biasanya KSnapshot ada di Graphics, Other Application. Begitu ketemu, langsung saja klik. 

[![Menu Editor - Left Pane ](/images/uploads/2006/05/kmenu-editor-left.png)](/images/uploads/2006/05/kmenu-editor-left.png)

Di panel sebelah kanan akan muncul keterangan tentang aplikasi. Kita akan mengatur Shortcut Key, letaknya di baris paling bawah. 

[![Menu Editor - Right Pane ](/images/uploads/2006/05/kmenu-editor-right.png)](/images/uploads/2006/05/kmenu-editor-right.png)

Klik tombol shortcutnya, akan muncul dialog kecil. Di sini kita bisa langsung tekan tombol PrtScr. Kemudian klik OK. 

[![Edit Shortcut ](/images/uploads/2006/05/edit-shortcut.png)](/images/uploads/2006/05/edit-shortcut.png)

Selesai sudah. Sekarang setiap kali tekan PrtScr, KSnapshot akan segera beraksi.

Pembaca yang teliti akan berpikir, "Bagaimana caranya menangkap gambar KSnapshot itu sendiri? Padahal ketika kita tekan New Snapshot pasti KSnapshot akan menghilang."

Gampang, jalankan saja dua KSnapshot sekaligus. Yang satu untuk di-capture, satu lagi untuk meng-capture. :D
