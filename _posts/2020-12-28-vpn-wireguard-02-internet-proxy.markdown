---
layout: post
title: "VPN dengan Wireguard Bagian II : Internet Proxy"
date: 2020-12-28 07:00
comments: true
categories:
- devops
---

Pada artikel bagian kedua ini, kita akan membuat internet gateway atau proxy. Ada banyak kegunaan dari internet proxy ini, diantaranya:

* mencegah ISP kita untuk memasukkan iklan-iklan yang mengganggu
* mencegah pengelola jaringan internet di negara tertentu untuk memantau kegiatan internet kita. Ini berguna misalnya untuk jurnalis yang bertugas di daerah yang otoriter, sehingga rawan diciduk ketika menulis artikel yang sensitif
* mengakses layanan yang hanya ada di negara tertentu. Misalnya hiburan streaming yang pilihan tayangannya berbeda antar negara
* mengetes aplikasi yang kita buat, apakah berjalan dengan baik ketika diakses dari luar negeri

Skenario ini bisa diilustrasikan seperti pada gambar berikut

[![VPN Internet Proxy]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-internet-proxy.jpg)]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-internet-proxy.jpg)

Langkah-langkah implementasinya sebagai berikut:

<!--more-->

* TOC
{:toc}

## Menyiapkan VPS ##

Untuk implementasi internet proxy, kita membutuhkan host yang berlokasi di negara yang kita inginkan. Sebagai contoh, kita berlangganan layanan streaming film yang mana ketersediaan pilihan filmnya berbeda untuk warga +1 dan warga +62. Untuk itu, kita perlu memiliki host yang berlokasi di negara +1. 

Host ini bisa kita dapatkan dengan cara berlangganan jasa cloud service yang memiliki data center di negara +1. Misalnya Digital Ocean, Amazon, Google, dan sebagainya. Untuk coba-coba, biasanya mereka menyediakan akun gratis yang bisa kita gunakan selama periode tertentu.

Kita membutuhkan layanan cloud berupa VPS (virtual private server) atau biasa dikenal dengan istilah IaaS (infrastructure as a service).

Contohnya, kita bisa menggunakan layanan DigitalOcean dan membuat VPS (droplet dalam istilah DigitalOcean) di region US seperti ini

