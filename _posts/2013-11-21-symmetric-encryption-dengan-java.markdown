---
layout: post
title: "Symmetric Encryption dengan Java"
date: 2013-11-21 12:00
comments: true
categories: 
- java
---

Beberapa hari terakhir ini, media massa ribut-ribut mengenai telepon si bos yang disadap orang ostrali. Karena ini blog programming, kita tidak akan membahas tentang implikasi politik dari urusan sadap-menyadap tersebut. Kita juga tidak akan membahas kelakuan ABG script-kiddies yang sudah merasa hebat hanya bermodal donlod script dan menjalankannya (di Windows lagi ;p)

Pada artikel ini, kita akan membahas tentang enkripsi dan dekripsi file. Bagaimana konsepnya, apa pilihan-pilihan yang tersedia, dan mana yang sebaiknya digunakan.

> Warning! Topik tingkat advanced. Minimal harus sudah menguasai `java.io`.

<!--more-->

Enkripsi adalah proses mengacak data sehingga tidak bisa dibaca orang yang tidak berhak. Sebelum lebih jauh, kita bahas dulu beberapa istilah:

* enkripsi : proses mengacak data sehingga sulit dibaca
* dekripsi : proses membalik data yang diacak sehingga bisa dibaca lagi
* key : serangkaian angka/huruf yang digunakan untuk proses enkripsi dan dekripsi
* plaintext : data yang ingin dienkripsi. Biasanya data rahasia dan penting, kalau tidak buat apa repot2 dienkripsi.
* ciphertext : data yang sudah dienkripsi. Cipher text ini secara teori tidak bisa dibaca oleh orang yang tidak punya key.

Prosesnya sederhana. 

* Untuk mengenkripsi :

```
plaintext + key => ciphertext
```

* Untuk mendekripsi :

```
ciphertext + key => plaintext
```

## Berbagai Jenis Enkripsi ##

Sebenarnya cuma ada dua, jadi tidak perlu pusing ;)

