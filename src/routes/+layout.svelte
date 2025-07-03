<script lang="ts">
	import "../app.css";
	import Notification from "\$lib/components/notification.svelte";
	import GlobalDialog from "$lib/components/global-dialog.svelte";
</script>

<Notification />
<GlobalDialog />
<main>
	<slot/>
</main>


