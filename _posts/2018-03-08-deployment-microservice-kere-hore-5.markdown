---
layout: post
title: "Deployment Microservice Kere Hore Bagian 5"
date: 2018-03-08 07:00
comments: true
categories:
- devops
---

Pada [artikel yang lalu]({{site.url}}/devops/deployment-microservice-kere-hore-1/), kita sudah membahas tentang penggunaan Nginx sebagai Front Proxy, [memasang aplikasi Java]({{site.url}}/devops/deployment-microservice-kere-hore-2/), dan [aplikasi Node JS]({{site.url}}/devops/deployment-microservice-kere-hore-4/). Kali ini, kita akan instal aplikasi dengan bahasa pemrograman Ruby dan framework Ruby on Rails.

<!--more-->
## Instalasi Ruby ##

Ada banyak tutorial instalasi Ruby di internet. Sebagian besar mengajarkan:

* instalasi dari source
* menggunakan version manager, `rvm` atau `rbenv`

Ini disebabkan karena release management dan versioning Ruby yang kacau. Silahkan baca [artikel ini](http://www.lucas-nussbaum.net/blog/?p=617) untuk memahami seperti apa yang dimaksud kacau.

Saya tidak terlalu suka melakukan instalasi dari source di mesin production. Untuk instalasi dari source code, kita harus menginstal compiler dan aksesorisnya. Ini menambah resiko security. Seharusnya yang diinstal di server production hanyalah sebatas keperluan menjalankan aplikasi saja.

Oleh karena itu, coba kita cek dulu versi Ruby yang dipaketkan Ubuntu.

```
# apt-cache show ruby
Package: ruby
Priority: optional
Section: interpreters
Installed-Size: 36
Maintainer: Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>
Original-Maintainer: Antonio Terceiro <terceiro@debian.org>
Architecture: all
Source: ruby-defaults
Version: 1:2.3.0+1
Replaces: irb, rdoc, rubygems
Provides: irb, rdoc, rubygems
Depends: ruby2.3
Suggests: ri, ruby-dev
Conflicts: ruby-activesupport-2.3, ruby-activesupport-3.2
Breaks: apt-listbugs (<< 0.1.6), rbenv (<= 0.4.0-1), ruby-debian (<< 0.3.8+b3), ruby-switch (<= 0.1.0)
Filename: pool/main/r/ruby-defaults/ruby_2.3.0+1_all.deb
Size: 5530
MD5sum: da532a3b540c86b75e53271dcc5e9084
SHA1: 08927ac768f3d922884df2b0b6aa49b9372b03f5
SHA256: 5bf2907339443b092800e1b471612f8024c015434bdd14aa1dcae2a39b9bd7a9
Description-en: Interpreter of object-oriented scripting language Ruby (default version)
 Ruby is the interpreted scripting language for quick and easy
 object-oriented programming.  It has many features to process text
 files and to do system management tasks (as in perl).  It is simple,
 straight-forward, and extensible.
 .
 This package is a dependency package, which depends on Debian's default Ruby
 version (currently v2.3).
Description-md5: 9d5a30084f79740130777ebb18a9beb9
Homepage: http://www.ruby-lang.org/
Bugs: https://bugs.launchpad.net/ubuntu/+filebug
Origin: Ubuntu
Supported: 5y
Task: kubuntu-desktop, kubuntu-full, edubuntu-desktop-gnome, ubuntustudio-fonts
```

Versi `2.3` sudah memenuhi persyaratan Rails yang minta versi Ruby minimal `2.2.2`. Mari kita instal saja bawaan Ubuntu. Tidak perlu pakai version manager. Selain itu, install juga SQLite supaya kita bisa generate project Rails baru.

```
apt install ruby sqlite3 libsqlite3-dev
```

## Instalasi Rails ##

Kita upgrade dulu `rubygems` supaya menjadi versi terbaru

```
gem update --system
```

Kemudian, kita install `Rails` dan teman-temannya

```
gem install rails bundler bindex sqlite3
```

Biasanya kita akan mendapati error seperti ini

```
ERROR:  Error installing rails:
	ERROR: Failed to build gem native extension.

    current directory: /var/lib/gems/2.3.0/gems/nokogiri-1.8.2/ext/nokogiri
/usr/bin/ruby2.3 -r ./siteconf20180308-14769-vfwrqo.rb extconf.rb
mkmf.rb can't find header files for ruby at /usr/lib/ruby/include/ruby.h

extconf failed, exit code 1

Gem files will remain installed in /var/lib/gems/2.3.0/gems/nokogiri-1.8.2 for inspection.
Results logged to /var/lib/gems/2.3.0/extensions/x86_64-linux/2.3.0/nokogiri-1.8.2/gem_make.out
```

Ini disebabkan karena ada dependensi yang kurang. Ternyata kita tidak bisa menginstall Rails tanpa menginstal compiler C `:(`

Mari kita install dulu tambahannya,

```
apt install gcc make libxslt1-dev libxml2-dev zlib1g-dev
```

## Membuat Aplikasi Rails ##

Selanjutnya kita bisa membuat aplikasi Rails. Kita buat saja di folder `/var/lib/app3`

```
cd /var/lib
rails new app3
```

Setelah itu, kita bisa coba jalankan aplikasinya

```
cd /var/lib/app3
bin/rails server
```

Outputnya seperti ini

```
=> Booting Puma
=> Rails 5.1.5 application starting in development 
=> Run `rails server -h` for more startup options
Puma starting in single mode...
* Version 3.11.3 (ruby 2.3.1-p112), codename: Love Song
* Min threads: 5, max threads: 5
* Environment: development
* Listening on tcp://0.0.0.0:3000
Use Ctrl-C to stop
```

Kita bisa coba browse ke `http://app3.artivisi.id:3000` dan menemui tampilan seperti ini

[![Hello Rails]({{site.url}}/images/uploads/2018/msa-deployment/22-halo-rails.png)]({{site.url}}/images/uploads/2018/msa-deployment/22-halo-rails.png)

Tampilan di atas hanya bisa tampil kalau aplikasinya berjalan di mode `development`. Kita perlu membuat controller betulan supaya bisa diakses di mode `production`.

Buat class dan method controller untuk menangani request dengan perintah scaffold.

```
rails generate controller welcome index
```

Rails akan membuat file baru di `app/controllers/welcome_controller.rb` dan `app/views/welcome/index.html.erb`. Untuk menyederhanakan tutorial ini, isi file tersebut tidak perlu kita edit. Biarkan saja apa adanya.

Berikutnya, kita edit konfigurasi routing supaya akses ke root atau url `/` ditangani oleh method `index` dalam `WelcomeController`. Edit sehingga isinya menjadi seperti ini

```rb
Rails.application.routes.draw do
  root "welcome#index"
end
```

Selanjutnya, kita akan menjalankan aplikasi tersebut di environment production. Untuk itu kita perlu membuat secret key dulu. Berikut perintahnya

```
cd /var/lib/app3
RAILS_ENV=production rake secret
```

Dia akan mengeluarkan random value seperti ini

```
60dd81d05ccd922b51ea6bbfd34311f82ab24440c69047cade5c46073af96b0dd1e8e74adab6f793a7a8a64963f2ba7b456b9fd8670bbc9f267ec87fd77903a5
```

Nilai ini akan kita gunakan di konfigurasi service nantinya.

Berikutnya, kita juga perlu melakukan compile terhadap file-file asset (JavaScript dan CSS)

```
RAILS_ENV=production rake assets:precompile
```

Outputnya seperti ini

```
I, [2018-03-08T08:09:36.113902 #2030]  INFO -- : Writing /var/lib/app3/public/assets/application-4a1d9d80b89c980f5f64004484cb2e515409eb7565c72a78447d2c6be5636082.js
I, [2018-03-08T08:09:36.114869 #2030]  INFO -- : Writing /var/lib/app3/public/assets/application-4a1d9d80b89c980f5f64004484cb2e515409eb7565c72a78447d2c6be5636082.js.gz
I, [2018-03-08T08:09:36.133673 #2030]  INFO -- : Writing /var/lib/app3/public/assets/application-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.css
I, [2018-03-08T08:09:36.133995 #2030]  INFO -- : Writing /var/lib/app3/public/assets/application-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.css.gz
```

## Konfigurasi Puma di Systemd ##

Aplikasi Rails kita dijalankan oleh webserver `Puma`. Sebetulnya ada beberapa webserver yang bisa juga digunakan sebagai alternatif, misalnya:

* [Passenger](https://www.phusionpassenger.com/)
* [Unicorn](https://bogomips.org/unicorn/)
* [Mongrel](https://github.com/mongrel/mongrel)

Tapi nampaknya di tahun 2018 ini, yang sedang naik daun adalah Puma. Perbandingannya bisa dibaca di [artikel ini](http://blog.scoutapp.com/articles/2017/02/10/which-ruby-app-server-is-right-for-you).

Untuk menjalankan Puma sebagai system service, kita buat konfigurasinya di file `/etc/systemd/system/app3.service` yang isinya sebagai berikut

```
[Unit]
Description=Aplikasi App3
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/lib/app3
Environment=RAILS_ENV=production PORT=10003 SECRET_KEY_BASE=60dd81d05ccd922b51ea6bbfd34311f82ab24440c69047cade5c46073af96b0dd1e8e74adab6f793a7a8a64963f2ba7b456b9fd8670bbc9f267ec87fd77903a5
ExecStart=/usr/local/bin/bundle exec --keep-file-descriptors puma
Restart=always

[Install]
WantedBy=multi-user.target
```

Pada konfigurasi di atas, kita memasang environment variable `SECRET_KEY_BASE` sesuai yang kita generate pada langkah sebelumnya. Bila ini tidak ada, maka kita akan mendapatkan pesan error seperti ini

```
RuntimeError: Missing `secret_key_base` for 'production' environment, set this value in `config/secrets.yml`
```

Jalankan perintah berikut bila kita mengedit file `/etc/systemd/system/app3.service`

```
systemctl daemon-reload
```

Dan perintah berikut untuk mengaktifkan service supaya start otomatis pada saat booting.

```
systemctl enable app3
```

Outputnya seperti ini

```
Created symlink from /etc/systemd/system/multi-user.target.wants/app3.service to /etc/systemd/system/app3.service.
```

Sekarang, kita sudah bisa menjalankan servicenya dengan perintah berikut

```
service app3 start
```

Browse ke `http://app3.artivisi.id:10003` dan kita akan dapatkan tampilan seperti ini

[![Tampilan production tanpa https]({{site.url}}/images/uploads/2018/msa-deployment/23-rails-no-https.png)]({{site.url}}/images/uploads/2018/msa-deployment/23-rails-no-https.png)

Selanjutnya, kita akan aktifkan konfigurasi reverse proxy di Nginx supaya aplikasi ini bisa diakses dengan `https` di port standar, yaitu `443`. Bukan lagi port `10003`. Setelah reverse proxy diaktifkan, kita bisa mengaksesnya dengan alamat yang terlihat normal, yaitu `https://app3.artivisi.id`.

## Konfigurasi Reverse Proxy Nginx ##

Konfigurasinya tidak jauh berbeda dengan penjelasan di artikel sebelumnya. Cukup edit blok `location` dalam file konfigurasi `/etc/nginx/sites-available/app3.artivisi.id` sehingga menjadi seperti ini

```
server {
    server_name app3.artivisi.id;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/app3.artivisi.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app3.artivisi.id/privkey.pem;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/app3.artivisi.id/html;
    index index.php index.html;

    location / {
      proxy_pass http://localhost:10003;
    }
}
server {
    if ($host = app3.artivisi.id) {
        return 301 https://$host$request_uri;
    }

  listen 80;
  listen [::]:80;

  server_name app3.artivisi.id;
  return 404;
}
```

Restart nginx dengan perintah `service nginx restart` dan browse ke `https://app3.artivisi.id`. Hasilnya seperti ini

[![Tampilan production https]({{site.url}}/images/uploads/2018/msa-deployment/24-rails-https.png)]({{site.url}}/images/uploads/2018/msa-deployment/24-rails-https.png)

## Penutup ## 

Demikianlah rangkaian artikel mengenai deployment aplikasi microservice yang dilakukan di satu server dengan satu IP public. Dengan cara ini, kita bisa menghemat biaya dengan cara menggunakan satu server untuk banyak aplikasi sekaligus. 

Walaupun demikian, jangan lupa untuk melakukan backup dan replikasi agar bila satu server ini mengalami masalah, kegiatan bisnis tetap bisa berjalan dengan lancar.