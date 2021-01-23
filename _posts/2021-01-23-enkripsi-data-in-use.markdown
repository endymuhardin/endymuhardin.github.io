---
layout: post
title: "Enkripsi Data in Use"
date: 2021-01-23 07:14
comments: true
categories: 
- aplikasi
---

Di tahun 2021 ini, layanan cloud storage sudah sangat banyak tersedia dengan harga murah. Walaupun sebetulnya bukan hal yang baru -- saya termasuk pengguna awal Yahoo! Briefcase sejak tahun 1999 -- akan tetapi paket yang ditawarkan saat ini sudah sangat murah dan besar kapasitasnya. Saya juga termasuk pengguna awal Dropbox, kemudian banyak mendapatkan downline, sehingga sekarang punya kapasitas 8GB gratis.

Kemudahan dan otomasi aplikasi layanan cloud storage ini membuat penggunanya, termasuk saya, cenderung abai terhadap keamanan dan privasi data. Kita cenderung terlalu percaya kepada penyedia layanan untuk menjaga data pribadi kita dengan aman. Sehingga kita dengan tenang meletakkan banyak data-data rahasia seperti misalnya scan identitas, foto-foto anggota keluarga (dengan pakaian 'rumahan'), dokumen perusahaan, dan berbagai file lain yang tentu kita tidak ingin terlihat orang lain.

