<script lang="ts">
	import { TriangleAlert, LoaderCircle, RefreshCw } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { translation, type AsyncStore, type TranslationKey } from '$lib/stores/internalization-store';
	import type { Snippet } from 'svelte';

	interface Props {
		store: AsyncStore<any>;
		errorKey?: TranslationKey;
		loadingKey?: TranslationKey;
		onRetry: () => void;
		children: Snippet;
	}

	let {
		store,
		errorKey = 'errors.loading_data',
		loadingKey = 'loading.default',
		onRetry,
		children
	}: Props = $props();

	// Reactive state from the store
	const state = $derived(store);

	// Get translations with proper typing
	const errorTitle = $derived(() => {
		const [section, key] = errorKey.split('.') as [keyof typeof $translation, string];
		return ($translation[section] as any)[key] as string;
	});

	const loadingMessage = $derived(() => {
		const [section, key] = loadingKey.split('.') as [keyof typeof $translation, string];
		return ($translation[section] as any)[key] as string;
	});

	const tryAgainText = $derived($translation.buttons.try_again);
	const retryingText = $derived($translation.buttons.retrying);
</script>

{#if state.error}
	<div class="rounded-md border p-8 text-center flex flex-col items-center">
		<div class="flex flex-col items-center mb-2">
			<div><TriangleAlert color="red" size={48} /></div>
			<h1 class="text-2xl font-extrabold">{errorTitle()}</h1>
		</div>
		<div class="text-sm text-muted-foreground mb-4">{state.error}</div>
		<Button variant="default" onclick={onRetry} disabled={state.loading}>
			{#if state.loading}
				<LoaderCircle class="w-4 h-4 mr-2 animate-spin" />
				{retryingText}
			{:else}
				<RefreshCw class="w-4 h-4 mr-2" />
				{tryAgainText}
			{/if}
		</Button>
	</div>
{:else if state.loading}
	<div class="rounded-md border p-8 text-center">
		<LoaderCircle class="w-6 h-6 mx-auto mb-2 animate-spin" />
		<div class="text-sm text-muted-foreground">{loadingMessage()}</div>
	</div>
{:else}
	{@render children()}
{/if}