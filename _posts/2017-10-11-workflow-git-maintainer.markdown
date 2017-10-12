---
layout: post
title: "Workflow Git untuk Maintainer Project Open Source"
date: 2017-10-11 07:00
comments: true
categories:
- aplikasi
---
Pada artikel sebelumnya, kita sudah membahas tentang apa yang harus dilakukan oleh kontributor agar hasil pekerjaannya siap untuk digabungkan dengan repository utama/induk/upstream, yaitu membuat Pull Request.

Sebagai maintainer project, tugas kita adalah memilah semua kontribusi yang masuk. Bila kontribusinya bagus, maka kita masukkan ke dalam project. Bila kurang bagus, kita pandu untuk memperbaikinya.

Kita bisa menerima kontribusi dalam berbagai bentuk, misalnya:

* Pull Request di aplikasi version control (Github, Gitlab, Bitbucket, dsb)
* Link repository kontributor dan branchnya
* File patch

Begitu kita mendapatkan kontribusi, ada beberapa hal yang harus kita lakukan, yaitu:

* mengambil kontribusi tersebut
* melakukan review dan test
* bila oke, masukkan ke repository
* bila kurang oke, berikan feedback kepada kontributor

* TOC
{:toc}

<!--more-->

## Pull Request di Aplikasi ##

Semua aplikasi version control populer yang mainstream sekarang ini -- seperti Github, Gitlab, Bitbucket -- biasanya sudah memiliki fitur manajemen Pull Request. Ini memudahkan orang untuk mengirim kontribusi ke project yang dihosting di aplikasi tersebut. Secara garis besar caranya sama, walaupun disebut dengan istilah yang berbeda-beda. Misalnya, Gitlab dan Bitbucket menyebutnya dengan istilah Merge Request.

Sebagai ilustrasi, kita akan bahas yang Github saja. Aplikasi lain tidak jauh berbeda.

Pertama, kita bisa lihat daftar Pull Request dengan membuka tab Pull Request.

[![Daftar Pull Request]({{site.url}}/images/uploads/2017/git-workflow/12-daftar-pull-request.png)]({{site.url}}/images/uploads/2017/git-workflow/12-daftar-pull-request.png)

Kemudian buka detailnya dengan mengklik salah satu pull request yang ingin diproses. Kita akan melihat banyak informasi di sana.

[![Detail Pull Request]({{site.url}}/images/uploads/2017/git-workflow/13-detail-pull-request.png)]({{site.url}}/images/uploads/2017/git-workflow/13-detail-pull-request.png)

Untuk perubahan sederhana dan non-coding, kita bisa langsung klik commitnya dan melihat perubahan yang dikirimkan. Selanjutnya kita juga bisa langsung menerima kontribusi dengan klik tombol `Merge Pull Request`.

Walaupun demikian, cara ini tidak dianjurkan. Khususnya untuk kontribusi kode program. Kita harus cek dulu apakah kode programnya bisa dijalankan dengan baik dan tidak mengganggu fitur-fitur yang lain.

Best practicesnya adalah mengunduh dulu kontribusinya di komputer kita dan melakukan review.

## Persiapan Review ##

Pertama, kita pastikan dulu kondisi lokal kita sudah up to date dengan remote.

```
git checkout master
git pull upstream master
```

Sebelum melakukan review, sebaiknya kita buat dulu branch khusus untuk integrasi dan review.

```
git branch review-implementasi-lombok
git checkout review-implementasi-lombok
```

Nah, sekarang kita siap menarik perubahan yang dikirim kontributor. Caranya berbeda-beda tergantung metode pengiriman kontribusi. Beberapa kondisi yang biasa terjadi:

* kontributor memiliki repository yang bisa diakses online, kontribusinya terdiri dari beberapa commit dan sudah dikelompokkan dalam satu branch
* kontribusi terdiri dari beberapa commit, tercampur dalam branch master dengan commit lain yang tidak berkaitan
* kontribusi hanya terdiri dari satu commit saja
* kontribusi dikirim dalam bentuk file, bisa via email, layanan sharing file, whatsapp/telegram, dsb

### Unduh Kontribusi dari Branch ###

Kasus pertama yang paling sederhana. Biasanya dilakukan oleh kontributor yang sudah berpengalaman. Kita tinggal `pull` saja branch tersebut. Misalnya repo kontributor ada di `https://github.com/endymuhardin/aplikasi-dosen.git` branchnya `implementasi-lombok`.

```
git checkout review-implementasi-lombok
git pull https://github.com/endymuhardin/aplikasi-dosen.git implementasi-lombok
```

Berikut outputnya

