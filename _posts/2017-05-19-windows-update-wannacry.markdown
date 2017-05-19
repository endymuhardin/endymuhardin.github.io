---
layout: post
title: "Tips Mudah Windows Update untuk menangkal WannaCry"
date: 2017-05-19 07:00
comments: true
categories:
- devops
---
Wiken lalu, para staf IT di seluruh dunia mendapat hadiah istimewa, yaitu malware WannaCry. Banyak korban yang kena, baik di luar negeri maupun di negara kita. Sampai masuk TV segala.

Saya tidak akan membahas lagi tentang apa itu WannaCry. Silahkan baca [blognya Prof. Budi Rahardjo](https://rahard.wordpress.com/2017/05/14/penanganan-ransomware-wannacry/), baca [slide presentasi saya](https://goo.gl/s7xCV1), atau -- bagi yang tidak suka artikel bahasa Indonesia -- bisa baca [tulisannya Troy Hunt](https://www.troyhunt.com/everything-you-need-to-know-about-the-wannacrypt-ransomware/). Pada artikel ini saya akan bahas tentang bagaimana menyelesaikan urusan WannaCry ini, untuk puluhan komputer, tanpa membuat kita __wanna cry__.

<!--more-->

> Cara menangkal malware ini sebenarnya sangat sederhana, yaitu Update Windows Anda !!!

Tapi sayangnya, mayoritas orang Indonesia tidak mengupdate Windows secara berkala. Bahkan sudah disediakan fitur otomatisnya pun malah dimatikan 😪. Banyak alasannya, diantaranya boros benwit, bikin komputer lemot (selama proses update berjalan), dan mengganggu ritual tenggo. Begitu jam 16:55, mau shutdown komputer, ternyata tulisannya installing update 11 of 208 ...

![[Windows Update]({{site.url}}/images/uploads/2017/wsus-offline/windows-update.png)]({{site.url}}/images/uploads/2017/wsus-offline/windows-update.png)

Capedee ...

> Oke gampang kan solusinya, tinggal masuk ke Control Panel, tekan Update, tunggu selesai? Apa masalahnya?

Nah, ternyata masalah besar. Jangankan kita manusia biasa, bahkan [Bill Gates saja seharian penuh tidak berhasil menjalankan Windows Update, bahkan sudah dibantu Satya Nadella](
http://www.newyorker.com/humor/borowitz-report/gates-spends-entire-first-day-back-in-office-trying-to-install-windows-8-1). 😂😂

Tambah urusan lagi bila Anda -sebagai staf IT support- punya puluhan komputer yang harus dijalankan Windows Update-nya. Belang-belang pulak. Ada Windows 10, 8.1, 8, 7, Vista, dan bahkan XP 🙈😵😭. Kalau tiap komputer butuh donlod 2GB buat update, bayangkan kalo komputernya ada 20. Bisa2 lemot seisi gedung.

Sebetulnya Microsoft sudah menyediakan patch khusus untuk menambal lubang yang dieksploitasi WannaCry. Tapi sayangnya, seringkali dia mengeluarkan pesan error Not Applicable.

![[Windows Update]({{site.url}}/images/uploads/2017/wsus-offline/update-not-applicable.png)]({{site.url}}/images/uploads/2017/wsus-offline/update-not-applicable.png)

Nampaknya untuk bisa memasang patch ini kita harus pasang dulu patch-patch yang dirilis sebelumnya. Tidak bisa dia sendirian saja. Tidak heran Bill Gates kesulitan.

> Lalu bagaimana?

Untunglah ada orang lain yang juga sudah mengalami masalah sama, kemudian membuatkan solusinya. Mereka membuat aplikasi open source bernama [WSUS Offline](http://www.wsusoffline.net/docs/)

Cara kerjanya sangat sederhana. Aplikasi ini memiliki dua bagian : bagian mengunduh dan bagian menjalankan.

Pertama, kita jalankan dulu bagian mengunduh. Berikut tampilannya.

![[WSUS Downloader]({{site.url}}/images/uploads/2017/wsus-offline/wsus-downloader.png)]({{site.url}}/images/uploads/2017/wsus-offline/wsus-downloader.png)

Kita cukup centang versi yang mau kita patch. Karena urusan belang-belang tadi, maka saya centang semua (7,8,10). Vista dan XP tidak ada karena sudah tidak diskontinu. Silahkan donlod WSUS versi lama kalau butuh Vista dan XP.

Setelah centang, klik Start. Saya anjurkan untuk menjalankannya sebelum pulang kantor dan ditinggal jalan. Soalnya setelah selesai versi 7,8,10 64 bit, saya cek ukurannya 10GB. Bisa diamuk orang sekantor kalo kita jalankan siang-siang.

Pada waktu tekan Start, dia akan mengunduh paket update dari server Microsoft, mulai dari versi pertama OS rilis, sampai hari ini. Makanya ada banyak file yang dia unduh.

Setelah selesai dia donlod, kita zip satu folder tersebut, masukkan ke flashdisk. Ingat ya, zip dulu supaya proses copy gak lemot. Soalnya proses copy ratusan file kecil jauh lebih lambat daripada satu file besar.

Copy file WSUS tersebut ke komputer/laptop yang mau diupdate, kemudian extract. Setelah itu masuk ke folder `client`, lalu jalankan `UpdateInstaller`.

![[WSUS Downloader]({{site.url}}/images/uploads/2017/wsus-offline/wsus-downloader.png)]({{site.url}}/images/uploads/2017/wsus-offline/run-wsus-client.png)

Klik start, kemudian `sit back and relax`. Sementara menunggu selesai, jalankan prosedur yang sama di komputer lain. WSUS client ini akan menginstal update dari hasil download kita tadi, sehingga proses update tidak membutuhkan koneksi internet. Dengan demikian, kita bisa menghemat bandwidth sekaligus mengurangi resiko komputer terinfeksi `WannaCry` sementara proses update belum selesai.

Dengan menggunakan prosedur ini, dalam sehari tim IT [Tazkia](http://tazkia.ac.id) berhasil mengupdate puluhan laptop dan PC dalam waktu sehari, terdiri dari Windows 7, Windows 8, Windows 8.1, dan Windows 10.

Selamat mencoba, semoga berhasil.

Dan jangan lupa, walaupun `Windows Update` (sementara ini) bisa menangkal malware WannaCry, tetap saja `apt-get update` merupakan solusi yang jauh lebih strategis dan superior.
