<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-svelte';
	import { ROUTES } from '$lib/Config/routes.config';

	type Status = 'loading' | 'success' | 'error';

	let status = $state<Status>('loading');
	let message = $state('Verifying your account...');
	let countdown = $state(5);
	let countdownInterval: ReturnType<typeof setInterval> | null = null;
	let contentVisible = $state(false);

	onMount(async () => {
		const token = page.url.searchParams.get('token');

		// Trigger animations
		setTimeout(() => {
			contentVisible = true;
		}, 100);

		if (!token) {
			status = 'error';
			message = 'No verification token found in the URL';
			return;
		}

		// Small delay to show loading animation
		await new Promise(resolve => setTimeout(resolve, 1000));

		await verifyAccount(token);

		return () => {
			if (countdownInterval) {
				clearInterval(countdownInterval);
			}
		};
	});


	//TODO Move to separate API CALL with parametrized URL
	async function verifyAccount(token: string) {
		try {
			// Replace with your actual API endpoint
			const response = await fetch(
				`http://localhost:8080/api/v1/auth/activate?token=${encodeURIComponent(token)}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Verification failed');
			}

			status = 'success';
			message = data.message || 'Your account has been successfully activated!';
			startCountdown();

		} catch (err) {
			status = 'error';
			message = err instanceof Error ? err.message : 'Something went wrong during verification';
		}
	}

	function startCountdown() {
		countdownInterval = setInterval(() => {
			countdown--;
			if (countdown <= 0) {
				if (countdownInterval) {
					clearInterval(countdownInterval);
				}
				goto(ROUTES.PUBLIC.LOGIN);
			}
		}, 1000);
	}

	function navigateToLogin() {
		if (countdownInterval) {
			clearInterval(countdownInterval);
		}
		goto(ROUTES.PUBLIC.LOGIN);
	}

	function requestNewLink() {
		goto('/auth/resend-verification');
	}
</script>

<svelte:head>
	<title>
		{status === 'loading' ? 'Verifying Account...' : status === 'success' ? 'Account Activated' : 'Verification Failed'}
	</title>
</svelte:head>

<section class="page-container">
	<!-- Background Elements - matching your gradient orb style -->
	<div class="background-effects">
		<div class="gradient-orb orb-1"></div>
		<div class="gradient-orb orb-2"></div>
		<div class="gradient-orb orb-3"></div>
	</div>

	<div class="content-wrapper" class:opacity-100={contentVisible}>
		<!-- Main Card - glassmorphism matching your style -->
		<div class="glass-card" class:success-card={status === 'success'} class:error-card={status === 'error'}>

			{#if status === 'loading'}
				<div class="card-content animate-fade-in">
					<div class="icon-wrapper">
						<div class="spinner">
							<div class="spinner-ring ring-1"></div>
							<div class="spinner-ring ring-2"></div>
							<div class="spinner-ring ring-3"></div>
						</div>
					</div>

					<h1 class="title">Verifying Your Account</h1>
					<p class="subtitle">Please wait while we confirm your email address...</p>

					<div class="loading-dots">
						<span class="dot"></span>
						<span class="dot"></span>
						<span class="dot"></span>
					</div>
				</div>

			{:else if status === 'success'}
				<div class="card-content animate-fade-in">
					<div class="icon-wrapper success-icon animate-float">
						<div class="icon-bg success-bg"></div>
						<CheckCircle size={56} strokeWidth={1.5} />
						<div class="pulse-rings">
							<div class="pulse-ring"></div>
							<div class="pulse-ring delay-1"></div>
							<div class="pulse-ring delay-2"></div>
						</div>
					</div>

					<h1 class="title">
						Account
						<span class="gradient-text">Activated!</span>
					</h1>
					<p class="subtitle">{message}</p>

					<div class="redirect-box">
						<div class="countdown-container">
							<svg class="countdown-svg" viewBox="0 0 40 40">
								<circle
									class="countdown-bg"
									cx="20"
									cy="20"
									r="18"
								/>
								<circle
									class="countdown-progress"
									cx="20"
									cy="20"
									r="18"
									style="stroke-dashoffset: {113 - (countdown / 5) * 113}"
								/>
							</svg>
							<span class="countdown-number">{countdown}</span>
						</div>
						<span class="redirect-text">Redirecting to login...</span>
					</div>

					<button class="btn btn-primary" onclick={navigateToLogin}>
						<span>Go to Login Now</span>
						<ArrowRight size={18} />
					</button>
				</div>

			{:else}
				<div class="card-content animate-fade-in">
					<div class="icon-wrapper error-icon">
						<div class="icon-bg error-bg"></div>
						<XCircle size={56} strokeWidth={1.5} />
					</div>

					<h1 class="title">Verification Failed</h1>
					<p class="subtitle">{message}</p>

					<div class="error-reasons">
						<p class="reasons-title">This could happen if:</p>
						<ul class="reasons-list">
							<li>The verification link has expired</li>
							<li>The link has already been used</li>
							<li>The link is invalid or corrupted</li>
						</ul>
					</div>

					<div class="btn-group">
						<button class="btn btn-primary" onclick={requestNewLink}>
							<RefreshCw size={18} />
							<span>Request New Link</span>
						</button>
						<button class="btn btn-secondary" onclick={navigateToLogin}>
							<span>Back to Login</span>
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Footer Link -->
		<p class="footer-text">
			Need help? <a href="/support" class="footer-link">Contact Support</a>
		</p>
	</div>
</section>

<style>
    /* Base Layout */
    .page-container {
        position: relative;
        min-height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        overflow: hidden;
    }

    /* Background Effects - matching your about-us style */
    .background-effects {
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.3;
    }

    .gradient-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        animation: float 6s ease-in-out infinite;
    }

    .orb-1 {
        width: 500px;
        height: 500px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
        top: -150px;
        right: -100px;
    }

    .orb-2 {
        width: 400px;
        height: 400px;
        background: linear-gradient(135deg, rgba(147, 51, 234, 0.25), rgba(236, 72, 153, 0.25));
        bottom: -100px;
        left: -100px;
        animation-delay: -2s;
    }

    .orb-3 {
        width: 300px;
        height: 300px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation-delay: -4s;
    }

    /* Content Wrapper */
    .content-wrapper {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 480px;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }

    .content-wrapper.opacity-100 {
        opacity: 1;
        transform: translateY(0);
    }

    /* Glass Card - matching your glassmorphism style */
    .glass-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 3rem 2.5rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        transition: all 0.3s ease;
    }

    .glass-card.success-card {
        border-color: rgba(34, 197, 94, 0.3);
        box-shadow: 0 25px 50px -12px rgba(34, 197, 94, 0.15);
    }

    .glass-card.error-card {
        border-color: rgba(239, 68, 68, 0.3);
        box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.15);
    }

    .card-content {
        text-align: center;
    }

    /* Typography */
    .title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-primary, hsl(var(--foreground)));
        margin-bottom: 0.75rem;
        line-height: 1.2;
    }

    .gradient-text {
        background: linear-gradient(135deg, #60a5fa, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .subtitle {
        font-size: 1rem;
        color: var(--color-primary, hsl(var(--foreground)));
        opacity: 0.7;
        line-height: 1.6;
        margin-bottom: 2rem;
    }

    /* Icon Wrapper */
    .icon-wrapper {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .icon-bg {
        position: absolute;
        inset: 0;
        border-radius: 50%;
    }

    .icon-bg.success-bg {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
    }

    .icon-bg.error-bg {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
    }

    .success-icon {
        color: #22c55e;
    }

    .error-icon {
        color: #ef4444;
        animation: error-shake 0.5s ease-out;
    }

    /* Spinner */
    .spinner {
        width: 80px;
        height: 80px;
        position: relative;
    }

    .spinner-ring {
        position: absolute;
        inset: 0;
        border: 3px solid transparent;
        border-radius: 50%;
    }

    .ring-1 {
        border-top-color: #3b82f6;
        animation: spin 1.2s linear infinite;
    }

    .ring-2 {
        inset: 10px;
        border-right-color: #8b5cf6;
        animation: spin 1.5s linear infinite reverse;
    }

    .ring-3 {
        inset: 20px;
        border-bottom-color: #a855f7;
        animation: spin 1s linear infinite;
    }

    /* Loading Dots */
    .loading-dots {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1.5rem;
    }

    .dot {
        width: 10px;
        height: 10px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 50%;
        animation: dot-pulse 1.4s ease-in-out infinite;
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    /* Pulse Rings for Success */
    .pulse-rings {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .pulse-ring {
        position: absolute;
        inset: 0;
        border: 2px solid #22c55e;
        border-radius: 50%;
        animation: pulse-expand 2s ease-out infinite;
    }

    .pulse-ring.delay-1 { animation-delay: 0.4s; }
    .pulse-ring.delay-2 { animation-delay: 0.8s; }

    /* Redirect Box */
    .redirect-box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.2);
        border-radius: 16px;
        margin-bottom: 1.5rem;
    }

    .countdown-container {
        position: relative;
        width: 40px;
        height: 40px;
        flex-shrink: 0;
    }

    .countdown-svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }

    .countdown-bg {
        fill: none;
        stroke: rgba(34, 197, 94, 0.2);
        stroke-width: 3;
    }

    .countdown-progress {
        fill: none;
        stroke: #22c55e;
        stroke-width: 3;
        stroke-linecap: round;
        stroke-dasharray: 113;
        transition: stroke-dashoffset 1s linear;
    }

    .countdown-number {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
        color: #22c55e;
    }

    .redirect-text {
        color: #4ade80;
        font-size: 0.95rem;
    }

    /* Error Reasons */
    .error-reasons {
        padding: 1.25rem 1.5rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.2);
        border-radius: 16px;
        text-align: left;
        margin-bottom: 1.5rem;
    }

    .reasons-title {
        font-size: 0.9rem;
        color: var(--color-primary, hsl(var(--foreground)));
        opacity: 0.7;
        margin-bottom: 0.5rem;
    }

    .reasons-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .reasons-list li {
        position: relative;
        padding-left: 1.25rem;
        font-size: 0.9rem;
        color: var(--color-primary, hsl(var(--foreground)));
        opacity: 0.7;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
    }

    .reasons-list li::before {
        content: '•';
        position: absolute;
        left: 0;
        color: #ef4444;
        font-weight: bold;
    }

    /* Buttons */
    .btn-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.875rem 1.5rem;
        font-size: 0.95rem;
        font-weight: 500;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: inherit;
    }

    .btn-primary {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        box-shadow: 0 4px 20px -5px rgba(99, 102, 241, 0.5);
    }

    .success-card .btn-primary {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        box-shadow: 0 4px 20px -5px rgba(34, 197, 94, 0.5);
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px -5px rgba(99, 102, 241, 0.6);
    }

    .success-card .btn-primary:hover {
        box-shadow: 0 8px 30px -5px rgba(34, 197, 94, 0.6);
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.05);
        color: var(--color-primary, hsl(var(--foreground)));
        opacity: 0.7;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        opacity: 1;
    }

    /* Footer */
    .footer-text {
        text-align: center;
        margin-top: 2rem;
        font-size: 0.9rem;
        color: var(--color-primary, hsl(var(--foreground)));
        opacity: 0.6;
    }

    .footer-link {
        color: #60a5fa;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    .footer-link:hover {
        color: #93c5fd;
    }

    /* Animations - matching your existing animation style */
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-10px) rotate(1deg); }
        66% { transform: translateY(5px) rotate(-1deg); }
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    @keyframes dot-pulse {
        0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes pulse-expand {
        0% {
            transform: scale(0.8);
            opacity: 0.8;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    @keyframes error-shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    /* Responsive */
    @media (max-width: 540px) {
        .page-container {
            padding: 1rem;
        }

        .glass-card {
            padding: 2rem 1.5rem;
            border-radius: 20px;
        }

        .title {
            font-size: 1.5rem;
        }

        .icon-wrapper {
            width: 100px;
            height: 100px;
        }
    }
</style>