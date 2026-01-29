<script lang="ts">
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-svelte';
	import { authStore } from '$lib/stores/Auth.svelte.js';
	import { getLoginRedirectPath, getSafeReturnUrl, ROUTES } from '$lib/utils/Redirect';
	import { page } from '$app/state';

	// Svelte 5 reactive state
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let rememberMe = $state(false);
	let isLoading = $state(false);
	let errorMessage = $state('');

	// Get URL parameters
	const returnUrl = $derived(page.url.searchParams.get('returnUrl'));
	const errorParam = $derived(page.url.searchParams.get('error'));

	// Error messages for different scenarios
	const errorMessages: Record<string, string> = {
		'session_expired': 'Your session has expired. Please log in again.',
		'unauthorized': 'You don\'t have permission to access that page.',
		'admin_required': 'Admin privileges required for this area.',
		'token_invalid': 'Your login token is invalid. Please log in again.'
	};

	const urlErrorMessage = $derived(errorParam ? errorMessages[errorParam] : null);

	// Form validation state
	let touched = $state({
		email: false,
		password: false
	});

	// Derived validation errors
	let emailError = $derived(
		touched.email && !email
			? 'Email is required'
			: touched.email && !isValidEmail(email)
				? 'Please enter a valid email'
				: ''
	);

	let passwordError = $derived(
		touched.password && !password
			? 'Password is required'
			: touched.password && password.length < 2
				? 'Password must be at least 6 characters'
				: ''
	);

	let isFormValid = $derived(
		email && password && isValidEmail(email) && password.length >= 2
	);

	function isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function handleEmailBlur() {
		touched.email = true;
	}

	function handlePasswordBlur() {
		touched.password = true;
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		touched.email = true;
		touched.password = true;

		if (!isFormValid) return;

		isLoading = true;
		errorMessage = '';

		try {
			console.log('[LOGIN] Attempting login...');

			// ✅ Login returns void - user is set in authStore.user
			await authStore.login(email, password);

			console.log('[LOGIN] Login successful!');

			// ✅ Get user from store after successful login
			const user = authStore.user;

			if (!user) {
				throw new Error('Login succeeded but user not set in store');
			}

			console.log('[LOGIN] User role:', user.role);

			let redirectPath: string;

			if (returnUrl && getSafeReturnUrl(returnUrl, '') !== '') {
				// Option 1: User had a specific destination
				redirectPath = getSafeReturnUrl(returnUrl, '/');
				console.log('[LOGIN] Redirecting to return URL:', redirectPath);
			} else {
				// Option 2: Use role-based redirect
				redirectPath = getLoginRedirectPath(user.role);
				console.log('[LOGIN] Redirecting based on role:', redirectPath);
			}

			// Perform the redirect
			await goto(redirectPath);

		} catch (error: any) {
			errorMessage = error.message || 'Login failed. Please check your credentials.';
			console.error('[LOGIN] Error:', error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-indigo-950 via-purple-900 to-pink-900">
	<!-- Animated Background Elements -->
	<div class="absolute inset-0 overflow-hidden">
		<!-- Animated Orbs -->
		<div class="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
		<div class="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
		<div class="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

		<!-- Grid Pattern -->
		<div class="absolute inset-0 bg-grid-pattern opacity-10"></div>

		<!-- Floating Particles -->
		{#each Array(20) as _, i}
			<div
				class="absolute w-2 h-2 bg-white rounded-full opacity-30"
				style="left: {Math.random() * 100}%; top: {Math.random() * 100}%; animation: float {5 + Math.random() * 10}s linear infinite; animation-delay: {Math.random() * 5}s;"
			></div>
		{/each}
	</div>

	<!-- Main Content -->
	<div class="relative z-10 min-h-screen flex items-center justify-center p-4">
		<div class="w-full max-w-md">
			<!-- Login Card with Glassmorphism -->
			<div class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02]">
				<!-- Header -->
				<div class="px-8 py-10 text-center">
					<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg">
						<Lock class="w-8 h-8 text-white" />
					</div>
					<h1 class="text-4xl font-bold text-white mb-2">Welcome Back</h1>
					<p class="text-indigo-200">Sign in to continue your journey</p>
				</div>

				<!-- Form -->
				<div class="px-8 pb-10">
					<!-- Session Expired Warning -->
					{#if urlErrorMessage}
						<div class="mb-6 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/50 rounded-xl p-4 flex items-start gap-3 animate-shake">
							<AlertCircle class="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
							<div class="flex-1">
								<p class="text-sm font-semibold text-yellow-100 mb-1">Session Issue</p>
								<p class="text-sm text-yellow-200">{urlErrorMessage}</p>
							</div>
						</div>
					{/if}
					<!-- Login Error -->
					{#if errorMessage}
						<div class="mb-6 bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-shake">
							<AlertCircle class="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
							<p class="text-sm text-red-100">{errorMessage}</p>
						</div>
					{/if}

					<form onsubmit={handleSubmit} class="space-y-5">
						<!-- Email Field -->
						<div class="group">
							<label for="email" class="block text-sm font-medium text-indigo-200 mb-2">
								Email Address
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<Mail class="h-5 w-5 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
								</div>
								<input
									id="email"
									type="email"
									bind:value={email}
									onblur={handleEmailBlur}
									disabled={isLoading}
									class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
									placeholder="you@example.com"
									autocomplete="email"
								/>
							</div>
							{#if emailError}
								<p class="mt-2 text-sm text-red-300 animate-fadeIn">{emailError}</p>
							{/if}
						</div>

						<!-- Password Field -->
						<div class="group">
							<label for="password" class="block text-sm font-medium text-indigo-200 mb-2">
								Password
							</label>
							<div class="relative">
								<div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
									<Lock class="h-5 w-5 text-indigo-300 group-focus-within:text-indigo-400 transition-colors" />
								</div>
								<input
									id="password"
									type={showPassword ? 'text' : 'password'}
									bind:value={password}
									onblur={handlePasswordBlur}
									disabled={isLoading}
									class="w-full pl-12 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
									placeholder="Enter your password"
									autocomplete="current-password"
								/>
								<button
									type="button"
									onclick={togglePasswordVisibility}
									disabled={isLoading}
									class="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-300 hover:text-white transition-colors disabled:cursor-not-allowed"
									aria-label={showPassword ? 'Hide forgot-password' : 'Show forgot-password'}
								>
									{#if showPassword}
										<EyeOff class="h-5 w-5" />
									{:else}
										<Eye class="h-5 w-5" />
									{/if}
								</button>
							</div>
							{#if passwordError}
								<p class="mt-2 text-sm text-red-300 animate-fadeIn">{passwordError}</p>
							{/if}
						</div>

						<!-- Remember Me & Forgot Password -->
						<div class="flex items-center justify-between">
							<label class="flex items-center cursor-pointer group">
								<input
									type="checkbox"
									bind:checked={rememberMe}
									disabled={isLoading}
									class="w-4 h-4 text-indigo-600 bg-white/10 border-white/20 rounded focus:ring-indigo-500 cursor-pointer disabled:cursor-not-allowed"
								/>
								<span class="ml-2 text-sm text-indigo-200 group-hover:text-white transition-colors">Remember me</span>
							</label>
							<a
								href={ROUTES.PUBLIC.FORGOT_PASSWORD}
								class="text-sm font-medium text-indigo-300 hover:text-white transition-colors"
							>
								Forgot password?
							</a>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={isLoading}
							class="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						>
							{#if isLoading}
								<Loader2 class="w-5 h-5 animate-spin" />
								<span>Signing in...</span>
							{:else}
								<span>Sign In</span>
								<ArrowRight class="w-5 h-5" />
							{/if}
						</button>
					</form>

					<!-- Divider -->
					<div class="relative my-8">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-white/20"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="px-4 bg-transparent text-indigo-300">Or continue with</span>
						</div>
					</div>

					<!-- Social Login Buttons -->
					<div class="grid grid-cols-2 gap-3">
						<button class="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
								<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
								<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
								<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
								<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
							</svg>
							<span class="text-sm font-medium">Google</span>
						</button>
						<button class="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all">
							<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
								<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
							</svg>
							<span class="text-sm font-medium">GitHub</span>
						</button>
					</div>

					<!-- Sign Up Link -->
					<p class="mt-8 text-center text-sm text-indigo-200">
						Don't have an account?
						<a
							href={ROUTES.PUBLIC.REGISTER}
							class="font-semibold text-white hover:text-indigo-300 transition-colors"
						>
							Sign up for free
						</a>
					</p>
				</div>
			</div>

			<!-- Footer -->
			<p class="mt-8 text-center text-xs text-indigo-300">
				By signing in, you agree to our
				<a href={ROUTES.PUBLIC.TERMS} class="underline hover:text-white transition-colors">Terms of Service</a>
				and
				<a href={ROUTES.PUBLIC.PRIVACY} class="underline hover:text-white transition-colors">Privacy Policy</a>
			</p>
		</div>
	</div>
</div>

<style>
    @keyframes blob {
        0%, 100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, -50px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    :global(.animate-blob) {
        animation: blob 7s infinite;
    }

    :global(.animation-delay-2000) {
        animation-delay: 2s;
    }

    :global(.animation-delay-4000) {
        animation-delay: 4s;
    }

    :global(.animate-fadeIn) {
        animation: fadeIn 0.3s ease-out;
    }

    :global(.animate-shake) {
        animation: shake 0.5s ease-in-out;
    }

    :global(.animate-spin) {
        animation: spin 1s linear infinite;
    }

    .bg-grid-pattern {
        background-image:
                linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        background-size: 50px 50px;
    }
</style>