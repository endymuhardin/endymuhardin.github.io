---
comments: true
date: 2008-08-27 13:12:48
layout: post
slug: klikbca-bisnis-di-ubuntu
title: KlikBCA Bisnis di Ubuntu
wordpress_id: 338
categories:
- lain
---

Setelah menjadi pengusaha, KlikBCA saya berganti, dari Individual menjadi Bisnis. Hmm ... tentunya KlikBCA ini juga harus bisa diakses via Linux. 

Untuk mengakses KlikBCA Bisnis, kita harus dial up VPN dulu. BCA menyediakan installer untuk VPN dialer versi Windows. 

Google punya google, dapat link [ini](http://blogindra.sanjaya.org/2007/01/menggunakan-klikbca-bisnis-di-ubuntu.html) dan [ini](http://linux.or.id/node/1418). Tapi keduanya ternyata tidak menyelesaikan masalah. Ada beberapa hal yang kurang jelas. Mudah-mudahan posting ini bisa menjelaskan semuanya sehingga kita semua bisa berbisnis dengan BCA menggunakan Ubuntu Linux. 



Pertama, kita tetap butuh komputer Windows. Di komputer Windows ini, kita instal aplikasi KlikBCA Dialer. Tujuan utamanya adalah mendapatkan informasi koneksi VPN yang sebagian ada dalam file `KlikBCA Bisnis.pcf`. File ini bisa kita dapatkan di CD Installer, tapi ternyata formatnya berbeda dengan yang sudah terinstal. So, instal dulu dialernya, kemudian buka file `KlikBCA Bisnis.pcf` dengan text editor. 

Kita butuh beberapa informasi dari file ini, yaitu: 



	
  1. Host : Ini adalah nama komputer VPN Server

	
  2. GroupName



Kedua, kita butuh aplikasi kecil untuk mendekripsi field `enc_GroupPwd` dalam file `KlikBCA Bisnis.pcf`. Aplikasi tersebut bisa [diunduh di sini](http://newgre.net/passwordrevealer). Kopikan ke komputer Windows yang sudah terinstal dialer, dan jalankan. Nanti kita akan ditanya Profile mana yang mau didekripsi. Pilih saja `KlikBCA Bisnis.pcf`. Nanti dia akan menampilkan Group Password yang sudah terdekripsi. 

Selesai dengan Windows, silahkan diformat menjadi Ubuntu. 

Ketiga, instal dulu VPN Client dan interface Network Managernya. 

    
    sudo apt-get install vpnc network-manager-vpnc







Keempat, kita konfigurasi Network Manager Applet. Network Manager Applet adalah icon kecil di taskbar atas, sebelah kanan. Berikut contohnya. 

![ ](/images/uploads/2008/08/netman-applet.png)
_Gambar diambil dari [sini](http://www.gnome.org/projects/NetworkManager/)_. 

Pilih VPN Connections - Configure VPN. Nanti akan tampil daftar jaringan VPN yang sudah ada. Karena kita belum mengkonfigurasi, tentunya ini masih kosong. 

![ ](/images/uploads/2008/08/add-vpn.png)

Selanjutnya, klik Add untuk menambah jaringan VPN baru. Wizardnya akan muncul. 

![ ](/images/uploads/2008/08/01-create-vpn.png)

Kita akan disajikan pilihan VPN client yang tersedia. Pilih Cisco compatible. 

![ ](/images/uploads/2008/08/02-choose-protocol.png)

Masukkan data-data sesuai dengan isi file `KlikBCA Bisnis.pcf`. 

![ ](/images/uploads/2008/08/02a-gateway.png)

Dalam tab pertama, isikan: 



	
  * Gateway : Sesuai isi field Host

	
  * Group Name : Sesuai isi field GroupName







Klik tab Optional, lalu centang Override user name. 
![ ](/images/uploads/2008/08/02b-username.png)

Isikan Corporate Id + User Id yang diberikan BCA pada Anda. Kedua ID digabungkan tanpa spasi dan diisikan di textfield Override user name. 

Selesai konfigurasi, sekarang jika ingin connect, klik pada network manager applet : VPN Connections - KlikBCA Bisnis. Nanti akan muncul pertanyaan password dan group password. 

![ ](/images/uploads/2008/08/04-authenticate-vpn.png)

Password diisi dengan respon dari KeyBCA APPLI 1. Group password diisi dengan hasil dekripsi Group Password. Group password boleh disimpan di keyring, karena nilainya tidak berubah-ubah. Tapi password tidak perlu disimpan, karena nilainya berubah sesuai KeyBCA APPLI 1.

Kalau semua nilai yang diisikan benar, maka setelah menunggu sepeminuman teh, Anda akan segera terhubung ke VPN BCA. Ini ditandai dengan adanya tanda gembok pada network manager applet.

Untuk menyudahi koneksi VPN, bila Anda sudah selesai menggunakan KlikBCA Bisnis, klik lagi network manager applet : VPN Connections - Disconnect VPN. 

Beberapa linux user belum merasa macho kalau tidak mengedit text file. No problem, jika ingin connect via command line, begini caranya. 

Buat file `/etc/vpnc/default.conf`. Isinya sebagai berikut: 

    
    
    IPSec gateway <masukkan isi field Host>
    IPSec ID <masukkan isi field GroupName>
    IPSec secret <masukkan hasil dekripsi Group Password>
    Xauth username <masukkan CorporateID digabung dengan UserID>
    







Selesai konfigurasi. Sekarang dial dengan cara menjalankan: 

    
    sudo vpnc-connect





Nanti dia akan minta password. Masukkan respon APPLI 1 KeyBCA. 

Untuk mengakhiri koneksi VPN, jalankan: 

    
    sudo vpnc-disconnect





Selamat mencoba.
