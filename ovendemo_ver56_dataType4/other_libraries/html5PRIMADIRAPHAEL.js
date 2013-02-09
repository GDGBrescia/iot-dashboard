var temperatureLine;
var temperatureData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

function creaLinea(){
	temperatureLine = new RGraph.Line('line9', temperatureData);
	temperatureLine.Set('chart.background.barcolor1', 'black');
	temperatureLine.Set('chart.background.barcolor2', 'black');
	temperatureLine.Set('chart.key', ['Temperature']);
	temperatureLine.Set('chart.colors', ['#00FF00']);
	temperatureLine.Set('chart.key.shadow.color', 'black');
	temperatureLine.Set('chart.key.rounded', true);
	temperatureLine.Set('chart.linewidth', 3);
	temperatureLine.Set('chart.key.position', 'graph');
	
	RGraph.Clear(temperatureLine.canvas,"white");
	
	pressureLine = new RGraph.Line('line9', pressureData);
	pressureLine.Set('chart.key', ['Pressure']);
	pressureLine.Set('chart.yaxispos', 'right');
	pressureLine.Set('chart.linewidth', 3);
	pressureLine.Set('chart.colors', ['#FF0000']);
	pressureLine.Set('chart.background.grid', false);
	
	disegna();
	
}


function disegna()
{
	RGraph.Clear(temperatureLine.canvas,"white");
	temperatureLine.original_data[0] = temperatureData;
	temperatureLine.Draw();
	
	pressureLine.original_data[0] = pressureData;
	pressureLine.Draw();
}



var pressureLine;
var pressureData =    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var count=0;


function pushNuovoValore(valore,valore2)
{
	temperatureData.shift();
	temperatureData.push(parseInt(valore));
	RGraph.Clear(temperatureLine.canvas, "black");
	
	if(count==0)
		creaLinea();
	
	count ++;
	
	pressureData.shift();
	pressureData.push(valore2);
	
	disegna();
	
	//document.getElementById('silverlightObject').content.Page.PushValore(valore);
	//document.getElementById('homeSwf').pushValore(valore);
}