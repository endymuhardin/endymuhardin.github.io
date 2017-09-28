---
layout: post
title: "Menggunakan Proprietary Jar dengan Gitlab CI dan Heroku"
date: 2017-09-28 08:52
comments: true
categories:
- devops
---
Pada artikel sebelumnya, kita sudah [mengotomasi proses build dengan Gitlab CI](https://software.endy.muhardin.com/devops/gitlab-ci-kubernetes-gke/) dan [deployment ke Heroku](https://software.endy.muhardin.com/java/project-bootstrap-03/). Proses tersebut bisa dilakukan dengan lancar apabila semua library/dependensi yang kita gunakan dalam aplikasi kita adalah open source. Dependensi open source tersedia di repository Maven Central, sehingga dimanapun kita jalankan perintah build, maka Maven akan mengunduh dependensi yang dibutuhkan langsung dari internet.

Akan menjadi persoalan kalau project kita menggunakan library yang tidak open source atau proprietary. Contoh paling umum adalah database Oracle. Agar aplikasi kita bisa terhubung ke database Oracle, kita harus menggunakan JDBC Driver dari Oracle yang tidak open source, sehingga tidak tersedia di Maven Central.

Untuk mengatasi hal ini, kita perlu menyesuaikan proses build aplikasi kita agar tetap bisa berjalan otomatis dari commit hingga deployment.

<!--more-->

## Membuat Repo Maven Lokal ##

Agar project kita terpenuhi dependensinya, kita perlu membuat repository lokal di laptop/PC dan kemudian menginstal dependensi tersebut di repo lokal. Tentunya sebelumnya kita perlu mengunduh dulu JDBC Driver Oracle [di websitenya](http://www.oracle.com/technetwork/database/application-development/jdbc/overview/index.html). Kita asumsikan saja setelah diunduh, file `ojdbc8.jar` tersebut kita letakkan di folder `/tmp/`.

Selanjutnya, kita akan membuat repository Maven lokal di dalam folder project. Biasanya Maven sudah memiliki repo lokal yang berlokasi di `HOME/.m2/repository`. Kita akan memasukkan file `ojdbc8.jar` tersebut sesuai dengan struktur folder dan aturan penamaan file Maven. Berikut perintah untuk instalasinya

```
mvn install:install-file -DgroupId=com.oracle.jdbc -DartifactId=ojdbc8 -Dversion=12.2.0.1 -Dpackaging=jar -Dfile=/tmp/ojdbc8.jar
```

Setelah file tersebut terinstal (bisa dipastikan dengan cara melihat ke folder `HOME/.m2/repository/com/oracle/jdbc`) kita bisa menggunakannya di project dengan mendeklarasikan dependensi seperti ini

```xml
<dependency>
    <groupid>com.oracle.jdbc</groupid>
    <artifactid>ojdbc8</artifactid>
    <version>12.2.0.1</version>
</dependency>
```

Kita bisa test build dan jalankan project kita seperti biasa, misalnya dengan perintah `mvn clean spring-boot:run` untuk memastikan aplikasi kita bisa dijalankan dengan baik.

Bila sudah berjalan lancar, kita akan melakukan tindakan lebih lanjut supaya project kita bisa dibuild juga secara otomatis oleh Gitlab CI. Kira-kira seperti ini diagramnya:

[![Laptop - File Server - Gitlab CI]({{site.url}}/images/uploads/2017/proprietary-jar/skema-private-repo.png)]({{site.url}}/images/uploads/2017/proprietary-jar/skema-private-repo.png)

## Setup Gitlab CI ##

Agar skema di atas bisa berjalan dengan baik, kita perlu server yang bisa diakses dari internet, misalnya kita beri nama `file.server.saya.com`. Kita upload file `ojdbc8.jar` tersebut dari laptop ke server tersebut

```
scp /tmp/ojdbc8.jar root@file.server.saya.com:/var/lib/
```

File ini nantinya akan diunduh oleh proses build Gitlab CI dengan perintah sebagai berikut

```
scp  root@file.server.saya.com:/var/lib/ojdbc8.jar /tmp/
```

Untuk selanjutnya diinstal di repo lokal Maven dengan perintah yang sama

```
mvn install:install-file -DgroupId=com.oracle.jdbc -DartifactId=ojdbc8 -Dversion=12.2.0.1 -Dpackaging=jar -Dfile=/tmp/ojdbc8.jar
```

Agar perintah `scp` dari Gitlab CI ke `file.server.saya.com` berjalan dengan mulus, perlu dilakukan persiapan:

* membuat pasangan private-public key untuk SSH
* memasang isi private key menjadi secret variabel di Gitlab CI
* mendaftarkan public key ke `file.server.saya.com` agar bisa login SSH tanpa password
* mendaftarkan digital signature hostname `file.server.saya.com` di Gitlab CI agar tidak diminta konfirmasi host karena baru pertama akses SSH

Rangkaian persiapan ini telah dijelaskan [di artikel terdahulu](https://software.endy.muhardin.com/devops/deploy-gitlab-vps/). Silakan dibaca kembali bila lupa.

Berikut potongan file konfigurasi `.gitlab-ci.yml` yang berkaitan dengan kegiatan unduh dan setup repo lokal maven di Gitlab CI.

```yml
image: maven:3-jdk-8

stages:
 - build
 - deploy

before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && ssh-keyscan -H "$SSH_HOSTNAME" > ~/.ssh/known_hosts'
  - scp root@$SSH_HOSTNAME:/var/lib/ojdbc8.jar /tmp/

build:
 stage: build
 script:
 - mvn install:install-file -DgroupId=com.oracle.jdbc -DartifactId=ojdbc8 -Dversion=12.2.0.1 -Dpackaging=jar -Dfile=/tmp/ojdbc8.jar
 - mvn clean package -DskipTests
 artifacts:
     paths:
       - target/*.jar
```

Jangan lupa daftarkan variabel `SSH_HOSTNAME` dengan isi `file.server.saya.com`.

## Deployment ke Heroku ##

Pada [artikel terdahulu](https://software.endy.muhardin.com/java/project-bootstrap-03/) memang kita telah membahas tentang deployment ke Heroku. Akan tetapi pada artikel tersebut, kita menggunakan metode source deployment, yaitu mengunggah source code ke Heroku untuk kemudian menyuruh Heroku melakukan build sekali lagi.

Metode ini tidak bisa kita lakukan saat ini, karena nantinya akan ribet lagi untuk menyuruh Heroku mengunduh `ojdbc8.jar` dari `file.server.saya.com`. Oleh karena itu, kita ingin langsung saja mengunggah hasil build dari langkah sebelumnya. Hasil build dari proses sebelumnya bisa digunakan oleh proses berikut dengan konfigurasi artifact yang kita pasang pada job `build`

```yml
 artifacts:
     paths:
       - target/*.jar
```

Agar bisa mendeploy `jar` ke Heroku, kita membutuhkan Heroku CLI. Cara instalasinya bisa dilihat di websitenya, pilih yang [versi Debian/Ubuntu](https://devcenter.heroku.com/articles/heroku-cli#debian-ubuntu). Dengan demikian, kita juga harus menggunakan image `ubuntu:latest` agar langkah-langkah tersebut bisa dijalankan.

Selanjutnya, kita hanya perlu menjalankan perintah untuk instalasi Heroku CLI, kemudian menjalankan perintah deploy. Kita membutuhkan `api key` Heroku yang terpasang sebagai environment variable dan nama aplikasi di Heroku. Berikut konfigurasi scriptnya

```yml
deploy-heroku:
 stage: deploy
 image: ubuntu:latest
 variables:
   HEROKU_API_KEY: $HEROKU_API_KEY
 script:
   - apt install wget -y
   - wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh
   - heroku deploy:jar target/*.jar --app $HEROKU_APP_NAME
```

## Kesimpulan ##

Sebisa mungkin, selalu gunakan library open source. Ini akan sangat memudahkan kita dalam proses development dan otomasi workflow. Akan tetapi adakalanya kita tidak bisa menghindari penggunaan library proprietary. Jadi apa boleh buat terpaksa harus dilakukan akal-akalan. Walaupun demikian, tetap harus legal. Sebetulnya bisa saja tadi kita masukkan file `ojdbc8.jar` ke dalam struktur folder project, misalnya di folder `.mvn/repository` sejajar dengan `src` dan `pom.xml`. Kemudian kita daftarkan folder tersebut sebagai repo lokal di `pom.xml` dengan konfigurasi berikut

```xml
<repositories>
    <repository>
        <id>project.local</id>
        <name>project</name>
        <url>file:${project.basedir}/.mvn/repository</url>
    </repository>
</repositories>
```

Kemudian tinggal kita commit saja folder `.mvn/repository` ke Git repo, sehingga proses build berjalan dengan lancar di Gitlab CI maupun Heroku. Teknik ini diajarkan oleh Heroku sendiri [di artikel ini](https://devcenter.heroku.com/articles/local-maven-dependencies).

Walaupun demikian, kita tidak bisa lakukan teknik ini untuk project open source, karena kita tidak diijinkan Oracle untuk mendistribusikan file `ojdbc8.jar` tersebut. Bila kita buat repo lokal berisi file tersebut dan kita unggah ke Git repo terbuka, maka kita bisa dimarahi oleh pengacaranya Oracle ;)

Demikian penjelasan tentang penggunaan library proprietary dengan Gitlab CI. Berikut isi file lengkapnya untuk referensi

### .gitlab-ci.yml ###

```yml
image: maven:3-jdk-8

stages:
 - build
 - deploy

before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerenv ]] && ssh-keyscan -H "$SSH_HOSTNAME" > ~/.ssh/known_hosts'
  - scp root@$SSH_HOSTNAME:/var/lib/ojdbc8.jar /tmp/

build:
 stage: build
 script:
 - mvn install:install-file -DgroupId=com.oracle.jdbc -DartifactId=ojdbc8 -Dversion=12.2.0.1 -Dpackaging=jar -Dfile=/tmp/ojdbc8.jar
 - mvn clean package -DskipTests
 artifacts:
     paths:
       - target/*.jar

deploy-dev:
 stage: deploy
 image: ubuntu:latest
 variables:
   HEROKU_API_KEY: $HEROKU_API_KEY
 script:
   - apt install wget -y
   - wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh
   - heroku deploy:jar target/*.jar --app $HEROKU_APP_NAME
```


### pom.xml ###

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>id.artivisi.belajar</groupId>
	<artifactId>belajar-private-jar</artifactId>
	<version>0.0.1</version>
	<packaging>jar</packaging>

	<name>belajar-private-jar</name>
	<description>Demo project for Spring Boot</description>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>1.5.7.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>

	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
		<java.version>1.8</java.version>
		<thymeleaf.version>3.0.2.RELEASE</thymeleaf.version>
		<thymeleaf-layout-dialect.version>2.1.1</thymeleaf-layout-dialect.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
			<groupId>org.flywaydb</groupId>
			<artifactId>flyway-core</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-thymeleaf</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-cloud-connectors</artifactId>
		</dependency>
		<dependency>
			<groupId>org.thymeleaf.extras</groupId>
			<artifactId>thymeleaf-extras-springsecurity4</artifactId>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupid>com.oracle.jdbc</groupid>
			<artifactid>ojdbc8</artifactid>
			<version>12.2.0.1</version>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
				<configuration>
                                <executable>true</executable>
                            </configuration>
			</plugin>
			<plugin>
				<groupId>pl.project13.maven</groupId>
				<artifactId>git-commit-id-plugin</artifactId>
				<configuration>
					<failOnNoGitDirectory>false</failOnNoGitDirectory>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>
```

Semoga bermanfaat ...
