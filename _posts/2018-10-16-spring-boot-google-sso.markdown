---
layout: post
title: "Implementasi Single Sign On dengan Google"
date: 2018-10-16 07:00
comments: true
categories:
- java
---

Jaman sekarang eranya integrasi antar aplikasi. Aplikasi A ingin mengakses data di Aplikasi B. Apalagi dengan mewabahnya arsitektur microservice, bahkan sesama aplikasi yang kita buat juga ingin berkomunikasi antar aplikasi.

Dengan sekian banyak aplikasi, tentunya akan sangat mengganggu user kalau dia harus login berkali-kali di tiap aplikasi tersebut. Untuk itu kita harus membuat semacam login server, di mana semua user akan login di sana dan semua aplikasi akan mengecek di sana apakah user tersebut sudah login atau belum.

Biasanya, hal ini kita menggunakan standar protokol OAuth 2.0 dan atau OpenID Connect. Lebih detail tentang protokol ini bisa ditonton [di video saya di Youtube](https://www.youtube.com/playlist?list=PL9oC_cq7OYbyXj9NPqM2iedlHQMeChGJp).

Dalam Spring Security 4 dan Spring Boot 1, kita mendapatkan fitur untuk membuat `Authorization Server`, `Resource Server`, dan `Client Application`. Akan tetapi, di Spring Security 5, mereka berencana untuk melakukan perombakan besar-besaran. Di Spring Security versi 5.0, para pengembang Spring sudah menyediakan dukungan `Client Application` yang baru. Ini sudah masuk dalam Spring Boot 2.0.

Dukungan terhadap `Resource Server` yang baru direncanakan akan launching di Spring Security versi 5.1 dan dibundel dalam Spring Boot 2.1. Pada saat artikel ini ditulis, Spring Security 5.1 dan Spring Boot 2.1 belum dirilis.

Pada artikel kali ini, kita akan mengimplementasikan `Client Application` (atau `Relying Party` dalam istilah OpenID Connect) dengan fitur login dengan Google. Kita juga akan membuat tabel di aplikasi kita yang memuat setting permission. Kita akan mapping username dari Google dengan permission yang kita kelola di aplikasi kita sendiri.

<!--more-->

## Registrasi Aplikasi ke Google ##

Agar aplikasi kita bisa ikut login ke Google, kita harus mendaftar dulu dengan cara membuat project di [Google Developer Console](https://console.developers.google.com/).

[![Create Project]({{site.url}}/images/uploads/2018/google-sso/01-create-client-app-project.png)]({{site.url}}/images/uploads/2018/google-sso/01-create-client-app-project.png)

Kemudian masuk ke tab `Credential`

[![Tab Credential]({{site.url}}/images/uploads/2018/google-sso/02-tab-credentials.png)]({{site.url}}/images/uploads/2018/google-sso/02-tab-credentials.png)

Kita membuat credential untuk mendapatkan `client-id` dan `client-secret`

[![Create Credential]({{site.url}}/images/uploads/2018/google-sso/03-create-oauth-clientid.png)]({{site.url}}/images/uploads/2018/google-sso/03-create-oauth-clientid.png)

Setelah login, Google akan menampilkan consent screen untuk menanyakan apakah user mengijinkan aplikasi kita untuk mengakses data pribadi kita di google.

[![Konfigurasi Consent Screen]({{site.url}}/images/uploads/2018/google-sso/04-configure-consent-screen.png)]({{site.url}}/images/uploads/2018/google-sso/04-configure-consent-screen.png)

Kita harus mengisi nama aplikasi dan scope informasi yang ingin kita dapatkan dari Google. Biasanya untuk proses OpenID Connect, kita butuh scope `email`, `profile`, dan `openid`.

[![Form Consent Screen 1]({{site.url}}/images/uploads/2018/google-sso/05-consent-screen-form-1.png)]({{site.url}}/images/uploads/2018/google-sso/05-consent-screen-form-1.png)

Kita juga harus mengisi callback URL. Google akan melakukan redirect ke URL ini setelah user memberikan consent.

[![Form Consent Screen 2]({{site.url}}/images/uploads/2018/google-sso/06-consent-screen-form-2.png)]({{site.url}}/images/uploads/2018/google-sso/06-consent-screen-form-2.png)

Setelah kita isi semua, kita akan mendapatkan `client-id` dan `client-secret`. Copy nilainya, kita akan menggunakannya di langkah berikutnya.

[![Client ID dan Secret]({{site.url}}/images/uploads/2018/google-sso/07-client-id-secret.png)]({{site.url}}/images/uploads/2018/google-sso/07-client-id-secret.png)

## Fitur Aplikasi ##

Kita akan membuat aplikasi internet banking versi dummy. Fiturnya terdiri dari:

* Dashboard / Home Page
* Lihat Rekening
* Lihat Mutasi
* Transfer

Untuk menyederhanakan kode program, agar bisa fokus ke login dan ijin akses, kita hanya akan membuatkan halaman HTML kosong untuk masing-masing fitur.

Tampilannya kira-kira seperti ini

[![Tampilan Aplikasi]({{site.url}}/images/uploads/2018/google-sso/00-create-client-app-project.png)]({{site.url}}/images/uploads/2018/google-sso/00-create-client-app-project.png)

Yang diimplementasikan dengan Spring Controller berikut

```java
@Controller
@RequestMapping("/")
public class HomeController {

    @GetMapping("home")
    public void home(){}

    @PreAuthorize("hasAuthority('VIEW_REKENING')")
    @GetMapping("rekening")
    public void daftarRekening(){}

    @PreAuthorize("hasAuthority('VIEW_MUTASI')")
    @GetMapping("mutasi")
    public void mutasiRekening(){}

    @PreAuthorize("hasAuthority('EDIT_TRANSFER')")
    @GetMapping("transfer")
    public void transfer(){}

}
```

dan screen HTML berikut

```html
<!DOCTYPE html>
<html lang="en" layout:decorate="~{layout.html}">
<head>
    <meta charset="UTF-8">
    <title>Transfer Uang</title>
</head>
<body>
    <section layout:fragment="content">
        <h2>Transfer Uang</h2>
    </section>
</body>
</html>
```

dengan layout berikut

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aplikasi Internet Banking</title>
</head>
<body>
    <h1>Aplikasi Internet Banking</h1>
    <div class="rightnav">
        Welcome, <span th:text="${#authentication.principal.fullName}">current user</span>
        <form method="post" th:action="@{/logout}">
            <input type="submit" value="Logout">
        </form>
    </div>
    <ul class="nav">
        <li>
            <a th:href="@{/home}">Home</a>
        </li>
        <li>
            <a th:href="@{/rekening}" sec:authorize="hasAuthority('VIEW_REKENING')">Daftar Rekening</a>
        </li>
        <li>
            <a th:href="@{/mutasi}" sec:authorize="hasAuthority('VIEW_MUTASI')">Mutasi Rekening</a>
        </li>
        <li>
            <a th:href="@{/transfer}" sec:authorize="hasAuthority('EDIT_TRANSFER')">Transfer</a>
        </li>
    </ul>
    <hr />
    <div>
        Authorities :
        <ul>
            <li th:each="authority : ${#authentication.authorities}" th:text="${authority}">View Rekening</li>
        </ul>
    </div>

    <hr />

    <section layout:fragment="content">
        <p>Page content goes here</p>
    </section>
</body>
</html>
```

Pada template di atas, kita menggunakan [Spring Security Thymeleaf Dialect](https://github.com/thymeleaf/thymeleaf-extras-springsecurity) sehingga kita bisa dengan mudah __show/hide__ link atau elemen HTML dengan tag `sec:authorize` seperti ini `<a th:href="@{/rekening}" sec:authorize="hasAuthority('VIEW_REKENING')">Daftar Rekening</a>`

## Skema Database ##

Di aplikasi kita, seperti bisa dilihat pada template dan controller, kita menggunakan beberapa permission/authority sebagai berikut:

* VIEW_REKENING
* VIEW_MUTASI
* EDIT_TRANSFER

Permission tersebut kita simpan di database aplikasi kita dengan skema seperti ini

```sql
CREATE TABLE s_permission (
  id               VARCHAR(255) NOT NULL,
  permission_label VARCHAR(255) NOT NULL,
  permission_value VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (permission_value)
);

CREATE TABLE s_role (
  id          VARCHAR(255) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  name        VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (name)
);

CREATE TABLE s_role_permission (
  id_role       VARCHAR(255) NOT NULL,
  id_permission VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_role, id_permission),
  FOREIGN KEY (id_permission) REFERENCES s_permission (id),
  FOREIGN KEY (id_role) REFERENCES s_role (id)
);

create table s_user (
  id varchar (36),
  username varchar (100) not null,
  id_role varchar (36) not null,
  primary key (id),
  foreign key (id_role) references s_role(id),
  unique (username)
);
```

Kemudian kita isi datanya sebagai berikut

```sql
INSERT INTO s_permission (id, permission_value, permission_label) VALUES
  ('viewrekening', 'VIEW_REKENING', 'Lihat Data Rekening'),
  ('viewmutasi', 'VIEW_MUTASI', 'Lihat Data Mutasi'),
  ('edittransfer', 'EDIT_TRANSFER', 'Input Transfer');

INSERT INTO s_role (id, description, name) VALUES
  ('staff', 'STAFF', 'Staff'),
  ('manager', 'MANAGER', 'Manager');

INSERT INTO s_role_permission (id_role, id_permission) VALUES
  ('staff', 'viewrekening'),
  ('staff', 'viewmutasi'),
  ('manager', 'viewrekening'),
  ('manager', 'viewmutasi'),
  ('manager', 'edittransfer');

INSERT INTO s_user (id, username, id_role) VALUES
  ('u001', 'endy@artivisi.com', 'staff');

INSERT INTO s_user (id, username, id_role) VALUES
  ('u002', 'endy.muhardin@gmail.com', 'manager');
```

Seperti kita lihat pada skema dan data di atas, kita tidak menyimpan data password user. Ini karena pemeriksaan password akan kita delegasikan ke Google sebagai OpenID Connect Provider.

## Entity Class dan DAO ##

Skema database di atas kita buatkan entity classnya agar lebih mudah di-query dengan JPA.

* Class User

```java
@Entity @Table(name = "s_user") @Data
public class User {
    @Id
    private String id;
    private String username;
    @ManyToOne @JoinColumn(name = "id_role")
    private Role role;
}
```

* Class Role

```java
@Entity @Table(name = "s_role") @Data
public class Role {
    @Id
    private String id;
    private String name;
    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "s_role_permission",
            joinColumns = @JoinColumn(name = "id_role"),
            inverseJoinColumns = @JoinColumn(name = "id_permission")
    )
    private Set<Permission> permissions = new HashSet<>();
}
```

* Class Permission

```java
@Entity @Table(name = "s_permission") @Data
public class Permission {
    @Id
    private String id;
    @Column(name = "permission_label")
    private String label;
    @Column(name = "permission_value")
    private String value;
}
```

Kita cuma butuh satu DAO saja untuk kebutuhan login dan ijin akses ini, yaitu `UserDao` sebagai berikut

```java
public interface UserDao extends PagingAndSortingRepository<User, String> {
    User findByUsername(String username);
}
```

## Dependensi Maven ##

Untuk mengaktifkan single-sign on dengan Google ini, kita harus menambahkan dua dependensi berikut

```xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
```

Selain itu adalah dependensi Spring Boot biasa

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
<dependency>
    <groupId>nz.net.ultraq.thymeleaf</groupId>
    <artifactId>thymeleaf-layout-dialect</artifactId>
</dependency>
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
    <version>3.0.3.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Dan beberapa dependensi untuk urusan database

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
```

