---
layout: post
title: "Enkripsi Data dalam Aplikasi"
date: 2022-09-08 08:14
comments: true
categories: 
- java
---

Tahun lalu, kita sudah membahas cara [enkripsi data di aplikasi menggunakan Vault]({% post_url 2021-08-23-enkripsi-data-di-aplikasi %}). Enkripsi data menggunakan Vault lebih aman, dan saat ini bahkan sudah diterima untuk mengajukan sertifikasi PCI-DSS. Walaupun demikian, untuk aplikasi kecil, yang dijalankan oleh perusahaan yang tidak memiliki personel IT operation yang memadai, agak sulit untuk mengelola instalasi Vault server.

Oleh karena itu, pada artikel ini, kita akan membahas metode enkripsi data yang lebih mudah dikelola di production. Akan tetapi, perlu saya tekankan sebelumnya bahwa keamanan enkripsi terutama terletak pada kerahasiaan kunci enkripsi. Dengan Vault, kunci enkripsi disimpan dengan aman. Dengan metode ini, kunci enkripsi disimpan tertulis secara plaintext di server aplikasi. Walaupun kita set permission agar cuma bisa diakses oleh user `root`, tetap ini adalah resiko security yang besar. Anyway, setidaknya data sensitif user aplikasi tidak tersimpan dalam format plain text.

Kita akan menggunakan algoritma AES untuk mengenkripsi data dan file milik user. Konsep dasar dan contoh kode programnya sudah pernah kita bahas di [artikel terdahulu]({% post_url 2013-11-21-symmetric-encryption-dengan-java %}). Di artikel ini, kita akan mengaplikasikan artikel tersebut ke dalam aplikasi Spring Boot.

<!--more-->

