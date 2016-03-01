---
layout: post
title: "Memasang Sertifikat SSL"
date: 2013-07-12 14:14
comments: true
categories: 
- aplikasi
---

Setelah kita menjalankan semua prosedur untuk mendapatkan digital certificate, tiba saatnya kita memasangnya di webserver supaya bisa melayani request https. Pada artikel ini, kita akan membahas konfigurasi https pada webserver yang sering digunakan. Karena banyaknya merek webserver yang beredar di pasaran, kita akan ambil dua sebagai perwakilan, yaitu Tomcat mewakili webserver Java, dan Nginx mewakili non-Java. Webserver Java merek lain seperti JBoss, Jetty, Glassfish, dan rekan-rekannya memiliki cara konfigurasi yang mirip dengan Tomcat. Demikian juga Apache HTTPD, Lighttpd, Mongrel, dan sejawatnya memiliki cara konfigurasi yang mirip dengan Nginx.

Artikel ini adalah bagian terakhir dari 4 artikel, yaitu:

1. [Apa itu SSL](http://software.endy.muhardin.com/aplikasi/apa-itu-ssl/)
2. [Membuat self-signed certificate](http://software.endy.muhardin.com/aplikasi/membuat-self-signed-certificate/)
3. [Membeli sertifikat SSL](http://software.endy.muhardin.com/aplikasi/membeli-sertifikat-ssl/)
4. [Memasang sertifikat SSL](http://software.endy.muhardin.com/aplikasi/memasang-sertifikat-ssl/)

<!--more-->

Untuk mengaktifkan fitur https pada webserver, pada prinsipnya kita membutuhkan tiga jenis file: 

1. Private Key
2. Certificate yang sudah diberikan signature oleh Certificate Authority (CA)
3. Certificate CA yang memberikan signature. File jenis ini bisa terdiri dari banyak file, tergantung apakah CA tersebut memiliki intermediate certificate atau tidak

Sebagai contoh, kita akan gunakan file-file berikut yang didapatkan dari [penyedia SSL gratis StartSSL](https://www.startssl.com/?app=1). File self-signed yang kita buat di artikel bagian kedua juga bisa digunakan, malah lebih mudah karena sertifikat CA hanya satu, sedangkan yang dari StartSSL ada 2 file, satu Root CA dan satu Intermediate CA. Berikut adalah file-file tersebut:

1. Private Key : `demo.muhardin.com.key`
2. Sertifikat yang sudah ditandatangani CA : `demo.muhardin.com.crt`
3. Sertifikat Root CA : `ca.pem`
4. Sertifikat Intermediate CA : `sub.class1.server.ca.pem`

Ekstensi file `crt` dan `pem` sama saja. Sama-sama file text yang bisa dibuka dengan Gedit atau Notepad.

## SSL dengan Nginx ##

### Pengecekan Awal ###

Sebelum mulai, pastikan dulu virtual host kita sudah berjalan. Berikut konfigurasi virtual host saya

```
server{
    server_name demo.muhardin.com;
    root /var/www/demo.muhardin.com/public_html;
    index index.html;
}
```

Bila kita jalankan di laptop sendiri (localhost), tambahkan baris berikut di `/etc/hosts` supaya pada waktu kita mengakses alamat `http://demo.muhardin.com` akan diarahkan ke Nginx di laptop sendiri.

```
127.0.0.1	demo.muhardin.com
```

Coba browse ke `http://demo.muhardin.com`, pastikan bisa diakses dengan baik.


### Private Key ###

Private key kita normalnya disimpan dalam bentuk terenkripsi dengan passphrase. Kita bisa menggunakan file ini apa adanya, tapi setiap kali Nginx dijalankan, kita harus mengentri passphrasenya. Ini tentu lebih aman, karena private key kita selalu berada dalam bentuk yang terlindungi. 

Tapi untuk keperluan development, pada saat private key juga bikinan sendiri, kita bisa membuka file ini menjadi bentuk plain text dengan perintah berikut

```
openssl rsa -in demo.muhardin.com.key -out demo.muhardin.com.key.txt
```

Tentu kita akan ditanyai passphrase. Setelah itu file private key yang tidak terenkripsi (plain text) akan dibuat di `demo.muhardin.key.txt`

```
Enter pass phrase for demo.muhardin.com.key:
writing RSA key
```

### CA Certificate ###

Bila CA kita memiliki rantai sertifikat, kita harus gabungkan semua menjadi satu file. Ini bisa dilakukan dengan membuka semuanya di text editor, kemudian select all, copy, paste isinya ke file baru. Dimulai dari Root CA sampai ke Intermediate paling bawah.

CA yang memiliki rantai sertifikat contohnya Comodo. Kita bisa lihat informasi rantainya [di sini](https://support.comodo.com/index.php?_m=knowledgebase&_a=viewarticle&kbarticleid=1182). Sebagai contoh, bila kita mendapatkan Free Certificate dari Comodo, maka rantainya adalah:

1. Root : AddTrustExternalCARoot.crt 
2. Intermediate 1 : UTNAddTrustSGCCA.crt 
3. Intermediate 2 : ComodoUTNSGCCA.crt 
4. Intermediate 3 : EssentialSSLCA_2.crt

Setelah itu terakhir barulah sertifikat kita sendiri yang ditandatangani oleh Intermediate 3.

Kita bisa juga menggabungkan semuanya menggunakan perintah linux. Contohnya, seandainya `demo.muhardin.com.crt` ditandatangani oleh Comodo, maka perintahnya adalah sebagai berikut:

```
cat demo.muhardin.com.crt EssentialSSLCA_2.crt ComodoUTNSGCCA.crt UTNAddTrustSGCCA.crt AddTrustExternalCARoot.crt > sertifikat-gabungan.crt
```

> Awas jangan salah urutannya. Mulai dari sertifikat kita sendiri, kemudian intermediate 3 yang menandatangani sertifikat kita sendiri, intermediate 2, begitu seterusnya sampai sertifikat Root di paling akhir.

### Konfigurasi Nginx ###

Berikut adalah konfigurasi Nginx yang harus ditambahkan.

```
listen 443 default_server ssl;
ssl_certificate     /etc/nginx/sertifikat-gabungan.crt;
ssl_certificate_key /etc/nginx/demo.muhardin.com.key.txt;
```

Isi konfigurasi virtual host `demo.muhardin.com` selengkapnya

```
server{
    server_name demo.muhardin.com;
    root /var/www/demo.muhardin.com/public_html;
    index index.html;

    listen 443 default_server ssl;
    ssl_certificate     /etc/nginx/sertifikat-gabungan.crt;
    ssl_certificate_key /etc/nginx/demo.muhardin.com.key.txt;
}
```


## SSL dengan Tomcat ##

Tomcat dan juga webserver Java lainnya membutuhkan file keystore yang berisi semua sertifikat dan private key yang dibutuhkan. Untuk itu, kita akan memasukkan private key, sertifikat yang sudah ditandatangani CA, dan sertifikat milik CA (beserta semua intermediate) ke dalam keystore. Prosedurnya sebagai berikut:

1. Buat database berisi private key dan sertifikat domain yang sudah ditandatangani CA dalam format PKCS#12. Ini dilakukan menggunakan `openssl`
2. Konversi format PKCS#12 menjadi JKS menggunakan keytool
3. Import sertifikat CA dan sertifikat intermediate satu persatu
4. Pasang di Tomcat

### Membuat database PKCS12 ###

Gabungkan dulu semua sertifikat CA menjadi satu file. Ini penting dilakukan, kalau tidak rantai sertifikasinya tidak akan tersambung dan browser kita tetap akan menampilkan peringatan seperti SSL self-signed. Sama seperti penggabungan pada waktu konfigurasi Nginx, mulai dari intermediate CA yang menandatangani sertifikat kita, terus berurutan sampai Root CA di posisi terakhir.

```
cat EssentialSSLCA_2.crt ComodoUTNSGCCA.crt UTNAddTrustSGCCA.crt AddTrustExternalCARoot.crt > ca-chain.crt
```

Verifikasi apakah sertifikat kita sudah lengkap rantainya sampai ke Root CA

```
openssl verify -CAfile ca-chain.crt demo.muhardin.com.crt
```

Kalau tidak tersambung sampai Root CA, pesan errornya seperti ini

```
demo.muhardin.com.crt: OU = Domain Control Validated, OU = EssentialSSL, CN = demo.muhardin.com
error 20 at 0 depth lookup:unable to get local issuer certificate
```

Kalau sukses, outputnya seperti ini

```
demo.muhardin.com.crt: OK
```

Jalankan perintah berikut untuk membuat database PKCS12 berisi private key, sertifikat domain, dan rantai sertifikat CA

```
openssl pkcs12 -export -chain \
-inkey myserver.key \
-in demo.muhardin.com.crt \
-name "demo.muhardin.com" \
-CAfile ca-chain.crt \
-caname "Intermediate 3" \
-caname "Intermediate 2" \
-caname "Intermediate 1" \
-caname "Root CA" \
-out demo.muhardin.com.p12
```

Opsi `caname` gunanya untuk memberi nama untuk sertifikat CA agar lebih mudah dipahami sertifikat mana mengacu ke CA mana. Urutannya harus sesuai dengan urutan file yang kita gabungkan pada langkah sebelumnya.

Kita akan ditanyai passphrase tiga kali. Pertama untuk membuka private key, kedua dan ketiga untuk password database PKCS12.

```
Enter pass phrase for demo.muhardin.com.key:
Enter Export Password:
Verifying - Enter Export Password:
```

Kita akan mendapatkan file `demo.muhardin.com.p12`.

### Konversi PKCS12 menjadi JKS ###

JKS adalah format database key dalam Java, atau dikenal dengan istilah keystore. Kita bisa membuatnya dengan cara import dari database berformat PKCS12. Berikut perintahnya:

```
keytool -importkeystore \
-srcstoretype PKCS12 \
-srckeystore demo.muhardin.com.p12 \
-destkeystore demo.muhardin.com.jks
```

Kita akan ditanyai password sebanyak tiga kali. Pertama dan kedua adalah password keystore JKS yang baru, sedangkan password ketiga adalah password database PKCS12 yang kita buat di langkah sebelumnya.

```
Enter destination keystore password:
Re-enter new password: 
Enter source keystore password:
Entry for alias 1 successfully imported.
Import command completed:  1 entries successfully imported, 0 entries failed or cancelled
```

Verifikasi hasilnya menggunakan perintah berikut

```
keytool -keystore demo.muhardin.com.jks -list
```

Berikut outputnya, menyatakan bahwa kita sudah punya satu data dalam `demo.muhardin.com.jks`

```
Enter keystore password:

Keystore type: JKS
Keystore provider: SUN

Your keystore contains 1 entry

demo.muhardin.com, Jul 9, 2013, PrivateKeyEntry, 
Certificate fingerprint (SHA1): 10:A6:A1:7B:A4:46:10:38:0C:5C:72:77:FA:EB:86:46:91:DA:E7:C0
```


### Konfigurasi Tomcat ###

Copy file `demo.muhardin.com.jks` ke dalam folder konfigurasi Tomcat. Di laptop saya lokasinya ada di `/opt/tomcat/conf`. Lalu buka file `server.xml` di folder yang sama menggunakan text editor. Edit baris berikut

```xml
<Connector port="8443" protocol="HTTP/1.1" SSLEnabled="true"
    maxThreads="150" scheme="https" secure="true"
    clientAuth="false" sslProtocol="TLS" 
    keystoreFile="conf/demo.muhardin.com.jks"
    keystorePass="test1234"
    keyAlias="demo.muhardin.com"
/>
```

Sesuaikan variabel berikut:

* keystoreFile : lokasi keystore JKS
* keystorePass : password untuk membuka keystore
* keyAlias : nama alias untuk sertifikat domain (karena isi keystore ada 3 entri, harus dijelaskan mana yang akan digunakan)

## Test ##

Setelah semua selesai dikonfigurasi, Nginx bisa dites dengan mengakses `https://demo.muhardin.com`, sedangkan Tomcat bisa diakses di `https://demo.muhardin.com:8443`. 

Bila kita menggunakan sertifikat dari CA resmi, walaupun gratis kita akan mendapatkan warna hijau di address bar

[![Tomcat HTTPS Green ](/images/uploads/2013/07/ssl/04-tomcat-https-green.png)](/images/uploads/2013/07/ssl/04-tomcat-https-green.png)

Namun bila kita menggunakan CA buatan sendiri (self-signed), maka pada waktu pertama diakses, kita akan diberikan peringatan.

[![Peringatan SSL Self Signed ](/images/uploads/2013/07/ssl/01-ssl-warning.png)](/images/uploads/2013/07/ssl/01-ssl-warning.png)

Agar bisa tetap diakses, kita bisa klik Add Exception. Kita akan diperlihatkan informasi tentang sertifikat SSL

[![Add Exception ](/images/uploads/2013/07/ssl/02-add-exception.png)](/images/uploads/2013/07/ssl/02-add-exception.png)

Kita bisa melihat detail informasi dari sertifikat tersebut, siapa pemilik server dan siapa yang menandatangani sertifikatnya

[![Detail Informasi Sertifikat ](/images/uploads/2013/07/ssl/03-certificate-info.png)](/images/uploads/2013/07/ssl/03-certificate-info.png)

Bila kita klik Confirm Security Exception, barulah halaman web kita ditampilkan. Tapi masih ada warna merah di address bar.

[![Tomcat HTTPS Red  ](/images/uploads/2013/07/ssl/05-tomcat-https-red.png)](/images/uploads/2013/07/ssl/05-tomcat-https-red.png)


## Error yang umum terjadi ##

### Password private key berbeda dengan password keystore ###

Kadangkala pada waktu menjalankan Tomcat, kita menjumpai pesan error berikut

```
SEVERE: Catalina.start
LifecycleException:  Protocol handler initialization failed: java.io.IOException: Cannot recover key
```

Ini disebabkan karena password untuk membuka keystore berbeda dengan password untuk membuka private key. Biasanya terjadi bila kita mengganti password keystore setelah melakukan import. Keytool hanya akan mengganti password keystore, tapi tidak mengganti password private key.

Kita harus samakan dulu dengan mengganti salah satunya. 

Bila ingin mengganti password private key, berikut perintahnya

```
keytool -keystore demo.muhardin.com.jks -alias demo.muhardin.com -keypasswd
Enter keystore password: Masukkan password keystore
Enter key password for <loket.asialink.co.id>: Masukkan password private key yang lama
New key password for <loket.asialink.co.id>: Masukkan password private key yang baru, samakan dengan password keystore
Re-enter new key password for <loket.asialink.co.id>: Konfirmasi password private key yang baru
```

Atau bila ingin mengganti password keystore, berikut perintahnya

```
keytool -keystore demo.muhardin.com.jks -storepasswd
```

### Certificate Chain tidak tersambung ###

Ada kalanya sertifikat yang sudah kita beli mahal-mahal tetap menimbulkan warning di browser. Ini bisa disebabkan karena dua hal, yaitu:

1. CA tidak dikenali oleh browser. Pastikan kita membeli sertifikat dari CA yang dikenali browser. Daftarnya bisa dilihat [di Wikipedia](http://en.wikipedia.org/wiki/Comparison_of_SSL_certificates_for_web_servers)

2. Kita tidak menginstal rantai sertifikat dengan benar.

Untuk masalah kedua, kita bisa periksa menggunakan perintah `openssl` di commandline sebagai berikut

```
openssl s_client -connect demo.muhardin.com:443
```

Kadangkala kita mendapat pesan error berikut

```
CONNECTED(00000003)
140315329672896:error:14077438:SSL routines:SSL23_GET_SERVER_HELLO:tlsv1 alert internal error:s23_clnt.c:741:
```

Hal tersebut disebabkan karena [bug pada OpenJDK](https://bugs.launchpad.net/ubuntu/+source/openjdk-6/+bug/1006776), gunakan opsi `-ssl3`

```
openssl s_client -connect demo.muhardin.com:443 -ssl3
```

Bila [sertifikat kita tidak tersambung sampai Root CA](http://blog.fnsecurity.org/2013/02/proper-ssl-chaining.html), maka kita akan mendapat error seperti ini

```
CONNECTED(00000003)
depth=0 description = KWbw1iy6BUBg3JQ8, C = ID, CN = demo.muhardin.com, emailAddress = endy.muhardin@gmail.com
verify error:num=20:unable to get local issuer certificate
verify return:1
depth=0 description = KWbw1iy6BUBg3JQ8, C = ID, CN = demo.muhardin.com, emailAddress = endy.muhardin@gmail.com
verify error:num=27:certificate not trusted
verify return:1
depth=0 description = KWbw1iy6BUBg3JQ8, C = ID, CN = demo.muhardin.com, emailAddress = endy.muhardin@gmail.com
verify error:num=21:unable to verify the first certificate
verify return:1
```

Periksa lagi pembuatan sertifikat kita. Pastikan rantai sertifikat CA sudah diimport dengan benar. Biasanya ini terjadi pada waktu pembuatan keystore Java. Coba ikuti lagi langkah-langkah di atas dengan teliti.

Sertifikat yang benar harusnya mengeluarkan output seperti ini

```
CONNECTED(00000003)
depth=2 C = IL, O = StartCom Ltd., OU = Secure Digital Certificate Signing, CN = StartCom Certification Authority
verify error:num=19:self signed certificate in certificate chain
verify return:0
---
Certificate chain
 0 s:/description=KWbw1iy6BUBg3JQ8/C=ID/CN=demo.muhardin.com/emailAddress=endy.muhardin@gmail.com
   i:/C=IL/O=StartCom Ltd./OU=Secure Digital Certificate Signing/CN=StartCom Class 1 Primary Intermediate Server CA
 1 s:/C=IL/O=StartCom Ltd./OU=Secure Digital Certificate Signing/CN=StartCom Class 1 Primary Intermediate Server CA
   i:/C=IL/O=StartCom Ltd./OU=Secure Digital Certificate Signing/CN=StartCom Certification Authority
 2 s:/C=IL/O=StartCom Ltd./OU=Secure Digital Certificate Signing/CN=StartCom Certification Authority
   i:/C=IL/O=StartCom Ltd./OU=Secure Digital Certificate Signing/CN=StartCom Certification Authority
```

Kita bisa lihat pada output di atas bahwa:

* issuer di sertifikat 0 sama dengan subject di sertifikat 1
* issuer di sertifikat 1 sama dengan subject di sertifikat 2
* issuer di sertifikat 2 sama dengan subject dirinya sendiri (self-signed)

Root CA memang self-signed, karena dia paling atas. Sertifikat self-signed milik Root CA inilah yang ditanam di dalam aplikasi seperti dijelaskan di [artikel bagian pertama](http://software.endy.muhardin.com/aplikasi/apa-itu-ssl/).


Demikianlah langkah-langkah untuk mengaktifkan SSL di Tomcat dan Nginx. Selamat mencoba. Kalau ada error atau hal yang kurang jelas, silahkan ditulis di komentar.
