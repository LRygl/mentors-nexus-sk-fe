<!-- lib/components/CourseCard.svelte -->
<script lang="ts">
	import type { Course } from '$lib/types/course';
	import type { ViewMode } from '$lib/types/course-filters';
	import {
		formatPrice,
		getDiscountPercentage,
		getCourseImageUrl,
		getInstructorFullName,
		isBestseller,
		getDifficultyFromLabels,
		getRatingFromLabels,
		formatStudentCount
	} from '$lib/utils/course-utils';

	interface Props {
		course: Course;
		viewMode: ViewMode;
		index: number;
	}

	let { course, viewMode, index }: Props = $props();

	// Computed values
	let instructorName = $derived(getInstructorFullName(course));
	let imageUrl = $derived(getCourseImageUrl(course));
	let isCourseBestseller = $derived(isBestseller(course));
	let difficulty = $derived(getDifficultyFromLabels(course.labels));
	let rating = $derived(getRatingFromLabels(course.labels));
	let originalPrice = $derived(course.price * 1.5); // Mock original price
	let discountPercentage = $derived(getDiscountPercentage(course.price, originalPrice));
	let studentCount = $derived(formatStudentCount(course.students));
	let courseDuration = $derived('40 hours'); // Mock duration
	let lessonCount = $derived(course.lessons.length);
</script>

<article
	class="course-card group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2"
	class:list-view={viewMode === 'list'}
	style="animation-delay: {index * 100}ms"
>
	{#if viewMode === 'grid'}
		<!-- Grid View -->
		<div class="relative">
			<img src={imageUrl} alt={course.name} class="w-full h-48 object-cover" />
			{#if isCourseBestseller}
				<div class="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
					BESTSELLER
				</div>
			{/if}
			{#if course.price === 0}
				<div class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
					FREE
				</div>
			{:else if discountPercentage > 0}
				<div class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
					{discountPercentage}% OFF
				</div>
			{/if}
		</div>
		<div class="p-6">
			<div class="flex items-center gap-2 mb-3">
        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg">
          {course.categories[0] || 'General'}
        </span>
				<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg">
          {difficulty}
        </span>
			</div>
			<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
				{course.name}
			</h3>
			<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">By {instructorName}</p>

			<div class="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
				<div class="flex items-center gap-1">
					<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
					</svg>
					<span>{rating}</span>
				</div>
				<span>•</span>
				<span>{studentCount} students</span>
				<span>•</span>
				<span>{courseDuration}</span>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
          <span class="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(course.price)}
          </span>
					{#if originalPrice > course.price && course.price > 0}
            <span class="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
					{/if}
				</div>
				<button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
					{course.price === 0 ? 'Enroll Free' : 'Buy Now'}
				</button>
			</div>
		</div>
	{:else}
		<!-- List View -->
		<div class="flex flex-col md:flex-row">
			<div class="relative md:w-80 h-48 md:h-auto">
				<img src={imageUrl} alt={course.name} class="w-full h-full object-cover" />
				{#if isCourseBestseller}
					<div class="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
						BESTSELLER
					</div>
				{/if}
			</div>
			<div class="flex-1 p-6 flex flex-col justify-between">
				<div>
					<div class="flex items-center gap-2 mb-3">
            <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg">
              {course.categories[0] || 'General'}
            </span>
						<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg">
              {difficulty}
            </span>
					</div>
					<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
						{course.name}
					</h3>
					<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">By {instructorName}</p>

					<div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
						<div class="flex items-center gap-1">
							<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
							</svg>
							<span>{rating}</span>
						</div>
						<span>•</span>
						<span>{studentCount} students</span>
						<span>•</span>
						<span>{courseDuration}</span>
						<span>•</span>
						<span>{lessonCount} lessons</span>
					</div>
				</div>

				<div class="flex items-center justify-between mt-4">
					<div class="flex items-center gap-2">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPrice(course.price)}
            </span>
						{#if originalPrice > course.price && course.price > 0}
              <span class="text-lg text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
						{/if}
						{#if discountPercentage > 0}
              <span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg">
                {discountPercentage}% OFF
              </span>
						{/if}
					</div>
					<div class="flex items-center gap-3">
						<button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
							Preview
						</button>
						<button class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
							{course.price === 0 ? 'Enroll Free' : 'Buy Now'}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}
</article>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>