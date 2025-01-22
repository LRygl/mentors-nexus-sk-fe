
<script lang="ts">
	import type { PageData } from './$types'
	import type { User } from '$lib/types/user';
	let { data }: { data: PageData } = $props();

	const users: User[] = data.users
</script>

<h1>Admin - Users Page</h1>
{#if users && users.length > 0}
<table>
	<thead>
	<tr>
		<th>Id</th>
		<th>First Name</th>
		<th>Last Name</th>
		<th>Email</th>
	</tr>
	</thead>
	<tbody>
	{#each users as user}
		<tr>
			<td>{user.id}</td>
			<td>{user.firstName}</td>
			<td>{user.lastName}</td>
			<td>{user.email}</td>
		</tr>
	{/each}
	</tbody>
</table>
{:else}
	<p>No users available.</p>
{/if}