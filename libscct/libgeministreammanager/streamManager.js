//+ GeminiLab
//  http://www.geminilab.org
//  ver:  v3_scct

function StreamManager(lenHeader,headerInfoManager,headerArrivedCallback,bodyArrivedCallback,streamManagerPath)
{
	var worker = null;
	
	var localCopyOfRawDataQueue = new Array();
	var LEN_HEADER = lenHeader;
	
	var HEADER_ARRIVATO = 0;
	var BODY_ARRIVATO   = 1;
	
	var bufferLettura = "";
	var stopReading = false;
	
	this.headerArrivedCbk = headerArrivedCallback;
	this.bodyArrivedCbk   = bodyArrivedCallback; 
	this.getHeaderInfo    = headerInfoManager;
	
	var self = this;
	
	if (navigator.userAgent.indexOf("Chrome")>=0 && window.location.href.indexOf("file:///")<0){
		// Se sono chrome uso i worker... firefox ha problemi nella gestione dei worker
		
		if(streamManagerPath==null)
			var streamManagerPath	= "streamManager";		
		worker = new Worker(streamManagerPath +"/" + "streamManagerWorker.js");
		
		worker.onmessage = function(evt){
				if(evt.data[0] == HEADER_ARRIVATO)
				{
					if(self.headerArrivedCbk!=null)
						self.headerArrivedCbk(evt.data[1]);
				}
				else
				{
					if(self.bodyArrivedCbk!=null)
						self.bodyArrivedCbk(evt.data[1],evt.data[2]); // evt.data[1]: body , evt.data[2] params
				}
			}
		
		var obj = {'len_header': LEN_HEADER };
		// mando i parametri al worker
		worker.postMessage(obj);
		
	}
	
	this.pushData= function(data){
		if(worker!=null)
			worker.postMessage(data);
		else 
			localCopyOfRawDataQueue.push(data);
	}

	function popBytes(n,funzione,params)
	{
		var len = 0;
				
		var len = localCopyOfRawDataQueue.length;
		for(var i=0;i<len;i++)
		{
			bufferLettura += localCopyOfRawDataQueue.shift(1);
			if(bufferLettura.length > n)
				break;
		}
		
		if(bufferLettura.length < n)
		{
			setTimeout(function(){popBytes(n,funzione,params)},10);
		}
		else
		{
			if(bufferLettura.length > n)
			{
				var sTmp = bufferLettura.substring(n);
				localCopyOfRawDataQueue.unshift(sTmp);
				bufferLettura = bufferLettura.substring(0,n);
			}
			var str = bufferLettura;
			bufferLettura = "";
			if(params==null)
				funzione(str);
			else
				funzione(str,params); // solo la funzione bodyArrived vuole parametri
		}
	}

	function headerArrived(head)
	{
		if(self.headerArrivedCbk!=null)
			self.headerArrivedCbk(head);
		
		// Chiamo il costruttore che crea l'obj x recuperare info del pacchetto
		var obj =  new self.getHeaderInfo(head);
		
		var len = obj.len;
		// Ricavo tutti i parametri che serviranno al body per ricostruire e controllare il messaggio
		// e costruisco un oggetto che sarà passato alla funzione contenente tutte le info 
		
		if(!stopReading)
			popBytes(len, bodyArrived ,obj /* passo l'oggetto contenente tutte le info */);
		
	}
	
	// La funzione body riceve in ingresso anche i parametri necessari alla funz di gestione del body
	// ad es. nella scct nel head è contenuto il crc e il metodo crittografico che devo passare
	// alla funzione di gestione del body per decodificarlo e controllarne la validità
	function bodyArrived(body,params)
	{
		if(self.bodyArrivedCbk!=null)
			self.bodyArrivedCbk(body,params);
		
		if(!stopReading)
			popBytes(LEN_HEADER,headerArrived,null);
	}
	
	this.start= function()
	{
		if(worker==null)
		{
			popBytes(LEN_HEADER,headerArrived,null);
			stopReading = 0;
		}
	}
	
	this.stop= function()
	{
		stopReading = 1;
	}
	
		
}


