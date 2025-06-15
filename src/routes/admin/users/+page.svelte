
<script lang="ts">
	import type { PageData } from './$types'
	import type { User } from '$lib/types/user';
	import { StatusEnum } from '$lib/types/statusEnum';
	import StatusIndicator from '$lib/components/utils/v1/statusIndicator.svelte';
	import AntDesignEditOutlined from '~icons/ant-design/edit-outlined';
	import AntDesignDeleteOutlined from '~icons/ant-design/delete-outlined';
	import AntDesignProfileOutlined from '~icons/ant-design/profile-outlined';
	import AntDesignHistoryOutlined from '~icons/ant-design/history-outlined';

	let debug = true;
	let { data }: { data: PageData } = $props();
	const users: User[] = data.users

</script>


<h1 class="font-bold text-2xl mb-3">Admin - Users Page</h1>


<div class="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4">
	<label for="table-search" class="sr-only">Search</label>
	<div class="relative">
		<div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
			<svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
			</svg>
		</div>
		<input type="text" id="table-search-users" class="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-nexus-primary focus:border-nexus-secondary dark:border-nexus-primary dark:placeholder-gray-400 dark:text-white dark:focus:ring-nexus-primary dark:focus:border-ring-nexus-primary" placeholder="Search for users">
	</div>
	<div>
		<button class="btn-primary">Test</button>
	</div>

</div>





{#if users && users.length > 0}
	<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
		<table class="w-full text-sm text-left rtl:text-right text-nexus-primary-800">
			<thead class="text-xs uppercase bg-nexus-primary text-nexus-primary-80">
			<tr class="">
				<th scope="col" class="px-6 py-3">Id</th>
				<th scope="col" class="px-6 py-3">Name</th>
				<th scope="col" class="px-6 py-3">Role</th>
				<th scope="col" class="px-6 py-3">Status</th>
				<th scope="col" class="px-6 py-3">Action</th>
			</tr>
			</thead>
			<tbody>
			{#each users as user}
				<tr>
					<td class="px-6 py-3">{user.id}</td>
					<th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
						<div class="w-10 h-10 rounded-full text-white bg-nexus-primary flex items-center justify-center">
							{user.firstName?.[0]}{user.lastName?.[0]}
						</div>
						<div class="ps-3">
							<div class="text-base font-semibold text-nexus-primary-600">{user.firstName} {user.lastName}</div>
							<div class="font-normal text-gray-500">{user.email}</div>
						</div>
					</th>
					<td class="px-6 py-3">Admin</td>
					<td class="px-6 py-3">
						<StatusIndicator value={StatusEnum.ERROR} />
					</td>
					<td class="px-6 py-3">
						<div class="inline-flex rounded-md shadow-sm" role="group">
							{user.id}
							<button type="button" class="group inline-flex items-center px-3 py-2.25 text-sm border border-gray-300 rounded-s-lg cursor-pointer">
								<AntDesignEditOutlined class="group-hover:text-nexus-secondary"/>
							</button>
							<button type="button" class="group inline-flex items-center px-3 py-2 text-sm border border-gray-300 cursor-pointer">
								<AntDesignProfileOutlined class="group-hover:text-nexus-secondary"/>
							</button>
							<button type="button" class="group inline-flex items-center px-3 py-2 text-sm border border-gray-300 cursor-pointer">
								<AntDesignHistoryOutlined class="group-hover:text-nexus-secondary"/>
							</button>
							<button type="button" class="group inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-e-lg cursor-pointer">
								<AntDesignDeleteOutlined class="group-hover:text-nexus-secondary"/>
							</button>

						</div>
					</td>
				</tr>
			{/each}
			</tbody>
		</table>

	</div>


{:else}
	<p>No users available.</p>
{/if}


<form action="submit">
	test form
</form>