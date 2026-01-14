<!-- src/routes/admin/+error.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	// Get error details
	const status = $derived($page.status);
	const message = $derived($page.error?.message || 'An unexpected error occurred');

	// Debug information
	const debugInfo = $derived({
		status: $page.status,
		url: $page.url.pathname,
		timestamp: new Date().toISOString(),
		userAgent: browser ? navigator.userAgent : 'N/A',
		referrer: browser ? document.referrer : 'N/A',
		error: $page.error
	});

	let showDebug = $state(false);
	let copied = $state(false);

	// Copy debug info to clipboard
	async function copyDebugInfo() {
		try {
			await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Get error configuration based on status
	const errorConfig = $derived((() => {
		switch (status) {
			case 404:
				return {
					icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.17 4a3.001 3.001 0 0 1 5.66 0l6.75 11.5a2.998 2.998 0 0 1-2.58 4.5H5a2.998 2.998 0 0 1-2.58-4.5L9.17 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 9v4M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`,
					title: '404',
					subtitle: 'Resource Not Found',
					description: 'The page or resource you\'re looking for doesn\'t exist, may have been moved, or is temporarily unavailable.',
					bgGradient: 'from-orange-500/10 via-red-500/10 to-pink-500/10',
					borderColor: 'border-orange-200',
					iconBg: 'bg-gradient-to-br from-orange-500 to-red-500',
					badgeBg: 'bg-orange-100',
					badgeText: 'text-orange-700',
					accentColor: 'text-orange-600'
				};
			case 403:
				return {
					icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2a5 5 0 0 1 5 5v3h-2V7a3 3 0 0 0-6 0v3H7V7a5 5 0 0 1 5-5Z" fill="currentColor"/>
                        <path d="M6 10a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H6Z" stroke="currentColor" stroke-width="2"/>
                        <circle cx="12" cy="16" r="2" fill="currentColor"/>
                    </svg>`,
					title: '403',
					subtitle: 'Access Forbidden',
					description: 'You don\'t have the necessary permissions to access this resource. Please contact your administrator if you believe this is an error.',
					bgGradient: 'from-amber-500/10 via-yellow-500/10 to-orange-500/10',
					borderColor: 'border-amber-200',
					iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
					badgeBg: 'bg-amber-100',
					badgeText: 'text-amber-700',
					accentColor: 'text-amber-600'
				};
			case 500:
				return {
					icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="m2 17 10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12 22V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor"/>
                    </svg>`,
					title: '500',
					subtitle: 'Internal Server Error',
					description: 'Something went wrong on our end. Our team has been notified and is working to resolve the issue. Please try again later.',
					bgGradient: 'from-red-500/10 via-rose-500/10 to-pink-500/10',
					borderColor: 'border-red-200',
					iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
					badgeBg: 'bg-red-100',
					badgeText: 'text-red-700',
					accentColor: 'text-red-600'
				};
			case 503:
				return {
					icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>`,
					title: '503',
					subtitle: 'Service Unavailable',
					description: 'The service is temporarily unavailable due to maintenance or high load. Please try again in a few minutes.',
					bgGradient: 'from-purple-500/10 via-violet-500/10 to-indigo-500/10',
					borderColor: 'border-purple-200',
					iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-500',
					badgeBg: 'bg-purple-100',
					badgeText: 'text-purple-700',
					accentColor: 'text-purple-600'
				};
			default:
				return {
					icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>`,
					title: status.toString(),
					subtitle: 'An Error Occurred',
					description: 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
					bgGradient: 'from-slate-500/10 via-gray-500/10 to-zinc-500/10',
					borderColor: 'border-slate-200',
					iconBg: 'bg-gradient-to-br from-slate-500 to-gray-600',
					badgeBg: 'bg-slate-100',
					badgeText: 'text-slate-700',
					accentColor: 'text-slate-600'
				};
		}
	})());
</script>

<svelte:head>
	<title>Error {status} - Admin Panel</title>
</svelte:head>

<div class="min-h-[75vh] flex items-center justify-center px-4 py-12">
	<div class="max-w-3xl w-full">
		<!-- Main Error Card -->
		<div class="relative">
			<!-- Decorative background blur circles -->
			<div class="absolute -top-24 -left-24 w-64 h-64 bg-gradient-to-br {errorConfig.iconBg} rounded-full blur-3xl opacity-20"></div>
			<div class="absolute -bottom-24 -right-24 w-64 h-64 bg-gradient-to-br {errorConfig.iconBg} rounded-full blur-3xl opacity-20"></div>

			<!-- Card -->
			<div class="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border {errorConfig.borderColor} overflow-hidden">
				<!-- Animated top border -->
				<div class="h-1 bg-gradient-to-r {errorConfig.iconBg} animate-pulse"></div>

				<div class="p-8 sm:p-12">
					<!-- Icon and Status -->
					<div class="flex flex-col items-center text-center mb-8">
						<!-- Large Error Icon -->
						<div class="relative mb-6">
							<div class="absolute inset-0 bg-gradient-to-br {errorConfig.iconBg} rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
							<div class="relative w-24 h-24 rounded-3xl {errorConfig.iconBg} text-white p-5 shadow-2xl transform hover:scale-105 transition-transform duration-300">
								{@html errorConfig.icon}
							</div>
						</div>

						<!-- Error Code Badge -->
						<div class="inline-flex items-center gap-2 px-4 py-2 {errorConfig.badgeBg} rounded-full mb-4">
							<div class="w-2 h-2 rounded-full {errorConfig.iconBg} animate-pulse"></div>
							<span class="text-sm font-bold {errorConfig.badgeText} tracking-wide">
                                ERROR CODE: {errorConfig.title}
                            </span>
						</div>

						<!-- Error Title -->
						<h1 class="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
							{errorConfig.subtitle}
						</h1>

						<!-- Error Description -->
						<p class="text-lg text-slate-600 max-w-xl leading-relaxed">
							{errorConfig.description}
						</p>
					</div>

					<!-- Error Message Box (if exists) -->
					{#if message && message !== errorConfig.description}
						<div class="mb-8 p-5 bg-slate-50 border-2 border-slate-200 rounded-2xl">
							<div class="flex items-start gap-3">
								<svg class="w-5 h-5 {errorConfig.accentColor} flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div class="flex-1">
									<p class="text-sm font-semibold text-slate-700 mb-1">Technical Details</p>
									<p class="text-sm text-slate-600 font-mono break-words">{message}</p>
								</div>
							</div>
						</div>
					{/if}

					<!-- Action Buttons -->
					<div class="flex flex-col sm:flex-row gap-3 mb-6">

						<a href="/admin/dashboard"
						class="flex-1 group relative px-6 py-4 bg-gradient-to-r {errorConfig.iconBg} text-white rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center overflow-hidden"
						>
						<span class="relative z-10 flex items-center justify-center gap-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Return to Dashboard
                            </span>
						<div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
						</a>

						<button
							onclick={() => window.history.back()}
							class="flex-1 px-6 py-4 bg-white border-2 {errorConfig.borderColor} text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							Go Back
						</button>

						<button
							onclick={() => window.location.reload()}
							class="px-6 py-4 bg-white border-2 {errorConfig.borderColor} text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
							title="Reload page"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						</button>
					</div>

					<!-- Debug Section Toggle -->
					<div class="pt-6 border-t-2 border-slate-100">
						<button
							onclick={() => showDebug = !showDebug}
							class="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
						>
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
									<svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
									</svg>
								</div>
								<div class="text-left">
									<p class="font-semibold text-slate-900">Debug Information</p>
									<p class="text-sm text-slate-500">For administrators and developers</p>
								</div>
							</div>
							<svg
								class="w-5 h-5 text-slate-400 transition-transform duration-300 {showDebug ? 'rotate-180' : ''}"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						<!-- Debug Panel -->
						{#if showDebug}
							<div class="mt-4 space-y-4 animate-in slide-in-from-top duration-300">
								<!-- Debug Info Grid -->
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
									<div class="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
										<div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status Code</div>
										<div class="text-2xl font-bold {errorConfig.accentColor}">{debugInfo.status}</div>
									</div>
									<div class="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
										<div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timestamp</div>
										<div class="text-sm font-mono text-slate-700">{new Date(debugInfo.timestamp).toLocaleString()}</div>
									</div>
									<div class="sm:col-span-2 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
										<div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Request URL</div>
										<div class="text-sm font-mono text-slate-700 break-all">{debugInfo.url}</div>
									</div>
									{#if debugInfo.referrer && debugInfo.referrer !== 'N/A'}
										<div class="sm:col-span-2 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
											<div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Referrer</div>
											<div class="text-sm font-mono text-slate-700 break-all">{debugInfo.referrer}</div>
										</div>
									{/if}
									<div class="sm:col-span-2 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
										<div class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">User Agent</div>
										<div class="text-xs font-mono text-slate-700 break-all">{debugInfo.userAgent}</div>
									</div>
								</div>

								<!-- Raw Error JSON -->
								{#if debugInfo.error}
									<div class="p-5 bg-slate-900 rounded-xl border-2 border-slate-700 shadow-inner">
										<div class="flex items-center justify-between mb-3">
											<div class="flex items-center gap-2">
												<div class="w-3 h-3 rounded-full bg-red-500"></div>
												<div class="w-3 h-3 rounded-full bg-yellow-500"></div>
												<div class="w-3 h-3 rounded-full bg-green-500"></div>
												<span class="ml-2 text-xs font-mono text-slate-400">error.json</span>
											</div>
											<button
												onclick={copyDebugInfo}
												class="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
											>
												{#if copied}
													<svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
													Copied!
												{:else}
													<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
													</svg>
													Copy JSON
												{/if}
											</button>
										</div>
										<pre class="text-xs text-slate-300 overflow-x-auto font-mono leading-relaxed"><code>{JSON.stringify(debugInfo, null, 2)}</code></pre>
									</div>
								{/if}

								<!-- Support Notice -->
								<div class="flex items-start gap-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
									<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
										<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
										</svg>
									</div>
									<div class="flex-1">
										<p class="font-semibold text-blue-900 mb-1">Need Help?</p>
										<p class="text-sm text-blue-700 leading-relaxed">
											Copy the debug information above and include it when reporting this issue to the development team. This will help us resolve the problem faster.
										</p>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    @keyframes slide-in-from-top {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-in {
        animation: slide-in-from-top 0.3s ease-out;
    }
</style>