---
comments: true
date: 2006-07-20 15:38:19
layout: post
slug: ruthless-testing-3
title: Ruthless Testing 3
wordpress_id: 121
categories:
- java
---

Alkisah, di suatu project, ada kode program yang berkelakuan aneh. Kode program tersebut berfungsi untuk melakukan pendaftaran user baru ke dalam sistem. Jadi, user membuka form, mengisi data diri, dan menekan tombol Submit. Tidak ada yang aneh dengan fiturnya. 

Keanehannya adalah, entah kenapa, aplikasi tersebut cuma bisa digunakan 7 kali. Jadi pada waktu user ke-8 menekan tombol Submit, datanya tidak tersimpan di database. Anehnya juga, aplikasi tidak menimbulkan pesan error. Hmm ... sungguh gaib. 

Berbagai upaya dilakukan untuk mengatasi masalah ini. Tim pengusir hantu didatangkan, lengkap dengan kostum putih-putih dan botol penangkap hantu, karena dicurigai ada 'sesuatu' dengan angka 7. Tetapi tidak juga mencapai solusi yang memuaskan. 

Akhirnya, seorang anggota milis JUG didatangkan. Beliau memeriksa source code fitur registrasi tersebut, sebagai berikut: 

    
``` java
public void save (User u) {
  try {
    Connection conn = DriverManager.getConnection(url, username, password);
    
    PreparedStatement pstm = conn.prepareStatement("INSERT INTO user VALUES (?,?,?)");
    pstm.setInt(1, u.getId());
    pstm.setString(2, u.getUsername());
    pstm.setString(3, u.getPassword());
    
    pstm.executeUpdate();
  } catch(Exception err) {

  }
}
```



Pembaca yang teliti (ya, maksudnya Anda) akan segera menemukan asal muasal semua 'kejadian gaib' di atas, yaitu: 



	
  1. Connection dibuka, tapi tidak pernah ditutup. Besar kemungkinan max connection di database adalah 7 concurrent connection. Sehingga setelah 7 kali connect dan 0 kali disconnect, database akan menolak koneksi baru. 

	
  2. Catch block dibiarkan kosong, sehingga error dari database tidak akan tampil di mana-mana. 



Hmm .. kesalahan yang 'newbie banget'. Melalui pemeriksaan menyeluruh, ditemukan kesalahan serupa di berbagai bagian kode yang lain. 

Pada titik ini, para project manager, development team leader akan segera mengeluh dan bersiap-siap mengisi komentar di bawah, "Masa saya harus baca kode baris-per-baris? Kayak kurang kerjaan aja !!"
Sebelum Anda lakukan itu, sabar dulu .. baca sampai habis. Kita akan segera lihat solusinya. 

Pemeriksaan baris kode seperti ini sangat melelahkan. Semakin besar projectnya, semakin banyak baris kodenya, semakin tinggi beban pemeriksaannya. Di lain pihak, kalau kita tidak melakukan pemeriksaan, kita menimbulkan resiko terjadinya masalah di kemudian hari. 

Jadi, bagaimana solusinya?

Untungnya --seperti biasa-- kita bukan yang pertama menemukan masalah seperti ini. Masalah sudah pernah dialami orang lain, dan dibuatkan solusinya, sehingga kita --seperti biasa-- tinggal download dan pakai :D

Jawaban dari masalah ini adalah **automated code review**. Tools ini akan melakukan review terhadap source code, sesuai dengan aturan yang kita tetapkan, dengan teliti, otomatis, dan repeatable. Dengan tool ini, berapapun baris kode yang ada, semua akan diperiksa secara menyeluruh. 

Ada beberapa solusi yang dapat digunakan: 



	
  * [Jupiter (Eclipse Plugin)](http://csdl.ics.hawaii.edu/Tools/Jupiter/)

	
  * [PMD](http://pmd.sourceforge.net)

	
  * [Hammurapi](http://www.hammurapi.org)

	
  * Built-in feature IntelliJ IDEA



Pada contoh kali ini, kita akan coba menggunakan PMD. Caranya mudah: 

	
  1. Download dari websitenya.

	
  2. Extract

	
  3. Buat target di Ant untuk memanggil PMD.

	
  4. Lihat reportnya



Untuk langkah #1 dan #2 tidak perlu dijelaskan lebih lanjut. Target Ant untuk langkah #3 adalah sebagai berikut: 

    
``` xml
<target name="code-review" depends="prepare">
  <pmd targetjdk="1.5" shortFilenames="true">
   
    <ruleset>basic</ruleset>   
    <ruleset>codesize</ruleset>
    <ruleset>clone</ruleset>
    <ruleset>controversial</ruleset>
    <ruleset>coupling</ruleset>
    <ruleset>design</ruleset>
    <ruleset>finalizers</ruleset>
    <ruleset>imports</ruleset>
    <ruleset>javabeans</ruleset>
    <ruleset>logging-java</ruleset>
    <ruleset>logging-jakarta-commons</ruleset>
    <ruleset>naming</ruleset>
    <ruleset>optimizations</ruleset>
    <ruleset>strictexception</ruleset>
    <ruleset>strings</ruleset>
    <ruleset>sunsecure</ruleset>
    <ruleset>unusedcode</ruleset>
   
    <formatter
        type="net.sourceforge.pmd.renderers.HTMLRenderer"  
        toFile="${pmd.result}/pmd.html"
    />
    <fileset dir="src">
      <include name="**/*.java"/>
    </fileset>
  </pmd>
</target>
```



Berikut penjelasannya: 



	
  1. Target JDK : memeriksa kesesuaian dengan JDK 1.5

	
  2. Ruleset : Aturan yang akan diberlakulkan. Detailnya bisa dilihat di website PMD. Sebagai contoh, dengan memberlakukan ruleset basic, kita memeriksa blok catch yang kosong, sehingga mencegah masalah pesan error di atas. Sedangkan ruleset design memeriksa apakah Connection yang dibuat sudah ditutup. 


	
  3. Formatter : Jenis formatter yang digunakan. Report yang dihasilkan PMD dapat berupa text, xml, csv.

	
  4. Fileset: source code yang akan direview. Kita dapat mengganti parameter ini dan mereview semua source code yang ada di harddisk kita. SIlahkan mencoba mendownload source code project open source java (misalnya Tomcat, atau JBoss), dan lihat apakah kode programnya ditulis dengan baik.  




Laporan yang dihasilkan bentuknya seperti ini: 
![PMD Review Result ](/images/uploads/2006/07/pmd-report.png)

Selamat mencoba. Semoga bermanfaat. 
