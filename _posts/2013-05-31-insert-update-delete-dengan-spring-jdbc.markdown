---
layout: post
title: "Insert Update Delete dengan Spring JDBC"
date: 2013-05-31 13:26
comments: true
categories: 
- java
---

Setelah pada artikel sebelumnya kita membuat konfigurasi database dan membuat kerangka aplikasi, kali ini kita akan membuat implementasi akses database menggunakan Spring JDBC.

Artikel ini merupakan bagian ketiga dari rangkaian artikel Spring JDBC, yaitu

1. [Konfigurasi koneksi database](http://software.endy.muhardin.com/java/konfigurasi-koneksi-database-dengan-spring/)
2. [Struktur Aplikasi](http://software.endy.muhardin.com/java/struktur-aplikasi-java-dengan-spring-dan-maven/)
3. [Insert, update, dan delete data](http://software.endy.muhardin.com/java/insert-update-delete-dengan-spring-jdbc/)
4. [Query data](http://software.endy.muhardin.com/java/query-dengan-spring-jdbc/)
5. [Mengetes Akses Database](http://software.endy.muhardin.com/java/mengetes-akses-database/)

<!--more-->

# Setup DAO #

Supaya bisa diinisialisasi oleh Spring Framework, kita harus menambahkan annotation `@Repository` di class `ProdukDao` dan juga class DAO lainnya. Pembahasan lebih detail tentang cara kerja Spring Framework dan fungsinya annotation `@Repository` dapat dibaca [di artikel ini](http://software.endy.muhardin.com/java/memahami-dependency-injection/).

Selanjutnya, kita akan menambahkan beberapa variabel yang nantinya akan kita butuhkan, yaitu `JdbcTemplate` dan perintah SQL yang ingin dijalankan.

## JDBC Template ##

`JdbcTemplate` adalah class utama dalam Spring JDBC. Semua operasi database dilakukan melalui JdbcTemplate. Kita juga butuh rekannya yang bernama `NamedParameterJdbcTemplate`. Kelebihan dari `NamedParameterJdbcTemplate` ini, dia bisa menerima SQL dengan variabel yang diberi nama. Tanpa dia, kita cuma bisa menjalankan SQL yang variabelnya ditandai dengan `?`, sehingga membingungkan dan rawan terjadi kesalahan kalau jumlah variabelnya banyak.

Kedua object ini kita deklarasikan menjadi object/instance variable, supaya bisa digunakan oleh semua method. Inisialisasinya membutuhkan object `DataSource`, sehingga sebaiknya kita lakukan inisialisasi di dalam setter injection. Bagi yang belum paham apa itu setter injection silahkan baca dulu [artikel ini](http://software.endy.muhardin.com/java/memahami-dependency-injection/).

Berikut adalah kode programnya.

```java
@Repository
public class ProdukDao {

    private JdbcTemplate jdbcTemplate;
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }
}
```

## SQL ##

Agar lebih rapi, semua perintah SQL yang kita akan gunakan di dalam method sebaiknya kita deklarasikan sebagai konstanta. Berikut adalah berbagai SQL yang kita gunakan.

```java
@Repository
public class ProdukDao {
    private static final String SQL_INSERT = "insert into m_produk (kode,nama,harga) values (:kode,:nama,:harga)";
    private static final String SQL_CARI_BY_ID = "select * from m_produk where id = ?";
    private static final String SQL_CARI_BY_KODE = "select * from m_produk where kode = ?";
    private static final String SQL_HITUNG_SEMUA = "select count(*) from m_produk";
    private static final String SQL_CARI_SEMUA = "select * from m_produk limit ?,?";
    private static final String SQL_HITUNG_BY_NAMA = "select count(*) from m_produk where lower(nama) like ?";
    private static final String SQL_CARI_BY_NAMA = "select * from m_produk where lower(nama) like ? limit ?,?";
}
```

Harap diperhatikan bahwa saya hanya menampilkan potongan kode program yang berkaitan dengan penjelasan saat ini saja, berikut sedikit tambahan supaya jelas di mana penempatannya. Untuk isi kode program yang lengkap silahkan lihat [di Github](https://github.com/endymuhardin/belajar-akses-database-java/tree/spring-jdbc/src/main/java/com/muhardin/endy/training/java/aksesdb/dao/springjdbc).

# Insert Data #

Setelah kita punya `JdbcTemplate` dan perintah SQL, kita bisa gunakan untuk menyimpan data ke database.
Mari kita implement method `simpan`.

## Menggunakan parameter domain object ##

Class `Produk` memiliki properti yang bernama `kode`, `nama`, dan `harga`. Karena kita mengikuti aturan penamaan yang baku, maka kita buatkan method getter dan setter. Class yang dibuat mengikuti standar ini bisa langsung diproses oleh Spring JDBC. Dia akan secara otomatis memasangkan properti yang namanya sama dengan yang ada di perintah SQL. Jadi perintah SQL seperti ini 

```sql
insert into m_produk (kode,nama,harga) values (:kode,:nama,:harga)
```

Akan diisikan dengan nilai yang didapat dari pemanggilan method berikut:

```java
Produk p; // nantinya p diisi dari method parameter

p.getKode();
p.getNama();
p.getHarga();
```

Spring JDBC juga akan secara otomatis mendeteksi tipe data baik itu `Integer`, `String`, `BigDecimal`, dan sebagainya.

Berikut adalah implementasi method `simpan` yang menggunakan konsep di atas.

```java
public void simpan(Produk p) {
    SqlParameterSource namedParameters = new BeanPropertySqlParameterSource(p);
    KeyHolder keyHolder = new GeneratedKeyHolder();
    namedParameterJdbcTemplate.update(SQL_INSERT, namedParameters, keyHolder);
    p.setId(keyHolder.getKey().intValue());
}
```

`BeanPropertySqlParameterSource` adalah class dari Spring JDBC yang berfungsi mengambil parameter dari Java object seperti telah dijelaskan di atas. Selain mengambil dari object dengan getter dan setter, ada lagi class lain yang bernama `MapSqlParameterSource`, digunakan untuk mengambil parameter dari object bertipe `java.util.Map`.

## Mendapatkan nilai yang auto generated ##

Di tabel `m_produk`, primary key ada di kolom `id`. Nilainya digenerate otomatis oleh database pada saat kita melakukan insert. Kita perlu mengetahui nilai berapa yang dibuatkan database untuk data yang barusan kita insert agar bisa dipasang di object `Produk` yang kita insert. Untuk menampung nilai yang otomatis dibuatkan database, kita menggunakan class `GeneratedKeyHolder`. 

Setelah kita melakukan insert, `keyHolder` akan menampung nilai. Nilai inilah yang kita pasang di object produk dengan kode program berikut.

```java
namedParameterJdbcTemplate.update(SQL_INSERT, namedParameters, keyHolder);
p.setId(keyHolder.getKey().intValue());
```

## Menggunakan SimpleJdbcInsert ##

Object `produk` di atas hanya memiliki 4 property di Java dan 4 kolom di database. Bila propertynya banyak, tentu kita akan kerepotan menulis variabel dalam perintah SQL. Untuk membantu kita, Spring JDBC menyediakan fitur `SimpleJdbcInsert`. Cara kerjanya, dia akan _menanyakan_ ke database kolom apa saja yang ada di tabel tertentu berikut tipe data untuk masing-masing kolom. Setelah itu, informasi tersebut digunakan untuk membuatkan SQL insert buat kita, sehingga kita tidak perlu membuat sendiri.

Berikut adalah cara inisialisasi `SimpleJdbcInsert`, dilakukan di setter injection.

```java
@Repository
public class ProdukDao {

    private SimpleJdbcInsert insertProduk;

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.insertProduk = new SimpleJdbcInsert(dataSource)
                .withTableName("m_produk")
                .usingGeneratedKeyColumns("id");
    }
}
```

Kita menyebutkan juga kolom mana yang nilainya digenerate database, sehingga dia bisa mengambilkannya. Selanjutnya, mari kita ganti implementasi method `simpan` dengan memanfaatkan `SimpleJdbcInsert`.

```java
public void simpan(Produk p) {
    SqlParameterSource produkParameter = new BeanPropertySqlParameterSource(p);
    Number idBaru = insertProduk.executeAndReturnKey(produkParameter);
    p.setId(idBaru.intValue());
}
```

## Insert Data Header dan Detail ##


> Kenapa kita perlu mengambil primary key yang digenerate database?


Jawabannya karena kita membutuhkannya dalam skenario header dan detail. Di tabel detail, ada relasi foreign key ke tabel header. Sehingga untuk mengisi foreign key tersebut, kita harus mengetahui dulu primary key header.

Selain masalah foreign key ini, sisanya sama dengan pembahasan insert sebelumnya. Berikut implementasi method `simpan(Penjualan p)`

```java
public void simpan(Penjualan p) {
    SqlParameterSource namedParameters = new BeanPropertySqlParameterSource(p);
    KeyHolder keyHolder = new GeneratedKeyHolder();
    namedParameterJdbcTemplate.update(SQL_INSERT, namedParameters, keyHolder);
    p.setId(keyHolder.getKey().intValue());
    
    for (PenjualanDetail detail : p.getDaftarPenjualanDetail()) {
        detail.setPenjualan(p);
        penjualanDetailDao.simpan(detail);
    }
}
```

Seperti kita lihat pada kode program di atas, kita insert ke tabel `t_penjualan`, kemudian kita ambil nilai `id`. Nilai tersebut kita isikan ke tiap object detail untuk selanjutnya kita insert juga menggunakan method `simpan(PenjualanDetail pd)` di class `PenjualanDetailDao`. Berikut implementasinya.

```java
public void simpan(final PenjualanDetail p) {
    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(new PreparedStatementCreator() {

        @Override
        public PreparedStatement createPreparedStatement(Connection conn) throws SQLException {
            PreparedStatement ps = conn.prepareStatement(SQL_INSERT, new String[]{"id"});
            ps.setInt(1, p.getPenjualan().getId());
            ps.setInt(2, p.getProduk().getId());
            ps.setBigDecimal(3, p.getHarga());
            ps.setInt(4, p.getJumlah());
            return ps;
        }
    }, keyHolder);
    p.setId(keyHolder.getKey().intValue());
}
```

Pada waktu menyimpan `PenjualanDetail`, kita menggunakan teknik yang agak berbeda, tidak menggunakan `SimpleJdbcInsert` maupun `NamedParameterJdbcTemplate`. Ini disebabkan karena banyak kolom yang namanya tidak mengikuti aturan penamaan, yaitu `id_penjualan` dan `id_produk`. Karena itu kita menggunakan cara yang lebih manual, membuat sendiri `PreparedStatement` dan kemudian mengisi parameternya. 

Walaupun demikian, kita tidak mengeksekusi `PreparedStatement` tersebut, karena urusan mengeksekusi akan ditangani Spring JDBC supaya bisa dibungkus dalam transaction. Kenapa harus dibungkus dalam transaction? Jawabannya bisa dibaca di [artikel ini](http://software.endy.muhardin.com/java/database-transaction/).

# Update Data #

Pada prinsipnya, update data tidak berbeda dengan insert data. Kita dapat melakukannya dengan cara yang sama seperti insert data di atas. Tapi karena kita ingin melihat fitur-fitur Spring JDBC, baiklah kita lakukan dengan cara yang sedikit berbeda.

## Menggunakan parameter bertipe Map ##

Kalau di atas kita sudah menggunakan parameter menggunakan `?` dan domain object, kali ini kita akan menggunakan `Map`. Cara ini digunakan bila nama variabel di SQL berbeda dengan nama variabel di domain object, sehingga kita tidak bisa menggunakan `BeanPropertySqlParameterSource`. Kita juga tidak mau menggunakan `?` karena rawan terjadi salah ketik.

Kita ubah sedikit method `simpan(Produk p )` agar bisa menangani penyimpanan data produk baru (insert) maupun penyimpanan data produk lama (update). Berikut kode program method `simpan(Produk p )` yang baru.

```java
public void simpan(Produk p) {
    if (p.getId() == null) {
        SqlParameterSource produkParameter = new BeanPropertySqlParameterSource(p);
        Number idBaru = insertProduk.executeAndReturnKey(produkParameter);
        p.setId(idBaru.intValue());
    } else {
        SqlParameterSource produkParameter = new MapSqlParameterSource()
                .addValue("id_produk", p.getId())
                .addValue("kode_produk", p.getKode())
                .addValue("nama_produk", p.getNama())
                .addValue("harga_produk", p.getHarga());
        namedParameterJdbcTemplate.update(SQL_UPDATE_PRODUK, produkParameter);
    }
}
```

Agar lebih jelas, kita tampilkan juga deklarasi `SQL_UPDATE_PRODUK`.

```java
private static final String SQL_UPDATE_PRODUK 
    = "update m_produk set kode = :kode_produk, nama = :nama_produk, harga = :harga_produk where id = :id_produk";
```

Penggunaan `MapSqlParameterSource` dapat dilihat di blok `else`. Argumen kiri dari method `addValue` adalah nama variabel dalam `SQL_UPDATE_PRODUK`, sedangkan argumen kanan adalah nilai yang ingin diisikan.

# Delete Data #

Bila kita sudah menguasai insert dan update, maka delete seharusnya tidak menjadi masalah. Berikut kode program untuk menghapus data produk.

```java
public void hapus(Produk p) {
    jdbcTemplate.update(SQL_HAPUS, p.getId());
}
```

Berikut deklarasi `SQL_HAPUS`

```java
private static final String SQL_HAPUS = "delete from m_produk where id = ?";
```

Menghapus `penjualan` yang memiliki relasi header detail juga tidak sulit. Pastikan kita menghapus detailnya dulu sebelum menghapus headernya agar tidak terjadi pelanggaran [referential integrity](http://en.wikipedia.org/wiki/Referential_integrity). 

Berikut contoh pesan error bila kita menghapus data produk yang sudah dipakai dalam transaksi.

```
org.springframework.dao.DataIntegrityViolationException: PreparedStatementCallback; 
SQL [delete from m_produk where id = ?]; 
Cannot delete or update a parent row: 
a foreign key constraint fails (`belajar`.`t_penjualan_detail`, 
CONSTRAINT `t_penjualan_detail_ibfk_2` FOREIGN KEY (`id_produk`) 
REFERENCES `m_produk` (`id`)); 
nested exception is 
com.mysql.jdbc.exceptions.jdbc4.MySQLIntegrityConstraintViolationException: 
Cannot delete or update a parent row: 
a foreign key constraint fails (`belajar`.`t_penjualan_detail`, 
CONSTRAINT `t_penjualan_detail_ibfk_2` FOREIGN KEY (`id_produk`) 
REFERENCES `m_produk` (`id`))
```

Pada pesan error di atas, data `produk` tidak bisa dihapus karena sudah digunakan sebagai relasi foreign key dari `penjualan detail`.

Demikianlah penjelasan tentang insert, update, dan delete data. Nantikan [bagian selanjutnya](http://software.endy.muhardin.com/java/query-dengan-spring-jdbc/) yang membahas tentang query select.
