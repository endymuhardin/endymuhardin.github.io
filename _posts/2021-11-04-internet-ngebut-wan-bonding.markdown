---
layout: post
title: "Internet Ngebut dengan WAN Bonding"
date: 2021-11-04 08:05
comments: true
categories: 
- networking
---

Sebagai orang IT, kita selalu dipanggil apabila ada hal-hal yang berkaitan dengan komputer. Baik itu printer, proyektor, apalagi internet. Ditambah lagi di jaman ini, meeting online sudah menjadi kebutuhan dasar di semua institusi. Apabila terjadi gangguan internet, maka kita orang IT adalah yang paling pertama dipanggil. 

Sejak sebelum jaman Zoom/GMeet/dsb, saya sebetulnya sudah sering juga menangani live streaming event. Salah satu artikel di blog ini [membahas tentang cara melakukan live streaming berbarengan ke banyak platform sekaligus](% post_url 2018-11-12-live-stream-nginx-rtmp %). Ada videonya juga, yang bisa ditonton di sini

<iframe width="560" height="315" src="https://www.youtube.com/embed/Rgs67PA6EsQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Salah satu masalah yang kita alami pada waktu melakukan live streaming, apalagi di lokasi event, adalah ketersediaan internet. Kita belum tentu dapat akses internet gedung yang biasanya menggunakan fiber optik dan kabel, stabil dan kencang. Biasanya kita mengandalkan koneksi modem wifi (mifi) yang menggunakan koneksi seluler. Beberapa rekan bahkan membeli wajan mikrotik untuk memperkuat sinyal. 

Walaupun demikian, kita tetap mengalami kepanikan apabila provider seluler yang kita gunakan ternyata sedang gangguan. Mau pakai wajan selebar apapun, kalau providernya sedang bermasalah, ya tentu tidak akan menolong.

Selain itu, kondisi sinyal di lokasi kita tidak bisa pastikan. Ada lokasi yang Telkomsel berjaya, XL tiarap. Tapi di lokasi lain, justru XL ngebut, Indosat ngesot. Jadi kita harus gonta-ganti simcard sesuai yang sinyal yang bagus.

Jadi, akhirnya saya mencari cara untuk menggabungkan beberapa provider seluler sehingga tidak terlalu manual gonta-ganti modem dan simcard.

Setelah menjelajah dunia maya bertahun-tahun -- sebetulnya saya mulai kepikiran masalah ini sejak awal live streaming di tahun 2019 dulu -- akhirnya saya menemukan solusi yang sesuai dengan keinginan saya.

<video loop autoplay muted>
    <source src="/images/uploads/2021/wan-bonding/speedtest.mp4" type="video/mp4">
</video>

<!--more-->

<hr/>

## Berbagai Metode Multi WAN ##

Yang akan kita buat ini disebut dengan istilah Multi WAN, artinya multiple wide area network. Yaitu menggunakan beberapa koneksi internet (WAN) sekaligus. Misalnya kita gunakan 3 provider : Telkomsel, Indosat, XL. Ada beberapa cara atau skema untuk menggabungkan 3 provider ini, yaitu :

* Failover
* Load Balancing
* Bonding

Dengan mekanisme failover, kita memilih salah satu koneksi yang paling bagus kualitasnya (bandwidth dan latency) dan itulah yang kita gunakan untuk berinternet. Dua koneksi lain standby tidak digunakan selama koneksi utama lancar jaya. Ketika koneksi utama bermasalah, maka perangkat router akan otomatis pindah ke koneksi cadangan. Tanpa kita harus gonta ganti simcard, cabut colok modem, ataupun sekedar ganti WiFi.

[![Skema Failover]({{site.url}}/images/uploads/2021/wan-bonding/skema-failover.png)]({{site.url}}/images/uploads/2021/wan-bonding/skema-failover.png)

Mekanisme failover ini memang bisa untuk mengatasi koneksi yang bermasalah di tengah acara. Akan tetapi relatif mubazir, karena ada 2 koneksi lain yang hanya nganggur standby saja. Oleh karenanya, orang mencari alternatif yang lebih baik, yaitu load balancing.

