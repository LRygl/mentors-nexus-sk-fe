import { CourseStatus } from '$lib/types/course';

export interface StatusConfig {
	variant: 'secondary' | 'destructive' | 'default' | 'outline' | 'success' | 'warning' | 'info' | 'purple' | 'pink' | 'indigo' | 'orange' | 'teal' | 'cyan';
	label: string;
	description: string;
}

export const STATUS_CONFIG: Record<CourseStatus, StatusConfig> = {
	[CourseStatus.PUBLISHED]: {
		variant: "success",
		label: "PUBLISHED",
		description: "Live and available to students"
	},
	[CourseStatus.UNPUBLISHED]: {
		variant: "warning",
		label: "UNPUBLISHED",
		description: "Not yet published"
	},
	[CourseStatus.HIDDEN]: {
		variant: "warning",
		label: "HIDDEN",
		description: "Published but not visible in listings"
	},
	[CourseStatus.PRIVATE]: {
		variant: "destructive",
		label: "PRIVATE",
		description: "Restricted access only"
	}
} as const;

export function getStatusConfig(status: CourseStatus | string): StatusConfig {
	return STATUS_CONFIG[status as CourseStatus] || {
		variant: "default",
		color: "bg-gray-100 text-gray-800 border-gray-200",
		label: status as string,
		description: "Unknown status"
	};
}

export function getStatusBadgeVariant(status: CourseStatus | string): StatusConfig['variant'] {
	return getStatusConfig(status).variant;
}