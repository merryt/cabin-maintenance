<script lang="ts">
	import Table from "$lib/components/ui/Table.svelte";
	import Button from "$lib/components/ui/button.svelte";
	import Input from "$lib/components/ui/input.svelte";
	import { Plus, Minus, PackageSearch, Check, MoreVertical, Trash2, Pencil, X } from "lucide-svelte";
	import { enhance } from "$app/forms";

	let { data } = $props();

	let whatWeNeed = $derived(
		data.inventory.filter((item) => item.quantity <= 0),
	);
	let whatWeHave = $derived(
		data.inventory.filter((item) => item.quantity > 0),
	);
	const locations = [
		{ value: 'kitchen', label: 'Kitchen' },
		{ value: 'hall closet', label: 'Hall Closet' },
		{ value: 'mudroom', label: 'Mudroom' },
		{ value: 'shed', label: 'Shed' },
		{ value: 'crawl space', label: 'Crawl Space' }
	];

	function formatLocation(val: string) {
		const found = locations.find(loc => loc.value === val);
		return found ? found.label : (val || '-');
	}

	let activeMenuId = $state<string | null>(null);
	let editingItemId = $state<string | null>(null);
	let editingFieldName = $state<'item_name' | 'notes' | 'location' | null>(null);
	let editingValue = $state('');

	function toggleMenu(id: string) {
		if (activeMenuId === id) {
			activeMenuId = null;
		} else {
			activeMenuId = id;
		}
	}

	function startEdit(item: any, field: 'item_name' | 'notes' | 'location') {
		editingItemId = item.id;
		editingFieldName = field;
		editingValue = item[field] || '';
		activeMenuId = null;
	}

	function cancelEditingItem() {
		editingItemId = null;
		editingFieldName = null;
		editingValue = '';
	}
</script>

