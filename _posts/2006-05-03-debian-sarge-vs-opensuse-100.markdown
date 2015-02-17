---
comments: true
date: 2006-05-03 18:01:13
layout: post
slug: debian-sarge-vs-opensuse-100
title: Debian Sarge vs OpenSuSE 10.0
wordpress_id: 68
categories:
- aplikasi
---

Di kantor saya ada PC berkualifikasi cukup canggih untuk ukuran workstation. Spesifikasinya P-4 3GHz HT, 4GB DDR, 2x80GB SATA, DVD RW. PC tersebut sebetulnya dibeli untuk menjadi server. Tetapi karena dia terlambat datang, semua aplikasi server sudah terinstal di mesin lain dan sudah terisi banyak data. Sebelum sempat semua data tersebut dimigrasi, tugas lain buat saya sudah datang bertubi-tubi, sehingga alhasil tidak sempat migrasi. Akhirnya, PC server tersebut turun kasta menjadi '_sekedar pembakar DVD saja_'.

Sejak menjadi pembakar DVD, effort untuk migrasi menjadi semakin sulit. Karena banyak oknum-oknum yang pinjam untuk membackup data. Kalau sekedar pinjam saja tidak masalah, tetapi kadang data yang mau dibackup dicopy dan tidak dibakar-bakar, sehingga semakin sulit untuk reinstall PC tersebut. 

Kenapa harus reinstall? Hmm, saya menggunakan Software-RAID dan LVM untuk mempartisi server tersebut, berjalan di atas Debian Sarge. Kernel yang digunakan Debian Sarge (pada waktu saya instal PC tersebut) adalah 2.6.8, sedangkan dukungan LVM baru ada di 2.6.13. Jadi, terpaksa menggunakan kernel 2.4.sekian yang sudah bisa menangani LVM. Tapi dengan kernel tersebut, memori yang didukung cuma maksimal 1GB, sehingga sisanya 3GB lagi makan gaji buta. Dengan demikian, solusi yang paling feasible adalah instal ulang dengan distro lain. Buat linux-mania yang sedang siap-siap tulis komentar, tidak usah repot-repot, "Saya tidak akan kompile kernel, terimakasih.... "

Berdasarkan anjuran [teman saya](http://sleepless.ngoprek.org), saya pilih [OpenSuSE 10.0](http://www.opensuse.org). Selain paketnya lebih maju daripada Debian, [mirrornya juga ada di Indonesia](http://suse.cbn.net.id). Belakangan saya tau kalo di CBN itu gak komplit. Tapi sudah terlambat ... :P

Jadi akhirnya saya lakukan juga migrasi ke OpenSuSE. Berikut adalah daftar aplikasi yang ingin dimigrasi: 



	
  * Repository Subversion dengan sebesar 5GB

	
  * Bug Database



Konfigurasi server: 

	
  * RAID + LVM

	
  * HTTPS

        
  * LDAP Authentication

        
  * PHPLDAPAdmin



Dan berikut adalah langkah-langkah migrasinya

1. Install subversion, jangan lupa [buat group repousers dan mask-script](http://endy.artivisi.com/blog/aplikasi/instalasi-subversion/)
2. Install apache2
3. [Dump data repository dari repo lama](http://endy.artivisi.com/blog/aplikasi/subversion-backup-dan-restore/)
4. Create repository di tempat baru, dan load hasil dump

5. Dump data otentikasi (username dan password) dari OpenLDAP yang lama
  `slapcat -c -l data-otentikasi.ldif`

6. Config slapd.conf



	
  * suffix = artivisi.com

	
  * disable rootdn dan rootpw. Di Debian tidak ada entri ini. Entri ini menyebabkan saya (entah kenapa) tidak bisa login, padahal username dan password sudah benar

	
  * access level




7. Load data otentikasi ke OpenLDAP yang baru
`slapadd -c -l data-otentikasi.ldif`

8. Konfigurasi Apache: 




	
  * Add user untuk apache (di OpenSuSE 10.0 namanya wwwuser, kalo di Debian www-data) dalam grup repousers

  	
  * Buat file svn.conf di folder conf.d

	
  * Instalasi Subversion bawaan OpenSuSE 10.0 tidak ada mod_dav_svn.so dan mod_authz_svn.so, jadi copy aja dari Debian

	
  * Selanjutnya [sama dengan tulisan saya sebelumnya](http://endy.artivisi.com/blog/aplikasi/konfigurasi-user-subversion-di-xampp/)




9. Instalasi PHPLDAPAdmin.


	
  * Download di [websitenya](http://phpldapadmin.sourceforge.net). Paket standar OpenSuSE tidak menyertakan, tidak seperti apt-get

	
  * Extract dan edit config.php

	
  * Install php-session bila ketemu error session_module_name() not found




10. Aktifkan https

	
  * [buat sertifikat](http://www.eclectica.ca/howto/ssl-cert-howto.php)

	
  * konfigurasi apache, buat vhost

	
  * [edit /etc/sysconfig/apache2, tambahkan ssl di APACHE_MODULES dan "SSL" di APACHE_SERVER_FLAGS](http://en.opensuse.org/SDB:Apache_2_FAQ_(Frequently_Asked_Questions)#How_do_I_configure_Apache_2_for_SSL.3F)



Kesimpulan akhir: 

	
  1. Paket instalasi apt-get di [rumahnya Si Komo](http://komo.vlsm.org) masih belum terkalahkan. Untuk menginstal aplikasi demi aplikasi di OpenSuSE, saya harus menjadi _human-cd-changer. Mirror sih ada, tapi internasional semua, sangat lemot dari tempat saya_. 

	
  2. Entah salah setting atau gimana, kecepatan komputer tidak se-responsif ekspektasi saya. 

	
  3. Paket aplikasi Debian masih jauh lebih kuno daripada OpenSuSE. Misalnya OpenOffice, di Debian  masih versi 1, sedangkan di distro lain sudah versi 2.

	
  4. Dukungan hardware OpenSuSE lebih banyak.

	
  5. Konfigurasi grafis disediakan dalam Yast, tapi modifikasi manual masih memungkinkan.




