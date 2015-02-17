---
comments: true
date: 2005-10-10 15:07:50
layout: post
slug: rumah-baru-ii
title: Rumah baru II
wordpress_id: 6
categories:
- life
---

Hari ini saya dapat komputer baru. Spesifikasinya lumayan banget, Prosesor P-IV 3 GHz, memori 1GB, dan harddisk SATA 80GB, plus DVD-ROM. Rencananya, mesin ini selain untuk office work, juga akan jadi server sementara. 

Kegiatan pertama, bagi sebagian besar orang adalah instal sistem operasi. Buat saya, ada satu kegiatan lagi sebelum instal, yaitu pilih sistem operasi.

Sudah jelas, yang akan saya instal adalah Linux. Sejak meninggalkan Windows tahun 2002 yang lalu, saya merasa seperti naik baswei (baca: busway) jam 5 sore. Melihat ke kiri jalan, kemacetan panjang sekali seperti ular naga, tetapi saya tetap bisa melaju kencang menuju Blok M dalam waktu 30 menit saja. Di dalam busway Linux, saya tetap bisa produktif bekerja pada saat orang lain repot mengupdate antivirus (instal saja tidak cukup, harus up to date juga dong :P), membuang spyware, melakukan defrag, bersih-bersih registry, dan kegiatan non-produktif lainnya.

Nah, pertanyaannya, Linux yang mana? 
Saya adalah fans berat [Debian](http://www.debian.org). [Fedora](http://fedora.redhat.com) terlalu sulit buat saya. [Mandriva](http://www.mandriva.org), mudah bagi pemula, tapi justru menyulitkan bagi pengguna veteran. 
Tapi di debian sendiri juga banyak variannya, misalnya [Knoppix](http://www.knoppix.org), [Mepis](http://www.mepis.org), [Ubuntu](http://ubuntulinux.org), dan lainnya. 

Knoppix, bagus untuk LiveCD, tapi jelek sekali kalau diinstal di harddisk. Struktur foldernya jelek dan sudah tidak standar lagi. Mungkin karena memang dioptimasi untuk kemudahan remastering.

Mepis bagus, tapi repositorynya tidak kompatibel dengan debian. Untuk pengguna desktop sangat bagus, tapi karena saya mau instal buat macam2 server, di belakang hari menyulitkan.

Ubuntu, sangat bagus ... untuk end user. Buat saya, masalah sudo sangat merepotkan. Default instalasinya juga Gnome, sedangkan saya pengguna KDE. Saya sudah berusaha membiasakan diri dengan Gnome, tapi aplikasi-aplikasi Gnome masih kalah (menurut saya) dengan KDE. Saya lebih suka pakai KMail, Akregator, Konqueror daripada Evolution dan Nautilus.

Akhirnya, saya back to basic. Pakai debian murni saja. Toh di sini koneksi IIX laksana LAN. Jadi bisa ambil ke servernya [Komo](http://komo.vlsm.org) dengan cepat. 

Nah, sekarang instalasi. Saya tidak punya CD Writer, jadi walaupun bisa donlod ISO dengan cepat, tetap tidak bisa instal. Akhirnya pakai cara curang sbb :  



	
  1. [Download](http://komo.vlsm.org/debian/dists/Debian3.1r0/main/installer-i386/current/images/netboot/debian-installer/i386/2.6/) image instalasi jaringan dari Debian (ingat, gunakan kernel 2.6)


	
  2. Instal Ubuntu

	
  3. Kopikan image instalasi ke Ubuntu

	
  4. Konfigurasi GRUB untuk menambahkan image instalasi

	
  5. Restart, dan mulai instalasi.





Cara ini diinspirasi dari [teknik menginstal Linux tanpa CDROM, Floppy, USB, atau media lainnya](http://marc.herbert.free.fr/linux/win2linstall.html).

Setelah itu, berikut beberapa aplikasi wajib yang akan diinstal : 
1. Midnight Commander
2. SSH
3. MySQL
4. PostgreSQL
5. Apache 2
6. PHP 4
7. Postfix Mail Server
8. Subversion Version Control
9. CVS Version Control
10. Firestarter (Firewall Front End)
11. KDE

Selanjutnya, tinggal mengkonfigurasi. 

Satu lagi, dengan menggunakan Linux, tidak perlu cari satu-satu, download, klik next beberapa kali, dan restart komputer. 
Untuk menginstal semua di atas, cukup ketik saja : 

    
    apt-get install mc kde mysql-server postgresql apache2 php4 postfix firestarter subversion cvs kde -y


sebagai root.
Lalu ... sit back and relax .... literally.
