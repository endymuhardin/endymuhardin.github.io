---
layout: post
title: "Cara Mengunduh Website"
date: 2013-11-28 10:04
comments: true
categories: 
- linux
---

Banyak pembaca blog saya yang bertanya

> Mas/Om/Pak/Bos/whatever, bolehkah isi blognya saya download?

Jawabannya tentu saja boleh. Kalau tidak boleh buat apa saya publish ;)

Pertanyaan selanjutnya

> Bagaimana cara mengunduh seluruh isi website supaya bisa dibuka tanpa internet?

Gampang, begini caranya.

<!--more-->

Linux sudah mempunyai aplikasi pengunduh yang sangat sakti, namanya `wget`. Kita tinggal jalankan di command line dengan opsi-opsi yang sesuai, maka dia akan mengunduh seluruh website untuk kita. Aplikasi `wget` ini umumnya sudah tersedia di semua distro linux populer, sehingga tidak dibutuhkan langkah instalasi tambahan.

> Kok command line? Apa tidak ada yang GUI?

Sebetulnya ada banyak. Tapi untuk keperluan download, aplikasi command line jauh lebih baik. Kita bisa login melalui `ssh` ke mesin lain yang memiliki koneksi internet bagus dan menjalankan `wget` disana. Tinggalkan beberapa hari, setelah itu dicek apakah sudah selesai. Begitu selesai, kita tinggal copy ke laptop kita. Hal ini sulit dilakukan dengan aplikasi berbasis GUI.

Tanpa banyak basa-basi, inilah perintah `wget` beserta opsi-opsi yang dibutuhkan

```
wget \
--recursive \
--convert-links \
--adjust-extension \
--page-requisites \
--span-hosts \
-e robots=off \
--timestamping \
--domains=software.endy.muhardin.com \
http://software.endy.muhardin.com
```

Penjelasan opsi:

* `recursive` : tiap ada link di halaman web, link tersebut ikut diunduh
* `convert-links` : ubah link (halaman lain, gambar, javascript, dsb) menjadi link lokal, supaya dia tidak mengarah ke internet
* `adjust-extension` : bila ada link yang dinamis seperti `cgi`, `asp`, `php`, konversi menjadi extension statis seperti `html`
* `page-requisites` : unduh semua kebutuhan halaman supaya tampilannya sesuai asli (misalnya gambar, stylesheet, dsb)
* `span-hosts` : banyak orang (termasuk saya) menghosting gambar di layanan publik seperti flickr, google plus, dan lainnya. Opsi ini menyuruh `wget` supaya link di luar website saya juga diunduh
* `robots=off` : ada beberapa website yang melarang halaman dibuka selain oleh browser. Opsi ini perlu supaya larangan tersebut diabaikan
* `timestamping` : timestamp tiap file diset sesuai di server. Ini memungkinkan kita untuk menjalankan lagi wget di lain hari untuk mengupdate website yang sudah pernah kita unduh. Dengan opsi ini, file yang sudah diunduh tidak akan diunduh ulang. Menghemat bandwidth dan waktu
* `domains` : membatasi halaman yang diunduh hanya untuk domain tertentu
* URL website yang ingin diambil. Pada contoh di atas adalah `http://software.endy.muhardin.com`

Demikianlah cara mengunduh website ini. Semoga bermanfaat.

> Tunggu ... tunggu ... Saya pakai Windows, bagaimana caranya mengunduh di Windows?

Gampang, [instal saja Ubuntu](http://software.endy.muhardin.com/linux/upgrade-ubuntu/) :D
