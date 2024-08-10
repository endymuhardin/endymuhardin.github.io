---
layout: post
title: "Optimasi Docker Image Spring Boot"
date: 2024-07-12 07:00
comments: true
categories:
- devops
---

Pada [artikel terdahulu]({% post_url 2017-04-03-docker-workflow %}), kita sudah membahas pembuatan docker image untuk aplikasi berbasis Spring Boot. Kita membuat docker image dengan empat baris perintah dalam file `Dockerfile` seperti ini

```
FROM openjdk:latest
ADD target/belajar-ci.jar /opt/app.jar
RUN bash -c 'touch /opt/app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/opt/app.jar"]
```

Walaupun sederhana dan mudah, ada beberapa kekurangan dari Dockerfile tersebut, yaitu: 
<!--more-->
1. Untuk melakukan build, kita membutuhkan Java SDK dan Maven di mesin yang dilakukan untuk build. Dengan demikian, kita harus menyediakan Java dan Maven di build server.

2. image yang dihasilkan hanya terdiri dari satu layer saja, berisi:
  
* kode program aplikasi
* library spring
* library lain yang dibutuhkan spring ataupun aplikasi kita

Karena hanya terdiri dari satu layer, maka docker tidak dapat melakukan cache. Akibatnya:

* proses build lebih lama, karena tiap kali dijalankan, Docker akan membuat ulang layer tersebut
* upload ke repository lebih berat dan lama, karena keseluruhan image harus diupload
* penyimpanan image di repository lebih boros, karena tiap image dianggap file baru

Solusinya adalah memisahkan image kita menjadi beberapa layer, yaitu :

* layer berisi library spring dan dependensi lainnya
* layer berisi kode program kita

Sebetulnya layer yang sering berubah hanyalah layer kode program kita sendiri. Layer berisi library spring hanya akan berubah ketika kita mengubah versi library ataupun ketika kita menambah/mengurangi library.

Dengan memisahkan kedua hal tersebut menjadi layer tersendiri, Docker bisa membuat cache untuk layer dependensi library. Dengan demikian, proses build menjadi lebih cepat. Proses upload ke registry juga akan lebih cepat, karena layer dependensi akan terdeteksi oleh docker registry dan tidak akan dikirim ulang. Demikian juga untuk penyimpanan, hanya layer kode program kita saja yang akan disimpan. Sedangkan layer dependensi bisa diarahkan ke image versi sebelumnya.

