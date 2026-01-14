<script lang="ts">

	import { page } from '$app/state';
	import LegalTopicEditPage from '$lib/components/Admin/Legal Topic/LegalTopicEditPage.svelte';

	let legalTopicId = $derived(page.params.id);

</script>

<LegalTopicEditPage {legalTopicId} />