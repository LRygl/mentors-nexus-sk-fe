<script lang="ts">

	// Get category ID from URL params
	import { page } from '$app/state';

	const faqId = page.params.slug;
</script>

Hello to FAQ
{faqId}