---
layout: post
title: "VPN dengan Wireguard Bagian I : Pengenalan Wireguard"
date: 2020-12-25 07:00
comments: true
categories:
- devops
---

Sejak belasan tahun yang lalu, saya sudah [merekomendasikan pentingnya menguasai konsep dan konfigurasi jaringan](https://software.endy.muhardin.com/life/pengetahuan-wajib-buat-programmer/), khususnya administrasi jaringan dan server dengan Linux. Di penghujung 2020 ini, rekomendasi tersebut terasa lebih relevan seiring dengan semakin naik daunnya budaya DevOps. 

Untuk itu, kita akan menutup tahun 2020 ini dengan membahas implementasi VPN yang sekarang sedang naik daun, yaitu [WireGuard](https://www.wireguard.com/). WireGuard adalah aplikasi VPN yang sangat mudah digunakan. Jauh lebih sederhana daripada pendahulunya seperti OpenVPN dan IPSec. Selain itu, performanya juga jauh melampaui para pendahulunya tersebut. Bahkan Linus Torvalds sendiri memuji kode program dan kesederhanaan WireGuard, padahal Linus biasanya terkenal tajam lidahnya. 

Informasi lebih rinci mengenai keunggulan Wireguard dapat dibaca di [artikel ini](https://itsfoss.com/wireguard/), [artikel ini](https://arstechnica.com/gadgets/2018/08/wireguard-vpn-review-fast-connections-amaze-but-windows-support-needs-to-happen/), dan [artikel ini](https://www.ivpn.net/pptp-vs-ipsec-ikev2-vs-openvpn-vs-wireguard/). Tapi tidak ada yang sempurna di dunia ini, Wireguard juga memiliki beberapa masalah dalam urusan privasi, seperti dibahas di [artikel ini](https://restoreprivacy.com/vpn/wireguard/). Walaupun demikian, untuk keperluan yang akan kita bahas di sini, privasi tidak terlalu menjadi pertimbangan kita, karena di hampir seluruh skenario yang akan kita bahas komputer dan jaringan yang terlibat adalah milik kita sendiri.

Dalam rangkaian artikel kali ini, kita akan membahas beberapa skenario penggunaan VPN yang umum digunakan oleh masyarakat umum dan juga software developer, yaitu:

* Membuat proxy internet
* Mengakses jaringan internal kantor dari luar kantor
* Membuka akses ke aplikasi yang berjalan di laptop untuk diakses dari internet
* Menghubungkan aplikasi yang berjalan di cloud services ke database yang berjalan di data center on premise

> Disclaimer : rangkaian artikel ini mengasumsikan pembaca sudah menguasai dasar-dasar jaringan komputer dan pengoperasian Linux dengan command line/terminal.

Sebelum masuk ke konfigurasi yang kompleks, terlebih dulu kita akan mempelajari konsep dasar dari aplikasi Wireguard. Kita akan berlatih menghubungkan dua atau beberapa host dengan Wireguard. Untuk latihan ini, kita bisa menggunakan dua laptop, satu laptop dan satu VPS di cloud, ataupun satu laptop dan satu smartphone.

Skemanya dapat digambarkan sebagai berikut

[![VPN Peers]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-intro-wireguard.jpg)]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-intro-wireguard.jpg)

<!--more-->

* TOC
{:toc}

## Konsep Dasar Wireguard - Peer vs Client-Server ##

Agak berbeda dengan konsep VPN yang biasa kita kenal di OpenVPN, IPSec, dan produk VPN lainnya, WireGuard sebetulnya tidak mengenal konsep server dan client. Di produk lain biasanya kita akan menginstal VPN server yang berisi semua konfigurasi client, kemudian kita instal konfigurasi di masing-masing perangkat yang ingin ikut bergabung dalam VPN sebagai client. Setelah itu, kita jalankan aplikasi VPN client di masing-masing perangkat, dan kemudian dia akan berusaha menghubungi VPN server untuk ikut bergabung dalam jaringan.

Dalam WireGuard, semua perangkat yang terhubung dianggap setara (peer). Kalaupun ada yang dianggap sebagai server, itu biasanya hanya karena perangkat tersebut memiliki IP public yang static. Sehingga bisa dihubungi dengan alamat yang jelas. Tidak seperti perangkat kita yang menggunakan internet rumah atau paket data. Belum tentu punya IP public dan kalaupun ada, bisa berganti setiap kali reconnect.

Di produk lain seperti OpenVPN dan lainnya, sebetulnya pada dasarnya juga menggunakan skema peer to peer. Tapi karena ada satu perangkat yang dipasangi banyak tambahan aksesoris lain seperti DHCP server, DNS server, routing, authentication service, dan sebagainya, maka dia dinobatkan menjadi server.

WireGuard hanya menyediakan fungsi dasar untuk menyediakan perangkat jaringan (ethernet card virtual) dan layanan enkripsi dari komputer satu ke komputer lain. Dia tidak menyediakan DHCP service, DNS service, routing, dan sebagainya. Masing-masing perangkat yang ingin bergabung harus memilih dan memasang alamat IP sendiri. WireGuard hanya menyediakan hook untuk menjalankan perintah lain ketika dia dinyalakan (PostUp) dan dimatikan (PostDown). Kalau kita ingin mengatur routing dan forwarding, maka kita taruh perintahnya di `PostUp` dan `PostDown`. WireGuard hanya membantu menjalankan saja.

Fitur yang sedikit ini menyebabkan setup dan penggunaan WireGuard menjadi sangat sederhana. Akan tetapi, ini menyebabkan administrator jaringan harus kerja sedikit ekstra untuk membuatkan konfigurasi secara manual. Tapi tidak masalah, karena banyak kontributor di internet yang membuatkan script untuk membantu konfigurasi. Contohnya project [easy-wg-quick](https://github.com/burghardt/easy-wg-quick) yang memudahkan kita untuk menambahkan peer. Dan kalaupun kita ingin membuatkan aplikasi untuk pengelolaan jaringan, tidak akan terlalu sulit. Cukup kita sediakan UI, database, kemampuan generate konfigurasi berupa text file, dan kemampuan untuk merestart WireGuard.

Perbedaan lain yang cukup mendasar antara WireGuard dan OpenVPN adalah di penggunaan encryption key. OpenVPN menggunakan Public Key Infrastructure dimana tiap pihak harus membuat pasangan public key dan private key. Public keynya kemudian harus di-sign oleh pemilik sertifikat induk (Certificate Authority). Sedangkan WireGuard cukup dengan pasangan public key dan private key yang dipasang secara bersilang. Public key A didaftarkan di komputer B, dan sebaliknya public key B dipasang di komputer A.

## Instalasi Wireguard di Ubuntu ##

Seperti biasa, instalasi di Ubuntu sangat mudah. Cukup satu baris perintah saja.

```
# apt update && apt install wireguard -y
```

Setelah terinstal, kita bisa menggunakan perintah `wg` di terminal. Kita mulai dengan perintah untuk membuat pasangan private key dan public key.

* Membuat private key

    ```
    $ wg genkey
    oNkc7Mz0Zn0GQLuHPhkRsvrnaOL5FANvnRbTsw7dtnY=
    ```

* Membuat private key, menulis ke file dengan perintah `tee`, dan menampilkan hasilnya

    ```
    $ wg genkey | tee private.key
    iKNKroX3g8XXKh9hxaETERYVsnuedJaifog9OHctCFQ=

    $ ls -l | grep private
    -rw-r--r--   1 endymuhardin  staff    45 Dec 25 10:47 private.key
    ```

* Membuat private key, menulis ke file, kemudian menampilkan public key pasangannya

    ```
    $ wg genkey | tee private.key | wg pubkey
    jeRlN4f55GgOVl481Ncla/n28ZWTLkGN3Hu2zIAaWyM=

    $ cat private.key
    sD11f3UX7DfoiVegO6VGCE5/mehYFfmQno0ZlBG3Wmg=
    ```

* Membuat private key, menulis private key ke file, membuat public key pasangannya, menulis public key ke file, dan menampilkan public key

    ```
    $ wg genkey | tee private.key | wg pubkey | tee public.key
    ZsYN7IFaSpfQLblrTGzivcF8tiVqLIna8AUueZOfvFo=

    $ ls -l | grep key
    -rw-r--r--   1 endymuhardin  staff    45 Dec 25 10:51 private.key
    -rw-r--r--   1 endymuhardin  staff    45 Dec 25 10:51 public.key
    ```

Private key dan public key ini nantinya akan kita gunakan untuk menghubungkan komputer satu dan komputer lain. Kita akan membuat interface baru yang nantinya akan menjadi pintu keluar masuk data yang terenkripsi. Di Linux, biasanya interface ini berawal dengan `wg`, misalnya `wg0` dan `wg1`.

Perintah-perintah berikut ini dijalankan dengan user `root`.

* Melihat interface yang sudah ada

    ```
    # ip link
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
    link/ether 02:89:8b:a6:39:ce brd ff:ff:ff:ff:ff:ff
    ```

* Menambah interface wireguard

    ```
    # ip link add dev wg0 type wireguard
    # ip link
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
        link/ether 02:89:8b:a6:39:ce brd ff:ff:ff:ff:ff:ff
    4: wg0: <POINTOPOINT,NOARP> mtu 1420 qdisc noop state DOWN mode DEFAULT group default qlen 1000
        link/none
    ```

* Menghapus interface wireguard

    ```
    # ip link del dev wg0
    ```

* Melihat alamat IP di masing-masing interface

    ```
    # ip address
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc fq_codel state UP group default qlen 1000
    link/ether 02:89:8b:a6:39:ce brd ff:ff:ff:ff:ff:ff
    inet 172.26.3.231/20 brd 172.26.15.255 scope global dynamic eth0
       valid_lft 3048sec preferred_lft 3048sec
    inet6 fe80::89:8bff:fea6:39ce/64 scope link 
       valid_lft forever preferred_lft forever
    4: wg0: <POINTOPOINT,NOARP> mtu 1420 qdisc noop state DOWN group default qlen 1000
    link/none 
    ```

* Memberikan alamat IP ke interface `wg0`

    ```
    # ip address add dev wg0 10.100.10.22/24
    # ip address
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 9001 qdisc fq_codel state UP group default qlen 1000
    link/ether 02:89:8b:a6:39:ce brd ff:ff:ff:ff:ff:ff
    inet 172.26.3.231/20 brd 172.26.15.255 scope global dynamic eth0
       valid_lft 3048sec preferred_lft 3048sec
    inet6 fe80::89:8bff:fea6:39ce/64 scope link 
       valid_lft forever preferred_lft forever
    4: wg0: <POINTOPOINT,NOARP> mtu 1420 qdisc noop state DOWN group default qlen 1000
    link/none
    inet 10.100.10.22/24 scope global wg1
       valid_lft forever preferred_lft forever
    ```

* Memasang private key ke interface `wg0` dan port `51515` untuk menunggu koneksi dari peer. Pasangan key dibuat dengan perintah yang sudah dijelaskan di atas. Port yang digunakan bebas. Saya seringkali menggunakan port `80`, `443`, dan port-port yang sering digunakan, karena port selain itu diblokir oleh Indihome. Untuk contoh di sini, kita akan pakai port `51515` saja supaya tidak rancu dengan layanan http.

    ```
    # wg set wg0 listen-port 51515 private-key ./private.key
    ```

* Mengaktifkan interface `wg0`

    ```
   # ip link set wg1 up 
    ```

* Menampilkan informasi WireGuard untuk interface `wg0`

    ```
    # wg
    interface: wg1
    public key: TTJoZNk8JMHWDK4BfnjZdjf0pO9g25oYdXHmuUJqeno=
    private key: (hidden)
    listening port: 51515
    ```

* Menampilkan konfigurasi dalam format yang bisa disimpan ke file

    ```
    # wg showconf
    [Interface]
    ListenPort = 51515
    PrivateKey = gG0hpGeTRpZjSqXfW8s88kNAIF7zKIPSqYfXLASH6UY=
    ```

* Menyimpan konfigurasi ke file, supaya bisa dijalankan otomatis pada waktu booting

    ```
    # wg showconf wg0 > /etc/wireguard/wg0.conf
    ```

* Mengaktifkan interface `wg0` pada waktu booting

    ```
    # systemctl enable wg-quick@wg0
    ```

File konfigurasi di atas belum memuat alamat IP dari interface `wg0`, sehingga bila dinyalakan pada waktu booting, dia tidak akan memiliki alamat IP. Untuk itu, kita perlu tambahkan lagi alamat IPnya.

```
[Interface]
PrivateKey = gG0hpGeTRpZjSqXfW8s88kNAIF7zKIPSqYfXLASH6UY=
Address = 10.100.10.22/24
ListenPort = 51515
```

## Instalasi Wireguard di MacOS ##

MacOS memiliki aplikasi desktop untuk WireGuard. Aplikasi ini bahkan diinstal melalui AppStore, menunjukkan bahwa pembuatnya cukup serius bukan hanya membuat aplikasinya, tapi mengurus birokrasi yang diperlukan agar bisa disetujui masuk AppStore.

Akan tetapi, tampilannya tidak terlalu jauh beda dengan konfigurasi melalui command line. Penambahan interface dilakukan dengan cara mengetik file konfigurasi seperti ini.

[![MacOS Wireguard]({{site.url}}/images/uploads/2020/vpn-wireguard/macos-wireguard.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/macos-wireguard.png)

Kita bisa tambahkan konfigurasi alamat IP pada tampilan tersebut, sehingga menjadi seperti ini

```
[Interface]
PrivateKey = 0Dz3pDjd5eRmze+ila1hdF+S2S0RRT42qnt2tHG5hFk=
Address = 10.100.10.100/24
```

Kita tidak perlu memasang konfigurasi `ListenPort` karena laptop biasanya ada di belakang router rumah. Alamat IPnya tidak public, sehingga tidak akan bisa diakses dari luar juga.

Selain menggunakan aplikasi desktop, kita juga bisa menggunakan versi command line. Instalasinya menggunakan `brew` sebagai berikut

```
brew install wireguard-tools
```

Untuk mengaktifkan interface tersebut, kita bisa menggunakan tampilan desktop

[![MacOS Wireguard Active]({{site.url}}/images/uploads/2020/vpn-wireguard/macos-wireguard-active.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/macos-wireguard-active.png)

atau command line

```
wg-quick up /path/ke/konfigurasi-wireguard.conf
```

Setelah interface aktif, kita bisa mengecek dengan perintah `ifconfig`

Outputnya seperti ini

```
# ifconfig
lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384
	options=1203<RXCSUM,TXCSUM,TXSTATUS,SW_TIMESTAMP>
	inet 127.0.0.1 netmask 0xff000000 
	inet6 ::1 prefixlen 128 
	inet6 fe80::1%lo0 prefixlen 64 scopeid 0x1 
	nd6 options=201<PERFORMNUD,DAD>
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	options=400<CHANNEL_IO>
	ether f4:0f:24:2d:5a:6a 
	inet6 fe80::c45:9e4f:9b8a:3dd6%en0 prefixlen 64 secured scopeid 0x4 
	inet 192.168.100.4 netmask 0xffffff00 broadcast 192.168.100.255
	nd6 options=201<PERFORMNUD,DAD>
	media: autoselect
	status: active
utun4: flags=8051<UP,POINTOPOINT,RUNNING,MULTICAST> mtu 1420
	options=6463<RXCSUM,TXCSUM,TSO4,TSO6,CHANNEL_IO,PARTIAL_CSUM,ZEROINVERT_CSUM>
	inet 10.100.10.100 --> 10.100.10.100 netmask 0xffffff00
```

Di MacOS biasanya WireGuard aktif dengan nama device `utun4`.

## Aplikasi Android ##

Di Android juga sama, kita bisa menginstal aplikasi Wireguard yang ada di Play Store. Setelah itu kita bisa menambahkan konfigurasi secara manual seperti ini

[![Konfigurasi Wireguard Android]({{site.url}}/images/uploads/2020/vpn-wireguard/android-wireguard-config.jpg)]({{site.url}}/images/uploads/2020/vpn-wireguard/android-wireguard-config.jpg)

Atau mengambil konfigurasi berbasis teks seperti yang sudah kita buat di Ubuntu atau MacOS, dan membuatkan QR Code yang mudah discan. Perintah untuk membuat dan menampilkan QR code adalah sebagai berikut

```
cat konfigurasi.conf | qrencode -t ansiutf8 
```

atau kita juga bisa membuat file `png` untuk dikirim kepada pengguna, dengan perintah berikut

```
cat konfigurasi.conf | qrencode -o $CLIENT.png
```

Bila ingin membuat konfigurasi untuk banyak user, biasanya saya menggunakan rangkaian perintah sebagai berikut:

```
mkdir -p /etc/wireguard/clients; cd /etc/wireguard/clients;
export VPNUSER=namaclient
wg genkey | tee $VPNUSER.key | wg pubkey | tee $VPNUSER.pub

vim $VPNUSER.conf
[Interface]
PrivateKey = oPd+N/9pAa3uCvCPGOKcWJowa8YO9ulGVHUWz0zABnQ=
Address = 172.17.0.101/24

[Peer]
PublicKey = FQcUiIzvvvQ2hHplCsUgR+RN4avDWi/ucF57LTvq11k=
Endpoint = vpngateway.id:51515
AllowedIPs = 0.0.0.0/0

cat $VPNUSER.conf | qrencode -t ansiutf8 
cat $VPNUSER.conf | qrencode -o $VPNUSER.png
```

Jangan lupa mengganti isi variabel `VPNUSER`, alamat endpoint peer, public key, dan private key sesuai kebutuhan.

## Konfigurasi Peer ##

Sekarang kita sudah memiliki mesin Ubuntu, MacOS, smartphone Android, dan iPhone yang telah terpasang interface WireGuard. Semua perangkat ini ada di jaringan internal rumah kita, tergabung dalam satu jaringan wifi yang sama. Sebagai ilustrasi, kita misalkan masing-masing perangkat mendapat alamat IP dari router wifi kita sebagai berikut:

* Laptop Ubuntu : 192.168.100.101
* Laptop Mac : 192.168.100.102
* Smartphone Android : 192.168.100.103
* iPhone : 192.168.100.104

Selanjutnya kita bisa menghubungkan semua host tersebut dengan menambahkan konfigurasi `Peer`. Kita daftarkan public key dari masing-masing perangkat di perangkat yang lain. Contohnya seperti ini:

* Di laptop Ubuntu

    ```
    [Interface]
    PrivateKey = gG0hpGeTRpZjSqXfW8s88kNAIF7zKIPSqYfXLASH6UY=
    Address = 10.100.10.101/24
    ListenPort = 51515

    # Public Key Laptop Mac
    [Peer]
    PublicKey = X8qWb9P8xRZurOiH5p6PxAyLjNjBaYWLmBs38sijQAE=
    AllowedIPs = 10.100.10.102/32

    # Public Key Android
    [Peer]
    PublicKey = FQcUiIzvvvQ2hHplCsUgR+RN4avDWi/ucF57LTvq11k=
    AllowedIPs = 10.100.10.103/32

    # Public Key iPhone
    [Peer]
    PublicKey = bGalHOzArxIoTFDVz0fMcidw6k01Vlk3Zo5ancGjIlg=
    AllowedIPs = 10.100.10.104/32
    ```

* Di laptop Mac

    ```
    [Interface]
    PrivateKey = GNZuFAzGpn3Ht7Bm6PYxMFoztI7xwZL77zyoAcSwvWc=
    Address = 10.100.10.102/24
    ListenPort = 51515

    # Public Key Laptop Ubuntu
    [Peer]
    PublicKey = kNzxJEnlglygOYn5GcUEuA8Uqc/QUBzmQ+eledLVVWg=
    AllowedIPs = 10.100.10.101/32

    # Public Key Android
    [Peer]
    PublicKey = FQcUiIzvvvQ2hHplCsUgR+RN4avDWi/ucF57LTvq11k=
    AllowedIPs = 10.100.10.103/32

    # Public Key iPhone
    [Peer]
    PublicKey = bGalHOzArxIoTFDVz0fMcidw6k01Vlk3Zo5ancGjIlg=
    AllowedIPs = 10.100.10.104/32
    ```

Dan seterusnya sama untuk smartphone Android dan juga iPhone. Setelah kita buatkan konfigurasinya, kita bisa generate QR code untuk discan di masing-masing smartphone.

Pada konfigurasi di atas, kita mengisi nilai `AllowedIPs` dengan alamat IP untuk masing-masing perangkat, sesuai yang kita definisikan pada blok konfigurasi `[Interface]`. Kita menggunakan subnet `/32` yang artinya hanya mengacu pada satu alamat IP saja. Nantinya, kita bisa mengisi `AllowedIPs` dengan alamat network seperti misalnya `192.168.10.0/24`, untuk membuat aturan routing yang mengarahkan semua paket bertujuan subnet `192.168.10.0/24` ke `Peer` yang sesuai. Skenario ini akan kita bahas lebih detail pada artikel selanjutnya.

## Pengetesan ##

Setelah kita mengkonfigurasi `[Interface]` dan `[Peer]` di masing-masing perangkat, kita bisa menguji konfigurasinya dengan mudah. Cukup lakukan ping ke alamat IP yang kita buat di konfigurasi WireGuard. Contohnya, bila kita di laptop MacOs, maka coba ping ke IP Ubuntu di `10.100.10.101`. Dan sebaliknya bila kita ada di laptop Ubuntu, coba ping ke laptop MacOs di `10.100.10.102`. 

Untuk mengetes konfigurasi di perangkat Android, kita bisa menjalankan aplikasi web sederhana di laptop, kemudian mencoba browse ke aplikasi web tersebut. Misalnya, kita jalankan aplikasi web di laptop Ubuntu, kemudian browse ke `http://10.100.10.101` dari Android atau iPhone. 

Demikianlah penjelasan awal mengenai VPN dengan WireGuard. Stay tuned ....
Artikel berikutnya akan membahas penggunaan VPN untuk membuat internet proxy.

Semoga bermanfaat ... 