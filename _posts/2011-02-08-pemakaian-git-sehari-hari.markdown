---
comments: true
date: 2011-02-08 09:02:29
layout: post
slug: pemakaian-git-sehari-hari
title: Pemakaian Git sehari-hari
wordpress_id: 647
categories:
- aplikasi
---

Pada artikel ini, kita akan mengulas secara singkat perintah-perintah yang sering kita gunakan dalam Git. Tapi sebelum mulai, perlu kita pahami beberapa istilah sebagai berikut:





  * diff : perbedaan antara satu file dengan file lain
biasanya diff dilakukan terhadap satu file yang sudah berubah isinya


  * changeset : kumpulan diff


  * working folder : folder kerja kita, berisi file yang (mungkin) sudah berubah sejak commit terakhir


  * staging : tempat persiapan changeset yang akan dicommit


  * commit : snapshot dari posisi folder dan file pada waktu tertentu


  * tip : commit paling ujung


  * head : nama lain tip


  * branch : head yang diberi nama 


  * HEAD : head yang sedang aktif


  * merge : menggabungkan lebih dari satu commit







## Membuat Repository


Untuk bisa mulai bekerja, kita harus memiliki repository dulu. Ada dua kemungkinan, kita membuat repository baru, atau kita membuat clone dari repository yang sudah ada. 








Keterangan					|Perintah
------------------------------------------------|----------------------------
membuat repository baru				|git init
membuat repository baru di folder project-baru 	|git init project-baru
membuat repository untuk dishare		|git init --bare project-baru
copy repository lain				|git clone repo-url








pilihan format URL



file:///path/ke/repo : clone dari folder lokal  

/path/ke/repo : clone dari folder lokal, menggunakan hard link  

http://server/path/ke/repo : clone melalui protokol http  

username@server:path/ke/repo : clone melalui protokol ssh  









## Bekerja dengan Git


Berikut ini adalah perintah yang dilakukan selama sesi coding.








Keterangan													  	|  Perintah
------------------------------------------------------------------------------------------------------------------------|-----------------------------------------
Menambah file baru													|  git add namafile
Menghapus file														|  git rm namafile
Memasukkan perubahan di satu file ke staging area									|  git add namafile
memasukkan semua perubahan												|  git add . 
memilih potongan kode yang akan dimasukkan										|  git add -p
memasukkan perubahan ke staging menggunakan menu									|  git add -i
melihat status perubahan file, mana yang masih di working dan mana yang sudah di staging				|  git status
mengeluarkan perubahan dari staging area										|  git reset -- namafile
melihat perubahan yang belum dimasukkan ke staging area									|  git diff
melihat perubahan yang akan dicommit (sudah ada di staging area)							|  git diff --staged
melihat perubahan antara working folder dan commit terakhir								|  git diff HEAD
melihat file mana saja yang berubah											|  git diff --name-status abc123..def456
melakukan commit, editor akan diaktifkan untuk mengisi keterangan							|  git commit
melakukan commit, langsung mengisi keterangan										|  git commit -m "langsung isi keterangan di sini"
commit langsung semua perubahan, tanpa melalui staging									|  git commit -a
melihat commit history													|  git log
log lima commit terakhir												|  git log -5
log hanya menampilkan summary												|  git log --oneline
tampilkan commit summary dari semua branch dengan graph hubungan antar commit						|  git log --oneline --all --graph
membuat commit baru yang berkebalikan dengan (undo) commit terakhir							|  git revert HEAD
undo 2 commit terakhir													|  git revert HEAD~2
memindahkan HEAD ke commit-id yang diminta, staging disamakan dengan HEAD, working tetap seperti semula.   
Ini adalah opsi defaultnya reset											|  git reset --mixed
memindahkan HEAD ke commit-id yang diminta, isi working dan staging disamakan dengan commit-id tersebut			|  git reset --hard commit-id
memindahkan HEAD ke commit-id yang diminta, staging dan working tidak disentuh. Tidak mengubah output git status	|  git reset --soft
membuat working dan staging sama dengan HEAD										|  git reset --hard








## Bekerja paralel menggunakan branch


Branch memungkinkan kita bekerja secara paralel, misalnya ada tim yang menambah fitur, dan ada tim yang melakukan bug fix. 


Keterangan						 	| Perintah
----------------------------------------------------------------|------------------------------------------
membuat branch baru						| git branch namabranch
pindah ke branch tersebut					| git checkout namabranch
bikin branch sambil pindah					| git checkout -b namabranch
membuat tracking branch untuk branch bugfix di origin		| git checkout --track origin/bugfix
membuat tracking branch dengan nama berbeda dengan remote	| git checkout -b myfix origin/bugfix
membandingkan branch satu dengan lainnya			| git diff master..fitur-xx
membandingkan branch dengan titik awal branch tersebut		| git diff master...fitur-xx
menggabungkan branch satu dengan lainnya			| git checkout branch-tujuan   
								| git merge branch-yang-mau-diambil				
Mengedit konflik :						|   
- edit konfliknya  						| git add namafile-yang-konflik  
- remove markernya  						| git commit -m "merge fitur-xxx ke master"
membatalkan merge yang konflik					| git reset --hard









## Bekerja dengan remote


Interaksi dengan remote repository 

Keterangan											| Perintah
------------------------------------------------------------------------------------------------|----------------------------------------------------------
mendaftarkan remote repository									| git remote add namaremote url
melihat daftar remote repository								| git remote -v
menghapus remote repository									| git remote rm namaremote
mengambil perubahan di remote									| git remote update
mengambil perubahan di satu remote saja								| git remote update namaremote
mengambil perubahan di remote, hapus branch di lokal yang sudah tidak ada di remote		| git remote update --prune
mengambil perubahan sesuai refspec yang sudah dikonfigurasi					| git fetch namaremote
mengambil perubahan kemudian dimerge ke branch lokal yang sesuai				| pull = fetch + merge
												| git pull namaremote
mengirim perubahan di lokal ke remote								| git push nama-remote nama-branch-lokal:nama-branch-remote
mengirim perubahan di lokal ke remote, semua branch yang namanya bersesuaian akan dikirim 	| git push nama-remote
mengirim perubahan di branch lokal yang sedang aktif ke branch di remote dengan nama yang sama	| git push nama-remote HEAD
menghapus branch di remote									| git push nama-remote :nama-branch-remote





Demikianlah perintah-perintah Git yang kita gunakan sehari-hari. Melengkapi daftar perintah di atas, diagram berikut dapat membantu pemahaman kita tentang konsep dan operasi di Git. 

[![ ](/images/uploads/2011/01/git-300x284.png)](/images/uploads/2011/01/git-300x284.png)
