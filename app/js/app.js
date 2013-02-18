
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
    
    this.signals=[];    
    this.addSignal=function(signal){
        this.signals.push(signal);
    }
    this.getSignal=function(sourceId,lineId){
        var signal=null;
         $.each(this.signals, function(key,value){
           if(value.sourceId==sourceId && value.lineId==lineId){
               signal=this;
               return false;
           }
           return true;
        });
        return signal;
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
            //add the event handlers of the channel (this part is now static...            
            _channel.connectionOpenedHandler= onConnectionOpened();
            _channel.connectionRefusedHandler =onConnectionRefused();
            _channel.connectionClosedHandler = onConnectionClosed();
            
            _channel.streamStartedHandler = onStreamStarted();
            _channel.streamStoppedHandler = onStreamClosed();                       
            
            _channel.analogDataArrivedHandler = function(){
                if(_channel.getAvailableAnalogDataCount() > 0){
                    var analogData = _channel.getAnalogData();
                    if (analogData!=null) {
                        if(analogData.num_channels>1){
                            $.each(analogData.channels, function(key, value){
                                var id="sid"+analogData.commonData.source_id+"cid"+key;
                                $("#"+id).text(value.toString());
                            });
                        }else{
                            $.each(analogData.channels[0], function(key, value){
                                var id="sid"+analogData.commonData.source_id+"cid"+key;                                
                                $("#"+id).text(value);
                            });
                        }
                    }

                }    
            }            
            
            _channel.digitalDataArrivedHandler = function(){
                if(_channel.getAvailableDigitalDataCount() > 0) {
                    var digitalData = _channel.getDigitalData();
                    if (digitalData != null){
                        $.each(digitalData.lines, function(key, value){
                            var id="sid"+digitalData.common_data.source_id+"cid"+key;
                            var dyLid=digitalData.common_data.source_id+"_"+key;
                            if(value){
                                $("#"+id).css('background-color',"#00FF00");
                                //$("#"+dyLid).css('background-color',"#00FF00");
                            }else{
                                $("#"+id).css('background-color',"#FF4444");
                                //$("#"+dyLid).css('background-color',"#FF4444");
                            }
                            $("#"+id).text(value);
                            //$("#"+dyLid).text(value);
                            //$("#"+dyLid).parent().removeClass('status-'+(!value)).addClass('status-'+value);
                            var dyLine=self.getSignal(digitalData.common_data.source_id, key);
                            if(dyLine!= null){
                                console.log(dyLid);
                                console.log(dyLine)
                                dyLine.setValue(value);
                                dyLine.redraw();
                            }
                        });
                    }
                }
            }
            
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
                                desc=$(this).find('description').text();
                                ddata.push({
                                    'name':name,
                                    'description':desc
                                });
                                //DIGITAL SIGNALS IDENTIFICATION - refer to SCS specs document
                                sourceid=parseInt(sourceid);
                                switch(sourceid){
                                    case 1 :    //ALARMS SOURCE
                                        self.addSignal(new AlarmDSignal(sourceid,i, name, desc));
                                        break;
                                    case 2 :    //EVENTS SOURCE
                                        self.addSignal(new EventDSignal(sourceid,i, name, desc));
                                        break;
                                    case 3 :    //PRODUCT TYPES ENABLE SOURCE
                                        self.addSignal(new ProductTypeDSignal(sourceid,i, name, desc));
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
                                adata.push({
                                    'name':$(this).find('name').text(),
                                    'description':$(this).find('description').text(),
                                    'minValue':$(this).find('minValue').text(),
                                    'maxValue':$(this).find('maxValue').text(),
                                    'units':$(this).find('units').text(),
                                    'samplingRate':$(this).find('samplingRate').text()
                                });
                                //DIGITAL SIGNALS IDENTIFICATION - refer to SCS specs document
                                sourceid=parseInt(sourceid);
                                switch(sourceid){
                                    case 100 :    //MOTOR SPEED
                                        self.addSignal(new SpeedASignal(sourceid,i, name, desc));
                                        break;
                                    case 101 :    //GENERAL ANALOGIC SOURCE
                                        self.addSignal(new ASignal(sourceid,i, name, desc));
                                        break;
                                    case 200 :    //SLOW RATE SIGNAL SOURCE
                                        self.addSignal(new SlowRateASignal(sourceid,i, name, desc));
                                        break;
                                    case 201 :    //PRODUCT COUNT SOURCE
                                        self.addSignal(new ProductCountASignal(sourceid,i, name, desc));
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
            _ready=true;
            _connected=true;
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
            console.log("Channel is ready: "+_ready);
        //To stop data stream, call:
        //scctChannel.stop();
        }

        /*
        * Connection refused message
        */
        function onConnectionRefused(){
            console.log('Connection is refused');
            console.log(_channel.reasonOfConnectionFailure);
            _ready=false;
            _connected=false;
        }

        /*
        * Connection closed message
        */
        function onConnectionClosed(){
            console.log('Connection is closed');
            _connected=false;
        }

        /*
        * Stream started message
        */
        function onStreamStarted(){
            console.log('The connection is started');
            _connected=true;
        }

        /*
        * Stream stopped message
        */
        function onStreamClosed(){
            console.log('The connection is stopped');

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
        var _alarmsNode=$("#iot-alarms");
        var _eventsNode=$("#iot-events");
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
            
            $.each(_systemJson.sources,function(){
                var source=this;
                var sourceTpl=$("<li>id: "+source.id+"<br>"
                    +"description: "+source.description+"<br>"
                    +"# digital channels: "+source.digitalDataCount+"<br>"
                    +"# analogic channels: "+source.analogDataCount+"</li>");
                if(source.digitalDataCount>0){
                    var tableTpl="<table><tr><th>Name</th><th>Description</th><th>Valore</th></tr>";
                    var i=0;
                    $.each(source.digitalData,function(){                               
                        tableTpl=tableTpl+"<tr><td>"+this.name
                        +"</td><td>"
                        +this.description+"</td><td id='sid"+source.id+"cid"+i+"'>n.d.</td></tr>";
                        i++;
                    });
                    tableTpl=tableTpl+"</table>";
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
        
        //DYNAMIC ELEMENTS
        $.each(this.signals,function(){
            if(this instanceof AlarmDSignal){
                this.render(_alarmsNode);
            }
            if(this instanceof EventDSignal){
                this.render(_eventsNode);
            }
        });
    }
    
    this.disconnect=function(){
    
        console.log("Disconnect from server...");
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
            console.log("Stream started...");
            _channel.start();
        }

    }
    
    this.stopStream=function(){
        if(_ready && _connected){
            var _pulseImg=$("#pulse");
            $(_pulseImg).attr('src','/app/img/red-light.png').fadeIn('fast');            
            console.log("Stream stopped...");
            _channel.stop();
        }
        
    }    
}