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
	import StickyFormHeader from '$lib/components/UI/StickyFormHeader.svelte';
	import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';
	import type { CourseCategory } from '$lib/types/entities/CourseCategory';
	import { ROUTES } from '$lib/Config/routes.config';

	// Type definitions
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

	interface SectionWithItems extends BaseSectionItem {
		id?: number;
		uuid?: string;
		title: string;
		description: string;
		orderIndex: number;
		items: Lesson[];
	}

	// Props
	let { courseId = page.params.id } = $props<{ courseId?: number }>();

	// State
	let course = $derived(courseStore.selectedItem);
	let isLoading = $derived(courseStore.loadingItem);
	let error = $derived(courseStore.itemError);
	let isSaving = $state(false);
	let formRef: any; // Section form ref
	let courseFormRef: any; // Course form ref
	let isCreateSectionModalOpen = $state<boolean>(false);

	// Form state for embedded course form
	let hasFormChanges = $state(false);
	let isFormValid = $state(true);
	let formErrors = $state<Record<string, string>>({});

	// Available course categories
	let courseCategories = $state<CourseCategory[]>([
		{ id: 1, name: 'Payments' },
		{ id: 2, name: 'Development' },
		{ id: 3, name: 'Design' },
		{ id: 4, name: 'Marketing' }
	]);

	// Schemas
	const courseFormSchema = $derived(CourseFormPresets.embedded(courseCategories));
	const createSectionFormSchema = $derived(CourseSectionFormPresets.standard());

	// Map course sections to component format
	let componentSections = $derived.by((): SectionWithItems[] => {
		if (!course) return [];
		return course.sections.map(section => ({
			...section,
			items: section.lessons
		}));
	});

	// Metadata items
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

	// Status colors for metadata card
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

	// Icons
	const bookIcon = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
	</svg>`;

	const usersIcon = `<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
		<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
	</svg>`;

	// Lifecycle
	onMount(async () => {
		await loadCourse();
	});

	async function loadCourse() {
		try {
			const data = await courseStore.fetchItem(courseId);
			console.log("[PAGE] Loaded Course Data:", data);

			// Sort sections and lessons
			data.sections.sort((a: CourseSection, b: CourseSection) => a.orderIndex - b.orderIndex);
			data.sections.forEach((section: CourseSection) => {
				section.lessons.sort((a: Lesson, b: Lesson) => a.orderIndex - b.orderIndex);
			});
		} catch (err) {
			console.error('Error loading course:', err);
		}
	}

	// Course form callbacks
	const courseFormCallbacks = {
		onSubmit: handleCourseSubmit,
		onChange: (field: string, value: any) => {
			console.log('[PAGE] Field changed:', field, value);
		},
		onValidate: (result: any) => {
			// Update validation state when form validates
			console.log('[PAGE] Validation callback - isValid:', result.isValid, 'errors:', result.errors);
			isFormValid = result.isValid;
			formErrors = result.errors || {};
		}
	};

	async function handleCourseSubmit(formData: Partial<Course>) {
		console.log("[PAGE] Course Form Submit:", formData);

		isSaving = true;
		try {
			// Call API to update course
			// await courseStore.updateItem(courseId, formData);

			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));

			toastService.success('Success', 'Terminal updated successfully');

			// Reset form to mark as saved - this clears dirty state
			courseFormRef?.reset(formData);

			// Explicitly set hasFormChanges to false after successful save
			hasFormChanges = false;
			console.log('[PAGE] Form saved, hasFormChanges set to false');
		} catch (error) {
			console.error('Error updating course:', error);
			toastService.error('Error', 'Failed to update terminal');
		} finally {
			isSaving = false;
		}
	}

	function handleFormDirtyChange(isDirty: boolean) {
		console.log('[PAGE] 🔔 onDirtyChange callback - isDirty:', isDirty);
		hasFormChanges = isDirty;

		// Also check validation state when dirty state changes
		if (courseFormRef) {
			const valid = courseFormRef.isFormValid();
			console.log('[PAGE] Validation check after dirty change - isValid:', valid);
			isFormValid = valid;
		}

		console.log('[PAGE] State updated - hasFormChanges:', hasFormChanges, 'isFormValid:', isFormValid);
	}

	function handleSaveClick() {
		console.log('[PAGE] 💾 Save clicked - hasChanges:', hasFormChanges, 'isValid:', isFormValid);

		if (courseFormRef && hasFormChanges) {
			// Check validation before submitting
			const valid = courseFormRef.isFormValid();
			console.log('[PAGE] Pre-submit validation check:', valid);

			if (valid) {
				console.log('[PAGE] ✅ Submitting form...');
				courseFormRef.submit();
			} else {
				console.log('[PAGE] Validation failed, showing error toast');
				toastService.error('Validation Error', 'Please fix the errors before saving');
			}
		} else {
			console.log('[PAGE] Cannot save - hasFormChanges:', hasFormChanges, 'formRef:', !!courseFormRef);
		}
	}

	function handleDiscardClick() {
		console.log('[PAGE] Discard clicked');
		if (courseFormRef && hasFormChanges) {
			if (confirm('Are you sure you want to discard all changes?')) {
				courseFormRef.discard();
				hasFormChanges = false;
				console.log('[PAGE] Changes discarded');
			}
		}
	}

	// Section management
	function handleAddSection() {
		isCreateSectionModalOpen = true;
	}

	function handleRemoveSection() {
		console.log("Handle remove Section");
	}

	const formCreateSectionCallbacks = {
		onSubmit: handleValidCourseSectionSubmit,
		onChange: (field: string, value: any) => {
			// Handle changes if needed
		}
	};

	async function handleValidCourseSectionSubmit(section: CourseSection) {
		console.log("[PAGE] Form Submit:", section);
		try {
			const courseSection = await courseStore.createSection(courseId, section);
			closeSectionModal();
			toastService.success('Success', 'Section was created successfully');
			console.log(courseSection);
		} catch (error) {
			console.error('Error creating Course Section:', error);
			toastService.error('Error', 'Failed to create section');
		}
	}

	function closeSectionModal() {
		isCreateSectionModalOpen = false;
		formRef?.reset();
	}

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
			<!-- DEBUG INFO -->
			<div class="mb-4 p-4 bg-gray-100 rounded text-xs font-mono">
				<div class="font-bold mb-2">🐛 Debug Info:</div>
				<div>hasFormChanges: <span class="font-bold {hasFormChanges ? 'text-orange-600' : 'text-green-600'}">{hasFormChanges}</span></div>
				<div>isFormValid: <span class="font-bold {isFormValid ? 'text-green-600' : 'text-red-600'}">{isFormValid}</span></div>
				<div>errorCount: <span class="font-bold {Object.keys(formErrors).length > 0 ? 'text-red-600' : 'text-green-600'}">{Object.keys(formErrors).length}</span></div>
				<div>isSaving: <span class="font-bold">{isSaving}</span></div>
				<div class="mt-2 text-xs text-gray-600">
					{#if !hasFormChanges}
						✅ No changes detected
					{:else if !isFormValid}
						❌ Has changes but form is invalid ({Object.keys(formErrors).length} errors)
					{:else}
						🟠 Has valid changes - Save button should be enabled
					{/if}
				</div>
				{#if Object.keys(formErrors).length > 0}
					<div class="mt-2 pt-2 border-t border-gray-300">
						<div class="font-bold mb-1">Errors:</div>
						{#each Object.entries(formErrors) as [field, error]}
							<div class="text-red-600">• {field}: {error}</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Sticky Action Header -->
			<StickyFormHeader
				title="Edit Terminal"
				subtitle={course.name}
				backUrl={ROUTES.ADMIN.COURSE}
				hasChanges={hasFormChanges}
				isSaving={isSaving}
				isValid={isFormValid}
				errors={formErrors}
				onSave={handleSaveClick}
				onDiscard={handleDiscardClick}
			/>

			<!-- Metadata Card -->
			<MetadataCard
				title="Terminal Metadata"
				subtitle="System information"
				icon={bookIcon}
				badge={{
					text: `${course.students || 0} Students`,
					icon: usersIcon
				}}
				items={metadataItems}
				columns={4}
				gradientFrom={statusColors.from}
				gradientTo={statusColors.to}
			/>

			<!-- Embedded Form for Course Details -->
			<UniversalForm
				bind:this={courseFormRef}
				schema={courseFormSchema}
				initialData={course}
				callbacks={courseFormCallbacks}
				mode="embedded"
				onDirtyChange={handleFormDirtyChange}
			/>

			<!-- Course Sections -->
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
			/>
		{/if}
	</div>
</div>

<!-- Create Section Modal -->
<UniversalCreateModal
	isOpen={isCreateSectionModalOpen}
	title="Create Terminal Section"
	subtitle="Add a new section to organize lessons"
	icon={Link2}
	iconBgColor="from-blue-500 to-indigo-600"
	loading={courseStore.loading}
	error={courseStore.error}
	submitLabel="Create Section"
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