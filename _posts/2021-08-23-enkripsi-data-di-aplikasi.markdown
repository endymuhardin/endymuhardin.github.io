---
layout: post
title: "Enkripsi Data dalam Aplikasi"
date: 2021-08-23 07:14
comments: true
categories: 
- java
---

Pengamanan data sensitif di aplikasi

Dalam membuat aplikasi, kita seringkali butuh untuk menyimpan data user, misalnya:

* Nomor KTP
* Nama ibu kandung
* Upload foto KTP
* Ijazah
* dan berbagai informasi pribadi lainnya

Sebagai programmer yang bertanggung jawab, sudah seharusnya kita melakukan usaha yang memadai untuk melindungi data-data pribadi user kita tersebut. Tidak perlu jumawa mengenai keamanan sistem kita, bahkan perusahaan besar sekelas Amazon, Facebook, Tokopedia saja sudah menerima kunjungan hacker. Apalagi kita-kita rakyat kecil begini :D

Jadi, dalam merancang aplikasi, kita harus berasumsi bahwa suatu saat cracker akan bisa masuk ke dalam server kita dan mengambil data aplikasi. Baik itu data dalam database server (MySQL, PostgreSQL, dsb) ataupun file-file yang diupload oleh user.

Kita harus mencegah usaha cracker tersebut untuk membaca data-data pribadi user. Sehingga walaupun dia punya filenya, tapi dia tidak bisa membaca informasi di dalamnya.

Dalam artikel berikut ini, kita akan membahas cara yang bisa kita lakukan untuk mengamankan data pribadi tersebut.

<!--more-->

## Konsep Pengelolaan Data Rahasia ##

Secara garis besar, ada dua jenis data rahasia yang kita kelola dalam aplikasi, yaitu:

1. Data yang tidak perlu diketahui informasi aslinya. Contohnya password. Kita tidak perlu tahu isi password yang asli. Karena kita cuma perlu membandingkan password yang diinput user dengan password yang tersimpan di database.
2. Data yang harus diketahui informasi aslinya. Contohnya nomor identitas (NIK), foto KTP, dan sebagainya. User perlu melihat file aslinya untuk melakukan.

Untuk data kategori pertama, cara yang tepat untuk mengamankannya adalah dengan metode `hash`. Algoritma hash mengkonversi informasi asli menjadi informasi acak yang tidak bisa dikembalikan ke kondisi awal. Untuk penjelasan lebih detail bisa ditonton di video saya di Youtube

<iframe width="560" height="315" src="https://www.youtube.com/embed/NOMGdmhHPsw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Kita harus menggunakan algoritma hash khusus untuk password, yaitu bcrypt, scrypt, atau pbkdf2. Kalau kita menggunakan Spring Security, caranya tidak sulit. Berikut contohnya menggunakan BCrypt

```java
PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();
String hashedPassword = bcryptEncoder.encode(plainPassword);
```

Untuk kategori kedua, cara yang tepat adalah dengan metode enkripsi. Sehingga nilai asli yang sudah dienkripsi bisa dikembalikan ke nilai semula pada saat akan digunakan. Penjelasan detail mengenai enkripsi juga sudah ada di youtube

<iframe width="560" height="315" src="https://www.youtube.com/embed/2e0kl1C-7F0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Dalam melakukan enkripsi, algoritma yang kita gunakan adalah algoritma yang sudah dikenal dan dinyatakan kuat dan aman secara ilmiah oleh para ahli kriptografi. Kita jangan mengarang-ngarang algoritma sendiri, kecuali kita adalah profesor di bidang kriptografi. 

Keamanan suatu enkripsi bergantung pada keamanan penyimpanan keynya. Jadi walaupun semua orang di dunia mengetahui rumus/algoritma/cara kerja enkripsinya, kalau dia tidak punya `key`, maka dia tidak bisa melakukan dekripsi data dan melihat isi aslinya.

Untuk memudahkan saya menulis artikel, kita akan menggunakan beberapa istilah, yaitu:

* plaintext : informasi asli
* ciphertext : informasi yang telah dienkripsi sehingga tidak terbaca

