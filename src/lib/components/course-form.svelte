<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Select from "$lib/components/ui/select/index";
	import TagInput from "$lib/components/ui/tag-input.svelte";
	import { createCourse } from "$lib/api/course-api";
	import { users, isSubmitting } from "$lib/stores/user-store";
	import { createFormData, validateForm } from "$lib/utils/form-utils";
	import type { CourseFormData, CourseResponse } from "$lib/types/course";

	interface Props {
		onSuccess?: (result: CourseResponse) => void;
		onCancel?: () => void;
	}

	const selectedUserLabel = $derived(
		$users.data.find((user) => user.id.toString() === formData.courseOwnerId)?.lastName ?? "Select a course owner"
	);

	let { onSuccess, onCancel }: Props = $props();
	let formData = $state<CourseFormData>(createFormData());
	// Create the selected object structure that shadcn-svelte expects

	// Create the trigger content that shows the selected user
	const triggerContent = $derived(
		$users.data.find((user) => user.id.toString() === formData.courseOwnerId)
			? `${$users.data.find((user) => user.id.toString() === formData.courseOwnerId)?.lastName} ${$users.data.find((user) => user.id.toString() === formData.courseOwnerId)?.firstName} (${$users.data.find((user) => user.id.toString() === formData.courseOwnerId)?.email})`
			: "Select a course owner"
	);

	async function handleSubmit(): Promise<void> {
		if (!validateForm(formData)) return;

		try {
			$isSubmitting = true;
			const result = await createCourse(formData);
			console.log('Course created successfully:', result);

			// Reset form
			formData = createFormData();

			// Call success callback
			onSuccess?.(result);
		} catch (error) {
			console.error('Error creating course:', error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			alert(`Error creating course: ${errorMessage}`);
		} finally {
			$isSubmitting = false;
		}
	}


</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<!-- Course Name -->
	<div class="space-y-2">
		<Label for="name">Course Name</Label>
		<Input
			id="name"
			bind:value={formData.name}
			placeholder="Enter course name"
			required
		/>
	</div>

	<!-- Price -->
	<div class="space-y-2">
		<Label for="price">Price</Label>
		<Input
			id="price"
			type="number"
			bind:value={formData.price}
			placeholder="Enter price"
			min="0"
			step="1"
			required
		/>
	</div>

	<!-- Labels -->
	<TagInput
		label="Labels"
		placeholder="Add a label"
		id="labels"
		bind:items={formData.labels}
	/>

	<!-- Categories -->
	<TagInput
		label="Categories"
		placeholder="Add a category"
		id="categories"
		bind:items={formData.categories}
	/>

	<!-- Course Owner -->
	<div class="space-y-2">
		<Label for="courseOwner">Course Owner</Label>
		<Select.Root type="single" bind:value={formData.courseOwnerId}>
			<Select.Trigger class="w-full">
				{triggerContent}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Course Owners</Select.Label>
					{#each $users as user (user.id)}
						<Select.Item
							value={user.id.toString()}
							label={user.lastName + " " + user.firstName + " (" + user.email + ")"}
						>
							{user.lastName} {user.firstName} ({user.email})
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex gap-2 justify-end">
		<Button type="button" variant="outline" onclick={() => onCancel?.()}>
			Cancel
		</Button>
		<Button
			type="submit"
			disabled={$isSubmitting || !validateForm(formData)}
		>
			{#if $isSubmitting}
				Creating...
			{:else}
				Create Course
			{/if}
		</Button>
	</div>
</form>