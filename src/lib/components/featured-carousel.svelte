<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import { Button } from '$lib/components/ui/button';
	import Autoplay from "embla-carousel-autoplay"
</script>

<Carousel.Root
	opts={{
  align: "start",
  loop: true,
 }},
	plugins={[
		Autoplay({
		delay: 5000,
		})
	]}
	class="w-full"
>
	<Carousel.Content>
		{#each Array(15) as _, i (i)}
			<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
				<div class="p-1">
					<Card.Root>
						<Card.Content
							class="flex h-25 items-center justify-center p-6">
								<span class="text-3xl font-semibold">{i + 1}</span>
						</Card.Content>
					</Card.Root>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>