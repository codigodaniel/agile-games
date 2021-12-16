

function init_sliders(){

	var slider_wl = document.getElementById('slider-workload');

	noUiSlider.create(slider_wl, {
	    behaviour: 'tap',
	    start: 100,
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

    slider_wl.noUiSlider.on('change', function () {
    	let val = slider_wl.noUiSlider.get();
    	pbar(val);
    });

	var slider = document.getElementById('slider-planning');

	noUiSlider.create(slider, {
	    behaviour: 'tap',
	    start: 100,
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

    slider.noUiSlider.on('change', function () {
    	let val = slider.noUiSlider.get();
    	pbar(val);
    });
}

onload = init_sliders;

function pbar(value){
	let el_p = document.getElementById('pbar-productivity');
	let el_v = document.getElementById('pbar-value');
	el_p.style = "width:"+value+"%;";
	el_v.style = "width:"+value+"%;";
}