Tempat penyimpanan key yang paling aman adalah menggunakan Hardware Security Module (HSM). Ini adalah mesin khusus yang tugasnya menyimpan key. Dia memiliki berbagai perangkat pendeteksi aksi pembobolan. Bila dia merasa sedang dibobol, maka dia akan menghapus key yang dia simpan, sehingga orang tidak bisa membacanya.

Akan tetapi, HSM ini harganya relatif mahal. Bisa seharga mobil baru. Oleh karena itu, kita akan menggunakan penyimpanan key berupa aplikasi open source yang gratis, yaitu [Vault](https://www.vaultproject.io). Aplikasi Vault ini sudah diakui dan dipakai di berbagai skenario production. 

## Arsitektur Aplikasi dengan Vault ##

Untuk memahami penggunaan Vault, berikut adalah aplikasi kita sebelum melakukan enkripsi data pribadi

[![Diagram sebelum pakai vault]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/01-arsitektur-sebelum-enkripsi.jpg)]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/01-arsitektur-sebelum-enkripsi.jpg)

Database kita terlihat seperti ini

[![Database sebelum pakai vault]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/05-db-sebelum-enkripsi.png)]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/05-db-sebelum-enkripsi.png)

Dan penyimpanan file kita seperti ini

[![Folder sebelum pakai vault]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/03-file-sebelum-enkripsi.png)]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/03-file-sebelum-enkripsi.png)

Dan berikut ini adalah arsitektur aplikasi kita setelah menggunakan Vault.

[![Diagram setelah pakai vault]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/02-arsitektur-setelah-enkripsi.jpg)]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/02-arsitektur-setelah-enkripsi.jpg)

Database yang sudah terenkripsi

[![Database setelah pakai vault]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/06-db-setelah-enkripsi.png)]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/06-db-setelah-enkripsi.png)

Dan penyimpanan file yang sudah terenkripsi

[![Folder setelah pakai vault]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/04-file-setelah-enkripsi.png)]({{site.url}}/images/uploads/2021/enkripsi-data-pribadi/04-file-setelah-enkripsi.png)

Secara garis besar, berikut adalah langkah-langkah yang kita lakukan pada waktu user memasukkan data pribadi:

1. Input di aplikasi
2. Kirim informasi tersebut ke Vault untuk dienkripsi
3. Terima ciphertext dari Vault
4. Insert ciphertext ke database/file

Dan berikut adalah yang kita lakukan pada waktu user ingin melihat datanya:

1. Baca ciphertext dari database/file
2. Kirim ke Vault untuk didekripsi
3. Terima plaintext dari Vault
4. Tampilkan datanya

## Koneksi ke Vault ##

Kode program untuk membuat koneksi ke Vault seperti ini.

```java
@Configuration
@PropertySource("classpath:application.properties")
@Import(EnvironmentVaultConfiguration.class)
public class VaultConfig  {

    @Bean
    public VaultOperations vaultOperations(EnvironmentVaultConfiguration config) {
        return new VaultTemplate(config.vaultEndpoint(), config.clientAuthentication());
    }
}
```

Kode program di atas membaca file konfigurasi di `application.properties`. Untuk menyederhakanan contoh, kita menggunakan metode otentikasi `token` ke Vault. Nantinya pada waktu sudah naik production, kita akan menggunakan metode otentikasi lain yang lebih serius seperti AppRole atau Vault Agent. Berikut isi `application.properties`

```
vault.uri=http://localhost:8200
vault.token=s.i4cnIV0dNXhUbazeIFShZam8
```

## Persiapan Vault ##

Kita jalankan dulu Vault server dengan mengetik perintah berikut di command line

```
vault server -dev
```

Outputnya seperti ini

