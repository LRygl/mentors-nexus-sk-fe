<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import {
		Save,
		Eye,
		X,
		Palette,
		Type,
		Layers,
		Zap,
		ArrowLeft,
		Loader2,
		CheckCircle2,
		AlertCircle,
		Plus,
		Trash2,
		Code,
		ChevronDown,
		CreditCard,
		Layout,
		Bell,
		ShoppingCart,
		User,
		MessageSquare,
		Heart,
		Check,
		RefreshCw
	} from 'lucide-svelte';
	import type { ThemeConfig } from '$lib/Config/theme.config';
	import { themeStoreSvelte } from '$lib/stores/defaults/ThemeStore.svelte';

	let themeId = $page.params.id;
	let isNew = themeId === 'new';

	// Derived state from store
	let availableThemes = $derived(themeStoreSvelte.data);
	let activeTheme = $derived(themeStoreSvelte.activeTheme);

	// Local theme state
	let theme = $state<Partial<ThemeConfig>>({
		name: '',
		brand: {
			name: 'EduPlatform',
			logo: { light: '/logo-light.png', dark: '/logo-dark.png' }
		},
		colors: {
			primary: {
				'50': '#eff6ff', '100': '#dbeafe', '200': '#bfdbfe', '300': '#93c5fd',
				'400': '#60a5fa', '500': '#3b82f6', '600': '#2563eb', '700': '#1d4ed8',
				'800': '#1e40af', '900': '#1e3a8a', '950': '#172554'
			},
			secondary: {
				'50': '#faf5ff', '100': '#f3e8ff', '200': '#e9d5ff', '300': '#d8b4fe',
				'400': '#c084fc', '500': '#a855f7', '600': '#9333ea', '700': '#7e22ce',
				'800': '#6b21a8', '900': '#581c87', '950': '#3b0764'
			},
			accent: {
				'50': '#ecfeff', '100': '#cffafe', '200': '#a5f3fc', '300': '#67e8f9',
				'400': '#22d3ee', '500': '#06b6d4', '600': '#0891b2', '700': '#0e7490',
				'800': '#155e75', '900': '#164e63', '950': '#083344'
			},
			neutral: {
				'50': '#f8fafc', '100': '#f1f5f9', '200': '#e2e8f0', '300': '#cbd5e1',
				'400': '#94a3b8', '500': '#64748b', '600': '#475569', '700': '#334155',
				'800': '#1e293b', '900': '#0f172a', '950': '#020617'
			}
		},
		gradients: {
			primary: { from: 'blue-500', via: 'purple-500', to: 'indigo-600' },
			secondary: { from: 'purple-500', via: 'pink-500', to: 'rose-500' },
			hero: { from: 'slate-900', via: 'blue-900', to: 'indigo-900' },
			accent: { from: 'cyan-500', via: 'teal-500', to: 'blue-500' },
			success: { from: 'emerald-500', via: 'green-500', to: 'teal-500' },
			warning: { from: 'orange-500', via: 'amber-500', to: 'yellow-500' },
			error: { from: 'red-500', via: 'rose-500', to: 'pink-500' },
			card: { from: 'blue-50', via: 'purple-50', to: 'pink-50' },
			button: { from: 'blue-500', via: 'purple-500', to: 'indigo-500' }
		},
		components: {
			borderRadius: '2xl',
			navbar: {
				height: '80px',
				background: 'bg-white/95 dark:bg-slate-900/95',
				borderColor: 'border-gray-200 dark:border-slate-800'
			},
			button: {
				borderRadius: 'rounded-xl',
				padding: { sm: 'px-4 py-2', md: 'px-6 py-3', lg: 'px-8 py-4' }
			},
			card: {
				borderRadius: 'rounded-3xl',
				shadow: 'shadow-xl'
			},
			badge: {
				borderRadius: 'rounded-full'
			},
			input: {
				borderRadius: 'rounded-xl',
				borderColor: 'border-gray-200 dark:border-slate-700'
			}
		},
		typography: {
			fontFamily: {
				sans: 'Inter, system-ui, sans-serif',
				serif: 'Georgia, serif',
				mono: 'Consolas, monospace'
			},
			fontSize: {
				xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.125rem',
				xl: '1.25rem', '2xl': '1.5rem', '3xl': '1.875rem', '4xl': '2.25rem',
				'5xl': '3rem', '6xl': '3.75rem', '7xl': '4.5rem'
			},
			fontWeight: {
				light: 300, normal: 400, medium: 500,
				semibold: 600, bold: 700, black: 900
			},
			headingWeight: '700',
			bodyWeight: '400'
		},
		animations: {
			duration: 'normal',
			easing: {
				default: 'cubic-bezier(0.4, 0, 0.2, 1)',
				smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
				bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
			}
		},
		spacing: {
			xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem',
			xl: '2rem', '2xl': '3rem', '3xl': '4rem', '4xl': '6rem'
		}
	});

	let activeTab = $state<'colors' | 'typography' | 'components' | 'animations'>('colors');
	let previewMode = $state(false);
	let saving = $state(false);
	let saveSuccess = $state(false);
	let saveError = $state<string | null>(null);
	let showJsonEditor = $state(false);
	let jsonError = $state<string | null>(null);
	let jsonText = $state('');
	let selectedThemeId = $state<string>('');
	let loadingTheme = $state(false);

	// Preview components state
	interface PreviewComponent {
		id: string;
		type: 'button' | 'card' | 'badge' | 'input' | 'alert' | 'notification' | 'avatar' | 'dropdown';
		label: string;
		icon: any;
	}

	const availableComponents: PreviewComponent[] = [
		{ id: 'button', type: 'button', label: 'Button', icon: CreditCard },
		{ id: 'card', type: 'card', label: 'Card', icon: Layout },
		{ id: 'badge', type: 'badge', label: 'Badge', icon: Bell },
		{ id: 'input', type: 'input', label: 'Input', icon: Type },
		{ id: 'alert', type: 'alert', label: 'Alert', icon: AlertCircle },
		{ id: 'notification', type: 'notification', label: 'Notification', icon: Bell },
		{ id: 'avatar', type: 'avatar', label: 'Avatar', icon: User },
		{ id: 'dropdown', type: 'dropdown', label: 'Dropdown', icon: ChevronDown }
	];

	let previewComponents = $state<PreviewComponent[]>([
		availableComponents[0], // Button
		availableComponents[1]  // Card
	]);

	const colorShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

	// Animation duration in milliseconds
	let animationDuration = $derived(
		theme.animations?.duration === 'fast' ? '150ms' :
			theme.animations?.duration === 'slow' ? '500ms' : '300ms'
	);

	// Watch for theme changes and apply them in preview mode
	$effect(() => {
		if (previewMode) {
			themeStoreSvelte.setPreviewTheme(theme as ThemeConfig);
		}
	});

	// Sync JSON text with theme object
	$effect(() => {
		if (!showJsonEditor) {
			jsonText = JSON.stringify(theme, null, 2);
		}
	});

	onMount(async () => {
		// Load all themes for the dropdown
		await themeStoreSvelte.fetchAll();

		if (!isNew) {
			const existingTheme = await themeStoreSvelte.loadItem(themeId);
			if (existingTheme) {
				theme = { ...existingTheme };
				selectedThemeId = themeId;
			}
		}
		jsonText = JSON.stringify(theme, null, 2);
	});

	onDestroy(() => {
		// Always exit preview mode when leaving the page
		if (previewMode) {
			themeStoreSvelte.exitPreview();
		}
	});

	async function handleSave() {
		saving = true;
		saveError = null;
		saveSuccess = false;

		try {
			if (isNew) {
				const newTheme = await themeStoreSvelte.create(theme as Omit<ThemeConfig, 'id' | 'createdAt' | 'updatedAt'>);
				if (newTheme) {
					saveSuccess = true;
					setTimeout(() => {
						goto('/admin/themes');
					}, 1500);
				}
			} else {
				const updated = await themeStoreSvelte.update(themeId, theme);
				if (updated) {
					saveSuccess = true;
					setTimeout(() => {
						saveSuccess = false;
					}, 3000);
				}
			}
		} catch (error) {
			saveError = error instanceof Error ? error.message : 'Failed to save theme';
		} finally {
			saving = false;
		}
	}

	function handlePreview() {
		if (previewMode) {
			themeStoreSvelte.exitPreview();
			previewMode = false;
		} else {
			themeStoreSvelte.setPreviewTheme(theme as ThemeConfig);
			previewMode = true;
		}
	}

	async function handleThemeSelect(event: Event) {
		const select = event.target as HTMLSelectElement;
		const newThemeId = select.value;

		if (!newThemeId) return;

		loadingTheme = true;
		try {
			if (newThemeId === 'new') {
				// Reset to default empty theme
				theme = {
					name: '',
					brand: {
						name: 'EduPlatform',
						logo: { light: '/logo-light.png', dark: '/logo-dark.png' }
					},
					// ... rest of default theme
				};
				isNew = true;
				themeId = 'new';
			} else {
				const loadedTheme = await themeStoreSvelte.loadItem(newThemeId);
				if (loadedTheme) {
					theme = { ...loadedTheme };
					isNew = false;
					themeId = newThemeId;
				}
			}
			selectedThemeId = newThemeId;
		} catch (error) {
			console.error('Failed to load theme:', error);
			saveError = 'Failed to load selected theme';
		} finally {
			loadingTheme = false;
		}
	}

	function updateColor(colorType: 'primary' | 'secondary' | 'accent', shade: string, value: string) {
		if (!theme.colors) return;
		theme.colors[colorType] = {
			...theme.colors[colorType],
			[shade]: value
		};
	}

	function togglePreviewComponent(component: PreviewComponent) {
		const exists = previewComponents.find(c => c.id === component.id);
		if (exists) {
			// Remove if already added
			previewComponents = previewComponents.filter(c => c.id !== component.id);
		} else {
			// Add if not present
			previewComponents = [...previewComponents, component];
		}
	}

	function updateJsonFromText() {
		try {
			const parsed = JSON.parse(jsonText);
			theme = parsed;
			jsonError = null;
			showJsonEditor = false;
		} catch (error) {
			jsonError = error instanceof Error ? error.message : 'Invalid JSON';
		}
	}

	function cancelJsonEdit() {
		jsonText = JSON.stringify(theme, null, 2);
		jsonError = null;
		showJsonEditor = false;
	}

	function handleCreateNew() {
		theme = {
			name: '',
			brand: {
				name: 'EduPlatform',
				logo: { light: '/logo-light.png', dark: '/logo-dark.png' }
			},
			colors: theme.colors, // Keep current colors as starting point
			gradients: theme.gradients,
			components: theme.components,
			typography: theme.typography,
			animations: theme.animations,
			spacing: theme.spacing
		};
		isNew = true;
		themeId = 'new';
		selectedThemeId = 'new';
	}
