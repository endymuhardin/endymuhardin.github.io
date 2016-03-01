---
comments: true
date: 2007-01-05 18:24:50
layout: post
slug: version-control-database
title: Version Control untuk Database
wordpress_id: 188
categories:
- aplikasi
---

Menyimpan kode program Java ke repository tidak sulit. Yang lebih sulit adalah menyimpan artifak database, yaitu: 

  -  Skema database
  -  Stored Procedure
  -  Functions
  -  Sample/Initial data

Kalau dilakukan dengan cara manual, akan sangat merepotkan, karena programmer harus melakukan langkah-langkah berikut untuk memastikan kode programnya tersimpan di repository: 

  1. Copy semua source code melalui Query Editor
  2. Paste satu per satu ke text file
  3. Commit ke repository
  4. Ulangi langkah 1 - 3 untuk setiap kali perubahan

Dengan skala ribuan procedure, cara ini sangat merepotkan dan dijamin tidak akan dilakukan oleh programmer. Harus ada cara yang lebih baik. 

Untungnya –seperti halnya masalah yang umum kita temukan– sudah banyak orang lain yang mengalami masalah sama, dan sudah ada yang memecahkannya. Kali ini solusinya adalah [ScriptDB4SVN](http://www.codeproject.com/cs/database/ScriptDB4Svn.asp "Homepage ScriptDB4SVN"). Aplikasi kecil yang seumur hidupnya hanya bertugas melakukan langkah 1-3 di atas. 



Sayangnya aplikasi ini hanya bisa digunakan untuk Microsoft SQL Server. 

Aplikasi ini membutuhkan .Net Framework 2.0 yang dapat didownload secara cuma-cuma di website Microsoft. Segera setelah .Net Framework diinstal, kita dapat langsung menjalankan ScriptDB4SVN. 

Sebelumnya, kita harus edit dulu file konfigurasinya. Kita harus beritahu ScriptDB4SVN tentang: 

  -  Host database
  -  Nama database yang akan digunakan
  -  Daftar tabel yang akan didump datanya

Berikut adalah contoh konfigurasinya


    
    
      
      

        
        
        
        
        
        

        
        
        
        
	
        
        

        
        

        
        
        
        

        
        

        
        
      
     


Setelah konfigurasi selesai dibuat, jalankan ScriptDB4SVN.exe. Hasilnya seperti ini. 

[![Screenshot ScriptDB4SVN ](/images/uploads/2007/01/scriptdb4svn.png)](/images/uploads/2007/01/scriptdb4svn.png)

Setiap kali ada perubahan di database, dobel-klik ScriptDB4SVN dan commit file yang berubah. Harus diperhatikan, ScriptDB4SVN tidak otomatis menjalankan svn add. Jadi kalau ada Store Procedure baru, kita harus jalankan svn add secara manual. 

Pembaca yang teliti mungkin akan melihat script sql dengan nama aneh pada screenshot di atas. Itu adalah script replikasi. Kalau script tersebut dijalankan di Query Analyzer, maka dia akan merekonstruksi database sehingga sama dengan kondisi database target pada saat ScriptDB4SVN dijalankan. 

Dengan adanya tools ini, masing-masing programmer dapat bekerja di database lokalnya sendiri. Secara periodik, dia harus melakukan svn update dan merekonstruksi database lokalnya dengan script terbaru sehingga tetap sinkron dengan kondisi terbaru.
