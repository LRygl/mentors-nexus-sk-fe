<!-- components/FAQ/SupportSection.svelte -->
<script lang="ts">
	import { MessageSquare, Mail, Phone } from 'lucide-svelte';

	interface SupportOption {
		icon: any;
		title: string;
		description: string;
		buttonText: string;
		buttonClass: string;
		action: string;
		href?: string;
	}

	interface Props {
		title?: string;
		description?: string;
		supportOptions?: SupportOption[];
	}

	let {
		title = "Still Need Help?",
		description = "Can't find what you're looking for? Our support team is here to help you with any questions or issues.",
		supportOptions = [
			{
				icon: MessageSquare,
				title: "Contact Support",
				description: "Get personalized help from our team",
				buttonText: "Contact Us",
				buttonClass: "bg-blue-600 hover:bg-blue-700",
				action: "link",
				href: "/contact"
			},
			{
				icon: Phone,
				title: "Call Support",
				description: "Speak directly with our support team",
				buttonText: "Call Now",
				buttonClass: "bg-green-600 hover:bg-green-700",
				action: "link",
				href: "tel:+15551234567"
			},
			{
				icon: MessageSquare,
				title: "Live Chat",
				description: "Get instant help right now",
				buttonText: "Start Chat",
				buttonClass: "bg-purple-600 hover:bg-purple-700",
				action: "button"
			}
		]
	}: Props = $props();

	function handleChatClick() {
		// Implement live chat functionality
		console.log('Starting live chat...');
	}
</script>

<div class="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8">
	<div class="text-center mb-8">
		<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{title}</h2>
		<p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
			{description}
		</p>
	</div>

	<div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
		{#each supportOptions as option}
			<div class="text-center group">
				<div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
					<svelte:component this={option.icon} class="w-8 h-8 text-white" />
				</div>
				<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">{option.title}</h3>
				<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{option.description}</p>

				{#if option.action === 'link' && option.href}
					<a
						href={option.href}
						class="inline-flex items-center gap-2 px-4 py-2 {option.buttonClass} text-white rounded-lg transition-colors text-sm"
					>
						<svelte:component this={option.icon} class="w-4 h-4" />
						{option.buttonText}
					</a>
				{:else}
					<button
						onclick={handleChatClick}
						class="inline-flex items-center gap-2 px-4 py-2 {option.buttonClass} text-white rounded-lg transition-colors text-sm"
					>
						<svelte:component this={option.icon} class="w-4 h-4" />
						{option.buttonText}
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>