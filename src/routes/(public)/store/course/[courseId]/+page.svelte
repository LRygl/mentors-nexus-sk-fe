<script lang="ts">
	import type { PageData } from './$types';
	import {
		CheckCircle2,
		Target,
		ClipboardList,
		BookOpen,
		User,
		Mail,
		Star,
		Clock,
		Users,
		ChevronDown,
		Play,
		Lock,
		BadgeCheck,
		Sparkles
	} from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { enrollmentStore } from '$lib/stores/defaults/EnrollmentStore.svelte.js';
	import { LessonType } from '$lib/types/enums/LessonType';
	import { formatDuration } from '$lib/utils/DurationUtils';
	import DificultyIndicator from '$lib/components/DificultyIndicator.svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/Auth.svelte';

	let { data }: { data: PageData } = $props();
	let course = $derived(data.course);
	let courseDuration = $derived(formatDuration(course.duration));

	// Reactive state from stores
	let isEnrolled = $derived(enrollmentStore.isEnrolledIn(course.id));
	let isAdmin = $derived(authStore.isAdmin);

	// Track expanded sections
	let expandedSections = $state<Set<string>>(
		new Set(course.sections?.map(section => section.id) || [])
	);

	let imageUrl = $derived(`/api/v1/files${course.imageUrl}`);


	const toggleSection = (sectionId: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(sectionId)) {
			newExpanded.delete(sectionId);
		} else {
			newExpanded.add(sectionId);
		}
		expandedSections = newExpanded;
	};

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('cs-CZ', {
			style: 'currency',
			currency: 'CZK',
			minimumFractionDigits: 0
		}).format(price);

	const totalLessons = $derived(
		course.sections?.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0
	);


	/**
	 * Handle lesson click based on enrollment status and lesson type
	 */
	const handleLessonClick = (lesson: { id: number | string; type: LessonType }) => {
		// Free lessons - always accessible
		if (lesson.type === LessonType.FREE) {
			goto(`/store/course/${course.id}/lesson/${lesson.id}`);
			return;
		}

		// Paid lessons - check enrollment
		if (isEnrolled || isAdmin ) {
			// User is enrolled or admin - go to lesson
			goto(`/store/course/${course.id}/lesson/${lesson.id}`);
		} else {
			// User is not enrolled - go to purchase page
			goto(`/courses/${course.id}/purchase`);
		}
	};

	/**
	 * Check if a lesson is accessible to the
	 */
	const isLessonAccessible = (lessonType: LessonType): boolean => {
		return lessonType === LessonType.FREE || isEnrolled;
	};

</script>

