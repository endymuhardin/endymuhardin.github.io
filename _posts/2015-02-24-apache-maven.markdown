---
layout: post
title: "Apache Maven"
date: 2015-02-24 05:28
comments: true
categories: 
- java
---

Membuat kandang ayam berbeda dengan membuat rumah. Demikian pula membuat rumah berbeda dengan membangun mall. Jumlah pekerja yang terlibat jauh berbeda. Keragaman bahan baku dan peralatannya tidak sama. Kita cuma membutuhkan beberapa papan kayu, paku, dan palu dalam membuat kandang ayam. Tapi tentunya kita tidak bisa menggunakan bahan, alat, dan cara kerja yang sama dalam pembangunan gedung.

Hal yang sama berlaku di pembuatan software. Untuk tugas kuliah, cukup install Netbeans atau Eclipse, kita bisa kerjakan aplikasi sampai selesai. Akan tetapi, untuk membangun aplikasi besar, dibutuhkan persenjataan yang lebih lengkap, diantaranya:

* version control
* build tools
* automated testing
* continuous integration
* issue tracker
* dan lain sebagainya

Dalam artikel ini, kita akan membahas tentang apa itu build tools, mengapa kita gunakan, dan bagaimana cara menggunakannya.

<!--more-->

Pada dasarnya, build tools adalah aplikasi untuk melakukan proses _build_. Salah satu langkah dalam proses _build_ yang paling kita kenal adalah kompilasi source code. Akan tetapi, bahasa pemrograman jaman sekarang tidak cukup hanya dicompile. Kita membutuhkan fitur lain, diantaranya:

* Dependency Management : menyediakan library, framework, tools yang dibuat orang lain
* Compile : mengugbah source code menjadi executable
* Test : menjaankan test secara otomatis
* Run : menjalankan aplikasi
* Package : membuat paket instalasi aplikasi

Konsep build tools ini tidak hanya ada di dunia Java saja. Berikut beberapa aplikasi build tools di berbagai bahasa pemrograman

* Java

  * Ant + Ivy
  * Maven
  * Gradle

* Ruby

  * Rake

* JavaScript

  * Grunt


## Mengapa menggunakan Maven ##

Bila kita bekerja dalam tim, ada banyak hal yang harus kita seragamkan supaya masing-masing orang bisa bekerja dengan baik. Diantaranya adalah:

* struktur folder : Di mana meletakkan source code Java, HTML, CSS, JavaScript. Di mana meletakkan image icon dan logo. 
* penggunaan library : Di mana jar disimpan, bagaimana cara mengenalinya dari kode program kita, bagaimana bila upgrade versi
* workflow : bagaimana menjalankan tes, bagaimana menginisialisasi database

Semua keseragaman di atas harus kita tentukan dan berlakukan di semua project. Bila semua project seragam, maka programmer tidak akan kesulitan pada saat ditugaskan di project manapun, karena bentuk dan aturannya sama. Demikian juga bila sebagai programmer, kita berpindah kantor. Selama kantor baru juga menggunakan aturan yang sama, kita akan bisa cepat beradaptasi.

Dengan Maven, kita tidak perlu lagi membuat aturan kita sendiri. Kita cukup mempelajari dan mengikuti aturan yang sudah dia tetapkan. Selama kita mengikuti aturan Maven, apapun jenis aplikasi yang kita buat (desktop, web, mobile), strukturnya sama.

Maven merupakan tools yang populer dan banyak penggunanya. Dengan demikian, dia didukung oleh semua editor yang beredar di pasaran seperti Netbeans, Eclipse, IDEA, dan lainnya. Didukung di sini artinya mereka bisa mengenali struktur folder dan aturan-aturan dalam Maven.

Ada beberapa aturan dalam Maven yang perlu kita ketahui:

* konfigurasi project
* struktur folder
* cara menjalankan

## Konfigurasi Project ##

Konfigurasi project dalam Maven ditulis dalam file `pom.xml`. 

