---
layout: post
title: "Capacity Planning"
date: 2014-08-19 17:48
comments: true
categories: 
- manajemen
---

Ada pertanyaan bagus di milis IT Project Management, sebagai berikut

> Mohon di-share caranya menentukan spesifikasi minimal hardware yang dibutuhkan sebuah sistem.
> contoh [http://en.wikipedia.org/wiki/System_requirements](http://en.wikipedia.org/wiki/System_requirements)
> Kriteria apa saja yang digunakan dalam memilih hardware? Terutama menentukan jumlah RAM dan Speed Processor nya. Apakah cukup dari jumlah concurrent user? Atau menggunakan metode trial-and-error.
> Kalaupun trial-and-error, tentunya ada standar yang digunakan sebagai benchmark awal ya kan? Bagaimana standar awal tersebut?

Mari kita bahas

<!--more-->

Proses perencanaan seperti ini disebut dengan istilah Capacity Planning. Penjelasan lengkapnya bisa dibaca [di Wikipedia](http://en.wikipedia.org/wiki/Capacity_planning).

Pada intinya, proses Capacity Planning di dunia IT dilakukan untuk mengetahui perencanaan infrastruktur yang dibutuhkan agar sistem yang dibangun bisa bekerja dengan baik sesuai kebutuhannya. Ada beberapa metrik yang ingin dihasilkan dari proses ini, antara lain:

* kebutuhan hardware (berapa server, masing-masing prosesornya apa, memori berapa, harddisk berapa, dan sebagainya)
* kebutuhan jaringan (berapa besar bandwidth, berapa IP public, berapa jalur redundan/backup, dan sebagainya)
* kebutuhan tempat (berapa luas ruang server, apakah dibutuhkan lokasi sekunder untuk Disaster Recovery Center)
* kebutuhan energi (berapa watt listriknya, berapa UPS, perlu genset atau tidak, dan sebagainya)

## Data yang dibutuhkan ##

Angka-angka di atas tentu tidak turun dari langit. Ada beberapa data yang kita butuhkan sebagai input, antara lain:

* proyeksi pertumbuhan kegiatan bisnis. Berapa user di tahun pertama, berapa user di tahun kedua, dan seterusnya
* profil perilaku user. Apakah ramai di tanggal tertentu (misalnya aplikasi pembayaran tagihan)? Apakah ramai di bulan tertentu (misalnya aplikasi penjualan tiket pesawat)? Atau di hari tertentu (misalnya tiket bioskop)?
* constraint yang harus dipenuhi secara bisnis. Berapa detik user boleh menunggu? Berapa banyak user yang diperbolehkan mengantri dalam sistem? Apakah boleh sistemnya down? Kalau boleh, berapa lama batas waktunya sampai dia harus aktif lagi?
* profil perilaku aplikasi kita sendiri. Berapa besar data yang disimpan dalam disk untuk tiap user? Berapa besar data tersimpan untuk satu transaksi? Berapa besar data yang lewat di jaringan untuk satu transaksi? Bagaimana rinciannya, berapa byte antara database server ke application server, berapa byte antara application server ke perangkat yang digunakan user?

## Cara Memperoleh Data ##

Data-data ini bisa kita peroleh dengan berbagai cara, misalnya:

* proyeksi pertumbuhan bisa diminta dari divisi marketing. Mereka tentu punya target pasar yang nantinya kita konversi menjadi jumlah user.
* profil perilaku user juga bisa diminta dari divisi marketing. Segmentasinya seperti apa (anak, remaja, atau dewasa; orang kota atau orang desa), demografinya bagaimana, sebaran geografisnya di mana saja, dan sebagainya.
* constraint juga bisa diperoleh dari divisi bisnis / marketing. Seperti apa penawaran kompetitor, apakah mereka menjanjikan fitur tertentu yang diunggulkan, dan sebagainya.
* data tentang aplikasi kita, tentu kita bisa kumpulkan sendiri. Deploy aplikasi kita di testing server, lalu lakukan functional dan stress test dengan tools seperti [JMeter](http://jmeter.apache.org/). Jalankan aplikasi, jalankan testing tools, dan kumpulkan datanya. Cara melakukan profiling bisa dibaca di [artikel saya tentang tuning performance](http://software.endy.muhardin.com/programming/tuning-performance/)

Beberapa data yang bisa dikumpulkan dari cara ini misalnya:

### Storage ###

* besar data yang digunakan oleh satu user aplikasi
* besar data yang digunakan untuk masing-masing jenis transaksi bisnis (penjualan, pembelian, barang masuk, barang keluar, dan sebagainya)

### Processing ###

Processing di sini maksudnya, dengan prosesor dan RAM tertentu, berapa

* jumlah maksimal request yang bisa dihandle tanpa terjadi error (100% sukses)
* jumlah maksimal request yang bisa dihandle dengan tingkat error yang bisa diterima (10% transaksi gagal)
* waktu yang dibutuhkan untuk memproses masing-masing jenis request (login, entri transaksi, generate report, pencarian data, dsb)

### Network ###

* berapa byte yang ditransmisikan untuk masing-masing jenis request dan response
* waktu yang dibutuhkan untuk transmisi dengan berbagai jenis koneksi (ADSL, leased line, fiber optik, GPRS, 3G, dsb)
* waktu yang ditoleransi aplikasi sebelum request dinyatakan timeout

Sampai di sini, kita sudah tahu output, dan juga sudah punya input. Tinggal diproses saja.

## Memproses Data ##

Ada beberapa hal yang bisa kita analisa dari data di atas, yaitu:

* kebutuhan hardware
* kebutuhan jaringan
* skema deployment
* kebutuhan infrastruktur pendukung

### Kebutuhan Hardware ###

Dari stress test yang kita lakukan, kita bisa tahu 2 hal:

1. Spesifikasi hardware yang kita gunakan pada waktu test
2. Jumlah maksimal load yang bisa ditangani oleh hardware tersebut

Sebagai ilustrasi, misalnya kita menggunakan server test dengan spesifikasi sebagai berikut:

* Prosesor Xeon Dual Core
* RAM 8GB
* SATA 120GB

Bisa menangani load sebagai berikut

* 1000 concurrent user
* masing-masing user melakukan login, entri transaksi dua kali, melihat report, dan kemudian mengunduh laporan dalam format PDF

Dan bisa menampung data untuk

* 10.000 registered user
* 1.000.000 transaksi

Perlu diperhatikan bahwa jumlah user yang bisa ditangani tentu berbeda tergantung kompleksitas aplikasinya. Jadi jangan bertanya di forum seperti ini

> Aplikasi saya kok boros resource ya? Padahal sudah pakai Xeon Dual Core dan RAM 8GB, tapi cuma bisa menghandle 1000 user?

Pertanyaan di atas tidak bisa dijawab tanpa tahu persis isi perut aplikasinya. Hanya arsitek aplikasinya yang bisa menjawab, karena dia yang tahu apa bisnis proses yang dijalankan, apa teknologi yang digunakan, bagaimana teknik query database, bagaimana strategi caching, dan sebagainya. Bahkan mungkin saja angka 1000 user itu sudah merupakan prestasi yang luar biasa.

Jadi sebetulnya, dari proses test tersebut kita cuma butuh kesimpulan sebagai berikut

> Xeon Dual Core + RAM 8GB + Disk 120GB = 1000 concurrent user + 10.000 registered user + 1.000.000 transaksi

Dari kesimpulan di atas, kita bisa interpolasi ke requirement dari sisi bisnis. Kalau bisnisnya ingin melayani 2000 concurrent user, 20.000 registered user, dan 2.000.000 transaksi, tentu kita harus beli minimal Xeon Quad Core, RAM 16GB, dan Disk 300GB. 

Jangan lupa, selain spesifikasi minimal kita juga bisa mengeluarkan spesifikasi yang ideal / direkomendasikan. Soalnya bagian finance dan purchasing biasanya suka kalau mereka punya alternatif. Pastikan saja spesifikasi minimal yang kita berikan sudah mempunyai cadangan kapasitas. Biasanya saya berikan tiga level spesifikasi:

* minimal
* rekomendasi
* ideal

Tentu saja sebenarnya sudah saya markup dari perhitungan sebenarnya, sehingga spesifikasi minimal sebenarnya adalah spesifikasi rekomendasi, spesifikasi rekomendasi sebenarnya adalah spesifikasi ideal, dan yang saya tulis sebagai spesifikasi ideal sebenarnya adalah spesifikasi _all you can eat_. Jangan heran kalau nanti isinya adalah [NonStop Server](http://en.wikipedia.org/wiki/NonStop)

### Skema Deployment ###

Beberapa requirement bisnis menuntut skema deployment tertentu. Contohnya, kita mendapatkan requirement seperti ini

> Sistem harus berjalan dengan SLA 99.9%. Bila terjadi downtime, sistem cadangan harus aktif paling lambat dalam waktu 1 jam. Sistem cadangan harus menyimpan data transaksi minimal satu hari kerja sebelumnya.

Requirement bisnis tersebut harus kita terjemahkan dulu menjadi angka yang bisa kita pahami secara teknis.

Pertama, kita [terjemahkan SLA tersebut](http://www.joshualyman.com/2010/12/sla-uptime-guarantees-in-minutes-and-hours/). Angka 99.9% artinya dalam setahun sistem cuma boleh mati maksimal 525.6 menit atau 8.76 jam. Perlu diperhatikan bahwa angka ini sudah termasuk proses terencana (scheduled downtime) seperti misalnya upgrade versi aplikasi, deployment karena fixing bug, ataupun server crash karena berbagai alasan.

Kedua, dari requirement di atas, kita bisa menyimpulkan adanya kebutuhan sistem cadangan. Sistem cadangan ini biasanya harus berjauhan dari sistem utama (geographic diversity).

Ketiga, dari waktu aktivasi sistem cadangan dan sinkronisasi data, kita dapat menentukan strategi replication antar kedua sistem. Delay data satu hari artinya kita bisa melakukan sinkronisasi data dengan file transfer biasa (FTP atau Rsync). 

Aktivasi 1 jam artinya kita bisa menyimpan data dalam bentuk dump database karena waktu 1 jam memungkinkan kita untuk melakukan proses restore.

Bila data harus sinkron secara hampir real-time dan aktivasi di bawah 10 menit, maka kita harus mempertimbangkan strategi sinkronisasi yang berbeda (misalnya di level disk menggunakan DRBD).

### Kebutuhan Jaringan ###

Lakukan logika yang sama untuk kebutuhan jaringan. Interpolasikan antara requirement bisnis dengan karakteristik aplikasi. Nanti kita akan dapatkan kesimpulan misalnya seperti ini:

* untuk menangani 2000 transaksi per detik
* dibutuhkan koneksi uplink dengan bandwidth 1Mbps dengan maksimum delay 0.1ms

Dengan contoh kasus di atas, setidaknya ada tiga segmen jaringan yang kita harus pikirkan:

* dari sistem utama / cadangan ke end user
* dari sistem utama ke sistem cadangan (untuk keperluan sinkronisasi dan replikasi data)
* di internal sistem (utama dan cadangan)

Kebutuhan jaringan menuju end user dapat dikalkulasi dengan mengkombinasikan:

* jumlah concurrent user
* apa yang dilakukan masing-masing user di aplikasi
* besar data yang ditransmisikan untuk masing-masing aktifitas user

Kebutuhan jaringan dari sistem utama ke sistem cadangan bisa dikalkulasi dengan mempertimbangkan:

* delay sinkronisasi data. Bila data harus sinkron secara real time, maka bandwidth harus besar dan delay harus kecil supaya data bisa ditransfer dengan lancar dan cepat
* delay aktivasi sistem cadangan. Bila aktivasinya tidak harus cepat, kita bisa mentransfer data dalam bentuk dump yang membutuhkan proses restore sebelum sistem aktif. Tapi kalau aktivasi harus cepat, maka data harus ditransfer dalam bentuk yang lebih instan seperti byte-per-byte blok dalam disk. Ini butuh jaringan dengan spesifikasi yang tinggi

Kebutuhan jaringan di internal sistem juga harus dipertimbangkan, terutama antara application server dan database server. Walaupun demikian, karena sifatnya jaringan internal, maka kita memiliki keleluasaan untuk memasang perangkat gigabit.

### Infrastruktur Pendukung ###

Hasil perhitungan terhadap kebutuhan hardware, skema deployment, dan jaringan bisa kita gunakan untuk menghitung berapa ruangan, rak, listrik yang kita butuhkan untuk menjalankan sekian banyak server dan perangkat jaringan. Sesuai dengan requirement SLA, kita juga mungkin perlu menyewa lokasi kedua untuk sistem cadangan.

## Kesimpulan ##

Singkatnya, untuk membuat Capacity Planning kita perlu mengetahui:

* requirement bisnis sekarang dan beberapa tahun ke depan
* profil dan karakteristik aplikasi yang kita bangun

Dengan data tersebut, kita bisa menghitung:

* apa saja perangkat yang dibutuhkan
* berapa jumlah masing-masing perangkat
* bagaimana spesifikasi masing-masing perangkat
* apa saja infrastruktur untuk menjalankan semua perangkat tersebut
* sampai kapan perangkat bisa digunakan
* pada titik mana kita harus upgrade / menambah perangkat

Demikianlah sekilas tentang Capacity Planning, semoga bermanfaat.
