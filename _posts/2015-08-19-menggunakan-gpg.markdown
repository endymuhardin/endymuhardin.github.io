---
layout: post
title: "Menggunakan GPG"
date: 2015-08-19 16:28
comments: true
categories:
- linux
---

Pada artikel terdahulu, kita telah membahas asymmetric encryption menggunakan OpenSSL, dan aplikasinya dalam SSL. Teknologi SSL banyak digunakan dalam aplikasi client server, misalnya:

* Web Server (https)
* Email Server (SMTP, POP3, IMAP)

Dalam SSL, kita membuatkan keypair yang nantinya akan digunakan oleh aplikasi server (webserver, mailserver) untuk mengenkripsi lalu lintas data yang melalui server tersebut.

Tapi bagaimana kalau kita ingin melakukan enkripsi pada file, chat, atau email kita sendiri? Untuk keperluan personal, kita menggunakan aplikasi yang disebut dengan [GPG (Gnu Privacy Guard)](https://en.wikipedia.org/wiki/GNU_Privacy_Guard). GPG ini adalah implementasi dari standar OpenPGP, yang diawali dari aplikasi PGP karya Phil Zimmerman. Bagi yang tertarik dengan pelajaran sejarah, bisa baca [ceritanya di Wikipedia](https://en.wikipedia.org/wiki/Pretty_Good_Privacy).

Di artikel ini, kita akan membahas apa itu GPG, kapan kita menggunakannya, dan bagaimana cara menggunakannya.

<!--more-->

## Apa itu GPG ##

Pada dasarnya, GPG menggunakan prinsip asymmetric encryption, yaitu enkripsi dan dekripsi menggunakan dua key yang berbeda. Walaupun demikian, dia juga punya opsi untuk melakukan symmetric encryption seperti akan kita praktekkan nanti.

Kita akan memiliki sepasang key (keypair), yaitu private key dan public key. Sesuai namanya, private key haruslah dirahasiakan, dan public key biasanya disebarluaskan ke seluruh dunia. Public key dan private key ini diciptakan bersamaan dan berpasangan.

Ada dua fungsi utama private key, yaitu:

* membubuhkan tandatangan (digital signature) pada message/file yang kita kirim. Karena private key ini hanya kita yang punya, maka kalau ada signature yang dibuat dengan private key tersebut, bisa dipastikan bahwa message/file tersebut berasal dari kita.
* melakukan dekripsi terhadap pesan yang dienkripsi dengan pasangan public keynya. Semua orang bisa punya public key kita, sehingga semua orang bisa mengenkripsi pesan yang dia mau kirim ke kita. Karena hanya kita yang punya private key, maka cuma kita yang bisa membuka pesan terenkripsi tersebut.

Demikian sebaliknya, ada dua fungsi utama public key, yaitu:

* melakukan verifikasi terhadap digital signature. Semua orang bisa mendapatkan public key, sehingga bila kita membuat pesan/pengumuman, lalu kita tandatangani menggunakan private key, masyarakat bisa memastikan bahwa pesan/pengumuman tersebut benar-benar berasal dari kita.
* mengenkripsi pesan/file yang ditujukan untuk pemilik private key. Seperti penjelasan sebelumnya, hanya pemilik private key yang bisa membukanya.

Selanjutnya, kita akan membahas penggunaan GPG yang umum dilakukan, diantaranya:

* Manajemen Key
* Enkripsi dan Dekripsi
* Digital Signature
* Integrasi Email
* Backup dan Restore Data Pribadi

## Manajemen Key ##

Ada beberapa hal yang biasa kita lakukan berkaitan dengan keypair:

* Membuat (generate) keypair
* Menyimpan keypair dalam bentuk text
* Backup keypair
* Import key ke dalam keyring
* Mempublikasikan public key
* Membatalkan (revoke) keypair

### Generate Keypair ###

Sebelum bisa menggunakan GPG, terlebih dulu kita harus memiliki pasangan private dan public key. Kita bisa membuatnya dengan menggunakan perintah berikut

```
gpg --full-generate-key 
```

GPG akan mengajukan beberapa pertanyaan seperti ini

```
gpg (GnuPG) 2.2.27; Copyright (C) 2021 Free Software Foundation, Inc.
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
  (14) Existing key from card
Your selection? 1
RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (3072) 4096
Requested keysize is 4096 bits
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 2y
Key expires at Wed Jan 18 13:23:40 2023 WIB
Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.

Real name: Endy Muhardin
Email address: endy.muhardin@gmail.com
Comment: 
You selected this USER-ID:
    "Endy Muhardin <endy.muhardin@gmail.com>"

Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit?
```

Ada beberapa opsi yang kita harus isi:

* panjang key : pilih sepanjang mungkin, misalnya 4096 bit
* tanggal kadaluarsa (expire) : biasanya saya gunakan 2 tahun. Jangan dibuat tak hingga, takutnya kita kehilangan private key dan tidak punya revocation certificate, sehingga public key kita tidak bisa dibatalkan. Ini sering terjadi pada pemula, termasuk saya :) Sampai sekarang public key saya atas nama `endy@artivisi.com` tidak bisa dibatalkan, dan juga tidak bisa saya gunakan karena private keynya sudah hilang.
* nama lengkap : isi sesuai nama kita
* email : isi sesuai email. Umumnya, GPG digunakan untuk enkripsi dan sign email. Jadi biasanya satu keypair berkaitan dengan satu email.

