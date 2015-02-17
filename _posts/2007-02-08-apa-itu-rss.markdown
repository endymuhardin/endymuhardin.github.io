---
comments: true
date: 2007-02-08 16:43:52
layout: post
slug: apa-itu-rss
title: Apa itu RSS ?
wordpress_id: 197
categories:
- aplikasi
---

Sudah tau RSS? 

Jika Anda bukan programmer, wajar jika tidak tahu. Tapi jika Anda programmer ... jangan sampai tidak tahu. Apalagi bilang, 



> RSS itu kan sama dengan CSS ... 



RSS itu banyak kepanjangannya, beberapa diantaranya antara lain: 




    
  * Really Simple Syndication

    
  * Rich Site Summary
  
    
  * RDF Site Summary



RSS berisi rangkuman dari isi suatu website. Misalnya kita mengunjungi website yang berisi banyak artikel. Kita bisa mengambil data RSSnya, yang berisi : 


    
  * Judul Artikel

    
  * Tanggal Publish
  
    
  * Pengarang

    
  * Potongan isinya



Sebagai contoh, misalnya kita ingin selalu mengikuti perkembangan terbaru di dunia PHP. Cukup masukkan URL http://www.php.net/news.rss di aplikasi aggregator. Nanti aplikasi aggregator akan menampilkan RSS feed tersebut dengan antarmuka yang mudah dibaca. 

Ada beberapa versi format data RSS, yaitu versi 0.9, 0.91, 1.0, dan 2.0. Selain itu, juga ada format lain yang namanya Atom. Data ini (baik RSS maupun Atom) tersebut dikemas dalam format XML, yang nantinya dapat dibaca oleh aplikasi yang namanya aggregator. Ulasan tentang berbagai jenis aplikasi aggregator berbasis desktop dapat dilihat [di sini](http://endy.artivisi.com/blog/aplikasi/aggregator-on-windows-2/). 

Aplikasi aggregator juga ada yang berbasis web. Misalnya Google Reader dan Bloglines. Kita juga bisa membuat sendiri dengan menggunakan library [Magpie RSS](http://magpierss.sourceforge.net) atau menggunakan plugin di berbagai aplikasi Content Management System populer. Biasanya aplikasi populer seperti Wordpress, Drupal, atau Joomla sudah memiliki plugin untuk itu. Contoh nyatanya bisa dilihat di [website Pak Cipi](http://www.prayudi.web.id). Website ini dibuat dengan Drupal.

Cara kerja aplikasi aggregator sama dengan aplikasi mail client (Outlook Express, Evolution, atau Thunderbird). Bedanya, kalau aplikasi mail client mengambil data email dari mail server, aplikasi aggregator mengambil data RSS dari website yang menyediakan. Kita bisa memasukkan website sebanyak-banyaknya sesuai keinginan kita. Nantinya, kalau website yang kita daftarkan merilis artikel/berita baru, rangkumannya akan muncul di aggregator kita. Di aplikasi aggregator akan muncul entri **Unread Items** seperti halnya **Unread Mails**. Aplikasi aggregator ini berguna agar kita tidak perlu mengunjungi setiap website satu persatu. Cukup lihat judul dan ringkasan artikel baru. Jika menarik, kita kunjungi websitenya. Jika tidak menarik, diabaikan saja. 


Demikianlah penjelasan singkat tentang RSS. Jangan salah lagi membedakan antara RSS dan CSS. 

They are different !!
