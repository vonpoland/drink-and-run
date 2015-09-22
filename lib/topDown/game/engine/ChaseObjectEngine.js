import MoveOnTilesEngine from './MoveOnTilesEngine';

function setCoordinate(nextPosition, currentPosition, moveSize) {
	if(nextPosition > currentPosition) {
		return currentPosition + moveSize;
	} else if(nextPosition < currentPosition) {
		return currentPosition - moveSize;
	}

	return currentPosition;
}

export default
class ChaseObjectEngined extends MoveOnTilesEngine {
	constructor(options) {
		super(options);

		this.data.get(this).target = options.target;
	}

	nextPosition(currentPosition) {
		let data = this.data.get(this);
		let tileSize = data.tileSize;
		let nextPosition = {};
		let targetNextPosition = super.nextPosition(data.target.position, { direction: data.target.direction });

		nextPosition.x = setCoordinate(targetNextPosition.x, currentPosition.x, tileSize);
		nextPosition.y = setCoordinate(targetNextPosition.y, currentPosition.y, tileSize);

		return nextPosition;
	}
}