---
layout: post
title: "Membuat dokumen dengan Markdown dan Pandoc"
date: 2012-09-05 11:53
comments: true
categories: 
- aplikasi
---

Sudah lama saya mencari format yang tepat untuk membuat dokumentasi. Baik untuk menulis ebook, user manual, modul pelatihan, dan berbagai keperluan penulisan lainnya. Beberapa fitur yang saya inginkan antara lain:

1. berbentuk text file biasa. Dengan menggunakan format text file biasa, ada beberapa keuntungan yang bisa diambil:
   + Bisa dikelola di version control seperti Git atau Subversion
   + Bisa diedit di komputer, handphone, ataupun tablet
   + Ukurannya kecil, sehingga memudahkan penyimpanan di cloud storage seperti Dropbox
2. Bisa dikonversi ke format lain, terutama pdf
3. Mudah dipahami
4. Bisa diwarnai dengan syntax highlighting
5. Bisa autocomplete

Dari empat fitur di atas, yang wajib cuma yang pertama dan kedua saja. Fitur lainnya bersifat _nice to have_, ada syukur, gak ada juga tidak terlalu masalah.

<!--more-->

Setelah google kesana-kemari, ada dua format yang kira-kira memenuhi syarat di atas, yaitu [Markdown](http://en.wikipedia.org/wiki/Markdown) dan [Docbook](http://en.wikipedia.org/wiki/DocBook). Dua-duanya mudah dipahami. Walaupun demikian, format Markdown lebih mudah diedit, karena menggunakan markup yang enak dilihat mata. Sedangkan Docbook menggunakan format XML, selain kurang WYSYWIG, juga bikin capek kelingking karena harus mengetik kurung siku terus menerus. Kurung siku ini juga menyulitkan kalau kita mengetik di handphone atau tablet. 

Jadi, disimpulkan kita akan menggunakan format Markdown saja. Ini juga sejalan dengan aplikasi yang saya gunakan untuk menulis blog, yaitu [Octopress](http://octopress.org/). Untuk melihat bagaimana tampilan file markdown, silahkan unduh [file contoh yang saya gunakan di bawah](https://raw.github.com/endymuhardin/belajar-pandoc/master/01-akses-database-spring-25.md), kemudian buka dengan text editor primitif seperti Notepad atau Gedit.

Setelah dokumen ditulis, kita bisa melakukan konversi dengan menggunakan aplikasi bernama [Pandoc](http://johnmacfarlane.net/pandoc/index.html). Pandoc ini adalah aplikasi yang dibuat oleh [John MacFarlane](http://johnmacfarlane.net/), seorang profesor filosofi di University of California, Berkeley. Pandoc dibuat dengan bahasa pemrograman [Haskell](http://en.wikipedia.org/wiki/Haskell_(programming_language)).

# Instalasi Pandoc #

Di Ubuntu, instalasinya tidak sulit, cukup jalankan perintah berikut:

`sudo apt-get install pandoc texlive-latex-base texlive-xetex latex-beamer`

Instalasi untuk Windows saya tidak tahu dan juga tidak berminat untuk cari tahu. Silahkan baca [petunjuk instalasi](http://johnmacfarlane.net/pandoc/installing.html).

# Cara Pemakaian #

Cara pakainya tidak sulit, cukup dengan perintah sederhana seperti ini:

`pandoc -o hasil.pdf input.md`

File `input.md` adalah tulisan kita dalam format markdown, sedangkan opsi `-o hasil.pdf` menunjukkan file output yang ingin dihasilkan. Pandoc cukup cerdas untuk mengetahui format output yang diinginkan dengan melihat ekstensi di nama file. Jadi, kalau kita berikan opsi `-o hasil.html`, dia akan mengkonversi tulisan kita menjadi file HTML.

Lebih jauh tentang cara pemakaian Pandoc bisa dilihat di [user manualnya](http://johnmacfarlane.net/pandoc/README.html). Selain itu, kita juga bisa melihat [berbagai contoh pemakaian Pandoc](http://johnmacfarlane.net/pandoc/demos.html) di websitenya. Beberapa contoh yang menarik diantaranya adalah cara menghasilkan slide presentasi dengan format HTML, yaitu di contoh nomer 16. 

# Customization #

Untuk kebutuhan modul pelatihan ArtiVisi, tentu kita membutuhkan sedikit penyesuaian, yaitu:

* font serif diganti menjadi Droid Serif. Font serif ini biasa digunakan untuk paragraf.
* font sans diganti menjadi Droid Sans. Font sans biasa digunakan untuk judul.
* font monospace diganti menjadi Inconsolata. Font monospace biasa digunakan untuk contoh kode program.
* cover depan. Pandoc secara default tidak membuatkan cover depan. Kita perlu membuat template cover sendiri.

Penyesuaian di atas dilakukan dengan cara membuat template dokumen. Template ini berbeda-beda tergantung jenis output yang akan dihasilkan.

## Template Open Office ##
Untuk membuat template dokumen Open Office, berikut langkah-langkahnya:

1. Generate dulu dokumen Open Office dengan perintah `pandoc -o hasil.odt input.md`
2. Buka `hasil.odt` dengan Open Office.
3. Edit masing-masing style yang digunakan, misalnya TextBody, PreformattedText, dsb.
4. Simpan dokumen tersebut, dan rename menjadi `template.odt`
5. Generate lagi dokumen Open Office menggunakan template tersebut dengan perintah `pandoc --reference-odt=template.odt -o hasil.odt input.md`

Cara ini saya dapatkan dari [tutorial ini](http://maketecheasier.com/use-pandoc-convert-text-to-ebook/2012/09/01).

## Template PDF ##
Pandoc menghasilkan dokumen PDF secara dua tahap. Tahap pertama adalah konversi dari `Markdown` menjadi `LaTeX`. Kemudian dari format `LaTeX` akan dikonversi lagi menjadi `PDF`. Perlu diperhatikan, yang dimaksud `LaTeX` di sini adalah format penulisan dokumen, bukan bahan baku pembuatan alat kontrasepsi.

Dengan demikian, untuk menyesuaikan output PDF, kita perlu membuat template `LaTeX`. Prof John sudah memberi tahu cara pakai template di contoh nomer 14. Di situ kita bisa mengunduh [contoh template](http://johnmacfarlane.net/pandoc/demo/mytemplate.tex) yang dia gunakan. Contoh template ini akan menjadi titik awal kita untuk melakukan penyesuaian.

Di contoh template tersebut, beliau sudah memasang font yang bisa dicustomize melalui opsi `--variable`. Yang kurang adalah halaman sampul (cover page). Saya menemukan [daftar template cover yang siap pakai](http://www.latextemplates.com/), dan juga [tutorial cara mendesain cover sendiri](http://en.wikibooks.org/wiki/LaTeX/Title_Creation). Untuk penyesuaian lebih lanjut, kita bisa berpedoman pada [dokumentasi perintah Latex](http://en.wikibooks.org/wiki/LaTeX/Command_Glossary).

Setelah template selesai dibuat, kita bisa langsung gunakan dengan perintah sebagai berikut:

``` sh
pandoc --template artivisi-template.tex  --variable mainfont="Droid Serif" --variable sansfont="Droid Sans" --variable fontsize=12pt --variable version=1.0 --variable subtitle="Mengakses database menggunakan Spring-JDBC" --latex-engine=xelatex --toc -N -o hasil.pdf *md
```

Anda bisa melihat [file PDF yang dihasilkan](https://raw.github.com/endymuhardin/belajar-pandoc/master/output/coba.pdf), [file markdown untuk cover](https://raw.github.com/endymuhardin/belajar-pandoc/master/00-cover.md), [file markdown isi artikel](https://raw.github.com/endymuhardin/belajar-pandoc/master/01-akses-database-spring-25.md), dan [template LaTeX yang digunakan](https://raw.github.com/endymuhardin/belajar-pandoc/master/artivisi-template.tex). Atau bisa juga unduh [file zip](https://nodeload.github.com/endymuhardin/belajar-pandoc/zipball/master) yang berisi semua file yang dibutuhkan untuk menjalankan perintah di atas.

# Kesimpulan #

Dengan menggunakan format berbasis text, kita bisa memperoleh keuntungan sebagai berikut:

* bisa diedit menggunakan aplikasi apa saja, termasuk Notepad
* bisa dikelola menggunakan aplikasi version control
* bisa diedit kapan saja dan di mana saja (menggunakan Dropbox) dengan device apa saja (handphone, tablet, komputer)
* penulis bisa lebih fokus pada isi artikel, tidak memusingkan urusan formatting seperti besar kecil huruf, jenis font, penomoran bab, dan hal-hal lain yang bersifat tampilan

Aplikasi pandoc bisa digunakan untuk mengkonversi berbagai format file seperti Markdown, Docbook, LaTeX, dan sebagainya menjadi berbagai format seperti PDF, HTML, Open Office, Microsoft Word, dan sebagainya.
