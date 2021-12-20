var assert = chai.assert;

var optimize_game;

describe("Thread", function() {

    beforeEach(function() {
        optimize_game = new G02_optimize();
        
    });

    after(function() { });

    it("work_load increases productivity until 70%", function() {
        optimize_game.work_load = 20;
        optimize_game.optimize_logic();
        let prod1 = optimize_game.productivity;
        optimize_game.work_load = 50;
        optimize_game.optimize_logic();
        let prod2 = optimize_game.productivity;

    	assert.isTrue(prod1 < prod2);
    });

    it("work_load decreases slowly productivity over 70%", function() {

        optimize_game.work_load = 70;
        optimize_game.optimize_logic();
        let prod1 = optimize_game.productivity;
        optimize_game.work_load = 90;
        optimize_game.optimize_logic();
        let prod2 = optimize_game.productivity;

        assert.isTrue(prod1 > prod2);
        assert.equal((prod1 - prod2), 10);
    });

    it("work_load 69 = productivity 69", function() {
        optimize_game.work_load = 69;
        optimize_game.optimize_logic();
        assert.equal(optimize_game.productivity, 69);
    });

    it("work_load 50 = productivity 50", function() {
        optimize_game.work_load = 50;
        optimize_game.optimize_logic();
        assert.equal(optimize_game.productivity, 50);
    });

    it("work_load 90 = productivity 60", function() {
        optimize_game.work_load = 90;
        optimize_game.optimize_logic();
        assert.equal(optimize_game.productivity, 60);
    });

});
