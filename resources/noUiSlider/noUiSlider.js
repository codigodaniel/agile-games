

function init_sliders(){

	var slider = document.getElementById('slider-workload');

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

	// Bind the color changing function to the update event.
    slider.noUiSlider.on('end', function () {
    	let val = slider.noUiSlider.get();
    	pbar(val);


    });
}

onload = init_sliders;



function pbar(value){
	let el = document.getElementById('pbar');	
	//el.style = "border:1px dashed blue;";
	el.style = "width:"+value+"%;";

}