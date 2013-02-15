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
    
    this.data;
    this.options;
    /* GETTER SETTER */
    return this;
}

/* Class for rendering the signal */
Signal.prototype.render = function(to){
    this.containerEl=$("<div/>",{
        'class':'span3'
    });
    
    this.createTitle();
    this.createChart(this.data,this.options);
    
    to.appendChild(this.containerEl);
}
Signal.prototype.createTitle=function(){
    var chartTitle=$("<h1/>");
    chartTitle.createTextNode(this._name);    
    this.containerEl.appendChild(chartTitle);    
}


/* DIGITAL SIGNAL */
function DSignal(sid,lineid,name,description){    
    Signal.call(this, sid,lineid,SignalTypes.DIGITAL,name, description);    
    this.currentValue;
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
        'class':'span3 alarm'
    });
}
AlarmDSignal.inherits(DSignal);

/* EVENT SIGNAL */
function EventDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'span3 event'
    });    
}
EventDSignal.inherits(DSignal);

/* EVENT SIGNAL */
function ProductTypeDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'span3 product-type'
    });
}
ProductTypeDSignal.inherits(DSignal);


/* ANALOGIC SIGNAL */
function ASignal(sid,lineid,name,description){
    Signal.call(this, sid,lineid,SignalTypes.ANALOGIC,name, description);
    this.containerEl=$("<div/>",{
        'class':'span3 analogic'
    });
}
ASignal.inherits(Signal);
/* DEFAULT IS A COLUMN CHART */
ASignal.prototype.createChart=function(data,options){
    var chartPanel=$("<div/>");
    this._chart=new google.visualization.ColumnChart(chartPanel);
    this._chart.draw(data, options);    
    this.containerEl.appendChild(chartPanel);
}

function SpeedASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'span3 speed'
    });
}
SpeedASignal.inherits(ASignal);

function SlowRateASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'span3 speed'
    });
}
SlowRateASignal.inherits(ASignal);

function ProductCountASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<div/>",{
        'class':'span3 speed'
    });
}
ProductCountASignal.inherits(ASignal);

