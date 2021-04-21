var assert = chai.assert;

describe("Name spacing", function() {

    beforeEach(function() {
    });

    it("2 instances from 1 incapsulated class", function() {
    	let spacename = new spacename_as_function();
    	let a_tito= new spacename.Tito();
        let another_tito= new spacename.Tito();
    	a_tito.id = "daniel";
        another_tito.id = "maria";
    	assert.notEqual(a_tito.id, another_tito.id);
    });

    it("Instance 2 classes from 1 spacename", function() {
        let spacename_a = new spacename_as_function();
        let spacename_b = new spacename_as_function();
        let a_tito= new spacename_a.Tito();
        let another_tito= new spacename_b.Tito();
        assert.equal(a_tito.id, another_tito.id);
    });

    it("Instance 2 classes in 2 different spacenames", function() {
        let spacename_a = new spacename_as_function();
        let spacename_b = new spacename_B_as_function();
        let a_tito= new spacename_a.Tito();
        let another_tito= new spacename_b.Tito();
        t(a_tito);
        t(another_tito);
        assert.notEqual(a_tito.id, another_tito.id);
    });

    
});


