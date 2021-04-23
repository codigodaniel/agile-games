var S1_handler;


function prepare_handler_object(){
        S1_handler = new S1_TicketsHandler();
        S1_handler.update_board = function(){}
        S1_handler.reset_columns();
        S1_handler.columns_to_str = function(){
            return "Backlog: "+this.backlog.count()+", Wip: "+this.wip.count()+", Done: "+this.done.count();
        }
}

function instance_KanbanNode(id, to_do=3){
    let kn = new S1_KanbanNode(1);
    kn.to_do = to_do;
    return kn;
}

describe("SECTION 4 kanban waste logic", function() {
    beforeEach(function() {
        prepare_handler_object();
    });

    it("On Pull action, each step has a context switch cost: switch_cost()", function() {
        S1_handler.wip.insert(instance_KanbanNode(1));
        S1_handler.wip.insert(instance_KanbanNode(2));
        S1_handler.wip.insert(instance_KanbanNode(3));
        
        assert.equal(S1_handler.wip.switch_cost(),2);
        assert.equal(S1_handler.wip.switch_cost(),1);
        assert.equal(S1_handler.wip.switch_cost(),0);
        assert.equal(S1_handler.wip.switch_cost(),2);
    });

    it("On Pull action, done nodes are pulled", function() {
        let kn = instance_KanbanNode(1,0)
        S1_handler.wip.insert(kn);
        S1_handler.wip.wip_limit = 1;
        S1_handler.pull_to_done();
        assert.equal(S1_handler.columns_to_str(), "Backlog: 0, Wip: 0, Done: 1");
    });
    it("On Pull action, not done nodes are not pulled", function() {
        let kn = instance_KanbanNode(1);
        S1_handler.wip.insert(kn);
        S1_handler.wip.wip_limit = 1;
        S1_handler.pull_to_done();
        assert.equal(S1_handler.columns_to_str(), "Backlog: 0, Wip: 1, Done: 0");
    });
    it("S1_KanbanNode.work()", function() {
        let kn = instance_KanbanNode(1);
        assert.equal(kn.to_do,3);
        kn.work();
        assert.equal(kn.to_do,2);
        kn.work();
        assert.equal(kn.to_do,1);
        kn.work();
        assert.equal(kn.to_do,0);
    });
});

describe("SECTION 4 pull logic", function() {

    beforeEach(function() {
        prepare_handler_object();
    });

    it("On Pull action, all columns should move forward", function() {
        //this.pull_to_done();
        S1_handler.backlog.insert(instance_KanbanNode(1, 0));
        S1_handler.backlog.insert(instance_KanbanNode(2, 0));
        S1_handler.wip.insert(instance_KanbanNode(3, 0));
        S1_handler.wip.wip_limit = 1;
        S1_handler.pull_to_done();
        S1_handler.pull_to_wip();
        assert.equal(S1_handler.columns_to_str(), "Backlog: 1, Wip: 1, Done: 1");
    });

    it("S1_KanbanColumn.get_space()", function() {
        S1_handler.wip.insert(instance_KanbanNode(1));
        S1_handler.wip.insert(instance_KanbanNode(2));
        S1_handler.wip.insert(instance_KanbanNode(3));
        S1_handler.wip.wip_limit = 6;
        assert.equal(S1_handler.wip.get_space(), 3);
    });

    it("S1_KanbanColumn.extract_DONE()", function() {
        let kn = instance_KanbanNode(1, 0)
        S1_handler.wip.insert(kn);
        let list = S1_handler.wip.extract_DONE();
        assert.equal(S1_handler.wip.count(), 0);
        //assert.equal(list.count(), 1);
    });

    it("On Pull action, and WIP Limit 3, 3 items load in wip", function() {
        //this.pull_to_done();
        S1_handler.backlog.insert(instance_KanbanNode(1));
        S1_handler.backlog.insert(instance_KanbanNode(2));
        S1_handler.backlog.insert(instance_KanbanNode(3));
        S1_handler.backlog.insert(instance_KanbanNode(4));
        S1_handler.backlog.insert(instance_KanbanNode(5));
        S1_handler.wip.wip_limit = 3;
        S1_handler.pull_to_wip();
        assert.equal(S1_handler.columns_to_str(), "Backlog: 2, Wip: 3, Done: 0");
    });

});

describe("SECTION 4 Node handling", function() {

    beforeEach(function() {
    });

    it("Insert Node, and recover it", function() {
        let column = new S1_KanbanColumn();
        column.insert(new S1_KanbanNode(3))
        let kn = column.extract_FIFO();
        assert.equal(kn.id, 3);
    });

    it("Insert 3 Nodes, and extract FIFO", function() {
        let column = new S1_KanbanColumn();
        column.insert(new S1_KanbanNode(1));
        column.insert(new S1_KanbanNode(2));
        column.insert(new S1_KanbanNode(3));
        let kn = column.extract_FIFO();
        assert.equal(kn.id, 1);
        assert.equal(kn.next_node, null);
    });

    it("Set empty column, count should be 0", function() {
        let column = new S1_KanbanColumn();
        assert.equal(column.count(), 0);
    });

    it("Insert 3 Nodes, and count them", function() {
        let column = new S1_KanbanColumn();
        column.insert(new S1_KanbanNode(1))
        column.insert(new S1_KanbanNode(2))
        column.insert(new S1_KanbanNode(3))
        assert.equal(column.count(), 3);
    });

    it("S1_KanbanColumn.init_load_nodes()", function() {
        let column = new S1_KanbanColumn();
        column.init_load_nodes();
        assert.equal(column.count(), 10);
    });

    it("S1_KanbanColumn.extract_FIFO() removes first ", function() {
        let column = new S1_KanbanColumn();
        column.insert(new S1_KanbanNode(1))
        column.insert(new S1_KanbanNode(2))
        column.insert(new S1_KanbanNode(3))
        let kn = column.extract_FIFO();
        assert.equal(kn.id, 1);
        assert.equal(kn.next_node, null);
        assert.equal(column.count(), 2);
        kn = column.extract_FIFO();
        assert.equal(kn.id, 2);
        assert.equal(column.count(), 1);

    });

});
