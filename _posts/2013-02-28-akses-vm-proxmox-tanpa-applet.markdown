---
layout: post
title: "Akses VM Proxmox Tanpa Applet"
date: 2013-02-28 14:22
comments: true
categories: 
- linux
---

Jika kita ingin mengakses virtual machine di dalam Proxmox, 
ada beberapa opsi yang bisa kita gunakan, yaitu: 

* SSH langsung ke IP virtual machine tersebut.
* Login ke web management Proxmox, kemudian pilih virtual machine, dan jalankan VNC console yang berupa aplikasi Java applet.
* SSH ke mesin host, dan kemudian masuk ke console virtual machine
* Membuat VNC server yang bisa diakses dari luar

Kadangkala, kita tidak bisa menjalankan opsi pertama, karena belum menginstal SSH server di VM.
Opsi kedua sering tidak lancar di Linux.
Opsi ketiga hanya bisa dijalankan untuk OpenVZ, saya belum ketemu caranya untuk KVM.
Dengan demikian, kita harus menggunakan cara keempat.

<!--more-->

Berikut adalah caranya. Pertama kita ssh dulu ke mesin host. 
Setelah itu kita tampilkan daftar semua VM yang bertipe KVM 
dengan perintah `qm list`

```
# qm list
      VMID NAME                 STATUS     MEM(MB)    BOOTDISK(GB) PID
       101 vm110                running    512               30.00 16474
       103 vm103                stopped    512               80.00 0
       104 vm104                running    256               80.00 16256
       107 vm107                running    2000              50.00 16348
       113 vm113                stopped    512               32.00 0
       115 vm115                running    8000             100.00 16316
       116 vm116                running    1000              80.00 16460
       119 vm119                running    1000              20.00 16390
       120 vm120                running    1000              40.00 16284
       166 vm166                running    1024             150.00 16440
       190 vm190                running    512               20.00 16270
       199 vm199                running    1024               5.00 16300
```

Kita bisa membuka VNC server yang mengarah ke VM dengan ID tertentu
dengan perintah berikut:

```
nc -l -p portvnc -c "qm vncproxy vmid passwdvnc"
```

Misalnya, bila kita ingin mengakses VMID `166` di port `10166` dengan password `abc321`, 
maka perintahnya adalah sebagai berikut

```
nc -l -p 10166 -c "qm vncproxy 166 abc321"
```

Setelah itu, kita bisa mengakses VM tersebut menggunakan VNC client seperti pada screenshot.

![Konfigurasi VNC Client ](/images/uploads/2013/02/28/vnc-kvm.png)

Kosongkan saja username dan password, nanti kita akan dimintai password oleh aplikasinya.

Hal yang sama bisa dilakukan juga dengan OpenVZ. 

Pertama, cari dulu VM yang mau diakses dengan perintah `vzlist`

```
# vzlist
      CTID      NPROC STATUS    IP_ADDR         HOSTNAME
       102        229 running   202.202.202.200  vm102
       105         40 running   202.202.202.201  vm105
       106         27 running   202.202.202.202  vm106
       108         21 running   202.202.202.203  vm108
       110         46 running   202.202.202.204  vm110
       111         61 running   202.202.202.205  vm111
       112         16 running   202.202.202.206  vm112
       114         39 running   202.202.202.207  vm114
       117         18 running   202.202.202.208  vm117
       121         43 running   202.202.202.209  vm121
       130         32 running   202.202.202.210  vm130
```

Kemudian gunakan perintah berikut

```
vncterm -c vzctl enter VMID
```

Misalnya, bila ingin mengakses VM 111, maka perintahnya adalah

```
vncterm -rfbport 10111 -c vzctl enter 104
```

Referensi : 

* [Forum Proxmox](http://forum.proxmox.com/threads/612-External-VNC-viewer)
* [UNIX/LINUX TECH NOTES](http://honglus.blogspot.com/2011/02/access-guest-vm-console-via-text-mode.html)
