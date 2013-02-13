/*
 *
 *
 *
 **/

function iotDashboard(channel){ //},driver){
    
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
    
    
    //this._driver=driver;
    
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
                        console.log(analogData);
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
                        console.log(digitalData);
                        $.each(digitalData.lines, function(key, value){
                            var id="sid"+digitalData.common_data.source_id+"cid"+key;
                            $("#"+id).text(value);
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
                        var tSource={
                            'id' : $(this).find('id').text(),
                            'description':$(this).find('source description').text(),
                            'digitalDataCount':$(this).find('source digitalDataCount').text(),
                            'digitalData':[{}],
                            'analogDataCount':$(this).find('analogDataCount').text(),
                            'analogData':[{}]
                        }
                        if(tSource.digitalDataCount>0){
                            var ddata=[];
                            $(this).find('digitalData item').each(function(){
                                ddata.push({
                                    'name':$(this).find('name').text(),
                                    'description':$(this).find('description').text()
                                });
                            });
                            tSource.digitalData=ddata;
                        }
                        if(tSource.analogDataCount>0){
                            var adata=[];
                            $(this).find('analogData item').each(function(){
                                adata.push({
                                    'name':$(this).find('name').text(),
                                    'description':$(this).find('description').text(),
                                    'minValue':$(this).find('minValue').text(),
                                    'maxValue':$(this).find('maxValue').text(),
                                    'units':$(this).find('units').text(),
                                    'samplingRate':$(this).find('samplingRate').text()
                                });
                            });                            
                            tSource.analogData=adata;
                        }
                
                        sources.push(tSource);
                    });                   
                    _systemJson.sources=sources;
                    
                    self.refreshGui();
                }
            }
            _ready=true;
        }
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
    }

    /*
    * Stream started message
    */
    function onStreamStarted(){
        console.log('The connection is started');

    }

    /*
    * Stream stopped message
    */
    function onStreamClosed(){
        console.log('The connection is stopped');

    }
    
    this.startStream=function(){
        console.log(this.isReady());
        if(this.isReady()){
            console.log("Stream started...");
            _channel.start();
        }
        
    }
     this.stopStream=function(){
        console.log(this.isReady());
        if(this.isReady()){
            console.log("Stream stopped...");
            _channel.stop();
        }
        
    }
    
    this.pulse=function(){
        var _pulseImg=$("#pulse");
        $(_pulseImg).attr('src','/app/img/green-light.png').fadeIn('fast', function(){
            $(this).attr('src','/app/img/red-light.png');
        });
    }
    
    // This function bind to the interface...
    this.refreshGui=function(){
        // DOM Nodes
        var _systemNameNode=$("#system_name");
        var _systemDescriptionNode=$("#system_description");
        var _systemConnectionParametersNode=$("#system_conn_parameters");
        var _systemAvailableProductTypesNode=$("#system_availableProductTypes");
        var _systemMaxMotorSpeedNode=$("#system_maxMotorSpeed");
        var _systemHwNode=$("#system_hw");      
        var _channelsNode=$("#iot_channels");
        
        if(_systemJson!=null){
            
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
                    var tableTpl="<table><tr><th>Name</th><th>Description</th><th>Min</th><th>Max</th><th>Units</th><th>SamplingRate</th><th>Current value</th></tr>";
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
                    tableTpl=tableTpl+"</table>";
                    $(sourceTpl).append(tableTpl);
                }
                $(channelTplUl).append(sourceTpl);                
            })
            $(_channelsNode).append(channelsTpl.append(channelTplUl));
            
            //$(_channelsNode).append(channelTpl);
            
            console.log(_systemJson);
        }        
    }   
    
}