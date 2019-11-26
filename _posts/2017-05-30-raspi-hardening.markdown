---
layout: post
title: "Instalasi dan Hardening Raspberry PI"
date: 2017-05-30 07:00
comments: true
categories:
- linux
---
Raspberry PI tentunya sudah bukan barang baru lagi bagi para opreker nusantara. Cara instalasinya pun saya yakin sudah pada lancar. Akan tetapi, sebelum dipasang ke internet, perlu ada tindakan pengamanan supaya tidak dihack orang.

Berikut langkah-langkah yang biasa saya lakukan pada saat setup Raspberry PI


1. [Instalasi Raspbian ke MicroSD]({{ page.url }}/#instalasi)
2. [Setup Network]({{ page.url }}/#setup-network)
3. [Login ke Raspbian]({{ page.url }}/#login)
4. [Buat user baru]({{ page.url }}/#user-baru)
5. [Hapus user pi]({{ page.url }}/#hapus-user-pi)
6. [Ganti keyboard dan timezone]({{ page.url }}/#keyboard-timezone)
7. [Update & Upgrade]({{ page.url }}/#update-upgrade)
8. [Setup passwordless login]({{ page.url }}/#passwordless-ssh)
9. [Proteksi brute-force ssh]({{ page.url }}/#proteksi-brute-force-ssh)
10. [Automount USB]({{ page.url }}/#automount-usb-debian)

<!--more-->

<a name="instalasi"></a>
## Instalasi Raspbian ##

Instalasinya mudah, sudah ada juga [dokumentasi resminya](https://www.raspberrypi.org/documentation/installation/installing-images/README.md). Akan tetapi supaya lengkap, baiklah saya tulis lagi di sini.

Petunjuk instalasi khusus macOS, pengguna Linux biasanya tidak perlu diajari lagi caranya. Pada dasarnya hanya `dd if=namafile.iso of=namadevicemicrosd` saja.

Setelah kita [mengunduh image terbaru](https://www.raspberrypi.org/downloads/raspbian/), kita akan menulisnya ke MicroSD card. Pasang MicroSDnya, kemudian cari tau nama devicenya.

```
diskutil list
```

Outputnya seperti ini

```
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *121.3 GB   disk0
   1:                        EFI EFI                     209.7 MB   disk0s1
   2:          Apple_CoreStorage Macintosh HD            120.5 GB   disk0s2
   3:                 Apple_Boot Recovery HD             650.0 MB   disk0s3

/dev/disk1 (internal, virtual):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:                  Apple_HFS Macintosh HD           +120.1 GB   disk1
                                 Logical Volume on disk0s2
                                 D355AA2B-BB42-4858-9058-6FA6AB6783A3
                                 Unlocked Encrypted

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *31.9 GB    disk2
   1:             Windows_FAT_32 boot                    66.1 MB    disk2s1
   2:                      Linux                         31.8 GB    disk2s2

/dev/disk3 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *124.2 GB   disk3
   1:                        EFI EFI                     209.7 MB   disk3s1
   2:          Apple_CoreStorage SDUF128G                123.9 GB   disk3s2
   3:                 Apple_Boot Boot OS X               134.2 MB   disk3s3
```

MicroSD kita ada di `/dev/disk2` karena dia satu-satunya yang bertipe `Windows_FAT_32`.

Selanjutnya, umount dulu supaya bisa diakses langsung ke devicenya.

```
diskutil unmountDisk /dev/disk2
```

Kemudian, tulis file image yang sudah diunduh ke device. Untuk di macOS, biasanya ditambahkan `r` di nama disk sehingga menjadi `/dev/rdisk2`. Awas jangan salah ketik, bisa-bisa hardisk utama kita kena format.

```
sudo dd bs=1m if=Downloads/2017-04-10-raspbian-jessie-lite.img of=/dev/rdisk2
```

Outputnya seperti ini

```
Password:
1237+1 records in
1237+1 records out
1297862656 bytes transferred in 142.520214 secs (9106516 bytes/sec)
```

Saya biasanya menjadikan Raspberry PI ini menjadi headless, alias tanpa monitor. Untuk mengaksesnya kita gunakan SSH. Biasanya SSH ini harus diaktifkan dari menu konfigurasi yang baru bisa diakses setelah login ke OS. Tapi kali ini, kita akan aktifkan langsung tanpa perlu pasang monitor dan keyboard.

Caranya sederhana, yaitu buat file dengan nama `ssh` di top level folder dalam MicroSD. Untuk itu, mount dulu MicroSD yang sudah diisi image Raspbian tadi.

```
$ mount
/dev/disk1 on / (hfs, local, journaled)
devfs on /dev (devfs, local, nobrowse)
map -hosts on /net (autofs, nosuid, automounted, nobrowse)
map auto_home on /home (autofs, automounted, nobrowse)
/dev/disk2s2 on /Volumes/Untitled (ufsd_ExtFS, local, nodev, nosuid, noowners)
/dev/disk2s1 on /Volumes/boot (msdos, local, nodev, nosuid, noowners)
```

Kemudian buat filenya. Bisa dengan File Explorer, klik kanan, Create New File. Tapi command line jauh lebih cepat.

```
$ touch /Volumes/boot/ssh
```

<a name="setup-network"></a>
## Setup Networking ##

Ada dua interface yang biasa ditemukan di Raspberry: ethernet dan wifi.

### Ethernet ###

Secara default, Raspberry Pi akan mengatur ethernet card yang dimilikinya untuk mendapatkan alamat IP otomatis (DHCP Client). Akan tetapi, kadangkala kita ingin mendapatkan alamat IP yang statis, sehingga bisa langsung kita akses melalui SSH dan cross cable.

Untuk mengatur agar alamat IPnya statis, kita edit file `/etc/dhcpcd.conf` yang ada di partisi `rootfs`. Aktifkan baris berikut ini

```
controlgroup wheel
interface eth0
static ip_address=192.168.0.10/24
```

### WiFi ###

Raspberry PI model terbaru (Pi 3 model B dan Pi Zero W) sudah memiliki chipset WiFi. Berikut cara untuk mendaftarkan SSID beserta passwordnya langsung ke SD Card sehingga pada waktu dinyalakan Raspi akan langsung terhubung dengan WiFi kita.

Misalnya, nama SSIDnya adalah `wifiendy` dan passwordnya `abcd11223344`. Isi konfigurasi berikut di file `/Volumes/boot/wpa_supplicant.conf`

```
country=ID
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
   ssid="wifiendy"
   psk="abcd11223344"
}
```

Setelah itu, unmount MicroSD, dan pasang di Raspberry PI. Lalu tancapkan di kabel power dan nyalakan.

```
diskutil unmountDisk /dev/rdisk2
```

<a name="login"></a>
## Login ke Raspbian ##

Beberapa saat kemudian, kita cek router kita untuk mengetahui alamat IP si Raspberry PI ini. Caranya bisa dengan login ke router dan melihat daftar perangkat yang terkoneksi, atau bisa juga dengan [scan jaringan menggunakan nmap](https://software.endy.muhardin.com/linux/cara-mengetahui-ip-address-dari-mac-address/).

Selanjutnya, kita bisa langsung akses Raspberry PI tersebut menggunakan SSH. Defaultnya Raspberry PI menyediakan username `pi` dan password `raspberry`.

```
ssh pi@192.168.100.10
The authenticity of host '192.168.100.10 (192.168.100.10)' can't be established.
ECDSA key fingerprint is SHA256:I7nVT26pbAkykqkEx7wLcJbLwAER/FZDBpV+PlZOWOg.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.168.100.10' (ECDSA) to the list of known hosts.
pi@192.168.100.10's password:

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.

SSH is enabled and the default password for the 'pi' user has not been changed.
This is a security risk - please login as the 'pi' user and type 'passwd' to set a new password.
```

<a name="user-baru"></a>
## Membuat User Baru ##

Seperti kita lihat, Raspberry PI mengeluarkan peringatan bahwa default user `pi` tersebut merupakan resiko keamanan, karena semua orang tau username dan passwordnya. Untuk itu kita akan menghapus user `pi` dan menggantinya dengan user baru, misalnya namanya `endy`. User `endy` ini akan memiliki

Berikut perintahnya

```
$ sudo useradd -m -G $(groups | tr ' ' ',') endy
$ sudo passwd endy
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
```

Kemudian kita coba exit dan ssh lagi dengan user yang baru tersebut.

```
$ exit
$ ssh endy@192.168.100.10
```

<a name="hapus-user-pi"></a>
## Menghapus User pi ##

Selanjutnya, kita hapus user `pi` supaya benar-benar aman. Beberapa artikel menyarankan disable saja, tapi buat amannya ya kita hapus saja.

Command yang kita gunakan untuk membuat user `endy` tadi akan memasukkan user `endy` ke semua grup yang dimiliki user `pi`, termasuk grup `pi`. Sebelum menghapus user `pi`, kita harus terlebih dulu mengeluarkan user `endy` dari grup `pi`.

```
$ sudo deluser endy pi
```

Setelah itu baru kita bisa menghapus user `pi` berikut seluruh grup dan home foldernya.

```
$ sudo deluser --remove-home pi
```

<a name="keyboard-timezone"></a>
## Mengganti Keyboard dan Timezone ##

Karena Raspberry PI buatan Inggris, maka default keyboardnya adalah `UK`, bukan `US` seperti biasanya kita instal Linux. Di komputer saya, dampaknya tombol `"` akan menghasilkan karakter `@`. Untuk itu kita ganti dulu keyboardnya.

```
$ sudo nano /etc/default/keyboard
```

Kemudian ganti menjadi `US`

```
XKBLAYOUT="us"
```

Selanjutnya, kita ganti juga timezone.

```
$ sudo dpkg-reconfigure tzdata
```

<a name="update-upgrade"></a>
## Update dan Upgrade ##

Langkah standar, kita update dan upgrade dulu Raspbian-nya.

```
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get dist-upgrade -y && sudo apt-get autoclean && sudo reboot
```

<a name="passwordless-ssh"></a>
## Passwordless Login ##

Supaya bisa login tanpa password, kita perlu mendaftarkan public key komputer/laptop kita ke Raspberry PI.

```
$ ssh-copy-id endy@192.168.100.10
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/Users/endymuhardin/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
endy@192.168.100.10's password:

Number of key(s) added:        1

Now try logging into the machine, with:   "ssh 'endy@192.168.100.10'"
and check to make sure that only the key(s) you wanted were added.
```

Sekarang kita coba lagi login, harusnya kita tidak dimintai password.

Setelah berhasil, kita akan sama sekali mematikan password pada ssh. Jadi kalau belum mendaftarkan public key, tidak akan bisa login menggunakan password.

Edit file `/etc/ssh/sshd_config`

```
$ sudo nano /etc/ssh/sshd_config
```

Kemudian pasang konfigurasi berikut

```
PermitRootLogin no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
```

Kita bisa test dengan username yang public keynya belum kita daftarkan

```
$ ssh coba@192.168.100.10
Permission denied (publickey).
```

<a name="proteksi-brute-force-ssh"></a>
## Proteksi Brute Force SSH ##

Kita akan memblokir alamat IP yang berusaha mencoba SSH berkali-kali. Berikut rule `iptables`nya.

```
iptables -A INPUT -i eth0 -p tcp -m tcp --dport 22 -m state --state NEW -m recent --set --name SSH --rsource
iptables -A INPUT -i eth0 -p tcp -m tcp --dport 22 -m recent --rcheck --seconds 30 --hitcount 4 --rttl --name SSH --rsource -j REJECT --reject-with tcp-reset
iptables -A INPUT -i eth0 -p tcp -m tcp --dport 22 -m recent --rcheck --seconds 30 --hitcount 3 --rttl --name SSH --rsource -j LOG --log-prefix "SSH brute force "
iptables -A INPUT -i eth0 -p tcp -m tcp --dport 22 -m recent --update --seconds 30 --hitcount 3 --rttl --name SSH --rsource -j REJECT --reject-with tcp-reset
iptables -A INPUT -i eth0 -p tcp -m tcp --dport 22 -j ACCEPT
```

Penjelasan per baris:

1. Tandai semua paket yang menuju port `22` dengan nama `SSH`
2. Bila ada koneksi ke-4 dari asal (alamat IP) yang sama dalam 30 detik terakhir, langsung ditolak
3. Koneksi ke-3 dicatat di log dengan keyword `SSH brute force`
4. Setelah dilog, langsung ditolak
5. Sisanya (yaitu koneksi pertama dan kedua) diijinkan

Setelah perintah di atas dijalankan, firewallnya akan langsung aktif. Tetapi pada waktu restart, rule tersebut harus disave dulu. Caranya mudah, cukup pasang paket `iptables-persistent`

```
$ sudo apt-get install iptables-persistent -y
```

Pada waktu diinstal, dia akan menanyakan apakah rule yang kita pasang tadi ingin disave. Jawab saja iyes. Setelah selesai, dia akan simpan file ke `/etc/iptables/rules.v4`. Bisa kita cek dengan text editor.

```
$ sudo vim /etc/iptables/rules.v4
```

Ada beberapa filter tambahan yang biasa saya gunakan. Lengkapnya terlihat seperti ini

```
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]

# Allows all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT

# Accepts all established inbound connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allows all outbound traffic
# You could modify this to only allow certain traffic
-A OUTPUT -j ACCEPT

# SSH Brute Force Protection
-A INPUT -i eth0 -p tcp -m tcp --dport 22 -m state --state NEW -m recent --set --name SSH --rsource
-A INPUT -i eth0 -p tcp -m tcp --dport 22 -m recent --rcheck --seconds 30 --hitcount 4 --rttl --name SSH --rsource -j REJECT --reject-with tcp-reset
-A INPUT -i eth0 -p tcp -m tcp --dport 22 -m recent --rcheck --seconds 30 --hitcount 3 --rttl --name SSH --rsource -j LOG --log-prefix "SSH brute force "
-A INPUT -i eth0 -p tcp -m tcp --dport 22 -m recent --update --seconds 30 --hitcount 3 --rttl --name SSH --rsource -j REJECT --reject-with tcp-reset
-A INPUT -i eth0 -p tcp -m tcp --dport 22 -j ACCEPT

# log iptables denied calls (access via 'dmesg' command)
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

# Reject all other inbound - default deny unless explicitly allowed policy:
-A INPUT -j REJECT
-A FORWARD -j REJECT
COMMIT
```

Kita bisa test dengan membuka beberapa terminal sekaligus dan mencoba ssh ke komputer tersebut. Kita akan lihat bahwa dua koneksi pertama diterima, sedangkan koneksi berikutnya ditolak.

[![Test SSH Brute Force]({{site.url}}/images/uploads/2017/raspi-hardening/ssh-bruteforce-demo.png)]({{site.url}}/images/uploads/2017/raspi-hardening/ssh-bruteforce-demo.png)

Kita bisa lihat bahwa insiden tersebut sudah dilog dengan perintah `dmesg`. Outputnya kira-kira seperti ini

```
SSH brute force IN=eth0 OUT= MAC=30:85:a9:47:f6:9c:e4:8d:8c:7b:3c:a5:08:00 SRC=192.168.44.1 DST=192.168.44.252 LEN=64 TOS=0x00 PREC=0x00 TTL=63 ID=14346 DF PROTO=TCP SPT=50169 DPT=22 WINDOW=65535 RES=0x00 SYN URGP=0
```

<a name="automount-usb-debian"></a>
## Automount USB ##

Jaman sekarang, USB flashdisk/harddisk sudah menjadi kebutuhan umum. Apalagi kalau kita ingin membuat home theater. Kita ingin pada saat ditancapkan, flashdisknya otomatis dimount. Kita juga ingin agar disk yang berformat `NTFS` bisa dibaca dengan baik.

Pertama, install dulu paket yang dibutuhkan

```
sudo apt-get install usbmount ntfs-3g
```

Kemudian, kita edit file `/etc/usbmount/usbmount.conf` agar bisa mounting otomatis. Berikut isinya

```
FILESYSTEMS="vfat ntfs fuseblk ext2 ext3 ext4 hfsplus"
FS_MOUNTOPTIONS="-fstype=ntfs-3g,nls=utf8,umask=007,gid=46 -fstype=fuseblk,nls=utf8,umask=007,gid=46 -fstype=vfat,gid=1000,uid=1000,umask=007"
```

Edit juga file `/etc/udev/rules.d/usbmount.rules` sebagai berikut

```
KERNEL=="sd*", DRIVERS=="sbp2",         ACTION=="add",  PROGRAM="/bin/systemd-escape -p --template=usbmount@.service $env{DEVNAME}", ENV{SYSTEMD_WANTS}+="%c"
KERNEL=="sd*", SUBSYSTEMS=="usb",       ACTION=="add",  PROGRAM="/bin/systemd-escape -p --template=usbmount@.service $env{DEVNAME}", ENV{SYSTEMD_WANTS}+="%c"
KERNEL=="ub*", SUBSYSTEMS=="usb",       ACTION=="add",  PROGRAM="/bin/systemd-escape -p --template=usbmount@.service $env{DEVNAME}", ENV{SYSTEMD_WANTS}+="%c"
KERNEL=="sd*",                          ACTION=="remove",       RUN+="/usr/share/usbmount/usbmount remove"
KERNEL=="ub*",                          ACTION=="remove",       RUN+="/usr/share/usbmount/usbmount remove"
```

Dan juga file `/etc/systemd/system/usbmount@.service`

```
[Unit]
BindTo=%i.device
After=%i.device

[Service]
Type=oneshot
TimeoutStartSec=0
Environment=DEVNAME=%I
ExecStart=/usr/share/usbmount/usbmount add
RemainAfterExit=yes
```

Kita bisa coba tancapkan flashdisk, kemudian liat isi file `/etc/mtab` atau jalankan perintah `mount` untuk melihat ke folder mana flashdisk tersebut dimount.


## Penutup ##

Nah demikian panduan instalasi Raspberry Pi dengan Raspbian Lite. Mudah-mudahan bermanfaat, terutama buat saya sendiri yang sering instal ulang :D

## Referensi ##
* https://www.reddit.com/r/raspberry_pi/comments/1z31qh/10_things_to_do_after_setting_up_raspberry_pi/?st=j2px1hpz&sh=9507aacd
* https://www.raspberrypi.org/documentation/remote-access/ssh/
* https://www.raspberrypi.org/documentation/configuration/wireless/wireless-cli.md
https://raspberrypi.stackexchange.com/a/42103
* https://serverfault.com/a/544583/400761
