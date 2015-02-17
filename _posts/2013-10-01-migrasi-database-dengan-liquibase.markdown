---
layout: post
title: "Migrasi Database dengan Liquibase"
date: 2013-10-01 21:22
comments: true
categories: 
- java
---

Salah satu kepuasan kita sebagai programmer adalah pada waktu aplikasi yang kita buat digunakan banyak user dan menghasilkan banyak manfaat bagi mereka. Sebagai konsekuensinya, akan banyak permintaan tambahan dari user untuk menambah fitur ataupun mengubah fitur yang sudah ada supaya makin nyaman digunakan.

Seringkali terjadi, perubahan yang diminta ini akan menyebabkan berubahnya skema database. Ini merupakan hal yang wajar dan umum terjadi, sehingga kita perlu menyiapkan mental untuk menerima kondisi ini sebagai sesuatu yang lumrah dan tidak mengerikan.

Tools yang sering saya gunakan untuk mengurus perubahan (evolusi) skema database adalah [Liquibase](http://www.liquibase.org). Pada [artikel terdahulu](http://software.endy.muhardin.com/java/membuat-changelog-liquibase/), kita sudah membahas cara menggunakan Liquibase untuk mengkonversi skema database menjadi XML supaya bisa dikelola di version control. Kali ini, kita akan menggunakan Liquibase untuk melakukan migrasi dari skema database antar versi aplikasi.

<!--more-->

Studi kasusnya sebagai berikut. Misalnya kita punya aplikasi versi `1.0` yang sudah berjalan di production (live) dan digunakan user. Aplikasi versi `1.0` ini kita kembangkan selama beberapa minggu --diberikan tambahan fitur, bug diperbaiki, tampilan diperindah, dan berbagai peningkatan lainnya-- menjadi versi `2.0`. Antar kedua versi ini terjadi perubahan skema database. Kita ingin membuat script SQL untuk mengkonversi (migrasi) skema database versi `1.0` menjadi skema versi `2.0`. Untuk keperluan itu, kita gunakan Liquibase. 

Liquibase memiliki kemampuan untuk membandingkan (diff) dua database, kemudian membuatkan file untuk migrasi dari skema yang satu (versi `1.0`) menjadi skema lainnya (versi `2.0`).

## Menyiapkan kedua database ##

Langkah pertama adalah menyiapkan kedua versi database. Biasanya saya membuat dump dari database production (skema versi `1.0`), kemudian di-restore di tempat lain (misalnya di laptop). Kemudian saya juga menyiapkan database development yang menggunakan skema versi `2.0`. 

Agar lebih jelas, kita namakan saja database yang diambil dari production dengan nama `aplikasi_v_1_0` dan database baru dengan nama `aplikasi_v_2_0`. Berikut adalah informasi koneksi JDBC untuk kedua database

### aplikasi_v_1_0 ###

* jdbc.driver = `com.mysql.jdbc.Driver`
* jdbc.url = `jdbc:mysql://localhost/aplikasi_v_1_0`
* jdbc.username = `root`
* jdbc.password = `coba`

### aplikasi_v_2_0 ###

* jdbc.driver = `com.mysql.jdbc.Driver`
* jdbc.url = `jdbc:mysql://localhost/aplikasi_v_2_0`
* jdbc.username = `root`
* jdbc.password = `coba`


## Konfigurasi Liquibase ##

Seperti di artikel terdahulu, kita membutuhkan tiga file yang kita letakkan di folder yang sama, yaitu: 

* `mysql-connector-java-5.1.25.jar` : driver database
* `liquibase-core-2.0.5.jar` : aplikasi liquibase
* `liquibase.properties` : konfigurasi liquibase

Sesuaikan kedua file jar dengan versi yang terbaru.

File `liquibase.properties` berisi konfigurasi yang dibutuhkan oleh liquibase. Berikut isinya

```
driver: com.mysql.jdbc.Driver
classpath: mysql-connector-java-5.1.25.jar
url: jdbc:mysql://localhost/aplikasi_v_2_0
username: root
password: admin
referenceUrl: jdbc:mysql://localhost/aplikasi_v_1_0
referenceUsername: root
referencePassword: admin
changeLogFile: changelog.xml
```

Berikut penjelasan dari isi file:

* driver: JDBC driver sesuai merek database yang kita gunakan
* classpath: lokasi file JDBC driver
* url: JDBC url untuk database tujuan (versi `2.0`)
* username: username untuk database tujuan (versi `2.0`)
* password: password untuk database tujuan (versi `2.0`)
* referenceUrl: JDBC url untuk database asal (versi `1.0`)
* referenceUsername: username untuk database asal (versi `1.0`)
* referencePassword: password untuk database asal (versi `1.0`)
* changeLogFile: nama file tujuan untuk menulis hasil perbandingan kedua database

## Menjalankan Liquibase : Membuat file changelog ##

Pertama, kita buat dulu file changelog sesuai format Liquibase. Commandnya adalah sebagai berikut:

```
java -jar liquibase-core-2.0.5.jar diffChangeLog
```

Berikut output dari perintah di atas

```
INFO 10/1/13 9:11 PM:liquibase: Reading tables for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading views for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading foreign keys for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading primary keys for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading columns for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading unique constraints for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading indexes for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Sequences not supported for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_1_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading tables for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading views for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading foreign keys for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading primary keys for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading columns for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading unique constraints for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: Reading indexes for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: Sequences not supported for
 root@localhost @ jdbc:mysql://localhost/aplikasi_v_2_0 ...
INFO 10/1/13 9:11 PM:liquibase: changelog.xml does not exist, creating
Liquibase 'diffChangeLog' Successful
```

Perintah ini akan menghasilkan file `changelog.xml` di folder tempat kita berada. File ini berisi perbedaan antar skema versi 1.0 dengan skema versi 2.0. Isinya seperti ini

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-2.0.xsd">
    <changeSet author="endy (generated)" id="1380636706862-1">
        <addColumn tableName="m_customer">
            <column name="allowed_addresses" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
        </addColumn>
    </changeSet>
    <changeSet author="endy (generated)" id="1380636706862-2">
        <addColumn tableName="m_customer">
            <column name="deleted" type="BIT">
                <constraints nullable="false"/>
            </column>
        </addColumn>
    </changeSet>
    <changeSet author="endy (generated)" id="1380636706862-3">
        <addColumn tableName="m_plan">
            <column name="deleted" type="BIT">
                <constraints nullable="false"/>
            </column>
        </addColumn>
    </changeSet>
    <changeSet author="endy (generated)" id="1380636706862-4">
        <addColumn tableName="m_provider">
            <column name="deleted" type="BIT">
                <constraints nullable="false"/>
            </column>
        </addColumn>
    </changeSet>
    <changeSet author="endy (generated)" id="1380636706862-5">
        <addColumn tableName="m_rate">
            <column name="deleted" type="BIT">
                <constraints nullable="false"/>
            </column>
        </addColumn>
    </changeSet>
    <changeSet author="endy (generated)" id="1380636706862-6">
        <addColumn tableName="m_routing">
            <column name="deleted" type="BIT">
                <constraints nullable="false"/>
            </column>
        </addColumn>
    </changeSet>
    <changeSet author="endy (generated)" id="1380636706862-7">
        <dropNotNullConstraint columnDataType="VARCHAR(255)" columnName="bind_password" tableName="m_provider"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1380636706862-8">
        <dropNotNullConstraint columnDataType="VARCHAR(255)" columnName="bind_username" tableName="m_provider"/>
    </changeSet>
</databaseChangeLog>
```

Kita lihat di atas bahwa antara skema versi `1.0` dan versi `2.0` terjadi perubahan sebagai berikut:

* penambahan kolom `allowed_address` di tabel `m_customer`
* penambahan kolom `deleted` di berbagai tabel lainnya
* menghilangkan constraint `NOT NULL` di kolom `bind_username` dan `bind_password`

Kita bisa periksa file ini dan sesuaikan bila ada yang kurang tepat.

## Menjalankan Liquibase : Membuat script SQL ##

File XML saja tentunya tidak bermanfaat banyak buat kita. Untuk bisa dieksekusi di database production, kita memerlukan script SQL. Untungnya Liquibase punya fitur untuk membuat script SQL. Berikut perintahnya

```
java -jar liquibase-core-2.0.5.jar updateSQL
```

Outputnya adalah sebagai berikut

```sql
--  *********************************************************************
--  Update Database Script
--  *********************************************************************
--  Change Log: changelog.xml
--  Ran at: 10/1/13 9:18 PM
--  Against: root@localhost@jdbc:mysql://localhost/aplikasi_v_2_0
--  Liquibase version: 2.0.5
--  *********************************************************************

--  Lock Database
--  Changeset changelog.xml::1380636706862-1::endy (generated)::(Checksum: 3:87288bc453555824cb2e28ddafed9557)
ALTER TABLE `m_customer` ADD `allowed_addresses` VARCHAR(255) NOT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Add Column', 'EXECUTED', 'changelog.xml', '1380636706862-1', '2.0.5', '3:87288bc453555824cb2e28ddafed9557', 5);

--  Changeset changelog.xml::1380636706862-2::endy (generated)::(Checksum: 3:27e1f8b069e4471400f3deff5034bca9)
ALTER TABLE `m_customer` ADD `deleted` BIT NOT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Add Column', 'EXECUTED', 'changelog.xml', '1380636706862-2', '2.0.5', '3:27e1f8b069e4471400f3deff5034bca9', 6);

--  Changeset changelog.xml::1380636706862-3::endy (generated)::(Checksum: 3:14c13dec957537886d6035b32fd4c90c)
ALTER TABLE `m_plan` ADD `deleted` BIT NOT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Add Column', 'EXECUTED', 'changelog.xml', '1380636706862-3', '2.0.5', '3:14c13dec957537886d6035b32fd4c90c', 7);

--  Changeset changelog.xml::1380636706862-4::endy (generated)::(Checksum: 3:b54952b6be5eb80caf649dc75f974f65)
ALTER TABLE `m_provider` ADD `deleted` BIT NOT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Add Column', 'EXECUTED', 'changelog.xml', '1380636706862-4', '2.0.5', '3:b54952b6be5eb80caf649dc75f974f65', 8);

--  Changeset changelog.xml::1380636706862-5::endy (generated)::(Checksum: 3:6b840975b06488faa9ec0ed1d3e8d123)
ALTER TABLE `m_rate` ADD `deleted` BIT NOT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Add Column', 'EXECUTED', 'changelog.xml', '1380636706862-5', '2.0.5', '3:6b840975b06488faa9ec0ed1d3e8d123', 9);

--  Changeset changelog.xml::1380636706862-6::endy (generated)::(Checksum: 3:909c459661aacc260b40971e4215a481)
ALTER TABLE `m_routing` ADD `deleted` BIT NOT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Add Column', 'EXECUTED', 'changelog.xml', '1380636706862-6', '2.0.5', '3:909c459661aacc260b40971e4215a481', 10);

--  Changeset changelog.xml::1380636706862-7::endy (generated)::(Checksum: 3:ac26c24529898f4c1c2133225d3d5ee8)
ALTER TABLE `m_provider` MODIFY `bind_password` VARCHAR(255) NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog.xml', '1380636706862-7', '2.0.5', '3:ac26c24529898f4c1c2133225d3d5ee8', 11);

--  Changeset changelog.xml::1380636706862-8::endy (generated)::(Checksum: 3:968da08768e83eaaa863f0a3cafc204e)
ALTER TABLE `m_provider` MODIFY `bind_username` VARCHAR(255) NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('endy (generated)', '', NOW(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog.xml', '1380636706862-8', '2.0.5', '3:968da08768e83eaaa863f0a3cafc204e', 12);

--  Release Database Lock
```

Output tersebut bisa kita periksa dulu kebenarannya, kemudian kita edit bila perlu, lalu tinggal dijalankan di skema database versi `1.0` ... voila ... dia akan berubah menjadi database dengan skema versi `2.0`.

Demikianlah cara mudah untuk melakukan migrasi. Jangan lupa simpan isi file `changelog.xml` ke dalam version control supaya segala perubahan terhadap skema database tercatat riwayatnya. 
