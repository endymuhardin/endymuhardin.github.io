---
comments: true
date: 2005-11-15 17:15:01
layout: post
slug: testing-aplikasi
title: Testing Aplikasi
wordpress_id: 14
categories:
- java
---

Sebelum diinstal di tempat customer, aplikasi yang kita buat harus ditest. Itu jelas. Semua orang melakukannya. Hanya saja, teknik melakukan testing akan membedakan antara yang pro dan belajaran (apalagi yang baru lulus kuliah :P)

Mari kita ambil contoh nyata. Misalkan kita punya class Calculator, dengan satu method divide yang tugasnya membagi dua bilangan. Berikut kodenya : 


    
    public class Calculator {
        public double divide (double a, double b) {
              return 0;
        }
    }



Programmer pemula (atau pro yang kurang wawasan), hampir pasti akan segera menulis 

    
    public static void main(String[] xxx) {
        Calculator c = new Calculator();
        System.out.println("10 dibagi 2 adalah : " +c.divide(10,2));  // hasilnya harus 5
    }




Hmm... primitif sekali. Dengan segala kecanggihan teknologi komputer, kita yang berada di tengah dunia komputer, membuat program komputer, masih menggunakan teknologi jaman DOS prompt untuk melakukan test.

Apa yang salah dengan kode test di atas? 
Salah, karena programmer harus mengeksekusi kode di atas, melihat bahwa tampilan yang dihasilkan seperti ini : 

    
    10 / 2 adalah : 0


membetulkan kode, kemudian lihat lagi, memastikan kali ini tampilannya seperti ini :

    
    10 / 2 adalah : 5



Mengapa salah? 
Karena ini tidak otomatis. 
Bagaimana kalau kita punya 100 method?
Bagaimana kalau tiap method punya 2 kemungkinan yang harus ditest (misalnya: pembagian dengan 0, pembagian dengan bilangan negatif)? 
Berarti ada sekitar 200 baris yang harus diteliti. Dan ini akan menjadi membosankan dan melelahkan.

Programmer profesional (baca: menghidupi anak istri dari coding) yang berwawasan luas akan menggunakan [Automated Unit Testing](http://www.junit.org). Tools ini akan memungkinkan kita untuk melakukan test secara : 



	
  * Cepat

 	
  * Otomatis

 	
  * Dapat dieksekusi dengan tekan satu tombol



Programmer profesional yang berwawasan tersebut akan menulis test seperti ini : 

    
    public void testDivide() {
        Calculator c = new Calculator();
        assertEquals(5, c.divide(10,2));
    }



Dengan cara ini, komputerlah yang akan memeriksa kode kita. Pada waktu kita jalankan, komputer akan mencetak tanda titik bila sukses, huruf F bila gagal, dan huruf E bila terjadi Exception. Tidak perlu lagi periksa secara manual. 
200 test? Tidak perlu khawatir. Tinggal jalankan dan lihat. Berapa huruf yang muncul, itulah yang diperbaiki. 

Bagusnya lagi, semua test tadi dapat dikonfigurasi sehingga dapat dijalankan sekaligus. Jadi dengan sekali tekan tombol, kita dapat menjalankan semua test yang telah kita buat dari sejak project dimulai.

Proses ini dapat diotomasi lebih jauh lagi, apabila kita menggunakan Ant, atau plugin IDE (misalnya Eclipse). Proses testing dapat diintegrasikan. Sehingga kalau biasanya setelah melakukan perubahan di source code kita lakukan save dan compile, dengan sedikit konfigurasi, kita ubah menjadi save-compile-test. 
Dengan sekali tekan tombol, kode yang baru saja kita edit telah ditest. 

Ingatlah, programmer profesional mencari nafkah dari coding. Semakin cepat menyelesaikan aplikasi, semakin cepat dapat mengirimkan tagihan ke customer, dan semakin cepat pula istri akan tersenyum. 

Tulisan ini merupakan bagian pertama dari rangkaian tulisan tentang Otomasi Pembuatan Aplikasi.
