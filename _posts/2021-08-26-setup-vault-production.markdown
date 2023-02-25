---
layout: post
title: "Setup Vault untuk Production"
date: 2021-08-26 07:14
comments: true
categories: 
- devops
---

Pada [artikel sebelumnya]({% post_url 2021-08-23-enkripsi-data-di-aplikasi %}), kita telah mengamankan aplikasi kita supaya data pribadi yang kita tampung di aplikasi dapat diamankan dengan baik. Solusinya adalah menggunakan [Vault](https://vaultproject.io).

Kali ini, kita akan membahas instalasi dan konfigurasi Vault untuk kita pasang di production server. Setup yang kita akan bahas adalah setup minimalis dengan satu node saja. Apabila terjadi error terhadap node tersebut, maka akan ada downtime sementara kita menyiapkan node pengganti dan melakukan restorasi data.

<!--more-->

## Persiapan VPS ##

Kita akan menggunakan Ubuntu versi terbaru pada saat artikel ini ditulis, yaitu versi 20.04. Terlebih dulu kita update dan upgrade paket-paket yang sudah terinstal.

```
apt update && apt upgrade -y
```

Selanjutnya, kita konfigurasi nama domain dan arahkan ke alamat IP publik VPS kita. Pada contoh ini, nama domain kita tentukan `vault.artivisi.id` yang mengarah ke IP `111.222.121.212`. 

## Instalasi Aplikasi ##

Berikut adalah daftar aplikasi yang perlu kita instal:

* letsencrypt dan certbot
* MySQL / MariaDB / PostgreSQL apabila ingin menggunakan database storage

Letsencrypt dan certbot diinstal menggunakan `snap`. Update dulu daftar paketnya

```
sudo snap install core; sudo snap refresh core
```

Kemudian install `certbot`

```
sudo snap install --classic certbot
```

Untuk database server, diinstal menggunakan `apt`

```
apt install letsencrypt mariadb-server -y
```

`mariadb-server` bisa diganti `mysql-server` atau `postgresql-server` sesuai selera.

## Instalasi Vault ##

Vault memiliki repository sendiri untuk file installernya. Kita tambahkan dulu repository Vault ke Ubuntu.

Jalankan perintah berikut untuk mendaftarkan signature repository Vault ke Ubuntu.

```
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
```

Lalu tambahkan repository

```
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
```

Update dan install

```
sudo apt-get update && sudo apt-get install vault
```

Setelah instalasi selesai, harusnya akan terbentuk folder `/opt/vault` dan `/etc/vault.d`.

Kita akan melanjutkan konfigurasi Vault setelah kelengkapan yang lain kita instal.

## Generate Sertifikat SSL ##

Kita membutuhkan sertifikat SSL supaya komunikasi aplikasi kita dengan Vault terenkripsi. Dan juga apabila kita menggunakan browser untuk melihat isi Vault, kita juga akan menggunakan koneksi HTTPS.

Sebelum kita generate sertifikat, pastikan DNS sudah disetting dengan benar. Coba cek di layanan whois untuk memastikan `vault.artivisi.id` sudah mengarah ke `111.222.121.212`.

Selanjutnya, kita generate sertifikat dengan metode `standalone`. Certbot akan membuka port 80 untuk melakukan verifikasi. Pastikan di VPS yang digunakan tidak ada webserver lain yang sedang aktif.

```
certbot --standalone -d vault.artivisi.id
```

Bila prosesnya berjalan lancar, kita akan memiliki sertifikat SSL di folder `/etc/letsencrypt/live/vault.artivisi.id`. Ada 2 file yang kita butuhkan:

* `fullchain.pem` : sertifikat SSL lengkap dengan rantai sampai ke CA LetsEncrypt
* `privkey.pem` : private key, pasangan dari sertifikat SSL

Sebelumnya Vault telah membuatkan file self-signed certificate. Kita timpa dan gantikan dengan sertifikat yang digenerate oleh LetsEncrypt.

Copy file `fullchain.pem` dan `privkey.pem` ke folder Vault.

```
cp /etc/letsencrypt/live/vault.artivisi.id/fullchain.pem /opt/vault/tls/tls.crt
cp /etc/letsencrypt/live/vault.artivisi.id/privkey.pem /opt/vault/tls/tls.key
```

Kemudian set kepemilikan dan ijin aksesnya

```
chmod vault:vault /opt/vault/tls/*
chown 600 /opt/vault/tls/*
```

## Setup Database Server ##

Langkah ini sebetulnya opsional. Tidak wajib. Ini kita lakukan kalau mau data Vault tersimpan di database server. Instalasi default Vault di Ubuntu menyimpan data dalam file di folder `/opt/vault/data`. Kadangkala ada sysadmin yang lebih suka melakukan backup database daripada folder.

Jadi, silahkan lakukan langkah ini kalau dirasa perlu.

Pertama, kita siapkan username dan password untuk koneksi database. Kemudian buat databasenya.

* MySQL / MariaDB

```
create user vault@localhost identified by 'vaultpassword123';
grant all on vaultdb.* to vault@localhost;
create database vaultdb;
```

* PostgreSQL

```
createuser -P vault
createdb -Ovault vaultdb
```

Lalu, kita konfigurasi database storage di `/etc/vault.d/vault.hcl`

Berikut konfigurasi untuk MySQL/MariaDB

```
storage "mysql"{
  username = "vault"
  password = "vaultpassword123"
  database = "vaultdb"
  plaintext_connection_allowed = true
}
```

PostgreSQL konfigurasinya relatif panjang. Lebih baik langsung merujuk ke [dokumentasi resmi](https://www.vaultproject.io/docs/configuration/storage/postgresql). Kalau saya tulis di sini khawatir akan berubah di kemudian hari.

Bila kita tidak menggunakan database, kita sudah disediakan konfigurasi oleh installer Vault seperti ini

```
storage "file" {
  path = "/opt/vault/data"
}
```

Biarkan saja apa adanya. Vault akan menyimpan data kita dalam kondisi terenkripsi di folder tersebut. Kita bisa melakukan backup terhadap folder tersebut. Untuk amannya, kita bisa melakukan backup pada waktu kondisi kegiatan sedang sepi, atau sekalian matikan Vault.

## Inisialisasi Vault ##

Setelah konfigurasi SSL dan storage selesai, kita bisa menyalakan Vault. Berikut perintahnya

```
systemctl start vault
```

Outputnya seperti ini 

```
Started "HashiCorp Vault - A tool for managing secrets".
==> Vault server configuration:
             Api Address: https://vault.artivisi.id:8200
                     Cgo: disabled
         Cluster Address: https://vault.artivisi.id:8201
              Go Version: go1.16.6
              Listener 1: tcp (addr: "0.0.0.0:8200", cluster address: "0.0.0.0:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "enabled")
               Log Level: info
                   Mlock: supported: true, enabled: true
           Recovery Mode: false
                 Storage: file
                 Version: Vault v1.8.1
             Version Sha: 4b0264f28defc05454c31277cfa6ff63695a458d
==> Vault server started! Log data will stream in below:
2021-08-26T06:12:32.424Z [INFO]  proxy environment: http_proxy="" https_proxy="" no_proxy=""
```

Selanjutnya, kita bisa membuka `https://vault.artivisi.id:8200` di browser. Tampilannya seperti ini

[![Inisialisasi Vault]({{site.url}}/images/uploads/2021/setup-vault-production/01-set-num-key.png)]({{site.url}}/images/uploads/2021/setup-vault-production/01-set-num-key.png)

Kita diminta menentukan berapa orang yang akan memegang `key` untuk menjalankan Vault dalam kondisi `unsealed`, yaitu kondisi operasional aktif dan siap menjalankan tugas. Ada dua hal yang harus ditentukan di sini, yaitu:

* berapa orang yang akan pegang `key`
* berapa minimal orang yang harus hadir untuk melakukan `unseal` / mengaktifkan Vault

Inisialisasi `master key` ini disebut dengan istilah [Key Management Ceremony](https://en.wikipedia.org/wiki/Key_ceremony). Tata cara pemilihan pemegang key, prosedur pembuatan key, dan rincian lainnya bisa dibaca di [panduan ICANN](https://www.iana.org/dnssec/procedures/ksk-operator/KSK_Key_Management_Procedure_v3.3.pdf). Penjelasannya bisa ditonton di video berikut

<iframe width="560" height="315" src="https://www.youtube.com/embed/XU5_Uv4EDV8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Master key ini nantinya akan digunakan untuk membuat key turunan, dan key turunan ini akan digunakan untuk mengenkripsi data. Jadi bila key ini sampai hilang, maka seluruh data kita yang terenkripsi tidak akan bisa dibuka. Oleh karena itu, kita harus mendistribusikan key ini ke sejumlah orang sehingga:

* bila salah satu atau lebih berhalangan (sakit, meninggal, bepergian, dan sebagainya), Vault tetap bisa diaktifkan
* sulit untuk terjadi fraud, karena untuk melakukan fraud dibutuhkan kolaborasi dari sejumlah orang

Idealnya, master key didistribusikan ke beberapa pejabat penting di departemen yang berbeda. Untuk artikel ini, kita contohkan distribusi master key ke 5 orang, dengan minimal 3 orang untuk melakukan `unseal`.

[![Menentukan jumlah key dan minimum unseal]({{site.url}}/images/uploads/2021/setup-vault-production/02-5-key-3-minimum.png)]({{site.url}}/images/uploads/2021/setup-vault-production/02-5-key-3-minimum.png)

Klik `Initialize`, Vault akan membuat 5 key dan 1 root token. Key dan token ini akan tampil di halaman web atau command prompt, tergantung apakah kita menggunakan Web UI atau Command Line. Sebetulnya cara ini kurang secure, karena si operator yang melakukan inisialisasi bisa melihat (dan menyimpan) semua key.

[![Hasil generate 5 key dan 1 token]({{site.url}}/images/uploads/2021/setup-vault-production/03-key-result.png)]({{site.url}}/images/uploads/2021/setup-vault-production/03-key-result.png)

Cara yang lebih secure adalah menggunakan GPG. Untuk itu, kita harus memiliki public key dari masing-masing pemegang kunci. Cara membuat private dan public key dengan GPG bisa dibaca di [artikel ini]({% post_url 2015-08-19-menggunakan-gpg %}) atau ditonton di video ini

<iframe width="560" height="315" src="https://www.youtube.com/embed/IXmP8Oag3KM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Misalnya kita memiliki 5 user untuk memegang key, dengan GPG public key masing-masing adalah:

* endy.pub
* anggi.pub
* dadang.pub
* ivans.pub
* iqbal.pub

Maka perintah untuk menggenerate key, mengenkripsi key tersebut, dan menampilkan hasilnya dalam bentuk terenkripsi sesuai public key masing-masing adalah sebagai berikut:

```
vault operator init -key-shares=5 -key-threshold=3 \
    -pgp-keys="endy.pub,anggi.pub,dadang.pub,ivans.pub,iqbal.pub"
```

Outputnya seperti ini

```
Key 1: wcBMA37rwGt6FS1VAQgAk1q8XQh6yc...
Key 2: wcBMA0wwnMXgRzYYAQgAavqbTCxZGD...
Key 3: wcFMA2DjqDb4YhTAARAAeTFyYxPmUd...
Key 4: wcFMAw0SPiCRMPCuAcxybCRqhF35Hf...
Key 5: wcBMAUS8ElQh9BLgzuq0nq/+hBYszJ...
```

Key yang dihasilkan tampil dalam bentuk terenkripsi. Untuk melihat isi key yang asli, perlu didekripsi dulu menggunakan private key dari masing-masing user yang disebutkan dalam perintah command line. Urutan key yang tampil di output sesuai dengan urutan penyebutan public key di command yang kita jalankan. 

Selanjutnya, untuk mengaktifkan Vault, kita harus melakukan `Unseal`. Berikut tampilannya

[![Prosedur Unseal]({{site.url}}/images/uploads/2021/setup-vault-production/04-unseal.png)]({{site.url}}/images/uploads/2021/setup-vault-production/04-unseal.png)

Bila `unseal key` ada dalam format terenkripsi (karena menggunakan GPG), maka kita bisa menampilkan key aslinya dengan perintah berikut

```
echo "wcBMA37..." | base64 --decode | gpg -dq
```

Tentunya perintah `gpg -dq` tersebut hanya bisa dijalankan di komputer yang terpasang private key GPG.

Kita harus memasukkan key sejumlah yang kita tentukan pada `minimum threshold` di langkah sebelumnya. Setelah semua key dimasukkan, maka Vault akan berada dalam kondisi `Unsealed` dan siap digunakan. Ini bisa dilihat dari indikator di kanan atas yang berwarna hijau.

[![Login]({{site.url}}/images/uploads/2021/setup-vault-production/05-root-login.png)]({{site.url}}/images/uploads/2021/setup-vault-production/05-root-login.png)

Kita bisa login dengan `Root Token` yang ikut digenerate bersama perintah `Initialize` tadi. Setelah login, maka kita bisa melihat isi database Vault.

[![Isi Vault]({{site.url}}/images/uploads/2021/setup-vault-production/06-login-success.png)]({{site.url}}/images/uploads/2021/setup-vault-production/06-login-success.png)

Setelah login, maka kita bisa:

* mendaftarkan aplikasi yang dibolehkan mengakses Vault
* memasukkan data rahasia ke dalam vault, misalnya : credential untuk mengakses database, API key, dan sebagainya

Demikianlah cara instalasi dan konfigurasi Vault secara minimalis. Tentunya untuk skala production yang besar, kita harus menjalankan Vault dengan konfigurasi High Availability dan pengaturan Policy yang komplit. Tapi untuk keperluan aplikasi sederhana, yang seperti ini sudah memadai.

Selamat mencoba. Semoga bermanfaat ...