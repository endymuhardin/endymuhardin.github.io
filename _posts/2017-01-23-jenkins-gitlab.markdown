---
layout: post
title: "Mengakses Repository Gitlab dari Jenkins"
date: 2017-01-23 07:00
comments: true
categories:
- java
---

Pada [artikel sebelumnya](http://software.endy.muhardin.com/java/instalasi-jenkins-ssl/), kita telah menyiapkan server Jenkins untuk melakukan build pada project kita. Di artikel ini, kita akan mengkonfigurasikan project kita yang ada di Gitlab supaya bisa terhubung dengan Jenkins. Setelah selesai konfigurasi, kita akan bisa mendapatkan workflow seperti ini:

1. Programmer mengedit source code di laptopnya. Kemudian mengetes di laptopnya apakah sudah berjalan dengan baik.
2. Setelah oke, programmer commit dan push perubahan yang dia lakukan ke server Gitlab.
3. Gitlab akan mengontak Jenkins, memberitahukan bahwa ada perubahan source code terbaru.
4. Jenkins akan mengambil source code yang terbaru dari Gitlab.
5. Jenkins menjalankan proses build.
6. Jenkins memberitahukan hasilnya kembali ke server Gitlab.
7. Gitlab memberitahukan hasilnya pada programmer.

Langkah-langkah setup:

1. Buat SSH Keypair
2. Setup SSH Key di Jenkins
3. Buat project di Gitlab
4. Daftarkan deploy key di Gitlab
5. Generate API token di Gitlab
6. Buat project di Jenkins
7. Daftarkan trigger Jenkins di Gitlab

<!--more-->

## Membuat SSH Keypair ##

Agar Jenkins dapat mengakses project kita di dalam Gitlab, ada beberapa mekanisme yang bisa digunakan, antara lain:

* username dan password
* SSH Keypair

Saya agak kurang suka menggunakan username dan password untuk komunikasi antar aplikasi. Oleh karena itu, mari kita buat SSH keypair saja.

Pembuatan ssh keypair ini bisa dilakukan di laptop kita. Berikut perintahnya:

```
ssh-keygen -f jenkins
```

Perintah di atas akan menghasilkan output sebagai berikut

```
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in jenkins.
Your public key has been saved in jenkins.pub.
The key fingerprint is:
SHA256:ZRmQbVSBt1gf574sWi6GD27lihabdoHhImW6b0Kz8+4 endymuhardin@Endys-MacBook-Air.local
The key's randomart image is:
+---[RSA 2048]----+
|        .=ooo.   |
|        . +oo . .|
|         .++ o + |
|     o . o. . . .|
|    + . S      . |
|   = . + . .    .|
|  . = . +.=  .. .|
|   = . =o+.+o. o |
|    OEo.oo+oo..  |
+----[SHA256]-----+
```

Private key tidak perlu dipasangi password supaya setupnya nanti tidak sulit. Setelah perintah dijalankan, kita akan mendapatkan dua file, private key dan public key. Public key adalah file yang berakhiran `.pub`

```
ls -l | grep jenkins
-rw-------   1 endymuhardin  staff  1679 Jan 23 12:43 jenkins
-rw-r--r--   1 endymuhardin  staff   418 Jan 23 12:43 jenkins.pub
```

SSH key ini kita masukkan ke Jenkins. Masuk ke menu Credentials > System > Global Credentials

![Global Credentials]({{site.url}}/images/uploads/2017/jenkins-gitlab/global-credentials.png)

Selanjutnya kita klik Add Credentials. Karena private key kita generate di laptop, maka kita isikan langsung ke dalam input box. File private key bisa dibuka dengan text editor biasa.

![Input Private Key]({{site.url}}/images/uploads/2017/jenkins-gitlab/input-private-key.png)

Klik simpan

![Hasil Private Key]({{site.url}}/images/uploads/2017/jenkins-gitlab/hasil-private-key.png)


## Membuat Project di Gitlab ##

Berikutnya, kita pindah ke Gitlab untuk menyiapkan project yang akan dibuild. Projectnya tidak akan saya buat baru. Kita akan gunakan [project di artikel sebelumnya yang ada di Github](http://github.com/endymuhardin/belajar-ci).

Login ke Gitlab, kemudian kita buat New Project. Kita set menjadi project private agar tidak bisa diakses oleh umum.

![Gitlab New Project]({{site.url}}/images/uploads/2017/jenkins-gitlab/gitlab-new-project.png)

Setelah project kita buat di Gitlab, kita akan isi dengan source code dari repo Github. Lakukan perintah berikut di laptop, dalam folder projectnya.

```
cd belajar-ci
git remote add gitlab git@gitlab.artivisi.com:endymuhardin/belajar-ci.git
git push gitlab master
```

Berikutnya, kita akan menambahkan public key tadi supaya Jenkins bisa mengakses project `belajar-ci` ini. Masuk ke menu Settings > Deploy Key

![Menu Deploy Key]({{site.url}}/images/uploads/2017/jenkins-gitlab/menu-deploy-key.png)

Masukkan isi public key di file `jenkins.pub` seperti ini

![Input Deploy Key]({{site.url}}/images/uploads/2017/jenkins-gitlab/input-deploy-key.png)

Deploy key tersebut hanya mengijinkan Jenkins untuk mengambil source code saja. Kita ingin dia juga bisa mengambil informasi tentang project, seperti nama project, nama committers, dan lainnya. Untuk itu, kita perlu memiliki `access_token` dari Gitlab.

Masuk ke menu `Profile Settings` yang ada di menu user kita.

![Menu Profile Settings]({{site.url}}/images/uploads/2017/jenkins-gitlab/menu-profile-settings.png)

Kemudian isi input fieldnya.

![Generate Access Token]({{site.url}}/images/uploads/2017/jenkins-gitlab/generate-access-token.png)

Kita akan dibuatkan Access Token. Copy isinya untuk kita pasang di Jenkins.

![Hasil Access Token]({{site.url}}/images/uploads/2017/jenkins-gitlab/hasil-access-token.png)

Di dalam Jenkins, masuk ke menu Global Credentials. Kemudian tambahkan Gitlab API Token.

![Gitlab Token di Jenkins]({{site.url}}/images/uploads/2017/jenkins-gitlab/gitlab-token.png)

Selanjutnya, masih di Jenkins, masuk ke menu Configure System, kemudian scroll ke bagian Gitlab. Isikan url Gitlab kita, dan pilih credential access token yang sudah kita pasang sebelumnya.

![Mengakses Gitlab API di Jenkins]({{site.url}}/images/uploads/2017/jenkins-gitlab/jenkins-gitlab-api.png)

## Konfigurasi Project di Jenkins ##

Kita pindah dulu ke Jenkins untuk mendaftarkan project kita tersebut. Sebelum masuk ke Project, periksa dulu di Manage Jenkins > Global Tool Configuration, pastikan Maven sudah terkonfigurasi. Bila masih kosong seperti ini

![Konfigurasi Maven]({{site.url}}/images/uploads/2017/jenkins-gitlab/maven-kosong.png)

Klik Add Maven dan isikan lokasi instalasinya.

![Input Maven]({{site.url}}/images/uploads/2017/jenkins-gitlab/input-maven.png)

Barulah kita bisa lanjut ke Project. Masuk ke New Project dan pilih Maven Project.

![Project Baru Maven]({{site.url}}/images/uploads/2017/jenkins-gitlab/new-maven-project.png)

Di menu General, kita set integrasi Gitlab yang sudah kita konfigurasi sebelumnya.

![Integrasi Gitlab]({{site.url}}/images/uploads/2017/jenkins-gitlab/gitlab-connection.png)

Selanjutnya, kita pasang url untuk ke repository Gitlab di bagian Source Code Management.

![URL Gitlab]({{site.url}}/images/uploads/2017/jenkins-gitlab/konfigurasi-git-url.png)

Di bagian trigger, kita suruh Jenkins untuk melakukan build pada saat menerima perintah dari Gitlab, yaitu melalui HTTP API. Pada bagian ini kita bisa mendapatkan build URL, seperti dilihat pada gambar berikut

![URL Trigger]({{site.url}}/images/uploads/2017/jenkins-gitlab/build-trigger-url.png)

Build URL ini kita pasang di webhook pada project kita di Gitlab.

![Menu Webhook]({{site.url}}/images/uploads/2017/jenkins-gitlab/menu-webhook.png)

Masukkan URL yang kita copas dari Jenkins tadi

![Input Webhook]({{site.url}}/images/uploads/2017/jenkins-gitlab/input-webhook.png)

Terakhir, kita tambahkan Post Build Action

![Post Build Action]({{site.url}}/images/uploads/2017/jenkins-gitlab/post-build-action.png)

Kemudian kita save.

## Persiapan Database di Server Jenkins ##

Karena project `belajar-ci` membutuhkan database, maka kita siapkan dulu di server Jenkins. Kita buatkan user database dan databasenya sesuai kebutuhan.

```
mysql> grant all on belajar.* to belajar@localhost identified by 'java';
mysql> create database belajar;
```

## Test Webhook ##

Di laman konfigurasi Webhook ada tombol test. Kita bisa gunakan itu untuk mengetes integrasi antara Gitlab dan Jenkins.

![Webhook Tester]({{site.url}}/images/uploads/2017/jenkins-gitlab/webhook-tester.png)

Kita bisa klik tombolnya, dan kita lihat proses build segera berjalan di Jenkins

![Webhook Success]({{site.url}}/images/uploads/2017/jenkins-gitlab/webhook-success.png)

Selanjutnya, kita bisa monitor proses build di Jenkins yang harusnya sudah berjalan.

![Proses Build]({{site.url}}/images/uploads/2017/jenkins-gitlab/proses-build.png)

Bila proses build berhasil, kita akan mendapatkan notifikasi dari Gitlab melalui email.

![Notifikasi Email]({{site.url}}/images/uploads/2017/jenkins-gitlab/notifikasi-email.png)

Pada saat kita menerima email, artinya prosesnya sudah berjalan otomatis. Begitu programmer commit dan push ke repository Git, kode programnya langsung dibuild dan dijalankan automated testnya. Hasilnya, sukses atau gagal, akan dikomunikasikan melalui email.

## Reset Jenkins Build ##

Pada waktu mengkonfigurasi build, seringkali kita mengalami kesalahan konfigurasi sehingga buildnya gagal. Akibatnya, project kita akan memiliki history build yang kurang baik, disebabkan karena adanya build awal yang gagal. Untuk itu, biasanya setelah konfigurasi kita benar, kita ingin menghapus build gagal tersebut dan mulai dari awal. Untuk melakukan reset ini, masuk ke menu Manage Jenkins > Script Console.

Kita bisa menghapus semua build untuk project tertentu dan memulai build number dari 1 lagi dengan menggunakan script berikut

```groovy
def jobName = "Nama project yang ingin direset"
def job = Jenkins.instance.getItem(jobName)
job.getBuilds().each { it.delete() }
job.nextBuildNumber = 1
job.save()
```

Setelah itu, klik `Run` untuk menjalankan script. Project kita akan bersih kembali.

Bila kita membuat aplikasi microservices, biasanya kita akan punya banyak aplikasi dan project. Kalau kita gunakan script di atas, kita harus ganti nama project berkali-kali. Lumayan merepotkan. Solusinya, kita bisa gunakan script ini untuk **menghapus history build di semua project**. Jangan dijalankan bila ada project lain yang tidak ingin direset.

```groovy
for (item in Jenkins.instance.items) {
  item.builds.each() { build ->
    build.delete()
  }
  item.updateNextBuildNumber(1)
}
```

## Penutup ##

Kita telah berhasil menghubungkan antara Gitlab dan Jenkins. Untuk selanjutnya, kita akan teruskan agar build yang sukses di Jenkins dapat dideploy secara otomatis di testing server. Dengan demikian, begitu programmer commit dan push ke repository Git, bila tidak terjadi error, akan segera bisa diakses di testing server.

Stay tuned untuk [bagian terakhir, yaitu deployment](http://software.endy.muhardin.com/java/deploy-jenkins-pivotal/).

## Referensi ##

* [https://medium.com/@teeks99/continuous-integration-with-jenkins-and-gitlab-fa770c62e88a#.xgl4n8cbg](https://medium.com/@teeks99/continuous-integration-with-jenkins-and-gitlab-fa770c62e88a#.xgl4n8cbg)
* [http://stackoverflow.com/a/24991433](http://stackoverflow.com/a/24991433)
