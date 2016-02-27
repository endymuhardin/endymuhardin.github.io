Menggunakan Vim 

## Apa itu Vim ##

## Kenapa Vim ##

## Instalasi dan Setup ##

Berikut adalah langkah-langkah untuk menginstal Vim : 

1. Selesai

> Lho??

Ya, Vim tidak perlu diinstal. Bila Anda menggunakan varian Unix apapun, Linux (Ubuntu, Fedora, dsb), MacOS, FreeBSD, OpenBSD, semuanya sudah menginstal vim secara default. Tidak perlu instal-instal lagi.

> Bagaimana kalau saya pakai Windows?

Hmm ... tergantung kondisi keuangan. Kalau punya cukup banyak uang, beli Mac. Kalau bokek, install Ubuntu. Ini tahun 2015 man, hare gene masih mikirin virus? Ayo dong ah moveon ;p

Ahaha ... just kidding. Vim bisa diinstal di Windows dengan berbagai cara.
Rekomendasi saya adalah menggunakan Cygwin, sehingga kita juga mendapatkan
keunggulan command prompt *nix. Silahkan ikuti [tutorial
beriku](https://wilsonericn.wordpress.com/2011/08/15/cygwin-setup-gotchas/)t untuk
menginstalnya.

Perkara instalasi beres, sekarang mari masuk ke konfigurasi. Vim dikonfigurasi dengan mengedit file `.vimrc` yang ada dalam folder $HOME. Artinya, bila usernamenya `endy`, maka `$HOME` adalah `/home/endy` di Linux atau `/Users/endy` di Mac.

Ada banyak konfigurasi yang bisa kita taruh di sana, tapi kita mulai dengan yang paling basic dulu:

* syntax highlighting : untuk mewarnai kode program 
* indentasi :

    * 4 spasi, tanpa tab
    * indentasi otomatis mengikuti baris di atasnya


* Wrap (pindah baris) setelah 80 karakter. Pindah barisnya _palsu_, artinya tidak ada karakter `CR` dan `LF` yang ditambahkan, hanya tampilannya saja yang pindah baris
* Save otomatis setiap 10 detik

Berikut adalah contoh file `.vimrc` untuk konfigurasi di atas

```
" Syntax Highlighting
syntax on

" Indentasi
set expandtab
set shiftwidth=4
set softtabstop=4
autoindent

" Wrap
set tw=79
set wrap linebreak nolist

" Autosave
set updatetime=10000
autocmd CursorHold,CursorHoldI,InsertLeave * silent! wall
``` 

## Manajemen File ##

* Membuka file explorer :e.
* Membuka file dengan menggunakan plugin CtrlP. Tekan Ctrl P, kemudian ketik nama file yang mau dibuka

## Split Pane ##

todo : screenshot di sini

* :sp : horizontal split
* :vsp : vertical split
* Ctrl W + x : tukar posisi
* Ctrl W + (hjkl) : pindah kursor ke panel (kiri, bawah, atas, kanan)

## Mode Vim ##

* Command Mode
* Edit Mode
* Visual Mode

## Command Mode ##

### Memindahkan Kursor ###

* per karakter

    * h,j,k,l : kiri, bawah, atas, kanan

* per kata

    * w : satu kata ke kanan, kursor di awal kata
    * W : satu kata ke kiri, kursor di awal kata
    
* per baris

    * 5jj : 5 baris ke bawah
    * 6kk : 6 baris ke atas
    * 137G : ke baris 137

* per karakter tertentu

* per blok 

    * % : ke pasangan tanda kurung

* screen bagian atas/tengah/bawah

    * H : (high) bagian atas screen
    * M : (middle) bagian tengah screen
    * L : (low) bagian bawah screen

* scroll

    * Ctrl-U : 1/2 Page Up
    * Ctrl-D : 1/2 Page Down
    * Ctrl-B : Page Up
    * Ctrl-F : Page Down

* awal/akhir file

    * gg : awal file
    * G : akhir file

### Marking ###

Mark adalah menandai bagian tertentu dalam file, supaya kita mudah untuk pindah-pindah dalam file.

* set mark dengan nama `a` `ma`
* pindah ke baris tempat mark `a` berada `'a`
* pindah ke posisi (baris dan kolom) tempat mark `a` berada `\`a`
* hapus dari posisi kursor sampai baris tempat mark `a` berada `d'a`
* menampilkan semua mark `:marks`
* menghapus semua mark pada file yang sedang aktif `:delmarks!`
* menghapus semua mark di semua file (berikut semua history) : hapus file `~/.viminfo`

Mark yang sudah ada secara built-in

* `\`.` : posisi edit terakhir dalam file yang sedang dibuka
* `\`0` : posisi edit terakhir dalam file yang terakhir dibuka
* `''` : pindahkan kursor ke posisi terakhir sebelum pindah mark


### Cut, Copy, Paste, Delete ###

* cut d<motion>. Misalnya dw
* copy y<motion>
* paste setelahnya p
* paste sebelumnya P
* copy ke register (clipboardnya vim) x "xy<motion>
* paste dari register x "xp
* melihat daftar register :reg
* pindahkan baris 4 - 6 ke baris 12 :4,6m12
* copy baris 7-10 ke 5 baris dibawahnya : 7,10t+5
* pindahkan baris 12 ke posisi kursor :12m.
* hapus sampai ketemu karakter & dt& (karakter & tidak dihapus) atau df& (karakter & ikut dihapus) 
* hapus 10 karakter berikutnya d9l
* hapus 3 baris di posisi kursor dan di bawahnya 3dd
* copy ke clipboard system

    * MacOSX 
    
        * copy baris kursor :.!pbcopy
        * copy baris 4-10 :4,10!pbcopy

    * Linux

        * copy baris kursor "*yy
        * copy baris 4-10 "*4,10y

* paste dari clipboard system (misalnya copy dari browser, paste ke vim) 

    * Linux : "*p
    * MacOSX :r !pbpaste "Paste clipboard content to current line

### Save, Open, Close ###

* save :w
* open :edit /path/ke/file
* close :q
* reload file (bila diedit di luar vim) :e

### Find dan Replace ###

Mengganti huruf dan kata satu persatu

* mengganti satu huruf : r
* mengganti satu kata : cw
* mengganti isi tanda kurung : ci( ci{ ci[ atau ci) ci} ci]
* mengganti isi tag : cit

Mencari kata dalam dokumen

* mencari kata : /kata-yang-mau-dicari
* mencari kata yang sama, selanjutnya : n
* mencari kata yang sama, sebelumnya : N

Mengganti kata dalam dokumen
* mengganti kata foo dengan bar dalam satu file : %s/foo/bar/g
* mengganti kata foo dengan bar dalam satu file (konfirmasi dulu) :
* %s/foo/bar/gc
* mengganti kata foo dengan bar dalam satu baris : s/foo/bar/g
* mengganti kata foo dengan bar dalam satu baris (case insensitive): s/foo/bar/g


## Edit Mode ##

* insert : i
* append : a
* insert di atas baris : O
* append di bawah baris : o
* undo : u

# Manajemen Plugin #

Pilihan sistem manajemen plugin

Vundle

Sparkup

Eclim

Plugin-plugin yang saya gunakan

## Lain-lain ##

* Git commit error. Set editor menjadi `/usr/bin/vim` dengan command `git config --global core.editor /usr/bin/vim`

## Referensi ##
* http://www.lucianofiandesio.com/vim-configuration-for-happy-java-coding
* http://naildrivin5.com/blog/2013/04/24/how-to-switch-to-vim.html
* http://stevelosh.com/blog/2010/09/coming-home-to-vim/
* http://dougblack.io/words/a-good-vimrc.html
* http://www.viemu.com/a_vi_vim_graphical_cheat_sheet_tutorial.html
* http://www.viemu.com/a-why-vi-vim.html
* http://www.glump.net/files/2012/08/vi-vim-cheat-sheet-and-tutorial.pdf
* http://vim.wikia.com/wiki/Ranges
