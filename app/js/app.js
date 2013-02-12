/*
 *
 *
 *
 **/

function iotDashboard(channel) {//},driver){
    
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
    this._channel=channel;
    // GETTER/SETTER
    this.getChannel=function(){
        return this._channel;
    }
    this.setChannel=function(ch){
        if(this.isStarted() && ch!=null){
            this.stopStream();
            this.setConnected(false);
            this._channel=ch;
        }
    }
    
    //this._driver=driver;
    
    this.connect=function(host,port,apikey,tout){
        var self=this;  //self=>iotDashboard
        if(self.getChannel()!=null){
           self.getChannel().connectToPublisher(
                host, //'t4sm.blogdns.com', //IP ADDRESS
                port, //'8089', //PORT
                apikey, //'SCS', //API KEY
                tout //3600 //TIMEOUT
                );
            //add the event handlers of the channel (this part is now static...            
            self.getChannel().connectionOpenedHandler= function(){
                //start data stream
                _ready=true;
                console.log("Channel is ready: "+_ready);
            //To stop data stream, call:
            //scctChannel.stop();
            };
        }
        self.setReady(_ready);
        
    }
    
    this.startStream=function(){
        if(this.isReady()){
            this.getChannel().start();
        }
        
    }
    
    
    
    
}