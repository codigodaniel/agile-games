

class G02_optimize{
	slider_wl;
	slider_pl;


	init_sliders(){


		this.slider_wl = document.getElementById('slider-workload');

		noUiSlider.create(this.slider_wl, {
			behaviour: 'tap',
			start: 100,
			connect:[true,false], 
			range: {
				'min': 0,
				'max': 130
			}, 
			step: 1, 
			pips: {
				mode: "values", 
				values: [25, 50, 75, 100], 
				density: 4
			}
		});

		this.slider_wl.noUiSlider.on('change', function () {
			G02_optimize_game.optimize();
		});

		this.slider_pl = document.getElementById('slider-planning');

		noUiSlider.create(this.slider_pl, {
			behaviour: 'tap',
			start: 100,
			connect:[true,false], 
			range: {
				'min': 0,
				'max': 130
			}, 
			step: 1,
			pips: {
				mode: "values", 
				values: [25, 50, 75, 100], 
				density: 4
			}
		});

		this.slider_pl.noUiSlider.on('change', function () {
			G02_optimize_game.optimize();
		});	

	}


	optimize(){
		let work_load = this.slider_wl.noUiSlider.get();
		let plan_load = this.slider_pl.noUiSlider.get();

		let productivity = 0;
		let value = 0;
		let waste = 0;
		let profit = 0;

		if(work_load < 70){
			productivity = work_load + 20;
		}else{
			productivity = 140 - work_load;
			waste = work_load - 65;
		}

		if(plan_load>10){
			waste += plan_load;

		}else{
			waste += (12 - plan_load)*8;

		}

		value = productivity - waste;


		profit = value - waste;
		
		set_p_bar('pbar-productivity', productivity);
		set_p_bar('pbar-value', value);
		set_p_bar('pbar-waste', waste);
		set_p_bar('pbar-profit', profit);

	}

}

var G02_optimize_game;


function init_game_02(){
	G02_optimize_game = new G02_optimize();
	G02_optimize_game.init_sliders();

}


onload = init_game_02;

