---
layout: post
title: "Waterfall is The Best"
date: 2014-10-14 20:45
comments: true
categories: 
- manajemen
---

Di berbagai komunitas Agile, metodologi waterfall merupakan bulan-bulanan dan wajib untuk dibully. Jangankan bilang waterfall itu bagus, coba katakan `Ada beberapa situasi di mana waterfall bisa dijalankan`. Saya jamin 1000% Anda akan segera dibully seperti layaknya pendukung Justin Bieber hadir di konser Metallica.

Kalau ada satu hal penting yang saya dapatkan dari belasan tahun berkecimpung di dunia IT adalah ini

> Banyak jargon, metodologi, framework, library, teknologi datang dan pergi setiap saat. Untuk tiap pilihan yang kita buat, ada biaya yang menyertainya. Yaitu waktu dan tenaga yang kita investasikan untuk mempelajari dan mengadopsi pilihan tersebut. Kunci agar kita bisa memilih hal yang tepat sehingga imbal hasil pilihan kita lebih besar dari biayanya adalah, gunakan akal sehat dan jangan gampang terbuai jargon dan marketing gimmick.

Prinsip akal sehat tersebut telah menyelamatkan saya dari berbagai teknologi gagal di masa lalu seperti misalnya:

* Struts 1
* EJB 1 dan 2
* XA Transaction
* JMS
* dan lain sebagainya

Teknologi gagal bukan artinya teknologi tersebut tidak inovatif atau kurang canggih. Tapi biaya implementasinya jauh melebihi benefit yang diperoleh darinya.

Nah, kali ini dimana orang-orang 'agile' sibuk membully Waterfall, saya punya pendapat yang berbeda.

> Waterfall justru adalah cara paling alami untuk membuat software

Wah kok bisa begitu?

<!--more-->

Sebelum kita bahas lebih lanjut, kita jelaskan dulu. Apa itu waterfall?

Yang senang nonton Youtube, silahkan langsung simak video berikut

<div class="video"><figure><iframe width="640" height="480" src="//www.youtube.com/embed/X1c2--sP3o0?rel=0" frameborder="0" allowfullscreen></iframe></figure></div>

Buat yang gak paham bahasa bule, baiklah saya ceritakan saja.

Waterfall adalah siklus pembuatan aplikasi (software development lifecycle) yang diperkenalkan oleh Winston Royce pada tahun 1970. Siklus ini terdiri dari beberapa tahap yaitu:

1. Requirement Specification
2. Design
3. Implementation (kita menyebutnya coding)
4. Testing
5. Production / Go Live / Operation (aplikasi dipakai di kehidupan nyata)

Sekilas, siklus ini terlihat sederhana dan logis. Sehingga banyak orang langsung menganggapnya solusi terhebat.

Seperti segala macam hal di dunia ini, tidak ada yang sempurna. Semua hal ada plus minusnya, termasuk siklus waterfall. Ini sebetulnya sudah dijelaskan juga oleh Opa Winston. Tapi apa lacur, metodologi ini sudah terlanjur dijual oleh para konsultan manajemen sebagai obat kuat tanpa tandingan. Dan seperti dagangan konsultan manajemen lainnya, segera dibumbui dengan berbagai jargon, success story, dan marketing gimmick lainnya sehingga terlihat canggih, mampu mengatasi global warming, kelaparan di Afrika, mendatangkan perdamaian di Timur Tengah, bahkan menyembuhkan kanker dan AIDS.

Ironisnya, gerombolan konsultan manajemen ini pula yang sekarang membully waterfall habis-habisan.

Oke, cukup belajar sejarah, sekarang kita kembali ke akal sehat.

## Apa bagusnya waterfall ? ##

Sebetulnya, siklus waterfall merupakan hukum alam dalam pembuatan software. Membantah waterfall sama saja dengan mengatakan air mengalir ke atas.

Tidak percaya? Mari kita telusuri satu per satu

### Requirement Specification ###

Coba sekarang saya ketemu Anda, trus saya bilang

> Ayo mulai coding !!

Apakah Anda bisa mulai coding? Tentu tidak bisa. Mau coding apa? Aplikasi perpustakaan? Aplikasi payroll? Social media? Kan harus ditentukan dulu.

Oke, saya kasi petunjuk. Aplikasi social media. Apakah sekarang bisa mulai coding?

Tentu belum. Social media seperti apa? Relationship-based (ala facebook), location-based (ala foursquare), photo-based (ala flickr dan instagram), atau apa?

> Oh ternyata perlu dijelaskan ya apa yang mau dibuat?

Nah ini namanya fase requirement specification.

Beberapa orang akan langsung komentar.

> Wah, bikin dokumen tebel dong. Apa dibaca? Kalau ada perubahan gimana? Apakah ada business valuenya?

