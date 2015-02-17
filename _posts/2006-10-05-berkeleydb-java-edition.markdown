---
comments: true
date: 2006-10-05 10:53:37
layout: post
slug: berkeleydb-java-edition
title: BerkeleyDB Java Edition
wordpress_id: 179
categories:
- java
---

Beberapa waktu yang lalu, ada posting menarik tentang [Google yang menggunakan BerkeleyDB untuk mengelola user accountnya](http://epsilondelta.net/2006/10/01/web-apps-why-does-statelessness-stop-at-the-database/ "Stateless Database @ Google"). Karena penasaran, saya lalu mencoba mendownload dan bermain-main dengan BerkeleyDB versi Java (Java Edition).

BerkeleyDB adalah produk embedded database open source yang populer. Belum lama ini dia diakuisisi oleh Oracle, sehingga membuat produk ini makin terkenal lagi. 

Pada tulisan kali ini, kita akan mencoba menggunakan BDB Java Edition.

Tapi jangan salah paham dengan namanya. BerkeleyDB adalah database, tapi bukan relational database. Artinya, dia tidak memiliki fasilitas SQL. Walaupun demikian, dia mendukung ACID transaction. Salah satu contoh penggunaan BDB adalah pada aplikasi version control Subversion. 

Kalau tidak ada SQLnya, bagaimana kita melakukan operasi CRUD? Jawabnya adalah, anggap saja BDB sebagai Map. Kita bisa menggunakan Map seperti ini: 

    
    
        Map myMap = new HashMap();
        myMap.put(1, "Endy");
    

   
Maka object String akan disimpan dengan key 1. Object ini dapat diambil dengan kode:

    
    
        String data = myMap.get(1);
    


Bagi mereka yang sudah pernah mendengar Object Database tentunya sudah familiar dengan konsep seperti ini. Salah satu implementasi konsep ini adalah [db40][] atau [Prevayler][]. 

Sekarang, coba kita gunakan contoh kasus yang standar. Ada class Person yang akan kita buatkan operasi CRUD-nya. Berikut kodenya:



### Person.java



    
    
        package tutorial.berkeleydb;
        
        import java.util.Date;
        
        import com.sleepycat.persist.model.Entity;
        import com.sleepycat.persist.model.PrimaryKey;
        
        @Entity
        public class Person {
                
                @PrimaryKey(sequence="ID")
                private Integer id;
                private String name;
                private Date birthdate;
                private String email;
                
                public Person(){
                        
                }
                
                public String getEmail() {
                        return email;
                }
                public void setEmail(String address) {
                        this.email = address;
                }
                public Date getBirthdate() {
                        return birthdate;
                }
                public void setBirthdate(Date birthdate) {
                        this.birthdate = birthdate;
                }
                        
                public Integer getId() {
                        return id;
                }
                public void setId(Integer id) {
                        this.id = id;
                }
                public String getName() {
                        return name;
                }
                public void setName(String name) {
                        this.name = name;
                }
        }
    


Perhatikan bahwa untuk menjadikan class Person persistent, kita hanya perlu menambahkan annotation, mirip dengan JPA atau Hibernate. Sekarang mari kita definisikan interface CRUD-nya. 



### PersonDao.java



    
    
        package tutorial.berkeleydb;
        
        import java.util.List;
        
        public interface PersonDao {
                public void save(Person p);
                public void delete(Person p);
                public Person getById(Integer id);
                public List<Person> getAll();
        }
    


Dan berikut adalah implementasinya. 



### PersonDaoBerkeleyDB



    
    
        package tutorial.berkeleydb;
        
        import java.util.ArrayList;
        import java.util.Iterator;
        import java.util.List;
        
        import com.sleepycat.je.DatabaseException;
        import com.sleepycat.persist.EntityCursor;
        import com.sleepycat.persist.EntityStore;
        import com.sleepycat.persist.PrimaryIndex;
        
        public class PersonDaoBerkeleyDB implements PersonDao {
        
                private PrimaryIndex<Integer, Person> personPrimaryKey;
                
                public PersonDaoBerkeleyDB(EntityStore storage) {
                        try {
                                personPrimaryKey = storage.getPrimaryIndex(Integer.class, Person.class);
                        } catch (DatabaseException e) {
                                e.printStackTrace();
                        }
                }
                
                public void delete(Person p) {
                        try {
                                personPrimaryKey.delete(p.getId());
                        } catch (DatabaseException e) {
                                e.printStackTrace();
                        }
                }
        
                public List<Person> getAll() {
                        List<Person> result = new ArrayList<Person>();
                        try {
                                EntityCursor<Person> allPerson = personPrimaryKey.entities();
                                Iterator<Person> iter = allPerson.iterator();
                                while (iter.hasNext()) {
                                        result.add(iter.next());
                                }
                                allPerson.close();
                        } catch (DatabaseException e) {
                                e.printStackTrace();
                        }
                        return result;
                }
        
                public Person getById(Integer id) {
                        try {
                                return personPrimaryKey.get(id);
                        } catch (DatabaseException e) {
                                e.printStackTrace();
                        }
                        return null;
                }
        
                public void save(Person p) {
                        try {
                                personPrimaryKey.put(p);
                        } catch (DatabaseException e) {
                                e.printStackTrace();
                        }		
                }
        
        
        }
    


Sebagai perbandingan, berikut kode CRUD menggunakan Hibernate dengan bantuan Spring. 

    
    
        public class PersonDaoHibernate extends HibernateDaoSupport implements PersonDao{
            public void save(Person p){
                getHibernateTemplate().save(p);
            }
            
            public void delete(Person p){
                getHibernateTemplate().delete(p);
            }
            
            public Person getById(Integer id){
                Person result = null;
                try {
                        result = (Person) getHibernateTemplate().load(Person.class, id);
                        getHibernateTemplate().initialize(result);
                } catch (ObjectRetrievalFailureException e) {
                        log.log(Level.WARNING, "no object with id:"+id+" in database");
                }
                return result;
            }
            
            public List<Person> getAll(){
                return getHibernateTemplate().find("from Person p");
            }
        }
    


Oh iya, contoh kode BDB di atas dapat diujicoba dengan membuat Main class sebagai berikut: 



### Main.java



    
    
        package tutorial.berkeleydb;
        
        import java.io.File;
        
        public class Main {
                private static EntityStore store;
                private static Environment env;
                
                public static void main(String[] args) throws Exception {
                        openDatabase();
                        
                        Person endy = new Person();
                        endy.setName("Endy Muhardin");
                        endy.setBirthdate(new SimpleDateFormat("dd-MM-yyyy").parse("17-08-1945"));
                        endy.setEmail("endymuhardin@yahoo.com");
                        
                        PersonDao dao = new PersonDaoBerkeleyDB(store);
                        dao.save(endy);		
                        System.out.println("======== Create one person with ID:"+endy.getId()+" ========");
                        
                        System.out.println("======== Display all person from database ========");
                        List<Person> all = dao.getAll();
                        for (Person person : all) {
                                displayPerson(person);
                        }
                        
                        System.out.println("======== Add one more person to database ========");
                        Person khalisa = new Person();
                        khalisa.setName("Khalisa Alayya");
                        khalisa.setBirthdate(new SimpleDateFormat("dd-MM-yyyy").parse("31-12-2000"));
                        khalisa.setEmail("me@khalisa.web.id");
                        dao.save(khalisa);
                        
                        System.out.println("======== Display all person from database ========");
                        all = dao.getAll();
                        for (Person person : all) {
                                displayPerson(person);
                        }
                        
                        System.out.println("======== Get person by ID "+endy.getId()+" from database ========");
                        Person endyFromDb = dao.getById(endy.getId());		
                        displayPerson(endyFromDb);
                        
                        System.out.println("======== Change person data with ID "+endy.getId()+" from database ========");
                        endyFromDb.setEmail("endy.muhardin@gmail.com");
                        dao.save(endyFromDb);
                        
                        System.out.println("======== Display person with ID "+endy.getId()+" after update ========");
                        Person endyFromDb2 = dao.getById(endy.getId());		
                        displayPerson(endyFromDb2);
                        
                        closeDatabase();
                }
                
                private static void displayPerson(Person person) {
                        System.out.println("ID : "+person.getId());
                        System.out.println("Name : "+person.getName());
                        System.out.println("Birthdate : "+person.getBirthdate());
                        System.out.println("Address : "+person.getEmail());
                }
                
                private static void openDatabase(){				
                        try {			
                                EnvironmentConfig config = new EnvironmentConfig();
                                config.setAllowCreate(true);
                                config.setTransactional(true);
                                
                                env = new Environment(new File("database"), config);
                                
                                StoreConfig storeConfig = new StoreConfig();
                                storeConfig.setAllowCreate(true);
                                storeConfig.setTransactional(true);
                                
                                store = new EntityStore(env, "PersonDatabase", storeConfig);			
                        } catch (DatabaseException e) {
                                e.printStackTrace();
                        }			
                }
                
                private static void closeDatabase() {
                        try {
                                store.close();
                                env.close();
                        } catch (DatabaseException e) {
                                e.printStackTrace();
                        }
                }
        }
    


Selain contoh kode yang ditampilkan di sini, sebetulnya BDB juga mendukung asosiasi One to One, One to Many, dan Many to Many. Sayang sekali saya belum sempat coba.
    
Dari percobaan sederhana ini, kita dapat menarik beberapa sisi positif dan negatif dari BerkeleyDB, juga kemungkinan kasus yang tepat dan tidak tepat untuk menggunakan BDB. 



### Positif


*  Ukuran jar kecil. Hanya butuh 1.1 MB untuk jar-nya BDB. Bandingkan jika kita gunakan MySQL + Hibernate. Jar mysql-connector 430KB, hibernate.jar 2MB, hibernate-annotation.jar 300KB, dependensi lainnya seperti ehcache, jta, cglib, asm, dan lainnya bisa mencapai 7MB total.
*  Tidak perlu berkutat dengan SQL. Object oriented 100%
*  Karena embedded, sangat cepat. Akses data instan langsung ke sumbernya. Bandingkan dengan rantai MySQL-network-hibernate-spring-aplikasi. Bagaikan langit dan bumi.



### Negatif


*  Karena embedded, sulit dimanipulasi dengan tools lain. Berbeda dengan database RDBMS yang bisa diakses menggunakan command line, web-based interface, atau database management tools.
*  Karena tidak support SQL, tidak bisa dimanipulasi aplikasi lainnya. Misalnya aplikasi reporting. 
*  Untuk sharing data dengan aplikasi lain, kita harus buatkan API via Java atau XML. 
*  BDB mengandalkan Serialization untuk menyimpan object ke dalam database. Siapapun yang sudah pernah belajar Serialization pasti tahu bahwa penyakitnya ada pada class evolution. Kalau class kita berubah --misalnya menambah atau mengurangi field, apalagi rename class-- BDB akan bingung, dan kita harus menulis kode program untuk melakukan migrasi.     



### Kapan menggunakan BDB


*  Data yang disimpan hanya digunakan sendiri. Misalnya penyimpanan data session HTTP, cache untuk username dan password, dsb.
*  Butuh kecepatan extra tinggi dan pemrograman yang mudah. Misalnya kita membuat server SMS gateway atau message processing. Butuh kecepatan tinggi, dan datanya kecil kemungkinan digunakan aplikasi lain. 
*  Anda termasuk orang yang living on the edge. Selalu menggunakan tools yang aneh dan terbaru.



### Kapan menggunakan RDBMS


*  Data harus bisa diakses aplikasi lain seperti reporting.
*  Data berjumlah besar, sehingga sulit untuk dimigrasi apabila terjadi refactoring. (Ingat masalah Serialization) 
*  Perusahaan sudah terlanjur beli Oracle atau DB2.  

Demikianlah .. semoga bermanfaat. 
:D

[db40]: http://www.db4o.com/ "DB4Object"
[Prevayler]: http://www.prevayler.org "Prevalence Layer"