Dengan load balancing, router kita lebih pintar. Dia akan melihat setiap alamat website yang dituju, kemudian memilihkan provider yang sedikit bebannya. Keterbatasan dari load balancing ini adalah, sekali dia sudah mengarahkan koneksi melalui provider tertentu, maka semua request ke tujuan tersebut akan selalu diarahkan melalui provider tersebut. Misalnya, kita live streaming ke Youtube. Pada waktu koneksi pertama, router akan memilihkan provider untuk menuju Youtube, misalnya dia memilihkan XL. Maka semua request ke Youtube dari komputer kita, akan selalu dilewatkan melalui XL. Bila kita buka website lain, misalnya Instagram, barulah dipilihkan jalur lain, misalnya Indosat. 

[![Skema Load Balancing]({{site.url}}/images/uploads/2021/wan-bonding/skema-load-balance.png)]({{site.url}}/images/uploads/2021/wan-bonding/skema-load-balance.png)

Oleh karena itu, metode ini walaupun cocok buat rumahan atau kantoran, dimana banyak orang mengakses ke banyak website, tapi kurang cocok buat live streaming. Pada live streaming, kita hanya kirim data ke sedikit tujuan, misal ke Youtube saja, atau Youtube dan Facebook. Biasanya maksimal tiga tujuan : Youtube Live, Facebook Live, dan Instagram Live. Jadi koneksinya tidak bisa pindah-pindah provider. Misal di tengah jalan tiba-tiba koneksi Telkomsel drop, dia tidak bisa langsung pindah ke Indosat.

Sebetulnya tujuannya bagus, supaya si website tujuan tidak heran melihat satu user pindah-pindah asal requestnya. Terutama di website yang memeriksa asal usul request seperti internet banking. Bila request login datang dari Telkomsel, request cek saldo datang dari Indosat, request transfer datang dari XL, maka dia akan menganggap ini adalah request mencurigakan. Bisa-bisa akun kita diblokir untuk mencegah fraud. Supaya website tujuan tidak bingung, maka router mencatat tujuan setiap request dilewatkan provider mana. Dan request berikutnya akan dilewatkan melalui provider yang sama.

Berikut beberapa referensi untuk melakukan load balancing:

