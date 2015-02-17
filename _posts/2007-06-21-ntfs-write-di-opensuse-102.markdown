---
comments: true
date: 2007-06-21 18:39:23
layout: post
slug: ntfs-write-di-opensuse-102
title: NTFS Write di OpenSuSE 10.2
wordpress_id: 219
categories:
- linux
---

Di Ubuntu, menulis ke partisi NTFS sangat mudah. Cukup lakukan


    
    sudo apt-get install ntfs-config



dan partisi NTFS siap ditulisi. 

Di OpenSuSE 10.2, tidak semudah ini. Secara default, repository OpenSuSE tidak mengandung `ntfs-3g`, paket yang dibutuhkan untuk menulis ke NTFS, yang siap digunakan. Oleh karena itu, beberapa orang memilih untuk mengkompilasi sendiri, salah satunya [Oom Andi Sugandi](http://sugandi.blogspot.com/2007/01/how-to-write-to-ntfs-partition-on-linux.html). 

Tetapi akhirnya saya menemukan cara yang mudah, tidak melibatkan kompilasi ulang. Berikut caranya. 




### Tambah Repository


Pertama, kita harus menggunakan repository milik Jan Engel***. Masuk ke Yast, dan pilih Installation Source. Kita akan menggunakan protokol FTP. Alamat servernya adalah `ftp-1.gwdg.de` dan folder repositorynya adalah `/pub/linux/misc/suser-jengelh/SUSE-10.2/`. Silahkan tambahkan entri tersebut dan klik OK. Yast akan segera memperbaharui database aplikasinya. 





### Instalasi Paket


Selanjutnya, kita bisa langsung menginstal paketnya. Dari Yast, buka Software Management, dan cari dengan keyword `ntfs`. Kita akan menemukan paket `ntfs-3g`. Instal paket tersebut.
Yast akan meminta paket tambahan, yaitu `fuse`. Instal saja dua-duanya. 





### Edit fstab


Sebelum mengubah isi `/etc/fstab`, jangan lupa untuk melakukan umount pada partisi windows yang kita miliki. 
Agar partisi windows kita dimount secara otomatis pada saat boot, kita perlu mengedit file `/etc/fstab`. Temukan entri seperti ini, 


    
    
    /dev/sda1            /media/windows/C     ntfs    ro,users,gid=users,umask=0002,nls=utf8 0 0
    



dan ubah menjadi seperti ini

    
    
    /dev/sda1            /media/windows/C     ntfs-3g    silent,unmask=0,locale=en_US.utf8 0 0
    



Setelah itu, kita bisa menguji coba dengan perintah `mount -a`. Di komputer saya muncul warning sebagai berikut. 

    
    
    WARNING: Deficient Linux kernel detected. Some driver features are
             not available (swap file on NTFS, boot from NTFS by LILO), and
             unmount is not safe unless it's made sure the ntfs-3g process
             naturally terminates after calling 'umount'. If you wish this
             message to disappear then you should upgrade to at least kernel
             version 2.6.20, or request help from your distribution to fix
             the kernel problem. The below web page has more information:
             http://ntfs-3g.org/support.html#fuse26
    


Tapi warning ini tidak berbahaya. 





### Edit Boot Config


Selain fstab, ada satu file lagi yang harus diedit agar mounting otomatis berjalan lancar pada saat booting. Edit file `/etc/sysconfig/kernel`. Cari baris berikut

    
    
    MODULES_LOADED_ON_BOOT=""
    


dan ganti menjadi seperti ini

    
    
    MODULES_LOADED_ON_BOOT="fuse"
    



Partisi NTFS siap digunakan. Selamat mencoba.

