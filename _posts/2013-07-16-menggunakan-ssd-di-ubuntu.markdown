---
layout: post
title: "Menggunakan SSD di Ubuntu"
date: 2013-07-16 13:40
comments: true
categories: 
- linux
---

Beberapa minggu yang lalu, saya mengganti harddisk menjadi SSD (Solid State Disk). 
Pengaruhnya sangat signifikan, dari tekan tombol power sampai desktop siap digunakan hanya makan waktu < 10 detik.
Sebelumnya juga tidak terlalu lama, tapi masih berkisar di atas 1 menit. Demikian juga setelah login, menyalakan Google Chrome, hanya sekejap mata browser sudah tampil. Sebelumnya butuh waktu 5-10 detik.

Pemasangan harddisk tidak jauh berbeda dengan proses instalasi harddisk pada umumnya. Tinggal lepas harddisk lama, dan pasang yang baru. Walaupun demikian, ada beberapa tuning yang harus kita lakukan berkaitan dengan karakteristik SSD, yaitu:

* optimasi file/folder temporary
* mengganti scheduler
* optimasi proses hapus

<!--more-->

## Opsi atime ##

Pada waktu awal dikeluarkan, SSD sudah memiliki karakteristik baca-tulis yang sangat cepat, karena tidak ada bagian bergerak (moving parts) di dalamnya. Walaupun demikian, ada kekurangan SSD (dan juga flashdisk USB yang biasa kita gunakan) yaitu umur pakainya yang relatif pendek. Semakin sering ditulis dan dihapus, maka umurnya semakin pendek.

