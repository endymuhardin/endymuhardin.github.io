---
layout: post
title: "VPN dengan Wireguard Bagian V : Menghubungkan Cloud dengan On Premise"
date: 2021-01-03 07:00
comments: true
categories:
- devops
---

Di awal 2021 ini, cloud services sudah sangat lazim digunakan orang di seluruh dunia, termasuk di Indonesia. Skema tagihannya yang bisa per jam dan kecepatan provisioningnya memungkinkan banyak usaha rintisan (start up company) untuk bisa memulai bisnisnya dengan cepat dan murah. 

Yang tadinya harus menyediakan modal besar untuk membeli server, melakukan instalasi, membuat atau menyewa data center, menyediakan listrik, disaster recovery, dan pos investasi lain yang nilainya besar, sekarang tidak perlu lagi memusingkan hal tersebut. Cukup bikin akun, masukkan data kartu kredit, dan kita bisa langsung membuat virtual private server yang memiliki IP public dan siap diakses dari mana saja.

Akan tetapi, tidak semua orang bisa memanfaatkan cloud services. Beberapa jenis industri mengharuskan data transaksi disimpan di dalam negeri, sedangkan penyedia cloud services tidak banyak yang memiliki data center di Indonesia. Untuk itu, kita perlu solusi untuk menghubungkan VPS kita di cloud provider dengan database server kita di data center sendiri.

Salah satu contoh kegunaannya adalah apabila kita ingin menggunakan layanan serverless semacam AWS Lambda untuk mengakses database kita di data center on premise.

Skema tersebut diilustrasikan seperti pada gambar berikut

[![VPN Cloud - OnPremise]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-cloud-to-onpremise.jpg)]({{site.url}}/images/uploads/2020/vpn-wireguard/vpn-use-case-cloud-to-onpremise.jpg)

Langkah-langkah implementasinya sebagai berikut:

<!--more-->

* TOC
{:toc}

Untuk merealisasikan konfigurasi di atas, kita perlu membuat subnet internal di layanan cloud, atau biasa disebut dengan istilah Virtual Private Cloud, di mana layanan-layanan yang kita gunakan di cloud (seperti VPS, Function as a Service, dan lainnya) terhubung dalam satu subnet. Biasanya ini akan terlihat dengan adanya routing atau interface jaringan dengan alamat IP private yang terhubung ke subnet yang sama.

Konfigurasi VPC berbeda antar cloud provider, demikian juga pengaturan routingnya. Oleh karena itu kita tidak bahas di artikel ini. Silahkan baca dokumentasi di provider cloud yang Anda gunakan. Intinya, kita harus mengarahkan paket ke IP private database server ke VPS yang bertindak sebagai VPN gateway.

Dibandingkan konfigurasi skenario sebelumnya, skema cloud-on premise ini tergolong sederhana. Kita cukup menghubungkan VPN Gateway di sisi cloud provider dengan VPN gateway di sisi data center on premise.

## Konfigurasi VPN Gateway di Cloud Service ##

Di cloud services, kita perlu membuatkan VPN gateway. Di cloud DigitalOcean, VPN gateway ini kita buat berupa droplet biasa. Di Amazon AWS, kita bisa menggunakan layanan EC2 atau Lightsail.

Di VPS ini, kita bisa menginstal WireGuard seperti biasa. Caranya bisa dibaca di [artikel sebelumnya]({% post_url 2020-12-25-vpn-wireguard-01-intro %})

Kemudian, kita buat konfigurasi interface dan peer yang mengarah ke VPN gateway di sisi on-premise seperti ini

```
[Interface]
PrivateKey = sCVDCzfC39bffUYR6v5ZnjqQOfmn3otUyhCi8ndIk3I=
Address = 10.100.10.22/24
ListenPort = 51515

[Peer]
PublicKey = FQcUiIzvvvQ2hHplCsUgR+RN4avDWi/ucF57LTvq11k=
Endpoint = 180.244.234.226:51515
AllowedIPs = 10.100.10.11/32,192.168.0.0/24
```

