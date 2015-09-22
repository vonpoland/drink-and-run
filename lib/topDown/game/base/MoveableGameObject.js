/* globals WeakMap*/
import GameObject from './gameObject';

const privateData = new WeakMap();

export default class MoveableGameObject extends GameObject {
	constructor(options) {
		super(options);
		privateData.set(this, {});
		privateData.get(this).moveEngine = options.moveEngine;
	}

	get position() {
		return this.sprite.body.position;
	}

	get direction() {
		return privateData.get(this).moveEngine.direction;
	}

	move(map, options) {
		let engine = privateData.get(this).moveEngine;
		let nextPosition = engine.nextPosition(this.sprite.body.position);
		let isBlocked = map.getTileWorldXY(nextPosition.x, nextPosition.y, options.tileSize, options.tileSize, options.layer);

		if(isBlocked) {
			console.info('im blocked');
			return;
		}

		this.sprite.body.position.x = nextPosition.x;
		this.sprite.body.position.y = nextPosition.y;
	}

	changeDirection() {
		let engine = privateData.get(this).moveEngine;

		engine.changeDirection();
	}
}