## Konfigurasi Client Application ##

Berikutnya, kita buatkan konfigurasi security untuk aplikasi kita. Sebetulnya, cukup dengan memasang `client-id` dan `client-secret` dan mengikutkan dependensi `spring-security-oauth2-client` dan `spring-security-oauth2-jose` saja kita sudah bisa login dengan Google. Konfigurasinya di `application.properties` sebagai berikut

```
spring.security.oauth2.client.registration.google.client-id=266648357609-p7agra2jcbbo360bl95lrg3pu3vsubdo.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=wA4blZ_SU71yeRjAXKxIBKBe
```

Akan tetapi, karena kita ingin menggunakan permission dari tabel database, maka kita harus menambahkan konfigurasi lagi.

```java
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class KonfigurasiSecurity extends WebSecurityConfigurerAdapter {

    @Autowired private UserDao userDao;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest().authenticated()
                .and().logout().permitAll()
                .and().oauth2Login()
                .userInfoEndpoint()
                .userAuthoritiesMapper(authoritiesMapper())
                .and().defaultSuccessUrl("/home", true);
    }

    private GrantedAuthoritiesMapper authoritiesMapper(){
        return (authorities) -> {
            String emailAttrName = "email";
            String email = authorities.stream()
                    .filter(OAuth2UserAuthority.class::isInstance)
                    .map(OAuth2UserAuthority.class::cast)
                    .filter(userAuthority -> userAuthority.getAttributes().containsKey(emailAttrName))
                    .map(userAuthority -> userAuthority.getAttributes().get(emailAttrName).toString())
                    .findFirst()
                    .orElse(null);

            if (email == null) {
                return authorities;     // data email tidak ada di userInfo dari Google
            }

            User user = userDao.findByUsername(email);
            if(user == null) {
                return authorities;     // email user ini belum terdaftar di database
            }

            Set<Permission> userAuthorities = user.getRole().getPermissions();
            if (userAuthorities.isEmpty()) {
                return authorities;     // authorities defaultnya ROLE_USER
            }

            return Stream.concat(
                        authorities.stream(),
                        userAuthorities.stream()
                            .map(Permission::getValue)
                            .map(SimpleGrantedAuthority::new)
                    ).collect(Collectors.toCollection(ArrayList::new));
        };
    }

    @Bean
    public SpringSecurityDialect springSecurityDialect() {
        return new SpringSecurityDialect();
    }
}
```

