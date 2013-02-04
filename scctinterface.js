/**
 *  File: SCCT Interface
 *  Author: Rimon Soliman - GDG Brescia
 *  Last Modified Date: 2013-02-04 13.59
**/


var scctChannel = new SCCTChannel();

/*
 * Init the interface
 * Connection parameters needed
 **/
function init(){
    scctChannel.connectToPublisher(
        '10.0.0.1', //IP ADDRESS
        '8080', //PORT
        'JFSMSKFV83H0834HG0', //API KEY
        3600 //TIMEOUT
    );
}

/* 
 * The connection in opened
*/
scctChannel.connectionOpenedHandler = function(){
    //start data stream
    scctChannel.start();
    
    //To stop data stream, call:
    //scctChannel.stop();
}

/*
 * Generic "New Data" event
 */
scctChannel.genericDataArrivedHandler = function(){
    if(scctChannel.getAvailableAnalogDataCount() > 0){
        var analogData = scctChannel.getAnalogData();
       
    } else if(scctChannel.getAvailableDigitalDataCount() > 0){
        var digitalData = scctChannel.getDigitalData();
        
    } else {
        //add implementation for all data tyes if you don't want 
        //use specific event handlers
    }
}


/*
 * New analog data event
 */
scctChannel.analogDataArrivedHandler = function(){
    if(scctChannel.getAvailableAnalogDataCount() > 0){
        var analogData = scctChannel.getAnalogData();
        if (analogData!=null) {
            console.log(analogData);
            //...
        }

    }    
}

/*
 * New digital data event
 */
scctChannel.digitalDataArrivedHandler = function(){
    if(scctChannel.getAvailableDigitalDataCount() > 0) {
        var digitalData = scctChannel.getDigitalData();
        if (digitalData != null){
            console.log(digitalData);
            //...
        }
    }
}


/*
 * New configuration data event
 */
scctChannel.configurationDataArrivedHandler = function(){
    if(scctChannel.getAvailableConfigurationDataCount() > 0) {
        var configurationData = scctChannel.getConfigurationData();
        if (configurationData != null){
            console.log(configurationData);
            //...
        }
    }
}


/*
 * New custom xml data event
 */
scctChannel.customXMLDataArrivedHandler = function(){
    if(scctChannel.getAvailableCustomXMLDataCount() > 0) {
        var customXMLData = scctChannel.getCustomXMLData();
        if (customXMLData != null){
            console.log(customXMLData);
            //...
        }
    }
}

/*
 * New message data event
 */
scctChannel.messageDataArrivedHandler = function(){
    if(scctChannel.getAvailableMessageDataCount() > 0) {
        var messageData = scctChannel.getMessageData();
        if (messageData != null){
            console.log(messageData);
            //...
        }
    } 
}

/*
 * New image data event
 */
scctChannel.imageDataArrivedHandler = function(){
    if(scctChannel.getAvailableImageDataCount() > 0) {
        var imageData = scctChannel.getImageData();
        if (imageData != null){
            console.log(imageData);
            //...
        }
    }   
}

/*
 * New file data event
 */
scctChannel.fileDataArrivedHandler = function(){
    if(scctChannel.getAvailableFileDataCount() > 0) {
        var fileData = scctChannel.getFileData();
        if (fileData != null){
            console.log(fileData);
            //...
        }
    }  
}

/*
 * New lovation data event
 */
scctChannel.newLocationDataArrivedHandler = function(){
    if(scctChannel.getAvailableNewLocationDataCount() > 0) {
        var newLocationData = scctChannel.getNewLocationData();
        if (newLocationData != null){
            console.log(newLocationData);
            //...
        }
    } 
}


/*
 * Connection refused message
 */
scctChannel.connectionRefusedHandler = function(){
    console.log('Connection is refused');
}

/*
 * Connection closed message
 */
scctChannel.connectionClosedHandler = function(){
    console.log('Connection is closed');
}


/*
 * Stream started message
 */
scctChannel.streamStartedHandler = function(){
    console.log('The connection is started');
    
}


/*
 * Stream stopped message
 */
scctChannel.streamStoppedHandler = function(){
    console.log('The connection is stopped');
    
}


init();