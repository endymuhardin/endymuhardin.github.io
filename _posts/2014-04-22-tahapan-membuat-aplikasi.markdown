---
layout: post
title: "Tahapan Membuat Aplikasi"
date: 2014-04-22 23:51
comments: true
categories: 
- manajemen
---

Seperti sudah dijelaskan pada [artikel sebelumnya](http://software.endy.muhardin.com/manajemen/aplikasi-prakarya-vs-aplikasi-production/), anjuran saya buat mereka yang ingin mahir pemrograman adalah

> Buatlah aplikasi production barang 5-10 buah. Insya Allah setelah itu Anda akan mahir.


Setelah kita menguasai dasar-dasar pemrograman seperti:

* konsep variabel dan tipe data
* control flow (looping, branching, jumps)
* pengelompokan (function, class, package)

tidak serta merta kita bisa langsung membuat aplikasi. Analoginya, walaupun kita mahir menggunakan pengolah dokumen seperti MS Word atau Open Office, tidak berarti kita bisa menulis seri lanjutan dari [Harry Potter and the Deathly Hallows](http://en.wikipedia.org/wiki/Harry_Potter_and_the_Deathly_Hallows).

Inilah sebabnya banyak pemegang sertifikasi pemrograman seperti Oracle Certified Java Programmer yang tidak bisa membuat aplikasi, walaupun mendapatkan nilai yang tinggi.

Ada berbagai macam aplikasi, diantaranya:

* aplikasi bisnis, yaitu aplikasi yang membantu pencatatan kegiatan bisnis. Contohnya aplikasi akunting, purchasing, perpustakaan, mini-market, bank, payment gateway, dan sebagainya
* aplikasi sistem, yaitu aplikasi yang memungkinkan berbagai perangkat bekerja sama. Contohnya sistem operasi, device driver, embedded system, dan lainnya
* dan berbagai kategori aplikasi lainnya.

Artikel kali ini akan kita batasi hanya untuk membahas aplikasi bisnis. Mengapa demikian? Karena aplikasi bisnis adalah genre aplikasi yang paling banyak dibuat orang. Sebagai ilustrasi, kita hanya mengenal beberapa sistem operasi populer, yaitu Microsoft Windows, Linux, MacOS. Bandingkan dengan aplikasi bisnis, untuk proses akuntansi saja berapa ribu aplikasi yang tersedia. Bahkan walaupun sudah ada yang gratis dan lengkap, tetap saja banyak perusahaan yang minta dibuatkan aplikasi sejenis. Jadi dari sisi komersial dan ketersediaan lapangan kerja, pembuatan aplikasi bisnis tetaplah pangsa pasar terbesar.

Pada artikel ini, kita akan membahas proses berpikir dan tahapan mulai dari penjabaran aplikasi yang akan dibuat, sampai menjadi skema database dan desain aplikasi berorientasi objek (object-oriented).

<!--more-->

Berikut adalah tahapan yang biasa saya lakukan dalam mengembangkan aplikasi:

1. Membuat deskripsi aplikasi. Berisi penjelasan tentang apa fungsi utama dari aplikasi yang akan kita kembangkan. Tuliskan juga siapa saja user yang terlibat, dan garis besar dari proses bisnis yang akan disediakan oleh aplikasi.
2. Membuat daftar fitur
3. Untuk proyek komersial, daftar fitur ini akan kita terjemahkan menjadi estimasi biaya dan waktu. Bila Anda adalah programmer dan tidak berurusan dengan masalah finansial, silahkan skip langkah ini. Bila Anda ingin tahu lebih jauh, silahkan baca [artikel yang khusus membahas masalah estimasi ini](http://software.endy.muhardin.com/manajemen/estimasi-proyek-software/).
4. Membuat UI Mockup
5. Membuat skema database
6. Membuat daftar class dan relasi antar class
7. Membuat kerangka aplikasi dalam bentuk source code
8. Membuat detail implementasi source code sampai selesai
9. User Acceptance Test, baik internal maupun external (kalau ada client/customer yang akan mengetes)

Agar lebih mudah dipahami, kita akan menggunakan studi kasus aplikasi perpustakaan. Kita pilih aplikasi ini karena semua orang sudah paham proses bisnisnya. Kalau saya pilih aplikasi seperti misalnya payment gateway, banking, gps tracking, dan aplikasi-aplikasi 'bergengsi' lainnya, saya khawatir proses bisnisnya tidak dipahami oleh mayoritas pembaca. Tidak semua orang paham apa yang terjadi pada saat nasabah membuka rekening bank.

Ok mari kita mulai.

## Penjelasan Aplikasi ##

Penjelasan atau deskripsi aplikasi adalah hal terpenting dalam pembuatan aplikasi. Bila kita membuatnya dengan benar, maka pekerjaan kita di tahap selanjutnya akan mudah. Sebagaimana halnya semua skill yang lain, kemahiran kita dalam mengarang penjelasan aplikasi ini hanya bisa didapatkan dari latihan. Berikut contoh penjelasan aplikasi perpustakaan.

```
Aplikasi perpustakaan ini, sesuai namanya berguna 
untuk mengelola kegiatan operasional perpustakaan. 
Aplikasi ini akan digunakan oleh penjaga perpustakaan untuk:

* entri data anggota
* entri data buku
* entri peminjaman buku
* entri pengembalian buku

Selain itu, anggota juga bisa menggunakan aplikasi ini untuk:

* mencari buku dengan kriteria tertentu 
  (misalnya judul, pengarang, topik, dan sebagainya)
* melihat ketersediaan buku
* mengetahui lokasi penyimpanan buku
* booking buku secara online dari rumah agar tidak kehabisan
```

Dari penjelasan aplikasi di atas, kita bisa menentukan apa saja usernya dan apa saja fitur dari aplikasi yang akan kita buat. Mari kita lanjutkan ke tahap selanjutnya.


## Daftar Fitur ##

Aplikasi bisnis (aplikasi yang dibuat untuk melayani operasional bisnis) biasanya memiliki fitur yang dapat diklasifikasikan menjadi beberapa kategori:

* master data : data referensi yang jarang berubah. Misalnya kelurahan, kode pos, tingkat pendidikan, dan lainnya. Untuk mengubah data master biasanya tidak ada proses bisnis khusus. User langsung saja membuka datanya, kemudian mengedit isinya, dan tekan tombol save.
* transaksi : fitur pencatatan transaksi bisnis. Di sini biasanya ada berbagai aturan bisnis yang rumit seperti penambahan/pengurangan stok, perhitungan pajak, dan lain sebagainya
* laporan : rekap dan aggregasi dari data transaksi. Umumnya ada fitur pencarian berdasarkan tanggal, jumlah total, dan sejenisnya. Biasanya juga ada fitur export ke berbagai format file (CSV, XLS, PDF)
* personalisasi / konfigurasi : fitur untuk memudahkan user. Contohnya daftar menu favorit, mengganti email / no handphone, tema warna, dan lain sebagainya
* utilitas / administrasi : fitur untuk pemeliharaan aplikasi. Misalnya backup/restore.

Untuk membuat daftar fitur biasanya kita mulai dari fitur transaksi. Setelah itu, kita tentukan master data apa saja yang dibutuhkan tiap transaksi. Selanjutnya, laporan-laporan yang dapat dibuat dari berbagai transaksi. Terakhir baru kita identifikasi fitur personalisasi dan utilitas.

Berikut adalah daftar fitur aplikasi perpustakaan:

```
* Transaksi

    * Registrasi Anggota
    * Berhenti jadi anggota
    * Peminjaman
    * Pengembalian
    * Booking
    * Buku baru (beli, hibah, dsb)
    * Penghapusan buku (hilang, rusak, dsb)

* Master Data

    * Buku
    * Anggota
    * User
    * Group
    * Permission

* Laporan

    * Rekap Buku Masuk per Periode
    * Rekap Buku Dihapus per Periode
    * Rekap Peminjaman per Periode
    * Rekap Pengembalian per Periode
    * Histori Peminjaman dan Pengembalian per Anggota
    * Rekap Jumlah Buku
    * Rekap Anggota

* Personalisasi

    * Ganti Password
    * Ganti Email
    * Ganti HP
    * Pengaturan Notifikasi

* Utilitas

    * Backup
    * Restore
    * Import Data Anggota
    * Import Data Buku
```

Selanjutnya, berbekal daftar fitur di atas, kita bisa mulai membuat UI Mockup.

## UI Mockup ##

UI Mockup merupakan solusi murah meriah dan cepat untuk sinkronisasi pemahaman kita dan pemahaman user tentang aplikasi yang akan dibuat. Kalau kita tidak membuat UI mockup, kesalah pahaman kita baru diketahui setelah aplikasinya selesai dibuat. Ini akan memboroskan waktu dan tenaga.

Sebagai gambaran, untuk membuat UI mockup, satu orang bisa menyelesaikan 1 screen dalam waktu 5 menit. Sedangkan untuk mengimplementasikan screen tersebut dalam aplikasi, belum tentu selesai dalam 5 hari. Padahal screen tersebut belum tentu sesuai dengan kebutuhan user. Kan sayang kalau sudah dicoding 5 hari ternyata salah.

Untuk membuat UI Mockup, kita dapat menggunakan aplikasi [Pencil](http://pencil.evolus.vn/) yang gratis dan mudah digunakan. Aplikasi Pencil ini memiliki [berbagai template (stencil)](http://pencil.evolus.vn/Stencils-Templates.html) sesuai aplikasi yang akan kita buat, misalnya aplikasi desktop Windows, aplikasi desktop Linux, aplikasi web, aplikasi Android, dan sebagainya.

Ada beberapa pola umum dalam membuat aplikasi bisnis, yaitu:

* tampilan list
* form entri sederhana
* form entri header-detail
* lookup dialog

Untuk menyederhanakan pembahasan, kita hanya akan buat sebagian kecil saja screen dari aplikasi perpustakaan. Soalnya kalau kita buat semua, bisa-bisa artikel ini jadi satu buku sendiri ;)

Berikut daftar screen yang akan kita buat:

* Entri Anggota
* Entri Peminjaman
* Histori Peminjaman per Anggota

File Pencil dari UI Mockup di artikel ini bisa diunduh [di sini](../../downloads/aplikasi-perpustakaan.ep)

### Entri Anggota ###

Berikut adalah tampilan screen entri anggota.

[![Foto](https://lh4.googleusercontent.com/-1hcFb859pOI/U1acWK5Y8YI/AAAAAAAAFqw/KxhM_jXmybE/w771-h474-no/entri_anggota.png)](https://lh4.googleusercontent.com/-1hcFb859pOI/U1acWK5Y8YI/AAAAAAAAFqw/KxhM_jXmybE/w771-h474-no/entri_anggota.png)

Ada beberapa hal yang harus kita perhatikan di sini, yaitu:

* validasi input harus dilakukan, baik di sisi server maupun di sisi client.
* pesan error harus ditampilkan secara jelas

Pembahasan detailnya sudah kita jabarkan di [artikel sebelumnya](http://software.endy.muhardin.com/manajemen/aplikasi-prakarya-vs-aplikasi-production/), jadi tidak perlu kita ulangi lagi di sini.

Form entri anggota ini termasuk form entri sederhana. Pola ini biasanya dipakai untuk entri data master, seperti misalnya:

* Form Entri Buku
* Form Entri User
* dan lainnya

Selanjutnya, kita masuk ke form entri header detail yang lebih kompleks

### Entri Peminjaman ###

Hampir semua kegiatan transaksi dalam aplikasi bisnis bisa direpresentasikan dengan model header-detail. Apa itu model header-detail?

> Satu transaksi akan terdiri dari satu record header dan banyak record detail. Record detail memiliki relasi foreign key ke record header.

Sebagai contoh, kita lihat transaksi peminjaman. Satu kali pinjam, anggota bisa membawa banyak buku. Bagaimana representasinya?

Salah satu teknik yang sering saya gunakan dalam analisa dan desain aplikasi adalah `visualisasi dengan ilustrasi`. Kita buat contoh kasus yang menceritakan transaksi bisnis yang terjadi lengkap dengan datanya. Dengan menggunakan kasus konkrit, kita tidak perlu pusing membayangkan sesuatu yang abstrak. Ini adalah trik yang biasanya tidak diketahui programmer pemula sehingga mereka bingung gak tau mana ujung mana pangkal. Berikut contoh kasusnya.

```
Pada hari Senin 21 April 2014 pukul 13:45 
anggota bernama `Endy Muhardin` 
dilayani oleh petugas bernama `Anton Raharja` 
meminjam tiga buku sebagai berikut:

* Java Desktop
* Konsep dan Penggunaan Subversion
* Pengenalan PHP
```

> Bagaimana menyimpan data transaksi di atas dalam database?

Pertama, kita tentukan dulu headernya. Header adalah satu record yang menjadi induk dari transaksi di atas. Kita buat tabel `peminjaman_header` sebagai berikut

 id  | waktu               | id_petugas | id_anggota 
-----|---------------------|------------|------------
p001 | 2014-04-21 13:45:00 | u001       | u100


User dengan id `u001` adalah relasi foreign key ke tabel `master_user` yang berisi record `Anton Raharja`, sedangkan user dengan id `u100` adalah relasi foreign key ke tabel `master_user` yang berisi record `Endy Muhardin`.

Sesuai dengan prinsip `visualisasi dengan ilustrasi`, dalam mendesain tabel kita isikan juga datanya. Itu sebabnya tabel di atas tidak saya tampilkan seperti biasanya orang mendesain database seperti ini:

Nama Kolom | Tipe Data   | Atribut
-----------|-------------|-----------------------
id         | VARCHAR(32) | PRIMARY KEY
waktu      | DATETIME    | NOT NULL
id_petugas | VARCHAR(32) | FOREIGN KEY, NOT NULL
id_anggota | VARCHAR(32) | FOREIGN KEY, NOT NULL

Karena kalau kita tampilkan seperti di atas, kita terpaksa harus membayangkan sesuatu yang abstrak.

> Lalu apakah saya harus menggunakan visualisasi dengan ilustrasi seumur hidup saya?

Tentu tidak, nanti setelah membuat aplikasi production yang ke-sekian puluh, visualisasi ini sudah _terinstal_ dalam sistem operasi otak kita. Demikian juga dengan prinsip-prinsip normalisasi database, desain berorientasi objek, pola header-detail, dan sebagainya. Pada tahap ini, kita akan bisa coding sambil usernya menceritakan requirement aplikasi yang dia inginkan.

Tapi itu nanti, ada waktunya. Bila Anda masih membaca artikel ini, berarti belum waktunya ;) Sementara ini, jangan malas membuat ilustrasi. Bahkan mahasiswa saya di mata kuliah Pemrograman 1 harus membuat ilustrasi di spreadsheet pada waktu looping menampilkan bilangan prima.

Baiklah, kita kembali ke masalah header-detail. Kita sudah mencatat waktu transaksi, petugas, dan anggota. Sekarang kita akan mencatat buku apa saja yang dipinjam. Untuk itu, kita membuat tabel `peminjaman_detail` sebagai berikut

id    | id_header | id_buku 
------|-----------|---------
pd001 | p001      | b001
pd002 | p001      | b010
pd003 | p001      | b100

Seperti kita lihat pada tabel di atas, ketiga record berelasi ke record `p001` di tabel `peminjaman_header` yaitu pada kolom `id_header`. Kolom `id_buku` tentu kita sudah bisa menebak bahwa dia mengacu ke tabel `master_buku`.

Untuk memasukkan data header dan detail, berikut adalah screen entri transaksinya:

[![Foto](https://lh5.googleusercontent.com/-X3QeTFVgI04/U1adOQ65DlI/AAAAAAAAFrw/whTHBn110mw/w774-h588-no/entri_peminjaman.png)](https://lh5.googleusercontent.com/-X3QeTFVgI04/U1adOQ65DlI/AAAAAAAAFrw/whTHBn110mw/w774-h588-no/entri_peminjaman.png)

Berbeda dengan form input sederhana, form entri header-detail memiliki tabel di dalamnya. Tabel inilah yang memuat data detail, sedangkan form inputnya menampung data header.

Karena adanya input ke dalam tabel ini, maka kita membutuhkan screen tambahan, yaitu dialog. Dialog ini akan muncul begitu kita tekan tombol `Tambah`. Setelah muncul, kita pilih satu atau lebih (tergantung proses bisnis) record dalam dialog. Kemudian setelah selesai, dialognya akan tertutup dan record yang kita pilih masuk ke dalam tabel.

Berikut tampilan dialog untuk memilih buku yang akan dipinjam. Karena yang dipinjam bisa banyak buku, maka kita sediakan checkbox agar user tidak perlu membuka dialog berkali-kali.

[![Foto](https://lh3.googleusercontent.com/-lPHMx7VATXM/U1acVTFCtYI/AAAAAAAAFqg/xQYotfMd4Ns/w804-h420-no/dialog_tambah_buku.png)](https://lh3.googleusercontent.com/-lPHMx7VATXM/U1acVTFCtYI/AAAAAAAAFqg/xQYotfMd4Ns/w804-h420-no/dialog_tambah_buku.png)

Penggunaan dialog tidak terbatas hanya untuk entri detail. Dialog juga sebaiknya kita gunakan untuk data yang bersifat pilihan, kalau jumlah pilihannya lebih dari sepuluh record. Sebagai contoh, pada saat memilih anggota yang akan meminjam buku, tidak mungkin kita gunakan dropdown combo. Kalau anggotanya ada ribuan, usernya pasti kesulitan memilihnya. Apalagi dalam dropdown combo, informasi yang bisa ditampilkan terbatas. Paling hanya nama saja. Akan lebih mudah kalau kita sediakan dialog seperti ini

[![Foto](https://lh5.googleusercontent.com/-ZgeS9pGZH-Y/U1acVOVr9HI/AAAAAAAAFqc/5hmU6uXWMAY/w768-h414-no/dialog_cari_anggota.png)](https://lh5.googleusercontent.com/-ZgeS9pGZH-Y/U1acVOVr9HI/AAAAAAAAFqc/5hmU6uXWMAY/w768-h414-no/dialog_cari_anggota.png)


Pola header-detail ini berlaku untuk sebagian besar fitur transaksi. Mari kita ambil contoh lain, transaksi belanja di minimarket misalnya. Screennya seperti ini

[![Foto](https://lh3.googleusercontent.com/LQsOccTBJ6_nHzLHirLdybAv8CMZ_gl6lw3WGIEfpX8=w1280-no)](https://lh3.googleusercontent.com/LQsOccTBJ6_nHzLHirLdybAv8CMZ_gl6lw3WGIEfpX8=w1280-no)

Pada transaksi minimarket, ada tambahan data yaitu `quantity` untuk mengakomodasi orang beli permen 5 buah. Dialog tambah detailnya juga harus memiliki input field untuk `quantity`. Dan karena jumlah produknya ribuan, kita juga harus sediakan lookup dialog sekali lagi untuk memilih produk. 

Dialog tambah detail seperti ini bentuknya

[![Foto](https://lh5.googleusercontent.com/-fBQUV0F944w/U1acX5wjQ2I/AAAAAAAAFrM/5ZatJYsudL8/w666-h285-no/tambah_detail_minimarket.png)](https://lh5.googleusercontent.com/-fBQUV0F944w/U1acX5wjQ2I/AAAAAAAAFrM/5ZatJYsudL8/w666-h285-no/tambah_detail_minimarket.png)

Di situ ada tombol `Cari` yang bila diklik akan menampilkan dialog pilih produk seperti ini

[![Foto](https://lh6.googleusercontent.com/-lmToPoVQHZ0/U1acWmCjTsI/AAAAAAAAFq4/3mFYG1Cpz1o/w762-h402-no/dialog_cari_produk.png)](https://lh6.googleusercontent.com/-lmToPoVQHZ0/U1acWmCjTsI/AAAAAAAAFq4/3mFYG1Cpz1o/w762-h402-no/dialog_cari_produk.png)

Jadi, untuk mengentri satu detail, user akan membuka dialog dua tingkat: dialog entri quantity dan dialog pilih produk. 

Adapun tabel di database cukup kita tambahkan satu field quantity seperti ini

id    | id_header | id_produk | qty 
------|-----------|-----------|-----
pd001 | p001      | b001      |   1 
pd002 | p001      | b010      |   5 
pd003 | p001      | b100      |  12 


Bisa juga detailnya lebih dari satu, seperti screen transaksi servis motor/mobil. Ada komponen sparepart dan ada komponen jasa. Begini bentuknya

[![Foto](https://lh5.googleusercontent.com/-AFCYrZEZlWE/U1acY31B9wI/AAAAAAAAFrY/W3O2-B4mtyY/w598-h623-no/transaksi_servis_motor.png)](https://lh5.googleusercontent.com/-AFCYrZEZlWE/U1acY31B9wI/AAAAAAAAFrY/W3O2-B4mtyY/w598-h623-no/transaksi_servis_motor.png)

Skema databasenya berarti terdiri dari 3 tabel: `servis_header`, `servis_detail_sparepart`, dan `servis_detail_jasa`.

Selanjutnya, kita buat screen untuk rekap/laporan.

### Histori Peminjaman per Anggota ###

Di screen laporan, inputan yang paling sering dipakai adalah periode. Inputannya berupa tanggal mulai dan tanggal sampai. Contohnya, kita ingin menampilkan histori peminjaman buku salah satu anggota untuk 3 bulan terakhir, screennya seperti ini

[![Foto](https://lh5.googleusercontent.com/-UPULY4jYmVo/U1acXrfIiJI/AAAAAAAAFrE/IOenvvN8AzM/w867-h486-no/rekap_peminjaman.png)](https://lh5.googleusercontent.com/-UPULY4jYmVo/U1acXrfIiJI/AAAAAAAAFrE/IOenvvN8AzM/w867-h486-no/rekap_peminjaman.png)

Di situ kita lihat juga tombol `Cari`. Itu berfungsi untuk menampilkan dialog pencarian anggota, sama seperti pada screen transaksi peminjaman di atas.

Fitur yang biasa ada di tampilan rekap ini antara lain:

* pencarian transaksi dengan lebih spesifik. Misalnya menyebutkan buku yang dipinjam, jenis transaksi, nilai/jumlah tertentu, dan sebagainya
* paging bila datanya banyak, seperti telah dijelaskan di artikel terdahulu.
* sorting, biasanya diimplementasikan melalui kepala tabel yang bisa diklik. Misalnya kita ingin urut tanggal (baik transaksi baru di atas maupun sebaliknya), buku, dan lainnya.

## Langkah Selanjutnya ##

Setelah UI Mockup kita selesaikan, adakan sesi review bersama user untuk mendapatkan feedback. Setelah sepakat dengan user (untuk proyek komersial bisa juga disertai tanda tangan berita acara kesepakatan) barulah kita lanjutkan ke tahap desain skema database dan desain class/objek.

Banyak orang menyalah-artikan tahap desain dengan dokumen desain. Saya melakukan tahap desain aplikasi, tapi belum tentu membuat dokumen desain.

Proses desain kita lakukan dengan tujuan agar bisa melihat _the big picture_. Pada waktu mulai coding, perhatian kita akan terpusat ke satu function/method atau class saja. Ibaratnya masuk ke hutan, jarak pandang kita terbatas. Sangat mudah untuk tersesat, kita sudah implement fitur tertentu, ternyata tidak kompatibel dengan fitur selanjutnya.

Selain itu, dengan melihat _the big picture_, kita jadi tahu fitur mana yang penting dan mana yang _nice to have_. Jangan sampai kita menghabiskan waktu untuk mengimplementasikan fungsionalitas yang bersifat kosmetik saja, padahal fitur utama belum selesai.

Walaupun demikian, saya tidak membuat dokumen desain. Mengapa begitu? Jawabannya bisa disimak [di artikel ini](http://software.endy.muhardin.com/manajemen/dokumentasi-project/).

Proses mendesain skema database dan skema class/objek akan kita bahas pada artikel selanjutnya. Stay tuned.
