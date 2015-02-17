---
comments: true
date: 2009-03-04 10:01:52
layout: post
slug: null-date-di-mysql
title: Null Date di MySQL
wordpress_id: 407
categories:
- java
---

Null Date di MySQL

Bila memiliki tipe data DATE di database MySQL, format standarnya adalah yyyy-MM-dd. 
Jadi, bila kita mau mengisi 17 Agustus 1945, kita lakukan seperti ini 


    
    
    INSERT INTO hari_besar_nasional (tanggal, keterangan)
    VALUES ('1945-08-17', 'Hari Kemerdekaan RI');
    



Bila kita tidak mengisikan tanggal alias NULL, maka MySQL akan mengisi kolom tersebut dengan nilai 0000-00-00. Sayangnya, nilai ini tidak diterima dengan baik oleh driver JDBC MySQL. 

Berikut contoh kode program dalam Java


    
    
    String sql = "select * from hari_besar_nasional";
    ResultSet rs = connection.createStatement().executeQuery(sql);
    
    while(rs.next()){
      System.out.println("Tanggal : "+rs.getDate("tanggal");
      System.out.println("Keterangan : "+rs.getString("keterangan");
    }
    
    rs.close();
    



Jika ada data yang berisi 0000-00-00, maka akan terjadi exception sebagai berikut:




> java.sql.SQLException: Cannot convert value '0000-00-00 00:00:00'





Masalah ini dijelaskan di [dokumentasi MySQL ini](http://dev.mysql.com/doc/refman/5.0/en/using-date.html). 

Solusinya adalah mengganti parameter koneksi database, yang tadinya seperti ini : 


    
    jdbc:mysql://localhost/nama_database



menjadi seperti ini


    
    jdbc:mysql://localhost/nama_database?zeroDateTimeBehavior=convertToNull




