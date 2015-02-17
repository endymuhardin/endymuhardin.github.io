---
layout: post
title: "Tips Meletakkan File Konfigurasi Aplikasi"
date: 2014-09-08 14:00
comments: true
categories: 
- java
---

Dalam membuat aplikasi, biasanya ada nilai variabel yang ingin kita simpan di file konfigurasi, supaya pada saat isinya berubah tidak perlu melakukan kompilasi ulang. Misalnya konfigurasi koneksi database. Alamat database server, username, dan password biasanya sering berubah, tergantung tempat di mana aplikasi dideploy.

Ada beberapa hal yang biasanya menjadi pertanyaan, yaitu:

1. Di mana sebaiknya kita menyimpan file tersebut?
2. Bagaimana caranya supaya aplikasi kita portable? Portable artinya bisa dicopy paste ke berbagai komputer dengan lokasi folder berbeda-beda.
3. Bagaimana cara membaca file konfigurasi tersebut?

Pertanyaan ini diajukan salah satu member di grup [Netbeans Indonesia](https://www.facebook.com/groups/netbeans.id/?fref=nf)

Berikut screenshot kode program yang sudah dia buat

![Foto](https://lh4.googleusercontent.com/-5j9PxOw3oUM/VA1UZR2oPRI/AAAAAAAAGpM/FxnUMInN8ME/w660-h312-no/error-load-file.jpg)

<!--more-->

## Lokasi File Konfigurasi ##

Kita jawab dulu tentang tempat menaruh file konfigurasi. Ada tiga lokasi utama yang umum digunakan orang, yaitu:

* folder konfigurasi global. Kalau di Linux biasanya di folder `/etc`. Di Windows biasanya dalam folder `system32`. Konfigurasi yang disimpan di sini biasanya berlaku global dalam satu komputer. Nilainya terlihat dan digunakan oleh semua user komputer.

* folder tempat aplikasi terinstal. Di Linux orang biasanya menginstal aplikasi di `/opt`, `/usr/local`, atau di home foldernya. Di Windows biasanya dalam `C:\Program Files`

* folder home masing-masing user. Di Linux biasanya `/home/namauser`, misalnya `/home/endy`. Di Windows, tergantung versinya. Windows 7 ke atas ada di `C:\Users\namauser`. Windows XP ada di `C:\Documents and Settings\namauser`


> Wuah banyak sekali.. Lalu kita pilih yang mana?

[Aplikasi yang baik](http://software.endy.muhardin.com/manajemen/aplikasi-prakarya-vs-aplikasi-production/), menggunakan tiga-tiganya dengan urutan prioritas yang berbeda-beda. Pertama dia akan mencari ke folder konfigurasi global. Kalau ada, maka nilainya akan digunakan. Selanjutnya, dia lihat ke folder tempat aplikasi terinstal. Terakhir, baru dia lihat ke folder home usernya.

> Lalu bagaimana kalau di ketiga tempat konfigurasi diisi dengan nilai berbeda?

Misalnya username database, nilainya terisi di ketiga tempat tersebut. Username mana yang dipakai aplikasi? 

Kebiasaan yang berlaku adalah, yang lebih spesifik lebih diutamakan daripada yang umum. Dalam hal ini, setting username di home lebih menang daripada setting username di folder aplikasi. Bila ada setting username di folder aplikasi dan folder konfigurasi global, maka yang dipakai adalah yang di folder aplikasi.

## Cara Membaca Konfigurasi ##

Karena ada tiga tempat:

* folder global
* folder instalasi
* folder home

Maka cara membacanya juga berbeda-beda. Sebagai ilustrasi, misalnya nama filenya sama, yaitu `config.txt`. Cuma lokasinya saja yang berbeda.

### Folder Global ###

Folder global biasanya sama antar komputer. Dia hanya akan berbeda kalau sistem operasinya berbeda (Windows vs Linux). Tapi dalam sesama sistem operasi, biasanya tetap sama, misalnya folder `/etc` ada di seluruh Linux. Demikian juga dengan folder `C:\Windows\System32`.

Karena nama foldernya sama, kita bisa langsung load menggunakan absolute path seperti ini

```java
File konfig = new File("/etc/config.txt");
```

atau di Windows

```java
File konfig = new File("C:\\Windows\\System32\\config.txt");
```

Jangan lupa menggunakan escape character, karena karakter backslash (\\) memiliki arti khusus.

### Folder Aplikasi ###

Kalau di Java, biasanya file konfigurasi akan disimpan di dalam file jar atau dalam folder yang terdaftar dalam `CLASSPATH` seperti misalnya `WEB-INF/classes` dalam aplikasi web.

Folder atau jar yang terdaftar dalam CLASSPATH memiliki keistimewaan, yaitu bisa diakses dengan mengacu pada class yang memanggilnya. Misalnya kita memiliki deklarasi class seperti ini

```java
package belajar.java;

public class BacaKonfig {
    public static void main(String[] xx){
        
    }
}
```

Bila file `config.txt` ada dalam folder `belajar` dalam jar atau CLASSPATH, maka kita bisa akses sebagai berikut

```java
package belajar.java;

public class BacaKonfig {
    public static void main(String[] xx){
        InputStream konfig = BacaKonfig.class.getResourceAsStream("/belajar/config.txt");
    }
}
```

Dengan method `getResourceAsStream`, di manapun lokasi file atau foldernya tidak masalah. Yang penting terdaftar dalam CLASSPATH. Metode ini biasa saya gunakan untuk membaca file-file template cetakan dan laporan (misalnya file jrxml-nya Jasper Report).

### Folder Home ###

Sebagai ilustrasi, file `config.txt` kita taruh dalam folder aplikasi dalam home user. Di Linux ini artinya `/home/endy/aplikasi-saya/config.txt`. Di Windows 7 namanya adalah `C:\Users\endy\aplikasi-saya\config.txt`.

Untuk membaca file tersebut, pertama kita harus dapatkan dulu lokasi sebenarnya dari home user

```java
String lokasiHome = System.getProperty("user.home");
```

Setelah itu, baru kita load filenya. Pastikan kita menggunakan konstanta `File.separator` untuk mengatasi perbedaan separator folder di Linux (`/`) dan Windows (`\`).

```java
File konfig = new File(lokasiHome + File.separator + "config.txt");
```

## Kesimpulan ##

Demikianlah _best-practices_ dalam menaruh dan membaca file konfigurasi. Jangan lupa tujuan utamanya adalah supaya aplikasi kita portable (bisa berjalan di berbagai kondisi dan lokasi). 

Semoga bermanfaat.
