---
comments: true
date: 2007-09-12 16:44:55
layout: post
slug: membuat-validasi-dalam-aplikasi
title: Membuat validasi dalam aplikasi
wordpress_id: 272
categories:
- java
---

Pertanyaan berikut muncul di [milis netbeans-indonesia](http://tech.groups.yahoo.com/group/netbeans-indonesia/), "Di mana sebaiknya kita menulis aturan validasi? Di database, di business layer, atau di presentation layer?"

Saya pikir, pasti banyak juga yang memiliki kebimbangan serupa. Oleh karena itu, jawaban saya tulis di artikel ini. 

Menurut saya, validasi itu idealnya di semua layer, mulai dari database, business logic, dan presentation layer (UI). 

Kenapa di database harus ada validasi (dengan menggunakan database constraint) adalah karena data umurnya akan lebih panjang dari aplikasi. Front end bisa ditulis ulang dengan apapun teknologi/framework yang sedang populer, sedangkan data sekali sudah disimpan, biasanya akan terus ada dalam waktu yang lama. 

Kalau kita tidak pakai constraint di database, begitu aplikasi kita usang dan diganti (misal tadinya desktop jadi web) maka databasenya jadi 'telanjang' tanpa validasi, sehingga rawan kemasukan data kotor. Dan siapa yang bisa memastikan database kita tidak diakses aplikasi lain? Mungkin sekarang tidak ... tapi tahun depan ketika ada kebutuhan baru, bisa saja ada orang lain yang mengembangkan aplikasi di atas database kita tersebut.

Di sisi lain, validasi di presentation layer juga penting, supaya round-trip nya tidak terlalu panjang. 
Katakanlah kita punya layer seperti ini: 
presentation --> business --> data access 

Kalau cuma ada validasi database, maka kita perlu meng-catch SQLException untuk kemudian diteruskan ke depan, entah itu as-is SQLException ataupun dienkapsulasi menjadi DataAccessException dan kemudian dibungkus lagi menjadi BusinessLayerException. 
Apalagi kalau aplikasinya ada di mesin berbeda. Ongkos perjalanan Exceptionnya jadi mahal. 
Itu makanya penting validasi di presentation layer. 

So ... idealnya validasi ada di semua layer. 

Tapi ini tidak berarti saya menganjurkan untuk menulis kode validasi di semua layer lho. Kode program itu idealnya tidak boleh terduplikasi. Logika validasi hanya ditulis sekali. Kalau aturan yang sama ditulis berkali-kali nanti pasti akan datang masanya kita (atau orang lain yang mewarisi kode program kita) mengganti aturan di satu tempat, dan lupa mengganti di tempat lain. Jadi, untuk setiap aturan, harus satu kali saja menulisnya.

Banyak cara agar codingnya cukup satu kali saja, misalnya mendefinisikan constraint dengan Hibernate, dan biarkan dia yang menggenerate DDL. Biasanya constraint unique, required, dan semacamnya akan langsung dibuatkan database constraintnya. 

Kemudian di presentation layer, buat aturan validasi yang dinamis, yang bisa membaca hibernate annotation dan kemudian menggenerate rutin validasi baik itu JavaScript (kalau aplikasinya web), atau pemanggilan method Java (kalau itu Swing).

Demikian pendapat saya tentang validasi. Bagaimana menurut Anda?
