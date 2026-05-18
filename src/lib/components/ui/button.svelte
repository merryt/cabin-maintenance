<script module>
	import { tv, type VariantProps } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				default: 'bg-stone-900 text-stone-50 hover:bg-stone-900/90',
				destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/90',
				outline: 'border border-stone-200 bg-white hover:bg-stone-100 hover:text-stone-900',
				secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-100/80',
				ghost: 'hover:bg-stone-100 hover:text-stone-900',
				link: 'text-stone-900 underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type Props = HTMLButtonAttributes & HTMLAnchorAttributes & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		href?: string;
	};

	let {
		class: className = undefined,
		variant = 'default',
		size = 'default',
		href = undefined,
		children,
		...rest
	}: Props = $props();
</script>

{#if href}
	<a {href} class={cn(buttonVariants({ variant, size }), className)} {...(rest as any)}>
		{@render children?.()}
	</a>
{:else}
	<button class={cn(buttonVariants({ variant, size }), className)} {...(rest as HTMLButtonAttributes)}>
		{@render children?.()}
	</button>
{/if}
