import type { Component } from 'svelte';
import type { MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';

export interface MetadataConfig {
	title: string;
	subtitle?: string;
	icon: Component;
	items: MetadataItemConfig[];
	badge?: {
		text: string;
		icon: Component;
	};
	columns?: number;
}