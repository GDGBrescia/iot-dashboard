var temperatureLine;
var temperatureData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


function creaLinea(){
	temperatureLine = new RGraph.Line('line9', temperatureData);
	temperatureLine.Set('chart.background.barcolor1', 'black');
	temperatureLine.Set('chart.background.barcolor2', 'black');
	temperatureLine.Set('chart.key', ['Temperature']);
	temperatureLine.Set('chart.colors', ['yellow']);
	temperatureLine.Set('chart.key.shadow.color', 'black');
	temperatureLine.Set('chart.key.rounded', true);
	temperatureLine.Set('chart.linewidth', 2);
	temperatureLine.Set('chart.key.position.x', 25);
	temperatureLine.Set('chart.key.position.y', 282);
	temperatureLine.Set('chart.text.size',7);
	
	RGraph.Clear(temperatureLine.canvas,"white");
	
	pressureLine = new RGraph.Line('line9', pressureData);
	pressureLine.Set('chart.key', [' Pressure   ']);
	pressureLine.Set('chart.yaxispos', 'right');
	pressureLine.Set('chart.linewidth', 2);
	pressureLine.Set('chart.colors', ['#FF0000']);
	pressureLine.Set('chart.background.grid', false);
	pressureLine.Set('chart.key.position.x', 405);
	pressureLine.Set('chart.key.position.y', 282);
	pressureLine.Set('chart.text.size',7);
	
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
var pressureData =    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
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