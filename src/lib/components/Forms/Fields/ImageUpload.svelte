<script lang="ts">
	import { Upload, X, Image as ImageIcon, AlertCircle, Check, FileImage } from 'lucide-svelte';
	import type { FormField } from '$lib/types/entities/forms';

	// TODO fix display of placeholder - no placeholder is used the default upload icon should be shown if there is no imageUrl

	interface Props {
		field: FormField;
		value: any; // Can be a File object or a URL string
		error?: string;
		showError?: boolean;
		disabled?: boolean;
		onChange: (fieldName: string, value: any) => void;
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
	let uploadError = $state<string | null>(null);

	// Map field props
	let placeholder = $derived(field.placeholder || 'Upload an image...');
	let maxSize = $derived(field.maxFileSize || 5 * 1024 * 1024);
	let acceptedTypes = $derived(field.acceptedFileTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

	$effect(() => {
		if (value) {
			if (typeof value === 'string') {
				// String value = URL (either full URL or data URL)
				previewUrl = value;
				uploadError = null;
			} else if (value instanceof File) {
				// File object = create preview from File
				const reader = new FileReader();
				reader.onload = (e) => {
					previewUrl = e.target?.result as string;
					uploadError = null;
				};
				reader.onerror = () => {
					uploadError = 'Failed to read file';
					previewUrl = null;
				};
				reader.readAsDataURL(value);
			}
		} else {
			previewUrl = null;
		}
	});


	$effect(() => {
		return () => {
			if (previewUrl && previewUrl.startsWith('blob:')) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});

	function validateFile(file: File): string | null {
		if (!acceptedTypes.includes(file.type)) {
			return `Invalid file type. Accepted: ${acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`;
		}

		if (file.size > maxSize) {
			const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
			return `File too large. Maximum size: ${maxSizeMB}MB`;
		}

		return null;
	}

	function handleFileSelect(file: File) {
		const validationError = validateFile(file);
		if (validationError) {
			uploadError = validationError;
			return;
		}

		uploadError = null;
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
		// Cleanup object URL if it exists
		if (previewUrl && previewUrl.startsWith('blob:')) {
			URL.revokeObjectURL(previewUrl);
		}

		previewUrl = null;
		uploadError = null;
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

	const hasError = $derived(showError || !!uploadError);

	const borderClass = $derived(() => {
		if (disabled) return 'border-slate-200';
		if (hasError) return 'border-red-300 ring-2 ring-red-100';
		if (isDragging) return 'border-blue-400 ring-2 ring-blue-100';
		if (previewUrl) return 'border-emerald-300';
		return 'border-slate-200 hover:border-slate-300';
	});

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}

	function getFileExtension(filename: string): string {
		return filename.split('.').pop()?.toUpperCase() || '';
	}

	function getFileName(): string {
		if (value instanceof File) {
			return value.name;
		} else if (typeof value === 'string') {
			// Extract filename from URL
			try {
				const url = new URL(value, window.location.origin);
				const pathname = url.pathname;
				const parts = pathname.split('/');
				return decodeURIComponent(parts[parts.length - 1]) || 'Uploaded image';
			} catch {
				// If URL parsing fails, just use the last part after splitting by '/'
				const parts = value.split('/');
				return parts[parts.length - 1] || 'Uploaded image';
			}
		}
		return 'Uploaded image';
	}
</script>

<div class="space-y-2">
	<!-- Hidden file input -->
	<input
		bind:this={fileInputRef}
		type="file"
		accept={acceptedTypes.join(',')}
		onchange={handleFileInputChange}
		class="hidden"
		disabled={disabled}
		aria-label={field.label}
	/>

	{#if previewUrl}
		<!-- Compact Preview Mode -->
		<div
			class="group relative rounded-lg border-2 transition-all duration-200 overflow-hidden {borderClass()} {disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}"
			onmouseenter={() => isHovered = true}
			onmouseleave={() => isHovered = false}
		>
			<!-- Image Preview Container - Fixed Height -->
			<div class="relative h-40 bg-slate-50">
				<img
					src={previewUrl}
					alt="Preview"
					class="w-full h-full object-contain"
					onerror={(e) => {
						// Handle image load errors
						uploadError = 'Failed to load image';
						console.error('[ImageUpload] Failed to load image:', previewUrl);
					}}
				/>

				<!-- Hover Overlay with Actions -->
				{#if isHovered && !disabled}
					<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center p-4 transition-opacity duration-200">
						<div class="flex gap-2">
							<button
								type="button"
								onclick={openFilePicker}
								class="px-4 py-2 bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-medium rounded-lg hover:bg-white transition-all duration-200 shadow-lg flex items-center gap-2"
								title="Change image"
							>
								<Upload class="w-4 h-4" />
								Change
							</button>
							<button
								type="button"
								onclick={(e) => { e.stopPropagation(); clearImage(); }}
								class="px-4 py-2 bg-white/95 backdrop-blur-sm text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-all duration-200 shadow-lg flex items-center gap-2"
								title="Remove image"
							>
								<X class="w-4 h-4" />
								Remove
							</button>
						</div>
					</div>
				{/if}

				<!-- Success Badge -->
				{#if !hasError && !isHovered}
					<div class="absolute top-2 right-2">
						<div class="px-2.5 py-1 bg-emerald-500 rounded-full flex items-center gap-1.5 shadow-lg animate-scale-in">
							<Check class="w-3.5 h-3.5 text-white" />
							<span class="text-xs font-medium text-white">Uploaded</span>
						</div>
					</div>
				{/if}

				<!-- Error Badge -->
				{#if hasError}
					<div class="absolute top-2 right-2 animate-shake">
						<div class="px-2.5 py-1 bg-red-500 rounded-full flex items-center gap-1.5 shadow-lg">
							<AlertCircle class="w-3.5 h-3.5 text-white" />
							<span class="text-xs font-medium text-white">Error</span>
						</div>
					</div>
				{/if}
			</div>

			<!-- File Info Footer - Compact -->
			<div class="px-3 py-2 bg-slate-50 border-t border-slate-200">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2 min-w-0 flex-1">
						<div class="flex-shrink-0 w-8 h-8 bg-slate-200 rounded flex items-center justify-center">
							<FileImage class="w-4 h-4 text-slate-600" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-xs font-medium text-slate-900 truncate">
								{getFileName()}
							</p>
							<p class="text-xs text-slate-500">
								{#if value instanceof File}
									{formatFileSize(value.size)} • {getFileExtension(value.name)}
								{:else}
									Image
								{/if}
							</p>
						</div>
					</div>
					{#if !disabled}
						<button
							type="button"
							onclick={clearImage}
							class="flex-shrink-0 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
						>
							Remove
						</button>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<!-- Upload Mode - Compact -->
		<button
			type="button"
			onclick={openFilePicker}
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			onmouseenter={() => isHovered = true}
			onmouseleave={() => isHovered = false}
			class="w-full px-4 py-6 rounded-lg border-2 border-dashed transition-all duration-200 {borderClass()} {disabled ? 'cursor-not-allowed opacity-60 bg-slate-50' : 'cursor-pointer hover:bg-slate-50'} {isDragging ? 'scale-[0.98] bg-blue-50' : 'scale-100'}"
			disabled={disabled}
		>
			<div class="flex flex-col items-center justify-center gap-3">
				<!-- Icon -->
				<div class="relative">
					<div
						class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 {
							isDragging
								? 'bg-blue-500 scale-110 shadow-lg'
								: hasError
									? 'bg-red-100'
									: isHovered && !disabled
										? 'bg-slate-200 scale-105'
										: 'bg-slate-100'
						}"
					>
						{#if isDragging}
							<Upload class="w-6 h-6 text-white animate-bounce" />
						{:else if hasError}
							<AlertCircle class="w-6 h-6 text-red-600" />
						{:else}
							<ImageIcon class="w-6 h-6 text-slate-400" />
						{/if}
					</div>

					{#if !isDragging && !hasError && isHovered && !disabled}
						<div class="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm animate-scale-in">
							<Upload class="w-3 h-3 text-white" />
						</div>
					{/if}
				</div>

				<!-- Text -->
				<div class="text-center">
					<p class="text-sm font-medium text-slate-900">
						{#if isDragging}
							Drop your image here
						{:else if hasError}
							Upload failed - Try again
						{:else}
							{placeholder}
						{/if}
					</p>
					<p class="text-xs text-slate-500 mt-1">
						{#if isDragging}
							Release to upload
						{:else}
							Drag & drop or click to browse
						{/if}
					</p>
				</div>

				<!-- File requirements - Compact -->
				<div class="flex items-center gap-3 text-xs text-slate-400">
					<div class="flex items-center gap-1">
						<FileImage class="w-3.5 h-3.5" />
						{acceptedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
					</div>
					<div class="w-1 h-1 rounded-full bg-slate-300"></div>
					<div>
						Max {(maxSize / (1024 * 1024)).toFixed(0)}MB
					</div>
				</div>
			</div>
		</button>
	{/if}

	<!-- Error Message -->
	{#if hasError}
		<div class="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
			<AlertCircle class="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
			<div class="flex-1 min-w-0">
				<p class="text-sm text-red-900 font-medium">Upload Error</p>
				<p class="text-xs text-red-700 mt-0.5">
					{uploadError || error || 'Please check the file and try again'}
				</p>
			</div>
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
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-4px); }
        75% { transform: translateX(4px); }
    }

    @keyframes slide-down {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-scale-in {
        animation: scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .animate-shake {
        animation: shake 0.3s ease-out;
    }

    .animate-slide-down {
        animation: slide-down 0.2s ease-out;
    }
</style>