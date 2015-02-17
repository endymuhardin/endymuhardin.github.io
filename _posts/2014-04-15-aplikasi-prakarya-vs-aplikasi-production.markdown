---
layout: post
title: "Aplikasi Prakarya vs Aplikasi Production"
date: 2014-04-15 22:00
comments: true
categories: 
- manajemen
---

Salah satu pertanyaan yang sering ditanyakan di forum programmer adalah

> Saya ingin belajar bahasa pemrograman [isi bahasa yang Anda sukai di sini], bagaimana ya caranya supaya bisa mahir?

Dan jawaban saya selalu sama

> Coba buatlah aplikasi berkualitas production barang 5 - 10 kali, setelah itu insya Allah akan mahir.

Jawaban di atas memang singkat, tapi jalan untuk menuju kesana [sungguh tidak mudah dan tidak singkat](http://endy.muhardin.com/education/tahapan-belajar/). Apalagi untuk pemula, setidaknya ada dua pertanyaan besar:

1. Apa sih aplikasi production itu?
2. Bagaimana cara membuat aplikasi?

Pertanyaan pertama akan kita jawab pada artikel ini. Sedangkan pertanyaan kedua akan kita jawab pada artikel selanjutnya.

<!--more-->

Dalam siklus pembuatan aplikasi, biasanya ada beberapa tahapan rilis:

1. Development : ini adalah work in progress yang sedang dikerjakan programmer. Aplikasinya belum selesai sehingga wajar kalau banyak errornya.
2. Testing : programmer sudah mengetes bagian-bagian yang penting. Tinggal bug pada kasus-kasus dan kondisi _'ajaib'_ yang biasanya cuma bisa ditemukan oleh tester yang handal. Testing biasanya juga ada berbagai tahapan, mulai dari internal tester sampai ke tester dari client/end user.
3. Production : aplikasi sudah digunakan sehari-hari oleh end user dan berjalan lancar tanpa ada bug yang signifikan (show-stopper).

Lebih detail mengenai tahapan rilis bisa dibaca di [artikel terdahulu tentang Release Management](http://software.endy.muhardin.com/manajemen/release-management/).

Tahapan di atas biasanya dijalankan di perusahaan. Di lingkungan akademik (kampus, SMK), saya punya satu kategori lagi yang dinamakan **Aplikasi Prakarya**. Wah apa lagi tuh **Aplikasi Prakarya**??

> Aplikasi Prakarya adalah aplikasi yang cuma bisa digunakan untuk tugas kuliah ataupun skripsi. Itupun cuma bisa lulus kalau dosennya bermurah hati. Aplikasi prakarya ini tidak akan mungkin digunakan oleh end-user, walaupun daftar fiturnya sama dengan aplikasi production.

Masih belum paham? Baiklah kita coba ilustrasikan dengan cerita.

Pada suatu hari, saya menyuruh mahasiswa saya membuat aplikasi. Mereka saat ini sedang semester 4. Seperti umumnya kampus di negeri kita ini, mahasiswa semester 4 belum pernah membuat aplikasi utuh. Jam terbangnya paling hanya beberapa looping/branching atau paling maksimal beberapa function/method untuk belajar algoritma. Saya beri tugas:

> Coba buat aplikasi user management. Tidak perlu full coding, cukup UI mockup (rancangan screen) saja.

Aplikasi user management adalah aplikasi yang paling mendasar. Apapun aplikasi yang ingin kita buat, pasti ada modul ini. Fiturnya pun tidak rumit-rumit. Cukup insert-update-delete-display data user saja. Untuk menyederhanakan masalah, tidak perlulah kita buat group dan permission.

Source file UI mockup yang saya buat di artikel ini bisa diunduh [di sini](../../downloads/prakarya-production.ep) dan dibuka menggunakan [aplikasi Pencil](http://pencil.evolus.vn/).

Nah kita lihat evolusi dari aplikasi prakarya menjadi aplikasi production. Kita mulai dengan menampilkan data user.

## Menampilkan Data ##

Inilah screen daftar user yang dipresentasikan ke saya

![Foto](https://lh4.googleusercontent.com/-25Yeh5ay_RY/U01LMUEObTI/AAAAAAAAFpA/p45UmrhH9-4/w888-h408-no/tabelprakarya01.png)

> Bagaimana menurut Anda? Apakah Anda melihat ada masalah pada screen di atas? Apa masalahnya?

Masalahnya ada di jumlah data. Aplikasi prakarya biasanya dites menggunakan 1 - 5 baris data saja. Tentu saja tidak ada masalah yang terlihat kalau datanya cuma 1 - 5 baris. Nah, bagaimana kalau tidak ada data? Biasanya begini jadinya.

![Foto](https://lh3.googleusercontent.com/-mvMdRuXasxU/U01LNOysKkI/AAAAAAAAFpQ/wkv2gyBpzCs/w882-h363-no/tabelprakarya03.png)

Ini menunjukkan programmer malas. Padahal dengan menambah beberapa baris `if-else`, tampilan di atas bisa terkesan lebih _'serius'_ seperti ini

![Foto](https://lh5.googleusercontent.com/-g1HzK09B3W0/U01LOCrimhI/AAAAAAAAFpg/yXw_NJX3OIQ/w654-h306-no/tabelproduction02.png)

Ok, kita sudah handle kasus tidak ada data. Nah sekarang, pada waktu dipakai di kondisi riil, berapa datanya? Misalnya kita membuat aplikasi perpustakaan untuk kampus. Berapa jumlah anggotanya? Apakah 1-5 saja? Tentu tidak mungkin. Kisaran datanya antara ratusan sampai puluhan ribu tergantung ukuran kampus. Belum lagi kalau perpustakaannya menerima anggota masyarakat umum.

Dengan data ratusan/ribuan, screen di atas akan mengalami masalah:

* data tentu ditarik dengan query `select * from tabel_user`. Kalau satu user datanya 1KB, maka untuk 10 ribu user 10MB harus dikirim dari database server ke webserver, dan kemudian dari webserver ke browser. 
* asumsikan koneksi internet user 1 MB/s, maka dia harus menunggu 10 detik sampai daftar user bisa dia lihat. Pakai GPRS? Nah, silahkan kembali lagi besok sore ;)
* bila ada 10 concurrent user (user yang mengakses aplikasi secara bersamaan), maka kita harus siapkan bandwidth 100 MB/s di sisi server hanya untuk menampilkan daftar user.

> Lalu bagaimana solusinya?

Solusi pertama, paging. Kita bagi data menjadi beberapa halaman. Toh user juga tidak mungkin melihat 10 ribu data sekaligus. Bisa-bisa stres dia kayak caleg kalah pemilu.

![Foto](https://lh6.googleusercontent.com/-CgyzCMA-Foc/U01LMwcZhfI/AAAAAAAAFpM/8PCtzho72xA/w852-h462-no/tabelprakarya02.png)

> Selesai?

Belum. Untuk 10 ribu data, bila satu halaman isinya 20, maka ada 500 halaman. Mana ada orang mau klik satu persatu halamannya. Jadi bagaimana? Ya tentu harus bisa dicari.

![Foto](https://lh3.googleusercontent.com/-OGKJDR3nnSk/U01LN9OAzmI/AAAAAAAAFpc/Z5mYYDj-O9s/w888-h465-no/tabelproduction01.png)

Nah, dari sini kita sudah bisa membedakan antara aplikasi prakarya dan aplikasi production. Aplikasi prakarya tidak dites secara menyeluruh. Dengan 1-5 data saja sudah puas, cukuplah untuk dapat A kalau dosennya murah hati. Tapi aplikasi production tidak bisa seperti itu kalau aplikasinya mau dipakai orang. Kita harus tes dengan 0 data dan 10 ribu data.

Selanjutnya, mari kita lihat form input data.

## Entri Data ##

Inilah screen iterasi pertama

![Foto](https://lh4.googleusercontent.com/-gwFv3Yp1hMY/U01LKyx9OcI/AAAAAAAAFoo/pjiHEIjgRYc/w687-h510-no/formprakarya01.png)

> Apa masalahnya? 

Untuk input data, ada dua hal yang wajib dilakukan dengan benar:

* validasi
* menampilkan pesan kesalahan

Mari kita perbaiki. Ini hasil revisinya

![Foto](https://lh5.googleusercontent.com/-ptivii5-b3I/U01LLWa7lZI/AAAAAAAAFo0/PMTqrd83k9c/w917-h487-no/formprakarya02.png)

Sudah ada pesan error pada screen di atas. Tapi kalau berhenti sampai di sini, usernya bisa marah-marah, soalnya nilai yang sudah dia isikan hilang semua. Harusnya tetap ditampilkan, sehingga dia cukup edit yang salah saja. Tidak perlu entri ulang semuanya. Revisi lagi menjadi seperti ini

![Foto](https://lh6.googleusercontent.com/-pzWfTxTPSaY/U01LLyVPxcI/AAAAAAAAFo4/Qo19dzxO8uM/w900-h459-no/formproduction.png)

Nah, jauh lebih baik. 

Selain masalah di atas, ada beberapa hal lagi yang perlu kita perhatikan, yaitu:

* validasi server-side vs client-side
* pemilihan jenis komponen

> Mana validasi yang harus kita buat? Apakah di sisi server atau di sisi client?

Validasi yang wajib adalah di sisi server. Kita harus cek semua data yang dikirim client. Kita juga tidak boleh hanya mengandalkan validasi di sisi client, karena berada di luar kendali kita. Bisa saja JavaScript dimatikan, form input di-bypass [menggunakan aplikasi debugger](http://software.endy.muhardin.com/java/mendebug-aplikasi-ajax/), dan berbagai teknik lainnya. Baik secara sengaja, ataupun karena keterbatasan perangkat di sisi client (misalnya browsernya versi jadul).

> Kalau begitu, buat apa kita buat lagi validasi di sisi client? Buang-buang energi saja.

Validasi di sisi client tujuannya supaya user lebih nyaman. Akan lebih enak kalau setelah kursor pindah, data yang barusan diinput langsung ketahuan benar/salahnya. Daripada isi seluruh form, submit, dan ternyata ada error. Sama seperti tampilan tabel tanpa data di atas. Aplikasi yang hal-hal detailnya diurus dengan baik akan terkesan lebih profesional.

Pemilihan jenis komponen akan kita bahas pada artikel selanjutnya.

## Pesan Error ##

Kita semua tentu kenal Rambo. Dia bisa survive dimanapun dia diterjunkan dan seburuk apapun perlakuan orang kepadanya. 

![Foto](https://lh3.googleusercontent.com/-kWEJAXJQqiY/U01NMQkQ7_I/AAAAAAAAFp0/099uScfrhP0/w768-h576-no/rambo-wallpaper-800x600.jpg)

_Fotonya Rambo diambil [dari sini](http://wallpaperswide.com/rambo-wallpapers.html)_


Aplikasi production juga demikian. Apapun yang diinput user, dia bisa handle dengan baik. Harddisk penuh? Bandwidth lemot? RAM overload? Semua bisa ditangani dengan baik.

> Bagaimana caranya? Apakah aplikasi tidak boleh error?

Tentu tidak. Mana ada yang sempurna di dunia ini. Kita mengatasi kondisi buruk dengan error handling yang baik. Kalau ada sesuatu yang tidak sesuai kondisi yang dibutuhkan aplikasi, kita tampilkan pesan error yang informatif.

Mari kita lihat error handling aplikasi prakarya, ketika usernya mengetikkan alamat yang tidak ada di aplikasi.

![Foto](https://lh6.googleusercontent.com/-aZa_dcU50c4/U001E2SUhMI/AAAAAAAAFm4/x502FobAP3s/w614-h238-no/404-prakarya.png)

Nah, jelek sekali bukan? Sangat menunjukkan kemalasan programmernya. Padahal dengan beberapa baris tambahan (di Java cuma 4 baris saja), kita bisa buat yang lebih baik seperti ini

![Foto](https://lh6.googleusercontent.com/-o_w5mMRrh1Q/U001mWLAvAI/AAAAAAAAFnI/lS3c42pYdWc/w616-h465-no/404-production.png)

Waktu yang dibutuhkan tidak lama. Maksimal 5 menit saja. Itupun lama karena kita bimbang apakah mau pakai gambar kucing atau Peter Parker.

Nah kalau pesan error di atas hanya sebatas faktor estetika, pesan error berikut konsekuensinya lebih fatal

![Foto](https://lh3.googleusercontent.com/-YbMALc355TM/U001Gd2IjAI/AAAAAAAAFnA/6tanv9Q5u8I/w621-h350-no/500-prakarya.png)

> Kenapa fatal?

Karena dari pesan error di atas, pemirsa bisa mengetahui:

* cara menimbulkan error di atas. Tentu dia ingat langkah-langkah yang dia lakukan sehingga terjadi error seperti di atas.
* bahasa pemrograman yang digunakan, yaitu Java. Dilihat dari model stacktracenya.
* merek dan versi application server yang digunakan, yaitu Tomcat 6.0.29.
* lokasi akurat dari kode program yang error, yaitu class `ErrorServlet` yang berada dalam package `com.muhardin.endy.servlet` di baris `12`.
* penyebab error, yaitu `IllegalStateException`.
* estimasi cara kerja program pada waktu error

Informasi di atas cukup sebagai titik awal cracker yang akan menjebol aplikasi kita. Dengan informasi tersebut, dia tinggal google:

* bug yang ada di Tomcat versi 6.0.29.
* cara mengeksploitasi bug tersebut

Nah, cukup mengerikan bukan? Padahal cukup dengan tambahan 4 baris, kita bisa ganti pesan errornya seperti ini

![Foto](https://lh4.googleusercontent.com/-JoVmx6mjuNg/U00184vMCTI/AAAAAAAAFnk/PpyXQXOqAyU/w619-h372-no/500-production.png)

Screen di atas akan sangat mengurangi informasi yang bisa disalahgunakan orang yang berniat jahat. Lagipula pesan error `IllegalStateException` tidak ada gunanya buat user. Error 500 artinya tidak ada perbaikan yang bisa dilakukan end-user. Beda dengan error validasi input dimana user bisa memperbaiki isiannya dan kemudian mencoba submit lagi.

## Pesan Moral ##

Perbedaan antara aplikasi prakarya dan production sudah dibahas dalam [buku legendaris `The Mythical Man Month` karya Fred Brooks](http://en.wikipedia.org/wiki/The_Mythical_Man-Month). Berikut saya kutipkan satu paragraf dari bab pertama

> Moving down across the horizontal boundary, a program
becomes a programming product. This is a program that can be run, 
tested, repaired, and extended by anybody. It is usable in many
operating environments, for many sets of data. 
To become a generally usable programming product, 
a program must be written in a
generalized fashion. In particular the range and form of inputs
must be generalized as much as the basic algorithm will reasonably
allow. Then the program must be thoroughly tested, so that it can
be depended upon. This means that a substantial bank of test
cases, exploring the input range and probing its boundaries, must
be prepared, run, and recorded. Finally, promotion of a program
to a programming product requires its thorough documentation, so
that anyone may use it, fix it, and extend it. As a rule of thumb,
I estimate that a programming product costs at least three times as
much as a debugged program with the same function.

Dari paparan Eyang Fred di atas, kita bisa mendapatkan beberapa poin penting:

* membuat aplikasi production biayanya 3x lipat dibandingkan membuat aplikasi prakarya
* aplikasi production dapat dipakai di berbagai kondisi (operating environment)
* aplikasi production dapat menangani data dalam jumlah besar (many sets of data)
* aplikasi production dites secara menyeluruh (thoroughly tested)
* tidak hanya urusan coding saja, untuk naik kelas ke kasta production aplikasi juga harus dilengkapi dokumentasi yang lengkap

Jadi, untuk set fitur yang sama:

* tambah user
* edit user
* hapus user
* tampilkan data user

terdapat perbedaan kualitas yang signifikan antara level prakarya dan level production. Kalau aplikasi prakarya dibuat dalam waktu 1 bulan, maka untuk membuatnya berkualitas production butuh tambahan 2 bulan lagi.

Tapi untungnya, untuk naik kelas dari prakarya menjadi production syaratnya tidak sulit, sederhana saja yaitu:

> Jangan malas
