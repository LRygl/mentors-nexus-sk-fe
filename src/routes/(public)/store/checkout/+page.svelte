<script lang="ts">
	import {
		ShoppingCart,
		Trash2,
		CreditCard,
		Building2,
		CheckCircle,
		ArrowLeft,
		ArrowRight,
		Loader2,
		FileText,
		User,
		MapPin,
		Mail,
		Lock,
		Eye,
		EyeOff,
		AlertCircle
	} from 'lucide-svelte';
	import { cartStore } from '$lib/stores/Cart.svelte';
	import { cartService } from '$lib/Services/CartService.svelte';
	import { authStore } from '$lib/stores/Auth.svelte';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/Config/routes.config';
	import { PaymentMethod } from '$lib/types/entities/Order';
	import type { CheckoutRequest, CheckoutResponse } from '$lib/types/entities/Order';
	import type { RegisterRequest } from '$lib/types/entities/Auth';
	import type { CartItem } from '$lib/types/entities/CartItem';
	import { onMount } from 'svelte';
	import AddressAutocomplete from '$lib/components/UI/AddressAutocomplete.svelte';
	import { parseApiError, isErrorCode } from '$lib/API/APIErrors';
	import PasswordStrengthIndicator from '$lib/components/Component/PasswordStrengthIndicator/PasswordStrengthIndicator.svelte';

	// ── Step definitions ─────────────────────────────────────────
	// Steps differ based on authentication status.
	// Authenticated:   cart → details → payment → confirm
	// Guest:           cart → account → verify  → payment → confirm

	type Step = 'cart' | 'details' | 'account' | 'verify' | 'payment' | 'confirm';

	interface StepDef {
		key: Step;
		label: string;
		icon: any;
	}

	const authenticatedSteps: StepDef[] = [
		{ key: 'cart', label: 'Cart', icon: ShoppingCart },
		{ key: 'details', label: 'Details', icon: User },
		{ key: 'payment', label: 'Payment', icon: CreditCard },
		{ key: 'confirm', label: 'Confirm', icon: CheckCircle }
	];

	const guestSteps: StepDef[] = [
		{ key: 'cart', label: 'Cart', icon: ShoppingCart },
		{ key: 'account', label: 'Account', icon: User },
		{ key: 'verify', label: 'Verify', icon: Mail },
		{ key: 'payment', label: 'Payment', icon: CreditCard },
		{ key: 'confirm', label: 'Confirm', icon: CheckCircle }
	];

	// Determine which flow to use. Once the user registers inline and
	// logs in, `authStore.isAuthenticated` becomes true, but we stay
	// in the guest flow because we already collected their data.
	let startedAsGuest = $state(false);

	let steps = $derived(startedAsGuest ? guestSteps : authenticatedSteps);

	let currentStep = $state<Step>('cart');
	let isSubmitting = $state(false);
	let checkoutResult = $state<CheckoutResponse | null>(null);

	let currentStepIndex = $derived(steps.findIndex((s) => s.key === currentStep));

	// ── Registration state (guest flow) ──────────────────────────
	let registrationPassword = $state('');
	let showPassword = $state(false);
	let isRegistering = $state(false);
	let registrationDone = $state(false);
	let registrationError = $state('');
	let registrationErrorField = $state<'email' | 'password' | 'general' | null>(null);

	// Verify step
	let isVerifying = $state(false);
	let verifyError = $state('');

	// Inline login (for "Already have an account?" on account step)
	let showLoginForm = $state(false);
	let loginPassword = $state('');
	let isLoggingIn = $state(false);
	let loginError = $state('');

	// ── Form state ───────────────────────────────────────────────
	let form = $state({
		firstName: '',
		lastName: '',
		email: '',
		telephoneNumber: '',
		street: '',
		city: '',
		postalCode: '',
		country: 'CZ',
		selectedPaymentMethod: PaymentMethod.BANK_TRANSFER as PaymentMethod,
		termsAccepted: false,
		privacyAccepted: false,
		marketingConsent: false,
		// Registration-specific consent (maps to RegisterRequest fields)
		personalDataProcessing: false,
		personalDataPublishing: false
	});

	// Populate form from auth user if logged in
	onMount(() => {
		startedAsGuest = !authStore.isAuthenticated;

		if (authStore.isAuthenticated && authStore.user) {
			const u = authStore.user;
			form.firstName = u.firstName || '';
			form.lastName = u.lastName || '';
			form.email = u.email || '';
		}

		// Snapshot cart items immediately so we have a reliable copy
		// even if the reactive cart state is disrupted by login/auth changes later.
		snapshotItems = [...cartStore.items];

		// Redirect to store if cart is empty
		if (cartStore.isEmpty) {
			toastService.info('Empty cart', 'Your cart is empty. Browse our courses first.');
			goto(ROUTES.PUBLIC.STORE);
		}
	});

	// ── Cart derived ─────────────────────────────────────────────
	let items = $derived(cartStore.items);
	let totalPrice = $derived(cartStore.totalPrice);
	let itemCount = $derived(cartStore.itemCount);

	// Snapshot of cart items taken on mount — used as a safety fallback
	// during checkout in case the reactive cart loses items after login
	// (e.g. page re-render, auth state change, SvelteKit invalidation).
	let snapshotItems = $state<CartItem[]>([]);

	// ── Validation ───────────────────────────────────────────────

	// Billing details validation (for authenticated "details" step)
	let detailsValid = $derived(
		form.firstName.trim().length > 0 &&
		form.lastName.trim().length > 0 &&
		form.email.trim().length > 0 &&
		form.street.trim().length > 0 &&
		form.city.trim().length > 0 &&
		form.postalCode.trim().length > 0 &&
		form.country.trim().length > 0
	);

	function isValidEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	// Account step validation (guest): all billing + registration fields
	let accountStepValid = $derived(
		form.firstName.trim().length > 0 &&
		form.lastName.trim().length > 0 &&
		isValidEmail(form.email) &&
		registrationPassword.length >= 6 &&
		form.street.trim().length > 0 &&
		form.city.trim().length > 0 &&
		form.postalCode.trim().length > 0 &&
		form.country.trim().length > 0 &&
		form.personalDataProcessing &&
		form.personalDataPublishing
	);

	let canConfirm = $derived(
		form.termsAccepted && form.privacyAccepted
	);

	// ── Navigation ───────────────────────────────────────────────
	function nextStep() {
		const idx = currentStepIndex;
		if (idx < steps.length - 1) {
			currentStep = steps[idx + 1].key;
		}
	}

	function prevStep() {
		const idx = currentStepIndex;
		if (idx > 0) {
			currentStep = steps[idx - 1].key;
		}
	}

	function goToStep(step: Step) {
		const targetIdx = steps.findIndex((s) => s.key === step);
		if (targetIdx <= currentStepIndex) {
			currentStep = step;
		}
	}

	// ── Guest: Registration ─────────────────────────────────────
	async function handleRegistration() {
		if (!accountStepValid || isRegistering) return;

		isRegistering = true;
		registrationError = '';
		registrationErrorField = null;

		try {
			const registerData: RegisterRequest = {
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
				email: form.email.trim(),
				password: registrationPassword,
				telephoneNumber: form.telephoneNumber.trim(),
				personalDataProcessing: form.personalDataProcessing,
				personalDataPublishing: form.personalDataPublishing,
				marketing: form.marketingConsent
			};

			await authStore.register(registerData);
			registrationDone = true;

			toastService.success(
				'Account created!',
				'Please check your email to verify your account before continuing.'
			);

			// Advance to the verification step
			nextStep();
		} catch (error: unknown) {
			registrationError = parseApiError(error);

			if (isErrorCode(error, 'UserAlreadyRegistered') || isErrorCode(error, 'InvalidEmail')) {
				registrationErrorField = 'email';
			} else if (isErrorCode(error, 'WeakPassword')) {
				registrationErrorField = 'password';
			} else {
				registrationErrorField = 'general';
			}
		} finally {
			isRegistering = false;
		}
	}

	// ── Guest: Verify email (attempt login) ─────────────────────
	async function handleVerifyAndLogin() {
		if (isVerifying) return;

		isVerifying = true;
		verifyError = '';

		try {
			// Attempt to log in. If the account hasn't been activated yet,
			// the backend will reject the login with a specific error.
			await authStore.login(form.email.trim(), registrationPassword);

			toastService.success('Email verified!', 'Your account is now active. Continue to payment.');
			nextStep();
		} catch (error: unknown) {
			verifyError = parseApiError(error);
			// Provide a helpful hint if the account is not yet activated
			if (verifyError.toLowerCase().includes('not activated') || verifyError.toLowerCase().includes('not verified')) {
				verifyError = 'Your account is not yet activated. Please check your email and click the verification link, then try again.';
			}
		} finally {
			isVerifying = false;
		}
	}

	// ── Guest: Inline login (already have account) ──────────────
	async function handleInlineLogin() {
		if (isLoggingIn) return;

		isLoggingIn = true;
		loginError = '';

		try {
			await authStore.login(form.email.trim(), loginPassword);

			// Pre-fill any missing form data from the now-authenticated user
			if (authStore.user) {
				if (!form.firstName) form.firstName = authStore.user.firstName || '';
				if (!form.lastName) form.lastName = authStore.user.lastName || '';
			}

			toastService.success('Logged in!', 'You can now continue your checkout.');

			// Jump to payment step (skip verify since they're already authenticated)
			currentStep = 'payment';
		} catch (error: unknown) {
			loginError = parseApiError(error);
		} finally {
			isLoggingIn = false;
		}
	}

	// ── Submit checkout ─────────────────────────────────────────
	async function handleCheckout() {
		if (!canConfirm || isSubmitting) return;

		isSubmitting = true;

		// Use live cart items, but fall back to the snapshot taken on mount.
		// If both are empty, try reading directly from localStorage as last resort
		// (cart reactive state can be lost after auth state changes / SvelteKit invalidation).
		let checkoutItems = items.length > 0 ? items : snapshotItems;
		if (checkoutItems.length === 0) {
			try {
				const raw = localStorage.getItem('mentors_cart');
				if (raw) {
					const parsed = JSON.parse(raw);
					if (Array.isArray(parsed) && parsed.length > 0) {
						checkoutItems = parsed;
					}
				}
			} catch { /* ignore */ }
		}
		console.log('[Checkout] Live items:', items.length, '| Snapshot items:', snapshotItems.length, '| Using:', checkoutItems.length);

		if (checkoutItems.length === 0) {
			toastService.error('Empty cart', 'No courses found in your cart. Please try again.');
			isSubmitting = false;
			return;
		}

		try {
			const request: CheckoutRequest = {
				courseIds: checkoutItems.map((item) => Number(item.courseId)),
				firstName: form.firstName.trim(),
				lastName: form.lastName.trim(),
				email: form.email.trim(),
				telephoneNumber: form.telephoneNumber.trim() || undefined,
				street: form.street.trim(),
				city: form.city.trim(),
				postalCode: form.postalCode.trim(),
				country: form.country.trim(),
				selectedPaymentMethod: form.selectedPaymentMethod,
				termsAccepted: form.termsAccepted,
				privacyAccepted: form.privacyAccepted,
				marketingConsent: form.marketingConsent || undefined
			};

			checkoutResult = await cartService.checkout(request);
			currentStep = 'confirm';
		} catch {
			// Error toast is already shown by cartService
		} finally {
			isSubmitting = false;
		}
	}

	// ── Formatting ───────────────────────────────────────────────
	function formatPrice(price: number): string {
		return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK' }).format(price);
	}
