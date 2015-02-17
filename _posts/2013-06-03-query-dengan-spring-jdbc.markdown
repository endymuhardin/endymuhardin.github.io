---
layout: post
title: "Query dengan Spring JDBC"
date: 2013-06-03 20:08
comments: true
categories: 
- java
---


Pada artikel sebelumnya kita telah bisa mengubah data dalam database, baik menambah (insert), mengubah (update), maupun menghapus (data). Kali ini kita akan membahas tentang cara pengambilan data (select) dari dalam database.

Artikel ini merupakan bagian keempat dari rangkaian artikel Spring JDBC, yaitu

1. [Konfigurasi koneksi database](http://software.endy.muhardin.com/java/konfigurasi-koneksi-database-dengan-spring/)
2. [Struktur Aplikasi](http://software.endy.muhardin.com/java/struktur-aplikasi-java-dengan-spring-dan-maven/)
3. [Insert, update, dan delete data](http://software.endy.muhardin.com/java/insert-update-delete-dengan-spring-jdbc/)
4. [Query data](http://software.endy.muhardin.com/java/query-dengan-spring-jdbc/)
5. [Mengetes Akses Database](http://software.endy.muhardin.com/java/mengetes-akses-database/)

<!--more-->

Pada dasarnya, untuk mengambil data dari database hanya ada dua varian yang kita gunakan, yaitu:

* mengambil data tunggal, gunakan method `queryForObject`
* mengambil data banyak, gunakan method `queryForList` atau `query` saja

Kita lihat dulu implementasi yang paling mendasar, ambil semua data produk dari database. Berikut deklarasi SQLnya.

```java
private static final String SQL_CARI_SEMUA 
    = "select * from m_produk limit ?,?";
```

Perintah SQL di atas akan dipakai dalam method `cariSemua` sebagai berikut

```java
public List<Produk> cariSemua(Integer halaman, Integer baris) {
    return jdbcTemplate.query(SQL_CARI_SEMUA,
            new ResultSetJadiProduk(),
            PagingHelper.halamanJadiStart(halaman, baris),
            baris);
}
```

Pada contoh di atas, kita menggunakan method `query` yang menerima tiga argumen, yaitu:

* SQL yang akan dijalankan, berupa String
* Class yang bertugas mengubah ResultSet menjadi object yang kita inginkan, dalam hal ini object `Produk`. Class ini akan kita buat sendiri, yaitu class `ResultSetJadiProduk`.
* argumen lain-lain (varargs). Ini merupakan fitur Java sejak versi 5 yang artinya kita bisa memasukkan argumen sebanyak-banyaknya dalam method. Argumen ini akan dikonversi menjadi List untuk diproses oleh method `query`

Jadi, bukan salah ketik kalau di atas saya sebut tiga argumen padahal kita memasukkan empat variabel ke dalamnya.

SQL select tentu tidak perlu kita bahas lagi, mari masuk ke class `ResultSetJadiProduk`

## Membuat Mapper ##

Class `ResultSetJadiProduk` bertugas mengkonversi hasil query ke database yang ada dalam class `ResultSet` menjadi object `Produk`. Implementasinya tidak rumit, ini dia.

```java
private class ResultSetJadiProduk implements RowMapper<Produk> {

    @Override
    public Produk mapRow(ResultSet rs, int i) throws SQLException {
        Produk p = new Produk();
        p.setId((Integer) rs.getObject("id"));
        p.setKode(rs.getString("kode"));
        p.setNama(rs.getString("nama"));
        p.setHarga(rs.getBigDecimal("harga"));
        return p;
    }
}
```

Kita membuatnya sebagai class di dalam class (inner class). Kalau lupa dengan strukturnya, silahkan baca lagi bab dua tentang Struktur Aplikasi.

Class ini harus implement interface `RowMapper<T>` milik Spring. `T` diganti dengan class yang menjadi tujuan konversi. Interface `RowMapper<T>` ini mewajibkan kita membuat method `mapRow`. Isi method tersebut sudah cukup jelas sehingga tidak perlu dijelaskan.

Class ini nantinya bisa kita gunakan juga di query yang menghasilkan satu object `Produk` seperti `cariById` dan `cariByKode`. Berikut implementasinya

```java
public Produk cariById(Integer id) {
    try {
        return jdbcTemplate.queryForObject(SQL_CARI_BY_ID, 
            new ResultSetJadiProduk(), id);
    } catch (EmptyResultDataAccessException err) {
        return null;
    }
}

public Produk cariByKode(String kode) {
    try {
        return jdbcTemplate.queryForObject(SQL_CARI_BY_KODE, 
            new ResultSetJadiProduk(), kode);
    } catch (EmptyResultDataAccessException err) {
        return null;
    }
}
```

Kedua method ini sama saja prinsipnya dengan `cariSemua` yang sudah kita bahas sebelumnya.

## Mengambil data berelasi ##

Setelah berhasil mengambil data dari satu produk, mari kita coba untuk berurusan dengan data berelasi. Sebetulnya prinsipnya sama saja, yaitu membuatkan class konversi. Bedanya hanya terletak pada query SQL yang menggunakan join, tidak ada hubungannya dengan Spring JDBC.

Pada service interface, kita memiliki fitur rekap transaksi untuk satu produk tertentu, yang dimuat dalam method `cariPenjualanDetailByProdukDanPeriode`. Method tersebut memanggil method `cariByProdukDanPeriode` dalam class `PenjualanDetailDao`. Berikut implementasinya.

```java
public class PenjualanDetailDao {
    
    private static final String SQL_CARI_BY_PRODUK_DAN_PERIODE 
            = "select pd.*, p.waktu_transaksi, "
            + "produk.kode as kode_produk, produk.nama as nama_produk,"
            + "produk.harga as harga_produk "
            + "from t_penjualan_detail pd "
            + "inner join t_penjualan p on pd.id_penjualan = p.id "
            + "inner join m_produk produk on pd.id_produk = produk.id " 
            + "where pd.id_produk = ? " +
            + "and (p.waktu_transaksi between ? and ?) " +
            + "limit ?,?";
    
    public List<PenjualanDetail> cariByProdukDanPeriode(Produk p, 
            Date mulai, Date sampai, Integer halaman, Integer baris) {
        return jdbcTemplate.query(SQL_CARI_BY_PRODUK_DAN_PERIODE, 
                new ResultSetJadiPenjualanDetail(), 
                p.getId(), 
                mulai, 
                sampai, 
                PagingHelper.halamanJadiStart(halaman, baris), 
                baris);
    }
}
```

Konversi dari `ResultSet` menjadi `PenjualanDetail` dilakukan dalam class `ResultSetJadiPenjualanDetail` berikut

```java
private class ResultSetJadiPenjualanDetail 
        implements RowMapper<PenjualanDetail> {

    @Override
    public PenjualanDetail mapRow(ResultSet rs, int i) 
            throws SQLException {
        PenjualanDetail p = new PenjualanDetail();
        p.setId((Integer) rs.getObject("id"));
        p.setHarga(rs.getBigDecimal("harga"));
        p.setJumlah((Integer) rs.getObject("jumlah"));
        
        // relasi ke produk
        Produk px = new Produk();
        px.setId((Integer) rs.getObject("id_produk"));
        px.setKode(rs.getString("kode_produk"));
        px.setNama(rs.getString("nama_produk"));
        px.setHarga(rs.getBigDecimal("harga_produk"));
        p.setProduk(px);
        
        // relasi ke penjualan
        Penjualan jual = new Penjualan();
        jual.setId((Integer) rs.getObject("id_penjualan"));
        jual.setWaktuTransaksi(rs.getDate("waktu_transaksi"));
        p.setPenjualan(jual);
        
        return p;
    }
}
```

Selain class `PenjualanDetail` itu sendiri, kita juga membuatkan object `Produk` dan `Penjualan` yang kemudian akan dipasang pada object `PenjualanDetail`.

## Pagination ##

Dalam mengambil data yang berjumlah banyak seperti data transaksi, biasanya kita akan melakukan _pagination_, yaitu membagi data menjadi beberapa halaman. Di MySQL, kita menggunakan keyword `LIMIT` untuk melakukan hal ini. Keyword `LIMIT` menerima dua argumen, yaitu nomer record pertama yang mau diambil dan jumlah record yang mau diambil. Jadi bila kita ingin mengambil record 11 - 15, kita menggunakan keyword `LIMIT 11, 5`.

Ini agak berbeda dengan argumen yang diterima dalam method pencarian kita. Yang diminta di situ adalah nomer halaman dan jumlah record per halaman. Jadi kalau misalnya data kita berjumlah 56 record dan kita ingin setiap halaman berisi 10 record, maka data tersebut akan terbagi menjadi 6 halaman. Bila kita ingin mengambil halaman terakhir, kita memberikan argumen `6` dan `10` ke dalam method pencarian.

Tentunya harus ada konversi dari nomer halaman menjadi nomer baris. Ini kita lakukan di class `PagingHelper` yang isinya sebagai berikut.

```java
public class PagingHelper {
    public static Integer halamanJadiStart(Integer halaman, 
            Integer baris){
        if (halaman < 1) {
            return 0;
        }
        return (halaman - 1) * baris;
    }
}
```

## Header Detail ##

Dalam aplikasi, pasti ada fitur untuk menampilkan daftar transaksi dalam periode tertentu. 
Seperti sudah kita bahas, satu transaksi terdiri dari satu header dan beberapa detail. 
Data ini tentu ingin kita ambil semua. 

Caranya sederhana :

1. Query dulu headernya: `select * from t_penjualan where id = ?`
2. Query detailnya: `select * from t_penjualan_detail where id_penjualan = ?`
3. Gabungkan keduanya

Berikut contohnya, pada waktu kita ingin mencari `Penjualan` berdasarkan `id`

```java
public Penjualan cariById(Integer id) {
    try {
        Penjualan p = jdbcTemplate.queryForObject(SQL_CARI_BY_ID, 
            new ResultSetJadiPenjualan(), id);
        List<PenjualanDetail> daftarDetail = penjualanDetailDao
            .cariByPenjualan(p);
        p.setDaftarPenjualanDetail(daftarDetail);
        return p;
    } catch (EmptyResultDataAccessException err) {
        return null;
    }
}
```

Di sana, kita memanggil method `cariByPenjualan` yang ada di class `PenjualanDetailDao`. Berikut kode programnya

```java
public List<PenjualanDetail> cariByPenjualan(Penjualan p){
    List<PenjualanDetail> hasil 
        = jdbcTemplate.query(SQL_CARI_BY_ID_PENJUALAN, 
            new ResultSetJadiPenjualanDetail(), p.getId());
    
    // set relasi ke penjualan
    for (PenjualanDetail penjualanDetail : hasil) {
        penjualanDetail.setPenjualan(p);
    }
    
    return hasil;
}
```

Kembali ke `PenjualanDao`, setelah kita mendapatkan `List<PenjualanDetail>` dari method di atas, kita pasang di object penjualan yang sudah kita dapatkan di baris ini

```java
p.setDaftarPenjualanDetail(daftarDetail);
```

Demikianlah cara kita mengambil data dari database menggunakan Spring JDBC. 
Hal ini tentu tidak rumit asalkan kita sudah paham dasar-dasar SQL termasuk cara melakukan join antar tabel.
Jadi kesimpulannya, untuk mengambil data menggunakan Spring JDBC, yang perlu kita lakukan hanyalah:

1. Membuat SQL, lengkap dengan join bila perlu. Contohnya bisa dilihat di class `PenjualanDetailDao` yang memiliki banyak join.
2. Membuat class untuk mengkonversi dari `ResultSet` menjadi object yang kita inginkan, misalnya `Produk` atau `Penjualan`

Pada bagian selanjutnya, kita tinggal [mengetes kode program](http://software.endy.muhardin.com/java/mengetes-akses-database/) yang telah kita buat ini.

