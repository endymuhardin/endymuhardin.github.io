---
comments: true
date: 2009-06-16 10:56:28
layout: post
slug: integrasi-pusat-cabang-3
title: Integrasi aplikasi kantor pusat dan cabang [Bagian 3]
wordpress_id: 470
categories:
- java
---

Pada artikel sebelumnya, kita telah membahas tentang [konsep integrasi aplikasi](http://endy.artivisi.com/blog/java/integrasi-pusat-cabang-1/), dan [implementasinya menggunakan Spring Integration](http://endy.artivisi.com/blog/java/integrasi-pusat-cabang-2/). Contoh implementasi kita kemarin, walaupun mencakup integrasi end-to-end, masih sangat sederhana. 

Kali ini kita akan mengeksplorasi use-case yang lebih kompleks, yaitu cara menangani berbagai operasi service. Misalnya untuk tipe data yang sama, contohnya Penjualan, kita memiliki service untuk simpan dan hapus. Object penjualan juga lebih kompleks daripada object produk. 

Untuk memecahkan masalah ini, kita menggunakan Router. Router bertugas memilih channel sesuai dengan message yang datang. Berikut skema penggunaan router. 


![Skema Penggunaan Router ](/images/uploads/2009/06/router-demo-300x91.png)

Sebelum membahas tentang router, baiklah kita lihat dulu data penjualan yang akan dikirim. Berikut class penjualan



#### Penjualan



    
    
    public class Penjualan {
        private Integer id;
        private Date tanggal = new Date();
        private List<PenjualanDetail> details = new ArrayList<PenjualanDetail>();
        // getter dan setter
    }
    



Berikutnya, penjualan detail. 



#### PenjualanDetail



    
    
    public class PenjualanDetail {
        private Integer id;
        private Penjualan penjualan;
        private Produk produk;
        private Integer jumlah;
        
        // getter dan setter
    }
    



Object baru ini tentu saja harus kita buatkan transformernya untuk mengkonversi object menjadi JSON. 



#### CabangService



    
    
    public class JsonTransformer{
        public Penjualan jsonToPenjualan(String json){
            Map<String , Class> binding = new HashMap<String , Class>();
            binding.put("details", PenjualanDetail.class);
            return (Penjualan) JSONObject.toBean(JSONObject.fromObject(json), Penjualan.class, binding);
        }
    
        public String penjualanToJson(Penjualan p){
            // remove dulu cyclic dependency
            for (PenjualanDetail detail : p.getDetails()) {
                detail.setPenjualan(null);
            }
    
            return JSONObject.fromObject(p).toString();
        }
    }
    



Penjualan dan PenjualanDetail akan kita proses melalui method simpan dan hapus yang ada di CabangService. 



#### CabangService



    
    
    public class CabangService {
        public void save(Penjualan p) {
            System.out.println("Simpan penjualan dengan ID : "+p.getId());
            System.out.println("Tanggal : "+new SimpleDateFormat("dd MMM yyyy").format(p.getTanggal()));
            System.out.println("Details : ");
            for (PenjualanDetail detail : p.getDetails()) {
                System.out.println("Produk : "+detail.getProduk().getKode());
                System.out.println("Jumlah : "+detail.getJumlah());
            }
        }
    
        public void delete(Penjualan p) {
            System.out.println("Hapus penjualan dengan ID : "+p.getId());
        }
    }
    



Tentunya nanti method save dan delete ini akan lebih canggih dari ini, misalnya insert dan delete ke database. 

Kalau kita lihat skemanya, ada satu titik di mana message akan dilihat dan disalurkan ke channel yang sesuai. 

![Routing Message ](/images/uploads/2009/06/router-only-300x104.png)

Penjualan yang akan disimpan dimasukkan ke channel penjualan-simpan. Sedangkan object penjualan yang akan dihapus dimasukkan ke channel penjualan-hapus. Dengan demikian, kita harus membuat router yang mampu menentukan channel yang akan dipilih dengan melihat message yang masuk ke dalam router tersebut. Operasi yang akan dilakukan (simpan atau hapus) harus dimasukkan ke message header atau message content. Agar sederhana, kita tambahkan saja satu property di class Penjualan untuk menentukan operasi yang akan dilakukan. Bila class Penjualan ini dimapping menggunakan JPA, kita bisa menandai property ini dengan anotasi @Transient agar isinya tidak disimpan di database. 

Karena nantinya property operasi ini akan digunakan tidak saja untuk Penjualan, tapi juga transaksi lainnya, baiklah kita buat saja di superclass DomainObject sebagai berikut. 



#### Penjualan



    
    
    public class DomainObject {
        private String operasi;
    }
    



Berikut class Penjualan yang sudah dimodifikasi. 



#### Penjualan



    
    
    public class Penjualan extends DomainObject {
        private Integer id;
        private Date tanggal = new Date();
        private List<PenjualanDetail> details = new ArrayList< <PenjualanDetail>();
        
        // getter dan setter
    }



Property operasi ini akan dilihat oleh router untuk menentukan nama channel. Berikut implementasi Router. 



#### Router



    
    
    public class NamaKelasDanOperasiRouter {
        public String pilihChannel(Object msg){
            String classname = msg.getClass().getSimpleName().toLowerCase();
    
            if(!DomainObject.class.isAssignableFrom(msg.getClass())) {
                throw new IllegalArgumentException("Harus object bertipe : "+DomainObject.class.getName());
            }
    
            DomainObject obj = (DomainObject) msg;
            String operasi = obj.getOperasi().toLowerCase();
    
            return classname + "-" + operasi;
        }
    }
    



Router ini akan membaca nama class dari object yang diterimanya dan menggabungkannya dengan property operasi. Jadi, object Penjualan dengan operasi simpan akan menghasilkan nama channel penjualan-simpan. Demikian juga object Pembelian dengan operasi hapus akan menghasilkan channel pembelian-hapus. 

Berikut unit test untuk router di atas. 



#### Router



    
    
    public class NamaKelasDanOperasiRouterTest {
    
        @Test
        public void testPilihChannel() {
            Penjualan p = new Penjualan();
            p.setOperasi("simpan");
            assertEquals("penjualan-simpan", new NamaKelasDanOperasiRouter().pilihChannel(p));
        }
    
    }
    



Berikut aliran message mulai dari gateway sampai menjadi JSON. 

![Dari Gateway sampai menjadi JSON ](/images/uploads/2009/06/gateway-to-json-300x31.png)

Dan ini adalah konfigurasi Spring Integration untuk flow di atas. 



#### Gateway ke JSON



    
    
    <gateway id="gateway"
        service-interface="com.artivisi.explore.spring.integration.gateway.Gateway"
        default-request-channel="outgoingPenjualan"
    />
    
    <channel id="outgoingPenjualan"/>
    
    <transformer 
        input-channel="outgoingPenjualan" 
        output-channel="outgoingJson"
        ref="jsonTransformer" 
        method="penjualanToJson"
    />
    
    <channel id="outgoingJson"/>
    



Pada artikel sebelumnya, kita mengganti implementasi email dengan shared folder supaya proses development lebih cepat. Akses ke shared folder jauh lebih cepat daripada email yang dibatasi oleh kecepatan internet. Kali ini, kita akan menggunakan bridge, yaitu hubungan langsung antar channel. Ini kita gunakan untuk menghubungkan channel outgoingJson dengan incomingJson. Hubungan ini pada artikel sebelumnya diimplementasikan menggunakan shared folder dan email. 

![bridge antara incoming dan outgoing ](/images/uploads/2009/06/bridge-300x45.png)

Berikut konfigurasi bridge untuk menghubungkan outgoingJson dan incomingJson. 



#### Bridge



    
    
    <bridge 
        input-channel="outgoingJson" 
        output-channel="incomingJson" 
    />
    



Dari incomingJson, kita konversi dulu menjadi object.
Berikut konfigurasinya. 



#### JSON ke Object



    
    
    <channel id="incomingJson"/>
    
    <transformer 
        input-channel="incomingJson" 
        output-channel="incomingPenjualan"
        ref="jsonTransformer" 
        method="jsonToPenjualan"
    />
    



Setelah menjadi object, kita masukkan ke router untuk ditentukan channelnya. 



#### Routing



    
    
    <router 
        input-channel="incomingPenjualan" 
        ref="namaKelasDanOperasiRouter" 
        method="pilihChannel"
    />
    



Kemudian, dari channel kita sambungkan ke method save dan delete. 



#### Method Save



    
    
    <channel id="penjualan-simpan"/>
    
    <service-activator 
        input-channel="penjualan-simpan"
        ref="cabangService"
        method="save"/>
    





#### Method Delete



    
    
    <channel id="penjualan-hapus"/>
    
    <service-activator 
        input-channel="penjualan-hapus"
        ref="cabangService"
        method="delete"/>
    



Terakhir, kita buat class untuk menjalankan semua rangkaian integrasi ini. 



#### CabangRouterDemo



    
    
    public class CabangRouterDemo {
        public static void main(String[] args) {
             // 1. Menginstankan Spring Application Context
            AbstractApplicationContext ctx 
                = new ClassPathXmlApplicationContext("cabang-router-ctx.xml", CabangRouterDemo.class);
            ctx.registerShutdownHook();
            Gateway gw = (Gateway) ctx.getBean("gateway");
            Penjualan p1 = bikinTransaksi(100, "simpan");
            Penjualan p2 = bikinTransaksi(102, "hapus");
    
            gw.send(p1);
            gw.send(p2);
    
            System.exit(0);
        }
    
        private static Penjualan bikinTransaksi(Integer id, String operasi) {
            Penjualan p = new Penjualan();
            p.setId(id);
            p.setOperasi(operasi);
    
            Produk pr1 = new Produk(1001, "PR-001", "Produk 001");
            Produk pr2 = new Produk(1002, "PR-002", "Produk 002");
            Produk pr3 = new Produk(1003, "PR-003", "Produk 003");
    
            PenjualanDetail pd1 = new PenjualanDetail(11, pr1, 1);
            PenjualanDetail pd2 = new PenjualanDetail(12, pr2, 2);
            PenjualanDetail pd3 = new PenjualanDetail(13, pr3, 3);
    
            p.addPenjualanDetail(pd1);
            p.addPenjualanDetail(pd2);
            p.addPenjualanDetail(pd3);
    
            return p;
        }
    }
    



Demikianlah penggunaan routing dengan Spring Integration. Seperti kita lihat, dengan menggunakan Spring Integration, aplikasi kita menjadi fleksibel dan mudah ditest. Semua implementasi kode program Java, baik itu transformer, router, dan service method, bisa ditest dengan mudah menggunakan JUnit. Kita juga lihat bahwa semua kode program Java kita tidak memiliki ketergantungan terhadap Spring Integration. 
