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

Berikut backup scriptnya. Misalnya kita beri nama `mysql-backup.sh` dan disimpan di folder `/root/backup-db`

[Update - 7 Des 2009] Sudah ditambahkan perintah untuk kompresi hasil backupnya.

```bash
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
```



Script di atas dapat dijalankan setiap Jumat malam jam 23.00 dengan konfigurasi sebagai berikut. 

```
0 23 * * 5 /bin/sh /root/backup-db/mysql-backup.sh db_host db_name db_user db_pass /root/backup-db
```

Bila kita ingin membuat backup untuk semua database dalam server, kita bisa buatkan script yang mengambil nama-nama database di server, kemudian looping untuk melakukan backup kepada masing-masing database tersebut. Berikut scriptnya

```bash
#!/bin/sh

MYSQL_USER="root"
MYSQL=/usr/bin/mysql
MYSQL_PASSWORD="passwordnya root mysql"
MYSQLDUMP=/usr/bin/mysqldump
BACKUP_DIR="/root/backup-db"

databases=`$MYSQL --user=$MYSQL_USER -p$MYSQL_PASSWORD -e "SHOW DATABASES;" | grep -Ev "(Database|information_schema|performance_schema)"`


for db in $databases; do
    /bin/mkdir -p $BACKUP_DIR/$db
    /bin/sh /root/backup-db/backup.sh localhost $db $MYSQL_USER $MYSQL_PASSWORD $BACKUP_DIR/$db
done
```

Simpan file tersebut dengan nama `mysql-backup-semua.sh` dan letakkan di folder `/root/backup-db`.

Cara memanggilnya di cron sebagai berikut

```
0 0 * * * /bin/sh /root/backup-db/mysql-backup-semua.sh > /root/backup-db/`date +\%Y\%m\%d\%H\%M\%S`-cron.log 2>&1
```

Semoga bermanfaat