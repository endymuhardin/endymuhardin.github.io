---
comments: true
date: 2008-03-27 11:41:19
layout: post
slug: road-to-java-ee
title: Road to Java EE
wordpress_id: 331
categories:
- java
---

Another Frequently Asked Question.


> Saya sudah menguasai Java Standard Edition dan sekarang mau belajar Java Enterprise Edition. Bagaimana learning-path-nya?


Inilah Road to Java Enterprise versi saya:



### Tahap Pertama


1. Belajar HTTP.
- bedanya GET dan POST
- apa itu session
- bagaimana cara implement state management
- konsep multipart dan mekanisme upload file

2. Belajar Servlet Fundamental.
- Servlet
- Filter
- Listener
- Tidak perlu repot2 belajar JSP

3. Belajar JDBC.
Pastikan Anda tau:
- Cara connect ke database
- Cara eksekusi DML
- Cara menjalankan SQL select

4. Belajar Database Transaction Fundamental.
Pastikan Anda tau:
- Syarat-syarat untuk mengaktifkan transaction
- Local vs Managed Transaction
- Programmatic vs Declarative Transaction
- Transaction Isolation Level
- Transaction Propagation

Untuk tahap pertama, itu dulu saja.

Kalau sudah ngerti itu, bisa dengan mudah memahami:

- Web framework apapun (Spring MVC, Struts 1 dan 2, Java Server Faces)
- Database abstraction framework seperti Spring JDBC, iBatis, dan Hibernate.



### Tahap Kedua


Tahap kedua ini relatif rumit. Karena itu, untuk tiap materi, pastikan:
- Anda tau masalah yang mendasari munculnya teknologi ini.
- Anda tau cara memecahkan masalah tersebut dengan teknologi ybs.
- Anda tau keterbatasan dari teknologi ybs.
- Anda tau alternatif solusi selain menggunakan teknologi ybs


1. Remote Method Invocation
- Mekanisme remote invocation
- Mekanisme rmiregistry
- Cara membuat remote object
- Cara mempublish remote object
- Cara membuat client yang mengakses remote object

2. Java Messaging Service (JMS)
- Arsitektur Messaging
- Point to Point vs Publisher - Subscriber
- Bedanya Durable dan Non-Durable Subscriber
- Cara mengirim message
- Cara menerima message

3. Enterprise Java Bean
- Stateless Session Beans
- Stateful Session Beans
- Message Driven Beans
- Entity Beans dan evolusinya dari versi 2 sampai versi 3.

Kalau sudah menyelesaikan tahap 2 ini, seharusnya Anda akan mudah memahami Seam Framework dan bisa menggunakan sebagian besar fitur dari application server Java (seperti Glassfish, Geronimo, JBoss AS, IBM Websphere, Oracle iAS, BEA Weblogic, dsb).

Selain itu, masih ada tahap ketiga, yaitu urusan lain-lain seperti JMX, dan teman-temannya. Tapi saya yakin kalau sudah lulus tahap dua, sudah tidak bingung lagi mau belajar apa.

Daftar di atas memang cukup menggetarkan hati. Sebagai gambaran, saya sendiri butuh waktu satu tahun lebih untuk memahami itu semua.

Tapi jangan khawatir, kalau Anda mulai hari ini, berarti tahun depan sudah menguasai. Kalau menunda belajar, bukan saja akan lebih lama selesainya, tapi juga materinya akan lebih banyak. Framework integrasi ala OSGi dan fitur baru Java 7 seperti Closure sudah di ambang pintu.

**Mulailah dari sekarang !!!**
