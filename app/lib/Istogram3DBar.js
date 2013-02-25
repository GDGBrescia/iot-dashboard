/*
 * Use this object to create a new isgoram bar.
 * Needs the wrapper element, that should have a fixed height.
 */
function Istogram3DBar (wrapperElement) {

	this._wrapper=wrapperElement;
	
	this._container=document.createElement('div');
	this._container.className='istogram-container';
	
	this._topFace=document.createElement('div');
	this._topFace.className='topFace';
	this._topFace.innerHTML='<div><p>&nbsp;</p></div>';
	
	this._leftFace=document.createElement('div');
	this._leftFace.className='leftFace';
	//this._leftFace.innerHTML='<h2 class="rotate-clockwise">Left</h2><p>&nbsp;</p>';
        this._leftFace.innerHTML='<p>&nbsp;</p>';
	
	this._rightFace=document.createElement('div');
	this._rightFace.className='rightFace';
	//this._rightFace.innerHTML='<h2 class="rotate-counterclockwise">Right</h2><p>&nbsp;</p>';
        this._rightFace.innerHTML='<p>&nbsp;</p>';
	
	this._container.appendChild(this._topFace);
	this._container.appendChild(this._leftFace);
	this._container.appendChild(this._rightFace);
	this._wrapper.appendChild(this._container);
	
	this._rTop=245;
	this._gTop=10;
	this._bTop=10;
	this._rBottom=10;
	this._gBottom=10;
	this._bBottom=245;
	
	/* helper function that gives you the gradient style */	
	this._gradientHelper=function(rBottom,gBottom,bBottom,rTop,gTop,bTop){
	return 	'background-image: linear-gradient(bottom, rgb('+rBottom+','+gBottom+','+bBottom+') 0%, rgb('+rTop+','+gTop+','+bTop+') 75%);'+
	'background-image: -o-linear-gradient(bottom, rgb('+rBottom+','+gBottom+','+bBottom+') 0%, rgb('+rTop+','+gTop+','+bTop+') 75%);'+
	'background-image: -moz-linear-gradient(bottom, rgb('+rBottom+','+gBottom+','+bBottom+') 0%, rgb('+rTop+','+gTop+','+bTop+') 75%);'+
	'background-image: -webkit-linear-gradient(bottom, rgb('+rBottom+','+gBottom+','+bBottom+') 0%, rgb('+rTop+','+gTop+','+bTop+') 75%);'+
	'background-image: -ms-linear-gradient(bottom, rgb('+rBottom+','+gBottom+','+bBottom+') 0%, rgb('+rTop+','+gTop+','+bTop+') 75%);';
	}
}

/* Just in case you need to chage colors... */
Istogram3DBar.prototype.setTopColor=function(red,green,blue){
	this._rTop=red;
	this._gTop=green;
	this._bTop=blue;
}
Istogram3DBar.prototype.setBottomColor=function(red,green,blue){
	this._rBottom=red;
	this._gBottom=green;
	this._bBottom=blue;
}


/*
 * Sets the new height of the bar, as % of wrapper element. The height should be between a number between 0 and 100.
 */
Istogram3DBar.prototype.setHeight=function(height){
	if (height<100 && height>0){
		//sets height of side faces ad position of top face
		this._leftFace.style.height=height+'%';
		this._rightFace.style.height=height+'%';
		this._topFace.style.bottom=(height+1.5)+'%';
		
		//if needs to fix colors
		if (this._rTop!=this._rBottom || this._gTop!=this._gBottom || this._gTop!=this._gBottom){
			//linear interpolation between top and bottom colors for top face
			var rTemp=Math.round((this._rTop-this._rBottom)*height/100+this._rBottom);
			var gTemp=Math.round((this._gTop-this._gBottom)*height/100+this._gBottom);
			var bTemp=Math.round((this._bTop-this._bBottom)*height/100+this._bBottom);
			this._topFace.children[0].style.backgroundColor='rgb('+rTemp+','+gTemp+','+bTemp+')';
			
			//set gradient for side faces
			this._leftFace.style.backgroundImage='';
			//make left a little darker
			this._leftFace.style.cssText+=this._gradientHelper(this._rBottom-16,this._gBottom-16,this._bBottom-16,rTemp-16,gTemp-16,bTemp-16);
			this._rightFace.style.backgroundImage='';
			//and right a little brigher
			this._rightFace.style.cssText+=this._gradientHelper(this._rBottom+16,this._gBottom+16,this._bBottom+16,rTemp+16,gTemp+16,bTemp+16);
			
			//maybe better check that darker and brighetr colors are still valid numbers??
		}
	}

}




