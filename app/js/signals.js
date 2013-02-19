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
    
    this.data;
    this.options;
    /* GETTER SETTER */
    return this;
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
       console.log(tmpl.toLowerCase().indexOf(".html"));        
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
/*
Signal.prototype.createTitle=function(){
    var chartTitle=$("<h1/>");
    chartTitle.createTextNode(this._name);  
    this.containerEl.appendChild(chartTitle);
}
*/
Signal.prototype.render=function(to){
    console.log("Render");    
    this.node=to;
    var html=this.parseTemplate(this.tpl,this);    
    this.node.append(this.containerEl.append(html));
}
Signal.prototype.redraw=function(){
    console.log("Redraw");
    console.log(this.node);
    /*
    if(this.node!=null){
        var oldHtml=this.parseTemplate(this.tpl,{currentValue:!this.currentValue});
        oldHtml=this.parseTemplate(oldHtml,this);
        var html=this.parseTemplate(this.tpl,this);    
        this.node.replaceChild(this.containerEl.append(html),this.containerEl.append(oldHtml));
    }
    */
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
    this.containerEl=$("<li/>",{
        'class':'dsignal-alarm span3'
    });
    this.tpl="/app/views/alarm-signal.html";
}
AlarmDSignal.inherits(DSignal);

/* EVENT SIGNAL */
function EventDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'dsignal-event span3'
    });  
    this.tpl="/app/views/event-signal.html";
}
EventDSignal.inherits(DSignal);

EventDSignal.prototype.redraw=function(){
    Signal.redraw();
    console.log('Manage the button');
}

/* EVENT SIGNAL */
function ProductTypeDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'dsignal-ptype'
    });
    this.tpl="/app/views/ptype-signal.html";
}
ProductTypeDSignal.inherits(DSignal);


/* ANALOGIC SIGNAL */
function ASignal(sid,lineid,name,description){
    Signal.call(this, sid,lineid,SignalTypes.ANALOGIC,name, description);
    this.containerEl=$("<li/>",{
        'class':'asignal'
    });
    this.tpl="/app/views/analogic-signal.html";
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
    this.containerEl=$("<li/>",{
        'class':'asignal-speed'
    });
    this.tpl="/app/views/speed-signal.html";
}
SpeedASignal.inherits(ASignal);

function SlowRateASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'asignal-slow'
    });
    this.tpl="/app/views/slow-signal.html";
}
SlowRateASignal.inherits(ASignal);

function ProductCountASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'asignal-pcount'
    });    
    this.tpl="/app/views/count-signal.html";
}
ProductCountASignal.inherits(ASignal);