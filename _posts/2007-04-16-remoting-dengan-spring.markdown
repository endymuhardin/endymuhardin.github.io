---
comments: true
date: 2007-04-16 17:49:19
layout: post
slug: remoting-dengan-spring
title: Remoting dengan Spring
wordpress_id: 214
categories:
- java
---

Aplikasi yang kita buat, tidak hanya digunakan oleh manusia. Ada kalanya aplikasi yang kita buat akan diakses oleh aplikasi orang lain. Jadi, user atau pengguna aplikasi kita bukanlah orang, melainkan mesin. Dalam hal ini, aplikasi kita dapat disebut dengan aplikasi server yang menyediakan service bagi aplikasi client. 

Bagaimana caranya agar aplikasi kita dapat digunakan oleh aplikasi lain? Caranya tentunya dengan menyediakan antarmuka yang sesuai bagi masing-masing aplikasi client. Ada banyak bahasa yang dijadikan patokan dalam komunikasi antar aplikasi. Beberapa protokol yang umum digunakan adalah: 



	
  * CORBA

	
  * RMI (khusus Java)

	
  * SOAP

	
  * XML-RPC

	
  * Hessian

	
  * Burlap

	
  * dan masih banyak yang lainnya



Dengan cara tradisional, menyediakan antarmuka untuk masing-masing protokol ini cukup rumit. Selain harus mengerti protokolnya, kita juga harus menulis banyak kode untuk memformat data kita mengikuti aturan yang ditetapkan protokol tersebut. Kita juga harus menulis kode program agar dapat menerima data dalam protokol yang kita ingin sediakan. 

