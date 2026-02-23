<script lang="ts">
	let {
		showBadge = false,
		badgeText = '',
		heading = '',
		subHeading = '',
		align = 'center'   // 'center' | 'left'
	} = $props();

	const alignClass = align === 'left'
		? 'text-left items-start'
		: 'text-center items-center';
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
	<div class="flex flex-col {alignClass} mb-16 gap-5">

		<!-- Optional label chip -->
		{#if showBadge && badgeText}
			<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 w-fit">
				<span class="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
				<span class="text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 uppercase">
					{badgeText}
				</span>
			</div>
		{/if}

		<!-- Heading -->
		<h2 class="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight max-w-3xl">
			{heading}
		</h2>

		<!-- Accent line -->
		<div class="w-10 h-0.5 rounded-full {align === 'center' ? 'mx-auto' : ''} bg-indigo-500 opacity-70"></div>

		<!-- Subheading -->
		{#if subHeading}
			<p class="text-lg text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed {align === 'center' ? 'mx-auto' : ''}">
				{subHeading}
			</p>
		{/if}

	</div>
</div>
