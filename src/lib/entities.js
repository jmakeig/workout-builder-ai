import { Validation, is_invalid } from './validation.js';

/**
 * Converts a name to a URL-friendly slug.
 * @param {string} name
 * @returns {string}
 */
export function slug(name) {
	const max_length = 80;
	let len = 0,
		index = 0,
		result = '';
	// https://stackoverflow.com/a/66721429
	const tokens = name.split(/[^\p{L}\p{N}]+/gu);
	while (len < max_length && index < tokens.length) {
		len += tokens[index].length;
		if (tokens[index].length > 0) {
			result += (index > 0 ? '-' : '') + tokens[index++].toLowerCase();
		} else {
			index++;
		}
	}
	return result;
}

/**
 * @typedef {string & { readonly __brand: unique symbol }} ID
 */

/**
 * @typedef {{
 *   readonly exercise: ID;
 *   label: string;
 *   name: string;
 *   description: string;
 * }} Exercise
 */

/**
 * @typedef {{
 *   exercise?: string;
 *   label?: string | null;
 *   name?: string | null;
 *   description?: string | null;
 * }} PendingExercise
 */

/**
 * Validates a pending exercise and returns either a valid Exercise or an Invalid result.
 * @param {PendingExercise} input
 * @returns {import('./validation.js').MaybeInvalid<PendingExercise, Exercise, 'exercise'>}
 */
export function validate_pending_exercise(input) {
	const validation = /** @type {Validation<Exercise>} */ (new Validation());

	const name = input.name?.trim() ?? '';
	// Count non-whitespace, non-dash characters
	const name_char_count = name.replace(/[\s-]/g, '').length;
	if (!name) {
		validation.add('Name is required', 'name');
	} else if (name_char_count < 3) {
		validation.add('Name must have at least 3 characters', 'name');
	}

	// Default label to slug of name if empty
	const label = input.label?.trim() || slug(name);
	if (label && !/^[a-z0-9-]+$/.test(label)) {
		validation.add('Label must be lowercase letters, numbers, and hyphens only', 'label');
	}

	const description = input.description?.trim() ?? '';

	if (!validation.is_valid()) {
		return { validation, exercise: input };
	}

	return /** @type {Exercise} */ ({
		exercise: input.exercise ?? /** @type {ID} */ (crypto.randomUUID()),
		label,
		name,
		description
	});
}

export { is_invalid };
