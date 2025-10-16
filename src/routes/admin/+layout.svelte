<script lang="ts">

	import { onMount, type Snippet } from 'svelte';

 export const reset = true;
 import "../../app.css";
 import Breadcrumb from '$lib/components/Breadcrumb.svelte';
 import AdminSidebar from '$lib/components/AdminSidebar.svelte';

 interface Props {
	 children: Snippet;
 }

 //export const ssr = false;
 let { children }: Props = $props();

</script>

<div class="flex h-screen">
	<AdminSidebar />
	<div class="flex-1 flex flex-col overflow-hidden">
		<header class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Breadcrumb />
		</header>
		<main class="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
			{@render children()}
		</main>
	</div>
</div>


<style>
	@reference "tailwindcss";
</style>