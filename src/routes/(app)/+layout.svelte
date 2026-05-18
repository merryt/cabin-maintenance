<script lang="ts">
	import { page } from '$app/stores';
	import { LayoutDashboard, FolderKanban, Wrench, PackageSearch, LogOut } from 'lucide-svelte';
	import { enhance } from '$app/forms';

	let { data, children } = $props();

	const navItems = [
		{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
		{ name: 'Projects', href: '/projects', icon: FolderKanban },
		{ name: 'Appliances', href: '/appliances', icon: Wrench },
		{ name: 'Inventory', href: '/inventory', icon: PackageSearch }
	];
</script>

<div class="min-h-screen bg-stone-50 flex flex-col md:flex-row">
	<!-- Desktop Sidebar -->
	<aside class="hidden md:flex flex-col w-64 bg-forest-900 text-stone-100 min-h-screen border-r border-forest-800">
		<div class="p-6">
			<h2 class="text-xl font-semibold tracking-tight text-forest-50">Cabin Manager</h2>
			{#if data.user}
				<p class="text-sm text-forest-300 mt-1 truncate">{data.user.email}</p>
			{/if}
		</div>
		
		<nav class="flex-1 px-4 space-y-2 mt-4">
			{#each navItems as item}
				<a
					href={item.href}
					class="flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium
						{$page.url.pathname.startsWith(item.href) ? 'bg-forest-800 text-white' : 'text-forest-200 hover:bg-forest-800 hover:text-white'}"
				>
					<item.icon class="w-5 h-5" />
					{item.name}
				</a>
			{/each}
		</nav>

		<div class="p-4 border-t border-forest-800">
			<form action="/auth/logout" method="POST" use:enhance>
				<button type="submit" class="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-forest-200 hover:text-white hover:bg-forest-800 rounded-md transition-colors">
					<LogOut class="w-5 h-5" />
					Sign Out
				</button>
			</form>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto pb-20 md:pb-0">
		<div class="max-w-5xl mx-auto p-4 md:p-8">
			{@render children()}
		</div>
	</main>

	<!-- Mobile Bottom Nav -->
	<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex items-center justify-around pb-safe z-50">
		{#each navItems as item}
			<a
				href={item.href}
				class="flex flex-col items-center justify-center w-full py-3 transition-colors
					{$page.url.pathname.startsWith(item.href) ? 'text-forest-700' : 'text-stone-500 hover:text-forest-700'}"
			>
				<item.icon class="w-6 h-6 mb-1" />
				<span class="text-[10px] font-medium">{item.name}</span>
			</a>
		{/each}
	</nav>
</div>

<style>
	/* Handle safe area for iOS bottom bar */
	.pb-safe {
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
