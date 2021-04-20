var s4_handler;

describe("SECTION 4 pull logic", function() {

    beforeEach(function() {
        s4_handler = new S4_TicketsHandler();
        s4_handler.update_board = function(){}
        s4_handler.reset_columns();
        s4_handler.columns_to_str = function(){
            return "Backlog: "+this.backlog.count()+", Wip: "+this.wip.count()+", Done: "+this.done.count();
        }
    });

    it("On Pull action, all columns should move forward", function() {
        //this.pull_to_done();
        s4_handler.backlog.insert(new S4_KanbanNode(1));
        s4_handler.backlog.insert(new S4_KanbanNode(2));
        s4_handler.wip.insert(new S4_KanbanNode(3));
        s4_handler.pull_to_done();
        assert.equal(s4_handler.columns_to_str(), "Backlog: 1, Wip: 1, Done: 1");
    });
});

describe("SECTION 4 Node handling", function() {

    beforeEach(function() {
    });

    it("Insert Node, and recover it", function() {
        let column = new S4_KanbanColumn();
        column.insert(new S4_KanbanNode(3))
        let kn = column.extract();
        assert.equal(kn.id, 3);
    });

    it("Insert 3 Nodes, and recover FIFO", function() {
        let column = new S4_KanbanColumn();
        column.insert(new S4_KanbanNode(1));
        column.insert(new S4_KanbanNode(2));
        column.insert(new S4_KanbanNode(3));
        let kn = column.extract_FIFO();
        assert.equal(kn.id, 1);
    });

    it("Set empty column, count should be 0", function() {
        let column = new S4_KanbanColumn();
        assert.equal(column.count(), 0);
    });

    it("Insert 3 Nodes, and count them", function() {
        let column = new S4_KanbanColumn();
        column.insert(new S4_KanbanNode(1))
        column.insert(new S4_KanbanNode(2))
        column.insert(new S4_KanbanNode(3))
        assert.equal(column.count(), 3);
    });

    it("S4_KanbanColumn.init_load_nodes()", function() {
        let column = new S4_KanbanColumn();
        column.init_load_nodes();
        assert.equal(column.count(), 10);
    });

    it("S4_KanbanColumn.extract_FIFO() removes first ", function() {
        let column = new S4_KanbanColumn();
        column.insert(new S4_KanbanNode(1))
        column.insert(new S4_KanbanNode(2))
        column.insert(new S4_KanbanNode(3))
        let kn = column.extract_FIFO();
        assert.equal(kn.id, 1);
        assert.equal(kn.next_node, null);
        assert.equal(column.count(), 2);
    });

});
