---
comments: true
date: 2009-06-11 14:39:48
layout: post
slug: integrasi-pusat-cabang-1
title: Integrasi aplikasi kantor pusat dan cabang [Bagian 1]
wordpress_id: 443
categories:
- java
---

Integrasi Aplikasi Pusat Cabang - Bagian I

Beberapa waktu yang lalu, kami di ArtiVisi dihadapkan pada suatu tantangan, yaitu sinkronisasi aplikasi antara pusat dan cabang. 
Aplikasi pusat maupun cabang memiliki database masing-masing, dan tentunya data transaksi masing-masing pula. 

Pada artikel ini, saya akan mengelaborasi proses problem solving yang dilakukan, solusi yang dipilih, dan tentunya dilengkapi dengan source code.




### Use Case



Ada beberapa use case yang ingin didukung oleh aplikasi, sebagai berikut : 




  * Pusat menambahkan jenis produk baru, data ini harus segera diimplementasikan juga di cabang


  * Transaksi yang dilakukan di cabang harus dikirim ke pusat agar bisa dibuatkan laporan keseluruhan


  * Data pelanggan di cabang harus juga dikirim ke pusat


  * Perpindahan stok barang dari pusat ke cabang dan sebaliknya





### Constraint



Bicara requirement, tentu tidak bisa dilepaskan dari constraint. Berikut constraint yang ada : 




  * Pusat dan cabang sama-sama terhubung ke internet menggunakan Speedy


  * Karena pakai Speedy, kita bisa mengekspose satu mesin ke internet menggunakan IP Public


  * IP Public tidak dedicated, dan mungkin berubah sewaktu-waktu


  * Server aplikasi dan database di pusat/cabang belum tentu hidup. Kalaupun hidup, belum tentu hidup berbarengan. 
Bisa saja pusat sedang nyala, cabang mati lampu, dan sebaliknya.





### Alternatif Solusi



Setelah kita memiliki requirement dan constraint, tahap berikutnya adalah membuat daftar alternatif solusi.
Berikut adalah alternatif yang bisa kita lakukan untuk memecahkan masalah di atas. 





  * 
    Remoting
    
        
    * Web Services

        
    * RMI

        
    * HttpInvoker

    



  * Messaging
    
        
    * JMS

        
    * Email (POP3/IMAP dan SMTP)

    



  * File
    
        
    * Shared Folder

        
    * FTP

        
    * SSH/SCP

    



  * Database
    
        
    * Shared Database

        
    * Replikasi Database

    






### Pemilihan Solusi



Jaringan publik melalui internet sangat tidak reliable dan memiliki banyak keterbatasan. 
Kita tidak bisa membuka sembarang port, karena mungkin saja diblokir di tengah jalan.
Kita juga tidak bisa menggunakan protokol yang terlalu kompleks atau cerewet (membutuhkan transfer data yang sering). 
Oleh karena itu, kita bisa menyingkirkan alternatif berikut. 





  * Remoting dengan RMI : port tidak standar


  * Messaging dengan JMS : port tidak standar


  * Replikasi MySQL : protokol terlalu kompleks dan cerewet, port tidak standar



Kita harus mempertimbangkan konsumsi bandwidth. Protokol yang rakus bandwidth bisa kita singkirkan, yaitu Remoting dengan WS. 

Melihat constraint terakhir, kita juga harus mengeliminasi beberapa alternatif yang mengharuskan pusat dan cabang online bersamaan, yaitu Remoting dengan Spring HTTPInvoker dan File Transfer, baik FTP maupun SSH/SCP. 

Dengan demikian, yang tersisa adalah Messaging dengan Email. Kita bisa mengirim data dengan attachment. Untuk menghemat bandwidth, attachment bisa dikompresi. Pusat dan cabang bisa online kapanpun mereka mau, dan akan tetap menerima message. Kalau ada message yang hilang di tengah jalan, orang pusat/cabang bisa menelepon untuk minta dikirim ulang datanya. 

