<script lang="ts">
	import { Mail, Send, AlertCircle, Loader2 } from 'lucide-svelte';
	import { authStore } from '$lib/stores/Auth.svelte.js';
	import { ROUTES } from '$lib/Config/routes.config';

	let email = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	function isValidEmail(email: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!isValidEmail(email)) {
			errorMessage = 'Please enter a valid email address.';
			return;
		}

		isLoading = true;
		try {
			await authStore.requestPasswordReset(email);
			successMessage = 'If an account exists for that email, a reset link has been sent.';
		} catch (error: any) {
			errorMessage = error.message || 'Unable to send reset link. Try again later.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
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
						<Mail class="w-8 h-8 text-white" />
					</div>
					<h1 class="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
					<p class="text-indigo-200">Enter your email and we’ll send you a reset link.</p>
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

					<form onsubmit={handleSubmit} class="space-y-6">
						<div class="group">
							<label class="block text-sm font-medium text-indigo-200 mb-2">Email Address</label>
							<div class="relative">
								<Mail class="absolute left-4 top-3.5 h-5 w-5 text-indigo-300" />
								<input
									type="email"
									bind:value={email}
									class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
									placeholder="you@example.com"
									required
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-purple-500 transition-all"
						>
							{#if isLoading}
								<Loader2 class="w-5 h-5 animate-spin" />
								<span>Sending...</span>
							{:else}
								<span>Send Reset Link</span>
								<Send class="w-5 h-5" />
							{/if}
						</button>
					</form>

					<p class="mt-8 text-center text-sm text-indigo-200">
						Remembered your password?
						<a href={ROUTES.PUBLIC.LOGIN} class="font-semibold text-white hover:text-indigo-300 transition-colors">Back to Sign In</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>