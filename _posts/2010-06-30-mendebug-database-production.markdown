---
comments: true
date: 2010-06-30 07:44:11
layout: post
slug: mendebug-database-production
title: Mendebug Database Production
wordpress_id: 539
categories:
- java
---

Suatu aplikasi, walaupun sudah go-live di environment production, tetap bisa saja mengalami error dan bug. Bug ini seringkali tidak ditemukan di environment development karena berbagai hal, misalnya variasi data, jumlah data, dan sebagainya. 

Langkah pertama ketika kita mengetahui ada bug tentunya adalah melokalisir masalah. Pada kondisi mana saja bug tersebut muncul. Setelah itu, kita dapat memfokuskan pencarian masalah di lokasi tersebut. Ini lebih efisien daripada kita harus menelusuri keseluruhan sistem. 

Misalnya kita sudah berhasil melokalisir masalah, yaitu transaksi di bulan tertentu. Langkah selanjutnya adalah memindahkan data production di lokasi tersebut ke environment development. Ini kita lakukan supaya kita bebas bereksperimen dengan data tersebut tanpa khawatir membahayakan data production. 

Masalahnya, tools backup database yang tersedia biasanya tidak bisa digunakan untuk mengambil sebagian data. Walaupun bisa (mysqldump menyediakan opsi where untuk membatasi record yang diambil), biasanya terbatas hanya di satu tabel saja. Sedangkan untuk bisa merestore-nya di development, kita butuh semua relasinya. 

Sebagai contoh, coba lihat skema berikut. 

[![ ](/images/uploads/2010/06/diagram-er-payment.png)](/images/uploads/2010/06/diagram-er-payment.png)

Untuk mengambil data payment, tentunya kita juga harus menarik data lain yang berelasi dengannya, yaitu di tabel grup loket, loket, payment value, payment info dan fee loket. Ini sangat sulit dilakukan, apalagi kalau data payment tersebut jumlahnya ratusan ribu record. 

