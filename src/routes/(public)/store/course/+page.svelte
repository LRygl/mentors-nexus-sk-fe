<script>
	import { Banknote, BookOpen, Clock, Clock8, FileText, Star, Users, Video } from 'lucide-svelte';
</script>

<div class="max-w-5xl mx-auto px-4 py-10 space-y-12 text-gray-800">
	<!-- Header -->
	<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
		<div>
			<div class="flex items-center gap-2 mb-2">
				<span class="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">EV Charging</span>
				<span class="text-xs text-gray-500">Intermediate</span>
			</div>
			<h1 class="text-4xl font-bold">West Ham EV Charging Course</h1>
			<p class="text-sm text-gray-500 mt-1">by British Petroleum</p>
		</div>
		<div class="text-right">
			<p class="text-yellow-500 font-medium flex items-center justify-end gap-1">
				⭐ 4.6 <span class="text-gray-500">(112 reviews)</span>
			</p>
			<p class="mt-1 text-2xl font-bold text-gray-900">2800 Kč <span class="text-sm text-gray-400 line-through ml-1">3500 Kč</span></p>
		</div>
	</div>

	<!-- Hero Image -->
	<img src="/thumbnail.jpg" alt="Course Cover" class="rounded-2xl w-full h-80 object-cover shadow-lg" />

	<!-- Metadata -->
	<section class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-sm text-gray-700">
		<div class="flex items-center gap-2">
			<Clock class="w-5 h-5 text-blue-600" /> 12h 34min
		</div>
		<div class="flex items-center gap-2">
			<Star class="w-5 h-5 text-yellow-500 fill-current" /> 3.0 Rating
		</div>
		<div class="flex items-center gap-2">
			<Users class="w-5 h-5 text-purple-600" /> 120 Enrolled
		</div>
		<div class="flex items-center gap-2">
			<Video class="w-5 h-5 text-green-600" /> 24 Lessons
		</div>
		<div class="flex items-center gap-2">
			<FileText class="w-5 h-5 text-pink-500" /> 5 Resources
		</div>
		<div class="flex items-center gap-2">
			<BookOpen class="w-5 h-5 text-indigo-600" /> Certificate
		</div>
	</section>

	<!-- Introduction -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-10">
		<div>
			<h2 class="text-xl font-semibold mb-3">What you'll learn</h2>
			<ul class="list-disc list-inside text-sm space-y-2 text-gray-700">
				<li>Understand how EV charging infrastructure works</li>
				<li>Design large-scale EV charging networks</li>
				<li>Implement smart grid and billing systems</li>
				<li>Apply real-world case studies to your projects</li>
			</ul>



			<button class="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
				Enroll Now
			</button>
		</div>

		<!-- Description -->
		<div>
			<h2 class="text-xl font-semibold mb-3">Course Description</h2>
			<p class="text-sm text-gray-700 leading-relaxed mb-2">
				This comprehensive course dives deep into the world of EV charging. Learn about different charging levels, installation challenges, smart grids, billing platforms, and more.
			</p>
			<p class="text-sm text-gray-700 leading-relaxed">
				By the end of this course, you’ll have a practical understanding of deploying scalable EV charging networks and how they fit into broader energy strategies and mobility transitions.
			</p>
		</div>
	</div>



	<!-- Curriculum -->
	<div class="w-full mt-10">
		<h2 class="text-2xl font-semibold mb-6">📚 Station Amenities</h2>

		<div class="divide-y border rounded-md overflow-hidden text-sm bg-white shadow-sm">

			<!-- Lesson Row -->
			<div class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">

				<!-- Left: Icon -->
				<div class="flex-shrink-0">
					<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
						<!-- Video icon -->
						<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14V10z" />
							<rect x="3" y="6" width="12" height="12" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				</div>

				<!-- Center: Lesson content -->
				<div class="flex-1 px-4">
					<p class="text-gray-800 font-medium">1. Introduction to EV Charging</p>
					<p class="text-gray-500 text-xs">A quick overview of EV charging fundamentals.</p>
				</div>

				<!-- Right: Metadata -->
				<div class="flex flex-col items-end gap-1 text-sm text-gray-600">
					<div class="flex items-center gap-1">
						<!-- Clock Icon -->
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
						</svg>
						<span>12 min</span>
					</div>
					<span class="inline-block px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-md font-medium">
          Zdarma
        </span>
				</div>
			</div>

			<!-- Lesson Row 2 -->
			<div class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
				<!-- Icon -->
				<div class="flex-shrink-0">
					<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
						<!-- Video icon -->
						<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14V10z" />
							<rect x="3" y="6" width="12" height="12" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				</div>

				<!-- Lesson content -->
				<div class="flex-1 px-4">
					<p class="text-gray-800 font-medium">2. Hardware & Charger Types</p>
					<p class="text-gray-500 text-xs">Explore different hardware configurations and charger categories.</p>
				</div>

				<!-- Metadata -->
				<div class="flex flex-col items-end gap-1 text-sm text-gray-600">
					<div class="flex items-center gap-1">
						<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
						</svg>
						<span>18 min</span>
					</div>
					<span class="inline-block px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-md font-medium">
          Subscription
        </span>
				</div>
			</div>

			<!-- Add more lessons as needed -->

		</div>
	</div>

	<!-- Resources -->
	<div>
		<h2 class="text-xl font-semibold mb-3">Downloadable Resources</h2>
		<ul class="list-disc list-inside text-sm text-blue-600 space-y-1">
			<li><a href="/resources/ev-grid-whitepaper.pdf" class="hover:underline">EV Grid Whitepaper (PDF)</a></li>
			<li><a href="/resources/network-planner.xlsx" class="hover:underline">Network Planner Spreadsheet</a></li>
			<li><a href="/resources/installation-checklist.docx" class="hover:underline">Installation Checklist (DOCX)</a></li>
		</ul>
	</div>

	<!-- About the Author -->
	<div class="flex items-start gap-6 mt-10">
		<img src="/avatar.png" alt="Author" class="w-20 h-20 rounded-full object-cover shadow" />
		<div>
			<h3 class="text-lg font-semibold">British Petroleum</h3>
			<p class="text-sm text-gray-600 mt-1">Industry leader in sustainable energy and EV charging development. Bringing real-world experience from deploying over 1,200 charging stations globally.</p>
			<p class="mt-2 text-xs text-blue-600 hover:underline"><a href="#">View all courses by this author</a></p>
		</div>
	</div>

	<!-- FAQ -->
	<div>
		<h2 class="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
		<div class="space-y-4 text-sm">
			<details class="border rounded-md p-4">
				<summary class="font-medium cursor-pointer">Do I need any prior experience?</summary>
				<p class="mt-2 text-gray-600">No prior technical experience is needed. We start from the basics and build up to advanced applications.</p>
			</details>
			<details class="border rounded-md p-4">
				<summary class="font-medium cursor-pointer">Will I get a certificate?</summary>
				<p class="mt-2 text-gray-600">Yes! After completing the course and all quizzes, you will receive a digital certificate.</p>
			</details>
			<details class="border rounded-md p-4">
				<summary class="font-medium cursor-pointer">Can I access the course later?</summary>
				<p class="mt-2 text-gray-600">Yes, once enrolled you have lifetime access to all materials and future updates.</p>
			</details>
		</div>
	</div>

	<!-- Reviews -->
	<div>
		<h2 class="text-xl font-semibold mb-4">Student Reviews</h2>
		<div class="space-y-6 text-sm">
			<div class="border-b pb-4">
				<p class="font-medium text-gray-800">Anna Novák</p>
				<p class="text-yellow-500 mb-1">⭐⭐⭐⭐⭐</p>
				<p class="text-gray-700">This course helped me design my first EV charging site — great real-world examples and clear explanations!</p>
			</div>
			<div class="border-b pb-4">
				<p class="font-medium text-gray-800">Tomáš Šimek</p>
				<p class="text-yellow-500 mb-1">⭐⭐⭐⭐</p>
				<p class="text-gray-700">Good overview of all the moving parts. A few sections could go deeper, but overall very helpful.</p>
			</div>
		</div>
	</div>
</div>