Karena keterbatasan tersebut, maka ada beberapa [tips tuning Linux](http://askubuntu.com/questions/1400/how-do-i-optimize-the-os-for-ssds) supaya dia tidak terlalu sering tulis-hapus, yaitu:

* mematikan fungsi `atime`. Fungsi `atime` gunanya untuk mengupdate keterangan di file dan folder, menunjukkan kapan dia terakhir diakses.
* memindahkan file temporary dan logfile ke memori sehingga tidak menulis ke harddisk. 

Seiring perkembangan teknologi, keterbatasan umur SSD ini sudah berhasil diatasi. [Sebuah percobaan di tahun 2007](http://www.storagesearch.com/ssdmyths-endurance.html) membuktikan bahwa bila kita melakukan tulis-hapus-tulis-hapus dengan kecepatan 80Mbps 24 jam sehari, maka SSD bisa bertahan sampai 51 tahun. Itu percobaan tahun 2007, tentu di tahun 2013 ini SSD sudah semakin baik. Lagipula dalam kurun waktu tersebut kita pasti akan mengganti harddisk. Bukan karena rusak, melainkan karena sudah tidak muat lagi menampung segala macam foto, musik, video yang kita miliki. Seperti halnya di tahun 2000, kita sudah merasa cukup dengan floppy disk 1,4 MB :)

Jadi sebetulnya kita tidak perlu khawatir lagi, khususnya dengan fungsi `atime` pada Linux.

Bagi yang masih khawatir, bisa mematikan fungsi `atime` ini pada file `/etc/fstab` dengan menambahkan opsi `noatime`. Berikut isi file `/etc/fstab` yang asli

```
# / was on /dev/sda1 during installation
UUID=a7c6516b-b6c7-481a-b85f-5297f6ffcbbb        /     ext4    errors=remount-ro 0  1
# /home was on /dev/sda6 during installation
UUID=0dfcd40a-28bd-4d7f-8e41-4ab85ef776fa        /home ext4    defaults          0  2
```

Dan ini yang telah ditambahi opsi `noatime`

```
# / was on /dev/sda1 during installation
UUID=a7c6516b-b6c7-481a-b85f-5297f6ffcbbb        /     ext4    noatime,nodiratime,errors=remount-ro 0   1
# /home was on /dev/sda6 during installation
UUID=0dfcd40a-28bd-4d7f-8e41-4ab85ef776fa        /home ext4    noatime,nodiratime,defaults          0   2
```

Tapi sekali lagi saya tekankan bahwa ini tidak perlu. Selain umur pakai SSD yang sudah dijelaskan di atas, juga optimasi di sisi Linux sendiri. Secara default, [Linux masa kini menggunakan opsi `relatime` yang lebih cerdas daripada `atime`](http://askubuntu.com/questions/2099/is-it-worth-to-tune-ext4-with-noatime).


## Temporary File/Folder ##

Optimasi ini bermanfaat tidak cuma untuk harddisk SSD. Intinya, file temporary yang biasanya ada di folder `/tmp` dan berbagai log aplikasi yang ada di `/var/log` akan kita pindahkan ke RAM. Akses baca-tulis dari RAM jauh lebih cepat daripada disk. Konsekuensinya, file yang dipindah ke memori ini akan hilang pada waktu komputer direstart. Untuk komputer desktop tidak masalah karena kita jarang menggunakan logfile. Tapi ini menjadi masalah buat server, karena logfile berguna untuk kebutuhan analisa dan troubleshooting bila terjadi masalah.

Untuk memindahkan kegiatan baca-tulis folder `/tmp` dan `/var/log` dari harddisk ke memori, tambahkan baris berikut di `/etc/fstab`

```
tmpfs  /tmp            tmpfs   defaults,noatime,mode=1777 0 0
tmpfs  /var/spool      tmpfs   defaults,noatime,mode=1777 0 0
tmpfs  /var/log        tmpfs   defaults,noatime,mode=0755 0 0
```

Entri yang ada labelnya `tmpfs` artinya akan disimpan di RAM.

Semua file dan folder yang bersifat sementara bisa kita pindahkan ke `tmpfs`. Beberapa orang juga menaruh `/var/cache/apt/archives` (berisi file `*.deb` yang diunduh selama proses instalasi) dalam `tmpfs` agar tidak bikin penuh harddisk. Saya tidak melakukannya karena membutuhkan file ini untuk keperluan [upgrade dan replikasi instalasi]. 

Walaupun demikian, folder `/var/tmp` jangan disimpan di `tmpfs`, karena dia [berbeda dengan file temporary lainnya](http://linuxers.org/article/differences-between-tmp-and-vartmp)

## I/O Scheduler ##

Linux secara default menganggap kita menggunakan harddisk tradisional. Dia menggunakan sistem antrian (scheduler) [CFQ](http://en.wikipedia.org/wiki/CFQ), mendahulukan request yang lokasinya terdekat dengan posisi jarum harddisk (sehingga lebih cepat). Karena SSD tidak pakai jarum, akses ke semua tempat dalam disk kecepatannya sama, sehingga tidak perlu diatur seperti CFQ. Untuk itu, kita bisa gunakan scheduler [deadline](http://en.wikipedia.org/wiki/Deadline_scheduler) yang lebih cepat.

Posisi scheduler yang sedang aktif bisa dilihat dengan perintah berikut

```
cat /sys/block/sda/queue/scheduler
```

Outputnya di Ubuntu saya seperti ini

```
noop [deadline] cfq
```

Artinya yang sedang aktif adalah `deadline`, dan pilihan lain yang tersedia adalah `noop` dan `cfq`. Entah kenapa, Ubuntu sudah memilih `deadline` secara default, sehingga saya tidak perlu melakukan konfigurasi tambahan. Namun bila kondisinya berbeda di komputer Anda, tambahkan dua baris ini di akhir file `/etc/rc.local` di atas baris `exit 0`

```
echo deadline > /sys/block/sda/queue/scheduler
echo 1 > /sys/block/sda/queue/iosched/fifo_batch
```

Ganti `sda` dengan nama device harddisk Anda.

## Optimasi Proses Hapus ##

Harddisk SSD memiliki [fitur TRIM](http://en.wikipedia.org/wiki/TRIM) yang memungkinkan SSD mencatat blok mana yang sudah tidak terpakai (karena filenya dihapus), sehingga bisa digunakan lagi oleh file lain. Fitur TRIM ini bisa dilakukan secara otomatis maupun secara manual. 

Untuk mengaktifkan TRIM otomatis, tambahkan opsi `discard` di `/etc/fstab` seperti ini

```
# / was on /dev/sda1 during installation
UUID=a7c6516b-b6c7-481a-b85f-5297f6ffcbbb       /       ext4    discard,errors=remount-ro 0  1
# /home was on /dev/sda6 during installation
UUID=0dfcd40a-28bd-4d7f-8e41-4ab85ef776fa       /home   ext4    discard,defaults          0  2
```

Walaupun demikian, TRIM otomatis [kadangkala malah membuat lambat](https://patrick-nagel.net/blog/archives/337). Untuk itu, kadangkala kita perlu menjalankan trim secara manual dengan perintah berikut

```
sudo fstrim -v /
sudo fstrim -v /home
```

Perintah tersebut dijalankan untuk setiap partisi dalam harddisk SSD kita. Contohnya seperti di atas bila Anda seperti saya, memisahkan antara partisi `/` dan `/home`.

Kita juga bisa menjalankannya secara terjadwal menggunakan `cron`.
