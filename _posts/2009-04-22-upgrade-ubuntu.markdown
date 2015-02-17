---
comments: true
date: 2009-04-22 16:10:37
layout: post
slug: upgrade-ubuntu
title: Upgrade Ubuntu
wordpress_id: 420
categories:
- linux
---

Sebentar lagi Ubuntu terbaru akan rilis. Seperti biasanya, saya akan menjalankan ritual 6 bulanan yang terdiri dari kegiatan sbb: 




  * Unduh ISO Ubuntu terbaru


  * Bakar ke CD


  * Backup isi home folder


  * Backup mailbox Thunderbird


  * Remove semua hidden file di home folder


  * Reinstall Ubuntu dengan memformat partisi sistem



Saya tidak terlalu suka upgrade, karena banyak menyisakan sampah dan jebakan. Lebih nyaman dan cepat memformat partisi sistem daripada troubleshoot hasil upgrade. 

Karena ritual ini akan terus dilakukan di masa depan, ada baiknya kita optimasi workflownya agar lebih efisien. 



Berikut adalah requirement saya untuk workflow upgrade ini: 


  * Saya memiliki beberapa aplikasi yang mandatory tapi tidak termasuk dalam paket default Ubuntu, seperti Java SDK, Thunderbird, Inkscape, dan beberapa aplikasi lain. Saya ingin menyimpan daftar aplikasi ini, dan me-reuse-nya setiap kali upgrade.


  * Saya ingin memisahkan proses download *.deb yang memakan waktu lama dengan proses instalasi aplikasi. Tujuannya, agar proses download *.deb ini bisa 'dititipkan' di komputer lain yang online 24/7. Setelah selesai, hasilnya tinggal dicopy ke komputer saya, dan langsung diinstal



