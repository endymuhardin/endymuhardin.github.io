---
comments: true
date: 2012-07-28 13:45:07
layout: post
slug: monitoring-aplikasi-java
title: Monitoring Aplikasi Java
wordpress_id: 799
categories:
- java
---

Setelah aplikasi kita selesai dibuat, langkah selanjutnya tentu saja adalah menjalankannya di server production. Dalam software development, ini disebut dengan transisi dari development menjadi operation. 

Salah satu aspek penting dalam fase operation adalah monitoring performance. Monitoring dilakukan untuk berbagai tujuan, diantaranya : 





  * Mengetahui karakteristik aplikasi dalam menggunakan resource. Informasi ini bisa kita gunakan untuk melakukan tuning performance


  * Mengetahui karakteristik user dalam menggunakan aplikasi. Perilaku user ini berguna untuk menentukan waktu-waktu sibuk dan waktu-waktu idle, sehingga kita bisa melakukan capacity planning dengan akurat.


  * Mengetahui berapa persen resource yang sudah terpakai, sehingga kita punya gambaran kapan harus melakukan upgrade, dan apa yang harus diupgrade


  * Mendapatkan notifikasi secepat mungkin pada saat sistem mengalami gangguan


<!--more-->


Pada umumnya, monitoring dilakukan dengan memantau bagian-bagian dalam sistem, diantaranya : 

    
  * Dalam sistem operasi
        
            
    * Jumlah proses

            
    * CPU

            
    * Memori

            
    * Disk I/O

            
    * Network I/O

        
    

    
  * Dalam aplikasi
        
            
    * Jumlah thread

            
    * Alokasi memori

            
    * Class/method yang mengkonsumsi resource terbesar

            
    * Class/method yang memakan waktu lama

            
    * Untuk bahasa pemrograman yang berjalan di virtual machine (seperti Java, .NET, Ruby, dsb), kita juga perlu memantau perilaku Garbage Collector

        
    

    
  * Database Server
        
            
    * Jumlah koneksi yang dibuka baik yang idle maupun yang aktif

            
    * Query yang memakan waktu lama

            
    * Tabel yang sering diakses

        
    



Dalam melakukan monitoring, ada banyak tools yang digunakan. Beberapa aplikasi opensource yang populer diantaranya : 

    
  * Nagios

    
  * Icinga : ini adalah fork dari Nagios

    
  * Zenoss

    
  * Zabbix

    
  * OpenNMS

    
  * Hyperic



Pada umumnya, semua aplikasi di atas memiliki fitur yang mirip-mirip, yaitu : 

    
  * SNMP Monitoring. SNMP adalah protokol yang populer, tersedia di sistem operasi, network hardware (switch, router, dsb), bahkan aplikasi (Java VM, database server, dsb)

    
  * JMX Monitoring. JMX adalah protokol untuk memonitor aplikasi Java. Dengan menggunakan JMX, informasi yang diperoleh akan lebih rinci.

    
  * Agent dan Agentless Monitoring. Agent adalah aplikasi kecil yang diinstal di server yang ingin dimonitor. Dengan agent, informasi yang dikumpulkan bisa lebih detail. Di lain sisi, tidak semua tempat bisa dipasangi agent (misalnya router). Umumnya aplikasi monitoring mendukung monitoring dengan agent maupun tanpa agent. 



Cara instalasi dari aplikasi di atas bisa dibaca di websitenya masing-masing. Yang akan kita bahas di sini adalah cara konfigurasi aplikasi Java, khususnya yang menggunakan framework Spring dan Hibernate, agar bisa dimonitor oleh aplikasi-aplikasi di atas. 

Pada prinsipnya, berikut adalah hal-hal yang perlu dilakukan : 

    
  1. Menentukan metric atau jenis data yang akan dimonitor

    
  2. Mengaktifkan MBean agar metric tersebut dipublish melalui JMX

    
  3. Mengaktifkan JMX server agar bisa dihubungi dari aplikasi monitoring