* [Symmetric Encryption](http://en.wikipedia.org/wiki/Symmetric-key_algorithm) : key untuk enkripsi **sama** dengan key untuk dekripsi
* [Asymmetric Encryption](http://en.wikipedia.org/wiki/Public-key_cryptography) : key untuk enkripsi **berbeda** dengan key untuk dekripsi

Pada prakteknya, kedua jenis enkripsi ini dipakai secara bersamaan. Jadi bukan pilih yang mana, tapi pakai dua-duanya.

> Kenapa begitu?

Dengan asymmetric encryption [sulit untuk mengenkripsi data yang besar](http://stackoverflow.com/questions/10007147/getting-a-illegalblocksizeexception-data-must-not-be-longer-than-256-bytes-when) dan juga [tidak aman](http://en.wikipedia.org/wiki/RSA_\(algorithm\)#Attacks_against_plain_RSA). Oleh karena itu, biasanya asymmetric encryption hanya digunakan untuk mengenkripsi `key` saja untuk kemudian dikirim ke pihak lain yang berkomunikasi dengan kita. `Key` inilah yang nantinya akan digunakan untuk mengenkripsi data sebenarnya menggunakan metode symmetric.

Asymmetric encryption akan kita bahas pada kesempatan lain.

Ada dua metode dalam symmetric encryption, yaitu:

* [stream cipher](http://en.wikipedia.org/wiki/Stream_cipher) : mengenkripsi tiap byte data
* [block cipher](http://en.wikipedia.org/wiki/Block_cipher) : membagi data menjadi beberapa blok, kemudian mengenkripsi masing-masing blok. 

Kali ini kita hanya membahas block cipher saja.


## Cara Kerja Block Cipher ##

Pertama, kita bagi dulu data menjadi blok-blok. Satu blok ukurannya berbeda-beda tergantung algoritma yang digunakan. Misalnya, algoritma AES bloknya berisi 128 bit (atau 16 byte) data. Jadi kalau data kita ada 1 KB, maka akan dibagi menjadi 1024 * 16 = 64 blok.

Masing-masing blok lalu dienkripsi secara terpisah, seperti ilustrasi berikut yang [diambil dari Wikipedia](http://en.wikipedia.org/wiki/Block_cipher_modes_of_operation)

[![Foto](https://lh3.googleusercontent.com/-4-C-V41PDlM/Uo2LxRnUjOI/AAAAAAAACSw/JzcKfGUMsAQ/w600-h245-no/Ecb_encryption.png)](https://lh3.googleusercontent.com/-4-C-V41PDlM/Uo2LxRnUjOI/AAAAAAAACSw/JzcKfGUMsAQ/w600-h245-no/Ecb_encryption.png)

Ada berbagai metode dalam mengenkripsi blok-blok data ini. Gambar di atas menunjukkan metode Electronic Codebook yang paling sederhana. Banyak metode lain dengan berbagai plus dan minusnya. Kita tidak akan bahas di sini, silahkan lihat penjelasannya [di Wikipedia](http://en.wikipedia.org/wiki/Block_cipher_modes_of_operation) atau [di Stack Overflow](http://stackoverflow.com/a/1220869).

Setelah memahami cara kerjanya, kita buat dulu rekapitulasi komponen apa saja yang kita butuhkan dalam proses enkripsi ini:

* plaintext yang ingin dienkripsi
* key. Untuk symmetric encryption, key ini harus dirahasiakan. Sebab siapapun yang memiliki key akan bisa melakukan dekripsi
* [initialization vector](http://en.wikipedia.org/wiki/Initialization_vector) : random input supaya hasil enkripsi terlihat berbeda walaupun plain text dan key sama. Initialization vector tidak harus dirahasiakan. Kita bisa kirim IV bersama dengan ciphertext. Walaupun demikian, IV ini harus unik dan sulit ditebak (random). Mengapa? Silahkan baca diskusinya [di Stack Overflow](http://stackoverflow.com/questions/3008139/why-is-using-a-non-random-iv-with-cbc-mode-a-vulnerability)
* algoritma
* block cipher mode : metode untuk menggabungkan blok data yang dienkripsi. Block encryption bekerja dengan cara memotong data seukuran blok yang dia mau. Kemudian masing-masing blok dienkripsi. Hasil akhirnya digabungkan menjadi satu lagi. Metode potong-enkripsi-gabung ini [memiliki beberapa implementasi berbeda dengan konsekuensi berbeda pula](http://en.wikipedia.org/wiki/Block_cipher_modes_of_operation).
* padding : Karena ukuran data yang akan dienkripsi bervariasi, kemungkinan besar blok paling akhir tidak terisi penuh. Padahal block encryption mengharuskan semua bloknya terisi. Untuk itu kita harus _menambal_ data jika tidak pas memenuhi ukuran blok. Metode manapun yang dipilih [tidak berpengaruh terhadap security](http://crypto.stackexchange.com/a/1488). Jadi pilih mana saja yang bisa dipakai.

## Memilih Algoritma ##

Ada beberapa pilihan algoritma untuk melakukan enkripsi, diantaranya:

* DES
* Triple Des / 3DES
* AES
* Blowfish
* dsb

Masing-masing memiliki plus-minus, untuk menyingkat pembahasan, kita akan menggunakan AES saja. Perbandingan dan alasan pemilihan AES bisa dibaca [di artikel ini](http://www.javamex.com/tutorials/cryptography/ciphers.shtml).

Selain AES, 3DES juga banyak digunakan di industri perbankan untuk mengamankan transaksi ATM, EDC, dan berbagai bentuk transaksi elektronik lainnya. Algoritma manapun yang digunakan tidak masalah, langkah-langkah dan prinsipnya tetap sama. Untuk mengubah dari algoritma satu ke yang lain cuma perlu mengubah satu baris kode program saja.

Pilihan algoritma yang didukung oleh Java bisa dibaca [di daftar ini](http://docs.oracle.com/javase/7/docs/technotes/guides/security/StandardNames.html#Cipher).

## Generate Key ##

Sebelum membuat key, kita harus menentukan dulu panjang keynya. 

> Berapa panjang key yang ideal?

Menurut NSA, 256 bit. [Katanya supaya kebal dari serangan quantum computer](https://twitter.com/SteveBellovin/status/311545287313330176). Nah, sudah jelas bahwa saya tidak lebih pintar daripada NSA, yang mengajari orang ostrali bagaimana cara menyadap bos kita. Jadi ya kita terima saja sarannya untuk menggunakan 256 bit. Toh ngetik 128 dan 256 sama-sama efisien dari sisi jumlah tombol yang ditekan ;)

Dengan menggunakan 256 bit, kita akan mendapatkan [keuntungan tambahan](http://blog.agilebits.com/2013/03/09/guess-why-were-moving-to-256-bit-aes-keys/) jika nantinya kita menggunakan [message authentication](http://blog.agilebits.com/2013/01/18/authenticated-encryption-and-how-not-to-get-caught-chasing-a-coyote/) dan [password derivation](http://blog.agilebits.com/2011/05/05/defending-against-crackers-peanut-butter-keeps-dogs-friendly-too/).

Berdasarkan cara membuatnya, kita bedakan menjadi dua macam key:

* key yang dibuat secara random
* key yang ditentukan user (password)

Random key biasanya digunakan tanpa user input. Misalnya aplikasi A ingin mengirim data ke aplikasi B. Supaya aman, data ini ingin dienkripsi. Supaya lebih aman, key yang digunakan untuk enkripsi diganti secara periodik, supaya tidak bisa ditebak oleh penyadap. Nah tentunya akan sangat merepotkan kalau key ini harus diinput user tiap kali dia harus diganti. Untuk keperluan ini, kita gunakan random key. Karena tidak perlu dihafalkan manusia, maka key ini bentuknya bebas saja.

Berbeda halnya dengan key yang ditentukan user. Karena key ini harus dihafalkan user, maka biasanya user mencari rangkaian huruf/angka yang mudah dia hafalkan. Untuk itu, perlu ada tindakan tambahan supaya lebih aman. Tindakan tambahan ini disebut dengan istilah [key stretching](http://en.wikipedia.org/wiki/Key_stretching).

Cara kerja key stretching intinya adalah [key derivation](http://en.wikipedia.org/wiki/Key_derivation_function), yaitu mengkonversi key asli menjadi key turunan. Key turunan inilah yang sebenarnya digunakan untuk melakukan enkripsi, bukan key asli. Proses key derivation dirancang sedemikian rupa untuk menghindari [kelemahan](http://en.wikipedia.org/wiki/Weak_key) yang biasa ditemukan di password biasa, misalnya:

* jumlah karakternya kurang
* variasi angka/huruf/karakter kurang banyak
* biasanya menggunakan kata-kata yang ada di kamus, sehingga mudah ditebak
* urutan karakter tidak random (misalnya abcd4321, cobacoba1234)

Melalui proses _key stretching_ password yang biasanya tidak memenuhi syarat kriptografi dikonversi sehingga memenuhi syarat. Algoritma yang biasa digunakan antara lain:

* [PBKDF2](http://en.wikipedia.org/wiki/PBKDF2)
* [Bcrypt](http://en.wikipedia.org/wiki/Bcrypt)
* [Scrypt](http://en.wikipedia.org/wiki/Scrypt)

Kita hanya akan bahas PBKDF2 saja karena:

* populer
* tersedia di Java tanpa perlu donlod paket tambahan
* kebutuhan resource tidak terlalu besar, sehingga tersedia di berbagai platform (misalnya smartphone dan tablet)

### Generate Random Key ###

Berikut kode program untuk membuat key yang random.

```java
KeyGenerator keygen = KeyGenerator.getInstance("AES");
keygen.init(256);
SecretKey key = keygen.generateKey();

System.out.println("Generated Key : " + Base64.encodeBase64String(key.getEncoded()));
```

Key yang digenerate harus sesuai dengan algoritma enkripsi yang digunakan.

### Key Stretching ###

Berikut kode program untuk key stretching. Kita akan membuat key turunan dari password yang lemah (hanya ada huruf, tidak ada angka dan karakter aneh).

```java
String password = "sangat rahasia sekali";
        
// generate random salt
SecureRandom randomizer = new SecureRandom();
BigInteger random = new BigInteger(32, randomizer);
String salt = random.toString(64);

int perulangan = 1000;
String algoritma = "PBKDF2WithHmacSHA1";
int panjangKey = 256;

PBEKeySpec keyspec = new PBEKeySpec(password.toCharArray(), salt.getBytes("UTF-8"), perulangan, panjangKey);
SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(algoritma);
SecretKey key = keyFactory.generateSecret(keyspec);

System.out.println("Password asli : "+password);
System.out.println("Salt : "+salt);
System.out.println("Generated Key : " + Base64.encodeBase64String(key.getEncoded()));
```

Secara fungsi, salt mirip dengan initialization vector. Yaitu agar password yang sama hasil hash-nya berbeda. Salt juga tidak perlu dirahasiakan, tapi perlu disimpan supaya bisa dipakai untuk memeriksa password. Jika kita simpan password di database dengan mekanisme _key stretching_ ini, yang harus kita simpan adalah:

* salt
* jumlah perulangan
* panjang key
* key yang dihasilkan (ciphertext)

> Perhatian! Key stretching ini bekerja satu arah. Artinya kita tidak bisa mendapatkan password plaintext dari ciphertextnya.

## Contoh Kasus ##

Sebagai contoh, kita ingin mengenkripsi file text. Supaya mudah, kita buat saja file text berisi lirik lagu yang bisa kita dapatkan di internet. Sepanjang prosedur enkripsi-dekripsi, ada beberapa file yang kita akan buat:

* `lyric.txt` : file plaintext yang ingin kita enkripsi
* `key.txt` : file berisi key untuk enkripsi. Key ini bisa dibuat secara random ataupun dari input user yang sudah melalui proses _key stretching_.
* `iv.txt` : initialization vector
* `lyric-enc.txt` : file ciphertext hasil enkripsi
* `lyric-dec.txt` : file plaintext hasil dekripsi lyric-enc.txt

Berikut langkah-langkah enkripsi:

1. Generate key
2. Inisialisasi object yang akan melakukan enkripsi (`java.crypto.Cipher`) menggunakan key
3. Generate IV
4. Lakukan prosedur enkripsi, hasilnya tulis ke `lyric-enc.txt`.
5. Tulis juga key ke file `key.txt` dan IV ke file `iv.txt` untuk digunakan dalam proses dekripsi. Pada kondisi riil, IV bisa kita kirimkan melalui jalur publik, sedangkan key harus kita kirim melalui jalur aman. Biasanya key dienkripsi lagi menggunakan asymmetric encryption agar bisa dikirim dengan aman.

Langkah-langkah dekripsi kebalikannya:

1. Baca key dari file `key.txt`
2. Baca IV dari file `iv.txt`
3. Inisialisasi object yang akan melakukan dekripsi (`java.crypto.Cipher`) menggunakan key **dan** IV
4. Lakukan proses dekripsi

Kalau sudah paham langkahnya, mari kita coding. Sebelum masuk ke kriptografi, kita bereskan dulu masalah tampilan.

## String Conversion ##

Proses enkripsi menghasilkan binary data, dalam Java ini ditampung dalam tipe data `byte[]`. Binary data ini tidak bisa kita buka di text editor, sehingga menyulitkan kita untuk debug. Oleh karena itu, kita perlu menggunakan [encoding Base 64](http://en.wikipedia.org/wiki/Base64) untuk mengkonversinya menjadi `String`. Kalau kita langsung memasukkannya ke dalam constructor String, hasilnya akan kacau karena [constructor String bingung ketika menghadapi karakter-karakter aneh](http://stackoverflow.com/a/10759422) (non-printable).

Encoding Base64 kita lakukan dengan [library `commons-codec` dari Apache](http://commons.apache.org/proper/commons-codec/).

## Inisialisasi Cipher untuk Enkripsi ##

Pertama, kita generate dulu key. Untuk enkripsi, object `cipher` harus diinisialisasi dengan key.

```java
String algoritmaKey = "AES";

// generate random key
KeyGenerator keygen = KeyGenerator.getInstance(algoritmaKey);
keygen.init(256);
SecretKey key = keygen.generateKey();

// tulis key ke file untuk keperluan dekripsi
Files.write(keyFile.toPath(), Base64.encodeBase64String(key.getEncoded()).getBytes(), StandardOpenOption.CREATE);
```

Pada kode program di atas, kita lihat bahwa sebelum ditulis ke file, kita encode dulu dengan method `Base64.encodeBase64String` supaya filenya bisa dibuka di text editor.

Setelah punya key, kita buat object `cipher`

```java
String algoritmaEnkripsi = "AES/GCM/NoPadding";
Cipher cipher = Cipher.getInstance(algoritmaEnkripsi);
cipher.init(Cipher.ENCRYPT_MODE, key);
```

Dari kode program di atas, kita bisa lihat bahwa:

* algoritma yang digunakan adalah `AES`
* block cipher mode menggunakan `GCM`
* tidak menggunakan padding / `NoPadding`

Penggunaan GCM lebih direkomendasikan daripada ECB seperti bisa dibaca [di sini](https://web.cs.ucdavis.edu/~rogaway/ocb/gcm.pdf) dan [di sini](https://crypto.stackexchange.com/questions/20941/why-shouldnt-i-use-ecb-encryption).

## Generate Initialization Vector ##

IV kita generate menggunakan object `cipher`

```java
// generate IV
byte[] iv = cipher.getParameters().getParameterSpec(IvParameterSpec.class).getIV();
```

Jangan lupa ditulis ke file karena nanti akan kita butuhkan di proses dekripsi.

```java
Files.write(ivFile.toPath(), Base64.encodeBase64String(iv).getBytes(), StandardOpenOption.CREATE);
```

## Proses Enkripsi ##

Kelengkapan sudah siap, mari kita lakukan proses enkripsi

```java
// tujuan hasil enkripsi
CipherOutputStream writer = 
            new CipherOutputStream(
                new FileOutputStream(encryptedFile), cipher);

// enkripsi isi file
FileReader reader = new FileReader(plain);
int data;
while((data = reader.read()) != -1){
    System.out.print((char)data);
    writer.write(data);
}

reader.close();
writer.close();
```

Seharusnya, pada tahap ini kita sudah memiliki file berikut:

1. `lyric.txt`
2. `key.txt`
3. `iv.txt`
4. `lyric-enc.txt`

File `lyric-enc.txt` dan `iv.txt` kita kirimkan ke penerima. Dia harusnya sudah memiliki file `key.txt`.

Proses enkripsi selesai. Kode program lengkapnya bisa dilihat [di Github](https://github.com/endymuhardin/belajar-enkripsi/blob/master/src/main/java/com/muhardin/endy/belajar/enkripsi/AESEncryptionDemo.java).

Mari kita lanjutkan dengan proses dekripsi.

## Membaca key dan IV dari file ##

Berikut kode programnya

```java
// load key
List<String> keys = Files.readAllLines(keyFile.toPath(), Charset.forName("UTF-8"));
if(keys.isEmpty()){
    throw new IllegalStateException("File key invalid");
}
String key = keys.get(0);
System.out.println("Key : "+key);
SecretKeySpec keySpec = new SecretKeySpec(Base64.decodeBase64(key), algoritmaKey);

// load IV
List<String> ivs = Files.readAllLines(ivFile.toPath(), Charset.forName("UTF-8"));
if(ivs.isEmpty()){
    throw new IllegalStateException("File IV invalid");
}
String iv = ivs.get(0);
System.out.println("IV : "+iv);
IvParameterSpec ivSpec = new IvParameterSpec(Base64.decodeBase64(iv));
```

## Inisialisasi Cipher ##

Untuk proses dekripsi, inisialisasi `cipher` membutuhkan key dan IV.

```java
// inisialisasi AES
Cipher cipher = Cipher.getInstance(algoritmaEnkripsi);
cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
```

Jangan lupa gunakan mode `Cipher.DECRYPT_MODE`.

## Proses Dekripsi ##

Tidak sulit, tinggal membalik saja prosedur enkripsi.

```java
// output hasil dekripsi
FileWriter output = new FileWriter(decryptedFile);

// dekripsi isi file
CipherInputStream cis = new CipherInputStream(new FileInputStream(encryptedFile), cipher);
int data;
while((data = cis.read()) != -1){
    output.write(data);
}
cis.close();
output.close();
```

## Verifikasi ##

Setelah kita punya hasil dekripsi, tentu kita harus verifikasi apakah sama persis dengan aslinya. Caranya adalah dengan membandingkan `hash` file asli dan file hasil dekripsi. Kita bisa gunakan berbagai algoritma seperti `MD5` atau `SHA`. Berikut contohnya

```java
// bandingkan apakah hasil dekripsi sama dengan file asli
String md5sumAsli = DigestUtils.md5Hex(new FileInputStream(plainFile));
String md5sumHasilDekripsi = DigestUtils.md5Hex(new FileInputStream(decryptedFile));
System.out.println("MD5 Sum File Asli           : "+md5sumAsli);
System.out.println("MD5 Sum File Hasil Dekripsi : "+md5sumHasilDekripsi);
System.out.println(md5sumAsli.equals(md5sumHasilDekripsi) ? "Cocok" : "Tidak cocok");
```

Proses dekripsi selesai. Kode program lengkapnya bisa dilihat [di Github](https://github.com/endymuhardin/belajar-enkripsi/blob/master/src/main/java/com/muhardin/endy/belajar/enkripsi/AESDecryptionDemo.java).

### Message Authentication ###

Message authentication cara kerjanya kira-kira sama dengan metode verifikasi di atas. Intinya adalah:

1. Generate hash dari file A
2. Generate hash dari file B
3. Bandingkan, jika hash sama berarti file A dan B isinya sama

Dalam kaitannya dengan enkripsi, kita menambahkan key pada proses hash ini supaya lebih aman. Tanpa key, orang lain bisa mencoba-coba generate hash dari file yang dia miliki. Kalau berhasil membuat hash yang sama, maka dia bisa menebak atau memalsukan data yang dikirim. Dengan menggunakan key yang hanya diketahui pihak yang berkomunikasi, maka orang lain sulit untuk membuat hash yang sama.

Proses ini nama kerennya adalah [HMAC (hash-based message authentication code)](http://en.wikipedia.org/wiki/Hash-based_message_authentication_code).

Berikut kode program untuk menghasilkan hash dari data yang sudah dienkripsi

```java
// HMAC untuk memastikan integritas data
String algoritmaHmac = "HmacSHA512";
KeyGenerator keygenHmac = KeyGenerator.getInstance(algoritmaHmac);
keygenHmac.init(256);

// key untuk HMAC
SecretKey keyHmac = keygenHmac.generateKey();
Files.write(hmacKeyFile.toPath(), 
        Base64.encodeBase64String(keyHmac.getEncoded()).getBytes(), 
        StandardOpenOption.CREATE);

// buat HMAC
Mac hmacGenerator = Mac.getInstance(algoritmaHmac);
hmacGenerator.init(keyHmac);
byte[] hmac = hmacGenerator.doFinal(Files.readAllBytes(encryptedFile.toPath()));
Files.write(hmacFile.toPath(), hmac, StandardOpenOption.CREATE);
```

Perhatikan bahwa kita terlebih dulu menghasilkan key untuk membuat hash. Key ini harus dimiliki juga oleh pihak penerima data.

Sekarang, kita lakukan verifikasi di sisi penerima.

```java
// sebelum dekripsi, cek dulu HMAC apakah datanya otentik
List<String> hmacKeys = Files.readAllLines(hmacKeyFile.toPath(), Charset.forName("UTF-8"));
if(hmacKeys.isEmpty()) {
    throw new IllegalStateException("No mac key");
}
String hmacKey = hmacKeys.get(0);
SecretKeySpec hmacKeySpec = new SecretKeySpec(Base64.decodeBase64(hmacKey), algoritmaHmac);
Mac hmacGenerator = Mac.getInstance(algoritmaHmac);
hmacGenerator.init(hmacKeySpec);

// generate hmac dari data yang diterima
byte[] hmacDiterima = hmacGenerator.doFinal(Files.readAllBytes(encryptedFile.toPath()));
// baca hmac yang disertakan bersama data
byte[] hmacSeharusnya = Files.readAllBytes(hmacFile.toPath());
boolean cocok = Arrays.equals(hmacDiterima, hmacSeharusnya);
System.out.println(cocok ? "HMAC Cocok" : "HMAC Tidak Cocok");
if(!cocok){
    throw new IllegalStateException("Data tidak otentik, mungkin sudah dioprek orang ditengah jalan");
}
```

Verifikasi HMAC ini kita lakukan **sebelum** melakukan dekripsi. Tidak ada gunanya dan menambah resiko kalau kita melakukan proses dekripsi (di mana kita membuka dan menggunakan key rahasia) terhadap data yang invalid.

# Kesimpulan #

Pengirim dan penerima harus terlebih dulu memiliki:

* key enkripsi
* key HMAC

Kedua file ini harus dirahasiakan dari pihak yang tidak berkepentingan. Distribusinya bisa dilakukan dengan enkripsi menggunakan asymmetric encryption.

Pada saat berkomunikasi, pengirim akan memberikan:

* initialization vector
* data yang terenkripsi
* HMAC

Ketiga data di atas boleh dikirim melalui jalur publik.

Setelah menerima ketiga file tersebut, penerima akan melakukan:

1. Generate HMAC dari data terenkripsi
2. Bandingkan HMAC hasil generate dengan HMAC yang dikirim bersama data. Kalau tidak cocok, jangan diteruskan.
3. Kalau cocok, barulah lakukan dekripsi menggunakan key dan IV.

> Bagaimana, pusing?

Ya tinggal pilih, pusing belajar atau kena sadap :D

Kode program selengkapnya (seperti biasa) ada [di Github](https://github.com/endymuhardin/belajar-enkripsi)
