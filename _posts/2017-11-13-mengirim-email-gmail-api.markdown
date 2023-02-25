---
layout: post
title: "Mengirim Email dengan GMail API"
date: 2017-11-13 07:00
comments: true
categories:
- java
---

Selama ini, bila kita membuat aplikasi yang ada fitur kirim emailnya (reset password, pengumuman, newsletter, dan sebagainya), biasanya kita menggunakan protokol SMTP. Akan tetapi, beberapa tahun belakangan ini, layanan SaaS (software as a service) bermunculan seperti cendawan di musim hujan. Sebagian besar di antaranya tidak lagi menggunakan protokol SMTP, tapi menyediakan API di atas protokol HTTP.

Ada banyak penyedia jasa layanan email, diantaranya:

* SendGrid
* MailerLite
* Amazon
* GMail

Pada artikel ini kita akan membahas yang paling populer saja, yaitu GMail. GMail menyediakan dua pilihan bila kita ingin mengirim email dari aplikasi kita : SMTP atau HTTP API. Kita akan gunakan HTTP API. 

Berikut langkah-langkahnya:

<!--more-->

* TOC
{:toc}

## Membuat Project Google Developer ##

Agar aplikasi kita bisa mengirim email, terlebih dulu kita buat Google Developer Project. Pertama, kita harus sudah login dulu ke akun GMail. 

[![Gmail Login]({{site.url}}/images/uploads/2017/gmail-api/01-login-gmail.png)]({{site.url}}/images/uploads/2017/gmail-api/01-login-gmail.png)

