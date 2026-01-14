<!-- src/lib/components/ui/DateInput.svelte -->
<script lang="ts">
	import { Calendar, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';
	import { onMount } from 'svelte';

	interface Props {
		field: FormField;
		value: string | Date | null | undefined;
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: string) => void;
	}

	let {
		field,
		value,
		error,
		showError = false,
		disabled = false,
		onChange
	}: Props = $props();

	// Component state
	let showCalendar = $state(false);
	let isHovered = $state(false);
	let buttonRef: HTMLButtonElement;
	let calendarRef: HTMLDivElement;
	let portalContainer: HTMLDivElement;
	let dropdownPosition = $state({ top: 0, left: 0, width: 0 });

	// Calendar state
	let currentMonth = $state(new Date());
	let selectedDate = $state<Date | null>(null);

	// Map field props
	let placeholder = $derived(field.placeholder || 'Select a date...');
	let minDate = $derived(field.minDate ? new Date(field.minDate) : undefined);
	let maxDate = $derived(field.maxDate ? new Date(field.maxDate) : undefined);

	// Create portal container
	onMount(() => {
		portalContainer = document.createElement('div');
		portalContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 99999;';
		document.body.appendChild(portalContainer);

		return () => {
			if (portalContainer && portalContainer.parentNode) {
				portalContainer.parentNode.removeChild(portalContainer);
			}
		};
	});

	// Move calendar to portal when it opens
	$effect(() => {
		if (showCalendar && calendarRef && portalContainer) {
			portalContainer.appendChild(calendarRef);
		}
	});

	// Initialize selected date from value
	$effect(() => {
		if (value) {
			selectedDate = typeof value === 'string' ? new Date(value) : value;
		} else {
			selectedDate = null;
		}
	});

	// Calendar data
	const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const monthNames = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	function getCalendarDays() {
		const year = currentMonth.getFullYear();
		const month = currentMonth.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const startingDayOfWeek = firstDay.getDay();
		const daysInMonth = lastDay.getDate();
		const days: (Date | null)[] = [];

		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}

		for (let day = 1; day <= daysInMonth; day++) {
			days.push(new Date(year, month, day));
		}

		return days;
	}

	let calendarDays = $derived(getCalendarDays());

	function isDateSelected(date: Date | null): boolean {
		if (!date || !selectedDate) return false;
		return date.toDateString() === selectedDate.toDateString();
	}

	function isToday(date: Date | null): boolean {
		if (!date) return false;
		return date.toDateString() === new Date().toDateString();
	}

	function isDateDisabled(date: Date | null): boolean {
		if (!date) return false;
		if (minDate && date < minDate) return true;
		if (maxDate && date > maxDate) return true;
		return false;
	}

	function formatDate(date: Date | null): string {
		if (!date) return '';
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatDateForInput(date: Date | null): string {
		if (!date) return '';
		return date.toISOString().split('T')[0];
	}

	function handleDateSelect(date: Date | null) {
		if (!date || isDateDisabled(date)) return;
		selectedDate = date;
		onChange(field.name, formatDateForInput(date));
		showCalendar = false;
	}

	function previousMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
	}

	function goToToday() {
		const today = new Date();
		currentMonth = today;
		handleDateSelect(today);
	}

	function clearDate() {
		selectedDate = null;
		onChange(field.name, '');
	}

	function toggleCalendar() {
		if (disabled) return;
		showCalendar = !showCalendar;
		if (showCalendar) {
			currentMonth = selectedDate || new Date();
			setTimeout(() => updateDropdownPosition(), 0);
		}
	}

	function updateDropdownPosition() {
		if (!buttonRef) return;

		const rect = buttonRef.getBoundingClientRect();
		const dropdownHeight = 420; // Estimated calendar height
		const viewportHeight = window.innerHeight;

		// Calculate available space above and below
		const spaceBelow = viewportHeight - rect.bottom;
		const spaceAbove = rect.top;

		console.log('📍 Position Debug:', {
			spaceBelow,
			spaceAbove,
			dropdownHeight,
			willOpenUpward: spaceBelow < dropdownHeight && spaceAbove > spaceBelow
		});

		// Decide if should open upward
		const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

		if (shouldOpenUpward) {
			// Open upward - position ABOVE the button
			dropdownPosition = {
				top: rect.top - dropdownHeight - 4, // 4px gap above
				left: rect.left,
				width: Math.max(rect.width, 320)
			};
		} else {
			// Open downward - position BELOW the button
			dropdownPosition = {
				top: rect.bottom + 4, // 4px gap below
				left: rect.left,
				width: Math.max(rect.width, 320)
			};
		}

		// Ensure dropdown doesn't go off-screen horizontally
		const dropdownWidth = Math.max(rect.width, 320);
		const maxLeft = window.innerWidth - dropdownWidth - 16;
		if (dropdownPosition.left > maxLeft) {
			dropdownPosition.left = maxLeft;
		}
		if (dropdownPosition.left < 16) {
			dropdownPosition.left = 16;
		}

		// Ensure dropdown doesn't go off-screen vertically (top)
		if (dropdownPosition.top < 16) {
			dropdownPosition.top = 16;
		}

		// Ensure dropdown doesn't go off-screen vertically (bottom)
		const maxTop = viewportHeight - dropdownHeight - 16;
		if (dropdownPosition.top > maxTop) {
			dropdownPosition.top = maxTop;
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (!showCalendar) return;
		const target = event.target as Node;
		const clickedButton = buttonRef && buttonRef.contains(target);
		const clickedDropdown = calendarRef && calendarRef.contains(target);
		if (!clickedButton && !clickedDropdown) {
			showCalendar = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			showCalendar = false;
		}
	}

	const borderGradient = $derived(() => {
		if (disabled) return '';
		if (showError) return 'from-red-400 to-red-500';
		if (showCalendar) return 'from-indigo-500 via-purple-500 to-pink-500';
		if (selectedDate) return 'from-emerald-400 to-teal-500';
		if (isHovered) return 'from-slate-400 to-slate-500';
		return '';
	});

	const bgStyle = $derived(() => {
		if (disabled) return 'bg-slate-50';
		if (showError) return 'bg-red-50/50';
		if (selectedDate && !showCalendar) return 'bg-emerald-50/20';
		if (showCalendar) return 'bg-indigo-50/30';
		if (isHovered) return 'bg-slate-50';
		return 'bg-white';
	});

	$effect(() => {
		if (showCalendar) {
			document.addEventListener('click', handleClickOutside, true);
			document.addEventListener('keydown', handleKeydown);
			window.addEventListener('scroll', updateDropdownPosition, true);
			window.addEventListener('resize', updateDropdownPosition);

			return () => {
				document.removeEventListener('click', handleClickOutside, true);
				document.removeEventListener('keydown', handleKeydown);
				window.removeEventListener('scroll', updateDropdownPosition, true);
				window.removeEventListener('resize', updateDropdownPosition);
			};
		}
	});
</script>

<div class="relative mb-2">
	<div class="relative rounded-xl p-[2px] transition-all duration-200 {borderGradient() ? `bg-gradient-to-r ${borderGradient()}` : 'bg-slate-300'}">
		<div class="relative bg-white rounded-[11px]">
			<button
				bind:this={buttonRef}
				type="button"
				onclick={toggleCalendar}
				onmouseenter={() => isHovered = true}
				onmouseleave={() => isHovered = false}
				class="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-[11px] transition-all duration-200 text-left {bgStyle()} {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} {showCalendar ? 'shadow-lg shadow-indigo-100/50' : 'shadow-sm'}"
				disabled={disabled}
			>
				{#if selectedDate}
					<div class="relative flex-shrink-0">
						<div
							class="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 bg-gradient-to-br from-emerald-400 to-teal-500 {isHovered && !disabled ? 'scale-105 shadow-md' : 'scale-100'}"
						>
							<Calendar class="text-white" size={20} />
						</div>
						{#if !disabled && !showError}
							<div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-scale-in"></div>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm font-medium text-slate-900 truncate">
							{formatDate(selectedDate)}
						</span>
						<span class="block text-xs text-slate-500">
							{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
						</span>
					</div>
					{#if !disabled}
						<button
							type="button"
							onclick={(e) => { e.stopPropagation(); clearDate(); }}
							class="flex-shrink-0 p-1.5 rounded-md hover:bg-red-100 transition-colors group"
							title="Clear date"
						>
							<X class="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
						</button>
					{/if}
				{:else}
					<div class="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 transition-all duration-300 {isHovered && !disabled ? 'bg-slate-300' : ''}">
						<Calendar class="w-4 h-4 text-slate-400" />
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm text-slate-500 truncate">
							{placeholder}
						</span>
						<span class="block text-xs text-slate-400 truncate">
							Click to select
						</span>
					</div>
				{/if}

				<div class="flex-shrink-0">
					<div class="p-1 rounded-md transition-all duration-200 {showCalendar ? 'bg-indigo-100' : isHovered && !disabled ? 'bg-slate-100' : ''}">
						<Calendar class="w-4 h-4 transition-colors duration-300 {showCalendar ? 'text-indigo-600' : 'text-slate-400'}" />
					</div>
				</div>
			</button>

			{#if showError}
				<div class="absolute right-12 top-1/2 -translate-y-1/2 animate-shake">
					<AlertCircle class="w-4 h-4 text-red-500" />
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Calendar Dropdown (will be moved to portal) -->
{#if showCalendar && !disabled}
	<div
		bind:this={calendarRef}
		class="bg-white border border-slate-200 rounded-xl shadow-2xl shadow-indigo-100/50 overflow-hidden animate-slide-down max-h-[90vh] overflow-y-auto"
		style="position: fixed; top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px; pointer-events: auto;"
	>
		<!-- Calendar Header -->
		<div class="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
			<div class="flex items-center justify-between mb-3">
				<button
					type="button"
					onclick={previousMonth}
					class="p-2 rounded-lg hover:bg-white/60 transition-colors"
				>
					<ChevronLeft class="w-4 h-4 text-indigo-600" />
				</button>

				<div class="text-center">
					<div class="text-sm font-semibold text-indigo-900">
						{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
					</div>
				</div>

				<button
					type="button"
					onclick={nextMonth}
					class="p-2 rounded-lg hover:bg-white/60 transition-colors"
				>
					<ChevronRight class="w-4 h-4 text-indigo-600" />
				</button>
			</div>

			<button
				type="button"
				onclick={goToToday}
				class="w-full py-1.5 px-3 text-xs font-medium text-indigo-600 hover:bg-white/60 rounded-lg transition-colors"
			>
				Today
			</button>
		</div>

		<!-- Calendar Grid -->
		<div class="p-4">
			<div class="grid grid-cols-7 gap-1 mb-2">
				{#each daysOfWeek as day}
					<div class="text-center text-xs font-semibold text-slate-600 py-1">
						{day}
					</div>
				{/each}
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each calendarDays as date}
					{#if date}
						<button
							type="button"
							onclick={() => handleDateSelect(date)}
							disabled={isDateDisabled(date)}
							class="aspect-square flex items-center justify-center text-sm rounded-lg transition-all duration-200 {
								isDateDisabled(date)
									? 'text-slate-300 cursor-not-allowed'
									: isDateSelected(date)
										? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold shadow-md scale-105'
										: isToday(date)
											? 'bg-emerald-100 text-emerald-800 font-semibold hover:bg-emerald-200'
											: 'text-slate-700 hover:bg-slate-100 hover:scale-105'
							}"
						>
							{date.getDate()}
						</button>
					{:else}
						<div class="aspect-square"></div>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Footer -->
		<div class="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
			<span class="text-xs text-slate-600">
				{#if selectedDate}
					Selected: {formatDate(selectedDate)}
				{:else}
					No date selected
				{/if}
			</span>
		</div>
	</div>
{/if}

<style>
    @keyframes scale-in {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @keyframes slide-down {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }

    .animate-scale-in { animation: scale-in 0.2s ease-out; }
    .animate-shake { animation: shake 0.3s ease-out; }
    .animate-slide-down { animation: slide-down 0.2s ease-out; }
</style>