<script lang="ts">
	interface ChartConfig {
		type: 'line' | 'pie' | 'bar';
		data: any[];
	}

	interface IndicatorConfig {
		value: number;
		trend: 'up' | 'down' | 'neutral';
	}

	interface MetadataItemProps {
		label: string;
		value: string | number;
		type?: 'text' | 'number' | 'date' | 'datetime';
		canCopy?: boolean;
		icon?: string;
		indicator?: IndicatorConfig;
		chart?: ChartConfig;
		subtitle?: string;
	}

	let {
		label,
		value,
		type = 'text',
		canCopy = false,
		icon,
		indicator,
		chart,
		subtitle
	}: MetadataItemProps = $props();

	let copySuccess = $state(false);

	async function copyToClipboard() {
		if (!canCopy) return;

		try {
			await navigator.clipboard.writeText(String(value));
			copySuccess = true;
			setTimeout(() => {
				copySuccess = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function formatValue(): string {
		if (type === 'date' && value) {
			return new Date(value).toLocaleDateString('cs-CZ', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}

		if (type === 'datetime' && value) {
			return new Date(value).toLocaleDateString('cs-CZ', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		}

		if (type === 'number' && typeof value === 'number') {
			return value.toLocaleString('cs-CZ');
		}

		return String(value);
	}

	function formatSubValue(): string | null {
		if (type === 'datetime' && value) {
			return new Date(value).toLocaleTimeString('cs-CZ', {
				hour: '2-digit',
				minute: '2-digit'
			});
		}

		return subtitle || null;
	}

	function getTrendIcon(): string {
		if (!indicator) return '';

		switch (indicator.trend) {
			case 'up':
				return `<svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
      </svg>`;
			case 'down':
				return `<svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>`;
			case 'neutral':
				return `<svg class="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
      </svg>`;
			default:
				return '';
		}
	}

	function getTrendColor(): string {
		if (!indicator) return 'text-slate-600';

		switch (indicator.trend) {
			case 'up':
				return 'text-emerald-600';
			case 'down':
				return 'text-red-600';
			case 'neutral':
				return 'text-slate-600';
			default:
				return 'text-slate-600';
		}
	}

	function renderSimpleChart(): string {
		if (!chart || !chart.data || chart.data.length === 0) return '';

		if (chart.type === 'line') {
			const max = Math.max(...chart.data.map(d => d.value || 0));
			const min = Math.min(...chart.data.map(d => d.value || 0));
			const range = max - min || 1;

			const points = chart.data.map((d, i) => {
				const x = (i / (chart.data.length - 1)) * 100;
				const y = 100 - ((d.value - min) / range) * 100;
				return `${x},${y}`;
			}).join(' ');

			return `<svg class="w-full h-12 mt-2" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points="${points}"
        fill="none"
        stroke="rgb(59, 130, 246)"
        stroke-width="2"
      />
    </svg>`;
		}

		if (chart.type === 'bar') {
			const max = Math.max(...chart.data.map(d => d.value || 0));
			const barWidth = 100 / chart.data.length;

			const bars = chart.data.map((d, i) => {
				const height = (d.value / max) * 100;
				const x = i * barWidth;
				return `<rect x="${x}" y="${100 - height}" width="${barWidth * 0.8}" height="${height}" fill="rgb(59, 130, 246)" rx="1"/>`;
			}).join('');

			return `<svg class="w-full h-12 mt-2" viewBox="0 0 100 100" preserveAspectRatio="none">
      ${bars}
    </svg>`;
		}

		return '';
	}
</script>

<div class="bg-white px-6 py-4 group hover:bg-slate-50 transition-colors">
	<div class="flex items-start justify-between">
		<div class="flex-1 min-w-0">
			<!-- Label -->
			<dt class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
				{#if icon}
					<span class="inline-flex">{@html icon}</span>
				{/if}
				{label}
			</dt>

			<!-- Value -->
			<dd class="space-y-0.5">
				<div class="flex items-center gap-2">
          <span class="text-sm {type === 'text' ? 'font-mono' : 'font-semibold'} text-slate-900 {canCopy ? 'truncate' : ''}"
								title={canCopy ? String(value) : undefined}>
            {formatValue()}
          </span>

					{#if indicator}
						<div class="flex items-center gap-1">
							{@html getTrendIcon()}
							<span class="text-xs font-medium {getTrendColor()}">
                {indicator.value > 0 ? '+' : ''}{indicator.value}%
              </span>
						</div>
					{/if}
				</div>

				{#if formatSubValue()}
					<div class="text-xs text-slate-500">
						{formatSubValue()}
					</div>
				{/if}
			</dd>

			<!-- Chart -->
			{#if chart}
				<div class="mt-2">
					{@html renderSimpleChart()}
				</div>
			{/if}
		</div>

		<!-- Copy Button -->
		{#if canCopy}
			<button
				onclick={copyToClipboard}
				class="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-slate-200 rounded flex-shrink-0"
				title="Copy to clipboard"
			>
				{#if copySuccess}
					<svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
					</svg>
				{:else}
					<svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
					</svg>
				{/if}
			</button>
		{/if}
	</div>
</div>
