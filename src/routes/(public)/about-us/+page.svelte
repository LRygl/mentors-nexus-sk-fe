<script lang="ts">
	import { Building2, Users, Target, Heart, Sparkles, Zap, Award, TrendingUp } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import HeaderSection from '\$lib/components/Sections/Public/header-section.svelte';
	import BadgeComponent from '$lib/components/Sections/Public/BadgeComponent.svelte';
	import CTABannerComponent from '$lib/components/Sections/Public/CTABannerComponent.svelte';
	import { ctaBannerPresets as CTABannerConfig } from '$lib/Config/Components/CTABannerComponent/CTABannerConfig';

	let sectionsVisible = false;
	let statsVisible = false;

	// Team stats
	let stats = [
		{ value: '15+', label: 'Team Members', icon: Users },
		{ value: '8', label: 'Years Experience', icon: Award },
		{ value: '100K+', label: 'Students Helped', icon: TrendingUp },
		{ value: '4.9/5', label: 'Satisfaction', icon: Heart }
	];

	onMount(() => {
		setTimeout(() => {
			sectionsVisible = true;
			statsVisible = true;
		}, 300);
	});
</script>

<!-- Hero Section with Gradient Background -->
<section class="relative mt-12 w-screen overflow-hidden">

		<HeaderSection
			showBadge={true}
			badgeText="Legal Information"
			heading="About Us"
			subHeading="Information about us"
		/>

</section>

<!-- Mission Section -->
<section class="relative w-screen py-15 overflow-hidden">
	<!-- Background Elements -->
	<div class="absolute inset-0 opacity-30">
		<div class="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-float"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid md:grid-cols-2 gap-12 items-center">
			<div class="animate-slide-in-left" class:opacity-100={sectionsVisible}>
				<h2 class="text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
					Empowering Through
					<span class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Education</span>
				</h2>
				<p class="text-primary text-lg mb-6 leading-relaxed">
					Founded with a vision to democratize knowledge, we believe that everyone deserves access to quality educational resources. Our platform combines cutting-edge technology with expert-curated content to create an unparalleled learning experience.
				</p>
				<p class="text-primary text-lg leading-relaxed">
					We're committed to continuous improvement, listening to our community, and adapting to the ever-changing landscape of education and technology.
				</p>
			</div>

			<div class="relative animate-slide-in-right" class:opacity-100={sectionsVisible}>
				<div class="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl h-96 flex items-center justify-center animate-float-slow">
					<div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
					<Building2 class="relative h-40 w-40 text-blue-400/50" />

					<!-- Floating accent elements -->
					<div class="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500/50 to-pink-500/30 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center animate-float" style="animation-delay: 1s">
						<Sparkles class="w-8 h-8 text-purple-400" />
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Values Section -->
<section class="relative py-24 overflow-hidden">
	<!-- Background gradient -->
	<div class="absolute inset-0">
		<div class="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16 animate-fade-in-up">
			<BadgeComponent
				class="mb-3"
				text="Gradient Badge"
				icon={Zap}
				position='center'
				variant="gradient"
				iconColor="text-white dark:text-blue-400"
				gradientFrom="from-blue-600"
				gradientVia="via-blue-500"
				gradientTo="to-blue-400"
			/>
			<h2 class="text-4xl lg:text-5xl font-bold text-primary mb-4">Our Values</h2>
			<p class="text-primary text-lg max-w-2xl mx-auto">
				The principles that guide everything we do
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			{#each [
				{ icon: Users, title: 'Community First', description: 'We build with and for our community, ensuring every voice is heard and valued.', delay: '0s' },
				{ icon: Heart, title: 'Quality & Care', description: 'Every piece of content is crafted with attention to detail and genuine care for learners.', delay: '0.2s' },
				{ icon: Target, title: 'Innovation', description: 'We constantly push boundaries to create better learning experiences.', delay: '0.4s' }
			] as value}
				<div class="group backdrop-blur-2xl p-8 rounded-3xl border border-primary/10 hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 animate-slide-in" style="animation-delay: {value.delay}">
					<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
						<svelte:component this={value.icon} class="h-7 w-7 text-blue-400" />
					</div>
					<h3 class="text-2xl font-bold text-primary mb-3">{value.title}</h3>
					<p class="text-primary leading-relaxed">
						{value.description}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Team Section -->
<section class="relative py-24 overflow-hidden">
	<div class="absolute inset-0 opacity-30">
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
	</div>

	<div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16 animate-fade-in-up">
			<h2 class="text-4xl lg:text-5xl font-bold text-primary mb-4">Meet Our Team</h2>
			<p class="text-primary text-lg max-w-2xl mx-auto">
				Passionate individuals working together to make a difference
			</p>
		</div>

		<div class="text-center py-12">
			<div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-12 border border-white/20 max-w-3xl mx-auto animate-float-slow">
				<Users class="h-20 w-20 text-blue-400/80 mx-auto mb-6" />
				<p class="text-primary text-xl leading-relaxed">
					We're a diverse team of educators, developers, and designers united by our passion for learning and innovation.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="relative w-screen overflow-hidden">
	<CTABannerComponent
		{...CTABannerConfig.general}
	/>
</section>

<style>
    @keyframes gradient-x {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
    }

    @keyframes float-slow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
    }

    @keyframes float-particle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-up {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in-left {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slide-in {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes counter {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    .animate-gradient-x {
        background-size: 200% 200%;
        animation: gradient-x 3s ease infinite;
    }

    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
    .animate-float-particle { animation: float-particle linear infinite; }
    .animate-fade-in { animation: fade-in 1s ease-out forwards; opacity: 0; }
    .animate-slide-up { animation: slide-up 1s ease-out forwards; opacity: 0; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; opacity: 0; }
    .animate-slide-in-left { animation: slide-in-left 1s ease-out forwards; opacity: 0; }
    .animate-slide-in-right { animation: slide-in-right 1s ease-out forwards; opacity: 0; }
    .animate-slide-in { animation: slide-in 0.8s ease-out forwards; opacity: 0; }
    .animate-counter { animation: counter 0.8s ease-out forwards; }
</style>