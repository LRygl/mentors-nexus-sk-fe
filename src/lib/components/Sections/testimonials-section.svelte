<!-- TestimonialsSection.svelte -->
<script lang="ts">
	import { Star, Users, TrendingUp, Award, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import TestimonialCard from '$lib/components/Cards/testimonial-card.svelte';
	import type { Testimonial, TestimonialStats } from '$lib/types/testimonials';
	import { onMount } from 'svelte';
	import HeaderSection from '$lib/components/Sections/header-section.svelte';

	// Sample testimonials data
	const testimonials: Testimonial[] = [
		{
			id: '1',
			name: 'Sarah Chen',
			role: 'Frontend Developer',
			company: 'TechCorp',
			avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
			content: 'The course structure was excellent and the hands-on projects really helped me understand complex concepts. I landed my dream job within 3 months of completion!',
			rating: 5,
			course: 'Advanced React Development',
			featured: true
		},
		{
			id: '2',
			name: 'Michael Rodriguez',
			role: 'UX Designer',
			company: 'DesignStudio',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
			content: 'Amazing mentorship program! The personalized feedback and guidance helped me transition from graphic design to UX design seamlessly.',
			rating: 5,
			course: 'UX/UI Design Masterclass'
		},
		{
			id: '3',
			name: 'Emily Johnson',
			role: 'Data Analyst',
			company: 'DataTech Solutions',
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
			content: 'The practical approach and real-world projects made learning enjoyable. The instructors are industry experts who really care about student success.',
			rating: 4,
			course: 'Data Science Bootcamp',
			featured: true
		},
		{
			id: '4',
			name: 'David Kim',
			role: 'Full Stack Developer',
			company: 'StartupXYZ',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
			content: 'From zero to full-stack developer in 6 months. The curriculum is up-to-date with industry standards and the community support is incredible.',
			rating: 5,
			course: 'Full Stack Web Development'
		},
		{
			id: '5',
			name: 'Lisa Thompson',
			role: 'Product Manager',
			company: 'InnovateLab',
			avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
			content: 'The business-focused approach helped me understand both technical and strategic aspects. Perfect for transitioning into product management.',
			rating: 5,
			course: 'Product Management Essentials'
		},
		{
			id: '6',
			name: 'James Wilson',
			role: 'DevOps Engineer',
			company: 'CloudFirst',
			avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
			content: 'Comprehensive coverage of modern DevOps practices. The hands-on labs and real infrastructure scenarios were invaluable for my career growth.',
			rating: 4,
			course: 'DevOps & Cloud Architecture'
		}
	];

	// Statistics data
	const stats: TestimonialStats = {
		totalReviews: 2847,
		averageRating: 4.8,
		courseCompletionRate: 94,
		satisfactionRate: 97
	};

	// Carousel state
	let currentIndex = 0;
	let carouselContainer: HTMLElement;
	let autoSlideInterval: number;

	// Auto-slide functionality
	function startAutoSlide(): void {
		autoSlideInterval = setInterval(() => {
			currentIndex = (currentIndex + 1) % testimonials.length;
		}, 5000);
	}

	function stopAutoSlide(): void {
		if (autoSlideInterval) {
			clearInterval(autoSlideInterval);
		}
	}

	function goToSlide(index: number): void {
		currentIndex = index;
		stopAutoSlide();
		setTimeout(startAutoSlide, 3000); // Restart after 3 seconds
	}

	function nextSlide(): void {
		goToSlide((currentIndex + 1) % testimonials.length);
	}

	function prevSlide(): void {
		goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length);
	}

	// Get visible testimonials (3 at a time on desktop, 1 on mobile)
	function getVisibleTestimonials(): Testimonial[] {
		const result = [];
		for (let i = 0; i < 3; i++) {
			const index = (currentIndex + i) % testimonials.length;
			result.push(testimonials[index]);
		}
		return result;
	}

	$: visibleTestimonials = getVisibleTestimonials();

	onMount(() => {
		startAutoSlide();
		return () => stopAutoSlide();
	});
</script>

<section class="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden" aria-labelledby="testimonials-heading">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		<!-- Section Header -->
		<HeaderSection
			heading="Station Success Stories"
			subHeading="Join thousands of successful graduates who transformed their careers with our expert-led courses and personalized mentorship."
			showBadge={true}
			badgeText="Station Success Stories"
		/>

		<!-- Statistics -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
			<div class="text-center">
				<div class="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-4">
					<Users class="w-6 h-6 text-blue-600 dark:text-blue-400" />
				</div>
				<div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
					{stats.totalReviews.toLocaleString()}+
				</div>
				<div class="text-gray-600 dark:text-gray-400">Happy Customers</div>
			</div>

			<div class="text-center">
				<div class="flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mx-auto mb-4">
					<Star class="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-current" />
				</div>
				<div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
					{stats.averageRating}/5
				</div>
				<div class="text-gray-600 dark:text-gray-400">Average Rating</div>
			</div>

			<div class="text-center">
				<div class="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-4">
					<TrendingUp class="w-6 h-6 text-green-600 dark:text-green-400" />
				</div>
				<div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
					{stats.courseCompletionRate}%
				</div>
				<div class="text-gray-600 dark:text-gray-400">Completion Rate</div>
			</div>

			<div class="text-center">
				<div class="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-4">
					<Award class="w-6 h-6 text-purple-600 dark:text-purple-400" />
				</div>
				<div class="text-3xl font-bold text-gray-900 dark:text-white mb-1">
					{stats.satisfactionRate}%
				</div>
				<div class="text-gray-600 dark:text-gray-400">Satisfaction</div>
			</div>
		</div>

		<!-- Testimonials Carousel -->
		<div class="relative" bind:this={carouselContainer}>

			<!-- Navigation Buttons -->
			<button
				on:click={prevSlide}
				class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
				aria-label="Previous testimonials"
			>
				<ChevronLeft class="w-6 h-6" />
			</button>

			<button
				on:click={nextSlide}
				class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
				aria-label="Next testimonials"
			>
				<ChevronRight class="w-6 h-6" />
			</button>

			<!-- Testimonials Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
				{#each visibleTestimonials as testimonial (testimonial.id)}
					<div class="testimonial-card">
						<TestimonialCard {testimonial} featured={testimonial.featured} />
					</div>
				{/each}
			</div>
		</div>

		<!-- Carousel Indicators -->
		<div class="flex justify-center gap-2 mt-8">
			{#each testimonials as _, index}
				<button
					on:click={() => goToSlide(index)}
					class="w-3 h-3 rounded-full transition-all duration-300 {index === currentIndex ? 'bg-blue-600 dark:bg-blue-400' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'}"
					aria-label="Go to testimonial {index + 1}"
				></button>
			{/each}
		</div>

		<!-- Call to Action -->
		<div class="text-center mt-16">
			<div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
				<h3 class="text-2xl md:text-3xl font-bold mb-4">
					Ready to Start Your Success Story?
				</h3>
				<p class="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
					Join our community of successful learners and transform your career with expert guidance and hands-on experience.
				</p>
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<button class="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-300">
						Browse Courses
					</button>
					<button class="px-8 py-3 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors duration-300">
						Talk to a Mentor
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
    .testimonial-card {
        animation: fadeInUp 0.6s ease-out;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>