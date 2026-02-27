<script lang="ts">
	import {
		LayoutDashboard,
		GraduationCap,
		Trophy,
		Clock,
		TrendingUp,
		ArrowRight,
		ShoppingBag,
		FileText,
		Sparkles
	} from 'lucide-svelte';
	import { authStore } from '$lib/stores/Auth.svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/Config/routes.config';
	import AccountPageHeader from '$lib/components/UI/AccountPageHeader.svelte';

	let user = $derived(authStore.user);

	function getGreeting(): string {
		const hour = new Date().getHours();
		if (hour < 12) return 'Good morning';
		if (hour < 18) return 'Good afternoon';
		return 'Good evening';
	}
</script>

<svelte:head>
	<title>Dashboard | My Account</title>
</svelte:head>

<div>
	<AccountPageHeader
		icon={LayoutDashboard}
		title="{getGreeting()}, {user?.firstName ?? 'there'}"
		subtitle="Here's an overview of your learning journey."
	/>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl border border-gray-200/60 dark:border-slate-800 p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
					<GraduationCap class="w-5 h-5 text-blue-600 dark:text-blue-400" />
				</div>
				<span class="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled</span>
			</div>
			<p class="text-3xl font-bold text-gray-900 dark:text-white">{user?.enrolledCoursesCount ?? 0}</p>
			<p class="text-xs text-gray-500 mt-1">Total courses</p>
		</div>

		<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl border border-gray-200/60 dark:border-slate-800 p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
					<Trophy class="w-5 h-5 text-green-600 dark:text-green-400" />
				</div>
				<span class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</span>
			</div>
			<p class="text-3xl font-bold text-gray-900 dark:text-white">--</p>
			<p class="text-xs text-gray-500 mt-1">Coming soon</p>
		</div>

		<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl border border-gray-200/60 dark:border-slate-800 p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
					<TrendingUp class="w-5 h-5 text-purple-600 dark:text-purple-400" />
				</div>
				<span class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Progress</span>
			</div>
			<p class="text-3xl font-bold text-gray-900 dark:text-white">--</p>
			<p class="text-xs text-gray-500 mt-1">Coming soon</p>
		</div>

		<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl border border-gray-200/60 dark:border-slate-800 p-5">
			<div class="flex items-center gap-3 mb-3">
				<div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
					<Clock class="w-5 h-5 text-amber-600 dark:text-amber-400" />
				</div>
				<span class="text-sm font-medium text-gray-600 dark:text-gray-400">Watch Time</span>
			</div>
			<p class="text-3xl font-bold text-gray-900 dark:text-white">--</p>
			<p class="text-xs text-gray-500 mt-1">Coming soon</p>
		</div>
	</div>

	<!-- Quick Actions & Recommendations -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Quick Actions -->
		<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl border border-gray-200/60 dark:border-slate-800 p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
			<div class="space-y-2">
				<button
					onclick={() => goto(ROUTES.PUBLIC.STORE)}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
				>
					<ShoppingBag class="w-5 h-5 text-blue-500" />
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-900 dark:text-white">Browse Courses</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Explore new learning opportunities</p>
					</div>
					<ArrowRight class="w-4 h-4 text-gray-400" />
				</button>

				<button
					onclick={() => goto(ROUTES.USER.MY_COURSES)}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
				>
					<GraduationCap class="w-5 h-5 text-indigo-500" />
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-900 dark:text-white">My Learning</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Continue where you left off</p>
					</div>
					<ArrowRight class="w-4 h-4 text-gray-400" />
				</button>

				<button
					onclick={() => goto(ROUTES.USER.INVOICES)}
					class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left"
				>
					<FileText class="w-5 h-5 text-green-500" />
					<div class="flex-1">
						<p class="text-sm font-medium text-gray-900 dark:text-white">View Invoices</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Download and review your purchases</p>
					</div>
					<ArrowRight class="w-4 h-4 text-gray-400" />
				</button>
			</div>
		</div>

		<!-- Recommendations Placeholder -->
		<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl border border-gray-200/60 dark:border-slate-800 p-6">
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
				<Sparkles class="w-5 h-5 text-amber-500" />
				Recommended for You
			</h2>
			<div class="flex flex-col items-center justify-center py-8 text-center">
				<div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
					<Sparkles class="w-8 h-8 text-amber-500" />
				</div>
				<p class="text-sm font-medium text-gray-900 dark:text-white mb-1">Personalized recommendations</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
					Smart course recommendations based on your learning history are coming soon.
				</p>
				<button
					onclick={() => goto(ROUTES.PUBLIC.STORE)}
					class="mt-4 px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all"
				>
					Explore Courses
				</button>
			</div>
		</div>
	</div>
</div>