[Spring Framework](http://www.springframework.org) menyediakan library pembantu bagi kita agar kita dapat menyediakan akses dalam protokol tersebut dengan mudah. Bagaimana caranya, mari kita bahas dalam artikel ini. 


Sebagai contoh sederhana, misalnya kita ingin menyediakan layanan untuk mengambil data Person. Untuk menyederhakan masalah, Person hanya mengandung data nama dan email saja. 



### Person.java



    
    
    package tutorial.remoting;
    
    public class Person implements java.io.Serializable {
        private String name;
        private String email;
        
        public Person() {
            this("", "");
        }
        
        public Person(String name, String email){
            this.name = name;
            this.email = email;
        }
        
        public String getName(){
            return name;
        }
        
        public String getEmail(){
            return email;
        }
        
        public String toString(){
            return name + " : " + email;
        }
    }



Perhatikan bahwa kita harus mendefinisikan Person sebagai object yang Serializable. Ini penting agar object ini bisa ditransfer melalui jaringan. 

Kemudian, kita sediakan interface yang mendefinisikan layanan yang ingin kita sediakan bagi aplikasi lain. Kita sebut saja interface ini sebagai PersonService. 



### PersonService.java



    
    
    package tutorial.remoting;
    
    import java.util.List;
     
    public interface PersonService {    
        public Person get(int id);
        public List getAllPerson();
    } 



PersonService ini nantinya bisa kita implementasi sesuai dengan kebutuhan. Kita bisa mengambil datanya dari database, dari phonebook handphone, atau bahkan dari aplikasi lain. Agar contoh kodenya lebih sederhana, kita buat saja implementasinya dengan ArrayList. Para pembaca nanti bisa mencoba dengan implementasi lain yang lebih hi-tech seperti Hibernate atau OpenJPA. 

Berikut adalah implementasi dari PersonService, kita sebut saja PersonServiceImpl. 


### PersonServiceImpl.java



    
    
    package tutorial.remoting.remote;
    
    import java.util.List;
    import java.util.ArrayList;
    
    import tutorial.remoting.Person;
    import tutorial.remoting.PersonService;
    
    public class PersonServiceImpl implements PersonService {
    
        private List allPerson = new ArrayList();
        
        public PersonServiceImpl(){
            Person p = new Person("Endy Muhardin", "endy@artivisi.com");
            Person p1 = new Person("Maya Mujawati", "moedja@yahoo.com");
            allPerson.add(p);
            allPerson.add(p1);
        }
        
        public Person get(int id){
            if (id >= allPerson.size()) return null;
            return (Person) allPerson.get(id);
        }
    
        public List getAllPerson(){
            return allPerson;
        }
    } 
    



Seperti kita lihat di atas, tidak ada yang istimewa dengan kode program di atas. Bahkan validasi untuk field id pun tidak kita sediakan. Tentu saja kalau kita berikan masukan angka 2 atau lebih pada method public Person get(int id) akan terjadi ArrayIndexOutOfBoundException. 

Selesai sudah ... sekarang kode tersebut dapat diakses oleh aplikasi lain. 

Apa?? Saya mendengar ada suara-suara kurang puas dari penonton.. Coba lebih keras??



> Bagaimana cara mengaksesnya dari aplikasi client? Nampaknya belum ada kode program apa-apa untuk menyediakan layanan webservice. Mana bisa dibilang selesai?



Ok .. baiklah, memang ada satu langkah lagi. Yaitu mempublikasikan interface tersebut agar bisa diakses orang banyak. Kita akan sediakan akses melalui tiga protokol, yaitu: 



	
  1. RMI

	
  2. Hessian

	
  3. Burlap





> Tiga protokol?? Apa tidak terlalu ambisius? Nanti saya pusing baca kode sekian banyak. 


Demikian terdengar komentar dari penonton. Hmm ... penonton Indonesia memang terlalu banyak protes. 

Tenang saja. Kita akan gunakan Spring untuk mempublikasikan aplikasi kecil kita ini. Saya akan buktikan bahwa kodenya sedikit dan mudah dipahami. Sekarang, mari kita mulai dengan mempublikasikan protokol RMI. Di masa lalu, untuk menyediakan layanan ini, paling tidak kita harus: 



	
  1. mengkompilasi stub

	
  2. mengkompilasi skeleton

	
  3. mengkonfigurasi Security setting

	
  4. menjalankan RMIRegistry

	
  5. mendaftarkan objek PersonServiceImpl ke RMIRegistry

	
  6. memberikan stub ke aplikasi client



Sekarang tidak lagi. Kita cukup mendaftarkan interface PersonService, implementasi PersonServiceImpl di konfigurasi Spring. Berikut adalah isi file remote-ctx.xml


### remote-ctx.xml



    
    
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE beans PUBLIC "-//SPRING//DTD BEAN//EN" "http://www.springframework.org/dtd/spring-beans.dtd">
    
    <beans>
        <bean id="personServiceTarget" class="tutorial.remoting.remote.PersonServiceImpl"/>
        
        <bean class="org.springframework.remoting.rmi.RmiServiceExporter">        
            <property name="serviceName" value="PersonRmiService"/>
            <property name="service" ref="personServiceTarget"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>  
            <property name="registryPort" value="4321"/>
        </bean>
    </beans>
    



Hanya dengan membaca file XML di atas, kita sudah bisa menduga apa yang terjadi. Kita mempublikasikan layanan yang didefinisikan pada interface PersonService pada port 4321 dengan nama layanan PersonRmiService. Di sisi server, layanan ini akan disediakan oleh objek personServiceTarget yang merupakan instan dari class PersonServiceImpl. Kita memanfaatkan class RmiServiceExporter yang dimiliki Spring. 

Untuk menjalankan aplikasi kecil kita, buat sebuah class sederhana untuk mengaktifkan Spring Framework. Berikut adalah kode programnya. 


### PersonRmiService.java



    
    
    package tutorial.remoting.server;
    
    import org.springframework.context.ApplicationContext;
    import org.springframework.context.support.FileSystemXmlApplicationContext;
    
    public class PersonRmiService {
        public static void main(String[] xx) {
            ApplicationContext ctx = 
            new FileSystemXmlApplicationContext("webapp/WEB-INF/remote-ctx.xml");
        }
    }
    



Silahkan jalankan class di atas. Asal classpath sudah disetting dengan benar, kita siap mengaksesnya dari client. 
Kita juga akan menggunakan bantuan dari Spring Framework untuk menemukan dan menginisialisasi layanan RMI yang berada di port 4321. Berikut adalah konfigurasi Spring di sisi client. 



### client-ctx.xml



    
    
    <!DOCTYPE beans PUBLIC "-//SPRING//DTD BEAN//EN" "http://www.springframework.org/dtd/spring-beans.dtd">
    
    <beans>    
        <bean id="personServiceRmi" class="org.springframework.remoting.rmi.RmiProxyFactoryBean">
            <property name="serviceUrl" value="rmi://localhost:4321/PersonRmiService"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>
        </bean>
    </beans>
    



Berikut adalah kode program untuk mengakses RMI service kita. 


### Main.java



    
    
    package tutorial.remoting.client;
    
    import java.util.List;
    
    import tutorial.remoting.PersonService;
    
    import org.springframework.context.ApplicationContext;
    import org.springframework.context.support.FileSystemXmlApplicationContext;
    
    public class Main {
        public static void main(String[] args){
            // initialize application context
            ApplicationContext ctx = new FileSystemXmlApplicationContext("client-ctx.xml");
        
            // accessing RMI service
            System.out.println("======= Accessing RMI Service ==========");
            PersonService ps1 = (PersonService) ctx.getBean("personServiceRmi");
            List all1 = ps1.getAllPerson();
            for(int i=0; i<all1.size(); i++) {
                System.out.println(all1.get(i));
            }
    }
    



Perhatikan konsol, dan saksikan RMI service kita sudah dieksekusi dengan sukses. 

Sekarang, kita publikasikan melalui protokol [Hessian](http://www.caucho.com/resin-3.0/protocols/hessian.xtp) dan [Burlap](http://www.caucho.com/resin-3.0/protocols/burlap.xtp). Protokol ini adalah hasil karya Caucho untuk mempublikasikan service di atas protokol HTTP. Hessian menggunakan format binary, sedangkan Burlap menggunakan format XML. 

Karena berbasis HTTP, maka kita perlu menggunakan HTTP Server yang mendukung Java (khususnya Servlet). Kita bisa gunakan Tomcat atau Jetty. Yang jelas, kita perlu mendeklarasikan servlet untuk melayani client. Deklarasi dibuat di dalam file web.xml sebagai berikut. 



### web.xml



    
    
    <?xml version="1.0" encoding="ISO-8859-1"?>
    
    <!DOCTYPE web-app PUBLIC
    	"-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
    	"http://java.sun.com/dtd/web-app_2_3.dtd">
    
    <web-app>
    
    	<context-param>
    		<param-name>contextConfigLocation</param-name>
    		<param-value>
    			/WEB-INF/remote-ctx.xml
    		</param-value>
    	</context-param>
    	<listener>
    		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    	</listener>
    
    	<servlet>
    		<servlet-name>remoting</servlet-name>
    		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    		<load-on-startup>2</load-on-startup>
    	</servlet>
    	
    	<servlet-mapping>
    		<servlet-name>remoting</servlet-name>
    		<url-pattern>/remoting/*</url-pattern>
    	</servlet-mapping>
    
    	<session-config>
    		<session-timeout>10</session-timeout>
    	</session-config>
    
    
    </web-app>
    



Kita membutuhkan satu file konfigurasi untuk mengkonfigurasi layanan Hessian dan Burlap. Berikut adalah isi file remoting-servlet.xml. 


### remoting-servlet.xml



    
    
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE beans PUBLIC "-//SPRING//DTD BEAN//EN" "http://www.springframework.org/dtd/spring-beans.dtd">
    
    <beans>
        <bean name="/PersonHessianService" class="org.springframework.remoting.caucho.HessianServiceExporter">
            <property name="service" ref="personServiceTarget"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>          
        </bean>
        
        
        <bean name="/PersonBurlapService" class="org.springframework.remoting.caucho.BurlapServiceExporter">
            <property name="service" ref="personServiceTarget"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>          
        </bean>
        
        <bean name="/PersonHttpInvokerService" class="org.springframework.remoting.httpinvoker.HttpInvokerServiceExporter">
            <property name="service" ref="personServiceTarget"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>          
        </bean>
        
        
    </beans>
    



Letakkan file remoting-servlet.xml ini di sebelah web.xml. Kita juga perlu mengikutkan file remote-ctx.xml yang kita buat untuk RMI di atas, karena deklarasi objek PersonServiceImpl ada di sana. Bila kita tidak ingin mengikutkan file ini, kita bisa memindahkan deklarasi objek tersebut ke dalam file remoting-servlet.xml. 

Sekarang kita bisa mengkompilasi dan mendeploy aplikasi webnya. Untuk mengaksesnya, ubah sedikit kode program di aplikasi client menjadi sebagai berikut. 



### Main.java



    
    
    package tutorial.remoting.client;
    
    import java.util.List;
    
    import tutorial.remoting.PersonService;
    
    import org.springframework.context.ApplicationContext;
    import org.springframework.context.support.FileSystemXmlApplicationContext;
    
    public class Main {
        public static void main(String[] args){
            // initialize application context
            ApplicationContext ctx = new FileSystemXmlApplicationContext("client-ctx.xml");
        
            // accessing RMI service
            System.out.println("======= Accessing RMI Service ==========");
            PersonService ps1 = (PersonService) ctx.getBean("personServiceRmi");
            List all1 = ps1.getAllPerson();
            for(int i=0; i<all1.size(); i++) {
                System.out.println(all1.get(i));
            }
            
            // accessing Hessian Service
            System.out.println("======= Accessing Hessian Service ==========");
            PersonService ps2 = (PersonService) ctx.getBean("personServiceHessian");
            List all2 = ps2.getAllPerson();
            for(int i=0; i<all2.size(); i++) {
                System.out.println(all2.get(i));
            }
            
            // accessing Burlap Service
            System.out.println("======= Accessing Burlap Service ==========");
            PersonService ps3 = (PersonService) ctx.getBean("personServiceBurlap");
            List all3 = ps3.getAllPerson();
            for(int i=0; i<all3.size(); i++) {
                System.out.println(all3.get(i));
            }
            
            // accessing Http Invoker Service
            System.out.println("======= Accessing Http Invoker Service ==========");
            PersonService ps4 = (PersonService) ctx.getBean("personServiceHttpInvoker");
            List all4 = ps4.getAllPerson();
            for(int i=0; i<all4.size(); i++) {
                System.out.println(all4.get(i));
            }
        }
    } 



Demikian juga dengan konfigurasi Spring di sisi client. Kita perlu menambahkan beberapa objek tambahan untuk mengakses layanan di berbagai protokol tersebut. Berikut adalah isi lengkap dari client-ctx.xml. 



### client-ctx.xml



    
    
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE beans PUBLIC "-//SPRING//DTD BEAN//EN" "http://www.springframework.org/dtd/spring-beans.dtd">
    
    <beans>    
        <bean id="personServiceRmi" class="org.springframework.remoting.rmi.RmiProxyFactoryBean">
            <property name="serviceUrl" value="rmi://localhost:4321/PersonRmiService"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>
        </bean>
        
        <bean id="personServiceHessian" class="org.springframework.remoting.caucho.HessianProxyFactoryBean">
            <property name="serviceUrl" value="http://localhost:9090/remoting/PersonHessianService"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>
        </bean>
        
        <bean id="personServiceBurlap" class="org.springframework.remoting.caucho.BurlapProxyFactoryBean">
            <property name="serviceUrl" value="http://localhost:9090/remoting/PersonBurlapService"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>
        </bean>
        
        <bean id="personServiceHttpInvoker" class="org.springframework.remoting.httpinvoker.HttpInvokerProxyFactoryBean">
            <property name="serviceUrl" value="http://localhost:9090/remoting/PersonHttpInvokerService"/>
            <property name="serviceInterface" value="tutorial.remoting.PersonService"/>
        </bean>
    </beans>
    



Aplikasi kecil kita sudah selesai. Setelah mendeploy aplikasi tersebut ke Servlet Container (Tomcat atau Jetty), kita dapat mengaksesnya melalui aplikasi client. Dengan tetap menggunakan remote-ctx.xml tanpa perubahan, selain menyediakan protokol Hessian dan Burlap, protokol RMI akan tetap tersedia. 



### Bonus


Pembaca yang teliti akan menemukan satu protokol tambahan pada contoh di atas, yaitu HttpInvoker. Ini adalah protokol khusus yang disediakan oleh Spring. 

Protokol Hessian dan Burlap tidak mendukung struktur objek secara sempurna. Dia akan mengalami kesulitan apabila objek yang kita kirim tidak sesederhana Person, misalnya memiliki List yang berisi objek lain. Agar bisa mengirim struktur objek yang sempurna, kita harus menggunakan RMI. 

Tetapi sayangnya, protokol RMI kurang lazim. Dia membutuhkan port tersendiri yang mungkin saja diblok oleh administrator jaringan, sehingga tidak sefleksibel HTTP. 

SpringHttpInvoker menjembatani keterbatasan ini. Kita bisa mengirim objek kompleks secara utuh di atas protokol HTTP dengan menggunakan SpringHttpInvoker. 

Demikian ... semoga bermanfaat. 
