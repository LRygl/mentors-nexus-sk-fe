<script lang="ts">

	import { HelpCircle } from 'lucide-svelte';
	import type { Component } from 'svelte';
	import { getIconComponent } from '$lib/types/params/iconRegistry';

	interface Props {
		iconName: string | null | undefined;
		class?: string;
		size?: number;
		color?: string;
	}

	let {
		iconName,
		class: className = '',
		size = 50,
		color
	}: Props = $props();

	// Get the icon component, fallback to HelpCircle if not found
	let IconComponent = $state<Component>();

	$effect(() => {
		IconComponent = getIconComponent(iconName || '');
	});

</script>

{#if IconComponent}
	<IconComponent
		class={className}
		width={size}
		height={size}
		style={`${color ? `color: ${color};` : ''} width:${size}px; height:${size}px;`}
	/>
{/if}