Jangan lupa kita cantumkan alamat subnet database server kita, yaitu `192.168.0.0/24` di `AllowedIPs` agar WireGuard membuatkan routing untuk mengarahkan paket menuju database server kita di IP `192.168.0.10` melalui jaringan VPN di `10.100.10.0/24`.

Bila kita menggunakan VPS AWS seperti EC2 dan Lightsail, kita perlu menambahkan `PersistentKeepalive  = 25` di blok `[Peer]` karena AWS meletakkan VPS kita di jaringan internal, di belakang firewall/load balancer. Oleh karena itu kita perlu [mengaktifkan hole punching]({% post_url 2020-12-30-vpn-wireguard-03-publish-laptop %}). 

## Konfigurasi VPN Gateway di Data Center On Premise  ##

Di sisi on-premise, kita cukup membuat konfigurasi interface dan peer untuk menerima koneksi dari VPN gateway di cloud, seperti ini:

```
[Interface]
Address = 10.100.10.11/24
ListenPort = 51515
PrivateKey = mHDydqFCC7jcXgwn3TaMN718ekgaJmLOeQqgWxP5fUA=

[Peer]
PublicKey = bGalHOzArxIoTFDVz0fMcidw6k01Vlk3Zo5ancGjIlg=
Endpoint = 3.1.84.2:51515
AllowedIPs = 10.100.10.22/32
```

Kita tidak perlu mengisi alamat lain di `AllowedIPs` selain IP VPN Gateway di cloud.

## Konfigurasi Routing ##

Kita bisa mengecek konfigurasi routing di VPN gateway cloud dengan perintah `ip route`. Hasilnya kurang lebih seperti ini

```
ip route
default via 172.26.0.1 dev eth0 proto dhcp src 172.26.3.231 metric 100 
172.26.0.0/20 dev eth0 proto kernel scope link src 172.26.3.231 
172.26.0.1 dev eth0 proto dhcp scope link src 172.26.3.231 metric 100 
10.100.10.0/24 dev wg0 proto kernel scope link src 172.17.0.4 
192.168.0.0/24 dev wg0 scope link  
```

Yang perlu diperhatikan adalah route menuju subnet `192.168.0.0/24` di mana database on-premise berada sudah mengarah ke interface WireGuard, yaitu `wg0`.

Konfigurasi routing ini dibuatkan otomatis oleh WireGuard, asalkan kita mengkonfigurasi `AllowedIPs` dengan benar.

## Pengetesan ##

Agar yakin 100% bahwa konfigurasi ini sudah oke, tentunya kita harus :

* menyiapkan database yang akan digunakan, di VPS dengan IP `192.168.0.2` dalam data center on-premise
* bikin aplikasi atau function yang dideploy di Lightsail/EC2/Lambda, yang mengakses database di IP `192.168.0.2`
* membuat routing VPC agar paket data dari Lightsail/EC2/Lambda bisa diarahkan ke VPN gateway kita di cloud, untuk kemudian dikirim melalui VPN ke gateway di on-premise, dan kemudian diteruskan ke database server

Tapi untuk gampangnya, kita bisa ping saja dari Lightsail/EC2/Lambda di AWS ke IP database

```
ping 192.168.0.2
PING 192.168.0.2 (192.168.0.2) 56(84) bytes of data.
64 bytes from 192.168.0.2: icmp_seq=1 ttl=63 time=214 ms
64 bytes from 192.168.0.2: icmp_seq=3 ttl=63 time=233 ms
^C
--- 192.168.0.2 ping statistics ---
4 packets transmitted, 2 received, 50% packet loss, time 3011ms
rtt min/avg/max/mdev = 213.564/223.223/232.882/9.659 ms
```

