---
layout: post
title: "External Services dengan Docker Compose"
date: 2022-04-06 08:05
comments: true
categories: 
- aplikasi
---

Di jaman sekarang, aplikasi yang saya buat umumnya sudah mengadopsi arsitektur `Cloud Native`, yaitu aplikasi yang bisa berjalan dengan baik di environment cloud. Penjelasan detail tentang aplikasi `Cloud Native` ini sudah pernah saya jelaskan di Youtube.

<iframe width="560" height="315" src="https://www.youtube.com/embed/nTq7o18ij-M" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Singkatnya, aplikasi cloud native biasanya menggunakan beberapa external services, misalnya:

* Database relasional (MySQL, PostgreSQL, dsb)
* Message Broker (Kafka, dsb)
* Database non-relasional / NoSQL (Redis, Elasticsearch, dsb)

External service ini harus bisa diganti dengan implementasi lain, misalnya dari local ke cloud, dari cloud ke on-premise, dan berbagai skenario lainnya.

Agar kita bisa develop aplikasi dengan external service tersebut, maka development environment kita (misalnya PC atau laptop) harus menyediakan service yang dibutuhkan. Kebutuhan ini berbeda-beda antar project. Misal di project A saya menggunakan MySQL. Project B menggunakan PostgreSQL. Project C menggunakan PostgreSQL dan Kafka. Project D menggunakan MySQL dan Redis. Project E menggunakan ElasticSearch dan MongoDB. Dan seterusnya.

Apabila kita harus menginstal semua service tersebut, dan jalan pada waktu booting, waduh berapa RAM yang harus kita sediakan. Belum lagi nanti kita harus membuatkan database instance untuk masing-masing aplikasi. Bisa-bisa kita instal MySQL yang isinya belasan database sesuai dengan project yang pernah kita tangani.

Ini juga menjadi lebih sulit buat para team leader atau arsitek yang harus melakukan supervisi ke banyak project sekaligus. Oleh karena itu, kita perlu membuat sistem kerja yang baik agar tidak kusut. 

Solusi yang biasa saya gunakan, terdiri dari 3 aspek:

1. Project harus portable
2. Project harus self-contained
3. External service yang dibutuhkan, harus dideklarasikan dengan konsep Infrastructure as a Code

Mari kita elaborasi ...

<!--more-->

* TOC
{:toc}

## Project Portability ##

