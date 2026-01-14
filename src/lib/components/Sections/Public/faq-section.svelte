<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import SubheadingSection from './subheading-section.svelte';

	interface FaqItem {
		q: string;
		a: string;
	}

	const faqs: FaqItem[] = [
		{
			q: 'How do I reset my forgot-password?',
			a: 'Click “Forgot forgot-password” on the login screen and follow the instructions sent to your e-mail.',
		},
		{
			q: 'Can I download lessons for offline access?',
			a: 'Yes! On the lesson page, tap the “Download” button and the video will be saved to your device.',
		},
		{
			q: 'Which browsers are supported?',
			a: 'We officially support the latest versions of Chrome, Firefox, Safari and Edge.',
		},
		{
			q: 'Do you offer refunds?',
			a: 'If you cancel within 14 days of purchase we’ll issue a full refund, no questions asked.',
		},
	];
</script>

<section class="w-screen">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

		<SubheadingSection
			text="Frequently asked questions"
			variant="animated"
			size="medium"
			centered={false}
			animate={true}
		/>

		<Accordion.Root type="single">
			{#each faqs as faq, idx (idx)}
				<Accordion.Item value={`faq-${idx}`} class="mb-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
						<Accordion.Trigger
							class="flex w-full text-xl items-center justify-between gap-4 px-6 py-5 text-left font-semibold
                     text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800
                     rounded-2xl transition">
							<span>{faq.q}</span>
						</Accordion.Trigger>

					<Accordion.Content class="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
						{faq.a}
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</section>