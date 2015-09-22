/* globals describe, it */
import expect from 'expect.js';
import sinon from 'sinon';
import R from 'ramda';
import ChaseObjectEngined from '../../../lib/topDown/game/engine/ChaseObjectEngine';
import MoveOnTilesEngine from '../../../lib/topDown/game/engine/MoveOnTilesEngine';
import RandomMoveEngine from '../../../lib/topDown/game/engine/RandomMoveEngine';
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
		moveEngine: {
			type: MoveOnTilesEngine,
			options: {
				tileSize: TILE_SIZE
			}
		}
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
			const obj = new ChaseObjectEngined({
				tileSize: TILE_SIZE,
				target: target
			});
			target.changeDirection(); // go left
			target.changeDirection(); // go up
			target.changeDirection(); // right

			// when
			const result = obj.nextPosition({
				x: 90,
				y: 30
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
			const obj = new ChaseObjectEngined({
				tileSize: TILE_SIZE,
				target: target
			});

			// when
			const result = obj.nextPosition({
				x: 90,
				y: 30
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
			const obj = new ChaseObjectEngined({
				tileSize: TILE_SIZE,
				target: target
			});

			// when
			const result = obj.nextPosition({
				x: 90,
				y: 30
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
			const obj = new ChaseObjectEngined({
				tileSize: TILE_SIZE,
				target: target
			});

			// when
			const result = obj.nextPosition({
				x: 90,
				y: 30
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
			const obj = new ChaseObjectEngined({
				tileSize: TILE_SIZE,
				target: target
			});

			// when
			target.changeDirection(); // go left
			const result = obj.nextPosition({
				x: 90,
				y: 90
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
			const obj = new ChaseObjectEngined({
				tileSize: TILE_SIZE,
				target: target
			});

			// when
			target.changeDirection(); // go left
			const result = obj.nextPosition({
				x: 120,
				y: 90
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
			const obj = new RandomMoveEngine({
				tileSize: TILE_SIZE,
				target: target
			});

			// when
			const result = [];
			for(var i = 0; i < 20; i++) {
				result.push(obj.nextPosition({
					x: 90,
					y: 60
				}));
			}

			expect(R.any(R.propEq('x', 90), result)).to.be(true);
			expect(R.any(R.propEq('x', 120), result)).to.be(true);
		});
	});
});