Project yang kita kerjakan, harus bisa langsung dibuka dan dibuild di semua environment (Windows, Linux, Mac) sejak kita melakukan `git clone`. Semua library yang dibutuhkan harus bisa didapatkan dari repository, baik yang publik di internet, ataupun di server internal kita. Di Java, ini bisa dilakukan dengan menggunakan Maven atau Gradle. Apa itu Maven, bisa dibaca [di artikel ini](% post_url 2015-02-24-apache-maven %) atau ditonton [di video ini](https://www.youtube.com/embed/4bMPYQKHlfc).

<iframe width="560" height="315" src="https://www.youtube.com/embed/4bMPYQKHlfc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Dengan menggunakan Maven atau Gradle, maka project kita akan bisa dibuka di segala editor, misalnya Visual Studio Code, Intellij IDEA, Netbeans, Eclipse, dan sebagainya.

## Project Self Containment ##

Project kita harus bisa dijalankan (run) di semua environment, hanya dengan bermodalkan hasil `git clone`. Ini artinya yang kita simpan di source repository bukan cuma source code. Tapi juga file lain seperti:

* konfigurasi koneksi database
* script untuk membuat database
* data-data awal agar aplikasi kita bisa dijalankan (misalnya data kota/kabupaten/kecamatan, data tingkat pendidikan, dsb)
* file pendukung lain seperti image untuk icon, API key, credential file, dan sebagainya

Semua file-file di atas harus ikut disimpan di source repository, biasanya jaman now orang pakai Git. Kemudian, script pembuatan database dan pengisian data awal juga harus otomatis dijalankan pada waktu aplikasi di run. Tidak boleh ada kegiatan manual orang login ke database dan menjalankan perintah-perintah. Karena kalau ada kegiatan manual, akan ada orang yang lupa, langkah yang ketinggalan, salah ketik, dan human error lain yang mengakibatkan aplikasi gagal jalan.

Di Java biasanya kita menggunakan migration tools seperti [FlywayDB](https://flywaydb.org/) atau [Liquibase](https://liquibase.org/).

## Infrastructure as a Code ##

Berikutnya kita bahas tentang external services. Jaman dulu, saya menginstal MySQL dan PostgreSQL di laptop, walaupun diset tidak start pada waktu boot. Akan tetapi, ini cukup merepotkan, karena untuk tiap project yang akan dijalankan, saya harus create user dan create database dulu. Nama database, username/password database harus disesuaikan dengan konfigurasi masing-masing project. Demikian juga versinya. MySQL versi 5 tidak kompatibel dengan versi 8. Padahal belum tentu semua project bisa dinaikkan ke MySQL 8. Jadinya kita harus mencatat aplikasi mana pakai MySQL versi berapa.

Ada cara yang lebih efektif daripada membuat catatan tersebut, yaitu langsung saja kita tuliskan dalam bentuk file `docker-compose`. Dengan demikian, file ini bisa langsung kita jalankan. Docker akan mengunduh versi yang sesuai, kemudian membuatkan database dengan nama, username, dan password yang kita tentukan.

Berikut adalah contoh file `docker-compose.yml` untuk database MySQL

```yml
services:
  db-belajar:
    image: mysql
    platform: linux/x86_64
    environment:
      - MYSQL_RANDOM_ROOT_PASSWORD=yes
      - MYSQL_DATABASE=belajardb
      - MYSQL_USER=belajar
      - MYSQL_PASSWORD=belajar123
    ports:
      - 3306:3306
    volumes:
      - ./db-belajar:/var/lib/mysql
```

Ini untuk database PostgreSQL

```yml
services:
  db-belajar:
    image: postgres
    environment:
      - POSTGRES_DB=belajar-db
      - POSTGRES_USER=belajar
      - POSTGRES_PASSWORD=belajar123
    ports:
      - 5432:5432
    volumes:
      - ./db-belajar:/var/lib/postgresql/data
```

Bila aplikasi kita butuh PostgreSQL dan Kafka sekaligus, tinggal kita pasang keduanya seperti ini

```yml
services:
  db-belajar:
    image: postgres:14
    environment:
      - POSTGRES_DB=belajar-db
      - POSTGRES_USER=belajar
      - POSTGRES_PASSWORD=belajar123
    ports:
      - 5432:5432
    volumes:
      - ./db-belajar:/var/lib/postgresql/data

  zookeeper:
    image: confluentinc/cp-zookeeper
    container_name: zookeeper
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka
    container_name: kafka-broker
    depends_on:
      - zookeeper
    ports:
      - 9092:9092
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_INTERNAL:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092,PLAINTEXT_INTERNAL://broker:29092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
```

Dengan adanya `docker-compose` ini, kita tinggal menjalankan perintah `docker-compose up` di masing-masing folder project. Dia akan langsung mengunduh versi yang sesuai, membuatkan database, username/password, dan kita tinggal akses di port yang ditentukan. Setelah selesai, tekan `Ctrl-C`, kemudian `docker-compose down`, dan hapus file databasenya. 

Jangan lupa daftarkan folder yang berisi data testing tadi (`db-timezone`, `db-authserver`) ke `.gitignore` supaya tidak ikut tersimpan di git.


## Connect ke Database dalam Docker ##

Apabila kita hanya bermodalkan `Docker` untuk menjalankan database, tanpa menginstal MySQL atau PostgreSQL, kita tidak akan bisa menjalankan aplikasi commandline `mysql` dan `psql` karena aplikasi tersebut tidak terinstal. Contohnya, bila kita mencoba connect seperti ini

```
psql -h 127.0.0.1 -U belajar -d belajar-db
```

Maka kita akan mendapatkan output seperti ini

```
zsh: command not found: psql
```

Oleh karena itu, kita harus menjalankan `psql` tersebut di dalam docker container postgresql. Kita cari dulu nama containernya dengan perintah `docker ps -a`. Outputnya seperti ini

```
CONTAINER ID   IMAGE             COMMAND                  CREATED              STATUS              PORTS                    NAMES
0c576d91f55d   postgres          "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:5432->5432/tcp   belajar-vault-db-belajar-1
```

Kita bisa connect ke database dengan perintah berikut

```
docker exec -it belajar-vault-db-belajar-1 psql -U belajar -d belajar-db
```

Setelah dijalankan, kita akan mendapatkan prompt psql seperti ini

```
psql (16.3 (Debian 16.3-1.pgdg120+1))
Type "help" for help.

belajar-db=# 
```

Sedangkan untuk MySQL, perintahnya sebagai berikut

```
docker exec -it nama-container-mysql mysql -u belajar belajardb -p
```

Kita akan disambut dengan prompt password. Setelah kita masukkan password, maka kita akan mendapati prompt mysql seperti ini

```
Enter password: 
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 9.0.0 MySQL Community Server - GPL

Copyright (c) 2000, 2024, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> 
```

Demikian tips untuk menyiapkan development environment agar kita mudah menangani banyak project sekaligus. 

Untuk yang butuh penjelasan secara visual, bisa menonton video penjelasannya di Youtube.

<iframe width="560" height="315" src="https://www.youtube.com/embed/IT3dB-8HxLA?si=fWz9O4hB208TcXnJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Docker Compose Komplit ##

Sebagai referensi, berikut file `docker-compose.yml` yang saya gunakan untuk training microservices. Asal laptopnya kuat, kita bisa jalankan semua service ini untuk melayani studi kasus microservice yang kita demokan.

```yml
services:
  db-rekening:
    image: postgres
    environment:
      - POSTGRES_DB=rekening-db
      - POSTGRES_USER=rekening
      - POSTGRES_PASSWORD=rekening123
    ports:
      - 54321:5432
    volumes:
      - ../rekening/db-rekening:/var/lib/postgresql/data

  db-pembayaran:
    image: postgres
    environment:
      - POSTGRES_DB=pembayaran-db
      - POSTGRES_USER=pembayaran
      - POSTGRES_PASSWORD=pembayaran123
    ports:
      - 54322:5432
    volumes:
      - ../pembayaran/db-pembayaran:/var/lib/postgresql/data
      
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
    ports:
      - 9090:9090
    restart: unless-stopped
    volumes:
      - ./prometheus/config:/etc/prometheus
      - ./prometheus/data:/prometheus
  
  grafana:
    image: grafana/grafana
    container_name: grafana
    ports:
      - 3000:3000
    restart: unless-stopped
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=grafana
    volumes:
      - ./grafana/config:/etc/grafana/provisioning/datasources
      - ./grafana/data:/var/lib/grafana

  zipkin:
    image: openzipkin/zipkin
    ports:
      - 9411:9411
  
  elasticsearch:
    image: elasticsearch:7.17.23
    environment:
      discovery.type: single-node
      ES_JAVA_OPTS: "-Xmx256m -Xms256m"
    ports:
      - "9200:9200"

  logstash:
    image: logstash:7.17.23
    command: -f /etc/logstash/conf.d/
    environment:
      LS_JAVA_OPTS: "-Xmx256m -Xms256m"
    volumes:
      - ./logstash/config:/etc/logstash/conf.d/
    ports:
      - "5001:5001"
    depends_on:
      - elasticsearch

  kibana:
    image: kibana:7.17.23
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

  kafka:
    image: 'bitnami/kafka:latest'
    environment:
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://0.0.0.0:9094
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092,EXTERNAL://172.16.2.96:9094
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
    ports:
      - '9092:9092'
      - '9094:9094'

  db-keycloak:
    image: postgres
    volumes:
      - ./keycloak-db:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: keycloakdb
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: keycloak1234
  
  keycloak:
    image: quay.io/keycloak/keycloak:23.0.6
    command: start
    environment:
      KC_HOSTNAME: localhost
      KC_HOSTNAME_PORT: 20000
      KC_HOSTNAME_STRICT_BACKCHANNEL: false
      KC_HTTP_ENABLED: true
      KC_HOSTNAME_STRICT_HTTPS: false
      KC_HEALTH_ENABLED: true
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin1234
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://db-keycloak/keycloakdb
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: keycloak1234
    ports:
      - 20000:8080
    depends_on:
      - db-keycloak
```

Selamat mencoba, semoga bermanfaat ...