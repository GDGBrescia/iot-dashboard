<h1>IoT-dashboard</h1>
<h3>The Internet Of Things Dashboard</h3>
=============
<h4>Introduction</h4>
<p>Usually, Complex automation systems are supplied of poor user interfaces. Often, software engineers don’t dedicate enough attention 
to the usability of system consoles and their panels, because automation system front ends are designed to be used by “skilled” operators.
With the large communication band today available, it’s possible to create distributed computing systems for real-time signals. 
Transferring real-time data over the net allows engineers and scientist to better understand fast phenomena and to control dynamic processes 
more precisely. In this branch of software, a key role is played by the usability and quick response of the user interface.</p>
<hr>
<h4>The Goal</h4>
<p>We simulate a fast production system, capable to generate multiple data per second. the goal is to create a dynamic user interface 
capable to represent real-time phenomena, The open source project has to take advantage of the modern technologies and graphic 
tools available on the net.<br>
Reading and writing data through web services (restful or SOAP) is very easy, but in some cases not the best choice. 
When a critical system is monitored, you have to be sure that:
<ul>
<li>no signal component is left back, to ensure correct data analysis and to log data properly,</li>
<li>no message from the server is lost, to guarantee to remote users the right comprehension of what is going on.</li>
</ul>
<strong>In such cases, the use of direct TCP connections between server and clients (through websockets for Javascript apps) has to 
be taken in right consideration.</strong>
</p>
<hr>
<h4>Communication Library</h4>
<strong>SCCT (Smartphone and Cross-platform Communication Toolkit)</strong> is a communication library created for the automation systems. 
SCCT is capable to transfer data from one server to many clients with direct TCP connections and data are transferred in binary format to optimize 
band consume and CPU utilization. SCCT includes high level primitives that organize received packages into queues with background task, 
and manages communication with the server in an intuitive manner.<br>
SCCT is available of a large set of different platforms: LabVIEW, HTML5, Java, Android, iOs, ANSI-C under Linux.
</p>    
<p><strong>SCCT Documentation </strong><a href="/libscct/doc/SCCT_for_HTML5_user_guide.pdf" target="_blank">SCCT_for_HTML5_user_guide.pdf</a></p>