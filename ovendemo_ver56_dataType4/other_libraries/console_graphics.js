// Codice JS per la grafica
		
$(document).ready(function(){
	
	$("ul.subnav").parent().append("<span></span>"); //Only shows drop down trigger when js is enabled - Adds empty span tag after ul.subnav
		
	$("ul.topnav li").click(function() { //When trigger is clicked...
		
		//Following events are applied to the subnav itself (moving subnav up and down)
		$(this).find("ul.subnav").slideDown('fast').show(); //Drop down the subnav on click

		$(this).hover(function() {
		}, function(){	
			$(this).parent().find("ul.subnav").slideUp('slow'); //When the mouse hovers out of the subnav, move it back up
		});

		//Following events are applied to the trigger (Hover events for the trigger)
		}).hover(function() { 
			$(this).addClass("subhover"); //On hover over, add class "subhover"
		}, function(){	//On Hover Out
			$(this).removeClass("subhover"); //On hover out, remove class "subhover"
	});
	
	$('a[name=modal]').click(function(e) {
		//Cancel the link behavior
		e.preventDefault();
		
		//Get the A tag
		var id = $(this).attr('href');
	
		//Get the screen height and width
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
	
		//Set heigth and width to mask to fill up the whole screen
		$('#mask').css({'width':maskWidth,'height':maskHeight});
		
		//transition effect		
		$('#mask').fadeIn(1000);	
		$('#mask').fadeTo("slow",0.8);	
	
		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();
			  
		//Set the popup window to center
		$(id).css('top',  winH/2-$(id).height()/2);
		$(id).css('left', winW/2-$(id).width()/2);
	
		//transition effect
		$(id).fadeIn(2000); 
	
	});
	
	//if close button is clicked
	$('.window .close').click(function (e) {
		//Cancel the link behavior
		e.preventDefault();
		
		$('#mask').hide();
		$('.window').hide();
	});		
	
	//if mask is clicked
	$('#mask').click(function () {
		$(this).hide();
		$('.window').hide();
	});	
	
	// Dialog	
	//$(function(){
			
		$('#winTable').dialog({
			autoOpen: false,
			width: 400,
			height:300
		});	
		
		$('#WelcomeMsg').dialog({
			autoOpen: false,
			width: 400,
			buttons: {
				"Ok": function() { 
					// Quando si chiude la finestra del welcome msg, la variabile langSelected
					// conterrà la lingua selezionata dall'utente
					// Devo mandare un messaggio xml :
					var msg = "<package>\
								  <packageType>Language</packageType>\
								  <value>" + langSelected + "</value>\
							   </package>";
					
					scct_custom_xml_data(msg);
					
					$(this).dialog("close"); 
				} 
			}
		});	
		
		$('#winSources').dialog({
			autoOpen: false,
			width: 400,
			buttons: {
				"Select": function() { 
					// Quando si chiude la finestra 
					// devo selezionare la sorgente dati
					
					var srcArray = new Array();
					srcArray[0] = sourcesAvaiable[indexSourceSelected];
					scct_selected_source_list(srcArray);
					$(this).dialog("close"); 
				} 
			}
		});
		
		$('#winText').dialog({
			autoOpen: false,
			width: 400,
			buttons: {
				"Ok": function() { 
					$(this).dialog("close"); 
				} 
			}
		});
		
		$("#winHist").dialog({
			autoOpen: false,
			width: 500
		});
		
		$('#winPie').dialog({
			autoOpen: false,
			width: 500
		});
		
		$('#winChart').dialog({
			autoOpen: false,
			width: 500
		});
		
		$('#winXYChart').dialog({
			autoOpen: false,
			width: 500
		});
		
		
		$('#winAbout').dialog({
			autoOpen: false,
			width: 400,
			buttons: {
				"Ok": function() { 
					$(this).dialog("close"); 
				} 
			}
		});
		
		
		$('#winStatus').dialog({
			autoOpen: false,
			width: 400,
			buttons: {
				"Ok": function() { 
					$(this).dialog("close"); 
				} 
			}
		});
		
		$('#winParameters').dialog({
			autoOpen: false,
			width: 300,
			buttons: {
				"Ok": function() { 
					// num funzionalità recuperata nel div con id funcSelected
					var num_function = parseInt(document.getElementById("funcSelected").innerHTML);
					var passwd	= "";
					var parMancanti = 0;
					
					// Qui recupero la passwd
					if(functionalitiesAvaiable[num_function].passwordRequired==1)
					{
						passwd	= document.getElementById("passwd").value;
						if(passwd.length==0)
							parMancanti = 1;
					}
					
					// Qui recupero i parametri
					var params = [];
					for(var i=0;i<functionalitiesAvaiable[num_function].additionalFields.length;i++)
					{
						
						var campoObbligatorioElem = document.getElementById("tdParams_" + i);
						var paramElem 			  = document.getElementById("params_" + i );
						var param 			  = "";
						var campoObbligatorio = 0;
						
						campoObbligatorio = campoObbligatorioElem.innerHTML.indexOf("*")!=-1?1:0; 
						param = paramElem.value ;
						
						if(param.length==0 && campoObbligatorio)
						{
							parMancanti = 1;
							break;
						}
						
						params.push(param);
					}
					
					// Recuperare il numero della funzionalità, controllo i campi obbligatori quali password e params
					// Se tutti i parametri obbligatori sono stati compilati, allora mando il msg e chiudo la finestra, 
					// altrimenti avviso della loro mancanza
					if(parMancanti)
					{
						// Uso l'alert?
						alert("The parameters with * are required!");
					}
					else
					{
						send_query_package(num_function,passwd,params); 
						$(this).dialog("close"); 
					}
					
					
					
					
					
				} 
			}
		});
		
	//});
	
});

