---
comments: true
date: 2008-11-10 14:40:10
layout: post
slug: svn-externals
title: SVN Externals
wordpress_id: 400
categories:
- lain
---

Dalam membuat aplikasi, seringkali kita membutuhkan source-code dari aplikasi lainnya. Misalnya, jika kita sudah membuat cukup banyak aplikasi, maka fitur login dan logout pasti sudah sering kita buat. 

Daripada menulis ulang fitur tersebut, alangkah lebih baiknya jika kita reuse kode programnya dalam aplikasi yang akan dibuat. Dengan demikian, setelah melewati beberapa project, kode program yang direuse tersebut akan bertambah kemampuannya dan semakin canggih. 

Kita dapat melakukan hal ini dengan menggunakan fitur svn external. Misalnya struktur kode program kita terdiri dari modul berikut: 



	
  * Master Data

	
  * Transaksi

	
  * Report

	
  * Security



Kita ingin me-reuse kode program security yang ada di aplikasi lain. Dengan demikian, kita perlu menambahkan folder tersebut ke dalam source-tree kita. 

Untuk melakukan hal tersebut, kita mengedit property Subversion yang bernama svn:externals. Berikut cara menambah property tersebut : 

1. Checkout dulu seluruh trunk. 


    
    
    svn co http://repo.server.com/svn/nama-project/trunk project-saya
    



2. Tambahkan property svn:externals ke project yang sudah ada.


    
    
    svn propset svn:externals "modul-security http://repo.server.com/svn/project-lain/trunk/modul-security" project-saya
    



3. Commit deh


    
    
    cd project-saya
    svn ci -m "tambahkan property svn:external"
    



4. Untuk mengambil source code modul-security, lakukan svn update


    
    
    svn update
    



Kode program modul-security siap digunakan. Ingat, kalau kita melakukan perubahan di dalamnya dan melakukan commit, maka perubahan akan dikirim ke repository asalnya, yaitu http://repo.server.com/svn/project-lain/trunk/modul-security

Lalu bagaimana kalau kita tidak ingin mengikuti perkembangan modul-security? Bisa saja ada programmer lain yang mengubah modul-security dan menyebabkan kode kita rusak.

Caranya, referensikan modul-security ke tags, jangan ke trunk.

Demikian cara berbagi kode program lintas project. Semoga bermanfaat.