Bila kita ingin mengetes koneksi database dari AWS Lambda ke database on-premise, kita bisa mengikuti tutorial [Vaquar Khan](https://www.linkedin.com/pulse/aws-lambda-mysql-rds-api-gateway-vaquar-khan-?articleId=6606968660907085824). Dari artikel tersebut, kita bisa copy-paste dan menyesuaikan kode programnya menjadi seperti ini

```js
const mysql = require('mysql');

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectionLimit: 10,
  multipleStatements: true,// Prevent nested sql statements
  connectionLimit: 1000,
  connectTimeout: 60 * 60 * 1000,
  acquireTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  debug: true
});

exports.handler = (event, context, callback) => {

    console.log('Query employee dengan ID : '+event.emp_id);
    // allows for using callbacks as finish/error-handlers
    context.callbackWaitsForEmptyEventLoop = false;
    const sql = "select * from employee where emp_id = " + event.emp_id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        callback(null, result)
    });
};
```

Kode program tersebut kita simpan dengan nama `index.js`

Kita harus menyediakan dependensi yang dibutuhkan oleh function kita di atas, untuk itu kita buat struktur project standar `npm`

```
npm init
npm install --save mysql
```

Setelah kita jalankan perintah di atas, maka folder kita akan berisi sebagai berikut:

```
ls -l
-rw-r--r--   1  855 Jan  3 23:07 index.js
drwxr-xr-x  14  448 Jan  3 22:54 node_modules
-rw-r--r--   1 6711 Jan  3 22:54 package-lock.json
-rw-r--r--   1  316 Jan  3 23:04 package.json
```

Kita zip semuanya menjadi satu untuk diupload ke AWS Lambda

```
zip lambda-db-onprem.zip -r * .[^.]*  -x ".git/*" 
```

Jangan lupa untuk menyediakan environment variable untuk mengisi konfigurasi di atas, yaitu:

* `DB_HOST` : `192.168.0.2`
* `DB_PORT` : `3306`
* `DB_NAME` : `belajarvpndb`
* `DB_USERNAME` : `belajarvpn`
* `DB_PASSWORD` : `belajar1234`

[![AWS Lambda Environment Variable]({{site.url}}/images/uploads/2020/vpn-wireguard/aws-lambda-env-var.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/aws-lambda-env-var.png)

Setelah function dibuat, environment variable diisi, dan file zip berisi source code diupload, kita bisa membuat test event dengan isi seperti ini

```js
{
    "emp_id" : "1"
}
```

[![AWS Lambda Test]({{site.url}}/images/uploads/2020/vpn-wireguard/aws-lambda-test.png)]({{site.url}}/images/uploads/2020/vpn-wireguard/aws-lambda-test.png)

Kemudian kita test functionnya. Kalau routing VPN kita belum berjalan dengan baik, maka akan muncul error seperti ini

```
Response:
{
  "errorMessage": "2021-01-03T16:14:07.262Z c3ddf9d6-ac02-45a6-9275-b841542b50a3 Task timed out after 3.00 seconds"
}
```

Kita perlu membuatkan user dan databasenya di MySQL server kita

```
CREATE DATABASE belajarvpndb;
CREATE USER 'belajarvpn'@'%' IDENTIFIED BY 'belajar1234';
GRANT ALL ON belajarvpndb.* TO 'belajarvpn'@'%';
flush privileges;
```

Skema tabelnya sebagai berikut, kita siapkan dulu tabel dan contoh data di database

```sql
CREATE TABLE `employee` (
  `emp_id` varchar(36),
  `emp_name` varchar(100) NOT NULL,
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

insert into employee values('1','Vaquar khan');
insert into employee values('2','Zidan khan');
```

Bila kita ingin membuat REST API, kita bisa menggunakan fitur API Gateway yang disediakan oleh AWS. Caranya tidak kita bahas di sini. Silahkan baca-baca dokumentasi AWS. Demikian juga cara pengaturan routing VPC supaya Lambda bisa connect ke subnet database. Teknisnya bisa dibaca di [dokumentasi AWS](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-dedicated-vpc/) dan [gist ini](https://gist.github.com/reggi/dc5f2620b7b4f515e68e46255ac042a7)

Semoga bermanfaat ... 
