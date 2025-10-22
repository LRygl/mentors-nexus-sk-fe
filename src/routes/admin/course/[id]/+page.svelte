<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { courseStore } from '$lib/stores/defaults/CourseStore';
	import MetadataCard, { type MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import SectionManager, { type BaseSectionItem } from '$lib/components/SectionManager.svelte';
	import { Link2 } from 'lucide-svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseSectionFormPresets } from '$lib/components/Forms/Schemas/CourseSectionFromSchema';
	import { toastService } from '$lib/Services/ToastService.svelte';

	// TODO Define new form type - embedded with the style of the current page sections and form items

	// TODO move to separate file
	// Type definitions matching your Spring Boot backend
	interface Owner {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
	}

	interface Lesson {
		id?: number;
		uuid?: string;
		title: string;
		description: string;
		videoUrl?: string | null;
		duration?: string;
		orderIndex: number;
	}

	interface CourseSection {
		id?: number;
		uuid?: string;
		title: string;
		description: string;
		orderIndex: number;
		lessons: Lesson[];
	}

	interface Course {
		id?: number;
		uuid?: string;
		created?: string;
		updated?: string | null;
		published?: string | null;
		price: number;
		status: string;
		name: string;
		labels: string[];
		categories: string[];
		owner: Owner;
		sections: CourseSection[];
		students?: number;
	}

	// Type for component (with 'items')
	interface SectionWithItems extends BaseSectionItem {
		id?: number;
		uuid?: string;
		title: string;
		description: string;
		orderIndex: number;
		items: Lesson[];
	}

	// Map course.sections to component format
	let componentSections = $derived.by((): SectionWithItems[] => {
		if (!course) return [];
		return course.sections.map(section => ({
			...section,
			items: section.lessons  // Map lessons → items
		}));
	});

	let formRef: any;
	let isCreateSectionModalOpen = $state<boolean>(false);

	const createSectionFormSchema = $derived(CourseSectionFormPresets.standard());


	// Icon definitions
	const bookIcon = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
</svg>`;

	const usersIcon = `<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
</svg>`;

	// Props - you'd pass the course ID from your route params
	let { courseId = page.params.id } = $props<{ courseId?: number }>();

	// State management
	let originalCourse = $state<Course | null>(null);
	let course = $derived(courseStore.selectedItem);
	let isLoading = $derived(courseStore.loadingItem);
	let isSaving = $state(false);
	let error = $derived(courseStore.itemError);

	// Check if course has been modified
	let hasChanges = $derived(
		course && originalCourse && JSON.stringify(course) !== JSON.stringify(originalCourse)
	);

	// Derived metadata items
	let metadataItems = $derived.by((): MetadataItemConfig[] => {
		if (!course) return [];

		return [
			{
				label: 'ID',
				value: course.id || 0,
				type: 'number',
				canCopy: true
			},
			{
				label: 'UUID',
				value: course.uuid || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Created',
				value: course.created || '',
				type: 'datetime'
			},
			{
				label: 'Last Updated',
				value: course.updated || 'Never',
				type: course.updated ? 'datetime' : 'text'
			}
		];
	});
	const statusOptions = ['DRAFT', 'UNPUBLISHED', 'PUBLISHED'];

	onMount(async () => {
		await loadCourse();
	});

	async function loadCourse() {
		isLoading = true;
		error = null;

		try {
			// Replace with your actual API endpoint
			const data = await courseStore.fetchItem(courseId);
			console.log("[PAGE] Loaded Course Data: ",data);

			// Sort sections by orderIndex
			data.sections.sort((a: CourseSection, b: CourseSection) => a.orderIndex - b.orderIndex);

			// Sort lessons within each section
			data.sections.forEach((section: CourseSection) => {
				section.lessons.sort((a: Lesson, b: Lesson) => a.orderIndex - b.orderIndex);
			});

			originalCourse = JSON.parse(JSON.stringify(data));
			course = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			isLoading = false;
		}
	}

	async function saveCourse() {
		if (!course) return;

		isSaving = true;
		error = null;

		try {
			const response = await fetch(`/api/courses/${courseId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(course),
			});

			if (!response.ok) {
				throw new Error('Failed to save course');
			}

			const updatedCourse = await response.json();
			originalCourse = JSON.parse(JSON.stringify(updatedCourse));
			course = updatedCourse;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save course';
		} finally {
			isSaving = false;
		}
	}

	function discardChanges() {
		if (!originalCourse) return;

		if (confirm('Are you sure you want to discard all changes?')) {
			course = JSON.parse(JSON.stringify(originalCourse));
		}
	}


	function updateCourseField(field: keyof Course, value: any) {
		if (!course) return;
		course = { ...course, [field]: value };
	}

	function formatPrice(price: number): string {
		return new Intl.NumberFormat('cs-CZ', {
			style: 'currency',
			currency: 'CZK',
		}).format(price);
	}

	let statusColors = $derived(course ? getStatusColors(course.status) : { from: 'slate-800', to: 'slate-700' });

	function getStatusColors(status: string) {
		switch (status) {
			case 'PUBLISHED':
				return { from: 'emerald-500', to: 'emerald-600' };
			case 'DRAFT':
				return { from: 'amber-500', to: 'amber-600' };
			case 'UNPUBLISHED':
				return { from: 'slate-500', to: 'slate-600' };
			default:
				return { from: 'slate-800', to: 'slate-700' };
		}
	}

	function handleAddSection() {
		isCreateSectionModalOpen = true;
	}

	function handleRemoveSection() {
		console.log("Handle remove Section");
	}

	// Form callbacks - validation is handled by UniversalForm
	const formCreateSectionCallbacks = {
		onSubmit: handleValidCourseSectionSubmit,         // CHANGE: point to new function
		onChange: (field: string, value: any) => {
			if (field === 'isPublished' && !value) {
				// Clear category if needed
			}
		}
	};

	async function handleValidCourseSectionSubmit(section: CourseSection) {
		console.log("[PAGE] Form Submit: ",section);
		try {
			const courseSection = await courseStore.createSection(courseId, section);
			closeSectionModal();
			toastService.success('Success',`Section was created successfully`);
			console.log(courseSection);

		} catch (error) {
			console.error('Error creating Course Section:', error);
		}
	}

	function closeSectionModal() {
		isCreateSectionModalOpen = false;
		formRef?.reset();
	}

	// Modal submit
	function handleCourseSectionSubmit(event: Event) {
		event.preventDefault();
		formRef?.submit();
	}

