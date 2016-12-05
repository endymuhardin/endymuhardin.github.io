---
layout: post
title: "Membuat Datasource PostgreSQL di Wildfly"
date: 2016-12-05 07:00
comments: true
categories: 
- java
---

Pada kesempatan ini, kita akan melakukan konfigurasi datasource (koneksi database) ke PostgreSQL dalam application server Wildfly 10.1.0.0.Final.

<!--more-->

Secara garis besar, ada dua hal yang harus dilakukan:

1. Memasang driver JDBC PostgreSQL sebagai modul
2. Membuat datasource atau koneksi database yang bisa digunakan oleh aplikasi.

Pendaftaran driver dilakukan satu kali saja per versi database. Jadi bila kita punya 5 aplikasi yang menggunakan versi database yang sama, kita cukup mendaftarkan driver satu kali saja. 

Tapi pembuatan datasource dilakukan per koneksi database. Bila kita punya 5 database yang digunakan 5 aplikasi berbeda, maka kita harus membuat 5 datasource juga.

## Pendaftaran JDBC Driver ##

Untuk mendaftarkan JDBC Driver, terlebih dulu kita download JDBC drivernya. Driver PostgreSQL yang saya gunakan bisa [diunduh di sini](https://jdbc.postgresql.org/download/postgresql-9.4.1212.jar). Pastikan Anda mengunduh versi terbaru. Hasil unduhan saya letakkan di folder `/tmp`.

Selanjutnya, kita gunakan aplikasi `jboss-cli` yang ada di dalam folder instalasi Wildfly.

```
cd /folder/instalasi/Wildfly
cd bin
./jboss-cli.sh
```

Setelah dijalankan, kita akan mendapatkan prompt

```
You are disconnected at the moment. Type 'connect' to connect to the server or 'help' for the list of supported commands.
[disconnected /] 
```

Ketik `connect` kemudian Enter. Setelah itu lakukan pendaftaran modul baru dengan perintah berikut

```
module add --name=org.postgres --resource=/tmp/postgresql-9.4.1212.jar --dependencies=javax.api,javax.transaction.api
```

Kemudian, jalankan perintah berikut

```
/subsystem=datasources/jdbc-driver=postgres:add(driver-name="postgres",driver-module-name="org.postgres",driver-class-name=org.postgresql.Driver)
```

Bila semua berjalan lancar, outputnya sebagai berikut

```
{"outcome" => "success"}
```

Ketik `\q` untuk keluar dari jboss-cli.

## Pembuatan Datasource ##

Untuk membuat datasource, edit file `/folder/instalasi/wildfly/standalone/configuration/standalone-full.xml`. Tambahkan baris berikut dalam tag `server > profile > subsystem > datasources`

```xml
<datasource jndi-name="java:jboss/datasources/KontakDS" pool-name="KontakDS" enabled="true" use-java-context="true">
    <connection-url>jdbc:postgresql://localhost:5432/kontakdb</connection-url>
    <driver>postgres</driver>
    <pool>
        <min-pool-size>5</min-pool-size>
        <initial-pool-size>5</initial-pool-size>
        <max-pool-size>100</max-pool-size>
        <prefill>true</prefill>
    </pool>
    <security>
        <user-name>kontakapp</user-name>
        <password>1234</password>
    </security>
    <validation>
        <valid-connection-checker class-name="org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLValidConnectionChecker"/>
        <exception-sorter class-name="org.jboss.jca.adapters.jdbc.extensions.postgres.PostgreSQLExceptionSorter"/>
    </validation>
</datasource>
```

Konfigurasi di atas akan membuat datasource dengan nama `KontakDS`. Selanjutnya datasource ini bisa digunakan dalam file `src/main/resources/META-INF/persistence.xml` sebagai berikut

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence version="2.1" xmlns="http://xmlns.jcp.org/xml/ns/persistence" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence http://xmlns.jcp.org/xml/ns/persistence/persistence_2_1.xsd">
  <persistence-unit name="KontakPU" transaction-type="JTA">
    <jta-data-source>java:/jboss/datasources/KontakDS</jta-data-source>
    <exclude-unlisted-classes>false</exclude-unlisted-classes>
    <properties>
      <property name="javax.persistence.schema-generation.database.action" value="create"/>
    </properties>
  </persistence-unit>
</persistence>
```

Demikianlah cara konfigurasi database PostgreSQL di Wildfly agar bisa digunakan dalam aplikasi Java EE. Semoga bermanfaat.
