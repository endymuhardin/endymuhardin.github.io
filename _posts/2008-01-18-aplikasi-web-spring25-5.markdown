---
comments: true
date: 2008-01-18 09:15:08
layout: post
slug: aplikasi-web-spring25-5
title: Aplikasi Web dengan Spring 2.5 [bagian 5]
wordpress_id: 326
categories:
- java
---

Aplikasi web --berbeda dengan aplikasi desktop-- ditakdirkan untuk stateless. Artinya dia tidak menyimpan data untuk masing-masing user yang sedang aktif. Keputusan ini menyebabkan aplikasi web bisa diakses jutaan user sekaligus. Tapi juga menyebabkan perlu teknik khusus agar data user yang sedang aktif dapat disimpan dengan baik. 

Tanpa kemampuan penyimpanan state, semua data yang dikirim user akan hilang setelah dia pindah halaman. Misalnya user: 

  1. mengisi form 1, kemudian menekan tombol Next
  2. mengisi form 2, kemudian menekan tombol Next
  3. tiba di form 3. Pada saat ini, data yang diisi di form 1 sudah hilang

Sebelum kita melihat kode program dengan Spring 2.5, terlebih dulu kita bahas konsepnya.



Data user yang kita bicarakan di sini adalah data sementara. Contoh klasik dari state user yang harus disimpan antara lain: 

  * kita berbelanja online. Barang-barang yang sudah kita pilih, tapi belum kita pesan, ini harus disimpan oleh aplikasi. Data ini sering disebut dengan istilah shopping cart (atau troli belanja)
  * kita sudah login untuk melihat email. Selama kita belum menyatakan selesai (dengan cara logout), kita ingin aplikasi menyimpan username dan password kita. Sehingga kita tidak perlu memasukkan username dan password setiap kali pindah dari satu email ke email lain. 
  * kita mengisi form secara bertahap (wizard-style). Keseluruhan rangkaian proses baru berakhir pada saat form terakhir diisi. Tanpa state management yang baik, kita tidak bisa menggunakan rangkaian form. Kita terpaksa menggunakan satu form yang sangat panjang, dan menyuruh user mengisinya sekaligus dalam satu kali proses.




Contoh yang kita sebutkan di atas membahas tentang data sementara yang harus dikelola sebelum disimpan ke database. Umurnya relatif lebih pendek daripada data permanen yang disimpan di database. Misalnya, username dan password selama user membaca email, disimpan dalam jangka waktu beberapa jam saja. Data wizard mungkin hanya disimpan beberapa menit saja, sampai form terakhir selesai dan keseluruhan data disimpan ke database. Walaupun beberapa situs, seperti Amazon, mungkin saja menyimpan data shopping-cart kita selama berbulan-bulan. 

Ada beberapa cara yang dapat kita pilih untuk menyimpan state. Setidaknya ada dua pilihan lokasi : 
  
  * di client. Dengan menggunakan mekanisme cookie, kita dapat menyimpan data di browser client. Cara ini tidak membebani server, tapi kapasitas cookie di client relatif kecil. Kita tidak bisa menyimpan data yang terlalu banyak di cookie.
  * di server. Mekanismenya mirip dengan kalau kita belanja di hypermarket. Tas dan jaket kita titipkan di pintu masuk, kemudian kita akan diberikan token. Pada waktu kita keluar, token kita tukarkan dengan barang yang kita titipkan.




Demikian juga dengan penyimpanan state. Ketika user pertama kali datang, dia akan mendapat token atau session ID. Aplikasi menyimpan state user di lokasi tertentu yang ditandai dengan session ID tersebut. Setiap request yang datang akan dilihat session IDnya dan datanya diambil untuk diproses.



Ada beberapa cara untuk menitipkan token pada user, beberapa yang sering digunakan antara lain: 

  * masukkan ke cookie. Ya kita pakai cookie lagi, tapi tidak menyimpan keseluruhan data state, melainkan cuma session ID saja.
  * disisipkan di setiap link dan form. URL yang tadinya seperti ini : `http://localhost/aplikasi/personlist` menjadi seperti ini: `http://localhost/aplikasi/personlist?session_id=12a75tj67`.
  * dikirim ke server sebagai HTML input. Biasanya tipe yang dipilih adalah _hidden_. Cara ini memiliki kelemahan, karena tidak semua request bisa dibungkus dalam form.




