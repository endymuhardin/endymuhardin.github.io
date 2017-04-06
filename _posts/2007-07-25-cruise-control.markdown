---
comments: true
date: 2007-07-25 08:51:17
layout: post
slug: cruise-control
title: Cruise Control
wordpress_id: 232
categories:
- aplikasi
---

Kalau Anda programmer Java, tentunya sudah tidak asing lagi dengan Tomcat atau Eclipse. Yang satu adalah application server, satunya lagi adalah Integrated Development Environment (IDE). Ada satu kesamaan dalam kedua produk ini, keduanya adalah proyek open source yang dikelola secara profesional.

Coba buka halaman download di website masing-masing proyek tersebut. Di sana bisa kita temukan beberapa jenis download, yaitu Nightly Builds dan Stable Builds. Stable builds adalah aplikasi yang sudah melalui berbagai fase testing dan dinyatakan lulus uji. Nightly builds, seperti namanya, adalah build yang dibuat setiap malam dan dirilis kepada publik agar bisa diuji coba beramai-ramai. Dengan besarnya jumlah penguji, diharapkan bug yang ada dalam aplikasi bisa ditemukan semuanya.

Build, dalam dunia Java, terdiri dari serangkaian aktifitas, diantaranya sebagai berikut:




  1. Menjalankan review kode otomatis


  2. Kompilasi kode program


  3. Menjalankan unit test


  4. Menjalankan integration test


  5. Menjalankan coverage test (kalau ada)


  6. Menjalankan platform test, untuk aplikasi yang berbeda antar OS (seperti Eclipse)


  7. Bila lulus semua ujian di atas, buat tag di version control


  8. Siapkan executable (*.jar, *.war, *exe, dan sebagainya)


  9. Publish executable di website supaya bisa didownload orang banyak



Wow, daftar aktifitasnya cukup banyak. Kalau ini dikerjakan setiap malam, betapa membosankan. Saya tidak dapat membayangkan ada satu orang yang ditugaskan khusus untuk melakukan hal ini. Pasti setelah beberapa hari saja dia akan bosan dan mengundurkan diri. Apalagi dalam project open source di mana sebagian besar kontributornya tidak dibayar.

