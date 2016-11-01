---
comments: true
date: 2007-12-21 14:07:10
layout: post
slug: aplikasi-web-spring25-3
title: Aplikasi Web dengan Spring 2.5 [bagian 3]
wordpress_id: 320
categories:
- java
---

Kemarin kita sudah membuat aplikasi sederhana yang memiliki tampilan list dan form. Tapi ada satu hal penting yang belum ada, yaitu header, footer, dan menu navigasi. 

Ada beberapa cara untuk memasang header dan footer tanpa duplikasi kode. Cara paling sederhana tentunya dengan menggunakan include di setiap halaman. Contohnya kira-kira seperti ini. 



### personlist.html



    
    
    #parse("header.html")
    
    
    <table border="0" cellpadding="2" cellspacing="2">
    	<tr>
    		<th>Name</th>
    		<th>Email</th>
    		<th> </th>
    	</tr>
    	#foreach($person in $personList)
    	<tr>
    		<td>$person.Name</td>
    		<td>$person.Email</td>
    		<td><a href="personform?person_id=$person.Id">edit</a> | <a
    			href="persondetail?person_id=$person.Id">view</a></td>
    	</tr>
    	#end
    </table>
    
    
    #parse("footer.html")
    





### header.html


berisi kira-kira seperti ini


    
    
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>:: List of All Person ::</title>
      </head>
    
      <body>
    



dan


###  footer.html 



    
    
    </body>
    </html>
    



Saya sendiri kurang suka dengan pendekatan seperti ini, karena: 

  * kita terpaksa membuat halaman html yang tidak lengkap. Di header.html tidak ada tutup body dan di footer.html tidak ada tag pembuka body. 
  * perintah include untuk header dan footer akan diulangi di setiap halaman.

Ada cara yang lebih baik, yaitu menggunakan decorator. 

Pustaka decorator di Java cukup banyak, antara lain: 

  * SiteMesh
  * Tiles
  * Facelets

Tiles tadinya adalah decorator khusus untuk framework Struts. Tapi seiring dengan populernya penggunaan decorator, maka Tiles direfactor sehingga dapat berdiri sendiri tanpa Struts. Saat artikel ini ditulis, baik Tiles maupun penerusnya Tiles 2 cuma bisa digunakan untuk JSP. Jadi tidak bisa kita terapkan untuk aplikasi kita yang menggunakan Velocity.

Facelets bukan hanya sekedar decorator. Dia adalah teknologi templating untuk JSF. Jadi posisinya kurang lebih mirip dengan Velocity, yaitu template engine. Decorator hanyalah salah satu fitur tambahan Facelets. Sayangnya Facelets hanya bisa digunakan untuk JSF.

Sitemesh adalah decorator independen. Tidak terikat dengan framework apa-apa. Dia juga mendukung JSP, Freemarker, dan Velocity. Kita akan menggunakan SiteMesh pada artikel ini.

SiteMesh bekerja secara transparan. Pada saat membuat halaman aplikasi, kita bisa langsung coding seperti biasa. Tidak ada perubahan kode HTML di dalam template Velocity. Ketika dideploy, SiteMesh akan mencegat semua respon yang dikirim appserver ke browser dan menambahkan header dan footer. 

Sebagai contoh, 


### personlist.html




    
    
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>:: List of All Person ::</title>
    </head>
    <body>
    
    <table border="0" cellpadding="2" cellspacing="2">
    	<tr>
    		<th>Name</th>
    		<th>Email</th>
    		<th> </th>
    	</tr>
    	#foreach($person in $personList)
    	<tr>
    		<td>$person.Name</td>
    		<td>$person.Email</td>
    		<td><a href="personform?person_id=$person.Id">edit</a> | <a
    			href="persondetail?person_id=$person.Id">view</a></td>
    	</tr>
    	#end
    </table>
    
    
    </body>
    </html>
    



Seperti kita lihat, tidak ada kode khusus. Kodenya sama persis dengan artikel sebelumnya.

Ini adalah decoratornya, kita beri nama main.html.

    
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    
    <link href="${base}/css/main.css" rel="stylesheet" type="text/css" />
    <link href="${base}/css/layout.css" rel="stylesheet" type="text/css" />
    
    <title>${title}</title>
    </head>
    <body>
    
    <div id="header">
    <h1>Hello Spring 2.5</h1>
    <h2>Tutorial Spring 2.5 Annotation Configuration</h2>
    </div>
    
    <div id="top-bar">
    <ul>
    	<li>hola, endymuhardin</li>
    	<li><a href="#">help</a></li>
    	<li><a href="#">logout</a></li>
    </ul>
    </div>
    
    <div id="menu-bar">
    <ul>
    	<li><a href="${base}/tutorial/personlist">manage person</a></li>
    	<li><a href="#">generate report</a></li>
    	<li><a href="#">prevent global warming</a></li>
    </ul>
    </div>
    
    <div id="main">
    
    <div id="sidebar">
    
    <h1>Manage Person</h1>
    <ul>
    	<li><a href="${base}/tutorial/personform">add person</a></li>
    	<li><a href="${base}/tutorial/personlist">list of person</a></li>
    </ul>
    
    </div>
    
    <div id="content">
    
    ${body}
    
    </div>
    
    
    </div>
    
    
    <div id="footer">
    
    <div id="copyright">Copyright &copy; 2008 :: ArtiVisi Intermedia
    ::</div>
    
    <div id="company-logo">Company Logo</div>
    
    </div>
    </body>
    </html>
    



