---
comments: true
date: 2011-08-06 21:06:01
layout: post
slug: redmine-jruby-tomca
title: Instalasi Redmine di Tomcat
categories:
- aplikasi
---

Ada berbagai cara instalasi Redmine, diantaranya:



    
  * Dijalankan langsung dari command prompt dengan Webrick

    
  * Dijalankan menggunakan Mongrel dan FastCGI

    
  * Dijalankan menggunakan Ruby Enterprise Edition dan Passenger

    
  * Dibuat menjadi war dan dideploy ke application server Java seperti Tomcat, Glassfish, dsb



Pada artikel ini, kita akan mencoba cara terakhir, yaitu menggunakan Tomcat untuk menghosting Redmine.
Ini saya lakukan supaya semua tools manajemen proyek ArtiVisi bisa disatukan di satu Tomcat, sehingga memudahkan kegiatan maintenance.
Sebelum Redmine, Tomcat ArtiVisi juga menghosting :

    
  * [Nexus](http://nexus.sonatype.org/)

    
  * [Jenkins](http://jenkins-ci.org/)



Dan nantinya, kalau sudah ada waktu dan kesempatan, juga akan menghosting [Gerrit](http://code.google.com/p/gerrit/)

Mari kita mulai.




## Instalasi JRuby



Pertama, kita [Download JRuby](http://jruby.org/). Setelah itu, extract di folder yang diinginkan (contohnya /opt)

```
cd /opt
tar xzf ~/Downloads/jruby-bin-1.6.3.tar.gz
chown -R endy.endy /opt/jruby-1.6.3
ln -s jruby-1.6.3 jruby
```


Daftarkan jruby ke variabel PATH, supaya bisa diakses langsung dari command line.
Tulis baris berikut ini di dalam file ~/.bashrc

```
export JRUBY_HOME=/opt/jruby
export PATH=$PATH:$JRUBY_HOME/bin
```

Terakhir, test instalasi JRuby

```
jruby -v
jruby 1.6.3 (ruby-1.8.7-p330) (2011-07-07 965162f) (Java HotSpot(TM) Client VM 1.6.0_26) [linux-i386-java]
```


## Instalasi Paket Gem


Redmine membutuhkan beberapa library Ruby yang dipaket dalam format gem, yaitu :



    
  * rack versi 1.1.1 : ini adalah library untuk web server

    
  * rails versi 2.3.11 (dibutuhkan karena kita akan menginstal Redmine dari Subversion, bukan dari distribusi)

    
  * jruby-openssl : supaya bisa melayani https

    
  * activerecord-jdbcmysql-adapter : library untuk koneksi database

    
  * warbler : packager supaya Redmine bisa dibuat jadi war dan dideploy ke Tomcat



Mari kita install

```
gem install rack -v=1.1.1
gem install rails -v=2.3.11
gem install jruby-openssl activerecord-jdbcmysql-adapter warbler
```

Semua paket sudah lengkap, mari kita lanjutkan ke langkah berikut.



## Mengambil Redmine dari Subversion Repository


Sebetulnya ada dua pilihan untuk mendapatkan Redmine, download versi rilis atau checkout langsung dari Subversion.
Saya lebih suka checkout langsung supaya nanti lebih gampang upgrade manakala rilis baru sudah terbit.

```sh
cd ~/Downloads
svn co http://redmine.rubyforge.org/svn/branches/1.2-stable redmine-1.2
```

Tunggu sejenak sampai proses checkout selesai. Setelah selesai, kita bisa langsung ke langkah selanjutnya.




## Konfigurasi Database



Masuk ke folder Redmine, lalu copy file config/database.yml.example ke database.yml, kemudian edit.
Saya menggunakan konfigurasi development sebagai berikut :

```yaml
development:
  adapter: jdbcmysql
  database: redmine
  host: localhost
  username: redmine
  password: redmine
  encoding: utf8
```

Tentunya kita harus sediakan database dengan konfigurasi tersebut di MySQL. Login ke MySQL, kemudian buatlah database dan usernya.


```sh
mysql -u root -p

create database redmine character set utf8;
create user 'redmine'@'localhost' identified by 'redmine';
grant all privileges on redmine.* to 'redmine'@'localhost';
```
Setelah databasenya selesai dibuat, selanjutnya kita akan melakukan inisialisasi.



## Inisialisasi Redmine



Pertama, kita inisialisasi dulu session store. Ini digunakan untuk menyimpan cookie dan session variabel.


```sh
cd ~/Downloads/redmine-1.2
rake generate_session_store
```

Setelah itu, inisialisasi skema database.

```sh
RAILS_ENV=development rake db:migrate
```

Isi data awal.

```sh
RAILS_ENV=development rake redmine:load_default_data
```

Setelah terisi, selanjutnya kita bisa test jalankan Redmine.

```
jruby script/server webrick -e development
```

Hasilnya bisa kita browse di http://localhost:3000
Kemudian kita bisa login dengan username admin dan password admin.



## Konfigurasi Email


Issue tracker yang baik harus bisa mengirim email, supaya dia bisa memberikan notifikasi pada saat ada issue baru ataupun perubahan terhadap issue yang ada.
Redmine versi 1.2 membutuhkan file konfigurasi yang bernama configuration.yml, berada di folder config. Berikut isi file configuration.yml untuk mengirim email ke Gmail.

```yaml
# = Outgoing email settings
development:
    email_delivery:
        delivery_method: :smtp
        smtp_settings:
            tls: true
            address: "smtp.gmail.com"
            port: 587
            authentication: :plain
            user_name: "nama.kita@gmail.com"
            password: "passwordgmailkita"
```

Selain itu, kita juga harus menginstal plugin action_mailer_optional_tls, seperti dijelaskan [di sini](http://redmineblog.com/articles/setup-redmine-to-send-email-using-gmail/). 


```sh
jruby script/plugin install
git://github.com/collectiveidea/action_mailer_optional_tls.git
```

Coba restart Redmine, sesuaikan alamat email kita dengan cara klik link My Account di pojok kanan atas.
Di dalamnya ada informasi tentang email. Ganti dengan alamat email kita.
Kemudian pergi ke menu Administration > Settings > Email Notifications,
kemudian klik link Send a test email di pojok kanan bawah.
Tidak lama kemudian, seharusnya test email dari Redmine sudah masuk di mailbox kita.

Dengan demikian, Redmine sudah berhasil kita instal dan konfigurasi dengan baik.
Selanjutnya, kita akan paketkan supaya bisa dideploy di Tomcat.



## Generate WAR



Pertama, kita harus inisialisasi dulu konfigurasi warble.

```sh
warble config
```

Dia akan menghasilkan file config/warble.rb. Mari kita edit sehingga menjadi seperti ini.


```ruby
Warbler::Config.new do |config|
  config.dirs = %w(app config lib log vendor tmp extra files lang)
  config.gems += ["activerecord-jdbcmysql-adapter", "jruby-openssl", "i18n", "rack"]
  config.webxml.rails.env = ENV['RAILS_ENV'] || 'development'
end
```

Selanjutnya, kita tinggal menjalankan perintah warble untuk menghasilkan file war.

```sh
warble
warning: application directory `lang' does not exist or is not a directory; skipping
rm -f redmine-1.2.war
Creating redmine-1.2.war
```

File war yang dihasilkan tinggal kita deploy ke Tomcat

```
cp redmine-1.2.war /opt/apache-tomcat-7.0.12/webapps/redmine.war
```

Jalankan Tomcat, dan Redmine bisa diakses di http://localhost:8080/redmine

