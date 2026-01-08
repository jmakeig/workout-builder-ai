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

```
src/
├── lib/           # Shared components, utilities, stores ($lib alias)
│   ├── assets/    # Static assets imported in code
│   └── index.ts   # Public exports from $lib
├── routes/        # File-based routing
│   ├── +page.svelte      # Page components
│   ├── +layout.svelte    # Layout components
│   ├── +page.server.ts   # Server-side load functions
│   └── +server.ts        # API endpoints
└── app.html       # HTML template
static/            # Static files served at root
```

## Tech Stack

- **Framework**: SvelteKit 2
- **UI**: Svelte 5 (uses runes: `$state`, `$derived`, `$effect`, `$props`)
- **Language**: TypeScript
- **Build**: Vite 7
- **Adapter**: adapter-auto (auto-detects deployment platform)

## Svelte 5 Patterns

Use runes for reactivity:

```svelte
<script lang="ts">
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

- Use tabs not spaces for indenting
- Use TypeScript for all `.ts`, `.svelte`, and `.svelte.ts` files
- Place reusable components in `src/lib/components/`
- Place utility functions in `src/lib/utils/`
- Use `$lib` alias for imports from `src/lib/`
- Server-only code goes in `+page.server.ts` or `+server.ts` files
