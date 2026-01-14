<!-- $lib/components/ui/cta-banner.svelte -->
<script lang="ts">
	import type { ComponentType } from 'svelte';
	import type { Icon } from 'lucide-svelte';
	import { Sparkles } from 'lucide-svelte';

	interface ButtonConfig {
		text: string;
		icon?: ComponentType<Icon>;
		iconPosition?: 'left' | 'right';
		variant: 'primary' | 'secondary' | 'outline';
		href?: string;
		onClick?: () => void;
		type?: 'button' | 'submit';
	}

	interface FormField {
		id: string;
		name: string;
		type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
		label: string;
		placeholder?: string;
		required?: boolean;
		options?: string[]; // For select fields
		rows?: number; // For textarea
	}

	interface Props {
		// Content
		title: string;
		description: string;
		icon?: ComponentType<Icon>;

		// Variant
		variant?: 'simple' | 'detailed' | 'form';

		// Layout
		size?: 'sm' | 'md' | 'lg';
		align?: 'left' | 'center' | 'right';

		// Background styling
		gradientFrom?: string;
		gradientVia?: string;
		gradientTo?: string;
		backgroundVariant?: 'gradient' | 'solid' | 'image';
		backgroundImage?: string;

		// Animation
		animated?: boolean;
		iconAnimation?: 'bounce' | 'pulse' | 'spin' | 'none';

		// Buttons (for simple & detailed variants)
		buttons?: ButtonConfig[];

		// Form configuration (for form variant)
		formTitle?: string;
		formFields?: FormField[];
		formButtonText?: string;
		onFormSubmit?: (data: Record<string, any>) => void;

		// Decorative elements
		showParticles?: boolean;
		showGlowOrbs?: boolean;

		// Custom classes
		class?: string;


	}

	let {
		title,
		description,
		icon,
		variant = 'simple',
		size = 'md',
		align = 'center',
		gradientFrom = 'from-blue-600',
		gradientVia = 'via-purple-600',
		gradientTo = 'to-indigo-600',
		backgroundVariant = 'gradient',
		backgroundImage,
		animated = true,
		iconAnimation = 'bounce',
		buttons = [],
		formTitle,
		formFields = [],
		formButtonText = 'Submit',
		onFormSubmit,
		showParticles = true,
		showGlowOrbs = true,
		class: className = ''
	}: Props = $props();

	// Size configurations
	const sizeConfig = {
		sm: {
			padding: 'py-12',
			titleSize: 'text-2xl md:text-3xl',
			descSize: 'text-base md:text-lg',
			iconSize: 'w-12 h-12',
			maxWidth: 'max-w-3xl'
		},
		md: {
			padding: 'py-16 md:py-24',
			titleSize: 'text-3xl md:text-4xl lg:text-5xl',
			descSize: 'text-lg md:text-xl',
			iconSize: 'w-16 h-16',
			maxWidth: 'max-w-4xl'
		},
		lg: {
			padding: 'py-24 md:py-32',
			titleSize: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
			descSize: 'text-xl md:text-2xl',
			iconSize: 'w-20 h-20',
			maxWidth: 'max-w-5xl'
		}
	};

	const alignConfig = {
		left: 'text-left items-start',
		center: 'text-center items-center',
		right: 'text-right items-end'
	};

	const iconAnimationConfig = {
		bounce: 'animate-bounce',
		pulse: 'animate-pulse',
		spin: 'animate-spin',
		none: ''
	};

	// Derive computed values
	const currentSize = $derived(sizeConfig[size]);
	const currentAlign = $derived(alignConfig[align]);
	const currentIconAnimation = $derived(iconAnimationConfig[iconAnimation]);

	// Form state
	let formData = $state<Record<string, any>>({});
	let formErrors = $state<Record<string, string>>({});

	// Button variant styles
	function getButtonClasses(buttonVariant: ButtonConfig['variant'], isGroup: boolean = false): string {
		const base = "px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 hover:scale-105 shadow-2xl";

		const variants = {
			primary: `${base} bg-white text-blue-600 hover:bg-blue-50 hover:shadow-white/25`,
			secondary: `${base} bg-gradient-to-r ${gradientFrom} ${gradientVia} ${gradientTo} text-white hover:shadow-blue-500/50`,
			outline: `${base} bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20`
		};

		return variants[buttonVariant];
	}

	// Handle button click
	function handleButtonClick(button: ButtonConfig, event: MouseEvent) {
		if (button.onClick) {
			event.preventDefault();
			button.onClick();
		} else if (button.href) {
			window.location.href = button.href;
		}
	}

	// Form validation
	function validateField(field: FormField, value: any): string | null {
		if (field.required && !value) {
			return `${field.label} is required`;
		}

		if (field.type === 'email' && value) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(value)) {
				return 'Please enter a valid email address';
			}
		}

		return null;
	}

	// Handle form submission
	function handleSubmit(event: Event) {
		event.preventDefault();

		// Validate all fields
		const errors: Record<string, string> = {};
		formFields.forEach(field => {
			const error = validateField(field, formData[field.name]);
			if (error) {
				errors[field.name] = error;
			}
		});

		formErrors = errors;

		// If no errors, submit
		if (Object.keys(errors).length === 0 && onFormSubmit) {
			onFormSubmit(formData);
		}
	}

	// Update form data
	function updateFormData(fieldName: string, value: any) {
		formData[fieldName] = value;
		// Clear error when user starts typing
		if (formErrors[fieldName]) {
			const newErrors = { ...formErrors };
			delete newErrors[fieldName];
			formErrors = newErrors;
		}
	}
