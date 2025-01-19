
<script lang="ts">
	import type { PageData } from './$types'
	import type { User } from '$lib/types/user';
	let { data }: { data: PageData } = $props();

	const users: User[] = data.users
</script>

<h1>Admin - Users Page</h1>

<thead>
<tr>
	<th>Id</th>
	<th>First Name</th>
	<th>Last Name</th>
</tr>
</thead>

<br>
{#each users as user}
		{user.firstName}
{/each}