function convert_to_rgb_color(colorVal)
{
	var strHexColor = colorVal.toString(16);
	var len = strHexColor.length;
	for(var i=0;i<(6-len);i++)
	{
		strHexColor = "0" + strHexColor;
	}
	return  ("#" + strHexColor);
}

function disegna_tabella(title,rowHeaders,columnHeaders,aDataSet)
{
													
	for(var i=0;i<aDataSet.length;i++)
	{
		h = [];
		if(rowHeaders.length>0)
			h[0] = rowHeaders[i];
		else
			h[0] = "";
		aDataSet[i] = h.concat(aDataSet[i]);
	}
	
	var aoCol = [
					{
						"sTitle": "",
						"fnRender": function(obj) {
							var sReturn = obj.aData[ obj.iDataColumn ];
							return "<b>" + sReturn + "</b>";
						}
					}
					
				];
	var objTitle = null;
	for(var i=0;i<columnHeaders.length;i++)
	{
		objTitle = {"sTitle": columnHeaders[i]};
		aoCol.push(objTitle);
	}
	
	// Apro la finestra
	$('#winTable').dialog('open');
	$('#ui-dialog-title-winTable').text(title);
	// Disegno la griglia
	$('#dynamic').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="example"></table>' );
	$('#example').dataTable( {
		"aaData": aDataSet,
		"aoColumns": aoCol
	} );
	
}
			
function disegna_istogramma(strTitle,yAxisName,yAxisMin,yAxisMax,plotItems)
{
	var chart;
	
	$('#winHist').dialog('open');
	var name = 'Histogram Columns';
	
	var colors = []; 
	var categories = []; 
	var data = [] ;
	
	for(var i=0;i<plotItems.length;i++)
	{
		colors.push(plotItems[i].color);
		categories.push(plotItems[i].label);
		
		var objData = { y : plotItems[i].y , color : colors[i] };
		data.push(objData);
	}
	
	function setChart(name, categories, data, color) {
		chart.xAxis[0].setCategories(categories);
		chart.series[0].remove();
		chart.addSeries({
			name: name,
			data: data,
			color: color || 'white'
		});
	}
	
	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'container', 
			type: 'column'
		},
		title: {
			text: strTitle
		},
		xAxis: {
			categories: categories							
		},
		yAxis: {
			title: {
				text: yAxisName
			},
			max: yAxisMax,
			min: yAxisMin
		},
		plotOptions: {
			column: {
				cursor: 'pointer',
				point: {
					events: {
						click: function() {
							var drilldown = this.drilldown;
							if (drilldown) { // drill down
								setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
							} else { // restore
								setChart(name, categories, data);
							}
						}
					}
				},
				dataLabels: {
					enabled: true,
					color: 'black',
					style: {
						fontWeight: 'bold'
					},
					formatter: function() {
						return this.y ;
					}
				}					
			}
		},
		tooltip: {
			formatter: function() {
				var point = this.point,
					s = this.x +':<b>'+ this.y +'</b><br/>';
				return s;
			}
		},
		series: [{
			name: name,
			data: data,
			color: 'white'
		}],
		exporting: {
			enabled: false
		}
	});

}


