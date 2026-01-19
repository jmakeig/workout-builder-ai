# CLAUDE.md

This file provides guidance for Claude when working on this project.

## Project Overview

Workout Builder AI - A SvelteKit application built with Svelte 5 and TypeScript.

## Commands

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run svelte-check for type checking
- `npm run check:watch` - Run svelte-check in watch mode
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

## Tech Stack

- **Framework**: SvelteKit 2
- **UI**: Svelte 5 (uses runes: `$state`, `$derived`, `$effect`, `$props`)
- **Language**: JavaScript with strong TypeScript types annotated in JSDoc commments
- **Build**: Vite 7
- **Adapter**: adapter-auto (auto-detects deployment platform)

## Svelte 5 Patterns

Use runes for reactivity:

```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2);

	// Props
	let { title, onClose }: { title: string; onClose: () => void } = $props();

	// Side effects
	$effect(() => {
		console.log('count changed:', count);
	});
</script>
```

## Conventions

- Use `snake_case` for function and variable names, except standard JS interfaces like `toJSON`, `toString`, `fromJSON`
- Use tabs, not spaces for indenting, as captured in `.prettierrc`
- Place reusable Svelte components in `src/lib/components/`
- Use `$lib` alias for imports from `src/lib/`
- Server-only code goes in `+page.server.js` or `+server.js` files

### Styling

- Always us vanilla CSS, not a framework
- Prefer global styles imported in to `app.html` over componenent styles
- Component styles are good for specific layouts, but fonts and colors should generally be inherited or reference via variables

Basic global reset:

```css
*,
*::before,
*::after {
	box-sizing: border-box;
}
html {
	padding: 0;
	margin: 0;
	color: var(--color);
}

body {
	margin: 0 5em; /* TODO: Responsive */
	padding: 1em;
	font-family: system-ui;
	font-size: 11pt;
	line-height: 1.2;
	vertical-align: baseline;
}
h1,
h2,
h3,
h4,
h5,
h6,
p,
li {
	margin: 0 0 0.5rem 0;
}
a {
	color: var(--color-link);
	text-decoration: none;
}
a:hover {
	text-decoration: underline;
}
a:visited {
	color: var(--color-link-visited);
}
table {
	width: 100%;
	border-collapse: collapse;
}
th,
td {
	padding: 0.5em;
	border: solid 0.5px var(--color-border);
	border-style: solid none;
	text-align: left;
}
thead th {
	border: none;
}
thead tr:last-child th {
	border-bottom: solid 1px var(--color-border-highlight);
}
.numeric {
	text-align: right;
	font-variant-numeric: tabular-nums;
}
```

And base form styling:

```css
@import url('./colors.css');

/* Form */
input,
select,
textarea,
button {
	font-family: inherit;
	font-size: inherit;
	line-height: inherit;
	font-weight: inherit;
	vertical-align: baseline;
}
input[type='text'],
input:not([type]),
input[type='search'],
input[type='password'],
textarea,
select,
button,
fieldset {
	padding: 0.25em;
	border: solid 0.5px var(--color-border);
	border-radius: 0.375rem;
}
input[type='text']:disabled,
input:not([type]):disabled,
input[type='search']:disabled,
input[type='password']:disabled,
textarea:disabled,
select:disabled,
button:disabled,
fieldset:disabled {
	background: var(--color-input-disabled);
}
input[type='text']:read-only,
input:not([type]):read-only,
input[type='search']:read-only,
input[type='password']:read-only,
textarea:read-only,
select:read-only,
button:read-only,
fieldset:read-only {
	background: var(--color-input-disabled);
}
/*
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
form div.control {
	display: flex;
	gap: 1em 2em;
	/* https://www2.webkit.org/show_bug.cgi?id=142968 */
	align-items: baseline;
	margin: 1.5em 0;
}
form .control .validation,
form .control .helper {
	margin: 0.5rem 0;
	font-size: 0.9em;
	color: var(--color-secondary);
}
.validation,
form .control .validation {
	color: var(--color-error);
	font-weight: bolder;
}
form .control input:invalid,
form .control textarea:invalid {
	background-color: var(--color-error-secondary);
}

form > .control:last-of-type {
	margin-bottom: 0;
}
form .control label {
	flex-grow: 0;
	flex-shrink: 0;
	flex-basis: 8em;
	text-align: right;
}
form div.control.actions {
	flex-direction: row-reverse;
	gap: 0.5em;
}
/*
form .control label + div.contents,
form .control label + input,
form .control label + textarea,
form .control label + select
*/
form .control label + * {
	min-width: 10em;
	flex-grow: 1;
}
/* url(https://svelte.dev/playground/5104e06a396e46828ca5bf308ca35a9b?version%3D5.9.0) */
form .control .contents textarea,
form .control .contents input[type='text'],
form .control .contents input:not([type]),
form .control .contents input[type='search'],
form .control .contents input[type='password'],
form .control .contents select {
	/* Fixes align-items: baseline */
	display: block;
	width: 100%;
}
button {
	appearance: auto;
	padding: 0.5em 1em;
	border-radius: 0.5em;
	background: var(--color-action);
}
button:hover {
	background-color: var(--color-action-highlight);
	cursor: pointer;
}
button:active {
	background-color: var(--color-action-active);
}
button.default {
	background-color: var(--color-action-default);
	border-color: var(--color-action-default);
	color: white;
	font-weight: 500;
}
button.default:hover {
	background-color: var(--color-action-default-highlight);
}
button.default:active {
	background-color: var(--color-action-defualt-active);
}
```

Base colors:

```css
:root {
	--color: #111827;
	--color-secondary: #6b7280;
	--color-link: #1d4ed8;
	--color-link-visited: #5b21b6;
	--color-error: #ef4444;
	--color-success: #16a34a;
	--color-error-secondary: #fecaca;
	--color-background: #f9fafb;
	--color-border: #d1d5db;
	--color-border-highlight: #6b7280;
	--color-action: none;
	--color-action-highlight: #f3f4f6;
	--color-action-active: #d1d5db;
	--color-action-default: #2563eb;
	--color-action-default-highlight: #1d4ed8;
	--color-action-defualt-active: #1e40af;
	--color-input-disabled: #f3f4f6;
}
```
