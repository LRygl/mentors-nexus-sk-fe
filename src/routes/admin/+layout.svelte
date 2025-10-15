<script lang="ts">

	import { onMount, type Snippet } from 'svelte';

 export const reset = true;
 import "../../app.css";
 import Breadcrumb from '$lib/components/Breadcrumb.svelte';
 import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { guardRoute, GUARDS } from '$lib/Guards/AuthGuard';
	import AdminSidebar from '$lib/components/AdminSidebar.svelte';

 interface PageInfo {
	 title: string;
	 parent?: string;
 }

 interface Props {
	 children: Snippet;
 }

 //export const ssr = false;
 let { children }: Props = $props();


 // Guard state
 let isVerifying = $state(true);
 let accessGranted = $state(false);

 /**
	* Verify admin access
	*/
 async function verifyAccess() {
	 isVerifying = true;

	 const allowed = await guardRoute(GUARDS.admin, page.url.pathname);

	 accessGranted = allowed;
	 isVerifying = false;
 }

 // Re-verify on navigation
 afterNavigate(() => {
	 verifyAccess();
 });

 // Optional: Re-verify periodically (every 5 minutes)
 onMount(() => {
	 const interval = setInterval(() => {
		 if (accessGranted) {
			 verifyAccess();
		 }
	 }, 5 * 60 * 1000);

	 return () => clearInterval(interval);
 });

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