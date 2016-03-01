---
layout: post
title: "JavaScript Development Stack"
date: 2014-02-27 21:11
comments: true
categories: 
- javascript
---

Pada [artikel sebelumnya](http://software.endy.muhardin.com/javascript/persiapan-coding-nodejs/), kita telah sukses menyiapkan kombinasi framework di sisi server. Nah sekarang kita akan siapkan persenjataan untuk aplikasi clientnya.

Artikel bagian kedua ini berselang waktu agak lama dari artikel sebelumnya karena saya bingung :D
Nah saya yakin kebingungan ini juga akan dialami oleh rekan-rekan yang baru belajar server-side-javascript. Ada beberapa hal yang membuat saya bingung, yaitu:

* arsitektur aplikasi dan bahasa pemrograman
* development tools
* integrasi aplikasi pada saat development
* integrasi aplikasi pada saat production

Sebagai gambaran, bentuk akhir dari aplikasi yang akan dibuat seperti ini

[![Foto](https://lh4.googleusercontent.com/-a6DbvzDCjUA/Uw7xgeieBQI/AAAAAAAAFR0/fIac8wOIBGg/w844-h597-no/mean-stack.png)](https://lh4.googleusercontent.com/-a6DbvzDCjUA/Uw7xgeieBQI/AAAAAAAAFR0/fIac8wOIBGg/w844-h597-no/mean-stack.png)

<!--more-->

## Arsitektur Aplikasi ##

Biasanya kalau kita membuat aplikasi web modern dengan menggunakan AJAX, begini arsitekturnya:

[![Foto](https://lh3.googleusercontent.com/-5tGzUVc2lk4/UwFrrT20hmI/AAAAAAAAFJk/zRxIxumf_O4/w800-h566-no/restful-architecture.png)](https://lh3.googleusercontent.com/-5tGzUVc2lk4/UwFrrT20hmI/AAAAAAAAFJk/zRxIxumf_O4/w800-h566-no/restful-architecture.png)

Aplikasi akan terbagi menjadi dua bagian (client side dan server side) yang jelas batasannya, yaitu:

* server side dibuat menggunakan PHP/Java/Ruby/Python/dsb
* client side dibuat menggunakan framework JavaScript (AngularJS, EmberJS, jQuery, Dojo, ExtJS, dsb)

Kalau kita membuat aplikasi menggunakan NodeJS, maka semuanya dibuat menggunakan bahasa pemrograman JavaScript. Ini bisa membuat kita bingung, mana client side mana server side, karena semuanya JS. Supaya tidak bingung, kita anggap saja NodeJS ini adalah PHP. Dia hanya bisa jalan di server saja, tidak bisa jalan di browser. Dengan cara berpikir seperti ini, skema berikut ini

[![Foto](https://lh3.googleusercontent.com/-rdH4DqYrios/Uw7xQi5JTUI/AAAAAAAAFRk/U1AOrcjH4yM/w522-h216-no/lamp-stack.png)](https://lh3.googleusercontent.com/-rdH4DqYrios/Uw7xQi5JTUI/AAAAAAAAFRk/U1AOrcjH4yM/w522-h216-no/lamp-stack.png)

sama saja dengan ini

[![Foto](https://lh3.googleusercontent.com/-AQfudbu3qXo/Uw7xRPvnQYI/AAAAAAAAFRs/G1pkS6S3uvM/w522-h216-no/mean-stack.png)](https://lh3.googleusercontent.com/-AQfudbu3qXo/Uw7xRPvnQYI/AAAAAAAAFRs/G1pkS6S3uvM/w522-h216-no/mean-stack.png)


Kita juga harus membedakan framework JavaScript client-side seperti:

* [AngularJS](http://angularjs.org/)
* [EmberJS](http://emberjs.com)
* [ExtJS](http://www.sencha.com/products/extjs)
* [Dojo](http://dojotoolkit.org)
* dsb

dan framework JavaScript server-side seperti:

* [ExpressJS](http://expressjs.com)
* [SailsJS](http://sailsjs.org)
* [TowerJS](http://towerjs.org)
* [Locomotive](http://locomotivejs.org)
* dsb

Setelah jelas mengenai arsitektur, kebingungan selanjutnya adalah masalah tools

## Development Tools ##

Urusan tools ini cukup membuat saya pusing beberapa hari, padahal saya sudah ada pengalaman sebelumnya dengan Maven, Jenkins, Subversion, Git, JUnit, dan kawan-kawannya. Di dunia JavaScript ada banyak tools yang digunakan, yaitu:

* [npm](https://www.npmjs.org/)
* [yeoman](http://yeoman.io/)
* [bower](http://bower.io/)
* [grunt](http://gruntjs.com/)

Mari kita bahas satu persatu.

### NPM ###

NPM adalah singkatan dari NodeJS Package Manager. Agar lebih mudah dipahami, kita lihat padanannya di platform lain:

* Ruby : gem
* Java : Maven Repository
* Ubuntu : apt-get
* Python : pip
* Android : Play Store

Kita menginstal library JavaScript dengan perintah `npm install`. Instalasi ini ada yang bersifat global di seluruh komputer, ataupun local di masing-masing project. Untuk menginstal secara global, kita membutuhkan hak akses penuh, sehingga harus menggunakan `sudo` di Ubuntu.

Contohnya, untuk menginstal framework SailsJS, kita jalankan `sudo npm install -g sails`. Untuk menginstal Yeoman, perintahnya adalah `sudo npm install -g yo`.

> Warning: siapkan koneksi internet yang mumpuni pada saat menjalankan `npm install`. 
> Dia akan mengunduh paket yang kita minta dari internet berikut semua paket lain yang dibutuhkan.

### Yeoman ###

Yeoman adalah generator aplikasi. Dia menyediakan template project dengan berbagai kombinasi library. Di Java, padanannya adalah Maven Archetype, Appfuse, atau Spring Roo. Ruby on Rails dan Groovy juga memiliki fitur generator ini.

Contohnya, bila kita ingin membuat aplikasi web dengan AngularJS dan Twitter Bootstrap, kita jalankan perintah berikut:

```
mkdir aplikasi-saya
cd aplikasi-saya
yo angular
```

Yeoman akan membuatkan struktur folder dan beberapa contoh file sesuai dengan _best practices_ masing-masing teknologi yang dipilih.

Yeoman bekerja sama dengan dua tools lain, yaitu Bower dan Grunt.

### Bower ###

Bower mirip dengan NPM, yaitu bertugas menginstal sesuatu.

> Waduh, kenapa ada dua tools yang fungsinya sama?

Jangan khawatir, banyak orang menanyakan hal yang sama. Diskusinya bisa dibaca di thread SO [ini](http://stackoverflow.com/questions/15092345/javascript-dependency-management-npm-vs-bower-vs-volo) dan [ini](http://stackoverflow.com/questions/18641899/difference-between-bower-and-npm). Ada juga [penjelasan panjang lebar tentang penggunaan keduanya](http://tech.pro/tutorial/1190/package-managers-an-introductory-guide-for-the-uninitiated-front-end-developer). 

Untuk menyederhanakan masalah, berikut kesimpulan saya

> NPM digunakan untuk mengelola library javascript sedangkan Bower digunakan untuk mengelola kelengkapan aplikasi web (js, css, png).

### Grunt ###

Grunt adalah library scripting untuk melakukan build process. Di Java padanannya kira-kira adalah `ant`. Di Ruby padanannya `rake`.

Grunt memiliki fitur antara lain:

* compile/minify/compress kode program JavaScript, baik yang kita tulis sendiri maupun yang dibuat orang lain dan kita gunakan dalam aplikasi kita (seperti jQuery, underscore.js, dsb)
* menjalankan test otomatis
* menjalankan server process, proxy, dan sejenisnya

## Kombinasi Stack ##

Nah sekarang setelah peta situasi sudah jelas, tiba saatnya kita memilih framework.

Di sisi client, saya akan tetap menggunakan kombinasi andalan, yaitu AngularJS dan Bootstrap. Bagaimana dengan di sisi server?

Hasil blusukan di Google mengarahkan saya ke framework paling populer di dunia NodeJS, yaitu ExpressJS. Bagi yang suka minimalis, ExpressJS ini sudah cukup. Walaupun demikian, saya ketemu pengembangan dari ExpressJS yang sudah ditambahi segala macam fitur validasi, REST API, scaffolding, dan fitur-fitur lain untuk mempercepat development, yaitu SailsJS. Dia juga sudah dilengkapi dengan ORM untuk berinteraksi dengan database. 

Agar tidak berlama-lama, mari kita pilih saja SailsJS untuk keperluan belajar ini. Nanti kalau sudah jadi satu aplikasi, sudah tahu manis-pahitnya SailsJS, baru kita punya patokan untuk mengevaluasi framework kompetitornya.

### Integrasi Client - Server ###

Di sisi client ada Yeoman dan di sisi server ada Sails yang juga memiliki fitur generator. Kedua tools ini memiliki persamaan fitur dalam kaitannya dengan proses/workflow development, yaitu:

* generate template file
* kompresi aset (js, css)
* menjalankan tes otomatis
* embedded web server untuk keperluan testing di local
* dependency management untuk add/remove/upgrade library

> Mau pakai yang mana?

Untuk menjawab pertanyaan ini, kita harus sedikit [yak-shaving](http://sethgodin.typepad.com/seths_blog/2005/03/dont_shave_that.html) dulu melihat bagaimana nantinya aplikasi kita akan dideploy ke lingkungan production. Dari sini, kita akan membuat lingkungan development semirip mungkin. Tentunya walaupun diusahakan mirip, kita ingin proses coding seefisien mungkin supaya siklus feedbacknya cepat.

Ada beberapa tujuan yang ingin saya capai:

* aplikasi server (SailJS) dan aplikasi client (Yeoman) ingin disimpan dalam satu repository
* kedua aplikasi akan dideploy sebagai satu kesatuan pada waktu production. Kedua aplikasi harus berada di satu folder
* masing-masing aplikasi harus bisa dikerjakan dan dites secara independen
* kita menggunakan tools terbaik untuk masing-masing aplikasi. Artinya, untuk aplikasi client tetap menggunakan Yeoman dan untuk aplikasi server tetap menggunakan SailJS.

Blusukan lagi di google, ketemu dua artikel bagus. Yang satu membahas [deployment production dan tahapan skalabilitas](http://www.slideshare.net/BenLin2/webconf-nodejsproductionarchitecture) mulai dari aplikasinya dipakai sedikit orang hingga jutaan orang. 

Satu lagi membahas tentang [skema workflow selama development](http://www.emmanueloga.com/2013/07/23/Using-AngularJS-with-a-Rails-backend.html). Skema development ini sebetulnya tidak terlalu mirip dengan kombinasi stack yang kita pakai, karena dia menggunakan AngularJS dan Rails sedangkan kita AngularJS dan NodeJS. Walaupun demikian, struktur aplikasinya sama dan skema deploymentnya konsisten dengan yang dijelaskan di artikel pertama. 

Berikut adalah arsitektur deployment di lingkungan production yang kita tuju

[![Foto](https://lh5.googleusercontent.com/-45qcTjWcens/Uw8ehKdmLOI/AAAAAAAAFSo/ZQiJqKzeZrk/w734-h550-no/deployment-production.png)](https://lh5.googleusercontent.com/-45qcTjWcens/Uw8ehKdmLOI/AAAAAAAAFSo/ZQiJqKzeZrk/w734-h550-no/deployment-production.png)

Dan ini adalah skema deployment di laptop masing-masing programmer

[![Foto](https://lh4.googleusercontent.com/-LvEC29ahKfs/Uw8ehH3uMbI/AAAAAAAAFSs/QzxyjTUSWQ8/w386-h550-no/deployment-development.png)](https://lh4.googleusercontent.com/-LvEC29ahKfs/Uw8ehH3uMbI/AAAAAAAAFSs/QzxyjTUSWQ8/w386-h550-no/deployment-development.png)

> Cukup mirip kan?

Segala riset dan artikel di atas menghasilkan kesimpulan berikut: 

* struktur folder project
* strategi integrasi
* deployment baik di development maupun production. 

Berikut adalah kesimpulan saya untuk struktur folder project:

* aplikasi akan terdiri dari dua folder : xxx-server (berisi SailsJS) dan xxx-client (berisi AngularJS dkk dimanage dengan Yeoman)
* untuk keperluan test di laptop, aplikasi client akan dijalankan terpisah dengan server. Aplikasi client dijalankan dengan perintah `grunt serve` dan akan standby di port `9000`. Aplikasi server dijalankan menggunakan perintah `sails lift` dan standby di port `1337`. Dengan ini, aplikasi client dan server bisa dikerjakan dan dites secara terpisah
* pada saat dibutuhkan integration test (client dan server sudah terhubung), kita konfigurasi Grunt agar request ke url `/api/*` diteruskan ke SailsJS di port `1337`
* pada proses build aplikasi client, arahkan hasil build ke folder xxx-server/static


## Menyiapkan Aplikasi ##

Ada satu prinsip yang saya pegang dalam dunia pemrograman,

> Jangan mulai coding sebelum jelas apa yang mau dibuat.

Itulah sebabnya saya menghabiskan waktu puluhan jam mencari artikel di Google, membacanya satu persatu, menonton video tutorial dari Youtube, dan mencoba coding sedikit-sedikit agar mendapatkan gambaran. Semua usaha tersebut dilakukan untuk mencari tahu bagaimana best-practices dalam membuat aplikasi. Setelah jelas apa yang kita ingin capai dan strategi untuk tiba di tujuan, barulah kita mulai coding.

Apa yang kita bahas pada bagian ini adalah hal yang mudah. Bagian sulitnya ada di penjelasan arsitektur aplikasi di atas. Tidak percaya? Mari kita mulai.

### Aplikasi Server ###

Kita mulai dari aplikasi server dulu. Langkah-langkahnya sebagai berikut:

* instalasi framework SailsJS
* buat folder aplikasi-membership-server
* generate struktur aplikasi menggunakan fitur SailsJS

Kita mulai dengan instalasi SailsJS. Ini dilakukan sekali saja dalam satu komputer. Untuk aplikasi kedua dan seterusnya, kita tidak perlu lagi menginstal SailsJS

```
sudo npm install -g sails
```

NPM akan mengunduh segala macam paket yang dibutuhkan dari internet. Siapkan koneksi internet yang mumpuni. Setelah selesai, kita bisa membuat project baru.

```
sails new aplikasi-membership-server
cd aplikasi-membership-server
sails lift
```

Berikut outputnya

```
sails lift
info: 
info: 
info:    Sails.js           <|
info:    v0.9.9              |\
info:                       /|.\
info:                      / || \
info:                    ,'  |'  \
info:                 .-'.-==|/_--'
info:                 `--'-------' 
info:    __---___--___---___--___---___--___
info:  ____---___--___---___--___---___--___-__
info: 
info: Server lifted in `aplikasi-membership-server`
info: To see your app, visit http://localhost:1337
info: To shut down Sails, press <CTRL> + C at any time.

debug: --------------------------------------------------------
debug: :: Thu Feb 27 2014 19:06:32 GMT+0700 (WIB)
debug: 
debug: Environment	: development
debug: Port		: 1337
debug: --------------------------------------------------------
```

Kita bisa browse ke `http://localhost:1337`

[![Foto](https://lh6.googleusercontent.com/-lQ4xghosjJY/Uw9HAoW29FI/AAAAAAAAFTY/bitPnyw7nBk/w909-h573-no/01-test-sails-ok.png)](https://lh6.googleusercontent.com/-lQ4xghosjJY/Uw9HAoW29FI/AAAAAAAAFTY/bitPnyw7nBk/w909-h573-no/01-test-sails-ok.png)

Selesai sudah pembuatan aplikasi server. Mudah bukan? 

Kita bisa lihat isi folder `aplikasi-membership-server`, di sana sudah banyak file dan folder yang dibuatkan oleh SailsJS. Apa fungsi dan kegunaan masing-masingnya akan kita bahas di artikel terpisah.

Sekarang kita lanjutkan dengan aplikasi client.

### Aplikasi Client ###

Kita akan gunakan Yeoman untuk membuatkan aplikasi client. Karena kita ingin menggunakan AngularJS dan Bootstrap, kita instal dulu generator yang sesuai. Sama seperti SailsJS, instalasi ini cukup sekali saja dalam satu komputer.

```
sudo npm install -g generator-angular
```

Berikutnya, kita buat foldernya dan generate struktur project AngularJS dan Bootstrap

```
mkdir aplikasi-membership-ui
cd aplikasi-membership-ui
yo angular

     _-----_
    |       |
    |--(o)--|   .--------------------------.
   `---------´  |    Welcome to Yeoman,    |
    ( _´U`_ )   |   ladies and gentlemen!  |
    /___A___\   '__________________________'
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

Out of the box I include Bootstrap and some AngularJS recommended modules.

[?] Would you like to use Sass (with Compass)? No
[?] Would you like to include Twitter Bootstrap? Yes
[?] Which modules would you like to include? (Press <space> to select)
‣⬢ angular-resource.js
 ⬢ angular-cookies.js
 ⬢ angular-sanitize.js
 ⬢ angular-route.js
```

Yeoman akan menanyakan apakah kita ingin menggunakan Sass dan Bootstrap. Saya tidak ingin menggunakan Sass, karena dia mengharuskan kita untuk menginstal Ruby on Rails. Nah, Ruby on Rails ini _yak shaving_ lagi, jadi tidak usah saja.

Kita juga akan disodori pilihan modul angular mana yang ingin dipakai. Saya pilih saja semuanya. Tekan Enter, dan Yeoman akan mengunduh segala macam hal dari internet. Pastikan koneksi internet Anda memadai.

Setelah selesai, kita bisa coba menjalankan Grunt server

```
grunt serve
Running "serve" task

Running "clean:server" (clean) task
Cleaning .tmp...OK

Running "bower-install:app" (bower-install) task

Running "concurrent:server" (concurrent) task
    
    Running "copy:styles" (copy) task
    Copied 1 files
    
    Done, without errors.
    
    
    Execution Time (2014-02-27 12:14:54 UTC)
    loading tasks  4ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 29%
    copy:styles    9ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 64%
    Total 14ms
    
Running "autoprefixer:dist" (autoprefixer) task
Prefixed file ".tmp/styles/main.css" created.

Running "connect:livereload" (connect) task
Started connect web server on 127.0.0.1:9000.

Running "watch" task
Waiting...
```

Browser akan terbuka dan mengarah ke `http://127.0.0.1:9000`. Ini merupakan fitur LiveReload dari Grunt. Semua perubahan yang kita buat di source code akan langsung tampil di browser tanpa perlu refresh ataupun restart.

[![Foto](https://lh3.googleusercontent.com/-BIe-5q4gFYA/Uw9HAoUTHAI/AAAAAAAAFTc/wRPt39Kk9Bs/w909-h573-no/02-test-grunt-ok.png)](https://lh3.googleusercontent.com/-BIe-5q4gFYA/Uw9HAoUTHAI/AAAAAAAAFTc/wRPt39Kk9Bs/w909-h573-no/02-test-grunt-ok.png)

Untuk mematikannya, gunakan Ctrl-C

```
^C

Execution Time (2014-02-27 12:14:52 UTC)
concurrent:server   1.7s  ▇▇▇ 5%
watch              33.2s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 95%
Total 35s
```

Selesai sudah template aplikasi client. Selanjutnya tinggal rapi-rapi sedikit.

### Integrasi Client - Server ###

Sekarang kita sudah punya dua folder dalam project:

* aplikasi-membership-server
* aplikasi-membership-client

Masing-masing aplikasi memiliki `.gitignore` sendiri. Sebaiknya kita gabungkan menjadi satu. Buat file `.gitignore` sejajar dengan kedua folder tersebut. Copy-paste isi dari file `.gitignore` di folder client dan server. Hapus yang duplikat, dan perbaiki referensi lokasi absolut.

Berikutnya, kita arahkan hasil kompilasi project client ke dalam folder `static` dalam project server, supaya seisi project server bisa langsung dideploy ke production. Ini kita lakukan dengan cara mengedit konfigurasi Yeoman dalam `Gruntfile.js`, yang awalnya seperti ini

```
yeoman: {
    // configurable paths
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
},
```

menjadi seperti ini

```
yeoman: {
    // configurable paths
    app: require('./bower.json').appPath || 'app',
    dist: '../aplikasi-membership-server/static'
},
```

Jangan lupa menambahkan

```
aplikasi-membership-server/static
```

dalam `.gitignore`, agar hasil kompilasi tidak ikut dicommit ke repository Git.

Kita bisa mengetes hasil kompilasi Grunt. Harusnya dia akan membuat folder static dalam aplikasi server. Jalankan perintah berikut dalam folder aplikasi client

```
CHROME_BIN=chromium-browser grunt
```

Dia akan melakukan kompilasi, menjalankan test, kompresi js dan css, kemudian menaruh hasilnya di folder tujuan. Selama test dijalankan, kita akan melihat ada window Chrome yang terbuka dan kemudian tertutup lagi. Bila kita tidak ingin tesnya menggunakan browser betulan, kita bisa pakai `PhantomJS` untuk menjalankan semua kode HTML dan JavaScript tanpa browser.

PhantomJS bisa diaktifkan dalam file konfigurasi `karma.conf.js`. Edit baris berikut

```js
// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers: ['Chrome'],
```

Menjadi seperti ini

```
// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers: ['PhantomJS'],
```

Bila PhantomJS belum ada, instal dulu menggunakan perintah `sudo npm install -g phantomjs`.

Setelah rangkaian kegiatan yang dilakukan Grunt selesai, pastikan hasilnya ada dalam aplikasi server

[![Foto](https://lh3.googleusercontent.com/-kZ4ijjT4TAk/Uw9HB0thj3I/AAAAAAAAFTk/aKJJLsMglMk/w609-h597-no/04-test-compile-ok.png)](https://lh3.googleusercontent.com/-kZ4ijjT4TAk/Uw9HB0thj3I/AAAAAAAAFTk/aKJJLsMglMk/w609-h597-no/04-test-compile-ok.png)

Terakhir, kita aktifkan proxy agar url `api/*` yang mengarah ke server Grunt diteruskan ke SailsJS di port `1337`.  Proxy ini membutuhkan tambahan package `grunt-connect-proxy`. Install menggunakan `npm` dalam aplikasi client

```
cd aplikasi-membership-client
npm install grunt-connect-proxy --save-dev
```

Perintah di atas akan mengunduh package `grunt-connect-proxy` dari internet dan menambahkan dependensinya ke `package.json`.

Selanjutnya kita edit file `Gruntfile.js`. Ada beberapa bagian yang harus kita ubah:

* aktifasi modul `grunt-connect-proxy`. Tambahkan baris berikut di bawah `use strict`

  ```
  var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;
  ```

* konfigurasi URL yang akan diproxy. Lokasinya di dalam blok `connect` sejajar dengan blok `options`. 

```js
options: {
    port: 9000,
    // Change this to '0.0.0.0' to access the server from outside.
    hostname: 'localhost',
    livereload: 35729
},
proxies: [
    {
        context: '/api',
        host: 'localhost',
        port: 1337
    }
],
```


* Aktivasi proxy dalam `middleware`

```
livereload: {
  options: {
    open: true,
    base: [
      '.tmp',
      '<%= yeoman.app %>'
    ],
    middleware: function (connect) {
      return [
        proxySnippet,
        connect.static(require('path').resolve('app'))
      ];
    }
  }
},
```


* Panggil konfigurasi proxy pada saat server Grunt dijalankan

```
grunt.task.run([
      'clean:server',
      'bower-install',
      'configureProxies',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
```

Sekarang kita tes konfigurasi proxy dengan cara browse ke `http://localhost:9000/api`. Request ini akan diterima server Grunt dan akan diteruskan ke server Sails. Jadi harusnya request ini akan dilayani oleh Sails.

[![Foto](https://lh4.googleusercontent.com/-h-d7K0XO2x8/Uw9HAo4Ey4I/AAAAAAAAFTU/VRgJIDvUqxM/w909-h573-no/03-test-proxy-ok.png)](https://lh4.googleusercontent.com/-h-d7K0XO2x8/Uw9HAo4Ey4I/AAAAAAAAFTU/VRgJIDvUqxM/w909-h573-no/03-test-proxy-ok.png)

Tampak pesan error disana. Tidak apa-apa, kita akan perbaiki nanti. Yang penting sudah jelas bahwa request tersebut dilayani oleh Sails, bukan oleh Grunt.

Untuk lebih jelas mengenai skema proxy ini, silahkan baca [penjelasan om Rocky Jaiswal](http://rockyj.in/2013/10/24/angular_rails.html)


## Kesimpulan ##

Wow, cukup panjang dan melelahkan juga ya. Beberapa poin kesimpulan:

* teknologi yang kita gunakan dibagi dua: sisi client dan sisi server

* library di sisi client:

    * AngularJS
    * Twitter Bootstrap
    
* tools untuk membuat aplikasi client:

    * yeoman
    * bower
    * grunt

* library di sisi server:

    * sails
    * redis dan hiredis

* tools untuk membuat aplikasi server:

    * sails
    * foreman (untuk mengetes deployment ke heroku)
    * heroku

* untuk menghubungkan aplikasi client dan server di development : [pasang proxy di Grunt server](http://fettblog.eu/blog/2013/09/20/using-grunt-connect-proxy/)
* untuk menghubungkan aplikasi client dan server di production : gunakan konfigurasi `proxy_pass` yang ada di Nginx
* untuk menggabungkan deployment client dan server : arahkan hasil kompilasi Grunt ke folder `static` dalam aplikasi server

Beberapa link tutorial untuk deployment berskala production

* [Konfigurasi Nginx: proxy, SSL, cache, gzip](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/)
* [Deployment Nginx, Varnish, Upstart, dan Monit](http://blog.dealspotapp.com/post/40184153657/node-js-production-deployment-with-nginx-varnish)
* [Deployment Nginx, Upstart, Monit, Redis di Amazon EC2 dengan Puppet dan Vagrant](http://www.devopsdiary.com/blog/2013/05/16/deploying-node-dot-js-plus-nginx-plus-upstart-plus-monit-on-ec2-with-puppet-and-vagrant/)
