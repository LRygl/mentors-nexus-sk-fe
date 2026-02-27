<script lang="ts">
	import {
		User,
		Key,
		Save,
		Undo2,
		Loader2,
		AlertCircle,
		CheckCircle,
		GraduationCap,
		Calendar
	} from 'lucide-svelte';
	import AccountPageHeader from '$lib/components/UI/AccountPageHeader.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { createFullProfileSchema } from '$lib/components/Forms/Schemas/User/ProfileFormSchemas';
	import { authStore } from '$lib/stores/Auth.svelte';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { userPublicAPI } from '$lib/API/Public/UserPublicAPI';
	import { onMount } from 'svelte';
	import type { User as UserType } from '$lib/types/entities/User';

	// ── Schema (created once) ─────────────────────────────────────────────────
	const fullProfileSchema = createFullProfileSchema();

	// ── Auth ─────────────────────────────────────────────────────────────────
	let authUser = $derived(authStore.user);

	// ── Full profile (loaded from API) ────────────────────────────────────────
	let fullProfile = $state<UserType | null>(null);
	let isLoadingProfile = $state(true);

	// ── Single form ref + unified dirty / saving state ────────────────────────
	let profileFormRef = $state<UniversalForm>();
	let isFormDirty = $state(false);
	let isSaving = $state(false);

	// ── Password change ───────────────────────────────────────────────────────
	let showPasswordForm = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');
	let isChangingPassword = $state(false);

	let passwordsMatch = $derived(newPassword === confirmPassword);
	let passwordLongEnough = $derived(newPassword.length >= 8);
	let canChangePassword = $derived(
		currentPassword.length > 0 &&
			newPassword.length >= 8 &&
			confirmPassword.length > 0 &&
			passwordsMatch &&
			passwordLongEnough
	);

	// ── Computed display values ───────────────────────────────────────────────
	function getInitials(): string {
		const f = (fullProfile?.firstName ?? authUser?.firstName ?? '').charAt(0).toUpperCase();
		const l = (fullProfile?.lastName ?? authUser?.lastName ?? '').charAt(0).toUpperCase();
		return f + l || '?';
	}

	function getFullName(): string {
		return `${fullProfile?.firstName ?? authUser?.firstName ?? ''} ${fullProfile?.lastName ?? authUser?.lastName ?? ''}`.trim();
	}

	function formatRole(role?: string): string {
		return (role ?? 'User').toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function formatDate(iso?: string): string {
		if (!iso) return '—';
		return new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	// ── Load full profile ─────────────────────────────────────────────────────
	onMount(async () => {
		await loadProfile();
	});

	async function loadProfile() {
		isLoadingProfile = true;
		try {
			fullProfile = await userPublicAPI.getMyProfile();
		} catch {
			// Endpoint not yet implemented – fall back to auth store data.
			if (authStore.user) {
				fullProfile = {
					id: authStore.user.id,
					uuid: authStore.user.uuid,
					firstName: authStore.user.firstName,
					lastName: authStore.user.lastName,
					email: authStore.user.email,
					role: authStore.user.role as any,
					isAccountNonLocked: true,
					forcePasswordChangeOnLogin: false,
					personalDataProcessing: false,
					personalDataPublishing: false,
					marketing: false,
					cookiePolicyConsent: false
				};
			}
		} finally {
			isLoadingProfile = false;
		}
	}

	// ── Single save: sends the whole profile object in one call ───────────────
	async function handleSave(data: any) {
		isSaving = true;
		try {
			const updated = await userPublicAPI.updateProfile({
				firstName: data.firstName,
				lastName: data.lastName,
				telephoneNumber: data.telephoneNumber,
				billingFirstName: data.billingFirstName,
				billingLastName: data.billingLastName,
				billingStreet: data.billingStreet,
				billingCity: data.billingCity,
				billingPostalCode: data.billingPostalCode,
				billingCountry: data.billingCountry,
				personalDataProcessing: data.personalDataProcessing,
				personalDataPublishing: data.personalDataPublishing,
				marketing: data.marketing,
			});
			fullProfile = updated;
			// Sync display name back to the auth store (updates navbar etc.)
			if (authStore.user) {
				authStore.user = {
					...authStore.user,
					firstName: updated.firstName,
					lastName: updated.lastName
				};
			}
			toastService.success('Saved', 'Profile updated successfully.');
		} catch (err) {
			toastService.error('Error', 'Failed to save profile.');
			throw err; // Re-throw so UniversalForm keeps the dirty state
		} finally {
			isSaving = false;
		}
	}

	// ── Password change ───────────────────────────────────────────────────────
	async function changePassword() {
		if (!canChangePassword) return;
		isChangingPassword = true;
		try {
			await userPublicAPI.changePassword({ currentPassword, newPassword });
			toastService.success('Updated', 'Password changed successfully.');
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			showPasswordForm = false;
		} catch (err: any) {
			const msg = err?.message ?? 'Failed to change password. Please check your current password.';
			toastService.error('Error', msg);
		} finally {
			isChangingPassword = false;
		}
	}
</script>

<svelte:head>
	<title>My Profile | My Account</title>
</svelte:head>

<div class="space-y-6">
	<AccountPageHeader
		icon={User}
		title="My Profile"
		subtitle="Manage your account details, billing address, and preferences."
	/>

	<!-- ── Avatar / identity card ──────────────────────────────────────────── -->
	<div class="rounded-2xl border border-gray-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur overflow-hidden">
		<!-- Indigo accent strip -->
		<div class="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400"></div>

		<div class="p-6 flex items-center gap-5">
			<!-- Avatar -->
			<div class="relative flex-shrink-0">
				<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/25 select-none">
					{getInitials()}
				</div>
				<!-- Online dot -->
				<div class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow-sm"></div>
			</div>

			<!-- Info -->
			<div class="flex-1 min-w-0">
				{#if isLoadingProfile}
					<div class="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-1.5"></div>
					<div class="h-4 w-56 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
				{:else}
					<h2 class="text-xl font-semibold text-gray-900 dark:text-white tracking-tight truncate">{getFullName()}</h2>
					<p class="text-sm text-gray-500 dark:text-slate-400 truncate">{fullProfile?.email ?? authUser?.email ?? ''}</p>
				{/if}
			</div>

			<!-- Meta badges -->
			<div class="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
				<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
					{formatRole(fullProfile?.role ?? authUser?.role)}
				</span>
				{#if fullProfile?.registerDate}
					<span class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
						<Calendar class="w-3 h-3" />
						Member since {formatDate(fullProfile.registerDate)}
					</span>
				{/if}
				{#if authUser?.enrolledCoursesCount !== undefined}
					<span class="inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
						<GraduationCap class="w-3 h-3" />
						{authUser.enrolledCoursesCount} enrolled {authUser.enrolledCoursesCount === 1 ? 'course' : 'courses'}
					</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- ── Email (read-only) ────────────────────────────────────────────────── -->
	<div class="rounded-2xl border border-gray-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center gap-3">
		<div class="w-2 h-2 rounded-full bg-gray-400 dark:bg-slate-500 flex-shrink-0"></div>
		<div class="flex-1 min-w-0">
			<p class="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wide">Email address</p>
			<p class="text-sm text-gray-700 dark:text-slate-300 truncate mt-0.5">{fullProfile?.email ?? authUser?.email ?? '—'}</p>
		</div>
		<span class="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0">Cannot be changed</span>
	</div>

	<!-- ── Unified profile form (Personal / Billing / Consent) ─────────────── -->
	{#if isLoadingProfile}
		<!-- Skeleton while loading -->
		<div class="space-y-6">
			{#each [1, 2, 3] as _}
				<div class="rounded-2xl border border-gray-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur p-6">
					<div class="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-slate-800/60">
						<div class="w-9 h-9 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
						<div class="space-y-1.5">
							<div class="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
							<div class="h-3 w-48 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						{#each [1, 2, 3] as __}
							<div class="space-y-1.5">
								<div class="h-3.5 w-20 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
								<div class="h-10 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse"></div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{:else if fullProfile}
		<UniversalForm
			bind:this={profileFormRef}
			schema={fullProfileSchema}
			mode="embedded"
			initialData={{
				firstName:              fullProfile.firstName              ?? '',
				lastName:               fullProfile.lastName               ?? '',
				telephoneNumber:        fullProfile.telephoneNumber        ?? '',
				billingFirstName:       fullProfile.billingFirstName       ?? '',
				billingLastName:        fullProfile.billingLastName        ?? '',
				billingStreet:          fullProfile.billingStreet          ?? '',
				billingCity:            fullProfile.billingCity            ?? '',
				billingPostalCode:      fullProfile.billingPostalCode      ?? '',
				billingCountry:         fullProfile.billingCountry         ?? 'CZ',
				personalDataProcessing: fullProfile.personalDataProcessing ?? false,
				personalDataPublishing: fullProfile.personalDataPublishing ?? false,
				marketing:              fullProfile.marketing              ?? false,
			}}
			callbacks={{ onSubmit: handleSave }}
			onDirtyChange={(dirty) => (isFormDirty = dirty)}
			showValidationSummary={false}
		/>

		<!-- ── Action bar (shows when any field has changed) ─────────────── -->
		{#if isFormDirty}
			<div class="flex items-center justify-end gap-3 pt-1">
				<button
					type="button"
					onclick={() => profileFormRef?.discard()}
					disabled={isSaving}
					class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
					       text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800
					       transition-colors disabled:opacity-50"
				>
					<Undo2 class="w-3.5 h-3.5" />
					Discard
				</button>
				<button
					type="button"
					onclick={() => profileFormRef?.submit()}
					disabled={isSaving}
					class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold
					       bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-500/25
					       transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
				>
					{#if isSaving}
						<Loader2 class="w-3.5 h-3.5 animate-spin" />
						Saving…
					{:else}
						<Save class="w-3.5 h-3.5" />
						Save all changes
					{/if}
				</button>
			</div>
		{/if}
	{/if}

	<!-- ── Change Password ─────────────────────────────────────────────────── -->
	<div class="rounded-2xl border border-gray-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
		<button
			type="button"
			onclick={() => (showPasswordForm = !showPasswordForm)}
			class="w-full px-6 pt-5 pb-5 flex items-center gap-3 text-left group"
		>
			<div class="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 flex-shrink-0">
				<Key class="w-4 h-4 text-rose-500 dark:text-rose-400" />
			</div>
			<div class="flex-1">
				<h3 class="text-base font-semibold text-gray-900 dark:text-white">Change Password</h3>
				<p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Update your account password</p>
			</div>
			<span class="text-xs font-medium text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex-shrink-0">
				{showPasswordForm ? 'Cancel' : 'Change'}
			</span>
		</button>

		{#if showPasswordForm}
			<div class="px-6 pb-6 border-t border-gray-100 dark:border-slate-800/60 pt-5 space-y-4">
				<div>
					<label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
						Current Password
					</label>
					<input
						id="currentPassword"
						type="password"
						bind:value={currentPassword}
						class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition text-sm"
					/>
				</div>

				<div class="grid sm:grid-cols-2 gap-4">
					<div>
						<label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
							New Password
						</label>
						<input
							id="newPassword"
							type="password"
							bind:value={newPassword}
							class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition text-sm"
						/>
						{#if newPassword.length > 0 && !passwordLongEnough}
							<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
								<AlertCircle class="w-3 h-3" />
								At least 8 characters required
							</p>
						{/if}
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
							Confirm New Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							class="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition text-sm"
						/>
						{#if confirmPassword.length > 0 && !passwordsMatch}
							<p class="mt-1.5 text-xs text-red-500 flex items-center gap-1">
								<AlertCircle class="w-3 h-3" />
								Passwords do not match
							</p>
						{:else if confirmPassword.length > 0 && passwordsMatch && passwordLongEnough}
							<p class="mt-1.5 text-xs text-emerald-500 flex items-center gap-1">
								<CheckCircle class="w-3 h-3" />
								Passwords match
							</p>
						{/if}
					</div>
				</div>

				<div class="flex justify-end pt-1">
					<button
						type="button"
						onclick={changePassword}
						disabled={!canChangePassword || isChangingPassword}
						class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-500/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:cursor-not-allowed"
					>
						{#if isChangingPassword}
							<Loader2 class="w-3.5 h-3.5 animate-spin" />
							Updating…
						{:else}
							<Key class="w-3.5 h-3.5" />
							Update Password
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
