---
comments: true
date: 2006-09-29 09:54:11
layout: post
slug: eclipse-birt
title: Menggunakan Eclipse BIRT [bagian 1]
wordpress_id: 178
categories:
- java
---

Programmer beraliran komersial tentunya sudah tidak asing dengan perlengkapan reporting seperti Crystal Report. Reporting tools ini berguna untuk membuat laporan dari sumber data yang sudah ada. 

Cara kerjanya sederhana. Bagi yang belum pernah menggunakan aplikasi reporting dan ingin memahaminya secara sederhana, dapat menggunakan fasilitas mail merge yang dimiliki aplikasi *office* seperti Microsoft Word atau OpenOffice Writer. 

Intinya, kita membuat satu template. Di dalam template tersebut kita isikan variabel-variabel yang kita ingin tampilkan. Pada saat dijalankan (runtime), variabel ini akan digantikan oleh template processor dengan data yang diambil dari sumber data eksternal.

Contoh umum penggunaan fasilitas mail merge adalah untuk mencetak label alamat pada undangan. Kita definisikan variabel yang akan tampil, misalnya:

* Nama
* Alamat
* Kota

Kemudian, kita sediakan file lain di spreadsheet (MS Excel atau OO Calc) yang memuat data tersebut. Data yang disimpan bisa saja ratusan atau ribuan. Untuk Open Office, database yang digunakan tidak hanya dari spreadsheet, tapi bisa juga dari *database betulan* seperti MySQL atau Oracle.

Setelah template dan data siap, aplikasi dijalankan untuk melakukan *merge*. Hasilnya adalah ratusan label yang sudah terisi dengan data dari database.

Logika yang sama digunakan oleh perlengkapan reporting seperti Crystal Report dan kompetitor lainnya. Biasanya template dibuat dalam format XML. Selanjutnya, prosesnya sama. Desain templatenya, kemudian siapkan datanya.

