import phaser from 'photonstorm/phaser';
import {initBoot} from './boot';
import {initPreload} from './preload';
import {initGame} from './game';

const Phaser = phaser.Phaser;

var TopDownGame = TopDownGame || {};

TopDownGame.game = new Phaser.Game(160, 320, Phaser.AUTO, '');

initBoot(TopDownGame);
initPreload(TopDownGame);
initGame(TopDownGame);

TopDownGame.game.state.add('Boot', TopDownGame.Boot);
TopDownGame.game.state.add('Preload', TopDownGame.Preload);
TopDownGame.game.state.add('Game', TopDownGame.Game);

TopDownGame.game.state.start('Boot');