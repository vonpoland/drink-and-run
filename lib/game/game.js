import phaser from 'photonstorm/phaser';

const privateData = new WeakMap();
let cursors;
const WIDTH = 400;
const HEIGHT = 600;

class Game {
	constructor() {
		this.bounds = null;
	}
	set bird(bird) {
		privateData.set(this, {
			bird: bird
		});
	}

	get bird() {
		return privateData.get(this).bird;
	}

	restartGame() {
		game.state.start('main');
	}
	preload() {
		game.stage.backgroundColor = '#71c5cf';
		game.load.image('bird', 'assets/bird.png');
		game.load.image('pipe', 'assets/pipe.png');
	}
	jump() {
		this.bird.body.velocity.y = -350;
	}
	addOnePipe (x, y) {
		// Get the first dead pipe of our group
		var pipe = this.pipes.getFirstDead();

		// Set the new position of the pipe
		pipe.reset(x, y);

		// Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;

		// Kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;
	}
	addRowOfPipes() {
		// Pick where the hole will be
		var hole = Math.floor(Math.random() * 5) + 1;

		// Add the 6 pipes
		for (var i = 0; i < 8; i++) {
			if (i !== hole && i !== hole + 1 && i !== hole -1) {
				this.addOnePipe(400, i * 60 + 10);
			}
		}

		this.score += 1;
		this.labelScore.text = this.score;
	}
	move() {
		this.bird.body.x += 30;
	}
	create() {
		game.physics.startSystem(phaser.Phaser.Physics.P2JS);
		game.physics.p2.defaultRestitution = 0;

		this.bounds = this.game.add.group();
		this.bird = this.game.add.sprite(100, 245, 'bird');
		this.pipes = game.add.group(); // Create a group
		this.pipes.enableBody = true;  // Add physics to the group
		this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes

		game.physics.p2.enable(this.bird);
		this.bird.body.setZeroDamping();
		this.bird.body.fixedRotation = true;

		//this.timer = game.time.events.loop(1500, this.move, this);
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });

		//game.input.onTap.add(this.jump, this);
		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.changeDir, this);
		cursors = game.input.keyboard.createCursorKeys();
	}
	render() {}
	update() {
		this.bird.body.setZeroVelocity();

		if (cursors.left.isDown)
		{
			this.bird.body.moveLeft(400);
		}
		else if (cursors.right.isDown)
		{
			this.bird.body.moveRight(400);
		}

		if (cursors.up.isDown)
		{
			this.bird .body.moveUp(400);
		}
		else if (cursors.down.isDown)
		{
			this.bird .body.moveDown(400);
		}
	}
}


var game = new phaser.Phaser.Game(WIDTH, HEIGHT, phaser.Phaser.AUTO, 'gameDiv');
game.state.add('main', Game);
game.state.start('main');