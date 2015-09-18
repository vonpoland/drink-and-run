const privateData = new WeakMap();

export default class GameObject {
	constructor(options) {
		privateData.set(this, {});
		privateData.get(this).sprite = options.sprite;
	}

	get sprite() {
		return privateData.get(this).sprite;
	}
}
