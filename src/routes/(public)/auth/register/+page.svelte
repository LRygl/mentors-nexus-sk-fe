<script lang="ts">
	import { goto } from '$app/navigation';
	import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from 'lucide-svelte';
	import { authStore } from '$lib/stores/Auth.svelte.js';
	import { ROUTES } from '$lib/utils/Redirect';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	let touched = $state({
		firstName: false,
		lastName: false,
		email: false,
		password: false
	});

	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	let formValid = $derived(
		firstName && lastName && isValidEmail(email) && password.length >= 6
	);

	function handleBlur(field: keyof typeof touched) {
		touched[field] = true;
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	async function handleRegister(event: Event) {
		event.preventDefault();
		touched = { firstName: true, lastName: true, email: true, password: true };
		if (!formValid) return;

		isLoading = true;
		errorMessage = '';
		successMessage = '';

		try {
			await authStore.register({
				firstName,
				lastName,
				email,
				password
			});
			successMessage = 'Account created successfully! Redirecting to login...';
			setTimeout(() => goto(ROUTES.PUBLIC.LOGIN), 2000);
		} catch (error: any) {
			errorMessage = error.message || 'Registration failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
	<!-- Animated background (same as login) -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
		<div class="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
		<div class="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
		<div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
	</div>

	<div class="relative z-10 min-h-screen flex items-center justify-center p-4">
		<div class="w-full max-w-md">
			<div class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
				<div class="px-8 py-10 text-center">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg">
						<UserPlus class="w-8 h-8 text-white" />
					</div>
					<h1 class="text-4xl font-bold text-white mb-2">Create Account</h1>
					<p class="text-indigo-200">Join our community today</p>
				</div>

				<div class="px-8 pb-10">
					{#if errorMessage}
						<div class="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-shake">
							<AlertCircle class="w-5 h-5 text-red-300 mt-0.5" />
							<p class="text-sm text-red-100">{errorMessage}</p>
						</div>
					{/if}
					{#if successMessage}
						<div class="mb-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-100 animate-fadeIn">
							{successMessage}
						</div>
					{/if}

					<form onsubmit={handleRegister} class="space-y-5">
						<!-- First & Last Name -->
						<div class="grid grid-cols-2 gap-3">
							<div>
								<label class="text-sm text-indigo-200 mb-2 block">First Name</label>
								<input
									type="text"
									bind:value={firstName}
									onblur={() => handleBlur('firstName')}
									class="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
									placeholder="John"
									required
								/>
							</div>
							<div>
								<label class="text-sm text-indigo-200 mb-2 block">Last Name</label>
								<input
									type="text"
									bind:value={lastName}
									onblur={() => handleBlur('lastName')}
									class="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none"
									placeholder="Doe"
									required
								/>
							</div>
						</div>

						<!-- Email -->
						<div>
							<label class="text-sm text-indigo-200 mb-2 block">Email</label>
							<div class="relative">
								<Mail class="absolute left-4 top-3.5 h-5 w-5 text-indigo-300" />
								<input
									type="email"
									bind:value={email}
									onblur={() => handleBlur('email')}
									class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
									placeholder="you@example.com"
									required
								/>
							</div>
						</div>

						<!-- Password -->
						<div>
							<label class="text-sm text-indigo-200 mb-2 block">Password</label>
							<div class="relative">
								<Lock class="absolute left-4 top-3.5 h-5 w-5 text-indigo-300" />
								<input
									type={showPassword ? 'text' : 'password'}
									bind:value={password}
									onblur={() => handleBlur('password')}
									class="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
									placeholder="Create a password"
									required
								/>
								<button type="button" onclick={togglePasswordVisibility} class="absolute right-4 top-3.5 text-indigo-300 hover:text-white">
									{#if showPassword}
										<EyeOff class="w-5 h-5" />
									{:else}
										<Eye class="w-5 h-5" />
									{/if}
								</button>
							</div>
						</div>

						<!-- Submit -->
						<button
							type="submit"
							disabled={isLoading}
							class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all"
						>
							{#if isLoading}
								<Loader2 class="w-5 h-5 animate-spin" />
								<span>Registering...</span>
							{:else}
								<span>Create Account</span>
								<ArrowRight class="w-5 h-5" />
							{/if}
						</button>
					</form>

					<p class="mt-8 text-center text-sm text-indigo-200">
						Already have an account?
						<a href={ROUTES.PUBLIC.LOGIN} class="font-semibold text-white hover:text-indigo-300 transition-colors">
							Sign in
						</a>
					</p>
				</div>
			</div>

			<p class="mt-8 text-center text-xs text-indigo-300">
				By signing up, you agree to our
				<a href={ROUTES.PUBLIC.TERMS} class="underline hover:text-white">Terms of Service</a>
				and
				<a href={ROUTES.PUBLIC.PRIVACY} class="underline hover:text-white">Privacy Policy</a>.
			</p>
		</div>
	</div>
</div>