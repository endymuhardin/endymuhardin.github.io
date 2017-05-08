---
layout: post
title: "Mendeploy Aplikasi dari Gitlab ke VPS"
date: 2017-05-08 07:00
comments: true
categories:
- devops
---

Setelah kita [menyiapkan infrastruktur Continuous Delivery dengan Gitlab CI](http://software.endy.muhardin.com/devops/instalasi-gitlab-runner-autoscale/), sekarang kita akan menggunakannya untuk melakukan deployment otomatis ke VPS. Pada artikel terdahulu, kita sudah [mendeploy dari Jenkins ke VPS](http://software.endy.muhardin.com/java/deploy-jenkins-vps/) dan juga [mendeploy dari Gitlab ke Kubernetes](http://software.endy.muhardin.com/devops/gitlab-ci-kubernetes-gke/). Nah sekarang, kita akan mendeploy dari Gitlab ke VPS.

<!--more-->

Secara garis besar, berikut adalah langkah-langkahnya:

* menyiapkan VPS yang akan menjadi target deployment. Ini tidak akan kita bahas lagi, silahkan baca bagian awal dari [artikel sebelumnya](http://software.endy.muhardin.com/java/deploy-jenkins-vps/) sampai ke bagian deployment manual.
* menyiapkan pasangan public dan private key untuk SSH. Inipun juga sudah ada di artikel terdahulu sehingga tidak akan kita ulangi lagi.
* mendaftarkan private key ke Gitlab
* membuat script `.gitlab-ci.yml` untuk melakukan deployment otomatis pada saat kita membuat tag di repository.


## Cara Kerja Gitlab CI ##

Di [artikel sebelumnya](http://software.endy.muhardin.com/devops/instalasi-gitlab-runner-autoscale/), kita telah jelaskan bahwa kita memilih executor `docker-machine` untuk Gitlab Runner kita. Dengan demikian, pada waktu proses build dijalankan, kita akan mendapat container baru dalam setiap job. Ini artinya antar job kita tidak punya file yang disimpan secara permanen, termasuk di antaranya konfigurasi ssh client. Jadi, setiap kali proses build berjalan, kita harus membuat pasangan private dan public key baru karena yang ada di proses build sebelumnya sudah dihapus.

Tentu ini merepotkan, karena public key untuk deployment biasanya kita daftarkan di server yang menjadi target deployment. Kalau setiap kali key baru, tentu harus didaftarkan ulang dan menjadi tidak otomatis lagi.

Solusinya, kita masukkan private key menjadi variabel dalam Gitlab, dan kita suruh dia menulis isi variabel tersebut menjadi file `.ssh/id_rsa` seperti file private key pada umumnya.

<a name="mendaftarkan-private-key"></a>
## Mendaftarkan Private Key ##

Seperti pada [artikel Jenkins terdahulu](http://software.endy.muhardin.com/java/deploy-jenkins-vps/), buka file private key dengan text editor dan kemudian copy isinya. Kemudian kita masuk ke menu `Settings > CI/CD Pipelines`. Tambahkan secret variables seperti ini

[![Secret Variable]({{site.url}}/images/uploads/2017/gitlab-ci/ssh-private-key.png)]({{site.url}}/images/uploads/2017/gitlab-ci/ssh-private-key.png)

## Membuat CI/CD Script ##

Selanjutnya, kita tinggal gunakan variabel tersebut di file `.gitlab-ci.yml` seperti ini

```yml
before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && ssh-keyscan -H "server.target.deployment.com" > ~/.ssh/known_hosts'
```

Pada script di atas, kita membuat blok `before_script` yang akan dijalankan sebelum masing-masing job dieksekusi. Ada beberapa hal yang kita kerjakan dalam blok tersebut, yaitu:

* cek apakah `ssh-agent` sudah terinstal. Bila belum install dulu dengan `apt-get`. Tentunya ini mengasumsikan kita menggunakan docker image yang turunan debian.
* load variabel atau path yang dibutuhkan `ssh-agent` ke shell yang kita gunakan (bash, csh, zsh, dan lainnya)
* daftarkan isi variabel `$SSH_PRIVATE_KEY` ke dalam `ssh-agent` sehingga bisa digunakan pada saat melakukan ssh ke mesin lain
* buat folder `.ssh` untuk menyimpan konfigurasi
* ambil ssh host key dari server tujuan menggunakan perintah `ssh-keyscan`, hasilnya daftarkan ke dalam file `.ssh/known_hosts`. Perintah ini hanya dijalankan kalau berjalan di dalam docker container. Bila kita jalankan perintah ini di shell executor, maka nanti bisa mengganggu konfigurasi yang lainnya.

Normalnya, bila kita pertama kali melakukan ssh ke mesin lain, kita akan dimintain konfirmasi host key seperti ini

```
$ ssh 192.168.10.100
The authenticity of host '192.168.10.100 (192.168.10.100)' can't be established.
ECDSA key fingerprint is SHA256:Qt7wVAJ7mW/y0TTHMgswxkb2SYhfBZ+pgkrqhQcMEbQ.
Are you sure you want to continue connecting (yes/no)? 
```

Kita harus jawab `yes` untuk bisa melanjutkan.

Nah prompt ini akan menyulitkan untuk diotomasi, karena tidak bisa dijalankan oleh script. Script kan tidak bisa menjawab `yes`. Solusinya, kita ambil dulu host key dari server tersebut menggunakan perintah `ssh-keyscan`, kemudian kita daftarkan ke file `.ssh/known_hosts`. Bila sudah didaftarkan, kita tidak akan ditanyai lagi pada waktu login.

<a name="continuous-delivery-workflow"></a>
## Continuous Delivery Workflow ##

Nah sekarang kita sudah bisa menjalankan workflow deployment sesuai [Semantic Versioning](http://semver.org/) sebagai berikut:

* untuk melakukan rilis development, buat tag dengan qualifier `M`. Contohnya `1.0.1-M.001`
* untuk melakukan rilis testing, buat tag dengan qualifier `RC`. Contohnya `2.1.0-RC.012`
* untuk melakukan rilis production, buat tag dengan qualifier `RELEASE`. Contohnya `2.1.2-RELEASE`

Untuk membuat tag dengan git, perintahnya seperti ini:

```
git tag 1.10.0-M114
git push --tags
```

Berikut adalah konfigurasi `.gitlab-ci.yml` untuk menjalankan siklus deployment di atas. Dia akan melakukan deployment sesuai dengan tag yang kita buat. 


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

cache:
  paths:
    - .m2/repository

stages:
  - build
  - deploy

before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && ssh-keyscan -H "server.development.com" >> ~/.ssh/known_hosts'
  - '[[ -f /.dockerenv ]] && ssh-keyscan -H "server.testing.com" >> ~/.ssh/known_hosts'
  - '[[ -f /.dockerenv ]] && ssh-keyscan -H "server.production.com" >> ~/.ssh/known_hosts'

maven-build:
  image: maven:3-jdk-8
  stage: build
  script: mvn package -B -Dmaven.repo.local=.m2/repository
  artifacts:
    paths:
      - target/*.jar

deploy-to-development:
  image: debian:latest
  stage: deploy
  only:
    - /-M\./
  script: 
  - scp target/*.jar root@server.development.com:/home/artivisi/aplikasi
  - ssh root@server.development.com service aplikasi restart

deploy-to-testing:
  image: debian:latest
  stage: deploy
  only:
    - /-RC\./
  script: 
  - scp target/*.jar root@server.testing.com:/home/artivisi/aplikasi
  - ssh root@server.testing.com service aplikasi restart

deploy-to-production:
  image: debian:latest
  stage: deploy
  only:
    - /-RELEASE$/
  script: 
  - scp target/*.jar root@server.production.com:/home/artivisi/aplikasi
  - ssh root@server.production.com service aplikasi restart
```

Selamat mencoba, semoga sukses :D

