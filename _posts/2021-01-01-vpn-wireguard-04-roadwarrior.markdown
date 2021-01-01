---
layout: post
title: "VPN dengan Wireguard Bagian I : Road Warrior"
date: 2021-01-01 07:00
comments: true
categories:
- devops
---

Penggunaan VPN yang kita bahas pada artikel kali ini biasa disebut dengan _skenario Road Warrior_ di berbagai artikel di internet. Definisinya bisa dilihat sendiri [di wikipedia](https://en.wikipedia.org/wiki/Road_warrior_(computing))

Pada intinya, _Road Warrior_ adalah pekerja yang bekerja di luar kantor (banyak tugas luar misalnya) dan butuh akses terhadap perangkat di dalam jaringan kantor, seperti database server, printer, aplikasi internal, shared file/folder, dan sebagainya.

Di awal tahun 2021 ini, banyak kebutuhan di atas (share file, printer, aplikasi) yang sudah tidak relevan lagi di era komputasi awan sekarang ini. File sharing bisa dilakukan dengan mudah dengan layanan Dropbox, Google Drive, dan lainnya. Bahkan kita bisa berkirim file melalui chat. Printer juga bisa dihubungkan dengan layanan Google Cloud Print, sehingga kita bisa menggunakan printer kita dari mana saja. Aplikasi bisnis kebanyakan sekarang sudah berbasis web dan dihosting di internet, sehingga bisa diakses dari mana saja. Walaupun demikian, kadangkala kita tetap butuh, sehingga saya tuliskan sekalian di sini cara konfigurasinya.
<!--more-->

* TOC
{:toc}

## Berbagai varian topologi Road Warrior ##

Sebetulnya konfigurasi VPN road warrior ini sangat bervariasi, tergantung topologi jaringan kantor yang bersangkutan. Akan tetapi pada umumnya, ada tiga jenis topologi yang sering digunakan.

Pertama, kantor yang mengelola sendiri internet connection sharingnya. Biasanya kantor seperti ini berlangganan internet broadband, mendapatkan IP public yang static, dan memiliki internet router yang disetting dan dikonfigurasi sendiri sehingga lebih bebas dalam mengatur jaringannya. Salah satu merek yang sering digunakan di sini antara lain adalah Mikrotik. Atau banyak juga yang memilih solusi DIY (do it yourself) dan merakit router dengan distro *nix khusus router seperti IPFire, OpenWrt, pfSense, dan sebagainya. Skema road warrior untuk kantor seperti ini digambarkan sebagai berikut.

[![VPN Road Warrior]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-roadwarrior.jpg)]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-roadwarrior.jpg)

Di belakang router internet, biasanya cuma ada satu LAN yang berisi beberapa komputer, printer, scanner, dan perangkat lainnya yang terhubung ke satu subnet. Dengan topologi ini, kita cukup memasang VPN gateway di router internet. Para pekerja remote kemudian langsung connect ke VPN yang ada di router internet tersebut dengan  menggunakan IP public si router.

Skema kedua adalah kantor yang lebih kompleks. Biasanya kantor seperti ini memiliki beberapa server yang digunakan di internal, seperti database server, DNS server/proxy, server aplikasi internal, dan sejenisnya. Server ini diakses oleh user yang berada di dalam kantor. Server-server ini biasanya ditaruh di subnet tersendiri yang disebut dengan istilah [DMZ (Demiliterized Zone)](https://en.wikipedia.org/wiki/DMZ_(computing)). Stafnya juga bisa terdiri dari banyak divisi, dan masing-masingnya tergabung dalam subnet sendiri. Skema seperti ini pernah saya warisi dari senior yang resign pada waktu bekerja di BaliCamp pada periode 2005-2008.

Untuk kasus ini, kita perlu membuat VPN host lagi di jaringan dalam seperti ini

[![VPN Road Warrior DMZ]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-roadwarrior-double-dmz.jpg)]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-roadwarrior-double-dmz.jpg)

Road warrior terhubung ke VPN gateway di router luar yang punya public IP, dan di jaringan dalam ada VPN gateway lagi yang juga terhubung ke VPN gateway di router luar. Setelah ketiga perangkat (road warrior, VPN luar, VPN dalam) terhubung, road warrior bisa mengakses perangkat di jaringan dalam.

