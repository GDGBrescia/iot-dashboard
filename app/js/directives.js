'use strict';

/* Directives */


angular.module('iotDash.directives', [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    
    }])
    .directive('regexValidate', function() {
        return {
            // restrict to an attribute type.
            restrict: 'A',
        
            // element must have ng-model attribute.
            require: 'ngModel',
        
            // scope = the parent scope
            // elem = the element the directive is on
            // attr = a dictionary of attributes on the element
            // ctrl = the controller for ngModel.
            link: function(scope, elem, attr, ctrl) {
            
                //get the regex flags from the regex-validate-flags="" attribute (optional)
                var flags = attr.regexValidateFlags || '';
            
                //create the regex obj.
                var regex = new RegExp(attr.regexValidate, flags);
            
                //test and set the INITIAL validity for regexValidate.
                ctrl.$setValidity('regexValidate', regex.test(ctrl.$viewValue));
            
                //add a parser that will process each time the value is 
                // parsed into the model when the user updates it.
                ctrl.$parsers.unshift(function(value) {
                
                    //test ans set the validity after update.
                    ctrl.$setValidity('regexValidate', regex.test(value));
                
                    //return the value, this is important or you will not see the model 
                    // updating, because the parser is returning nothing.
                    return value;
                });
            }
        }
    })
    .directive('maxValue',function(){
        return {
            // restrict to an attribute type.
            restrict: 'A',
        
            // element must have ng-model attribute.
            require: 'ngModel',
            // scope = the parent scope
            // elem = the element the directive is on
            // attr = a dictionary of attributes on the element
            // ctrl = the controller for ngModel.
            link: function(scope, elem, attr, ctrl) {
            
                //get the max value flags from the max-value
                var max = attr.maxValue || '0';                
                ctrl.$setValidity('maxValue', parseInt(ctrl.$viewValue) < parseInt(max));
            
                //add a parser that will process each time the value is 
                // parsed into the model when the user updates it.
                ctrl.$parsers.unshift(function(value) {
                    //test ans set the validity after update.
                    ctrl.$setValidity('maxValue', parseInt(ctrl.$viewValue) < parseInt(max));
                    //return the value, this is important or you will not see the model 
                    // updating, because the parser is returning nothing.
                    return value;
                });
            }
        }
    }).
    directive('maxValue',function(){
        return {
            // restrict to an attribute type.
            restrict: 'A',
        
            // element must have ng-model attribute.
            require: 'ngModel',
            // scope = the parent scope
            // elem = the element the directive is on
            // attr = a dictionary of attributes on the element
            // ctrl = the controller for ngModel.
            link: function(scope, elem, attr, ctrl) {
            
                //get the max value flags from the max-value
                var max = attr.maxValue || '0';                
                ctrl.$setValidity('maxValue', parseInt(ctrl.$viewValue) < parseInt(max));
            
                //add a parser that will process each time the value is 
                // parsed into the model when the user updates it.
                ctrl.$parsers.unshift(function(value) {
                    //test ans set the validity after update.
                    ctrl.$setValidity('maxValue', parseInt(ctrl.$viewValue) < parseInt(max));
                    //return the value, this is important or you will not see the model 
                    // updating, because the parser is returning nothing.
                    return value;
                });
            }
        }
    });