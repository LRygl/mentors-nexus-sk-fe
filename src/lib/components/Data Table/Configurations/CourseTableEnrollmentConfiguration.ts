import { createTablePreset, defineTableConfig } from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { Course } from '$lib/types/entities/Course';
import { Eye, Star, StarOff } from '@lucide/svelte';
import { ActionType } from '$lib/types';
import { messages } from '$lib/i18n/messages';
import type { CourseEnrollment } from '$lib/types/entities/CourseEnrollment';
import Trash2Icon from '@lucide/svelte/icons/trash-2';

const courseTableEnrollmentDefinition = defineTableConfig<CourseEnrollment>({
	entity: 'Enrollment',
	entityPlural: messages.course.entityPlural,

	idField: 'courseId',
	titleField: 'courseName',
	columns: [
		{
			key: 'courseId',
			header: 'ID',
			type: 'text',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
		{
			key: 'courseName',
			header: 'Name',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
		{
			key: 'progress',
			header: 'Progress',
			type: 'badge',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		},
		{
			key: 'enrolledAt',
			header: 'Enrolled At',
			type: 'datetime',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500'
		}
	],
	actions: [
		{
			id: 'view',
			label: 'View Course',
			description: 'See full course details',
			icon: Eye,
			variant: ActionType.DEFAULT,
			group: 'Actions'
		},
		{
			id: 'delete',
			label: messages.course.admin.actions.deleteLabel,
			description: messages.course.admin.actions.deleteDescription,
			icon: Trash2Icon,
			variant: ActionType.DANGER,
			group: 'Management'
		}
	],

	searchable: true,
	filterable: true,
	selectable: true,
	exportable: true,
	sortable: true,

	emptyTitle: messages.course.data.emptyTitle,
	emptyDescription: messages.course.data.emptyDescription,
	emptyActionLabel: messages.course.data.emptyActionLabel,
	loadingTitle: messages.course.data.loadingTitle,
	loadingDescription: messages.course.data.loadingDescription,
	searchPlaceholder: messages.course.data.searchPlaceholder
});

export const CourseTableEnrollmentPreset = createTablePreset(courseTableEnrollmentDefinition);

export const CourseTableConfig = {
	CourseTableConfig: () => CourseTableEnrollmentPreset.config(),
	CourseTableColumns: () => CourseTableEnrollmentPreset.columns(),
	CourseTableActions: (enrollment: CourseEnrollment) => CourseTableEnrollmentPreset.getActions(enrollment),
	CourseTableProps: () => CourseTableEnrollmentPreset.props(),

	all: () => CourseTableEnrollmentPreset.all(),

	// Create Embedded variant
	embedded: () => {
		const base = CourseTableEnrollmentPreset.all();
		return {
			...base,
			props: {
				...base.props,
				searchable: false,
				filterable: false,
				selectable: false,
				exportable: false
			}
		};
	}
};