Untunglah ada tools untuk mengatasi masalah ini, namanya [Jailer](http://jailer.sourceforge.net/). Dengan menggunakan Jailer, kita dapat menentukan tabel mana yang akan diambil datanya (payment), kriteria pengambilan (bulan tertentu saja), dan relasi mana saja yang ingin kita ambil. Hasilnya adalah satu set data lengkap dengan dependensinya yang bisa kita restore di development. 





## Persiapan Jailer


Pertama, tentunya kita unduh dulu Jailer di websitenya. Jangan lupa teriakkan, "Hidup Open Source !!!", karena aplikasi ini tersedia secara gratis berkat gerakan open source. 

Setelah berhasil diunduh, extract ke folder tertentu. Jailer tidak menyertakan driver untuk koneksi ke database, sehingga kita harus sediakan sendiri. Karena saya menggunakan MySQL, saya masukkan file mysql-connector.jar ke dalam folder lib. Kita mengikutkan driver database ke folder Jailer karena nantinya folder ini akan kita pack dan upload ke server production. 

Jailer ini akan kita jalankan di mesin development yang sudah terisi skema database. Kita akan coba dulu ambil data di development, kalau sudah sukses baru kita jalankan di production. 

Ada dua script untuk menjalankan jailer, yaitu jailerGUI dan jailer. jailerGUI digunakan untuk mendesain pengambilan data, sedangkan jailer adalah antarmuka command line untuk menjalankan pengambilan data. Karena kita ingin mendesain proses pengambilannya, kita gunakan jailerGUI.


    
    
    $ sh jailerGUI.sh
    



Berikut adalah tampilan awal Jailer. 

[![Jailer Welcome Page ](/images/uploads/2010/06/01-jailer-welcome-300x206.png)](/images/uploads/2010/06/01-jailer-welcome-300x206.png)

Jailer memberitahu kita bahwa belum ada data model yang bisa dikerjakan, dan menyarankan kita untuk menganalisa database. Klik Analyze Database. Selanjutnya Jailer akan meminta informasi cara koneksi ke database. 

[![Analyze Database ](/images/uploads/2010/06/02-analyze-db-300x134.png)](/images/uploads/2010/06/02-analyze-db-300x134.png)

Isikan informasi koneksi database dan driver yang digunakan. Driver yang kita gunakan adalah yang tadi sudah kita copy ke folder lib. 

[![Konfigurasi MySQL ](/images/uploads/2010/06/03-mysql-connectorj-300x128.png)](/images/uploads/2010/06/03-mysql-connectorj-300x128.png)

Klik OK untuk menganalisa database. 

[![Koneksi ke database ](/images/uploads/2010/06/04-connect-to-db-300x212.png)](/images/uploads/2010/06/04-connect-to-db-300x212.png)

Setelah itu, Jailer akan menghubungi database untuk mengambil informasi. Lognya akan ditampilkan di log output. Jailer akan memberi tahu kita tabel-tabel yang tidak ada primary keynya. Jailer tidak dapat memproses tabel tanpa primary key. 

[![Hasil Autodetect ](/images/uploads/2010/06/05-autodetect-result-300x233.png)](/images/uploads/2010/06/05-autodetect-result-300x233.png)

Klik tabel yang berwarna merah, dan definisikan primary keynya. Primary key yang kita definisikan di sini hanya digunakan Jailer, sehingga tidak perlu khawatir skema aslinya akan berubah. 

[![Add Primary Key ](/images/uploads/2010/06/06-edit-table-pk-300x200.png)](/images/uploads/2010/06/06-edit-table-pk-300x200.png)

Setelah itu, klik OK. Jailer akan menampilkan screen Extraction Model Editor. Pilih tabel payment, di dropdown subject, karena inilah tabel yang akan kita gunakan sebagai pusat extraction. 

[![Pilih tabel yang ingin diimport ](/images/uploads/2010/06/07-payment-relasi-300x206.png)](/images/uploads/2010/06/07-payment-relasi-300x206.png)

Jailer mendeteksi relasi antar tabel berdasarkan constraint foreign key yang kita pasang di database. Kadangkala ada tabel-tabel yang berelasi, namun tidak ada constraintnya. Entah karena malas mendefinisikan, atau memang sengaja tidak dikaitkan. Kita bisa mendaftarkan relasi tanpa constraint ini dengan membuka lagi Data Model Editor, kemudian klik Add di kotak Association sebelah kanan. 

[![Relasi non Foreign Key ](/images/uploads/2010/06/08-relasi-non-fk-300x234.png)](/images/uploads/2010/06/08-relasi-non-fk-300x234.png)

Setelah diklik OK, maka skema relasi di Extraction Model Editor akan berubah sesuai relasi yang ditambahkan. Sama dengan definisi primary key di atas, relasi ini hanya disimpan oleh Jailer dan tidak diaplikasikan ke skema database. 

[![Relasi Payment - Loket ](/images/uploads/2010/06/09-payment-relasi-2-300x168.png)](/images/uploads/2010/06/09-payment-relasi-2-300x168.png)

Kita perlu mendefinisikan batasan record payment yang akan diambil, yaitu yang terjadi di bulan Juni 2010. Dalam bentuk SQL, berikut adalah query yang digunakan


    
    
    select * from payment where date_format(paid_date, '%Y-%m') = '2010-06'
    



Kita ambil expression setelah where dan pasang di textfield where dalam Extraction Model Editor. 

[![Restriction ](/images/uploads/2010/06/10-payment-where-300x206.png)](/images/uploads/2010/06/10-payment-where-300x206.png)

Simpan dulu extraction modelnya. 

[![Save Extraction ](/images/uploads/2010/06/11-save-extraction-300x208.png)](/images/uploads/2010/06/11-save-extraction-300x208.png)

Beri nama yang representatif, misalnya payment-201006. Jailer akan menyimpan extraction model ini dalam format csv. Kalau sudah memahami formatnya, kita bisa membuatnya dengan text editor tanpa GUI (kalau mau). 

Setelah tersimpan, kita bisa klik Export Data sehingga memunculkan dialog berikut. 

[![Export Data ](/images/uploads/2010/06/12-data-export-300x283.png)](/images/uploads/2010/06/12-data-export-300x283.png)

Di screen tersebut kita bisa mengatur konfigurasi pengambilan data. Bagi saya, nilai defaultnya sudah memadai sehingga tidak ada yang diubah. 

Di box paling bawah ada command line yang bisa kita copy-paste untuk dijalankan tanpa GUI. Copy saja isinya ke text file untuk digunakan nanti. 

Yang harus kita isi di screen ini adalah textfield Into. Ini adalah nama file yang akan menampung script SQL berisi data yang diinginkan. Isi saja dengan nama payment-201006.sql. 

[![Export Into File ](/images/uploads/2010/06/13-export-into-300x205.png)](/images/uploads/2010/06/13-export-into-300x205.png)

Setelah itu, klik Export Data. Jailer akan segera bekerja dan menampilkan hasilnya dalam bentuk tree. 

[![Hasil Export ](/images/uploads/2010/06/14-export-result-300x168.png)](/images/uploads/2010/06/14-export-result-300x168.png)

Di situ kita bisa lihat berapa row yang akan diambil dari masing-masing tabel. 
Seperti kita lihat, cukup signifikan, yaitu 2000an record. Ini disebabkan karena jailer mengambil record secara rekursif tanpa ada batasan. 

Setelah dianalisa, kita hanya ingin mengambil tabel-tabel yang berkaitan langsung, yaitu payment, payment_info, payment_value, dan fee_loket. Sedangkan tabel sisanya dapat diabaikan karena bersifat pelengkap atau master data yang sudah ada di database development. 

Dengan melihat ke tree-nya, kita bisa memutus relasi fee_loket ke loket, karena dari situlah semua data lain akan ikut terbawa. 

Tutup screennya, dan kembali ke Extraction Model Editor. 

[![Membatasi Relasi ](/images/uploads/2010/06/15-restricted-dependency-300x168.png)](/images/uploads/2010/06/15-restricted-dependency-300x168.png)

Di kotak Association, expand node yang ingin kita putuskan, yaitu fee loket. Klik relasi loket, dan centang checkbox disabled di pojok kiri bawah. Setelah itu, jalankan lagi Export Data. 

[![Warning Restricted Dependency ](/images/uploads/2010/06/16-restricted-dependency-warning-300x153.png)](/images/uploads/2010/06/16-restricted-dependency-warning-300x153.png)

Jailer akan mengingatkan bahwa dengan membatasi dependensi, referential integrity akan rusak, karena relasi foreign key dari fee_loket ke loket akan terputus. Klik saja Yes, karena di database development kita tabel loket sudah terisi lengkap. 

Inilah hasilnya

[![Hasil Export setelah dibatasi ](/images/uploads/2010/06/17-restricted-export-result-300x82.png)](/images/uploads/2010/06/17-restricted-export-result-300x82.png)

Seperti kita lihat di atas, kita cuma mendapatkan 84 record dan pengambilan data berhenti di tabel fee_loket. 
Periksa output payment-201006.sql di folder Jailer untuk memastikan hasilnya sudah benar. 

Setelah sukses dijalankan di database development, compress lagi jailer yang sudah dimodifikasi barusan dan upload ke server production. Setibanya di server production, extract, kemudian jalankan script yang tadi kita copy-paste. 

Kalau baru pertama kali dijalankan, script ini akan menimbulkan error sebagai berikut : 


    
    
    $ ./export-payment-201006.sh 
    2010-06-28 14:15:08,114 [main] INFO   - Jailer 3.4.5
    2010-06-28 14:15:08,117 [main] INFO   - added 'lib/mysql-connector-java-5.1.6-bin.jar' to classpath
    2010-06-28 14:15:08,119 [main] INFO   - exporting 'extractionmodel/payment-201006.csv' to 'payment-201006.sql'
    2010-06-28 14:15:08,700 [main] INFO   - begin guessing SQL dialect
    2010-06-28 14:15:08,711 [main] INFO   - end guessing SQL dialect
    2010-06-28 14:15:08,718 [main] ERROR  - Can't find working tables! Run 'bin/jailer.sh create-ddl' and execute the DDL-script first!
    java.lang.RuntimeException: Can't find working tables! Run 'bin/jailer.sh create-ddl' and execute the DDL-script first!
    	at net.sf.jailer.entitygraph.EntityGraph.create(EntityGraph.java:122)
    	at net.sf.jailer.Jailer.export(Jailer.java:1142)
    	at net.sf.jailer.Jailer.jailerMain(Jailer.java:1064)
    	at net.sf.jailer.Jailer.jailerMain(Jailer.java:989)
    	at net.sf.jailer.Jailer.main(Jailer.java:967)
    Caused by: java.sql.SQLException: "Table 'ppobgsp_test.JAILER_GRAPH' doesn't exist" in statement "Insert into JAILER_GRAPH(id, age) values (2104021762, 1)"
    	at net.sf.jailer.database.Session.executeUpdate(Session.java:470)
    	at net.sf.jailer.entitygraph.EntityGraph.create(EntityGraph.java:120)
    	... 4 more
    Error: java.lang.RuntimeException: Can't find working tables! Run 'bin/jailer.sh create-ddl' and execute the DDL-script first!
    2010-06-28 14:15:08,724 [main] ERROR  - working directory is /opt/downloads/java/tools/test/integration-test/jailer
    



Ini disebabkan karena Jailer ternyata membuat beberapa tabel di database untuk kebutuhan internalnya. Ini dapat dilihat pada database development kita. 

[![Tabel Internal Jailer ](/images/uploads/2010/06/18-jailer-tables-300x226.png)](/images/uploads/2010/06/18-jailer-tables-300x226.png)

Untuk menggenerate tabel di atas, kita jalankan jailer dengan opsi create-ddl. Ini akan menghasilkan SQL di layar. SQL ini harus kita jalankan di database production supaya tabelnya terbentuk. 


    
    
    $ sh jailer.sh create-ddl
    DROP TABLE JAILER_ENTITY;
    DROP TABLE JAILER_DEPENDENCY;
    DROP TABLE JAILER_SET;
    DROP TABLE JAILER_GRAPH;
    DROP TABLE JAILER_CONFIG;
    DROP TABLE JAILER_TMP;
    
    CREATE TABLE JAILER_CONFIG
    (
       jversion        VARCHAR(20),
       jkey            VARCHAR(200),
       jvalue          VARCHAR(200)
    ) ;
    
    INSERT INTO JAILER_CONFIG(jversion, jkey, jvalue) values('3.4.5', 'magic', '837065098274756382534403654245288');
    
    CREATE TABLE JAILER_GRAPH
    (
       id              INTEGER NOT NULL,
       age             INTEGER NOT NULL
          
    --   ,CONSTRAINT jlr_pk_graph PRIMARY KEY(id)
    ) ;
    
    CREATE TABLE JAILER_ENTITY
    (
       r_entitygraph   INTEGER NOT NULL,
    
       PK0 BIGINT , PK1 VARCHAR(255) , PK2 VARCHAR(255) , PK3 INT , PK4 VARCHAR(255) , PK5 BIGINT ,
       birthday        INTEGER NOT NULL,
       type            VARCHAR(120) NOT NULL,
    
       PRE_PK0 BIGINT , PRE_PK1 VARCHAR(255) , PRE_PK2 VARCHAR(255) , PRE_PK3 INT , PRE_PK4 VARCHAR(255) , PRE_PK5 BIGINT ,
       PRE_TYPE        VARCHAR(120),
       orig_birthday   INTEGER,
       association     INTEGER
    
    -- ,  CONSTRAINT jlr_fk_graph_e FOREIGN KEY (r_entitygraph) REFERENCES JAILER_GRAPH(id)
    ) ;
    
    CREATE INDEX jlr_enty_brthdy ON JAILER_ENTITY (r_entitygraph, birthday, type) ;
    CREATE INDEX jlr_enty_upk1 ON JAILER_ENTITY (r_entitygraph , PK0, PK1, PK2, PK3, PK4, PK5, type) ;
    
    
    CREATE TABLE JAILER_SET
    (
       set_id          INTEGER NOT NULL,
       type            VARCHAR(120) NOT NULL,
       PK0 BIGINT , PK1 VARCHAR(255) , PK2 VARCHAR(255) , PK3 INT , PK4 VARCHAR(255) , PK5 BIGINT 
    ) ;
    
    CREATE INDEX jlr_pk_set1 ON JAILER_SET (set_id , PK0, PK1, PK2, PK3, PK4, PK5, type) ;
    
    
    CREATE TABLE JAILER_DEPENDENCY
    (
       r_entitygraph   INTEGER NOT NULL,
       assoc           INTEGER NOT NULL,
       depend_id       INTEGER NOT NULL,
       traversed       INTEGER,
       from_type       VARCHAR(120) NOT NULL,
       to_type         VARCHAR(120) NOT NULL,
       FROM_PK0 BIGINT , FROM_PK1 VARCHAR(255) , FROM_PK2 VARCHAR(255) , FROM_PK3 INT , FROM_PK4 VARCHAR(255) , FROM_PK5 BIGINT ,
       TO_PK0 BIGINT , TO_PK1 VARCHAR(255) , TO_PK2 VARCHAR(255) , TO_PK3 INT , TO_PK4 VARCHAR(255) , TO_PK5 BIGINT    
    
    -- ,  CONSTRAINT jlr_fk_graph_d FOREIGN KEY (r_entitygraph) REFERENCES JAILER_GRAPH(id)
    ) ;
    
    CREATE INDEX jlr_dep_from1 ON JAILER_DEPENDENCY (r_entitygraph, assoc , FROM_PK0, FROM_PK1, FROM_PK2, FROM_PK3, FROM_PK4, FROM_PK5) ;
    
    CREATE INDEX jlr_dep_to1 ON JAILER_DEPENDENCY (r_entitygraph , TO_PK0, TO_PK1, TO_PK2, TO_PK3, TO_PK4, TO_PK5) ;
    
    
    CREATE TABLE JAILER_TMP 
    (
        c1 INTEGER, 
        c2 INTEGER
    ) ;
    
    INSERT INTO JAILER_CONFIG(jversion, jkey, jvalue) values('3.4.5', 'upk', '679547784');
    




Setelah tabelnya siap, jalankan kembali script yang error di atas. Berikut outputnya. 


    
    
    $ ./export-payment-201006.sh 
    2010-06-28 14:12:31,175 [main] INFO   - Jailer 3.4.5
    2010-06-28 14:12:31,190 [main] INFO   - added 'lib/mysql-connector-java-5.1.6-bin.jar' to classpath
    2010-06-28 14:12:31,191 [main] INFO   - exporting 'extractionmodel/payment-201006.csv' to 'payment-201006.sql'
    2010-06-28 14:12:32,850 [main] INFO   - SQL dialect is MYSQL
    2010-06-28 14:12:32,925 [main] INFO   - gather statistics after 0 inserted rows...
    2010-06-28 14:12:32,966 [main] INFO   - reading file 'renew.sql'
    2010-06-28 14:12:32,966 [main] INFO   - 0 statements (100%)
    2010-06-28 14:12:32,967 [main] INFO   - successfully read file 'renew.sql'
    2010-06-28 14:12:32,977 [main] INFO   - exporting payment Where date_format(paid_date,'%Y-%m') = '2010-06'
    2010-06-28 14:12:33,028 [main] INFO   - day 1, progress: payment
    2010-06-28 14:12:33,039 [main] INFO   - starting 4 jobs
    2010-06-28 14:12:33,040 [main] INFO   - gather statistics after 3 inserted rows...
    2010-06-28 14:12:33,041 [main] INFO   - reading file 'renew.sql'
    2010-06-28 14:12:33,042 [main] INFO   - 0 statements (100%)
    2010-06-28 14:12:33,042 [main] INFO   - successfully read file 'renew.sql'
    2010-06-28 14:12:33,047 [main] INFO   - resolving payment -> payment_info (inverse-FKE25C3F47AB64A229) 1:n on B.id_payment=A.id...
    2010-06-28 14:12:33,105 [main] INFO   - 66 entities found resolving payment -> payment_info (inverse-FKE25C3F47AB64A229) 1:n on B.id_payment=A.id
    2010-06-28 14:12:33,105 [main] INFO   - resolving payment -> cetak_ulang (inverse-FK45B985E0AB64A229) 1:n on B.id_payment=A.id...
    2010-06-28 14:12:33,126 [main] INFO   - 0 entities found resolving payment -> cetak_ulang (inverse-FK45B985E0AB64A229) 1:n on B.id_payment=A.id
    2010-06-28 14:12:33,126 [main] INFO   - resolving payment -> fee_loket (inverse-FK9632AFFEAB64A229) 1:n on B.id_payment=A.id...
    2010-06-28 14:12:33,129 [main] INFO   - 3 entities found resolving payment -> fee_loket (inverse-FK9632AFFEAB64A229) 1:n on B.id_payment=A.id
    2010-06-28 14:12:33,131 [main] INFO   - resolving payment -> payment_value (inverse-FK69DD09F8AB64A229) 1:n on B.id_payment=A.id...
    2010-06-28 14:12:33,142 [main] INFO   - 12 entities found resolving payment -> payment_value (inverse-FK69DD09F8AB64A229) 1:n on B.id_payment=A.id
    2010-06-28 14:12:33,143 [main] INFO   - executed 4 jobs
    2010-06-28 14:12:33,143 [main] INFO   - day 2, progress: payment_info, fee_loket, payment_value
    2010-06-28 14:12:33,144 [main] INFO   - skip reversal association payment_info -> payment
    2010-06-28 14:12:33,144 [main] INFO   - skip reversal association fee_loket -> payment
    2010-06-28 14:12:33,147 [main] INFO   - skip reversal association payment_value -> payment
    2010-06-28 14:12:33,147 [main] INFO   - starting 1 jobs
    2010-06-28 14:12:33,148 [main] INFO   - executed 1 jobs
    2010-06-28 14:12:33,149 [main] INFO   - exported payment Where date_format(paid_date,'%Y-%m') = '2010-06'
    2010-06-28 14:12:33,149 [main] INFO   - total progress: payment_info, payment, fee_loket, payment_value
    2010-06-28 14:12:33,149 [main] INFO   - export statistic:
    2010-06-28 14:12:33,169 [main] INFO   - Exported Rows:     84
    2010-06-28 14:12:33,169 [main] INFO   -     fee_loket                      3
    2010-06-28 14:12:33,169 [main] INFO   -     payment                        3
    2010-06-28 14:12:33,172 [main] INFO   -     payment_info                   66
    2010-06-28 14:12:33,172 [main] INFO   -     payment_value                  12
    2010-06-28 14:12:33,173 [main] INFO   - writing file 'payment-201006.sql'...
    2010-06-28 14:12:33,178 [main] INFO   - independent tables: payment
    2010-06-28 14:12:33,179 [main] INFO   - starting 1 jobs
    2010-06-28 14:12:33,380 [main] INFO   - executed 1 jobs
    2010-06-28 14:12:33,380 [main] INFO   - independent tables: payment_info, fee_loket, payment_value
    2010-06-28 14:12:33,384 [main] INFO   - starting 3 jobs
    2010-06-28 14:12:33,447 [main] INFO   - executed 3 jobs
    2010-06-28 14:12:33,447 [main] INFO   - cyclic dependencies for: 
    2010-06-28 14:12:33,447 [main] INFO   - starting 0 jobs
    2010-06-28 14:12:33,448 [main] INFO   - executed 0 jobs
    2010-06-28 14:12:33,448 [main] INFO   - gather statistics after 84 inserted rows...
    2010-06-28 14:12:33,450 [main] INFO   - reading file 'renew.sql'
    2010-06-28 14:12:33,450 [main] INFO   - 0 statements (100%)
    2010-06-28 14:12:33,454 [main] INFO   - successfully read file 'renew.sql'
    2010-06-28 14:12:33,456 [main] INFO   - starting 0 jobs
    2010-06-28 14:12:33,467 [main] INFO   - executed 0 jobs
    2010-06-28 14:12:33,486 [main] INFO   - file 'payment-201006.sql' written.
    



Selesai sudah, data yang kita inginkan ada di file payment-201006.sql, siap diunduh dan dijalankan di database development. 

Semoga bermanfaat, kalau ada yang kurang jelas, silahkan baca [tutorial resminya](http://jailer.sourceforge.net/exporting-data.htm). 
