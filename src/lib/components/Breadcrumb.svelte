<script lang="ts">
	import { page } from '$app/stores';
	//import { page } from '$app/state';
	import { getPageInfo } from '$lib/utils/breadcrumb';

	$: pageInfo = getPageInfo($page.route.id, $page.url.pathname);
</script>

<div class="flex items-center gap-2">
	{#if pageInfo.parent}
    <span class="hidden md:inline">
      <a href={pageInfo.parentHref || '#'} class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
        {pageInfo.parent}
      </a>
    </span>
		<span class="text-gray-500 dark:text-gray-400 hidden md:inline">/</span>
	{/if}
	<span class="font-medium text-gray-900 dark:text-gray-100">{pageInfo.title}</span>
</div>