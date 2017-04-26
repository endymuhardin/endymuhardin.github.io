---
layout: post
title: "Instalasi Gitlab Runner Autoscale"
date: 2017-04-26 07:00
comments: true
categories:
- devops
---

Setelah kita berhasil [memasang Gitlab CE di Google Cloud Platform](http://software.endy.muhardin.com/devops/instalasi-gitlab-gce/), sekarang kita akan lanjutkan untuk memasang Gitlab Runner. Ada satu fitur menarik dari Gitlab Runner ini, yaitu `autoscale`. Fitur ini memungkinkan kita untuk menghemat biaya sewa VPS di penyedia layanan cloud seperti Digital Ocean, Amazon, Google, dan lainnya. Caranya adalah dengan membuat VPS untuk menjalankan build sesuai kebutuhan. Bila sedang ramai antrian, Gitlab akan membuat banyak VPS. Bila antrian sepi, VPS tersebut akan dihapus sehingga tidak menimbulkan biaya.

Berikut langkah-langkah untuk memasang Gitlab Runner dengan fitur `autoscale`:

* [Setup CI Cache dan Docker Registry Proxy](#cache-registry)
* [Setup Gitlab Runner](#setup-gitlab-runner)

	* [Membuat VPS Runner](#membuat-vps-runner)
	* [Setup Docker Engine](#instalasi-docker-engine)
    * [Setup Docker Machine](#instalasi-docker-machine)
	* [Instalasi Gitlab Multi Runner](#instalasi-gitlab-multi-runner)

* [Registrasi Gitlab Runner](#registrasi-gitlab-multi-runner)
* [Test Gitlab Runner](#test-gitlab-runner)

<!--more-->

<a name="cache-registry"></a>
## Setup CI Cache dan Docker Registry Proxy ##

Kegiatan build kita umumnya dijalankan di docker container. Untuk menjalankan container, docker perlu mengunduh image dulu (misalnya image `mysql:latest` dan `maven:latest`), yang besarnya bisa mencapai ratusan MB per image. Agar build lebih cepat, kita ingin menyimpan image ini supaya build kedua dan seterusnya tidak perlu donlod ulang.

Demikian juga dengan dependensi dan library. Bila kita menggunakan Maven, Gradle, npm, dan sejenisnya, ada banyak file yang dia unduh. File-file ini umumnya tidak berubah, sehingga bisa kita simpan agar build selanjutnya tidak perlu donlod lagi.

Untuk dua keperluan di atas, kita membutuhkan dua aplikasi:

* docker registry
* build cache

Docker registry sudah ada docker imagenya. Tinggal kita jalankan saja dengan perintah berikut

```
docker run -d -p 6000:5000 \
    -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io \
    --restart always \
    --name registry registry:2
```

Gitlab mendukung build cache dalam format penyimpanan Amazon S3. Buat kita yang tidak ingin langganan S3, sudah ada yang membuatkan aplikasi tiruannya, yaitu minio. Inipun sudah ada docker imagenya, bisa dijalankan dengan perintah berikut

```
docker run -it --restart always -p 9005:9000 \
        -v /.minio:/root/.minio -v /export:/export \
        --name minio \
        minio/minio:latest server /export
```

Agar lebih mudah, kita bisa gabungkan keduanya dalam docker compose sebagai berikut

```yml
version: "2.1"

services:
  docker-registry:
    image: registry:2
    restart: always
    environment:
      - REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io
    ports:
      - 6000:5000

  build-cache:
    image: minio/minio:latest
    restart: always
    volumes:
      - /.minio:/root/.minio
      - /export:/export
    ports:
      - 9005:9000
    command: server /export
```

Untuk menjalankannya, kita buat dulu docker host di Google Cloud Platform menggunakan `docker-machine`. Projectnya kita gunakan project `gitlab-family`, sama dengan instalasi Gitlab CE [di artikel sebelumnya](http://software.endy.muhardin.com/devops/instalasi-gitlab-gce/)

```
docker-machine create --driver google --google-zone asia-southeast1-a --google-project gitlab-family docker-registry-cache
```

Kemudian kita login ke dalam docker host tersebut untuk membuat folder yang dibutuhkan oleh `minio`

```
docker-machine ssh docker-registry-cache
```

Buat folder yang dibutuhkan `minio`

```
sudo mkdir -p /export/runner
```

Mumpung di sana, sekalian saja update dan upgrade

```
sudo apt-get update && sudo apt-get upgrade -y
```

Buka terminal satu lagi, kemudian kita jalankan `docker-compose.yml` sebagai berikut

```
docker-compose up -d
```

Berikut outputnya

```
Creating network "cloudautomation_default" with the default driver
Pulling build-cache (minio/minio:latest)...
latest: Pulling from minio/minio
627beaf3eaaf: Pull complete
ac75cd34934f: Pull complete
f2a61a9fdfc0: Pull complete
8ad25f7f1798: Pull complete
Digest: sha256:e061d9ca378755ebb8fd9887ec71e78891b85afc09181c2542953606bd486319
Status: Downloaded newer image for minio/minio:latest
Pulling docker-registry (registry:2)...
2: Pulling from library/registry
709515475419: Pull complete
df6e278d8f96: Pull complete
4b0b08c1b8f7: Pull complete
80119f43a01e: Pull complete
acf34ba23c50: Pull complete
Digest: sha256:412e3b6494f623a9f03f7f9f8b8118844deaecfea19e3a5f1ce54eed4f400296
Status: Downloaded newer image for registry:2
Creating cloudautomation_docker-registry_1
Creating cloudautomation_build-cache_1
```

Kita bisa lihat statusnya dengan perintah `docker ps`. Kalau semua berjalan normal, outputnya seperti ini

```
CONTAINER ID        IMAGE                COMMAND                  CREATED             STATUS              PORTS                    NAMES
dd6e0e7511c8        minio/minio:latest   "minio server /export"   39 seconds ago      Up 38 seconds       0.0.0.0:9005->9000/tcp   cloudautomation_build-cache_1
a6c743b43de8        registry:2           "/entrypoint.sh /e..."   40 seconds ago      Up 38 seconds       0.0.0.0:6000->5000/tcp   cloudautomation_docker-registry_1
```

Setelah jalan, kita perlu melihat konfigurasi `accessKey` dan `secret` untuk kita gunakan nanti. Konfigurasi ini ada dalam folder `/.minio/config.json`.

Kembali ke terminal yang sudah login ke docker host tadi, lalu tampilkan konfigurasi minio

```
sudo cat /.minio/config.json
```

Kita butuh `accessKey` dan `secretKey` seperti ini

```json
"credential": {
  "accessKey": "6X7LFVH3V7HU7SHHF60U",
  "secretKey": "8ftRtZDOSv/pXNiRe1yqKoQHCu5IRvsZfx35YijI"
}
```

Cache server dan docker registry kita sudah selesai disetup. Terakhir, kita butuh informasi alamat IP untuk dipasang di konfigurasi runner. Jalankan perintah berikut untuk melihat semua instance VPS kita.

```
gcloud compute instances list
```

Outputnya seperti ini

```
NAME                   ZONE               MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP     STATUS
docker-registry-cache  asia-southeast1-a  n1-standard-1               10.148.0.3   35.185.181.204  RUNNING
gitlab-ce              asia-southeast1-a  n1-standard-1               10.148.0.2   35.185.188.31   RUNNING
```

Kita butuh `INTERNAL_IP` untuk dipasang di runner nantinya. Sebagai rekap, berikut informasi yang sudah kita dapatkan:

* Docker Registry Proxy

	* IP dan Port : `10.148.0.3:6000`

* Minio untuk Build Cache

	* IP dan Port : `10.148.0.3:9005`
	* Access Key : `6X7LFVH3V7HU7SHHF60U`
	* Secret Key : `8ftRtZDOSv/pXNiRe1yqKoQHCu5IRvsZfx35YijI`

Selanjutnya, kita bisa mulai setup runner.

<a name="setup-gitlab-runner"></a>
## Setup Gitlab Runner ##

Setup runner terdiri dari dua kegiatan, yaitu:

* instalasi runner, yang berisi: docker engine, docker-machine, dan gitlab-ci-multi-runner
* registrasi runner

<a name="membuat-vps-runner"></a>
### Membuat VPS Runner ###

Untuk menjalankan runner, kita butuh satu VM lagi. Buat dulu dengan menggunakan GCloud SDK.

```
gcloud compute instances create gitlab-runner --image-family ubuntu-1604-lts --image-project ubuntu-os-cloud
```

Di dalam VM ini, kita akan menginstal:

* Docker Engine
* Docker Machine
* Gitlab Runner

Setelah VPS siap, login dengan ssh

```
gcloud compute ssh gitlab-runner
```

<a name="instalasi-docker-engine"></a>
### Instalasi Docker Engine ###

Petunjuk instalasi lengkapnya bisa dibaca [di dokumentasi resminya](https://docs.docker.com/engine/installation/linux/ubuntu/#install-using-the-repository). Sesuai petunjuk di website tersebut, pertama kita harus instal dulu software yang dibutuhkan :

```
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```

Tambahkan GPG key Docker

```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Pastikan fingerprintnya `9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88` dengan perintah berikut

```
sudo apt-key fingerprint 0EBFCD88
```

Outputnya seperti ini

```
pub   4096R/0EBFCD88 2017-02-22
      Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
```

Selanjutnya, tambahkan repository Docker

```
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

Baru kita bisa install

```
sudo apt-get update && sudo apt-get install docker-ce -y
```

Kita bisa test instalasinya dengan melihat versi docker yang terinstal

```
docker --version
```

Test juga dengan menjalankan container

```
sudo docker run hello-world
```

<a name="instalasi-docker-machine"></a>
### Install Docker Machine ###

Docker Machine adalah aplikasi untuk membuat Docker Engine di VPS lain. Kita butuh ini karena kita menggunakan fitur `autoscale`. Pada saat ada build yang harus dikerjakan, Gitlab menggunakan `docker-machine` untuk membuat VPS dan menjalankan build dalam docker container di VPS tersebut. Setelah build selesai, Gitlab kembali akan menggunakan `docker-machine` untuk menghapus VPS.

Petunjuk instalasi `docker-machine` paling lengkap bisa dibaca di [website resminya](https://docs.docker.com/machine/install-machine/#installing-machine-directly). Pada intinya, kita jalankan script berikut di command line:

```
curl -L https://github.com/docker/machine/releases/download/v0.10.0/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine &&
  chmod +x /tmp/docker-machine &&
  sudo cp /tmp/docker-machine /usr/local/bin/docker-machine
```

Test dengan melihat versi yang terinstal

```
docker-machine --version
```

Jangan lupa untuk memeriksa dulu ke website resminya untuk memastikan versi yang diinstal sudah yang paling baru.

Agar `docker-machine` bisa berjalan dalam Google Compute Engine, kita perlu inisialisasi otentikasi Google dulu. Kalau tidak, kita akan mendapati error seperti ini pada saat membuat `docker-machine`.

```
docker-machine create --driver google --google-project gitlab-family --google-zone asia-southeast1-a testcoba
```

Pesan errornya seperti ini :

```
Running pre-create checks...
(testcoba) Check that the project exists
Error with pre-create check: "Project with ID \"gitlab-family\" not found. googleapi: Error 403: Insufficient Permission, insufficientPermissions"
```

Untuk mengatasinya, kita harus otentikasi dulu. Caranya, kita login dulu dengan Google Cloud SDK. Yang penting untuk diperhatikan, proses otentikasi ini harus kita lakukan sebagai user `root`, karena nantinya proses `gitlab-runner` akan berjalan dengan user `root`.

```
sudo -i
```

Kemudian baru kita lakukan otentikasi.

```
gcloud auth application-default login
```

Kita akan disuruh untuk login di browser dengan URL yang diberikan

```
You are running on a Google Compute Engine virtual machine.
The service credentials associated with this virtual machine
will automatically be used by Application Default
Credentials, so it is not necessary to use this command.

If you decide to proceed anyway, your user credentials may be visible
to others with access to this virtual machine. Are you sure you want
to authenticate with your personal account?

Do you want to continue (Y/n)?

Go to the following link in your browser:

    https://accounts.google.com/o/oauth2/auth?redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&prompt=select_account&response_type=code&client_id=764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform&access_type=offline
```

Setelah login di web, kita akan diberikan kode otorisasi

[![Kode Otorisasi]({{site.url}}/images/uploads/2017/gitlab-family/gcloud-authcode.png)]({{site.url}}/images/uploads/2017/gitlab-family/gcloud-authcode.png)

Masukkan di command line

```
Enter verification code: 4/yyu66l80diOCGNgMEjqH3Jj6UEK3w_QeJ9G1hmdWNx4

Credentials saved to file: [/home/endymuhardin/.config/gcloud/application_default_credentials.json]

These credentials will be used by any library that requests
Application Default Credentials.
```

Selanjutnya, kita bisa test apakah `docker-machine` bisa dijalankan

```
docker-machine create --driver google --google-project gitlab-family --google-zone asia-southeast1-a testcoba
```

Kali ini harusnya sukses, berikut outputnya

```
Running pre-create checks...
(testcoba) Check that the project exists
(testcoba) Check if the instance already exists
Creating machine...
(testcoba) Generating SSH Key
(testcoba) Creating host...
(testcoba) Opening firewall ports
(testcoba) Creating instance
(testcoba) Waiting for Instance
(testcoba) Uploading SSH Key
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
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env testcoba
```

Kita bisa lihat apakah docker-machine sudah terbentuk dengan perintah berikut

```
docker-machine ls
```

Outputnya seperti ini

```
NAME       ACTIVE   DRIVER   STATE     URL                         SWARM   DOCKER        ERRORS
testcoba   -        google   Running   tcp://35.186.158.152:2376           v17.04.0-ce
```

Setelah sukses, jangan lupa dihapus lagi agar tidak membebani tagihan.

```
docker-machine rm testcoba
```

Selanjutnya, kita teruskan menginstal `gitlab-ci-multi-runner`.

<a name="instalasi-gitlab-multi-runner"></a>
### Install Gitlab Runner ###

Petunjuk instalasi bisa dibaca [di sini](https://docs.gitlab.com/runner/install/linux-repository.html). Sesuai petunjuk di link barusan, kita bisa eksekusi satu baris perintah seperti ini untuk mendaftarkan repository Ubuntu

```
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash
```

Selanjutnya kita akan install Gitlab Runner

```
sudo apt-get install gitlab-ci-multi-runner
```

<a name="registrasi-gitlab-multi-runner"></a>
## Registrasi Gitlab Runner ##

Untuk melakukan registrasi, kita butuh token yang bisa didapatkan di menu `admin/runners` di aplikasi web Gitlab CE.

[![Registration Token]({{site.url}}/images/uploads/2017/gitlab-family/runner-registration-token.png)]({{site.url}}/images/uploads/2017/gitlab-family/runner-registration-token.png)
]

Kemudian kita daftarkan Runner dengan token tersebut

```
sudo gitlab-ci-multi-runner register
```

Kita akan ditanyai beberapa pertanyaan. Berikut adalah pertanyaan dan jawaban yang saya berikan

```
Running in system-mode.

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):
https://gitlab.artivisi.id
Please enter the gitlab-ci token for this runner:
A6pwrshn7xoeVPvMYAEh
Please enter the gitlab-ci description for this runner:
[gitlab-runner]:
Please enter the gitlab-ci tags for this runner (comma separated):

Whether to lock Runner to current project [true/false]:
[false]:
Registering runner... succeeded                     runner=A6pwrshn
Please enter the executor: shell, virtualbox, docker+machine, docker-ssh+machine, kubernetes, docker, docker-ssh, parallels, ssh:
docker+machine
Please enter the default Docker image (e.g. ruby:2.1):
alpine:latest
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

Kita akan edit file konfigurasinya. Sebelumnya kita backup dulu config aslinya

```
sudo cp /etc/gitlab-runner/config.toml /etc/gitlab-runner/config.bak
```

Kemudian kita edit file `/etc/gitlab-runner/config.toml` seperti ini

```
concurrent = 1
check_interval = 0

[[runners]]
  name = "gcloud-autoscale"
  url = "https://gitlab.artivisi.id"
  token = "5b6e2b425a2ebb04ab10de5344ec52"
  executor = "docker+machine"
  [runners.docker]
    tls_verify = false
    image = "alpine:latest"
    privileged = true
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
  [runners.cache]
    Type = "s3"
    ServerAddress = "10.148.0.3:9005"
    AccessKey = "6X7LFVH3V7HU7SHHF60U"
    SecretKey = "8ftRtZDOSv/pXNiRe1yqKoQHCu5IRvsZfx35YijI"
    BucketName = "runner"
    Insecure = true
    Shared = true
  [runners.machine]
    IdleCount = 0
    IdleTime = 600
    MaxBuilds = 5
    MachineDriver = "google"
    MachineName = "%s"
    MachineOptions = [
      "google-project=gitlab-family",
      "google-zone=asia-southeast1-a",
      "google-machine-image=coreos-cloud/global/images/coreos-stable-1298-7-0-v20170401",
      "google-machine-type=g1-small",
      "engine-registry-mirror=http://10.148.0.3:6000"
    ]
```

Ada beberapa hal yang kita konfigurasi pada runner kita, yaitu:

* `IdleCount = 0` : kalau tidak ada kerjaan build, tidak perlu bikin VPS
* `IdleTime = 600` : kalau ada VPS yang nganggur selama 600 detik (10 menit), segera remove
* `MaxBuilds = 5` : maksimal kerjaan yang jalan berbarengan adalah `5`. Kalau ada 7 permintaan, maka yang 2 antri dulu. Setting ini bisa kita gunakan untuk membatasi jumlah VPS yang akan dibuat oleh Gitlab sehingga tagihan tidak membengkak.
* `MachineDriver = "google"` : provider VPS yang kita gunakan. Kita bisa menggunakan [berbagai provider yang didukung oleh `docker-machine`](https://docs.docker.com/machine/drivers/)

Setelah diedit, restart Gitlab Runner

```
sudo gitlab-ci-multi-runner restart
```

Kita bisa lihat hasilnya di antarmuka web Gitlab CE di menu `Admin > Runners`

[![Runner Sukses Registrasi]({{site.url}}/images/uploads/2017/gitlab-family/runner-registered.png)]({{site.url}}/images/uploads/2017/gitlab-family/runner-registered.png)

<a name=test-gitlab-runner></a>
## Test Gitlab Runner ##

Ada beberapa hal yang perlu kita test, yaitu:

* build bisa dijalankan dengan baik
* docker registry proxy bisa melakukan cache, sehingga build kedua dan seterusnya lebih cepat
* build cache berfungsi dengan baik, ada file yang ditaruh ke `minio` dan build selanjutnya tidak perlu download dependensi

Untuk melakukan test, kita bisa gunakan [contoh project `belajar-ci`](https://gitlab.com/endymuhardin/belajar-ci) yang sudah diuji dan [berjalan baik di Gitlab versi hosted](https://gitlab.com/endymuhardin/belajar-ci/pipelines) yang dikelola tim Gitlab sendiri. Kita bisa create project di Gitlab hasil instalasi kita, kemudian push projectnya kesana.

Beberapa hal yang perlu kita amati:

* Build harusnya berjalan sukses, minimal job `maven-build`. Untuk job lain memang butuh konfigurasi credential agar bisa push ke DockerHub.
* Build cache terisi, bisa dicek dengan cara ssh ke `docker-registry-cache`, kemudian lihat isi folder `/export/runner`. Harusnya ada isinya. Lihat juga log `maven-build` untuk build kedua dan seterusnya, harusnya dia tidak lagi mengunduh banyak `jar`.
* Registry cache terisi. Bisa dicek dengan cara login ke docker containernya dengan perintah `docker exec -it namacontainer /bin/sh`. Nama container dapat diperoleh dengan perintah `docker ps`. Setelah berhasil login, coba liat isi folder `/var/lib/registry/`. Seharusnya di dalamnya ada folder `docker/registry/v2/repositories/library/` yang isinya image-image yang digunakan oleh proses build kita. Untuk project `belajar-ci` akan ada image `docker`, `mysql`, dan `maven`.

Demikianlah cara setup Gitlab Runner. Sekarang server Gitlab kita selain bisa menjadi server version control Git, juga sudah bisa menangani proses Continuous Integration/Delivery. Dengan adanya fitur `autoscale` ini, VPS hanya dibuat pada saat dibutuhkan saja. Begitu tidak ada proses berjalan, VPSnya akan didestroy. Ini akan sangat menghemat biaya, apalagi layanan cloud jaman sekarang sudah mengenakan biaya dalam satuan jam. Bukan lagi bulanan.

Semoga bermanfaat.

## Referensi ##

* [http://www.akitaonrails.com/2016/08/03/moving-to-gitlab-yes-it-s-worth-it](http://www.akitaonrails.com/2016/08/03/moving-to-gitlab-yes-it-s-worth-it)
* [https://docs.gitlab.com/runner/install/autoscaling.html](https://docs.gitlab.com/runner/install/autoscaling.html)
* [https://github.com/jerryjj/gitlab-runner-gce](https://github.com/jerryjj/gitlab-runner-gce)
* [https://gitlab.com/gitlab-org/gitlab-ci-yml/blob/master/Maven.gitlab-ci.yml](https://gitlab.com/gitlab-org/gitlab-ci-yml/blob/master/Maven.gitlab-ci.yml)
