---
comments: true
date: 2011-08-26 16:00:29
layout: post
slug: backup-home-folder
title: Backup Home Folder
wordpress_id: 770
categories:
- linux
---

Seberapa penting file di komputer kita? Tentu tidak ternilai harganya. Tapi apakah kita melakukan backup secara terhadap file-file di komputer kita? Beberapa menit yang lalu, saya menjawab tidak untuk pertanyaan tersebut.

Kenapa backup tidak dilakukan? Penyebab utamanya biasanya adalah karena merepotkan. Kita harus pilih file yang mau dibackup, membuka aplikasi backup, lalu menjalankannya. Walaupun cuma butuh waktu beberapa menit, tapi biasanya kita sering menunda dan akhirnya lupa.

Cara paling efektif untuk melakukan backup rutin adalah dengan mengotomasinya. Effort untuk melakukan setup cukup sekali saja, selanjutnya backup akan berjalan otomatis tanpa kita sadari. Pada artikel ini, saya akan posting teknik backup yang saya gunakan.


Sebelum kita mulai, terlebih dulu kita tentukan requirementnya, supaya jelas apa yang kita ingin capai. Saya ingin membackup folder tertentu di komputer saya (misalnya _/home/endy_ dan _/opt/multimedia/Photos_). Backup ini dilakukan secara rutin (misalnya satu jam sekali, satu hari sekali, atau satu minggu sekali). Selain rutin, juga harus incremental. Artinya kalau saya punya backup hari ini jam 11, maka backup selanjutnya di jam 12 hanya menyimpan file yang berubah saja. Dengan demikian, saya bisa jalankan backupnya satu jam sekali dan tidak akan menyebabkan harddisk menjadi penuh dalam beberapa jam saja.


<!--more-->

