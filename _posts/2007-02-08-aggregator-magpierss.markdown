---
comments: true
date: 2007-02-08 16:54:54
layout: post
slug: aggregator-magpierss
title: Membuat aggregator dengan MagpieRSS
wordpress_id: 198
categories:
- php
---

Pada artikel ini, kita akan belajar cara menambahkan feed aggregator di website kita. Untuk mudahnya, kita gunakan pustaka [Magpie RSS](magpierss.sourceforge.net). Dengan library ini, kita bisa membuat website yang berisi rangkuman dari website-website lain (web-based aggregator). 

Penjelasan tentang apa itu RSS dapat dilihat di [artikel ini](http://endy.artivisi.com/blog/lain/apa-itu-rss/). 




## Cara penggunaan Magpie RSS



Setelah donlod dan extract, copy empat file magpie: 




    
  * rss_cache.inc

    
  * rss_fetch.inc
  
    
  * rss_parse.inc

    
  * rss_utils.inc



Berikut file dependensinya yang ada di folder extlib. 

Selanjutnya, untuk mengolah RSS feed, hanya dibutuhkan tiga baris kode:
    
``` php
require_once('inc/rss_fetch.inc');
$url = "http://www.php.net/news.rss";
$rss = fetch_rss($url);
```

Variabel $rss tinggal dilooping dan ditampilkan sesuai keinginan. Sebagai contoh, saya tampilkan isi feed dalam tabel. 
    
``` html
<table border="1">
    <tr><th>No</th><th>Judul</th><th>Ringkasan</th></tr>
    <? $i=0; foreach ($rss->items as $item) { $i++; ?>
    <tr>
        <td><?=$i ?></td>
        <td><a href="<? echo($item[link]); ?>"><? echo($item[title]); ?></a></td>
        <td><? echo($item[description]); ?></td>
    </tr>
    <? } ?>
</table>
```

Hasilnya dapat dilihat [di sini](http://endy.artivisi.com/downloads/code/magpie-rss/magpie.php). Sedangkan source codenya dapat didownload [di sini](http://endy.artivisi.com/downloads/code/magpie-rss.zip). 

Demikian ... cukup mudah bukan?
Selamat menampilkan rangkuman website orang di website anda sendiri. Jangan lupa memperhatikan etika dan hak cipta. 
