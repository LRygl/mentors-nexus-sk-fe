

<script lang="ts">
	import { Clock, Users, Star, BookOpen, Award, ChevronDown, ChevronRight, Play, Lock, CheckCircle2, Globe, Calendar, TrendingUp, MessageSquare } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Course } from '$lib/types/entities/Course';
	import { formatDuration } from '$lib/utils/DateTimeFormatter';
	import { ROUTES } from '$lib/Config/routes.config';
	import { messages } from '$lib/i18n/messages';
	import { page } from '$app/state';
	import { courseStore } from '$lib/stores/defaults/CourseStore.svelte';

	// Props

	let courseId = $derived(page.params.id);
	let course = $derived(courseStore.fetchItem(courseId))
		// State
	let expandedSections = $state<Set<number>>(new Set());
	let activeTab = $state<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview');

	// Computed
	const totalLessons = $derived(() => {
		return course.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0;
	});

	const totalDuration = $derived(() => {
		return course.sections?.reduce((acc, section) =>
			acc + (section.lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0), 0
		) || 0;
	});

	const completedLessons = $derived(() => {
		// This would come from user progress - placeholder for now
		return 0;
	});

	// Handlers
	const toggleSection = (sectionId: number) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(sectionId)) {
			newExpanded.delete(sectionId);
		} else {
			newExpanded.add(sectionId);
		}
		expandedSections = newExpanded;
	};

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(price);
</script>

