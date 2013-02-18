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
Signal.prototype.parseTemplate=function(tmpl,data){
    var regexp;
 
    for (placeholder in data) {
 
        // useremo le parantesi graffe per
        // identificare i placeholder
        regexp = new RegExp('{' + placeholder + '}', 'g');
 
        tmpl = tmpl.replace(regexp, data[placeholder]);
 
    }
 
    return tmpl;
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
    if(this.node!=null){
        var oldHtml=this.parseTemplate(this.tpl,{currentValue:!this.currentValue});
        oldHtml=this.parseTemplate(oldHtml,this);
        var html=this.parseTemplate(this.tpl,this);    
        this.node.replaceChild(this.containerEl.append(html),this.containerEl.append(oldHtml));
    }
}


/* DIGITAL SIGNAL */
function DSignal(sid,lineid,name,description){    
    this.currentValue=false;
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
    this.tpl="<div class='thumbnail status-{currentValue}'><img src='/app/img/green-light.png'><div class='caption'><h3>{sourceId}.{lineId} - {name}</h3><p>{description}</p><p>Current value: <span id='{sourceId}_{lineId}'>{currentValue}</span></p></div></div>";
}
AlarmDSignal.inherits(DSignal);

/* EVENT SIGNAL */
function EventDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'dsignal-event span3'
    });  
    this.tpl="<div class='thumbnail status-{currentValue}'><h3>{sourceId}.{lineId} - {name}</h3><p>{description}</p>Current value: <span id='{sourceId}_{lineId}'>{currentValue}</span></div>";
}
EventDSignal.inherits(DSignal);

/* EVENT SIGNAL */
function ProductTypeDSignal(sid,lineid,name,description){
    //call the parent constructor
    DSignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'dsignal-ptype'
    });  
    this.tpl="<div class='dsignal-ptype'><h4>{sourceId}.{lineId}<br>{name}</h4><p>{description}</p>Current value: <span id='{sourceId}_{lineId}'>{currentValue}</span></div>";
}
ProductTypeDSignal.inherits(DSignal);


/* ANALOGIC SIGNAL */
function ASignal(sid,lineid,name,description){
    Signal.call(this, sid,lineid,SignalTypes.ANALOGIC,name, description);
    this.containerEl=$("<li/>",{
        'class':'asignal'
    }); 
    this.tpl="<div class='asignal'><h4>{sourceId}.{lineId}<br>{name}</h4><p>{description}</p>Current value: <span id='{sourceId}_{lineId}'>{currentValue}</span></div>";
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
    this.tpl="<div class='asignal-speed'><h4>{sourceId}.{lineId}<br>{name}</h4><p>{description}</p>Current value: <span id='{sourceId}_{lineId}'>{currentValue}</span></div>";
}
SpeedASignal.inherits(ASignal);

function SlowRateASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'asignal-slow'
    });
    this.tpl="<div class='asignal-slow'><h4>{sourceId}.{lineId}<br>{name}</h4><p>{description}</p>Current value: <span id='{sourceId}_{lineId}'>{currentValue}</span></div>";
}
SlowRateASignal.inherits(ASignal);

function ProductCountASignal(sid,lineid,name,description){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description);
    this.containerEl=$("<li/>",{
        'class':'asignal-pcount'
    });
    this.tpl="<div class='asignal-pcount'><h4>{sourceId}.{lineId}<br>{name}</h4><p>{description}</p>Current value: <span id='{sourceId}_{lineId}'>{currentValue}</span></div>";
}
ProductCountASignal.inherits(ASignal);

