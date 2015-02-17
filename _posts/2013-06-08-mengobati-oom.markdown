---
layout: post
title: "Mengobati OOM"
date: 2013-06-08 22:25
comments: true
categories: 
- java
---

Beberapa waktu belakangan ini, di milis mulai banyak bermunculan pertanyaan yang berkaitan dengan Out Of Memory Error (OOM).
Error ini biasanya terjadi bila data dalam aplikasi sudah besar (melebihi 2 GB), dan umumnya terjadi pada saat membuat report PDF/XLS/CSV, dsb.

Biasanya juga, _obat yang dikonsumsi_ oleh penderita OOM ini ada dua:

* Mengatur alokasi memori dengan opsi `Xms` dan `Xmx`
* Menggunakan perintah `System.gc()`

Sayangnya, kedua _obat_ ini tidak akan menyelesaikan masalah. Analoginya seperti kita kena infeksi otak, lalu minum Panadol. Sakit kepalanya mungkin akan hilang sementara waktu, tapi tidak lama kemudian justru akibatnya lebih fatal.

Lalu bagaimana solusinya?

<!--more-->

# Salah Kaprah tentang OOM #

Pertama, saya luruskan dulu mengenai `System.gc`.
Intinya begini

> System.gc() hanya boleh dipakai dengan satu (dan hanya satu-satunya) syarat:
> Yaitu pada waktu sudah bisa menjelaskan ke orang lain bagaimana cara kerja garbage collector dan sudah paham apa itu JVM Ergonomics. 

Next time mau mengetik System.gc, tanyakan pada diri sendiri, apakah saya sudah paham JVM Ergonomics dan bisa menjelaskannya ke orang lain? Kalau jawabannya belum, jangan diteruskan mengetik System.gc().

> Lalu apa itu `System.gc` dan kapan digunakan? 

Kan sudah dijelaskan di atas, pelajari cara kerja garbage collector dan apa itu JVM ergonomics.

Satu lagi salah kaprah yang harus dibenahi : 
opsi `Xms` dan `Xmx` itu gunanya adalah **UNTUK MEMAKSIMALKAN PENGGUNAAN MEMORI**. 
`Xms` dan `Xms` **BUKAN SOLUSI UNTUK MASALAH OOM**.

Masalah OOM itu ada di kode program kita sendiri, jadi carilah solusinya di kode program kita sendiri.
Penyebab OOM itu juga cuma satu : aplikasi kita menggunakan memori lebih besar daripada yang tersedia. 
Besar pasak daripada tiang.

1. Memori tersedia 4 GB, aplikasi kita pakai 4.1 GB => OOM
2. Memori tersedia 2 GB, aplikasi kita pakai 1.5 GB => No OOM padahal lebih kecil dari #1
3. RAM fisik ada 16 GB, tapi aplikasi kita cuma bisa memanfaatkan 2 GB => gunakan `Xms` dan `Xmx`.

# Penyebab OOM dan Solusinya #

Beberapa penyebab umum terjadinya OOM : 

## Unbounded Query ##

Unbounded query adalah query yang tidak kita batasi jumlahnya. 
Contohnya `select * from tbl_penjualan`. Kalau data penjualan hanya 1000 transaksi, no problem. Kalau transaksinya ada 10 juta record dalam satu hari, ya pasti langsung kena OOM.

Solusinya : pastikan selalu menggunakan paging. Ganti querynya menjadi `select * from tbl_penjualan limit 0,20` sehingga cuma mengeluarkan 20 record, berapapun banyaknya data dalam tabel.

## Generate File ##

Seringkali kita ingin menghasilkan file report. Misalnya laporan penjualan bulan ini, berapapun data yang ada di tabel untuk periode bulan ini, harus ditulis ke file. File ini bisa berupa PDF, XLS, XML, CSV, dan sebagainya. 

Format file tidak masalah. Yang menjadi masalah adalah cara membuatnya. Ada beberapa kesalahan umum : 

* mengumpulkan data di variabel sebelum menulis file
* tidak melepas data yang sudah diproses
* tidak paham cara kerja report engine

### Mengumpulkan data di variabel ###

Contoh pseudocode seperti ini 

```java
List<Penjualan> data = new ArrayList<Penjualan>();

// resultset adalah cursor, dia hanya baca apa yang ditarik saja
ResultSet rs = connection.createStatement("select * from tbl_penjualan")
    .executeQuery();

while(rs.next()){
    Penjualan p = konversiResultSetJadiPenjualan(rs);
    data.add(p);
}
```

Coding di atas akan mengumpulkan semua record di variabel `data`. 
Bila ada 1 juta record yang dihasilkan oleh query dengan masing-masing record berukuran 1 KB, 
maka variabel data tersebut akan berukuran 1 GB. Kalau Java VM kita berikan alokasi 2 GB, cuma butuh 3 user untuk menimbulkan OOM.
Menaikkan alokasi menjadi 8 GB melalui `Xms` dan `Xmx` tidak akan membantu banyak. 

