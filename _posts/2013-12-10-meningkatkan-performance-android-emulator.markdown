---
layout: post
title: "Meningkatkan performance Android Emulator"
date: 2013-12-10 17:39
comments: true
categories: 
- java
---

Setelah kemarin kita mempersiapkan persenjataan untuk coding Android, langkah selanjutnya tentu saja membuat aplikasi `Hello World` dan kemudian mencoba menjalankannya. Ada dua pilihan cara menjalankan aplikasi Android, yaitu langsung di _device_ atau menggunakan emulator.

Sayangnya, secara default emulator Android sangat lemot. Sedangkan kecepatan kita dalam membangun aplikasi sangat ditentukan oleh kecepatan kita melakukan siklus _edit-test-fix_. Kalau langkah _test_ butuh waktu lama, dengan sendirinya proses development kita juga akan butuh waktu lama. 

Untungnya ada teknik yang tersedia untuk meningkatkan kecepatan emulator Android, yaitu dengan [menggunakan emulator berbasis Intel platform](http://software.intel.com/en-us/articles/speeding-up-the-android-emulator-on-intel-architecture). Kita akan bahas cara-caranya di artikel ini.

[![Foto](http://lh5.googleusercontent.com/-ynU8SU2Efd0/Uqa45WE4K_I/AAAAAAAAC7w/umEdkuO7wqA/w467-h623-no/20131210_134625.jpg)](http://lh5.googleusercontent.com/-ynU8SU2Efd0/Uqa45WE4K_I/AAAAAAAAC7w/umEdkuO7wqA/w467-h623-no/20131210_134625.jpg)

<!--more-->

Prinsip dasarnya adalah, kita memanfaatkan fitur virtualisasi yang sudah tersedia di prosesor Intel generasi saat ini. Dengan fitur ini, emulator Android bisa berjalan dengan lebih cepat karena ada dukungan di prosesor. Tentunya terlebih dulu kita harus melakukan pengecekan apakah prosesor di komputer kita sudah mendukung fitur ini atau belum.

Di Windows dan Mac, fitur ini diaktifkan dengan driver khusus dari Intel yang disebut dengan Intel® Hardware Accelerated Execution Manager (Intel® HAXM). Sedangkan pada Linux, fitur ini tersedia dalam aplikasi virtualisasi KVM. 

Mari kita bahas cara pengecekannya satu persatu dengan Linux maupun dengan Windows.

## Instalasi di Linux ##

Berikut adalah langkah-langkahnya:

1. Verifikasi apakah prosesor kita sudah mendukung
2. Instalasi KVM
3. Membuat emulator Intel di Android Virtual Device (AVD) Manager

### Verifikasi Dukungan Prosesor ###

Di Ubuntu, kita bisa menjalankan perintah berikut di terminal.

```
egrep -c '(vmx|svm)' /proc/cpuinfo
```

Kalau outputnya `0`, berarti komputer kita tidak support. Angka `1` atau lebih menunjukkan bahwa komputer kita mendukung KVM.


### Instalasi KVM ###

Berikut perintahnya

```
sudo apt-get install qemu-kvm libvirt-bin ubuntu-vm-builder bridge-utils
```

Setelah selesai, kita harus logout dan login lagi, karena Ubuntu menambahkan user kita ke grup `libvirtd`. Penambahan ke grup ini baru dibaca pada saat kita login.

Kita bisa tes kesuksesan proses instalasi, jalankan perintah berikut:

```
virsh -c qemu:///system list
```

Bila sukses, outputnya seperti ini

```
 Id Name                 State
----------------------------------
```

Bila gagal, outputnya seperti ini

```
libvir: Remote error : Permission denied
error: failed to connect to the hypervisor
```

Selanjutnya, kita tinggal membuat Android Virtual Device (AVD) yang menggunakan platform Intel. Langkah ini akan kita bahas setelah penjelasan tentang cara instalasi Intel® HAXM di Windows.

## Instalasi di Windows ##

Instalasi Intel® HAXM dilakukan melalui Android SDK Manager. Opsinya ada di folder Extra di paling bawah.
Jangan lupa instal juga emulator Intel sekaligus.

[![Foto](http://lh4.googleusercontent.com/-ZitwHacTB50/UqcZWbt1alI/AAAAAAAAC8Y/T_rChtMx4m0/w746-h576-no/haxm01.png)](http://lh4.googleusercontent.com/-ZitwHacTB50/UqcZWbt1alI/AAAAAAAAC8Y/T_rChtMx4m0/w746-h576-no/haxm01.png)

Instalasi melalui Android SDK Manager ini ternyata hanya mengunduh Intel® HAXM saja. Kita tetap harus menginstalnya sendiri. Cari filenya dalam folder `extras` dalam Android SDK.

[![Foto](http://lh6.googleusercontent.com/-vyyFTq3bx_4/UqcZVfev3QI/AAAAAAAAC8Q/fAcHpy2KJMo/w233-h122-no/haxm02.png)](http://lh6.googleusercontent.com/-vyyFTq3bx_4/UqcZVfev3QI/AAAAAAAAC8Q/fAcHpy2KJMo/w233-h122-no/haxm02.png)

Jalankan saja installer seperti biasa. Klik Next sampai selesai.

## Membuat Emulator Intel ##

Selanjutnya, kita tinggal membuat AVD seperti biasa. Pastikan kita pilih opsi platform Intel.

[![Foto](http://lh3.googleusercontent.com/-phoDzK--s64/Uqcbh-dQWzI/AAAAAAAAC8s/2WWFtnFY1TE/w572-h623-no/Edit+Android+Virtual+Device+%2528AVD%2529+_001.png)](http://lh3.googleusercontent.com/-phoDzK--s64/Uqcbh-dQWzI/AAAAAAAAC8s/2WWFtnFY1TE/w572-h623-no/Edit+Android+Virtual+Device+%2528AVD%2529+_001.png)

Jangan lupa untuk mencentang juga opsi `Use Host GPU` untuk mengalihkan beban pemrosesan tampilan dari emulator ke komputer kita.

Selamat mencoba, seharusnya sekarang emulator bisa dijalankan dengan lebih cepat. Oh iya, ada sedikit keterbatasan. Pada saat artikel ini ditulis, Intel belum merilis emulator untuk Android versi terbaru (KitKat / API level 19). Jadi kita terpaksa coding menggunakan API level 18.

Semoga bermanfaat

