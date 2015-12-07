---
comments: true
date: 2011-02-01 13:21:35
layout: post
slug: project-setup-dengan-gradle
title: Project Setup dengan Gradle
categories:
- java
---

Project Setup dengan menggunakan Gradle dan Git

Hal pertama yang kita lakukan sebelum mulai bekerja tentunya adalah menyiapkan meja kerja dan peralatannya. Sama juga dengan mulai membuat aplikasi. Kita harus menyiapkan struktur folder, library dan framework, dan mengatur semuanya agar siap dikerjakan di meja kita, dalam hal ini IDE. 

Di ArtiVisi, biasanya ini dikerjakan oleh programmer senior, yaitu [Martinus](http://martinusadyh.web.id/) atau saya sendiri. Kegiatan project setup ini tidak terlalu tinggi frekuensinya, karena biasanya coding project yang existing jauh lebih sering daripada memulai project baru. 

Yang jarang dikerjakan biasanya cepat dilupakan. Inilah alasan utama saya menulis posting kali ini, sebagai pengingat buat diri sendiri. Selain itu, mudah-mudahan ada manfaatnya juga untuk para pembaca sekalian. 

Sebagai gambaran, tipikal aplikasi di ArtiVisi menggunakan [stack standar 2011](http://endy.artivisi.com/blog/java/development-stack-2011/). Jadi, project setup ini akan dibuat mengikuti stack standar tersebut. 



Pertama kali, kita buat dulu projectnya. Satu aplikasi biasanya kita pecah menjadi beberapa komponen, yaitu : 





  * Domain Model dan Service API : ini kita pisahkan untuk memudahkan distribusi ke aplikasi client. Perhatikan bahwa yang saya maksud client di sini bukanlah customer pembeli aplikasi, melainkan aplikasi di sisi hilir misalnya user interface yang dibuat dengan Swing. Di sisi client, tidak perlu ada detail implementasi. Cukup class-class domain seperti Produk, Kategori, dsb. Juga kita sediakan service interface, yaitu method yang bisa digunakan untuk menjalankan proses bisnis.


  * Implementasi Service : ini adalah implementasi dari service interface di atas. Implementasi biasanya hanya ada di sisi server. Jadi, jar yang dihasilkan project ini tidak kita distribusikan ke client


  * Konfigurasi : file konfigurasi seperti jdbc.properties, logback-test.xml, smtp.properties, dan setting-setting lain kita juga pisahkan ke project sendiri. Ini tujuannya untuk memudahkan deployment. Seperti kita tahu, biasanya ada beberapa environment seperti development di laptop programmer, testing server, dan production server. Dengan memisahkan konfigurasi, kita bisa menghindari mendeploy konfigurasi development ke server production. Yang perlu diperhatikan di sini, hibernate.cfg.xml dan applicationContext.xml bukanlah file konfigurasi. Itu adalah file aplikasi, walaupun bentuknya xml dan tidak perlu dikompilasi.


  * User Interface : kalau aplikasi desktop, ini hanya satu project saja. Atau mungkin dua dengan konfigurasinya. Tapi untuk web, biasanya kita pecah dua juga. Yang satu berisi source code java, satu lagi berisi aplikasi web. Dengan demikian, bila ada perubahan di controller, kita cukup deploy 1 jar, tidak perlu upload 1 war.



Sebagai ketentuan lain, biasanya nama package selalu kita awali dengan com.artivisi, dan struktur folder mengikuti standar Maven. 

Mari kita mulai, berikut rangkaian perintah di linux untuk membuat struktur awal project. 

```
mkdir -p project-contoh/com.artivisi.contoh.{config,domain,service.impl,ui.springmvc,ui.web}/src/{main,test}/{java,resources}
mkdir -p project-contoh/com.artivisi.contoh.ui.web/src/main/webapp/WEB-INF
```


Outputnya bisa kita lihat sebagai berikut 
    
    find . 
    .
    ./com.artivisi.contoh.service.impl
    ./com.artivisi.contoh.service.impl/src
    ./com.artivisi.contoh.service.impl/src/test
    ./com.artivisi.contoh.service.impl/src/test/java
    ./com.artivisi.contoh.service.impl/src/test/resources
    ./com.artivisi.contoh.service.impl/src/main
    ./com.artivisi.contoh.service.impl/src/main/java
    ./com.artivisi.contoh.service.impl/src/main/resources
    ./com.artivisi.contoh.domain
    ./com.artivisi.contoh.domain/src
    ./com.artivisi.contoh.domain/src/test
    ./com.artivisi.contoh.domain/src/test/java
    ./com.artivisi.contoh.domain/src/test/resources
    ./com.artivisi.contoh.domain/src/main
    ./com.artivisi.contoh.domain/src/main/java
    ./com.artivisi.contoh.domain/src/main/resources
    ./com.artivisi.contoh.ui.springmvc
    ./com.artivisi.contoh.ui.springmvc/src
    ./com.artivisi.contoh.ui.springmvc/src/test
    ./com.artivisi.contoh.ui.springmvc/src/test/java
    ./com.artivisi.contoh.ui.springmvc/src/test/resources
    ./com.artivisi.contoh.ui.springmvc/src/main
    ./com.artivisi.contoh.ui.springmvc/src/main/java
    ./com.artivisi.contoh.ui.springmvc/src/main/resources
    ./com.artivisi.contoh.config
    ./com.artivisi.contoh.config/src
    ./com.artivisi.contoh.config/src/test
    ./com.artivisi.contoh.config/src/test/java
    ./com.artivisi.contoh.config/src/test/resources
    ./com.artivisi.contoh.config/src/main
    ./com.artivisi.contoh.config/src/main/java
    ./com.artivisi.contoh.config/src/main/resources
    ./com.artivisi.contoh.ui.web
    ./com.artivisi.contoh.ui.web/src
    ./com.artivisi.contoh.ui.web/src/test
    ./com.artivisi.contoh.ui.web/src/test/java
    ./com.artivisi.contoh.ui.web/src/test/resources
    ./com.artivisi.contoh.ui.web/src/main
    ./com.artivisi.contoh.ui.web/src/main/java
    ./com.artivisi.contoh.ui.web/src/main/webapp/WEB-INF
    ./com.artivisi.contoh.ui.web/src/main/resources
    



Berikutnya, kita lengkapi dengan dependensi jar. Di ArtiVisi, kita menggunakan Gradle. 
Gradle meminta kita untuk mendaftarkan project yang terlibat dalam settings.gradle

```
include "com.artivisi.contoh.config"
include "com.artivisi.contoh.domain"
include "com.artivisi.contoh.service.impl"
include "com.artivisi.contoh.ui.springmvc"
include "com.artivisi.contoh.ui.web"
```

Dan ini build file Gradle.

```

springVersion = "3.0.5.RELEASE"
springSecurityVersion = "3.0.5.RELEASE"
slf4jVersion = "1.6.1"
logbackVersion = "0.9.27"
jodaTimeVersion = "1.6.2"
sourceCompatibility = 1.6
 
subprojects {
    apply plugin: 'java'
    apply plugin: 'eclipse'
 
    configurations {
        all*.exclude group: "commons-logging", module: "commons-logging"
    }
 
    repositories {
        mavenCentral()
    }
 
    dependencies {
        compile "org.slf4j:jcl-over-slf4j:$slf4jVersion",
                "org.slf4j:jul-to-slf4j:$slf4jVersion"
                
        runtime "joda-time:joda-time:$jodaTimeVersion"        
                
        runtime "ch.qos.logback:logback-classic:$logbackVersion"
  
        testCompile 'junit:junit:4.7'
    }
 
    group = 'com.artivisi.contoh'
    version = '1.0-SNAPSHOT'
    sourceCompatibility = 1.6
    
    task wrapper(type: Wrapper) {
        gradleVersion = '0.9.1'
        jarFile = 'wrapper/wrapper.jar'
    }
}

project('com.artivisi.contoh.domain') {
    dependencies { 
        compile "org.hibernate:hibernate-entitymanager:3.4.0.GA"
     
        compile "org.springframework:spring-tx:$springVersion",
                "org.springframework:spring-orm:$springVersion",
                "org.springframework:spring-jdbc:$springVersion"
                
     
    }
}

project('com.artivisi.contoh.service.impl') {
    dependencies { 
        compile project(':com.artivisi.contoh.domain')
        compile "org.hibernate:hibernate-entitymanager:3.4.0.GA"
     
        compile "org.springframework:spring-tx:$springVersion",
                "org.springframework:spring-orm:$springVersion",
                "org.springframework:spring-jdbc:$springVersion"
                
     
    }
}

project('com.artivisi.contoh.ui.springmvc') {
    dependencies {
        compile project(':com.artivisi.contoh.service.impl')
     
        compile "org.springframework:spring-webmvc:$springVersion",
                "org.springframework:spring-aop:$springVersion"
     
        compile "org.springframework.security:spring-security-web:$springSecurityVersion",
                "org.springframework.security:spring-security-config:$springSecurityVersion"
     
        compile "javax.validation:validation-api:1.0.0.GA",
                "org.hibernate:hibernate-validator:4.0.2.GA"
     
    }
}

project('com.artivisi.contoh.ui.web') {
    apply plugin: 'war'
    apply plugin: 'jetty'
     
    dependencies {
        compile project(':com.artivisi.contoh.ui.springmvc')
        runtime project(':com.artivisi.contoh.config')
      
        runtime "javax.servlet:jstl:1.1.2",
                "taglibs:standard:1.1.2",
                "opensymphony:sitemesh:2.4.2"
     
        providedCompile "javax.servlet:servlet-api:2.5"
    }
}
```

Build file ini sudah mendeskripsikan semua sub-projectnya. Sebetulnya kita bisa membuat buildfile di masing-masing project, tapi saya lebih suka terpusat seperti ini supaya terlihat keterkaitan antar project. 

Karena saya menggunakan Eclipse, saya menambahkan metadata supaya projectnya bisa dibuka di Eclipse. Ini bisa kita lakukan dengan cara menjalankan perintah 


    
    
    gradle eclipse
    



dalam masing-masing folder project. Tapi karena terlalu malas, saya gunakan satu baris perintah ini. 

```
for d in */; do cd "$d"; gradle eclipse; cd ..; done
```

Untung saja pakai linux, jadi bisa coding di command prompt :D 

Selanjutnya, kita bisa test dengan melakukan build di project paling hilir, yaitu ui.web


    
    
    cd com.artivisi.contoh.ui.web
    gradle war
    



Hasilnya ada di folder build/libs
Kita cek apakah semua dependensi sudah terpenuhi dengan perintah berikut. 


    
    
    jar tvf build/libs/com.artivisi.contoh.ui.web-1.0-SNAPSHOT.war
    



Ini juga bisa langsung dijalankan dengan plugin Jetty yang ada dalam Gradle. 


    
    
    cd com.artivisi.contoh.ui.web
    gradle jetty
    



Outputnya bisa kita lihat di browser, dengan port 8080. 
![ ](/images/uploads/2011/01/jetty-run-300x216.png)

Di situ ada link menuju aplikasi kita. Silahkan diklik. 
![ ](/images/uploads/2011/01/klik-context-path-300x214.png)

Folder WEB-INF masih terlihat, karena kita belum membuat web.xml. Berikut isi web.xml, masukkan dalam folder com.artivisi.contoh.ui.web/src/main/webapp/WEB-INF

```xml

<?xml version="1.0" encoding="UTF-8"?>
<web-app version="2.5" xmlns="http://java.sun.com/xml/ns/javaee"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">

	<!-- Reads request input using UTF-8 encoding -->
	<filter>
		<filter-name>characterEncodingFilter</filter-name>
		<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
		<init-param>
			<param-name>encoding</param-name>
			<param-value>UTF-8</param-value>
		</init-param>
		<init-param>
			<param-name>forceEncoding</param-name>
			<param-value>true</param-value>
		</init-param>
	</filter>

	<filter-mapping>
		<filter-name>characterEncodingFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	
	<!-- Handles all requests into the application -->
	<servlet>
		<servlet-name>Spring MVC Dispatcher Servlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>
				/WEB-INF/springmvc-context.xml
			</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>

	<servlet-mapping>
		<servlet-name>Spring MVC Dispatcher Servlet</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>

</web-app>
```

Sekalian saja kita konfigurasi Spring MVC. Pasang file springmvc-context.xml ini di sebelahnya web.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	xsi:schemaLocation="http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">

	<!-- Scans the classpath of this application for @Components to deploy as beans -->
	<context:component-scan base-package="com.artivisi.contoh.ui.web" />

	<!-- Configures the @Controller programming model -->
	<mvc:annotation-driven />
	
	<!-- mengganti default servletnya Tomcat dan Jetty -->
	<!-- ini diperlukan kalau kita mapping DispatcherServlet ke / -->
	<!-- sehingga tetap bisa mengakses folder selain WEB-INF, misalnya img, css, js -->
	<mvc:default-servlet-handler/>

	<!-- Handles HTTP GET requests for /resources/** by efficiently serving up static resources in the ${webappRoot}/resources/ directory -->
	<mvc:resources mapping="/resources/**" location="/resources/" />

	<!-- Application Message Bundle -->
	<bean id="messageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
		<property name="basename" value="/WEB-INF/messages/messages" />
		<property name="cacheSeconds" value="0" />
	</bean>

	<!-- Resolves view names to protected .jsp resources within the /WEB-INF/views directory -->
	<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="prefix" value="/WEB-INF/templates/jsp/"/>
		<property name="suffix" value=".jsp"/>
	</bean>
	
	<!-- Forwards requests to the "/" resource to the "hello" view -->
	<mvc:view-controller path="/" view-name="hello"/>

</beans>
```

Kita cek juga apakah projectnya sudah bisa dibuka di Eclipse. Mari kita import. 

Pertama, arahkan workspace ke folder project-contoh. 
![ ](/images/uploads/2011/01/01-pilih-workspace-300x154.png)

Setelah Eclipse terbuka, kita pilih menu Import Project, untuk membuka 4 project yang tadi sudah kita buat. 
![ ](/images/uploads/2011/01/02-import-existing-300x272.png)

Pilih folder induknya. 
![ ](/images/uploads/2011/01/03-select-root-directory-272x300.png)

Selesai, semua project kita bisa dibuka. Bahkan kita bisa menjalankan project ui.web dengan cara klik kanan Run in Server. Ini bisa dilihat dari icon project tersebut yang berbentuk bola dunia. 

![ ](/images/uploads/2011/01/04-import-result-300x139.png)

Selesai sudah, mari kita [share dengan rekan yang lain](http://endy.artivisi.com/blog/aplikasi/sharing-repository-git/). 

