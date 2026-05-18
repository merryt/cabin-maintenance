<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { Wrench, Plus, ChevronRight } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-semibold tracking-tight text-stone-900">Appliance Registry</h1>
			<p class="text-stone-500 mt-1">Keep track of manuals, model numbers, and maintenance history.</p>
		</div>
		<div class="p-3 bg-forest-100 text-forest-700 rounded-full hidden sm:block">
			<Wrench class="w-6 h-6" />
		</div>
	</div>

	<form method="POST" action="?/addAppliance" use:enhance class="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col sm:flex-row gap-4 items-end">
		<div class="w-full">
			<label for="name" class="text-xs font-medium text-stone-500 mb-1 block">Appliance Name</label>
			<Input id="name" name="name" placeholder="e.g. Water Heater" required />
		</div>
		<div class="w-full">
			<label for="brand" class="text-xs font-medium text-stone-500 mb-1 block">Brand</label>
			<Input id="brand" name="brand" placeholder="e.g. Rheem" />
		</div>
		<div class="w-full">
			<label for="model_number" class="text-xs font-medium text-stone-500 mb-1 block">Model Number</label>
			<Input id="model_number" name="model_number" placeholder="e.g. PROG40-38" />
		</div>
		<Button type="submit" class="w-full sm:w-auto bg-stone-900"><Plus class="w-4 h-4 mr-2" /> Register</Button>
	</form>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.appliances as appliance}
			<a href="/appliances/{appliance.id}" class="block group">
				<Card class="h-full transition-all hover:shadow-md hover:border-forest-200 cursor-pointer group-hover:bg-forest-50/30">
					{#snippet header()}
						<div class="flex justify-between items-start">
							<div>
								<h3 class="font-semibold text-lg group-hover:text-forest-700 transition-colors">{appliance.name}</h3>
								<p class="text-stone-500 text-sm mt-0.5">{appliance.brand || 'Unknown Brand'}</p>
							</div>
							<div class="p-2 bg-stone-100 text-stone-600 rounded-full group-hover:bg-forest-100 group-hover:text-forest-600 transition-colors">
								<Wrench class="w-5 h-5" />
							</div>
						</div>
					{/snippet}
					{#snippet content()}
						<div class="mt-4 flex items-center justify-between">
							<div class="text-sm text-stone-500">
								<span class="font-medium text-stone-700">Model:</span> {appliance.model_number || 'N/A'}
							</div>
							<ChevronRight class="w-5 h-5 text-stone-300 group-hover:text-forest-500 transition-colors" />
						</div>
					{/snippet}
				</Card>
			</a>
		{/each}

		{#if data.appliances.length === 0}
			<div class="col-span-full py-12 text-center text-stone-500 bg-white rounded-xl border border-stone-200 border-dashed">
				<Wrench class="w-12 h-12 mx-auto text-stone-300 mb-3" />
				<p>No appliances registered. Add your first appliance to get started.</p>
			</div>
		{/if}
	</div>
</div>
