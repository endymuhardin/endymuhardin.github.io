---
layout: post
title: "Memahami Mapping Relasi di Hibernate"
date: 2016-02-25 02:00
comments: true
categories: 
- java
---
Salah satu permasalahan yang sulit dipahami pada saat belajar Hibernate adalah mapping relasi. Oleh karena itu, pada artikel kali ini, kita akan membahas berbagai konsep relasi database, bagaimana cara mappingnya, dan apa konsekuensinya.

<!--more-->

Sebelum masuk ke mapping relasi, terlebih dulu kita pahami masalah relasi _aggregation_ dan _composition_. Kedua relasi ini skema databasenya sama, tapi berbeda perlakuan dalam kode programnya.

## Aggregation vs Composition ##

Relasi _aggregation_ artinya mengumpulkan atau mengelompokkan beberapa benda menjadi satu. Misalnya `Mahasiswa` mengambil beberapa `MataKuliah` dalam satu semester. Atau `Karyawan` tergabung dalam satu `Divisi` atau `Departemen` dalam perusahaan. Karakteristik utama _aggregation_ adalah masing-masing benda tersebut bisa berdiri sendiri. Artinya, walaupun tidak tergabung dalam `Divisi` manapun, objek `Karyawan` tetap ada dalam sistem. Demikian juga walaupun tidak ada `Karyawan` dalam `Divisi` tertentu, datanya tetap ada dalam sistem.

Dengan demikian, siklus hidup objek yang tergabung dalam relasi aggregation tidak saling mempengaruhi. Kita bisa menghapus salah satu `Mahasiswa` tanpa mempengaruhi `MataKuliah`. Demikian juga sebaliknya, kita bisa menghapus `MataKuliah` tertentu, sedangkan data `Mahasiswa` tetap ada.

Dalam notasi UML, relasi _aggregation_ ini ditulis dengan belah ketupat berwarna putih. Dalam desain database, relasi _aggregation_ ini disebut juga dengan istilah _non identifying relationship_. 

