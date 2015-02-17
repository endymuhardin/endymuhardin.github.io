---
comments: true
date: 2005-10-14 12:58:59
layout: post
slug: keanehan-konfigurasi-openldap
title: Keanehan konfigurasi OpenLDAP
wordpress_id: 9
categories:
- aplikasi
---

Satu hal yang sangat mengganggu dalam OpenLDAP adalah, secara default dia mengijinkan anonymous login. Dan parahnya lagi, user yang login secara anonymous dapat melihat daftar username yang terdaftar. 
Walaupun aksesnya cuma readonly, tapi tetap saja ini adalah potensi bahaya. 

Saya coba mendisable account anonymous dengan cara menambahkan baris ini : 
`disallow bind_anon `
ke dalam `/etc/ldap/slapd.conf`. 

Berhasil, sekarang orang tidak bisa otentikasi secara anonymous. Tapi muncul masalah berikutnya. Subversion WebDAV juga ternyata tidak bisa login. 
Setelah ditrace ke lognya apache, dia bilang tidak bisa menggunakan mekanisme simple_bind untuk otentikasi. Berikut pesan errornya :
 
`[LDAP: ldap_simple_bind_s() failed][Inappropriate authentication]`

Sepertinya, dengan mendisable anonymous, metode otentikasi simple juga di-disable. Sampai saat tulisan ini diposting, saya belum menemukan cara untuk mematikan anonymous tapi tidak mematikan simple_bind.

Akhirnya, workaroundnya adalah, mengaktifkan anonymous, tapi melucuti semua ijin aksesnya. 
Ini dilakukan dengan cara mengubah konfigurasi akses (/etc/ldap/slapd.conf) dari 

    
    access to *
            by * read


menjadi 

    
    access to *
            by anonymous none
            by * read


Dengan demikian, sekarang anonymous bisa login, tapi tidak bisa lihat apa-apa.

**Update 17 Oktober 2005 : **
Ternyata selain anonymous tidak bisa lihat apa-apa, WebDAV juga gak bisa lihat apa-apa. Sepertinya, kalau dia mau otentikasi username, dia akan login anonymous dulu untuk melihat daftar user yang terdaftar. 
Dengan mematikan anonymous, para user Subversion jadi tidak bisa login dengan pesan error : username not found. Jadi, sementara account anonymous terpaksa dibiarkan seperti defaultnya OpenLDAP.

**Update 18 Oktober 2005 : **
Setelah google kesana kemari, akhirnya saya menemukan [orang yang mengalami masalah yang sama](http://www.openldap.org/lists/openldap-software/200401/msg00034.html). Tentu saja masalah ditemukan bersama dengan [solusinya](http://www.rudedog.org/auth_ldap/1.6/auth_ldap.html#dir:AuthLDAPBindDN).
Sekarang kita bisa mendisable account anonymous, dan apache tetap bisa mengotentikasi user Subversion dengan tenang. Tidak perlu lagi workaround untuk melucuti akses anonymous.
