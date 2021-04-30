//***************
// SECTION 1
//***************

/* Dependencies
Thread
*/

class S1_SectionElement{
    section = 1;
}

class S1_Node extends S1_SectionElement{
    id = 0;
    next_node = null;

    constructor(id){
        super();
        this.id = id;
    }

    count(number = 0){
        if(this.next_node){
            return this.next_node.count(number + 1);
        }else{
            return number;
        }
    }

    insert(ticket){
        if (!this.next_node){
            this.next_node = ticket;
        }else{
            this.next_node.insert(ticket);
        }
    }

}

class S1_KanbanNode extends S1_Node{
    element_id = '';
    left = '';
    top = '';
    to_do = 1;
    age = 0;

    constructor(id){
        super(id);
    }

    /* Html */

    init_html(board_id){
        if(this.next_node){
            this.next_node.init_html(board_id);
        }
        this.element_id = "s"+this.section + "k-ticket-"+this.id;
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
//          easing: 'easeInOutQuad'
        });
    }
    /* Process Work */
    work(){
        if(this.to_do){
            this.to_do--;
            anime({
              targets: '#'+this.element_id,
              borderRadius: '10px',
              backgroundColor: '#29CAA4'
            });
        }
    }

}

class S1_KanbanColumn  extends S1_Node{
    backlog_size = 10;
    board_id;
    position_x;
    wip_limit = 1;
    wasted_time = 0;
    
    /* Setup */

    constructor(id, position_x){
        super(id);
        this.position_x = position_x;
        this.board_id = "k-board-s"+this.section+"-c"+this.id;
    }

    init_load_nodes(){
        for (var i = 1; i <=  this.backlog_size ; i++) {
            let n = new S1_KanbanNode(i);
            this.insert(n);
        }
    }

    /*Html*/

    init_html(){
        let board_element = document.getElementById(this.board_id);
        board_element.innerHTML = '';
        if(this.next_node){
            this.next_node.init_html(this.board_id);
        }
    }

    arrange_backlog(){
        if(this.next_node){
            this.next_node.align(this.position_x, 3);
        }
    }

    show_boxes(){
        let element_obj = document.getElementById("k-board-s"+this.section+"-c2");
        element_obj.innerHTML = '';
        for (var i = 0; i < this.wip_limit; i++) {
            let el_id = 'k-kanban-kanban-'+i;
            let y = i*51+1;
            element_obj.innerHTML += '<div class="k-kanban-kanban" style="top:'+y+'px;" id="'+el_id+'"></div>';
        }
    }

    /* Node handling*/

    extract_FIFO(){
        let n = this.next_node;
        if(n){
            this.next_node = this.next_node.next_node;
            n.next_node = null;
        }
        return n;
    }


    /* Process Pull */

    extract_DONE(){
        if(this.next_node){
            if(this.next_node.to_do == 0) return this.extract_FIFO();
        }
    }

    get_space(){
        return this.wip_limit - this.count();
    }

    /* Process Work */
    work(){
        if(this.next_node) this.next_node.work();
    }

    switch_cost(){
        if(this.count() > this.wasted_time){
            this.wasted_time++;
        }else{
            this.wasted_time = 1;
        }
        return this.count() - this.wasted_time;
    }

}

class S1_TicketsHandler  extends S1_SectionElement{
    backlog;
    wip;
    done;
    thread; 
    board_id;
    step_delay = 200;
    time_start;
    time_end;

    constructor(){
        super();
        this.reset_columns();
        this.board_id = 'k-board-s'+this.section+'-c1';
        this.thread = new Thread(this);
        this.thread.step_delay = this.step_delay;
    }

    reset_columns(){
        this.backlog = new S1_KanbanColumn(1,3);
        this.wip =  new S1_KanbanColumn(2,128);
        this.done =  new S1_KanbanColumn(3,255);
    }

    set_wip_limit(value){
        //this.restart();
        this.wip.wip_limit = value;
        this.update_select_wip();
        this.wip.show_boxes();
    }

    init_html(){
        this.backlog.init_html();
        this.backlog.arrange_backlog();
        this.update_select_wip();
        this.wip.show_boxes();
    }

    update_select_wip(){
        document.getElementById("k-select-wip-s"+this.section).value = this.wip.wip_limit;
    }

    update_board(){
        this.backlog.arrange_backlog();
        this.wip.arrange_backlog();
        this.done.arrange_backlog();
    }

/* THREAD */

    start_game(self){
        if(!this.thread.is_active()){
            this.time_start = Date.now();
            this.thread.start();
        }
    }

    restart(){
        this.thread.stop();
        this.reset_columns();
        this.backlog.init_load_nodes();
        this.init_html();
    }

    step(){
        this.pull_game_step();
    }
    is_not_done(){
        let rest = this.backlog.count() + this.wip.count();
        return rest >0;
    }

    elapsed_time(){
        return (Date.now()-this.time_start)/1000;
    }

    last_step(){

        document.getElementById('k-board-s1-logs').innerHTML += '<p>Time: '+this.elapsed_time()+'s</p>';
    }

/*  */

    pull_game_step(){
        if(!this.wip.switch_cost()) this.wip.work();
        this.pull_to_done();
        this.pull_to_wip();
        this.update_board();
    }

    pull_to_wip(){
        let n;
        let ammount = this.wip.get_space();
        for (var i = 0; i < ammount; i++) {
            this.wip.insert(this.backlog.extract_FIFO());
        }
        return n;
    }

    pull_to_done(){
        let n = this.wip.extract_DONE();
        if(n){
            this.done.insert(n);
        }
        return n;
    }

    init_section(){
        this.init_html();
    }

}

//*******************
//      SETUP
//*******************

var S1_handler = new S1_TicketsHandler();
