---
comments: true
date: 2008-01-17 18:05:30
layout: post
slug: svn-parentpath-backup
title: Another Subversion Backup Script
wordpress_id: 324
categories:
- aplikasi
---

Dulu saya pernah menulis tentang [backup script Subversion untuk Linux](http://endy.artivisi.com/blog/aplikasi/subversion-backup-dan-restore/), maupun [untuk Windows](http://endy.artivisi.com/blog/aplikasi/subversion-backup-script-untuk-windows/). Sayangnya, script tersebut hanya bisa digunakan untuk satu repository saja.

Biasanya saya menghosting beberapa Subversion repository sekaligus, dipublikasikan menggunakan Apache dengan konfigurasi `SVNParentPath`. Setidaknya ada 10 repository yang saya kelola, sehingga untuk mengkonfigurasi backup otomatisnya cukup melelahkan juga. 

Oleh karena itu, saya membuat backup script lagi. Kali ini mampu menangani satu folder yang berisi banyak repository. Berikut scriptnya, masih dalam bahasa Ruby. 





### subversion-repos-full-backup.rb



    
    
    require 'zlib'
    
    if ARGV.length < 2
      puts "Usage : ruby full-backup.rb <SVNParentPath folder> <backupfolder>"  
      exit
    end
    
    # some configuration
    svn_parent_path = ARGV[0]
    backup_folder = ARGV[1]
    
    # variable initialization
    current_date = Time.now.strftime("%Y%m%d")
    
    Dir.foreach(svn_parent_path) { |repo| 
        next if('.' == repo || '..' == repo)
        puts "Start to process folder : "+repo
    
        puts "Performing svndump"
        repo_name = svn_parent_path + File::SEPARATOR + repo
        dumpfile_name = repo + '-' +current_date + '.dmp'
        dumpfile = backup_folder + File::SEPARATOR + dumpfile_name
    
        `svnadmin dump #{repo_name} > #{dumpfile}`
    
        puts "Compressing dumpfile"
        Zlib::GzipWriter.open(dumpfile+".gz") do |gz|
          gz.write(File.read(dumpfile))
        end
    
    
        puts "Deleting uncompressed file"
        File.delete(dumpfile)
    }
    
    
    



Cara menjalankannya tidak sulit, cukup panggil dia melalui command prompt: 


    
    
    ruby subversion-repos-full-backup.rb /path/ke/repos /path/ke/backup-folder
    






Semoga bermanfaat
