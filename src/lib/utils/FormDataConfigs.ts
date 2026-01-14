import type { FileFieldMapping } from '$lib/utils/formSubmitHelpers';

/**
 * Common file field configurations for different entities
 */
export const FILE_FIELD_CONFIGS = {
	/**
	 * Standard configuration for lessons
	 */
	LESSON: [
		{ dataField: 'imageUrl', formDataKey: 'image', type: 'image' },
		{ dataField: 'videoUrl', formDataKey: 'video', type: 'video' },
		{ dataField: 'documentUrl', formDataKey: 'document', type: 'document' }
	] as FileFieldMapping[],

	/**
	 * Standard configuration for courses
	 */
	COURSE: [
		{ dataField: 'imageUrl', formDataKey: 'image', type: 'image' },
		{ dataField: 'thumbnailUrl', formDataKey: 'thumbnail', type: 'image' }
	] as FileFieldMapping[],

	/**
	 * Standard configuration for users
	 */
	USER: [
		{ dataField: 'avatarUrl', formDataKey: 'avatar', type: 'image' },
		{ dataField: 'coverImageUrl', formDataKey: 'coverImage', type: 'image' }
	] as FileFieldMapping[],

	/**
	 * Generic single image configuration
	 */
	SINGLE_IMAGE: [
		{ dataField: 'imageUrl', formDataKey: 'image', type: 'image' }
	] as FileFieldMapping[]
};

/**
 * Helper to create custom file field config
 */
export function createFileFieldConfig(
	mappings: Array<{
		dataField: string;
		formDataKey: string;
		type?: 'image' | 'video' | 'document' | 'any';
	}>
): FileFieldMapping[] {
	return mappings.map((m) => ({
		dataField: m.dataField,
		formDataKey: m.formDataKey,
		type: m.type || 'any'
	}));
}
