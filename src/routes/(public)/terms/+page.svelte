<script lang="ts">
	import HeaderSection from '\$lib/components/Sections/header-section.svelte';
	import SubheadingSection from '\$lib/components/Sections/subheading-section.svelte';
	import { ShieldCheck } from 'lucide-svelte';

	const heading = 'Terms & Conditions';
	const subHeading = 'Please read these terms carefully before using our services.';
	const showBadge = true;
	const badgeText = 'Legal';
</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-gray-800 dark:text-gray-100">
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<HeaderSection
			heading="Terms & Conditions"
			subHeading="Please read these terms carefully before using our services"
			showBadge={true}
			badgeText="Legal"
		/>
	</div>

	<!-- Terms Body -->
	<div class="prose lg:prose-lg dark:prose-invert max-w-4xl mx-auto">
		<SubheadingSection
			title="1. Acceptance of Terms"
			icon="{ShieldCheck}"
		/>
		<div class="relative mb-10 max-w-3xl mx-auto px-6 py-5 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md rounded-xl border border-gray-200/20 dark:border-gray-700/30 shadow-sm">
			<p class="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
				By using this platform, you agree to comply with these Terms and Conditions, and acknowledge that your continued use constitutes acceptance.
			</p>
		</div>

		<h2>2. Modifications</h2>
		<p>We reserve the right to modify these terms at any time. Changes take effect immediately upon posting.</p>

		<h2>3. User Conduct</h2>
		<ul>
			<li>You agree not to misuse the platform.</li>
			<li>You are responsible for your account activity.</li>
			<li>You agree to comply with all applicable laws.</li>
		</ul>

		<h2>4. Intellectual Property</h2>
		<p>All content is protected by copyright and belongs to the platform or its licensors.</p>

		<h2>5. Termination</h2>
		<p>We may suspend or terminate your access for violations without notice.</p>

		<h2>6. Disclaimers</h2>
		<p>We provide the platform “as-is” and disclaim all warranties to the extent permitted by law.</p>

		<h2>7. Limitation of Liability</h2>
		<p>We are not liable for any damages arising from your use of the platform.</p>

		<h2>8. Governing Law</h2>
		<p>These terms are governed by the laws of [Your Country/State].</p>

		<h2>9. Contact</h2>
		<p>If you have any questions, contact us at <a href="mailto:support@example.com">support@example.com</a>.</p>

		<p class="text-sm mt-8 text-gray-500 dark:text-gray-400">Last updated: July 25, 2025</p>
	</div>
</section>