`Dockerfile` yang sudah multi-layer seperti ini ada dijelaskan dan dicontohkan di [dokumentasi resmi Spring Boot](https://docs.spring.io/spring-boot/reference/packaging/container-images/efficient-images.html)

Bentuknya seperti ini

```
FROM bellsoft/liberica-openjre-alpine:21-cds AS builder
WORKDIR /builder
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted

FROM bellsoft/liberica-openjre-alpine:21-cds
WORKDIR /application
COPY --from=builder /builder/extracted/dependencies/ ./
COPY --from=builder /builder/extracted/spring-boot-loader/ ./
COPY --from=builder /builder/extracted/snapshot-dependencies/ ./
COPY --from=builder /builder/extracted/application/ ./
ENTRYPOINT ["java", "-jar", "application.jar"]
```

Dockerfile tersebut terdiri dari dua tahap. Tahap pertama meng-extract file jar yang dihasilkan dari `mvn package` menjadi beberapa folder. Tahap kedua memasukkan masing-masing folder secara terpisah, sehingga menjadi layer berbeda di dalam docker image.

Untuk menguji hasilnya, berikut langkah yang bisa kita lakukan:

1. Build aplikasi dengan perintah `mvn clean package`. Langkah ini akan menghasilkan file aplikasi di folder `target`. 

2. Build docker image dengan perintah berikut : `docker build -t endymuhardin/training-kubernetes .`

3. Ubah sedikit source codenya. Tambahkan komentar, baris kosong, atau apapun. Jangan ubah file `pom.xml`

4. Jalankan lagi build image seperti di langkah 2. Perhatikan log filenya.

Log output untuk `Dockerfile` yang 4 baris hasilnya seperti ini:

### Build Pertama ###

```
[+] Building 4.9s (8/8) FINISHED                                                                                   docker:default
 => [internal] load build definition from Dockerfile                                                            0.0s
 => => transferring dockerfile: 221B                                                                                         0.0s
 => [internal] load metadata for docker.io/library/eclipse-temurin:21                                                        4.2s
 => [internal] load .dockerignore                                                                                            0.0s
 => => transferring context: 2B                                                                                              0.0s
 => [internal] load build context                                                                                            0.3s
 => => transferring context: 50.19MB                                                                                         0.3s
 => CACHED [1/3] FROM docker.io/library/eclipse-temurin:21@sha256:3d92c3222b9d376e420e7099054604dc0d7bafbebbcb4f79ffd77763c  0.0s
 => => resolve docker.io/library/eclipse-temurin:21@sha256:3d92c3222b9d376e420e7099054604dc0d7bafbebbcb4f79ffd77763cd6a1bcd  0.0s
 => [2/3] ADD target/*.jar /opt/app.jar                                                                                      0.1s
 => [3/3] RUN bash -c 'touch /opt/app.jar'                                                                                   0.2s
 => exporting to image                                                                                                       0.1s
 => => exporting layers                                                                                                      0.1s
 => => writing image sha256:644817b896919c813952ccda540c44fb9f4da025b9d5033d3dc172d60612b646                                 0.0s
 => => naming to docker.io/endymuhardin/training-kubernetes 
 ```

### Build Kedua ###

```
[+] Building 2.1s (8/8) FINISHED                                                                                   docker:default
 => [internal] load build definition from Dockerfile                                                             0.0s
 => => transferring dockerfile: 221B                                                                                         0.0s
 => [internal] load metadata for docker.io/library/eclipse-temurin:21                                                        1.3s
 => [internal] load .dockerignore                                                                                            0.0s
 => => transferring context: 2B                                                                                              0.0s
 => [internal] load build context                                                                                            0.4s
 => => transferring context: 50.19MB                                                                                         0.4s
 => CACHED [1/3] FROM docker.io/library/eclipse-temurin:21@sha256:3d92c3222b9d376e420e7099054604dc0d7bafbebbcb4f79ffd77763c  0.0s
 => => resolve docker.io/library/eclipse-temurin:21@sha256:3d92c3222b9d376e420e7099054604dc0d7bafbebbcb4f79ffd77763cd6a1bcd  0.0s
 => [2/3] ADD target/*.jar /opt/app.jar                                                                                      0.1s
 => [3/3] RUN bash -c 'touch /opt/app.jar'                                                                                   0.2s
 => exporting to image                                                                                                       0.1s
 => => exporting layers                                                                                                      0.1s
 => => writing image sha256:f0f1f58fab4960c7cc9de5b33107c1d8ac5058c058990f075cdd6b83a81e16e0                                 0.0s
 => => naming to docker.io/endymuhardin/training-kubernetes 
 ```

Log output untuk `Dockerfile` dua tahap hasilnya seperti ini:

### Build Pertama ###

```
[+] Building 47.0s (14/14) FINISHED                                                                                docker:default
 => [internal] load build definition from Dockerfile.2.multistage-no-compile                                                 0.0s
 => => transferring dockerfile: 633B                                                                                         0.0s
 => [internal] load metadata for docker.io/bellsoft/liberica-openjre-alpine:21-cds                                           1.0s
 => [internal] load .dockerignore                                                                                            0.0s
 => => transferring context: 2B                                                                                              0.0s
 => [builder 1/4] FROM docker.io/bellsoft/liberica-openjre-alpine:21-cds@sha256:b95306fc6976e49dae211342f55782b2a53b2641a4  44.8s
 => => resolve docker.io/bellsoft/liberica-openjre-alpine:21-cds@sha256:b95306fc6976e49dae211342f55782b2a53b2641a4d046c4c8e  0.0s
 => => sha256:d713f0701364d1770e7f9b95a110d8e20b56af29fe461f19325bccd1329ca048 951B / 951B                                   0.0s
 => => sha256:8e8c330ab61c78b7d57fd1dc389be0a21e54d48924f8b784749ea97814a5103c 9.11kB / 9.11kB                               0.0s
 => => sha256:2fcc4bc920aad44bf67b5ac2282ec9f49911dc3a2a036ab4cd4bc61cdf064794 2.67MB / 2.67MB                               2.8s
 => => sha256:4432e8e7f24baae9d2fe038bbe38c0ed6a5ba5677ab2b42391fc421e21c5abad 52.85MB / 52.85MB                            44.1s
 => => sha256:b95306fc6976e49dae211342f55782b2a53b2641a4d046c4c8e04fbe6f23c5e0 741B / 741B                                   0.0s
 => => extracting sha256:2fcc4bc920aad44bf67b5ac2282ec9f49911dc3a2a036ab4cd4bc61cdf064794                                    0.1s
 => => extracting sha256:4432e8e7f24baae9d2fe038bbe38c0ed6a5ba5677ab2b42391fc421e21c5abad                                    0.6s
 => [internal] load build context                                                                                            0.4s
 => => transferring context: 50.19MB                                                                                         0.4s
 => [stage-1 2/6] WORKDIR /application                                                                                       0.2s
 => [builder 2/4] WORKDIR /builder                                                                                           0.2s
 => [builder 3/4] COPY target/*.jar application.jar                                                                          0.1s
 => [builder 4/4] RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted                     0.5s
 => [stage-1 3/6] COPY --from=builder /builder/extracted/dependencies/ ./                                                    0.1s
 => [stage-1 4/6] COPY --from=builder /builder/extracted/spring-boot-loader/ ./                                              0.0s
 => [stage-1 5/6] COPY --from=builder /builder/extracted/snapshot-dependencies/ ./                                           0.0s
 => [stage-1 6/6] COPY --from=builder /builder/extracted/application/ ./                                                     0.0s
 => exporting to image                                                                                                       0.1s
 => => exporting layers                                                                                                      0.1s
 => => writing image sha256:0fa86e9b1c8aaabd58b185258f7ff65fce6e58fecd2b2078f9150d1ba787252a                                 0.0s
 => => naming to docker.io/endymuhardin/training-kubernetes 
```

### Build Kedua ###

```
[+] Building 3.6s (15/15) FINISHED                                                                                 docker:default
 => [internal] load build definition from Dockerfile.2.multistage-no-compile                                                 0.0s
 => => transferring dockerfile: 633B                                                                                         0.0s
 => [internal] load metadata for docker.io/bellsoft/liberica-openjre-alpine:21-cds                                           2.2s
 => [auth] bellsoft/liberica-openjre-alpine:pull token for registry-1.docker.io                                              0.0s
 => [internal] load .dockerignore                                                                                            0.0s
 => => transferring context: 2B                                                                                              0.0s
 => [builder 1/4] FROM docker.io/bellsoft/liberica-openjre-alpine:21-cds@sha256:b95306fc6976e49dae211342f55782b2a53b2641a4d  0.0s
 => [internal] load build context                                                                                            0.5s
 => => transferring context: 50.19MB                                                                                         0.5s
 => CACHED [builder 2/4] WORKDIR /builder                                                                                    0.0s
 => [builder 3/4] COPY target/*.jar application.jar                                                                          0.2s
 => [builder 4/4] RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted                     0.6s
 => CACHED [stage-1 2/6] WORKDIR /application                                                                                0.0s
 => CACHED [stage-1 3/6] COPY --from=builder /builder/extracted/dependencies/ ./                                             0.0s
 => CACHED [stage-1 4/6] COPY --from=builder /builder/extracted/spring-boot-loader/ ./                                       0.0s
 => CACHED [stage-1 5/6] COPY --from=builder /builder/extracted/snapshot-dependencies/ ./                                    0.0s
 => [stage-1 6/6] COPY --from=builder /builder/extracted/application/ ./                                                     0.0s
 => exporting to image                                                                                                       0.0s
 => => exporting layers                                                                                                      0.0s
 => => writing image sha256:54dfa1446d9bcd964e32e616f1f420fe4b575c9a98df9edcaed25523b5f8356f                                 0.0s
 => => naming to docker.io/endymuhardin/training-kubernetes
```

Seperti kita lihat, seluruh kegiatan build diulang pada `Dockerfile` yang 4 baris. Tapi kita melihat adanya penggunaan cache di tahap 1-5 pada `Dockerfile` yang dua tahap. 

Kita juga bisa melihat perbedaannya pada waktu mengupload image ke Dockerhub. Jalankan perintah berikut untuk mengupload image

`docker push -a endymuhardin/training-kubernetes`

Log output untuk `Dockerfile` yang 4 baris hasilnya seperti ini:

### Push Pertama ###

```
The push refers to repository [docker.io/endymuhardin/training-kubernetes]
316e1b6d0314: Pushing [==================================================>]  50.18MB
10447a2655ba: Pushing [===============================================>   ]  47.19MB/50.18MB
fac3e1ffa8ab: Mounted from library/eclipse-temurin 
5987eea8dcdd: Mounted from library/eclipse-temurin 
bad7e359b364: Mounted from library/eclipse-temurin 
29594091ba9c: Mounted from library/maven 
24a48d4af45b: Mounted from library/maven 
```

### Push Kedua ###

```
7afc8e1853dd: Pushing [==================>                                ]  18.88MB/50.18MB
9803de726c80: Pushing [====================>                              ]  20.45MB/50.18MB
fac3e1ffa8ab: Layer already exists 
5987eea8dcdd: Mounted from library/maven 
bad7e359b364: Layer already exists 
29594091ba9c: Layer already exists 
24a48d4af45b: Layer already exists 
```

Pada push yang kedua kali, kita lihat bahwa layer-layer yang berasal dari `eclipse-temurin` dan `maven` dinyatakan sudah ada dan tidak perlu diupload lagi. Sedangkan aplikasi kita yang berbentuk `jar` berukuran 50MB diupload lagi semuanya.

Log output untuk `Dockerfile` dua tahap hasilnya seperti ini:

### Push Pertama ###

```
The push refers to repository [docker.io/endymuhardin/training-kubernetes-2]
e01105745d9d: Pushing [==================================================>]  13.31kB
8dea912e698c: Preparing 
e9e37808484f: Pushing [=============>                                     ]  13.09MB/49.96MB
0529d1c8e878: Mounted from bellsoft/liberica-openjre-alpine 
7b393f6f1292: Pushing [==================================================>]  6.558MB
```

### Push Kedua ###

```
c9ed4c871ce4: Pushing [==================================================>]  13.31kB
8dea912e698c: Layer already exists 
e9e37808484f: Layer already exists 
0529d1c8e878: Layer already exists 
7b393f6f1292: Layer already exists 
```

Kita bisa lihat hasilnya. `Dockerfile` dua tahap hanya mengubah satu layer yang berisi kode program kita, sehingga ukurannya kecil. Hanya 13KB saja. Sedangkan layer lain sama dengan yang kita push pertama kali. Dengan demikian, push berikutnya akan berjalan sangat cepat, hemat bandwidth, dan juga hemat space harddisk.

## Build Image Menggunakan Plugin Spring Boot ##

Spring boot juga sudah membuatkan plugin yang cara kerjanya sama dengan `Dockerfile` dua tahap di atas. Ini lebih baik daripada kita buat sendiri, karena prosedur buildnya akan terus dimaintain dan diimprove oleh para developer Spring. Detailnya dijelaskan di [dokumentasi resmi Spring Boot](https://docs.spring.io/spring-boot/reference/packaging/container-images/cloud-native-buildpacks.html)

Berikut perintah untuk build dengan plugin Spring.

```
mvn clean spring-boot:build-image
```

## Build tanpa Instalasi Maven ##

`Dockerfile` dua tahap di atas membutuhkan Java SDK dan Maven terinstal di komputer yang melakukan build. Untuk build di laptop programmer, ini tidak menjadi masalah. Akan tetapi untuk di CI/CD server, belum tentu Java SDK dan Maven tersedia. Untuk itu, kita bisa memodifikasi `Dockerfile` agar menyertakan tahap kompilasi dan pembuatan file `jar`. Bentuknya seperti ini

```
# stage 1 : build jar dulu
FROM maven:3-eclipse-temurin-21 AS mvnbuild
# membuat working folder
WORKDIR /opt/aplikasi
# menambahkan pom.xml dari laptop ke dalam container
COPY pom.xml .
# donlod dependensi dulu, supaya menjadi layer terpisah dari compile
RUN mvn dependency:go-offline
# menambahkan folder src ke dalam container
COPY src ./src
# menjalankan compile source code dan buat jar file
RUN mvn package

# stage 2 : extract jar untuk memisahkan layer
FROM bellsoft/liberica-openjre-alpine:21-cds AS jarlayer
WORKDIR /builder
COPY --from=mvnbuild /opt/aplikasi/target/*.jar application.jar
RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted

# stage 3 : rakit layer menjadi docker image
FROM bellsoft/liberica-openjre-alpine:21-cds
WORKDIR /application
COPY --from=jarlayer /builder/extracted/dependencies/ ./
COPY --from=jarlayer /builder/extracted/spring-boot-loader/ ./
COPY --from=jarlayer /builder/extracted/snapshot-dependencies/ ./
COPY --from=jarlayer /builder/extracted/application/ ./
ENTRYPOINT ["java", "-jar", "application.jar"]
```

Pada `Dockerfile` di atas, kita juga memisahkan tahap download dependensi ke layer tersendiri, sehingga bisa di-cache oleh Docker builder dan tidak perlu mengunduh lagi di build berikutnya.

`Dockerfile` tersebut bisa langsung dijalankan dengan perintah berikut

```
docker build -t endymuhardin/training-kubernetes .
```

tanpa perlu menginstal Java SDK dan Maven di komputer yang melakukan build. Bahkan walaupun ada Java SDK dan Maven, kita tidak perlu menjalankan `mvn clean package` terlebih dahulu.
