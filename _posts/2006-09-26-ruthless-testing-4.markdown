---
comments: true
date: 2006-09-26 12:39:44
layout: post
slug: ruthless-testing-4
title: Ruthless Testing 4
wordpress_id: 136
categories:
- java
---

Database testing merupakan suatu kegiatan yang sulit, apalagi dalam dunia Java. Bayangkan saja, untuk melakukan testing database, kita harus melakukan : 




  1. Membuat skema database. Skema terdiri dari dari tabel, constraint, view, dan lainnya. 


  2. Mengisi sampel data.


  3. Mengeksekusi query.


  4. Periksa ke database untuk memastikan hasilnya benar. 


  5. Koreksi atau lanjutkan sesuai dengan hasil di nomer 4. 



Semua kegiatan di atas sangat membosankan dan melelahkan untuk diulang-ulang setiap kali melakukan perubahan kode program. Akibatnya programmer menjadi bosan dan malas mengetes kode programnya. Padahal kode akses database merupakan salah satu bagian krusial dalam aplikasi. 

Pada artikel ini kita akan membahas cara membuat kode akses database yang mudah dan cepat, dilengkapi dengan testing yang menyeluruh dan menyenangkan.



Saya biasanya menggunakan kombinasi Spring Framework dan Hibernate. Dengan kombinasi ini, kita dapat membuat aplikasi dengan sangat cepat. 

Kita mulai dengan struktur tabel sederhana. Misalnya kita memiliki class Siswa, sebagai berikut: 



### Class Siswa


``` java
public class Siswa {
  private Integer id;
  private String nama;
  private Date tanggalLahir;

  public Integer getId() { return this.id; }
  public String getNama() { return this.nama; }
  public Date getTanggalLahir() { return this.tanggalLahir; }

  // setter method  
}
```


class ini akan disimpan di database dengan struktur tabel (MySQL) sebagai berikut: 



### mysql-schema.sql
    
``` sql
CREATE TABLE TBL_SISWA (
  id_siswa INT PRIMARY KEY AUTO_INCREMENT, 
  nama VARCHAR(255), 
  tanggal_lahir DATE
);
```


Dengan menggunakan Hibernate, kita tidak perlu menulis SQL query. Sebagai gantinya, kita harus memberitahu Hibernate tentang skema database kita. Caranya adalah dengan menambahkan annotation sehingga class kita menjadi seperti ini: 



### Siswa.java

``` java
package tutorial.hibernate;
@Entity
@Table(name="TBL_SISWA")
public class Siswa {
  private Integer id;
  private String nama;
  private Date tanggalLahir;

  @Id
  @Column(name="id_siswa")
  @GeneratedValue(strategy=GenerationType.AUTO)
  public Integer getId() { return this.id; }

  public String getNama() { return this.nama; }

  @Column(name="tanggal_lahir")
  public Date getTanggalLahir() { return this.tanggalLahir; }
}
```


Pembaca yang teliti segera protes, "Ada yang ketinggalan!! Di atas public String getNama() belum ada @Column"   
Tidak, itu bukan kelupaan. Tapi memang Hibernate dapat dengan cerdas menebak nama kolom. _public String getNama_ akan diterjemahkan menjadi kolom _nama_. Bahkan seandainya nama tabel kita _SISWA_ (bukannya _TBL_SISWA_), kita tidak perlu menuliskan @Table.

Oke. Sekarang mapping sudah selesai. Saatnya membuat kode untuk mengisi record (create), membaca record (read), mengubah record (update), dan menghapus record (delete). Empat serangkai operasi database ini dikenal dengan istilah CRUD. 

Pertama, kita buat interface dulu, kode yang mendefinisikan operasi CRUD ini.



### SiswaDao.java

``` java
package tutorial.hibernate;
public interface SiswaDao {
  public void create(Siswa s);
  public Siswa getById(Integer id);
  public void update(Siswa s);
  public void delete(Siswa s);  
}
```


