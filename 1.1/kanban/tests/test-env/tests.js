var assert = chai.assert;

class StepableDummie{
    work = 5;
    last_step_done=false;
    // process to do on each loop round
    step(){
        this.work--;
    }
    
    // return boolean to validate if process is over or not
    is_not_done(){
        return this.work >0;
    }
    
    // action to do, after thread is over
    last_step(){
        this.last_step_done=true;
    }
}

var sd = new StepableDummie();
var th = new Thread(sd);
        

describe("Thread", function() {

    beforeEach(function() {
        sd = new StepableDummie();
        th = new Thread(sd);
        th.step_delay = 4;
        th.max_loop = 4;
    });
    after(function() { });

    it("Sync: last_step_done is not done immediately", function() {
        th.start();
    	assert.isFalse(sd.last_step_done);
    });

});

