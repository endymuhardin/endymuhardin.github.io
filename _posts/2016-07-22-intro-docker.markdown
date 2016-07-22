
---
layout: post
title: "Intro Docker"
date: 2016-07-22 17:00
comments: true
categories: 
- linux
---

Beberapa tahun terakhir ini, terjadi perubahan yang cukup signifikan dalam hal deployment aplikasi. Untuk menjalankan aplikasi yang serius, sebelumnya kita perlu membeli server dulu, melakukan instalasi sistem operasi dan kelengkapan software lainnya, menginstal aplikasi yang kita buat, kemudian melakukan tuning dan hardening. Setelah itu, kita harus menyewa tempat di perusahaan penyedia internet dan menitipkan server kita tadi di sana. Kegiatan tersebut relatif merepotkan. Belum lagi urusan yang menyertainya seperti pemeliharaan hardware, update software, backup, dan lainnya. 

Di jaman sekarang, banyak perusahaan yang menyediakan layanan cloud. Mereka menangani segala urusan repot tadi, sehingga kita cukup memikirkan pembuatan dan pemeliharaan aplikasi kita sendiri. Tidak perlu lagi pusing memikirkan urusan hardware dan software lain yang dibutuhkan. 

Salah satu teknologi yang sedang hot di tahun 2015-2016 ini adalah [Docker](https://www.docker.com/). Dalam serangkaian artikel, kita akan bahas: 

* Apa itu Docker?
* Bagaimana menjalankan aplikasi Java dalam Docker?
* Bagaimana menjalankan proses build dalam Docker?
* Bagaimana menjalankan proses Continuous Delivery dengan Docker?

<!--more-->

## Apa itu Docker ? ##

Docker adalah salah satu bentuk dari virtualisasi. Mari kita bahas dulu apa itu virtualisasi. 

### Memahami Virtualisasi ###

Virtualisasi adalah kegiatan membuat virtual machine, atau mesin palsu. 

> Apa itu mesin palsu?

Secara sederhana, virtual machine adalah lawan kata dari physical machine atau mesin fisik. Physical machine adalah server seperti yang biasa kita beli dan gunakan, memiliki berbagai komponen seperti power supply, mainboard, memory, disk, dan sebagainya. Komponen ini bisa kita lihat dan pegang bendanya. 

Virtual machine adalah seolah-olah ada mesin dan komponen tersebut. Aplikasi merasa bahwa dia berjalan sendirian dalam satu mesin, walaupun sebenarnya dia berjalan di atas mesin lain, bersama-sama dengan aplikasi lain. 

> Untuk apa dipalsukan? 

Ada beberapa keperluan, diantaranya:

* kita ingin menjalankan sistem operasi yang berbeda. Misalnya laptop kita menggunakan MacOS, tapi ingin menjalankan Windows atau Linux
* kita ingin memaksimalkan penggunaan mesin fisik. Daripada satu aplikasi satu mesin, lebih baik beberapa aplikasi dijalankan di mesin yang sama. Virtualisasi menyediakan pemisahan antar aplikasi sehingga tidak saling mengganggu.
* keterbatasan ruang dan sumber daya (listrik, AC)

Karena ada beberapa sistem operasi yang berjalan dalam satu mesin fisik, kita menggunakan istilah host (tuan rumah) dan guest (tamu) untuk membedakannya. Host adalah sistem operasi yang benar-benar diinstal di mesin fisik. Guest adalah sistem yang diinstal di atas host.

Secara garis besar, ada dua strategi yang umum digunakan dalam membuat virtualisasi ini:

* hypervisor / full virtualization
* container / partial virtualization

Pada hypervisor, semua hardware dibuatkan palsunya, dan masing-masing sistem guest mendapatkan satu set hardware palsu tadi. Kalau digambarkan, strategi hypervisor terlihat seperti ini

[![Skema Hypervisor](https://lh3.googleusercontent.com/KVLalZ4_mMDOXBGq0bh2uyYkgU1e0S2NvswA3rERlJafbkFmMVXl3jko7_DDhusPAG0UfAY6rDnb=w800-no)](https://lh3.googleusercontent.com/KVLalZ4_mMDOXBGq0bh2uyYkgU1e0S2NvswA3rERlJafbkFmMVXl3jko7_DDhusPAG0UfAY6rDnb=w800-no)

Sedangkan pada strategi container, semua guest berbagi pakai sebagian besar hardware. Host cuma mengatur pemisahan folder dan ijin akses antar guest sehingga tidak bisa saling melihat. Kalau kita ilustrasikan, kira-kira gambarnya seperti ini

[![Skema Container](https://lh3.googleusercontent.com/loB_DRpmMrvifR816TiLF4gHqNbaSD4GQG94sQJ7xatlzWC2qfqHLjh1KS-ecS6UiyFc96rRXlcU=w800)](https://lh3.googleusercontent.com/loB_DRpmMrvifR816TiLF4gHqNbaSD4GQG94sQJ7xatlzWC2qfqHLjh1KS-ecS6UiyFc96rRXlcU=w800)

Masing-masing tentunya ada plus dan minusnya. Bila kita menggunakan hypervisor:

* sistem operasi host dan guest tidak ada hubungan sama sekali. Jadi kita bisa menginstal sistem operasi apapun sebagai guest.
* overhead lebih tinggi, karena adanya hardware palsu. Konsekuensinya, performance menjadi lebih terbatas. Penggunaan resource juga tidak bisa terlalu dioptimalkan, karena begitu sudah dibooking oleh salah satu guest tidak bisa digunakan guest lain, walaupun guest pertama sedang santai.
* lebih mudah mengatur security, karena hubungan antara host dan guest sangat sedikit.

Bila kita menggunakan container:

* sistem operasi guest berbagai kernel dan aplikasi utama dengan host. Dengan demikian kita tidak bisa menginstal sistem operasi yang berbeda dengan host, seperti Windows di host Linux.
* penggunaan resource hardware bisa lebih dioptimalkan. Karena host mengetahui secara detail kondisi masing-masing guest, maka dia bisa mengalokasikan resource yang menganggur kepada guest yang sedang sibuk.
* pengaturan security menjadi lebih sulit, karena host dan guest berhubungan erat, sehingga mungkin terjadi kebocoran antar guest.

### Produk Virtualisasi ###

Ada banyak produk virtualisasi yang beredar di pasaran, diantaranya

Yang berbasis hypervisor

* Oracle Virtualbox
* VMWare
* KVM
* Microsoft Hyper-V

Yang berbasis container

* OpenVZ
* LXC

Dari seluruh pilihan ini, kita akan membahas Docker. Saat ini Docker sedang naik daun, dan digunakan orang-orang untuk mendeploy aplikasi mereka. Komunitasnya juga sangat aktif, sehingga banyak aplikasi-aplikasi yang dikembangkan untuk mendukung dan memudahkan deployment dengan Docker. Saking banyaknya aplikasi tersebut, sulit untuk mengetahui fungsi, kegunaan, dan status development dari masing-masingnya. Bila Anda ingin mengetahui lebih jauh, silahkan baca petanya [di sini](https://www.mindmeister.com/389671722/docker-ecosystem).

Topik pembahasan kita pada artikel ini -- yaitu Docker -- pada awalnya menggunakan LXC sebagai basisnya. Akan tetapi pada rilis 0.9 di tahun 2014, Docker mengganti LXC dengan libcontainer yang dikembangkan sendiri oleh programmer Docker. Kita tidak akan bahas panjang lebar tentang perbedaan antara keduanya. Bagi mereka yang kepo, dipersilahkan membaca [artikel ini](http://jancorg.github.io/blog/2015/01/03/libcontainer-overview/) dan [artikel itu](https://www.flockport.com/lxc-vs-docker/) yang membahas perbedaan keduanya. Dengan mengadopsi libcontainer, Docker bisa berjalan di berbagai platform, seperti yang dijelaskan dalam [artikel InfoWorld ini](http://www.infoworld.com/article/2607966/application-virtualization/4-reasons-why-docker-s-libcontainer-is-a-big-deal.html).

## Konsep Docker ##

Docker terdiri dari beberapa komponen, seperti digambarkan dalam diagram berikut

![Arsitektur Docker](https://lh3.googleusercontent.com/G48TWSnpblDOtKAs-21yhCGPjBJandKPT7ShEdVbhrHffbbt3DicQkj3Y97YYbIUHmWI32aY90e4=w600-h314-no)

_Gambar diambil dari [sini](https://docs.docker.com/engine/understanding-docker/)_

Untuk memahami diagram tersebut, kita perlu memahami beberapa istilah yang digunakan di dunia Docker

* Docker Container : adalah virtual machine atau guest operating system. Aplikasi kita berjalan di dalam docker container dan merasa bahwa dia berjalan di dalam sistem operasi biasa. Docker container berjalan di atas docker engine.
* Docker Client : adalah seperangkat perintah command line untuk mengoperasikan docker container, misalnya membuat container, start/stop container, menghapus (destroy), dan sebagainya. Docker client hanya bertugas mengirim perintah saja. Pekerjaan sesungguhnya dilakukan oleh docker daemon.
* Docker Daemon : adalah aplikasi yang berjalan di host machine. Docker server berjalan di background (sebagai daemon) dan menunggu perintah dari docker client. Begitu mendapatkan perintah, docker server bekerja membuat container, menjalankan/mematikan container, dan sebagainya.
* Docker Engine : adalah gabungan aplikasi yang menjalankan docker container, docker client, dan docker daemon. Dia menyediakan layanan umum agar container dapat berjalan dengan baik, misalnya: networking, storage, alokasi memori, CPU, dan sebagainya.
* Docker Image : adalah template yang digunakan untuk membuat container. Contohnya, ada image Ubuntu, CentOS, dan sebagainya. Kita juga bisa membuat image baru dari image yang lama. Misalnya kita buat image Ubuntu yang sudah terinstal Java dan MySQL.
* Docker Machine : adalah sistem untuk mengelola docker engine. Dia bisa menginstal engine baru di berbagai target. Saat ini dia mendukung VirtualBox, Digital Ocean, dan Amazon. Dengan Docker Machine, kita bisa membuat dan menjalankan container dengan docker client, dan hasilnya container kita berjalan di local (dengan VirtualBox) atau di cloud (dengan DigitalOcean atau Amazon).

Perbedaan antara Docker Engine dan Docker Machine dapat dilihat pada ilustrasi berikut. Docker engine terdiri dari docker client, daemon, dan container runtime seperti ini

[![Docker Engine](https://lh3.googleusercontent.com/wKZstwquZqf0qhBJLYHnIaBoJu8J2l2avxvzCywiKOmj0D4hf4XKnOy4ffw2Malz7fGs6p6RReC1=w800)](https://lh3.googleusercontent.com/wKZstwquZqf0qhBJLYHnIaBoJu8J2l2avxvzCywiKOmj0D4hf4XKnOy4ffw2Malz7fGs6p6RReC1=w800)

Sedangkan docker machine bertugas untuk menyiapkan docker engine di target deployment, seperti ini

[![Docker Machine](https://lh3.googleusercontent.com/HsajbHv3NEd5yHaDk4U_olaaWO6rU8A8dk1FVaBccLL-k6wJurXNHKsBZRPMOIxAG6d7SSLWdiF8=w800)](https://lh3.googleusercontent.com/HsajbHv3NEd5yHaDk4U_olaaWO6rU8A8dk1FVaBccLL-k6wJurXNHKsBZRPMOIxAG6d7SSLWdiF8=w800)

Kedua gambar di atas diambil dari [dokumentasi Docker](https://docs.docker.com/machine/overview/).

* Docker Compose. Best practices dalam Docker adalah menjalankan satu proses dalam satu container. Misalnya, bila kita ingin menjalankan Wordpress, kita butuh satu container untuk webserver, satu container untuk database server, satu container untuk menyimpan data dari database server, dan satu container lagi untuk menyimpan file dari webserver. Untuk memudahkan pengelolaannya, Docker menyediakan aplikasi yang bernama Docker Compose.
* Docker Swarm. Ini adalah solusi clustering yang disediakan oleh docker.

## Instalasi Docker ##

Instalasi Docker tidak akan kita bahas panjang lebar, karena cara dan langkah-langkahnya bisa berubah-ubah seiring waktu. Silahkan lihat [dokumentasi di website docker](https://docs.docker.com/engine/installation/).

Sebaiknya instalasi dilakukan dengan koneksi internet yang mumpuni dan tidak terbatas kuota. Pada saat instalasi, kita akan mendownload image berukuran ratusan MB.

Setelah instalasi selesai, pastikan kita bisa menjalankan perintah berikut di command line.

```
docker --version
```

Outputnya sebagai berikut

```
Docker version 1.10.3, build 20f81dd
```

Cek juga apakah `docker-machine` sudah terinstal.

```
docker-machine --version
```

Outputnya seperti ini

```
docker-machine version 0.6.0, build e27fb87
```

Dengan kedua aplikasi tersebut, kita sudah bisa bermain-main dengan Docker. Sebagian besar tutorial di internet mengajarkan kita untuk menjalankan docker di laptop kita sendiri. Akan tetapi, saya tidak menganjurkan Anda untuk melakukannya. Proses pembuatan image docker sangat rakus internet. Sekali membuat image, dia akan mendownload beratus-ratus megabytes. Ini tidak masalah kalau koneksi internet kita kencang dan bebas kuota. Tapi kalau kita pakai paket data provider seluler, siap-siap saja mengeluarkan [jurus Izanagi](http://naruto.wikia.com/wiki/Izanagi) dengan kartu perdana internet :D

![Danzo Izanagi](https://lh3.googleusercontent.com/QT-5o3C5xuUyK0uP1r_YLO1CfJFAG-U4c8jxzNvzq_RHN0JFmvnQWeZ6YFZickgq49Eyq5Ul7ypL=w560-h315-no)

Untungnya, ada solusi yang lebih quota-friendly, yaitu menggunakan layanan cloud. Dengan menjalankan Docker Machine di cloud, kita menggunakan koneksi internet server virtual kita untuk membuat image. Sedangkan kuota yang kita gunakan hanya sebatas untuk koneksi SSH ke server kita.

Docker mendukung berbagai cloud services, diantaranya:

* Amazon Web Services
* Microsoft Azure
* Digital Ocean
* [dan sebagainya](https://docs.docker.com/machine/drivers/)

Kali ini kita akan gunakan cloud provider murah meriah, Digital Ocean.

## Menjalankan Docker Machine di Cloud Services ##

Di Digital Ocean, kita bisa langsung membuat VPS dan menyiapkan docker machine dalam satu perintah. 

```
docker-machine create --driver digitalocean --digitalocean-size 1gb --digitalocean-access-token yaddayaddayadda docker-ocean
```

Kita bisa mengatur berbagai variabel dengan perintah tersebut, pada contoh di atas, yang diatur adalah:

* ukuran VPS, yaitu 1gb
* nama docker machine, sekaligus nama VPS, yaitu `docker-ocean`

Berikut adalah output dari perintah tersebut

```
Running pre-create checks...
Creating machine...
(docker-ocean) Creating SSH key...
(docker-ocean) Creating Digital Ocean droplet...
(docker-ocean) Waiting for IP address to be assigned to the Droplet...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with ubuntu(systemd)...
Installing Docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env docker-ocean
```

Pastikan kita mengisi API token Digital Ocean dengan benar. Setelah perintah tersebut dijalankan, kita bisa mulai menjalankan docker image.

Sebelum mulai menjalankan perintah docker, terlebih dulu kita harus menginisialisasi environment variable di command prompt yang kita pakai. Gunakan perintah berikut untuk melakukan inisialisasi

```
eval $(docker-machine env docker-ocean)
```

Perintah tersebut akan menaruh variabel yang dibutuhkan Docker, seperti lokasi alamat IP docker-machine, sertifikat SSL, dan sebagainya. Kita bisa lihat daftar variabelnya dengan menjalankan perintah tersebut tanpa `eval`

```
docker-machine env docker-ocean
```

berikut adalah outputnya

```
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://104.131.94.223:2376"
export DOCKER_CERT_PATH="/Users/endymuhardin/.docker/machine/machines/docker-ocean"
export DOCKER_MACHINE_NAME="docker-ocean"
# Run this command to configure your shell: 
# eval $(docker-machine env docker-ocean)
```

## Menjalankan Docker Image ##

Selanjutnya, kita bisa menjalankan Docker image yang sudah dibuatkan orang lain. Sebagai contoh, mari kita jalankan Tomcat Server.

```
docker run -it --rm -p 8888:8080 tomcat:8.5
```

Kita bisa lihat dari outputnya bahwa docker mulai bekerja mengunduh image dan menjalankan service. 

```
Unable to find image 'tomcat:8.5' locally
8.5: Pulling from library/tomcat
5c90d4a2d1a8: Pull complete 
ab30c63719b1: Pull complete 
be275827e8b7: Pull complete 
4cbd0b70645a: Pull complete 
7d811bfac6eb: Pull complete 
d35e5f0a148b: Extracting 45.12 MB/53.37 MB
a17d585d8b66: Download complete 
1b424810697e: Download complete 
ecbe3919f2cd: Download complete 
f6d7b2464610: Download complete 
1b51665f96fb: Download complete 
74b0dba450b9: Download complete 
Digest: sha256:1adbbf78f7fae48233d3734905152fe1fec3a43a0cdc64dc926a71ecb2744809
Status: Downloaded newer image for tomcat:8.5
Using CATALINA_BASE:   /usr/local/tomcat
Using CATALINA_HOME:   /usr/local/tomcat
Using CATALINA_TMPDIR: /usr/local/tomcat/temp
Using JRE_HOME:        /usr/lib/jvm/java-8-openjdk-amd64/jre
Using CLASSPATH:       /usr/local/tomcat/bin/bootstrap.jar:/usr/local/tomcat/bin/tomcat-juli.jar
22-Jul-2016 09:13:33.980 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server version:        Apache Tomcat/8.5.4
22-Jul-2016 09:13:33.988 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server built:          Jul 6 2016 08:43:30 UTC
22-Jul-2016 09:13:33.988 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Server number:         8.5.4.0
22-Jul-2016 09:13:33.989 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log OS Name:               Linux
22-Jul-2016 09:13:33.989 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log OS Version:            4.2.0-27-generic
22-Jul-2016 09:13:33.990 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Architecture:          amd64
22-Jul-2016 09:13:33.991 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Java Home:             /usr/lib/jvm/java-8-openjdk-amd64/jre
22-Jul-2016 09:13:33.991 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log JVM Version:           1.8.0_91-8u91-b14-1~bpo8+1-b14
22-Jul-2016 09:13:33.992 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log JVM Vendor:            Oracle Corporation
22-Jul-2016 09:13:33.993 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log CATALINA_BASE:         /usr/local/tomcat
22-Jul-2016 09:13:33.993 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log CATALINA_HOME:         /usr/local/tomcat
22-Jul-2016 09:13:33.994 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Command line argument: -Djava.util.logging.config.file=/usr/local/tomcat/conf/logging.properties
22-Jul-2016 09:13:33.995 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Command line argument: -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager
22-Jul-2016 09:13:34.002 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Command line argument: -Djdk.tls.ephemeralDHKeySize=2048
22-Jul-2016 09:13:34.003 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Command line argument: -Dcatalina.base=/usr/local/tomcat
22-Jul-2016 09:13:34.004 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Command line argument: -Dcatalina.home=/usr/local/tomcat
22-Jul-2016 09:13:34.004 INFO [main] org.apache.catalina.startup.VersionLoggerListener.log Command line argument: -Djava.io.tmpdir=/usr/local/tomcat/temp
22-Jul-2016 09:13:34.005 INFO [main] org.apache.catalina.core.AprLifecycleListener.lifecycleEvent Loaded APR based Apache Tomcat Native library 1.2.8 using APR version 1.5.1.
22-Jul-2016 09:13:34.006 INFO [main] org.apache.catalina.core.AprLifecycleListener.lifecycleEvent APR capabilities: IPv6 [true], sendfile [true], accept filters [false], random [true].
22-Jul-2016 09:13:34.006 INFO [main] org.apache.catalina.core.AprLifecycleListener.lifecycleEvent APR/OpenSSL configuration: useAprConnector [false], useOpenSSL [true]
22-Jul-2016 09:13:34.013 INFO [main] org.apache.catalina.core.AprLifecycleListener.initializeSSL OpenSSL successfully initialized (OpenSSL 1.0.2h  3 May 2016)
22-Jul-2016 09:13:34.223 INFO [main] org.apache.coyote.AbstractProtocol.init Initializing ProtocolHandler ["http-nio-8080"]
22-Jul-2016 09:13:34.266 INFO [main] org.apache.tomcat.util.net.NioSelectorPool.getSharedSelector Using a shared selector for servlet write/read
22-Jul-2016 09:13:34.269 INFO [main] org.apache.coyote.AbstractProtocol.init Initializing ProtocolHandler ["ajp-nio-8009"]
22-Jul-2016 09:13:34.273 INFO [main] org.apache.tomcat.util.net.NioSelectorPool.getSharedSelector Using a shared selector for servlet write/read
22-Jul-2016 09:13:34.276 INFO [main] org.apache.catalina.startup.Catalina.load Initialization processed in 1380 ms
22-Jul-2016 09:13:34.337 INFO [main] org.apache.catalina.core.StandardService.startInternal Starting service Catalina
22-Jul-2016 09:13:34.338 INFO [main] org.apache.catalina.core.StandardEngine.startInternal Starting Servlet Engine: Apache Tomcat/8.5.4
22-Jul-2016 09:13:34.369 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deploying web application directory /usr/local/tomcat/webapps/host-manager
22-Jul-2016 09:13:35.391 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory /usr/local/tomcat/webapps/host-manager has finished in 1,022 ms
22-Jul-2016 09:13:35.399 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deploying web application directory /usr/local/tomcat/webapps/docs
22-Jul-2016 09:13:35.462 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory /usr/local/tomcat/webapps/docs has finished in 63 ms
22-Jul-2016 09:13:35.470 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deploying web application directory /usr/local/tomcat/webapps/examples
22-Jul-2016 09:13:36.256 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory /usr/local/tomcat/webapps/examples has finished in 786 ms
22-Jul-2016 09:13:36.257 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deploying web application directory /usr/local/tomcat/webapps/ROOT
22-Jul-2016 09:13:36.307 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory /usr/local/tomcat/webapps/ROOT has finished in 49 ms
22-Jul-2016 09:13:36.311 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deploying web application directory /usr/local/tomcat/webapps/manager
22-Jul-2016 09:13:36.375 INFO [localhost-startStop-1] org.apache.catalina.startup.HostConfig.deployDirectory Deployment of web application directory /usr/local/tomcat/webapps/manager has finished in 63 ms
22-Jul-2016 09:13:36.384 INFO [main] org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler [http-nio-8080]
22-Jul-2016 09:13:36.394 INFO [main] org.apache.coyote.AbstractProtocol.start Starting ProtocolHandler [ajp-nio-8009]
22-Jul-2016 09:13:36.395 INFO [main] org.apache.catalina.startup.Catalina.start Server startup in 2119 ms
```

Setelah selesai browse ke alamat IP server yang didapatkan pada waktu inisialisasi `docker-machine` tadi, yaitu `http://104.131.94.223:8080`


## Membuat Image Docker ##

Kita juga bisa membuat image custom sesuai kebutuhan kita. Misalnya aplikasi yang kita buat membutuhkan Java, Maven, dan MySQL agar berjalan dengan baik. Kita juga ingin database MySQL langsung dikonfigurasi sesuai aplikasi kita, yaitu dengan nama database tertentu dan user tertentu yang bisa mengakses database tersebut.

Sebagai contoh, kita akan menggunakan aplikasi yang kita gunakan pada [seri tutorial Continuous Integration sebelumnya](http://software.endy.muhardin.com/java/project-bootstrap-01/). Source code projectnya bisa diambil di Github](https://github.com/endymuhardin/belajar-ci.git)

Aplikasi tersebut membutuhkan database yang disetup dengan konfigurasi:

* nama database : belajar
* username database : belajar
* password database : java

Untuk itu, kita membuat konfigurasi Dockerfile untuk menginisiasi docker instance yang memiliki database tersebut. Berikut isi Dockerfilenya

```
FROM maven:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y mysql-server \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*  

VOLUME ~/.m2 /var/lib/mysql /tmp
COPY setup-database.sh /setup-database.sh
ENTRYPOINT ["/setup-database.sh"]
CMD ["/bin/bash"]
```

Pada Dockerfile di atas, ada beberapa hal yang kita lakukan:

* `FROM maven:latest` : kita mulai dengan image `maven` yang sudah dibuatkan orang. Biasanya memang kita tidak membuat image dari awal, tapi menggunakan image yang sudah ada yang paling mendekati dengan keinginan kita. Selanjutnya kita customize lebih lanjut.
* `ENV DEBIAN_FRONTEND=noninteractive` : biasanya waktu kita menginstal MySQL, kita akan ditanyakan password `root` database server. Karena proses instalasinya tidak interaktif, maka kita ingin melewati pertanyaan password tersebut dan langsung saja menggunakan nilai default. Untuk itu kita suruh `apt-get` untuk tidak bertanya-tanya.
* `VOLUME` : todo
* `COPY setup-database.sh /setup-database.sh` : kita copy script inisialisasi database yang sudah kita siapkan. Kita akan lihat isinya sebentar lagi
* `ENTRYPOINT ["/setup-database.sh"]` : kita ingin script tersebut dijalankan pada waktu docker booting
* `CMD ["/bin/bash"]` : setelah script selesai dijalankan, jalankan `bash` agar kita mendapat command prompt

Berikut adalah isi file `setup-database.sh`

```sh
#!/bin/bash

set -e

service mysql start

dbname=belajar
dbusername=belajar
dbpassword=java

if [ "$MYSQL_DATABASE" ]; then
    dbname="$MYSQL_DATABASE"
fi


if [ "$MYSQL_USERNAME" ]; then
    dbusername="$MYSQL_USERNAME"
fi

if [ "$MYSQL_PASSWORD" ]; then
    dbpassword="$MYSQL_PASSWORD"
fi

echo "GRANT ALL ON \`$dbname\`.* to '"$dbusername"'@'localhost' IDENTIFIED BY '"$dbpassword"'" | mysql -uroot
echo "CREATE DATABASE IF NOT EXISTS \`$dbname\`" | mysql -uroot

exec "$@"
```

Seperti bisa dibaca sendiri, script ini membuat database dengan nama `belajar`, kemudian membuat user yang bisa mengakses database tersebut.

Keseluruhan file (`Dockerfile` dan `setup-database.sh`) disimpan dalam satu folder. Kita namakan saja `maven-builder`.

Untuk menjalankannya, kita masuk dulu ke folder tersebut

```
cd maven-builder
```

Kemudian build dan start containernya

```
docker build -t maven-builder .
```

Berikut outputnya

```
Sending build context to Docker daemon 3.072 kB
Step 1 : FROM maven:latest
latest: Pulling from library/maven
5c90d4a2d1a8: Already exists 
ab30c63719b1: Already exists 
c6072700a242: Pull complete 
5f444d070427: Pull complete 
620b5227cf38: Pull complete 
3cfd33220efa: Pull complete 
864a98a84dd2: Extracting 41.22 MB/130 MB
734cc28150de: Download complete 
2503296da541: Download complete 
Digest: sha256:e8b86eefc2a429f063b5ef3175984cbaa7dbccaa2978205f9a4123ccee93cac5
Status: Downloaded newer image for maven:latest
 ---> 2c43f939de6e
Step 2 : ENV DEBIAN_FRONTEND noninteractive
 ---> Running in 854cb3c87389
 ---> 25973e7ec664
Removing intermediate container 854cb3c87389
Step 3 : RUN apt-get update     && apt-get install -y mysql-server     && apt-get clean     && rm -rf /var/lib/apt/lists/*
 ---> Running in d523fb0cbb9a
Get:1 http://security.debian.org jessie/updates InRelease [63.1 kB]
Ign http://httpredir.debian.org jessie InRelease
Get:2 http://httpredir.debian.org jessie-backports InRelease [166 kB]
Get:3 http://security.debian.org jessie/updates/main amd64 Packages [368 kB]
Get:4 http://httpredir.debian.org jessie-updates InRelease [142 kB]
Get:5 http://httpredir.debian.org jessie Release.gpg [2373 B]
Get:6 http://httpredir.debian.org jessie-backports/main amd64 Packages [815 kB]
Get:7 http://httpredir.debian.org jessie Release [148 kB]
Get:8 http://httpredir.debian.org jessie-updates/main amd64 Packages [17.6 kB]
Get:9 http://httpredir.debian.org jessie/main amd64 Packages [9032 kB]
Fetched 10.8 MB in 7s (1442 kB/s)
Reading package lists...
Reading package lists...
Building dependency tree...
Reading state information...
The following extra packages will be installed:
  libaio1 libdbd-mysql-perl libdbi-perl libhtml-template-perl libmysqlclient18
  libterm-readkey-perl mysql-client-5.5 mysql-common mysql-server-5.5
  mysql-server-core-5.5
Suggested packages:
  libclone-perl libmldbm-perl libnet-daemon-perl libsql-statement-perl
  libipc-sharedcache-perl mailx tinyca
The following NEW packages will be installed:
  libaio1 libdbd-mysql-perl libdbi-perl libhtml-template-perl libmysqlclient18
  libterm-readkey-perl mysql-client-5.5 mysql-common mysql-server
  mysql-server-5.5 mysql-server-core-5.5
0 upgraded, 11 newly installed, 0 to remove and 1 not upgraded.
Need to get 8718 kB of archives.
After this operation, 96.3 MB of additional disk space will be used.
Get:1 http://security.debian.org/ jessie/updates/main mysql-common all 5.5.50-0+deb8u1 [81.8 kB]
Get:2 http://security.debian.org/ jessie/updates/main libmysqlclient18 amd64 5.5.50-0+deb8u1 [675 kB]
Get:3 http://security.debian.org/ jessie/updates/main mysql-client-5.5 amd64 5.5.50-0+deb8u1 [1659 kB]
Get:4 http://security.debian.org/ jessie/updates/main mysql-server-core-5.5 amd64 5.5.50-0+deb8u1 [3414 kB]
Get:5 http://security.debian.org/ jessie/updates/main mysql-server-5.5 amd64 5.5.50-0+deb8u1 [1769 kB]
Get:6 http://security.debian.org/ jessie/updates/main mysql-server all 5.5.50-0+deb8u1 [80.0 kB]
Get:7 http://httpredir.debian.org/debian/ jessie/main libaio1 amd64 0.3.110-1 [9312 B]
Get:8 http://httpredir.debian.org/debian/ jessie/main libdbi-perl amd64 1.631-3+b1 [816 kB]
Get:9 http://httpredir.debian.org/debian/ jessie/main libterm-readkey-perl amd64 2.32-1+b1 [28.0 kB]
Get:10 http://httpredir.debian.org/debian/ jessie/main libhtml-template-perl all 2.95-1 [66.8 kB]
Get:11 http://httpredir.debian.org/debian/ jessie/main libdbd-mysql-perl amd64 4.028-2+b1 [119 kB]
debconf: delaying package configuration, since apt-utils is not installed
Fetched 8718 kB in 2s (3440 kB/s)
Selecting previously unselected package libaio1:amd64.
(Reading database ... 17556 files and directories currently installed.)
Preparing to unpack .../libaio1_0.3.110-1_amd64.deb ...
Unpacking libaio1:amd64 (0.3.110-1) ...
Selecting previously unselected package mysql-common.
Preparing to unpack .../mysql-common_5.5.50-0+deb8u1_all.deb ...
Unpacking mysql-common (5.5.50-0+deb8u1) ...
Selecting previously unselected package libmysqlclient18:amd64.
Preparing to unpack .../libmysqlclient18_5.5.50-0+deb8u1_amd64.deb ...
Unpacking libmysqlclient18:amd64 (5.5.50-0+deb8u1) ...
Selecting previously unselected package libdbi-perl.
Preparing to unpack .../libdbi-perl_1.631-3+b1_amd64.deb ...
Unpacking libdbi-perl (1.631-3+b1) ...
Selecting previously unselected package libdbd-mysql-perl.
Preparing to unpack .../libdbd-mysql-perl_4.028-2+b1_amd64.deb ...
Unpacking libdbd-mysql-perl (4.028-2+b1) ...
Selecting previously unselected package libterm-readkey-perl.
Preparing to unpack .../libterm-readkey-perl_2.32-1+b1_amd64.deb ...
Unpacking libterm-readkey-perl (2.32-1+b1) ...
Selecting previously unselected package mysql-client-5.5.
Preparing to unpack .../mysql-client-5.5_5.5.50-0+deb8u1_amd64.deb ...
Unpacking mysql-client-5.5 (5.5.50-0+deb8u1) ...
Selecting previously unselected package mysql-server-core-5.5.
Preparing to unpack .../mysql-server-core-5.5_5.5.50-0+deb8u1_amd64.deb ...
Unpacking mysql-server-core-5.5 (5.5.50-0+deb8u1) ...
Setting up mysql-common (5.5.50-0+deb8u1) ...
Selecting previously unselected package mysql-server-5.5.
(Reading database ... 17924 files and directories currently installed.)
Preparing to unpack .../mysql-server-5.5_5.5.50-0+deb8u1_amd64.deb ...
Unpacking mysql-server-5.5 (5.5.50-0+deb8u1) ...
Selecting previously unselected package libhtml-template-perl.
Preparing to unpack .../libhtml-template-perl_2.95-1_all.deb ...
Unpacking libhtml-template-perl (2.95-1) ...
Selecting previously unselected package mysql-server.
Preparing to unpack .../mysql-server_5.5.50-0+deb8u1_all.deb ...
Unpacking mysql-server (5.5.50-0+deb8u1) ...
Processing triggers for systemd (215-17+deb8u4) ...
Setting up libaio1:amd64 (0.3.110-1) ...
Setting up libmysqlclient18:amd64 (5.5.50-0+deb8u1) ...
Setting up libdbi-perl (1.631-3+b1) ...
Setting up libdbd-mysql-perl (4.028-2+b1) ...
Setting up libterm-readkey-perl (2.32-1+b1) ...
Setting up mysql-client-5.5 (5.5.50-0+deb8u1) ...
Setting up mysql-server-core-5.5 (5.5.50-0+deb8u1) ...
Setting up mysql-server-5.5 (5.5.50-0+deb8u1) ...
invoke-rc.d: policy-rc.d denied execution of stop.
invoke-rc.d: policy-rc.d denied execution of start.
Setting up libhtml-template-perl (2.95-1) ...
Setting up mysql-server (5.5.50-0+deb8u1) ...
Processing triggers for libc-bin (2.19-18+deb8u4) ...
Processing triggers for systemd (215-17+deb8u4) ...
 ---> 79ea513295b6
Removing intermediate container d523fb0cbb9a
Step 4 : VOLUME ~/.m2 /var/lib/mysql /tmp
 ---> Running in 1d5412b43eab
 ---> 22876399ea7e
Removing intermediate container 1d5412b43eab
Step 5 : COPY setup-database.sh /setup-database.sh
 ---> 7f1c3ab644de
Removing intermediate container c6ce1f913ef5
Step 6 : ENTRYPOINT /setup-database.sh
 ---> Running in 90f8ddf3b584
 ---> b719a20423fe
Removing intermediate container 90f8ddf3b584
Step 7 : CMD /bin/bash
 ---> Running in a84f2ccda6a5
 ---> 73c465f72d48
Removing intermediate container a84f2ccda6a5
Successfully built 73c465f72d48
```

Seperti kita bisa lihat pada output di atas, docker melakukan seperti apa yang biasa kita lakukan, yaitu `apt-get install` paket-paket yang dibutuhkan, sesuai yang kita tulis dalam `Dockerfile`.

Setelah selesai proses build, kita bisa jalankan image tersebut

```
docker run -it --rm maven-builder
```

Berikut outputnya

```
[ ok ] Starting MySQL database server: mysqld ..
[info] Checking for tables which need an upgrade, are corrupt or were 
not closed cleanly..
root@c0b5d12aa88d:/#
```

Kita sudah mendapatkan bash prompt. Selanjutnya kita bisa clone project aplikasi kita.

```
git clone https://github.com/endymuhardin/belajar-ci.git
Cloning into 'belajar-ci'...
remote: Counting objects: 201, done.
remote: Total 201 (delta 0), reused 0 (delta 0), pack-reused 201
Receiving objects: 100% (201/201), 22.59 KiB | 0 bytes/s, done.
Resolving deltas: 100% (46/46), done.
Checking connectivity... done.
```

Selanjutnya, kita bisa masuk ke foldernya dan menjalankan proses build

```
cd belajar-ci
mvn clean test jacoco:report
```

Berikut outputnya

```
[INFO] Scanning for projects...
[INFO]                                                                         
[INFO] ------------------------------------------------------------------------
[INFO] Building belajar-ci 0.0.1-SNAPSHOT
[INFO] ------------------------------------------------------------------------
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-clean-plugin/2.5/maven-clean-plugin-2.5.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-clean-plugin/2.5/maven-clean-plugin-2.5.pom (4 KB at 6.8 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/22/maven-plugins-22.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/plugins/maven-plugins/22/maven-plugins-22.pom (13 KB at 344.1 KB/sec)
Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/21/maven-parent-21.pom
Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/maven-parent/21/maven-parent-21.pom (26 KB at 757.1 KB/sec)

... log proses download saya potong ...


-------------------------------------------------------
 T E S T S
-------------------------------------------------------
09:52:52.349 [main] DEBUG o.s.t.c.j.SpringJUnit4ClassRunner - SpringJUnit4ClassRunner constructor called with [class com.muhardin.endy.belajar.BelajarCiApplicationTests]
09:52:52.414 [main] DEBUG o.s.test.context.BootstrapUtils - Instantiating CacheAwareContextLoaderDelegate from class [org.springframework.test.context.cache.DefaultCacheAwareContextLoaderDelegate]
09:52:52.493 [main] DEBUG o.s.test.context.BootstrapUtils - Instantiating BootstrapContext using constructor [public org.springframework.test.context.support.DefaultBootstrapContext(java.lang.Class,org.springframework.test.context.CacheAwareContextLoaderDelegate)]
09:52:52.638 [main] DEBUG o.s.test.context.BootstrapUtils - Instantiating TestContextBootstrapper for test class [com.muhardin.endy.belajar.BelajarCiApplicationTests] from class [org.springframework.test.context.web.WebTestContextBootstrapper]

... log spring saya potong ...


  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v1.3.2.RELEASE)

2016-07-22 09:53:33.805  INFO 659 --- [           main] c.m.e.b.c.c.ProductControllerTests       : Starting ProductControllerTests on c0b5d12aa88d with PID 659 (/belajar-ci/target/test-classes started by root in /belajar-ci)
2016-07-22 09:53:33.848  INFO 659 --- [           main] c.m.e.b.c.c.ProductControllerTests       : No active profile set, falling back to default profiles: default
2016-07-22 09:53:35.097  INFO 659 --- [           main] ationConfigEmbeddedWebApplicationContext : Refreshing org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext@6ba64dcf: startup date [Fri Jul 22 09:53:35 UTC 2016]; root of context hierarchy

... log test dipotong juga ...

Results :

Tests run: 3, Failures: 0, Errors: 0, Skipped: 0

[INFO] 
[INFO] --- maven-jar-plugin:2.5:jar (default-jar) @ belajar-ci ---
[INFO] Building jar: /Users/endymuhardin/workspace/belajar/belajar-ci/target/belajar-ci-0.0.1-SNAPSHOT.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:1.3.2.RELEASE:repackage (default) @ belajar-ci ---
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 16.539 s
[INFO] Finished at: 2016-02-22T11:03:02+07:00
[INFO] Final Memory: 29M/219M
```

Kita bisa lihat bahwa outputnya sama persis seperti di artikel sebelumnya. Dengan demikian, kita bisa simpulkan bahwa aplikasi kita berjalan dengan sempurna seperti kalau dijalankan di mesin biasa.

Setelah selesai, kita bisa langsung keluar dari prompt, dan docker instance tadi akan dihapus dari docker-machine.

## Penutup ##

Docker adalah teknologi virtualisasi yang sedang naik daun saat ini. Dengan menggunakan docker, kita bisa mempaketkan aplikasi kita menjadi satu image yang lengkap, terdiri dari : sistem operasi, service yang dibutuhkan (seperti database), software pendukung (Java, Ruby, Python), dan tentunya aplikasi kita sendiri. 

Image ini selanjutnya bisa kita deploy dengan mudah di berbagai layanan cloud yang disediakan berbagai perusahaan, ataupun kita setup sendiri. Dengan membuat docker image, kita tidak perlu lagi repot-repot menginstal sistem operasi, melakukan konfigurasi, dan ritual rutin lainnya *setiap kali* mendeploy aplikasi. Cukup kita buat `Dockerfile` sekali, selanjutnya tinggal kita deploy berapa kalipun kita mau. 

Metode ini sangat sesuai digunakan dengan arsitektur microservice, dimana kita membuat banyak aplikasi kecil-kecil yang saling berkolaborasi. Masing-masing aplikasi bisa direplikasi sesuai load yang diterima tanpa harus mengganggu aplikasi lainnya.

Selamat mencoba, semoga bermanfaat. 
