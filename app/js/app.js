
function IotDashboard(channel){ //},driver){
    
    //The dashboard is connected to the server
    var _connected=false;
    var _ready=false;
    //Connected GETTER
    this.isConnected=function(){
        return _connected;
    };    
    this.setConnected=function(connected){
        _connected=connected;
    }
    this.isReady=function(){
        return _ready;
    };
    this.setReady=function(ready){
        _ready=ready;
    }


    //The channel must be an object that sends data...
    var _channel=channel;
    // GETTER/SETTER
    this.getChannel=function(){
        return this._channel;
    }
    this.setChannel=function(ch){
        if(this.isStarted() && ch!=null){
            this.stopStream();
            this.setConnected(false);
            _channel=ch;
        }else{
            _channel=ch;   
        }
    }

    /* SYSTEM DATA*/
    var _connectionJsonString='{}';
    var _configXml='';
    var _systemJson={
        'systemName':'',
        'systemDescription':'',
        'systemAvailableProductTypes':0,
        'systemMaxMotorSpeed':0,
        'systemHw':{
            'controllerModule':'',
            'installedModules':0,
            'modules' :[{}]
        },
        'sourceCount':0,
        'sources':[{}]
    };
    this.getSystemJson=function(){
        return _systemJson;
    }    
    this.signals={};
    this.addSignal=function(sourceId,lineId,signal){
        this.signals[sourceId+"_"+lineId]=signal;
    }
    this.getSignal=function(sourceId,lineId){
        return this.signals[sourceId+"_"+lineId]
    };
    
    this.connect=function(host,port,apikey,tout){
        var self=this;  //self=>iotDashboard
        if(_channel!=null){
            _channel.connectToPublisher(
                host, //'t4sm.blogdns.com', //IP ADDRESS
                port, //'8089', //PORT
                apikey, //'SCS', //API KEY
                tout //3600 //TIMEOUT
                );
            _connectionJsonString="{'host':"+host+",'port':"+port+",'apikey':"+apikey+",'tout ':"+tout+"}";
			$("#connectionlog").text('Connecting to host: '+host+':'+port);
            //add the event handlers of the channel (this part is now static...            
            _channel.connectionOpenedHandler= onConnectionOpened;
            _channel.connectionRefusedHandler =onConnectionRefused;
            _channel.connectionClosedHandler = onConnectionClosed;
            
            _channel.streamStartedHandler = onStreamStarted;
            _channel.streamStoppedHandler = onStreamClosed;                       
            
            _channel.analogDataArrivedHandler = function(){
                if(_channel.getAvailableAnalogDataCount() > 0){
                    var analogData = _channel.getAnalogData();
                    if (analogData!=null) {
                        if(analogData.num_channels>1){
                            for (var i = 0, len = analogData.channels.length; i < len; i++) {
                                //console.log(analogData.channels[i]);
                                $("#sid"+analogData.commonData.source_id+"cid"+i).html("<div>"+analogData.channels[i].toString().replace(/,/g, '<br>')+"</div>");
                                var anLine=self.getSignal(analogData.commonData.source_id, i);
                                if(anLine!= null){
                                    for (var ii = 0, len2 = analogData.channels[i].length; ii < len2; ii++) {
                                        anLine.addValue(analogData.channels[i][ii]);
                                    }
                                    anLine.redraw();
                                }
                            };
                        }else{
                            for (var i = 0, len = analogData.channels[0].length; i < len; i++) {
                                $("#sid"+analogData.commonData.source_id+"cid"+i).text(analogData.channels[0][i]);
                                var anLine=self.getSignal(analogData.commonData.source_id, i);
                                if(anLine!= null){
                                    anLine.addValue(analogData.channels[0][i]);
                                    anLine.redraw();
                                }
                            }
                        }
                    }

                }
                self.redrawCommon();
            }            
            
            _channel.digitalDataArrivedHandler = function(){
                if(_channel.getAvailableDigitalDataCount() > 0) {
                    var digitalData = _channel.getDigitalData();
                    if (digitalData != null){
                        for (var i = 0, len = digitalData.lines.length; i < len; i++) {
                            var id="sid"+digitalData.common_data.source_id+"cid"+i;
                            var dyLid=digitalData.common_data.source_id+"_"+i;
                            // FOR RAW DATA
                            if(digitalData.lines[i]){
                                $("#"+id).css('background-color',"#00FF00");
                            }else{
                                $("#"+id).css('background-color',"#FF4444");
                            }
                            $("#"+id).text(digitalData.lines[i].toString());
                            
                            // FOR SYGNALS
                            var dyLine=self.getSignal(digitalData.common_data.source_id, i);                            
                            if(dyLine!= null){                                
                                dyLine.setValue(digitalData.lines[i]);
                                dyLine.redraw();
                            }
                        }
                    }
                }
                self.redrawCommon();
            }
            
            //HANDLER OF THE SYSTEM CONFIGURATION
            _channel.customXMLDataArrivedHandler=function(){
                var customXMLData = _channel.getCustomXMLData();
                if (customXMLData != null){
                    //call the iotDash.buildGUI function
                    _configXml=$.parseXML(customXMLData.xml_data);
                                        
                    _systemJson.systemName=$(_configXml).find('systemName').text();
                    _systemJson.systemDescription=$(_configXml).find('systemDescription').text();
                    
                    _systemJson.systemAvailableProductTypes=$(_configXml).find('availableProductTypes').text();
                    _systemJson.systemMaxMotorSpeed=$(_configXml).find('maxMotorSpeed').text(); 
                    
                    var hwDescXml=$(_configXml).find('hardwareDescription');
                    _systemJson.systemHw.controllerModule=hwDescXml.find('controller').find('model').text();
                    _systemJson.systemHw.installedModules=hwDescXml.find('installedModules').text();
                    
                    var modules=[];                    
                    hwDescXml.find('module').each(function(){
                        modules.push({
                            'name':$(this).find('name').text(),
                            'slot':$(this).find('slot').text()
                        });
                    });                    
                    _systemJson.systemHw.modules=modules;                    
                    _systemJson.sourceCount=$(_configXml).find('sourceCount').text();
                    
                    var sources=[];                    
                    $(_configXml).find('source').each(function(){
                        var sourceid=$(this).find('id').text(),
                        desc=$(this).find('source description').text(),
                        tSource={
                            'id' : sourceid,
                            'description':desc,
                            'digitalDataCount':$(this).find('source digitalDataCount').text(),
                            'digitalData':[{}],
                            'analogDataCount':$(this).find('analogDataCount').text(),
                            'analogData':[{}]
                        };                            
                        if(tSource.digitalDataCount>0){
                            var ddata=[];
                            var i=0;
                            $(this).find('digitalData item').each(function(){
                                var name=$(this).find('name').text(),                                
                                desc=$(this).find('description').text(),
                                tddata={
                                    'name':name,
                                    'description':desc
                                };
                                ddata.push(tddata);
                                //DIGITAL SIGNALS IDENTIFICATION - refer to SCS specs document
                                sourceid=parseInt(sourceid);
                                switch(sourceid){
                                    case 1 :    //ALARMS SOURCE
                                        self.addSignal(sourceid,i,new AlarmDSignal(sourceid,i, name, desc,tddata));
										console.log('adding allarms: '+sourceid+' - '+i);
                                        break;
                                    case 2 :    //EVENTS SOURCE
                                        var eventSignal = new EventDSignal(sourceid,i, name, desc,tddata);
                                        if($('#iot-controls-'+sourceid+'-'+i+'-enable') && $('#iot-controls-'+sourceid+'-'+i+'-disable')){
                                            eventSignal.setButtons($('#iot-controls-'+sourceid+'-'+i+'-enable'),$('#iot-controls-'+sourceid+'-'+i+'-disable'));
                                        }
                                        self.addSignal(sourceid,i,eventSignal);
                                        break;
                                    case 3 :    //PRODUCT TYPES ENABLE SOURCE
                                        var ptypeSignal = new ProductTypeDSignal(sourceid,i, name, desc,tddata);
                                        if($('#iot-controls-'+sourceid+'-'+i+'-enable') && $('#iot-controls-'+sourceid+'-'+i+'-disable')){
                                            ptypeSignal.setButtons($('#iot-controls-'+sourceid+'-'+i+'-enable'),$('#iot-controls-'+sourceid+'-'+i+'-disable'));
                                        }
                                        self.addSignal(sourceid,i,ptypeSignal);
                                        break;
                                }
                                i++;
                            });                            
                            tSource.digitalData=ddata;
                        }
                        if(tSource.analogDataCount>0){
                            var adata=[];
                            var i=0;
                            $(this).find('analogData item').each(function(){
                                var name=$(this).find('name').text(),
                                desc=$(this).find('description').text(),
                                tadata={
                                    'name':$(this).find('name').text(),
                                    'description':$(this).find('description').text(),
                                    'minValue':$(this).find('minValue').text(),
                                    'maxValue':$(this).find('maxValue').text(),
                                    'units':$(this).find('units').text(),
                                    'samplingRate':$(this).find('samplingRate').text()
                                };
                                adata.push(tadata);
                                //DIGITAL SIGNALS IDENTIFICATION - refer to SCS specs document
                                sourceid=parseInt(sourceid);
                                var s;
                                switch(sourceid){
                                    case 100 :    //MOTOR SPEED
                                        s=new SpeedASignal(sourceid,i, name, desc,tadata);
                                        if(i==0){
                                            s.bartype="danger";
                                        }else{
                                            s.bartype="success";
                                        }
                                        self.addSignal(sourceid,i,s);
                                        break;
                                    case 101 :    //PRESSURE SOURCE
                                        self.addSignal(sourceid,i,new PressureASignal(sourceid,i, name, desc,tadata));
                                        break;
                                    case 200 :    //SLOW RATE SIGNAL SOURCE
                                        self.addSignal(sourceid,i,new SlowRateASignal(sourceid,i, name, desc,tadata));
                                        break;
                                    case 201 :    //PRODUCT COUNT SOURCE
                                        s=new ProductCountASignal(sourceid,i, name, desc,tadata);
                                        self.addSignal(sourceid,i,s);
                                        break;
                                }
                                i++;
                            });                            
                            tSource.analogData=adata;
                        }
                
                        sources.push(tSource);
                    });                   
                    _systemJson.sources=sources;
                    self.refreshGui();
                }else{
                    console.log('CustomXmlData is null!');
                }
            }
            //check if the sygnals are registered...
            
            console.log(self);
            
			/*
            _ready=true;
            _connected=true;
			*/
            return true;
        }else{
            _ready=false;
            _connected=false;
            console.log("Channel is null!");
            return false;
        }
    
        /* CHANNEL HANDLERS */
        function onConnectionOpened(){
            //start data stream
            _ready=true;
            _connected=true;
            console.log('Connection is opened.');
			$("#connectionlog").text('Connection now open!');
			self.startStream();
        //To stop data stream, call:
        //scctChannel.stop();
        }

        /*
        * Connection refused message
        */
        function onConnectionRefused(){
            console.log('Connection is refused, because:');
            console.log(_channel.reasonOfConnectionFailure);
			$("#connectionlog").text('Connection refused!');
            _ready=false;
            _connected=false;
			alert('Unable to connect, connection refused!');
			$('#connectionModal').modal({keyboard: false,backdrop:"static"});
        }

        /*
        * Connection closed message
        */
        function onConnectionClosed(){
            console.log('Connection is closed.');
            _connected=false;
        }

        /*
        * Stream started message
        */
        function onStreamStarted(){
            console.log('The stream is started');
			$("#streamlog").text('Stream started!');
            _connected=true;
        }

        /*
        * Stream stopped message
        */
        function onStreamClosed(){
            console.log('The stream is stopped');
			$("#streamlog").text('Stream closed!');
        }       
    }
    
    this.refreshGui=function(){
        // DOM Nodes
        var _systemNameNode=$("#system_name");
        var _systemDescriptionNode=$("#system_description");
        var _systemConnectionParametersNode=$("#system_conn_parameters");
        var _systemAvailableProductTypesNode=$("#system_availableProductTypes");
        var _systemMaxMotorSpeedNode=$("#system_maxMotorSpeed");
        var _systemHwNode=$("#system_hw");      
        var _rowdataNode=$("#iot-rowdata");
        //ROWDATA
        if(_systemJson!=null){
            console.log(_systemJson);
            //Config string...
            $(_systemConnectionParametersNode).html("<pre>"+_connectionJsonString+"</pre>");           
           
            // build/rebuild the gui
            $(_systemNameNode).html(_systemJson.systemName);            
            $(_systemDescriptionNode).html(_systemJson.systemDescription);           
            $(_systemAvailableProductTypesNode).html(_systemJson.systemAvailableProductTypes);            
            $(_systemMaxMotorSpeedNode).html(_systemJson.systemMaxMotorSpeed);
            
            var hwTpl="<div>"
            +_systemJson.systemHw.controllerModule
            +" [Moduli installati: "+_systemJson.systemHw.installedModules+"]"
            +"<ul>";
            $.each(_systemJson.systemHw.modules,function(){
                hwTpl = hwTpl + "<li>Name: " + this.name;
                hwTpl = hwTpl + " - Slot: " + this.slot+"</li>";
            });
            hwTpl = hwTpl +"</ul></div>";
            
            $(_systemHwNode).html(hwTpl);
            
            
            var channelsTpl=$("<div/>",{
                'class':'channel span12 well'
            });
            var channelTplUl=$("<ul/>");
            //
            $.each(_systemJson.sources,function(){
                var source=this;
                var sourceTpl=$("<li>id: "+source.id+"<br>"
                    +"description: "+source.description+"<br>"
                    +"# digital channels: "+source.digitalDataCount+"<br>"
                    +"# analogic channels: "+source.analogDataCount+"</li>");
                if(source.digitalDataCount>0){
                    var tableTpl="<table class='table table-striped table-bordered'><thead><tr><th>Name</th><th>Description</th><th>Valore</th></tr></thead><tbody>";
                    var i=0;
                    $.each(source.digitalData,function(){                               
                        tableTpl=tableTpl+"<tr><td>"+this.name
                        +"</td><td>"
                        +this.description+"</td><td><span id='sid"+source.id+"cid"+i+"'>n.d.</span></td></tr>";
                        i++;
                    });
                    tableTpl=tableTpl+"</tbody></table>";
                    $(sourceTpl).append(tableTpl);
                }
                if(source.analogDataCount>0){
                    var tableTpl="<table class='table table-striped table-bordered'><thead><tr><th>Name</th><th>Description</th><th>Min</th><th>Max</th><th>Units</th><th>SamplingRate</th><th>Current value</th></tr></thead><tbody>";
                    var i=0;
                    $.each(source.analogData,function(){                               
                        tableTpl=tableTpl+"<tr><td>"+this.name
                        +"</td><td>"+this.description
                        +"</td><td>"+this.minValue
                        +"</td><td>"+this.maxValue
                        +"</td><td>"+this.units
                        +"</td><td>"+this.samplingRate
                        +"</td><td id='sid"+source.id+"cid"+i+"'>n.d.</td>"
                        +"</tr>";
                        i++;
                    });
                    tableTpl=tableTpl+"</tbody></table>";
                    $(sourceTpl).append(tableTpl);
                }
                $(channelTplUl).append(sourceTpl);                
            })
            $(_rowdataNode).append(channelsTpl.append(channelTplUl));
            
        //$(_channelsNode).append(channelTpl);        
        }
        
        //console.log(this.signals);
        //DYNAMIC ELEMENTS
        $.each(this.signals,function(){
            this.render();
        });
    }
   
   
   
    //var allPressureChart=new google.visualization.ColumnChart(document.getElementById("all-pressure-chart"));
    this.redrawAllPressureChart=function(){
        /*
        //CREATE A GRAPH FOR ALL PRESSURE SIGNALS...
        var options = {
            width: 400,
            height: 240,
            vAxis: {
                minValue:0, 
                maxValue:1000
            },
            animation: {
                duration: 1000,
                easing: 'out'
            }
        };
        var data = new google.visualization.DataTable();
        // ADD ALL THE PRESSURE SIGNALS...
        var pb1=this.getSignal(101,0);
        var pb2=this.getSignal(101,1);
        var pb3=this.getSignal(101,2);
        var pb4=this.getSignal(101,3);
        var pb5=this.getSignal(101,4);
        var pb6=this.getSignal(101,5);
        var pb7=this.getSignal(101,6);
        var pb8=this.getSignal(101,7);        

        data.addColumn('string', 'Blade');
        data.addColumn('number', 'PA');
        for (var i = 0, len = 8; i < len; i++) {            
            var pb=this.getSignal(101,i);
            //data.addRow([pb.conf.name, pb.data[pb.data.length-1]]);            
        }
        
        allPressureChart.draw(data, options);
        */
    }
	
    /*
     * Function to send commands from the client to the server.
     */
    this.sendMessageData=function(message,code){
        console.log("Sending message: "+message+"; "+code);
        _channel.sendMessageData(message,code,1,"IOT Dashboard HTML5 client");
    }
    
    this.disconnect=function(){
        console.log("Disconnecting from server...");
		stopStream();
        if(_connected){
            _channel.close();
            _connected=false;
            _ready=false;
        }
    }     
    
    this.startStream=function(){
        if(_ready && _connected){
            var _pulseImg=$("#pulse");
            $(_pulseImg).attr('src','/app/img/green-light.png').fadeIn('fast');            
            console.log("Starting stream...");
            _channel.start();
        }

    }
    
    this.stopStream=function(){
        if(_ready && _connected){
            var _pulseImg=$("#pulse");
            $(_pulseImg).attr('src','/app/img/red-light.png').fadeIn('fast');            
            console.log("Stopping stream...");
            _channel.stop();
        }        
    }    
    
    this.redrawCommon=function(){        
        //common speed graph.... 
        var maxSpeed=this.getSignal(100, 0);
        var currSpeed=this.getSignal(100, 1);        
        //update the common speed chart...                
        $("#speedChart").find(".mratio").replaceWith("<p class='mratio'><b>Motor ratio:</b><br>"+currSpeed.currentValue+"/"+maxSpeed.currentValue+" "+maxSpeed.conf.units+"</p>");
        //WARNING SPEED!
        if(currSpeed.currentValue-maxSpeed.currentValue>0){
            $("#"+currSpeed.sourceId+"_"+currSpeed.lineId+"_ch").css('width','100%');
            $("#"+maxSpeed.sourceId+"_"+maxSpeed.lineId+"_ch").css('width','0%');
            $("#"+currSpeed.sourceId+"_"+currSpeed.lineId+"_ch").removeClass('bar-success').addClass('bar-warning');
        }else{
            $("#"+currSpeed.sourceId+"_"+currSpeed.lineId+"_ch").css('width',currSpeed.currentValue/maxSpeed.currentValue*100+'%');
            $("#"+maxSpeed.sourceId+"_"+maxSpeed.lineId+"_ch").css('width',(1-currSpeed.currentValue/maxSpeed.currentValue)*100+'%');
            $("#"+currSpeed.sourceId+"_"+currSpeed.lineId+"_ch").addClass('bar-success').removeClass('bar-warning');
            $("#speedChart .alert").replaceWith($('<div class="alert" />'));
        }   
        
        
    }
}