/* CopyLeft (attribution): Daniel Ceillan 2021 codigodaniel@gmail.com */

/* features
+ start event 
+ avoid multiple threads (singleton)
+ end event callback
+ stop thread
*/

/** HOW TO USE 

Stepable contract

class Stepable{

	// process to do on each loop round
	step(){}
	
	// boolean to validate if process is over or not
	is_not_done(){}
	
	// action to do, after thread is over
	last_step(){}
}

/**/

class Thread{
    step_delay = 500; 
    play = true;
    max_loop = 500;
    stepable;
    
    constructor(stepable){
    	this.stepable = stepable;
    }

    is_active(){
    	return (this.play && this.max_loop);
    }
    stop(){
        this.play = false;
    }

    start(max_loop = 500){
    	this.play = true;
    	this.loop(this);
    }

    loop(self){
        if(self.is_active() && self.stepable.is_not_done()){
        	self.max_loop--;
        	self.stepable.step();
            setTimeout(function(){ return self.loop(self); },self.step_delay);
	    }else{
            this.play = false;
	    	self.stepable.last_step();
	    }
    }
}
