<script lang="ts">
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from "$lib/components/ui/dialog/index.js";
	import Plus from "@lucide/svelte/icons/plus"
	import CourseForm from "$lib/components/course-form.svelte";
	import { loadUsers } from "$lib/stores/course-store";
	import { onMount, createEventDispatcher } from "svelte";
	import type { CourseResponse } from "$lib/types/course";

	const dispatch = createEventDispatcher<{
		courseCreated: CourseResponse;
	}>();

	let open = $state<boolean>(false);

	onMount(() => {
		loadUsers();
	});

	function handleSuccess(result: CourseResponse): void {
		open = false;
		alert('Course created successfully!');
		dispatch('courseCreated', result);
	}

	function handleCancel(): void {
		open = false;
	}
</script>

<Dialog bind:open>
	<DialogTrigger class={buttonVariants({ variant: "default" })}>
		<Plus />
	</DialogTrigger>

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