[![Isi pom.xml](https://lh3.googleusercontent.com/-JRfxohp8O6Y/Uxk_HhHV4sI/AAAAAAAAFZQ/EyqbJHiOaxE/w908-h466-no/02-isi-pom-xml.png)](https://lh3.googleusercontent.com/-JRfxohp8O6Y/Uxk_HhHV4sI/AAAAAAAAFZQ/EyqbJHiOaxE/w908-h466-no/02-isi-pom-xml.png)

Isi `pom.xml`:

* Identifier project

  * groupId : nama organisasi / perusahaan pembuat
  * artifactId : nama modul / project
  * version : versi project

* Contoh identifier library mysql

  * groupId : mysql
  * artifactId : mysql-connector-java
  * version : 5.1.25

* Dependensi project. Pilihan scope dependency:

  * compile : digunakan (diimport) dalam main source dan akan di-include dalam produk akhir. Ini adalah pilihan default, kalau scope dikosongkan, artinya compile
  * runtime : tidak digunakan dalam source code (tidak diimport), tapi disertakan dalam produk akhir. Contoh: library MySQL.
  * test : digunakan (diimport) dalam test source, tapi tidak digunakan di main source. Tidak diinclude dalam produk akhir. Contoh: library JUnit.
  * provided : digunakan (diimport) dalam main source, tapi tidak disertakan dalam produk akhir. Biasanya karena sudah disediakan oleh container tempat aplikasi dijalankan. Contoh: library `javax.servlet`.

Untuk memulai, kita bisa copy paste `pom.xml` minimalis berikut

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.muhardin.endy.belajar</groupId>
  <artifactId>belajar-maven</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>jar</packaging>

  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

</project>
```

Jangan lupa mengganti:

* groupId
* artifactId

sesuai dengan project kita.

## Struktur Folder Project Maven ##

[![Struktur Folder Maven](https://lh6.googleusercontent.com/-wsPV4myilDQ/Uxk77D4MtcI/AAAAAAAAFYg/dQlTHnnx_FQ/w243-h354-no/01-struktur-folder-maven.png)](https://lh6.googleusercontent.com/-wsPV4myilDQ/Uxk77D4MtcI/AAAAAAAAFYg/dQlTHnnx_FQ/w243-h354-no/01-struktur-folder-maven.png)

* `src/main/java` : Tempat meletakkan source code java
* `src/main/resources` : Tempat meletakkan file konfigurasi, icon image, dan lain-lain
* `src/main/webapp` : Khusus aplikasi web, untuk meletakkan file html, img, js, css, dsb
* `target` : file dan folder hasil compile. Folder target ini **jangan** di-commit ke Git repo.

## Menggunakan Maven ##

### Instalasi ###

* Unduh versi terbaru di [http://maven.apache.org](http://maven.apache.org)
* Extract. Untuk Linux biasanya saya taruh di `/opt`. Untuk Windows, saya letakkan di `Program Files`
* Set `M2_HOME` dan `PATH`, caranya bisa dibaca [di sini](http://software.endy.muhardin.com/java/persiapan-coding-java/)

### Cara Pakai Maven ###


* Membuat project baru

```
mvn archetype:generate -DgroupId=belajar -DartifactId=belajar-maven -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```


* Menambahkan dependensi. Tambahkan blok dependensi di `pom.xml` dalam tag `<dependencies>`

```xml
<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.9</version>
  <scope>test</scope>
</dependency>
```
* Dependensi akan diunduh dari internet (repo.maven.org) dan diletakkan di folder `.m2` dalam home user.

* Compile. Jalankan `mvn clean install`

```
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building belajar-maven 1.0.0
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ belajar-maven ---
[INFO] Deleting /home/endy/tmp/belajar-maven/target
[INFO] 
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ belajar-maven ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /home/endy/tmp/belajar-maven/src/main/resources
[INFO] 
[INFO] --- maven-compiler-plugin:2.5.1:compile (default-compile) @ belajar-maven ---
[INFO] Compiling 1 source file to /home/endy/tmp/belajar-maven/target/classes
[INFO] 
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ belajar-maven ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory /home/endy/tmp/belajar-maven/src/test/resources
[INFO] 
[INFO] --- maven-compiler-plugin:2.5.1:testCompile (default-testCompile) @ belajar-maven ---
[INFO] Compiling 1 source file to /home/endy/tmp/belajar-maven/target/test-classes
[INFO] 
[INFO] --- maven-surefire-plugin:2.12.4:test (default-test) @ belajar-maven ---
[INFO] Surefire report directory: /home/endy/tmp/belajar-maven/target/surefire-reports

-------------------------------------------------------
 T E S T S
-------------------------------------------------------
Running belajar.AppTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.037 sec

Results :

Tests run: 1, Failures: 0, Errors: 0, Skipped: 0

[INFO] 
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ belajar-maven ---
[INFO] Building jar: /home/endy/tmp/belajar-maven/target/belajar-maven-1.0.0.jar
[INFO] 
[INFO] --- maven-install-plugin:2.4:install (default-install) @ belajar-maven ---
[INFO] Installing /home/endy/tmp/belajar-maven/target/belajar-maven-1.0.0.jar to /home/endy/.m2/repository/belajar/belajar-maven/1.0.0/belajar-maven-1.0.0.jar
[INFO] Installing /home/endy/tmp/belajar-maven/pom.xml to /home/endy/.m2/repository/belajar/belajar-maven/1.0.0/belajar-maven-1.0.0.pom
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2.501s
[INFO] Finished at: Fri Mar 07 10:40:38 WIB 2014
[INFO] Final Memory: 14M/150M
[INFO] ------------------------------------------------------------------------
```

* Run. Jalankan `mvn exec:java -Dexec.mainClass=belajar.App`

```
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building belajar-maven 1.0.0
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] >>> exec-maven-plugin:1.2.1:java (default-cli) @ belajar-maven >>>
[INFO] 
[INFO] <<< exec-maven-plugin:1.2.1:java (default-cli) @ belajar-maven <<<
[INFO] 
[INFO] --- exec-maven-plugin:1.2.1:java (default-cli) @ belajar-maven ---
Hello World!
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 0.917s
[INFO] Finished at: Fri Mar 07 10:39:50 WIB 2014
[INFO] Final Memory: 8M/150M
[INFO] ------------------------------------------------------------------------
```

## Konfigurasi Tambahan ##

Adakalanya kita membutuhkan setting tambahan untuk menyesuaikan penggunaan Maven, misalnya bila kita ada di belakang proxy ataupun ingin memindahkan lokasi download ke tempat lain. Untuk melakukan konfigurasi, buat file `settings.xml` di dalam folder `.m2`.

### Proxy ###

Berikut isi filenya bila kita menjalankan Maven di belakang proxy.

```xml
<settings>
  <proxies>
    <proxy>
      <protocol>http</protocol>
      <host>proxy.host.net</host>
      <port>80</port>
      <nonProxyHosts>local.net|some.host.com</nonProxyHosts>
      <username>proxyuser</username>
      <password>proxypass</password>
    </proxy>
  </proxies>
</settings>
```

### Lokasi Download Folder ###

Setting ini saya gunakan karena komputer saya menggunakan harddisk SSD yang berkapasitas kecil, sehingga lokasi downloadnya perlu dipindah ke external harddisk.

```xml
<settings>
    <localRepository>/Volumes/SDUF128G/m2/repository</localRepository>
</settings>
```

## Penutup ##

Demikianlah sekilas penggunaan Maven. Untuk lebih lengkapnya, kita bisa baca [buku referensi Maven](http://books.sonatype.com/mvnref-book/reference/) yang sudah disediakan gratis oleh Sonatype. Anda juga bisa tonton video Youtube saya yang membahas lebih lanjut tentang Apache Maven ini

<iframe width="560" height="315" src="https://www.youtube.com/embed/_BahIP7XYfk" frameborder="0" allowfullscreen></iframe>

