---
comments: true
date: 2005-10-07 09:45:15
layout: post
slug: mencoba-wordpress
title: Mencoba Wordpress
wordpress_id: 5
categories:
- lain
---

Kalau kemarin pakai mambo, sekarang coba pakai Wordpress. Kata orang sih, ini adalah aplikasi yang terhebat di kelasnya (kelas weblog maksudnya). Buat saya, aplikasi weblog yang hebat haruslah bisa menampilkan kode program dengan bagus. Soalnya, saya sering menjadikan blog sebagai website tutorial. 
Menampilkan dengan bagus artinya adalah :



  * Mengkonversi huruf menjadi fixed-width, misalnya Courier

	
  * Dapat menampilkan screenshots

	
  * Dapat menampilkan baris yang panjang

        
  * Tidak memakan tag XML atau HTML





Kode program yang akan ditampilkan tidak jauh dari Java, XML, dan PHP. 
Ok, mari kita coba saja.

Berikut kode program Java : 


    
    package com.artivisi;
    
    public class HelloWorld {
        public static void main(String[] args) {
            try {
                System.out.println("This is a very long string, let's see whether Wordpress able to render well");
            } catch (IllegalArgumentException err) {
               System.out.println("Error ... ");
            }
        }
    }



Kemudian build.xml


    
    <project default="compile" name="test-wordpress">
        <target name="compile">
            <javac srcdir="src" destdir="bin"></javac>
        </target>
    </project>



Dan, terakhir PHP : 

    
    <code>
    
    
    
    </code>



Semua dibuat hanya dengan membungkus kode program seperti ini : 

<pre><code>

 .. tulis kode di sini ... 

</code></pre>

Let's see ... 
Ternyata : 



	
  1. Baris panjang ditampilkan seadanya, ini bisa bagus, bisa juga jelek. Kadangkala kita memang tidak mau memotong baris, karena takut disalah-artikan. Dilain pihak, kalau tidak dipotong, akan merusak tampilan. 

	
  2. String langsung diescape dengan backslash. " ditampilkan menjadi \" Very bad. Saya mengerti ini adalah tindakan pencegahan untuk SQL Injection. Tapi seharusnya string dikembalikan seperti semula waktu ditampilkan kembali.



Mas Priyadi pernah membahas tentang [plugin untuk mengatasi masalah ini](http://priyadi.net/archives/2005/09/27/wordpress-plugin-code-autoescape/). 

Setelah dipasangi plugin, string kembali seperti semula.
Great work mas Priyadi.
