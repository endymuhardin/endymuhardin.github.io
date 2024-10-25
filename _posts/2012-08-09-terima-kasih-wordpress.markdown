---
layout: post
title: "Terima kasih Wordpress"
date: 2012-08-09 13:54
comments: true
published: true
categories: 
- aplikasi
---

Sejak pertama saya membuat blog, aplikasi yang saya gunakan adalah [Wordpress](http://www.wordpress.org). Aplikasi Wordpress sangat mudah digunakan dan banyak fiturnya. Selain itu, themes gratisan di internet juga berlimpah ruah, sehingga kita bisa ganti tampilan setiap hari kalau mau. 

Walaupun demikian, zaman berganti, dan cara kita bekerja juga berubah. Saya saat ini lebih banyak berkutat di pemrograman dengan workflow sebagai berikut : 

1. Buka text editor
2. Edit source code
3. Jalankan di local dan test
4. Kalau sudah ok, simpan di version control (commit)
5. Ulangi ke langkah 2 sampai selesai
6. Begitu sudah siap untuk sharing hasil pekerjaan, upload (push) perubahan ke version control pusat. 

Workflow ini sayangnya tidak dapat dilakukan untuk menulis blog. Workflow saya dalam menulis blog biasanya seperti ini: 

1. Buka text editor
2. Ketik dalam format text file biasa, dengan menggunakan HTML tag bila perlu
3. Simpan di folder Dropbox selama masih draft
4. Setelah siap dipublish, buka Wordpress di browser
5. Login ke Wordpress
6. Create New Post
7. Copy - Paste dari text editor
8. Preview dan rapikan lagi
9. Publish

Seperti bisa kita lihat, dengan workflow di atas, praktis fitur-fitur Wordpress yang serba canggih tidak termanfaatkan. Oleh karena itu, sudah tiba saatnya untuk mencari aplikasi blogging yang **lebih sedikit** fiturnya. Biasanya orang mengganti aplikasi dengan yang lebih banyak fiturnya, tapi kali ini saya melakukan hal yang sebaliknya. 

<!--more-->

Setelah mencari berbagai alternatif, pilihan jatuh ke [Jekyll](https://github.com/mojombo/jekyll/). Jekyll adalah static content generator. Kita menulis artikel dalam format [Markdown](http://daringfireball.net/projects/markdown/), yaitu text file biasa dengan sedikit markup yang enak dilihat mata. Kalau kita pernah mengedit wiki, format Markdown tidak asing lagi bagi kita. 

Cara kerja Jekyll berbeda dengan aplikasi blog atau CMS pada umumnya. Kalau kita menggunakan Wordpress, Joomla, Drupal, dsb, artikel kita akan disimpan di database. Berdasarkan URL atau link yang diklik pengunjung, aplikasi CMS akan mencarikan artikel di database, memproses formattingnya, dan menampilkan ke browser. Aplikasi CMS biasanya kita instal di server kita di internet, sehingga server kita tersebut harus mendukung bahasa pemrograman yang digunakan CMS dan juga harus memiliki database server. Sebagai contoh, untuk menjalankan Wordpress, server kita harus bisa PHP dan memiliki MySQL.

Berbeda dengan Wordpress, Joomla, Drupal, dan CMS pada umumnya, blog yang dibuat dengan Jekyll tidak dynamic. Semua variabel dan logika looping diproses di komputer kita sendiri. Hasil pemrosesan ini menghasilkan file HTML yang sudah jadi. File HTML inilah yang kita upload ke server. Dengan demikian, di dalam server semua file bersifat static. 

Ada beberapa konsekuensi dari static website seperti ini. 
Sisi positifnya :

* kebutuhan server menjadi lebih sederhana, tidak perlu lagi PHP dan MySQL
* halaman artikel bisa ditampilkan dengan lebih cepat karena tidak perlu query dan pemrosesan
* karena tidak ada query dan proses, mau berapapun request per detik tidak terlalu membebani CPU/RAM/Disk
* anti dihack, kecuali sistem operasinya yang ditembus. Kalau kita pakai Wordpress dkk, kita harus rajin upgrade untuk menambal bug security yang baru saja difix. 

Sisi negatifnya :

* tidak bisa menampung komentar. Ini saya atasi dengan Facebook Comment. 

Nah, karena positifnya lebih banyak dari negatifnya, maka saya putuskan untuk migrasi. 

Saya tidak menggunakan Jekyll yang aslinya, melainkan framework yang dibuat di atas Jekyll. Ada beberapa pilihan, misalnya [Jekyll Bootstrap (JB)](http://jekyllbootstrap.com/), [Ruhoh](http://ruhoh.com/), dan [Octopress](http://octopress.org). Ruhoh rupanya dibuat oleh orang yang sama dengan pembuat JB karena dia sudah bosan dengan JB, dan nampaknya dia juga sedang sibuk sehingga Ruhoh juga tidak dimaintain. Jadilah pilihan jatuh ke Octopress. 

Octopress memiliki berbagai fitur, diantaranya:

* Source code formatting. Ini adalah fitur yang sulit digunakan di Wordpress. Harus instal berbagai plugin dan sering berantakan tampilannya. Ini menyebabkan saya harus menggunakan [Gist](http://gist.github.com). 
* Deploy script ke Github, Heroku, dan rsync. Dengan fitur ini, saya bisa membuat [mirror blog saya di Github](http://endymuhardin.github.com).
* Berbagai plugin yang sudah disertakan secara built in, misalnya tag khusus untuk image dan video.

Proses migrasi berjalan sebagai berikut : 

1. Setup Octopress
2. Customize theme
3. Unduh artikel lama di Wordpress menggunakan [exitwp.py](https://github.com/thomasf/exitwp/)
4. Bersihkan beberapa tag yang tidak kompatibel, diantaranya tabel, gist, dan image
5. Pindahkan artikel ke Octopress
6. Generate dan deploy

# Setup Octopress #
Octopress disiapkan dengan beberapa langkah berikut :

1. Install Ruby dengan RVM
2. Install Jekyll
3. Clone repository Octopress
4. Konfigurasi Octopress

Ada beberapa konfigurasi yang saya lakukan di file `_config.yml`, yaitu : 

## Informasi Umum ##

```ruby
url: http://endy.artivisi.com/blog
title: Living life and make it better
subtitle: life, learn, contribute
author: Endy Muhardin
```

## Permalink ##
Supaya sama dengan URL blog lama, format URL di Octopress juga harus disesuaikan sbb : 

```ruby
permalink: /:categories/:title/
```

## Pagination ##
Di halaman pertama cukup tampilkan 3 entri terbaru. Di sidebar, tampilkan 10 link artikel terakhir. 

```ruby
paginate: 3
recent_posts: 10
```


# Customize Theme #
Supaya tidak keliatan seragam, saya mencari theme untuk Octopress. Sejauh ini baru menemukan [Darkstripes](https://github.com/amelandri/darkstripes), jadi langsung saja dipasang. 

# Mengolah artikel lama #
Sebetulnya ada beberapa cara untuk memigrasi artikel lama. Saya menggunakan exitwp yang nampaknya lebih mudah. Berikut langkah-langkahnya : 

1. Export dulu artikel lama dari Wordpress ke format XML. 
2. Jalankan exitwp.py untuk mengkonversi ke format markdown. 

## Memproses tag image ##

Selanjutnya, saya harus membersihkan tag image dan caption bawaan Wordpress, karena tidak bisa tampil dengan baik. Saya menggunakan perintah sed di linux agar bisa memproses banyak file sekaligus. 

Berikut perintah untuk memperbaiki tag image yang tadinya seperti ini <code>!\[Synergy Screenshot](/images/uploads/2006/05/synergy.gif)</code> menjadi seperti ini <code>![Synergy Screenshot ](/uploads/2006/05/synergy.gif) </code>, saya gunakan perintah berikut : 

{% raw %}
```sh
find . -name "*.markdown" -print | xargs sed -i "s|\[!\[\(.*\)\](\(.*\))\](\(.*\))|{% img \2 \1 %}|g"
```
{% endraw %}

Tag caption juga harus dihilangkan, berikut perintahnya: 

```sh
find . -name "*.markdown" -print | xargs sed -i "s|\[caption.*\]\(.*\)\[/caption\]|\1|g"
```

Secara default, exitwp akan menghasilkan tag image dengan URL lengkap, misalnya <code>http://endy.artivisi.com/blog/wp-content|/images/uploads/2006/05/synergy.gif</code> dan masih mengarah ke Wordpress. Saya ingin mengubah ini menjadi URL relatif, yaitu <code>/images/uploads/2006/05/synergy.gif</code>

Berikut perintahnya : 

```sh
find . -name "*.markdown" -print | xargs sed -i "s|http://endy.artivisi.com/blog/wp-content|/images|g"
```

## Memproses tag gist ##
Seperti saya tuliskan di sini, saya menggunakan plugin Wordpress untuk [menampilkan Gist](http://endy.artivisi.com/blog/Aplikasi/menggunakan-gist/). Octopress sudah memiliki dukungan sendiri terhadap Gist, sehingga harus ada proses konversi. Berikut perintahnya : 

```sh
find . -name "*.markdown" -print | xargs sed -i "s|\[gist id=\(.*\) file=\(.*\)\]|{% gist \1 \2 %}|g"
find . -name "*.markdown" -print | xargs sed -i "s| bump=.||g"
```

# Facebook Comment #
Untuk menggantikan fitur komentar, ada beberapa alternatif yang bisa digunakan, diantaranya : 

* Disqus
* Facebook
* Tanpa comment

Melihat audiens blog yang rata-rata memiliki akun Facebook, maka baiklah kita pilih Facebook saja. Cara mengaktifkannya bisa dibaca [di tutorial ini](http://blog.grambo.me.uk/blog/2012/02/20/adding-facebook-comments-to-octopress/). Ada sedikit bug disana, yaitu pada file <code>post.html</code> dan <code>page.html</code>. Harusnya seperti ini : 

{% raw %}
```ruby
{% if site.facebook_appid and page.comments == true %}
  <section>
    <h1>Comments</h1>
    <div id="facebook_comments" aria-live="polite">
      {% include post/facebook_comments.html %}
    </div>
  </section>
{% endif %}
```
{% endraw %}

Daftar komentar orang bisa kita lihat dan moderasi di [https://developers.facebook.com/tools/comments](https://developers.facebook.com/tools/comments).

# Penutup #
Sebetulnya sedih juga berpisah dengan Wordpress yang telah setia menemani hampir 7 tahun lamanya, tapi life must go on. Wordpress, terima kasih atas kebersamaan selama 7 tahun ini. Mudah-mudahan engkau akan berevolusi lebih baik lagi sehingga di lain waktu kita bisa bersama lagi. 
