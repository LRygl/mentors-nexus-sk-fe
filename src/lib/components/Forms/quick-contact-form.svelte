<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Send } from 'lucide-svelte';

	const dispatch = createEventDispatcher<{ success: string }>();

	let name = $state('');
	let email = $state('');
	let message = $state('');
	let loading = $state(false);
	let success = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		success = false;

		/* TODO: replace with your real API call */
		await new Promise(r => setTimeout(r, 800));

		loading = false;
		success = true;
		name = email = message = '';

		dispatch('success', 'Thank you! We’ll get back to you shortly.');
	}
</script>

<form
	onsubmit={handleSubmit}
	class="max-w-7xl mx-auto mb-16 mt-16 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg space-y-6"
>
	<h4 class="text-2xl font-bold text-center mb-2">Send us a message</h4>

	<div class="grid sm:grid-cols-2 gap-5">
		<label class="block">
			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Name</span>
			<input
				type="text"
				required
				bind:value={name}
				class="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
               bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			/>
		</label>

		<label class="block">
			<span class="text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</span>
			<input
				type="email"
				required
				bind:value={email}
				class="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
               bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
			/>
		</label>
	</div>

	<label class="block">
		<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Message</span>
		<textarea
			rows={4}
			required
			bind:value={message}
			class="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
             bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
		/>
	</label>

	{#if success}
		<p class="text-center text-green-600 dark:text-green-400 font-semibold">
			✅ Message sent successfully!
		</p>
	{/if}

	<button
		type="submit"
		disabled={loading}
		class="w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white
           bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-md
           hover:shadow-lg active:scale-95 transition disabled:opacity-60"
	>
		{#if loading}
			<span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
			Sending…
		{:else}
			<Send size={18} />
			Send Message
		{/if}
	</button>
</form>