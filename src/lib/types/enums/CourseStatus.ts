/**
 * Enum representing possible course publication states.
 */
export enum CourseStatus {
	PUBLISHED = 'PUBLISHED',
	DRAFT = 'DRAFT',
	UNPUBLISHED = 'UNPUBLISHED'
}

/**
 * Maps each CourseStatus to Tailwind gradient colors.
 */
export const CourseStatusColors: Record<CourseStatus, { from: string; to: string }> = {
	[CourseStatus.PUBLISHED]: { from: 'emerald-500', to: 'emerald-600' },
	[CourseStatus.DRAFT]: { from: 'amber-500', to: 'amber-600' },
	[CourseStatus.UNPUBLISHED]: { from: 'slate-500', to: 'slate-600' }
};

/**
 * Helper to get a color gradient for any given status.
 */
export function getCourseStatusColor(status?: CourseStatus) {
	return CourseStatusColors[status ?? CourseStatus.UNPUBLISHED];
}

