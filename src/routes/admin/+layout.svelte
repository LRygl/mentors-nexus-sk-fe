<script lang="ts">

 export const reset = true;

 import * as Sidebar from "$lib/components/ui/sidebar/index"
 import AppSidebar from "$lib/components/app-sidebar.svelte";
 import { Separator } from "$lib/components/ui/separator/index"
 import Breadcrumb from '$lib/components/Breadcrumb.svelte';

 interface PageInfo {
	 title: string;
	 parent?: string;
 }


</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb />
		</header>
		<main class="p-4 bg-gray-50 dark:bg-gray-900 h-screen">
			<slot/>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>