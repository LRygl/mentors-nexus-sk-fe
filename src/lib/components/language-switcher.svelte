<!-- LanguageSwitcher.svelte -->
<script lang="ts">
	import { currentLanguage, setLanguage,  } from '$lib/stores/internalization-store';
	import { Globe } from 'lucide-svelte';
	import type { LanguageCode } from '$lib/types/translation';
	import { availableLanguages } from '$lib/language';

	function handleLanguageChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		setLanguage(target.value as LanguageCode);
	}
</script>

<div class="flex items-center gap-2">
	<Globe class="w-4 h-4" />
	<select
		value={$currentLanguage}
		onchange={handleLanguageChange}
		class="bg-background border border-input rounded-md px-2 py-1 text-sm"
	>
		{#each Object.entries(availableLanguages) as [code, name]}
			<option value={code}>{name}</option>
		{/each}
	</select>
</div>