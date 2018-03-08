---
layout: post
title: "Deployment Microservice Kere Hore Bagian 4"
date: 2018-02-26 07:00
comments: true
categories:
- devops
---

Pada [artikel yang lalu]({{site.url}}/devops/deployment-microservice-kere-hore-1/), kita sudah membahas tentang penggunaan Nginx sebagai Front Proxy, [memasang aplikasi Java]({{site.url}}/devops/deployment-microservice-kere-hore-2/), dan [aplikasi Wordpress berbasis PHP]({{site.url}}/devops/deployment-microservice-kere-hore-3/). Kali ini kita akan lanjutkan memasang aplikasi berbasis NodeJS dengan framework ExpressJS.

<!--more-->

Sebagai contoh, kita akan membuat aplikasi sederhana menggunakan framework ExpressJS. Kemudian kita akan jalankan sebagai service di port `10002`. Terakhir, kita akan setting Nginx untuk meneruskan request yang menuju `app2.artivisi.id` ke `localhost:10002`.

Berikut langkah-langkahnya:

* Instalasi NodeJS
* Membuat Aplikasi ExpressJS
* Menjalankan Aplikasi sebagai Service dengan Systemd
* Konfigurasi Nginx untuk memforward request

## Instalasi NodeJS ##

Untuk distro berbasis Debian dan Ubuntu, developer NodeJS sudah menyediakan script installernya. Langkah-langkahnya dijelaskan di [website resminya](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

Setelah login ke server, jalankan perintah berikut

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Berikutnya, kita buat aplikasi sederhana dengan ExpressJS

## Aplikasi ExpressJS ##

Pertama, kita buat dulu folder projectnya.

```
mkdir aplikasijs
cd aplikasijs
```

Kemudian, inisialisasi projectnya

```
npm init 
```

Dia akan menampilkan beberapa pertanyaan yang harus kita jawab. Seperti ini tampilannya

```
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (aplikasijs) 
version: (1.0.0) 
description: Aplikasi JavaScript
entry point: (index.js) halo.js
test command: 
git repository: 
keywords: 
author: Endy Muhardin
license: (ISC) ASL
Sorry, license should be a valid SPDX license expression (without "LicenseRef"), "UNLICENSED", or "SEE LICENSE IN <filename>".
license: (ISC) Apache-2.0
About to write to /Users/endymuhardin/tmp/aplikasijs/package.json:

{
  "name": "aplikasijs",
  "version": "1.0.0",
  "description": "Aplikasi JavaScript",
  "main": "halo.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Endy Muhardin",
  "license": "Apache-2.0"
}


Is this ok? (yes) 
```

Berikutnya, install ExpressJS

```
npm install express --save
```

Outputnya seperti ini

```
npm install express --save
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN aplikasijs@1.0.0 No repository field.

+ express@4.16.2
added 49 packages in 10.044s
```

Selanjutnya, Hello World dulu. Copy paste kode program berikut, yang diambil dari [dokumentasi ExpressJS](https://expressjs.com/en/starter/hello-world.html). Pasang di file `halo.js` sesuai yang kita sebutkan pada waktu inisialisasi project.

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(10002, () => console.log('Example app listening on port 3000!'))
```

Jalankan aplikasinya dari command line

```
node halo.js
```

Outputnya seperti ini

```
Example app listening on port 10002s!
```

Dan kita bisa browse ke `http://localhost:10002`, hasilnya seperti ini

[![Halo Express]({{site.url}}/images/uploads/2018/msa-deployment/18-halo-express-local.png)]({{site.url}}/images/uploads/2018/msa-deployment/18-halo-express-local.png)

Folder project kita isinya seperti ini

[![Isi folder project]({{site.url}}/images/uploads/2018/msa-deployment/19-folder-project.png)]({{site.url}}/images/uploads/2018/msa-deployment/19-folder-project.png)

File-file berikut akan kita upload ke server untuk dideploy:

* halo.js
* package.json
* package-lock.json

Sedangkan folder `node_modules` tidak perlu, karena bisa digenerate pada waktu build. Jadi kita hapus dulu supaya bisa di-`rsync` dengan mudah.

```
rm -rf node_modules
```

Selanjutnya, kita upload ke server

```
rsync -avzP ./ root@app2.artivisi.id:/var/lib/aplikasijs/
```

Kemudian kita login ke server

```
ssh root@app2.artivisi.id
```

Masuk ke folder aplikasinya

```
cd /var/lib/aplikasijs
```

Kemudian instal semua dependensi aplikasinya

```
npm install
```

Test jalankan lagi di server

```
npm halo.js
```

Dan pastikan aplikasi sudah bisa diakses di http://app2.artivisi.id:10002

[![Aplikasi jalan di server 10002]({{site.url}}/images/uploads/2018/msa-deployment/20-halo-express-server-10002.png)]({{site.url}}/images/uploads/2018/msa-deployment/20-halo-express-server-10002.png)

## Menjalankan Aplikasi dengan Systemd ##

Bila kita jalankan aplikasi dengan perintah `node halo.js` seperti di atas, 
Ada beberapa aplikasi tambahan untuk menjalankan aplikasi NodeJS sebagai service, diantaranya:

* PM2
* Forever
* Nodemon

Pada saat artikel ini ditulis, yang paling mainstream adalah PM2, seperti dijelaskan pada [artikel ini](https://ifelse.io/2015/09/02/running-node.js-apps-in-production/). Walaupun demikian, melihat kegemaran komunitas JavaScript untuk me-rewrite sesuatu berulang-ulang, tidak menutup kemungkinan besok PM2 sudah digusur aplikasi lain. Jadi sementara ini, kita akan gunakan PM2. Bila Anda membaca artikel ini setahun kemudian, silahkan googling lagi untuk mencari solusi deployment yang lebih up-to-date.

Kita install dulu `PM2` di server

```
sudo npm install -g pm2
```

Outputnya seperti ini

```
npm WARN registry Unexpected warning for https://registry.npmjs.org/: Miscellaneous Warning EINTEGRITY: sha1-QFUCsAfzGcP0cXXER0UnMA8qta0= integrity checksum failed when using sha1: wanted sha1-QFUCsAfzGcP0cXXER0UnMA8qta0= but got sha512-zr6QQnzLt3Ja0t0XI8gws2kn7zV2p0l/D3kreNvS6hFZhVU5g+uY/30l42jbgt0XGcNBEmBDGJR71J692V92tA==. (260 bytes)
npm WARN registry Using stale package data from https://registry.npmjs.org/ due to a request error during revalidation.
/usr/bin/pm2 -> /usr/lib/node_modules/pm2/bin/pm2
/usr/bin/pm2-dev -> /usr/lib/node_modules/pm2/bin/pm2-dev
/usr/bin/pm2-docker -> /usr/lib/node_modules/pm2/bin/pm2-docker
/usr/bin/pm2-runtime -> /usr/lib/node_modules/pm2/bin/pm2-runtime
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.1.3 (node_modules/pm2/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

+ pm2@2.10.1
added 243 packages in 12.232s
```

Berikutnya, jalankan aplikasi kita dengan PM2

```
pm2 start halo.js
```

Outputnya seperti ini

```

                        -------------

__/\\\\\\\\\\\\\____/\\\\____________/\\\\____/\\\\\\\\\_____
 _\/\\\/////////\\\_\/\\\\\\________/\\\\\\__/\\\///////\\\___
  _\/\\\_______\/\\\_\/\\\//\\\____/\\\//\\\_\///______\//\\\__
   _\/\\\\\\\\\\\\\/__\/\\\\///\\\/\\\/_\/\\\___________/\\\/___
    _\/\\\/////////____\/\\\__\///\\\/___\/\\\________/\\\//_____
     _\/\\\_____________\/\\\____\///_____\/\\\_____/\\\//________
      _\/\\\_____________\/\\\_____________\/\\\___/\\\/___________
       _\/\\\_____________\/\\\_____________\/\\\__/\\\\\\\\\\\\\\\_
        _\///______________\///______________\///__\///////////////__


                          Community Edition

            Production Process Manager for Node.js applications
                     with a built-in Load Balancer.


                Start and Daemonize any application:
                $ pm2 start app.js

                Load Balance 4 instances of api.js:
                $ pm2 start api.js -i 4

                Monitor in production:
                $ pm2 monitor

                Make pm2 auto-boot at server restart:
                $ pm2 startup

                To go further checkout:
                http://pm2.io/


                        -------------

[PM2] Spawning PM2 daemon with pm2_home=/root/.pm2
[PM2] PM2 Successfully daemonized
[PM2] Starting /var/lib/aplikasijs/halo.js in fork_mode (1 instance)
[PM2] Done.
┌──────────┬────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────┬──────────┐
│ App name │ id │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user │ watching │
├──────────┼────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────┼──────────┤
│ halo     │ 0  │ fork │ 24481 │ online │ 0       │ 0s     │ 1%  │ 23.1 MB   │ root │ disabled │
└──────────┴────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
```

Lalu, kita daftarkan PM2 ke `systemd` supaya langsung jalan waktu booting.

```
pm2 startup systemd
```

Outputnya seperti ini

```
[PM2] Init System found: systemd
Platform systemd
Template
[Unit]
Description=PM2 process manager
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=forking
User=root
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/bin:/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin
Environment=PM2_HOME=/root/.pm2
PIDFile=/root/.pm2/pm2.pid

ExecStart=/usr/lib/node_modules/pm2/bin/pm2 resurrect
ExecReload=/usr/lib/node_modules/pm2/bin/pm2 reload all
ExecStop=/usr/lib/node_modules/pm2/bin/pm2 kill

[Install]
WantedBy=multi-user.target

Target path
/etc/systemd/system/pm2-root.service
Command list
[ 'systemctl enable pm2-root',
  'systemctl start pm2-root',
  'systemctl daemon-reload',
  'systemctl status pm2-root' ]
[PM2] Writing init configuration in /etc/systemd/system/pm2-root.service
[PM2] Making script booting at startup...
>>> Executing systemctl enable pm2-root
Created symlink from /etc/systemd/system/multi-user.target.wants/pm2-root.service to /etc/systemd/system/pm2-root.service.
[DONE] 
>>> Executing systemctl start pm2-root
[DONE] 
>>> Executing systemctl daemon-reload
[DONE] 
>>> Executing systemctl status pm2-root
● pm2-root.service - PM2 process manager
   Loaded: loaded (/etc/systemd/system/pm2-root.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2018-02-26 09:57:47 UTC; 135ms ago
     Docs: https://pm2.keymetrics.io/
 Main PID: 24471 (PM2 v2.10.1: Go)
   CGroup: /system.slice/pm2-root.service
           ‣ 24471 PM2 v2.10.1: God Daemon (/root/.pm2)        

Feb 26 09:57:47 apps.artivisi.id pm2[24536]: [PM2] Restoring processes located in /root/.pm2/dump.pm2
Feb 26 09:57:47 apps.artivisi.id pm2[24536]: [PM2][ERROR] Failed to read dump file in /root/.pm2/dump.pm2.bak
Feb 26 09:57:47 apps.artivisi.id pm2[24536]: [PM2][ERROR] No processes saved; DUMP file doesn't exist
Feb 26 09:57:47 apps.artivisi.id pm2[24536]: ┌──────────┬────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────┬──────────┐
Feb 26 09:57:47 apps.artivisi.id pm2[24536]: │ App name │ id │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user │ watching │
Feb 26 09:57:47 apps.artivisi.id pm2[24536]: ├──────────┼────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────┼──────────┤
Feb 26 09:57:47 apps.artivisi.id pm2[24536]: │ halo     │ 0  │ fork │ 24481 │ online │ 0       │ 53s    │ 0%  │ 37.6 MB   │ root │ disabled │
Feb 26 09:57:47 apps.artivisi.id pm2[24536]: └──────────┴────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────┴──────────┘
Feb 26 09:57:47 apps.artivisi.id pm2[24536]:  Use `pm2 show <id|name>` to get more details about an app
Feb 26 09:57:47 apps.artivisi.id systemd[1]: Started PM2 process manager.
[DONE] 
+---------------------------------------+
[PM2] Freeze a process list on reboot via:
$ pm2 save

[PM2] Remove init script via:
$ pm2 unstartup systemd
```

Test reboot servernya, untuk memastikan aplikasinya otomatis jalan.

## Konfigurasi Reverse Proxy Nginx ##

Caranya sama dengan konfigurasi reverse proxy aplikasi Spring Boot di [artikel terdahulu]({{site.url}}/devops/deployment-microservice-kere-hore-2/).

Kita tinggal edit baris `location` sehingga menjadi seperti ini



```
location / {
    proxy_pass http://localhost:10001;
}
```

Isi file lengkapnya seperti ini

```
server {
    server_name app2.artivisi.id;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/app2.artivisi.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app2.artivisi.id/privkey.pem;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/app2.artivisi.id/html;
    index index.php index.html;

    location / {
      proxy_pass http://localhost:10002;
    }
}
server {
    if ($host = app2.artivisi.id) {
        return 301 https://$host$request_uri;
    }

  listen 80;
  listen [::]:80;

  server_name app2.artivisi.id;
  return 404;
}
```

Restart nginx, kemudian ketik `app2.artivisi.id` di browser. Harusnya browser akan melakukan redirect ke `https://app2.artivisi.id` dan menampilkan tampilan aplikasi kita.

[![https://app2.artivisi.id]({{site.url}}/images/uploads/2018/msa-deployment/21-halo-express-server-final.png)]({{site.url}}/images/uploads/2018/msa-deployment/21-halo-express-server-final.png)

## Penutup ## 

Demikian cara deployment aplikasi NodeJS dibalik Nginx. Pada [artikel berikut]({{site.url}}/devops/deployment-microservice-kere-hore-5/) kita akan setup aplikasi Ruby dengan framework Rails di domain `app3.artivisi.id`. Stay tuned ...