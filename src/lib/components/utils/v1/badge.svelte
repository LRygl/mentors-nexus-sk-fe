
<script lang="ts">
	let {
		visible = true,
		text = '',
		bgColor = '',
		textColor = '',

	} = $props();


</script>

{#if visible}
	<div
		class={`${bgColor} ${textColor}  rounded-md text-xs text-center min-w-16 py-1.5 px-2 inline-block`}>
		<p>{text}</p>
	</div>
{/if}