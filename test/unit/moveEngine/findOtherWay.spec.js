/* globals describe, it */

import expect from 'expect.js';
import sinon from 'sinon';
import {findOtherWayStrategy} from '../../../lib/topDown/game/moveStrategies';

describe('Find other way to chase object', function () {
	/** map
	 *x/y012345678
	 *  0*********
	 *  1*--x----*
	 *  2*-***---*
	 *  3*-------*
	 *  4*-t-----*
	 *  5*********
	 *  x -> policeman
	 *  t -> target
	 *  *** wall
	 */
	// given
	const map = {
		getTileWorldXY: function (x, y) {
			if(y === 2 && [2, 3, 4].indexOf(x) >= 0) {
				return true;
			}
			else if(y === 0) {
				return true;
			}
			else if(x === 0) {
				return true;
			} else if(x === 8) {
				return true;
			} else if(y ===  5) {
				return true;
			}

			return false;
		}
	};

	it('Should check if map is blocked at given position', function () {
		// when
		let result = map.getTileWorldXY(0, 1);

		// then
		expect(result).to.be(true);
	});

	it('Should check if map isn\'t blocked at given position', function () {
		// when
		let result = map.getTileWorldXY(1, 2);

		// then
		expect(result).to.be(false);
	});

	it('Should find way to move next to wall - policeman at the middle of the wall', function () {
		// given
		let options = {
			target: {
				position: {
					x: 2,
					y: 4
				}
			},
			map: map,
			tileSize: 1
		};
		let results = [];

		//when
		let step = findOtherWayStrategy({
			x: 3,
			y: 1
		}, options);

		results.push(step);
		step = findOtherWayStrategy(step, options);
		results.push(step);

		// then
		expect(results).to.eql([{
			x: 4,
			y: 1
		}, {
			x: 5,
			y: 1
		}]);
	});

	it('Should find way to move next to wall - policeman on the left side of the wall', function () {
		// given
		let options = {
			target: {
				position: {
					x: 2,
					y: 4
				}
			},
			tileSize: 1,
			map: map
		};
		let results = [];

		//when
		let step = findOtherWayStrategy({
			x: 2,
			y: 1
		}, options);

		results.push(step);

		// then
		expect(results).to.eql([{
			x: 1,
			y: 1
		}]);
	});

	it('Should find way to move next to wall - custom wall 1', function () {
		/** map
		 *x/y012345678
		 *  0*********
		 *  1*--*x---*
		 *  2*--*----*
		 *  3*-t*----*
		 *  4*-------*
		 *  5*********
		 *  x -> policeman
		 *  t -> target
		 *  *** wall
		 */
		// given
		const map = {
			getTileWorldXY: function (x, y) {
				if(x === 3 && [1, 2, 3].indexOf(y) >= 0) {
					return true;
				}
				else if(y === 0 || y === 5) {
					return true;
				}
				else if(x === 0 || x === 8) {
					return true;
				}

				return false;
			}
		};

		// given
		let options = {
			target: {
				position: {
					x: 2,
					y: 3
				}
			},
			map: map,
			tileSize: 1
		};
		let results = [];

		//when
		let step = findOtherWayStrategy({
			x: 4,
			y: 1
		}, options);

		results.push(step);
		step = findOtherWayStrategy(step, options);
		results.push(step);

		// then
		expect(results).to.eql([{
			x: 4,
			y: 2
		}, {
			x: 4,
			y: 3
		}]);
	});
});
