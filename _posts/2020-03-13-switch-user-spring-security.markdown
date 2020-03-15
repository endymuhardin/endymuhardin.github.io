---
layout: post
title: "Switch User dengan Spring Security"
date: 2020-03-15 17:00
comments: true
categories:
- java
---

Alhamdulillah, aplikasi kita sudah naik production, dan digunakan oleh banyak user. Aplikasi sudah kita rancang dengan baik, sehingga data yang tampil di aplikasi sesuai dengan user yang sedang login. 

Masalah timbul ketika ada pertanyaan atau laporan dari user dalam penggunaan aplikasi. Sebagai administrator, kita tidak tahu data apa yang sedang tampil di layar user, karena aplikasi hanya bisa menampilkan data user yang sedang login. Apabila kita login dengan akun administrator, kita tidak bisa melihat apa yang dilihat user, sehingga kita sulit untuk mendebug aplikasi.

Biasanya, orang-orang mengatasi isu ini dengan meminta password user. Programmer/administrator kemudian mencoba aplikasi dengan cara login sebagai user. Praktek seperti ini sangat tidak dianjurkan. Pertama karena programmer/administrator menjadi tahu password user. Mayoritas user di dunia, menggunakan password yang sama di berbagai aplikasi, sehingga password yang diberikan ke programmer/administrator ini ada kemungkinan bisa dipakai di akunnya yang lain (internet banking, online shop, dan sebagainya). Kedua, karena ini belum tentu bisa digunakan pada sistem single sign on, seperti yang kita sudah pernah buat [di artikel terdahulu](https://software.endy.muhardin.com/java/spring-boot-google-sso/).

Solusinya, kita harus buatkan di aplikasi kita fitur untuk administrator supaya dia bisa pindah menjadi user lain. Dengan demikian, dia bisa melihat apa yang dilihat user lain tersebut. Tentunya fitur ini harus dijaga dengan baik, jangan sampai disalahgunakan oleh administrator. Caranya bisa dengan mengimplementasikan audit log untuk mencatat aktifitas administrator selama pindah menjadi user lain.

Nah, demikian konsepnya secara garis besar, sekarang mari kita langsung ke kode program.

<!--more-->

* TOC
{:toc}

## Studi Kasus ##

Seperti biasanya, untuk memudahkan kita belajar pemrograman, kita karang studi kasus yang membutuhkan fitur yang ingin kita pelajari. Studi kasus kita kali ini adalah aplikasi yang menampilkan riwayat transaksi di rekening pengguna. Pengguna bisa login, kemudian melihat history transaksi yang dia lakukan. Agar tidak terlalu rumit, kita tidak membuat fitur input transaksi. Datanya langsung saja kita sediakan dari database.

Kita juga membuat audit log untuk merekam kegiatan administrator selama dia menggunakan user orang lain, agar ada akuntabilitas terhadap tindakan dia.

## Skema Database ##

Berikut adalah skema database untuk aplikasi ini.

```sql
create table s_role (
    id   varchar(36),
    nama varchar(100) not null,
    primary key (id),
    unique (nama)
);

create table pengguna (
    id              varchar(36),
    id_role         varchar(36)  not null,
    username        varchar(100) not null,
    hashed_password varchar(255) not null,
    nama            varchar(255) not null,
    primary key (id),
    unique (username),
    foreign key (id_role) references s_role (id)
);

create table transaksi (
    id              varchar(36),
    id_pengguna     varchar(36)    not null,
    waktu_transaksi datetime       not null,
    keterangan      varchar(255)   not null,
    nilai           decimal(19, 2) not null,
    primary key (id),
    foreign key (id_pengguna) references pengguna (id)
);

create table audit_log (
    id                  varchar(36),
    id_pengguna_asli    varchar(36)  not null,
    id_pengguna_dipakai varchar(36)  not null,
    waktu_kegiatan      datetime     not null,
    keterangan          varchar(255) not null,
    primary key (id),
    foreign key (id_pengguna_asli) references pengguna (id),
    foreign key (id_pengguna_dipakai) references pengguna (id)
);

```

Berikut adalah sampel data untuk mengisi tabel-tabel di atas.

```sql
insert into s_role (id, nama) values ('admin', 'Administrator');
insert into s_role (id, nama) values ('pengguna', 'Pengguna');

-- password : admin123
insert into pengguna (id, id_role, username, hashed_password, nama)
values ('adminuser', 'admin', 'admin', '$2a$13$i2JE6bqZ1YghFX2RZHUE0O0H4bYeiB.h4zsgiaJ8tg.ejHtdPJ5XW', 'Administrator');

-- password : user00
insert into pengguna (id, id_role, username, hashed_password, nama)
values ('u001', 'pengguna', 'user001', '$2a$13$UHzktQVUWnzI46FqJBMVgunMPKWaxsvuKdHw5LWWsczDCvf.CtoQu', 'User 001');

-- password : user00
insert into pengguna (id, id_role, username, hashed_password, nama)
values ('u002', 'pengguna', 'user002', '$2a$13$UHzktQVUWnzI46FqJBMVgunMPKWaxsvuKdHw5LWWsczDCvf.CtoQu', 'User 002');

-- password : user00
insert into pengguna (id, id_role, username, hashed_password, nama)
values ('u003', 'pengguna', 'user003', '$2a$13$UHzktQVUWnzI46FqJBMVgunMPKWaxsvuKdHw5LWWsczDCvf.CtoQu', 'User 003');
```

Sedangkan untuk transaksinya, kita akan input secara random menggunakan library faker.

## Starter Project Spring ##

Project baru kita buat menggunakan [Spring Initialzr](https://start.spring.io) dengan mengaktifkan modul-modul berikut:

* Spring Web
* Spring Security
* Thymeleaf
* Lombok
* Spring Data JPA
* Flyway Migration
* H2 Database

Atau bisa langsung digenerate dengan [klik link ini](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.2.5.RELEASE&packaging=jar&jvmVersion=1.8&groupId=com.muhardin.endy.belajar.switchuser&artifactId=belajar-switchuser&name=belajar-switchuser&description=Demo%20project%20for%20Spring%20Boot&packageName=com.muhardin.endy.belajar.switchuser.belajar-switchuser&dependencies=web,thymeleaf,lombok,data-jpa,flyway,h2)

Nantinya sepanjang perjalanan, kita akan menambahkan beberapa library tambahan untuk memudahkan hidup kita, yaitu:

* [Thymeleaf Layout Dialect](https://ultraq.github.io/thymeleaf-layout-dialect/)
* [Thymeleaf Spring Security Dialect](https://github.com/thymeleaf/thymeleaf-extras-springsecurity)
* [Java Faker](https://github.com/DiUS/java-faker)

## Menampilkan Daftar Transaksi ##

Ini adalah satu-satunya fitur di aplikasi kita. Berikut adalah controller untuk menampilkannya.

```java
@Controller
public class TransaksiController {

    @Autowired
    private TransaksiDao transaksiDao;

    @Autowired private PenggunaDao penggunaDao;

    @GetMapping("/transaksi/list")
    public ModelMap daftarTransaksi(Authentication currentUser) {
        ModelMap mm = new ModelMap();

        penggunaDao.findByUsername(currentUser.getName())
                .ifPresent(p->{
                    mm.addAttribute(
                            "daftarTransaksi",
                            transaksiDao.findByPengguna(p));
                });

        return mm;
    }
}
```

Pada kode program di atas, kita lihat bahwa ada argumen method bertipe `Authentication`. Argumen ini akan diisi oleh Spring Boot pada waktu aplikasi dijalankan dengan object berisi data user yang sedang login. Kita gunakan method `getName` untuk mendapatkan usernamenya. Kemudian kita cari data `Pengguna` dari database berdasarkan username tersebut. Terakhir, kita lakukan query untuk mencari transaksi yang dimiliki pengguna tersebut.

Dan ini adalah template HTML untuk menampilkan data transaksi.

```html
<h1>Daftar Transaksi</h1>

<table class="table table-striped">
    <thead>
    <tr>
        <th>Waktu Transaksi</th>
        <th>Pengguna</th>
        <th>Keterangan</th>
        <th>Nilai</th>
    </tr>
    </thead>
    <tbody>
    <tr th:each="t : ${daftarTransaksi}">
        <td th:text="${t.waktuTransaksi}">12-Mar-2020 20:20:11</td>
        <td th:text="${t.pengguna.nama}">Pengguna 1</td>
        <td th:text="${t.keterangan}">Setoran Tunai</td>
        <td th:text="${t.nilai}">100.000</td>
    </tr>
    </tbody>
</table>
```

Tidak ada yang istimewa di sini, hanya query dari database, kemudian render di HTML.

## Header Aplikasi ##

Ada beberapa hal yang kita pasang di header aplikasi, yaitu:

* Link ke halaman Daftar Transaksi
* Tulisan nama user yang sedang login
* Tombol Logout
* Link ke halaman untuk Ganti User. Link ini hanya boleh terlihat oleh admin
* Link untuk menampilkan Audit Log. Ini juga hanya boleh dilihat admin
* Link untuk kembali menjadi admin. Link ini hanya tampil ketika admin berubah user

Kode HTMLnya seperti ini

```html
<nav class="my-2 my-md-0 mr-md-3">
    <a class="p-2 text-dark" th:href="@{/transaksi/list}">Daftar Transaksi</a>
    &nbsp; | &nbsp;
    <a sec:authorize="hasAuthority('Administrator')"
        class="p-2 text-dark" th:href="@{/switchuser/select}">Ganti User</a>
    &nbsp; | &nbsp;
    <a sec:authorize="hasAuthority('Administrator')"
        class="p-2 text-dark" th:href="@{/switchuser/auditlog}">Audit Log</a>
    &nbsp; | &nbsp;
    <a sec:authorize="hasRole('ROLE_PREVIOUS_ADMINISTRATOR')"
        class="p-2 text-dark" th:href="@{/switchuser/exit}">Kembali ke Admin</a>
</nav>
| &nbsp; Hello, <span th:text="${#authentication.name}">current user</span>
&nbsp; &nbsp; &nbsp;
<form th:action="@{/logout}" method="post">
    <input type="submit" class="btn btn-outline-primary" value="Logout" />
</form>
```

Kita menggunakan atribut `sec:authorize` dan variabel `${#authentication.name}`. Ini disediakan oleh library Thymeleaf Spring Security Dialect.

## Konfigurasi Security ##

Berikut adalah konfigurasi security kita. Data user dan permission/authority kita simpan di database. Oleh karena itu, kita mengkonfigurasikan query untuk login dan menentukan permission seperti ini

```java
@Configuration @EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class KonfigurasiSecurity extends WebSecurityConfigurerAdapter {
    @Autowired
    private DataSource dataSource;

    private static final String SQL_LOGIN
            = "select p.username, p.hashed_password as password, true as enabled " +
            "from pengguna p where p.username = ?";

    private static final String SQL_ROLE
            = "select p.username, r.nama as authority from s_role r " +
            "inner join pengguna p on p.id_role = r.id "
            + "where p.username = ?";

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(13);
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .jdbcAuthentication()
                .dataSource(dataSource)
                .usersByUsernameQuery(SQL_LOGIN)
                .authoritiesByUsernameQuery(SQL_ROLE)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests(authorize -> authorize
            .anyRequest().authenticated()
        )
        .logout().permitAll()
        .and().formLogin()
        .defaultSuccessUrl("/transaksi/list", true);
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
                .antMatchers("/js/*")
                .antMatchers("/img/*")
                .antMatchers("/css/*");
    }
}
```

Konfigurasi tersebut belum mencakup tambahan konfigurasi untuk mengaktifkan switch user. Dengan konfigurasi di atas, aplikasi kita sudah bisa login dan melihat data transaksi untuk user yang sedang login.

## Mekanisme Switch User ##

Setelah kita sukses melakukan login, Spring Security akan menyimpan object `Authentication` dalam http session. Object ini berisi data user yang sedang login, diantaranya username dan daftar permission yang dia miliki. Pada waktu kita melakukan switch user, maka Spring Security akan mengganti object tersebut dengan object `Authentication` baru yang berisi data user yang ingin kita gantikan berikut permissionnya. 

Untuk memudahkan kita kembali ke user semula, maka data user yang asli akan dibungkus dalam object `Authentication` yang baru itu. Spring Security juga menambahkan authority dengan nama `ROLE_PREVIOUS_ADMINISTRATOR` untuk menandai bahwa object `Authentication` yang sedang ada dalam session merupakan hasil switch user.

Object yang asli, sebelum ditukar, bentuknya seperti ini

```
org.springframework.security.authentication.UsernamePasswordAuthenticationToken@f2c7bd42: Principal: org.springframework.security.core.userdetails.User@586034f: Username: admin; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: Administrator; Credentials: [PROTECTED]; Authenticated: true; Details: org.springframework.security.web.authentication.WebAuthenticationDetails@b364: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: BBECDE2D51218EB2F707B9F416A58A22; Granted Authorities: Administrator
```

Sedangkan setelah dilakukan switch user, bentuknya menjadi seperti ini

```
org.springframework.security.authentication.UsernamePasswordAuthenticationToken@f301ed8d: Principal: org.springframework.security.core.userdetails.User@f73a3687: Username: user002; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: Pengguna; Credentials: [PROTECTED]; Authenticated: true; Details: org.springframework.security.web.authentication.WebAuthenticationDetails@166c8: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: 5651E3798C6B9F49944B4605E50EFB18; Granted Authorities: Pengguna, Switch User Authority [ROLE_PREVIOUS_ADMINISTRATOR,org.springframework.security.authentication.UsernamePasswordAuthenticationToken@f2c7bd42: Principal: org.springframework.security.core.userdetails.User@586034f: Username: admin; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: Administrator; Credentials: [PROTECTED]; Authenticated: true; Details: org.springframework.security.web.authentication.WebAuthenticationDetails@b364: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: BBECDE2D51218EB2F707B9F416A58A22; Granted Authorities: Administrator]
```

Pertukaran ini dilakukan dengan cara melakukan request `GET` atau `POST` ke url yang kita tentukan dengan membawa parameter `username` yang berisi username yang ingin kita gantikan. Karena tidak ada pengecekan lebih lanjut, maka kita harus pastikan url ganti user ini harus kita amankan dengan ijin akses yang memadai. Pada artikel ini, url ganti user hanya boleh diakses oleh user dengan authority `Administrator`. 

URL ganti user kita konfigurasi menggunakan class `SwitchUserFilter` yang sudah disediakan oleh Spring Security.

## Konfigurasi Switch User Filter ##

Berikut adalah kode program untuk menginstankan `SwitchUserFilter`

```java
@Bean
public SwitchUserFilter switchUserFilter() throws Exception {
    SwitchUserFilter filter = new SwitchUserFilter();
    filter.setUserDetailsService(userDetailsService());
    filter.setSwitchUserUrl("/switchuser/form");
    filter.setExitUserUrl("/switchuser/exit");
    filter.setTargetUrl("/transaksi/list");
    return filter;
}
```

Ada beberapa hal yang kita konfigurasikan:

* `SwitchUserUrl` : adalah url yang akan dihit untuk mengganti user. URL ini menangkap method `GET` dan `POST`, jadi kita bisa pilih mana yang mau dipakai. Saya pribadi memilih menggunakan `GET`. Berikut form switch usernya

```html
<form method="post" th:action="@{/switchuser/form}" >
    <div class="form-group row">
        <label for="pengguna" class="col-sm-2 col-form-label">Pengguna</label>
        <div class="col-sm-10">
            <select class="form-control" id="pengguna" name="username">
                <option>Pilih Pengguna</option>
                <option th:each="p : ${daftarPengguna}"
                        th:text="${p.nama}"
                th:value="${p.username}">2</option>
            </select>
        </div>
    </div>
    <div class="form-group row">
        <div class="col-sm-10">
            <button type="submit" class="btn btn-primary">Switch User</button>
        </div>
    </div>
</form>
```

Perhatikan bahwa `action` di form HTML diarahkan ke properti `SwitchUserUrl` di `SwitchUserFilter` yang kita instankan sebelumnya.

Selain itu, pastikan juga bahwa nama request parameter yang dikirim pada waktu submit form namanya adalah `username`. Bisa dilihat pada komponen `select` di atas. Value yang dikirim diambil dari username yang dipasang di dropdown/combo pilihan pengguna.

Filter tersebut harus kita daftarkan supaya aktif. Urutannya ditaruh paling bawah. Kode programnya seperti ini

```java
.addFilterAfter(switchUserFilter(), FilterSecurityInterceptor.class)
```


Jangan lupa kita atur permission urlnya sehingga cuma bisa diakses oleh orang yang berhak. Kode programnya seperti ini

```java
.mvcMatchers("/switchuser/exit")
    .hasAuthority(SwitchUserFilter.ROLE_PREVIOUS_ADMINISTRATOR)
.mvcMatchers("/switchuser/select", "/switchuser/form")
    .hasAuthority("Administrator")
```

Ada tiga URL yang harus kita proteksi:

* URL untuk menampilkan form pilihan user yang ingin digantikan. URLnya adalah `/switchuser/select`, hanya bisa diakses `Administrator`
* URL untuk memproses penggantian user. Pada contoh kita, URLnya adalah `/switchuser/form`, hanya bisa diakses `Administrator`
* URL untuk kembali ke user asli. Pada contoh kita, urlnya adalah `/switchuser/exit`, hanya bisa diakses oleh yang sedang melakukan switch user.

Berikut satu method lengkap, supaya lebih mudah memahami di mana baris kodenya ditaruh.

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests(authorize -> authorize
        .mvcMatchers("/switchuser/exit")
            .hasAuthority(SwitchUserFilter.ROLE_PREVIOUS_ADMINISTRATOR)
        .mvcMatchers("/switchuser/select", "/switchuser/form")
            .hasAuthority("Administrator")
        .anyRequest().authenticated()
    )
    .addFilterAfter(switchUserFilter(), FilterSecurityInterceptor.class)
    .logout().permitAll()
    .and().formLogin()
    .defaultSuccessUrl("/transaksi/list", true);
}
```

## Pengetesan Switch User ##

Untuk mengetes apakah switch user sudah jalan atau belum, kita bisa jalankan aplikasi seperti biasa, menggunakan perintah `mvn spring-boot:run`. Setelah aplikasi aktif, kita akses ke [http://localhost:8080](http://localhost:8080).

Kita akan dihadapkan pada halaman login.

[![Screen Login]({{site.url}}/images/uploads/2020/switch-user/)]()

Ada beberapa login yang bisa dipilih:

* `admin` dengan password `admin123`
* `user001` dengan password `user00`
* `user002` dengan password `user00`
* `user003` dengan password `user00`

Setelah berhasil login, kita akan melihat screen `Daftar Transaksi` seperti ini

[![Screen Daftar Transaksi]({{site.url}}/images/uploads/2020/switch-user/01-login-screen.png)]({{site.url}}/images/uploads/2020/switch-user/01-login-screen.png)

Bila kita login dengan user `admin` maka kita akan melihat menu di kanan atas seperti ini

[![Menu Admin]({{site.url}}/images/uploads/2020/switch-user/02-menu-admin.png)]({{site.url}}/images/uploads/2020/switch-user/02-menu-admin.png)

Klik link `Ganti User` dan kita akan mendapati form pilihan user sebagai berikut

[![Screen Pilih Switch User]({{site.url}}/images/uploads/2020/switch-user/03-pilih-user.png)]({{site.url}}/images/uploads/2020/switch-user/03-pilih-user.png)

Silahkan pilih salah satu, kemudian klik `Switch User`. Kita akan dibawa ke halaman transaksi seperti ini

[![Screen Daftar Transaksi Switch User]({{site.url}}/images/uploads/2020/switch-user/04-transaksi-user001.png)]({{site.url}}/images/uploads/2020/switch-user/04-transaksi-user001.png)

Menu di kanan atas juga berubah menjadi seperti ini

[![Nav Kanan Atas]({{site.url}}/images/uploads/2020/switch-user/05-menu-kembali-admin.png)]({{site.url}}/images/uploads/2020/switch-user/05-menu-kembali-admin.png)

Kita bisa klik `Kembali ke Admin` sehingga kembali ke halaman sebelumnya yaitu `Daftar Transaksi` yang berisi transaksi user `admin`.

## Implementasi Audit Log #

Bila kita menyediakan fitur untuk administrator menyamar sebagai user lain, maka sebagai programmer yang bertanggung jawab, kita juga harus memastikan bahwa fitur tersebut tidak disalahgunakan. Untuk itu, minimal kita sediakan fitur untuk mencatat kegiatan administrator selama dia bertindak atas nama user lain.

Di aplikasi web yang dibuat dengan Spring Framework, fitur ini bisa kita implementasikan dengan menggunakan `interceptor`. Berikut adalah class `AuditTrailInterceptor`

```java
@Component
public class AuditTrailInterceptor extends HandlerInterceptorAdapter {

    @Autowired private PenggunaDao penggunaDao;
    @Autowired private AuditLogDao auditLogDao;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        log.info("URL yang diakses : {}", request.getRequestURL());
        if (!request.getRequestURL().toString().contains("transaksi")) {
            log.info("Bukan url transaksi");
            return true;
        }
        Authentication currentUser = SecurityContextHolder.getContext()
                .getAuthentication();
        log.info("Current user : {}", currentUser);
        Authentication userAsli = SwitchUserHelper.userAsli(currentUser);
        if (userAsli != null) {
            log.info("User asli : {}", userAsli);
            AuditLog auditLog = new AuditLog();
            auditLog.setKeterangan("Mengakses "
                    +request.getRequestURL().toString()
                    +" sebagai user "
                    +currentUser.getName());
            auditLog.setWaktuKegiatan(LocalDateTime.now());
            auditLog.setPenggunaAsli(
                    penggunaDao.findByUsername(
                            userAsli.getName()).get());
            auditLog.setPenggunaDipakai(
                    penggunaDao.findByUsername(
                            currentUser.getName()).get());
            auditLogDao.save(auditLog);
        }

        return true;
    }
}
```

Untuk mengimplementasikan interceptor dalam Spring, kita harus membuat class yang merupakan turunan dari `HandlerInterceptorAdapter`. Ada beberapa method yang bisa kita _override_ di sini, yaitu:

* `preHandle` : dijalankan sebelum memanggil method yang akan diintercept. Di sini kita bisa melakukan pengecekan dan memutuskan apakah method yang akan diintercept akan dijalankan atau tidak. Bila akan lanjut, maka kita `return true`. Bila tidak boleh lanjut, maka kita `return false`.
* `postHandle` : dijalankan setelah method yang diintercept dijalankan
* `afterCompletion` : dijalankan setelah view dirender

Dokumentasi lengkapnya bisa kita baca [di sini](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/servlet/HandlerInterceptor.html)

Kita cukup mengimplementasikan salah satu method saja. Sebetulnya untuk keperluan audit trail ini, method mana saja tidak masalah. Pada contoh kali ini, kita pilih saja method `preHandle`.

Dalam method `preHandle`, kita melihat semua request yang masuk, menulis catatan ke log file, dan mengecek apakah request yang masuk dilakukan oleh user asli, atau user admin yang menyamar. Bila request dilakukan oleh admin yang menyamar, maka kita catat requestnya dan kita masukkan ke database.

Class ini kita beri anotasi `@Component` agar otomatis diinstankan oleh Spring. Selanjutnya, kita perlu mendaftarkan objectnya ke interceptor Spring agar digunakan. Caranya adalah dengan cara membuat class konfigurasi seperti ini

```java
@Configuration
public class KonfigurasiInterceptor implements WebMvcConfigurer {

    @Autowired
    private AuditTrailInterceptor auditTrailInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(auditTrailInterceptor);
    }
}
```

Kita bisa mengetes hasil kerja interceptor ini dengan langkah sebagai berikut:

1. Login ke aplikasi sebagai user `admin`.
2. Klik ganti user di menu kanan atas.
3. Pilih user yang ingin digunakan.
4. Buka halaman daftar transaksi
5. Kembali menjadi user `admin` 
6. Buka halaman audit trail untuk melihat hasil catatannya. Buka juga log di command line untuk melihat hasil output interceptornya

Log output di console terlihat seperti ini

```
2020-03-15 17:02:35.736  INFO 87510 --- [io-8080-exec-10] c.m.e.b.s.b.u.AuditTrailInterceptor      : URL yang diakses : http://localhost:8080/transaksi/list
2020-03-15 17:02:35.737  INFO 87510 --- [io-8080-exec-10] c.m.e.b.s.b.u.AuditTrailInterceptor      : Current user : org.springframework.security.authentication.UsernamePasswordAuthenticationToken@cfe7b0c: Principal: org.springframework.security.core.userdetails.User@f73a3686: Username: user001; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: Pengguna; Credentials: [PROTECTED]; Authenticated: true; Details: org.springframework.security.web.authentication.WebAuthenticationDetails@ffff4c9c: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: 1C9E8E22CFD9F00F2BECB7677E6890AD; Granted Authorities: Pengguna, Switch User Authority [ROLE_PREVIOUS_ADMINISTRATOR,org.springframework.security.authentication.UsernamePasswordAuthenticationToken@f2c668ee: Principal: org.springframework.security.core.userdetails.User@586034f: Username: admin; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: Administrator; Credentials: [PROTECTED]; Authenticated: true; Details: org.springframework.security.web.authentication.WebAuthenticationDetails@166c8: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: FC021058978AF05D7937A7C205FB09CB; Granted Authorities: Administrator]
2020-03-15 17:02:35.737  INFO 87510 --- [io-8080-exec-10] c.m.e.b.s.b.u.AuditTrailInterceptor      : User asli : org.springframework.security.authentication.UsernamePasswordAuthenticationToken@f2c668ee: Principal: org.springframework.security.core.userdetails.User@586034f: Username: admin; Password: [PROTECTED]; Enabled: true; AccountNonExpired: true; credentialsNonExpired: true; AccountNonLocked: true; Granted Authorities: Administrator; Credentials: [PROTECTED]; Authenticated: true; Details: org.springframework.security.web.authentication.WebAuthenticationDetails@166c8: RemoteIpAddress: 0:0:0:0:0:0:0:1; SessionId: FC021058978AF05D7937A7C205FB09CB; Granted Authorities: Administrator
```

Dan di halaman audit trail seperti ini

[![Audit Trail]({{site.url}}/images/uploads/2020/switch-user/06-audit-trail.png)]({{site.url}}/images/uploads/2020/switch-user/06-audit-trail.png)

## Penutup ##

Demikianlah artikel singkat tentang fitur switch user. Seperti biasa, source code lengkap ada [di Github](https://github.com/endymuhardin/belajar-switchuser). Mudah-mudahan bermanfaat...