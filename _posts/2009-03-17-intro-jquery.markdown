---
comments: true
date: 2009-03-17 15:38:56
layout: post
slug: intro-jquery
title: Intro jQuery
wordpress_id: 413
categories:
- lain
---

Jaman sekarang, membuat tampilan menarik di aplikasi web sudah tidak sulit lagi. 
Banyak pustaka JavaScript yang siap digunakan dengan mudah. 
Tidak perlu lagi kita memusingkan keragaman browser dengan keanehannya masing-masing. 

Salah satu pustaka JavaScript yang populer adalah [jQuery](http://www.jquery.com). 
Berbeda dengan pustaka JavaScript lainnya, jQuery tidak menawarkan komponen UI yang aneh-aneh. 
Demikian juga dengan efek visual, hanya tersedia sekenanya saja. 
Dengan demikian, jQuery berukuran relatif kecil dan mudah dipelajari. 

Akan tetapi, di balik kesederhanaan tersebut tersimpan kecanggihan arsitekturnya. 
Dengan arsitektur yang rapi ini, orang mudah membuat plugin untuk menambah kemampuan jQuery. 
Hasilnya, ada [jQuery UI](http://www.jqueryui.com/) dengan koleksi komponen UI yang kaya. 
Ada juga [jqGrid](http://www.trirand.com/blog/) dengan komponen tabelnya yang canggih. 

Pada tutorial ini, kita akan mempelajari dasar-dasar pemrograman JavaScript menggunakan jQuery. 
Setelah menguasai dasar-dasarnya, 
kita akan mampu menggunakan berbagai teknik tingkat tinggi seperti AJAX dan efek visual. 
Kita juga akan mudah mempelajari dan menggunakan berbagai komponen dan plugin yang tersedia. 

Pada intinya, penggunaan jQuery terdiri dari dua langkah sederhana : 
1. Mendapatkan elemen HTML yang ingin kita gunakan
2. Menambahkan behavior pada elemen HTML yang sudah didapatkan. 

Sebagai contoh kasus, kita akan membuat kalkulator sederhana yang tampilannya seperti ini: 
(/images/uploads/2009/03/kalkulator-jquery.png)



Berikut adalah kode HTML untuk membuat kalkulator tersebut. 


    
    
    <html>
      <head>
        <title>Kalkulator jQuery</title>
      </head>
      <body>
        <h1>Kalkulator jQuery</h1>
    
        <input name="num1"> * <input name="num2">
        <input type="button" id="hitung" value="=">
        <input name="hasil" disabled="true">
            
      </body>
    </html>
    



Dari screenshot di atas kita sudah bisa menebak cara kerja halaman web tersebut. 
Bila tombol = ditekan, maka nilai yang ada di input num1 dan num2 akan dibaca dan dikalikan. 
Kemudian hasilnya akan ditampilkan di input hasil. 

jQuery menganjurkan kita untuk mengikuti prinsip _unobtrusive javascript_, 
yang artinya tidak menambahkan event pada kode HTML. 

Bila kita tidak mengikuti prinsip ini, biasanya kita akan langsung menambahkan event di tombol = seperti ini

    
    
    <input type="button" id="hitung" value="=" onclick="alert('Hello World');">
    


Dengan prinsip _unobtrusive javascript_, kode HTML untuk tampilan dibiarkan apa adanya. 
Event onclick akan kita tambahkan di kode JavaScript yang bisa dipasang di blok head secara inline (ditulis langsung), 
ataupun dikeluarkan ke file tersendiri. 

Pada contoh ini, kita akan menulis inline supaya lebih mudah. 



## Instalasi jQuery


Sebelum kita melakukan apa-apa, terlebih dulu halaman kalkulator tersebut harus bisa mengakses jQuery. 
Tambahkan baris berikut pada blok head. 

    
    
    <script type="text/javascript" src="js/jquery-1.2.6.min.js"></script>
    


Pastikan lokasi file jQuery.js sudah benar. 

Setelah itu, biasanya kita akan menambahkan kode program JavaScript yang akan dijalankan **setelah** seluruh halaman selesai diload oleh browser. Tentunya kita tidak ingin menambahkan event pada elemen yang belum selesai diload.

Berikut adalah blok standar untuk meletakkan kode JavaScript kita. 


    
    
    <script type="text/javascript">
        $(function(){
            
        });
    </script>
    





## Event onclick


Langkah pertama yang kita lakukan adalah menambahkan event ke tombol =. 
Agar bisa melakukannya, kita harus mendapatkan tombol tersebut. 
Kalau kita perhatikan kode HTML di atas, tombol = memiliki ID yang berisi nilai hitung. 
Atribut ID harus unik dalam satu halaman HTML. 
Dengan demikian, kita bisa langsung mendapatkan tombol = dengan menggunakan IDnya. 
Setelah tombol didapatkan, kita bisa langsung menggunakan function click untuk menambahkan event onclick. 
Berikut adalah kode programnya. 


    
    
    <script type="text/javascript">
        $(function(){
            $("#hitung").click();
        });
    </script>
    




Dalam JavaScript, kita bisa memasukkan function sebagai parameter dalam function lain. 
Bagi mereka yang sudah pernah coding C atau C++, pasti sudah tidak asing dengan teknik ini, 
biasa disebut function pointer dalam C atau C++. 

Nah, mari kita isikan function sebagai parameter untuk function click, seperti ini : 


    
    
    <script type="text/javascript">
        $(function(){
            $("#hitung").click(function(){
                
            });
        });
    </script>
    




Selanjutnya, kita tinggal mengimplementasikan logika kode program kita, yaitu : 
1. ambil nilai num1
2. ambil nilai num2
3. kalikan num1 dan num2
4. hasilnya isikan ke input text hasil



## Selector name


Fitur jQuery untuk menunjuk elemen HTML tertentu disebut selector. 
Pada penambahan event onclick di atas, kita sudah menggunakan selector berdasarkan ID. 
Sekarang, kita akan menggunakan selector atribut untuk memilih input dengan atribut name berisi num1, num2, dan hasil. 
Berikut kode program implementasi dari logika di atas. 


    
    
    <script type="text/javascript">
        $(function(){
            $("#hitung").click(function(){
                var num1 = $("input[name=num1]").val();
                var num2 = $("input[name=num2]").val();
                $("input[name=hasil]").val(num1 * num2);
            });
        });
    </script>
    







## Kesimpulan


Silahkan buka kalkulator.html di browser, dan coba apakah sudah bekerja dengan benar. 

Secara garis besar, pemakaian jQuery dapat dijelaskan dengan satu kalimat, 



> pilih elemen menggunakan selector, lalu manipulasi sesuai keinginan



Setelah memahami artikel ini, kita bisa mengembangkan kemampuan kita dalam menggunakan jQuery, diantaranya: 




  * mempelajari berbagai selector selain id dan atribut. jQuery memiliki banyak sekali selector yang bisa digunakan


  * menggunakan berbagai event lain selain onclick, misalnya onfocus, onchange, dsb


  * operasi elemen selain mengeset value, misalnya menambahkan isi elemen, mengakses server dengan AJAX, dsb


  * menggunakan plugin-plugin jQuery misalnya Date Picker, Tab, jqGrid, dan sebagainya


  * membuat plugin sendiri



