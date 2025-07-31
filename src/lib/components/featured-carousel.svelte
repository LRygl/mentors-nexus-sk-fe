<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Carousel from "$lib/components/ui/carousel/index.js";
	import { Button } from '$lib/components/ui/button';
	import Autoplay from "embla-carousel-autoplay"
	import type { EmblaOptionsType } from 'embla-carousel';
	import type { AutoplayType } from 'embla-carousel-autoplay'

let autoplayPlugin: AutoplayType = Autoplay({
	delay: 2000,
	stopOnInteraction: false,
	stopOnFocusIn: false,
})

const carouselOptions: EmblaOptionsType = {
	align: "start",
	loop: true
}

const featuredCourses: Course[] = [
	{ id: 2, title: "Item 2" },
	{ id: 1, title: "Item 1" },
	{ id: 3, title: "Item 3" },
	{ id: 4, title: "Item 4" },
	{ id: 5, title: "Item 5" },
]

function handleMouseEnter(): void {
		autoplayPlugin.stop();
}

function handleMouseLeave(): void {
		autoplayPlugin.play();
}

</script>

<Carousel.Root
	opts={carouselOptions}
	plugins={[autoplayPlugin]}
	class="w-full"
	orientation="horizontal"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<Carousel.Content>
		{#each Array(5) as _, i (i)}
			<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
				<div class="p-1">
					<a href="/courses/{i + 1}" class="block">
						<Card.Root class="cursor-pointer hover:shadow-lg transition-shadow">
							<Card.Content class="flex h-25 items-center justify-center p-6">
								<span class="text-3xl font-semibold">{i + 1}</span>
							</Card.Content>
						</Card.Root>
					</a>
				</div>
			</Carousel.Item>
		{/each}
	</Carousel.Content>
	<Carousel.Previous />
	<Carousel.Next />
</Carousel.Root>