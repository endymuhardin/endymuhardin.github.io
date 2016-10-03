---
layout: post
title: "Silabus Kuliah Pemrograman"
date: 2014-03-05 12:11
comments: true
categories: 
- java
---

Melanjutkan rutinitas 2 tahun terakhir, minggu ini musim perkuliahan semester genap di Universitas Pancasila dimulai. Saya kebagian pegang Pemrograman 2 di kelas reguler, dan Pemrograman 4 di kelas karyawan. Buat para fans yang pengen ketemu dipersilahkan cari saya di Fakultas Teknik Universitas Pancasila setiap Kamis jam 18-21 dan Jumat jam 09-11.

Berikut adalah silabus perkuliahan dari Pemrograman 1 sampai Pemrograman 4. Silabus ini akan sering saya update mengikuti perkembangan jaman.

<!--more-->
<a name="pemrograman-1"></a>
## Pemrograman 1 : Java Fundamental ##

### Tujuan ###
- Paham dasar-dasar pemrograman dengan Java
- Paham cara implementasi OOP dengan Java
- Paham cara menggunakan class-class penting dalam Java SDK

### Batasan ###
- Hanya menggunakan library standar bawaan Java SDK
- Tidak membahas konsep OOP (karena ada mata kuliahnya sendiri)

### Referensi ###
- [Official Java Tutorial, Oracle Corp](http://docs.oracle.com/javase/tutorial/index.html)
- [SDK Documentation, Oracle Corp](http://docs.oracle.com/javase/7/docs/api/index.html)
- [Java Desktop, Ifnu Bima](http://project-template.googlecode.com/files/Java%20Desktop%20-%20Ifnu%20Bima.pdf)

### Kebutuhan Software Lab ###
- Java SDK 1.6
- [Sublime Text 3](http://www.sublimetext.com/)

### Materi Kuliah ###

- Penjelasan Silabus
- Setup / Instalasi Java
- Version Control (Git)
- Github
- Anatomi Aplikasi Java
- Classpath
- Variabel dan Tipe Data
- Operator
- Control Flow (if-else, for/while)
- Class & Object
- Method
- Exception
- Konsep OOP
- Inheritance
- Encapsulation
- Polymorphism
- Abstract Class & Interface
- Composition & Aggregation
- Studi Kasus / Tugas
- Presentasi Kasus

<a name="pemrograman-2"></a>
## Pemrograman 2 : Essential Library ##

### Tujuan ###
* Mahir menggunakan library tambahan dari dunia open source
* Mahir menggunakan development tools Java

### Batasan ###
- Belum membuat user interface

### Kebutuhan Software Lab ###
- Semua requirement dari Pemrograman 1
- [Apache Maven 3](http://maven.apache.org/)
- MySQL Server

### Materi Kuliah ###

- Build Tools
- Automated Test
- Date & Time
- Collections
- JDBC
- String
- Regular Expression
- Multithreading / Concurrency
- File I/O
- Network I/O
- Popular Network Protocol (HTTP, FTP, SMTP, POP, IMAP)
- Studi Kasus

<a name="pemrograman-3"></a>
## Pemrograman 3 : Aplikasi Desktop ##

### Tujuan ###
- Bisa membuat aplikasi lengkap dengan UI Desktop

### Batasan ###
- Aplikasi berjalan lokal
- Penyimpanan data dilakukan lokal
- Interaksi dengan server dilakukan dengan menggunakan service yang sudah tersedia (tidak membuat sendiri)

### Referensi ###
- [Java Desktop, Ifnu Bima](http://project-template.googlecode.com/files/Java%20Desktop%20-%20Ifnu%20Bima.pdf)

### Kebutuhan Software Lab ###
- Sama seperti Pemrograman 2

### Materi Kuliah ###

- Arsitektur Aplikasi Desktop

  - Container
  - Simple Widget
  - Event Handling
  - Data backed Widget

- Hello Swing

- Container
  - [Frame](http://docs.oracle.com/javase/tutorial/uiswing/components/frame.html)
  - [Dialog](http://docs.oracle.com/javase/tutorial/uiswing/components/dialog.html)
  - [Applet](http://docs.oracle.com/javase/tutorial/uiswing/components/applet.html)
  - [Panel](http://docs.oracle.com/javase/tutorial/uiswing/components/panel.html)
  
- [Menu](http://docs.oracle.com/javase/tutorial/uiswing/components/menu.html)

- [Layout Manager](http://docs.oracle.com/javase/tutorial/uiswing/layout/using.html)

  - [Border Layout](http://docs.oracle.com/javase/tutorial/uiswing/layout/border.html)
  - [Grid Layout](http://docs.oracle.com/javase/tutorial/uiswing/layout/grid.html)
  - Flow Layout

- Simple Component

  - Text Field
  - Button
  - Checkbox
  - Radio Button

- [Event Handling](http://docs.oracle.com/javase/tutorial/uiswing/events/index.html)

  - ActionEvent
  - MouseEvent

- Complex Component

  - Combo/Select
  - List
  
- Swing Table

  - JTable
  - TableModel

- [Concurrent Execution](http://docs.oracle.com/javase/tutorial/uiswing/concurrency/index.html)

  - Swing Worker
  - Progress Bar

- Internationalization 

- Jasper Report
  - Parameter
  - Variable
  - Report Datasource
- iReport

- Studi Kasus
 
- Requirement Specification

  - Daftar Fitur
  - Arsitektur
  - Desain UI
  - Desain Database

- Implementasi Frame dan Menu
- Implementasi Dummy Screen
- Implementasi Proses Bisnis
- Implementasi Akses Database
- Implementasi Report

<a name="pemrograman-4"></a>

## Pemrograman 4 : Aplikasi Web ##

### Tujuan ###
- Bisa membuat aplikasi web dengan arsitektur REST
- Bisa menggunakan penyimpanan data non-relasional

### Referensi ###
- [Development Stack ArtiVisi](http://software.endy.muhardin.com/java/development-stack-2014/)

### Kebutuhan Software Lab ###
- Sama seperti Pemrograman 2
- [NodeJS dan Yeoman](http://software.endy.muhardin.com/javascript/persiapan-coding-nodejs/)

### Materi Kuliah ###

- Java Web Application
- Servlet, Filter, Listener
- JSP & JSTL
- Security
- REST
- AngularJS dan Twitter Bootstrap
- Redis
- MongoDB
- Case Study

