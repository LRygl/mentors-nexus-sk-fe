<script lang="ts">
	import { StatusEnum } from '../../../types/statusEnum'

	// Define props
	export let value: StatusEnum = StatusEnum.ACTIVE;

	// Determine color and text based on value
	// Explicitly type the variables
	let colorClass: string = "";
	let text: string = "";

	if (value === StatusEnum.ACTIVE) {
		colorClass = "bg-green-500";
		text = "Active";
	} else if (value === StatusEnum.INACTIVE) {
		colorClass = "bg-gray-500";
		text = "Inactive";
	} else if (value === StatusEnum.ERROR) {  // Corrected else if syntax
		colorClass = "bg-red-500";
		text = "Error";
	}
</script>

<div class="flex items-center">
	<div class="h-2.5 w-2.5 rounded-full {colorClass} me-2"></div> {text}
</div>