---
layout: post
title: "Workflow Pengembangan Aplikasi dengan Docker"
date: 2017-04-03 07:00
comments: true
categories:
- devops
---
Pada [artikel terdahulu](http://software.endy.muhardin.com/linux/intro-docker/), kita sudah membahas apa itu docker, bagaimana cara instalasinya, dan cara membuat docker image sederhana. Kali ini, kita akan lanjutkan tentang cara pemakaian docker untuk mendistribusikan aplikasi yang sudah kita buat.

Di artikel ini, kita akan membahas tentang:

* Use case / kegunaan docker dalam pengembangan aplikasi
* Workflow distribusi aplikasi dengan Docker
* Best practices arsitektur aplikasi yang menggunakan docker

<!--more-->
## Kegunaan Docker ##

Sebelum menggunakan suatu teknologi, terutama kita harus mempertanyakan terlebih dulu:

> Apa manfaatnya bila saya menggunakan teknologi ini?
> Apa keunggulannya dibandingkan cara yang biasa saya gunakan?

Untuk menjawab pertanyaan di atas, mari kita lihat dulu workflow yang biasa kita gunakan mulai dari coding sampai aplikasi bisa digunakan user (naik production). Ada beberapa langkah berikut, yaitu:

1. Mempaketkan aplikasi sesuai dengan bahasa pemrograman / framework yang digunakan. Kalau kita pakai Java, hasil akhir dari aplikasi kita biasanya berupa file `jar` atau `war`.

2. Menyiapkan environment untuk menjalankan aplikasi kita. Yang biasanya terdiri dari:

    * menyiapkan server, baik berupa fisik maupun virtual
	* menginstal sistem operasi
	* menginstal runtime bahasa pemrograman yang kita gunakan, misalnya Java SDK, `mod_php`, `mod_passanger`, dan lainnya
	* menginstal layanan yang digunakan aplikasi, misalnya database server, mail server, message broker, dan sebagainya
	* mengkonfigurasi layanan tambahan tersebut (setting pemakaian resource, membuat username/password, membuat database/queue/topic, dsb)
	* mengintegrasikannya dengan aplikasi kita

3. Menjalankan aplikasi. Biasanya aplikasi dideploy dalam berbagai environment (development, testing, staging, production).

Berbagai kegiatan di atas, terutama di poin #2, secara tradisional dilakukan oleh seorang sysadmin. Dia melakukan instalasi, menjalankan rangkaian perintah command line, copy/paste script, dan sebagainya. Semuanya dilakukan dengan manual.

Kelemahan dari cara manual ini adalah:

* tidak repeatable. Bila disuruh mengulangi, belum tentu sysadmin tersebut bisa menjalankannya dengan sama persis. Perbedaan satu opsi perintah bisa menjadikan hasil akhirnya berbeda.
* rawan terjadi kesalahan.
* sulit diotomasi

Untuk mengatasi masalah-masalah tersebut, kita bisa menggunakan Docker container. Docker container adalah satu paket image yang sudah berisi:

* sistem operasi
* platform runtime
* aplikasi kita
* beberapa konfigurasi yang bersifat static

Aplikasi yang sudah kita paketkan menjadi docker image bisa langsung dijalankan tanpa harus melalui 3 langkah di atas. Untuk layanan tambahan seperti database server, mail server, dan sebagainya, kita juga bisa mendapatkan docker image yang siap pakai. Image-image ini biasanya dibuat langsung oleh pembuat aplikasi tersebut. Misalnya image `ubuntu` dibuat langsung oleh karyawan Canonical. Karena mereka yang paham luar-dalam tentang aplikasinya, maka kita bisa yakin bahwa image yang dibuat berkualitas baik.

Proses pembuatan docker image ini juga bisa kita otomasi, sehingga bisa dijalankan dalam siklus continuous integration seperti yang sudah kita bahas di artikel terdahulu, misalnya [dengan Jenkins](http://software.endy.muhardin.com/java/jenkins-gitlab/) atau [menggunakan Travis](http://software.endy.muhardin.com/java/project-bootstrap-02/). Adapun memasukkan pembuatan docker image dalam proses CI ini akan kita bahas pada artikel tersendiri di kemudian hari.

Jadi, dengan menggunakan Docker, kita bisa menjalankan aplikasi kita dengan lebih cepat, lebih konsisten, repeatable, dan minim campur tangan manusia.

## Workflow Docker ##

Sebagai contoh kasus, kita akan membuat docker image untuk aplikasi contoh yang sudah sering kita tampilkan pada artikel terdahulu, yaitu [aplikasi `belajar-ci`](https://github.com/endymuhardin/belajar-ci). Aplikasi ini sudah memiliki beberapa kelengkapan standar aplikasi pada umumnya, yaitu:

* menggunakan database MySQL atau PostgreSQL
* berupa aplikasi web
* ada fitur CRUD (create read update delete)

Workflow development sampai deploymentnya adalah sebagai berikut:

1. Kita lakukan coding seperti biasa, testing, dan kita coba jalankan di laptop/PC sendiri
2. Setelah sukses, kita akan membuat docker image
3. Upload docker image tersebut ke docker repository. Yaitu database penyimpanan image-image docker.
4. Siapkan server untuk menjalankan aplikasi kita
5. Jalankan database server dari docker image ke server yang sudah disiapkan
6. Jalankan aplikasi kita dari docker image ke server tersebut
7. Test aplikasi apakah sudah bisa diakses

Untuk langkah pertama, tentu tidak perlu kita demokan lagi. Mari kita langsung jalankan langkah kedua.

### Membuat Docker Image ###

Docker image adalah aplikasi kita yang sudah lengkap dengan berbagai kebutuhan agar dia bisa jalan. Untuk aplikasi Java, berarti kita membutuhkan :

* sistem operasi. Silahkan pilih yang Anda sukai. Biasanya saya menggunakan keluarga Debian seperti Debian itu sendiri atau Ubuntu.
* Java Runtime. Silahkan pilih mau pakai OpenJDK atau Oracle JDK.

Karena docker image adalah produk akhir, kita tidak perlu menyertakan kelengkapan kompilasi seperti Maven atau Gradle. Bila ini kita sertakan, maka image kita akan menjadi terlalu besar dan kurang efisien. Kita ingin image yang seramping dan seminimal mungkin.

Docker image dibuat berlapis-lapis. Untuk menjalankan aplikasi Java kita, tidak perlu kita melakukan instalasi sistem operasi dan Java SDK. Cukup cari image dasar yang sudah memiliki keduanya. Untuk contoh ini, kita akan gunakan [image bernama `openjdk:latest`](https://hub.docker.com/_/openjdk/). Kita akan membuat image aplikasi kita di atas image ini.

Spesifikasi image yang akan dibuat ditulis dalam file `Dockerfile`. Berikut adalah isi `Dockerfile` untuk aplikasi kita.

```
FROM openjdk:latest
ADD target/belajar-ci.jar /opt/app.jar
RUN bash -c 'touch /opt/app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/opt/app.jar"]
```

Mari kita bahas baris per baris:

1. Baris pertama : `FROM openjdk:latest` artinya image kita ini akan dibangun di atas image `openjdk` dengan tag `latest`. Ada berbagai varian yang disediakan oleh pembuat image ini, lebih lengkapnya bisa dipilih [di lamannya dalam Docker Hub](https://hub.docker.com/_/openjdk/).

2. Baris kedua, `ADD target/belajar-ci.jar /opt/app.jar` artinya kita mengambil file `target/belajar-ci.jar` yang dihasilkan dari proses compile dan memasukkannya ke dalam container image dengan nama file `/opt/app.jar`.

3. Baris ketiga, kita melakukan `touch` terhadap file aplikasi kita supaya Docker mengubah metadata tanggal perubahan terakhir file (modification time). Metadata ini dibutuhkan bila ada file `html`, `css`, atau file static lain di aplikasi kita yang ingin dicache.

4. Kita menjalankan aplikasi pada saat docker image dijalankan, yaitu dengan perintah `java -Djava.security.egd=file:/dev/./urandom -jar /opt/app.jar`. Bila ada opsi lain seperti pengaturan memori (`Xms` dan `Xmx`), kita bisa tambahkan di sini.

Seperti dijelaskan di atas, yang kita sertakan hanyalah hasil akhir saja, yaitu file `jar` yang ada di dalam folder `target`. Oleh karena itu, sebelum membuat image, pastikan kita sudah menjalankan maven build dengan perintah `mvn clean package`.

Untuk bisa menjalankan docker build, kita harus sudah memiliki docker machine. Bila belum ada, kita bisa buat di local dengan menggunakan VirtualBox

```
docker-machine create --driver virtualbox docker-vbox
```

atau di Digital Ocean dengan perintah berikut

```
docker-machine create --driver digitalocean --digitalocean-size 1gb --digitalocean-access-token yaddayaddayadda docker-ocean
```

Setelah membuat docker machine, inisialisasi dulu environment variable di laptop kita

```
eval $(docker-machine env docker-ocean)
```

Ganti `docker-ocean` dengan `docker-vbox` atau apapun nama yang kita berikan pada command `create` tadi.

Setelah `docker-machine` siap dan proses build Maven selesai, kita bisa membuat Docker image dengan perintah berikut

```
docker build -t endymuhardin/belajar-ci .
```

> PERHATIAN !!! Jangan lupa ada titik di paling belakang. Banyak error disebabkan lupa pakai titik

Titik di belakang artinya proses build dilakukan di folder tempat sekarang command prompt berada. Docker akan mencari file bernama `Dockerfile` di folder ini. Demikian juga, file yang kita `ADD` dalam `Dockerfile` dicari di folder bernama `target` relatif dari lokasi folder kerja (yaitu `.` atau folder tempat command prompt berada).

> PERINGATAN !!! Perintah di atas membutuhkan koneksi internet upstream yang tinggi. Pastikan Anda menggunakan paket internet non-kuota berkecepatan upload yang tinggi.

Outputnya seperti ini

```
Sending build context to Docker daemon 32.37 MB
Step 1/4 : FROM openjdk:latest
latest: Pulling from library/openjdk
6d827a3ef358: Pull complete
2726297beaf1: Pull complete
7d27bd3d7fec: Pull complete
e61641c845ed: Pull complete
cce4cca5b76b: Pull complete
6826227500b0: Pull complete
c03b117ffd91: Pull complete
821a1547b435: Pull complete
Digest: sha256:766764155b350a6fe09c3e9592901523c0c7fd969575e431c5c3373988a1b169
Status: Downloaded newer image for openjdk:latest
 ---> 4c3d59cc5179
Step 2/4 : ADD target/belajar-ci.jar /opt/app.jar
 ---> 57d2499a7644
Removing intermediate container 80a87d7b2244
Step 3/4 : RUN bash -c 'touch /opt/app.jar'
 ---> Running in e909cf439453
 ---> ddb2da23bea0
Removing intermediate container e909cf439453
Step 4/4 : ENTRYPOINT java -Djava.security.egd=file:/dev/./urandom -jar /opt/app.jar
 ---> Running in 8870d12261ba
 ---> 73bbe644ddd0
Removing intermediate container 8870d12261ba
Successfully built 73bbe644ddd0
```

### Mengupload Image ###

Aplikasi kita sudah menjadi docker image yang siap dijalankan. Kita bisa upload image ini ke docker registry agar bisa digunakan orang lain. Docker registry yang resmi adalah [Docker Hub](https://hub.docker.com). Untuk bisa mengupload kesana, kita harus punya username dan password dulu. Untuk paket gratisan, kita bisa mendapatkan satu repository private yang gratis. Bila kita butuh lebih banyak, kita bisa gunakan [paket berbayar](https://hub.docker.com/billing-plans/).

Setelah mendaftar dan punya akun, kita bisa mengupload image kita tadi.

Login dulu sebelum upload

```
docker login
Login with your Docker ID to push and pull images from Docker Hub. If you don't have a Docker ID, head over to https://hub.docker.com to create one.
Username: endymuhardin
Password:
Login Succeeded
```

Setelah itu, upload.

```
docker push endymuhardin/belajar-ci
The push refers to a repository [docker.io/endymuhardin/belajar-ci]
e8f4377e3c8c: Pushed
159fcd9952aa: Pushed
f275a9671865: Mounted from library/openjdk
d41a2873a531: Mounted from library/openjdk
f3d32870c777: Mounted from library/openjdk
6c88f2235003: Mounted from library/openjdk
ca026307de2c: Mounted from library/openjdk
e6562eb04a92: Mounted from library/openjdk
596280599f68: Mounted from library/openjdk
5d6cbe0dbcf9: Mounted from library/openjdk
latest: digest: sha256:4f4d1f5b831f61040fbc25266c897f025b4cdd1f05ca6c5730a56984cbed1688 size: 2424
```

Hasilnya bisa kita lihat di [halaman repository kita di DockerHub](https://hub.docker.com/r/endymuhardin/belajar-ci/tags/)

![Repository Belajar CI]({{site.url}}/images/uploads/2017/docker-workflow/dockerhub-repository.png)

### Menggabungkan Docker Container dengan Compose ###

Bila pembaca teliti, di `Dockerfile` kita tadi tidak ada kita melakukan instalasi database. Padahal aplikasi kita membutuhkan database supaya bisa bekerja dengan baik. Docker image memang sebaiknya tidak rangkap jabatan. Aplikasi ya aplikasi saja, jangan dicampur dengan database. Kita menjalankan image database secara terpisah, kemudian kita sambungkan dengan aplikasi kita.

Untuk memudahkan kita menjalankan beberapa container sekaligus dan menghubungkannya, Docker sudah menyediakan fasilitas yang disebut dengan `Docker Compose`. Kita membuat file konfigurasi untuk menjalankan beberapa container sekaligus (misalnya aplikasi kita dan database MySQL) dan menghubungkannya. Berikut adalah file konfigurasinya, kita beri nama `docker-compose.yml`

```yml
version: "2.1"

services:
  mysql:
    image: mysql:latest
    environment:
      - MYSQL_ROOT_PASSWORD=admin
      - MYSQL_DATABASE=belajar
      - MYSQL_USER=belajar
      - MYSQL_PASSWORD=java
    volumes:
      - /opt/data:/var/lib/mysql

  belajarci-app:
    image: endymuhardin/belajar-ci
    environment:
      - SPRING_PROFILES_ACTIVE=docker
    depends_on:
      - mysql
    ports:
      - 80:8080
```

Berikut penjelasan dari file tersebut:

* Kita menggunakan konfigurasi versi `2.1`. Saat ini versinya sudah mencapai 3. Tapi kita gunakan versi 2.1 yang lebih banyak disupport.

* Kita mendeklarasikan 2 container service, yaitu database `mysql` dan aplikasi kita sendiri yaitu `belajarci-app`.

* Untuk container database, kita mengambil image `mysql:latest` dari DockerHub. Kita berikan environment variable untuk menginisialisasi database yang dibutuhkan aplikasi kita. Dokumentasi lengkap cara inisialisasinya bisa dibaca sendiri [di DockerHub](https://hub.docker.com/_/mysql/).

* Kita mendeklarasikan volume, yaitu mapping folder di host ke folder dalam container. Ini kita lakukan supaya filenya persistent (ada terus). Bila tidak kita mapping ke host, maka pada waktu container dihapus, datanya ikut terhapus. Tentu kita tidak mau hal ini terjadi pada isi database kita. Oleh karena itu, folder `/var/lib/mysql` yang biasanya digunakan MySQL untuk menyimpan data, kita mapping ke folder `/opt/data` di mesin host.

* Untuk container aplikasi, kita berikan environment variable dengan nama `SPRING_PROFILES_ACTIVE` yang isinya `docker`. Ini menyebabkan Spring Boot akan membaca file konfigurasi yang bernama `application-docker.properties`. Isinya hanya satu baris sebagai berikut:

		spring.datasource.url=jdbc:mysql://mysql/belajar

* Pada file konfigurasi di atas, kita membutuhkan ada database server yang berjalan dengan nama host `mysql`. Docker secara otomatis akan memberi hostname masing-masing container dengan nama servicenya, yaitu `mysql` untuk service pertama, dan `belajarci-app` untuk service kedua.

* Agar container aplikasi kita bisa tahu alamat IP container database, kita gunakan konfigurasi `depends_on`. Ini akan menyebabkan docker menulis entri di file `/etc/hosts` container aplikasi yang berisi mapping hostname `mysql` ke alamat IP container database.

* Terakhir, kita mapping port aplikasi kita yang berjalan di `8080` ke port `80` di mesin host. Sehingga kita bisa akses aplikasinya dengan url `http://ip-docker-machine/api/product/`.

Alamat IP docker-machine bisa didapatkan dengan perintah `docker-machine env docker-ocean`. Outputnya seperti ini

```
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://138.197.101.3:2376"
export DOCKER_CERT_PATH="/Users/endymuhardin/.docker/machine/machines/docker-ocean"
export DOCKER_MACHINE_NAME="docker-ocean"
# Run this command to configure your shell:
# eval $(docker-machine env docker-ocean)
```

Dengan demikian, aplikasi kita bisa diakses di http://138.197.101.3/api/product/

### Menjalankan Docker Compose ###

Kita bisa menjalankan rangkaian container kita tadi dengan perintah berikut:

		docker-compose up

Dengan perintah di atas, `docker-compose` akan menjalankan container `mysql` dan `belajarci-app`, kemudian menghubungkan keduanya. Kita bisa test hasilnya dengan mengakses alamat IP docker host seperti sudah dijelaskan di atas. Untuk mematikan container, kita bisa tekan `Ctrl-C`.

Bila kita ingin `docker-compose` sebagai background service (supaya kita bisa mematikan command prompt), tambahkan opsi `-d` seperti ini

		docker-compose up -d

Bila ada perubahan terhadap kode program aplikasi kita, jalankan proses build maven/gradle seperti biasa

		mvn clean package

Kemudian rebuild docker image dan kemudian push. Setelah itu restart container web kita

		docker-compose up --no-deps belajarci-app

Opsi `--no-deps` digunakan agar service lain yang bergantung pada `belajarci-app` tidak ikut direstart.

### Memeriksa Volume Mapping ###

Pada konfigurasi di atas, kita menggunakan volume mapping agar data dari MySQL kita tersimpan di mesin fisik.

Kita bisa memastikan bahwa MySQL benar-benar menulis ke folder `/opt/data` di host dengan cara login ke `docker-machine`.

```
docker-machine ssh docker-ocean
```

Outputnya seperti ini

```
Welcome to Ubuntu 16.04.2 LTS (GNU/Linux 4.4.0-66-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

2 packages can be updated.
0 updates are security updates.
```

Kemudian, kita lihat isi folder `/opt/data`

```
root@docker-ocean:~# ls -l /opt/data/
total 188480
-rw-r----- 1 999 docker       56 Apr  3 11:28 auto.cnf
drwxr-x--- 2 999 docker     4096 Apr  3 11:28 belajar
-rw------- 1 999 docker     1679 Apr  3 11:28 ca-key.pem
-rw-r--r-- 1 999 docker     1074 Apr  3 11:28 ca.pem
-rw-r--r-- 1 999 docker     1078 Apr  3 11:28 client-cert.pem
-rw------- 1 999 docker     1679 Apr  3 11:28 client-key.pem
-rw-r----- 1 999 docker     1328 Apr  3 11:28 ib_buffer_pool
-rw-r----- 1 999 docker 79691776 Apr  3 11:28 ibdata1
-rw-r----- 1 999 docker 50331648 Apr  3 11:29 ib_logfile0
-rw-r----- 1 999 docker 50331648 Apr  3 11:28 ib_logfile1
-rw-r----- 1 999 docker 12582912 Apr  3 11:28 ibtmp1
drwxr-x--- 2 999 docker     4096 Apr  3 11:28 mysql
drwxr-x--- 2 999 docker     4096 Apr  3 11:28 performance_schema
-rw------- 1 999 docker     1679 Apr  3 11:28 private_key.pem
-rw-r--r-- 1 999 docker      451 Apr  3 11:28 public_key.pem
-rw-r--r-- 1 999 docker     1078 Apr  3 11:28 server-cert.pem
-rw------- 1 999 docker     1675 Apr  3 11:28 server-key.pem
drwxr-x--- 2 999 docker    12288 Apr  3 11:28 sys
```

Yang biasa menggunakan MySQL pasti familiar dengan nama-nama file dan folder di atas. Ya benar, itu mirip dengan isi folder `/var/lib/mysql` yang biasa kita temui di instalasi MySQL standar.

Folder `/opt/data` ini akan terus ada selama belum kita hapus secara manual, walaupun containernya kita destroy.

## Penutup ##

Demikianlah cara pemaketan aplikasi dengan menggunakan Docker. Seperti kita sudah lihat, dengan cara ini aplikasi kita menjadi lebih mudah dideploy. Tidak perlu lagi repot-repot menginstal Java SDK, database MySQL, konfigurasi user/password database, membuat database, dan lainnya. Instalasi kita di atas juga sudah memisahkan antara host aplikasi dan host database. Walaupun secara fisik masih berada di mesin yang sama, akan tetapi aplikasi kita melihat database berada di mesin berbeda.

Bila nantinya aplikasi kita akan naik production, sysadmin cukup menginisialisasi database container dengan username/password/nama-database yang berbeda dengan yang digunakan developer.

Docker ini sudah didukung berbagai provider cloud yang populer seperti:

* Digital Ocean
* Amazon
* Google
* Microsoft Azure
* dan sebagainya

Dengan adanya Docker, kita sebagai developer bisa mendeliver bukan saja aplikasi kita, tapi lengkap dengan environment tempat dia dijalankan, sehingga sysadmin/operation bisa langsung menjalankannya dengan mudah. Mereka tinggal memilih provider hosting yang paling disukai.

Pada artikel selanjutnya insya Allah kita akan membahas tentang otomasi proses ini dengan Continuous Integration, dan kemudian clustering dan replikasi aplikasi kita yang sudah dipaketkan dalam container. Stay tuned ;)
