/* globals describe, it */

import expect from 'expect.js';
import sinon from 'sinon';
import R from 'ramda';
import {findOtherWayStrategy} from '../../../lib/topDown/game/moveStrategies';

describe('Find other way to chase object', function () {
	/** map
	 *x/y0123456
	 *  0--x----
	 *  1-***---
	 *  2-----t-
	 *
	 *  x -> policeman
	 *  t -> target
	 *  *** wall
	 */
	// given
	let map = {
		getTileWorldXY: function (x, y) {
			return (y === 1 && [1, 2, 3].indexOf(x) >= 0);
		}
	};

	it('Should check if map is blocked at given position', function () {
		//when
		let result = map.getTileWorldXY(1, 1);

		// then
		expect(result).to.be(true);
	});

	it('Should check if map isn\'t blocked at given position', function () {
		//when
		let result = map.getTileWorldXY(1, 2);

		// then
		expect(result).to.be(false);
	});

	it('Should find way to move next to wall', function () {
		//when
		let result = findOtherWayStrategy({
			x: 1,
			y: 2
		});

		// then
		expect(result).to.be(false);
	});
});
