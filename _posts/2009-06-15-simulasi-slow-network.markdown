---
comments: true
date: 2009-06-15 08:21:33
layout: post
slug: simulasi-slow-network
title: Simulasi Slow Network
wordpress_id: 467
categories:
- linux
---

Di salah satu proyek ArtiVisi, kita memiliki aplikasi client-server yang terhubung melalui koneksi internet berbandwidth kecil. Client menghubungi server melalui modem GPRS. 

Permasalahannya adalah bagaimana cara mengetes koneksi lemot ini pada saat development? Umumnya pada saat development kita menjalankan server dan client di komputer yang sama. Atau kalaupun di komputer berbeda, dijalankan di satu LAN, sehingga kecepatan bisa mencapai 100Mbps. 

Ada dua alternatif yang bisa kita gunakan. Yang pertama adalah aplikasi tc (traffic control) yang biasanya sudah terinstal secara default di Ubuntu. Kalau belum terinstal, kita bisa menginstal paket iproute atau iproute2, tergantung distro yang Anda gunakan. 

Alternatif kedua, menggunakan aplikasi ip_relay. Aplikasi ini bisa diinstal dengan nama paket iprelay. 

Berikut adalah referensi pemakaian tc : 



	
  * [pipita's blog](http://www.kdedevelopers.org/node/1878)

	
  * [Henry's Point](http://henrydu.com/blog/how-to/simulate-a-slow-link-by-linux-bridge-123.html)



Dan ini adalah referensi pemakaian iprelay : 

	
  * [Ubuntu Forum](http://ubuntuforums.org/showthread.php?t=670628)

	
  * [Readme di website ip_relay](http://www.stewart.com.au/ip_relay/README)






