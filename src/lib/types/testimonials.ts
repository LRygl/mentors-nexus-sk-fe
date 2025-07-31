// src/lib/types/testimonials.ts

export interface Testimonial {
	id: string;
	name: string;
	role: string;
	company: string;
	avatar: string;
	content: string;
	rating: number;
	course?: string;
	featured?: boolean;
}

export interface TestimonialStats {
	totalReviews: number;
	averageRating: number;
	courseCompletionRate: number;
	satisfactionRate: number;
}

export type TestimonialEventHandler = (testimonial: Testimonial) => void;