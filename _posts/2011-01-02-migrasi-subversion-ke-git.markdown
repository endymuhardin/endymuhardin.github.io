---
comments: true
date: 2011-01-02 23:02:23
layout: post
slug: migrasi-subversion-ke-git
title: Migrasi Subversion ke Git
wordpress_id: 569
categories:
- aplikasi
---

Di tahun yang baru ini, kami di ArtiVisi juga beralih menggunakan version control baru, yaitu Git.
Menggantikan Subversion yang sudah kita gunakan sejak 2008.

Ada banyak keunggulan Git dibandingkan Subversion, diantaranya:




	
  * offline operation. Git adalah distributed/decentralized version control system (DVCS), artinya tidak membutuhkan server terpusat untuk bisa bekerja. Keunggulan ini berakibat pada keunggulan berikutnya, yaitu:


	
  * commit sesuai task, bukan sesuai koneksi internet. Dulu, karena koneksi internet terbatas, programmer commit hanya pada saat ada internet. Akibatnya satu commit berisi perubahan untuk banyak task, tercampur aduk tidak jelas peruntukannya. DVCS memungkinkan programmer untuk commit walaupun tidak ada koneksi internet, dan melakukan sinkronisasi pada saat offline.


	
  * fitur staging area di Git, memungkinkan kita untuk mengatur isi commit secara detail. 


	
  * fitur rebase untuk mengatur commit. Commit yang teratur akan memudahkan review.


	
  * branch dan merge yang lebih baik daripada subversion. Karena branch dan merge mudah, maka kita bisa menerapkan berbagai teknik workflow dalam mengelola development.


	
  * website social coding. Github dan Gitorious merupakan Facebook-nya para programmer. Untuk bisa terlibat di dalamnya, terlebih dulu kita harus bisa Git.





Selain Git, ada juga DVCS lain seperti Mercurial (hg), Bazaar (bzr), dsb. Git dipilih karena :


	
  * popularitas. Semakin populer, tutorial dan aplikasi pendukung semakin banyak, sehingga semakin nyaman digunakan. Saat ini yang paling populer cuma dua, yaitu git dan hg.


	
  * local/named branch. Ini fitur penting, tapi entah kenapa tidak ada di core hg. Sepertinya ada di extension, tapi yang jelas merupakan workaround dan bukan didesain sejak awal. Tanpa named branch, pilihan workflow menjadi terbatas.


	
  * Social coding Git (Github dan Gitorious) jauh lebih superior daripada Mercurial (Bitbucket)





Beberapa faktor di atas adalah alasan kenapa Git yang dipilih.

Baiklah, sekarang saatnya migrasi. Kita akan mengkonversi repository Subversion menjadi repository Git.
Berikut langkah-langkah yang akan kita lakukan: 

	
  1. Dump repository Subversion

	
  2. Restore lagi di laptop supaya cepat

	
  3. Buat authorsfile

	
  4. Buat ignore file

	
  5. Clone tanpa metadata

	
  6. Konversi branch

	
  7. Konversi tags

	
  8. Clone hasil konversi menjadi bare repository





## Dump repository Subversion


Seperti biasa, sebelum melakukan apapun, lakukan backup dulu. Just in case. 
Perintahnya gampang. 


    
    svnadmin dump /path/ke/repository | bzip2 -c9 > dump-repository-yyyyMMdd.dmp.bz2





## Restore lagi di laptop/PC supaya cepat


Langkah ini optional, kalau kita ingin melakukannya di komputer kita sendiri, bukan di server. 
Tapi sebaiknya dilakukan, karena nanti kita akan checkout beberapa kali yang pasti membutuhkan waktu lama jika dilakukan ke server. 

Perintah restore gampang. 


    
    bzcat dump-repository-yyyyMMdd.dmp.bz2 | svnadmin load /path/ke/repo/svn/di/lokal






## Buat authorsfile


Setelah kita memiliki repository Subversion, kita perlu mengambil daftar nama orang-orang yang pernah commit. Ini akan kita butuhkan pada waktu konversi. Nama committer ini diambil dari hasil checkout Subversion. Jadi mari kita checkout dulu. 


    
    svn checkout file:///path/ke/repo/svn/di/lokal checkout-project-svn



Karena lokal, harusnya hanya membutuhkan beberapa menit saja. 

Setelah dilakukan checkout, kita membutuhkan script untuk mengambil nama committer. Berikut isi scriptnya, simpan saja dengan nama extract-svn-authors.sh

    
    
    #!/usr/bin/env bash
    authors=$(svn log -q | grep -e '^r' | awk 'BEGIN { FS = "|" } ; { print $2 }' | sort | uniq)
    for author in ${authors}; do
      echo "${author} = NAME <USER@DOMAIN>";
    done
    



