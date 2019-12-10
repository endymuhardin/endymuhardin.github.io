---
comments: true
date: 2009-06-02 08:23:43
layout: post
slug: backup-mysql
title: Backup MySQL
wordpress_id: 425
categories:
- lain
---

Sebelumnya, saya telah membahas script backup untuk [Trac](http://endy.artivisi.com/blog/lain/backup-trac/) maupun [Subversion](http://endy.artivisi.com/blog/aplikasi/svn-parentpath-backup/). Kali ini, kita akan bahas backup script untuk MySQL. 

Sama seperti backup script sebelumnya, script ini akan membuat folder sesuai dengan tanggal dan jam backup. Selanjutnya, script akan melakukan backup terhadap database MySQL sesuai dengan nama database yang ditentukan. Backup ini akan disimpan di folder yang kita tentukan. 

Berikut backup scriptnya.

[Update - 7 Des 2009] Sudah ditambahkan perintah untuk kompresi hasil backupnya.



    
    
    #!/bin/sh
    
    test -x /bin/date || exit -1
    test -x /usr/bin/mysqldump || exit -1
    test -x /bin/tar || exit -1
    test -x /bin/bzip2 || exit -1
    
    DBHOST=$1
    DBNAME=$2
    USERNAME=$3
    PASSWORD=$4
    BACKUP_FOLDER=$5
    CURR_DATE="$(/bin/date +%Y%m%d-%H%M)"
    
    
    if [ "$1" = '' ]; then
        echo "Usage : $0 <db name> <username> <password> <backup folder>"
        return 1
    fi
    
    if [ "$2" = '' ]; then
        echo "Usage : $0 <db name> <username> <password> <backup folder>"
        return 1
    fi
    
    if [ "$3" = '' ]; then
        echo "Usage : $0 <db name> <username> <password> <backup folder>"
        return 1
    fi
    
    if [ "$4" = '' ]; then
        echo "Usage : $0 <db name> <username> <password> <backup folder>"
        return 1
    fi
    
    
    echo "Create backup folder $BACKUP_FOLDER/$CURR_DATE"
    echo "..."
    
    /bin/mkdir "$BACKUP_FOLDER/$CURR_DATE"
    
    echo "Backup $DBNAME schema to $BACKUP_FOLDER/$CURR_DATE/$DBNAME-schema-$CURR_DATE.sql"
    echo "..."
    
    /usr/bin/mysqldump $DBNAME -u $USERNAME -p$PASSWORD -h$DBHOST -d > "$BACKUP_FOLDER/$CURR_DATE/$DBNAME-schema-$CURR_DATE.sql"
    
    echo "Backup $DBNAME data to $BACKUP_FOLDER/$CURR_DATE/$DBNAME-data-$CURR_DATE.sql"
    echo "..."
    
    /usr/bin/mysqldump $DBNAME -u $USERNAME -p$PASSWORD -h $DBHOST -n -c -t --single-transaction > "$BACKUP_FOLDER/$CURR_DATE/$DBNAME-data-$CURR_DATE.sql"
    
    echo "Compressing folder $CURR_DATE"
    echo "..."
    
    /bin/tar cvf - "$BACKUP_FOLDER/$CURR_DATE" | /bin/bzip2 -c9 > "$BACKUP_FOLDER/$CURR_DATE.tar.bz2"
    
    echo "Removing folder $BACKUP_FOLDER/$CURR_DATE"
    echo "..."
    
    /bin/rm -rf "$BACKUP_FOLDER/$CURR_DATE"
    
    echo "Completed"
    



Script di atas dapat dijalankan setiap Jumat malam jam 23.00 dengan konfigurasi sebagai berikut. 


    
    
    0 23 * * 5 /bin/sh /path/ke/mysql-backup.sh db_host db_name db_user db_pass backup_folder_mysql
    