</script>

<section class="relative overflow-hidden {className}">
	<!-- Background Layer -->
	{#if backgroundVariant === 'gradient'}
		<div class="absolute inset-0 bg-gradient-to-br {gradientFrom} {gradientVia} {gradientTo}"></div>
	{:else if backgroundVariant === 'solid'}
		<div class="absolute inset-0 bg-slate-900"></div>
	{:else if backgroundVariant === 'image' && backgroundImage}
		<div class="absolute inset-0">
			<img src={backgroundImage} alt="" class="w-full h-full object-cover" />
			<div class="absolute inset-0 bg-gradient-to-br {gradientFrom} {gradientVia} {gradientTo} opacity-90"></div>
		</div>
	{/if}

	<!-- Animated Overlay -->
	{#if showGlowOrbs}
		<div class="absolute inset-0 opacity-50">
			<div class="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30"></div>
			<div class="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
			<div class="absolute bottom-0 left-0 w-48 md:w-80 h-48 md:h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
		</div>
	{/if}

	<!-- Floating Particles -->
	{#if showParticles}
		<div class="absolute inset-0 overflow-hidden pointer-events-none">
			{#each Array(8) as _, i}
				<div
					class="absolute w-1 h-1 bg-white/30 rounded-full animate-float-particle"
					style="
						left: {Math.random() * 100}%;
						top: {Math.random() * 100}%;
						animation-delay: {Math.random() * 5}s;
						animation-duration: {3 + Math.random() * 4}s;
					"
				></div>
			{/each}
		</div>
	{/if}

	<!-- Content Container -->
	<div class="relative z-10 {currentSize.padding} px-4 sm:px-6 lg:px-8">
		<div class="{currentSize.maxWidth} mx-auto">

			{#if variant === 'simple'}
				<!-- Simple Variant: Icon + Title + Description + Buttons -->
				<div class="flex flex-col {currentAlign} space-y-6 md:space-y-8">
					{#if icon}
						<svelte:component
							this={icon}
							class="{currentSize.iconSize} text-white mx-auto {currentIconAnimation}"
						/>
					{/if}

					<h2 class="{currentSize.titleSize} font-bold text-white {animated ? 'animate-fade-in' : ''}">
						{title}
					</h2>

					<p class="{currentSize.descSize} text-blue-100 max-w-2xl {align === 'center' ? 'mx-auto' : ''} {animated ? 'animate-fade-in-up' : ''}" style="animation-delay: 0.2s">
						{description}
					</p>

					{#if buttons.length > 0}
						<div class="flex flex-col sm:flex-row gap-4 {align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'} {animated ? 'animate-fade-in-up' : ''}" style="animation-delay: 0.4s">
							{#each buttons as button}
								<button
									onclick={(e) => handleButtonClick(button, e)}
									class="group {getButtonClasses(button.variant)}"
								>
									<span class="flex items-center justify-center gap-2">
										{#if button.icon && button.iconPosition === 'left'}
											<svelte:component this={button.icon} class="w-5 h-5" />
										{/if}
										{button.text}
										{#if button.icon && (!button.iconPosition || button.iconPosition === 'right')}
											<svelte:component this={button.icon} class="w-5 h-5 group-hover:rotate-12 transition-transform" />
										{/if}
									</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>

			{:else if variant === 'detailed'}
				<!-- Detailed Variant: Same as simple but with more spacing and features -->
				<div class="flex flex-col {currentAlign} space-y-6 md:space-y-10">
					{#if icon}
						<div class="relative">
							<div class="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
							<svelte:component
								this={icon}
								class="relative {currentSize.iconSize} text-white mx-auto {currentIconAnimation}"
							/>
						</div>
					{/if}

					<div class="space-y-4 md:space-y-6">
						<h2 class="{currentSize.titleSize} font-bold text-white leading-tight {animated ? 'animate-fade-in' : ''}">
							{title}
						</h2>

						<p class="{currentSize.descSize} text-blue-100 leading-relaxed max-w-3xl {align === 'center' ? 'mx-auto' : ''} {animated ? 'animate-fade-in-up' : ''}" style="animation-delay: 0.2s">
							{description}
						</p>
					</div>

					{#if buttons.length > 0}
						<div class="flex flex-col sm:flex-row gap-4 {align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'} {animated ? 'animate-fade-in-up' : ''}" style="animation-delay: 0.4s">
							{#each buttons as button}
								<button
									onclick={(e) => handleButtonClick(button, e)}
									class="group {getButtonClasses(button.variant)}"
								>
									<span class="flex items-center justify-center gap-2">
										{#if button.icon && button.iconPosition === 'left'}
											<svelte:component this={button.icon} class="w-5 h-5" />
										{/if}
										{button.text}
										{#if button.icon && (!button.iconPosition || button.iconPosition === 'right')}
											<svelte:component this={button.icon} class="w-5 h-5 group-hover:rotate-12 transition-transform" />
										{/if}
									</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>

			{:else if variant === 'form'}
				<!-- Form Variant: Title + Description + Form -->
				<div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					<!-- Left Side: Content -->
					<div class="space-y-6 {align === 'center' ? 'text-center lg:text-left' : ''}">
						{#if icon}
							<svelte:component
								this={icon}
								class="{currentSize.iconSize} text-white {align === 'center' ? 'mx-auto lg:mx-0' : ''} {currentIconAnimation}"
							/>
						{/if}

						<h2 class="{currentSize.titleSize} font-bold text-white leading-tight {animated ? 'animate-fade-in' : ''}">
							{title}
						</h2>

						<p class="{currentSize.descSize} text-blue-100 leading-relaxed {animated ? 'animate-fade-in-up' : ''}" style="animation-delay: 0.2s">
							{description}
						</p>
					</div>

					<!-- Right Side: Form -->
					<div class="{animated ? 'animate-fade-in-up' : ''}" style="animation-delay: 0.3s">
						<div class="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
							{#if formTitle}
								<h3 class="text-2xl font-bold text-white mb-6">{formTitle}</h3>
							{/if}

							<form onsubmit={handleSubmit} class="space-y-5">
								{#each formFields as field}
									<div>
										<label
											for={field.id}
											class="block text-sm font-semibold text-white mb-2"
										>
											{field.label}
											{#if field.required}
												<span class="text-red-300">*</span>
											{/if}
										</label>

										{#if field.type === 'textarea'}
											<textarea
												id={field.id}
												name={field.name}
												placeholder={field.placeholder}
												required={field.required}
												rows={field.rows || 4}
												value={formData[field.name] || ''}
												oninput={(e) => updateFormData(field.name, e.currentTarget.value)}
												class="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 resize-none"
											></textarea>
										{:else if field.type === 'select'}
											<select
												id={field.id}
												name={field.name}
												required={field.required}
												value={formData[field.name] || ''}
												onchange={(e) => updateFormData(field.name, e.currentTarget.value)}
												class="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
											>
												<option value="" disabled selected class="bg-slate-800">
													{field.placeholder || `Select ${field.label}`}
												</option>
												{#each field.options || [] as option}
													<option value={option} class="bg-slate-800">{option}</option>
												{/each}
											</select>
										{:else}
											<input
												type={field.type}
												id={field.id}
												name={field.name}
												placeholder={field.placeholder}
												required={field.required}
												value={formData[field.name] || ''}
												oninput={(e) => updateFormData(field.name, e.currentTarget.value)}
												class="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
											/>
										{/if}

										{#if formErrors[field.name]}
											<p class="mt-2 text-sm text-red-300 flex items-center gap-1">
												<span class="inline-block w-1 h-1 bg-red-300 rounded-full"></span>
												{formErrors[field.name]}
											</p>
										{/if}
									</div>
								{/each}

								<button
									type="submit"
									class="w-full px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/25 flex items-center justify-center gap-2"
								>
									{formButtonText}
									<Sparkles class="w-5 h-5" />
								</button>
							</form>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
    @keyframes float-particle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }

    @keyframes fade-in {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-float-particle { animation: float-particle linear infinite; }
    .animate-fade-in { animation: fade-in 1s ease-out forwards; opacity: 0; }
    .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; opacity: 0; }
</style>