---
layout: post
title: "Mengetes Akses Database"
date: 2013-06-05 11:49
comments: true
categories: 
- java
---

Pada bagian ini, kita akan mempersiapkan seperangkat kode program untuk mengetes aplikasi yang telah kita buat.

Artikel ini merupakan bagian kelima dan terakhir dari rangkaian artikel Spring JDBC, yaitu

1. [Konfigurasi koneksi database](http://software.endy.muhardin.com/java/konfigurasi-koneksi-database-dengan-spring/)
2. [Struktur Aplikasi](http://software.endy.muhardin.com/java/struktur-aplikasi-java-dengan-spring-dan-maven/)
3. [Insert, update, dan delete data](http://software.endy.muhardin.com/java/insert-update-delete-dengan-spring-jdbc/)
4. [Query data](http://software.endy.muhardin.com/java/query-dengan-spring-jdbc/)
5. [Mengetes Akses Database](http://software.endy.muhardin.com/java/mengetes-akses-database/)

<!--more-->

## Setup Test ##

Seperti telah dijelaskan sebelumnya, test class kita akan terdiri dari dua bagian:

1. Abstract superclass : berisi seluruh kode program pengetesan aplikasi
2. Concrete subclass : berisi kode program untuk melakukan inisialisasi

Berikut adalah kerangka abstract superclass test untuk `Produk`

```java
package com.muhardin.endy.training.java.aksesdb.service;

// import statement, generate menggunakan IDE

public abstract class ProdukServiceTest {
    
    public abstract PenjualanService getPenjualanService();
    public abstract DataSource getDataSource();
    
    @Before
    public void bersihkanDataTest() throws Exception {
        
    }
    
    @Test
    public void testSimpanUpdateHapusProduk() throws Exception {
    
    }
    
    // test method lain tidak ditampilkan
}
```

Dan berikut ini adalah concrete subclass yang berfungsi melakukan inisialisasi konfigurasi Spring JDBC

```java
package com.muhardin.endy.training.java.aksesdb.service.springjdbc;

// import statement generate menggunakan IDE

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

## Database Reset ##

Pada kode program abstract superclass di atas, kita melihat ada method untuk membersihkan data test. Method ini diberikan annotation `@Before` supaya dia dijalankan **sebelum masing-masing test**.

Berikut adalah isi method tersebut

```java
@Before
public void bersihkanDataTest() throws Exception {
    DataSource ds = getDataSource();
    Connection conn = ds.getConnection();
    
    String sql = "delete from m_produk where kode like ?";
    PreparedStatement ps = conn.prepareStatement(sql);
    ps.setString(1,"T-001%");
    ps.executeUpdate();
    conn.close();
}
```

Di method tersebut, kita menghapus semua produk yang kodenya diawali `T-001`. Ini adalah data yang kita insert selama proses tes. Agar tidak mengganggu tes lainnya, kita hapus data percobaan tersebut.

## Test Insert Update Delete ##

Proses insert, update, dan delete mengubah data yang ada dalam database. Supaya kita tidak repot mengurus data sample yang sudah ada di database, ketiga proses ini kita tes dalam satu kesatuan. Dengan demikian, setelah selesai dijalankan, datanya kembali bersih seperti sebelumnya. Berikut kode programnya.

```java
@Test
public void testSimpanUpdateHapusProduk() throws Exception{
    Produk p = new Produk();
    p.setHarga(new BigDecimal(125000));
    p.setKode("T-001");
    p.setNama("Produk Test 001");
    
    PenjualanService service = getPenjualanService();
    service.simpan(p);
    assertNotNull(p.getId());
    
    Connection conn = getDataSource().getConnection();
    PreparedStatement psCariById 
            = conn.prepareStatement
                ("select * from m_produk where id = ?");
    psCariById.setInt(1, p.getId());
    ResultSet rs = psCariById.executeQuery();
    
    // test nilai awal
    assertTrue(rs.next());
    assertEquals("T-001",rs.getString("kode"));
    
    // update record
    p.setKode("T-001x");
    service.simpan(p);
    
    // test query setelah update
    rs = psCariById.executeQuery();
    
    assertTrue(rs.next());
    assertEquals("T-001x",rs.getString("kode"));
    
    // test delete
    service.hapus(p);
    
    // test query setelah hapus
    rs = psCariById.executeQuery();
    
    assertFalse(rs.next());
}
```

Dari komentar yang ada dalam kode program, sudah jelas apa maksud dari masing-masing bagian.

## Test Query ##

Selanjutnya kita melakukan tes terhadap query. Kita mulai dari yang sederhana dulu, yaitu tabel produk. 
Berikut kode program pengetesannya.

```java
@Test
public void testCariProdukById() {
    PenjualanService service = getPenjualanService();
    assertNotNull(service.cariProdukById(1));
    assertNull(service.cariProdukById(99));
}

@Test
public void testCariProdukByKode() {
    PenjualanService service = getPenjualanService();
    assertNotNull(service.cariProdukByKode("K-001"));
    assertNull(service.cariProdukByKode("X-001"));
}

@Test
public void testHitungSemuaProduk() {
    PenjualanService service = getPenjualanService();
    assertEquals(Long.valueOf(3), 
        Long.valueOf(service.hitungSemuaProduk()));
}

@Test
public void testCariSemuaProduk() {
    PenjualanService service = getPenjualanService();
    List<Produk> hasil = service.cariSemuaProduk(1, 100);
    assertNotNull(hasil);
    assertTrue(hasil.size() == 3);
    for (Produk produk : hasil) {
        assertNotNull(produk.getId());
        assertNotNull(produk.getKode());
        assertNotNull(produk.getNama());
        assertNotNull(produk.getHarga());
    }
}
```

Logika pengetesan tidak kompleks. Kita query datanya menggunakan method di `ProdukDao` yang telah kita buat, 
lalu kita bandingkan dengan kondisi yang seharusnya. Perbandingan dilakukan menggunakan method yang telah disediakan JUnit, yaitu method berawalan `assert`, misalnya `assertNotNull`, `assertEquals`, dan lainnya.

Yang harus diperhatikan di sini adalah, kita harus benar-benar tahu persis isi database supaya test ini bisa berjalan dengan baik. Ada banyak teknik yang bisa digunakan untuk memastikan isi database sebelum tes dijalankan, salah satunya menggunakan tools yang bernama [DBUnit](http://www.dbunit.org/). Lebih lanjut tentang cara menggunakan DBUnit bisa dibaca di [artikel ini](http://software.endy.muhardin.com/java/ruthless-testing-4/).

## Test Relasi ##

Pengetesan terhadap relasi pada prinsipnya tidak berbeda. Hanya ada sedikit tambahan yaitu kita juga harus memastikan apakah relasinya berhasil terisi dengan sempurna. Berikut pengetesannya.

```java
@Test
    public void testCariPenjualanDetailByProdukDanPeriode(){
    Produk p = new Produk();
    p.setId(1);
    
    Date mulai = new DateTime(2013,1,1,0,0,0,0).toDate();
    Date sampai = new DateTime(2013,2,1,0,0,0,0).toDate();
    
    List<PenjualanDetail> hasil = getPenjualanService()
            .cariPenjualanDetailByProdukDanPeriode(p, 
                mulai, sampai, 1, 100);
    
    assertNotNull(hasil);
    assertTrue(hasil.size() == 2);
    
    for (PenjualanDetail penjualanDetail : hasil) {
        verifikasiPenjualanDetail(penjualanDetail);
    }
}
```

Pada kode program di atas, terlihat bahwa kita melakukan looping yang di dalamnya ada verifikasi `PenjualanDetail`. Berikut isi methodnya.

```java
private void verifikasiPenjualanDetail
        (PenjualanDetail penjualanDetail) {
    assertNotNull(penjualanDetail.getProduk().getHarga());
    assertNotNull(penjualanDetail.getPenjualan().getWaktuTransaksi());
}
```

Kita cukup memastikan bahwa relasi yang dimiliki `PenjualanDetail` yaitu `Produk` dan `Penjualan` tidak null. Demikian juga variabel yang ada di dalam objectnya yaitu `harga` dan `waktuTransaksi`.

Demikianlah rangkaian artikel tentang penggunaan Spring JDBC. Kode program selengkapnya dapat diambil [di Github](https://github.com/endymuhardin/belajar-akses-database-java/tree/spring-jdbc). 
Semoga bermanfaat.