<div class="min-h-screen">
	<!-- Subtle Pattern Background -->
	<div class="fixed inset-0 opacity-[0.03]">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgb(0 0 0) 1px, transparent 0); background-size: 40px 40px;"></div>
	</div>

	<div class="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-8">
		<!-- Hero Section -->
		<div class="grid lg:grid-cols-3 gap-8 mb-8">
			<!-- Left: Course Info -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Course Header -->
				<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
					<!-- Badges -->
					<div class="flex flex-wrap gap-2 mb-4">
						<span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
							{course.level || 'Beginner'}
						</span>
						{#if course.featured}
							<span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold flex items-center gap-1">
								<Star class="w-3 h-3 fill-current" />
								Featured
							</span>
						{/if}
						<span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">
							{course.categories || 'Technology'}
						</span>
					</div>

					<!-- Title -->
					<h1 class="text-3xl lg:text-4xl font-black text-gray-900 mb-4">
						{course.name}
					</h1>

					<!-- Description -->
					<p class="text-gray-600 text-base mb-6 leading-relaxed">
						{course.description}
					</p>

					<!-- Meta Info -->
					<div class="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-200">
						<!-- Rating -->
						<div class="flex items-center gap-2">
							<div class="flex">
								{#each Array(5) as _, i}
									<Star class="w-4 h-4 {i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
								{/each}
							</div>
							<span class="text-sm font-semibold text-gray-900">{course.rating}</span>
							<span class="text-sm text-gray-500">(125 reviews)</span>
						</div>

						<!-- Students -->
						<div class="flex items-center gap-2 text-gray-600">
							<Users class="w-4 h-4" />
							<span class="text-sm font-medium">2,450 students</span>
						</div>

						<!-- Duration -->
						<div class="flex items-center gap-2 text-gray-600">
							<Clock class="w-4 h-4" />
							<span class="text-sm font-medium">{formatDuration(totalDuration(), 'short')}</span>
						</div>

						<!-- Lessons -->
						<div class="flex items-center gap-2 text-gray-600">
							<BookOpen class="w-4 h-4" />
							<span class="text-sm font-medium">{totalLessons()} lessons</span>
						</div>
					</div>

					<!-- Author -->
					<div class="flex items-center gap-4 mt-6">
						<div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
							{course.owner ? course.owner.firstName.charAt(0) + course.owner.lastName.charAt(0) : 'IN'}
						</div>
						<div>
							<p class="text-sm text-gray-600">Created by</p>
							<p class="text-base font-semibold text-gray-900">
								{course.owner ? `${course.owner.firstName} ${course.owner.lastName}` : 'Unknown Author'}
							</p>
						</div>
					</div>
				</div>

				<!-- Image -->
				<div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
					<img
						src={course.imageUrl}
						alt={course.name}
						class="w-full h-64 lg:h-96 object-cover"
					/>
				</div>
			</div>

			<!-- Right: Purchase Card (Sticky) -->
			<div class="lg:col-span-1">
				<div class="sticky top-8 space-y-4">
					<div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
						<!-- Price -->
						<div class="mb-6">
							<div class="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
								{formatPrice(course.price)}
							</div>
							<p class="text-sm text-gray-600">One-time purchase, lifetime access</p>
						</div>

						<!-- CTA Button -->
						<Button class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-4">
							Enroll Now
						</Button>

						<Button class="w-full border-2 border-gray-300 hover:border-blue-500 text-gray-900 font-semibold py-4 rounded-xl transition-all duration-300">
							Add to Cart
						</Button>

						<!-- What's Included -->
						<div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
							<h3 class="font-bold text-gray-900 text-sm mb-4">This course includes:</h3>

							<div class="flex items-center gap-3 text-sm text-gray-700">
								<div class="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<Clock class="w-3 h-3 text-blue-600" />
								</div>
								<span>{formatDuration(totalDuration(), 'long')} on-demand video</span>
							</div>

							<div class="flex items-center gap-3 text-sm text-gray-700">
								<div class="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<BookOpen class="w-3 h-3 text-purple-600" />
								</div>
								<span>{totalLessons()} lessons & resources</span>
							</div>

							<div class="flex items-center gap-3 text-sm text-gray-700">
								<div class="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<Award class="w-3 h-3 text-green-600" />
								</div>
								<span>Certificate of completion</span>
							</div>

							<div class="flex items-center gap-3 text-sm text-gray-700">
								<div class="w-5 h-5 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<Globe class="w-3 h-3 text-yellow-600" />
								</div>
								<span>Full lifetime access</span>
							</div>

							<div class="flex items-center gap-3 text-sm text-gray-700">
								<div class="w-5 h-5 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<MessageSquare class="w-3 h-3 text-pink-600" />
								</div>
								<span>Access on mobile & desktop</span>
							</div>
						</div>
					</div>

					<!-- Money Back Guarantee -->
					<div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-4 text-center">
						<Award class="w-8 h-8 text-green-600 mx-auto mb-2" />
						<p class="text-sm font-semibold text-gray-900 mb-1">30-Day Money-Back Guarantee</p>
						<p class="text-xs text-gray-600">Full refund if you're not satisfied</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Tabs Navigation -->
		<div class="bg-white rounded-2xl shadow-md border border-gray-200 mb-8">
			<div class="flex border-b border-gray-200">
				<button
					onclick={() => activeTab = 'overview'}
					class="flex-1 px-6 py-4 text-sm font-semibold transition-all {activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
				>
					Overview
				</button>
				<button
					onclick={() => activeTab = 'curriculum'}
					class="flex-1 px-6 py-4 text-sm font-semibold transition-all {activeTab === 'curriculum' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
				>
					Curriculum
				</button>
				<button
					onclick={() => activeTab = 'instructor'}
					class="flex-1 px-6 py-4 text-sm font-semibold transition-all {activeTab === 'instructor' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
				>
					Instructor
				</button>
				<button
					onclick={() => activeTab = 'reviews'}
					class="flex-1 px-6 py-4 text-sm font-semibold transition-all {activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}"
				>
					Reviews
				</button>
			</div>
		</div>

		<!-- Tab Content -->
		<div class="grid lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				{#if activeTab === 'overview'}
					<!-- Overview Tab -->
					<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
						<div>
							<h2 class="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
							<div class="grid md:grid-cols-2 gap-3">
								{#each Array(6) as _, i}
									<div class="flex items-start gap-3">
										<CheckCircle2 class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
										<span class="text-sm text-gray-700">Master key concepts and practical skills in {course.name}</span>
									</div>
								{/each}
							</div>
						</div>

						<div class="pt-6 border-t border-gray-200">
							<h2 class="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
							<ul class="space-y-2">
								<li class="flex items-start gap-3 text-sm text-gray-700">
									<div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
									<span>No prior experience required - we'll teach you everything you need to know</span>
								</li>
								<li class="flex items-start gap-3 text-sm text-gray-700">
									<div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
									<span>A computer with internet connection</span>
								</li>
								<li class="flex items-start gap-3 text-sm text-gray-700">
									<div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
									<span>Willingness to learn and practice</span>
								</li>
							</ul>
						</div>

						<div class="pt-6 border-t border-gray-200">
							<h2 class="text-2xl font-bold text-gray-900 mb-4">Description</h2>
							<div class="prose prose-sm max-w-none text-gray-700 leading-relaxed">
								<p>{course.description}</p>
								<p class="mt-4">
									This comprehensive course will take you from beginner to advanced level,
									covering all essential topics and providing hands-on experience through
									practical exercises and real-world projects.
								</p>
							</div>
						</div>
					</div>

				{:else if activeTab === 'curriculum'}
					<!-- Curriculum Tab -->
					<div class="space-y-4">
						<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
							<div class="flex items-center justify-between mb-4">
								<h2 class="text-2xl font-bold text-gray-900">Course Content</h2>
								<span class="text-sm text-gray-600">{course.sections?.length || 0} sections • {totalLessons()} lessons</span>
							</div>
						</div>

						{#if course.sections && course.sections.length > 0}
							{#each course.sections as section, sectionIndex}
								<div class="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
									<!-- Section Header -->
									<button
										onclick={() => toggleSection(section.id)}
										class="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
									>
										<div class="flex items-center gap-4 flex-1 text-left">
											<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
												{sectionIndex + 1}
											</div>
											<div>
												<h3 class="text-base font-bold text-gray-900">{section.title}</h3>
												<p class="text-xs text-gray-600 mt-0.5">
													{section.lessons?.length || 0} lessons • {formatDuration(section.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0) || 0, 'short')}
												</p>
											</div>
										</div>
										<ChevronDown class="w-5 h-5 text-gray-500 transition-transform {expandedSections.has(section.id) ? 'rotate-180' : ''}" />
									</button>

									<!-- Lessons List -->
									{#if expandedSections.has(section.id)}
										<div class="border-t border-gray-200 bg-gray-50">
											{#if section.lessons && section.lessons.length > 0}
												{#each section.lessons as lesson, lessonIndex}
													<a
														href="{ROUTES.PUBLIC.LESSON}/{lesson.id}"
														class="flex items-center gap-4 p-4 hover:bg-white transition-all duration-200 border-b border-gray-200 last:border-b-0 group"
													>
														<!-- Lesson Number -->
														<div class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 group-hover:border-blue-500 group-hover:text-blue-600 transition-all">
															{lessonIndex + 1}
														</div>

														<!-- Lesson Icon -->
														<div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
															{#if lesson.contentType === 'video'}
																<Play class="w-5 h-5 text-blue-600" />
															{:else}
																<BookOpen class="w-5 h-5 text-blue-600" />
															{/if}
														</div>

														<!-- Lesson Info -->
														<div class="flex-1">
															<h4 class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
																{lesson.title}
															</h4>
															<div class="flex items-center gap-3 mt-1">
																<span class="text-xs text-gray-500">{formatDuration(lesson.duration || 0, 'short')}</span>
																{#if lesson.isFree}
																	<span class="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Free Preview</span>
																{/if}
															</div>
														</div>

														<!-- Lock/Unlock Icon -->
														{#if lesson.isFree}
															<Play class="w-5 h-5 text-green-600" />
														{:else}
															<Lock class="w-5 h-5 text-gray-400" />
														{/if}
													</a>
												{/each}
											{:else}
												<div class="p-4 text-center text-sm text-gray-500">
													No lessons in this section yet
												</div>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						{:else}
							<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
								<BookOpen class="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<p class="text-gray-600">No curriculum available yet</p>
							</div>
						{/if}
					</div>

				{:else if activeTab === 'instructor'}
					<!-- Instructor Tab -->
					<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
						<div class="flex items-start gap-6">
							<div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
								{course.owner ? course.owner.firstName.charAt(0) + course.owner.lastName.charAt(0) : 'IN'}
							</div>
							<div class="flex-1">
								<h2 class="text-2xl font-bold text-gray-900 mb-2">
									{course.owner ? `${course.owner.firstName} ${course.owner.lastName}` : 'Unknown Author'}
								</h2>
								<p class="text-gray-600 mb-4">Course Instructor</p>

								<div class="grid grid-cols-3 gap-4 mb-6">
									<div class="text-center p-3 bg-gray-50 rounded-lg">
										<div class="text-2xl font-bold text-gray-900">4.8</div>
										<div class="text-xs text-gray-600">Instructor Rating</div>
									</div>
									<div class="text-center p-3 bg-gray-50 rounded-lg">
										<div class="text-2xl font-bold text-gray-900">15K</div>
										<div class="text-xs text-gray-600">Students</div>
									</div>
									<div class="text-center p-3 bg-gray-50 rounded-lg">
										<div class="text-2xl font-bold text-gray-900">12</div>
										<div class="text-xs text-gray-600">Courses</div>
									</div>
								</div>

								<div class="prose prose-sm max-w-none text-gray-700">
									<p>
										Expert instructor with over 10 years of experience in the industry.
										Passionate about teaching and helping students achieve their goals through
										practical, hands-on learning experiences.
									</p>
								</div>
							</div>
						</div>
					</div>

				{:else if activeTab === 'reviews'}
					<!-- Reviews Tab -->
					<div class="space-y-4">
						<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
							<div class="flex items-center gap-8 mb-6">
								<div class="text-center">
									<div class="text-5xl font-black text-gray-900 mb-2">{course.rating}</div>
									<div class="flex items-center justify-center mb-1">
										{#each Array(5) as _, i}
											<Star class="w-5 h-5 {i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
										{/each}
									</div>
									<div class="text-sm text-gray-600">Course Rating</div>
								</div>
								<div class="flex-1 space-y-2">
									{#each [5, 4, 3, 2, 1] as stars}
										<div class="flex items-center gap-3">
											<div class="flex items-center gap-1 w-20">
												{#each Array(stars) as _}
													<Star class="w-3 h-3 text-yellow-400 fill-current" />
												{/each}
											</div>
											<div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
												<div class="h-full bg-yellow-400 rounded-full" style="width: {stars === 5 ? 80 : stars === 4 ? 15 : 5}%"></div>
											</div>
											<span class="text-sm text-gray-600 w-12 text-right">{stars === 5 ? 80 : stars === 4 ? 15 : 5}%</span>
										</div>
									{/each}
								</div>
							</div>
						</div>

						<!-- Individual Reviews -->
						{#each Array(3) as _, i}
							<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
								<div class="flex items-start gap-4">
									<div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold flex-shrink-0">
										U{i+1}
									</div>
									<div class="flex-1">
										<div class="flex items-center justify-between mb-2">
											<h4 class="font-semibold text-gray-900">Student Name</h4>
											<span class="text-xs text-gray-500">2 weeks ago</span>
										</div>
										<div class="flex items-center gap-1 mb-3">
											{#each Array(5) as _, j}
												<Star class="w-4 h-4 {j < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
											{/each}
										</div>
										<p class="text-sm text-gray-700">
											Excellent course! The content is well-structured and the instructor
											explains complex concepts in an easy-to-understand manner. Highly recommended!
										</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1">
				<!-- Related Courses -->
				<div class="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
					<h3 class="text-lg font-bold text-gray-900 mb-4">Related Courses</h3>
					<div class="space-y-4">
						{#each Array(3) as _, i}
							<a href="#" class="block group">
								<div class="flex gap-3">
									<img src={course.imageUrl} alt="Related course" class="w-20 h-20 rounded-lg object-cover" />
									<div class="flex-1">
										<h4 class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
											Related Course Title {i + 1}
										</h4>
										<div class="flex items-center gap-1 mb-1">
											{#each Array(5) as _, j}
												<Star class="w-3 h-3 {j < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
											{/each}
										</div>
										<p class="text-sm font-bold text-gray-900">{formatPrice(course.price * 0.8)}</p>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .prose p {
        margin-bottom: 1rem;
    }
</style>