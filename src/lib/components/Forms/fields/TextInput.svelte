<script lang="ts">
	export let value: string;
	export let name: string;
	export let placeholder: string = '';
	export let disabled: boolean = false;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let error: boolean = false;

	// Callback function to notify parent
	export let onChange: (name: string, value: string) => void;

	function handleInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		onChange(name, target.value);
		console.log('NewInput')
	}
</script>

<input
	type="text"
	bind:value={value}
	on:input={handleInput}
	placeholder={placeholder}
	disabled={disabled}
	min={min}
	max={max}
	class="w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors {error ? 'border-red-300 bg-red-50' : 'border-slate-300'}"
/>