<script>
	// https://svelte.dev/docs/svelte/svelte-attachments#createAttachmentKey
	import { createAttachmentKey } from 'svelte/attachments';
	import { Validation } from '$lib/validation.js';

	/**
	 * Capitalizes each word
	 * @param {string} str
	 * @returns {string}
	 */
	function title_case(str) {
		// if (null === str || undefined === str) return str;
		if ('string' === typeof str) {
			return str
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		}
		throw new TypeError(typeof str);
	}

	/** @type {{name: string, id?: string, label?: string, validation?: Validation<unknown>; value?: unknown, help?: string; input?: import('svelte').Snippet<[Record<string, any>]>}}*/
	let {
		name,
		// svelte-ignore state_referenced_locally
		id = name,
		// svelte-ignore state_referenced_locally
		label = title_case(name),
		validation = new Validation(),
		value,
		help,
		input,
		...other
	} = $props();

	/** @type {Record<string, any>} */
	export const attrs = {
		placeholder: '\u200B', // Prevents weird Safari renering bug with baseline alignment in flexbox
		autocomplete: 'off',
		autocapitalize: 'off',
		spellcheck: 'false'
	};

	// https://svelte.dev/docs/svelte/@attach
	/**
	 *
	 * @param {Validation<unknown>} validation
	 * @returns {import('svelte/attachments').Attachment<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
	 */
	function validate(validation) {
		// Returns the attachement function closed over the validation
		return function _validate(element) {
			// console.log('@attach', element.tagName);
			$effect(() => {
				const { name } = element;
				const message = validation?.first(name)?.message ?? '';
				// console.log('$effect', name);
				element.setCustomValidity(message);
			});
			return () => {
				element.setCustomValidity('');
			};
		};
	}
</script>

<div class="control">
	<label for={name}>{label}{label ? ':' : ''}</label>
	<div class="contents">
		{#if input}
			{@render input({
				name,
				id,
				value,
				[createAttachmentKey()]: validate(validation),
				placeholder: attrs.placeholder,
				...other
			})}
		{:else}
			<input
				type="text"
				{id}
				{name}
				{value}
				{@attach validate(validation)}
				aria-invalid={validation?.has(name)}
				aria-errormessage={validation?.has(name) ? `${name}-error` : undefined}
				aria-describedby="{name}-help"
				{...attrs}
				{...other}
			/>
		{/if}
		{#if help}<p class="helper" id={`${name}-help`}>{help}</p>{/if}
		{#if validation?.has(name)}
			<p class="validation" id={`${name}-error`} aria-live="assertive">
				{validation.first(name)?.message}
			</p>
		{/if}
	</div>
</div>

<style>
	/*
<!-- Template: -->
<div class="control">
	<label for="name">Name</label>
	<div class="contents">
		<input type="text" name="name" value={form?.exercise.name} placeholder={'\u200B'} />
		<p class="helper">The name of the exercise</p>
		{#if form?.validation?.has('name')}
			<p class="validation" id="name-error" aria-live="assertive">
				{form?.validation.first('name')?.message}
			</p>
		{/if}
	</div>
</div>
*/
	.control {
		display: flex;
		gap: 1em 2em;
		/* https://www2.webkit.org/show_bug.cgi?id=142968 */
		align-items: baseline;
		margin: 1.5em 0;
	}
	.control .validation,
	.control .helper {
		margin: 0.5rem 0;
		font-size: 0.9em;
		color: var(--color-secondary);
	}
	.validation,
	.control .validation {
		color: var(--color-error);
		font-weight: bolder;
	}
	.control:last-of-type {
		margin-bottom: 0;
	}
	.control label {
		flex-grow: 0;
		flex-shrink: 0;
		flex-basis: 8em;
		text-align: right;
	}
	.control label + * {
		min-width: 10em;
		flex-grow: 1;
	}
	.control .contents > :first-child {
		display: block;
		width: 100%;
	}
</style>
