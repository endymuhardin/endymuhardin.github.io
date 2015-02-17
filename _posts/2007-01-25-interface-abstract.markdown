---
comments: true
date: 2007-01-25 16:31:25
layout: post
slug: interface-abstract
title: Interface vs Abstract class
wordpress_id: 195
categories:
- java
---

> 
Kapan pakai interface, dan kapan pakai abstract class?



Pertanyaan menarik ini muncul di milis jug-indonesia. Karena jawabannya cukup panjang, jadi saya copy-paste, sesuaikan sedikit, dan posting di blog. 

First of all, ini pertanyaan advanced. Kapan pakai interface, dan kapan pakai abstract class itu cuma bisa dipahami dengan coding banyak-banyak (learning by doing), berpikir secara abstrak, dan banyak belajar desain aplikasi. Jadi jangan berkecil hati kalau Anda bingung setelah membaca artikel ini. Bukannya Anda tidak berbakat coding, tapi hanya kurang jam terbang saja. 

Berikut jawaban saya.


> 
Abstract class itu digunakan untuk mengimplementasikan pattern Template Method. Sedangkan interface digunakan (diantaranya) untuk mengimplementasikan pattern Observer. 




Pakai interface bila satu class mau memiliki beberapa tipe data. Di Java, tipe data ditentukan oleh interface dan class. Mengacu pada buku Design Pattern, interface digunakan untuk menerapkan pattern Observer.

Contoh mudahnya seperti ini. Misalnya kita membuat aplikasi GUI. dan menggunakan komponen text (JTextArea). Komponen ini memiliki beberapa method untuk mengaktifkan event handling, beberapa diantaranya: 

  * addMouseListener(MouseListener msl) : merespon gerakan mouse
  * addCaretListener(CaretListener cls) : merespon gerakan kursor

Kalau kita definsikan class seperti ini:
    
``` java
public class EventLog implements MouseListener, CaretListener {}
```

maka class EventLog bisa diumpankan pada kedua method di atas, karena class EventLog bertipe data EventLog, MouseListener, dan juga CaretListener. 

Lalu, kapan kita menggunakan abstract class? Salah satunya apabila kita ingin membuat Template Method.

Kutipan dari Design Pattern GoF


> 
By defining some of the steps of an algorithm using abstract operations, the template method fixes their ordering, but it lets Application and Document subclasses vary those steps to suit their needs. 




Seperti kita ketahui, Template Method itu salah satu methodnya concrete dan (sebaiknya) final. 

Contoh template method bisa dilihat di implementasi AbstractFormController di [Spring Framework](http://www.springframework.org). 

Untuk non-pengguna Spring, AbstractFormController itu mendefinisikan workflow pemrosesan HTML form. Method yang perlu diperhatikan di sini adalah method handleRequestInternal. Isi method ini kira2 seperti ini (dimodifikasi agar mudah dimengerti): 

    
``` java
protected void handleRequestInternal() {
    bindDataDariForm();
    setelahBindSebelumValidasi();
    validasiData();
    setelahValidasi();
    processFormSubmission();
}
```

Seperti kita lihat di atas, method ini memanggil beberapa method lain secara berurutan. Urutan ini penting, karena kita tidak mau validasi dipanggil setelah form diproses. Apa gunanya validasi kalau pemrosesan sudah selesai?

Class AbstractFormController ini punya abstract method, yaitu: 
    
``` java 
public abstract void processFormSubmission();
```

Kenapa dibuat abstract? Karena pada saat menulis kode tersebut, Rod Johnson tidak tahu apa yang kita ingin lakukan pada saat form diproses. Ada yang mau simpan ke database, ada yang mau kirim email, dan berbagai kegiatan lain yang tidak terbayangkan sebelumnya. Oleh karena itu, method ini dibuat abstract, sehingga kita harus membuat implementasinya (override) 

Nah, kita sebagai end-user, biasanya hanya perlu mengimplement method processFormSubmission tersebut. Method lainnya hanya dioverride apabila perlu. Misalnya kita ingin pakai logika validasi sendiri, atau ada pemrosesan khusus setelah validasi. 

Teknik Template Method ini tidak bisa diimplement dengan interface, karena harus ada method concrete handleRequestInternal yang berfungsi untuk mendefinsikan workflow. 

Demikian, mudah-mudahan bisa dimengerti.
