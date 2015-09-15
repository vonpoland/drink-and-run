import phaser from 'photonstorm/phaser';
import {bootInit} from './boot';
import {preloadInit} from './preload';
import {intMainMenu} from './mainMenu';
import {initGame} from './game';

const Phaser = phaser.Phaser;

var SpaceHipster = {};

SpaceHipster.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');


bootInit(SpaceHipster);
preloadInit(SpaceHipster);
intMainMenu(SpaceHipster);
initGame(SpaceHipster);

SpaceHipster.game.state.add('Boot', SpaceHipster.Boot);
//uncomment these as we create them through the tutorial
SpaceHipster.game.state.add('Preload', SpaceHipster.Preload);
SpaceHipster.game.state.add('MainMenu', SpaceHipster.MainMenu);
SpaceHipster.game.state.add('Game', SpaceHipster.Game);

SpaceHipster.game.state.start('Boot');