</script>

<div class="min-h-screen py-8">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
			</div>
		{:else if error}
			<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
				<p class="text-red-800">{error}</p>
				<button
					onclick={loadCourse}
					class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
				>
					Try again
				</button>
			</div>
		{:else if course}
			<!-- Sticky Action Bar -->
			<div class="sticky top-0 z-50 mb-6">
				<div class="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg px-6 py-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-4">
							<a href="/courses" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
								<svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
								</svg>
							</a>
							<div>
								<h1 class="text-xl font-bold text-slate-900">Edit Terminal</h1>
								<p class="text-sm text-slate-500">{course.name}</p>
							</div>
						</div>

						<div class="flex items-center gap-3">
							{#if hasChanges}
								<div class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
									<div class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
									<span class="text-sm font-medium text-amber-700">Unsaved changes</span>
								</div>
							{/if}

							<button
								onclick={discardChanges}
								disabled={!hasChanges}
								class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
							>
								Discard
							</button>
							<button
								onclick={saveCourse}
								disabled={isSaving || !hasChanges}
								class="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
							>
								{isSaving ? 'Saving...' : 'Save Changes'}
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Metadata Card -->
			<MetadataCard
				title="Terminal Metadata"
				subtitle="System information"
				icon={bookIcon}
				badge={{
          text: `${course.students || 0} Students`,
          icon: usersIcon
        }}				items={metadataItems}
				columns={4}
				gradientFrom={statusColors.from}
				gradientTo={statusColors.to}
			/>

			<!-- Course Details -->
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<h2 class="text-xl font-bold text-slate-900 mb-6">Terminal Details</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Terminal Name</label>
						<input
							type="text"
							value={course.name}
							oninput={(e) => updateCourseField('name', e.currentTarget.value)}
							class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Price</label>
						<input
							type="number"
							value={course.price}
							oninput={(e) => updateCourseField('price', parseFloat(e.currentTarget.value))}
							step="0.01"
							class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
						/>
						<p class="text-sm text-slate-500 mt-1">{formatPrice(course.price)}</p>
					</div>

					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Labels</label>
						<input
							type="text"
							value={course.labels.join(', ')}
							oninput={(e) => updateCourseField('labels', e.currentTarget.value.split(',').map(l => l.trim()).filter(l => l))}
							placeholder="Comma-separated labels"
							class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Categories</label>
						<input
							type="text"
							value={course.categories.join(', ')}
							oninput={(e) => updateCourseField('categories', e.currentTarget.value.split(',').map(c => c.trim()).filter(c => c))}
							placeholder="Comma-separated categories"
							class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
						/>
					</div>
				</div>
			</div>

			<!-- Publishing Section -->
			<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
				<h2 class="text-xl font-bold text-slate-900 mb-6">Publishing</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Status</label>
						<select
							value={course.status}
							onchange={(e) => updateCourseField('status', e.currentTarget.value)}
							class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow bg-white"
						>
							{#each statusOptions as status}
								<option value={status}>{status}</option>
							{/each}
						</select>
					</div>

					<div>
						<label class="block text-sm font-medium text-slate-700 mb-2">Publish Date</label>
						<input
							type="datetime-local"
							value={course.published ? new Date(course.published).toISOString().slice(0, 16) : ''}
							onchange={(e) => updateCourseField('published', e.currentTarget.value ? new Date(e.currentTarget.value).toISOString() : null)}
							class="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
						/>
					</div>
				</div>
			</div>


			<!-- START Course Sections Component -->
			<SectionManager
				sections={componentSections}
				sectionTitle="Terminal Sections"
				itemTitle="Lesson"
				showSectionDescription={true}
				collapsible={true}
				defaultExpanded={false}
				onSectionsReorder={(newSections) => { console.log('New section order:', newSections); }}
				onItemsReorder={(sectionIndex, items) => { console.log('New items order:', items); }}
				onAddSection={handleAddSection}
				onDeleteSection={handleRemoveSection}
				onAddItem={handleAddSection}
				onDeleteItem={handleRemoveSection}
			>
			</SectionManager>
			<!-- END Course Sections Component -->

		{/if}
	</div>
</div>



<!-- Create Link FAQ Modal -->
<UniversalCreateModal
	isOpen={isCreateSectionModalOpen}
	title="Link Category to FAQ"
	subtitle="Link existing FAQ Category"
	icon={Link2}
	iconBgColor="from-blue-500 to-indigo-600"
	loading={courseStore.loading}
	error={courseStore.error}
	submitLabel="Link FAQ Category"
	onclose={closeSectionModal}
	onsubmit={handleCourseSectionSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={createSectionFormSchema}
			callbacks={formCreateSectionCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>