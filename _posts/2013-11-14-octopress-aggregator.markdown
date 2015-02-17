---
layout: post
title: "Octopress Aggregator"
date: 2013-11-14 10:40
comments: true
categories: 
- aplikasi
---

Website Aggregator adalah suatu website yang isinya adalah kumpulan link ke posting di website lain. Beberapa skenario penggunaan website aggregator:

* website perusahaan, ingin mencantumkan posting blog dari anggota timnya
* website komunitas, ingin mencantumkan posting blog dari anggota komunitas tersebut

Pada artikel ini kita akan membahas cara pemasangan website aggregator di aplikasi blogging Octopress.

<!--more-->


## Instalasi Dependensi ##

Kita akan menggunakan [aplikasi yang namanya planet.rb](https://github.com/pote/planet.rb). Sebelum mengikuti langkah-langkah di websitenya, terlebih dulu kita siapkan Ubuntu supaya `planet.rb` bisa diinstal.

Instalasi dependensi dilakukan dengan perintah berikut

```
sudo apt-get install libcurl3 libcurl3-gnutls libcurl4-openssl-dev
```

Setelah itu, kita install `planet.rb` dengan perintah berikut

```
gem install planet
```

Kalau menemui error seperti ini

```
ERROR:  Could not find a valid gem 'planet' (>= 0), here is why:
Unable to download data from https://rubygems.org/ - no such name (https://rubygems.org/latest_specs.4.8.gz)
```

atau ini

```
ERROR:  While executing gem ... (Gem::RemoteFetcher::UnknownHostError)
no such name (https://rubygems.org/gems/planet-0.5.1.gem)
```

artinya koneksi internet Anda bermasalah. Coba lagi dengan koneksi internet yang lain. Mungkin bisa nebeng dulu di tetangga ;)

## Konfigurasi ##

Kita generate dulu konfigurasi `planet.rb`. Jalankan perintah ini di dalam folder Octopress kita.

```
planet init
```

Perintah di atas akan membuatkan file konfigurasi `planet.yml`. Edit sesuai kebutuhan. Berikut adalah contoh konfigurasi yang saya gunakan

```ruby
planet:
    posts_directory: source/_posts/
    templates_directory: source/_layouts/
    whitelisted_tags: []

blogs:
  - author: "Endy is Programmer"
    feed:   "http://software.endy.muhardin.com/atom.xml"
    image:  "http://www.gravatar.com/avatar/31694bbf42349c6b6adfe893bb1e19d8.png"
    twitter: "endymuhardin"

  - author: "Endy is Photographer"
    feed:   "http://rana.endy.muhardin.com/atom.xml"
    image:  "http://www.gravatar.com/avatar/a3c8a6a973fc0c0fa3d89cb69c103ad0.png"
```

## Eksekusi ##

Selanjutnya, kita jalankan generatornya. `planet.rb` akan menjelajahi semua blog yang kita daftarkan dan akan membuatkan posting dalam folder `source/_posts`. 

Terakhir, kita bisa publish dan deploy seperti biasa.

## Kekurangan ##

Sayangnya `planet.rb` menaruh semua isi posting dari blog asal ke website tujuan. Nah, ini bisa [bikin google cemberut](https://support.google.com/webmasters/answer/66359?hl=en). Idealnya, saya ingin memasang potongan isi artikel saja, dengan disertai link ke artikel aslinya. Ini dikenal dengan [istilah linked list](http://daringfireball.net/linked/).

Octopress sudah memiliki [dokumentasi untuk fitur ini](http://octopress.org/docs/blogging/linklog/), tapi entah kenapa ternyata belum bisa dipakai. 

Mungkin harus coba bikin sendiri seperti dijelaskan [di sini](http://www.candlerblog.com/2012/01/30/octopress-linked-list/)

## Solusi ##

Kebetulan semua website yang ingin saya aggregasi adalah website saya sendiri, dan semuanya Octopress. Oleh karena itu, saya modifikasi saja `Atom Feed`nya supaya menghasilkan _summary_ artikel kalau ada. Kalau tidak ada _summary_, barulah tampilkan content penuhnya. 

Caranya mudah, edit file `source/atom.xml`, yang tadinya seperti ini

{% raw %}
```xml
<content type="html"><![CDATA[{{ post.content | expand_urls: site.url | cdata_escape }}]]></content>
```
{% endraw %}

menjadi seperti ini

{% raw %}
```xml
{% capture excerpted %}{{ post.content | has_excerpt }}{% endcapture %}
{% if excerpted == 'true' %}
    <summary type="html"><![CDATA[{{ post.content | split: '<!--more-->' | first | expand_urls: site.url | cdata_escape }}]]></summary>
{% else %}
<content type="html"><![CDATA[{{ post.content | expand_urls: site.url | cdata_escape }}]]></content>
{% endif %}
```
{% endraw %}

Setelah itu, generate ulang dan deploy masing-masing website. Hasilnya, pada waktu di-aggregasi hanya akan tampil _summary_ saja. Sehingga yang tampil di website aggregator tidak seluruh isi artikel. Paman Google pun tidak kesal dibuatnya ;)

Selamat mencoba
