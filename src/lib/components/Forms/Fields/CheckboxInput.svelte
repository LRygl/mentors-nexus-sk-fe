<script lang="ts">
	import type { FormField } from '$lib/types/entities/forms';
	import { Eye, EyeOff } from 'lucide-svelte';

	interface Props {
		field: FormField;
		checked: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: boolean) => void;
	}

	let {
		field,
		checked,
		disabled = false,
		onChange
	}: Props = $props();

	let isHovered = $state(false);
</script>

<div class="group relative">
	<!-- Gradient border wrapper -->
	<div class="relative rounded-xl p-[1px] transition-all duration-300 {
		disabled ? 'bg-slate-200' :
		checked ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' :
		isHovered ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
		'bg-slate-200'
	}">
		<div class="relative bg-white rounded-[11px] overflow-hidden">
			<label
				class="flex items-center justify-between p-4 cursor-pointer transition-all duration-200 {
					disabled ? 'cursor-not-allowed opacity-60' :
					checked ? 'bg-gradient-to-r from-indigo-50/50 to-purple-50/30' :
					isHovered ? 'bg-slate-50' : 'bg-white'
				}"
				onmouseenter={() => isHovered = true}
				onmouseleave={() => isHovered = false}
			>
				<div class="flex items-center gap-3 flex-1 min-w-0">
					<!-- Icon with animated background -->
					<div class="flex-shrink-0 relative">
						<div class="p-2.5 rounded-lg transition-all duration-300 {
							disabled ? 'bg-slate-100' :
							checked ? 'bg-indigo-100 shadow-sm' :
							'bg-slate-100'
						} {isHovered && !disabled ? 'scale-105' : 'scale-100'}">
							{#if checked}
								<Eye class="w-5 h-5 text-indigo-600 transition-all duration-300" />
							{:else}
								<EyeOff class="w-5 h-5 text-slate-400 transition-all duration-300" />
							{/if}
						</div>

						<!-- Pulse ring on checked -->
						{#if checked && !disabled}
							<div class="absolute inset-0 rounded-lg bg-indigo-400 opacity-0 group-hover:opacity-20 animate-ping-slow"></div>
						{/if}
					</div>

					<!-- Text content -->
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="text-sm font-semibold transition-colors duration-200 {
								disabled ? 'text-slate-400' :
								checked ? 'text-slate-900' : 'text-slate-700'
							}">
								{field.label}
							</span>
						</div>
						{#if field.helpText}
							<p class="text-xs mt-0.5 transition-colors duration-200 {
								disabled ? 'text-slate-300' : 'text-slate-500'
							}">
								{field.helpText}
							</p>
						{/if}
					</div>
				</div>

				<!-- Custom checkbox -->
				<div class="flex-shrink-0 ml-3">
					<input
						type="checkbox"
						name={field.name}
						bind:checked
						onchange={(e) => {
							const target = e.currentTarget;
							onChange(field.name, target.checked);
						}}
						disabled={disabled}
						class="sr-only peer"
					/>
					<div class="relative w-11 h-6 rounded-full transition-all duration-300 ease-out {
						disabled ? 'bg-slate-200' :
						checked ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200' :
						'bg-slate-300'
					}">
						<!-- Toggle circle -->
						<div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ease-out shadow-md {
							checked ? 'translate-x-5' : 'translate-x-0'
						} {isHovered && !disabled ? 'scale-110' : 'scale-100'}">
							<!-- Inner dot indicator -->
							{#if checked}
								<div class="absolute inset-0 m-auto w-2 h-2 bg-indigo-600 rounded-full animate-scale-in"></div>
							{/if}
						</div>
					</div>
				</div>
			</label>
		</div>
	</div>

</div>

<style>
    @keyframes scale-in {
        from {
            transform: scale(0);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes ping-slow {
        75%, 100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }

    @keyframes shimmer {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(100%);
        }
    }

    .animate-scale-in {
        animation: scale-in 0.2s ease-out;
    }

    .animate-ping-slow {
        animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    .animate-shimmer {
        animation: shimmer 2s ease-in-out infinite;
    }
</style>