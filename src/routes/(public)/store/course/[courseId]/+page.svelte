<script lang="ts">
	import type { PageData } from './$types';
	import {
		Check,
		BookOpen,
		Star,
		Clock,
		Users,
		ChevronDown,
		ChevronRight,
		Play,
		Lock,
		BadgeCheck,
		Sparkles,
		GraduationCap,
		ShoppingCart,
		Tag,
		Calendar,
		BarChart3,
		Award
	} from 'lucide-svelte';
	import { enrollmentStore } from '$lib/stores/defaults/EnrollmentStore.svelte.js';
	import { LessonType } from '$lib/types/enums/LessonType';
	import { formatDuration } from '$lib/utils/DurationUtils';
	import DificultyIndicator from '$lib/components/DificultyIndicator.svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/Auth.svelte';
	import { cartService } from '$lib/Services/CartService.svelte';
	import { cartStore } from '$lib/stores/Cart.svelte';
	import { ROUTES } from '$lib/Config/routes.config';

	let { data }: { data: PageData } = $props();
	let course = $derived(data.course);
	let courseDuration = $derived(formatDuration(course.duration));

	let isEnrolled = $derived(enrollmentStore.isEnrolledIn(course.id));
	let isAdmin = $derived(authStore.isAdmin);
	let isInCart = $derived(cartStore.isInCart(String(course.id)));
	let imageUrl = $derived(`/api/v1/files${course.imageUrl}`);
	let hasHeroImage = $derived(!!course.imageUrl);

	let expandedSections = $state<Set<string>>(
		new Set(course.sections?.map((s) => s.id) || [])
	);

	let totalLessons = $derived(
		course.sections?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0
	);
	let ratingFloor = $derived(Math.floor(course.rating ?? 0));
	let firstLesson = $derived(course.sections?.[0]?.lessons?.[0]);

	const formatPrice = (price: number) =>
		new Intl.NumberFormat('cs-CZ', {
			style: 'currency',
			currency: 'CZK',
			minimumFractionDigits: 0
		}).format(price);

	const formatCount = (count: number) =>
		count >= 1000 ? `${(count / 1000).toFixed(1)}k` : String(count);

	const toggleSection = (sectionId: string) => {
		const next = new Set(expandedSections);
		if (next.has(sectionId)) next.delete(sectionId);
		else next.add(sectionId);
		expandedSections = next;
	};

	const handleAddToCart = () => {
		cartService.addToCart(
			{ courseId: String(course.id), courseName: course.name, courseImageUrl: course.imageUrl ?? null, price: course.price },
			{ redirectToCheckout: true }
		);
	};

	const handleStartLearning = () => {
		if (firstLesson) goto(`/store/course/${course.id}/lesson/${firstLesson.id}`);
	};

	const handleLessonClick = (lesson: { id: number | string; type: LessonType }) => {
		if (lesson.type === LessonType.FREE || isEnrolled || isAdmin) {
			goto(`/store/course/${course.id}/lesson/${lesson.id}`);
		} else {
			goto(`/courses/${course.id}/purchase`);
		}
	};

	const isLessonAccessible = (lessonType: LessonType): boolean =>
		lessonType === LessonType.FREE || isEnrolled || isAdmin;
</script>

