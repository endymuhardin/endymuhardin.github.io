---
comments: true
date: 2009-06-12 13:43:16
layout: post
slug: integrasi-pusat-cabang-2
title: Integrasi aplikasi kantor pusat dan cabang [Bagian 2]
wordpress_id: 446
categories:
- java
---

Pada [artikel sebelumnya](http://endy.artivisi.com/blog/java/integrasi-pusat-cabang-1/), kita sudah mendiskusikan requirement yang diinginkan. Sekarang kita akan melakukan implementasi menggunakan [Spring Integration](http://www.springsource.org/spring-integration). 

Spring Integration memiliki beberapa abstraksi utama yang perlu kita ketahui agar bisa membuat implementasi, yaitu : 




  * Message : ini adalah data yang akan kita kirim, proses, dan terima


  * Channel : ini adalah saluran tempat lewatnya message


  * Endpoint : ini adalah ujung dari channel


  * Transport : mekanisme pengiriman message. Spring Integration mendukung messaging (email,JMS), remoting (Web Service, RMI, HttpInvoker, HTTP), file, dan lainnya (stream)



Ilustrasi hubungan antara message, channel, dan endpoint bisa dilihat di gambar berikut : 

[![Hubungan Message, Channel, dan Endpoint ](/images/uploads/2009/06/msg-channel-endpoint-300x59.png)](/images/uploads/2009/06/msg-channel-endpoint-300x59.png)



Message terdiri dari dua bagian utama, yaitu header dan payload (isi message). 



### Channel



Berdasarkan kemampuan menampung message, channel dibedakan menjadi : 




  * Pollable : memiliki buffer untuk menampung message. Dengan adanya kapasitas buffer, pengirim tidak perlu menunggu sampai penerima mendapatkan message, kecuali bila buffernya penuh. Dalam kondisi buffer penuh, pengirim akan menunggu (blocking) sampai ada slot kosong yang bisa digunakan untuk menyimpan message. Penerima dapat memeriksa keberadaan message dalam buffer. Dalam melakukan pemeriksaan, penerima dapat menunggu sampai ada message, atau sampai jangka waktu tertentu (timeout)


  * Subscribable : tidak memiliki buffer, tiap message yang masuk langsung dikirim ke endpoint. Pengirim harus menunggu sampai message diterima.



Berdasarkan perilaku pengiriman message, channel dibedakan menjadi : 


  * Point to Point (PTP) : tiap message hanya dikirimkan ke satu penerima saja. Walaupun ada beberapa penerima yang terhubung ke channel PTP, tapi hanya salah satu saja yang akan menerima message


  * Point to Multipoint (PTM) : tiap message akan dikirim ke semua penerima yang terdaftar.



Ada beberapa implementasi channel : 


  * Direct Channel : subscribable dan point-to-point. Seluruh proses (kirim, masuk channel, terima) akan dilakukan dalam thread yang sama


  * Queue Channel : pollable dan point to point. Message yang datang duluan akan dikirim duluan juga (FIFO)


  * Priority Channel : mirip dengan Queue Channel, tapi tidak menggunakan FIFO, melainkan melihat field Priority di Message Header untuk menentukan mana message yang harus dikirim terlebih dulu


  * Rendezvous Channel : mirip dengan Direct Channel, tapi pengirim dan penerima menggunakan thread yang berbeda. Pengirim akan menunggu sampai message diterima atau sampai timeout. Atau sebaliknya, penerima akan menunggu sampai ada message yang masuk. Biasanya digunakan untuk mengimplementasikan request-reply.


  * ThreadLocal Channel : pollable dan point-to-point. Message disimpan di thread local, sehingga tidak disharing dengan thread yang berbeda.


  * Publish Subscribe Channel : subscribable dan point-to-multipoint. Setiap penerima yang terdaftar akan menerima message. Tidak bisa menyimpan message, sehingga kalau kita butuh buffer, kita harus merangkainya dengan channel jenis lain yang memiliki buffer.





### Endpoint


Endpoint digunakan untuk menghubungkan channel. Pemrosesan message dilakukan dalam endpoint. Ada beberapa jenis endpoint, yaitu: 




  * Service Activator : kalau kita ingin memanggil business method kita, gunakan endpoint ini.


  * Channel Adapter : ini adalah penghubung channel dengan transport, baik untuk menerima message (inbound) ataupun mengirim message (outbound).


  * Transformer : digunakan untuk mengubah format message


  * Filter : digunakan untuk memutuskan apakah suatu message akan diterima atau dibuang


  * Router : digunakan untuk memilih channel mana yang akan menerima message


  * Splitter : digunakan untuk memecah message menjadi beberapa bagian untuk diproses secara independen


  * Aggregator : digunakan untuk menggabungkan beberapa message menjadi satu message untuk diteruskan ke channel berikutnya


  * Resequencer : digunakan untuk menyusun urutan message





### Implementasi Kantor Pusat



Sekarang, setelah kita memahami berbagai istilah dalam Spring Integration, kita bisa merancang implementasi dari requirement kita. Berikut adalah aliran message di sisi kantor pusat. Kantor pusat mengirim beberapa data produk baru, dan akan dikonversi menjadi JSON. 

[![Flow konversi data menjadi JSON ](/images/uploads/2009/06/pusat-json-300x24.png)](/images/uploads/2009/06/pusat-json-300x24.png)

Setelah menjadi JSON, selanjutnya kita bisa kirim melalui berbagai transport yang disediakan. Untuk tahap development, kita kirim saja melalui file ke folder /tmp, supaya mudah didebug dan tidak butuh internet. 

[![Flow message JSON ke shared folder ](/images/uploads/2009/06/json-file-300x56.png)](/images/uploads/2009/06/json-file-300x56.png)

Selanjutnya, setelah transport melalui file sudah dipastikan benar, baik format data, isi data, maupun rangkaian filternya, kita bisa mengganti channel adapter untuk mengirim ke GMail. 

[![Flow message JSON ke Email ](/images/uploads/2009/06/json-email-300x35.png)](/images/uploads/2009/06/json-email-300x35.png)

Kita harus membuat beberapa file sebagai berikut : 




  * Produk.java : domain model dari data yang akan kita kirim


  * JsonTransformer.java : kode program untuk mengubah object Produk menjadi JSON


  * JsonTransformerTest.java : kode program untuk mengetes ProdukTransformer


  * PusatSender.java : kode program untuk mengaktifkan Spring Integration dan mengirim data produk


  * Gateway.java : interface untuk mengirim message. Kita harus membuat ini agar tidak ada dependensi ke library Spring Integration


  * pusat-integration-ctx.xml : konfigurasi Spring Integration




Berikut kode programnya. 



#### Produk.java



    
    
    public class Produk implements Serializable {
        private Integer id;
        private String kode;
        private String nama;
        
        // getter dan setter generate dengan IDE
    }
    





#### JsonTransformer.java



    
    
    public class JsonTransformer {
        public Produk jsonToProduk(String json){
            return (Produk) JSONObject.toBean(JSONObject.fromObject(json), Produk.class);
        }
    
        public String produkToJson(Produk p){
            return JSONObject.fromObject(p).toString();
        }
    }
    





#### JsonTransformerTest.java



    
    
    public class JsonTransformerTest {
    
        @Test
        public void testJsonToProduk() {
            Produk p = new JsonTransformer()
                        .jsonToProduk("{\"id\":99,\"kode\":\"T-001\",\"nama\":\"Produk Test\"}");
            assertEquals(new Integer(99), p.getId());
            assertEquals("T-001", p.getKode());
            assertEquals("Produk Test", p.getNama());
        }
    
        @Test
        public void testProdukToJson() {
            Produk p = new Produk();
            p.setId(99);
            p.setKode("T-001");
            p.setNama("Produk Test");
    
            assertEquals("{\"id\":99,\"kode\":\"T-001\",\"nama\":\"Produk Test\"}",
                    new JsonTransformer().produkToJson(p));
        }
    }
    





#### PusatSender.java



    
    
    public class PusatSender {
        public static void main(String[] args) {
            // 1. Menginstankan Spring Application Context
            AbstractApplicationContext ctx 
                = new ClassPathXmlApplicationContext("pusat-integration-ctx.xml", Gateway.class);
            ctx.registerShutdownHook();
            Gateway gw = (Gateway) ctx.getBean("gateway");
    
            // 2. Kirim produk ke gateway
            int jumlahProduk = 5;
            for (int i = 0; i < jumlahProduk; i++) {
                Produk p = new Produk();
                p.setId(i);
                p.setKode("PRD-00"+i);
                p.setNama("Produk "+i);
                gw.send(p);
                System.out.println("Kirim produk "+i);
            }
            System.out.println("Produk terkirim");
            System.exit(0);
        }
    }
    





#### Gateway.java



    
    
    public interface Gateway {
        public void send(Produk p);
    }
    





#### pusat-integration-ctx.xml



    
    
    <beans:beans xmlns="http://www.springframework.org/schema/integration"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:beans="http://www.springframework.org/schema/beans"
           xmlns:file="http://www.springframework.org/schema/integration/file"
           xmlns:mail="http://www.springframework.org/schema/integration/mail"
           xmlns:transformer="http://www.springframework.org/schema/integration/transformer"
           xmlns:stream="http://www.springframework.org/schema/integration/stream"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
               http://www.springframework.org/schema/beans/spring-beans-2.5.xsd
               http://www.springframework.org/schema/integration
               http://www.springframework.org/schema/integration/spring-integration-1.0.xsd
               http://www.springframework.org/schema/integration/file
               http://www.springframework.org/schema/integration/file/spring-integration-file-1.0.xsd
               http://www.springframework.org/schema/integration/mail
               http://www.springframework.org/schema/integration/mail/spring-integration-mail-1.0.xsd
               http://www.springframework.org/schema/integration/stream
               http://www.springframework.org/schema/integration/stream/spring-integration-stream-1.0.xsd
               http://www.springframework.org/schema/integration/transformer
               http://www.springframework.org/schema/integration/transformer/spring-integration-transformer-1.0.xsd">
    
    
        <gateway id="gateway"
                    service-interface="com.artivisi.explore.spring.integration.pusat.Gateway"
                    default-request-channel="outgoingProduk"/>
    
        <channel id="outgoingProduk" />
        
        <transformer input-channel="outgoingProduk" output-channel="outgoingJson"
        ref="jsonTransformer" method="produkToJson"/>
    
        <publish-subscribe-channel id="outgoingJson" />
        
        <file:outbound-channel-adapter channel="outgoingJson" directory="/tmp"/>
    
        <mail:header-enricher
            id="mailHeaderEnricher"
            subject="Spring Integration Demo"
            to="cabang@gmail.com"
            from="pusat@gmail.com"
            reply-to="pusat@gmail.com"
            overwrite="false"
            input-channel="outgoingJson"
            output-channel="outgoingEmail"/>
    
        <channel id="outgoingEmail" />
    
        <mail:outbound-channel-adapter
            mail-sender="mailSender"
            channel="outgoingEmail"
            />
    
        <beans:bean id="mailSender" class="org.springframework.mail.javamail.JavaMailSenderImpl">
            <beans:property name="defaultEncoding" value="UTF-8"/>
            <beans:property name="host" value="smtp.gmail.com"/>
            <beans:property name="port" value="465"/>
            <beans:property name="username" value="mygmailaccount"/>
            <beans:property name="password" value="mygmailpassword"/>
            <beans:property name="javaMailProperties">
                <beans:value>
                    mail.debug=true
                    mail.smtp.starttls.enable=true
                  	mail.smtp.auth=true
                    mail.smtp.socketFactory.class=javax.net.ssl.SSLSocketFactory
                    mail.smtp.socketFactory.fallback=false
                </beans:value>
            </beans:property>
        </beans:bean>
    
        <beans:bean id="jsonTransformer" class="com.artivisi.explore.spring.integration.model.JsonTransformer"/>
    </beans:beans>
    





### Implementasi Kantor Cabang


Di sisi kantor cabang, berikut aliran message dari transport hingga menjadi JSON. Kita mulai dengan transport file. 

[![Flow dari shared folder menjadi JSON ](/images/uploads/2009/06/file-json-300x35.png)](/images/uploads/2009/06/file-json-300x35.png)

Bila kita menggunakan email, berikut gambarnya

[![Flow dari Email menjadi JSON ](/images/uploads/2009/06/email-json-300x35.png)](/images/uploads/2009/06/email-json-300x35.png)

Setelah menjadi JSON, kita proses sampai ke CabangService

[![Flow pemrosesan JSON menjadi Produk ](/images/uploads/2009/06/json-cabang-300x25.png)](/images/uploads/2009/06/json-cabang-300x25.png)

Kita harus membuat beberapa file sebagai berikut : 




  * CabangReceiver.java : kode program untuk mengaktifkan Spring Integration


  * CabangService.java : kode program yang akan dipanggil setelah message diterima, dikonversi dari JSON menjadi Produk


  * cabang-integration-ctx.xml : konfigurasi Spring Integration



Kode programnya. 



#### CabangReceiver.java



    
    
    public class CabangReceiver {
        public static void main(String[] args) {
            AbstractApplicationContext ctx 
                    = new ClassPathXmlApplicationContext("cabang-integration-ctx.xml", CabangReceiver.class);
            ctx.registerShutdownHook();
        }
    }
    





#### CabangService.java



    
    
    public class CabangService {
        public void terimaProduk(Produk p){
            // Tampilkan data produk, tapi bisa juga disimpan di database
            System.out.println("Terima produk");
            System.out.println("ID : "+p.getId());
            System.out.println("Kode : "+p.getKode());
            System.out.println("Nama : "+p.getNama());
        }
    }
    





#### cabang-integration-ctx.xml



    
    
    <beans:beans xmlns="http://www.springframework.org/schema/integration"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:beans="http://www.springframework.org/schema/beans"
           xmlns:file="http://www.springframework.org/schema/integration/file"
           xmlns:mail="http://www.springframework.org/schema/integration/mail"
           xmlns:transformer="http://www.springframework.org/schema/integration/transformer"
           xmlns:stream="http://www.springframework.org/schema/integration/stream"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
               http://www.springframework.org/schema/beans/spring-beans-2.5.xsd
               http://www.springframework.org/schema/integration
               http://www.springframework.org/schema/integration/spring-integration-1.0.xsd
               http://www.springframework.org/schema/integration/stream
               http://www.springframework.org/schema/integration/stream/spring-integration-stream-1.0.xsd
               http://www.springframework.org/schema/integration/file
               http://www.springframework.org/schema/integration/file/spring-integration-file-1.0.xsd
               http://www.springframework.org/schema/integration/mail
               http://www.springframework.org/schema/integration/mail/spring-integration-mail-1.0.xsd
               http://www.springframework.org/schema/integration/transformer
               http://www.springframework.org/schema/integration/transformer/spring-integration-transformer-1.0.xsd">
    
    
        <file:inbound-channel-adapter id="filePoller"
           directory="/tmp"
           filename-pattern="^.*\.msg$"
           channel="incomingFile"/>
        
        <channel id="incomingFile" />
    
        <file:file-to-string-transformer
           input-channel="incomingFile"
           output-channel="incomingJson"
           delete-files="true" />
    
        <channel id="incomingJson" />
    
        <transformer input-channel="incomingJson" output-channel="incomingProduk"
        ref="jsonTransformer" method="jsonToProduk"/>
    
        <channel id="incomingProduk" />
    
        <service-activator input-channel="incomingProduk"
                          ref="cabangService"
                          method="terimaProduk"/>
                          
        <poller id="defaultPoller" default="true">
            <interval-trigger interval="3" time-unit="SECONDS"/>
        </poller>
    
    
        <beans:bean id="jsonTransformer" class="com.artivisi.explore.spring.integration.model.JsonTransformer"/>
        <beans:bean id="cabangService" class="com.artivisi.explore.spring.integration.cabang.CabangService"/>
    </beans:beans>
    



Untuk menerima email, kita dapat memilih protokol POP3, IMAP, atau IMAP-Idle. POP3 dan IMAP akan mendownload semua email yang masuk, setelah itu, kita harus melakukan polling dengan interval tertentu untuk memeriksa apakah ada email baru. Bila kita menggunakan IMAP-Idle, kita tidak perlu melakukan polling. Mail server akan memberikan notifikasi bila ada email baru yang masuk, setelah itu kita bisa mendownloadnya. 

Berikut konfigurasi untuk GMail




#### Debug Output



    
    
        <beans:bean id="javaMailProperty" class="org.springframework.beans.factory.config.PropertiesFactoryBean">
            <beans:property name="properties">
                <beans:value>
                    mail.debug=true
                </beans:value>
            </beans:property>
        </beans:bean>
    





#### POP3



    
    
        <mail:inbound-channel-adapter
        channel="incomingMail"
        store-uri="pop3s://mygmailaccount:mygmailpassword@pop.gmail.com:995/INBOX"
        java-mail-properties="javaMailProperty"/>
    






#### IMAP



    
    
        <mail:inbound-channel-adapter
        channel="incomingMail"
        store-uri="imaps://mygmailaccount:mygmailpassword@imap.gmail.com:993/INBOX" />
    






#### IMAP-Idle



    
    
        <mail:imap-idle-channel-adapter channel="incomingMail"
        store-uri="imaps://mygmailaccount:mygmailpassword@imap.gmail.com:993/INBOX"/>
    



Setelah email masuk, jangan lupa konversi dulu jadi String.

    
    
        <channel id="incomingMail" />
    
        <mail:mail-to-string-transformer 
        input-channel="incomingMail" 
        output-channel="incomingJson"/>
    



Demikianlah tutorial penggunaan Spring Integration. Dengan menggunakan Spring Integration ini, ada beberapa benefit yang kita dapatkan dibandingkan coding sendiri : 





  * Kode program lebih sedikit


  * Kode program lebih mudah ditest. Kita bisa menggunakan JUnit untuk JsonTransformer. Alur pengiriman data juga bisa ditest di komputer lokal tanpa koneksi ke GMail, sehingga kalau ada error bisa diperbaiki dengan lebih cepat.


  * Aliran data lebih mudah dibaca, yaitu dalam konfigurasi Spring Integration


  * Fleksibilitas dalam pemilihan transport. Bukan cuma email, tapi juga banyak opsi lain seperti remoting dan file. Opsi ini cuma butuh beberapa baris konfigurasi saja untuk mengaktifkannya.



Konsumsi effort : 


  * Download : 1 jam


  * Browsing tutorial : 2 jam


  * Mempelajari Spring Integration : 8 jam


  * Membuat sample aplikasi : 4 jam


  * Menulis blog dan membuat gambar : 8 jam


  * **Total : 23 jam (3 hari)**



Apakah dalam 3 hari kita bisa membuat implementasi kirim-terima data produk via email yang bebas bug ??

