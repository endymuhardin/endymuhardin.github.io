---
layout: post
title: "Workflow Git untuk Kontributor Project Open Source"
date: 2017-10-09 07:00
comments: true
categories:
- aplikasi
---
Beberapa waktu belakangan ini, saya membuat beberapa aplikasi yang kemudian dirilis secara open source. Karena kultur open-source di Indonesia masih berkutat di level user, maka masih jarang yang mau ikut berkontribusi. Mungkin perlu dukungan dari perusahaan agar karyawannya terlibat dalam project open source, ataupun merilis aplikasi yang dibuatnya dengan lisensi open source.

Kendala-kendala yang biasanya terdengar antara lain:

* tidak punya cukup waktu luang
* tidak tertarik dengan aplikasi atau teknologi yang digunakan
* merasa belum cukup mahir coding
* tidak familiar dengan cara kerja menggunakan Git

Masalah yang pertama dan kedua, saya tidak ada solusinya.

Untuk yang ketiga, seharusnya coba saja kontribusi. Satu dua baris tetap diterima. Kalaupun ada yang perlu diperbaiki, biasanya akan saya berikan [feedback yang jelas](https://github.com/idtazkia/aplikasi-dosen/pull/1).

Problem keempat, sebetulnya saya sudah buatkan [video tutorialnya](https://youtu.be/gDqT_Wvt3VQ).

<iframe width="560" height="315" src="https://www.youtube.com/embed/gDqT_Wvt3VQ" frameborder="0" allowfullscreen></iframe>

Tapi agar lebih jelas, saya akan buatkan rangkuman langkah-langkah dan perintah Git yang harus dilakukan.

* TOC
{:toc}

<!--more-->

## Persiapan Project ##

Sebelum bisa berkontribusi, terlebih dulu kita siapkan repository baik di remote maupun di lokal. Agar bisa menjalankan langkah-langkah berikut dengan baik, pastikan Anda sudah memiliki akun Github dan sudah menginstal aplikasi command line Git di laptop/PC. Cara-caranya sudah pernah saya jelaskan di [artikel ini](https://software.endy.muhardin.com/aplikasi/instalasi-git-di-windows/).

### Fork Repository ###

Forking repository artinya kita mengcopy repository project asal di akun pembuatnya ke akun kita. Ini biasanya dilakukan karena kita tidak punya akses untuk langsung membuat perubahan di repository asal. Jadi kita buat perubahan di akun sendiri untuk kemudian minta maintainer/admin project untuk mengambil perubahan yang kita buat.

Pertama, kita copy dulu repositorynya dari akun `idtazkia` ke akun kita sendiri. Di Github sudah ada tombolnya, tinggal ditekan saja.

[![Tombol Fork]({{site.url}}/images/uploads/2017/git-workflow/01-tombol-fork.png)]({{site.url}}/images/uploads/2017/git-workflow/01-tombol-fork.png)

Setelah itu, dia akan membuat fork. Tunggu saja sebentar, kira-kira beberapa detik.

[![Sedang Fork]({{site.url}}/images/uploads/2017/git-workflow/02-sedang-fork.png)]({{site.url}}/images/uploads/2017/git-workflow/02-sedang-fork.png)

Hasilnya, kita akan memiliki copy dari repo tadi di akun kita sendiri.

[![Hasil Fork]({{site.url}}/images/uploads/2017/git-workflow/03-hasil-fork.png)]({{site.url}}/images/uploads/2017/git-workflow/03-hasil-fork.png)

### Clone Repository ###

Agar file-file bisa diedit, kita harus ambil dulu repository tersebut ke laptop/PC kita. Kita membutuhkan URL repository yang bisa didapatkan dengan cara menekan tombol hijau `Clone or Download`.

[![Tombol Clone]({{site.url}}/images/uploads/2017/git-workflow/04-tombol-clone.png)]({{site.url}}/images/uploads/2017/git-workflow/04-tombol-clone.png)

Pastikan kita clone repository di akun kita sendiri (`endymuhardin`), bukan di akun repository asal (`idtazkia`).

Buka command prompt, kemudian pindah ke folder yang diinginkan, lalu lakukan `git clone`.

```
cd project-saya
git clone git@github.com:endymuhardin/aplikasi-dosen.git
```

Setelah perintah di atas dijalankan, harusnya di komputer kita akan ada folder baru sesuai nama repository, yaitu `aplikasi-dosen`. Jangan lupa untuk masuk / pindah ke folder tersebut sebelum menjalankan perintah-perintah berikutnya.

```
cd aplikasi-dosen
```

### Mendaftarkan Repository Asal ###

Tentunya yang nantinya akan berkontribusi ke project ini bukan cuma kita saja. Ada orang lain yang mungkin lebih banyak ikut coding. Untuk itu, kita perlu secara berkala melakukan sinkronisasi dengan repo asal agar perubahan yang dibuat orang bisa kita dapatkan. Biasanya maintainer/admin project asal akan mengecek dulu apakah perubahan yang kita buat kompatibel atau tidak dengan perubahan orang lain yang sudah masuk duluan. Akan lebih baik kalau kita mengetes sendiri kompatibilitas tersebut sebelum mengirim kontribusi. Untuk itu, kita perlu mendapatkan perubahan terbaru di repo asal.

Repository asal biasanya disebut dengan istilah `upstream`. Buka halaman project asal di Github, kemudian ambil URLnya.

[![URL Repo Asal]({{site.url}}/images/uploads/2017/git-workflow/05-url-repo-asal.png)]({{site.url}}/images/uploads/2017/git-workflow/05-url-repo-asal.png)

Lalu tambahkan sebagai remote repository.

```
git remote add upstream git@github.com:idtazkia/aplikasi-dosen.git
```

Hasilnya bisa dicek dengan perintah `git remote -v`. Harusnya ada 2 remote yang terdaftar, yaitu:

* `origin` : repo di akun kita sendiri
* `upstream` : repo di akun asalnya

```
origin	git@github.com:endymuhardin/aplikasi-dosen.git (fetch)
origin	git@github.com:endymuhardin/aplikasi-dosen.git (push)
upstream	git@github.com:idtazkia/aplikasi-dosen.git (fetch)
upstream	git@github.com:idtazkia/aplikasi-dosen.git (push)
```

### Buka dengan Editor ###

Selanjutnya project tersebut bisa kita buka di editor.

## Membuat Perubahan ##

Setelah project berhasil dibuka dan dijalankan di komputer kita sendiri, barulah kita bisa mulai membuat sesuatu. Daftar pekerjaan yang bisa kita lakukan bisa dilihat di daftar `Issues` di Github. Silahkan pilih yang kita bisa kerjakan. Sebagai contoh, misalnya kita ingin memasang library `lombok`. Berikut adalah prosedurnya.

### Membuat Topic Branch ###

Git memiliki fitur `branch`. Secara singkat, fitur ini berguna untuk membuat beberapa copy dari folder project kita ini. Dengan demikian, kita bisa dengan mudah mengembalikan posisi file dan folder seperti semula (sebelum diedit). Manfaatnya, misalnya kita belum selesai mengerjakan hal yang kita akan buat, tapi kita ingin mengunduh perubahan terbaru yang sudah rilis di `upstream`. Agar tidak bercampur, kita unduh perubahan dari `upstream` di branch lain.

Tanpa tools version control seperti Git, skenario di atas kita lakukan dengan mengcopy foldernya, kemudian rename. Hasilnya nanti seperti ini:

```
ls -l
aplikasi-dosen-asli
aplikasi-dosen-implement-validasi
aplikasi-dosen-bugfix-format-tanggal
```

Tentu ini kurang elok dan tidak kekinian.

Idealnya, pekerjaan kita lakukan di branch khusus untuk pekerjaan tersebut. Jadi untuk implementasi validasi yang akan kita lakukan, kita buat dulu branchnya.

```
git branch implementasi-lombok
```

Kemudian kita masuk ke branch tersebut.

```
git checkout implementasi-lombok
```

Outputnya seperti ini

```
Switched to branch 'implementasi-lombok'
```

Atau kita bisa lakukan dengan satu perintah

```
git checkout -b implementasi-lombok
```

Kita bisa lihat daftar branch yang ada dengan perintah `git branch -a`. Outputnya seperti ini

```
master
* implementasi-lombok
remotes/origin/HEAD -> origin/master
remotes/origin/master
```

Perintah di atas bisa kita jalankan bila kita lupa sedang berada di branch mana. Branch yang sedang kita tempati ditandai dengan tanda `*`.

Setelah berada di branch yang tepat, kita bisa mulai mengedit file.

### Menyimpan Perubahan ###

Source code sudah kita edit, dan juga tidak lupa kita tes dulu di komputer lokal. Jangan sampai mengirim kode program yang masih error.

Berikutnya, kita simpan perubahan tersebut ke repository lokal. Cek dulu perubahannya dengan `git status`. Outputnya seperti ini

```
On branch implement-lombok
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)

	modified:   pom.xml
	modified:   src/main/java/id/ac/tazkia/dosen/entity/BidangIlmu.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/BuktiKinerja.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/BuktiKinerjaKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/BuktiPenugasan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/BuktiPenugasanKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Dosen.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Fakultas.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Jabatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/JenisBuktiKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/JenisKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/JenisPengajuanDokumen.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/JenisSurat.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/KategoriBuktiKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/KategoriKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Kecamatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/KegiatanBelajarMengajar.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/KegiatanDosen.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Kota.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/MataKuliah.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/PasswordResetToken.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/PengajuanDosenDokumen.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/PengajuanDosenProfile.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Permission.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/PoinKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/ProgramStudi.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Provinsi.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/Role.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/SatuanHasilKegiatan.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/SuratTugas.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/User.java
	modified:   src/main/java/id/ac/tazkia/dosen/entity/UserPassword.java
```

Jangan lupa dites dulu ya. Setelah yakin oke, baru simpan.

```
git add .
git commit -m "implement lombok, remove getter/setter"
```

Outputnya seperti ini

```
[implement-lombok bdd83eb] implement lombok, remove getter/setter
 32 files changed, 92 insertions(+), 1461 deletions(-)
```

### Upload Perubahan ###

Berikutnya, kita upload perubahan ke Github, karena langkah sebelumnya cuma menyimpan di lokal saja.

```
git push
```

Karena ini branch baru, belum ada di Github, kita akan mendapat pesan error

```
git push
fatal: The current branch implement-lombok has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin implement-lombok

```

Ikuti petunjuknya, copas dan jalankan.

```
git push --set-upstream origin implement-lombok
```

Outputnya seperti ini

```
Counting objects: 42, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (38/38), done.
Writing objects: 100% (42/42), 4.20 KiB | 614.00 KiB/s, done.
Total 42 (delta 34), reused 0 (delta 0)
remote: Resolving deltas: 100% (34/34), completed with 29 local objects.
To github.com:endymuhardin/aplikasi-dosen.git
 * [new branch]      implement-lombok -> implement-lombok
Branch implement-lombok set up to track remote branch implement-lombok from origin.
```

### Membuat Pull Request ###

Pull request artinya notifikasi ke administrator/maintainer project asal untuk melihat perubahan yang sudah kita lakukan. Bila perubahannya dinilai bermanfaat dan bisa dipakai (tidak error, kualitas coding rapih, dan berbagai kriteria lain), maka maintainer akan mengambil (`pull`) perubahan tersebut dari repo kita. Bila ternyata kurang sesuai, kita akan diminta untuk merevisi.

Di halaman web repo kita di Github, sudah tersedia tombol untuk melakukan Pull Request.

[![Tombol Pull Request]({{site.url}}/images/uploads/2017/git-workflow/06-tombol-pull-request.png)]({{site.url}}/images/uploads/2017/git-workflow/06-tombol-pull-request.png)

Langsung saja tekan, nanti kita akan mendapati form input Pull Request.

[![Form Pull Request]({{site.url}}/images/uploads/2017/git-workflow/07-form-pull-request.png)]({{site.url}}/images/uploads/2017/git-workflow/07-form-pull-request.png)

Klik tombol `Create Pull Request`. Project maintainer akan mendapatkan notifikasi dari Github bahwa ada pull request dari kita. Apa yang harus dilakukan oleh maintainer akan kita bahas pada artikel tersendiri. Sedangkan tugas kita sementara ini sudah selesai.

### Berbagai Alternatif Mekanisme Pull Request ###

Yang kita bahas di atas adalah pull request menggunakan fasilitas yang disediakan Github. Akan tetapi, sebetulnya aplikasi Git yang kita gunakan untuk versioning sudah lebih dulu ada sebelum adanya layanan Github. Jadi sebenarnya banyak cara lain untuk membuat Pull Request selain menggunakan fitur Github. Bahkan pembuat Git sendiri, yaitu om Linus yang terkenal itu, [menolak menggunakan fitur Pull Request Github](https://github.com/torvalds/linux/pull/17#issuecomment-5654674).

Intinya Pull Request adalah mengirimkan perubahan yang kita lakukan ke pengelola (maintainer) dari project open source tersebut. Ada beberapa cara untuk mengirimkannya, misalnya:

* memberikan link/URL repository kita ke maintainer. Link ini bisa dikirim melalui email, whatsapp, telegram, sms, terserahlah metode apa yang ingin kita gunakan.
* membuat patch/diff/selisih yang berisi perubahan yang kita lakukan. Kemudian mengirimkan patch tersebut melalui email. Cara inilah yang dipilih oleh om Linus.

URL repo bisa kita dapatkan seperti pada langkah clone di atas. Jangan lupa untuk memberitahukan branch yang ingin kita kontribusikan ke maintainer.

Sedangkan bila kita ingin membuat file `patch` untuk dikirim melalui email, berikut perintahnya.

```
git checkout implementasi-lombok
git format-patch master..implementasi-lombok
```

Perintah di atas akan menghasilkan file `0001-implement-lombok-remove-getter-setter.patch`

Isi filenya kira-kira seperti ini

```
From d8686f6cc4306b75109d88e2834f7e58456c60f6 Mon Sep 17 00:00:00 2001
From: Endy Muhardin <endy.muhardin@gmail.com>
Date: Wed, 11 Oct 2017 10:55:14 +0700
Subject: [PATCH] implement lombok, remove getter/setter

---
 pom.xml                                            |   5 +
 .../java/id/ac/tazkia/dosen/entity/BidangIlmu.java |  36 +---
 .../id/ac/tazkia/dosen/entity/BuktiKinerja.java    |  34 +---
 .../tazkia/dosen/entity/BuktiKinerjaKegiatan.java  |  35 +---
 .../id/ac/tazkia/dosen/entity/BuktiPenugasan.java  |  35 +---
 .../dosen/entity/BuktiPenugasanKegiatan.java       |  35 +---
 src/main/java/id/ac/tazkia/dosen/entity/Dosen.java | 218 +--------------------
 .../java/id/ac/tazkia/dosen/entity/Fakultas.java   |  26 +--
 .../ac/tazkia/dosen/entity/JenisBuktiKegiatan.java |  27 +--
 .../id/ac/tazkia/dosen/entity/JenisKegiatan.java   |  50 +----
 .../tazkia/dosen/entity/JenisPengajuanDokumen.java |  34 +---
 .../java/id/ac/tazkia/dosen/entity/JenisSurat.java |  34 +---
 .../tazkia/dosen/entity/KategoriBuktiKegiatan.java |  28 +--
 .../ac/tazkia/dosen/entity/KategoriKegiatan.java   |  28 +--
 .../java/id/ac/tazkia/dosen/entity/Kecamatan.java  |  35 +---
 .../dosen/entity/KegiatanBelajarMengajar.java      | 107 +---------
 .../id/ac/tazkia/dosen/entity/KegiatanDosen.java   | 108 +---------
 src/main/java/id/ac/tazkia/dosen/entity/Kota.java  |  35 +---
 .../tazkia/dosen/entity/PengajuanDosenProfile.java | 148 +-------------
 .../java/id/ac/tazkia/dosen/entity/Permission.java |  34 +---
 .../id/ac/tazkia/dosen/entity/PoinKegiatan.java    |  42 +---
 .../id/ac/tazkia/dosen/entity/ProgramStudi.java    |  44 +----
 .../java/id/ac/tazkia/dosen/entity/Provinsi.java   |  28 +--
 src/main/java/id/ac/tazkia/dosen/entity/Role.java  |  36 +---
 .../tazkia/dosen/entity/SatuanHasilKegiatan.java   |  27 +--
 .../java/id/ac/tazkia/dosen/entity/SuratTugas.java |  51 +----
 src/main/java/id/ac/tazkia/dosen/entity/User.java  |  51 +----
 .../id/ac/tazkia/dosen/entity/UserPassword.java    |  26 +--


 diff --git a/pom.xml b/pom.xml
 index c1d759d..654ba52 100644
 --- a/pom.xml
 +++ b/pom.xml
 @@ -59,6 +59,11 @@
              <artifactId>flyway-core</artifactId>
          </dependency>
          <dependency>
 +            <groupId>org.projectlombok</groupId>
 +            <artifactId>lombok</artifactId>
 +            <optional>true</optional>
 +        </dependency>
 +        <dependency>
              <groupId>org.springframework.boot</groupId>
              <artifactId>spring-boot-starter-test</artifactId>
              <scope>test</scope>
```

File di atas kemudian bisa kita kirimkan ke maintainer melalui berbagai metode yang memungkinkan (email, ftp, scp, flashdisk, dsb).

Selain itu, Github juga memiliki fitur untuk membuatkan patch secara online. Kita cukup klik kanan tulisan commit id untuk mendapatkan linknya.

[![Link Commit]({{site.url}}/images/uploads/2017/git-workflow/09-link-patch.png)]({{site.url}}/images/uploads/2017/git-workflow/09-link-patch.png)

Misalnya, kita mendapat link [https://github.com/endymuhardin/aplikasi-dosen/commit/d8686f6cc4306b75109d88e2834f7e58456c60f6](https://github.com/endymuhardin/aplikasi-dosen/commit/d8686f6cc4306b75109d88e2834f7e58456c60f6). Bila dibuka, tampilannya seperti ini

[![Link Commit]({{site.url}}/images/uploads/2017/git-workflow/10-commit-detail-page.png)]({{site.url}}/images/uploads/2017/git-workflow/10-commit-detail-page.png)

Kita bisa tambahkan `.patch` di belakang link tersebut sehingga menjadi [https://github.com/endymuhardin/aplikasi-dosen/commit/d8686f6cc4306b75109d88e2834f7e58456c60f6.patch](https://github.com/endymuhardin/aplikasi-dosen/commit/d8686f6cc4306b75109d88e2834f7e58456c60f6.patch) yang bila dibuka akan menghasilkan tampilan patch, sama seperti output perintah `git format-patch` di atas.

[![Link Commit]({{site.url}}/images/uploads/2017/git-workflow/11-github-patch-page.png)]({{site.url}}/images/uploads/2017/git-workflow/11-github-patch-page.png)

Link patch tersebut bisa kita berikan kepada maintainer.

## Sinkronisasi dengan project asal ##

Sinkronisasi dengan project asal atau repository `upstream` sebaiknya dilakukan di branch `master`. Demikian pula, sebaiknya kita **tidak** coding di dalam `master`, supaya kondisinya selalu bersih dan siap menerima update terbaru dari `upstream`.

### Mengunduh Perubahan dari Upstream ###

Pastikan dulu kita berada di branch `master`.

```
git checkout master
```

Setelah itu, ambil perubahan terbaru dari `upstream`.

```
git pull upstream master
```

Bila ada perubahan, maka branch `master` kita di komputer akan terupdate dengan versi terbaru dari master.

### Sesuaikan Topic Branch dengan Upstream Latest ###

Ada kalanya maintainer hanya mau mengambil perubahan yang langsung dibuat di atas `master` terbaru di `upstream`. Atau kita ingin memastikan bahwa perubahan kita menggunakan fitur/kondisi terbaru yang ada di `upstream`, misalnya bila ada bugfix penting di `upstream` yang ingin kita tes bersama fitur/perubahan yang kita lakukan. Untuk itu, kita perlu menyesuaikan topic branch kita dengan kondisi `upstream` terkini.

Pindah dulu ke topic branch yang mau diupdate sesuai dengan `upstream`.

```
git checkout implement-lombok
```

Selanjutnya, sinkronisasi dengan `master` yang sudah terupdate seperti dijelaskan di atas.

```
git rebase master
```

Setelah menjalankan perintah ini, mungkin saja terjadi konflik. Bila terjadi, silahkan dibereskan sesuai panduan di [video ini](https://www.youtube.com/watch?v=Ov59iNfGHps)

<iframe width="560" height="315" src="https://www.youtube.com/embed/Ov59iNfGHps" frameborder="0" allowfullscreen></iframe>

Setelah itu, kita bisa push ke Github. Tapi biasanya kalau kita sudah melakukan rebase, kita harus menggunakan opsi `-f` agar bisa push

```
git push -f
```

## Revisi Pull Request ##

Ada kalanya pull request kita ditolak oleh maintainer. Banyak penyebabnya, misalnya:

* perubahan kita tidak sesuai dengan roadmap pengembangan aplikasi
* kualitas kode program kurang baik
* teknik coding tidak sesuai aturan dalam project, misalnya penamaan variabel, unit test, dan sebagainya
* sebab-sebab lain

Bila pull request kita ditolak, tidak perlu baper. Cukup tanyakan pada maintainer apa masalahnya. Project open source biasanya butuh banyak kontribusi, jadi biasanya maintainer justru gembira kalau menerima pull request. Bila dia menolak, biasanya ada komentar atau penjelasan apa yang kurang dan bagaimana cara memperbaikinya. Contohnya seperti di gambar berikut

[![Feedback PR]({{site.url}}/images/uploads/2017/git-workflow/08-revisi-pull-request.png)]({{site.url}}/images/uploads/2017/git-workflow/08-revisi-pull-request.png)

Pada gambar di atas, terlihat bahwa awalnya Pull Request dikomentari oleh maintainer. Di situ dijelaskan apa yang salah, dan bagaimana cara memperbaikinya. Kemudian kontributor melakukan perubahan lagi sesuai apa yang diminta. Akhirnya Pull Request diterima oleh maintainer.

Bila kita mendapatkan permintaan revisi dari maintainer, kembali buka topic branch kita tadi. Inilah gunanya topic branch. Sementara menunggu feedback, kita bisa membuat topic branch lain dan mengerjakan issue lain --baik fitur ataupun bugfix-- di branch yang kondisinya bersih, tidak terkontaminasi perubahan `implement-lombok` tadi. Begitu ada feedback, kita bisa kembali ke topic branch `implement-lombok` yang kondisinya sesuai posisi terakhir Pull Request kita tadi.

```
git checkout implementasi-lombok
```

Lakukan modifikasi sesuai feedback maintainer, kemudian commit lagi.

```
git add .
git commit -m "perubahan sesuai permintaan maintainer"
```

Lalu push lagi

```
git push
```

Maintainer akan otomatis diberitahu oleh Github bahwa ada update baru di Pull Request kita. Sementara itu kita bisa kembali mengerjakan apa yang tadinya sedang kita kerjakan.

```
git checkout branch-lain-yang-kita-kerjakan
```

## Setelah Pull Request Diterima ##

Horee .... !!! Pull request kita diterima. Selanjutnya apa yang kita lakukan?

Bila pull request kita diterima, harusnya perubahan yang kita lakukan sudah ada di `upstream`. Coba kita lihat dulu.

```
git checkout master
git pull upstream master
```

Kondisi `master` kita sudah up to date dengan `upstream`. Sekarang lihat daftar perubahannya dengan perintah `git log --oneline`. Harusnya kita bisa melihat perubahan yang kita sumbangkan ke project.

Karena perubahan kita sudah terkandung dalam `upstream`, kita bisa menghapus topic branch kita tadi.

```
git branch -D implement-lombok
```

Hapus juga yang ada di Github

```
git push origin :implement-lombok
```

Artinya, push `NULL` ke `origin` untuk menggantikan `implement-lombok`, atau bahasa gampangnya `hapus` :D

Outputnya seperti ini

```
To github.com:endymuhardin/aplikasi-dosen.git
 - [deleted]         implement-lombok
```

## Penutup ##

Demikianlah daftar perintah yang biasa kita lakukan kalau menjadi kontributor project open source di Github. Untuk lebih lengkapnya, silahkan tonton [rekaman training Git berikut](https://youtu.be/XZxaY2XvRzE).

<iframe width="560" height="315" src="https://www.youtube.com/embed/XZxaY2XvRzE" frameborder="0" allowfullscreen></iframe>

Semoga bermanfaat.
