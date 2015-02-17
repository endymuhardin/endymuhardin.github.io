---
comments: true
date: 2008-01-19 10:24:03
layout: post
slug: aplikasi-web-spring25-6
title: Aplikasi Web dengan Spring 2.5 [bagian 6]
wordpress_id: 327
categories:
- java
---

Pada artikel kali ini, kita akan mengurusi masalah sepele tapi penting, yaitu Internationalization (i18n) dan Localization (l10n). i18n adalah menyiapkan aplikasi kita supaya bisa beradaptasi dengan berbagai bahasa, format penomoran, mata uang, dan hal-hal lain yang berkaitan dengan globalisasi.

Para pembaca mungkin ada yang bertanya,


> Ah, aplikasi saya tidak perlu multibahasa kok. Saya bikin dalam bahasa Inggris, dan tidak akan diubah-ubah lagi.


Baiklah, mungkin aplikasi kita tidak akan berganti bahasa. Tapi mungkin sekali akan terjadi banyak revisi tampilan. Kita sebagai programmer mungkin mahir berbahasa PHP, Java, Ruby, atau bahasa-bahasa komputer lainnya. Tetapi belum tentu kita dapat menyaingi seorang JS Badudu dalam urusan Bahasa Indonesia.

Oleh karena itu, penting untuk menyiapkan aplikasi kita agar setidaknya tulisan yang dilihat user bisa diganti dengan mudah.

Mari kita lihat template sederhana berikut.



### personlist.html



    
    
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>:: List of All Person ::</title>
    </head>
    <body>
    
    <h1>List of All Person</h1>
    
    <table border="0" cellpadding="2" cellspacing="2">
    	<tr>
    		<th>Name</th>
    		<th>Email</th>
    		<th> </th>
    	</tr>
    	#foreach($person in $personList)
    	<tr>
    		<td>$person.Name</td>
    		<td>$person.Email</td>
    		<td><a href="personform?person_id=$person.Id">edit</a> | <a
    		 href="persondetail?person_id=$person.Id">view</a></td>
    	</tr>
    	#end
    </table>
    
    </body>
    </html>


Seperti kita lihat, ada beberapa tulisan yang muncul di situ, yaitu:

* Judul halaman
* Nama kolom pada tabel : Nama, Email
* link untuk edit dan lihat

Spring sudah memiliki dukungan built-in untuk mengeluarkan tulisan tersebut ke file text. Nantinya kita bisa edit file tersebut dengan mudah. Kita juga bisa punya beberapa file dalam berbagai bahasa, sehingga aplikasi dapat mendeteksi setting regional komputer, dan kemudian menampilkan bahasa yang sesuai.

Tapi untuk artikel ini, cukuplah kita mengeluarkan tulisan itu ke file text. Fitur-fitur tambahan lainnya silahkan dieksplorasi sendiri oleh pembaca.

Kita menggunakan tag `#springMessage` untuk mengeluarkan tulisan tersebut. Tag ini khusus untuk Velocity. Bila Anda menggunakan JSP atau Freemarker, silahkan lihat referensi Spring.

Template yang sudah diubah terlihat menjadi seperti ini.


### personlist.html



    
    
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>:: #springMessage("personlist.title") ::</title>
    </head>
    <body>
    
    <h1>#springMessage("personlist.title")</h1>
    
    <table border="0" cellpadding="2" cellspacing="2">
    	<tr>
    		<th>#springMessage("personlist.name")</th>
    		<th>#springMessage("personlist.email")</th>
    		<th> </th>
    	</tr>
    	#foreach($person in $personList)
    	<tr>
    		<td>$person.Name</td>
    		<td>$person.Email</td>
    		<td><a href="personform?person_id=$person.Id">#springMessage("list.edit")</a> | <a
    		 href="persondetail?person_id=$person.Id">#springMessage("list.view")</a></td>
    	</tr>
    	#end
    </table>
    
    </body>
    </html>


Tag `#springMessage` membutuhkan satu argumen, yaitu nama yang kita berikan untuk tulisan tersebut. Ini akan menjadi jelas setelah kita lihat file text yang menampung tulisan tersebut, misalnya saya beri nama `messages.properties`.


### messages.properties



    
    
    list.edit = edit
    list.view = lihat
    
    personlist.title = Daftar Orang
    personlist.name = Nama
    personlist.email = Alamat Email


Setelah file tersebut siap, kita konfigurasi Spring agar membaca file tersebut. Lokasi konfigurasinya ada di `tutorial-servlet.xml`. Berikut isinya.


### tutorial-servlet.xml



    
    
    <bean id="messageSource"
          class="org.springframework.context.support.ResourceBundleMessageSource"
          p:basename="messages" />


Nah, silahkan deploy ulang aplikasinya. Sekarang semua tulisan yang tampil sudah bisa dikonfigurasi melalui text file.

Selanjutnya, bagaimana mengakses file tulisan tersebut dari kode Java? Kita membutuhkannya untuk menampilkan pesan error dari hasil import data.

Mudah saja, langsung saja gunakan object `messageSource` yang sudah kita deklarasikan tadi. Kita dapat mendapatkan object tersebut dengan menggunakan dependency injection. Berikut adalah kode PersonCSVParser yang akan menggunakan `messageSource`.


### PersonCSVParser.java



    
    
    package tutorial.spring25.helper;
    
    @Component
    public class PersonCSVParser {
        private MessageSource messageSource;
    
        @Autowired(required=true)
        public void setMessageSource(MessageSource messageSource) {
            this.messageSource = messageSource;
        }
    
        @SuppressWarnings("unchecked")
        public void parse(List<String> data, List<Person> result, List<ParseError> errors) {
    
            -- snip --
    
            // check for malformed data
            if(tokenizer.countTokens() != PERSON_NUM_FIELDS) {
                errors.add(new ParseError(
                    counter, text,
                    messageSource.getMessage(
                        "parseerror.reason.malformed",
                        new Object[]{2,tokenizer.countTokens()},
                        Locale.getDefault()
                    )
                ));
            }
    
            -- snip --
    
            if(bindErrors.hasErrors()) {
                List<ObjectError> bindErrorContent = bindErrors.getAllErrors();
    
                for (ObjectError objectError : bindErrorContent) {
                    errors.add(new ParseError(
                        counter, text,
                        messageSource.getMessage(
                            objectError.getCode(),
                            objectError.getArguments(),
                            Locale.getDefault()
                        )
                    ));
                }
            }
    
            result.add(person);
        }
    }


Nah, mudah bukan? Karena itu, dari hari pertama coding, langsung saja siapkan aplikasi Anda untuk i18n.
