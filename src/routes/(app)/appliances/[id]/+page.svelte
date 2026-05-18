<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { ArrowLeft, Clock, Paperclip, Wrench, User } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<Button variant="ghost" href="/appliances" class="px-0 mb-4 text-stone-500 hover:text-stone-900">
			<ArrowLeft class="w-4 h-4 mr-2" /> Back to Appliances
		</Button>
		<div class="flex items-center gap-4">
			<div class="p-3 bg-forest-100 text-forest-700 rounded-xl">
				<Wrench class="w-8 h-8" />
			</div>
			<div>
				<h1 class="text-3xl font-semibold tracking-tight text-stone-900">{data.appliance.name}</h1>
				<p class="text-stone-500 mt-1">
					{#if data.appliance.brand}{data.appliance.brand} &bull; {/if}
					Model: {data.appliance.model_number || 'Unknown'}
				</p>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<div class="lg:col-span-1 space-y-6">
			<Card title="Add Maintenance Log" description="Record a repair, filter change, or note.">
				{#snippet content()}
					<form method="POST" action="?/addLog" enctype="multipart/form-data" use:enhance class="space-y-4 mt-4">
						<div class="space-y-2">
							<label for="content" class="text-sm font-medium leading-none">Log Note</label>
							<textarea 
								id="content" 
								name="content" 
								required 
								class="flex min-h-[80px] w-full rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								placeholder="e.g. Replaced water filter..."
							></textarea>
						</div>
						
						<div class="space-y-2">
							<label for="photo" class="text-sm font-medium leading-none">Attach Photo (Optional)</label>
							<Input id="photo" name="photo" type="file" accept="image/*" />
						</div>

						<Button type="submit" class="w-full bg-forest-700 hover:bg-forest-800">
							<Paperclip class="w-4 h-4 mr-2" /> Save Log
						</Button>
					</form>
				{/snippet}
			</Card>
		</div>

		<div class="lg:col-span-2">
			<Card title="Maintenance History" description="Chronological timeline of all recorded logs.">
				{#snippet content()}
					<div class="mt-6 relative border-l-2 border-stone-100 ml-3 md:ml-6 space-y-8 pb-4">
						{#each data.logs as log}
							<div class="relative pl-6 md:pl-8">
								<div class="absolute -left-3.5 top-1 w-7 h-7 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center text-stone-400">
									<Clock class="w-3.5 h-3.5" />
								</div>
								<div class="bg-stone-50 rounded-lg p-4 border border-stone-100">
									<p class="text-stone-800 whitespace-pre-wrap">{log.content}</p>
									
									{#if log.photo_url}
										<div class="mt-4 rounded-md overflow-hidden border border-stone-200 max-w-xs">
											<img src={log.photo_url} alt="Maintenance reference" class="w-full object-cover" />
										</div>
									{/if}

									<div class="flex items-center gap-3 mt-4 pt-4 border-t border-stone-200/60 text-xs text-stone-500">
										<span class="flex items-center gap-1.5 font-medium text-stone-700">
											<User class="w-3.5 h-3.5" />
											{log.profiles?.full_name || log.profiles?.email || 'Unknown User'}
										</span>
										<span>&bull;</span>
										<time>{new Date(log.created_at).toLocaleString()}</time>
									</div>
								</div>
							</div>
						{/each}

						{#if data.logs.length === 0}
							<div class="pl-8 text-stone-500 py-4">
								<p>No maintenance logs recorded yet.</p>
							</div>
						{/if}
					</div>
				{/snippet}
			</Card>
		</div>
	</div>
</div>
