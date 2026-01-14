import { validate_pending_exercise, is_invalid } from '$lib/entities.js';
import { Validation } from '$lib/validation.js';

/** @type {import('$lib/entities.js').Exercise[]} */
const exercises = [];

/**
 * @returns {ReadonlyArray<import('$lib/entities.js').Exercise>}
 */
export function list_exercises() {
	return exercises;
}

/**
 * @param {string} label
 * @returns {import('$lib/entities.js').Exercise | null}
 */
export function get_exercise(label) {
	return exercises.find((e) => e.label === label) ?? null;
}

/**
 * @param {import('$lib/entities.js').PendingExercise} input
 * @returns {import('$lib/validation.js').MaybeInvalid<import('$lib/entities.js').PendingExercise, import('$lib/entities.js').Exercise, 'exercise'>}
 */
export function create_exercise(input) {
	const result = validate_pending_exercise(input);
	if (is_invalid(result)) {
		return result;
	}

	// Check for duplicate label
	if (exercises.some((e) => e.label === result.label)) {
		const validation = /** @type {Validation<import('$lib/entities.js').Exercise>} */ (
			new Validation()
		);
		validation.add('An exercise with this label already exists', 'label');
		return { validation, exercise: input };
	}

	exercises.push(result);
	return result;
}

/**
 * @param {import('$lib/entities.js').PendingExercise} input
 * @returns {import('$lib/validation.js').MaybeInvalid<import('$lib/entities.js').PendingExercise, import('$lib/entities.js').Exercise, 'exercise'>}
 */
export function update_exercise(input) {
	const result = validate_pending_exercise(input);
	if (is_invalid(result)) {
		return result;
	}

	const index = exercises.findIndex((e) => e.exercise === result.exercise);
	if (index === -1) {
		const validation = /** @type {Validation<import('$lib/entities.js').Exercise>} */ (
			new Validation()
		);
		validation.add('Exercise not found', 'exercise');
		return { validation, exercise: input };
	}

	// Check for duplicate label (excluding current exercise)
	if (exercises.some((e) => e.label === result.label && e.exercise !== result.exercise)) {
		const validation = /** @type {Validation<import('$lib/entities.js').Exercise>} */ (
			new Validation()
		);
		validation.add('An exercise with this label already exists', 'label');
		return { validation, exercise: input };
	}

	exercises[index] = result;
	return result;
}

/**
 * @param {string} label
 * @returns {boolean}
 */
export function delete_exercise(label) {
	const index = exercises.findIndex((e) => e.label === label);
	if (index === -1) {
		return false;
	}
	exercises.splice(index, 1);
	return true;
}
