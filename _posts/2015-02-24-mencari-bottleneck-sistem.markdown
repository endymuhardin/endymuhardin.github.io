---
layout: post
title: "Mencari Bottleneck Sistem"
date: 2015-02-24 05:28
comments: true
categories: 
- linux
---

Sudah sebulan ini laptop saya lemot.

> Apa maksudnya lemot? Seperti apa yang dibilang lemot?

Pada waktu kuliah dulu, di tahun 1999, komputer saya spesifikasinya Pentium 233 MMX dengan RAM 32 MB (Mega, bukan Giga). Dia berjalan cukup responsif dengan sistem operasi Windows 98 SE. Di tahun 2000, Microsoft merilis Windows 2000 Professional. Saya instal di komputer saya tersebut, dan dia langsung lemot seperti bekicot.

![Gary the Snail](https://lh3.googleusercontent.com/-lYF4E2oWQvU/VOyUY1ZEmbI/AAAAAAAAH90/Tomn_Tcatw4/w640-h480-no/Gary_bored_again..png)

Gambar diambil dari [sini](http://spongebob.wikia.com/wiki/Gary_the_Snail/gallery)

Laptop saya sekarang ini spesifikasinya cukup mumpuni, yaitu sebagai berikut:

* Processor Pentium Core i5
* RAM 8 GB
* Solid State Disk Corsair 128 GB

Laptop tersebut diinstal Ubuntu 14.04 yang selalu up-to-date dengan partisi `/home` terpisah dan terenkripsi.

Dengan spesifikasi tersebut, normalnya laptop saya ini bekerja sekejap mata. Tekan tombol power, sekejap mata muncul halaman login. Isikan password, sekejap mata muncul desktopnya. Klik icon Chrome, dalam sekejap Gmail sudah tersaji. Nah, sudah sebulan ini dia lemot, seperti Pentium 233 MMX yang diinstal Windows 2000 Professional dulu.

Berikut langkah-langkah yang saya tempuh sampai akhirnya menemukan solusinya, sebulan kemudian ;)

<!--more-->

## Mencurigai Aplikasi ##

Hal pertama yang saya curigai adalah aplikasi yang berjalan di background dan mungkin menghabiskan resource. Saya ingat-ingat lagi apa perubahan yang saya lakukan baru-baru ini. Teringat adanya launching Whatsapp yang bisa diakses melalui browser. Biasanya saya pakai browser Chromium, tapi karena ingin menggunakan Whatsapp di laptop, akhirnya saya install Chrome.

Tersangka pertama adalah Chrome. Saya coba uninstall Chrome, kembali ke Chromium. Tetap lemot. Uninstall Chromium, pakai Firefox, tidak ada pengaruh. Hmm ... mungkin bukan di situ masalahnya. Saatnya kita melakukan langkah yang lebih drastis.

## Mencurigai Sistem Operasi ##

Sebelumnya saya menggunakan Ubuntu 14.04. Usianya sudah hampir setahun. Yang sudah-sudah, saya selalu upgrade tiap 6 bulan, sehingga harusnya saya sudah menggunakan 14.10. Tapi kemarin itu karena malas reinstall, akhirnya saya biarkan. Mungkin ini masalahnya, mari kita coba.

Laptop saya format, diganti dengan Ubuntu 14.10 32bit. Instal ulang semua aplikasi, menghabiskan 2 GB kuota internet. Ternyata tetap lemot.

Format lagi, ganti dengan 14.10 64bit. Habiskan lagi kuota 2 GB untuk menginstal aplikasi, tetap lemot juga.

Sempat terpikir mencurigai partisi `/home` yang terenkripsi. Mungkin saja proses enkripsi ini memakan resource yang besar. Tapi tidak saya teruskan penelusuran ke arah sana, karena enkripsi ini sudah saya aktifkan sejak tahun lalu dan lancar-lancar saja.

Berarti jelas sudah, masalahnya bukan di sistem operasi. Saatnya kita gunakan bantuan, phone a friend.

## Mencurigai Desktop Manager ##

Karena buntu, saya putuskan untuk berkonsultasi dengan orang lain. Saya sudah menggunakan Linux sejak sebelum lulus, sekitar tahun 2000-2001. Mulai tahun 2002 saya tidak lagi menginstal Windows sama sekali di laptop. Bukan perkara mudah mencari teman diskusi yang memiliki jam terbang Linux lebih dari 12 tahun.

Untungnya orangnya ada, seleb pula :D. The one and only [Anton Raharja](http://antonraharja.com). Dia sudah pakai Linux sebelum saya punya komputer. Mudah-mudahan beliau punya solusi. Dan ternyata memang ada. 

Dia sempat mengalami masalah lemot, dan [masalahnya ada di Zeitgeist](http://linuxaria.com/howto/how-to-remove-zeitgeist-in-ubuntu-and-why). Zeitgeist adalah service di Ubuntu yang bertugas untuk mencatat kegiatan user. Aplikasi yang sering dipakai, dokumen yang sering dibuka, bahkan dia seringkali menjelajahi harddisk kita untuk membuat index. Gunanya supaya kalau kita mencari sesuatu, Ubuntu bisa memberikan rekomendasi yang tepat. Solusinya adalah dengan [mematikan si Zeitgeist ini](http://antonraharja.com/2014/10/21/my-slow-slow-ubuntu-14-10/).

Baiklah saya coba .... dan tidak ngaruh juga :((

Oke, bukan Zeitgeist. Mungkin driver VGA card yang kurang sempurna sehingga lemot ketika dipakai merender efek visual desktop manager Unity yang digunakan Ubuntu. Sebetulnya kecurigaan ini kecil, karena VGA card saya Intel yang relatif aman di Linux. Berbeda dengan nVidia atau ATI yang sering bermasalah. Anyway, layak dicoba.

Saya ganti Unity dengan Cinnamon, desktop manager Linux Mint yang konon katanya sederhana, minimalis, dan ringan.

No dice .... -_- 

## Going Scientific ##

Hmmm, apa lagi yang bisa dicoba?

> Hei hei, dulu siapa yang menulis artikel [Tuning Performance](http://software.endy.muhardin.com/programming/tuning-performance) ?

Kan di situ sudah dijelaskan bahwa kita harus pasang monitor untuk mengukur penggunaan resource. Jangan main tebak-tebakan.

> Baiklah, mari kita ambil langkah kuantitatif.

Pertama, mari kita amati penggunaan memori. Semua sistem operasi memiliki fenomena yang disebut `thrashing`, yaitu [kehabisan memori sehingga data yang ada ditulis ke harddisk](http://en.wikipedia.org/wiki/Thrashing_%28computer_science%29) untuk membuat ruang buat aplikasi yang membutuhkannya. Karena akses ke harddisk jauh lebih lemot daripada akses ke memori, maka keseluruhan sistem akan menjadi tidak responsif.

Gunakan aplikasi `top` untuk memonitor pemakaian memori. Mumpung sedang buka `top`, sekalian saja amati pemakaian CPU.

> Ternyata memori dan CPU santai, saudara-saudara.

Baiklah, mari kita cek tersangka berikut: I/O harddisk. Aktifitas baca tulis harddisk, bila tidak optimal, akan membuat sistem lambat. Bisa jadi harddisk saya error, sehingga proses I/O tidak berjalan lancar.

Untuk mengamati kegiatan I/O, kita install aplikasi `iotop`. Jalankan, amati pada saat dia sedang lemot, dan ternyata .... santai juga !!!

> Ada apa ini?? Kenapa dia lemot padahal semua resource tidak terpakai?

## Faktor Luck dan Pantang Menyerah ##

Pada titik ini, tentunya Anda tidak perlu menyarankan saya untuk [mencari di Google](http://software.endy.muhardin.com/aplikasi/teknik-menggunakan-google). Berbagai keyword sudah saya coba, diantaranya yang saya ingat

* ubuntu slow
* ubuntu sluggish
* ubuntu chrome whatsapp slow
* ubuntu compiz not responsive
* ubuntu ssd slow
* dan berbagai kombinasi keyword lainnya

Akhirnya, titik terang ditemukan dengan keyword `ubuntu vga intel bug`. Salah satu link yang diberikan google mengarah ke [diskusi di AskUbuntu ini](http://askubuntu.com/questions/186387/laptop-slows-down-while-charging-battery). 

![Screenshot AskUbuntu](https://lh6.googleusercontent.com/-9w3o3-cb5uA/VOyR5GuGRUI/AAAAAAAAH9c/p1ncooIqOaA/w884-h552-no/01.%2BAskUbuntu%2BLaptop%2BSlow.png)

Dari artikel di atas, saya dapat keyword, yaitu `ubuntu slow when charging`.

> Masa sih, charger mempengaruhi performance?

Saya coba. Kan gampang, tinggal cabut dan colok chargernya. Ternyata memang benar ini masalahnya. Begitu charger dicolok, berapapun kondisi baterai (10% ataupun 70%), langsung lemot. Copot charger, langsung ngebut.

> Kok bisa ?? Apa hubungannya charger dengan performance?

Mari kita lanjut google.

Ketemu lagi [artikel lain yang isinya senada](https://bbs.archlinux.org/viewtopic.php?id=120892), yaitu gunakan opsi kernel

```
drm_kms_helper.poll=N
```

Sudah dicoba, tetap lemot. Pantang menyerah, google lagi masih dengan keyword `ubuntu slow when charging`. Kali ini dapat [artikel berjudul "Internet becomes very slow when laptop charger is plugged"](http://www.computing.net/answers/networking/internet-becomes-very-slow-when-laptop-charger-is-plugged/51640.html).

Penjelasan tentang pengaruh charger terhadap performance ada di komentar paling bawah

![Screenshot solusi](https://lh6.googleusercontent.com/-qgsN3cgs2X4/VOyR5A7CztI/AAAAAAAAH9g/TkUVkKK8nxo/w698-h586-no/02.%2BSolusi%2B-%2BCharger%2Bsoak.png)

Charger saya ternyata sudah lemah, sehingga dia mengeluarkan daya listrik yang kecil. Mendeteksi arus listrik yang tidak memadai, laptop saya menurunkan kemampuan sistem supaya tidak boros energi.

Setelah membaca komentar tadi, saya baru ingat bahwa memang butuh waktu lama untuk mengisi baterai laptop. Biasanya cuma 2 jam sudah penuh, sekarang butuh waktu 8-10 jam sampai dia penuh.

Test dengan charger laptop adik saya yang semerek, langsung mak joss !!!

Pada kasus yang dibahas di Ask Ubuntu, opsi kernel bisa dipakai karena penurunan kemampuan dilakukan oleh sistem operasi, sehingga bisa di-override melalui konfigurasi. Tapi di laptop saya, penurunan ini dilakukan di level hardware (sebelum sampai ke sistem operasi), sehingga tidak bisa diatasi dengan konfigurasi kernel saja.

Segera beli charger seharga 300 ribu di Mal Ambassador, dan dunia kembali terang benderang :D

Pada saat mulai menulis artikel ini, kondisi baterai ada di 10%. Sekarang, 2 jam kemudian sudah di angka 70%. Now we're talking ;)

## Pesan Moral ##

Dari kejadian ini, ada beberapa hikmah yang bisa kita dapatkan, yaitu

1. Pantang menyerah. Menulis artikel tentang [teknik menggunakan google](http://software.endy.muhardin.com/aplikasi/teknik-menggunakan-google) tidak menjadi jaminan saya bisa menemukan solusi dengan cepat. Butuh waktu sebulan, mencoba berbagai keyword. Membuka artikel dan menemui jalan buntu, mendapatkan ide keyword dari artikel satu untuk digoogle lagi, dan seterusnya.

2. Dalam urusan tuning performance, 99% effort dihabiskan untuk mencari bottleneck (sebulan berpusing ria). Setelah ketemu, perbaikannya cuma 1 jam (pinjam charger untuk memastikan, kemudian beli charger baru ke Ambas).

3. Urusan tuning mirip dengan diagnosa penyakit di dokter. Kita cuma punya dugaan awal, yang akan kita konfirmasi melalui serangkaian tes. Coba lakukan ini, jalani treatment anu, kerjakan test tertentu. Seringkali hal yang kita lakukan bukanlah implementasi solusi, tapi hanya langkah perantara untuk mendapatkan informasi lebih lengkap.

4. Solusi masalah performance seringkali ada di tempat yang tidak kita duga. Oleh karena itu, pada waktu mencari bottleneck jangan terlalu yakin pada dugaan awal. Kalau kita terlalu yakin, pikiran kita akan terpaku ke satu hal tersebut sehingga mengabaikan kemungkinan-kemungkinan lain. Bersikaplah open-minded, inti masalah dan solusi bisa ada di mana saja.

Demikian sedikit sharing tentang laptop lemot. Semoga bermanfaat bagi kita semua.