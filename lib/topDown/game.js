import phaser from 'photonstorm/phaser';
import {createGroupFromObjects, createMoveableObject} from './objectsFactory/objectsFactory';
import MoveOnTilesEngine from './game/engine/MoveOnTilesEngine';
import ChaseObjectEngine from './game/engine/ChaseObjectEngine';

const Phaser = phaser.Phaser;
const BEER_ID = 1177;
const MOVE_PARAMS = {
	layer: 'blockedLayer',
	tileSize: 16
};

export function initGame(TopDownGame) {
	TopDownGame.Game = function () {
	};

	TopDownGame.Game.prototype = {
		drinkBeer: function (player, beer) {
			this.score += 1;
			this.scoreText.text = 'Score: ' + this.score;
			beer.kill();
		},
		create: function () {
			this.map = this.game.add.tilemap('level1');
			this.map.addTilesetImage('tiles');
			this.backgroundlayer = this.map.createLayer('backgroundLayer');
			this.blockedLayer = this.map.createLayer('blockedLayer');
			this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
			this.backgroundlayer.resizeWorld();
			this.player = createMoveableObject(this.game, {
				x: 16,
				y: 16,
				sprite: 'player',
				moveEngine: {
					type: MoveOnTilesEngine,
					options: {
						tileSize: 16
					}
				}
			});
			this.beers = createGroupFromObjects(this.game, this.map, {
				layer: 'objectsLayer',
				objectId: BEER_ID,
				sprite: 'greencup',
				enableBody: true
			});
			this.policeman = createMoveableObject(this.game, {
				x: 112,
				y: 288,
				sprite: 'bluecup',
				moveEngine: {
					type: ChaseObjectEngine,
					options: {
						target: this.player,
						tileSize: 16
					}
				}
			});

			this.game.time.events.loop(1000, () => {
				this.timeEvent = true;
			}, this);
			this.game.physics.arcade.collide(this.player.sprite, this.blockedLayer);
			this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.player.changeDirection.bind(this.player), this);
			this.game.input.onTap.add(this.player.changeDirection.bind(this.player), this);
			this.scoreText = this.game.add.text(0, 0, 'score: 0', {fontSize: '16px', fill: '#fff'});
			this.score = 0;
		},
		update: function () {
			this.game.physics.arcade.overlap(this.player.sprite, this.beers, this.drinkBeer, null, this);

			if (this.timeEvent) {
				this.player.move(this.map, MOVE_PARAMS);
				this.policeman.move(this.map, MOVE_PARAMS);
				this.timeEvent = false;
				//this.game.physics.arcade.moveToObject(this.policeman, this.player, 300);
			}
		}
	};
}