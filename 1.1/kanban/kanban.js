
class SchwarzKanbanGame{

    change_wip(delta = 1){
        let value = document.getElementById("kanban-game-wip").value;
        let new_value = 0;
        if(value == "infinite" && delta > 0) new_value = delta;
        value  = parseInt(value);
        if(value > 0) new_value = value + delta;
        if(new_value == 0) new_value = "infinite";
        document.getElementById("kanban-game-wip").value = new_value;
    }

    change_swimlane_policy(swimlane_id, delta = 1){
        let dom_id = "kanban-game-lane-"+swimlane_id;
        let value = document.getElementById(dom_id).innerHTML;
        let new_value = 0;
        if(value == "infinite" && delta > 0) new_value = delta;
        value  = parseInt(value);
        if(value > 0) new_value = value + delta;
        if(new_value == 0) new_value = "infinite";
        document.getElementById(dom_id).innerHTML = new_value;
    }
}

class TicketsHandler{
    backlog = [];
    wip = [];
    done = [];
    board_id = '';
    current_ticket = 0;
    step_delay = 300; 
    backlog_size = 10;

    constructor(){
        
    }

    init(){
        for (var i = 1; i <  this.backlog_size ; i++) {
            let kt = new KanbanTicket(i);
            kt.board_id = this.board_id;
            kt.init_html();
            
            this.backlog.push(kt);
        }
        for (var i = 0; i < this.backlog_size; i++) {
            let kt = this.backlog[i];
            kt.move(3,this.calculate_position(kt.id));
        }
    }

    pull_to_done(self){
        if(this.wip.length > 0){
            this.move_to_done();
        }else{
            this.pull_to_wip();
        }
    }

    pull_to_wip(self){
        if(this.backlog.length > 0){

        }
    }

    process_backlog_to_wip(self){
        let tk = self.move_to_wip();
        if(tk){
            setTimeout(function(){ return self.process_backlog_to_wip(self); },self.step_delay);
        }
    }

    process_wip_to_done(self){
        let tk = self.move_to_done();
        if(tk){
            setTimeout(function(){ return self.process_wip_to_done(self); },self.step_delay);
        }
    }

    move_to_wip(){
        let tk = this.backlog.shift();
        if(tk){
            this.wip.push(tk);
            tk.move(316, this.calculate_position(tk.id));
            return tk;
        }
    }

    move_to_done(){
        let tk = this.wip.shift();
        if(tk){
            this.done.push(tk);
            tk.move(636, this.calculate_position(tk.id));
            return tk;
        }
    }

    calculate_position(position){
        let p = (position-1)*50;
        console.log(position+' = '+p)
        return p;
    }
}

class KanbanTicket{
    size = 1;
    id = 0;
    age = 0;
    html = null;
    board_id = '';
    element_id = '';

    constructor(id, size = 1){
        this.size = size;
        this.id = id;
    }

    init_html(){
        this.element_id = "k-ticket-"+this.id;
        document.getElementById(this.board_id).innerHTML += '<div id="'+this.element_id+'" class="k-ticket">'+this.id+'</div>';
        this.html = new AnimableDiv(this.element_id);
    }

    move(x,y){
        this.html.left = x+'px';
        this.html.top = y+'px';
        this.html.css_animate();
    }
}

class AnimableDiv{
    element_id = '';
    left = '5px';
    top = '5px';
    constructor(element_id){
        this.element_id = '#'+element_id;
    }

    css_animate(){
        anime({
          targets: this.element_id,
          left: this.left,
          top: this.top,
          //backgroundColor: this.backgroundColor,
          //borderRadius: [this.borderRadius, this.borderRadiusTo],
          easing: 'easeInOutQuad'
        });
    }
}

class AnimableHtml{
    dom_target = '';
    left = '0px';
    borderRadius = 0;
    borderRadiusTo = 0;
    backgroundColor = "#FFF";

    constructor(dom_target){
        this.dom_target = dom_target;
    }

    move_right(){
        this.borderRadiusTo = '50%';
        this.left = '240px';
        this.backgroundColor = "#000"
        this.css_animate();
    }

    move_left(){
        this.borderRadiusTo = '30%';
        this.left = '0px';
        this.backgroundColor = "#FAF"
        this.css_animate();
    }

    reset(){
        this.left = 0;
        this.borderRadius = 0;
        this.backgroundColor = "#000";
    }

    css_animate(){
        anime({
          targets: this.dom_target,
          left: this.left,
          backgroundColor: this.backgroundColor,
          borderRadius: [this.borderRadius, this.borderRadiusTo],
          easing: 'easeInOutQuad'
        });
    }

    process_PBI_to_circle(dom_target){
        anime({
          targets: dom_target,
          //targets: '.css-prop-demo .el',
          left: '240px',
          backgroundColor: '#FFF',
          borderRadius: ['0%', '50%'],
          easing: 'easeInOutQuad'
        });
    }
}

var g_kanban = new SchwarzKanbanGame();
var g_pipeline = new AnimableHtml('.css-prop-demo .el');

// SECTION 3
var s3_handler = new TicketsHandler();

function init_section_3(){
s3_handler = new TicketsHandler();
s3_handler.board_id = 'k-board-s3';
s3_handler.init();
}

//var game=null;
function run_game_section_3_to_wip(){
    s3_handler.process_backlog_to_wip(s3_handler);
}

function run_game_section_3_to_done(){
    s3_handler.process_wip_to_done(s3_handler);
}
