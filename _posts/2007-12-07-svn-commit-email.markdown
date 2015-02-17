---
comments: true
date: 2007-12-07 15:22:59
layout: post
slug: svn-commit-email
title: Mengaktifkan commit email Subversion
wordpress_id: 319
categories:
- aplikasi
---

Salah satu best practices dalam praktek pemrograman adalah Peer Review. Kode yang disubmit seseorang ke version control akan direview oleh anggota tim yang lain. Beberapa keuntungan dari pelaksanaan Peer Review antara lain: 

  * meningkatnya collective code ownership. Semua anggota tim akan merasa memiliki.
  * membantu penyebaran pengetahuan dan pengalaman. Kode yang kurang optimal akan dikomentari di ruang publik (milis developer), sehingga semua anggota akan mendapat pencerahan.
  * meningkatkan kualitas kode program secara keseluruhan. Bila setiap commit direview, anggota tim akan mendapat peer pressure untuk tidak mengulangi kesalahan yang pernah dibahas. Kalau ada kode yang kurang optimal, feedback akan datang dengan cepat, sehingga kualitas yang rendah tidak akan terakumulasi. 

Baiklah, sekarang kita sudah tahu manfaat praktek peer review. Sama seperti kita tahu kalau lari pagi itu sehat. Tapi seperti halnya lari pagi, banyak orang yang tidak melakukannya. 

Salah satu alasan peer review tidak dilakukan adalah semakin banyak kode program, semakin sulit reviewnya. Mau mulai dari mana? Apa kode yang kemarin sudah direview perlu dilihat lagi? 

Masalah yang sama dihadapi oleh seluruh pengembang aplikasi open source di seluruh dunia. Dan mereka sudah punya solusinya, yaitu commit email. 

Prinsipnya sederhana. Kita pasang trigger di version control. Setiap kali ada yang commit, trigger tersebut akan melihat apa yang baru saja dicommit. Kemudian membandingkannya dengan versi sebelumnya. Hasil perbandingan kemudian dikirim ke milis developer supaya bisa dilihat orang banyak. 

Dengan commit email ini, reviewer tidak perlu melihat keseluruhan kode program, tapi cukup yang berubah saja. Ini akan sangat meringankan kegiatan review. 

Subversion sudah mempaketkan script trigger untuk commit email. Di [halaman Tools & Contrib](http://subversion.tigris.org/tools_contrib.html) ada beberapa script untuk keperluan ini. 

Saya menggunakan [commit script yang dibuat dengan Perl](http://svn.collab.net/repos/svn/trunk/tools/hook-scripts/commit-email.pl.in). Sebelum dipakai, script ini harus diedit sedikit, di bagian SMTP server.

`$smtp_server = "127.0.0.1";`

dan bagian path menuju perintah svnlook.

`my $svnlook = "@SVN_BINDIR@/svnlook";`

Kalau di Windows, `svnlook` ada di `C:\Program Files\Subversion\bin`, sedangkan kalau di Linux biasanya ada di `/usr/bin`.

Selanjutnya, kita harus menyuruh Subversion untuk menjalankan file ini pada saat ada orang commit. Caranya mudah, masuk ke folder repository Subversion, di dalam folder hooks.

Untuk Linux mudah, cukup rename `post-commit.tmpl` menjadi `post-commit`, dan ganti modenya menjadi executable. 

`chmod +x post-commit`

Kemudian edit sedikit untuk memasukkan beberapa parameter: 

  * Recipient : penerima commit email. Biasanya ini saya arahkan ke milis developer
  * Subject : subject pada email yang dikirim
  * Reply To : kalau penerima email menekan tombol Reply, inilah alamat yang akan muncul di field To
  * Host : nama host otomatis yang akan ditambahkan ke nama user yang commit. Misalnya username yang commit endy, dan hostnya artivisi.com, maka nama pengirim otomatis menjadi endy@artivisi.com

Berikut isi dari file post-commit saya


    
```
#!/bin/sh
REPOS="$1"
REV="$2"

RECIPIENT=devteam@artivisi.com
SUBJECT=automated-commit-email
REPLY_TO=devteam@artivisi.com
HOST=artivisi.com

$REPOS/hooks/commit-email.pl "$REPOS" "$REV" -h $HOST -r $REPLY_TO  -s $SUBJECT $RECIPIENT
```



Untuk di Windows, kita harus membuat file `post-commit.bat`, di folder hooks juga. Berikut isi dari `post-commit.bat`


    
```
@ECHO OFF

SET RECIPIENT=devteam@artivisi.com
SET SUBJECT=automated-commit-email
SET REPLY_TO=devteam@artivisi.com
SET HOST=artivisi.com

SET PERL=c:\usr\bin\perl
SET REPOS=%1
SET REV=%2

%PERL% -w %REPOS%/hooks/commit-email.pl %REPOS% %REV% -h %HOST% -r %REPLY_TO%  -s %SUBJECT% %RECIPIENT%
```



Tentunya kita harus menginstal dulu [Perl untuk Windows](http://www.activestate.com/store/productdetail.aspx?prdGuid=81fbce82-6bd5-49bc-a915-08d58c2648ca) agar script ini bisa berjalan.

Selamat mencoba
