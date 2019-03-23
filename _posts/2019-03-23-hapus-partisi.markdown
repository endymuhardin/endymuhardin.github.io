---
layout: post
title: "Hapus Partisi dengan Command Line"
date: 2019-03-23 07:00
comments: true
categories:
- linux
---

Meneruskan kebiasaan pada waktu menggunakan Ubuntu, kadang saya masih melakukan format ulang terhadap laptop, yang sudah 4 tahun ini menggunakan MacOS. Cara format ulangnya mirip, yaitu:

* Unduh image installer sistem operasi. Untuk MacOs, kita harus membuatnya sendiri menggunakan laptop/komputer Mac juga :D. Caranya bisa di-google, tidak akan saya tulis karena tiap rilis perintahnya agak berbeda. Lagipula, biasanya ada yang sudah membuatkan scriptnya.

* Tulis image tersebut ke flashdisk. Biasanya saya pakai perintah `dd` saja di commandline. `dd if=/file/image.iso of=/dev/diskN bs=1m`. Ganti nama device `diskN` sesuai yang terdeteksi di sistem operasi.

* Booting dari flashdisk dengan cara menekan tombol `Option (⌥)` sambil menyalakan komputer.

* Next .. next .. selesai.

Nah masalahnya adalah, flashdisk bekas menginstal tersebut agak susah dibersihkan partisinya. Sudah dihapus menggunakan aplikasi `Disk Utility`, `diskutil` command line, tetap menyisakan partisi boot.

Ini terutama disebabkan karena filesystem Mac tidak lazim ditemui di Windows dan Linux, sehingga untuk menghapusnya tidak bisa menggunakan aplikasi GUI biasa. Hal ini juga berlaku untuk filesystem yang aneh, seperti misalnya ZFS.

Untuk itu, google dan stack overflow tidak kekurangan jawaban. Ternyata kita cukup menghapus 3 blok pertama di flashdisk tersebut, karena tabel partisinya ada di situ. Bila partisi kita banyak (misalnya 10), yang harus dihapus 5 blok.

Perintahnya sebagai berikut

```
dd if=/dev/zero of=/dev/diskN bs=512 count=3
```

Demikianlah ini menjadi catatan buat saya pribadi, supaya kalau besok-besok instal ulang, tidak perlu repot lagi mencari command untuk membersihkan flashdisk. Semoga bermanfaat untuk pembaca sekalian.