---
layout: post
title: "Release Management"
date: 2012-08-29 18:01
comments: true
categories: 
- manajemen
---
Release, atau di-Indonesia-kan menjadi rilis, adalah tahap yang paling penting dalam software development. Segala kegiatan hulu (upstream activity) lainnya seperti [requirement](/manajemen/fase-requirement/ "Fase Requirement"), desain aplikasi, coding, testing, dan lainnya, semua dilakukan demi untuk menghasilkan software yang bisa dirilis. Sebagus apapun kita melakukan kegiatan lainnya, jika rilisnya tidak bagus, maka semua yang kita kerjakan menjadi tidak bagus. Sebaliknya, berbagai kesalahan dan kekurangan di kegiatan lain akan mudah dimaafkan dan dilupakan kalau kita menghasilkan rilis yang baik. Walaupun demikian, perlu diingat bahwa bila kita melakukan kegiatan hulu dengan baik, biasanya kita bisa menghasilkan rilis yang berkualitas baik secara konsisten. 

Pada artikel ini, kita akan membahas pernak-pernik yang berkaitan dengan rilis. Apa itu rilis, berbagai jenis rilis, syarat dan ketentuan rilis, dan juga prosedur yang kita gunakan di ArtiVisi. 

<!--more-->

# Apa itu rilis #

Rilis pada intinya adalah menyerahkan software yang sudah kita kerjakan ke pihak lain. Berdasarkan siapa yang dimaksud dengan pihak lain, kita membedakan rilis menjadi :

* rilis internal : menyerahkan software ke pihak internal tim pengembang, misalnya dari programmer ke tester.
* rilis eksternal : menyerahkan ke pihak luar seperti client atau customer.

Kita tidak harus menunggu sampai software selesai dikerjakan 100% untuk melakukan rilis. Berdasarkan tingkat penyelesaian pekerjaan, kita bisa membedakan rilis menjadi :

* development release : Ini adalah rilis yang dilakukan sebelum software selesai dikerjakan. Rilis ini dibuat untuk menunjukkan kemajuan dalam proses development, misalnya menunjukkan tambahan fitur baru ataupun sekedar menunjukkan perbedaan dengan rilis sebelumnya. Development release biasa dilakukan secara rutin dan periodik. Ada yang melakukannya secara mingguan, harian, bahkan dua kali sehari. Rilis jenis ini juga biasa disebut dengan unstable release (karena softwarenya belum stabil - sering hang atau error), milestone release, daily/nightly build release, atau alpha release.

* testing release : Ini adalah rilis yang dilakukan setelah aplikasi siap untuk dites. Pada titik ini biasanya sudah tidak ada penambahan fitur lagi. Software yang dibuat diserahkan ke tester untuk dicari bugnya. Hasil laporan bug itu kemudian akan ditindak lanjuti sehingga menghasilkan testing release berikutnya. Kalau kita pernah mendengar istilah beta release, biasanya itu maksudnya adalah testing release. Orang sering membagi lagi testing release menjadi beta release dan release candidate. Pada prinsipnya, beta dan release candidate sama saja, bedanya ada di cakupan tester. Beta release khusus untuk dites oleh tester, sedangkan release candidate bisa juga dites oleh end-user.

* final release : Rilis jenis ini menyatakan bahwa software sudah selesai dikerjakan, dites, dan laporan bugnya sudah ditindak lanjuti. Biasa disebut juga stable release, karena software yang dihasilkan bisa digunakan dengan lancar dan nyaman (stabil).

# Manfaat Rilis #

Manfaat rilis tentunya adalah supaya software yang sudah susah payah kita buat, bisa bermanfaat bagi penggunanya dan sukur-sukur bisa menghasilkan uang bagi pembuatnya. Karena di atas kita sudah membahas berbagai jenis rilis, tentu juga ada macam-macam manfaat dari berbagai jenis rilis tersebut.

