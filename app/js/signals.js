/* Signal TYPES*/

var SignalTypes = {
    DIGITAL : 0,
    ANALOGIC : 1    
};

function Signal(sid,lineid,type,name,description){
    this.sourceId=sid;
    this.lineId=lineid;
    this.type=type;
    this.name=name;
    this.description=description;
    this.icon;
    this.chart;
    this.tpl;
    
    this.node;
    
    this.data=[];
    this.options;
    /* GETTER SETTER */
    //return this;
}

/* Class for rendering the signal */
/*
Signal.prototype.render = function(to){
    this.containerEl=$("<div/>",{
        'class':'span3'
    });
    
    this.createTitle();
    this.createChart(this.data,this.options);
    
    to.appendChild(this.containerEl);
    
    to.appendChild(parseTemplate(this.tpl,this));
}

*/

/**
  * This function is used to bind the HTML template to a json object.
  * Is mainly used in the render and redraw functions.
  * 
  * @var tmpl - the HTML layout or the relative URL to the file that contains 
  *             the HTML
  * @var data - the json object to bind to the layout
  */
Signal.prototype.parseTemplate=function(tmpl,data){
    var regexp;
    var tempTpl=tmpl;
    if(tmpl.toLowerCase().indexOf(".html") >= 0){   
       $.ajax({
            type: 'GET',
            url: tmpl,
            success: function(data) {
                tempTpl = data;
            },
            async: false
            // async to false so that we don't access an empty variable before the request is finished
        });
    }
    for (placeholder in data) { 
        // useremo le parantesi graffe per
        // identificare i placeholder
        regexp = new RegExp('{' + placeholder + '}', 'g'); 
        tempTpl = tempTpl.replace(regexp, data[placeholder]); 
    }
    return tempTpl;
}
Signal.prototype.beforeRender=function(){
    console.log("Signal before render");    
}
Signal.prototype.afterRender=function(){
    console.log("Signal before render");    
}
Signal.prototype.beforeRedraw=function(){
    console.log("Signal before redraw");    
}
Signal.prototype.afterRedraw=function(){
    console.log("Signal before redraw");    
}
Signal.prototype.render=function(to){
    this.beforeRender();
    console.log("Render: "+this.sourceId+"_"+this.lineId);    
    var placeholder= $("#"+this.sourceId+"_"+this.lineId);   
    var html=this.parseTemplate(this.tpl,this);
     if(placeholder){
        this.node=placeholder;
        this.node.replaceWith($(html));
    }else{
        this.node=to;    
        this.node.append(this.containerEl.append(html));    
    }
    this.afterRender();
}

Signal.prototype.redraw=function(){
    this.beforeRedraw();
    console.log("Redraw: "+this.sourceId+"_"+this.lineId);
    //get node...
    var html=this.parseTemplate(this.tpl,this);
    //$(this.sourceId+"_"+this.lineId).append(this.containerEl.append(html));
    $("#"+this.sourceId+"_"+this.lineId).replaceWith($(html));
	this.afterRedraw();
}


/* DIGITAL SIGNAL */
function DSignal(sid,lineid,name,description){    
    this.currentValue=false;
    //code for command management
    this.buttons=[];
    Signal.call(this, sid,lineid,SignalTypes.DIGITAL,name, description);
}
DSignal.inherits(Signal);
DSignal.prototype.getValue=function(){
    return this.currentValue;
}
DSignal.prototype.setValue=function(value){
    this.currentValue=value;
}

/* ALARM SIGNAL */
function AlarmDSignal(sid,lineid,name,description){
    //call the parent constructor    
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'dsignal-alarm span3'
    });
    this.tpl="/app/views/alarm-signal.html";
}
AlarmDSignal.inherits(DSignal);

/* EVENT SIGNAL */
function EventDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'dsignal-event span3'
    });  
    this.tpl="/app/views/event-signal.html";
	this.enableButton={};
	this.disableButton={};
}
EventDSignal.inherits(DSignal);
EventDSignal.prototype.setButtons=function(enableButton,disableButton){
    this.enableButton=enableButton;
	this.disableButton=disableButton;
}
EventDSignal.prototype.checkButtons=function(){
	if (!this.getValue()){
		if(this.enableButton) {this.enableButton.show();}
		if(this.disableButton){this.disableButton.hide();}
	} else {
		if(this.enableButton) {this.enableButton.hide();}
		if(this.disableButton){this.disableButton.show();}
	}
}
EventDSignal.prototype.beforeRedraw=EventDSignal.prototype.checkButtons;
EventDSignal.prototype.beforeRender=EventDSignal.prototype.checkButtons;

/* EVENT SIGNAL */
function ProductTypeDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'dsignal-ptype'
    });
    this.tpl="/app/views/ptype-signal.html";
}
ProductTypeDSignal.inherits(DSignal);






/* ANALOGIC SIGNAL */
function ASignal(sid,lineid,name,description){
    Signal.call(this, sid,lineid,SignalTypes.ANALOGIC,name, description);
    this.containerEl=$("<div/>",{
        'class':'asignal'   
    });
    this.tpl="/app/views/analogic-signal.html";
    this.chart=$("<div/>",{
        'id' : this.sourceId+"_"+this.lineId+"_ch",
        'class':'chart'   
    });  //empty chart objec...
}
ASignal.inherits(Signal);
ASignal.prototype.getValue=function(){
    return this.currentValue;
}
ASignal.prototype.addValue=function(value){
    this.data.push(value);
}

function SpeedASignal(sid,lineid,name,description){
    
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'asignal-speed'
    });
    this.tpl="/app/views/speed-signal.html";
    
    this.createChart=function(){
       console.log("Create a new google.visualization.Gauge");
       console.log($("#"+this.sourceId+"_"+this.lineId+"_ch"));
       var tchart=new google.visualization.Gauge(document.getElementById(this.sourceId+"_"+this.lineId+"_ch"));
       var gaugeData = new google.visualization.DataTable();
       gaugeData.addColumn('number', this.name);
       gaugeData.addRows(1);
       gaugeData.setCell(0, 0, this.data.pop());
       var gaugeOptions = {min: 0, max: 120, yellowFrom: 75, yellowTo: 90,
            redFrom: 91, redTo: 120, minorTicks: 5};
       tchart.draw(this.data,gaugeOptions);
    }
}
SpeedASignal.inherits(ASignal);

SpeedASignal.prototype.render=function(){
    console.log("Render: "+this.sourceId+"_"+this.lineId);
    //get node...
    if(GOOGLECHARTS_ACTIVE){
        this.createChart();
    }
    var html=this.parseTemplate(this.tpl,this);
    $("#"+this.sourceId+"_"+this.lineId).replaceWith($(html));
}

SpeedASignal.prototype.redraw=function(){
    console.log("Redraw: "+this.sourceId+"_"+this.lineId);
    //get node...
    var html=this.parseTemplate(this.tpl,this);
    if(GOOGLECHARTS_ACTIVE){
        this.createChart();
    }    
    $("#"+this.sourceId+"_"+this.lineId).replaceWith($(html));
}

function PressureASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'pressure-slow'
    });
    this.tpl="/app/views/pressure-signal.html";
}
PressureASignal.inherits(ASignal);


function SlowRateASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'asignal-slow'
    });
    this.tpl="/app/views/slow-signal.html";
}
SlowRateASignal.inherits(ASignal);

function ProductCountASignal(sid,lineid,name,description){
    //call the parent constructor
    this.currentCount=0;
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'asignal-pcount span3'
    });    
    this.tpl="/app/views/count-signal.html";
}
ProductCountASignal.inherits(ASignal);