Aplikasi yang akan kita jadikan contoh kasus adalah template standar aplikasi web ArtiVisi, yang [source codenya tersedia di Github](https://github.com/endymuhardin/belajar-restful).



## Menentukan metric


Beda jenis datanya, tentu beda juga cara pengumpulan data dan tools yang digunakan untuk mengolahnya. 

### Tabel Metrik dan Tools

Metric      | Metode Pengumpulan | Tools
------------|--------------------|------------------
CPU         | SNMP atau Agent    | Nagios,Zenoss,dkk
Memori      | SNMP atau Agent    | Nagios,Zenoss,dkk
Disk IO     | SNMP atau Agent    | Nagios,Zenoss,dkk
Network     | SNMP atau Agent    | Nagios,Zenoss,dkk
Tomcat      | JMX                | Hyperic
MySQL       | Agent              | Hyperic
Spring      | AOP                | Javamelody
Hibernate   | JMX                | Hyperic
    


## Monitoring dengan JavaMelody


Untuk mengaktifkan monitoring menggunakan JavaMelody, ada beberapa langkah yang perlu kita lakukan, yaitu : 
    
  1. Menambahkan jar JavaMelody
  2. Memasang AOP interceptor supaya bisa memonitor beans dalam Spring
  3. Mengaktifkan monitoring JavaMelody

Karena projectnya menggunakan Maven, maka menambahkan jar sangat mudah, cukup dengan menambahkan dependency sebagai berikut : 

{% gist 3192086 pom.xml %}

Selanjutnya, kita memasang interceptor supaya object yang kita buat dimonitor oleh JavaMelody. Biasanya kita memonitor implementasi proses bisnis. Berikut konfigurasi applicationContext.xml

{% gist 3192086 applicationContext.xml %}

Terakhir, kita aktifkan JavaMelody. Karena aplikasinya adalah aplikasi web, maka inisialisasi dilakukan di dalam file web.xml sebagai berikut 

{% gist 3192086 web.xml %}

Setelah selesai, kita bisa jalankan aplikasi seperti biasa. Untuk mengakses hasil monitoring, kita dapat mengakses url http://host:port/context-aplikasi/monitoring. 

Berikut adalah screenshotnya.

![JavaMelody-Charts](/images/uploads/2012/07/JavaMelody-Charts.png)



## Mengaktifkan MBean


Selain menggunakan JavaMelody, kita juga bisa melakukan monitoring menggunakan JMX. Beruntung kita yang menggunakan Spring, JMX akan sangat mudah dikonfigurasi. Pada contoh berikut, kita akan mengaktifkan monitoring terhadap statistik Hibernate. Langkah-langkahnya adalah sebagai berikut : 
    
  1. Mengaktifkan fitur statistik dalam Hibernate
  2. Mendeklarasikan MBean untuk memonitor statistik Hibernate
  3. Menginstankan JMX server (MBean Server)

Aktifasi fitur statistik dalam Hibernate dilakukan dengan mengisi nilai true pada variabel konfigurasi hibernate.generate_statistics, sebagai berikut : 

{% gist 3192099 hibernate-statistics.xml %}

Selanjutnya, statistik yang telah dihitung ini dipublish menggunakan MBean. 

{% gist 3192099 hibernateMBean.xml %}

{% gist 3192099 mbeanExporter.xml %}

Terakhir, kita sediakan MBean Server untuk menjalankan MBean yang sudah kita deklarasikan di atas. Spring sudah memudahkan konfigurasinya dengan namespace yang baru

{% gist 3192099 mbean-server.xml %}

Selanjutnya, jalankan aplikasi kita seperti biasa di Tomcat, Jetty, dsb. 
Setelah aplikasi berjalan, kita dapat melihatnya menggunakan JConsole. 

Jalankan JConsole, dan pilih proses yang akan dimonitor.

![jconsole-select-pid](/images/uploads/2012/07/jconsole-select-pid.png)

Tampilkan MBean Hibernate Statistics

![jconsole-hibernate-statistics](/images/uploads/2012/07/jconsole-hibernate-statistics.png)

Kita bisa lihat bahwa statistik Hibernate sudah dapat diakses. Informasi ini juga bisa ditampilkan di aplikasi monitoring seperti OpenNMS, Hyperic, dan aplikasi lain yang support JMX. 

Selain itu, kalau kita sudah mengaktifkan JavaMelody seperti dijelaskan di atas, MBean ini juga bisa ditampilkan di url yang sama seperti screenshot di bawah 

![javamelody-mbeans](/images/uploads/2012/07/javamelody-mbeans.png)




## Kesimpulan


Demikianlah hasil oprek-oprek sambil menunggu motor servis rutin. Dengan beberapa langkah sederhana, kita dapat memperoleh informasi lengkap tentang apa yang terjadi di aplikasi kita. Informasi ini selanjutnya dapat dijadikan pedoman untuk melakukan tuning performance. Selain itu, dengan menggunakan aplikasi pengolah data seperti [Rocksteady](http://code.google.com/p/rocksteady/), kita dapat membuat early warning system, yaitu suatu sistem yang dapat memprediksi terjadinya bencana dan memberikan notifikasi, sehingga kita bisa melakukan antisipasi.



## Referensi





    
  * [JMX Homepage](http://www.oracle.com/technetwork/java/javase/tech/javamanagement-140525.html)

    
  * [VisualVM Homepage](http://visualvm.java.net/)

    
  * [Cara menggunakan JConsole](http://java.sun.com/developer/technicalArticles/J2SE/jconsole.html)

    
  * [Cara konfigurasi Spring dan Hibernate](http://dzone.com/snippets/spring-jmx-sample)

    
  * [Menampilkan data dari JMX dengan Jolokia](http://nurkiewicz.blogspot.com/2011/03/jolokia-highcharts-jmx-for-human-beings.html)