Ini mitos. Spesifikasi requirement gak harus berupa dokumen 300 halaman. Bisa berupa [UI Mockup](http://software.endy.muhardin.com/manajemen/prototyping/).

Justru intinya proses requirement adalah supaya user bisa menjelaskan maksudnya pada programmer. Kalau ternyata tidak ditangkap dengan baik, ya tentu penjelasannya harus diperbaiki sampai kedua pihak benar-benar sepaham.

> Apakah selalu harus melalui proses requirement?

Tidak harus, kalau softwarenya kita buat sendiri untuk dipakai sendiri. Misalnya saya mau buka toko, butuh aplikasi. Lalu saya coding sendiri. Dalam kasus ini, tidak perlu proses requirement. Nanti dikira gila, masa programmernya (saya) minta dijelaskan sama usernya (saya juga)?

Tapi pada kenyataannya, user dan programmer biasanya beda orang. Jadi ya tentu harus dijelaskan dong.

Jadi, ternyata Opa Winston benar. Sebelum coding ya requirement dulu dong. Wajib hukumnya. Gak ada requirement, gak bisa mulai coding. Setelah selesai coding, masa iya perlu requirement?

### Design ###

> Apakah wajib melakukan proses desain?

Tergantung dua hal:

1. Seberapa kompleks aplikasi yang dibuat?
2. Berapa orang yang terlibat?

Untuk aplikasi 2-3 tabel database, kalau saya kerjakan sendiri, biasanya saya langsung coding. Sebenarnya ada juga saya merenungkan skema database dan mau ditaruh di class mana method dan property. Tapi karena saya sendiri yang coding, tabelnya juga cuma sedikit, yang terlihat dari luar ya saya langsung mengetik kode program.

Kalau aplikasinya besar, tidak mungkin semua saya simpan di kepala sendiri. Harus saya tulis. Selain itu, bikin software mirip main catur. Satu langkah bidak harus kita hitung konsekuensinya beberapa langkah ke depan. Pilih teknologi apa, desktop atau web, berapa layer, berapa modul, bagaimana integrasi antar modul, dan sebagainya. Proses mengidentifikasi alternatif solusi, kemudian memilih salah satunya, ini disebut desain aplikasi.

Contoh kasus, salah satu produk ArtiVisi adalah aplikasi pembayaran tagihan. Aplikasi tersebut bisa melunasi tagihan listrik, telepon, cicilan, beli pulsa listrik, pulsa handphone, dan sebagainya. Jenis produk datang dan pergi. Format cetakan struk berubah-ubah sesuai ketentuan bank. Nah tentu kita harus pikirkan bagaimana supaya aplikasinya mudah beradaptasi kalau ada produk baru, perubahan cetakan struk, dan berbagai perkembangan bisnis lainnya. Segala hal ini namanya proses desain software.

> Faktor kedua, siapa yang akan coding?

Masa saya semua? Kalau saya yang coding semua kapan lagi saya sempat menulis blog untuk Anda semua :D Belum lagi jadwal [syuting Youtube](https://www.youtube.com/watch?v=A3sM9ePaBvw&list=PL9oC_cq7OYbxjvQd8_isrxi8RxVmHXjZJ). Asal tau saja, jadi seleb internet cukup menyita waktu :P

Oke, jadi perlu dibantu orang lain untuk coding. Dengan demikian saya perlu jelaskan di mana harus menaruh template struk, bagaimana skema database, dan berbagai hal lainnya. Sekarang saya wajib membuat dokumen desain.

> Kenapa gak dijelaskan aja desainnya? Repot-repot bikin dokumen, nanti juga berubah lagi.

Mendingan mana, saya tulis sekali dengan resiko bakalan berubah, atau gak saya tulis trus programmernya cuti/sakit/resign/melahirkan dan saya harus jelaskan lagi setiap kali ganti orang?

Oke Opa Winston, saya harus desain dan bikin dokumennya. Kecuali aplikasinya buat saya, yang desain saya, yang coding saya, yang mau pake saya juga.

Kapan kita bisa desain? Tentu setelah requirement. Dan juga pastinya sebelum coding.

> Apakah desain bisa tidak dikerjakan?

Bisa saja langsung coding. Tapi gini, semua programmer yang pernah [bikin aplikasi production](http://software.endy.muhardin.com/manajemen/aplikasi-prakarya-vs-aplikasi-production/) pasti tau fakta ini

> Aplikasi production tidak sekedar semua fitur ada. Tapi juga siap dideploy di berbagai environment, kebal menerima data invalid, punya pesan error yang informatif, performancenya acceptable, bisa menangani load tinggi, aman dari berbagai serangan, mudah dimaintenance (backup, archive, offline, monitoring), dan berbagai hal lainnya.

Artinya untuk tiap fitur, kita harus :

* tes
* buatkan validasinya
* buatkan pesan errornya
* buatkan log file yang bagus
* ukur performancenya
* lihat apa yang terjadi kalau dihajar request tinggi
* dsb

> Bagaimana kalau kita sudah implement semua kebutuhan aplikasi production, ternyata kita baru sadar bahwa skema database kita kurang optimal?

Nah, selamat bekerja mengulang semua kelengkapan production di atas :D

> Ampun Opa Winston. Anda benar, requirement dulu, trus desain, baru deh coding. Untuk testing, jangan diomelin lagi, saya udah baca [serial ruthless testing di blog Om Endy](https://www.google.com/search?q=site%3Asoftware.endy.muhardin.com&q=ruthless+testing&gws_rd=ssl).

Lalu, kalau si Opa benar, kenapa waterfall dibully?

## Kesalahan dalam implementasi Waterfall ##

Sebenarnya Opa Winston juga sudah menjelaskan bahwa ada resiko dalam penggunaan waterfall. Ini juga sudah dibahas Agan Steve McConnell dalam bukunya Rapid Development. Singkatnya kira-kira begini

> Jangan gunakan waterfall satu siklus kalau projectnya besar.

Jadi kalau misalnya kita bikin aplikasi ERP, terdiri dari modul akunting, procurement, inventory, manufacture, sales, tax, dan lain sebagainya, jangan dikerjakan sekali pukul satu kali requirement satu kali desain, satu kali coding.

Kenapa gak boleh sekali pukul? Karena aplikasinya sangat besar, requirementnya bisa makan waktu 4 bulan. Nanti desainnya 2 bulan lagi. Total sudah 6 bulan dan belum juga mulai menginstall Netbeans. 

Di pertengahan tahun biasanya manajemen rapat untuk evaluasi bisnis. Ternyata sales gak masuk target. Ada revisi program penjualan, tadinya minta diskon harus ke direktur, sekarang cukup ke kepala cabang.

Nah, belum sempat nulis `Hello World`, requirement sudah berubah. Revisi requirement, revisi desain, makan waktu 3 bulan. Menjelang akhir tahun, manajemen rapat lagi, proses bisnis berubah lagi. Trus kapan kita mau mulai coding `Hello World`?

Fenomena seperti ini yang bikin waterfall dibully. Padahal balik ke premis awal, ya akal sehat dipakai dong. Masa 6 bulan dokumentasi doang belum nulis kode program satu barispun? Emangnya situ programmer atau pegawai kelurahan?

> Bagaimana solusinya?

Ini sebetulnya juga sudah dijelaskan oleh Opa Winston. Ya di tahun 1970 itu juga barengan sambil menjelaskan waterfall. Agan Steve juga udah menjelaskan di [Rapid Development](http://www.stevemcconnell.com/rdcntnt.htm). Yang optimal itu begini

> Requirement menyeluruh dilakukan terhadap seluruh aplikasi, tapi global saja. Tujuannya supaya bisa membagi modul-modul dan mendapatkan gambaran bagaimana nanti integrasinya. Setelah itu, bagi per modul. Tiap modul lakukan mini-waterfall sampai selesai modul per modul. Nanti tiap beberapa modul selesai, ada lagi iterasi untuk proses integrasi antar modul.

Cara seperti ini oleh Agan Steve disebut dengan siklus `Staged Delivery`. Walaupun namanya keren dan terlihat beda, tapi ya sebenarnya menurut saya ini sama saja dengan `Waterfall dengan Akal Sehat`. Yaitu memecah aplikasi besar menjadi modul-modul, dimana masing-masing modul dikerjakan dengan waterfall juga. Dan tidak ada juga yang melarang modul-modul ini dikerjakan secara paralel. 

Bahkan Agan Steve bilang, gak semuanya harus dibikin sendiri. Kalau misalnya aplikasi akunting udah ada yang jual (Commercial Off The Self - COTS) ya beli aja daripada ribet-ribet bikin sendiri. Malahan ada beberapa perusahaan yang kerjanya beli-beli doang, digabungin, trus dijual. Sampai sempat-sempatnya dia bikin nama keren buat dirinya sendiri, yaitu `System Integrator`.

## Kesimpulan ##

Di dunia IT, banyak sekali pilihan. Mulai dari bahasa pemrograman, framework, metodologi, macam-macam. Kita harus pintar-pintar memilih dan tidak gampang terbuai bujuk rayu konsultan. Caranya gampang saja, gunakan akal sehat.

Jadi kalau lain kali ada yang menganjurkan dua programmer komputernya satu aja gantian, renungkan dengan akal sehat. Apakah gak sebaiknya sekalian dibeliin perlengkapan fitness? Jadi pas project selesai, programmernya punya perut sixpack.

[![Foto](https://lh3.googleusercontent.com/-kWEJAXJQqiY/U01NMQkQ7_I/AAAAAAAAFp0/099uScfrhP0/w768-h576-no/rambo-wallpaper-800x600.jpg)](https://lh3.googleusercontent.com/-kWEJAXJQqiY/U01NMQkQ7_I/AAAAAAAAFp0/099uScfrhP0/w768-h576-no/rambo-wallpaper-800x600.jpg)

_Fotonya Rambo diambil [dari sini](http://wallpaperswide.com/rambo-wallpapers.html)_