Pada [artikel sebelumnya]({% post_url 2021-01-19-simplifikasi-prosedur-backup %}), kita sudah membahas solusi enkripsi untuk file arsip. File arsip (atau archive dalam bahasa Inggris), adalah file lama yang kita keluarkan dari penyimpanan utama dan disimpan di penyimpanan jangka panjang. Analoginya seperti menyimpan barang yang jarang dipakai dari ruang tamu ke gudang. Berbeda dengan file backup, yang merupakan data yang masih sering dipakai sehari-hari, yang kita buatkan copy-nya supaya ada cadangan. Foto-foto lama saya arsip, dipaketkan menjadi satu folder, dienkripsi, dan kemudian disimpan di penyimpanan jangka panjang seperti Amazon Deep Glacier. Data seperti ini dikenal dengan istilah [data at rest](https://en.wikipedia.org/wiki/Data_at_rest).

Nah kali ini kita akan membahas pengamanan data yang masih sering kita pakai sehari-hari seperti dokumen bisnis, foto-foto keluarga yang baru diambil, scan identitas, data penting client, dan file-file lain yang bersifat rahasia, tapi mobilitasnya tinggi. Data seperti ini dikenal dengan istilah [data in use](https://en.wikipedia.org/wiki/Data_in_use).

Ada satu jenis data lagi, yaitu data yang sedang berpindah dari satu komputer ke komputer lain. Ini dikenal dengan istilah [data in transit](https://en.wikipedia.org/wiki/Data_in_transit). Inipun sudah kita jelaskan cara pengamanannya di [seri VPN di artikel terdahulu]({% post_url 2020-12-25-vpn-wireguard-01-intro %}) dan [berbagai]({% post_url 2018-02-12-deployment-microservice-kere-hore-1 %}) [artikel]({% post_url 2017-09-14-letsencrypt-manual-dns %}) [tentang]({% post_url 2013-07-12-memasang-sertifikat-ssl %}) [SSL]({% post_url 2013-07-08-apa-itu-ssl %}).

_Data in use_ ini biasanya ada di laptop, pc, smartphone, dan juga flashdisk atau external harddisk. Karena perangkat ini mobilitasnya tinggi, maka resiko berpindah tangan juga tinggi. Coba pikir, seberapa mudah kita meminjamkan harddisk eksternal atau flashdisk ke orang lain? Umumnya ya kita akan berikan ke orang lain tanpa pikir panjang. Bagaimana kalau file rahasia tersebut dicopy orang? Belum lagi kemungkinan laptop atau smartphone dicuri orang. Kalau datanya tidak terenkripsi, orang jahat akan dengan mudah membaca data tersebut.

<!--more-->

Ada banyak aplikasi untuk mengenkripsi data seperti ini. Akan tetapi, biasanya bisa dikelompokkan menjadi dua kategori utama:

* Full Disk Encryption (FDE)
* File Based Encryption

Full disk encryption adalah solusi untuk mengenkripsi keseluruhan disk (harddisk ataupun flashdisk). Kita format dulu disk kosong dengan filesystem terenkripsi, kemudian kita _mount_ disk tersebut agar terlihat dalam bentuk tidak terenkripsi. Pada waktu melakukan _mount_, kita akan diminta password untuk membuka enkripsi. Setelah dimount, kita bisa baca tulis file seperti biasa. Setelah selesai dipakai, kita _unmount_ disk tersebut. Bila disk tersebut dipasang di komputer dan penggunanya tidak bisa memasukkan password yang sesuai, maka seluruh isi disk tidak akan terbaca.

Full disk encryption ini cocok digunakan untuk partisi utama di perangkat yang kita gunakan, seperti harddisk laptop, pc, ataupun smartphone. Partisi utama ini sekali dibuka, dipakai sepanjang perangkat hidup dan dipakai. Setelah perangkat dimatikan, otomatis dia unmount dan tidak akan terbaca. Jadi disk kita aman, walaupun perangkatnya dibuka dan disknya dipasang di komputer lain, datanya tidak akan bisa dibaca.

Beberapa aplikasi full disk encryption yang populer diantaranya:

* FileVault : aplikasi FDE bawaan MacOS
* eCryptFS : dulu saya pakai ini waktu laptopnya masih Ubuntu
* LUKS : opsi default FDE di Ubuntu saat ini (20.04)

Buat yang pakai Windows, silahkan dicari sendiri ya ... 
Atau ya pindah Ubuntu atau MacOS ajalah :D 

FDE walaupun sangat seamless (tidak terasa pemakaiannya) untuk partisi harddisk, dia kurang cocok untuk enkripsi folder per folder. Misalnya kita punya 10 folder yang tersinkronisasi ke Dropbox, 2 folder diantaranya berisi data rahasia. Kita tidak bisa menggunakan FDE untuk keperluan ini. Untuk itu, kita butuh solusi lain, yaitu FBE (file based encryption). FBE bisa mengenkripsi satu folder (berikut isinya) saja. 

Aplikasi FBE bekerja di level file. Kalau dalam satu folder ada 15 file, maka di hasil enkripsi akan ada 15 file juga. Contohnya, ini folder dalam kondisi tidak terenkripsi

[![Folder tidak terenkripsi]({{site.url}}/images/uploads/2021/enkripsi-fbe/folder-plain.png)]({{site.url}}/images/uploads/2021/enkripsi-fbe/folder-plain.png)

dan ini hasil enkripsinya

[![Folder terenkripsi]({{site.url}}/images/uploads/2021/enkripsi-fbe/folder-encrypted.png)]({{site.url}}/images/uploads/2021/enkripsi-fbe/folder-encrypted.png)

Aplikasi FDE ini cocok diterapkan untuk layanan cloud storage yang otomatis mensinkronisasi folder tertentu, seperti Dropbox. Kita bisa menaruh folder yang terenkripsi di folder Dropbox. Bila kita butuh filenya, kita bisa decrypt dan mount ke folder lain. Bila kita mengubah isi folder yang dimount, maka folder terenkripsinya akan langsung berubah juga. Tapi ingat, jangan mount-decrypt ke folder dalam Dropbox, supaya tidak disync sama dia ke cloud.

[![Proses Enkripsi]({{site.url}}/images/uploads/2021/enkripsi-fbe/proses-enkripsi.gif)]({{site.url}}/images/uploads/2021/enkripsi-fbe/proses-enkripsi.gif)

Ada beberapa pilihan untuk aplikasi FBE, diantaranya:

* Cryptomator
* GoCryptFS
* EncFS
* CryFS

Silahkan dipilih tools mana yang kira-kira cocok dengan selera Anda. Saat ini saya sedang explore Cryptomator dan GoCryptFS. So far GoCryptFS terlihat paling menarik.

Selamat mencoba, semoga bermanfaat ...