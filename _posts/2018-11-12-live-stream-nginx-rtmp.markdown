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

## Konfigurasi Facebook ##

Di Facebook, kita bisa langsung pergi ke halaman [Create Live Stream](https://www.facebook.com/live/create). Klik tombol `Create`, dan kemudian kita akan masuk ke halaman persiapan live streaming

[![Persiapan Live Streaming]({{site.url}}/images/uploads/2018/live-streaming/01-facebook-live-create.png)]({{site.url}}/images/uploads/2018/live-streaming/01-facebook-live-create.png)

Seperti biasa, kita butuh `Stream URL` dan `Stream Key`. Kita juga perlu mengisi judul dan deskripsi acara. Settingan privasi tayangan juga bisa diatur.

[![Konfigurasi Encoder]({{site.url}}/images/uploads/2018/live-streaming/02-facebook-encoder-setting.png)]({{site.url}}/images/uploads/2018/live-streaming/02-facebook-encoder-setting.png)

`Stream URL` Facebook biasanya adalah `rtmp://live-api-s.facebook.com:80/rtmp/`

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
      push rtmp://live-api-s.facebook.com:80/rtmp/12345678909876543?s_ps=9&s_sw=9&s_vt=abc-d&a=QwertYasDf321Hjk
    }
  }
}
```

Tujuan stream kita ada di baris yang ada perintah `push`. Formatnya adalah `push rtmp://<stream-url>/<stream-key>`

Nilai ini kita dapatkan dari konfigurasi YouTube dan Facebook di atas.

Kita juga perlu membatasi alamat IP aplikasi yang boleh stream ke sana. Bila tidak dibatasi, maka orang lain bisa publish ke sana dan tayang di channel YouTube kita dan timeline Facebook kita. Tentu ini tidak kita inginkan. Pembatasannya ada di baris berikut:

* `allow publish <ip-yang-boleh-publish>`
* `deny publish all`

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

## Penutup ##

Live Streaming merupakan fasilitas jaman now yang sangat bermanfaat. Layanannya gratis, setupnya tidak sulit, aplikasinya gratis, pokoknya tinggal pakai. Bahkan seandainya kita hanya bermodalkan smartphone, kita bisa langsung live. Akan tetapi, untuk mendapatkan hasil yang lebih profesional, kita perlu menggunakan aplikasi yang lebih canggih seperti OBS. Di situ kita bisa menambahkan logo di kanan atas, nama pembicara di bawah (lower third), running text, menjalankan iklan, dan sebagainya. Hasilnya bisa dilihat di [event Monday Forum Tazkia](https://youtu.be/HQ-BG0pyz8A)

[![YouTube Hasil Streaming]({{site.url}}/images/uploads/2018/live-streaming/07-hasil-streaming.png)]({{site.url}}/images/uploads/2018/live-streaming/07-hasil-streaming.png)

Dengan sedikit tambahan Nginx RTMP Module, kita bisa mempublikasikannya ke banyak platform sekaligus. Walaupun demikian, Instagram Live masih belum bisa ditangani oleh aplikasi encoder/broadcaster termasuk Nginx RTMP Module ini.

Kita juga bisa menjalankan Nginx RTMP Module ini dengan menggunakan docker. Perintahnya sebagai berikut:

```
docker run \
    -p 1935:1935 \
    -p 8080:8080 \
    -e RTMP_PUSH_URLS=rtmp://live.youtube.com/myname/streamkey,rtmp://live-api-s.facebook.com:80/rtmp/streamkey
    jasonrivers/nginx-rtmp
```

Di aplikasi OBS, masukkan setting seperti ini:

```
Streaming Service: Custom
Server: rtmp://<your server ip>/live
Play Path/Stream Key: mystream
```

Untuk lebih jelasnya, bisa dilihat langsung dokumentasinya di [DockerHub](https://hub.docker.com/r/jasonrivers/nginx-rtmp/)

Selamat mencoba, semoga bermanfaat ...

## Referensi ##

* [https://obsproject.com/forum/resources/how-to-set-up-your-own-private-rtmp-server-using-nginx.50/](https://obsproject.com/forum/resources/how-to-set-up-your-own-private-rtmp-server-using-nginx.50/)
* [https://github.com/tiangolo/nginx-rtmp-docker/blob/master/README.md](https://github.com/tiangolo/nginx-rtmp-docker/blob/master/README.md)
* [https://www.leaseweb.com/labs/2013/11/streaming-video-demand-nginx-rtmp-module/](https://www.leaseweb.com/labs/2013/11/streaming-video-demand-nginx-rtmp-module/)
* [https://www.vultr.com/docs/setup-nginx-rtmp-on-centos-7](https://www.vultr.com/docs/setup-nginx-rtmp-on-centos-7)