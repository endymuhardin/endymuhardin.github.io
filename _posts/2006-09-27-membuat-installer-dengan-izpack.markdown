---
comments: true
date: 2006-09-27 11:49:25
layout: post
slug: membuat-installer-dengan-izpack
title: Membuat Installer dengan IzPack
wordpress_id: 148
categories:
- java
---

Menggunakan izPack

Setelah kita selesai membuat aplikasi, what next? Tentunya mendistribusikan pada orang yang membutuhkan. Bagaimana caranya agar aplikasi kita mudah digunakan? Langkah pertama adalah dengan cara memudahkan proses instalasi. 
Dalam tulisan ini, kita akan mempelajari cara menggunakan izPack, framework untuk membuat installer aplikasi, sehingga menginstal aplikasi akan semudah menekan tombol Next. 



Para programmer tentunya sudah familiar dengan berbagai framework installer. Ada yang komersil seperti InstallShield, dan ada juga yang gratis seperti [NSIS](http://nsis.sourceforge.net) dan izPack. Kelebihan izPack adalah dia berbasis Java, tidak seperti NSIS yang cuma bisa jalan di Windows. 

Langkah pertama, mari kita [download izPack](http://www.izforge.com/izpack/downloads). IzPack disediakan sebagai installer, sehingga kita harus menginstalnya dulu sebelum bisa digunakan. 

Selanjutnya, mari kita lihat struktur folder project kita yang ingin dibuatkan installernya. Struktur folder saya seperti ini: 

![Struktur folder project ](/images/uploads/2006/09/project-folder-before.png)

Setelah terinstal di komputer pengguna, saya ingin foldernya seperti ini: 

![Hasil yang diinginkan ](/images/uploads/2006/09/project-folder-after.png)

Perhatikan bahwa folder src tidak perlu diikutkan. Pengguna dapat memilih apakah mau menginstal source code atau tidak. Jadi, folder source code adalah optional. Folder dokumentasi dan plugin tambahan juga biasanya diinstal secara optional. 

Berikutnya, tentukan screen yang akan tampil selama proses instalasi, biasanya adalah : 

1. Salam pembukaan, menyatakan kepada pengguna bahwa proses instalasi akan dimulai.
2. Informasi aplikasi, menjelaskan tentang aplikasi dan kegunaannya. 
3. License Agreement
4. Pemilihan paket yang akan diinstal. Di sini pengguna dapat memilih apakah dia akan menginstal paket optional atau tidak.
5. Tujuan instalasi. Pengguna menentukan di folder mana dia akan menginstal. 
6. Proses instalasi. Menunjukkan kemajuan proses instalasi. Biasanya menggunakan progress bar.
7. Instalasi selesai. Menampilkan pesan sukses atau gagal.

Kerangka dari konfigurasi installer kita adalah sebagai berikut : 

    
    
    
        <installation version="1.0">
            <info> </info>
            <guiprefs> </guiprefs>
            <locale> </locale>
            <resources> </resources>
            <panels> </panels>
            <packs> </packs>
        </installation>
        


Isi dari tag info adalah sebagai berikut

    
    
        <info>
            <appname>PlayBilling</appname>
            <appversion>1.1-RC3</appversion>
            <authors>
                <author name="Endy Muhardin" email="endy@artivisi.com"/>
                <author name="Anton Raharja" email="anton@ngoprek.org"/>
            </authors>
            <url>http://playbilling.sourceforge.net</url>
            <javaversion>1.5.0</javaversion>
        </info>
        


Bagian guiprefs menjelaskan tampilan yang akan digunakan. Kita akan pakai native saja, sesuai OS, supaya tampak alami. Kalau mau, kita dapat memilih beberapa tampilan Look & Feel yang tersedia.

    
    
        <guiprefs width="800" height="600" resizable="yes"/>
        


Berikutnya, pilihan bahasa instalasi. Untuk mudahnya, gunakan bahasa Inggris saja. 

    
    
        <locale>
            <langpack iso3="eng" />
        </locale>
    


Untuk bagian resource, kita perlu mendefinisikan file-file yang dibutuhkan installer. File-file ini harus sudah ada. 

    
    
        <resources>
            <res src="installer/application-description.html" id="HTMLInfoPanel.info"/>
            <res src="installer/gpl.txt" id="LicencePanel.licence"/>
        </resources>
        


Tentukan urutan screen seperti sudah dijelaskan di atas. 

    
    
        <panels> 
            <panel classname="HelloPanel"/>
            <panel classname="HTMLInfoPanel"/>
            <panel classname="LicencePanel"/>
            <panel classname="PacksPanel"/>
            <panel classname="TargetPanel"/>
            <panel classname="InstallPanel"/>
            <panel classname="SimpleFinishPanel"/>
        </panels>
    


Bagian packs menentukan folder-folder yang akan diinstal. Sintaksnya mirip dengan Ant.

    
    
        <packs>
            <pack name="Base" required="yes">
                <description>Base System files</description>
                <fileset dir="." targetdir="$INSTALL_PATH">
                    <include name="ext/jetty/*"/>
                    <include name="webapp/**/*"/>
                    <include name="*.sh"/>
                    <include name="*.bat"/>
                </fileset>
            </pack>
            
            <pack name="Source" required="no">
                <description>Source code and test files</description>
                <fileset dir="." targetdir="$INSTALL_PATH">
                    <include name="src/**/*"/>
                    <include name="lib/**/*"/>
                    <include name="*.xml"/>
                </fileset>
            </pack>
        </packs>
    


Variabel $INSTALL_PATH akan diisikan sesuai folder tujuan yang dipilih pengguna.

Ok, file konfigurasi installer kita sudah selesai. Sekarang tinggal diotomasi sehingga bisa dipanggil lewat [Ant](http://ant.apache.org).
Ada beberapa informasi yang dibutuhkan oleh izPack, yaitu: 

*  lokasi konfigurasi instalasi (file xml yang baru saja kita buat)
*  nama file installer yang akan dihasilkan (misalnya MyProject-installer.jar)
*  jenis instalasi (desktop atau web)
*  base folder (folder acuan untuk menentukan lokasi relatif folder yang lain)
*  lokasi instalasi izPack
 
Berikut adalah target untuk Ant

    
    
        <taskdef name="izpack" 
                 classpath="${izpack_install_dir}/lib/compiler.jar"
                 classname="com.izforge.izpack.ant.IzPackTask"
        />
        <target name="build-installer">
            <izpack input="installer/playbilling-installer.xml"
                    output="dist/playbilling-installer.jar"
                    installerType="standard"
                    basedir="."
                    izPackDir="${izpack_install_dir}"
            />
        </target>
    


Setelah Ant target dijalankan, kita akan mendapatkan file playbilling-installer.jar di dalam folder dist. 
Mari kita coba jalankan file installer tersebut. 

    java -jar dist/playbilling-installer.jar
    
Kita akan disodori tampilan selamat datang

![Screen Selamat Datang ](/images/uploads/2006/09/install-screen-1.png)

Klik Next, dan kita akan melihat keterangan tentang [PlayBilling](http://playbilling.sourceforge.net). Keterangan ini langsung dicopy-paste dari homepage PlayBilling

![Deskripsi Aplikasi ](/images/uploads/2006/09/install-screen-2.png)

Next lagi, dan muncullah license agreement, yaitu GPL, yang diambil langsung dari [website GPL](http://www.gnu.org/copyleft/gpl.txt). 

![GPL License ](/images/uploads/2006/09/install-screen-3.png)

Screen selanjutnya adalah pilihan paket yang akan diinstal. Perhatikan bahwa paket wajib diburamkan dan tidak bisa diklik. 

![Pilihan paket instalasi ](/images/uploads/2006/09/install-screen-4.png)

Setelah itu, kita akan ditanya lokasi instalasi. 

![Pilihan lokasi instalasi ](/images/uploads/2006/09/install-screen-5.png)

Pilih lokasi yang sesuai, kemudian Next. Instalasi akan segera dimulai.

![Proses Instalasi ](/images/uploads/2006/09/install-screen-6.png)

Sukses ... !

![Sukses ](/images/uploads/2006/09/install-screen-7.png)

Sebagai bonus, izPack juga akan membuatkan Uninstaller. Coba jalankan 

    java -jar /home/endy/PlayBilling/Uninstaller/uninstaller.jar
    
![Uninstall ](/images/uploads/2006/09/uninstall-screen-1.png)

Klik OK, dan aplikasi akan dihilangkan dari komputer Anda. 

Selamat mencoba. Semoga bermanfaat. 


