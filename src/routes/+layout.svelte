<script lang="ts">
	import "../app.css";
	import PortalTarget from "svelte-portal";
	import ConfirmModal from '$lib/components/Modals/ConfirmModal.svelte';
	import ToastContainer from '$lib/components/Toasts/ToastContainer.svelte';
</script>

<main>
	<slot/>
</main>

<PortalTarget />
<ConfirmModal />
<ToastContainer />