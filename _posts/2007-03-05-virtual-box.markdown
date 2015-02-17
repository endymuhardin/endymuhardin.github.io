---
comments: true
date: 2007-03-05 10:46:56
layout: post
slug: virtual-box
title: Virtual Box
wordpress_id: 203
categories:
- aplikasi
---

Oom Sindu beberapa hari ini berisik sekali membahas [Virtual Box](http://www.virtualbox.org). [Sudah](http://sindu.web.id/blog/2007/02/21/virtualbox-ubuntu-edgy/) [beberapa](http://sindu.web.id/blog/2007/02/22/winxp-on-ubuntuvirtualbox/) [artikel](http://sindu.web.id/blog/2007/02/22/static-ip-in-virtualbox/) dia tulis, sehingga akhirnya saya tertarik untuk mencoba. 

[Virtual Box](http://www.virtualbox.org) adalah aplikasi virtualization. Gunanya untuk menjalankan OS (Operating System) di dalam OS. Misalnya komputer kita berisi Linux, kemudian kita ingin mencoba berbagai 'distro' Windows seperti Vista atau 2003 server. Agar kita tidak repot, gunakan aplikasi virtualization sehingga kita bisa menjalankan OS lain seperti layaknya menjalankan aplikasi biasa. Dalam satu virtual machine, kita bisa menjalankan banyak OS lain. 

Saya adalah penggemar berat aplikasi virtualization. Alasannya, saya menggunakan Linux sebagai OS utama, tapi masih harus menggunakan Windows untuk membuat dokumen untuk orang lain. Selain itu, saya juga butuh beberapa versi browser untuk mengetes aplikasi web yang saya buat. 

Aplikasi virtualization juga sangat bermanfaat untuk project software development. Kita bisa buat satu virtual machine untuk menghosting Subversion repository server, bugtracker, aplikasi project management, dan build server. Backupnya juga mudah. Cukup copy file virtual machine tersebut ke DVD. Biasanya saya gunakan VM berukuran 8 GB, sehingga butuh 2 DVD sekali backup. When disaster strike, cukup copy file backup, server langsung up kembali tanpa butuh waktu lama untuk instal dan konfigurasi.

Dalam dunia virtualization, dikenal istilah host OS (OS tuan rumah) dan guest OS (OS tamu). Host OS adalah sistem operasi utama kita, sedangkan guest OS adalah OS yang berjalan di atas virtual machine. 

Sebelum ini, saya sudah mencoba beberapa aplikasi lain, seperti [VMWare](http://www.vmware.com/), [Qemu](http://fabrice.bellard.free.fr/qemu/), dan [Xen](http://www.xensource.com/). Notebook saya memiliki spesifikasi Centrino 1.8GHz dan 512 (shared) RAM. Hasilnya, Xen tidak berhasil diinstal dengan pesan error 'something about unsupported kernel and processor'. [VMWare Server (gratis)](http://www.vmware.com/products/free_virtualization.html) dan Qemu (open source) berhasil diinstal dengan mulus. Pada waktu dijalankan, Qemu sedikit lebih ringan daripada VMWare. Dengan VMWare, pada saat guest OS Windows 2000 saya nyalakan, guest OS berjalan seperti keong racun abis kena garam. Sangat pelan. Padahal belum ada aplikasi yang dijalankan di guest OS. Praktis guest OS berikut host OS (Ubuntu Dapper) tidak dapat digunakan, karena ke-lemot-annya sudah mencapai taraf unusable. 

Dengan Qemu, guest OS berjalan lambat, tapi host OS masih bisa digunakan dengan nyaman. 

Ok, sekarang kita bahas virtualbox. Dari sisi instalasi, tidak ada masalah berarti. Ada beberapa petunjuk instalasi di [blog Ubuntu Indonesia](http://ubuntulinux.or.id/blog/?p=271) dan [blog Oom Sindu](http://www.sindu.web.id) yang bisa diikuti. 

Khusus untuk saya, setelah langkah-langkah pada tutorial di atas dilakukan, virtualbox masih belum jalan. 
Saya harus menjalankan perintah berikut 

`$ sudo make -C /opt/VirtualBox-1.3.6/src install`

karena ada sedikit masalah dengan kernel module. 

Setelah itu, Virtual Box dapat dijalankan dengan sempurna. 

Setelah saya instal Windows 2000 Professional (tahu diri gak berani install Vista dengan spec pas-pasan ;p), saya sangat terkesan. Guest OS berjalan dengan mulus dan cukup responsif tanpa mengganggu Host OS. Saat mengetik artikel ini, saya sedang menginstal Service Pack 4 di Guest OS. Di Host OS, saya sedang mendengarkan [podcast David Maister](http://www.davidmaister.com/podcasts/), browsing Firefox dengan 6 tab terbuka, 2 diantaranya GMail dan Google Calendar -dua aplikasi web yang terkenal rakus memori karena terlalu 'ajax'. 

Hebatnya, tidak patah sedikitpun. Baik guest OS dan host OS dapat dijalankan dengan nyaman. 
Good luck trying the same using VMWare. Hmm .. saya jadi teringat iklan DVD player di TV yang diperankan Basuki. 

Bravo Virtual Box. Best things in the world available for free. :D
