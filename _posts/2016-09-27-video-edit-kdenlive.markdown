---
layout: post
title: "Edit Video dengan KDEnlive"
date: 2016-09-27 07:00
comments: true
categories: 
- aplikasi
---

Sekarang lagi jamannya vlogging, yaitu blogging dalam bentuk video. Sebetulnya saya sudah lumayan lama juga rekam sesi kuliah atau training dan publish ke Youtube. Tapi baru sekarang sempat cerita proses pembuatannya.

Biasanya, saya dan tim ArtiVisi mengedit video menggunakan [aplikasi Openshot](http://www.openshot.org/). Tapi sayangnya aplikasi ini sering sekali crash. Jadi kita tidak boleh lupa save. Dan cukup melelahkan juga kalau sekali klik langsung crash.

Dari postingan di grup DSLR Cinematography, ternyata ada Om Wowo sesama pengguna open source dalam mengedit video.  Beliau menggunakan [aplikasi KDEnlive](https://kdenlive.org/). 

Ada beberapa fitur unggulan dari KDEnlive, diantaranya adalah:

* Proxy Editing : KDEnlive bisa membuat versi low-res dari video yang kita akan edit, sehingga lebih ringan pada saat kita maju mundur dan memotong video tersebut. Dibandingkan kita mengedit langsung di file yang jaman sekarang besar-besar dan beresolusi hingga 4K. Proxy file yang dibuat KDEnlive resolusinya hanya 640x480 saja sehingga jauh lebih ringan.
* Audio Sync : kita biasa merekam audio dan video secara terpisah agar kualitas audionya bisa maksimal. Masalah terjadi ketika ingin menggabungkan file audio dan video ini. Satu clip saja bisa memakan waktu 5-15 menit. Bayangkan bila clipnya ada 10. Bisa habis satu jam sendiri untuk sinkronisasi. Dengan fitur audio sync ini, cukup beberapa klik tombol, audio dan video bisa langsung sinkron.

Dua fitur di atas sangat meningkatkan produktifitas dalam mengedit video. Dan yang paling penting, dibandingkan dengan Openshot, KDEnlive ini jauh lebih stabil. Openshot bisa crash puluhan kali selama beberapa jam saya mengedit, sedangkan KDEnlive ini baru crash dua kali saja selama seharian mengedit.

[![KDEnlive Screenshot](https://lh3.googleusercontent.com/OubxnpJ1YEk-K_uIp50WZvZECgnLpm9XQsbN0-rNhcN2h1fNOp9tswJyq6nvwp9v0-VBcW_LqQXE=w1111-h694-no)](https://lh3.googleusercontent.com/OubxnpJ1YEk-K_uIp50WZvZECgnLpm9XQsbN0-rNhcN2h1fNOp9tswJyq6nvwp9v0-VBcW_LqQXE=w1111-h694-no)

Pada waktu rendering, KDEnlive juga punya satu fitur penting, yaitu Shutdown after render. Jadi kita bisa start render, kemudian kita tinggal tidur. Setelah selesai rendering, KDEnlive akan mematikan komputer kita.

Penjelasan lebih detail tentang cara mengedit video bisa ditonton di vlog saya di Youtube.

{% include youtube_embed.html id=AzVvIaWMONU %}
