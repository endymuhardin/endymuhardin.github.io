# Belajar Docker #

## Instalasi di Ubuntu ##

Semua langkah dilakukan dengan akun root

```
sudo -i
```

Update dulu database apt, dan pastikan https bekerja dengan baik

```
apt-get update
apt-get install apt-transport-https ca-certificates
```

Add GPG key docker

```
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
```

Tambahkan repository docker

```
echo "deb https://apt.dockerproject.org/repo ubuntu-$(lsb_release -cs) main" > /etc/apt/sources.list.d/docker.list
```

Update lagi database apt

```
apt-get update
```

Uninstall docker jadul (kalau ada)

```
apt-get purge lxc-docker
```

Pastikan `apt-get` mengambil dari sumber yang benar

```
apt-cache policy docker-engine
```

Install paket `linux-image-extra` dan `apparmor`

```
apt-get install linux-image-extra-$(uname -r) apparmor
```

Install docker

```
apt-get install docker-engine
```

Start docker

```
service docker start
```

Test instalasi

```
docker run hello-world
```

Instalasi docker-machine

```
curl -L https://github.com/docker/machine/releases/download/v0.6.0/docker-machine-`uname -s`-`uname -m` > /usr/local/bin/docker-machine && \
chmod +x /usr/local/bin/docker-machine
```


## Instalasi di MacOSX ##

Instalasi aplikasi docker

```
brew install docker docker-machine docker-compose
```

Setup `default` machine, karena Docker tidak berjalan secara native di MacOSX

```
docker-machine create --driver virtualbox default
```

Stop machine (bila perlu)

```
docker-machine stop default
```

Start machine

```
docker-machine start default
```

Setup environment variable supaya bisa menjalankan Docker Client

```
eval $(docker-machine env)
```

Test instalasi (setelah `default` machine berjalan dan environment variable diset)

```
docker run hello-world
```

## Setup Docker Machine di Digital Ocean ##

Membuat Droplet berisi Docker Machine

```
docker-machine create --driver digitalocean --digitalocean-access-token yaddayaddayadda docker-ocean
```

Menjalankan Docker Machine

```
docker-machine start docker-ocean
```

Setup environment

```
eval $(docker-machine env docker-ocean)
```

## Menjalankan Java di Docker ##

```
cd java-halo-docker
docker build -t halo-java .
docker run -rm halo-java
```

## Menjalankan Jekyll Blog di Docker ##

```
cd jekyll-docker
docker build -t website-endy .
docker run -itd -p 80:4000 website-endy
```

## Menjalankan Maven Build di Docker ##

Build dan start container

```
cd maven-build-docker
docker build -t maven-builder .
docker run -it --rm maven-builder
```

Setelah container run, kita akan masuk ke prompt

```
git clone https://github.com/endymuhardin/belajar-ci.git
cd belajar-ci
mvn clean test jacoco:report
exit
```

Secara default, container tersebut akan membuat database dengan konfigurasi:

* nama database : `belajar`
* username database : `belajar`
* password database : `java`

Kita bisa mengganti konfigurasi tersebut pada waktu menjalankan container sebagai berikut:

```
docker run -it --rm \
    -e MYSQL_DATABASE=demo \
    -e MYSQL_USERNAME=coba \
    -e MYSQL_PASSWORD=rahasia \
    maven-builder
```

## Copy File dari Local ke Container ##

Cari tau dulu container id

```
docker ps -a
```

Outputnya

```
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
599ba5ce1f86        website-endy        "jekyll serve --host="   12 seconds ago      Up 10 seconds       0.0.0.0:4000->4000/tcp   desperate_sinoussi
```

Copy file `coba.txt` ke folder `/opt` di dalam container

```
docker cp coba.txt desperate_sinoussi:/opt/
```

## Connect ke Docker Container ##

Buka shell baru di container yang sedang berjalan
```
docker exec -it desperate_sinoussi bash
```

Connect ke container yang sedang berjalan, dan melihat apa adanya tampilan di prompt

```
docker attach desperate_sinoussi
```
