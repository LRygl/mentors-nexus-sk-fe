import  { defineEntitySchema, type EntityFieldConfig, type EntityGroupConfig } from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { Course } from '$lib/types/entities/Course';

export function enrollUserToCourseFields(course: Course[] = []): EntityFieldConfig[] {
	const courseOptions = course.map((course: Course) => ({
		label: course.name,
		value: course.id.toString(),
		subtitle: course.description
	}));

	return [
		{
			name: 'courseId',
			label: 'Select Course',
			type: 'select',
			variants: { link: true },
			options: [{ label: 'Choose Course...', value: '', disabled: true }, ...courseOptions],
			required: true,
			searchable: true,
			helpText: `${course.length} unassigned Lessons ${course.length === 1 ? '' : 's'} `,
			colSpan: 1
		}
	];
}

const courseEnrollmentGroups: EntityGroupConfig[] = [];

export function enrollUserToCourseFactory(courses: Course[] = []) {
	return defineEntitySchema({
		entity: 'Enroll to Course',
		fields: enrollUserToCourseFields(courses),
		groups: courseEnrollmentGroups,
		variantConfig: {
			link: {
				title: 'Enroll user to Course',
				description: 'Associate a Lesson to Course Section',
				submitLabel: 'Enroll User',
				showReset: false,
				showCancel: true
			}
		}
	});
}

export const EnrollUserToCoursePresets = {
	link: (courses: Course[] = []) => {
		return enrollUserToCourseFactory(courses).create('link');
	}
};
