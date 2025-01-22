<script lang="ts">
	let squareCount = 0;

	function addSquare() {
		if (squareCount < 4) {
			squareCount += 1;
		} else {
			squareCount = 0; // Reset after 4 squares
		}
	}
</script>

<style>
    .square-container {
        display: flex;
        gap: 3px;
        margin-top: 20px;
    }

    .square {
        width: 10px;
        height: 10px;
        background-color: blue;
    }

    .button {
        padding: 10px;
        background-color: lightblue;
        border: none;
        cursor: pointer;
    }
</style>

<button class="button" on:click={addSquare}>Add Square</button>

<div class="square-container">
	{#each Array(squareCount) as _, index}
		<div class="square" key={index}></div>
	{/each}
</div>