<script lang="ts">

	import type { User } from '$lib/types/entities/User';
	import { ROUTES } from '$lib/Config/routes.config';
	import { API_CONFIG } from '$lib/API/APIConfiguration';
	import EntityDetailsSection from '$lib/components/EntityDetailsSection.svelte';
	import { getCourseStatusColors } from '$lib/Config/UIConstants';
	import type { MetadataConfig } from '$lib/types/Components/MetadataConfig';
	import { BookIcon } from '@lucide/svelte';
	import { UserFormPresets } from '$lib/components/Forms/Schemas/User/UserFormSchema';
	import type { MetadataItemConfig } from '$lib/components/Analytics/MetadataCard.svelte';
	import { lessonStore } from '$lib/stores/defaults/LessonStore';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import { goto } from '$app/navigation';
	import { confirmationModal } from '$lib/components/Modals/ConfirmationModalService.svelte';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import type { Course } from '$lib/types/entities/Course';
	import { enrollmentAdminAPI, EnrollmentAdminAPI } from '$lib/API/Admin/EnrollmentAdminAPI';
	import { enrollmentStore } from '$lib/stores/defaults/EnrollmentStore.svelte';
	import type { CourseEnrollment, EnrolledCourseDTO } from '$lib/types/entities/CourseEnrollment';
	import {
		CourseTableEnrollmentPreset
	} from '$lib/components/Data Table/Configurations/CourseTableEnrollmentConfiguration';
	import CollapsibleSection from '$lib/components/Component/CollapsibleSection.svelte';
	import { FileText } from 'lucide-svelte';
	import UniversalForm from '$lib/components/Forms/UniversalForm.svelte';
	import UniversalCreateModal from '$lib/components/UI/UniversalCreateModal.svelte';
	import { EnrollUserToCoursePresets } from '$lib/components/Forms/Schemas/CourseEnrollUserSchema';
	import { courseStore } from '$lib/stores/defaults/CourseStore.svelte';
	import { onMount, untrack } from 'svelte';

	interface Props {
		topic: User;
		onUpdate: (formData: Partial<User>) => Promise<void>;
	}
	// Check if we have valid data

	let { topic, onUpdate }: Props = $props();
	let selectedItems = $state<Set<string>>(new Set());
	let data = $derived(enrollmentAdminAPI.getEnrolledCourseIds(topic.id))
	let statusColors = $derived(getCourseStatusColors('DRAFT'));
	let isInitialized = $state(false);
	let hasData = $derived(topic && topic.id !== undefined);
	// =========================================================================
	// INITIALIZATION - Runs once on mount
	// =========================================================================
	onMount(async () => {
		if (!isInitialized) {
			isInitialized = true;

			// Load all courses once
			if (courseStore.data.length === 0) {
				await courseStore.fetchAll();
			}
			allCourses = courseStore.data;

			// Load user enrollments
			if (topic.id) {
				enrolledCourses = await enrollmentStore.getEnrolledCourses(topic.id);
			}
		}
	});
	// =========================================================================
	// FORM SCHEMA DEFINITION
	// =========================================================================

	let formSchema = $derived(UserFormPresets.embedded());
	let formInitialData = $derived.by(() => ({
		...topic,
	}));

	// =========================================================================
	// ENROLLMENT DATA
	// =========================================================================

	let enrolledCourses = $state<EnrolledCourseDTO[]>([]);
	let allCourses = $state<Course[]>([]);

	// Compute available courses from enrolled and all courses
	let availableCourses = $derived.by(() => {
		if (allCourses.length === 0) return [];

		const enrolledCourseIds = new Set(
			enrolledCourses.map(e => String(e.courseId))
		);

		return allCourses.filter(course =>
			!enrolledCourseIds.has(String(course.id))
		);
	});

	// Dynamically create enrollment schema with available courses
	let enrollUserSchema = $derived.by(() => {
		console.log('[UserEdit] Creating schema with courses:', availableCourses.length);
		return EnrollUserToCoursePresets.link(availableCourses);
	});

	// Effect 2: Load user's enrolled courses (runs when topic.id changes)
	$effect(() => {
		// Only track topic.id changes
		if (topic.id && isInitialized) {
			untrack(async () => {
				// Reload enrollments when user changes
				enrolledCourses = await enrollmentStore.getEnrolledCourses(topic.id);
			});
		}
	});

	// =========================================================================
	// METADATA
	// =========================================================================

	let metadata = $derived.by((): MetadataConfig => ({
		title: 'User Metadata',
		subtitle: 'System information and statistics',
		icon: BookIcon,
		columns: 4,
		items: buildMetadataItems()
	}));

	let isCreateModalOpen = $state<boolean>(false);
	let formRef: any;
	const tableConfig = CourseTableEnrollmentPreset.all();

	function buildMetadataItems(): MetadataItemConfig[] {
		if (!topic) return [];

		return [
			{
				label: 'ID',
				value: topic.id || 0,
				type: 'number',
				canCopy: true
			},
			{
				label: 'UUID',
				value: topic.uuid || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Role',
				value: topic.role || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Active',
				value: topic.isAccountNonLocked || '',
				type: 'text',
				canCopy: true
			},
			{
				label: 'Last Login',
				value: topic.lastLoginDateDisplay || '',
				type: 'datetime',
				canCopy: true
			},
			{
				label: 'Register Date',
				value: topic.registerDate || '',
				type: 'datetime',
				canCopy: true
			},

		];
	}

	// =========================================================================
	// TABLE CONFIGURATION
	// =========================================================================

	const tableCallbacks: TableCallbacks<CourseEnrollment> = {
		onRowClick: async (enrollment) => {
			await goto(`${ROUTES.ADMIN.COURSE}/${enrollment.course.id}`);
		},

		onAction: async (actionId, enrollment) => {
			switch (actionId) {
				case 'view':
					await goto(`${ROUTES.ADMIN.COURSE}/${enrollment.courseId}`);
					break;
				case 'delete':
					const confirmed = await confirmationModal.delete(
						`Unenroll User from Course?`,
						`Are you sure you want to unenroll the user from ${enrollment.courseName}?`
					);
					if (confirmed) {
						try {
							// ✅ Use optimistic update - row disappears instantly
							await enrollmentStore.unenrollUserFromCourse(topic.id, enrollment.courseId);

							// ✅ Update local state
							enrolledCourses = enrolledCourses.filter(e => e.courseId !== enrollment.courseId);

							toastService.success('User Unenrolled', 'User successfully unenrolled from course');
						} catch (error) {
							// ✅ On error, refresh to restore correct state
							enrolledCourses = await enrollmentStore.getEnrolledCourses(topic.id, true);
							toastService.error('Failed to unenroll user:', `${error}`);
						}
					}
					break;
			}
		},

		onCreate: () => {
			createModal();
		}
	}


	// =========================================================================
	// MODAL MANAGEMENT
	// =========================================================================

	async function createModal() {
		console.log('[UserEdit] Opening enrollment modal', {
			allCourses: allCourses.length,
			enrolledCourses: enrolledCourses.length,
			availableCourses: availableCourses.length
		});

		// ✅ Ensure we have fresh enrollment data before opening modal
		if (topic.id) {
			try {
				enrolledCourses = await enrollmentStore.getEnrolledCourses(topic.id);
				console.log('[UserEdit] Refreshed enrollments, available courses:', availableCourses.length);
			} catch (error) {
				console.error('[UserEdit] Failed to refresh enrollments:', error);
			}
		}

		isCreateModalOpen = true;
	}

	async function handleValidFormSubmit(data: { courseId: string }) {
		try {
			console.log('[UserEdit] Enrolling user in course:', data.courseId);
			// Find the course to get its name for optimistic update
			const course = allCourses.find(c => c.id === data.courseId);
			const courseName = course?.name || 'Unknown Course';

			// Refresh enrolled courses - availableCourses updates automatically
			await enrollmentStore.enrollUserInCourse(topic.id, data.courseId, courseName);
			// Update local state with fresh data
			enrolledCourses = await enrollmentStore.getEnrolledCourses(topic.id, true);


			closeCreateModal();
			toastService.success('User Enrolled', 'User successfully enrolled in course');
		} catch (error) {
			console.error('[UserEdit] Failed to enroll user:', error);
			toastService.error('Enrollment Failed', `${error}`);
		}
	}


	function closeCreateModal() {
		isCreateModalOpen = false;
		formRef?.reset();
	}

	const formCallbacks = {
		onSubmit: handleValidFormSubmit,
		onChange: (field: string, value: any) => {

		}
	};

	// Modal submit
	function handleModalSubmit(event: Event) {
		event.preventDefault()
		formRef?.submit();
	}

