<script lang="ts">

import { onMount } from 'svelte';
import { lessonStore } from '$lib/stores/lesson-store';
import DataTableAsyncWrapper from '$lib/components/data-table-async-wrapper.svelte';
import { columns } from '../lesson/columns';
import DataTable from '$lib/components/data-table.svelte';
import { goto } from '$app/navigation';

onMount(() => {	loadLessons() });
async function loadLessons() { await lessonStore.load() }
async function reloadLessons() { await lessonStore.load(true) }

</script>

<DataTableAsyncWrapper
	store={$lessonStore}
	errorKey="errors.loading_lessons"
	loadingKey="loading.lessons"
	onRetry={loadLessons}
>

	{#snippet children()}
		<DataTable
			columns={columns}
			data={$lessonStore.data}
			loading={$lessonStore.loading}
			loadTableData={reloadLessons}
		/>
	{/snippet}

</DataTableAsyncWrapper>