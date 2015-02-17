---
comments: true
date: 2009-07-03 14:41:28
layout: post
slug: spring-httpinvoker-sun-jre6-httpserver
title: Menjalankan Spring HTTP Invoker di Sun JRE 6 HTTP Server
wordpress_id: 485
categories:
- java
---

Dulu, kita sudah mencoba untuk [membuat remoting service dengan menggunakan Spring Framework](http://endy.artivisi.com/blog/java/remoting-dengan-spring/). Salah satu protokol yang digunakan adalah Spring HTTP Invoker. Untuk mempublish service dengan protokol ini, kita harus menggunakan servlet engine, misalnya Tomcat. 

Akan tetapi, Sun Microsystem merilis Java versi 6 yang sudah dilengkapi dengan HTTP Server sederhana. Dengan memanfaatkan fitur ini, kita tidak perlu lagi menggunakan Tomcat hanya untuk mempublish service dengan HTTP Invoker. Ini akan sangat bermanfaat untuk aplikasi kecil yang ingin dipanggil oleh aplikasi lain. 

Pada artikel ini, kita akan mempublish service dengan protokol HTTP Invoker pada HTTP Server yang disediakan oleh Sun JRE versi 6. 


Di Netbeans, kita akan membuat tiga project, yaitu 




  * remoting-shared : project ini menampung interface RemotingService, yang akan digunakan di client dan server


  * remoting-server : project ini yang akan mempublish service. Implementasi RemotingService juga ada di sini


  * remoting-client : project ini yang akan mengakses service yang dipublish remoting-server



Berikut screenshot Netbeans. Project remoting-server dan remoting-client memiliki dependensi terhadap remoting-shared.

Pertama, mari kita lihat dulu service interfacenya. Berikut adalah kode programnya. 


    
    
    package com.artivisi.tutorial.remoting.spring.service.api;
    
    public interface RemotingService {
        public String halo(String nama);
    }
    



Kode program ini berada di project remoting-shared.

Berikutnya, kita lihat dulu di sisi client. Kita cuma butuh satu class untuk menjalankan aplikasi, yaitu ClientLauncher sebagai berikut.


    
    
    package com.artivisi.tutorial.remoting.spring.client;
    
    public class ClientLauncher {
        private static final Logger log = Logger.getLogger(ClientLauncher.class.getName());
        public static void main(String[] args) {
            AbstractApplicationContext ctx = 
                    new ClassPathXmlApplicationContext("client-ctx.xml", ClientLauncher.class);
            ctx.registerShutdownHook();
    
            RemotingService service = (RemotingService) ctx.getBean("remotingService");
    
            String msg = service.halo("endy");
    
            log.info("Pesan dari server : "+msg);
        }
    }
    



ClientLauncher akan membaca client-ctx.xml yang isinya seperti ini. 


    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans-2.5.xsd">
    
        <!--  proxy dengan protokol HTTP Invoker  -->
        <bean id="remotingService"
        class="org.springframework.remoting.httpinvoker.HttpInvokerProxyFactoryBean">
             <property name="serviceUrl" 
             value="http://localhost:9090/RemotingService"/>
    
             <property name="serviceInterface"
             value="com.artivisi.tutorial.remoting.spring.service.api.RemotingService"/>
        </bean>
    </beans>
    



Seperti kita lihat di atas, client mengakses service yang ada di komputer lokal (localhost) di port 9090, dengan nama service RemotingService. 


Selanjutnya, mari kita implement project remoting-server. Di sini ada implementasi RemotingService sebagai berikut


    
    
    /*
     * To change this template, choose Tools | Templates
     * and open the template in the editor.
     */
    
    package com.artivisi.tutorial.remoting.spring.service.impl;
    
    @Service("remotingService")
    public class RemotingServiceImpl implements RemotingService {
        Logger log = Logger.getLogger(RemotingServiceImpl.class.getName());
        
        public String halo(String nama) {
            log.info("Terima dari client : "+nama);
            return "Halo, "+nama;
        }
    
    }
    



Kemudian ada class untuk menjalankan aplikasi di sisi server. Berikut ServerLauncher. 


    
    
    
    package com.artivisi.tutorial.remoting.spring.server;
    
    public class ServerLauncher {
        public static void main(String[] args) {
            AbstractApplicationContext ctx =
                    new ClassPathXmlApplicationContext("server-ctx.xml", ServerLauncher.class);
            ctx.registerShutdownHook();
        }
    }
    



ServerLauncher membaca file konfigurasi server-ctx.xml. Inilah isinya. 


    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:p="http://www.springframework.org/schema/p"
           xmlns:context="http://www.springframework.org/schema/context"
           xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans-2.5.xsd
           http://www.springframework.org/schema/context
           http://www.springframework.org/schema/context/spring-context-2.5.xsd">
    
        <!-- menginstankan Sun HttpServer dalam JRE 6 -->
        <bean class="org.springframework.remoting.support.SimpleHttpServerFactoryBean">
        	<property name="contexts">
        		<map>
        			<entry key="/RemotingService" value-ref="remotingServiceHttpInvoker"/>
        		</map>
        	</property>
            <property name="port" value="9090" />
        </bean>
    
    </beans>
    




Pada blok konfigurasi pertama, kita menginstankan Sun HttpServer yang ada di JRE 6. HttpServer ini akan berjalan di port 9090, sesuai dengan yang kita konfigurasi di sisi client. Di sana terlihat bahwa URL /RemotingService akan ditangani oleh remotingServiceHttpInvoker. Berikut konfigurasinya


    
    
        <!--  publish service dengan protokol HttpInvoker  -->
        <bean id="remotingServiceHttpInvoker" 
              class="org.springframework.remoting.httpinvoker.SimpleHttpInvokerServiceExporter"
              p:service-ref="remotingService"
              p:serviceInterface="com.artivisi.tutorial.remoting.spring.service.api.RemotingService"
         />
    



Selanjutnya, kita suruh Spring mendeteksi implementasi service kita secara otomatis, yaitu class yang ada anotasi @Service. 

    
    
         <context:component-scan base-package="com.artivisi"/>
    



Berikut adalah dependensi pustaka di project client. 

![Library untuk Project Client ](/images/uploads/2009/07/remoting-library-client-300x220.png)

Dan ini untuk di server. 

![Library untuk Project Server ](/images/uploads/2009/07/remoting-library-server-300x234.png)

Keseluruhan project akan terlihat seperti ini. 

![Struktur Folder semua Project ](/images/uploads/2009/07/remoting-folder-structure-231x300.png)

Semua library dapat diambil dari [distribusi Spring Framework](http://www.springsource.org/download) dan [Repository SpringSource](http://www.springsource.com/repository/app/).

Coba jalankan ServerLauncher, kita akan melihat log seperti ini. 


    
    
    Jul 3, 2009 2:57:25 PM org.springframework.context.support.AbstractApplicationContext prepareRefresh
    INFO: Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@be2358: display name [org.springframework.context.support.ClassPathXmlApplicationContext@be2358]; startup date [Fri Jul 03 14:57:25 WIT 2009]; root of context hierarchy
    Jul 3, 2009 2:57:26 PM org.springframework.beans.factory.xml.XmlBeanDefinitionReader loadBeanDefinitions
    INFO: Loading XML bean definitions from class path resource [server-ctx.xml]
    Jul 3, 2009 2:57:26 PM org.springframework.context.support.AbstractApplicationContext obtainFreshBeanFactory
    INFO: Bean factory for application context [org.springframework.context.support.ClassPathXmlApplicationContext@be2358]: org.springframework.beans.factory.support.DefaultListableBeanFactory@f11404
    Jul 3, 2009 2:57:26 PM org.springframework.beans.factory.support.DefaultListableBeanFactory preInstantiateSingletons
    INFO: Pre-instantiating singletons in org.springframework.beans.factory.support.DefaultListableBeanFactory@f11404: defining beans [org.springframework.remoting.support.SimpleHttpServerFactoryBean#0,remotingServiceHttpInvoker,remotingService,org.springframework.context.annotation.internalCommonAnnotationProcessor,org.springframework.context.annotation.internalAutowiredAnnotationProcessor,org.springframework.context.annotation.internalRequiredAnnotationProcessor]; root of factory hierarchy
    Jul 3, 2009 2:57:27 PM org.springframework.remoting.support.SimpleHttpServerFactoryBean afterPropertiesSet
    INFO: Starting HttpServer at address 0.0.0.0/0.0.0.0:9090
    



Lalu jalankan ClientLauncher, inilah log yang muncul. 


    
    
    Jul 3, 2009 2:58:12 PM org.springframework.context.support.AbstractApplicationContext prepareRefresh
    INFO: Refreshing org.springframework.context.support.ClassPathXmlApplicationContext@be2358: display name [org.springframework.context.support.ClassPathXmlApplicationContext@be2358]; startup date [Fri Jul 03 14:58:12 WIT 2009]; root of context hierarchy
    Jul 3, 2009 2:58:12 PM org.springframework.beans.factory.xml.XmlBeanDefinitionReader loadBeanDefinitions
    INFO: Loading XML bean definitions from class path resource [client-ctx.xml]
    Jul 3, 2009 2:58:13 PM org.springframework.context.support.AbstractApplicationContext obtainFreshBeanFactory
    INFO: Bean factory for application context [org.springframework.context.support.ClassPathXmlApplicationContext@be2358]: org.springframework.beans.factory.support.DefaultListableBeanFactory@d2906a
    Jul 3, 2009 2:58:13 PM org.springframework.beans.factory.support.DefaultListableBeanFactory preInstantiateSingletons
    INFO: Pre-instantiating singletons in org.springframework.beans.factory.support.DefaultListableBeanFactory@d2906a: defining beans [remotingService]; root of factory hierarchy
    Jul 3, 2009 2:58:13 PM com.artivisi.tutorial.remoting.spring.client.ClientLauncher main
    INFO: Pesan dari server : Halo, endy
    



Setelah ClientLauncher dijalankan, di log server akan muncul informasi sebagai berikut. 


    
    
    INFO: Terima dari client : endy
    



Demikianlah cara menggunakan embedded HttpServer. Selamat mencoba.