</script>
{#if hasData}
<EntityDetailsSection
	entity={topic}
	entityName="Enrollment"
	formSchema={formSchema}
	{formInitialData}
	backUrl={ROUTES.ADMIN.LESSON}
	{metadata}
	gradientFrom={statusColors.from}
	gradientTo={statusColors.to}
	{onUpdate}
	imageBaseUrl={API_CONFIG.FULL_BASE_URL+API_CONFIG.ENDPOINTS.ADMIN.USER}
/>
{:else}
	<div class="flex items-center justify-center py-12">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
	</div>
{/if}
<CollapsibleSection
	title="Enrolled Courses"
	description="Courses this user is currently enrolled in"
	icon="📚"
	variant="default"
	collapsible={true}
	collapsed={false}
>
	<UniversalDataTable
		data={enrolledCourses}
		loading={enrollmentStore.loading}
		error={enrollmentStore.error}
		config={tableConfig.config}
		columns={tableConfig.columns}
		callbacks={tableCallbacks}
		bind:selectedItems={selectedItems}
		getActions={tableConfig.getActions}
		{...tableConfig.props}
	/>
</CollapsibleSection>

<!-- Create Category Modal -->
<UniversalCreateModal
	isOpen={isCreateModalOpen}
	title="Create Course"
	subtitle="Add a new course"
	icon={FileText}
	iconBgColor="from-indigo-500 to-purple-600"
	loading={lessonStore.creating}
	error={lessonStore.createError}
	submitLabel="Create"
	onclose={closeCreateModal}
	onsubmit={handleModalSubmit}
>
	{#snippet children()}
		<UniversalForm
			bind:this={formRef}
			schema={enrollUserSchema}
			callbacks={formCallbacks}
			className="space-y-6"
		/>
	{/snippet}
</UniversalCreateModal>