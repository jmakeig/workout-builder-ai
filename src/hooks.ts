import type { Transport } from '@sveltejs/kit';
import { Validation } from '$lib/validation';

export const transport: Transport = {
	Validation: {
		encode: (validation) => validation instanceof Validation && validation.issues(),
		decode: (validation) => Validation.fromJSON(validation)
	}
};
