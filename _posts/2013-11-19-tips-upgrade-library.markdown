---
layout: post
title: "Tips Upgrade Library"
date: 2013-11-19 10:13
comments: true
categories: 
- aplikasi
---

Dalam membuat aplikasi, kita pasti menggunakan library pihak ketiga. Dan library yang bagus tentunya sering diupgrade oleh pembuatnya. Sisi positifnya, library yang kita pakai akan bertambah fiturnya dan berkurang bugnya. Sisi negatifnya, kita harus menyesuaikan kode program kita supaya tidak error karena perubahan di library.

Pada artikel ini, kita akan bahas tips singkat untuk memudahkan kita mengupgrade library pihak ketiga.

<!--more-->

Sebagai contoh, berikut [panduan upgrade library CSS Twitter Bootstrap](http://getbootstrap.com/getting-started/#migration). Di halaman itu dituliskan hal-hal yang berubah.

![Foto](http://lh6.googleusercontent.com/-Pf2d8nhVky0/UorYq5A-OGI/AAAAAAAACQE/PGb8mXDC890/panduan-upgrade-bootstrap.png)

Di situ dijelaskan bahwa kita harus mengganti class CSS

* `.container-fluid` menjadi `.container`
* `.row-fluid` menjadi `.row`
* dan seterusnya

> Waduh, source code HTML saya ada ratusan file, bagaimana menemukan file mana saja yang pakai class tersebut ??

Gampang, bila Anda pakai Linux. Cukup buka command prompt, masuk ke folder source code, lalu ketik perintah berikut

```
grep -nir 'container-fluid'
```

Outputnya seperti ini

```html
src/main/webapp/main.html:107:        <div class="container-fluid">
target/belajar-restful-web-0.1.2-SNAPSHOT/main.html:107:        <div class="container-fluid">
```

Di situ bisa kita lihat bahwa class CSS itu ada di file `main.html` baris 107. File tersebut ada di dua tempat, yaitu folder `src/main/webapp` dan `target/belajar-restful-web-0.1.2-SNAPSHOT`.

`grep` adalah perintah standar di Linux. Kita menggunakan tiga opsi yaitu:

* `n` : menampilkan nomor baris (line number)
* `i` : huruf kecil dan besar tidak berpengaruh (case insensitive)
* `r` : rekursif, cari sampai ke dalam subfolder

Di belakangnya kita juga bisa tambahkan lokasi file dan folder untuk mempersempit pencarian.

```
grep -nir 'icon-' login.html main.html html-pages
```

Perintah di atas hanya akan mencari ke file `login.html`, `main.html`, dan folder `html-pages`. Opsi ini berguna supaya dia tidak ikut mencari di file javascript dan css sehingga membingungkan kita menyortir hasilnya.

Outputnya

```
main.html:42:                        <span class="icon-bar"></span>
pages/system/role.html:23:            <i class="icon-plus-sign"></i>Tambah Data
pages/system/role.html:39:                        <a ng-click="edit(x)"><i class="icon-edit"></i></a>
pages/system/role.html:40:                        <a ng-click="remove(x)"><i class="icon-remove"></i></a>
pages/system/role.html:73:            <i class="icon-plus-sign"></i>Tambah Menu
pages/system/role.html:94:                        <a ng-click="removeSelectedMenu(m)"><i class="icon-remove"></i></a>
pages/system/role.html:104:            <i class="icon-plus-sign"></i>Tambah Permission
pages/system/role.html:125:                        <a ng-click="removeSelectedPermission(p)"><i class="icon-remove"></i></a>
pages/system/permission.html:22:        <i class="icon-plus-sign"></i>Tambah Data
pages/system/permission.html:38:                    <a ng-click="edit(x)"><i class="icon-edit"></i></a>
pages/system/permission.html:39:                    <a ng-click="remove(x)"><i class="icon-remove"></i></a>
pages/system/sessions.html:28:                <th><a ng-click="refresh()" class="btn"><i class="icon-refresh"></i> refresh</a></th>
pages/system/sessions.html:38:                    <a ng-click="kick(u)" class="btn"><i class="icon-eject"></i> kick</a>
pages/system/user.html:70:            <i class="icon-plus-sign"></i>Tambah Data
pages/system/user.html:94:                        <a ng-click="edit(x)"><i class="icon-edit"></i></a>
pages/system/user.html:95:                        <a ng-click="remove(x)"><i class="icon-remove"></i></a>
pages/system/config.html:22:        <i class="icon-plus-sign"></i>Tambah Data
pages/system/config.html:40:                    <a ng-click="edit(c)"><i class="icon-edit"></i></a>
pages/system/config.html:41:                    <a ng-click="remove(c)"><i class="icon-remove"></i></a>
pages/system/menu.html:61:            <i class="icon-plus-sign"></i>Tambah Data
pages/system/menu.html:85:                        <a ng-click="edit(c)"><i class="icon-edit"></i></a>
pages/system/menu.html:86:                        <a ng-click="remove(c)"><i class="icon-remove"></i></a>
```


> Wah canggih sekali, tapi saya pakai Windows. Bagaimana dong?

Gampang, [instal saja Ubuntu](http://software.endy.muhardin.com/linux/upgrade-ubuntu/) :D