Pembuatan interface berguna supaya kapan-kapan kalau kita sudah bosan dengan Hibernate, kita bisa mengganti dengan implementasi yang lainnya, misalnya iBatis atau JDBC biasa.

Berikut implementasi operasi CRUD dengan Spring dan Hibernate. 



### SiswaDaoHibernate.java

``` java
package tutorial.hibernate;
public class SiswaDaoHibernate extends HibernateDaoSupport implements SiswaDao {
  public void create(Siswa s){
    getHibernateTemplate().save(s);
  }

  public Siswa getById(Integer id){
    return (Siswa) getHibernateTemplate().load(Siswa.class, id);
  }
  
  public void update(Siswa s){
    getHibernateTemplate().update(s);
  }

  public void delete(Siswa s) {
    getHibernateTemplate().delete(s);
  } 
}
```


Lagi-lagi ada yang bertanya, "Kok tidak ada kode untuk menangani koneksi database? Mana connect dan disconnect dengan database? Mana kode untuk begin dan commit transaction?"

Semua kode birokratis yang ditanyakan barusan akan diinisialisasi melalui Spring Framework. Sebenarnya kita bisa saja menginisialisasi sendiri melalui kode program biasa. Tapi akan lebih efisien dan konsisten apabila kita menggunakan Spring Framework, seperti akan kita lihat sebentar lagi. 

Berikut adalah deklarasi SiswaDaoHibernate, DataSource koneksi database, dan konfigurasi transaction : 



### belajar.xml

``` xml
<beans>
    <bean id="siswaDaoAsli" class="tutorial.hibernate.SiswaDaoHibernate">
      <property name="sessionFactory"><ref bean="sessionFactory"/></property>
    </bean> 

    <bean id="sessionFactory" class="org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean">
      <property name="dataSource" ref="dataSource"/>
      <property name="annotatedClasses">
        <list>
          <value>tutorial.hibernate.Siswa</value>
    	</list>
    	</property>
    	<property name="hibernateProperties">
            <props>
                <prop key="hibernate.hbm2ddl.auto">create</prop> 
                <prop key="hibernate.dialect">org.hibernate.dialect.MySQLInnoDBDialect</prop>
            </props>
    	</property>
    </bean>

    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://localhost/belajar"/>
    	<property name="username" value="belajar"/>
    	<property name="password" value="belajar"/>
    </bean>

    <bean id="siswaDao" class="org.springframework.transaction.interceptor.TransactionProxyFactoryBean">
        <property name="transactionManager" ref="transactionManager"/>

    	<property name="target" ref="siswaDaoAsli"/>

    	<property name="transactionAttributes">

    		<props>

    			<prop key="*">PROPAGATION_REQUIRED,readOnly</prop>

    			<prop key="create*">PROPAGATION_REQUIRED</prop>
    			<prop key="update*">PROPAGATION_REQUIRED</prop>

    			<prop key="delete*">PROPAGATION_REQUIRED</prop>

    		</props>

    	</property>
    </bean>

    <bean id="transactionManager" class="org.springframework.orm.hibernate3.HibernateTransactionManager">
    	<property name="sessionFactory" ref="sessionFactory"/>
    </bean>
</beans>
```

Object yang kita gunakan adalah siswaDao. Object ini dirangkai dari berbagai object lain, diantaranya adalah koneksi database (dataSource), transaction interceptor (gunakan transaction untuk method create*, update*, delete*), dan transaction manager untuk mengelola transaction Hibernate. 

Perhatikan kode ini: 

``` xml
<prop key="hibernate.hbm2ddl.auto">create</prop> 
```

   
Baris kode di atas akan men-drop seluruh tabel dan constraint di database, dan membuat ulang semuanya. Dengan demikian, database kita akan fresh seperti baru. 

**PERHATIAN!!! Jangan dijalankan di database production!!**

Berikut adalah unit test untuk class SiswaDaoHibernate: 



### SiswaDaoHibernateTest.java

