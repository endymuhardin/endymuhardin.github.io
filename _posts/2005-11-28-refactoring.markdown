---
comments: true
date: 2005-11-28 11:55:21
layout: post
slug: refactoring
title: Refactoring
wordpress_id: 17
categories:
- java
---

Three times and you refactor !! Begitu kata Martin Fowler dalam bukunya Refactoring. 

Sering terjadi dalam pembuatan aplikasi, kita akan menulis suatu rutin yang sudah pernah kita tulis sebelumnya, dengan sedikit perbedaan parameter dan variabel. 
Biasanya, kalau menemui hal seperti ini, kita akan copy-paste dari kode yang sudah ada, melakukan sedikit modifikasi, dan selesai. Mudah dan sederhana, tapi terlalu rajin. Untuk jadi programmer yang efektif, kita perlu memiliki sifat malas. 

Misalnya, kita punya UserDao, dengan kode seperti ini : 

    
``` java
public class UserDao {
    public void insert(User u) {
      // connect dulu
      Connection conn = DriverManager.getConnection(url, user, pass);
      PreparedStatement ps = conn.prepareStatement("INSERT INTO tbl_user VALUES (?,?)");
      
      // ... dan seterusnya .... 
    }
}
```



Setelah itu, kita akan menambahkan method untuk delete: 

    
``` java
public class UserDao {
    public void insert(User u) {
        // connect dulu
        Connection conn = DriverManager.getConnection(url, user, pass);
        PreparedStatement ps = conn.prepareStatement("INSERT INTO tbl_user VALUES (?,?)");
      
        // ... dan seterusnya .... 
    }

    public void delete (User u) {
        // connect dulu
        Connection conn = DriverManager.getConnection(url, user, pass);
        PreparedStatement ps = conn.prepareStatement("DELETE FROM  tbl_user WHERE id=?");
      
        // ... dan seterusnya .... 
    }
}
```


Nah, sekarang kita mau tambah method untuk search user berdasarkan id, tentunya kita akan tulis kode seperti ini : 


    
``` java
public class UserDao {
    public void insert(User u) {
        // connect dulu
        Connection conn = DriverManager.getConnection(url, user, pass);
        PreparedStatement ps = conn.prepareStatement("INSERT INTO tbl_user VALUES (?,?)");
      
        // ... dan seterusnya .... 
    }

    public void delete (User u) {
        // connect dulu
        Connection conn = DriverManager.getConnection(url, user, pass);
        PreparedStatement ps = conn.prepareStatement("DELETE FROM  tbl_user WHERE id=?");
      
        // ... dan seterusnya .... 
    }

    public User search (int id) {
        // connect dulu
        Connection conn = DriverManager.getConnection(url, user, pass);
        PreparedStatement ps = conn.prepareStatement("SELECT * FROM  tbl_user WHERE id=?");
      
        // ... dan seterusnya .... 
    }
}
```



Stop !!!
Three times and you refactor. Artinya, begitu kita paste untuk kedua kali (berarti ada tiga kopi blok yang sama), itulah waktunya kita refactor. 
Kita paste blok tersebut, masukkan ke dalam function/method sendiri, berikan parameter seperlunya. Ini untuk menghindari terjadinya duplikasi kode, sehingga untuk tiap perintah cuma ada satu versi. 

Setelah direfactor, kode di atas menjadi : 

    
``` java
public class UserDao {
    public PreparedStatement prepareStatement(String sql) {
        // connect dulu
        Connection conn = DriverManager.getConnection(url, user, pass);
        return conn.prepareStatement(sql);              
    }

    public void insert(User u) {
        PreparedStatement ps = prepareStatement("INSERT INTO tbl_user VALUES (?,?)");
        // ... dan seterusnya .... 
    }

    public void delete (User u) {
        PreparedStatement ps = prepareStatement("DELETE FROM tbl_user WHERE id=?");      
        // ... dan seterusnya .... 
    }

    public User search (int id) {
        PreparedStatement ps = prepareStatement("SELECT * FROM tbl_user WHERE id=?");
        // ... dan seterusnya .... 
    }
}
```



Apabila kita menggunakan IDE canggih seperti Eclipse, IDEA, atau Netbeans, refactoring ini mudah saja dilakukan. Tinggal blok kode yang akan direfactor, kemudian klik kanan, dan pilih Extract Method. Method baru akan dibuatkan dan diisi dengan kode yang kita blok. Sedangkan kode asal yang kita blok sebelumnya akan diganti dengan pemanggilan method baru. 

Extract Method hanya satu contoh kecil saja dari Refactoring. Masih ada Extract Classes, Inline Method, dan lain sebagainya. Buku wajib buat programmer Java.

Silahkan [beli di Amazon](http://www.amazon.com/gp/product/0201485672/002-3388109-5046409?v=glance&n=283155&n=507846&s=books&v=glance) atau [download di Flazx](http://www.flazx.com/ebook790.php).