Mapping untuk permission dari database dengan username dari google diaktifkan dengan baris berikut `oauth2Login().userInfoEndpoint().userAuthoritiesMapper(authoritiesMapper())`. Tanpa baris tersebut, user yang login dengan Google akan mendapatkan authority default yaitu `ROLE_USER`. Kita ingin menambahkan permission bagi user sesuai isi tabel relasi `user-role-permission`.

## Test Aplikasi ##

Untuk menjalankan aplikasi, masuk ke foldernya, kemudian jalankan aplikasinya

        mvn clean spring-boot:run

Browse ke `http://localhost:8080`, kita akan mendapati link login yang otomatis dibuatkan oleh Spring Boot + Security.

[![Login Screen Aplikasi]({{site.url}}/images/uploads/2018/google-sso/09-login-page-aplikasi.png)]({{site.url}}/images/uploads/2018/google-sso/09-login-page-aplikasi.png)

Klik link Google. Bila kita belum login ke layanan Google (Gmail, Youtube, dsb) maka kita akan dimintai login.

[![Login Screen Google]({{site.url}}/images/uploads/2018/google-sso/10-login-page-google.png)]({{site.url}}/images/uploads/2018/google-sso/10-login-page-google.png)

Tapi bila kita sudah login, apalagi pakai beberapa akun, maka kita akan disajikan pilihan mau pakai akun yang mana.

[![Pilihan Google Account]({{site.url}}/images/uploads/2018/google-sso/11-consent-screen.png)]({{site.url}}/images/uploads/2018/google-sso/11-consent-screen.png)

Setelah kita login, maka aplikasi akan melakukan flow OAuth `authorization-code`, kemudian akan mendapatkan `email` user yang berhasil login dari Google. Kemudian aplikasi akan melakukan mapping dari nilai `email` tersebut menjadi daftar `String` berisi `permisson` untuk user yang memiliki email tersebut. Selanjutnya, daftar permission akan diaplikasikan sesuai dengan tampilan screen dan ijin akses ke url tertentu.

Selamat mencoba, semoga bermanfaat. Source code lengkap ada [di Github](https://github.com/endymuhardin/belajar-google-sso)