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
 * @param {import('$lib/entities.js').PendingExercise} pending
 * @returns {Promise<import('$lib/validation.js').MaybeInvalid<import('$lib/entities.js').PendingExercise, import('$lib/entities.js').Exercise, 'exercise'>>}
 */
export async function create_exercise(pending) {
	await simulate_latency(25, 30);

	// Validate first
	const result = validate_pending_exercise(pending);
	if (is_invalid(result)) {
		return result;
	}

	// Assign ID after validation passes
	const exercise = /** @type {import('$lib/entities.js').Exercise} */ ({
		...result,
		exercise: /** @type {import('$lib/entities.js').ID} */ (crypto.randomUUID())
	});

	// Check for duplicate label
	if (exercises.some((e) => e.label === exercise.label)) {
		const validation = /** @type {Validation<import('$lib/entities.js').Exercise>} */ (
			new Validation()
		);
		validation.add('An exercise with this label already exists', 'label');
		return { validation, exercise: pending };
	}

	exercises.push(exercise);
	return exercise;
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
	const deleted_id = exercises[index].exercise;
	exercises.splice(index, 1);

	// Remove from all other exercises' alternatives
	for (const exercise of exercises) {
		if (exercise.alternatives.includes(deleted_id)) {
			// @ts-ignore - reassigning readonly array to remove deleted reference
			exercise.alternatives = exercise.alternatives.filter((id) => id !== deleted_id);
		}
	}

	return true;
}

/**
 * @param {ReadonlyArray<string>} ids
 * @returns {Promise<ReadonlyArray<import('$lib/entities.js').Exercise>>}
 */
export async function get_exercises_by_ids(ids) {
	await simulate_latency();
	return exercises.filter((e) => ids.includes(e.exercise));
}
