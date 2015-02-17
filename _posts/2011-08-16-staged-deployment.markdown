---
comments: true
date: 2011-08-16 08:57:35
layout: post
slug: staged-deployment
title: Staged Deployment
wordpress_id: 764
categories:
- java
---

Staged Deployment

Pada waktu kita coding, tentunya kita melakukan test terhadap kode program yang kita tulis. Kita jalankan langkah-langkah sesuai yang telah didefinisikan dalam test scenario. Setelah test di komputer kita sendiri (local) selesai dilakukan, tentunya kode program tersebut tidak langsung kita deploy ke production. Best practicesnya adalah, kita deploy aplikasinya ke server testing untuk kemudian ditest oleh Software Tester. Barulah setelah dinyatakan OK oleh tester, aplikasi versi terbaru tersebut kita deploy ke production.

Dengan demikian, kita memiliki tiga deployment environment, yaitu :



     
  * development (komputer si programmer)

     
  * testing (test server)

     
  * production (live system)

 

Environment ini bisa lebih banyak lagi kalau aplikasi kita harus dites kompatibilitasnya dengan berbagai hardware atau sistem operasi.

Cara kerja seperti ini disebut dengan istilah staged deployment atau deployment bertahap. Dengan menggunakan staged deployment, kita mencegah terjadinya bug fatal di production/live system.

Tantangan yang kita hadapi adalah, bagaimana cara mengelola konfigurasi aplikasi kita sehingga bisa dideploy di berbagai environment secara baik. Teknik bagaimana cara melakukan ini berbeda-beda, tergantung bahasa pemrograman, framework, dan library yang kita gunakan.

