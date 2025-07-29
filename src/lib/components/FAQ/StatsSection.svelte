<!-- components/FAQ/StatsSection.svelte -->
<script lang="ts">
	interface Stat {
		value: string;
		label: string;
		color: string;
	}

	interface Props {
		stats?: Stat[];
	}

	let {
		stats = [
			{ value: "25+", label: "Questions Answered", color: "text-blue-600 dark:text-blue-400" },
			{ value: "< 2h", label: "Average Response Time", color: "text-green-600 dark:text-green-400" },
			{ value: "24/7", label: "Support Available", color: "text-purple-600 dark:text-purple-400" }
		]
	}: Props = $props();
</script>

<div class="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
	{#each stats as stat}
		<div class="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
			<div class="text-2xl font-bold {stat.color} mb-2">{stat.value}</div>
			<div class="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
		</div>
	{/each}
</div>