Kalau kita cari di Google dengan keyword _ubuntu backup application_, ada banyak sekali aplikasi backup yang tersedia.
Ada Unison, Bacula, SBackup, rdiff-backup, Deja Dup, dan [entah apa lagi](http://davestechshop.net/ListOfFreeOpenSourceLinuxUbuntuBackupSoftware). Walaupun demikian, seperti biasanya, saya akan gunakan aplikasi yang paling populer, universal (ada di mana-mana), dan bisa dijalankan dari command line (supaya bisa diotomasi dengan cron). Pilihannya tentu adalah _rsync_.

_rsync_ adalah aplikasi untuk melakukan file transfer. Dia memiliki beberapa kelebihan, diantaranya :



    
  * tersedia di semua *nix (misalnya Linux dan Mac)

    
  * berbasis command line, sehingga bisa saya aplikasikan juga di server

    
  * sudah teruji kehandalannya

    
  * bisa resume (bila transfer putus di tengah jalan, tidak perlu ulang dari awal)

    
  * data yang ditransfer bisa dikompres, supaya lebih cepat

    
  * bisa mengirim data melalui ssh, sehingga keamanan data terjamin

    
  * memiliki kemampuan hard linking sehingga bisa menghemat space (akan dijelaskan lebih lanjut)



With great power, comes great complexity. Demikian kata pamannya Spiderman seandainya dia harus menggunakan _rsync_. Saking banyaknya opsi, sehingga kita bingung apa yang harus dipakai. Berikut adalah opsi rsync yang saya gunakan :




    
  * a : archive. Opsi ini sama dengan kalau kita mengaktifkan opsi rlptgoD

    
  * r : rekursif sampai ke subfolder terdalam

    
  * l : symlink tetap dicopy sebagai symlink

    
  * p : file permission disamakan dengan aslinya

    
  * t : modification time (waktu terakhir update) disamakan dengan aslinya

    
  * g : kepemilikan group disamakan dengan aslinya

    
  * o : kepemilikan owner disamakan dengan aslinya

    
  * D : file device dan special disamakan dengan aslinya

    
  * force : folder kosong di tujuan dihapus walaupun ada isinya

    
  * ignore-errors : lanjut terus walaupun ada error

    
  * exclude-from : file text berisi daftar file/folder yang tidak perlu ditransfer

    
  * link-dest : lihat ke folder yang disebutkan, kalau ada file yang sama, buat hard link




Pada penjelasan di atas, beberapa kali disebutkan istilah hard-link. Di Linux, suatu file terdiri dari dua bagian : isi (content), dan nama. Satu content yang sama bisa saja memiliki dua nama yang berbeda di folder berbeda sehingga terlihat seolah-olah ada dua file.
Misalnya, kita memiliki file bernama _coba.txt_. Ini artinya, ada satu content dan satu nama file coba.txt. Kita bisa membuat nama file baru yang isinya sama dengan perintah sebagai berikut

___ln coba.txt halo.txt_

Perintah di atas akan membentuk file _halo.txt_ yang isinya sama dengan _coba.txt_. Kalau kita edit _coba.txt_, maka isi file _halo.txt_ juga akan berubah, karena mereka sebetulnya menunjuk ke benda yang sama.

Dengan menggunakan hard-link ini, kita bisa menduplikasi file tanpa menduplikasi space di harddisk. Ini akan sangat berguna untuk membuat incremental backup, karena kita bisa membuat backup sesering mungkin tanpa memenuhi isi harddisk.

Fitur ini kita gunakan pada _rsync_ dengan opsi _link-dest_. Sebagai contoh, kita jalankan backup pertama kali dan menghasilkan folder _20110826-1100_. Pada waktu kita jalankan backup kedua, kita berikan opsi _link-dest=20110826-1100_. Saat akan mengisi folder yang baru (misalnya _20110826-1200_), _rsync_ akan melihat ke folder _20110826-1100_ dan memeriksa apakah file yang sama sudah ada. Bila sudah ada, maka _rsync_ tidak akan menulis file baru, melainkan hanya akan membuat hard-link saja. Jadi, bila backup pertama berisi 100 file dengan total 10 GB, dan backup kedua berisi 99 file yang sama, dan 1 file saja yang berubah dengan ukuran 1 GB, maka total space yang terpakai adalah 10 GB (backup pertama) dan 1 GB (backup kedua), bukannya 20 GB.

Setelah kita memahami opsi _rsync_, berikut adalah perintah yang kita gunakan

{% gist 1172978 rsync-cmd.txt %}

File _rsync-exclude.txt_ berisi folder yang tidak dibackup, punya saya isinya seperti ini :

{% gist 1172978 rsync-exclude.txt %}

_folder-backup-sebelumnya_ perlu dihitung dulu. Caranya menggunakan perintah _ls -tr_ yang akan menampilkan isi folder yang diurutkan berdasarkan modification time secara descending. Berikut contoh outputnya.

{% gist 1172978 ls-ltr-output %}

Dari sini, kita cukup ambil yang paling atas menggunakan perintah _tail -1_

{% gist 1172978 ls-ltr-tail %}

Dengan bermodalkan pengetahuan tersebut, kita bisa membuat script seperti ini.

{% gist 1172978 rsync-backup.sh %}

Untuk membackup folder _/home/endy_ ke folder _/opt/downloads/backups_, kita jalankan seperti ini :

{% gist 1172978 exec-backup.sh %}

Selanjutnya, kita bisa pasang di crontab dengan setting seperti ini, supaya dijalankan tiap tiga jam.

{% gist 1172978 crontab.txt %}

Voila ... folder home kita sudah terbackup secara otomatis tanpa kita sadari. Sepanjang menulis artikel ini, laptop saya sudah membackup dirinya sendiri sebanyak 3 kali :D

Setelah membuat backup di harddisk laptop, tentunya kita ingin memindahkannya ke external harddisk supaya kita bisa mengosongkan lokasi backup di laptop. 

Berikut adalah perintah rsync yang digunakan. 

{% gist 1172978 copy-backup-to-external.sh %}

Dan ini adalah penjelasan terhadap opsi yang digunakan: 



    
  * P : sama dengan partial dan progress

    
  * partial : file yang baru dicopy sebagian tetap disimpan agar bisa diresume

    
  * progress : menampilkan progress report

    
  * H : hard link dicopy sebagai hard link juga. Tanpa opsi ini, tiap hard link akan dibuatkan file baru sehingga boros space harddisk



Perintah untuk transfer ke external harddisk ini tidak saya jalankan secara otomatis via cron, karena harddisknya belum tentu terpasang. 

Demikianlah artikel tentang backup rutin. Mudah-mudahan kita semua bisa terhindar dari musibah harddisk. 



### Referensi





    
  * [Easy Automated Snapshot-Style Backups with Linux and Rsync](http://www.mikerubel.org/computers/rsync_snapshots)

    
  * [Simple backup using rsync](http://www.hermann-uwe.de/blog/simple-backups-using-rsync)

    
  * [rsync examples](http://rsync.samba.org/examples.html)



