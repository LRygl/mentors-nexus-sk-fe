<script lang="ts">
	import {
		Mail,
		Phone,
		MapPin,
		Clock,
		Send,
		MessageSquare,
		User,
		Building,
		CheckCircle2,
		Sparkles,
		Facebook,
		Twitter,
		Linkedin,
		Instagram,
		Youtube
	} from 'lucide-svelte';
	import { onMount } from 'svelte';
	import BadgeComponent from '$lib/components/Sections/Public/BadgeComponent.svelte';

	let formData = $state({
		name: '',
		email: '',
		phone: '',
		company: '',
		subject: '',
		message: ''
	});

	let formErrors = $state<Record<string, string>>({});
	let isSubmitting = $state(false);
	let submitSuccess = $state(false);
	let contentVisible = $state(false);

	const contactMethods = [
		{
			icon: Mail,
			title: 'Email Us',
			subtitle: 'Response within 24 hours',
			value: 'support@example.com',
			href: 'mailto:support@example.com',
			color: 'from-blue-500 to-cyan-500',
			description: 'Send us an email anytime'
		},
		{
			icon: Phone,
			title: 'Call Us',
			subtitle: 'Mon-Fri, 9AM-6PM EST',
			value: '+1 (555) 123-4567',
			href: 'tel:+15551234567',
			color: 'from-purple-500 to-pink-500',
			description: 'Speak with our team directly'
		},
		{
			icon: MessageSquare,
			title: 'Live Chat',
			subtitle: 'Available 24/7',
			value: 'Start chatting now',
			href: '#',
			color: 'from-emerald-500 to-teal-500',
			description: 'Get instant support'
		},
		{
			icon: MapPin,
			title: 'Visit Us',
			subtitle: 'Headquarters',
			value: '123 Learning Street, San Francisco, CA 94103',
			href: 'https://maps.google.com',
			color: 'from-orange-500 to-red-500',
			description: 'Come visit our office'
		}
	];

	const socialLinks = [
		{ icon: Facebook, href: '#', label: 'Facebook', color: 'hover:text-blue-600' },
		{ icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
		{ icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
		{ icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-600' },
		{ icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-600' }
	];

	const faqs = [
		{
			question: 'What is your response time?',
			answer: 'We typically respond to all inquiries within 24 hours during business days.'
		},
		{
			question: 'Do you offer phone support?',
			answer: 'Yes! Our phone support is available Monday-Friday, 9AM-6PM EST.'
		},
		{
			question: 'Can I schedule a demo?',
			answer: 'Absolutely! Fill out the contact form and mention you\'d like a demo in your message.'
		}
	];

	onMount(() => {
		setTimeout(() => {
			contentVisible = true;
		}, 100);
	});

	function validateField(name: string, value: any): string | null {
		if (!value || !value.toString().trim()) {
			return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
		}

		if (name === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				return 'Please enter a valid email address';
			}
		}

		if (name === 'phone' && value) {
			const phoneRegex = /^[\d\s\-\+\(\)]+$/;
			if (!phoneRegex.test(value)) {
				return 'Please enter a valid phone number';
			}
		}

		return null;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		// Validate all fields
		const errors: Record<string, string> = {};
		const requiredFields = ['name', 'email', 'subject', 'message'];

		requiredFields.forEach(field => {
			const error = validateField(field, formData[field as keyof typeof formData]);
			if (error) {
				errors[field] = error;
			}
		});

		formErrors = errors;

		if (Object.keys(errors).length === 0) {
			isSubmitting = true;

			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000));

			// Success
			submitSuccess = true;
			isSubmitting = false;

			// Reset form
			setTimeout(() => {
				formData = {
					name: '',
					email: '',
					phone: '',
					company: '',
					subject: '',
					message: ''
				};
				submitSuccess = false;
			}, 3000);
		}
	}

	function updateField(field: keyof typeof formData, value: string) {
		formData[field] = value;
		// Clear error when user starts typing
		if (formErrors[field]) {
			const newErrors = { ...formErrors };
			delete newErrors[field];
			formErrors = newErrors;
		}
	}
</script>

<svelte:head>
	<title>Contact Us - Get in Touch</title>
	<meta name="description" content="Have questions? Contact our team and we'll be happy to help you." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">

	<!-- Hero Section -->
	<section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-24">
		<!-- Animated Background -->
		<div class="absolute inset-0 opacity-30">
			<div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
		</div>

		<!-- Floating Particles -->
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			{#each Array(10) as _, i}
				<div
					class="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
					style="
						left: {Math.random() * 100}%;
						top: {Math.random() * 100}%;
						animation-delay: {Math.random() * 5}s;
						animation-duration: {3 + Math.random() * 4}s;
					"
				></div>
			{/each}
		</div>

		<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
			<BadgeComponent
				text="We're Here to Help"
				icon={MessageSquare}
				variant="transparent"
				position="center"
				class="mb-6"
			/>

			<h1 class="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight animate-fade-in-up">
				Get in Touch
			</h1>

			<p class="text-xl lg:text-2xl text-blue-100 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style="animation-delay: 0.1s">
				Have a question or need assistance? Our team is ready to help you succeed.
			</p>

			<!-- Quick Stats -->
			<div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 animate-fade-in-up" style="animation-delay: 0.2s">
				<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
					<div class="text-2xl font-bold text-white">&lt;10min</div>
					<div class="text-sm text-blue-200">Response Time</div>
				</div>
				<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
					<div class="text-2xl font-bold text-white">24/7</div>
					<div class="text-sm text-blue-200">Support</div>
				</div>
				<div class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
					<div class="text-2xl font-bold text-white">98%</div>
					<div class="text-sm text-blue-200">Satisfaction</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Contact Methods -->
	<section class="py-16 px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
		<div class="max-w-7xl mx-auto">
			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				{#each contactMethods as method, i}
					<a href={method.href}
					class="group bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-in"
					style="animation-delay: {i * 0.1}s"
					class:opacity-100={contentVisible}
					>
					<div class="absolute inset-0 bg-gradient-to-br {method.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>

					<div class="relative">
						<div class="w-16 h-16 rounded-2xl bg-gradient-to-br {method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
							<svelte:component this={method.icon} class="w-8 h-8 text-white" />
						</div>

						<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
							{method.title}
						</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
							{method.subtitle}
						</p>
						<p class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
							{method.value}
						</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">
							{method.description}
						</p>
					</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact Form Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<div class="grid lg:grid-cols-2 gap-12 items-start">

				<!-- Left: Form Info -->
				<div class="space-y-8">
					<div class="animate-slide-in-left" class:opacity-100={contentVisible}>
						<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
							Send us a Message
						</h2>
						<p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
							Fill out the form and our team will get back to you within 24 hours. We're here to answer any questions you may have.
						</p>
					</div>

					<!-- Office Hours -->
					<div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800/50 animate-slide-in-left" class:opacity-100={contentVisible} style="animation-delay: 0.1s">
						<div class="flex items-start gap-4">
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
								<Clock class="w-6 h-6 text-white" />
							</div>
							<div>
								<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3">
									Office Hours
								</h3>
								<div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
									<div class="flex justify-between">
										<span class="font-medium">Monday - Friday:</span>
										<span>9:00 AM - 6:00 PM EST</span>
									</div>
									<div class="flex justify-between">
										<span class="font-medium">Saturday:</span>
										<span>10:00 AM - 4:00 PM EST</span>
									</div>
									<div class="flex justify-between">
										<span class="font-medium">Sunday:</span>
										<span>Closed</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Social Media -->
					<div class="animate-slide-in-left" class:opacity-100={contentVisible} style="animation-delay: 0.2s">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
							Follow Us
						</h3>
						<div class="flex items-center gap-3">
							{#each socialLinks as social}
<a
								href={social.href}
								aria-label={social.label}
								class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-400 {social.color} hover:scale-110 transition-all duration-300 hover:shadow-lg"
								>
								<svelte:component this={social.icon} class="w-5 h-5" />
								</a>
							{/each}
						</div>
					</div>

					<!-- FAQs -->
					<div class="animate-slide-in-left" class:opacity-100={contentVisible} style="animation-delay: 0.3s">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
							Quick Answers
						</h3>
						<div class="space-y-3">
							{#each faqs as faq}
								<details class="group bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
									<summary class="flex items-center justify-between cursor-pointer font-semibold text-gray-900 dark:text-white">
										{faq.question}
										<CheckCircle2 class="w-5 h-5 text-blue-500 group-open:rotate-90 transition-transform" />
									</summary>
									<p class="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
										{faq.answer}
									</p>
								</details>
							{/each}
						</div>
					</div>
				</div>

				<!-- Right: Contact Form -->
				<div class="animate-fade-in-up" class:opacity-100={contentVisible} style="animation-delay: 0.2s">
					<form onsubmit={handleSubmit} class="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl">

						{#if submitSuccess}
							<div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-6 text-center animate-fade-in">
								<div class="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
									<CheckCircle2 class="w-8 h-8 text-white" />
								</div>
								<h3 class="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
									Message Sent!
								</h3>
								<p class="text-green-700 dark:text-green-300">
									We'll get back to you within 24 hours.
								</p>
							</div>
						{:else}
							<div class="space-y-6">
								<!-- Name -->
								<div>
									<label for="name" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Full Name <span class="text-red-500">*</span>
									</label>
									<div class="relative">
										<User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="text"
											id="name"
											value={formData.name}
											oninput={(e) => updateField('name', e.currentTarget.value)}
											placeholder="John Doe"
											class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
										/>
									</div>
									{#if formErrors.name}
										<p class="mt-2 text-sm text-red-500 flex items-center gap-1">
											<span class="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
											{formErrors.name}
										</p>
									{/if}
								</div>

								<!-- Email & Phone -->
								<div class="grid md:grid-cols-2 gap-4">
									<div>
										<label for="email" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
											Email <span class="text-red-500">*</span>
										</label>
										<div class="relative">
											<Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
											<input
												type="email"
												id="email"
												value={formData.email}
												oninput={(e) => updateField('email', e.currentTarget.value)}
												placeholder="john@example.com"
												class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
											/>
										</div>
										{#if formErrors.email}
											<p class="mt-2 text-sm text-red-500">
												{formErrors.email}
											</p>
										{/if}
									</div>

									<div>
										<label for="phone" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
											Phone
										</label>
										<div class="relative">
											<Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
											<input
												type="tel"
												id="phone"
												value={formData.phone}
												oninput={(e) => updateField('phone', e.currentTarget.value)}
												placeholder="+1 (555) 000-0000"
												class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
											/>
										</div>
									</div>
								</div>

								<!-- Company -->
								<div>
									<label for="company" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Company
									</label>
									<div class="relative">
										<Building class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
										<input
											type="text"
											id="company"
											value={formData.company}
											oninput={(e) => updateField('company', e.currentTarget.value)}
											placeholder="Acme Corp"
											class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
										/>
									</div>
								</div>

								<!-- Subject -->
								<div>
									<label for="subject" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Subject <span class="text-red-500">*</span>
									</label>
									<select
										id="subject"
										value={formData.subject}
										onchange={(e) => updateField('subject', e.currentTarget.value)}
										class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
									>
										<option value="" disabled selected>Select a subject</option>
										<option value="general">General Inquiry</option>
										<option value="support">Technical Support</option>
										<option value="billing">Billing Question</option>
										<option value="partnership">Partnership Opportunity</option>
										<option value="feedback">Feedback</option>
										<option value="other">Other</option>
									</select>
									{#if formErrors.subject}
										<p class="mt-2 text-sm text-red-500">
											{formErrors.subject}
										</p>
									{/if}
								</div>

								<!-- Message -->
								<div>
									<label for="message" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Message <span class="text-red-500">*</span>
									</label>
									<textarea
										id="message"
										value={formData.message}
										oninput={(e) => updateField('message', e.currentTarget.value)}
										rows="5"
										placeholder="Tell us how we can help you..."
										class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
									></textarea>
									{#if formErrors.message}
										<p class="mt-2 text-sm text-red-500">
											{formErrors.message}
										</p>
									{/if}
								</div>

								<!-- Submit Button -->
								<button
									type="submit"
									disabled={isSubmitting}
									class="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
								>
									{#if isSubmitting}
										<div class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
										Sending...
									{:else}
										<Send class="w-5 h-5" />
										Send Message
									{/if}
								</button>
							</div>
						{/if}
					</form>
				</div>
			</div>
		</div>
	</section>

	<!-- Map Section (Optional) -->
	<section class="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-800/50">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
					Visit Our Office
				</h2>
				<p class="text-lg text-gray-600 dark:text-gray-400">
					We'd love to meet you in person!
				</p>
			</div>

			<div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-xl">
				<div class="aspect-video bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
					<!-- Replace with actual map embed -->
					<div class="text-center">
						<MapPin class="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<p class="text-gray-600 dark:text-gray-400">
							123 Learning Street<br>
							San Francisco, CA 94103
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
    @keyframes float-particle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slide-in-left {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .animate-float-particle { animation: float-particle linear infinite; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; opacity: 0; }
    .animate-slide-in { animation: slide-in 0.8s ease-out forwards; opacity: 0; }
    .animate-slide-in-left { animation: slide-in-left 0.8s ease-out forwards; opacity: 0; }
    .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
</style>