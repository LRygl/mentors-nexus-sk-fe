<script lang="ts">
	import CourseCard from "../Cards/course-card.svelte";
	import HeaderSection from "./header-section.svelte";


</script>

<section class="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden" aria-labelledby="courses-heading">
	<HeaderSection heading="Featured Stations" subHeading="Our most popular fueling stations nation wide!" />

	<div class="grid grid-cols-4 gap-6">
		<CourseCard />
		<CourseCard	/>
		<CourseCard	/>
		<CourseCard	/>
		<CourseCard	/>
		<CourseCard	/>
		<CourseCard	/>
		<CourseCard	/>

	</div>


</section>