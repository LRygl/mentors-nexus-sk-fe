<script lang="ts">
 export const reset = true;

 import * as Breadcrumb from "$lib/components/ui/breadcrumb/index"
 import * as Sidebar from "$lib/components/ui/sidebar/index"
 import AppSidebar from "$lib/components/app-sidebar.svelte";
 import { Separator } from "$lib/components/ui/separator/index"
 import { Button } from "$lib/components/ui/button/index.js";
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header	class="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
			<Sidebar.Trigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item class="hidden md:block">
						<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator class="hidden md:block" />
					<Breadcrumb.Item>
						<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</header>
		<main>
			<slot/>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