function disegna_torta(strTitle,sliceCount,plotSlices)
{
	var chart;
	
	$('#winPie').dialog('open');
	
	var dataForPie = [];
	for(var i=0;i<plotSlices.length;i++)
	{
		var objData = { name : plotSlices[i].label, y: plotSlices[i].size , color: plotSlices[i].color};
		dataForPie.push(objData);
	}
	
	chart = new Highcharts.Chart({
		chart: {
			renderTo: 'pieContainer',
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false
		},
		title: {
			text: strTitle
		},
		tooltip: {
			formatter: function() {
				return '<b>'+ this.point.name +'</b>: ' + this.point.y ;
			}
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true
				},
				showInLegend: true
			}
		},
		series: [{
			type: 'pie',
			name: 'series',
			data: dataForPie
		}]
	});
	
}

function disegna_chart(strTitle,xAxisName,xAxisMin,xAxisMax,yAxisName,yAxisMin,yAxisMax,plotPoints)
{
	$('#winChart').dialog('open');
	var seriesArray = [];
	var catArray = [];
	
	for(var i = 0;i < plotPoints.length;i++)
	{
		var serieObj = {name: plotPoints[i].name, data: plotPoints[i].points , color:plotPoints[i].color  };
		seriesArray.push(serieObj);
		
		for(j=0;j<plotPoints[i].points.length;j++)
			catArray.push(( plotPoints[i].xMultiplier * j + plotPoints[i].xOffset));
	}
	
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: 'chartContainer',
			defaultSeriesType: 'line',
			marginRight: 50,
			marginBottom: 50
		},
		title: {
			text: strTitle,
			x: -20 //center
		},
		xAxis: {
			title: {
				text: xAxisName
			},
			/*min: xAxisMin,
			max: 2010,*/
			categories: catArray
		},
		yAxis: {
			title: {
				text: yAxisName
			},
			min: yAxisMin,
			max: yAxisMax,
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function() {
					return '<b>'+ this.series.name +'</b><br/>'+
					this.x +': '+ this.y ;
			}
		},
		legend: {
			layout: 'vertical',
			align: 'bottom',
			verticalAlign: 'bottom',
			x: -10,
			y: 0,
			borderWidth: 0
		},
		series: seriesArray 
	});
	
}

function disegna_xychart(strTitle,xAxisName,xAxisMin,xAxisMax,yAxisName,yAxisMin,yAxisMax,plotPoints)
{
	$('#winXYChart').dialog('open');
	var seriesArray = [];
	var catArray = [];
	
	for(var i = 0;i < plotPoints.length;i++)
	{
		var serieObj = {name: plotPoints[i].name, data: plotPoints[i].points , color:plotPoints[i].color  };
		seriesArray.push(serieObj);
		
	}
	
	var chart = new Highcharts.Chart({
		chart: {
			renderTo: 'xyChartContainer',
			defaultSeriesType: 'scatter',
			marginRight: 50,
			marginBottom: 50
		},
		title: {
			text: strTitle,
			x: -20 //center
		},
		xAxis: {
			title: {
				text: xAxisName
			}/*,
			min: xAxisMin,
			max: 2010,
			categories: catArray*/
		},
		yAxis: {
			title: {
				text: yAxisName
			},
			min: yAxisMin,
			max: yAxisMax,
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function() {
					return '<b>'+ this.series.name +'</b><br/>'+
					this.x +': '+ this.y ;
			}
		},
		legend: {
			layout: 'vertical',
			align: 'bottom',
			verticalAlign: 'bottom',
			x: -10,
			y: 0,
			borderWidth: 0
		},
		plotOptions: {
			series: {
				lineWidth: 1
				}
		},
		series: seriesArray
		  
	});
}

function view_state_window(properties)
{
	$('#winStatus').dialog('open');
	
	var strContent = "";
	
	for(var i=0;i<properties.length;i++)
	{
		strContent = strContent + "<b>" + properties[i].description + "</b>:" + properties[i].value + "<br>";
		
	}
	
	document.getElementById("statusContainer").innerHTML = strContent;
	
}

function appendMenuFunctionalities(strNameFunctionality,strNameJsFunction,param)
{
	$("ul#func.subnav").append('<li><a href="#" onclick="' + strNameJsFunction +  '(' + param + ')">' + strNameFunctionality + '</a></li>');
}

function clearMenuFunctionalities()
{	
	$("ul#func.subnav").empty();
}