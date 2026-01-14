import type { CourseStatus } from '$lib/types/enums/CourseStatus';

/**
 * Status color configuration
 */
export interface StatusColorConfig {
	from: string;
	to: string;
	badge: string;
	text: string;
	border: string;
}

/**
 * Course status colors for gradients, badges, etc.
 */
export const COURSE_STATUS_COLORS: Record<CourseStatus, StatusColorConfig> = {
	DRAFT: {
		from: 'slate-500',
		to: 'slate-600',
		badge: 'bg-slate-100 text-slate-800',
		text: 'text-slate-700',
		border: 'border-slate-300'
	},
	PUBLISHED: {
		from: 'emerald-500',
		to: 'emerald-600',
		badge: 'bg-emerald-100 text-emerald-800',
		text: 'text-emerald-700',
		border: 'border-emerald-300'
	},
	UNPUBLISHED: {
		from: 'amber-500',
		to: 'amber-600',
		badge: 'bg-amber-100 text-amber-800',
		text: 'text-amber-700',
		border: 'border-amber-300'
	}
};

/**
 * Get status color configuration
 */
export function getCourseStatusColors(status: CourseStatus | string): StatusColorConfig {
	return COURSE_STATUS_COLORS[status as CourseStatus] || COURSE_STATUS_COLORS.DRAFT;
}

/**
 * Status labels for display
 */
export const COURSE_STATUS_LABELS: Record<CourseStatus, string> = {
	DRAFT: 'Draft',
	PUBLISHED: 'Published',
	UNPUBLISHED: 'Archived',

};

/**
 * Status descriptions
 */
export const COURSE_STATUS_DESCRIPTIONS: Record<CourseStatus, string> = {
	DRAFT: 'Not yet published',
	PUBLISHED: 'Visible to students',
	UNPUBLISHED: 'No longer active',
};

/**
 * Get status description
 */
export function getCourseStatusDescription(status: CourseStatus | string): string {
	return COURSE_STATUS_DESCRIPTIONS[status as CourseStatus] || '';
}

/**
 * Get status label
 */
export function getCourseStatusLabel(status: CourseStatus | string): string {
	return COURSE_STATUS_LABELS[status as CourseStatus] || status;
}

/**
 * Icon configurations (SVG strings)
 */
export const ICONS = {
	book: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
  </svg>`,

	users: `<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>`,

	lesson: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
  </svg>`,

	section: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
  </svg>`,

	user: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>`,

	email: `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>`,

	chart: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
  </svg>`
} as const;

/**
 * Common gradient configurations
 */
export const GRADIENTS = {
	blue: { from: 'blue-500', to: 'blue-600' },
	indigo: { from: 'indigo-500', to: 'indigo-600' },
	purple: { from: 'purple-500', to: 'purple-600' },
	pink: { from: 'pink-500', to: 'pink-600' },
	red: { from: 'red-500', to: 'red-600' },
	orange: { from: 'orange-500', to: 'orange-600' },
	amber: { from: 'amber-500', to: 'amber-600' },
	yellow: { from: 'yellow-500', to: 'yellow-600' },
	lime: { from: 'lime-500', to: 'lime-600' },
	green: { from: 'green-500', to: 'green-600' },
	emerald: { from: 'emerald-500', to: 'emerald-600' },
	teal: { from: 'teal-500', to: 'teal-600' },
	cyan: { from: 'cyan-500', to: 'cyan-600' },
	slate: { from: 'slate-500', to: 'slate-600' },
	gray: { from: 'gray-500', to: 'gray-600' }
} as const;