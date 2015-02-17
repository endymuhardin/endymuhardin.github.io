---
comments: true
date: 2009-03-03 08:04:24
layout: post
slug: vmware-eth
title: Network Device menghilang di VMWare
wordpress_id: 404
categories:
- linux
---

Saya menggunakan VMWare secara intensif dalam proses development. 
Salah satu penggunaannya adalah untuk menginstal aplikasi atau database milik client. Beberapa merek database seperti Oracle relatif invasif terhadap sistem, misalnya mendikte jumlah swap ataupun mengharuskan mengedit kernel parameter. Tentunya ini membuat kotor sistem operasi saya. 

Selain itu, kadangkala client menggunakan sistem operasi yang berbeda dengan yang saya gunakan. Ini juga dapat diselesaikan dengan menggunakan VMWare. 

Saya menyimpan file-file VM di harddisk eksternal, untuk meningkatkan performance. Menurut [Jeff Atwood](http://www.codinghorror.com), kinerja VM akan meningkat bila dia berada di harddisk yang berbeda dengan hostnya. 

Penyimpanan di harddisk eksternal ini ternyata mengundang sedikit masalah. Kadangkala network interface VM saya menghilang. Masalah ini terjadi pada kombinasi host Ubuntu dan guest Ubuntu. 

Setelah googling kesana kemari, ternyata ini disebabkan oleh beberapa hal : 




  1. Ubuntu me-mount partisi harddisk eksternal secara acak. Kadang partisi 1 dimount ke /media/disk-1, kadang ke /media-disk-2


  2. Bila posisi mount berubah, VMWare akan menggenerate UUID (ID unik untuk guest VM) baru


  3. Setiap kali UUID berubah, MAC Address network interface guest VM juga berubah.


  4. Ubuntu di guest VM meng-cache MAC address, sehingga kalau MAC yang dia cache tidak ada, network interface tersebut tidak akan diload


Solusinya mudah, yaitu menghapus cache MAC address di guest Ubuntu, dan merestartnya. Caranya, login ke guest OS, lalu hapus file /etc/udev/rules.d/70-persistent-net.rules. Setelah itu restart. 


    
    
    sudo rm /etc/udev/rules.d/70-persistent-net.rules
    sudo reboot
    



Setelah restart, guest VM akan kembali memiliki ethernet card.


