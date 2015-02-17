---
comments: true
date: 2007-03-29 11:50:14
layout: post
slug: intro-icefaces
title: Intro ICEFaces
wordpress_id: 206
categories:
- java
---

Beberapa waktu terakhir ini, framework Java Server Faces terlihat semakin matang. Orang-orang sudah mulai menggunakan, memberi feedback, dan menemukan best-practices cara penggunaannya. Oleh karena itu, saya pikir sudah tiba waktunya untuk saya mempelajari framework tersebut. 

Berdasarkan pengalaman rekan [Samuel](http://www.jroller.com/page/sfranklyn/), dia menganjurkan penggunaan JSF dengan menggunakan stack: 



	
  * [Facelets](https://facelets.dev.java.net)

	
  * [IceFaces](http://www.icefaces.org)

	
  * [Spring Framework](http://www.springframework.org)

	
  * [Hibernate](http://www.hibernate.org)



Spring dan Hibernate sudah sering saya gunakan. Integrasinya dengan JSF juga tidak terlalu sulit. Hanya butuh registrasi bean di dalam konfigurasi JSF. 

Facelets adalah template engine untuk JSF. Dalam dunia JSF, template engine sering disebut juga dengan istilah View Renderer. Sebenarnya View Renderer default JSF adalah JSP, tapi saya tidak suka JSP. Jadilah akhirnya kita pakai JSF dengan Facelets sebagai ViewRenderer-nya. 
Facelets ini mirip dengan Freemarker atau Velocity. Kalau di dunia PHP kira-kira padanannya adalah Smarty. 

Keuntungan menggunakan Facelets dibanding JSP adalah dengan Facelets, desain tampilan dapat dikerjakan oleh web designer. JSF dengan JSP akan banyak sekali menggunakan taglib yang tidak akan muncul di Macromedia Dreamweaver atau editor HTML lainnya. Facelets menggunakan pendekatan yang mirip dengan Tapestry, yaitu memasukkan komponen ke dalam elemen HTML biasa, sehingga dapat dilihat secara normal oleh editor HTML. 

ICEFaces adalah kumpulan komponen JSF. Dia memiliki teknologi Direct to DOM Rendering sehingga kita dapat membuat tampilan ber-AJAX dengan mudah. 

Seperti halnya teknologi lainnya di dunia Java, JSF hanyalah berupa spesifikasi. Kita dapat menggunakan implementasi yang dikeluarkan Sun (sering disebut dengan Reference Implementation - RI), atau menggunakan implementasi orang lain. Selain Sun, Apache mengeluarkan MyFaces dan Oracle mengeluarkan ADF sebagai implementasi JSF. 

Pada artikel ini, kita akan lihat Hello World dengan menggunakan JSF, Facelets, dan ICEFaces. Karena ini hanya perkenalan saja, requirementnya tidak rumit. Saya hanya ingin membuktikan kecanggihan teknologi Direct to DOM Rendering yang dimiliki ICEFaces. Konon teknologi ini memungkinkan kita mengupdate tampilan di sisi client dari server dengan mudah. 

Aplikasi yang ingin kita buat sangat sederhana, tapi sering menjadi pertanyaan di berbagai milis pemrograman web. Kita akan membuat satu halaman yang menampilkan waktu server. Waktu server ini harus berjalan secara real-time. 


Dalam bahasa pemrograman lain, menampilkan jam server secara real time di browser bukanlah suatu hal yang mudah. 
Programmer harus memilih satu di antara beberapa teknik berikut: 
            
                
  * Menggunakan meta refresh untuk request ke server setiap beberapa detik

                
  * Mengambil jam server sekali saja di awal loading page, kemudian increment nilainya di sisi client dengan JavaScript

                
  * Menggunakan streaming HTML

                
  * Menggunakan AJAX Push

            
Atau berbagai teknik lainnya. Yang jelas tidak mudah untuk melakukan hal ini. 

Dengan menggunakan JSF + ICEFaces, hal ini menjadi mudah. ICEFaces adalah salah satu implementasi JSF yang menggunakan teknologi Direct to DOM Rendering. Artinya, server bisa seenaknya mengubah HTML yang ada di sisi client (browser). Dengan teknik ini, menampilkan jam server secara real time menjadi mudah. 

Berikut adalah langkah-langkahnya: 


  1. Buat halaman HTML yang akan menampilkan waktu server


  2. Buat kode Java yang bertugas menyediakan waktu server


  3. Gunakan JSF + ICEFaces untuk menghubungkan keduanya


  4. Aktifkan partial rendering agar tidak menimbulkan flicker


Mari kita bahas satu persatu. 



## Halaman HTML



Halaman ini adalah halaman dinamis yang berisi nilai yang dikeluarkan oleh server. Bedakan dengan halaman dinamis yang dikendalikan oleh JavaScript, di mana pada kasus tersebut tidak dibutuhkan sisi server yang menyediakan data. 

Kode tampilan ini sederhana saja. Dibuat dalam format XHTML, karena begitulah keinginan Facelets. 



### whattimeisit.xhtml



    
    <code><!-- <?xml version="1.0" encoding="UTF-8"?> -->
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title>:: Menampilkan Jam Server ::</title>
        </head>
        <body>
            <p>
                    <b>Waktu Server Saat Ini : #{serverClock.currentTime}</b>
            </p>
        </body>
    </html>
    </code>



Perhatikan bahwa satu-satunya dynamic code di atas adalah `#{serverClock.currentTime}`. Sisanya HTML biasa. Bagi yang belum tahu, dynamic code tersebut ditulis dalam Expression Language (EL) yang didukung oleh JSF. Kalau di dalam Java, kode tersebut sama dengan 
`serverClock.getCurrentTime()`. 
Sekarang mari kita lihat kode Java yang membekingi template whattimeisit, yaitu ServerClock.java. 



### ServerClock.java



    
    <code>package tutorial.icefaces;
    
    import com.icesoft.faces.async.render.IntervalRenderer;
    import com.icesoft.faces.async.render.RenderManager;
    import com.icesoft.faces.async.render.Renderable;
    import com.icesoft.faces.webapp.xmlhttp.PersistentFacesState;
    import com.icesoft.faces.webapp.xmlhttp.RenderingException;
    import java.text.DateFormat;
    import java.text.SimpleDateFormat;
    import java.util.Calendar;
    
    public class ServerClock implements Renderable {
        private DateFormat formatter;
        private PersistentFacesState state;
        private IntervalRenderer renderer;
        private static final int renderInterval = 1000; // render setiap 1 detik
    
        public ServerClock() {
            formatter = new SimpleDateFormat("EEE, HH:mm:ss");
            state = PersistentFacesState.getInstance();
        }
        
        public String getCurrentTime() {
            return formatter.format(Calendar.getInstance().getTime());
        }
    
        public PersistentFacesState getState() {
            return state;
        }
    
        public void renderingException(RenderingException renderingException) {
            if(renderer != null) {
                renderer.remove(this);
                renderer = null;
            }
        }
        
        public void setRenderManager(RenderManager manager) {
            renderer = manager.getIntervalRenderer("whattimeisit");
            renderer.setInterval(renderInterval);
            renderer.add(this);
            renderer.requestRender();
        }
    }            
    </code>



Constructor dan method getCurrentTime tidak terlalu istimewa. Isinya hanya inisialisasi DateFormat dan kegiatan memformat waktu saat ini menjadi String.

Selain constructor, setter, dan getter, kode lainnya berkaitan dengan pengelolaan internalnya ICEFaces. Dalam method setRenderManager, kita menyuruh ICEFaces untuk mengupdate browser setiap 1 detik. RenderManager adalah object yang bertugas merender tampilan. Dia beroperasi ke sekumpulan Renderable, yang salah satunya adalah class kita ServerClock. 

Bila kita mengimplementasikan Renderable, ada dua method yang harus kita sediakan, 
yaitu renderingException dan getState. Method ini dengan mudah dapat kita buat. 
Selain kedua method ini, ICEFaces tidak butuh tambahan kode lagi.

Saatnya kita siapkan konfigurasi. JSF membutuhkan dua konfigurasi, yaitu web.xml (seperti aplikasi web biasa) dan faces-config.xml. Mari kita lihat web.xml sedikit demi sedikit.


    
    <code>    <context-param>
            <param-name>com.sun.faces.verifyObjects</param-name>
            <param-value>true</param-value>
        </context-param>
        <context-param>
            <param-name>com.sun.faces.validateXml</param-name>
            <param-value>true</param-value>
        </context-param>
        <context-param>
            <param-name>javax.faces.STATE_SAVING_METHOD</param-name>
            <param-value>server</param-value>
        </context-param>
    </code>



Kode di atas adalah konfigurasi untuk JSF. Konfigurasi ini berlaku umum, terlepas dari kita menggunakan Facelets dan ICEFaces ataupun library lainnya. Selanjutnya adalah konfigurasi Facelets. 


    
    <code>    <context-param>
            <param-name>javax.faces.DEFAULT_SUFFIX</param-name>
            <param-value>.xhtml</param-value>
        </context-param>
        <context-param>
            <param-name>facelets.DEVELOPMENT</param-name>
            <param-value>true</param-value>
        </context-param>
    </code>



Pada konfigurasi di atas, kita mengganti default ekstensi file template, yang tadinya jsp atau jspx menjadi xhtml. Kita juga memberitahu Facelets bahwa kita sedang dalam tahap development. Dengan demikian, pesan error yang dikeluarkan akan lebih lengkap sehingga memudahkan debugging. 

Selanjutnya, mari kita lihat konfigurasi ICEFaces. 


    
    <code>    <context-param>
            <param-name>com.icesoft.faces.uploadDirectory</param-name>
            <param-value>upload</param-value>
        </context-param>
        <context-param>
            <param-name>com.icesoft.faces.uploadMaxFileSize</param-name>
            <param-value>4048576</param-value>
        </context-param>
        <context-param>
            <param-name>com.icesoft.faces.concurrentDOMViews</param-name>
            <param-value>true</param-value>
        </context-param>
    </code>


Dua konfigurasi pertama sudah cukup jelas, mengatur tentang di mana harus meletakkan file hasil upload dan berapa maksimal ukuran file yang dapat diterima. Konfigurasi ketiga menyuruh ICEFaces berhati-hati agar dapat melayani request berbarengan ke satu halaman yang sama. 

Setelah selesai dengan konfigurasi context param, mari kita masuk ke bagian servlet. JSF membutuhkan satu servlet yang harus dijalankan pada saat aplikasi diaktifkan. 

    
    <code>    <servlet>
            <servlet-name>Faces Servlet</servlet-name>
            <servlet-class>javax.faces.webapp.FacesServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
            </servlet>
    </code>


Servlet ini tidak perlu dimapping ke URL, karena nantinya kita akan menggunakan servlet ICEFaces. 

ICEFaces membutuhkan beberapa servlet, terlihat pada konfigurasi berikut. 

    
    <code>    <servlet>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <servlet-class>com.icesoft.faces.webapp.xmlhttp.PersistentFacesServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
        </servlet>
        <servlet>
            <servlet-name>Blocking Servlet</servlet-name>
            <servlet-class>com.icesoft.faces.webapp.xmlhttp.BlockingServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
        </servlet>
        <servlet>
            <servlet-name>uploadServlet</servlet-name>
            <servlet-class>com.icesoft.faces.component.inputfile.FileUploadServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
        </servlet>
    </code>



Selain itu, ICEFaces juga membutuhkan satu listener, dideklarasikan **diatas** deklarasi servlet. 

    
    <code>    <listener>
            <listener-class>com.icesoft.faces.util.event.servlet.ContextEventRepeater</listener-class>
        </listener>
    </code>



Servlet ICEFaces dimapping sebagai berikut. 

    
    <code>    <servlet-mapping>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <url-pattern>/faces/*</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <url-pattern>/xmlhttp/*</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <url-pattern>*.iface</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>Blocking Servlet</servlet-name>
            <url-pattern>/block/*</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>uploadServlet</servlet-name>
            <url-pattern>/uploadHtml</url-pattern>
        </servlet-mapping>
    </code>




Terakhir untuk web.xml, kita perlu mendefinisikan session timeout. 

    
    <code>    <session-config>
            <session-timeout>
                30
            </session-timeout>
        </session-config>
    </code>



Hasil akhirnya adalah seperti ini. 



### web.xml



    
    <code><?xml version="1.0" encoding="UTF-8"?>
    <web-app version="2.5" xmlns="http://java.sun.com/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">
        <context-param>
            <param-name>com.sun.faces.verifyObjects</param-name>
            <param-value>true</param-value>
        </context-param>
        <context-param>
            <param-name>com.sun.faces.validateXml</param-name>
            <param-value>true</param-value>
        </context-param>
        <context-param>
            <param-name>javax.faces.STATE_SAVING_METHOD</param-name>
            <param-value>server</param-value>
        </context-param>
    
        <context-param>
            <param-name>javax.faces.DEFAULT_SUFFIX</param-name>
            <param-value>.xhtml</param-value>
        </context-param>
        <context-param>
            <param-name>facelets.DEVELOPMENT</param-name>
            <param-value>true</param-value>
        </context-param>
    
        <context-param>
            <param-name>com.icesoft.faces.uploadDirectory</param-name>
            <param-value>upload</param-value>
        </context-param>
        <context-param>
            <param-name>com.icesoft.faces.uploadMaxFileSize</param-name>
            <param-value>4048576</param-value>
        </context-param>
        <context-param>
            <param-name>com.icesoft.faces.concurrentDOMViews</param-name>
            <param-value>true</param-value>
        </context-param>
        
        
        <listener>
            <listener-class>com.icesoft.faces.util.event.servlet.ContextEventRepeater</listener-class>
        </listener>
        <servlet>
            <servlet-name>Faces Servlet</servlet-name>
            <servlet-class>javax.faces.webapp.FacesServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
            </servlet>
        <servlet>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <servlet-class>com.icesoft.faces.webapp.xmlhttp.PersistentFacesServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
        </servlet>
        <servlet>
            <servlet-name>Blocking Servlet</servlet-name>
            <servlet-class>com.icesoft.faces.webapp.xmlhttp.BlockingServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
        </servlet>
        <servlet>
            <servlet-name>uploadServlet</servlet-name>
            <servlet-class>com.icesoft.faces.component.inputfile.FileUploadServlet</servlet-class>
            <load-on-startup>1</load-on-startup>
        </servlet>
    
    
        <servlet-mapping>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <url-pattern>/faces/*</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <url-pattern>/xmlhttp/*</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>Persistent Faces Servlet</servlet-name>
            <url-pattern>*.iface</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>Blocking Servlet</servlet-name>
            <url-pattern>/block/*</url-pattern>
        </servlet-mapping>
        <servlet-mapping>
            <servlet-name>uploadServlet</servlet-name>
            <url-pattern>/uploadHtml</url-pattern>
        </servlet-mapping>
    
    
        <session-config>
            <session-timeout>
                30
            </session-timeout>
        </session-config>
    </web-app>
    </code>



Selanjutnya, mari kita buat konfigurasi JSF. File konfigurasinya bernama faces-config.xml. Ini diletakkan di dalam folder WEB-INF, di sebelah web.xml. Berikut adalah kodenya. 



### faces-config.xml



    
    <code><?xml version='1.0' encoding='UTF-8'?>
    <faces-config version="1.2" 
        xmlns="http://java.sun.com/xml/ns/javaee" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-facesconfig_1_2.xsd">
    
        <application>
            <view-handler>com.icesoft.faces.facelets.D2DFaceletViewHandler</view-handler>
        </application>
        
        
        <managed-bean>
            <managed-bean-name>renderManager</managed-bean-name>
            <managed-bean-class>com.icesoft.faces.async.render.RenderManager</managed-bean-class>
            <managed-bean-scope>application</managed-bean-scope>
        </managed-bean>
        
        <managed-bean>
            <managed-bean-name>serverClock</managed-bean-name>
            <managed-bean-class>tutorial.icefaces.ServerClock</managed-bean-class>        
            <managed-bean-scope>request</managed-bean-scope>
            <managed-property>
                <property-name>renderManager</property-name>
                <value>#{renderManager}</value>
            </managed-property>
        </managed-bean>
    </faces-config>
    </code>


Pada blok paling atas, kita mengkonfigurasi JSF agar menggunakan View Renderer Facelets yang sudah dilengkapi dengan ICEFaces. Di blok kedua, kita mendeklarasikan bean renderManager yang dibutuhkan oleh object kita serverClock pada blok ketiga. 

Bagi yang sudah biasa menggunakan Spring, konfigurasi ini tidak jauh berbeda dengan konfigurasi Dependency Injection Spring. Nantinya bila kita menggunakan Spring, kita juga bisa mendeklarasikan Spring bean kita di dalam faces-config.xml tersebut. 

Terakhir, jangan lupa lengkapi jar yang dibutuhkan agar kode kita bisa dikompilasi dan dideploy dengan mulus. Kombinasi jar yang dibutuhkan relatif bervariasi tergantung application server yang kita gunakan. Kadangkala ada jar yang sudah disediakan oleh application server tertentu, sehingga kita tidak perlu lagi menyediakan. Sebagai contoh, bila dideploy di Sun Application Server (Glassfish) yang terbundle bersama Netbeans 5.5, daftar jar yang dibutuhkan adalah: 




  * backport-util-concurrent.jar


  * commons-collections.jar


  * commons-digester.jar


  * commons-fileupload.jar


  * commons-logging-1.0.4.jar


  * el-api.jar


  * icefaces-comps.jar


  * icefaces-facelets.jar


  * icefaces.jar


  * krysalis-jCharts-1.0.0-alpha-1.jar


  * xercesImpl.jar


  * xml-apis.jar



Struktur folder akhir dari aplikasi ini adalah sebagai berikut. 

![Struktur Folder Aplikasi JSF ](/images/uploads/2007/03/folder-jsf.png)

Untuk Eclipse, daftar pustaka yang dibutuhkan sedikit berbeda. Demikian gambarnya. 
![Daftar pustaka ICEFaces untuk Eclipse ](/images/uploads/2007/07/ice-eclipse-lib.png)

Setelah semua file dibuat dan dipaket sesuai dengan aturan aplikasi web Java, kita bisa mendeploynya ke application server. Lalu, silahkan mengakses http://localhost:8080/HelloICE/whattimeisit.iface atau URL lain sesuai setting deployment. 

Hasilnya akan tampak seperti ini. 

![Tampilan Akhir Server Time ](/images/uploads/2007/03/result-jsf.png)

Namun demikian, ternyata halaman tersebut masih melakukan refresh setiap satu detik sehingga mengganggu pandangan. Oleh karena itu, mari kita aktifkan fitur partial submit yang dimiliki ICEFaces. Dengan fitur ini, halaman HTML akan diupdate secara parsial sehingga tidak perlu me-reload seluruh halaman. 

Buka file whattimeisit.xhtml dan cari baris berikut. 

    
    <code><body>
            <p>
                    <b>Waktu Server Saat Ini : #{serverClock.currentTime}</b>
            </p>
        </body>
    </code>



Ubah menjadi seperti ini. 

    
    <code><body>
            <p>
    		<ice:form partialSubmit="true">
                    <b>Waktu Server Saat Ini : #{serverClock.currentTime}</b>
    		</ice:form>
            </p>
        </body>
    </code>



Jangan lupa untuk mendeklarasikan komponen <ice:form> di awal halaman, dengan menggunakan tag <f:view> sebagai berikut. 

    
    <code><f:view xmlns:f="http://java.sun.com/jsf/core"
            xmlns:h="http://java.sun.com/jsf/html"
            xmlns:ice="http://www.icesoft.com/icefaces/component"></code>



Keseluruhan file whattimeisit.xhtml akan terlihat seperti ini. 

    
    <code><?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <f:view xmlns:f="http://java.sun.com/jsf/core"
            xmlns:h="http://java.sun.com/jsf/html"
            xmlns:ice="http://www.icesoft.com/icefaces/component">
    
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>What time is it</title>
    </head>
    <body>
    <ice:form>
    <p>
                    <b>Waktu Server Saat Ini : #{serverClock.currentTime}</b>
            </p>
    </ice:form>
    </body>
    </html>
    </f:view></code>



Redeploy aplikasi, dan lihat hasilnya. Tidak ada lagi flicker (kedipan). 

Eclipse project untuk contoh di atas dapat didownload [di sini](http://endy.artivisi.com/downloads/code/ICEStarter-20070726.tar.bz2).

Selamat mencoba, semoga bermanfaat. 
