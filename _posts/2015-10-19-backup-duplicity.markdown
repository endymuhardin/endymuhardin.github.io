---
layout: post
title: "Backup dengan Duplicity"
date: 2015-10-19 13:37
comments: true
categories:
- linux
---

Backup itu penting, semua orang tentu setuju. Akan tetapi, berapa orang yang benar-benar melakukannya? Secara rutin? Dengan cara yang benar?

Pada artikel ini, kita akan membahas tentang seluk beluk backup. Apa yang harus diperhatikan, bagaimana cara melakukannya, seberapa sering, dan apa aplikasi yang digunakan.

[![Backup Station](https://lh3.googleusercontent.com/QL9x5aS1BuhPkM7xGBHY0QPZMf8noCaYDJ1ahL7QUGem5z0dVHQ=w1280-no)](https://lh3.googleusercontent.com/QL9x5aS1BuhPkM7xGBHY0QPZMf8noCaYDJ1ahL7QUGem5z0dVHQ=w1280-no)

Foto di atas menunjukkan meja makan yang sedang dikudeta untuk menjalankan prosedur backup ;)

Oh iya, saya membackup harddisk external yang biasa saya bawa-bawa (karena hardisk laptopnya SSD 128GB, sehingga cuma muat buat sistem operasi saja) ke harddisk external yang besar (ditinggal di rumah).

Daftar perangkat:

* Harddisk external yang akan dibackup : [Seagate Backup Slim Plus 2TB](http://www.seagate.com/as/en/products/laptop-mobile-storage/laptop-external-drives/backup-plus-slim/)
* Harddisk external tujuan backup : Western Digital 1TB
* Docking Station : [ThermalTake BlacX Duet 5G](http://www.thermaltake.com/products-model.aspx?id=C_00001756)
* USB Hub : [Transcend USB 3.0 Hub](http://www.transcend-info.com/Products/No-402)

> Peringatan : artikel ini diperuntukkan buat mereka yang memiliki latar belakang teknis yang cukup memadai, khususnya Linux, Mac, dan penggunaan terminal (command prompt).

Bagi mereka yang levelnya user biasa, cukuplah dengan beberapa alternatif berikut:

* Pengguna Mac : [setup Time Machine untuk membuat backup ke external harddisk](http://osxdaily.com/2013/08/09/time-machine-multiple-drives-mac/)
* Pengguna Linux : gunakan Deja Dup untuk membuat backup ke [external harddisk](https://www.maketecheasier.com/deja-dup-makes-backup-a-simple-task-linux/), Dropbox, Google Drive, atau Amazon S3
* Lain-lain : gunakan layanan seperti CrashPlan, Backblaze, atau IDrive. Mereka sudah membuatkan aplikasi untuk komputer Anda. Coba baca [ulasan The Wirecutter](http://thewirecutter.com/reviews/best-online-backup-service/) untuk lebih detailnya.

Nah, untuk advanced users, silahkan meneruskan membaca artikel ini ;)

* TOC
{:toc}

<!--more-->

## Kenapa perlu backup ##

Banyak hal yang bisa terjadi pada data kita, misalnya:

* kena virus (Windows only).
* harddisk rusak. Baik karena faktor usia, jatuh, kena kopi, kehujanan, kecebur di bak mandi, dan seribu satu alasan lainnya.
* hilang kecurian
* kebakaran
* dan lain sebagainya

Laptop kecurian bisa dibeli lagi (walaupun nangis dulu, kemudian lembur). Komputer rusak juga bisa kanibal atau nunggu warisan. Tapi data? Tidak akan bisa kembali.

Data pekerjaan, foto keluarga, foto anak-anak sejak bayi, rekaman anak-anak belajar Al-Fatihah, tidak ternilai dan tak tergantikan.

## Cara backup yang benar ##

Ada beberapa faktor yang harus diperhatikan supaya data kita benar-benar aman. Sebenarnya urusan backup ini, saking pentingnya, sudah dibuatkan orang prosedur dan ketentuannya. Kita tinggal ikuti saja. Contohnya [prosedur 3-2-1](http://www.hanselman.com/blog/TheComputerBackupRuleOfThree.aspx) dan [prosedur backup untuk keluarga](http://www.hanselman.com/blog/OnLosingDataAndAFamilyBackupStrategy.aspx).

Berikut beberapa kriteria yang harus kita penuhi agar data kita aman:

* datanya terduplikasi di lebih dari satu tempat. Selain di laptop, ada juga di external harddisk, dan ada juga di server atau layanan cloud.
* tempat penyimpanan terpisah satu dengan lainnya secara geografis lebih dari 30 kilometer. Ini untuk mengantisipasi apabila terjadi kejadian seperti gempa bumi, kerusuhan, atau kebakaran.
* data sensitif disimpan dalam bentuk terenkripsi. Kita tentu tidak mau arsip foto keluarga beredar secara bebas di internet. Demikian juga dokumen-dokumen pribadi seperti scan identitas, surat kendaraan, dan informasi rahasia lainnya.
* data harus bisa _dimundurkan_ ke periode waktu tertentu. Misalnya komputer kita terkena virus, kemudian kita jalankan prosedur backup. Tentu saja si virus ini akan ikut tersimpan dalam backup. Bila ini terjadi, kita ingin mengambil data **pada waktu belum terkena virus**.

Dan juga ada beberapa kriteria tambahan yang sifatnya tidak wajib, tapi akan membuat hidup kita jauh lebih mudah

* prosedurnya bisa diotomasi, sehingga cukup sekali setup, dia akan berjalan sendiri secara otomatis
* incremental backup : hanya membackup perubahan sejak backup sebelumnya. Ini akan menghemat space harddisk dan bandwidth (bila backupnya diupload ke tempat lain)
* dukungan untuk berbagai layanan cloud (FTP, Dropbox, Google Drive, Amazon S3, Amazon Glacier)
* kompresi data. Perlu diketahui juga bahwa tidak semua file bisa dikompresi. File-file seperti PDF, JPG, MP3, MP4, dan file multimedia pada umumnya sudah berada dalam kondisi terkompres. Sehingga bila dikompres lagi, tidak akan mengurangi ukuran filenya.

## Lokasi Penyimpanan ##

Ada beberapa pilihan yang bisa kita gunakan untuk menyimpan backup kita, diantaranya:

* external harddisk. Bedakan antara harddisk yang kita bawa-bawa (karena harddisk laptopnya SSD, sehingga kapasitasnya terbatas) dengan harddisk untuk backup (idealnya ditinggal di rumah untuk mengurangi resiko bad sector dan supaya lokasinya terpisah)
* server kita sendiri yang bisa diakses dari internet. Kita bisa pasang FTP, SSH, Owncloud, dan aplikasi lain yang bisa menerima data kita.
* layanan penyimpanan berbasis cloud. Jaman sekarang, pilihannya sudah banyak, murah, dan mudah digunakan. Contohnya: Dropbox, Google Drive, Amazon S3, Amazon Glacier, dan lain sebagainya.

## Aplikasi Backup ##

Untuk memudahkan pekerjaan kita, orang sudah banyak membuatkan aplikasi untuk backup, diantaranya:

* [Time Machine](https://support.apple.com/en-ap/HT201250) (MacOS)
* [Duplicity](http://duplicity.nongnu.org/) (Linux, MacOS, Windows)
* Windows Backup and Restore
* Deja Dup (front-end duplicity)
* Duply (wrapper duplicity)

Sebetulnya masih banyak aplikasi lain. Apalagi kalau Anda menggunakan Linux. Mau model seperti [apapun](http://www.techrepublic.com/blog/10-things/10-outstanding-linux-backup-utilities/) [ada](http://www.linuxlinks.com/article/20090105114152803/Backup.html).

Saya sudah melihat-lihat berbagai aplikasi tersebut, dan akhirnya yang terbaik pada saat artikel ini ditulis adalah Duplicity.

> Kenapa harus pakai aplikasi segala? Upload ke Dropbox kan beres?

Sebetulnya bisa saja. Gampang dan mudah. Akan tetapi kurang aman, karena data kita tersimpan di server orang lain (Amazon, Google, dsb) dalam kondisi apa adanya (plain). Siapapun bisa buka, asal [punya akses ke server](https://www.jwz.org/blog/2011/04/dropbox-doesnt-actually-encrypt-your-files/). Siapa yang tahu kalau di kemudian hari mereka diakuisisi perusahaan lain, atau [servernya disita NSA](http://dougbelshaw.com/blog/2013/08/28/why-im-saying-goodbye-to-dropbox-and-hello-to-spideroak-hive/).

Boleh saja menggunakan Dropbox atau Google Drive, asal kita enkripsi dulu.

Ada beberapa fitur penting yang disediakan aplikasi yang disebutkan di atas ini, diantaranya:

* enkripsi
* kompresi
* full dan incremental backup
* kemampuan mundur ke waktu tertentu


## Backup on the Cloud ##

Backup di hardisk lain cukup mudah kita lakukan. Apalagi dengan menggunakan aplikasi, tinggal kita tancapkan harddisknya, kemudian jalankan aplikasinya. Di bawah nanti kita akan bahas cara melakukannya.

Walaupun demikian, external harddisk masih belum memenuhi kriteria backup yang harus terpisah lebih dari 30 km. Untuk memenuhi syarat ini, kita perlu punya replika data di luar rumah/kantor. Cara paling mudah adalah dengan menggunakan layanan cloud.

Ada berbagai layanan cloud untuk menyimpan data, diantaranya:

* Dropbox
* Google Drive
* Amazon S3
* Amazon Glacier
* Backblaze
* Crashplan
* IDrive
* Acronis
* Carbonite

Semua layanan ini sebetulnya bisa dikelompokkan menjadi dua jenis : online storage dan online backup. Online backup maksudnya adalah dia menyediakan layanan manajemen file ditambah dengan layanan penyimpanan file. Sedangkan online storage hanya menyediakan layanan penyimpanan.

Layanan manajemen yang dimaksud memiliki beberapa fitur, sama seperti fitur aplikasi backup yang telah dijelaskan di atas.

Walaupun demikian, saya pribadi tidak terlalu menghiraukan fitur manajemen file ini, karena saya lebih suka melakukannya sendiri. Berikut pertimbangannya:

* pemilihan file : akan lebih mudah dan fleksibel kalau kita konfigurasi sendiri
* enkripsi : saya lebih suka mengenkripsi sendiri, dengan algoritma yang dipilih sendiri, dengan key yang dibuat dan disimpan sendiri. Bila algoritma dipilihkan mereka, key mereka yang buat, mereka yang simpan, sama saja data kita tersimpan tanpa enkripsi. Dengan surat perintah pengadilan, perusahaan cloud services ini bisa dipaksa menyerahkan semua data mereka (termasuk key enkripsi). Untuk mengatasi masalah ini, beberapa layanan backup membolehkan kita menggunakan key kita sendiri.
* kemampuan mundur ke tanggal tertentu : juga bisa ditangani oleh aplikasi kita sendiri.

Karena alasan tersebut, jadi saya samakan saja antara layanan online backup dan online storage. Kriteria pemilihannya jadi lebih sederhana, cuma dua saja yaitu:

* keandalan : apakah data kita tersimpan aman? Apakah mereka cuma punya satu datacenter, atau ada replikasi ke datacenter lain? Apakah perusahaan dan layanan tersebut akan terus ada 5-10 tahun ke depan?
* tarif

Dari sisi keandalan, maka kita bisa mempercayai nama-nama besar berikut:

* Amazon
* Google
* dan juga Dropbox, karena dia sebetulnya menitipkan data di Amazon ;)

Dari sisi tarif, pada waktu artikel ini ditulis, paling murah adalah Amazon Glacier. Ini adalah layanan yang khusus untuk keperluan _archival_. Yaitu penyimpanan untuk data yang harus disimpan dalam jangka waktu lama (rekam medis, data transaksi keuangan) tapi tidak butuh diakses sewaktu-waktu. Oleh karena itu, walaupun tarif penyimpanannya murah, untuk mengambil data di Glacier dikenakan biaya yang mahal dan prosesnya tidak instan. Ada waktu tunggu beberapa jam sampai data kita siap didownload.

Berikut tarif penyimpanan data

[![Tarif Penyimpanan Glacier ](https://lh3.googleusercontent.com/J4JxEIBvpagQV3b5cM5qx69Vj6RjSwZlbOFauoWCNbSdL7MBQ7M=w1280-no)](https://lh3.googleusercontent.com/J4JxEIBvpagQV3b5cM5qx69Vj6RjSwZlbOFauoWCNbSdL7MBQ7M=w1280-no)

dan tarif untuk mengambil data

[![Tarif Mengambil Data dari Glacier](https://lh3.googleusercontent.com/6OCYS73HU9iqROLLpFYYeS3xtIpl-FwGtGBTf9iskUEhVXX55Gk=w1280-no)](https://lh3.googleusercontent.com/6OCYS73HU9iqROLLpFYYeS3xtIpl-FwGtGBTf9iskUEhVXX55Gk=w1280-no)

Sengaja saya tidak pasang tarif di sini, karena harganya bisa berubah sewaktu-waktu. Tapi mari kita ambil contoh saja, saat ini harga Amazon Glacier $0.007/GB/bulan. Sebagai ilustrasi, seluruh koleksi foto keluarga saya besarnya hampir 200GB. Dengan demikian, kalau disimpan di Amazon Glacier, tarifnya *hanya* $1.4/bulan. Kalikan Rp. 15.000, hasilnya Rp. 21.000 per bulan. Kalikan 12, Rp. 252.000 setahun. Coba pertimbangkan, apakah koleksi kenangan indah masa lalu kita senilai harga tersebut?

## Menggunakan Duplicity ##

Dari sekian banyak aplikasi backup, saya memilih [Duplicity](http://duplicity.nongnu.org) untuk beberapa alasan:

* cross platform, berjalan di Linux, Mac, dan Windows
* bisa full dan incremental backup
* bisa enkripsi dengan [menggunakan GPG](http://software.endy.muhardin.com/linux/menggunakan-gpg)
* mendukung berbagai macam backend storage, misalnya:

    * external harddisk
    * Amazon S3 dan Glacier
    * Dropbox
    * Google Drive
    * dan masih banyak lagi. Silahkan lihat sendiri di dokumentasinya

* berbasis command line, sehingga bisa juga digunakan untuk membackup server.

Baiklah, mari kita install dulu dia.

### Instalasi Duplicity ###

Instalasi di Windows dapat dibaca pada [artikel ini](http://www.alexdimarco.ca/blog/15-duplicity-on-windows.html).

#### MacOSX ####

Cek versinya

```
brew info duplicity
duplicity: stable 0.6.26 (bottled), devel 0.7.04
Bandwidth-efficient encrypted backup
http://www.nongnu.org/duplicity/
Not installed
From: https://github.com/Homebrew/homebrew/blob/master/Library/Formula/duplicity.rb
==> Dependencies
Required: librsync ✘, gnupg ✘
==> Options
--universal
	Build a universal binary
--devel
	Install development version 0.7.04
```

Install duplicity

```
$ brew install --devel duplicity
```

#### Ubuntu ####

Cukup jalankan perintah berikut di terminal

```
sudo apt-get install python-software-properties software-properties-common -y
sudo apt-add-repository ppa:duplicity-team/ppa
sudo add-apt-repository ppa:chris-lea/python-boto
sudo apt-get update
sudo apt-get install duplicity python-boto haveged
```

### Persiapan GPG Key ###

Duplicity mendukung enkripsi dengan symmetric key (semacam password) ataupun dengan GPG. Saya rekomendasikan menggunakan GPG supaya tekniknya juga bisa digunakan di server. Kalau menggunakan symmetric key, kita harus input password setiap kali menjalankan backup, ini tidak bisa dipakai untuk server ataupun backup otomatis terjadwal.

Persiapan GPG key bisa dibaca di [artikel sebelumnya](http://software.endy.muhardin.com/linux/menggunakan-gpg). Kita membutuhkan:

* GPG keypair yang sudah ter-import ke dalam keyring
* Key ID
* Passphrase untuk membuka private key (bila ada)

Jalankan perintah berikut untuk mendapatkan Key ID

```
gpg --list-keys --keyid-format LONG
```

Berikut hasilnya

```
/Users/endymuhardin/.gnupg/pubring.gpg
--------------------------------------
pub   4096R/80D2744B0EB1FA47 2015-10-17 [expires: 2017-10-16]
uid                          Endy Muhardin <endy.muhardin+duplicity@gmail.com>
sub   4096R/2512CD4FD21E50A5 2015-10-17 [expires: 2017-10-16]
```

Key ID yang akan kita gunakan dalam penjelasan di bawah adalah `80D2744B0EB1FA47`


## Backup Script ##

Sebetulnya duplicity bisa langsung dipanggil dari command line. Contohnya, bila kita sekedar ingin membackup folder `Pictures` ke external harddisk, perintahnya sebagai berikut

```
duplicity --encrypt-key=80D2744B0EB1FA47 Pictures file:///media/endy/EXTHD/folder-backup
```

Walaupun demikian, untuk backup yang bersifat jangka panjang, kita ingin menggunakan berbagai fitur dan opsi command line. Akan lebih mudah bila kita tulis dalam bentuk script agar tidak ada yang terlupakan.

### Konfigurasi Backup ###

Dalam urusan backup, ada istilah `retention period`, artinya seberapa lama kita ingin menyimpan backup tersebut. Berikut adalah kebijakan retention period yang saya pakai:

* Simpan backup 6 bulan ke belakang. Maksimal periode yang bisa saya restore adalah 6 bulan terakhir. Artinya, kalau ada satu file yang dihapus 5 bulan yang lalu, masih bisa saya ambil. Sedangkan bila dihapus tahun lalu, tidak bisa diambil lagi.
* Backup bisa dilakukan setiap saat, bentuknya berupa incremental backup (hanya selisih saja dari backup sebelumnya)
* Lakukan full backup setiap bulan
* Setelah full backup bulan terakhir dibuat, hapus incremental backup di bulan sebelumnya

Nah, setelah kebijakan tersebut kita tetapkan, saatnya kita membuat backup script.

### Backup ke External Harddisk ###

Berikut adalah backup script yang saya gunakan untuk membackup beberapa folder ke external harddisk.

```sh
#!/bin/bash

# GPG Key ID + Private Key Passphrase
GPG_KEY='0x80D2744B0EB1FA47'
PASSPHRASE='masukkan passphrase anda di sini'
export PASSPHRASE

# Masa Penyimpanan
FULL_BACKUP_FREQ=1M        # full backup setiap bulan
FULL_BACKUP_KEPT=6         # simpan 6 full backup -> 6 bulan backup
FULL_BACKUP_CHAIN_KEPT=1   # simpan 1 rangkaian full + inc

# Log File
LOGFILE=$HOME/.duplicity/duplicity.log

function do_backup {
    # Backup
    echo ""
    echo "========================================================"
    echo " Backup folder $1 to $2"
    echo "========================================================"
    duplicity \
        --allow-source-mismatch \
        --file-prefix-archive="data-" \
        --encrypt-key="$GPG_KEY" \
        --asynchronous-upload \
        --log-file $LOGFILE \
        --full-if-older-than $FULL_BACKUP_FREQ \
        $1 \
        file://$2

    # Hapus full backup yang sudah melewati masa penyimpanan
    echo ""
    echo "========================================================"
    echo " Removing old backup in $2"
    echo "========================================================"
    duplicity remove-all-but-n-full $FULL_BACKUP_KEPT \
        --force \
        file://$2

    # Hapus incremental backup yang sudah melewati masa penyimpanan
    duplicity remove-all-inc-of-but-n-full $FULL_BACKUP_CHAIN_KEPT \
        --force \
        file://$2

    # Hapus file-file yang tidak perlu
    echo ""
    echo "========================================================"
    echo " Cleanup  $2"
    echo "========================================================"
    duplicity cleanup \
        --force \
        --extra-clean \
        file://$2
}

while read SRC DST; do
    do_backup $SRC $DST
done < daftar-backup-exthdd.txt

unset PASSPHRASE

```

Script tersebut akan mencari file `daftar-backup-exthdd.txt` yang berisi folder yang ingin dibackup dan folder tujuan backupnya. Berikut isinya

```
/home/endy/Pictures /media/endy/ENDYBACKUP/backup-foto
/home/endy/Documents /media/endy/ENDYBACKUP/backup-documents
```

Bila terjadi pesan error seperti ini

```
Max open files of 256 is too low, should be >= 1024.
Use 'ulimit -n 1024' or higher to correct.
```

Maka kita bisa naikkan `ulimit` dengan menjalankan perintah berikut di command line

```
ulimit -n 1024
```

Setelah backup selesai, dia akan menampilkan hasil seperti ini

```
Local and Remote metadata are synchronized, no sync needed.
Last full backup date: none
Last full backup is too old, forcing full backup
Reuse configured PASSPHRASE as SIGN_PASSPHRASE
--------------[ Backup Statistics ]--------------
StartTime 1440036073.03 (Thu Aug 20 09:01:13 2015)
EndTime 1440036073.06 (Thu Aug 20 09:01:13 2015)
ElapsedTime 0.02 (0.02 seconds)
SourceFiles 3
SourceFileSize 104157 (102 KB)
NewFiles 3
NewFileSize 104157 (102 KB)
DeletedFiles 0
ChangedFiles 0
ChangedFileSize 0 (0 bytes)
ChangedDeltaSize 0 (0 bytes)
DeltaEntries 3
RawDeltaSize 100061 (97.7 KB)
TotalDestinationSizeChange 100239 (97.9 KB)
Errors 0
-------------------------------------------------
```

Bila kita buka di file explorer, hasilnya akan tampil seperti ini

[![Hasil Backup](https://lh3.googleusercontent.com/u3K2tQbik_dcMuQJ7XWsuSAOvhhEHciUROoMvPF1SmQkxD2kMpc=w1280-no)](https://lh3.googleusercontent.com/u3K2tQbik_dcMuQJ7XWsuSAOvhhEHciUROoMvPF1SmQkxD2kMpc=w1280-no)

Kalau kita lihat di screenshot di atas, tidak ada file yang bisa kita lihat. Ini karena file dan foldernya dienkripsi. Untuk melihat isinya, kita harus mendekripsi dulu dan menampilkan isi folder sebagai berikut

```
duplicity list-current-files file:///media/endy/ENDYBACKUP/backup-foto
```

Berikut potongan outputnya

```
duplicity list-current-files file:///media/endy/ENDYBACKUP/backup-foto
Local and Remote metadata are synchronized, no sync needed.
Last full backup date: Mon Oct 19 09:09:44 2015
Sun Oct 11 10:14:41 2015 .
Sun Oct 11 10:52:20 2015 2015/10/11
Sun Oct 11 08:40:24 2015 2015/10/11/DSC_2850.JPG
Sun Oct 11 08:40:50 2015 2015/10/11/DSC_2851.JPG
Sun Oct 11 08:41:20 2015 2015/10/11/DSC_2852.JPG
Sun Oct 11 08:42:42 2015 2015/10/11/DSC_2853.JPG
Sun Oct 11 08:44:32 2015 2015/10/11/DSC_2854.JPG
Sun Oct 11 08:44:40 2015 2015/10/11/DSC_2855.JPG
Sun Oct 11 08:45:08 2015 2015/10/11/DSC_2856.JPG
Sun Oct 11 10:39:28 2015 2015/10/11/DSC_2857-edit.JPG
Sun Oct 11 08:45:26 2015 2015/10/11/DSC_2857.JPG
Sun Oct 11 10:30:19 2015 2015/10/11/DSC_2858-crop.JPG
```
Bila kita ingin mengambil file `DSC_2858-crop.JPG`, perintahnya adalah sebagai berikut

```
duplicity --file-to-restore 2015/10/11/DSC_2858-crop.JPG file:///media/endy/ENDYBACKUP/backup-foto foto.jpg
```
Kita akan dimintai passphrase yang digunakan untuk mengenkripsi (bila pakai symmetric key) atau password private key (bila menggunakan GPG)

### Backup ke Amazon S3 dan Glacier ###

Agar dapat mengupload file ke Amazon, kita membutuhkan `AWS_ACCESS_KEY_ID` berikut `AWS_SECRET_ACCESS_KEY`. Untuk mendapatkannya, kita login dulu ke web console Amazon. Kemudian masuk ke [bagian User Management di modul IAM](https://console.aws.amazon.com/iam/home#/users). Kemudian klik `Add User`

![[Add User]({{site.url}}/images/uploads/2015/duplicity/01-add-user.png)]({{site.url}}/images/uploads/2015/duplicity/01-add-user.png)

Isikan username yang akan kita buat, kemudian klik `Next` untuk mengatur permission.

![[Add Permission]({{site.url}}/images/uploads/2015/duplicity/02-add-permission.png)]({{site.url}}/images/uploads/2015/duplicity/02-add-permission.png)

Selanjutnya, pilih tab `Attach Existing Policy` kemudian klik `Create Policy`.

![[Create Policy]({{site.url}}/images/uploads/2015/duplicity/03-create-policy.png)]({{site.url}}/images/uploads/2015/duplicity/03-create-policy.png)

Isi policy seperti ini, yaitu memberikan akses buat mengunggah ke dalam bucket

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::endy-backup",
                "arn:aws:s3:::endy-backup/*"
            ]
        }
    ]
}
```

Setelah itu, klik `Create Policy`. Kembali ke layar `Add User`, pasang policy tersebut ke user yang baru dibuat tadi

![[Add Policy]({{site.url}}/images/uploads/2015/duplicity/04-add-policy.png)]({{site.url}}/images/uploads/2015/duplicity/04-add-policy.png)

Klik `Finish` dan user kita telah terbentuk. Masuk ke record user tersebut, kemudian buka tab `Security Credential`. Klik `Add Access Key`.

![[Access Key]({{site.url}}/images/uploads/2015/duplicity/06-access-key-created.png)]({{site.url}}/images/uploads/2015/duplicity/06-access-key-created.png)

Kita akan dibuatkan `Access Key` baru. Copy paste `Access Key ID` dan `Secret Key Access`. Kita akan membutuhkannya untuk dipasang di script di atas.

![[Add Access Key]({{site.url}}/images/uploads/2015/duplicity/05-create-access-key.png)]({{site.url}}/images/uploads/2015/duplicity/05-create-access-key.png)


Setelah `Access Key ID` dan `Secret Key Access` kita dapatkan, sekarang kita bisa lanjut membuat script uploadnya.

Untuk memasukkan file ke Glacier, kita harus melalui layanan S3 dulu. Di dalam konfigurasi S3, kita bisa membuat aturan (rule) untuk memindahkan file dari dalam S3 ke Glacier.

Berkaitan dengan duplicity, dia membutuhkan file `signature` dan `manifest` agar dia tahu posisi terakhir backup dan apa saja isi backup. Ukuran kedua file tersebut relatif tidak besar. Sedangkan datanya sendiri disimpan dalam file `difftar` yang hanya diperlukan pada waktu ingin restore. File `difftar` inilah yang ukurannya besar, sesuai dengan isi folder yang kita backup.

Dengan demikian, file `signature` dan `manifest` ini harus tetap ada di S3. File `difftar` bisa kita migrasikan ke Glacier supaya lebih murah biaya sewanya. Untuk keperluan tersebut, kita harus menambahkan prefix khusus di nama filenya supaya bisa diproses oleh rule S3.

Berikut contoh nama file standar duplicity

```
ls /media/endy/ENDYBACKUP/backup-foto/
duplicity-full-signatures.20151019T034820Z.sigtar.gpg	duplicity-full.20151019T034820Z.vol22.difftar.gpg
duplicity-full.20151019T034820Z.manifest.gpg		duplicity-full.20151019T034820Z.vol23.difftar.gpg
duplicity-full.20151019T034820Z.vol1.difftar.gpg	duplicity-full.20151019T034820Z.vol24.difftar.gpg
duplicity-full.20151019T034820Z.vol10.difftar.gpg	duplicity-full.20151019T034820Z.vol25.difftar.gpg
duplicity-full.20151019T034820Z.vol11.difftar.gpg	duplicity-full.20151019T034820Z.vol26.difftar.gpg
duplicity-full.20151019T034820Z.vol12.difftar.gpg	duplicity-full.20151019T034820Z.vol27.difftar.gpg
duplicity-full.20151019T034820Z.vol13.difftar.gpg	duplicity-full.20151019T034820Z.vol28.difftar.gpg
duplicity-full.20151019T034820Z.vol14.difftar.gpg	duplicity-full.20151019T034820Z.vol29.difftar.gpg
duplicity-full.20151019T034820Z.vol15.difftar.gpg	duplicity-full.20151019T034820Z.vol3.difftar.gpg
duplicity-full.20151019T034820Z.vol16.difftar.gpg	duplicity-full.20151019T034820Z.vol4.difftar.gpg
duplicity-full.20151019T034820Z.vol17.difftar.gpg	duplicity-full.20151019T034820Z.vol5.difftar.gpg
duplicity-full.20151019T034820Z.vol18.difftar.gpg	duplicity-full.20151019T034820Z.vol6.difftar.gpg
duplicity-full.20151019T034820Z.vol19.difftar.gpg	duplicity-full.20151019T034820Z.vol7.difftar.gpg
duplicity-full.20151019T034820Z.vol2.difftar.gpg	duplicity-full.20151019T034820Z.vol8.difftar.gpg
duplicity-full.20151019T034820Z.vol20.difftar.gpg	duplicity-full.20151019T034820Z.vol9.difftar.gpg
duplicity-full.20151019T034820Z.vol21.difftar.gpg
```

Kita perlu menambahkan opsi `--file-prefix-archive` agar nama file difftar diberi prefix tertentu, misalnya `data-`. Hasilnya seperti ini

```
ls /media/endy/ENDYBACKUP/backup-foto/
data-duplicity-full.20151019T042837Z.vol1.difftar.gpg	data-duplicity-full.20151019T042837Z.vol24.difftar.gpg
data-duplicity-full.20151019T042837Z.vol10.difftar.gpg	data-duplicity-full.20151019T042837Z.vol25.difftar.gpg
data-duplicity-full.20151019T042837Z.vol11.difftar.gpg	data-duplicity-full.20151019T042837Z.vol26.difftar.gpg
data-duplicity-full.20151019T042837Z.vol12.difftar.gpg	data-duplicity-full.20151019T042837Z.vol27.difftar.gpg
data-duplicity-full.20151019T042837Z.vol13.difftar.gpg	data-duplicity-full.20151019T042837Z.vol28.difftar.gpg
data-duplicity-full.20151019T042837Z.vol14.difftar.gpg	data-duplicity-full.20151019T042837Z.vol29.difftar.gpg
data-duplicity-full.20151019T042837Z.vol15.difftar.gpg	data-duplicity-full.20151019T042837Z.vol3.difftar.gpg
data-duplicity-full.20151019T042837Z.vol16.difftar.gpg	data-duplicity-full.20151019T042837Z.vol4.difftar.gpg
data-duplicity-full.20151019T042837Z.vol17.difftar.gpg	data-duplicity-full.20151019T042837Z.vol5.difftar.gpg
data-duplicity-full.20151019T042837Z.vol18.difftar.gpg	data-duplicity-full.20151019T042837Z.vol6.difftar.gpg
data-duplicity-full.20151019T042837Z.vol19.difftar.gpg	data-duplicity-full.20151019T042837Z.vol7.difftar.gpg
data-duplicity-full.20151019T042837Z.vol2.difftar.gpg	data-duplicity-full.20151019T042837Z.vol8.difftar.gpg
data-duplicity-full.20151019T042837Z.vol20.difftar.gpg	data-duplicity-full.20151019T042837Z.vol9.difftar.gpg
data-duplicity-full.20151019T042837Z.vol21.difftar.gpg	duplicity-full-signatures.20151019T042837Z.sigtar.gpg
data-duplicity-full.20151019T042837Z.vol22.difftar.gpg	duplicity-full.20151019T042837Z.manifest.gpg
data-duplicity-full.20151019T042837Z.vol23.difftar.gpg
```

Berikut adalah backup scriptnya

```sh
#!/bin/bash

# GPG Key ID + Private Key Passphrase
GPG_KEY='0x80D2744B0EB1FA47'
PASSPHRASE='RmQo32ta9j2JeCH9kXtMXjWP'
export PASSPHRASE

# Amazon Credentials
source amazon-auth.txt
export AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY

# Masa Penyimpanan
FULL_BACKUP_FREQ=1M        # full backup setiap bulan

# Log File
LOGFILE=$HOME/.duplicity/duplicity.log

function do_backup {
    # Backup
    echo ""
    echo "========================================================"
    echo " Backup folder $1 to Amazon S3 s3+http://$2"
    echo "========================================================"
    duplicity \
        --s3-use-new-style \
        --s3-use-multiprocessing \
        --allow-source-mismatch \
        --file-prefix-archive="data-" \
        --encrypt-key="$GPG_KEY" \
        --asynchronous-upload \
        --log-file $LOGFILE \
        --full-if-older-than $FULL_BACKUP_FREQ \
        $1 \
        s3+http://$2
}

while read SRC DST; do
    do_backup $SRC $DST
done < daftar-backup-s3.txt

unset PASSPHRASE
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY
```

Script tersebut akan melihat konfigurasi login ke Amazon dalam file `amazon-auth.txt` yang isinya seperti ini

```
AWS_ACCESS_KEY_ID='MASUKKANACCESSKEYDISINI'
AWS_SECRET_ACCESS_KEY='awsSECRETaccessKEYanda'
```


Dia juga akan melihat daftar folder yang ingin dibackup berikut tujuannya dalam file `daftar-backup-s3.txt` yang isinya seperti ini

```
/home/endy/Pictures endy-backup/backup-foto
/home/endy/Documents endy-backup/backup-documents
```

Di kolom tujuan, formatnya adalah `namabucket/namafolder`. Sebelum dijalankan, pastikan kita sudah membuat bucket bernama `endy-backup` di Amazon S3.

[![Bucket kosong](https://lh3.googleusercontent.com/0yX6Emtzj0ewaSpezMoQGJ9sfsNLEZDhrYJ9vSXYofMzNW02U7U=w1280-no)](https://lh3.googleusercontent.com/0yX6Emtzj0ewaSpezMoQGJ9sfsNLEZDhrYJ9vSXYofMzNW02U7U=w1280-no)

Setelah script dijalankan, dia akan membuat folder dalam bucket

[![Bucket sudah terisi](https://lh3.googleusercontent.com/yoUO1yCyFjEFn0B3Bx2bcG7JLrjzdPUa0zFw4v51CI2lIpMYgVA=w1280-no)](https://lh3.googleusercontent.com/yoUO1yCyFjEFn0B3Bx2bcG7JLrjzdPUa0zFw4v51CI2lIpMYgVA=w1280-no)

Kita bisa melihat isi foldernya, mirip dengan yang kita hasilkan di external harddisk

[![Backup Content](https://lh3.googleusercontent.com/-mcz-0Zlvn9klUBA7uMMR-R5uhGgMUBaWvSjWIi8aKsxv__AoSM=w1280-no)](https://lh3.googleusercontent.com/-mcz-0Zlvn9klUBA7uMMR-R5uhGgMUBaWvSjWIi8aKsxv__AoSM=w1280-no)

Dari gambar di atas, kita ambil dua variabel : nama folder dan prefix untuk file difftar seperti sudah dijelaskan di atas. Nilainya adalah `backup-documents` dan `data-`

Selanjutnya, kembali ke halaman bucket, buka tab Properties, dan klik tab Lifecycle

[![Konfigurasi Lifecycle](https://lh3.googleusercontent.com/HMhpK8EXbf95SU9SCPtsEO3U-QDGMu1TzHXLMpEZ-pa0hZGcPUQ=w1280-no)](https://lh3.googleusercontent.com/HMhpK8EXbf95SU9SCPtsEO3U-QDGMu1TzHXLMpEZ-pa0hZGcPUQ=w1280-no)

Tambahkan Rule untuk memfilter prefix `backup-documents/data-`. Sebagai catatan, prefix ini tidak mendukung regex. Jadi isilah apa adanya.

[![Rule Prefix](https://lh3.googleusercontent.com/O7TPqC0wCP3WSBOEXeViw1vNNOrXHN80Encxr1q42WN6qO0KLvU=w1280-no)](https://lh3.googleusercontent.com/O7TPqC0wCP3WSBOEXeViw1vNNOrXHN80Encxr1q42WN6qO0KLvU=w1280-no)

Selanjutnya, kita atur supaya file difftar langsung dipindah ke Glacier hari itu juga.

[![Langsung pindah ke Glacier](https://lh3.googleusercontent.com/olF9mLlwiUQcLv0GKCKactqISXVgjdpYT1tpBefp1zoWEHd-12M=w1280-no)](https://lh3.googleusercontent.com/olF9mLlwiUQcLv0GKCKactqISXVgjdpYT1tpBefp1zoWEHd-12M=w1280-no)

Berikan nama supaya jelas

[![Nama Rule](https://lh3.googleusercontent.com/ZLisCTGy1MRTX3QzZf7pKH2gvmga_wsk0Thy1_6KTiPy_c6G2WU=w1280-no)](https://lh3.googleusercontent.com/ZLisCTGy1MRTX3QzZf7pKH2gvmga_wsk0Thy1_6KTiPy_c6G2WU=w1280-no)

Ulangi hal yang sama untuk semua folder backup

[![Rule Glacier](https://lh3.googleusercontent.com/W4Z7gZNNlj2OhuflZJK_iIuf11VwhhYYmo8x-GyWl8uA57taEFk=w1280-no)](https://lh3.googleusercontent.com/W4Z7gZNNlj2OhuflZJK_iIuf11VwhhYYmo8x-GyWl8uA57taEFk=w1280-no)

Lihat lagi besoknya, dan file kita sudah dipindahkan dari S3 ke Glacier.

![Storage Class
Glacier](https://lh3.googleusercontent.com/ghj7nOi-9LXzGnNePC2TDvfbxu4vIsuNi8s_g7pEL-Nu7j0PyfU=w1280-no)


### Solusi Fakir Bandwidth ###

Banyak di antara kita yang memiliki koneksi internet yang terbatas. Baik secara kecepatan maupun secara kuota. Agar kita tetap bisa melakukan backup ke Amazon Glacier, kita bisa mengakalinya dengan cara melakukan enkripsi dengan `Duplicity` secara local. Berikut perintah yang kita jalankan

```
duplicity --encrypt-key 0x80D2744B0EB1FA47 --volsize 200 /lokasi/foto/yang/mau/dibackup file:///folder/tujuan/backup
```

Untuk bisa mengupload ke Amazon Glacier, kita perlu file konfigurasi credential yang berada di `.aws/credentials`. Isinya seperti ini

```
aws_access_key_id = 'MASUKKANACCESSKEYDISINI'
aws_secret_access_key = 'awsSECRETaccessKEYanda'
```

Kita juga perlu menginstal aplikasi command line AWS, caranya bisa dibaca [di dokumentasi resminya](http://docs.aws.amazon.com/cli/latest/userguide/installing.html).

Setelah persiapan lengkap, kita bisa upload dengan perintah berikut

```
aws s3 sync /folder/tujuan/backup s3://endy-backup/backup-foto
```

Hasil akhirnya akan sama saja dengan backup langsung ke Glacier.

## Kesimpulan ##

Backup itu penting. Dengan sudah semakin canggihnya teknologi di jaman sekarang, alternatif tempat penyimpanan semakin murah dan mudah digunakan. Saat ini kombinasi paling optimal yang saya gunakan adalah:

* Backup minimal seminggu sekali ke external harddisk
* Setiap dapat koneksi internet yang bagus, upload ke Amazon S3
* Setup rule di Amazon S3 untuk memindahkan data backup ke Glacier, supaya lebih murah

## Referensi ##

* http://cloudacademy.com/blog/amazon-s3-and-amazon-glacier-together-the-best-of-both-worlds-for-your-backup-strategy/
* http://college.wfu.edu/itg/scott-claybrook/2014/10/21/dropbox-is-not-a-backup-service/
* http://blog.epsilontik.de/?page_id=68
* http://www.sleptlate.org/2013/04/15/incremental-backups-in-aws-glacier-using-duplicity/
* https://theholyjava.wordpress.com/2015/04/03/backup-wd-mycloud-to-s3glacier-with-duplicity-build-instructions-included/
* https://aws.amazon.com/blogs/aws/archive-s3-to-glacier/
* https://storagemojo.com/2014/04/25/amazons-glacier-secret-bdxl/
* http://www.businessinsider.co.id/best-cloud-storage-price-google-drive-dropbox-icloud-one-drive-2014-12/
* https://blog.serverdensity.com/secure-encrypted-backup-using-duplicity-for-linux-and-mac/
* https://blog.fite.cat/2014/05/full-backup-with-duplicity-and-dropbox/
* https://www.digitalocean.com/community/tutorials/how-to-use-duplicity-with-gpg-to-securely-automate-backups-on-ubuntu
* http://blog.yadutaf.fr/2012/09/08/lazy-man-backup-strategy-with-duplicity-part-1/
* http://www.leehodgkinson.com/blog/using-glacier-to-lower-the-cost-of-backup-of-large-folders/
* http://dougbelshaw.com/blog/2013/08/28/why-im-saying-goodbye-to-dropbox-and-hello-to-spideroak-hive/
* https://www.jwz.org/blog/2011/04/dropbox-doesnt-actually-encrypt-your-files/
