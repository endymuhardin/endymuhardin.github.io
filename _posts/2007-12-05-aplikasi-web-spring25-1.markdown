---
comments: true
date: 2007-12-05 13:35:16
layout: post
slug: aplikasi-web-spring25-1
title: Aplikasi Web dengan Spring 2.5 [bagian 1]
wordpress_id: 315
categories:
- java
---

Setelah pada [artikel sebelumnya](http://endy.artivisi.com/blog/java/akses-database-spring25) kita berhasil mengakses database, kali ini kita akan membuat tampilan berbasis web yang menggunakan kode program kita kemarin. 

Fiturnya tidak terlalu sulit, dari tabel T_PERSON kemarin kita akan buatkan beberapa tampilan untuk mengelola data Person. Tampilan yang akan kita sediakan adalah:

  * daftar semua Person
  * informasi Person yang dipilih
  * form untuk membuat object Person baru
  * form untuk mengedit object Person yang sudah ada


Sebelum kita mulai, ada baiknya kita mengetahui cara kerja Spring dalam mengelola aplikasi web. Sequence diagram berikut akan memudahkan pemahaman kita.

[![Alur kerja Spring MVC ](/images/uploads/2007/12/spring-mvc-sequence.png)](/images/uploads/2007/12/spring-mvc-sequence.png)

Seperti kita lihat pada gambar, semua request akan diterima oleh DispatcherServlet. Mereka yang pernah membaca buku Core J2EE Pattern akan segera mengenali jurus ini, yang sering disebut dengan istilah FrontController. DispatcherServlet akan menyuruh handler mapping untuk memilih class yang akan menangani request. Ada beberapa implementasi handler mapping, diantaranya: 

  * BeanNameUrlHandlerMapping
  * SimpleUrlHandlerMapping
  * ControllerClassNameHandlerMapping

Class yang menangani request disebut dengan istilah Controller. Class Controller ini yang akan kita tulis sendiri. Spring menyediakan beberapa superclass Controller yang bisa kita subclass untuk mengurangi kode yang harus ditulis. Beberapa superclass yang disediakan Spring antara lain: 

  * Controller
  * MultiActionController
  * SimpleFormController
  * AbstractWizardController

Selain membuat turunan dari superclass di atas, kita juga bisa membuat class biasa yang dilengkapi dengan annotation. Pada artikel  ini kita tidak akan membuat turunan apa-apa, karena semua bisa dikerjakan dengan annotation.

Tanggung jawab controller selain memproses request adalah menentukan nama template yang akan digunakan untuk menampilkan hasil pemrosesan controller. Spring menyebut template ini dengan istilah View. Kita cuma perlu menyebutkan nama View dan Spring yang akan mencarikan file template yang sesuai dan kemudian mengisi datanya. Proses mencarikan template ini ditangani oleh ViewResolver. Ada beberapa implementasi ViewResolver, antara lain untuk memproses template berjenis: 

  * JSP dan JSTL
  * Freemarker atau Velocity
  * XML dengan XSLT
  * Jasper Report
  * Document View (PDF dan XLS)

Sekarang setelah kita mengetahui arsitektur umum dari aplikasi web Spring, kita bisa segera coding. Class-class yang akan kita buat adalah: 

  * PersonController. Class ini akan menangani tampilan daftar Person dan detail Person.
  * PersonFormController. Class ini akan menangani tampilan pengeditan object Person, baik yang belum terdaftar maupun yang sudah ada di dalam database. 

File konfigurasi yang akan kita buat adalah: 

  * web.xml. Ini adalah konfigurasi standar untuk semua aplikasi web dengan Java.
  * tutorial-servlet.xml. Ini adalah konfigurasi DispatcherServlet untuk menampung deklarasi HandlerMapping, Controller, dan ViewResolver.

Untuk menampilkan halaman web, kita akan menggunakan template engine [Velocity](http://velocity.apache.org). Velocity adalah template engine yang kecil dan ringan, tapi fiturnya cukup lengkap dan mudah digunakan. Saya lebih suka menggunakan Velocity daripada JSP, karena JSP membutuhkan kompilasi menjadi Servlet dan kemudian menjadi bytecode. Ini menyebabkan halaman JSP lebih sulit didebug bila terjadi error. Selain itu, kompilasi JSP membutuhkan dua kompiler, satu untuk JSP ke Servlet, dan satu lagi untuk Servlet menjadi bytecode. Dengan demikian, kita harus menginstal JDK di server. Tanpa JSP, kita dapat menggunakan Servlet container yang ringan dan kecil seperti [Jetty](http://jetty.mortbay.org) atau [Winstone](http://winstone.sourceforge.net) dan tidak perlu menginstal JDK, cukup JRE saja.

Template untuk menampilkan daftar orang dibuat dalam HTML yang sudah disisipi kode Velocity, disimpan dengan nama `personlist.html`. Kodenya terlihat seperti ini. 



### personlist.html



    
    
    <html>
    <head>
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
        <td>
          <a href="personform?person_id=$person.Id">edit</a> | 
          <a href="persondetail?person_id=$person.Id">view</a>
        </td>
      </tr>
    #end
    
    </table>
    
    </body>
    </html>
    



Kode yang diawali dengan tanda # merupakan perintah dalam Velocity. Dengan menggunakan perintah `#foreach`, kita melakukan looping untuk setiap baris record. 

Kode yang diawali tanda $ merupakan variabel dalam Velocity. Isi variabel ini nantinya akan kita sediakan melalui controller Spring. 

Untuk menampilkan detail informasi Person, kita buat `persondetail.html`. Kodenya seperti ini. 


### persondetail.html



    
    
    <html>
    
    <head>
    <title>:: $person.Name's Detail Info ::</title>
    </head>
    
    <body>
    <table>
      <tr>
        <td>Nama</td>
        <td>$person.Name</td>
      </tr>
      <tr>
        <td>Email</td>
        <td>$person.Email</td>
      </tr>
    </table>
    </body>
    
    </html>
    



Sekarang mari kita isi template tersebut dengan data yang dibutuhkannya. Template `personlist.html` membutuhkan data List<Person> dengan nama variabel personList, sedangkan `persondetail.html` membutuhkan data Person dengan nama variabel person. 

Pertama, kita akan mengisi `personlist.html`. Template ini akan disuplai oleh PersonController, melalui method yang bernama list. Berikut kode programnya. 



### PersonController.java



    
    
    package tutorial.spring25.ui.springmvc;
    
    @Controller
    public class PersonController {
    
      private PersonDao personDao;
    
      @Autowired
      public void setPersonDao(PersonDao personDao) {
        this.personDao = personDao;
      }
    
      @RequestMapping("/personlist")
      public ModelMap list(){
        return new ModelMap(personDao.getAll());
      }
    }
    



Mudah bukan? Cukup panggil method personDao.getAll, kemudian masukkan hasilnya ke dalam ModelMap. 

Kita melihat beberapa annotation pada kode ini. Annotation `@Controller` merupakan penanda bagi Spring bahwa class ini adalah sebuah Controller. Kelas yang memiliki annotation ini akan dipindai pada saat start-up dan diregistrasi ke `ApplicationContext`. Annotation `@Autowired` menyuruh Spring untuk menginjeksikan object `PersonDao`. Dengan annotation `@RequestMapping`, kita menentukan bahwa request menuju ke `http://namaserver:port/namaaplikasi/namaservlet/personlist` akan ditangani oleh method ini. 

Pada saat dideploy, `DispatcherServlet` milik Spring akan menemukan dan memanggil method ini. Kemudian, dia akan menerima hasilnya berupa ModelMap untuk kemudian diserahkan ke ViewHandler Velocity untuk digabungkan dengan template dan menghasilkan halaman HTML. 

Object yang kita berikan pada ModelMap akan diberi nama oleh Spring secara otomatis. Karena kita mensuplai object dengan tipe `List<Person>`, maka Spring akan memberikan nama `personList`. Demikian juga pada controller berikutnya kita akan memberikan object bertipe `Person` ke controller, Spring akan memberikan nama person pada object tersebut. Dengan nama itulah (`$person`) kita mengaksesnya di template Velocity.

Cukup satu dulu implementasi kita. Sekarang tiba saatnya konfigurasi. Aplikasi kita akan dideploy dengan nama context `tutorial-spring25`. Di dalamnya, kita akan memasang `DispatcherServlet` yang akan mengambil semua request dengan path /tutorial/*. Jadi, method `public ModelMap list` akan diakses melalui URL `http://localhost:8080/tutorial-spring25/tutorial/personlist`. 

Konfigurasi pertama ada di web.xml. Di sini kita akan mengkonfigurasi `DispatcherServlet` dan mendaftarkan `applicationContext.xml`. Berikut isi `web.xml`



### web.xml



    
    
    <?xml version="1.0" encoding="ISO-8859-1"?>
    <web-app version="2.4" 
             xmlns="http://java.sun.com/xml/ns/j2ee"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee 
             http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd">
    
      <display-name>Tutorial Spring</display-name>
    
      <description>Tutorial Spring 2.5</description>
    
      <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
      </context-param>
    
      <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
      </listener>
    
      <servlet>
        <servlet-name>tutorial</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
      </servlet>
    
      <servlet-mapping>
        <servlet-name>tutorial</servlet-name>
        <url-pattern>/tutorial/*</url-pattern>
      </servlet-mapping>
    
      <welcome-file-list>
        <welcome-file>index.html</welcome-file>
      </welcome-file-list>
    
    </web-app>
    



`ApplicationContext` yang berisi konfigurasi database dan transaksi, yang dibahas pada artikel sebelumnya, didaftarkan melalui context-param. File konfigurasinya, `applicationContext.xml` disimpan di classpath, yaitu di folder `WEB-INF/classes`. Oleh karena itu, kita tulis pathnya `classpath:applicationContext.xml`

`ApplicationContext` ini harus diaktifkan pada saat aplikasi web dideploy dan dinon-aktifkan pada saat aplikasi web di-undeploy. Untuk itu, kita harus memasang `ContextLoaderListener` untuk memonitor aktifitas aplikasi web. 

Selanjutnya, kita daftarkan `DispatcherServlet` dengan nama `tutorial`. Spring akan mencari file bernama `tutorial-servlet.xml` sebagai file konfigurasi `DispatcherServlet` ini di dalam folder `WEB-INF`. `DispatcherServlet` tutorial akan dimapping untuk menangani semua request dengan pola `/tutorial/*`

Sekarang, mari kita lihat isi `tutorial-servlet.xml`. 



### tutorial-servlet.xml



    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:p="http://www.springframework.org/schema/p"
           xmlns:context="http://www.springframework.org/schema/context"
           xsi:schemaLocation="http://www.springframework.org/schema/beans 
           http://www.springframework.org/schema/beans/spring-beans-2.5.xsd
           http://www.springframework.org/schema/context 
           http://www.springframework.org/schema/context/spring-context-2.5.xsd">
    
      <context:component-scan base-package="tutorial.spring25.ui.springmvc" />
    
      <bean id="velocityConfig"
            class="org.springframework.web.servlet.view.velocity.VelocityConfigurer">
        <property name="resourceLoaderPath" value="/WEB-INF/templates/velocity/" />
      </bean>
    
      <bean id="viewResolver"
            class="org.springframework.web.servlet.view.velocity.VelocityViewResolver">
        <property name="cache" value="true" />
        <property name="prefix" value="" />
        <property name="suffix" value=".html" />
      </bean>
    
    </beans>
    



Pertama, kita konfigurasi Spring agar memindai isi package `tutorial.spring25.ui.springmvc` dan mendaftarkan semua class yang beranotasi `@Controller`. 
Kedua, kita mengkonfigurasi `VelocityConfigurer` untuk mencari template di dalam folder `WEB-INF/templates/velocity`. 
Terakhir, kita melakukan konfigurasi `VelocityViewResolver` untuk menerjemahkan nama view menjadi nama file template. Misalnya kita memberikan nama view `personlist`, maka `VelocityViewResolver` akan memberikan file `WEB-INF/templates/velocity/personlist.html`.

Pembaca yang teliti akan segera protes, "Kita kan tidak pernah menyebutkan nama view di dalam Controller. Lalu dari mana nama view itu didapatkan?" 

Baiklah, mari lihat lagi method tersebut. 



### Method list



    
    
      @RequestMapping("/personlist")
      public ModelMap list(){
        return new ModelMap(personDao.getAll());
      }
    



Method tersebut dimapping untuk menerima request `http://localhost:8080/tutorial-spring25/tutorial/personlist`. Kalau kita tidak melakukan konfigurasi apa-apa, Spring secara default akan menganggap nama request sama dengan nama view. Jadi method di atas akan menghasilkan nama view `personlist`.

Setelah semua konfigurasi di atas selesai, kita bisa langsung membuat paket war untuk dideploy. 

Berikutnya, kita akan membuat tampilan informasi detail per Person. Untuk ini, kita membutuhkan parameter `person\_id` yang ingin ditampilkan. Sehingga bila kita ingin menampilkan Person dengan id 100, URLnya adalah `http://localhost/tutorial-spring25/tutorial/persondetail?person\_id=100`

Class `PersonController` yang sudah ditambahi method detail tampak seperti ini. 



### PersonController.java



    
    
    package tutorial.spring25.ui.springmvc;
    
    @Controller
    public class PersonController {
    
      private PersonDao personDao;
    
      @Autowired
      public void setPersonDao(PersonDao personDao) {
        this.personDao = personDao;
      }
    
      @RequestMapping("/personlist")
      public ModelMap list(){
        return new ModelMap(personDao.getAll());
      }
    
      @RequestMapping("/persondetail")
      public ModelMap detail(@RequestParam("person_id") Long personId){
        return new ModelMap(personDao.getById(personId));
      }
    }
    



Untuk mengambil parameter` person\_id`, kita tinggal membuat method parameter biasa yang dilengkapi annotation `@RequestParam`. Konversi tipe data akan dilakukan oleh Spring. Dengan kata lain, kode ini


    
    
    @RequestParam("person_id") Long personId
    



sama dengan ini


    
    
    Long personId = Long.valueOf(httpRequest.getParameter("person_id"));
    



bedanya, kita tidak perlu mengimport `javax.servlet.HttpServletRequest`. 

Setelah selesai, redeploy aplikasi dan coba akses `http://localhost/tutorial-spring25/tutorial/personlist`. Dari sana, klik link view. Tampilan detail dari object Person yang dipilih akan segera terlihat. 

Demikianlah bagian kedua dari seri Spring 2.5. Pada [artikel selanjutnya](http://endy.artivisi.com/blog/java/aplikasi-web-spring25-2/), kita akan melihat cara mengimplementasikan form untuk mengedit object Person yang sudah ada, maupun membuat object Person yang baru.
