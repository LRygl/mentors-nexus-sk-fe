<script lang="ts">
	import "../app.css";
	import PortalTarget from "svelte-portal";
	import ConfirmModal from '$lib/components/Modals/ConfirmModal.svelte';
	import ToastContainer from '$lib/components/Toasts/ToastContainer.svelte';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';

	let { children } = $props();

</script>


<main>
	{@render children()}
</main>

<PortalTarget />
<ConfirmModal />
<ToastContainer />