Ketiga, adalah topologi rumah atau kantor kecil yang berlangganan paket internet retail (bukan korporat). Paket internet retail ini biasanya tidak diberikan IP public yang static. IP public routernya (kalaupun ada) berganti-ganti setiap kali reconnect. Oleh karena itu, kita tidak bisa memasang VPN gateway di routernya. Lagipula biasanya pengguna rumahan hanya diberikan router low end yang tidak memiliki kemampuan VPN. Topologi VPN untuk skenario ketiga ini bisa digambarkan sebagai berikut

[![VPN Road Warrior SOHO]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-roadwarrior-soho.jpg)]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-roadwarrior-soho.jpg)

Karena kita tidak bisa menjadikan routernya sebagai VPN gateway, maka kita butuh satu mesin di internet yang berfungsi sebagai gateway. Kita bisa menyewa VPS murah meriah dari berbagai provider di internet seperti AWS Lightsail, Digital Ocean Droplet, Scaleway, Linode, dan sebagainya. Harganya berkisar $2 - $10 per bulan.

Kita akan bahas skenario yang ketiga ini. Skenario kedua sebetulnya mirip-mirip, cuma beda lokasi VPN gateway external saja. Yang di skenario kedua ada di router sendiri, sedangkan di skenario ketiga ada di datacenter cloud service provider. Walaupun demikian, konfigurasinya sama persis

## Konfigurasi VPN Gateway dengan IP Public ##

Pertama, kita akan siapkan dulu konfigurasi VPN gateway di internet. Konfigurasinya sebagai berikut.

```
[Interface]
Address = 10.100.10.11/24
ListenPort = 51515
PrivateKey = YDN0Mxg5cLgGcfmviPPFUBbv0fYD/by4/Vld4vH/9UI=

[Peer] # VPN Gateway di Internal Subnet
PublicKey = bGalHOzArxIoTFDVz0fMcidw6k01Vlk3Zo5ancGjIlg=
AllowedIPs = 10.100.10.33/32, 192.168.0.0/24

[Peer] # Remote Worker
PublicKey = Qzq14DnLcF6IX6BCT5/dRckR9LUEAXk4LrWMR/6k0i0=
AllowedIPs = 10.100.10.22/32
```

Blok `[Interface]` sama seperti artikel terdahulu, cukup pasang private key, alamat IP dalam VPN, dan port untuk menerima koneksi.

Konfigurasi peer terdiri dari satu peer di jaringan internal kantor, dan satu peer untuk masing-masing remote worker. Bila remote worker/road warrior ada 10 orang, maka kita harus siapkan 10 blok `[Peer]` juga.

Yang penting untuk diperhatikan adalah konfigurasi `AllowedIPs` di `[Peer]` VPN internal. Di sini kita harus menambahkan subnet jaringan internal kantor, yaitu `192.168.0.0/24` agar Wireguard bisa mengarahkan paket data yang menuju printer di kantor (IP: `192.168.0.10`) ke `Peer` yang sesuai.

Selanjutnya, kita bahas dulu konfigurasi VPN gateway di internal kantor.

## Instalasi WireGuard di Raspberry PI ##

Kita membutuhkan mesin Linux yang bisa kita instalkan Wireguard. Salah satu solusi murah meriah praktis adalah Raspberry Pi. Kita bisa mendapatkannya di toko online dengan kisaran harga beberapa ratus ribu rupiah saja. Jauh lebih efisien daripada harus menyediakan PC khusus. Ukurannya juga sangat kecil, sehingga tidak boros tempat. Bisa ditenagai dengan charger handphone, hemat energi.

Pada saat artikel ini ditulis, distro Debian untuk Raspberry, yaitu Raspbian, belum memiliki paket instalasi Wireguard. Oleh karena itu kita harus compile sendiri. Berikut rangkaian perintahnya: 

```
sudo -i
apt install raspberrypi-kernel-headers libelf-dev libmnl-dev build-essential git
git clone https://git.zx2c4.com/wireguard-linux-compat
git clone https://git.zx2c4.com/wireguard-tools
make -C wireguard-linux-compat/src -j$(nproc)
make -C wireguard-linux-compat/src install
make -C wireguard-tools/src -j$(nproc)
make -C wireguard-tools/src install
perl -pi -e 's/#{1,}?net.ipv4.ip_forward ?= ?(0|1)/net.ipv4.ip_forward = 1/g' /etc/sysctl.conf
reboot
```

