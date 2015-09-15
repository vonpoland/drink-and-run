import phaser from 'photonstorm/phaser';

const Phaser = phaser.Phaser;

export function initPreload(TopDownGame) {
//loading the game assets
	TopDownGame.Preload = function(){};

	TopDownGame.Preload.prototype = {
		preload: function() {
			//show loading screen
			this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadbar');
			this.preloadBar.anchor.setTo(0.5);

			this.load.setPreloadSprite(this.preloadBar);

			//load game assets
			this.load.tilemap('level1', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
			this.load.image('tiles', 'assets/images/tiles.png');
			this.load.image('greencup', 'assets/images/greencup.png');
			this.load.image('bluecup', 'assets/images/bluecup.png');
			this.load.image('player', 'assets/images/player.png');
			this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
			this.load.image('browndoor', 'assets/images/browndoor.png');

		},
		create: function() {
			this.state.start('Game');
		}
	};
}