Karena sebelumnya kita sudah menggunakan [Strategy Pattern](https://www.youtube.com/watch?v=Ncf0BZKwbHY&list=PL9oC_cq7OYbyxsdDPDSpuURfWRTFQSXDl&index=13) untuk memilih strategi penyimpanan data, yaitu Plain dan Vault, maka sekarang kita tinggal membuat satu implementasi lagi, yaitu menggunakan algoritma AES.

Ada dua data yang kita gunakan sebagai contoh di sini:

* data NIK (Nomor KTP) yang akan kita simpan di tabel database
* scan KTP yang akan kita simpan berupa file dalam folder di server

Dua bentuk data ini mewakili mayoritas aplikasi bisnis yang biasa kita buat. Ada data yang disimpan berupa kolom di database, dan ada data yang disimpan berupa file. Kita akan mengenkripsi kedua data ini pada waktu disimpan, kemudian melakukan dekripsi pada waktu data tersebut akan ditampilkan di aplikasi. Selain melalui aplikasi kita, data ini tidak bisa langsung dibaca di lokasi penyimpanannya.

Berikut adalah `interface` yang mendefinisikan fitur penyimpanan data di aplikasi

```java
public interface MemberInputService {
    void save(Member member, MultipartFile fileKtp);
    byte[] getFileKtp(Member member);
    Iterable<Member> findAllMembers();
}
```

Bila kita simpan secara apa adanya tanpa enkripsi, implementasinya sebagai berikut

```java
@Profile("default")
@Service @Slf4j
public class PlainMemberService implements MemberInputService {

    @Value("${file.upload.folder}")
    private String fileUploadFolder;

    @Autowired private MemberDao memberDao;

    private MimetypesFileTypeMap fileTypeMap = new MimetypesFileTypeMap();;

    @Override
    public void save(Member member, MultipartFile fileKtp) {
        try {
            Files.createDirectories(Paths.get(fileUploadFolder));
            member.setFileKtpMimeType(fileTypeMap.getContentType(fileKtp.getOriginalFilename()));
            memberDao.save(member);
            String destinationFilename = fileUploadFolder + File.separator + member.getId();
            log.info("Upload file to {}", destinationFilename);
            fileKtp.transferTo(new File(destinationFilename));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
    }

    @Override
    public byte[] getFileKtp(Member member) {
        try {
            String filename = fileUploadFolder + File.separator + member.getId();
            return FileUtils.readFileToByteArray(new File(filename));
        } catch (IOException e) {
            log.error(e.getMessage(), e);
        }
        return new byte[0];
    }

    @Override
    public Iterable<Member> findAllMembers(){
        List<Member> memberList = new ArrayList<>();
        memberDao.findAll()
                .forEach(member -> {
                    member.setNoKtpPlain(member.getNoKtp());
                    memberList.add(member);
                });
        return memberList;
    }
}
```

Pada kode program di atas, kita menulis datanya langsung ke database dan ke folder penyimpanan tanpa enkripsi. Kita bisa langsung melakukan query ke database, atau membuka File Explorer, dan melihat nomor NIK dan scan KTP secara langsung.

Untuk melakukan enkripsi, kita akan membuat satu class helper untuk melakukan fungsi enkripsi. Mayoritas kode program di class ini diambil dari [artikel Symmetric Encryption dengan Java]({% post_url 2013-11-21-symmetric-encryption-dengan-java %}).

```java
@Component
public class CryptoHelper {
    private static final String ALGORITHM_KEY = "AES";
    private static final String ALGORITHM_ENCRYPTION = "AES/GCM/NoPadding";
    private static final int TAG_LENGTH_BIT = 128;
    private static final int IV_LENGTH_BYTE = 12;
    private static final int AES_KEY_LENGTH = 256;

    @Value("${aes.encryption.key}")
    private String aesKeyString;
    private SecretKey secretKey;

    public static String generateKey() throws NoSuchAlgorithmException {
        KeyGenerator keygen = KeyGenerator.getInstance(ALGORITHM_KEY);
        keygen.init(AES_KEY_LENGTH);
        SecretKey key = keygen.generateKey();
        return Base64.getEncoder().encodeToString(key.getEncoded());
    }
    
    @PostConstruct
    public void initialize(){
        secretKey = new SecretKeySpec(Base64.getDecoder().decode(aesKeyString), ALGORITHM_KEY);
    }
    
    public byte[] encrypt(byte[] plainContent) throws InvalidKeyException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException {
        byte[] iv = generateIV();
        
        Cipher cipher = Cipher.getInstance(ALGORITHM_ENCRYPTION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(TAG_LENGTH_BIT, iv));
        byte[] cipherText = cipher.doFinal(plainContent);
        return ByteBuffer.allocate(iv.length + cipherText.length)
                .put(iv)
                .put(cipherText)
                .array();
    }

    public byte[] decrypt(byte[] encryptedContent) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException{
        ByteBuffer bb = ByteBuffer.wrap(encryptedContent);
        byte[] iv = new byte[IV_LENGTH_BYTE];
        bb.get(iv);

        Cipher cipher = Cipher.getInstance(ALGORITHM_ENCRYPTION);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(TAG_LENGTH_BIT, iv));

        byte[] cipherText = new byte[bb.remaining()];
        bb.get(cipherText);
        return cipher.doFinal(cipherText);
    }

    private byte[] generateIV(){
        byte[] nonce = new byte[IV_LENGTH_BYTE];
        new SecureRandom().nextBytes(nonce);
        return nonce;
    }
}
```

Jangan lupa menambahkan encryption key di konfigurasi. Kita bisa meletakkannya di `application.properties` atau dipasang sebagai environment variable di sistem operasi. Berikut konfigurasinya bila kita taruh di `application.properties`

```
aes.encryption.key=lwSqNtjsMWZfKxRLU6yi08l71TL7G5Ksii1rOoraL7M=
```

Bila ingin dipasang sebagai environment variable, biasanya kita pasang di konfigurasi `systemd`, seperti ini

```
[Unit]
Description=Aplikasi KTP
After=syslog.target

[Service]
User=aplikasi
Environment=SPRING_PROFILES_ACTIVE=aeslocal
Environment=AES_ENCRYPTION_KEY=lwSqNtjsMWZfKxRLU6yi08l71TL7G5Ksii1rOoraL7M=
ExecStart=/var/lib/belajar-enkripsi-data/belajar-enkripsi-data.jar
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

Selanjutnya, kita tinggal mengimplementasikan interface `MemberInputService` sebagai berikut

```java
@Profile("aeslocal")
@Service @Slf4j
public class EncryptedLocalFileMemberService implements MemberInputService {

    @Value("${file.upload.folder}")
    private String fileUploadFolder;

    @Autowired private CryptoHelper cryptoHelper;
    @Autowired private MemberDao memberDao;

    private MimetypesFileTypeMap fileTypeMap = new MimetypesFileTypeMap();

    @Override
    public void save(Member member, MultipartFile fileKtp) {
        try {
            member.setFileKtpMimeType(fileTypeMap.getContentType(fileKtp.getOriginalFilename()));
            member.setNoKtp(Base64.getEncoder().encodeToString(
                cryptoHelper.encrypt(member.getNoKtp().getBytes())));
            memberDao.save(member);

            Path destination = Paths.get(fileUploadFolder, member.getId());
            log.debug("Storing {} at {}", member.getId(), destination.toAbsolutePath());
            Files.createDirectories(Paths.get(fileUploadFolder));
            Files.write(destination, cryptoHelper.encrypt(fileKtp.getBytes()));
        } catch (IOException | InvalidKeyException | InvalidAlgorithmParameterException | NoSuchAlgorithmException | NoSuchPaddingException | IllegalBlockSizeException | BadPaddingException err) {
            log.error(err.getMessage(), err);
        }
    }

    @Override
    public byte[] getFileKtp(Member member) {
        try {
            String filename = fileUploadFolder + File.separator + member.getId();
            return cryptoHelper.decrypt(FileUtils.readFileToByteArray(new File(filename)));
        } catch (IOException | InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException | InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
            log.error(e.getMessage(), e);
        }
        return new byte[0];
    }

    @Override
    public Iterable<Member> findAllMembers() {
        List<Member> memberList = new ArrayList<>();
        memberDao.findAll()
                .forEach(member -> {
                    try {
                        member.setNoKtpPlain(new String(
                            cryptoHelper.decrypt(
                                Base64.getDecoder().decode(member.getNoKtp()))));
                    } catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException
                            | InvalidAlgorithmParameterException | IllegalBlockSizeException | BadPaddingException e) {
                        log.debug(e.getMessage(),e);
                    }
                    memberList.add(member);
                });
        return memberList;
    }
    
}
```

Kalau diperhatikan, perbedaannya dengan yang versi plaintext cuma sedikit. Contohnya, pada waktu menyimpan data, berikut kode program tanpa enkripsi

```java
memberDao.save(member);
String destinationFilename = fileUploadFolder + File.separator + member.getId();
fileKtp.transferTo(new File(destinationFilename));
```

Versi enkripsinya sebagai berikut

```java
member.setNoKtp(Base64.getEncoder().encodeToString(
    cryptoHelper.encrypt(member.getNoKtp().getBytes())));