Tes instalasi dengan mengetikkan perintah `wg --version` dan `wg-quick`. Outputnya seperti ini

```
$ wg --version
wireguard-tools v1.0.20200827-8-g66ed611 - https://git.zx2c4.com/wireguard-tools/

$ wg-quick
Usage: wg-quick [ up | down | save | strip ] [ CONFIG_FILE | INTERFACE ]
```

## Konfigurasi VPN Gateway di Subnet Internal ##

Konfigurasi untuk VPN gateway di internal kantor/rumah seperti ini

```
[Interface]
PrivateKey = qAAqQgz1+Y+CbALmMSvr0QEhbrze5zcHiTw8LJRTZnM=
Address = 10.100.10.33/24

[Peer]
PublicKey = FQcUiIzvvvQ2hHplCsUgR+RN4avDWi/ucF57LTvq11k=
AllowedIPs = 10.100.10.0/24
Endpoint = 180.244.234.226:51515
PersistentKeepalive = 10
```

Kita daftarkan VPN gateway di internet tadi sebagai `Peer` di sini. `AllowedIPs` kita set ke subnet VPN, sehingga semua `Peer` dengan alamat IP VPN (`10.100.10.xxx`) bisa terlihat oleh Raspi ini. `Endpoint` kita arahkan ke VPN gateway kita di cloud service. Kemudian kita tambahkan `PersistentKeepalive` agar VPN internal ini mengirim paket setiap 10 detik ke VPN external di cloud service untuk menjaga agar koneksi tidak dihapus oleh router.

## Membuat konfigurasi remote worker  ##

Terakhir, kita buatkan konfigurasi untuk masing-masing remote worker/road warrior. Bentuknya seperti ini

```
[Interface]
PrivateKey = YJBfmlovRqQgDjj9zZ46+gMZaWR62QFLNkFOOhQRIEc=
Address = 10.100.10.22/24

[Peer]
PublicKey = FQcUiIzvvvQ2hHplCsUgR+RN4avDWi/ucF57LTvq11k=
AllowedIPs = 10.100.10.0/24, 192.168.0.0/24
Endpoint = 180.244.234.226:51515
```

Kita bisa copy paste ini sebanyak jumlah remote worker, kemudian bagikan dengan QR code atau file teks seperti di [artikel terdahulu]({% post_url 2020-12-28-vpn-wireguard-02-internet-proxy %}). Cukup ganti `PrivateKey` dan `Address` untuk masing-masing worker.

Yang penting diperhatikan di sini adalah konfigurasi `AllowedIPs` di `Peer`. Pastikan bahwa subnet jaringan internal kantor (`192.168.0.0/24`) sudah tertulis di sana. 

Kita tidak mencantumkan `0.0.0.0/0` di situ karena kita ingin koneksi internet kita tetap menggunakan koneksi yang sekarang sedang kita gunakan (wifi rumah, tethering hp, dan sebagainya). Lagipula, VPN gateway kita baik di cloud maupun di kantor tidak kita konfigurasi untuk menjadi internet gateway. Bila ingin kita jadikan internet gateway, barulah kita arahkan semua paket (`0.0.0.0/0`) ke `Peer` tersebut. Jangan lupa tambahkan aturan `iptables` untuk internet proxy seperti kita bahas di [artikel sebelumnya]({% post_url 2020-12-28-vpn-wireguard-02-internet-proxy %}).

## Pengetesan ##

Mengetesnya gampang saja. Kita bisa ping ke salah satu komputer di jaringan internal, misalnya Raspberry yang menjadi VPN gateway internal tadi, menggunakan IP internalnya yaitu `192.168.0.100`. Atau kalau kita punya printer yang terhubung ke jaringan seperti di gambar, kita bisa langsung tes print ke sana. Seharusnya kita bisa print seolah-olah kita sedang berada di kantor.

Demikian konfigurasi VPN untuk Road Warrior. Semoga bermanfaat ...