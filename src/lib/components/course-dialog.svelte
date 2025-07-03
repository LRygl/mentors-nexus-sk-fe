<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader, DialogOverlay,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog/index.js';
	import Plus from "@lucide/svelte/icons/plus"
	import CourseForm from "$lib/components/course-form.svelte";
	import { users } from "$lib/stores/user-store";
	import { onMount, createEventDispatcher } from "svelte";
	import type { CourseResponse } from "$lib/types/course";

	const dispatch = createEventDispatcher<{
		courseCreated: CourseResponse;
	}>();

	interface Props {
		onSuccess?: (result: CourseResponse) => void;
		onCancel?: () => void;
	}

	let { onSuccess, onCancel }: Props = $props();

	// Manage dialog state internally
	let open = $state(false);

	onMount(() => {
		users.load();
	});

	function handleSuccess(result: CourseResponse): void {
		// Close dialog first
		open = false;

		// Call the parent's onSuccess callback
		onSuccess?.(result);

		// Dispatch event
		dispatch('courseCreated', result);
	}

	function handleCancel(): void {
		// Close dialog first
		open = false;

		// Call the parent's onCancel callback
		onCancel?.();
	}
</script>

<Dialog bind:open>
	<DialogTrigger class={buttonVariants({ variant: "default" })}>
		<Plus /> Create
	</DialogTrigger>
	<DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
	<DialogContent class="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
		<DialogHeader>
			<DialogTitle>Add New Course</DialogTitle>
			<DialogDescription>
				Create a new course by filling out the information below.
			</DialogDescription>
		</DialogHeader>

		<CourseForm onSuccess={handleSuccess} onCancel={handleCancel} />
	</DialogContent>
</Dialog>