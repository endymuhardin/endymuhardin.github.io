---
layout: post
title: "Mendeploy Aplikasi dari Jenkins ke Pivotal Web Service"
date: 2017-01-25 07:00
comments: true
categories:
- java
---

Setelah [Jenkins berhasil melakukan proses build tiap kali ada push](http://software.endy.muhardin.com/java/jenkins-gitlab/), selanjutnya kita ingin meneruskan proses deployment apabila proses build berjalan sukses.

Deployment kali ini akan kita lakukan ke layanan cloud milik Pivotal, yaitu [Pivotal Web Service](https://run.pivotal.io). Saya lebih suka deploy ke layanan PaaS dimana environment sudah tersedia siap pakai dibandingkan dengan IaaS dimana kita harus setup sendiri Java, Maven, MySQL, dan aplikasi pendukung lainnya. Dengan demikian, kita bisa berfokus pada penulisan source code, tidak perlu pusing memikirkan infrastruktur. Ini terutama sangat memudahkan bagi tim/perusahaan dengan resource terbatas (baca: tidak mampu menggaji sysadmin ;p)

Pada saat artikel ini ditulis, harga Pivotal paling murah dibanding layanan PaaS lain seperti Heroku. Oleh karena itu, kita akan melakukan deployment ke Pivotal.

Ada beberapa langkah dalam menyambungkan Jenkins ke Pivotal :

1. Memasukkan credentials (username/password) Pivotal ke Jenkins.
2. Menambahkan post-build action di Jenkins untuk mendeploy aplikasi apabila proses build berjalan sukses.
3. Membuat file konfigurasi Pivotal Cloud Foundry, yaitu `manifest.yml` dalam project kita.
4. Menambahkan konfigurator otomatis untuk koneksi database di Pivotal.
4. Lakukan `git push` untuk menjalankan Jenkins dan deployment.

<!--more-->

Sebelum kita mulai mengkonfigurasi, pastikan dulu di Jenkins telah terinstal plugin Cloud Foundry.

![Plugin Cloud Foundry]({{site.url}}/images/uploads/2017/jenkins-cloudfoundry/cloud-foundry-plugin.png)

## Pivotal Credentials ##

Agar Jenkins bisa melakukan deployment, tentu dia butuh login dulu ke Pivotal. Untuk itu, masuk ke halaman Credentials, lalu masukkan username dan password Pivotal Web Services.

![PWS Credentials]({{site.url}}/images/uploads/2017/jenkins-cloudfoundry/pws-credentials.png)

## Post Build Action ##

Berikutnya, masuk ke konfigurasi project, kemudian scroll ke bagian Post Build Action. Isikan konfigurasinya seperti pada screenshot berikut

![Konfigurasi Post Build]({{site.url}}/images/uploads/2017/jenkins-cloudfoundry/post-build-action.png)

Pilih `Credentials` yang sudah kita masukkan pada tahap sebelumnya. Isi kolom `Organization` dan `Space` sesuai akun kita di Pivotal. Centang `reset app` supaya tiap deployment menghapus dulu deployment sebelumnya.

Aplikasi saya ini membutuhkan database. Untuk itu kita perlu membuatkan servicenya dulu. Masukkan nama instance database yang akan digunakan di aplikasi, yaitu `belajar-ci-db`. Pilih juga jenis servicenya, yaitu `cleardb` yang menyediakan database MySQL. Saya gunakan plan `Spark` yang gratisan. Centang juga `reset service` agar databasenya didrop dan dicreate ulang setiap kali deploy.

Kemudian terakhir, suruh Jenkins untuk membaca file konfigurasi `manifest.yml` yang ada dalam project folder.

## Membuat Konfigurasi Deployment ##

Konfigurasi deployment Pivotal Cloud Foundry biasanya diberi nama `manifest.yml`. Ini mirip dengan file `Procfile` di Heroku, yaitu menjelaskan tentang aplikasi yang akan dideploy. Berikut isi filenya

```yml
---
applications:
- name: belajar-ci
  path: target/belajar-ci-0.0.1-SNAPSHOT.jar
  services:
  - belajar-ci-db
```

Artinya sebagai berikut:

* aplikasi kita akan diberi nama `belajar-ci`
* file yang akan dideploy adalah `target/belajar-ci-0.0.1-SNAPSHOT.jar`
* aplikasi ini akan menggunakan service `belajar-ci-db`. Service ini dibuatkan oleh Jenkins seperti kita konfigurasi pada langkah sebelumnya.

## Konfigurator Koneksi Database ##

Database yang dibuatkan oleh Pivotal biasanya akan memiliki nama database, username, dan password yang acak. Setiap kali dibuat ulang, nilainya berbeda. Oleh karena itu, kita tidak bisa menulis nilainya dalam `application.properties` seperti ini

```
spring.datasource.url=jdbc:mysql://localhost/belajar
spring.datasource.username=belajar
spring.datasource.password=java
```

Untuk mengatasi masalah tersebut, para programmer Spring Cloud telah membuatkan library bantuan yang dapat mendeteksi nama variabel tersebut dan memasangnya di aplikasi kita. Cukup tambahkan saja librarynya di `pom.xml` sebagai berikut

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cloud-connectors</artifactId>
</dependency>
```

## Test Deployment ##

Selesai sudah konfigurasinya. Sekarang kita bisa commit dan push. Source code akan masuk ke Gitlab, mentrigger Jenkins untuk build, kemudian melakukan deployment setelah build sukses.

Kita bisa monitor hasilnya di `Console Output` Jenkins.

![Deployment Log]({{site.url}}/images/uploads/2017/jenkins-cloudfoundry/deployment-log.png)

Setelah sukses, kita bisa coba browse ke `https://belajar-ci.cfapps.io` untuk melihat hasilnya

![Deploy No Data]({{site.url}}/images/uploads/2017/jenkins-cloudfoundry/deploy-no-data.png)

Wah tidak ada datanya, jadi kita tidak bisa mengecek apakah databasenya terbentuk atau tidak. Coba kita masukkan data melalui perintah SQL.

## Mengakses Database Pivotal ##

Agar bisa menjalankan SQL untuk insert, kita perlu mengakses database di Pivotal. Kita perlu tahu dulu parameter koneksinya, yaitu:

* host dan port servernya
* nama database
* username
* password

Caranya, kita harus membuat `service-key`, kemudian membaca isinya. Jalankan perintah berikut untuk membuat `service-key`.

```
cf create-service-key belajar-ci-db info-koneksi
```

Berikut outputnya

```
Creating service key info-koneksi for service instance belajar-ci-db as endy.muhardin@gmail.com...
OK
```

Selanjutnya, kita tampilkan isi `service-key`

```
cf service-key belajar-ci-db info-koneksi
```

Berikut outputnya

```
Getting key info-koneksi for service instance belajar-ci-db as endy.muhardin@gmail.com...

{
 "hostname": "us-cdbr-iron-east-04.cleardb.net",
 "jdbcUrl": "jdbc:mysql://us-cdbr-iron-east-04.cleardb.net/ad_7778cd39cfcc524?user=b2d044382b2df8\u0026password=c98433d3",
 "name": "ad_7778cd39cfcc524",
 "password": "c98433d3",
 "port": "3306",
 "uri": "mysql://b2d044382b2df8:c98433d3@us-cdbr-iron-east-04.cleardb.net:3306/ad_7778cd39cfcc524?reconnect=true",
 "username": "b2d044382b2df8"
}
```

Nah, sekarang kita bisa connect ke database

```
mysql -u b2d044382b2df8 -h us-cdbr-iron-east-04.cleardb.net -p ad_7778cd39cfcc524
Enter password:
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A


Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 221029017
Server version: 5.5.46-log MySQL Community Server (GPL)

Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

Jalankan perintah SQL untuk mengisi data

```sql
insert into product (id, code, name, price)
values ('p001', 'P-001', 'Product 001', 101001.01);
```

Refresh browser untuk melihat apakah datanya bisa dibaca

![Deploy With Data]({{site.url}}/images/uploads/2017/jenkins-cloudfoundry/deploy-with-data.png)

Voila, ternyata aplikasi kita sudah berjalan dengan baik.

Agar di kemudian hari kita bisa langsung melihat data, ada baiknya kita tulis perintah insert tadi ke migration script FlywayDb.

## Penutup ##

Demikianlah rangkaian serial setup Continuous Delivery dengan Gitlab, Jenkins, dan Pivotal Cloud Foundry. Dengan otomasi workflow ini, para programmer bisa berkonsentrasi menulis source code dan tidak dipusingkan dengan proses deployment setiap waktu.

## Referensi ##

* [http://www.haydonryan.com/using-jenkins-to-build-a-hello-world-spring-boot-app-and-push-to-cloud-foundry/](http://www.haydonryan.com/using-jenkins-to-build-a-hello-world-spring-boot-app-and-push-to-cloud-foundry/)
* [https://docs.run.pivotal.io/devguide/deploy-apps/ssh-services.html](https://docs.run.pivotal.io/devguide/deploy-apps/ssh-services.html)
