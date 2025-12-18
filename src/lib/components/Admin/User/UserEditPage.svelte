<script lang="ts">

	import { onMount } from 'svelte';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
	import LegalTopicSectionManager from '$lib/components/Admin/Legal Topic/LegalTopicSectionManager.svelte';
	import LegalTopicDetailsSection from '$lib/components/Admin/Legal Topic/LegalTopicDetailsSection.svelte';
	import { userStore } from '$lib/stores/defaults/UserStore';
	import UserDetailsSection from '$lib/components/Admin/User/UserDetailsSection.svelte';
	import type { LegalTopic } from '$lib/types/entities/LegalTopic';
	import type { User } from '$lib/types/entities/User';

	let { userId } = $props<{ userId?: string }>();

	let user = $derived(userStore.selectItem);
	let isLoading = $derived(userStore.loadingItem);
	let error = $derived(userStore.itemError);

	onMount(async () => {
		await userStore.fetchItem(userId)
	});

	async function handleUserUpdate(formData: Partial<User>) {
		await userStore.update(userId, formData);
	}

</script>

<div class="min-h-screen py-8 bg-gray-50">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p class="text-red-800">{error}</p>
				<button
					onclick={() => userStore.fetchItem(userId)}
					class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
				>
					Try again
				</button>
			</div>
		{:else if user}
			<UserDetailsSection
				{user}
				onUpdate={handleUserUpdate}
			/>

		{/if}
	</div>
</div>