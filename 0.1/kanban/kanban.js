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
    board_id = '';

    constructor(){
        
    }

    init(){
        for (var i = 0; i < 20; i++) {
            let kt = new KanbanTicket(i);
            kt.board_id = this.board_id;
            kt.init_html();
            this.backlog.push(kt);
        }
    }
    run(){
        for (var i = 0; i < 20; i++) {
            //console.log(this.backlog[i]);
            this.backlog[i].move_wip();

        }
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
        document.getElementById(this.board_id).innerHTML += '<div id="'+this.element_id+'" class="k-ticket"></div>';
        this.html = new AnimableDiv(this.element_id);
    }

    move_wip(){
        this.html.left = '316px';
        this.html.top = '0px';
        this.html.css_animate();
    }
}

class AnimableDiv{
    element_id = '';
    left = '0px';
    top = '0px';
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
