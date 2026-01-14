<!-- $lib/components/Forms/UniversalUpload.svelte - Complete with all styles -->
<script lang="ts">
	import { Upload, X, File, Image, Video, FileText, AlertCircle } from 'lucide-svelte';
	import type { FormField, UploadConfig } from '$lib/types/entities/forms';
	import {
		UPLOAD_PRESETS,
		formatFileSize,
		validateFile,
		createFilePreview
	} from '$lib/utils/uploadHelpers';

	interface Props {
		field?: FormField;
		value?: File | string | null;
		config?: UploadConfig;
		disabled?: boolean;
		error?: string;
		showError?: boolean;
		onChange: (fieldNameOrFile: string | File | null, fileOrUndefined?: File | null) => void;
		imageBaseUrl?: string;
		baseUrl?: string;
	}

	let {
		field,
		value = null,
		config,
		disabled = false,
		error = '',
		showError = false,
		onChange,
		imageBaseUrl = '',
		baseUrl = ''
	}: Props = $props();

	const DEFAULT_CONFIG: UploadConfig = {
		type: 'image',
		preview: true,
		dragDrop: true,
		maxFileSize: 5 * 1024 * 1024,
		acceptedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
	};

	const uploadConfig = $derived.by(() => {
		if (config) {
			return {
				type: config.type || DEFAULT_CONFIG.type,
				preview: config.preview ?? true,
				dragDrop: config.dragDrop ?? true,
				maxFileSize: config.maxFileSize,
				acceptedFileTypes: config.acceptedFileTypes
			};
		}

		if (field?.uploadConfig) {
			return {
				type: field.uploadConfig.type || DEFAULT_CONFIG.type,
				preview: field.uploadConfig.preview ?? true,
				dragDrop: field.uploadConfig.dragDrop ?? true,
				maxFileSize: field.uploadConfig.maxFileSize || field.maxFileSize || UPLOAD_PRESETS[field.uploadConfig.type]?.maxSize,
				acceptedFileTypes: field.uploadConfig.acceptedFileTypes || field.acceptedFileTypes || UPLOAD_PRESETS[field.uploadConfig.type]?.accepts
			};
		}

		if (field) {
			const fieldType = field.type === 'image' ? 'image' : 'image';
			return {
				type: fieldType,
				preview: true,
				dragDrop: true,
				maxFileSize: field.maxFileSize || UPLOAD_PRESETS[fieldType]?.maxSize,
				acceptedFileTypes: field.acceptedFileTypes || UPLOAD_PRESETS[fieldType]?.accepts
			};
		}

		return DEFAULT_CONFIG;
	});

	const actualBaseUrl = $derived(baseUrl || imageBaseUrl);

	let fileInput: HTMLInputElement;
	let isDragging = $state(false);
	let preview = $state<string | null>(null);
	let uploadError = $state<string | null>(null);
	let isLoading = $state(false);

	const preset = $derived(UPLOAD_PRESETS[uploadConfig.type]);
	const accepts = $derived((uploadConfig.acceptedFileTypes || preset.accepts).join(','));
	const hasValue = $derived(!!value);
	const displayError = $derived(showError && (error || uploadError));
	const errorMessage = $derived(error || uploadError || '');

	$effect(() => {
		if (typeof value === 'string' && value && uploadConfig.preview !== false) {
			if (uploadConfig.type === 'image') {
				preview = actualBaseUrl ? `${actualBaseUrl}${value}` : value;
			}
		} else if (value instanceof File && uploadConfig.preview !== false) {
			loadPreview(value);
		} else {
			preview = null;
		}
	});

	async function loadPreview(file: File) {
		if (uploadConfig.type === 'image') {
			try {
				preview = await createFilePreview(file);
			} catch (err) {
				console.error('Failed to create preview:', err);
				preview = null;
			}
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		if (disabled) return;

		const file = event.dataTransfer?.files[0];
		if (file) {
			processFile(file);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (!disabled && uploadConfig.dragDrop !== false) {
			isDragging = true;
		}
	}

	function handleDragLeave() {
		isDragging = false;
	}

	async function processFile(file: File) {
		console.log('🔵 [UniversalUpload] Processing file:', {
			name: file.name,
			size: file.size,
			type: file.type,
			fieldName: field?.name,
			uploadType: uploadConfig.type,
			configMaxSize: uploadConfig.maxFileSize,
			configAccepts: uploadConfig.acceptedFileTypes
		});

		isLoading = true;
		uploadError = null;

		const validation = validateFile(file, uploadConfig);
		console.log('🔵 [UniversalUpload] Validation result:', validation);

		if (!validation.valid) {
			uploadError = validation.error || 'Invalid file';
			console.error('🔴 [UniversalUpload] Validation failed:', uploadError);
			isLoading = false;
			return;
		}

		if (uploadConfig.preview !== false) {
			await loadPreview(file);
		}

		if (field) {
			console.log('🟢 [UniversalUpload] Calling onChange with field.name:', field.name, 'file:', file);
			onChange(field.name, file);
		} else {
			console.log('🟢 [UniversalUpload] Calling onChange with file:', file);
			onChange(file as any);
		}

		console.log('✅ [UniversalUpload] File processed successfully');
		isLoading = false;
	}

	function handleRemove() {
		console.log('🗑️ [UniversalUpload] Removing file:', field?.name);
		preview = null;
		uploadError = null;

		if (field) {
			onChange(field.name, null);
		} else {
			onChange(null as any);
		}

		if (fileInput) {
			fileInput.value = '';
		}
	}

	function openFilePicker() {
		if (!disabled) {
			fileInput?.click();
		}
	}

	function getIconComponent() {
		switch (uploadConfig.type) {
			case 'image': return Image;
			case 'video': return Video;
			case 'document': return FileText;
			default: return File;
		}
	}

	const IconComponent = $derived(getIconComponent());
</script>

<div class="universal-upload">
	<input
		bind:this={fileInput}
		type="file"
		accept={accepts}
		{disabled}
		onchange={handleFileSelect}
		class="hidden"
	/>

	<div
		class="upload-container"
		class:has-value={hasValue && preview}
		class:is-dragging={isDragging}
		class:is-disabled={disabled}
		class:has-error={displayError}
		ondrop={handleDrop}
		ondragover={handleDragOver}
		ondragleave={handleDragLeave}
		role="button"
		tabindex={disabled ? -1 : 0}
		onclick={openFilePicker}
		onkeydown={(e) => e.key === 'Enter' && openFilePicker()}
	>
		{#if isLoading}
			<div class="upload-loading">
				<div class="spinner"></div>
				<p class="text-sm text-gray-600">Processing...</p>
			</div>
		{:else if hasValue && preview && uploadConfig.type === 'image'}
			<div class="image-preview-container">
				<img src={preview} alt="Preview" class="image-preview" />
				<div class="preview-overlay">
					<button
						type="button"
						onclick={(e) => { e.stopPropagation(); handleRemove(); }}
						class="remove-button"
						disabled={disabled}
					>
						<X class="w-4 h-4" />
					</button>
				</div>
			</div>
		{:else if hasValue}
			<div class="file-info" class:file-selected={value instanceof File}>
				<div class="file-icon">
					<IconComponent class="w-8 h-8 text-blue-600" />
					{#if value instanceof File}
						<div class="file-badge">NEW</div>
					{/if}
				</div>
				<div class="file-details">
					<p class="file-name">
						{value instanceof File ? value.name : value}
						{#if value instanceof File}
							<span class="file-status">• Pending upload</span>
						{/if}
					</p>
					{#if value instanceof File}
						<p class="file-size">{formatFileSize(value.size)}</p>
					{/if}
				</div>
				<button
					type="button"
					onclick={(e) => { e.stopPropagation(); handleRemove(); }}
					class="remove-button-small"
					disabled={disabled}
				>
					<X class="w-4 h-4" />
				</button>
			</div>
		{:else}
			<div class="upload-empty">
				<div class="upload-icon">
					<IconComponent class="w-12 h-12 text-gray-400" />
				</div>
				<div class="upload-text">
					<p class="upload-title">
						{uploadConfig.dragDrop !== false ? 'Drop file here or click to upload' : 'Click to upload'}
					</p>
					<p class="upload-description">
						{#if uploadConfig.acceptedFileTypes && uploadConfig.maxFileSize}
							{uploadConfig.acceptedFileTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}
							up to {formatFileSize(uploadConfig.maxFileSize)}
						{:else}
							{preset.description}
						{/if}
					</p>
				</div>
			</div>
		{/if}

		{#if isDragging}
			<div class="drag-overlay">
				<Upload class="w-16 h-16 text-blue-600" />
				<p class="text-lg font-medium text-blue-600">Drop to upload</p>
			</div>
		{/if}
	</div>

	{#if displayError}
		<div class="error-message">
			<AlertCircle class="w-4 h-4" />
			<span>{errorMessage}</span>
		</div>
	{/if}
</div>

<style>
    .universal-upload {
        width: 100%;
    }

    .upload-container {
        position: relative;
        min-height: 12rem;
        border: 2px dashed rgb(209 213 219);
        border-radius: 0.5rem;
        background: rgb(249 250 251);
        transition: all 0.2s;
        cursor: pointer;
    }

    .upload-container:hover:not(.is-disabled) {
        border-color: rgb(59 130 246);
        background: rgb(239 246 255);
    }

    .upload-container.is-dragging {
        border-color: rgb(59 130 246);
        background: rgb(239 246 255);
    }

    .upload-container.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .upload-container.has-error {
        border-color: rgb(239 68 68);
        background: rgb(254 242 242);
    }

    .upload-container.has-value {
        border-style: solid;
        border-color: rgb(34 197 94);
        background: white;
    }

    /* Loading state */
    .upload-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 12rem;
        gap: 0.75rem;
        padding: 2rem;
    }

    .spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid rgb(229 231 235);
        border-top-color: rgb(59 130 246);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Image preview */
    .image-preview-container {
        position: relative;
        width: 100%;
        min-height: 12rem;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    }

    .image-preview {
        max-width: 100%;
        max-height: 20rem;
        object-fit: contain;
        border-radius: 0.375rem;
    }

    .preview-overlay {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
    }

    .remove-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: rgba(239, 68, 68, 0.9);
        color: white;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .remove-button:hover:not(:disabled) {
        background: rgb(220, 38, 38);
        transform: scale(1.05);
    }

    .remove-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* File info */
    .file-info {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1.5rem;
        min-height: 12rem;
    }

    .file-info.file-selected {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%);
        border: 1px solid rgba(59, 130, 246, 0.2);
        border-radius: 0.375rem;
    }

    .file-icon {
        position: relative;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
        height: 3rem;
        background: rgb(239 246 255);
        border-radius: 0.5rem;
    }

    .file-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
        color: white;
        font-size: 0.625rem;
        font-weight: 600;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        line-height: 1;
    }

    .file-details {
        flex: 1;
        min-width: 0;
    }

    .file-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: rgb(17 24 39);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .file-status {
        color: rgb(59, 130, 246);
        font-weight: 500;
        font-size: 0.75rem;
        margin-left: 0.5rem;
    }

    .file-size {
        font-size: 0.75rem;
        color: rgb(107 114 128);
        margin-top: 0.25rem;
    }

    .remove-button-small {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: rgb(254 242 242);
        color: rgb(239 68 68);
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .remove-button-small:hover:not(:disabled) {
        background: rgb(239 68 68);
        color: white;
        transform: scale(1.05);
    }

    .remove-button-small:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Empty state */
    .upload-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 12rem;
        padding: 2rem;
        gap: 1rem;
    }

    .upload-icon {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .upload-text {
        text-align: center;
    }

    .upload-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: rgb(55 65 81);
        margin-bottom: 0.25rem;
    }

    .upload-description {
        font-size: 0.75rem;
        color: rgb(107 114 128);
    }

    /* Drag overlay */
    .drag-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        background: rgba(239, 246, 255, 0.95);
        border-radius: 0.375rem;
        backdrop-filter: blur(4px);
    }

    /* Error message */
    .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: rgb(254 242 242);
        color: rgb(185 28 28);
        font-size: 0.875rem;
        border-radius: 0.375rem;
        border: 1px solid rgb(254 205 211);
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
        .upload-container,
        .spinner,
        .remove-button,
        .remove-button-small {
            animation: none !important;
            transition: none !important;
        }
    }

    /* Focus styles for accessibility */
    .upload-container:focus-visible {
        outline: 2px solid rgb(59 130 246);
        outline-offset: 2px;
    }

    .remove-button:focus-visible,
    .remove-button-small:focus-visible {
        outline: 2px solid rgb(59 130 246);
        outline-offset: 2px;
    }
</style>