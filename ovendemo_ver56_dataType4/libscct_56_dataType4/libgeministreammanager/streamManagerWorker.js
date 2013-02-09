//+ GeminiLab
//  http://www.geminilab.org
//  ver:  v3_scct

var localCopyOfRawDataQueue = new Array();
var LEN_HEADER = 0;
var bufferLettura = "";
var stopReading = false;

var HEADER_ARRIVATO = 0;
var BODY_ARRIVATO   = 1;


self.onmessage = function(evt){
		if(typeof(evt.data)=="object")
		{
			// Devo inventarmi un modo x passare parametri che specificano la lunghezza dell'header 
			// e la funzione che calcola la dimensione del msg
			/*
				Se lo streamManager utilizza i worker, come primo msg manda la dim dell'header
				mediante un obj
			*/
			var obj = evt.data;
			LEN_HEADER  = obj.len_header;
			stopReading = false;
			popBytes(LEN_HEADER, headerArrived);
			
		}
		else
		{
			// Qui arrivano dati da accodare provenienti dal socket
			localCopyOfRawDataQueue.push(evt.data);	
		}
		
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


var tipoMessaggioChiamante = [HEADER_ARRIVATO,""];

function headerArrived(head)
{
	
	// Chiamo la funzione che trova la lunghezza del pacchetto 
	var obj = new headerInfo(head);
	
	var len = obj.len;
	
	tipoMessaggioChiamante[0] = HEADER_ARRIVATO;
	tipoMessaggioChiamante[1] = head;
	tipoMessaggioChiamante[2] = obj;	// passo i parametri alla funzione di gestione del body
	
	postMessage(tipoMessaggioChiamante);
	
	if(!stopReading)
		popBytes(len, bodyArrived /* passare parametri */);
	
}


function bodyArrived(body)
{
	//postMessage(body);
	tipoMessaggioChiamante[0] = BODY_ARRIVATO;
	tipoMessaggioChiamante[1] = body;
	
	postMessage(tipoMessaggioChiamante);
	
	if(!stopReading)
		popBytes(LEN_HEADER,headerArrived /* passare parametri */);
}

/* ************************************************************************************ */
// Funzione presente nell'scct 
// per uno stream Generico, la cosa importante è che vi sia sempre la proprietà len
function headerInfo(head){
	// Questa proprietà deve sempre esistere perchè usata dentro l'obj streamManager
	this.len 	   = (head.charCodeAt(0)*256*256*256) + (head.charCodeAt(1)*256*256) + (head.charCodeAt(2)*256) + head.charCodeAt(3);
	
	var packageNum = (head.charCodeAt(4)*256*256*256) + (head.charCodeAt(5)*256*256) + (head.charCodeAt(6)*256) + head.charCodeAt(7);
	var chkSum     = (head.charCodeAt(8)*256*256*256) + (head.charCodeAt(9)*256*256) + (head.charCodeAt(10)*256) + head.charCodeAt(11); 
	var format 	   =  head.charCodeAt(12);
	
	var crpt 	   = false;
	if (head.charCodeAt(13)==1) 
		crpt = true;
	else 
		crpt = false;
	
	this.packageNumber = packageNum;
	this.checkSum 	   = chkSum;
	this.dataFormat    = format;
	this.crypt 		   = crpt;
	
}
/* ************************************************************************************ */