memberDao.save(member);

Path destination = Paths.get(fileUploadFolder, member.getId());
Files.write(destination, cryptoHelper.encrypt(fileKtp.getBytes()));
```

Pengambilan file tanpa enkripsi, sebagai berikut

```java
String filename = fileUploadFolder + File.separator + member.getId();
return FileUtils.readFileToByteArray(new File(filename));
```

Berikut pengambilan file yang terenkripsi

```java
String filename = fileUploadFolder + File.separator + member.getId();
return cryptoHelper.decrypt(FileUtils.readFileToByteArray(new File(filename)));
```

Untuk membaca data dari database, tanpa enkripsi bisa langsung diambil

```java
List<Member> memberList = new ArrayList<>();
memberDao.findAll()
        .forEach(member -> {
            member.setNoKtpPlain(member.getNoKtp());
            memberList.add(member);
        });
return memberList;
```

Kalau datanya terenkripsi, maka kita dekripsi dulu

```java
List<Member> memberList = new ArrayList<>();
memberDao.findAll()
        .forEach(member -> {
            member.setNoKtpPlain(new String(
                cryptoHelper.decrypt(
                    Base64.getDecoder().decode(member.getNoKtp()))));
            memberList.add(member);
        });
return memberList;
```

Kalau kita lihat isi database, berikut isinya bila kita tidak lakukan enkripsi

[![Isi database tanpa enkripsi]({{site.url}}/images/uploads/2022/01-query-tanpa-enkripsi.png)]({{site.url}}/images/uploads/2022/01-query-tanpa-enkripsi.png)

Dan ini hasil querynya bila nomor KTP kita enkripsi

[![Isi database dengan enkripsi]({{site.url}}/images/uploads/2022/02-query-database-dengan-enkripsi.png)]({{site.url}}/images/uploads/2022/02-query-database-dengan-enkripsi.png)

Sedangkan untuk file yang diupload, tanpa enkripsi kita bisa langsung buka di file explorer

[![File upload tanpa enkripsi]({{site.url}}/images/uploads/2022/03-file-upload-tanpa-enkripsi.png)]({{site.url}}/images/uploads/2022/03-file-upload-tanpa-enkripsi.png)

Tapi kalau dienkripsi, tidak bisa dilihat langsung tanpa melalui aplikasi

[![File upload dengan enkripsi]({{site.url}}/images/uploads/2022/04-file-upload-dengan-enkripsi.png)]({{site.url}}/images/uploads/2022/04-file-upload-dengan-enkripsi.png)

Lewat aplikasi, kita bisa lihat datanya, baik nomor KTP maupun file yang diupload

[![Tampilan Aplikasi]({{site.url}}/images/uploads/2022/05-tampilan-aplikasi.png)]({{site.url}}/images/uploads/2022/05-tampilan-aplikasi.png)

Demikian cara mengamankan data user yang diamanahkan kepada kita. Namanya kena hack itu musibah, sudah takdir Allah. Tugas kita sebagai programmer, berusaha semampunya untuk mengamankan data.

Kode program lengkap bisa [diambil di Github](https://github.com/endymuhardin/belajar-enkripsi-data). Semoga bermanfaat