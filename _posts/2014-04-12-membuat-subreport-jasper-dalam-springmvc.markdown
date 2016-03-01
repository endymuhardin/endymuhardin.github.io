---
layout: post
title: "Membuat subreport Jasper dalam SpringMVC"
date: 2014-04-12 12:26
comments: true
categories: 
- java
---

Pada artikel ini, kita akan membuat implementasi download file PDF/XLS dari aplikasi web. Fitur ini akan kita implementasi menggunakan library [Jasper Report](http://community.jaspersoft.com/project/jasperreports-library) dan framework [Spring MVC](http://docs.spring.io/spring/docs/4.0.2.RELEASE/spring-framework-reference/html/view.html#view-jasper-reports).

Projectnya akan kita buat menggunakan Maven, supaya bisa dibuka dengan baik (portable) di berbagai IDE. Untuk bisa memahami artikel ini dengan baik, pembaca harus sudah paham tentang Spring Framework dan Spring MVC. Yang belum paham Spring Framework bisa membaca [artikel terdahulu tentang Dependency Injection](http://software.endy.muhardin.com/java/memahami-dependency-injection/). Sedangkan pembahasan tentang Spring MVC bisa dibaca di [rangkaian artikel berseri tentang membuat aplikasi web dengan Spring MVC](https://www.google.com/search?q=site%3Asoftware.endy.muhardin.com&q=aplikasi+web+dengan+spring).

Source code lengkap dapat diakses di [repository Github](https://github.com/endymuhardin/belajar-springmvc-jasperreports). Bagi yang ingin tahu urutan langkah-langkah implementasinya, bisa lihat [commit history](https://github.com/endymuhardin/belajar-springmvc-jasperreports/commits/master).

<!--more-->


## Setup Project ##

Pertama, kita setup dulu projectnya menggunakan Maven Archetype dengan perintah berikut

```
mvn archetype:create -DgroupId=com.muhardin.endy.belajar -DartifactId=belajar-springmvc-jasper
```

Kemudian konversi menjadi aplikasi web dengan cara:

* edit `pom.xml`, ganti `<packaging>jar</packaging>` menjadi `<packaging>war</packaging>`
* tambahkan file `src/main/webapp/WEB-INF/web.xml`
* ini langkah opsional, tambahkan `src/main/webapp/index.html` supaya ada halaman Hello World

Kondisi project pada tahap ini bisa dilihat di [commit 1fa6134d10](https://github.com/endymuhardin/belajar-springmvc-jasperreports/tree/1fa6134d10b2816b40367d1fc2cc4302ddcb9a02)

Setelah selesai di tahap ini, kita bisa buka projectnya menggunakan Netbeans atau Eclipse.

## Aktivasi Spring MVC ##

Mulai dari yang mudah dulu, kita buat controller yang menampilkan Hello World dengan Spring MVC. Ini sekedar memastikan bahwa konfigurasi Spring MVC kita sudah benar, sehingga pada waktu implementasi Jasper Report nanti kita tidak perlu lagi memusingkan error Spring MVC.

Tambahkan dependensi Spring MVC di `pom.xml`

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>${org.springframework.version}</version>
</dependency>
```

Saya menggunakan Maven properties untuk mendeklarasikan versi library. Ini akan memudahkan kalau di kemudian hari kita ingin mengupgrade versinya.

```xml
<properties>
    <org.springframework.version>4.0.2.RELEASE</org.springframework.version>
</properties>
```

Agar bisa memproses file JSP, kita tambahkan juga library `jstl`.

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>
    <version>${jstl.version}</version>
    <scope>runtime</scope>
</dependency>
```

Selanjutnya, deklarasikan `DispatcherServlet` milik Spring di `web.xml`

```xml
<servlet>
    <servlet-name>belajar</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>belajar</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

Kita harus membuat file konfigurasi sesuai dengan nama servlet. Karena namanya `belajar`, maka file yang harus dibuat adalah `belajar-servlet.xml`. Isinya tidak banyak, seperti ini:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <mvc:annotation-driven/>
    <mvc:default-servlet-handler />

    <context:component-scan base-package="com.muhardin.endy.belajar.springmvcjasper.controller" />
    
    <bean id="jstlViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        <property name="prefix" value="/WEB-INF/templates/jsp/"/>
        <property name="suffix" value=".jsp"/>
    </bean>
    
</beans>
```

Sediakan file `halo.jsp` dalam folder `WEB-INF/templates/jsp`. Isinya tidak saya pasang di sini, silahkan lihat sendiri [di Github](https://github.com/endymuhardin/belajar-springmvc-jasperreports/blob/5e5eed120ab0a58e91a5c130fa2957b82acfebb0/src/main/webapp/WEB-INF/templates/jsp/halo.jsp).

Buat controller dalam package `com.muhardin.endy.belajar.springmvcjasper.controller`, sesuai konfigurasi dalam `belajar-servlet.xml`. Isi file bisa dilihat [di Github](https://github.com/endymuhardin/belajar-springmvc-jasperreports/blob/5e5eed120ab0a58e91a5c130fa2957b82acfebb0/src/main/java/com/muhardin/endy/belajar/springmvcjasper/controller/HaloController.java).

Pada tahap ini, kita bisa menjalankan aplikasinya dengan perintah `mvn clean package tomcat:run` dan browse ke `http://localhost:8080/belajar-springmvc-jasper/halo`

Kondisi folder project pada tahap ini bisa dilihat [di sini](https://github.com/endymuhardin/belajar-springmvc-jasperreports/tree/5e5eed120ab0a58e91a5c130fa2957b82acfebb0).

## Aktivasi Jasper Report ##

Kita harus membuat dulu template reportnya. Gunakan [iReport](http://community.jaspersoft.com/project/ireport-designer) untuk mendesain template secara visual, supaya lebih mudah. Berikut screenshot report yang saya buat

[![Foto](https://lh4.googleusercontent.com/-j44Qm1BUa70/U0jWOO7SwOI/AAAAAAAAFlM/vReeJlxCI3E/w916-h574-no/01-report-induk.png)](https://lh4.googleusercontent.com/-j44Qm1BUa70/U0jWOO7SwOI/AAAAAAAAFlM/vReeJlxCI3E/w916-h574-no/01-report-induk.png)

Semua template Jasper Report kita simpan dalam folder `src/main/webapp/WEB-INF/templates/jrxml`.

Agar bisa memproses template report tersebut, kita tambahkan dulu library Jasper Report di `pom.xml`

```xml
<dependency>
    <groupId>net.sf.jasperreports</groupId>
    <artifactId>jasperreports</artifactId>
    <version>${jasperreports.version}</version>
    <scope>runtime</scope>
</dependency>
```

Cukup gunakan scope `runtime` karena kita tidak perlu import class Jasper di kode program kita. Tambahkan juga dependensi `javax.servlet.http` supaya kita bisa menggunakan class `HttpServletRequest` nantinya. Scopenya kita gunakan `provided`, karena sudah disediakan dalam application server (misal: Tomcat).

```xml
<dependency>
    <groupId>javax</groupId>
    <artifactId>javaee-web-api</artifactId>
    <version>7.0</version>
    <scope>provided</scope>
</dependency>
```

Selanjutnya, kita tinggal isi data yang akan ditampilkan dalam dokumen PDF/XLS. Ini kita lakukan di kode program Java dalam class `HaloController`. Berikut methodnya

```java
@RequestMapping(value = "/anggota/export*", method = RequestMethod.GET)
public ModelMap exportDataAnggota(HttpServletRequest request) {
    String uri = request.getRequestURI();
    String format = uri.substring(uri.lastIndexOf(".") + 1);

    return new ModelMap()
            .addAttribute("format", format)
            .addAttribute("tanggal", new Date())
            .addAttribute("dataSource", service.semuaAnggota());
}
```

Pada kode program di atas, pertama kita ambil dulu akhiran di URL yang diakses user. Contohnya, bila user mengakses `http://localhost:8080/belajar-springmvc-jasper/anggota/export.pdf`, maka variabel `format` akan berisi `pdf`. Variabel `format` ini akan digunakan Spring untuk menentukan jenis outputnya, apakah PDF, XLS, CSV, dsb.

Kita isi variabel apapun yang kita butuhkan dalam report. Pada contoh di atas, kita kirim dua variabel yaitu `tanggal` dan `dataSource`. Variabel `tanggal` akan menjadi parameter dalam Jasper Report, sedangkan `dataSource` akan menjadi sumber data yang akan ditampilkan dalam _band_ `detail`. Untuk lebih jelasnya, silahkan [buka file templatenya](https://github.com/endymuhardin/belajar-springmvc-jasperreports/blob/17dd0806ccf41d5edbcf646aa50458cfbd130d8f/src/main/webapp/WEB-INF/templates/jrxml/daftar-anggota.jrxml) dengan menggunakan iReport.

Selanjutnya, kita konfigurasi Spring agar request ke url `http://localhost:8080/belajar-springmvc-jasper/anggota/export.pdf` diteruskan ke Jasper Report. Kita buat deklarasi resolver untuk Jasper Report dalam `belajar-servlet.xml` sebagai berikut

```xml
<bean id="jasperViewResolver" class="org.springframework.web.servlet.view.XmlViewResolver">
    <property name="location" value="classpath:jasper-views.xml"/>
    <property name="order" value="0"/>
</bean>
```

Tambahkan juga property `order` di konfigurasi JSP supaya dia dijalankan setelah Jasper Report. 

```xml
<bean id="jstlViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
    <property name="prefix" value="/WEB-INF/templates/jsp/"/>
    <property name="suffix" value=".jsp"/>
    <property name="order" value="1"/>
</bean>
```

Ini kita lakukan karena resolver JSP tidak bisa mengecek apakah templatenya ditemukan atau tidak. Dia akan langsung mengeluarkan pesan error. Dengan resolver Jasper dieksekusi duluan, maka flownya akan seperti ini:

1. Dari controller terima nama view `/anggota/export.pdf`
2. Cari view dengan nama tersebut dalam `jasperViewResolver`
3. Kalau tidak ketemu lanjutkan cari dalam `jstlViewResolver`
4. Kalau tidak ketemu juga, keluarkan pesan error

Kondisi folder project pada tahap ini bisa dilihat [di sini](https://github.com/endymuhardin/belajar-springmvc-jasperreports/tree/bce02983b044e80a97db7dc95689b643afbdea8a)

Pada tahap ini kita sudah bisa menghasilkan file PDF ataupun XLS menggunakan Jasper Report dan Spring MVC. Tentunya pada aplikasi sebenarnya data diambil dari database. Tapi untuk menyederhanakan masalah agar kita bisa fokus ke konfigurasi Jasper dan Spring, maka data yang ditampilkan kita hardcode saja.

Selanjutnya, kita akan mencoba konfigurasi yang lebih sulit, yaitu sub report.

## Sub Report ##

Subreport adalah report di dalam report. Ini adalah fitur canggih dari Jasper Report. Kita tidak akan membahas detail tentang apa itu subreport. Silahkan baca artikel [ini](http://www.richardnichols.net/2010/02/simple-guide-to-sub-reports-in-jasperreports-ireport/) dan [ini](http://bytecoded.blogspot.com/2009/12/jasperreports-370demosamplessubreport.html) untuk memahami apa itu subreport.

Satu report induk bisa menampung banyak subreport. Masing-masing subreport memiliki template dan `dataSource` sendiri. Untuk itu, kita perlu memberitahukan pada semua pihak tentang lokasi / nama file template subreport dan nama variabel `dataSource` yang digunakan di subreport.

Kita mulai dari desain template induk terlebih dulu. Ini kita lakukan di iReport. Drag and drop icon subreport di Palette ke template. iReport akan menampilkan wizard untuk membantu kita. 

[![Foto](https://lh5.googleusercontent.com/-gqIBrrd0qeg/U0jWNjg4bSI/AAAAAAAAFk4/XzTxNcCIyOU/w667-h435-no/02-membuat-subreport.png)](https://lh5.googleusercontent.com/-gqIBrrd0qeg/U0jWNjg4bSI/AAAAAAAAFk4/XzTxNcCIyOU/w667-h435-no/02-membuat-subreport.png)

Saya lebih suka membuat templatenya secara terpisah, kemudian menyatukannya secara manual. Oleh karena itu, kita pilih _Just create subreport element_.

Hasilnya sebagai berikut.

[![Foto](https://lh5.googleusercontent.com/-3ig57Gmr68A/U0jWOcc-8hI/AAAAAAAAFlI/49LtLA6TDFk/w916-h574-no/03-layout-subreport.png)](https://lh5.googleusercontent.com/-3ig57Gmr68A/U0jWOcc-8hI/AAAAAAAAFlI/49LtLA6TDFk/w916-h574-no/03-layout-subreport.png)

Sebetulnya di dokumentasi Spring MVC ada penjelasan tentang cara menggunakan subreport. 

[![Foto](https://lh6.googleusercontent.com/-j7vN6jiyKIs/U0jWOktav7I/AAAAAAAAFlU/Qs8BbyjvYro/w917-h478-no/04-docs-springmvc-jasper-subreport.png)](https://lh6.googleusercontent.com/-j7vN6jiyKIs/U0jWOktav7I/AAAAAAAAFlU/Qs8BbyjvYro/w917-h478-no/04-docs-springmvc-jasper-subreport.png)

Tapi sayangnya, isinya tidak nyambung sama penjelasan di atasnya. Penjelasan report sederhana dibuat menggunakan konfigurasi file properties, sedangkan penjelasan subreport dibuat menggunakan konfigurasi file XML. Perbedaannya bisa dilihat [di sini](https://github.com/endymuhardin/belajar-springmvc-jasperreports/commit/bce02983b044e80a97db7dc95689b643afbdea8a) atau pada gambar di bawah.

[![Foto](https://lh4.googleusercontent.com/-7xWAHJ6UnL0/U0jdR--3THI/AAAAAAAAFmI/1ZiMYLibtpM/w916-h617-no/09-properties-vs-xml.png)](https://lh4.googleusercontent.com/-7xWAHJ6UnL0/U0jdR--3THI/AAAAAAAAFmI/1ZiMYLibtpM/w916-h617-no/09-properties-vs-xml.png)

Selanjutnya, kita tambahkan parameter di desain report induk kita. Bisa menggunakan GUI ataupun langsung edit XMLnya. Kali ini saya pakai XML saja supaya bisa copy-paste

[![Foto](https://lh3.googleusercontent.com/-hCvlDw6HmAE/U0jWPcwj3iI/AAAAAAAAFlc/njZlxs_0lNI/w834-h383-no/05-subreport-params.png)](https://lh3.googleusercontent.com/-hCvlDw6HmAE/U0jWPcwj3iI/AAAAAAAAFlc/njZlxs_0lNI/w834-h383-no/05-subreport-params.png)

Kita tambahkan dua parameter, yaitu `SubReportKantor` dan `dataSourceSubreport`. Kedua parameter ini kita gunakan pada deklarasi subreport yang sudah ditambahkan iReport pada waktu kita drag and drop tadi.

[![Foto](https://lh3.googleusercontent.com/-zqWFEblHxvo/U0jWPXhcBVI/AAAAAAAAFlk/r5q5WZw3BlI/w917-h265-no/06-subreport-declaration.png)](https://lh3.googleusercontent.com/-zqWFEblHxvo/U0jWPXhcBVI/AAAAAAAAFlk/r5q5WZw3BlI/w917-h265-no/06-subreport-declaration.png)

Perhatikan label `X` dan `Y`. Itu akan kita gunakan pada konfigurasi lainnya.

Nama variabel `dataSourceSubreport` yang ditandai dengan label `X` kita gunakan untuk menyuplai data yang dibutuhkan subreport dari dalam kode program Java.

[![Foto](https://lh3.googleusercontent.com/-FE5T4GfnzBE/U0jWPTUvL7I/AAAAAAAAFlo/Rl8SG7IZjkI/w672-h217-no/07-spring-controller.png)](https://lh3.googleusercontent.com/-FE5T4GfnzBE/U0jWPTUvL7I/AAAAAAAAFlo/Rl8SG7IZjkI/w672-h217-no/07-spring-controller.png)

Selanjutnya kita edit konfigurasi Jasper Report di file `jasper-views.xml`. Tambahkan lokasi template subreport dan nama variabel yang digunakan untuk `dataSource`nya.

[![Foto](https://lh6.googleusercontent.com/-qBxNAJ_nqsU/U0jWQwV3gAI/AAAAAAAAFlw/cqnz8eiWWd0/w917-h285-no/08-konfigurasi-jasperview.png)](https://lh6.googleusercontent.com/-qBxNAJ_nqsU/U0jWQwV3gAI/AAAAAAAAFlw/cqnz8eiWWd0/w917-h285-no/08-konfigurasi-jasperview.png)

Selesai sudah. Silahkan coba akses lagi `http://localhost:8080/belajar-springmvc-jasper/anggota/export.pdf` untuk melihat hasil akhirnya.

[![Foto](https://lh6.googleusercontent.com/-8-GCJgtp70I/U0jgW78hxnI/AAAAAAAAFmY/2jJIFCNeB6g/w917-h485-no/10-final-result.png)](https://lh6.googleusercontent.com/-8-GCJgtp70I/U0jgW78hxnI/AAAAAAAAFmY/2jJIFCNeB6g/w917-h485-no/10-final-result.png)

## FAQ ##

Pada umumnya, kita semua menggunakan konfigurasi Jasper yang berbasis file properties, karena itulah yang dicontohkan di dokumentasi Spring Framework. Pada waktu muncul kebutuhan subreport, ternyata file konfigurasinya XML.

> Apakah saya harus konversi semua konfigurasi properties menjadi XML ??

Jangan khawatir. Kita bisa menggunakan dua-duanya sekaligus. Tidak perlu pilih salah satu. Konfigurasi report yang lama tidak perlu dibuang/ditulis ulang menjadi xml. Cukup deklarasikan dua `view resolver`, yang satu properties, satu lagi XML. Begini contohnya

```xml
<bean id="propertiesJasperViewResolver" class="org.springframework.web.servlet.view.ResourceBundleViewResolver">
	<property name="basename" value="views"/>
	<property name="order" value="0"/>
</bean>

<bean id="xmlJasperViewResolver" class="org.springframework.web.servlet.view.XmlViewResolver">
    <property name="location" value="classpath:jasper-views.xml"/>
    <property name="order" value="1"/>
</bean>

<bean id="jstlViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
    <property name="prefix" value="/WEB-INF/templates/jsp/"/>
    <property name="suffix" value=".jsp"/>
    <property name="order" value="2"/>
</bean>
```

Dengan cara di atas, berikut flow Spring MVC dalam mencari template yang sesuai:

1. Dari controller terima nama view `/anggota/export.pdf`
2. Cari view dengan nama tersebut dalam `propertiesJasperViewResolver`
3. Kalau tidak ketemu lanjutkan cari dalam `xmlJasperViewResolver`
4. Kalau masih tidak ketemu juga lanjutkan cari dalam `jstlViewResolver`
5. Kalau tidak ketemu juga, keluarkan pesan error 

Demikian penjelasan tentang integrasi Spring MVC dan Jasper Report. Source code lengkap bisa diambil [di Github](https://github.com/endymuhardin/belajar-springmvc-jasperreports/)

Semoga bermanfaat
