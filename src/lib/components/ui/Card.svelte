<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className = undefined,
		header,
		title,
		description,
		content,
		footer,
		children,
		...rest
	}: {
		class?: string;
		header?: Snippet;
		title?: string;
		description?: string;
		content?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		[key: string]: any;
	} = $props();
</script>

<div class={cn("rounded-xl border border-stone-200 bg-white text-stone-950 shadow-sm", className)} {...rest}>
	{#if header || title || description}
		<div class="flex flex-col space-y-1.5 p-6">
			{#if header}
				{@render header()}
			{:else}
				{#if title}<h3 class="font-semibold leading-none tracking-tight">{title}</h3>{/if}
				{#if description}<p class="text-sm text-stone-500">{description}</p>{/if}
			{/if}
		</div>
	{/if}
	
	{#if content || children}
		<div class="p-6 pt-0">
			{#if content}
				{@render content()}
			{:else if children}
				{@render children()}
			{/if}
		</div>
	{/if}

	{#if footer}
		<div class="flex items-center p-6 pt-0">
			{@render footer()}
		</div>
	{/if}
</div>
