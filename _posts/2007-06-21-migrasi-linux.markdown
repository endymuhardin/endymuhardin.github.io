---
comments: true
date: 2007-06-21 11:32:05
layout: post
slug: migrasi-linux
title: Migrasi Linux
wordpress_id: 218
categories:
- linux
---

Di kantor saya sekarang sedang terjadi euforia Linux. Hmm.... bukan euforia. Tampaknya histeria lebih tepat. Karena semua orang tampak histeris dan ingin sampai di kantor besok harinya dan menemukan semua Windows sudah tidak ada, dan semua orang bekerja normal dan gembira. 

Ini semua dipicu oleh razia software bajakan yang marak terjadi beberapa bulan ini. Beberapa perusahaan bahkan menerima surat dari Pak Sutanto yang gambar sampulnya saja sudah menakutkan. Bukannya kantor saya pakai bajakan, tapi dengan sekian ratus orang karyawan, masing-masingnya menggunakan paling tidak satu komputer, siapa yang tau kalau mereka instal ulang komputernya dengan aplikasi GPL (Glodok Public License) ?? 

Jadilah akhirnya job desc saya bertambah satu, konsultan migrasi Linux, karena kebetulan di komputer dan notebook saya sudah tidak ada Windowsnya lagi. Berikut beberapa pengalaman yang bisa dibagi berkaitan dengan histeria migrasi ini. Siapa tau berikutnya kantor Anda yang dilanda demam pinguin. 



### Siapkan Install Server


Satu kali diminta instal, no problem. Dua kali, yah mau gimana lagi. Tiga kali?? That's enough. Ubuntu memang mudah diinstal, tapi distro lain seperti OpenSuSE tidak senyaman Ubuntu. Untuk OpenSuSE, kita harus menunggui proses instalasi, dan mengganti CD pada waktunya. 

Bila Anda mengantisipasi akan menginstal lebih dari tiga komputer, segera deploy fitur instalasi melalui jaringan. Ini adalah investasi beberapa jam yang akan menyelamatkan beberapa puluh jam dari masa remaja Anda di kemudian hari. 

Semua distro Linux mendukung instalasi melalui jaringan, walaupun caranya berbeda-beda. Saya menyiapkan repository di jaringan lokal untuk beberapa distro utama, untuk kasus saya, Ubuntu dan OpenSuSE. 