Development release sebaiknya dilakukan sesering mungkin. Agar tidak merepotkan, dilakukan menggunakan perangkat otomasi seperti [Jenkins](http://jenkins-ci.org/ "Jenkins Continuous Integration"). Manfaat dari development release adalah untuk memastikan integrasi antara fitur berjalan dengan baik. Sering kali pada saat membuat fitur X, secara tidak sengaja mempengaruhi fitur Y sehingga tidak berjalan dengan baik. Hal inilah yang coba dicegah dengan development release.

Testing release manfaatnya adalah supaya software yang kita buat bisa diperiksa oleh orang lain dengan perspektif yang berbeda dan lebih fresh. Programmer yang membuat aplikasi pastinya sudah hafal perilaku aplikasi yang dibuatnya, sehingga bisa menghindari error yang mungkin terjadi. Tapi tester atau user tidak memiliki pengetahuan tentang cara kerja internal aplikasi, sehingga lebih mungkin menemukan skenario yang belum diantisipasi oleh software. 

Final release tentunya berguna supaya software kita bisa digunakan oleh masyarakat umum. Para pengguna (end user) biasanya menunggu sampai suatu software dinyatakan selesai, baru dia mau menggunakannya. Demikian juga bila aplikasi yang kita buat akan dibundel oleh orang lain (contohnya distro Linux, integrasi dengan aplikasi lain, dsb), tentu mereka akan menunggu keluarnya rilis final. 

# Aturan Rilis #

Seperti kita bahas sebelumnya, tujuan rilis adalah supaya software kita bisa digunakan oleh orang lain. Oleh karena itu, kita harus memudahkan pengguna dalam memahami rilis yang kita keluarkan.

Hal paling penting dalam melakukan rilis adalah aturan penamaan. Dengan aturan penamaan yang baik, kita bisa: 

* menjelaskan status rilis, apakah ini development release, testing, atau final.
* menjelaskan kompatibilitas dengan versi sebelumnya dan aplikasi lain. Ini akan dijelaskan secara lebih detail sebentar lagi.
* menjelaskan hubungan dengan rilis lainnya. Bila kita memiliki dua rilis, kita bisa membedakan mana rilis yang duluan dan mana yang belakangan.

# Studi Kasus #

Untuk memudahkan pemahaman tentang penamaan rilis, mari kita karang studi kasusnya, yaitu Facebook Contact Backup.

> Aplikasi Facebook Contact Backup (FCB) adalah aplikasi yang bisa mendownload daftar contact kita di facebook, kemudian menuliskannya ke dalam text file. Contoh textfile akan dilampirkan di bawah. Untuk versi pertama, informasi kontak yang ditampilkan adalah : nama, email, no HP.

Berikut contoh file yang dihasilkan oleh aplikasi FCB

``` xml facebook_contact.xml
<contacts>
    <contact>
        <name>Endy Muhardin</contact>
        <email>endy@geemail.com</email>
        <mobile>081298000468</mobile>
    </contact>
    <contact>
        <name>Ifnu Bima</contact>
        <email>ifnu@geemail.com</email>
        <mobile>+6281234567890</mobile>
    </contact>
</contacts>
```

> Karena aplikasi FCB kemudian menjadi populer, ada orang lain yang membuat aplikasi untuk mengisi phonebook di handphone bernama Handphone Contact Importer (HCI). Aplikasi HCI ini menggunakan aplikasi FCB untuk connect ke facebook dan mengambil data contact. Setelah datanya ada dalam format textfile, aplikasi HCI akan membaca text file tersebut dan kemudian mengisinya ke phonebook handphone.

Aplikasi FCB dikembangkan dengan cepat sehingga menghasilkan beberapa rilis sebagai berikut:

## Rilis Pertama ##
Memperbaiki format nomer handphone, sehingga semua diseragamkan menjadi format internasional. Nomer `081298000468` pada contoh di atas akan dikonversi menjadi `+6281298000468`

## Rilis Kedua ##
Fix protokol komunikasi ke Facebook, karena ada perubahan di Facebook API.

## Rilis Ketiga ##
Menambahkan field ulang tahun sehingga format text file menjadi sebagai berikut :

``` xml facebook_contact.xml
<contacts>
    <contact>
        <name>Endy Muhardin</contact>
        <email>endy@geemail.com</email>
        <mobile>+6281298000468</mobile>
        <birthdate>1945-08-17</birthdate>
    </contact>
    <contact>
        <name>Ifnu Bima</contact>
        <email>ifnu@geemail.com</email>
        <mobile>+6281234567890</mobile>
        <birthdate>2011-11-11</birthdate>
    </contact>
</contacts>
```

## Rilis Keempat ##
Ganti format xml menjadi json, mengikuti trend masa kini. 
``` js facebook_contact.json
[
    {
        name: "Endy Muhardin",
        email: "endy@geemail.com",
        mobile: "+6281298000468",
        birthdate: "1945-08-17"
    },
    {
        name: "Ifnu Bima",
        email: "ifnu@geemail.com",
        mobile: "+6281234567890",
        birthdate: "2011-11-11"
    }
]
```

Dengan studi kasus di atas, kita harus mempertimbangkan penomoran rilis untuk aplikasi FCB dengan benar, supaya aplikasi HCI bisa tahu apa yang harus dilakukan pada saat aplikasi FCB mengeluarkan rilis baru.

# Kompatibilitas #
Dalam mengeluarkan rilis untuk aplikasi FCB, kita harus mempertimbangkan aplikasi HCI agar tidak rusak. Pengaruh aplikasi FCB terhadap HCI dikenal dengan istilah kompatibilitas. Kompatibilitas dibedakan berdasarkan ketergantungan secara programmatic:

* binary compatibility : FCB terbaru disebut binary-compatible dengan HCI bila FCB yang sudah dicompile bisa langsung ditaruh di folder dan dipakai oleh HCI.
* source compatibility : FCB terbaru disebut source-compatible dengan HCI bila FCB yang sudah dicompile tidak bisa langsung ditaruh begitu saja. HCI harus dicompile ulang dulu dengan FCB terbaru, baru HCI bisa dijalankan.

Lebih lanjut tentang binary vs source compatibility bisa dibaca [di artikel ini](http://blogs.msdn.com/b/jmstall/archive/2008/03/10/binary-vs-source-compatibility.aspx).

Dan juga bisa dibedakan berdasarkan hubungannya dengan rilis terdahulu. 

*  backward compatibility : bila HCI versi terbaru bisa menggunakan format data FCB yang terdahulu. Misalnya, aplikasi HCI terbaru bisa membaca data versi baru (json), versi sebelumnya (xml), dan sebelumnya lagi (xml tanpa field birthdate)
*  forward compatibility : bila HCI versi jadul bisa membaca format data FCB yang lama (xml tanpa birthdate) dan yang lebih baru yang dirilis setelah HCI jadul tersebut (xml dengan birhtdate). 

Setelah kita memahami urusan kompatibilitas, kita bisa menentukan skema penamaan rilis, atau dikenal dengan istilah version numbering. 

# Version Numbering #
Kita akan menggunakan [aturan dari Apache Portable Runtime](http://apr.apache.org/versioning.html "Version Numbering APR") yang sudah diakui sebagai best-practices dalam version numbering. Aturan APR mengharuskan ada tiga komponen version number, yaitu :

* major number
* minor number
* patch number

Contohnya, waktu pertama kita merilis FCB, kita beri nama `FCB-1.0.0`. Major numbernya 1, minor numbernya 0, patch numbernya 0. 

Untuk rilis selanjutnya, kita menaikkan major/minor/patch number sesuai dengan pengaruhnya terhadap kompatibilitas. Aturannya sebagai berikut:

* major number dinaikkan bila FCB baru tidak kompatibel dengan FCB rilis sebelumnya. Bila HCI dipasang dengan FCB terbaru ini, HCI akan error.
* minor number dinaikkan bila FCB baru mengandung penambahan fitur, tapi tetap kompatibel dengan HCI yang dibuat berdasarkan FCB lama. HCI versi lama tetap bisa jalan, walaupun tidak bisa memanfaatkan fitur yang baru.
* patch dinaikkan bila tidak ada perubahan secara fitur, tapi cuma ada perbaikan di internal FCB yang tidak terlihat dari luar (misalnya optimasi koneksi jaringan, perubahan protokol ke arah Facebook, dsb)

Selanjutnya, mari kita beri nomer sesuai studi kasus kita di atas. 

1. Rilis Pertama : diberi nama `1.1.0`, karena cuma terjadi perubahan di content saja. HCI yang dibuat dengan FCB versi `1.0.0` akan tetap berjalan lancar
2. Rilis Kedua : diberi nama `1.1.1`, karena perubahan protokol komunikasi dengan Facebook tidak mempengaruhi HCI sama sekali. HCI versi lama tetap bisa jalan dengan lancar.
3. Rilis Ketiga : diberi nama `1.2.0`, sama dengan rilis pertama. Ada penambahan fitur, tapi tidak membuat HCI jadi error. Dengan rilis ini, programmer HCI bisa menambahkan fitur baru misalnya reminder ulang tahun. Tapi HCI versi lama (tanpa reminder ulang tahun) tetap bisa digunakan dengan `FCB-1.2.0`
4. Rilis Keempat : diberi nama `2.0.0`. Ini adalah perubahan signifikan. Untuk dapat menggunakan `FCB-2.0.0` ini, HCI harus mengalami perubahan signifikan. HCI versi lama tidak bisa digunakan dengan `FCB-2.0.0`. Agar dapat digunakan, programmer HCI harus mengeluarkan rilis baru yang bisa mengakomodasi format data JSON.

Berikutnya, mari kita lihat pengaruhnya untuk HCI. 

1. `HCI-1.0.0` : versi pertama, dibuat dengan `FCB-1.0.0`
2. Rilis `FCB-1.1.0` : tidak ada tambahan fitur yang bisa dibuat di HCI, sehingga programmernya tidak coding.
3. Rilis `FCB-1.1.1` : tidak ada perubahan yang terlihat. Programmer HCI makan gaji buta sambil update status Facebook. Nganggurnya programmer HCI ini berarti `HCI-1.0.0` forward-compatible dengan `FCB-1.0.0`, `FCB-1.1.0`, hingga `FCB-1.1.1`.
4. Rilis `FCB-1.2.0` : ada field baru (birthdate) yang bisa dimanfaatkan, programmer HCI mulai coding.
5. `HCI-1.1.0` : tambahan fitur reminder ulang tahun. `HCI-1.1.0` ini backward-compatible dengan `FCB-1.1.1`, `FCB-1.1.0`, maupun `FCB-1.0.0`.
6. Rilis `FCB-2.0.0` : HCI semua versi tidak dapat digunakan bila user meng-upgrade FCB-nya. Programmer HCI harus segera mengeluarkan rilis baru, tidak boleh coding sambil facebookan. 
7. `HCI-1.1.1` : bagi end-user, HCI terbaru ini tidak ada tambahan fiturnya. Tapi dia fixing bug, yang tadinya error pada waktu dijalankan (karena FCB-nya tidak kompatibel), menjadi tidak error. 

Selain major.minor.patch, ada kalanya orang juga menambahkan satu informasi lagi yang menyatakan kestabilan rilis. Berikut beberapa contohnya:

* `FCB-1.0.1-SNAPSHOT` : ini biasanya digunakan untuk mencerminkan rilis daily build terbaru
* `FCB-1.0.0-20121212080808` : ini biasanya digunakan untuk menunjukkan hasil daily build tertentu
* `FCB-1.0.1-RC-01` : release candidate pertama
* `FCB-1.0.0-M2` : milestone kedua
* `FCB-1.0.0-Final` : final release. Ada orang yang menambahkan keyword Final, ada juga yang tidak. 
* `FCB-1.0.0-GA` : generally available, sama dengan final release
* `FCB-1.0.0-RELEASE` : sama dengan GA dan Final

Penomoran versi ini terlihat sepele saja. Tapi kalau kita tidak punya aturan penamaan yang jelas, maka orang lain akan bingung setiap kali ada rilis baru. Mereka tidak bisa menentukan apakah harus upgrade atau tidak, karena mereka tidak bisa tahu bagaimana kompatibilitas rilis ini dengan aplikasi lainnya. Salah satu contoh populer kekacauan yang disebabkan penomoran versi yang sembarangan [bisa dilihat di komunitas Ruby](http://news.ycombinator.com/item?id=1734936). Akibat aturan rilis Ruby tidak jelas, sehingga dibutuhkan aplikasi lain seperti RVM atau rbenv supaya antar versi Ruby tidak saling bentrok. Effort yang dikeluarkan untuk membuat dan memantain RVM dan rbenv tentu tidak sedikit. Ini semua disebabkan *hanya karena* penomoran versi belaka. Hasil akhir dari semua ini, sampai saat artikel ini ditulis, [Ruby belum bisa dipaket dengan benar di distro Debian](http://ryanbigg.com/2010/12/ubuntu-ruby-rvm-rails-and-you/) dan turunannya (termasuk Ubuntu).

# Release Notes #
Tentunya penomoran versi saja tidak bisa memuat informasi yang detail. Kita membutuhkan sarana lain untuk memberikan informasi yang detail tentang isi dari suatu rilis. Untuk keperluan ini, biasanya orang membuat dokumen yang disebut Release Notes. Beberapa hal yang biasanya dicantumkan dalam release notes antara lain:

* fitur baru
* bug yang diperbaiki
* enhancement/improvement, yaitu perbaikan pada fitur yang ada
* known issues, yaitu bug atau error yang sudah teridentifikasi tapi belum difix. Informasi ini menunjukkan bahwa programmernya sudah tahu bahwa ada bug, tapi karena satu dan lain hal belum memperbaikinya
* kontributor, yaitu siapa saja yang berkontribusi di rilis ini.
* to do, yaitu fitur apa yang direncanakan akan dibuat pada rilis berikut. Informasi ini bisa juga ditulis di dokumen terpisah bernama roadmap

Contoh release notes bisa dilihat [di sini](/images/uploads/2012/08/RELEASE.txt "Contoh Release Notes").

# Tools #
Ada beberapa hal yang perlu dilakukan pada waktu kita akan melakukan rilis, yaitu:

* menaikkan nomor versi di source code. Biasanya kita ada mencantumkan nomor versi di aplikasi, misalnya di halaman About.
* membuat rekap perubahan yang terjadi sejak rilis sebelumnya
* membuat tag di version control database

Semua kegiatan di atas dapat dioptimasi dengan tools misalnya [maven-release-plugin](http://maven.apache.org/plugins/maven-release-plugin/ "Maven Release Plugin"). Cara pakainya bisa dilihat [di sini](http://java.dzone.com/articles/automating-releases-maven-0). Tapi beberapa orang melihat bahwa maven-release-plugin ini tidak memenuhi kebutuhannya, sehingga dia pakai [cara yang lain](http://www.axelfontaine.com/2011/01/maven-releases-on-steroids-adios.html).

Di ArtiVisi, kita sudah mencoba maven-release-plugin, dan berpendapat bahwa dia [terlalu kaku](http://www.sonatype.com/people/2011/01/using-the-maven-release-plugin-things-to-know/) sehingga sulit dikonfigurasi agar sesuai dengan kebutuhan kita. Akhirnya kita menggunakan cara manual dengan prosedur sebagai berikut:

## Prosedur Rilis ArtiVisi ##

Contoh skenario :

* Rilis sebelumnya : `1.2.0`
* Rilis sekarang : `1.2.1`

Langkah-langkah melakukan rilis :

1. Generate Changelog dengan perintah `git shortlog 1.2.0..HEAD`

2. Copy paste output dari langkah 1 ke dalam release notes. 

3. Naikkan version number di dalam source code menggunakan Eclipse. Search file `pom.xml`, find `1.2.0` dan replace menjadi `1.2.1`. 

4. Save semua file, kemudian commit ke Git dengan perintah `git commit -m "release 1.2.1"`

5. Buat tag di Git dengan perintah `git tag -a -F RELEASE.txt 1.2.1`

# Penutup #
Demikianlah penjelasan tentang serba-serbi release management dalam software development. Mudah-mudahan bisa membuat project dan produk yang kita hasilkan lebih mudah dikelola.
