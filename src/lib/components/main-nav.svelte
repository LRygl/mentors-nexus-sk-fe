<script lang="ts">
	import { Button } from "$lib/components/ui/button/index";
	import { mode, toggleMode } from "mode-watcher";
	import {
		LogIn,
		LogOut,
		Sun,
		Moon,
		Menu,
		X,
		ChevronDown,
		User,
		Settings,
		Shield,
		Home,
		BookOpen,
		Info,
		HelpCircle,
	} from 'lucide-svelte';

	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/Auth.svelte.js';
	import { goto } from '$app/navigation';

	let currentMode = mode.current;

	// Reactive auth state using Svelte 5 runes
	let isAuthenticated = $derived(authStore.isAuthenticated);
	let user = $derived(authStore.user);
	let isLoading = $derived(authStore.isLoading);
	let userInitials = $derived(
		user ?
			`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() ||
			user.email?.[0]?.toUpperCase() || 'U'
			: 'U'
	);

	// Dropdown states
	let courseMenuOpen = $state(false);
	let aboutMenuOpen = $state(false);
	let userMenuOpen = $state(false);
	let mobileMenuOpen = $state(false);

	// Close dropdowns when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			courseMenuOpen = false;
			aboutMenuOpen = false;
			userMenuOpen = false;
		}
	}

	onMount(async () => {
		// Initialize auth
		if (!authStore.isInitialized) {
			await authStore.initialize();
		}

		// Add click outside listener
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
		userMenuOpen = false;
		await authStore.logout();
		goto('/');
	}

	function handleLogin() {
		goto('/auth/login');
	}

	function navigate(path: string) {
		courseMenuOpen = false;
		aboutMenuOpen = false;
		userMenuOpen = false;
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
</script>

<!-- Main Navigation -->
<nav class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">

			<!-- Logo -->
			<div class="flex items-center">
				<button onclick={() => navigate('/')} class="flex items-center gap-2 hover:opacity-80 transition-opacity">
					{#if currentMode === "dark"}
						<img src="/logo-light.png" alt="Logo" class="h-8 w-auto">
					{:else}
						<img src="/logo-dark.png" alt="Logo" class="h-8 w-auto"/>
					{/if}
				</button>
			</div>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-1">
				<!-- Home -->
				<button
					onclick={() => navigate('/')}
					class="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
				>
					Home
				</button>

				<!-- Course Dropdown -->
				<div class="relative dropdown-container">
					<button
						onclick={() => { courseMenuOpen = !courseMenuOpen; aboutMenuOpen = false; }}
						class="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
					>
						Course
						<ChevronDown class={`h-4 w-4 transition-transform ${courseMenuOpen ? 'rotate-180' : ''}`} />
					</button>

					{#if courseMenuOpen}
						<div class="absolute left-0 mt-2 w-80 origin-top-left rounded-lg border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
							<div class="p-4">
								<div class="grid gap-4">
									<!-- Featured Item -->
									<div class="space-y-2 p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
										<h3 class="text-sm font-semibold">Featured Course</h3>
										<p class="text-xs text-muted-foreground">
											Beautifully designed components built with Tailwind CSS.
										</p>
									</div>

									<!-- Menu Items -->
									<button
										onclick={() => navigate('/docs')}
										class="flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
									>
										<BookOpen class="h-5 w-5 mt-0.5 text-primary" />
										<div>
											<div class="text-sm font-medium">Introduction</div>
											<div class="text-xs text-muted-foreground">Get started with the basics</div>
										</div>
									</button>

									<button
										onclick={() => navigate('/docs/installation')}
										class="flex items-start gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
									>
										<BookOpen class="h-5 w-5 mt-0.5 text-primary" />
										<div>
											<div class="text-sm font-medium">Installation</div>
											<div class="text-xs text-muted-foreground">How to set up your project</div>
										</div>
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- About Dropdown -->
				<div class="relative dropdown-container">
					<button
						onclick={() => { aboutMenuOpen = !aboutMenuOpen; courseMenuOpen = false; }}
						class="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
					>
						About Us
						<ChevronDown class={`h-4 w-4 transition-transform ${aboutMenuOpen ? 'rotate-180' : ''}`} />
					</button>

					{#if aboutMenuOpen}
						<div class="absolute left-0 mt-2 w-64 origin-top-left rounded-lg border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
							<div class="p-2">
								<button
									onclick={() => navigate('/about-us')}
									class="flex items-start gap-3 w-full p-3 rounded-md hover:bg-accent transition-colors text-left"
								>
									<Info class="h-4 w-4 mt-0.5 text-primary" />
									<div>
										<div class="text-sm font-medium">About Us</div>
										<div class="text-xs text-muted-foreground">Learn about our mission</div>
									</div>
								</button>

								<button
									onclick={() => navigate('/terms')}
									class="flex items-start gap-3 w-full p-3 rounded-md hover:bg-accent transition-colors text-left"
								>
									<div class="text-sm font-medium">Terms & Conditions</div>
								</button>

								<button
									onclick={() => navigate('/privacy')}
									class="flex items-start gap-3 w-full p-3 rounded-md hover:bg-accent transition-colors text-left"
								>
									<div class="text-sm font-medium">Privacy Policy</div>
								</button>

								<button
									onclick={() => navigate('/cookies')}
									class="flex items-start gap-3 w-full p-3 rounded-md hover:bg-accent transition-colors text-left"
								>
									<div class="text-sm font-medium">Cookie Policy</div>
								</button>
							</div>
						</div>
					{/if}
				</div>

				<!-- Support -->
				<button
					onclick={() => navigate('/support')}
					class="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
				>
					Support
				</button>

				<!-- Admin (only for admins) -->
				{#if isAuthenticated && (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN')}
					<button
						onclick={() => navigate('/admin/users')}
						class="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
					>
						Admin
					</button>
				{/if}
			</div>

			<!-- Right Side Actions -->
			<div class="flex items-center gap-2">
				<!-- Theme Toggle -->
				<Button onclick={handleToggle} variant="ghost" size="icon" class="hidden sm:inline-flex">
					<Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span class="sr-only">Toggle theme</span>
				</Button>

				<!-- Auth Button -->
				{#if isLoading}
					<Button variant="ghost" size="sm" disabled class="hidden md:flex">
						<div class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
					</Button>
				{:else if isAuthenticated && user}
					<!-- User Menu -->
					<div class="relative dropdown-container hidden md:block">
						<button
							onclick={() => { userMenuOpen = !userMenuOpen; }}
							class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
						>
							<div class="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
								{userInitials}
							</div>
							<span class="hidden lg:inline">{user.firstName || user.email}</span>
							<ChevronDown class={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
						</button>

						{#if userMenuOpen}
							<div class="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
								<!-- User Info Header -->
								<div class="px-4 py-3 border-b">
									<p class="text-sm font-medium">
										{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
									</p>
									<p class="text-xs text-muted-foreground">{user?.email}</p>
								</div>

								<!-- Menu Items -->
								<div class="p-2">
									<button
										onclick={() => navigate('/profile')}
										class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent transition-colors text-left"
									>
										<User class="h-4 w-4" />
										<span class="text-sm">Profile</span>
									</button>

									<button
										onclick={() => navigate('/settings')}
										class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent transition-colors text-left"
									>
										<Settings class="h-4 w-4" />
										<span class="text-sm">Settings</span>
									</button>

									{#if user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN'}
										<div class="my-2 border-t"></div>
										<button
											onclick={() => navigate('/admin/users')}
											class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent transition-colors text-left"
										>
											<Shield class="h-4 w-4" />
											<span class="text-sm">Admin Panel</span>
										</button>
									{/if}

									<div class="my-2 border-t"></div>

									<button
										onclick={handleLogout}
										class="flex items-center gap-3 w-full p-2 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors text-left"
									>
										<LogOut class="h-4 w-4" />
										<span class="text-sm">Logout</span>
									</button>
								</div>
							</div>
						{/if}
					</div>
				{:else}
					<Button onclick={handleLogin} variant="default" size="sm" class="hidden md:flex">
						<LogIn class="h-4 w-4 mr-2" />
						Login
					</Button>
				{/if}

				<!-- Mobile Menu Button -->
				<Button
					onclick={toggleMobileMenu}
					variant="ghost"
					size="icon"
					class="md:hidden"
				>
					{#if mobileMenuOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
					<span class="sr-only">Toggle menu</span>
				</Button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="md:hidden border-t">
			<div class="px-4 py-4 space-y-1">
				<!-- User Info (if logged in) -->
				{#if isAuthenticated && user}
					<div class="px-4 py-3 mb-3 bg-accent rounded-lg">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
								{userInitials}
							</div>
							<div>
								<p class="text-sm font-medium">
									{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
								</p>
								<p class="text-xs text-muted-foreground">{user?.email}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Navigation Links -->
				<button
					onclick={() => navigate('/')}
					class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
				>
					<Home class="h-4 w-4" />
					Home
				</button>

				<button
					onclick={() => navigate('/docs')}
					class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
				>
					<BookOpen class="h-4 w-4" />
					Course
				</button>

				<button
					onclick={() => navigate('/about-us')}
					class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
				>
					<Info class="h-4 w-4" />
					About Us
				</button>

				<button
					onclick={() => navigate('/support')}
					class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
				>
					<HelpCircle class="h-4 w-4" />
					Support
				</button>

				{#if isAuthenticated && (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN')}
					<button
						onclick={() => navigate('/admin/users')}
						class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
					>
						<Shield class="h-4 w-4" />
						Admin
					</button>
				{/if}

				<!-- Divider -->
				<div class="my-3 border-t"></div>

				<!-- Theme Toggle -->
				<button
					onclick={handleToggle}
					class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
				>
					<Sun class="h-4 w-4 rotate-0 scale-100 dark:scale-0" />
					<Moon class="absolute h-4 w-4 ml-0 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
					<span class="ml-7">Toggle Theme</span>
				</button>

				<!-- Auth Actions -->
				{#if isAuthenticated && user}
					<button
						onclick={() => navigate('/profile')}
						class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
					>
						<User class="h-4 w-4" />
						Profile
					</button>

					<button
						onclick={() => navigate('/settings')}
						class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors text-left"
					>
						<Settings class="h-4 w-4" />
						Settings
					</button>

					<button
						onclick={handleLogout}
						class="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-destructive hover:text-destructive-foreground transition-colors text-left"
					>
						<LogOut class="h-4 w-4" />
						Logout
					</button>
				{:else}
					<button
						onclick={handleLogin}
						class="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
					>
						<LogIn class="h-4 w-4" />
						Login
					</button>
				{/if}
			</div>
		</div>
	{/if}
</nav>

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes zoom-in {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }

    .animate-in {
        animation: fade-in 0.15s ease-out, zoom-in 0.15s ease-out;
    }

    .fade-in-0 {
        animation-duration: 0.15s;
    }

    .zoom-in-95 {
        animation-duration: 0.15s;
    }
</style>