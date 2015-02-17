---
comments: true
date: 2006-02-22 13:35:37
layout: post
slug: vmware-gratis
title: VMWare Gratis !!!
wordpress_id: 29
categories:
- aplikasi
---

Tahu [VMWare](http://www.vmware.com)? Itu adalah aplikasi yang dapat membuat komputer baru di dalam komputer kita. 

Jadi nanti, kalo diinstal, kita bisa bikin komputer palsu (virtual machine). Komputer palsu ini dapat dinyalakan dan dimatikan. Kalo dinyalakan, tampilannya benar-benar seperti komputer menyala, yaitu ada memory check, bisa masuk BIOS, bahkan bisa boot via jaringan segala. 

Setelah dibuat, komputer palsu tersebut bisa kita instal sistem operasi apa saja. Jumlah komputer palsu yang dibuat juga bisa lebih dari satu. Setiap komputer palsu bisa kita kasi jatah memori dan harddisk sesuai keinginan. Jadi bisa saja terjadi, dalam satu komputer kita menjalankan tiga distro linux (Ubuntu, Debian, Fedora) dan dua versi windows (XP dan 2000) secara berbarengan. 

Aplikasi VMWare ini sangat penting apabila kita mengembangkan aplikasi yang harus bisa bekerja dengan baik di berbagai sistem operasi dan konfigurasi. 
Jadi kita tidak perlu punya banyak komputer untuk bisa mengetes aplikasi secara simultan. 

Beberapa minggu yang lalu, VMWare menggratiskan [aplikasi servernya](http://www.vmware.com/news/releases/server_beta.html).  Wah ... langsung saya buru-buru [download](http://www.vmware.com/download/server/) dan instal. 

Instalasi di Linux (Debian Sarge) membutuhkan kernel header. Jadi, lakukan ini dulu: 

    
```apt-get install kernel-headers-2.6-686-smp ```


Baru kemudian instal VMWare.

Instalasi VMWare gampang, tinggal login sebagai root, jalankan skrip instalasi, dan next beberapa kali. Kita akan diminta memasukkan serial number. Serial number ini akan dikirim ke alamat email kita pada saat kita registrasi di websitenya. Untuk bisa mendownload kita harus teregistrasi terlebih dahulu.

Setelah VMWare terinstal, kita dapat mulai membuat komputer palsu sebanyak mungkin.
Sekarang saya bisa menggunakan Visio dan M$ Project di komputer Linux saya.
:D
