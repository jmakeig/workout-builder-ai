export class Activity {
	#duration = $state(0);
	instructions = $state(null);
	constructor() {}
	get duration() {
		return this.#duration;
	}
	set duration(seconds) {
		if ('number' === typeof seconds) this.#duration = seconds;
		else if ('string' === typeof seconds) {
			const int = parseInt(seconds, 10);
			if (Number.isNaN(int)) this.#duration = 0;
			else this.#duration = int;
		} else throw new TypeError(typeof seconds);
	}
	toJSON() {
		return {
			duration: this.duration,
			instructions: this.instructions
		};
	}
}

export class Exercise extends Activity {
	name = $state(null);
	description = $state(null);
	constructor(name) {
		super();
		if ('string' !== typeof name) throw new TypeError();
		this.name = name;
	}
	toJSON() {
		return {
			...super.toJSON(),
			name: this.name,
			description: this.description
		};
	}
}

export class Rest extends Activity {
	get name() {
		return 'Rest';
	}
	get description() {
		return 'Chill, brah!';
	}
	toJSON() {
		return {
			...super.toJSON(),
			name: this.name,
			description: this.description
		};
	}
}

export class Set {
	name = $state(null);
	#activities = $state([]);
	constructor(name) {
		if ('string' !== typeof name) throw new TypeError();
		this.name = name;
	}
	get activities() {
		const that = this;
		return {
			[Symbol.iterator]() {
				return that.#activities[Symbol.iterator]();
			},
			get length() {
				return that.#activities.length;
			},
			add(activity, to = that.#activities.length) {
				that.#activities.splice(to, 0, activity);
				return this;
			},
			remove(from, count = 1) {
				that.#activities.splice(from, count);
				return this;
			},
			move(from, to, count = 1) {
				const items = that.#activities.splice(from, count);
				that.#activities.splice(to, 0, ...items);
				return this;
			}
		};
	}
	toJSON() {
		return {
			name: this.name,
			activities: this.#activities.map((activity) => activity.toJSON())
		};
	}
}

export class Workout {
	name = $state(null);
	description = $state(null);
	#sets = $state([]);
	constructor(name, description = null) {
		if ('string' !== typeof name) throw new TypeError();
		this.name = name;
		this.description = description;
	}
	get sets() {
		const that = this;
		return {
			[Symbol.iterator]() {
				return that.#sets[Symbol.iterator]();
			},
			get length() {
				return that.#sets.length;
			},
			// TODO: Extract this out
			add(set, to = that.#sets.length) {
				if ('string' === typeof set) set = new Set(set);
				that.#sets.splice(to, 0, set);
				return this;
			},
			remove(from, count = 1) {
				that.#sets.splice(from, count);
				return this;
			},
			move(from, to, count = 1) {
				const items = that.#sets.splice(from, count);
				that.#sets.splice(to, 0, ...items);
				return this;
			}
		};
	}
	toJSON() {
		return {
			name: this.name,
			description: this.description,
			sets: this.#sets.map((set) => set.toJSON())
		};
	}
}
