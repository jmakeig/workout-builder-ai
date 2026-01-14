import { validate_pending_exercise, is_invalid } from '$lib/entities.js';
import { Validation } from '$lib/validation.js';

/**
 * Simulates database latency with normally distributed delay.
 * Uses Box-Muller transform to generate normal distribution.
 * @param {number} mean - Mean delay in ms
 * @param {number} std_dev - Standard deviation in ms
 * @returns {Promise<void>}
 */
function simulate_latency(mean = 12, std_dev = 8) {
	// Box-Muller transform for normal distribution
	const u1 = Math.random();
	const u2 = Math.random();
	const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
	const delay = Math.max(0, mean + z * std_dev);
	return new Promise((resolve) => setTimeout(resolve, delay));
}

/** @type {import('$lib/entities.js').Exercise[]} */
const exercises = [];

/**
 * @returns {Promise<ReadonlyArray<import('$lib/entities.js').Exercise>>}
 */
export async function list_exercises() {
	await simulate_latency();
	return exercises;
}

/**
 * @param {string} label
 * @returns {Promise<import('$lib/entities.js').Exercise | null>}
 */
export async function get_exercise(label) {
	await simulate_latency();
	return exercises.find((e) => e.label === label) ?? null;
}

/**
 * @param {import('$lib/entities.js').PendingExercise} input
 * @returns {Promise<import('$lib/validation.js').MaybeInvalid<import('$lib/entities.js').PendingExercise, import('$lib/entities.js').Exercise, 'exercise'>>}
 */
export async function create_exercise(input) {
	await simulate_latency();
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
 * @returns {Promise<import('$lib/validation.js').MaybeInvalid<import('$lib/entities.js').PendingExercise, import('$lib/entities.js').Exercise, 'exercise'>>}
 */
export async function update_exercise(input) {
	await simulate_latency();
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
 * @returns {Promise<boolean>}
 */
export async function delete_exercise(label) {
	await simulate_latency();
	const index = exercises.findIndex((e) => e.label === label);
	if (index === -1) {
		return false;
	}
	exercises.splice(index, 1);
	return true;
}
