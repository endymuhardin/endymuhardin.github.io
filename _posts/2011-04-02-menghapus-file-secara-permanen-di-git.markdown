---
comments: true
date: 2011-04-02 22:06:42
layout: post
slug: menghapus-file-secara-permanen-di-git
title: Menghapus file secara permanen di Git
wordpress_id: 678
categories:
- aplikasi
---

Salah satu keuntungan menggunakan version control adalah dia akan menyimpan semua history perubahan. Dengan demikian, walaupun kita sudah menghapus satu file tertentu, sebetulnya file tersebut masih ada di repository dan bisa dimunculkan kembali kapan saja. 

Hal ini menimbulkan beberapa konsekuensi, diantaranya



	
  * Ukuran repository menjadi besar. Ini terutama sangat terasa di Git, karena pada waktu clone, kita akan mengambil keseluruhan perubahan dari pertama hingga terakhir. Berbeda dengan Subversion, dimana kita hanya mendapat perubahan terakhir saja. 

	
  * 
File-file yang mengandung informasi rahasia --seperti misalnya password-- tidak terhapus secara sempurna, sehingga bisa disalahgunakan orang lain. 




Untuk itu, kita perlu cara untuk menghilangkan file ini secara permanen. 


Di Git, caranya adalah menggunakan perintah `git filter-branch` seperti [dijelaskan di sini](http://help.github.com/removing-sensitive-data/). Walaupun demikian, tutorial tersebut tidak menjelaskan bagaimana cara menghapus folder. 

Di ArtiVisi, [Dadang](https://github.com/dadang) dan [Doni](https://github.com/donraakan) mengalami kejadian tersebut, dimana folder konfigurasi Eclipse (.project, .classpath, .settings) dan file hasil kompilasi Maven (target) ikut serta dicommit. Ini menyulitkan fakir bandwidth yang ingin melakukan clone, karena ukuran reponya menjadi besar sekali. Karena itu, file dan folder tersebut harus dihapus secara permanen. 

Cara menghapusnya adalah sebagai berikut. 



## Pastikan versi repository di local dan di remote sudah sama


Ini bisa dilakukan dengan menggunakan perintah git pull dan git push. Selanjutnya, kita masuk ke folder kerja, dan memanggil perintah berikut. 



Perintah di atas akan memodifikasi seluruh commit untuk menghilangkan file dan folder tersebut. Konsekuensinya, seluruh downline Anda akan terpaksa melakukan clone ulang, karena ini sama saja mengganti repository tersebut dengan repository baru. Akibatnya, commit, push, pull, dan merge tidak akan berjalan dengan baik. 

Periksa kembali repository Git Anda setelah melakukan perintah di atas, pastikan semuanya baik-baik saja. 
Begitu yakin, kita push ke remote. 

`
git push origin master --force
`

Setelah melakukan perintah di atas, file yang terhapus itu masih ada di object database Git kita di local, sehingga ukuran reponya masih belum berkurang secara signifikan. 
Karena sudah kita push ke remote, hapus saja repo local yang sekarang, dan lakukan clone ulang dari remote. 

Demikian cara membersihkan repository dari file yang tidak sengaja dicommit. Silahkan mencoba. 


