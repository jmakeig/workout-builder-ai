import { Exercise } from './entities.svelte';
import { Validation, type MaybeInvalid } from './validation';

// In-memory storage (will be replaced with database later)
const exercises: Map<string, Exercise> = new Map();

// Initialize with dummy data
function init_dummy_data() {
	const jumping_jacks = new Exercise('Jumping Jacks', 'jumping-jacks');
	jumping_jacks.duration = 60;
	jumping_jacks.description = 'Full body warm-up exercise';

	const high_knees = new Exercise('High Knees', 'high-knees');
	high_knees.duration = 45;
	high_knees.description = 'Cardio exercise targeting legs and core';

	const burpees = new Exercise('Burpees', 'burpees');
	burpees.duration = 30;
	burpees.description = 'Full body explosive exercise';

	const mountain_climbers = new Exercise('Mountain Climbers', 'mountain-climbers');
	mountain_climbers.duration = 45;
	mountain_climbers.description = 'Core and cardio exercise';

	const squat_jumps = new Exercise('Squat Jumps', 'squat-jumps');
	squat_jumps.duration = 30;
	squat_jumps.description = 'Lower body explosive exercise';

	for (const exercise of [jumping_jacks, high_knees, burpees, mountain_climbers, squat_jumps]) {
		exercises.set(exercise.label, exercise);
	}
}

init_dummy_data();

export type ExerciseCreateInput = {
	name: string;
	label?: string;
	description?: string | null;
	duration?: number;
	instructions?: string | null;
};

export type ExerciseUpdateInput = {
	name?: string;
	description?: string | null;
	duration?: number;
	instructions?: string | null;
};

export const exercise_api = {
	list(): Exercise[] {
		return Array.from(exercises.values());
	},

	get(label: string): Exercise | undefined {
		return exercises.get(label);
	},

	create(input: ExerciseCreateInput): MaybeInvalid<ExerciseCreateInput, Exercise> {
		const validation = new Validation<Exercise>();

		if (!input.name || input.name.trim() === '') {
			validation.add('Name is required', 'name');
		}

		if (input.label && exercises.has(input.label)) {
			validation.add('An exercise with this label already exists', 'label');
		}

		if (input.duration !== undefined && input.duration < 0) {
			validation.add('Duration must be non-negative', 'duration');
		}

		if (!validation.is_valid()) {
			return { input, validation };
		}

		const exercise = new Exercise(input.name.trim(), input.label);
		if (input.description !== undefined) exercise.description = input.description;
		if (input.duration !== undefined) exercise.duration = input.duration;
		if (input.instructions !== undefined) exercise.instructions = input.instructions;

		exercises.set(exercise.label, exercise);
		return exercise;
	},

	update(label: string, input: ExerciseUpdateInput): MaybeInvalid<ExerciseUpdateInput, Exercise> {
		const validation = new Validation<Exercise>();

		const exercise = exercises.get(label);
		if (!exercise) {
			validation.add('Exercise not found');
			return { input, validation };
		}

		if (input.name !== undefined && input.name.trim() === '') {
			validation.add('Name cannot be empty', 'name');
		}

		if (input.duration !== undefined && input.duration < 0) {
			validation.add('Duration must be non-negative', 'duration');
		}

		if (!validation.is_valid()) {
			return { input, validation };
		}

		if (input.name !== undefined) exercise.name = input.name.trim();
		if (input.description !== undefined) exercise.description = input.description;
		if (input.duration !== undefined) exercise.duration = input.duration;
		if (input.instructions !== undefined) exercise.instructions = input.instructions;

		return exercise;
	},

	delete(label: string): MaybeInvalid<string, boolean> {
		const validation = new Validation<boolean>();

		if (!exercises.has(label)) {
			validation.add('Exercise not found');
			return { input: label, validation };
		}

		exercises.delete(label);
		return true;
	}
};
