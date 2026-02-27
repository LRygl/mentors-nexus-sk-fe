<script lang="ts">
	import { mode, toggleMode } from 'mode-watcher';
	import {
		LogIn,
		Sun,
		Moon,
		Menu,
		X,
		ChevronDown,
		HelpCircle,
		Shield,
		Mail,
		Info,
		Briefcase,
		FileText,
		Zap,
		Activity,
		Layers,
		Building2,
		ArrowRight,
		ShoppingCart
	} from 'lucide-svelte';

	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { authStore } from '$lib/stores/Auth.svelte.js';
	import { goto } from '$app/navigation';
	import { getMenuConfigForRole } from '$lib/Config/UserMenuConfig';
	import UserMenu from '$lib/components/UI/UserMenu.svelte';
	import { ROUTES } from '$lib/Config/routes.config';
	import { legalTopicStore } from '$lib/stores/defaults/LegalTopicStore.svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import CartIcon from '$lib/components/UI/CartIcon.svelte';
	import { cartStore } from '$lib/stores/Cart.svelte';
	import { cartService } from '$lib/Services/CartService.svelte';

	// ── Store & auth state ────────────────────────────────────────────────────
	let publishedLegalTopics = $derived(legalTopicStore.publishedTopics);
	let loadingTopics = $derived(legalTopicStore.loadingSummaries);
	let isAuthenticated = $derived(authStore.isAuthenticated);
	let user = $derived(authStore.user);
	let menuConfig = $derived(getMenuConfigForRole(user?.role));
	let isLoading = $derived(authStore.isLoading);

	// ── UI state ──────────────────────────────────────────────────────────────
	let stationMenuOpen = $state(false);
	let aboutMenuOpen   = $state(false);
	let mobileMenuOpen  = $state(false);
	let isScrolled      = $state(false);

	// ── Course categories (link to store with pre-applied filter) ─────────────
	const courseCategories = [
		{
			id: 'ev',
			name: 'EV Technology',
			icon: Zap,
			courseCount: 42,
			dotClass: 'bg-blue-500',
			hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
			href: `${ROUTES.PUBLIC.STORE}?category=EV+Technology`,
		},
		{
			id: 'grid',
			name: 'Smart Grid',
			icon: Activity,
			courseCount: 28,
			dotClass: 'bg-indigo-500',
			hoverText: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
			href: `${ROUTES.PUBLIC.STORE}?category=Smart+Grid`,
		},
		{
			id: 'renewable',
			name: 'Renewable Energy',
			icon: Sun,
			courseCount: 35,
			dotClass: 'bg-emerald-500',
			hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
			href: `${ROUTES.PUBLIC.STORE}?category=Renewable+Energy`,
		},
		{
			id: 'battery',
			name: 'Battery Systems',
			icon: Layers,
			courseCount: 31,
			dotClass: 'bg-violet-500',
			hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
			href: `${ROUTES.PUBLIC.STORE}?category=Battery+Systems`,
		},
		{
			id: 'infra',
			name: 'Infrastructure',
			icon: Building2,
			courseCount: 18,
			dotClass: 'bg-slate-400',
			hoverText: 'group-hover:text-slate-600 dark:group-hover:text-slate-300',
			href: `${ROUTES.PUBLIC.STORE}?category=Infrastructure`,
		},
	];

	// ── Skill levels (link to store with pre-applied level filter) ────────────
	const skillLevels = [
		{
			label: 'Beginner',
			value: 'Beginner',
			dotClass: 'bg-emerald-500',
			hoverText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
		},
		{
			label: 'Intermediate',
			value: 'Intermediate',
			dotClass: 'bg-blue-500',
			hoverText: 'group-hover:text-blue-600 dark:group-hover:text-blue-400',
		},
		{
			label: 'Advanced',
			value: 'Advanced',
			dotClass: 'bg-violet-500',
			hoverText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
		},
		{
			label: 'Expert',
			value: 'Expert',
			dotClass: 'bg-rose-500',
			hoverText: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
		},
	];

	// ── About menu items ──────────────────────────────────────────────────────
	const aboutMenuItems = [
		{ label: 'About Us',   href: '/about-us',    icon: Info,     description: 'Our mission and team' },
		{ label: 'Contact',    href: '/contact-us',  icon: Mail,     description: 'Get in touch' },
		{ label: 'Services',   href: '/services',    icon: Briefcase,description: 'What we offer' },
	];

	// ── Active route helper ───────────────────────────────────────────────────
	function isActive(path: string): boolean {
		return path === '/'
			? page.url.pathname === '/'
			: page.url.pathname.startsWith(path);
	}

	// ── User initials ─────────────────────────────────────────────────────────
	let userInitials = $derived(() => {
		if (!user) return '';
		if (user.firstName && user.lastName)
			return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
		return user.email?.[0]?.toUpperCase() || '';
	});

	// ── Scroll detection ──────────────────────────────────────────────────────
	$effect(() => {
		const handleScroll = () => { isScrolled = window.scrollY > 8; };
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll, { passive: true });
			return () => window.removeEventListener('scroll', handleScroll);
		}
	});

	// ── Init ──────────────────────────────────────────────────────────────────
	onMount(() => {
		const init = async () => {
			if (!authStore.isInitialized) await authStore.initialize();
			await legalTopicStore.fetchPublishedTopics();
		};
		init();
		cartStore.initialize();
	});

	// ── Helpers ───────────────────────────────────────────────────────────────
	function handleToggle() { toggleMode(); }

	async function handleLogout() {
		await authStore.logout();
		goto('/');
	}

	function navigate(path: string) {
		stationMenuOpen = false;
		aboutMenuOpen   = false;
		mobileMenuOpen  = false;
		document.body.style.overflow = '';
		goto(path);
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
		document.body.style.overflow = '';
	}

	// Close dropdowns on outside click
	function handleClickOutside(e: MouseEvent) {
		if (!(e.target as HTMLElement).closest('.nav-dropdown')) {
			stationMenuOpen = false;
			aboutMenuOpen   = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<svelte:window onclick={handleClickOutside} />

<!-- ═══════════════════════════════════════════════════════════════════════════
     NAV BAR
     ═══════════════════════════════════════════════════════════════════════ -->
<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-200
            {isScrolled
              ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-gray-200/80 dark:border-slate-800'
              : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100/60 dark:border-slate-800/40'}">

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between h-16">

			<!-- ── Logo ──────────────────────────────────────────────────────── -->
			<button
				onclick={() => navigate(ROUTES.PUBLIC.HOME)}
				class="flex items-center gap-2.5 group flex-shrink-0"
				aria-label="Go home"
			>
				<div class="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
					<Zap class="w-4 h-4 text-white" />
				</div>
				<span class="text-sm font-bold text-gray-900 dark:text-white tracking-tight hidden sm:block">
					AEVI Do More
				</span>
			</button>

			<!-- ── Desktop Navigation ─────────────────────────────────────────── -->
			<div class="hidden lg:flex items-center gap-0.5">

				<!-- Home -->
				<button
					onclick={() => navigate(ROUTES.PUBLIC.HOME)}
					class="relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150
					       {isActive('/') && page.url.pathname === '/'
					         ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
					         : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60'}"
				>
					Home
				</button>

				<!-- Station (mega-ish dropdown) -->
				<div class="nav-dropdown relative">
					<button
						onclick={() => { stationMenuOpen = !stationMenuOpen; aboutMenuOpen = false; }}
						class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150
						       {isActive(ROUTES.PUBLIC.STORE)
						         ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
						         : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60'}"
					>
						Station
						<ChevronDown class="w-3.5 h-3.5 transition-transform duration-200 {stationMenuOpen ? 'rotate-180' : ''}" />
					</button>

					{#if stationMenuOpen}
						<div
							class="absolute left-0 mt-1.5 w-[460px]"
							transition:fly={{ y: -6, duration: 150, easing: quintOut }}
						>
							<div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-xl shadow-black/8 dark:shadow-black/30 overflow-hidden">

								<div class="grid grid-cols-2 divide-x divide-gray-100 dark:divide-slate-700/60">

									<!-- Left: Categories -->
									<div class="p-4">
										<p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
											Browse by Category
										</p>
										{#each courseCategories as cat}
											<button
												onclick={() => navigate(cat.href)}
												class="group flex items-center gap-3 w-full px-2 py-2 rounded-xl
												       hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-100 text-left"
											>
												<div class="w-6 h-6 rounded-md {cat.dotClass} flex items-center justify-center flex-shrink-0 opacity-90">
													<svelte:component this={cat.icon} class="w-3.5 h-3.5 text-white" />
												</div>
												<span class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300
												             group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
													{cat.name}
												</span>
												<span class="text-xs tabular-nums text-gray-400 dark:text-slate-500 group-hover:text-gray-500 dark:group-hover:text-slate-400">
													{cat.courseCount}
												</span>
												<ArrowRight class="w-3 h-3 text-gray-300 dark:text-slate-600 opacity-0 -translate-x-1
												                   group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-400
												                   transition-all duration-150 flex-shrink-0" />
											</button>
										{/each}
									</div>

									<!-- Right: Skill Levels -->
									<div class="p-4 flex flex-col">
										<p class="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
											Filter by Level
										</p>
										{#each skillLevels as level}
											<button
												onclick={() => navigate(`${ROUTES.PUBLIC.STORE}?level=${level.value}`)}
												class="group flex items-center gap-2.5 w-full px-2 py-2 rounded-xl
												       hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-100 text-left"
											>
												<span class="w-2 h-2 rounded-full {level.dotClass} flex-shrink-0"></span>
												<span class="text-sm font-medium text-gray-600 dark:text-gray-400
												             group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
													{level.label}
												</span>
											</button>
										{/each}

										<!-- Spacer + Browse all CTA -->
										<div class="mt-auto pt-4 border-t border-gray-100 dark:border-slate-700/60">
											<button
												onclick={() => navigate(ROUTES.PUBLIC.STORE)}
												class="group flex items-center justify-between w-full px-2 py-2 rounded-xl
												       text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40
												       transition-colors duration-100 text-left"
											>
												<span class="text-sm font-semibold">Browse all courses</span>
												<ArrowRight class="w-4 h-4 -translate-x-0.5 group-hover:translate-x-0.5 transition-transform duration-150" />
											</button>
										</div>
									</div>
								</div>

							</div>
						</div>
					{/if}
				</div>

				<!-- About Us dropdown -->
				<div class="nav-dropdown relative">
					<button
						onclick={() => { aboutMenuOpen = !aboutMenuOpen; stationMenuOpen = false; }}
						class="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150
						       {isActive('/about-us') || isActive('/contact') || isActive('/services')
						         ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
						         : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60'}"
					>
						About Us
						<ChevronDown class="w-3.5 h-3.5 transition-transform duration-200 {aboutMenuOpen ? 'rotate-180' : ''}" />
					</button>

					{#if aboutMenuOpen}
						<div
							class="absolute left-0 mt-1.5 w-64"
							transition:fly={{ y: -6, duration: 150, easing: quintOut }}
						>
							<div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-700/80 shadow-xl shadow-black/8 dark:shadow-black/30 overflow-hidden p-2">

								<!-- Main links -->
								{#each aboutMenuItems as item}
									<button
										onclick={() => navigate(item.href)}
										class="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
										       hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-100 text-left"
									>
										<div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0
										            group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/60 transition-colors">
											<svelte:component this={item.icon} class="w-3.5 h-3.5 text-gray-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
										</div>
										<div class="flex-1 min-w-0">
											<p class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
												{item.label}
											</p>
											<p class="text-xs text-gray-400 dark:text-slate-500">{item.description}</p>
										</div>
									</button>
								{/each}

								<!-- Legal section -->
								{#if !loadingTopics && publishedLegalTopics.length > 0}
									<div class="my-1.5 border-t border-gray-100 dark:border-slate-700/60"></div>
									<div class="px-3 py-1.5">
										<p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
											<FileText class="w-3 h-3" />
											Legal
										</p>
									</div>
									{#each publishedLegalTopics.slice(0, 4) as topic (topic.id)}
										<button
											onclick={() => navigate(`/legal/${topic.id}`)}
											class="group flex items-center gap-3 w-full px-3 py-2 rounded-xl
											       hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors duration-100 text-left"
										>
											<div class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-600 flex-shrink-0 group-hover:bg-indigo-400 transition-colors"></div>
											<span class="flex-1 min-w-0 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white truncate transition-colors">
												{topic.name}
											</span>
										</button>
									{/each}
									{#if publishedLegalTopics.length > 4}
										<button
											onclick={() => navigate('/legal')}
											class="w-full px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400
											       hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors text-left"
										>
											View all →
										</button>
									{/if}
								{/if}

							</div>
						</div>
					{/if}
				</div>

				<!-- Support -->
				<button
					onclick={() => navigate(ROUTES.PUBLIC.SUPPORT)}
					class="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150
					       {isActive(ROUTES.PUBLIC.SUPPORT)
					         ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
					         : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60'}"
				>
					Support
				</button>

				<!-- Admin (role-gated) -->
				{#if isAuthenticated && (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN')}
					<button
						onclick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
						class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150
						       {isActive(ROUTES.ADMIN.DASHBOARD)
						         ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
						         : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-slate-800/60'}"
					>
						<Shield class="w-3.5 h-3.5" />
						Admin
					</button>
				{/if}

			</div>

			<!-- ── Right section ──────────────────────────────────────────────── -->
			<div class="flex items-center gap-1.5">

				<!-- Utility group: Cart + Theme toggle -->
				<div class="hidden lg:flex items-center gap-1">
					<!-- Cart -->
					<CartIcon />

					<!-- Theme toggle -->
					<button
						onclick={handleToggle}
						class="flex items-center justify-center w-9 h-9 rounded-xl
						       text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100
						       hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors duration-150"
						aria-label="Toggle theme"
					>
						<Sun  class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
						<Moon class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					</button>
				</div>

				<!-- Separator -->
				<div class="hidden lg:block w-px h-5 bg-gray-200 dark:bg-slate-700 mx-1"></div>

				<!-- Auth -->
				{#if isLoading}
					<div class="hidden lg:flex items-center justify-center w-9 h-9">
						<div class="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
					</div>
				{:else if isAuthenticated && user && menuConfig}
					<div class="hidden lg:block">
						<UserMenu actions={menuConfig.actions} variant="navbar" dropdownPosition="bottom" />
					</div>
				{:else}
					<button
						onclick={() => goto(ROUTES.PUBLIC.LOGIN)}
						class="hidden lg:flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
						       bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl
						       shadow-sm shadow-indigo-500/25 transition-all duration-150 hover:-translate-y-px"
					>
						<LogIn class="w-3.5 h-3.5" />
						Login
					</button>
				{/if}

				<!-- Mobile hamburger -->
				<button
					onclick={toggleMobileMenu}
					class="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl
					       text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
					       hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
					aria-label="Toggle menu"
				>
					{#if mobileMenuOpen}
						<X class="w-5 h-5" />
					{:else}
						<Menu class="w-5 h-5" />
					{/if}
				</button>
			</div>

		</div>
	</div>

	<!-- ═══════════════════════════════════════════════════════════════════════
	     MOBILE MENU
	     ═════════════════════════════════════════════════════════════════════ -->
	{#if mobileMenuOpen}
		<div
			class="lg:hidden border-t border-gray-100 dark:border-slate-800"
			transition:fly={{ y: -10, duration: 200, easing: quintOut }}
		>
			<div class="max-h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-slate-950">
				<div class="px-4 py-5 space-y-5">

					<!-- User card -->
					{#if isAuthenticated && user}
						<div class="flex items-center gap-3 px-3 py-3 rounded-2xl
						            bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
							<div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600
							            text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
								{userInitials()}
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
									{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
								</p>
								<p class="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
							</div>
						</div>
					{/if}

					<!-- Primary links -->
					<div class="space-y-0.5">
						{#each [
							{ label: 'Home', path: ROUTES.PUBLIC.HOME },
							{ label: 'Support', path: ROUTES.PUBLIC.SUPPORT },
						] as link}
							<button
								onclick={() => navigate(link.path)}
								class="flex items-center w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
								       {isActive(link.path)
								         ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40'
								         : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60'}"
							>
								{link.label}
							</button>
						{/each}
						{#if isAuthenticated && (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN')}
							<button
								onclick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
								class="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium
								       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
							>
								<Shield class="w-4 h-4 text-gray-400" />
								Admin
							</button>
						{/if}
					</div>

					<!-- Station: categories -->
					<div>
						<p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
							Courses by Category
						</p>
						<div class="grid grid-cols-2 gap-1.5">
							{#each courseCategories as cat}
								<button
									onclick={() => navigate(cat.href)}
									class="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-slate-800
									       hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20
									       transition-all duration-150 text-left"
								>
									<div class="w-5 h-5 rounded-md {cat.dotClass} flex items-center justify-center flex-shrink-0 opacity-90">
										<svelte:component this={cat.icon} class="w-3 h-3 text-white" />
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{cat.name}</p>
										<p class="text-[10px] text-gray-400 dark:text-slate-500">{cat.courseCount} courses</p>
									</div>
								</button>
							{/each}
							<!-- Browse all tile -->
							<button
								onclick={() => navigate(ROUTES.PUBLIC.STORE)}
								class="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
								       bg-indigo-600 hover:bg-indigo-500 transition-colors col-span-2 text-left"
							>
								<span class="text-xs font-semibold text-white">Browse all courses</span>
								<ArrowRight class="w-3.5 h-3.5 text-white/80" />
							</button>
						</div>
					</div>

					<!-- Station: skill levels -->
					<div>
						<p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
							Filter by Level
						</p>
						<div class="grid grid-cols-4 gap-1.5">
							{#each skillLevels as level}
								<button
									onclick={() => navigate(`${ROUTES.PUBLIC.STORE}?level=${level.value}`)}
									class="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border border-gray-100 dark:border-slate-800
									       hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20
									       transition-all duration-150 text-center"
								>
									<span class="w-1.5 h-1.5 rounded-full {level.dotClass} flex-shrink-0"></span>
									<span class="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{level.label}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- About section -->
					<div>
						<p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
							About
						</p>
						<div class="space-y-0.5">
							{#each aboutMenuItems as item}
								<button
									onclick={() => navigate(item.href)}
									class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
									       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left"
								>
									<svelte:component this={item.icon} class="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
									<span class="text-sm font-medium">{item.label}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Legal (mobile) -->
					{#if !loadingTopics && publishedLegalTopics.length > 0}
						<div>
							<p class="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
								<FileText class="w-3 h-3" /> Legal
							</p>
							<div class="space-y-0.5">
								{#each publishedLegalTopics.slice(0, 3) as topic (topic.id)}
									<button
										onclick={() => navigate(`/legal/${topic.id}`)}
										class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
										       text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left"
									>
										<div class="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600 flex-shrink-0 mt-0.5"></div>
										<span class="text-sm truncate">{topic.name}</span>
									</button>
								{/each}
							</div>
						</div>
					{/if}

					<div class="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-1">

						<!-- Cart (mobile) -->
						<button
							onclick={() => { closeMobileMenu(); cartService.goToCheckout(); }}
							class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
							       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left"
						>
							<ShoppingCart class="w-4 h-4 text-gray-400 dark:text-slate-500" />
							<span class="text-sm font-medium">
								Cart
								{#if cartStore.itemCount > 0}
									<span class="ml-1 text-xs font-bold text-indigo-500">({cartStore.itemCount})</span>
								{/if}
							</span>
						</button>

						<!-- Theme toggle (mobile) -->
						<button
							onclick={handleToggle}
							class="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl
							       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors text-left"
						>
							<Sun  class="w-4 h-4 text-gray-400 dark:scale-0 dark:hidden" />
							<Moon class="w-4 h-4 text-gray-400 hidden dark:block" />
							<span class="text-sm font-medium">Toggle Theme</span>
						</button>

						<!-- Auth (mobile) -->
						{#if isAuthenticated && user && menuConfig}
							<div class="pt-1">
								<UserMenu actions={menuConfig.actions} variant="navbar" dropdownPosition="bottom" />
							</div>
						{:else}
							<button
								onclick={() => goto(ROUTES.PUBLIC.LOGIN)}
								class="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl
								       bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold
								       transition-colors mt-2"
							>
								<LogIn class="w-4 h-4" />
								Login
							</button>
						{/if}

					</div>

				</div>
			</div>
		</div>
	{/if}

</nav>

<!-- Spacer to offset fixed nav height -->
<div class="h-16"></div>
