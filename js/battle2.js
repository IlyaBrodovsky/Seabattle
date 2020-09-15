/*View*/

var view = { 

	displayMessage: function(msg) {  
		var messageArea = document.querySelector('#messageArea'); 
		messageArea.innerHTML = msg; 
	},

	displayHit: function(location) { 
		var cell = document.getElementById(location); 
		cell.setAttribute('class', 'hit'); 
	},

	displayMiss: function(location) { 
		var cell = document.getElementById(location); 
		cell.setAttribute('class', 'miss'); 
	}
};

/*Model*/

var model = { 

	bordSize:   7, 
	numShips:   3, 
	shipLength: 3, 
	shipsSunk:  0, 

	ships: [ 

		ship1 = { location: ['0', '0', '0'], hits: ['  ', '  ', '  '] }, 

		ship2 = { location: ['0', '0', '0'], hits: ['  ', '  ', '  '] }, 

		ship3 = { location: ['0', '0', '0'], hits: ['  ', '  ', '  '] }  
	],

	fire: function(guess) { 
		for(var i = 0; i < this.numShips; i++) {  
			var ship = this.ships[i]; 

			var index = ship.location.indexOf(guess); 
			if(index >= 0) { 
				ship.hits[index] = 'hit'; 
				view.displayHit(guess);

				view.displayMessage('Вы попали в цель!');

				if(this.isSunk(ship)) {
					view.displayMessage('Вы потопили корабль!'); 
					this.shipsSunk++;
				}
				return true; 
			}
		}
		view.displayMiss(guess);
		view.displayMessage('Вы промахнулись!');
		return false; 

	},

	isSunk: function(ship) { 

		for(var i = 0; i < this.shipLength; i++){
			if(ship.hits[i] !== 'hit'){ 
				return false;
			}
		}
		return true; 
		},

	

	generatelShipLocations: function(){ 

		var location;
		for (var i = 0; i < this.numShips; i++){ 
			do{
				location = this.generateShip(); 
			}while(this.collision(location)); 
			this.ships[i].location = location; 
			
		} 
	},		
	

	generateShip: function(){ 
		var direction = Math.floor(Math.random() * 2); 
		var row, col;

		if(direction === 1) { 
			row = Math.floor(Math.random() * this.bordSize); 
			col = Math.floor(Math.random() * (this.bordSize - this.shipLength));

		}else{ // если 0 то для вертикального 
			row = Math.floor(Math.random() * (this.bordSize - this.shipLength));
			col = Math.floor(Math.random() * this.bordSize);
		}

		var newShipLocations = [];

		for(var i = 0; i < this.shipLength; i++){
			if(direction ===1){ 
				newShipLocations.push(row + '' + (col + i)); 

			} else { 

				newShipLocations.push((row + i) + '' + col); 
			} 


		}
		return newShipLocations;
	},

	collision: function(location){ 

		for (var i = 0; i < this.shipLength; i++) { 
			var ship = model.ships[1];
			for(var j = 0; j < location.length; j++) {
				if(ship.location.indexOf(location[j]) >= 0) {
					return true;
				}
			}
		}
		return false;

	}
	
}

/*Controller*/ 

var controller = {

	guesses: 0,

	processGuess: function(guess){  

		var location = parseGuess(guess);
		if(location){ 
			this.guesses++;
			var hit = model.fire(location);

			if(hit && model.shipsSunk === model.numShips){  
				view.displayMessage('Вы потопили ' +  model.numShips + ' корабля ' + ' за ' + this.guesses + ' Выстрелов');
			} 
		}				
	}
	
}

function parseGuess(guess){
	var alphaBet = ['A', 'B', 'C', 'D', 'E', 'F', 'G']; 
	if(guess === null || guess.length !=2){ 
		alert('Вы ввели не верные координаты');
	}else{
		firstChar = guess.charAt(0); 

		var row = alphaBet.indexOf(firstChar);
		var column = guess.charAt(1); 

		if(isNaN(row) || isNaN(column)) { 
			alert('Вы ввели не верные координаты');

		}else if(row < 0 || row >= model.bordSize || column < 0 || column >= model.bordSize ){
			alert('Вы ввели не верные координаты');

		}else{
			return row + column;
		}

	}
	return null;
}

function init(){

	var fireButton = document.getElementById('fireButton'); 
		fireButton.onclick = handleFireButton; 

	var guessInput = document.getElementById('guessInput');
	guessInput.onkeypress = handleKeyPress; 

	model.generatelShipLocations();

} 

function handleFireButton(){
	var guessInput = document.getElementById('guessInput');
	var guess = guessInput.value;
	controller.processGuess(guess);

	guessInput.value = ''; 
}

function handleKeyPress(e){ 
	var fireButton = document.getElementById('fireButton');
	console.log(e.keyCode);
	if(e.keyCode === 13){
		fireButton.click();
		return false;
	} 
}

window.onload = init;

var yElems = ['A','B','C','D','E','F','G'];

for (var x = 0; x <= 6; x++) {
  for (var y = 0; y <= 6; y++) {
    var char = yElems[y];

    ((_char = char, _y = y, _x = x) => {
      document.getElementById(`${_y}${_x}`).addEventListener('click', () => {
        document.getElementById('guessInput').value = `${_char}${_x}`;
        document.getElementById('fireButton').click();
      });
    })();
  }
}
