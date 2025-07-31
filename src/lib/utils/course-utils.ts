// lib/utils/course-utils.ts
import type { Course } from '$lib/types/course';

export function formatPrice(price: number): string {
	return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
}

export function getDiscountPercentage(price: number, originalPrice: number): number {
	if (price === 0 || originalPrice === 0) return 0;
	return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatDuration(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours === 0) {
		return `${remainingMinutes}m`;
	} else if (remainingMinutes === 0) {
		return `${hours}h`;
	} else {
		return `${hours}h ${remainingMinutes}m`;
	}
}

export function getCourseImageUrl(course: Course): string {
	// Return a placeholder image based on category or course ID
	const categories = course.categories[0] || 'general';
	const categoryImages: Record<string, string> = {
		'Web Development': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
		'Data Science': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
		'Design': 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=225&fit=crop',
		'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
		'Mobile Development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
		'Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop'
	};

	return categoryImages[categories] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop';
}

export function getInstructorFullName(course: Course): string {
	return `${course.owner.firstName} ${course.owner.lastName}`;
}

export function isBestseller(course: Course): boolean {
	// Logic to determine if course is a bestseller
	// This could be based on student count, ratings, etc.
	return course.students > 10000;
}

export function getDifficultyFromLabels(labels: string[]): 'Beginner' | 'Intermediate' | 'Advanced' {
	const difficultyLabels = labels.find(label =>
		['Beginner', 'Intermediate', 'Advanced'].includes(label)
	);
	return (difficultyLabels as 'Beginner' | 'Intermediate' | 'Advanced') || 'Beginner';
}

export function getRatingFromLabels(labels: string[]): number {
	// Extract rating from labels or return a default
	const ratingLabel = labels.find(label => label.startsWith('rating:'));
	if (ratingLabel) {
		const rating = parseFloat(ratingLabel.split(':')[1]);
		return isNaN(rating) ? 4.5 : rating;
	}
	return 4.5;
}

export function formatStudentCount(count: number): string {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M`;
	} else if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}K`;
	}
	return count.toString();
}