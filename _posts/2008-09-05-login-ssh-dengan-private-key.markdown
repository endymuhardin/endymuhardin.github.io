---
comments: true
date: 2008-09-05 15:45:03
layout: post
slug: login-ssh-dengan-private-key
title: Login ssh dengan private key
wordpress_id: 368
categories:
- linux
---

Masih dalam rangka mengotomasi workflow di ArtiVisi, artikel ini akan membahas tentang cara memindahkan file antar komputer secara aman tapi otomatis. 

Ada berbagai cara kita memindahkan file dari satu komputer ke komputer lain, diantaranya: 



	
  * Menggunakan USB Flashdisk

	
  * Windows File Sharing

	
  * NFS

	
  * FTP atau SFTP

	
  * SCP

	
  * dan sebagainya



Cara pertama jelas tidak bisa diotomasi. 

Cara kedua sampai keempat mengharuskan kita membuka write access tanpa password di komputer tujuan supaya bisa otomatis. Kalau ada passwordnya kan harus ada seseorang yang mengetik password tersebut. Jadi agak sulit mengotomasinya. 

Oleh karena itu, kita akan membahas cara kelima, yaitu SCP. SCP --atau Secure Copy-- adalah mekanisme copy file melalui protokol SSH. File yang dikirim terenkripsi. Untuk dapat masuk ke komputer tujuan, kita harus melakukan otentikasi. Jadi ini adalah cara yang relatif aman untuk mengirim file. 

Tunggu dulu, katanya mau otomatis, tapi kok harus otentikasi?? Berarti harus ada yang mengetik password dong .... 

Tidak juga, makanya saya menggunakan istilah otentikasi, bukan password. SSH dapat melakukan otentikasi dengan password maupun private key. Pada artikel ini, kita akan membahas tentang otentikasi private key. 

Artikel ini dibuat menggunakan Ubuntu Hardy dengan openssh sudah terinstal. 



Ada beberapa langkah yang harus kita lakukan, yaitu: 

	
  1. Membuat private key di komputer pengirim

	
  2. Mengirim public key ke komputer tujuan

	
  3. Registrasi public key di komputer tujuan



Sebelum mulai, kita tentukan dulu studi kasusnya. 



> Di tengah pertarungan dengan Pain, guru genit Jiraiya tiba-tiba berhasil menemukan kelemahan musuhnya. Dia ingin mengirim file berisi informasi tersebut ke sang Hokage seksi, yaitu Tsunade. Rencananya, dia akan login ke server di markas dengan username Tsunade dan menyimpan file tersebut di folder `/home/tsunade/important`. 

Tentunya Tsunade tidak akan memberitahukan passwordnya kepada Jiraiya, mengingat tabiatnya yang genit. Sebagai gantinya, dia mendaftarkan public key Jiraiya ke user accountnya di server, sehingga Jiraiya bisa login sebagai Tsunade, tanpa Tsunade harus memberitahukan passwordnya kepada Jiraiya.



Pada cerita di atas, kita punya dua komputer, yaitu laptopnya Jiraiya yang dibawanya kemanapun pergi, dan server di markas. Kita juga punya dua user, yaitu Jiraiya dan Tsunade. 

Agar bisa melakukan public key authentication, tentunya hal pertama yang harus dilakukan adalah membuat public key. 



### Membuat public key


Jiraiya harus membuat public key di laptopnya sendiri. Public key selalu berpasangan dengan private key. Untuk membuat public key, Jiraiya mengetik perintah berikut di terminal. 

    
    
    ssh-keygen
    


Perintah tersebut akan menanyakan password untuk membuka private key. Jiraiya memilih tidak memberikan password. Sebetulnya ini kurang aman, karena kalau ada orang lain yang berhasil mendapatkan file private key, dia bisa login ke server di markas tanpa hambatan.

Tapi mau bagaimana lagi, hidup sebagai ninja sangat berbahaya. Kita tidak tahu apakah setelah pertarungan kita masih punya tangan untuk mengetik password. 

Tekan enter beberapa kali sampai selesai. Berikut output yang dihasilkan. 

    
    
    Generating public/private rsa key pair.
    Enter file in which to save the key (/home/jiraiya/.ssh/id_rsa): 
    Enter passphrase (empty for no passphrase): 
    Enter same passphrase again: 
    Your identification has been saved in /home/jiraiya/.ssh/id_rsa.
    Your public key has been saved in /home/jiraiya/.ssh/id_rsa.pub.
    The key fingerprint is:
    6f:7c:e2:52:f1:14:5d:2c:7f:3a:53:5e:fe:7f:98:9c jiraiya@laptop
    



Selanjutnya, kita harus kirimkan file public key ke Tsunade agar didaftarkan di accountnya. File public key ini bisa ditemukan di folder `/home/jiraiya/.ssh/` dengan nama `id_rsa.pub`. Public key bisa dikirim melalui media apapun, misalnya email, usb flashdisk, burung hantu, maupun burung merpati.



### Registrasi Public Key


Singkat kata, Tsunade telah menerima public key dari Jiraiya. Dia harus mendaftarkannya di accountnya agar Jiraiya bisa login. 

Tsunade harus login dulu ke server dan menaruh file public key tersebut di sana. Misalnya dia letakkan di folder `/home/tsunade/` dan nama filenya diubah menjadi `jiraiya_id_rsa.pub`. 

Untuk meregistrasinya, Tsunade menggunakan perintah berikut di terminal. 

    
    
    cat /home/tsunade/jiraiya_id_rsa.pub >> /home/tsunade/.ssh/authorized_keys
    


Setelah itu, public key tidak lagi diperlukan, sehingga bisa dihapus. 

    
    
    rm /home/tsunade/jiraiya_id_pub
    


Selesai sudah konfigurasi di server, sekarang kita kembali ke pertarungan Jiraiya vs Pain.



### Login dengan public key





> Sesaat sebelum Jiraiya menekan tombol Send di Mozilla Thunderbird, Pain mendaratkan serangan mematikan ke Jiraiya, sehingga ybs tidak dapat menggerakkan tangannya. Jiraiya membatin, "Untung saja saya sudah setup public key di server dengan account Tsunade. Baiklah, mari kita scp saja."



Untuk mengirim file tersebut melalui scp dengan public key, berikut adalah perintahnya 

    
    
    scp -i /path/menuju/private/key username@komputer-tujuan:folder-tujuan
    


Jadi, untuk mengirim file `pain-secret.txt` ke server dengan username tsunade, Jiraiya menggunakan perintah berikut 

    
    
    scp -i /home/jiraiya/.ssh/id_rsa pain-secret.txt tsunade@server:/home/tsunade/important/
    


File akan segera terkirim tanpa harus mengetik password. 

Lebih lanjut tentang ssh dengan public/private key bisa dibaca [di sini](http://www.debuntu.org/ssh-key-based-authentication). 

Lebih lanjut tentang nasib Jiraiya bisa dibaca [di sini](http://narutochaos.com/download/10/429).  

Selamat mencoba
