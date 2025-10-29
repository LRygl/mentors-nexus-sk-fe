<!-- src/lib/components/ui/ImageUpload.svelte -->
<script lang="ts">
	import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';

	interface Props {
		field: FormField;
		value: string | File | null | undefined;
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: File | string) => void;
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
	let isDragging = $state(false);
	let isHovered = $state(false);
	let previewUrl = $state<string | null>(null);
	let fileInputRef: HTMLInputElement;

	// Map field props
	let placeholder = $derived(field.placeholder || 'Upload an image...');
	let maxSize = $derived(field.maxFileSize || 5 * 1024 * 1024); // Default 5MB
	let acceptedTypes = $derived(field.acceptedFileTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

	// Initialize preview from existing value
	$effect(() => {
		if (value) {
			if (typeof value === 'string') {
				// Existing image URL
				previewUrl = value;
			} else if (value instanceof File) {
				// New file upload
				const reader = new FileReader();
				reader.onload = (e) => {
					previewUrl = e.target?.result as string;
				};
				reader.readAsDataURL(value);
			}
		} else {
			previewUrl = null;
		}
	});

	function validateFile(file: File): string | null {
		// Check file type
		if (!acceptedTypes.includes(file.type)) {
			return `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1]).join(', ')}`;
		}

		// Check file size
		if (file.size > maxSize) {
			const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
			return `File too large. Maximum size: ${maxSizeMB}MB`;
		}

		return null;
	}

	function handleFileSelect(file: File) {
		const validationError = validateFile(file);
		if (validationError) {
			// You might want to emit this error through a callback
			console.error(validationError);
			return;
		}

		onChange(field.name, file);
	}

	function handleFileInputChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			handleFileSelect(file);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (disabled) return;

		const file = event.dataTransfer?.files[0];
		if (file) {
			handleFileSelect(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!disabled) {
			isDragging = true;
		}
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function clearImage() {
		previewUrl = null;
		onChange(field.name, '');
		if (fileInputRef) {
			fileInputRef.value = '';
		}
	}

	function openFilePicker() {
		if (!disabled) {
			fileInputRef?.click();
		}
	}

	const borderGradient = $derived(() => {
		if (disabled) return '';
		if (showError) return 'from-red-400 to-red-500';
		if (isDragging) return 'from-indigo-500 via-purple-500 to-pink-500';
		if (previewUrl) return 'from-emerald-400 to-teal-500';
		if (isHovered) return 'from-slate-400 to-slate-500';
		return '';
	});

	const bgStyle = $derived(() => {
		if (disabled) return 'bg-slate-50';
		if (showError) return 'bg-red-50/50';
		if (isDragging) return 'bg-indigo-50/30';
		if (previewUrl) return 'bg-emerald-50/20';
		if (isHovered) return 'bg-slate-50';
		return 'bg-white';
	});

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}
</script>

<div class="relative mb-2">
	<div class="relative rounded-xl p-[2px] transition-all duration-200 {borderGradient() ? `bg-gradient-to-r ${borderGradient()}` : 'bg-slate-300'}">
		<div class="relative bg-white rounded-[11px]">
			<!-- Hidden file input -->
			<input
				bind:this={fileInputRef}
				type="file"
				accept={acceptedTypes.join(',')}
				onchange={handleFileInputChange}
				class="hidden"
				disabled={disabled}
			/>

			{#if previewUrl}
				<!-- Preview Mode -->
				<div
					class="relative rounded-[11px] overflow-hidden transition-all duration-200 {bgStyle()}"
					onmouseenter={() => isHovered = true}
					onmouseleave={() => isHovered = false}
				>
					<div class="relative aspect-video w-full">
						<img
							src={previewUrl}
							alt="Preview"
							class="w-full h-full object-cover"
						/>

						<!-- Overlay on hover -->
						{#if isHovered && !disabled}
							<div class="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-opacity duration-200">
								<button
									type="button"
									onclick={openFilePicker}
									class="p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
									title="Change image"
								>
									<Upload class="w-5 h-5 text-slate-700" />
								</button>
								<button
									type="button"
									onclick={(e) => { e.stopPropagation(); clearImage(); }}
									class="p-3 bg-white rounded-lg hover:bg-red-100 transition-colors shadow-lg group"
									title="Remove image"
								>
									<X class="w-5 h-5 text-slate-700 group-hover:text-red-600" />
								</button>
							</div>
						{/if}

						<!-- Success indicator -->
						{#if !showError && !isHovered}
							<div class="absolute top-3 right-3">
								<div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
									<Check class="w-5 h-5 text-white" />
								</div>
							</div>
						{/if}
					</div>

					<!-- Image info footer -->
					<div class="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
						<div class="flex items-center justify-between">
							<span class="text-xs text-slate-600 font-medium">
								{#if value instanceof File}
									{value.name} • {formatFileSize(value.size)}
								{:else}
									Uploaded image
								{/if}
							</span>
							{#if !disabled}
								<button
									type="button"
									onclick={clearImage}
									class="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
								>
									Remove
								</button>
							{/if}
						</div>
					</div>
				</div>
			{:else}
				<!-- Upload Mode -->
				<button
					type="button"
					onclick={openFilePicker}
					ondrop={handleDrop}
					ondragover={handleDragOver}
					ondragleave={handleDragLeave}
					onmouseenter={() => isHovered = true}
					onmouseleave={() => isHovered = false}
					class="w-full p-8 rounded-[11px] transition-all duration-200 {bgStyle()} {disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} {isDragging ? 'scale-[0.98]' : 'scale-100'}"
					disabled={disabled}
				>
					<div class="flex flex-col items-center justify-center gap-4">
						<!-- Icon -->
						<div class="relative">
							<div
								class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-300 {
									isDragging
										? 'bg-gradient-to-br from-indigo-400 to-purple-500 scale-110'
										: previewUrl
											? 'bg-gradient-to-br from-emerald-400 to-teal-500'
											: isHovered && !disabled
												? 'bg-gradient-to-br from-slate-300 to-slate-400 scale-105'
												: 'bg-slate-200'
								}"
							>
								{#if isDragging}
									<Upload class="w-8 h-8 text-white animate-bounce" />
								{:else}
									<ImageIcon class="w-8 h-8 {isDragging || (isHovered && !disabled) ? 'text-white' : 'text-slate-400'}" />
								{/if}
							</div>
						</div>

						<!-- Text -->
						<div class="text-center">
							<p class="text-sm font-medium text-slate-900 mb-1">
								{#if isDragging}
									Drop your image here
								{:else}
									{placeholder}
								{/if}
							</p>
							<p class="text-xs text-slate-500">
								{#if isDragging}
									Release to upload
								{:else}
									Drag and drop or click to browse
								{/if}
							</p>
							<p class="text-xs text-slate-400 mt-2">
								Supported: {acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} • Max {(maxSize / (1024 * 1024)).toFixed(0)}MB
							</p>
						</div>

						<!-- Upload button -->
						{#if !isDragging}
							<div class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 {isHovered && !disabled ? 'scale-105' : 'scale-100'}">
								Choose File
							</div>
						{/if}
					</div>
				</button>
			{/if}

			{#if showError}
				<div class="absolute right-4 top-4 animate-shake z-10">
					<div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
						<AlertCircle class="w-5 h-5 text-white" />
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
    @keyframes scale-in {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }

    .animate-scale-in { animation: scale-in 0.2s ease-out; }
    .animate-shake { animation: shake 0.3s ease-out; }
</style>