</script>

<svelte:head>
	<title>{isNew ? 'Create' : 'Edit'} Theme - Admin</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-slate-900">
	<div class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

		<!-- Header -->
		<div class="flex items-center justify-between mb-8">
			<div class="flex items-center gap-4">
				<button
					onclick={() => {
						if (previewMode) {
							themeStoreSvelte.exitPreview();
						}
						goto('/admin/themes');
					}}
					class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
				>
					<ArrowLeft class="w-5 h-5" />
					Back
				</button>
				<div>
					<h1 class="text-4xl font-bold text-gray-900 dark:text-white">
						{isNew ? 'Create Theme' : 'Edit Theme'}
					</h1>
					<p class="text-gray-600 dark:text-gray-400 mt-1">
						Customize colors, typography, and components
					</p>
				</div>
			</div>

			<div class="flex gap-3">
				<button
					onclick={handlePreview}
					class="flex items-center gap-2 px-6 py-3 {previewMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600'} text-white rounded-xl font-semibold transition-colors"
				>
					<Eye class="w-5 h-5" />
					{previewMode ? 'Exit Preview' : 'Preview'}
				</button>

				<button
					onclick={handleSave}
					disabled={saving || !theme.name}
					class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
				>
					{#if saving}
						<Loader2 class="w-5 h-5 animate-spin" />
						Saving...
					{:else if saveSuccess}
						<CheckCircle2 class="w-5 h-5" />
						Saved!
					{:else}
						<Save class="w-5 h-5" />
						Save Theme
					{/if}
				</button>
			</div>
		</div>

		<!-- Save Error -->
		{#if saveError}
			<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
				<AlertCircle class="w-6 h-6 text-red-500" />
				<p class="text-red-700 dark:text-red-300">{saveError}</p>
			</div>
		{/if}

		<div class="grid lg:grid-cols-3 gap-8">

			<!-- Editor Panel -->
			<div class="lg:col-span-2 space-y-6">

				<!-- Theme Selector & Basic Info -->
				<div class="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-gray-200 dark:border-slate-700 shadow-lg">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Theme Selection</h2>

					<div class="space-y-4">
						<!-- Theme Selector -->
						<div>
							<div class="flex items-center justify-between mb-2">
								<label for="themeSelect" class="block text-sm font-semibold text-gray-900 dark:text-white">
									Select Theme to Edit
								</label>
								<button
									onclick={handleCreateNew}
									class="flex items-center gap-1 px-3 py-1 text-xs bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
								>
									<Plus class="w-3 h-3" />
									New Theme
								</button>
							</div>
							<div class="relative">
								<select
									id="themeSelect"
									value={selectedThemeId}
									onchange={handleThemeSelect}
									disabled={loadingTheme}
									class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<option value="">Select a theme...</option>
									<option value="new">➕ Create New Theme</option>
									<optgroup label="Available Themes">
										{#each availableThemes as availableTheme}
											<option value={availableTheme.id}>
												{availableTheme.name}
												{availableTheme.isActive ? '⭐ (Active)' : ''}
											</option>
										{/each}
									</optgroup>
								</select>
								<ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
							</div>
							{#if loadingTheme}
								<div class="flex items-center gap-2 mt-2 text-sm text-blue-600 dark:text-blue-400">
									<RefreshCw class="w-4 h-4 animate-spin" />
									Loading theme...
								</div>
							{/if}
						</div>

						<!-- Active Theme Indicator -->
						{#if activeTheme && theme.id === activeTheme.id}
							<div class="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
								<Check class="w-5 h-5 text-green-600 dark:text-green-400" />
								<span class="text-sm font-semibold text-green-900 dark:text-green-100">
									This is the currently active theme
								</span>
							</div>
						{/if}

						<!-- Theme Name Input -->
						<div>
							<label for="name" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
								Theme Name <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="name"
								bind:value={theme.name}
								placeholder="My Awesome Theme"
								class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
							/>
						</div>

						<!-- Brand Name Input -->
						<div>
							<label for="brandName" class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
								Brand Name
							</label>
							<input
								type="text"
								id="brandName"
								bind:value={theme.brand.name}
								placeholder="EduPlatform"
								class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
							/>
						</div>
					</div>
				</div>

				<!-- Tabs -->
				<div class="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden">
					<!-- Tab Headers -->
					<div class="flex border-b border-gray-200 dark:border-slate-700">
						<button
							onclick={() => activeTab = 'colors'}
							class="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors {activeTab === 'colors' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}"
						>
							<Palette class="w-5 h-5" />
							Colors
						</button>
						<button
							onclick={() => activeTab = 'typography'}
							class="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors {activeTab === 'typography' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}"
						>
							<Type class="w-5 h-5" />
							Typography
						</button>
						<button
							onclick={() => activeTab = 'components'}
							class="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors {activeTab === 'components' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}"
						>
							<Layers class="w-5 h-5" />
							Components
						</button>
						<button
							onclick={() => activeTab = 'animations'}
							class="flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors {activeTab === 'animations' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'}"
						>
							<Zap class="w-5 h-5" />
							Animations
						</button>
					</div>

					<!-- Tab Content -->
					<div class="p-8 max-h-[600px] overflow-y-auto">
						{#if activeTab === 'colors'}
							<!-- Primary Colors - ALL SHADES -->
							<div class="mb-8">
								<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Primary Colors</h3>
								<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
									{#each colorShades as shade}
										<div>
											<label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
												{shade}
											</label>
											<div class="flex gap-1">
												<input
													type="color"
													value={theme.colors?.primary?.[shade]}
													oninput={(e) => updateColor('primary', shade, e.currentTarget.value)}
													class="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-slate-700"
												/>
												<input
													type="text"
													value={theme.colors?.primary?.[shade]}
													oninput={(e) => updateColor('primary', shade, e.currentTarget.value)}
													class="flex-1 px-2 py-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-mono text-gray-900 dark:text-white"
												/>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Secondary Colors - ALL SHADES -->
							<div class="mb-8">
								<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Secondary Colors</h3>
								<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
									{#each colorShades as shade}
										<div>
											<label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
												{shade}
											</label>
											<div class="flex gap-1">
												<input
													type="color"
													value={theme.colors?.secondary?.[shade]}
													oninput={(e) => updateColor('secondary', shade, e.currentTarget.value)}
													class="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-slate-700"
												/>
												<input
													type="text"
													value={theme.colors?.secondary?.[shade]}
													oninput={(e) => updateColor('secondary', shade, e.currentTarget.value)}
													class="flex-1 px-2 py-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-mono text-gray-900 dark:text-white"
												/>
											</div>
										</div>
									{/each}
								</div>
							</div>

							<!-- Accent Colors - ALL SHADES -->
							<div>
								<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Accent Colors</h3>
								<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
									{#each colorShades as shade}
										<div>
											<label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
												{shade}
											</label>
											<div class="flex gap-1">
												<input
													type="color"
													value={theme.colors?.accent?.[shade]}
													oninput={(e) => updateColor('accent', shade, e.currentTarget.value)}
													class="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-slate-700"
												/>
												<input
													type="text"
													value={theme.colors?.accent?.[shade]}
													oninput={(e) => updateColor('accent', shade, e.currentTarget.value)}
													class="flex-1 px-2 py-1 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-mono text-gray-900 dark:text-white"
												/>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{:else if activeTab === 'typography'}
							<div class="space-y-6">
								<div>
									<label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Heading Weight
									</label>
									<select
										bind:value={theme.typography.headingWeight}
										class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="300">Light (300)</option>
										<option value="400">Normal (400)</option>
										<option value="500">Medium (500)</option>
										<option value="600">Semibold (600)</option>
										<option value="700">Bold (700)</option>
										<option value="800">Extra Bold (800)</option>
										<option value="900">Black (900)</option>
									</select>
								</div>

								<div>
									<label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Body Weight
									</label>
									<select
										bind:value={theme.typography.bodyWeight}
										class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="300">Light (300)</option>
										<option value="400">Normal (400)</option>
										<option value="500">Medium (500)</option>
										<option value="600">Semibold (600)</option>
									</select>
								</div>
							</div>
						{:else if activeTab === 'components'}
							<div class="space-y-6">
								<div>
									<label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Border Radius
									</label>
									<select
										bind:value={theme.components.borderRadius}
										class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="none">None</option>
										<option value="sm">Small</option>
										<option value="md">Medium</option>
										<option value="lg">Large</option>
										<option value="xl">Extra Large</option>
										<option value="2xl">2XL</option>
										<option value="3xl">3XL</option>
										<option value="full">Full</option>
									</select>
								</div>
							</div>
						{:else if activeTab === 'animations'}
							<div class="space-y-6">
								<div>
									<label class="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
										Animation Speed
									</label>
									<select
										bind:value={theme.animations.duration}
										class="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									>
										<option value="fast">Fast (150ms)</option>
										<option value="normal">Normal (300ms)</option>
										<option value="slow">Slow (500ms)</option>
									</select>
								</div>

								<!-- Animation Preview -->
								<div class="mt-6 p-6 bg-gray-50 dark:bg-slate-900 rounded-2xl">
									<p class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">Animation Preview</p>
									<div class="flex flex-wrap gap-3">
										<div
											class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:scale-110 cursor-pointer"
											style="transition: transform {animationDuration} {theme.animations?.easing?.default}"
										>
											Hover me (Scale)
										</div>
										<div
											class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:rotate-12 cursor-pointer"
											style="transition: transform {animationDuration} {theme.animations?.easing?.smooth}"
										>
											Hover me (Rotate)
										</div>
										<div
											class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:-translate-y-2 cursor-pointer"
											style="transition: transform {animationDuration} {theme.animations?.easing?.bounce}"
										>
											Hover me (Bounce)
										</div>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- JSON Editor -->
				<div class="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-lg overflow-hidden">
					<div class="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<Code class="w-5 h-5 text-gray-600 dark:text-gray-400" />
							<h3 class="text-lg font-bold text-gray-900 dark:text-white">JSON Configuration</h3>
						</div>
						{#if !showJsonEditor}
							<button
								onclick={() => showJsonEditor = true}
								class="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
							>
								Edit JSON
							</button>
						{:else}
							<div class="flex gap-2">
								<button
									onclick={cancelJsonEdit}
									class="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
								>
									Cancel
								</button>
								<button
									onclick={updateJsonFromText}
									class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
								>
									Apply Changes
								</button>
							</div>
						{/if}
					</div>

					<div class="p-6">
						{#if jsonError}
							<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
								<p class="text-sm text-red-700 dark:text-red-300">{jsonError}</p>
							</div>
						{/if}

						{#if showJsonEditor}
							<textarea
								bind:value={jsonText}
								class="w-full h-96 px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
								spellcheck="false"
							></textarea>
						{:else}
							<pre class="text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto bg-gray-50 dark:bg-slate-900 p-4 rounded-xl max-h-96 overflow-y-auto"><code>{jsonText}</code></pre>
						{/if}
					</div>
				</div>
			</div>

			<!-- Preview Panel -->
			<div class="lg:col-span-1">
				<div class="sticky top-8 space-y-6">
					<!-- Component Selector -->
					<div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
							Preview Components
							<span class="text-sm text-gray-500 font-normal ml-2">(Click to toggle)</span>
						</h3>
						<div class="grid grid-cols-2 gap-2">
							{#each availableComponents as component}
								{@const isActive = previewComponents.find(c => c.id === component.id)}
								<button
									onclick={() => togglePreviewComponent(component)}
									class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all {isActive ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'}"
								>
									{#if isActive}
										<Check class="w-4 h-4" />
									{:else}
										<svelte:component this={component.icon} class="w-4 h-4" />
									{/if}
									{component.label}
								</button>
							{/each}
						</div>
					</div>

					<!-- Live Preview -->
					<div class="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-200 dark:border-slate-700 shadow-lg">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Live Preview</h2>

						{#if previewComponents.length === 0}
							<div class="text-center py-8">
								<Palette class="w-12 h-12 text-gray-400 mx-auto mb-3" />
								<p class="text-gray-500 dark:text-gray-400 text-sm">
									Select components to preview
								</p>
							</div>
						{:else}
							<div class="space-y-6">
								{#each previewComponents as component (component.id)}
									<!-- Component Preview (keep existing preview code) -->
									{#if component.type === 'button'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Button</h3>
											<button
												class="w-full px-6 py-3 text-white font-semibold shadow-lg"
												class:rounded-none={theme.components?.borderRadius === 'none'}
												class:rounded-sm={theme.components?.borderRadius === 'sm'}
												class:rounded-md={theme.components?.borderRadius === 'md'}
												class:rounded-lg={theme.components?.borderRadius === 'lg'}
												class:rounded-xl={theme.components?.borderRadius === 'xl'}
												class:rounded-2xl={theme.components?.borderRadius === '2xl'}
												class:rounded-3xl={theme.components?.borderRadius === '3xl'}
												class:rounded-full={theme.components?.borderRadius === 'full'}
												style="
													background: linear-gradient(to right, {theme.colors?.primary?.['500']}, {theme.colors?.secondary?.['500']});
													transition: transform {animationDuration} {theme.animations?.easing?.default};
												"
											>
												Click Me
											</button>
										</div>
									{:else if component.type === 'card'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Card</h3>
											<div
												class="p-6 bg-gray-50 dark:bg-slate-900 shadow-lg"
												class:rounded-none={theme.components?.borderRadius === 'none'}
												class:rounded-sm={theme.components?.borderRadius === 'sm'}
												class:rounded-md={theme.components?.borderRadius === 'md'}
												class:rounded-lg={theme.components?.borderRadius === 'lg'}
												class:rounded-xl={theme.components?.borderRadius === 'xl'}
												class:rounded-2xl={theme.components?.borderRadius === '2xl'}
												class:rounded-3xl={theme.components?.borderRadius === '3xl'}
												style="transition: transform {animationDuration} {theme.animations?.easing?.smooth};"
											>
												<h4 class="font-bold text-gray-900 dark:text-white mb-2" style="font-weight: {theme.typography?.headingWeight}">
													Card Title
												</h4>
												<p class="text-sm text-gray-600 dark:text-gray-400" style="font-weight: {theme.typography?.bodyWeight}">
													Card content with theme typography.
												</p>
											</div>
										</div>
									{:else if component.type === 'badge'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Badge</h3>
											<div class="flex gap-2 flex-wrap">
												<span
													class="px-3 py-1 text-xs font-semibold text-white"
													class:rounded-none={theme.components?.borderRadius === 'none'}
													class:rounded-sm={theme.components?.borderRadius === 'sm'}
													class:rounded-md={theme.components?.borderRadius === 'md'}
													class:rounded-lg={theme.components?.borderRadius === 'lg'}
													class:rounded-xl={theme.components?.borderRadius === 'xl'}
													class:rounded-2xl={theme.components?.borderRadius === '2xl'}
													class:rounded-3xl={theme.components?.borderRadius === '3xl'}
													class:rounded-full={theme.components?.borderRadius === 'full'}
													style="background: {theme.colors?.primary?.['500']}; transition: transform {animationDuration};"
												>
													Primary
												</span>
												<span
													class="px-3 py-1 text-xs font-semibold text-white"
													class:rounded-none={theme.components?.borderRadius === 'none'}
													class:rounded-sm={theme.components?.borderRadius === 'sm'}
													class:rounded-md={theme.components?.borderRadius === 'md'}
													class:rounded-lg={theme.components?.borderRadius === 'lg'}
													class:rounded-xl={theme.components?.borderRadius === 'xl'}
													class:rounded-2xl={theme.components?.borderRadius === '2xl'}
													class:rounded-3xl={theme.components?.borderRadius === '3xl'}
													class:rounded-full={theme.components?.borderRadius === 'full'}
													style="background: {theme.colors?.secondary?.['500']}; transition: transform {animationDuration};"
												>
													Secondary
												</span>
											</div>
										</div>
									{:else if component.type === 'input'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Input</h3>
											<input
												type="text"
												placeholder="Enter text..."
												class="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900 border text-gray-900 dark:text-white"
												class:rounded-none={theme.components?.borderRadius === 'none'}
												class:rounded-sm={theme.components?.borderRadius === 'sm'}
												class:rounded-md={theme.components?.borderRadius === 'md'}
												class:rounded-lg={theme.components?.borderRadius === 'lg'}
												class:rounded-xl={theme.components?.borderRadius === 'xl'}
												class:rounded-2xl={theme.components?.borderRadius === '2xl'}
												class:rounded-3xl={theme.components?.borderRadius === '3xl'}
												style="
													border-color: {theme.colors?.primary?.['300']};
													transition: border-color {animationDuration}, box-shadow {animationDuration};
												"
											/>
										</div>
									{:else if component.type === 'alert'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Alert</h3>
											<div
												class="p-4 flex items-start gap-3"
												class:rounded-none={theme.components?.borderRadius === 'none'}
												class:rounded-sm={theme.components?.borderRadius === 'sm'}
												class:rounded-md={theme.components?.borderRadius === 'md'}
												class:rounded-lg={theme.components?.borderRadius === 'lg'}
												class:rounded-xl={theme.components?.borderRadius === 'xl'}
												class:rounded-2xl={theme.components?.borderRadius === '2xl'}
												class:rounded-3xl={theme.components?.borderRadius === '3xl'}
												style="
													background: {theme.colors?.primary?.['50']};
													border: 1px solid {theme.colors?.primary?.['200']};
													transition: all {animationDuration};
												"
											>
												<AlertCircle class="w-5 h-5 flex-shrink-0" style="color: {theme.colors?.primary?.['500']}" />
												<div>
													<h4 class="font-semibold text-sm" style="color: {theme.colors?.primary?.['900']}; font-weight: {theme.typography?.headingWeight}">
														Alert Title
													</h4>
													<p class="text-xs mt-1" style="color: {theme.colors?.primary?.['700']}; font-weight: {theme.typography?.bodyWeight}">
														This is an alert message.
													</p>
												</div>
											</div>
										</div>
									{:else if component.type === 'avatar'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Avatar</h3>
											<div class="flex gap-2">
												<div
													class="w-12 h-12 flex items-center justify-center text-white font-bold"
													class:rounded-none={theme.components?.borderRadius === 'none'}
													class:rounded-sm={theme.components?.borderRadius === 'sm'}
													class:rounded-md={theme.components?.borderRadius === 'md'}
													class:rounded-lg={theme.components?.borderRadius === 'lg'}
													class:rounded-xl={theme.components?.borderRadius === 'xl'}
													class:rounded-2xl={theme.components?.borderRadius === '2xl'}
													class:rounded-3xl={theme.components?.borderRadius === '3xl'}
													class:rounded-full={theme.components?.borderRadius === 'full'}
													style="background: {theme.colors?.primary?.['500']}; transition: transform {animationDuration};"
												>
													JD
												</div>
												<div
													class="w-12 h-12 flex items-center justify-center text-white font-bold"
													class:rounded-none={theme.components?.borderRadius === 'none'}
													class:rounded-sm={theme.components?.borderRadius === 'sm'}
													class:rounded-md={theme.components?.borderRadius === 'md'}
													class:rounded-lg={theme.components?.borderRadius === 'lg'}
													class:rounded-xl={theme.components?.borderRadius === 'xl'}
													class:rounded-2xl={theme.components?.borderRadius === '2xl'}
													class:rounded-3xl={theme.components?.borderRadius === '3xl'}
													class:rounded-full={theme.components?.borderRadius === 'full'}
													style="background: {theme.colors?.secondary?.['500']}; transition: transform {animationDuration};"
												>
													AB
												</div>
											</div>
										</div>
									{:else if component.type === 'notification'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Notification</h3>
											<div
												class="p-4 bg-white dark:bg-slate-800 shadow-lg border"
												class:rounded-none={theme.components?.borderRadius === 'none'}
												class:rounded-sm={theme.components?.borderRadius === 'sm'}
												class:rounded-md={theme.components?.borderRadius === 'md'}
												class:rounded-lg={theme.components?.borderRadius === 'lg'}
												class:rounded-xl={theme.components?.borderRadius === 'xl'}
												class:rounded-2xl={theme.components?.borderRadius === '2xl'}
												class:rounded-3xl={theme.components?.borderRadius === '3xl'}
												style="
													border-color: {theme.colors?.primary?.['200']};
													transition: all {animationDuration};
												"
											>
												<div class="flex items-start gap-3">
													<div
														class="w-8 h-8 flex items-center justify-center flex-shrink-0"
														class:rounded-none={theme.components?.borderRadius === 'none'}
														class:rounded-sm={theme.components?.borderRadius === 'sm'}
														class:rounded-md={theme.components?.borderRadius === 'md'}
														class:rounded-lg={theme.components?.borderRadius === 'lg'}
														class:rounded-xl={theme.components?.borderRadius === 'xl'}
														class:rounded-2xl={theme.components?.borderRadius === '2xl'}
														class:rounded-3xl={theme.components?.borderRadius === '3xl'}
														class:rounded-full={theme.components?.borderRadius === 'full'}
														style="background: {theme.colors?.primary?.['500']}"
													>
														<Bell class="w-4 h-4 text-white" />
													</div>
													<div class="flex-1">
														<h4 class="text-sm font-semibold text-gray-900 dark:text-white" style="font-weight: {theme.typography?.headingWeight}">
															New Message
														</h4>
														<p class="text-xs text-gray-600 dark:text-gray-400 mt-1" style="font-weight: {theme.typography?.bodyWeight}">
															You have a new notification
														</p>
													</div>
												</div>
											</div>
										</div>
									{:else if component.type === 'dropdown'}
										<div>
											<h3 class="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Dropdown</h3>
											<button
												class="w-full px-4 py-2 bg-white dark:bg-slate-800 border flex items-center justify-between"
												class:rounded-none={theme.components?.borderRadius === 'none'}
												class:rounded-sm={theme.components?.borderRadius === 'sm'}
												class:rounded-md={theme.components?.borderRadius === 'md'}
												class:rounded-lg={theme.components?.borderRadius === 'lg'}
												class:rounded-xl={theme.components?.borderRadius === 'xl'}
												class:rounded-2xl={theme.components?.borderRadius === '2xl'}
												class:rounded-3xl={theme.components?.borderRadius === '3xl'}
												style="
													border-color: {theme.colors?.primary?.['300']};
													transition: all {animationDuration};
												"
											>
												<span class="text-sm text-gray-900 dark:text-white">Select option</span>
												<ChevronDown class="w-4 h-4" style="color: {theme.colors?.primary?.['500']}" />
											</button>
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>