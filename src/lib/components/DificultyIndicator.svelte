<script lang="ts">

	import type { CourseLevel } from '$lib/types/enums/CourseLevel';
	import { cn } from '$lib/utils';

	interface Props {
		level: CourseLevel;
		showLabel?: boolean;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { level, showLabel = true, size = 'md', class: className }: Props = $props();


	const levelConfig = {
		BEGINNER: {
			bars: 1,
			label: 'Beginner',
			color: 'bg-green-500',
			textColor: 'text-green-700'
		},
		INTERMEDIATE: {
			bars: 2,
			label: 'Intermediate',
			color: 'bg-yellow-500',
			textColor: 'text-yellow-700'
		},
		ADVANCED: {
			bars: 3,
			label: 'Advanced',
			color: 'bg-orange-500',
			textColor: 'text-orange-700'
		},
		EXPERT: {
			bars: 4,
			label: 'Expert',
			color: 'bg-red-500',
			textColor: 'text-red-700'
		}
	} as const;

	const sizeConfig = {
		sm: {
			gap: 'gap-0.5',
			barWidth: 'w-1',
			heights: ['h-1.5', 'h-2.5', 'h-3.5', 'h-4.5'],
			text: 'text-xs'
		},
		md: {
			gap: 'gap-1',
			barWidth: 'w-1.5',
			heights: ['h-2', 'h-3', 'h-4', 'h-5'],
			text: 'text-sm'
		},
		lg: {
			gap: 'gap-1',
			barWidth: 'w-2',
			heights: ['h-3', 'h-4', 'h-5', 'h-6'],
			text: 'text-base'
		}
	} as const;

	const config = $derived(levelConfig[level] ?? levelConfig.BEGINNER);
	const sizes = $derived(sizeConfig[size]);

</script>

<div class={cn('inline-flex items-end', sizes.gap, className)}>
	<!-- Signal Bars -->
	<div class={cn('flex items-end', sizes.gap)}>
		{#each [0, 1, 2, 3] as barIndex}
			<div
				class={cn(
					sizes.barWidth,
					sizes.heights[barIndex],
					'rounded-sm transition-colors',
					barIndex < config.bars ? config.color : 'bg-gray-200'
				)}
			></div>
		{/each}
	</div>

	<!-- Label -->
	{#if showLabel}
		<span class={cn('ml-1.5 font-medium', sizes.text, config.textColor)}>
			{config.label}
		</span>
	{/if}
</div>