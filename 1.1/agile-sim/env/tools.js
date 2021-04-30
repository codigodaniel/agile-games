function t(m = "test"){
    console.log(m);
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function write(el_id, html){
	document.getElementById(el_id).innerHTML = html;
}