import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { lessonPublicAPI, LessonPublicAPI } from '$lib/API/Public/LessonPublicAPI';

export const load: PageLoad = async ({ params }) => {
	const { courseId, lessonId } = params;

	try {
		// Fetch lesson data - adjust to your API structure
		const lesson = await lessonPublicAPI.getPublicLessonByID(lessonId);
console.log(lesson);
		// Optionally fetch course info for breadcrumbs/context
		// const course = await coursePublicAPI.getCourse(courseId);

		return {
			courseId,
			lessonId,
			lesson
			// course
		};
	} catch (err) {
		throw error(404, {
			message: 'Lesson not found'
		});
	}
};
