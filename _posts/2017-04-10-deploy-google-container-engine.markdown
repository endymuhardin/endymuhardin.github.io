---
layout: post
title: "Mendeploy Docker Container ke Google Container Engine"
date: 2017-04-10 07:00
comments: true
categories:
- devops
---

Pada artikel sebelumnya, kita telah membuat docker image, merangkainya dengan docker compose, kemudian menjalankannya di Docker Engine di Digital Ocean. Di artikel ini, kita akan coba naikkan level kekiniannya dengan mendeploy ke Google Container Engine yang biasa disingkat GKE. Ingat!! Pakai `K` ya. Bukan GCE, karena singkatan GCE sudah dipakai oleh Google Compute Engine.

Untuk mendeploy ke GKE, kita akan menggunakan [Kubernetes](https://kubernetes.io/), bukan Docker Compose.

> Apa bedanya?

Singkatnya begini, dalam Docker Compose, kita berbicara di level instance. Aplikasi web kita satu instance, database server satu instance. Beda ya, instance dengan node. Node itu bisa disebut satu mesin. Dalam satu mesin bisa menampung banyak instance aplikasi kita.

Bila aplikasi web kita digandakan menjadi beberapa instance (mungkin untuk alasan failover, mungkin untuk meningkatkan kapasitas melayani request), maka itu disebut replikasi atau clustering. Untuk mengelola replikasi ini, terutama replikasi docker container, ada beberapa alternatif solusi yang tersedia, diantaranya:

* Docker Swarm
* Kubernetes
* Apache Mesos
* dan sebagainya, termasuk bikin sendiri.

Pada artikel ini, kita akan mendeploy aplikasi menggunakan Kubernetes.

> Kenapa pilih Kubernetes?

Alasan utama sih sebenarnya karena saya pengen belajar Kubernetes, biar kekinian :D
Selain itu, karena kita ingin deploy ke layanan cloud yang disediakan oleh Google. [Ke Heroku kan sudah](http://software.endy.muhardin.com/java/project-bootstrap-03/), [ke Digital Ocean sudah](http://software.endy.muhardin.com/java/deploy-jenkins-vps/), [ke Pivotal sudah](http://software.endy.muhardin.com/java/deploy-jenkins-pivotal/), nah jadi sekarang kita coba produknya Google.

> Kok gak ke Amazon? Kan terkenal juga?

Ya simply karena jatah gratisan Amazon saya sudah habis. Jadi kita maksimalkan yang masih gratis dulu :D

Mari kita mulai ...

<!--more-->

Pada artikel ini, kita batasi dulu untuk deployment satu instance saja. Sebetulnya Kubernetes lebih ditujukan untuk mengelola [deployment ratusan ribu instance di ribuan node](http://blog.kubernetes.io/2017/03/scalability-updates-in-kubernetes-1.6.html). Sayangnya aplikasi contoh kita belum cluster-ready, jadi sementara kita tunda dulu clusteringnya. Cukup kita tiru saja konfigurasi docker compose kemarin, yaitu satu instance database, satu instance aplikasi, kemudian kita gunakan persistent volume untuk menyimpan data agar tidak hilang pada saat container dihapus.

Lain waktu kita akan perbaiki aplikasinya supaya cluster-ready, sehingga nanti tinggal kita scale-out dengan mudah.

## Apa itu Kubernetes ##

Singkatnya begini, Kubernetes adalah aplikasi cluster management open source yang disponsori oleh Google. Aplikasi ini berasal dari aplikasi internal yang digunakan Google (namanya Borg) untuk mengelola cluster mereka sendiri. Janji surganya adalah, karena berasal dari pengalaman Google belasan tahun dalam mengelola cluster, maka Kubernetes ini akan merupakan kristalisasi dari best-practices dan lesson-learned dari belasan tahun tersebut.

Secara bisnis, Kubernetes ini [merupakan senjata andalan Google](http://container-solutions.com/why-kubernetes-makes-sense/) untuk mendongkrak peringkatnya di pasar cloud hosting, yang saat ini jauh berada di bawah Amazon dan Azure-nya Microsoft. Ini bisa dilihat dari [betapa mudahnya kita menggunakan Kubernetes di GKE](https://medium.com/google-cloud/why-k8s-on-gke-a644d2d611c1). Bandingkan dengan susahnya setup Kubernetes di tempat lain.

Sebelum lebih jauh, kita pahami dulu beberapa istilah dalam Kubernetes:

* Pod : adalah satu grup container instance. Kita bisa menjalankan beberapa container (misalnya aplikasi web + redis cache + logging service) dalam satu pod. Antar container dalam satu pod bisa saling mengakses dengan menggunakan alamat `localhost`. Anggap saja `pod` seperti laptop yang kita pakai coding. Untuk mengakses database dari aplikasi kita, biasanya kita pakai alamat `localhost`

* Node : adalah representasi dari satu mesin. Mesin ini bisa saja mesin virtual (seperti VPS atau dropletnya DigitalOcean) atau fisik. Tapi kita seharusnya tidak memusingkan virtual vs fisik. Yang perlu kita pahami adalah satu `node` bisa berisi banyak `pod`. Kubernetes nanti yang akan memilihkan `pod` mana akan jalan di `node` mana. Dia juga bebas memindahkan `pod` dari `node` yang sibuk ke `node` lain yang terlihat santai.

* Service : merupakan mekanisme untuk mengekspos pod kita ke dunia luar. Aplikasi kita yang berjalan dalam pod tidak memiliki alamat IP yang tetap, karena `node` tempat dia berjalan bisa pindah-pindah. Agar bisa diakses oleh aplikasi lain atau oleh user, kita perlu alamat IP yang tetap. Service menyediakan alamat IP yang tetap, yang nantinya akan kita arahkan ke `pod` kita dengan menggunakan `selector`.

* Label : adalah seperangkat informasi metadata untuk mencari `pod` tertentu. Sebagai contoh, label yang biasa digunakan misalnya:

	* `app=belajar` : kita buat label `app` yang isinya adalah nama aplikasi. Semua container, pod, dan service yang menjadi bagian dari aplikasi `belajar` kita beri label `app=belajar`. Ini akan memudahkan kita untuk mencari siapa saja yang ikut terlibat dalam aplikasi `belajar`.
	* `stage=production` : label `stage` bisa kita gunakan untuk menentukan berbagai konfigurasi environment deployment aplikasi kita, misalnya `development`, `testing`, `performancetest`, `securitytest`, dan `production`
	* `jenis=frontend` : kita bisa membuat label jenis aplikasi, misalnya `frontend`, `cache`, `database`, `fileserver`, dan sebagainya.

* Selector : adalah filtering menggunakan label. Misalnya kita ingin mencari semua instance `database` untuk aplikasi `belajar` yang berjalan di `production`.

Di Google Cloud Platform, segala infrastruktur yang dibutuhkan untuk menjalankan Kubernetes sudah tersedia. Sehingga kita cukup belajar cara pakainya saja, tidak perlu pusing memikirkan cara setupnya :D

## Setup Google Cloud Platform ##

Untuk mendapatkan akses ke Google Cloud Platform, langsung saja [mendaftar ke websitenya](https://cloud.google.com/). Tidak perlu saya jelaskan ya, cukup klik saja tombol Free Trial. Biasanya yang gratis-gratis gampang dicari kok :P

Saya agak lupa apakah perlu kartu kredit atau tidak. Lagipula kartu kredit saya sudah pernah didaftarkan waktu beli aplikasi di Play Store. Jadi mungkin sudah terintegrasi sehingga saya tidak dimintai lagi.

Setelah selesai membuat akun, buat project baru di dalam web console Google Cloud. Project di artikel ini namanya `belajar-ci`. Membuat project juga tidak akan saya pandu, silahkan cari sendiri tombolnya.

### Setup Google Cloud SDK ###

Setelah mendapat akun, berikutnya kita instal Google Cloud SDK. Sebetulnya bisa saja kita klak klik di web console. Tapi saya kurang suka. Selain lambat (menggerakkan mouse lebih lambat daripada mengetik command), juga sulit diotomasi nantinya di proses Continuous Integration.

Instalasi Google Cloud SDK juga tidak perlu kita bahas ya. Silahkan ikuti panduan [di sini](https://cloud.google.com/sdk/docs/quickstarts).

Kita harus login dulu menggunakan Google Cloud SDK agar bisa mengakses akun kita di Google Cloud. Buka command prompt, dan lakukan perintah berikut

```
gcloud init
```

Kita akan dipandu untuk melakukan proses login.

```
Welcome! This command will take you through the configuration of gcloud.

Your current configuration has been set to: [default]

You can skip diagnostics next time by using the following flag:
  gcloud init --skip-diagnostics

Network diagnostic detects and fixes local network connection issues.
Checking network connection...done.                                             
Reachability Check passed.
Network diagnostic (1/1 checks) passed.

You must log in to continue. Would you like to log in (Y/n)?
```

Ketik saja enter untuk memilih Yes. Kita akan dibukakan browser untuk melanjutkan proses login

```
Your browser has been opened to visit:

    https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8085%2F&prompt=select_account&response_type=code&client_id=32555940559.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fappengine.admin+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcompute+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Faccounts.reauth&access_type=offline
```

Bila kita belum login Google, kita harus login dulu. Tapi biasanya orang sudah membuka GMail di browsernya, sehingga bisa langsung ke laman otorisasi

![Otorisasi Cloud SDK]({{site.url}}/images/uploads/2017/gitlab-ci-gke/otorisasi-cloud-sdk.png)

```
You are logged in as: [endy.muhardin@gmail.com].

Pick cloud project to use:
 [1] belajar-ci
 [2] belajar-oauth-sso
Please enter numeric choice or text value (must exactly match list
item):   1
```

Setelah otorisasi, kita akan disuruh pilih project mana yang akan kita kerjakan. Bila nanti mau pindah project, kita bisa melakukan setup ulang.

Pilih 1, yaitu project yang sudah kita buat setelah pendaftaran tadi.

```
Your current project has been set to: [belajar-ci].

Do you want to configure Google Compute Engine
(https://cloud.google.com/compute) settings (Y/n)?  

Which Google Compute Engine zone would you like to use as project
default?
If you do not specify a zone via a command line flag while working
with Compute Engine resources, the default is assumed.
 [1] asia-east1-a
 [2] asia-east1-c
 [3] asia-east1-b
 [4] asia-northeast1-c
 [5] asia-northeast1-a
 [6] asia-northeast1-b
 [7] europe-west1-d
 [8] europe-west1-b
 [9] europe-west1-c
 [10] us-central1-b
 [11] us-central1-a
 [12] us-central1-f
 [13] us-central1-c
 [14] us-east1-b
 [15] us-east1-d
 [16] us-east1-c
 [17] us-west1-a
 [18] us-west1-b
 [19] Do not set default zone
 Please enter numeric choice or text value (must exactly match list
 item):  1
```

Pilih zona default. Di sini saya pilih 1 agar servernya lebih dekat ke Indonesia.

```
 Your project default Compute Engine zone has been set to [asia-east1-a].
 You can change it by running [gcloud config set compute/zone NAME].

 Your Google Cloud SDK is configured and ready to use!

 * Commands that require authentication will use endy.muhardin@gmail.com by default
 * Commands will reference project `belajar-ci` by default
 * Compute Engine commands will use region `asia-east1` by default
 * Compute Engine commands will use zone `asia-east1-a` by default

 Run `gcloud help config` to learn how to change individual settings

 This gcloud configuration is called [default]. You can create additional configurations if you work with multiple accounts and/or projects.
 Run `gcloud topic configurations` to learn more.

 Some things to try next:

 * Run `gcloud --help` to see the Cloud Platform services you can interact with. And run `gcloud help COMMAND` to get help on any gcloud command.
 * Run `gcloud topic -h` to learn about advanced features of the SDK like arg files and output formatting
```

Berikutnya, kita siapkan file credentials agar Kubernetes nantinya bisa melakukan deployment.

```
gcloud auth application-default login
```

Kita akan dibukakan browser lagi dan dimintai persetujuan

![Otorisasi Kubernetes]({{site.url}}/images/uploads/2017/gitlab-ci-gke/otorisasi-auth-library.png)

Allow saja supaya bisa lanjut. Setelah diapprove, kita akan mendapatkan file authentication seperti disebutkan dalam output command line tadi.

```
Your browser has been opened to visit:

    https://accounts.google.com/o/oauth2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A8085%2F&prompt=select_account&response_type=code&client_id=764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcloud-platform&access_type=offline



Credentials saved to file: [/Users/endymuhardin/.config/gcloud/application_default_credentials.json]

These credentials will be used by any library that requests
Application Default Credentials.
```

### Instalasi Kubernetes ###

Agar dapat berinteraksi dengan kubernetes cluster, kita harus melakukan instalasi terlebih dulu. Kita bisa menginstalnya melalui Google Cloud SDK dengan perintah berikut

```
gcloud components install kubectl
```

Atau kita bisa install langsung di sistem operasi dengan perintah berikut (MacOS)

```
brew install kubectl
```

Saya menggunakan metode instalasi `gcloud` untuk memastikan versi `kubectl` kompatibel dengan Google Container Engine (GKE). Berikut adalah outputnya

```
Your current Cloud SDK version is: 149.0.0
Installing components from version: 149.0.0

┌─────────────────────────────────────────────────┐
│       These components will be installed.       │
├────────────────────────────┬─────────┬──────────┤
│            Name            │ Version │   Size   │
├────────────────────────────┼─────────┼──────────┤
│ kubectl                    │         │          │
│ kubectl (Mac OS X, x86_64) │   1.5.4 │ 11.4 MiB │
└────────────────────────────┴─────────┴──────────┘

For the latest full release notes, please visit:
  https://cloud.google.com/sdk/release_notes

Do you want to continue (Y/n)?  

╔════════════════════════════════════════════════════════════╗
╠═ Creating update staging area                             ═╣
╠════════════════════════════════════════════════════════════╣
╠═ Installing: kubectl                                      ═╣
╠════════════════════════════════════════════════════════════╣
╠═ Installing: kubectl (Mac OS X, x86_64)                   ═╣
╠════════════════════════════════════════════════════════════╣
╠═ Creating backup and activating new installation          ═╣
╚════════════════════════════════════════════════════════════╝

Performing post processing steps...done.                                                                                                              

Update done!
```

### Membuat Cluster ###

Pembuatan cluster bisa dilakukan melalui tampilan web Google Cloud Platform ataupun command line `gcloud`. Saya lebih suka pendekatan ketik melalui command line daripada klik di web. Berikut adalah perintah untuk membuat cluster baru.

```
gcloud container clusters create belajar-ci
```

Outputnya sebagai berikut

```
Creating cluster belajar-ci...done.                                                                                                           
Created [https://container.googleapis.com/v1/projects/belajar-ci/zones/asia-east1-a/clusters/belajar-ci].
kubeconfig entry generated for belajar-ci.
NAME                ZONE          MASTER_VERSION  MASTER_IP       MACHINE_TYPE   NODE_VERSION  NUM_NODES  STATUS
belajar-ci  asia-east1-a  1.5.6           104.155.233.44  n1-standard-1  1.5.6         3          RUNNING
```

### Menyiapkan Volume ###

Konfigurasi kubernetes yang saya buat menggunakan persistent volume supaya datanya tidak hilang pada saat container dimatikan, baik karena upgrade, masalah terhadap node, pindah node, dan sebagainya. Persistent volume sudah disediakan Google Cloud Platform, kita tinggal buat saja dengan perintah berikut

```
gcloud compute disks create --size=10GB --zone=asia-east1-a belajar-ci-pv-1
```

Persistent volume ini akan terlihat seperti partisi harddisk biasa dalam container kita. Sehingga bisa kita mount ke folder mana saja di dalam sistem operasi container. Kita akan bahas lebih lanjut deklarasi dan penggunaannya di bawah nanti.

Perintah di atas akan membuat partisi harddisk dengan ukuran 10GB yang berlokasi di region `asia-east1-a`. Saya samakan dengan setting default project kita di atas.

Output perintah di atas seperti ini

```
Created [https://www.googleapis.com/compute/v1/projects/belajar-ci/zones/asia-east1-a/disks/belajar-ci-pv-1].
NAME             ZONE          SIZE_GB  TYPE         STATUS
belajar-ci-pv-1  asia-east1-a  10       pd-standard  READY

New disks are unformatted. You must format and mount a disk before it
can be used. You can find instructions on how to do this at:

https://cloud.google.com/compute/docs/disks/add-persistent-disk#formatting
```

Walaupun disitu dinyatakan bahwa kita perlu memformat partisi tersebut, abaikan saja. Konfigurasi kita nanti akan otomatis melakukan formatting.

Buat satu lagi untuk menampung hasil upload di aplikasi web. Caranya sama, ganti saja `belajar-ci-pv-1` menjadi `belajar-ci-pv-2`.

Selesai sudah proses setup Google Cloud SDK, instalasi Kubernetes, dan pembuatan cluster lengkap dengan persistent volumenya. Sekarang kita lihat konfigurasi deploymentnya.

## Konfigurasi Deployment ##

Agar rapi, konfigurasi kita pisahkan menjadi 3 file :

* konfigurasi persistent volume
* konfigurasi database
* konfigurasi aplikasi web

Mari kita lihat satu persatu

### Persistent Volume ###

Pada dasarnya, konfigurasi ini berisi deklarasi untuk persistent disk yang sudah kita buat pada langkah sebelumnya. Kita perlu mendeklarasikannya supaya bisa dipakai di konfigurasi lainnya. Berikut [isi file `persistent-volume.yml`](https://github.com/endymuhardin/belajar-ci/blob/master/k8s/persistent-volume.yml). Nama file bebas, silahkan pilih yang Anda suka.

```yml
# gcloud compute disks create --size=10GB --zone=asia-east1-a belajar-ci-pv-1
apiVersion: v1
kind: PersistentVolume
metadata:
  name: belajar-ci-pv-1
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  gcePersistentDisk:
    pdName: belajar-ci-pv-1
    fsType: ext4
---
# gcloud compute disks create --size=10GB --zone=asia-east1-a belajar-ci-pv-2
apiVersion: v1
kind: PersistentVolume
metadata:
  name: belajar-ci-pv-2
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  gcePersistentDisk:
    pdName: belajar-ci-pv-2
    fsType: ext4
```

Kita mendeklarasikan dua persistent volume, sesuai command kita jalankan sebelumnya. Isi file sudah cukup jelas, yaitu menyebutkan:

* metadata : nama persistent volume, kita buat supaya nanti gampang dicari dengan Selector
* `spec.capacity.storage` : kapasitas disk. Kita gunakan saja 10GB supaya hemat biaya
* `spec.accessModes` : ijin akses container untuk menggunakan volume ini. Ada tiga opsi:

	* read only many (ROX) : bisa dibaca banyak node, tapi tidak boleh ditulis. Hanya bisa baca isinya
	* read write once (RWO) : bisa digunakan secara read-write hanya oleh satu node
	* read write many (RWX) : bisa dimount oleh banyak node, semuanya boleh menulis data

	access modes ini hanya dijalankan salah satu saja, tidak boleh misalnya kita pakai ROX dan RWX sekaligus. Lebih detail bisa dibaca [di dokumentasinya](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes)

* `gcePersistentDisk.pdName` : mapping ke volume asli yang kita buat dengan perintah `gcloud compute disks create` tadi.
* `gcePersistentDisk.fsType` : jenis filesystem

### Database Server ###

Konfigurasi database kita definisikan di file `dbserver.yml`. File ini terdiri dari 3 bagian:

* persistent volume claim : yaitu request untuk persistent volume dengan
* konfigurasi instance MySQL
* mengekspos instance MySQL menjadi service, agar bisa diakses oleh aplikasi web

Berikut konfigurasi persistent volume claim

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: belajar-ci-pv-claim-db
  labels:
    app: belajar-ci
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Penjelasannya:

* kind : adalah jenis konfigurasi. Dalam hal ini, kita membuat konfigurasi untuk PersistentVolumeClaim, yaitu permintaan terhadap persistent volume. Sekali sudah diberikan terhadap claim, maka volume tersebut tidak bisa lagi di-claim orang lain. Kecuali tipe volumenya `Read Write Many`.

* metadata : nama dan label supaya mudah diquery oleh selector dan pod
* spec.accessModes : volume ini kita mount dengan mode ReadWriteOnce, artinya hanya ada satu pod yang bisa menggunakannya (mount) dalam mode baca tulis (read write).
* spec.resources.request.storage : kapasitas yang dibutuhkan  Kubernetes akan melihat ketersediaan volume, dan memberikannya kepada yang meminta claim. Yang harus diperhatikan di sini, bisa saja volume berkapasitas 200GB diberikan pada yang meminta 20GB saja.

Selanjutnya, kita lihat konfigurasi MySQL Instance

```yml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: belajar-ci-db
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: belajar-ci
        tier: db
    spec:
      containers:
      - name: mysql
        image: mysql:latest
        args:
          - "--ignore-db-dir=lost+found"
        volumeMounts:
          - name: persistent-storage-db
            mountPath: /var/lib/mysql
        env:
          - name : MYSQL_RANDOM_ROOT_PASSWORD
            value: 'yes'
          - name: MYSQL_DATABASE
            value: 'belajar'
          - name: MYSQL_USER
            value: 'belajar'
          - name: MYSQL_PASSWORD
            value: 'java'
      volumes:
        - name: persistent-storage-db
          persistentVolumeClaim:
            claimName: belajar-ci-pv-claim-db
```

Penjelasannya :

* kind : Deployment. Ini adalah konfigurasi untuk jenis pod atau container instance.
* spec.replicas : jumlah instance yang diinginkan. Kita cukup menyebutkan mau berapa instance, dan kemudian Kubernetes akan membuatkannya dan mendistribusikannya di folder yang sesuai.
* spec.spec.containers : konfigurasi docker container. Kita akan gunakan docker image mysql:latest, memberikan persistent volume yang akan dimount ke folder /var/lib/mysql. Kita juga sediakan environment variable untuk mengatur nama database, username, dan password untuk digunakan di aplikasi kita.
* spec.volumes : konfigurasi untuk menggunakan PVC yang sudah kita deklarasi di atas.


Berikutnya adalah konfigurasi service, agar database kita bisa diakses dari aplikasi web

```yml
apiVersion: v1
kind: Service
metadata:
  name: belajar-ci-db-service
  labels:
    app: belajar-ci
spec:
  selector:
      app: belajar-ci
      tier: db
  ports:
  - port: 3306
```

Tidak ada yang istimewa di sini. Selain label, kita cuma mendeklarasikan bahwa port 3306 akan diakses oleh pod lain. Service ini bisa terarah ke pod database kita karena di selectornya disebutkan bahwa dia akan terhubung ke pod yang memiliki label `app=belajar-ci` dan `tier=db`

### Aplikasi Web ###

Secara struktur, konfigurasi aplikasi web tidak jauh berbeda. Hanya beda di image saja dan service agar bisa diakses dari internet. File konfigurasinya kita simpan di file `appserver.yml`.

Ini adalah konfigurasi PVCnya

```yml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: belajar-ci-pv-claim-app
  labels:
    app: belajar-ci
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

Sama seperti database, ini adalah request volume sebesar 10 GB. Tidak ada yang baru di sini, mari lanjut ke konfigurasi pod.

```yml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: belajar-ci-app
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: belajar-ci
        tier: web
    spec:
      containers:
      - name: belajar-ci
        image: endymuhardin/belajar-ci
        imagePullPolicy: Always
        volumeMounts:
          - name: persistent-storage-app
            mountPath: /var/lib/belajar-ci
        env:
          - name: SPRING_DATASOURCE_URL
            value: 'jdbc:mysql://belajar-ci-db-service/belajar'
          - name: UPLOAD_LOCATION
            value: /var/lib/belajar-ci
      volumes:
        - name: persistent-storage-app
          persistentVolumeClaim:
            claimName: belajar-ci-pv-claim-app
```

Kita bahas yang berbeda saja:

* spec.container.image : kita ambil dari image yang sudah kita push ke DockerHub.
* imagePullPolicy : karena aplikasi masih versi development, maka kita suruh kubernetes untuk selalu mengambil versi terbaru.
* SPRING_DATASOURCE_URL : hostname database kita arahkan ke nama service database. Urusan alamat IP nanti akan ditangani Kubernetes.

Sisanya sama, yaitu metadata dan setting volume.

Selanjutnya, konfigurasi Service supaya aplikasi web kita ini bisa diakses dari internet.

```yml
apiVersion: v1
kind: Service
metadata:
  name: belajar-ci-app-service
  labels:
    app: belajar-ci
spec:
  selector:
      app: belajar-ci
      tier: web
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
```

Pada konfigurasi di atas, kita membuat Service yang akan menghubungkan dunia luar dengan pod yang memiliki selector `app=belajar-ci` dan `tier=web`. Selector ini mengarah ke deployment aplikasi web kita. Di situ juga kita sebutkan bahwa port `80` dari luar akan diteruskan ke port `8080` di aplikasi web kita.

## Menjalankan Deployment ##

Ketiga file konfigurasi tadi kita satukan dalam satu folder yang bernama `k8s`. Nama foldernya sebetulnya bebas saja. Lalu kita jalankan dengan perintah berikut:

```
kubectl apply -f k8s
```

Berikut outputnya

```
service "belajar-ci-app-service" created
persistentvolumeclaim "belajar-ci-pv-claim-app" created
deployment "belajar-ci-app" created
service "belajar-ci-db-service" created
persistentvolumeclaim "belajar-ci-pv-claim-db" created
deployment "belajar-ci-db" created
persistentvolume "belajar-ci-pv-1" created
persistentvolume "belajar-ci-pv-2" created
```

Perintah di atas akan langsung selesai, walaupun sebenarnya kubernetes belum selesai menjalankan semua container dan services yang kita mau. Untuk melihat statusnya, jalankan perintah berikut

```
kubectl get deployment,pod,svc,endpoints,pvc -l app=belajar-ci
```

Perintah di atas menampilkan status untuk object `deployment`, `pod`, `service`, `endpoints`, dan `persistent volume claim` yang memiliki label `app=belajar-ci`. Pemasangan label ini akan kita bahas di bagian konfigurasi di bawah. Berikut adalah output dari perintah di atas

```
NAME                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/belajar-ci-app   1         1         1            0           5s
deploy/belajar-ci-db    1         1         1            0           2s

NAME                                 READY     STATUS    RESTARTS   AGE
po/belajar-ci-app-2571813143-c8l5l   0/1       Pending   0          5s
po/belajar-ci-db-588835421-3tv1m     0/1       Pending   0          2s

NAME                         CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
svc/belajar-ci-app-service   10.47.250.205   <pending>     80:30057/TCP   7s
svc/belajar-ci-db-service    10.47.253.28    <none>        3306/TCP       4s

NAME                        ENDPOINTS   AGE
ep/belajar-ci-app-service   <none>      7s
ep/belajar-ci-db-service    <none>      4s

NAME                          STATUS    VOLUME    CAPACITY   ACCESSMODES   STORAGECLASS   AGE
pvc/belajar-ci-pv-claim-app   Pending                                                     6s
pvc/belajar-ci-pv-claim-db    Pending                                                     3s
```

Kita bisa lihat bahwa statusnya masih pending semua. Coba jalankan lagi beberapa kali sampai statusnya berubah.

```
NAME                    DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
deploy/belajar-ci-app   1         1         1            1           18m
deploy/belajar-ci-db    1         1         1            1           18m

NAME                                 READY     STATUS    RESTARTS   AGE
po/belajar-ci-app-2571813143-c8l5l   1/1       Running   0          18m
po/belajar-ci-db-588835421-3tv1m     1/1       Running   0          18m

NAME                         CLUSTER-IP      EXTERNAL-IP       PORT(S)        AGE
svc/belajar-ci-app-service   10.47.252.194   104.155.193.131   80:30660/TCP   1m
svc/belajar-ci-db-service    10.47.253.28    <none>            3306/TCP       18m

NAME                        ENDPOINTS        AGE
ep/belajar-ci-app-service   10.44.0.3:8080   1m
ep/belajar-ci-db-service    10.44.2.4:3306   18m

NAME                          STATUS    VOLUME            CAPACITY   ACCESSMODES   STORAGECLASS   AGE
pvc/belajar-ci-pv-claim-app   Bound     belajar-ci-pv-2   10Gi       RWO                          18m
pvc/belajar-ci-pv-claim-db    Bound     belajar-ci-pv-1   10Gi       RWO                          18m
```

Kita bisa lihat bahwa kolom `EXTERNAL-IP` sudah terisi, tidak lagi `pending`. Artinya, kita sudah bisa mengakses aplikasi kita di IP tersebut. Coba arahkan ke `http://104.155.193.131/api/product/`, harusnya kita mendapatkan output data dari database seperti ini

```json
{
  "content" : [ {
    "id" : "p001",
    "code" : "P-001",
    "name" : "Product 001",
    "price" : 101001.01
  } ],
  "last" : true,
  "totalElements" : 1,
  "totalPages" : 1,
  "sort" : null,
  "first" : true,
  "numberOfElements" : 1,
  "size" : 20,
  "number" : 0
}
```

Untuk mengetes `persistent volume`, kita coba insert record baru ke aplikasi dengan mengirim HTTP request ke server dengan ketentuan:

* method : POST
* url : http://104.155.193.131/api/product/
* Content Type : application/json
* Request Body

	```json
	{
      "code" : "P-999",
      "name" : "Product 999",
      "price" : 909009.99
    }
	```

HTTP request bisa dikirim menggunakan aplikasi seperti Postman atau Rest Console.

Pastikan datanya masuk dengan mengakses lagi `http://104.155.193.131/api/product/` dari browser. Harusnya datanya sudah bertambah.

Data ini akan terus ada selama gcloud disk masih ada. Kita bisa menghapus semua aplikasi kita dengan perintah berikut

```
kubectl delete deployment,pod,svc,endpoints,pvc -l app=belajar-ci
```

Outputnya seperti ini

```
deployment "belajar-ci-app" deleted
deployment "belajar-ci-db" deleted
service "belajar-ci-app-service" deleted
service "belajar-ci-db-service" deleted
persistentvolumeclaim "belajar-ci-pv-claim" deleted
```

Hapus juga persistent volume dalam cluster.

```
kubectl delete pv belajar-ci-pv
```

Outputnya :

```
persistentvolume "belajar-ci-pv" deleted
```

Perintah tadi akan menghapus semua komponen aplikasi. Kita bahkan juga bisa menghapus clusternya sekalian

```
gcloud container clusters delete belajar-ci
```

Outputnya :

```
The following clusters will be deleted.
 - [belajar-ci] in [asia-east1-a]

Do you want to continue (Y/n)?  

Deleting cluster belajar-ci...done.

Deleted [https://container.googleapis.com/v1/projects/belajar-ci/zones/asia-east1-a/clusters/belajar-ci].
```

Walaupun clusternya sudah kita hapus, tapi disknya tetap ada. Coba kita cek

```
gcloud compute disks list
```

Outputnya

```
NAME                                       ZONE          SIZE_GB  TYPE         STATUS
belajar-ci-pv-1                            asia-east1-a  10       pd-standard  READY
belajar-ci-pv-2                            asia-east1-a  10       pd-standard  READY
```

Selama disk ini tidak kita hapus, data produk sebanyak 2 record tadi akan tetap ada. Bisa dibuktikan dengan mengulangi pembuatan cluster dan deployment aplikasi. Setelah mendapatkan `EXTERNAL-IP` (yang belum tentu sama dengan IP terdahulu), kita bisa akses aplikasinya dan mendapati ada 2 data produk di sana.


## Penutup ##

Demikianlah deployment aplikasi ke Google Container Engine (GKE) dengan menggunakan Kubernetes. Setelah kita bisa melakukannya secara manual, pada artikel berikutnya kita akan otomasi menggunakan proses Continuous Delivery.

Semoga bermanfaat, stay tuned...
