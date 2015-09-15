import phaser from 'photonstorm/phaser';

const Phaser = phaser.Phaser;

export function initGame(SpaceHipster) {

//title screen
	SpaceHipster.Game = function () {
	};

	SpaceHipster.Game.prototype = {
		create: function () {
			this.game.world.setBounds(0, 0, 1920, 1920);
			this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
			//create player
			console.info(this.game.world.centerX, this.game.world.centerY);
			this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
			this.player.scale.setTo(2);
			this.player.animations.add('fly', [0, 1, 2, 3], 5, true);
			this.player.animations.play('fly');
			this.playerScore = 0;

//enable player physics
			this.game.physics.arcade.enable(this.player);
			this.playerSpeed = 120;
			this.player.body.collideWorldBounds = true;

//sounds
			this.explosionSound = this.game.add.audio('explosion');
			this.collectSound = this.game.add.audio('collect');
			this.game.camera.follow(this.player);
			this.generateAsteriods();
			this.generateCollectables();
			this.showLabels();
		},
		showLabels: function() {
			//score text
			var text = "0";
			var style = { font: "20px Arial", fill: "#fff", align: "center" };
			this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
			this.scoreLabel.fixedToCamera = true;
		},
		generateCollectables: function() {
			this.collectables = this.game.add.group();

			//enable physics in them
			this.collectables.enableBody = true;
			this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

			//phaser's random number generator
			var numCollectables = this.game.rnd.integerInRange(100, 150);
			var collectable;

			for (var i = 0; i < numCollectables; i++) {
				//add sprite
				collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
				collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
				collectable.animations.play('fly');
			}
		},
		generateAsteriods: function() {
			this.asteroids = this.game.add.group();

			//enable physics in them
			this.asteroids.enableBody = true;
			this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;

			//phaser's random number generator
			var numAsteroids = this.game.rnd.integerInRange(150, 200);
			var asteriod;

			for (var i = 0; i < numAsteroids; i++) {
				//add sprite
				asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
				asteriod.scale.setTo(this.game.rnd.integerInRange(10, 40)/10);

				//physics properties
				asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
				asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
				asteriod.body.immovable = true;
				asteriod.body.collideWorldBounds = true;
			}
		},
		collect: function(player, collectable) {
			//play collect sound
			this.collectSound.play();

			//update score
			this.playerScore++;
			//will add later: this.scoreLabel.text = this.playerScore;

			//remove sprite
			collectable.kill();
		},
		gameOver: function() {
			//pass it the score as a parameter
			this.game.state.start('MainMenu', true, false, this.playerScore);
		},
		hitAsteroid: function(player, asteroid) {
			//play explosion sound
			this.explosionSound.play();

			//player explosion will be added here
			var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
			emitter.makeParticles('playerParticle');
			emitter.minParticleSpeed.setTo(-200, -200);
			emitter.maxParticleSpeed.setTo(200, 200);
			emitter.gravity = 0;
			emitter.start(true, 1000, null, 100);

			this.player.kill();

			this.game.time.events.add(800, this.gameOver, this);
		},

		update: function () {
			if(this.game.input.activePointer.justPressed()) {

				//move on the direction of the input
				this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);
			}

//collision between player and asteroids
			this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);
			//overlapping between player and collectables
			this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);
		}
	};
}