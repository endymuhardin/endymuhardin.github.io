---
comments: true
date: 2011-02-13 21:14:22
layout: post
slug: database-transaction
title: Database Transaction
wordpress_id: 664
categories:
- java
---

Artikel ini saya tulis berdasarkan diskusi tentang transaction di milis id-mysql. Awalnya sederhana, ada yang tanya begini, 



> halo rekan2 dba & developer

> mysql-innodb kan punya fasilitas transaction yang seperti oracle/postgres tuh.
> mau nanya, dalam implementasi real di aplikasi,
> contoh bussiness process/use case apa aja yang menggunakan transaction?
> kemudian contoh kasus rollbacknya gimana?





Tadinya saya kurang semangat menjawab, karena asumsi saya, ini pertanyaan mendasar, dan pastilah banyak yang bisa menjawab secara benar dan tidak menyesatkan. Tapi apa lacur, saya membaca pertanyaan lanjutan seperti ini. 



> Ada yang pernah punya pengalaman pake software accounting tanpa feature 
> transaction?




Dan jawabannya ternyata sangat mengerikan.



> 
> yup, pernah.. 3 aplikasi sudah berjalan berbeda2 kasus accounting nya..
> dan tidak menggunakan feature transaction...
> skrng sedang garap accounting lainnya untuk perusahan dagang, dan
> sudah direncakan tanpa feature transaction.

> yg aplikasi 1 dr taun 2002, aplikasi 2 dr taun 2004, aplikasi 3 dr jan 2010.
> oya, ada jg aplikasi lain di sekitar taun 2005-2009, beberapa masih
> dipakai, beberapa tdk dipakai karena masalah internal mereka.
> dan selama ini aplikasi yg telah dipakai masih ok2 saja pak.

> menurut singkat saya, jika peng-handle php nya sudah cukup
> menanggulangi masalah transaksi data, tidak harus menggunakan feature
> transaction pada database nya.
> karena pd umumnya yg sudah berjalan, kebutuhan inti ada pada
> pencarian, input, edit, delete dengan kecepatan yg tinggi dan diakses
> oleh beberapa user, dan juga optimize database, dengan begitu menurut
> hemat saya, saya lebih condong menggunakan MyIsam yg tdk menggunakan
> feature transaction yg sedikit memberatkan proses data.

> oya, untuk case mengharuskan memakai feature transaction itu misalnya
> pada kasus:
> jika pada aplikasi tidak meng-handle apabila ada data transaksi yg
> dihapus/update/input yg mengharuskan ada link data yg juga ikut
> terupdate/terhapus/terinput

> untuk yg sudah menggunakan feature transaction, silahkan saya juga
> menunggu tanggapan dan pengalamannya.




What the @#$! 
Ini kalo meminjam istilah MUI, harus dibimbing untuk kembali ke jalan yang benar, tapi tidak boleh anarkis :D



Salah satu poin penting dalam database transaction adalah atomic, yaitu beberapa perintah dianggap sebagai satu kesatuan. 
Kalau satu gagal, yang lain harus dibatalkan. 

Ini adalah fundamental dari pemrograman dengan menggunakan database relasional. 

Pada kasus apa perlu transaction? 
Ya pada semua kasus yang perlu atomic. 
Contohnya : header detail. Sekali insert, 1 header dan beberapa detail. 
Kalo pada waktu insert detail gagal, ya headernya harus diundo, kalo ngga ada header yang gantung tanpa detail sehingga datanya juga jadi salah. 

Sekarang balik saya tanya, aplikasi apa yang gak pake skema header detail? 
Kecuali aplikasi prakarya tugas sekolah, aplikasi bisnis **pasti** pake header detail. 

Itu masalah atomicity. Kemudian ada masalah isolation.
Isolation ini artinya, transaction yang belum dicommit, tidak akan bisa dibaca oleh session lain. 
Contohnya gini, kita terima order 1000 item. 
Tentunya butuh waktu untuk menginsert 1000 record, misalnya butuh waktu 2 detik. 
Di dunia prosesor, 2 detik itu lama sekali, dan banyak hal bisa terjadi dalam rentang waktu tersebut. 
Nah, akan terjadi musibah, kalo kita ternyata ada fitur untuk menghitung jumlah order, katakan saja querynya seperti ini. 


    
    
    select sum(nilai) from t_order where tanggal = '2011-02-02'
    



yang berjalan di tengah-tengah proses insert tadi, misalnya pada waktu baru terinsert 53 order saja. Query hitung ini dijalankan oleh user lain. Suatu hal yang sangat umum terjadi, aplikasi diakses beberapa user berbarengan.

Query ini akan menghasilkan nilai yang salah, karena 1000 order itu belum tentu sukses diinsert. 
Misalnya pada record ke 143 terjadi mati lampu, hardisk penuh, komputer hang, browser ketutup, laptop kesiram kopi, usernya menekan tombol cancel, validasi stok produk tidak cukup, atau whatever kejadian remeh-temeh yang umum terjadi dalam kehidupan sehari-hari, tentu akan terjadi kekacauan. 
Karena tidak atomic, maka kita tidak tau sudah berapa record yang terinsert, sehingga menyulitkan proses recovery. Order mana yang harus diinsert ulang, dan order mana yang sudah masuk?
Karena tidak ada isolation, maka user yang menjalankan perhitungan order akan mendapat hasil yang tidak sahih kebenarannya. 

