---
comments: true
date: 2008-01-17 10:21:58
layout: post
slug: aplikasi-web-spring25-4
title: Aplikasi Web dengan Spring 2.5 [bagian 4]
wordpress_id: 323
categories:
- java
---

Belajar membuat aplikasi web belum lengkap tanpa tahu caranya mengupload file dan mengelola state. Pada artikel ini kita akan belajar tentang cara menangani upload file dengan Spring MVC versi 2.5. Di artikel selanjutnya baru kita akan bahas tentang state management. 

Studi kasus kita kali ini sederhana saja. Kita sudah punya aplikasi buku alamat sederhana pada rangkaian artikel sebelumnya. Kita sudah bisa [menampilkan daftar data orang](http://software.endy.muhardin.com/java/aplikasi-web-spring25-1/), [mengedit data yang sudah ada atau menambah data baru](http://software.endy.muhardin.com/java/aplikasi-web-spring25-2/), serta [menggunakan template untuk header dan footer](http://software.endy.muhardin.com/java/aplikasi-web-spring25-3/). Kali ini kita akan membuat fasilitas import data berupa text file berformat Comma Separated Value (CSV). 



File yang akan kita import kira-kira berbentuk seperti ini: 

    
    
    Endy Muhardin,endy.muhardin@gmail.com
    Hadikusuma Wahab,dhiku@artivisi.com
    Ifnu Bima,ifnubima@gmail.com
    



Setelah file tersebut diupload, kita akan memasukkan masing-masing data ke dalam database. Setelah itu, user akan kita arahkan ke halaman daftar data orang, sehingga data yang baru saja diupload bisa dilihat. 

Untuk melakukan upload, kita harus membuat HTML form dengan _encoding type_ multipart form data. Artinya, data kita akan dikirim melalui HTTP POST dalam beberapa bagian (multipart). Kira-kira mekanismenya mirip dengan mengirim attachment melalui email. 

Berikut adalah kode program HTMLnya. 



### personuploadform.html




    
    
    <html>
    
    <head><title>:: Upload Person Data ::</title></head>
    
    <body>
    
    <h1>Upload Person Data</h1>
    
    <form method="POST" enctype="multipart/form-data">
    
    <table>  
      <tr>
        <td><label for="file">Person Data</label></td>
        <td><input type="file" name="persondata"></td>
      </tr><tr>
      	<td> </td>
      	<td><input type="submit" class="inputbutton" value="Upload"/></td>
      </tr>
    </table>
    
    </form>
    
    </body>
    
    </html>
    



Perhatikan tag form. Di sana ada satu hal yang berbeda, yaitu `enctype="multipart/form-data"`. Semua aplikasi web yang ingin mengupload file harus membuat tag form seperti itu, apapun bahasa pemrograman yang digunakan. Ini sering menimbulkan kebingungan di kalangan pemula. 



> 
Saya sudah ikuti semua instruksi, tapi kenapa file yang diupload tidak terbaca?




Untuk menerima file, kita gunakan `input type="file"`. 

Selanjutnya masuk ke kode Java. Untuk menampilkan dan memproses form ini, kita buatkan class PersonUploadController. Bentuknya mirip dengan PersonFormController yang kemarin sudah kita buat. Ada method untuk menampilkan halaman form, dan ada method untuk memproses data yang dikirim user. Berikut class PersonUploadController. 



### PersonUploadController.java




    
    
    package tutorial.spring25.ui.springmvc;
    
    @Controller
    @RequestMapping("/personuploadform")
    public class PersonUploadController {
      private static final Log LOG = LogFactory.getLog(PersonUploadController.class);
      private PersonCSVParser personDataParser;
      private PersonDao personDao;
    
      @Autowired(required=true)
      public void setPersonDao(PersonDao personDao) {
        this.personDao = personDao;
      }
    
      @Autowired(required=true)
      public void setPersonDataParser(PersonCSVParser personDataParser) {
        this.personDataParser = personDataParser;
      }
    		
      @RequestMapping(method=RequestMethod.GET)
      public ModelMap displayForm(){
        return new ModelMap();
      }
    	
      @RequestMapping(method=RequestMethod.POST) 
      public String processForm(@RequestParam("persondata") MultipartFile file) {
        // parse file into list of strings
        List contents = new ArrayList();
        try {
          BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
          String content = reader.readLine();
          while(content != null) {
    					
            if("".equals(content)) {
              content = reader.readLine();
              continue;
            }
            contents.add(content);
            content = reader.readLine();
          }
          reader.close();
        } catch (IOException e) {
          LOG.warn(e.getMessage(), e);
        }
    			
        // parse list of strings into list of Persons
        List persons = new ArrayList();
        List errors = new ArrayList();
        personDataParser.parse(contents, persons, errors);
    
        for (Person person : persons) {
          personDao.save(person);
        }
        
        return "redirect:personlist"
      }
    }
    



Logika kode di atas tidak sulit. Untuk mendisplay form, praktis tidak ada yang perlu dilakukan. Kita cukup memberikan model kosong, karena form upload tidak membutuhkan data apa-apa. 

Pada saat memproses form, kita menerima parameter MultipartFile. Ini adalah file yang sudah diparsing oleh Spring. Parameter ini diambil dari input form dengan nama `persondata`. 

Supaya Spring bisa memisahkan file yang diupload dari keseluruhan HttpRequest, kita harus menyediakan resolver. Ada dua library yang biasa digunakan orang untuk memproses file upload, yaitu: 

  * [Jakarta Commons FileUpload](http://commons.apache.org/fileupload/)
  * [COS (com.oreilly.servlet)](http://www.servlets.com/cos/)

Spring mendukung kedua library. Saya biasanya menggunakan Jakarta Commons. Untuk mengaktifkan dukungan ini, kita perlu menambahkan resolver di konfigurasi DispatcherServlet. 



### tutorial-servlet.xml



    
    
    <bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
      <property name="maxUploadSize" value="1000000"/>
    </bean>
    



Setelah file didapat, kita lalu membaca isinya. Hanya operasi I/O standar di sini. Kita membuka `InputStream` yang dibungkus dengan `BufferedReader` yang memiliki method `readLine` yang praktis. Kemudian kita looping setiap baris. Jangan lupa untuk memeriksa baris kosong. Hasil pembacaan file kita simpan ke List<String> untuk pemrosesan selanjutnya. 

Pemrosesan String menjadi Person kita lakukan di class PersonCSVParser supaya ada pembagian tanggung jawab yang jelas. Memisahkan parser di class tersendiri akan memudahkan kita untuk mengetes kode parser tersebut. 

PersonCSVParser tidak ditampilkan di sini. Bagi yang ingin melihat kode programnya dapat langsung pergi ke [Github](https://github.com/endymuhardin/hello-spring-25/blob/master/src/java/tutorial/spring25/helper/PersonCSVParser.java). Demikian juga kelengkapannya, seperti: 

  * [PersonCSVParserTest](https://github.com/endymuhardin/hello-spring-25/blob/master/src/java/test/spring25/helper/PersonCSVParserTest.java)
  * [person.csv](https://github.com/endymuhardin/hello-spring-25/blob/master/fixtures/person.csv) : sampel data test, semua data normal
  * [person-with-malformed-emails.csv](https://github.com/endymuhardin/hello-spring-25/blob/master/fixtures/person-with-malformed-emails.csv) : sampel data test, ada email yang formatnya salah

Setelah data diproses menjadi kumpulan Person, kita looping lagi untuk menyimpan hasilnya ke database dengan menggunakan `personDao`.

Terakhir, setelah semua selesai, kita redirect ke halaman daftar orang. Seharusnya kita menampilkan hasil upload. Mana data yang error, dan mana data yang sukses diimpor. Tapi materi ini membutuhkan pengetahuan tentang session, yang akan kita bahas pada artikel mendatang. 

Selamat mencoba. 
