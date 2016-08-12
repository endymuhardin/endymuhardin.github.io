---
layout: post
title: "Setup Deployment ke PaaS"
date: 2016-02-24 02:00
comments: true
categories: 
- java
---


Pada [artikel sebelumnya](http://software.endy.muhardin.com/java/project-bootstrap-02/), kita telah mengotomasi proses build dari aplikasi kita. Langkah selanjutnya adalah mendeploy aplikasi kita tersebut ke server yang bisa diakses orang banyak, supaya bisa dilakukan testing oleh manusia.

Ada banyak provider server yang bisa digunakan, ada yang berbayar dan ada yang gratisan. Di antara yang gratisan adalah [Openshift](https://www.openshift.com/) dan [Heroku](https://www.heroku.com/). Openshift menyediakan tiga aplikasi yang dapat diinstal tanpa bayar. Sedangkan Heroku membatasi aplikasi gratisnya hanya bisa jalan 18 jam sehari.

Paket gratis ini cukup memadai untuk keperluan testing. Sedangkan nanti bila aplikasi kita sudah digunakan di production, kita bisa menggunakan paket berbayar atau sewa server sendiri baik VPS maupun colocation.

Kedua provider ini mendukung deployment menggunakan `git push`, jadi kita tidak perlu upload file `jar` atau `war` berukuran besar. Cukup push saja source code, nanti dia akan melakukan build dan deployment.

Mari kita mulai ...

<!--more-->

## Openshift ##

Untuk bisa mendeploy ke Openshift, terlebih dulu kita harus mendaftar. Cara pendaftaran sudah pernah saya bahas di [artikel sebelumnya](http://software.endy.muhardin.com/aplikasi/membuat-blog-gratis-di-openshift/). Langsung saja [ke websitenya](https://www.openshift.com/) dan mendaftar.

### Pembuatan Aplikasi di Openshift ###

Setelah login, kita akan melihat daftar aplikasi yang kita miliki. 

[![Daftar Aplikasi](https://lh3.googleusercontent.com/1aqd3dM7DQXOCgBEqPGnsrzk5UluU2kwtU5CGBpC6xxaK1Nt0Mjw2OLujqfZQXjuE8j4KuN3PZBQ=w1280-no)](https://lh3.googleusercontent.com/1aqd3dM7DQXOCgBEqPGnsrzk5UluU2kwtU5CGBpC6xxaK1Nt0Mjw2OLujqfZQXjuE8j4KuN3PZBQ=w1280-no)

Ada tombol `Add Application` untuk menambah aplikasi baru. Klik tombol tersebut. Kita akan mendapati daftar cartridge (template aplikasi) yang disediakan Openshift untuk mendeploy aplikasi kita. Aplikasi web java biasanya menggunakan cartridge Tomcat, JBoss, atau application server lainnya. Akan tetapi, karena Spring Boot sudah menyertakan (embedded) Tomcat, kita tidak perlu lagi menggunakan cartridge yang sudah ada. Gunakan cartridge `DIY` (Do It Yourself), karena kita akan mengkonfigurasi aplikasi kita secara manual.

[![Pilih DIY](https://lh3.googleusercontent.com/6c0LMSjOeahK8ekWm3s8FEFezIeBCFxORwx9bQEfYL5pKbYrHlCZMQ1aITY12ltqDdscFtEBZGkz=w1280-no)](https://lh3.googleusercontent.com/6c0LMSjOeahK8ekWm3s8FEFezIeBCFxORwx9bQEfYL5pKbYrHlCZMQ1aITY12ltqDdscFtEBZGkz=w1280-no)

Selanjutnya, kita akan melihat form pembuatan aplikasi. Cukup isikan saja nama aplikasi yang akan dibuat, misalnya `belajar`.

[![Nama Aplikasi](https://lh3.googleusercontent.com/uDCwC_KCzpBD8YKeuqbek4rKcBAyZ2Ou2izqfsZmPk5QuZveMEZdct8bmm0_OETvJ8p_grO3FWbv=w1280-no)](https://lh3.googleusercontent.com/uDCwC_KCzpBD8YKeuqbek4rKcBAyZ2Ou2izqfsZmPk5QuZveMEZdct8bmm0_OETvJ8p_grO3FWbv=w1280-no)

Klik OK di bagian paling bawah, dan aplikasi kita akan sukses dibuat.

[![Sukses](https://lh3.googleusercontent.com/f1kOBThw_3YwCBH8ainqOk_tS-MUwKXM1gRBw9vJ3RptffOvqp4b1iNb4NaEKV9KZHEVa6RfESpj=w1280-no)](https://lh3.googleusercontent.com/f1kOBThw_3YwCBH8ainqOk_tS-MUwKXM1gRBw9vJ3RptffOvqp4b1iNb4NaEKV9KZHEVa6RfESpj=w1280-no)

Kita bisa klik ke halaman Application Overview untuk melihat setting aplikasi kita.

[![Halaman Settings](https://lh3.googleusercontent.com/doaPkBpvFUULJYTjnNyG4uwSpm3RmgFvktmkoZbs--fj_I7TMpo0TyCUnqbufIoLVRp4RvTgAnjj=w1280-no)](https://lh3.googleusercontent.com/doaPkBpvFUULJYTjnNyG4uwSpm3RmgFvktmkoZbs--fj_I7TMpo0TyCUnqbufIoLVRp4RvTgAnjj=w1280-no)

Karena aplikasi kita membutuhkan database, tambahkan cartridge MySQL dengan cara klik tombol 'Add MySQL 5.5'. Kita akan disajikan halaman konfirmasi.

[![Menambahkan MySQL Cartridge](https://lh3.googleusercontent.com/DEltdcKmAuKm3wJDHfmLv0QVMPGJTcn96WXvSBQEhdMC2vQvTPiGimh_GZO-s_sjrj3I1gTa1-Ic=w1280-no)](https://lh3.googleusercontent.com/DEltdcKmAuKm3wJDHfmLv0QVMPGJTcn96WXvSBQEhdMC2vQvTPiGimh_GZO-s_sjrj3I1gTa1-Ic=w1280-no)

Klik Add Cartridge

[![Konfigurasi MySQL](https://lh3.googleusercontent.com/gBr5F6fz0OXHchd6tW5AQAdOqZsHWHi_uYyVskAJgnrkk9HaUKdKODtQcQ21hstuiC9nq9XG5-4R=w1280-no)](https://lh3.googleusercontent.com/gBr5F6fz0OXHchd6tW5AQAdOqZsHWHi_uYyVskAJgnrkk9HaUKdKODtQcQ21hstuiC9nq9XG5-4R=w1280-no)

Database kita sudah dibuatkan oleh Openshift. Tidak perlu menghafalkan nilai konfigurasinya, karena kita nanti akan menggunakan variabel yang sudah disediakan oleh openshift, yaitu `OPENSHIFT_MYSQL_DB_HOST`, `OPENSHIFT_MYSQL_DB_PORT`, `OPENSHIFT_APP_NAME`, `OPENSHIFT_MYSQL_DB_USERNAME`, dan `OPENSHIFT_MYSQL_DB_PASSWORD`.

### Konfigurasi di Aplikasi ###

Aplikasi kita perlu dikonfigurasi supaya bisa diproses dengan baik oleh Openshift. Ada beberapa file yang perlu kita sediakan:

* `.openshift/settings.xml` : konfigurasi Maven yang akan dipakai dalam Openshift
* `.openshift/action_hooks/build` : script yang dijalankan untuk melakukan proses build
* `.openshift/action_hooks/start` : script yang dijalankan untuk menyalakan aplikasi kita
* `.openshift/action_hooks/stop` : script yang akan dijalankan untuk mematikan aplikasi kita

Mari kita buat dulu struktur file dan foldernya. Lakukan command berikut dalam folder aplikasi

```
mkdir -p .openshift/action_hooks
touch .openshift/settings.xml
touch .openshift/action_hooks/{build,start,stop}
chmod +x .openshift/action_hooks/*
```

Perintah di atas bisa dijalankan di Linux dan MacOSX. Bila Anda menggunakan Windows, silahkan gunakan Windows Explorer untuk membuat file dan foldernya. Untuk mengeset permission menjadi executable, gunakan perintah berikut

```
git update-index --chmod=+x .openshift/action_hooks/build
```

Berikut isi dari file `settings.xml`

```xml
<settings>
  <localRepository>${OPENSHIFT_DATA_DIR}/m2/repository</localRepository>
</settings>
```

Dan ini adalah isi file `build` yang berada dalam folder `.openshift/action_hooks`

```
#!/bin/bash

set -x

if [ ! -d $OPENSHIFT_DATA_DIR/m2/repository ]
then
    cd $OPENSHIFT_DATA_DIR
    mkdir m2/repository                
fi

if [ ! -d $OPENSHIFT_DATA_DIR/logs ]
then
    cd $OPENSHIFT_DATA_DIR
    mkdir logs
fi

if [ ! -d $OPENSHIFT_DATA_DIR/jdk1.8.0_20 ]
then
    cd $OPENSHIFT_DATA_DIR
    wget http://www.java.net/download/jdk8u20/archive/b17/binaries/jdk-8u20-ea-bin-b17-linux-x64-04_jun_2014.tar.gz
    tar xvf *.tar.gz
    rm -f *.tar.gz
fi

if [ ! -d $OPENSHIFT_DATA_DIR/apache-maven-3.3.9 ]
then
    cd $OPENSHIFT_DATA_DIR
    wget http://www-us.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz
    tar xvf *.tar.gz
    rm -f *.tar.gz
fi

export M2=$OPENSHIFT_DATA_DIR/apache-maven-3.3.9/bin
export MAVEN_OPTS="-Xms384m -Xmx412m"
export JAVA_HOME=$OPENSHIFT_DATA_DIR/jdk1.8.0_20
export PATH=$JAVA_HOME/bin:$M2:$PATH

cd $OPENSHIFT_REPO_DIR
mvn -s .openshift/settings.xml clean package -DskipTests=true
```

Pada script `build` di atas, kita mengunduh dan menginstall Java SDK versi 8 dan Maven versi 3.3.3. Jangan lupa mengupdate URL download sesuai dengan versi terbaru yang tersedia pada waktu kita mendeploy.


Setelah itu, kita mengeset environment variable. Terakhir, kita jalankan proses kompilasi tanpa menjalankan test. Hasilnya adalah file `*.jar` di dalam folder `target` yang siap dijalankan.

Berikut isi file `start`

```
#!/bin/bash

export JAVA_HOME=$OPENSHIFT_DATA_DIR/jdk1.8.0_20
export PATH=$JAVA_HOME/bin:$PATH

cd $OPENSHIFT_REPO_DIR
nohup java -Xms384m -Xmx412m -jar -Dspring.profiles.active=openshift target/*.jar --server.port=${OPENSHIFT_DIY_PORT} --server.address=${OPENSHIFT_DIY_IP} &
```

Script `start` di atas hanya mengatur environment variable dan menjalankan aplikasi. Kita menggunakan profile `openshift` agar Spring Boot membaca file konfigurasi yang sesuai. Isi file ini akan kita bahas di bawah.

Ini adalah isi file `stop`

```
#!/bin/bash
source $OPENSHIFT_CARTRIDGE_SDK_BASH
PID=$(ps -ef | grep java.*\.jar | grep -v grep | awk '{ print $2 }')
if [ -z "$PID" ]
then
    client_result "Application is already stopped"
else
    kill $PID
fi
```

Pada script `start` di atas, kita menyuruh Spring untuk menggunakan profile `openshift`. Dengan fitur profile ini, kita bisa membedakan konfigurasi koneksi database antara setting di komputer kita dan di server Openshift. Untuk itu, kita buat file `application-openshift.properties` di dalam folder `src/main/resources`. File ini akan dibaca apabila profile `openshift` aktif. Lebih lanjut mengenai profile bisa dibaca pada [artikel terdahulu]().

Berikut isi file `application-openshift.properties`

```
spring.datasource.url=jdbc:mysql://${OPENSHIFT_MYSQL_DB_HOST}:${OPENSHIFT_MYSQL_DB_PORT}/${OPENSHIFT_APP_NAME}
spring.datasource.username=${OPENSHIFT_MYSQL_DB_USERNAME}
spring.datasource.password=${OPENSHIFT_MYSQL_DB_PASSWORD}
```

### Deployment ke Openshift ###

Deployment dilakukan dengan cara `git push`. Untuk itu kita perlu mendapatkan alamat repository git yang berada di Openshift. Informasinya ada di halaman setting aplikasi kita di Openshift.

[![Openshift Git URL](https://lh3.googleusercontent.com/vlFQG6Z2d3hdAhKOO7SfdHmTvidcWvVhVPAjIT9In_VucK03ouipIc8NB7AryuuhI1GbrTkmSWRw=w1280-no)](https://lh3.googleusercontent.com/vlFQG6Z2d3hdAhKOO7SfdHmTvidcWvVhVPAjIT9In_VucK03ouipIc8NB7AryuuhI1GbrTkmSWRw=w1280-no)

Copy alamat repository tersebut, kemudian daftarkan sebagai remote repository di project kita.

```
git remote add openshift ssh://abcdefghijklmn1234567890@belajar-endymuhardin.rhcloud.com/~/git/belajar.git
```

Terakhir, lakukan push

```
git push openshift master
```

Aplikasi kita bisa diakses di alamat yang sudah disediakan Openshift

[![Alamat Aplikasi](https://lh3.googleusercontent.com/33GT-WK5AaVFKzpOGpdhlUVlwZsKc_gdj9Wsed8s2y4m88270eHVJ9HMRCrceqlL_pyQza9pQ0Fe=w1280-no)](https://lh3.googleusercontent.com/33GT-WK5AaVFKzpOGpdhlUVlwZsKc_gdj9Wsed8s2y4m88270eHVJ9HMRCrceqlL_pyQza9pQ0Fe=w1280-no)

Bila kita coba mengaksesnya, kita akan mendapatkan response JSON.

[![Output](https://lh3.googleusercontent.com/Ej-1LQGRaOPc4eH7kvNmIt6KNyBpRoyyjmhDRl1OjMYxcd8Hi6_wDHgCCbiWc6MhslhyMu2Hrw1b=w1280-no)](https://lh3.googleusercontent.com/Ej-1LQGRaOPc4eH7kvNmIt6KNyBpRoyyjmhDRl1OjMYxcd8Hi6_wDHgCCbiWc6MhslhyMu2Hrw1b=w1280-no)


## Heroku ##

Pada dasarnya, deployment ke Heroku tidak jauh berbeda caranya dengan Openshift. Satu-satunya perbedaan yang cukup signifikan adalah paket gratisan Heroku cuma menyediakan database PostgreSQL. Tidak terlalu merepotkan karena kita menggunakan JPA. Tinggal mengubah tiga baris konfigurasi dan script migrasi database saja.

### Struktur Folder Aplikasi ###

Kita kerjakan dulu script migrasi database. Struktur folder kita yang asli hanyak mengakomodasi satu jenis database. Karena kita ingin ada dua script yang berbeda, kita perlu mengubah foldernya menjadi seperti ini

[![Struktur Folder Migrasi](https://lh3.googleusercontent.com/KuXfp03PAiMLbH5616hUTa0XC9ljmjV0Sq5tsgFyGoh_IgdR76SC2K27HqVpMtDCfFX-eIsqiK0a=w1280-no)](https://lh3.googleusercontent.com/KuXfp03PAiMLbH5616hUTa0XC9ljmjV0Sq5tsgFyGoh_IgdR76SC2K27HqVpMtDCfFX-eIsqiK0a=w1280-no)

Karena perubahan tersebut, kita harus memberi tahu Flyway di mana harus mencari scriptnya. Tambahkan konfigurasi berikut pada file `src/main/resources/application.properties`

```
flyway.locations=classpath:db/migration/mysql
```

Dengan demikian, lokasi default script ada di folder `src/main/resources/db/migration/mysql`.


### Membuat Aplikasi Heroku ###

Selanjutnya, kita buat aplikasi di Heroku. Login dulu ke Heroku sehingga dapat membuka management console seperti ini

[![Heroku Dashboard](https://lh3.googleusercontent.com/vJIL0M5lHm_zXw9wBqhHFURVRs_aS92ZhL0Hr3yHiYRiRjDqHPNPp0FyG5k2Fhiojf7N5Mx6hvrt=w1280-no)](https://lh3.googleusercontent.com/vJIL0M5lHm_zXw9wBqhHFURVRs_aS92ZhL0Hr3yHiYRiRjDqHPNPp0FyG5k2Fhiojf7N5Mx6hvrt=w1280-no)

Klik `New App` di pojok kanan atas untuk membuat aplikasi baru

[![New App](https://lh3.googleusercontent.com/7S3Ou3h7xF44D52vWwCzZAxS8L5FOfkc9YR5IcTmVIkZADmxozhd8VNsXa3yC3ITRnA3vZrWAWdw=w1280-no)](https://lh3.googleusercontent.com/7S3Ou3h7xF44D52vWwCzZAxS8L5FOfkc9YR5IcTmVIkZADmxozhd8VNsXa3yC3ITRnA3vZrWAWdw=w1280-no)

Isikan nama aplikasi yang ingin kita buat, misalya `aplikasibelajar`. Setelah klik OK, kita akan mendapati halaman administrasi aplikasi kita.

[![Settings](https://lh3.googleusercontent.com/DNLuwV09DmIc5-cmY9MPbthkvVUgLTLSN0_zJRsK_nipgsOMiQ1TX3algAx1dETnqC9sJ9zlD9i7=w1280-no)](https://lh3.googleusercontent.com/DNLuwV09DmIc5-cmY9MPbthkvVUgLTLSN0_zJRsK_nipgsOMiQ1TX3algAx1dETnqC9sJ9zlD9i7=w1280-no)

Perhatikan nilai `Git URL` pada tab `Settings`. Kita akan membutuhkan nilainya untuk melakukan deployment nanti.

Klik tab `Resources`, dan tambahkan add-ons PostgreSQL

[![Add PostgreSQL](https://lh3.googleusercontent.com/gCR_yDwsszVcWwT8BgqT_Zyb8rAMui3NYzbYMVRGlHW4qBKzloY8ROTMSDiLrr_TgG-7D_lM4V0P=w1280-no)](https://lh3.googleusercontent.com/gCR_yDwsszVcWwT8BgqT_Zyb8rAMui3NYzbYMVRGlHW4qBKzloY8ROTMSDiLrr_TgG-7D_lM4V0P=w1280-no)

Pilih saja paket Hobby yang gratis

[![Pilih paket](https://lh3.googleusercontent.com/U2QFH7vZHoQDfUvBN4AQsbytOaJ7VWqwD5a8n8V2ow2J6Rje8bn2AFiWtndaj7ZCRXoAmdnQu2gw=w1280-no)](https://lh3.googleusercontent.com/U2QFH7vZHoQDfUvBN4AQsbytOaJ7VWqwD5a8n8V2ow2J6Rje8bn2AFiWtndaj7ZCRXoAmdnQu2gw=w1280-no)

Database PostgreSQL sudah berhasil ditambahkan. 

[![Database PostgreSQL](https://lh3.googleusercontent.com/t-vug3Drj-_hSp_Y6uMn857e1jjbg2YEn5geqDwOOA4fxj2t1dCNhyFNaZSG_nv3Ow2lgmDNXe4S=w1280-no)](https://lh3.googleusercontent.com/t-vug3Drj-_hSp_Y6uMn857e1jjbg2YEn5geqDwOOA4fxj2t1dCNhyFNaZSG_nv3Ow2lgmDNXe4S=w1280-no)

Klik titik tiga di kanannya untuk mengetahui detail konfigurasinya agar bisa kita pasang di aplikasi.

[![Daftar Database](https://lh3.googleusercontent.com/gTQ0-E-whswg7BM3deNaW4HVijl5l5L1NUJRos2hBiobkq8OJAKmvOI67xmZopYJOumx5nL6fho1=w1280-no)](https://lh3.googleusercontent.com/gTQ0-E-whswg7BM3deNaW4HVijl5l5L1NUJRos2hBiobkq8OJAKmvOI67xmZopYJOumx5nL6fho1=w1280-no)

Pada halaman di atas terlihat daftar database yang kita miliki, hanya ada satu di sana. Klik nama databasenya untuk melihat detail konfigurasinya

[![Database Setting](https://lh3.googleusercontent.com/3ihLGkqas3LezBYpsCr-J0zJ-JbsRh1BymgIHT7bZsGXrCiZQ4iyF-Kt147pgHyLDFYtCL582kYG=w1280-no)](https://lh3.googleusercontent.com/3ihLGkqas3LezBYpsCr-J0zJ-JbsRh1BymgIHT7bZsGXrCiZQ4iyF-Kt147pgHyLDFYtCL582kYG=w1280-no)

Di situ kita bisa melihat informasi koneksi database. Informasi ini akan kita pasang di konfigurasi aplikasi.

### Konfigurasi Aplikasi ###

Seperti pada Openshift, kita akan membuat konfigurasi terpisah untuk koneksi database Heroku. Tambahkan file `application-heroku.properties` di dalam folder `src/main/resources`. Isinya sebagai berikut

```
spring.datasource.url=jdbc:postgresql://ec2-54-83-198-159.compute-1.amazonaws.com:5432/d1sjircg9n9989
spring.datasource.username=oxfyfvocxwboqn
spring.datasource.password=1fpn8BZHFIKAALWnvLAUAPBByt

flyway.locations=classpath:db/migration/postgresql
```

Nilai konfigurasi tersebut didapatkan dari setting database yang disediakan Heroku seperti pada screenshot sebelumnya.

Selanjutnya, kita buat script migrasi untuk database PostgreSQL. Sebetulnya tidak terlalu jauh berbeda karena tabel kita cuma satu dan tidak rumit. Berikut isi file `V0.0.1.20160222__Skema Awal.sql` yang diletakkan di dalam folder `src/main/resources/db/migration/postgresql`.

```sql
-- tabel Product --
create table product (
    id varchar(36) primary key,
    code varchar(10) not null unique,
    name varchar(255) not null,
    price decimal(19,2) not null
);
```

Terakhir, jangan lupa menambahkan dependensi untuk driver PostgreSQL di `pom.xml`

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

Setelah selesai, jangan lupa `commit` ke repo lokal.

```
git add .
git commit -m "konfigurasi database PostgreSQL di Heroku"
```

### Deployment ###

Agar Heroku paham cara menjalankan aplikasi kita, buat sebuah file bernama `Procfile`. Isinya sebagai berikut

```
web: java $JAVA_OPTS -jar -Dspring.profiles.active=heroku target/*.jar --server.port=$PORT
```

File tersebut menunjukkan bahwa aplikasi kita adalah aplikasi web, dijalankan dengan perintah 

```
java -jar target/*.jar -Dspring.profiles.active=heroku
```

Selebihnya `$JAVA_OPTS` dan `$PORT` adalah variabel yang disediakan Heroku.

Deployment dilakukan dengan cara `git push`, sama seperti Openshift. Untuk itu, kita daftarkan url git Heroku yang telah kita dapatkan di laman administrasi di atas.

```
git remote add heroku https://git.heroku.com/aplikasibelajar.git
```

Selanjutnya, kita lakukan deployment

```
git push heroku master
```

Untuk memantau apakah aplikasi kita berhasil terdeploy dengan baik, kita bisa menampilkan log aplikasi dengan cara mengklik tombol titik tiga di kanan atas laman administrasi

[![View Log Button](https://lh3.googleusercontent.com/pXk4gPwG1cWjPkPXEDpnQg0mX1zPo6qx7HYerrWpuZikO_MxCYY89XMqOa2zKOPmj0yA1LjdaB_V=w1280-no)](https://lh3.googleusercontent.com/pXk4gPwG1cWjPkPXEDpnQg0mX1zPo6qx7HYerrWpuZikO_MxCYY89XMqOa2zKOPmj0yA1LjdaB_V=w1280-no)

Selanjutnya, kita bisa lihat apakah ada error yang terjadi di log aplikasi

[![Log Aplikasi](https://lh3.googleusercontent.com/53eCLZjK12alrsbu8fyeZ4qq3hFMpuE3omVDGd3BupHlSDJbPv0IW1ecQL7msdmLqaHyY0AlBcuC=w1280-no)](https://lh3.googleusercontent.com/53eCLZjK12alrsbu8fyeZ4qq3hFMpuE3omVDGd3BupHlSDJbPv0IW1ecQL7msdmLqaHyY0AlBcuC=w1280-no)

Bila semuanya lancar, kita dapat mengakses aplikasi kita dengan URL yang tercantum di laman administrasi

[![Output Heroku](https://lh3.googleusercontent.com/kHtUIutukivieFArVdrsOLZcbSOFeiPq4nFpiksILhvWTRCQsZYNcXet-MIb63bZrLB6kpnewPXS=w1280-no)](https://lh3.googleusercontent.com/kHtUIutukivieFArVdrsOLZcbSOFeiPq4nFpiksILhvWTRCQsZYNcXet-MIb63bZrLB6kpnewPXS=w1280-no)


## Penutup ##

Demikianlah cara deployment aplikasi ke penyedia layanan PaaS di cloud. Setelah kita bisa melakukannya secara manual, pada [artikel berikutnya kita akan otomasi deployment ini menggunakan Travis CI](http://software.endy.muhardin.com/java/project-bootstrap-04/). Stay tuned ......



