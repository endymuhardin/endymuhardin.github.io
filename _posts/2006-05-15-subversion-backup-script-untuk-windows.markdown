---
comments: true
date: 2006-05-15 18:46:02
layout: post
slug: subversion-backup-script-untuk-windows
title: Subversion backup script untuk Windows
wordpress_id: 92
categories:
- aplikasi
---

Dulu saya pernah menulis tentang [cara backup repository Subversion secara otomatis](http://endy.artivisi.com/blog/aplikasi/subversion-backup-dan-restore/). Tetapi, script yang ada di situ hanya bisa dijalankan di Linux, karena ada satu baris bermasalah pada Perl scriptnya, yaitu: 

`$next_backup_file = "daily-incremental-backup." . `date +%Y%m%d`;`

Baris di atas akan menjalankan perintah operating system seakan-akan kita menjalankan perintah ini di command prompt: 
`$ date +%Y%m%d`

Di Linux, perintah ini berjalan lancar, menampilkan output sebagai berikut: 
`20060515`

Output tersebut nantinya digunakan untuk membentuk nama file dump. Tetapi di Windows, hasilnya adalah: 
`The system cannot accept the date entered .. blablabla `
Rupanya Windows mengira kita akan ganti tanggal komputer. 

Jadi akhirnya, karena saya tidak mengerti Perl, saya membuat backup script baru dengan Ruby. Logika yang sama, alur program yang sama, cuma beda bahasa. Inilah hasilnya. Silahkan digunakan dan dimodifikasi sesuai kebutuhan.



## svn-weekly-backup.rb



    
    
    # Full Backup script for Subversion Repository #
    require 'date'
    
    # 1. Initialize variables
    backup_folder = "c:/Backup"
    repo_folder = "c:/Repository/Imagine"
    youngest = `svnlook youngest #{repo_folder}`.strip
    next_backup_file = "weekly-full-backup.#{Time.now.strftime("%Y%m%d")}.dmp"
    compress_script = backup_folder+"/compress-"+youngest+".tzs"
    compress_command = "C:/Program Files/TUGZip/TzScript.exe #{compress_script}"
    
    
    # 2. Perform backup
    puts "Backing up to revision #{youngest}\n";
    result = `svnadmin dump #{repo_folder} > #{backup_folder}/#{next_backup_file}`
    
    # 3. Compress backup result
    # 3.1 Creating temporary zip script [TugZip  Required]  
    puts "Generating compress script ...\n";
    tzs_file = < <-TZS
    		function main()
    		{
    		     var Comp = new Compress();
    		     Comp.Archive = "#{backup_folder}/#{next_backup_file}.zip";
    		     Comp.Type = "ZIP";
    		     Comp.Compression = 3;
    		     Comp.WorkingDir = "#{backup_folder}";
    		     Comp.Data = "#{next_backup_file}";
    		     Comp.Password = "";
    		     Comp.DateExtension = 0;
    		     Comp.TimeExtension = 0;
    		     Comp.Overwrite = 1;
    		     Comp.Recurse = 0;
    		     Comp.StoreFolderNames = 1;
    		     Comp.IncludeHiddenFiles = 1;
    		     Comp.DoCompress();
    		}
    	TZS
    File.open(compress_script, "w") do | file |
        file << tzs_file	
    end
    
    # 3.2. Executing compression
    puts "Compressing dump file...\n";
    puts `#{compress_command}`
    
    # 3.3. Deleting temporary zip script 
    puts "Deleting compress script ...\n";
    File.delete(compress_script);
    
    # 3.4 Deleting uncompressed dump file
    puts "Deleting uncompressed dump file ...\n";
    File.delete(backup_folder+"/"+next_backup_file);
    
    # 4. Write last backup position to marker file
    File.open(backup_folder+"/last_backed_up", "w") do | file |
        file << youngest
    end
    





## svn-daily-backup.rb



    
    
    # Full Backup script for Subversion Repository #
    require 'date'
    
    # 1. Initialize variables
    backup_folder = "c:/Backup"
    repo_folder = "c:/Repository/Imagine"
    youngest = `svnlook youngest #{repo_folder}`.strip
    next_backup_file = "daily-incremental-backup.#{Time.now.strftime("%Y%m%d")}.dmp"
    compress_script = backup_folder+"/compress-"+youngest+".tzs"
    compress_command = "C:/Program Files/TUGZip/TzScript.exe #{compress_script}"
    
    # 1.a. Get last backed up revision
    last_backup = 0;
    if File.exist?(backup_folder+"/last_backed_up")
    	File.open(backup_folder+"/last_backed_up", "r") do | file |
    	    while line = file.gets
    			last_backup = line.strip.to_i
    		end
    	end
    end
    
    
    # 2. Perform backup
    if last_backup == youngest.to_i
    	puts "No new revision since last backup .. exiting"
    	exit 0; 
    end
    
    start_backup = last_backup + 1
    
    puts "Backing up from revision #{last_backup} to revision #{youngest}\n";
    result = `svnadmin dump --incremental --revision #{last_backup}:#{youngest} #{repo_folder} > #{backup_folder}/#{next_backup_file}`
    
    # 3. Compress backup result
    # 3.1 Creating temporary zip script [TugZip  Required]  
    puts "Generating compress script ...\n";
    tzs_file = < <-TZS
    		function main()
    		{
    		     var Comp = new Compress();
    		     Comp.Archive = "#{backup_folder}/#{next_backup_file}.zip";
    		     Comp.Type = "ZIP";
    		     Comp.Compression = 3;
    		     Comp.WorkingDir = "#{backup_folder}";
    		     Comp.Data = "#{next_backup_file}";
    		     Comp.Password = "";
    		     Comp.DateExtension = 0;
    		     Comp.TimeExtension = 0;
    		     Comp.Overwrite = 1;
    		     Comp.Recurse = 0;
    		     Comp.StoreFolderNames = 1;
    		     Comp.IncludeHiddenFiles = 1;
    		     Comp.DoCompress();
    		}
    	TZS
    File.open(compress_script, "w") do | file |
        file << tzs_file	
    end
    
    # 3.2. Executing compression
    puts "Compressing dump file...\n";
    puts `#{compress_command}`
    
    # 3.3. Deleting temporary zip script 
    puts "Deleting compress script ...\n";
    File.delete(compress_script);
    
    # 3.4 Deleting uncompressed dump file
    puts "Deleting uncompressed dump file ...\n";
    File.delete(backup_folder+"/"+next_backup_file);
    
    # 4. Write last backup position to marker file
    File.open(backup_folder+"/last_backed_up", "w") do | file |
        file << youngest
    end
    



Langkah terakhir, buat bat script sederhana untuk mengeksekusi script ruby ini. Dengan adanya bat script, kita bisa dengan mudah menambahkan entri di Windows Scheduler untuk dijalankan secara otomatis dan terjadwal. 



## svn-weekly-backup.bat


`ruby C:\Backup\svn-weekly-backup.rb`



## daily-full-backup.bat


`ruby C:\Backup\svn-daily-backup.rb`

Terakhir, buat folder c:\Backup dan letakkan file-file berikut dalam folder tersebut: 



	
  * svn-weekly-backup.rb

	
  * svn-daily-backup.rb

	
  * svn-weekly-backup.bat

	
  * svn-daily-backup.bat



Sistem backup Anda siap digunakan. 

Buat yang malas copy-paste, silahkan [download keempat file tersebut](http://endy.artivisi.com/downloads/code/svn-backup-windows.tar.bz2) [tar.bz2 | 1.4 KB].

**
Perhatian: Untuk menjalankan kode ini dengan baik, Anda harus menginstal aplikasi [TugZIP](http://www.tugzip.com). Ini dibutuhkan untuk mengkompres file hasil dump. Buat yang lebih suka WinZip, WinRAR, atau aplikasi kompresi yang lain, silahkan memikirkan cara memanggilnya dari command prompt dan memodifikasi kode program di atas, yaitu bagian #3: Compress Backup Result.

Selain itu, Anda juga harus menginstal [bahasa pemrograman Ruby](http://ruby-lang.org/). Installernya bisa didownload [di sini](http://rubyforge.org/projects/rubyinstaller/). 
**



Selamat menggunakan, semoga bermanfaat :D 
