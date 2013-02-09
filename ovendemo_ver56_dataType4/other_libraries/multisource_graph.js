//Chart 1 lines
var linesChart1;
var colorsChart1 = ['white','red','lightgreen'];
var line1Chart1Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line2Chart1Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line3Chart1Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

//Chart 2 lines
var linesChart2;
var colorsChart2 = ['white','red','lightgreen','lightblue','yellow'];
var line1Chart2Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line2Chart2Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line3Chart2Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line4Chart2Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line5Chart2Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


//Chart 2 lines
var linesChart3;
var colorsChart3 = ['white','red','lightgreen','lightblue','yellow','violet','orange','blue','purple','pink','gray'];
var line1Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line2Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line3Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line4Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line5Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line6Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line7Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line8Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line9Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var line10Chart3Data = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


function creaChart1(){
	linesChart1 = new RGraph.Line('chart1', line1Chart1Data,line2Chart1Data,line3Chart1Data);
	linesChart1.Set('chart.background.barcolor1', 'black');
	linesChart1.Set('chart.background.barcolor2', 'black');
	linesChart1.Set('chart.colors', colorsChart1);
	linesChart1.Set('chart.key.shadow.color', 'black');
	linesChart1.Set('chart.key.rounded', true);
	linesChart1.Set('chart.key.position', 'graph');

	disegnaChart1();	
}

function creaChart2(){
	linesChart2 = new RGraph.Line('chart2', line1Chart2Data,line2Chart2Data,line3Chart2Data,line4Chart2Data,line5Chart2Data);
	linesChart2.Set('chart.background.barcolor1', 'black');
	linesChart2.Set('chart.background.barcolor2', 'black');
	linesChart2.Set('chart.colors', colorsChart2);
	linesChart2.Set('chart.key.shadow.color', 'black');
	linesChart2.Set('chart.key.rounded', true);
	linesChart2.Set('chart.key.position', 'graph');
	
	disegnaChart2();
}

function creaChart3(){
	linesChart3 = new RGraph.Line('chart3', line1Chart3Data,line2Chart3Data,line3Chart3Data,line4Chart3Data,line5Chart3Data,line6Chart3Data,line7Chart3Data,line8Chart3Data,line9Chart3Data,line10Chart3Data);
	linesChart3.Set('chart.background.barcolor1', 'black');
	linesChart3.Set('chart.background.barcolor2', 'black');
	linesChart3.Set('chart.colors', colorsChart3);
	linesChart3.Set('chart.key.shadow.color', 'black');
	linesChart3.Set('chart.key.rounded', true);
	linesChart3.Set('chart.key.position', 'graph');
	
	disegnaChart3();	
}


function disegnaChart1()
{
	RGraph.Clear(linesChart1.canvas,"white");
	
	for (var i=0;i<3;i++){
		var stringa = "linesChart1.original_data["+i+"]=line"+(i+1)+"Chart1Data";
		eval(stringa);
		stringa = "linesChart1.Draw()";
		eval(stringa);
	}
}

function disegnaChart2()
{
	RGraph.Clear(linesChart2.canvas,"white");
	
	for (var i=0;i<5;i++){
		var stringa = "linesChart2.original_data["+i+"]=line"+(i+1)+"Chart2Data";
		eval(stringa);
		stringa = "linesChart2.Draw()";
		eval(stringa);
	}
}

function disegnaChart3()
{
	RGraph.Clear(linesChart3.canvas,"white");
	
	for (var i=0;i<10;i++){
		var stringa = "linesChart3.original_data["+i+"]=line"+(i+1)+"Chart3Data";
		eval(stringa);
		stringa = "linesChart3.Draw()";
		eval(stringa);
	}
}


function pushNuovoValoreChart1(valore1,valore2,valore3)
{
	RGraph.Clear(linesChart1.canvas, "black");
	for(var i=1;i<=3;i++){
		var stringa = "line"+i+"Chart1Data.shift();line"+i+"Chart1Data.push("+eval("valore"+i)+");";
		eval(stringa);
	}
	disegnaChart1();
}

function pushNuovoValoreChart2(valore1,valore2,valore3,valore4,valore5)
{
	RGraph.Clear(linesChart2.canvas, "black");
	for(var i=1;i<=5;i++){
		var stringa = "line"+i+"Chart2Data.shift();line"+i+"Chart2Data.push(valore"+i+");";
		eval(stringa);
	}
	disegnaChart2();
}

function pushNuovoValoreChart3(valore1,valore2,valore3,valore4,valore5,valore6,valore7,valore8,valore9,valore10)
{
	RGraph.Clear(linesChart3.canvas, "black");
	for(var i=1;i<=10;i++){
		var stringa = "line"+i+"Chart3Data.shift();line"+i+"Chart3Data.push(valore"+i+");";
		eval(stringa);
	}
	disegnaChart3();}