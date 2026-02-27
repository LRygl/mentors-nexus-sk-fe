<!-- FormGroupRenderer.svelte
     Renders a single FormFieldGroup.

     VARIANTS
     ────────
     card (default)  → Profile-page card: rounded-2xl, backdrop-blur, icon badge
                        header with bottom divider. Supports collapsible.
     embedded        → No outer chrome; renders fields with a lightweight
     minimal         → heading and nothing else. Good when the card already
                        exists in the parent.

     ICONS
     ─────
     group.icon accepts any Lucide icon name registered in iconRegistry
     (e.g. 'User', 'Shield', 'CreditCard', 'Key', 'Settings' …).
     The accent color is auto-derived from the icon name; override with
     group.color (e.g. 'indigo', 'violet', 'emerald', 'rose', …).

     COLLAPSIBLE
     ───────────
     Set group.collapsible = true.  The initial state is group.collapsed ?? false.
     Animates with Svelte's built-in slide transition.
-->
<script lang="ts">
	import type { FormFieldGroup, FormLayout, FormState } from '$lib/types/entities/forms';
	import FormFieldRenderer from '$lib/components/Forms/FormFieldRenderer.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { getIconComponent } from '$lib/types/params/iconRegistry';
	import { slide } from 'svelte/transition';

	// ── Props ─────────────────────────────────────────────────────────────────
	interface Props {
		group: FormFieldGroup;
		formState: FormState;
		layout?: FormLayout;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
		visibleFields: string[];
		shouldShowError: (fieldName: string) => boolean;
		imageBaseUrl?: string;
	}

	let {
		group,
		formState,
		layout = 'single',
		disabled = false,
		onChange,
		visibleFields,
		shouldShowError,
		imageBaseUrl,
	}: Props = $props();

	// ── Collapsible ───────────────────────────────────────────────────────────
	let isCollapsed = $state(group.collapsed ?? false);

	function toggleCollapse() {
		if (group.collapsible) isCollapsed = !isCollapsed;
	}

	// ── Layout grid ───────────────────────────────────────────────────────────
	const gridClass = $derived.by(() => {
		switch (layout) {
			case 'two-column':
				return 'lg:grid-cols-2';
			case 'three-column':
				return 'lg:grid-cols-3';
			default:
				return '';
		}
	});

	// ── Visibility ────────────────────────────────────────────────────────────
	const hasVisibleFields = $derived(
		group.fields.some((field) => visibleFields.includes(field.name))
	);

	// ── Icon ──────────────────────────────────────────────────────────────────
	// Resolve the Lucide component for group.icon (a string name like 'User').
	const IconComponent = $derived(group.icon ? getIconComponent(group.icon) : null);

	// ── Accent color ──────────────────────────────────────────────────────────
	// Icon name → sensible default color so schemas don't need to set it explicitly.
	const ICON_DEFAULT_COLORS: Record<string, string> = {
		User: 'indigo',
		Users: 'indigo',
		PencilLine: 'indigo',
		CreditCard: 'violet',
		MapPin: 'violet',
		Gift: 'violet',
		Shield: 'emerald',
		Lock: 'emerald',
		Key: 'rose',
		Heart: 'rose',
		Bell: 'amber',
		Star: 'amber',
		Award: 'amber',
		Trophy: 'amber',
		Archive: 'amber',
		Folder: 'amber',
		Flag: 'red',
		Target: 'red',
		Mail: 'blue',
		Database: 'blue',
		Upload: 'blue',
		Download: 'blue',
		Calendar: 'blue',
		Truck: 'blue',
		Phone: 'cyan',
		BookOpen: 'purple',
		Zap: 'purple',
		Puzzle: 'purple',
		Globe: 'teal',
		Camera: 'pink',
		Video: 'pink',
		Music: 'pink',
		Image: 'pink',
		Settings: 'slate',
		Cog: 'slate',
		Wrench: 'slate',
		Server: 'slate',
		Hash: 'slate',
		Eye: 'slate',
		HelpCircle: 'slate',
		MessageSquare: 'blue',
	};

	// Full Tailwind class strings — written out literally so JIT includes them.
	const COLOR_CLASSES: Record<string, { badge: string; icon: string; label: string }> = {
		indigo: {
			badge: 'bg-indigo-500/10 border-indigo-500/20',
			icon: 'text-indigo-500 dark:text-indigo-400',
			label: 'text-indigo-500 dark:text-indigo-400 group-hover/hdr:text-indigo-600 dark:group-hover/hdr:text-indigo-300',
		},
		violet: {
			badge: 'bg-violet-500/10 border-violet-500/20',
			icon: 'text-violet-500 dark:text-violet-400',
			label: 'text-violet-500 dark:text-violet-400 group-hover/hdr:text-violet-600 dark:group-hover/hdr:text-violet-300',
		},
		emerald: {
			badge: 'bg-emerald-500/10 border-emerald-500/20',
			icon: 'text-emerald-500 dark:text-emerald-400',
			label: 'text-emerald-500 dark:text-emerald-400 group-hover/hdr:text-emerald-600 dark:group-hover/hdr:text-emerald-300',
		},
		rose: {
			badge: 'bg-rose-500/10 border-rose-500/20',
			icon: 'text-rose-500 dark:text-rose-400',
			label: 'text-rose-500 dark:text-rose-400 group-hover/hdr:text-rose-600 dark:group-hover/hdr:text-rose-300',
		},
		amber: {
			badge: 'bg-amber-500/10 border-amber-500/20',
			icon: 'text-amber-500 dark:text-amber-400',
			label: 'text-amber-500 dark:text-amber-400 group-hover/hdr:text-amber-600 dark:group-hover/hdr:text-amber-300',
		},
		blue: {
			badge: 'bg-blue-500/10 border-blue-500/20',
			icon: 'text-blue-500 dark:text-blue-400',
			label: 'text-blue-500 dark:text-blue-400 group-hover/hdr:text-blue-600 dark:group-hover/hdr:text-blue-300',
		},
		slate: {
			badge: 'bg-slate-500/10 border-slate-500/20',
			icon: 'text-slate-500 dark:text-slate-400',
			label: 'text-slate-500 dark:text-slate-400 group-hover/hdr:text-slate-600 dark:group-hover/hdr:text-slate-300',
		},
		cyan: {
			badge: 'bg-cyan-500/10 border-cyan-500/20',
			icon: 'text-cyan-500 dark:text-cyan-400',
			label: 'text-cyan-500 dark:text-cyan-400 group-hover/hdr:text-cyan-600 dark:group-hover/hdr:text-cyan-300',
		},
		purple: {
			badge: 'bg-purple-500/10 border-purple-500/20',
			icon: 'text-purple-500 dark:text-purple-400',
			label: 'text-purple-500 dark:text-purple-400 group-hover/hdr:text-purple-600 dark:group-hover/hdr:text-purple-300',
		},
		teal: {
			badge: 'bg-teal-500/10 border-teal-500/20',
			icon: 'text-teal-500 dark:text-teal-400',
			label: 'text-teal-500 dark:text-teal-400 group-hover/hdr:text-teal-600 dark:group-hover/hdr:text-teal-300',
		},
		red: {
			badge: 'bg-red-500/10 border-red-500/20',
			icon: 'text-red-500 dark:text-red-400',
			label: 'text-red-500 dark:text-red-400 group-hover/hdr:text-red-600 dark:group-hover/hdr:text-red-300',
		},
		pink: {
			badge: 'bg-pink-500/10 border-pink-500/20',
			icon: 'text-pink-500 dark:text-pink-400',
			label: 'text-pink-500 dark:text-pink-400 group-hover/hdr:text-pink-600 dark:group-hover/hdr:text-pink-300',
		},
	};

	const accentColor = $derived(
		group.color ?? (group.icon ? (ICON_DEFAULT_COLORS[group.icon] ?? 'indigo') : 'indigo')
	);
	const cc = $derived(COLOR_CLASSES[accentColor] ?? COLOR_CLASSES.indigo);

	// ── Variant ───────────────────────────────────────────────────────────────
	// 'embedded' and 'minimal' → no card chrome
	// 'card', 'default', anything else → full profile-page card
	const isEmbedded = $derived(group.variant === 'embedded' || group.variant === 'minimal');
