---
layout: post
title: "Scope Variabel"
date: 2014-12-16 15:40
comments: true
categories: 
- java
---

Masih dari [pertanyaan di grup Facebook](https://www.facebook.com/groups/ForumJavaIndonesia/10152533869543017), berikut kode programnya (saya edit sedikit supaya sesuai)

## Alternatif Pertama ##

```java
public class CobaPertama (){
        String a;
        public void coba1(){
                a = "ari";
                System.out.println(a);
        }
        public void coba2(){
                a = "ira";
                System.out.println(a);
        }
}
```
 
## Alternatif Kedua ##

```java
public class CobaKedua (){
        public void coba1(){
                String a = "ari";
                System.out.println(a);
        }
        public void coba2(){
                String a = "ira";
                System.out.println(a);
        }
}
```

Pertanyaannya sebagai berikut
> lebih cepatan mana y masta performance aplikasi yg entar kt buat

<!--more-->

Seperti pada [posting saya sebelumnya](http://software.endy.muhardin.com/java/mengapa-kita-membuat-class/), urusan performance itu belakangan, setelah _correctness_, _readability_, dan _maintainability_.

Kode program pada alternatif pertama salah, seharusnya deklarasi dilakukan dalam scope sekecil mungkin. Apa maksudnya?

Variabel adalah tempat penyimpanan data. Berikut statement yang biasa kita gunakan untuk membuat variabel.

```java
String a = "ari";
```

Statement di atas akan:

1. Booking tempat di memori untuk data bertipe String
2. Mengisi tempat tersebut dengan data bernilai `ari`

Dalam bahasa teknis, statement di atas terdiri dari dua hal:

1. Deklarasi
2. Inisialisasi

Sehingga statement di atas bisa dipecah menjadi seperti ini:

```java
String a;
```

dan 

```java
a = "ari";
```

Deklarasi variabel menentukan umur(lifetime) dan visibility(scope) variabel.

### Umur Variabel ###

Di bahasa pemrograman modern, penggunaan memori sudah dikelola secara otomatis oleh virtual machine. Ini berlaku untuk bahasa yang jalan di VM seperti Java, PHP, Ruby, Python, C#, VB.net. Ini **tidak** berlaku di bahasa C/C++ di mana kita harus mengelola sendiri penggunaan memori. Bahasa pemrograman yang jalan di atas VM disebut dengan istilah [_managed code_ atau _managed_language_](http://en.wikipedia.org/wiki/Managed_code).

Di _managed language_, variabel yang sudah tidak terpakai akan dibersihkan dari memori, supaya tempatnya bisa dipakai oleh variabel lainnya. Proses bersih-bersih ini disebut dengan istilah [_Garbage Collection_](http://en.wikipedia.org/wiki/Garbage_collection_%28computer_science%29). Salah satu pedoman yang digunakan oleh garbage collector untuk membersihkan variabel adalah umur variabel tersebut.

Sebagai ilustrasi tentang umur variabel, lihat kembali ke kode program di atas. Kita akan membuat kode program yang menggunakan class `CobaPertama`

```java
public class HaloSatu {
    public static void main(String[] x){
        CobaPertama cp = new CobaPertama();
        
        cp.coba1();
        
        // 1000 baris melakukan hal yang lain
        
        cp.coba2();
        
        // 2000 baris melakukan hal lain
        
        System.exit(0); // selesai
    }
}
```

Pada kode program di atas, VM akan menyediakan tempat untuk variabel `a` pada baris ini

```java
CobaPertama cp = new CobaPertama();
```

karena variabel `a` dideklarasikan di dalam class.

Variabel `a` akan terus hidup selama object `cp` hidup. Sehingga tempat yang digunakan variabel `a` tidak bisa digunakan oleh variabel lain, sampai `System.exit(0);` dijalankan.

Ini tentu tidak efisien, karena sebetulnya variabel `a` hanya digunakan di baris

```java
cp.coba1();
```

dan 

```java
cp.coba2();
```

Bandingkan dengan kode program berikut

```java
public class HaloDua {
    public static void main(String[] x){
        CobaKedua ck = new CobaKedua();
        
        ck.coba1();
        
        // 1000 baris melakukan hal yang lain
        
        ck.coba2();
        
        // 2000 baris melakukan hal lain
        
        System.exit(0); // selesai
    }
}
```

Variabel `a` baru akan disediakan tempat pada waktu `ck.coba1()` dijalankan. Dan tempatnya segera bebas untuk bisa digunakan variabel lain sepanjang 1000 baris berikut. VM baru akan membuatkan tempat lagi di perintah `ck.coba2()`, untuk kemudian segera dibebaskan dan dapat dipakai orang lain sampai akhir program.

Nah, lebih efisien kan? Buat apa booking tempat kalau tidak dipakai? Semakin banyak tempat yang dibooking, semakin tinggi konsumsi memori yang dibutuhkan aplikasi kita.

## Visibility / Scope ##

Deklarasi variabel menentukan di mana variabel tersebut bisa digunakan (dilihat), atau dalam istilah lain juga disebut dengan scope variabel. Mari kita tambahkan method di class CobaKedua

```java
public class CobaKedua (){
        public void coba1(){
                String a = "ari";
                System.out.println(a);
        }
        public void coba2(){
                String a = "ira";
                System.out.println(a);
        }
        public void coba3(){
                Integer x = 7;
                System.out.println(a);
        }
}
```

Kode program di atas akan menimbulkan error pada saat dicompile. Kenapa demikian?

Error terjadi karena `System.out.println(a)` dalam method `coba3` tidak bisa melihat variabel `a`. Dia hanya bisa melihat variabel `x`. Ini terjadi karena variabel `a` dideklarasikan di luar scope method `coba3`, sehingga dia `invisible` di dalam method `coba3`.

Jadi, lokasi di mana kita mendeklarasikan variabel bukan ditentukan oleh pertimbangan performance, melainkan di mana variabel tersebut mau kita pakai. Walaupun deklarasi dalam method lebih irit memori, tapi tetap saja tidak bisa dipakai karena tidak terlihat di dalam method `coba3`.

## Kesimpulan ##

Jadi, untuk urusan deklarasi variabel ini, tidak pada tempatnya kalau kita mempertimbangkan masalah performance. Deklarasi variabel ditentukan oleh baris kode mana yang mau menggunakannya. Seperti pada contoh di atas, bila dia mau digunakan di method `coba1` dan `coba2`, maka tidak ada pilihan selain mendeklarasikannya sejajar dengan kedua method tersebut, seperti pada class `CobaPertama`.

Tapi kalau hanya ingin digunakan di dalam satu method saja, cukup deklarasikan sejajar dengan kode program yang menggunakannya.

Sebagai panduan umum, berikut aturan yang biasa saya gunakan

> Deklarasikan variabel dalam scope se-sempit mungkin

Dengan demikian, variabel kita tidak booking tempat lebih dari yang dibutuhkan. Sehingga aplikasi kita tidak boros memori.

