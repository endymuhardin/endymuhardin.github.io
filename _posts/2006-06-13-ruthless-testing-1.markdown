---
comments: true
date: 2006-06-13 15:59:30
layout: post
slug: ruthless-testing-1
title: Ruthless Testing 1
wordpress_id: 106
categories:
- java
---

Sebelum menyerahkan aplikasi ke client, sudahkah Anda melakukan testing?
100% programmer pasti menjawab dengan kompak, "SUDAAAAHHHH !!!"

Nah, kalau begitu, pertanyaannya, apa saja yang sudah ditest?

Jawaban orang biasanya bervariasi, tergantung nilai project, jumlah orang yang tersedia, dan juga tergantung tingkat kegaptekan si programmer terhadap teknologi testing yang tersedia. 

Testing minimal yang dilakukan biasanya adalah user testing. Jadi, ada user (atau programmer yang pura-pura jadi user) mencoba menggunakan aplikasi yang (katanya sih) sudah selesai. Biasanya fenomena ini akan berakhir dengan periode bugfix yang lebih lama daripada periode coding itu sendiri. 

Jadi, bagaimana tipsnya supaya user testing berjalan dengan lancar, minim bug, kalaupun ada, bisa diselesaikan dalam bilangan hari?

Jawabannya adalah melaksanakan "ruthless testing". Artinya testing secara kejam. Testing yang berlapis-lapis sehingga kalau ada programmer bandel yang membuat percabangan if terlalu dalam, akan langsung ketahuan. 

Bagaimana itu? Kita akan lihat sebentar lagi. 

Ada berapa jenis testing? Hmm .. menurut saya ada: 

1. Unit testing
2. Integration testing
3. Coverage testing
4. Code compliance testing
5. User/functional testing
6. Performance testing

Semua test ini harus dijalankan tanpa kecuali. 

What the !@#$? Banyak sekali? Apakah semua harus dijalankan? Wah, bisa-bisa kerjaan kita cuma ngurusin test doang? Bagaimana ini?

Hmm.. jangan khawatir, semua bisa dijalankan dengan investasi minimal di awal project. 
Tips saya adalah: 



	
  1. Alokasikan pembuatan test bersama-sama dengan construction. Jangan setelah construction. Jadi, wahai Project Managers, kalau merencanakan construction, tambahkan alokasi waktu untuk membuat test. 

	
  2. Semua test harus otomatis dan bisa dijalankan dengan sekali perintah. Di project saya, semua test dijalankan cukup dengan: 



`ant full-test`

Baiklah, mari kita lihat satu persatu secara lebih detail. 



### Unit Testing


Ini adalah testing di level paling detail dari aplikasi. Artinya, testing di level method/function. Misalnya saya punya kode seperti ini: 

    
``` java
public class DayCounter{
  /**
  * menghitung jumlah hari dalam bulan dan tahun yang diminta. 
  * Misalnya, bila month = 2 dan year = 2000, method ini akan menghasilkan 29.
  * @param month bulan yang akan dihitung
  * @param year tahun yang akan dihitung
  * @return jumlah hari dalam bulan dan tahun bersangkutan
  */
  public int numDays(int month, int year) {
    return 29;
  }
}
```



Coba lihat contoh kode di atas? Salah bukan? 
Apapun yang kita masukkan, hasilnya pasti 29.
Mari kita buktikan dengan unit test bahwa kode di atas salah. 


    
``` java
public class DayCounter extends junit.framework.TestCase{
  public void testNumDays() {
    DayCounter d = new DayCounter();
    assertEquals(31, d.numDays(1,2000)); 
  }
}
```



Pada waktu dijalankan, unit test tersebut akan menghasilkan tulisan FAILED

Di Java, unit test dapat dilakukan secara otomatis dengan menggunakan [JUnit](http://ww.junit.org).



### Integration Test


Sebagian besar aplikasi yang kita buat akan menggunakan database. Untuk itu, kita perlu mengetes apakah kode program kita dapat berinteraksi dengan database sesuai harapan.
Mirip dengan JUnit, kita membuat unit test yang mengakses database. Misalnya, berikut kode programnya: 


    
``` java
public class DatabaseAccess{
  /**
  * memeriksa username dan password dalam database. 
  * Method ini akan mencocokkan username dan password yang diberikan 
  * dan yang terdaftar di database.
  * Apabila cocok, akan menghasilkan true, dan apabila tidak cocok akan menghasilkan false.
  * @param username 
  * @param password
  * @return true kalau cocok, false kalau tidak cocok
  */
  public boolean checkLogin(String username, String password) {
    String sql = "SELECT * FROM user WHERE username=? AND password=?"
    // dst kode akses database
  }
}
```



Dan ini adalah kode untuk mengetesnya.


    
``` java
public class DatabaseAccess extends junit.framework.TestCase{
  public void testCheckLogin() {
    DatabaseAccess db = new DatabaseAccess();
    
    // asumsikan ada username endy dan password secret di database
    assertTrue(db.checkLogin("endy", "secret"));

    // coba dengan user sembarang, harusnya akan menghasilkan false
    assertFalse(db.checkLogin("nobody", "gakada"));
  }
}
```



Perhatikan bahwa kedua test di atas mengasumsikan bahwa kita punya database, terisi data endy:secret, dan tidak ada record nobody:gakada di dalam tabel user.
Berarti, setiap dijalankan, kita harus memastikan asumsi di atas terpenuhi. 
Lalu, bagaimana cara menjalankannya secara otomatis? Gampang, gunakan [DBUnit](http://dbunit.sourceforge.net/). 

Dengan DBUnit, kita dapat me-reset kondisi database sesuai keinginan setiap kali test akan dijalankan. 
Caranya, kita harus buat test data, yaitu satu record berisi data endy:test dalam tabel user. Test data ini disimpan dalam file checkLogin.xml

    
``` xml
<dataset>
  <user id='1' 
        username='endy'
        password='secret'
  />
</dataset>
```



Sebelum test dimulai, pastikan database direset. Tambahkan method berikut di kode test: 

    
``` java
public class DatabaseAccess extends junit.framework.TestCase{
  public void testCheckLogin() {
    // reset database
    prepareDatabase();
    
    DatabaseAccess db = new DatabaseAccess();
    
    // asumsikan ada username endy dan password secret di database
    assertTrue(db.checkLogin("endy", "secret"));

    // coba dengan user sembarang, harusnya akan menghasilkan false
    assertFalse(db.checkLogin("nobody", "gakada"));
  }

  private void prepareDatabase(){
    DatabaseOperation.CLEAN_INSERT.execute(dbConn, getTestData());
  }

  private IDataSet getTestData(){
    return new FlatXmlDataSet(new FileInputStream("checkLogin.xml"));
  }
}
```



Nah, DBUnit akan dengan senang hati me-reset isi **database development** Anda. Pastikan test tersebut dijalankan di DATABASE DEVELOPMENT, dan bukan DATABASE PRODUCTION. 

Sementara cukup sekian. Pada artikel selanjutnya, kita akan bahas tentang: 
3. Coverage Testing
4. Code compliance testing
5. User/functional testing
6. Performance testing
Dan sesuai janji saya, semua test otomatis dan sekali pencet.
