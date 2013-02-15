/* NEW FUNCTION FOR EASY INHERITANCE */
Function.prototype.inherits=function(superclass){
    //var tmp=function(){};
    //tmp.prototype=superclass.prototype;
    this.prototype=new superclass();
}