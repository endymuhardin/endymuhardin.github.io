---
comments: true
date: 2021-01-18 07:00:00
layout: post
slug: ntfs-write-macos
title: Baca Tulis NTFS di MacOS
categories:
- mac
---

Beberapa bulan lalu, Apple merilis MacOS versi terbaru, yaitu Big Sur. Kebetulan laptop saya sudah lama tidak diformat, ada banyak sisa-sisa driver dan paket instalasi yang mengotori sistem. Oleh karena itu, saya segera format dan instal ulang, bukan upgrade. Ternyata, setelah diinstal ulang, external harddisk saya jadi tidak bisa ditulisi. 

Sebenarnya ini bukan masalah baru, sistem operasi Mac memang _by default_ tidak bisa menulis ke partisi NTFS. Biasanya para pengguna Mac membeli driver pihak ketiga. Saya biasanya pakai Paragon NTFS. Driver ini sangat dianjurkan bagi pengguna awam karena mudah dipakai. Cukup instal saja, restart, dan kemudian harddisk eksternal langsung bisa ditulis. Saya juga tadinya menggunakan Paragon NTFS ini sejak pertama pakai laptop Apple di tahun 2015. Harga lisensinya sekitar 300 ribu rupiah. Tidak terlalu mahal kalau dibagi durasi pemakaian selama 5 tahun.

Akan tetapi, ternyata lisensi saya tersebut tidak bisa dipakai lagi di MacOS versi Big Sur. Kita harus membeli lisensi baru. Nah, kalo begitu tiba saatnya saya mencari informasi lagi, apakah di tahun 2021 ini kita masih perlu membeli lisensi.

[![Google NTFS MacOS]({{site.url}}/images/uploads/2021/ntfs-macos/google-ntfs-macos.png)]({{site.url}}/images/uploads/2021/ntfs-macos/google-ntfs-macos.png)


Setelah googling, ada beberapa alternatif yang bisa dilakukan (selain beli Paragon), yaitu:

* Menggunakan driver `osxfuse` dan `ntfs-3g`
* Membuat konfigurasi di `/etc/fstab`
* Menggunakan aplikasi Mounty.app

<!--more-->

Alternatif pertama, tidak saya coba lebih lanjut. Di semua artikel yang saya baca, membahas metode ini, mengharuskan kita untuk men-disable System Integrity Protection (SIP). Saya lebih baik pinjam laptop lain untuk copy file daripada men-disable fitur keamanan. Jadi opsi pertama ini tidak kita lanjutkan.

Alternatif kedua, sebetulnya sangat mudah. MacOS sebetulnya sudah bisa menulis ke partisi NTFS, tapi tidak di-enable,  entah karena alasan teknis atau alasan bisnis. Kita cukup mengaktifkannya dengan cara menulis konfigurasi di file `/etc/fstab`. File ini bukanlah file yang aneh bagi yang biasa menggunakan Linux. Ini adalah file yang diedit untuk mendefinisikan partisi di harddisk kita, baik external maupun internal.

Kita harus tahu dulu label volume external harddisk. Misalnya harddisk saya namanya `BackupEndy`, maka saya tambahkan baris berikut di file `/etc/fstab`

```
LABEL=BackupEndy none ntfs rw,auto,nobrowse
```

Tapi ini mungkin kurang _user-friendly_ karena harus mengedit file sistem yang membutuhkan penggunaan akun superuser. Selain itu, kita harus tahu label partisi dan harus menambahkannya ke `/etc/fstab` setiap kali ada flashdisk/harddisk baru yang ingin kita pasang.

Alternatif terakhir adalah menggunakan aplikasi gratisan, yaitu [Mounty.app](https://mounty.app/)

[![Mounty App]({{site.url}}/images/uploads/2021/ntfs-macos/mounty-website.png)]({{site.url}}/images/uploads/2021/ntfs-macos/mounty-website.png)

Sebetulnya di belakang layar, aplikasi Mounty ini juga menggunakan cara yang sama dengan metode kedua kita barusan. Bedanya, dia menyediakan antarmuka visual yang lebih memudahkan pengguna awam.

Cara instalasinya mudah, bisa langsung unduh dan instal dari websitenya, atau instalasi menggunakan `Homebrew`. Perintahnya sebagai berikut:

```
brew install --cask mounty
```

Setelah itu, kita bisa jalankan seperti biasa menggunakan Spotlight.

Demikianlah beberapa alternatif untuk mengakses partisi NTFS di MacOS. Semoga bermanfaat ...