<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		LayoutDashboard,
		Users,
		FileText,
		BarChart3,
		Settings,
		ChevronDown,
		ChevronRight,
		User,
		MessageCircleQuestionMark,
		HelpCircle,
		LogOut,
		Scale,
		FolderClosed,
		House
	} from 'lucide-svelte';
	import { authStore } from '$lib/stores/Auth.svelte';
	import { sidebarConfig } from '$lib/Config/AdminSidebarConfig';
	import UserMenu from '$lib/components/UI/UserMenu.svelte';
	import { getMenuConfigForRole, userMenuConfigs } from '$lib/Config/UserMenuConfig';

	const config = sidebarConfig;

	// Icon mapping - maps string names to actual Svelte components
	const iconMap: Record<string, any> = {
		LayoutDashboard,
		Users,
		FileText,
		BarChart3,
		Settings,
		User,
		HelpCircle,
		MessageCircleQuestionMark,
		LogOut,
		Scale,
		FolderClosed,
		House
	};

	// Track which sections are expanded
	let expandedSections = $state<Record<string, boolean>>({});
	let showUserDropdown = $state(false);

	// Get current user from auth store
	let currentUser = $derived(authStore.user);

	let menuConfig = $derived.by(() => {
		// If no user, return null (UserMenu will handle this)
		if (!currentUser?.role) {
			return null;
		}

		// Safe access to role with optional chaining
		const role = currentUser?.role;

		if (!role) {
			return null;
		}

		// Your logic to determine menu config based on role
		// Example:
		if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
			return userMenuConfigs['admin'];
		}

		return userMenuConfigs['default'];
	});

	function toggleSection(sectionId: string) {
		expandedSections[sectionId] = !expandedSections[sectionId];
	}

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	function isParentActive(item: any): boolean {
		if (!item.children) return false;
		return item.children.some((child: any) => isActive(child.href));
	}

	async function handleUserAction(action: any) {
		showUserDropdown = false;

		if (action.action === 'logout') {
			await authStore.logout();
		} else if (action.href) {
			goto(action.href);
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.user-dropdown-container')) {
			showUserDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<aside class="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">
	<!-- Logo Section -->
	<div class="p-6 border-b border-slate-700/50">
		<div class="flex items-center gap-3">
			<div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
				<img
					src={config.logo.src}
					alt={config.logo.alt}
					class="w-6 h-6"
					onerror={(e) => e.currentTarget.style.display = 'none'}
				/>
				{#if !config.logo.src}
					<span class="text-white font-bold text-lg">A</span>
				{/if}
			</div>
			<div>
				<h1 class="font-bold text-lg">{config.logo.title}</h1>
				<p class="text-xs text-slate-400">Admin Panel</p>
			</div>
		</div>
	</div>

	<!-- Navigation Section -->
	<nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
		{#each config.navigation as item}
			{@const Icon = iconMap[item.icon]}
			{@const hasChildren = item.children && item.children.length > 0}
			{@const isExpanded = expandedSections[item.id] || false}
			{@const active = isActive(item.href) || isParentActive(item)}

			<div>
				<!-- Parent Item -->
				<button
					onclick={() => {
            if (hasChildren) {
              toggleSection(item.id);
            } else {
              goto(item.href);
            }
          }}
					class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group"
					class:bg-indigo-600={active && !hasChildren}
					class:bg-slate-800={active && hasChildren}
					class:hover:bg-slate-800={!active}
				>
					<div class="flex items-center gap-3">
						{#if Icon}
							<Icon class="w-5 h-5 {active ? 'text-indigo-300' : 'text-slate-400'}" />
						{/if}
						<span class="font-medium text-sm {active ? 'text-white' : 'text-slate-300'}">
              {item.label}
            </span>
					</div>

					{#if hasChildren}
						<div class="transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}">
							<ChevronDown class="w-4 h-4 text-slate-400" />
						</div>
					{/if}
				</button>

				<!-- Children Items -->
				{#if hasChildren && isExpanded}
					<div class="ml-4 mt-1 space-y-1 border-l-2 border-slate-700 pl-4">
						{#each item.children as child}
							{@const childActive = isActive(child.href)}
							<a
								href={child.href}
								class="block px-3 py-2 rounded-lg text-sm transition-all duration-200"
								class:bg-indigo-600={childActive}
								class:text-white={childActive}
								class:text-slate-400={!childActive}
								class:hover:bg-slate-800={!childActive}
								class:hover:text-white={!childActive}
							>
								{child.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</nav>

	<!-- User Section -->
	<UserMenu
		actions={menuConfig.actions}
		variant="sidebar"
		dropdownPosition="top"
	/>
</aside>

<style>
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-slideUp {
        animation: slideUp 0.2s ease-out;
    }

    /* Custom scrollbar for navigation */
    nav::-webkit-scrollbar {
        width: 6px;
    }

    nav::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
    }

    nav::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
    }

    nav::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
    }
</style>