* [Tutorial Load Balancing di OpenWRT](https://blog.kopijahe.my.id/posts/openwrt-mwan3/)
* [LoadBalance 4 ISP di TPLink MR3420](https://www.youtube.com/watch?v=WABqrwXULlk)

Selanjutnya, kita akan membahas metode ketiga, yaitu bonding. Mekanisme bonding ini memungkinkan kita menggunakan semua provider secara merata, tanpa membingungkan website tujuan karena gonta-ganti provider. Cara kerjanya adalah kita memasang satu gateway di internet untuk berfungsi sebagai pintu keluar. Skemanya bisa digambarkan seperti ini

[![Skema Bonding]({{site.url}}/images/uploads/2021/wan-bonding/skema-bonding.png)]({{site.url}}/images/uploads/2021/wan-bonding/skema-bonding.png)

Pada gambar di atas, kita memiliki satu VPS yang kita sewa di cloud untuk menggabungkan semua paket data dari semua provider. Setelah digabungkan, barulah request diteruskan ke website tujuan. Dengan demikian, website tujuan melihat semua request datang dari asal yang sama, yaitu dari VPS. Setupnya memang lebih sulit daripada metode failover dan load balancing, karena kita harus setup dua titik, yaitu router dan VPS. Dengan metode failover dan load balancing, kita cukup setup router saja. Dengan bonding ini, kita harus setup router untuk mendistribusikan ke semua provider, kemudian harus setup VPS untuk menggabungkan lagi paket data dari semua provider tersebut.

Ada beberapa metode untuk membuat bonding, yaitu:

* VPN
* Multipath TCP

Untuk metode VPN, bisa dicari tutorialnya dengan keyword `openvpn bonding`. Banyak tutorial di internet mengenai topik ini, baik berupa tulisan maupun video. Salah satunya tutorial OneMarcFifty ini

<iframe width="560" height="315" src="https://www.youtube.com/embed/I08A4-PWawk" title="OpenVPN Bonding" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Kita tidak membahas metode VPN ini, karena setupnya terlalu sulit. Saya mencari sesuatu yang bisa dirakit dan dibongkar dalam waktu cepat. Maksimal 2 jam untuk setup.

Nah, kemudian saya menemukan video tutorial OneMarcFifty yang membahas OpenMPTCPRouter. Berikut videonya

<iframe width="560" height="315" src="https://www.youtube.com/embed/mYYoIDCWszo" title="Setup OpenMPTCPRouter" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Dan [artikel yang membahas langkah-langkah implementasinya](https://milankragujevic.com/openmptcprouter-true-bonding-of-2-wan-connections-for-cheap).

### Komponen WAN Bonding dengan Multipath TCP ###

Kunci sukses dari metode bonding ini adalah pemilihan VPS yang menjadi pintu keluar semua request. Ada beberapa kriteria untuk memilih VPS:

* kompatibel dengan kernel multipath tcp
* koneksi ke VPS tersebut bagus dari lokasi kita
* koneksi dari VPS ke internet bagus

Dengan pertimbangan tersebut, saya tidak menggunakan DigitalOcean yang biasanya saya pakai. VPS DO hanya ada di Singapura. Dan koneksi ke sana konon sering dihambat oleh provider lokal. Akhirnya saya pakai Google Cloud Platform (GCP) saja, yang sudah ada cabang Jakarta. VPS terkecil yang tersedia, tarifnya $0.01 per jam. Kita bisa setup VPSnya beberapa jam sebelum dipakai, kemudian dihapus lagi setelah selesai.

Selain GCP, kita bisa coba juga provider VPS yang lain seperti Exabytes, IDCloudHost, dan sebagainya. Tapi pada artikel ini, kita contohkan menggunakan GCP. Provider lain harusnya sama saja.

Selain VPS, kita juga harus menyiapkan :

* Perangkat router yang sudah dilengkapi gigabit ethernet port. Saya pakai Raspberry Pi 4. Sebetulnya pakai versi 3 juga bisa, tapi harus ditambah USB Lan yang sudah gigabit.
* Beberapa modem dengan berbagai provider. Pakai provider yang sama bisa juga, tapi resikonya kalau provider tersebut pingsan, maka koneksi kita langsung pingsan semua. Saya pakai 2 modem orbit max dan 1 modem orbit pro. Modem orbit ini bisa diisi kartu sim dari provider lain, tidak hanya telkomsel.
* Gigabit Switch. Saya menggunakan TP-Link LS108G.

Selanjutnya, kita akan mulai setup dari kiri ke kanan, sesuai skema berikut.

[![Skema OpenMPTCPRouter]({{site.url}}/images/uploads/2021/wan-bonding/skema-openmptcprouter.png)]({{site.url}}/images/uploads/2021/wan-bonding/skema-openmptcprouter.png)

Tampilan fisiknya setelah dirakit seperti ini

[![Physical Setup]({{site.url}}/images/uploads/2021/wan-bonding/physical-setup.jpg)]({{site.url}}/images/uploads/2021/wan-bonding/physical-setup.jpg)

Keren kan? Mirip Triple Rashomon-nya Orochimaru 😅

[![Orochimaru Rashomon]({{site.url}}/images/uploads/2021/wan-bonding/orochimaru-sanju-rashomon.gif)]({{site.url}}/images/uploads/2021/wan-bonding/orochimaru-sanju-rashomon.gif)

> Warning : bagian berikutnya sangat teknis. 
> Butuh skill Linux Network Administration untuk memahami dan menjalankannya.

## Setup VPS ##

Berikut adalah langkah-langkah untuk mempersiapkan VPS di GCP:

1. Membuat Project
2. Membuat VPS
3. Setting Firewall
4. Install paket-paket OpenMPTCP
5. Mendapatkan informasi konfigurasi

### Membuat Project Google Cloud Platform ###

Project GCP bisa dibuat di [Google Cloud Console](https://console.cloud.google.com). Kita klik tombol Create Project, dan kita isikan nama projectnya.

[![Create Project]({{site.url}}/images/uploads/2021/wan-bonding/gcp-01-create-project.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-01-create-project.png)

Klik Create Project, dan kemudian kita akan mendapatkan notifikasi bahwa projectnya sudah dibuat.

[![Create Project]({{site.url}}/images/uploads/2021/wan-bonding/gcp-02-project-created.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-02-project-created.png)

Selanjutnya, kita klik Compute Engine > VM Instances untuk melihat daftar VPS dalam project. 

[![Create Instance]({{site.url}}/images/uploads/2021/wan-bonding/gcp-03-create-instance.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-03-create-instance.png)

Di project baru, biasanya Compute Engine belum aktif, sehingga harus kita `Enable` dulu.

[![Enable Compute Engine]({{site.url}}/images/uploads/2021/wan-bonding/gcp-04-enable-compute.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-04-enable-compute.png)

Di sini kita harus mengatur metode pembayaran dulu bila belum ada. Kebetulan saya sudah pernah memasukkan informasi kartu kredit, sehingga di tahap ini bisa langsung lanjut. 

Kita akan melihat daftar yang masih kosong, karena memang kita belum membuat VPS apa-apa.

[![Daftar VPS]({{site.url}}/images/uploads/2021/wan-bonding/gcp-05-instance-list.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-05-instance-list.png)

### Membuat VPS ###

Kita klik Create Instance, dan kita akan disajikan halaman input informasi VPS yang akan dibuat. Masukkan nama VPS, dan jangan lupa untuk memilih lokasi data center `Jakarta`.

[![New VPS]({{site.url}}/images/uploads/2021/wan-bonding/gcp-06-new-instance.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-06-new-instance.png)

Untuk ukuran VPS, kita bisa pilih yang paling kecil saja, yaitu `e2-micro`. Spesifikasinya sudah memadai untuk sekedar menjadi VPS aggregator. Untuk VPS dengan spesifikasi ini, kita harus membayar $0.01 per jam.

[![VPS Price]({{site.url}}/images/uploads/2021/wan-bonding/gcp-08-vps-price.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-08-vps-price.png)

Selanjutnya gulung ke bawah, dan pilih Ubuntu versi 20.04 LTS

[![Ubuntu Image]({{site.url}}/images/uploads/2021/wan-bonding/gcp-07-select-image.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-07-select-image.png)

Setelah itu, kita bisa langsung saja Create Instance. Dan hasilnya akan terlihat di Instance List

[![Instance Created]({{site.url}}/images/uploads/2021/wan-bonding/gcp-09-instance-created.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-09-instance-created.png)

Buat kaum yang tidak pakai GUI, berikut perintah command line untuk membuat VPS dengan konfigurasi di atas.

```
gcloud compute instances create vps-mptcp \ 
--project=mptcp-gateway \ 
--zone=asia-southeast2-a \  
--machine-type=e2-micro \ 
--network-interface=network-tier=PREMIUM,subnet=default \ 
--maintenance-policy=MIGRATE \ 
--service-account=724546327782-compute@developer.gserviceaccount.com \ 
--scopes=https://www.googleapis.com/auth/devstorage.read_only,https://www.googleapis.com/auth/logging.write,https://www.googleapis.com/auth/monitoring.write,https://www.googleapis.com/auth/servicecontrol,https://www.googleapis.com/auth/service.management.readonly,https://www.googleapis.com/auth/trace.append \ 
--create-disk=auto-delete=yes,boot=yes,device-name=vps-mptcp,image=projects/ubuntu-os-cloud/global/images/ubuntu-2004-focal-v20211102,mode=rw,size=10,type=projects/mptcp-gateway/zones/asia-southeast2-a/diskTypes/pd-balanced \ 
--no-shielded-secure-boot --shielded-vtpm --shielded-integrity-monitoring \ 
--reservation-affinity=any
```

### Setting Firewall ###

Secara bawaannya (default), GCP menutup semua port. Kita harus membuka port-port yang kita butuhkan satu persatu. Untuk menyederhanakan artikel ini, kita akan buka semua port. Silahkan nanti diulik lagi sendiri bila ingin lebih teliti buka satu persatu yang dibutuhkan saja.

Masuk ke menu Firewall. Kita akan diperlihatkan daftar rule yang berlaku.

[![Firewall Rule List]({{site.url}}/images/uploads/2021/wan-bonding/gcp-10-firewall-rules.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-10-firewall-rules.png)

Berikut adalah nilai-nilai yang kita isikan. Buat yang sudah paham jaringan, harusnya tidak asing dengan isian ini.

[![Firewall Rule Input]({{site.url}}/images/uploads/2021/wan-bonding/gcp-11-firewall-create-rule-1.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-11-firewall-create-rule-1.png)

Intinya adalah kita akan membuka semua port untuk protokol TCP dan UDP.

[![Firewall Rule Input]({{site.url}}/images/uploads/2021/wan-bonding/gcp-12-firewall-create-rule-2.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-12-firewall-create-rule-2.png)

Berikut perintah command line untuk yang tidak suka klik klik

```
gcloud compute --project=mptcp-gateway \
firewall-rules create \
allow-all-tcp-udp --description="Semua koneksi ke semua port dengan protokol TCP dan UDP diijinkan" \
--direction=INGRESS --priority=1000 --network=default \
--action=ALLOW --rules=all --source-ranges=0.0.0.0/0
```

Hasilnya, kita dapat melihat rule yang barusan dibuat berada di paling atas.

[![Firewall Rule Input]({{site.url}}/images/uploads/2021/wan-bonding/gcp-13-rule-created.png)]({{site.url}}/images/uploads/2021/wan-bonding/gcp-13-rule-created.png)

### Mengakses VPS melalui SSH ###

Untuk mengakses VPS, terlebih dulu kita harus masuk ke projectnya. Tampilkan dulu daftar project kita di GCP melalui command line dengan perintah `gcloud`. Bila belum menginstallnya, petunjuk setup bisa dibaca di [website resminya](https://cloud.google.com/sdk/docs/install)

```
gcloud projects list
```

Outputnya seperti ini

```
PROJECT_ID         NAME               PROJECT_NUMBER
belajar-gmail-api  belajar-gmail-api  514337769807
belajar-sso-endy   belajar-sso        266648357609
mptcp-gateway      mptcp-gateway      724546327782
```

Kemudian kita set project kita ke `mptcp-gateway` sesuai yang telah kita buat pada langkah sebelumnya.

```
gcloud config set project mptcp-gateway
```

Outputnya begini

```
Updated property [core/project].
```

Sekarang kita bisa lihat instances yang ada di project ini

```
gcloud compute instances list
```

VPS yang sudah kita buat tadi akan terlihat

```
NAME       ZONE               MACHINE_TYPE  PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP     STATUS
vps-mptcp  asia-southeast2-a  e2-micro                   10.184.0.2   34.101.134.130  RUNNING
```

Kemudian kita bisa mencoba login SSH menggunakan `gcloud`

```
gcloud compute ssh vps-mptcp
```

Kita akan diminta untuk membuat SSH keypair baru, tidak menggunakan SSH key yang sudah ada. Kalau mau menggunakan yang sudah ada bisa juga, silahkan baca dokumentasinya [di sini](https://cloud.google.com/compute/docs/connect/add-ssh-keys)

Outputnya seperti ini

```
WARNING: The private SSH key file for gcloud does not exist.
WARNING: The public SSH key file for gcloud does not exist.
WARNING: You do not have an SSH key for gcloud.
WARNING: SSH keygen will be executed to generate a key.
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/endymuhardin/.ssh/google_compute_engine
Your public key has been saved in /Users/endymuhardin/.ssh/google_compute_engine.pub
The key fingerprint is:
SHA256:nMpVUz8OPWO+QcjpzLY1Cn2vzp89I7juSBz19n1kldg endymuhardin@Endys-MacBook-Pro.local
The key's randomart image is:
+---[RSA 3072]----+
|            .    |
|           o =o .|
|          o.=.OE.|
|       . o.*.* +.|
|        S.. *oB o|
|     . o. .o.=.B.|
|      o  o  + ..+|
|        . .. o ++|
|         .o+..=o=|
+----[SHA256]-----+
Updating project ssh metadata...⠶Updated [https://www.googleapis.com/compute/v1/projects/mptcp-gateway].                                                                   
Updating project ssh metadata...done.                                                                                                                                      
Waiting for SSH key to propagate.
Warning: Permanently added 'compute.6453105502643430895' (ED25519) to the list of known hosts.
Welcome to Ubuntu 20.04.3 LTS (GNU/Linux 5.11.0-1021-gcp x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Thu Nov  4 09:02:51 UTC 2021

  System load:  0.0               Processes:             104
  Usage of /:   17.2% of 9.52GB   Users logged in:       0
  Memory usage: 20%               IPv4 address for ens4: 10.184.0.2
  Swap usage:   0%


1 update can be applied immediately.
To see these additional updates run: apt list --upgradable


endymuhardin@vps-mptcp:~$ 
```

Nah kita sudah berhasil login ke dalam VPS tersebut. Selanjutnya seperti prosedur standar instalasi VPS, kita update dulu paket-paket yang terinstal.

```
sudo apt update && sudo apt upgrade -y
```

Outputnya tidak saya tampilkan karena banyak sekali.

### Install paket-paket OpenMPTCP ###

Instalasi paket OpenMPTCP memakan waktu cukup lama, karena banyak aplikasi yang dia setup. Oleh karena itu, kita jalankan perintahnya di dalam `tmux` atau `screen` sehingga kita bisa logout dan tidak perlu menunggu selesai. Script instalasi berjalan dengan user `root`, jadi kita perlu untuk menjalankan `sudo -i` dulu. Setelah menjadi root, jalankan perintah berikut:

```
wget -O - https://www.openmptcprouter.com/server/ubuntu20.04-x86_64.sh | sh
```

Saya juga mencoba instalasi paket OpenMPTCPRouter di [IDCloudHost](https://idcloudhost.com), dan ternyata ada langkah tambahan yang perlu kita lakukan sebelum menjalankan perintah di atas, yaitu:

```
systemctl unmask systemd-networkd.service
systemctl unmask systemd-networkd.socket
systemctl unmask systemd-networkd-wait-online.service 
systemctl enable systemd-networkd.socket
systemctl enable systemd-networkd.service
systemctl enable systemd-networkd-wait-online.service 
systemctl start systemd-networkd.service
```

Perkiraan waktu instalasi antara 15 - 30 menit. Tidak perlu ditunggu. Kita bisa keluar dari `tmux` dengan menekan `Ctrl-b d` untuk detach. Tampilan setelah detach seperti ini

```
endymuhardin@vps-mptcp:~$ tmux
[detached (from session 0)]
```

Kemudian kita bisa logout dari VPS dengan mengetik perintah `exit`. Berikut outputnya

```
logout
Connection to 34.101.134.130 closed.
```

Bila ingin mengecek hasilnya, kita bisa ssh lagi ke VPS tersebut dengan perintah yang sama, yaitu

```
gcloud compute ssh vps-mptcp
```

Bila kita terlalu lama meninggalkan VPS, bisa jadi proses instalasi sudah selesai dan port SSH sudah pindah ke port `65222`. Kalau terjadi seperti ini, kita bisa login langsung tanpa menggunakan `gcloud` dengan perintah berikut

```
ssh -p 65222 -i ~/.ssh/google_compute_engine 34.101.134.130
```

Setelah masuk, kita masuk lagi ke sesi `tmux` dengan perintah `tmux attach`.

### Mendapatkan informasi konfigurasi ###

Bila proses instalasi berjalan dengan sukses, maka akan ada file `/root/openmptcprouter_config.txt`. Isinya seperti ini

```
SSH port: 65222 (instead of port 22)
Shadowsocks port: 65101
Shadowsocks encryption: chacha20
Your shadowsocks key: nxl0i6Q/o8j8TCyRERs5vKY0NjRXAmSkp1P9bQEdYPk=
Glorytun port: 65001
Glorytun encryption: chacha20
Your glorytun key: 45B05B2C4F12A1547D6F073E7DF45A6CD8853D714C2C1D58A4AB86072FABA735
A Dead Simple VPN port: 65401
A Dead Simple VPN key: CD0FA520746E641A8FE5A898AF7F587B999774CC5396E4F5936106DE75917B65
MLVPN first port: 65201'
Your MLVPN password: e9xnMWBYwxduaFxHEPx/iteR1xT0HsnIMzQXBZGT3/Q=
Your OpenMPTCProuter ADMIN API Server key (only for configuration via API access, you don't need it): 988C52062A2C4FEB327F18C0FD39CF8A1577231178FFD0FAF4B5D03FBC87A5EB
Your OpenMPTCProuter Server key: AE5EC8866B17B9D2CEB7C6CC516EB53702E85AF1827B398A13499DC511D09A93
Your OpenMPTCProuter Server username: openmptcprouter
```

Yang kita perlukan hanya dua hal, yaitu baris ini

```
Your OpenMPTCProuter Server key: AE5EC8866B17B9D2CEB7C6CC516EB53702E85AF1827B398A13499DC511D09A93
```

dan alamat IP VPSnya, di contoh ini adalah `34.101.134.130`

Server key dan alamat IP ini akan kita pasang di router Raspberry Pi kita.

Terakhir, kita restart VPSnya supaya aplikasi-aplikasi yang diinstal script tadi menjadi aktif.

```
sudo reboot
```

## Setup Modem ##

Ada dua hal yang perlu kita setting di modem ataupun koneksi internet lain dari provider, yaitu:

* DHCP server
* network address

Secara logika, sebetulnya koneksi antara modem dan provider dengan router modelnya seperti ini

[![Skema Bonding]({{site.url}}/images/uploads/2021/wan-bonding/skema-bonding.png)]({{site.url}}/images/uploads/2021/wan-bonding/skema-bonding.png)

Tapi secara fisik, Ada dua pilihan koneksi antara ISP kita dengan router. Yang pertama gambarnya seperti ini:

[![1 ethernet per ISP]({{site.url}}/images/uploads/2021/wan-bonding/skema-openmptcprouter1.png)]({{site.url}}/images/uploads/2021/wan-bonding/skema-openmptcprouter1.png)

Tiap koneksi provider kita sediakan ethernet card masing-masing di router. Bila kita pakai Raspberry Pi yang cuma punya satu ethernet card, kita perlu menambah dua lagi menggunakan USB Ethernet Card seperti ini

[![TP-Link UE300]({{site.url}}/images/uploads/2021/wan-bonding/tplink-UE300.jpg)]({{site.url}}/images/uploads/2021/wan-bonding/tplink-UE300.jpg)

Gambarnya diambil dari [website resmi TP-Link](https://www.tp-link.com/id/home-networking/computer-accessory/ue300/)

Harganya 200 ribuan satu.

Tapi bila kita mau irit, kita bisa menggunakan port ethernet bawaan Raspberry Pi yang cuma satu. Di Linux, satu ethernet card bisa dipasang banyak alamat IP. Gambarnya seperti ini

[![1 ethernet semua ISP]({{site.url}}/images/uploads/2021/wan-bonding/skema-openmptcprouter.png)]({{site.url}}/images/uploads/2021/wan-bonding/skema-openmptcprouter.png)

Syaratnya, kita harus mematikan fungsi DHCP di semua modem/provider. Sebabnya, semua koneksi akan terhubung ke satu switch yang sama, sehingga broadcast addressnya sama. Bila masing-masing modem/provider mengaktifkan DHCP server, maka akan tabrakan dan menjadi tidak jelas nanti alamatnya apa. Apalagi bila PC/Laptop yang ingin berinternet juga terhubung ke switch yang sama. Bisa-bisa PC/Laptop tersebut langsung terkoneksi ke salah satu modem, tidak melalui router.

Setelah kita matikan fungsi DHCP server di modem, kita juga harus membedakan segmen alamat IP di tiap modem. Karena saya menggunakan modem orbit semua, maka settingan pabrikannya juga sama. Alamat IPnya adalah `192.168.8.1` di semua modem. Jadi kita perlu ganti menjadi :

* Modem A : `192.168.11.1`
* Modem B : `192.168.12.1`
* Modem C : `192.168.13.1`

Dalam artikel ini, saya akan menggunakan skema 1 ethernet card untuk semua ISP. 
Sehingga ethernet card Raspberry Pi kita berikan 3 alamat tambahan sebagai berikut:

* eth0:1 : `192.168.11.10`
* eth0:2 : `192.168.12.10`
* eth0:3 : `192.168.13.10`

## Setup Router ##

Ada banyak pilihan perangkat router yang bisa digunakan. Kita tinggal pilih yang sudah disediakan [di website OpenMPTCPRouter](https://www.openmptcprouter.com/download). Bisa pakai Raspberry Pi, bisa juga pakai PC kecil seperti Intel NUC. Saya pakai Raspberry Pi 4 dan 3.

Setelah kita unduh filenya, kita bisa tulis ke memory card yang akan kita pasang di RasPi. Bisa menggunakan [aplikasi Balena Etcher](https://www.balena.io/etcher/) atau bisa melalui command line. Saya lebih suka command line, karena lebih cepat. Berikut perintahnya di MacOS atau Linux

```
sudo dd if=openmptcprouter-v0.58.5-r0+16336-b36068d35d-bcm27xx-bcm2711-rpi-4-ext4-factory of=/dev/rdisk4 bs=4m
```

Perhatikan isian `of=/dev/rdisk4` dengan teliti. Awas jangan salah nomor disk, bisa-bisa partisi data Anda yang terformat.

Setelah selesai, pasang memori card di RasPi, kemudian nyalakan. Hubungkan ke laptop dengan kabel jaringan. Kemudian kita bisa browse ke `http://192.168.100.1` untuk mengakses routernya.

Masuk ke pengaturan System > OpenMPTCPRouter kemudian masukkan isian berikut:

* Setting VPS

    * Server Address : alamat VPS kita. `34.101.134.130`
    * Server Key : key dari konfigurasi server. `AE5EC8866B17B9D2CEB7C6CC516EB53702E85AF1827B398A13499DC511D09A93`

    [![Router VPS Setting]({{site.url}}/images/uploads/2021/wan-bonding/router-vps.png)]({{site.url}}/images/uploads/2021/wan-bonding/router-vps.png)

* WAN1

    * Perangkat yang digunakan : `eth0`
    * Type : `MacVLAN` (karena satu `eth0` digunakan banyak alamat IP)
    * IPv4 address : `192.168.11.10`
    * IPv4 gateway : `192.168.11.1`
    * Setting lainnya dibiarkan saja seperti defaultnya

    [![Router WAN1 Setting]({{site.url}}/images/uploads/2021/wan-bonding/router-wan1.png)]({{site.url}}/images/uploads/2021/wan-bonding/router-wan1.png)

* WAN2

    * Perangkat yang digunakan : `eth0`
    * Type : `MacVLAN`
    * IPv4 address : `192.168.12.10`
    * IPv4 gateway : `192.168.12.1`
    * Setting lainnya dibiarkan saja seperti defaultnya

    [![Router WAN2 Setting]({{site.url}}/images/uploads/2021/wan-bonding/router-wan2.png)]({{site.url}}/images/uploads/2021/wan-bonding/router-wan2.png)

* WiFi Rumah/Kantor (bila ada)

    * Perangkat yang digunakan : `wlan0`
    * Tipe device : `Normal` (karena satu `wlan0` hanya digunakan untuk satu alamat IP)
    * Protocol : `DHCP` bila alamat IP diberikan otomatis, `Manual` bila mau setting sendiri

    [![Router WiFi Setting]({{site.url}}/images/uploads/2021/wan-bonding/router-wifi.png)]({{site.url}}/images/uploads/2021/wan-bonding/router-wifi.png)

Dari 3 WAN yang kita gunakan, pilih satu yang paling stabil, dan jadikan dia `Master`. Sisanya kita bisa set menjadi `Enabled`.

Jangan lupa untuk mengatur password router, karena by default passwordnya kosong.

Setelah semua selesai, kita bisa cek status koneksinya seperti ini

[![2 Modem Aktif]({{site.url}}/images/uploads/2021/wan-bonding/openmptcp-2-modem-only.png)]({{site.url}}/images/uploads/2021/wan-bonding/openmptcp-2-modem-only.png)

Modem yang tidak aktif akan tampil dengan warna merah.

Hasil pengetesan saya, dengan VPS di GCP harusnya semua koneksi bisa hijau. 

[![All Green]({{site.url}}/images/uploads/2021/wan-bonding/openmptcp-all-green.png)]({{site.url}}/images/uploads/2021/wan-bonding/openmptcp-all-green.png)

Kalau ada yang kuning, dengan pesan error MPTCP tidak didukung ISP, kita bisa coba restart modemnya. 

Biasanya setelah reconnect, dia akan hijau. 

## Test Koneksi per Modem ##

Agar kita ada perbandingan before dan after, kita bisa tes kecepatan masing-masing modem. Caranya mudah. Cukup ganti alamat IP laptop kita menjadi satu network dengan salah satu modem. Misalnya kita mau mengetes modem A yang alamatnya `192.168.11.1`. Ganti alamat IP laptop kita menjadi `192.168.11.100` dan arahkan gatewaynya ke `192.168.11.1`. 

[![Setting IP Manual]({{site.url}}/images/uploads/2021/wan-bonding/setting-ip-manual.png)]({{site.url}}/images/uploads/2021/wan-bonding/setting-ip-manual.png)

Kemudian jalankan speed test. 

[![Speed Test 1 Provider]({{site.url}}/images/uploads/2021/wan-bonding/01-speedtest-xl-orbit-max.png)]({{site.url}}/images/uploads/2021/01-speedtest-xl-orbit-max.png)

Kita bisa lakukan ini secara bergantian untuk masing-masing modem. Dengan demikian kita ada gambaran mengenai kecepatan masing-masing modem.

## Test Koneksi Gabungan ##

Setelah tahu kecepatan masing-masing provider, kita bisa tes kecepatan gabungan. Kembalikan setting IP menjadi otomatis, sehingga laptop kita mendapatkan IP dari router. 

[![Setting IP Otomatis]({{site.url}}/images/uploads/2021/wan-bonding/setting-ip-otomatis.png)]({{site.url}}/images/uploads/2021/wan-bonding/setting-ip-otomatis.png)

Kemudian jalankan lagi speedtest.

[![Speed Test 1 Provider]({{site.url}}/images/uploads/2021/wan-bonding/04-speedtest-openmptcp.png)]({{site.url}}/images/uploads/2021/04-speedtest-openmptcp.png)

Video speed test bisa kita lihat di sini

<iframe width="560" height="315" src="https://www.youtube.com/embed/YdH-1l8CB_Q" title="Speed Test" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Demikianlah sedikit sharing tentang cara bonding WAN. Mudah-mudahan bermanfaat.