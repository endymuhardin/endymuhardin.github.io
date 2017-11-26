---
layout: post
title: "Membatalkan Perubahan File dengan Git"
date: 2017-11-24 07:00
comments: true
categories:
- aplikasi
---

Salah satu keuntungan menggunakan version control adalah kita bisa dengan mudah mengembalikan kondisi file ke masa lalu. Hal ini dibutuhkan bila ternyata ada anggota tim membuat perubahan yang ternyata tidak bisa digunakan. Contohnya, di Java kita menggunakan library FlywayDB untuk mengurus migrasi database. File migrasi ini sekali sudah dijalankan maka tidak boleh diedit lagi. Bila diedit, maka akan keluar error seperti ini

```
Caused by: org.flywaydb.core.api.FlywayException: Validate failed. Migration Checksum mismatch for migration 1.0.0.2017111302
-> Applied to database : -1966400148
-> Resolved locally    : -1305984306
```

Bila hal ini terjadi, maka kita ingin mengembalikan file migrasi tersebut ke kondisi sebelum diedit. Berikut langkah-langkahnya:

<!--more-->

Dari pesan error di atas, kita bisa lihat bahwa file yang bermasalah adalah file migrasi `1.0.0.2017111302`. Untuk lebih tepatnya filenya adalah `src/main/resources/db/migration/V1.0.0.2017111302__Data_Security.sql`

Pertama, kita cari dulu di mana commit yang memuat perubahan terhadap file tadi. Kita bisa lihat dari history perubahan filenya. Kita bisa gunakan perintah `git annotate <namafile>`. Outputnya seperti ini:

```
daebd685        (     gifar     2017-11-14 15:43:23 +0700       1)INSERT INTO s_permission (id, permission_value, permission_label) VALUES
daebd685        (     gifar     2017-11-14 15:43:23 +0700       2)  ('editmaster', 'EDIT_MASTER', 'Edit Master'),
daebd685        (     gifar     2017-11-14 15:43:23 +0700       3)  ('viewmaster', 'VIEW_MASTER', 'View Master'),
28d37d0c        (Endy Muhardin  2017-11-16 13:24:36 +0700       4)  ('editpendaftar', 'EDIT_PENDAFTAR', 'Edit Peserta'),
ebd1fe35        (   Haffizh     2017-11-23 15:03:19 +0700       5)  ('viewpendaftar', 'VIEW_PENDAFTAR', 'View Peserta'),
ebd1fe35        (   Haffizh     2017-11-23 15:03:19 +0700       6)  ('editfinance', 'EDIT_FINANCE', 'Edit Finance'),
ebd1fe35        (   Haffizh     2017-11-23 15:03:19 +0700       7)  ('viewfinance', 'VIEW_FINANCE', 'View Finance');
daebd685        (     gifar     2017-11-14 15:43:23 +0700       8)
f745c93d        (     gifar     2017-11-13 15:52:00 +0700       9)INSERT INTO s_role (id, description, name) VALUES
28d37d0c        (Endy Muhardin  2017-11-16 13:24:36 +0700       10)  ('pendaftar', 'PENDAFTAR', 'Peserta'),
ebd1fe35        (   Haffizh     2017-11-23 15:03:19 +0700       11)  ('humas', 'HUMAS', 'Humas'),
ebd1fe35        (   Haffizh     2017-11-23 15:03:19 +0700       12)  ('finance','FINANCE','Finance');
```

Kita bisa lihat bahwa perubahan terakhir dilakukan oleh `Haffizh` pada waktu dan tanggal `2017-11-23 15:03:19 +0700` dengan commit id `ebd1fe35`. Kita ingin membatalkan perubahan tersebut sehingga kondisi file menjadi seperti sebelum commit `ebd1fe35` terjadi.

