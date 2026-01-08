import { exercise_api } from '$lib/api';

export function load() {
	const exercises = exercise_api.list();
	return {
		exercises: exercises.map((e) => e.toJSON())
	};
}
