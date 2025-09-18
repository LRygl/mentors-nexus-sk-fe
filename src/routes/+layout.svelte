<script lang="ts">
	import "../app.css";
	import PortalTarget from "svelte-portal";
</script>

<main>
	<slot/>
</main>

<PortalTarget />

