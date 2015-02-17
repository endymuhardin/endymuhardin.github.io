---
comments: true
date: 2009-06-22 15:08:58
layout: post
slug: postgresql-sequence-hibernate
title: PostgreSQL Sequence dengan Hibernate
wordpress_id: 481
categories:
- java
---

Menggunakan PostgreSQL Sequence dengan Hibernate

Pada artikel ini, kita akan membahas tentang bagaimana membuat Hibernate menggunakan sequence yang dibuat PostgreSQL. 

Bila kita membuat Hibernate mapping untuk entity class sebagai berikut: 

    
    
    @Entity @Table(name="example")
    public class Example {
        @Id @GeneratedValue
        private Integer id;
    
        private String name;
     
        // getter dan setter    
    }
    


kemudian menyuruh Hibernate untuk menggenerate DDL ke PostgreSQL, maka kita akan mendapatkan hasil sebagai berikut. 

    
    
    create table example (id int4 not null, name varchar(255), primary key (id))
    create sequence example_id_seq
    


Artinya, Hibernate akan membuat sequence bernama example_id_seq dan menggunakannya untuk menghasilkan id. 

Skema yang dihasilkan ini berbeda dengan skema yang biasa digunakan DBA PostgreSQL dalam membuat tabel, yaitu seperti ini

    
    
    CREATE TABLE example (id serial, name text)
    


Bila kita menggunakan mapping di atas ke skema tabel dengan id bertipe serial ini, kita akan mendapatkan exception sebagai berikut. 

    
    
    SEVERE: ERROR: relation "hibernate_sequence" does not exist
    Exception in thread "main" org.hibernate.exception.SQLGrammarException: could not get next sequence value
    Caused by: org.postgresql.util.PSQLException: ERROR: relation "hibernate_sequence" does not exist
    


Ini disebabkan karena mapping di atas akan mencari sequence bernama hibernate_sequence yang tidak ada kalau kita membuat tabel dengan id serial. 

Solusinya adalah dengan menggunakan Hibernate Annotation Extension, yaitu anotasi @GenericGenerator seperti ini. 

    
    
    @Entity @Table(name="example")
    public class Example {
        @Id @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="pg_seq")
        @GenericGenerator(name="pg_seq", strategy="sequence", parameters={
            @Parameter(name="sequence", value="example_id_seq")
        })
        private Integer id;
    
        private String name;
    }
    


Nama sequence diambil dari sequence yang dibuatkan PostgreSQL pada saat kita melakukan create table. 
Nama sequence ini bisa dilihat dengan mengetikkan \d example, yang akan menghasilkan output sebagai berikut. 

    
    
    \d example
                              Table "public.example"
     Column |  Type   |                       Modifiers                       
    --------+---------+-------------------------------------------------------
     id     | integer | not null default nextval('example_id_seq'::regclass)
     name   | text    | 
    



Barulah setelah itu kita bisa menyimpan object ke database dengan mulus. 
