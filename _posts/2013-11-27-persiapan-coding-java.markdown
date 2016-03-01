---
layout: post
title: "Persiapan Coding Java"
date: 2013-11-27 11:10
comments: true
categories: 
- java
---

Sebelum kita mulai coding, langkah pertama tentulah menginstal persenjataan. Perlengkapan minimal yang dibutuhkan untuk coding Java sebenarnya cuma:

* Java SDK
* Text editor. Tidak perlu yang canggih, asal ada warnanya seperti Gedit, Notepad++, dan sejenisnya

Kalau sudah pakai library tambahan --seperti driver database, framework, dan lainnya-- maka perlu menggunakan [Maven](http://maven.apache.org) supaya mudah mengelolanya. Berikut adalah langkah-langkah persiapannya.

<!--more-->

## Langkah Instalasi ##

Secara garis besar, langkah-langkahnya sebagai berikut:

1. Install Java SDK
2. Extract Maven
3. Setting _Environment Variable_

Ada 2 _environment variable_ yang harus dibuat karena belum ada, yaitu:

* JAVA_HOME : lokasi instalasi Java SDK
* M2_HOME : lokasi extract Maven

Dan satu yang harus diedit, yaitu variabel `PATH`. Tambahkan:

* JAVA_HOME/bin : lokasi compiler java
* M2_HOME/bin : lokasi perintah `mvn`

Berikut caranya di Ubuntu dan Windows 8.

## Instalasi di Ubuntu ##

Di Ubuntu tidak sulit, tinggal install saja paket `openjdk-7-jdk`. Terserah mau pakai GUI atau command line. Setelah itu kita extract [Maven](http://maven.apache.org) di folder manapun yang kita suka. Biasanya saya extract di folder `/opt`.

Untuk menambahkan environment variable, kita buat file `/etc/profile.d/java-env.sh` yang isinya seperti ini

```sh
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
export M2_HOME=/opt/apache-maven-3.2.3
export PATH=$PATH:$JAVA_HOME/bin:$M2_HOME/bin
```

Ganti isi `JAVA_HOME` dan `M2_HOME` sesuai dengan lokasi di komputer Anda masing-masing.

File yang ada di dalam folder `/etc/profile.d` akan dijalankan oleh Ubuntu pada waktu komputer dijalankan. Cobalah restart komputer untuk melihat hasilnya.

Mudah bukan? Bandingkan panjang penjelasannya dengan Windows di bawah ini ;p

## Instalasi di Windows ##

### Instalasi JDK dan Maven ###

Java SDK bisa diunduh [di sini](http://www.oracle.com/technetwork/java/javase/downloads/index.html). Ambil yang `JDK`, bukan `Server JRE` ataupun `JRE`. Setelah terunduh, jalankan installernya, klik Next-next sampai selesai.

Maven bisa diunduh di [websitenya](http://maven.apache.org). Setelah terunduh, extract ke folder manapun. Biasanya saya taruh di folder Program Files

[![Foto](http://lh4.googleusercontent.com/-88rrGGuOgjU/UpVtUVWgtII/AAAAAAAACeU/6uGPetDKkT0/s600/01.+Folder+Program+Files.png)](http://lh4.googleusercontent.com/-88rrGGuOgjU/UpVtUVWgtII/AAAAAAAACeU/6uGPetDKkT0/s600/01.+Folder+Program+Files.png)

<a name="environment-variable-windows"></a>

### Setting Environment Variable ###

Selanjutnya sama, kita harus tambahkan variabel `JAVA_HOME` dan `M2_HOME`, kemudian edit variabel `PATH`. Pertama, klik kanan My Computer di Windows Explorer. 


[![Foto](http://lh4.googleusercontent.com/-8Cih2iGl_pQ/UpVtUzzuPFI/AAAAAAAACeM/aPAT_hokw-Q/s600/03.+My+Computer+-+Properties.png)](http://lh4.googleusercontent.com/-8Cih2iGl_pQ/UpVtUzzuPFI/AAAAAAAACeM/aPAT_hokw-Q/s600/03.+My+Computer+-+Properties.png)

Kemudian tekan Properties. Muncul layar System Information

[![Foto](http://lh5.googleusercontent.com/-Sx6WUwPghwI/UpVtXZKBDhI/AAAAAAAACek/9mq4DYMJ2HQ/s600/04.+System+Properties.png)](http://lh5.googleusercontent.com/-Sx6WUwPghwI/UpVtXZKBDhI/AAAAAAAACek/9mq4DYMJ2HQ/s600/04.+System+Properties.png)

Klik Advanced System Setting untuk memunculkan System Properties

[![Foto](http://lh3.googleusercontent.com/-BsUFuPg6rXI/UpVtVzN8ndI/AAAAAAAACeY/WzJtJDNMDEM/s600/04.+System+Properties+-+Environment+Variables.png)](http://lh3.googleusercontent.com/-BsUFuPg6rXI/UpVtVzN8ndI/AAAAAAAACeY/WzJtJDNMDEM/s600/04.+System+Properties+-+Environment+Variables.png)

Tekan tombol Environment Variables. Setelah muncul layarnya, tekan tombol `New` di kotak yang bawah (`System Variables`). Kemudian isi nama variable `JAVA_HOME` seperti ini

[![Foto](http://lh3.googleusercontent.com/-ErYIcSxokVo/UpVtXlKvfFI/AAAAAAAACes/cf3WGL5toyc/s600/05.+JAVA_HOME.png)](http://lh3.googleusercontent.com/-ErYIcSxokVo/UpVtXlKvfFI/AAAAAAAACes/cf3WGL5toyc/s600/05.+JAVA_HOME.png)

Nilai `value` bisa dicopy-paste dari Windows Explorer. Pastikan dia menunjuk ke lokasi instalasi Java SDK

[![Foto](http://lh6.googleusercontent.com/-5RRmCmNhnQ4/UpVtU7VKGBI/AAAAAAAACeE/KVwPyHsp3a0/s600/02.+Folder+Instalasi+Java.png)](http://lh6.googleusercontent.com/-5RRmCmNhnQ4/UpVtU7VKGBI/AAAAAAAACeE/KVwPyHsp3a0/s600/02.+Folder+Instalasi+Java.png)

Lakukan hal yang sama untuk variabel `M2_HOME`

[![Foto](http://lh6.googleusercontent.com/-ikCikrAAF9M/UpVtXuMUf5I/AAAAAAAACe0/N-Qx-fTacBc/s400/06.+M2_HOME.png)](http://lh6.googleusercontent.com/-ikCikrAAF9M/UpVtXuMUf5I/AAAAAAAACe0/N-Qx-fTacBc/s400/06.+M2_HOME.png)

Cari variabel bernama `Path`, kemudian Edit

[![Foto](http://lh4.googleusercontent.com/-JNctbwhxp7I/UpVtYZRQuVI/AAAAAAAACfE/y852SKFSYXM/s400/08.+PATH.png)](http://lh4.googleusercontent.com/-JNctbwhxp7I/UpVtYZRQuVI/AAAAAAAACfE/y852SKFSYXM/s400/08.+PATH.png)

Isinya adalah sebagai berikut

```
whatever-isi-path-yang-lama;%JAVA_HOME%\bin;%M2_HOME%\bin
```

Perhatikan bahwa variabel PATH berisi banyak nilai, di Windows masing-masingnya dipisahkan oleh tanda `;`. Sedangkan di Linux, dipisahkan oleh tanda `:`

Klik OK untuk menutup semua dialog. Setelah itu kita test. Buka command prompt baru. Kalau sebelumnya sudah membuka command prompt, harus ditutup dulu dan buka yang baru. Konfigurasi yang benar hasilnya seperti ini

[![Foto](http://lh3.googleusercontent.com/-t4G5eQTWL4I/UpVtZPYbJ5I/AAAAAAAACfI/LLj_LzB9H2s/s600/09.+Test+JDK+dan+Maven.png)](http://lh3.googleusercontent.com/-t4G5eQTWL4I/UpVtZPYbJ5I/AAAAAAAACfI/LLj_LzB9H2s/s600/09.+Test+JDK+dan+Maven.png)

Kalau tidak seperti itu, periksa lagi isi `JAVA_HOME`, `M2_HOME`, dan `PATH`.

Selamat coding.
