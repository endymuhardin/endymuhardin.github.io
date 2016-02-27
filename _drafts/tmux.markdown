prefix = Ctrl B
Command = prefix :

## Session Management ##

* membuat session baru

    tmux new -s namasession

* rename session

prefix $

* melihat daftar session

tmux ls

* mengakhiri session

tmux kill-session -t namasession

* detach session

prefix d

* attach session

tmux a -t namasession

## Panel Management ##

* membuat vertical split

prefix ℅

* membuat horizontal split

prefix "

* pindah kursor antar panel

prefix o pindah ke pane berikutnya
prefix ; pindah ke pane sebelumnya

* menukar posisi panel

prefix { : menukar dengan pane sebelumnya
prefix } : menukar dengan pane setelahnya
prefix Ctrl O : rotasi pane

* mengatur layout panel

prefix spasi

* mengatur proporsi panel

command resize-pane -[DULR] angka 

# Window Management

* membuat window baru

command c

* mengganti nama window
 prefix ,

* melihat daftar window

prefix w

* pindah window

prefix [0-9]

* menutup window

prefix &


* scroll

masuk ke copy mode prefix [
Fn+Up : Page Up
Fn+Down : Page Down
keluar dari copy mode q

Referensi

* http://www.davidverhasselt.com/enable-mouse-support-in-tmux-on-os-x/
