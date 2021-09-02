---
layout: post
title: "Persiapan Coding Flutter"
date: 2021-09-02 07:14
comments: true
categories: 
- flutter
---

Flutter adalah framework pengembangan aplikasi untuk membuat aplikasi Android dan iOS sekaligus. Jadi dengan coding satu kali saja, kita bisa menghasilkan dua versi aplikasi, Android dan iOS. Sebetulnya framework multiplatform seperti ini bukanlah hal yang baru. Di jaman dahulu, kita mengenal PhoneGap (yang sekarang disebut Apache Cordova) dan Sencha Touch. Kemudian yang agak modern ada Ionic dan ReactNative.

Yang membuat Flutter relatif cepat naik daun adalah karena disponsori Google. Iming-iming Google sebagai sponsor utama Android membuat banyak developer yakin dengan adopsi Flutter, minimal di platform Android. Walaupun demikian, Google memiliki _track record_ yang kurang meyakinkan dalam hal framework. Kita sudah melihat apa yang terjadi dengan AngularJS. Setelah banyak yang mengadopsi, kemudian ditulis ulang. Sehingga semua aplikasi yang sudah dibuat dengan AngularJS, harus dibuat ulang dari nol dengan Angular.

Walaupun demikian, sepertinya Flutter ini cukup populer dan masif adopsinya. Sehingga perlu kita explore lebih jauh. Untuk itu, pada artikel ini kita akan membahas tentang persiapan coding Flutter.

<!--more-->

Secara garis besar, kita harus menginstal beberapa kelengkapan di komputer kita untuk bisa membuat aplikasi Flutter, yaitu:

* Flutter SDK
* Editor, dalam artikel ini saya akan pakai Visual Studio Code.
* Java SDK
* Android SDK
* XCode

## Instalasi Flutter SDK ##