``` java
package tutorial.hibernate;
public class SiswaDaoHibernateTest extends TestCase {
    private static ApplicationContext ctx;
    private static SiswaDao dao;
    private static DataSource ds;
    private static Connection conn;
    
    static {
        ctx = new ClassPathXmlApplicationContext("belajar.xml");
        dao = (SiswaDao)ctx.getBean("siswaDao");
        ds = (DataSource)ctx.getBean("dataSource"););
    }

    public void setUp() throws Exception {
        conn = ds.getConnection();
    }
    
    public void tearDown() throws Exception {
        conn.close();
    }

    public void testCreate() throws Exception {
        Siswa endy = new Siswa();
        endy.setNama("Endy Muhardin");
        endy.setTanggalLahir(new SimpleDateFormat("dd-MM-yyyy").parse("17-08-1945"));
        dao.save(endy);
    
        // mari kita test
        String sql = "SELECT * FROM TBL_USER WHERE nama='Endy Muhardin'";
        
        ResultSet rs = conn.createStatement().executeQuery(sql);
        assertTrue("harusnya ada minimal satu record", rs.next());
        assertEquals("coba cek tanggal lahir", rs.getDate("tanggal_lahir"), new SimpleDateFormat("dd-MM-yyyy").parse("17-08-1945"));
    }
}
```

Nah, dengan adanya unit test di atas, kita tidak perlu lagi secara manual menjalankan kode test, kemudian memeriksa isi database. 

Sekarang, bagaimana mengetes method getById? Apakah kita harus melakukan _insert_ dulu baru kemudian menjalankan _dao.getById(1)_ ? 

Tidak perlu. Kita dapat menggunakan DBUnit untuk menginisialisasi sampel data. 
Kita buat sampel data (fixture) sebagai berikut: 



### siswa-fixture.xml

``` xml
<?xml version="1.0" encoding="UTF-8"?>

<dataset>
    <TBL_USER id="99"
              nama="Khalisa Alayya"
              tanggal_lahir="2005-12-31"
    />
</dataset>
```


Sekarang, pastikan fixture di atas dijalankan sebelum setiap test dieksekusi. Caranya adalah dengan menambahkan kode berikut di method setUp: 

``` java
public void setUp() {
    conn = ds.getConnection();
    
    // inisialisasi koneksi DBUnit
    DatabaseConnection dbUnitConn = new DatabaseConnection(conn);
    
    // inisialisasi fixture
    FlatXmlDataSet fixture = new FlatXmlDataSet(new File("siswa-fixtures.xml"));
    
    DatabaseOperation.CLEAN_INSERT.execute(dbUnitConn,fixture);
}
```

Kode ini : 

``` java
DatabaseOperation.CLEAN_INSERT.execute(dbUnitConn,fixture);
```

akan menghapus semua data yang ada di database, dan mengisinya dengan satu record, yaitu _Khalisa Alayya_. 

Sehingga kita dapat membuat kode test seperti ini: 

``` java
public void testGetById() {
    Siswa khalisa = dao.getById(99);
    assertNotNull(khalisa);
    assertEquals("Khalisa Alayya", khalisa.getNama());
}
```

Berikut adalah Ant script untuk mengeksekusi test di atas: 


### build.xml
``` xml
<project name="belajar-hibernate" default="test" basedir=".">

    <!-- silahkan lengkapi dengan target compile -->

    <target name="test" depends="compile">
		<junit haltonfailure="true" fork="true" printsummary="yes">             
            <classpath refid="project-classpath"/>
            <formatter type="xml"/>
            <batchtest todir="report/junit">
                <fileset dir="bin" includes="**/*Test.class"/>
            </batchtest>
        </junit>
	</target>

</project>
```

Silahkan jalankan berkali-kali sepuasnya. Rangkaian kode di atas akan dengan senang hati melakukan: 




  1. Pembuatan schema


  2. Mengisi sampel data


  3. Menjalankan kode program


  4. Memeriksa hasilnya di database


Tidak perlu memelototi _phpmyadmin_ lagi :D

Semoga bermanfaat.

