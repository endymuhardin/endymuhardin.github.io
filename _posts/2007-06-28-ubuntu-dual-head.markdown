---
comments: true
date: 2007-06-28 10:00:00
layout: post
slug: ubuntu-dual-head
title: Dual Head Ubuntu
wordpress_id: 230
categories:
- linux
---

Pertanyaan : Kalau kita punya komputer, upgrade hardware apa yang paling meningkatkan produktifitas ??   

Jawaban 1 : Prosesor  

Jawaban 2 : Memori

Saya tidak sependapat dengan kedua jawaban di atas. Prosesor lebih kencang atau memori memang meningkatkan kemampuan komputer. Tapi ada upgrade lain yang lebih signifikan efeknya, yaitu tambah monitor. 

Anda pernah menonton film Swordfish? Film ini bercerita tentang Stanley Jobson, pensiunan hacker yang dipaksa membobol bank demi menyelamatkan anaknya. Di film ini, Stanley diberikan komputer super canggih agar bisa membobol jaringan bank. Komputer tersebut memiliki enam screen. 

Mereka yang sudah pernah merasakan bekerja dengan dua (atau lebih) monitor pasti mengerti maksud saya. Bayangkan coding di satu screen dan melihat Java API di screen yang satu lagi. Atau membuat desain software (UML, ERD, dsb) di screen kanan sambil melihat dokumen analisa di screen kiri. Dan masih banyak kemungkinan lain yang bisa dilakukan. Bahkan [Bill Gates bekerja dengan tiga monitor sekaligus](http://money.cnn.com/2006/03/30/news/newsmakers/gates_howiwork_fortune/). 

Pada artikel ini, saya akan membahas tentang cara setup dua monitor di Ubuntu. Komputer yang saya gunakan adalah NEC Versa 3100. Walaupun berbeda di sisi teknis, cara ini juga bisa diterapkan di komputer lain yang menggunakan X.Org sebagai X servernya. 


Sebelum mulai, mari kita kenali dulu istilah-istilah yang ada di dalam konfigurasi X.Org. 



	
  * InputDevice : Ini adalah segala alat input seperti mouse, keyboard, touchscreen, pulpen elektronik, dan teman-temannya. Dalam satu file konfigurasi bisa dimasukkan banyak device.

	
  * Device: Yang dimaksud device di sini adalah display adapter kita, atau lebih dikenal dengan istilah VGA Card. Bila kita memasang lebih dari satu VGA Card, maka harus ada konfigurasi Device yang sesuai agar VGA Card tersebut bisa berfungsi dengan baik.

	
  * Monitor: Self Explanatory. Monitor adalah yang menampilkan output dari komputer.



Untuk mengaktifkan dual head, kita membutuhkan dua monitor. Perlu diperhatikan bahwa kita belum tentu butuh lebih dari satu VGA Card, tergantung tipe yang kita gunakan. Di PC saya yang lainnya, saya menggunakan NVidia GForce yang memiliki tiga output: VGA, DVI, dan TV. Yang biasa kita gunakan di monitor CRT adalah VGA port, sedangkan beberapa tipe monitor LCD biasanya menyediakan kabel VGA dan juga DVI. TV Out tentunya kita sudah tahu bentuknya, seperti colokan dari DVD player itu lho .. 

Karena saya menggunakan notebook, maka saya memiliki dua output dari VGA, yang satu adalah LCD bawaan notebook tersebut, dan satu lagi VGA port yang biasa kita gunakan untuk presentasi. 

Jumlah VGA dan output port yang kita miliki sangat penting diketahui agar bisa mengkonfigurasi dual head dengan benar. Untuk mereka yang VGA outputnya cuma satu port terpaksa pasang satu card lagi agar bisa menggunakan dual head. 

Baiklah, mari kita masuk ke konfigurasi. Sebagai titik awal, berikut konfigurasi X.Org saya sebelum ada modifikasi apa-apa. Ini merupakan konfigurasi yang dibuatkan Ubuntu. 

    
```
# /etc/X11/xorg.conf (xorg X Window System server configuration file)
#
# This file was generated by dexconf, the Debian X Configuration tool, using
# values from the debconf database.
#
# Edit this file with caution, and see the xorg.conf(5) manual page.
# (Type "man xorg.conf" at the shell prompt.)
#
# This file is automatically updated on xserver-xorg package upgrades *only*
# if it has not been modified since the last upgrade of the xserver-xorg
# package.
#
# If you have edited this file but would like it to be automatically updated
# again, run the following command:
#   sudo dpkg-reconfigure -phigh xserver-xorg

Section "Files"
	FontPath	"/usr/share/fonts/X11/misc"
	FontPath	"/usr/share/fonts/X11/cyrillic"
	FontPath	"/usr/share/fonts/X11/100dpi/:unscaled"
	FontPath	"/usr/share/fonts/X11/75dpi/:unscaled"
	FontPath	"/usr/share/fonts/X11/Type1"
	FontPath	"/usr/share/fonts/X11/100dpi"
	FontPath	"/usr/share/fonts/X11/75dpi"
	# path to defoma fonts
	FontPath	"/var/lib/defoma/x-ttcidfont-conf.d/dirs/TrueType"
EndSection

Section "Module"
	Load	"i2c"
	Load	"bitmap"
	Load	"ddc"
	Load	"dri"
	Load	"extmod"
	Load	"freetype"
	Load	"glx"
	Load	"int10"
	Load	"vbe"
EndSection

Section "InputDevice"
	Identifier	"Generic Keyboard"
	Driver		"kbd"
	Option		"CoreKeyboard"
	Option		"XkbRules"	"xorg"
	Option		"XkbModel"	"pc105"
	Option		"XkbLayout"	"us"
EndSection

Section "InputDevice"
	Identifier	"Configured Mouse"
	Driver		"mouse"
	Option		"CorePointer"
	Option		"Device"		"/dev/input/mice"
	Option		"Protocol"		"ImPS/2"
	Option		"ZAxisMapping"		"4 5"
	Option		"Emulate3Buttons"	"true"
EndSection

Section "InputDevice"
	Identifier	"Synaptics Touchpad"
	Driver		"synaptics"
	Option		"SendCoreEvents"	"true"
	Option		"Device"		"/dev/psaux"
	Option		"Protocol"		"auto-dev"
	Option		"HorizScrollDelta"	"0"
EndSection

Section "InputDevice"
	Driver		"wacom"
	Identifier	"stylus"
	Option		"Device"	"/dev/input/wacom"
	Option		"Type"		"stylus"
	Option		"ForceDevice"	"ISDV4"		# Tablet PC ONLY
EndSection

Section "InputDevice"
	Driver		"wacom"
	Identifier	"eraser"
	Option		"Device"	"/dev/input/wacom"
	Option		"Type"		"eraser"
	Option		"ForceDevice"	"ISDV4"		# Tablet PC ONLY
EndSection

Section "InputDevice"
	Driver		"wacom"
	Identifier	"cursor"
	Option		"Device"	"/dev/input/wacom"
	Option		"Type"		"cursor"
	Option		"ForceDevice"	"ISDV4"		# Tablet PC ONLY
EndSection

Section "Device"
	Identifier	"Intel Corporation Mobile 915GM/GMS/910GML Express Graphics Controller"
	Driver		"i810"
	BusID		"PCI:0:2:0"
#	Option "ForceBIOS" "1920x1440=1280x768"
EndSection

Section "Monitor"
	Identifier	"Generic Monitor"
	Option		"DPMS"
EndSection

Section "Screen"
	Identifier	"Default Screen"
	Device		"Intel Corporation Mobile 915GM/GMS/910GML Express Graphics Controller"
	Monitor		"Generic Monitor"
	DefaultDepth	24
	SubSection "Display"
		Depth		1
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		4
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		8
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		15
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		16
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		24
		Modes		"1280x768"
	EndSubSection
EndSection

Section "ServerLayout"
	Identifier	"Default Layout"
	Screen		"Default Screen"
	InputDevice	"Generic Keyboard"
	InputDevice	"Configured Mouse"
	InputDevice     "stylus"	"SendCoreEvents"
	InputDevice     "cursor"	"SendCoreEvents"
	InputDevice     "eraser"	"SendCoreEvents"
	InputDevice	"Synaptics Touchpad"
EndSection

Section "DRI"
	Mode	0666
EndSection
```



Perlu saya ingatkan untuk SELALU BACKUP konfigurasi awal Anda sebelum mengubah konfigurasi. Jadi bila terjadi kegagalan, kita selalu bisa kembali ke setting awal. 



#### Penggantian Nama


Pertama, mari kita ganti dulu beberapa nama pada file konfigurasi di atas agar lebih mudah dimengerti. Yang perlu diganti adalah bagian Monitor dan Device. Saya ganti menjadi seperti ini. 

    
```
Section "Device"
	Identifier	"Intel i915 LCD Output"
	Driver		"i810"
	BusID		"PCI:0:2:0"
#	Option "ForceBIOS" "1920x1440=1280x768"
EndSection

Section "Monitor"
	Identifier	"Default LCD"
	Option		"DPMS"
EndSection
```


Artinya, device di atas mengacu pada output yang menuju LCD screen saya. Nama monitor juga diganti menjadi LCD agar lebih jelas.



#### Menambah Monitor


Sekarang, kita tambah monitor dan juga port VGA output. Konfigurasinya adalah sebagai berikut. 

    
```
Section "Device"
	Identifier	"Intel i915 External Output"
	Driver		"i810"
	BusID		"PCI:0:2:0"
	Option "ForceBIOS" "1920x1440=1280x768"
EndSection
Section "Monitor"
	Identifier	"External Monitor"
	Option		"DPMS"
EndSection
```



Karena ada tambahan output, kita perlu menjelaskan pada X.Org mana screen utama kita. Kalau kita tidak lakukan ini, maka bisa saja pada saat booting LCD screen saya blank, karena outputnya dikeluarkan ke monitor CRT yang belum tentu dipasang. Tambahkan nomor screen pada konfigurasi VGA Card seperti ini. 

    
```
Section "Device"
	Identifier	"Intel i915 LCD Output"
	Driver		"i810"
	BusID		"PCI:0:2:0"
#	Option "ForceBIOS" "1920x1440=1280x768"
	Option "MonitorLayout" "CRT,LFP"
	Screen		0
EndSection
Section "Device"
	Identifier	"Intel i915 External Output"
	Driver		"i810"
	BusID		"PCI:0:2:0"
	Option "ForceBIOS" "1920x1440=1280x768"
	Screen		1
EndSection
```



Dari konfigurasi di atas dapat terlihat bahwa screen utama (screen 0) adalah LCD Output. Di atas juga ada tambahan konfigurasi `MonitorLayout`. Ini ditambahkan agar secara default kedua output langsung aktif. Biasanya kalau kita pakai laptop, ada kombinasi tombol untuk mengaktifkan VGA Output, misalnya Fn+F5 atau Fn+F3. Nah, dengan opsi ini, VGA output langsung aktif tanpa harus menekan Fn+Something.



#### Konfigurasi Screen


Selanjutnya, kita akan mengkonfigurasi Screen. Screen adalah kombinasi antara Device dan Monitor. Artinya, konfigurasi ini akan menentukan VGA Output mana yang terhubung ke Monitor mana, berikut resolusi tampilannya. Karena tadi kita mengganti nama monitor dan VGA Output, maka kita harus sesuaikan konfigurasi Screen yang sudah ada. Berikut hasilnya. 

    
```
Section "Screen"
	Identifier	"Default Screen"
	Device		"Intel i915 LCD Output"
	Monitor		"Default LCD"
	DefaultDepth	24
	SubSection "Display"
		Depth		1
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		4
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		8
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		15
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		16
		Modes		"1280x768"
	EndSubSection
	SubSection "Display"
		Depth		24
		Modes		"1280x768"
	EndSubSection
EndSection
```



dan selanjutnya, ini adalah tambahan untuk screen kedua kita. 

    
```
Section "Screen"
	Identifier	"External Screen"
	Device		"Intel i915 External Output"
	Monitor		"External Monitor"
	DefaultDepth	24
	SubSection "Display"
		Depth		1
		Modes		"1024x768" "800x600"
	EndSubSection
	SubSection "Display"
		Depth		4
		Modes		"1024x768" "800x600"
	EndSubSection
	SubSection "Display"
		Depth		8
		Modes		"1024x768" "800x600"
	EndSubSection
	SubSection "Display"
		Depth		16
		Modes		"1024x768" "800x600"
	EndSubSection
	SubSection "Display"
		Depth		16
		Modes		"1024x768" "800x600"
	EndSubSection
	SubSection "Display"
		Depth		24
		Modes		"1024x768" "800x600"
	EndSubSection
EndSection
```



Kedua screen siap digunakan. Sekarang tinggal satu langkah terakhir.


#### ServerLayout


Kita perlu memberitahu X.Org screen mana yang ada di kiri, dan mana yang sebelah kanan. Gunanya agar mouse pointer kita bisa 'menembus batas' dengan benar. Misalnya monitor CRT kita pasang di sebelah kiri laptop, maka seharusnya kalau mouse pointer digerakkan ke pinggir kiri LCD, dia akan muncul di pinggir kanan CRT. 

Berikut adalah konfigurasi ServerLayout. 

    
```
Section "ServerLayout"
	Identifier	"Multihead Layout"
	Screen		0 "Default Screen" 0 0
	Screen		1 "External Screen" LeftOf "Default Screen"
	InputDevice	"Generic Keyboard"
	InputDevice	"Configured Mouse"
	InputDevice     "stylus"	"SendCoreEvents"
	InputDevice     "cursor"	"SendCoreEvents"
	InputDevice     "eraser"	"SendCoreEvents"
	InputDevice	"Synaptics Touchpad"
#	Option		"Xinerama" "true"
EndSection
```



Pada konfigurasi di atas, saya menon-aktifkan opsi Xinerama. Kalau opsi ini dijalankan, kita akan memiliki desktop super lebar. Kita bisa drag satu window menembus batas. Tapi kalau opsi ini dimatikan, seolah-olah ada dua desktop yang terpisah, mouse pointer bisa tembus, tapi window aplikasi tidak. 

Kalau Anda menonton Swordfish, Stanley Jobson mendapatkan konfigurasi Xinerama. Ini dapat dilihat dari screensaver komet yang berjalan mengelilingi keenam screen yang tersedia. Tergantung kebutuhan, opsi ini bisa dinyalakan atau dimatikan. 

Setelah selesai, logout dari desktop. Untuk memastikan, restart X server dengan kombinasi tombol Ctrl+Alt+Backspace. Kalau segalanya berjalan lancar, dual head akan tampil di hadapan kita. Perlu diperhatikan, kadang resolusi layar tidak berjalan sesuai harapan. Kadang kita perlu reboot agar resolusinya benar. 

Demikian artikel kali ini, semoga bermanfaat.
