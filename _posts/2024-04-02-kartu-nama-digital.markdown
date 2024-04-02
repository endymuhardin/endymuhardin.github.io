---
layout: post
title: "Kartu Nama Digital"
date: 2024-04-02 08:14
comments: true
categories: 
- aplikasi
---

Pada jaman sekarang, penggunaan kertas sudah semakin ditinggalkan. Untuk dokumen-dokumen yang butuh tandatangan, bahkan sudah bisa kita gunakan tanda tangan digital. Sehingga tidak perlu diprint, pasang meterai, tanda tangan, stempel, dan scan lagi.

Akan tetapi, masih sering kita menemui pertukaran kartu nama. Saya sendiri sebetulnya termasuk orang yang paling malas pakai kartu nama. Pernah cetak satu box, sudah belasan tahun masih belum habis.

Untuk itu, saya mencari cara untuk membuat kartu nama digital. Jadi kita desain yang keren, kemudian kita berikan QR code yang apabila discan, akan langsung bisa disimpan ke contact / address book di handphone.

Berikut cara membuatnya

<!--more-->

Pertama, kita harus siapkan file dalam format VCF. Dokumentasi formatnya bisa dibaca [di Wikipedia](https://en.wikipedia.org/wiki/Variant_Call_Format). Ada banyak field dan varian format. Untuk mempersingkat waktu, saya akan langsung saja ke isi VCF yang saya gunakan, yaitu sebagai berikut

```
BEGIN:VCARD
VERSION:2.1
FN:Endy Muhardin
N:Muhardin;Endy;;;
EMAIL;TYPE=INTERNET;TYPE=WORK:endy@artivisi.com
EMAIL;TYPE=INTERNET;TYPE=HOME:endy.muhardin@gmail.com
EMAIL;TYPE=INTERNET;TYPE=OTHER:endy@tazkia.ac.id
TEL;TYPE=CELL:+62 812-9800-0468
ORG:ArtiVisi Intermedia
TITLE:IT Consultant
URL:https://software.endy.muhardin.com
URL:https://youtube.com/artivisi
PHOTO;VALUE=uri:https://lh3.googleusercontent.com/contacts/AKUYANSIAvSwTlLO9X1flZaNvgDZZ7n0rxHdodKCg2h1NRGuL7Riffcm
END:VCARD
```

Pada isi file tersebut ada beberapa field yang bisa kita gunakan, yaitu:

* Nama
* Nomor Telepon
* Email (bisa diisi beberapa email)
* URL website
* URL Foto

Selanjutnya kita simpan file tersebut, misalnya dengan nama `my-contact.vcf`.

Untuk membuat kode QR, kita gunakan perintah berikut :

```
cat my-contact-vcf | qrencode -o my-contact.png
```

Kalau ingin tanpa margin, kita bisa menggunakan opsi `-m 0` seperti ini

```
cat my-contact-vcf | qrencode -o my-contact.png
```

Hasil QR code dari VCF saya di atas adalah sebagai berikut

[![Contact Endy]({{site.url}}/files/contact.png)]({{site.url}}/files/contact.png)

QR code tersebut bisa kita pasang di desain kartu nama. Nanti akan edit posting ini kalau desain kartu namanya sudah jadi.

Selamat mencoba, semoga bermanfaat.