---
layout: post
title: "Mengapa kita membuat class"
date: 2014-12-16 15:26
comments: true
categories: 
- java
---

Ada [pertanyaan di grup Facebook](https://www.facebook.com/groups/ForumJavaIndonesia/10152533869543017) yang cukup menarik untuk kita bahas di sini. Sample code yang ditanyakan saya modifikasi sedikit supaya lebih cocok.

## Class Mahasiswa ##

```java
public class Mahasiswa {
    private String nama;
    private Date tanggalLahir;
    private JenisKelamin jenisKelamin;
    
    // getter setter
}

public enum JenisKelamin{
    PRIA, WANITA
}
```

## Class SimpanMahasiswaServlet ##

```java
public class SimpanMahasiswaServlet extends HttpServlet {

    private MahasiswaDao md = new MahasiswaDao();

    public void doPost(HttpServletRequest req, HttpServletResponse resp){
        Mahasiswa m = new Mahasiswa();
        
        m.setNama(req.getParameter("nama"));
        
        SimpleDateFormat formatTanggal = new SimpleDateFormat("yyyy-MM-dd");
        m.setTanggalLahir(formatTanggal.parse(req.getParameter("tanggal")));
        
        m.setJenisKelamin(JenisKelamin.valueOf(req.getParameter("jenis")));
        
        md.simpan(m);
    }

}
```

## Class MahasiswaDao ##

```java
public class MahasiswaDao {
    public void simpan(Mahasiswa m){
        String sql = "INSERT INTO mahasiswa values (?,?,?)";
        PreparedStatement ps = koneksi.prepareStatement(sql);
        ps.setString(1, m.getNama());
        ps.setDate(2, new java.sql.Date(m.getTanggalLahir().getTime()));
        ps.setString(3, m.getJenisKelamin().name());
        ps.executeUpdate();
    }
}
```

> Pertanyaan : Lebih kenceng mana contoh kode di atas (menggunakan class Mahasiswa) dibandingkan langsung saja pakai Map/Array ?

Supaya lebih jelas, berikut contoh yang pakai array.

```java
public class SimpanMahasiswaServlet extends HttpServlet {

    private MahasiswaDao md = new MahasiswaDao();

    public void doPost(HttpServletRequest req, HttpServletResponse resp){
        String[] m = new String[3];
        
        m[0] = req.getParameter("nama");
        m[1] = req.getParameter("tanggal");
        m[2] = req.getParameter("jenis");
        
        md.simpan(m);
    }

}
```

## Class MahasiswaDao ##

```java
public class MahasiswaDao {
    public void simpan(String[] m){
        String sql = "INSERT INTO mahasiswa values (?,?,?)";
        PreparedStatement ps = koneksi.prepareStatement(sql);
        
        for(int i=0; i<m.length; m++){
            ps.setString(i, m[i]);
        }
        
        ps.executeUpdate();
    }
}
```

Pembuatan class `Mahasiswa` di atas merupakan salah satu implementasi prinsip `encapsulation` dalam OOP. Class `Mahasiswa` disebut dengan istilah domain class, yaitu class yang dibuat untuk memodelkan kasus yang akan dibuat.

<!--more-->

> Jawaban : gak usah mikirin kenceng dulu. Soalnya pakai Array/Map itu salah. Buat apa aplikasi salah dibikin kenceng?

Kenapa salah?

1. Susah dipahami
2. Tidak bisa pakai library pihak ketiga
3. Menyia-nyiakan dukungan tipe data yang sudah disediakan Java

## Source code susah dipahami ##

Bayangkan kita lagi mau ngisi variabel di Netbeans/Eclipse. 

```java
Mahasiswa m = new Mahasiswa();
g. <-- Ctrl-Spasi autocomplete, keluar pilihan setNama, setTanggalLahir, dsb
```

Lebih gampang mana dipahami daripada seperti ini

```java
String[] m = new String[3];
m <-- gak bisa Ctrl-Spasi, gak keluar pilihan apa-apa
```

Kalau seandainya ada programmer baru masuk, lebih besar mana kemungkinan melakukan kesalahan ini

```java
m.setNama(req.getParameter("jenis"));
```

atau ini

```
m[0] = req.getParameter("tanggal");
```

## Tidak bisa menggunakan library pihak ketiga ##

Semua baris untuk set nilai di `SimpanMahasiswaServlet` itu bisa diotomasi pakai Spring MVC. Semua baris untuk get isinya dan simpan ke db di `MahasiswaDao` bisa diotomasi pakai Hibernate. 

Bila suatu saat kita ingin konversi objek `Mahasiswa` menjadi JSON, kita bisa dengan mudah melakukan ini

```
Mahasiswa m = new Mahasiswa();

// isi nama, tanggal lahir, jenis kelamin

ObjectMapper om = new ObjectMapper();
String json = om.writeValue(m);
```

Nah, coba lakukan hal di atas pakai array. Mana bisa?

Hal yang sama berlaku kalau mau konversi ke XML menggunakan JAXB.

## Menyia-nyiakan fitur yang sudah disediakan ##

Kalau kita bikin class Mahasiswa, kita bisa bikin nama itu String, jenis kelamin Enum, tanggal lahir Date. Dengan pakai tipe data, kalau salah entri langsung ketahuan error pada saat ngetik source code. Kalau gak pake itu, pas dijalanin baru ketahuan. 

Sebagai contoh, error ini langsung ketahuan di Eclipse/Netbeans, atau pada waktu compile (kalau pakai Notepad++)

```java
Mahasiswa m = new Mahasiswa();

// bakalan error karena tipe data tanggalLahir adalah Date, bukan String
m.setTanggalLahir(req.getParameter("nama"));
```

Kalau pakai array, tidak akan ketahuan

```java
String[] m = new String[3];

// gak error karena sama-sama String
m[1] = req.getParameter("nama");
```

## Kesimpulan ##

Prioritas utama dalam menulis kode program adalah sebagai berikut:

1. Benar (correctness)
2. Mudah dipahami (readability)
3. Mudah dikembangkan (maintainability)
4. Performance

Nah, jadi jangan pagi-pagi udah mikir performance dengan mengorbankan 3 hal diatasnya ya ;)
