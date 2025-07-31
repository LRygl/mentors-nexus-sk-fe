<!-- components/PrivacyToggle.svelte -->
<script lang="ts">
	import { users } from '$lib/stores/user-store';
	import type { PrivacySetting } from '$lib/types/privacySetting'

	interface Props {
		userId: string;
		setting: PrivacySetting;
		label: string;
		description?: string;
		disabled?: boolean;
	}
	let isUpdating = $state(false);
	let { userId, setting, label, description, disabled = false }: Props = $props();

	let isLoading = $state(false);
	let error = $state<string | null>(null);

	// Create a derived value that gets the current value
	const currentValue = $derived(users.getPrivacySetting(userId, setting) ?? false);

	// Also derived user object for better reactivity
	const user = $derived($users.data.find(u => u.id.toString() === userId));

	// Get the current value from the store
	const isEnabled = $derived(users.getPrivacySetting(userId, setting) ?? false);

	async function handleToggle() {
		if (isUpdating) return;

		isUpdating = true;

		try {
			await users.togglePrivacySetting(userId, setting);
		} catch (error) {
			console.error('Failed to toggle privacy setting:', error);
			// You might want to show an error message to the user here
		} finally {
			isUpdating = false;
		}
	}
</script>

<div class="p-4 border border-gray-200 rounded-2xl mb-4 bg-white shadow-sm">
	<div class="flex items-start justify-between gap-4">
		<div class="flex-1">
			<h3 class="text-base font-semibold text-gray-900">{label}</h3>
			{#if description}
				<p class="mt-1 text-sm text-gray-500">{description}</p>
			{/if}
		</div>

		<button
			class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed
				{isEnabled ? 'bg-green-500' : 'bg-gray-300'}"
			{disabled}
			onclick={handleToggle}
			aria-label="Toggle {label}"
		>
			<span
				class="inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out
					{isEnabled ? 'translate-x-5' : 'translate-x-1'}
					{isLoading ? 'animate-spin' : ''}"
			></span>
		</button>
	</div>

	{#if error}
		<p class="mt-2 text-sm text-red-500">{error}</p>
	{/if}
</div>