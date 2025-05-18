<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { notifications } from '../stores/notification';
	import AntDesignCheckCircleFilled from '~icons/ant-design/check-circle-filled';

	export let themes: Record<string, string> = {
		danger: '#E26D69',
		success: '#84C991',
		warning: '#f0ad4e',
		info: '#5bc0de',
		default: '#aaaaaa'
	};
</script>

<div class="notifications">
	{#each $notifications as notification (notification.id)}
		<div
			animate:flip
			class="toast py-3 relative"
			style="background: {themes[notification.type]};"
			transition:fly={{ y: -30 }}>

			<!-- Close button in top right -->
			<button
				class="absolute text-sm top-2 right-2 rounded-sm bg-red-500 text-white w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
				on:click={() => { notifications.remove(notification.id) }}>
				x
			</button>

			<!-- Content row -->
			<div class="flex items-center gap-3 px-4">
				<AntDesignCheckCircleFilled class="size-20 text-green-400" />
				<span class="text-white font-medium">{notification.message}</span>
			</div>

		</div>
	{/each}
</div>


<style>
    .notifications {
        position: fixed;
        width: 400px;
        top: 15px;
        right: 20px;
        padding: 0;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: end;
		}

    .toast {
        flex: 0 0 auto;
        margin-bottom: 10px;
        border-radius: 6px;
        min-width: 200px;
        max-width: 90%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .content {
        padding: 10px 16px;
        display: block;
        color: white;
        font-weight: 500;
    }

		.close {
			background: transparent;
			border: none;
			color: white;
			font-size: 1.2rem;
			cursor: pointer;
			margin-left: 10px;
		}
</style>
