---
layout: post
title: "Restore Gitlab dari Amazon Glacier"
date: 2016-09-21 07:00
comments: true
categories: 
- linux
---

Hari ini saya membaca [artikel menyedihkan](http://istofani.com/wp/digital-ocean-sebuah-mimpi-buruk/) dari salah satu pelaku startup di negara kita ini. Aplikasinya yang dihosting di Digital Ocean crash dan datanya tidak bisa direcover. Entah apakah dia punya backup di tempat lain atau tidak. 

Dengan artikel ini, pertama-tama saya mengucapkan turut berduka cita atas kehilangannya. Semoga tetap tabah, bisa mengatasi dengan lancar, dan diberikan ganti yang lebih baik.

Selanjutnya, ini menjadi pelajaran bagi kita semua tentang pentingnya backup. Well, sebenarnya backup tidak penting, **yang penting adalah restore !!!**. Percuma juga kan punya backup kalau tidak bisa direstore :P

Hampir setahun yang lalu, saya sudah menjelaskan [tata cara backup yang aman menggunakan enkripsi ke layanan cloud](http://software.endy.muhardin.com/linux/backup-duplicity/). Tapi tidak mengapa kita ulang sedikit tentang prinsip dan konsep backup. Setelah itu kita akan membahas tentang tata cara restore.

<!--more-->

## Prinsip Backup ##

Prinsip backup secara sederhana dijelaskan Scott Hanselman dengan jargon 3-2-1, yang artinya:

* Data penting harus memiliki 3 copy
* Disimpan dalam 2 format berbeda. Misalnya harddisk + cloud, flashdisk + CD, dan sebagainya
* Disimpan di 1 lokasi lain. Beberapa artikel lain menyarankan jaraknya lebih dari 30 km.

Oke, selanjutnya apa yang harus dibackup?

## Isi Backup ##

Kalau kita bicara aplikasi atau layanan kita, setidaknya ada tiga komponen:

* aplikasinya (kode program yang sudah berjalan di server, maupun aplikasi client seperti Android atau iOS)
* datanya (bisa berupa dump database, baik SQL maupun NoSQL, file hasil upload user, laporan yang sudah digenerate, dan sebagainya)
* konfigurasinya (optimasi appserver, optimasi OS, optimasi database, konfigurasi koneksi database, dan lain sebagainya)

Idealnya, aplikasi kita bisa direkonstruksi dari backup dalam hitungan menit. Tentunya tanpa memperhitungkan waktu transfer data dari lokasi backup.

Bila kita sudah mempraktekkan [Continuous Integration](http://software.endy.muhardin.com/java/project-bootstrap-02/), apalagi [Continuous Delivery](http://software.endy.muhardin.com/java/project-bootstrap-04/), proses rekonstruksi/recovery/restoration harusnya bisa dilakukan dengan satu-dua command saja.

Sedangkan untuk data pribadi, biasanya saya cukup membackup isi folder Dropbox dan Pictures.

## Contoh Prosedur Restore ##

Sebagai software development house, asset yang paling berharga di ArtiVisi tentunya adalah source code aplikasi yang kita telah buat. Kantor boleh digusur, laptop bisa hilang atau rusak, tapi selama source code ada, kita bisa pulih dengan cepat.

ArtiVisi menggunakan Gitlab untuk menyimpan source code. Setiap hari dibackup secara otomatis ke Amazon S3. Di S3 sudah menunggu policy untuk mengkonversinya menjadi arsip Glacier di hari berikutnya. Dengan demikian, untuk melakukan restorasi secara garis besar prosedurnya adalah sebagai berikut:

1. Restore dulu dari Glacier ke S3. Glacier merupakan layanan archival, jadi filenya tidak dapat diunduh langsung. Kita harus mengembalikannya ke S3 agar bisa diunduh.
2 Siapkan VPS baru untuk menampung hasil restore. Nantinya bisa juga ini langsung dijadikan server yang baru dengan mengubah konfigurasi DNS.
3. Install Gitlab dengan versi yang sesuai dengan yang digunakan di backup.
4. Download file backup terakhir dari Amazon S3 ke folder restore gitlab
5. Restore backup
6. Restart Gitlab dan Periksa Hasilnya

### Restorasi Glacier ###

Untuk mengembalikan file yang sudah berada dalam Glacier ke S3, kita perlu login dulu ke web console. Kemudian masuk ke layanan S3 untuk melihat daftar file kita. Setelah itu, kita centang file yang ingin direstore, kemudian klik Initiate Restore

[![Initiate Restore](https://lh3.googleusercontent.com/CsBm9uzjSWe3lrvPciq56r5q2IRpz92iFOXrXbpmpAWiBFxurCvKllf4v_7C1Dt7F5_b8drUqsDz=w369-h490-no)](https://lh3.googleusercontent.com/CsBm9uzjSWe3lrvPciq56r5q2IRpz92iFOXrXbpmpAWiBFxurCvKllf4v_7C1Dt7F5_b8drUqsDz=w369-h490-no)

Amazon akan menanyakan berapa lama kita ingin file tersebut ditaruh di S3. Kita isi saja 3 hari agar kita bisa restore dengan tenang, tidak terburu-buru

[![Restore Duration](https://lh3.googleusercontent.com/cDmv0n0gR1N5esLzFeZuBxmaceVtjiyhnb7lWGx-P1oCO-c50CLBEZXvmNdHLjqA_0AurpgbGELK=w1160-h465-no)](https://lh3.googleusercontent.com/cDmv0n0gR1N5esLzFeZuBxmaceVtjiyhnb7lWGx-P1oCO-c50CLBEZXvmNdHLjqA_0AurpgbGELK=w1160-h465-no)

Selanjutnya, kita tinggal tunggu 3-5 jam sementara Amazon mengambilkan data kita yang disimpannya entah di mana. Kita bisa cek statusnya di tab Properties

[![Restore Status](https://lh3.googleusercontent.com/v9eCf2j5JugY6nUnvEAtzx_j3KB3j2XIUa0czgN0B8FGNZ81E5UX9e9EGj7fb1xpmxmB46STR-U9=w1362-h475-no)](https://lh3.googleusercontent.com/v9eCf2j5JugY6nUnvEAtzx_j3KB3j2XIUa0czgN0B8FGNZ81E5UX9e9EGj7fb1xpmxmB46STR-U9=w1362-h475-no)

Setelah selesai, kita akan melihat keterangan tambahan di Storage Class, yaitu Restored until `<waktu yang telah ditentukan>`.

[![Restore Completed](https://lh3.googleusercontent.com/UP3075Ppg8DA7xM4u0T961_ZvlIrZlC4u7DpwqPii4CiPJYeBc5QuIA7QseRXHy6Nqc4pG4GO94Q=w1362-h512-no)](https://lh3.googleusercontent.com/UP3075Ppg8DA7xM4u0T961_ZvlIrZlC4u7DpwqPii4CiPJYeBc5QuIA7QseRXHy6Nqc4pG4GO94Q=w1362-h512-no)

Kita juga bisa melakukan langkah-langkah restorasi di atas menggunakan command line. Pertama, kita lihat dulu daftar file backupnya.

```
aws s3 ls --summarize --human-readable s3://gitlab-artivisi-backup
```

Outputnya sebagai berikut

```
2016-08-31 19:01:34    2.6 GiB 1472670073_gitlab_backup.tar
2016-09-02 19:00:48    2.6 GiB 1472842838_gitlab_backup.tar
2016-09-03 19:00:50    2.6 GiB 1472929237_gitlab_backup.tar
2016-09-04 19:00:54    2.6 GiB 1473015639_gitlab_backup.tar
2016-09-05 19:00:49    2.6 GiB 1473102037_gitlab_backup.tar
2016-09-08 19:01:08    2.6 GiB 1473361253_gitlab_backup.tar
2016-09-09 19:00:50    2.6 GiB 1473447638_gitlab_backup.tar
2016-09-13 19:00:56    2.6 GiB 1473793242_gitlab_backup.tar
2016-09-14 19:00:53    2.6 GiB 1473879639_gitlab_backup.tar
2016-09-15 19:00:58    2.6 GiB 1473966043_gitlab_backup.tar
2016-09-16 19:01:00    2.6 GiB 1474052443_gitlab_backup.tar
2016-09-19 19:00:58    2.6 GiB 1474311643_gitlab_backup.tar

Total Objects: 12
   Total Size: 31.7 GiB
```

Tentunya kita ingin ambil yang terbaru, yaitu yang paling bawah. Pastikan dulu storage classnya. Harusnya masih di Glacier. Kalau sudah di S3, maka tidak perlu direstore, langsung saja unduh.

```
aws s3api head-object --bucket gitlab-artivisi-backup --key 1474311643_gitlab_backup.tar
```

Outputnya seperti ini

```
{
    "AcceptRanges": "bytes", 
    "ContentType": "binary/octet-stream", 
    "LastModified": "Mon, 19 Sep 2016 19:00:58 GMT", 
    "ContentLength": 2840115200, 
    "ETag": "\"dad3ad8683b936e03de57bccbc764292-28\"", 
    "StorageClass": "GLACIER", 
    "Metadata": {}
}
```

Kita bisa lakukan restore dengan perintah berikut

```
aws s3api restore-object --restore-request Days=3 --bucket gitlab-artivisi-backup --key 1474311643_gitlab_backup.tar
```

Bila kita cek lagi info filenya, maka statusnya akan berubah menjadi `Restore : Ongoing Request`

```
{
    "Restore": "ongoing-request=\"true\"", 
    "AcceptRanges": "bytes", 
    "ContentType": "binary/octet-stream", 
    "LastModified": "Mon, 19 Sep 2016 19:00:58 GMT", 
    "ContentLength": 2840115200, 
    "ETag": "\"dad3ad8683b936e03de57bccbc764292-28\"", 
    "StorageClass": "GLACIER", 
    "Metadata": {}
}
```

Setelah selesai restore, info file akan menjadi seperti ini

```
{
    "Restore": "ongoing-request=\"false\", expiry-date=\"Sat, 24 Sep 2016 00:00:00 GMT\"", 
    "AcceptRanges": "bytes", 
    "ContentType": "binary/octet-stream", 
    "LastModified": "Mon, 19 Sep 2016 19:00:58 GMT", 
    "ContentLength": 2840115200, 
    "ETag": "\"dad3ad8683b936e03de57bccbc764292-28\"", 
    "StorageClass": "GLACIER", 
    "Metadata": {}
}
```

Sama seperti versi web, kita mendapatkan tanggal tertentu dimana file tersebut bisa diakses.

> Peringatan !!! Jangan restore semua file backup sekaligus. Nanti kena charge mahal. 

Sebetulnya Amazon sudah mengingatkan kita pada waktu kita restore melalui antarmuka web. Begini katanya

```
You are charged a Glacier retrieval fee if you choose to restore more than 5% of your average monthly storage.
```

Terjemahan bebasnya kira-kira, "Awas jangan restore lebih dari 5%, nanti kena charge lho ... ". Detail perhitungannya dijelaskan [di websitenya Amazon](https://aws.amazon.com/s3/faqs/?tag=vglnk-c2223-20#How_will_I_be_charged_when_restoring_large_amounts_of_data_from_Amazon_Glacier).

> Peringatan Kedua !!! File di Glacier jangan buru-buru dihapus

Ini kesalahan yang saya lakukan di awal-awal karena tidak RTFM. Ternyata kalau kita hapus data di Glacier yang umurnya kurang dari 3 bulan, kita akan dikenakan fee. Detailnya bisa dibaca [di websitenya Amazon](https://aws.amazon.com/s3/faqs/#How_am_I_charged_for_deleting_objects_from_Amazon_Glacier_that_are_less_than_3_months_old).


### Menyiapkan Target Restorasi ###

Kita akan membuat VPS baru di DigitalOcean untuk menjalankan proses restorasi. Pembuatan VPS ini kita lakukan menggunakan aplikasi commandline bernama `tugboat`.

1. Create droplet baru di DigitalOcean

        tugboat create restoregitlab -k 714736 -s 2gb -i ubuntu-16-04-x64

2. SSH ke droplet. Kadang harus ditunggu dulu sampai droplet aktif sempurna.

        tugboat ssh restoregitlab

3. Install Gitlab dengan versi yang sesuai dengan yang digunakan di backup. Daftar installer semua versi ada [di sini](https://www.gitlab.com/downloads/archives/) dan [di sini](https://packages.gitlab.com/gitlab/gitlab-ce). 

[![Gitlab Versi Lama](https://lh3.googleusercontent.com/MY94aFy8XDsSbG3RmEvcF-_0RmvBLH9PijpOkumFd9Yz16gs9Yo1hggPH0J6y8RjlUn_SO8tkDyU=w1140-h694-no)](https://lh3.googleusercontent.com/MY94aFy8XDsSbG3RmEvcF-_0RmvBLH9PijpOkumFd9Yz16gs9Yo1hggPH0J6y8RjlUn_SO8tkDyU=w1140-h694-no)

Masukkan versi Gitlab yang diinginkan di perintah `apt-get install gitlab-ce`.

```
apt-get install curl openssh-server ca-certificates postfix -y
curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | bash
apt-get install gitlab-ce=8.11.0-ce.0
gitlab-ctl reconfigure
```

Kita bisa pastikan gitlab sudah terinstall dengan benar dengan cara browse ke alamat IP server kita. Gitlab yang baru terinstal akan meminta kita memasukkan password admin seperti ini.

[![Gitlab Fresh Install](https://lh3.googleusercontent.com/8_VYj8E791LfTkVVm3agTsqQDkzJUWFSygR_R4Bbq2NenH3b65ZWbNiNMw2v7hcV-nKQei4TNMsc=w1106-h561-no)](https://lh3.googleusercontent.com/8_VYj8E791LfTkVVm3agTsqQDkzJUWFSygR_R4Bbq2NenH3b65ZWbNiNMw2v7hcV-nKQei4TNMsc=w1106-h561-no)

Setelah Gitlab yang baru selesai diinstal, sekarang kita akan memulai proses restorasi. Untuk itu kita akan mengunduh file backup dari Amazon S3.

### Download File Backup ###

Untuk memudahkan dan mempercepat proses, kita akan gunakan aplikasi commandline yang disediakan Amazon, yaitu Amazon CLI (command line interface).

1. Install Amazon CLI

        export LC_ALL=en_US.UTF-8
        export LANG=en_US.UTF-8
        apt install python-pip -y
        pip install awscli
    

2. Konfigurasi Secret Key

        mkdir .aws
        printf "[default]" > .aws/config
        printf "[default]" > .aws/credentials
        printf "aws_access_key_id = AKIAKIMASUKKANACCESSKEYDISINI" >> .aws/credentials
        printf "aws_secret_access_key = blablablamasukkansecretkeydisini" >> .aws/credentials
    
3. Download file backup terakhir ke folder restore gitlab. Langkah ini bisa dijalankan paralel dengan proses instalasi dengan menggunakan tmux

        aws s3 cp s3://gitlab-artivisi-backup/1474311643_gitlab_backup.tar /var/opt/gitlab/backups/

4. Stop Gitlab Process

        gitlab-ctl stop unicorn
        gitlab-ctl stop sidekiq
        gitlab-ctl status
    
5. Restore backup

        gitlab-rake gitlab:backup:restore BACKUP=1474311643

    Bila versi backup berbeda dengan versi yang terinstall, maka Gitlab akan memberikan pesan error yang informatif

        Unpacking backup ... 	done
        GitLab version mismatch:
          Your current GitLab version (8.11.7) differs from the GitLab version in the backup!
          Please switch to the following version and try again:
          version: 8.11.0
    
6. Restart Gitlab dan Periksa Hasilnya

        gitlab-ctl start
        gitlab-rake gitlab:check SANITIZE=true
    
Setelah restore dilakukan dengan sukses, kita akan melihat login screen

[![Login Screen](https://lh3.googleusercontent.com/_VDioYRvWdEoZV5aMR7rcb4NA0STy6YRVEq1Pax0pN-PPfml-TEQfm31e6ZkwYB8n-JRYyY2tuxj=w997-h470-no)](https://lh3.googleusercontent.com/_VDioYRvWdEoZV5aMR7rcb4NA0STy6YRVEq1Pax0pN-PPfml-TEQfm31e6ZkwYB8n-JRYyY2tuxj=w997-h470-no)

Lalu kita bisa coba login dan mengoperasikan Gitlab seperti biasa.

Setelah kita pastikan hasil restore bekerja dengan baik, kita bisa hapus lagi droplet Digital Ocean supaya kita tidak kena tagihan mahal. Digital Ocean menghitung tagihan per jam. Jadi jangan menunda-nunda untuk menghapus droplet.

```
tugboat destroy restoregitlab
```

## Catatan Tambahan ##

> Om, kan di artikelnya mbak Istofani katanya server dia crash di DigitalOcean, kenapa di artikel ini justru dipake buat restore?

Mau dimanapun kita pasang server, Digital Ocean, Linode, Openshift, Heroku, Cloud Kilat, Amazon, pada suatu saat semuanya akan mengalami crash. Kalau mereka bisa restore sendiri, bagus. Kita tidak perlu repot. Walaupun demikian tidak seharusnya nasib kita digantungkan pada prosedur orang lain.

Jadi jangan malas mengimplementasikan prosedur backup dan restore.

Total waktu yang saya habiskan untuk membuat prosedur ini, mengetes, screenshot, menulis jadi blog, semuanya butuh waktu 1 hari penuh untuk backup dan 1 hari penuh untuk restore. Memang 2 mandays terasa banyak juga, apalagi kalau kita monetisasi dengan rate harian level software architect atau CTO. Tapi 2 mandays ini bisa menyelamatkan ratusan mandays yang hilang kalau kita tidak punya backup.

Sebagai tambahan motivasi, prosedur 2 mandays ini tidak ada apa-apanya dibandingkan apa yang dilakukan oleh Netflix. Bukan hanya berjaga-jaga terhadap server crash, mereka dengan sengaja membuat crash server mereka sendiri secara acak. Server production, bukan server testing. 

Manfaatnya:

* mereka bisa tahu apa yang terjadi pada saat crash. Apakah layanan mati total, atau sekedar jadi lemot, atau lainnya
* mereka bisa tahu, sejauh mana sistem mereka bisa bertahan terhadap kegagalan cloud provider. Bagaimana kalo Amazon mati di satu region? Bagaimana kalau Amazon mati di seluruh Amerika?
* mereka bisa tahu, secepat apa mereka mendapatkan notifikasi terhadap error
* dan banyak manfaat lainnya, berikut kutipannya

> Failures happen and they inevitably happen when least desired or expected. If your application can't tolerate an instance failure would you rather find out by being paged at 3am or when you're in the office and have had your morning coffee? Even if you are confident that your architecture can tolerate an instance failure, are you sure it will still be able to next week? How about next month? Software is complex and dynamic and that "simple fix" you put in place last week could have undesired consequences. Do your traffic load balancers correctly detect and route requests around instances that go offline? Can you reliably rebuild your instances? Perhaps an engineer "quick patched" an instance last week and forgot to commit the changes to your source repository?
> There are many failure scenarios that Chaos Monkey helps us detect. Over the last year Chaos Monkey has terminated over 65,000 instances running in our production and testing environments. Most of the time nobody notices, but we continue to find surprises caused by Chaos Monkey which allows us to isolate and resolve them so they don't happen again.

Selengkapnya bisa [dibaca di blognya Netflix](http://techblog.netflix.com/2012/07/chaos-monkey-released-into-wild.html). Software Chaos Monkey untuk membuat error tersebut juga mereka sediakan open source, silahkan kalau mau coba pasang.

## Penutup ##

Demikianlah prosedur untuk melakukan restore backup dari Amazon Glacier. Prosedur ini harus dilakukan secara berkala untuk memastikan backup kita benar-benar dapat digunakan. Percuma saja kita backup setiap hari kalau ternyata pada waktu dibutuhkan kita tidak bisa restore.


Server akan crash, database akan error, harddisk akan corrupt. Pertanyaannya bukanlah 

> Apakah server/database/harddisk saya akan error?

melainkan

> Kapan server/database/harddisk saya akan error?

Untuk itu, pastikan kita :

1. Lakukan backup 3-2-1
2. Lakukan latihan restore
3. Dokumentasikan prosedur restore semudah mungkin agar bisa kita copy paste dan jalankan dengan mudah.
