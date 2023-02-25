---
comments: true
date: 2021-01-19 07:00:29
layout: post
slug: simplifikasi-prosedur-backup
title: Simplifikasi Prosedur Backup
categories:
- linux
---

Sebelumnya, saya sudah beberapa kali menulis artikel tentang backup, diantaranya:

* [Backup Home Folder](https://software.endy.muhardin.com/linux/backup-home-folder/)
* [Backup dengan Duplicity](https://software.endy.muhardin.com/linux/backup-duplicity/)

dan masih banyak lagi yang lebih spesifik tentang backup untuk aplikasi tertentu seperti MySQL, Subversion, dan lainnya.

Di awal 2021 ini, kondisi sudah banyak berubah, diantaranya :

* semua kode program sudah disimpan di repository git
* internet sudah sangat tersedia, sehingga tidak perlu lagi mengumpulkan file-file installer
* cloud storage service sudah banyak tersedia. Dropbox, Google Drive, iCloud, dan sebagainya. Sehingga dokumen-dokumen sudah langsung tersinkronisasi ke cloud. Bahkan sebagian besar dokumen saya (tulisan, spreadsheet, gambar) sudah dibuat di aplikasi berbasis cloud seperti Google Docs dan sejenisnya.

Yang tersisa harus saya backup secara manual tinggal koleksi foto dan video pribadi saja. Sampai saat ini saya masih memotret dan merekam video menggunakan _kamera betulan_, yang ukuran filenya satu foto bisa mencapai belasan MB. Walaupun smartphone sudah bisa mengambil foto berkualitas lumayan, tapi tetap ergonomi dan user experience menggunakan kamera dslr/mirrorless belum terkalahkan. Belum lagi hasil fotonya, kalau kita buka di komputer, akan terlihat beda kualitasnya.

Selain itu, saya juga secara rutin memindahkan file foto dan video dari smartphone ke external disk. Sehingga tetap saja foto dan video dari smartphone tersebut harus dibackup juga.

Sebagai gambaran, berikut ukuran arsip foto/video saya dari tahun ke tahun

[![Ukuran Foto/Video]({{site.url}}/images/uploads/2021/backup-2021/ukuran-folder.png)]({{site.url}}/images/uploads/2021/backup-2021/ukuran-folder.png)

Jadi pada artikel kali ini, kita akan membahas prosedur backup untuk foto dan video tersebut.

<!--more-->

* TOC
{:toc}

## Goals & Non-Goals ##

Secara prinsip, backup tetap mengikuti kaidah 3-2-1, yaitu :

* Ada 3 copy dari data yang mau dibackup (satu data utama dan dua backup)
* Terdiri dari minimal 2 jenis media (external disk, CD/DVD, cloud, dsb)
* 1 copy harus berada di lokasi yang terpisah sejauh minimal 30 km

Saat ini saya sudah punya 2 copy, yaitu di laptop dan di external harddisk. Kurang satu copy lagi, di media berbeda, dan di lokasi yang berbeda. Jaman now ya tentu saja kita pakai cloud services.

Ada banyak layanan cloud services untuk menyimpan data. Harga dan kapasitasnya berbeda-beda, tergantung paket promo. Akan tetapi, karena ini backup, maka saya akan pilih provider yang bonafit dan meyakinkan. Saat ini ya Amazon dan Google. 

Provider manapun yang dipilih, tetap saja kita harus mengenkripsi data tersebut. Apalagi ini koleksi foto dan video pribadi. Walaupun saya bukan artis, tapi tetap saja itu data rahasia yang harus diamankan. Mengikuti kaidah computer security, prosedur dan algoritma enkripsi tidak rahasia. Semakin umum dan terbuka prosedur/algoritma, maka akan semakin aman karena sudah direview banyak orang. Kita cukup mengamankan `key` enkripsinya saja.

Jadi, tujuan yang ingin kita capai dari prosedur backup ini adalah :

1. Membuat backup untuk folder foto dan video
2. Backupnya harus terenkripsi
3. Hasil enkripsi tersimpan di 2 harddisk di lokasi berbeda dan 1 cloud provider

Dan ada hal yang tidak akan dilakukan (non-goal) pada prosedur backup ini :

* Kita tidak melakukan backup incremental, cukup lakukan full backup sebulan sekali.

# Persiapan Backup #

File foto dan video saya sudah tersusun secara kronologis dalam folder tahun, bulan, kemudian tanggal. Beberapa folder yang ukurannya kecil, saya gabungkan supaya hasil akhirnya lumayan besar. Ini dilakukan untuk mengefisienkan proses upload, dan juga karena produk Amazon Deep Glacier yang saya gunakan justru memasang tarif lebih mahal bila filenya kecil-kecil.

Folder yang berisi banyak file tersebut kemudian kita satukan menjadi satu file. Sebetulnya kita tidak perlu kompresi di sini, karena file foto dan video sudah dalam kondisi terkompres dari sananya. Tapi untuk alasan konsistensi dan familiaritas, saya gunakan command yang sama dengan kompresi backup pada umumnya. Berikut adalah perintah untuk menggabungkan dan mengkompres satu folder bernama `1994-2010`

```
tar cvzf ./upload-aws/1994-2010.tar.gz 1994-2010
```

Berikut hasilnya

```
ls -lh ./upload-aws/
-rwxr-xr-x  1 endymuhardin  staff    11G Jan 18 12:54 1994-2010.tar.gz
```

# Enkripsi #

Selanjutnya, kita akan mengenkripsi file 11GB tersebut agar tidak bisa dibuka orang lain. Secara umum ada 2 metode enkripsi : asymmetric dan symmetric. Penjelasan detailnya bisa ditonton di [video saya di Youtube](https://www.youtube.com/watch?v=2e0kl1C-7F0&list=PL9oC_cq7OYbwClMMWLTgXr3zz9sQ_JW76&index=8).

Kita akan menggunakan metode hybrid, dimana enkripsi akan dilakukan dengan metode symmetric yang lebih ringan di CPU, tapi symmetric keynya akan digenerate secara otomatis dan dienkripsi lagi dengan asymmetric encryption yang lebih aman. Sesuai dengan [anjuran netizen di Stack Overflow](https://serverfault.com/a/654468).

Cara ini bisa dilakukan dengan mudah dengan menggunakan aplikasi GPG. Penjelasan detailnya sudah pernah saya tulis di [artikel terdahulu](https://software.endy.muhardin.com/linux/menggunakan-gpg/). Kita tidak akan bahas lagi rinciannya, langsung saja ke langkah-langkahnya.

1. Kita generate dulu keypairnya kalau belum ada. Perintahnya seperti ini

    ```
    gpg --full-generate-key
    ```

2. Jangan lupa bikin revocation certificate dan backup keypair dalam format teks terenkripsi

    * membuat revocation certificate

    ```
    gpg --gen-revoke -a endy.muhardin@gmail.com > endymuhardin-revoke.asc
    ```

    * membuat backup keypair

    ```
    gpg --export-secret-keys -a endy.muhardin@gmail.com | gpg --symmetric --cipher-algo AES256 -a > endymuhardin-encrypted.asc
    ```

3. Enkripsi file hasil backup

    ```
    gpg --encrypt --recipient endy.muhardin@gmail.com 1994-2010.tar.gz
    ```

# Test Restore #

Salah satu langkah krusial dalam membuat backup adalah **test restore**. Jangan sampai kita membuat backup, menyimpan dengan aman, lalu merasa tenang. Di kemudian hari, pada waktu kita butuh mengambil kembali backup tersebut, ternyata tidak bisa dibuka. Untuk mencegah hal tersebut, kita perlu mencoba membuka hasil backup yang sudah terenkripsi tersebut.

Prosedurnya adalah sebagai berikut. Lakukan prosedur ini di komputer lain untuk memastikan tidak ada dependensi sama sekali terhadap laptop yang sekarang kita gunakan untuk enkripsi. Kita bisa gunakan VPS, atau virtual box di laptop untuk memastikan prosedur ini berjalan dengan baik di komputer yang fresh.

1. Import gpg key terenkripsi

    ```
    gpg --decrypt -a --output - endymuhardin-encrypted.asc | gpg --batch --import
    ```

2. Decrypt file backup

    ```
    gpg --decrypt-files *.gpg
    ```

3. Buka kompresi tarball

    ```
    tar xvzf 1994-2010.tar.gz
    ```

4. Cek random isi file dan foldernya. Pastikan foldernya bisa diakses, dan filenya bisa dibuka.

# Copy backup ke harddisk lain #

Setelah file backup sudah dipastikan oke, kita bisa membuat checksum untuk verifikasi file. Untuk membuatnya, kita perlu menginstal aplikasi `sha256sum`. Di MacOS, cara installnya sebagai berikut :

```
brew install coreutils
```

Setelah itu, kita pastikan versi yang terinstall

```
sha256sum --version
sha256sum (GNU coreutils) 8.32
Copyright (C) 2020 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <https://gnu.org/licenses/gpl.html>.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Written by Ulrich Drepper, Scott Miller, and David Madore.
```

Kita bisa langsung membuatkan file checksum untuk semua file dalam folder


```
sha256sum -b * > SHA256SUMS
```

Outputnya adalah file teks berisi seperti ini

```
a601da25e7f4bdb8efa745a13cb6d400ab58cc98eacf2b69635aa8a2fdeeacea *1994-2010.tar.gz.gpg
```

Kemudian kita bisa mengcopy seluruh file backup berikut file checksum tersebut. Nanti di lokasi tujuan, kita bisa verifikasi dengan perintah ini

```
sha256sum -c SHA256SUMS
```

Output yang benar harusnya seperti ini

```
1994-2010.tar.gz.gpg: OK
```

# Cloud Backup #

Setelah file backup yang terenkripsi tadi dipastikan bisa dibuka dengan lancar dan baik, sekarang kita bisa melakukan upload ke Amazon Deep Glacier. Caranya masih sama seperti penjelasan di [artikel sebelumnya](https://software.endy.muhardin.com/linux/backup-duplicity/#backup-ke-amazon-s3-dan-glacier).

Kita cukup menjalankan perintah berikut di command line

```
aws s3 cp 1994-2010.tar.gz.gpg s3://endy-backup/backup-foto
```

Lho katanya simplifikasi, kok masih rumit? Ya sebenarnya dibandingkan dengan versi sebelumnya ada banyak penyederhanaan, yaitu:

* tidak ada incremental backup
* tidak menggunakan tools aneh-aneh seperti duplicity

Dan lagipula, prosedurnya tidak terlalu rumit, yaitu:

* buat tarball
* enkripsi
* checksum
* copy ke disk lain
* upload ke cloud

menggunakan tools yang umum dipakai administrator linux, yaitu:

* tar
* gpg
* sha256sum
* rsync
* aws cli

Selamat mencoba. Semoga bermanfaat ... 