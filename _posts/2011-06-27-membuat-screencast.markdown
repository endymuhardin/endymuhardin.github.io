---
comments: true
date: 2011-06-27 18:03:23
layout: post
slug: membuat-screencast
title: Membuat Screencast
categories:
- aplikasi
- linux
---

Jaman sekarang sudah semakin maju. Fakir bandwidth semakin sedikit. Oleh karena itu, media komunikasi juga berubah, yang tadinya berbasis teks (hemat bandwidth) menjadi multimedia (rakus bandwidth). 

Demi mengikuti perkembangan jaman, saya mengeksplorasi pembuatan tutorial dalam bentuk screencast. Ternyata hasilnya memuaskan. Dengan beberapa menit merekam screencast, informasi yang disampaikan sama dengan beberapa jam mengetik blog entry. 

Artikel ini saya tulis untuk mendokumentasikan langkah-langkah membuat screencast, mulai dari merekam screencast, sampai mempublikasikannya di blog. 





## Merekam video


Di Ubuntu ada dua aplikasi yang saya coba, yaitu Xvidcap dan Record My Desktop. Dua-duanya sama fungsinya dan tidak ada perbedaan yang signifikan. Setelah mencoba keduanya, pendapat saya adalah Record My Desktop lebih mudah digunakan. Jadi, inilah aplikasi yang saya pilih. 

Perlu diperhatikan kemampuan prosesor komputer Anda. Ini kaitannya dengan setting frame per second (fps). Bila fps melebihi kemampuan prosesor, video yang kita rekam akan terlihat lebih cepat dari sebenarnya. Di laptop saya, setting 15 fps akan menghasilkan video yang kira-kira 2x lebih cepat. Setelah trial and error, saya temukan bahwa 9 fps adalah setting yang tepat. 

Perbedaan yang utama di antara kedua aplikasi ini adalah format outputnya. Record My Desktop mengeluarkan format ogv sedangkan Xvidcap mengeluarkan format mpeg. Perbedaan format ini nantinya akan mempengaruhi langkah pemrosesan selanjutnya. 



## Merekam suara


Biasanya, saya merekam suara dalam proses yang terpisah, supaya tidak banyak ehm dan eee. Rekaman dibuat sambil menonton screencast yang sudah kita rekam. Setelah rekaman suara dibuat, bisa diedit dengan menggunakan aplikasi Audacity untuk menghilangkan noise, memotong bagian yang tidak penting, dan sebagainya. 



## Menggabungkan video dan audio


Selanjutnya, kita menggunakan aplikasi Avidemux untuk menggabungkan file audio dan file video menjadi satu file. Dengan aplikasi ini kita juga bisa mengedit video untuk menghilangkan bagian-bagian yang tidak perlu ataupun menyambung beberapa video menjadi satu.



## Mempersiapkan format video untuk web


Ada berbagai format video yang tersedia. Masing-masing format memiliki dukungan browser yang berbeda-beda. Daftar lengkapnya bisa dilihat [di sini](http://diveintohtml5.info/video.html#what-works)

Pada intinya, supaya bisa dilihat di berbagai browser, kita harus menyediakan file dengan format ogv, mp4, dan webm. Kita juga harus menyertakan poster dalam format jpg atau png supaya bisa ditampilkan dengan benar di browser. 

Ada beberapa script yang bisa digunakan, misalnya [ini](https://github.com/kwiliarty/vfe-sh) atau [ini](http://brettterpstra.com/automating-html5-video-encodes/)

Atau, kita juga bisa menjalankan commandnya satu persatu di command line. Berikut adalah command yang saya jalankan : 

Konversi dari ogv menjadi mp4 

```sh
ffmpeg -vcodec libx264 -vpre lossless_medium -i file-input.ogv file-output.mp4
```

Konversi dari ogv menjadi webm 

```sh
ffmpeg -pass 1 -passlogfile file-input.ogv -threads 16  -keyint_min 0 -g 250 -skip_threshold 0 -qmin 1 -qmax 51 -i file-input.ogv -vcodec libvpx -b 614400 -s 640x480 -aspect 4:3 -an -y tmp.webm

rm tmp.webm

ffmpeg -pass 2 -passlogfile file-input.ogv -threads 16  -keyint_min 0 -g 250 -skip_threshold 0 -qmin 1 -qmax 51 -i file-input.ogv -vcodec libvpx -b 614400 -s 640x480 -aspect 4:3 -an -y file-output.webm
```

Command di atas mungkin berbeda bila file asli kita formatnya adalah mpeg seperti yang dihasilkan oleh XVidcap. 

Membuat poster 

```sh
ffmpeg -r 1 -t 1 -vframes 1 -i input-file.mp4  output-file.png
```


## Upload


Setelah semua file(ogv,mp4,png) terkumpul di satu folder, kita upload menggunakan rsync

```
rsync -avz /path/to/video/folder user@example.com:/home/user/public_html/videos
```


## Tampilkan di blog


Terakhir, kita ingin menayangkan video tersebut di blog kita. Karena saya menggunakan wordpress, saya pasang [plugin External Video for Everybody](http://open.pages.kevinwiliarty.com/external-video-for-everybody/). Plugin ini menampilkan video player di browser kita, supaya orang lain bisa langsung klik tombol play. Di belakang layar, plugin ini mendeteksi apakah browser kita mendukung HTML 5 atau tidak. Kalau iya, maka video akan ditampilkan dengan tag khusus &lt;video&gt;. Bila tidak, maka flash player akan digunakan. Flash player ini tidak disediakan oleh plugin ini. Kita perlu memilih dan mendownload sendiri dari sekian banyak flash player yang tersedia, contohnya [JW Player](http://www.longtailvideo.com/players/jw-flv-player/)

Sebagai penutup, bisa melihat [tutorial ini](http://linuxandfriends.com/2009/07/13/how-to-create-a-screencast-in-ubuntu-linux/) yang saya gunakan sebagai titik awal eksplorasi saya. 

