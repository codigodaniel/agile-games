var G02_game = new G02_ConfigSim();


describe("Game 02: basic actions", function() {
    beforeEach(function() {
        
    });

    it("Game calculates a productivity index", function() {
        let productivity_index = G02_game.calculate_productivity_index();
        assert.isFalse((!productivity_index));
    });



});