{#snippet itemDropdown(item, showLocationOption)}
	{@const isLastNeed = whatWeNeed.length > 0 && whatWeNeed[whatWeNeed.length - 1].id === item.id}
	{@const isLastHave = whatWeHave.length > 0 && whatWeHave[whatWeHave.length - 1].id === item.id}
	{@const isLast = isLastNeed || isLastHave}
	<div class="relative inline-block text-left">
		<button 
			type="button" 
			class="p-1 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
			onclick={() => toggleMenu(item.id)}
		>
			<MoreVertical class="w-4 h-4" />
		</button>
		
		{#if activeMenuId === item.id}
			<!-- Backdrop to close the menu on click outside -->
			<button class="fixed inset-0 h-full w-full cursor-default z-10" onclick={() => activeMenuId = null}></button>
			<div class="absolute right-0 w-36 rounded-lg shadow-lg bg-white border border-stone-200 divide-y divide-stone-100 focus:outline-none z-20 overflow-hidden {isLast ? 'bottom-full mb-1' : 'top-full mt-1'}">
				<div class="py-1">
					<button 
						type="button" 
						onclick={() => startEdit(item, 'item_name')} 
						class="group flex items-center px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 w-full text-left"
					>
						<Pencil class="mr-2 h-3.5 w-3.5 text-stone-400 group-hover:text-stone-500" />
						Rename
					</button>
					<button 
						type="button" 
						onclick={() => startEdit(item, 'notes')} 
						class="group flex items-center px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 w-full text-left"
					>
						<Pencil class="mr-2 h-3.5 w-3.5 text-stone-400 group-hover:text-stone-500" />
						Edit Notes
					</button>
					{#if showLocationOption}
						<button 
							type="button" 
							onclick={() => startEdit(item, 'location')} 
							class="group flex items-center px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-900 w-full text-left"
						>
							<Pencil class="mr-2 h-3.5 w-3.5 text-stone-400 group-hover:text-stone-500" />
							Edit Location
						</button>
					{/if}
				</div>
				<div class="py-1">
					<form method="POST" action="?/deleteItem" use:enhance class="w-full">
						<input type="hidden" name="id" value={item.id} />
						<button 
							type="submit" 
							class="group flex items-center px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-900 w-full text-left"
							onclick={(e) => !confirm('Are you sure you want to delete this item?') && e.preventDefault()}
						>
							<Trash2 class="mr-2 h-3.5 w-3.5 text-red-400 group-hover:text-red-500" />
							Delete
						</button>
					</form>
				</div>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet inventoryRowHave(item)}
	{#if editingItemId === item.id && editingFieldName === 'item_name'}
		<td class="p-4 align-middle font-medium min-w-[180px]">
			<form method="POST" action="?/updateField" use:enhance={() => {
				cancelEditingItem();
				return async ({ update }) => { await update({ reset: false }); };
			}} class="flex items-center gap-2 max-w-sm">
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="field" value="item_name" />
				<Input name="value" bind:value={editingValue} class="h-8 text-sm" autofocus />
				<Button type="submit" size="icon" variant="ghost" class="h-8 w-8 text-forest-600">
					<Check class="w-4 h-4" />
				</Button>
				<Button type="button" size="icon" variant="ghost" class="h-8 w-8 text-stone-400" onclick={cancelEditingItem}>
					<X class="w-4 h-4" />
				</Button>
			</form>
		</td>
	{:else}
		<td class="p-4 align-middle font-medium min-w-[180px]">{item.item_name}</td>
	{/if}

	{#if editingItemId === item.id && editingFieldName === 'notes'}
		<td class="p-4 align-middle text-stone-500 w-full">
			<form method="POST" action="?/updateField" use:enhance={() => {
				cancelEditingItem();
				return async ({ update }) => { await update({ reset: false }); };
			}} class="flex items-center gap-2 max-w-sm">
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="field" value="notes" />
				<Input name="value" bind:value={editingValue} class="h-8 text-sm" autofocus />
				<Button type="submit" size="icon" variant="ghost" class="h-8 w-8 text-forest-600">
					<Check class="w-4 h-4" />
				</Button>
				<Button type="button" size="icon" variant="ghost" class="h-8 w-8 text-stone-400" onclick={cancelEditingItem}>
					<X class="w-4 h-4" />
				</Button>
			</form>
		</td>
	{:else}
		<td class="p-4 align-middle text-stone-500 w-full">{item.notes || "-"}</td>
	{/if}

	{#if editingItemId === item.id && editingFieldName === 'location'}
		<td class="p-4 align-middle text-stone-500">
			<form method="POST" action="?/updateField" use:enhance={() => {
				cancelEditingItem();
				return async ({ update }) => { await update({ reset: false }); };
			}} class="flex items-center gap-2 max-w-sm">
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="field" value="location" />
				<select
					name="value"
					bind:value={editingValue}
					class="flex h-8 w-full rounded-md border border-stone-200 bg-white px-2 py-1 text-sm focus-visible:outline-none"
				>
					{#each locations as loc}
						<option value={loc.value}>{loc.label}</option>
					{/each}
				</select>
				<Button type="submit" size="icon" variant="ghost" class="h-8 w-8 text-forest-600">
					<Check class="w-4 h-4" />
				</Button>
				<Button type="button" size="icon" variant="ghost" class="h-8 w-8 text-stone-400" onclick={cancelEditingItem}>
					<X class="w-4 h-4" />
				</Button>
			</form>
		</td>
	{:else}
		<td class="p-4 align-middle text-stone-500">{formatLocation(item.location)}</td>
	{/if}
	<td class="p-4 align-middle">
		<span
			class="inline-flex items-center justify-center min-w-[2rem] font-semibold bg-stone-100 rounded-md py-1 px-2"
		>
			{item.quantity}
		</span>
	</td>
	<td class="p-4 align-middle">
		<div class="flex items-center gap-2">
			<form method="POST" action="?/updateQuantity" use:enhance>
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="delta" value="-1" />
				<Button
					type="submit"
					variant="outline"
					size="icon"
					class="h-8 w-8 text-stone-500"
					disabled={item.quantity <= 0}
				>
					<Minus class="w-4 h-4" />
				</Button>
			</form>
			<form method="POST" action="?/updateQuantity" use:enhance>
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="delta" value="1" />
				<Button
					type="submit"
					variant="outline"
					size="icon"
					class="h-8 w-8 text-forest-600 border-forest-200 bg-forest-50 hover:bg-forest-100 hover:text-forest-700"
				>
					<Plus class="w-4 h-4" />
				</Button>
			</form>
			{@render itemDropdown(item, true)}
		</div>
	</td>
{/snippet}

{#snippet inventoryRowNeed(item)}
	{#if editingItemId === item.id && editingFieldName === 'item_name'}
		<td class="p-4 align-middle font-medium min-w-[180px]">
			<form method="POST" action="?/updateField" use:enhance={() => {
				cancelEditingItem();
				return async ({ update }) => { await update({ reset: false }); };
			}} class="flex items-center gap-2 max-w-sm">
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="field" value="item_name" />
				<Input name="value" bind:value={editingValue} class="h-8 text-sm" autofocus />
				<Button type="submit" size="icon" variant="ghost" class="h-8 w-8 text-forest-600">
					<Check class="w-4 h-4" />
				</Button>
				<Button type="button" size="icon" variant="ghost" class="h-8 w-8 text-stone-400" onclick={cancelEditingItem}>
					<X class="w-4 h-4" />
				</Button>
			</form>
		</td>
	{:else}
		<td class="p-4 align-middle font-medium min-w-[180px]">{item.item_name}</td>
	{/if}

	{#if editingItemId === item.id && editingFieldName === 'notes'}
		<td class="p-4 align-middle text-stone-500 w-full">
			<form method="POST" action="?/updateField" use:enhance={() => {
				cancelEditingItem();
				return async ({ update }) => { await update({ reset: false }); };
			}} class="flex items-center gap-2 max-w-sm">
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="field" value="notes" />
				<Input name="value" bind:value={editingValue} class="h-8 text-sm" autofocus />
				<Button type="submit" size="icon" variant="ghost" class="h-8 w-8 text-forest-600">
					<Check class="w-4 h-4" />
				</Button>
				<Button type="button" size="icon" variant="ghost" class="h-8 w-8 text-stone-400" onclick={cancelEditingItem}>
					<X class="w-4 h-4" />
				</Button>
			</form>
		</td>
	{:else}
		<td class="p-4 align-middle text-stone-500 w-full">{item.notes || "-"}</td>
	{/if}
	<td class="p-4 align-middle">
		<div class="flex items-center gap-2">
			<form method="POST" action="?/updateQuantity" use:enhance>
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="delta" value="1" />
				<Button
					type="submit"
					variant="outline"
					class="h-8 text-forest-600 border-forest-200 bg-forest-50 hover:bg-forest-100 hover:text-forest-700 flex items-center gap-1 px-3 text-xs"
				>
					<Check class="w-3.5 h-3.5" />
					Got it
				</Button>
			</form>
			{@render itemDropdown(item, false)}
		</div>
	</td>
{/snippet}

<div class="space-y-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-semibold tracking-tight text-stone-900">
				Inventory
			</h1>
			<p class="text-stone-500 mt-1">
				Track tools, supplies, and consumables.
			</p>
		</div>
		<div
			class="p-3 bg-forest-100 text-forest-700 rounded-full hidden sm:block"
		>
			<PackageSearch class="w-6 h-6" />
		</div>
	</div>

	<form
		method="POST"
		action="?/addItem"
		use:enhance
		class="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-end"
	>
		<div class="w-full">
			<label
				for="item_name"
				class="text-xs font-medium text-stone-500 mb-1 block"
				>Item Name</label
			>
			<Input
				id="item_name"
				name="item_name"
				placeholder="e.g. Firewood"
				required
			/>
		</div>
		<div class="w-full">
			<label
				for="notes"
				class="text-xs font-medium text-stone-500 mb-1 block"
				>Notes</label
			>
			<Input id="notes" name="notes" placeholder="e.g. Cedar planks" />
		</div>
		<div class="w-full">
			<label
				for="location"
				class="text-xs font-medium text-stone-500 mb-1 block"
				>Location</label
			>
			<select
				id="location"
				name="location"
				class="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
			>
				{#each locations as loc}
					<option value={loc.value}>{loc.label}</option>
				{/each}
			</select>
		</div>
		<div class="w-full sm:w-36 flex-shrink-0">
			<label
				for="status"
				class="text-xs font-medium text-stone-500 mb-1 block"
				>Status</label
			>
			<select
				id="status"
				name="status"
				class="flex h-10 w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
			>
				<option value="have">Have</option>
				<option value="need">Need</option>
			</select>
		</div>
		<Button type="submit" class="w-full sm:w-auto bg-stone-900 flex-shrink-0"
			><Plus class="w-4 h-4 mr-2" /> Add Item</Button
		>
	</form>

	<div class="space-y-4">
		<h2 class="text-xl font-semibold tracking-tight text-stone-900">
			What we need
		</h2>
		<div
			class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
		>
			<Table
				headers={["Item", "Notes", "Actions"]}
				rows={whatWeNeed}
				rowSnippet={inventoryRowNeed}
			/>

			{#if whatWeNeed.length === 0}
				<div
					class="p-8 text-center text-stone-500 border-t border-stone-100"
				>
					You have everything you need!
				</div>
			{/if}
		</div>
	</div>

	<div class="space-y-4">
		<h2 class="text-xl font-semibold tracking-tight text-stone-900">
			What we have
		</h2>
		<div
			class="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden"
		>
			<Table
				headers={[
					"Item",
					"Notes",
					"Location",
					"Quantity",
					"Actions",
				]}
				rows={whatWeHave}
				rowSnippet={inventoryRowHave}
			/>

			{#if whatWeHave.length === 0}
				<div
					class="p-8 text-center text-stone-500 border-t border-stone-100"
				>
					No items in inventory. Add one above!
				</div>
			{/if}
		</div>
	</div>
</div>
