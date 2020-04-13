---
layout: post
title: "Live Streaming dengan Nginx RTMP Module"
date: 2018-11-12 07:00
comments: true
categories:
- aplikasi
---

Di era milenial seperti sekarang ini, segala kegiatan harus dipublish supaya eksis. Gak cukup dengan posting foto dan rekaman video, harus instan real time live show. Para raksasa sosmed berlomba-lomba menyediakan fasilitas tayangan langsung seperti Instagram Stories, Facebook Live, Youtube Live, dan masih banyak yang lainnya.

Karena banyak platform berbeda, tapi tujuannya sama, maka sayapun mencari aplikasi untuk membantu publikasi untuk melakukan tayangan langsung. Pengennya satu kali pasang kamera, langsung live di berbagai sosmed. Cari punya cari, ada beberapa alternatif untuk mengabstraksi tayangan langsung multi platform ini:

* Menggunakan aplikasi broadcaster yang mendukung multi platform, misalnya [VMix](https://www.vmix.com/)
* Menggunakan layanan cloud seperti [Switchboard](https://switchboard.live/), [grabyo](https://about.grabyo.com/) atau [ReStream](https://restream.io/)
* Menggunakan relay server, yang berbayar contohnya [Wowza](https://www.wowza.com/products/streaming-engine). Yang open source bisa pakai [Red5](http://red5.org/) atau [Nginx RTMP Module](https://github.com/sergey-dryabzhinsky/nginx-rtmp-module)

Pada artikel kali ini, kita akan membahas setup Nginx RTMP Module dengan Raspberry Pi.

[![Raspi Resource Usage]({{site.url}}/images/uploads/2018/live-streaming/01-raspi-resource-usage.png)]({{site.url}}/images/uploads/2018/live-streaming/01-raspi-resource-usage.png)

<!--more-->

Nginx RTMP Module merupakan tambahan modul di atas webserver Nginx yang sudah terkenal itu. Saya pilih ini karena setupnya yang relatif mudah dan kebutuhan resourcenya yang minim. Bila kita tidak melakukan transcoding (mengubah resolusi misalnya dari 4k menjadi 1080p, 720p, dsb), maka perangkat sekelas Raspberry Pi sudah cukup. Tanpa transcoding, berarti tugasnya dia hanya menerima aliran data streaming dan meneruskannya ke berbagai platform yang kita tentukan (Facebook, Youtube).

Seperti bisa kita lihat pada screenshot di atas, pada saat streaming ke Facebook dan YouTube sekaligus, pemakaian CPU hanya 2% dan RAM hanya 0.4%.

Ada beberapa langkah setupnya, yaitu:

1. Instalasi Raspbian di Raspberry Pi.
2. Kompilasi Nginx dan Modul RTMP
3. Konfigurasi upstream
4. Mulai live streaming

## Instalasi Raspbian ##

Instalasi Raspberry Pi sudah pernah saya bahas dalam [artikel sebelumnya](https://software.endy.muhardin.com/linux/raspi-hardening/). Jadi tidak akan kita bahas lagi di sini.

Sebetulnya pakai Linux apa saja bisa, tidak harus Debian, Ubuntu, ataupun distro tertentu. Instalasinya juga tidak harus di Raspberry Pi. Bisa juga di PC biasa ataupun VPS seperti Digital Ocean.

## Kompilasi Nginx dan Modul RTMP ##

Kita perlu mengunduh source code Nginx. Lakukan perintah berikut di command line.

```
wget http://nginx.org/download/nginx-1.15.6.tar.gz
```

Versi Nginx silahkan disesuaikan dengan yang terbaru. Pada saat artikel ini ditulis, yang terbaru adalah `1.15.6`.

Kemudian, kita unduh juga source code `rtmp-module`.

```
wget https://github.com/sergey-dryabzhinsky/nginx-rtmp-module/archive/dev.zip
```

Kita extract keduanya

```
tar zxvf nginx-1.15.6.tar.gz
unzip dev.zip
```

Untuk melakukan kompilasi, kita membutuhkan kompiler bahasa `C/C++` dan perlengkapan tambahannya. Di keluarga Debian sudah disediakan paketnya, bernama `build-essentials`. Kita install bersama beberapa library tambahan

```
sudo apt install build-essential libpcre3 libpcre3-dev libssl-dev -y
```

Sekarang kita sudah bisa melakukan kompilasi. Masuk ke folder source code Nginx dan lakukan kompilasi

```
./configure --with-http_ssl_module --add-module=../nginx-rtmp-module-dev
make
sudo make install
```

Bila tidak ada pesan error, maka instalasi berhasil. Nginx akan terinstal di `/usr/local/nginx`. Kita bisa jalankan dengan perintah berikut

```
sudo /usr/local/nginx/sbin/nginx
```

Kemudian kita test dengan browse ke `http://<ip-server-raspberry>/`. Seharusnya kita akan melihat layar selamat datang Nginx.

[![Welcome Nginx]({{site.url}}/images/uploads/2018/live-streaming/00-nginx-welcome.png)]({{site.url}}/images/uploads/2018/live-streaming/00-nginx-welcome.png)

## Instalasi Ubuntu 18.04 ##

Di Ubuntu sudah ada paket modul RTMP untuk Nginx, sehingga kita tidak perlu lagi kompilasi source code. Cukup install saja langsung seperti ini

```
apt install nginx libnginx-mod-rtmp -y
```

Bila kita ingin streaming ke Facebook dan Instagram, kita juga harus menginstal paket `stunnel`

```
apt install stunnel4 -y
```

Konfigurasi Nginx dan Stunnel akan kita bahas di bawah.

## Konfigurasi Youtube ##

Ada dua tujuan live streaming yang populer, yaitu Youtube dan Facebook.

Kita akan setup Youtube dulu. Login ke Youtube, kemudian buka [halaman setting Live Streaming](https://www.youtube.com/live_dashboard?ar=1).

[![Youtube Live Streaming Page]({{site.url}}/images/uploads/2018/live-streaming/01-live-streaming.png)]({{site.url}}/images/uploads/2018/live-streaming/01-live-streaming.png)

Ada dua pilihan metode streaming di Youtube, yaitu Live Streaming dan [Event](https://www.youtube.com/my_live_events?o=U&ar=1). Bila kita mau spontan tayang, maka kita bisa gunakan Live Streaming. Langsung saja copy `Server URL` dan `Stream name/key` dan pasang di aplikasi broadcaster kita.

Bila sesi livenya terjadwal, kita bisa menggunakan Event. Di menu Event, kita bisa mengatur sesi live dengan lebih baik, misalnya kita bisa jadwalkan terlebih dulu sehingga para subscriber kita bisa menyiapkan waktu untuk menonton.

[![Create Event]({{site.url}}/images/uploads/2018/live-streaming/02-create-event.png)]({{site.url}}/images/uploads/2018/live-streaming/02-create-event.png)

Untuk membuat Event, kita klik tab Event di kiri. Kemudian isi nama event dan waktu tayang. Begitu kita klik `Create Event`, subscriber kita akan diberikan notifikasi.

Selanjutnya, kita akan menentukan setting bitrate dan resolusi. Semakin besar bitrate/resolusi, semakin baik kualitas audio dan video. Tapi bandwidth yang dibutuhkan juga semakin besar. Biasanya saya menggunakan `480p` saja untuk acara training/seminar/diskusi. Untuk jenis event seperti ini, kualitas audio jauh lebih penting daripada gambar.

[![Pilihan Resolusi]({{site.url}}/images/uploads/2018/live-streaming/03-pilihan-resolusi.png)]({{site.url}}/images/uploads/2018/live-streaming/03-pilihan-resolusi.png)

Bila resolusi yang kita inginkan tidak ada, maka kita bisa membuat yang baru. Cukup create event, lalu pilih resolusi yang ingin kita gunakan.

[![Membuat resolusi baru]({{site.url}}/images/uploads/2018/live-streaming/04-create-resolusi.png)]({{site.url}}/images/uploads/2018/live-streaming/04-create-resolusi.png)

Setelah kita memilih resolusi, kita akan diberikan setting untuk aplikasi encoder/broadcaster. Sama seperti sebelumnya, kita butuh nilai `Stream URL` dan `Stream Name/Key`.

[![Setting Encoder]({{site.url}}/images/uploads/2018/live-streaming/05-setting-encoder.png)]({{site.url}}/images/uploads/2018/live-streaming/05-setting-encoder.png)

`Stream URL` Youtube biasanya adalah `rtmp://a.rtmp.youtube.com/live2/`

[![Preview Streaming]({{site.url}}/images/uploads/2018/live-streaming/06-persiapan-streaming.png)]({{site.url}}/images/uploads/2018/live-streaming/06-persiapan-streaming.png)

Berikutnya, kita akan disajikan layar persiapan event. Di sini kita bisa mulai menyalakan aplikasi encoder kita. Hasilnya akan tampil di halaman tersebut. Kita bisa mengetes kualitas streaming kita di layar ini. Pada titik ini, tayangan kita belum dipublish secara umum. Hanya kita yang bisa melihatnya.

Setelah kita puas dengan kualitas video tayangan, kita bisa klik `Start Streaming`. Barulah event live kita akan bisa dilihat orang banyak.

## Konfigurasi Instagram ##

Fasilitas live ke Instagram dari laptop/PC sebetulnya tidak disediakan secara resmi. Instagram tidak memberikan alamat URL RTMP dan Stream Key yang bisa kita pasang di aplikasi streamer. Kalau kita cari di Google, ada beberapa tutorial, akan tetapi mayoritas di antaranya sudah tidak valid lagi.

Saya menemukan ada satu teknik yang bisa dijalankan pada saat artikel ini ditulis, yaitu menggunakan aplikasi [YellowDuck](https://yellowduck.tv). Itupun tidak berhasil 100%, untuk setup pertama kali, saya selalu menemui kegagalan. Baru setelah dicoba di hari berikutnya, aplikasi ini bisa jalan.

Walaupun demikian, tidak menutup kemungkinan aplikasi inipun untuk diblokir oleh Instagram di masa yang akan datang.

Pada prinsipnya, cara kerja aplikasi ini adalah dia akan berpura-pura menjadi aplikasi Instagram. Kita masukkan username dan password Instagram kita dan klik login. Dia akan mencoba login ke Instagram, menyalakan fitur live, mengambil URL RTMP dan Stream Key, kemudian menampilkannya agar bisa kita gunakan. Sebetulnya metode ini memiliki resiko keamanan, karena kita memberikan username dan password Instagram kita ke aplikasi tersebut. Walaupun dia sudah berjanji tidak akan menyimpan, tapi ya tetap saja pertanyaannya apakah kita percaya sama dia atau tidak :D.

Anyway, kita lanjutkan saja.

Aplikasinya sendiri mudah digunakan. Kita tinggal unduh dan install aplikasinya. Kemudian kita jalankan. Dia akan menampilkan halaman login.

[![Halaman Login YellowDuck]({{site.url}}/images/uploads/2018/live-streaming/01-yellowduck-login.png)]({{site.url}}/images/uploads/2018/live-streaming/01-yellowduck-login.png)

Kita masukkan username dan password Instagram kita. Dia akan berusaha login. Biasanya ketika baru pertama digunakan, Instagram akan curiga, dan meminta konfirmasi kepada kita di aplikasi mobile yang aslinya. Oleh karena itu, YellowDuck akan memberi tahu kita agar kita mengijinkan dia login. Petunjuknya seperti ini.

[![Halaman Permission YellowDuck]({{site.url}}/images/uploads/2018/live-streaming/02-yellowduck-permission.jpeg)]({{site.url}}/images/uploads/2018/live-streaming/02-yellowduck-permission.jpeg)

Pada langkah ini, sering terjadi kegagalan, walaupun kita sudah ikuti petunjuknya. Biasanya tidak akan sukses walaupun dicoba berkali-kali. Biarkan saja, coba lagi besoknya. Karena dia tidak akan segera sukses. Pengalaman saya, di hari berikutnya baru dia bisa login. Hasilnya seperti ini.

[![Halaman Sukses YellowDuck]({{site.url}}/images/uploads/2018/live-streaming/03-yellowduck-success.png)]({{site.url}}/images/uploads/2018/live-streaming/03-yellowduck-success.png)

Selanjutnya, kita tinggal copy saja RTMP URL dan Stream Key untuk dipakai di langkah berikutnya.

## Konfigurasi Facebook ##

Di Facebook, kita bisa langsung pergi ke halaman [Create Live Stream](https://www.facebook.com/live/create). Klik tombol `Create`, dan kemudian kita akan masuk ke halaman persiapan live streaming

[![Persiapan Live Streaming]({{site.url}}/images/uploads/2018/live-streaming/01-facebook-live-create.png)]({{site.url}}/images/uploads/2018/live-streaming/01-facebook-live-create.png)

Seperti biasa, kita butuh `Stream URL` dan `Stream Key`. Kita juga perlu mengisi judul dan deskripsi acara. Settingan privasi tayangan juga bisa diatur.

[![Konfigurasi Encoder]({{site.url}}/images/uploads/2018/live-streaming/02-facebook-encoder-setting.png)]({{site.url}}/images/uploads/2018/live-streaming/02-facebook-encoder-setting.png)

`Stream URL` Facebook biasanya adalah `rtmp://live-api-s.facebook.com:80/rtmp/`

**UPDATE !!!**
Sejak Mei 2019, Facebook mengganti protokol koneksi Live Streaming menggunakan SSL. Sehingga URLnya menjadi `rtmps://live-api-s.facebook.com:443/rtmp/`. Akibatnya, Nginx RTMP Module tidak bisa lagi langsung terkoneksi dengan Facebook. 

Solusinya adalah menggunakan aplikasi `stunnel` untuk menyediakan koneksi SSL ke Facebook, sehingga Nginx RTMP Module tidak perlu mengurus SSL.

## Konfigurasi STunnel ##

Stunnel dapat diinstal menggunakan perintah `apt install stunnel4 -y`. Setelah itu, kita buatkan konfigurasinya di file `/etc/stunnel/stunnel.conf` sebagai berikut:

```
setuid = stunnel4
setgid = stunnel4
pid=/tmp/stunnel.pid
output = /var/log/stunnel4/stunnel.log
include = /etc/stunnel/conf.d
```

Kita buat konfigurasi koneksi ke Facebook di file `/etc/stunnel/conf.d/fb.conf` sebagai berikut

```
[fb-live]
client = yes
accept = 127.0.0.1:8888
connect = live-api-s.facebook.com:443
verifyChain = no
```

Untuk konfigurasi Instagram, kita buat di file `/etc/stunnel/conf.d/ig.conf` sebagai berikut

```
[ig-live]
client = yes
accept = 127.0.0.1:9999
connect = live-upload.instagram.com:443
verifyChain = no
```

Lalu, enable `stunnel` dengan cara mengedit file `/etc/default/stunnel4` menjadi seperti ini

```
ENABLE=1
```

Nyalakan `stunnel` tiap kali boot.

```
sudo systemctl enable stunnel4.service
```

## Konfigurasi Nginx RTMP Module ##

Dengan Nginx RTMP Module, kita bisa mempublikasikan stream kita ke banyak tujuan. Di artikel ini, kita akan gunakan dua saja, yaitu Youtube dan Facebook. Konfigurasinya sebagai berikut, ditulis di file `/usr/local/nginx/conf/nginx.conf`

```
rtmp_auto_push on;
rtmp_auto_push_reconnect 1s;
rtmp {
  server {
    listen 1935;
    chunk_size 4096;
    application live {
      live on;
      record off;
      allow publish 127.0.0.1;
      deny publish all;
      push rtmp://a.rtmp.youtube.com/live2/abcd-abcd-abcd-abcd;
      push rtmp://localhost:8888/rtmp/12345678909876543?s_ps=9&s_sw=9&s_vt=abc-d&a=QwertYasDf321Hjk;
    }
  }
}
```

Tujuan stream kita ada di baris yang ada perintah `push`. Formatnya adalah `push rtmp://<stream-url>/<stream-key>`

Nilai ini kita dapatkan dari konfigurasi YouTube dan Facebook di atas. Untuk Youtube, kita push langsung ke tujuan. Sedangkan untuk Facebook, kita push ke `stunnel` di port `8888` untuk selanjutnya diteruskan ke Facebook.

Kita juga perlu membatasi alamat IP aplikasi yang boleh stream ke sana. Bila tidak dibatasi, maka orang lain bisa publish ke sana dan tayang di channel YouTube kita dan timeline Facebook kita. Tentu ini tidak kita inginkan. Pembatasannya ada di baris berikut:

* `allow publish <ip-yang-boleh-publish>`
* `deny publish all`

### Resize Resolusi Video ###

Bila kita ingin melakukan transcoding, misalnya mengubah stream yang resolusi awalnya `1080p` menjadi `360p`, kita bisa jalankan konversi dengan `ffmpeg` atau `avconv`. Tambahkan perintah `exec` sebagai berikut

```
application live {
    live on;
    record off;
    exec ffmpeg -i rtmp://localhost/live/$name -threads 1 -c:v libx264 -profile:v baseline -b:v 350K -s 640x360 -f flv -c:a aac -ac 1 -strict -2 -b:a 56k rtmp://localhost/live360p/$name;
}
```

Kemudian url `rtmp://localhost/live360p/$name` tersebut kita publish ulang sebagai berikut

```
application live360p {
    live on;
    record off;
}
```

Untuk mengubah bitrate video, ubah nilai setelah `-b:v`. Kualitas audio bisa disesuaikan dengan nilai setelah opsi `-b:a`. Resolusi diubah dengan opsi `-s`.

Dengan kombinasi opsi tersebut, kita bisa mempublikasikan tayangan kita dalam beberapa pilihan resolusi dan kualitas. Jadi penonton yang menggunakan smartphone bisa memilih resolusi kecil, dan penonton di rumah dengan TV layar lebar bisa memilih resolusi maksimal.

### Konversi Vertikal untuk Instagram ###

Apabila kita ingin live ke Instagram, kita harus sesuaikan dulu format videonya agar menjadi vertikal. 

Ada dua pilihan, kita tetap tampilkan videonya secara horizontal, tetapi kita tambahkan _padding_ atas dan bawah. Bisa pakai blur, bisa pakai hitam. Saya biasanya pilih hitam untuk menghemat kerja CPU.

Berikut konfigurasi untuk menambahkan padding hitam.

```
application live {
    live on;
    record off;
    exec ffmpeg -i rtmp://localhost/live/$name -threads 1 -c:v libx264 -profile:v baseline -vf 'scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2,setsar=1' -f flv -c:a aac -ac 1 -strict -2 -b:v 350K -b:a 56k rtmp://localhost/liveIG/$name;
}

application liveIG {
    live on;
    record off;
}
```

Atau bila ingin merotasi videonya agar tetap lebar, tapi berorientasi vertikal, bisa gunakan konfigurasi yang ini

```
application live {
    live on;
    record off;
    exec ffmpeg -i rtmp://localhost/live/$name -threads 1 -c:v libx264 -profile:v baseline -vf 'transpose=1' -f flv -c:a aac -ac 1 -strict -2 -b:v 350K -b:a 56k rtmp://localhost/liveIG/$name;
}

application liveIG {
    live on;
    record off;
}
```

Sebelum dijalankan, test dulu konfigurasi kita dengan perintah berikut

```
sudo /usr/local/nginx/sbin/nginx -t
```

Bila tidak ada error, kita bisa start dengan perintah berikut

```
sudo /usr/local/nginx/sbin/nginx
```

Untuk menyetop Nginx, kita jalankan perintah berikut

```
sudo /usr/local/nginx/sbin/nginx -s stop
```

Bila sudah oke, kita bisa daftarkan dia menjadi `systemd` service supaya otomatis hidup pada waktu komputer dinyalakan/direstart. Buat konfigurasi di file `/etc/systemd/system/nginx.service`

```
[Unit]
Description=nginx - high performance web server
Documentation=https://nginx.org/en/docs/
After=network-online.target remote-fs.target nss-lookup.target
Wants=network-online.target

[Service]
Type=forking
PIDFile=/var/run/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/bin/kill -s HUP $MAINPID
ExecStop=/bin/kill -s TERM $MAINPID

[Install]
WantedBy=multi-user.target
```

Untuk menyalakan service, jalankan perintah berikut

```
sudo systemctl start nginx.service
```

Supaya dia jalan otomatis tiap komputer dinyalakan, kita enable servicenya.

```
systemctl enable nginx.service
```

## Konfigurasi Streaming OBS ##

[OBS (Open Broadcaster Software) Project](https://obsproject.com/) adalah aplikasi encoder/broadcaster open source yang sudah terbukti kehandalannya. Aplikasi ini sudah amat cukup untuk melakukan live streaming.

[![Layanan OBS]({{site.url}}/images/uploads/2018/live-streaming/03-obs-pilihan-stream-service.png)]({{site.url}}/images/uploads/2018/live-streaming/03-obs-pilihan-stream-service.png)

Di antara fiturnya adalah:

* Bisa streaming ke Youtube, Facebook, dan lainnya
* Bisa multiple input (kamera, audio, capture aplikasi, gambar/foto, video, tulisan, dan sebagainya)
* dan banyak lainnya

Saking banyak dan lengkap fiturnya, perlu satu artikel khusus untuk membahas OBS. Sedangkan di sini kita mau fokus membahas live streaming.

Walaupun demikian, ada satu keterbatasan OBS, yaitu dia hanya bisa broadcast ke satu tujuan. Tidak bisa misalnya ke Youtube dan Facebook sekaligus. Bila kita ingin melakukan broadcast ke beberapa tujuan seperti gambar di bawah, kita harus pakai aplikasi lain seperti misalnya `Vmix` atau menggunakan layanan cloud seperti `reStream`, `SwitchBoard`, atau lainnya.

[![Direct Streaming]({{site.url}}/images/uploads/2018/live-streaming/01-direct-streaming.jpg)]({{site.url}}/images/uploads/2018/live-streaming/01-direct-streaming.jpg)

Untuk itu, kita akan menggunakan relay server dengan `Nginx` yang sudah kita setup di atas. Sehingga topologinya menjadi seperti ini

[![Nginx RTMP Streaming]({{site.url}}/images/uploads/2018/live-streaming/02-nginx-rtmp-streaming.png)]({{site.url}}/images/uploads/2018/live-streaming/02-nginx-rtmp-streaming.png)

Untuk menghubungkan OBS dengan Nginx, masuk ke menu `Settings`, kemudian masuk ke menu `Stream`. Kita bisa pasang `Stream URL` dan `Stream Key` di sana.

[![Konfigurasi Stream OBS]({{site.url}}/images/uploads/2018/live-streaming/02-obs-stream-setting.png)]({{site.url}}/images/uploads/2018/live-streaming/02-obs-stream-setting.png)

Kita masukkan nilai berikut:

* `Stream URL` : `rtmp://<ip-address-nginx-server>/live`
* `Stream Key` : masukkan nilai apa saja, bebas. Misalnya kita berikan key `coba-coba-streaming`

Setelah itu kita bisa mulai streaming dengan menekan tombol `Start Streaming`.

## Test Streaming ##

Nginx RTMP Module selain mempublish tayangan kita ke tujuan yang disebutkan dalam konfigurasi `push`, juga akan menyediakan URL streaming langsung. URL ini nantinya bisa digunakan orang lain yang ingin me-relay tayangan kita. Kita juga bisa gunakan URL ini untuk mengetes tayangan kita menggunakan aplikasi [VLC Player](https://www.videolan.org/vlc/features.html) yang gratis dan open source.

Masuk ke menu `File > Open Network`, lalu masukkan URL `rtmp://<ip-nginx-rtmp>/live/<stream-key>` seperti screenshot berikut

[![VLC Open Stream]({{site.url}}/images/uploads/2018/live-streaming/01-vlc-open-stream.png)]({{site.url}}/images/uploads/2018/live-streaming/01-vlc-open-stream.png)

Seharusnya kita bisa menonton live streaming yang dikirim oleh OBS.

[![VLC View Stream]({{site.url}}/images/uploads/2018/live-streaming/02-vlc-view-stream.png)]({{site.url}}/images/uploads/2018/live-streaming/02-vlc-view-stream.png)

## Docker ##

Bila setiap kali mau melakukan live streaming kita harus melakukan konfigurasi, tentunya ini sangat melelahkan. Agar lebih praktis, kita bisa menjalankan setup ini menggunakan Docker. Apa itu docker dan bagaimana cara kerjanya tidak dibahas pada artikel ini. Silahkan baca [artikel berikut untuk memahami apa itu docker](https://software.endy.muhardin.com/linux/intro-docker/). 

Kita akan menjalankan dua Docker container sekaligus, yang satu menjalankan `stunnel`, satunya lagi menjalankan `nginx-rtmp-module`. Caranya adalah menggunakan `docker-compose`. File konfigurasinya kita buat dalam file bernama `docker-compose.yml` yang isinya sebagai berikut:

```yml
version: "3"

services:
  stunnel-proxy-fb:
    image: tstrohmeier/stunnel-client:latest
    restart: always
    environment:
      - ACCEPT=8888
      - CONNECT=live-api-s.facebook.com:443
  
  stunnel-proxy-ig:
    image: tstrohmeier/stunnel-client:latest
    restart: always
    environment:
      - ACCEPT=9999
      - CONNECT=live-upload.instagram.com:443

  nginx-rtmp-streamer:
    image: jasonrivers/nginx-rtmp
    environment:
      - RTMP_PUSH_URLS=rtmp://a.rtmp.youtube.com/live2/${YOUTUBE_STREAM_KEY},rtmp://stunnel-proxy-fb:8888/rtmp/${FACEBOOK_STREAM_KEY},rtmp://stunnel-proxy-ig:9999/rtmp/${INSTAGRAM_STREAM_KEY}
    depends_on:
      - stunnel-proxy-fb
      - stunnel-proxy-ig
    ports:
      - "1935:1935"
      - "8080:8080"

```

File tersebut membutuhkan konfigurasi untuk mengisi variabel `${YOUTUBE_STREAM_KEY}`, `${FACEBOOK_STREAM_KEY}`, dan `${INSTAGRAM_STREAM_KEY}`. Kedua nilai ini sengaja dikeluarkan dari file `docker-compose` agar bisa diubah-ubah sesuai akun yang akan digunakan untuk live.

Konfigurasinya kita buat dalam file yang bernama `.env`. Isinya sebagai berikut

```
YOUTUBE_STREAM_KEY=abcd-abcd-abcd-abcd
FACEBOOK_STREAM_KEY=12345678909876543?s_ps=9&s_sw=9&s_vt=abc-d&a=QwertYasDf321Hjk
INSTAGRAM_STREAM_KEY=xyz-xyz-xyz
```

File `.env` dan file `docker-compose.yml` diletakkan dalam folder yang sama. Setelah itu jalankan dengan perintah `docker-compose up -d`. Outputnya seperti ini

```
Creating network "tmp_default" with the default driver
Creating tmp_stunnel-proxy_1 ... done
Creating tmp_nginx-rtmp-streamer_1 ... done
Attaching to tmp_stunnel-proxy_1, tmp_nginx-rtmp-streamer_1
nginx-rtmp-streamer_1  | Creating config
nginx-rtmp-streamer_1  | Creating stream live
nginx-rtmp-streamer_1  | Pushing stream to rtmp://a.rtmp.youtube.com/live2/abcd-abcd-abcd-abcd
nginx-rtmp-streamer_1  | Pushing stream to rtmp://stunnel-proxy-fb:8888/rtmp/112345678909876543?s_ps=9&s_sw=9&s_vt=abc-d&a=QwertYasDf321Hjk
nginx-rtmp-streamer_1  | Pushing stream to rtmp://stunnel-proxy-ig:9999/rtmp/112345678909876543?s_ps=9&s_sw=9&s_vt=abc-d&a=QwertYasDf321Hjk
nginx-rtmp-streamer_1  | Creating stream testing
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG5[ui]: stunnel 5.46 on x86_64-alpine-linux-musl platform
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG5[ui]: Compiled with LibreSSL 2.7.3
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG5[ui]: Running  with LibreSSL 2.7.4
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG5[ui]: Threading:PTHREAD Sockets:POLL,IPv6 TLS:ENGINE,OCSP,SNI
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG5[ui]: Reading configuration from file /etc/stunnel/stunnel.conf
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG5[ui]: UTF-8 byte order mark not detected
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG4[ui]: Service [stunnelHttpsToHttpclient] needs authentication to prevent MITM attacks
stunnel-proxy_1        | 2020.02.05 05:37:48 LOG5[ui]: Configuration successful
stunnel-proxy_1        | 2020.02.05 05:38:00 LOG5[0]: Service [stunnelHttpsToHttpclient] accepted connection from 172.19.0.3:50088
stunnel-proxy_1        | 2020.02.05 05:38:00 LOG5[0]: s_connect: connected 31.13.92.6:443
stunnel-proxy_1        | 2020.02.05 05:38:00 LOG5[0]: Service [stunnelHttpsToHttpclient] connected remote server from 172.19.0.2:41612
```

Di aplikasi OBS, masukkan setting seperti ini:

```
Streaming Service: Custom
Server: rtmp://<your server ip>/live
Play Path/Stream Key: mystream
```

Setelah selesai, untuk mematikannya, ketik perintah `docker-compose down`.


## Penutup ##

Live Streaming merupakan fasilitas jaman now yang sangat bermanfaat. Layanannya gratis, setupnya tidak sulit, aplikasinya gratis, pokoknya tinggal pakai. Bahkan seandainya kita hanya bermodalkan smartphone, kita bisa langsung live. Akan tetapi, untuk mendapatkan hasil yang lebih profesional, kita perlu menggunakan aplikasi yang lebih canggih seperti OBS. Di situ kita bisa menambahkan logo di kanan atas, nama pembicara di bawah (lower third), running text, menjalankan iklan, dan sebagainya. Hasilnya bisa dilihat di [event Monday Forum Tazkia](https://youtu.be/HQ-BG0pyz8A)

[![YouTube Hasil Streaming]({{site.url}}/images/uploads/2018/live-streaming/07-hasil-streaming.png)]({{site.url}}/images/uploads/2018/live-streaming/07-hasil-streaming.png)

Dengan sedikit tambahan Nginx RTMP Module, kita bisa mempublikasikannya ke banyak platform sekaligus. 

Selamat mencoba, semoga bermanfaat ...

## Referensi ##

* [https://obsproject.com/forum/resources/how-to-set-up-your-own-private-rtmp-server-using-nginx.50/](https://obsproject.com/forum/resources/how-to-set-up-your-own-private-rtmp-server-using-nginx.50/)
* [https://github.com/tiangolo/nginx-rtmp-docker/blob/master/README.md](https://github.com/tiangolo/nginx-rtmp-docker/blob/master/README.md)
* [https://www.leaseweb.com/labs/2013/11/streaming-video-demand-nginx-rtmp-module/](https://www.leaseweb.com/labs/2013/11/streaming-video-demand-nginx-rtmp-module/)
* [https://www.vultr.com/docs/setup-nginx-rtmp-on-centos-7](https://www.vultr.com/docs/setup-nginx-rtmp-on-centos-7)
* [https://dev.to/lax/rtmps-relay-with-stunnel-12d3](https://dev.to/lax/rtmps-relay-with-stunnel-12d3)
* [https://sites.google.com/view/facebook-rtmp-to-rtmps/home](https://sites.google.com/view/facebook-rtmp-to-rtmps/home)
* [https://hub.docker.com/r/tstrohmeier/stunnel-client/](https://hub.docker.com/r/tstrohmeier/stunnel-client/)
* [https://github.com/arut/nginx-rtmp-module/issues/1397](https://github.com/arut/nginx-rtmp-module/issues/1397)
* [https://sites.google.com/view/facebook-rtmp-to-rtmps/home](https://sites.google.com/view/facebook-rtmp-to-rtmps/home)
* [https://www.openwritings.net/pg/ffmpeg/ffmpeg-add-logo-video](https://www.openwritings.net/pg/ffmpeg/ffmpeg-add-logo-video)