/**
 * Configuration for file field mappings
 */
export interface FileFieldMapping {
	/** Field name in the data object (e.g., 'imageUrl') */
	dataField: string;
	/** Parameter name for FormData/backend (e.g., 'image') */
	formDataKey: string;
	/** Optional: Type of file expected */
	type?: 'image' | 'video' | 'document' | 'any';
}

/**
 * Options for building FormData
 */
export interface BuildFormDataOptions {
	/** Name of the JSON part in FormData (e.g., 'lesson', 'course', 'user') */
	jsonPartName: string;
	/** File field mappings */
	fileFieldMappings: FileFieldMapping[];
	/** Fields to exclude from JSON payload */
	excludeFromJson?: string[];
	/** Enable debug logging */
	debug?: boolean;
	/** Custom log prefix */
	logPrefix?: string;
}

/**
 * Result of file extraction
 */
export interface ExtractedFiles {
	/** Map of formDataKey → File */
	files: Map<string, File>;
	/** Original data with File objects removed */
	cleanData: Record<string, any>;
	/** File fields that contained string URLs (not replaced) */
	preservedUrls: Record<string, string>;
}

/**
 * Generic FormData utilities for API file uploads
 * Handles extraction of File objects and building multipart/form-data requests
 */
export class FormDataUtils {
	/**
	 * Extract File objects from data based on field mappings
	 */
	static extractFiles<T extends Record<string, any>>(
		data: T,
		fileFieldMappings: FileFieldMapping[],
		options: { debug?: boolean; logPrefix?: string } = {}
	): ExtractedFiles {
		const { debug = false, logPrefix = 'FormDataUtils' } = options;

		const files = new Map<string, File>();
		const cleanData: Record<string, any> = {};
		const preservedUrls: Record<string, string> = {};

		// Create lookup map for file fields
		const fileFields = new Set(fileFieldMappings.map((m) => m.dataField));
		const mappingMap = new Map(fileFieldMappings.map((m) => [m.dataField, m.formDataKey]));

		Object.entries(data).forEach(([key, value]) => {
			if (value instanceof File) {
				// This is a file - extract it
				const formDataKey = mappingMap.get(key) || key;
				files.set(formDataKey, value);

				if (debug) {
					console.log(`📎 [${logPrefix}] Found file in '${key}' → '${formDataKey}':`, {
						name: value.name,
						size: value.size,
						type: value.type
					});
				}
			} else if (fileFields.has(key)) {
				// This is a file field but contains a string URL or null
				if (typeof value === 'string' && value) {
					preservedUrls[key] = value;
					cleanData[key] = value;

					if (debug) {
						console.log(`🔗 [${logPrefix}] Preserving URL in '${key}':`, value);
					}
				}
				// If null/undefined, don't include it
			} else {
				// Regular field - include in clean data
				cleanData[key] = value;
			}
		});

		if (debug) {
			console.log(`✅ [${logPrefix}] Extraction complete:`, {
				filesFound: files.size,
				preservedUrls: Object.keys(preservedUrls).length,
				cleanDataFields: Object.keys(cleanData).length
			});
		}

		return { files, cleanData, preservedUrls };
	}

	/**
	 * Build FormData for multipart/form-data request
	 */
	static buildFormData<T extends Record<string, any>>(
		data: T,
		options: BuildFormDataOptions
	): FormData {
		const {
			jsonPartName,
			fileFieldMappings,
			excludeFromJson = [],
			debug = false,
			logPrefix = 'FormDataUtils'
		} = options;

		if (debug) {
			console.log(`🔨 [${logPrefix}] Building FormData:`, {
				jsonPartName,
				fileFieldMappings: fileFieldMappings.length,
				excludeFromJson
			});
		}

		const formData = new FormData();

		// Extract files from data
		const { files, cleanData, preservedUrls } = this.extractFiles(data, fileFieldMappings, {
			debug,
			logPrefix
		});

		// Add files to FormData
		files.forEach((file, formDataKey) => {
			formData.append(formDataKey, file);

			if (debug) {
				console.log(`📤 [${logPrefix}] Added file '${formDataKey}':`, {
					name: file.name,
					size: file.size,
					type: file.type
				});
			}
		});

		// Remove excluded fields from clean data
		const jsonData = { ...cleanData };
		excludeFromJson.forEach((field) => {
			delete jsonData[field];
		});

		// Create JSON blob for Spring Boot @RequestPart
		const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
		formData.append(jsonPartName, jsonBlob);

		if (debug) {
			console.log(`📋 [${logPrefix}] JSON payload (${jsonPartName}):`, jsonData);
			console.log(`✅ [${logPrefix}] FormData built successfully`);
		}

		return formData;
	}

