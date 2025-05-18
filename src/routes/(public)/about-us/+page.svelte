<script lang="ts">
	import {notifications} from '$lib/stores/notification';
	import Notification from '$lib/components/notification.svelte';
	import notification from '$lib/components/notification.svelte';
</script>

about us

<br>
<button class="button" on:click={() => notifications.warning('Wait a moment... this might be a very long message present in the message and it could be difficult to draw')}>
	Warn!
</button>


<Notification />