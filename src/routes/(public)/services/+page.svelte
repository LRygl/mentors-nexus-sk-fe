<script lang="ts">
	import {
		BookOpen,
		Video,
		Users,
		Award,
		MessageSquare,
		BarChart,
		Check,
		Sparkles,
		TrendingUp,
		Target,
		Zap,
		Globe,
		Clock,
		Shield,
		Heart,
		Code,
		Palette,
		GraduationCap,
		ArrowRight
	} from 'lucide-svelte';

	import { onMount } from 'svelte';
	import BadgeComponent from '$lib/components/Sections/Public/BadgeComponent.svelte';
	import CTABannerComponent from '$lib/components/Sections/Public/CTABannerComponent.svelte';
	import { ctaBannerPresets as CTABannerConfig } from '$lib/Config/Components/CTABannerComponent/CTABannerConfig';
	let contentVisible = $state(false);

	interface Service {
		icon: any;
		title: string;
		description: string;
		features: string[];
		color: string;
		highlighted?: boolean;
	}

	const features = [
		{
			icon: Globe,
			title: 'Global Access',
			description: 'Learn from anywhere in the world, at any time'
		},
		{
			icon: Clock,
			title: 'Flexible Learning',
			description: 'Study at your own pace with lifetime access'
		},
		{
			icon: Shield,
			title: 'Quality Assured',
			description: 'Expert-vetted content and instructors'
		},
		{
			icon: Heart,
			title: 'Community Support',
			description: 'Join a community of passionate learners'
		}
	];

	const stats = [
		{ value: '50,000+', label: 'Active Learners', icon: Users },
		{ value: '1,200+', label: 'Expert Courses', icon: BookOpen },
		{ value: '98%', label: 'Success Rate', icon: TrendingUp },
		{ value: '200+', label: 'Expert Instructors', icon: Award }
	];

	const pricingPlans = [
		{
			name: 'Individual',
			price: '$29',
			period: '/month',
			description: 'Perfect for personal growth',
			features: [
				'Access to all courses',
				'Mobile & desktop apps',
				'Progress tracking',
				'Community access',
				'Email support'
			],
			color: 'from-blue-500 to-cyan-500',
			popular: false
		},
		{
			name: 'Professional',
			price: '$79',
			period: '/month',
			description: 'Best for professionals',
			features: [
				'Everything in Individual',
				'Live training sessions',
				'1-on-1 mentorship',
				'Priority support',
				'Certification programs',
				'Career guidance'
			],
			color: 'from-purple-500 to-pink-500',
			popular: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			description: 'For teams and organizations',
			features: [
				'Everything in Professional',
				'Custom content',
				'Dedicated account manager',
				'Advanced analytics',
				'API access',
				'White-label options'
			],
			color: 'from-emerald-500 to-teal-500',
			popular: false
		}
	];

	onMount(() => {
		setTimeout(() => {
			contentVisible = true;
		}, 100);
	});
</script>

