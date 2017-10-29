// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
    if (this.x > 410) {
        this.x = 0;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// instantiate the Player's initial settings
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/char-boy.png';
}

// call a check for out of bounds or enemy collisions everytime engine updates character
Player.prototype.update = function() {
    this.boundsCheck();
    this.collisionCheck();
    this.winnerCheck();
};

// draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// move player around the screen based on key presses
Player.prototype.handleInput = function(keyPressed) {
    switch (keyPressed) {
        case 'b':
            this.sprite = 'images/char-boy.png';
            break;
        case 'c':
            this.sprite = 'images/char-cat-girl.png';
            break;
        case 'g':
            this.sprite = 'images/char-princess-girl.png';
            break;
        case 'h':
            this.sprite = 'images/char-horn-girl.png';
            break;
        case 'p':
            this.sprite = 'images/char-pink-girl.png';
            break;
        case 'left':
            this.x -= this.speed;
            break;
        case 'right':
            this.x += this.speed;
            break;
        case 'up':
            this.y -= this.speed - 20;
            break;
        case 'down':
            this.y += this.speed - 20;
            break;
    }
};

// sets player back to the start in the bottom center
Player.prototype.reset = function() {
    // put player back to starting point
    player.x = 200;
    player.y = 380;

    // create new enemies and clear the old ones
    allEnemies.length = 0;
    generateRandomEnemies();

    // delay the clearing of a message so player can read it
    setTimeout(function() {
        ctx.clearRect(0, 0, 500, 500);
    }, 750);
}

Player.prototype.sendMessage = function(message, size, style, color) {
    ctx.clearRect(0, 0, 500, 500)
    ctx.fillStyle = color;
    ctx.font = size + 'pt ' + style + ' serif';
    ctx.fillText(message, 10, 35);
}

// reset user's location to start if collided with enemy after telling them they lost
Player.prototype.loserCheck = function() {
    allEnemies.forEach(function(enemy) {
        if (player.x < enemy.x + 50 &&
            player.x + 50 > enemy.x &&
            player.y < enemy.y + 50 &&
            player.y + 50 > enemy.y) {

            // set losing message at top
            player.sendMessage('YOU LOST!', 20, 'semi-bold', 'red');

            // reset board after losing
            player.reset();
        }
    });
}

// reset user's location to start after telling them they won 
Player.prototype.winnerCheck = function() {
    if (player.y === -10) {
        // set winning message at top
        player.sendMessage('YOU WON!', 20, 'semi-bold', 'blue');
        // reset board after winning, delay it so the user sits in winning position for a bit
        player.reset();
    }
}

// keep player within the canvas of the game
Player.prototype.boundsCheck = function() {
    if (player.x > 400) {
        player.x = 400;
    } else if (player.x < 0) {
        player.x = 0;
    } else if (player.y > 380) {
        player.y = 380;
    } else if (player.y < -10) {
        player.y = -10;
    }
}

// check for collisions of the user.
Player.prototype.collisionCheck = function() {
    player.loserCheck();
};

// global variables
// set new player in the bottom center, create a blank array for enemies to be stored, enemy amount variable
var player = new Player(200, 380, 100),
    allEnemies = [],
    enemyNumber = 3,
    infoArea = document.createElement('div');


// create an enemy using randomly generated or assign based on provided parameters
var generateEnemy = function(x = 0, y = Math.random() * 180 + 60, speed = Math.random() * 200 + 80) {
    let newEnemy = new Enemy(x, y, speed);
    allEnemies.push(newEnemy);
};

// create the enemeyNumber variable amount of enemies using random default parameters
var generateRandomEnemies = function() {
    for (let enemyCount = 0; enemyCount < enemyNumber; enemyCount++) {
        generateEnemy();
    }
};

// generate the set enemies using defaults.
generateRandomEnemies();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        66: 'b',
        67: 'c',
        71: 'g',
        72: 'h',
        80: 'p'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});