<script lang="ts">
	import { Check, X } from 'lucide-svelte';

	interface Props {
		password: string;
	}

	let { password }: Props = $props();

	// Define our validation criteria
	const criteria = $derived([
		{ label: 'At least 6 characters', met: password.length >= 6 },
		{ label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
		{ label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
		{ label: 'Contains a number', met: /[0-9]/.test(password) },
		{ label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
	]);

	// Calculate strength as percentage (0-100)
	let strength = $derived(() => {
		if (password.length === 0) return 0;

		let score = 0;
		const metCount = criteria.filter((c) => c.met).length;

		// Base score from criteria met (each worth 20%)
		score = (metCount / criteria.length) * 100;

		return Math.min(100, Math.round(score));
	});

	// Determine strength level for color and label
	let strengthLevel = $derived(() => {
		const s = strength();
		if (s === 0) return { label: '', color: 'bg-gray-500', textColor: 'text-gray-400' };
		if (s < 40) return { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400' };
		if (s < 60) return { label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-400' };
		if (s < 80) return { label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-400' };
		return { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400' };
	});
</script>

{#if password.length > 0}
	<div class="mt-3 space-y-3 animate-fadeIn">
		<!-- Strength bar -->
		<div class="space-y-1">
			<div class="flex justify-between items-center text-xs">
				<span class="text-indigo-200">Password strength</span>
				<span class={strengthLevel().textColor}>{strengthLevel().label}</span>
			</div>
			<div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
				<div
					class="h-full rounded-full transition-all duration-500 ease-out {strengthLevel().color}"
					style="width: {strength()}%"
				></div>
			</div>
		</div>

		<!-- Criteria checklist -->
		<ul class="space-y-1.5">
			{#each criteria as { label, met }}
				<li class="flex items-center gap-2 text-xs transition-all duration-300">
					{#if met}
						<div class="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
							<Check class="w-3 h-3 text-green-400" />
						</div>
						<span class="text-green-300">{label}</span>
					{:else}
						<div class="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
							<X class="w-3 h-3 text-indigo-300/50" />
						</div>
						<span class="text-indigo-300/70">{label}</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.3s ease-out;
    }
</style>