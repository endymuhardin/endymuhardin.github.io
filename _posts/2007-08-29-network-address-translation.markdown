---
comments: true
date: 2007-08-29 17:50:36
layout: post
slug: network-address-translation
title: Network Address Translation
wordpress_id: 261
categories:
- linux
---

Pada artikel kali ini, kita akan membahas penggunaan NAT untuk memungkinkan aplikasi kita yang jalan di laptop bisa diakses orang dari internet. NAT adalah singkatan dari Network Address Translation. 

Gunanya supaya kita bisa mempublish aplikasi yang berjalan komputer di jaringan internal. Misalnya kita menjalankan aplikasi web di port 8080 di laptop dengan IP private : 192.168.0.10. Kita ingin aplikasi ini bisa diakses dari orang di internet. Laptop kita terhubung ke router yang memiliki IP public 202.159.11.11. 

Normalnya, orang di internet tidak bisa langsung mengakses aplikasi kita melalui dengan alamat http://192.168.0.10:8080 dari internet. Karena alamat IP 192.168.0.10 adalah alamat internal, yang tidak dikenali di luar.

Untuk itu, kita harus mengkonfigurasi gateway internet kita agar bisa meneruskan request dari internet ke laptop kita. Ini bisa dilakukan dengan memasang konfigurasi NAT di gateway internet kita. Berikut cara kerjanya.

Request http dilakukan dari komputer asal ke komputer tujuan, dengan menuliskan alamat pengirim dan alamat penerima.
Mirip dengan kalau kita kirim surat. Pesannya ditulis di kertas, masukkan amplop, tulis alamat penerima dan alamat pengirim.

Contoh paketnya kira-kira seperti ini. 

```
Dari  : 202.159.22.22
Untuk : 202.159.11.11
Pesan : halo
```

Pesan di atas akan bisa sampai ke gateway, karena `202.159.11.11` adalah IP public yang dikenal semua orang di internet.

Bila gateway ingin meneruskan pesan ini ke komputer internal, maka dia akan membungkus paket tersebut dengan amplop baru, alamat tujuannya diganti dengan IP internal, agar bisa mencapai laptop yang alamat IPnya internal. 
Proses ini dinamakan DNAT (Destination NAT). 

Bila alamat tujuan tidak diganti, maka paket tidak akan sampai ke komputer internal.

Di Linux, ini dilakukan dengan perintah iptables. 
Perintahnya adalah sebagai berikut: 

```
iptables -t nat -A PREROUTING -d 202.159.11.11 --dport 8080 -j DNAT --to-destination 192.168.0.10:8080
```

Setelah di`DNAT`, paketnya menjadi seperti ini: 

```
Dari  : 202.159.22.22
Untuk : 192.168.0.10
Pesan : halo
```

Setelah itu, amplop lewat proses routing di gateway. Router akan bisa menyampaikan paket tersebut ke laptop, karena dia kenal `192.168.0.10` itu adalah laptop.

Akhirnya paket sampai di tujuan. 

Dengan menggunakan DNAT ini, kita bisa mempublikasikan laptop kita di jaringan internal agar bisa diakses dari luar.

Bagaimana kalau laptop kita ingin mengirim balasan data?

Prosesnya kira-kira sama. Dia masukkan ke amplop, menaruh alamat pengirim menjadi alamat tujuan, dan menaruh alamat laptop menjadi alamat pengirim. Kemudian data tersebut dikirim ke router. 

Paketnya kira-kira seperti ini: 

```
Dari  : 192.168.0.10
Untuk : 202.159.22.22
Pesan : halo juga
```

Laptop kita akan mengalami kebingungan untuk mengirim paket tersebut. Karena dia tidak kenal `202.159.22.22`. Dia hanya kenal teman-temannya sesama anggota jaringan `192.168.0.0`. Paket balasan ini tidak akan berhasil terkirim.

Untuk itu, gateway perlu melakukan satu perubahan lagi. Sebelum dia mengirim paket tadi ke laptop kita, dia perlu mengganti alamat pengirim menjadi alamat internalnya sendiri (biasanya nomor terkecil, yaitu `192.168.0.1`). Jadinya kira-kira seperti ini

```
Dari  : 192.168.0.1
Untuk : 192.168.0.10
Pesan : halo
```

Proses ini dinamakan SNAT (Source NAT). Perintahnya adalah sebagai berikut:
 
```
iptables -t nat -A POSTROUTING --dport 8080 -j SNAT --to-source 192.168.0.1
```

Setelah di`SNAT` pesan tersebut bisa dibalas oleh aplikasi di laptop kita seperti ini: 

    
```
Dari  : 192.168.0.10
Untuk : 192.168.0.1
Pesan : halo juga
```

Pesan ini akan diterima oleh gateway, dan kemudian akan diteruskan ke pengirim aslinya yaitu `202.159.22.22`

Dengan menggunakan SNAT, kita juga bisa mengimplementasikan Internet Connection Sharing, yaitu satu koneksi internet dibagi beramai-ramai.

Ada satu kasus khusus untuk SNAT, namanya Masquerade. 
Ini digunakan apabila IP public yang digunakan berubah-ubah. 
Misalnya kalau kita pakai dialup connection. 

Kalau kita nekat pakai SNAT, nanti akan repot, karena harus update rule setiap dial ke internet dan mendapatkan IP public yang berbeda.

Solusinya, kita gunakan masquerade. 
Berikut perintahnya:
 
```
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -j MASQUERADE
```

Dengan menggunakan masquerade, kita tidak perlu menyebutkan `--to-source` karena alamat IP asal (IP publik gateway kita) berubah-ubah.

Perhatian: Jangan lupa untuk mengaktifkan IP Forwarding di gateway dengan perintah
 
```
cat 1 > /proc/sys/net/ipv4/ip_forward
```

Rangkaian perintah ini akan hilang pada saat reboot. 
Jadi harus ada usaha tambahan agar konfigurasi ini jadi permanen. 
Caranya, tergantung masing-masing distro. Biasanya, kita simpan dulu ke file menggunakan perintah `iptables-save`

```
iptables-save > /etc/iptables/rules.v4
```

Kemudian file tersebut kita load menggunakan perintah `iptables-restore`

```
iptables-restore < /etc/iptables/rules.v4
```

Agar berjalan setiap kali booting, panggil perintah `iptables-restore` dari script `rc.local`. Lokasi script ini berbeda antar distro, untuk keluarga Debian terletak di folder `/etc`.

Sayangnya saat ini iptables hanya ada di Linux, dan nampaknya tidak akan ada versi Windowsnya. Karena iptables sangat _tightly-coupled_ dengan kernel linux.

Untuk Windows, kita dapat gunakan fitur Internet Connection Sharing apabila ada. Beberapa versi Windows (misalnya XP Home), tidak punya fitur ini. Jadi solusinya adalah dengan menggunakan aplikasi tambahan seperti misalnya [WinGate](http://www.wingate.com/product-wingate.php) atau [WinRoute](http://www.kerio.com/kwf_home.html).