[![DigitalOcean USA]({{site.url}}/images/uploads/2020/vpn-wireguard/digitalocean-usa.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/digitalocean-usa.png)

Kita juga bisa membuat VPS di Amazon, berupa layanan Lightsail seperti ini

[![Lightsail USA]({{site.url}}/images/uploads/2020/vpn-wireguard/lightsail-usa.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/lightsail-usa.png)

Setelah kita buat VPS, kita bisa login menggunakan SSH dan melakukan instalasi seperti dibahas pada [artikel sebelumnya](https://software.endy.muhardin.com/devops/vpn-wireguard-01-intro/).

## Konfigurasi WireGuard dan Internet Sharing ##

Pada prinsipnya, membuat internet proxy dengan VPN sama saja dengan mengkonfigurasi internet connection sharing. Konsep dan implementasinya sudah pernah saya bahas di [artikel jaman dulu tentang Network Address Translation](https://software.endy.muhardin.com/linux/network-address-translation/). Walaupun tulisan tersebut saat ini sudah berusia 13 tahun, tapi konsepnya masih sama. Bahkan command `iptables`nya masih bisa dicopas. Jadi, silahkan baca dan pahami dulu artikel tersebut.

> Sudah dibaca ??? Oke baik mari kita lanjutkan ...

Dari artikel tentang Network Address Translation (NAT) tadi, kita mendapatkan bahwa untuk membuat internet connection sharing, kita perlu melakukan 2 hal:

1. Mengaktifkan packet forwarding di kernel linux
2. Memasang rule `iptables` untuk melakukan NAT, yaitu source NAT atau SNAT.

Aktivasi IP forwarding di Ubuntu dilakukan dengan cara mengedit file `/etc/sysctl.conf` dan mengaktifkan baris konfigurasi berikut

```
net.ipv4.ip_forward=1
```

Setelah itu, reload file konfigurasinya dengan perintah:

```
sysctl -p /etc/sysctl.conf
```

Rule `iptables` untuk melakukan SNAT ada 2, sebagai berikut

```
iptables -A FORWARD -i wg0 -j ACCEPT
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

Kita menggunakan tipe khusus dari SNAT, yaitu MASQUERADE. Ini biasa digunakan untuk mengantisipasi IP public yang tidak tetap bila kita mengunakan internet di rumah. Walaupun pada kasus kita IP publicnya tetap (static) karena berada di cloud, untuk alasan konsistensi dan keseragaman kita tetap menggunakan MASQUERADE alih-alih SNAT biasa.

Perintah `iptables` tersebut ingin kita jalankan setelah interface `wg0` aktif. WireGuard menyediakan hook untuk menjalankan perintah tertentu setelah interface aktif (`PostUp`) dan setelah interface nonaktif (`PostDown`). Di dalam hook command kita bisa menggunakan variabel `%i` untuk mengacu kepada nama interface (misal: `wg0`, `wg1`, dst).

Dengan demikian, konfigurasi WireGuard kita di VPN Proxy menjadi seperti ini

```
[Interface]
PrivateKey = 2KSQxhAa4EmrFV//t5Lbvq5L4nCDo6bHrM2/Dolxo04=
Address = 10.100.10.1/24 # IP Private VPN Gateway
ListenPort = 51515 # Port untuk menerima koneksi dari user

# Aturan Firewall untuk meneruskan paket dari user ke internet
PostUp = iptables -A FORWARD -i %i -j ACCEPT
PostUp = iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Kalau VPN dimatikan, hapus aturan firewall untuk meneruskan paket dari user
PostDown = iptables -D FORWARD -i %i -j ACCEPT
PostDown = iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

Di dalam file konfigurasi WireGuard, kita bisa menggunakan variabel `%i` yang akan terisi dengan nama interface wireguard yang digunakan, misalnya `wg0`.

Konfigurasi interface WireGuard di sisi VPN Gateway selesai. Sekarang kita bisa membuatkan konfigurasi untuk masing-masing user yang ingin menggunakan proxy tersebut.

## Membuat Konfigurasi User ##

Ada beberapa hal yang harus dilakukan setiap kita menambah user baru, yaitu:

1. Membuatkan file konfigurasi user yang berisi blok `[Interface]` berisi setting private key dan alamat IP private dalam VPN. Kemudian membuat juga blok `[Peer]` berisi alamat IP public VPN Proxy, public keynya, dan aturan routing (`AllowedIPs`)

2. Mendaftarkan user ke dalam file konfigurasi VPN Gateway berupa blok `[Peer]` berisi public key dan alamat IP private dalam VPN.

Konfigurasi untuk user isinya seperti ini

```
[Interface]
PrivateKey = ADE2d+4CT/kJIVC3YlCp3b45YHqpy3FZji15zUTqG1c=
Address = 10.100.10.11/24 # IP Private User
DNS = 1.1.1.1, 1.0.0.1 # DNS diarahkan ke Cloudflare

[Peer]
# Public Key VPN Gateway
PublicKey = bGalHOzArxIoTFDVz0fMcidw6k01Vlk3Zo5ancGjIlg=
# Semua paket dilewatkan ke VPN gateway
AllowedIPs = 0.0.0.0/0
# IP Public VPN Gateway dan ListenPort WireGuard
Endpoint = 139.59.112.17:51515
```

Sedangkan pasangannya berupa blok `[Peer]` di dalam konfigurasi VPN gateway terlihat seperti ini

```
[Interface]
# blok interface seperti dijelaskan di atas

# Konfigurasi per user. Satu user satu blok [Peer]
[Peer]
PublicKey = YQJ8wfZ++ebVPlJas9iNmgk5zxyuA1Cav9Exo4CvSQQ=
AllowedIPs = 10.100.10.11/32
```

File konfigurasi user bisa kita tampilkan dalam QR Code dengan aplikasi `qrencode`. Kita gunakan perintah `cat` untuk menampilkan isi file, kemudian kita _pipe_ outputnya ke `qrencode`. Aplikasi `qrencode` bisa menampilkan QR Code dalam format teks, sehingga bisa dijalankan di command line, seperti ini

```
cat user.conf | qrencode -t utf8
█████████████████████████████████████████████████████████████████████████████
█████████████████████████████████████████████████████████████████████████████
████ ▄▄▄▄▄ █▀▄▀▄▄▄ ▀█  ▀█▀▄▀███▀ ▄█▀█▄▄▀ ▀▀ ▄   █▄▄▄▀▄█▄█▀▀ █ ▄▄▄█ ▄▄▄▄▄ ████
████ █   █ █▀  ▀▀▄▄▀ █▄▀█ ▄█▀▄ █ █ █▀ ▀▄ ▄ ▀▄▀ ▄ ▄▄▄██▀▀ █▄▄█▀▄█▀█ █   █ ████
████ █▄▄▄█ █▀  █▀▀▀▄▄█▀▀▀ ▄▀▀▄▀ ▄█▀▄ ▄▄▄ ▀▄▀▀▀██▄▄▀█ █▀ ▄▀▄ ▄▄ █▄█ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄█▄█ █ █▄▀ ▀▄█▄█ ▀ ▀▄█ █ █▄█ █ ▀ █ ▀ ▀▄▀▄█ █▄▀▄▀ ▀ █▄█▄▄▄▄▄▄▄████
████ ▄ ▄ ▀▄▄ ▀ █ ▀▀▄▀██▄ ▄█▀▄█▀ ▄▄▀▀▄ ▄ ▄▀▄▀▀█▄█ █▄▀▄█ ▄ ▄ ██ █ ▀▄▀ █ ▀▄▀████
████▀▄█▀██▄ ▀▄▄▄▄▀▀▄▄█▀▀███▀█▄▄ █▄ ▀█ ▀ ██▄▄▄  █ ██▀▄ ▄▀▀██▀▀▀▄▄▄ ▄▀▀█▄█▀████
████▄▀▀▄ █▄▀█▀█▄▄▀▀ ▀▀ █▄ ▄▄██▄ ▄ ▄▀▄▀▄▀██  █▄▀██ ██▀▄▄ ██ ██▀ █▀█▀▄▀██▄▀████
█████▄▄▀█ ▄▀█ ▄█ ▄▀▀▄▄███ ██▀▀█ █▄▄█▄▄█▀▀▀█▄▀▄█▀▀█  ▄█▄▄▀▄▄▀▀█▄█ ▄▄▀▀  ██████
████▀█▄▀ ▀▄▄ ▄▀▄█  ▄▄▄▀▀▀▄ ▄█▀█▀█▀▄▄ ██ ▄█▀ █  ██  █▄ ▄▄▀█ ▀▀▄▄▄  ▄██████████
████▀█▄█ ▄▄▀ ██▀▄█▀███▀▀ ▀██▀ █▀█ ▄▄ ▀▄██▄▄▄▀▀ ▄▀ █ ▄ █▄ ▄ ▀▄▄▄ ▄█ ▄▀██ ▀████
████▀█▄ ▄█▄ █ █ █ ▄█ ▀ ▄█  ▄█▄█▀ ▀ █ █ ▀▄██ ▄█▀▀█  ▀ ▄▄ ▀█▄█▄▀▄▄ ▄▀ ▀ ▀█ ████
████▄▄█▄▄▄▄▀▀ ▀▄█▄█▄▄  █▀▀  ▀█▄▀ ▀▀▀▄  ▄ ▄▀▄█▄▀ ▀  █▀█▄▄ ▄▀█ ▀█ ▀ █▀▀█ ██████
██████▀█▀▄▄   ▄█▀▀▄▄▀▀█▄▄▀▄▄ █▀▀▀█ ▄█▄█  ▄█▀▀█ █ ██▄▄█▀▄█▀ ▀█▀▄▀▀▄  ███▀▀████
████  ▀██▀▄▄ ▀█▀█  ▄  ▄▀▄ █▄  █▄▀█▄██▀▄▀█ ▄██▄▀ █▄▄ ▄▄ █▄▀ ▀▄ ▄█▀█▄▀ █ █▄████
█████ ▀▄▀▀▄  ▀▀█ ▀█ █▀ ▄▀▄ ▄██▀ ▄▄▄▄██▀▀▄▄█ ▀█▀█ ▀▀▀███▄▄▄▀█▄ ▀▄ ▄▀ ▀ ▄▀█████
█████ ▄▄ ▄▄ ▄ ▀██▀  ▀▀ ▄█▀▄▄█▄ █▀▄ █▄ ██▄▀█▄▄▄█▀▀█▄▀█ ▄ ▀▄▄ ▄▀▄ ▀ █ ▀▀▀█ ████
████▄▀██ ▄▄▄ █▄██▄▀▀▄▀ ▄█ ▄▄▀▄▄▄▀▀██ ▄▄▄ █▄ ▀▀ █▀▀██▀██ ██▄▀ ██  ▄▄▄ ▄█▀█████
████▄ █  █▄█ ▄▀▄▀ ▄ ██ ▄█ ▄██▀█▄ █ █ █▄█  ▄▄  ▀██▀█ ▄█ █▀▀▀▀▄▀ █ █▄█ ▄▄ ▀████
█████▀ ▀  ▄▄▄▀▄██▀▄▀▄█▄▄█▄▀▄█ █▀ ▀▄ ▄  ▄▄▀▀ ▀▄██▀▀ █▀▄▀▄▄▄▀██ ▀   ▄▄▄ ▀ ▄████
████▀▄ █▄ ▄▄▄██▀  ▄▀ █▄██▄██  ▀ ▄█ ██▄█▄███▀█▄█▀▀█ ▀  █  ▄ ▀▀██▄▀ █▄▄▄█▀▄████
█████  ▀▀█▄██  ▄ █ ▀█▀█▄▄▄█▀▄▀█▀ █ ▄▀▀▀█▀▄██▀█ █ ▄█  ▄▄▄▄   █  ▄ ██▀▄▄▀▀▀████
████  ▄█ ▀▄▀▄ ▄█ ▀█▀██▀▄██▄▀███ ▄  ▀███   ▄▄▀▄█▀▀ ███ ▄▄▄█▄ ▀▀  █▀█▀██ ▀ ████
████▀ █▄▄▄▄█ ▄    ▄▀▀▀ ▄▀ ▀▄█▀ ▀▄ ▄▄▀▄█  ▄█▄▀█ ▀▄ ▀█ ▄  ██ █▄ ▄█ █ ▀▄▀▀▀▀████
████▄▄ ▄▄▀▄▄▄  ██▄██▄▄█ ▀██ ▀▀█ █▀    █▄██▄█▀▄▀▄▀▀▄█▄   ▀▄▄▀▀█▄▀ █▀▀▀▀ █▀████
████▄ ▀█▄▀▄▄█▀▄█▀ ▀▀▀▄▀▀▀ ▀▄█▀█ █▀▀█▄▄▀▄▀█      ▀▀▀▀  ▄▀▀▄▀█▀▄██ ██ ▄█▀█▄████
████▀█▀  █▄█▀█   █▄▄ █▀▀ ▄▄█ ██ █▀▄ █▄█▄█▄ ▄▀▄█▀▀▀▀ ▄█▄▄▀▄▀▀█▄▄  █▀████▄█████
████▄▄▀ █▄▄ ▄▄▄ ▄█▄▀ ▀▄▄▀▄▄▀ █▀▀▄▀█▀█ ██ █ ▄▀██▀█  █▀██ ▄█ █▀▀▄▀  ▄▄▄ █▀█████
█████▀█ █▄▄▀▀▀ ▀▀  ▄█▄▀▀ ▀   ██  █ ██▄▀▄▀▀▄▄▀▄▀▀ ▀▄▄ ▄▄██▀▀▄▀▀██▀██ ▄▄ ▀█████
█████▀█ ▀▀▄█ ▄▀▀█▄▄▄▀▀▀▄ ▀▄▄ █▀▀ ▄ ██▄▀█▄ █▄██▄▀▄█▄▄▄▄▀▄▄▀  ▀▀▀█ ▄ ▀ ██▄▀████
████ █▄█▄▄▄  ▄█  ▀ ▄  ▄█  ▀▄ ▄▀██▀▄█ ▄█    ▄  ▀▀ █▄▀▀█ ██▀ ▀ ▀▄██▀▄  █ ▀█████
████▄██▄▄█▄█▀ █ ▀ ▀▀█▀ █▀ █▄▀▀▀ ▄ ▄▄ ▄▄▄ ▄▀ ▄▄███▀▄█▄▄█ ▄▄▀▀   █ ▄▄▄  ▀▀▀████
████ ▄▄▄▄▄ █▄▀▄ ███ ▀▀ ██ ▄▀▀▄ ▀▄█ ▄ █▄█ █ █▀▄▀▀▀▀█▀█▄ ▄   ▀ █▄▄ █▄█   █▄████
████ █   █ █  ▀▀▄▄ ▀█▀ ▄█▄▀▄█▄▄ ▀█▄ ▄  ▄▄▄ ▄▄▀ ██ █▀█ ▄▄██▀█▄██▄▄▄▄▄ ▄███████
████ █▄▄▄█ █ ▄█▀▀   █▀▀▄█ █▄▀ ▄ ▄█ ▀▀███▀▄▄█▀▄▀▀▀ ▄▀▄███▀ ▀ █ ▀▀▄▄▄ ▄▄ ██████
████▄▄▄▄▄▄▄█▄█▄▄▄▄██▄█▄▄█▄██▄███▄███▄██▄▄█▄▄████▄▄██▄█▄▄████▄▄████▄▄██▄▄█████
█████████████████████████████████████████████████████████████████████████████
█████████████████████████████████████████████████████████████████████████████
```

Atau bisa juga kita tulis ke file, sehingga bisa dikirim melalui email atau chat.

```
cat endy.conf | qrencode -o user.png
```

QR Code ini bisa kita scan di aplikasi Android atau IOS. Sedangkan untuk aplikasi desktop (Windows, Linux, MacOS), kita bisa langsung copy-paste file konfigurasi dalam format teks tadi.

## Pengetesan ##

Kita bisa mengetes konfigurasi ini dengan cara browse ke website [ifconfig.me](https://ifconfig.me/)

[![IFConfig.Me]({{site.url}}/images/uploads/2020/vpn-wireguard/ifconfig.me.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/ifconfig.me.png)

atau menjalankan perintah `curl ifconfig.me` dari command line.

```
$ curl ifconfig.me
180.244.232.79
```

## Cara Singkat ##

Bila kita tidak ingin melakukan konfigurasi secara manual seperti cara di atas, kita bisa menggunakan script yang sudah dibuatkan orang di internet. Salah satunya adalah [Easy WG Quick](https://github.com/burghardt/easy-wg-quick). Aplikasi ini terinspirasi dari aplikasi konfigurator untuk OpenVPN, yaitu [Easy RSA](https://github.com/OpenVPN/easy-rsa).

## Kill Switch ##

Dalam penggunaan VPN, kita mengenal adanya istilah VPN leak. Yaitu kadangkala koneksi VPN terputus dan komputer/smartphone kita mengirim paket tanpa VPN. Dengan demikian, di sisi penerima bisa melihat alamat IP kita yang asli, kemudian mengkorelasikannya dengan request kita sebelumnya (misal dengan session ID) dan mendeteksi bahwa ada dua request yang usernya sama, tapi alamat IPnya berbeda. 

VPN leak ini bisa memicu tindakan preventif di sisi penerima / penyedia layanan. Beberapa aplikasi sosial media bisa mengira bahwa akun kita dihack (karena diakses dari negara yang berbeda dalam hitungan menit, menit 1 dari USA, menit 2 dari Indonesia), dan kemudian segera memblokir akun kita untuk mencegah penyalahgunaan. Demikian juga dengan aplikasi perbankan (internet atau mobile banking), mencurigai adanya fraud dan segera memblokir akun kita. Atau bisa juga layanan tontonan streaming yang mendeteksi bahwa kita mencoba memalsukan alamat asal kita untuk mendapatkan tayangan yang lebih lengkap. Intinya, VPN leak bisa menyebabkan akun kita diblokir.

Untuk mencegah VPN leak, di sisi pengguna harus ada mekanisme untuk mencegah komputer/smartphone agar tidak mengirim paket dulu ketika VPN sedang terputus. Ini disebut dengan fitur _kill switch_.

Di komputer Linux, kita bisa mengimplementasikan _kill switch_ dengan aturan `iptables`, blokir semua akses ke internet selain interface `wg0`. Tutorialnya bisa dibaca di [artikel ini](https://www.ivpn.net/knowledgebase/linux/linux-wireguard-kill-switch/)

Di smartphone Android, sayangnya aplikasi resmi WireGuard belum menyertakn fitur killswitch pada waktu artikel ini saya tulis. Sebagai alternatif, kita bisa menggunakan aplikasi lain yaitu [TunSafe](https://play.google.com/store/apps/details?id=com.tunsafe.app). Aplikasi ini sudah memiliki fitur killswitch.

Sedangkan untuk laptop MacOS dan iPhone, saat ini saya belum menemukan cara untuk mengimplementasikan killswitch. Kalau nanti ada informasi baru mengenai hal ini, tulisan ini akan saya update.

Demikianlah setup VPN untuk skenario Internet Proxy. Semoga bermanfaat ... 