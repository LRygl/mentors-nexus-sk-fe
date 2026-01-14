<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		User,
		Settings,
		HelpCircle,
		LogOut,
		ChevronDown,
		LayoutDashboard,
		ShoppingBag,
		FileText,
		CreditCard,
		GraduationCap,
		Shield,
		House
	} from 'lucide-svelte';
	import { authStore } from '$lib/stores/Auth.svelte';
	import type { UserMenuAction, UserRole } from '$lib/types/user-menu';
	import { userMenuConfigs } from '$lib/Config/UserMenuConfig';
	import { Role } from '$lib/types/enums/Role';

	interface Props {
		configKey?: string;
		actions?: UserMenuAction[];
		variant?: 'sidebar' | 'navbar';
		dropdownPosition?: 'top' | 'bottom';
		autoSelectConfig?: boolean;
	}

	let {
		configKey = 'admin',
		actions,
		variant = 'sidebar',
		dropdownPosition = 'top',
		autoSelectConfig = false
	}: Props = $props();

	const iconMap: Record<string, any> = {
		User,
		Settings,
		HelpCircle,
		LogOut,
		LayoutDashboard,
		ShoppingBag,
		FileText,
		CreditCard,
		GraduationCap,
		Shield,
		House
	};

	let showDropdown = $state(false);

	// ✅ Use $derived for reactive values (NOT functions!)
	let currentUser = $derived(authStore.user);
	let userRole = $derived((currentUser?.role as UserRole) || 'guest');

	// Auto-determine configKey based on role if enabled
	let effectiveConfigKey = $derived.by(() => {
		if (autoSelectConfig) {
			console.log("[MENU] Auto-selecting config for role:", userRole);

			if (!currentUser || userRole === 'guest') {
				return 'main';
			}
			switch (userRole) {
				case Role.ADMIN:
					return 'admin';
				case Role.USER:
					return 'main';
				default:
					return 'main';
			}
		}
		return configKey;
	});

	let userInitials = $derived.by(() => {
		if (!currentUser) return 'U';

		const first = currentUser.firstName?.[0] ?? '';
		const last = currentUser.lastName?.[0] ?? '';

		return (first + last).toUpperCase() || 'U';
	});

	// Load actions from config if not provided via props
	let menuActions = $derived.by(() => {
		// Handle null/undefined gracefully
		if (!actions && !effectiveConfigKey) {
			return [];
		}

		const config = userMenuConfigs[effectiveConfigKey];
		return actions ?? config?.actions ?? [];
	});


	// Filter actions based on user role
	let filteredActions = $derived.by(() => {
		return menuActions.filter((action) => {
			if (action.type === 'divider') return true;
			if (!action.roles || action.roles.length === 0) return true;
			if (!userRole || userRole === 'guest') return false;
			return action.roles.includes(userRole as Role);
		});
	});

	let cleanedActions = $derived.by(() => {
		return filteredActions.reduce((acc: UserMenuAction[], action, index) => {
			if (action.type === 'divider') {
				const isFirst = acc.length === 0;
				const prevWasDivider = acc[acc.length - 1]?.type === 'divider';
				const isLast = index === filteredActions.length - 1;

				if (isFirst || prevWasDivider || isLast) {
					return acc;
				}
			}
			return [...acc, action];
		}, []);
	});

	async function handleAction(action: UserMenuAction) {
		showDropdown = false;

		if (action.action === 'logout') {
			await authStore.logout();
		} else if (action.href) {
			goto(action.href);
		}
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.user-menu-container')) {
			showDropdown = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="user-menu-container {variant === 'sidebar' ? 'border-t border-slate-700/50 p-3' : ''}">
	<div class="relative">
		<button
			onclick={() => (showDropdown = !showDropdown)}
			class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 {variant === 'sidebar' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}"
		>
			<div
				class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-semibold shadow-lg {variant === 'sidebar' ? 'text-white' : ''}"
			>
				{userInitials}
			</div>

			<div class="flex-1 text-left">
				<p
					class="text-sm font-medium truncate {variant === 'sidebar' ? 'text-white' : 'text-slate-900'}"
				>
					{currentUser?.firstName || 'Guest'} {currentUser?.lastName || 'Guest'}
				</p>
				<p
					class="text-xs truncate {variant === 'sidebar' ? 'text-slate-400' : 'text-slate-500'}"
				>
					{currentUser?.email || 'Not signed in'}
				</p>
			</div>

			<ChevronDown
				class="w-4 h-4 transition-transform duration-200 {showDropdown ? 'rotate-180' : ''} {variant === 'sidebar' ? 'text-slate-400' : 'text-slate-600'}"
			/>
		</button>

		{#if showDropdown && cleanedActions.length > 0}
			<div
				class="absolute left-0 right-0 rounded-lg shadow-xl border py-2 animate-slideIn z-50 {dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} {variant === 'sidebar' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}"
			>
				{#each cleanedActions as action}
					{#if action.type === 'divider'}
						<div
							class="h-px my-2 {variant === 'sidebar' ? 'bg-slate-700' : 'bg-slate-200'}"
						></div>
					{:else}
						{@const ActionIcon = action.icon ? iconMap[action.icon] : null}
						<button
							onclick={() => handleAction(action)}
							class="w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left {variant === 'sidebar' ? 'hover:bg-slate-700' : 'hover:bg-slate-50'} {action.action === 'logout' ? 'text-red-400' : variant === 'sidebar' ? 'text-white' : 'text-slate-700'}"
						>
							{#if ActionIcon}
								<ActionIcon class="w-4 h-4" />
							{/if}
							<span class="text-sm flex-1">{action.label}</span>
							{#if action.badge}
                <span
									class="px-2 py-0.5 text-xs font-semibold rounded-full {variant === 'sidebar' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}"
								>
                  {action.badge}
                </span>
							{/if}
						</button>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-slideIn {
        animation: slideIn 0.2s ease-out;
    }
</style>