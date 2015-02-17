---
comments: true
date: 2008-09-04 12:41:14
layout: post
slug: backup-trac
title: Backup Trac
wordpress_id: 364
categories:
- linux
---

[Trac sudah terinstal](http://endy.artivisi.com/blog/linux/instalasi-trac), sekarang harus diamankan melalui prosedur backup. 

Seperti biasa, semua prosedur backup harus otomatis dan terjadwal. Kalau tidak begitu, pasti tidak akan dijalankan. Jadi, selain kegiatan memburn CD, kegiatan backup lainnya harus diotomasi. 

Di website Trac sudah dijelaskan tentang [cara melakukan backup terhadap instalasi Trac](http://trac.edgewall.org/wiki/TracBackup). Kita hanya perlu membuat script sedikit supaya bisa membackup seluruh project dalam folder parent trac, dan mengkompresnya. 

Berikut scriptnya, seperti biasa, menggunakan Ruby. 



Script ini diadaptasi dari [script sebelumnya untuk backup Subversion repo](http://endy.artivisi.com/blog/aplikasi/svn-parentpath-backup/).

Berikut scriptnya 


    
    
    require 'zlib'
    require 'fileutils' 
    
    if ARGV.length < 2
      puts "Usage : ruby trac-backup.rb <Trac Parent folder> <backupfolder>"
      exit
    end
    
    # some configuration
    trac_parent_path = ARGV[0]
    backup_folder = ARGV[1]
    
    # variable initialization
    current_date = Time.now.strftime("%Y%m%d")
    
    Dir.foreach(trac_parent_path) { |trac|
        next if('.' == trac || '..' == trac)
        puts "Start to process folder : "+trac
    
        puts "Performing trac hotcopy"
        project_name = trac_parent_path + File::SEPARATOR + trac
        dumpfile_folder = trac + '-' +current_date
        dumpfile = backup_folder + File::SEPARATOR + dumpfile_folder
    
        `trac-admin #{project_name} hotcopy #{dumpfile}`
    
        puts "Compressing dumpfile"
        `tar czf #{backup_folder}/#{dumpfile_folder}.tar.gz -C #{backup_folder} #{dumpfile_folder}`
    
        puts "Deleting uncompressed backup"
        FileUtils.rm_r dumpfile
    }
    



Save dengan nama `trac-backup.rb`. 

Warning, kode di atas tidak bisa dijalankan di Windows, karena menggunakan command line tar untuk mengkompres file. Jika Anda ingin menggunakan di Windows, silahkan gunakan TugZIP seperti [contoh ini](http://endy.artivisi.com/blog/aplikasi/subversion-backup-script-untuk-windows/). 

Untuk menjalankannya, cukup panggil dari command prompt. 

    
    
    ruby trac-backup.rb /var/lib/trac /folder/tempat/backup
    



Supaya fully-automated, daftarkan di cron. Buka editor crontab. 

    
    
    crontab -e
    


Kemudian ketikkan entri sebagai berikut

    
    
    0 23 * * 5 /usr/bin/ruby /full/path/ke/trac-backup.rb /var/lib/trac /full/path/ke/folder/backup
    



Backup akan dijalankan setiap jam 23.00 pada hari Jumat. Lebih lanjut tentang cron bisa [dibaca di sini](http://bandung.linux.or.id/node/24). Jika bingung dengan formatnya, bisa gunakan [generator crontab online](http://www.htmlbasix.com/crontab.shtml).