Setelah browsing [kesana](
) [kemari](http://beans.seartipy.com/2006/05/06/update-or-install-applications-on-debianubuntu-without-an-internet-connection/), akhirnya saya mendapatkan workflow yang sesuai, sebagai berikut. 




  * Buat dulu daftar paket yang ingin diinstal, dari instalasi Ubuntu yang sekarang


  * Lakukan proses instalasi


  * Buat daftar URL untuk mengunduh *.deb menggunakan Ubuntu yang baru diinstal


  * Jalankan proses unduh di komputer lain yang online 24/7


  * Setelah selesai, pindahkan hasilnya ke komputer ber-Ubuntu baru, dan instal






## Membuat daftar aplikasi


Daftar aplikasi yang terinstal di komputer yang kita pakai sekarang dapat didapatkan dengan menjalankan perintah berikut di command prompt. 


    
    dpkg --get-selections | sed -n 's/^\(.*\)\tinstall$/\1$/p' | cut -f1 > daftar_aplikasi.txt



Buka file `daftar_aplikasi.txt` dengan Text Editor dan buang aplikasi yang terinstal secara default. Setelah diedit, file saya berisi sebagai berikut. 

    
    
    ttf-inconsolata
    ttf-droid
    nautilus-open-terminal
    mc
    chmsee
    unrar
    comix
    keepassx
    subversion
    git-svn
    gimp
    network-manager-openvpn
    network-manager-openvpn-gnome
    network-manager-pptp
    network-manager-pptp-gnome
    network-manager-vpnc
    network-manager-vpnc-gnome
    openssh-server
    gnome-alsamixer
    vlc
    rtorrent
    hamster-applet
    timer-applet
    inkscape
    mysql-server
    mysql-query-browser
    mysql-admin
    sun-java6-jdk
    ubuntu-restricted-extras
    build-essential
    ant
    






## Proses Instalasi


Tidak ada yang istimewa dari proses instalasi. Berikut checklist yang saya gunakan: 




  * Backup isi home folder


  * Backup mailbox Thunderbird, biasanya ada di folder `.mozilla-thunderbird`


  * Remove semua hidden file dan folder di home. File hidden ini berisi konfigurasi aplikasi yang terinstal. Kita tidak ingin sistem baru kita menggunakan konfigurasi lama. Nanti jadi tidak terlihat barunya.


  * Reinstall Ubuntu dengan memformat partisi sistem


  * Edit `/etc/apt/sources.list` agar menggunakan mirror lokal. Saya biasa menggunakan `kambing.ui.ac.id`


  * Jalankan `apt-get update` untuk mengupdate database aplikasi



Berikut isi file `/etc/apt/sources.list` saya.

    
    
    deb http://kambing.ui.ac.id/ubuntu/ intrepid main restricted universe multiverse
    deb http://kambing.ui.ac.id/ubuntu/ intrepid-updates main restricted universe multiverse
    deb http://kambing.ui.ac.id/ubuntu/ intrepid-security main restricted universe multiverse
    


Setelah install ulang, file ini akan menjadi seperti ini

    
    
    deb http://kambing.ui.ac.id/ubuntu/ jaunty main restricted universe multiverse
    deb http://kambing.ui.ac.id/ubuntu/ jaunty-updates main restricted universe multiverse
    deb http://kambing.ui.ac.id/ubuntu/ jaunty-security main restricted universe multiverse
    


Segera setelah database aplikasi kita up-to-date, kita bisa lanjut ke langkah berikutnya.



## Membuat daftar URL untuk download



Jalankan perintah berikut di command prompt. 


    
    cat daftar_aplikasi.txt |  tr '\n' ' '| xargs apt-get install -qq --print-uris | cut -d\' -f2 > daftar_url.txt



Perintah ini akan menghasilkan file `daftar_url.txt`, yang berisi daftar URL file *.deb yang dibutuhkan untuk instalasi.



## Mengunduh *.deb


Berbekal `daftar_url.txt`, kita bisa segera menjalankan proses pengunduhan di komputer lain yang online 24/7. Komputer ini tidak perlu menjalankan Ubuntu terbaru. Bahkan tidak harus menjalankan Linux.

Jika komputer tersebut juga menjalankan Linux, maka kita bisa menggunakan wget dengan perintah sebagai berikut. 


    
    wget -b -c -nc -o donlod-ubuntu.log -i daftar_url.txt



Proses pengunduhan dapat dipantau dengan melihat isi file `donlod-ubuntu.log`. Gunakan perintah tail seperti ini. 


    
    tail -f donlod-ubuntu.log 



Tekan Ctrl+C untuk keluar dari tail. 

Proses ini akan menghasilkan banyak file *.deb di folder tempat kita menjalankan perintah wget tadi. Setelah semua file didapatkan, copy ke komputer kita yang baru diinstal tersebut.



## Instalasi *.deb



Copy semua file *.deb ke folder `/var/cache/apt/archives` di komputer berUbuntu baru. Selanjutnya kita lakukan proses instalasi dengan mengetik perintah berikut di command prompt. 


    
    cat daftar_aplikasi.txt  |  tr '\n' ' '| xargs apt-get install -y



Tunggu sejenak sampai selesai. 




## Replikasi Instalasi


Bagaimana jika kita disuruh melakukan instalasi identik di banyak komputer sekaligus? Gampang, berikut caranya. 

Instal salah satu komputer sampai selesai. Lengkapi semua aplikasi yang dibutuhkan. Segera setelah selesai, extract daftar aplikasi yang terinstal menggunakan perintah berikut. 


    
    dpkg --get-selections > daftar_instalasi.txt



Copy file `daftar_instalasi.txt` ini berikut isi folder /var/cache/apt/archives/ ke komputer berikut yang akan diinstal.

Di komputer berikut, copy file *.deb ke folder /var/cache/apt/archives/. Lalu jalankan perintah berikut untuk mengisi daftar instalasi. 


    
    sudo dpkg --set-selections < daftar_instalasi.txt



Setelah itu, jalankan perintah berikut untuk memulai proses instalasi.


    
    sudo apt-get dselect-upgrade



Semoga bermanfaat.