```
==> Vault server configuration:

            Api Address: http://127.0.0.1:8200
                    Cgo: disabled
        Cluster Address: https://127.0.0.1:8201
            Go Version: go1.16.6
            Listener 1: tcp (addr: "127.0.0.1:8200", cluster address: "127.0.0.1:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "disabled")
            Log Level: info
                Mlock: supported: false, enabled: false
        Recovery Mode: false
                Storage: inmem
                Version: Vault v1.8.1
            Version Sha: 4b0264f28defc05454c31277cfa6ff63695a458d

==> Vault server started! Log data will stream in below:

2021-08-22T16:47:27.375+0700 [INFO]  proxy environment: http_proxy="" https_proxy="" no_proxy=""
2021-08-22T16:47:27.375+0700 [WARN]  no `api_addr` value specified in config or in VAULT_API_ADDR; falling back to detection if possible, but this value should be manually set
2021-08-22T16:47:27.376+0700 [INFO]  core: security barrier not initialized
2021-08-22T16:47:27.376+0700 [INFO]  core: security barrier initialized: stored=1 shares=1 threshold=1
2021-08-22T16:47:27.376+0700 [INFO]  core: post-unseal setup starting
2021-08-22T16:47:27.380+0700 [INFO]  core: loaded wrapping token key
2021-08-22T16:47:27.380+0700 [INFO]  core: successfully setup plugin catalog: plugin-directory=""
2021-08-22T16:47:27.380+0700 [INFO]  core: no mounts; adding default mount table
2021-08-22T16:47:27.381+0700 [INFO]  core: successfully mounted backend: type=cubbyhole path=cubbyhole/
2021-08-22T16:47:27.381+0700 [INFO]  core: successfully mounted backend: type=system path=sys/
2021-08-22T16:47:27.381+0700 [INFO]  core: successfully mounted backend: type=identity path=identity/
2021-08-22T16:47:27.383+0700 [INFO]  core: successfully enabled credential backend: type=token path=token/
2021-08-22T16:47:27.383+0700 [INFO]  rollback: starting rollback manager
2021-08-22T16:47:27.383+0700 [INFO]  core: restoring leases
2021-08-22T16:47:27.383+0700 [INFO]  identity: entities restored
2021-08-22T16:47:27.383+0700 [INFO]  identity: groups restored
2021-08-22T16:47:27.383+0700 [INFO]  core: post-unseal setup complete
2021-08-22T16:47:27.384+0700 [INFO]  expiration: lease restore complete
2021-08-22T16:47:27.384+0700 [INFO]  core: root token generated
2021-08-22T16:47:27.384+0700 [INFO]  core: pre-seal teardown starting
2021-08-22T16:47:27.384+0700 [INFO]  rollback: stopping rollback manager
2021-08-22T16:47:27.384+0700 [INFO]  core: pre-seal teardown complete
2021-08-22T16:47:27.384+0700 [INFO]  core.cluster-listener.tcp: starting listener: listener_address=127.0.0.1:8201
2021-08-22T16:47:27.384+0700 [INFO]  core.cluster-listener: serving cluster requests: cluster_listen_address=127.0.0.1:8201
2021-08-22T16:47:27.384+0700 [INFO]  core: post-unseal setup starting
2021-08-22T16:47:27.384+0700 [INFO]  core: loaded wrapping token key
2021-08-22T16:47:27.384+0700 [INFO]  core: successfully setup plugin catalog: plugin-directory=""
2021-08-22T16:47:27.384+0700 [INFO]  core: successfully mounted backend: type=system path=sys/
2021-08-22T16:47:27.384+0700 [INFO]  core: successfully mounted backend: type=identity path=identity/
2021-08-22T16:47:27.384+0700 [INFO]  core: successfully mounted backend: type=cubbyhole path=cubbyhole/
2021-08-22T16:47:27.385+0700 [INFO]  core: successfully enabled credential backend: type=token path=token/
2021-08-22T16:47:27.385+0700 [INFO]  rollback: starting rollback manager
2021-08-22T16:47:27.385+0700 [INFO]  core: restoring leases
2021-08-22T16:47:27.385+0700 [INFO]  expiration: lease restore complete
2021-08-22T16:47:27.385+0700 [INFO]  identity: entities restored
2021-08-22T16:47:27.385+0700 [INFO]  identity: groups restored
2021-08-22T16:47:27.385+0700 [INFO]  core: post-unseal setup complete
2021-08-22T16:47:27.385+0700 [INFO]  core: vault is unsealed
2021-08-22T16:47:27.386+0700 [INFO]  core: successful mount: namespace="" path=secret/ type=kv
2021-08-22T16:47:27.397+0700 [INFO]  secrets.kv.kv_54d0d613: collecting keys to upgrade
2021-08-22T16:47:27.397+0700 [INFO]  secrets.kv.kv_54d0d613: done collecting keys: num_keys=1
2021-08-22T16:47:27.397+0700 [INFO]  secrets.kv.kv_54d0d613: upgrading keys finished
WARNING! dev mode is enabled! In this mode, Vault runs entirely in-memory
and starts unsealed with a single unseal key. The root token is already
authenticated to the CLI, so you can immediately begin using Vault.

You may need to set the following environment variable:

    $ export VAULT_ADDR='http://127.0.0.1:8200'

The unseal key and root token are displayed below in case you want to
seal/unseal the Vault or re-authenticate.

Unseal Key: RjzDixgmnX3WVm8W+w/RXjeqq2BIfWGvcjozY/ry/UU=
Root Token: s.i4cnIV0dNXhUbazeIFShZam8

Development mode should NOT be used in production installations!
```

