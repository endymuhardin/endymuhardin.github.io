---
layout: post
title: "Development Stack 2014"
date: 2014-02-17 07:29
comments: true
categories: 
- java
---

Tiga tahun lalu, saya memposting artikel tentang [stack development yang digunakan di ArtiVisi](http://software.endy.muhardin.com/java/development-stack-2011/). Artikel kali ini adalah update dari stack yang digunakan tiga tahun yang lalu.

Pilihan stack ini saya presentasikan pada pertemuan Java Meet Up (JaMU) Januari 2014 yang diadakan di kantor [blibli.com](http://blibli.com). Materinya bisa diunduh pada link berikut:

* Slide Presentasi bisa [dilihat online](http://software.endy.muhardin.com/files/slide-presentasi/artivisi-stack-2014.html) atau [diunduh dalam format ZIP](http://www.4shared.com/zip/Mo47v94uba/presentasi-jamu-01-2014.html)
* [Rekaman Video dan Screencast](http://www.youtube.com/watch?v=4312GuJVvxs)

Berikut rangkuman dari isi presentasi saya tersebut

[![Foto](https://lh3.googleusercontent.com/-5tGzUVc2lk4/UwFrrT20hmI/AAAAAAAAFJk/zRxIxumf_O4/w800-h566-no/restful-architecture.png)](https://lh3.googleusercontent.com/-5tGzUVc2lk4/UwFrrT20hmI/AAAAAAAAFJk/zRxIxumf_O4/w800-h566-no/restful-architecture.png)

<!--more-->

## Presentation Layer ##

Di sisi tampilan, ArtiVisi menggunakan [Twitter Bootstrap](http://getbootstrap.com/) untuk memperindah tampilan dan [AngularJS](http://angularjs.org/) untuk mengisi dynamic content. Kita **tidak lagi menggunakan** teknologi server side seperti JSF, ZK, JSP, dan sejenisnya. Untuk menyediakan server side service, kita menggunakan [fitur REST dari Spring MVC](http://docs.spring.io/spring/docs/4.0.1.RELEASE/spring-framework-reference/htmlsingle/#mvc-ann-responsebody) yang menerima request HTTP dan mengembalikan response berupa [JSON](http://en.wikipedia.org/wiki/JSON).

Kenapa tidak menggunakan server side rendering? Ada beberapa alasan:

* mencari skill CSS dan JS jauh lebih mudah daripada mencari skill server side dengan Java. Kita bisa rekrut programmer PHP untuk mengerjakan Twitter Bootstrap dan AngularJS. Ketersediaan programmer PHP jauh lebih banyak daripada programmer Java.
* service dari server side yang menerima HTTP request dan mengembalikan JSON bisa digunakan oleh tampilan selain web. Saat ini kita sudah memiliki aplikasi client desktop dan mobile tanpa mengubah aplikasi di sisi server. Bahkan salah satu aplikasi client desktop dibangun dengan cepat menggunakan Delphi oleh customer hanya dengan bermodalkan [pengetahuan tentang format request dan response](http://software.endy.muhardin.com/java/mendebug-aplikasi-ajax/). Customer kami yang lain menambahkan sendiri fitur transaksi melalui SMS menggunakan [playSMS](http://playsms.org/) juga dengan teknik yang sama. Semua ini mereka lakukan sendiri tanpa ada perubahan di sisi server. Ini sulit dilakukan kalau kita menggunakan framework server side.

## Business Service Layer ##

Sebetulnya fitur yang penting di business layer hanya satu, yaitu **declarative transaction management**. Untuk keperluan itu, kita tetap percayakan pada framework yang sudah proven yaitu [Spring Framework](http://projects.spring.io/spring-framework/). 

> Kenapa tidak pakai EJB? Kan sudah tersedia di application server JEE sehingga tidak perlu tambahan JAR?

Ada beberapa alasan:

* Dengan Spring Framework, aplikasi bisa dideploy di application server mana saja. Bisa Tomcat, Jetty, Heroku, Google App Engine, dan sebagainya. Requirement yang dibutuhkan hanyalah Java VM saja.
* Kalau kita menggunakan EJB, kita harus memahami berbagai model programming. Untuk aplikasi web menggunakan EJB, aplikasi konsol (misalnya ISO-8583 gateway) lain lagi, aplikasi desktop beda lagi, aplikasi mobile beda lagi. Kalau kita menggunakan Spring Framework, model pemrogramannya bisa digunakan di berbagai macam aplikasi tadi.

## Data Access Layer ##

Untuk data access layer, sebetulnya kita masih menggunakan [Hibernate ORM](http://hibernate.org/orm/). Tapi kita tidak lagi menggunakannya secara langsung, melainkan dibungkus dengan Spring Data JPA. Tujuannya cuma satu, yaitu [mengurangi jumlah kode program yang harus ditulis](https://github.com/endymuhardin/belajar-restful/commit/972aae9f4363e151a654e3602ea32ef7e704c369).

Manajemen versioning untuk skema database kita gunakan [Liquibase](http://www.liquibase.org/). Tools ini memungkinkan kita untuk:

* mencatat versi skema database
* membuatkan script untuk upgrade/rollback antar versi aplikasi. Misalnya aplikasi kita versi 2.0 mau diupgrade ke versi 2.1. Atau sebaliknya, kita sudah deploy versi 3.2 ternyata ada critical bug sehingga harus balik ke versi 3.1.

## Development Tools ##

Berikut adalah tools development yang kita gunakan:

* Project Management : [Trello](https://trello.com)
* Version Control : [Git](http://git-scm.org/). Di sisi server dimanage dengan [Gitlab](http://gitlab.org/gitlab-ce/)
* Build Tools : [Maven 3](http://maven.apache.org/)
* Functional Test untuk REST : [Rest Assured](https://code.google.com/p/rest-assured/)

## Workflow ##

Secara garis besar, berikut adalah gambaran workflow cara kerja sehari-hari di tim development kita.

[![Foto](https://lh3.googleusercontent.com/-Ne0pSRdBBgk/UwFrsAA5KYI/AAAAAAAAFJs/6IRdUeLGvFA/w800-h566-no/workflow.png)](https://lh3.googleusercontent.com/-Ne0pSRdBBgk/UwFrsAA5KYI/AAAAAAAAFJs/6IRdUeLGvFA/w800-h566-no/workflow.png)

## Proof of Concept ##

Di ArtiVisi kami memiliki aplikasi kecil sebagai *proof of concept* dari teknologi yang kami gunakan. Kalau ada penambahan/pengurangan/perubahan terhadap stack, yang pertama diupdate adalah aplikasi kecil ini. Aplikasinya disediakan gratis [di github](https://github.com/endymuhardin/belajar-restful). Jadi, aplikasi ini akan selalu memuat kombinasi stack terkini yang sedang kami gunakan, walaupun belum sempat diumumkan di posting blog.

Beberapa fitur dari aplikasi ini antara lain:

* CRUD
* relasi one-to-many dan many-to-many
* Popup dialog
* Automated Testing untuk query database dan REST url
* dan fitur-fitur lain yang bisa dieksplorasi sendiri ;)

Dari aplikasi kecil ini, kami membuat template project berupa Maven Archetype yang juga disediakan gratis [di github](https://github.com/artivisi/standard-webapp-archetype). Bagi yang belum familiar dengan Maven, archetype adalah semacam wizard untuk membuat project baru.

## Catatan penting soal performance ##

> Saya ingin membuat aplikasi Java. Framework mana yang performance-nya paling cepat?

Bila Anda menyimak presentasi saya di JaMU, khususnya di slide nomer 5 dan 6, saya tidak menyebut-nyebut masalah performance sebagai salah satu kriteria pemilihan framework/teknologi. Kenapa begitu?

Di jaman sekarang ini, semua teknologi yang umum digunakan orang sudah bisa dioptimasi performancenya. Mau pakai Java, PHP, Ruby, Python, Perl, semua sudah punya portofolio terkenal. Misalnya:

* Java punya Amazon dan Google
* PHP punya Facebook
* Ruby punya Github
* Python punya Google
* Perl punya BBC iPlayer
* dan sebagainya

Demikian juga mengenai Linux vs Windows, MySQL vs Oracle, dan sebagainya. Bagaimana cara meningkatkan performance sudah dirangkum di [website ini](http://highscalability.com/start-here/).

Intinya, performance bukan lagi faktor yang harus dipertimbangkan dalam proses pemilihan. Kalau aplikasi yang kita buat ternyata lemot, maka berikut urutan tersangkanya:

* teknik coding yang salah (biasanya disebabkan karena tidak menguasai [dasar-dasar pemrograman](http://software.endy.muhardin.com/life/lan-na-zha/) seperti misalnya melakukan `select * from tabel_transaksi` dimana isi tabel berisi jutaan record transaksi sejak 10 tahun yang lalu)
* programmernya tidak tahu cara pakai framework/teknologi tersebut
* teknologi tidak sesuai peruntukannya
* belum mengetahui / menerapkan tips dan trik tuning performance untuk teknologi yang dimaksud

Jadi, kalau ada masalah performance, tersangka utama bukanlah teknologinya, tapi usernya. 

> Logikanya sederhana saja, jutaan orang pakai teknologi tersebut. Kalau memang ada masalah besar masa iya tidak muncul di peringkat pertama pada waktu kita [search di Google](http://software.endy.muhardin.com/aplikasi/teknik-menggunakan-google/)?

Demikianlah stack development ArtiVisi di tahun 2014. Untuk lebih jelasnya, silahkan tonton video presentasi JaMU di atas.