	/**
	 * Check if data contains any File objects
	 */
	static hasFiles(data: Record<string, any>): boolean {
		return Object.values(data).some((value) => value instanceof File);
	}

	/**
	 * Count number of File objects in data
	 */
	static countFiles(data: Record<string, any>): number {
		return Object.values(data).filter((value) => value instanceof File).length;
	}

	/**
	 * Get file sizes for all File objects in data
	 */
	static getFileSizes(data: Record<string, any>): Map<string, number> {
		const sizes = new Map<string, number>();

		Object.entries(data).forEach(([key, value]) => {
			if (value instanceof File) {
				sizes.set(key, value.size);
			}
		});

		return sizes;
	}

	/**
	 * Calculate total size of all File objects in data
	 */
	static getTotalFileSize(data: Record<string, any>): number {
		return Object.values(data)
			.filter((value): value is File => value instanceof File)
			.reduce((total, file) => total + file.size, 0);
	}

	/**
	 * Format file size to human-readable string
	 */
	static formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';

		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
	}

	/**
	 * Debug helper: Log FormData contents
	 */
	static async logFormData(
		formData: FormData,
		label = 'FormData',
		logPrefix = 'FormDataUtils'
	): Promise<void> {
		console.log(`📋 [${logPrefix}] ${label} contents:`);

		for (const [key, value] of formData.entries()) {
			if (value instanceof File) {
				console.log(
					`  ${key}: File(${value.name}, ${this.formatFileSize(value.size)}, ${value.type})`
				);
			} else if (value instanceof Blob) {
				const text = await value.text();
				try {
					const parsed = JSON.parse(text);
					console.log(`  ${key}: JSON(`, parsed, ')');
				} catch {
					console.log(`  ${key}: Blob(${this.formatFileSize(value.size)})`);
				}
			} else {
				console.log(`  ${key}:`, value);
			}
		}
	}

	/**
	 * Validate file types against accepted types
	 */
	static validateFileTypes(
		data: Record<string, any>,
		fileFieldMappings: FileFieldMapping[]
	): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		fileFieldMappings.forEach((mapping) => {
			const value = data[mapping.dataField];

			if (value instanceof File && mapping.type) {
				const acceptedTypes = this.getAcceptedTypesForCategory(mapping.type);

				if (!acceptedTypes.includes(value.type)) {
					errors.push(
						`File '${mapping.dataField}' has invalid type: ${value.type}. ` +
							`Expected: ${mapping.type}`
					);
				}
			}
		});

		return {
			valid: errors.length === 0,
			errors
		};
	}

	/**
	 * Get accepted MIME types for file category
	 */
	private static getAcceptedTypesForCategory(category: string): string[] {
		const typeMap: Record<string, string[]> = {
			image: [
				'image/jpeg',
				'image/png',
				'image/webp',
				'image/gif',
				'image/svg+xml'
			],
			video: [
				'video/mp4',
				'video/webm',
				'video/quicktime',
				'video/x-msvideo',
				'video/avi'
			],
			document: [
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'application/vnd.ms-excel',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'text/plain'
			],
			any: ['*/*']
		};

		return typeMap[category] || ['*/*'];
	}
}