<svelte:head>
	<title>Our Services - Comprehensive Learning Solutions</title>
	<meta name="description" content="Explore our range of services designed to help you master new skills and advance your career." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">

	<!-- Hero Section -->
	<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24">
		<!-- Animated Background -->
		<div class="absolute inset-0 opacity-30">
			<div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
		</div>

		<!-- Floating Particles -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			{#each Array(10) as _, i}
				<div
					class="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
					style="
						left: {Math.random() * 100}%;
						top: {Math.random() * 100}%;
						animation-delay: {Math.random() * 5}s;
						animation-duration: {3 + Math.random() * 4}s;
					"
				></div>
			{/each}
		</div>

		<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<BadgeComponent
				text="Comprehensive Solutions"
				icon={Target}
				variant="transparent"
				position="center"
				class="mb-6"
			/>

			<h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fade-in-up">
				Our Services
			</h1>

			<p class="text-xl lg:text-2xl text-blue-100 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.1s">
				Everything you need to master new skills, advance your career, and achieve your learning goals
			</p>

			<!-- Features Grid -->
			<div class="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto mt-12 animate-fade-in-up" style="animation-delay: 0.2s">
				{#each features as feature}
					<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
						<div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
							<svelte:component this={feature.icon} class="w-6 h-6 text-white" />
						</div>
						<h3 class="text-white font-bold mb-2">{feature.title}</h3>
						<p class="text-sm text-blue-200">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
		<div class="max-w-7xl mx-auto">
			<div class="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-slate-700 shadow-2xl">
				<div class="grid md:grid-cols-4 gap-8">
					{#each stats as stat, i}
						<div class="text-center animate-slide-in" class:opacity-100={contentVisible} style="animation-delay: {i * 0.1}s">
							<div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
								<svelte:component this={stat.icon} class="w-8 h-8 text-white" />
							</div>
							<div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
								{stat.value}
							</div>
							<div class="text-sm text-gray-600 dark:text-gray-400 font-medium">
								{stat.label}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800/50">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-16">
				<BadgeComponent
					text="Simple Pricing"
					icon={Sparkles}
					variant="transparent"
					position="center"
					class="mb-6"
				/>
				<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					Choose Your Plan
				</h2>
				<p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Select the perfect plan for your learning journey
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
				{#each pricingPlans as plan, i}
					<div
						class="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in {plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}"
						style="animation-delay: {i * 0.1}s"
						class:opacity-100={contentVisible}
					>
						{#if plan.popular}
							<div class="absolute -top-4 left-1/2 -translate-x-1/2">
								<span class="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full">
									RECOMMENDED
								</span>
							</div>
						{/if}

						<div class="text-center mb-8">
							<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								{plan.name}
							</h3>
							<p class="text-gray-600 dark:text-gray-400 text-sm mb-6">
								{plan.description}
							</p>
							<div class="flex items-baseline justify-center gap-1">
								<span class="text-5xl font-black bg-gradient-to-r {plan.color} bg-clip-text text-transparent">
									{plan.price}
								</span>
								<span class="text-gray-600 dark:text-gray-400">
									{plan.period}
								</span>
							</div>
						</div>

						<ul class="space-y-4 mb-8">
							{#each plan.features as feature}
								<li class="flex items-start gap-3">
									<div class="w-5 h-5 rounded-full bg-gradient-to-br {plan.color} flex items-center justify-center flex-shrink-0 mt-0.5">
										<Check class="w-3 h-3 text-white" />
									</div>
									<span class="text-sm text-gray-700 dark:text-gray-300">
										{feature}
									</span>
								</li>
							{/each}
						</ul>

						<button class="w-full px-6 py-4 bg-gradient-to-r {plan.color} text-white rounded-xl font-bold hover:shadow-lg transition-all duration-300 hover:scale-105">
							Get Started
						</button>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Process Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					How It Works
				</h2>
				<p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
					Get started in just four simple steps
				</p>
			</div>

			<div class="grid md:grid-cols-4 gap-8">
				{#each [
					{ number: '01', title: 'Choose a Plan', description: 'Select the plan that fits your needs', icon: Target },
					{ number: '02', title: 'Create Account', description: 'Sign up in less than 2 minutes', icon: Users },
					{ number: '03', title: 'Start Learning', description: 'Access thousands of courses', icon: BookOpen },
					{ number: '04', title: 'Earn Certificate', description: 'Complete courses and get certified', icon: Award }
				] as step, i}
					<div class="relative text-center animate-slide-in" class:opacity-100={contentVisible} style="animation-delay: {i * 0.1}s">
						{#if i < 3}
							<div class="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -z-10"></div>
						{/if}

						<div class="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-2xl font-bold mb-6 shadow-xl">
							<div class="absolute inset-0 bg-white dark:bg-slate-900 m-2 rounded-full flex items-center justify-center">
								<svelte:component this={step.icon} class="w-8 h-8 text-blue-500" />
							</div>
						</div>

						<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
							{step.title}
						</h3>
						<p class="text-gray-600 dark:text-gray-400">
							{step.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<CTABannerComponent
		{...CTABannerConfig.startLearning}
		title="Ready to Get Started?"
		description="Join thousands of learners already mastering new skills. Choose your plan and start your learning journey today."></CTABannerComponent>
</div>

<style>
    @keyframes float-particle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-float-particle { animation: float-particle linear infinite; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; opacity: 0; }
    .animate-slide-in { animation: slide-in 0.8s ease-out forwards; opacity: 0; }
</style>