```
From https://github.com/endymuhardin/aplikasi-dosen
 * branch            implementasi-lombok -> FETCH_HEAD
Updating fe9c196..d8686f6
Fast-forward
 pom.xml                                                              |   5 ++
 src/main/java/id/ac/tazkia/dosen/entity/BidangIlmu.java              |  36 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/BuktiKinerja.java            |  34 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/BuktiKinerjaKegiatan.java    |  35 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/BuktiPenugasan.java          |  35 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/BuktiPenugasanKegiatan.java  |  35 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/Dosen.java                   | 218 +------------------------------------------------------------------------
 src/main/java/id/ac/tazkia/dosen/entity/Fakultas.java                |  26 +--------
 src/main/java/id/ac/tazkia/dosen/entity/JenisBuktiKegiatan.java      |  27 +--------
 src/main/java/id/ac/tazkia/dosen/entity/JenisKegiatan.java           |  50 +----------------
 src/main/java/id/ac/tazkia/dosen/entity/JenisPengajuanDokumen.java   |  34 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/JenisSurat.java              |  34 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/KategoriBuktiKegiatan.java   |  28 +---------
 src/main/java/id/ac/tazkia/dosen/entity/KategoriKegiatan.java        |  28 +---------
 src/main/java/id/ac/tazkia/dosen/entity/Kecamatan.java               |  35 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/KegiatanBelajarMengajar.java | 107 +-----------------------------------
 src/main/java/id/ac/tazkia/dosen/entity/KegiatanDosen.java           | 108 +-----------------------------------
 src/main/java/id/ac/tazkia/dosen/entity/Kota.java                    |  35 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/PengajuanDosenProfile.java   | 148 +------------------------------------------------
 src/main/java/id/ac/tazkia/dosen/entity/Permission.java              |  34 +++---------
 src/main/java/id/ac/tazkia/dosen/entity/PoinKegiatan.java            |  42 +-------------
 src/main/java/id/ac/tazkia/dosen/entity/ProgramStudi.java            |  44 +--------------
 src/main/java/id/ac/tazkia/dosen/entity/Provinsi.java                |  28 +---------
 src/main/java/id/ac/tazkia/dosen/entity/Role.java                    |  36 +-----------
 src/main/java/id/ac/tazkia/dosen/entity/SatuanHasilKegiatan.java     |  27 +--------
 src/main/java/id/ac/tazkia/dosen/entity/SuratTugas.java              |  51 +----------------
 src/main/java/id/ac/tazkia/dosen/entity/User.java                    |  51 +----------------
 src/main/java/id/ac/tazkia/dosen/entity/UserPassword.java            |  26 +--------
 28 files changed, 81 insertions(+), 1316 deletions(-)
```

Perubahan sudah masuk ke repo lokal. Kita bisa buka filenya, jalankan aplikasinya, review kualitas kode program, dan sebagainya.

### Commit Tercampur dengan Task Lain ###

Kalau saya sebagai maintainer, tidak mau repot dengan yang satu ini. Langsung saja berikan feedback kepada kontributor untuk merapikan kontribusinya. Bila dia memang ingin kontribusi ke dua hal berbeda, minimal commitnya dipisahkan. Akan lebih ideal kalau branchnya juga dipisah.

### Unduh Satu Commit ###

Seringkali terjadi orang malas membuat branch. Misalnya dia hanya ingin menambahkan satu hal kecil saja. Koreksi typo, penamaan variabel, komentar, atau hal lain yang remeh temeh. Kemudian dia memberikan ke kita commit-id perubahan tersebut. Di Github, biasanya sudah ada URL patch untuk satu commit tertentu, misalnya [https://github.com/endymuhardin/aplikasi-dosen/commit/d8686f6cc4306b75109d88e2834f7e58456c60f6.patch](https://github.com/endymuhardin/aplikasi-dosen/commit/d8686f6cc4306b75109d88e2834f7e58456c60f6.patch)

Kita sebagai maintainer bisa langsung tarik dari URL tersebut

```
git checkout review-implementasi-lombok
curl https://github.com/endymuhardin/aplikasi-dosen/commit/d8686f6cc4306b75109d88e2834f7e58456c60f6.patch | git am
```

Kita gunakan perintah `git am` untuk mengunduh file patch, kemudian menggabungkannya ke source code yang ada. Outputnya seperti ini

```
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                               Dload  Upload   Total   Spent    Left  Speed
100 50730    0 50730    0     0   8804      0 --:--:--  0:00:05 --:--:-- 11263
Applying: implement lombok, remove getter/setter
.git/rebase-apply/patch:1570: new blank line at EOF.
+
warning: 1 line adds whitespace errors
```

Perubahan sudah masuk, kita tinggal review dan test.

### File Patch ###

Ada kalanya kita menerima file dengan format patch. Misalnya, file tersebut kita taruh di folder `/tmp`. Maka kita bisa proses file tadi dengan `git am` seperti pada bagian sebelumnya.

```
git am < /tmp/0001-implement-lombok-remove-getter-setter.patch
```

Outputnya seperti ini

```
.git/rebase-apply/patch:1570: new blank line at EOF.
+
warning: 1 line adds whitespace errors.
```

Perubahan siap kita test dan review.

## Berbagai Kemungkinan Hasil ##

Pada waktu kita menggabungkan (`merge`) kontribusi orang, ada beberapa hal yang bisa terjadi:

* kontribusinya oke : bisa langsung diterima.
* terjadi merge conflict : saya suruh perbaiki dulu. Biasanya ini terjadi karena kontributor coding di atas versi upstream yang jadul. Solusinya, mereka harus pull dari upstream terbaru, kemudian `rebase` topic branch ke upstream yang baru tersebut.
* minor problem : saya minta perbaiki, commit lagi ke topic branch yang sama, kemudian notifikasi saya agar saya coba merge lagi.

## Menerima Hasil ##

Setelah kontribusi kita terima, kita akan publish ke repo utama, agar orang lain bisa ikut menikmati kontribusi tersebut. Berikut perintahnya

```
git checkout master
git merge review-implementasi-lombok
git push upstream master
```

Kita bisa menghapus branch `review-implementasi-lombok` tadi, karena sudah tidak dipakai lagi.

```
git branch -d review-implementasi-lombok
```

Outputnya seperti ini

```
Deleted branch review-implementasi-lombok (was d9c732c).
```

Selanjutnya, menjadi tanggung jawab masing-masing kontributor untuk mengupdate local dan remote reponya masing-masing.

Selamat mencoba, semoga bermanfaat.
