function iotDashboard(channel) {//},driver){
    
    //The dashboard is connected to the server
    this._connected=false;
    this._ready=false;
    //Connected GETTER
    this.isConnected=function(){
        return this._connected;
    };    
    this.setConnected=function(connected){
        this._connected=connected;
    }
    this.isReady=function(){
        return this._ready;
    };
    this.setReady=function(ready){
        this._ready=ready;
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
        if(this.getChannel()!=null){
            this.getChannel().connectToPublisher(
                host, //'t4sm.blogdns.com', //IP ADDRESS
                port, //'8089', //PORT
                apikey, //'SCS', //API KEY
                tout //3600 //TIMEOUT
                );
            //add the event handlers of the channel (this part is now static...
            this.getChannel().connectionOpenedHandler= function(){
                //start data stream
                this.setReady(true);
                console.log("Channel is ready: "+this.isReady());
            //To stop data stream, call:
            //scctChannel.stop();
            };
        }
        
    }
    
    this.startStream=function(){
        if(this.isReady()){
            this.getChannel().start();
        }
        
    }
    
    
    
    
}