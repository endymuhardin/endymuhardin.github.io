---
comments: true
date: 2012-07-30 13:59:00
layout: post
slug: konsep-dasar-log4
title: Konsep Dasar Log4j
categories:
- java
---

Walaupun sudah dibuatkan [minibook](http://endy.artivisi.com/blog/java/menggunakan-log4j), tapi ternyata ada juga beberapa orang yang tidak paham bagaimana cara enable/disable log message di aplikasi Java. Oleh karena itu, baiklah saya jelaskan lagi secara lebih singkat.

<!--more-->

Ada beberapa komponen penting dalam aplikasi logging : 




  * logger : ini adalah yang kita gunakan di aplikasi untuk mengeluarkan pesan.
  tadinya System.out.println("Coba");
  diganti menjadi logger.info("Coba");



  * appender : komponen yang bertugas menampilkan log message
  misalnya : console appender : menampilkan ke System.out
  File appender : menulis log ke file
  Rolling file appender : menulis ke file, lalu dirolling berdasarkan kriteria tertentu (size atau time)
  misalnya, setelah mencapai 1 MB, tulis ke file berbeda, atau tiap 1 jam ganti file



  * category : ini adalah sumber log message, yaitu package atau realm. 
  **biasanya** category == package
  Ini digunakan untuk memfilter log mana yang akan ditampilkan ke appender mana




Selain 3 komponen itu, ada terminologi yang namanya level. 
Contoh level : error, warn, info, debug, trace
Level ini berlaku bertingkat, jadi kalau kita bilang info, artinya info, warn, error. 
Kalau kita bilang debug, maka hasilnya debug, info, warn, error.

Log message ditampilkan atau tidak, tergantung category dan level. 

Contoh kasus : 
Saya membuat aplikasi, berisi package com.artivisi.belajar.logging. 
Isinya ada 2 class, Coba dan Halo.

Aplikasi saya ini menggunakan framework Spring, yang mana berisi package org.springframework, yang berisi banyak sub package, seperti org.springframework.core, org.springframework.jdbc, dsb. 

Untuk source code yang saya tulis sendiri (Coba dan Halo), saya ingin menampilkan level debug, karena masih fase development. Nantinya kalau sudah production, cukup level warn saja yang ditampilkan. 
Sedangkan untuk library Spring Framework, cukup level error saja yang ditampilkan.

Semua log message ditampilkan ke terminal, supaya mudah diamati. 

Contoh kasus di atas, bila kita menggunakan log4j akan dikonfigurasi sebagai berikut : 

```
# by default, levelnya adalah INFO, tampilkan ke System.out
log4j.rootLogger=INFO,Konsole 

# untuk package com.artivisi, tampilkan level DEBUG ke System.out
log4j.logger.com.artivisi=DEBUG,Konsole

# untuk spring, error saja yang ditampilkan
log4j.logger.org.springframework=ERROR,Konsole

# Appender Konsole adalah System.out
log4j.appender.Konsole=org.apache.log4j.ConsoleAppender 
log4j.appender.Konsole.layout=org.apache.log4j.PatternLayout 
# Format tanggal menurut ISO­8601 : %d 
log4j.appender.Konsole.layout.ConversionPattern=%d [%t] %­5p %c ­ %m%n
```

Konfigurasi di atas harus dibuat dengan nama log4j.properties, dan diletakkan di dalam classpath. Kalau namanya tidak sama atau lokasinya salah, maka tidak akan dibaca oleh Log4J.
