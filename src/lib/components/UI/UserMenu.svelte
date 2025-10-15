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
		Shield
	} from 'lucide-svelte';
	import { authStore } from '$lib/stores/Auth.svelte';
	import type { UserMenuAction, UserRole } from '$lib/types/user-menu';

	interface Props {
		configKey?: string; // 'admin', 'main', or 'mixed'
		actions?: UserMenuAction[]; // Override with custom actions
		variant?: 'sidebar' | 'navbar'; // Visual variant
		dropdownPosition?: 'top' | 'bottom'; // Where dropdown appears
	}

	let {
		configKey = 'admin',
		actions = [],
		variant = 'sidebar',
		dropdownPosition = 'top'
	}: Props = $props();

	// Icon mapping
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
		Shield
	};

	let showDropdown = $state(false);

	// Get current user from auth store
	let currentUser = $derived(authStore.user);
	let userRole = $derived((currentUser?.role as UserRole) || 'guest');
	let userInitials = $derived(
		currentUser?.name
			? currentUser.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2)
			: 'U'
	);

	// Filter actions based on user role
	let filteredActions = $derived(
		actions.filter((action) => {
			// If no roles specified, show to everyone
			if (!action.roles || action.roles.length === 0) return true;
			// Check if user's role is in the allowed roles
			return action.roles.includes(userRole);
		})
	);

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
		<!-- User Button -->
		<button
			onclick={() => (showDropdown = !showDropdown)}
			class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 {variant === 'sidebar' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}"
		>
			<!-- Avatar -->
			<div
				class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-semibold shadow-lg {variant === 'sidebar' ? 'text-white' : ''}"
			>
				{userInitials}
			</div>

			<!-- User Info -->
			<div class="flex-1 text-left">
				<p
					class="text-sm font-medium truncate {variant === 'sidebar' ? 'text-white' : 'text-slate-900'}"
				>
					{currentUser?.name || 'User'}
				</p>
				<p
					class="text-xs truncate {variant === 'sidebar' ? 'text-slate-400' : 'text-slate-500'}"
				>
					{currentUser?.email || 'user@example.com'}
				</p>
			</div>

			<ChevronDown
				class="w-4 h-4 transition-transform duration-200 {showDropdown ? 'rotate-180' : ''} {variant === 'sidebar' ? 'text-slate-400' : 'text-slate-600'}"
			/>
		</button>

		<!-- Dropdown Menu -->
		{#if showDropdown}
			<div
				class="absolute left-0 right-0 rounded-lg shadow-xl border py-2 animate-slideIn z-50 {dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} {variant === 'sidebar' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}"
			>
				{#each filteredActions as action}
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