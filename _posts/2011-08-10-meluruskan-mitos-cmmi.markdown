---
comments: true
date: 2011-08-10 08:01:25
layout: post
slug: meluruskan-mitos-cmmi
title: Meluruskan Mitos CMMI
wordpress_id: 754
categories:
- manajemen
---

Di milis manajemen proyek IT sedang rame diskusi tentang CMMI dan Scrum.
Seperti layaknya diskusi yang rame, perdebatan dibumbui dengan segala macam mitos dan 'FUDification'.

Berikut adalah tanggapan saya tentang mitos yang berkembang mengenai CMMI, dicopy-paste dari posting milis dengan sedikit penyesuaian.

Beberapa mitos yang akan diluruskan :
    
  * CMMI adalah metodologi manajemen proyek yang cenderung waterfall
  * CMMI mewajibkan kita bikin banyak dokumen

Pada artikel ini, kita akan meluruskan mitos-mitos tersebut.

## CMMI = metodologi, cenderung waterfall

CMMI bukanlah metodologi manajemen proyek seperti
[Scrum](http://en.wikipedia.org/wiki/Scrum_(development)), [IBM Rational Unified Process](http://en.wikipedia.org/wiki/IBM_Rational_Unified_Process), [XP](http://en.wikipedia.org/wiki/Extreme_Programming), apalagi [Waterfall](http://en.wikipedia.org/wiki/Waterfall_model).

CMMI sebetulnya sudah pernah saya jelaskan [di posting saya sebelumnya](http://endy.artivisi.com/blog/manajemen/apa-itu-cmmi/). Tapi untuk lebih menyederhanakan lagi, kita bisa analogikan CMMI seperti akreditasi perguruan tinggi. Kalau kita mau daftar kuliah, biasanya kita cari tahu akreditasi kampus yang kita tuju. Semakin tinggi akreditasinya, semakin tinggi ekspektasi kita terhadap kualitas perguruan tinggi tersebut. [Akreditasi perguruan tinggi](http://ban-pt.kemdiknas.go.id/) [ditentukan oleh banyak hal](http://ban-pt.kemdiknas.go.id/index.php?option=com_content&view=article&id=57&Itemid=63&lang=in), diantaranya :
    
  * berapa jumlah dosen yang S3
  * berapa karya ilmiah dan penelitian yang dihasilkan dalam satu periode
  * dsb

Untuk menentukan suatu kampus mendapat level A, B, atau lainnya, maka ada tim assessor yang akan memeriksa apakah kampus tersebut sudah memenuhi apa yang dipersyaratkan.

Demikian juga dengan CMMI, berisi seperangkat checklist yang bentuknya kira-kira seperti ini:


| Level  | Process Area | OK | Not OK |
|--------|--------------|----|--------|
|   2    | REQM         | v  |
|   2    | PP           | v  |
|   2    | PMC          |    |   v
|   2    | MA           |    |   v


Nah, checklist itu nanti akan dicentang sesuai dengan kapabilitas perusahaan yang diperiksa.

Adapun urusan Scrum, Waterfall, XP, whatever metodologi yang kita gunakan,
hanyalah mencakup sebagian saja dari CMMI.

CMMI itu model untuk menggambarkan organisasi pembuat software yang mature. Apa itu mature? Salah satu karakteristiknya adalah konsistensi. Perusahaan yang gak mature, hasil kerjanya gak konsisten. Project A ontime, Project B molor 3 tahun. Project X bugnya dikit, Project Y isinya bug doang gak ada fiturnya.

Kalau kita bisa mengeksekusi project dengan sukses, kita hanya bisa lulus CMMI level 2. Untuk bisa mendapatkan level 3, kita harus bisa mengeksekusi project dengan sukses **secara konsisten**.
Untuk bisa konsisten, maka kita harus bisa menduplikasi project sukses ke seluruh perusahaan. Jadi, kalau kita sudah sukses pakai Scrum di project kita sekarang, tetap saja baru level 2. Hanya setelah kesuksesan Scrum bisa direplikasi di keseluruhan perusahaan, barulah bisa level 3.

Seperti juga halnya replikasi resep McDonalds ke seluruh cabang, untuk bisa mereplikasi project sukses ke seluruh perusahaan,
dibutuhkan kegiatan tambahan di level organisasi, misalnya :

  * Menulis SOP (OPD)
  * Membuat program pelatihan internal (OT)
  * Selalu menganalisas prosedur yang sekarang berlaku, supaya bisa diimprove (OPF)
  
Yang di dalam kurung adalah process area yang bersesuaian di CMMI.

Berurusan dengan perusahaan yang mature akan mengurangi resiko di client. Apa itu resiko?

Buat orang awam seperti kita, resiko adalah simply sekian persen kemungkinan adanya masalah di kemudian hari. Nah, ada perspektif finansial yang kita orang teknis biasanya gak kepikiran. Buat orang finance, persentase tersebut bisa diuangkan. Misalnya kita mau bikin aplikasi costnya 100 M, uangnya minjem ke bank. Karena pada dasarnya bank gak mau rugi, 100 M itu akan diasuransikan sama dia. Jadi kalo projectnya bubaran, kita gak sanggup bayar, hutangnya akan ditalangin sama asuransi.

Asuransi akan lihat, kita pakai vendor siapa. Kalo vendornya gak mature (baca: resiko tinggi) maka premi asuransinya akan tinggi. Akibatnya, biaya pinjaman kita (cost of money) juga tinggi.

Bisa aja kita bayar 100 M (pokok) + 20 M (bunga) + 20 M (asuransi). Padahal kalo vendornya mature, premi asuransinya cuma 5 M. Nah, jadi urusan resiko dan maturity ini bukan semata jargon2 aja, tapi ada duit beneran yang tersangkut di dalamnya.

Demikianlah mitos pertama, CMMI bukan metodologi manajemen proyek, melainkan manajemen keseluruhan perusahaan.

## CMMI mewajibkan kita bikin banyak dokumen

CMMI sama sekali tidak mengharuskan kita bikin dokumen apa-apa.

Yang ada, kita harus :

- **melakukan** project planning (level 2)
- **melakukan** project monitoring & control (level 2)
- **mendefinisikan** project life cycle : bisa waterfall, scrum, spiral, cowboy programming juga boleh

Berikut beberapa definisi singkat

* Planning : merencanakan apa yang akan dilakukan
* Monitoring : melihat kondisi aktual, apakah sesuai dengan plan
* Control : melakukan tindakan kalau kondisi aktual tidak sesuai dengan plan

Nah, kita harus membuktikan bahwa kita benar2 melakukan apa yang disuruh. Gimana cara membuktikannya?

Kita bisa :

1. Tunjukkan dokumen hardcopy, atau
2. Tunjukkan bahwa kita melakukan planning, monitoring, dan control di aplikasi yang kita pakai (Redmine, planningpoker.com, pivotaltracker.com, basecamphq.com, fogbugz, whatever)

Nah, dari 2 cara di atas, kalo kita **benar-benar** melakukan, akan lebih mudah menunjukkan yang #2. Tapi kalo akal2an, sebenarnya gak planning tapi mau ngakunya planning, akan lebih mudah memalsukan yang #1. Soalnya #2 gak bisa di-back-dated, sedangkan #1 bisa.

Jadi, fokusnya lebih ke **melakukan proses**, bukan **membuat dokumen**

Kemudian, ada kesalah-kaprahan juga yang umum terjadi tentang planning. Planning itu tidak sekali saja lalu dipakai sepanjang project. Project plan harus mencerminkan kondisi yang terbaru dari project. Misalnya, kita bikin plan awal (versi 1) selesai 3 bulan. Ternyata waktu monitoring di akhir bulan 1, kita udah tau bahwa gak bakalan selesai dalam 2 bulan sisanya. Kita harus melakukan controlling terhadap projectnya. Tindakan control bisa macam2, bisa kita tambah orang biar tetap selesai dalam 3 bulan, bisa juga revisi plannya sehingga mencerminkan kondisi setelah 1 bulan berjalan.

UUD 45 aja bisa diamandemen, masa project plan gak bisa :D

Contoh lain, mengelola requirement (Requirement Management), Level 2.


> S.P 1.1 : Understand Requirement : kita harus memastikan bahwa requirement dipahami.


Gimana cara membuktikannya?

Kalo prosesnya benar-benar dijalankan, kita bisa tunjukkan email dari BA ke Client yang isinya mengkonfirmasi pemahaman BA tentang requirement yang diminta Client.

Atau kalo seperti Scrum, Clientnya hadir di ruangan yang sama, gak nyatet apa2, rekaman audio juga boleh. Intinya, ada sesuatu yang bisa ditunjukkan ke auditor bahwa kita sudah Understanding Requirement.

Kalo prosesnya palsu, artinya sebenarnya gak dilakukan, tapi mau lulus Level 2, maka dibuatlah dokumen palsu. Bentuknya biasanya review report, isinya item2 requirement, lalu nanti ada tandatangan client palsu.

So, overhead dokumen (mis: review report) itu ada kalo kita memalsukan proses.

Selama kita benar-benar menjalankan apa yang disuruh, pasti ada evidence bahwa kita menjalankan, entah itu bentuknya chat YM, email, Skype call, apalah terserah, tidak ada CMMI mewajibkan formatnya harus mp3 atau apa.


> SP 1.2 : Obtain Commitment to Requirement : semua pihak harus commit terhadap requirement yang sudah dibuat.


Gimana cara membuktikan bahwa kita comply dengan SP ini?

Paling gampang, BA kirim email ke Client, "Pak, di iterasi ini, kita kerjakan req #12, #14, sama #15 ya. #13 pending dulu aja" 

Client reply, "Ok"

That's it, tunjukkan emailnya ke auditor, beres. 

Kalau proses ini tidak dijalankan, akan menimbulkan masalah di kemudian hari. Usernya client bilang A, bosnya user bilang A+, programmer bilang C, PM bilang lain lagi. Sekali lagi, selama prosesnya dilakukan, emailnya pasti ada.

Kalo prosesnya palsu, atau clientnya gaptek gak kenal email, ya dibuatlah dokumen requirement sign off. Orang2 tandatangan. Dokumennya dijadikan evidence.


> SP 1.3 : Manage Requirement Changes : kalo requirement berubah, harus di-manage.


Apa itu dimanage? 

Dimanage artinya harus jelas :
- apa yang berubah
- siapa yang minta berubah
- siapa yang approve
- apa impactnya ke schedule/cost/effort/cuaca hari ini

Apa buktinya? Email boleh, chat log boleh, rekaman cctv boleh.

Ok, lalu kenapa semua harus ada evidence ??

Berikut joke dari auditor kita dulu, 


> In God We Trust, everybody else brings data.


Jadi, CMMI = banyak dokumen hanyalah mitos belaka. Untuk bisa melakukan verifikasi, auditor tentu butuh melihat evidence. Di jaman modern seperti sekarang, evidence bentuknya tidak harus dokumen tertulis yang dibuat dengan aplikasi office. 

