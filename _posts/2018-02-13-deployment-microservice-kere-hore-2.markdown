---
layout: post
title: "Deployment Microservice Kere Hore Bagian 2"
date: 2018-02-13 07:00
comments: true
categories:
- devops
---

Pada artikel sebelumnya, kita telah menyiapkan front proxy yang sudah berfungsi dengan baik. Kali ini, kita akan membuat aplikasi Java sederhana dengan Spring Boot yang kemudian akan kita pasang di VPS kita kemarin dengan nama domain `app1.artivisi.id`.

<!--more-->

## Setup Project ##

Setup project Spring Boot sudah sering dibahas di blog ini. Silahkan lihat-lihat bagian arsip untuk lebih detailnya. Beberapa hal yang harus diperhatikan mengenai deployment terutama adalah mengaktifkan systemd startup script agar aplikasi kita bisa diinstal sebagai service.

Buat konfigurasi `executable` dengan nilai `true` berikut di `pom.xml`

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <executable>true</executable>
            </configuration>
        </plugin>
    </plugins>
</build>
```

Setelah itu, kita build aplikasinya, dan upload ke server.

```
mvn clean package -DskipTests
scp target/*jar root@app1.artivisi.id:/root/
```

File aplikasi sudah siap deploy di folder `/root` di server kita. Selanjutnya, kita akan melanjutkan pekerjaan di server. SSH dulu ke servernya.

```
ssh root@app1.artivisi.id
```

## Persiapan Database MySQL ##

Biasanya, aplikasi menyimpan datanya di database. Sebagai contoh, kita gunakan database MySQL yang banyak dipakai orang sedunia. Install dulu databasenya.

```
apt install mysql-server -y
```

Kita akan diminta memasukkan password untuk user `root`. Masukkan apa yang biasa digunakan. Lalu klik Ok.

[![Setup Root Password]({{site.url}}/images/uploads/2018/msa-deployment/09-mysql-root.png)]({{site.url}}/images/uploads/2018/msa-deployment/09-mysql-root.png)

Selanjutnya, login ke MySQL dengan user `root` yang sudah kita isikan passwordnya barusan.

```
mysql -u root -p
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 4
Server version: 5.7.21-0ubuntu0.16.04.1 (Ubuntu)

Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```

Kita buatkan database dengan nama `appspringdb`.

```
mysql> create database appspringdb;
Query OK, 1 row affected (0.00 sec)
```

Lalu kita buatkan usernya

```
mysql> grant all on appspringdb.* to appspringdbuser@localhost identified by 'abCdqwErty2213';
Query OK, 0 rows affected, 1 warning (0.01 sec)
```

Database sudah siap digunakan.

## Deployment Aplikasi Spring Boot ##

Sebelum mendeploy aplikasi, kita pastikan dulu `Java SDK` dan `haveged` sudah terinstal

```
apt install openjdk-9-jre-headless -y
```

`haveged` adalah generator entropi yang dibutuhkan untuk menghasilkan random number. Bila ini lupa dipasang, aplikasi kita akan seolah hang pada saat membutuhkan random number.

Kebiasaan orang dalam mendeploy aplikasi berbeda-beda. Ada yang menaruhnya di folder `/home`, `/opt`, dan sebagainya. Saya sendiri biasanya menaruh aplikasi di folder `/var/lib/`. Untuk itu, kita buatkan folder untuk aplikasinya.

```
mkdir /var/lib/appspringsaya
```

Kemudian kita pindahkan file `*.jar` aplikasi kita yang sudah diupload tadi.

```
mv /root/*jar /var/lib/appspringsaya/
```

Biasanya saya membuat symlink dari nama file aplikasi yang ada nomor versinya (misalnya `appspringsaya-1.0.0-RELEASE.jar`) menjadi nama file yang polos (misalnya `appspringsaya.jar`). Dengan cara ini, bila ternyata versi yang baru dideploy ada bug critical, kita bisa dengan mudah mematikan aplikasi dan mengganti symlink tersebut untuk mengarah ke versi lama.

```
ln -s /var/lib/appspringsaya/appspringsaya-1.0.0-RELEASE.jar /var/lib/appspringsaya/appspringsaya.jar
```

Konfigurasi production biasanya berbeda dengan konfigurasi development di laptop kita. Kita bisa membuat file `application.properties` di folder yang sama dengan file aplikasi. Spring Boot secara otomatis memprioritaskan file yang di folder ini dibandingkan file konfigurasi yang ada dalam jar, yaitu yang kita pakai selama development dan deployment di laptop. Jadi kita bisa membundel `application.properties` yang lengkap dalam `jar`, dan hanya mengganti nilai yang berbeda saja di `application.properties` dalam folder.

Berikut isi `application.properties`, biasanya berisi konfigurasi database yang pastinya berbeda dengan pada waktu mengetes di laptop.

```
# Port Production
server.port = 10001

# Konfigurasi Koneksi Database
spring.datasource.url=jdbc:mysql://localhost/appspringdb
spring.datasource.username=appspringdbuser
spring.datasource.password=abCdqwErty2213
```

Kita juga setup portnya agar aplikasi berjalan di `10001`.

Selanjutnya, kita bisa test jalankan aplikasinya.

```
java -jar appspringsaya.jar
```

Kita bisa coba browse ke `http://app1.artivisi.id:10001` untuk memastikan aplikasi kita berjalan dengan baik. Harusnya dia mengeluarkan tampilan seperti ini.

[![Aplikasi Spring Boot 10001]({{site.url}}/images/uploads/2018/msa-deployment/10-app-spring-standalone.png)]({{site.url}}/images/uploads/2018/msa-deployment/10-app-spring-standalone.png)

Perhatikan alamat URLnya, kita masih menggunakan port `10001` dan tidak menggunakan `https`.

## Setup Systemd Service ##

Bila kita jalankan dengan perintah `java -jar`, aplikasi kita akan mati bila kita logout, apalagi kalau server kita restart. Untuk itu kita perlu menginstalnya menjadi service agar bisa jalan otomatis pada waktu server dinyalakan.

Registrasi service yang mainstream di Ubuntu dan CentOS adalah `systemd`. Pendaftarannya dilakukan dengan membuat file `/etc/systemd/system/appspringsaya.service` dengan isi sebagai berikut:

```
[Unit]
Description=Aplikasi Spring Saya
After=syslog.target

[Service]
User=root
ExecStart=/var/lib/appspringsaya/appspringsaya.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Lalu enable dengan perintah berikut

```
systemctl enable appspringsaya.service
```

Outputnya seperti ini

```
Created symlink from /etc/systemd/system/multi-user.target.wants/appspringsaya.service to /etc/systemd/system/appspringsaya.service.
```

Kita bisa jalankan servicenya dengan perintah :

```
service appspringsaya start
```

Log bisa dipantau dengan perintah berikut :

```
tail -f /var/log/syslog
```

Kita bisa test restart VPS dan pastikan aplikasi kita jalan dengan baik walaupun habis restart.

## Konfigurasi Reverse Proxy Nginx ##

Tentunya kita tidak mau mengakses aplikasi kita tanpa `https` dan di port yang tidak lazim. Untuk itu, kita akan buat konfigurasi di Nginx agar semua request ke `https://app1.artivisi.id` diarahkan ke `http://localhost:10001`. Nantinya port `10001` akan kita tutup di firewall agar tidak bisa diakses langsung oleh user.

Buka konfigurasi `/etc/nginx/sites-enabled/app1.artivisi.id` dan tambahkan satu baris berikut:

```
proxy_pass http://localhost:10001;
```

Sehingga menjadi seperti ini

```
server {
    server_name app1.artivisi.id;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/letsencrypt/live/app1.artivisi.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app1.artivisi.id/privkey.pem;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    root /var/www/app1.artivisi.id/html;
    index index.php index.html;

    location / {
      proxy_pass http://localhost:10001;
    }
}
server {
    if ($host = app1.artivisi.id) {
        return 301 https://$host$request_uri;
    }

  listen 80;
  listen [::]:80;

  server_name app1.artivisi.id;
  return 404;
}
```

Coba akses ke `https://app1.artivisi.id`. Seharusnya kita akan mendapatkan tampilan aplikasi Spring Boot

[![Spring Boot dibalik Nginx]({{site.url}}/images/uploads/2018/msa-deployment/11-spring-behind-nginx.png)]({{site.url}}/images/uploads/2018/msa-deployment/11-spring-behind-nginx.png)

## Penutup ## 

Demikian cara konfigurasi Spring Boot dibalik Nginx. Pada artikel berikut kita akan [setup Wordpress]({{site.url}}/devops/deployment-microservice-kere-hore-3/) di domain `wp.artivisi.id`. Stay tuned ...