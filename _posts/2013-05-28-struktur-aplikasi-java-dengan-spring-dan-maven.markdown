---
layout: post
title: "Struktur Aplikasi Java dengan Spring dan Maven"
date: 2013-05-28 15:06
comments: true
categories: 
- java
---

Pada [bagian sebelumnya](http://software.endy.muhardin.com/java/konfigurasi-koneksi-database-dengan-spring/) kita telah membahas konfigurasi awal 
dan studi kasus yang akan digunakan untuk menunjukkan fitur Spring JDBC.

Di artikel bagian kedua ini, kita akan membahas tentang kerangka aplikasi yang akan dibuat. 
Sebelum membuat implementasi detail, sangat penting kita buat dulu kerangkanya supaya jelas 
apa saja bagian-bagian dalam aplikasi dan bagaimana mereka saling terhubung.

Artikel ini merupakan bagian kedua dari rangkaian artikel Spring JDBC, yaitu

1. [Konfigurasi koneksi database](http://software.endy.muhardin.com/java/konfigurasi-koneksi-database-dengan-spring/)
2. [Struktur Aplikasi](http://software.endy.muhardin.com/java/struktur-aplikasi-java-dengan-spring-dan-maven/)
3. [Insert, update, dan delete data](http://software.endy.muhardin.com/java/insert-update-delete-dengan-spring-jdbc/)
4. [Query data](http://software.endy.muhardin.com/java/query-dengan-spring-jdbc/)
5. [Mengetes Akses Database](http://software.endy.muhardin.com/java/mengetes-akses-database/)

<!--more-->

## Daftar class yang akan dibuat ##

Class yang akan dibuat kita bagi menjadi empat fungsi utama, yaitu:

* domain object : class yang mewakili struktur data dalam aplikasi kita
* interface business service : class yang mendefinisikan daftar fitur-fitur dalam aplikasi
* implementasi business service : implementasi dari interface business service. Kalau di interface hanya ada nama method, argumen, dan tipe data kembalian (return value), di sini sudah ada implementasi konkritnya, yaitu bagaimana query database, logika perhitungan, dan sebagainya.
* automated test : memeriksa apakah method kita berjalan benar itu melelahkan. Jadi kita buatkan kode program untuk mengetesnya, sehingga tes yang sama bisa dijalankan berulang-ulang tanpa membuat kita lelah. Lebih lanjut tentang automated test bisa dibaca di [artikel lain yang membahas masalah ini](http://software.endy.muhardin.com/java/ruthless-testing-1/).

### Domain Object ###

Sesuai dengan skema database, kita akan membuat tiga class, yaitu: 

* Produk
* Penjualan
* PenjualanDetail

Buat yang sudah pernah coding JDBC biasanya akan bertanya,


> Kenapa repot-repot membuat domain class, kemudian harus konversi bolak balik?
> Kan bisa saja kita kirim `ResultSet` ke tampilan, ataupun insert langsung dari array ke `PreparedStatement`.


Pertanyaan ini biasanya muncul dari programmer PHP yang terbiasa langsung menampilkan kembalian `mysql_fetch_array` dalam looping tabel.

Ada beberapa alasan:

1. Sebenarnya bisa saja kita buat aplikasi dengan menggunakan tipe data yang disediakan Java seperti Integer, String, Map, List, dan lainnya. Tapi akibatnya kode program kita menjadi sulit dimengerti. Coba bandingkan, lebih mudah dimengerti `public void simpan(Produk p)` atau `public void simpan(Map p)`? Dengan membuat tipe data sesuai istilah yang digunakan di domain kita, maka kode program akan lebih mudah dipahami.

2. Java merupakan bahasa yang [strongly-typed](http://en.wikipedia.org/wiki/Strong_and_weak_typing), dia memeriksa tipe data/class dari tiap variabel. Pada ilustrasi di atas, method `public void simpan(Map p)` akan menerima apapun data yang kita masukkan ke dalam variabel `p`. Kalau ada kesalahan dalam nama variabel (misalnya nama ditulis name), baru akan terdeteksi pada waktu aplikasi dijalankan. Berbeda dengan `public void simpan(Produk p)` yang akan langsung menimbulkan pesan error apabila kita isi dengan tipe data selain `Produk`. Bug yang ditemukan pada waktu coding (compile-time) akan jauh lebih cepat diperbaiki daripada bug yang baru ditemukan pada waktu aplikasi dijalankan (runtime). Programmer PHP ada benarnya juga. Di bahasa PHP memang domain class ini tidak diperlukan, karena PHP tidak ada pemeriksaan compile-time. Tapi karena kita menggunakan Java, ada baiknya kita manfaatkan pemeriksaan compile-time ini.

3. Memisahkan antara layer database dan layer antarmuka. Apabila ada perubahan skema database, asalkan fitur di tampilan tidak berubah, kita cukup mengubah mapping domain object dan skema database. Tidak perlu mengubah kode program di layer antarmuka.

4. Pustaka siap pakai untuk validasi. Di Java, ada yang namanya [JSR-303](http://jcp.org/en/jsr/detail?id=303), yaitu suatu pustaka yang berguna untuk validasi. Dengan [menggunakan JSR-303](http://www.mkyong.com/spring-mvc/spring-3-mvc-and-jsr303-valid-example/) ini kita tidak perlu lagi melakukan pengecekan `if(produk.getKode() == null)`. Cukup kita gunakan deklarasi `@NotNull private String kode;` dalam class `Produk`

### Interface Business Service ###

Interface di Java artinya class yang methodnya abstrak semua. Lebih detail tentang method abstrak bisa dibaca di [artikel ini](http://software.endy.muhardin.com/java/interface-abstract/). Ada beberapa alasan kenapa kita harus memisahkan interface dan implementasinya, antara lain:

* pada waktu [membuat aplikasi client-server](http://software.endy.muhardin.com/java/remoting-dengan-spring/), kita cukup memberikan domain object dan interface ini kepada programmer aplikasi client. Sedangkan implementasinya (yang berisi kode program akses database) tetap di server. Ini akan meringankan ukuran aplikasi client, karena tidak perlu menyertakan implementasi (beserta library pendukungnya yang biasanya besar) yang tidak dia gunakan.

* kita bebas mengubah strategi implementasi (misalnya ganti database dari MySQL menjadi PostgreSQL) tanpa perlu mengganggu aplikasi client

* fitur declarative transaction yang dimiliki Spring akan lebih optimal bekerja bila kita memisahkan interface dan implementasi.

Interface ini cukup satu class saja, yaitu `AplikasiPenjualanService`.

### Implementasi Business Service ###

Ini merupakan implementasi dari interface `AplikasiPenjualanService`. Pada prakteknya, ada dua variasi yang biasa saya gunakan dalam membuat implementasi, yaitu:

* cukup membuat class implementasi service saja
* membuat class implementasi service dan juga class data access object (DAO)

Kapan memilih variasi yang mana? 

* Bila menggunakan framework Spring Data JPA, kita harus pakai DAO karena frameworknya minta seperti itu
* Selain Spring Data JPA, bebas mau pakai yang mana. Pilih saja yang lebih rapi dan mudah maintenance. Untuk aplikasi kecil, class implementasi service saja sudah cukup. Kalau aplikasinya besar, akan lebih mudah membaca 10 class DAO yang masing-masingnya terdiri dari 100 baris kode daripada 1000 baris dalam satu class implementasi service. Walaupun demikian, tidak ada pertimbangan teknis yang signifikan (seperti isu performance dan lainnya) antara pakai DAO atau tidak.

### Automated Test ###

Ini adalah kode program yang fungsinya mengetes kode program lainnya, dalam hal ini class implementasi dan class DAO. Konsep dasar tentang automated testing dibahas di [artikel ini](http://software.endy.muhardin.com/java/ruthless-testing-1/). Sedangkan untuk pengetesan database dibahas [di sini](http://software.endy.muhardin.com/java/ruthless-testing-4/).

Pada contoh aplikasi ini, kita menghadapi tantangan khusus, yaitu bagaimana caranya menggunakan test case yang sama untuk konfigurasi berbeda. Nantinya aplikasi ini akan dikembangkan untuk mendemonstrasikan akses database menggunakan framework lain seperti Hibernate, Spring Data JPA, dan JDBC polos tanpa framework. Logika pengetesan akan sama persis, yaitu:

* test insert
* test update
* test delete
* test cari berdasarkan id
* test ambil semua data dari tabel tertentu
* test cari data dengan kriteria tertentu

Tabel database yang diakses sama, sample data sama, bahkan nama method yang dijalankan juga sama. Bedanya hanyalah class implementasi mana yang digunakan dan konfigurasi mana yang dipakai. 

Untuk itu, kita akan menggunakan teknik khusus yang disebut `abstract junit test case`. Secara garis besar, langkahnya seperti ini:

1. Buat semua method test di superclass. Superclass ini memiliki abstract method, sehingga dengan sendirinya dia juga abstract.
2. Untuk mendapatkan class implementasi dan melakukan inisialisasi konfigurasi, gunakan abstract method
3. Buat subclass untuk masing-masing implementasi (Spring JDBC, Hibernate, dst) yang hanya berisi implementasi dari abstract method tersebut. 

Agar lebih jelas, silahkan lihat [superclassnya](https://github.com/endymuhardin/belajar-akses-database-java/blob/spring-jdbc/src/test/java/com/muhardin/endy/training/java/aksesdb/service/ProdukServiceTest.java) dan [subclass untuk Spring JDBC](https://github.com/endymuhardin/belajar-akses-database-java/blob/spring-jdbc/src/test/java/com/muhardin/endy/training/java/aksesdb/service/springjdbc/ProdukServiceSpringJdbcTest.java). 

## Struktur folder ##

Sekian banyak class, bagaimana penempatannya? Silahkan lihat struktur folder berikut:

![Top Level Folder ](/images/uploads/2013/05/struktur-aplikasi-spring-maven/01-struktur-folder-top-level.png)

Tidak ada yang istimewa dari struktur di atas, cuma struktur folder standar Maven. Mari kita lihat source code aplikasi.

![Source Folder Java ](/images/uploads/2013/05/struktur-aplikasi-spring-maven/02-struktur-folder-main-java.png)

Di sini kita bisa lihat class sudah diatur ke dalam package berbeda sesuai fungsinya, yaitu domain, service, dao. Untuk implementasi service dengan Spring JDBC kita buatkan package tersendiri. Selanjutnya kita lihat lokasi file konfigurasi.

![Source Folder Konfigurasi ](/images/uploads/2013/05/struktur-aplikasi-spring-maven/03-struktur-folder-main-resources.png)

File konfigurasi ditaruh dalam package. Sebetulnya ditaruh di top level juga boleh, ini hanya sekedar kebiasaan saja. 

![Source Test Folder ](/images/uploads/2013/05/struktur-aplikasi-spring-maven/04-struktur-folder-test.png)

Lokasi penempatan test class bisa dilihat di atas. Abstract class yang saya ceritakan di atas terlihat di package `com.muhardin.endy.training.java.aksesdb.service`, sedangkan implementasi konfigurasinya ada di subpackage `springjdbc` di bawahnya.

Setelah kita melihat penempatan file dan folder, mari kita lihat kerangka kode program di masing-masing class/file. Supaya bisa mendapatkan _big-picture_, kita akan lihat kerangka class dan method saja. Implementasinya menyusul pada bagian selanjutnya.

# Domain Object #

## Class Produk ##

Class ini merupakan padanan tabel m_produk di database. 
Dia memiliki beberapa property sesuai dengan kolom di database. 
Berikut penjelasannya

Nama Property | Nama Kolom Database | Tipe Data Java | Tipe Data MySQL
--------------|---------------------|----------------|----------------
id            | id                  | Integer        | integer
kode          | kode                | String         | varchar
nama          | nama                | String         | varchar
harga         | harga               | BigDecimal     | decimal(19,2)


Berikut kode program untuk class Produk.

```java
package com.muhardin.endy.training.java.aksesdb.domain;

import java.math.BigDecimal;

public class Produk {
    private Integer id;
    private String kode;
    private String nama;
    private BigDecimal harga;
    
    // getter dan setter generate dari IDE
}
```

## Class Penjualan ##

Mapping Java ke SQL

Nama Property  | Nama Kolom Database | Tipe Data Java | Tipe Data MySQL
---------------|---------------------|----------------|----------------
id             | id                  | Integer        | integer
waktuTransaksi | waktu_transaksi     | Date           | datetime

Kode program class Penjualan

```java
package com.muhardin.endy.training.java.aksesdb.domain;

// import generate dari IDE

public class Penjualan {
    private Integer id;
    private Date waktuTransaksi;
    private List<PenjualanDetail> daftarPenjualanDetail 
        = new ArrayList<PenjualanDetail>();
    
    // getter dan setter generate dari IDE
}
```

## Class Penjualan Detail ##

Mapping Java ke SQL

Nama Property  | Nama Kolom Database | Tipe Data Java | Tipe Data MySQL
---------------|---------------------|----------------|----------------
id             | id                  | Integer        | integer
penjualan      | id_penjualan        | Penjualan      | integer foreign key
produk         | id_produk           | Produk         | integer foreign key
jumlah         | jumlah              | Integer        | integer
harga          | harga               | BigDecimal     | decimal(19,2)

Kode program class PenjualanDetail

```java
package com.muhardin.endy.training.java.aksesdb.domain;

import java.math.BigDecimal;

public class PenjualanDetail {
    private Integer id;
    private Penjualan penjualan;
    private Produk produk;
    private BigDecimal harga;
    private Integer jumlah;
    
    // getter dan setter generate dari IDE
}
```

Yang perlu diperhatikan di sini adalah perbedaan cara perlakuan relasi antara Java dan database. 
Di Java, kita perlu mendefinisikan relasi di dua tempat, yaitu variabel `daftarPenjualanDetail` di class `Penjualan`
dan variabel `penjualan` di class `PenjualanDetail`. Sedangkan di database, relasi ini cukup didefinisikan melalui foreign key
`id_penjualan` di tabel `t_penjualan_detail`.

Perbedaan lain, di database relasi ini cukup diwakili satu nilai saja, yaitu nilai foreign key. 
Sedangkan di Java diwakili satu class penuh (`Produk` atau `Penjualan`) yang di dalamnya memuat banyak nilai.

Untuk menjembatani perbedaan ini, kita perlu membuat mapper untuk mengubah data dari database menjadi object Java dan sebaliknya. Contoh kode program untuk mapper ini akan dibahas pada bagian selanjutnya.

# Interface Business Service #

Ini adalah daftar fitur yang ada di aplikasi, didefinisikan berupa class/interface dan method.

```java
package com.muhardin.endy.training.java.aksesdb.service;

// import generate dari IDE

public interface PenjualanService {
    // service berkaitan dengan produk
    void simpan(Produk p);
    Produk cariProdukById(Integer id);
    Produk cariProdukByKode(String kode);
    Long hitungSemuaProduk();
    List<Produk> cariSemuaProduk(Integer halaman, Integer baris);
    Long hitungProdukByNama(String nama);
    List<Produk> cariProdukByNama(String nama, Integer halaman, Integer baris);
    
    // service yang berkaitan dengan transaksi
    void simpan(Penjualan p);
    Penjualan cariPenjualanById(Integer id);
    Long hitungPenjualanByPeriode(Date mulai, Date sampai);
    List<Penjualan> cariPenjualanByPeriode(Date mulai, Date sampai, Integer halaman, Integer baris);
    Long hitungPenjualanDetailByProdukDanPeriode(Produk p, Date mulai, Date sampai);
    List<PenjualanDetail> cariPenjualanDetailByProdukDanPeriode(Produk p, Date mulai, Date sampai, Integer halaman, Integer baris);
}
```

# Implementasi Business Service #

Implementasi dari interface di atas kita bagi menjadi dua kategori, yaitu class implementasi service yang nantinya akan memanggil class DAO. Pertimbangan dan alasan mengapa begini sudah dijelaskan di atas.

## Class ServiceSpringJdbc ##

Class ini sebetulnya hanya memanggil class DAO saja, jadi baiklah kita tampilkan seluruh isinya di sini.

```java
package com.muhardin.endy.training.java.aksesdb.service.springjdbc;

// import statement generate dari IDE

@Service @Transactional
public class PenjualanServiceSpringJdbc implements PenjualanService{
    @Autowired private ProdukDao produkDao;
    @Autowired private PenjualanDao penjualanDao;
    @Autowired private PenjualanDetailDao penjualanDetailDao;

    @Override
    public void simpan(Produk p) {
        produkDao.simpan(p);
    }

    @Override
    public Produk cariProdukById(Integer id) {
        return produkDao.cariById(id);
    }

    @Override
    public Produk cariProdukByKode(String kode) {
        return produkDao.cariByKode(kode);
    }

    @Override
    public Long hitungSemuaProduk() {
        return produkDao.hitungSemua();
    }

    @Override
    public List<Produk> cariSemuaProduk(Integer halaman, Integer baris) {
        return produkDao.cariSemua(halaman, baris);
    }

    @Override
    public Long hitungProdukByNama(String nama) {
        return produkDao.hitungByNama(nama);
    }

    @Override
    public List<Produk> cariProdukByNama(String nama, Integer halaman, Integer baris) {
        return produkDao.cariByNama(nama, halaman, baris);
    }

    @Override
    public void simpan(Penjualan p) {
        penjualanDao.simpan(p);
    }

    @Override
    public Penjualan cariPenjualanById(Integer id) {
        return penjualanDao.cariById(id);
    }

    @Override
    public Long hitungPenjualanByPeriode(Date mulai, Date sampai) {
        return penjualanDao.hitungByPeriode(mulai, sampai);
    }

    @Override
    public List<Penjualan> cariPenjualanByPeriode(Date mulai, Date sampai, 
            Integer halaman, Integer baris) {
        return penjualanDao.cariByPeriode(mulai, sampai, halaman, baris);
    }

    @Override
    public Long hitungPenjualanDetailByProdukDanPeriode(Produk p, 
            Date mulai, Date sampai) {
        return penjualanDetailDao.hitungByProdukDanPeriode(p, mulai, sampai);
    }

    @Override
    public List<PenjualanDetail> cariPenjualanDetailByProdukDanPeriode(Produk p, 
            Date mulai, Date sampai, Integer halaman, Integer baris) {
        return penjualanDetailDao.cariByProdukDanPeriode(p, mulai, sampai, halaman, baris);
    }
}
```

## Class DAO ##

Class DAO akan kita bahas secara mendetail di bagian selanjutnya. Pada kesempatan ini kita hanya tampilkan deklarasi class dan method saja supaya jelas mana method yang dipanggil dari implementasi service di atas.

### ProdukDAO ###

```java
package com.muhardin.endy.training.java.aksesdb.dao.springjdbc;

// import generate dari IDE

@Repository
public class ProdukDao {

    public void simpan(Produk p) {}

    public Produk cariById(Integer id) {}

    public Produk cariByKode(String kode) {}

    public Long hitungSemua() {}

    public List<Produk> cariSemua(Integer halaman, Integer baris) {}

    public Long hitungByNama(String nama) {}

    public List<Produk> cariByNama(String nama, Integer halaman, Integer baris) {}

    private class ResultSetJadiProduk implements RowMapper<Produk> {
        @Override
        public Produk mapRow(ResultSet rs, int i) throws SQLException {}
    }
}
```

### PenjualanDao ###

```java
package com.muhardin.endy.training.java.aksesdb.dao.springjdbc;

// import generate dari IDE

@Repository
public class PenjualanDao {

    public void simpan(Penjualan p) {}

    public Penjualan cariById(Integer id) {}

    public Long hitungByPeriode(Date mulai, Date sampai) {}

    public List<Penjualan> cariByPeriode(Date mulai, Date sampai, Integer halaman, Integer baris) {}


    private class ResultSetJadiPenjualan implements RowMapper<Penjualan> {
        @Override
        public Penjualan mapRow(ResultSet rs, int i) throws SQLException {}
    }
}
```

### PenjualanDetailDao ###


```java
package com.muhardin.endy.training.java.aksesdb.dao.springjdbc;

// import generate dari IDE

@Repository
public class PenjualanDetailDao {

    public void simpan(final PenjualanDetail p) {}
    
    public List<PenjualanDetail> cariByPenjualan(Penjualan p) {}

    public Long hitungByProdukDanPeriode(Produk p, Date mulai, Date sampai) {}

    public List<PenjualanDetail> cariByProdukDanPeriode(Produk p, Date mulai, Date sampai, Integer halaman, Integer baris) {}


    private class ResultSetJadiPenjualanDetail implements RowMapper<PenjualanDetail> {
        @Override
        public PenjualanDetail mapRow(ResultSet rs, int i) throws SQLException {}
    }
}
```
# Automated Test #

Seperti dijelaskan di atas, automated test kita bagi menjadi dua kategori, yaitu abstract class yang menampung semua logika pengetesan, dan concrete class yang menyediakan konfigurasi.

## Abstract Base Class ##

### ProdukServiceTest ###

```java
package com.muhardin.endy.training.java.aksesdb.service;

// import generate dari IDE

public abstract class ProdukServiceTest {
    
    public abstract PenjualanService getPenjualanService();
    public abstract DataSource getDataSource();
    
    @Before
    public void bersihkanDataTest() throws Exception {}
    
    @Test
    public void testSimpanProduk() {}

    @Test
    public void testCariProdukById() {}

    @Test
    public void testCariProdukByKode() {}

    @Test
    public void testHitungSemuaProduk() {}

    @Test
    public void testCariSemuaProduk() {}

    @Test
    public void testHitungProdukByNama() {}

    @Test
    public void testCariProdukByNama() {}
}
```

### PenjualanServiceTest ###

```java
package com.muhardin.endy.training.java.aksesdb.service;

// import generate dari IDE

public abstract class PenjualanServiceTest {
    
    public abstract PenjualanService getPenjualanService();
    public abstract DataSource getDataSource();
    
    @Before
    public void bersihkanDataTest() throws Exception {}
    
    @Test
    public void testSimpanPenjualan() throws Exception {}
    
    @Test
    public void testCariPenjualanById(){}
    
    @Test
    public void testHitungPenjualanByPeriode(){}
    
    @Test
    public void testCariPenjualanByPeriode(){}
    
    @Test
    public void testHitungPenjualanDetailByProdukDanPeriode(){}
    
    @Test
    public void testCariPenjualanDetailByProdukDanPeriode(){}
}
```

Seperti kita lihat di atas, kedua class tersebut memiliki dua abstract method, yaitu:

* `public abstract PenjualanService getPenjualanService()`
* `public abstract DataSource getDataSource();`

Kedua object `PenjualanService` dan `DataSource` didapatkan dari konfigurasi Spring. 
Konfigurasi Spring dibuat berdasarkan teknologi yang digunakan. 
Konfigurasi Spring JDBC berbeda dengan konfigurasi Hibernate ataupun Spring Data JPA.

Dengan teknik ini, bila di kemudian hari kita membuat implementasi dengan Hibernate atau Spring Data JPA, 
kita tidak perlu lagi copy-paste test class, cukup buat subclass yang menyediakan kedua object tersebut.

Berikut adalah subclassnya

## Implementasi Test Business Service ##

Karena hanya beberapa baris dan tidak butuh banyak penjelasan, kita tampilkan di sini full source code, bukan hanya kerangkanya saja.

### ProdukServiceSpringJdbcTest ###

```java
package com.muhardin.endy.training.java.aksesdb.service.springjdbc;

// import generate dari IDE

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath*:com/muhardin/**/spring-jdbc-ctx.xml")
public class ProdukServiceSpringJdbcTest extends ProdukServiceTest {

    @Autowired private DataSource dataSource;
    @Autowired private PenjualanService penjualanService;
    
    @Override
    public PenjualanService getPenjualanService() {
        return penjualanService;
    }

    @Override
    public DataSource getDataSource() {
        return dataSource;
    }

}
```


### PenjualanServiceSpringJdbcTest ###

```java
package com.muhardin.endy.training.java.aksesdb.service.springjdbc;

// import generate dari IDE

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath*:com/muhardin/**/spring-jdbc-ctx.xml")
public class PenjualanServiceSpringJdbcTest extends PenjualanServiceTest {

    @Autowired private DataSource dataSource;
    @Autowired private PenjualanService penjualanService;
    
    @Override
    public PenjualanService getPenjualanService() {
        return penjualanService;
    }

    @Override
    public DataSource getDataSource() {
        return dataSource;
    }

}
```

Seperti kita lihat di atas, `dataSource` dan `penjualanService` disediakan melalui Dependency Injection. 

Cara kerjanya sebagai berikut:

1. Kita jalankan JUnit melalui IDE atau Maven. IDE atau Maven akan membaca semua file dalam folder `src/test/java` dan memproses semua class yang namanya berakhiran `Test` seperti `PenjualanServiceSpringJdbcTest`. IDE/Maven juga memproses `PenjualanServiceTest`, tapi karena classnya abstract maka tidak diproses lebih lanjut.
2. JUnit melihat annotation `@RunWith`, jadi dia tidak menjalankan sendiri melainkan menyuruh `SpringJUnit4ClassRunner` untuk menjalankan test
3. `SpringJUnit4ClassRunner` membaca annotation `@ContextConfiguration`, lalu menggunakan nilai di dalamnya untuk melakukan inisialisasi `ApplicationContext`, kemudian mengisi variabel yang ditandai dengan `@Autowired`
4. Karena `PenjualanServiceSpringJdbcTest` merupakan subclass dari `PenjualanServiceTest`, maka dia akan mewarisi semua method `@Test` yang dimiliki `PenjualanServiceTest`. Method `@Test` ini akan dijalankan oleh IDE/Maven.
5. Pada waktu method `@Test` dijalankan, bila perlu object `PenjualanService`, maka akan didapat dengan cara memanggil method `getPenjualanService`. Karena methodnya sudah dibuatkan implementasinya (tidak abstract lagi) dan sudah ada isinya, maka method `@Test` dapat bekerja dengan baik.

Demikianlah bagian kedua dari tutorial mengakses database menggunakan Spring JDBC. Pada bagian ini kita sudah melihat bagaimana cara pengaturan file/folder dan interaksi antar class/method. Di bagian selanjutnya kita akan lihat [bagaimana cara menjalankan perintah SQL](http://software.endy.muhardin.com/java/insert-update-delete-dengan-spring-jdbc/).
