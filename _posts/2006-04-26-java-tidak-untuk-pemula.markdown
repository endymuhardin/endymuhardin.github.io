---
comments: true
date: 2006-04-26 18:27:35
layout: post
slug: java-tidak-untuk-pemula
title: 'Java: Tidak untuk Pemula'
wordpress_id: 57
categories:
- java
---

Beberapa kali sepanjang perjalanan hidup, saya berkesempatan untuk mengajarkan Java kepada orang lain. Satu hal yang saya simpulkan dari pengalaman tersebut adalah "Java kurang cocok bagi pemula".

Beberapa orang yang tidak setuju sekarang sedang bersiap-siap menggulung scroll-bar ke bawah, ke bagian komentar, untuk menumpahkan uneg-unegnya. :D Tapi sabar dulu, baca sampai selesai dan Anda akan mengerti maksud saya.

Sebelum kita mulai, mari definisikan dulu kata "pemula". Pemula yang saya maksudkan adalah orang yang sama sekali belum pernah coding. Bisa memformat harddisk tidak masuk hitungan.

Ok, sekarang bayangkan Anda adalah seorang pemula. Bersemangat tinggi ingin belajar pemrograman, soalnya kayaknya titel programmer terlihat keren di kartu nama. Berdasarkan hasil browsing dan chatting di sana-sini, kata orang sih sekarang jamannya Java. Baiklah, mari kita belajar Java.

Anda ikut training Java -seperti lazimnya sopan santun di dunia pemrograman- hal pertama yang diajarkan instruktur adalah Hello World.

Instruktur: Selamat pagi bapak dan ibu. Sekarang kita akan belajar Hello World. Silahkan buka Notepad, dan ketik kode berikut:



``` java
public class HelloWorld {
  public static void main(String[] xx){
    System.out.println("Hello World");
  }
}
```


Instruktur: Dengan kode di atas, kita akan dapat mencetak tulisan "Hello World" ke layar. Bagaimana? Hebat kan?

Peserta: !@#$%[sumpah serapah disensor :P ]. Sama sekali tidak hebat. Apa itu class? Kenapa harus public? Apa artinya void? static? Berarti ada dynamic dong? Apa bedanya kurung kotak [] dengan kurung bulat () dan kurung kurawal {} ? .... [lagi-lagi disensor karena pertanyaan terlalu banyak]

Java, memang adalah bahasa yang mature. Sudah stabil (artinya tidak terlalu banyak perubahan fundamental) dan sudah teruji digunakan berbagai aplikasi besar dengan sukses. Tetapi tidak berarti mudah bagi pemula.

Seperti pada contoh sederhana di atas, sebetulnya baris yang ingin kita ajarkan adalah:


    
``` java
System.out.println("Hello World");
```



Tapi ada banyak baris lainnya yang ikut muncul. Karena ya di Java untuk Hello World memang itu kebutuhan minimalnya. Bandingkan dengan:

**Ruby**

``` ruby 
puts "Hello World"
```



**PHP**
    
``` php
echo("Hello World");
```



Perhatikan bahwa saya tidak mempermasalahkan urusan kompile dan eksekusi, karena itu memang sudah konsep dasar Java bahwa source code harus dikompilasi.

Jadi, kesimpulannya adalah untuk mengajarkan Hello World, kita juga harus mengajarkan tentang:



	
  1. Apa itu class

	
  2. Akses level untuk class dan method, kalo gak pake public gimana? Gak bisa diakses di luar package. Jadi, harus ajarkan juga tentang ....

	
  3. Apa itu package

	
  4. Konsep method dan return value

	
  5. Array

	
  6. Perbedaan class method (static) dan instance method


Waaa ... :(
Berdasarkan keterangan di atas, saran saya untuk yang belum pernah coding sebelumnya adalah belajar dengan bahasa lain dulu. Misalnya PHP yang sintaksnya agak mirip. Nanti kalo sudah tau apa itu array, function, class, object, baru belajar Java.

Ini akan membuat hidup jadi lebih mudah untuk yang belajar, juga untuk yang mengajari.
