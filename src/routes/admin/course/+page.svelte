<script lang="ts">
import DataTable from '$lib/components/data-table.svelte'
import type { Course } from '$lib/types/course';
import { columns } from './columns';
import { Button } from '$lib/components/ui/button';


// State
let courses = $state<Course[]>([]);
let totalCourses = $state(0);
let loading = $state(false);
let error = $state<string | null>(null);
let searchTerm = $state('');
let statusFilter = $state<Course['status'] | ''>('');

// Load resource data from API



	export const data: Course[] = [
		{
			id: "1",
			name: "Pilot",
			status: "processing",
			price: 125,
			uuid: "0197bc8b-a30c-720e-a705-177e1bc6add0",
		},
		{
			id: "2",
			name: "After Pilot",
			status: "processing",
			price: 250,
			uuid: "0197bc8b-ba8e-7a49-b9be-92e55a2fb23d",
		},
		// ...
	];

</script>

<div class="pb-2">
	<div>Courses</div>
	<div>
		Search
		<Button variant="default">Explore courses</Button>
	</div>

</div>

<DataTable {columns} {data} />
