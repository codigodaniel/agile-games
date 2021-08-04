//***************
// SECTION 1
//***************
/* CHANGES
+ charge wip list by 1 item at once
+ calculate progress rate according to wip limit 
set work progress using wip rate 
- move agent through wip boxes objects, instead coffees
- convert wip boxes into objects

*/

/* DOC
Barista agent logic
+ wip list loads 1 by 1 
+ agent walks through coffee wip list 
+ each coffee work from 50 to 0
+ wip 1: each step loads 10
+ wip 10: each step loads 1 (20 / wip load)


barista work()
barista move()
coffees progress()
barista work()
barista move()
*/

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

    get_node_by_id(node_id){
        if(this.id == node_id){
             return this;
        }else{
            if(this.next_node) return this.next_node.get_node_by_id(node_id);
        }
    }

    last_random_node;
    get_random_node(){
        if(!this.last_random_node){
            this.last_random_node = this.next_node;
        }else{
            this.next_node.get_random_node();
        }
        return this.last_random_node;
    }

    empty(){
        this.next_node = null;
    }

}

class S1_KanbanNode extends S1_Node{
    element_id = '';
    left = '';
    top = '';
    to_do = 10;
    age = 0;

    constructor(id){
        super(id);
    }

    /* Html */

    get_ticket_html(){
        return '<div id="'+this.element_id+'" class="k-ticket">'+this.id+'</div>';
    }

    init_html(board_id){
        if(this.next_node){
            this.next_node.init_html(board_id);
        }
        this.element_id = "s"+this.section + "k-ticket-"+this.id;
        document.getElementById(board_id).innerHTML += this.get_ticket_html();
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
    work(rate = 1){
        if(this.to_do){
            this.to_do -= rate;
            if (this.to_do < 0) this.to_do = 0;
            this.work_graphical_effect();
        }
    }

    work_graphical_effect(){
            anime({
              targets: '#'+this.element_id,
              borderRadius: '10px',
              backgroundColor: '#29CAA4'
            });
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

    progress_rate_by_wip_limit(){
        return 10-this.count();
    }

}

class S1_Agent extends S1_KanbanNode{

    watch_item;
    work_item;
    worked = true;

    constructor(id){
        super(id);
        this.element_id = "k-actor-s"+this.section;
    }
    get_ticket_html(){
        return '<div id="'+this.element_id+'" class="k-actor k-barista-s'+this.section+'"></div>';
    }
    set_work_item(workable){
        if(!this.work_item){
            this.work_item = workable;
        }else{
            if(this.worked){
                this.work_item = workable;
                this.worked = false;
            }
        }
        this.watch_item = workable;
    }

    back_to_default_position(){
        this.left = "-70px";
        this.top = "0px";
        this.css_animate();
    }
    
    work(rate = 1){
        if(this.work_item){
            if (this.work_item == this.watch_item) {
                this.work_item.work(rate);
                t(rate);
                this.worked = true;
            }
        }
    }

    align(){
        if(this.watch_item){
            this.top = this.watch_item.top;
        }
        this.css_animate();
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
    move_think_or_work = 0;
    agent;
    current_work_item;

    constructor(){
        super();
        this.agent = new S1_Agent();
        this.backlog = new S1_KanbanColumn(1,3);
        this.wip =  new S1_KanbanColumn(2,128);
        this.done =  new S1_KanbanColumn(3,255);
        this.board_id = 'k-board-s'+this.section+'-c1';
        this.thread = new Thread(this);
        this.thread.step_delay = this.step_delay;
    }

    reset_columns(){
        this.backlog = new S1_KanbanColumn(1,3);
        this.wip.empty();
        this.done =  new S1_KanbanColumn(3,255);
    }

    set_wip_limit(value){
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
        let wl = 'Wip limit: ';
        if(this.wip.wip_limit != 100){
            wl += this.wip.wip_limit;
        }else{
            wl += 'none';
        }
        this.agent.back_to_default_position();

        document.getElementById('k-board-s1-logs').innerHTML += '<p>'+wl+' - Time: '+this.elapsed_time()+'s</p>';
    }

/* PULL LOGIC */

    pull_game_step(){
        //if(!this.wip.switch_cost()) this.wip.work();
        let action = this.agent__move_think_or_work();
        /**/ 
        if(action){
            if(action == 1){
                //work
                this.agent.work(this.wip.progress_rate_by_wip_limit());
            }else{
                //move agent 
                let nn = this.get_next_work_item();
                this.agent.set_work_item(nn);
            }
        }else{
            //think 
        }
        /**/
        this.pull_to_done();
        if(!action)this.pull_to_wip();
        this.update_board();
        this.agent.align();
    }

    pull_to_wip(){
        let n;
        let ammount = this.wip.get_space();
        if (ammount > 0) {
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

    get_next_work_item(work_item_id = 0){
        let nn;
        if(this.current_work_item){
            if(this.current_work_item.next_node){
                nn = this.current_work_item.next_node;
            }else{
                nn = this.wip.next_node;
            }
        }else{
            nn = this.wip.next_node;
        }
        this.current_work_item = nn;
        return nn;
    }

    agent__move_think_or_work(){
        if(this.move_think_or_work == 3){
            this.move_think_or_work = 0;
        }
        return this.move_think_or_work++;
    }
}

//*******************
//      BARISTA game 
//*******************

class Barista extends S1_Agent{

}

class Kaffee extends S1_KanbanNode{
    style = [];
    default_style = '';
    constructor(id){
        super(id);
        this.style[0] = "karamell-2";
        this.style[1] = "karamell-1";
        this.style[2] = "karamell-0";
        this.default_style = "karamell-0";
    }

    get_ticket_html(){

        return '<div id="'+this.element_id+'" class="k-ticket '+this.default_style+'" ></div>';
    }

    work_graphical_effect(){
        document.getElementById(this.element_id).classList.add(this.style[this.to_do]);
    }
}
class KaffeeMachiato extends Kaffee{
    constructor(id){
        super(id);
        
        this.style[0] = "machiato-3";
        this.style[1] = "machiato-2";
        this.style[2] = "machiato-1";
        this.style[3] = "machiato-0";
        this.default_style = "machiato-0";
    }
}

class KaffeeQueue extends S1_KanbanColumn{
    constructor(id, position_x){
        super(id, position_x);
    }
    init_load_nodes(){
        this.insert(new Kaffee(1));
        this.insert(new Kaffee(2));
        this.insert(new KaffeeMachiato(3));
        this.insert(new KaffeeMachiato(4));
        this.insert(new Kaffee(5));
        this.insert(new KaffeeMachiato(6));
        this.insert(new Kaffee(7));
        this.insert(new KaffeeMachiato(8));
        this.insert(new Kaffee(9));
        this.insert(new Kaffee(10));
    }
}

class KaffeeGame extends S1_TicketsHandler{
    barista;
    constructor(){
        super();
        this.barista = new Barista(1);
        this.backlog = new KaffeeQueue(1,3);
        this.wip =  new KaffeeQueue(2,128);
        this.done =  new KaffeeQueue(3,255);
        
    }

    init_html(){
        super.init_html();
        document.getElementById("k-board-s"+this.section+"-c3").innerHTML = this.barista.get_ticket_html();
        this.barista.back_to_default_position();
    }

    reset_columns(){
        this.backlog = new KaffeeQueue(1,3);
        this.wip.empty();
        this.done =  new KaffeeQueue(3,255);
    }
}

//*******************
//      SETUP
//*******************

var S1_handler = new KaffeeGame();
