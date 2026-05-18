<script lang="ts">
	import { enhance } from '$app/forms';
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/button.svelte';
	import Input from '$lib/components/ui/input.svelte';
	import { Trees, Lock, Mail, UserPlus, LogIn } from 'lucide-svelte';

	let { form } = $props();
	let submitting = $state(false);
	let mode = $state<'login' | 'register'>('login');
</script>

<div class="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
	<div class="mb-8 text-center text-forest-800">
		<Trees class="w-16 h-16 mx-auto mb-4 text-forest-600" />
		<h1 class="text-4xl font-semibold tracking-tight text-stone-900">Cabin Management</h1>
		<p class="text-stone-500 mt-2">Manage projects, inventory, and maintenance logs.</p>
	</div>

	<Card class="w-full max-w-md shadow-xl border-stone-200/60">
		{#snippet header()}
			<div class="flex border-b border-stone-100 -mx-6 -mt-6 mb-6">
				<button 
					class="flex-1 py-4 text-sm font-medium transition-colors border-b-2 {mode === 'login' ? 'border-forest-600 text-forest-700 bg-forest-50/30' : 'border-transparent text-stone-500 hover:text-stone-700'}"
					onclick={() => mode = 'login'}
				>
					<div class="flex items-center justify-center gap-2">
						<LogIn class="w-4 h-4" /> Sign In
					</div>
				</button>
				<button 
					class="flex-1 py-4 text-sm font-medium transition-colors border-b-2 {mode === 'register' ? 'border-forest-600 text-forest-700 bg-forest-50/30' : 'border-transparent text-stone-500 hover:text-stone-700'}"
					onclick={() => mode = 'register'}
				>
					<div class="flex items-center justify-center gap-2">
						<UserPlus class="w-4 h-4" /> Create Account
					</div>
				</button>
			</div>
			<div>
				<h3 class="font-semibold text-lg">{mode === 'login' ? 'Welcome Back' : 'Get Started'}</h3>
				<p class="text-sm text-stone-500 mt-1">
					{mode === 'login' ? 'Sign in to access your cabin records.' : 'Create an account to start tracking.'}
				</p>
			</div>
		{/snippet}

		{#snippet content()}
			<form
				method="POST"
				action="?/{mode}"
				use:enhance={() => {
					submitting = true;
					return async ({ update }) => {
						submitting = false;
						await update();
					};
				}}
				class="space-y-4"
			>
				{#if form?.message}
					<div class="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-100 flex items-center gap-2">
						<span class="w-1.5 h-1.5 rounded-full bg-red-600"></span>
						{form.message}
					</div>
				{/if}

				<div class="space-y-2">
					<label for="email" class="text-sm font-medium leading-none text-stone-700">Email Address</label>
					<div class="relative">
						<Mail class="absolute left-3 top-3 w-4 h-4 text-stone-400" />
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="you@example.com"
							required
							class="pl-10"
							value={form?.email ?? ''}
						/>
					</div>
				</div>

				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<label for="password" class="text-sm font-medium leading-none text-stone-700">Password</label>
					</div>
					<div class="relative">
						<Lock class="absolute left-3 top-3 w-4 h-4 text-stone-400" />
						<Input
							id="password"
							name="password"
							type="password"
							placeholder="••••••••"
							required
							class="pl-10"
						/>
					</div>
				</div>

				<Button type="submit" class="w-full bg-forest-700 hover:bg-forest-800" disabled={submitting}>
					{submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
				</Button>
			</form>
		{/snippet}
	</Card>

	<p class="mt-8 text-xs text-stone-400 text-center max-w-xs">
		By signing in, you agree to track your cabin metrics responsibly and maintain your property with pride.
	</p>
</div>