Saya tidak akan membahas Crystal Report di sini. Kita akan membahas aplikasi reporting yang gratis, yaitu [Eclipse BIRT](http://www.eclipse.org/birt "BIRT Homepage"). Sebagai bagian dari Eclipse, aplikasi ini gratis dan berkualitas tinggi. 

Fitur BIRT juga tidak kalah dengan aplikasi reporting lain, diantaranya adalah:

1. Berbagai pilihan datasource; RDBMS, XML, Text File, dan lain-lain. Lain-lain maksudnya di sini adalah sumber lain yang dapat diakses melalui scripting language BIRT.
2. Berbagai pilihan output; PDF, XLS, CSV, HTML, XML adalah format yang didukung. Untuk format lain, asalkan berbasis text, bisa menggunakan output XML yang kemudian diproses lagi menggunakan XSLT.
3. Berbagai pilihan integrasi. BIRT dapat dijalankan sebagai standalone report server, atau juga diembed (digabungkan) dengan aplikasi kita. Bila dijalankan sebagai standalone server, BIRT dapat berkomunikasi dengan aplikasi dengan bahasa pemrograman yang berbeda, misalnya PHP, Ruby, .Net, atau yang lainnya.
4. Visual Designer. Eclipse sudah melengkapi BIRT dengan database explorer, drag-and-drop query builder, dan fitur canggih lainnya. Kita akan lihat fitur ini dalam screenshot di bawah.
5. Integrated dengan IDE. Bila kita menggunakan Java, kita bisa coding di Eclipse, dan membuat report di Eclipse juga. Jadi tidak perlu menggunakan beberapa tools yang berbeda.

Baiklah, mari kita coba saja.


Pertama, kita harus donlod dulu dari [homepagenya][BIRT Homepage]. Ukurannya relatif besar, sekitar 200 MB. Tapi jangan khawatir, ada mirrornya di [server Universitas Indonesia][anak kambing]. Kalau kita sudah punya Eclipse terbaru, bisa langsung gunakan fitur updatenya. Jalankan downloadnya sebelum pulang kantor. Dengan demikian, besok pagi ketika kita datang, BIRT sudah terinstal.

Setelah terinstal, kita bisa langsung menggunakannya. BIRT terinstal lengkap bersama contoh database. [Tutorial cara penggunaannya][Tutorial BIRT] juga cukup jelas dan lengkap. Sayangnya tidak ada screenshotnya. Jangan khawatir, pada artikel ini, saya akan sediakan screenshotnya.

Berikut adalah tampilan Eclipse pada saat sudah dijalankan.

[![Eclipse Interface ](/images/uploads/2006/09/eclipse.png)](/images/uploads/2006/09/eclipse.png)

Selanjutnya, kita langsung membuat project baru. Klik File > New, kemudian pilih Report Project

[![Create Report Project ](/images/uploads/2006/09/new-report-project.png)](/images/uploads/2006/09/new-report-project.png)

Beri nama projectnya. Kemudian klik Next. Eclipse akan menanyakan apakah kita ingin bekerja dalam Report Perspective. Jawab saja Yes. 

Report perspective tampil seperti screenshot berikut

[![Report Perspective ](/images/uploads/2006/09/eclipse-report.png)](/images/uploads/2006/09/eclipse-report.png)

Perhatikan di sebelah kiri ada tiga tab : Pallete, Data Explorer, dan Library. Kita akan gunakan tab ini untuk mendesain report.

Kemudian, mari kita buat report pertama kita. Datasource yang akan digunakan sudah disediakan Eclipse sebagai database sample. Sesuai tutorial Eclipse, kita akan membuat laporan yang berisi daftar nama pelanggan, dikelompokkan berdasarkan provinsi (State) dan kota (City).

Untuk membuat report baru, klik File > New > Report. Kalau pilihan Report belum ada, pilih Others dan cari di daftar yang tersedia, dalam kategori Business Intelligence and Reporting Tools.

[![Create Report ](/images/uploads/2006/09/new-report.png)](/images/uploads/2006/09/new-report.png)

Beri nama reportnya

[![Define Report ](/images/uploads/2006/09/new-report-1.png)](/images/uploads/2006/09/new-report-1.png)

Kemudian pilih templatenya. Supaya lebih seru, kita akan gunakan Blank Template

[![Blank Template ](/images/uploads/2006/09/new-report-blank2.png)](/images/uploads/2006/09/new-report-blank2.png)

Selanjutnya, template report kita tampil di layar dalam Design View. Kita dapat berganti ke berbagai view melalui tab di bawah editor report. 

Setelah report tampil, kita dapat menambahkan label. Tambahkan saja satu label untuk judul, yaitu Laporan Data Pelanggan. Jenis huruf, rata tengah, dan setting lainnya dapat dilakukan melalui toolbar yang ada di bagian bawah.

[![Add Label ](/images/uploads/2006/09/report-design-label.png)](/images/uploads/2006/09/report-design-label.png)

Sebelum melangkah lebih jauh, kita perlu mendefinisikan Data Source untuk report ini. Buat Data Source baru melalui panel sebelah kiri. 

[![Create DataSource ](/images/uploads/2006/09/report-datasource-new.png)](/images/uploads/2006/09/report-datasource-new.png)

Pilihan datasource akan muncul. Kita akan menggunakan database sample yang sudah ada. Untuk project betulan, kita dapat gunakan database atau sumber data yang lainnya.

[![Select DataSource ](/images/uploads/2006/09/report-datasource-new-1.png)](/images/uploads/2006/09/report-datasource-new-1.png)

Beri nama Sample di kolom Data Source Name, kemudian klik Finish.

Dari datasource yang ada, kita dapat mendefinsikan Data Set. Data Set ini adalah sebagian dari isi Data Source yang akan kita gunakan dalam report. 

[![Create Dataset ](/images/uploads/2006/09/report-dataset-new.png)](/images/uploads/2006/09/report-dataset-new.png)

Muncul pilihan datasource dan jenis data set. Kita bisa menggunakan lebih dari satu datasource dalam satu report. Untuk kali ini, cuma ada satu data source. Pilih tipe data set SQL Select Query. Jangan lupa beri nama yang deskriptif untuk dataset yang dibuat. 

[![Create Dataset ](/images/uploads/2006/09/report-dataset-new-1.png)](/images/uploads/2006/09/report-dataset-new-1.png)

Setelah kita tekan Next, akan muncul database explorer di panel kiri, dan SQL editor di kanan. Kita dapat melakukan drag and drop pada layar ini. 

[![Database Explorer ](/images/uploads/2006/09/report-dataset-new-2.png)](/images/uploads/2006/09/report-dataset-new-2.png)

Edit SQL menjadi seperti ini: 

    select * 
    from

Kemudian drag-and-drop tabel Customer ke sebelah kanan _from_, sehingga kodenya menjadi seperti ini:

    select * 
    from CLASSICMODELS.CUSTOMERS
    
Klik Next. Selanjutnya muncul Data Set Editor. 

[![DataSet Editor ](/images/uploads/2006/09/report-dataset-new-3.png)](/images/uploads/2006/09/report-dataset-new-3.png)

Kita tidak melakukan perubahan apa-apa di sini. Tapi bila ingin tahu apa isi tabelnya, kita dapat melihat _Preview Result_ seperti ini:

[![Preview DataSet ](/images/uploads/2006/09/report-dataset-new-4.png)](/images/uploads/2006/09/report-dataset-new-4.png)

Klik OK. Dataset siap digunakan. 

Selanjutnya, kita akan tampilkan data pelanggan dalam bentuk tabel. Pilih Table di Pallete, dan letakkan di report. Kita akan tampilkan 4 kolom dan 1 baris detail. Kolom yang nantinya akan ditampilkan adalah:

1. Provinsi
2. Kota
3. Nama Pelanggan
4. Nomer Telepon

Tampilan yang dihasilkan adalah seperti ini:

[![Initial Table ](/images/uploads/2006/09/report-table-1.png)](/images/uploads/2006/09/report-table-1.png)

Dari seluruh data pelanggan yang ada, kita akan kelompokkan berdasarkan provinsi, kemudian kota. Untuk itu, kita tambahkan Group di tabel. Caranya, klik tombol pemilih tabel, kemudian klik kanan di baris detail.

[![Insert Group ](/images/uploads/2006/09/report-table-2.png)](/images/uploads/2006/09/report-table-2.png)

Group Editor akan muncul. Beri nama State, kemudian klik OK. 

[![Group Editor ](/images/uploads/2006/09/report-table-3.png)](/images/uploads/2006/09/report-table-3.png)

Hasilnya akan tampak seperti ini

[![Group by State ](/images/uploads/2006/09/report-table-4.png)](/images/uploads/2006/09/report-table-4.png)

Untuk mengisikan State ke Group Row tersebut, drag-and-drop dari panel kiri ke kolom _paling kiri_ di baris Group Header Row. Layar Select Data Binding akan muncul, langsung saja klik OK. 

[![State Data Binding ](/images/uploads/2006/09/report-table-5.png)](/images/uploads/2006/09/report-table-5.png)

Kita perlu memasukkan Group Row satu lagi untuk City. Caranya sama, yaitu dengan menambahkan Group Row di _bawah_ Group Header State. 

[![Insert Group Below ](/images/uploads/2006/09/report-table-6.png)](/images/uploads/2006/09/report-table-6.png)

Beri nama City, kemudian klik OK. Lalu pilih field city dari Data Explorer di sebelah kiri, dan pasang di kolom kedua di Group Header Row 2. Hasilnya seperti ini:

[![Group by City ](/images/uploads/2006/09/report-table-7.png)](/images/uploads/2006/09/report-table-7.png)

Terakhir, masukkan field CUSTOMERNAME dan PHONE ke Detail Row. Kolom judul CUSTOMERNAME kurang enak dibaca, jadi kita bisa ganti labelnya di baris paling atas menjadi Customer Name. Hasil akhirnya adalah seperti ini:

[![Final Design ](/images/uploads/2006/09/report-table-8.png)](/images/uploads/2006/09/report-table-8.png)

Report kita sudah selesai. Silahkan disave, kemudian lihat previewnya. Kalau semua dilakukan dengan benar, kita akan melihat tampilan seperti ini: 

[![Report Preview ](/images/uploads/2006/09/report-table-9.png)](/images/uploads/2006/09/report-table-9.png)

Kita akan lihat bahwa data pelanggan sudah diurutkan dan dikelompokkan berdasarkan State dan City. 

Kalau kita tekan menu _File_, kita akan menemui pilihan View Report in Web Viewer, as HTML, dan as PDF. Silahkan gunakan sesuai kebutuhan.

[![Export Format HTML PDF ](/images/uploads/2006/09/report-table-10.png)](/images/uploads/2006/09/report-table-10.png)

Selamat mencoba.

[BIRT Homepage]: http://www.eclipse.org/birt "Homepage BIRT"

[anak kambing]: http://anak.kambing.vlsm.org "Mirror Kambing"

[Tutorial BIRT]: http://www.eclipse.org/birt/phoenix/tutorial/basic/index.php "Cara penggunaan BIRT"