Cek status vault server. Buka terminal satu lagi, kemudian set `VAULT_ADDR` dan `VAULT_TOKEN`

```
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN='s.i4cnIV0dNXhUbazeIFShZam8'
```

Setelah itu, cek status

```
vault status
```

Outputnya seperti ini

```
Key             Value
---             -----
Seal Type       shamir
Initialized     true
Sealed          false
Total Shares    1
Threshold       1
Version         1.8.1
Storage Type    inmem
Cluster Name    vault-cluster-cac24b22
Cluster ID      0cde6468-5a95-2d6c-282f-e2d2bd52cbd3
HA Enabled      false
```

Untuk melakukan enkripsi/dekripsi ini, kita membutuhkan secret engine `transit`. Ini adalah fitur Vault untuk melakukan enkripsi/dekripsi tanpa menyimpan datanya. Jadi kita sendiri yang harus menyimpan data yang sudah dienkripsi. Berikut adalah perintah untuk mengaktifkan secret engine `transit`.

```
vault secrets enable transit
```

Outputnya seperti ini

```
Success! Enabled the transit secrets engine at: transit/
```

Cek status

```
vault secrets list
```

Outputnya seperti ini

```
Path          Type         Accessor              Description
----          ----         --------              -----------
cubbyhole/    cubbyhole    cubbyhole_af98da45    per-token private secret storage
identity/     identity     identity_a2a21ca7     identity store
secret/       kv           kv_54d0d613           key/value secret storage
sys/          system       system_20f0a31f       system endpoints used for control, policy and debugging
transit/      transit      transit_39891d6a      n/a
```

## Enkripsi dan Dekripsi String ##

Sebelum mulai melakukan enkripsi, kita harus menyuruh Vault untuk membuat key dan menyimpannya. Key tidak kita simpan sendiri, karena lebih aman kalau disimpan dalam Vault. Memang itu tugasnya dia. Berikut kode program untuk inisialisasi key. Kita lakukan di constructor, karena cuma perlu dilakukan sekali saja.

```java
@Service @Slf4j
public class VaultService {
    private static final String KEY_TYPE = "aes128-gcm96";
    private static final String KEY_ENCRYPT_STRING = "KEY_ENCRYPT_STRING";

    private VaultTransitOperations vaultTransit;

    public VaultService(VaultOperations vaultOperations) {
        vaultTransit = vaultOperations.opsForTransit();
        vaultTransit.createKey(KEY_ENCRYPT_STRING,
                VaultTransitKeyCreationRequest.ofKeyType(KEY_TYPE));
    }
}
```

Berikutnya, kita mengirim informasi yang ingin dienkripsi. Berikut kode programnya untuk mengenkripsi `String`

```java
public String encrypt(String plaintext) {
    return vaultTransit.encrypt(KEY_ENCRYPT_STRING, plaintext);
}
```

Method tersebut bisa kita panggil seperti ini

```java

@Test
public void testEncryptString() {
    String nik = "123456789";
    String encryptedNik = vaultService.encrypt(nik);
    Assertions.assertNotNull(encryptedNik);
    System.out.println("Encrypted : " + encryptedNik);
}
```

Outputnya seperti ini:

