'use strict';


// Declare app level module which depends on filters, and services
var iotDash=angular.module('iotDash', ['iotDash.filters', 'iotDash.services', 'iotDash.directives']);


iotDash.config(function($routeProvider) {
    $routeProvider.
    when('/connect', {
        templateUrl: 'partials/connect.html', 
        controller: ServerCtrl
    }).
    when('/view2', {
        templateUrl: 'partials/partial2.html', 
        controller: MyCtrl2
    }).
    otherwise({
        redirectTo: '/connect'
    });
});

iotDash.factory('time',function($timeout){
    var time={};
    (function tick() {
        time.now = new Date().toString();
        $timeout(tick, 1000);
    })();
    return time;
});