Jalankan script tersebut di dalam folder hasil checkout. 

    
    
    cd checkout-project-svn
    sh /path/ke/script/extract-svn-authors.sh > nama-committers.txt 
    


Ini akan menghasilkan file nama-committers.txt yang berisi nama committer seperti ini : 

    
    
    endy = NAME <USER@DOMAIN>
    


Editlah file ini supaya mencerminkan nama dan email yang benar, seperti ini : 

    
    
    endy = Endy Muhardin <endy.muhardin@geemail.com>
    





## Buat ignore file


Dalam mengerjakan project, ada file-file yang ada di folder kerja, tapi tidak kita masukkan ke repository. Misalnya file hasil kompilasi, setting IDE, dan sebagainya. File dan folder hasil generate ini biasanya kita daftarkan di ignore list, supaya tidak ikut dicommit ke repository. Kita perlu mengkonversi format ignore di Subversion (svn property ignore) menjadi format ignore versi Git (yaitu file .gitignore). 

Untuk membuatnya, kita clone dulu repository Subversion menjadi repository Git. Ini dilakukan di folder yang berbeda dengan hasil checkout Subversion di langkah sebelumnya. 

    
    
    cd .. 
    git svn clone --stdlayout -A nama-committers.txt file:///path/ke/repo git-svn-migrasi-project-dengan-metadata
    


Setelah diclone, konversi ignore list nya. 

    
    
    cd git-svn-migrasi-project-dengan-metadata
    git svn show-ignore > .gitignore
    




## Clone tanpa metadata


Selanjutnya, kita lakukan clone lagi. Kali ini tanpa menyertakan metadata, sehingga hasilnya bersih. Metadata ini digunakan bila kita ingin tetap commit ke repository Subversion, tapi ingin menggunakan Git sebagai frontend. 

Perintahnya mirip seperti sebelumnya, kali ini kita tambahkan opsi tanpa metadata. 

    
    
    cd .. 
    git svn clone --no-metadata --stdlayout -A nama-committers.txt file:///path/ke/repo git-svn-migrasi-project-tanpa-metadata
    



Ini akan menghasilkan folder git-svn-migrasi-project-tanpa-metadata berisi repository Subversion yang sudah dikonversi menjadi repository Git. Semua langkah selanjutnya akan dilakukan di dalam folder ini. 

Setelah selesai, kita masukkan file .gitignore ke repo Git yang baru ini. 

    
    
    cd git-svn-migrasi-project-tanpa-metadata
    cp ../git-svn-migrasi-project-dengan-metadata/.gitignore ./
    git add . 
    git commit -m "add ignore list"
    






## Konversi branch


Branch yang ada di Subversion harus kita konversi menjadi branch di Git. 
Berikut perintahnya. 

    
    
    git branch -r | grep -v tags | sed -rne 's, *([^@]+)$,\1,p' | while read branch; do echo "git branch $branch $branch"; done | sh
    



Verifikasi hasilnya dengan perintah ini. 

    
    
    git branch -a
    


Seharusnya semua branch yang ada di repository Subversion akan terlihat di dalam repository Git ini. 



## Konversi tags


Lakukan perintah berikut untuk mengkonversi tag Subversion menjadi tag Git. 

    
    
    git branch -r | sed -rne 's, *tags/([^@]+)$,\1,p' | while read tag; do echo "git tag $tag 'tags/${tag}^'; git branch -r -d tags/$tag"; done | sh
    



Verifikasi dengan perintah ini 

    
    
    git tag -l
    


Pastikan semua tag yang tadinya ada di repository Subversion sudah terdaftar di repository Git. 



## Clone hasil konversi menjadi bare repository


Setelah nama committer, ignore list, branch, dan tags berhasil kita pindahkan, inilah langkah terakhir. Kita clone sekali lagi menjadi repository bare supaya bisa dishare dengan orang lain. Biasanya repository bare ini kita publish dengan Gitosis, gitweb, atau aplikasi server lainnya. 

Perintah ini dilakukan di luar repository Git yang kita gunakan pada langkah sebelumnya. 

    
    
    cd .. 
    git clone --bare git-svn-migrasi-project-tanpa-metadata nama-project.git
    


Ini akan menghasilkan satu folder dengan nama nama-project.git berisi repository Git yang siap dishare. 

Demikian posting tahun baru. Semoga kita semua lebih sukses di tahun 2011 ini.  
