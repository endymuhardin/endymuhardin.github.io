---
layout: post
title: "Hosting Blog dengan SSL di Gitlab"
date: 2017-10-03 08:00
comments: true
categories:
- devops
---

Sejak beberapa waktu yang lalu, blog ini sebetulnya sudah pindah hosting dari Github ke Gitlab. Alasannya sederhana, Github sampai saat artikel ini ditulis tidak mendukung SSL untuk custom domain. Ada sih akal-akalan menggunakan CloudFlare, seperti dijelaskan di [artikel ini](https://hackernoon.com/set-up-ssl-on-github-pages-with-custom-domains-for-free-a576bdf51bc), tapi tetap saja koneksi dari CloudFlare ke Github tidak terproteksi.

Oleh karena itu, saya pindahkan hostingnya ke Gitlab. Berikut langkah-langkah untuk memasang sertifikat SSL.

<!--more-->

Pertama, kita harus punya sertifikat dulu. Caranya sudah dibahas pada [artikel terdahulu](https://software.endy.muhardin.com/devops/letsencrypt-manual-dns/). Silahkan dibaca dulu supaya nyambung.

Setelah sertifikat kita dapatkan, buat repo buat menghosting blog Jekyll kita, tambahkan remote url ke repo tersebut, dan kemudian push blog Jekyll kita ke Gitlab. Perintahnya kurang lebih seperti ini:

```
git remote add gitlab git@gitlab.com:endymuhardin/endymuhardin.gitlab.io.git
git push gitlab master
```

Setelah dipush, harusnya blog sudah bisa diakses dengan alamat [https://endymuhardin.gitlab.io](https://endymuhardin.gitlab.io). Pastikan dulu sudah terdeploy dengan baik sebelum kita lanjutkan ke setting custom domain.

## Custom Domain ##

Untuk memasang custom domain, terlebih dulu kita arahkan setting DNS dengan memasang record CNAME yang mengarahkan `software.endy.muhardin.com` ke `endymuhardin.gitlab.io`.

[![CNAME]({{site.url}}/images/uploads/2017/ssl-gitlab/cname-dns.png)]({{site.url}}/images/uploads/2017/ssl-gitlab/cname-dns.png)

Setelah itu, masuk ke menu `Settings > Pages` di repo Gitlab.

[![Menu Settings Pages]({{site.url}}/images/uploads/2017/ssl-gitlab/settings-pages.png)]({{site.url}}/images/uploads/2017/ssl-gitlab/settings-pages.png)

Klik `New Domain`, kemudian masukkan nama domain, public key, dan private key sertifikat SSL.

[![Custom Domain]({{site.url}}/images/uploads/2017/ssl-gitlab/custom-domain.png)]({{site.url}}/images/uploads/2017/ssl-gitlab/custom-domain.png)

Bila [menggunakan sertifikat SSL gratis dari LetsEncrypt](https://software.endy.muhardin.com/devops/letsencrypt-manual-dns/), file yang digunakan adalah sebagai berikut:

* `fullchain.pem` untuk di isian `Certificate (PEM)`
* `privkey.pem` untuk di isian `Key (PEM)`

Klik `Save`. Hasilnya sebagai berikut

[![Hasil Settings]({{site.url}}/images/uploads/2017/ssl-gitlab/hasil.png)]({{site.url}}/images/uploads/2017/ssl-gitlab/hasil.png)

Sekarang blog sudah bisa diakses di alamat `https://software.endy.muhardin.com`
