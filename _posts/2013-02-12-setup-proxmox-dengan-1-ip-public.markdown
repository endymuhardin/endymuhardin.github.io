---
layout: post
title: "Setup Proxmox dengan 1 IP Public"
date: 2013-02-12 20:05
comments: true
categories: 
- linux
---

Jaman sekarang, membuat server untuk cloud tidak lagi sulit. 
Cukup cari server nganggur, unduh [Proxmox](http://pve.proxmox.com/), 
kemudian instal. 

Instalasinya pun tidak sulit, dia cuma menanyakan mau diberi IP berapa, 
password untuk user root, dan selesai sudah.
Selanjutnya, server ini tinggal kita taruh di data center. 

Dengan Proxmox ini, kita dapat membuat virtual machine (VM) sebanyak-banyaknya 
yang mampu ditangani oleh hardware servernya. 
Pembuatan VM ini dilakukan melalui antarmuka berbasis web, 
sehingga kita tidak perlu lagi menghafalkan perintah-perintah command line. 

Walaupun VM bisa dibuat sesuka hati, seringkali IP public yang tersedia terbatas jumlahnya. 
Punya VM banyak tapi tidak bisa diakses dari luar tentu percuma saja. 
Pada artikel ini, kita akan membahas cara supaya satu IP public bisa dimanfaatkan oleh banyak VM.

<!--more-->

# Konfigurasi Host #

Agar ada gambaran, berikut adalah konfigurasi awal setelah instalasi. 
Tentunya pembaca maklum bahwa semua IP yang ditulis di sini adalah palsu belaka.

* IP public (digunakan oleh Proxmox Host) : 202.202.202.202
* Network Device : eth0, dibridge menjadi vmbr0
* Versi Proxmox : 2-2-24

Berikut adalah hasil keluaran perintah `ifconfig` dalam host : 

```
eth0      Link encap:Ethernet  HWaddr 00:21:5e:27:05:30  
          inet6 addr: fe80::221:5eff:fe27:530/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:643194 errors:0 dropped:0 overruns:0 frame:0
          TX packets:225604 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:196913694 (187.7 MiB)  TX bytes:35911168 (34.2 MiB)
          Interrupt:16 Memory:ce000000-ce012800

vmbr0     Link encap:Ethernet  HWaddr 00:21:5e:27:05:30  
          inet addr:202.202.202.202  Bcast:202.202.202.203  Mask:255.255.255.248
          inet6 addr: fe80::221:5eff:fe27:530/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:571124 errors:0 dropped:0 overruns:0 frame:0
          TX packets:206100 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:177290314 (169.0 MiB)  TX bytes:31457704 (30.0 MiB)
```

Dan ini adalah isi file `/etc/network/interfaces` dalam host

```
iface eth0 inet manual

auto vmbr0
iface vmbr0 inet static
	address  202.202.202.202
	netmask  255.255.255.248
	gateway  202.202.202.201
	bridge_ports eth0
	bridge_stp off
	bridge_fd 0
```

# Konfigurasi VM #

Kita mempunyai satu VM dengan konfigurasi berikut : 

* IP Address : 192.168.100.100
* Jenis Interface : venet

Berikut adalah output dari `ifconfig`

```
lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

venet0    Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  
          inet addr:127.0.0.2  P-t-P:127.0.0.2  Bcast:0.0.0.0  Mask:255.255.255.255
          UP BROADCAST POINTOPOINT RUNNING NOARP  MTU:1500  Metric:1
          RX packets:33307 errors:0 dropped:0 overruns:0 frame:0
          TX packets:16717 errors:0 dropped:8 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:49576164 (49.5 MB)  TX bytes:916607 (916.6 KB)

venet0:0  Link encap:UNSPEC  HWaddr 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  
          inet addr:192.168.100.100  P-t-P:192.168.100.100  Bcast:0.0.0.0  Mask:255.255.255.255
          UP BROADCAST POINTOPOINT RUNNING NOARP  MTU:1500  Metric:1

```

# Akses dari dalam VM ke Internet #

Yang pertama kita kerjakan adalah bagaimana caranya supaya VM ini bisa mengakses internet. 
Caranya adalah memasang NAT di Proxmox Host supaya paket data dari network `192.168.100.0/24`
diijinkan untuk keluar dan melalui proses Network Address Translation (NAT). 

Perintahnya adalah sebagai berikut

```
iptables -t nat -A POSTROUTING -s 192.168.100.0/24 -o vmbr0 -j MASQUERADE
```

Perintah ini tentunya tidak asing bagi yang sering mengkonfigurasi internet gateway dengan Linux. 
Caranya sama persis, seolah-olah ada banyak komputer dengan IP `192.168.100.xxx` yang ingin mengakses internet.

Setelah ini dijalankan, kita coba tes akses internet dari dalam VM. 
Jalankan perintah berikut dari Proxmox Host untuk masuk ke dalam VM. 

```
vzctl enter 107
```

`107` adalah ID dari VM yang ingin kita masuki. 

Begitu sudah masuk, coba ping ke alamat internet.

```
ping google.com
PING google.com (173.194.38.137) 56(84) bytes of data.
64 bytes from sin04s01-in-f9.1e100.net (173.194.38.137): icmp_req=1 ttl=57 time=12.2 ms
64 bytes from sin04s01-in-f9.1e100.net (173.194.38.137): icmp_req=2 ttl=57 time=12.3 ms
^C
--- google.com ping statistics ---
2 packets transmitted, 2 received, 0% packet loss, time 1001ms
rtt min/avg/max/mdev = 12.257/12.293/12.330/0.116 ms
```

Tentunya kita harus pastikan dulu Proxmox Host bisa ping ke Google. 
Bila Proxmox Host saja tidak bisa akses internet, ya jangan harap VM bisa akses internet.
Ini kan bukan acara sulap.

Baiklah, VM kita sudah bisa mengakses internet, lanjut ke langkah berikut.

# Mengakses VM dari Internet #

Minimal kita ingin agar VM kita tersebut bisa diakses melalui SSH. 
Service SSH di Linux biasanya jalan di port `22`. 
Karena port `22` di Proxmox Host sudah dipakai oleh dirinya sendiri, 
kita harus pilih port lain, misalnya `10722`. 
Teknik ini disebut dengan istilah _port forwarding_

Perintahnya juga sama dengan perintah untuk NAT dari internet ke jaringan LAN, 
tentu rekan-rekan yang biasa mengkonfigurasi internet gateway tidak merasa asing.

```
iptables -t nat -A PREROUTING -i vmbr0 -p tcp -m tcp --dport 10722 -j DNAT --to-destination 192.168.100.100:22
```

Setelah itu, kita test dari komputer kita

```
ssh root@202.202.202.202 -p 10722
```

Seharusnya kita sudah bisa login ke dalam VM. 

Selanjutnya, kalau ingin membuat _port forwarding_ untuk port lain caranya sama. 

```
iptables -t nat -A PREROUTING -i vmbr0 -p tcp -m tcp --dport 10780 -j DNAT --to-destination 192.168.100.100:80
```

Perintah di atas akan membuka port `10780` di IP public Proxmox Host 
dan data yang datang ke sana diarahkan ke port `80` di VM `107` yang memiliki IP private `192.168.100.100`.

Setelah semua konfigurasi dicek dan berjalan dengan baik, simpan konfigurasi `iptables` ke folder yang kita inginkan menggunakan perintah `iptables-save`. Ini kita lakukan supaya konfigurasinya tidak hilang pada waktu reboot.

```
iptables-save > /etc/iptables/rules.v4
```

Pada waktu komputer shutdown, konfigurasi `iptables` yang sudah kita pasang akan hilang. Oleh karena itu kita perlu install paket `iptables-persistent` yang akan membaca dan memasang file hasil save kita di `/etc/iptables/rules.v4`.

```
apt-get install iptables-persistent
```

Demikianlah, satu IP public yang kita miliki bisa dipakai oleh banyak VM yang ada dalam satu server tersebut.

Konsep konfigurasi ini dikenal juga dengan istilah Network Address Translation(NAT). Lebih jauh tentang NAT bisa dibaca [di artikel ini](http://software.endy.muhardin.com/linux/network-address-translation/)
