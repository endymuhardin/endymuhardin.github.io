---
layout: post
title: "Upgrade Major Version Gitlab"
date: 2021-09-22 07:14
comments: true
categories: 
- devops
---

Buat yang ingin menginstal repository Git di server sendiri, [Gitlab](https://about.gitlab.com) adalah aplikasi yang populer dan banyak digunakan karena open source, gratis, dan lengkap fiturnya. Gitlab juga sampai sekarang sangat aktif dikembangkan oleh para maintainernya, sehingga fitur-fitur baru terus bermunculan.

Hal ini tentu menggembirakan bagi para penggunanya, tapi juga relatif merepotkan bagi yang bertugas mengurus servernya. Ya apa lagi kalau bukan urusan upgrade versi. Begitu kita lupa upgrade beberapa bulan saja, maka kita akan ketinggalan rilis major version, sehingga urusan upgrade tidak lagi sesederhana `apt update && apt upgrade -y`.

Nah pada artikel ini saya akan mencatat langkah-langkah yang perlu dilakukan untuk mengupgrade Gitlab agar bisa kembali menyusul versi terbaru.

<!--more-->

Pertama yang harus kita lakukan adalah mengunjungi [halaman dokumentasi panduan upgrade](https://docs.gitlab.com/ee/update/index.html#upgrade-paths). Kita perlu melihat jalur upgrade yang harus ditempuh apabila kita sudah ketinggalan beberapa major version. Cari bagian upgrade paths yang bentuknya seperti ini

[![Upgrade Path]({{site.url}}/images/uploads/2021/gitlab-upgrade/01-gitlab-upgrade-path.png)]({{site.url}}/images/uploads/2021/gitlab-upgrade/01-gitlab-upgrade-path.png)

Selanjutnya, kita perlu tahu versi Gitlab yang sekarang terinstal di server kita. Caranya dengan login ke tampilan web Gitlab, kemudian klik menu Help di kanan atas.

[![Menu Help]({{site.url}}/images/uploads/2021/gitlab-upgrade/02-menu-help.png)]({{site.url}}/images/uploads/2021/gitlab-upgrade/02-menu-help.png)

Kita akan melihat halaman Help yang berisi versi Gitlab yang sedang berjalan. 

[![Versi Gitlab]({{site.url}}/images/uploads/2021/gitlab-upgrade/03-current-version.png)]({{site.url}}/images/uploads/2021/gitlab-upgrade/03-current-version.png)

Sesuaikan versi kita dengan upgrade path di dokumentasi resmi.

[![Upgrade Path Kita]({{site.url}}/images/uploads/2021/gitlab-upgrade/04-our-upgrade-path.png)]({{site.url}}/images/uploads/2021/gitlab-upgrade/04-our-upgrade-path.png)

Kemudian, kita perlu mencari nama lengkap dari rilis yang mau kita instal. Karena kita sekarang berada di versi `13.12.9`, maka saya perlu naik dulu ke `14.0.7`. Perintahnya adalah sebagai berikut:

```
apt-cache madison gitlab-ce | grep 14.0
```

Outputnya seperti ini

```
 gitlab-ce | 14.0.10-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.9-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.8-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.7-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.6-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.5-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.4-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.3-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.2-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.1-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
 gitlab-ce | 14.0.0-ce.0 | https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 Packages
```

Versi yang kita inginkan adalah `14.0.7-ce.0`. Instal dengan perintah berikut

```
apt install gitlab-ce=14.0.7-ce.0
```

Outputnya seperti ini


```
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following packages will be upgraded:
  gitlab-ce
1 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.
Need to get 926 MB of archives.
After this operation, 62.6 MB of additional disk space will be used.
Get:1 https://packages.gitlab.com/gitlab/gitlab-ce/ubuntu focal/main amd64 gitlab-ce amd64 14.0.7-ce.0 [926 MB]
Fetched 926 MB in 37s (24.9 MB/s)                                                                                                                                                                                
(Reading database ... 380734 files and directories currently installed.)
Preparing to unpack .../gitlab-ce_14.0.7-ce.0_amd64.deb ...
gitlab preinstall: Checking for unmigrated data on legacy storage
gitlab preinstall: Automatically backing up only the GitLab SQL database (excluding everything else!)
Deleting tmp directories ... done
done
Deleting old backups ... done. (0 removed)
Warning: Your gitlab.rb and gitlab-secrets.json files contain sensitive data 
and are not included in this backup. You will need these files to restore a backup.
Please back them up manually.
Backup task is done.
gitlab preinstall: Automatically backing up /etc/gitlab
Running configuration backup
Creating configuration backup archive: gitlab_config_1632301670_2021_09_22.tar
Configuration backup archive complete: /etc/gitlab/config_backup/gitlab_config_1632301670_2021_09_22.tar
WARNING: In GitLab 14.0 we will begin removing all configuration backups older than yourgitlab_rails['backup_keep_time'] setting (currently set to: 172800)
Keeping all older configuration backups
Unpacking gitlab-ce (14.0.7-ce.0) over (13.12.9-ce.0) ...
Setting up gitlab-ce (14.0.7-ce.0) ...
Upgrade complete! If your GitLab server is misbehaving try running
  sudo gitlab-ctl restart
before anything else.
If you need to roll back to the previous version you can use the database
backup made during the upgrade (scroll up for the filename).
```

Setelah `14.0.7-ce.0` terinstal, berarti kita sudah selangkah di belakang rilis terbaru. Langsung saja upgrade lagi dengan cara biasa

```
apt upgrade -y
```

Kadangkala kita mengalami error pada waktu ingin menjalankan versi terbaru. Ini hal yang biasa, mengingat kita upgrade beberapa versi sekaligus. Gitlab menambahkan fitur background migration di versi `14.2`, sehingga kadangkala masih ada proses migrasi database yang berjalan walaupun status upgrade sudah selesai.

Ada beberapa solusi untuk problem ini, diantaranya:

* Jangan upgrade langsung berturut-turut. Berikan jeda beberapa jam atau beberapa hari (tergantung ukuran repository dan database), supaya background jobs selesai dieksekusi
* Restart setiap selesai upgrade antar versi major, sesuai anjuran mbak-mbak Indihome.

Nah, kalau semua berjalan lancar, kita sudah menjalankan versi terbaru dari Gitlab.

Selamat mencoba ... semoga bermanfaat ...