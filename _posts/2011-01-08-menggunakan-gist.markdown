---
comments: true
date: 2011-01-08 20:40:16
layout: post
slug: menggunakan-gist
title: Menggunakan Gist
wordpress_id: 603
categories:
- aplikasi
---

Gist adalah fitur yang disediakan oleh Github. Fungsi dasarnya mirip dengan pastebin, yaitu kita bisa paste text di sana, dan disharing dengan orang lain. Keunggulan Gist adalah dia sudah memiliki kemampuan version control dengan Git. Sehingga kita bisa fork, clone, modifikasi, dan push lagi ke repo utama dengan seluruh history tersimpan di sana. 

Untuk bisa menggunakan Gist, kita harus memiliki account Github dulu. Setelah itu, kita bisa buat [gist di sini](https://gist.github.com). 



Cara membuatnya tidak sulit. Cukup entri nama file, keterangan, dan isi text yang mau dishare. 

![ ](/images/uploads/2011/01/01-create-gist-300x204.png)

Setelah itu, tekan Create Public Gist. Gist kita akan siap digunakan. 

![ ](/images/uploads/2011/01/02-gist-created-300x207.png)

Gist yang sudah dibuat bisa dipasang di blog. Caranya, klik tombol embed. 

![ ](/images/uploads/2011/01/03-embed-link-300x205.png)

Nanti akan muncul textfield berisi tag HTML untuk dipasang di blog, kira-kira seperti ini tagnya: 

    
    
    <script src="https://gist.github.com/770832.js?file=HelloWorld.java"></script>
    


Tag ini bisa langsung dipasang di blog kita. Hasilnya seperti di bawah ini. 



Kelemahan cara ini adalah dia membutuhkan javascript, dan isi filenya tidak terindeks oleh spider. Untuk mengatasinya, kita gunakan [plugin wordpress ini](http://wordpress.org/extend/plugins/embed-github-gist/). 

Setelah digunakan, kita cukup memasang tag khusus seperti dijelaskan di websitenya. Ini contoh hasilnya 

[gist id=770832]

Sekilas tidak terlihat bedanya antara pakai plugin dan tidak. Tapi coba lihat source halaman ini, klik kanan kemudian View Source. Yang menggunakan plugin, source codenya benar-benar ada tulisannya. Sedangkan yang pakai tag script tidak ada source code hello worldnya. 

Nah, kalau sudah pakai ini, tidak perlu bingung lagi mewarnai source code di blog. Kalau mau revisi, tinggal edit aja di Github, dan otomatis di blog langsung terupdate. 

