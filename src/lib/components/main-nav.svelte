<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import { mode, toggleMode } from "mode-watcher";
	import {
		LogIn,
		Sun,
		Moon,
		Menu,
		X,
		ChevronDown,
		Home,
		BookOpen,
		Info,
		HelpCircle,
		Shield,
		GraduationCap,
		Sparkles,
		Code,
		Palette,
		Database,
		Briefcase,
		Mail,
		Users,
		FileText,
		Target,
		TrendingUp,
		Award,
		Zap
	} from 'lucide-svelte';

	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/Auth.svelte.js';
	import { goto } from '$app/navigation';
	import { getMenuConfigForRole } from '$lib/Config/UserMenuConfig';
	import UserMenu from '$lib/components/UI/UserMenu.svelte';
	import { ROUTES } from '$lib/Config/routes.config';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let currentMode = mode.current;

	// Store derived values
	let publishedLegalTopics = $derived(legalTopicStore.publishedTopics);
	let loadingTopics = $derived(legalTopicStore.loadingSummaries);

	// Auth state
	let isAuthenticated = $derived(authStore.isAuthenticated);
	let user = $derived(authStore.user);
	let menuConfig = $derived(getMenuConfigForRole(user?.role))
	let isLoading = $derived(authStore.isLoading);

	// UI state
	let stationMenuOpen = $state(false);
	let aboutMenuOpen = $state(false);
	let mobileMenuOpen = $state(false);
	let isScrolled = $state(false);

	// Featured course categories
	interface CourseCategory {
		id: string;
		name: string;
		icon: any;
		description: string;
		courseCount: number;
		color: string;
		href: string;
	}

	const featuredCategories: CourseCategory[] = [
		{
			id: '1',
			name: 'Web Development',
			icon: Code,
			description: 'Master modern web technologies',
			courseCount: 42,
			color: 'from-blue-500 to-cyan-500',
			href: '/courses/web-development'
		},
		{
			id: '2',
			name: 'Design & UX',
			icon: Palette,
			description: 'Create stunning experiences',
			courseCount: 28,
			color: 'from-purple-500 to-pink-500',
			href: '/courses/design'
		},
		{
			id: '3',
			name: 'Data Science',
			icon: Database,
			description: 'Analyze and visualize data',
			courseCount: 35,
			color: 'from-emerald-500 to-teal-500',
			href: '/courses/data-science'
		},
		{
			id: '4',
			name: 'Business',
			icon: Briefcase,
			description: 'Develop leadership skills',
			courseCount: 31,
			color: 'from-orange-500 to-red-500',
			href: '/courses/business'
		}
	];

	// Stats for station mega menu
	const stationStats = [
		{ label: 'Active Learners', value: '50K+', icon: Users },
		{ label: 'Expert Courses', value: '200+', icon: Award },
		{ label: 'Success Rate', value: '94%', icon: TrendingUp }
	];

	// About menu items
	const aboutMenuItems = [
		{
			label: 'About Us',
			href: '/about-us',
			icon: Info,
			description: 'Learn about our mission and values'
		},
		{
			label: 'Contact',
			href: '/contact-us',
			icon: Mail,
			description: 'Get in touch with our team'
		},
		{
			label: 'Services',
			href: '/services',
			icon: Briefcase,
			description: 'Explore our service offerings'
		},
	];

	// User initials
	let userInitials = $derived(() => {
		if (!user) return '';
		if (user.firstName && user.lastName) {
			return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
		}
		return user.email?.[0]?.toUpperCase() || '';
	});

	// Debug logging
	$effect(() => {
		console.log('[NAVBAR] Auth state:', {
			isAuthenticated,
			hasUser: !!user,
			userEmail: user?.email
		});
	});

	// Handle scroll
	$effect(() => {
		const handleScroll = () => {
			isScrolled = window.scrollY > 20;
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll);
			return () => window.removeEventListener('scroll', handleScroll);
		}
	});

	// Close dropdowns when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.nav-dropdown')) {
			stationMenuOpen = false;
			aboutMenuOpen = false;
		}
	}

	onMount(() => {
		const initializeAuth = async () => {
			if (!authStore.isInitialized) {
				await authStore.initialize();
			}
			await legalTopicStore.fetchPublishedTopics();
		};

		initializeAuth();
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function handleToggle() {
		toggleMode();
		currentMode = mode.current;
	}

	async function handleLogout() {
		await authStore.logout();
		goto('/');
	}

	function handleLogin() {
		goto('/auth/login');
	}

	function navigate(path: string) {
		stationMenuOpen = false;
		aboutMenuOpen = false;
		mobileMenuOpen = false;
		goto(path);
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
		document.body.style.overflow = '';
	}
</script>

<svelte:window onclick={handleClickOutside} />

<!-- Main Navigation -->
<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {isScrolled
	? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-slate-800'
	: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800/50'}">

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16 md:h-20">

			<!-- Logo -->
			<button onclick={() => navigate(ROUTES.PUBLIC.HOME)} class="flex items-center gap-3 group">
				<span class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
					AEVI Do More
				</span>
			</button>

			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center gap-1">

				<!-- Home -->
				<button
					onclick={() => navigate(ROUTES.PUBLIC.HOME)}
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
				>
					<Home class="w-4 h-4" />
					Home
				</button>

				<!-- Station Mega Menu -->
				<div class="nav-dropdown relative">
					<button
						onclick={() => { stationMenuOpen = !stationMenuOpen; aboutMenuOpen = false; }}
						class="flex items-center gap-1 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
					>
						<BookOpen class="w-4 h-4" />
						Station
						<ChevronDown class="w-4 h-4 transition-transform {stationMenuOpen ? 'rotate-180' : ''}" />
					</button>

					{#if stationMenuOpen}
						<div
							class="absolute left-1/2 -translate-x-1/2 mt-2 w-screen max-w-5xl"
							transition:fly={{ y: -10, duration: 200, easing: quintOut }}
						>
							<div class="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
								<div class="p-8">
									<!-- Header -->
									<div class="flex items-center justify-between mb-8">
										<div>
											<h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
												<Sparkles class="w-6 h-6 text-blue-500" />
												Explore Station
											</h3>
											<p class="text-gray-600 dark:text-gray-400">
												Master in-demand skills with expert-led courses
											</p>
										</div>
										<button
											onclick={() => navigate('/courses')}
											class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
										>
											View All
										</button>
									</div>

									<!-- Featured Categories Grid -->
									<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
										{#each featuredCategories as category}
											<button
												onclick={() => navigate(category.href)}
												class="group p-5 rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:scale-105 text-left"
											>
												<div class="absolute inset-0 bg-gradient-to-br {category.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
												<div class="relative">
													<div class="w-12 h-12 rounded-xl bg-gradient-to-br {category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
														<svelte:component this={category.icon} class="w-6 h-6 text-white" />
													</div>
													<h4 class="font-bold text-gray-900 dark:text-white mb-2">
														{category.name}
													</h4>
													<p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
														{category.description}
													</p>
													<span class="text-xs font-semibold text-gray-500 dark:text-gray-400">
														{category.courseCount} courses
													</span>
												</div>
											</button>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- About Dropdown -->
				<div class="nav-dropdown relative">
					<button
						onclick={() => { aboutMenuOpen = !aboutMenuOpen; stationMenuOpen = false; }}
						class="flex items-center gap-1 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
					>
						<Info class="w-4 h-4" />
						About Us
						<ChevronDown class="w-4 h-4 transition-transform {aboutMenuOpen ? 'rotate-180' : ''}" />
					</button>

					{#if aboutMenuOpen}
						<div
							class="absolute left-0 mt-2 w-80"
							transition:fly={{ y: -10, duration: 200, easing: quintOut }}
						>
							<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
								<div class="p-2">
									{#each aboutMenuItems as item}
										<button
											onclick={() => navigate(item.href)}
											class="group flex items-start gap-4 w-full p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 text-left"
										>
											<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
												<svelte:component this={item.icon} class="w-5 h-5 text-white" />
											</div>
											<div class="flex-1">
												<div class="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
													{item.label}
												</div>
												<p class="text-xs text-gray-600 dark:text-gray-400">
													{item.description}
												</p>
											</div>
										</button>
									{/each}

									<!-- Legal Topics Section -->
									{#if !loadingTopics && publishedLegalTopics.length > 0}
										<div class="my-2 border-t border-gray-200 dark:border-slate-700"></div>
										<div class="px-4 py-2">
											<p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
												<FileText class="w-3 h-3" />
												Legal Documents
											</p>
										</div>
										{#each publishedLegalTopics.slice(0, 3) as topic (topic.id)}
											<button
												onclick={() => navigate(`/legal/${topic.id}`)}
												class="group flex items-start gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 text-left"
											>
												<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white group-hover:scale-110 transition-transform">
													<FileText class="w-4 h-4" />
												</div>
												<div class="flex-1 min-w-0">
													<div class="font-medium text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
														{topic.name}
													</div>
													{#if topic.subtitle}
														<p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
															{topic.subtitle}
														</p>
													{/if}
												</div>
											</button>
										{/each}
										{#if publishedLegalTopics.length > 3}
											<button
												onclick={() => navigate('/legal')}
												class="w-full px-4 py-2 mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
											>
												View All Legal Documents →
											</button>
										{/if}
									{/if}
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Support -->
				<button
					onclick={() => navigate(ROUTES.PUBLIC.SUPPORT)}
					class="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
				>
					<HelpCircle class="w-4 h-4" />
					Support
				</button>

				<!-- Admin (only for admins) -->
				{#if isAuthenticated && (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN')}
					<button
						onclick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
						class="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 font-medium"
					>
						<Shield class="w-4 h-4" />
						Admin
					</button>
				{/if}
			</div>

			<!-- Right Section -->
			<div class="flex items-center gap-3">
				<!-- Theme Toggle -->
				<button
					onclick={handleToggle}
					class="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200"
				>
					<Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700" />
					<Moon class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300" />
					<span class="sr-only">Toggle theme</span>
				</button>

				<!-- Auth Button -->
				{#if isLoading}
					<div class="hidden lg:flex items-center justify-center w-10 h-10">
						<div class="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
					</div>
				{:else if isAuthenticated && user && menuConfig}
					<div class="hidden lg:block">
						<UserMenu
							actions={menuConfig.actions}
							variant="navbar"
							dropdownPosition="bottom"
						/>
					</div>
				{:else}
					<button
						onclick={handleLogin}
						class="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
					>
						<LogIn class="w-4 h-4" />
						Login
					</button>
				{/if}

				<!-- Mobile Menu Button -->
				<button
					onclick={toggleMobileMenu}
					class="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<X class="w-6 h-6 text-gray-700 dark:text-gray-300" />
					{:else}
						<Menu class="w-6 h-6 text-gray-700 dark:text-gray-300" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div
			class="lg:hidden border-t border-gray-200 dark:border-slate-800"
			transition:fly={{ y: -20, duration: 300, easing: quintOut }}
		>
			<div class="max-h-[calc(100vh-5rem)] overflow-y-auto bg-white dark:bg-slate-900">
				<div class="px-4 py-6 space-y-2">

					<!-- User Info (if logged in) -->
					{#if isAuthenticated && user}
						<div class="px-4 py-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
							<div class="flex items-center gap-3">
								<div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">
									{userInitials()}
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
										{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
									</p>
									<p class="text-xs text-gray-600 dark:text-gray-400 truncate">{user?.email}</p>
								</div>
							</div>
						</div>
					{/if}

					<!-- Home -->
					<button
						onclick={() => navigate(ROUTES.PUBLIC.HOME)}
						class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 text-left"
					>
						<Home class="w-5 h-5 text-gray-600 dark:text-gray-400" />
						<span class="font-medium text-gray-900 dark:text-white">Home</span>
					</button>

					<!-- Station Section -->
					<div class="space-y-2">
						<div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							Station Categories
						</div>
						{#each featuredCategories as category}
							<button
								onclick={() => navigate(category.href)}
								class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 text-left"
							>
								<div class="w-10 h-10 rounded-lg bg-gradient-to-br {category.color} flex items-center justify-center">
									<svelte:component this={category.icon} class="w-5 h-5 text-white" />
								</div>
								<div class="flex-1">
									<div class="font-semibold text-gray-900 dark:text-white text-sm">
										{category.name}
									</div>
									<div class="text-xs text-gray-600 dark:text-gray-400">
										{category.courseCount} courses
									</div>
								</div>
							</button>
						{/each}
					</div>

					<!-- About Section -->
					<div class="space-y-2 pt-4">
						<div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
							About Us
						</div>
						{#each aboutMenuItems as item}
							<button
								onclick={() => navigate(item.href)}
								class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 text-left"
							>
								<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
									<svelte:component this={item.icon} class="w-5 h-5 text-white" />
								</div>
								<div class="flex-1">
									<div class="font-semibold text-gray-900 dark:text-white text-sm">
										{item.label}
									</div>
									<div class="text-xs text-gray-600 dark:text-gray-400">
										{item.description}
									</div>
								</div>
							</button>
						{/each}
					</div>

					<!-- Legal Topics -->
					{#if !loadingTopics && publishedLegalTopics.length > 0}
						<div class="space-y-2 pt-4">
							<div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
								<FileText class="w-3 h-3" />
								Legal Documents
							</div>
							{#each publishedLegalTopics.slice(0, 3) as topic (topic.id)}
								<button
									onclick={() => navigate(`/legal/${topic.id}`)}
									class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 text-left"
								>
									<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
										<FileText class="w-5 h-5 text-white" />
									</div>
									<div class="flex-1 min-w-0">
										<div class="font-medium text-sm text-gray-900 dark:text-white truncate">
											{topic.name}
										</div>
										{#if topic.subtitle}
											<p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
												{topic.subtitle}
											</p>
										{/if}
									</div>
								</button>
							{/each}
						</div>
					{/if}

					<!-- Support -->
					<button
						onclick={() => navigate(ROUTES.PUBLIC.SUPPORT)}
						class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 text-left"
					>
						<HelpCircle class="w-5 h-5 text-gray-600 dark:text-gray-400" />
						<span class="font-medium text-gray-900 dark:text-white">Support</span>
					</button>

					<!-- Admin -->
					{#if isAuthenticated && (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN')}
						<button
							onclick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
							class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 text-left"
						>
							<Shield class="w-5 h-5 text-gray-600 dark:text-gray-400" />
							<span class="font-medium text-gray-900 dark:text-white">Admin</span>
						</button>
					{/if}

					<!-- Divider -->
					<div class="my-4 border-t border-gray-200 dark:border-slate-800"></div>

					<!-- Theme Toggle -->
					<button
						onclick={handleToggle}
						class="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 text-left"
					>
						<div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
							<Sun class="h-5 w-5 rotate-0 scale-100 dark:scale-0 text-gray-700" />
							<Moon class="absolute h-5 w-5 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-gray-300" />
						</div>
						<span class="font-medium text-gray-900 dark:text-white">Toggle Theme</span>
					</button>

					<!-- Auth Actions -->
					{#if isAuthenticated && user && menuConfig}
						<div class="pt-2">
							<UserMenu
								actions={menuConfig.actions}
								variant="navbar"
								dropdownPosition="bottom"
							/>
						</div>
					{:else}
						<button
							onclick={handleLogin}
							class="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 mt-4"
						>
							<LogIn class="w-4 h-4" />
							Login
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</nav>

<!-- Spacer to prevent content from being hidden under fixed navbar -->
<div class="h-16 md:h-20"></div>