Repository Ubuntu dapat dibuat dengan mudah menggunakan DVD Repository yang bisa didonlod di [kandang anak kambing](http://anak.kambing.vlsm.org/). Segera setelah DVD repository selesai didownload, aktifkan webserver Apache dan mount ISOnya ke folder yang dapat diakses orang banyak. Cara yang sama bisa dilakukan untuk distro OpenSuSE. 

Sebagai contoh, semua ISO tersebut saya mount ke folder `/home/endy/tmp/UbuntuRepo` dan `/home/endy/tmp/OpenSuSE`. Kemudian kedua folder tersebut saya publish melalui Apache. Berikut adalah konfigurasi `/etc/fstab` agar ISO tersebut dimount pada saat booting. 


    
```
# Ubuntu Repository DVDs
/media/sdb2/ISO/Ubuntu/UbuntuDVD/ubuntu-7.04-repository-i386-1_contrib.iso  /home/endy/tmp/UbuntuRepo/DVD1 iso9660 loop,auto 0 0 
/media/sdb2/ISO/Ubuntu/UbuntuDVD/ubuntu-7.04-repository-i386-2_contrib.iso  /home/endy/tmp/UbuntuRepo/DVD2 iso9660 loop,auto 0 0 
/media/sdb2/ISO/Ubuntu/UbuntuDVD/ubuntu-7.04-repository-i386-3_contrib.iso  /home/endy/tmp/UbuntuRepo/DVD3 iso9660 loop,auto 0 0 
/media/sdb2/ISO/Ubuntu/UbuntuDVD/ubuntu-7.04-repository-i386-4_contrib.iso  /home/endy/tmp/UbuntuRepo/DVD4 iso9660 loop,auto 0 0 

# OpenSuSE CD
/media/sdb2/ISO/openSUSE-10.2-GM-i386-CD1.iso  /home/endy/tmp/OpenSuSE/CD1 iso9660 loop,auto 0 0 
/media/sdb2/ISO/openSUSE-10.2-GM-i386-CD2.iso  /home/endy/tmp/OpenSuSE/CD2 iso9660 loop,auto 0 0 
/media/sdb2/ISO/openSUSE-10.2-GM-i386-CD3.iso  /home/endy/tmp/OpenSuSE/CD3 iso9660 loop,auto 0 0 
/media/sdb2/ISO/openSUSE-10.2-GM-i386-CD4.iso  /home/endy/tmp/OpenSuSE/CD4 iso9660 loop,auto 0 0 
/media/sdb2/ISO/openSUSE-10.2-GM-i386-CD5.iso  /home/endy/tmp/OpenSuSE/CD5 iso9660 loop,auto 0 0 
```



Semakin banyak ISO yang dimount, semakin banyak juga loop device yang dibutuhkan. Instalasi Ubuntu standar cuma menyediakan 8 device loop, sehingga tidak cukup untuk memuat 4 ISO Ubuntu dan 5 ISO OpenSuSE. 
Untuk memeriksa berapa device loop yang tersedia, lihat di dalam `/dev/`

Untuk itu, device loop perlu ditambahkan. Di Ubuntu, tambahkan baris berikut di file `/etc/modprobe.d/options`

    
```
options loop max_loop=32 
```


agar pada saat booting kernel menyediakan 32 device loop. 

Selanjutnya, kita lakukan mapping agar folder /home/endy/tmp tersebut dipublish di http server. Cara termudah adalah dengan membuat symlink ke folder DocumentRoot (untuk keluarga Debian adalah /var/www). 

    
```
ln -s /var/www/UbuntuRepo /home/endy/tmp/UbuntuRepo
ln -s /var/www/OpenSuSE /home/endy/tmp/OpenSuSE
```



Berikutnya, buat boot CD atau boot USB agar pada saat instalasi kita cukup mengarahkan ke jaringan. Saya biasanya memulai instalasi pada sore hari agar bisa ditinggal pulang. 



### Migrasi Email


Arsip email merupakan harta yang sangat penting di kehidupan perkantoran modern. Dia bisa digunakan sebagai amunisi audit, bahan berkelit, ataupun mencari referensi. Oleh karena itu, setelah migrasi biasanya user akan menanyakan, "Email lama saya mana??".

Email dari Outlook Express bukanlah masalah besar. Hampir semua mail client Linux seperti KMail, Thunderbird, dan Evolution sudah menyediakan fitur import. Yang paling bermasalah adalah Outlook 2003. Native import belum ada di semua mail client Linux pada saat tulisan ini dibuat. Jadi, kita harus lebih dalam menggali isi perut Google. 

Saya menemukan tiga metode yang bisa digunakan: 




  1. Menggunakan Thunderbird


  2. Menggunakan File Sharing


  3. Menggunakan IMAP Server



Cara mana yang dipilih tergantung dari ketersediaan ahli Linux di sekitar Anda. Kalau tidak ada ahli Linux sama sekali, gunakan cara pertama. Berikut adalah langkah-langkahnya. 


#### Kebutuhan Software






  * MS Windows. Ya Anda membutuhkan komputer yang masih ada Windowsnya


  * Mozilla Thunderbird untuk Windows


  * Linux. Kalau Anda sudah menjadi korban migrasi, harusnya komputer Anda sudah terinstal Linux pada saat ini.


  * Mozilla Thunderbird untuk Linux





#### Cara migrasi


Cara memindahkan email sangat mudah. Pembaca yang teliti tentunya sudah bisa menebak langkah-langkahnya hanya dengan melihat kebutuhan software di atas. 





  1. Buka Thunderbird di Windows


  2. Import file *.pst Anda


  3. Buka setting Thunderbird, cari tahu di mana dia menyimpan emailnya


  4. Copy folder tersebut ke komputer Linux Anda


  5. Jalankan Thunderbird Linux, arahkan folder penyimpanan email ke folder hasil copy


  6. Restart Thunderbird


  7. Setelah ini, Anda bisa import hasilnya ke Evolution atau KMail, sesuai dengan pilihan



Cara kedua melibatkan pembuatan folder sharing di suatu tempat. Pada dasarnya cara ini adalah otomasi dari cara pertama di atas, sehingga bisa digunakan untuk memigrasi banyak user sekaligus. Saya kurang merekomendasikan cara ini karena relatif sulit dan tidak intuitif. Bagi yang ingin tahu bisa langsung [lihat di websitenya](http://www.neotek.hu/en/o2e_en.html). 

Buat saya, instalasi Thunderbird berkali-kali kurang menyenangkan. Lagipula, terkesan kurang hi-tech. Berikut adalah cara ketiga. Untuk melakukan ini, Anda butuh ahli Linux yang mampu mengkonfigurasi email server berprotokol IMAP. Sebenarnya IMAP server ini bisa di mana saja, termasuk di Windows. Yang penting IMAP. Cara setting IMAP server tidak dibahas pada artikel ini. 

Berikut adalah langkah-langkah migrasi. 




  1. Sebelum komputer Windows diformat, jalankan dulu Outlook 2003 untuk terakhir kalinya


  2. Buat akun email baru di Outlook, menggunakan akun yang sudah dibuatkan di IMAP server


  3. Copy email dari Local Folder Outlook ke folder IMAP


  4. Silahkan format Windowsnya dan install Linux


  5. Setelah berada di Linux, jalankan mail client apapun yang Anda sukai


  6. Buat akun email menggunakan akun di IMAP server


  7. Email Anda akan hadir tanpa suatu cacat apapun. Silahkan pindahkan ke folder lokal



Saya sangat menyukai cara ketiga ini. Bisa memigrasi email orang banyak dengan singkat, dan user bisa diajari untuk melakukannya sendiri. 

Demikianlah beberapa tips singkat tentang migrasi Linux. Semoga bermanfaat.
