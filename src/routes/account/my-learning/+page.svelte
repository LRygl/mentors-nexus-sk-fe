<script lang="ts">
	import {
		GraduationCap,
		Loader2,
		ShoppingBag,
		Calendar,
		Play,
		CheckCircle2,
		BookOpen,
		Search,
		RotateCcw,
		Trophy
	} from 'lucide-svelte';
	import { enrollmentPublicAPI, type EnrolledCourseDTO } from '$lib/API/Public/EnrollmentPublicAPI';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/Config/routes.config';
	import { onMount } from 'svelte';
	import AccountPageHeader from '$lib/components/UI/AccountPageHeader.svelte';

	let enrollments = $state<EnrolledCourseDTO[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
	let searchQuery = $state('');
	let activeFilter = $state<'all' | 'in-progress' | 'completed'>('all');

	onMount(async () => {
		try {
			enrollments = await enrollmentPublicAPI.getMyEnrollments();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load enrollments';
		} finally {
			isLoading = false;
		}
	});

	// Helper function used inline in #each.
	function getCourseImageUrl(courseImageUrl: string | null): string | null {
		return courseImageUrl ? `/api/v1/files${courseImageUrl}` : null;
	}

	// Derived stats
	let totalCourses = $derived(enrollments.length);
	let completedCourses = $derived(enrollments.filter((e) => e.progress >= 100).length);
	let inProgressCourses = $derived(enrollments.filter((e) => e.progress > 0 && e.progress < 100).length);

	// Filtered + searched list
	let filteredEnrollments = $derived(
		enrollments
			.filter((e) => {
				if (activeFilter === 'completed') return e.progress >= 100;
				if (activeFilter === 'in-progress') return e.progress > 0 && e.progress < 100;
				return true;
			})
			.filter((e) =>
				searchQuery.trim() === ''
					? true
					: e.courseName.toLowerCase().includes(searchQuery.toLowerCase())
			)
	);

	function formatDate(dateStr: string): string {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(new Date(dateStr));
	}

	function typeBadgeClass(type: string): string {
		const map: Record<string, string> = {
			PURCHASED: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
			FREE: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
			GIFTED: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
			PROMOTIONAL: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
			ADMIN_ASSIGNED: 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
		};
		return map[type] ?? map.ADMIN_ASSIGNED;
	}

	function typeLabel(type: string): string {
		const labels: Record<string, string> = {
			PURCHASED: 'Purchased',
			FREE: 'Free',
			GIFTED: 'Gifted',
			PROMOTIONAL: 'Promo',
			ADMIN_ASSIGNED: 'Assigned'
		};
		return labels[type] ?? type;
	}

	function courseStatusLabel(progress: number): string {
		if (progress >= 100) return 'Review';
		if (progress > 0) return 'Continue';
		return 'Start Learning';
	}
</script>

<svelte:head>
	<title>My Learning | My Account</title>
</svelte:head>

<!-- Page wrapper -->
<div class="min-h-screen">

	<AccountPageHeader
		icon={GraduationCap}
		title="My Learning"
		subtitle="Track your progress and continue where you left off."
	/>

	{#if isLoading}
		<!-- ── Loading ────────────────────────────────────── -->
		<div class="flex flex-col items-center justify-center py-32 gap-4">
			<Loader2 class="w-10 h-10 animate-spin text-indigo-500" />
			<p class="text-sm text-gray-500 dark:text-slate-400">Loading your courses…</p>
		</div>

	{:else if error}
		<!-- ── Error ──────────────────────────────────────── -->
		<div class="rounded-2xl border border-red-200 dark:border-red-800/60 bg-red-50 dark:bg-red-900/20 p-8 text-center">
			<p class="text-red-600 dark:text-red-400 font-medium">{error}</p>
			<button
				onclick={() => location.reload()}
				class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
			>
				<RotateCcw class="w-4 h-4" /> Try again
			</button>
		</div>

	{:else if enrollments.length === 0}
		<!-- ── Empty state ────────────────────────────────── -->
		<div class="rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-16 text-center">
			<div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
				<BookOpen class="w-8 h-8 text-indigo-400" />
			</div>
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No courses yet</h2>
			<p class="text-gray-500 dark:text-slate-400 text-sm mb-7 max-w-xs mx-auto">
				Start your learning journey by enrolling in your first course.
			</p>
			<button
				onclick={() => goto(ROUTES.PUBLIC.STORE)}
				class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
			>
				<ShoppingBag class="w-4 h-4" />
				Browse Courses
			</button>
		</div>

	{:else}

		<!-- ── Stats row ───────────────────────────────────── -->
		<div class="grid grid-cols-3 gap-4 mb-8">
			{#each [
				{ label: 'Total Enrolled', value: totalCourses, icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
				{ label: 'In Progress', value: inProgressCourses, icon: Play, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
				{ label: 'Completed', value: completedCourses, icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
			] as stat}
				<div class="rounded-xl border {stat.bg} bg-white/60 dark:bg-slate-900/60 backdrop-blur px-5 py-4 flex items-center gap-4">
					<div class="p-2 rounded-lg {stat.bg} border">
						<stat.icon class="w-5 h-5 {stat.color}" />
					</div>
					<div>
						<div class="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
						<div class="text-xs text-gray-500 dark:text-slate-400">{stat.label}</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- ── Filters + Search ───────────────────────────── -->
		<div class="flex flex-col sm:flex-row gap-3 mb-6">
			<!-- Filter tabs -->
			<div class="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 w-fit">
				{#each [
					{ key: 'all', label: 'All' },
					{ key: 'in-progress', label: 'In Progress' },
					{ key: 'completed', label: 'Completed' }
				] as tab}
					<button
						onclick={() => activeFilter = tab.key as typeof activeFilter}
						class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all {activeFilter === tab.key
							? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
							: 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'}"
					>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Search -->
			<div class="relative flex-1 max-w-sm">
				<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
				<input
					type="text"
					placeholder="Search courses…"
					bind:value={searchQuery}
					class="w-full pl-9 pr-4 py-2 rounded-xl text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
				/>
			</div>
		</div>

		<!-- ── Course grid ────────────────────────────────── -->
		{#if filteredEnrollments.length === 0}
			<div class="py-16 text-center text-gray-500 dark:text-slate-400 text-sm">
				No courses match your filter.
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
				{#each filteredEnrollments as course (course.courseId)}
					{@const imageUrl = getCourseImageUrl(course.courseImageUrl)}
					{@const isCompleted = course.progress >= 100}
					{@const isStarted = course.progress > 0}

					<div class="group relative flex flex-col rounded-2xl border border-gray-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300">

						<!-- Course thumbnail -->
						<div class="relative h-44 overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex-shrink-0">
							{#if imageUrl}
								<img
									src={imageUrl}
									alt={course.courseName}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
								/>
								<!-- Overlay so badges are always readable -->
								<div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
							{:else}
								<div class="w-full h-full flex items-center justify-center">
									<GraduationCap class="w-14 h-14 text-white/30" />
								</div>
							{/if}

							<!-- Completion badge -->
							{#if isCompleted}
								<div class="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
									<CheckCircle2 class="w-3.5 h-3.5" />
									Completed
								</div>
							{/if}

							<!-- Enrollment type badge -->
							{#if course.type}
								<div class="absolute top-3 left-3">
									<span class="px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm {typeBadgeClass(course.type)}">
										{typeLabel(course.type)}
									</span>
								</div>
							{/if}

							<!-- Progress overlay at bottom of image -->
							{#if isStarted && !isCompleted}
								<div class="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
									<div
										class="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700"
										style="width: {Math.min(course.progress, 100)}%"
									></div>
								</div>
							{/if}
						</div>

						<!-- Card body -->
						<div class="flex flex-col flex-1 p-5">
							<h3 class="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
								{course.courseName}
							</h3>

							<div class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 mb-4">
								<Calendar class="w-3.5 h-3.5" />
								<span>Enrolled {formatDate(course.enrolledAt)}</span>
							</div>

							<!-- Progress section -->
							<div class="mt-auto">
								<div class="flex items-center justify-between text-xs mb-1.5">
									<span class="text-gray-500 dark:text-slate-400 font-medium">Progress</span>
									<span class="font-bold {isCompleted ? 'text-emerald-500' : 'text-gray-900 dark:text-white'}">
										{course.progress}%
									</span>
								</div>
								<div class="h-1.5 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden mb-4">
									<div
										class="h-full rounded-full transition-all duration-700 {isCompleted
											? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
											: 'bg-gradient-to-r from-indigo-500 to-purple-500'}"
										style="width: {Math.min(course.progress, 100)}%"
									></div>
								</div>

								<!-- CTA button -->
								<button
									onclick={() => goto(`${ROUTES.PUBLIC.COURSE}/${course.courseId}`)}
									class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
										{isCompleted
											? 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
											: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40'}"
								>
									{#if isCompleted}
										<RotateCcw class="w-4 h-4" />
									{:else}
										<Play class="w-4 h-4 fill-current" />
									{/if}
									{courseStatusLabel(course.progress)}
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