Untuk itulah ada tools khusus untuk melakukan hal membosankan ini. Toolsnya disebut Continuous Integration Tools, berdasarkan tulisan Martin Fowler tentang Continuous Integration. Ada beberapa tools yang tersedia di pasaran, diantaranya:


  * [Cruise Control](http://cruisecontrol.sf.net)


  * [Luntbuild](http://www.luntbuild.org)


  * Anthill


  * Bamboo



Dalam tulisan kali ini, kita akan bahas tentang penggunaan CruiseControl, salah satu Continuous Integration Tool yang populer dan open source.


CI Tool yang baik haruslah memiliki fitur sebagai berikut:


  * Mendukung berbagai jenis version control, minimal Subversion dan CVS


  * Dapat menggunakan Ant atau Maven


  * Mendukung banyak project


  * Dapat mengelola artifact (hasil build)


  * Dapat memberitahu orang tentang hasil build (gagal atau sukses) melalui berbagai cara (email, instant message, sms, dan sebagainya)


  * Memiliki aplikasi pelaporan yang mudah diakses melalui web



Yang dilakukan oleh CI Tools adalah sebagai berikut:


  1. Periksa repository source code, apakah ada perubahan terbaru


  2. Bila ada, ambil perubahan terbaru tersebut


  3. Lakukan build (compile, testing, dsb)


  4. Laporkan hasilnya (gagal atau berhasil) melalui email atau media lainnya


  5. Buat juga laporan di website


  6. Bila sukses, publish artifact yang dihasilkan



Cruise Control membutuhkan beberapa file konfigurasi:


  * config.xml: Hanya satu, digunakan untuk mendaftarkan project yang akan dikelola


  * build-namaproject.xml : Satu per project. Bila kita punya tiga project, maka akan ada tiga build-namaproject.xml, dengan nama file disesuaikan dengan masing-masing project.Buildfile ini bertugas untuk sinkronisasi dengan version control dan membuat tag di version control


  * build.xml : Satu per project. Ini adalah buildfile yang biasa kita gunakan di project untuk melakukan kompilasi, menjalankan test, dan menghasilkan *jar atau *war.



Kita butuh satu folder kerja untuk CruiseControl melakukan tugasnya. Sebaiknya folder ini dipisahkan dari folder instalasi CruiseControl agar memudahkan kita pada waktu melakukan upgrade CruiseControl. Untuk kepentingan ilustrasi, folder instalasi CruiseControl akan ditulis [CC_INSTALL] dan folder kerja akan ditulis [CC_WORK].

Berikut adalah struktur folder [CC_INSTALL]:

[![Struktur Folder Instalasi CruiseControl ](/images/uploads/2007/07/cruise-install.png)](/images/uploads/2007/07/cruise-install.png)

dan folder kerja [CC_WORK] akan berisi seperti ini:

[![Folder Kerja CruiseControl ](/images/uploads/2007/07/cruise-work.png)](/images/uploads/2007/07/cruise-work.png)

Struktur folder di dalam repository Subversion kita seperti ini:

[![Struktur Folder Subversion ](/images/uploads/2007/07/repo-content.png)](/images/uploads/2007/07/repo-content.png)

Pada contoh ini, kita akan menjalankan build untuk satu project `TestingTraining` dengan konfigurasi sebagai berikut:




  1. Memiliki dua build, yang satu berjalan setiap satu menit, satu lagi berjalan setiap jam 18.00 sore


  2. Version control yang digunakan adalah Subversion


  3. Bila build sukses, buat tag di folder releases/daily-build/build-NN-yyyyMMddhhmmss



Konfigurasi tersebut ditulis di `config.xml` sebagai berikut.

```xml    
<cruisecontrol>
    <project name="TestingTraining" buildafterfailed="true">
      <listeners>
        <currentbuildstatuslistener file="logs/${project.name}/status.txt"/>
      </listeners>

      <modificationset quietperiod="10">
          <svn RepositoryLocation="svn://172.16.2.252/trunk" />
      </modificationset>

      <schedule interval="60">
          <ant anthome="/opt/apache-ant-1.6.5"
               antWorkingDir="/home/endy/tmp/cruise-work/projects/${project.name}"
               buildfile="/home/endy/tmp/cruise-work/build-${project.name}.xml"
               target="build"
               uselogger="true"
               usedebug="false"
	       />
      </schedule>

      <log>
          <merge dir="/home/endy/tmp/cruise-work/projects/${project.name}/build/report/junit"/>
      </log>

      <publishers>
            <onsuccess>
                <antpublisher anthome="/opt/apache-ant-1.6.5"
                              antWorkingDir="/home/endy/tmp/cruise-work/projects/${project.name}"
                              buildfile="/home/endy/tmp/cruise-work/build-${project.name}.xml"
                            target="tag"
                            uselogger="true"
                            usedebug="false"
                />
		<artifactspublisher
		    dir="/home/endy/tmp/cruise-work/projects/${project.name}/dist"
		    dest="artifacts/${project.name}"/>
            </onsuccess>
        </publishers>
    </project>
</cruisecontrol>
```

Berikut adalah penjelasannya.


  * Konfigurasi CruiseControl dibuat dengan format XML. Tag paling luar adalah `<cruisecontrol>`


  * Satu file konfigurasi bisa memuat banyak project. Masing-masing project dikonfigurasi dalam tag `<project>`


  * Di halaman depan CruiseControl, akan ada status untuk masing-masing project. Status ini akan disimpan di file status.txt


  * Modification Set: Beberapa produk version control tidak mengenal atomic commit, misalnya CVS. Karena itu, bila kita commit (misalnya) 7 file sekaligus, bisa saja CruiseControl terbangun pada saat baru 3 file yang tercommit. Bila CruiseControl melakukan build pada saat itu juga, bisa dipastikan akan terjadi error. Oleh karena itu, kita suruh CruiseControl membatalkan build bila kurang dari 10 detik yang lalu ada orang yang commit. Tentu saja bila kita menggunakan Subversion, hal ini tidak relevan.


  * Schedule: Ini adalah daftar build schedule yang ingin kita daftarkan. Tag ini bisa memuat banyak build. Kita menggunakan interval 60 detik, yang artinya setiap menit CruiseControl akan melakukan build. Selain schedule yang berbasis interval, kita juga bisa mendaftarkan schedule yang menggunakan waktu tertentu, misalnya berjalan setiap jam 12 malam.


  * Merge log yang dihasilkan JUnit, tersimpan di folder `build/report/junit` ke dalam tampilan report CruiseControl.


  * Publisher : pada bagian ini kita daftarkan Ant Publisher pada kategori onsuccess. Artinya, kalau build sukses, jalankan target tag untuk membuat tag di dalam repository. Selain itu, kita juga menggunakan Artifact Publisher, yang berguna untuk mengkopi file *.jar yang dihasilkan ke dalam folder CruiseControl sehingga bisa didownload melalui website.



Di file konfigurasi tersebut, kita memanggil file `build-TestingTraining.xml`. Ini adalah isi dari file tersebut.

```xml
<project name="CruiseControl Builder"
    	 default="build"
         basedir="projects/TestingTraining">

  <property name="repository.url" value="svn://localhost"/>
  <property name="branch" value="trunk"/>
  <property name="release.folder" value="releases/daily-build" />
  <property name="svn.username" value="endy" />
  <property name="svn.password" value="123" />
  <property name="message" value="Created automatically by CruiseControl" />

  <path id="cc-classpath">
    <fileset dir="../../lib" includes="**/*jar"/>
  </path>  

  <target name="update">
    <java classname="org.tmatesoft.svn.cli.SVN" fork="true"
          classpathref="cc-classpath">
      <arg value="update"/>      
    </java>
  </target>

  <target name="build" depends="update">
    <ant inheritAll="false" target="build-jar"/>
  </target>

  <target name="tag">
    <java classname="org.tmatesoft.svn.cli.SVN"
              fork="true" classpathref="cc-classpath">
            <arg value="--username"/>
            <arg value="${svn.username}"/>

            <arg value="--password"/>
            <arg value="${svn.password}"/>

            <arg value="cp"/>
            <arg value="${repository.url}/${branch}"/>
            <arg value="${repository.url}/${release.folder}/${label}-${cctimestamp}"/>

            <arg value="-m"/>
            <arg value="${message}"/>

        </java>
  </target>

</project>
```

Penjelasannya sebagai berikut.




  * Kita menggunakan pustaka yang disediakan [SVNKit (dulunya JavaSVN) ](http://svnkit.com/)agar bisa menggunakan Subversion melalui Ant. Sebetulnya tanpa SVNKit juga bisa, yaitu dengan target `exec` yang dimiliki Ant untuk memanggil perintah di command line. Dengan menggunakan SVNKit, kita tidak perlu menginstal Subversion command line di build server kita.


  * Ada tiga target utama dalam buildfile ini: update, build, dan tag. Target update berguna untuk mengambil perubahan terbaru dari repository ke folder kerja CruiseControl. Target build memanggil target build-jar di dalam build.xml yang dimiliki project. Target build-jar ini hanya bisa berhasil kalau semua test sudah berjalan dengan sempurna. Target tag berguna untuk membuat tag di repository. Kita bisa mengirim variabel yang dihasilkan CruiseControl, dalam hal ini `${label}` dan `${cctimestamp}`.


Agar file ini bisa dijalankan, kita harus memiliki folder projects/TestingTraining yang berisi hasil checkout dari repository. Mari kita checkout dulu.

```
$ cd projects
$ svn co svn://localhost/trunk TestingTraining
```

Untuk menguji apakah file build-TestingTraining.xml ini bisa dijalankan dengan baik, masuk ke folder projects/TestingTraining dan panggil file tersebut dari folder ini.

```
$ ant -f ../../build-TestingTraining.xml build
Buildfile: ../../build-TestingTraining.xml

update:
     [java] At revision 71.

build:

clean:
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/build/bin
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/build/debug
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/build/cobertura
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/build/report/junit
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/build/report/pmd
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/build/report/cobertura
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/dist

prepare:
    [mkdir] Created dir: /home/endy/tmp/cruise-work/projects/TestingTraining/build/bin
    [mkdir] Created dir: /home/endy/tmp/cruise-work/projects/TestingTraining/build/debug
    [mkdir] Created dir: /home/endy/tmp/cruise-work/projects/TestingTraining/build/cobertura
    [mkdir] Created dir: /home/endy/tmp/cruise-work/projects/TestingTraining/build/report/junit
    [mkdir] Created dir: /home/endy/tmp/cruise-work/projects/TestingTraining/build/report/pmd
    [mkdir] Created dir: /home/endy/tmp/cruise-work/projects/TestingTraining/build/report/cobertura
    [mkdir] Created dir: /home/endy/tmp/cruise-work/projects/TestingTraining/dist

code-review:

compile:
    [javac] Compiling 11 source files to /home/endy/tmp/cruise-work/projects/TestingTraining/build/bin

compile-cobertura:
    [javac] Compiling 11 source files to /home/endy/tmp/cruise-work/projects/TestingTraining/build/debug
   [delete] Deleting: /home/endy/tmp/cruise-work/projects/TestingTraining/cobertura.ser
   [delete] Deleting directory /home/endy/tmp/cruise-work/projects/TestingTraining/build/cobertura
[cobertura-instrument] Cobertura 1.8 - GNU GPL License (NO WARRANTY) - See COPYRIGHT file
[cobertura-instrument] Instrumenting 7 files to /home/endy/tmp/cruise-work/projects/TestingTraining/build/cobertura
[cobertura-instrument] Cobertura: Saved information on 7 classes.
[cobertura-instrument] Instrument time: 110ms

unit-test:
    [junit] Running tutorial.testing.CalculatorTest
    [junit] Tests run: 2, Failures: 0, Errors: 0, Time elapsed: 0.047 sec
    [junit] Cobertura: Loaded information on 7 classes.
    [junit] Cobertura: Saved information on 7 classes.
    [junit] Running tutorial.testing.DayCounterTest
    [junit] Tests run: 2, Failures: 0, Errors: 0, Time elapsed: 0.055 sec
    [junit] Cobertura: Loaded information on 7 classes.
    [junit] Cobertura: Saved information on 7 classes.
    [junit] Running tutorial.testing.LoginServletTest
    [junit] Tests run: 2, Failures: 0, Errors: 0, Time elapsed: 0.159 sec
    [junit] Cobertura: Loaded information on 7 classes.
    [junit] Cobertura: Saved information on 7 classes.
    [junit] Running tutorial.testing.dbunit.PersonDaoMySQLTest
    [junit] Tests run: 3, Failures: 0, Errors: 0, Time elapsed: 0.153 sec
    [junit] Cobertura: Loaded information on 7 classes.
    [junit] Cobertura: Saved information on 7 classes.
[junitreport] Transform time: 564ms
[cobertura-report] Cobertura 1.8 - GNU GPL License (NO WARRANTY) - See COPYRIGHT file
[cobertura-report] Cobertura: Loaded information on 7 classes.
[cobertura-report] Report time: 231ms

coverage-test:
[cobertura-check] Cobertura 1.8 - GNU GPL License (NO WARRANTY) - See COPYRIGHT file
[cobertura-check] Cobertura: Loaded information on 7 classes.
[cobertura-check] All checks passed.

full-test:

build-jar:
      [jar] Building jar: /home/endy/tmp/cruise-work/projects/TestingTraining/dist/TutorialTesting.jar

BUILD SUCCESSFUL
Total time: 12 seconds
```



File `build-TestingTraining.xml` akan memanggil `build.xml` yang ada di dalam project kita. Berikut isi dari file ini.

```xml
<project name="TestingTraining" default="full-test" basedir=".">

	<property name="source.java" value="src/java"/>
	<property name="compile.normal" value="build/bin"/>
	<property name="compile.debug" value="build/debug"/>
	<property name="compile.cobertura" value="build/cobertura"/>
	<property name="distribution" value="dist" />

	<property name="report.junit" value="build/report/junit"/>
	<property name="report.pmd" value="build/report/pmd"/>
	<property name="report.cobertura" value="build/report/cobertura"/>

	<path id="devel.classpath">
		<pathelement location="${source.java}"/>
		<pathelement location="${compile.debug}"/>
		<fileset dir="lib" includes="**/*jar" />
		<fileset dir="ext" includes="**/*jar" />
	</path>

	<taskdef classpathref="devel.classpath" resource="tasks.properties"/>

	<target name="prepare">
		<mkdir dir="${compile.normal}"/>
		<mkdir dir="${compile.debug}"/>
		<mkdir dir="${compile.cobertura}"/>
		<mkdir dir="${report.junit}"/>
		<mkdir dir="${report.pmd}"/>
		<mkdir dir="${report.cobertura}"/>

		<mkdir dir="${distribution}" />
	</target>

	<target name="clean">
		<delete dir="${compile.normal}"></delete>
		<delete dir="${compile.debug}"></delete>
		<delete dir="${compile.cobertura}"></delete>
		<delete dir="${report.junit}"></delete>
		<delete dir="${report.pmd}"></delete>
		<delete dir="${report.cobertura}"></delete>
		<delete dir="${distribution}"></delete>
	</target>

	<target name="code-review" depends="prepare">
		<taskdef name="pmd" classname="net.sourceforge.pmd.ant.PMDTask" classpathref="devel.classpath"/>
    	<pmd targetjdk="1.5" shortFilenames="true" failonerror="true" failonruleviolation="true" rulesetfiles="pmd-ruleset.xml">                           
	      <formatter type="net.sourceforge.pmd.renderers.HTMLRenderer"
	                 toFile="${report.pmd}/pmd.html"
	      />
	      <fileset dir="${source.java}">
	          <include name="**/*.java"/>
	          <exclude name="**/*Test.java"/>
	      </fileset>
	    </pmd>
	</target>

	<target name="compile" depends="code-review">
		<javac
			srcdir="${source.java}"
			destdir="${compile.normal}"
			classpathref="devel.classpath">
		</javac>
	</target>

	<target name="unit-test" depends="compile,compile-cobertura">
		<junit haltonfailure="true" fork="true" printsummary="true">
			<classpath location="${compile.cobertura}"></classpath>
			<classpath refid="devel.classpath"/>
            <formatter type="xml"/>
            <batchtest todir="${report.junit}">
                <fileset dir="${compile.debug}" includes="**/*Test.class" excludes="**/*Abstract*.class"/>
            </batchtest>
		</junit>

		<junitreport todir="${report.junit}">
            <fileset dir="${report.junit}">
            <include name="TEST-*.xml"/>
            </fileset>
            <report format="frames" todir="${report.junit}/html"/>
        </junitreport>

		<cobertura-report
        	datafile="cobertura.ser"
        	srcdir="${source.java}"
        	destdir="${report.cobertura}"
        />
	</target>

	<target name="compile-cobertura" depends="prepare">
		<javac
			srcdir="${source.java}"
			destdir="${compile.debug}"
			classpathref="devel.classpath"
			fork="true"
			debug="true"
		/>
        <delete file="cobertura.ser"/>
    	<delete dir="${compile.cobertura}" />

        <cobertura-instrument todir="${compile.cobertura}">
            <fileset dir="${compile.debug}">
                    <include name="**/*.class"/>
                    <exclude name="**/*Test*.class"/>
            </fileset>
        </cobertura-instrument>
	</target>

	<target name="coverage-test" depends="unit-test">
		<cobertura-check datafile="cobertura.ser"
                         branchrate="75"
                         linerate="75"
                         haltonfailure="true"
        />

	</target>

	<target name="full-test" depends="code-review,coverage-test"></target>

	<target name="build-jar" depends="clean,full-test">
		<jar destfile="${distribution}/${ant.project.name}.jar"
		       basedir="${compile.normal}"
		       excludes="**/*Test.class"
		  />
	</target>
</project>
```


Seperti kita lihat di atas, file tersebut memiliki target build-jar yang hanya akan dilakukan apabila target code-review, compile, unit-test, coverage-test dilakukan dengan sukses.


Baiklah, persiapan sudah selesai, sekarang jalankan CruiseControl, dan lihat hasilnya.
CruiseControl dijalankan melalui command prompt dengan mensuplai config.xml yang kita miliki.

```
$ cd [CC_INSTALL]
$ ./cruisecontrol.sh -configfile [CC_WORK]/config.xml
```

Bila tidak ada error, maka kita bisa browse ke http://localhost:8080

Ini adalah halaman depan. Memuat status masing-masing project.

[![Halaman Depan CruiseControl ](/images/uploads/2007/07/halaman-depan.png)](/images/uploads/2007/07/halaman-depan.png)

Ini adalah halaman untuk TestingTraining.

[![Hasil Build ](/images/uploads/2007/07/build-detail.png)](/images/uploads/2007/07/build-detail.png)

Seperti kita lihat, hasilnya build failed, karena database MySQL yang diperlukan untuk test belum dijalankan. Mari kita nyalakan dan buat test ini menjadi sukses. Setelah sukses, tampilannya seperti ini.

[![Hasil Build yang sukses ](/images/uploads/2007/07/build-success.png)](/images/uploads/2007/07/build-success.png)

Kita bisa melihat hasil unit test di dalam tab Test Result.

[![Hasil JUnit ](/images/uploads/2007/07/test-result.png)](/images/uploads/2007/07/test-result.png)

Berapa kali gagal, berapa kali sukses? Kita bisa lihat di tab Metric.

[![Metric tentang hasil build ](/images/uploads/2007/07/metric.png)](/images/uploads/2007/07/metric.png)

Bila kita sudah menjalankan daily build ini selama beberapa waktu, di repository kita akan dihasilkan tag sesuai dengan build yang sukses. Berikut contohnya.

[![Daftar Tag yang dibuat CruiseControl ](/images/uploads/2007/07/build-result.png)](/images/uploads/2007/07/build-result.png)

Demikianlah penggunaan CruiseControl. Dengan menggunakan CruiseControl ini, para programmer bisa dibebaskan dari tugas membosankan, sehingga waktunya bisa digunakan untuk hal lain yang lebih bermanfaat, seperti misalnya menulis blog atau menambah teman baru di Friendster.
