---
layout: post
title: "Kirim SMS OTP dengan Gammu"
date: 2020-05-01 07:00
comments: true
categories:
- aplikasi
---

Project yang saat ini kita sedang tangani, memiliki fitur untuk otentikasi menggunakan OTP. Dikirim dengan SMS dan Email. Tentunya sebelum fitur OTP aktif, kita juga harus verifikasi dulu nomor handphone dan emailnya.

Fitur verifikasi dan OTP ini tentunya mengharuskan aplikasi kita untuk bisa mengirim email dan SMS. Cara untuk mengirim email sudah saya bahas pada [artikel terdahulu](https://software.endy.muhardin.com/java/mengirim-email-gmail-api/). Jadi pada artikel ini, kita akan membahas cara mengirim SMS dari kode program kita.

<!--more-->

## Problem dan Solusi ##

Untuk skenario ini, ada beberapa problem yang kita temui, yaitu:

Problem pertama adalah bagaimana cara mengirim SMS dari aplikasi?

Ada beberapa alternatif yang bisa kita gunakan untuk mengirim SMS, diantaranya :

1. Menggunakan sms provider. Kita mengirim http request ke server provider dengan URL dan format data yang ditentukan provider.
2. Menggunakan modem sms.

Untuk keperluan development, kita seringkali belum mendapatkan kepastian provider SMS yang akan digunakan. Jadi kita terpaksa menggunakan opsi kedua.

Kedua, kita harus memikirkan cara bagaimana caranya supaya aplikasi yang kita hosting di cloud bisa terkoneksi dengan modem.

Solusi yang saya ambil di sini adalah menginstal modem sms di rumah, kemudian secara periodik mengecek ke server di cloud untuk mendapatkan data SMS yang harus dikirim.

Pada prakteknya, kita tidak akan mengirim SMS secara langsung dari kode program kita di aplikasi. Kita akan menyuruh aplikasi bernama [Gammu](https://wammu.eu/gammu/) untuk melakukan pengiriman SMS. Aplikasi kita cukup menyiapkan nomor tujuan dan isi pesan. Selanjutnya, data tersebut kita format menjadi bentuk yang bisa dimengerti dan diproses oleh Gammu.

Gammu memiliki fitur `daemon` atau background service yang akan berjalan terus dan memproses SMS yang dikirim dan diterima, namanya `gammu-smsd`. Ada beberapa pilihan penyimpanan data SMS, diantaranya database relasional (MySQL) dan file. Untuk lebih mudahnya, kita akan menggunakan file.

`Gammu-smsd` dengan metode penyimpanan file akan membuat dan memantau beberapa folder sebagai berikut:

* `/var/spool/gammu/inbox` : untuk menerima SMS
* `/var/spool/gammu/outbox` : antrian SMS yang ingin dikirim
* `/var/spool/gammu/sent` : data SMS yang sudah dikirim
* `/var/spool/gammu/error` : untuk SMS yang gagal terkirim

Untuk mengirim SMS, kita perlu membuat file di folder `/var/spool/gammu/outbox` dengan aturan nama file `OUT08xxxx.txt`. Diawali `OUT`, diikuti nomor tujuan, dan diakhiri dengan ekstensi `.txt`. Isi file akan dijadikan isi SMS.

Dengan demikian, aplikasi kita cukup bisa membuat file dengan format tersebut.

## Skema Deployment ##

Modem yang kita pasang di rumah harus mengambil file yang dibuat aplikasi kita di server secara periodik. Untuk itu, saya menjalankan aplikasi `rsync` setiap satu menit untuk memindahkan file di server ke mesin di rumah yang terpasang modem. Ini dilakukan dengan menggunakan scheduler `cron` yang sudah tersedia di semua distro linux. Berikut adalah baris konfigurasi `cron` 

```
* * * * * /usr/bin/rsync -r --remove-source-files root@server-aplikasi.artivisi.id:/var/lib/aplikasi-saya/smsout/ /var/spool/gammu/outbox/
```

Secara garis besar, skemanya seperti ini

[![Skema OTP]({{site.url}}/images/uploads/2020/otp-gammu/01-skema-sms-otp.jpg)]({{site.url}}/images/uploads/2020/otp-gammu/01-skema-sms-otp.jpg)


## Konfigurasi Gammu ##

Di rumah saya, mesin yang bertugas menjalankan modem dan mengambil data dari server adalah Raspberry Pi. Seperti ini penampakannya

[![Raspi Modem]({{site.url}}/images/uploads/2020/otp-gammu/02-raspi-modem.jpg)]({{site.url}}/images/uploads/2020/otp-gammu/02-raspi-modem.jpg)

Cara instalasi Raspberry sudah pernah saya tulis di [artikel terdahulu](https://software.endy.muhardin.com/linux/raspi-hardening/). Setelah Raspberry terinstal, kita perlu menginstal aplikasi `gammu-smsd` dan `wvdial`. 

```
apt install gammu-smsd wvdial -y
```

Kita membutuhkan dua nilai untuk diisikan di konfigurasi `gammu-smsd`, yaitu lokasi tempat modem kita terinstal dan kecepatan prosesnya. Nilai ini kita dapat dengan cara menjalankan deteksi konfigurasi dengan menggunakan aplikasi `wvdialconf`.

Berikut outputnya ketika kita jalankan

```
# wvdialconf
Editing `/etc/wvdial.conf'.

Scanning your serial ports for a modem.

WvModem<*1>: Cannot set information for serial port.
ttyUSB0<*1>: ATQ0 V1 E1 -- failed with 2400 baud, next try: 9600 baud
ttyUSB0<*1>: ATQ0 V1 E1 -- 
ttyUSB0<*1>: failed with 9600 baud, next try: 115200 baud
ttyUSB0<*1>: ATQ0 V1 E1 -- OK
ttyUSB0<*1>: ATQ0 V1 E1 Z -- OK
ttyUSB0<*1>: ATQ0 V1 E1 S0=0 -- OK
ttyUSB0<*1>: ATQ0 V1 E1 S0=0 &C1 -- OK
ttyUSB0<*1>: ATQ0 V1 E1 S0=0 &C1 &D2 -- OK
ttyUSB0<*1>: ATQ0 V1 E1 S0=0 &C1 &D2 +FCLASS=0 -- OK
ttyUSB0<*1>: Modem Identifier: ATI -- WAVECOM MODEM
ttyUSB0<*1>: Speed 230400: AT -- x?
ttyUSB0<*1>: Speed 230400: AT -- x?
ttyUSB0<*1>: Speed 230400: AT -- 
ttyUSB0<*1>: Max speed is 115200; that should be safe.
ttyUSB0<*1>: ATQ0 V1 E1 S0=0 &C1 &D2 +FCLASS=0 -- OK

Found a modem on /dev/ttyUSB0.
/etc/wvdial.conf<Warn>: Can't open '/etc/wvdial.conf' for reading: No such file or directory
/etc/wvdial.conf<Warn>: ...starting with blank configuration.
Modem configuration written to /etc/wvdial.conf.
ttyUSB0<Info>: Speed 115200; init "ATQ0 V1 E1 S0=0 &C1 &D2 +FCLASS=0"
```

Dari output tersebut kita mendapatkan lokasi modem kita, yaitu di `/dev/ttyUSB0` dengan kecepatan `115200`. Nilai tersebut kita pasang di konfigurasi `gammu-smsd` membutuhkan konfigurasi di file `/etc/gammu-smsdrc` yang isinya sebagai berikut

```
# Configuration file for Gammu SMS Daemon

# Gammu library configuration, see gammurc(5)
[gammu]
# Please configure this!
port = /dev/ttyUSB0
connection = at115200
# Debugging
logformat = textall

# SMSD configuration, see gammu-smsdrc(5)
[smsd]
service = files
logfile = syslog
# Increase for debugging information
debuglevel = 0

# Paths where messages are stored
inboxpath = /var/spool/gammu/inbox/
outboxpath = /var/spool/gammu/outbox/
sentsmspath = /var/spool/gammu/sent/
errorsmspath = /var/spool/gammu/error/
```

Kalau sudah dibuat, maka kita bisa jalankan aplikasi `gammu-smsd`

```
systemctl enable gammu-smsd
systemctl start gammu-smsd
```

Test reboot, kita cek apakah gammunya otomatis start ketika boot. Setelah raspberry menyala kembali, kita cek apakah `gammu-smsd` aktif dengan perintah `ps aux | grep gammu`. 

Harusnya outputnya seperti ini

```
root       396  0.1  0.3  29316  3360 ?        Ss   05:58   0:00 /usr/bin/gammu-smsd --pid=/var/run/gammu-smsd.pid --daemon
root       637  0.0  0.0   7352   508 pts/0    S+   06:01   0:00 grep gammu
```

## Pengetesan ##

Kita perlu mengetes sistem secara keseluruhan untuk memastikan flownya berjalan dengan baik. Cara mengetesnya sederhana, bahkan tidak perlu menunggu aplikasinya selesai. Kita cukup mengisi file ke `server-aplikasi.artivisi.id` di folder `/var/lib/aplikasi-saya/smsout/` dengan nama file `OUT081234567890.txt`. File bisa diisi tulisan sembarang, misalnya `test kirim via rsync`. Biasanya saya edit dulu di laptop, kemudian upload ke server menggunakan `scp`.

```
scp OUT081234567890.txt root@server-aplikasi.artivisi.id:/var/lib/aplikasi-saya/smsout/
```

Kemudian tunggu beberapa menit, harusnya kita akan mendapatkan sms di nomor `081234567890` seperti ini

[![Test Kirim SMS]({{site.url}}/images/uploads/2020/otp-gammu/03-test-kirim-sms.jpg)]({{site.url}}/images/uploads/2020/otp-gammu/03-test-kirim-sms.jpg)

## Epilog ##

Demikian setup gammu agar aplikasi kita bisa kirim SMS. Pesan moral dari artikel ini sebenarnya adalah 

>> Tidak semua masalah harus diselesaikan dengan coding. Seringkali kita cuma perlu menggunakan dan merangkai aplikasi yang sudah ada.

Dan satu lagi ...

>> Walaupun profesi utama kita adalah programmer, tapi skill linux dan jaringan merupakan hal yang wajib kita kuasai.

Semoga bermanfaat :D