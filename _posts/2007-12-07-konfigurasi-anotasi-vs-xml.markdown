---
comments: true
date: 2007-12-07 14:30:47
layout: post
slug: konfigurasi-anotasi-vs-xml
title: Annotation dan XML
wordpress_id: 318
categories:
- java
---

Salah satu [komentator bertanya seperti ini](http://endy.artivisi.com/blog/java/akses-database-spring25/#comment-9582), 



> 
kenapa annotation lebih diprefer daripada xml configuration ? bukannya xml configuration di spring membuat kontrol kita lebih sentralisasi, sehingga lebih mudah dimaintain ?




Hmm... saya tidak ingin terlibat flame war annotation vs xml. Masing-masing memiliki plus minusnya. Ada saatnya kita memakai annotation dan ada saatnya XML lebih tepat. Mari kita bahas.



Beberapa waktu yang lalu, saya pernah ditugaskan untuk memeriksa aplikasi finansial yang error. Pada salah satu halaman, bila tombol Submit ditekan, aplikasi akan hang. Aplikasi ini dibuat menggunakan teknologi VB 6 (RIP) untuk komponen akses database, ASP untuk tampilan, dan Stored Procedure MS-SQL Server 2005 untuk sebagian logika bisnis. 

Setelah memasukkan trace statement ke dalam Stored Procedure (ternyata bukan hal yang mudah, tidak semudah menyisipkan System.out.println(), terlihat penyebabnya karena ada cyclic dependency antar transaksi database. Transaksi A mencoba mengurangi saldo, tapi sebelumnya memeriksa posisi saldo, kalau-kalau tidak mencukupi. Pemeriksaan saldo dilakukan melalui transaksi B. Transaksi B mencoba melihat tabel saldo, yang ternyata sudah dikunci oleh transaksi A. Ya sampai kapanpun transaksi A dan B akan saling menunggu. 

Baiklah, masalah sudah ditemukan, saatnya untuk memperbaiki. Memperbaiki jauh lebih mudah daripada menemukan bug, kan? 

Sayangnya tidak demikian. Ada berbagai faktor, salah satunya yang paling signifikan adalah saya awam dengan teknologi Microsoft. Saya sama sekali tidak mengerti bagaimana cara mengatur transaksi di VB dan Stored Procedure. 

Akhirnya setelah google kesana kemari, saya menemukan empat cara untuk melakukan setting transaksi: 

  * coding di VB
  * coding di Stored Procedure
  * konfigurasi class properties di VB
  * konfigurasi di COM service pada Control Panel Windows

Waduh ... ini mimpi buruk. Berarti ada banyak kombinasi yang harus dicoba. Saya yakin para MVP pasti dengan cepat bisa memilih, tapi saya hanyalah seorang programmer Java. Mana saya tahu hal beginian. 

Dari kejadian ini, saya mendapat pelajaran penting. Pengaturan transaksi haruslah dekat dengan kode yang melakukan transaksi. Alasannya, kode program yang mengakses database sangat erat hubungannya dengan pengaturan transaksi. Tidak mungkin kita menulis kode untuk transfer antar rekening tapi menon-aktifkan transaksi database.

Kode seperti ini mudah dipahami dan mudah didebug. 

    
    
    @Transactional(readOnly=false)
    public void transferAntarRekening(Rekening asal, Rekening tujuan, BigDecimal jumlah){
      asal.credit(jumlah);
      tujuan.debet(jumlah);
    }
    



Kode seperti ini perlu banyak Alt-Tab untuk mendebugnya.

Di Java:

    
    
    public void transferAntarRekening(Rekening asal, Rekening tujuan, BigDecimal jumlah){
      asal.credit(jumlah);
      tujuan.debet(jumlah);
    }
    



Di XML


    
    
    <property name="transactionAttributes">
      <props>
        <prop key="transfer*">PROPAGATION_REQUIRED</prop>
      </props>
    </property>
    



Bedakan antara cara melakukan transaksi, dan cara melakukan konfigurasi. Di Java, kita bisa memilih beberapa cara transaksi: 

  * Local Transaction: mengelola transaksi melalui java.sql.Connection dalam source code
  * Programmatic Transaction: mengambil object Transaction dari JTS provider, kemudian menggunakannya untuk commit/rollback. Ini juga dilakukan dalam source code.
  * Declarative Transaction: mengatur transaksi melalui konfigurasi. 

Kalau kita pilih declarative transaction, ada beberapa cara konfigurasinya: 

  * Melalui XML
  * Melalui Annotation

Yang mana yang paling dekat dengan source code yang bertransaksi? Tentu saja annotation. 

Ok, sudah jelas mengenai transaction, sebaiknya di annotation saja. 

Berikutnya, deklarasi DAO. Sebelumnya kita melakukan deklarasi DAO di XML. Yang biasa saya lakukan kalau ada DAO baru biasanya sama: 

  * copy paste deklarasi DAO di atasnya
  * ganti bean id
  * ganti nama class

Beres. Tidak ada added value di sini. Deklarasi manual di XML tidak membuat konfigurasi Spring jadi lebih mudah dipahami. Juga tidak membuat kita makin pintar. Ini adalah overhead pemrograman dengan Spring. Boilerplate code. Kode yang ditulis hanya untuk memuaskan framework. 

Jadi, lebih baik kalau kita suruh Spring autodetect saja dari annotation @Repository.

Bagaimana dengan relasi dengan datasource? Bukankah kalau di XML jadi terlihat DAO mana menggunakan DataSource mana?

Hmm ... untuk kasus datasource, ada dua kemungkinan: 

  * menggunakan satu datasource
  * menggunakan lebih dari satu datasource

Untuk kasus pertama, biasanya sebagian aplikasi seperti ini, tidak perlu ada deklarasi eksplisit untuk injeksi dataSource. Lha wong cuma satu, apanya yang ambigu? @Autowired saja semuanya. 

Untuk kasus kedua, mau tidak mau memang harus XML. Soalnya @Autowired by type tidak akan bisa, karena ada lebih dari satu bean bertipe DataSource. 

Sekarang kita lihat, apa yang tertinggal di konfigurasi XML, setelah banyak hal kita pindahkan ke annotation: 

  * deklarasi datasource
  * deklarasi transaction manager

Kedua hal ini tidak logis bila kita pindahkan ke annotation. Dua-duanya adalah konfigurasi, sangat mungkin berubah tergantung strategi deployment. Bila kita mengelola koneksi database melalui application server, maka kita akan menggunakan JNDI. Bila kita deploy di [Winstone](http://winstone.sourceforge.net), maka kita tidak menggunakan JTA, jadi transaction manager menggunakan LocalTransactionManager.

Setelah selesai dengan isu backend, mari sekarang kita bahas presentation layer. Ada beberapa anotasi di sini: 

  * @Controller : untuk menandai class Controller
  * @RequestMapping : untuk mapping URL atau Request Method ke handlernya
  * @RequestParam : untuk mem-bind request parameter ke variabel
  * @ModelAttribute : untuk mem-bind object ke request attribute
  * @SessionAttribute : untuk mem-bind object ke session attribute

@Controller sama dengan @Repository. Keberadaannya menghilangkan boilerplate deklarasi di XML. Menurut saya, ini sangat mengurangi clutter dan duplikasi di XML.

@RequestMapping, saya 50:50 di sini. 

Di satu sisi, seharusnya kita tidak mengikat handler method dengan URL pattern, supaya kita bisa mengganti skema URL sesuai trend terbaru (RESTful, etc) atau sebaliknya, supaya bisa mengganti handler method tanpa mengubah URL. 

Tapi di sisi lain, saya ingin menggunakan Convention over Configuration ala [Rails](http://rubyonrails.org). Yaitu nama view otomatis diambil dari request URL. Ini benar-benar mengurangi jumlah konfigurasi yang harus ditulis. Lagipula, seberapa sering sih kita mengganti pasangan URL-Handler?

Jadi untuk @RequestMapping, posisi saya adalah, tergantung situasi. Ada saatnya mapping di XML, dan ada saatnya mapping dengan annotation.

@RequestParam, @ModelAttribute, dan @SessionAttribute setahu saya tidak punya padanan XML. Ini adalah anotasi untuk memudahkan coding saja. Jadi tidak perlu diperdebatkan apakah sebaiknya di XML saja.

Yah, begitulah sekilas perbandingan antara konfigurasi melalui anotasi dan XML. Sepertinya menambah bingung. Tapi jangan khawatir, untuk bisa mengerti harus bingung dulu.

Semoga bermanfaat.

:D
