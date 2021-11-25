---
layout: post
title: "Instalasi Netbeans di MacOS"
date: 2021-11-25 08:05
comments: true
categories: 
- java
---

Sebetulnya di tahun 2021 ini, saya sudah lama tidak menggunakan Netbeans. Terakhir pakai di versi 8, dan sekarang sudah versi 11. Tapi ya apa boleh buat, ada client yang pengen pakai ini dan tanya bagaimana caranya. Dengan semangat `maju tak gentar membela yang bayar`, baiklah mari kita install.

Biasanya, instalasi Netbeans tinggal next-next saja sampai finish. Tapi karena Java di laptop saya diinstal menggunakan [SDKMAN](https://sdkman.io), maka installernya Netbeans macet dengan pesan error berikut ini

<!--more-->

[![Instalasi Netbeans Error]({{site.url}}/images/uploads/2021/netbeans-install-macos/01-netbeans-install-error.png)]({{site.url}}/images/uploads/2021/netbeans-install-macos/01-netbeans-install-error.png)

Error di atas disebabkan karena lokasi instalasi Java dihardcode di dalam installer. Untuk mengatasinya, kita perlu mengedit satu file dalam installer. Pertama, kita extract dulu installernya dengan perintah berikut ini

```
pkgutil --expand Apache\ NetBeans\ 12.5.pkg pkg-extract
```

Setelah itu, kita cari file Distribution di folder yang sudah diextract

[![Extract Installer]({{site.url}}/images/uploads/2021/netbeans-install-macos/03-hasil-extract.png)]({{site.url}}/images/uploads/2021/netbeans-install-macos/03-hasil-extract.png)


Cari baris yang melakukan pengecekan versi Java seperti ini

```
function checkSystem() {
	var java_result = checkJavaVersion();
        
        if (!java_result) {
            return java_result;
        }
        
        var mem_result = checkMemsize();
        
        return mem_result;
}
```

Langsung saja kita hardcode menjadi `true`

```
function checkSystem() {
	var java_result = true;
        
        if (!java_result) {
            return java_result;
        }
        
        var mem_result = checkMemsize();
        
        return mem_result;
}
```

Setelah itu kita bungkus kembali menjadi installer.

```
pkgutil --flatten pkg-extract netbeans-installer-fixed.pkg
```

Hasilnya seperti ini

[![Extract Installer]({{site.url}}/images/uploads/2021/netbeans-install-macos/04-repackage-installer.png)]({{site.url}}/images/uploads/2021/netbeans-install-macos/04-repackage-installer.png)

Kita bisa coba install kembali dengan paket installer yang sudah kita perbaiki. Bisa dengan cara dobel-klik, atau bisa juga menggunakan command line sebagai berikut

```
/usr/bin/sudo -E -- /usr/bin/env LOGNAME=endymuhardin USER=endymuhardin USERNAME=endymuhardin /usr/sbin/installer -pkg netbeans-installer-fixed.pkg -target /
```

Pada saat dijalankan, hasilnya masih error, seperti ini

[![Installer masih error]({{site.url}}/images/uploads/2021/netbeans-install-macos/05-install-masih-error.png)]({{site.url}}/images/uploads/2021/netbeans-install-macos/05-install-masih-error.png)

Walaupun gagal, akan tetapi filenya sudah berhasil ter-extract di folder `/Applications`. Kita bisa buka isi aplikasinya dengan klik kanan, kemudian pilih `Show Package Contents`

[![Show Package Content]({{site.url}}/images/uploads/2021/netbeans-install-macos/06-show-package-content.png)]({{site.url}}/images/uploads/2021/netbeans-install-macos/06-show-package-content.png)


Ada satu file lagi yang perlu kita edit, yaitu file `netbeans.conf`

[![Edit netbeans.conf]({{site.url}}/images/uploads/2021/netbeans-install-macos/07-edit-netbeans-conf.png)]({{site.url}}/images/uploads/2021/netbeans-install-macos/07-edit-netbeans-conf.png)

File ini tidak bisa kita edit secara langsung, karena lokasinya di folder terproteksi. Oleh karena itu, copy dulu ke lokasi lain, baru diedit. Ubah isi `netbeans_jdkhome` menjadi sebagai berikut

```
netbeans_jdkhome="/Users/endymuhardin/.sdkman/candidates/java/current"
```

Jangan lupa menghapus karakter `#` di awal baris. Setelah diedit, copy balik filenya ke lokasi semula.

Selanjutnya, kita bisa menjalankan aplikasi Netbeans seperti biasa. Kita juga bisa mengganti versi Java SDK ke versi 11 dengan SDKMAN. Lihat dulu versi java yang tersedia

```
sdk list java
```

Outputnya seperti ini

```
================================================================================
Available Java Versions
================================================================================
 Vendor        | Use | Version      | Dist    | Status     | Identifier
--------------------------------------------------------------------------------
 Corretto      |     | 17.0.1.12.1  | amzn    |            | 17.0.1.12.1-amzn    
               |     | 17.0.0.35.2  | amzn    |            | 17.0.0.35.2-amzn    
 Java.net      |     | 18.ea.24     | open    |            | 18.ea.24-open       
               |     | 18.ea.5.lm   | open    |            | 18.ea.5.lm-open     
               |     | 17           | open    |            | 17-open             
               |     | 17.0.1       | open    |            | 17.0.1-open         
 Liberica      |     | 17.0.1.fx    | librca  |            | 17.0.1.fx-librca    
               |     | 17.0.1       | librca  |            | 17.0.1-librca       
               |     | 17.0.0.fx    | librca  |            | 17.0.0.fx-librca    
               |     | 17.0.0       | librca  |            | 17.0.0-librca       
               |     | 16.0.2       | librca  |            | 16.0.2-librca       
               |     | 11.0.13      | librca  |            | 11.0.13-librca      
               |     | 11.0.12      | librca  |            | 11.0.12-librca      
               |     | 8.0.312      | librca  |            | 8.0.312-librca      
               |     | 8.0.302      | librca  |            | 8.0.302-librca      
 Microsoft     |     | 17.0.1       | ms      |            | 17.0.1-ms           
               |     | 17.0.0       | ms      |            | 17.0.0-ms           
               |     | 16.0.2.7.1   | ms      |            | 16.0.2.7.1-ms       
 Oracle        |     | 17.0.1       | oracle  |            | 17.0.1-oracle       
               |     | 17.0.0       | oracle  |            | 17.0.0-oracle       
 SapMachine    |     | 17           | sapmchn |            | 17-sapmchn          
               |     | 17.0.1       | sapmchn |            | 17.0.1-sapmchn      
 Temurin       |     | 17.0.1       | tem     |            | 17.0.1-tem          
               |     | 17.0.0       | tem     |            | 17.0.0-tem          
 Zulu          |     | 17.0.1       | zulu    |            | 17.0.1-zulu         
               |     | 17.0.1.fx    | zulu    |            | 17.0.1.fx-zulu      
               |     | 17.0.0       | zulu    |            | 17.0.0-zulu         
               |     | 17.0.0.fx    | zulu    |            | 17.0.0.fx-zulu      
               |     | 16.0.2       | zulu    |            | 16.0.2-zulu         
               |     | 11.0.13      | zulu    |            | 11.0.13-zulu        
               |     | 11.0.12      | zulu    | installed  | 11.0.12-zulu          
               |     | 11.0.11      | zulu    | local only | 11.0.11-zulu        
               | >>> | 8.0.312      | zulu    | installed  | 8.0.312-zulu        
               |     | 8.0.302      | zulu    |            | 8.0.302-zulu        
               |     | 8.0.282      | zulu    | local only | 8.0.282-zulu        
================================================================================
Omit Identifier to install default version 17.0.1-tem:
    $ sdk install java
Use TAB completion to discover available versions
    $ sdk install java [TAB]
Or install a specific version by Identifier:
    $ sdk install java 17.0.1-tem
Hit Q to exit this list view
================================================================================
```

Kita bisa pindah ke Java 11 dengan perintah berikut

```
sdk default java 11.0.12-zulu
```

Outputnya

```
Default java version set to 11.0.12-zulu
```

Kemudian kita bisa restart Netbeans agar menggunakan Java 11.

Demikianlah sekilas info tentang cara instalasi Netbeans. Mudah-mudahan developer Netbeans segera insyaf dan bertobat atas kesalahan kode program installer ini.