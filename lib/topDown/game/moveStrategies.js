import {MOVES} from './base/moveableGameObject';

function setCoordinate(nextPosition, currentPosition, moveSize) {
	if (nextPosition > currentPosition) {
		return currentPosition + moveSize;
	} else if (nextPosition < currentPosition) {
		return currentPosition - moveSize;
	}

	return currentPosition;
}

export function findOtherWayStrategy(nextPosition, map, options) {
	return map.getTileWorldXY(nextPosition.x, nextPosition.y, options.tileSize, options.tileSize, options.layer);
}
export function randomMoveStrategy(currentPosition, options) {
	if (Math.floor(Math.random() * 5) === 0) {
		return options.previousPosition;
	}

	if (options.previousPosition && currentPosition.x !== options.previousPosition.x && currentPosition.y !== options.previousPosition.y) {
		let random = Math.floor(Math.random() * 2);

		if (random) {
			if (currentPosition.x > currentPosition.y) {
				currentPosition.x = options.previousPosition.x;
			} else {
				currentPosition.y = options.previousPosition.y;
			}
		}
	}
	return currentPosition;
}

export function chaseObjectStrategy(currentPosition, options) {
	let tileSize = options.tileSize;
	let nextPosition = {};
	let targetNextPosition = moveOnTileStrategy(options.target.position, Object.assign(options, {direction: options.target.direction}));

	nextPosition.x = setCoordinate(targetNextPosition.x, currentPosition.x, tileSize);
	nextPosition.y = setCoordinate(targetNextPosition.y, currentPosition.y, tileSize);

	return nextPosition;
}
export function moveOnTileStrategy(currentPosition, options) {
	let position = {
		x: currentPosition.x,
		y: currentPosition.y
	};
	let move = options.tileSize;
	let direction = options.direction;

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