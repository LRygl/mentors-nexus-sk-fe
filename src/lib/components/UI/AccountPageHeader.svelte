<script lang="ts">
	import type { Component } from 'svelte';

	let {
		icon: Icon,
		title,
		subtitle = ''
	}: {
		icon: Component;
		title: string;
		subtitle?: string;
	} = $props();
</script>

<!--
	AccountPageHeader — shared heading for all account section pages.
	Usage:
	  <AccountPageHeader icon={GraduationCap} title="My Learning" subtitle="Track your progress." />
-->
<div class="mb-8 pb-6 border-b border-gray-100 dark:border-slate-800/60">
	<div class="flex items-center gap-4">

		<!-- Icon badge -->
		<div class="flex-shrink-0 p-2.5 rounded-xl
		            bg-gradient-to-br from-indigo-500/15 to-indigo-500/0
		            border border-indigo-500/20
		            shadow-sm shadow-indigo-500/10">
			<Icon class="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
		</div>

		<!-- Title + subtitle -->
		<div>
			<h1 class="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white tracking-tight leading-none">
				{title}
			</h1>
			{#if subtitle}
				<p class="text-sm text-gray-400 dark:text-slate-500 mt-1.5 leading-relaxed">
					{subtitle}
				</p>
			{/if}
		</div>

	</div>
</div>
