/* globals describe, it */

import expect from 'expect.js';
import {findOtherWayStrategy} from '../../../../lib/topDown/game/moveStrategies';

describe('It should if it finds path correctly', function() {
	it('Should find way to move next to wall - custom wall 2', function () {
		/** map
		 *x/y012345678
		 *  0*********
		 *  1*t------*
		 *  2****---*
		 *  3*-------*
		 *  4*-------*
		 *  5****----*
		 *  6*x-------*
		 *  7*********
		 *  x -> policeman
		 *  t -> target
		 *  *** wall
		 */
		// given
		const map = {
			getTileWorldXY: function (x, y) {
				if(y === 2 && [1, 2, 3].indexOf(x) >= 0) {
					return true;
				} else if(y === 5 && [1, 2, 3].indexOf(x) >= 0) {
					return true;
				}
				else if(y === 0 || y === 7) {
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
					x: 1,
					y: 1
				}
			},
			tileSize: 1,
			map: map
		};
		let results = [];

		//when
		let step = findOtherWayStrategy({
			x: 1,
			y: 6
		}, options);

		results.push(step);
		step = findOtherWayStrategy(step, options);
		results.push(step);
		step = findOtherWayStrategy(step, options);
		results.push(step);

		// then
		expect(results).to.eql([{
			x: 2,
			y: 6
		}, {
			x: 3,
			y: 6
		}, {
			x: 4,
			y: 6
		}]);
	});
});