Sebetulnya perubahannya tidak salah, yaitu menambahkan role dan permission untuk `FINANCE` agar fitur-fitur bagian keuangan bisa diproteksi dengan baik. Tetapi harusnya perubahan ini ditulis di file migrasi terpisah, misalnya `V1.2.0.2017112401__Role_Finance.sql`. Jadi sebelum dibatalkan kita harus pindahkan dulu script migrasinya.

Langkah kedua, kita buat dulu file baru untuk menampung perubahan tersebut, isinya kira-kira seperti ini:

```sql
INSERT INTO s_permission (id, permission_value, permission_label) VALUES
  ('editfinance', 'EDIT_FINANCE', 'Edit Finance'),
  ('viewfinance', 'VIEW_FINANCE', 'View Finance');

INSERT INTO s_role (id, description, name) VALUES
  ('finance','FINANCE','Finance');

INSERT INTO s_role_permission (id_role, id_permission) VALUES
  ('finance', 'viewfinance'),
  ('finance', 'editfinance');

INSERT INTO s_user (id, active, username, id_role) VALUES
  ('u003', true, 'finance', 'finance');

INSERT INTO s_user_password (id, id_user, password) VALUES
  ('up003', 'u003', '$2a$17$Mhfv.hlqIybDHWqAaTMU/.PKi8RDntt6xe9pTMGQLfnW3phTlhROm');
```

Isi file ini bisa dengan mudah kita dapatkan dari perintah `annotate` tadi. Berikut tampilannya di IDE. 

[![IDEA Annotate]({{site.url}}/images/uploads/2017/git-revert/annotate-before.png)]({{site.url}}/images/uploads/2017/git-revert/annotate-before.png)

Kita tinggal copy paste baris yang ada tulisannya `Yesterday Haffizh` ke file baru.

Langkah ketiga, backup dulu kondisi database existing, supaya kita bisa test perbaikan ini nantinya.

```
pg_dump registrasidb > kondisi-db-sebelum-revert.dmp
```

Selanjutnya, kita kembalikan file `V1.0.0.2017111302__Data_Security.sql` ke kondisi **satu commit sebelum** commit `ebd1fe35`.

```
git checkout ebd1fe35~1 --  src/main/resources/db/migration/V1.0.0.2017111302__Data_Security.sql
```

Tulisan `xxx~1` artinya 1 commit sebelum `xxx`. Hasilnya bisa kita lihat di editor ataupun perintah `git annotate` di command line seperti ini

[![IDEA Annotate Setelah Revert]({{site.url}}/images/uploads/2017/git-revert/annotate-after.png)]({{site.url}}/images/uploads/2017/git-revert/annotate-after.png)

Selanjutnya kita test lagi jalankan aplikasinya. Seharusnya sudah tidak ada error lagi. Berikut outputnya:


```
o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version 1.2.0.2017112401 - Role Finance
o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version 1.2.0.2017112402 - Skema Tagihan
o.f.core.internal.command.DbMigrate      : Successfully applied 2 migrations to schema "public" (execution time 00:00.193s).
```

Terakhir, kita bisa commit perbaikannya. Cek dulu file mana saja yang berubah

[![Git Status]({{site.url}}/images/uploads/2017/git-revert/git-status-before.png)]({{site.url}}/images/uploads/2017/git-revert/git-status-before.png)

Ingat, tadi kita bisa membatalkan perubahan dengan mudah karena commitnya rapih. Oleh karena itu sekarang kita juga harusnya commit file yang berkaitan dengan perbaikan script migrasi ini saja. File yang relevan hanya 2 : `V1.0.0.2017111302__Data_Security.sql` dan `V1.2.0.2017112401__Role_Finance.sql`. Yang lain jangan diikutkan.

[![Git Status Setelah Add]({{site.url}}/images/uploads/2017/git-revert/git-status-after.png)]({{site.url}}/images/uploads/2017/git-revert/git-status-after.png)

OK, sekarang commit dan push.

```
git commit -m "undo perubahan script migrasi"
git pull --rebase
git push
```

Demikianlah cara membatalkan perubahan terhadap file tertentu menggunakan Git. Semoga bermanfaat.