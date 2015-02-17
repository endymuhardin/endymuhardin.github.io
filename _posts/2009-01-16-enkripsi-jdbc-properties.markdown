---
comments: true
date: 2009-01-16 15:24:04
layout: post
slug: enkripsi-jdbc-properties
title: Enkripsi JDBC Properties
wordpress_id: 402
categories:
- java
---


Bila kita membuat aplikasi Java yang menggunakan database, pasti kita akan membuat satu file untuk konfigurasi koneksi database, biasanya diberi nama jdbc.properties. Isinya kira-kira sebagai berikut: 

```
jdbc.driver = com.mysql.jdbc.Driver
jdbc.url = jdbc:mysql://localhost/belajar
jdbc.username = belajar
jdbc.password = java
```

Cepat atau lambat, kita akan menemui kebutuhan untuk menyembunyikan nilai yang diisikan ke dalam file tersebut untuk alasan keamanan. Tentunya kita tidak ingin orang yang bisa membaca file tersebut login ke database dan melihat berbagai data rahasia dalam database. 

Kita ingin mengenkripsi minimal variabel `jdbc.password`, supaya tidak bisa dibaca sembarang orang. Bila kita menggunakan Spring Framework untuk membaca file tersebut, kita bisa menggunakan [Jasypt](http://www.jasypt.org/) yang mampu menangani masalah enkripsi file tersebut. 

<!--more-->

Bila kita menggunakan Maven, tambahkan dependensi Jasypt sebagai berikut

```xml
<dependency>
	<groupId>org.jasypt</groupId>
	<artifactId>jasypt-spring31</artifactId>
	<version>1.9.0</version>
</dependency>
```
Sesuaikan versinya dengan yang terbaru.

Biasanya, kita membaca file `jdbc.properties` di dalam konfigurasi Spring, seperti ini. 

```xml
<context:property-placeholder location="classpath:jdbc.properties"/>
```

Kemudian menggunakannya dalam konfigurasi dataSource seperti ini. 

```xml
<bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
	<property name="driverClassName" value="${jdbc.driver}"></property>
	<property name="url" value="${jdbc.url}"></property>
	<property name="username" value="${jdbc.username}"></property>
	<property name="password" value="${jdbc.password}"></property>
</bean>
```

Dengan menggunakan Jasypt, kita dapat mengenkripsi jdbc.properties sehingga menjadi seperti ini. 

```
jdbc.driver = com.mysql.jdbc.Driver
jdbc.url = jdbc:mysql://localhost/belajar
jdbc.username = belajar
jdbc.password = ENC(fSz7P5zYRnhsonKoKvxNmw==)
```

Agar variabel `jdbc.password` bisa dibaca dengan baik, kita ganti `PropertyPlaceholderConfigurer` dengan miliknya Jasypt, sehingga konfigurasi Spring kita menjadi seperti ini. 

```xml
<jasypt:encryptor-config 
    id="encryptorConfig" 
    password="test123" 
    algorithm="PBEWithMD5AndTripleDES"/> 

<jasypt:string-encryptor 
    id="stringEncryptor"
    config-bean="encryptorConfig"/>
    
<jasypt:encryptable-property-placeholder 
    encryptor="stringEncryptor" 
    location="classpath:jdbc.properties"/>
```

Cukup itu saja perubahannya. Konfigurasi `dataSource` di atas tidak perlu diubah.

Bagaimana cara kita mengetahui bahwa hasil enkripsi dari `java` adalah `fSz7P5zYRnhsonKoKvxNmw==` ?? 
Gampang, buat saja kode Java sederhana seperti ini. Bisa dibuat dalam method `public static void main(String[] xx)` ataupun dalam JUnit test.

```java
StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
encryptor.setPassword("test123");
encryptor.setAlgorithm("PBEWithMD5AndTripleDES");
String encryptedText = encryptor.encrypt("java");
System.out.println("Encrypted Password : ["+encryptedText+"]");

String decrypted = encryptor.decrypt(encryptedText);
System.out.println("Decrypted Password : ["+decrypted+"]");
```

Bila dijalankan, kode program di atas akan menghasilkan output seperti ini

```
Encrypted Password : [fSz7P5zYRnhsonKoKvxNmw==]
Decrypted Password : [java]
```

Nilai itulah yang kita copy-paste ke dalam `jdbc.properties`.

Pembaca yang teliti belum puas dengan penjelasan ini, biasanya bertanya


> Lalu kalau passwordnya tetap kita tulis di file konfigurasi apa manfaatnya?
> Orang yang membaca file tersebut tinggal menjalankan Jasypt seperti contoh kode di atas, dan dia akan mendapatkan password yang sebenarnya.


Nah, benar juga.

Untungnya, Jasypt sudah menyediakan fitur lain. Kita bisa menyediakan password melalui environment variable.
Ubah konfigurasi di atas menjadi seperti ini

```xml
<encryption:encryptor-config 
    id="encryptorConfig" 
    password-env-name="PASSWORD_APLIKASI" 
    algorithm="PBEWithMD5AndTripleDES"/> 
    
<jasypt:string-encryptor 
    id="stringEncryptor" 
    config-bean="encryptorConfig"/>
    
<jasypt:encryptable-property-placeholder 
    encryptor="stringEncryptor" 
    location="classpath:jdbc.properties"/>
```

Dengan konfigurasi di atas, password encryptor (`test123` pada contoh sebelumnya) tidak lagi ditulis di file konfigurasi.
Jasypt akan mencari environment variable bernama `PASSWORD_APLIKASI`. Jadi, langkah-langkah menjalankan aplikasinya adalah sebagai berikut:

1. Set environment variabel. Di Linux perintahnya `export PASSWORD_APLIKASI=test123`. Di Windows `set PASSWORD_APLIKASI=test123`.
2. Jalankan aplikasi di command prompt yang sama
3. Supaya aman, hapus lagi environment variable. Di Linux perintahnya `unset PASSWORD_APLIKASI`. Di Windows, cukup diset dengan nilai kosong saja `set PASSWORD_APLIKASI=""`.

