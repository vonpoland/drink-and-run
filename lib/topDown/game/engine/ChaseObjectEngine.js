/* globals WeakMap*/
import MoveOnTilesEngine from './MoveOnTilesEngine';

export default
class ChaseObjectEngined extends MoveOnTilesEngine {
	constructor(options) {
		super(options);

		this.data.get(this).target = options.target;
	}

	nextPosition(nextPosition) {
		var nextTarget = super.nextPosition(this.data.get(this).target.sprite.body.position);

		console.info(nextTarget);
		return nextTarget;
	}
}