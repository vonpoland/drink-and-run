/* globals WeakMap*/
import GameObject from './gameObject';

const privateData = new WeakMap();
export const MOVES = {
	UP: 'up',
	DOWN: 'down',
	RIGHT: 'right',
	LEFT: 'left'
};


export default
class MoveableGameObject extends GameObject {
	constructor(options) {
		super(options);
		privateData.set(this, options);
	}

	get position() {
		return privateData.get(this).sprite.body.position;
	}

	get direction() {
		return privateData.get(this).direction;
	}

	move(map) {
		let options = privateData.get(this);
		let engine = options.moveStrategies;
		let nextPosition = engine.reduce((previous, strategy) => {
			return strategy(previous, Object.assign(options, {
				previousPosition: {
					x: this.sprite.body.position.x,
					y: this.sprite.body.position.y
				}
			}));
		}, this.sprite.body.position);

		let isBlocked = map.getTileWorldXY(nextPosition.x, nextPosition.y, options.tileSize, options.tileSize, options.layer);
		let hasOtherOption = options.onBlock ? options.onBlock(nextPosition, map, options) : false;

		if (isBlocked && !hasOtherOption) {
			return;
		}

		options.previousPosition = {
			x: this.sprite.body.position.x,
			y: this.sprite.body.position.y
		};

		this.sprite.body.position.x = nextPosition.x;
		this.sprite.body.position.y = nextPosition.y;
	}

	changeDirection() {
		let data = privateData.get(this);

		if (data.direction === MOVES.DOWN) {
			data.direction = MOVES.LEFT;
		} else if (data.direction === MOVES.UP) {
			data.direction = MOVES.RIGHT;
		} else if (data.direction === MOVES.RIGHT) {
			data.direction = MOVES.DOWN;
		} else if (data.direction === MOVES.LEFT) {
			data.direction = MOVES.UP;
		}
	}
}