---
layout: post
title: "Memahami Authentication"
date: 2014-07-26 23:49
comments: true
categories: 
- java
---

Menjelang penghujung bulan Ramadhan, ada yang [bertanya di milis JUG](https://groups.yahoo.com/neo/groups/jug-indonesia/conversations/messages/92685). Alhamdulillah, ada kesempatan bersedekah di detik-detik terakhir bulan puasa ;) Karena pertanyaannya membutuhkan jawaban yang cukup panjang, baiklah kita jawab di blog saja.

Berikut pertanyaannya.

> Saya pernah menggunakan Spring Security Framework. Tapi kalau cuma pakai, tanpa ngerti konsep dasar dan cara kerjanya dasarnya sakit kepala juga akhirnya kalau semua terjadi secara automagically.

> Jadi kalau murni tanpa menggunakan Framework apapun : 

> * Bagaimana membuat proses loginnya? dari beberapa artikel yang saya baca (saya baru tahu) katanya login username dan passwordnya dimasukan kedalam HTTP Header. 

> Contohnya : 

> ```Authorization:Basic c2VzdWF0dUB5YWhvby5jb206YmlzbWlsbGFo```

> dimana `c2VzdWF0dUB5YWhvby5jb206YmlzbWlsbGFo` adalah Base64 encoding dari `sesuatu@yahoo.com:bismillah` (username:password)

> benarkah begitu?

> * Bagaimana server mengenali client jika kita menggunakan method GET? (ini pertanyaan konsep sangat mendasar sekali). Mungkin jawabannya ya dengan token. 

> * Tapi ditaruh dimana? apakah dengan saya tempelkan saja di URL? misal

> ```GET /thewebapp/category/324?token=abcde1234```

> atau saya masukkan dalam HTTP header? tapi dengan header apa? 

Dan berikut jawaban saya

<!--more-->

Yang ditanyakan ini dinamakan proses authentication, artinya memastikan bahwa seseorang/sesuatu yang datang (principal) sesuai dengan yang diakuinya.
Konkretnya, kalau ada request datang dari user `endy`, harus diverifikasi bahwa yang request benar-benar `endy` yang asli.

Bagaimana caranya? Biasanya dengan cara menanyakan sesuatu yang hanya dimiliki oleh principal. Sesuatu ini disebut dengan istilah credential.

<a name="principal-credential"></a>
## Principal dan Credential ##

Principal dan credential itu macam-macam bentuknya. Yang paling umum ditemui : principal = username, credential = password.

Ini kalau principalnya manusia. Bagaimana kalau principalnya aplikasi lain? Ada beberapa credential yang biasa digunakan, misalnya:

- digital certificate
- secret shared key
- private key
- dsb

Bahkan walaupun usernya manusia, credential tidak cuma password. Bisa juga random number yang digenerate menggunakan algoritma. Dikenal juga dengan istilah [One Time Password (OTP)](http://en.wikipedia.org/wiki/One-time_password). Generatornya bisa software dan bisa juga hardware. Contoh hardwarenya seperti token internet banking yang biasa kita gunakan

![Foto](https://farm4.staticflickr.com/3670/12361262404_50b4ab650e_z.jpg)

Sedangkan contoh software yang populer antara lain [Google Authenticator](http://code.google.com/p/google-authenticator/) dan [WiKiD](https://www.wikidsystems.com/community-edition)

Mekanisme OTP ini biasanya digunakan bersama-sama dengan password, sehingga disebut juga dengan [2 Factor Authentication](http://en.wikipedia.org/wiki/Two_factor_authentication). Kenapa 2 Factor? Karena untuk bisa mengakses aplikasi, kita akan dimintai 2 hal : _what you know_ dan _what you have_. What you know adalah password, karena hanya kita yang tahu. What you have adalah generator token, karena tiap generator akan menghasilkan nilai yang berbeda.

Kalau mau lebih canggih lagi, kita bisa menambahkan berbagai lain sehingga menjadi [Multi Factor Authentication](http://en.wikipedia.org/wiki/Multi-factor_authentication) yaitu _who you are_ atau biometrik (scan mata, sidik jari, DNA, suara, dsb)

<a name="protokol-authentication"></a>
## Protokol Authentication ##

Setelah kita bicara principal dan credential, selanjutnya bicara protokol. Bagaimana cara principal dan credential disajikan?

Ada beberapa cara:

- form login. Aplikasi yang mau diakses menampilkan form, principal mengisi credential. Setelah itu diperiksa valid atau tidak
- basic authentication. Informasi principal dan credential diencode (bukan encrypt ya) dengan algoritma Base64, kemudian ditaruh di HTTP Header.
- digest. Principal mengirim data yang diencode menggunakan credential. Kemudian data ini dikirim ke aplikasi yang mau diakses. Aplikasi (dengan mekanisme yang sama) membuat data yang sama dan diencode dengan proses yang sama. Kalau klop, berarti credential yang tersimpan di aplikasi sama dengan yang dimiliki principal. 
- [Mutual / Two-way SSL](http://en.wikipedia.org/wiki/Mutual_authentication) Handshake. Principal mengirim digital signature yang kemudian akan divalidasi oleh aplikasi yang ingin diakses

Untuk alasan efisiensi dan keamanan, proses authentication biasanya dilakukan sekali saja. Setelah proses selesai, principal akan diberikan token yang memiliki masa berlaku singkat. Request selanjutnya akan menggunakan token ini. Dengan demikian, credential tidak terus menerus dikirim melalui jaringan sehingga meningkatkan resiko dicuri.

Jadi, token ini harus disimpan oleh principal dan disertakan pada setiap request.

Bagaimana menyimpannya? Ada beberapa cara :

- cookie
- browser storage (ada local storage dan session storage)

Bagaimana menyertakannya pada tiap request? Ada beberapa cara:

- ditaruh di URL (teknik URL rewrite). Request yang tadinya `http://aplikasi.com/halo` menjadi `http://aplikasi.com/halo?token=abcd`
- dikirim dalam cookie
- ditaruh di form data (biasanya menggunakan `input type=hidden`)

Jangan lupa bahwa semua informasi yang berlalu-lintas ini harus berjalan dalam jalur yang aman. Selalu [gunakan HTTPS/SSL](http://software.endy.muhardin.com/aplikasi/apa-itu-ssl/).

<a name="verifikasi-credential"></a>
## Verifikasi Credential ##

Selanjutnya, kita bicara di sisi aplikasi yang menerima request. Dia harus melakukan verifikasi principal dan credential. Bagaimana cara verifikasinya? Ada beberapa cara:

- in memory data. Username dan password dihardcode di aplikasi. Request authentication akan dicek ke data dalam memori ini. Berguna kalau aplikasinya kecil atau masih dalam fase development.
- database relasional. Simpan username dan password dalam database. Password biasanya dihash (bukan encrypt ya) menggunakan berbagai algoritma seperti MD5, SHA, atau BCrypt. Lengkapi dengan salt untuk menambah keamanan.
- database hirarkis (LDAP). Sama seperti database relasional, bentuknya saja yang berbeda.
- delegasikan ke pihak ketiga (single sign on)

Di jaman sekarang ini, mekanisme authentication dengan cara delegasi seperti ini semakin ngetren. Ada beberapa protokol standar yang populer :

- [OpenID](http://en.wikipedia.org/wiki/OpenID)
- [OAuth](http://en.wikipedia.org/wiki/OAuth) (versi 1 dan versi 2). Contoh siklus authentication dengan OAuth versi 2 bisa dilihat di [contoh yang saya buatkan di Github](https://github.com/endymuhardin/belajar-springoauth2). Kalau ada waktu lowong, di lain hari akan saya jelaskan dengan lebih rinci di sini.

Selain itu, ada juga protokol proprietary yang disediakan berbagai aplikasi single-sign-on, seperti:

- [Jasig CAS](http://www.jasig.org/cas)
- [Oracle Identity Management](http://en.wikipedia.org/wiki/Oracle_Identity_Management)
- [Microsoft Active Directory](http://en.wikipedia.org/wiki/Active_Directory)
- dsb

Lalu apa kaitannya dengan Spring Security?

Singkat saja. Intinya semua hal di atas harus kita implementasikan dalam aplikasi yang kita buat. Kalau kita pakai Spring Security, sebagian besar (90%) sudah dibuatkan, tinggal pasang saja. 10% sisanya sudah disediakan titik-titik extension di mana kita bisa buat implementasinya dan pasang sehingga klop dengan 90% yang sudah disediakan Spring Security.

