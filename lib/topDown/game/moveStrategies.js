import {MOVES} from './base/moveableGameObject';
import R from 'ramda';

function setCoordinate(nextPosition, currentPosition, moveSize) {
	if (nextPosition > currentPosition) {
		return currentPosition + moveSize;
	} else if (nextPosition < currentPosition) {
		return currentPosition - moveSize;
	}

	return currentPosition;
}

const tryGo = R.curry((where, until, currentPosition, map, options) => {
	let nextTile;
	let nextPosition = {x: currentPosition.x, y: currentPosition.y};
	let conditionPosition = {x: nextPosition.x, y: nextPosition.y};
	let steps = 1;

	while (true) {
		if (where === MOVES.LEFT) {
			nextPosition.x = nextPosition.x - options.tileSize;
		} else if (where === MOVES.RIGHT) {
			nextPosition.x = nextPosition.x + options.tileSize;
		} else if (where === MOVES.UP) {
			nextPosition.y = nextPosition.y - options.tileSize;
		} else if (where === MOVES.DOWN) {
			nextPosition.y = nextPosition.y + options.tileSize;
		}

		nextTile = map.getTileWorldXY(nextPosition.x, nextPosition.y, options.tileSize, options.tileSize, options.layer);

		if (nextTile) {
			return null;
		}

		if (until === MOVES.DOWN) {
			conditionPosition.y = nextPosition.y + options.tileSize;
			conditionPosition.x = nextPosition.x;
		} else if (until === MOVES.UP) {
			conditionPosition.y = nextPosition.y - options.tileSize;
			conditionPosition.x = nextPosition.x;
		} else if (until === MOVES.LEFT) {
			conditionPosition.x = nextPosition.x - options.tileSize;
			conditionPosition.y = nextPosition.y;
		} else if (until === MOVES.RIGHT) {
			conditionPosition.x = nextPosition.x + options.tileSize;
			conditionPosition.y = nextPosition.y;
		}

		nextTile = map.getTileWorldXY(conditionPosition.x, conditionPosition.y, options.tileSize, options.tileSize, options.layer);

		if (!nextTile) {
			return steps;
		}

		steps++;
	}

});

function go(currentPosition, direction, tileSize) {
	if (direction === MOVES.LEFT) {
		return {
			x: currentPosition.x - tileSize,
			y: currentPosition.y
		};
	} else if (direction === MOVES.RIGHT) {
		return {
			x: currentPosition.x + tileSize,
			y: currentPosition.y
		};
	} else if (direction === MOVES.UP) {
		return {
			x: currentPosition.x,
			y: currentPosition.y - tileSize
		};
	} else if (direction === MOVES.DOWN) {
		return {
			x: currentPosition.x,
			y: currentPosition.y + tileSize
		};
	}
}

const getDirectionsOfTarget = target => R.reduce((acc, next) => {
	let value = target[next];

	if (value) {
		acc.push(next);
	}

	return acc;
}, [])(R.keys(target));


function goByMoves(first, second, currentPosition, tileSize) {
	if (first.count !== null && second.count !== null) {
		return go(currentPosition, first.count < second.count ? first.direction : second.direction, tileSize);
	} else if (second.count !== null) {
		return go(currentPosition, second.direction, tileSize);
	} else if (first.count !== null) {
		return go(currentPosition, first.direction, tileSize);
	}
}

export function findOtherWayStrategy(currentPosition, options) {
	let targetPosition = options.target.position;
	let whereIsTarget = {
		down: (currentPosition.y - targetPosition.y) < 0,
		up: (currentPosition.y - targetPosition.y) > 0,
		left: (currentPosition.x - targetPosition.x) > 0,
		right: (currentPosition.x - targetPosition.x) < 0
	};

	let tryGoCurried = tryGo(R.__, R.__, currentPosition, options.map, options);
	let getTile = (x, y) => options.map.getTileWorldXY(x, y, options.tileSize, options.tileSize, options.layer);

	whereIsTarget.isBlockedDown = whereIsTarget.down && !!getTile(currentPosition.x, currentPosition.y + options.tileSize);
	whereIsTarget.isBlockedUp = whereIsTarget.up && !!getTile(currentPosition.x, currentPosition.y - options.tileSize);
	whereIsTarget.isBlockedLeft = whereIsTarget.left && !!getTile(currentPosition.x - options.tileSize, currentPosition.y);
	whereIsTarget.isBlockedRight = whereIsTarget.right && !!getTile(currentPosition.x + options.tileSize, currentPosition.y);

	if (whereIsTarget.isBlockedDown || whereIsTarget.isBlockedUp) {
		let until = whereIsTarget.isBlockedDown ? MOVES.DOWN : MOVES.UP;
		let rightMoves = {count: tryGoCurried(MOVES.RIGHT, until), direction: MOVES.RIGHT};
		let leftMoves = {count: tryGoCurried(MOVES.LEFT, until), direction: MOVES.LEFT};

		return goByMoves(leftMoves, rightMoves, currentPosition, options.tileSize);
	} else if (whereIsTarget.isBlockedLeft || whereIsTarget.isBlockedRight) {
		let until = whereIsTarget.isBlockedLeft ? MOVES.LEFT : MOVES.RIGHT;
		let upMoves = {count: tryGoCurried(MOVES.UP, until), direction: MOVES.UP};
		let downMoves = {count: tryGoCurried(MOVES.DOWN, until), direction: MOVES.DOWN};

		return goByMoves(downMoves, upMoves, currentPosition, options.tileSize);
	} else {
		let targetDirections = getDirectionsOfTarget(whereIsTarget);
		let targetDirectionsReversed = R.reverse(targetDirections);
		if (R.length(targetDirections) !== 2) {
			return null;
		}

		let firstTry = {count: tryGoCurried.apply(null, targetDirections), direction: R.head(targetDirections)};
		let secondTry = {
			count: tryGoCurried.apply(null, targetDirectionsReversed),
			direction: R.head(targetDirectionsReversed)
		};

		return goByMoves(firstTry, secondTry, currentPosition, options.tileSize);
	}
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

	if (options.map.getTileWorldXY(targetNextPosition.x, targetNextPosition.y, options.tileSize, options.tileSize, options.layer)) {
		targetNextPosition = options.target.position;
	}

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