Flutter SDK mencakup library flutter dan bahasa pemrograman Dart. Petunjuk instalasinya bisa dibaca [di websitenya](https://flutter.dev/docs/get-started/install). 

Untuk MacOS, saya lebih suka menggunakan `brew`. Berikut perintahnya:

```
brew install --cask flutter
```

Di Ubuntu, berikut adalah perintah untuk instalasi Flutter SDK

```
sudo snap install flutter --classic
```

Instalasi dengan `brew` atau `snap` seharusnya akan menambahkan variabel di `PATH` sehingga kita bisa menjalankan perintah `flutter doctor` di command line. Kalau tidak bisa, coba restart dulu aplikasi Terminalnya. Kalau masih tidak bisa, kita harus setting `PATH` sendiri.

Untuk melakukan setting `PATH`, pengguna MacOS bisa mengedit file `.zshrc` dan pengguna Ubuntu bisa mengedit file `.bashrc` yang ada di `$HOME` masing-masing. Tambahkan baris berikut :

```
export PATH="$PATH:[lokasi-instalasi-flutter]/bin"
```

Setelah Flutter SDK terinstal, jalankan `flutter doctor` untuk mengecek apakah kelengkapan lainnya sudah terinstal atau belum.


```
flutter doctor
```

Outputnya seperti ini

```
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 2.2.3, on macOS 11.5.2 20G95 darwin-arm, locale en-ID)
[!] Android toolchain - develop for Android devices
    ✗ Unable to locate Android SDK.
      Install Android Studio from: https://developer.android.com/studio/index.html
      On first launch it will assist you in installing the Android SDK components.
      (or visit https://flutter.dev/docs/get-started/install/macos#android-setup for detailed instructions).
      If the Android SDK has been installed to a custom location, please use
      `flutter config --android-sdk` to update to that location.

    ✗ No valid Android SDK platforms found in /Users/endymuhardin/Applications/android-sdk/platforms. Directory was empty.
[✓] Xcode - develop for iOS and macOS
[✓] Chrome - develop for the web
[!] Android Studio (not installed)
[✓] IntelliJ IDEA Ultimate Edition (version 2021.2)
[✓] VS Code (version 1.59.1)
[✓] Connected device (1 available)

! Doctor found issues in 2 categories.
```

Output di atas menunjukkan bahwa kita belum menginstal Android SDK.


## Instalasi Android SDK ##

Biasanya, kalau kita mau membuat aplikasi Android, kita perlu menginstal Android Studio. Ukurannya lumayan besar, installernya saja bisa 2GB sendiri. Nanti setelah diinstal, dia akan mengunduh lagi teman-temannya yang ukurannya bisa bergiga-giga. Untuk laptop saya yang cuma memiliki storage 256GB, ini kurang efisien. Lagipula karena kita akan coding Flutter, kita tidak membutuhkan Android Studio secara lengkap. Cukup Android SDK saja.

Untuk menginstal SDKnya saja, kita buka [halaman Download Android Studio](https://developer.android.com/studio#downloads), kemudian scroll ke bawah sampai menemukan `Command line tools only` seperti ini

[![Command line only]({{site.url}}/images/uploads/2021/persiapan-flutter/01-android-sdk-command-line-only.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/01-android-sdk-command-line-only.png)

Ukurannya _hanya_ 100MB saja, bandingkan dengan Android Studio yang bisa mencapai 1GB.

Setelah diunduh, extract filenya ke folder mana saja yang kita sukai. Saya sendiri biasa menaruhnya di `$HOME/Applications/android-sdk/cmdline-tools` seperti ini

[![Hasil download Command line only]({{site.url}}/images/uploads/2021/persiapan-flutter/02-hasil-donlod-command-line-only.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/02-hasil-donlod-command-line-only.png)

Yang barusan kita unduh hanya `Command Line Tools` saja. Untuk melengkapinya, kita perlu menginstal `platform-tools` dan teman-temannya, sesuai dengan versi Android API yang kita akan gunakan. Misalnya kita memakai API level 29. Maka perintahnya seperti ini:

```
sdkmanager "platform-tools" "platforms;android-29" "build-tools;29.0.2" "emulator"
```

Kita juga perlu menginstal `system-image`, yaitu template sistem operasi untuk menjalankan emulator. Pilih yang sesuai dengan laptop yang digunakan. Untuk laptop berprosesor Intel 64 bit, perintahnya sebagai berikut

```
sdkmanager "system-images;android-29;google_apis_playstore;x86"
```

Untuk laptop Macbook Pro M1, perintahnya sebagai berikut

```
sdkmanager "system-images;android-29;google_apis_playstore;arm64-v8a"
```

Android SDK Manager akan mengunduh kelengkapan tersebut, hasilnya setelah unduhan selesai menjadi seperti ini

[![Hasil download Android SDK]({{site.url}}/images/uploads/2021/persiapan-flutter/03-hasil-donlod-android-sdk.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/03-hasil-donlod-android-sdk.png)

Kita coba lagi mengecek status kelengkapan Flutter dengan perintah `flutter doctor`. Sekarang hasilnya seperti ini

```
flutter doctor             
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 2.2.3, on macOS 11.5.2 20G95 darwin-arm, locale en-ID)
[!] Android toolchain - develop for Android devices (Android SDK version 29.0.2)
    ✗ Android license status unknown.
      Run `flutter doctor --android-licenses` to accept the SDK licenses.
      See https://flutter.dev/docs/get-started/install/macos#android-setup for more details.
[✓] Xcode - develop for iOS and macOS
[✓] Chrome - develop for the web
[!] Android Studio (not installed)
[✓] IntelliJ IDEA Ultimate Edition (version 2021.2)
[✓] VS Code (version 1.59.1)
[✓] Connected device (1 available)

! Doctor found issues in 2 categories.
```

Dia bilang kita perlu melakukan `Accept` terhadap lisensi Android SDK. Akan tetapi bila kita jalankan perintah `flutter doctor --android-licenses`, kita akan menemui error seperti ini

```
flutter doctor --android-licenses
Exception in thread "main" java.lang.NoClassDefFoundError: javax/xml/bind/annotation/XmlSchema
	at com.android.repository.api.SchemaModule$SchemaModuleVersion.<init>(SchemaModule.java:156)
	at com.android.repository.api.SchemaModule.<init>(SchemaModule.java:75)
	at com.android.sdklib.repository.AndroidSdkHandler.<clinit>(AndroidSdkHandler.java:81)
	at com.android.sdklib.tool.sdkmanager.SdkManagerCli.main(SdkManagerCli.java:73)
	at com.android.sdklib.tool.sdkmanager.SdkManagerCli.main(SdkManagerCli.java:48)
Caused by: java.lang.ClassNotFoundException: javax.xml.bind.annotation.XmlSchema
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:581)
	at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:178)
	at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:522)
	... 5 more
```

Untuk mengatasinya, kita perlu menggunakan Java versi 8. Agar mudah, gunakan [SDKMan](https://sdkman.io/) dan jalankan perintah berikut:

```
sdk install java 8.0.282-zulu
sdk default java 8.0.282-zulu
```

Restart terminal, kemudian jalankan lagi `flutter doctor --android-licenses`. Flutter akan menginformasikan berapa jumlah lisensi yang harus kita `Accept` 

```
6 of 7 SDK package licenses not accepted. 100% Computing updates...             
Review licenses that have not been accepted (y/N)? y
```

Kemudian kita akan disajikan dengan lisensi berbagai paket yang diinstal oleh Android SDK. Jawab saja `y` semua. 

```
Accept? (y/N): y
All SDK package licenses accepted
```

Setelah itu, jalankan lagi `flutter doctor`. Hasilnya oke semua seperti ini

```
Doctor summary (to see all details, run flutter doctor -v):
[✓] Flutter (Channel stable, 2.2.3, on macOS 11.5.2 20G95 darwin-arm, locale en-ID)
[✓] Android toolchain - develop for Android devices (Android SDK version 29.0.2)
[✓] Xcode - develop for iOS and macOS
[✓] Chrome - develop for the web
[!] Android Studio (not installed)
[✓] IntelliJ IDEA Ultimate Edition (version 2021.2)
[✓] VS Code (version 1.59.1)
[✓] Connected device (1 available)

! Doctor found issues in 1 category.
```

Cuma ada satu warning karena kita belum instal Android Studio. Ini tidak masalah, karena kita akan coding menggunakan Visual Studio Code.

## Instalasi XCode ##

XCode adalah aplikasi yang disediakan Apple untuk membuat aplikasi iOS. Ini dibutuhkan bila kita ingin membuat aplikasi yang berjalan di iPhone dan iPad. Untuk menginstalnya, jalankan perintah berikut di command line

```
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
```

Biasanya para programmer yang menggunakan laptop Macbook sudah menginstal XCode, bukan karena ingin membuat aplikasi iOS, tapi karena butuh `git`.

Setelah diinstal, kita tes menjalankan simulator dengan perintah berikut

```
open -a Simulator
```

XCode akan menjalankan simulator dan menampilkan emulator iPhone.

Kita juga membutuhkan `cocoapods`, yaitu dependency management untuk mengurus library yang kita butuhkan dalam aplikasi. Semacam `maven` untuk iOS development. Berikut perintah untuk instalasinya

```
sudo gem install cocoapods
```

## Setup Visual Studio Code ##

Aplikasi Visual Studio Code bisa diunduh dan diinstal [dari websitenya](https://code.visualstudio.com). Kita perlu mengaktifkan extension Flutter.

[![VSCode Flutter Extension]({{site.url}}/images/uploads/2021/persiapan-flutter/04-extension-vscode-flutter.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/04-extension-vscode-flutter.png)

Kemudian, kita coba membuat project Hello World dulu. Untuk memastikan semua kelengkapan sudah terinstal dengan sempurna. Kita generate project dengan perintah berikut

```
flutter create helloflutter 
```

Selanjutnya, masuk ke folder tersebut, dan jalankan visual studio code di dalamnya

```
cd helloflutter
code .
```

Kita bisa lihat di kanan bawah ada daftar perangkat emulator yang tersedia. Bila belum ada, tulisannya `No Device`.

[![Open Project VSCode]({{site.url}}/images/uploads/2021/persiapan-flutter/05-open-project-no-device.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/05-open-project-no-device.png)

Setelah kita jalankan emulator, maka di pojok kanan bawah akan tampil nama device emulatornya.

[![Simulator iPhone]({{site.url}}/images/uploads/2021/persiapan-flutter/06-simulator-iphone.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/06-simulator-iphone.png)

Aplikasi yang baru saja kita generate bisa langsung dijalankan di emulator. Klik menu Run > Start Debugging untuk menjalankan aplikasi. 

[![Run App]({{site.url}}/images/uploads/2021/persiapan-flutter/07-run-app.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/07-run-app.png)

VS Code akan menanyakan emulator mana yang akan digunakan untuk mengetes aplikasi. Pilih saja device yang kita inginkan.

[![Select Device]({{site.url}}/images/uploads/2021/persiapan-flutter/08-select-device.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/08-select-device.png)

Selanjutnya, VSCode akan melakukan build, dan hasilnya akan dijalankan di emulator. Kita bisa lihat hasilnya sebagai berikut

[![App Display]({{site.url}}/images/uploads/2021/persiapan-flutter/09-app-display.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/09-app-display.png)

Nah, kita bisa melanjutkan coding untuk menambahkan fitur di aplikasi. VS Code juga menyediakan visual editor untuk memudahkan kita dalam mengatur layout komponen.

[![Visual Editor]({{site.url}}/images/uploads/2021/persiapan-flutter/10-visual-editor.png)]({{site.url}}/images/uploads/2021/persiapan-flutter/10-visual-editor.png)

Demikianlah persiapan yang harus kita lakukan untuk mulai membuat aplikasi mobile dengan Flutter. Selanjutnya silahkan cari tutorial di Youtube tentang pengembangan aplikasi dengan Flutter.

Selamat mencoba ... semoga bermanfaat ...