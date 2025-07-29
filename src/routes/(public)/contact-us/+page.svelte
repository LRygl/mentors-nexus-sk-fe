<!-- Contact us public page -->
<script lang="ts">
	import { Mail, Phone, MapPin, Clock, Send, User, MessageSquare, HelpCircle, CheckCircle, AlertCircle, Sparkles } from 'lucide-svelte';
	import HeaderSection from '$lib/components/Sections/header-section.svelte';

	// Form state management
	let formData = $state({
		name: '',
		email: '',
		subject: '',
		category: '',
		message: '',
		priority: 'medium'
	});

	let formStatus = $state<'idle' | 'submitting' | 'success' | 'error'>('idle');
	let formErrors = $state<Record<string, string>>({});

	// Contact categories for the form
	const contactCategories = [
		{ value: 'general', label: 'General Inquiry' },
		{ value: 'technical', label: 'Technical Support' },
		{ value: 'billing', label: 'Billing & Payments' },
		{ value: 'courses', label: 'Course Information' },
		{ value: 'partnership', label: 'Partnership Opportunities' },
		{ value: 'feedback', label: 'Feedback & Suggestions' }
	];

	const priorities = [
		{ value: 'low', label: 'Low Priority', color: 'text-green-600' },
		{ value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
		{ value: 'high', label: 'High Priority', color: 'text-red-600' }
	];

	// Contact information
	const contactInfo = [
		{
			icon: Mail,
			title: 'Email Support',
			primary: 'support@lmsplatform.com',
			secondary: 'Available 24/7 with quick response',
			color: 'from-blue-500 to-cyan-500'
		},
		{
			icon: Phone,
			title: 'Phone Support',
			primary: '+1 (555) 123-4567',
			secondary: 'Mon-Fri, 9AM-6PM EST',
			color: 'from-green-500 to-teal-500'
		},
		{
			icon: MapPin,
			title: 'Main Office',
			primary: '123 Learning Street',
			secondary: 'San Francisco, CA 94105',
			color: 'from-purple-500 to-pink-500'
		},
		{
			icon: Clock,
			title: 'Business Hours',
			primary: 'Monday - Friday',
			secondary: '9:00 AM - 6:00 PM EST',
			color: 'from-orange-500 to-red-500'
		}
	];

	// FAQ items
	const faqItems = [
		{
			question: 'How quickly will I receive a response?',
			answer: 'We typically respond to inquiries within 2-4 hours during business hours. For urgent technical issues, we aim to respond within 1 hour.'
		},
		{
			question: 'What information should I include in my message?',
			answer: 'Please include your account email, a detailed description of your issue or question, and any relevant screenshots or error messages.'
		},
		{
			question: 'Do you offer phone support?',
			answer: 'Yes! Phone support is available Monday through Friday, 9AM-6PM EST. For immediate assistance, you can also use our live chat feature.'
		},
		{
			question: 'Can I schedule a demo or consultation?',
			answer: 'Absolutely! Select "Partnership Opportunities" or "General Inquiry" in the form above, and mention that you\'d like to schedule a demo.'
		}
	];

	// Form validation
	function validateForm(): boolean {
		const errors: Record<string, string> = {};

		if (!formData.name.trim()) {
			errors.name = 'Name is required';
		}

		if (!formData.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = 'Please enter a valid email address';
		}

		if (!formData.subject.trim()) {
			errors.subject = 'Subject is required';
		}

		if (!formData.category) {
			errors.category = 'Please select a category';
		}

		if (!formData.message.trim()) {
			errors.message = 'Message is required';
		} else if (formData.message.trim().length < 10) {
			errors.message = 'Message must be at least 10 characters long';
		}

		formErrors = errors;
		return Object.keys(errors).length === 0;
	}

	// Form submission handler
	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		formStatus = 'submitting';

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000));

			// In a real application, you would make an API call here
			console.log('Form submitted:', formData);

			formStatus = 'success';

			// Reset form after successful submission
			setTimeout(() => {
				formData = {
					name: '',
					email: '',
					subject: '',
					category: '',
					message: '',
					priority: 'medium'
				};
				formStatus = 'idle';
			}, 3000);

		} catch (error) {
			formStatus = 'error';
			setTimeout(() => {
				formStatus = 'idle';
			}, 3000);
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
	<!-- Header Section -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-gray-800 dark:text-gray-100">
		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<HeaderSection
				heading="Contact Us"
				subHeading="We're here to help! Reach out with any questions, feedback, or support needs."
				showBadge={true}
				badgeText="Support"
			/>
		</div>
	</section>

	<!-- Main Content -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

		<!-- Contact Information Cards -->
		<div class="mb-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each contactInfo as info}
				<div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
					<div class="flex items-center gap-4 mb-4">
						<div class="w-12 h-12 bg-gradient-to-r {info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
							<svelte:component this={info.icon} class="w-6 h-6 text-white" />
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-gray-100">{info.title}</h3>
						</div>
					</div>
					<p class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">{info.primary}</p>
					<p class="text-sm text-gray-600 dark:text-gray-400">{info.secondary}</p>
				</div>
			{/each}
		</div>

		<div class="grid lg:grid-cols-3 gap-12">
			<!-- Contact Form -->
			<div class="lg:col-span-2">
				<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8">
					<div class="flex items-center gap-3 mb-8">
						<div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
							<MessageSquare class="w-5 h-5 text-white" />
						</div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Send us a Message</h2>
					</div>

					<form on:submit={handleSubmit} class="space-y-6">
						<!-- Name and Email Row -->
						<div class="grid md:grid-cols-2 gap-6">
							<div>
								<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Full Name *
								</label>
								<div class="relative">
									<User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="text"
										id="name"
										bind:value={formData.name}
										class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
										placeholder="Enter your full name"
										class:border-red-500={formErrors.name}
									/>
								</div>
								{#if formErrors.name}
									<p class="mt-1 text-sm text-red-600">{formErrors.name}</p>
								{/if}
							</div>

							<div>
								<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Email Address *
								</label>
								<div class="relative">
									<Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
									<input
										type="email"
										id="email"
										bind:value={formData.email}
										class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
										placeholder="your.email@example.com"
										class:border-red-500={formErrors.email}
									/>
								</div>
								{#if formErrors.email}
									<p class="mt-1 text-sm text-red-600">{formErrors.email}</p>
								{/if}
							</div>
						</div>

						<!-- Category and Priority Row -->
						<div class="grid md:grid-cols-2 gap-6">
							<div>
								<label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Category *
								</label>
								<select
									id="category"
									bind:value={formData.category}
									class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
									class:border-red-500={formErrors.category}
								>
									<option value="">Select a category</option>
									{#each contactCategories as category}
										<option value={category.value}>{category.label}</option>
									{/each}
								</select>
								{#if formErrors.category}
									<p class="mt-1 text-sm text-red-600">{formErrors.category}</p>
								{/if}
							</div>

							<div>
								<label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
									Priority Level
								</label>
								<select
									id="priority"
									bind:value={formData.priority}
									class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
								>
									{#each priorities as priority}
										<option value={priority.value}>{priority.label}</option>
									{/each}
								</select>
							</div>
						</div>

						<!-- Subject -->
						<div>
							<label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Subject *
							</label>
							<input
								type="text"
								id="subject"
								bind:value={formData.subject}
								class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
								placeholder="Brief summary of your inquiry"
								class:border-red-500={formErrors.subject}
							/>
							{#if formErrors.subject}
								<p class="mt-1 text-sm text-red-600">{formErrors.subject}</p>
							{/if}
						</div>

						<!-- Message -->
						<div>
							<label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Message *
							</label>
							<textarea
								id="message"
								bind:value={formData.message}
								rows="6"
								class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
								placeholder="Please provide detailed information about your inquiry..."
								class:border-red-500={formErrors.message}
							></textarea>
							{#if formErrors.message}
								<p class="mt-1 text-sm text-red-600">{formErrors.message}</p>
							{/if}
						</div>

						<!-- Submit Button -->
						<div class="flex justify-end">
							<button
								type="submit"
								disabled={formStatus === 'submitting'}
								class="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							>
								{#if formStatus === 'submitting'}
									<div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
									Sending...
								{:else if formStatus === 'success'}
									<CheckCircle class="w-5 h-5" />
									Message Sent!
								{:else if formStatus === 'error'}
									<AlertCircle class="w-5 h-5" />
									Try Again
								{:else}
									<Send class="w-5 h-5" />
									Send Message
								{/if}
							</button>
						</div>

						<!-- Status Messages -->
						{#if formStatus === 'success'}
							<div class="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/30 rounded-xl">
								<CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
								<p class="text-green-800 dark:text-green-200">Thank you! Your message has been sent successfully. We'll get back to you soon.</p>
							</div>
						{/if}

						{#if formStatus === 'error'}
							<div class="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/30 rounded-xl">
								<AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400" />
								<p class="text-red-800 dark:text-red-200">Sorry, there was an error sending your message. Please try again.</p>
							</div>
						{/if}
					</form>
				</div>
			</div>

			<!-- FAQ Section -->
			<div class="lg:col-span-1">
				<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8 h-fit">
					<div class="flex items-center gap-3 mb-8">
						<div class="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
							<HelpCircle class="w-5 h-5 text-white" />
						</div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Quick Answers</h2>
					</div>

					<div class="space-y-6">
						{#each faqItems as faq}
							<div class="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
								<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-3">{faq.question}</h3>
								<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
							</div>
						{/each}
					</div>

					<!-- Additional Support Links -->
					<div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
						<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-4">Need More Help?</h3>
						<div class="space-y-3">
							<a href="/help" class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
								<HelpCircle class="w-4 h-4" />
								<span class="text-sm">Browse Help Center</span>
							</a>
							<a href="/status" class="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
								<CheckCircle class="w-4 h-4" />
								<span class="text-sm">System Status</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Alternative Contact Methods -->
		<div class="mt-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8">
			<div class="text-center mb-8">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Other Ways to Reach Us</h2>
				<p class="text-gray-600 dark:text-gray-400">Choose the method that works best for you</p>
			</div>

			<div class="grid md:grid-cols-3 gap-6">
				<div class="text-center group">
					<div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
						<MessageSquare class="w-8 h-8 text-white" />
					</div>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Live Chat</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Get instant help from our support team</p>
					<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
						Start Chat
					</button>
				</div>

				<div class="text-center group">
					<div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
						<Phone class="w-8 h-8 text-white" />
					</div>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Schedule Call</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Book a time that works for you</p>
					<button class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
						Book Call
					</button>
				</div>

				<div class="text-center group">
					<div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
						<HelpCircle class="w-8 h-8 text-white" />
					</div>
					<h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">Help Center</h3>
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Browse articles and tutorials</p>
					<button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
						Browse Help
					</button>
				</div>
			</div>
		</div>
	</section>
</div>