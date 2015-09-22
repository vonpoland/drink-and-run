/* globals WeakMap*/
const privateData = new WeakMap();

const MOVES = {
	UP: 'up',
	DOWN: 'down',
	RIGHT: 'right',
	LEFT: 'left'
};

export default
class MoveOnTilesEngine {
	constructor(options) {
		privateData.set(this, {});
		privateData.get(this).direction = options.direction || MOVES.DOWN;
		privateData.get(this).tileSize = options.tileSize;
	}

	get data() {
		return privateData;
	}

	get direction() {
		return this.data.get(this).direction;
	}

	nextPosition(currentPosition, options = {}) {
		let data = privateData.get(this);
		let position = {
			x: currentPosition.x,
			y: currentPosition.y
		};
		let move = data.tileSize;
		let direction = options.direction || data.direction;

		if (direction === MOVES.DOWN) {
			position.y += move;
		} else if (direction === MOVES.UP) {
			position.y -= move;
		} else if (direction === MOVES.RIGHT) {
			position.x += move;
		} else if (direction === MOVES.LEFT) {
			position.x -= move;
		}

		return position;
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