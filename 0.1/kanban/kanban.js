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

var g_kanban = new SchwarzKanbanGame();