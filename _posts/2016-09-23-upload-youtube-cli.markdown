---
layout: post
title: "Upload ke Youtube dari Command Line"
date: 2016-09-23 07:00
comments: true
categories: 
- linux
---

Pembaca rutin blog ini tentu tahu bahwa ArtiVisi punya [channel Youtube](https://youtube.com/user/artivisi) yang sering diisi rekaman video tutorial pemrograman. Bila belum tahu, segera subscribe, tonton videonya, klik Like, dan jangan skip iklannya supaya kami dapat income ;)

Setelah selesai syuting dan edit, tentunya kita akan mengupload video tersebut ke Youtube agar bermanfaat buat orang banyak. Saat ini, saya mengupload dengan menggunakan browser. Karena satu video bisa berukuran hingga 1 GB, saya membutuhkan waktu lama untuk menunggu uploadnya selesai. Selama upload belum selesai, saya tidak bisa mematikan laptop dan pergi ke tempat lain. Tentu ini sangat membatasi pergerakan dan tidak efektif dalam penggunaan waktu.

Saya ingin proses upload ini bisa berjalan sendiri tanpa interaksi dengan saya. Solusinya tentu saja dengan aplikasi berbasis CLI (command line interface).

Secara garis besar, sistemnya nanti akan terlihat seperti ini

[![Skema Sistem Upload](https://lh3.googleusercontent.com/ibDR9rIFNyJ3kx6nj_CblfW5Gngxqsb-xGoqlx9Wnu07OwqR96O48xnHfpOS_LCo5ToFTXFKknOj=w1361-h350-no)](https://lh3.googleusercontent.com/ibDR9rIFNyJ3kx6nj_CblfW5Gngxqsb-xGoqlx9Wnu07OwqR96O48xnHfpOS_LCo5ToFTXFKknOj=w1361-h350-no)

<!--more-->

Aplikasinya sudah dibuatkan oleh Arnau Sanchez dan disediakan cuma-cuma [di Github](https://github.com/tokland/youtube-upload). Untuk menggunakannya, berikut adalah langkah-langkahnya:

1. Unduh dan install aplikasinya
2. Instal modul `google-api-python-client` untuk bahasa pemrograman Python
3. Setup authentication
4. Mulai mengupload

## Instalasi Aplikasi ##

Karena aplikasinya ada di Github, kita bisa unduh berupa zip ataupun dengan cara `git clone`. Saya lebih suka `git clone` agar lebih mudah diupdate kalau ada versi yang lebih baru.

Berikut perintahnya

```
git clone https://github.com/tokland/youtube-upload.git
```

Outputnya sebagai berikut

```
Cloning into 'youtube-upload'...
remote: Counting objects: 610, done.
remote: Total 610 (delta 0), reused 0 (delta 0), pack-reused 610
Receiving objects: 100% (610/610), 163.54 KiB | 67.00 KiB/s, done.
Resolving deltas: 100% (387/387), done.
Checking connectivity... done.
```

Selanjutnya, kita lakukan instalasi dengan perintah berikut
```
python setup.py install
```

Perintah tersebut akan mengeluarkan output seperti ini

```
/usr/lib/python2.7/distutils/dist.py:267: UserWarning: Unknown distribution option: 'entry_points'
  warnings.warn(msg)
/usr/lib/python2.7/distutils/dist.py:267: UserWarning: Unknown distribution option: 'install_requires'
  warnings.warn(msg)
running install
running build
running build_py
creating build
creating build/lib.linux-armv7l-2.7
creating build/lib.linux-armv7l-2.7/youtube_upload
copying youtube_upload/playlists.py -> build/lib.linux-armv7l-2.7/youtube_upload
copying youtube_upload/lib.py -> build/lib.linux-armv7l-2.7/youtube_upload
copying youtube_upload/upload_video.py -> build/lib.linux-armv7l-2.7/youtube_upload
copying youtube_upload/main.py -> build/lib.linux-armv7l-2.7/youtube_upload
copying youtube_upload/__init__.py -> build/lib.linux-armv7l-2.7/youtube_upload
copying youtube_upload/categories.py -> build/lib.linux-armv7l-2.7/youtube_upload
creating build/lib.linux-armv7l-2.7/youtube_upload/auth
copying youtube_upload/auth/webkit_qt.py -> build/lib.linux-armv7l-2.7/youtube_upload/auth
copying youtube_upload/auth/console.py -> build/lib.linux-armv7l-2.7/youtube_upload/auth
copying youtube_upload/auth/browser.py -> build/lib.linux-armv7l-2.7/youtube_upload/auth
copying youtube_upload/auth/__init__.py -> build/lib.linux-armv7l-2.7/youtube_upload/auth
copying youtube_upload/auth/webkit_gtk.py -> build/lib.linux-armv7l-2.7/youtube_upload/auth
running build_scripts
creating build/scripts-2.7
copying and adjusting bin/youtube-upload -> build/scripts-2.7
changing mode of build/scripts-2.7/youtube-upload from 644 to 755
running install_lib
creating /usr/local/lib/python2.7/dist-packages/youtube_upload
copying build/lib.linux-armv7l-2.7/youtube_upload/playlists.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload
copying build/lib.linux-armv7l-2.7/youtube_upload/lib.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload
copying build/lib.linux-armv7l-2.7/youtube_upload/upload_video.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload
copying build/lib.linux-armv7l-2.7/youtube_upload/main.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload
copying build/lib.linux-armv7l-2.7/youtube_upload/__init__.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload
copying build/lib.linux-armv7l-2.7/youtube_upload/categories.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload
creating /usr/local/lib/python2.7/dist-packages/youtube_upload/auth
copying build/lib.linux-armv7l-2.7/youtube_upload/auth/webkit_qt.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload/auth
copying build/lib.linux-armv7l-2.7/youtube_upload/auth/console.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload/auth
copying build/lib.linux-armv7l-2.7/youtube_upload/auth/browser.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload/auth
copying build/lib.linux-armv7l-2.7/youtube_upload/auth/__init__.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload/auth
copying build/lib.linux-armv7l-2.7/youtube_upload/auth/webkit_gtk.py -> /usr/local/lib/python2.7/dist-packages/youtube_upload/auth
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/playlists.py to playlists.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/lib.py to lib.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/upload_video.py to upload_video.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/main.py to main.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/__init__.py to __init__.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/categories.py to categories.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/auth/webkit_qt.py to webkit_qt.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/auth/console.py to console.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/auth/browser.py to browser.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/auth/__init__.py to __init__.pyc
byte-compiling /usr/local/lib/python2.7/dist-packages/youtube_upload/auth/webkit_gtk.py to webkit_gtk.pyc
running install_scripts
copying build/scripts-2.7/youtube-upload -> /usr/local/bin
changing mode of /usr/local/bin/youtube-upload to 755
running install_data
creating /usr/local/share/youtube_upload
copying client_secrets.json -> /usr/local/share/youtube_upload
running install_egg_info
Writing /usr/local/lib/python2.7/dist-packages/youtube_upload-0.8.0.egg-info
```

Untuk dapat digunakan, aplikasi ini membutuhkan library `google-api-python-client` yang dibuatkan oleh Google. Bila kita langsung pakai tanpa library ini, maka akan muncul pesan error seperti ini

```
Traceback (most recent call last):
  File "/usr/local/bin/youtube-upload", line 9, in <module>
    from youtube_upload import main    
  File "/usr/local/lib/python2.7/dist-packages/youtube_upload/main.py", line 24, in <module>
    import googleapiclient.errors
ImportError: No module named googleapiclient.errors
```

## Instalasi Google API Python ##

Untuk menginstal library tersebut, jalankan perintah berikut

```
sudo pip install --upgrade google-api-python-client progressbar2
```

Berikut adalah outputnya

```
Collecting google-api-python-client
  Downloading google_api_python_client-1.5.3-py2.py3-none-any.whl (50kB)
    100% |████████████████████████████████| 51kB 124kB/s 
Collecting progressbar2
  Downloading progressbar2-3.10.1-py2.py3-none-any.whl
Requirement already up-to-date: six<2,>=1.6.1 in /usr/lib/python2.7/dist-packages (from google-api-python-client)
Collecting httplib2<1,>=0.8 (from google-api-python-client)
  Downloading httplib2-0.9.2.zip (210kB)
    100% |████████████████████████████████| 215kB 275kB/s 
Collecting uritemplate<1,>=0.6 (from google-api-python-client)
  Downloading uritemplate-0.6.tar.gz
Collecting oauth2client<4.0.0,>=1.5.0 (from google-api-python-client)
  Downloading oauth2client-3.0.0.tar.gz (77kB)
    100% |████████████████████████████████| 81kB 803kB/s 
Collecting python-utils>=2.0.0 (from progressbar2)
  Downloading python_utils-2.0.0-py2.py3-none-any.whl
Collecting simplejson>=2.5.0 (from uritemplate<1,>=0.6->google-api-python-client)
  Downloading simplejson-3.8.2.tar.gz (76kB)
    100% |████████████████████████████████| 81kB 780kB/s 
Requirement already up-to-date: pyasn1>=0.1.7 in /usr/local/lib/python2.7/dist-packages (from oauth2client<4.0.0,>=1.5.0->google-api-python-client)
Collecting pyasn1-modules>=0.0.5 (from oauth2client<4.0.0,>=1.5.0->google-api-python-client)
  Downloading pyasn1_modules-0.0.8-py2.py3-none-any.whl
Requirement already up-to-date: rsa>=3.1.4 in /usr/local/lib/python2.7/dist-packages (from oauth2client<4.0.0,>=1.5.0->google-api-python-client)
Installing collected packages: httplib2, simplejson, uritemplate, pyasn1-modules, oauth2client, google-api-python-client, python-utils, progressbar2
  Running setup.py install for httplib2 ... done
  Running setup.py install for simplejson ... done
  Running setup.py install for uritemplate ... done
  Running setup.py install for oauth2client ... done
Successfully installed google-api-python-client-1.5.3 httplib2-0.9.2 oauth2client-3.0.0 progressbar2-3.10.1 pyasn1-modules-0.0.8 python-utils-2.0.0 simplejson-3.8.2 uritemplate-0.6
```

Selanjutnya, kita perlu mengkonfigurasi authentication dulu.

## Setup Authentication ##

Karena ini aplikasi non-interaktif, artinya tidak butuh campur tangan kita, maka tentunya dia tidak boleh menanyakan username dan password kepada kita. Soalnya kita ingin script ini berjalan sendiri, mungkin dijadwalkan di tengah malam agar dapat kuota bonus, pada waktu kita sedang tidur.

Untuk itu, kita perlu setup authentication. Google menggunakan OAuth versi 2. Saya sudah membuat [video tutorial tentang detail teknis implementasinya](https://www.youtube.com/playlist?list=PL9oC_cq7OYbwBK-VWbCHsr9kiDJ5Eo0_o). Tapi untuk kebutuhan artikel ini, cukuplah kita tahu cara pakainya saja.

Pertama, kita login dulu ke [Google API Console](https://console.developers.google.com). Setelah login dengan akun Gmail, kita akan melihat halaman Dashboard

[![Halaman Dashboard](https://lh3.googleusercontent.com/IIHhc95XGy89MymJaATLXUe7bdKziFT2aVQUUbZCqkWFtLDR8dlnLlkuY4P0nctk6CJfK7JxCAUW=w1359-h686-no)](https://lh3.googleusercontent.com/IIHhc95XGy89MymJaATLXUe7bdKziFT2aVQUUbZCqkWFtLDR8dlnLlkuY4P0nctk6CJfK7JxCAUW=w1359-h686-no)

Kita perlu buat project dulu, yaitu aplikasi yang akan menggunakan Google API ini. Klik dropdown di atas, dan pilih `Create Project`

[![Create Project](https://lh3.googleusercontent.com/c1JRGY3AudzEr3Kk3Gzsh8MQC9Y0P06kVlKgwWjFWM96xvuigVRqwd1yglLq9l-DljYPPsjgbM8f=w532-h474-no)](https://lh3.googleusercontent.com/c1JRGY3AudzEr3Kk3Gzsh8MQC9Y0P06kVlKgwWjFWM96xvuigVRqwd1yglLq9l-DljYPPsjgbM8f=w532-h474-no)

Beri nama projectnya. Nama project bebas, usahakan yang informatif supaya gampang dikenali kapan-kapan.

[![Nama Project](https://lh3.googleusercontent.com/5m35Iat3aOI1zGCQCqIWZzeD8JeRer0n2XlWhOiIi_C71zud3vhYNA0tmLxTogWv_u92kaWFVa_m=w1138-h586-no)](https://lh3.googleusercontent.com/5m35Iat3aOI1zGCQCqIWZzeD8JeRer0n2XlWhOiIi_C71zud3vhYNA0tmLxTogWv_u92kaWFVa_m=w1138-h586-no)

Project kita sudah siap digunakan. Google memiliki banyak API yang bisa kita pakai, misalnya untuk mengunggah data ke Google Drive, menggunakan fasilitas messaging di Android, peta Google Maps, dan sebagainya. Tapi kali ini kita hanya butuh `Youtube Data API`

[![Klik Youtube Data API](https://lh3.googleusercontent.com/k6vXyhHWHna7tWi2LD00jFQ246oCtFkMMKE6ONfj9AUDb50aRK38zKHkjyqhXjpoJw9Cu_Lo1JwO=w1188-h559-no)](https://lh3.googleusercontent.com/k6vXyhHWHna7tWi2LD00jFQ246oCtFkMMKE6ONfj9AUDb50aRK38zKHkjyqhXjpoJw9Cu_Lo1JwO=w1188-h559-no)

Setelah masuk ke dalamnya, klik Enable untuk mengaktifkannya.

[![Enable Youtube Data API](https://lh3.googleusercontent.com/_Feu2CE3h_cdx0bFpmamguiXg5CP4GunVFMAMIjGeyaD0engMcVpOnxRd-uO0R4kdOqWEBNsuhZJ=w1359-h529-no)](https://lh3.googleusercontent.com/_Feu2CE3h_cdx0bFpmamguiXg5CP4GunVFMAMIjGeyaD0engMcVpOnxRd-uO0R4kdOqWEBNsuhZJ=w1359-h529-no)

Berikutnya, kita akan membuat credentials. Yaitu file yang berisi informasi akun kita. File ini nantinya akan digunakan oleh aplikasi `youtube-upload` untuk login dan mengupload video ke akun kita. Tekan tombol `Go to Credentials`

[![Go to Credentials](https://lh3.googleusercontent.com/lQwAM3XVv2vmVBkzEb71rzV4gan3UhPX-NyRhTF_xqCOjfwFJJqI_CtOXwux3hnTdiskeQHj2t6E=w1351-h439-no)](https://lh3.googleusercontent.com/lQwAM3XVv2vmVBkzEb71rzV4gan3UhPX-NyRhTF_xqCOjfwFJJqI_CtOXwux3hnTdiskeQHj2t6E=w1351-h439-no)

Kita akan ditanyakan konfigurasi credentials yang dibutuhkan aplikasi. Pilih saja `Other UI` karena aplikasi kita bersifat CLI.

Kita juga centang opsi untuk mengakses user data, karena kita ingin video kita masuk ke akun kita sendiri.

[![Konfigurasi Credentials](https://lh3.googleusercontent.com/NwTYr-JGG5dgPjTCEi5cHUTRyitpEFYdBUySkV18yDVZ_pfhSOnlGTWQuR8o0gq7A8G2txWvPSRW=w1017-h665-no)](https://lh3.googleusercontent.com/NwTYr-JGG5dgPjTCEi5cHUTRyitpEFYdBUySkV18yDVZ_pfhSOnlGTWQuR8o0gq7A8G2txWvPSRW=w1017-h665-no)

Selanjutnya, kita beri nama credentials tersebut. Kita bisa membuat banyak credentials untuk satu aplikasi yang sama. Ini berguna bila kita ingin mengupload dari beberapa komputer yang berbeda. Pemisahan credential akan berguna pada saat kita ingin mencabut akses dari salah satu komputer.

[![Nama Credentials](https://lh3.googleusercontent.com/3scGC3ehW0zmgTXvjtuowm0WbP8gZjJcj5ViF_TS18em84GNM8Pz8HhQGAS1PsZ3Jy5k4DA773Do=w804-h512-no)](https://lh3.googleusercontent.com/3scGC3ehW0zmgTXvjtuowm0WbP8gZjJcj5ViF_TS18em84GNM8Pz8HhQGAS1PsZ3Jy5k4DA773Do=w804-h512-no)

Pada waktu pertama kali dijalankan, nantinya kita tetap perlu melakukan persetujuan terhadap aplikasi `youtube-upload` tersebut. Untuk itu, kita perlu memberikan label yang jelas supaya informatif.

[![Auth Label](https://lh3.googleusercontent.com/r1cfhzmJceFGXNv5oltV6t_a51zam59_8YDHtwH0RUCnrW54QmledRNotA02eNmqylG5e7TmhtUQ=w945-h682-no)](https://lh3.googleusercontent.com/r1cfhzmJceFGXNv5oltV6t_a51zam59_8YDHtwH0RUCnrW54QmledRNotA02eNmqylG5e7TmhtUQ=w945-h682-no)

File credentials siap, kita bisa unduh ke laptop kita.

[![Download credentials](https://lh3.googleusercontent.com/N_x81BJElvGOChroTq8QMVdw5D9Y0hMKX6wkwIRFw3ryQTrokuD0u-A5ZRtcPsBG_HgCBhwIP4tP=w1006-h570-no)](https://lh3.googleusercontent.com/N_x81BJElvGOChroTq8QMVdw5D9Y0hMKX6wkwIRFw3ryQTrokuD0u-A5ZRtcPsBG_HgCBhwIP4tP=w1006-h570-no)

Proses pembuatan credentials selesai. Kita bisa lihat daftar credentials yang diijinkan menggunakan aplikasi kita tadi.

[![Daftar Credentials](https://lh3.googleusercontent.com/UwOisSwqz7_Z5JeCp5JPTCCpNErovqa2Iz9CFayyjInFRopoMuOVo_gZAFdE9sA-Nq62nSb-eyO_=w1361-h449-no)](https://lh3.googleusercontent.com/UwOisSwqz7_Z5JeCp5JPTCCpNErovqa2Iz9CFayyjInFRopoMuOVo_gZAFdE9sA-Nq62nSb-eyO_=w1361-h449-no)

Sekarang, kita sudah bisa mencoba upload.

## Upload Video ##

Pertama, kita siapkan dulu seluruh file yang diperlukan ke dalam satu folder. Saya gunakan folder Videos

```
cd Videos
ls -lh
```

Berikut adalah isi foldernya

```
total 352M
-rw-r--r-- 1 endy endy  433 Sep 22 21:52 client_id.json
-rwxrwxr-x 1 endy endy  45M Sep 22 21:25 GOPR0357.MP4
-rwxrwxr-x 1 endy endy 177M Sep 22 21:51 GOPR0363.MP4
-rwxrwxr-x 1 endy endy 131M Sep 22 22:12 GOPR0370.MP4
```

File `client_id.json` adalah file credentials yang kita unduh pada langkah sebelumnya. Sedangkan file `*.MP4` adalah video yang ingin diupload.

Kita coba upload menggunakan perintah berikut

```
youtube-upload --client-secret=client_id.json --title="Gowes Puncak" --description="Gowes Fun bersama Kubic" GOPR0363.MP4
```

Pertama kali dijalankan, Google akan memverifikasi apakah aplikasi ini diijinkan untuk mengakses akun kita. Oleh karena itu, kita akan mendapati output berikut

```
Using client secrets: client_id.json
Using credentials file: /home/endy/.youtube-upload-credentials.json
Check this link in your browser: https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&client_id=962699408619-lpbe09lvfkb7ju9gk74kcoksftel0flq.apps.googleusercontent.com&access_type=offline
Enter verification code: 
```

Kita disuruh copy-paste link yang diberikan di browser agar Google bisa meminta persetujuan. Buka link tersebut di browser. Tentunya kita harus login dulu dengan akun Google. 

Saya memiliki beberapa channel, karenanya Google menanyakan channel mana yang akan menerima upload video ini. 

[![Pilih channel](https://lh3.googleusercontent.com/dELZDPhOwU8XG_OE3QpRiV8S4hUtH5IMBtusrECUpGmEaJFA1Nj-kJzlwZDOrBSmZx1-hvarVEfu=w1361-h460-no)](https://lh3.googleusercontent.com/dELZDPhOwU8XG_OE3QpRiV8S4hUtH5IMBtusrECUpGmEaJFA1Nj-kJzlwZDOrBSmZx1-hvarVEfu=w1361-h460-no)

Selanjutnya, Google akan minta persetujuan agar aplikasi `youtube-upload` boleh mengunggah video ke channel yang kita pilih barusan.

[![Auth Request](https://lh3.googleusercontent.com/SEDmBGSL7_Z4Sm3lFBqXfaZCafl9w0d_VWm-h5nIyQoodcx96gEqULkjo2DCFNsnxSfw7MV2d3gm=w1361-h483-no)](https://lh3.googleusercontent.com/SEDmBGSL7_Z4Sm3lFBqXfaZCafl9w0d_VWm-h5nIyQoodcx96gEqULkjo2DCFNsnxSfw7MV2d3gm=w1361-h483-no)

Begitu kita klik Approve, kita akan diberikan verification code. 

[![Auth Code](https://lh3.googleusercontent.com/et9ACNIMIsrZmd7lStbw6NgEA7d3Qh7ike2IKxHyN_jqObssILwewTh84BW1-pNgm9zefT-9803_=w763-h123-no)](https://lh3.googleusercontent.com/et9ACNIMIsrZmd7lStbw6NgEA7d3Qh7ike2IKxHyN_jqObssILwewTh84BW1-pNgm9zefT-9803_=w763-h123-no)

Copy kode tersebut, dan paste di command line kita tadi

```
youtube-upload --client-secret=client_id.json --title="Gowes Puncak 2" --description="Gowes Fun bersama Kubic" GOPR0363.MP4
Using client secrets: client_id.json
Using credentials file: /home/endy/.youtube-upload-credentials.json
Check this link in your browser: https://accounts.google.com/o/oauth2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube.upload+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&client_id=962699408619-lpbe09lvfkb7ju9gk74kcoksftel0flq.apps.googleusercontent.com&access_type=offline
Enter verification code: yaddayaddayaddablablablahorehorehore
```

Setelah dimasukkan, aplikasi akan menyimpannya dalam file bernama `/home/endy/.youtube-upload-credentials.json`. Bila kita ingin mengunggah ke beberapa channel berbeda, kita bisa rename file ini dan generate ulang untuk masing-masing channel. Nantinya kita bisa memilih channel tujuan upload dengan menyebutkan nama file credential di opsi command line. Contoh perintahnya sebagai berikut

```
youtube-upload \
  --client-secret=client_id.json \
  --credentials-file=channel_artivisi.json
  --title="Gowes Puncak 2" \
  --description="Gowes Fun bersama Kubic" \
  GOPR0363.MP4
```

Berikut adalah output setelah kita memasukkan verification code

```
Start upload: GOPR0363.MP4
100% |##################################################################| 178.0 KiB/s
Video URL: https://www.youtube.com/watch?v=VtEoIAHpyIA
VtEoIAHpyIA
```

Setelah proses upload selesai, kita bisa melihat hasilnya di akun Youtube kita

[![Video di Youtube](https://lh3.googleusercontent.com/OqSoC9u4mRRzdJNNUiwYlmAAE7pU-Yb9I7Y861KIrfuuAsCtqV2-sDL3DxCF57BxzskX1lmxriDy=w963-h652-no)](https://lh3.googleusercontent.com/OqSoC9u4mRRzdJNNUiwYlmAAE7pU-Yb9I7Y861KIrfuuAsCtqV2-sDL3DxCF57BxzskX1lmxriDy=w963-h652-no)

Aplikasi ini memiliki beberapa opsi tambahan yang bermanfaat, misalnya:

* `--category=Education` : untuk memasukkan kategori video
* `--playlist="Belajar Pemrograman Android"` : untuk memasukkan video ke playlist
* `--privacy=private` : bila ingin videonya tidak bisa dilihat orang lain
* dan sebagainya, bisa dilihat [di dokumentasinya](https://github.com/tokland/youtube-upload).

## Penutup ##

Demikianlah artikel cara mengupload video di Youtube secara non-interaktif. Waktu kita terbatas, jangan dihabiskan percuma untuk menonton progress bar.

Semoga bermanfaat.
