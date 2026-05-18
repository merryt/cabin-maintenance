<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import { FolderKanban, Wrench, ArrowRight, Clock } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div>
		<h1 class="text-3xl font-semibold tracking-tight text-stone-900">Dashboard</h1>
		<p class="text-stone-500 mt-1">Overview of your cabin's status.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-semibold leading-none tracking-tight">Active Projects</h3>
						<p class="text-sm text-stone-500 mt-1.5">Currently in progress.</p>
					</div>
					<div class="p-2 bg-forest-100 text-forest-700 rounded-full">
						<FolderKanban class="w-5 h-5" />
					</div>
				</div>
			{/snippet}
			{#snippet content()}
				{#if data.projects.length === 0}
					<div class="py-8 text-center text-stone-500">
						<p>No active projects.</p>
					</div>
				{:else}
					<ul class="space-y-4">
						{#each data.projects as project}
							<li class="border-b border-stone-100 last:border-0 pb-4 last:pb-0">
								<a href="/projects" class="flex flex-col gap-1 group">
									<span class="font-medium text-stone-900 group-hover:text-forest-700 transition-colors">{project.title}</span>
									{#if project.description}
										<span class="text-sm text-stone-500 line-clamp-1">{project.description}</span>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			{/snippet}
			{#snippet footer()}
				<Button variant="ghost" class="w-full text-forest-700 hover:text-forest-800" href="/projects">
					View All Projects <ArrowRight class="w-4 h-4 ml-2" />
				</Button>
			{/snippet}
		</Card>

		<Card>
			{#snippet header()}
				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-semibold leading-none tracking-tight">Recent Maintenance</h3>
						<p class="text-sm text-stone-500 mt-1.5">Latest updates and repairs.</p>
					</div>
					<div class="p-2 bg-forest-100 text-forest-700 rounded-full">
						<Wrench class="w-5 h-5" />
					</div>
				</div>
			{/snippet}
			{#snippet content()}
				{#if data.recentLogs.length === 0}
					<div class="py-8 text-center text-stone-500">
						<p>No recent maintenance logs.</p>
					</div>
				{:else}
					<ul class="space-y-4">
						{#each data.recentLogs as log}
							<li class="flex gap-4 border-b border-stone-100 last:border-0 pb-4 last:pb-0">
								<div class="mt-0.5 text-stone-400">
									<Clock class="w-4 h-4" />
								</div>
								<div>
									<p class="text-sm font-medium text-stone-900">
										{log.appliances?.name || 'Appliance'}
									</p>
									<p class="text-sm text-stone-600 mt-0.5">{log.content}</p>
									<p class="text-xs text-stone-400 mt-1">
										{new Date(log.created_at).toLocaleDateString()}
									</p>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			{/snippet}
			{#snippet footer()}
				<Button variant="ghost" class="w-full text-stone-700" href="/appliances">
					Manage Appliances <ArrowRight class="w-4 h-4 ml-2" />
				</Button>
			{/snippet}
		</Card>
	</div>
</div>
