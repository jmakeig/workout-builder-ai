<script>
	import { createAttachmentKey } from 'svelte/attachments';
	import { Validation } from '$lib/validation.js';

	/**
	 * Capitalizes each word
	 * @param {string} str
	 * @returns {string}
	 */
	function title_case(str) {
		if ('string' === typeof str) {
			return str
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
		}
		throw new TypeError(typeof str);
	}

	/** @type {{name: string, id?: string, label?: string, validation?: Validation<unknown>; value?: unknown, help?: string; input?: import('svelte').Snippet<[Record<string, any>]>} & Record<string, any>} */
	let {
		name,
		// svelte-ignore state_referenced_locally
		id = name,
		// svelte-ignore state_referenced_locally
		label = title_case(name),
		validation = new Validation(),
		value = $bindable(),
		help,
		input,
		...other
	} = $props();

	/** @type {Record<string, any>} */
	export const attrs = {
		placeholder: '\u200B',
		autocomplete: 'off',
		autocapitalize: 'off',
		spellcheck: 'false'
	};

	/**
	 * Implements standard HTML custom validity properties.
	 * @param {Validation<unknown>} validation
	 * @returns {import('svelte/attachments').Attachment<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>}
	 */
	function validate(validation) {
		return function _validate(element) {
			$effect(() => {
				const { name } = element;
				const message = validation?.first(name)?.message ?? '';
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
				'aria-invalid': validation?.has(name),
				'aria-errormessage': validation?.has(name) ? `${name}-error` : undefined,
				'aria-describedby': `${name}-help`,
				...other
			})}
		{:else}
			<input
				type="text"
				{id}
				{name}
				bind:value
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
