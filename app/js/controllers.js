'use strict';

/* Controllers */
// 
// Notice that you can simply ask for time
// and it will be provided. No need to look for it.
function ClockCtrl($scope, time) {
  $scope.time = time;
}

function ServerCtrl($scope) {
    $scope.serverDefaults={
        'host' : 't4sm.blogdns.com',
        'port' : 8089,
        'apikey' : 'SCS',
        'tout': 10  
    };    
    
    $scope.serverConfig=$scope.server={};
     
    $scope.tryConnect=function(s){
        $scope.serverConfig=angular.copy(s);
        $scope.$apply();
        console.log(s);
        console.log($scope.serverConfig);
    };
        
    $scope.resetConnection=function(){
        $scope.server=angular.copy($scope.serverDefaults);
        $scope.$apply();
    }
}



function MyCtrl2() {
}
MyCtrl2.$inject = [];
