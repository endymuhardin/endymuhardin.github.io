---
comments: true
date: 2006-05-04 17:49:49
layout: post
slug: hello-hibernate-annotation
title: Hello Hibernate Annotation
wordpress_id: 83
categories:
- java
---

Adanya fitur annotation di Java 5 membuka dunia baru bagi para coder Java. Dulu semua metadata mau tidak mau harus disimpan di XML file. Sekarang ada pilihan baru, kita bisa taruh di XML file, atau juga bisa di source code melalui annotation. 

Salah satu implementasinya adalah [annotation untuk hibernate](http://hibernate.org/247.html) untuk mendefinisikan mapping [Hibernate](http://www.hibernate.org). Sekarang kita tidak perlu lagi [membuat *.hbm.xml](http://endy.artivisi.com/downloads/writings/Hibernate.pdf) untuk menyatakan mapping antara Java class dengan tabel di database. 

Mari kita lihat kodenya. 



## Category.java



    
``` java
package id.web.endy.tutorial;

public class Category {
  private Integer id; 
  private String name;
  private String description; 

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Integer getId() {
    return id;
  }
	
  public void setId(Integer id) {
    this.id = id;
  }
  
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
```


Class di atas akan kita simpan ke database dengan skema tabel (MySQL) sebagai berikut: 



## Category-ddl.sql

    
``` sql
CREATE TABLE Category (
  id INT PRIMARY KEY AUTO_INCREMENT, 
  name VARCHAR(255), 
  description VARCHAR(255)
);
```



Sebelum jaman annotation, kita harus buat mapping file sebagai berikut. 



## Category.hbm.xml
    
``` xml
<?xml version="1.0"?>
<!DOCTYPE hibernate-mapping PUBLIC
    "-//Hibernate/Hibernate Mapping DTD//EN"
    "http://hibernate.sourceforge.net/hibernate-mapping-2.0.dtd">
    
<hibernate-mapping>
  <class name="id.web.endy.tutorial.Category" table="Category">
    <id name="id" column="id">
      <generator class="auto"/>
    </id>
    <property name="name" column="name"/>
    <property name="name" column="description"/>
</class>
</hibernate-mapping>
```



Tapi dengan menggunakan annotation, kita bisa lupakan file Category.hbm.xml. Sebagai gantinya, kita tambahkan sedikit annotation pada class Category sebagai berikut



## Category.java dengan Annotation

    
``` java
package id.web.endy.tutorial;

@Entity
public class Category {
  private Integer id; 
  private String name;
  private String description; 

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  @Id(generate=GeneratorType.AUTO)
  public Integer getId() {
    return id;
  }
	
  public void setId(Integer id) {
    this.id = id;
  }
  
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
```

Perbedaan pada kode di atas cuma dua baris saja, yaitu: 
	
  * @Entity
  * @Id(generate=GeneratorType.AUTO)


Selain untuk property dan id biasa, hibernate annotation juga dapat digunakan untuk one-to-many, many-to-many, dan teknik-teknik advanced lainnya. 
