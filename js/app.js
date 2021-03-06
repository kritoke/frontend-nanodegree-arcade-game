// global variables
var allEnemies = [], // create a blank array for enemies to be stored
    enemyNumber = 3, // amount of enemies on the screen
    score = 0, // set initial score
    infoArea = document.createElement('div'); // set div where score and instructions go

// main class for enemy and player to inherit
class User {
    constructor(x, y, speed, sprite) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.sprite = sprite;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Enemies our player must avoid
class Enemy extends User {
    constructor(x = 0, y = Math.random() * 180 + 60, speed = Math.random() * 200 + 80, sprite = 'images/enemy-bug.png') {
        super(x, y, speed);
        this.sprite = sprite;
        allEnemies.push(this);
    }

    render() {
        super.render();
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += dt * this.speed;
        if (this.x > 410) {
            this.x = 0;
        }
    }
}

// reset the allEnemies back to zero and recreate the amount in enemyCount using Enemy constructor 
var generateRandomEnemies = function() {
    allEnemies.length = 0;
    for (let enemyCount = 0; enemyCount < enemyNumber; enemyCount++) {
        new Enemy();
    }
};

// class to store the human player
class Player extends User {
    constructor(x, y, speed, sprite = 'images/char-boy.png') {
        super(x, y, speed);
        this.sprite = sprite;
    }

    render() {
        super.render();
    }

    // check user's location against out of bounds, whether it collides with enemy, or wins
    update() {
        this.boundsCheck();
        this.collisionCheck();
        this.winnerCheck();
    }

    // move player around the screen based on key presses
    handleInput(keyPressed) {
        switch (keyPressed) {
            case 'b':
                this.sprite = 'images/char-boy.png';
                break;
            case 'c':
                this.sprite = 'images/char-cat-girl.png';
                break;
            case 'e':
                new Enemy();
                enemyCount++;
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
            case 's':
                this.newGame();
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
    }

    // put a message at the top of the game canvas
    sendMessage(message, size, style, color) {
        ctx.clearRect(0, 0, 500, 500)
        ctx.fillStyle = color;
        ctx.font = size + 'pt ' + style + ' serif';
        ctx.fillText(message, 10, 35);
    }

    // reset user's location to start if collided with enemy after telling them they lost
    loserCheck() {
        let currPlayer = this;
        allEnemies.forEach(function(enemy) {
            if (currPlayer.x < enemy.x + 50 &&
                currPlayer.x + 50 > enemy.x &&
                currPlayer.y < enemy.y + 50 &&
                currPlayer.y + 50 > enemy.y) {

                // set losing message at top
                currPlayer.sendMessage('YOU LOST!', 20, 'semi-bold', 'red');

                // reset board after losing
                currPlayer.reset();
            }
        });
    }

    // reset user's location to start after telling them they won 
    winnerCheck() {
        if (this.y === -10) {
            // set winning message at top
            this.sendMessage('YOU WON!', 20, 'semi-bold', 'blue');
            score += 1;
            // reset board after winning
            this.reset();
        }
    }

    // keep player within the canvas of the game
    boundsCheck() {
        if (this.x > 400) {
            this.x = 400;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.y > 380) {
            this.y = 380;
        } else if (this.y < -10) {
            this.y = -10;
        }
    }

    // check for collisions of the user.
    collisionCheck() {
        this.loserCheck();
    }

    // set the directions to output at the bottom of the canvas with the current score
    drawInfoArea() {
        let canvas = document.getElementsByTagName('canvas'); // canvas for the game to take place
        let canvasTag = canvas[0];
        let directionMessage = 'Move the Character using the arrow keys, touch is not supported.';
        let changeCharMessage = 'Press: b for boy, c for cat girl, h for horn girl, p for pink girl, g for princess girl.';
        let additionalMessage = 'To add another enemy, press e. To start a new game, press s.'

        infoArea.innerHTML = `<p>Current Score: ${score}</p><p>${directionMessage}</p><p>${changeCharMessage}</p><p>${additionalMessage}`;
        document.body.insertBefore(infoArea, canvasTag[0]);
    }

    // sets player back to the start in the bottom center
    reset() {
        // put player back to starting point
        this.x = 200;
        this.y = 380;

        // create new enemies and clear the old ones
        generateRandomEnemies();

        // draw the bottom info area
        this.drawInfoArea();

        // delay the clearing of a message so player can read it
        setTimeout(function() {
            ctx.clearRect(0, 0, 500, 500);
        }, 750);
    }

    // start a new game, reset score, run reset
    newGame() {
        score = 0;
        this.reset();
    }
}

var player = new Player(200, 380, 100); // set new player in the bottom center

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
        69: 'e',
        71: 'g',
        72: 'h',
        80: 'p',
        83: 's'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// start the game with the default player
player.newGame();