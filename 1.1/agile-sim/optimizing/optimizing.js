
class G02_optimize{

	slider_wl;
	slider_pl;

	work_load;
	plan_load;
	productivity;
	quality;
	waste;
	profit;

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
		this.optimize_get_values();
		this.optimize_logic();
		this.optimize_outcome();
	}

	optimize_get_values(){
		this.work_load = this.slider_wl.noUiSlider.get();
		this.plan_load = this.slider_pl.noUiSlider.get();
	}

	optimize_logic(){

		this.productivity = 0;
		this.quality = 0;
		this.waste = 0;
		this.profit = 0;

		if(this.work_load < 70){
			this.productivity = this.work_load;
		}else{
			this.productivity = 70 - (this.work_load - 70) /2;
			this.waste = this.work_load - 65;
		}

		if(this.plan_load>10){
			this.waste += this.plan_load;

		}else{
			this.waste += (12 - this.plan_load)*8;

		}

		this.quality = this.productivity - this.waste;

		this.profit = this.value - this.waste;
		
		}

	optimize_outcome(){

		set_p_bar('pbar-productivity', this.productivity); 
		set_p_bar('pbar-quality', this.quality); 
		set_p_bar('pbar-waste', this.waste); 
		set_p_bar('pbar-profit', this.profit); 

	}

}
