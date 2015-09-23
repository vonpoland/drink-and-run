import MoveableGameObject from '../game/base/moveableGameObject';
import GameObject from '../game/base/gameObject';

export function createMoveableObject(game, options) {
	let sprite = game.add.sprite(options.x, options.y, options.sprite);
	let gameObject = new MoveableGameObject(Object.assign(options, {
		sprite: sprite
	}));

	game.physics.arcade.enable(gameObject.sprite);

	return gameObject;
}

export function createObject(game, options) {
	let sprite = game.add.sprite(options.x, options.y, options.sprite);
	let gameObject = new GameObject({
		sprite: sprite
	});

	game.physics.arcade.enable(gameObject.sprite);

	return gameObject;
}

export function createGroupFromObjects(game, map, options) {
	let group = game.add.group();

	if (options.enableBody) {
		group.enableBody = true;
	}

	map.createFromObjects(options.layer, options.objectId, options.sprite, 0, true, false, group);

	return group;
}