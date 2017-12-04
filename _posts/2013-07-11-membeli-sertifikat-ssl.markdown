---
layout: post
title: "Membeli Sertifikat SSL"
date: 2013-07-11 19:55
comments: true
categories: 
- aplikasi
---

Pada waktu saya pertama kali ingin membeli sertifikat SSL, saya dihadapkan pada berbagai jenis sertifikat yang bisa dibeli. Butuh waktu dan usaha yang relatif besar untuk mengetahui maksud dari macam-macam jenis sertifikat tersebut. Pada artikel ini, kita akan membahas berbagai jenis sertifikat tersebut dengan bahasa yang mudah dipahami.

Artikel ini adalah bagian ketiga dari 4 artikel, yaitu:

1. [Apa itu SSL](http://software.endy.muhardin.com/aplikasi/apa-itu-ssl/)
2. [Membuat self-signed certificate](http://software.endy.muhardin.com/aplikasi/membuat-self-signed-certificate/)
3. [Membeli sertifikat SSL](http://software.endy.muhardin.com/aplikasi/membeli-sertifikat-ssl/)
4. [Memasang sertifikat SSL](http://software.endy.muhardin.com/aplikasi/memasang-sertifikat-ssl/)


<!--more-->

## Vendor SSL ##

Ada banyak sekali vendor SSL yang tersedia. Beberapa yang populer antara lain:

* [Comodo](http://www.comodo.com/)
* [Verisign](http://www.verisign.com/)
* [Cybertrust/Verizon](http://www.verizonenterprise.com/products/security/identity/ssl/)
* [StartSSL](http://www.startssl.com/)
* dan masih banyak yang lain lagi

Masing-masing vendor menyediakan berbagai paket dan kategori, masing-masing diberi nama yang terdengar canggih dan hi-tech. Ini semua membuat kita yang baru pertama kali membeli sertifikat menjadi bingung. Berdasarkan hasil tanya-tanya dan googling, akhirnya saya mendapatkan metode pengelompokan yang lebih mudah dipahami end-user. 

Kita bisa membedakan sertifikat SSL berdasarkan dua hal:

* cakupan penggunaan
* prosedur validasi

## Penggunaan Sertifikat ##

Sertifikat SSL biasanya digunakan untuk webserver dan mailserver. Kedua layanan ini bekerja berdasarkan nama domain. Misalnya saya punya domain `artivisi.com`. Dari domain ini, saya bisa memiliki banyak server misalnya:

* www.artivisi.com : website perusahaan
* demo.artivisi.com : situs untuk demo produk dan layanan
* mail.artivisi.com : mail server, untuk mengirim dan menerima email

Kita bisa membedakan jenis sertifikat SSL berdasarkan penggunaannya pada domain di atas menjadi:

* single domain
* wildcard domain
* multi domain

### Single Domain ###

Sertifikat single domain hanya bisa digunakan di satu domain saja. Misalnya kita membeli sertifikat untuk `www.artivisi.com` sehingga website ArtiVisi bisa diakses melalui `https://www.artivisi.com`. Sertifikat yang kita beli ini hanya bisa digunakan untuk domain `www.artivisi.com`. Dia tidak bisa kita pasang di mail server yang memiliki nama `mail.artivisi.com`.

Bila kita membutuhkan SSL untuk `mail.artivisi.com`, kita harus membeli sertifikat sekali lagi. Demikian seterusnya, masing-masing domain/subdomain harus memiliki sertifikat sendiri. 

> Wah, apa tidak merepotkan? Belum lagi harganya pasti akan jadi mahal kalau setiap subdomain harus beli lagi.

Nah, pada saat kita merasa kerepotan dan kemahalan, tiba saatnya kita membeli sertifikat `wildcard domain`

### Wildcard Domain ###

Sertifikat ini disebut wildcard karena satu sertifikat bisa digunakan untuk seluruh subdomain. CA akan membuatkan sertifikat dengan CN `*.artivisi.com`, sehingga bisa digunakan untuk `www.artivisi.com`, `mail.artivisi.com`, dan seluruh subdomain `artivisi.com`.

Harganya tentu lebih mahal daripada single domain. Sebagai gambaran kita lihat [harga dari Verisign](http://www.symantec.com/page.jsp?id=compare-ssl-certificates). Single domain harganya $400 dan wildcard harganya $1200. Kita baru balik modal kalau punya 3 subdomain.

### Multi Domain / SAN Extended ###

Sertifikat dengan extended validation (akan dibahas di bawah) tidak bisa menggunakan mekanisme wildcard. Untuk itu, diakali dengan menaruh banyak nama domain di field `subject alternative name` (SAN), sehingga satu sertifikat bisa digunakan di banyak nama domain.

Dengan klasifikasi penggunaan ini, kita bisa memilih mana yang akan kita gunakan. Umumnya kita cuma memilih antara single dan wildcard. Pada kasus tertentu dimana kita menggunakan Extended Validation, barulah kita mempertimbangkan antara single domain dan multi domain.

## Prosedur Validasi ##

Berdasarkan prosedur validasi, sertifikat SSL dibagi menjadi tiga jenis:

* Domain Validation (DV)
* Organization Validation (OV)
* Extended Validation (EV)

### Domain Validation ###

Metode validasi yang paling mudah dan cepat adalah domain validation. Saking mudahnya, biasanya proses ini dilakukan dengan aplikasi dan tidak melibatkan campur tangan manusia, sehingga lebih murah.

Domain validation memastikan bahwa pemohon benar-benar punya akses terhadap domain. Berikut cara kerjanya: 

1. Pemohon mengirim CSR pada CA berisi domain yang akan disertifikasi. Misalnya `demo.muhardin.com`.

2. CA akan mencari tahu siapa pemilik domain tersebut menggunakan fasilitas whois. Disana nantinya ada informasi email pemilik domain. Contoh output whois seperti ini: 
    
    [![Output Whois ](/images/uploads/2013/07/ssl/output-whois.png)](/images/uploads/2013/07/ssl/output-whois.png)

3. Adakalanya orang yang membeli domain berbeda dengan orang teknis yang mengurus domain, sehingga alamat email di whois tidak bisa digunakan. Bila terjadi seperti ini, pemohon bisa minta CA menggunakan email lain, biasanya `postmaster@muhardin.com` atau `webmaster@muhardin.com`. Ini adalah alamat email standar untuk administrasi mailserver dan webserver. Jadi pastikan kedua alamat email ini dilindungi dengan baik dan hanya diberikan aksesnya pada orang yang berhak.

4. CA mengirim email ke alamat yang ditentukan di langkah sebelumnya. Di email tersebut ada kode verifikasi untuk memastikan bahwa pemohon benar-benar punya akses ke alamat email tersebut.

5. Pemohon membuktikan bahwa dia telah menerima email verifikasi. Cara yang umum dilakukan antara lain memasukkan kode verifikasi ke website CA, atau mengklik link verifikasi yang ada dalam email.

6. Setelah verifikasi dilakukan, CA akan mengirim sertifikat domain yang telah ditandatangani. Atau pemohon juga bisa mengunduhnya di website CA.

Pada level validasi ini, CA memastikan identitas pemohon berupa:

* akses/kontrol terhadap domain

### Organization Validation ###

Selangkah lebih jauh, ada yang namanya Organization Validation. Pada validasi level ini, CA melakukan validasi tambahan terhadap organisasi yang meminta sertifikat SSL. Biasanya pemohon harus mengirim akta perusahaan atau bukti legalitas lainnya.

Pada level validasi ini, CA memastikan identitas pemohon berupa:

* akses/kontrol terhadap domain
* legalitas organisasi pemilik domain

### Extended Validation ###

Pada metode validasi sebelumnya, CA sama sekali tidak melakukan validasi terhadap orang/contact person. 

[Metode Extended Validation](http://en.wikipedia.org/wiki/Extended_Validation_Certificate) adalah metode validasi yang paling lengkap. 

Di sini CA juga akan menghubungi langsung contact person dari organisasi pemohon sertifikat. Detail teknisnya saya kurang paham karena belum pernah membeli sertifikat EV. Konon katanya, EV ini melibatkan pemeriksaan fisik berupa kunjungan atau pertemuan dengan perwakilan organisasi. 

Mengingat tingkat ketelitian dalam validasinya, maka sertifikat level EV tidak boleh diterbitkan dalam bentuk _wildcard_. Ini disebabkan karena sertifikat wildcard memungkinkan kita membuat domain tanpa harus divalidasi CA. Bila kita ingin satu sertifikat untuk banyak domain, maka kita harus menggunakan Subject Alternative Name (SAN), dimana masing-masing nama domain akan divalidasi satu-persatu.

Sertifikat yang memiliki validasi EV akan terlihat berbeda di browser, ditandai dengan adanya _green bar_ seperti di Internet Banking Mandiri 

[![Green Bar Mandiri ](/images/uploads/2013/07/ssl/green-bar-mandiri.png)](/images/uploads/2013/07/ssl/green-bar-mandiri.png)

atau di KlikBCA

[![Green Bar BCA ](/images/uploads/2013/07/ssl/01-green-bar.png)](/images/uploads/2013/07/ssl/01-green-bar.png)

Kita bisa melihat informasi detail tentang sertifikat SSL dengan cara klik green bar tersebut

[![Informasi Green Bar ](/images/uploads/2013/07/ssl/02-green-bar-info.png)](/images/uploads/2013/07/ssl/02-green-bar-info.png)

Pada level validasi EV, CA memastikan identitas pemohon berupa:

* akses/kontrol terhadap domain
* legalitas organisasi pemilik domain
* keberadaan fisik organisasi dan contact person yang ditugaskan mewakilinya

### Memilih metode validasi ###

> Dari ketiga metode ini, pilih mana?

Pertimbangan pertama tentu masalah harga. Makin teliti validasinya, biaya akan semakin tinggi. 

Pertimbangan kedua adalah masalah kerepotannya. Makin tinggi level validasi, makin banyak dokumen yang harus kita siapkan.

Satu hal yang perlu diperhatikan, [pengunjung awam tidak akan bisa membedakan antara Domain Validation dan Organization Validation](http://unmitigatedrisk.com/?p=203) . Jadi kalau ingin memilih, cukup dua yang dipertimbangkan, Extended Validation (EV) atau non-EV.

Perlu diperhatikan juga bahwa validasi tidak menjamin keamanan 100%. Pernah ada kasus website palsu di Amerika Serikat yang memiliki sertifikat asli. Ceritanya bisa dibaca [di sini](http://voices.washingtonpost.com/securityfix/2006/02/the_new_face_of_phishing_1.html).

### Memilih CA ###

CA yang menjajakan sertifikat di internet sangat banyak. Mulai dari yang gratis sampai yang mahal. Sepintas terlihat ada CA yang kredibilitasnya tinggi seperti Cybertrust atau VeriSign yang banyak dipakai bank di Indonesia, dan juga ada yang jarang terdengar seperti ~~StartSSL~~ atau Cacert. Kredibilitas CA ini mempengaruhi harga. Untuk produk yang setingkat, misalnya produk termurah single domain dengan domain validation, harganya bisa berbeda beberapa kali lipat. Coba bandingkan harga [Comodo](http://www.mangkukmerah.com/ssl) dengan [Verisign](http://www.symantec.com/en/aa/theme.jsp?themeid=compare-ssl-certificates). Harga Comodo 240 ribu rupiah, sedangkan VeriSign 4 juta rupiah. 

Walaupun demikian, menurut pandangan saya pribadi, masalah kredibilitas ini tidak terlalu signifikan pengaruhnya terhadap pengunjung. Sebagai ilustrasi, kita yang sering menggunakan internet banking apa pernah tahu siapa CA yang digunakan oleh bank kita? Atau apakah kita tahu siapa itu Cybertrust atau VeriSign?

Untuk menambah added value, beberapa CA mengeluarkan stempel (seal) yang bisa dipasang di website. Contohnya bisa dilihat di KlikBCA berikut

[![Green Bar BCA ](/images/uploads/2013/07/ssl/01-green-bar.png)](/images/uploads/2013/07/ssl/01-green-bar.png)

atau Internet Banking Mandiri berikut

[![Green Bar Mandiri ](/images/uploads/2013/07/ssl/stempel-ca-mandiri.png)](/images/uploads/2013/07/ssl/stempel-ca-mandiri.png)

Tapi menurut saya, stempel inipun juga tidak menambah keyakinan pengunjung, karena siapapun bisa memasang logo tersebut dengan mudah.

Ada faktor lain yang lebih penting dipertimbangkan menurut saya, yaitu kompatibilitasnya di berbagai browser. CA mahal biasanya kompatibel di semua browser, sedangkan CA murah kadang-kadang tidak diakui browser, sehingga menimbulkan warning seperti halnya self-signed certificate. Kalau memang tetap mengeluarkan warning, ya buat apa kita beli. Lebih baik pakai yang gratisan saja.

Demikianlah penjelasan tentang bermacam-macam sertifikat SSL yang tersedia di pasaran. Silahkan pilih yang sesuai dengan kebutuhan. Setelah sertifikat didapatkan, baik self-signed atau dari CA resmi, kita akan membahas [cara instalasinya di artikel selanjutnya](http://software.endy.muhardin.com/aplikasi/memasang-sertifikat-ssl/).
