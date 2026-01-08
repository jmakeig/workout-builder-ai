/**
 * Base class for all entities with common properties.
 */
export abstract class Entity {
	readonly id: string = crypto.randomUUID();
	label = $state<string>('');
	name = $state<string>('');
	description = $state<string | null>(null);

	constructor(name: string, label?: string) {
		this.name = name;
		this.label = label ?? this.id;
	}

	abstract toJSON(): object;
}

/**
 * Helper interface for ordered collection management.
 */
export interface OrderedCollection<T> {
	[Symbol.iterator](): Iterator<T>;
	readonly length: number;
	at(index: number): T | undefined;
	add(item: T, to?: number): this;
	remove(from: number, count?: number): this;
	move(from: number, to: number, count?: number): this;
}

function create_ordered_collection<T>(items: T[]): OrderedCollection<T> {
	return {
		[Symbol.iterator]() {
			return items[Symbol.iterator]();
		},
		get length() {
			return items.length;
		},
		at(index: number) {
			return items.at(index);
		},
		add(item: T, to: number = items.length) {
			items.splice(to, 0, item);
			return this;
		},
		remove(from: number, count: number = 1) {
			items.splice(from, count);
			return this;
		},
		move(from: number, to: number, count: number = 1) {
			const moved = items.splice(from, count);
			items.splice(to, 0, ...moved);
			return this;
		}
	};
}

/**
 * Base class for activities (Exercise or Rest) with a duration.
 */
export abstract class Activity extends Entity {
	#duration = $state(0);
	instructions = $state<string | null>(null);

	get duration(): number {
		return this.#duration;
	}

	set duration(seconds: number | string) {
		if ('number' === typeof seconds) {
			this.#duration = seconds;
		} else if ('string' === typeof seconds) {
			const int = parseInt(seconds, 10);
			this.#duration = Number.isNaN(int) ? 0 : int;
		} else {
			throw new TypeError(typeof seconds);
		}
	}

	toJSON() {
		return {
			id: this.id,
			label: this.label,
			name: this.name,
			description: this.description,
			duration: this.duration,
			instructions: this.instructions
		};
	}
}

/**
 * An exercise activity with a name and description.
 */
export class Exercise extends Activity {
	constructor(name: string, label?: string) {
		super(name, label);
	}

	toJSON() {
		return {
			...super.toJSON(),
			type: 'exercise' as const
		};
	}
}

/**
 * A rest period between exercises.
 */
export class Rest extends Activity {
	override readonly name = 'Rest';
	override readonly description = 'Chill, brah!';

	constructor() {
		super('Rest');
	}

	toJSON() {
		return {
			...super.toJSON(),
			type: 'rest' as const
		};
	}
}

/**
 * A set contains one or more ordered activities.
 */
export class Set extends Entity {
	#activities = $state<Activity[]>([]);

	constructor(name: string, label?: string) {
		super(name, label);
	}

	get activities(): OrderedCollection<Activity> {
		return create_ordered_collection(this.#activities);
	}

	toJSON() {
		return {
			id: this.id,
			label: this.label,
			name: this.name,
			description: this.description,
			activities: this.#activities.map((activity) => activity.toJSON())
		};
	}
}

/**
 * A workout contains one or more ordered sets.
 */
export class Workout extends Entity {
	#sets = $state<Set[]>([]);

	constructor(name: string, label?: string) {
		super(name, label);
	}

	get sets(): OrderedCollection<Set> {
		return create_ordered_collection(this.#sets);
	}

	toJSON() {
		return {
			id: this.id,
			label: this.label,
			name: this.name,
			description: this.description,
			sets: this.#sets.map((set) => set.toJSON())
		};
	}
}
