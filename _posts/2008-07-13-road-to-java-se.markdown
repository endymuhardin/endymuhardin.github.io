---
comments: true
date: 2008-07-13 10:56:34
layout: post
slug: road-to-java-se
title: Road to Java SE
wordpress_id: 336
categories:
- java
---

Belajar bahasa pemrograman mirip dengan belajar bahasa manusia. Bahasa pertama adalah yang paling sulit. Ini disebabkan karena kita belum paham istilah-istilah yang digunakan, pola umum menyusun kata, dan ungkapan-ungkapan khusus yang biasa digunakan dalam bahasa tertentu. 

Mari kita ingat waktu pertama kali belajar bahasa Inggris (bahasa Indonesia tidak dihitung, karena kita sudah bisa dari kecil). Pertama kali, kita sama sekali tidak tahu vocabulary. Kemudian kita belajar tentang susunan kata, Subjek-Predikat-Objek. Belajar kalimat aktif dan pasif. 

Demikian juga dengan bahasa pemrograman. Bahasa pertama selalu paling sulit. Setelah kita menguasai satu bahasa, belajar bahasa berikutnya tidak sesulit yang pertama. Misalnya kita butuh waktu enam bulan untuk menguasai Java, maka untuk belajar PHP mungkin cuma butuh 2 bulan. 

Dengan asumsi kita sama sekali belum pernah mengenal bahasa pemrograman, berikut adalah peta jalan untuk belajar bahasa pemrograman Java.


Pertama, kita kumpulkan dulu perlengkapan belajarnya. Kita membutuhkan:




  * Java SDK


  * Java Tutorial dari Sun


  * Javadoc API


  * Text Editor yang bisa memberi warna (syntax highlighting)


Pada tahap ini, jangan menggunakan editor canggih --biasa disebut Integrated Development Environment (IDE)-- macam Eclipse, Netbeans, dan lainnya. IDE memiliki fitur yang canggih dan juga kompleks. Di awal masa belajar, kita ingin belajar tentang bahasa Java, bukan penggunaan tombol dan wizard.

Setelah itu, instal Java SDK. Tergantung metode instalasi Anda, mungkin Anda perlu mengatur environment variabel JAVA_HOME dan PATH. JAVA_HOME mengarah ke folder tempat instalasi Java SDK, sedangkan PATH mengarah pada folder bin di dalam lokasi JAVA_HOME.

Untuk mengetes apakah instalasi Anda sudah berhasil, coba ketik perintah berikut di command prompt: 

    
    
    javac -version
    



Bila keluar pesan error "perintah javac tidak ditemukan" berarti environment variabel masih belum diatur dengan benar. 

Perhatikan bahwa setelah mengatur environment variabel, kita harus merestart command prompt. Command prompt baik di Windows maupun Linux tidak dapat mendeteksi perubahan environment variabel secara instan. 


Selanjutnya, buat kode program sederhana. Dalam semua bahasa pemrograman, kode ini disebut HelloWorld. Kode program ini hanya mencetak tulisan **Hello World** ke layar komputer. 

Coba kompilasi dan jalankan program HelloWorld tersebut. Dari sini Anda akan mengetahui beberapa konsep, yaitu: 




  * Cara kompilasi kode program Java


  * Cara menjalankan aplikasi Java


  * Konsep CLASSPATH



Begitu kita sudah bisa mengkompilasi dan menjalankan kode program Java, kita bisa mulai belajar prinsip umum pemrograman. Prinsip ini sama di semua bahasa pemrograman, walaupun cara penulisannya berbeda. Berikut prinsip-prinsip yang perlu dipelajari: 



  1. Anatomi aplikasi. Di Java, aplikasi terdiri dari banyak package, satu package berisi banyak class, satu class berisi banyak property dan method, satu method terdiri dari banyak statement.


  2. Menggunakan variabel


  3. Macam-macam tipe data


  4. Operator


  5. Statement, Comment, Expression


  6. Method, function, atau procedure. Istilah mana yang digunakan tergantung bahasa yang dipelajari


  7. Penggunaan variabel sebagai argumen dan return value. Pelajari juga pass-by-value vs pass-by-reference dan scope variabel


  8. Control Flow, meliputi percabangan menggunakan if-else dan switch, dan perulangan dengan while atau for.Ketahui juga keyword control flow seperti break, return, dan exit.


  9. Setelah mahir menggunakan variabel skalar, pelajari variabel majemuk. Variabel majemuk ini ada di semua bahasa pemrograman. Biasanya ada dua kategori dasar, yaitu yang menggunakan indeks numerik dan indeks non-numerik. Di PHP variabel majemuk berindeks numerik disebut dengan numeric-array, sedangkan yang berindeks non-numerik disebut associative-array. Di Java pilihan lebih banyak. Untuk indeks numerik ada List dan array. Sedangkan indeks non-numerik diwakili oleh Map. Java juga punya variabel majemuk yang dinamakan Set, yang tidak memiliki indeks berurut, tapi bisa digunakan untuk mencegah elemen yang duplikat. Pelajari konsep, implementasi, dan penggunaannya.