Pada artikel ini, kita akan membahas cara mengelola konfigurasi deployment menggunakan [teknologi yang biasa digunakan di ArtiVisi](http://endy.artivisi.com/blog/java/development-stack-2011/), yaitu[Spring Framework](http://www.springframework.org) dan [Logback](logback.qos.ch).





## Alternatif Solusi


Manajemen konfigurasi ini bisa kita lakukan dengan dua pendekatan, yaitu dikelola dengan [Maven Profile](http://maven.apache.org/guides/introduction/introduction-to-profiles.html), atau dengan konfigurasi Spring Framework.

Jika kita menggunakan Maven Profile, kita menambahkan opsi pada saat melakukan build, kira-kira seperti ini :

{% gist 1134126 maven-profile.sh %}

atau

{% gist 1134126 maven-env-var.sh %}

Dalam konfigurasi profile, kita bisa memilih file mana yang akan diinclude di dalam hasil build. Hasilnya, kita bisa menghasilkan artifact yang berbeda tergantung dari opsi yang kita berikan pada saat build.

Walaupun demikian, berdasarkan hasil Googling, ternyata [metode ini tidak direkomendasikan](http://java.dzone.com/articles/maven-profile-best-practices). Justru konfigurasi melalui Spring lebih disarankan.

Dengan menggunakan konfigurasi Spring, artifact yang dihasilkan oleh build hanya satu jenis saja. Artifact ini berisi semua pilihan konfigurasi. Konfigurasi mana yang akan aktif pada saat dijalankan (runtime) akan ditentukan oleh setting environment variable, bukan oleh artifactnya.

Selanjutnya, kita akan membahas metode manajemen konfigurasi menggunakan Spring.



## Konfigurasi Database


Konfigurasi yang biasanya berbeda adalah informasi koneksi database. Untuk membedakan masing-masing environment, kita akan membuat tiga file, yaitu:



    
  * jdbc.properties : digunakan di laptop programmer

    
  * jdbc.testing.properties : digunakan di server test

    
  * jdbc.production.properties : digunakan di live



Berikut contoh isi jdbc.properties, yaitu konfigurasi koneksi database di laptop saya :
{% gist 1134126 jdbc.properties %}

Kemudian, ini file jdbc.testing.properties :

{% gist 1134126 jdbc.testing.properties %}

Perhatikan bahwa informasi nama database, username, dan password databasenya berbeda dengan yang ada di konfigurasi laptop.

Terakhir, jdbc.production.properties

{% gist 1134126 jdbc.production.properties %}

Ketiga file konfigurasi ini akan dibaca oleh konfigurasi Spring, yaitu di file applicationContext.xml. Isi lengkap dari file ini adalah sebagai berikut.

{% gist 1134126 applicationContext.xml %}

Untuk lebih spesifik, konfigurasinya ada di baris berikut

{% gist 1134126 context-loading.xml %}

Di sana kita melihat ada variabel ${stage}.
Variabel ${stage} ini akan dicari dari [beberapa tempat, diantaranya environment variabel yang bisa diset di JVM ataupun di sistem operasi](http://static.springsource.org/spring/docs/3.0.x/spring-framework-reference/html/beans.html#beans-factory-xml-import). Cara mengeset variabel ${stage} akan kita bahas sebentar lagi.

Di situ kita menyuruh Spring untuk membaca file jdbc.properties dan jdbc.${stage}.properties. Jika ada nilai variabel yang sama (misalnya jdbc.username), maka nilai variabel di file yang disebutkan belakangan akan menimpa nilai yang didefinisikan file di atasnya.

Contohnya, misalnya variabel ${stage} nilainya adalah testing. Maka Spring akan membaca file jdbc.properties dan jdbc.testing.properties. Karena kedua file memiliki variabel jdbc.url, maka isi jdbc.url di file jdbc.testing.properties akan menimpa nilai jdbc.url di jdbc.properties.

Bila variabel ${stage} tidak ada isinya, Spring akan mencari file yang namanya jdbc.${stage}.properties, dan tidak akan ketemu. Dengan demikian, nilai yang digunakan adalah yang ada di jdbc.properties.

Dengan demikian, behavior aplikasi adalah sebagai berikut



> Bila variabel stage diset production atau testing, maka yang digunakan adalah nilai konfigurasi di jdbc.production.properties atau jdbc.testing.properties. Bila tidak diset atau diset selain itu, maka yang digunakan adalah konfigurasi di jdbc.properties



Behavior seperti inilah yang kita inginkan. Selanjutnya, tinggal kita isi nilai variabel stage.



## Setting Environment Variabel


Variabel stage bisa diset dengan berbagai cara. Bila kita menggunakan [Apache Tomcat](http://tomcat.apache.org), maka kita mengedit file startup.sh atau startup.bat. Modifikasi baris yang berisi CATALINA_OPTS menjadi seperti ini :

{% gist 1134126 startup.sh %}

Atau, kita bisa jalankan dengan Jetty melalui Maven

{% gist 1134126 mvn-jetty-run.sh %}

Bisa juga melalui environment variabel sistem operasi, di Linux kita set seperti ini.

{% gist 1134126 linux-env-var.sh %}




## Konfigurasi Logger


Dengan menggunakan Spring seperti di atas, kita bisa membaca konfigurasi apa saja, misalnya



    
  * Konfigurasi email : bila aplikasi kita mengirim/menerima email

    
  * Konfigurasi server lain : bila aplikasi kita berinteraksi dengan aplikasi orang lain, misalnya webservice atau koneksi socket

    
  * dsb



Walaupun demikian, konfigurasi logger biasanya tidak diload oleh Spring, melainkan langsung dibaca oleh library loggernya.

Kita di ArtiVisi menggunakan SLF4J dan Logback. Cara konfigurasinya mirip dengan Spring. Kita punya satu master file yang akan membaca file lain sesuai isi variabel stage. Untuk itu kita siapkan beberapa file berikut:


    
  * logback.xml : file konfigurasi utama

    
  * logback.production.xml : konfigurasi logger production, akan diinclude oleh logback.xml

    
  * logback.testing.xml : konfigurasi logger testing, akan diinclude oleh logback.xml

    
  * logback.development.xml : konfigurasi logger development, akan diinclude oleh logback.xml




Berikut isi file logback.xml.

{% gist 1134126 logback.xml %}

Seperti kita lihat, file ini berisi konfigurasi yang berlaku umum, seperti appender yang digunakan. Di file ini kita menulis variabel seperti ini

{% gist 1134126 logback-variable.txt %}

Yang artinya adalah, [isi dengan variabel stage, kalau variabel tersebut tidak diset, defaultnya adalah development](http://logback.qos.ch/manual/configuration.html). Ini sesuai dengan keinginan kita seperti pada waktu mengkonfigurasi Spring di atas.

Isi file logback-development.xml dan teman-temannya dapat dilihat [di Github](https://github.com/artivisi/aplikasi-kasbon/tree/master/aplikasi-kasbon-config/src/main/resources).

Demikianlah tutorial cara mengelola konfigurasi untuk keperluan staged deployment. Semoga bermanfaat.

