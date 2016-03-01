---
comments: true
date: 2006-05-24 15:50:54
layout: post
slug: otomasi-transfer-file-dengan-winscp
title: Otomasi Transfer File dengan WinSCP
wordpress_id: 95
categories:
- aplikasi
---

Setelah sebelumnya kita mengotomasi backup untuk Subversion, baik [di Windows](http://endy.artivisi.com/blog/aplikasi/subversion-backup-script-untuk-windows/) maupun [di Linux](http://endy.artivisi.com/blog/aplikasi/subversion-backup-dan-restore/), masih ada sedikit PR yang tersisa. 

File backup yang dihasilkan oleh script masih berkeliaran di komputer yang sama dengan repository. Jadi kalau sempat terjadi bencana harddisk jebol, repository beserta backupnya akan musnah tanpa sisa. 

Solusi sementaranya adalah dengan cara rajin memindahkan file-file backup secara periodik ke komputer lain, untuk selanjutnya ditulis ke dalam CD/DVD. 
Tetapi, kegiatan copy-mengcopy setiap minggu sangat membosankan. Belum lagi kalau ternyata ada assignment mendadak sehingga kegiatan transfer file menjadi terlupakan. 
Solusi yang lebih _hi-tech_ adalah dengan mengotomasi proses transfer file. Jadi, file backup yang sudah dihasilkan akan kita transfer secara otomatis ke komputer lain, kalau perlu komputer di negara lain. 

Untuk melakukan otomasi ini, kita membutuhkan aplikasi [WinSCP](http://www.winscp.net). Ini adalah aplikasi untuk mentransfer file antara komputer Windows dengan Linux. Sejak menggunakan aplikasi ini, saya tidak pernah lagi menggunakan Windows Sharing dan Samba Server untuk kebutuhan file transfer.

Berikut caranya. Perhatikan bahwa konfigurasi saya adalah sebagai berikut: 



  
  * Repository Server: Windows 2000 Professional dengan WinSCP terinstal 

  
  * Backup Server: Linux OpenSuSE 10.0 dengan SSH server aktif [IP Address: 192.168.0.2]

  
  * Username di Backup Server: `backuponly`

  
  * Password di Backup Server: `backuppasswd`

  
  * Folder yang mau dibackup: `c:\Backup`

  
  * Folder tujuan: `/home/endy/backup`



Salah satu keunggulan WinSCP adalah, selain bisa mengelola transfer secara GUI, dia juga memiliki kemampuan scripting, sehingga bisa dipanggil dari command prompt. 

[![Screenshot WinSCP ](/images/uploads/2006/05/winscp.png)](/images/uploads/2006/05/winscp.png)

Berikut adalah script untuk mengotomasi proses copy folder `C:\Backup` dari Windows ke `/home/endy/backup` di Linux. Save sebagai `c:\upload-backup.txt`

    
```
# Modus batch, supaya WinSCP tidak tanya-tanya
option batch on
# Otomatis overwrite file yang sama
option confirm off
# Masukkan username dan password
open backuponly:backuppasswd@192.168.0.2
# Pindah ke folder backup
cd /home/endy/backup
# Upload folder C:\Backup seisinya
put c:/Backup 
# Disconnect
close
# Exit WinSCP
exit
```

Dan berikut adalah bat script untuk mengeksekusi script di atas, save dengan nama _c:\backup-scp.bat_: 

```
"C:\Program Files\WinSCP3\winscp3.exe" /console /script=upload-backup.txt
```

Script backup-scp.bat siap dijalankan melalui Windows Scheduler, sebaiknya 10 menit setelah jadwal backup. 
