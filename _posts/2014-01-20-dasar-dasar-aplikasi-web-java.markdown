---
layout: post
title: "Dasar-dasar Aplikasi Web Java"
date: 2014-01-20 20:12
comments: true
categories: 
- java
---

Pada artikel terdahulu, kita telah membahas tentang [pentingnya penguasaan terhadap konsep dasar](http://software.endy.muhardin.com/life/lan-na-zha/). Kali ini, kita akan membahas tentang konsep dasar aplikasi web di Java. Ini juga akan menjawab pertanyaan yang sering ditanyakan di forum yaitu

> Saya ingin belajar Java Enterprise Edition (Java EE), apa yang pertama harus saya pelajari?

<!--more-->

Java EE sangat luas cakupannya, di antaranya adalah:

* Java Servlet
* JavaServer Faces
* JavaServer Pages
* Java Persistence
* [dan masih banyak lagi](http://www.oracle.com/technetwork/java/javaee/tech/index.html)

Untuk bisa memahami semuanya, tentu kita harus memulai dari yang paling sederhana dulu, yaitu Java Servlet. Teknologi ini adalah dasar dari semua aplikasi web di Java. Tanpa pemahaman terhadap teknologi ini, sulit bagi kita untuk mempelajari framework atau library yang lebih canggih seperti Spring MVC, Struts, JavaServer Faces, dan berbagai framework web lainnya. Kenapa sulit? Karena semua framework tersebut dibangun di atas Java Servlet. Kalau pondasinya saja tidak paham, bagaimana mau belajar yang lain?

Ada beberapa hal penting yang harus dipahami dalam Java Servlet, yaitu:

* Struktur Folder Aplikasi Web Java
* Alur eksekusi HTTP Request sampai menghasilkan HTTP Response
* Tiga komponen Java Servlet yaitu:

    * Servlet
    * Filter
    * Listener

Mari kita bahas satu persatu.

# Struktur Folder #

Aplikasi web Java struktur foldernya harus mengikuti kaidah berikut

[![Struktur Folder Aplikasi Web Java](https://github.com/endymuhardin/materi-kuliah-java-web/blob/master/materi-kuliah/img/struktur-folder-web-java.png?raw=true)](https://github.com/endymuhardin/materi-kuliah-java-web/blob/master/materi-kuliah/img/struktur-folder-web-java.png?raw=true)

Gambar di atas adalah struktur folder aplikasi yang siap dijalankan. Oleh karena itu kita tidak melihat adanya source code Java di sana. 

Setelah kita memiliki struktur folder seperti di atas, aplikasi siap dipaketkan (package) supaya bisa dideploy di application server. Packaging dilakukan dengan membungkus folder di atas dengan algoritma `zip`. Kita bisa menggunakan aplikasi kompresi seperti WinZip ataupun WinRAR. Bila kita menggunakan WinRAR, harus diingat bahwa algoritma yang digunakan haruslah `zip`, bukan `rar`

Setelah di-zip, rename extension file menjadi `war` agar dikenali oleh application server. `war` merupakan singkatan dari Web Archive.

Untuk menjalankan aplikasi di application server (misalnya Tomcat), berikut langkah-langkah deployment:

* masukkan file `war` ke folder deployment sesuai merek application server yang digunakan
* contoh: untuk Tomcat, folder deploymentnya adalah `webapps`
* Tomcat akan meng-extract file `war` tersebut
* Setelah deployment selesai (ditandai dengan file telah diextract dan tidak ada error di log) aplikasi bisa dibrowse di `http://ip-server:port/nama-file-war/index.html`

Bila aplikasi tidak lagi digunakan, kita bisa melakukan undeploy. Caranya:

* hapus file `war` dari folder deployment
* setelah folder aplikasi terhapus, undeploy berarti sukses

Ada beberapa hal yang harus diperhatikan dalam struktur folder di atas, yaitu:

* Folder `WEB-INF`
* File `web.xml`

## Folder WEB-INF ##

Folder ini adalah folder khusus. Dia tidak bisa dibrowse oleh user aplikasi. Maksudnya adalah, user aplikasi tidak bisa mengetik `http://localhost:8080/belajar/WEB-INF` di browser untuk menampilkan isi folder `WEB-INF`. Jadi bila kita memiliki file yang tidak boleh dilihat user (misalnya konfigurasi, logfile, file temporary, dan sebagainya), kita bisa letakkan file-file tersebut dalam folder `WEB-INF`.

Di dalam folder ini biasanya ada dua folder khusus lain, yaitu

* `classes` : berisi file `*.class` hasil kompilasi dari source code `*.java` kita
* `lib` : berisi file `*.jar`, library tambahan yang kita gunakan seperti driver JDBC, JSON processor, pengolah tanggal, dan lainnya

## File web.xml ##

File ini berisi konfigurasi dari aplikasi web kita. Di Java EE versi terbaru, file ini tidak harus ada. Tapi di Java EE versi terdahulu, dia wajib disertakan. Untuk amannya, agar aplikasi kita kompatibel dengan application server jadul, ada baiknya kita sertakan saja. Toh file ini juga akan kita buat kalau kita menggunakan framework seperti Spring MVC, JSF, Struts, dan sebagainya. Berikut isi file `web.xml` yang paling sederhana, yaitu hanya berisi _root tag_ `webapp` kosong.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
	      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	      xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
	      http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
	      version="3.0">

</web-app>
```

Nantinya, file ini bisa berisi konfigurasi:

* Servlet
* Filter
* Listener
* Welcome Page : halaman yang dibuka kalau user tidak menyebutkan apa-apa, misalnya `http://aplikasi-saya.com/`
* Error Page : halaman error bila URL yang diminta tidak ada (404), user belum login (401), ijin akses tidak memadai (403), error aplikasi (500), dan sebagainya
* Session timeout : rentang waktu user tidak mengakses aplikasi hingga session-nya dinyatakan kadaluarsa

# Alur Eksekusi HTTP #

> Apa yang terjadi bila kita mengetik `http://localhost:8080/aplikasi-web-sederhana/halo.php?nama=endy` di browser?

1. Browser akan mengakses port 8080 di localhost, yaitu komputer kita sendiri.
2. Kita asumsikan bahwa Tomcat berjalan di port 8080, maka request ini akan diterima Tomcat
3. Tomcat akan mencari aplikasi bernama `aplikasi-web-sederhana`. Biasanya aplikasi ini ditandai dengan adanya folder `aplikasi-web-sederhana` dalam folder `<lokasi instalasi tomcat>/webapps`. Folder ini akan terbentuk bila kita mendeploy file bernama `aplikasi-web-sederhana.war` seperti telah dijelaskan di atas.
4. Tomcat akan mencari kode program yang bertanggung jawab menerima request `halo.php`. Biasanya penanggung jawab ini adalah servlet yang dideklarasikan dalam `aplikasi-web-sederhana/WEB-INF/web.xml`
5. Bila penanggung jawab tidak ditemukan, Tomcat akan mengembalikan kode error 404, artinya tidak ditemukan. Bila penanggung jawab ada, maka Tomcat akan memberikan data-data request kepada penanggung jawab ini untuk ditangani. Data request yang tersedia diantaranya adalah request parameter, HTTP header, dan request body
6. Servlet yang bertanggung jawab akan memproses request, kemudian menghasilkan response. Response dikirim ke browser yang mengaksesnya.

Sebagai ilustrasi, untuk menangani request `http://localhost:8080/aplikasi-web-sederhana/halo.php?nama=endy`, kita harus membuat deklarasi servlet di `web.xml` sebagai berikut:

```xml
<servlet>
    <servlet-name>halo</servlet-name>
    <servlet-class>com.muhardin.endy.training.web.HaloServlet</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>halo</servlet-name>
    <url-pattern>/halo.php</url-pattern>
</servlet-mapping>
```

Kemudian membuat class `HaloServlet` dalam package `com.muhardin.endy.training.web` yang isinya sebagai berikut

```java
public class HaloServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            String asal = request.getRemoteAddr();
            String nama = request.getParameter("nama");

            String output = "<html>";
            output += "<body>";
            output += "<h1>Halo "+nama+"</h1>";
            output += "<h2>Anda datang dari "+asal+"</h2>";
            output += "</body>";
            output += "</html>";

            // content type = html
            response.setContentType("text/html");
            response.getWriter().print(output);
        } catch (IOException ex) {
            Logger.getLogger(HaloServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
```

Pembaca yang teliti akan merasa heran

> Lho kok ekstensi requestnya `.php`?

Aplikasi web Java tidak peduli terhadap ekstensi request. Yang penting sesuai dengan mapping dalam `web.xml`. Jadi kita bisa pasang `halo.php`, `halo.jsp`, `halo.html`, `halo.asp`, bahkan `halo.halo`. Selama URL tersebut terdaftar dalam `web.xml`, maka request akan diproses dengan baik.

Source code lengkap bisa diakses [di sini](https://github.com/endymuhardin/materi-kuliah-java-web/tree/master/sample-code/sesi-01/aplikasi-web-sederhana)


# Komponen Aplikasi Web Java #

## Servlet ##

Digunakan untuk menerima HTTP request dan membuat HTTP response

Cara membuat: 

1. Buat class yang extends `HttpServlet`
2. Implement method sesuai HTTP method yang akan kita gunakan. 

    * GET -> doGet(HttpServletRequest req, HttpServletResponse res)
    * POST -> doPost(HttpServletRequest req, HttpServletResponse res)
    * dst

3. Buat mappingnya di `web.xml`
4. Compile dan deploy ke application server
5. Test browse ke `http://localhost:8080/aplikasi-web-sederhana/halo.php?nama=endy`


### HaloServlet.java ###

```java
public class HaloServlet extends HttpServlet {
    public void doGet(HttpServletRequest request, HttpServletResponse response) {
        try {
            String asal = request.getRemoteAddr();
            String nama = request.getParameter("nama");
                    
            String output = "<html>";
            output += "<body>";
            output += "<h1>Halo "+nama+"</h1>";
            output += "<h2>Anda datang dari "+asal+"</h2>";
            output += "</body>";
            output += "</html>";
            
            // content type = html
            response.setContentType("text/html");
            response.getWriter().print(output);
        } catch (IOException ex) {
            Logger.getLogger(HaloServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
```

### web.xml ###

```xml
<servlet>
    <servlet-name>halo</servlet-name>
    <servlet-class>com.muhardin.endy.training.web.HaloServlet</servlet-class>
</servlet>

<servlet-mapping>
    <servlet-name>halo</servlet-name>
    <url-pattern>/halo.php</url-pattern>
</servlet-mapping>
```

## Filter ##

Digunakan untuk : 

* mencegat HTTP request sebelum ditangani servlet
* mencegat HTTP response sebelum dikirim ke requester

Contoh penggunaan : 

* memproteksi URL yang membutuhkan login (Spring Security)
* mendekorasi HTML dengan header/footer/sidebar (Sitemesh)
* kompresi response

Contoh implementasi : 

### Java (kode program) ###

```java
public class HaloFilter implements Filter{

    public void init(FilterConfig fc) throws ServletException {
        System.out.println("Filter diinisialisasi");
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain fc) throws IOException, ServletException {
        System.out.println("Mencegat request");
        fc.doFilter(request, response);
        System.out.println("Mencegat response");
    }

    public void destroy() {
        System.out.println("Filter di-destroy");
    }
    
}
```

### web.xml (konfigurasi) ###

```xml
<filter>
    <filter-name>haloFilter</filter-name>
    <filter-class>com.muhardin.endy.training.web.HaloFilter</filter-class>
</filter>

<filter-mapping>
    <filter-name>haloFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

## Listener ##

Digunakan untuk merespon event dalam aplikasi, misalnya: 

* aplikasi distart / deploy (context created)
* aplikasi distop / undeploy (context destroyed)
* session dibuat
* session timeout
* session dihapus (invalidation)


Contoh implementasi:

### Java (kode program) ###

```java
public class HaloListener implements ServletContextListener, HttpSessionListener{

    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("Aplikasi start");
    }

    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("Aplikasi stop");
    }

    public void sessionCreated(HttpSessionEvent hse) {
        System.out.println("Ada session baru");
    }

    public void sessionDestroyed(HttpSessionEvent hse) {
        System.out.println("Session di-destroy");
    }
    
}
```

### web.xml (konfigurasi) ###

```xml
<listener>
    <listener-class>com.muhardin.endy.training.web.HaloListener</listener-class>
</listener>
```

Demikianlah konsep dasar aplikasi web di Java. Untuk bisa memahami, tentu kita harus sering berlatih membuat kode program, tidak hanya membaca tutorial saja. Contoh kode program lainnya bisa dilihat [di sini](https://github.com/endymuhardin/materi-kuliah-java-web/tree/master/sample-code). Silahkan dipraktekkan dan dilihat hasilnya.
