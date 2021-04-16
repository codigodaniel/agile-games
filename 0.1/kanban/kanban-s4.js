//***************
// SECTION 4
//***************
function t(m = "puto"){
    console.log(m);
}


class S4_KanbanNode{
    next = null;
    id = 0;
    slide = 4;
    element_id = '';
    left = '';
    top = '';

    constructor(id){
        this.id = id;
    }
    insert(ticket){
        if (!this.next_node){
            this.next_node = ticket;
        }else{
            this.next_node.insert(ticket);
        }
    }

    count(number){
        if(this.next_node){
            return this.next_node.count(number + 1);
        }else{
            return number;
        }
    }
    init_html(board_id){
        if(this.next_node){
            this.next_node.init_html(board_id);
        }
        this.element_id = "s"+this.slide + "k-ticket-"+this.id;
        document.getElementById(board_id).innerHTML += '<div id="'+this.element_id+'" class="k-ticket">'+this.id+'</div>';
    }

    align(x,y){
        this.move(x,y);
        if(this.next_node){
            this.next_node.align(x, y+51);
        }
    }

    move(x,y){
        this.left = x+'px';
        this.top = y+'px';
        this.css_animate();
    }

    css_animate(){
        anime({
          targets: '#'+this.element_id,
          left: this.left,
          top: this.top,
          //backgroundColor: this.backgroundColor,
          //borderRadius: [this.borderRadius, this.borderRadiusTo],
          easing: 'easeInOutQuad'
        });
    }
}

class S4_KanbanColumn{
    slide = 4;
    backlog_size = 10;
    column_number;
    next_node = null;
    board_id;
    position_x;

    constructor(number, position_x){
        this.column_number = number;
        this.position_x = position_x;
        this.board_id = "k-board-s"+this.slide+"-c"+this.column_number;
    }

    init_load_nodes(){
        for (var i = 1; i <=  this.backlog_size ; i++) {
            let n = new S4_KanbanNode(i);
            this.insert(n);
        }
    }

    init_html(){
        document.getElementById(this.board_id).innerHTML = null;
        if(this.next_node){
            this.next_node.init_html(this.board_id);
        }
    }

    arrange_backlog(){
        if(this.next_node){
            this.next_node.align(this.position_x, 3);
        }
    }

    insert(ticket){
        if (!this.next_node){
            this.next_node = ticket;
        }else{
            this.next_node.insert(ticket);
        }
        
    }

    extract_FIFO(){
        let n = this.next_node;
        this.next_node = this.next_node.next_node;
        n.next_node = null;
        return n;
    }

    count(){
        if(this.next_node){
            return this.next_node.count(1);
        }else{
            return 0;
        }
    }

    extract(){
        return  this.next_node;
    }
}

class S4_TicketsHandler{
    slide = 4;
    backlog = new S4_KanbanColumn(1,3);
    wip =  new S4_KanbanColumn(2,316);
    done =  new S4_KanbanColumn(3,636);
    step_delay = 300; 

    constructor(){
        this.backlog.init_load_nodes();
    }

    init_html(){
        this.backlog.init_html();
        this.backlog.arrange_backlog();
    }

    update_board(){
        this.backlog.arrange_backlog();
        this.wip.arrange_backlog();
    }

    pull_game(){

        let n = this.backlog.extract_FIFO();
        this.wip.insert(n);
        t(this.backlog);
        t(this.wip);
        this.update_board();
    }



    pull_to_wip(self){

    }

    pull_to_done(self){
        if(this.wip.length > 0){
            this.move_to_done();
        }else{
            this.pull_to_wip();
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
        return p;
    }
}

class S4_KanbanHtmlTicket{
    slide = 4;
    size = 1;
    id = 0;
    age = 0;
    html = null;
    board_id = '';
    element_id = '';
    left = '5px';
    top = '5px';

    constructor(id, size = 1){
        this.size = size;
        this.id = id;
    }

    init_html(){
        this.element_id = "s"+this.slide + "k-ticket-"+this.id;
        document.getElementById(this.board_id).innerHTML += '<div id="'+this.element_id+'" class="k-ticket">'+this.id+'</div>';
    }

    move(x,y){
        this.html.left = x+'px';
        this.html.top = y+'px';
        this.html.css_animate();
    }

    css_animate(){
        anime({
          targets: '#'+this.element_id,
          left: this.left,
          top: this.top,
          //backgroundColor: this.backgroundColor,
          //borderRadius: [this.borderRadius, this.borderRadiusTo],
          easing: 'easeInOutQuad'
        });
    }
}

//*******************
//      SETUP
//*******************

var s4_handler = null;

function init_section_4(){
    s4_handler = new S4_TicketsHandler();
    s4_handler.board_id = 'k-board-s4-c1';
    s4_handler.init_html();

}

function run_game_section_4(argument) {
    s4_handler.pull_game();
}

