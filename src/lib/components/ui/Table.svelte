<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		class: className = undefined,
		headers = [],
		rows = [],
		rowSnippet,
		...rest
	}: {
		class?: string;
		headers?: string[];
		rows?: any[];
		rowSnippet?: Snippet<[any]>;
		[key: string]: any;
	} = $props();
</script>

<div class="relative w-full overflow-auto">
	<table class={cn("w-full caption-bottom text-sm", className)} {...rest}>
		<thead class="[&_tr]:border-b">
			<tr class="border-b border-stone-200 transition-colors hover:bg-stone-100/50 data-[state=selected]:bg-stone-100">
				{#each headers as header}
					<th class="h-12 px-4 text-left align-middle font-medium text-stone-500 [&:has([role=checkbox])]:pr-0">
						{header}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="[&_tr:last-child]:border-0">
			{#each rows as row, i (row.id ?? i)}
				<tr class="border-b border-stone-200 transition-colors hover:bg-stone-100/50 data-[state=selected]:bg-stone-100">
					{#if rowSnippet}
						{@render rowSnippet(row)}
					{:else}
						{#each Object.values(row) as cell}
							<td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">
								{cell}
							</td>
						{/each}
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
