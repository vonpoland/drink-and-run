import phaser from 'photonstorm/phaser';

const Phaser = phaser.Phaser;
const MOVE = 16;
const BEER_ID = 1177;
export function initGame(TopDownGame) {
	TopDownGame.Game = function(){};

	TopDownGame.Game.prototype = {
		//find objects in a Tiled layer that containt a property called "type" equal to a certain value
		findObjectsByType: function(type, map, layer) {
			var result = [];
			map.objects[layer].forEach(function(element){
				if(element.properties.type === type) {
					//Phaser uses top left, Tiled bottom left so we have to adjust the y position
					//also keep in mind that the cup images are a bit smaller than the tile which is 16x16
					//so they might not be placed in the exact pixel position as in Tiled
					element.y -= map.tileHeight;
					result.push(element);
				}
			});
			return result;
		},
		//create a sprite from an object
		createFromTiledObject: function(element, group) {
			var sprite = group.create(element.x, element.y, element.properties.sprite);

			//copy all properties to the sprite
			Object.keys(element.properties).forEach(function(key){
				sprite[key] = element.properties[key];
			});
		},
		createBeers: function() {
			//create items
			this.beers = this.game.add.group();
			this.beers.enableBody = true;
			this.map.createFromObjects('objectsLayer', BEER_ID, 'greencup', 0, true, false, this.beers);
		},
		drinkBeer: function(player, beer) {
			this.score += 1;
			this.scoreText.text = 'Score: ' + this.score;
			beer.kill();
		},
		update: function() {
			this.game.physics.arcade.collide(this.player, this.blockedLayer);
			this.game.physics.arcade.overlap(this.player, this.beers, this.drinkBeer, null, this);
			if(this.timeEvent) {
				this.moveState.move();
				this.timeEvent = false;
			}

			if(this.cursors.up.isDown) {
				this.player.body.velocity.y -= 50;
			}
			else if(this.cursors.down.isDown) {
				this.player.body.velocity.y += 50;
			}
			if(this.cursors.left.isDown) {
				this.player.body.velocity.x -= 50;
			}
			else if(this.cursors.right.isDown) {
				this.player.body.velocity.x += 50;
			}
		},
		create: function() {
			this.map = this.game.add.tilemap('level1');

			//the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
			this.map.addTilesetImage('tiles');

			//create layer
			this.backgroundlayer = this.map.createLayer('backgroundLayer');
			this.blockedLayer = this.map.createLayer('blockedLayer');

			//collision on blockedLayer
			this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

			//resizes the game world to match the layer dimensions
			this.backgroundlayer.resizeWorld();

			this.createBeers();

			//create player
			var result = this.findObjectsByType('player', this.map, 'objectsLayer');
			this.game.time.events.loop(1000, this.movePlayer, this);

//we know there is just one result
			this.player = this.game.add.sprite(16, 16, 'player');
			this.game.physics.arcade.enable(this.player);

//the camera will follow the player in the world
			this.game.camera.follow(this.player);

//move player with cursor keys
			this.cursors = this.game.input.keyboard.createCursorKeys();
			var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
			spaceKey.onDown.add(this.changeDir, this);
			this.moveState = new MoveState(this.player);
			this.game.input.onTap.add(this.changeDir, this);
			this.scoreText = this.game.add.text(0, 0, 'score: 0', { fontSize: '16px', fill: '#fff' });
			this.score = 0;
		},
		changeDir: function() {
			this.moveState.nextDirection();

		},
		movePlayer: function() {
			var nextPosition = this.moveState.nextPosition();
			var t = this.map.getTileWorldXY(nextPosition.x, nextPosition.y, 16, 16, 'blockedLayer');

			this.timeEvent = t === null;
		}
	};
}

class MoveState {
	constructor(player, direction = MoveState.MOVES.DOWN) {
		this.direction = direction;
		this.player = player;
	}

	static get MOVES() {
		return {
			UP: 'up',
			DOWN: 'down',
			RIGHT: 'right',
			LEFT: 'left'
		};
	}
	nextPosition() {
		var position = {
			x: this.player.body.x,
			y: this.player.body.y
		};

		var move = MOVE;
		if(this.direction === MoveState.MOVES.DOWN) {
			position.y += move;
		} else if(this.direction === MoveState.MOVES.UP) {
			position.y -= move;
		} else if(this.direction === MoveState.MOVES.RIGHT) {
			position.x += move;
		} else if(this.direction === MoveState.MOVES.LEFT) {
			position.x -= move;
		}

		return position;
	}
	nextDirection() {
		if(this.direction === MoveState.MOVES.DOWN) {
			this.direction = MoveState.MOVES.LEFT;
		} else if(this.direction === MoveState.MOVES.UP) {
			this.direction = MoveState.MOVES.RIGHT;
		} else if(this.direction === MoveState.MOVES.RIGHT) {
			this.direction = MoveState.MOVES.DOWN;
		} else if(this.direction === MoveState.MOVES.LEFT) {
			this.direction = MoveState.MOVES.UP;
		}
	}
	move() {
		var position = this.player.body;
		var move = MOVE;

		if(this.direction === MoveState.MOVES.DOWN) {
			position.y += move;
		} else if(this.direction === MoveState.MOVES.UP) {
			position.y -= move;
		} else if(this.direction === MoveState.MOVES.RIGHT) {
			position.x += move;
		} else if(this.direction === MoveState.MOVES.LEFT) {
			position.x -= move;
		}
	}
}