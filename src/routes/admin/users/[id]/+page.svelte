<script lang="ts">
	import { page } from '$app/state';
	import UserEditPage from '$lib/components/Admin/User/UserEditPage.svelte';

	let userId = $derived(page.params.id);
</script>

<UserEditPage {userId} />