Setelah itu, buka [Google Developer Console](https://console.developers.google.com)

[![Google Developer Console]({{site.url}}/images/uploads/2017/gmail-api/02-google-developer-console.png)]({{site.url}}/images/uploads/2017/gmail-api/02-google-developer-console.png)

Kemudian buat project baru

[![Create New Project]({{site.url}}/images/uploads/2017/gmail-api/03-select-or-create.png)]({{site.url}}/images/uploads/2017/gmail-api/03-select-or-create.png)

Masukkan nama project. Namanya bebas apa saja boleh

[![Nama Project]({{site.url}}/images/uploads/2017/gmail-api/04-new-project.png)]({{site.url}}/images/uploads/2017/gmail-api/04-new-project.png)

Project selesai dibuat, sekarang kita bisa lanjutkan ke aktivasi GMail API

## Enable GMail API ##

Di dashboard sudah disediakan tombolnya

[![Project Dashboard]({{site.url}}/images/uploads/2017/gmail-api/05-project-created.png)]({{site.url}}/images/uploads/2017/gmail-api/05-project-created.png)

Klik saja icon GMail API

[![Aktivasi GMail API]({{site.url}}/images/uploads/2017/gmail-api/06-enable-gmail-api.png)]({{site.url}}/images/uploads/2017/gmail-api/06-enable-gmail-api.png)

Selanjutnya kita sudah bisa melihat bahwa GMail API sudah aktif.

[![Gmail API Enabled]({{site.url}}/images/uploads/2017/gmail-api/07-api-enabled.png)]({{site.url}}/images/uploads/2017/gmail-api/07-api-enabled.png)

## Membuat Credentials ##

Biasanya, kita mengirim email melalui aplikasi web based yang sudah disediakan GMail, yaitu setelah memasukkan username dan password. Tetapi kali ini, kita ingin mengirim email dari aplikasi, yang tidak memiliki kemampuan untuk login dengan username dan password. Untuk itu, kita menggunakan otentikasi dan otorisasi OAuth. Lebih detail mengenai OAuth, silahkan tonton seri pelatihan OAuth saya di Youtube.

<iframe width="560" height="315" src="https://www.youtube.com/embed/m5jI0Y14Wqc" frameborder="0" allowfullscreen></iframe>

Kita perlu membuat credentials agar aplikasi kita bisa menggunakan GMail atas nama akun pemilik project. Klik menu Credentials di panel kiri. Selanjutnya kita akan melihat wizard untuk membuat credential

[![Create Credential]({{site.url}}/images/uploads/2017/gmail-api/08-create-credentials.png)]({{site.url}}/images/uploads/2017/gmail-api/08-create-credentials.png)

Ada beberapa pilihan jenis credential, kita pilih yang OAuth

[![Pilih OAuth]({{site.url}}/images/uploads/2017/gmail-api/09-pilih-oauth.png)]({{site.url}}/images/uploads/2017/gmail-api/09-pilih-oauth.png)

Kita harus mengkonfigurasikan dulu Consent Screen, yaitu halaman konfirmasi yang akan ditampilkan Google pada waktu meminta ijin dari user.

[![Consent Screen]({{site.url}}/images/uploads/2017/gmail-api/11-consent-screen.png)]({{site.url}}/images/uploads/2017/gmail-api/11-consent-screen.png)

Selanjutnya, kita memilih jenis aplikasi yang akan dibuat.

[![Jenis Project]({{site.url}}/images/uploads/2017/gmail-api/12-client-id.png)]({{site.url}}/images/uploads/2017/gmail-api/12-client-id.png)

Selesai, client id dan secret sudah selesai.

[![Credential created]({{site.url}}/images/uploads/2017/gmail-api/13-client-id-created.png)]({{site.url}}/images/uploads/2017/gmail-api/13-client-id-created.png)

Agar bisa digunakan di aplikasi, kita perlu mengunduh file credential

[![Link Download Credential]({{site.url}}/images/uploads/2017/gmail-api/14-dashboard-credentials.png)]({{site.url}}/images/uploads/2017/gmail-api/14-dashboard-credentials.png)

Download filenya, kita akan membutuhkannya nanti.

[![File Credentials]({{site.url}}/images/uploads/2017/gmail-api/15-file-credentials.png)]({{site.url}}/images/uploads/2017/gmail-api/15-file-credentials.png)

## Membuat Project Spring Boot ##

Selanjutnya, kita buat aplikasi untuk mengirim email. Seperti biasa, kita generate project di [start.spring.io](https://start.spring.io)

[![Start Spring IO]({{site.url}}/images/uploads/2017/gmail-api/16-spring-starter.png)]({{site.url}}/images/uploads/2017/gmail-api/16-spring-starter.png)

Beberapa modul yang saya gunakan:

* Web : aplikasi kita adalah aplikasi web, nantinya kita kirim email dengan menggunakan REST API
* Lombok : agar tidak repot membuat getter/setter
* Mail : library Java untuk mengirim email
* DevTools : supaya gampang restart aplikasi

## Menambahkan Dependensi GMail API ##

Selanjutnya, kita tambahkan dependensi library GMail API. Daftar library bisa dilihat di file konfigurasi Gradle di [dokumentasi yang sudah disediakan Google](https://developers.google.com/gmail/api/quickstart/java).

Berikut dependensinya dalam format Maven

```xml
<dependency>
  <groupId>com.google.api-client</groupId>
  <artifactId>google-api-client</artifactId>
  <version>1.23.0</version>
</dependency>
<dependency>
  <groupId>com.google.oauth-client</groupId>
  <artifactId>google-oauth-client-jetty</artifactId>
  <version>1.23.0</version>
</dependency>
<dependency>
  <groupId>com.google.apis</groupId>
  <artifactId>google-api-services-gmail</artifactId>
  <version>v1-rev73-1.23.0</version>
</dependency>
```

Kita siapkan dulu kerangka class untuk melakukan pengiriman email. Saya biasanya buat di dalam package `service`. Classnya kita beri nama saja `GmailApiService`. Berikut kerangka classnya.

```java
package com.muhardin.endy.belajar.belajargmailapi.service;

import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;

@Service
public class GmailApiService {

    @PostConstruct
    public void inisialisasiOauth(){

    }
    
    public void kirimEmail(String from, String to, String subject, String content){

    }
}
```

## Persiapan File Konfigurasi ##

Aplikasi kita membutuhkan dua konfigurasi agar kita bisa menggunakan GMail API :

* lokasi file `client_secret.json` yang sudah kita unduh di langkah sebelumnya
* lokasi folder tempat penyimpanan file hasil otorisasi

Misalnya, kita akan sediakan folder `${HOME}/.gmail-api/credentials` untuk lokasi folder. File `client_secret.json` juga akan kita taruh di sana. Maka konfigurasi di `application.properties` akan terlihat seperti ini

```
spring.application.name=notifikasi-gmail
gmail.account.username=endy.muhardin@gmail.com
gmail.folder=${user.home}/.gmail-api/credentials
gmail.credential=${gmail.folder}/client_secret.json
```

Tentunya jangan lupa kita buatkan dulu folder di atas. Kita juga harus pindahkan dan rename file json yang kita dapatkan dari Google Developer Console tadi. Pastikan akun gmail yang kita taruh di file konfigurasi (`gmail.account.username`) sama dengan akun gmail yang digunakan untuk membuat project di Developer Console.

```
mkdir -p ~/.gmail-api/credentials
cp ~/Downloads/client*.json ~/.gmail-api/credentials/client_secret.json
```

Pastikan sudah benar

```
ls -lR ~/.gmail-api
```

Seharusnya outputnya kira-kira seperti ini

```
total 0
drwxr-xr-x  3 endymuhardin  staff  96 Nov 13 10:28 credentials

/Users/endymuhardin/.gmail-api/credentials:
total 8
-rw-r--r--@ 1 endymuhardin  staff  430 Nov 13 10:28 client_secret.json
```

Isi file konfigurasi ini bisa kita baca di class `GmailApiService` sebagai berikut:

```java
@Service
public class GmailApiService {

    @Value("${spring.application.name}")
    private String applicationName;

    @Value("${gmail.account.username}")
    private String gmailUsername;

    @Value("${gmail.credential}")
    private String credentialFile;

    @Value("${gmail.folder}")
    private String dataStoreFolder;

}
```

## Melakukan Otorisasi OAuth ##

Agar aplikasi kita bisa mengirim email atas nama pemilik akun, terlebih dulu si pemilik akun harus mengkonfirmasi bahwa aplikasi kita benar-benar diperbolehkan mengirim email. Kalau tidak begitu, nanti akan banyak penyalahgunaan, ada email yang datang atas nama kita padahal bukan kita yang kirim.

Berikut kode program untuk menginisiasi proses otorisasi.

```java
public class GmailApiService {
  private static final List<String> SCOPES =
            Arrays.asList(GmailScopes.GMAIL_SEND);

  private Gmail gmail;

  @PostConstruct
    public void inisialisasiOauth() throws Exception {
        JsonFactory jsonFactory =
                JacksonFactory.getDefaultInstance();

        FileDataStoreFactory fileDataStoreFactory =
                new FileDataStoreFactory(new File(dataStoreFolder));

        HttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();

        GoogleClientSecrets clientSecrets =
                GoogleClientSecrets.load(jsonFactory,
                        new InputStreamReader(new FileInputStream(credentialFile)));

        GoogleAuthorizationCodeFlow flow =
                new GoogleAuthorizationCodeFlow.Builder(
                        httpTransport, jsonFactory, clientSecrets, SCOPES)
                        .setDataStoreFactory(fileDataStoreFactory)
                        .setAccessType("offline")
                        .build();

        Credential gmailCredential = new AuthorizationCodeInstalledApp(
                flow, new LocalServerReceiver()).authorize("user");

        gmail = new Gmail.Builder(httpTransport, jsonFactory, gmailCredential)
                .setApplicationName(applicationName)
                .build();

    }
}
```

Setelah kita pasang kode di atas, kita bisa coba jalankan aplikasinya dengan perintah `mvn clean spring-boot:run`. Pada waktu dijalankan pertama kali, kita akan melakukan otorisasi aplikasi. Proses ini akan menghasilkan satu file yang dibuatkan GMail API di folder yang telah kita konfigurasikan, yaitu `${user.home}/.gmail-api/credentials`.

Berikut output pada waktu dijalankan, proses run akan berhenti pada waktu menampilkan URL otorisasi.

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v1.5.8.RELEASE)

2017-11-13 10:41:44.270  INFO 64131 --- [  restartedMain] c.m.e.b.b.BelajarGmailApiApplication     : Starting BelajarGmailApiApplication on Endys-MacBook-Air.local with PID 64131 (/Volumes/SDUF128G/workspace/belajar/belajar-gmail-api/target/classes started by endymuhardin in /Volumes/SDUF128G/workspace/belajar/belajar-gmail-api)
2017-11-13 10:41:44.271  INFO 64131 --- [  restartedMain] c.m.e.b.b.BelajarGmailApiApplication     : No active profile set, falling back to default profiles: default
2017-11-13 10:41:44.469  INFO 64131 --- [  restartedMain] ationConfigEmbeddedWebApplicationContext : Refreshing org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext@7c012de5: startup date [Mon Nov 13 10:41:44 WIB 2017]; root of context hierarchy
2017-11-13 10:41:47.871  INFO 64131 --- [  restartedMain] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat initialized with port(s): 8080 (http)
2017-11-13 10:41:47.914  INFO 64131 --- [  restartedMain] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2017-11-13 10:41:47.920  INFO 64131 --- [  restartedMain] org.apache.catalina.core.StandardEngine  : Starting Servlet Engine: Apache Tomcat/8.5.23
2017-11-13 10:41:48.155  INFO 64131 --- [ost-startStop-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2017-11-13 10:41:48.155  INFO 64131 --- [ost-startStop-1] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 3692 ms
2017-11-13 10:41:48.396  INFO 64131 --- [ost-startStop-1] o.s.b.w.servlet.ServletRegistrationBean  : Mapping servlet: 'dispatcherServlet' to [/]
2017-11-13 10:41:48.408  INFO 64131 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'characterEncodingFilter' to: [/*]
2017-11-13 10:41:48.409  INFO 64131 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'hiddenHttpMethodFilter' to: [/*]
2017-11-13 10:41:48.410  INFO 64131 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'httpPutFormContentFilter' to: [/*]
2017-11-13 10:41:48.410  INFO 64131 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'requestContextFilter' to: [/*]
2017-11-13 10:41:49.076  INFO 64131 --- [  restartedMain] org.mortbay.log                          : Logging to Logger[org.mortbay.log] via org.mortbay.log.Slf4jLog
2017-11-13 10:41:49.081  INFO 64131 --- [  restartedMain] org.mortbay.log                          : jetty-6.1.26
2017-11-13 10:41:49.147  INFO 64131 --- [  restartedMain] org.mortbay.log                          : Started SocketConnector@localhost:51302
Please open the following address in your browser:
  https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=937633732253-53nu68qiif1gp5io2aotbf0kuaqq5gm5.apps.googleusercontent.com&redirect_uri=http://localhost:51302/Callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.send
```

Buka url tadi di browser.

[![Choose Account]({{site.url}}/images/uploads/2017/gmail-api/17-choose-account.png)]({{site.url}}/images/uploads/2017/gmail-api/17-choose-account.png)

Kita akan disuruh memilih akun mana yang kita akan pakai. Pastikan pilih akun sesuai pembuatan project di Developer Console. Selanjutnya, kita akan ditanya apakah akan mengijinkan (Allow) `Aplikasi Notifikasi` untuk mengirim email atas nama / seolah-olah dari `artivisi.intermedia@gmail.com`.

[![Allow Access]({{site.url}}/images/uploads/2017/gmail-api/18-allow-access.png)]({{site.url}}/images/uploads/2017/gmail-api/18-allow-access.png)

Begitu kita allow, tampilan browsernya sebagai berikut.

[![Allow Success]({{site.url}}/images/uploads/2017/gmail-api/19-oauth-success.png)]({{site.url}}/images/uploads/2017/gmail-api/19-oauth-success.png)

Di belakang layar, GMail akan memberikan respon sukses ke aplikasi kita yang sedang berjalan tadi (`mvn spring-boot:run`), sehingga prosesnya berlanjut sampai aplikasi berjalan sempurna.

```
2017-11-13 10:44:08.920  INFO 64131 --- [  restartedMain] org.mortbay.log                          : Stopped SocketConnector@localhost:51302
2017-11-13 10:44:09.871  INFO 64131 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerAdapter : Looking for @ControllerAdvice: org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext@7c012de5: startup date [Mon Nov 13 10:41:44 WIB 2017]; root of context hierarchy
2017-11-13 10:44:10.308  INFO 64131 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error]}" onto public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>> org.springframework.boot.autoconfigure.web.BasicErrorController.error(javax.servlet.http.HttpServletRequest)
2017-11-13 10:44:10.311  INFO 64131 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error],produces=[text/html]}" onto public org.springframework.web.servlet.ModelAndView org.springframework.boot.autoconfigure.web.BasicErrorController.errorHtml(javax.servlet.http.HttpServletRequest,javax.servlet.http.HttpServletResponse)
2017-11-13 10:44:10.403  INFO 64131 --- [  restartedMain] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/webjars/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-11-13 10:44:10.403  INFO 64131 --- [  restartedMain] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-11-13 10:44:10.542  INFO 64131 --- [  restartedMain] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**/favicon.ico] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-11-13 10:44:10.903  INFO 64131 --- [  restartedMain] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2017-11-13 10:44:11.069  INFO 64131 --- [  restartedMain] o.s.j.e.a.AnnotationMBeanExporter        : Registering beans for JMX exposure on startup
2017-11-13 10:44:11.284  INFO 64131 --- [  restartedMain] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat started on port(s): 8080 (http)
2017-11-13 10:44:11.309  INFO 64131 --- [  restartedMain] c.m.e.b.b.BelajarGmailApiApplication     : Started BelajarGmailApiApplication in 148.042 seconds (JVM running for 149.023)
```

Kita bisa cek di folder `${user.home}/.gmail-api/credentials`, harusnya ada file baru hasil otorisasi.

```
$ ls -lR ~/.gmail-api
total 0
drwx------  4 endymuhardin  staff  128 Nov 13 10:41 credentials

/Users/endymuhardin/.gmail-api/credentials:
total 16
-rw-r--r--  1 endymuhardin  staff  1000 Nov 13 10:44 StoredCredential
-rw-r--r--@ 1 endymuhardin  staff   430 Nov 13 10:28 client_secret.json
```

Bila file ini sudah ada, aplikasi kita tidak akan meminta otorisasi lagi seperti langkah di atas. Aplikasi kita akan langsung start seperti biasa. Kita bisa cek dengan cara stop aplikasi (`Ctrl-C`) dan start lagi. Harusnya tidak ada prompt otorisasi lagi.

```
[INFO] --- spring-boot-maven-plugin:1.5.8.RELEASE:run (default-cli) @ belajar-gmail-api ---
[INFO] Attaching agents: []
10:50:26.491 [main] DEBUG org.springframework.boot.devtools.settings.DevToolsSettings - Included patterns for restart : []
10:50:26.493 [main] DEBUG org.springframework.boot.devtools.settings.DevToolsSettings - Excluded patterns for restart : [/spring-boot-starter/target/classes/, /spring-boot-autoconfigure/target/classes/, /spring-boot-starter-[\w-]+/, /spring-boot/target/classes/, /spring-boot-actuator/target/classes/, /spring-boot-devtools/target/classes/]
10:50:26.494 [main] DEBUG org.springframework.boot.devtools.restart.ChangeableUrls - Matching URLs for reloading : [file:/Volumes/SDUF128G/workspace/belajar/belajar-gmail-api/target/classes/]

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::        (v1.5.8.RELEASE)

2017-11-13 10:50:27.444  INFO 64358 --- [  restartedMain] c.m.e.b.b.BelajarGmailApiApplication     : Starting BelajarGmailApiApplication on Endys-MacBook-Air.local with PID 64358 (/Volumes/SDUF128G/workspace/belajar/belajar-gmail-api/target/classes started by endymuhardin in /Volumes/SDUF128G/workspace/belajar/belajar-gmail-api)
2017-11-13 10:50:27.446  INFO 64358 --- [  restartedMain] c.m.e.b.b.BelajarGmailApiApplication     : No active profile set, falling back to default profiles: default
2017-11-13 10:50:27.629  INFO 64358 --- [  restartedMain] ationConfigEmbeddedWebApplicationContext : Refreshing org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext@f83f998: startup date [Mon Nov 13 10:50:27 WIB 2017]; root of context hierarchy
2017-11-13 10:50:30.755  INFO 64358 --- [  restartedMain] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat initialized with port(s): 8080 (http)
2017-11-13 10:50:30.781  INFO 64358 --- [  restartedMain] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2017-11-13 10:50:30.784  INFO 64358 --- [  restartedMain] org.apache.catalina.core.StandardEngine  : Starting Servlet Engine: Apache Tomcat/8.5.23
2017-11-13 10:50:31.014  INFO 64358 --- [ost-startStop-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2017-11-13 10:50:31.015  INFO 64358 --- [ost-startStop-1] o.s.web.context.ContextLoader            : Root WebApplicationContext: initialization completed in 3391 ms
2017-11-13 10:50:31.244  INFO 64358 --- [ost-startStop-1] o.s.b.w.servlet.ServletRegistrationBean  : Mapping servlet: 'dispatcherServlet' to [/]
2017-11-13 10:50:31.254  INFO 64358 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'characterEncodingFilter' to: [/*]
2017-11-13 10:50:31.255  INFO 64358 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'hiddenHttpMethodFilter' to: [/*]
2017-11-13 10:50:31.256  INFO 64358 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'httpPutFormContentFilter' to: [/*]
2017-11-13 10:50:31.256  INFO 64358 --- [ost-startStop-1] o.s.b.w.servlet.FilterRegistrationBean   : Mapping filter: 'requestContextFilter' to: [/*]
2017-11-13 10:50:32.327  INFO 64358 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerAdapter : Looking for @ControllerAdvice: org.springframework.boot.context.embedded.AnnotationConfigEmbeddedWebApplicationContext@f83f998: startup date [Mon Nov 13 10:50:27 WIB 2017]; root of context hierarchy
2017-11-13 10:50:32.436  INFO 64358 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error]}" onto public org.springframework.http.ResponseEntity<java.util.Map<java.lang.String, java.lang.Object>> org.springframework.boot.autoconfigure.web.BasicErrorController.error(javax.servlet.http.HttpServletRequest)
2017-11-13 10:50:32.437  INFO 64358 --- [  restartedMain] s.w.s.m.m.a.RequestMappingHandlerMapping : Mapped "{[/error],produces=[text/html]}" onto public org.springframework.web.servlet.ModelAndView org.springframework.boot.autoconfigure.web.BasicErrorController.errorHtml(javax.servlet.http.HttpServletRequest,javax.servlet.http.HttpServletResponse)
2017-11-13 10:50:32.502  INFO 64358 --- [  restartedMain] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/webjars/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-11-13 10:50:32.503  INFO 64358 --- [  restartedMain] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-11-13 10:50:32.564  INFO 64358 --- [  restartedMain] o.s.w.s.handler.SimpleUrlHandlerMapping  : Mapped URL path [/**/favicon.ico] onto handler of type [class org.springframework.web.servlet.resource.ResourceHttpRequestHandler]
2017-11-13 10:50:32.799  INFO 64358 --- [  restartedMain] o.s.b.d.a.OptionalLiveReloadServer       : LiveReload server is running on port 35729
2017-11-13 10:50:32.880  INFO 64358 --- [  restartedMain] o.s.j.e.a.AnnotationMBeanExporter        : Registering beans for JMX exposure on startup
2017-11-13 10:50:32.991  INFO 64358 --- [  restartedMain] s.b.c.e.t.TomcatEmbeddedServletContainer : Tomcat started on port(s): 8080 (http)
2017-11-13 10:50:33.004  INFO 64358 --- [  restartedMain] c.m.e.b.b.BelajarGmailApiApplication     : Started BelajarGmailApiApplication in 6.483 seconds (JVM running for 7.444)
```

Pada saat kita mendeploy aplikasi ke server, jangan lupa untuk menyertakan kedua file tersebut (`client_secret.json` dan `StoredCredential`) di folder yang sesuai dengan konfigurasi.

## Mengirim Email ##

Untuk mengirim email, berikut kode programnya

```java
package com.muhardin.endy.belajar.belajargmailapi.service;

import com.google.api.client.util.Base64;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
 
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.util.Properties;

@Service
public class GmailApiService {

    private static final Logger LOGGER = LoggerFactory.getLogger(GmailApiService.class);
    private Gmail gmail;

    public void kirimEmail(String from, String to, String subject, String content){
        try {
            Properties props = new Properties();
            Session session = Session.getDefaultInstance(props, null);

            InternetAddress destination = new InternetAddress(to);
            MimeMessage email = new MimeMessage(session);
            email.setFrom(new InternetAddress(gmailUsername, from));
            email.addRecipient(javax.mail.Message.RecipientType.TO, destination);
            email.setSubject(subject);
            email.setContent(content, "text/html; charset=utf-8");

            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            email.writeTo(buffer);
            byte[] bytes = buffer.toByteArray();
            String encodedEmail = Base64.encodeBase64URLSafeString(bytes);
            Message message = new Message();
            message.setRaw(encodedEmail);

            message = gmail.users().messages().send("me", message).execute();
            LOGGER.info("Email {} from {} to {} with subject {}", message.getId(), from, destination, subject);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }
}
```

Awas jangan salah import, seharusnya `com.google.api.services.gmail.model.Message`, **bukan** `javax.mail.Message`.

Selanjutnya kita test dengan JUnit.

```java
package com.muhardin.endy.belajar.belajargmailapi;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BelajarGmailApiApplicationTests {

	@Autowired private GmailApiService gmailApiService;

	@Test
	public void testKirimEmail() {
		gmailApiService.kirimEmail(
				"Belajar GMail API",
				"endy.muhardin@gmail.com",
				"Email Percobaan" + LocalDateTime.now(),
				"Ini email percobaan dikirim dari aplikasi"
				);
	}

}
```

Cek inbox gan, harusnya ada message baru.

[![Inbox]({{site.url}}/images/uploads/2017/gmail-api/20-inbox.png)]({{site.url}}/images/uploads/2017/gmail-api/20-inbox.png)

Klik untuk melihat isinya

[![Choose Account]({{site.url}}/images/uploads/2017/gmail-api/21-email-content.png)]({{site.url}}/images/uploads/2017/gmail-api/21-email-content.png)


## Mengirim Email dengan Template HTML ##

Tentunya kalau email polos begitu kurang menarik. Kita ingin email yang tampilannya bagus seperti yang biasa kita terima dari online shop dan sebagainya. Untuk itu, kita cari template HTML email yang bagus dan siap pakai.

Untungnya ada yang sudah membuatkan template gratis siap pakai, yaitu [Send With Us](https://www.sendwithus.com/). Kita bisa unduh templatenya [di Github SendWithUs](https://github.com/sendwithus/templates).

Sebagai contoh, kita ambil salah satu file template `welcome.html` dan taruh di folder `src/main/resources`. Nantinya kita bisa taruh file ini di mana saja, tinggal kita konfigurasi saja di aplikasi.

Untuk memasang variabel di dalam template (misalnya nama, tanggal, no. rekening, dan sebagainya), kita membutuhkan template engine. Saya akan gunakan [Mustache for Java](https://github.com/spullara/mustache.java) yang sudah terbukti handal dipakai oleh Twitter.

Berikut tambahan dependensi di `pom.xml` untuk menggunakan Mustache.

```xml
<dependency>
  <groupId>com.github.spullara.mustache.java</groupId>
  <artifactId>compiler</artifactId>
  <version>0.9.5</version>
</dependency>
```

Kita instankan `MustacheFactory` yang berguna untuk melakukan pemrosesan template di main class. Main class saya adalah `BelajarGmailApiApplication`, berikut isinya:

```java
package com.muhardin.endy.belajar.belajargmailapi;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.MustacheFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BelajarGmailApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(BelajarGmailApiApplication.class, args);
	}

	@Bean
	public MustacheFactory mustacheFactory(){
		return new DefaultMustacheFactory();
	}
}
```

Nama variabel di Mustache ditandai dengan kurung kurawal berganda. Jadi bila kita ingin memasukkan variabel `nama`, di dalam template kita akan tulis seperti ini : {% raw %}{{nama}}{% endraw %}. Agar sederhana, saya akan buat saja dua variabel, yaitu `nama` dan `pesan`. Silahkan cek isi file template untuk melihat caranya. Saya tidak paste di sini karena filenya lumayan besar. Variabel `nama` ada [di baris 1480](https://github.com/endymuhardin/belajar-gmail-api/blob/master/src/main/resources/templates/welcome.html#L1480) dan variabel `pesan` dipasang [di baris 1508](https://github.com/endymuhardin/belajar-gmail-api/blob/master/src/main/resources/templates/welcome.html#L1508).

Selanjutnya, kita akan membaca file template ini dan mengisinya dengan variabel. Lalu kita kirim dengan class `GmailApiService` tadi.

```java
package com.muhardin.endy.belajar.belajargmailapi;

// import dihapus supaya tidak terlalu panjang. Bereskan saja dengan bantuan IDE

@RunWith(SpringRunner.class)
@SpringBootTest
public class BelajarGmailApiApplicationTests {

	@Autowired private GmailApiService gmailApiService;
	@Autowired private MustacheFactory mustacheFactory;

	@Test
	public void testKirimEmailDenganTemplate(){
		Mustache templateEmail = mustacheFactory.compile("templates/welcome.html");
		Map<String, String> data = new HashMap<>();
		data.put("nama", "Endy Muhardin");
		data.put("pesan", "Anda telah terdaftar di Aplikasi Notifikasi. Silahkan tunggu instruksi selanjutnya");

		StringWriter output = new StringWriter();
		templateEmail.execute(output, data);

		gmailApiService.kirimEmail(
				"Belajar GMail API",
				"endy.muhardin@gmail.com",
				"Percobaan Mustache Template",
				output.toString());
	}
}
```

Berikut outputnya di mailbox.

[![Inbox Template]({{site.url}}/images/uploads/2017/gmail-api/22-inbox-template.png)]({{site.url}}/images/uploads/2017/gmail-api/22-inbox-template.png)

Dan seperti ini tampilan hasilnya.

[![Choose Account]({{site.url}}/images/uploads/2017/gmail-api/23-email-content-template.png)]({{site.url}}/images/uploads/2017/gmail-api/23-email-content-template.png)

## Deployment Heroku ##

Ada pertanyaan di komentar :

> Bagaimana cara menjalankan aplikasi ini di Heroku?

Deployment di Heroku agak sedikit ribet, tapi bisa dilakukan. Sumber kesulitan utama adalah karena Heroku menganut prinsip [ephemeral file system](https://devcenter.heroku.com/articles/dynos#isolation-and-security). Artinya, semua file yang bukan bagian dari aplikasi akan **dihapus** setiap kali aplikasi dideploy atau direstart. Kesulitan yang ditimbulkan karena ini antara lain:

* Bila ingin menjadikan `client_secret.json` sebagai bagian aplikasi, maka file ini harus dicommit ke source code repository. Tentunya ini tidak baik, karena semua yang masuk repo bukan lagi `secret`.
* Kita tidak bisa menaruh file `client_secret.json` di server aplikasi / dyno Heroku, karena akan dibuang setiap kali restart/deploy.
* Kita tidak bisa menjalankan proses OAuth Google API, karena dia akan membuka port secara random, dan melakukan redirect ke port tersebut. Seperti kita lihat pada log di atas, dia mengharapkan redirect ke `http://localhost:51302/Callback&response_type=code&scope=https://www.googleapis.com/auth/gmail.send`. Port `51302` ini hanya akan jalan di jaringan internal Heroku dan tidak bisa diakses dari luar.

Untuk itu, ada dua strategi untuk mengatasi masalah ini: 

1. Dengan menggunakan external webserver
2. Menggunakan environment variable

### Menggunakan External Web Server ###

Secara garis besar, cara kerjanya seperti ini:

* Taruh file `client_secret.json` di lokasi yang bisa diunduh oleh aplikasi kita di Heroku.
* Supaya tidak perlu menjalankan proses otorisasi OAuth, kita jalankan prosesnya di laptop/PC, kemudian upload hasilnya, yaitu file `StoredCredential` ke lokasi tersebut.
* Download file `client_secret.json` dan `StoredCredential` dari lokasi tersebut ke aplikasi kita di Heroku.

Kita bisa menaruh kedua file ini di server VPS kita, atau menggunakan layanan cloud seperti Dropbox atau Amazon S3. Cara mengambil file dari kedua layanan ini tidak saya bahas di sini. Sebagai contoh sederhana, kita akan gunakan layanan [Ngrok](https://ngrok.com/) supaya laptop kita bisa diakses dari Heroku.

Kita akan mempublikasikan kedua file credentials tersebut agar bisa diakses oleh aplikasi kita di Heroku. Ada dua peralatan yang kita gunakan di sini:

* web server di laptop supaya folder berisi file credentials bisa diakses melalui HTTP
* ngrok untuk mempublikasikan web server lokal tersebut agar bisa diakses dari internet

Web server sederhana banyak ditemukan di internet. Sudah ada yang membuatkan [rekap daftar web server yang bisa dijalankan dengan satu baris perintah](https://gist.github.com/willurd/5720255). Pilih saja salah satu, lalu jalankan. Misalnya seperti ini :

```
cd ~/.gmail-api/credentials
python -m SimpleHTTPServer 8000
```

Dia akan segera ready di port `8000`. Outputnya seperti ini

```
Serving HTTP on 0.0.0.0 port 8000 ...
```

Selanjutnya, port 8000 tersebut kita publikasikan dengan ngrok

```
./ngrok http 8000
```

Outputnya seperti ini

```
ngrok by @inconshreveable
             (Ctrl+C to quit)
Session Status                online
Session Expires               7 hours, 15 minutes
Version                       2.2.8
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://646f1763.ngrok.io -> localhost:8000
Forwarding                    https://646f1763.ngrok.io -> localhost:8000
```

Kita bisa gunakan URL yang disediakan ngrok untuk mengambil file dari aplikasi kita. Berikut kode programnya

```java
private static final String CLIENT_SECRET_JSON_FILE = "client_secret.json";
private static final String STORED_CREDENTIAL_FILE = "StoredCredential";

@Value("${GMAIL_CREDENTIAL_FILE_SERVER}")
private String credentialFileServer;

@Bean @Profile("!heroku")
public GoogleClientSecrets localFileClientSecrets() throws Exception {
  return GoogleClientSecrets.load(jsonFactory(),
          new InputStreamReader(new FileInputStream(dataStoreFolder + File.separator + CLIENT_SECRET_JSON_FILE)));
}

@Bean @Profile("heroku")
public GoogleClientSecrets downloadClientSecrets() throws Exception {
  downloadCredentialsFile(CLIENT_SECRET_JSON_FILE);
  downloadCredentialsFile(STORED_CREDENTIAL_FILE);
  return GoogleClientSecrets.load(jsonFactory(),
      new InputStreamReader(new FileInputStream(dataStoreFolder + File.separator + CLIENT_SECRET_JSON_FILE)));
}

private void downloadCredentialsFile(String filename) throws Exception {
  RestTemplate restTemplate = new RestTemplate();
  restTemplate.getMessageConverters().add(
      new ByteArrayHttpMessageConverter());

  HttpHeaders headers = new HttpHeaders();
  headers.setAccept(Arrays.asList(MediaType.APPLICATION_OCTET_STREAM));

  HttpEntity<String> entity = new HttpEntity<String>(headers);

  ResponseEntity<byte[]> response = restTemplate.exchange(
      credentialFileServer + "/" + filename,
      HttpMethod.GET, entity, byte[].class, "1");

  if (response.getStatusCode() == HttpStatus.OK) {
    Files.createDirectories(Paths.get(dataStoreFolder));
    Files.write(Paths.get(dataStoreFolder + File.separator + filename), 
      response.getBody());
  }
}
```

Kita memisahkan kode program untuk mempersiapkan client secret menjadi satu method tersendiri. Yang satu menyiapkan credential dari file local. Ini adalah kondisi normal seperti sebelumnya. Satu lagi mengambil file credential dari server lain (dalam hal ini laptop yang sudah dipublish dengan ngrok) dan menaruhnya di tempat yang sesuai. Nantinya setiap kali startup, aplikasi kita akan terlebih dulu mengunduh file credential tersebut.

Untuk memilih method mana yang dieksekusi, kita gunakan anotasi `@Profile`. Yang satu jalan bila profile `heroku` tidak aktif, yaitu bila aplikasi tidak jalan di Heroku. Satu lagi jalan bila aplikasi dideploy ke Heroku.

Agar aplikasi berjalan baik, kita akan setup dua environment variable di Heroku untuk dibaca oleh aplikasi kita. Yang pertama adalah profile `heroku` agar method `downloadClientSecrets` dijalankan. Berikut perintahnya dengan `heroku-cli`.

```
heroku config:set SPRING_PROFILES_ACTIVE=heroku
```

Anda juga bisa memasang variabel ini lewat web UI seperti pada [tutorial terdahulu](https://software.endy.muhardin.com/java/project-bootstrap-03/).

Selain itu, kita pasang juga environment variable `GMAIL_CREDENTIAL_FILE_SERVER` sebagai berikut

```
heroku config:set GMAIL_CREDENTIAL_FILE_SERVER=https://646f1763.ngrok.io
```

Nah, sekarang aplikasi kita sudah bisa dideploy ke Heroku. 

> Disclaimer !!! Teknik ngrok di atas tidak untuk dipakai di production, karena tidak ada proteksi apapun terhadap `client_secret.json` dan `StoredCredential`. Lakukan proteksi yang memadai bila mau dihosting sendiri, atau gunakan layanan dengan security yang baik seperti Dropbox atau Amazon S3.

### Menggunakan Environment Variable ###

Secara garis besar, cara kerjanya seperti ini:

* Simpan isi file `client_secret.json` dan `StoredCredential` ke dalam environment variable
* Pada waktu aplikasi start, baca environment variable tersebut, dan tulis kembali menjadi file
* Selanjutnya, aplikasi bisa dijalankan seperti biasa.

File `client_secret.json` bentuknya text, sedangkan file `StoredCredential` adalah file binary. File text bisa langsung kita pasang menjadi environment variable. File binary harus dikonversi dulu menjadi text, supaya bisa digunakan sebagai environment variable. Algoritma konversi (encoding) yang lazim dipakai orang adalah `Base64`. 

Agar kode program di aplikasi lebih sederhana, kita akan tetap mengkonversi file `client_secret.json` dengan `Base64`.

Untuk itu, kita buat dulu kode program Java untuk mengkonversi kedua file ini. Kode programnya bisa kita buat sebagai JUnit test supaya mudah dijalankan. Berikut kode program untuk mengkonversi filenya.


```java
class KonversiCredentialTests {

	@Value("${gmail.folder}")
	private String dataStoreFolder;

	@Test
	public void testConvertStoredCredential() throws IOException {
		byte[] credentialFile = Files.readAllBytes(
				Paths.get(dataStoreFolder + File.separator +
						AplikasiRegistrasiApplication.STORED_CREDENTIAL_FILE));
		String base64Encoded
				= Base64.getEncoder()
				.encodeToString(credentialFile);

		System.out.println(base64Encoded);
	}

	@Test
	public void testConvertClientSecret() throws IOException {
		byte[] clientSecretJson = Files.readAllBytes(
				Paths.get(dataStoreFolder + File.separator +
						AplikasiRegistrasiApplication.CLIENT_SECRET_JSON_FILE));
		String base64Encoded
				= Base64.getEncoder()
				.encodeToString(clientSecretJson);

		System.out.println(base64Encoded);
	}

}
```

Setelah dijalankan, kita akan mendapatkan satu baris string di layar. 

[![Convert Base 64]({{site.url}}/images/uploads/2017/gmail-api/25-convert-base64.png)]({{site.url}}/images/uploads/2017/gmail-api/25-convert-base64.png)

Kita pasang baris ini sebagai environment variable di Heroku seperti ini

[![Environment Variable Heroku]({{site.url}}/images/uploads/2017/gmail-api/24-heroku-environment.png)]({{site.url}}/images/uploads/2017/gmail-api/24-heroku-environment.png)

Kita juga bisa setup environment variable melalui Heroku CLI melalui command line seperti ini

```
heroku config:set CLIENT_SECRET_JSON=blablablayaddayaddayadda
heroku config:set STORED_CREDENTIAL=blablablayaddayaddayadda
```

Kemudian, kita baca environment variable ini pada saat aplikasi dijalankan, dan kita tulis ke file.

```java
public static final String CLIENT_SECRET_JSON_ENV = "CLIENT_SECRET_JSON";
public static final String STORED_CREDENTIAL_ENV = "STORED_CREDENTIAL";
public static final String CLIENT_SECRET_JSON_FILE = "client_secret.json";
public static final String STORED_CREDENTIAL_FILE = "StoredCredential";

@Bean @Profile("heroku")
public GoogleClientSecrets environmentVariableClientSecrets() throws Exception {
    restoreEnvironmentVariableToFile(CLIENT_SECRET_JSON_ENV, CLIENT_SECRET_JSON_FILE);
    restoreEnvironmentVariableToFile(STORED_CREDENTIAL_ENV, STORED_CREDENTIAL_FILE);
    return loadGoogleClientSecrets();
}

private GoogleClientSecrets loadGoogleClientSecrets() throws IOException {
    return GoogleClientSecrets.load(jsonFactory,
            new InputStreamReader(new FileInputStream(dataStoreFolder + File.separator + CLIENT_SECRET_JSON_FILE)));
}

private void restoreEnvironmentVariableToFile(String environmentVariableName, String filename) throws IOException {
    Files.createDirectories(Paths.get(dataStoreFolder));
    Files.write(Paths.get(dataStoreFolder +
                    File.separator + filename),
            Base64.getDecoder().decode(env.getProperty(environmentVariableName)));
}
```

Menurut saya, cara kedua ini lebih _robust_, karena bisa berjalan secara mandiri tanpa perlu setup webserver lain. Juga lebih secure, karena file credential tidak perlu ditaruh di lokasi lain dan tidak perlu dikirim melalui internet.

## Penutup ##

Demikianlah cara menggunakan GMail API untuk mengirim notifikasi email dari aplikasi kita. Source code lengkap ada [di Github](https://github.com/endymuhardin/belajar-gmail-api). Lihat juga [commit history](https://github.com/endymuhardin/belajar-gmail-api/commits/master) untuk urutan implementasi codingnya.

Semoga bermanfaat ;) 