Data state yang disimpan di server juga memiliki beberapa pilihan lokasi penyimpanan, antara lain: 

  * di webserver. Webserver menulis satu file per satu session. Semua data disimpan di sini. Cara ini paling mudah dikonfigurasi, sehingga banyak webserver menjadikan cara ini sebagai default. Kelemahannya, metode ini menyulitkan kita untuk mengcluster webserver, karena kita kemudian harus memikirkan bagaimana mensinkronisasikan data session di masing-masing anggota cluster
  * di database. Webserver dikonfigurasi agar menyimpan datanya di database. Cara ini cukup sulit, mengingat dialek SQL masing-masing database berbeda. Banyak vendor webserver tidak mau menulis adapter untuk masing-masing merek database, sehingga kita harus periksa dulu apakah database yang kita gunakan didukung atau tidak. Bila tidak, kita terpaksa menulis sendiri kode program untuk state management.
  * di distributed cache. Ada beberapa aplikasi cache yang mengkhususkan diri untuk menyimpan data secara terdistribusi, misalnya [memcached]( name=) yang open source atau [Oracle Coherence](http://www.oracle.com/technology/products/coherence/index.html) yang berbayar. Penyimpanan ini bisa dicluster sendiri, terpisah dari webserver. Dengan pendekatan ini, kita bisa mengcluster webserver sesuka hati, karena statenya tidak disimpan webserver, melainkan dititipkan di distributed cache. Kelemahan cara ini sama dengan metode database. Tidak semua webserver menyediakan support. Kadang kita harus tulis kodenya sendiri.
  * di upstream layer. Beberapa orang menggunakan arsitektur empat layer : client - web layer - application layer - database. Dengan arsitektur ini, semua state disimpan di application layer. Biasanya server yang digunakan untuk application layer memiliki mekanisme state management yang lebih baik daripada webserver. Terutama jika kita ingin melakukan clustering.




Sekarang setelah kita mengerti konsepnya, mari kita implementasikan pada contoh aplikasi kita. Kita akan menggunakan state management untuk menampilkan hasil upload data Person. 

Kode upload kita kemarin bekerja sebagai berikut : 

  1. user melakukan upload dengan mensubmit form
  2. server memproses, kemudian mengirim redirect ke halaman berikut
  3. browser menerima perintah redirect, kemudian melakukan request GET ke URL lain sesuai perintah redirect
  4. server menerima request GET, kemudian melakukan proses dan merender hasilnya
  5. browser menampilkan respon dari server

Teknik ini sering disebut Post-Redirect-Get (PRG) pattern.

Kesalahan umum programmer web pemula adalah memproses form sebagai berikut: 

  1. user melakukan upload dengan mensubmit form
  2. server memproses, kemudian merender hasilnya
  3. browser menampilkan respon dari server

Bila user merefresh halaman hasil, maka yang dilakukan browser adalah mengulang dari langkah 1. Ini akan mengakibatkan form tersubmit dua kali. Berbeda dengan teknik PRG, kalau user merefresh halaman hasil, maka browser akan mengulangi dari langkah ketiga, yaitu GET untuk halaman hasil. Dengan demikian form tidak disubmit dua kali. 

Kita menghadapi tantangan untuk mengimplementasikan PRG pada halaman upload result. Kalau hanya sekedar pesan sukses, kita bisa membuat redirect ke `http://localhost/aplikasi/personuploadresult?msg=Sukses`. Tapi yang ingin kita tampilkan adalah daftar yang memuat mana data yang sukses diimport, dan mana data yang gagal. Sulit untuk dikirim melalui URL. 

Untuk itu, kita harus simpan data tersebut di session. Berikut adalah kode pemrosesan upload yang sudah dimodifikasi. 



### PersonUploadController.java




    
    
    package tutorial.spring25.ui.springmvc;
    
    @Controller
    @RequestMapping("/personuploadform")
    public class PersonUploadController {
        private static final Log LOG = LogFactory.getLog(PersonUploadController.class);
        private static final String REDIRECT_PERSONUPLOADRESULT = "redirect:personuploadresult";
    
    
        @RequestMapping(method=RequestMethod.POST) 
        public String processForm(@RequestParam("persondata") MultipartFile file, final HttpSession session) {
    
            // parse file into list of strings
            List<String> contents = new ArrayList<String>();
            try {
                BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                String content = reader.readLine();
                while(content != null) {
                    contents.add(content);
                    content = reader.readLine();
                }
                reader.close();
            } catch (IOException e) {
                LOG.warn(e.getMessage(), e);
            }
    
    
            // parse list of strings into list of Persons
            List<Person> persons = new ArrayList<Person>();
            List<ParseError> errors = new ArrayList<ParseError>();
            personDataParser.parse(contents, persons, errors);
    
            for (Person person : persons) {
                personDao.save(person);
            }
    
            session.setAttribute(Constants.PERSONUPLOAD_ERRORS_KEY, errors);
            session.setAttribute(Constants.PERSONUPLOAD_SUCCESS_KEY, persons);
        
            return REDIRECT_PERSONUPLOADRESULT;
        }
    }
    





Perhatikan dua baris `session.setAttribute` di bagian bawah. 
Setelah menyimpan data di session, kita redirect ke halaman hasil.

Pada halaman hasil, terlebih dulu kita pindahkan data hasil upload dari session ke request. Kemudian data yang ada di session kita hapus, agar tidak membebani memori ataupun kapasitas penyimpanan server. Lalu baru kita render tampilannya. 

Berikut adalah kode untuk memindahkan data dari session ke request. Terletak di class `PersonController`, dalam method `uploadResult`.


### PersonController



    
    
    package tutorial.spring25.ui.springmvc;
    
    @Controller
    public class PersonController {	
    
        @RequestMapping("/personuploadresult")
        public ModelMap uploadResult(final HttpSession session){
            final ModelMap modelMap = new ModelMap();
    
            if (session.getAttribute(Constants.PERSONUPLOAD_SUCCESS_KEY) != null) {
    
                modelMap.addAttribute(
                    session.getAttribute(Constants.PERSONUPLOAD_SUCCESS_KEY)
                );
    
                session.removeAttribute(Constants.PERSONUPLOAD_SUCCESS_KEY);
            }
    
            if (session.getAttribute(Constants.PERSONUPLOAD_ERRORS_KEY) != null) {
    
                modelMap.addAttribute(
                    session.getAttribute(Constants.PERSONUPLOAD_ERRORS_KEY)
                );
    
                session.removeAttribute(Constants.PERSONUPLOAD_ERRORS_KEY);
            }
    
            return modelMap;
        }
    }
    






Dan ini adalah template yang digunakan untuk menampilkan hasil upload. 


### personuploadresult.html



    
    
    <html>
    
      <head><title>:: Person Upload Result ::</title></head>
    
      <body>
    
        <h1>Person Upload Result</h1>
    
        <h2>Successfully Imported Person Data</h2>
        #if (!$personList ||  ${personList.isEmpty()})
    
          <h3>No Data</h3>
    
        #else
    
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
            <td>
              <a href="personform?id=$person.Id">edit</a> | 
              <a href="persondetail?id=$person.Id">view</a>
            </td>
          </tr>
          #end
        </table>
    
        #end
    
    
        <h2>Erroneous Data</h2>
        #if (!$parseErrorList ||  ${parseErrorList.isEmpty()})
     
        <h3>No Data</h3>
    
        #else
    
        <table border="0" cellpadding="2" cellspacing="2">
          <tr>
            <th>Row</th>
            <th>Data</th>
            <th>Reason</th>
          </tr>
    
          #foreach($error in $parseErrorList)
          <tr>
            <td>$error.Line</td>
            <td>$error.Text</td>
            <td>$error.Reason</td>
          </tr>
          #end
        </table>
        #end
    
      </body>
    </html>
    






Di framework Ruby on Rails, sudah ada dukungan untuk kegiatan ini, namanya flash message. Flash message akan menyimpan data di session, kemudian menghapusnya pada request berikutnya. 

Pada artikel ini kita sudah melakukan state management sederhana. Untuk kemampuan yang lebih canggih seperti pengelolaan shopping cart atau wizard, kita bisa menggunakan framework Spring Web Flow. Dengan SWF, flow aplikasi bisa diedit secara grafis. Ini akan memudahkan kita untuk mendokumentasikan flow navigasi aplikasi.

![Spring Web Flow Editor ](/images/uploads/2008/01/webflow_editor.png)

Gambar diambil dari [situsnya SWF](http://springide.org/project/wiki/WebFlowEditorUsage).
