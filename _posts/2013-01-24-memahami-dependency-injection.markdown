---
layout: post
title: "Memahami Dependency Injection"
date: 2013-01-24 18:14
comments: true
categories: 
- java
---

[Spring Framework](http://www.springsource.org/spring-framework) 
merupakan framework yang sangat populer 
dan banyak digunakan orang di seluruh dunia.
Jargon utama yang sering kita dengar bersamaan dengan Spring Framework 
adalah prinsip _Dependency Injection_. Ini adalah teknik pemrograman 
yang digadang-gadang mampu merapikan aplikasi yang kita buat sehingga 
mudah dipahami dan dikelola. 

Tapi apakah yang dimaksud dengan _Dependency Injection_ atau _Inversion of Control_ itu?
<!--more-->

# Contoh Kasus #

Sebagai programmer, kita akan lebih mudah memahami suatu konsep 
bila sudah melihat sendiri contoh kode program dan aplikasinya. 
Untuk itu, kita akan membuat sebuah contoh kasus sederhana, 
yaitu menyimpan data ke tabel `produk` dalam database.

Untuk titik awal, misalnya kita memiliki class `Produk` sebagai berikut: 

## Produk.java ##

```java
public class Produk {
    private Integer id;
    private String kode;
    private String nama;
    private BigDecimal harga;
    
    // getter dan setter tidak ditampilkan
}
```

Supaya rapi, kode program untuk Create (insert), Read (select), 
Update, dan Delete (CRUD), akan kita kumpulkan di dalam class `ProdukDao` sebagai berikut:

## ProdukDao.java ##

```java
public class ProdukDao {
    private DataSource dataSource;

    public void create(Produk p) throws Exception {
        String sql = "insert into produk (kode, nama, harga) ";
        sql += "(?,?,?)";
        
        Connection databaseConnection = dataSource.getConnection();
        PreparedStatement ps = databaseConnection.prepareStatement(sql);
        ps.setString(1, p.getKode());
        ps.setString(2, p.getNama());
        ps.setBigDecimal(3, p.getHarga());
        ps.executeUpdate();
        databaseConnection.close();
    }
    
    public Produk cariById(Integer id){
        // implementasi tidak ditulis
    }
    
    
    public void update(Produk p){
        // implementasi tidak ditulis
    }
    
    
    public void delete(Produk p){
        // implementasi tidak ditulis
    }
}
```

Sebagai demonstrasi, kita akan menggunakan/memanggil `ProdukDao` ini dalam class 
`ProdukDaoTest` sebagai berikut:

## ProdukDaoTest.java ##

```java
public class ProdukDaoTest {
    public static void main(String[] xx){
        Produk p = new Produk();
        p.setKode("P-001");
        p.setNama("Produk 001");
        p.setHarga(new BigDecimal(10000.00);
        
        ProdukDao pd = new ProdukDao();
        pd.create(p);
    }
}
```

Dari ketiga class di atas, kita akan melihat: 

* bagaimana implementasi tanpa Dependency Injection
* bagaimana konsep Dependency Injection
* bagaimana menggunakan Spring Framework untuk melakukan Dependency Injection

Sebelumnya, apa itu dependency injection? Kalau diterjemahkan ke bahasa Indonesia, 
kira-kira artinya adalah _menyediakan kebutuhan_. 
Kebutuhan apa yang dimaksud? 

Coba lihat class `ProdukDao`. Untuk bisa menjalankan tugasnya dengan baik, 
dia membutuhkan object `DataSource`, yaitu koneksi ke database. 
Bagaimana `ProdukDao` mendapatkan `DataSource` inilah yang menjadi pembahasan dalam _Dependency Injection_ (DI).

# Tanpa DI #

Kalau kita tidak menggunakan prinsip DI, maka `ProdukDao` harus mengadakan sendiri object `DataSource`. 
Kira-kira begini implementasinya: 

```java
public class ProdukDao {
    private DataSource dataSource;
    
    public ProdukDao() throws Exception {
        dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUsername("root");
        dataSource.setPassword("admin");
        dataSource.setUrl("jdbc:mysql://localhost/belajar");
    }

    public void create(Produk p) throws Exception {
        String sql = "insert into produk (kode, nama, harga) ";
        sql += "(?,?,?)";
        
        Connection databaseConnection = dataSource.getConnection();
        PreparedStatement ps = databaseConnection.prepareStatement(sql);
        ps.setString(1, p.getKode());
        ps.setString(2, p.getNama());
        ps.setBigDecimal(3, p.getHarga());
        ps.executeUpdate();
        databaseConnection.close();
    }
    
    public Produk cariById(Integer id){
        // implementasi tidak ditulis
    }
    
    
    public void update(Produk p){
        // implementasi tidak ditulis
    }
    
    
    public void delete(Produk p){
        // implementasi tidak ditulis
    }
}
```

Perlu kita sadari bahwa pada aplikasi yang sebenarnya, kode akses database tidak hanya `ProdukDao` saja.
Nantinya juga ada `CustomerDao`, `PenjualanDao`, dan sebagainya. 
Di aplikasi berskala menengah, bisa ada ratusan class seperti ini, 
sehingga untuk memahami situasinya, kita tidak boleh berpikir hanya di satu class ini saja.

Ada beberapa kelemahan dari cara tanpa DI ini, diantaranya:

* Konfigurasi koneksi database tersebar di banyak tempat, yaitu di semua `XxxDao`
* Object `dataSource` juga tersebar, tidak bisa satu `dataSource` dipakai bersama oleh semua `XxxDao`
* Karena konfigurasi dan inisialisasinya tersebar, bila ada perubahan (misalnya menggunakan _connection pooling_), 
  harus dilakukan di banyak tempat.
* Semua perubahan di atas mengharuskan full compile karena banyaknya class yang terlibat.

Untuk mengatasi keterbatasan di atas, kita gunakan prinsip DI.

# DI manual #

Bila kita gunakan prinsip DI, maka `ProdukDao` tidak lagi mengurus inisialisasi `dataSource`. 
Dia cukup tahu beres dan tinggal pakai. Lalu siapa yang melakukan inisialisasi? 
Boleh siapa saja, tapi untuk kesederhanaan ilustrasi, mari kita tulis saja di dalam `ProdukDaoTest`, sebagai berikut:

```java
public class ProdukDaoTest {
    public static void main(String[] xx){
        Produk p = new Produk();
        p.setKode("P-001");
        p.setNama("Produk 001");
        p.setHarga(new BigDecimal(10000.00);
        
        DataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUsername("root");
        dataSource.setPassword("admin");
        dataSource.setUrl("jdbc:mysql://localhost/belajar");
        
        ProdukDao pd = new ProdukDao();
        pd.create(p);
    }
}
```

Lalu bagaimana cara memasukkan (inject) ke dalam `ProdukDao`? 
Kita harus sediakan jalan masuknya. Ada dua pilihan: 

* membuat method untuk mengisi data (setter-injection)
* menambah argumen di constructor (constructor-injection)

Agar jelas, kita akan buatkan dua-duanya.

```java
public class ProdukDao {
    private DataSource dataSource;
    
    // ini kalau mau inject melalui constructor
    public ProdukDao(DataSource ds) {
        this.dataSource = ds;
    }
    
    // ini kalau mau method sendiri (setter-injection)
    public void setDataSource(DataSource ds) {
        this.dataSource = ds;
    }
    
    // method lain tidak ditampilkan supaya tidak bikin penuh
}
```

Selanjutnya, dalam `ProdukDaoTest` kita bisa isikan object DataSource tersebut melalui constructor seperti ini:

```java
ProdukDao pd = new ProdukDao(dataSource);
```

ataupun melalui method setter seperti ini:

```java
ProdukDao pd = new ProdukDao();
pd.setDataSource(dataSource);
```

Cara manual ini sudah lumayan merapikan kode program kita, karena bila ada perubahan terhadap inisialisasi dataSource, seperti misalnya:

* perubahan konfigurasi koneksi
* perubahan implementasi connection pooling
* ingin menggunakan managed DataSource melalui JNDI
* dsb

Kita cukup melakukan perubahan di satu tempat saja, yaitu dimana dia diinisialisasikan.

# DI Spring XML #

Walaupun bisa dilakukan secara manual, tetapi ada baiknya kita menggunakan Spring Framework untuk melakukan DI. 
Beberapa alasannya antara lain:

* AOP (tidak dibahas pada artikel ini)
* keseragaman antar project/aplikasi
* standarisasi skillset. Bila cari programmer baru, cukup mensyaratkan pengetahuan Spring Framework. 
Tidak perlu lagi ditraining tentang teknik DI yang kita karang sendiri.

Spring Framework **umumnya** dikonfigurasi dengan file XML (walaupun bisa juga full Java).
Berikut adalah contoh file konfigurasinya, misalnya kita beri nama `konfig-spring.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver" />
        <property name="url" value="jdbc:mysql://localhost/belajar" />
        <property name="username" value="root" />
        <property name="password" value="admin" />
    </bean>
    
    <bean id="produkDao" class="com.muhardin.endy.belajar.spring.ProdukDao">
        <property name="dataSource" ref="dataSource"/>
    </bean>
		
</beans>
```

File konfigurasi tersebut kita baca dan gunakan dalam class `ProdukDaoTest`, 
perhatikan perbedaan inisialisasi `DataSource` dan `ProdukDao`


```java
public class ProdukDaoTest {
    public static void main(String[] xx){
        Produk p = new Produk();
        p.setKode("P-001");
        p.setNama("Produk 001");
        p.setHarga(new BigDecimal(10000.00);
        
        ApplicationContext ctx 
            = new ClassPathXmlApplicationContext("classpath:konfig-spring.xml");
        
        ProdukDao pd = ctx.getBean(ProdukDao.class);
        pd.create(p);
    }
}
```

Pada contoh di atas, kita bisa lihat beberapa perbedaan yaitu:

* inisialisasi `DataSource` pindah ke dalam `konfig-spring.xml`
* tidak perlu lagi _mengisikan_ `DataSource` ke dalam `ProdukDao`, karena sudah dilakukan oleh Spring.

Walaupun demikian, masih ada sedikit ganjalan, yaitu:

* bila `XxxDao` jumlahnya ratusan, maka file `konfig-spring.xml` akan membengkak.

Apa solusinya? 

# DI Spring @Autowired #

Spring Framework menyediakan fitur _component-scan_, yaitu dia akan melihat isi _package_ yang kita sebutkan, 
kemudian akan mencari class-class yang diberi anotasi berikut: 

* `@Repository`
* `@Service`
* `@Controller`
* `@Component`

Setelah ditemukan, maka dia akan melakukan inisialisasi terhadap class tersebut, dan lalu mengisi (inject)
semua kebutuhannya (dependency). Untuk injection ini, kita juga tidak perlu lagi menyediakan setter method maupun 
menambahkan argumen di constructor. Kita dapat menggunakan anotasi `@Autowired`.

Berikut adalah konfigurasi `konfig-spring.xml` yang baru:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xmlns:context="http://www.springframework.org/schema/context"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver" />
        <property name="url" value="jdbc:mysql://localhost/belajar" />
        <property name="username" value="root" />
        <property name="password" value="admin" />
    </bean>
    
    <context:component-scan base-package="com.muhardin.endy.belajar.spring" />
		
</beans>
```

Perhatikan bahwa deklarasi `produkDao` telah digantikan dengan perintah `context:component-scan`.

Berikut adalah perubahan di `ProdukDao`

```java
@Repository
public class ProdukDao {
    @Autowired private DataSource dataSource;

    public void create(Produk p){
        String sql = "insert into produk (kode, nama, harga) ";
        sql += "(?,?,?)";
        
        Connection databaseConnection = dataSource.getConnection();
        PreparedStatement ps = databaseConnection.prepareStatement(sql);
        ps.setString(1, p.getKode());
        ps.setString(2, p.getNama());
        ps.setBigDecimal(3, p.getHarga());
        ps.executeUpdate();
        databaseConnection.close();
    }
    
    // method lain tidak ditampilkan supaya tidak bikin penuh
}
```

Perhatikan bahwa setter dan constructor injection sudah dihapus, 
dan digantikan dengan anotasi `@Autowired`. 
Semua field/property yang memiliki anotasi `@Autowired` akan diisikan oleh Spring dengan object bertipe-data sesuai. 
Bila tidak ditemukan, maka aplikasi akan gagal start dengan pesan error seperti ini:

```
SEVERE: Context initialization failed
org.springframework.beans.factory.BeanCreationException: 
Error creating bean with name 'produkDao': 
Injection of autowired dependencies failed; 
nested exception is org.springframework.beans.factory.BeanCreationException: 
Could not autowire field: 
private javax.sql.DataSource dataSource; 
nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: 
No matching bean of type [javax.sql.DataSource] found for dependency: 
expected at least 1 bean which qualifies as autowire candidate for this dependency.
```

Bila menemukan pesan error tersebut, artinya Spring tidak memiliki satupun object bertipe `DataSource`
dalam daftar pengelolaannya. Untuk bisa dikelola oleh Spring, ada beberapa caranya, yaitu:

* dideklarasikan secara tertulis seperti object `dataSource` di atas
* discan otomatis melalui `component-scan` dan anotasi `@Repository`, `@Service`, `@Controller`, ataupun`@Component`.
  Contohnya object `produkDao` di atas.

Ada beberapa kesalahan yang umum terjadi sehingga muncul pesan error di atas, diantaranya

* sudah ada anotasi, tapi package tempatnya berada tidak didaftarkan dalam `component-scan`
* package sudah didaftarkan dalam `component-scan`, tapi classnya tidak diberikan anotasi `@Repository`, `@Service`, `@Controller`, ataupun`@Component`.
* sudah ada anotasi, packagenya sudah didaftarkan, tapi file xml yang memuat konfigurasi tersebut tidak diload oleh aplikasi.
  Ini biasa terjadi kalau satu aplikasi terdiri dari banyak file konfigurasi Spring (yang mana ini adalah hal yang umum terjadi)

Lalu kapan dan bagaimana Spring membaca file konfigurasi? Ada beberapa cara: 

* Ditulis dalam kode program : `new ClassPathXmlApplicationContext("classpath:konfig-spring.xml")`
* Bila aplikasinya berbasis web, biasanya diinisialisasi melalui `web.xml` seperti ini: 

```xml
<context-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>
        classpath*:konfig-spring.xml
    </param-value>
</context-param>
<listener>
    <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
```

Demikianlah penjelasan tentang konsep Dependency Injection dan Spring Framework. Semoga bermanfaat.

