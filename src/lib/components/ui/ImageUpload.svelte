<script lang="ts">
	import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';

	interface Props {
		field: FormField;
		value: string | null | undefined;
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
	let isHovered = $state(false);
	let isDragging = $state(false);
	let isUploading = $state(false);
	let uploadProgress = $state(0);
	let fileInputRef: HTMLInputElement;

	// Map field props
	let placeholder = $derived(field.placeholder || 'Upload an image...');
	let accept = $derived(field.accept || 'image/*');
	let maxSize = $derived(field.maxSize || 5 * 1024 * 1024); // Default 5MB
	let previewWidth = $derived(field.previewWidth || 200);
	let previewHeight = $derived(field.previewHeight || 200);

	// Derived states
	let hasImage = $derived(!!value);

	const borderGradient = $derived(() => {
		if (disabled) return '';
		if (showError) return 'from-red-400 to-red-500';
		if (isDragging) return 'from-purple-500 via-pink-500 to-indigo-500';
		if (hasImage) return 'from-emerald-400 to-teal-500';
		if (isHovered) return 'from-slate-400 to-slate-500';
		return '';
	});

	const bgStyle = $derived(() => {
		if (disabled) return 'bg-slate-50';
		if (showError) return 'bg-red-50/50';
		if (hasImage && !isDragging) return 'bg-emerald-50/20';
		if (isDragging) return 'bg-purple-50/30';
		if (isHovered) return 'bg-slate-50';
		return 'bg-white';
	});

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
	}

	function validateFile(file: File): string | null {
		// Check file type
		if (accept !== '*' && !file.type.match(accept.replace('*', '.*'))) {
			return `Please select a valid image file (${accept})`;
		}

		// Check file size
		if (file.size > maxSize) {
			return `File size must be less than ${formatFileSize(maxSize)}`;
		}

		return null;
	}

	async function handleFile(file: File) {
		if (disabled) return;

		const validationError = validateFile(file);
		if (validationError) {
			// You might want to show this error somehow
			console.error(validationError);
			return;
		}

		isUploading = true;
		uploadProgress = 0;

		try {
			// Simulate upload progress
			const progressInterval = setInterval(() => {
				uploadProgress += 10;
				if (uploadProgress >= 90) {
					clearInterval(progressInterval);
				}
			}, 100);

			// Convert file to base64 data URL
			const reader = new FileReader();
			reader.onload = (e) => {
				const dataUrl = e.target?.result as string;
				uploadProgress = 100;
				clearInterval(progressInterval);

				setTimeout(() => {
					onChange(field.name, dataUrl);
					isUploading = false;
					uploadProgress = 0;
				}, 300);
			};
			reader.onerror = () => {
				clearInterval(progressInterval);
				isUploading = false;
				uploadProgress = 0;
				console.error('Failed to read file');
			};
			reader.readAsDataURL(file);
		} catch (err) {
			isUploading = false;
			uploadProgress = 0;
			console.error('Upload error:', err);
		}
	}

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			handleFile(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!disabled) {
			isDragging = true;
		}
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (disabled) return;

		const file = event.dataTransfer?.files?.[0];
		if (file) {
			handleFile(file);
		}
	}

	function clearImage() {
		onChange(field.name, '');
		if (fileInputRef) {
			fileInputRef.value = '';
		}
	}

	function triggerFileInput() {
		if (!disabled && fileInputRef) {
			fileInputRef.click();
		}
	}
</script>

<div class="relative mb-2">
	<div
		class="relative rounded-xl p-[2px] transition-all duration-200 {borderGradient() ? `bg-gradient-to-r ${borderGradient()}` : 'bg-slate-300'}"
	>
		<div class="relative bg-white rounded-[11px]">
			<div
				role="button"
				tabindex={disabled ? -1 : 0}
				onmouseenter={() => (isHovered = true)}
				onmouseleave={() => (isHovered = false)}
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				onclick={triggerFileInput}
				onkeydown={(e) => e.key === 'Enter' && triggerFileInput()}
				class="relative flex items-center gap-3 px-4 py-3 rounded-[11px] transition-all duration-200 {bgStyle()} {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} {isDragging ? 'shadow-lg shadow-purple-100/50' : 'shadow-sm'}"
			>
				{#if hasImage && !isUploading}
					<div class="relative flex-shrink-0">
						<div
							class="w-16 h-16 rounded-lg overflow-hidden shadow-sm transition-all duration-300 border-2 border-emerald-200 {isHovered && !disabled ? 'scale-105 shadow-md border-emerald-300' : 'scale-100'}"
						>
							<img
								src={value}
								alt="Preview"
								class="w-full h-full object-cover"
							/>
						</div>
						{#if !disabled && !showError}
							<div
								class="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center animate-scale-in"
							>
								<Check class="w-3 h-3 text-white" />
							</div>
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm font-medium text-slate-900 truncate">
							Image uploaded
						</span>
						<span class="block text-xs text-slate-500">
							Click to change or drag a new image
						</span>
					</div>
					{#if !disabled}
						<button
							type="button"
							onclick={(e) => {
								e.stopPropagation();
								clearImage();
							}}
							class="flex-shrink-0 p-1.5 rounded-md hover:bg-red-100 transition-colors group"
							title="Remove image"
						>
							<X class="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors" />
						</button>
					{/if}
				{:else if isUploading}
					<div class="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
						<Upload class="w-6 h-6 text-indigo-600 animate-bounce" />
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm font-medium text-indigo-900 truncate">
							Uploading...
						</span>
						<div class="mt-1 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
							<div
								class="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 rounded-full"
								style="width: {uploadProgress}%"
							></div>
						</div>
					</div>
				{:else}
					<div
						class="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 transition-all duration-300 {isHovered && !disabled ? 'bg-slate-300' : ''}"
					>
						<ImageIcon class="w-6 h-6 text-slate-400" />
					</div>
					<div class="flex-1 min-w-0">
						<span class="block text-sm text-slate-500 truncate">
							{placeholder}
						</span>
						<span class="block text-xs text-slate-400 truncate">
							Click to select or drag and drop
						</span>
					</div>
				{/if}

				<div class="flex-shrink-0">
					<div
						class="p-1 rounded-md transition-all duration-200 {isDragging ? 'bg-purple-100' : isHovered && !disabled ? 'bg-slate-100' : ''}"
					>
						<Upload
							class="w-4 h-4 transition-colors duration-300 {isDragging ? 'text-purple-600' : 'text-slate-400'}"
						/>
					</div>
				</div>

				{#if showError}
					<div class="absolute right-12 top-1/2 -translate-y-1/2 animate-shake">
						<AlertCircle class="w-4 h-4 text-red-500" />
					</div>
				{/if}
			</div>

			<!-- Hidden file input -->
			<input
				bind:this={fileInputRef}
				type="file"
				{accept}
				onchange={handleFileSelect}
				class="hidden"
				{disabled}
			/>
		</div>
	</div>

	<!-- Image preview modal (optional, can be added if needed) -->
	{#if hasImage && value}
		<div class="mt-3 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
			<img
				src={value}
				alt="Full preview"
				class="w-full h-auto max-h-64 object-contain bg-slate-50"
			/>
		</div>
	{/if}
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

	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}

	.animate-scale-in {
		animation: scale-in 0.2s ease-out;
	}
	.animate-shake {
		animation: shake 0.3s ease-out;
	}
</style>
