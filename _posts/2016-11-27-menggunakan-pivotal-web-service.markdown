---
layout: post
title: "Menggunakan Pivotal Web Service"
date: 2016-11-27 07:00
comments: true
categories: 
- aplikasi
---


Pada workshop yang diadakan Pivotal kemarin, para peserta dipandu untuk membuat dan menjalankan aplikasi di [Pivotal Web Services](http://run.pivotal.io/). Ini adalah layanan cloud PaaS yang disediakan oleh Pivotal untuk menjalankan aplikasi yang kita buat.

Secara garis besar, cara deploymentnya mirip dengan Heroku dan Openshift, seperti yang pernah saya bahas [di artikel terdahulu](http://software.endy.muhardin.com/java/project-bootstrap-03/). Perbedaan yang paling mendasar, kalau di Heroku dan Openshift kita mendeploy source code (untuk kemudian dilakukan build di cloud), maka di Pivotal Web Services ini (kita sebut PWS aja ya biar gak capek ngetiknya) kita mendeploy JAR atau WAR. 

PWS ini berjalan menggunakan software Pivotal Cloud Foundry (PCF). Aplikasi PCF ini open source dan tersedia untuk diunduh. Jadi, kita bisa memasangnya di server kita sendiri. Mirip dengan Openshift, ada aplikasinya, open source, bisa diinstal di server sendiri (on premise).

Pivotal juga menyediakan versi mini dari PCF, disebut dengan [PCF Dev](https://pivotal.io/pcf-dev), yang bisa diinstal dengan mudah di laptop kita sendiri. Soalnya kalau kita mau install PCF versi full, lumayan ribet juga, harus paham Linux, platform IaaS, dan juga setup jaringan untuk kebutuhan routing dan DNS. Walaupun demikian, siapkan koneksi internet yang mumpuni, karena setup PCF Dev ini akan mendownload bergiga-giga data.

Sedangkan bila ingin menginstal PCF versi full, bisa membaca [dokumentasi di websitenya](http://docs.pivotal.io/pivotalcf/1-8/installing/pcf-docs.html)

Rekan-rekan bisa mengikuti panduan berikut dengan cara mendaftar di PWS. Setelah mendaftar, kita akan diberikan akun gratis untuk periode tertentu. Yuk kita mulai ...

<!--more-->

## Daftar di run.pivotal.io ##

Langkah pertama tentunya adalah membuat akun alias mendaftar ke PWS. Tentunya untuk pendaftaran tidak perlu saya jelaskan lagi :D
Jadi kita bisa lanjut ke langkah berikutnya.

## Instalasi Aplikasi Command Line ##

Pengoperasian Cloud Foundry bisa dilakukan lewat web ataupun lewat command line. Tetapi lebih fleksibel dan mudah diikuti adalah metode Command Line. Perintahnya bisa dicopas dari artikel ini. Tidak demikian kalau versi web. Saya bisa menyediakan screenshot, tapi untuk mengikutinya harus klik sana sini.

Instalasi aplikasi command line bisa dibaca sendiri di [websitenya Cloud Foundry](https://docs.run.pivotal.io/cf-cli/install-go-cli.html). Silahkan ikuti panduan yang sesuai dengan sistem operasi masing-masing.

## Setup Aplikasi Command Line ##

Karena Cloud Foundry bisa diinstal di local (dengan PWS Dev) ataupun di server kita sendiri (dengan PWS full), maka kita perlu memberitahu aplikasi command line mengenai server yang kita gunakan. Kemudian baru kita masukkan email dan password. Berikut perintahnya

```
cf login -a api.run.pivotal.io
API endpoint: api.run.pivotal.io

Email> endy.muhardin@gmail.com

Password> 
Authenticating...
OK

Targeted org endy.muhardin.com

Targeted space development
                
API endpoint:   https://api.run.pivotal.io (API version: 2.64.0)
User:           endy.muhardin@gmail.com
Org:            endy.muhardin.com
Space:          development
```

Pada contoh di atas, saya arahkan ke server PWS, yaitu `api.run.pivotal.io`.

## Aplikasi yang akan dideploy ##

Untuk mempermudah pembaca mengikuti, Anda bisa menggunakan contoh aplikasi yang sudah saya buat selama praktek di workshop kemarin. Silahkan clone dari Github

```
git clone https://github.com/endymuhardin/pivotal-workshop.git
```

Setelah diclone, masuk ke foldernya, kemudian build projectnya.

```
cd pivotal-workshop
mvn clean package
```

## Konfigurasi Cloud Foundry ##

Supaya Cloud Foundry tahu cara menjalankan aplikasi kita, perlu ada file konfigurasi. File konfigurasinya diberi nama `manifest.yml` dan ditaruh di top level folder dalam project kita. Isinya sebagai berikut

```yml
---
applications:
- name: aplikasi-lab
  memory: 512M
  instances: 1
  host: aplikasi-lab-${random-word}
  path: target/aplikasi-lab-0.0.1-SNAPSHOT.jar
```

## Deployment ##

Setelah itu, kita bisa melakukan deployment dengan perintah berikut

```
cf push
```

Berikut adalah outputnya

```
Using manifest file /Users/endymuhardin/Downloads/aplikasi-lab/manifest.yml

Creating app aplikasi-lab in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
OK

Creating route aplikasi-lab-weightiest-reen.cfapps.io...
OK

Binding aplikasi-lab-weightiest-reen.cfapps.io to aplikasi-lab...
OK

Uploading aplikasi-lab...
Uploading app files from: /var/folders/l4/82c0hrld15g_fgn110435k7m0000gn/T/unzipped-app849606044
Uploading 316.8K, 90 files
Done uploading               
OK

Starting app aplikasi-lab in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
Downloading binary_buildpack...
Downloading nodejs_buildpack...
Downloading staticfile_buildpack...
Downloading java_buildpack...
Downloading ruby_buildpack...
Downloaded ruby_buildpack
Downloading dotnet_core_buildpack...
Downloaded nodejs_buildpack
Downloading dotnet_core_buildpack_beta...
Downloaded java_buildpack
Downloading php_buildpack...
Downloaded dotnet_core_buildpack
Downloading go_buildpack...
Downloaded staticfile_buildpack
Downloading python_buildpack...
Downloaded php_buildpack
Downloaded go_buildpack
Downloaded python_buildpack
Downloaded binary_buildpack
Downloaded dotnet_core_buildpack_beta
Creating container
Successfully created container
Downloading app package...
Downloaded app package (12.6M)
Staging...
-----> Java Buildpack Version: v3.10 (offline) | https://github.com/cloudfoundry/java-buildpack.git#193d6b7
-----> Downloading Open Jdk JRE 1.8.0_111 from https://java-buildpack.cloudfoundry.org/openjdk/trusty/x86_64/openjdk-1.8.0_111.tar.gz (found in cache)
       Expanding Open Jdk JRE to .java-buildpack/open_jdk_jre (1.0s)
-----> Downloading Open JDK Like Memory Calculator 2.0.2_RELEASE from https://java-buildpack.cloudfoundry.org/memory-calculator/trusty/x86_64/memory-calculator-2.0.2_RELEASE.tar.gz (found in cache)
       Memory Settings: -Xss349K -XX:MetaspaceSize=104857K -Xms681574K -Xmx681574K -XX:MaxMetaspaceSize=104857K
-----> Downloading Spring Auto Reconfiguration 1.10.0_RELEASE from https://java-buildpack.cloudfoundry.org/auto-reconfiguration/auto-reconfiguration-1.10.0_RELEASE.jar (found in cache)
Exit status 0
Staging complete
Uploading droplet, build artifacts cache...
Uploading build artifacts cache...
Uploading droplet...
Uploaded build artifacts cache (108B)
Uploaded droplet (57.7M)
Uploading complete
Destroying container
Successfully destroyed container

0 of 1 instances running, 1 starting
1 of 1 instances running

App started


OK

App aplikasi-lab was started using this command `CALCULATED_MEMORY=$($PWD/.java-buildpack/open_jdk_jre/bin/java-buildpack-memory-calculator-2.0.2_RELEASE -memorySizes=metaspace:64m..,stack:228k.. -memoryWeights=heap:65,metaspace:10,native:15,stack:10 -memoryInitials=heap:100%,metaspace:100% -stackThreads=300 -totMemory=$MEMORY_LIMIT) && JAVA_OPTS="-Djava.io.tmpdir=$TMPDIR -XX:OnOutOfMemoryError=$PWD/.java-buildpack/open_jdk_jre/bin/killjava.sh $CALCULATED_MEMORY" && SERVER_PORT=$PORT eval exec $PWD/.java-buildpack/open_jdk_jre/bin/java $JAVA_OPTS -cp $PWD/. org.springframework.boot.loader.JarLauncher`

Showing health and status for app aplikasi-lab in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
OK

requested state: started
instances: 1/1
usage: 512M x 1 instances
urls: aplikasi-lab-weightiest-reen.cfapps.io
last uploaded: Wed Nov 23 09:09:16 UTC 2016
stack: cflinuxfs2
buildpack: java-buildpack=v3.10-offline-https://github.com/cloudfoundry/java-buildpack.git#193d6b7 java-main open-jdk-like-jre=1.8.0_111 open-jdk-like-memory-calculator=2.0.2_RELEASE spring-auto-reconfiguration=1.10.0_RELEASE

     state     since                    cpu     memory           disk           details
#0   running   2016-11-23 04:10:11 PM   76.8%   267.6M of 512M   137.1M of 1G
```

Aplikasi kita sudah terdeploy dan bisa diakses di `http://aplikasi-lab-weightiest-reen.cfapps.io`. Karena controller yang dibuat dimapping di url `/user/` maka kita bisa jalankan controllernya dengan mengakses url `http://aplikasi-lab-weightiest-reen.cfapps.io/user/`

## Setup Database ##

Aplikasi yang kita buat menggunakan database. Untuk itu, kita harus menyiapkan databasenya dulu. Cloud Foundry memiliki marketplace, yaitu tempat untuk mendapatkan service tambahan seperti database, email, message broker, dan sebagainya. Kita bisa cari service database dengan perintah `cf marketplace`. Berikut adalah outputnya

```
Getting services from marketplace in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
OK

service          plans                                                                                description
3scale           free_appdirect, basic_appdirect*                                                     API Management Platform
app-autoscaler   standard                                                                             Scales bound applications in response to load (beta)
blazemeter       free-tier, basic1kmr*, pro5kmr*                                                      Performance Testing Platform
cedexisopenmix   opx_global*, openmix-gslb-with-fusion-feeds*                                         Openmix Global Cloud and Data Center Load Balancer
cedexisradar     free-community-edition                                                               Free Website and Mobile App Performance Reports
cleardb          spark, boost*, amp*, shock*                                                          Highly available MySQL for your Apps.
cloudamqp        lemur, tiger*, bunny*, rabbit*, panda*                                               Managed HA RabbitMQ servers in the cloud
cloudforge       free, standard*, pro*                                                                Development Tools In The Cloud
elephantsql      turtle, panda*, hippo*, elephant*                                                    PostgreSQL as a Service
flashreport      trial, basic*, silver*, gold*, platinum*                                             Generate PDF from your data
gluon            free, indie*, business*, enterprise*                                                 Mobile Synchronization and Cloud Integration
ironworker       production*, starter*, developer*, lite                                              Job Scheduling and Processing
loadimpact       lifree, li100*, li500*, li1000*                                                      Performance testing for DevOps
memcachedcloud   100mb*, 250mb*, 500mb*, 1gb*, 2-5gb*, 5gb*, 30mb                                     Enterprise-Class Memcached for Developers
memcachier       dev, 100*, 250*, 500*, 1000*, 2000*, 5000*, 7500*, 10000*, 20000*, 50000*, 100000*   The easiest, most advanced memcache.
mlab             sandbox                                                                              Fully managed MongoDB-as-a-Service
newrelic         standard                                                                             Manage and monitor your apps
pubnub           free                                                                                 Build Realtime Apps that Scale
rediscloud       100mb*, 250mb*, 500mb*, 1gb*, 2-5gb*, 5gb*, 10gb*, 50gb*, 30mb                       Enterprise-Class Redis for Developers
searchify        small*, plus*, pro*                                                                  Custom search you control
searchly         small*, micro*, professional*, advanced*, starter, business*, enterprise*            Search Made Simple. Powered-by Elasticsearch
sendgrid         free, bronze*, silver*                                                               Email Delivery. Simplified.
ssl              basic*                                                                               Upload your SSL certificate for your app(s) on your custom domain
stamplay         plus*, premium*, core, starter*                                                      API-first development platform
statica          starter, spike*, micro*, medium*, large*, enterprise*, premium*                      Enterprise Static IP Addresses
temporize        small*, medium*, large*                                                              Simple and flexible job scheduling for your application

* These service plans have an associated cost. Creating a service instance will incur this cost.

TIP:  Use 'cf marketplace -s SERVICE' to view descriptions of individual plans of a given service.
```

Kita akan gunakan service ClearDB yang menyediakan layanan MySQL. Gunakan paket `spark` yang gratis.

Service ClearDB paket `spark` diinisialisasi dengan perintah berikut

```
cf create-service cleardb spark aplikasi-lab-db
```

Outputnya seperti ini

```
Creating service instance aplikasi-lab-db in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
OK
```

## Bind service database ke aplikasi ##

Selanjutnya, kita sambungkan aplikasi kita ke database tersebut. Gunakan perintah `cf bs` untuk melakukan bind service.

```
cf bs aplikasi-lab aplikasi-lab-db
Binding service aplikasi-lab-db to app aplikasi-lab in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
OK
TIP: Use 'cf restage aplikasi-lab' to ensure your env variable changes take effect
```

Hasilnya bisa dilihat dengan perintah `cf env`

```
cf env aplikasi-lab
Getting env variables for app aplikasi-lab in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
OK

System-Provided:
{
 "VCAP_SERVICES": {
  "cleardb": [
   {
    "credentials": {
     "hostname": "us-cdbr-iron-east-04.cleardb.net",
     "jdbcUrl": "jdbc:mysql://us-cdbr-iron-east-04.cleardb.net/ad_64335bf0ac3ef8d?user=b7882f306fb1a2\u0026password=34035fad",
     "name": "ad_64335bf0ac3ef8d",
     "password": "34035fad",
     "port": "3306",
     "uri": "mysql://b7882f306fb1a2:34035fad@us-cdbr-iron-east-04.cleardb.net:3306/ad_64335bf0ac3ef8d?reconnect=true",
     "username": "b7882f306fb1a2"
    },
    "label": "cleardb",
    "name": "aplikasi-lab-db",
    "plan": "spark",
    "provider": null,
    "syslog_drain_url": null,
    "tags": [
     "Data Stores",
     "Cloud Databases",
     "Web-based",
     "Online Backup \u0026 Storage",
     "Single Sign-On",
     "Cloud Security and Monitoring",
     "Certified Applications",
     "Developer Tools",
     "Data Store",
     "Development and Test Tools",
     "Buyable",
     "mysql",
     "relational"
    ],
    "volume_mounts": []
   }
  ]
 }
}

{
 "VCAP_APPLICATION": {
  "application_id": "30ab9b1b-64dd-458d-a027-a82beadbf05a",
  "application_name": "aplikasi-lab",
  "application_uris": [
   "aplikasi-lab-weightiest-reen.cfapps.io"
  ],
  "application_version": "64cc26f2-c28d-4f07-b31a-13e0d42c8df0",
  "cf_api": "https://api.run.pivotal.io",
  "limits": {
   "disk": 1024,
   "fds": 16384,
   "mem": 512
  },
  "name": "aplikasi-lab",
  "space_id": "02048815-c0b1-47ed-82f4-04a3efdfbfe2",
  "space_name": "development",
  "uris": [
   "aplikasi-lab-weightiest-reen.cfapps.io"
  ],
  "users": null,
  "version": "64cc26f2-c28d-4f07-b31a-13e0d42c8df0"
 }
}

No user-defined env variables have been set

No running env variables have been set

No staging env variables have been set
```

## Konfigurasi Koneksi Database di Aplikasi ##

Biasanya, kita mengedit file `application.properties` untuk mengatur JDBC URL, username, dan password database kita. Tapi kali ini tidak perlu. Spring Boot sudah menyediakan konfigurator otomatis untuk berbagai layanan cloud populer (Cloud Foundry, Openshift, Heroku, AWS, dan sebagainya). Kita cukup menambahkan dependensi paket `spring-cloud-connector-starter` saja di `pom.xml`.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cloud-connectors</artifactId>
</dependency>
```

Setelah ditambahkan dependensinya, lakukan build ulang dan push hasil buildnya

```
mvn clean package && cf push
```

## Cek status aplikasi di cf ##

Untuk mengecek kondisi aplikasi kita di Cloud Foundry, kita jalankan perintah `cf apps`.

```
cf apps
Getting apps in org endy.muhardin.com / space development as endy.muhardin@gmail.com...
OK

name           requested state   instances   memory   disk   urls
aplikasi-lab   started           1/1         512M     1G     aplikasi-lab-weightiest-reen.cfapps.io, aplikasi-lab-nonflying-demipique.cfapps.io, aplikasi-lab-noncogent-semiproductiveness.cfapps.io, aplikasi-lab-unsolar-canoe.cfapps.io
```

## Deployment ke Heroku ##

Untuk membuktikan kecanggihan Spring Cloud Connector, kita juga akan mendeploy aplikasi ini ke Heroku dan melihat sebanyak apa perubahan dan konfigurasi yang harus kita lakukan.

Dokumentasi lengkapnya bisa dibaca di [blog tim Spring tentang Spring Cloud](https://spring.io/blog/2014/06/03/introducing-spring-cloud).

Sebelum menjalankan perintah ini, pastikan di komputer kita sudah terinstal aplikasi command line Heroku. Caranya bisa dilihat [di artikel terdahulu](http://software.endy.muhardin.com/aplikasi/membuat-blog-jekyll-heroku/).

### Persiapan di sisi Heroku ###

Pertama, kita perlu membuat aplikasi dulu di Heroku. Berikut perintahnya

```
heroku apps:create
```

Dan ini outputnya

```
Creating app... done, ⬢ mysterious-spire-63516
https://mysterious-spire-63516.herokuapp.com/ | https://git.heroku.com/mysterious-spire-63516.git
```

Selanjutnya, kita beri nama aplikasinya

```
heroku config:set SPRING_CLOUD_APP_NAME=aplikasi-lab
```

Hasilnya seperti ini

```
Setting SPRING_CLOUD_APP_NAME and restarting ⬢ mysterious-spire-63516... done, v3
SPRING_CLOUD_APP_NAME: aplikasi-lab
```

Lalu, kita siapkan databasenya.

```
heroku addons:create heroku-postgresql:hobby-dev
```

Outputnya seperti ini

```
Creating heroku-postgresql:hobby-dev on ⬢ mysterious-spire-63516... free
Database has been created and is available
 ! This database is empty. If upgrading, you can transfer
 ! data from another database with pg:copy
Created postgresql-animated-92052 as DATABASE_URL
Use heroku addons:docs heroku-postgresql to view documentation
```

Persiapan di sisi heroku sudah selesai. Selanjutnya, kita bisa tampilkan log aplikasi kita di Heroku agar mudah memonitor kalau ada error.

```
heroku logs --tail
```

### Konfigurasi Heroku ###

Seperti yang sudah-sudah, Heroku membutuhkan konfigurasi dalam file yang diberi nama `Procfile`. Berikut isinya

```
web: java -Dserver.port=$PORT -Dspring.profiles.active=cloud -jar target/*.jar
```

Ini mirip dengan petunjuk saya [di artikel terdahulu](http://software.endy.muhardin.com/java/project-bootstrap-03/). Bedanya, di sini kita gunakan nama profil `cloud`. Ini adalah nama khusus yang akan dikenali oleh `spring-cloud-connector`. Kita juga tidak perlu membuatkan konfigurasi database khusus seperti di artikel sebelumnya.

### Deployment ke Heroku ###

Deployment seperti biasa, cukup git push saja.

```
git add .
git commit -m "konfigurasi Heroku"
git push heroku master
```

Hasilnya bisa dilihat dengan perintah

```
heroku apps:info
```

Dan lihat outputnya

```
=== mysterious-spire-63516
Addons:        heroku-postgresql:hobby-dev
Dynos:         web: 1
Git URL:       https://git.heroku.com/mysterious-spire-63516.git
Owner:         endy.muhardin@gmail.com
Region:        us
Repo Size:     12 KB
Slug Size:     75 MB
Stack:         cedar-14
Web URL:       https://mysterious-spire-63516.herokuapp.com/
```

Seperti biasa, saya menginisialisasi database menggunakan [Flyway](https://flywaydb.org/), sehingga pada waktu deployment, aplikasi akan otomatis membuat tabel dan mengisi sampel data. Mari kita cek apakah tabel dan datanya sudah ada.

Gunakan perintah berikut untuk connect ke database Heroku.

```
heroku pg:psql
```

Outputnya begini

```
---> Connecting to DATABASE_URL
psql (9.5.5)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

mysterious-spire-63516::DATABASE=>
```

Setelah mendapat prompt, kita bisa cek tabel yang ada di database dengan perintah `\d` dan lihat datanya dengan perintah `select * from s_user`.


## Penutup ##

Demikian cara mendeploy aplikasi kita di server Cloud Foundry yang disediakan oleh Pivotal. Sebetulnya masih banyak fitur lain yang tersedia, seperti:

* [Blue Green Deployment](https://docs.run.pivotal.io/devguide/deploy-apps/blue-green.html)
* [Horizontal dan Vertical Scale](https://docs.run.pivotal.io/devguide/deploy-apps/cf-scale.html)
* [Autoscale](https://docs.run.pivotal.io/appsman-services/autoscaler/using-autoscaler.html)
* dan sebagainya

Silahkan daftar dan coba-coba sendiri. Semoga bermanfaat
