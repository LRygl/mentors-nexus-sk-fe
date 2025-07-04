<!-- BadgeCell.svelte -->
<script lang="ts">
	import { Badge } from "$lib/components/ui/badge";

	export let variant: "default" | "secondary" | "destructive" | "outline" = "default";
	export let value: string; // Change from 'text' to 'value' or any name you prefer
</script>

<Badge {variant}>{value}</Badge>