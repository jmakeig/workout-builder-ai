import { Validation, is_invalid } from './validation.js';

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
	if (!name) {
		validation.add('Name is required', 'name');
	}

	const label = input.label?.trim() ?? '';
	if (!label) {
		validation.add('Label is required', 'label');
	} else if (!/^[a-z0-9-]+$/.test(label)) {
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
