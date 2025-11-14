import  {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { Lesson } from '$lib/types/entities/Lesson';
import { createFAQLinkFields } from '$lib/components/Forms/Schemas/FAQLinkFormSchema';


export function createLessonLinkFields(lessons: Lesson[] = []): EntityFieldConfig[] {

	const lessonOptions = lessons.map((lesson) => ({
		label: lesson.title,
		value: lesson.id,
		subtitle: lesson.description
	}));

	return [
		{
			name: 'lessonId',
			label: 'Select Lesson',
			type: 'select',
			variants: { link: true },
			options: [
				{ label: 'Choose Lesson...', value: '', disabled: true },
				...lessonOptions
			],
			required: true,
			searchable: true,
			helpText: `${lessons.length} unassigned Lessons ${lessons.length === 1 ? '' : 's'} `,
			colSpan: 1
		}
	];
}

const lessonLinkGroups: EntityGroupConfig[] = [

];

export function createLessonLinkSchemaFactory(lessons: Lesson[] = []) {
	return defineEntitySchema({
		entity: 'Lesson Link',
		fields: createLessonLinkFields(lessons),
		groups: lessonLinkGroups,
		variantConfig: {
			link: {
				title: 'Link Lesson to Course Section',
				description: 'Associate a Lesson to Course Section',
				submitLabel: 'Link Lesson',
				showReset: false,
				showCancel: true
			}
		}
	});
}

export const CourseLinkFormPresets = {
	link: (lessons: Lesson[] = []) => {
		return createLessonLinkSchemaFactory(lessons).create('link');
	}
}

