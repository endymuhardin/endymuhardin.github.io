---
layout: post
title: "Mendapatkan Informasi System dengan Java"
date: 2013-10-29 09:52
comments: true
categories: 
- java
---

Pada salah satu project yang sedang saya kerjakan, ada kebutuhan untuk mendapatkan informasi mengenai sistem dimana aplikasi diinstal. Informasi yang dibutuhkan antara lain:

* Sistem Operasi
* Kapasitas Memori
* Kapasitas Disk
* Jumlah Network Interface
* MAC Address dari masing-masing Network Interface

Dalam artikel ini, kita akan membahas cara mendapatkan berbagai informasi tersebut. Seperti biasa, kode program bisa diambil di [repository Github saya](https://github.com/endymuhardin/belajar-java-sysinfo).

<!--more-->

## Sistem Operasi ##

Informasi tentang Sistem Operasi dapat diperoleh dengan menggunakan class java.lang.System. Dari class ini kita bisa menggunakan method getProperty yang berisi berbagai informasi tentang sistem. Daftar property yang tersedia dapat dilihat di [halaman dokumentasinya](http://docs.oracle.com/javase/7/docs/api/java/lang/System.html#getProperties(\)). Property yang berkaitan dengan sistem operasi adalah:

* os.name
* os.version
* os.arch

Berikut contoh penggunaannya

```java
String os = System.getProperty("os.name");
os += ":" + System.getProperty("os.version");
os += ":" + System.getProperty("os.arch");

System.out.println(os);
```

Di laptop saya, outputnya seperti ini:

```
Linux:3.11.0-12-generic:amd64
```

## Kapasitas Memori ##

Aplikasi Java berjalan di atas JVM, tidak langsung di atas sistem operasi. Untuk urusan memori, ada dua jenis memori yang kita kenal, yaitu memori yang disediakan untuk JVM dan memori yang tersedia di komputer (RAM). Hal ini sering menimbulkan kebingungan di programmer Java pemula, yaitu

> Komputer saya RAM-nya 8 GB, kenapa aplikasi Java saya cuma bisa pakai 2 GB?

Biasanya penyebabnya adalah karena memori yang dialokasikan untuk JVM hanya 2 GB.

### Memori Fisik (RAM) ###

Untuk mendapatkan informasi tentang memori fisik yang tersedia, kita gunakan class `com.sun.management.OperatingSystemMXBean`. Berikut cara mendapatkan object dari class tersebut.

```java
OperatingSystemMXBean osBean 
    = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
```

Setelah itu, kita bisa gunakan untuk mendapatkan informasi memori sebagai berikut

```java
Long memory = osBean.getTotalPhysicalMemorySize();
```

Dokumentasi lengkap dari class tersebut bisa dibaca [di sini](http://docs.oracle.com/javase/7/docs/jre/api/management/extension/com/sun/management/OperatingSystemMXBean.html).

### Memori JVM ###

Ada dua variabel yang menginformasikan memori JVM, yaitu memori yang dialokasikan, dan memori yang terpakai. Aplikasi kita boleh menggunakan memori maksimal sebanyak yang dialokasikan. Tapi aplikasi belum tentu menggunakan semuanya, hanya sebagian saja yang terpakai. Informasi memori JVM bisa didapatkan dari class `java.lang.Runtime`.

Berikut cara untuk mendapatkan memori yang dialokasikan untuk JVM

```java
Long totalMemory = Runtime.getRuntime().totalMemory();
```

Sedangkan untuk mendapatkan memori terpakai, kita kurangi `totalMemory` dengan `freeMemory` (memori yang tidak terpakai)

```java
Long freeMemory = Runtime.getRuntime().freeMemory();
Long terpakai = totalMemory - freeMemory;
```

Lebih lengkapnya bisa dilihat langsung di [dokumentasi class `Runtime`](http://docs.oracle.com/javase/7/docs/api/java/lang/Runtime.html#totalMemory(\))

## Kapasitas Storage ##

Informasi tentang storage bisa didapatkan di class `java.io.File`. Pertama, kita buat dulu objek `File` yang mengarah ke partisi yang ingin kita ketahui informasinya. 

Untuk Windows, gunakan `C:`, `D:`, dan seterusnya. 

```java
File f = new File("C:");
```

Untuk Linux, gunakan `/`, `/home`, dan sebagainya.

```java
File f = new File("/home");
```

Ada beberapa method yang disediakan yaitu:

* totalSpace() : kapasitas storage
* usableSpace() : kapasitas yang bisa digunakan
* freeSpace() : ruang kosong

Kita tentu bertanya-tanya, apa bedanya `usable` dan `free`? Free adalah ruang yang tidak terpakai, tapi belum tentu boleh dipakai karena masalah permission, ijin akses, dan sebagainya. Usable adalah ruang yang boleh dipakai. Kadang-kadang, nilai `usable` sama dengan nilai `free`. Penjelasannya bisa dibaca [di sini](http://docs.oracle.com/javase/7/docs/api/java/io/File.html#getUsableSpace()).

Cara pakainya tidak sulit.

```java
Long totalSpace = f.getTotalSpace();
Long usableSpace = f.getUsableSpace();
Long freeSpace = f.getFreeSpace();
```

## Network Interface ##

Informasi tentang network interface bisa didapatkan di `java.net.NetworkInterface`. Pertama, kita dapatkan dulu seluruh interface yang ada di komputer. Satu komputer (apalagi server) biasa memiliki lebih dari satu interface. Laptop saja biasanya punya dua, ethernet dan wifi.

```java
Enumeration<NetworkInterface> semuaInterface = NetworkInterface.getNetworkInterfaces();
```

Setelah itu, kita bisa melakukan loop untuk mendapatkan jumlah interface, nama interface, dan MAC addressnya.

```java
Integer jumlah = 0;
while(semuaInterface.hasMoreElements()){
    NetworkInterface ni = semuaInterface.nextElement();
    System.out.println("Nama Interface : "+ni.getDisplayName());
    byte[] mac = ni.getHardwareAddress();
    if(mac != null){
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < mac.length; i++) {
                sb.append(String.format("%02X%s", mac[i], (i < mac.length - 1) ? "-" : ""));		
        }
        System.out.println("MAC Address : "+sb.toString());
    }
    jumlah++;
}
System.out.println("Jumlah interface : "+jumlah);
```

Demikianlah cara mendapatkan informasi tentang sistem tempat aplikasi Java kita dijalankan.
