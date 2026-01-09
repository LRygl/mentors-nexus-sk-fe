import { createTablePreset, defineTableConfig } from '$lib/components/Data Table/Configurations/DataTableConfigurationFactory';
import type { Course } from '$lib/types/entities/Course';
import { Eye, Star, StarOff } from '@lucide/svelte';
import { ActionType } from '$lib/types';
import { messages } from '$lib/i18n/messages';

const courseTableDefinition = defineTableConfig<Course>({
	entity: messages.course.entity,
	entityPlural: messages.course.entityPlural,

	idField: 'id',
	titleField: 'name',
	columns: [
		{
			key: 'id',
			header: 'ID',
			type: 'text',
			searchable: false,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'name',
			header: 'Name',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'owner',
			header: 'Owner',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
			accessor: (course: Course) => {
				const name = course.owner?.firstName + ' ' + course.owner?.lastName;
				if (!name) return 'No Owner';
				return `${name}`;
			}
		},
		{
			key: 'lessons',
			header: 'Lessons',
			type: 'badge',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
			accessor: (course: Course) => {
				const lessonCount = course.sections?.reduce((total, section) => {
					return total + (section.lessons?.length || 0);
				}, 0) || 0;  // ← Don't forget the initial value 0

				return `${lessonCount}`;
			}
		},
		{
			key: 'students',
			header: 'Students',
			type: 'badge',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'featured',
			header: 'Featured',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'status',
			header: 'Status',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
		{
			key: 'price',
			header: 'Price',
			type: 'text',
			searchable: true,
			sortable: true,
			cellClassName: 'font-mono text-xs text-slate-500',
		},
	],
	actions: [
		{
			id: 'view',
			label: 'View Details',
			description: 'See full course details',
			icon: Eye,
			variant: ActionType.DEFAULT,
			group: 'Actions'
		},
		{
			id: 'publish',
			label: 'Set as Published',
			description: 'Publish now',
			icon: Star,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => !course.published
		},
		{
			id: 'unpublish',
			label: 'Remove Published',
			description: 'Remove course as featured',
			icon: StarOff,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => course.published
		},
		{
			id: 'feature',
			label: 'Set as Featured',
			description: 'Set course as featured',
			icon: Star,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => !course.featured
		},
		{
			id: 'unfeature',
			label: 'Remove Featured',
			description: 'Remove course as featured',
			icon: StarOff,
			variant: ActionType.WARNING,
			group: 'State',
			condition: (course: Course) => course.featured
		},
		{
			id: 'delete',
			label: messages.course.admin.actions.deleteLabel,
			description: messages.course.admin.actions.deleteDescription,
			icon: Eye,
			variant: ActionType.DANGER,
			group: 'Management'
		},
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
	searchPlaceholder: messages.course.data.searchPlaceholder,
})

export const CourseTablePreset = createTablePreset(courseTableDefinition);

export const CourseTableConfig = {
	CourseTableConfig: () => CourseTablePreset.config(),
	CourseTableColumns: () => CourseTablePreset.columns(),
	CourseTableActions: (course: Course) => CourseTablePreset.getActions(course),
	CourseTableProps: () => CourseTablePreset.props(),

	all: () => CourseTablePreset.all(),

	// Create Embedded variant
	embedded: () => {
		const base = CourseTablePreset.all();
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