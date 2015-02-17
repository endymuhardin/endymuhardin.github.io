---
comments: true
date: 2009-07-15 12:38:18
layout: post
slug: log4j-spring-mvc
title: Konfigurasi lokasi logfile pada Spring MVC
wordpress_id: 492
categories:
- java
---

Di mana kita harus menyimpan log output aplikasi kita? Tentunya kita ingin menggunakan lokasi yang dinamis sesuai dengan lokasi deployment. Misalnya, di Windows kita mungkin mendeploy aplikasi kita di 

    
    
    C:\Program Files\Apache Tomcat\webapps\aplikasi-saya
    



Sedangkan di Linux, kita mendeploy aplikasi di 

    
    
    /opt/apache-tomcat/webapps/aplikasi-saya
    



Dengan kemungkinan seperti di atas, bagaimana kita harus menulis konfigurasi log4j?
Mudah, bila kita menggunakan Spring MVC.



Kita bisa menggunakan `Log4jConfigListener` yang disediakan Spring. Class ini memungkinkan kita menggunakan variabel di konfigurasi log4j kita. Kita mendaftarkan class ini di dalam `web.xml`, sebelum `ContextLoaderListener`, seperti ini : 


    
    
        <listener>
            <listener-class>org.springframework.web.util.Log4jConfigListener</listener-class>
        </listener>
    
        <listener>
            <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
        </listener>
    



Dengan adanya `Log4jConfigListener` ini, kita bisa menyebutkan lokasi konfigurasi log4j seperti ini : 


    
    
        <context-param>
            <param-name>log4jConfigLocation</param-name>
            <param-value>classpath:artivisi-log4j.properties</param-value>
        </context-param>
    



Isi `artivisi-log4j.properties` terlihat seperti ini : 


    
    
    # Konfigurasi kategori
    log4j.rootLogger=INFO,fileout
    
    # File output
    log4j.appender.fileout=org.apache.log4j.DailyRollingFileAppender
    log4j.appender.fileout.file=${webapp.root.path}/WEB-INF/logs/application.log
    log4j.appender.fileout.datePattern='.'yyyy-MM-dd
    log4j.appender.fileout.layout=org.apache.log4j.PatternLayout
    log4j.appender.fileout.layout.conversionPattern=%d [%t] %p (%F:%L) ­ %m%n
    



Perhatikan konfigurasi `log4j.appender.fileout.file`. Kita menggunakan variabel `${webapp.root.path}` yang akan diisi dengan nilai lokasi deployment aplikasi web kita. Variabel `${webapp.root.path}` ini didefinisikan dalam web.xml sebagai berikut : 


    
    
        <context-param>
            <param-name>webAppRootKey</param-name>
            <param-value>webapp.root.path</param-value>
        </context-param>
    



Dengan konfigurasi ini, kita dapat meletakkan log output kita di 

    
    
    C:\Program Files\Apache Tomcat\webapps\aplikasi-saya\WEB-INF\logs\application.log
    


bila kita mendeploy di Windows, dan di 

    
    
    /opt/apache-tomcat/webapps/aplikasi-saya/WEB-INF/logs/application.log
    


bila kita deploy di Linux. 

Konfigurasi di atas bisa disederhanakan lagi bila kita mengikuti nilai default yang disediakan Spring, yaitu cukup seperti ini dalam `web.xml` : 


    
    
        <listener>
            <listener-class>org.springframework.web.util.Log4jConfigListener</listener-class>
        </listener>
    
        <listener>
            <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
        </listener>
    



Kemudian memberi nama file konfigurasi logger kita `log4j.properties` yang berada di top level dalam classpath, dan berisi seperti ini : 


    
    
    # Konfigurasi kategori
    log4j.rootLogger=INFO,fileout
    
    # File output
    log4j.appender.fileout=org.apache.log4j.DailyRollingFileAppender
    log4j.appender.fileout.file=${webapp.root}/WEB-INF/logs/application.log
    log4j.appender.fileout.datePattern='.'yyyy-MM-dd
    log4j.appender.fileout.layout=org.apache.log4j.PatternLayout
    log4j.appender.fileout.layout.conversionPattern=%d [%t] %p (%F:%L) ­ %m%n
    



Nilai variabel `${webapp.root}` secara default akan diisi dengan lokasi deployment tanpa harus mengkonfigurasi `webAppRootKey`
