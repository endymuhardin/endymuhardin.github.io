---
comments: true
date: 2011-01-07 11:28:25
layout: post
slug: instalasi-git-di-windows
title: Instalasi Git di Windows
wordpress_id: 578
categories:
- aplikasi
---

Setelah kemarin kita bahas [migrasi di sisi server](http://endy.artivisi.com/blog/lain/migrasi-subversion-ke-git/), sekarang kita bahas instalasi di client. Kenapa yang dijelaskan hanya Windows, sedangkan Linux tidak? Well, ini karena di Linux instalasinya begitu mudah sehingga terlalu pendek kalau ingin dijadikan satu posting sendiri. 

Gak percaya? Ini caranya install di Ubuntu. Buka command prompt, dan ketik 

    
    
    sudo apt-get install git-core git-svn git-gui gitk
    


Sedikit konfigurasi standar. 

    
    
    git config --global user.name "Endy Muhardin"
    git config --global user.email "endy.muhardin@geemail.com"
    git config --global color.ui "true"
    



Kemudian, bila kita belum punya public key, silahkan bikin seperti [tutorial di sini](http://endy.artivisi.com/blog/linux/login-ssh-dengan-private-key/). 

Dan selesailah sudah. Seperti saya bilang sebelumnya, singkat dan sama sekali gak seru. Gak ada screenshotnya :D

Nah, mari kita bahas instalasi di Windows. 

Pada intinya, langkah-langkahnya adalah sebagai berikut : 



	
  1. Instalasi Putty : Ini kita perlukan untuk membuat public key. Public key digunakan untuk berinteraksi dengan repository git di server. Apa itu public key dan apa manfaatnya sedikit banyak sudah dibahas [di artikel ini](http://endy.artivisi.com/blog/linux/login-ssh-dengan-private-key/). 

	
  2. Instalasi Git : Ini adalah aplikasi Git nya sendiri. Ada dua varian, Cygwin dan MSysGit. Kita akan gunakan yang lebih populer, yaitu MSysGit.

	
  3. Instalasi TortoiseGit : Seperti TortoiseSVN, ini adalah aplikasi GUI yang terintegrasi dengan Windows Explorer, sehingga pengelolaan repository dapat dilakukan di Windows Explorer seperti manipulasi file/folder biasa.

 





## Instalasi Putty


Putty bisa diunduh [di sini](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html). Pilih saja versi installer, supaya tidak pusing. 

Putty ini akan kita gunakan untuk membuat pasangan public key dan private key. Caranya adalah menggunakan aplikasi PuttyGen. Jalankan PuttyGen, dan klik tombol Generate. 
![Generate keypair ](/images/uploads/2011/01/01-ssh-generate-keypair-300x290.png)

PuttyGen akan membuatkan public key dan private key. Save private keynya. Kita akan membutuhkan ini nanti. Klik tombol Save Private Key, dan simpan di folder mana saja. 
![ ](/images/uploads/2011/01/02-ssh-save-keypair-300x210.png)

Terakhir, copy-paste text public keynya. Ini akan kita perlukan untuk dipasang di server supaya kita bisa mengakses repository di server, misalnya Github atau repository kantor. 
![ ](/images/uploads/2011/01/03-ssh-export-public-key-300x236.png)



## Instalasi Git


Pertama, [unduh dulu MSysGit](http://code.google.com/p/msysgit/). Di websitenya ada banyak file yang bisa diunduh. Kita perlu yang Git, bukan msysgit. Nama filenya diawali Git, seperti ini: Git-1.7.3.1-preview20101002.exe. Ambil saja versi yang terbaru. 

Setelah diunduh, tentu kita jalankan. Berikut screenshot next-next seperti biasa. 

![ ](/images/uploads/2011/01/01-msysgit-install-welcome-300x230.png)

![ ](/images/uploads/2011/01/02-msysgit-install-component-300x233.png)


![ ](/images/uploads/2011/01/03-msysgit-install-path-300x232.png)


![ ](/images/uploads/2011/01/04-msysgit-install-crlf-300x232.png)



## Instalasi TortoiseGit



TortoiseGit bisa [diunduh di sini](http://code.google.com/p/tortoisegit/). 
Setelah selesai mengunduh, lagi-lagi klik next-next. 

![ ](/images/uploads/2011/01/01-tortoisegit-install-welcome-300x233.png)

![ ](/images/uploads/2011/01/02-tortoisegit-install-sshclient-300x231.png)

Sampai di sini, instalasi Git sudah selesai. Tapi masih ada langkah tambahan supaya kita bisa melakukan clone dari repository server (misalnya Github). 



## Clone dari Github


Untuk bisa clone dari github, pertama kali kita harus punya account Github. Silahkan [daftar dulu](https://github.com/plans). 

Setelah punya account, login, dan kita akan melihat dashboard. 

![ ](/images/uploads/2011/01/01-github-dashboard-300x208.png)

Klik account setting, dan masuk ke menu SSH Public Keys

![ ](/images/uploads/2011/01/02-github-add-pubkey-300x206.png)

Pastekan public key yang sudah kita export menggunakan PuttyGen di atas. Setelah diadd, public key kita akan terdaftar. Kita boleh pasang public key banyak-banyak, karena biasanya satu public key mencerminkan satu komputer. Bisa saja kita punya PC dan juga Laptop. 
![ ](/images/uploads/2011/01/03-github-add-pubkey-completed-300x201.png)

Setelah public key didaftarkan, selanjutnya kita lihat repository yang kita punya. 
![ ](/images/uploads/2011/01/04-github-repositories-300x183.png)


Kalau belum punya repository, Anda bisa fork [repository belajarGit punya saya](https://github.com/endymuhardin/belajarGit), sehingga nanti Anda punya repo belajarGit sendiri. 

Setiap repository punya URL untuk melakukan clone. Copy paste URL clone repository. 
![ ](/images/uploads/2011/01/05-github-repo-belajarGit-300x208.png)

Untuk melakukan clone, buka Windows Explorer, klik kanan, dan pilih Git Clone. 
![ ](/images/uploads/2011/01/03-tortoisegit-use-clone-300x208.png)

Masukkan URL yang tadi kita copy dari Github, dan load private key yang kita buat dengan PuttyGen. 

![ ](/images/uploads/2011/01/04-tortoisegit-clone-info-300x200.png)

Putty akan melakukan komunikasi dengan Github. Kalau kita belum pernah clone dari Github sebelumnya, Putty akan menanyakan apakah kita ingin menerima koneksi dari Github. Jawab saja Yes. 
![ ](/images/uploads/2011/01/05-tortoisegit-clone-save-host-key-300x210.png)

Setelah kita jawab Yes, TortoiseGit akan mendownload repository dari Github untuk kita pakai di local, yang lebih dikenal dengan istilah clone. Ini ditunjukkan dengan progress bar kura-kura salto. Jumlah kura-kura yang salto tergantung dari ukuran repository kita. Semakin besar repositorynya, semakin banyak kura-kura yang salto. Bersabarlah, dan tunggu sampai semua kura-kura selesai melakukan aksinya. 

![ ](/images/uploads/2011/01/06-tortoisegit-clone-complete-300x211.png)

Sekarang repository sudah ada di local, dan siap digunakan. Bagaimana cara menggunakannya, stay tuned. Akan dibahas di posting berikutnya. 

