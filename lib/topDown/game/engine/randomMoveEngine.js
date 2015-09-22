import ChaseObjectEngined from './chaseObjectEngine';

export default
class RandomMoveEngine extends ChaseObjectEngined {
	constructor(options) {
		super(options);
	}

	nextPosition(currentPosition) {
		let nextPosition = super.nextPosition(currentPosition);

		console.info(nextPosition);

		if(currentPosition.x !== nextPosition.x && currentPosition.y !== nextPosition.y) {
			var random = Math.floor(Math.random()*2);

			if(random) {
				if(nextPosition.x > nextPosition.y) {
					nextPosition.x = currentPosition.x;
				} else {
					nextPosition.y = currentPosition.y;
				}
			}
		}
		return nextPosition;
	}
}