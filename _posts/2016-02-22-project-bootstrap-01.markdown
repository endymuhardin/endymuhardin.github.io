---
layout: post
title: "Setup Project Baru"
date: 2016-02-22 07:00
comments: true
categories: 
- java
---

Bila kita ingin memulai pembuatan suatu aplikasi, tentu ada hal-hal yang harus dipersiapkan dulu agar tim bisa bekerja dengan baik. Berikut adalah checklist hal-hal yang biasa saya siapkan sebelum project dimulai. 

* Membuat Repository Git
* Membuat struktur file dan folder project
* Membuat satu flow utuh dari database sampai ke tampilan
* Membuat contoh automated test lengkap dengan sample datanya
* Setup continuous integration agar aplikasi dites secara otomatis dan berkala
* Setup continuous deployment agar setelah lulus tes otomatis, aplikasi langsung dideploy dan siap dites oleh tester

Karena langkahnya cukup banyak, maka artikel ini kita bagi menjadi beberapa bagian:

* Setup Project
* [Setup Continuous Integration](http://software.endy.muhardin.com/java/project-bootstrap-02/)
* [Setup Deployment ke PaaS](http://software.endy.muhardin.com/java/project-bootstrap-03/)
* [Setup Continuous Deployment](http://software.endy.muhardin.com/java/project-bootstrap-04/)

Kita mulai dengan Setup Project

<!--more-->

Tujuan dari setup project ini adalah struktur awal project kita sudah berfungsi dengan baik dan tersedia di repository Git agar dapat diakses seluruh team member. Ada beberapa langkah yang harus kita lakukan:

## Setup Repository Git ##

Untuk mudahnya, kita akan membuat project open source dan disimpan di Github. Untuk project private, kita bisa bayar Github mulai dari $7/bulan untuk 5 user, atau sewa VPS dan install sendiri [Gitlab](https://about.gitlab.com/downloads/).

Registrasi dan instalasi Git [sudah pernah dibahas pada artikel terdahulu](http://software.endy.muhardin.com/aplikasi/instalasi-git-di-windows/), sehingga sekarang kita langsung lanjut ke pembuatan repository. Login ke Github, kemudian klik New Repository

[![Setup Git Repo](https://lh3.googleusercontent.com/Y0AGdPncs5HEt2zWr2TAwNwfciv3MFCWR6lUAuhEEn3gmKpBrF-4KnJaMUvox_hG1LkfmBoxorbI=w1280-no)](https://lh3.googleusercontent.com/Y0AGdPncs5HEt2zWr2TAwNwfciv3MFCWR6lUAuhEEn3gmKpBrF-4KnJaMUvox_hG1LkfmBoxorbI=w1280-no)

Isikan nama project dan keterangan yang dibutuhkan. Setelah selesai, clone project tersebut ke komputer kita

[![Clone Git Repo](https://lh3.googleusercontent.com/cwGwMq-IQCfKB72UmPZfgkbsYfHdd0j6QxShB1zCbCT_cyNuwSqghp-57UTAxnpZIBnO8vnziOkj=w1280-no)](https://lh3.googleusercontent.com/cwGwMq-IQCfKB72UmPZfgkbsYfHdd0j6QxShB1zCbCT_cyNuwSqghp-57UTAxnpZIBnO8vnziOkj=w1280-no)

Repository git kita siap digunakan.

## Setup Project ##

Kita akan membuat project Java dengan Spring Boot. Spring sudah menyediakan halaman khusus untuk memudahkan setup project. Langsung buka [halaman tersebut](http://start.spring.io).

[![Create Starter Project Spring](https://lh3.googleusercontent.com/nw-1lSZAdHkJHcQmFIvs1LdAfgXFIaCQIzw3hWAocS7UyKXe4c8XQmalL1M72ODCqa1stFXmWZfR=w1280-no)](https://lh3.googleusercontent.com/nw-1lSZAdHkJHcQmFIvs1LdAfgXFIaCQIzw3hWAocS7UyKXe4c8XQmalL1M72ODCqa1stFXmWZfR=w1280-no)

Isikan nama package, nama project, dan modul-modul Spring yang akan kita gunakan. Biasanya yang selalu saya gunakan:

* Web
* Data JPA
* MySQL

Ada juga modul Security, tapi biasanya tidak saya tambahkan pada awal pembuatan.

Begitu kita klik Create Project, browser akan mendownload file `zip` yang berisi file-file project. Extract file tersebut, dan masukkan isinya ke folder hasil clone kita. Setelah itu, commit dan push.

[![Commit n Push](https://lh3.googleusercontent.com/_ePewNHtEsOPC-roG_atpHiOLX4o8Ol9kw8tBiCFGzTjdI8fiHWTuSMNob02PyFD7kw6dnB6OGQ9=w1280-no)](https://lh3.googleusercontent.com/_ePewNHtEsOPC-roG_atpHiOLX4o8Ol9kw8tBiCFGzTjdI8fiHWTuSMNob02PyFD7kw6dnB6OGQ9=w1280-no)

## Setup Database ##

Di project pembuatan aplikasi, biasanya saya men-standarisasi environment development. Nama database, username dan password database, sudah ditentukan dan disamakan di semua komputer programmer. Untuk project ini, kita asumsikan kita akan gunakan:

* nama database : belajar
* username : belajar
* password : java
* jenis database : MySQL

Untuk mempersiapkannya, login ke MySQL dengan user `root`

```
mysql -u root -p
Enter Password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.11 Homebrew

Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 

```

Selanjutnya, kita buat user dan password untuk mengakses database

```
grant all on belajar.* to belajar@localhost identified by 'java';
```

Kemudian, kita buat databasenya

```
create database belajar;
```

Persiapan database selesai. Nilai ini bisa kita masukkan di file `application.properties` yang ada dalam starter project kita, yaitu di folder `src/main/resources/`

```
spring.datasource.url=jdbc:mysql://localhost/belajar
spring.datasource.username=belajar
spring.datasource.password=java
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

Berikutnya, kita siapkan script migrasi database, yaitu script untuk membuat skema database sesuai versi aplikasi kita. Ada dua tools yang tersedia, [Liquibase]() dan [Flyway](). Kita akan gunakan Flyway. Tambahkan dependensinya di `pom.xml`

```xml
<dependency>
  <groupId>org.flywaydb</groupId>
  <artifactId>flyway-core</artifactId>
</dependency>
```

Script migrasi ada di folder `src/main/resources/db/migration`. Format penamaannya adalah `V<No Versi>__<Keterangan File>.sql`. Karena ini masih versi development, filenya saya beri nama `V0.0.1.20160222__Skema Awal.sql`. Isikan saja satu tabel sebagai contoh. Berikut contoh isi file saya

```sql
-- tabel Product --
create table product (
    id varchar(32) primary key,
    code varchar(10) not null unique,
    name varchar(255) not null,
    price decimal(19,2) not null
) Engine=InnoDB;
```

Kemudian coba jalankan proses build untuk mengetes apakah konfigurasi database dan script migrasi sudah terkonfigurasi dengan benar.

```
mvn clean package
```

Bila semuanya terkonfigurasi dengan benar, tabel akan terbentuk di database sesuai script migrasi. Kita bisa periksa langsung ke database menggunakan aplikasi database client. Saya lebih suka yang berbasis command line

```
mysql> show create table product \G
*************************** 1. row ***************************
       Table: product
Create Table: CREATE TABLE `product` (
  `id` varchar(32) NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(19,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
1 row in set (0.01 sec)
```

## Entity Class dan DAO ##

Setelah database terkonfigurasi dengan baik, kita lanjutkan dengan membuat Entity class JPA dan DAO menggunakan Spring Data JPA. Buat class sesuai struktur tabel sebagai berikut

```java
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;
    
    @NotNull @NotEmpty @Size(min = 3, max = 10)
    @Column(nullable = false, unique = true)
    private String code;
    
    @NotNull @NotEmpty @Size(min = 3, max = 255)
    @Column(nullable = false)
    private String name;
    
    @NotNull @Min(0)
    @Column(nullable = false)
    private BigDecimal price;

    //getter setter tidak ditunjukkan
}
```

Kita buatkan `DAO`nya. Menggunakan Spring Data JPA, cukup satu baris saja

```java
public interface ProductDao extends PagingAndSortingRepository<Product, String>{ }
```

## Test Akses Database ##

Untuk mengetes apakah entity kita sudah dimapping dengan benar, kita buatkan JUnit testnya. Kita buat class di folder `src/test/java` dengan package yang sama dengan DAO yang mau ditest

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = BelajarCiApplication.class)
@Transactional
@Sql(scripts = {"/mysql/delete-data.sql", "/mysql/sample-product.sql"})
public class ProductDaoTests {

    @Autowired private ProductDao pd;
    
    @Test
    public void testSave(){
        Product p = new Product();
        p.setCode("T-001");
        p.setName("Test Product 001");
        p.setPrice(new BigDecimal("100000.01"));
        
        Assert.assertNull(p.getId());
        pd.save(p);
        Assert.assertNotNull(p.getId());
    }
    
    @Test
    public void testFindById(){
        Product p = pd.findOne("abc123");
        Assert.assertNotNull(p);
        Assert.assertEquals("P-001", p.getCode());
        Assert.assertEquals("Product 001", p.getName());
        Assert.assertEquals(BigDecimal.valueOf(101000.01), p.getPrice());
        
        Assert.assertNull(pd.findOne("notexist"));
    }
    
}
```

Agar test bisa berjalan dengan baik, kita perlu menyediakan dua script untuk mengisi sampel data dan menghapusnya lagi. Script sampel data ini disimpan di `src/test/resources/mysql`. Berikut isinya

File `delete-data.sql`

```sql
delete from product;
```

File `sample-product.sql`

```sql
insert into product (id, code, name, price) 
values ('abc123', 'P-001', 'Product 001', 101000.01);
```

Mapping entity dan fungsionalitas DAO bisa dites dengan menjalankan perintah `mvn clean package`. Hasilnya harusnya seperti ini

```
Results :

Tests run: 3, Failures: 0, Errors: 0, Skipped: 0

[INFO] 
[INFO] --- maven-jar-plugin:2.5:jar (default-jar) @ belajar-ci ---
[INFO] Building jar: /Users/endymuhardin/workspace/belajar/belajar-ci/target/belajar-ci-0.0.1-SNAPSHOT.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:1.3.2.RELEASE:repackage (default) @ belajar-ci ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 16.539 s
[INFO] Finished at: 2016-02-22T11:03:02+07:00
[INFO] Final Memory: 29M/219M
[INFO] ------------------------------------------------------------------------
```

Coba jalankan beberapa kali untuk memastikan automated testnya repeatable, artinya bisa dijalankan berulang-ulang dengan konsisten.

## REST Controller ##

Berikutnya, kita akan membuat data kita dalam database bisa diakses melalui HTTP. Untuk itu, kita buatkan class controller untuk fungsi `save`, `update`, `findAll`, dan `findById`. Kita akan buat sekaligus dengan automated testnya. Untuk melakukan automated test pada controller, kita gunakan library [Rest Assured](https://github.com/jayway/rest-assured/wiki/Usage)

### Kerangka Class ###

Pertama, mari kita lihat dulu deklarasi class `ProductController`

```java
@RestController
@RequestMapping("/api/product")
@Transactional(readOnly = true)
public class ProductController {
    @Autowired
    private ProductDao productDao;

    // nanti methodnya di sini
}
```

Dan ini deklarasi class untuk mengetesnya

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = BelajarCiApplication.class)
@Sql(scripts = {"/mysql/delete-data.sql", "/mysql/sample-product.sql"})
@WebIntegrationTest(randomPort = true)
public class ProductControllerTests {
    private static final String BASE_URL = "/api/product";
    
    @Value("${local.server.port}")
    int serverPort;

    @Before
    public void setup() {
        RestAssured.port = serverPort;
    }

    // method test nanti diisi di sini
}
```

Berikutnya, kita implementasi fungsi save

### Insert Record Baru ###

Insert record ditangani dengan HTTP method POST. Berikut isi method `create` di dalam class `ProductController`

```java
@RequestMapping(value = "/", method = RequestMethod.POST)
@Transactional(readOnly = false)
public ResponseEntity<Void> create(@RequestBody @Valid Product p, UriComponentsBuilder uriBuilder) {
    productDao.save(p);
    URI location = uriBuilder.path("/api/product/{id}")
            .buildAndExpand(p.getId()).toUri();
    HttpHeaders headers = new HttpHeaders();
    headers.setLocation(location);
    return new ResponseEntity<>(headers, HttpStatus.CREATED);
}
```

dan ini method testnya

```java
@Test
public void testSave() throws Exception {

    Product p = new Product();
    p.setCode("PT-001");
    p.setName("Product Test 001");
    p.setPrice(BigDecimal.valueOf(102000.02));

    given()
      .body(p)
      .contentType(ContentType.JSON)
      .when()
      .post(BASE_URL+"/")
      .then()
      .statusCode(201)
      .header("Location", containsString(BASE_URL+"/"))
      .log().headers();

    // nama tidak diisi
    Product px = new Product();
    px.setCode("PT-001");
    given()
      .body(px)
      .contentType(ContentType.JSON)
      .when()
      .post(BASE_URL+"/")
      .then()
      .statusCode(400);

    // kode kurang dari 3 huruf
    Product px1 = new Product();
    px1.setCode("PT");
    px1.setName("Product Test");
    p.setPrice(BigDecimal.valueOf(100));

    given()
      .body(px1)
      .contentType(ContentType.JSON)
      .when()
      .post(BASE_URL+"/")
      .then()
      .statusCode(400);

    // Harga negatif
    Product px2 = new Product();
    px2.setCode("PT-009");
    px2.setName("Product Test");
    p.setPrice(BigDecimal.valueOf(-100));
    given()
      .body(px1)
      .contentType(ContentType.JSON)
      .when()
      .post(BASE_URL+"/")
      .then()
      .statusCode(400);
}
```

### Tampilkan Semua Record ###

Berikut kode program untuk menampilkannya

```java
@RequestMapping(value = "/", method = RequestMethod.GET)
public Page<Product> findAll(Pageable page) {
    return productDao.findAll(page);
}
```

Dan berikut kode program untuk mengetesnya

```java
@Test
public void testFindAll() {
    get(BASE_URL+"/")
      .then()
      .body("totalElements", equalTo(1))
      .body("content.id", hasItems("abc123"));
}
```

### Cari Record berdasarkan ID ###

Berikut kode program untuk mencari dan menampilkannya

```java
@RequestMapping(value = "/{id}", method = RequestMethod.GET)
public Product findById(@PathVariable("id") Product p) {
    if (p == null) {
      throw new DataNotFoundException("No data with the specified id");
    }

    return p;
}
```

dan berikut kode program untuk mengetesnya

```java
@Test
public void testFindById() {
    get(BASE_URL+"/abc123")
      .then()
      .statusCode(200)
      .body("id", equalTo("abc123"))
      .body("code", equalTo("P-001"));

    get(BASE_URL+"/990")
      .then()
      .statusCode(404);
}
```

### Update Record ###

Berikut kode program untuk mengupdate record yang sudah ada dalam database

```java
  @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
  @ResponseStatus(HttpStatus.OK)
  @Transactional(readOnly = false)
  public void update(@PathVariable("id") String id, @RequestBody @Valid Product p) {
    if (!productDao.exists(id)) {
      throw new DataNotFoundException("No data with the specified id");
    }
    p.setId(id);
    productDao.save(p);
  }
```

dan berikut kode program untuk mengetesnya

```java
  @Test
  public void testUpdate() {
    Product p = new Product();
    p.setCode("PX-009");
    p.setName("Product 909");
    p.setPrice(BigDecimal.valueOf(2000));

    given()
      .body(p)
      .contentType(ContentType.JSON)
      .when()
      .put(BASE_URL+"/abc123")
      .then()
      .statusCode(200);

    get(BASE_URL+"/abc123")
      .then()
      .statusCode(200)
      .body("id", equalTo("abc123"))
      .body("code", equalTo("PX-009"))
      .body("name", equalTo("Product 909"));
  }
```

### Delete Record ###

Berikut kode program untuk menghapus record dengan `id` tertentu

```java
  @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
  @ResponseStatus(HttpStatus.OK)
  @Transactional(readOnly = false)
  public void delete(@PathVariable("id") String id) {
    if (!productDao.exists(id)) {
    throw new DataNotFoundException("No data with the specified id");
    }
    productDao.delete(id);
  }
```

Dan berikut kode program untuk mengetesnya

```java
  @Test
  public void testDelete() {
    delete(BASE_URL+"/abc123")
      .then()
      .statusCode(200);

    get(BASE_URL+"/abc123")
      .then()
      .statusCode(404);
  }
```

### Test ###

Bila sudah selesai semua, kita bisa pastikan semuanya berjalan baik dengan cara menjalankan `mvn clean package`. Seharusnya keluar output berikut

```
Results :

Tests run: 8, Failures: 0, Errors: 0, Skipped: 0

[INFO] 
[INFO] --- maven-jar-plugin:2.5:jar (default-jar) @ belajar-ci ---
[INFO] Building jar: /Users/endymuhardin/workspace/belajar/belajar-ci/target/belajar-ci-0.0.1-SNAPSHOT.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:1.3.2.RELEASE:repackage (default) @ belajar-ci ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 23.373 s
[INFO] Finished at: 2016-02-22T14:24:06+07:00
[INFO] Final Memory: 31M/215M
[INFO] ------------------------------------------------------------------------

```

## Penutup ##

Demikianlah project kita sudah selesai disetup. Selanjutnya semua anggota tim bisa mulai ikut terlibat dengan cara clone repositorynya dan mulai menambahkan kode program sesuai fitur yang akan dibuat. Kode program selengkapnya bisa didapatkan [di Github](https://github.com/endymuhardin/belajar-ci)

Pada [bagian selanjutnya](http://software.endy.muhardin.com/java/project-bootstrap-02/), kita akan mengotomasi proses pengetesan ini dengan menggunakan berbagai tools Continuous Integration. Stay tuned ...