Sebagai bonus, dengan memilih email sebagai media transfer data, kita tidak perlu repot-repot mengelola infrastruktur sendiri. Kita bisa gunakan layanan GMail yang gratis, berkapasitas besar, dan memiliki implementasi POP3, IMAP, dan SMTP. Ada satu fitur istimewa dari IMAP, yaitu [IMAP-Idle](http://en.wikipedia.org/wiki/IMAP_IDLE). Fitur ini akan sangat berguna kelak di kemudian hari. Kebetulan [GMail sudah mendukung fitur ini](http://samj.net/2008/07/proof-gmail-imap-gimap-supports-imap.html). 



### Desain Implementasi


Baiklah, mari kita implementasikan sinkronisasi melalui email. Ada beberapa pertanyaan lanjutan. Pertama, apa yang ingin dikirim? Sebagai contoh sederhana, kita ingin mengirim data produk baru dari pusat ke cabang. Inilah class Produk. 


    
    
    public class Produk {
      private Integer id;
      private String kode;
      private String nama;
      
      // getter dan setter
    }
    



Bila kita membuat object Produk, datanya akan tersimpan di memori. Kita harus mengkonversi format data di memori ini ke bentuk file, supaya bisa dikirim dalam bentuk attachment. Ada beberapa pilihan lagi di sini, yaitu : 





  * java.io.Serializable, konversi dengan ObjectInputStream dan ObjectOutputStream


  * JSON


  * XML




Serializable lebih unggul dalam hal kemudahan coding dan kecepatan marshall/unmarshall. Di Java menulis object ke file sangat mudah dan cepat. Prosesnya sama untuk apapun object yang ingin kita konversi. Untuk memproses konversi juga tidak dibutuhkan CPU dan Memori tinggi. Walaupun demikian, file yang dihasilkan berbentuk binary, sehingga menyulitkan debugging. 

JSON dan XML berbentuk text, sehingga mudah didebug kalau ada masalah. Walaupun demikian, kita harus membuat atau memilih dari yang ada implementasi generator dan parser untuk proses konversi. Proses konversinya butuh resource CPU dan memori. Dan yang paling penting, kita mungkin harus membuat generator/parser untuk tiap tipe data yang akan kita kirim. 

Sementara saya pilih JSON, karena ada [json-lib](http://json-lib.sourceforge.net/usage.html) yang bisa mengkonversi object menjadi JSON dan sebaliknya dengan mudah. 

Selanjutnya, bagaimana cara mengirim email?

Cara mengirim email dengan Java sudah ditunjukkan Ifnu [di sini](http://ifnu.artivisi.com/?p=80). Tapi saya tidak mau coding tangan kosong seperti itu. Bukan apa-apa, setiap baris kode yang kita tulis harus ditest dan dimaintain. Belum lagi kalo nanti ada perubahan requirement, bisa coding ulang. 

Nah, pertama saya memutuskan [menggunakan Spring untuk mengirim email](http://static.springframework.org/spring/docs/2.5.x/reference/mail.html). Ibaratnya kalau coding sendiri itu berkelahi dengan tangan kosong, pakai Spring berkelahi pakai pistol. Jauh lebih cepat dan mudah. 

Tapi ternyata, pistol juga tidak cukup, karena kita belum bisa menerima email. Bisa kirim gak bisa terima ya percuma, karena di sisi kantor cabang kita tentu harus mengambil dan memproses data yang dikirim dari pusat. Ifnu sebetulnya sudah membuat implementasi penerima emailnya, tapi nampaknya belum diposting. 

Saatnya membuka gudang senjata dan mencari senjata yang lebih besar. Saya menemukan rocket launcher, yaitu [Spring Integration](http://www.springsource.org/spring-integration). 

Bukan saja bisa menerima email, Spring Integration juga bisa menggunakan semua alternatif transport yang disebutkan di atas (WS, HTTPInvoker, RMI, FTP, SSH, JMS, Email) hanya dengan mengganti beberapa baris konfigurasi. Wow .... canggih sekali. Baiklah, saya akan pakai ini saja. 

Berhubung artikel ini sudah terlalu panjang. Implementasi Spring Integrationnya diteruskan di [bagian kedua](http://endy.artivisi.com/blog/java/integrasi-pusat-cabang-2). 
