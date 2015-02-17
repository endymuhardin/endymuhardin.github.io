---
comments: true
date: 2006-07-12 12:27:12
layout: post
slug: ruthless-testing-2
title: Ruthless Testing 2
wordpress_id: 115
categories:
- java
---

Pada [artikel sebelumnya](http://endy.artivisi.com/blog/java/ruthless-testing-1/), kita telah membahas tentang penggunaan [unit test](http://www.junit.org) dan integration test sederhana menggunakan [DBUnit](http://dbunit.sourceforge.net/). Pada artikel kali ini, kita akan membahas tentang coverage testing 

Sebagai technical leader, project manager -atau apapun nama jabatannya- yang bertugas mengawasi segerombolan programmer, bagaimana cara kita memastikan bahwa mereka membuat unit test untuk setiap kode yang ditulis? 

Cara manual tentu saja dengan memeriksa unit test satu-persatu dan membandingkannya dengan kode program aplikasi. Kita cocokkan tiap unit test dengan pasangan kode yang ditest. Dengan demikian, kita tahu mana kode yang sudah ditest mana yang belum. 

Sayangnya, cara ini tidak otomatis. Sehingga kalau nanti dihadapkan pada deadline ketat, dipastikan kegiatan ini akan segera diabaikan. Oleh karena itu kita harus mengotomasi pemeriksaan test ini sehingga di tengah tekanan jadwal, kita tetap bisa memastikan unit test dibuat dengan benar. 

Ada beberapa tools yang beredar di pasaran untuk mengotomasi pemeriksaan ini, diantaranya: 



	
  * [Clover](http://www.cenqua.com/clover/) (komersial)

	
  * [Cobertura](http://cobertura.sourceforge.net/) (open source)

	
  * [Emma](http://emma.sourceforge.net/) (open source)



Semua tools di atas melakukan '_coverage testing_', yaitu pengetesan apakah unit test yang dibuat telah meng-cover semua kode yang ditest. Jika unit testnya terlalu sedikit, maka coverage testing akan failed.

Pada contoh kali ini, kita akan menggunakan Cobertura. Cobertura mampu memeriksa coverage terhadap baris kode dan percabangan. Jadi kalau ada percabangan (if-else, switch) yang belum ditest, cobertura akan melaporkan. Kalau ada baris kode yang belum terjangkau unit test, cobertura juga akan memperingatkan. 

Sebagai supervisor, kita dapat menetapkan aturan pada project. Misalnya, "Untuk project ini, saya ingin test meng-cover minimal 70% dari seluruh baris dan 90% dari seluruh percabangan". 

Bagaimana cara Cobertura melakukan keajaiban ini? Jawabannya, melalui mekanisme yang disebut _code instrumentation_. 
Cobertura akan memodifikasi bytecode (*.class) yang dihasilkan oleh proses kompilasi. Bytecode yang dihasilkan _javac_ akan ditambah dengan kode-kode khusus untuk menghitung dan mendeteksi invokasi. Dengan demikian, pada saat unit test dijalankan, Cobertura akan mengetahui unit test yang mana menjalankan kode program yang mana. Bytecode yang akan diproses oleh Cobertura harus dikompile dengan flag -debug.

Dengan demikian, untuk menjalankan Cobertura, kita membutuhkan dua kali tahap kompilasi. Kompilasi pertama mengubah *.java menjadi *.class. Kompilasi kedua menambahkan instrumen di *.class. 

Berikut adalah Ant target untuk melakukan instrumentasi. 

    
``` xml 
<target name="instrument-cobertura" depends="compile-cobertura">        
        <!--
                Instrument the application classes, writing the
                instrumented classes into ${build.instrumented.dir}.
        -->        
        <cobertura-instrument todir="${compile.cobertura}">			
			<includeClasses regex=".*" />
			<excludeClasses regex=".*\Test.*" />  
			<instrumentationClasspath>
				<pathelement location="${compile.debug}" />
			</instrumentationClasspath>
        </cobertura-instrument>
    </target>
```



Selanjutnya, kita menjalankan unit test seperti biasa (melalui Ant target). Bedanya adalah, kita menggunakan hasil kompilasi Cobertura. Ant target untuk menjalankan unit test adalah sebagai berikut: 

    
``` xml
<target name="unit-test" depends="instrument-cobertura">
        <junit haltonfailure="false" fork="yes">            
            <classpath location="${compile.cobertura}"/>
            <classpath refid="cobertura-classpath"/>
            <formatter type="xml"/>
            <batchtest todir="${junit.result}">
                <fileset dir="${compile.debug}" includes="**/*Test.class"/>
            </batchtest>
        </junit>
    </target>
```


Perhatikan referensi ke **${compile.cobertura}** yang diletakkan di atas referensi **cobertura-classpath**. Ini mengisyaratkan bahwa class hasil instrumentasi Cobertura diload **lebih dulu** daripada class yang dikompilasi secara normal. 

Terakhir, kita buat Ant target untuk memeriksa coverage dan menghasilkan HTML report. 


``` xml 
<target name="coverage-test" depends="unit-test">
        <cobertura-check datafile="cobertura.ser" 
                         branchrate="70" 
                         linerate="90"
                         haltonfailure="false"
        />
        <cobertura-report datafile="cobertura.ser"
                          srcdir="src" destdir="${cobertura.result}"
        />
    </target>
```

Perhatikan nilai batas baris (linerate) dan percabangan (branchrate) yang harus ditest. Nilainya sudah disesuaikan dengan aturan yang kita tetapkan di atas, yaitu sebesar 70% dan 90%. 

Misalnya kita memiliki class DayCounter.java sebagai berikut:

    
``` java
public class DayCounter {
    public int numDays(int month, int year){
        switch (month) {
            case 1: 
            case 3:
            case 5: 
            case 7: 
            case 8:
            case 10:
            case 12: return 31;
            case 4: 
            case 6:
            case 9: 
            case 11: return 30;
            case 2: 
                if (year%4 == 0) {
                    return 29;
                } else {
                    return 28;
                }
            default: return 0;
        }
    }
} 
```



Dan unit testnya DayCounterTest.java sebagai berikut:

    
``` java
package tutorial.testframework;

import junit.framework.TestCase;

public class DayCounterTest extends TestCase {
    public void testNumDays() {
        DayCounter d = new DayCounter();
        assertEquals(31, d.numDays(12,2001));        
        assertEquals(30, d.numDays(11,2001));
        assertEquals(28, d.numDays(2,2001));
        assertEquals(29, d.numDays(2,2000));
        assertEquals(0, d.numDays(21,2000));
    }
}
```


Akan menghasilkan coverage yang bagus, karena semua baris sudah ditest. Berikut adalah hasil coverage testnya:

![Cobertura All Pass ](/images/uploads/2006/07/cobertura-all-green-small.png)

Kita juga bisa melihat coverage detail dari class DayCounter.java: 

![Cobertura Class Detail Pass ](/images/uploads/2006/07/cobertura-class-green-small.png)

Bila kita non-aktifkan beberapa test, seperti ini: 

    
``` java
package tutorial.testframework;

import junit.framework.TestCase;

public class DayCounterTest extends TestCase {
    public void testNumDays() {
        DayCounter d = new DayCounter();
        assertEquals(31, d.numDays(12,2001));        
        assertEquals(30, d.numDays(11,2001));
        //assertEquals(28, d.numDays(2,2001));
        //assertEquals(29, d.numDays(2,2000));
        //assertEquals(0, d.numDays(21,2000));
    }
}
```



Maka kode kita tidak akan lolos test, karena hasil coverage totalnya seperti ini: 

![Cobertura All Failed ](/images/uploads/2006/07/cobertura-all-red-small.png)

dan detail classnya seperti ini

![Cobertura Class Detail Failed ](/images/uploads/2006/07/cobertura-class-red-small.png)

Bagaimana? 
Mudah dan cepat kan?
Dengan cara ini, kita dapat mendeteksi tingkat kemalasan programmer dalam membuat unit test. 
Pada artikel selanjutnya, kita akan membahas tentang code-compliance test. Test ini sering juga disebut code-review. 
