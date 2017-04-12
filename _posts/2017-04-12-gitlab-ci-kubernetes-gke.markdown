---
layout: post
title: "Otomasi Deployment Kubernetes dengan Gitlab CI"
date: 2017-04-12 07:00
comments: true
categories:
- devops
---

Jaman sekarang, solusi Continuous Integration dan Delivery sudah banyak sekali pilihannya. Yang sudah kita bahas diantaranya:

* [Cruise Control : ini adalah bapak moyangnya CI/D tools](http://software.endy.muhardin.com/aplikasi/cruise-control/)
* [Luntbuild](http://software.endy.muhardin.com/java/luntbuild/)
* [Jenkins](http://software.endy.muhardin.com/java/deploy-jenkins-vps/)
* [TravisCI](http://software.endy.muhardin.com/java/project-bootstrap-02/)

Dan yang belum kita coba diantaranya:

* CircleCI
* Bamboo
* dan mungkin masih banyak lagi yang saya belum dengar

Pada artikel kali ini, kita akan coba GitlabCI.

<!--more-->

Dibanding para kompetitornya, GitlabCI memiliki beberapa keunggulan, diantaranya:

* berbasis file, bisa dikelola dengan version control, tidak perlu klak klik, otomatis terbackup
* integrated dengan version control Gitlab
* proses buildnya bisa jalan dalam Docker container, memudahkan kita untuk melakukan setup environment
* bisa jalan di local
* support multiple environment (dev,test,prod)
* bisa jalan di branch tertentu (hanya monitor branch master, dev, dsb)
* manual trigger (misal : deploy ke production)
* paralel execution
* review apps

Dari sekian keunggulan di atas, tiga poin paling atas sangat penting (menurut saya). Kalau Anda pernah pakai model GUI seperti Jenkins, tentu paham masalah utamanya adalah bagaimana membackup konfigurasi build kita. Dengan CI berbasis teks seperti Travis dan Gitlab, hal ini tidak menjadi masalah karena konfigurasi build dicommit bersama dengan source code kita. Terasa lebih natural dan selaras dengan workflow pemrograman kita.

Apapun produk CI yang kita gunakan, dia pasti harus terhubung dengan version control server kita. Baik untuk mengambil source code terbaru, mentrigger proses build ketika ada developer push, dan melaporkan hasil buildnya. Belum lagi kalau kita menggunakan proses code review atau workflow pull request, tentu ada lagi tambahan trigger pada event tersebut. Pada saat menggunakan Jenkins, kita harus menginstal berbagai macam plugin untuk mengakomodasi kebutuhan tadi. Setup awalnya sendiri sudah jadi tambahan kerjaan, belum lagi effort untuk update plugin dan backup konfigurasinya.

Jaman sekarang, dukungan Docker adalah sesuatu yang wajib. Tanpa docker, kita harus membuat install script dengan Ansible, Puppet, Chef, Bash script, atau apapun tools configuration management favorit Anda. Tambahan lagi yang harus dimaintain. Dengan Docker, cukup bikin image turunan dari yang sudah ada, beres.

Kita semua tentu pernah mengalami kejadian berikut. Semua test berjalan lancar di local, tapi ternyata gagal waktu dijalankan dalam proses CI. Dengan GitlabCI, hal ini tidak perlu terjadi lagi. Kita bisa menjalankan build script Gitlab di komputer kita, tidak perlu menunggu GitlabCI menjalankannya (dan gagal) di server. Kita akan bahas ini di bagian Runner di bawah.

Baiklah, mari kita langsung lihat saja file konfigurasinya. GitlabCI meminta kita untuk membuat file bernama `.gitlab-ci.yml` dalam folder project kita. Nantinya pada saat dipush, Gitlab akan membaca isi file tersebut dan menjalankannya. Berikut isi filenya

```yml
image: docker:latest

services:
  - docker:dind
  - mysql:latest

variables:
  DOCKER_DRIVER: overlay
  SPRING_PROFILES_ACTIVE: docker,localstorage
  MYSQL_ROOT_PASSWORD: admin
  MYSQL_DATABASE: belajar
  MYSQL_USER: belajar
  MYSQL_PASSWORD: java

stages:
  - build
  - package
  - deploy

maven-build:
  image: maven:3-jdk-8
  stage: build
  script: mvn package -B
  artifacts:
    paths:
      - target/*.jar

docker-build:
  stage: package
  script:
    - echo "$GCLOUD_CREDENTIAL" > gcloud-credential.json
    - docker build -t $CI_PROJECT_PATH:$CI_COMMIT_SHA .
    - docker tag $CI_PROJECT_PATH:$CI_COMMIT_SHA $CI_PROJECT_PATH:latest
    - docker login -u endymuhardin -p $DOCKERHUB_PASSWORD
    - docker push $CI_PROJECT_PATH
    - docker logout
    - rm gcloud-credential.json

k8s-deploy:
  image: google/cloud-sdk
  stage: deploy
  script:
    - echo "$GCLOUD_KEY" > key.json
    - gcloud auth activate-service-account --key-file key.json
    - gcloud config set compute/zone asia-east1-a
    - gcloud config set project belajar-ci
    - gcloud config set container/use_client_certificate True
    - gcloud container clusters get-credentials belajar-ci
    - kubectl apply -f k8s
    - kubectl set image deploy/belajar-ci-app belajar-ci=endymuhardin/belajar-ci:latest
    - rm key.json
```

Mari kita bahas satu persatu.

* `image: docker:latest` artinya kita ingin menjalankan seluruh proses build dalam Docker container. Kita akan gunakan versi terbaru (latest)

* services : adalah aplikasi yang ingin kita jalankan dalam container tersebut.

    * Service pertama adalah `dind`, singkatan dari `docker in docker`. Ini gunanya untuk menjalankan docker di dalam docker. Kita butuh ini karena ada proses pembuatan docker image dalam rangkaian build kita.

    * Service kedua adalah MySQL. Ini sama seperti deklarasi container dalam Docker Compose yang sudah kita bahas di [artikel terdahulu](http://software.endy.muhardin.com/devops/docker-workflow/). Container yang menjalankan proses MySQL ini akan didaftarkan dengan hostname `mysql`. Dengan demikian, aplikasi kita bisa mengaksesnya dengan JDBC URL `jdbc:mysql://mysql/belajar`

* Blok `variables` adalah deklarasi environment variable. Kita butuh ini untuk menginisialisasi container MySQL dan mengatur profile aplikasi Spring Boot

* Blok `stages` mendefinisikan tahapan build. Isinya bebas saja, tapi saya gunakan istilah yang umum digunakan supaya mudah dipahami, yaitu `build`, `package`, dan `deploy`. GitlabCI akan menjalankan job-job secara berurutan sesuai urutan deklarasi dalam blok ini

* Blok-blok selanjutnya adalah definisi job yang harus dijalankan GitlabCI. Namanya bebas saja, tidak ada keyword tertentu yang harus dipakai.

### Stage Build ###

Pertama, kita jalankan proses build Maven dalam job `maven-build`. Perintah yang dijalankan sama dengan yang biasa kita pakai di laptop/pc kita, yaitu `mvn package`. Tambahkan opsi `-B` supaya Maven tidak mengeluarkan prompt pertanyaan.

Job ini berjalan dalam stage `build` yang kita deklarasikan paling atas dalam blok `stages` tadi. Kita bisa mendeklarasikan banyak job dalam stage yang sama. GitlabCI akan menjalankan semua job dalam stage yang sama secara berbarengan.

Agar build bisa berjalan, tentu kita butuh environment yang sudah terinstal Java dan Maven. Oleh karena itu, kita suruh GitlabCI untuk menjalankannya dalam docker container `maven:3-jdk-8`. Mudah kan, tidak perlu setup apa-apa.

Setelah job `maven-build` selesai, kita ingin menyimpan hasilnya untuk kita gunakan di tahap selanjutnya. Kita deklarasikan file mana yang mau disimpan dengan blok `artifacts`

### Stage Package ###

Dalam stage ini, kita membuat docker image dan kemudian menguploadnya ke Dockerhub. Penjelasan detailnya sudah kita bahas di [artikel sebelumnya](http://software.endy.muhardin.com/devops/docker-workflow/). Rangkaian perintahnya sama, tinggal kita tulis saja.

Dalam perintah `docker login`, kita butuh password. Tentu saya tidak bisa tulis passwordnya dalam file ini, karena nanti akan terbaca oleh semua orang yang punya akses ke source code. Solusinya, kita deklarasikan variabel `DOCKERHUB_PASSWORD` di Gitlab pada menu `Settings > CI/CD Pipelines` seperti ini

![Setting Secret Variabel]({{site.url}}/images/uploads/2017/gitlab-ci/gitlab-ci-variables.png)

Variabel tersebut bisa kita akses di `.gitlab-ci.yml` dengan sintaks `$DOCKERHUB_PASSWORD`

Sebetulnya Gitlab juga menyediakan private Docker registry untuk menghosting docker image kita. Tapi saya belum berhasil mengkombinasikannya dengan GKE. Jadi ya sementara ini kita upload ke DockerHub saja dulu.

### Stage Deploy ###

Pada stage ini, kita akan mendeploy aplikasi dengan Kubernetes yang dihosting di Google Container Engine (GKE). Langkah-langkahnya sudah kita bahas mendetail [di artikel sebelumnya](http://software.endy.muhardin.com/devops/deploy-google-container-engine/). Tinggal kita pindahkan saja kesini.

Yang agak berbeda adalah proses login ke Google Cloud. Loginnya tidak menggunakan username/password seperti lazimnya aplikasi lain. Dia butuh file credential. Biasanya kita tidak butuh file ini pada saat mendeploy dari laptop, karena kita sudah melakukan login dengan Google Cloud SDK di laptop kita.

File ini didapatkan dengan cara mengakses [Google Cloud Console](https://console.cloud.google.com), kemudian masuk ke menu `API Manager > Credentials`. Setelah itu, klik tombol `Create Credentials` dan pilih `Service account key`

![Generate Credentials File]({{site.url}}/images/uploads/2017/gitlab-ci/create-service-account-file.png)

Buka file tersebut dengan text editor, copy isinya, dan gunakan untuk membuat variabel di Gitlab. Misalnya nama variabelnya kita set menjadi `GCLOUD_KEY`.

Pada waktu build, kita tulis kembali isi variabel tersebut ke dalam file dengan perintah berikut

```
echo "$GCLOUD_KEY" > key.json
```

Selanjutnya, kita gunakan file tersebut dalam proses login.

```
gcloud auth activate-service-account --key-file key.json
```

Jangan lupa untuk menghapusnya lagi setelah selesai.

```
rm key.json
```

### Menjalankan Proses Build ###

Proses build akan berjalan setiap kali ada push ke Gitlab. Kita bisa membatasi proses build hanya untuk branch tertentu dengan keyword `only`.

Contoh kasus, misalnya kita punya 3 branch yang akan dideploy ke lokasi berbeda.

* branch `development` deploy ke Heroku
* branch `testing` deploy ke docker machine di DigitalOcean
* branch `master` deploy ke Kubernetes cluster di GKE

Berikut konfigurasinya

```yml
deploy-ke-heroku:
  stage: deploy
  only: development
  environment:
    name: development
    url: https://belajar-ci-endy.herokuapp.com
  script:
    - git push https://heroku:$(HEROKU_API_KEY)@git.heroku.com/git.heroku.com/belajar-ci-endy.git development

deploy-ke-digitalocean:
  stage: deploy
  only: testing
  environment:
    name: testing
    url: https://server-di-do.com
  script:
    - scp target/*.jar root@server-di-do.com:/opt/
    - ssh root@server-di-do.com service belajar-ci restart

deploy-ke-gke:
  stage: deploy
  only: master
  environment:
    name: production
    url: http://104.155.193.131/
  when: manual
  script:
    - echo "$GCLOUD_KEY" > key.json
    - gcloud auth activate-service-account --key-file key.json
    - gcloud config set compute/zone asia-east1-a
    - gcloud config set project belajar-ci
    - gcloud config set container/use_client_certificate True
    - gcloud container clusters get-credentials belajar-ci
    - kubectl apply -f k8s
    - kubectl set image deploy/belajar-ci-app belajar-ci=endymuhardin/belajar-ci:latest
    - rm key.json
```

Dengan konfigurasi di atas, kita dapat:

1. Menyuruh semua programmer commit ke branch development
2. Setelah aplikasi terdeploy ke Heroku, kita bisa segera melakukan testing menyeluruh
3. Begitu dinyatakan oke, merge development ke testing. Aplikasi akan segera terdeploy ke Digital Ocean.
4. Lakukan tes lagi di Digital Ocean. Bisa functional test oleh tester, performance test, security test, dan sebagainya.
5. Begitu oke, merge ke production. Kita lihat disana ada setting manual. Setting itu membutuhkan orang untuk login ke Gitlab dan menekan tombol Oke. Begitu ditekan, aplikasi akan terdeploy ke cluster Kubernetes di GKE.

Hal seperti ini bisa saja kita lakukan dengan Jenkins. Tapi jauh lebih repot. Bayangkan berapa project yang kita akan create, belum lagi setup pipeline, install plugin SCP, Docker, dan lainnya.

Untuk mengetahui lebih lanjut tentang deployment ke berbagai environment, silahkan baca [dokumentasi resminya](https://docs.gitlab.com/ce/ci/environments.html).

## Review Apps ##

Bila kita menjalankan workflow code review, biasanya para programmer akan membuat branch khusus untuk pekerjaan yang sedang dikerjakan (misalnya fix bugs, tambah fitur, dsb). Bila pekerjaan mereka sudah selesai, mereka akan membuat `Merge Request`. Supervisor atau senior programmer kemudian akan menarik merge request tersebut ke komputernya, mendeploy aplikasinya, dan mengetes hasil pekerjaan tersebut. Bila hasilnya oke, maka branch tersebut bisa dimerge ke branch utama. Bila kurang oke, programmer pembuatnya bisa disuruh untuk melakukan revisi.

Hal ini tentu merepotkan kalau harus dilakukan berulang kali. Apalagi kalau setup aplikasinya rada ribet. Untuk memudahkan proses review ini, Gitlab CI menyediakan [fitur Review Apps](https://docs.gitlab.com/ce/ci/review_apps/index.html).

Fitur ini akan mendeploy aplikasi ke lokasi yang unik untuk masing-masing `Merge Request`. Tentunya kita harus siapkan target deployment yang mampu menampung instance aplikasi sebanyak `Merge Request` yang open. Dengan fitur ini, reviewer bisa langsung klik URL yang ada di Gitlab dan mengakses aplikasi yang sudah terdeploy. Bila sudah selesai review, Gitlab akan menghapus instance tersebut. Contohnya bisa dilihat di [contoh repositorynya](https://gitlab.com/gitlab-examples/review-apps-nginx).

## Gitlab Runner ##

Dari tadi kita hanya membahas konfigurasi build dan apa yang akan terjadi. Ada satu bagian yang kurang, yaitu siapa yang menjalankannya.

Di Gitlab, komponen yang bertugas menjalankan build adalah Gitlab Runner. Biasanya Runner ini kita setup di mesin berbeda. Ada beberapa jenis Runner:

* [docker biasa](https://docs.gitlab.com/runner/executors/docker.html)
* docker autoscale
* virtualbox
* dan lain-lain. Lengkapnya bisa dibaca di [dokumentasinya](https://docs.gitlab.com/ce/ci/runners/README.html).

Cara instalasinya tidak kita bahas di sini. Silahkan lihat langsung ke [dokumentasi resminya](https://docs.gitlab.com/runner/install/)

Beberapa fitur menarik dari Runner ini antara lain:

* Docker. Gitlab bisa menjalankan job kita dalam docker container. Ini akan memudahkan kita dalam melakukan setup environment. Tidak perlu lagi menyiapkan VPS atau membuat install script. Sebagai contoh, untuk aplikasi Java kita cukup menyatakan `image: maven:3-jdk-8`. Database server yang dibutuhkan aplikasi juga tidak perlu repot menginstalnya. Cukup sebutkan di blok `services` bahwa kita butuh docker container dengan image `mysql:latest`.

* Autoscaling. Gitlab akan secara otomatis menambah host pada saat antrian build besar, dan otomatis mematikan host pada saat tidak ada antrian build. Bila kita membuat host secara virtual di layanan cloud, ini akan sangat memudahkan dan juga menghemat biaya. Daripada kita sewa host secara permanen dan banyak nganggurnya, lebih baik kita sewa sesuai kebutuhan. Apalagi di jaman sekarang berbagai layanan cloud seperti Digital Ocean, Linode, dan sebagainya, menghitung biaya dalam satuan jam. Informasi lebih rinci mengenai autoscaling bisa dibaca di [dokumentasi resminya](https://docs.gitlab.com/runner/install/autoscaling.html).

* Multi Runner Exec. Gitlab bisa menjalankan script `.gitlab-ci.yml` di laptop kita sendiri. Kita bisa [install Gitlab Runner di laptop kita](https://docs.gitlab.com/runner/install/osx.html), kemudian jalankan perintah `gitlab-ci-multi-runner exec docker maven-build`. Hal penting yang harus diperhatikan, kalau menggunakan executor `docker`, docker enginenya harus berada di localhost. Tidak bisa menggunakan docker host yang ada di Digital Ocean ataupun di VirtualBox misalnya. Kalau tidak ada docker di local, maka kita bisa gunakan executor `shell` dengan perintah berikut `gitlab-runner exec shell maven-build`.

## Penutup ##

Di jaman serba cepat seperti sekarang ini, segala hal harus dioptimasi, termasuk workflow pembuatan aplikasi. Dengan adanya teknologi container seperti Docker, teknologi cloud hosting seperti Digital Ocean, Heroku, Amazon, dkk, teknologi clustering seperti Kubernetes, Mesos, dkk, cara kita menjalankan development juga harus berubah.

Sudah tidak jamannya lagi kita menyiapkan mesin fisik secara manual, menginstal sistem operasi dan kelengkapannya, baru mendeploy aplikasi. Jaman sekarang, cukup kita paketkan aplikasi dalam container, kemudian deploy otomatis tiap ada perubahan kode program. Ini akan memangkas waktu dari programmer selesai coding sampai aplikasi bisa digunakan user, yang tadinya berminggu-minggu menjadi beberapa menit saja.

Walaupun demikian, rangkaian otomasi ini belum selesai. Di artikel selanjutnya, kita akan menyiapkan aplikasi kita agar siap direplikasi. Setelah itu, kita akan mencoba kemudahan replikasi dengan satu perintah saja. Fitur ini sudah umum tersedia di mana-mana, seperti misalnya Amazon AWS, Google Cloud, Heroku, Pivotal Web Service, dan mayoritas penyedia layanan cloud lain.

Untuk melihat kode program aplikasinya, silahkan langsung menuju repositorynya [di Gitlab](https://gitlab.com/endymuhardin/belajar-ci). Hasil build bisa dilihat di [tab Pipelines](https://gitlab.com/endymuhardin/belajar-ci/pipelines)

Stay tuned ...

## Referensi ##

* [https://docs.gitlab.com/ce/ci/quick_start/](https://docs.gitlab.com/ce/ci/quick_start/)
* [https://docs.gitlab.com/ce/ci/yaml/README.html](https://docs.gitlab.com/ce/ci/yaml/README.html)
* [https://docs.gitlab.com/ce/ci/environments.html](https://docs.gitlab.com/ce/ci/environments.html)
* [https://docs.gitlab.com/ce/ci/review_apps/index.html](https://docs.gitlab.com/ce/ci/review_apps/index.html)
* [https://about.gitlab.com/2016/08/26/ci-deployment-and-environments/](https://about.gitlab.com/2016/08/26/ci-deployment-and-environments/)
