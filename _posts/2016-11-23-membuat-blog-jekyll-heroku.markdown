---
layout: post
title: "Membuat Blog dengan Jekyll dan Heroku"
date: 2016-11-23 07:00
comments: true
categories: 
- aplikasi
---

Pada artikel terdahulu, kita sudah membahas tentang [cara membuat blog gratis di OpenShift](http://software.endy.muhardin.com/aplikasi/membuat-blog-gratis-di-openshift/). Tapi sayang sekali, saat ini OpenShift tidak lagi menerima pendaftaran baru untuk platform versi 2. Sedangkan platformnya yang baru, yaitu versi 3, membatasi akses gratis hanya 30 hari. Setelah 30 hari, ijin pakai kita berakhir masa pakainya dan aplikasi kita akan dihapus. 

Untungnya, masih ada alternatif lain, yaitu Heroku. Pada artikel ini, kita akan membahas cara pembuatan website atau blog gratis dengan Heroku.

<!--more-->

## Instalasi Jekyll ##

Pada artikel terdahulu, kita sudah membahas cara instalasi Jekyll di Ubuntu. Karena itu, saya tidak akan mengulanginya lagi. Sebagai gantinya saya akan membahas cara instalasi Jekyll di OSX Sierra.

Ruby dan Gem sudah terinstal secara default di OSX, jadi kita bisa langsung menginstal Jekyll dengan perintah berikut:

```
sudo gem install -n /usr/local/bin/ bundler jekyll
```

Opsi `-n /usr/local/bin/` penting buat OSX El Capitan ke atas, karena pada versi ini ada peningkatan sistem keamanan yang disebut dengan istilah [System Integrity Protection](https://support.apple.com/en-us/HT204899). Secara garis besar, SIP ini akan melarang siapapun untuk mengubah file di folder berikut:

* /System
* /usr
* /bin
* /sbin
* Folder aplikasi bawaan OSX

Di internet banyak saran untuk mendisable SIP ini supaya instalasi bisa berjalan lancar. Saran dari saya : **Jangan disable SIP !!!**

> SIP diadakan supaya laptop kita aman, jadi jangan didisable.

Cara lain yang lebih aman adalah dengan menginstal gem di folder `/usr/local/bin` yang bebas untuk dimodifikasi.

## Membuat Blog Baru ##

Kita bisa membuat blog dengan perintah berikut

```
jekyll new blog-baru-saya
```

Berikut adalah output dari perintah tersebut

```
New jekyll site installed in /Users/endymuhardin/tmp/blog-baru-saya. 
Running bundle install in /Users/endymuhardin/tmp/blog-baru-saya... 
Fetching gem metadata from https://rubygems.org/...........
Fetching version metadata from https://rubygems.org/..
Fetching dependency metadata from https://rubygems.org/.
Resolving dependencies...
Using public_suffix 2.0.4
Using colorator 1.1.0
Using ffi 1.9.14
Using forwardable-extended 2.6.0
Using sass 3.4.22
Using rb-fsevent 0.9.8
Using kramdown 1.13.0
Using liquid 3.0.6
Using mercenary 0.3.6
Using rouge 1.11.1
Using safe_yaml 1.0.4
Using bundler 1.13.6
Using addressable 2.5.0
Using rb-inotify 0.9.7
Using pathutil 0.14.0
Using jekyll-sass-converter 1.5.0
Using listen 3.0.8
Using jekyll-watch 1.5.0
Using jekyll 3.3.1
Using jekyll-feed 0.8.0
Using minima 2.1.0
Bundle complete! 3 Gemfile dependencies, 21 gems now installed.
Use `bundle show [gemname]` to see where a bundled gem is installed.
```

Setelah itu, kita bisa jalankan di local dengan perintah berikut

```
cd blog-baru-saya
jekyll serve
```

Outputnya sebagai berikut

```
WARN: Unresolved specs during Gem::Specification.reset:
      listen (< 3.1, ~> 3.0)
WARN: Clearing out unresolved specs.
Please report a bug if this causes problems.
Configuration file: /Users/endymuhardin/tmp/blog-baru-saya/_config.yml
Configuration file: /Users/endymuhardin/tmp/blog-baru-saya/_config.yml
            Source: /Users/endymuhardin/tmp/blog-baru-saya
       Destination: /Users/endymuhardin/tmp/blog-baru-saya/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
                    done in 0.61 seconds.
 Auto-regeneration: enabled for '/Users/endymuhardin/tmp/blog-baru-saya'
Configuration file: /Users/endymuhardin/tmp/blog-baru-saya/_config.yml
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

Kita bisa browse ke `http://localhost:4000` dan berikut adalah hasilnya

[![Jekyll Starter Page](https://lh3.googleusercontent.com/Q1KvHjx3VJodSRNPUsB3cME095LD1UC3Mm7hNvXyhWNSgif3rKvUCBrVYWWsnWp5gXXcv0bGqz4b=w968-h694-no)](https://lh3.googleusercontent.com/Q1KvHjx3VJodSRNPUsB3cME095LD1UC3Mm7hNvXyhWNSgif3rKvUCBrVYWWsnWp5gXXcv0bGqz4b=w968-h694-no)

## Membuat Repository Git ##

Blog Jekyll kita ini harus disimpan dalam repository Git, karena Heroku menggunakan Git sebagai metode deploymentnya.

Pertama, kita inisialisasi repository git di dalam folder blog kita.

```
git init
```

Outputnya seperti ini

```
Initialized empty Git repository in /Users/endymuhardin/tmp/blog-baru-saya/.git/
```

Edit file `.gitignore` di dalamnya, hapus tulisan `_site`. Folder `_site` ini adalah hasil kompilasi dari file markdown menjadi html. Bila kita deploy Jekyll ke Github, folder ini akan dibuat di server Github, sehingga tidak perlu kita simpan dalam repository. Akan tetapi, karena kita akan deploy di Heroku sebagai aplikasi PHP, maka kita membutuhkan folder ini.

Simpan isi folder ke dalam repository lokal.

```
git add .
git commit -m "commit pertama"
```

Semua file sudah tersimpan dalam repository lokal. Apabila di kemudian hari ada perubahan, misalnya penambahan posting baru, kita harus generate ulang file HTMLnya dengan perintah

```
jekyll build
```

Dan simpan ke repository

```
git add .
git commit -m "posting artikel blablabla"
```

## Membuat Aplikasi Heroku ##

Setelah blog kita berjalan dengan baik di localhost, sekarang kita akan mendeploynya di Heroku. Silahkan mendaftar dulu agar mendapatkan akun. Cara pendaftaran tidak akan kita bahas di sini.

Kita membutuhkan aplikasi command line Heroku agar bisa memilih buildpack dan mengatur custom domain. Jadi, pastikan kita menginstal dulu aplikasinya. Cara instalasinya tidak saya bahas di sini, silahkan baca [instruksi di website Heroku](https://devcenter.heroku.com/articles/heroku-command-line).

Selanjutnya, kita akan membuat aplikasi baru di Heroku. Pembuatan aplikasi ini bisa dilakukan melalui web ataupun command line. Pada artikel ini saya akan bahas saja metode command line. Metode web bisa dicoba-coba sendiri di websitenya.

Berikut perintah untuk membuat aplikasi baru

```
heroku create blog-baru-saya
```

Perintah di atas dijalankan dalam folder blog Jekyll kita tadi, yaitu tempat kita menjalankan `jekyll serve`. Outputnya seperti ini

```
Creating ⬢ blog-baru-saya... done
https://blog-baru-saya.herokuapp.com/ | https://git.heroku.com/blog-baru-saya.git
```

Perintah ini akan menambahkan remote repository `heroku` ke repository local kita. Hasilnya bisa dicek dengan perintah `git remote -v`. Harusnya akan muncul output seperti ini

```
heroku	https://git.heroku.com/blog-baru-saya.git (fetch)
heroku	https://git.heroku.com/blog-baru-saya.git (push)
```

## Konfigurasi Deployment Heroku ##

Sebetulnya, Jekyll ini adalah aplikasi yang dibuat dengan bahasa pemrograman Ruby. Karena itu, bila kita cari di Google tentang cara deployment Jekyll di Heroku, mayoritas referensi akan mengajarkan cara deployment aplikasi Ruby ke Heroku.

Akan tetapi, kita akan mendeploy blog kita ini sebagai aplikasi PHP, karena lebih mudah. Paket PHP (atau sering disebut dengan istilah `buildpack`) di Heroku sudah mencakup webserver Apache. Ini sudah memadai untuk menghosting blog kita yang hanya terdiri dari file HTML.

Untuk itu, kita setup dulu aplikasi Heroku kita dengan buildpack PHP.

```
heroku buildpacks:set heroku/php
```

Berikut outputnya

```
Buildpack set. Next release on blog-baru-saya will use heroku/php.
Run git push heroku master to create a new release using this buildpack.
```

Agar sah sebagai aplikasi PHP, kita perlu membuat file `composer.json` agar Heroku tidak bingung. Buat file kosong dengan perintah berikut

```
echo '{}' > composer.json
```

Terakhir, kita buat konfigurasi runtime untuk memberi tahu Heroku folder mana yang akan dipublikasikan oleh webserver. Dalam hal ini, folder yang ingin kita publish adalah `_site`.

Heroku akan mencari konfigurasi runtime dalam file yang bernama `Procfile`. Berikut perintah untuk membuatnya.

```
echo 'web: vendor/bin/heroku-php-apache2 _site/' > Procfile
```

Karena kita membuat perubahan (menambah 2 file), maka kita perlu melakukan build dan menyimpannya ke repository.

```
jekyll build
git add .
git commit -m "konfigurasi Heroku"
```

## Deployment ##

Untuk melakukan deployment, cukup lakukan `git push` ke Heroku.

```
git push heroku master
```

Berikut outputnya

```
Counting objects: 39, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (25/25), done.
Writing objects: 100% (39/39), 11.77 KiB | 0 bytes/s, done.
Total 39 (delta 7), reused 0 (delta 0)
remote: Compressing source files... done.
remote: Building source:
remote: 
remote: -----> PHP app detected
remote: -----> Bootstrapping...
remote: -----> Installing platform packages...
remote:        NOTICE: No runtime required in composer.lock; using PHP ^5.5.17
remote:        - apache (2.4.20)
remote:        - nginx (1.8.1)
remote:        - php (5.6.28)
remote: -----> Installing dependencies...
remote:        Composer version 1.2.2 2016-11-03 17:43:15
remote: -----> Preparing runtime environment...
remote: -----> Checking for additional extensions to install...
remote: -----> Discovering process types
remote:        Procfile declares types -> web
remote: 
remote: -----> Compressing...
remote:        Done: 13.5M
remote: -----> Launching...
remote:        Released v3
remote:        https://blog-baru-saya.herokuapp.com/ deployed to Heroku
remote: 
remote: Verifying deploy... done.
To https://git.heroku.com/blog-baru-saya.git
 * [new branch]      master -> master
```

Selesai :D

Kita bisa browse ke URL yang ditunjukkan pada output perintah di atas, yaitu `https://blog-baru-saya.herokuapp.com/`. Hasilnya seperti ini

![[Blog sudah terdeploy](https://lh3.googleusercontent.com/vBrmaOLZfwcgPYEL-9vI9rfc6Y8Nfw0Gabljbpo8mCJfx_SALnOINO4y0cS-oOYYB3lES10BQ9j2=w968-h694-no)](https://lh3.googleusercontent.com/vBrmaOLZfwcgPYEL-9vI9rfc6Y8Nfw0Gabljbpo8mCJfx_SALnOINO4y0cS-oOYYB3lES10BQ9j2=w968-h694-no)

## Custom Domain ##

Blog yang kita deploy tadi terpublikasi dengan domain `herokuapp.com`. Tentunya kita ingin menggunakan nama domain sendiri, misalnya `belajarblog.endy.muhardin.com`.

Ada dua tahap konfigurasi yang harus dilakukan, pertama di Heroku, dan kedua di DNS server yang mengelola domain `muhardin.com`.

Di sisi Heroku, kita tinggal menjalankan perintah berikut

```
heroku domains:add belajarblog.endy.muhardin.com
```

Outputnya sebagai berikut

```
Adding belajarblog.endy.muhardin.com to ⬢ blog-baru-saya... done
 ▸    Configure your app's DNS provider to point to the DNS Target
 ▸    blog-baru-saya.herokuapp.com.
 ▸    For help, see https://devcenter.heroku.com/articles/custom-domains
```

Selanjutnya, kita pindah ke konfigurasi DNS Server. Saya menggunakan layanan gratis dari [Namecheap](https://www.namecheap.com/) untuk mengelola domain saya.

Login ke Namecheap, dan tambahkan `CNAME` record yang menunjuk ke `blog-baru-saya.herokuapp.com.`. Jangan lupa titik di belakang URL Heroku, itu penting untuk menunjukkan bahwa nama domainnya absolut, bukan relatif.

Berikut tampilan konfigurasinya di Namecheap

![[Konfigurasi Namecheap](https://lh3.googleusercontent.com/PeX8oiBxl9uTRT48PF6rETG-w42Fnt31MvJSDML80C7Lr1vw90pY7EtPLYnA3mt4LtyiY0NQ-MkP=w1080-h650-no)](https://lh3.googleusercontent.com/PeX8oiBxl9uTRT48PF6rETG-w42Fnt31MvJSDML80C7Lr1vw90pY7EtPLYnA3mt4LtyiY0NQ-MkP=w1080-h650-no)

Nah, sekarang kita sudah bisa mengakses alamat tersebut di browser

![[Custom Domain](https://lh3.googleusercontent.com/q_am7lJ87XVEI-sn5sh-YVFvFxs4jL3x626w88Ygzt9ce7of5WepZIACeeEG5Jx9Hzu0vVmhVTOc=w968-h694-no)](https://lh3.googleusercontent.com/q_am7lJ87XVEI-sn5sh-YVFvFxs4jL3x626w88Ygzt9ce7of5WepZIACeeEG5Jx9Hzu0vVmhVTOc=w968-h694-no)

## Penutup ##

Demikianlah cara membuat blog gratis dengan Jekyll, Heroku, dan Namecheap. Total biaya yang kita keluarkan hanyalah Rp. 90.000/tahun untuk membayar domain. Tidak mahal kan?

Selamat mencoba dan semoga bermanfaat ;)