</script>

{#if hasVisibleFields}
	<!-- ════════════════════════════════════════════════════════════════════════
	     EMBEDDED / MINIMAL  — no outer card chrome
	     ════════════════════════════════════════════════════════════════════════ -->
	{#if isEmbedded}
		<div class="mb-8 {group.className ?? ''}">
			{#if group.title || group.description}
				<div class="mb-5">
					{#if group.title}
						<div class="flex items-center gap-2.5 mb-1">
							{#if IconComponent}
								<div class="p-1.5 rounded-lg border flex-shrink-0 {cc.badge}">
									<IconComponent class="w-3.5 h-3.5 {cc.icon}" />
								</div>
							{/if}
							<h3 class="text-sm font-semibold text-gray-800 dark:text-white">
								{group.title}
							</h3>
						</div>
					{/if}
					{#if group.description}
						<p
							class="text-xs text-gray-400 dark:text-slate-500 leading-relaxed
							       {IconComponent ? 'pl-8' : ''}"
						>
							{group.description}
						</p>
					{/if}
				</div>
			{/if}

			<div class="grid grid-cols-1 {gridClass} gap-6">
				{#each group.fields as field (field.name)}
					{#if visibleFields.includes(field.name)}
						<div
							class="{field.colSpan === 2
								? 'lg:col-span-2'
								: field.colSpan === 3
									? 'lg:col-span-3'
									: ''}"
						>
							<FormFieldRenderer
								{field}
								{formState}
								{disabled}
								{onChange}
								{shouldShowError}
								{imageBaseUrl}
							/>
						</div>
					{/if}
				{/each}
			</div>
		</div>

	<!-- ════════════════════════════════════════════════════════════════════════
	     CARD / DEFAULT — profile-page card style
	     ════════════════════════════════════════════════════════════════════════ -->
	{:else}
		<div
			class="rounded-2xl border border-gray-200/70 dark:border-slate-800
			       bg-white/80 dark:bg-slate-900/80 backdrop-blur
			       overflow-hidden mb-6 {group.className ?? ''}"
		>
			<!-- ── Header ──────────────────────────────────────────────────────── -->
			{#if group.title || group.description}
				{#if group.collapsible}
					<!--
					     Collapsible header — entire row is a clickable button.
					     Matches the "Change Password" card on the profile page.
					-->
					<button
						type="button"
						onclick={toggleCollapse}
						class="w-full px-6 pt-5 flex items-center gap-3 text-left
						       group/hdr transition-colors
						       hover:bg-gray-50/50 dark:hover:bg-slate-800/30
						       {!isCollapsed
							       ? 'pb-4 border-b border-gray-100 dark:border-slate-800/60'
							       : 'pb-5'}"
					>
						{#if IconComponent}
							<div class="p-2 rounded-xl border flex-shrink-0 {cc.badge}">
								<IconComponent class="w-4 h-4 {cc.icon}" />
							</div>
						{/if}

						<div class="flex-1 min-w-0">
							{#if group.title}
								<h3 class="text-base font-semibold text-gray-900 dark:text-white">
									{group.title}
								</h3>
							{/if}
							{#if group.description}
								<p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
									{group.description}
								</p>
							{/if}
						</div>

						<!-- Expand / Collapse hint + chevron -->
						<div class="flex items-center gap-1.5 flex-shrink-0">
							<span class="text-xs font-medium transition-colors {cc.label}">
								{isCollapsed ? 'Expand' : 'Collapse'}
							</span>
							<ChevronDown
								class="w-4 h-4 text-gray-400 dark:text-slate-500
								       transition-transform duration-300
								       {isCollapsed ? '' : 'rotate-180'}"
							/>
						</div>
					</button>
				{:else}
					<!--
					     Non-collapsible header — matches Personal / Billing / Privacy
					     sections on the profile page exactly.
					-->
					<div
						class="px-6 pt-5 pb-4 flex items-center gap-3
						       border-b border-gray-100 dark:border-slate-800/60"
					>
						{#if IconComponent}
							<div class="p-2 rounded-xl border flex-shrink-0 {cc.badge}">
								<IconComponent class="w-4 h-4 {cc.icon}" />
							</div>
						{/if}
						<div>
							{#if group.title}
								<h3 class="text-base font-semibold text-gray-900 dark:text-white">
									{group.title}
								</h3>
							{/if}
							{#if group.description}
								<p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
									{group.description}
								</p>
							{/if}
						</div>
					</div>
				{/if}
			{/if}

			<!-- ── Content ─────────────────────────────────────────────────────── -->
			{#if !isCollapsed}
				<div transition:slide={{ duration: 220 }}>
					<div class="px-6 py-5">
						<div class="grid grid-cols-1 {gridClass} gap-6">
							{#each group.fields as field (field.name)}
								{#if visibleFields.includes(field.name)}
									<div
										class="{field.colSpan === 2
											? 'lg:col-span-2'
											: field.colSpan === 3
												? 'lg:col-span-3'
												: ''}"
									>
										<FormFieldRenderer
											{field}
											{formState}
											{disabled}
											{onChange}
											{shouldShowError}
											{imageBaseUrl}
										/>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
{/if}
