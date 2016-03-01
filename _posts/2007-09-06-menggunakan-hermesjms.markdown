---
comments: true
date: 2007-09-06 11:37:59
layout: post
slug: menggunakan-hermesjms
title: Menggunakan HermesJMS
wordpress_id: 262
categories:
- java
---

Kalau kita ingin membuat aplikasi menggunakan database, tentunya hal pertama yang kita lakukan adalah menginstal server database. Selanjutnya, langkah kedua adalah menginstal aplikasi untuk mengelola database. Paling tidak, kita harus bisa membuat tabel, melihat isi tabel, mengisi ataupun menghapus data ke dalam tabel. 

Demikian juga kalau kita membangun aplikasi menggunakan JMS (Java Messaging Service). Sebelum membuat Hello JMS, terlebih dulu kita harus menginstal JMS server dan aplikasi yang dapat melihat isi JMS Server tersebut. 

Pada artikel kali ini, kita akan menginstal JMS Server [ActiveMQ](http://activemq.apache.org/) dan aplikasi pengelolaan JMS yang bernama [HermesJMS](http://www.hermesjms.com/confluence/display/HJMS/Home).

ActiveMQ dan HermesJMS dapat diunduh di websitenya masing-masing. 

Setelah diunduh, terlebih dulu kita instal ActiveMQ. Caranya sangat gampang, cukup diekstrak saja. Saya meletakkannya di folder `/opt`


    
    <code>cd /opt
    sudo tar xvzf apache-activemq-4.1.1.tar.gz
    </code>



Setelah diekstrak, kita bisa langsung jalankan dari folder instalasinya. 

    
    <code>cd /opt/apache-activemq-4.1.1
    bin/activemq</code>



Kalau sukses, akan muncul log message seperti ini:

    
    <code>INFO  TransportServerThreadSupport   - Listening for connections at: tcp://sweetdreams:61616
    INFO  TransportConnector             - Connector openwire Started
    INFO  TransportServerThreadSupport   - Listening for connections at: ssl://sweetdreams:61617
    INFO  TransportConnector             - Connector ssl Started
    INFO  TransportServerThreadSupport   - Listening for connections at: stomp://sweetdreams:61613
    INFO  TransportConnector             - Connector stomp Started
    INFO  NetworkConnector               - Network Connector default-nc Started
    INFO  BrokerService                  - ActiveMQ JMS Message Broker (localhost, ID:sweetdreams-32991-1188983887811-1:0) started
    </code>



Server kita sudah siap diakses di port 61616.

Sekarang kita akan menginstal HermesJMS. Inipun instalasinya tidak sulit, cukup jalankan saja installernya. 

    
    <code>java -jar hermes-installer-1.12.jar</code>



Nantinya akan muncul layar instalasi. Klik saja Next ... Next ... seperti biasa sampai selesai.

Setelah Hermes berhasil diinstal, jalankan Hermes. Berikut adalah tampilan awalnya. 
[![Hello Hermes ](/images/uploads/2007/09/hello-hermes.png)](/images/uploads/2007/09/hello-hermes.png)

Selanjutnya, kita akan menambahkan koneksi ke server ActiveMQ kita. 
Buka menu Options - Preferences, kemudian pilih tab Classpath di sisi bawah panel.
[![Belum ada classpath group ](/images/uploads/2007/09/no-classpath.png)](/images/uploads/2007/09/no-classpath.png)

Selanjutnya, klik kanan di panel kosong tersebut 
dan masukkan classpath group baru bernama ActiveMQ. 
[![Tambah Classpath Group ](/images/uploads/2007/09/add-classpath.png)](/images/uploads/2007/09/add-classpath.png)

Nanti akan muncul entri ActiveMQ dengan tab dibawahnya yang bertulisan Library. 
Klik kanan **tepat pada tulisan Library** dan pilih Add Jar. 
Kita harus menambahkan beberapa jar berikut: 




  * apache-activemq-4.1.1.jar


  * backport-util-concurrent-2.1.jar


  * geronimo-j2ee-management_1.0_spec-1.0.jar



Semua file tersebut dapat ditemukan di lokasi instalasi ActiveMQ.

Setelah konfigurasi dilakukan, layar tampilannya akan tampak seperti ini: 
[![Classpath ActiveMQ ](/images/uploads/2007/09/classpath-activemq.png)](/images/uploads/2007/09/classpath-activemq.png)

Tutup layar Preference, dan buka lagi. 
Entah kenapa kalau tidak ditutup dulu, pilihan ActiveMQ tidak akan keluar.

Di layar Preference tab Session, ketikkan nama Session yang baru, yaitu ActiveMQ. 
Klik Apply, nantinya Hermes akan menanyakan apakah ini session baru atau bukan. 
Jawab saja, "Ya, ini adalah session baru".

Selanjutnya, ganti pilihan Loader menjadi ActiveMQ, dan pilih ActiveMQ Connection Factory pada pilihan Class.
Hasilnya akan nampak seperti ini: 
[![Session Baru ActiveMQ ](/images/uploads/2007/09/session-activemq.png)](/images/uploads/2007/09/session-activemq.png)

Setelah selesai, session ActiveMQ akan muncul di panel sebelah kiri. 
[![Konfigurasi Session ActiveMQ ](/images/uploads/2007/09/session-activemq-configured.png)](/images/uploads/2007/09/session-activemq-configured.png)

Kita bisa membuat queue baru di session tersebut. Gunakan tombol Create New Queue.
[![Membuat Queue ](/images/uploads/2007/09/queue-new.png)](/images/uploads/2007/09/queue-new.png)

Pembuatan queue pada layar ini bersifat sementara. Artinya, bila HermesJMS dimatikan, Queuenya akan hilang. Untuk membuat Queue yang permanen, kita dapat mendefinisikannya pada layar konfigurasi session.

Queue yang sudah dibuat dapat dilihat di panel sebelah kiri.
[![Queue Browser ](/images/uploads/2007/09/queue-browse.png)](/images/uploads/2007/09/queue-browse.png)

Pada queue yang sudah terbentuk, kita bisa mengirim Text Message. 
Gunakan menu Messages - Send TextMessages. Kita harus memilih satu text file untuk dikirim.

Setelah pengiriman selesai dilakukan, refresh tampilan sehingga message baru tersebut muncul. 
[![Browse Message ](/images/uploads/2007/09/queue-browse-message.png)](/images/uploads/2007/09/queue-browse-message.png)

Kita dapat mengambil message tersebut dengan menggunakan kode program Java sebagai berikut. 

    
    <code>package tutorial.jms;
    
    import javax.jms.Connection;
    import javax.jms.ConnectionFactory;
    import javax.jms.JMSException;
    import javax.jms.Message;
    import javax.jms.MessageConsumer;
    import javax.jms.Queue;
    import javax.jms.Session;
    import javax.jms.TextMessage;
    
    import org.apache.activemq.ActiveMQConnection;
    import org.apache.activemq.ActiveMQConnectionFactory;
    
    public class HelloQueueReceiver {
    	public static void main(String[] args) throws Exception {
    		ConnectionFactory factory = new ActiveMQConnectionFactory(
    				ActiveMQConnection.DEFAULT_USER,
    				ActiveMQConnection.DEFAULT_PASSWORD,
    				ActiveMQConnection.DEFAULT_BROKER_URL);
    		System.out.println("Connecting to: "+ActiveMQConnection.DEFAULT_BROKER_URL);
    		System.out.println("With username : "+ActiveMQConnection.DEFAULT_USER);
    		System.out.println("and password : "+ActiveMQConnection.DEFAULT_PASSWORD);
    		
    		Connection conn = factory.createConnection();
    		System.out.println("Connected");
    		
    		Session sess = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
    		System.out.println("Session created");
    		
    		Queue destination = sess.createQueue("coba");
    		System.out.println("Queue created");
    		
    		MessageConsumer consumer = sess.createConsumer(destination);
    		System.out.println("Consumer created");
    		
    		System.out.println("Fetching message");
    		conn.start();
    		int counter = 1;
    		while(true) {			
    			Message msg = consumer.receive(1000);
    			if (msg == null) break;
    			System.out.println("Retrieving message #"+counter++);
    			System.out.println("Message fetched");
    			if (msg instanceof TextMessage) {
    				TextMessage txtmsg = (TextMessage) msg;
    				System.out.println("Message ID: "+txtmsg.getJMSMessageID());
    				System.out.println("Message Content: "+txtmsg.getText());
    			}
    		}
    		
    		
    		System.out.println("Closing connections");
    		consumer.close();
    		sess.close();
    		conn.close();
    		System.out.println("All closed");
    	}
    }
    </code>



Setelah kode program di atas dijalankan, refresh queue browser di Hermes. Harusnya pengambilan message tersebut akan menghapus message di server. 


Kita juga bisa mengirim message menggunakan kode program berikut. 

    
    <code>package tutorial.jms;
    
    import javax.jms.Connection;
    import javax.jms.ConnectionFactory;
    import javax.jms.JMSException;
    import javax.jms.MessageProducer;
    import javax.jms.Queue;
    import javax.jms.Session;
    import javax.jms.TextMessage;
    
    import org.apache.activemq.ActiveMQConnection;
    import org.apache.activemq.ActiveMQConnectionFactory;
    
    public class HelloQueueSender {
    	public static void main(String[] args) throws JMSException {
    		ConnectionFactory factory = new ActiveMQConnectionFactory(
    				ActiveMQConnection.DEFAULT_USER,
    				ActiveMQConnection.DEFAULT_PASSWORD,
    				ActiveMQConnection.DEFAULT_BROKER_URL);
    		System.out.println("Connecting to: "+ActiveMQConnection.DEFAULT_BROKER_URL);
    		System.out.println("With username : "+ActiveMQConnection.DEFAULT_USER);
    		System.out.println("and password : "+ActiveMQConnection.DEFAULT_PASSWORD);
    		
    		Connection conn = factory.createConnection();
    		System.out.println("Connected");
    		
    		Session sess = conn.createSession(false, Session.AUTO_ACKNOWLEDGE);
    		System.out.println("Session created");
    		
    		Queue destination = sess.createQueue("coba");
    		System.out.println("Queue created");
    		
    		MessageProducer prod = sess.createProducer(destination);
    		TextMessage msg = sess.createTextMessage();
    		msg.setText("Hello JMS");
    		
    		prod.send(msg);
    		System.out.println("Message sent");
    		
    		prod.close();
    		sess.close();
    		conn.close();
    	}
    }
    </code>



Setelah kode program di atas dijalankan, kita dapat merefresh queue browser di Hermes untuk memastikan bahwa kode program kita berhasil mengirim message.

Demikianlah, dengan menggunakan HermesJMS, kita dapat memeriksa secara visual apakah kode program kita dapat mengakses JMS Server dengan benar.
