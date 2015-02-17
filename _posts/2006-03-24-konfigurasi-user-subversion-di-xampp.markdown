---
comments: true
date: 2006-03-24 17:23:48
layout: post
slug: konfigurasi-user-subversion-di-xampp
title: Konfigurasi user Subversion di XAMPP
wordpress_id: 41
categories:
- aplikasi
---

Berikut cara konfigurasi repository Subversion pada Windows agar bisa diakses melalui http. Ijin akses hanya diberikan pada user yang sudah terdaftar dalam database.

Sebetulnya tutorial versi Linux juga ada. Tapi sepertinya pengguna Windows masih ada yang menemui kesulitan, walaupun sudah pernah diberikan training.

Aplikasi berikut harus sudah terinstal:



	
  1. [Subversion](http://subversion.tigris.org)

	
  2. [XAMPP](http://www.apachefriends.org/en/xampp.html), gunakan versi 1.4


Pertama, kita akan membuat user dengan fasilitas htpasswd yang ada di Apache.
1. Masuk ke folder apache
`c:\> cd c:\xampp\apache\bin`

2. jalankan htpasswd untuk membuat database username/password, misalnya namanya user.txt
`c:\> htpasswd -cm user.txt endy
New password: ****
Re-type new password: ****
Adding password for user endy`

Setelah itu, htpasswd akan membuatkan file database user di file user.txt
Kira-kira isinya seperti ini:
`endy:$apr1$m15.....$LbO0nY5v2FaRQ7NC4NVLY0`

Option c artinya buat file baru, karena user.txt sebelumnya tidak ada, maka kita perlu pakai option c ini.
Untuk menambah user lain, cukup tambahkan ke file user.txt yang sudah ada:
`c:\> htpasswd -m user.txt benny
New password: ****
Re-type new password: ****
Adding password for user benny`

Option m artinya password akan dienkripsi dengan algoritma MD5.
Itu sebabnya password 'test' untuk user endy terlihat seperti sumpah serapah dalam file user.txt

3. Copy user.txt ke folder c:\xampp\apache\conf

Kemudian, kita akan mengkonfigurasi Apache agar:



	
  * meneruskan request http dengan suffix /svn (misal http://localhost/svn) ke Subversion

	
  * meminta requester memasukkan username dan password

	
  * mencocokkan username dan password dengan file c:\xampp\apache\conf\user.txt

	
  * kalau cocok, tampilkan repository yang ada di folder c:\repoku


4. Copy file c:\Program Files\Subversion\bin\mod_authz_svn.so dan mod_dav_svn.so ke folder c:\xampp\apache\modules
File ini adalah modul tambahan agar apache mampu menangani request Subversion.

5. Edit c:\xampp\apache\conf\httpd.conf, tambahkan baris berikut:
`LoadModule dav_module modules/mod_dav.so
LoadModule dav_svn_module modules/mod_dav_svn.so
LoadModule authz_svn_module modules/mod_authz_svn.so
<Location /svn>
DAV svn
SVNPath c:/repoku
AuthType Basic
AuthName "Subversion Web Authentication"
AuthUserFile c:/xampp/apache/conf/user.txt
Require valid-user
</Location> `

6. Pastikan repository sudah dibuat di folder c:\repoku, kalau belum buat dulu:
`c:\> mkdir c:\repoku
c:\> svnadmin create --fs-type fsfs c:\repoku`

7. Silahkan browse ke http://localhost/svn/
