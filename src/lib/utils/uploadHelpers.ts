import type { UploadConfig, UploadFieldType } from '$lib/types/entities/forms';

export interface UploadPreset {
	label: string;
	accepts: string[];
	maxSize: number;
	icon: string;
	description: string;
}

export const UPLOAD_PRESETS: Record<UploadFieldType, UploadPreset> = {
	image: {
		label: 'Image',
		accepts: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
		maxSize: 5 * 1024 * 1024, // 5MB
		icon: 'Image',
		description: 'JPEG, PNG, WebP, GIF, or SVG up to 5MB'
	},
	video: {
		label: 'Video',
		accepts: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
		maxSize: 500 * 1024 * 1024, // 100MB
		icon: 'Video',
		description: 'MP4, WebM, or MOV up to 100MB'
	},
	document: {
		label: 'Document',
		accepts: [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			'application/vnd.ms-excel',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'text/plain'
		],
		maxSize: 10 * 1024 * 1024, // 10MB
		icon: 'FileText',
		description: 'PDF, Word, Excel, or Text up to 10MB'
	},
	any: {
		label: 'File',
		accepts: ['*/*'],
		maxSize: 50 * 1024 * 1024, // 50MB
		icon: 'Upload',
		description: 'Any file up to 50MB'
	}
};

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
	return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

export function validateFile(file: File, config: UploadConfig): { valid: boolean; error?: string } {
	const preset = UPLOAD_PRESETS[config.type];

	// ✅ Use config values if provided, otherwise fall back to preset
	const maxSize = config.maxFileSize || preset.maxSize;
	const accepts = config.acceptedFileTypes || preset.accepts;

	console.log('🔍 [validateFile] Validating:', {
		fileName: file.name,
		fileType: file.type,
		fileSize: file.size,
		maxSize,
		accepts,
		configProvided: {
			maxFileSize: config.maxFileSize,
			acceptedFileTypes: config.acceptedFileTypes
		}
	});

	// Check file size
	if (file.size > maxSize) {
		return {
			valid: false,
			error: `File size exceeds ${formatFileSize(maxSize)} limit`
		};
	}

	// Check file type
	if (!accepts.includes('*/*')) {
		const isAccepted = accepts.includes(file.type);

		if (!isAccepted) {
			// Sometimes browsers report different MIME types, check by extension too
			const extension = getFileExtension(file.name).toLowerCase();
			const extensionMatch = accepts.some((accept) => {
				const acceptExt = accept.split('/')[1]?.toLowerCase();
				return (
					acceptExt === extension ||
					acceptExt === `x-${extension}` ||
					accept === `video/${extension}` ||
					accept === `video/x-${extension}`
				);
			});

			if (!extensionMatch) {
				console.error('🔴 [validateFile] Type mismatch:', {
					fileType: file.type,
					extension,
					accepts,
					isAccepted
				});

				// Build a user-friendly error message
				const acceptedTypes = accepts
					.map((t) => t.split('/')[1]?.toUpperCase())
					.filter(Boolean)
					.join(', ');

				return {
					valid: false,
					error: `Invalid file type: ${file.type || `.${extension}`}. Accepted: ${acceptedTypes}`
				};
			}
		}
	}

	console.log('✅ [validateFile] Validation passed');
	return { valid: true };
}

export function createFilePreview(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		if (!file.type.startsWith('image/')) {
			reject(new Error('File is not an image'));
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target?.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