```
Encrypted : vault:v1:iiAEK0ewEyOaNe41Z/4A/nnum1r5Kf+ixNGSTvQIMyGZV6vCwfaiQg==
```

Untuk mendapatkan nilai yang asli kembali, kita lakukan dekripsi. Kode programnya seperti ini

```java
public String decrypt(String cipherText) {
    return vaultTransit.decrypt(KEY_ENCRYPT_STRING, cipherText);
}
```

Menjalankannya seperti ini

```java
@Test
public void testDecryptString() {
    String encryptedNik = "vault:v1:OZPO/nkobDFqMsCF5snQGgWoUtLdt2tp/lmr9zF/TAV4rRnH+A==";
    String decryptedNik = vaultService.decrypt(encryptedNik);
    Assertions.assertNotNull(decryptedNik);
    System.out.println("Decrypted : " + decryptedNik);
}
```

Bila dijalankan, hasilnya seperti ini

```
Decrypted : 123456789
```

## Enkripsi dan Dekripsi File ##

Untuk file sebetulnya sama saja. Vault sebetulnya hanya menerima jasa enkripsi untuk tipe data `String`. Jadi bila kita punya file gambar (jpg, png) atau dokumen (doc, xls, pdf), kita harus konversi dulu menjadi String dengan encoding Base64.

Berikut kode program untuk konversi Base64 dan melakukan enkripsi

```java
public File encrypt(File plainFile){
    try {
        String base64Encoded = Base64.getEncoder().encodeToString(FileUtils.readFileToByteArray(plainFile));
        String base64Encrypted = encrypt(base64Encoded);
        File result = File.createTempFile(plainFile.getName()+"%", "-enc.txt");
        FileUtils.writeStringToFile(
                    result,
                    base64Encrypted, StandardCharsets.UTF_8);
        return result;
    } catch (IOException e) {
        log.error(e.getMessage(), e);
    }
    return null;
}
```

Bila dijalankan, hasilnya seperti ini.

```
Encrypted file : /var/folders/qx/dsj14n214d92nqfd0_mgd03c0000gn/T/ktp-plain.png%16902871742519479631-enc.txt
```

File yang didapatkan adalah berupa text file. Berikut sebagian isinya (dipotong karena terlalu panjang)

```
vault:v1:NDyul09w/otGzBHGepJmQVOV9imzM68SFERrq2Z3aux0KPdvLI/VgSFZt4urPCBjVaMZmZaLkdV6nc1M3pH5Xtc62pUjwSOhDch+FCk/ndyYPaSd2BFyRcxygT76gUEcNzS3UIDfZlFuq1IHWcX3xZ++bDf93xfbXoxv8RvsOP2Yx8ek7Xqedjn8oYP+syZK/uYnPOZAg8BomrmNEVotflylZuFN1oRuC0mUcd9mhbmKPGEzDz+974kOciVb9FFWp/wsm28INgmJl6a5/oZgTOSrVW3zjqB3txwj76o
```

Untuk mengembalikan file terenkripsi menjadi file asli, kita lakukan dekripsi seperti ini

```java
public File decrypt(File cipherFile) {
    try {
        String cipherFileContent = FileUtils.readFileToString(cipherFile, StandardCharsets.UTF_8);
        String base64Encoded = decrypt(cipherFileContent);
        File result = File.createTempFile(UUID.randomUUID().toString(), ".png");
        byte[] decryptedFileContent = Base64.getDecoder().decode(base64Encoded);
        FileUtils.writeByteArrayToFile(result, decryptedFileContent);
        return result;
    } catch (IOException e) {
        log.error(e.getMessage(), e);
    }
    return null;
}
```

Bila dijalankan, berikut adalah hasilnya

```
Decrypted file : /var/folders/qx/dsj14n214d92nqfd0_mgd03c0000gn/T/9156c7d7-d9f4-47d2-abaa-3217c0ce4dc94032189875688153456.png
```

Kita cek di folder yang disebutkan di output. Filenya harusnya sudah terlihat gambar aslinya.

Selamat mencoba. Mudah-mudahan dengan mengimplementasikan artikel ini, aplikasi yang kita buat akan menjadi lebih aman.

Semoga bermanfaat ... 