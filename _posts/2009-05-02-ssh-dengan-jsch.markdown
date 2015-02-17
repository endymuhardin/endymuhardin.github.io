---
comments: true
date: 2009-05-02 17:38:00
layout: post
slug: ssh-dengan-jsch
title: SSH dengan JSch
wordpress_id: 422
categories:
- java
---

Mengakses Remote Server dengan Java

Kita sudah biasa mengakses komputer lain menggunakan SSH. 
Cukup ketikkan ssh username@namaserver, tekan enter, dan lakukan apa yang kita mau. 
Nah, bagaimana kalau kita ingin membuat aplikasi yang butuh mengakses komputer lain?
Misalnya, kita ingin membuat aplikasi sederhana yang menampilkan input IP Address, Username, Password serta tombol Shutdown. 
Begitu input field kita isi dan tombol Shutdown ditekan, aplikasi kita akan melakukan ssh ke komputer tersebut dan menjalankan perintah shutdown -h now.

Di Java, hal ini dapat dengan mudah dilakukan menggunakan pustaka [JSch](http://www.jcraft.com/jsch/). Berikut langkah-langkah untuk menggunakan JSch.





## Mendapatkan Pustaka JSch


Tentunya yang pertama kita lakukan adalah membuka [website JSch](http://www.jcraft.com/jsch/) dan mengunduh rilis terbaru. Pilih yang ZIP, jangan yang JAR, karena di dalamnya ada beberapa contoh penggunaan yang akan kita butuhkan untuk mencontek nantinya. 

Paket ZIP ini belum dikompilasi, dan kita membutuhkan [Ant](http://ant.apache.org) untuk melakukan proses build. Jika Anda belum pernah menggunakan Ant, baca dulu [tutorial ini](http://endy.artivisi.com/downloads/writings/Tutorial-Ant.pdf). Setelah proses build selesai dilakukan, akan muncul file *jar di dalam folder dist. 




## Template Aplikasi Java


Buatlah project Java menggunakan editor yang Anda sukai. Pastikan jar JSch sudah terdaftar di project Java yang barusan dibuat. Setelah itu, buatlah Java Class sebagai berikut 


    
    
    public class JschDemo {
        public static void main(String[] args) throws Exception {
    
        }
    }
    



Untuk selanjutnya, kode program akan ditulis di dalam method main.



## Parameter koneksi


Untuk melakukan koneksi ke komputer lain, kita memerlukan beberapa variabel, ditunjukkan dengan kode sebagai berikut. 


    
    
    String host = "localhost";
    String user = "endy";
    String pass = "java";
    String command = "shutdown -h now";
    



Kita akan melakukan koneksi ke komputer kita sendiri (localhost) dengan username endy dan password java. Setelah berhasil terhubung, kita akan menjalankan perintah shutdown -h now. 



## Pre Requisite


Agar kode program kita bisa dijalankan, ada beberapa persyaratan sebagai berikut: 




  * Komputer yang ingin dihubungi harus menjalankan SSH server


  * Komputer yang ingin menghubungi harus melakukan koneksi SSH secara manual terlebih dulu, 
   agar komputer tujuan terdaftar di file known_hosts


  * User yang digunakan untuk koneksi harus memiliki akses yang cukup untuk melakukan perintah yang diinginkan






## Menggunakan JSch


Setelah parameter koneksi kita deklarasikan, dan juga prasyarat di komputer tujuan dipenuhi, sekarang kita bisa mulai menggunakan JSch. 
Pertama, kita instankan dulu object dari class JSch. 


    
    
    JSch jsch = new JSch();
    



Kemudian, kita berikan database known_hosts, yaitu daftar komputer tujuan beserta public keynya. Ini berguna untuk melakukan verifikasi terhadap komputer tujuan. 


    
    
    jsch.setKnownHosts("/home/endy/.ssh/known_hosts");
    



File known_hosts ini akan otomatis dibuat bila kita melakukan koneksi SSH ke komputer lain. Itulah sebabnya kita harus melakukan koneksi manual terlebih dulu, sehingga public key komputer tujuan sudah terdaftar dalam file ini. Alternatif dari menggunakan file ini adalah [mendaftarkan public key di komputer tujuan dan menggunakan private key untuk login](http://endy.artivisi.com/blog/linux/login-ssh-dengan-private-key/). 

Selanjutnya, kita membuka koneksi ke komputer tujuan


    
    
    Session session = jsch.getSession(user, host);
    session.setPassword(pass);
    session.connect();
    



Lalu, kita membuka channel. Channel menggambarkan bentuk interaksi kita dengan komputer tujuan. JSch menyediakan beberapa jenis channel, misalnya exec dan shell. Kita menggunakan exec untuk mengeksekusi satu perintah saja. Sedangkan shell bisa digunakan untuk membuka terminal interaktif yang bisa kita berikan perintah sebanyak kita mau. 


    
    
    ChannelExec channel = (ChannelExec) session.openChannel("exec");
    channel.setCommand(command);
    channel.connect();
    



Kita bisa membaca output dari perintah yang kita jalankan menggunakan I/O Stream seperti biasa. 


    
    
    BufferedReader reader = new BufferedReader(new InputStreamReader(channel.getInputStream()));
    String output = reader.readLine();
    while (output != null) {
        System.out.println(output);
        output = reader.readLine();
    }
    reader.close();
    



Segera setelah perintah selesai dijalankan, kita mengakhiri channel dan session. 


    
    
    channel.disconnect();
    session.disconnect();
    



Berikut adalah keseluruhan kode program. 


    
    
    public class JschDemo {
    
        public static void main(String[] args) throws Exception {
    	String host = "localhost";
    	String user = "endy";
    	String pass = "java";
    	String command = "shutdown -h now";
    
            JSch jsch = new JSch();
            jsch.setKnownHosts("/home/endy/.ssh/known_hosts");
    
            Session session = jsch.getSession(user, host);
            session.setPassword(pass);
            session.connect();
    
            ChannelExec channel = (ChannelExec) session.openChannel("exec");
            channel.setCommand(command);
            channel.connect();
    
            BufferedReader reader = new BufferedReader(new InputStreamReader(channel.getInputStream()));
            String output = reader.readLine();
            while (output != null) {
                System.out.println(output);
                output = reader.readLine();
            }
            reader.close();
    
            channel.disconnect();
            session.disconnect();
    
        }
    }
    



Selamat mencoba. Bila percobaan Anda sukses, komputer yang sedang Anda gunakan akan shutdown setelah aplikasi selesai dijalankan.
:D

