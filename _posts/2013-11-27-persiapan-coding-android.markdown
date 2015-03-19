---
layout: post
title: "Persiapan Coding Android"
date: 2013-11-27 15:04
comments: true
categories: 
- android
---

Jaman sekarang ini, hidup orang sudah berpindah ke smartphone. PC sudah ditinggalkan, laptop juga semakin mengecil porsi pemakaiannya. Sebagai programmer, kitapun harus ikut menyesuaikan skill agar bisa ikut membuat aplikasi mobile.

Hal pertama yang kita lakukan sebelum mulai coding tentunya adalah mempersiapkan persenjataan. Dalam artikel ini, kita akan membahas persiapan yang perlu dilakukan untuk memulai membuat aplikasi Android.

Sesuai [prinsip Lan-Na-Zha](http://software.endy.muhardin.com/life/lan-na-zha/), yang dibahas di sini adalah dasar-dasar pemrograman Android. Supaya bisa paham, kita tidak akan menggunakan alat bantu yang disediakan IDE. Kita akan lakukan dengan command line dan text editor.

<!--more-->

Secara garis besar, berikut ini adalah hal-hal yang perlu kita siapkan:

1. Instalasi Java dan Maven. Caranya bisa dibaca [di artikel ini](http://software.endy.muhardin.com/java/persiapan-coding-java/).
2. Instalasi [Android SDK](http://developer.android.com/sdk/index.html)
3. Instalasi IDE. Ada dua pilihan di sini: [Eclipse ADT](http://developer.android.com/sdk/index.html) atau [Android Studio](http://developer.android.com/sdk/installing/studio.html) yang berbasis IntelliJ IDEA.

Sebelum bisa digunakan, ada beberapa hal yang perlu kita lakukan agar persenjataan tersebut siap dipakai:

1. [Konfigurasi `environment variable`](#environment-variable-android-sdk)
2. [Update Android SDK](#update-android-sdk)
3. [Konfigurasi repository Maven](#konfigurasi-repository-maven-android)

Setelah semua dilakukan, kita bisa coba membuat project Hello World:

1. [Create Android Project](#create-project-android)
2. [Konversi Android Project menjadi Maven Project](#konversi-project-android-maven)
3. Buka project di IDE
4. Modifikasi sedikit
5. [Deploy di emulator](#deploy-emulator)
6. [Deploy di handset](#deploy-handset)

<a name="struktur-project-android"></a>
## Struktur Project Android ##

Sebelum masuk ke teknis coding, kita pahami dulu beberapa konsep. Dalam project Java biasa, kita mengenal ada beberapa _build-tools_ yang umum digunakan orang, diantaranya:

* Format bebas
* Ant
* Maven
* Gradle

_Build-tools_ ini akan menentukan bagaimana struktur folder dan penempatan file-file di dalamnya. Ini yang kita sebut dengan struktur project. Selain yang ditentukan oleh _build-tools_ ada juga struktur project yang ditentukan oleh IDE yang digunakan, misalnya format project:

* Eclipse
* Netbeans
* IntelliJ IDEA

Hal ini juga terjadi di aplikasi Android. Setidaknya ada tiga jenis struktur project:

* Maven Project
* Eclipse ADT
* Android Studio (berbasis Gradle)

> Kenapa kita pusingkan hal ini?

Saya biasanya tidak mau terikat ke salah satu IDE saja. Contohnya, bila kita _Create New Project_ dengan Eclipse, belum tentu bisa dibuka dengan sempurna di Netbeans. Begitu juga sebaliknya. 

Agar lebih fleksibel, saya mencari format project yang universal, bisa dikenali dan dibuka dengan baik di semua IDE. Bahkan juga bisa diedit menggunakan text editor. Untuk itu kita pilih _Maven_, karena didukung oleh semua IDE yang ada di dunia.

Pemilihan _build-tools_ akan menentukan struktur project, dan pada akhirnya menentukan cara kerja tim dalam membuat aplikasi. Dengan menggunakan Maven, kita mendapatkan keuntungan sebagai berikut:

* portability: Semua orang bisa download source code, kemudian buka di IDE apapun yang dia suka menggunakan sistem operasi apapun yang dia suka. 
* Setting laptop masing-masing bebas, tidak seperti struktur project Netbeans atau Eclipse yang mengharuskan anggota tim sepakat dimana lokasi file `jar` yang dibutuhkan (akan lebih sulit kalau ada yang pakai Linux dan ada yang pakai Windows).
* File `jar` yang dibutuhkan tidak harus dicommit bersama source code. Jadi repository Git kita hanya berisi source code saja, tidak dikotori file-file dependensi

## Instalasi Aplikasi ##

Ada beberapa hal yang kita butuhkan di sini:

* Android SDK
* IDE, boleh pilih Eclipse ADT ataupun Android Studio. Bebas saja

Instalasi Java SDK dan Maven bisa dilihat [di artikel ini](http://software.endy.muhardin.com/java/persiapan-coding-java/). Android SDK, dan IDE manapun juga tidak dibahas instalasinya, karena cukup di_extract_ saja file `zip`nya sudah selesai ;)

## Konfigurasi dan Update ##


<a name="environment-variable-android-sdk"></a>
### Environment Variable ###

Kita perlu membuat environment variable baru sebagai berikut:

* `ANDROID_HOME` : lokasi extract Android SDK

Dan mengedit environment variable bernama `PATH`. Tambahkan:

* `ANDROID_HOME/tools` dan `ANDROID_HOME/platform-tools`

Di Ubuntu, buat file `/etc/profile.d/java-env.sh` yang isinya seperti ini

```sh
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
export M2_HOME=/opt/apache-maven-3.2.3
export ANDROID_HOME=/home/endy/Apps/android-sdk-linux

export PATH=$PATH:$JAVA_HOME/bin:$M2_HOME/bin:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

Ganti isi `JAVA_HOME`, `M2_HOME`, dan `ANDROID_HOME` sesuai dengan lokasi di komputer Anda masing-masing.

Setelah itu, restart komputer supaya isi file tersebut dibaca semua aplikasi.

Sekarang kita bahas untuk Windows. Cara mengedit environment variable sama seperti yang dijelaskan di sini.

Buat variabel baru di System Variable untuk `ANDROID_HOME`.

![Foto](http://lh4.googleusercontent.com/-O7f60nY5hdg/UpVtYN-9DGI/AAAAAAAACe8/sKR8b7FLBqE/s600/07.+ANDROID_HOME.png)

Kemudian edit variabel `PATH`. Tambahkan:

```
whatever-isi-path-yang-lama;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools
```

Klik OK untuk menutup semua dialog. Setelah itu kita test. Buka command prompt baru. Kalau sebelumnya sudah membuka command prompt, harus ditutup dulu dan buka yang baru. Jika konfigurasinya benar, kita bisa menjalankan Android SDK Manager dari command prompt seperti ini

![Foto](http://lh6.googleusercontent.com/-rij7T-pjn68/UpVtZ4POW-I/AAAAAAAACfQ/djaLB5KDbwo/s600/10.+Test+Android+SDK.png)

<a name="update-android-sdk"></a>
## Update Android SDK ##

Secara default, Android SDK yang baru saja kita extract hanya menyertakan library terbaru saja, pada waktu artikel ini ditulis versinya `4.4` atau _Kitkat_. 

![Foto](http://lh5.googleusercontent.com/-vczCzhCpYws/UpVjYYmGRKI/AAAAAAAACdg/5p0aXCK_j0k/s600/01.+Android+SDK+Default.png)

Seperti kita lihat pada screenshot, yang statusnya `Installed` cuma versi terakhir saja.

Kita perlu mengunduh library versi lain jika ingin membuat aplikasi yang bisa berjalan di versi tersebut. Misalnya kita ingin aplikasi yang kita buat bisa dijalankan di Android versi _Ice Cream Sandwich (ICS)_, maka kita perlu mengupdate Android SDK agar punya versi tersebut.

Berdasarkan dokumentasi di website resmi Android, kita [cukup menginstal versi terkecil dan terbesar yang mau didukung](http://developer.android.com/training/basics/supporting-devices/platforms.html). Tidak perlu semua versi di antaranya. Sebagai contoh, [versi-versi Android](http://source.android.com/source/build-numbers.html) adalah:

* Donut (1.6)
* Eclair (2.0 - 2.1)
* Froyo (2.2)
* Gingerbread (2.3)
* Honeycomb (3.x)
* Ice Cream Sandwich (4.0)
* Jelly Bean (4.1 - 4.3)
* Kitkat (4.4)

Kalau kita mau mendukung perangkat mulai dari Honeycomb sampai Kitkat, maka kita cukup punya versi `3.0` dan `4.4` saja. Versi `3.0` dikenal juga dengan sebutan `API level 11` dan `4.4` dikenal dengan sebutan `API level 19`.

Selanjutnya, kita centang `API` yang ingin kita instal, kemudian tekan tombol Install Package

![Foto](http://lh3.googleusercontent.com/-fUnAXSB8xes/UpVjYe8lu4I/AAAAAAAACdk/8i7PtYMkJI4/s600/02.+Additional+Package.png)

Paket yang diinstal cukup besar. Dengan koneksi internet saya yang berkecepatan 60 KB/s, butuh waktu 60-90 menit untuk mengunduh versi Honeycomb.

<a name="konfigurasi-repository-maven-android"></a>
## Konfigurasi Repository Maven ##

Penggunaan Maven untuk project Android dimungkinkan dengan plugin [Android Maven Plugin](https://code.google.com/p/maven-android-plugin/). Plugin ini tidak perlu diinstal, karena seperti halnya plugin maven pada umumnya, kita tinggal deklarasikan saja dan Maven akan mengunduhnya dari internet. 

Sebetulnya pluginnya sendiri tidak bermasalah dan bekerja dengan sangat baik. Masalahnya ada di `dependency` untuk library Android. Entah karena sebab apa, `jar` yang kita butuhkan tidak tersedia di [repository Maven Central](http://search.maven.org). Yang ada di sana hanyalah versi lama. Pada waktu artikel ini ditulis, [versi Android terakhir yang tersedia](http://search.maven.org/#search%7Cgav%7C1%7Cg%3A%22com.google.android%22%20AND%20a%3A%22android%22) adalah versi `4.1.1.4`. Padahal kita butuh versi `4.4`.

Untungnya sudah ada solusinya, yaitu [Maven Android SDK Deployer](https://github.com/mosabua/maven-android-sdk-deployer). Cara kerjanya sebagai berikut:

* Kita harus sudah memiliki Android SDK yang sudah terupdate seperti pada langkah sebelumnya
* Maven Android SDK Deployer akan mengkonversi `jar` dalam Android SDK menjadi Maven artifact
* Artifact ini akan diinstal di repository local, yaitu dalam folder `.m2` dalam `home` kita.
* Bila dibutuhkan, kita juga bisa memasangnya di repository kantor (semacam [Nexus](http://www.sonatype.org/nexus/) atau [Artifactory](http://www.jfrog.com/home/v_artifactory_opensource_overview))
* Untuk membedakan dengan yang ada di Maven Central, `groupId` dari `jar` hasil konversi akan diberi nama `android`. Jadi kita harus menyesuaikan dependensi di `pom.xml` kita

Cara pakainya mudah, pertama kita clone dulu dari Github

```
git clone git@github.com:mosabua/maven-android-sdk-deployer.git
```

Masuk ke foldernya

```
cd maven-android-sdk-deployer
```

Install versi Android yang kita inginkan. Misalnya untuk menginstal versi `4.4` (Kitkat)

```
mvn install -P 4.4
```

Kalau sukses, outputnya seperti ini

```
[INFO] ------------------------------------------------------------------------
[INFO] Reactor Summary:
[INFO] 
[INFO] Maven Android SDK Deployer ........................ SUCCESS [0.534s]
[INFO] Android Platforms ................................. SUCCESS [0.006s]
[INFO] Android Platform 4.4 API 19 ....................... SUCCESS [0.463s]
[INFO] Android Add-Ons ................................... SUCCESS [0.006s]
[INFO] Android Add-On Google Platform 4.4 API 19 (Maps and USB)  SUCCESS [0.026s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1.559s
[INFO] Finished at: Tue Nov 26 21:41:56 WIT 2013
[INFO] Final Memory: 13M/211M
[INFO] ------------------------------------------------------------------------
```

Agar bisa dijalankan dengan baik, Maven Android SDK Deployer membutuhkan:

* Environment variable `ANDROID_HOME` seperti yang telah kita konfigurasi di atas
* Android SDK yang sudah diupdate sehingga memiliki versi yang ingin kita instal. Untuk tiap versi yang dibutuhkan, kita harus menginstal

    * SDK Platform
    * Google APIs

Coba perhatikan apa-apa yang saya centang untuk diinstal di screenshot ini

![Foto](http://lh3.googleusercontent.com/-fUnAXSB8xes/UpVjYe8lu4I/AAAAAAAACdk/8i7PtYMkJI4/s600/02.+Additional+Package.png)

Selanjutnya, kita deploy juga Maven artifact untuk versi `3.0` (Honeycomb)

```
mvn install -P 3.0
```

Hasilnya

```
[INFO] Reactor Summary:
[INFO] 
[INFO] Maven Android SDK Deployer ........................ SUCCESS [0.578s]
[INFO] Android Platforms ................................. SUCCESS [0.008s]
[INFO] Android Platform 3.0 API 11 ....................... SUCCESS [0.154s]
[INFO] Android Add-Ons ................................... SUCCESS [0.009s]
[INFO] Android Add-On Google Platform 3.0 API 11 (Maps) .. SUCCESS [0.020s]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 1.313s
[INFO] Finished at: Tue Nov 26 22:22:20 WIT 2013
[INFO] Final Memory: 8M/149M
[INFO] ------------------------------------------------------------------------
```

Persiapan selesai. Selanjutnya kita akan buat project pertama.


<a name="create-project-android"></a>
## Create Android Project ##

Agar tahu cara kerjanya, kita lakukan prosedur _create project_ secara manual menggunakan command line. Berikut perintahnya

```
android create project --target 3 --name AplikasiAndroid \
--path /home/endy/tmp/AplikasiAndroid --activity HelloWorldActivity \
--package com.muhardin.endy.belajar.android
```

Perintah `android create project` ini memerlukan beberapa opsi yaitu:

* target : adalah versi Android yang akan didukung aplikasi kita. [Gunakan versi tertinggi/terbaru](http://developer.android.com/training/basics/firstapp/creating-project.html). Nilai target ini berbeda-beda tergantung versi Android yang sudah terpasang di Android SDK. Untuk mengetahui nilai target yang tersedia, jalankan perintah `android list target`. Hasilnya di laptop saya seperti ini

    ```
    Available Android targets:
    ----------
    id: 1 or "android-11"
         Name: Android 3.0
         Type: Platform
         API level: 11
         Revision: 2
         Skins: WXGA (default)
         ABIs : armeabi
    ----------
    id: 2 or "Google Inc.:Google APIs:11"
         Name: Google APIs
         Type: Add-On
         Vendor: Google Inc.
         Revision: 1
         Description: Android + Google APIs
         Based on Android 3.0 (API level 11)
         Libraries:
          * com.google.android.maps (maps.jar)
              API for Google Maps
         Skins: WXGA (default)
         ABIs : armeabi
    ----------
    id: 3 or "android-19"
         Name: Android 4.4
         Type: Platform
         API level: 19
         Revision: 1
         Skins: WSVGA, WVGA800 (default), WXGA800, QVGA, WQVGA400, WXGA720, WVGA854, HVGA, WXGA800-7in, WQVGA432
         ABIs : armeabi-v7a
    ----------
    id: 4 or "Google Inc.:Google APIs:19"
         Name: Google APIs
         Type: Add-On
         Vendor: Google Inc.
         Revision: 1
         Description: Android + Google APIs
         Based on Android 4.4 (API level 19)
         Libraries:
          * com.google.android.media.effects (effects.jar)
              Collection of video effects
          * com.android.future.usb.accessory (usb.jar)
              API for USB Accessories
          * com.google.android.maps (maps.jar)
              API for Google Maps
         Skins: WVGA854, WQVGA400, WSVGA, WXGA800-7in, WXGA720, HVGA, WQVGA432, QVGA, WVGA800 (default), WXGA800
         ABIs : armeabi-v7a
    ```

* name : Nama aplikasi.
* path : lokasi folder tempat aplikasi akan dibuat.
* activity : Activity yang akan dibuatkan otomatis. Apa itu activity akan kita bahas di artikel lain
* package : `package` untuk meletakkan source code activity yang dibuat. Sama seperti `package` Java pada umumnya.

Berikut output dari `android create project`

```
Created project directory: /home/endy/tmp/AplikasiAndroid
Created directory /home/endy/tmp/AplikasiAndroid/src/com/muhardin/endy/belajar/android
Added file /home/endy/tmp/AplikasiAndroid/src/com/muhardin/endy/belajar/android/HelloWorldActivity.java
Created directory /home/endy/tmp/AplikasiAndroid/res
Created directory /home/endy/tmp/AplikasiAndroid/bin
Created directory /home/endy/tmp/AplikasiAndroid/libs
Created directory /home/endy/tmp/AplikasiAndroid/res/values
Added file /home/endy/tmp/AplikasiAndroid/res/values/strings.xml
Created directory /home/endy/tmp/AplikasiAndroid/res/layout
Added file /home/endy/tmp/AplikasiAndroid/res/layout/main.xml
Created directory /home/endy/tmp/AplikasiAndroid/res/drawable-xhdpi
Created directory /home/endy/tmp/AplikasiAndroid/res/drawable-hdpi
Created directory /home/endy/tmp/AplikasiAndroid/res/drawable-mdpi
Created directory /home/endy/tmp/AplikasiAndroid/res/drawable-ldpi
Added file /home/endy/tmp/AplikasiAndroid/AndroidManifest.xml
Added file /home/endy/tmp/AplikasiAndroid/build.xml
Added file /home/endy/tmp/AplikasiAndroid/proguard-project.txt
```

Masih ingat [penjelasan struktur project di atas](#struktur-project-android)? Project yang dibuatkan Android SDK ini mengikuti struktur Eclipse ADT. Kita perlu mengubahnya menjadi struktur project Maven supaya bisa dibuka di Eclipse ADT maupun Android Studio.

<a name="konversi-project-android-maven"></a>
## Konversi Project Android menjadi Maven ##

Petunjuk lengkapnya [ada di website Android Maven Plugin](https://code.google.com/p/maven-android-plugin/wiki/GettingStarted), di sini saya berikan rangkumannya:

* Buat file `pom.xml`. Kita bisa copy paste dari [contoh `pom.xml` yang disediakan](https://github.com/jayway/maven-android-plugin-samples/blob/master/helloflashlight/pom.xml).

* Hapus file berikut, karena tidak dibutuhkan lagi

    * `build.xml`
    * `ant.properties`
    * `local.properties`

* Sesuaikan dependensi supaya mengarah ke artifact yang [sudah kita install menggunakan Maven Android SDK Deployer](#konfigurasi-repository-maven-android). Berikut dependensi di `pom.xml` saya

```xml
<dependencies>
    <dependency>
        <groupId>android</groupId>
        <artifactId>android</artifactId>
        <version>4.4_r1</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

* Coba build dengan perintah `mvn clean install`. Kalau lancar, berikut outputnya

    ```
[INFO] Installing /home/endy/tmp/AplikasiAndroid/target/aplikasi-android.apk to /home/endy/.m2/repository/com/muhardin/endy/belajar/android/aplikasi-android/1.0.0-SNAPSHOT/aplikasi-android-1.0.0-SNAPSHOT.apk
[INFO] Installing /home/endy/tmp/AplikasiAndroid/pom.xml to /home/endy/.m2/repository/com/muhardin/endy/belajar/android/aplikasi-android/1.0.0-SNAPSHOT/aplikasi-android-1.0.0-SNAPSHOT.pom
[INFO] Installing /home/endy/tmp/AplikasiAndroid/target/aplikasi-android.jar to /home/endy/.m2/repository/com/muhardin/endy/belajar/android/aplikasi-android/1.0.0-SNAPSHOT/aplikasi-android-1.0.0-SNAPSHOT.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 4.426s
[INFO] Finished at: Wed Nov 27 14:31:53 WIT 2013
[INFO] Final Memory: 24M/218M
[INFO] ------------------------------------------------------------------------
     ```

Project kita sudah siap dibuka di IDE. Silahkan dicoba edit dan build lagi.

<a name="deploy-emulator"></a>
## Deploy di Emulator ##

Supaya bisa dideploy di emulator, terlebih dulu kita buat emulatornya di Android SDK. Kita bisa pilih versi Android dan juga ukuran layar yang diinginkan. Jalankan Android SDK, kemudian klik menu `Tools > Manage AVD`

![Foto](http://lh5.googleusercontent.com/-Qv1lsyVMLOY/UpWhzrsreXI/AAAAAAAACfs/BSJ91bvXiI0/s600/03.+Konfigurasi+AVD.png)

Hasilnya bisa dilihat di AVD Manager

![Foto](http://lh4.googleusercontent.com/-0ZCzrMJ58HE/UpWhzuL1sYI/AAAAAAAACfw/uZLHOeki2Kk/s600/04.+AVD+Manager.png)

Pada screenshot di atas, nama emulatornya adalah `Nexus4`. Pemilihan nama bebas saja.

Tambahkan konfigurasi berikut di `pom.xml` untuk mengarahkan deployment ke emulator `Nexus4`

```
<plugin>
    <groupId>com.jayway.maven.plugins.android.generation2</groupId>
    <artifactId>android-maven-plugin</artifactId>
    <configuration>
        <sdk>
            <platform>19</platform>
        </sdk>
        <emulator>
            <avd>Nexus4</avd>
            <wait>30000</wait>
        </emulator>
    </configuration>
</plugin>
```

Konfigurasi yang saya tambahkan adalah blok `<emulator>`. Sisanya disertakan agar pembaca tahu di mana harus meletakkannya.

Selanjutnya, kita bisa jalankan emulator dari Maven dengan perintah `mvn android:emulator-start`. Outputnya seperti ini

```
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building AplikasiAndroid 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- android-maven-plugin:3.8.0:emulator-start (default-cli) @ aplikasi-android ---
[INFO] Android emulator command: ""/home/endy/Coding/adt-bundle-linux-x86_64-20131030/sdk/tools/emulator"" -avd Nexus4 
[INFO] Found 0 devices connected with the Android Debug Bridge
[INFO] Starting android emulator with script: /tmp/android-maven-plugin-emulator-start.sh
[INFO] Waiting for emulator start:30000
[INFO] Emulator is up and running.
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 22.736s
[INFO] Finished at: Wed Nov 27 14:45:13 WIT 2013
[INFO] Final Memory: 14M/217M
[INFO] ------------------------------------------------------------------------
```

Emulator segera aktif. Tunggu sampai dia siap.

![Foto](http://lh4.googleusercontent.com/-2Wg4lTl5IvM/UpWjpNoCAsI/AAAAAAAACgA/9qD6wVry2BQ/s600/05.+Android+Emulator.png)

Kemudian kita bisa deploy menggunakan perintah `mvn android:deploy`. Berikut outputnya

```
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building AplikasiAndroid 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- android-maven-plugin:3.8.0:deploy (default-cli) @ aplikasi-android ---
[INFO] Waiting for initial device list from the Android Debug Bridge
[INFO] Found 1 devices connected with the Android Debug Bridge
[INFO] android.device parameter not set, using all attached devices
[INFO] Emulator emulator-5554_Nexus4_unknown_sdk found.
[INFO] emulator-5554_Nexus4_unknown_sdk :   Successfully installed /home/endy/tmp/AplikasiAndroid/target/aplikasi-android.apk to emulator-5554_Nexus4_unknown_sdk
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 8.010s
[INFO] Finished at: Wed Nov 27 14:48:44 WIT 2013
[INFO] Final Memory: 14M/217M
[INFO] ------------------------------------------------------------------------
```

Aplikasi kita sudah terdeploy dengan sukses di emulator.

![Foto](http://lh3.googleusercontent.com/-EM44OK6A32Y/UpWkehULp1I/AAAAAAAACgQ/TUMZ2MM0XLs/s600/06.+Aplikasi+Terdeploy.png)

Selanjutnya, mari kita coba di handset.

<a name="deploy-handset"></a>
## Deploy di Handset ##

Handset harus diaktifkan dulu mode developmentnya.
Setelah itu, cukup tancapkan handset melalui USB, lalu jalankan lagi `mvn android:deploy`. Berikut outputnya

```
[INFO] Scanning for projects...
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] Building AplikasiAndroid 1.0.0-SNAPSHOT
[INFO] ------------------------------------------------------------------------
[INFO] 
[INFO] --- android-maven-plugin:3.8.0:deploy (default-cli) @ aplikasi-android ---
[INFO] Waiting for initial device list from the Android Debug Bridge
[INFO] Found 2 devices connected with the Android Debug Bridge
[INFO] android.device parameter not set, using all attached devices
[INFO] Emulator emulator-5554_Nexus4_unknown_sdk found.
[INFO] Device 464119f3ba5d14c_samsung_SPH-D710 found.
[INFO] 464119f3ba5d14c_samsung_SPH-D710 :   Successfully installed /home/endy/tmp/AplikasiAndroid/target/aplikasi-android.apk to 464119f3ba5d14c_samsung_SPH-D710
[INFO] emulator-5554_Nexus4_unknown_sdk :   Successfully installed /home/endy/tmp/AplikasiAndroid/target/aplikasi-android.apk to emulator-5554_Nexus4_unknown_sdk
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 10.044s
[INFO] Finished at: Wed Nov 27 14:59:40 WIT 2013
[INFO] Final Memory: 14M/216M
[INFO] ------------------------------------------------------------------------
```

Aplikasipun terpasang di handset.

![Foto](http://lh6.googleusercontent.com/-74yIG4jiS8U/UpWnVDIWZ1I/AAAAAAAACgo/Gzsz4YGGOLo/s600/07.+Deploy+Handset.png)

Kita bisa klik icon-nya untuk menjalankan

![Foto](http://lh3.googleusercontent.com/-0evtaY9zktE/UpWnRhqFiAI/AAAAAAAACgg/pYaTd__syOY/s600/08.+Run+Application.png)

## Kesimpulan ##

Demikianlah persiapan yang kita butuhkan untuk memulai coding aplikasi Android. Pesan moral dari artikel ini: 

> Hal yang sebetulnya sederhana (sebenarnya cukup extract Android SDK berikut Eclipse ADT dan kemudian klik New Project) bisa menjadi panjang kalau kita lakukan dengan benar, memperhitungkan kerja tim, dan potensi perkembangan di masa depan.

<a name="yak-shaving"></a>
Pesan moral kedua:

> Kadang untuk melakukan satu hal (menulis artikel ini), kita harus melakukan hal lain terlebih dulu (menulis [artikel ini](http://software.endy.muhardin.com/java/persiapan-coding-java/)). Yang mana kegiatan pendahulu tersebut sering terlihat tidak berguna. Fenomena ini dikenal dengan istilah [yak shaving](http://sethgodin.typepad.com/seths_blog/2005/03/dont_shave_that.html)