Pada saat proses generate dilakukan, GPG akan membangkitkan bilangan acak (random number) supaya key kita tidak mudah ditebak orang. Semakin panjang key, semakin besar bilangan acak yang dibutuhkan (entropy). Untuk itu, pada waktu proses generate key, kita diminta untuk melakukan berbagai aktivitas yang membuat komputer kita sibuk. Bila entropy kurang, maka akan muncul pesan error seperti ini

```
We need to generate a lot of random bytes. It is a good idea to perform
some other action (type on the keyboard, move the mouse, utilize the
disks) during the prime generation; this gives the random number
generator a better chance to gain enough entropy.

Not enough random bytes available.  Please do some other work to give
the OS a chance to collect more entropy! (Need 142 more bytes)
```

Beberapa hal yang biasa dilakukan untuk meningkatkan entropy diantaranya:

* `ls -R /` : menampilkan daftar nama file di seluruh komputer
* `find / > /dev/null` : mencari file di seluruh komputer

Kedua aktifitas tersebut akan membuat harddisk bekerja keras sehingga menimbulkan bilangan acak yang banyak jumlahnya. Bila masih kurang, tancapkan semua harddisk external yang bisa Anda dapatkan, pakai USB hub bila perlu.

Ada hal penting yang perlu diperhatikan : **cara yang salah dalam membangkitkan entropy**. Bila kita google dengan keyword `gpg not enough entropy`, maka akan muncul saran untuk melakukan perintah seperti ini

```
rngd -f -r /dev/urandom
```

