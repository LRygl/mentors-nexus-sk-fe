<!-- LanguageSwitcher.svelte -->
<script lang="ts">
	import { currentLanguage, setLanguage,  } from '$lib/stores/internalization-store';
	import type { LanguageCode } from '$lib/types/translation';
	import { availableLanguages } from '$lib/language';
	import * as Select from '$lib/components/ui/select';
	import { Flag } from 'lucide-svelte';
	import { Cz, Gb } from 'svelte-flags'

	function handleLanguageChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		setLanguage(target.value as LanguageCode);
	}

	$: selectedLanguageLabel = availableLanguages[$currentLanguage];

</script>

<Select.Root type="single" bind:value={$currentLanguage}>
	<Select.Trigger class="w-[130px]">
		<Flag /> {selectedLanguageLabel}
	</Select.Trigger>
	<Select.Content>

		{#each Object.entries(availableLanguages) as [code, name]}
			<Select.Item value={code}>
				<Cz class="rounded-full">test</Cz>
				{name}
			</Select.Item>
		{/each}

	</Select.Content>
</Select.Root>