<div class="min-h-screen w-7xl bg-white dark:bg-slate-950">

	<!-- ─── HERO ─────────────────────────────────────────────────────────────── -->
	<div
		class="relative overflow-hidden border-b {hasHeroImage ? 'border-transparent' : 'border-slate-100 dark:border-slate-800/60'}"
		style={hasHeroImage ? `background-image: url('${imageUrl}'); background-size: cover; background-position: center;` : ''}
	>

		{#if hasHeroImage}
			<!-- Gradient overlay: darker on left for text, lighter toward right, deepens at bottom for meta strip -->
			<div class="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/25 pointer-events-none select-none" aria-hidden="true"></div>
			<div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 to-transparent pointer-events-none select-none" aria-hidden="true"></div>
		{:else}
			<!-- Background decoration: soft blobs + subtle dot grid -->
			<div class="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
				<div class="absolute -top-32 -right-32 w-[480px] h-[480px] bg-indigo-100/70 dark:bg-indigo-900/20 rounded-full blur-3xl"></div>
				<div class="absolute top-1/2 right-24 w-64 h-64 bg-violet-100/50 dark:bg-violet-900/15 rounded-full blur-2xl"></div>
				<div class="absolute bottom-0 left-0 w-80 h-40 bg-sky-50/80 dark:bg-sky-900/10 rounded-full blur-2xl"></div>
				<!-- Dot grid -->
				<div class="absolute inset-0 opacity-[0.035] dark:opacity-[0.04]"
					style="background-image: radial-gradient(circle, #6366f1 1px, transparent 1px); background-size: 28px 28px;">
				</div>
			</div>
		{/if}

		<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

			<!-- Hero text content (constrained width when image is background) -->
			<div class="py-12 lg:py-16 {hasHeroImage ? 'max-w-3xl' : 'flex flex-col lg:flex-row items-start gap-10 lg:gap-16'}">

				<!-- ── LEFT: Text content ── -->
				<div class="{hasHeroImage ? 'w-full' : 'flex-1 min-w-0'} flex flex-col gap-5">

					<!-- Breadcrumb -->
					<nav class="flex items-center gap-1 text-xs font-medium flex-wrap {hasHeroImage ? 'text-white/60' : 'text-slate-400 dark:text-slate-500'}">
						<a href={ROUTES.PUBLIC.STORE} class="transition-colors {hasHeroImage ? 'hover:text-white' : 'hover:text-indigo-600 dark:hover:text-indigo-400'}">Store</a>
						<ChevronRight class="w-3 h-3 flex-shrink-0" />
						{#if course.categories?.[0]}
							<span>{course.categories[0]}</span>
							<ChevronRight class="w-3 h-3 flex-shrink-0" />
						{/if}
						<span class="{hasHeroImage ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'} truncate">{course.name}</span>
					</nav>

					<!-- Badges -->
					<div class="flex flex-wrap gap-2">
						{#if course.featured}
							<span class="inline-flex items-center gap-1 px-2.5 py-1 border rounded-full text-xs font-semibold
								{hasHeroImage
									? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
									: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-400'}">
								<Sparkles class="w-3 h-3" />
								Featured
							</span>
						{/if}
						{#if course.level}
							<span class="inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full text-xs font-medium
								{hasHeroImage
									? 'bg-white/15 border-white/20 text-white'
									: 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}">
								<DificultyIndicator level={course.level} size="sm" showLabel={true} />
							</span>
						{/if}
						{#each (course.categories ?? []).slice(0, 2) as cat}
							<span class="inline-flex items-center gap-1 px-2.5 py-1 border rounded-full text-xs font-medium
								{hasHeroImage
									? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-200'
									: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400'}">
								<Tag class="w-3 h-3" />
								{cat}
							</span>
						{/each}
					</div>

					<!-- Title -->
					<h1 class="text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-[1.1] tracking-tight
						{hasHeroImage ? 'text-white' : 'text-gray-900 dark:text-white'}">
						{course.name}
					</h1>

					<!-- Description -->
					<p class="text-base leading-relaxed max-w-[52ch]
						{hasHeroImage ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'}">
						{course.description}
					</p>

					<!-- ── Inline Purchase / Enrolled ── -->
					<div class="pt-5 border-t {hasHeroImage ? 'border-white/15' : 'border-slate-100 dark:border-slate-800'}">
						{#if isEnrolled}
							<!-- Enrolled state -->
							<div class="flex items-center gap-2 mb-4">
								<div class="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0
									{hasHeroImage
										? 'bg-emerald-500/20 border-emerald-400/40'
										: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/50'}">
									<GraduationCap class="w-3 h-3 {hasHeroImage ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'}" />
								</div>
								<p class="text-sm font-semibold {hasHeroImage ? 'text-emerald-300' : 'text-emerald-600 dark:text-emerald-400'}">
									You're enrolled in this course
								</p>
							</div>
							{#if firstLesson}
								<button
									onclick={handleStartLearning}
									class="inline-flex items-center gap-2.5 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[.99] text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200/70 dark:shadow-indigo-900/40"
								>
									<Play class="w-4 h-4 fill-white" />
									Start Learning
								</button>
							{/if}
							<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2">
								<span class="flex items-center gap-1.5 text-xs {hasHeroImage ? 'text-white/60' : 'text-slate-400'}">
									<BadgeCheck class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Lifetime access
								</span>
								<span class="flex items-center gap-1.5 text-xs {hasHeroImage ? 'text-white/60' : 'text-slate-400'}">
									<Award class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Certificate included
								</span>
							</div>

						{:else}
							<!-- Price -->
							<div class="flex items-baseline gap-3 mb-4">
								<span class="text-4xl font-black tracking-tight {hasHeroImage ? 'text-white' : 'text-gray-900 dark:text-white'}">
									{formatPrice(course.price)}
								</span>
							</div>

							<!-- CTA button -->
							{#if isInCart}
								<button
									onclick={() => cartService.goToCheckout()}
									class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[.99] text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200/70 dark:shadow-emerald-900/40"
								>
									<ShoppingCart class="w-4 h-4" />
									Go to Checkout
								</button>
							{:else}
								<button
									onclick={handleAddToCart}
									class="inline-flex items-center gap-2.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[.99] text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200/70 dark:shadow-indigo-900/40"
								>
									<ShoppingCart class="w-4 h-4" />
									Purchase Now
								</button>
							{/if}

							<!-- Includes chips -->
							<div class="mt-4 flex flex-wrap gap-x-5 gap-y-2">
								<span class="flex items-center gap-1.5 text-xs {hasHeroImage ? 'text-white/60' : 'text-slate-400'}">
									<BadgeCheck class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Lifetime access
								</span>
								<span class="flex items-center gap-1.5 text-xs {hasHeroImage ? 'text-white/60' : 'text-slate-400'}">
									<Award class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> Certificate
								</span>
							</div>
						{/if}
					</div>

				</div>

				<!-- ── RIGHT: Course image card – shown only when NOT used as hero background ── -->
				{#if course.imageUrl && !hasHeroImage}
					<div class="w-full lg:w-[400px] flex-shrink-0 self-center">
						<div class="relative group">
							<!-- Glow effect behind the card -->
							<div class="absolute -inset-2 bg-gradient-to-br from-indigo-200/60 to-violet-200/40 dark:from-indigo-800/30 dark:to-violet-800/20 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
							<!-- Image card -->
							<div class="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/8">
								<img
									src={imageUrl}
									alt={course.name}
									class="w-full aspect-video object-cover object-center scale-[1.01] group-hover:scale-[1.04] transition-transform duration-500"
								/>
								<!-- Play button overlay on hover -->
								<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
									<div class="w-16 h-16 rounded-full bg-white/95 shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
										<Play class="w-6 h-6 text-indigo-600 fill-indigo-600 ml-1" />
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}

			</div>

			<!-- ── Meta strip ── -->
			<div class="border-t py-4 {hasHeroImage ? 'border-white/15' : 'border-slate-100 dark:border-slate-800/70'}">
				<div class="flex items-center">

					<!-- Instructor – anchored to the left -->
					{#if course.owner}
						<div class="flex items-center gap-2.5 flex-shrink-0">
							<div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-1 {hasHeroImage ? 'ring-white/20' : 'ring-indigo-200 dark:ring-white/10'}">
								{course.owner.firstName?.[0] ?? '?'}{course.owner.lastName?.[0] ?? ''}
							</div>
							<div>
								<p class="text-[10px] uppercase tracking-widest {hasHeroImage ? 'text-white/50' : 'text-slate-400 dark:text-slate-500'}">Instructor</p>
								<p class="text-sm font-semibold leading-tight {hasHeroImage ? 'text-white' : 'text-slate-700 dark:text-slate-200'}">
									{course.owner.firstName} {course.owner.lastName}
								</p>
							</div>
						</div>
						<div class="w-px h-7 flex-shrink-0 mx-7 hidden sm:block {hasHeroImage ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'}"></div>
					{/if}

					<!-- Remaining metadata fills the available space -->
					<div class="flex flex-1 flex-wrap items-center justify-between gap-x-6 gap-y-3">

						{#if course.level}
							<div>
								<p class="text-[10px] uppercase tracking-widest {hasHeroImage ? 'text-white/50' : 'text-slate-400 dark:text-slate-500'}">Level</p>
								<p class="text-sm font-semibold {hasHeroImage ? 'text-white' : 'text-slate-700 dark:text-slate-200'}">{course.level}</p>
							</div>
						{/if}

						<div>
							<p class="text-[10px] uppercase tracking-widest {hasHeroImage ? 'text-white/50' : 'text-slate-400 dark:text-slate-500'}">Duration</p>
							<p class="text-sm font-semibold {hasHeroImage ? 'text-white' : 'text-slate-700 dark:text-slate-200'}">{courseDuration}</p>
						</div>

						<div>
							<p class="text-[10px] uppercase tracking-widest {hasHeroImage ? 'text-white/50' : 'text-slate-400 dark:text-slate-500'}">Lessons</p>
							<p class="text-sm font-semibold {hasHeroImage ? 'text-white' : 'text-slate-700 dark:text-slate-200'}">{totalLessons}</p>
						</div>

						{#if course.students !== undefined}
							<div>
								<p class="text-[10px] uppercase tracking-widest {hasHeroImage ? 'text-white/50' : 'text-slate-400 dark:text-slate-500'}">Students</p>
								<p class="text-sm font-semibold {hasHeroImage ? 'text-white' : 'text-slate-700 dark:text-slate-200'}">{formatCount(course.students)}</p>
							</div>
						{/if}

						{#if course.updatedAt}
							<div>
								<p class="text-[10px] uppercase tracking-widest {hasHeroImage ? 'text-white/50' : 'text-slate-400 dark:text-slate-500'}">Last Updated</p>
								<p class="text-sm font-semibold {hasHeroImage ? 'text-white' : 'text-slate-700 dark:text-slate-200'}">{new Date(course.updatedAt).toLocaleDateString('cs-CZ')}</p>
							</div>
						{/if}

						{#if course.categories && course.categories.length > 0}
							<div class="flex flex-wrap gap-1.5">
								{#each course.categories as cat}
									<a
										href="{ROUTES.PUBLIC.STORE}?category={encodeURIComponent(cat)}"
										class="px-2.5 py-1 border text-xs font-medium rounded-lg transition-colors
											{hasHeroImage
												? 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40 text-white/80 hover:text-white'
												: 'bg-slate-100 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300'}"
									>
										{cat}
									</a>
								{/each}
							</div>
						{/if}

					</div>
				</div>
			</div>

		</div>
	</div>

	<!-- ─── CONTENT ───────────────────────────────────────────────────────────── -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

		<!-- What you'll learn -->
		{#if course.goals && course.goals.length > 0}
			<section class="py-12 border-b border-gray-100 dark:border-slate-800/60">
				<p class="text-[10px] font-bold text-indigo-600 dark:text-indigo-500 uppercase tracking-[0.16em] mb-2">In this course</p>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">What you'll learn</h2>
				<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3.5">
					{#each course.goals as goal}
						<div class="flex items-start gap-3">
							<div class="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center flex-shrink-0 mt-0.5">
								<Check class="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
							</div>
							<span class="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{goal}</span>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Requirements -->
		{#if course.requirements && course.requirements.length > 0}
			<section class="py-12 border-b border-gray-100 dark:border-slate-800/60">
				<p class="text-[10px] font-bold text-indigo-600 dark:text-indigo-500 uppercase tracking-[0.16em] mb-2">Prerequisites</p>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Requirements</h2>
				<ul class="grid sm:grid-cols-2 gap-x-16 gap-y-2.5 max-w-4xl">
					{#each course.requirements as req}
						<li class="flex items-baseline gap-3 text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
							<span class="w-1 h-1 rounded-full bg-gray-400 dark:bg-slate-500 flex-shrink-0 mt-[0.45rem]"></span>
							{req}
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- Course Content / Curriculum -->
		<section class="py-12">
			<p class="text-[10px] font-bold text-indigo-600 dark:text-indigo-500 uppercase tracking-[0.16em] mb-2">Curriculum</p>
			<div class="flex items-end justify-between mb-1">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Course Content</h2>
			</div>
			<p class="text-sm text-gray-400 dark:text-slate-500 mb-8">
				{course.sections?.length || 0} sections · {totalLessons} lessons · {courseDuration} total
			</p>

			{#if course.sections && course.sections.length > 0}
				<div class="space-y-2 max-w-4xl">
					{#each course.sections as section, index}
						<div class="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden">

							<!-- Section header button -->
							<button
								onclick={() => toggleSection(section.id)}
								class="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50/80 dark:bg-slate-900/60 hover:bg-gray-100 dark:hover:bg-slate-800/70 transition-colors text-left"
							>
								<div class="flex items-center gap-3">
									<span class="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 tabular-nums">
										{index + 1}
									</span>
									<div>
										<p class="text-sm font-semibold text-gray-900 dark:text-white">{section.title}</p>
										<p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{section.lessons?.length || 0} lessons</p>
									</div>
								</div>
								<ChevronDown class="w-4 h-4 text-gray-400 dark:text-slate-500 transition-transform duration-200 flex-shrink-0 {expandedSections.has(section.id) ? 'rotate-180' : ''}" />
							</button>

							<!-- Lessons list -->
							{#if expandedSections.has(section.id)}
								<div class="divide-y divide-gray-50 dark:divide-slate-800/70">
									{#if section.lessons && section.lessons.length > 0}
										{#each section.lessons as lesson}
											{@const accessible = isLessonAccessible(lesson.type)}
											<button
												onclick={() => handleLessonClick(lesson)}
												class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors text-left group/lesson"
											>
												<!-- Play / Lock icon -->
												<div class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 {accessible ? 'bg-emerald-50 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-slate-800'}">
													{#if accessible}
														<Play class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
													{:else}
														<Lock class="w-3 h-3 text-gray-400 dark:text-slate-500" />
													{/if}
												</div>

												<!-- Title + duration -->
												<div class="flex-1 min-w-0">
													<p class="text-sm font-medium text-gray-700 dark:text-slate-300 truncate group-hover/lesson:text-indigo-600 dark:group-hover/lesson:text-indigo-400 transition-colors">
														{lesson.title}
													</p>
													{#if lesson.duration}
														<p class="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{formatDuration(lesson.duration)}</p>
													{/if}
												</div>

												<!-- Type badge -->
												{#if lesson.type === LessonType.FREE}
													<span class="flex-shrink-0 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-md">
														Free
													</span>
												{:else if !isEnrolled && !isAdmin}
													<span class="flex-shrink-0 px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 text-xs font-medium rounded-md">
														Locked
													</span>
												{/if}
											</button>
										{/each}
									{:else}
										<div class="px-4 py-8 text-center text-sm text-gray-400 dark:text-slate-500 italic">
											No lessons yet
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<div class="py-16 text-center max-w-4xl">
					<BookOpen class="w-10 h-10 mx-auto mb-3 text-gray-200 dark:text-slate-700" />
					<p class="text-sm text-gray-400 dark:text-slate-500">No content available yet</p>
				</div>
			{/if}
		</section>

	</div>
</div>
