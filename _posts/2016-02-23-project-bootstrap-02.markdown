---
layout: post
title: "Setup Continuous Integration"
date: 2016-02-23 02:00
comments: true
categories: 
- java
---
Pada [artikel sebelumnya](http://software.endy.muhardin.com/java/project-bootstrap-01/), kita telah membuat struktur project lengkap dari database sampai ke web. Project tersebut juga telah dilengkapi dengan automated test dan sampel data.

Akan tetapi, di artikel terdahulu tersebut, kita harus menjalankan semua test tersebut melalui command line. Dengan demikian, bila ada programmer yang malas membuat automated test dan menjalankannya, kita tidak bisa mendeteksinya.

Untuk itu, kita akan mengkonfigurasi continuous integration, yaitu suatu scheduler yang memantau repository Git kita, dan menjalankan proses build pada waktu ada update di repository. Dengan demikian, apabila terjadi error, semua anggota tim bisa langsung mendapatkan notifikasi.

Ada beberapa tools untuk menjalankan proses ini. Pada jaman dahulu saya pernah juga menulis artikel tentang penggunaan [CruiseControl](http://software.endy.muhardin.com/aplikasi/cruise-control/) dan [Luntbuild](http://software.endy.muhardin.com/java/luntbuild/). Tapi itu artikel jadul sekali, yang populer pada jaman sekarang adalah [Travis](https://travis-ci.org/) dan [Jenkins](http://jenkins-ci.org/)

<!--more-->

## Travis ##

Travis adalah tools continuous integration (kita singkat saja CI yah, capek ngetiknya) yang berbasis cloud. Kita tinggal registrasi, daftarkan project kita, dan dia akan melakukan build terhadap project kita.

Travis CI sangat terintegrasi dengan Github. Jadi kalau kita sudah punya akun Github, kita bisa langsung login menggunakan Github.

[![Travis CI Home Page](https://lh3.googleusercontent.com/YVjGIJ31L9iwcOTdSAqzXULEoIqMGjFVnB9nFn-BGON6xnuEEYwz8YjQrvujRg_RR2bMF5y_KHvG=w586-h315-no)](https://lh3.googleusercontent.com/YVjGIJ31L9iwcOTdSAqzXULEoIqMGjFVnB9nFn-BGON6xnuEEYwz8YjQrvujRg_RR2bMF5y_KHvG=w586-h315-no)

Setelah kita login, Travis akan mengakses akun Github kita dan menampilkan daftar repository kita dalam Github. Untuk mengaktifkan fitur CI, kita tinggal klik saja project yang ingin diproses.

[![Enable CI di Travis](https://lh3.googleusercontent.com/uXb5IrJuZUJaGcpM41-d-cgW8lId4PBU89M10Y1r-4UnoGgIi4aVyQKEpAyjzCFVvDGsXI1gheiS=w399-h315-no)](https://lh3.googleusercontent.com/uXb5IrJuZUJaGcpM41-d-cgW8lId4PBU89M10Y1r-4UnoGgIi4aVyQKEpAyjzCFVvDGsXI1gheiS=w399-h315-no)

Setelah dienable, Travis akan memantau project kita. Pada saat terjadi `git push`, Travis akan menjalankan proses build sesuai konfigurasi yang kita tulis di file `.travis.yml`. Berikut contoh file yang saya gunakan

```yml
language: java

jdk:
    - oraclejdk8

services:
    - mysql

before_install: 
    - mysql -uroot -e "grant all on belajar.* to belajar@localhost identified by 'java'"
    - mysql -uroot -e "drop database if exists belajar"
    - mysql -uroot -e "create database belajar"
```

Pada konfigurasi di atas, kita menyatakan bahwa project kita dibuat menggunakan bahasa pemrograman Java. Travis akan mencoba melakukan build menggunakan Maven atau Gradle. Bila di project kita ada file `pom.xml`, Travis akan menggunakan Maven. Demikian juga bila ditemukan file `build.gradle`, Travis akan menggunakan Gradle. Dokumentasi lengkapnya bisa dibaca [di dokumentasi Travis](https://docs.travis-ci.com/user/languages/java).

Aplikasi kita menggunakan database MySQL. Untuk mengaktifkannya kita tulis konfigurasi

```
services:
  - mysql
```

Agar tidak banyak modifikasi source code, kita juga samakan username, password, dan nama database. Ini dikonfigurasi menggunakan script `before install`.

Setelah konfigurasi `.travis.yml` kita sediakan, kita lakukan `git push`. Travis akan mulai melakukan proses build.

[![Proses Build di Travis](https://lh3.googleusercontent.com/klkqYfrSvq8NNxMJ2S7f-0ZMWawEFt4KKEmkD6YkrfDi4XBruAnZG7jH23kAzNivBU8h8nOpskf1=w580-h315-no)](https://lh3.googleusercontent.com/klkqYfrSvq8NNxMJ2S7f-0ZMWawEFt4KKEmkD6YkrfDi4XBruAnZG7jH23kAzNivBU8h8nOpskf1=w580-h315-no)

## Coveralls ##

> Bagaimana bila programmer kita malas membuat automated test?

Pertama, tentu kita butuh notifikasi dulu bila mereka tidak membuat test. Untuk keperluan ini, kita bisa menggunakan coverage testing. Konsepnya sudah pernah saya bahas [di artikel terdahulu](http://software.endy.muhardin.com/java/ruthless-testing-2/).

Pada artikel tersebut, laporan dari coverage report bisa kita lihat di komputer kita sendiri. Belum dipublish supaya bisa dilihat semua orang, dan juga belum ada notifikasinya. Untuk itu, kita menggunakan layanan tambahan yang disediakan oleh [Coveralls](https://coveralls.io/).

[![Coveralls Sign In Page](https://lh3.googleusercontent.com/z2J6XPuXliM_xCd4owr3MZ2CCZ-R81Uhc17p00jAJ1vZPzkO_-HTNnFiSWDwMlvh1i9_mGEmDWEK=w579-h315-no)](https://lh3.googleusercontent.com/z2J6XPuXliM_xCd4owr3MZ2CCZ-R81Uhc17p00jAJ1vZPzkO_-HTNnFiSWDwMlvh1i9_mGEmDWEK=w579-h315-no)

Sama seperti Travis, Coveralls juga sudah terintegrasi dengan Github. Kita bisa login menggunakan akun Github, dan dia akan membaca project-project yang tersedia di akun Github kita.

[![Coveralls Add Repo](https://lh3.googleusercontent.com/UYBoUBRJVmqfxqFxkjlYzu9Eb8mgsxqAee2Bkn5hewrQOyQAsNkvjD59Gk1fI4lK4UfUfy-rGgln=w1069-h484-no)](https://lh3.googleusercontent.com/UYBoUBRJVmqfxqFxkjlYzu9Eb8mgsxqAee2Bkn5hewrQOyQAsNkvjD59Gk1fI4lK4UfUfy-rGgln=w1069-h484-no)

Kita bisa mendaftarkan project yang ingin kita tampilkan coverage reportnya. Setelah dienable, akan tampil instruksi untuk mengirim laporan coverage ke Coveralls.

[![Setup Coveralls](https://lh3.googleusercontent.com/3i4-oNere292oOkYbhFQQzgTw5ei0EN389pdh_gWGup1NF0VnzbzV5f9Y93cJXKnMCB6WpA2KMbl=w1362-h596-no)](https://lh3.googleusercontent.com/3i4-oNere292oOkYbhFQQzgTw5ei0EN389pdh_gWGup1NF0VnzbzV5f9Y93cJXKnMCB6WpA2KMbl=w1362-h596-no)

Sebenarnya Coveralls sendiri tidak melakukan coverage testing. Dia mengandalkan tools lain untuk melakukannya dan menghasilkan report. Di Java, kita bisa menggunakan Jacoco, Cobertura, Saga, dan sebagainya. Oleh karena itu, kita perlu mengaktifkannya dulu di proses build kita. Tambahkan baris berikut di `pom.xml` di dalam tag `<build><plugins>`

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.7.5.201505241946</version>
    <configuration>
        <excludes>
            <exclude>**/BelajarCiApplication.*</exclude>
        </excludes>
    </configuration>
    <executions>
        <execution>
            <id>prepare-agent</id>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Kita kecualikan main class kita, karena isinya cuma `public static void main` yang tidak perlu dites. Bila tidak dikecualikan, akan mengurangi nilai coveragenya.

Jacoco akan menghasilkan file `jacoco.exec` yang merupakan hasil coverage testing dan juga file `target/site/jacoco/jacoco.xml`. File ini kemudian akan dikonversi menjadi file JSON yang dipahami oleh Coveralls dan dikirim melalui REST API. Konversi dan pengiriman ini dilakukan oleh plugin Maven. Tambahkan baris berikut di bawah deklarasi plugin Jacoco.

```xml
<plugin>
    <groupId>org.eluder.coveralls</groupId>
    <artifactId>coveralls-maven-plugin</artifactId>
    <version>4.1.0</version>
</plugin>
```

Agar Maven menjalankan proses pembuatan report, kita harus mengeksekusi target `mvn jacoco:report coveralls:report`. Tambahkan baris berikut di konfigurasi `.travis.yml` agar Travis menjalankan target tersebut

```yml
after_success:
    - mvn jacoco:report coveralls:report
```

Selanjutnya, pada saat kita melakukan `git push`, Travis akan bekerja dan menjalankan target tersebut. Kita dapat melihat history perkembangan nilai coverage test

[![Coverage History](https://lh3.googleusercontent.com/xpBSv6CxRsTD4nUfgsnpTnQzyApd8Dzc9oPlG2zks7nGIx6bkmXxRdTMkmHToysRfmOb9GrvwXiE=w570-h315-no)](https://lh3.googleusercontent.com/xpBSv6CxRsTD4nUfgsnpTnQzyApd8Dzc9oPlG2zks7nGIx6bkmXxRdTMkmHToysRfmOb9GrvwXiE=w570-h315-no)

pada halaman di atas, kita juga bisa mengkonfigurasi notifikasi error apabila nilai coverage turun di bawah sekian persen, atau selisih penurunannya sebesar sekian persen. Saya atur apabila turun di bawah 80%, Coveralls akan mengirim pesan error. Dan bila penurunannya sebesar 5% (misalnya dari 100% turun menjadi 90%), Coveralls juga akan mengirim notifikasi.

Kita juga bisa lihat detail coverage per file source code

[![Coverage Project](https://lh3.googleusercontent.com/hFfcykMnmN23Bk31pJltj0UA6NB-Qg8r6r_ckH0NMuECuEioS99DtftmWpLP2nish9ZDeJrdGD2F=w326-h315-no)](https://lh3.googleusercontent.com/hFfcykMnmN23Bk31pJltj0UA6NB-Qg8r6r_ckH0NMuECuEioS99DtftmWpLP2nish9ZDeJrdGD2F=w326-h315-no)

dan bahkan kalau kita klik, kita bisa lihat baris per baris apakah sudah dijalankan oleh test.

[![Line Coverage](https://lh3.googleusercontent.com/Sjl1xIQnokrCTqYPqlWR8t37zrb5LuGnY1qZ5BeVRJI_FoMdSGzKBIOyJygFCLlrl8MfTcW_lBaM=s315-no)](https://lh3.googleusercontent.com/Sjl1xIQnokrCTqYPqlWR8t37zrb5LuGnY1qZ5BeVRJI_FoMdSGzKBIOyJygFCLlrl8MfTcW_lBaM=s315-no)

## Build Badge ##

Jaman sekarang, sangat penting bahwa kita eksis di dunia maya. Demikian juga dalam urusan project. Travis dan Coveralls memahami ini dan menyediakan badge untuk kita pasang di halaman project kita. Cukup tambahkan baris berikut pada file `README.md`

```md
[[![Build Status](https://travis-ci.org/endymuhardin/belajar-ci.svg?branch=master)](https://travis-ci.org/endymuhardin/belajar-ci)](https://travis-ci.org/endymuhardin/belajar-ci)
[[![Coverage Status](https://coveralls.io/repos/github/endymuhardin/belajar-ci/badge.svg?branch=master)](https://coveralls.io/github/endymuhardin/belajar-ci?branch=master)](https://coveralls.io/github/endymuhardin/belajar-ci?branch=master)
```

untuk menampilkan badge seperti ini

[![Build Badge](https://lh3.googleusercontent.com/Q5nXA4u7k-2TN_JVVq8rzAIG-6BT-mnT4rLqr8CIyZOEsJ8mY78I4Ua14VJrPSYWkQdN6wYN8oSo=w423-h315-no)](https://lh3.googleusercontent.com/Q5nXA4u7k-2TN_JVVq8rzAIG-6BT-mnT4rLqr8CIyZOEsJ8mY78I4Ua14VJrPSYWkQdN6wYN8oSo=w423-h315-no)

## Penutup ##

Untuk project open source, Travis dan Coveralls dapat digunakan secara gratis. Tapi untuk project private, kita harus bayar. Pada saat artikel ini ditulis, harganya $129/bulan/project untuk Travis dan $5/bulan/project untuk Coveralls. Cukup mahal juga.

Bila kita ingin murah, maka kita bisa install sendiri tools CI yang tersedia gratis, misalnya:

* Jenkins
* Gitlab CI

Kita bisa install tools tersebut di hosting gratisan seperti Heroku atau Openshift, atau yang berbayar seperti DigitalOcean atau Linode.

Setelah project kita bisa dibuild otomatis, artikel berikutnya akan membahas tentang [deployment ke cloud provider populer](http://software.endy.muhardin.com/java/project-bootstrap-03/). Stay tuned ......