Beberapa latihan yang dapat digunakan untuk memahami prinsip dasar ini antara lain: 


  * Hitung jumlah hari dalam bulan dan tahun tertentu


  * Tampilkan nama sendiri secara berulang sebanyak jumlah hurufnya


  * Hitung faktorial


  * Deret Fibonacci


  * dan sebagainya



Salah satu keunggulan Java adalah dukungannya terhadap Object Oriented Programming. Sekarang, setelah menguasai cara kerja bahasa pemrograman melalui prinsip-prinsip di atas, kita belajar tentang bagaimana mendesain aplikasi dengan menggunakan prinsip orientasi objek. 

Langkah-langkah belajar OOP adalah: 


  1. Belajar apa itu class dan apa itu object. Kalau di Java, ketahui perbedaan antara class dan instance. Perbedaan antara static variable dan instance variable.


  2. Encapsulation


  3. Inheritance


  4. Polymorphism


  5. Banyak orang mengalami kesulitan dalam menjelaskan, apalagi mempelajari encapsulation, inheritance, dan polymorphism. Berdasarkan pengalaman saya, design pattern dapat digunakan untuk membantu pemahaman ketiga konsep OO tersebut. Gunakan Strategy pattern untuk memahami polymorphism, Factory pattern untuk memahami encapsulation, dan Template Method untuk memahami Inheritance. Cukup dengan tiga pattern ini, seharusnya konsep OO sudah bisa dipahami dengan baik



Beberapa bahasa pemrograman seperti Java, Ruby, C# memiliki fitur Exception Handling. Pelajari fitur ini. Khusus Java, pelajari bedanya Error, Checked Exception, dan Unchecked Exception. Yang lebih penting, kenali karakteristik masing-masing dan kapan harus menggunakannya.

Semua bahasa pemrograman modern sudah memiliki infrastruktur Input/Output Stream. I/O Stream ini digunakan untuk membaca dan menulis data ke berbagai tujuan, misalnya file, jaringan, object, dan sebagainya. Dengan menggunakan I/O Stream, teknik baca/tulis file mirip dengan terima/kirim data dari jaringan.

Sebagai latihan, coba buat aplikasi chatting sederhana. 

Terakhir, pelajari fitur-fitur Java yang advanced, seperti: 


  * Multithreading


  * Reflections API


  * Annotations


  * Generics


  * Enum



Kalau sudah sampai di sini, pengetahuan Anda sudah cukup untuk meneruskan sendiri. Bila ingin membuat aplikasi bisnis, pelajari JDBC, kemudian ikuti [Road to Java EE](http://endy.artivisi.com/blog/java/road-to-java-ee/). Bila ingin membuat aplikasi daemon seperti web server atau sms gateway, dalami multithreading, classloading, socket programming, dan lainnya. Bila ingin konsentrasi di mobile, pelajari Java ME.

Demikian panduan singkat untuk belajar bahasa pemrograman Java. Tidak ada yang instan di dunia ini, termasuk belajar bahasa pemrograman. Bila Anda sama sekali belum pernah coding, Anda butuh waktu paling tidak 6 bulan untuk menguasai Java. Bila sudah pernah menggunakan bahasa non-OOP, butuh waktu sekitar 2-3 bulan. Perkiraan waktu ini sekedar gambaran saja, mungkin juga ada yang 2 minggu sudah bisa, atau 2 tahun masih belum bisa. Tergantung kondisi. 

Setelah menguasai bahasanya, selanjutnya menguasai (Application Programming Interface) API yang dibutuhkan untuk menyelesaikan pekerjaan. Kemudian masih ada framework untuk membantu pembuatan aplikasi. Jangan lupa, kita masih harus belajar menggunakan tools seperti IDE, Ant, Maven, JUnit, Subversion, agar kita bisa bekerja secara efektif dan efisien. 

Selamat belajar Java.
