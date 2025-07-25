<script lang="ts">
	import HeaderSection from '$lib/components/Sections/header-section.svelte';
	import FaqSection from '$lib/components/Sections/faq-section.svelte';
	import ContactSection from '$lib/components/Sections/contact-section.svelte';
	import QuickContactForm from '$lib/components/Forms/quick-contact-form.svelte';
</script>

<svelte:head>
	<title>Support • LMS</title>
</svelte:head>

<main>
	<!-- HERO --------------------------------------------------->
	<section class="relative overflow-hidden">
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
			<HeaderSection
				heading="Support"
				subHeading="Need help? Find answers or get in touch with our team."
				showBadge={true}
				badgeText="24/7 assistance"
			/>
		</div>
	</section>

	<!-- FAQ ---------------------------------------------------->
	<FaqSection />

	<!-- CONTACT ----------------------------------------------->
	<ContactSection />

	<QuickContactForm />
</main>