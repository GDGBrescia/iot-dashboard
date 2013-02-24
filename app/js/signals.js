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
        
    this.options;
    this.currentValue=0;
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

Signal.prototype.render=function(){
    this.beforeRender();
    console.log("Render: "+this.sourceId+"_"+this.lineId);    
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
    //console.log(conf);
    if(conf!=null){
        this.data= FixedQueue( conf.samplingRate/10 , [] );
    }else{
        this.data= FixedQueue( 1, [] );
    }
    this.units=function(){
        if(conf!=null){
            return conf.units;
        }else{
            return "";
        }
    }
    this.chartData=[];
    this.chartOptions=[];
}
ASignal.inherits(Signal);
ASignal.prototype.getValue=function(){
    return this.currentValue;
}
ASignal.prototype.addValue=function(value){
    this.data.push(value);
}
ASignal.prototype.createChart=function(){
    var sig=$("#"+this.sourceId+"_"+this.lineId+"_ch")[0];
    if(sig!=null){
        this.chart = new Istogram3DBar(sig);
    }
};
ASignal.prototype.updateChart=function(){
    if(this.chart!=null){
        var maxChHeight=100, maxHeight=this.conf.maxValue,chValue, dValue=this.data[i],
        srate=this.conf.samplingRate/10;
        for (var i = 0; i < srate; i++) {
            this.currentValue=this.data[i].toFixed(3); //format number...
            this.chart.setHeight(maxChHeight * this.data[i].toFixed(3) / maxHeight);
        }
    }
};
ASignal.prototype.afterRender=function(){
    this.createChart();
}
ASignal.prototype.afterRedraw=function(){
    this.updateChart();
}

function SpeedASignal(sid,lineid,name,description,conf){
    
    ASignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'asignal-speed'
    });
    this.tplUrl="/app/views/speed-signal.html";    
}
SpeedASignal.inherits(ASignal);
    
SpeedASignal.prototype.createChart=function(){
    var sig=$("#"+this.sourceId+"_"+this.lineId+"_ch")[0],
    self=this;
    console.log(sig);
    if(sig!=null){
        self.chart = new Highcharts.Chart({
            chart: {
                renderTo: self.sourceId+"_"+self.lineId+"_ch",
                type: 'spline',
                marginRight: 10,
                events: {
                    load: function() {
                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            console.log(self.data[0]);
                            if(self.data[0]!=null){
                                var srate=self.conf.samplingRate/10;
                                for (var i = 0; i < srate; i++) {
                                    var x = (new Date()).getTime(), // current time
                                    y = self.data[i].toFixed(3);            
                                    series.addPoint([x, y], true, true);
                                }
                            }
                        }, 1000);
                      
                    }
                }
            },
            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ self.conf.name +'</b><br/>'+
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+
                    Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: self.conf.name,
                data: (function() {
                    // generate an array of random data
                    var data = [],
                    time = (new Date()).getTime();    
                    if(self.data[0]!=null){
                        var srate=self.conf.samplingRate/10;
                        for (var i = 0; i < srate; i++) {
                            data.push({
                                x: time + i * 1000,
                                y: self.data[i].toFixed(3)
                            });                                
                        }
                    }                       
                    return data;
                })()
            }]
        });
    }
};
SpeedASignal.prototype.updateChart=function(){
    if(this.chart!=null){
    /*
        var maxChHeight=100, maxHeight=this.conf.maxValue,chValue, dValue=this.data[i],
        srate=this.conf.samplingRate/10;
        for (var i = 0; i < srate; i++) {
            this.currentValue=this.data[i].toFixed(3); //format number...
            this.chart.setHeight(maxChHeight * this.data[i].toFixed(3) / maxHeight);
        }
       
       var srate=this.conf.samplingRate/10;
       for (var i = 0; i < srate; i++) {
            var x = (new Date()).getTime(), // current time
            y = this.data[i].toFixed(3);            
            this.chart.series[0].addPoint([x, y], true, true);
       }
       */
    }
};
    

function PressureASignal(sid,lineid,name,description,conf){
    //call the parent constructor
    ASignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'pressure-slow'
    });
    this.tplUrl="/app/views/pressure-signal.html";
}

PressureASignal.inherits(ASignal);

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
    ASignal.call(this, sid,lineid,name, description,conf);
    this.containerEl=$("<div/>",{
        'class':'asignal-pcount span3'
    });    
    this.tplUrl="/app/views/count-signal.html";
}
ProductCountASignal.inherits(ASignal);