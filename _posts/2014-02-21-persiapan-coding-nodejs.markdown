---
layout: post
title: "Persiapan Coding NodeJS"
date: 2014-02-21 15:43
comments: true
categories: 
- javascript
---

Menyambung dari pengantar di [artikel sebelumnya](http://software.endy.muhardin.com/life/ongoing-learning/), kali ini kita akan mempersiapkan development environment untuk membuat aplikasi dengan NodeJS dan Redis. Kita juga akan mendeploy aplikasi kita di Heroku agar bisa diakses masyarakat umum.

<!--more-->


## Instalasi ##

### Node JS ###

NodeJS adalah yang pertama kita install karena dia memiliki Node Package Manager (NPM) yang nantinya akan digunakan oleh framework/library lainnya.

Cara instalasi termudah di Ubuntu adalah dengan menambahkan [PPA (Personal Package Archive) NodeJS milik Chris Lea](https://launchpad.net/~chris-lea/+archive/node.js). Jalankan perintah berikut di command line

```
sudo add-apt-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```

### Heroku ###

[Heroku](http://www.heroku.com/) adalah penyedia layanan cloud untuk menjalankan aplikasi. Generasi jadul seperti saya menyebutnya perusahaan hosting ;) Heroku menyediakan hosting gratis untuk aplikasi kecil yang bisa kita gunakan untuk bermain-main dengan teknologinya. Silahkan [daftar dulu](https://id.heroku.com/signup/devcenter), kemudian [unduh aplikasi clientnya](https://toolbelt.heroku.com/). 

Setelah terinstal, kita harus melakukan login menggunakan aplikasi client agar bisa membuat dan mendeploy aplikasi. Kita juga akan diminta untuk mengatur SSH key yang akan digunakan untuk otentikasi dengan Heroku. Bila Anda belum paham apa itu SSH key dan bagaimana cara membuatnya, silahkan baca dulu [artikel ini](http://software.endy.muhardin.com/linux/login-ssh-dengan-private-key/).

### Redis ###

Sama seperti instalasi NodeJS, untuk menginstal Redis kita perlu menambahkan PPA dulu. Berikut perintahnya.

```
sudo add-apt-repository ppa:rwky/redis
sudo apt-get update
sudo apt-get install redis-server
```

### Library Lain ###

Nantinya kita akan menggunakan library lain seperti misalnya:

* ExpressJS
* Yeoman
* dsb

Tapi untuk sementara ini kita belum membutuhkannya. Jadi petunjuk instalasinya akan kita bahas nanti pada waktu diperlukan.

## Hello World ##

Mengikuti tradisi yang telah diwariskan turun temurun oleh leluhur kita, langkah pertama dalam mempelajari suatu bahasa pemrograman adalah menampilkan tulisan `Hello World`.

### Clone Repository ###

Kita clone dulu repository yang telah kita buat di artikel sebelumnya.

```
git clone git@github.com:endymuhardin/aplikasi-membership.git
```

### Inisialisasi Aplikasi NodeJS ###

Setelah itu, masuk ke foldernya dan lakukan inisialisasi project NodeJS dengan perintah `npm init`. Perintah ini akan menghasilkan file `package.json` yang merupakan deskripsi mengenai aplikasi yang akan kita buat. Bagi yang mempunyai latar belakang Maven, `package.json` ini kira-kira mirip dengan `pom.xml`.

```
cd aplikasi-membership
npm init
```

Berikut output dari perintah `npm init`. Kita akan ditanya-tanyai mengenai informasi aplikasi yang kita buat.

```
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sane defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (aplikasi-membership) 
version: (0.0.0) 
description: Aplikasi Membership
entry point: (index.js) 
test command: 
git repository: (git://github.com/endymuhardin/aplikasi-membership.git) 
keywords: 
author: Endy Muhardin
license: (ISC) GPL-3.0
About to write to /home/endy/workspace/git-clones/aplikasi-membership/package.json:

{
  "name": "aplikasi-membership",
  "version": "0.0.0",
  "description": "Aplikasi Membership",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git://github.com/endymuhardin/aplikasi-membership.git"
  },
  "author": "Endy Muhardin",
  "license": "GPL-3.0",
  "bugs": {
    "url": "https://github.com/endymuhardin/aplikasi-membership/issues"
  },
  "homepage": "https://github.com/endymuhardin/aplikasi-membership"
}


Is this ok? (yes) yes
```

Selanjutnya, kita akan memiliki file [`package.json`](https://github.com/endymuhardin/aplikasi-membership/blob/master/package.json) dalam folder aplikasi kita. 

### Menjalankan Aplikasi ###

Dalam file `package.json` dinyatakan bahwa aplikasi kita bisa dijalankan dengan mengeksekusi file `index.js`. Mari kita buat file tersebut

```js
var http = require("http");

var port = Number(process.env.PORT || 5000);

http.createServer(function(request, response){
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}).listen(port);

console.log("App ready at port "+port);
```

File `index.js` bisa kita jalankan dari command line

```
node index.js
```

Kita bisa lihat aplikasinya di browser dengan mengakses `http://localhost:5000`.

![Foto](https://lh3.googleusercontent.com/-zh_cAl6EUkk/UwXFnVvVpiI/AAAAAAAAFMY/NH8Z8kdekhY/w704-h465-no/01-hello-nodejs.png)

## Deployment ke Heroku ##

Untuk bisa dideploy ke Heroku, kita harus membuat file konfigurasi yang bernama `Procfile`. Berikut isinya

```
web: node index.js
```

Artinya:

* Aplikasi kita adalah aplikasi web
* jenis aplikasi webnya adalah NodeJS. Jenis aplikasi ini bisa bermacam-macam, misalnya Java, Python, dsb
* File yang harus dijalankan NodeJS adalah `index.js`

Kita bisa tes konfigurasi tersebut dengan menggunakan aplikasi client Heroku yang bernama `foreman`. Jalankan perintah berikut di command line.

```
foreman start
```

Berikut outputnya

```
14:41:18 web.1  | started with pid 17022
14:41:18 web.1  | App ready at port 5000
```
Sama seperti perintah `node index.js`, hasilnya bisa kita lihat menggunakan browser dengan mengakses `http://localhost:5000`.
Untuk mematikannya, tekan `Ctrl-C`

```
^CSIGINT received
14:41:46 system | sending SIGTERM to all processes
14:41:46 web.1  | terminated by SIGTERM
```

Selanjutnya, kita inisialisasi aplikasi kita di Heroku.

```
heroku apps:create ysq
```

Perintah ini akan membuat aplikasi bernama `ysq` di server Heroku. Dia juga akan menambahkan remote-url git agar kita bisa melakukan deployment. Berikut output dari perintah di atas

```
Creating ysq... done, stack is cedar
http://ysq.herokuapp.com/ | git@heroku.com:ysq.git
Git remote heroku added
```

Untuk mendeploy ke Heroku, cukup dengan melakukan `git push`.

```
git push heroku master
```

Berikut outputnya

```
Initializing repository, done.
Counting objects: 16, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (15/15), done.
Writing objects: 100% (16/16), 2.10 KiB | 0 bytes/s, done.
Total 16 (delta 3), reused 4 (delta 0)

-----> Node.js app detected

       PRO TIP: Specify a node version in package.json
       See https://devcenter.heroku.com/articles/nodejs-support

-----> Defaulting to latest stable node: 0.10.26
-----> Downloading and installing node
-----> Installing dependencies
-----> Cleaning up node-gyp and npm artifacts
-----> Building runtime environment
-----> Discovering process types
       Procfile declares types -> web

-----> Compressing... done, 5.1MB
-----> Launching... done, v3
       http://ysq.herokuapp.com deployed to Heroku

To git@heroku.com:ysq.git
 * [new branch]      master -> master
```

Kita bisa browse aplikasi tersebut di alamat `http://ysq.herokuapp.com` seperti ini

![Foto](https://lh5.googleusercontent.com/-dTD4Lcoj2jY/UwXFnlTeAVI/AAAAAAAAFMc/qUlNM_zCBvc/w704-h465-no/02-heroku-deployment.png)

## Vertical Slice ##

Vertical Slice adalah potongan aplikasi yang sudah tersambung end-to-end. Maksudnya adalah sebagian kecil aplikasi mulai dari tampilan yang dilihat user hingga ke penyimpanan data di database sudah tersambung dengan baik. Saya biasanya membuat vertical slice untuk menguji apakah kombinasi framework/library yang digunakan sudah terintegrasi dengan benar. Untuk itu, kita akan membuat kode program sederhana untuk menyimpan dan mengambil data dari NodeJS ke Redis. Kita juga akan tes apakah integrasi tersebut juga berjalan lancar di Heroku.

### Verifikasi Instalasi Redis ###

Setelah sukses dengan `Hello World` tampilan, kita juga harus membuat `Hello World` untuk akses ke database Redis. Sebelum mulai, kita tes dulu instalasi Redis kita apakah dia sudah berjalan lancar dengan menggunakan perintah `redis-cli ping`. Kalau instalasinya benar, dia akan menjawab

```
PONG
```

Selanjutnya, kita masuk ke command line redis, menyimpan variabel bernama email, kemudian menampilkan isi variabel tersebut.

```
$ redis-cli
127.0.0.1:6379> set email endy.muhardin@gmail.com
OK
127.0.0.1:6379> get email
"endy.muhardin@gmail.com"
```

### Simpan data di Redis dari NodeJS ###

Kita akan memodifikasi `index.js` agar menyimpan dan mengambil data dari Redis. Berikut source codenya

```js
var redis = require("redis").createClient();

var displayContent = function(){
    redis.get("nama", function(err, reply){
        console.log("Nama : "+reply);
        redis.expire("nama", 1);    
    });

    redis.get("email", function(err, reply){
        console.log("Email : "+reply);
        redis.expire("email", 1);    
    });
};

redis.on("connect", function(){
    redis.set("nama", "Endy Muhardin");
    redis.set("email", "endy.muhardin@gmail.com");
    displayContent();
});
```

Kalau langsung kita jalankan, maka kita akan mendapat error berikut

```
Error: Cannot find module 'redis'
    at Function.Module._resolveFilename (module.js:338:15)
    at Function.Module._load (module.js:280:25)
    at Module.require (module.js:364:17)
    at require (module.js:380:17)
    at Object.<anonymous> (/home/endy/workspace/git-clones/aplikasi-membership/index.js:13:13)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
exited with code 8
16:33:26 system | sending SIGTERM to all processes
```

Untuk mengatasi error tersebut, kita membutuhkan library [node_redis](https://github.com/mranney/node_redis) untuk menghubungkan NodeJS dengan Redis. Install dulu menggunakan NPM dengan cara menjalankan perintah berikut dalam folder aplikasi.

```
npm install redis --save
```

Kita gunakan opsi `--save` agar instalasi tersebut terdaftar di `package.json`.

Di website asalnya ada petunjuk mengenai penggunaan `hiredis`, yaitu binding terhadap library C untuk meningkatkan performance. Karena belum paham apa manfaat dan konsekuensinya, dan juga supaya tutorialnya lebih sederhana, kita tidak akan gunakan `hiredis`.

Berikut output dari perintah di atas

```
npm http GET https://registry.npmjs.org/redis
npm http 200 https://registry.npmjs.org/redis
npm http GET https://registry.npmjs.org/redis/-/redis-0.10.1.tgz
npm http 200 https://registry.npmjs.org/redis/-/redis-0.10.1.tgz
redis@0.10.1 node_modules/redis
```

Setelah itu, kita bisa tes menggunakan `foreman`

```
foreman start
16:48:37 web.1  | started with pid 19028
16:48:37 web.1  | App ready at port 5000
16:48:37 web.1  | Nama : Endy Muhardin
16:48:37 web.1  | Email : endy.muhardin@gmail.com
^CSIGINT received
16:48:39 system | sending SIGTERM to all processes
16:48:39 web.1  | terminated by SIGTERM
```

### Menggunakan Redis di Heroku ###

Agar bisa digunakan di Heroku, kita harus menginstal dependensi tambahan, yaitu `redis-url`.

```
npm install redis-url --save
```

Ada sedikit perubahan pada metode koneksi database Redis agar menggunakan database yang ada di Heroku.

Edit baris ini
```js
var redis = require("redis").createClient();
```
menjadi seperti ini
```js
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.client.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}
```

Di sisi heroku, kita harus terlebih dulu menginstal database Redis. Kita bisa gunakan add-ons `Redis To Go` yang gratisan.

```
heroku addons:add redistogo
```

Setelah itu kita bisa commit dan push

```
$ git push heroku master
Fetching repository, done.
Counting objects: 7, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 590 bytes | 0 bytes/s, done.
Total 4 (delta 3), reused 0 (delta 0)

-----> Node.js app detected

       PRO TIP: Specify a node version in package.json
       See https://devcenter.heroku.com/articles/nodejs-support

-----> Defaulting to latest stable node: 0.10.26
-----> Downloading and installing node
-----> Restoring node_modules directory from cache
-----> Pruning cached dependencies not specified in package.json
-----> Installing dependencies
       npm WARN package.json redis-url@0.2.0 No repository field.
       npm http GET https://registry.npmjs.org/redis
       npm http 200 https://registry.npmjs.org/redis
       npm http GET https://registry.npmjs.org/redis/-/redis-0.10.1.tgz
       npm http 200 https://registry.npmjs.org/redis/-/redis-0.10.1.tgz
       redis@0.10.1 node_modules/redis
-----> Caching node_modules directory for future builds
-----> Cleaning up node-gyp and npm artifacts
-----> Building runtime environment
-----> Discovering process types
       Procfile declares types -> web

-----> Compressing... done, 5.3MB
-----> Launching... done, v5
       http://ysq.herokuapp.com deployed to Heroku

To git@heroku.com:ysq.git
   84e7abd..cecc87f  master -> master
```

Kita bisa cek apakah aplikasinya sukses dideploy dengan browse ke Heroku. Bila ada error, kita bisa lihat errornya dengan menggunakan perintah `heroku logs`

### Financial Problem ###

Setelah saya coba, ternyata untuk bisa menambahkan add-ons RedisToGo di Heroku kita harus memasukkan informasi kartu kredit. Padahal saya cuma mau pakai paket Free.

Untung ada jalan keluarnya. Kita bisa daftar langsung di [website RedisToGo](https://redistogo.com) dan memilih paket Free. Setelah itu kita akan mendapatkan satu database seperti bisa dilihat pada screenshot berikut:

![Foto](https://lh6.googleusercontent.com/-lq4p7uGi63Y/UwYMOsT-95I/AAAAAAAAFNA/TpqPA7qA1Qk/w826-h330-no/03-redistogo.png)

Kita sebaiknya memodifikasi kode program kita agar selalu menggunakan database RedisToGo tersebut walaupun pada saat menjalankan aplikasi di lokal. Ini untuk menyederhanakan kode program kita. Namanya juga aplikasi belajaran, jadi diusahakan sesederhana mungkin.

Kode program yang tadinya seperti ini

```js
if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.client.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}
```

Kita ubah menjadi seperti ini

```js
var REDISTOGO_URL = "redis://redistogo:8adc4536655ce179e2645ae4abd70eb2@pearlfish.redistogo.com:9930/";

var rtg   = require("url").parse(REDISTOGO_URL);
var redis = require("redis").createClient(rtg.port, rtg.hostname);
redis.auth(rtg.auth.split(":")[1]);
```

Isi variabel `REDISTOGO_URL` diambil dari informasi di website RedisToGo seperti pada screenshot di atas.

Aplikasi bisa kita deploy ke Heroku dan harusnya bisa berjalan dengan sukses. Dengan suksesnya deployment tersebut, persiapan kita sudah selesai. Selanjutnya kita bisa mulai desain dan coding aplikasi kita yang sebenarnya.
