---
comments: true
date: 2019-08-12 21:14:22
layout: post
slug: masih-database-transaction-lagi
title: 2019 Masih Debat Database Transaction?
categories:
- programming
---

Beberapa waktu yang lalu, salah satu seleb programmer di Yutub bikin video yang menyatakan bahwa pengetahuan tentang database transactional itu wajib bagi senior programmer. 

`<grammar-police>`
Well, sebelumnya saya koreksi dulu, yang tepat adalah `database transaction`, bukan `transactional`. Kalopun mau pakai akhiran `al`, maka yang pas itu `transactional database`. 
`</grammar-police>`


Netijen pun bereaksi keras Maklumlah namanya juga netijen, bebas aja. Di antara komentar netijen, ada satu yang tertangkap mata saya. Itupun karena ditag. Berikut komentarnya, 

> Yaa kenapa gitu? Ada aja kok senior software developer gatahu dependency injection, github repo, sama continous integration tapi bikin programnya jago dan enak dibaca. Jangan main nge judge gitu lah statement nya

Sebetulnya saya tidak mau menanggapinya. Sudah pernah saya tulis masalah ini 8 tahun yang lalu [di blog ini juga](https://software.endy.muhardin.com/java/database-transaction/). Silahkan dibaca.


Tapi apa boleh buat, saya sudah ditag, dan sebagai sesama netijen jaman now sudah sepantasnya kalau kita bersikap julid, FOMO, dan YOLO. 

Dan lagipula, ini blog sudah lama gak diupdate, jadi mumpung ada bahan, here we go.

<!--more-->

> Kata iklan, "Tua itu pasti, dewasa itu pilihan"

Berlaku juga di dunia pemrograman. Makin lama kita makin tua. Tidak bisa dihindari. Sedangkan perkembangan teknologi berjalan terus. Pilihan kita mau mengikuti atau tidak.

Dari sekian banyak teknologi baru, memang banyak yang hanya hype saja. Trend sesaat yang setahun dua tahun meredup lagi. Tapi ada juga yang memang bisa meningkatkan kualitas hidup dan produktifitas kita. Beberapa di antaranya malah fatal kalau tidak kita pakai. 

Untuk mudahnya, saya klasifikasikan hal-hal yang disebutkan di atas menjadi beberapa kategori berdasarkan konsekueksi kalau kita tidak pakai :

* Fatal
* Rugi besar
* Tidak masalah

Mari kita bahas satu persatu.

## Database Transaction ##

Ini termasuk kategori fatal bila tidak dipakai, apalagi tidak paham. Coba lihat pseudocode untuk transfer uang senilai `1.000.000` dari rekening `10001` ke rekening `20002` berikut ini:

```sql
1 update rekening set saldo = saldo - 1000000 where nomor = '10001';
2 insert into mutasi (id_rekening, nilai, debet_kredit) 
  values ('10001', 1000000, 'kredit');
3 update rekening set saldo = saldo + 1000000 where nomor = '20002';
4 insert into mutasi (id_rekening, nilai, debet_kredit) 
  values ('20002', 1000000, 'debet');
```

Database transaction gunanya untuk membuat 4 perintah di atas menjadi satu kesatuan. Bila satu gagal, maka 3 sisanya akan dibatalkan. Ini istilahnya `atomic`. Sukses semua, atau gagal semua. Tidak boleh sukses sebagian.

Bila baru jalan nomor 1, terjadi kegagalan (aplikasi crash, harddisk server penuh, mati listrik, jaringan putus, dsb), maka pada waktu aplikasi dibuka, saldo `10001` tidak boleh berkurang. 

Kalau ada bank yang ketahuan tidak memproses 4 perintah tadi secara `atomic`, kira-kira apakah Anda mau menabung di sana?

Contoh di atas baru melibatkan satu tabel database. Bagaimana lagi kalau aplikasi belanja online? Kira-kira begini pseudocodenya:

```sql
insert into penjualan;
update stok set jumlah = jumlah - penjualan where produk = 'mainan-gundam';
insert into tagihan;
```

Ada tiga tabel yang terlibat di sana. Bagaimana kalau kita tidak usah paham, apalagi pakai transaction?

Silahkan dijawab sendiri lah.

## Transaction Isolation ##

Sebetulnya transaction saja belum cukup lho. Masih ada lanjutannya, transaction isolation. Tapi ini panjang lagi urusannya. Nanti insya Allah kalau ada umur dan waktu, saya buatkan videonya aja.

Sama seperti database transaction, urusan isolation ini termasuk yang fatal untuk tidak dipahami. Saya baru saja menemui aplikasi yang selisih uang ratusan juta gara-gara urusan ini. Nah, kalo sudah begini, siapa yang mau nalangi?

## Version Control ##

Ini tidak fatal seperti transaction, cuma rugi besar bila tidak pakai. Tanpa version control, konsekuensinya :

### Kita tidak bisa kerja bareng orang lain ###

Ada satu file, `proses_order.php`, isinya 10 function. Kita mengerjakan `function cek_stok`, teman kita mengerjakan `function proses_pembayaran`. Kedua function ada di file yang sama, tapi lokasinya berbeda. Satu di atas, satu di bawah. 

Tanpa version control, gimana menggabungkannya?

Gimana kalau satu fitur (misal: registrasi user) melibatkan 10 file dan dikerjakan 4 orang?

Good luck ...

### Kita tidak bisa kerja paralel ###

Aplikasi kita sudah rilis ke production, dipakai orang banyak. Kemudian kita mau lanjut development ke versi berikutnya. Sedang asyik-asyik coding, sudah beberapa fitur dibuat, tiba-tiba ada laporan bug di aplikasi yang jalan di production. 

Nah, bagaimana kita memperbaiki bug production? Tentunya harus di versi yang dideploy di production, tidak bisa di versi yang sedang kita kerjakan. 

Katakan saja kita punya file zip, berisi versi yang sudah naik production. Kita extract, perbaiki bugnya. Ada 15 file yang terdampak. 

Selanjutnya, bagaimana memasang fix di 15 file tersebut ke versi yang sekarang sedang kita kerjakan? Padahal di versi sekarang, sudah ada juga perubahan di 15 file tersebut.

Good luck ... 

Masih banyak lagi kerugian kalau kita tidak pakai version control. Padahal cukup investasi waktu 1-2 hari [nonton video tutorialnya](https://www.youtube.com/playlist?list=PL9oC_cq7OYbwhs_x2S_Vv9VFRKnoXs8hn), sudah bisa pakai.

## Continuous Delivery ##

Okelah, yang satu ini termasuk barang mewah. Kalau version control saja belum pakai, ya udah gak usah bahas CI/CD. 

## Dependency Injection (DI) ##

Mengenai dependency injection sudah pernah saya tulis [di sini](https://software.endy.muhardin.com/java/memahami-dependency-injection/) dan ada videonya juga [di sini](https://www.youtube.com/watch?v=I7g3pkQaZWs&list=PL9oC_cq7OYbyhdZmCECQqp7OcS8J5QpAo&index=10). Silahkan disimak dulu biar paham.

DI ini adalah teknik atau tips cara kita mengatur interaksi antar class/object/function/method dalam aplikasi kita. Jaman sekarang, hampir di semua lini pemrograman -- server side, client side, frontend, backend, mobile, desktop -- banyak mengadopsi teknik DI. 

Tidak termasuk fatal bila tidak paham DI. Tapi rugi besar, karena:

* Sulit memahami framework populer yang banyak dipakai orang. Ini akan mempengaruhi nilai jual kita sebagai programmer.
* Ada banyak fitur atau teknik turunan / lanjutan yang dibangun di atas DI, misalnya Aspect Oriented Programming, Object Composition, Configurability, dan sebagainya. Dengan teknik-teknik ini, kode program kita akan semakin rapi dan mudah dimaintain.

# Penutup #

Sebagai penutup, mari kita bahas pernyataan ini.

> Ada aja kok senior software developer gatahu dependency injection, github repo, sama continous integration tapi bikin programnya jago dan enak dibaca.

Mungkin ada, walaupun saya pribadi belum pernah kenal senior programmer seperti ini. 

Tapi perlu kita tahu, pemrograman di jaman sekarang berbeda sekali daripada jaman VB6, Delphi, dan C/C++ dulu. Aplikasi yang kita buat di jaman itu:

* mayoritas (estimasi kasar 50%-80%) bikinan kita sendiri. Bahkan untuk memformat 100000000 menjadi 100.000.000 saja kita buat sendiri functionnya.
* pengerjaan aplikasi dikerjakan sendiri. Jangankan update status di smartphone. Lha telponnya aja masih diputar, belum dipencet, apalagi disentuh

[![Telepon Dial]({{site.url}}/images/uploads/2019/database-transaction/telpon-putar.jpg)](https://www.amazon.com/Vintage-Antique-Telephone-Fashioned-Landline/dp/B07DDCR6BC)

Gambar boleh minjam dari [Amazon](https://www.amazon.com/Vintage-Antique-Telephone-Fashioned-Landline/dp/B07DDCR6BC)

Beda dengan jaman now. Aplikasi yang saya buat di tahun 2019 ini, biasanya ukuran yang dideploy berkisar di 60-80 MB. Kode program yang saya tulis sendiri? Biasanya tidak lebih dari 2-5 MB saja.

Demikian juga, satu aplikasi bisa dikeroyok pengerjaannya 2-10 orang. Berada di lokasi yang berbeda. Jangankan tempatnya, kota atau bahkan negaranya juga berbeda. Belum lagi timezonenya juga berbeda. Programmer #1 sudah tidur ketika programmer #2 baru membuka editor.

Nah, jadi kalo sudah tahun 2019, masih tidak mau paham database transaction, version control, dependency injection, mungkin sebaiknya segera order telpon putar di Amazon ;P 