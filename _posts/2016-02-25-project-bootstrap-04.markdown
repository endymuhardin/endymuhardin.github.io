---
layout: post
title: "Setup Continuous Delivery"
date: 2016-02-25 02:00
comments: true
categories: 
- java
---

Pada [artikel sebelumnya](), kita telah melakukan deployment ke cloud provider Openshift dan Heroku dari komputer lokal kita. Sekarang, kita akan mengotomasi proses deployment ini dengan Travis, sehingga apabila build berjalan sukses, aplikasi akan otomatis dideploy ke server dan bisa diakses seluruh umat manusia.

<!--more-->

## Instalasi Travis Tools ##

Travis sudah menyediakan tools command line untuk memudahkan proses konfigurasi. Tools ini dibuat berbasis Ruby, sehingga kita harus pastikan dulu ada Ruby yang terinstal. Jalankan perintah berikut untuk memastikan

```
ruby -v
```

Berikut outputnya di komputer saya

```
ruby 2.3.0p0 (2015-12-25 revision 53290) [x86_64-darwin15]
```

Selanjutnya, kita install Travis tools.

```
gem install travis
Fetching: websocket-1.2.2.gem (100%)
Successfully installed websocket-1.2.2
Fetching: pusher-client-0.6.2.gem (100%)
Successfully installed pusher-client-0.6.2
Fetching: launchy-2.4.3.gem (100%)
Successfully installed launchy-2.4.3
Fetching: highline-1.7.8.gem (100%)
Successfully installed highline-1.7.8
Fetching: net-http-pipeline-1.0.1.gem (100%)
Successfully installed net-http-pipeline-1.0.1
Fetching: net-http-persistent-2.9.4.gem (100%)
Successfully installed net-http-persistent-2.9.4
Fetching: backports-3.6.8.gem (100%)
Successfully installed backports-3.6.8
Fetching: gh-0.14.0.gem (100%)
Successfully installed gh-0.14.0
Fetching: faraday_middleware-0.10.0.gem (100%)
Successfully installed faraday_middleware-0.10.0
Fetching: travis-1.8.2.gem (100%)
Successfully installed travis-1.8.2
Parsing documentation for websocket-1.2.2
Installing ri documentation for websocket-1.2.2
Parsing documentation for pusher-client-0.6.2
Installing ri documentation for pusher-client-0.6.2
Parsing documentation for launchy-2.4.3
Installing ri documentation for launchy-2.4.3
Parsing documentation for highline-1.7.8
Installing ri documentation for highline-1.7.8
Parsing documentation for net-http-pipeline-1.0.1
Installing ri documentation for net-http-pipeline-1.0.1
Parsing documentation for net-http-persistent-2.9.4
Installing ri documentation for net-http-persistent-2.9.4
Parsing documentation for backports-3.6.8
Installing ri documentation for backports-3.6.8
Parsing documentation for gh-0.14.0
Installing ri documentation for gh-0.14.0
Parsing documentation for faraday_middleware-0.10.0
Installing ri documentation for faraday_middleware-0.10.0
Parsing documentation for travis-1.8.2
Installing ri documentation for travis-1.8.2
Done installing documentation for websocket, pusher-client, launchy, highline, net-http-pipeline, net-http-persistent, backports, gh, faraday_middleware, travis after 9 seconds
10 gems installed
```

## Setup Deployment Travis ke Openshift ##

Dengan tools command line `travis`, setup deployment sangat mudah sekali. Cukup jalankan perintah 

```
travis setup openshift
```

Selanjutnya kita akan dipandu untuk mengisi informasi yang dibutuhkan.

```
Shell completion not installed. Would you like to install it now? |y| 
Detected repository as endymuhardin/belajar-ci, is this correct? |yes| 
OpenShift user: endy.muhardin@gmail.com
OpenShift password: ****************
OpenShift application name: |belajar-ci| belajar
OpenShift domain: endymuhardin
Deploy only from endymuhardin/belajar-ci? |yes| 
Encrypt Password? |yes| 
```

Setelah semua kita isi, file `.travis.yml` akan diupdate sesuai dengan konfigurasi kita. Password Openshift kita akan dienkripsi sehingga tidak terbaca oleh orang lain.

```yml
deploy:
  provider: openshift
  user: endy.muhardin@gmail.com
  password:
    secure: yadda-yadda-yadda
  app: belajar
  domain: endymuhardin
  on:
    repo: endymuhardin/belajar-ci
```

Berikutnya, kita bisa commit dan push ke Github seperti biasa. Travis akan mendeteksinya, melakukan build, dan kemudian mendeploynya ke Openshift.

## Setup Deployment Travis ke Heroku ##

Tidak jauh berbeda dengan Openshift, setup Heroku juga dilakukan melalui tools command line `travis`. Jalankan perintah berikut

```
travis setup heroku
```

Dan kita akan ditanyai beberapa informasi yang dibutuhkan

```
Heroku application name: |belajar-ci| aplikasibelajar
Deploy only from endymuhardin/belajar-ci? |yes| 
Encrypt API key? |yes| 
```

Setelah selesai, file `.travis.yml` kita akan diupdate. Berikut tambahannya

```yml
deploy:
  provider: heroku
  api_key:
    secure: yadda-yadda-yadda
  app: aplikasibelajar
  on:
    repo: endymuhardin/belajar-ci
```

Kita tinggal commit dan push, Travis akan mendeploy aplikasi kita ke Heroku.

## Penutup ##

Demikianlah rangkaian setup project baru yang fully automated. Dengan setup ini, begitu seorang programmer melakukan push, maka _pabrik software_ akan segera bekerja, melakukan:

* Download source code terbaru
* Melakukan kompilasi
* Menjalankan semua test
* Memeriksa apakah test coverage memadai
* Mendeploy aplikasi ke server

Semua kegiatan di atas dilakukan tanpa campur tangan manusia. 

Tentunya setup di atas hanya gratis bagi project open source. Untuk project yang closed-source, setupnya akan lebih rumit dan belum tentu gratis. Kita juga bisa menggunakan Travis dan Coveralls, tapi dengan membayar iuran setiap bulannya, ditambah dengan iuran Github juga.

Semoga bermanfaat :D
