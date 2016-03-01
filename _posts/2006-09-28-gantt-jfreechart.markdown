---
comments: true
date: 2006-09-28 15:33:24
layout: post
slug: gantt-jfreechart
title: Membuat Gantt Chart dengan JFreeChart
wordpress_id: 150
categories:
- java
---

[JFreeChart](http://www.jfree.org/jfreechart/ "Homepage JFreeChart") adalah library untuk menghasilkan chart dengan Java. Berbagai chart bisa dihasilkan, dari Pie Chart, Bar Chart, dan sebagainya. 

Pada artikel ini, kita akan mencoba membuat Gantt Chart. Gantt chart adalah diagram yang menunjukkan rangkaian task, tanggal mulai, selesai, dan persentase kemajuannya. Bagi mereka yang pernah menggunakan aplikasi manajemen proyek pasti tau apa itu Gantt Chart. 



Berikut output yang kita inginkan
[![Gantt Chart ](/images/uploads/2006/09/gantt.png)](/images/uploads/2006/09/gantt.png)

Diagram di atas dihasilkan dari sumber data sebagai berikut







  
Aktivas		| Tanggal Mulai		| Tanggal Selesai	| Persentase Selesai
----------------|-----------------------|-----------------------|-------------------
UML Design 	| 01-01-2006		| 03-01-2006		| 100 %
Coding 		| 02-01-2006		| 03-01-2006		| 75 %
Testing 	| 03-01-2006		| 14-01-2006		| 50 %
Integrate 	| 04-01-2006		| 25-01-2006		| 25 %





Untuk mengubah data tersebut menjadi chart, berikut langkah-langkah dan kode yang digunakan. 

Pertama, kita harus buat data tersebut menjadi Task object. 

    Task design = new Task("UML Design", toDate("01-01-2006"), toDate("03-01-2006"));
    Task coding = new Task("Coding", toDate("02-01-2006"), toDate("03-01-2006"));
    Task test = new Task("Testing", toDate("03-01-2006"), toDate("14-01-2006"));
    Task commit = new Task("Integrate", toDate("04-01-2006"), toDate("25-01-2006"));

Untuk memudahkan konversi tanggal, saya buat method seperti ini 

    private static Date toDate(String date) throws ParseException {
        return formatter.parse(date);
    }

kemudian, kita set persentase kemajuan task.

    design.setPercentComplete(1);		
    coding.setPercentComplete(0.75);
    test.setPercentComplete(0.50);
    commit.setPercentComplete(0.25);

Task dapat dikelompokkan menjadi TaskSeries. 

    TaskSeries codingTasks = new TaskSeries("Coding Activities");
    codingTasks.add(design);
    codingTasks.add(coding);
    codingTasks.add(test);
    codingTasks.add(commit);

Dan kumpulan TaskSeries disebut TaskCollection

    TaskSeriesCollection allTasks = new TaskSeriesCollection();
    allTasks.add(codingTasks);

TaskCollection ini digunakan untuk membuat chart. 

    JFreeChart chart = ChartFactory.createGanttChart("Coba Gantt Chart", "Task", "Tanggal", allTasks, false, false, false);

Terakhir, kita gambar chart menjadi file PNG

    ChartUtilities.saveChartAsPNG(new File("output/gantt.png"), chart, 400, 300);

Selain menjadi PNG, kita juga bisa menghasilkan file JPEG

    ChartUtilities.saveChartAsJPEG(new File("output/gantt.jpg"), chart, 400, 300);

Demikianlah cara membuat chart dengan JFreeChart. Selain Gantt chart masih banyak lagi fitur JFreeChart yang bagus. Silahkan download dan coba
