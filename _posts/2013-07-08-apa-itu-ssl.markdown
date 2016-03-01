---
layout: post
title: "Apa itu SSL"
date: 2013-07-08 17:52
comments: true
categories: 
- aplikasi
---

SSL adalah protokol keamanan yang kita gunakan sehari-hari. Sebagai programmer, kita harus paham konsep SSL dan bisa memanfaatkannya dalam aplikasi yang kita buat.

Artikel ini adalah bagian pertama dari 4 artikel, yaitu:

1. [Apa itu SSL](http://software.endy.muhardin.com/aplikasi/apa-itu-ssl/)
2. [Membuat self-signed certificate](http://software.endy.muhardin.com/aplikasi/membuat-self-signed-certificate/)
3. [Membeli sertifikat SSL](http://software.endy.muhardin.com/aplikasi/membeli-sertifikat-ssl/)
4. [Memasang sertifikat SSL](http://software.endy.muhardin.com/aplikasi/memasang-sertifikat-ssl/)


<!--more-->

[SSL adalah singkatan dari Secure Socket Layer, juga dikenal dengan istilah Transport Secure Layer (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security).

Ada beberapa keuntungan bila kita menggunakan SSL, yaitu:

* kerahasiaan (confidentiality)
* identifikasi (authentication)

Kerahasiaan diperlukan bila kita mengirim informasi yang tidak noleh diketahui orang lain, misalnya username dan password pada saat mengisi halaman login. Kita tidak ingin ada orang lain yang menyadap trafik internet kita dan mengintip password kita ([eavesdropping](http://en.wikipedia.org/wiki/Eavesdropping)).

Identifikasi diperlukan untuk memastikan identitas suatu layanan/aplikasi. Misalnya kita mengakses situs internet banking, kita butuh keyakinan bahwa yang kita akses adalah aplikasi yang asli. Tidak dimanipulasi orang di tengah jalan ([man in the middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)) ataupun diganti dengan situs palsu ([phising](https://en.wikipedia.org/wiki/Phishing)).

Untuk bisa memahami apa itu SSL, ada beberapa konsep yang perlu kita pahami yaitu:

* identitas
* trust model
* public key infrastructure
* dasar-dasar enkripsi

Dengan memahami beberapa istilah di atas, nanti kita akan memahami dari mana datangnya fitur SSL seperti kerahasiaan dan identifikasi.

## Identitas ##

Coba kunjungi website internet banking seperti [KlikBCA](https://ibank.klikbca.com/) dan [Bank Mandiri](https://ib.bankmandiri.co.id/retail/Login.do?action=form&lang=in_ID). Bagaimana kita memastikan bahwa kedua situs barusan asli dikelola oleh bank masing-masing? Bila Anda klik link di atas, bagaimana Anda yakin bahwa saya tidak mengarahkan Anda ke situs saya sendiri yang mirip dengan situs aslinya?

Di kehidupan sehari-hari, kita biasa memastikan identitas seseorang dengan beberapa cara, misalnya:

* menyuruh orang tersebut menulis tandatangan, kemudian dibandingkan dengan KTP, SIM, atau bukti identitas lain.
* mengambil sidik jarinya (pakai tinta ataupun fingerprint scanner), dan dibandingkan dengan data yang sudah kita miliki sebelumnya.
* membandingkan sidik mata (iris) dengan database.

Manapun cara yang kita gunakan, ada satu kesamaan. Kita akan memeriksa informasi/benda yang hanya bisa dimiliki pemegang aslinya. Tentu semua hal bisa dipalsukan, tapi untuk menyederhanakan masalah, kita bisa asumsikan bahwa tandatangan, sidik jari, dan sidik mata hanya bisa dimiliki oleh orang yang asli.

Website yang kita akses ditaruh di server. Tentunya server tidak memiliki anggota tubuh yang bisa dipastikan keunikannya. Untuk itu, kita membuat padanan sidik jari, yaitu suatu file yang disebut `private key`. File ini bisa kita buat di server itu sendiri, ataupun bisa kita buat di laptop dan kemudian dipasang (copy-paste/upload) ke server tersebut. Private key ini harus kita lindungi dengan baik. Karena bila orang lain sampai bisa mendapatkannya, sama saja dengan kita menyerahkan jari kita ke orang lain ataupun mengajari orang membuat tanda tangan kita. 

Private key bentuknya adalah file text biasa yang isinya seperti ini

```
-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-256-CBC,1CB1AC44166F92FA3817B5E95EDBF1E5

rhH0ueRW1uxTa2w2wY1r9bkm9eyFjDzXLAHMGoMpDyCCYiYQ4/BmFYx+68ElsYPO
+tV2iRz4OXthU2SXK+StBZYtE27BSUMbrR6NXNkZFCs9sEYGsJzoiyT/caHYr4p3
8gI+SJQc215oJdltpS8jML8Ygg3FCfOQoxnR9Ior0W3EKQtUbzsnkHLGH9s06Y8B
RyHb9hKB5YCiWBFo3lH4wfvSxb5A68s0hH0enGu6F/216TLis733E6PEgnhjwUvp
FTuKzie+UXWGRjNwPNUIYh74hmS3vfaj4c0tKDzrNcuO7tZmMGEEOJICyBjEMmDO
0PAUe+Cy0KqkckYfJCS8cN1lAgWuR1NrqaCezt87qVEbr3Om1H6z45ObwGNdnfUi
uncFPqkUrjRYriB6xt6+Lg2iyk2dhbwrU6vMxDG3VPvMiAvXXYBlUBPi4xlpKv28
awuLpaSM4yegiZO2wTjRoHECJJVHSADQ7KVRlCc5fRe+3QyIYRQmYG/u44J+ykDK
Fx7nvTSHy/qDsDYrmacHIJJAdzoxiWIDJ2MedvYdamJ6EGH2Zk+xBOpV+ss4slhq
nStKIUA0qR9Wnh3KicubosKsNo8yp3uzrNRO/f+cQdmItjMLjosOOKhIDNgD3xCv
csGziNQMq+iJ0mt6ntu+B+ETsaVsD4HspkxZpL9JHnqGKvn46DtJuvBeJ9TTQkZo
1doFj/wwk6ljNtibYWYpPFDaP9f7XAtlm6RQ+0Vm/X6pwTUKZA9/5ABqJ9YYIaIg
TvOgX1e5RpCANBKjXvQpuEyHsk24QzG5Q8tMuqBeXALl+I8XDFAVgkNBmeObp5Nw
02lQqb53t5sg4CN3+prtG18c1xU+g7t1mb3so/86ZHrZxY08Ykf+7Y1yO1rOBqkc
fRkhegMVWYzzxtE82FI2gp9cwDRTix1CAwRSMjItQnHua5il5UvigkIQLmZW96kV
Hh/CxZMyevcLMZHUdPrpiuA4fZBh4EA0Z0JXQy69bAe3gnAbw0ky0zsC5RttXGol
cfPCHKCKgvGVMDw6b+f9NhQQKlzjCscA+CbCTvUGPnu4+7KCoo6Z1652t3N9AoRB
wVds4AHqeH3+H6v8bDJ5yQv2aAAFMSnvMyUqkD1Rt960Qgbl8TUb6JHvvWnjbjvF
cA5AvkxiPWCQNRiHRIZHfhwysQv5gizu2CY04cKkn9ynvpajjKa5LVQr68kR57sH
Q2ymJkKlQw4wXCTYBrfVsNvGG5XZBrfz8brt8rHHgAKdBD8jordICwEqZlhBYPct
UQr0DTT0i+lA8AgKDTK9hcSa1G5hOO/ekUKwTnvBMjckWju1P4NF1aTOUg09eYEo
Z6OTR4kGi5Usdc9I8DuTloeb26+o88Meiqu2NX3bOGH50KHEA4zVJxPhMf48dOvk
0JFOUM39n81OIJTVcis6RkyMmTWRR8NUdTdvwlNpuETq6i1iXrVCeDT3tBA+KinN
LcEbheYfk/3aZoivZoFfGYNlD4HSMooauG9eZSdzvGf700u/7qhUB8kZEik9uaXh
QycMFVGSEVFnADP7Eb7H5Z/pZVq5iyG/lKAHh5He2m6dpnu2Q1pO6qdF/KQ7b8kZ
-----END RSA PRIVATE KEY-----
```

Private key dapat digunakan untuk dua hal, signature dan dekripsi. Digital signature bisa diumpamakan dengan kita membubuhkan tandatangan atau stempel di suatu dokumen. Dokumen yang saya stempel dan tandatangani bisa meyakinkan orang bahwa dokumen tersebut memang benar-benar berasal dari saya. Demikian juga dengan dokumen digital (file), dapat kita tandatangani/stempel dengan menggunakan private key. File yang sudah diberikan digital signature tidak bisa diubah ditengah jalan tanpa ketahuan. Bila diubah, maka digital signaturenya tidak cocok lagi.

Private key memiliki pasangan yang dinamakan public key. Public key ini tidak rahasia, dan bisa kita sebarluaskan pada siapapun yang membutuhkannya. Bila orang lain ingin mengirim pesan rahasia pada kita, dia bisa mengacak (enkripsi) pesan tersebut dengan menggunakan public key. Pesan yang sudah diacak tersebut hanya bisa dibuka dengan private key yang sesuai.

Jadi, untuk memiliki identitas, kita harus memiliki pasangan private dan public key.

## Trust Model ##

Siapa saja bisa membuat pasangan key. Lalu bagaimana cara kita bisa tahu bahwa private key tertentu adalah milik orang tertentu? 
Misalnya, Anda mendapat dokumen dari `Endy Muhardin` yang ditandatangani dengan private key `abcd-efgh-1234-5678`. Bagaimana kita yakin bahwa `abcd-efgh-1234-5678` adalah benar tandatangan dari `Endy Muhardin`?

Ada dua cara untuk mengatasi masalah ini, 

* [Web of Trust](http://en.wikipedia.org/wiki/Web_of_trust)
* [Public Key Infrastructure](http://en.wikipedia.org/wiki/Public-key_infrastructure)

### Web of Trust ###

Web of Trust bekerja dengan mekanisme referensi teman. Kita bisa tanyakan pada teman kita yang sudah pernah berinteraksi dengan `Endy Muhardin`, "Apakah benar `abcd-efgh-1234-5678` adalah tandatangan dari `Endy Muhardin` ?". Bila teman kita tidak ada yang pernah berinteraksi, maka kita bisa tanyakan pada temannya teman, temannya teman dari teman, dan seterusnya sampai ada yang bisa memastikan identitas dari tandatangan `abcd-efgh-1234-5678` tersebut.

Kembali ke analogi internet banking, bagaimana kalau saya baru saja launching dan belum memiliki referensi? Nah tentunya membangun jaringan referensi butuh waktu lama. Bisa jadi pada minggu-minggu pertama setelah launching tidak ada yang berani pakai internet banking saya, karena belum ada teman kita yang memiliki referensi.

Untuk itu, kita menggunakan mekanisme kedua, yaitu Public Key Infrastructure.

### Public Key Infrastructure ###

Pada sistem ini, kita mempercayakan verifikasi identitas pada sekelompok orang/perusahaan. Kelompok ini dikenal dengan istilah Certificate Authority (CA). CA bertugas memberikan sertifikasi pada identitas digital, mirip dengan pemberian peringkat bintang pada hotel/penginapan. 

Dengan mekanisme ini, bila kita ingin menginap di suatu hotel yang belum pernah kita datangi sebelumnya, kita tinggal melihat peringkatnya. Kita yakin bahwa [hotel bintang lima](https://en.wikipedia.org/wiki/Hotel_rating) pasti lebih baik daripada bintang empat, dan seterusnya. Keyakinan ini kita dapatkan karena kita percaya dengan prosedur verifikasi yang telah dilakukan oleh lembaga pemeringkat hotel.

Kembali ke aplikasi internet banking kita, untuk mendapatkan sertifikasi dari CA, ada beberapa langkah yang harus dilakukan:

1. Membuat pasangan private dan public key
2. Membuat sertifikat digital
3. Mengajukan sertifikat tersebut ke CA untuk disetujui
4. CA akan melakukan verifikasi terhadap identitas kita. Bila sukses, sertifikat kita akan disetujui oleh CA.
5. Memasang sertifikat yang telah disetujui CA di ~~pintu hotel~~ website kita

Detail teknis untuk melakukan langkah-langkah ini akan kita bahas di artikel berikutnya.

Sistem public key infrastructure ini juga punya kelemahan. Beberapa CA pernah ditembus keamanannya oleh [orang Iran](http://en.wikipedia.org/wiki/Comodo_Group#2011_breach_incident) dan [Turki](http://en.wikipedia.org/wiki/Diginotar#Issuance_of_fraudulent_certificates) sehingga bisa mengeluarkan sertifikat palsu. Kronologi lengkapnya bisa dibaca [di sini](http://blog.gerv.net/2011/09/diginotar-compromise/).

Walaupun demikian, kita tidak perlu khawatir, karena begitu hal tersebut terungkap, CA yang bersalah akan langsung mendapatkan [hukuman mati dari masyarakat](http://www.wired.com/threatlevel/2011/09/diginotar-bankruptcy/). Dengan demikian, para CA tentu akan berusaha menjaga keamanannya dengan baik.

## Penggunaan SSL ##

SSL digunakan pada protokol yang kita gunakan setiap hari, yaitu HTTP, SMTP, IMAP, dan POP3. HTTP kita gunakan untuk aplikasi web, sedangkan tiga sisanya kita gunakan untuk email. Cara kerjanya relatif sama, sebagai berikut:

1. Kita membuka browser dan mengetik alamat website, misalnya `https://mail.google.com`
2. Mekanisme DNS akan menerjemahkan alamat `mail.google.com` menjadi alamat IP, misalnya `123.123.123.123`.
3. Browser melakukan request ke `123.123.123.123`. Karena URLnya https, maka browser meminta sertifikat dari server
4. Server mengirim sertifikat yang sudah ditandatangani oleh CA.
5. Browser memiliki daftar CA yang sudah disetujui olehnya. Dengan daftar tersebut, browser melakukan verifikasi keabsahan tandatangan CA.
6. Bila tandatangan CA valid, berarti CA sudah memastikan bahwa sertifikat tersebut memang benar milik server `mail.google.com`. Browser akan menampilkan halaman web dengan tanda gembok hijau di address bar. Pada tahap ini, identitas server sudah dikonfirmasi. Berarti kita sudah menggunakan fitur _authentication_ dari SSL.
7. Bila CA yang menandatangani tidak terdaftar, maka browser akan menampilkan halaman peringatan.
8. Browser membuat kode rahasia untuk enkripsi data. Kode rahasia ini dienkripsi menggunakan public key yang ada di dalam sertifikat server, sehingga hanya bisa dibuka oleh server yang memiliki sertifikat.
9. Server melakukan dekripsi terhadap data kode rahasia dari browser. 
10. Komunikasi data antara server dan browser selanjutnya akan dienkripsi dengan kode rahasia tersebut. Pada tahap ini, kita sudah menggunakan fitur _confidentiality_ dari SSL.

Untuk protokol email (SMTP, IMAP, POP3) mekanismenya sama. Cukup gantikan kata `browser` dengan `mail-client` pada penjelasan di atas.

Berikut contoh sertifikat SSL yang dipercayai browser, perhatikan gambar gemboknya.

[![Menu SSL Firefox ](/images/uploads/2013/07/ssl/04-tomcat-https-green.png)](/images/uploads/2013/07/ssl/04-tomcat-https-green.png)

Dan ini sertifikat SSL yang tidak dipercayai karena CA tidak terdaftar di browser

[![Menu SSL Firefox ](/images/uploads/2013/07/ssl/05-tomcat-https-red.png)](/images/uploads/2013/07/ssl/05-tomcat-https-red.png)


### Daftar CA Terpercaya ###

Berbagai aplikasi yang menggunakan SSL menyimpan daftar CA yang dipercayai oleh aplikasi tersebut. Daftar CA ini langsung ditanam di aplikasi (hardcode) sehingga hanya bisa ditambah dan dikurangi oleh pembuat aplikasi. Contohnya, kita bisa melihat daftar CA yang dipercayai Firefox melalui menu `Preferences > Advanced > Encryption` pada layar di bawah


[![Menu SSL Firefox ](/images/uploads/2013/07/ssl/01-firefox-certificate.png)](/images/uploads/2013/07/ssl/01-firefox-certificate.png)

Kita bisa lihat daftar CA dengan menekan tombol View Certificates

[![Daftar CA Firefox ](/images/uploads/2013/07/ssl/02-firefox-ca-list.png)](/images/uploads/2013/07/ssl/02-firefox-ca-list.png)


Demikian juga dengan browser Chrome yang ada di menu Settings, kemudian tekan Advanced.

[![Menu SSL Chrome ](/images/uploads/2013/07/ssl/03-chrome-certificate.png)](/images/uploads/2013/07/ssl/03-chrome-certificate.png)

Daftar sertifikat bisa dilihat dengan menekan tombol `Manage Certificates`

[![Daftar CA Chrome ](/images/uploads/2013/07/ssl/04-chrome-ca-list.png)](/images/uploads/2013/07/ssl/04-chrome-ca-list.png)

Sistem operasi yang kita gunakan juga menyimpan daftar CA terpercaya. Untuk Ubuntu, lihat di folder `/etc/ssl/certs`

[![Daftar CA Ubuntu ](/images/uploads/2013/07/ssl/05-ubuntu-ca-list.png)](/images/uploads/2013/07/ssl/05-ubuntu-ca-list.png)

Bila terjadi sesuatu pada CA sehingga tidak bisa lagi dipercaya, maka para programmer Firefox, Chrome, Ubuntu, Microsoft, dan sebagainya akan menghapus CA bermasalah tersebut dari daftar CAnya, [seperti yang dilakukan Firefox](http://blog.mozilla.org/security/2011/09/02/diginotar-removal-follow-up/) dan [Ubuntu](http://www.danielveazey.com/linux/diginotar-certificate-fix-released-for-ubuntu/). Biasanya penghapusan ini akan diikuti dengan pengumuman security update di internet sehingga semua user bisa melakukan update terhadap aplikasi yang terinstal di komputernya masing-masing.

Demikian artikel SSL bagian pertama. Nantikan artikel selanjutnya tentang [cara membuat](http://software.endy.muhardin.com/aplikasi/membuat-self-signed-certificate/) dan [membeli sertifikat SSL](http://software.endy.muhardin.com/aplikasi/membeli-sertifikat-ssl/).