<div class="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
	<!-- Hero Section -->
	<div class="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
		<div class="w-full px-6 lg:px-12 py-12 lg:py-16">
			<div class="grid lg:grid-cols-3 gap-8 items-start">
				<!-- Course Info -->
				<div class="lg:col-span-2 space-y-4">
					<!-- Badges -->
					<div class="flex flex-wrap gap-2">
						{#if course.featured}
              <span class="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                <Sparkles class="w-3 h-3" />
                Featured
              </span>
						{/if}
						{#if course.level}
              <span class="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-medium">

								<DificultyIndicator level={course.level} showLabel={false} />
              </span>
						{/if}
					</div>

					<!-- Title -->
					<h1 class="text-3xl lg:text-4xl font-bold leading-tight">
						{course.name}
					</h1>

					<!-- Description -->
					<p class="text-blue-100 text-lg leading-relaxed">
						{course.description}
					</p>

					<!-- Meta Stats -->
					<div class="flex flex-wrap items-center gap-6 pt-4">
						<div class="flex items-center gap-2">
							<div class="flex">
								{#each Array(5) as _, i}
									<Star class="w-4 h-4 {i < Math.floor(course.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}" />
								{/each}
							</div>
							<span class="font-medium">{course.rating || 0}</span>
						</div>

						<div class="flex items-center gap-2 text-blue-100">
							<Users class="w-4 h-4" />
							<span>{course.students || 0} students</span>
						</div>

						<div class="flex items-center gap-2 text-blue-100">
							<Clock class="w-4 h-4" />
							<span>{courseDuration || 0}</span>
						</div>

						<div class="flex items-center gap-2 text-blue-100">
							<BookOpen class="w-4 h-4" />
							<span>{totalLessons} lessons</span>
						</div>
					</div>

				</div>
				{#if !isEnrolled}
				<!-- Purchase Card -->
				<div class="lg:col-span-1">
					<div class="bg-white rounded-2xl shadow-2xl p-6 text-gray-900">
						<!-- Course Image -->
						{#if course.imageUrl}
							<img
								src={imageUrl}
								alt={course.name}
								class="w-full h-40 object-cover rounded-xl mb-4"
							/>
						{:else}
							<div class="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 flex items-center justify-center">
								<BookOpen class="w-12 h-12 text-blue-300" />
							</div>
						{/if}

						<!-- Price -->
						<div class="text-center mb-6">
							<div class="text-4xl font-black text-gray-900">
								{formatPrice(course.price)}
							</div>
							<p class="text-sm text-gray-500 mt-1">One-time payment</p>
						</div>

						<!-- CTA Buttons -->
						<div class="space-y-3">

								<Button class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 rounded-xl shadow-lg">
									Purchase Now
								</Button>

							<Button variant="outline" class="w-full py-6 rounded-xl">
								Add to Wishlist
							</Button>
						</div>

						<!-- Includes -->
						<div class="mt-6 pt-6 border-t border-gray-100 space-y-3">
							<p class="text-sm font-semibold text-gray-700">This course includes:</p>
							<div class="flex items-center gap-3 text-sm text-gray-600">
								<BadgeCheck class="w-4 h-4 text-green-500" />
								<span>Lifetime access</span>
							</div>
							<div class="flex items-center gap-3 text-sm text-gray-600">
								<BadgeCheck class="w-4 h-4 text-green-500" />
								<span>Certificate of completion</span>
							</div>
							<div class="flex items-center gap-3 text-sm text-gray-600">
								<BadgeCheck class="w-4 h-4 text-green-500" />
								<span>Access on all devices</span>
							</div>
						</div>
					</div>
				</div>
				{/if}

			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="w-full px-6 lg:px-12 py-12">
		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Left Column - Main Content -->
			<div class="lg:col-span-2 space-y-8">

				<!-- Goals Section -->
				{#if course.goals && course.goals.length > 0}
					<section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
								<Target class="w-5 h-5 text-green-600" />
							</div>
							<h2 class="text-xl font-bold text-gray-900">What you'll learn</h2>
						</div>

						<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
							{#each course.goals as goal}
								<div class="flex items-start gap-3 p-3 rounded-lg bg-green-50/50">
									<CheckCircle2 class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
									<span class="text-sm text-gray-700">{goal}</span>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Requirements Section -->
				{#if course.requirements && course.requirements.length > 0}
					<section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
						<div class="flex items-center gap-3 mb-6">
							<div class="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
								<ClipboardList class="w-5 h-5 text-orange-600" />
							</div>
							<h2 class="text-xl font-bold text-gray-900">Requirements</h2>
						</div>

						<ul class="grid md:grid-cols-2 gap-3">
							{#each course.requirements as requirement}
								<li class="flex items-start gap-3">
									<div class="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
									<span class="text-gray-700">{requirement}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				<!-- Course Content / Sections -->
				<section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
					<div class="flex items-center justify-between mb-6">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
								<BookOpen class="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<h2 class="text-xl font-bold text-gray-900">Course Content</h2>
								<p class="text-sm text-gray-500">
									{course.sections?.length || 0} sections • {totalLessons} lessons
								</p>
							</div>
						</div>
					</div>

					{#if course.sections && course.sections.length > 0}
						<div class="space-y-3">
							{#each course.sections as section, index}
								<div class="border border-gray-200 rounded-xl overflow-hidden">
									<!-- Section Header -->
									<button
										onclick={() => toggleSection(section.id)}
										class="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
									>
										<div class="flex items-center gap-3">
                      <span class="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
											<div class="text-left">
												<h3 class="font-semibold text-gray-900">{section.title}</h3>
												<p class="text-xs text-gray-500">
													{section.lessons?.length || 0} lessons
												</p>
											</div>
										</div>
										<ChevronDown
											class="w-5 h-5 text-gray-400 transition-transform duration-200 {expandedSections.has(section.id) ? 'rotate-180' : ''}"
										/>
									</button>

									<!-- Lessons -->
									<!-- Inside the Lessons section, replace the lesson rendering: -->
									{#if expandedSections.has(section.id)}
										<div class="divide-y divide-gray-100">
											{#if section.lessons && section.lessons.length > 0}
												{#each section.lessons as lesson}
													{@const accessible = isLessonAccessible(lesson.type)}
													<button
														onclick={() => handleLessonClick(lesson)}
														class="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
													>
														<!-- Icon -->
														<div class="w-8 h-8 rounded-lg flex items-center justify-center {accessible ? 'bg-green-100' : 'bg-gray-100'}">
															{#if accessible}
																<Play class="w-4 h-4 text-green-600" />
															{:else}
																<Lock class="w-4 h-4 text-gray-400" />
															{/if}
														</div>

														<!-- Lesson Info -->
														<div class="flex-1">
															<p class="font-medium text-gray-900">{lesson.title}</p>
															<p class="text-xs text-gray-500">{formatDuration(lesson.duration)}</p>
														</div>

														<!-- Badge -->
														{#if lesson.type === LessonType.FREE}
						<span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
							Free
						</span>
														{:else if !isEnrolled}
						<span class="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded">
							Locked
						</span>
														{/if}
													</button>
												{/each}
											{:else}
												<div class="p-4 text-center text-gray-500 text-sm">
													No lessons yet
												</div>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-center py-12 text-gray-500">
							<BookOpen class="w-12 h-12 mx-auto mb-3 text-gray-300" />
							<p>No content available yet</p>
						</div>
					{/if}
				</section>
			</div>

			<!-- Right Column - Sidebar -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Instructor Card -->
				<section class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<div class="flex items-center gap-3 mb-6">
						<div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
							<User class="w-5 h-5 text-purple-600" />
						</div>
						<h2 class="text-xl font-bold text-gray-900">Instructor</h2>
					</div>

					<div class="text-center">
						<!-- Avatar -->
						<div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
							{course.owner?.firstName?.charAt(0)}{course.owner?.lastName?.charAt(0)}
						</div>

						<!-- Name -->
						<h3 class="text-lg font-bold text-gray-900">
							{course.owner?.firstName} {course.owner?.lastName}
						</h3>

						<!-- Email -->
						<div class="flex items-center justify-center gap-2 mt-2 text-gray-500">
							<Mail class="w-4 h-4" />
							<span class="text-sm">{course.owner?.email}</span>
						</div>

						<!-- Stats -->
						<div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
							<div class="text-center">
								<p class="text-2xl font-bold text-gray-900">4.8</p>
								<p class="text-xs text-gray-500">Rating</p>
							</div>
							<div class="text-center">
								<p class="text-2xl font-bold text-gray-900">12</p>
								<p class="text-xs text-gray-500">Courses</p>
							</div>
						</div>
					</div>
				</section>

				<!-- Course Info Card -->
				<section class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
					<h3 class="font-bold text-gray-900 mb-4">Course Details</h3>
					<div class="space-y-3 text-sm">
						<div class="flex justify-between">
						<span class="text-gray-600">Date published</span>
						<span class="font-medium text-gray-900">
                {new Date(course.publishedAt).toLocaleDateString('cs-CZ')}
              </span>
					</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Last updated</span>
							<span class="font-medium text-gray-900">
                {new Date(course.updatedAt).toLocaleDateString('cs-CZ')}
              </span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Level</span>
							<span class="font-medium text-gray-900">{course.level || 'All levels'}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Students</span>
							<span class="font-medium text-gray-900">{course.students || 0}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600">Duration</span>
							<span class="font-medium text-gray-900">{courseDuration || 0}</span>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</div>