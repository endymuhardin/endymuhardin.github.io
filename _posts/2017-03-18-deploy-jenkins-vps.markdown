---
layout: post
title: "Mendeploy Aplikasi dari Jenkins ke VPS"
date: 2017-03-18 07:00
comments: true
categories:
- java
---

Pada [artikel sebelumnya](http://software.endy.muhardin.com/java/deploy-jenkins-pivotal/), kita telah membahas tentang cara mendeploy dari Jenkins ke layanan PaaS, seperti [Pivotal Web Services](https://run.pivotal.io). Deployment ke PaaS relatif lebih mudah, karena platform (Java SDK, database MySQL) sudah tersedia, sehingga kita tinggal mengunggah dan menjalankan aplikasi saja.

Kali ini, kita akan coba deploy ke layanan IaaS yang lebih sedikit fiturnya. Kita hanya mendapatkan server yang baru terinstal sistem operasi saja. Sehingga kita harus mempersiapkan segala sesuatu yang dibutuhkan oleh aplikasi kita supaya berjalan dengan baik.

Sebagai ilustrasi, saya akan gunakan VPS di Digital Ocean yang relatif mudah digunakan dan terjangkau harganya. Penagihannya juga dihitung perjam, sehingga kalau para pembaca ingin mencoba, bisa langsung praktek dan segera destroy setelah selesai agar tagihan tidak besar. Kita bisa gunakan paket memori 1GB dengan harga $0.015/jam.

<!--more-->

## Persiapan Platform ##

Langkah pertama, kita buat dulu droplet di Digital Ocean. Bagi yang belum punya akunnya bisa [mendaftar di sini](http://www.digitalocean.com/?refcode=c5449509c33a). Kemudian kita buat droplet dengan ukuran 1 GB.

Pembuatan droplet bisa dilakukan melalui antarmuka webnya ataupun melalui [aplikasi `doctl`](https://www.digitalocean.com/community/tutorials/how-to-use-doctl-the-official-digitalocean-command-line-client) yang bisa dijalankan melalui command line. Perintah `doctl`nya sebagai berikut

```
doctl compute droplet create belajar-ci --size 1gb --image ubuntu-16-04-x64 --region nyc1 --ssh-keys 5b:0f:70:36:15:c4:8c:2f:23:06:7c:15:53:b3:ca:28
```

Selanjutnya, kita login melalui ssh ke droplet tersebut

```
doctl compute ssh belajar-ci
```

Kita update dulu software yang terinstal

```
apt-get update && apt-get upgrade -y
```

Kemudian, kita instalasi paket-paket berikut:

* Java SDK
* MySQL Server

dengan perintah

```
apt-get install openjdk-8-jdk-headless postgresql -y
```

Kita juga harus menyiapkan user di sistem operasi untuk menjalankan aplikasi kita. Jangan menjalankan aplikasi dengan user `root`, karena mendatangkan resiko keamanan. User yang kita buat ini merupakan `system user`, yaitu user khusus dengan ketentuan:

* tidak boleh login
* tidak memiliki grup (grup diset menjadi `nogroup`)
* tidak bisa mengakses command line (shell diset `/bin/false`)
* memiliki home folder

Untuk membuat user seperti ini, kita gunakan opsi `--system`

```
adduser --system artivisi
```

### Persiapan Database ###

Edit konfigurasi PostgreSQL (biasanya ada di file `/etc/postgresql/9.5/main/pg_hba.conf`) menjadi sebagai berikut

```
local   all             postgres                                peer
local   all             all                                     password
host    all             all             127.0.0.1/32            password
host    all             all             ::1/128                 password
```

Restart PostgreSQL supaya konfigurasi tadi diaplikasikan

```
service postgresql restart
```

Berikutnya, kita buat user database untuk aplikasi kita. Ganti user dulu menjadi user `postgres`

```
sudo su - postgres
```

Buat user dengan privilege membuat database sendiri (opsi `-d`)

```
createuser -d -P aplikasidb
```

Kita akan dimintai password. Masukkan `test123` untuk passwordnya.

Selanjutnya, kita bisa kembali menjadi user `root`.

```
exit
```

Buat database untuk aplikasi kita

```
PGPASSWORD=test123 createdb -Uaplikasidb -Oaplikasidb -Eutf8 aplikasidb
```

## Deployment Manual ##

Sebelum kita otomasi dengan Jenkins, terlebih dulu kita lakukan deployment secara manual untuk memastikan prosedurnya.

### Executable JAR file ###

Kita harus membuat aplikasi kita menjadi file `jar` yang bisa didaftarkan menjadi `system service`, supaya bisa start otomatis setiap kali server dinyalakan. Spring Boot telah menyediakan fasilitasnya, kita cukup nyalakan dengan mengaktifkan opsi `executable`. Edit `pom.xml` dan buat konfigurasi seperti ini.

```xml
<build>
    <finalName>${project.artifactId}</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <executable>true</executable>
            </configuration>
        </plugin>
	</plugins>
</build>
```

Selanjutnya build dulu aplikasinya di laptop kita sendiri.

```
cd belajar-ci
mvn clean package -DskipTests
```

Aplikasi yang siap dijalankan ada di folder `target`. Kita upload aplikasinya dengan perintah `scp`. Di *nix ini sudah tersedia di commandline. Pengguna Windows bisa pakai WinSCP.

Untuk bisa mengirim file, kita membutuhkan alamat IP server yang dituju. Gunakan aplikasi command line Digital Ocean untuk mendapatkan alamat IPnya.

```
doctl compute droplet list
```

Outputnya seperti ini

```
42753653    belajar-ci              162.243.7.44                                     1024      1        30      nyc2      Ubuntu 16.04.2 x64      active
```

Sekarang kita bisa mengunggah filenya.

```
scp target/*.jar root@162.243.7.44:/home/artivisi/
```

Untuk mendaftarkan menjadi `system service`, kita akan gunakan mekanisme `systemd` yang ada di Linux. Buat file konfigurasinya seperti ini

```
[Unit]
Description=belajarci
After=syslog.target
[Service]
User=artivisi
ExecStart=/home/artivisi/belajar-ci.jar
SuccessExitStatus=143
Environment=SPRING_PROFILES_ACTIVE=postgresql
[Install]
WantedBy=multi-user.target
```

Dan letakkan di server, dalam folder `/etc/systemd/system/` dengan nama file `belajarci.service`.

Set dulu permission file aplikasi `/home/artivisi/belajar-ci.jar` agar menjadi executable.

```
chmod +x /home/artivisi/belajar-ci.jar
```

Kemudian kita coba aktifkan servicenya. Jalankan perintah ini di server

```
systemctl enable belajarci.service
```

Outputnya seperti ini

```
Created symlink from /etc/systemd/system/multi-user.target.wants/belajarci.service to /etc/systemd/system/belajarci.
```

Kita coba jalankan, dan langsung pantau lognya untuk melihat apakah ada error.

```
service belajarci start && tail -f /var/log/syslog
```

Kalau tidak ada error di log, coba test browse ke aplikasinya, yaitu `http://162.243.7.44:8080/api/product/`

Harusnya kita akan mendapatkan output seperti ini

```json
{
  "content" : [ {
    "id" : "p001",
    "code" : "P-001",
    "name" : "Product 001",
    "price" : 101001.01
  } ],
  "last" : true,
  "totalPages" : 1,
  "totalElements" : 1,
  "size" : 20,
  "number" : 0,
  "sort" : null,
  "first" : true,
  "numberOfElements" : 1
}
```

Bila kita mengedit file `belajarci.service`, kita harus me-reload systemctl supaya perubahannya diproses

```
systemctl daemon-reload
```

Baru setelah itu kita restart

```
service belajarci restart
```

## Deployment dengan Jenkins ##

Setelah deployment manual berhasil, kita akan mengotomasinya supaya deployment selanjutnya dilakukan oleh Jenkins. Kita ingat-ingat lagi langkah-langkah deploymentnya:

1. Matikan aplikasi di server tujuan
2. Drop database dan create database. Ini untuk memastikan bahwa databasenya fresh. Ingat, `JANGAN DILAKUKAN DI SERVER PRODUCTION !!!`
3. Upload file aplikasi
4. Jalankan kembali aplikasinya

### Setup SSH Keypair ###

Kita perlu mendaftarkan public key SSH milik Jenkins di server tujuan. Ini kita lakukan supaya Jenkins tidak perlu mengetik username dan password untuk login ke server. Public keynya sudah kita buat pada [artikel terdahulu](http://software.endy.muhardin.com/java/jenkins-gitlab/).

Upload public key Jenkins ke server

```
scp jenkins.pub root@162.243.7.44:/root/
```

Kemudian login ke server

```
ssh root@162.243.7.44
```

Di server, kita sudah menemui file yang barusan kita upload. Daftarkan isi filenya ke daftar public key yang diijinkan untuk login tanpa password.

```
cat /root/jenkins.pub >> /root/.ssh/authorized_keys
```

Di sisi Jenkins, kita juga perlu mendaftarkan private key sekali lagi, agar bisa digunakan plugin `Publish Over SSH`. Pastikan pluginnya sudah terinstal.

Masuk ke menu `Manage Jenkins` > `Configure System`. Scroll ke bagian paling bawah, di sana ada konfigurasi untuk plugin `Publish Over SSH`. Isikan private key kita di sana.

![Konfigurasi Private Key]({{site.url}}/images/uploads/2017/jenkins-do/ssh-private-key.png)

Di bawahnya, masukkan informasi server kita. Bisa menggunakan alamat IP, atau nama domain bila sudah diset.

![Konfigurasi Server Tujuan]({{site.url}}/images/uploads/2017/jenkins-do/server-tujuan-deployment.png)

### Post Build Action ###

Selanjutnya, masuk ke konfigurasi project dalam Jenkins. Kita akan tambahkan `Post Build Action` seperti pada waktu [kita mendeploy ke Pivotal](http://software.endy.muhardin.com/java/deploy-jenkins-pivotal/).

![Konfigurasi Private Key]({{site.url}}/images/uploads/2017/jenkins-do/konfigurasi-post-build-action.png)

Di situ kita isikan:

* Nama server tujuan, pilih seperti yang sudah kita konfigurasi di menu `Manage Jenkins` > `Configure System` tadi.
* File yang ingin dikirim. Samakan saja dengan perintah `scp` kita pada saat deploy manual.
* Folder tujuan. Sama seperti perintah `scp` di atas.
* Perintah yang dijalankan pada saat deploy. Ini isinya seperti 4 langkah deployment yang sudah kita rekap tadi.

Selesai sudah. Coba jalankan build secara manual. Perhatikan console outputnya, pastikan berjalan dengan sukses.

## Penutup ##

Demikianlah cara deployment ke VPS dengan Jenkins. Memang tidak semudah mendeploy ke layanan PaaS. Cara ini bisa dipakai bila kita punya development server di LAN, ataupun bila manajemen memutuskan untuk punya server sendiri (colocation) atau menyewa layanan IaaS.

Semoga bermanfaat.

## Referensi ##

* [Automatically updating fat jar with Jenkins Publish over SSH](https://caffinc.github.io/2015/05/automatically-updating-fat-jar-with-jenkins-publish-over-ssh/)
* [Publish Over SSH Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Publish+Over+SSH+Plugin)
* [Publish Over Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Publish+Over)
