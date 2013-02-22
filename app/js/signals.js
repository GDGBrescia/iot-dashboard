/* Signal TYPES*/

var SignalTypes = {
    DIGITAL : 0,
    ANALOGIC : 1    
};

function Signal(sid,lineid,type,name,description,conf){
    this.sourceId=sid;
    this.lineId=lineid;
    this.type=type;
    this.name=name;
    this.description=description;
    this.conf=conf;
    //this.chart;
    this.tpl="";
    this.tplUrl="";
    this.node;
    
    this.data=[];
    this.options;    
}

/**
  * This function is used to bind the HTML template to a json object.
  * Is mainly used in the render and redraw functions.
  * 
  * @var tmpl - the HTML layout or the relative URL to the file that contains 
  *             the HTML
  * @var data - the json object to bind to the layout
  */
Signal.prototype.parseTemplate=function(tmpl,data,fetch){
    var regexp;
    var tempTpl=tmpl;
    if(fetch){
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
        this.tpl=tempTpl;
    }else{        
        tempTpl=this.tpl;
    }
    for (placeholder in data) { 
        // useremo le parantesi graffe per
        // identificare i placeholder
        regexp = new RegExp('{' + placeholder + '}', 'g'); 
        tempTpl = tempTpl.replace(regexp, data[placeholder]); 
    }
    return tempTpl;
}
Signal.prototype.beforeRender=function(){}
Signal.prototype.afterRender=function(){}
Signal.prototype.beforeRedraw=function(){}
Signal.prototype.afterRedraw=function(){}

Signal.prototype.render=function(to){
    this.beforeRender();
    //console.log("Render: "+this.sourceId+"_"+this.lineId);    
    var placeholder= $("#"+this.sourceId+"_"+this.lineId);   
    var html=this.parseTemplate(this.tplUrl,this,true);
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
    //console.log("Redraw: "+this.sourceId+"_"+this.lineId);
    //get node...
    var html=this.parseTemplate(this.tplUrl,this,false);
    //$(this.sourceId+"_"+this.lineId).append(this.containerEl.append(html));
    $("#"+this.sourceId+"_"+this.lineId).replaceWith($(html));
    this.afterRedraw();
}


/* DIGITAL SIGNAL */
function DSignal(sid,lineid,name,description,conf){    
    this.currentValue=false;
    //code for command management
    this.buttons=[];
    Signal.call(this, sid,lineid,SignalTypes.DIGITAL,name, description,conf);
}
DSignal.inherits(Signal);
DSignal.prototype.getValue=function(){
    return this.currentValue;
}
DSignal.prototype.setValue=function(value){
    this.currentValue=value;
}

/* ALARM SIGNAL */
function AlarmDSignal(sid,lineid,name,description,conf){
    //call the parent constructor    
    DSignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'dsignal-alarm span3'
    });
    this.tplUrl="/app/views/alarm-signal.html";
}
AlarmDSignal.inherits(DSignal);

/* EVENT SIGNAL */
function EventDSignal(sid,lineid,name,description,conf){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'dsignal-event span3'
    });  
    this.tplUrl="/app/views/event-signal.html";
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
        if(this.enableButton) {
            this.enableButton.show();
        }
        if(this.disableButton){
            this.disableButton.hide();
        }
    } else {
        if(this.enableButton) {
            this.enableButton.hide();
        }
        if(this.disableButton){
            this.disableButton.show();
        }
    }
}
EventDSignal.prototype.beforeRedraw=EventDSignal.prototype.checkButtons;
EventDSignal.prototype.beforeRender=EventDSignal.prototype.checkButtons;

/* EVENT SIGNAL */
function ProductTypeDSignal(sid,lineid,name,description,conf){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'dsignal-ptype'
    });
    this.tplUrl="/app/views/ptype-signal.html";
}
ProductTypeDSignal.inherits(DSignal);






/* ANALOGIC SIGNAL */
function ASignal(sid,lineid,name,description,conf){
    Signal.call(this, sid,lineid,SignalTypes.ANALOGIC,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'asignal'   
    });
    this.tplUrl="/app/views/analogic-signal.html";    
    this.chartData=[];
    this.chartOptions=[];
}
ASignal.inherits(Signal);
ASignal.prototype.getValue=function(){
    return this.currentValue;
}
ASignal.prototype.addValue=function(value){
    this.data=$.merge($.merge([],this.data),value);
}
ASignal.prototype.createChart=function(){
    //overloaded...
    };
ASignal.prototype.updateChart=function(){
    //overloaded...
    };


function SpeedASignal(sid,lineid,name,description,conf){
    
    ASignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'asignal-speed'
    });
    this.tplUrl="/app/views/speed-signal.html";    
}
SpeedASignal.inherits(ASignal);

function PressureASignal(sid,lineid,name,description,conf){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'pressure-slow'
    });
    this.tplUrl="/app/views/pressure-signal.html";
}

PressureASignal.inherits(ASignal);

PressureASignal.prototype.createChart=function(){
    var signal=this;
    var dataArray = [
    [signal.conf.name, signal.conf.units]
    ];
    dataArray.push([signal.conf.name,0]);    
    this.chartData = google.visualization.arrayToDataTable(dataArray);     
    this.chartOptions = {
        title: signal.conf.name,
        'width':800,
        'height':600,
        animation:{
            duration: 10,
            easing: 'in'
        },
        vAxis: {
            minValue:signal.conf.minValue, 
            maxValue:signal.conf.maxValue
            }
    };
    this.chart = new google.visualization.SteppedAreaChart($("#"+signal.sourceId+"_"+signal.lineId+"_ch")[0]);
    this.chart.draw(this.chartData, this.chartOptions);
}
PressureASignal.prototype.updateChart=function(){
    $.each(this.data, function(key, value){
        //dataArray.push([signal.conf.name, value]);
        this.chartData.setValue(0, 1, value);
    });
    this.chart.draw(this.chartData, this.chartOptions);
}

PressureASignal.prototype.render=function(){
    //console.log("Render: "+this.sourceId+"_"+this.lineId);
    //get node...
    if(GOOGLECHARTS_ACTIVE){
        this.createChart();
    }
    this.tpl=this.parseTemplate(this.tplUrl,this,true);
    $("#"+this.sourceId+"_"+this.lineId).replaceWith($(this.tpl));
}

PressureASignal.prototype.redraw=function(){
    //console.log("Redraw: "+this.sourceId+"_"+this.lineId);
    //get node...
    var html=this.parseTemplate(this.tplUrl,this,false);
    if(GOOGLECHARTS_ACTIVE){
        this.createChart();
    }    
    $("#"+this.sourceId+"_"+this.lineId).replaceWith($(html));
}

function SlowRateASignal(sid,lineid,name,description,conf){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'asignal-slow'
    });
    this.tplUrl="/app/views/slow-signal.html";
}
SlowRateASignal.inherits(ASignal);

function ProductCountASignal(sid,lineid,name,description,conf){
    //call the parent constructor
    this.currentCount=0;
    ASignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'asignal-pcount span3'
    });    
    this.tplUrl="/app/views/count-signal.html";
}
ProductCountASignal.inherits(ASignal);