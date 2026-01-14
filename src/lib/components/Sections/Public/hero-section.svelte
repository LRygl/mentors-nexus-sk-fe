<!-- Modern LMS Hero Section -->
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Play, Users, Award, TrendingUp, Zap, BookOpen, Star, X, Linkedin, Facebook, Youtube, Instagram } from 'lucide-svelte';

	let statsVisible = false;
	let heroImageLoaded = false;

	// Animated stats
	let stats = [
		{ value: '50,000+', label: 'Active Learners', icon: Users },
		{ value: '1,200+', label: 'Expert Courses', icon: BookOpen },
		{ value: '98%', label: 'Success Rate', icon: Award },
		{ value: '4.9/5', label: 'Rating', icon: Star }
	];

	// Social media links
	let socialLinks = [
		{ icon: X, href: '#', label: 'X (Twitter)', color: 'hover:text-gray-300' },
		{ icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
		{ icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
		{ icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
		{ icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' }
	];

	// Simulate loading and animations
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/Config/routes.config';
	import { goto } from '$app/navigation';

	onMount(() => {
		setTimeout(() => {
			statsVisible = true;
			heroImageLoaded = true;
		}, 500);
	});
</script>

<section class="relative w-screen overflow-hidden flex items-center">
	<!-- Advanced Gradient Background -->
	<div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

	<!-- Animated Mesh Gradient Overlay -->
	<div class="absolute inset-0 opacity-70">
		<div class="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-purple-600/20 to-cyan-500/30"></div>
		<div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
		<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl animate-float"></div>
	</div>

	<!-- Floating Particles -->
	<div class="absolute inset-0 overflow-hidden">
		{#each Array(20) as _, i}
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

	<div class="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-24">
		<div class="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

			<!-- Left Content -->
			<div class="lg:col-span-7 space-y-8">

				<!-- Badge -->
				<div class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-full text-white/90 text-sm font-medium animate-fade-in">
					<Zap class="w-4 h-4 text-yellow-400" />
					<span>Transform Your Career with AI-Powered Learning</span>
				</div>

				<!-- Main Headline -->
				<div class="space-y-6 animate-slide-up">
					<h1 class="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9]">
						<span class="text-white drop-shadow-2xl">Master</span>
						<br>
						<span class="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              Tomorrow's
            </span>
						<br>
						<span class="text-white drop-shadow-2xl">Skills</span>
						<span class="text-yellow-400">.</span>
					</h1>

					<p class="text-xl lg:text-2xl text-blue-100 font-light leading-relaxed max-w-2xl">
						Join the future of professional learning with our AI-driven platform.
						<span class="text-white font-medium">Master in-demand skills</span> through
						interactive courses designed by industry experts.
					</p>
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style="animation-delay: 0.3s">
					<Button class="group relative px-8 py-4 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 overflow-hidden">
						<div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						<span class="relative flex items-center gap-2">
              <Play class="w-5 h-5" />
              Start Learning Today
            </span>
					</Button>

					<Button onclick={()=> goto(ROUTES.PUBLIC.STORE)} class="group px-8 py-4 h-auto bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 hover:border-white/40 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-105">
            <span class="flex items-center gap-2">
              Explore Courses
              <TrendingUp class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
					</Button>
				</div>

				<!-- Social Icons -->
				<div class="flex items-center gap-1 animate-fade-in-up" style="animation-delay: 0.4s">
					<span class="text-blue-200 text-sm font-medium mr-4">Follow us:</span>
					{#each socialLinks as social, i}
						<a
							href={social.href}
							aria-label={social.label}
							class="group relative w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-2xl flex items-center justify-center text-white/70 {social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg animate-social-pop"
							style="animation-delay: {0.6 + i * 0.1}s"
						>
							<svelte:component this={social.icon} class="w-5 h-5 transition-transform group-hover:scale-110" />

							<!-- Glow effect on hover -->
							<div class="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
						</a>
					{/each}
				</div>

				<!-- Stats Row -->
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 animate-fade-in-up" style="animation-delay: 0.5s">
					{#each stats as stat, i}
						<div class="text-center space-y-2" class:animate-counter={statsVisible} style="animation-delay: {i * 200}ms">
							<div class="flex items-center justify-center w-12 h-12 mx-auto bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 mb-2">
								<svelte:component this={stat.icon} class="w-6 h-6 text-blue-400" />
							</div>
							<div class="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
							<div class="text-sm text-blue-200 font-medium">{stat.label}</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right Content - Hero Visual -->
			<div class="lg:col-span-5 mt-16 lg:mt-0 relative">
				<div class="relative animate-float-slow">

					<!-- Main Hero Image/Dashboard -->
					<div class="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl" class:animate-slide-in-right={heroImageLoaded}>
						<div class="space-y-6">

							<!-- Header -->
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
										<BookOpen class="w-6 h-6 text-white" />
									</div>
									<div>
										<h3 class="text-white font-bold">Learning Dashboard</h3>
										<p class="text-blue-200 text-sm">Your Progress</p>
									</div>
								</div>
								<div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
							</div>

							<!-- Progress Cards -->
							<div class="space-y-4">
								{#each ['EV Infrastructure Mastery', 'Smart Grid Integration', 'Renewable Energy Systems'] as course, i}
									<div class="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 animate-slide-in" style="animation-delay: {1 + i * 0.2}s">
										<div class="flex items-center justify-between mb-3">
											<span class="text-white font-medium text-sm">{course}</span>
											<span class="text-blue-400 text-xs font-bold">{85 - i * 15}%</span>
										</div>
										<div class="w-full bg-white/10 rounded-full h-2">
											<div class="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-1000" style="width: {85 - i * 15}%"></div>
										</div>
									</div>
								{/each}
							</div>

							<!-- Achievement Badges -->
							<div class="flex gap-3 pt-4">
								{#each [Award, Star, TrendingUp] as Icon, i}
									<div class="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-xl rounded-xl border border-yellow-400/30 flex items-center justify-center animate-bounce" style="animation-delay: {1.5 + i * 0.1}s">
										<Icon class="w-5 h-5 text-yellow-400" />
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Floating Elements -->
					<div class="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center animate-float" style="animation-delay: 2s">
						<Zap class="w-8 h-8 text-yellow-400" />
					</div>

					<div class="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center animate-float" style="animation-delay: 2.5s">
						<Users class="w-10 h-10 text-blue-400" />
					</div>
				</div>
			</div>
		</div>
	</div>
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

    @keyframes slide-in-right {
        from { opacity: 0; transform: translateX(50px); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slide-in {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes counter {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @keyframes social-pop {
        from { opacity: 0; transform: translateY(20px) scale(0.8); }
        to { opacity: 1; transform: translateY(0) scale(1); }
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
    .animate-slide-in-right { animation: slide-in-right 1s ease-out forwards; opacity: 0; }
    .animate-slide-in { animation: slide-in 0.8s ease-out forwards; opacity: 0; }
    .animate-counter { animation: counter 0.8s ease-out forwards; }
    .animate-social-pop { animation: social-pop 0.6s ease-out forwards; opacity: 0; }
</style>