</script>

<svelte:head>
	<title>Checkout | AEVI Do More</title>
</svelte:head>

<div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
	<div class="">

		<!-- Header -->
		<div class="mb-8">
			<button
				onclick={() => goto(ROUTES.PUBLIC.STORE)}
				class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
			>
				<ArrowLeft class="w-4 h-4" />
				Back to Store
			</button>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
		</div>

		<!-- Step Indicator -->
		<div class="w-3xl flex m-auto items-center mb-10 overflow-x-auto pb-2">
			{#each steps as step, i}
				<button
					onclick={() => goToStep(step.key)}
					class="flex items-center gap-2 shrink-0 {i <= currentStepIndex
						? 'text-blue-600 dark:text-blue-400'
						: 'text-gray-400 dark:text-gray-600'} {i < currentStepIndex ? 'cursor-pointer' : ''}"
					disabled={i > currentStepIndex}
				>
					<div class="flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all {i <= currentStepIndex
						? 'border-blue-500 bg-blue-500 text-white'
						: 'border-gray-300 dark:border-gray-600'}">
						{#if i < currentStepIndex}
							<CheckCircle class="w-5 h-5" />
						{:else}
							<svelte:component this={step.icon} class="w-4 h-4" />
						{/if}
					</div>
					<span class="text-sm font-medium hidden sm:inline">{step.label}</span>
				</button>

				{#if i < steps.length - 1}
					<div class="flex-1 h-px mx-3 min-w-[2rem] {i < currentStepIndex
						? 'bg-blue-500'
						: 'bg-gray-300 dark:bg-gray-700'}"></div>
				{/if}
			{/each}
		</div>

		<!-- ───────────────────── STEP: Cart Review ───────────────────── -->
		{#if currentStep === 'cart'}
			<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Review your cart</h2>

				{#if items.length === 0}
					<p class="text-gray-500 dark:text-gray-400 text-center py-12">Your cart is empty.</p>
				{:else}
					<div class="space-y-4">
						{#each items as item (item.id)}
							<div class="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700">
								{#if item.courseImageUrl}
									<img src={item.courseImageUrl} alt={item.courseName} class="w-16 h-16 rounded-lg object-cover" />
								{:else}
									<div class="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
										<ShoppingCart class="w-6 h-6 text-white" />
									</div>
								{/if}

								<div class="flex-1 min-w-0">
									<h3 class="font-semibold text-gray-900 dark:text-white truncate">{item.courseName}</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">Online Course</p>
								</div>

								<span class="font-bold text-gray-900 dark:text-white whitespace-nowrap">
									{formatPrice(item.price)}
								</span>

								<button
									onclick={() => cartStore.removeItem(item.id)}
									class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
									aria-label="Remove {item.courseName}"
								>
									<Trash2 class="w-4 h-4" />
								</button>
							</div>
						{/each}
					</div>

					<div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
						<span class="text-lg font-medium text-gray-700 dark:text-gray-300">Total ({itemCount} {itemCount === 1 ? 'course' : 'courses'})</span>
						<span class="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
					</div>
				{/if}
			</div>

			{#if items.length > 0}
				<div class="mt-6 flex justify-end">
					<button onclick={nextStep} class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
						Continue
						<ArrowRight class="w-4 h-4" />
					</button>
				</div>
			{/if}

		<!-- ───────────────────── STEP: Details (authenticated only) ───────────────────── -->
		{:else if currentStep === 'details'}
			<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
					<User class="w-5 h-5" />
					Billing Details
				</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name *</label>
						<input id="firstName" bind:value={form.firstName} type="text" required
							class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="John" />
					</div>

					<div>
						<label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name *</label>
						<input id="lastName" bind:value={form.lastName} type="text" required
							class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="Doe" />
					</div>

					<div>
						<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
						<input id="email" bind:value={form.email} type="email" required
							class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="john@example.com" />
					</div>

					<div>
						<label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
						<input id="phone" bind:value={form.telephoneNumber} type="tel"
							class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							placeholder="+420 123 456 789" />
					</div>
				</div>

				<div class="mt-6">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
						<MapPin class="w-4 h-4" />
						Billing Address
					</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div class="md:col-span-2">
							<label for="street" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street *</label>
							<AddressAutocomplete
								id="street"
								bind:value={form.street}
								required
								placeholder="123 Main Street"
								inputClass="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								onAddressSelect={(addr) => {
									form.street = addr.street;
									form.city = addr.city;
									form.postalCode = addr.postalCode;
									if (addr.countryCode) form.country = addr.countryCode;
								}}
							/>
						</div>

						<div>
							<label for="city" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
							<input id="city" bind:value={form.city} type="text" required
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="Prague" />
						</div>

						<div>
							<label for="postalCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Postal Code *</label>
							<input id="postalCode" bind:value={form.postalCode} type="text" required
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="110 00" />
						</div>

						<div>
							<label for="country" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Country *</label>
							<select id="country" bind:value={form.country}
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
								<option value="CZ">Czech Republic</option>
								<option value="SK">Slovakia</option>
								<option value="DE">Germany</option>
								<option value="AT">Austria</option>
								<option value="PL">Poland</option>
								<option value="OTHER">Other</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-6 flex justify-between">
				<button onclick={prevStep} class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium">
					<ArrowLeft class="w-4 h-4" />
					Back
				</button>
				<button onclick={nextStep} disabled={!detailsValid}
					class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
					Continue
					<ArrowRight class="w-4 h-4" />
				</button>
			</div>

		<!-- ───────────────────── STEP: Account & Billing (guest only) ───────────────────── -->
		{:else if currentStep === 'account'}
			<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">

				{#if !showLoginForm}
					<!-- REGISTRATION FORM -->
					<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
						<User class="w-5 h-5" />
						Create Your Account
					</h2>
					<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
						We'll create your account so you can access your courses after purchase.
					</p>

					{#if registrationError}
						<div class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
							<AlertCircle class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
							<div class="flex-1">
								<p class="text-sm text-red-700 dark:text-red-300">{registrationError}</p>
								{#if registrationErrorField === 'email'}
									<button
										onclick={() => { showLoginForm = true; }}
										class="text-xs text-red-600 dark:text-red-400 hover:underline mt-1 inline-block"
									>
										Already have an account? Log in instead →
									</button>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Personal info -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<label for="regFirstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name *</label>
							<input id="regFirstName" bind:value={form.firstName} type="text" required
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="John" />
						</div>

						<div>
							<label for="regLastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name *</label>
							<input id="regLastName" bind:value={form.lastName} type="text" required
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="Doe" />
						</div>

						<div>
							<label for="regEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
							<input id="regEmail" bind:value={form.email} type="email" required
								class="w-full px-4 py-2.5 rounded-xl border {registrationErrorField === 'email' ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="john@example.com" />
						</div>

						<div>
							<label for="regPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
							<input id="regPhone" bind:value={form.telephoneNumber} type="tel"
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="+420 123 456 789" />
						</div>

						<div class="md:col-span-2">
							<label for="regPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
							<div class="relative">
								<Lock class="absolute left-4 top-3 h-4 w-4 text-gray-400" />
								<input
									id="regPassword"
									type={showPassword ? 'text' : 'password'}
									bind:value={registrationPassword}
									class="w-full pl-11 pr-11 py-2.5 rounded-xl border {registrationErrorField === 'password' ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-slate-600'} bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="Create a password (min. 6 characters)"
									required
								/>
								<button
									type="button"
									onclick={() => showPassword = !showPassword}
									class="absolute right-4 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
								>
									{#if showPassword}
										<EyeOff class="w-4 h-4" />
									{:else}
										<Eye class="w-4 h-4" />
									{/if}
								</button>
							</div>
							<PasswordStrengthIndicator password={registrationPassword} />
						</div>
					</div>

					<!-- Billing Address -->
					<div class="mt-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
							<MapPin class="w-4 h-4" />
							Billing Address
						</h3>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div class="md:col-span-2">
								<label for="regStreet" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street *</label>
								<input id="regStreet" bind:value={form.street} type="text" required
									class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="123 Main Street" />
							</div>

							<div>
								<label for="regCity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
								<input id="regCity" bind:value={form.city} type="text" required
									class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="Prague" />
							</div>

							<div>
								<label for="regPostalCode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Postal Code *</label>
								<input id="regPostalCode" bind:value={form.postalCode} type="text" required
									class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="110 00" />
							</div>

							<div>
								<label for="regCountry" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Country *</label>
								<select id="regCountry" bind:value={form.country}
									class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
									<option value="CZ">Czech Republic</option>
									<option value="SK">Slovakia</option>
									<option value="DE">Germany</option>
									<option value="AT">Austria</option>
									<option value="PL">Poland</option>
									<option value="OTHER">Other</option>
								</select>
							</div>
						</div>
					</div>

					<!-- Registration consent checkboxes -->
					<div class="mt-8 space-y-4">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Consent & Agreements</h3>

						<label class="flex items-start gap-3 cursor-pointer">
							<input type="checkbox" bind:checked={form.personalDataProcessing} class="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
							<span class="text-sm text-gray-700 dark:text-gray-300">
								I agree to the processing of my personal data in accordance with the <a href="/privacy" target="_blank" class="text-blue-500 underline hover:text-blue-600">Privacy Policy</a> *
							</span>
						</label>

						<label class="flex items-start gap-3 cursor-pointer">
							<input type="checkbox" bind:checked={form.personalDataPublishing} class="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
							<span class="text-sm text-gray-700 dark:text-gray-300">
								I agree to the publishing of my data as outlined in the <a href="/terms" target="_blank" class="text-blue-500 underline hover:text-blue-600">Terms of Service</a> *
							</span>
						</label>

						<label class="flex items-start gap-3 cursor-pointer">
							<input type="checkbox" bind:checked={form.marketingConsent} class="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
							<span class="text-sm text-gray-700 dark:text-gray-300">
								I'd like to receive news and promotional offers (optional)
							</span>
						</label>
					</div>

					<!-- "Already have an account?" link -->
					<div class="mt-6 text-center">
						<button
							onclick={() => { showLoginForm = true; }}
							class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
						>
							Already have an account? Log in instead
						</button>
					</div>

				{:else}
					<!-- INLINE LOGIN FORM -->
					<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
						<Lock class="w-5 h-5" />
						Log In to Continue
					</h2>
					<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
						Use your existing account to complete checkout.
					</p>

					{#if loginError}
						<div class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
							<AlertCircle class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
							<p class="text-sm text-red-700 dark:text-red-300">{loginError}</p>
						</div>
					{/if}

					<div class="space-y-5 max-w-md">
						<div>
							<label for="loginEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
							<input id="loginEmail" bind:value={form.email} type="email" required
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="john@example.com" />
						</div>

						<div>
							<label for="loginPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
							<input id="loginPassword" bind:value={loginPassword} type="password" required
								class="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								placeholder="Your password" />
						</div>

						<button
							onclick={handleInlineLogin}
							disabled={isLoggingIn || !form.email || !loginPassword}
							class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{#if isLoggingIn}
								<Loader2 class="w-4 h-4 animate-spin" />
								Logging in...
							{:else}
								Log In & Continue
								<ArrowRight class="w-4 h-4" />
							{/if}
						</button>
					</div>

					<div class="mt-6 text-center">
						<button
							onclick={() => { showLoginForm = false; }}
							class="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
						>
							Don't have an account? Create one
						</button>
					</div>
				{/if}
			</div>

			<div class="mt-6 flex justify-between">
				<button onclick={prevStep} class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium">
					<ArrowLeft class="w-4 h-4" />
					Back
				</button>
				{#if !showLoginForm}
					<button onclick={handleRegistration} disabled={!accountStepValid || isRegistering}
						class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
						{#if isRegistering}
							<Loader2 class="w-4 h-4 animate-spin" />
							Creating Account...
						{:else}
							Create Account & Continue
							<ArrowRight class="w-4 h-4" />
						{/if}
					</button>
				{/if}
			</div>

		<!-- ───────────────────── STEP: Email Verification (guest only) ───────────────────── -->
		{:else if currentStep === 'verify'}
			<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-8 text-center">
				<div class="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
					<Mail class="w-8 h-8 text-blue-600 dark:text-blue-400" />
				</div>

				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify Your Email</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-2">
					We've sent a verification email to:
				</p>
				<p class="font-semibold text-gray-900 dark:text-white mb-6">{form.email}</p>

				<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 max-w-md mx-auto text-left space-y-2">
					<p class="text-sm text-blue-800 dark:text-blue-200 font-medium">
						How to continue:
					</p>
					<ol class="text-sm text-blue-800 dark:text-blue-200 list-decimal list-inside space-y-1">
						<li>Check your inbox (and spam folder) for the verification email</li>
						<li>Click the activation link in the email</li>
						<li>Come back to <strong>this tab</strong> — don't close it!</li>
						<li>Click the button below to continue your purchase</li>
					</ol>
				</div>

				{#if verifyError}
					<div class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 max-w-md mx-auto text-left">
						<AlertCircle class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
						<p class="text-sm text-red-700 dark:text-red-300">{verifyError}</p>
					</div>
				{/if}

				<button
					onclick={handleVerifyAndLogin}
					disabled={isVerifying}
					class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{#if isVerifying}
						<Loader2 class="w-4 h-4 animate-spin" />
						Checking...
					{:else}
						<CheckCircle class="w-4 h-4" />
						I've Verified My Email
					{/if}
				</button>

				<p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
					Didn't receive the email?
					<a href="/auth/resend-verification" class="text-blue-500 hover:text-blue-600 underline">
						Resend verification email
					</a>
				</p>
			</div>

			<div class="mt-6 flex justify-start">
				<button onclick={prevStep} class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium">
					<ArrowLeft class="w-4 h-4" />
					Back
				</button>
			</div>

		<!-- ───────────────────── STEP: Payment ───────────────────── -->
		{:else if currentStep === 'payment'}
			<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
					<CreditCard class="w-5 h-5" />
					Payment Method
				</h2>

				<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
					Select how you would like to pay. Payment processing will be confirmed separately.
				</p>

				<div class="space-y-3">
					{#each [
						{ value: PaymentMethod.BANK_TRANSFER, label: 'Bank Transfer', desc: 'Pay via bank transfer. Invoice will be sent to your email.', icon: Building2, gradient: 'from-green-500 to-emerald-500' },
						{ value: PaymentMethod.CARD, label: 'Credit / Debit Card', desc: 'Pay by card. Gateway integration coming soon.', icon: CreditCard, gradient: 'from-blue-500 to-indigo-500' },
						{ value: PaymentMethod.CASH, label: 'Cash', desc: 'Pay in cash at our office.', icon: FileText, gradient: 'from-amber-500 to-orange-500' }
					] as method}
						<label class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all {form.selectedPaymentMethod === method.value
							? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
							: 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'}">
							<input type="radio" bind:group={form.selectedPaymentMethod} value={method.value} class="sr-only" />
							<div class="w-10 h-10 rounded-lg bg-gradient-to-br {method.gradient} flex items-center justify-center">
								<svelte:component this={method.icon} class="w-5 h-5 text-white" />
							</div>
							<div class="flex-1">
								<div class="font-semibold text-gray-900 dark:text-white">{method.label}</div>
								<p class="text-sm text-gray-500 dark:text-gray-400">{method.desc}</p>
							</div>
							<div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {form.selectedPaymentMethod === method.value
								? 'border-blue-500 bg-blue-500' : 'border-gray-300 dark:border-slate-600'}">
								{#if form.selectedPaymentMethod === method.value}
									<div class="w-2 h-2 bg-white rounded-full"></div>
								{/if}
							</div>
						</label>
					{/each}
				</div>

				<!-- Consent checkboxes (purchase-level) -->
				<div class="mt-8 space-y-4">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Purchase Agreements</h3>

					<label class="flex items-start gap-3 cursor-pointer">
						<input type="checkbox" bind:checked={form.termsAccepted} class="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
						<span class="text-sm text-gray-700 dark:text-gray-300">
							I agree to the <a href="/terms" target="_blank" class="text-blue-500 underline hover:text-blue-600">Terms & Conditions</a> *
						</span>
					</label>

					<label class="flex items-start gap-3 cursor-pointer">
						<input type="checkbox" bind:checked={form.privacyAccepted} class="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
						<span class="text-sm text-gray-700 dark:text-gray-300">
							I agree to the <a href="/privacy" target="_blank" class="text-blue-500 underline hover:text-blue-600">Privacy Policy</a> *
						</span>
					</label>

					{#if !startedAsGuest}
						<!-- Only show marketing consent on payment step for authenticated users
						     (guests already gave consent on account step) -->
						<label class="flex items-start gap-3 cursor-pointer">
							<input type="checkbox" bind:checked={form.marketingConsent} class="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
							<span class="text-sm text-gray-700 dark:text-gray-300">
								I'd like to receive news and promotional offers (optional)
							</span>
						</label>
					{/if}
				</div>
			</div>

			<div class="mt-6 flex justify-between">
				<button onclick={prevStep} class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium">
					<ArrowLeft class="w-4 h-4" />
					Back
				</button>
				<button onclick={handleCheckout} disabled={!canConfirm || isSubmitting}
					class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
					{#if isSubmitting}
						<Loader2 class="w-4 h-4 animate-spin" />
						Processing...
					{:else}
						Complete Purchase
						<CheckCircle class="w-4 h-4" />
					{/if}
				</button>
			</div>

		<!-- ───────────────────── STEP: Confirmation ───────────────────── -->
		{:else if currentStep === 'confirm' && checkoutResult}
			<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-8 text-center">
				<div class="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
					<CheckCircle class="w-8 h-8 text-green-600 dark:text-green-400" />
				</div>

				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Purchase Complete!</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-6">
					Your order has been successfully processed. Invoice #{checkoutResult.invoiceNumber} has been created.
				</p>

				<div class="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
					<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Invoice</span>
							<span class="font-medium text-gray-900 dark:text-white">#{checkoutResult.invoiceNumber}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Total</span>
							<span class="font-bold text-gray-900 dark:text-white">{formatPrice(checkoutResult.totalAmount)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Status</span>
							<span class="font-medium text-green-600 dark:text-green-400">{checkoutResult.status}</span>
						</div>
					</div>
				</div>

				{#if checkoutResult.enrolledCourses && checkoutResult.enrolledCourses.length > 0}
					<div class="text-left max-w-md mx-auto mb-6">
						<h3 class="font-semibold text-gray-900 dark:text-white mb-3">Your New Courses</h3>
						<div class="space-y-2">
							{#each checkoutResult.enrolledCourses as course}
								<div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50">
									{#if course.courseImageUrl}
										<img src={course.courseImageUrl} alt={course.courseName} class="w-10 h-10 rounded-lg object-cover" />
									{/if}
									<span class="text-sm font-medium text-gray-900 dark:text-white">{course.courseName}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<button onclick={() => goto(ROUTES.USER.MY_COURSES)}
						class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
						Go to My Courses
					</button>
					<button onclick={() => goto(ROUTES.USER.INVOICES)}
						class="px-6 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-medium">
						View Invoices
					</button>
				</div>
			</div>
		{/if}

		<!-- Order Summary (visible during cart/details/account/verify/payment) -->
		{#if currentStep !== 'confirm' && items.length > 0}
			<div class="mt-8 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6">
				<h3 class="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
				<div class="space-y-2 text-sm">
					{#each items as item (item.id)}
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400 truncate mr-4">{item.courseName}</span>
							<span class="font-medium text-gray-900 dark:text-white whitespace-nowrap">{formatPrice(item.price)}</span>
						</div>
					{/each}
					<div class="pt-3 mt-3 border-t border-gray-200 dark:border-slate-700 flex justify-between">
						<span class="font-semibold text-gray-900 dark:text-white">Total</span>
						<span class="font-bold text-lg text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
