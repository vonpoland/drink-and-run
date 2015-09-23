/* globals describe, it */
import expect from 'expect.js';
import sinon from 'sinon';
import R from 'ramda';
import {moveOnTileStrategy, chaseObjectStrategy, randomMoveStrategy} from '../../../lib/topDown/game/moveStrategies';
import {createMoveableObject} from '../../../lib/topDown/objectsFactory/objectsFactory';

const TILE_SIZE = 30;

function getGameMock(options) {
	let game = {
		add: {
			sprite: function () {
				return {
					body: {
						position: {
							x: options.x,
							y: options.y
						}
					}
				};
			}
		},
		physics: {
			arcade: {
				enable: function () {
				}
			}
		}
	};

	return sinon.mock(game).object;
}
function getMoveableObject(options) {
	return createMoveableObject(getGameMock(options), {
		sprite: options.sprite || 'sprite',
		tileSize: TILE_SIZE,
		moveStrategies: [moveOnTileStrategy],
		direction: options.direction || 'down'
	});
}

describe('ChaseObjectEngine', function () {
	describe('#nextPostion() -- moves down', function () {
		it('should change increase y coordinate by tile size', function () {
			// given
			const target = new getMoveableObject({
				x: 90,
				y: 60
			});
			target.changeDirection(); // go left
			target.changeDirection(); // go up
			target.changeDirection(); // right

			// when
			const result = chaseObjectStrategy({
				x: 90,
				y: 30
			}, {
				target: target,
				tileSize: TILE_SIZE
			});

			// then
			expect(result.x).to.be(120);
			expect(result.y).to.be(60);
		});

		it('should change increase y coordinate by tile size', function () {
			// given
			const target = new getMoveableObject({
				x: 90,
				y: 120
			});

			// when
			const result = chaseObjectStrategy({
				x: 90,
				y: 30
			},{
				target: target,
				tileSize: TILE_SIZE
			});

			// then
			expect(result.x).to.be(90);
			expect(result.y).to.be(60);
		});

		it('should change increase x coordinate by tile size', function () {
			// given
			const target = new getMoveableObject({
				x: 150,
				y: 30
			});

			// when
			const result = chaseObjectStrategy({
				x: 90,
				y: 30
			}, {
				target: target,
				tileSize: TILE_SIZE
			});

			// then
			expect(result.x).to.be(120);
			expect(result.y).to.be(60);
		});

		it('should change decrease x coordinate by tile size', function () {
			// given
			const target = new getMoveableObject({
				x: 0,
				y: 30
			});

			// when
			const result = chaseObjectStrategy({
				x: 90,
				y: 30
			}, {
				target: target,
				tileSize: TILE_SIZE
			});

			// then
			expect(result.x).to.be(60);
			expect(result.y).to.be(60);
		});
	});


	describe('#nextPostion() -- moves left', function () {
		it('should change decrease y coordinate by tile size', function () {
			const target = new getMoveableObject({
				x: 120,
				y: 30
			});

			// when
			target.changeDirection(); // go left
			const result = chaseObjectStrategy({
				x: 90,
				y: 90
			}, {
				target: target,
				tileSize: TILE_SIZE
			});

			// then
			expect(result.x).to.be(90);
			expect(result.y).to.be(60);
		});


		it('should change decrease y coordinate by tile size', function () {
			// given
			const target = new getMoveableObject({
				x: 120,
				y: 60
			});

			// when
			target.changeDirection(); // go left
			const result = chaseObjectStrategy({
				x: 120,
				y: 90
			},{
				target: target,
				tileSize: TILE_SIZE
			});

			// then
			expect(result.x).to.be(90);
			expect(result.y).to.be(60);
		});
	});

	describe('#randomMoveEngine', function() {
		it('should get random values', function() {
			// given
			const target = new getMoveableObject({
				x: 120,
				y: 60
			});

			// when
			const result = [];
			for(var i = 0; i < 20; i++) {
				result.push(randomMoveStrategy({
					x: 90,
					y: 60
				},{
					target: target,
					tileSize: TILE_SIZE,
					previousPosition: {
						x: 90,
						y: 60
					}
				}));
			}

			expect(R.any(R.propEq('x', 90), result)).to.be(true);
			expect(R.any(R.propEq('y', 60), result)).to.be(true);
		});
	});
});