![Aggregation](https://lh3.googleusercontent.com/iva3mLlegQrfrGFoB7rEkYe81WqxNg4Okf5AR3wkwWdmxd-MSw1OOHN5mKh9UpckZaN9X_HZYQsD)

Relasi _composition_ artinya gabungan beberapa benda menjadi satu benda utuh. Misalnya, satu `Transaksi` di minimarket terdiri dari banyak `TransaksiDetail` yang masing-masingnya terdiri dari satu jenis `Produk` dengan jumlah yang berbeda-beda. Atau suatu `Berita` memiliki banyak `Komentar`. Tanpa komponen pendukungnya, maka benda induknya tidak bermakna. `Komentar` tanpa `Berita` tidak bermakna, apanya yang mau dikomentari?. Demikian juga `Transaksi` tanpa `Produk` yang dibeli, tidak ada maknanya.

Dengan demikian, siklus hidup anggota relasi komposisi saling berkaitan. Bila kita menghapus data `Berita` tertentu, maka seluruh `Berita`nya harus ikut dihapus, karena dia tidak bermakna tanpa induknya. Demikian juga sebaliknya, bila kita menghapus data `TransaksiDetail`, maka data `Transaksi` juga menjadi invalid. 

Relasi _composition_ ini di notasi UML dinyatakan dengan belah ketupat berwarna hitam. Dalam desain database, relasi _composition_ ini disebut juga dengan istilah _identifying relationship_. 


![Composition](https://lh3.googleusercontent.com/5CTPUEeUz4a0OqoMm3OBWO-WnY_bj3eohpAzKTUlenY8uP2YkTFb6d1YgmkttLGRqL5AqLZ1NDRe)

Secara relasi database, umumnya orang tidak membedakan skema antara hubungan _aggregation_ dan _composition_. Skema antara `Departemen` dan `Karyawan` bisa dibuat seperti ini

```sql
create table departemen (
  id INT PRIMARY KEY,
  kode VARCHAR(10) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL
);

create table karyawan (
  id INT PRIMARY KEY,
  nik VARCHAR(30) UNIQUE NOT NULL,
  nama VARCHAR(255) NOT NULL,
  id_departemen INT,
  CONSTRAINT fk_dept FOREIGN KEY (id_departemen) 
  REFERENCES departemen(id)
);
```

Demikian juga untuk `Berita` dan `Komentar` skemanya mirip-mirip

```sql
create table berita (
  id INT PRIMARY KEY,
  waktu_publikasi DATETIME NOT NULL,
  judul VARCHAR(100) NOT NULL UNIQUE,
  isi VARCHAR(255) NOT NULL
);

create table komentar (
  id INT PRIMARY KEY,
  waktu_publikasi DATETIME NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  isi VARCHAR(255) NOT NULL,
  id_berita INT NOT NULL,
  CONSTRAINT fk_berita FOREIGN KEY (id_berita) 
  REFERENCES berita(id)
);
```

Di jaman dulu lazim juga orang membedakan desain skema antara _non-identifying_ dan _identifying_ relationship. Untuk yang _identifying_ relationship, foreign key dipasang sebagai primary key seperti ini

```sql
create table komentar (
  id INT PRIMARY KEY,
  waktu_publikasi DATETIME NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  isi VARCHAR(255) NOT NULL,
  id_berita INT PRIMARY KEY,
  CONSTRAINT fk_berita FOREIGN KEY (id_berita) 
  REFERENCES berita(id)
);
```

Akan tetapi, karena kerepotan yang ditimbulkan oleh pemakaian _composite key_ (primary key yang terdiri dari beberapa kolom), maka banyak juga orang (termasuk saya) yang tidak menganut pembedaan ini. Jadi skemanya disamakan saja antara _non-identifying_ dan _identifying_. Paling kita tambahkan constraint `NOT NULL` di kolom foreign key untuk relasi _identifying_ dan kita berikan klausa `CASCADE`.

Penjelasan lebih lengkap bisa dibaca [di sini](http://stackoverflow.com/a/762994) dan [di sini](http://stackoverflow.com/a/2814663)


Sengaja tidak saya buatkan diagram, supaya pembaca berlatih membayangkan skema dari kode program :D
Kemampuan membayangkan struktur dari kode ini sangat penting bagi seorang programmer dan hanya bisa didapatkan dari sering berlatih.

> Lalu bagaimana cara kita mapping relasi tadi di Hibernate?

## Hibernate Mapping ##

Ada perbedaan mendasar antara relasi di ORM (baik itu Hibernate di Java, ActiveRecord di Rails, ataupun Eloquent di Laravel) dengan relasi di database, yaitu masalah arah (direction).

Relasi di database tidak mengenal arah, sedangkan di ORM mengenal arah.

> Apa maksudnya?

Kita ilustrasikan dengan kode program Java, tapi prinsip yang sama juga berlaku dalam Rails (Ruby) dan Laravel (PHP). 

Berikut adalah definisi class tanpa relasi untuk relasi di atas.

```java
@Entity @Table(name="berita")
public class Berita {

  @Id @GeneratedValue
  private Integer id;

  @Column(name="waktu_publikasi", nullable=false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date waktuPublikasi;

  @Column(nullable=false)
  private String judul;

  @Column(nullable=false)
  private String isi;

  // getter setter tidak ditampilkan
}

@Entity @Table(name="komentar")
public class Komentar {

  @Id @GeneratedValue
  private Integer id;

  @Column(name="waktu_publikasi", nullable=false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date waktuPublikasi;

  @Column(nullable=false)
  private String email;

  @Column(nullable=false)
  private String nama;

  @Column(nullable=false)
  private String isi;

  // getter setter tidak ditampilkan
}
```

Untuk mendefinisikan relasinya, pertama kita harus menentukan dulu di sisi mana kita mau membuat relasi. Apakah arahnya dari `Berita` ke `Komentar` atau sebaliknya?

Yang paling umum adalah kita definisikan di sisi Komentar, seperti ini

```java
public class Berita {
  // tidak ada perubahan, sama seperti sebelumnya
}

public class Komentar {

  // kode program sebelumnya yang tidak berubah tidak ditulis lagi

  @ManyToOne
  @JoinColumn(name="id_berita", nullable=false)
  private Berita berita;
}
```

Dengan demikian, kita bisa mengakses objek `Berita` dari sisi `Komentar` seperti ini

```java
List<Komentar> ks = cariKomentarBerdasarkanEmail("endy@muhardin.com");

// tampilkan judul berita
for(Komentar k : ks){
  System.out.println("Judul Berita : "+ k.getBerita().getJudul());
}
```

Tapi sebaliknya tidak bisa. Kita tidak bisa menampilkan `Komentar` untuk `Berita` tertentu, karena variabelnya tidak ada di sisi `Berita`.

```java
Berita b = cariBeritaBerdasarkanJudul("Tol Brexit");

List<Komentar> ks = b.getDaftarKomentar(); // error, tidak ada variabel daftarKomentar di class Berita
```

Fenomena ini disebut dengan istilah arah atau `direction` dalam bahasa Inggris. Relasi satu arah (dari `Komentar` ke `Berita`) disebut unidirectional. Kita bisa membuat relasi satu arah di sisi mana saja tanpa mempengaruhi skema database, karena database tidak mengenal konsep `direction`. 

Mari kita pindahkan relasinya ke sisi `Berita`. 

```java

public class Berita {

  // kode program lainnya sama, tidak ditulis lagi

  @OneToMany
  @JoinColumn(name="id_berita", nullable=false)
  private List<Komentar> daftarKomentar
                    = new ArrayList<>();
}

public class Komentar {
  // tidak ada perubahan, sama seperti yang tanpa relasi
  // tidak ada juga relasi @ManyToOne
}
```

Bila mappingnya seperti itu, maka kita bisa menampilkan komentar untuk suatu berita seperti ini

```java
Berita b = cariBeritaBerdasarkanJudul("Tol Brexit");

List<Komentar> ks = b.getDaftarKomentar(); // ok, karena ada variabel daftarKomentar dalam class Berita
```

Tapi tidak bisa menampilkan `Berita` untuk `Komentar` tertentu

```java
List<Komentar> ks = cariKomentarBerdasarkanEmail("endy@muhardin.com");

// tampilkan judul berita
for(Komentar k : ks){
  // error, karena tidak ada variabel berita dalam class Komentar
  System.out.println("Judul Berita : "+ k.getBerita().getJudul());
}
```

> Wah bagaimana dong, saya mau bisa dua-duanya?

Dasar manusia, tidak ada puasnya :P
Tapi no problem, kita bisa bikin relasi dua arah (bidirectional) di sisi `Berita` dan `Komentar`. Berikut saya tampilkan mapping yang *salah* dulu

```java
public class Berita {

  // kode program lainnya sama, tidak ditulis lagi

  @OneToMany
  @JoinColumn(name="id_berita", nullable=false)
  private List<Komentar> daftarKomentar
                    = new ArrayList<>();
}

public class Komentar {

  // kode program sebelumnya yang tidak berubah tidak ditulis lagi

  @ManyToOne
  @JoinColumn(name="id_berita", nullable=false)
  private Berita berita;
}
```

Kita tinggal copas saja deklarasi mapping relasi dari kedua contoh di atas. Dengan demikian kita punya mapping dua arah. 

> Lalu kenapa dibilang salah?

Di jaman dulu, mapping seperti ini dibiarkan sama Hibernate, tapi nanti kacau pas dijalankan. Dia akan menjalankan query duplikat pada waktu kita insert/update relasi. Tapi di jaman sekarang, kesalahan mapping seperti ini akan diperingatkan pada waktu aplikasi dijalankan. Berikut pesan errornya

```
Caused by: org.hibernate.MappingException: Repeated column in mapping for entity: com.muhardin.endy.belajar.hibernate.mapping.entity.Komentar column: id_berita (should be mapped with insert="false" update="false")
```

Karena error ini, saya jadi tidak bisa mendemokan apa yang terjadi kalau kita salah mapping seperti ini. Sebetulnya bisa dengan menggunakan Hibernate versi jadul, tapi terlalu ribet. Jadi ya bersyukur saja sudah langsung dicegat sehingga bisa langsung kita perbaiki.

Dia bilang ada mapping yang diulang pada kolom `id_berita`.

> Kenapa demikian?

Karena relasi dua arah ini (Berita -> Komentar dan Komentar -> Berita) sebetulnya mengacu pada satu relasi database yang sama, yaitu relasi foreign key `id_berita` di tabel `komentar` yang mengarah ke kolom `id` di tabel `berita`. Karena relasi aslinya di database hanya satu, maka kedua relasi di Hibernate ini harus memiliki satu penanggung jawab saja.

Ada dua pilihan solusi di sini, apakah penanggung jawabnya ada di sisi `Berita` atau di sisi `Komentar`. Biasanya, penanggung jawab ada di sisi many, karena di database foreign keynya ada di tabel many, yaitu tabel `komentar`. Dengan demikian, deklarasi mapping yang lebih lengkap harusnya ada di dalam class `Komentar`. Sedangkan di class `Berita` cukup dinyatakan bahwa mappingnya ada di sisi seberang. Ini dilakukan menggunakan modifier `mappedBy`. Isinya adalah nama variabel/properti class `Berita` di dalam class `Komentar`. Ingat ya, *nama variabel dalam Java*, bukan *nama kolom dalam database* !!!

Mapping yang benar adalah seperti ini

```java
public class Berita {

  // kode program lainnya sama, tidak ditulis lagi

  @OneToMany(mappedBy="berita")
  private List<Komentar> daftarKomentar
                    = new ArrayList<>();
}

public class Komentar {

  // kode program sebelumnya yang tidak berubah tidak ditulis lagi

  @ManyToOne
  @JoinColumn(name="id_berita", nullable=false)
  private Berita berita;
}
```

Nah, setelah diperbaiki, kita bisa menjalankan aplikasinya dengan lancar. Berikut kode program untuk menyimpan data ke database

```java
Berita b = new Berita();
b.setJudul("Tol Brexit");
b.setIsi("Tol brexit macet parah");
b.setWaktuPublikasi(new Date());

Komentar k = new Komentar();
k.setEmail("endy@muhardin.com");
k.setNama("Endy Muhardin");
k.setIsi("Wih, ngeri gan");
k.setWaktuPublikasi(new Date());
k.setBerita(b);
        
b.getDaftarKomentar().add(k);
        
BeritaDao bd = app.getBean(BeritaDao.class);
bd.save(b);
```

Dia akan menghasilkan query seperti ini

```sql
insert into berita (isi, judul, waktu_publikasi) values (?, ?, ?)
insert into komentar (id_berita, email, isi, nama, waktu_publikasi) values (?, ?, ?, ?, ?)
```


> Bagaimana kalau kita mau penanggung jawabnya di sisi one?

Berikut mappingnya

```java
public class Berita {

  // kode program lainnya sama, tidak ditulis lagi

  @OneToMany
  @JoinColumn(name="id_berita", nullable=false)
  private List<Komentar> daftarKomentar
                    = new ArrayList<>();
}

public class Komentar {

  // kode program sebelumnya yang tidak berubah tidak ditulis lagi

  @ManyToOne
  @JoinColumn(name = "id_berita", nullable = false, insertable = false, updatable = false)
  private Berita berita;
}
```

Walaupun demikian, mapping seperti ini tidak dianjurkan. Kita bisa lihat bahwa dengan mapping seperti ini, querynya kurang optimal. Ada 3 query yang dijalankan untuk menyimpan data ke database

```sql
insert into berita (isi, judul, waktu_publikasi) values (?, ?, ?)
insert into komentar (email, isi, nama, waktu_publikasi) values (?, ?, ?, ?)
update komentar set id_berita=? where id=?
```

Bila kita ingin penanggung jawabnya ada di sisi `Berita`, biasanya disebabkan karena `Komentar` sifatnya opsional, bisa ada dan bisa tidak ada. Untuk itu akan lebih ideal kalau kita membuat tabel _bridging_ atau join table. Skemanya menjadi seperti ini

```sql
create table berita (
  id INT PRIMARY KEY,
  waktu_publikasi DATETIME NOT NULL,
  judul VARCHAR(100) NOT NULL UNIQUE,
  isi VARCHAR(255) NOT NULL
);

create table komentar (
  id INT PRIMARY KEY,
  waktu_publikasi DATETIME NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  nama VARCHAR(255) NOT NULL,
  isi VARCHAR(255) NOT NULL
);

create table komentar_berita (
  id INT PRIMARY KEY,
  id_berita INT NOT NULL,
  id_komentar INT NOT NULL,
  CONSTRAINT fk_berita FOREIGN KEY (id_berita) 
  REFERENCES berita(id),
  CONSTRAINT fk_komentar FOREIGN KEY (id_komentar) 
  REFERENCES komentar(id)
);
```

Dan mappingnya menjadi seperti ini

```java
public class Berita {

  // kode program lainnya sama, tidak ditulis lagi

  @OneToMany
  @JoinTable(
    name="komentar_berita",
    joinColumns=@JoinColumn(name="id_berita", nullable=false),
    inverseJoinColumns=@JoinColumn(name="id_komentar", nullable=false)
  )
  private List<Komentar> daftarKomentar
                    = new ArrayList<>();
}

public class Komentar {

  // kode program sebelumnya yang tidak berubah tidak ditulis lagi

  @ManyToOne
  @JoinTable(
    name = "komentar_berita",
    joinColumns = @JoinColumn(name = "id_komentar", insertable = false, updatable = false),
    inverseJoinColumns = @JoinColumn(name = "id_berita", insertable = false, updatable = false)
  )
  private Berita berita;
}
```

Ada sedikit perbedaan dalam cara menyimpan datanya

```java
Berita b = new Berita();
b.setJudul("Tol Brexit");
b.setIsi("Tol brexit macet parah");
b.setWaktuPublikasi(new Date());

Komentar k = new Komentar();
k.setEmail("endy@muhardin.com");
k.setNama("Endy Muhardin");
k.setIsi("Wih, ngeri gan");
k.setWaktuPublikasi(new Date());
        
b.getDaftarKomentar().add(k);
        
BeritaDao bd = app.getBean(BeritaDao.class);
bd.save(b);
```

Kita tidak perlu lagi memasangkan `Berita` ke `Komentar`. Ini akan ditangani secara otomatis oleh Hibernate.

Berikut SQL yang dihasilkan untuk menyimpan data

```sql
insert into berita (isi, judul, waktu_publikasi) values (?, ?, ?)
insert into komentar (email, isi, nama, waktu_publikasi) values (?, ?, ?, ?)
insert into komentar_berita (id_berita, id_komentar) values (?, ?)
```

## Mapping Aggregation vs Composition ##

Di atas tadi sudah kita bahas perbedaan aggregation dan composition, yaitu mengenai masalah siklus hidup. Untuk mengimplementasikan relasi aggregation, kita tidak boleh menghapus sisi many apabila sisi one dihapus. Teknisnya, ada beberapa hal yang harus kita lakukan:

1. Penanggung jawabnya harus di sisi many
2. Jangan gunakan opsi cascade di sisi one
3. Pada waktu menghapus sisi one, set dulu null di sisi many

Sedangkan untuk relasi composition, berlaku sebaliknya. Kita ingin sisi many juga terhapus pada saat kita menghapus sisi one. Untuk itu:

1. Penanggung jawab boleh di sisi one atau many. Bebas saja
2. Gunakan opsi cascade dan orphanRemoval. `@OneToMany(cascade=Cascade.ALL, orphanRemoval=true)`. Orphan removal ini gunanya supaya pada saat kita membuang many dari `List`, Hibernate akan menghapusnya dari database pada saat kita `save` sisi one.

## Penutup ##

Demikianlah penjelasan tentang serba serbi mapping relasi pada ORM. Konsep ini berlaku di berbagai produk ORM yang populer seperti ActiveRecord di Ruby on Rails dan Eloquent di Laravel. Kode program yang ada di artikel ini bisa dilihat dan diunduh [di Github](https://github.com/endymuhardin/belajar-hibernate-mapping), dan dicoba sendiri. Silahkan checkout sesuai komentar di commit message untuk mencoba [berbagai variasinya](https://github.com/endymuhardin/belajar-hibernate-mapping/commits/master).

Semoga bermanfaat
