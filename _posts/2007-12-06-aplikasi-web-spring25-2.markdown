---
comments: true
date: 2007-12-06 11:27:16
layout: post
slug: aplikasi-web-spring25-2
title: Aplikasi Web dengan Spring 2.5 [bagian 2]
wordpress_id: 317
categories:
- java
---

Pada artikel Spring bagian ketiga ini, kita akan membuat form untuk mengedit data Person. Di sini kita akan lihat kemampuan form binding dari Spring, cara menyuplai data ke form, melakukan validasi, dan memproses form ketika tombol Submit ditekan. 


Kita akan menggunakan template yang sama untuk pengeditan Person yang sudah ada maupun pendaftaran Person baru. Templatenya bernama personform.html. Berikut kodenya. 


### personform.html



    
    
    <html>
    
    <head>
    <title>:: Edit Person ::</title>
    </head>
    
    <body>
    <form method="POST">
    <input type="hidden" name="id" value="$!person.Id">
    
    <table>
      <tr>
        <td>Nama</td>
        <td><input type="text" name="name" value="$!person.Name"></td>
      </tr>
      <tr>
        <td>Email</td>
        <td><input type="text" name="email" value="$!person.Email"></td>
      </tr>
      <tr>
        <td colspan="2"><input type="submit" value="Save"></td>
      </tr>
    </table>
    
    </form>
    </body>
    
    </html>
    



Kita melihat ada variabel yang agak berbeda pada contoh di atas, yaitu $!person. Ini merupakan variabel opsional dalam Velocity. Bila variabel $person tidak ada isinya, Velocity akan menampilkan apa adanya, yaitu $person ke halaman web. Kita ingin bila $person null, jangan tampilkan apa-apa. Untuk itu, kita mengubah variabel $person menjadi $!person. 

Kalau dijadikan kode Java, kira-kira $!person sama dengan ini: 

    
    
    String personName;
    if(person != null && person.getName() != null) {
      personName = person.getName();
    } else {
      personName = "";
    }
    



Variabel $!person ini digunakan karena form ini menangani New Person dan juga Edit Person. Untuk kasus Edit Person, kita dapat memberikan object person yang sudah ada di database. Sedangkan untuk New Person, objectnya belum ada atau null. Dengan $!person, kita dapat menangani kedua skenario ini. 

Berikut kerangka class PersonFormController. 

    
    
    package tutorial.spring25.ui.springmvc;
    
    @Controller
    @RequestMapping("/personform")
    public class PersonFormController {	
      private PersonDao personDao;
    
      @Autowired
      public void setPersonDao(final PersonDao personDao) {
        this.personDao = personDao;
      }
    
      @RequestMapping(method = RequestMethod.GET)
      public ModelMap displayForm(@RequestParam(value = "person_id", required = false) Long id) {
      
      }
    
      @RequestMapping(method = RequestMethod.POST)
      public String processForm(@ModelAttribute("person") Person person, BindingResult result, SessionStatus status) {
    
      }
    }
    



Ada dua method di sini, yaitu displayForm dan processForm. Yang satu untuk menampilkan form, dan satu lagi untuk memproses hasil submit. Nama method bebas saja, tidak ada aturan yang harus dipatuhi. 

Kedua method dimapping ke request /personform. Dengan demikian, request ke `http://localhost:8080/tutorial-spring25/tutorial/personform` akan memanggil class PersonFormController. Di dalam form htmlnya juga action setelah submit dikosongkan. Artinya, kalau dia disubmit, form tersebut akan memanggil URL yang sama dengan yang memanggilnya. 

Tetapi, bagaimana kita memilih kapan harus mendisplay form dan memproses form? Kita membedakannya dengan memasang annotation `@RequestMapping` dengan parameter `RequestMethod`. Bila requestnya GET (terjadi bila kita mengetik `http://localhost:8080/tutorial-spring25/tutorial/personform` di browser dan menekan Enter), maka jalankan method displayForm. Tapi bila requestnya POST (terjadi bila kita menekan tombol Submit di `personform.html`), maka jalankan method processForm. 

Sekarang mari kita isi method displayForm. Berikut isinya


    
    
    @RequestMapping(method = RequestMethod.GET)
    public ModelMap displayForm(@RequestParam(value = "person_id", required = false) Long id) {
      Person person = personDao.getById(id);
    
      if (person == null) person = new Person();
    
      return new ModelMap(person);
    }
    



Di sini kita melakukan binding untuk request parameter person\_id. Berbeda dengan tampilan detail pada artikel sebelumnya, di form ini parameter person\_id belum tentu ada. Bila kita membuat object Person baru, field id akan berisi null. Untuk itu, kita berikan parameter required yang bernilai false pada anotasi @RequestMapping.

Logika pada method ini tidak rumit. Ambil object Person dari database berdasarkan id. Kalau tidak ada, berikan saja object baru.

Method ini bisa langsung dicoba dengan mengakses personform dengan memberikan parameter person\_id, misalnya dengan URL http://localhost:8080/tutorial-spring25/tutorial/personform?person\_id=100. Tentunya kita harus memiliki record di tabel T_PERSON dengan id 100. Kalau codingnya benar, maka akan tampil form yang terisi dengan data record tersebut. 