Cara di atas **sangat tidak aman**, karena bilangan acak yang dihasilkan `urandom` ternyata tidak terlalu acak. Bahkan hal ini sudah diwanti-wanti [dalam user manualnya](http://manpages.ubuntu.com/manpages/precise/man4/random.4.html) sebagai berikut

> A  read  from  the  /dev/urandom device will not block waiting for more
> entropy.  As a result, if  there  is  not  sufficient  entropy  in  the
> entropy  pool,  the  returned  values are theoretically vulnerable to a
> cryptographic attack on the algorithms used by the  driver.   Knowledge
> of  how  to  do  this  is  not  available  in  the current unclassified
> literature, but it is theoretically possible that such  an  attack  may
> exist.   If  this  is  a  concern  in your application, use /dev/random
> instead.

Walaupun ada juga yang menganggap itu [mitos belaka](http://www.2uo.de/myths-about-urandom/).

Setelah proses generate key selesai, keypair yang baru dibuat secara otomatis akan dimasukkan ke dalam `keyring`, yaitu database key yang kita miliki.

Kadangkala kita akan mendapatkan pesan error seperti ini

```
gpg: can't connect to the agent: No such file or directory
gpg: agent_genkey failed: No agent running
Key generation failed: No agent running
```

Itu disebabkan karena `gpg-agent` belum aktif. Kita bisa aktifkan dulu dengan perintah berikut

```
/usr/local/Cellar/gnupg/2.2.27/bin/gpg-agent -v --daemon
```

Outputnya seperti ini

```
gpg-agent[11577]: listening on socket '/Users/endymuhardin/.gnupg/S.gpg-agent'
gpg-agent[11577]: listening on socket '/Users/endymuhardin/.gnupg/S.gpg-agent.extra'
gpg-agent[11577]: listening on socket '/Users/endymuhardin/.gnupg/S.gpg-agent.browser'
gpg-agent[11577]: listening on socket '/Users/endymuhardin/.gnupg/S.gpg-agent.ssh'
gpg-agent[11578]: gpg-agent (GnuPG) 2.2.27 started
```

### Melihat isi keyring ###

Kita bisa melihat isi keyring dengan perintah berikut

```
gpg --list-key
```

Outputnya akan tampil seperti ini

```
/home/endy/.gnupg/pubring.gpg
-----------------------------
pub   2048R/0x3D115775D2C19EB3 2011-07-20 [expires: 2017-08-16]
      Key fingerprint = 9E3C 7469 2D78 8562 92A0  B0D3 3D11 5775 D2C1 9EB3
uid                 [ultimate] Endy Muhardin (endy) <endy.muhardin@gmail.com>
sub   2048R/0xBB31E545AF288E4C 2011-07-20 [expires: 2017-08-16]
```

Keyring kita berisi keypair kita sendiri, dan juga bisa diisi dengan public key orang lain. Public key orang lain akan berguna apabila:

* kita menerima email/pesan/file ber-signature. Kita butuh public key pengirim untuk melakukan verifikasi
* kita ingin mengirim pesan/file rahasia ke orang tersebut. Kita butuh public key untuk melakukan enkripsi

### Membuat Revocation Certificate ###

Ada beberapa kasus dimana kita tidak lagi ingin memakai keypair, diantaranya:

* private key sudah bocor ke tangan orang lain
* kita ingin mengganti key dengan yang lebih panjang
* dan lainnya

Untuk itu, kita membuat certificate pembatalan (revocation) dengan perintah berikut

```
gpg --gen-revoke -a endy.muhardin@gmail.com > endymuhardin-revoke.asc
```

File ini perlu dijaga. Kalau sampai file ini jatuh ke tangan orang iseng, maka bisa digunakan untuk membatalkan public dan private key kita.

### Export Public Key ###

Setelah kita memiliki keypair, selanjutnya kita ingin membagikan public key kepada masyarakat banyak. Ada banyak cara, diantara yang tradisional adalah memasangnya di website pribadi kita. Untuk itu, kita perlu export public key tersebut dalam bentuk text file. Demikian perintahnya

```
gpg --export -a endy.muhardin@gmail.com > endymuhardin.asc
```

Penjelasan opsinya sebagai berikut :

* `--export` : lakukan export
* `-a` : output dalam bentuk text (ASCII)
* `endy.muhardin@gmail.com` : email yang digunakan pada public key

Perintah di atas akan menghasilkan file `endymuhardin.asc` yang berisi public key. File ini bisa dibuka dengan text editor biasa.

### Backup Keypair ###

Keypair yang sudah kita buat, perlu kita backup, terutama private key. Sebab tanpa private key, kita tidak bisa lagi membuka pesan terenkripsi dan tidak lagi bisa memasang digital signature.

Adapun public key tidak perlu dibackup, karena bisa digenerate dari private key.

Proses backupnya sederhana, yaitu kita tinggal melakukan export agar private key kita muncul dalam bentuk text file. Perintahnya sederhana

```
gpg --export-secret-keys -a endy.muhardin@gmail.com > endymuhardin-plain.asc
```

Walaupun demikian, cara di atas belum cukup. File yang dihasilkan adalah private key yang terbuka (plain). Siapapun yang mendapatkannya bisa langsung menggunakannya untuk membuka file-file rahasia kita. Kita ingin mengenkripsi file private key ini supaya tidak bisa digunakan orang lain.

Berikut perintahnya

```
gpg --export-secret-keys -a endy.muhardin@gmail.com | gpg --symmetric --cipher-algo AES256 -a > endymuhardin-encrypted.asc
```

Pada waktu dijalankan, perintah tersebut akan meminta password enkripsi. Pilihlah password yang panjang, misalnya

`Ini password saya panjang sekali supaya susah ditebak orang lain. Mudah-mudahan saya sendiri tidak lupa`

Perintah di atas menggabungkan perintah export key dengan perintah enkripsi dengan operator `|`. Dengan demikian, tidak ada file _temporary_ yang dapat menimbulkan resiko keamanan.

Hasilnya adalah file text yang terenkripsi. Walaupun orang lain melihat dan mendapatkannya, tapi dia tidak bisa membukanya tanpa tahu passwordnya.

File private key ini bisa kita simpan di tempat yang aman. Bisa di safety deposit box, brankas, atau tempat lain yang dianggap aman. Silahkan baca diskusi di StackOverflow untuk mendapat ide tentang berbagai metode penyimpanan.

### Import Key ###

Ada beberapa situasi dimana kita melakukan import, diantaranya:

* kita baru instal ulang komputer, ingin menggunakan private key yang sudah ada
* kita ingin menggunakan public key orang lain

Untuk import private key, bila dalam kondisi _plain_ perintahnya sebagai berikut

```
cat endymuhardin-plain.asc | gpg --import
```

Sedangkan bila private key dienkripsi seperti anjuran di atas, maka perlu didekripsi dulu. Seperti halnya pada waktu enkripsi, proses dekripsi juga kita lakukan dalam satu langkah

```
gpg -a --output - endymuhardin-encrypted.asc | gpg --batch --import
```

Setelah diimport, kita perlu membuat statusnya menjadi `trusted` supaya bisa digunakan untuk encrypt/decrypt maupun sign/verify.

```
gpg --edit-key endy.muhardin@gmail.com
gpg> trust
```

Kita akan dihadapkan pada pertanyaan, mau trust level berapa. Karena ini adalah private key kita sendiri, maka jawab saja `5`.

```
Please decide how far you trust this user to correctly verify other users' keys
(by looking at passports, checking fingerprints from different sources, etc.)

  1 = I don't know or won't say
  2 = I do NOT trust
  3 = I trust marginally
  4 = I trust fully
  5 = I trust ultimately
  m = back to the main menu

Your decision? 5
Do you really want to set this key to ultimate trust? (y/N) y
```

### Menghapus Key ###

Berikut perintah untuk menghapus public key dalam keyring

```
gpg --delete-key endy.muhardin@gmail.com
```

Bila kita ingin menghapus public key yang ada private keynya, maka private key harus terlebih dulu dihapus.

Untuk menghapus private key dalam keyring, berikut perintahnya

```
gpg --delete-secret-key endy.muhardin@gmail.com
```

### Edit Key ###

Kita bisa mengedit key yang tersimpan dalam keyring. Beberapa hal yang sering diedit antara lain:

* trust key yang baru saja kita import
* password private key
* masa kadaluarsa (expire) public key

Untuk mengedit key, berikut perintahnya

```
gpg --edit-key endy.muhardin@gmail.com
```

Nanti kita akan mendapat prompt gpg sebagai berikut:

```
gpg>
```

Selanjutnya, bila kita ingin mengganti password private key, ketikkan password, kemudian simpan

```
gpg> passwd
gpg> save
```

Demikian juga, untuk mengganti masa kadaluarsa, gunakan perintah `expiry`.

```
gpg --edit-key endy.muhardin@gmail.com
gpg> expire
Changing expiration time for the primary key.
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 1y
Key expires at Wed Dec 29 11:38:49 2021 WIB
Is this correct? (y/N) y

sec  rsa2048/3D115775D2C19EB3
     created: 2011-07-20  expires: 2021-12-29  usage: SC  
     trust: ultimate          validity: unknown
ssb  rsa2048/BB31E545AF288E4C
     created: 2011-07-20  expired: 2017-08-16  usage: E   
[ unknown] (1). Endy Muhardin (endy) <endy.muhardin@gmail.com>

gpg: WARNING: Your encryption subkey expires soon.
gpg: You may want to change its expiration date too.
gpg> save
```

Kita mendapatkan warning bahwa subkey kita juga expire. Sebaiknya kita update sekalian.

```
gpg --edit-key endy.muhardin@gmail.com
gpg> list

sec  rsa2048/3D115775D2C19EB3
     created: 2011-07-20  expires: 2021-12-29  usage: SC  
     trust: ultimate      validity: ultimate
ssb  rsa2048/BB31E545AF288E4C
     created: 2011-07-20  expired: 2017-08-16  usage: E   
[ultimate] (1). Endy Muhardin (endy) <endy.muhardin@gmail.com>

gpg> key 1

sec  rsa2048/3D115775D2C19EB3
     created: 2011-07-20  expires: 2021-12-29  usage: SC  
     trust: ultimate      validity: ultimate
ssb* rsa2048/BB31E545AF288E4C
     created: 2011-07-20  expired: 2017-08-16  usage: E   
[ultimate] (1). Endy Muhardin (endy) <endy.muhardin@gmail.com>

gpg> expire
Changing expiration time for a subkey.
Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 1y
Key expires at Wed Dec 29 11:40:56 2021 WIB
Is this correct? (y/N) y

sec  rsa2048/3D115775D2C19EB3
     created: 2011-07-20  expires: 2021-12-29  usage: SC  
     trust: ultimate      validity: ultimate
ssb* rsa2048/BB31E545AF288E4C
     created: 2011-07-20  expires: 2021-12-29  usage: E   
[ultimate] (1). Endy Muhardin (endy) <endy.muhardin@gmail.com>

gpg> save
```

## Penggunaan Keypair ##

Setelah kita memiliki keypair, kita bisa gunakan untuk:

* enkripsi/dekripsi dan signature pada file
* enkripsi/dekripsi dan signature pada email
* enkripsi backup

### Aplikasi GPG pada file ###

Berikut adalah perintah untuk enkripsi file

```
gpg -a --encrypt -r 'endy.muhardin@gmail.com' namafile.txt
```

Perintah di atas akan membuat file dengan nama `namafile.txt.asc`

Untuk membuka enkripsi (dekripsi), berikut perintahnya

```
gpg --decrypt namafile.txt.asc > hasil-decrypt.txt
```

GPG akan meminta password untuk membuka private key. Setelah itu, private key digunakan untuk mendekripsi file.

Selanjutnya kita akan membuat digital signature untuk file yang akan kita kirim. Perintahnya sebagai berikut

```
gpg --sign namafile.txt
```

Akan terbentuk file `namafile.txt.gpg` yang berisi signature dari file `namafile.txt`.

Untuk memeriksanya, gunakan opsi `verify`

```
gpg --verify namafile.txt.gpg
```

Bila lancar, berikut outputnya

```
gpg: Signature made Rab 19 Agu 2015 01:46:52  WIB
gpg:                using RSA key 0x3D115775D2C19EB3
gpg: Good signature from "Endy Muhardin (endy) <endy.muhardin@gmail.com>" [ultimate]
Primary key fingerprint: 9E3C 7469 2D78 8562 92A0  B0D3 3D11 5775 D2C1 9EB3
```

### Aplikasi GPG pada Email

Pada awalnya, penggunaan GPG yang paling populer adalah untuk membubuhkan signature pada email. Dengan adanya signature, penerima bisa merasa yakin bahwa email benar-benar dikirim oleh pengirim yang sah. Di jaman dahulu, orang biasa menggunakan aplikasi mail client seperti Thunderbird, Outlook, dan sejenisnya. Aplikasi desktop ini bisa dikonfigurasi untuk memuat private key.

Di tahun 2015 ini, sudah jarang orang yang pakai aplikasi mail client berbasis desktop. Mayoritas orang langsung mengakses aplikasi web yang disediakan GMail atau Yahoo. Dengan demikian, ada perubahan cara menggunakan private key. Kita tentu tidak mau mengupload private key kita ke server Google atau Yahoo. Nanti jadi tidak _private_ lagi dong ;)

Solusinya, kita menginstal extension di browser. Extension ini dapat membaca private key, disimpan di komputer kita, dan menggunakannya untuk melakukan _sign_ dan _encrypt/decrypt_. Dengan kecanggihan JavaScript di jaman sekarang dan penggunaan style CSS yang tepat, extension tersebut bisa mengubah tampilan seolah-olah menyatu dengan aplikasi webnya.

Untuk memakainya, pertama kita search dulu extension tersebut

[![Search GPG Plugin](https://lh3.googleusercontent.com/6fTIWRai02DIsiM2QN4bxbCkqWOB9pA92YwnFU3zC0Y=w1280-no)](https://lh3.googleusercontent.com/6fTIWRai02DIsiM2QN4bxbCkqWOB9pA92YwnFU3zC0Y=w1280-no)

Kita bisa lihat ada extension untuk Firefox dan Chrome. Mari kita coba install extension Chrome

[![Extension Mymail Crypt](https://lh3.googleusercontent.com/MXe17kR1ml5SAf-0YQ0taBbakvp983qI1U6Dqke6Pe8=w1280-no)](https://lh3.googleusercontent.com/MXe17kR1ml5SAf-0YQ0taBbakvp983qI1U6Dqke6Pe8=w1280-no)

Setelah terinstal, kita bisa lihat di menu Extension.

[![Extension MyMail Crypt sudah terinstall](https://lh3.googleusercontent.com/TzETAGFvtI2oW-HGFpPop2KceKDYgcGgwP3Squmtq1M=w1280-no)](https://lh3.googleusercontent.com/TzETAGFvtI2oW-HGFpPop2KceKDYgcGgwP3Squmtq1M=w1280-no)

Klik Option untuk mengisi private key.

[![Menu Option MyMail Crypt](https://lh3.googleusercontent.com/Zl-PhaBB0s3IAXYRR6ZliyTpgZNduoZ7cPD9dmaVv5E=w1280-no)](https://lh3.googleusercontent.com/Zl-PhaBB0s3IAXYRR6ZliyTpgZNduoZ7cPD9dmaVv5E=w1280-no)

Untuk mengisi private key, tekan My Keys, kemudian klik Insert Private Key. Selanjutnya kita akan diberikan text area untuk mengisi private key

[![Insert Private Key](https://lh3.googleusercontent.com/6CuyuhC-j4kzGuns2z7eDwUsnyFEL0PlCyMYI6ZI5hA=w1280-no)](https://lh3.googleusercontent.com/6CuyuhC-j4kzGuns2z7eDwUsnyFEL0PlCyMYI6ZI5hA=w1280-no)

Export private key kita sehingga menjadi format text seperti dibahas sebelumnya. Kemudian paste isinya ke dalam text input.

[![Private Key terdaftar](https://lh3.googleusercontent.com/pvJ8yeni0h-NvqD9OGOcD7-LO9Eljb0qfe5shM3PE1M=w1280-no)](https://lh3.googleusercontent.com/pvJ8yeni0h-NvqD9OGOcD7-LO9Eljb0qfe5shM3PE1M=w1280-no)

Hasilnya bisa kita lihat di atas, keypair kita sudah siap digunakan.

Selanjutnya, restart browser, kemudian coba buka Gmail. Klik salah satu email untuk menampilkan isinya.

[![View Email](https://lh3.googleusercontent.com/zDW1Xu0rg0Y4YmUIj49ji3cElfcwyhK-bkxEEdz76Ro=w1280-no)](https://lh3.googleusercontent.com/zDW1Xu0rg0Y4YmUIj49ji3cElfcwyhK-bkxEEdz76Ro=w1280-no)

Kita bisa lihat ada tambahan menu untuk mengecek signature (verify) dan melakukan dekripsi (bila emailnya terenkripsi). Di situ ada kolom password untuk memasukkan passphrase private key kita.

Fitur extension ini juga tersedia pada saat kita mau mengirim email. Kita bisa memberikan signature kita, atau melakukan enkripsi dengan public key orang lain. Langsung saja klik Compose seperti biasa.

[![Compose Mail](https://lh3.googleusercontent.com/T-FuRISAv3Zs9muNubuqyZSHPPH_hT7TeuISqSxLvhw=w1280-no)](https://lh3.googleusercontent.com/T-FuRISAv3Zs9muNubuqyZSHPPH_hT7TeuISqSxLvhw=w1280-no)

Di situ kita bisa lihat ada tambahan tombol baru Encrypt dan Sign.

### Aplikasi GPG untuk Backup ###

Di jaman modern sekarang ini, banyak sekali tersedia layanan penyimpanan data di awan (cloud storage) dengan harga yang sangat murah. Diantaranya:

* Dropbox
* Google Drive
* Microsoft OneDrive
* Amazon S3
* Amazon Glacier
* Apple iCloud
* dan sebagainya

Bahkan Amazon Glacier menawarkan harga **$0.01 per GB per bulan** !!! Sebagai ilustrasi, koleksi foto dan video keluarga saya sejak tahun 2004 saat ini mencapai 200an GB.Untuk menyimpan semua data tersebut, biayanya hanya $2/bulan.

Tentunya untuk alasan keamanan, kita tidak bisa menyimpan data tersebut begitu saja. Kita harus enkripsi dulu file-filenya sebelum diupload. Ada aplikasi canggih bernama [duplicity](http://duplicity.nongnu.org/duplicity.1.html) yang bisa mengenkripsi file kita, kemudian menguploadnya ke berbagai layanan storage di atas. Tidak cuma itu, bila data kita berubah, duplicity juga cukup cerdas untuk hanya mengupload perubahannya saja. Dengan demikian, kita bisa menghemat bandwidth untuk upload.

Penggunaan duplicity untuk melakukan backup akan kita bahas pada [artikel selanjutnya](https://software.endy.muhardin.com/linux/backup-duplicity/). Duplicity membutuhkan keypair untuk melakukan enkripsi. Jadi, silahkan berlatih GPG dulu agar nantinya mudah menggunakan Duplicity.

## Referensi ##
* http://irtfweb.ifa.hawaii.edu/~lockhart/gpg/gpg-cs.html
* https://montemazuma.wordpress.com/2010/03/01/moving-a-gpg-key-privately/
* https://blog.fite.cat/2014/05/full-backup-with-duplicity-and-dropbox/
* http://www.thegeekstuff.com/2013/04/gnupg-digital-signatures/
* http://duplicity.nongnu.org/duplicity.1.html
