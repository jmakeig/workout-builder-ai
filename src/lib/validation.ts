// https://stackblitz.com/edit/sveltejs-kit-template-default-b5zbxomg?file=src%2Flib%2FUser.svelte.js

/**
 * A validation message. Typical usage is for communicating business rule violations
 * back to users. `for` can optionally reference a property in the entity being validated by name,
 * e.g. `'id'` or `'workloads[3]'`.
 */
export type Issue<Entity = unknown> = {
	readonly message: string; // | AtLeastOne<{ [K in Locale]: string }>;
	// for?: Forable<Entity>;
	readonly path?: Path;
};

export type Path = ReadonlyArray<PropertyKey>;

/**
 * A way to communicate a business rule violation in an API call.
 */
export type Invalid<In, Out, Prop extends string = 'input'> = {
	//validations: Array<Validation<Out>>;
	validation: Validation<Out>;
} & {
	[property in Prop]: In;
};

/**
 * A response to an API call. A response can either be the plain output entity, `Out`,
 * or a validation error wrapper around the input, `In`, plus a collection of `Validation`
 * instances. `Prop` allows you to
 * name the property on the `InvalidResult` instance to access the input entity,
 * e.g. `result.customer` versus the default, `result.input`.
 *
 * This means that APIs should *not* throw `Error`s for business rule violations.
 * Validation is an expected part of the API contract and thus is modeled in the
 * responses from API calls. Thrown errors should represent exceptional circumstances.
 */
export type MaybeInvalid<In, Out, Prop extends string = 'input'> = Out | Invalid<In, Out, Prop>;

export class Validation<Out = unknown> {
	#issues: Issue[] = [];

	add(message: Issue['message'], property?: PropertyKey | Path): Validation<Out> {
		this.#issues.push({
			message,
			path: property ? [...(Array.isArray(property) ? property : [property])] : []
		});
		return this;
	}

	merge(validation: Validation<unknown>, base_path: Path = []): Validation<Out> {
		for (const issue of validation) {
			this.#issues.push({
				message: issue.message,
				path: [...base_path, ...(issue.path ?? [])]
			});
		}
		return this;
	}

	issues(path?: Path | string): ReadonlyArray<Issue> {
		if (undefined === path) return this.#issues;
		const _path = 'string' === typeof path ? ('' === path ? [] : [path]) : path;
		return this.#issues.filter((issue) => {
			if (_path.length !== issue.path?.length) return false;
			for (let i = 0; i < _path.length; i++) {
				if (_path[i] !== issue.path?.[i]) return false;
			}
			return true;
		});
	}

	at(index: number): Issue | undefined {
		return this.#issues.at(index);
	}

	first(path?: Path | string): Issue | undefined {
		return this.issues(path)[0];
	}

	has(path?: Path | string): boolean {
		return this.issues(path).length > 0;
	}

	/**
	 * Equivalent to calling `validate` on each of the items in the `collection` and
	 * then `merge` on any invalid results. Returns the original `collection` if _any_
	 * of the items is invalid or a collection of the validated items if _all_ of them
	 * are valid.
	 *
	 * TODO: Support other collection types besides `Array`.
	 */
	collect<In, ItemOut, Prop extends string = 'input'>(
		collection: Array<In>,
		validate: (item: In) => MaybeInvalid<In, ItemOut, Prop>,
		base_path: Path = []
	): Array<In | ItemOut> {
		let dirty = false;
		const output = collection.map((item, index) => {
			const result = validate(item);
			if (is_invalid(result)) {
				dirty = true;
				this.merge(result.validation, [...base_path, index]);
				return item;
			}
			return result;
		});
		if (dirty) return collection;
		return output;
	}

	toJSON(): object {
		return this.#issues;
	}

	static fromJSON(json: Validation<unknown>): Validation<unknown> {
		return new Validation().merge(json);
	}

	is_valid(): boolean {
		return !this.has();
	}

	[Symbol.iterator](): Iterator<Issue> {
		return this.#issues[Symbol.iterator]();
	}

	get length(): number {
		return this.#issues.length;
	}

	toString(): string {
		return this.#issues
			.map((issue) => `${issue.message} (${issue.path ? issue.path.join(' > ') : ''})`)
			.join('\n');
	}
}

/**
 * Checks whether a `MaybeInvalid` result is actually `Invalid`.
 */
export function is_invalid<In, Out, Prop extends string = 'input'>(
	result: MaybeInvalid<In, Out, Prop>
): result is Invalid<In, Out, Prop> {
	return (
		'object' === typeof result &&
		null !== result &&
		'validation' in result &&
		result.validation instanceof Validation
	);
}