Ada beberapa tag khusus yang digunakan dalam decorator kita, yaitu

  * ${base}
  * ${title}
  * ${body}

Ini adalah variabel yang disediakan SiteMesh untuk kita. ${base} adalah path menuju aplikasi web kita. Kita menggunakan ${base} untuk membuat URL yang lengkap. Variabel ini sangat berguna agar aplikasi kita bisa dideploy ke berbagai context. 

Pada saat mendekorasi, SiteMesh akan membaca respon HTML yang dikeluarkan appserver dan mengambil isi tag title dan body, kemudian memasangnya di tempat kita menaruh tag ${title} dan ${body}. Setelah itu, barulah keseluruhan respon yang sudah didekorasi akan dikirim ke client. 

Kita sudah punya halaman yang akan ditampilkan (personlist.html) dan decoratornya (main.html). Untuk menggabungkan keduanya, kita harus memasang SiteMesh sebagai Servlet Filter. Servlet Filter memiliki kemampuan untuk mencegat baik request maupun response. Kita mendaftarkan filter di web.xml. Berikut deklarasi filter SiteMesh berikut mappingnya.


    
    
    <filter>
      <filter-name>sitemesh</filter-name>
      <filter-class>com.opensymphony.module.sitemesh.filter.PageFilter</filter-class>
    </filter>	
    
    
    <filter-mapping>
      <filter-name>sitemesh</filter-name>
      <url-pattern>/*</url-pattern>
    </filter-mapping>
    



Selain itu, kita juga perlu memasang servlet SiteMesh. Servlet ini yang akan mencegat semua pemanggilan template velocity, yaitu semua file yang berakhiran *.html. Berikut adalah deklarasi servlet berikut mappingnya.


    
    
    <servlet>
      <servlet-name>sitemesh-velocity</servlet-name>
      <servlet-class>com.opensymphony.module.sitemesh.velocity.VelocityDecoratorServlet</servlet-class>
    </servlet>
    
    <servlet-mapping>
      <servlet-name>sitemesh-velocity</servlet-name>
      <url-pattern>*.html</url-pattern>
    </servlet-mapping>
    



Selanjutnya, kita harus memberi tahu SiteMesh di mana kita meletakkan decorator dan URL apa saja yang ingin didekorasi. Biasanya kita punya beberapa decorator yang berbeda untuk (misalnya): 
  
  * halaman utama. Lengkap dengan menubar, header, dan footer
  * halaman login. Tanpa menubar, header, dan footer
  * tampilan siap print. Tanpa warna-warni.

Sebagai contoh, kita cuma akan menggunakan satu decorator, yaitu main.html. Decorator ini berlaku untuk semua request. Berikut konfigurasinya. 


    
    <decorators defaultdir="/WEB-INF/decorators">
      <decorator name="default" page="main.html">
        <pattern>/*</pattern>
      </decorator>
    </decorators>
    



File ini diletakkan di dalam folder WEB-INF, bersama-sama dengan web.xml.

Pada konfigurasi decorator tersebut, kita jelaskan bahwa semua request (/*) akan dicegat dan didekorasi dengan main.html yang ada di folder /WEB-INF/decorators.

Terakhir, kita lengkapi pustaka yang dibutuhkan. Jar yang dibutuhkan adalah: 

  * sitemesh.jar
  * commons-digester.jar
  * velocity-tools-view.jar

Perhatikan bahwa velocity-tools-view.jar ini sudah mengandung velocity-tools-generic.jar yang kita gunakan pada artikel sebelumnya. Jadi pastikan bahwa kita tidak lupa membuang velocity-tools-generic.jar.

Selesai sudah. Mudah bukan? 

Contoh ini sudah dipublish di GoogleCode, Anda bisa mengunduh: 

* [Checkout project](https://github.com/endymuhardin/hello-spring-25.git)
* [Download keseluruhan project folder](https://github.com/endymuhardin/hello-spring-25/archive/master.zip)


Atau Anda juga bisa menggunakan Subversion untuk menarik keseluruhan project folder, dengan perintah: 


    
    
    git clone https://github.com/endymuhardin/hello-spring-25.git
    



Setelah project folder diperoleh, dibutuhkan database MySQL dengan konfigurasi sebagai berikut: 

  * nama database : belajar
  * username : belajar
  * password : java

Tabel T_PERSON yang digunakan pada contoh ini dapat dibuat dengan menggunakan script sql yang ada di folder src/sql/mysql-schema.sql.

Untuk menjalankan aplikasi ini, dibutuhkan Ant 1.7.0 dan Java 6. Cukup ketik ant run di konsol. Kemudian browse ke http://localhost:8080/

Selamat mencoba

