<!-- src/lib/components/ui/DateTimeInput.svelte -->
<!-- Enhanced version with optional time picker -->

<script lang="ts">
	import { Calendar, Clock, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';

	interface Props {
		field: FormField;
		value: string | Date | null | undefined;
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		showTimePicker?: boolean; // Enable time selection
		onChange: (fieldName: string, value: string) => void;
	}

	let {
		field,
		value,
		error,
		showError = false,
		disabled = false,
		showTimePicker = false,
		onChange
	}: Props = $props();

	// Component state
	let showCalendar = $state(false);
	let isHovered = $state(false);
	let dropdownRef: HTMLDivElement;
	let buttonRef: HTMLButtonElement;
	let dropdownPosition = $state({ top: 0, left: 0, width: 0 });

	// Calendar state
	let currentMonth = $state(new Date());
	let selectedDate = $state<Date | null>(null);
	let selectedHour = $state(12);
	let selectedMinute = $state(0);
	let selectedPeriod = $state<'AM' | 'PM'>('PM');

	// Map field props
	let placeholder = $derived(field.placeholder || 'Select date & time...');
	let minDate = $derived(field.minDate ? new Date(field.minDate) : undefined);
	let maxDate = $derived(field.maxDate ? new Date(field.maxDate) : undefined);

	// Initialize from value
	$effect(() => {
		if (value) {
			const date = typeof value === 'string' ? new Date(value) : value;
			selectedDate = date;

			if (showTimePicker) {
				let hours = date.getHours();
				selectedPeriod = hours >= 12 ? 'PM' : 'AM';
				selectedHour = hours % 12 || 12;
				selectedMinute = date.getMinutes();
			}
		} else {
			selectedDate = null;
		}
	});

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

	function formatDateTime(date: Date | null): string {
		if (!date) return '';

		if (showTimePicker) {
			return date.toLocaleString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			});
		}

		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function buildDateTimeValue(): Date | null {
		if (!selectedDate) return null;

		const date = new Date(selectedDate);

		if (showTimePicker) {
			let hours = selectedHour;
			if (selectedPeriod === 'PM' && hours !== 12) hours += 12;
			if (selectedPeriod === 'AM' && hours === 12) hours = 0;

			date.setHours(hours, selectedMinute, 0, 0);
		} else {
			date.setHours(12, 0, 0, 0); // Noon for date-only
		}

		return date;
	}

	function handleDateSelect(date: Date | null) {
		if (!date || isDateDisabled(date)) return;

		selectedDate = date;

		if (!showTimePicker) {
			// If no time picker, submit immediately
			const finalDate = buildDateTimeValue();
			onChange(field.name, finalDate?.toISOString() || '');
			showCalendar = false;
		}
	}

	function handleTimeConfirm() {
		const finalDate = buildDateTimeValue();
		onChange(field.name, finalDate?.toISOString() || '');
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
			updateDropdownPosition();
			currentMonth = selectedDate || new Date();

			// Initialize time to current time if not set
			if (showTimePicker && !selectedDate) {
				const now = new Date();
				selectedHour = now.getHours() % 12 || 12;
				selectedMinute = now.getMinutes();
				selectedPeriod = now.getHours() >= 12 ? 'PM' : 'AM';
			}
		}
	}

	function updateDropdownPosition() {
		if (buttonRef) {
			const rect = buttonRef.getBoundingClientRect();
			dropdownPosition = {
				top: rect.bottom + window.scrollY + 8,
				left: rect.left + window.scrollX,
				width: Math.max(rect.width, 320)
			};
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (!showCalendar) return;
		const target = event.target as Node;
		const clickedButton = buttonRef && buttonRef.contains(target);
		const clickedDropdown = dropdownRef && dropdownRef.contains(target);
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
							{#if showTimePicker}
								<Clock class="text-white" size={20} />
							{:else}
								<Calendar class="text-white" size={20} />
							{/if}
						</div>
						{#if !disabled && !showError}
							<div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-scale-in"></div>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm font-medium text-slate-900 truncate">
							{formatDateTime(selectedDate)}
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
						{#if showTimePicker}
							<Clock class="w-4 h-4 text-slate-400" />
						{:else}
							<Calendar class="w-4 h-4 text-slate-400" />
						{/if}
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

{#if showCalendar && !disabled}
	<div
		bind:this={dropdownRef}
		class="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl shadow-indigo-100/50 overflow-hidden animate-slide-down"
		style="top: {dropdownPosition.top}px; left: {dropdownPosition.left}px; width: {dropdownPosition.width}px;"
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

		<!-- Time Picker (if enabled) -->
		{#if showTimePicker && selectedDate}
			<div class="px-4 py-3 bg-slate-50 border-t border-slate-200">
				<div class="flex items-center justify-center gap-2">
					<Clock class="w-4 h-4 text-slate-600" />
					<span class="text-xs font-medium text-slate-700">Time</span>
				</div>

				<div class="flex items-center justify-center gap-2 mt-3">
					<!-- Hour -->
					<select
						bind:value={selectedHour}
						class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						{#each Array(12) as _, i}
							<option value={i + 1}>{String(i + 1).padStart(2, '0')}</option>
						{/each}
					</select>

					<span class="text-slate-600 font-semibold">:</span>

					<!-- Minute -->
					<select
						bind:value={selectedMinute}
						class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						{#each Array(60) as _, i}
							<option value={i}>{String(i).padStart(2, '0')}</option>
						{/each}
					</select>

					<!-- AM/PM -->
					<select
						bind:value={selectedPeriod}
						class="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
					>
						<option value="AM">AM</option>
						<option value="PM">PM</option>
					</select>
				</div>

				<button
					type="button"
					onclick={handleTimeConfirm}
					class="w-full mt-3 py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-sm"
				>
					Confirm
				</button>
			</div>
		{/if}

		<!-- Footer -->
		<div class="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
			<span class="text-xs text-slate-600">
				{#if selectedDate}
					{formatDateTime(buildDateTimeValue())}
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