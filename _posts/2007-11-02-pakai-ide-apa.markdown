---
comments: true
date: 2007-11-02 10:09:52
layout: post
slug: pakai-ide-apa
title: Pakai IDE apa?
wordpress_id: 291
categories:
- java
---

Posting ini dibuat untuk menanggapi diskusi di milis Netbeans.
Saya menyarankan para programmer, daripada menghabiskan waktunya untuk memperdebatkan editor, lebih baik menginvestasikan waktu dan energi untuk memperdalam konsep. 
Ekstrimnya, coding dengan Notepad bila perlu. 



Salah satu [programmer hebat yang saya kenal](http://www.antonraharja.web.id/), sampai hari ini masih coding menggunakan editornya Midnight Commander (MC). Untuk urusan produktivitas, [daftar hasil karyanya](http://www.antonraharja.web.id/curriculum-vitae/) lebih panjang daripada anda-anda yang berdebat Eclipse vs Netbeans.

Dari keseluruhan hasil karyanya, perkiraan saya paling tidak 75% dibuat dengan editor MC. Dan aplikasi yang ada di sana adalah aplikasi betulan, bukan tugas kuliah, bukan skripsi.

Editor Midnight Commander, kalau ingin tau, terlihat seperti ini: 

![Tampilan Editor MC ](/images/uploads/2007/11/mcedit.png)

Tidak ada autocomplete, tidak bisa mouse over terus keluar JavaDoc, tidak bisa klik kanan - Deploy in Tomcat.

Komentar di milis Netbeans tentang coding pakai editor seperti ini: 



> waduh pake notepad... be-darah2 itu mah codingnyah



Not really ... gak juga kok.
Memang lebih lambat daripada pakai Eclipse/Netbeans, soalnya kalo ada syntax error baru ketahuan setelah compile. 

Workflownya mirip dengan coding PHP. 
Edit kodenya, save, refresh browser. 

Kalau Java, edit, save, Alt-Tab ke konsol, ant compile.
Nanti kan keluar pesan errornya di baris berapa.

Buat yang belum merasakan, memang terkesan seperti latihan kungfu di Shaolin.
Keras dan melelahkan. 

Tapi ada hasilnya: 



	
  * Bebas mau pakai IDE apa aja.   
Bisa pakai the right tools for the right job. Spring development, pakai Eclipse. Desktop development, pakai Netbeans. Bikin aplikasi desktop yang mengakses Webservice, pakai 2-2nya

 

	
  * Lebih jeli dalam mendebug.   
Sampai saat ini, sebagian besar XML code harus didebug manual, karena memang by nature sulit untuk disupport IDE. Development jaman sekarang, pasti harus melibatkan XML. Dengan coding pakai editor minimalis, kita akan terbiasa melihat error message dan mengartikannya.



	
  * Lebih mudah mempelajari teknik automation, misalnya Continuous Integration (CI).   
  Soalnya CI itu mengharuskan kita bisa compile tanpa IDE. Buat yang tidak terbiasa (apalagi lulusan VB/Delphi), pasti akan kaget, bagaimana bisa compile tanpa IDE?


       
  * Lebih cepat belajar bahasa pemrograman baru.  
Kalau kita terbiasa coding pakai IDE, begitu belajar bahasa baru, hal pertama yang kita pikirkan adalah, "IDE-nya pakai apa ya??". Lalu menghabiskan dua minggu debat di milis, baru pilih salah satu. Download butuh waktu 2 hari. Setelah terinstal, baca Help setengah jam, baru tau cara bikin file baru. Setelah coding Hello World, bingung cari tombol Compile dan Run, 2 jam lagi untuk baca Help. Notepad coder tidak. Langsung buka apapun editor yang tersedia, mulai coding dan compile via command-line. Pada saat IDE-code baru bisa menjalankan Hello World, Notepad-coder sudah paham tentang [duck-typing](http://en.wikipedia.org/wiki/Duck_typing).





Satu pertanyaan yang selalu saya ajukan kalau ada yang tanya tentang IDE, RAD tools, dan sejenisnya.




> "Apakah ini coding untuk belajar, atau coding untuk mencari nafkah??"




Kalau jawabannya belajar, entah itu mahasiswa, atau pro yang belajar framework baru, gunakan tools sesedikit mungkin. 

Alasannya adalah, karena tujuan kita untuk paham, bukan untuk selesai.
Semakin banyak/canggih tools yang digunakan, pemahaman semakin minim. 
Tambahan lagi, kalau ada error (yang mana akan sering terjadi, namanya juga lagi belajar) sulit membedakan error karena salah pakai tools, atau error di kode program kita.

Belajar Spring AOP dengan Notepad, tidak mungkin notepad yang salah, pasti kode kita. 
Belajar Spring AOP dengan Netbeans/Eclipse, ada kemungkinan tools tersebut salah loading classpath, punya asumsi sendiri tentang struktur folder, dsb.

Kalau jawabannya untuk mencari nafkah, gunakan tools tercanggih yang bisa diperoleh dengan halal.
Hal ini hanya mungkin jika kita tidak terikat pada tools tertentu. 
Tidak akan bisa coding desktop dengan Netbeans, kemudian buka Eclipse untuk coding server-side backend.

Demikian saran dari saya.
