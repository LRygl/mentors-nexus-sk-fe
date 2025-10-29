<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { courseStore } from '$lib/stores/defaults/CourseStore';
	import MetadataCard, { type MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import SectionManager, { type BaseSectionItem } from '$lib/components/SectionManager.svelte';
	import { Link2, type Section } from 'lucide-svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import { CourseSectionFormPresets } from '$lib/components/Forms/Schemas/CourseSectionFromSchema';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import StickyFormHeader from '$lib/components/UI/StickyFormHeader.svelte';
	import { CourseFormPresets } from '$lib/components/Forms/Schemas/CourseFormSchema';
	import { ROUTES } from '$lib/Config/routes.config';
	import { CourseStatus, getCourseStatusColor } from '$lib/types/enums/CourseStatus';
	import type { CourseSection } from '$lib/types/entities/CourseSection';
	import type { Lesson } from '$lib/types/entities/Lesson';
	import type { Course } from '$lib/types/entities/Course';
	import { courseCategoryStore } from '$lib/stores/defaults/CourseCategoryStore';
	import { userStore } from '$lib/stores/defaults/UserStore';
	import { CourseLinkFormPresets } from '$lib/components/Forms/Schemas/CourseLinkLessonSchema';
	import { lessonStore } from '$lib/stores/defaults/LessonStore';
	import ImageUpload from '$lib/components/Forms/Fields/ImageUpload.svelte';

	interface SectionWithItems extends BaseSectionItem {
		id?: string;
		uuid?: string;
		title: string;
		description: string;
		orderIndex: number;
		items: Lesson[];
	}

	// Props
	let { courseId = page.params.id } = $props<{ courseId?: string }>();

	// State
	let course = $derived(courseStore.selectedItem);
	let isLoading = $derived(courseStore.loadingItem);
	let error = $derived(courseStore.itemError);
	let isSaving = $state(false);
	let formRef: UniversalForm; // Section form ref
	let courseFormRef: UniversalForm; // Course form ref
	let linkFormRef: UniversalForm;
	let isCreateSectionModalOpen = $state<boolean>(false);
	let isLinkLessonModalOpen = $state<boolean>(false);

	let courseCategories = $derived(courseCategoryStore.data);
	let users = $derived(userStore.data);
	let lessons = $derived(lessonStore.data);

	// Form state for embedded course form
	let hasFormChanges = $state(false);
	let isFormValid = $state(true);
	let formErrors = $state<Record<string, string>>({});


	// Transform Category categoryIds to strings for the form
	let formInitialData = $derived.by(() => {
		if (!course) return null;

		return {
			...course,
			categoryIds: course.categoryIds?.map(id => String(id)),
			ownerId: course.owner?.id
		};
	});

	// Schemas
	const courseFormSchema = $derived(CourseFormPresets.embedded(courseCategories, users));
	const createSectionFormSchema = $derived(CourseSectionFormPresets.standard());
	const linkLessonFormSchema = $derived(CourseLinkFormPresets.link(lessons));

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

	let status = $derived(course?.status as CourseStatus ?? CourseStatus.DRAFT);
	let statusColors = $derived(getCourseStatusColor(status));

	// Icons
	const bookIcon = `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
	</svg>`;

	const usersIcon = `<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
		<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
	</svg>`;

	// Lifecycle
	onMount(async () => {
		await Promise.all([
			loadCourse(),
			loadCategories(),
			loadUsers(),
			loadLessons(),
		]);
	});

	async function loadCourse() {
		try {
			const data = await courseStore.fetchItem(courseId);
			// Sort sections and lessons
			data.sections.sort((a: CourseSection, b: CourseSection) => a.orderIndex - b.orderIndex);
			data.sections.forEach((section: CourseSection) => {
				section.lessons.sort((a: Lesson, b: Lesson) => a.orderIndex - b.orderIndex);
			});
		} catch (err) {
			console.error('Error loading course:', err);
		}
	}

	async function loadCategories() {
		try {
			await courseCategoryStore.fetchAll();
		} catch (err) {
			toastService.error('Error', 'Failed to load course categories');
		}
	}

	// TODO Return only elegible users for this select
	async function loadUsers() {
		try {
			await userStore.fetchAll();
			console.log(users);
		} catch (err) {
			console.error('Error loading users:', err);
		}
	}

	async function loadLessons() {
		try {
			await lessonStore.fetchAll();
			console.log(lessons);
		} catch (err) {
			console.error('Error loading lessons:', err);
		}
	}

	// Course form callbacks
	const courseFormCallbacks = {
		onSubmit: handleCourseSubmit,
		onChange: (field: string, value: any) => {
		},
		onValidate: (result: any) => {
			// Update validation state when form validates
			isFormValid = result.isValid;
			formErrors = result.errors || {};
		}
	};

	const formLinkLessonCallbacks = {
		onSubmit: handleLinkSubmit,
		onChange: (field: string, value: any) => {}
	}

	async function handleLinkSubmit(formData: FormData) {
		console.log("FORM SUBMITTED: ", formData);

	}

	async function handleCourseSubmit(formData: Partial<Course>) {

		if (!courseId) {
			toastService.error('Error', 'Course ID not found');
			return;
		}

		isSaving = true;
		try {
			// Convert categoryIds from strings to numbers for backend
			const apiData = {
				...formData,
				categoryIds: formData.categoryIds?.map(id =>
					typeof id === 'string' ? parseInt(id, 10) : id
				),
				published: formData.published
					? new Date(formData.published).toISOString()
					: null,
				courseOwnerId: formData.ownerId,
			};

			const courseIdStr = typeof courseId === 'number' ? courseId.toString() : courseId;
			await courseStore.update(courseIdStr, apiData);

			toastService.success('Success', 'Course updated successfully');
			courseFormRef?.reset(formData);
			hasFormChanges = false;
		} catch (error) {
			toastService.error('Error', 'Failed to update course');
		} finally {
			isSaving = false;
		}
	}


	async function handleSectionReorder(reorderedSections: SectionWithItems[]) {
		// Extract section IDs in the new order
		const sectionIds = reorderedSections
			.map(section => {
				// Get the ID (convert string to number if needed for backend)
				const id = section.id || section.uuid;
				return id ? (typeof id === 'string' ? parseInt(id, 10) : id) : null;
			})
			.filter((id): id is number => id !== null); // Remove nulls and type guard

		if (sectionIds.length === 0) {
			toastService.error('Error', 'No valid section IDs found');
			return;
		}

		try {
			await courseStore.reorderSections(courseId, sectionIds);
		} catch (error) {
			console.error('[PAGE] Error reordering sections:', error);
		}
	}

	function handleFormDirtyChange(isDirty: boolean) {
		hasFormChanges = isDirty;

		// Also check validation state when dirty state changes
		if (courseFormRef) {
			const valid = courseFormRef.isFormValid();
			isFormValid = valid;
		}
	}

	function handleSaveClick() {

		if (courseFormRef && hasFormChanges) {
			// Check validation before submitting
			const valid = courseFormRef.isFormValid();

			if (valid) {
				courseFormRef.submit();
			} else {
				toastService.error('Validation Error', 'Please fix the errors before saving');
			}
		} else {
			console.log('[PAGE] Cannot save - hasFormChanges:', hasFormChanges, 'formRef:', !!courseFormRef);
		}
	}

	function handleDiscardClick() {
		if (courseFormRef && hasFormChanges) {
			if (confirm('Are you sure you want to discard all changes?')) {
				courseFormRef.discard();
				hasFormChanges = false;
			}
		}
	}




	function handleAddLesson(section: Section, sectionIndex: number) {
		console.log('[PAGE] Add lesson for section:', section.id);
		isLinkLessonModalOpen = true;

	}




	/**
	 *
	 * HANDLE COURSE SECTION FORM
	 *
	 * **/
	const formCreateSectionCallbacks = {
		onSubmit: handleValidCourseSectionSubmit,
		onChange: (field: string, value: any) => {
			// Handle changes if needed
		}
	};

	async function handleValidCourseSectionSubmit(section: CourseSection) {
		try {
			const courseSection = await courseStore.createSection(courseId, section);
			closeSectionModal();
			toastService.success('Success', 'Section was created successfully');
		} catch (error) {
			toastService.error('Error', 'Failed to create section');
		}
	}

	async function handleRemoveSection(section: Section, index: number) {
		try {
			await courseStore.deleteSection(section.id);
		}	catch (error) {
			console.error(error);
		}
	}

	function handleAddSection() {
		isCreateSectionModalOpen = true;
	}

	function closeSectionModal() {
		isCreateSectionModalOpen = false;
		formRef?.reset();
	}

	function handleCourseSectionSubmit(event: Event) {
		event.preventDefault();
		formRef?.submit();

	}

	function closeLinkModal() {
		isLinkLessonModalOpen = false;
		linkFormRef?.reset();
	}

	function handleLinkLessonSubmit(event: Event) {
		event.preventDefault();
		linkFormRef?.submit();
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
				initialData={formInitialData}
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
				onSectionsReorder={handleSectionReorder}
				onItemsReorder={(sectionIndex, items) => { console.log('New items order:', items); }}
				onAddSection={handleAddSection}
				onDeleteSection={handleRemoveSection}
				onAddItem={handleAddLesson}
				onDeleteItem={handleRemoveSection}
			/>
		{/if}
	</div>

	Users

	Price history
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

<!-- link modal -->
<UniversalCreateModal
	isOpen={isLinkLessonModalOpen}
	title="Link entity"
	subtitle="Add a new section to organize lessons"
	icon={Link2}
	iconBgColor="from-blue-500 to-indigo-600"
	loading={lessonStore.loading}
	error={lessonStore.error}
	submitLabel="Create Section"
	onclose={closeLinkModal}
	onsubmit={handleLinkLessonSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={linkFormRef}
			schema={linkLessonFormSchema}
			callbacks={formLinkLessonCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>


