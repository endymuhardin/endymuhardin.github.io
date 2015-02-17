---
comments: true
date: 2009-06-03 13:46:00
layout: post
slug: ejb-remote-clien
title: Mengakses EJB secara Remote
wordpress_id: 428
categories:
- java
---

Mengakses EJB secara Remote

Beberapa buku tentang EJB, seperti EJB 3 in Action karangan Reza Rahman maupun Enterprise Java Beans 3.0 karangan Bill Burke, membahas secara detail tentang penggunaan EJB. Akan tetapi, ada satu hal kecil namun penting yang tidak dibahas. Bagaimana cara mengakses EJB secara remote?

Di sisi server, ini mudah. Cukup membuat remote interface saja beres. Tapi bagaimana cara lookupnya dari client? Artikel ini akan membahas cara memanggil EJB dari method main. 



Sebelumnya, berikut adalah EJB yang akan kita panggil. 



### HaloBean.java



    
    
    package com.artivisi.belajar.ejb.session;
    
    @Stateless
    public class HaloBean implements HaloRemote {
       public String halo(String nama) {
         return "Halo "+nama;
       }
    }
    






### HaloRemote.java



    
    
    package com.artivisi.belajar.ejb.session;
    
    @Remote
    public interface HaloRemote {
       public String halo(String nama);
    }
    



EJB ini akan kita deploy ke Glassfish menggunakan Netbeans. Bagaimana caranya? Silahkan buka menu Help Netbeans. 

Berikut adalah kode untuk memanggil HaloBean secara remote. 




### HaloClient.java



    
    
    package com.artivisi.belajar.ejb.client;
    
    public class HaloClient {
      public static void main(String[] args){
        // 0. Konfigurasi host dan port
        String ejbHost = "localhost";
        String ejbPort = 12345;
        String ejbName = HaloRemote.class.getName();
      
        // 1. JNDI Context
        Properties props = new Properties();
        props.put("org.omg.CORBA.ORBInitialHost", ejbHost);
        props.put("org.omg.CORBA.ORBInitialPort", ejbPort);
        
        InitialContext ctx = new InitialContext(props);
        
        // 2. Lookup EJB
        HaloRemote haloBean = (HaloRemote) ctx.lookup(ejbName);
        
        // 3. Panggil methodnya
        System.out.println("Halo EJB : "+haloBean.halo("endy"));
      }
    }
    



Ada beberapa variabel yang perlu diperhatikan di sini, yaitu ejbHost, ejbPort, dan ejbName. Variabel ejbHost tentunya adalah komputer tempat EJB dideploy. Variabel ejbPort adalah port yang digunakan oleh Application Server untuk mempublish EJB. Port ini berbeda-beda tergantung merek application server dan cara deploymentnya. Karena saya menggunakan Netbeans untuk mendeploy ke Glassfish, maka saya harus cari tahu dulu berapa port yang digunakan Netbeans. 

Caranya, login ke admin console Glassfish melalui Netbeans. Buka tab Services, klik kanan Glassfish, dan pilih View Admin Console. 
(/images/uploads/2009/06/netbeans-view-admin-console.png)
Browser akan terbuka dan menampilkan halaman login Glassfish. 
(/images/uploads/2009/06/glassfish-login.png)
Setelah login, klik Application Server di panel kiri. Port yang digunakan akan ditampilkan di panel kanan, yaitu dengan nama IIOP Port(s). Coba-coba saja semuanya. Di komputer saya, port yang benar adalah 10275.
(/images/uploads/2009/06/glassfish-iiop-port.png)
Variabel ejbName juga berbeda tergantung dari application server yang digunakan. Baca dokumentasi server Anda untuk memastikannya. 

