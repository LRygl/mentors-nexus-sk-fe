import { API_CONFIG } from '$lib/API/APIConfiguration';

export interface ImageValidationOptions {
	maxSizeMB?: number;
	allowedTypes?: string[];
}

export interface ImageValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Prepare entity data for API submission
 * Removes imageUrl if it's not a File (backend will keep existing image)
 * Extracts File object for separate multipart parameter
 */
export interface PreparedFormData<T> {
	data: T;
	imageFile?: File;
}



export function getEntityImageUrl(
	entityType: 'course' | 'lesson' | 'user',
	imageUrl: string | null | undefined,
): string {
	if (!imageUrl) {
		return `/placeholder-${entityType}.png`;
	}

	return `${API_CONFIG.FULL_BASE_URL}/files/${entityType}${imageUrl}`;
}

export function prepareEntityDataForSubmit<T extends Record<string, any>>(
	formData: T
): PreparedFormData<T> {
	const imageData = formData.imageUrl;
	const imageFile = extractImageFile(imageData);

	// Create clean data object without imageUrl
	const { imageUrl, ...cleanData } = formData;

	return {
		data: cleanData as T,
		imageFile
	};
}

export async function validateImageFile(
	file: File,
	options: ImageValidationOptions = {}
): Promise<ImageValidationResult> {
	const {
		maxSizeMB = 5,
		allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
	} = options;

	// Check file type
	if (!allowedTypes.includes(file.type)) {
		return {
			valid: false,
			error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
		};
	}

	// Check file size
	const sizeMB = file.size / (1024 * 1024);
	if (sizeMB > maxSizeMB) {
		return {
			valid: false,
			error: `File too large. Maximum size: ${maxSizeMB}MB (current: ${sizeMB.toFixed(2)}MB)`
		};
	}

	return {
		valid: true,
	};

}


/**
 * Extract image file from form data
 * Handles various scenarios:
 * - File object (new upload)
 * - Data URL string (convert to File)
 * - Blob URL (needs File from component state)
 * - Existing URL string (no upload needed)
 */
export function extractImageFile(imageData: any): File | undefined {
	// Case 1: Already a File object (ideal scenario)
	if (imageData instanceof File) {
		console.log('[IMAGE] File object detected:', imageData.name);
		return imageData;
	}

	// Case 2: Blob object
	if (imageData instanceof Blob) {
		console.log('[IMAGE] Blob detected, converting to File');
		return new File([imageData], 'upload.jpg', { type: imageData.type });
	}

	// Case 3: Data URL (base64)
	if (typeof imageData === 'string' && imageData.startsWith('data:')) {
		console.log('[IMAGE] Data URL detected, converting to File');
		return dataURLtoFile(imageData, 'upload.jpg');
	}

	// Case 4: Blob URL or existing URL - no file to upload
	if (typeof imageData === 'string') {
		if (imageData.startsWith('blob:')) {
			console.warn('[IMAGE] Blob URL detected - component should provide File object');
		} else {
			console.log('[IMAGE] Existing URL - no upload needed');
		}
		return undefined;
	}

	console.log('[IMAGE] No valid image data');
	return undefined;
}

/**
 * Convert data URL to File object
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
	const arr = dataURL.split(',');
	const mimeMatch = arr[0].match(/:(.*?);/);
	const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new File([u8arr], filename, { type: mime });
}