Berikutnya, kita akan implementasi method untuk memproses form. Berikut isi method processForm


    
    
    @RequestMapping(method = RequestMethod.POST)
    public String processForm(@ModelAttribute("person") Person person) {
      personDao.save(person);
      return "redirect:personlist";
    }
    



Mudah kan? Cukup gunakan personDao untuk menyimpan object ke database, kemudian redirect ke halaman personlist. 

Begitu saja? Tidak ada yang lupa?

Ya untuk memproses form begitu saja langkahnya, tidak perlu susah-susah. 

Bagaimana dengan validasi? Mana ada form tanpa validasi.

Baiklah, mari kita tambahkan kode validasi. Untuk itu, method processForm perlu dimodifikasi menjadi seperti ini


    
    
    @RequestMapping(method = RequestMethod.POST)
    public String processForm(@ModelAttribute("person") Person person, BindingResult result, SessionStatus status) {
      new PersonValidator().validate(person, result);
      if (result.hasErrors()) {
        return "personform";
      } else {
        personDao.save(person);
        status.setComplete();
        return "redirect:personlist";
      }
    }
    



Tidak terlalu rumit, kan? Cukup buat class PersonValidator, kemudian jalankan method validate dengan input object person yang ingin divalidasi, dan object result untuk menampung error validasi bila ada. 

Selanjutnya, kita periksa object result. Bila ada errornya, kembali ke form. Bila tidak ada, langsung save dengan personDao, set status menjadi complete, dan redirect ke personlist. 

Isi class PersonValidator juga tidak banyak. Berikut kodenya.

    
    
    package tutorial.spring25.validator;
    public class PersonValidator {
    
      private static final String EMAIL_FORMAT = ".*@.*\\.com";
    
      public void validate(Person person, Errors errors) {
        // field nama harus diisi
        if(!StringUtils.hasText(person.getName())) {
          errors.rejectValue("name", "required", "nama harus diisi");
        }
    
        // bila field email diisi, formatnya harus benar
        if (StringUtils.hasLength(person.getEmail()) && !person.getEmail().matches(EMAIL_FORMAT) ) {
          errors.rejectValue("email", "email.format", "format email salah");
        }
      }
    }
    



Mudah bukan?

Para penggemar framework berbasis komponen (seperti Tapestry atau JSF) mungkin bertanya, untuk apa saya belajar lagi Spring MVC? Sepertinya tidak lebih mudah.

Coba perhatikan URL yang kita gunakan: 




  * http://localhost:8080/tutorial-spring25/tutorial/personlist


  * http://localhost:8080/tutorial-spring25/tutorial/persondetail?person_id=100


  * http://localhost:8080/tutorial-spring25/tutorial/personform


  * http://localhost:8080/tutorial-spring25/tutorial/personform?person_id=100



Semuanya bersih dan _bookmarkable_. Dengan Spring MVC kita bisa mengatur URL sesuai keinginan.

Selanjutnya, coba perhatikan kode Java kita. Jangankan lokasi template Velocity kita, bahkan dia tidak tahu menahu kalau kita pakai Velocity. Tugas kode Java cuma menerima input dan mengembalikan data. Terserah data itu mau diformat seperti apa. Dia tidak peduli teknologi view yang digunakan.

Implikasinya, selama data yang disuplai tidak berubah, hanya dengan mengubah konfigurasi kita dapat mengubah tampilan. Tentunya kita harus menyediakan template yang sesuai.

Kita bisa membuat template dengan teknologi yang lain, misalnya JSP, Freemarker, atau Jasper Report. Kita juga bisa merender tampilan tidak hanya dalam format HTML, tapi juga PDF, XLS, XML, JSON, plain-text, atau mengkonversinya menjadi grafik SVG.

Kelebihan lainnya, kita mengendalikan secara penuh output HTML aplikasi kita. Implikasinya, kita bisa menerapkan teknik-teknik teruji dalam protokol HTTP seperti [Cache Control pada HTTP Header](http://www.mnot.net/cache_docs/). 

Atau kita bisa manfaatkan [HTTP Response Code](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes) _304 Not Modified_ untuk memberi tahu client bahwa halaman yang dia akses belum berubah sejak terakhir diakses, sehingga client tidak mendownload lagi keseluruhan page, melainkan langsung menampilkan local cache-nya. 

Teknik seperti ini sederhana, mudah, sudah teruji di lapangan, berlaku untuk berbagai bahasa pemrograman, dan sangat efektif. Hanya dengan mengubah HTTP response code, kita bisa menghemat bandwidth dan mengurangi load application server. Sayangnya teknik ini belum tentu dapat digunakan pada framework yang terlalu canggih. Spring MVC memungkinkan kita untuk memanipulasi HTTP response dengan mudah kalau kita mau. 

Source code untuk rangkaian artikel ini sudah dipublish di GoogleCode. Anda bisa: 

  * [Checkout project](http://code.google.com/p/hello-spring-25/source)
  * [Download WAR](http://hello-spring-25.googlecode.com/files/tutorial-spring25.war) 
  * [Download JAR](http://hello-spring-25.googlecode.com/files/tutorial-spring25-winstone.jar) 
  * [ Download keseluruhan project folder](http://hello-spring-25.googlecode.com/files/tutorial-spring25.tar.bz2)

Jangan lupa membaca [instruksi untuk menjalankannya](http://code.google.com/p/hello-spring-25/). 


Demikian sekilas tentang framework Spring MVC. Semoga bermanfaat.