Seandainya saja kita menggunakan transaction dengan benar, maka pada waktu terjadi sesuatu pada waktu proses insert tadi, maka posisi database akan dikembalikan ke posisi sebelum insert dilakukan. Karena posisi sebelum insert kita tahu dengan pasti, maka recovery gampang. 
Insert ulang saja 1000 order tadi tanpa kecuali. Sederhana dan mudah. 

Jadi kalo ada di sini yang bilang bikin aplikasi bisnis tanpa transaction, maka itu adalah nonsense. 
Tidak peduli kalo sampe saat ini jalan lancar, maka itu hanyalah kebetulan belaka, dan kita tidak mau selamanya mengandalkan keberuntungan kan?
Kalau sampai saat ini berjalan lancar, ya mungkin aplikasinya cuma dipakai 1 concurrent user saja dan itupun jarang-jarang pake. 

Nah, jadi transaction itu adalah fitur fundamental yang harus digunakan, sama seperti kalo kita keluar rumah ya harus pake celana. 
Di daerah lain sana orang kemana2 cuma pake koteka, dan saya tidak mau berdebat dengan mereka urusan celana. 
Jadi kalo masih ada yang bersikukuh bikin aplikasi bisnis gak pake transaction, ya silahkan, saya tidak mau berdebat urusan ini. 
Percuma berdebat sama orang yang gak pake celana ;p

Selanjutnya, sebetulnya apa benar transaction itu memberatkan aplikasi?
Hmm ... ini sebetulnya hanyalah mitos belaka. 
Yang mau mendebat silahkan sajikan benchmark antara non-transactional dan transactional. 
Kalo selisih performance cuma 100%, artinya kalo non-transactional cuma 2 kali lebih lemot, saya mendingan upgrade hardware daripada mengorbankan data integrity untuk gain performance yang tidak seberapa ini. 

Jadi, apa kita tidak boleh pakai MyISAM ? 
Tentu ada waktu dan tempatnya. 
Data2 read only seperti misalnya tabel kategori, master produk, bolehlah pake MyISAM. 
Tapi kalo sudah data header detail, ya harus InnoDB dan harus menggunakan transaction supaya atomic. 

Setelah kita menggunakan InnoDB, sebetulnya kita tidak bisa non-transactional. 
Kalo kita tidak begin dan commit secara explisit, sebenarnya untuk tiap SQL statement, itu dianggap satu transaction. 
Sehingga SQL seperti ini : 


    
    
    update table harga set nilai = nilai + 1000;
    



Sebetulnya akan dijalankan seperti ini ; 


    
    
    begin;
    update table harga set nilai = nilai + 1000;
    commit;
    



Ini namanya fitur autocommit. Di MySQL defaultnya dienable. 

Dengan adanya autocommit ini, justru kita akan lebih lemot kalo tidak menggunakan transaction secara benar. 
Contoh, insert 100 data produk. 
Kalo tanpa begin dan commit explisit, berarti ada 100 begin dan ada 100 commit, artinya 100 kali menjalankan transaction. 
Akan lebih efisien kalo kita lakukan explisit, seperti ini :

    
    
    begin; 
    insert into table produk (kode) values ('P-001');
    ... ulangi 99 kali lagi ..
    commit; 
    


Cara di atas hanya akan membutuhkan satu transaction saja. 
Jauh lebih efisien. 

Baiklah, ada beberapa pesan moral di artikel ini 




  1. Header detail harus dioperasikan secara atomic


  2. Operasi yang belum selesai, tidak boleh dilihat session lain, sehingga untuk aplikasi multiuser, pasti butuh isolation


  3. Karena aplikasi bisnis umumnya multiuser, dan pasti punya skema header-detail, maka **pasti harus**menggunakan transaction


  4. Masalah performance di transaction umumnya mitos belaka, dan walaupun ada, tidak sebanding dengan mengabaikan integritas data


  5. Jangan lupa pakai celana kalau keluar rumah



Pembaca setia blog saya tentu paham bahwa biasanya saya memberikan anjuran dengan kata-kata sebaiknya, tergantung situasi, dan istilah-istilah yang relatif. Tapi di artikel ini, banyak kata-kata pasti, harus, dan sejenisnya. Ini karena masalah transaction ini berkaitan dengan integritas data. Aplikasi yang kita buat haruslah bisa dipercaya untuk menghasilkan perhitungan yang benar. Tanpa menjaga integritas data dengan transaction, mustahil perhitungan yang benar bisa didapatkan. 

Lebih lanjut tentang masalah-masalah yang bisa terjadi, bisa lihat [di Wikipedia](http://en.wikipedia.org/wiki/Database_transaction). 

