---
layout: post
title: "Membuat Self Signed Certificate"
date: 2013-07-09 13:41
comments: true
categories: 
- aplikasi
---

Idealnya, sertifikat SSL disetujui (signed) oleh Certificate Authority (CA).
Proses persetujuan ini biasanya dikenakan biaya, walaupun ada juga yang [gratisan](http://www.startssl.com/?app=1).
Sertifikat yang disetujui CA memiliki batas waktu pemakaian. Setelah waktu tersebut habis, maka sertifikat tidak bisa digunakan dan kita harus mengurus perpanjangannya. 

Kondisi ini tentu kurang menyenangkan pada waktu kita ada di fase development. Untuk itu kita ingin membuat sertifikat sendiri, dan kemudian menyetujuinya sendiri juga. Ini disebut dengan istilah `self-signed certificate`. Bila diakses di browser, `self-signed certificate` ini akan menimbulkan peringatan seperti screenshot dibawah. 

![Halaman Warning ](/images/uploads/2013/07/ssl/01-ssl-warning.png)

Agar bisa mengakses halaman tersebut, kita perlu menambahkan exception. Kita akan dikonfirmasi seperti pada layar berikut

![Add Exception ](/images/uploads/2013/07/ssl/02-add-exception.png)

Tapi tidak masalah, karena pada fase development yang pakai aplikasi/website ini hanya kita sendiri, bukan end-user. Nantinya sebelum dipublish untuk umum, belilah sertifikat yang benar.

Artikel ini adalah bagian kedua dari 4 artikel, yaitu:

1. [Apa itu SSL](http://software.endy.muhardin.com/aplikasi/apa-itu-ssl/)
2. [Membuat self-signed certificate](http://software.endy.muhardin.com/aplikasi/membuat-self-signed-certificate/)
3. [Membeli sertifikat SSL](http://software.endy.muhardin.com/aplikasi/membeli-sertifikat-ssl/)
4. [Memasang sertifikat SSL](http://software.endy.muhardin.com/aplikasi/memasang-sertifikat-ssl/)


<!--more-->

## Garis Besar Prosedur ##

Ada beberapa langkah yang perlu kita lakukan untuk membuat self-signed certificate. Berikut adalah hasil akhir yang kita harapkan setelah semua prosedur dilalui:

* File private key yang dienkripsi dengan password
* File certificate yang sudah disetujui CA
* File certificate milik CA. Untuk self-signed filenya cuma satu. Tapi ketika kita membeli sertifikat berbayar, file dari CA ini bisa banyak tergantung dari rantai approval dari CA tersebut.
* Khusus untuk aplikasi Java, ketiga file tersebut harus dimasukkan ke dalam database yang disebut dengan istilah `keystore`

Berikut adalah langkah-langkah untuk membuat self-signed certificate:

1. Buat private key
2. Buat permohonan persetujuan sertifikat, dalam bahasa Inggris disebut Certificate Signing Request (CSR)
3. Buat dulu CA yang akan menandatangani sertifikat. Langkah ini tidak diperlukan bila kita membeli sertifikat dari CA.
4. Setujui CSR oleh CA yang dibuat sendiri. Langkah ini juga harusnya dilakukan oleh CA yang benar.
5. Khusus aplikasi Java, masukkan semua file yang dibutuhkan ke dalam `keystore` 

## Aplikasi yang dibutuhkan ##

Ada dua aplikasi yang umum digunakan untuk melakukan prosedur di atas, yaitu `openssl` dan `keytool`. Aplikasi `openssl` biasanya sudah terinstal di distro Linux populer sehingga kita tinggal pakai saja. Aplikasi `keytool` merupakan bawaan dari Java SDK. Kita harus menginstal dulu Java SDK untuk bisa menggunakan aplikasi ini.

Kedua aplikasi bisa melakukan semua prosedur di atas. Pertanyaan penting yang kita hadapi adalah

> Mana yang lebih baik pakai openssl atau keytool ?

Setelah mencoba kedua aplikasi, saran saya adalah: gunakan OpenSSL untuk semua proses, kecuali memasukkan file ke dalam keystore. OpenSSL tidak bisa mengelola keystore, sehingga kita harus pakai keytool.

> Kenapa begitu? 

Untuk aplikasi web, sertifikat SSL biasanya digunakan oleh webserver. Bila aplikasi kita Java, maka webservernya adalah Tomcat atau Jetty. Apabila non Java, biasanya Apache HTTPD, Nginx, Lighttpd, atau lainnya. 

Webserver untuk aplikasi Java membutuhkan file sertifikat dalam bentuk keystore, sedangkan webserver untuk aplikasi non Java membutuhkan sertifikat dalam bentuk file text. 

Dari bentuk file text kita bisa membuat bentuk keystore dengan mudah. Cukup berbekal `openssl` dan `keytool` pekerjaan sudah bisa diselesaikan. Tapi sebaliknya, mengeluarkan private key dari keystore menjadi file text [relatif sulit dan membutuhkan aplikasi tambahan](http://conshell.net/wiki/index.php/Keytool_to_OpenSSL_Conversion_tips).

Oleh karena itu, pada artikel ini, semua langkah akan dilakukan dengan OpenSSL. Keytool akan digunakan di bagian terakhir pada waktu kita ingin memasang sertifikat di Tomcat.

## Struktur Folder ##

Sebagai studi kasus, kita akan membuat aplikasi web yang dihosting dengan nama domain `demo.muhardin.com`. Seluruh file yang terlibat dalam rangkaian artikel ini bisa diambil di [repository Github](https://github.com/endymuhardin/belajar-ssl). Perhatikan juga [history commit](https://github.com/endymuhardin/belajar-ssl/commits/master) untuk mengetahui urutan langkah-langkah yang dilakukan.

Siapkan dua folder, `ca` dan `demo.muhardin.com`. Folder `ca` akan digunakan untuk operasional CA yaitu menyetujui CSR yang masuk. Sedangkan folder `demo.muhardin.com` berisi semua file yang dibutuhkan webserver kita supaya bisa menjalankan HTTPS.

Nantinya bila kita membeli sertifikat berbayar, kita tidak perlu membuat folder `ca` ini.

## Membuat Private Key ##

Kita ingin membuat private key dengan konfigurasi sebagai berikut:

* ukuran key : 2048 bit
* algoritma : RSA
* enkripsi : AES 256 bit

Berikut adalah perintahnya, lakukan di dalam folder `demo.muhardin.com` :

```
openssl genrsa -aes256 2048 > demo.muhardin.com.key
```

Berikut adalah outputnya

```
Generating RSA private key, 2048 bit long modulus
......+++
.................................+++
e is 65537 (0x10001)
Enter pass phrase:
Verifying - Enter pass phrase:
```

Kita diminta passphrase untuk mengenkripsi private key tersebut. Saya masukkan `test1234` sebagai password. Setelah selesai, kita akan mendapatkan satu file bernama `demo.muhardin.com.key`. Isinya adalah private key yang dienkripsi dengan algoritma AES berkekuatan 256 bit.

```
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-256-CBC,425E8DDEEC7FD63F9E67608F7B25BAC5

USIjQCyFsSfj/gbhXC0gT43qM9/4D9qGaEOAX2Ks7lxhs256LJImgeBywbnkzC67
l8ZJQlivxSlIaC658RUcVNNbWwN4EgsczCTSsGjxUxUQ46ay1XUaAbO82oLeZWx7
It0hQ/plno/kkpodtVwOvSks66ZdOIyTZ/IEA4BTMrmdsYi0PHfkbvlHfql9pdSO
8d4cbgQU9nSuGOzXIX1UEMXluTIYBP0aj151bvPeocjeK5WhioldTm+LemfutiMd
2N672BgMkhDeuYBauglChS0Q/fLmcRFM98ys+LcvEMlKtkT7L+vL4Wb7ulwhrOdG
g2ecMvAjcl9RBrSszOWZ6L2xMqvjFo6xS0bras1BVetYbvdC9PEQW0RXycbwzwGL
L9PJuQtKssI3MGTAydeKwrpT0Di27TiLqqb/QNBgJ/954JGLJJmpqVG3bt9YhCe5
DwGASsFysuRxNPCW1C3aQ3qhydA3xgYJZrpdaRAIk/KRwxx+CFrk4oV0dom0kVTx
w6jwjE0BS3q8e+nI42kXAilK84Qd4x6ZMAxM20DNQcucWGMRtJbrvvhJuLgMUNTI
MjOHAqojk9vAu5m4XXCUtXALhMZrepFXjaVTblfyPZ1hhFutiDhZaGzzj5SL1uoY
yLavTih3dQMpNBcOXY0TU/E4nKa0OhdGsNHs3gK9l77nO7IvZABviG2Qq50NuATj
AjvQVNeEiJKdq5FaiHgX+/g7PLNbXUtNWhLZ6jXLc6flQLOuBwiMCR0Ug/46IlTC
DOhsO36MDrMIxRjPgpcH00k9iXOvbuEILWGPjQ/WPNw7UoGEBepQSuIw2zzyD6ai
DHVx2pD60U2anRzvvXzVR7Tf42Tm1fxR4epTdrJIY3LJQtTr2PMCNbcn8+kGfTg1
M+1MCr+WN2pJhpYYr7ACFXFBJc1QLc/wF6/e47bkH3BLxWLZG1KQsLKzLim4teX+
zFvBkOz7SSgDlH0xyogiihjlgZxjRNkk/P5OvtbdKWpOrJh649mw+zwvuN3TmrA0
C/m70olU9QgjLCK3wlgkIr6bj1dS4sDPHghmEtpmp6OC8Ao1R9zDsIhIM1K9+ro7
rE/TzvADeZPg7tzwzRJeTiYq2gN/xxeqlW7YdxGZVPizcfPtqhLnBqzxKeb/uKjT
xuDMlQwZdlTV1QAGB1HKlb3qZdBtyEfUDEkwDL2z66r6roR750DtMnCwTsv9RIAJ
9J2BBIvWjBQiS61p+m5vQ+9ImfqIs6KnZmvbvX5qZvrXRlqyQKdcio87AbqlPNl8
IwrNP5ZePS5fBOJXcqtrecOKB3un+HmqiHqKWl8+O8TaMlgJNwdyw+4etzDWSH11
7AYJJ2SXqIVf0UqZPeYHS7oBsISvP2ekRLAx0XSvxnukBSGolRzyhs8oaRhB3MBr
uJRlKnQAfcFCk1zMNa75CC2vPP2WFMPixaR4HbBQ0pnMQp3KQHCuwmU7miS56EQm
hZVa0yzlKJ/Tiv7Vy+1v0FSiVqWhO5K1p/TG0jcj2tsQ76P2gwXvUZLFnm7bdom2
o8OfPVrr1Btje9+InVqiw2N3pgBBhRmE8ug/IYmz3tU3dxjXvjoJLpklah7ag4s2
-----END RSA PRIVATE KEY-----
```

## Membuat CSR ##
Dengan bermodalkan private key tersebut, kita akan membuat CSR. Berikut perintahnya:

```
openssl req -new -key demo.muhardin.com.key -out demo.muhardin.com.csr
```

Kita akan ditanyai beberapa pertanyaan yang akan kita bahas dibawah. Berikut adalah outputnya.

```
Enter pass phrase for demo.muhardin.com.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:ID
State or Province Name (full name) [Some-State]:DKI Jakarta
Locality Name (eg, city) []:Jakarta Timur
Organization Name (eg, company) [Internet Widgits Pty Ltd]:PT. Endy Muhardin
Organizational Unit Name (eg, section) []:Divisi Teknologi Informasi
Common Name (e.g. server FQDN or YOUR name) []:demo.muhardin.com
Email Address []:endy@muhardin.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```

1. Kita diminta passphrase untuk membuka private key. Masukkan `test1234` seperti yang kita buat pada langkah pertama.
2. Kita akan ditanyai informasi tentang identitas kita. Masukkan sesuai kebutuhan.
3. Kita harus mengisi `Common Name`. Ini penting, terutama kalau kita membeli sertifikat berbayar!! Pastikan kita isi sesuai nama domain yang ingin kita pasangi https. Bila namanya tidak cocok, sertifikatnya akan menimbulkan warning. Saya isi sesuai nama domain yaitu `demo.muhardin.com`.
4. Email address juga harus diisi dengan benar. Ini biasanya digunakan CA untuk melakukan verifikasi.
5. Challenge password dan optional company name tidak saya isi

Hasilnya adalah file CSR bernama `demo.muhardin.com.csr` yang isinya sebagai berikut.

```
-----BEGIN CERTIFICATE REQUEST-----
MIIDADCCAegCAQAwgboxCzAJBgNVBAYTAklEMRQwEgYDVQQIDAtES0kgSmFrYXJ0
YTEWMBQGA1UEBwwNSmFrYXJ0YSBUaW11cjEaMBgGA1UECgwRUFQuIEVuZHkgTXVo
YXJkaW4xIzAhBgNVBAsMGkRpdmlzaSBUZWtub2xvZ2kgSW5mb3JtYXNpMRowGAYD
VQQDDBFkZW1vLm11aGFyZGluLmNvbTEgMB4GCSqGSIb3DQEJARYRZW5keUBtdWhh
cmRpbi5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/CYCB6xU9
j6k0JwB4TwF2hI+H41fH1fG1J/ZZPO3tXaJuibrXOnJNMAXD+GkSv/fOA45uIcX4
6vvULXNz/fS8z3+RkVdrQ/BH2MBMeHjlU3duPYhv6c3yUVmZr7IsViBhTswT1VG9
ZAq57lmjc/DTI/8PjGFvA64pzeWce3yTAmu30zwnDQ22m5gGOfPMfsf2TTW3B1eS
Nv5WmlAIr6DtB4KxeCMXoKnIzBTDpqkeEf+MuIsqCw4/eXnWgBHZH66VIAy/9ygk
hvX2dQNaMAZoExOfAEWVYtzgW84t0j+CwSgxQuk/nvjknE5TGXOrhjZg8mn0eXZK
mmReIsYwjc09AgMBAAGgADANBgkqhkiG9w0BAQUFAAOCAQEAlbGTK4M2/wCHjg9p
aveomNfU/9qvcK7YTBNNET/ryZGcDCWmG8td01BeSeJUHhqjdxFWHBFsdg+aK5L1
xNd/eKG6NT7obviVHZGPVU2xMAIEOjx1xBP3FNbpIkuvapXcUxGBFlKy5aEmX2oo
/XYyu582J69t9HeDxVBKpdHoLEfwnvTGytka4GRwDZBwiDHTWYlKeBONUUCqO1/L
cd6GqFek37YPoP8ZfMIwTMDGrnCpcK0Z/nhkOZKAgfLtbHgHxvDG1ZUiul1hCLiY
U+us6wgir1kbWXN9Jg6IFlN3ZeLQ4ahDSkIvmLO34ujtFwlq870qJArcW57Po5Pl
3/bddQ==
-----END CERTIFICATE REQUEST-----
```

File CSR ini akan dikirim pemilik domain ke CA, biasanya melalui email.

Selesailah bagian pemilik domain. Selanjutnya kita akan berpura-pura menjadi CA.

## CA menyetujui CSR dari pemilik domain ##

### Kelengkapan CA ###

Sebelum bisa menyetujui, kita sediakan dulu kelengkapan CA, yaitu:

* private key CA
* sertifikat CA

### Private Key CA ###

Private key CA dibuat dengan perintah yang sama seperti pembuatan private key domain di atas.

```
openssl genrsa -aes256 2048 > ca.key
```

Seperti sebelumnya, kita juga akan dimintai passphrase.

```
Generating RSA private key, 2048 bit long modulus
..+++
.............................................................+++
e is 65537 (0x10001)
Enter pass phrase:
Verifying - Enter pass phrase:
```

Saya gunakan `testca1234` sebagai passphrasenya. Hasilnya adalah file `ca.key` berisi text sebagai berikut

```
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-256-CBC,B7E9F6A263310662657F6B7052CE5CA0

7JX037X9M4Eqsr+BdM/27pj6ADtJIGAYQpHAFoZawhrmArW0PScnjbh/B1R06z3K
ej4HewKQB+SqCznHhmFpJmAuBpb0+snMZuoI3lm1zcRFUs8OSsLLd1B1w4USJlYN
K9mzLqQMlZrl56W9c4QthOegjkqE7RHleierWW3X2VqtWD29GISE8yi9mSb/hSaN
iATuMUaO8etM21F1MZownxKeetfBHJF2Y0XNt9AamrL8+gvb/dE2pPn8Zi2tlR3O
eoUX/FKaa0aV+f6e3X8IRivFp01mnT5UFm1OyDhDrQ1OL0tNzIlLMLqlk8o9njJ0
bBTlDAp5yZFbxtb/GZ94S8x9Nqql5ymVGFTC3BfE0TAfWMIH8YRYEVqMK8YLbGyg
M0vkDpV6impYgaTzJdICVdvOzb7rU9TnvkWsMrp3SRpSqoCtst6yDD59kXBgbPBq
Mj9QeCSXh8jf3LkKq2evSpJ6GlbCzR5EXeWCFcevsHY2xN//jA8v5UPtBOtojYu2
/uyAipnwctj+FEXki1BJwNrPuygzxibImJF3K4u83BkA2bBwIionufr71fNyUNai
2ToKPmxEgOFWGqypSsAw/GUw0LVseg4OlD+Ci2PCYPSwzcvkwulCklXOv8oIuXPb
hsoTVin67c5diok6ayqgyZuMLVIJKr2CAK+Gm77EO652SaIGJtdx5+DBs4BP/XF/
flgwG6DFpft2q93qaYqLPv2LqXAzsP6ACXBRjbPLUMkjv8Sg4iijy1siCxI9i9+N
harFVLRSagFy0dXDw/Wur42xsypcTCMY9kujszx0P4+1BO+vkdNCpSWWofgcIFhI
nZwLpHm9YZ5Sb7GxigBXh7dXc4Q+y2X8xvTg3Xdf+Cew4LpFktAByunUDjw4hjv4
iy56Rvx7lcxlmpwxXw3ZQTZinkSM7f7wqZjvH4E+wt5ShlPrFUGl3d2hmJ2thOTl
hWJ9CYZDDV02UtfYRVqpyY2BCKG3d4YfkUprfGs38/eJMA5zCUi8Uy6eJNu8t4gI
d55PEBltgyMOw8I4M3anbdYwphjhdlQPkbpbsA+AkV+m5dRIjSLxNSG1wXXyVuhI
vMLfrZ3uIKEkn9YXkb59lDx2E8NCmBU7hcV+w7hLu12q8CRCPZZNjnsbNa3Zg4X3
sBN78ak5OOp4thLRSeykpHdPn8sWyyk9RPGaAHv2Y3n4zv5P9JqZe4hA14sAjxj1
Ur+0gLfWoWQwu68F6fsOvngQnMjQneJaSHjhFdGr+HXdzOFqP9u6nxb9LpeFMTX9
i6Ut2IVvTL55LN5TT/U0mcvQo0C/k+31ABNTrsWhv3mkoj92RzWBGoj+1bM1NbeA
foSmmX674LnSUQvqlmsSOtDG5PCVBz+J5C+cmcGp98QFX5ViC2hVi3R+ItPbIirS
7NjJzXZ/f3yz8TOr5MU+I4aYtYNDMvzU8dArTHE8fU++dBTCj2F0KvpIGZlRpHf8
D6AA0a/9VNpwUyILeWD8rjdDiIvx3xPIODMZaN5SJFFAtbDKy9AhU1JCsNAjYdLz
crBRgAwXpcGHOTeDZr+nevcSo8sm7gsqyXcJ6c8r8urnOAKWhvptxGzy6LG8XqPQ
-----END RSA PRIVATE KEY-----
```

### Sertifikat CA ###

Selanjutnya kita buat sertifikat berisi informasi tentang CA palsu kita ini. Sertifikat ini yang akan kita gunakan untuk menyetujui CSR dari pemilik domain. Berikut perintahnya

```
openssl req -new -x509 -days 3650 -key ca.key > ca.crt
```

Perintah di atas akan membuat sertifikat dengan [format X-509](http://en.wikipedia.org/wiki/X.509#Structure_of_a_certificate), berlaku selama 10 tahun (3650 hari), menggunakan private key dalam file `ca.key`. Sertifikat ini akan ditulis ke file `ca.crt`. Kita juga akan ditanyai beberapa informasi tentang CA palsu yang kita buat ini. Berikut output dari perintah di atas

```
Enter pass phrase for ca.key:
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:ID
State or Province Name (full name) [Some-State]:DKI Jakarta
Locality Name (eg, city) []:Jakarta Timur
Organization Name (eg, company) [Internet Widgits Pty Ltd]:CA Palsu
Organizational Unit Name (eg, section) []:Divisi Sertifikasi
Common Name (e.g. server FQDN or YOUR name) []:ROOT CA Palsu
Email Address []:
```

Berikut adalah isi file `ca.crt`

```
-----BEGIN CERTIFICATE-----
MIIEKzCCAxOgAwIBAgIJAKHgEOaDGy3mMA0GCSqGSIb3DQEBBQUAMIGrMQswCQYD
VQQGEwJJRDEUMBIGA1UECAwLREtJIEpha2FydGExFjAUBgNVBAcMDUpha2FydGEg
VGltdXIxETAPBgNVBAoMCENBIFBhbHN1MRswGQYDVQQLDBJEaXZpc2kgU2VydGlm
aWthc2kxFjAUBgNVBAMMDVJPT1QgQ0EgUGFsc3UxJjAkBgkqhkiG9w0BCQEWF2Vu
ZHkubXVoYXJkaW5AZ21haWwuY29tMB4XDTEzMDcwOTA0MDg1MloXDTIzMDcwNzA0
MDg1MlowgasxCzAJBgNVBAYTAklEMRQwEgYDVQQIDAtES0kgSmFrYXJ0YTEWMBQG
A1UEBwwNSmFrYXJ0YSBUaW11cjERMA8GA1UECgwIQ0EgUGFsc3UxGzAZBgNVBAsM
EkRpdmlzaSBTZXJ0aWZpa2FzaTEWMBQGA1UEAwwNUk9PVCBDQSBQYWxzdTEmMCQG
CSqGSIb3DQEJARYXZW5keS5tdWhhcmRpbkBnbWFpbC5jb20wggEiMA0GCSqGSIb3
DQEBAQUAA4IBDwAwggEKAoIBAQDda7cS/4qag6APajdqT7krxQOZZkYaCwzafZZN
P9ANwIfUvwB2DOMVLFDFf8DM/Y/hcm8lQAamTNnQ+b58X8oOqOwKX2Y6uPUau+n3
fCY4oTFhdYsbJHOW/hmTZXk+Exg3DHP+aFG7frUn39f8IuIGqujHIuWZfdokQFg8
AaheYdvigtIv3FBqxSCbNIYhmhkhZnrQvJbfbD92n1cHB91eYT9Mj2Z7tFt0ykVV
iQrOQ1n+CmMFUGheSD8Rnsi2ApsnBAsAj6ZruH1S+ZJJW+irZnbQE5LAsgUqjJYf
IFYMoVphTTEMVfoizj2JvspzinufX11V6lylPl0P7EhQvkNJAgMBAAGjUDBOMB0G
A1UdDgQWBBQ0c0rLkgOxJHxuBYyd3xeUVMHzxzAfBgNVHSMEGDAWgBQ0c0rLkgOx
JHxuBYyd3xeUVMHzxzAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4IBAQBQ
W4t7WMj0FrVcxi/+W/jlAJ2BKGYev68bJiEeLVzbDHN3CQhfQwMWD0L0v6icP3c8
SLeGR+PEcq7FwGHb6gpIySVlnl8bxzRFK2lqfo+672djwtP0F/mrDKTDSzoIkPOq
G53otMXIAoplWDU7SRZE489AWfwOCCSmUJke9sEh1YYQwRVU7ceWSZLbRgfmzLeY
xjIfF/KBZrs8CMbYCEqHHHX5XAtIEP+3KSAbzfoxv/a07+FE+5/r5E6aXEBSbVme
y79zpM9VIV8FLlZr/+TITXqLKOBMmCmTVM1h1LJ8IjmWx9L6v631DX3/tc67HMoa
fauYxPo71IRYfIAN4RQ5
-----END CERTIFICATE-----
```

Informasi di dalam sertifikat tersebut bisa kita lihat dengan perintah berikut

```
openssl x509 -noout -text -in ca.crt
```

Ini adalah hasilnya

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 11664341617117703654 (0xa1e010e6831b2de6)
    Signature Algorithm: sha1WithRSAEncryption
        Issuer: C=ID, ST=DKI Jakarta, L=Jakarta Timur, O=CA Palsu, 
                OU=Divisi Sertifikasi, 
                CN=ROOT CA Palsu
        Validity
            Not Before: Jul  9 04:08:52 2013 GMT
            Not After : Jul  7 04:08:52 2023 GMT
        Subject: C=ID, ST=DKI Jakarta, L=Jakarta Timur, O=CA Palsu, 
                 OU=Divisi Sertifikasi, 
                 CN=ROOT CA Palsu
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:dd:6b:b7:12:ff:8a:9a:83:a0:0f:6a:37:6a:4f:
                    b9:2b:c5:03:99:66:46:1a:0b:0c:da:7d:96:4d:3f:
                    d0:0d:c0:87:d4:bf:00:76:0c:e3:15:2c:50:c5:7f:
                    c0:cc:fd:8f:e1:72:6f:25:40:06:a6:4c:d9:d0:f9:
                    be:7c:5f:ca:0e:a8:ec:0a:5f:66:3a:b8:f5:1a:bb:
                    e9:f7:7c:26:38:a1:31:61:75:8b:1b:24:73:96:fe:
                    19:93:65:79:3e:13:18:37:0c:73:fe:68:51:bb:7e:
                    b5:27:df:d7:fc:22:e2:06:aa:e8:c7:22:e5:99:7d:
                    da:24:40:58:3c:01:a8:5e:61:db:e2:82:d2:2f:dc:
                    50:6a:c5:20:9b:34:86:21:9a:19:21:66:7a:d0:bc:
                    96:df:6c:3f:76:9f:57:07:07:dd:5e:61:3f:4c:8f:
                    66:7b:b4:5b:74:ca:45:55:89:0a:ce:43:59:fe:0a:
                    63:05:50:68:5e:48:3f:11:9e:c8:b6:02:9b:27:04:
                    0b:00:8f:a6:6b:b8:7d:52:f9:92:49:5b:e8:ab:66:
                    76:d0:13:92:c0:b2:05:2a:8c:96:1f:20:56:0c:a1:
                    5a:61:4d:31:0c:55:fa:22:ce:3d:89:be:ca:73:8a:
                    7b:9f:5f:5d:55:ea:5c:a5:3e:5d:0f:ec:48:50:be:
                    43:49
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Subject Key Identifier: 
                34:73:4A:CB:92:03:B1:24:7C:6E:05:8C:9D:DF:17:94:54:C1:F3:C7
            X509v3 Authority Key Identifier: 
                keyid:34:73:4A:CB:92:03:B1:24:7C:6E:05:8C:9D:DF:17:94:54:C1:F3:C7

            X509v3 Basic Constraints: 
                CA:TRUE
    Signature Algorithm: sha1WithRSAEncryption
         50:5b:8b:7b:58:c8:f4:16:b5:5c:c6:2f:fe:5b:f8:e5:00:9d:
         81:28:66:1e:bf:af:1b:26:21:1e:2d:5c:db:0c:73:77:09:08:
         5f:43:03:16:0f:42:f4:bf:a8:9c:3f:77:3c:48:b7:86:47:e3:
         c4:72:ae:c5:c0:61:db:ea:0a:48:c9:25:65:9e:5f:1b:c7:34:
         45:2b:69:6a:7e:8f:ba:ef:67:63:c2:d3:f4:17:f9:ab:0c:a4:
         c3:4b:3a:08:90:f3:aa:1b:9d:e8:b4:c5:c8:02:8a:65:58:35:
         3b:49:16:44:e3:cf:40:59:fc:0e:08:24:a6:50:99:1e:f6:c1:
         21:d5:86:10:c1:15:54:ed:c7:96:49:92:db:46:07:e6:cc:b7:
         98:c6:32:1f:17:f2:81:66:bb:3c:08:c6:d8:08:4a:87:1c:75:
         f9:5c:0b:48:10:ff:b7:29:20:1b:cd:fa:31:bf:f6:b4:ef:e1:
         44:fb:9f:eb:e4:4e:9a:5c:40:52:6d:59:9e:cb:bf:73:a4:cf:
         55:21:5f:05:2e:56:6b:ff:e4:c8:4d:7a:8b:28:e0:4c:98:29:
         93:54:cd:61:d4:b2:7c:22:39:96:c7:d2:fa:bf:ad:f5:0d:7d:
         ff:b5:ce:bb:1c:ca:1a:7d:ab:98:c4:fa:3b:d4:84:58:7c:80:
         0d:e1:14:39
```

### Konfigurasi CA ###

CA yang asli biasanya memiliki banyak private key dan certificate turunan. 
Dari private key dan certificate yang utama (Root), dia akan membuat beberapa private key dan certificate lain. 
Ini karena CA yang besar biasanya memiliki banyak reseller untuk menjualkan sertifikat SSL.
Untuk membatasi resiko dan juga memudahkan pendataan, request dari pelanggan masing-masing reseller disetujui dengan certificate turunan yang diperuntukkan khusus untuk reseller tersebut. Dengan demikian, bila terjadi masalah dengan reseller tersebut, 
cukup certificate turunan yang khusus untuk reseller tersebut yang dibatalkan. Certificate turunan ini disebut dengan istilah `intermediate CA certificate`.

Pada waktu pembuatan signature terhadap CSR, ada banyak informasi yang dibutuhkan. Apalagi kalau suatu CA memiliki banyak intermediate certificate, masing-masing intermediate certificate tersebut berbeda informasi `issuer` nya. Contohnya, suatu CA memiliki lini produk seperti ini:

* Gratis : hanya berlaku 30 hari
* Standar : berlaku 1 tahun, untuk satu domain
* Enterprise : berlaku 1 tahun, multi domain
* dan sebagainya

Agar berbagai kategori di atas mudah dikelola, kita akan membuat file konfigurasi. Kita beri nama `openssl-config.txt` dan berisi seperti ini

```
[ca]
default_ca         = ca-palsu


[ca-palsu]
dir                = ca-palsu

# sertifikat dan private key CA
certificate        = $dir/ca.crt
private_key        = $dir/ca.key

# Folder penyimpanan
cert               = $dir/sertifikat-customer
new_certs_dir      = $dir/sertifikat-customer
crl                = $dir/sertifikat-batal

# Database sertifikat yang sudah dikeluarkan
database           = $dir/database.txt
serial             = $dir/serial.txt

# Nilai default untuk sertifikat baru
default_days       = 365               # masa berlaku sertifikat customer
default_crl_days   = 30                # masa berlaku daftar pembatalan sertifikat
default_md         = sha1
x509_extensions    = usr_cert

# Konfigurasi tambahan
policy = policy-saya
x509_extensions = certificate_extensions

[ policy-saya ]
# Gunakan informasi dalam CSR
commonName = supplied
stateOrProvinceName = supplied
countryName = supplied
emailAddress = supplied
organizationName = supplied
organizationalUnitName = optional

[ certificate_extensions ]
# Sertifikat customer tidak boleh jadi CA
basicConstraints = CA:false

[ req ]
# private key yang digunakan untuk menyetujui CSR
default_keyfile = ca-palsu/ca.key
```

Konfigurasi di atas berisi satu CA (tanpa intermediate certificate). Bila nantinya kita mau membuat beberapa CA, baik sebagai Root CA maupun Intermediate CA, kita tinggal copy-paste konfigurasi untuk `ca-palsu`. 

Root CA kita `ca-palsu` kita buatkan folder tersendiri untuk menyimpan file-filenya. Kita masukkan private key dan certificate dirinya sendiri. Kemudian, kita juga membutuhkan file database dan serial. File database gunanya untuk menyimpan data semua sertifikat yang pernah diterbitkan oleh CA `ca-palsu`. Karena database ini merupakan file text biasa, bukan database server seperti MySQL atau Oracle, maka kita perlu bantu `openssl` untuk membuatkan serial number dengan cara menyediakan file text lain bernama `serial.txt`. Di sini `openssl` bisa mencatat nomer terakhir yang sudah terpakai. Untuk data awal, kita isi saja nilai `1000` dengan perintah berikut

```
echo 1000 > ca-palsu/serial.txt
``` 

Kita buatkan juga file `database.txt`, karena `openssl` tidak bisa membuat sendiri. Cukup gunakan perintah `touch` di Linux.

```
touch ca-palsu/database.txt
touch ca-palsu/database.txt.attr
```

Bila sulit dibayangkan, langsung saja lihat [struktur foldernya di Github](https://github.com/endymuhardin/belajar-ssl/tree/10c1f7302226b07ac31505dc24e8fdf6091dfee9/ca). Di Github kita juga bisa lihat versi awal dari [serial.txt](https://github.com/endymuhardin/belajar-ssl/blob/10c1f7302226b07ac31505dc24e8fdf6091dfee9/ca/ca-palsu/serial.txt), [database.txt](https://github.com/endymuhardin/belajar-ssl/blob/10c1f7302226b07ac31505dc24e8fdf6091dfee9/ca/ca-palsu/database.txt), dan [database.txt.attr](https://github.com/endymuhardin/belajar-ssl/blob/10c1f7302226b07ac31505dc24e8fdf6091dfee9/ca/ca-palsu/database.txt.attr).

Jangan heran bila `database.txt` dan `database.txt.attr` tidak ada isinya. Memang harusnya seperti itu.

Sekarang kita siap membuatkan signature untuk CSR dari `demo.muhardin.com`

### Membuat signature CSR dengan Sertifikat CA ###

CA menerima CSR dari pemilik domain. Untuk simulasinya, kita copy saja file CSR ke folder `ca-palsu/sertifikat-request`.
Setelah diterima, seharusnya CA melakukan verifikasi terhadap pemilik domain `demo.muhardin.com`. Prosedur verifikasi yang asli akan kita bahas di artikel berikutnya. Kita asumsikan saja verifikasi berjalan sukses, sehingga kita bisa langsung membuatkan signaturenya.

Berikut adalah perintah untuk membuatkan signature dengan menggunakan CA `ca-palsu`.

```
openssl ca -config openssl-config.txt -in ca-palsu/sertifikat-request/demo.muhardin.com.csr
```

OpenSSL akan menanyakan password untuk private key `ca-palsu`, kemudian membuatkan sertifikat baru sesuai konfigurasi `new_certs_dir` dalam `openssl-config.txt`. Berikut output perintah di atas.

```
Using configuration from openssl-config.txt
Enter pass phrase for ca-palsu/ca.key:
Check that the request matches the signature
Signature ok
The Subject's Distinguished Name is as follows
countryName           :PRINTABLE:'ID'
stateOrProvinceName   :ASN.1 12:'DKI Jakarta'
localityName          :ASN.1 12:'Jakarta Timur'
organizationName      :ASN.1 12:'PT. Endy Muhardin'
organizationalUnitName:ASN.1 12:'Divisi Teknologi Informasi'
commonName            :ASN.1 12:'demo.muhardin.com'
emailAddress          :IA5STRING:'endy@muhardin.com'
Certificate is to be certified until Jul  9 05:48:04 2014 GMT (365 days)
Sign the certificate? [y/n]:y


1 out of 1 certificate requests certified, commit? [y/n]y
Write out database with 1 new entries
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 4096 (0x1000)
    Signature Algorithm: sha1WithRSAEncryption
        Issuer: C=ID, ST=DKI Jakarta, L=Jakarta Timur, 
                O=CA Palsu, OU=Divisi Sertifikasi, CN=ROOT CA Palsu
        Validity
            Not Before: Jul  9 05:48:04 2013 GMT
            Not After : Jul  9 05:48:04 2014 GMT
        Subject: CN=demo.muhardin.com, ST=DKI Jakarta, 
                 C=ID/emailAddress=endy@muhardin.com, 
                 O=PT. Endy Muhardin, OU=Divisi Teknologi Informasi
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                Public-Key: (2048 bit)
                Modulus:
                    00:bf:09:80:81:eb:15:3d:8f:a9:34:27:00:78:4f:
                    01:76:84:8f:87:e3:57:c7:d5:f1:b5:27:f6:59:3c:
                    ed:ed:5d:a2:6e:89:ba:d7:3a:72:4d:30:05:c3:f8:
                    69:12:bf:f7:ce:03:8e:6e:21:c5:f8:ea:fb:d4:2d:
                    73:73:fd:f4:bc:cf:7f:91:91:57:6b:43:f0:47:d8:
                    c0:4c:78:78:e5:53:77:6e:3d:88:6f:e9:cd:f2:51:
                    59:99:af:b2:2c:56:20:61:4e:cc:13:d5:51:bd:64:
                    0a:b9:ee:59:a3:73:f0:d3:23:ff:0f:8c:61:6f:03:
                    ae:29:cd:e5:9c:7b:7c:93:02:6b:b7:d3:3c:27:0d:
                    0d:b6:9b:98:06:39:f3:cc:7e:c7:f6:4d:35:b7:07:
                    57:92:36:fe:56:9a:50:08:af:a0:ed:07:82:b1:78:
                    23:17:a0:a9:c8:cc:14:c3:a6:a9:1e:11:ff:8c:b8:
                    8b:2a:0b:0e:3f:79:79:d6:80:11:d9:1f:ae:95:20:
                    0c:bf:f7:28:24:86:f5:f6:75:03:5a:30:06:68:13:
                    13:9f:00:45:95:62:dc:e0:5b:ce:2d:d2:3f:82:c1:
                    28:31:42:e9:3f:9e:f8:e4:9c:4e:53:19:73:ab:86:
                    36:60:f2:69:f4:79:76:4a:9a:64:5e:22:c6:30:8d:
                    cd:3d
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints: 
                CA:FALSE
    Signature Algorithm: sha1WithRSAEncryption
         2e:1e:b9:4b:e4:ad:74:34:1c:7c:46:9c:d5:d8:83:db:da:b7:
         b9:a0:ad:c5:54:f7:f2:51:c1:8f:77:70:ae:b4:a1:f6:9d:40:
         ec:d5:55:76:0d:d0:d3:1b:36:ca:8b:bb:64:52:a8:ca:95:18:
         5d:d1:28:47:e9:46:89:72:16:8e:57:b9:97:ac:93:c3:5d:6e:
         17:ac:b3:91:87:61:26:a7:c6:6e:35:d9:03:92:cb:06:08:e5:
         93:83:89:fb:44:6b:b9:78:b5:b7:e5:d4:84:47:3e:0e:26:40:
         ec:4e:7a:6f:c1:76:75:b6:6c:f2:ef:c5:97:46:8e:d5:1b:1a:
         67:95:1e:3e:d7:56:91:43:6d:a2:7a:e7:a4:bd:29:f0:1a:67:
         62:d0:83:35:45:96:19:1f:c8:ee:cf:27:3e:f7:9b:11:cc:b3:
         a8:dd:e6:b4:8a:85:c2:69:36:4f:0c:c3:50:f4:3a:30:e0:3a:
         f6:6a:2b:72:4e:a3:44:0f:af:73:06:8e:fd:20:d3:4b:99:f5:
         8b:72:f8:f6:21:3c:f4:03:ce:4d:bc:b2:e1:11:29:0d:3d:80:
         23:41:72:d1:fb:28:f0:32:cf:49:56:5d:cc:e3:a7:dc:88:5c:
         61:8f:36:9b:bc:28:df:81:89:4a:e6:7f:06:7e:45:9f:19:f8:
         83:ca:1b:df
-----BEGIN CERTIFICATE-----
MIIDsDCCApigAwIBAgICEAAwDQYJKoZIhvcNAQEFBQAwgYMxCzAJBgNVBAYTAklE
MRQwEgYDVQQIDAtES0kgSmFrYXJ0YTEWMBQGA1UEBwwNSmFrYXJ0YSBUaW11cjER
MA8GA1UECgwIQ0EgUGFsc3UxGzAZBgNVBAsMEkRpdmlzaSBTZXJ0aWZpa2FzaTEW
MBQGA1UEAwwNUk9PVCBDQSBQYWxzdTAeFw0xMzA3MDkwNTQ4MDRaFw0xNDA3MDkw
NTQ4MDRaMIGiMRowGAYDVQQDDBFkZW1vLm11aGFyZGluLmNvbTEUMBIGA1UECAwL
REtJIEpha2FydGExCzAJBgNVBAYTAklEMSAwHgYJKoZIhvcNAQkBFhFlbmR5QG11
aGFyZGluLmNvbTEaMBgGA1UECgwRUFQuIEVuZHkgTXVoYXJkaW4xIzAhBgNVBAsM
GkRpdmlzaSBUZWtub2xvZ2kgSW5mb3JtYXNpMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEAvwmAgesVPY+pNCcAeE8BdoSPh+NXx9XxtSf2WTzt7V2ibom6
1zpyTTAFw/hpEr/3zgOObiHF+Or71C1zc/30vM9/kZFXa0PwR9jATHh45VN3bj2I
b+nN8lFZma+yLFYgYU7ME9VRvWQKue5Zo3Pw0yP/D4xhbwOuKc3lnHt8kwJrt9M8
Jw0NtpuYBjnzzH7H9k01twdXkjb+VppQCK+g7QeCsXgjF6CpyMwUw6apHhH/jLiL
KgsOP3l51oAR2R+ulSAMv/coJIb19nUDWjAGaBMTnwBFlWLc4FvOLdI/gsEoMULp
P5745JxOUxlzq4Y2YPJp9Hl2SppkXiLGMI3NPQIDAQABow0wCzAJBgNVHRMEAjAA
MA0GCSqGSIb3DQEBBQUAA4IBAQAuHrlL5K10NBx8RpzV2IPb2re5oK3FVPfyUcGP
d3CutKH2nUDs1VV2DdDTGzbKi7tkUqjKlRhd0ShH6UaJchaOV7mXrJPDXW4XrLOR
h2Emp8ZuNdkDkssGCOWTg4n7RGu5eLW35dSERz4OJkDsTnpvwXZ1tmzy78WXRo7V
GxpnlR4+11aRQ22ieuekvSnwGmdi0IM1RZYZH8juzyc+95sRzLOo3ea0ioXCaTZP
DMNQ9Dow4Dr2aityTqNED69zBo79INNLmfWLcvj2ITz0A85NvLLhESkNPYAjQXLR
+yjwMs9JVl3M46fciFxhjzabvCjfgYlK5n8GfkWfGfiDyhvf
-----END CERTIFICATE-----
Data Base Updated
```

Setelah sukses, `openssl` akan membuatkan sertifikat yang sudah ditandatangani menggunakan private key `ca-palsu`. Berikut daftar file/folder yang terdampak selama proses ini:

* serial.txt : tadinya berisi 1000, sekarang berisi 1001
* database.txt : tadinya kosong, sekarang ada satu baris berisi informasi sertifikat yang baru saja dibuat
* folder sertifikat-customer : tadinya kosong, sekarang berisi satu file sertifikat untuk `demo.muhardin.com` dengan nama file `1000.pem`

Daftar perubahan ini bisa [dilihat di Github](https://github.com/endymuhardin/belajar-ssl/commit/f950bdfb866be9da7a80e613b7d95bf282454b05).

Selanjutnya, CA akan mengirimkan file `1000.pem` tersebut ke pemilik domain `demo.muhardin.com`.

## Kelengkapan File Pemilik Domain ##

Setelah menerima file `100.pem` dari CA, pemilik domain `demo.muhardin.com` akan memiliki file berikut:

* File private key : `demo.muhardin.com.key`
* File CSR : `demo.muhardin.com.csr`. File ini [boleh dihapus setelah kita menerima sertifikat yang telah disahkan oleh CA](http://security.stackexchange.com/questions/32857/could-i-delete-csr-files-when-the-key-is-signed-by-ca).
* File sertifikat dari CA : `1000.pem`. Agar lebih jelas, kita rename saja menjadi `demo.muhardin.com.crt`.

Demikianlah langkah-langkah membuat self-signed certificate. Pada artikel berikutnya, kita akan membahas bagaimana [cara membeli sertifikat](http://software.endy.muhardin.com/aplikasi/membeli-sertifikat-ssl/). Kemudian memasang sertifikat (baik yang self-signed maupun yang berbayar) ke webserver kita.
