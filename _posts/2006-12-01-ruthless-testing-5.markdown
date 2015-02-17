---
comments: true
date: 2006-12-01 11:35:39
layout: post
slug: ruthless-testing-5
title: Ruthless Testing 5
wordpress_id: 182
categories:
- java
---

Setelah beberapa seri artikel Ruthless Testing, ternyata lebih banyak yang skeptis daripada yang antusias. Respon yang paling banyak ditemukan adalah:

> Wah, ini konsep yang sangat menarik. Tentunya akan sangat baik jika diterapkan. Sayang sekali, di tempat saya tidak bisa, karena ... [berbagai alasan dan kesulitan] ... 

Hmm ... saya mengerti perasaan Anda. Been there, done that. Saya pernah jadi programmer, dan juga pernah jadi project manager. Saya mengerti beberapa keberatan dan kesulitan implementasinya. 

Daripada berkeluh kesah tiada guna, mari kita lihat satu persatu masalahnya.



#### Programmer : Bikin unit test? Nambah kerjaan aja. Lagian test code kan gak dideliver ke client


Jawaban saya: 
Unit test itu adalah investasi Anda. Bayangkan beberapa bulan/tahun yang akan datang, client datang ke kita, meminta perbaikan untuk error dalam aplikasi. Padahal kita sedang sibuk mengerjakan proyek lain yang sama sekali berbeda. Hampir seluruh kode sudah kita lupakan. Bahkan untuk method sederhana seperti ini 

    calc.divide(x, y);

kita sudah lupa bagaimana behaviournya kalau menghadapi pembagian dengan nol, bilangan negatif, atau bilangan tidak bulat. Dan seperti biasa, kita tidak membuat komentar Javadoc.

*Unit test to the rescue*. Tinggal buka unit test untuk kode di atas, dan kita akan melihat bagaimana kode tersebut menghadapi bilangan negatif, nol, dan kasus-kasus aneh lainnya.

Next .. 



#### Programmer : Aplikasi saya mengakses jaringan/database/email. Sulit dites


Jawaban saya: 
Itu namanya integration testing, bukan unit testing. Walaupun demikian, tetap bisa dites secara otomatis. Tapi butuh sedikit investasi tambahan. 

Misalnya, kita punya method seperti ini:

    public void process(Order order) {
        // coba lihat customernya, periksa saldonya
        Customer c = order.getCustomer();
        if(c.getBalance() < 0) {
            // handle error
        }
        
        // saldo ok, simpan order ke database
        String sql = "INSERT INTO tbl_order VALUES (?, ?, ?)";

        // kirim email konfirmasi
        String dest = c.getEmail();
        // kode send email tidak ditunjukkan
    }

Seperti kita lihat, ada beberapa integration point di sini, yaitu akses database dan koneksi ke mail server. 

Untuk mengotomasi pengetesan method ini, kita gunakan teknik yang sudah teruji dari 400 tahun lalu: *divide et impera*. Yang tidak tidur di kelas waktu pelajaran Sejarah pasti tau teknik ini. 
Sekarang teknik ini sudah diadaptasi ke dunia programming dengan istilah Refactoring. Silahkan google keyword tersebut untuk lebih jelasnya. 

Pada contoh kita di atas, kita me-refactor kode akses database dan koneksi mail server ke class yang berbeda. Kita pisahkan kode tersebut ke class tersendiri. Berikut adalah interfacenya:

    public interface OrderDao {
        public void save(Order o);
    }

dan

    public interface MailSender {
        public void send(String from, String to, String message);
    }

Implementasinya disisakan buat latihan di rumah.

Sehingga method kita menjadi seperti ini:

    public void process(Order order) {
        // coba lihat customernya, periksa saldonya
        Customer c = order.getCustomer();
        if(c.getBalance() < 0) {
            // handle error
        }
        
        orderDao.save(order);
        
        mailSender.send(adminEmail, c.getEmail(), "Order sudah dikirim");
    }

Dengan adanya kedua class tambahan ini, kita bisa menggunakan [Mock Object](http://www.easymock.org/ "Salah satu implementasi mock object") untuk memalsukan object orderDao dan mailSender. Kita bisa buat kedua object ini selalu sukses, atau selalu gagal, tergantung skenario yang mau dites.

OrderDao sendiri bisa dites dengan menggunakan [teknik pengetesan database](http://endy.artivisi.com/blog/java/ruthless-testing-4/ "Database Testing"). MailSender dapat ditest dengan menggunakan [Dumbster](http://quintanasoft.com/dumbster/ "Mail Server Palsu"), mail server palsu. 

Kasus seperti ini biasanya terjadi karena kodenya sudah terlanjur campur aduk. Apabila unit test diterapkan dari awal project, programmer terkondisi untuk membuat kode yang mudah dites, sehingga effort untuk refactor tidak terlalu besar. 

Tujuan utama kita adalah semua tes bisa dijalankan otomatis, independen (tes satu tidak mempengaruhi tes lain) dan *repeatable*(bisa diulang-ulang dengan hasil yang konsisten).
Tidak harus menggunakan JUnit. Bisa pakai tools buatan sendiri.

Keberatan berikutnya datang dari project manager. 



#### Project Manager : Berarti saya harus alokasikan waktu tambahan untuk membuat unit test, wah bisa-bisa saya dimarahi client/bos.


Jawaban saya: 
Bos... programmer Anda *pasti* membuat kode test, walaupun tidak otomatis. Ini sudah naluri dasar manusia. 

Berikut contohnya: 

    public void process(Order order) {
        // coba lihat customernya, periksa saldonya
            
        // saldo ok, simpan order ke database
        String sql = "INSERT INTO tbl_order VALUES (?, ?, ?)";
  
        // coba periksa ... nanti kita hapus lagi
        String coba = "SELECT * FROM tbl_order WHERE .. ";

        // kirim email konfirmasi
        String dest = c.getEmail();
        // kode send email tidak ditunjukkan
    }

Jadi, daripada dia pasang kode test di kode program, dan nantinya dihapus lagi, kan sayang. Lebih baik suruh saja untuk bikin unit test betulan. 
Keuntungan berikutnya, dengan banyaknya unit test, kesalahan coding akan lebih cepat ditemukan, sehingga pada tahap testing oleh client, lebih sedikit bug yang ditemukan.
Dengan demikian, alokasi waktu untuk rework akan lebih sedikit. 



#### Project Manager : Kalau terlalu banyak unit test, nanti aplikasinya menjadi rumit.


Jawaban saya:
Justru sebaliknya. Aplikasi yang banyak unit testnya akan menjadi lebih modular dan tidak terlalu kusut struktur internalnya. Dengan demikian, kode program menjadi lebih mudah dipelihara dan dikembangkan. 


Terakhir, ada beberapa tips dari saya agar penerapan unit testing dapat berjalan dengan optimal:

*  siapkan infrastruktur sebelum mulai coding
*  sering-sering refactor agar kode mudah dites
*  gunakan coverage testing sebagai pelengkap, agar kekurangan unit test cepat terdeteksi
*  terapkan daily build otomatis yang menjalankan semua tes 

Demikian, semoga bermanfaat
