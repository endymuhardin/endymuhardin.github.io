---
layout: post
title: "Instalasi Gitlab CE di Google Cloud Engine"
date: 2017-04-20 07:00
comments: true
categories:
- devops
---

Jaman sekarang, version control system (VCS) sudah merupakan keharusan dalam proses pembuatan aplikasi. Tanpa VCS, kita tidak bisa bekerja dalam tim dengan baik. Bahkan kerja sendiri saja sulit untuk menerapkan release management yang baik tanpa VCS. Lagipula jaman sekarang VCS gratis. Kita tinggal daftar di [Gitlab](https://gitlab.com) dan bikin project sebanyak-banyaknya dan mengundang kolaborator se-Indonesia Raya tanpa dikenakan biaya sepeser pun.

Walaupun demikian, buat banyak perusahaan tetap merasa lebih nyaman kalau source codenya tidak dikelola pihak lain. Tidak masalah, karena Gitlab juga menyediakan aplikasinya untuk kita install di server sendiri, atau istilah kerennya `on premise`. Mari kita coba setup Gitlab Community Edition di Google Cloud Platform. Bahkan Gitlab sudah menyediakan fitur Continuous Integration yang sangat komprehensif.

Dalam rangkaian artikel ini, kita akan memasang Gitlab lengkap dengan Gitlab CI, Runner, lengkap dengan build cache dan docker registry sendiri seperti pada diagram berikut

[![Diagram Instalasi Gitlab Sekeluarga]({{site.url}}/images/uploads/2017/gitlab-family/gitlab-sekeluarga.png)]({{site.url}}/images/uploads/2017/gitlab-family/gitlab-sekeluarga.png)

<!--more-->

Pada artikel bagian pertama ini, kita akan menginstal Gitlab Community Edition yang berisi server untuk Git. Setup continuous integration akan kita bahas pada artikel berikutnya.

Ada beberapa langkah yang harus kita lakukan:

* [Membuat Project di Google Cloud Platform](#membuat-project)
* [Membuat server dengan Google Compute Engine (GCE)](#membuat-server)
* [Mendaftarkan IP public dengan nama domain](#custom-domain)
* [Menginstal Gitlab](#instalasi-gitlab)
* [Membuat sertifikat SSL](#sertifikat-ssl)


<a name="membuat-project"></a>
## Membuat Project di GCP ##

Langkah pertama kita adalah membuat project baru. Gitlab ini nantinya akan terdiri dari banyak node untuk Git server, Runner server, Executor, build cache, dan docker registry. Karena terdiri dari banyak node, maka sebaiknya kita install di project tersendiri.

Untuk bisa membuat project, kita harus sudah [mendaftar di Google Cloud Platform](https://cloud.google.com/) dan [menginstal Google Cloud SDK](https://cloud.google.com/sdk/). Kita tidak akan membahas pendaftaran dan instalasinya di sini.

Setelah mendaftar, lakukan login dengan perintah command line

```
gcloud auth login
```

Setelah itu, buat project baru

```
gcloud projects create gitlab-family
```

Outputnya seperti ini

```
Create in progress for [https://cloudresourcemanager.googleapis.com/v1/projects/gitlab-family].
Waiting for [operations/pc.6361857332348314590] to finish...done.
```

Kemudian pasang konfigurasi default untuk mengurangi ketikan di perintah selanjutnya

```
gcloud config set core/project gitlab-family
gcloud config set compute/region asia-southeast1
gcloud config set compute/zone asia-southeast1-a
```

Kita perlu mengaktifkan dulu Google Compute API di project kita supaya bisa membuat VPS. Kalau tidak diaktifkan, kita akan mendapat pesan error seperti ini pada saat akan membuat VPS.

```
ERROR: (gcloud.compute.instances.create) Could not fetch resource:
 - Access Not Configured. Compute Engine API has not been used in project 964256271847 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/compute_component/overview?project=964256271847 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.
```

Agar bisa mengaktifkan Compute API, kita harus mengijinkan Google menagih ke kartu kredit kita (`Enable Billing`). Kita bisa jalankan proses ini lewat web seperti ini

[![Enable Billing]({{site.url}}/images/uploads/2017/gitlab-family/enable-gcp-billing.png)]({{site.url}}/images/uploads/2017/gitlab-family/enable-gcp-billing.png)

atau lewat command line dengan perintah berikut

```
gcloud alpha billing accounts projects link gitlab-family --account-id=003X89-ABC977-123XYZ
```

Outputnya seperti ini

```
billingAccountName: billingAccounts/003X89-ABC977-123XYZ
billingEnabled: true
name: projects/gitlab-family/billingInfo
projectId: gitlab-family
```

Nilai `account-id` bisa didapatkan dengan perintah berikut

```
gcloud alpha billing accounts list
```

Outputnya seperti ini

```
ID                    NAME                OPEN
003X89-ABC977-123XYZ  My Billing Account  True
```


Selanjutnya, kita bisa mengaktifkan Compute Engine API. Berikut perintahnya

```
gcloud service-management enable compute-component.googleapis.com
```

Outputnya seperti ini

```
Waiting for async operation operations/projectSettings.6c411ce2-6e7e-490a-9fd4-8826d89b3b31 to complete...
Operation finished successfully. The following command can describe the Operation details:
 gcloud service-management operations describe operations/projectSettings.6c411ce2-6e7e-490a-9fd4-8826d89b3b31
```

Barulah kita bisa lanjut ke tahap selanjutnya, membuat VPS.

<a name="membuat-server"></a>
## Membuat Server di GCE ##

Berikutnya, kita buat satu VPS untuk menampung aplikasi Gitlab CE. Perintahnya adalah sebagai berikut

```
gcloud compute instances create gitlab-ce  --image-family ubuntu-1604-lts --image-project ubuntu-os-cloud
```

Berikut outputnya

```
Created [https://www.googleapis.com/compute/v1/projects/gitlab-family/zones/asia-southeast1-a/instances/gitlab-ce].
NAME       ZONE               MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP    STATUS
gitlab-ce  asia-southeast1-a  n1-standard-1               10.148.0.2   35.185.188.37  RUNNING
```

Secara default, kita akan dibuatkan VPS dengan spesifikasi `n1-standard-1`, yaitu 1 CPU dan 3.75GB memori. Untuk mengetahui jenis dan spesifikasi VPS, silahkan lihat [dokumentasinya](https://cloud.google.com/compute/docs/machine-types).

Kita bisa ssh ke mesin tersebut dengan menggunakan Google Cloud SDK

```
gcloud compute ssh gitlab-ce
```

Outputnya seperti ini

```
Updating project ssh metadata.../Updated [https://www.googleapis.com/compute/v1/projects/gitlab-family].                                        
Updating project ssh metadata...done.                                                                                                           
Warning: Permanently added 'compute.3943642946285722488' (ECDSA) to the list of known hosts.
Welcome to Ubuntu 16.04.2 LTS (GNU/Linux 4.8.0-45-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.


endymuhardin@gitlab-ce:~$
```

Nah kita sudah berada di dalam VPS tersebut.

<a name="custom-domain"></a>
## Mendaftarkan Nama Domain ##

Supaya lebih bonafit, kita berikan nama domain ke server kita ini dengan cara mendaftarkan alamat IPnya ke DNS server. Tapi sebelum dikonfigurasi di DNS server, kita booking dulu alamat IPnya supaya tidak berubah-ubah. Soalnya secara default VPS kita tadi memiliki IP public yang `ephemeral`, yaitu bisa berubah kapan saja.

Kita booking dulu alamat IP yang static

```
gcloud compute addresses create gitlab-ip
```

Outputnya seperti ini

```
For the following address name:
 - [gitlab-ip]
choose a region or global:
 [1] global
 [2] region: asia-east1
 [3] region: asia-northeast1
 [4] region: asia-southeast1
 [5] region: europe-west1
 [6] region: us-central1
 [7] region: us-east1
 [8] region: us-west1
Please enter your numeric choice:  1

Created [https://www.googleapis.com/compute/v1/projects/gitlab-family/global/addresses/gitlab-ip].
---
address: 35.185.188.31
creationTimestamp: '2017-04-20T00:58:23.717-07:00'
description: ''
id: '6502175881003652336'
kind: compute#address
name: gitlab-ip
selfLink: https://www.googleapis.com/compute/v1/projects/gitlab-family/global/addresses/gitlab-ip
status: RESERVED
```

Agar bisa dipasang, yang lama harus dihapus dulu. Mari kita lihat konfigurasi network yang sekarang aktif

```
gcloud compute instances describe gitlab-ce
```

Hasilnya panjang, kita potong saja bagian yang relevan

```
networkInterfaces:
- accessConfigs:
  - kind: compute#accessConfig
    name: external-nat
    natIP: 35.185.188.37
    type: ONE_TO_ONE_NAT
```

Kemudian, kita hapus dulu `accessConfig` tersebut

```
gcloud compute instances delete-access-config gitlab-ce --access-config-name external-nat
```

Hasilnya

```
Updated [https://www.googleapis.com/compute/v1/projects/gitlab-family/zones/asia-southeast1-a/instances/gitlab-ce].
```

Baru kita pasang IP address yang baru

```
gcloud compute instances add-access-config gitlab-ce --access-config-name external-nat --address 35.185.188.31
```

Outputnya seperti ini

```
Updated [https://www.googleapis.com/compute/v1/projects/gitlab-family/zones/asia-southeast1-a/instances/gitlab-ce]
```

Selanjutnya, kita daftarkan alamat IP tersebut ke DNS server kita

```
gitlab.artivisi.id.    IN    A    35.185.188.31
```

Kemudian test ping untuk memastikan setting DNSnya benar

```
ping gitlab.artivisi.id

PING gitlab.artivisi.id (35.185.188.31): 56 data bytes
64 bytes from 35.185.188.31: icmp_seq=0 ttl=57 time=137.929 ms
64 bytes from 35.185.188.31: icmp_seq=1 ttl=57 time=131.184 ms
64 bytes from 35.185.188.31: icmp_seq=2 ttl=57 time=131.666 ms
Request timeout for icmp_seq 3
^C
--- gitlab.artivisi.id ping statistics ---
5 packets transmitted, 3 packets received, 40.0% packet loss
round-trip min/avg/max/stddev = 131.184/133.593/137.929/3.072 ms
```

Selanjutnya, kita instal aplikasi Gitlab CE.

<a name="instalasi-gitlab"></a>
## Instalasi Gitlab ##

Login dulu ke servernya melalui SSH

```
gcloud compute ssh gitlab-ce
```

Lalu ikuti [panduan di website Gitlab](https://about.gitlab.com/downloads/#ubuntu1604). Kita tidak akan ulangi di sini karena cukup mudah diikuti.

Setelah selesai, jangan diakses dulu lewat browser, karena kita akan diminta memasukkan root password. Setup dulu SSLnya supaya password root kita bisa dientri dengan aman.

<a name="sertifikat-ssl"></a>
## Membuat Sertifikat SSL ##

Login dulu melalui SSH ke VPS kita

```
gcloud compute ssh gitlab-ce
```

Kemudian, install Lets Encrypt

```
sudo apt-get install letsencrypt -y
```

Buatkan folder agar letsencrypt bisa melakukan verifikasi nama domain.

```
sudo mkdir -p /var/www/letsencrypt
```

Kemudian konfigurasi Gitlab supaya membolehkan folder tersebut diakses dari luar. Tambahkan baris berikut di `/etc/gitlab/gitlab.rb`

```
nginx['custom_gitlab_server_config'] = "location ^~ /.well-known { root /var/www/letsencrypt; }"
```

Lalu restart Gitlab

```
sudo gitlab-ctl reconfigure
```

Kita juga perlu membuka akses ke port `80` dan `443` yang biasa digunakan webserver.

```
gcloud compute firewall-rules create allow-http --allow tcp:80
gcloud compute firewall-rules create allow-https --allow tcp:443
```

Sekarang kita bisa menyuruh Lets Encrypt untuk melakukan validasi domain

```
sudo letsencrypt certonly -a webroot -w /var/www/letsencrypt -d gitlab.artivisi.id
```

Kita akan dimintai alamat email untuk keperluan recovery. Masukkan alamat email kita. Lalu ikut langkah-langkahnya sampai selesai.

Supaya konfigurasi SSL kita lebih baik, tambahkan parameter Diffie Hellman

```
sudo openssl dhparam -out /etc/gitlab/ssl/dhparams.pem 4096
```

Outputnya seperti ini, kita harus bersabar menunggu dia selesai

```
Generating DH parameters, 4096 bit long safe prime, generator 2
This is going to take a long time
.................................................+............................................+.......+.........................................................................+.........................................................................................................................................................................++*++*
```

Setelah selesai, kita akan mengkonfigurasikan Gitlab agar membaca file sertifikat dan private key. Edit lagi `/etc/gitlab/gitlab.rb` dan masukkan baris berikut

```
external_url 'https://gitlab.artivisi.id'
nginx['redirect_http_to_https'] = true
nginx['ssl_certificate'] = "/etc/letsencrypt/live/gitlab.artivisi.id/fullchain.pem"
nginx['ssl_certificate_key'] = "/etc/letsencrypt/live/gitlab.artivisi.id/privkey.pem"
nginx['ssl_dhparam'] = "/etc/gitlab/ssl/dhparams.pem"
```

Lalu restart Gitlab sekali lagi.

```
sudo gitlab-ctl reconfigure
```

SSL kita sudah terpasang dengan baik. Kita bisa cek di [situs pemeriksaan SSL](https://www.ssllabs.com/ssltest/) untuk melihat berapa nilai konfigurasi kita.

[![Hasil SSL Test]({{site.url}}/images/uploads/2017/gitlab-family/hasil-ssl-test.png)]({{site.url}}/images/uploads/2017/gitlab-family/hasil-ssl-test.png)

Jangan lupa untuk memasang script auto-renewal. Masukkan baris berikut di crontab.

```
0 */12 * * * sleep $((RANDOM*3600/32768)) && /usr/bin/letsencrypt renew >> /var/log/le-renew.log
5 */12 * * * /usr/bin/gitlab-ctl restart nginx
```

Sekarang instalasi Gitlab kita sudah aman. Kita bisa coba akses ke `https://gitlab.artivisi.id` dan menyelesaikan setup password


[![Setup Password]({{site.url}}/images/uploads/2017/gitlab-family/setup-password.png)]({{site.url}}/images/uploads/2017/gitlab-family/setup-password.png)

Setelah itu, kita bisa login dan mulai berkarya :D

[![Setelah Login]({{site.url}}/images/uploads/2017/gitlab-family/setelah-login.png)]({{site.url}}/images/uploads/2017/gitlab-family/setelah-login.png)

## Penutup ##

Server Gitlab CE kita sudah beroperasi. Sekarang kita bisa membuat user, project, dan mulai menggunakan Git untuk version control. Pada artikel selanjutnya, kita akan [mengkonfigurasikan Gitlab Runner](http://software.endy.muhardin.com/devops/instalasi-gitlab-runner-autoscale/) supaya proses Continuous Delivery kita bisa dijalankan. Stay tuned ...

Semoga bermanfaat
