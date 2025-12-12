<script lang="ts">
	import { Building2, Users, Target, Heart } from 'lucide-svelte';
</script>

<svelte:head>
	<title>About Us - Your Company Name</title>
	<meta name="description" content="Learn about our mission, values, and team" />
</svelte:head>

<div class="min-h-screen">
	<!-- Hero Section -->
	<section class="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 to-background">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-6">About Us</h1>
			<p class="text-xl text-muted-foreground max-w-2xl mx-auto">
				We're on a mission to make education accessible and engaging for everyone
			</p>
		</div>
	</section>

	<!-- Mission Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8">
		<div class="max-w-6xl mx-auto">
			<div class="grid md:grid-cols-2 gap-12 items-center">
				<div>
					<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
						<Target class="h-4 w-4" />
						Our Mission
					</div>
					<h2 class="text-3xl font-bold mb-4">Empowering Through Education</h2>
					<p class="text-muted-foreground mb-4">
						Founded with a vision to democratize knowledge, we believe that everyone deserves access to quality educational resources. Our platform combines cutting-edge technology with expert-curated content to create an unparalleled learning experience.
					</p>
					<p class="text-muted-foreground">
						We're committed to continuous improvement, listening to our community, and adapting to the ever-changing landscape of education and technology.
					</p>
				</div>
				<div class="relative h-64 md:h-96 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
					<Building2 class="h-32 w-32 text-primary/30" />
				</div>
			</div>
		</div>
	</section>

	<!-- Values Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
		<div class="max-w-6xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Our Values</h2>
				<p class="text-muted-foreground max-w-2xl mx-auto">
					The principles that guide everything we do
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<div class="bg-background p-6 rounded-lg border">
					<div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<Users class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold mb-2">Community First</h3>
					<p class="text-muted-foreground">
						We build with and for our community, ensuring every voice is heard and valued.
					</p>
				</div>

				<div class="bg-background p-6 rounded-lg border">
					<div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<Heart class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold mb-2">Quality & Care</h3>
					<p class="text-muted-foreground">
						Every piece of content is crafted with attention to detail and genuine care for learners.
					</p>
				</div>

				<div class="bg-background p-6 rounded-lg border">
					<div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
						<Target class="h-6 w-6 text-primary" />
					</div>
					<h3 class="text-xl font-semibold mb-2">Innovation</h3>
					<p class="text-muted-foreground">
						We constantly push boundaries to create better learning experiences.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Team Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8">
		<div class="max-w-6xl mx-auto">
			<div class="text-center mb-12">
				<h2 class="text-3xl font-bold mb-4">Meet Our Team</h2>
				<p class="text-muted-foreground max-w-2xl mx-auto">
					Passionate individuals working together to make a difference
				</p>
			</div>

			<!-- Add team member cards here as needed -->
			<div class="text-center py-8">
				<p class="text-muted-foreground">
					We're a diverse team of educators, developers, and designers united by our passion for learning.
				</p>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
		<div class="max-w-4xl mx-auto text-center">
			<h2 class="text-3xl font-bold mb-4">Join Us on This Journey</h2>
			<p class="text-lg mb-8 opacity-90">
				Whether you're a learner, educator, or partner, we'd love to have you with us.
			</p>
			<button
				onclick={() => window.location.href = '/support'}
				class="px-6 py-3 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-colors"
			>
				Get in Touch
			</button>
		</div>
	</section>
</div>