---
layout: post
title: "Membuat Changelog Liquibase"
date: 2013-01-10 10:03
comments: true
categories: 
- java
---

Di ArtiVisi, kami menggunakan tools bernama [Liquibase](http://liquibase.org/) untuk mendefinisikan skema database. 
Dengan Liquibase ini, skema database dapat disimpan dan dikelola versinya dalam Git. 
Dia juga memiliki fitur untuk melakukan migrasi database pada saat aplikasi kita naik versi. 
Bila terjadi error di versi baru, Liquibase juga bisa melakukan rollback 
agar skema database kita kembali ke kondisi sebelum naik versi.

Skema database dalam Liquibase ditulis dalam format XML, disebut dengan istilah `changelog`. 
Untuk project baru, ini bisa ditulis tangan secara manual, 
tetapi untuk aplikasi yang sudah ada, 
terlalu merepotkan kalau semua tabel yang sudah ada harus ditulis ulang skemanya. 

<!--more-->

Untungnya Liquibase memiliki fitur untuk menulis changelog dari skema yang sudah ada.
Berikut langkah-langkahnya: 

1. Siapkan jar liquibase dan database
2. Siapkan file konfigurasi
3. Jalankan liquibase
4. Cek hasilnya

## Siapkan jar liquibase dan database ##

Database yang akan saya import memiliki konfigurasi sebagai berikut:

* Jenis Database : MySQL
* Nama Database : merchant-simulator_development
* Username Database : root
* Password Database : admin

Untuk itu, saya siapkan dua file jar, yaitu : 

* mysql-connector-java-5.1.22.jar
* liquibase-core-2.0.5.jar

## File Konfigurasi ##

Sebetulnya semua informasi ini bisa disebutkan dalam command line argument. 
Tapi saya lebih suka menulis di file supaya mudah diedit. 
Berikut isinya

```
# liquibase.properties
driver: com.mysql.jdbc.Driver
classpath: mysql-connector-java-5.1.22.jar
url: jdbc:mysql://localhost/merchant-simulator_development
username: root
password: admin
changeLogFile: liquibase-output.xml
```

Simpan file ini dengan nama `liquibase.properties` dan letakkan di folder yang sama dengan kedua file jar tersebut.

## Jalankan Liquibase ##

Mari kita jalankan proses import dengan command berikut:

```
java -jar liquibase-core-2.0.5.jar generateChangelog
```

## Cek Hasilnya ##

Perintah di atas akan menghasilkan file `liquibase-output.xml` yang isinya seperti ini: 

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-2.0.xsd">
    <changeSet author="endy (generated)" id="1357786892853-1">
        <createTable tableName="c_application_config">
            <column name="id" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true"/>
            </column>
            <column name="name" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="label" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="value" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-2">
        <createTable tableName="c_security_menu">
            <column name="id" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true"/>
            </column>
            <column name="label" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="menu_action" type="VARCHAR(255)"/>
            <column name="menu_level" type="INT">
                <constraints nullable="false"/>
            </column>
            <column name="menu_order" type="INT">
                <constraints nullable="false"/>
            </column>
            <column name="menu_options" type="VARCHAR(255)"/>
            <column name="id_parent" type="VARCHAR(255)"/>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-3">
        <createTable tableName="c_security_permission">
            <column name="id" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true"/>
            </column>
            <column name="permission_label" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="permission_value" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-4">
        <createTable tableName="c_security_role">
            <column name="id" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true"/>
            </column>
            <column name="name" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="description" type="VARCHAR(255)"/>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-5">
        <createTable tableName="c_security_role_menu">
            <column name="id_role" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="id_menu" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-6">
        <createTable tableName="c_security_role_permission">
            <column name="id_role" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="id_permission" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-7">
        <createTable tableName="c_security_user">
            <column name="id" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true"/>
            </column>
            <column name="username" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="password" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="fullname" type="VARCHAR(255)"/>
            <column name="active" type="BIT"/>
            <column name="id_role" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-8">
        <createTable tableName="t_tagihan_listrik">
            <column name="id" type="VARCHAR(255)">
                <constraints nullable="false" primaryKey="true"/>
            </column>
            <column name="admin" type="DECIMAL(19,2)">
                <constraints nullable="false"/>
            </column>
            <column name="bulan_tagihan" type="DATE">
                <constraints nullable="false"/>
            </column>
            <column name="current_meter_reading_1" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="current_meter_reading_2" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="current_meter_reading_3" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="denda" type="DECIMAL(19,2)">
                <constraints nullable="false"/>
            </column>
            <column name="id_pelanggan" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="jatuh_tempo" type="DATE">
                <constraints nullable="false"/>
            </column>
            <column name="lunas" type="BIT">
                <constraints nullable="false"/>
            </column>
            <column name="meter_read_date" type="DATE">
                <constraints nullable="false"/>
            </column>
            <column name="mitra_lunas" type="VARCHAR(255)"/>
            <column name="nama_pelanggan" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="nilai" type="DECIMAL(19,2)">
                <constraints nullable="false"/>
            </column>
            <column name="pajak" type="DECIMAL(19,2)">
                <constraints nullable="false"/>
            </column>
            <column name="power_consuming_category" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="previous_meter_reading_1" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="previous_meter_reading_2" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="previous_meter_reading_3" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="referensi_lunas" type="VARCHAR(255)"/>
            <column name="service_unit" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="service_unit_hone" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="subscriber_segmentation" type="VARCHAR(255)">
                <constraints nullable="false"/>
            </column>
            <column name="waktu_lunas" type="DATETIME"/>
        </createTable>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-9">
        <addPrimaryKey columnNames="id_role, id_menu" tableName="c_security_role_menu"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-10">
        <addPrimaryKey columnNames="id_role, id_permission" tableName="c_security_role_permission"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-11">
        <addForeignKeyConstraint baseColumnNames="id_parent" baseTableName="c_security_menu" baseTableSchemaName="merchant-simulator_development" constraintName="fk_menu_parent" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="id" referencedTableName="c_security_menu" referencedTableSchemaName="merchant-simulator_development" referencesUniqueColumn="false"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-12">
        <addForeignKeyConstraint baseColumnNames="id_menu" baseTableName="c_security_role_menu" baseTableSchemaName="merchant-simulator_development" constraintName="fk_role_menu_menu" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="id" referencedTableName="c_security_menu" referencedTableSchemaName="merchant-simulator_development" referencesUniqueColumn="false"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-13">
        <addForeignKeyConstraint baseColumnNames="id_role" baseTableName="c_security_role_menu" baseTableSchemaName="merchant-simulator_development" constraintName="fk_role_menu_role" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="id" referencedTableName="c_security_role" referencedTableSchemaName="merchant-simulator_development" referencesUniqueColumn="false"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-14">
        <addForeignKeyConstraint baseColumnNames="id_permission" baseTableName="c_security_role_permission" baseTableSchemaName="merchant-simulator_development" constraintName="fk_role_permission_permission" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="id" referencedTableName="c_security_permission" referencedTableSchemaName="merchant-simulator_development" referencesUniqueColumn="false"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-15">
        <addForeignKeyConstraint baseColumnNames="id_role" baseTableName="c_security_role_permission" baseTableSchemaName="merchant-simulator_development" constraintName="fk_role_permission_role" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="id" referencedTableName="c_security_role" referencedTableSchemaName="merchant-simulator_development" referencesUniqueColumn="false"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-16">
        <addForeignKeyConstraint baseColumnNames="id_role" baseTableName="c_security_user" baseTableSchemaName="merchant-simulator_development" constraintName="fk_user_role" deferrable="false" initiallyDeferred="false" onDelete="NO ACTION" onUpdate="NO ACTION" referencedColumnNames="id" referencedTableName="c_security_role" referencedTableSchemaName="merchant-simulator_development" referencesUniqueColumn="false"/>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-17">
        <createIndex indexName="name" tableName="c_application_config" unique="true">
            <column name="name"/>
        </createIndex>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-18">
        <createIndex indexName="unique_permission_value" tableName="c_security_permission" unique="true">
            <column name="permission_value"/>
        </createIndex>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-19">
        <createIndex indexName="unique_role_name" tableName="c_security_role" unique="true">
            <column name="name"/>
        </createIndex>
    </changeSet>
    <changeSet author="endy (generated)" id="1357786892853-20">
        <createIndex indexName="unique_user_username" tableName="c_security_user" unique="true">
            <column name="username"/>
        </createIndex>
    </changeSet>
</databaseChangeLog>
```

File di atas siap diedit dan disimpan di repository version control.
Biasanya, edit yang saya lakukan: 

* menggabungkan semua `createTable` menjadi satu changeset
* menggabungkan semua `addForeignKeyConstraint` dan `createIndex` menjadi satu changeset
* menambahkan loader untuk file csv sebagai data awal
* mengganti nama file

