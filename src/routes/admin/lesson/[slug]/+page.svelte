<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { lessonStore } from '$lib/stores/lesson-store';
	import type { Lesson } from '$lib/types/lesson';

	let lesson: Lesson | null = null;
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			// Debug: Let's see what we're getting
			console.log('Page params:', $page.params);
			console.log('Page URL:', $page.url);
			console.log('Lesson ID:', $page.params.id);

			const lessonId = $page.params.id;

			if (!lessonId) {
				error = 'Lesson ID is missing from URL';
				return;
			}

			lesson = await lessonStore.findById(lessonId);

			if (!lesson) {
				error = 'Lesson not found';
			}
		} catch (err) {
			console.error('Error loading lesson:', err);
			error = err instanceof Error ? err.message : 'Failed to load lesson';
		} finally {
			loading = false;
		}
	});

	function goBack(): void {
		goto('/admin/lessons');
	}

	function editLesson(): void {
		if (lesson) {
			goto(`/admin/lesson/${lesson.id}/edit`);
		}
	}
</script>

{#if loading}
	<div class="flex justify-center items-center h-64">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
	</div>
{:else if error}
	<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
		<p>Error: {error}</p>
		<button
			on:click={goBack}
			class="mt-2 text-blue-500 hover:text-blue-700"
		>
			Go back to lessons
		</button>
	</div>
{:else if lesson}
	<div class="max-w-4xl mx-auto p-6">
		<!-- Breadcrumbs -->
		<nav class="mb-6">
			<button
				on:click={goBack}
				class="text-blue-500 hover:text-blue-700 flex items-center gap-2"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
				Back to Lessons
			</button>
		</nav>

		<!-- Lesson header -->
		<div class="mb-6">
			<h1 class="text-3xl font-bold mb-2">{lesson.title}</h1>
			{#if lesson.description}
				<p class="text-gray-600 text-lg">{lesson.description}</p>
			{/if}
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Lesson thumbnail -->
			<div class="aspect-video overflow-hidden rounded-lg shadow-lg">
				<img
					src={lesson.thumbnail || '/thumbnail.jpg'}
					alt={lesson.title}
					class="w-full h-full object-cover"
				/>
			</div>

			<!-- Lesson details -->
			<div class="space-y-4">
				<div>
					<h2 class="text-xl font-semibold mb-2">Lesson Details</h2>
					<div class="space-y-2">
						<div>
							<span class="font-medium">Duration:</span>
							<span class="ml-2">{lesson.duration || 'N/A'}</span>
						</div>
						<div>
							<span class="font-medium">Level:</span>
							<span class="ml-2">{lesson.level || 'N/A'}</span>
						</div>
						<div>
							<span class="font-medium">Created:</span>
							<span class="ml-2">{new Date(lesson.createdAt).toLocaleDateString()}</span>
						</div>
					</div>
				</div>

				<!-- Action buttons -->
				<div class="flex gap-2">
					<button
						on:click={editLesson}
						class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					>
						Edit Lesson
					</button>
					<button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
						Delete Lesson
					</button>
				</div>
			</div>
		</div>

		<!-- Lesson content -->
		{#if lesson.content}
			<div class="mt-8">
				<h2 class="text-2xl font-semibold mb-4">Content</h2>
				<div class="prose max-w-none">
					{@html lesson.content}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="text-center py-8">
		<p class="text-gray-500">Lesson not found</p>
		<button
			on:click={goBack}
			class="mt-2 text-blue-500 hover:text-blue-700"
		>
			Go back to lessons
		</button>
	</div>
{/if}