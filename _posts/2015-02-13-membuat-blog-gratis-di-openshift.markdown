---
layout: post
title: "Membuat Blog Gratis di Openshift"
date: 2015-02-13 22:28
comments: true
categories: 
- aplikasi
---

> Pengen cepat jadi expert?

Caranya sederhana. Cukup bikin blog, kemudian konsisten menulis tentang topik tertentu paling tidak seminggu sekali.

> Waduh, menulis itu sulit. Apalagi konsisten.

Makanya saya bilang sederhana, bukan mudah :)

Sebetulnya membuat blog jaman sekarang sudah semakin mudah dan murah. Tanpa keluar uang sepeserpun kita sudah bisa punya blog bagus. Desain tampilan juga banyak tersedia free. Bahkan desain gratis tersebut sudah _responsive_, artinya tetap bagus dilihat dari berbagai ukuran layar.

Setelah blog kita jadi, tempat menaruhnya pun gratis. Beberapa yang populer diantaranya: [wordpress](http://www.wordpress.com/), [tumblr](https://www.tumblr.com/), dan lain sebagainya.

Buat kita para programmer, tersedia juga aplikasi blog yang geeky, diantaranya [jekyll](http://jekyllrb.com/), [octopress](http://octopress.org/) (dibangun di atas jekyll), [middleman](https://middlemanapp.com/basics/blogging/), [ghost](https://ghost.org/), [dan teman-temannya](https://iwantmyname.com/blog/2011/02/list-static-website-generators.html).

Berbagai aplikasi yang saya sebutkan di atas memiliki kesamaan, semuanya adalah [static content generator](https://wiki.python.org/moin/StaticSiteGenerator). Artinya, dia mengkonversi tulisan kita menjadi HTML. File HTML tersebut tinggal kita upload ke webserver merek apapun. Dia juga tidak butuh database server. Ini akan sangat menyederhanakan kebutuhan di sisi server.

Pada artikel ini, kita akan membahas cara membuat blog menggunakan Jekyll dan kemudian memasangnya di PaaS provider Openshift.

<!--more-->

Sebetulnya ada beberapa provider yang mendukung Jekyll, selain Openshift kita juga bisa pakai Heroku atau Github. Cara deploy ke kedua provider tersebut sudah dijelaskan di dokumentasi Jekyll, sehingga tidak perlu kita bahas lagi.

[![Dokumentasi Deployment](https://lh5.googleusercontent.com/-0v-aweJAqUQ/VNSNiRPuxbI/AAAAAAAAH38/gzzHemMzJEY/w916-h558-no/07.%2BJekyll%2BHomepage.png)](https://lh5.googleusercontent.com/-0v-aweJAqUQ/VNSNiRPuxbI/AAAAAAAAH38/gzzHemMzJEY/w916-h558-no/07.%2BJekyll%2BHomepage.png)

Secara garis besar, berikut langkah-langkah yang akan kita kerjakan:

1. Instalasi Jekyll
2. Mencari theme yang cocok
3. Mulai menulis artikel
4. Compile dan Preview di komputer kita
5. Buat akun Openshift
6. Buat aplikasi untuk blog kita
7. Deploy ke Openshift
8. Periksa hasilnya

## Instalasi Jekyll ##

Jekyll merupakan aplikasi yang dibuat dengan Ruby. Dengan demikian, kita perlu menginstall Ruby terlebih dulu.

### Instalasi Ruby ###

Tambahkan repository PPA brightbox.

```
sudo apt-add-repository ppa:brightbox/ruby-ng
```

Update database aplikasi

```
sudo apt-get update
```


Install Ruby 1.9

```
sudo apt-get install ruby1.9.3
```

Setelah itu, kita bisa langsung menginstall jekyll

```
sudo gem install jekyll
```

## Jekyll Theme ##

Sebetulnya pada titik ini kita sudah bisa langsung membuat website dengan perintah

```
jekyll new blogsaya
```

Tetapi, kita tentu ingin tampilan yang menarik. Untuk itu, kita cari dulu theme yang bagus untuk Jekyll. 

[![Mencari theme Jekyll](https://lh4.googleusercontent.com/--lDlOyCn2Tw/VNSNva-nFTI/AAAAAAAAH4c/uNvFEtLvnBA/w791-h582-no/10.%2BCari%2BTheme.png)](https://lh4.googleusercontent.com/--lDlOyCn2Tw/VNSNva-nFTI/AAAAAAAAH4c/uNvFEtLvnBA/w791-h582-no/10.%2BCari%2BTheme.png)

Ada banyak hasil di sana. Coba satu persatu sampai ketemu yang cocok.

Baca instruksinya, dia bilang langsung saja extract.

[![Extract Theme](https://lh4.googleusercontent.com/-VMnzqkZ07dA/VNSNvmnMcXI/AAAAAAAAH4Y/TQ9en2RctLI/w855-h578-no/11.%2BDownload%2Bdan%2BExtract.png)](https://lh4.googleusercontent.com/-VMnzqkZ07dA/VNSNvmnMcXI/AAAAAAAAH4Y/TQ9en2RctLI/w855-h578-no/11.%2BDownload%2Bdan%2BExtract.png)

Berikut isi folder setelah diextract.

[![Hasil Extract](https://lh3.googleusercontent.com/-dt0_MXF-F_E/VNSN8_MmXLI/AAAAAAAAH4k/3VLoa6em0mY/w855-h578-no/12.%2BHasil%2BExtract.png)](https://lh3.googleusercontent.com/-dt0_MXF-F_E/VNSN8_MmXLI/AAAAAAAAH4k/3VLoa6em0mY/w855-h578-no/12.%2BHasil%2BExtract.png)

Coba kita jalankan dengan perintah `bundle exec jekyll serve`

[![Run Jekyll](https://lh5.googleusercontent.com/-w7tQ96eZQ8o/VNSOBSAWlDI/AAAAAAAAH4s/QDyxCTb-lKU/w728-h494-no/13.%2BJalankan%2Bdi%2Blocal.png)](https://lh5.googleusercontent.com/-w7tQ96eZQ8o/VNSOBSAWlDI/AAAAAAAAH4s/QDyxCTb-lKU/w728-h494-no/13.%2BJalankan%2Bdi%2Blocal.png)

Kemudian browse ke `http://localhost:4000`.

[![Local Deployment](https://lh5.googleusercontent.com/-4E-myZULncY/VNSOJDurMBI/AAAAAAAAH40/jiwixObwMnw/w917-h566-no/14.%2BBrowse%2BLocal.png)](https://lh5.googleusercontent.com/-4E-myZULncY/VNSOJDurMBI/AAAAAAAAH40/jiwixObwMnw/w917-h566-no/14.%2BBrowse%2BLocal.png)

Nah, website kita sudah jalan di komputer kita sendiri. Sekarang, tinggal kita pasang di Openshift.

## Pendaftaran Openshift ##

Kita perlu membuat akun di Openshift terlebih dulu. Caranya mudah, langsung saja isi form yang disediakan di websitenya.

[![Website Openshift](https://lh3.googleusercontent.com/-RAP1-lNzkkk/VNSNcEHC_oI/AAAAAAAAH3Y/9hRUK_dB3CM/w916-h528-no/01.%2BOpenshift%2BWebsite.png)](https://lh3.googleusercontent.com/-RAP1-lNzkkk/VNSNcEHC_oI/AAAAAAAAH3Y/9hRUK_dB3CM/w916-h528-no/01.%2BOpenshift%2BWebsite.png)

## Membuat Aplikasi ##

Setelah membuat akun dan login, kita bisa langsung klik link untuk membuat aplikasi baru.

[![Welcome Screen](https://lh4.googleusercontent.com/-osxSBeceqjc/VNSNbx9oc1I/AAAAAAAAH3U/vTV27OtGsLA/w916-h522-no/02.%2BOpenshift%2BWelcome.png)](https://lh4.googleusercontent.com/-osxSBeceqjc/VNSNbx9oc1I/AAAAAAAAH3U/vTV27OtGsLA/w916-h522-no/02.%2BOpenshift%2BWelcome.png)

Untuk aplikasi Jekyll, Openshift telah menyediakan starter pack khusus (cartridge dalam istilah Openshift). Langsung saja search

[![Search Cartridge](https://lh4.googleusercontent.com/-W_H0vkwfxS8/VNSNcNWgLLI/AAAAAAAAH3c/WR0cj05L0QQ/w876-h623-no/03.%2BJenis%2BAplikasi.png)](https://lh4.googleusercontent.com/-W_H0vkwfxS8/VNSNcNWgLLI/AAAAAAAAH3c/WR0cj05L0QQ/w876-h623-no/03.%2BJenis%2BAplikasi.png)

Kemudian klik

[![Jekyll Cartridge](https://lh4.googleusercontent.com/-sHIp8sVVCpY/VNSNfEgoYvI/AAAAAAAAH3s/57pQUsECd5A/w898-h623-no/04.%2BJekyll%2BCartridge.png)](https://lh4.googleusercontent.com/-sHIp8sVVCpY/VNSNfEgoYvI/AAAAAAAAH3s/57pQUsECd5A/w898-h623-no/04.%2BJekyll%2BCartridge.png)

Isikan nama aplikasi

[![Nama Aplikasi](https://lh4.googleusercontent.com/-Gxc-Bkk9USk/VNSNf1PmZCI/AAAAAAAAH3w/uBq-Nux9ceY/w857-h623-no/05.%2BCukup%2Bisi%2Bnama%2Baplikasi.png)](https://lh4.googleusercontent.com/-Gxc-Bkk9USk/VNSNf1PmZCI/AAAAAAAAH3w/uBq-Nux9ceY/w857-h623-no/05.%2BCukup%2Bisi%2Bnama%2Baplikasi.png)

Klik OK. Aplikasi sudah dibuat. Kita akan diberikan URL untuk melakukan `git clone`

[![Sukses](https://lh3.googleusercontent.com/-siiXJ3o4rwo/VNSNgEMQjwI/AAAAAAAAH30/E9VrPkeHglU/w868-h623-no/06.%2BAplikasi%2Bselesai%2Bdibuat.png)](https://lh3.googleusercontent.com/-siiXJ3o4rwo/VNSNgEMQjwI/AAAAAAAAH30/E9VrPkeHglU/w868-h623-no/06.%2BAplikasi%2Bselesai%2Bdibuat.png)

Sebetulnya ini juga bisa kita lakukan melalui command prompt.

Install dulu aplikasi Openshift di komputer. Aplikasinya dibuat menggunakan Ruby, sehingga kita gunakan `gem` untuk menginstalnya


Setelah terinstall, kita login dulu

```
rhc setup
```

dia akan meminta username dan password Openshift kita. Kemudian menampilkan daftar aplikasi yang sudah kita miliki.

```
OpenShift Client Tools (RHC) Setup Wizard

This wizard will help you upload your SSH keys, set your application namespace,
and check that other programs like Git are properly installed.

If you have your own OpenShift server, you can specify it now. Just hit enter to
use the server for OpenShift Online: openshift.redhat.com.
Enter the server hostname: |openshift.redhat.com| 

You can add more servers later using 'rhc server'.

Using an existing token for endy.muhardin@gmail.com to login to
openshift.redhat.com

Saving configuration to /home/endy/.openshift/express.conf ... done

Checking for git ... found git version 2.2.2

Checking common problems .. done

Checking for a domain ... endymuhardin

Checking for applications ... found 1

  blogbisnis http://blogbisnis-endymuhardin.rhcloud.com/

  You are using 1 of 3 total gears
  The following gear sizes are available to you: small

Your client tools are now configured.
```

Setelah berhasil login, kita buat aplikasi dengan menggunakan cartridge Jekyll

```
rhc app create jekyll https://raw.github.com/openshift-cartridges/openshift-jekyll-cartridge/master/metadata/manifest.yml
```

Aplikasi siap diisi

Jangan lupa catat URL aplikasi. Inilah URL yang akan menampilkan blog kita nantinya. Berikut adalah URL aplikasi yang kita dapatkan sesuai contoh di atas

## Proses Deployment ##

Deployment Openshift dilakukan menggunakan aplikasi version control Git. 

Pertama, kita clone dulu repo aplikasi yang sudah dibuatkan Openshift.

```
git clone ssh://54d478d14382ec586c000058@blogbisnis-endymuhardin.rhcloud.com/~/git/blogbisnis.git blogbisnis
```

Kemudian, pindahkan blog Jekyll kita tadi ke dalam folder hasil clone dari Openshift

Selanjutnya commit seperti biasa

```
git add -A .
git commit -m "commit pertama website jekyll"
```

Lalu lakukan push untuk mendeploy

```
git push
```

Berikut output dari perintah di atas

```
Counting objects: 155, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (149/149), done.
Writing objects: 100% (155/155), 1.24 MiB | 0 bytes/s, done.
Total 155 (delta 8), reused 0 (delta 0)
remote: Stopping jekyll cart
remote: Sending SIGTERM to jekyll:193432 ...
remote: Building git ref 'master', commit 52fa2f6
remote: Preparing build for deployment
remote: Deployment id is 45c5465a
remote: Activating deployment
remote: Starting jekyll cart
remote: Executing bundle install
remote: Fetching gem metadata from https://rubygems.org/.........
remote: Resolving dependencies...
remote: Using blankslate (2.1.2.4) 
remote: Using hitimes (1.2.2) 
remote: Using timers (4.0.1) 
remote: Using celluloid (0.16.0) 
remote: Using fast-stemmer (1.0.2) 
remote: Using classifier-reborn (2.0.3) 
remote: Using coffee-script-source (1.9.0) 
remote: Using execjs (2.3.0) 
remote: Using coffee-script (2.3.0) 
remote: Using colorator (0.1) 
remote: Using ffi (1.9.6) 
remote: Using jekyll-coffeescript (1.0.1) 
remote: Using jekyll-gist (1.1.0) 
remote: Using jekyll-paginate (1.1.0) 
remote: Using sass (3.4.11) 
remote: Using jekyll-sass-converter (1.3.0) 
remote: Using rb-fsevent (0.9.4) 
remote: Using rb-inotify (0.9.5) 
remote: Using listen (2.8.5) 
remote: Using jekyll-watch (1.2.1) 
remote: Using kramdown (1.5.0) 
remote: Using liquid (2.6.2) 
remote: Using mercenary (0.3.5) 
remote: Using posix-spawn (0.3.9) 
remote: Using yajl-ruby (1.2.1) 
remote: Using pygments.rb (0.6.2) 
remote: Using redcarpet (3.2.2) 
remote: Using safe_yaml (1.0.4) 
remote: Using parslet (1.5.0) 
remote: Using toml (0.1.2) 
remote: Using jekyll (2.5.3) 
remote: Installing jekyll-sitemap (0.8.0) 
remote: Installing octopress-deploy (1.0.5) 
remote: Installing octopress-hooks (2.4.1) 
remote: Installing octopress-escape-code (2.0.6) 
remote: Installing titlecase (0.1.1) 
remote: Installing octopress (3.0.0.rc.32) 
remote: Using bundler (1.3.5) 
remote: Your bundle is complete!
remote: Use `bundle show [gemname]` to see where a bundled gem is installed.
remote: Starting Jekyll server
remote: Found 127.6.249.129:8080 listening port
remote: -------------------------
remote: Git Post-Receive Result: success
remote: Activation status: success
remote: Deployment completed with status: success
To ssh://54d478d14382ec586c000058@blogbisnis-endymuhardin.rhcloud.com/~/git/blogbisnis.git
   722b0dc..52fa2f6  master -> master
```

Coba browse ke url aplikasi kita di Openshift, yaitu `http://blogbisnis-endymuhardin.rhcloud.com`

[![Deploy di Openshift](https://lh6.googleusercontent.com/-iY15Z743RWw/VNSORWJhavI/AAAAAAAAH5E/YgL7ibpTUOc/w874-h623-no/15.%2BDeploy%2Bke%2BOpenshift.png)](https://lh6.googleusercontent.com/-iY15Z743RWw/VNSORWJhavI/AAAAAAAAH5E/YgL7ibpTUOc/w874-h623-no/15.%2BDeploy%2Bke%2BOpenshift.png)

Voila, website kita sudah selesai.

## Custom Domain ##

Pada titik ini sebetulnya website kita sudah berfungsi dengan sempurna. Walaupun demikian, untuk keperluan personal branding ini belum maksimal, karena namanya masih mengandung nama Redhat dan berbau gratisan. Dengan menambah investasi USD10 per tahun, kita bisa membeli domain atas nama kita sendiri, misalnya `endy.muhardin.com` untuk kemudian kita arahkan ke website kita tadi.

Proses pembelian domain tidak akan saya ceritakan di sini karena amat sangat terlalu mudahnya. Asumsikan saja kita sudah punya domain dan DNS server untuk mengaturnya.

Cara untuk mengaktifkan custom domain di Openshift bisa dicari dengan mudah di Google

[![Search Custom Domain Deployment](https://lh6.googleusercontent.com/-eWzSXRQo5wI/VNSOSNew31I/AAAAAAAAH5M/1MqLL4CsW3w/w744-h623-no/16.%2BCari%2Bcara%2Buntuk%2Bcustom%2Bdomain.png)](https://lh6.googleusercontent.com/-eWzSXRQo5wI/VNSOSNew31I/AAAAAAAAH5M/1MqLL4CsW3w/w744-h623-no/16.%2BCari%2Bcara%2Buntuk%2Bcustom%2Bdomain.png)

Kita akan mendapatkan tutorialnya di website Openshift sendiri

[![Cara setting custom domain](https://lh3.googleusercontent.com/-p8QXyZfZDEA/VNSOSPxhrtI/AAAAAAAAH5I/OT5C0HVx1EY/w891-h552-no/17.%2BCommand%2Balias.png)](https://lh3.googleusercontent.com/-p8QXyZfZDEA/VNSOSPxhrtI/AAAAAAAAH5I/OT5C0HVx1EY/w891-h552-no/17.%2BCommand%2Balias.png)

### Konfigurasi DNS ###

Agar nama domain kita tadi mengarah ke website kita, perlu ditambahkan konfigurasi CNAME di DNS. Berikut ilustrasinya dengan menggunakan layanan ClouDNS yang saya gunakan

[![Edit CNAME ClouDNS](https://lh5.googleusercontent.com/-YqGp8TjNQsQ/VNSOUI7qP4I/AAAAAAAAH5g/n8U3y1YHxBQ/w917-h376-no/18.%2BDNS%2BConfig.png)](https://lh5.googleusercontent.com/-YqGp8TjNQsQ/VNSOUI7qP4I/AAAAAAAAH5g/n8U3y1YHxBQ/w917-h376-no/18.%2BDNS%2BConfig.png)

Seperti Anda lihat pada screenshot di atas, saya memiliki beberapa domain lain yang mengarah ke github dan heroku. Yaitu

* [software.endy.muhardin.com](http://software.endy.muhardin.com) : mengarah ke servernya Github
* [rana.endy.muhardin.com](http://rana.endy.muhardin.com) : mengarah ke servernya Heroku

Tambahkan entri berjenis CNAME untuk nama domain `bisnis.endy.muhardin.com` dan arahkan ke `blogbisnis-endymuhardin.rhcloud.com`.

[![Konfigurasi CNAME](https://lh3.googleusercontent.com/-uMAGnXHALqA/VN4krEtZs3I/AAAAAAAAH6k/6-eGym0Z0hI/w917-h418-no/19.%2BCNAME%2BEntry.png)](https://lh3.googleusercontent.com/-uMAGnXHALqA/VN4krEtZs3I/AAAAAAAAH6k/6-eGym0Z0hI/w917-h418-no/19.%2BCNAME%2BEntry.png)

### VirtualHost Openshift ###
Alamat domain kita sudah mengarah ke server Openshift. Ini bisa dibuktikan kalau kita browse ke `http://bisnis.endy.muhardin.com` akan diarahkan ke servernya Openshift.

[![Virtual Host Error](https://lh4.googleusercontent.com/-S8Ul3djmpWA/VNSOU26jUoI/AAAAAAAAH5k/PmtKZJDR2Zo/w917-h401-no/20.%2BBelum%2Bdibikin%2Balias.png)](https://lh4.googleusercontent.com/-S8Ul3djmpWA/VNSOU26jUoI/AAAAAAAAH5k/PmtKZJDR2Zo/w917-h401-no/20.%2BBelum%2Bdibikin%2Balias.png)

Kita bisa lihat pada screenshot di atas, Openshift sudah menerima request. Tapi muncul pesan error karena dia tidak paham bagaimana menangani request tersebut.

Untuk itu, kita perlu membuat konfigurasi virtual host dulu. Gunanya supaya Openshift bisa mengenali request ke `bisnis.endy.muhardin.com`

Ini bisa dilakukan melalui web

[![Web Based Custom Domain](https://lh6.googleusercontent.com/-BK2dMIan4VM/VN4XscJhKGI/AAAAAAAAH6U/f83fyASiyK8/w663-h623-no/22.%2BCustom%2BDomain%2BWeb%2BBased.png)](https://lh6.googleusercontent.com/-BK2dMIan4VM/VN4XscJhKGI/AAAAAAAAH6U/f83fyASiyK8/w663-h623-no/22.%2BCustom%2BDomain%2BWeb%2BBased.png)

Atau melalui command line

```
rhc alias add blogbisnis bisnis.endy.muhardin.com
```

Berikut outputnya

```
Alias 'bisnis.endy.muhardin.com' has been added.
```

Setelah selesai, coba kita browse `http://bisnis.endy.muhardin.com`

[![Custom Domain Success](https://lh6.googleusercontent.com/-8dmIdYTjdyc/VNSOdH0KxqI/AAAAAAAAH5s/nMwJOFxyJe4/w827-h623-no/21.%2BSudah%2Bdibikin%2Balias.png)](https://lh6.googleusercontent.com/-8dmIdYTjdyc/VNSOdH0KxqI/AAAAAAAAH5s/nMwJOFxyJe4/w827-h623-no/21.%2BSudah%2Bdibikin%2Balias.png)

Nah selesailah website kita. Tinggal diisi saja


## Kesimpulan ##

Membuat blog atau website pribadi itu mudah dan murah. Sebagai praktisi IT, personal website sudah menjadi hal yang wajib. Ini bukan trend sesaat seperti dinyatakan 'pakar' pornomatika nasional, tapi adalah saluran kita untuk berbagi pengetahuan buat orang lain.

Yuk, mari menulis di blog.
