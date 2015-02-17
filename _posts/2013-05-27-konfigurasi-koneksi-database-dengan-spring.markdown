---
layout: post
title: "Konfigurasi Koneksi Database dengan Spring"
date: 2013-05-27 17:02
comments: true
categories: 
- java
---

Di Java, ada banyak cara untuk mengakses database, diantaranya:

* [JDBC polos tanpa framework apapun](http://docs.oracle.com/javase/tutorial/jdbc/)
* [JDBC dengan Spring (Spring JDBC)](http://static.springsource.org/spring/docs/3.2.x/spring-framework-reference/html/jdbc.html)
* JDBC dengan [iBatis/MyBatis](http://blog.mybatis.org/)
* [Hibernate](http://docs.jboss.org/hibernate/orm/4.2/manual/en-US/html/)
* [JDO](http://www.datanucleus.org/products/datanucleus/jdo/guides/tutorial_rdbms.html)
* [JPA](http://docs.oracle.com/javaee/6/tutorial/doc/bnbpz.html)
* [Spring Data JPA](http://www.springsource.org/spring-data/jpa)

Masing-masing memiliki kelebihan dan kekurangan masing-masing yang tidak akan kita bahas di artikel ini.
Kali ini kita hanya akan membahas metode Spring JDBC dan perbandingannya dengan JDBC murni.

Artikel ini merupakan bagian pertama dari rangkaian artikel Spring JDBC, yaitu

1. [Konfigurasi koneksi database](http://software.endy.muhardin.com/java/konfigurasi-koneksi-database-dengan-spring/)
2. [Struktur Aplikasi](http://software.endy.muhardin.com/java/struktur-aplikasi-java-dengan-spring-dan-maven/)
3. [Insert, update, dan delete data](http://software.endy.muhardin.com/java/insert-update-delete-dengan-spring-jdbc/)
4. [Query data](http://software.endy.muhardin.com/java/query-dengan-spring-jdbc/)
5. [Mengetes Akses Database](http://software.endy.muhardin.com/java/mengetes-akses-database/)

Keseluruhan kode program dapat dilihat di [repository belajar-akses-database-java di Github saya](https://github.com/endymuhardin/belajar-akses-database-java), khususnya [branch spring-jdbc](https://github.com/endymuhardin/belajar-akses-database-java/tree/spring-jdbc).

<!--more-->

## Perbandingan JDBC polos dan Spring JDBC ##

Menggunakan JDBC polos tanpa library memang mudah, karena tidak perlu pusing mempelajari library lain. Tapi ada beberapa keterbatasan dan kesulitan, diantaranya:

* semua method throws Exception, sehingga kode program kita menjadi kotor dengan try-catch
* tidak ada manajemen koneksi database, kita harus buka-tutup sendiri
* tidak ada declarative transaction, kita harus secara manual melakukan begin-commit/rollback

Dengan berbagai keterbatasan tersebut, ada baiknya kita menggunakan bantuan Spring Framework, yaitu modul `spring-jdbc` untuk memudahkan berbagai kegiatan di atas. Tentunya masih banyak hal yang harus kita lakukan sendiri, tidak seperti penggunaan library Object Relational Mapping (ORM) seperti Hibernate atau JPA, di antaranya:

* mapping dari result set menjadi Java object
* mapping dari Java object menjadi isi parameter PreparedStatement
* cache
* cascading operation
* generate primary key secara otomatis
* dsb

Ada beberapa tahapan dalam menggunakan Spring JDBC, yaitu : 

1. Konfigurasi Koneksi Database
2. Membuat class Data Access Object (DAO)
3. Membuat class implementasi business process/service
4. Membuat test otomatis menggunakan JUnit

# Studi Kasus #

Agar lebih konkrit, kita akan menggunakan skema database yang umum digunakan di aplikasi bisnis, 
yaitu memiliki tabel :

* Master Data / Referensi
* Header Transaksi
* Detail Transaksi

Berikut adalah skema database yang akan kita gunakan:

```sql
create table m_produk (
    id int primary key auto_increment,
    kode varchar(20) not null,
    nama varchar(255) not null,
    harga decimal(19,2) not null
) engine=InnoDB ;

create table t_penjualan (
    id int primary key auto_increment,
    waktu_transaksi datetime not null
) engine=InnoDB AUTO_INCREMENT=100;

create table t_penjualan_detail (
    id int primary key auto_increment,
    id_penjualan int not null,
    id_produk int not null,
    harga decimal(19,2) not null,
    jumlah int not null, 
    foreign key(id_penjualan) references t_penjualan(id) on delete cascade,
    foreign key(id_produk) references m_produk(id) on delete restrict
) engine=InnoDB AUTO_INCREMENT=100;
```

Untuk keperluan test, jangan lupa kita sertakan beberapa baris data.

```sql
insert into m_produk (id,kode,nama,harga) values 
(1, 'K-001', 'Keyboard USB', 150000),
(2, 'M-001', 'Mouse USB', 50000),
(3, 'L-001', 'Laptop', 10000000);

insert into t_penjualan (id,waktu_transaksi) values 
(1,'2013-01-01 20:30:30'),
(2,'2013-01-02 15:15:15'),
(3,'2013-02-02 09:09:09');

insert into t_penjualan_detail (id,id_penjualan, id_produk, harga, jumlah) values 
(1,1,1,150000,2),
(2,1,2,50000,5),
(3,2,1,150000,3),
(4,2,2,50000,3),
(5,3,3,10000000,1);
```

Tabel dan data di atas kita masukkan ke database dengan rincian sebagai berikut:

* Jenis Database : MySQL
* Server Database : localhost
* Nama Database : belajar
* Username Database : root
* Password Database : admin

Selanjutnya kita akan mengkonfigurasi Spring supaya bisa terkoneksi dengan database tersebut.

# Konfigurasi Koneksi Database #

## Dependensi ##

Kita membutuhkan beberapa library, dinyatakan dalam dependensi Maven sebagai berikut:

### Driver database MySQL ###

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>${mysql.version}</version>
    <scope>runtime</scope>
</dependency>
```

### Library manajemen koneksi database (database connection pooling) ###

```xml
<dependency>
    <groupId>commons-dbcp</groupId>
    <artifactId>commons-dbcp</artifactId>
    <version>${commons-dbcp.version}</version>
</dependency>
```

### Spring JDBC ###

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>${org.springframework.version}</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>${org.springframework.version}</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>${org.springframework.version}</version>
    <scope>test</scope>
</dependency>
```

Selanjutnya, kita membuat konfigurasi database untuk Spring. Kita beri nama saja file konfigurasinya `spring-jdbc-ctx.xml`
dan kita letakkan di folder `src/main/resources`. File ini berisi :

* konfigurasi data source untuk koneksi ke database. Kita menggunakan pustaka `commons-dbcp` untuk menangani connection pooling ke database.
* transaction manager. Ini dibutuhkan supaya kita tidak perlu lagi membuat coding untuk rangkaian `begin-commit/rollback`.
* component scan. Ini dibutuhkan agar object DAO dan Service kita otomatis dideteksi dan diinisialisasi oleh Spring

## Koneksi Database ##

Berikut konfigurasi koneksi database

```xml
<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
    <property name="driverClassName" value="com.mysql.jdbc.Driver" />
    <property name="url" value="jdbc:mysql://localhost/belajar" />
    <property name="username" value="root" />
    <property name="password" value="admin" />
    <property name="maxActive" value="80" />
    <property name="maxWait" value="40000" />
    <property name="maxIdle" value="20" />
</bean>
```

Penjelasannya sebagai berikut:

### Database Connection Pooling ###

Koneksi ke database sebetulnya merupakan operasi yang _mahal_. Kenapa _mahal_? 
Karena setiap kali kita membuat koneksi, ada serangkaian kegiatan yang harus dilakukan oleh database server seperti:

* memeriksa username dan password
* memeriksa apakah komputer kita (dilihat dari alamat IP atau nama host) diijinkan untuk masuk
* memeriksa apakah database, tabel, dan tindakan yang kita lakukan memiliki ijin akses yang mencukupi

Oleh karena itu, idealnya koneksi database dibuat sekali saja dan digunakan terus sepanjang aplikasi berjalan.
Tentunya kalau koneksi database hanya satu, setiap request dari user akan mengantri. 
Untuk itu kita buat banyak koneksi sekaligus yang nantinya akan _dipinjamkan_ pada request yang membutuhkan.
Teknik ini disebut dengan istilah database connection pooling.

Library yang kita gunakan untuk itu adalah [Apache Commons DBCP](http://commons.apache.org/proper/commons-dbcp/configuration.html), yang ditandai dengan penggunaan class `org.apache.commons.dbcp.BasicDataSource` di atas.

Ada banyak hal yang bisa disetting, tapi kita akan fokus ke beberapa saja yaitu:

* `driverClassName` : nama class untuk koneksi ke database. Ini harus sesuai dengan merek dan versi database yang digunakan
* `url` : informasi koneksi database. Biasanya berisi alamat server (IP atau Hostname) dan nama database
* `username` : username untuk connect ke database
* `password` : passwordnya user tersebut

Keempat informasi di atas adalah informasi umum yang kita butuhkan apapun metode koneksi database yang kita gunakan, tidak terkait dengan penggunaan Apache Commons DBCP. Konfigurasi berikut barulah berkaitan dengan Apache Commons DBCP:

* `maxActive` : jumlah koneksi yang boleh aktif secara berbarengan. Ini harus disetting dibawah angka yang kita ijinkan di database server. Misalnya di MySQL kita ijinkan 100 koneksi berbarengan, maka angkanya harus dibawah 100. Jangan juga dihabiskan 100, untuk berjaga-jaga siapa tahu kita butuh koneksi langsung ke MySQL tanpa lewat aplikasi (misalnya untuk keperluan debug). Pertimbangkan juga apabila ada aplikasi lain yang menggunakan database yang sama.

* `maxIdle` : ada kalanya aplikasi kita sedang sepi dari request user sehingga banyak koneksi database yang menganggur (idle). Angka `maxIdle` ini menentukan berapa koneksi yang akan tetap dipegang walaupun idle. Bila ada 20 koneksi idle, padahal `maxIdle` berisi 15, maka 5 koneksi akan ditutup. Ini merupakan trade-off. Bila terlalu banyak idle, maka memori database server akan terpakai untuk koneksi yang standby ini. Tapi bila terlalu sedikit, pada waktu aplikasi mendadak diserbu user, akan butuh waktu lama untuk dia membuatkan lagi koneksi baru.

* `maxWait` : bila semua koneksi sebanyak `maxActive` sedang terpakai semua, request berikutnya akan menunggu salah satu selesai menggunakan koneksi. Nilai `maxWait` menentukan berapa milidetik request tersebut menunggu. Bila lebih dari `maxWait` dan belum juga kebagian koneksi, maka request tersebut akan mendapatkan `Exception`. Konfigurasi ini perlu diperhatikan karena nilai defaultnya adalah `indefinitely` yaitu menunggu selamanya. 

Saya pernah mendapatkan masalah karena setting default ini. Aplikasi bengong seolah hang. Dicek ke log file tidak ada error. Ternyata masalahnya ada query yang kurang optimal sehingga memakan waktu lama. Pada saat banyak request yang menjalankan query tersebut, request lain menunggu lama tanpa ada pemberitahuan, sehingga terkesan hang. Setelah nilai `maxWait` saya ganti menjadi 30 detik, mulai banyak error message bermunculan dari request yang menunggu > 30 detik. Dengan adanya error message, query bermasalah tersebut menjadi terlihat sehingga bisa diperbaiki.



> Pesan moral pertama : pesan error itu penting untuk mengetahui sumber masalah. Dalam bugfixing, yang paling penting adalah menemukan masalah. Kalau masalah sudah ditemukan, siapa saja bisa memperbaiki. Jadi kalau aplikasi kita bermasalah, prioritas pertama kita adalah membuat dia mengeluarkan pesan error yang jelas.


Baca [artikel ini](http://software.endy.muhardin.com/java/tips-melaporkan-error/) untuk mengetahui apa yang dimaksud dengan pesan error yang jelas.


> Pesan moral kedua : Dalam bugfixing, sering kali kita tidak langsung mendapatkan masalah utama. Pada kasus di atas, pertama kali saya menemukan bahwa perilaku defaultnya Commons DBCP adalah menunggu koneksi dengan sabar sampai selamanya. Setelah ini diubah, barulah saya menemukan masalah utama, yaitu ada query yang tidak optimal.




## Transaction Manager ##

Setelah terhubung ke database, selanjutnya kita akan mengkonfigurasi transaction manager. Ini adalah fitur dari Spring Framework yang membebaskan kita dari coding manual untuk urusan transaction. Bila tidak menggunakan ini, maka kode program kita akan tampak seperti ini:

```java
public void simpan(Produk p){
    Connection conn; // inisialisasi koneksi di sini
    
    try {
        conn.setAutocommit(false);
        
        String sql = "insert into m_produk ... ";
        conn.createStatement().executeUpdate(sql);
        
        conn.commit();
        
    } catch (Exception err){
        conn.rollback();
    } finally {
        conn.setAutocommit(true);
        conn.close();
    }
}
```

Untuk dua baris perintah seperti di atas, kita harus menambahkan 8 baris hanya untuk mengurus transaction **pada setiap method**. Bayangkan kalau aplikasi kita punya 100 method, maka kode program untuk mengelola transaksi saja sudah 800 baris. Dengan fitur transaction manager, maka method di atas bisa ditulis ulang seperti ini:

```java
@Transactional
public void simpan(Produk p){
    String sql = "insert into m_produk ... ";
    conn.createStatement().executeUpdate(sql);
}
```

Jauh lebih bersih dan rapi. Kode program jadi mudah dibaca dan akibatnya tentu memudahkan kita pada waktu bugfix, perubahan, ataupun penambahan fitur.

Nah ini dia konfigurasi transaction manager:

```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource"/>
</bean>

<tx:annotation-driven/>
```

Class transaction manager yang digunakan berbeda tergantung metode akses database yang digunakan dan juga bagaimana cara kita mendeploy aplikasi. Beberapa pilihan transaction manager yang lain antara lain:

* `DataSourceTransactionManager` : digunakan untuk koneksi database menggunakan `javax.sql.DataSource`. Ini artinya koneksi langsung dari aplikasi ke database server.
* `JtaTransactionManager` : digunakan bila aplikasi kita dideploy di application server yang memiliki transaction manager sendiri (seperti Glassfish, JBoss, Websphere, Weblogic, dsb) *dan menggunakan* transaction manager yang disediakan tersebut. Bila kita deploy di Tomcat, hampir pasti kita tidak menggunakan JTA. Bila kita deploy ke Glassfish dan menggunakan konfigurasi `dataSource` Apache Commons DBCP, berarti kita juga tidak menggunakan JTA.
* `HibernateTransactionManager` : seperti ditunjukkan oleh namanya, gunakan ini bila kita menggunakan Hibernate
* `JpaTransactionManager` : ini juga sudah jelas dari namanya. Bila kita pakai JPA, gunakan transaction manager ini.

Demikian tutorial cara konfigurasi koneksi database. Pada bagian selanjutnya, kita akan [menyiapkan kerangka aplikasinya dulu](http://software.endy.muhardin.com/java/struktur-aplikasi-java-dengan-spring-dan-maven/).
