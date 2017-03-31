---
layout: post
title: "Instalasi Jenkins dengan SSL"
date: 2017-01-22 07:00
comments: true
categories:
- java
---
Hampir setahun yang lalu, saya menulis serangkaian artikel yang terdiri dari 4 artikel mengenai [cara setup project Java](http://software.endy.muhardin.com/java/project-bootstrap-01/), [konfigurasi continuous integration](http://software.endy.muhardin.com/java/project-bootstrap-02/), [deployment ke Heroku dan Openshift](http://software.endy.muhardin.com/java/project-bootstrap-03/), dan [continuous delivery](http://software.endy.muhardin.com/java/project-bootstrap-04/) supaya tiap kali programmer commit, aplikasi langsung terdeploy ke server testing. Akan tetapi, artikel tersebut hanya cocok buat project open source yang source codenya tersedia bebas di Github, sehingga kita bisa menggunakan layanan gratis seperti Travis dan Coveralls. Bila kita ingin menggunakannya untuk project yang tidak publik (misalnya project yang dibayar oleh client, ataupun produk yang tidak kita rilis source codenya), kita harus membayar cukup mahal untuk menggunakan layanan Github, Travis, dan Coveralls tersebut.

Untuk itu, sekarang saya akan menulis lagi panduan untuk membuat workflow yang serupa, tapi untuk project privat. Konfigurasinya adalah sebagai berikut:

* source code disimpan di repository [Gitlab](https://about.gitlab.com/) yang terinstal di server sendiri dan tidak bisa diakses umum.
* build dilakukan dengan [Jenkins](http://jenkins-ci.org/) yang juga terinstal di server sendiri.
* deployment dilakukan ke penyedia layanan cloud, tapi versi berbayar. Saya akan gunakan [Pivotal Web Services](http://run.pivotal.io/) yang saat artikel ini ditulis paling kompetitif harganya.
<!--more-->
Pada bagian pertama ini (atau kelima kalau dihitung dari seri terdahulu), kita akan membahas dulu cara instalasi Jenkins. Adapun cara instalasi Gitlab tidak saya bahas karena amat sangat terlalu mudah. Silahkan ikuti [panduannya](https://about.gitlab.com/downloads/#ubuntu1604).

## Instalasi VPS ##

Untuk menghosting Jenkins, kita akan gunakan [Digital Ocean](https://m.do.co/c/910ad80271f7).

Berikut langkah instalasinya. Saya menggunakan [aplikasi command line resmi dari DigitalOcean](https://github.com/digitalocean/doctl)

* siapkan VPS di DigitalOcean. Saya gunakan yang berukuran 2GB karena berdasarkan pengalaman, yang 512MB dan 1GB sering error kehabisan memori

		doctl compute droplet create vps-jenkins --size=2gb --image ubuntu-16-04-x64 --region nyc1

    hasilnya seperti ini

		ID          Name           Public IPv4    Private IPv4    Public IPv6    Memory    VCPUs    Disk    Region    Image                 Status    Tags
		44271929    vps-jenkins                                                  2048      2        40      nyc1      Ubuntu 16.04.2 x64    new       

* Lihat IP Address VPS yang baru kita buat

		doctl compute droplet list

	hasilnya seperti ini

		ID          Name                    Public IPv4       Private IPv4    Public IPv6    Memory    VCPUs    Disk    Region    Image                   Status    Tags
		44271929    vps-jenkins             67.205.183.31                                    2048      2        40      nyc1      Ubuntu 16.04.2 x64      active    


* Login ssh ke dalam VPS

        ssh root@67.205.183.31

    Outputnya

        Attempting SSH: root@216.58.221.69
        SShing with options: -o LogLevel=ERROR -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o IdentitiesOnly=yes -i /Users/endymuhardin/.ssh/id_rsa -p 22 root@216.58.221.69
        Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-59-generic x86_64)

         * Documentation:  https://help.ubuntu.com
         * Management:     https://landscape.canonical.com
         * Support:        https://ubuntu.com/advantage

          Get cloud support with Ubuntu Advantage Cloud Guest:
            http://www.ubuntu.com/business/services/cloud

        0 packages can be updated.
        0 updates are security updates.


* Perbaiki Perl warning. Secara default, hasil instalasi Ubuntu standar dari DO akan menghasilkan warning berikut

        perl: warning: Setting locale failed.
        perl: warning: Please check that your locale settings:
            LANGUAGE = (unset),
            LC_ALL = (unset),
            LC_CTYPE = "UTF-8",
            LANG = "en_US.UTF-8"
            are supported and installed on your system.
        perl: warning: Falling back to a fallback locale ("en_US.UTF-8").
        locale: Cannot set LC_CTYPE to default locale: No such file or directory
        locale: Cannot set LC_ALL to default locale: No such file or directory

    Untuk mengatasinya, jalankan perintah berikut

        echo 'LC_ALL="en_US.UTF-8"' >> /etc/environment

    Setelah itu logout dan login lagi agar perubahan tersebut dijalankan.

* Update dan upgrade dulu supaya up-to-date

        apt-get update && apt-get upgrade -y

* Instalasi Java, Maven, dan Jenkins

		apt-get install openjdk-8-jdk-headless maven jenkins -y

Seharusnya Jenkins sudah bisa diakses di port 8080. Dia akan meminta kita mengeset password. Tapi tidak perlu dijalankan dulu.

![Jenkins Starter Page]({{ site.url }}/images/uploads/2017/jenkins-ssl/jenkins-starter.png)

## Setup SSL ##

Jaman sekarang, SSL sudah mudah dan murah (baca: gratis). Internet Security Research Group telah menyediakan layanan [Let's Encrypt](https://letsencrypt.org/) yang memberikan sertifikat SSL gratis untuk semua orang. Cara kerjanya bisa dibaca [di sini](https://letsencrypt.org/how-it-works/). Dia juga menyediakan aplikasi untuk memudahkan kita mendapatkan dan memperpanjang sertifikat SSL secara otomatis.

Kita akan meminta sertifikat SSL untuk domain jenkins.artivisi.com. Tentunya agar domain ini bisa dikenali, kita harus menambahkan `A` record di DNS Server kita untuk mengarahkan domain `jenkins.artivisi.com` ke IP server, yaitu `216.58.221.69`. Cara pendaftaran DNS ini tidak saya bahas, karena metodenya sangat berbeda tergantung penyedia domain yang digunakan. Silahkan hubungi orang yang mengurus domain Anda untuk mengetahui caranya.

Berikut langkah-langkah pemakaian Let's Encrypt.

* Instalasi Let's Encrypt untuk membuat sertifikat SSL

        apt-get install letsencrypt -y

Pada saat menginstal package `letsencrypt` tersebut, sebenarnya kita menginstal aplikasi bernama `certbot` yang berguna untuk mengotomasi proses pembuatan sertifikat SSL. Aplikasi `certbot` ini memiliki beberapa plugin untuk memudahkan konfigurasi webserver yang sering dipakai orang, diantaranya:

* apache
* nginx
* webroot : untuk membuat sertifikat di server yang memiliki beberapa virtualhost
* standalone : bila kita ingin menyuruh `certbot` melakukan verifikasi dengan menjalankan webservernya sendiri
* manual : bila kita ingin membuat sertifikat SSL untuk mesin lain

Kita akan menggunakan mode `standalone` karena Jenkins menggunakan application server Jetty yang tidak disupport oleh `certbot`.

Berikut perintah yang dijalankan

```
letsencrypt certonly --standalone-supported-challenges tls-sni-01 -d jenkins.artivisi.com --email endy.muhardin@gmail.com --agree-tos
```

Outputnya

```
IMPORTANT NOTES:
 - If you lose your account credentials, you can recover through
   e-mails sent to endy.muhardin@gmail.com.
 - Congratulations! Your certificate and chain have been saved at
   /etc/letsencrypt/live/jenkins.artivisi.com/fullchain.pem. Your cert
   will expire on 2017-04-22. To obtain a new version of the
   certificate in the future, simply run Let's Encrypt again.
 - Your account credentials have been saved in your Let's Encrypt
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Let's
   Encrypt so making regular backups of this folder is ideal.
 - If you like Let's Encrypt, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

Sertifikat SSL dari Letsencrypt hanya berlaku selama 90 hari. Agar tidak repot memperpanjang setiap 3 bulan, kita gunakan fitur `autorenew`. Coba test dulu perintahnya sebagai berikut

```
letsencrypt renew --dry-run
```

Outputnya

```
Processing /etc/letsencrypt/renewal/jenkins.artivisi.com.conf
2017-01-22 11:08:11,907:WARNING:letsencrypt.client:Registering without email!
** DRY RUN: simulating 'letsencrypt renew' close to cert expiry
**          (The test certificates below have not been saved.)

Congratulations, all renewals succeeded. The following certs have been renewed:
  /etc/letsencrypt/live/jenkins.artivisi.com/fullchain.pem (success)
** DRY RUN: simulating 'letsencrypt renew' close to cert expiry
**          (The test certificates above have not been saved.)

IMPORTANT NOTES:
 - Your account credentials have been saved in your Let's Encrypt
   configuration directory at /etc/letsencrypt. You should make a
   secure backup of this folder now. This configuration directory will
   also contain certificates and private keys obtained by Let's
   Encrypt so making regular backups of this folder is ideal.
```

Proses renewal sudah bisa dijalankan dengan baik. Kita bisa mendaftarkan perintah ini ke `crontab` agar berjalan dua kali sehari. Jangan khawatir kalau frekuensinya terlalu sering, karena perintah `renew` ini boleh dijalankan walaupun sertifikat kita belum kadaluarsa. Bila kita jalankan outputnya seperti ini

```
letsencrypt renew
```

Outputnya seperti ini

```
Processing /etc/letsencrypt/renewal/jenkins.artivisi.com.conf

The following certs are not due for renewal yet:
  /etc/letsencrypt/live/jenkins.artivisi.com/fullchain.pem (skipped)
No renewals were attempted.
```

Karena proses renew ini akan menggunakan port 443, maka kita harus mematikan Jenkins dulu sebelum scriptnya berjalan. Setelah selesai renew, kita jalankan lagi Jenkins. Bila digabungkan maka perintahnya sebagai berikut.

```
service jenkins stop && letsencrypt renew && service jenkins start
```

Setelah semuanya berjalan dengan baik, kita jalankan perintahnya dengan `cron` agar berjalan otomatis. Kita jadwalkan dua kali sehari dengan menit acak, sesuai [rekomendasi dari Let's Encrypt](https://certbot.eff.org/#ubuntuxenial-other).

> If you're setting up a cron or systemd job, we recommend running it twice per day (it won't do anything until your certificates are due for renewal or revoked, but running it regularly would give your site a chance of staying online in case a Let's Encrypt-initiated revocation happened for some reason). Please select a random minute within the hour for your renewal tasks.

Berikut adalah isi dari file crontabnya

```
SHELL=/bin/bash

0 */12 * * * sleep $((RANDOM*3600/32768)) && /etc/jenkins/ssl/renew-jenkins-ssl.sh

```

Script `renew-jenkins-ssl.sh` berisi langkah-langkah konversi dari sertifikat yang dihasilkan Let's Encrypt menjadi format `JKS` yang biasa digunakan application server Java. Lebih detailnya sudah pernah dibahas pada [artikel saya terdahulu](http://software.endy.muhardin.com/aplikasi/memasang-sertifikat-ssl/).

Berikut isi dari script tersebut

```bash
#!/bin/bash

service jenkins stop

letsencrypt renew

rm /etc/jenkins/ssl/jenkins.jks

openssl pkcs12 -export \
-inkey /etc/letsencrypt/live/jenkins.artivisi.com/privkey.pem \
-in /etc/letsencrypt/live/jenkins.artivisi.com/cert.pem \
-certfile /etc/letsencrypt/live/jenkins.artivisi.com/chain.pem \
-name "jenkins.artivisi.com" \
-passout "pass:rahasia" \
-out /etc/jenkins/ssl/jenkins.p12

keytool -importkeystore \
-srcstoretype PKCS12 \
-srckeystore /etc/jenkins/ssl/jenkins.p12 \
-srcstorepass "rahasia" \
-deststorepass 'rahasia' \
-destkeystore /etc/jenkins/ssl/jenkins.jks

rm /etc/jenkins/ssl/jenkins.p12

service jenkins start
```

Yang harus diperhatikan pada saat membuat script di atas adalah : **password pada saat membuat file p12 harus sama dengan password file JKS**. Bila tidak sama, maka Jenkins akan mengeluarkan pesan error

```
java.security.UnrecoverableKeyException: Cannot recover key
```

## Memasang SSL di Jenkins ##

Seperti bisa dibaca pada script di atas, dia akan membuat file `/etc/jenkins/ssl/jenkins.jks` dengan password `rahasia`. Ini akan kita pasang di konfigurasi Jenkins. Untuk Ubuntu, file konfigurasinya ada di `/etc/default/jenkins`

Berikut adalah beberapa perubahan yang kita lakukan.

* Matikan port HTTP, dan nyalakan port HTTPS

```
HTTP_PORT=-1
HTTPS_PORT=8443
```

* Lokasi keystore dan passwordnya

```
KEY_STORE=/etc/jenkins/ssl/jenkins.jks
KEY_STORE_PASS=rahasia
```

* Opsi untuk menjalankan Jenkins. Tadinya seperti ini

        JENKINS_ARGS="--webroot=/var/cache/$NAME/war --httpPort=$HTTP_PORT"

    menjadi seperti ini

        JENKINS_ARGS="--webroot=/var/cache/$NAME/war --httpPort=$HTTP_PORT --httpsPort=$HTTPS_PORT --httpsKeyStore=$KEY_STORE --httpsKeyStorePassword=$KEY_STORE_PASS"

Setelah selesai mengedit, kita bisa restart Jenkins dengan perintah

```
service jenkins restart
```

Harusnya Jenkins sudah bisa diakses di alamat `https://jenkins.artivisi.com:8443`.

## Konfigurasi Port Forwarding ##

Kita ingin Jenkins bisa diakses tanpa menyebutkan port, yaitu di `https://jenkins.artivisi.com`. Untuk itu, kita lakukan redirect menggunakan `iptables`. Kita install dulu paket `iptables-persistent` agar setting firewall kita tidak hilang pada saat reboot.

```
apt-get install iptables-persistent -y
```

Kita akan ditanyakan apakah akan menyimpan setting saat ini. Jawab saja `No` karena kita belum mengkonfigurasi firewall.

Sebelum mengkonfigurasi firewall dengan `iptables`, terlebih dulu kita aktifkan settingnya di kernel. Jalankan perintah berikut di command line

```
echo 1 > /proc/sys/net/ipv4/ip_forward
echo 1 > /proc/sys/net/ipv4/conf/eth0/route_localnet
```

Agar tidak hilang pada waktu reboot, tambahkan baris berikut di `/etc/sysctl.conf`

```
net.ipv4.ip_forward=1
net.ipv4.conf.eth0.route_localnet = 1
```

Setelah itu, barulah kita pasang rule firewall. Jalankan perintah berikut di command line

```
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8443
```

Untuk memahami perintah ini, silahkan baca artikel terdahulu tentang [Network Address Translation](http://software.endy.muhardin.com/linux/network-address-translation/)

Agar rule firewall ini tersimpan dan dijalankan setiap servernya reboot, maka kita gunakan aplikasi `iptables-persistent` yang sudah kita install tadi. Jalankan perintah berikut

```
dpkg-reconfigure iptables-persistent
```

Kita akan disajikan pertanyaan apakah ingin menyimpan setting firewall yang aktif saat ini, mirip seperti pada waktu baru menginstall `iptables-persistent` tadi.

![Konfirmasi simpan setting firewall]({{ site.url }}/images/uploads/2017/jenkins-ssl/save-firewall.png)

Jawab `Yes` untuk kedua pertanyaan. Hasilnya bisa dipastikan dengan melihat isi `/etc/iptables/rules.v4`. Kira-kira seperti ini isinya

```
# Generated by iptables-save v1.6.0 on Mon Jan 23 04:50:46 2017
*nat
:PREROUTING ACCEPT [33:1840]
:INPUT ACCEPT [86:5016]
:OUTPUT ACCEPT [1:83]
:POSTROUTING ACCEPT [1:83]
-A PREROUTING -i eth0 -p tcp -m tcp --dport 443 -j REDIRECT --to-ports 8443
COMMIT
# Completed on Mon Jan 23 04:50:46 2017
# Generated by iptables-save v1.6.0 on Mon Jan 23 04:50:46 2017
*filter
:INPUT ACCEPT [78:8933]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [64:15339]
COMMIT
# Completed on Mon Jan 23 04:50:46 2017
```

Setelah itu, kita perlu mengkonfigurasi Jenkins URL, karena kita memalsukan portnya, aslinya jalan di 8443, tapi diakses di 443. Berikut Konfigurasinya

![Konfigurasi Jenkins URL]({{ site.url }}/images/uploads/2017/jenkins-ssl/jenkins-url.png)

Bila kita lupa, nanti Jenkins akan komplain bahwa reverse proxy belum dikonfigurasi dengan benar. Seperti ini pesan errornya

![Reverse Proxy Broken]({{ site.url }}/images/uploads/2017/jenkins-ssl/reverse-proxy-broken.png)


## Penutup ##

Selesai sudah konfigurasi Jenkins kita lengkap dengan SSL dan custom domain. Selanjutnya, kita bisa mulai [menambahkan project untuk dibuild secara otomatis dan periodik](http://software.endy.muhardin.com/java/jenkins-gitlab/). Stay tuned.

## Referensi ##

* [Tutorial Resmi Cara Instalasi Jenkins di Ubuntu](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu)
* [Cara Konfigurasi SSL di Jenkins](http://sam.gleske.net/blog/engineering/2016/05/04/jenkins-with-ssl.html)
* [Cara Setting Iptables di Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-using-iptables-on-ubuntu-14-04)
* [Cara menggunakan `iptables-persistent`](http://unix.stackexchange.com/a/125841)