### Tidak melepas data yang sudah diproses ###

Ini biasanya terjadi kalau kita menulis sendiri file output. Perhatikan contoh kode berikut:

```java
ResultSet rs = connection.createStatement("select * from tbl_penjualan")
    .executeQuery();

File output = new File("output.csv");
while(rs.next()){
    String baris = konversiResultSetJadiString(rs);
    output.write(baris);
    output.flush();
}
```

Menulis file ada bermacam-macam. Ada yang menggunakan buffer ada yang tidak. Pastikan kita mengosongkan buffer setiap kali iterasi supaya tidak penuh, biasanya dengan method `flush` atau sejenisnya.

### Tidak paham cara kerja report engine ###

Dalam mendesain library yang dipakai orang banyak, biasanya si pembuat akan melakukan optimasi untuk penggunaan yang sering terjadi. 
Misalnya 80% orang membuat PDF berukuran 10 halaman atau lebih sedikit, 20% sisanya membuat 1000 halaman atau lebih. 
Pada situasi ini, pembuat library report yang baik pasti akan memudahkan pembuatan 10 halaman report karena itulah fitur yang paling sering digunakan. 

Bila kita termasuk golongan yang 20%, kita harus belajar lebih giat supaya paham bagaimana mengatasi kondisi minoritas tersebut.

Sebagai contoh, kalau kita menggunakan Jasper Report, ada fitur yang disebut dengan [Virtualizer](http://community.jaspersoft.com/wiki/comparison-report-virtualizers) untuk membuat report berukuran besar. Pastikan kita sudah memahami kasus-kasus khusus ini.

## Inisialisasi object besar di dalam loop ##

Perhatikan contoh kode di bawah

```java
public void simpan(Produk p){
    ApplicationContext ctx = new ClassPathXmlApplicationContext("konfig-spring.xml");
    ProdukDao pd = ctx.getBean(ProdukDao.class);
    pd.save(p);
}
```

`ApplicationContext` merupakan object Spring Framework yang berisi seluruh konfigurasi aplikasi. Isinya :

* konfigurasi database
* mapping ORM (kalau pakai ORM)
* semua object yang dimanage Spring

Intinya, ini adalah object yang besar sekali dan sangat kompleks. Object seperti ini biasanya hanya dibuat sekali saja sepanjang aplikasi dijalankan. Bila kita taruh dalam method seperti di atas, maka tiap kali ada user simpan data produk, object besar tersebut akan dibuat, sehingga menghabiskan memori. 

Pesan moralnya, pahami library yang digunakan supaya tahu karakteristik dan cara kerjanya.


## Penggunaan collection yang kurang benar ##

Collection (Set, Map, List) adalah object yang menampung object lain. Kita harus memastikan bahwa object ini berada dalam scope yang benar. Lihat kode program berikut

```java
public class Coba {
    private static List<Integer> noSurat = new ArrayList<Integer>();
    private static Integer noTerakhir = 0;
    
    public void bikinSuratBaru(){
        noTerakhir++;
        noSurat.add(noTerakhir);
    }
}

```

Pada kode di atas, `noSurat` memiliki scope static, sehingga dia akan terus ada selama aplikasi berjalan. Bila aplikasi tidak mati dalam waktu yang lama, dan dalam sehari ada 1 juta surat baru, tinggal tunggu waktu saja sampai kena OOM.

# Panduan Solusi Umum #

Selain yang disebutkan di atas, masih banyak penyebab lain, yang paling sering terjadi adalah yang dibahas di atas. Kalau penyebab OOM tidak kita atasi, berapapun memori yang kita sediakan (melalui `Xms` dan `Xmx`) tidak akan cukup. Inilah sebabnya saya katakan bahwa `Xms` dan `Xmx` itu bukan solusi untuk OOM. Yang harus kita lakukan adalah **mengendalikan pemakaian** memori, bukan **menambah** memori. 

Jadi kalau menemukan OOM, coba dicek lagi kode programnya. 
Tidak perlu pakai VisualVM atau tools2 lain, cukup code review aja. 

Dibaca satu2 source codenya, untuk tiap baris, tanyakan pertanyaan ini : 

1. Method/statement ini akan dipanggil seberapa sering? 
2. Looping ini akan berputar maksimal berapa kali?
3. Berapa kira2 ukuran tiap row yang ditarik dalam query? Sekali tarik berapa row?
4. Setelah saya tarik row, kapan dia selesai digunakan? Apakah nunggu PDF jadi dulu baru selesai (inilah kandidat OOM), atau tiap selesai satu halaman PDF sudah bisa direlease?

Mudah-mudahan dengan adanya artikel ini tidak ada lagi orang yang mengobati OOM dengan `System.gc` atau `Xmx`.

## Referensi ##

* [How to fix memory leaks in Java](http://java.dzone.com/news/how-fix-memory-leaks-java)

