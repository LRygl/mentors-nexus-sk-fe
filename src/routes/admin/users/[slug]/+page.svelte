<script lang="ts">

	import { page } from '$app/stores';
	import { users } from '$lib/stores/user-store';

	// Get the slug from the URL
	$: slug = $page.params.slug;
	users.findById("1");
</script>

{#if users}
	<h1>Load</h1>
	{$users.data}
	<!-- Display other user data -->
{:else}
	<p>User not found</p>
{/if}