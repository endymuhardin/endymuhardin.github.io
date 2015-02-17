---
comments: true
date: 2011-01-11 10:47:43
layout: post
slug: sharing-repository-git
title: Sharing Repository Git
wordpress_id: 613
categories:
- aplikasi
---

Skenario : selama ini kita coding di laptop sendiri saja. Kemudian ada kebutuhan untuk kolaborasi dengan orang lain melalui Git. Bagaimana caranya? Baiklah mari kita bahas di artikel ini. 





## Inisialisasi Repository Git



Pertama, kita inisialisasi dulu repository Git. Masuk ke dalam folder project dan ketikkan 


    
    
    git init
    



Git akan membuat repository kosong di dalam folder project, ditandai dengan adanya folder baru bernama .git

Selanjutnya, kita akan memasukkan semua file dan folder project kita ke dalam repository. Yang harus dimasukkan adalah file source code, baik itu Java, HTML, XML, dan sebagainya. Yang tidak perlu dimasukkan adalah file hasil kompilasi atau hasil generate. Kita perlu mendaftarkan file yang tidak ingin disimpan dalam file konfigurasi yang bernama .gitignore

File ini harus kita buat sendiri menggunakan text editor. Berikut contoh isi filenya, bila kita coding menggunakan Eclipse atau Netbeans 

[gist id=773975]


Setelah kita setting ignore file, berikutnya kita masukkan semua file dan folder ke dalam antrian. 


    
    
    git add . 
    



Kemudian, simpan ke repository


    
    
    git commit -m "commit pertama project XXX"
    



Project sudah tersimpan di repository Git di komputer lokal kita. Mari kita upload ke server, atau dikenal dengan istilah push. 



## Share Repository


Kita memerlukan server di mana kita memiliki ijin akses untuk melakukan push. Cara memperoleh ijin akses tidak dibahas pada artikel ini. Silahkan buat account di Github atau Gitorious. Bila ingin push ke repository perusahaan, minta informasinya pada admin Anda. 

Setelah kita mendapatkan URL server yang bisa kita gunakan, daftarkan sebagai remote. Berikut perintahnya.


    
    
    git remote add <namaremote> <URL>
    



Contohnya seperti ini


    
    
    git remote add github git@github.com:endymuhardin/project-terbaru-saya.git
    



Pastikan remotenya sudah terdaftar dengan perintah berikut


    
    
    git remote -v
    



Terakhir, mari kita push dengan perintah berikut


    
    
    git push <namaremote> <namabranch>
    



Contohnya 


    
    
    git push github master
    


Hore, project kita sudah naik ke server. Kita tinggal share URL tersebut ke rekan kerja kita. 
