/**
 * @template Out
 */
export class Validation {
	/** @type {Issue[]} */
	#issues = [];

	/**
	 * @param {Issue['message']} message
	 * @param {PropertyKey | Path} [property]
	 * @returns {Validation<Out>}
	 */
	add(message, property) {
		this.#issues.push({
			message,
			path: property ? [...(Array.isArray(property) ? property : [property])] : []
		});
		return this;
	}

	/**
	 * @param {Validation<unknown>} validation
	 * @param {Path} [base_path]
	 * @returns {Validation<Out>}
	 */
	merge(validation, base_path = []) {
		for (const issue of validation) {
			this.#issues.push({
				message: issue.message,
				path: [...base_path, ...(issue.path ?? [])]
			});
		}
		return this;
	}

	/**
	 * @param {Path | string} [path]
	 * @returns {ReadonlyArray<Issue>}
	 */
	issues(path) {
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

	/**
	 * @param {number} index
	 * @returns {Issue | undefined}
	 */
	at(index) {
		return this.#issues.at(index);
	}

	/**
	 * @param {Path | string} [path]
	 * @returns {Issue | undefined}
	 */
	first(path) {
		return this.issues(path)[0];
	}

	/**
	 * @param {Path | string} [path]
	 * @returns {boolean}
	 */
	has(path) {
		return this.issues(path).length > 0;
	}

	/**
	 * @template In, Out
	 * @param {Array<In>} collection
	 * @param {(item: In) => MaybeInvalid<In, Out>} validate
	 * @param {Path} [base_path]
	 * @returns {Array<In | Out>}
	 */
	collect(collection, validate, base_path = []) {
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

	/**
	 * @returns {object}
	 */
	toJSON() {
		return this.#issues;
	}

	/**
	 * @param {any} json
	 * @returns {Validation<unknown>}
	 */
	static fromJSON(json) {
		return new Validation().merge(json);
	}

	is_valid() {
		return !this.has();
	}

	[Symbol.iterator]() {
		return this.#issues[Symbol.iterator]();
	}

	get length() {
		return this.#issues.length;
	}

	toString() {
		return this.#issues
			.map((issue) => `${issue.message} (${issue.path ? issue.path.join(' > ') : ''})`)
			.join('\n');
	}
}

/**
 * Checks whether a `MaybeInvalid` result is actually `Invalid`.
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @param {MaybeInvalid<In, Out, Prop>} result
 * @returns {result is Invalid<In, Out, Prop>}
 */
export function is_invalid(result) {
	return (
		'object' === typeof result &&
		null !== result &&
		'validation' in result &&
		result.validation instanceof Validation
	);
}

/**
 * @typedef {ReadonlyArray<PropertyKey>} Path
 */

/**
 * @typedef {{
 *   readonly message: string;
 *   readonly path?: Path;
 * }} Issue
 */

/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {{
 *   readonly validation: Validation<Out>;
 * } & {
 *   readonly [property in Prop]: In;
 * }} Invalid
 */

/**
 * @template In, Out
 * @template {string} [Prop = "input"]
 * @typedef {Out | Invalid<In, Out, Prop>} MaybeInvalid
 */
