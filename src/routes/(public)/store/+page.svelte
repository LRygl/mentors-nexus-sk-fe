<script lang="ts">
	import { onMount } from 'svelte';

	// Type definitions
	interface Course {
		id: number;
		title: string;
		instructor: string;
		price: number;
		originalPrice: number;
		category: string;
		rating: number;
		students: number;
		duration: string;
		lessons: number;
		difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
		image: string;
		description: string;
		features: string[];
		bestseller: boolean;
		updated: string;
	}

	interface PriceRange {
		min: number;
		max: number;
	}

	type ViewMode = 'grid' | 'list';
	type SortOption = 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high' | 'students';
	type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

	// Reactive state using $state
	let viewMode: ViewMode = $state('grid');
	let currentPage: number = $state(1);
	let coursesPerPage: number = $state(12);
	let searchQuery: string = $state('');
	let sortBy: SortOption = $state('popular');
	let showFilters: boolean = $state(false);

	// Filter states
	let selectedCategories: string[] = $state([]);
	let priceRange: PriceRange = $state({ min: 0, max: 500 });
	let selectedDifficulty: Difficulty[] = $state([]);
	let selectedDuration: string[] = $state([]);
	let selectedRating: number = $state(0);
	let showFreeOnly: boolean = $state(false);

	// Mock course data
	let allCourses: Course[] = $state([
		{
			id: 1,
			title: "Complete React Development Bootcamp",
			instructor: "Sarah Johnson",
			price: 89.99,
			originalPrice: 199.99,
			category: "Web Development",
			rating: 4.8,
			students: 15420,
			duration: "42 hours",
			lessons: 156,
			difficulty: "Beginner",
			image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
			description: "Master React from scratch with hands-on projects and real-world applications.",
			features: ["Lifetime Access", "Certificate", "Mobile Access"],
			bestseller: true,
			updated: "2024-01-15"
		},
		{
			id: 2,
			title: "Advanced Python for Data Science",
			instructor: "Dr. Michael Chen",
			price: 124.99,
			originalPrice: 249.99,
			category: "Data Science",
			rating: 4.9,
			students: 8934,
			duration: "38 hours",
			lessons: 142,
			difficulty: "Advanced",
			image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
			description: "Deep dive into Python for advanced data analysis and machine learning.",
			features: ["Lifetime Access", "Certificate", "Downloadable Resources"],
			bestseller: false,
			updated: "2024-02-10"
		},
		{
			id: 3,
			title: "UI/UX Design Masterclass",
			instructor: "Emma Rodriguez",
			price: 0,
			originalPrice: 149.99,
			category: "Design",
			rating: 4.7,
			students: 23156,
			duration: "28 hours",
			lessons: 98,
			difficulty: "Intermediate",
			image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=225&fit=crop",
			description: "Learn modern UI/UX design principles with industry-standard tools.",
			features: ["Lifetime Access", "Certificate", "Design Assets"],
			bestseller: true,
			updated: "2024-01-28"
		},
		{
			id: 4,
			title: "Digital Marketing Fundamentals",
			instructor: "James Wilson",
			price: 67.99,
			originalPrice: 129.99,
			category: "Marketing",
			rating: 4.6,
			students: 12890,
			duration: "22 hours",
			lessons: 87,
			difficulty: "Beginner",
			image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
			description: "Master digital marketing strategies for modern businesses.",
			features: ["Lifetime Access", "Certificate", "Marketing Templates"],
			bestseller: false,
			updated: "2024-02-05"
		},
		{
			id: 5,
			title: "Full Stack JavaScript Development",
			instructor: "Alex Thompson",
			price: 149.99,
			originalPrice: 299.99,
			category: "Web Development",
			rating: 4.9,
			students: 11250,
			duration: "65 hours",
			lessons: 210,
			difficulty: "Intermediate",
			image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop",
			description: "Complete guide to modern full-stack development with Node.js and React.",
			features: ["Lifetime Access", "Certificate", "Source Code", "Career Support"],
			bestseller: true,
			updated: "2024-02-20"
		},
		{
			id: 6,
			title: "Machine Learning with TensorFlow",
			instructor: "Dr. Lisa Park",
			price: 199.99,
			originalPrice: 399.99,
			category: "Data Science",
			rating: 4.8,
			students: 7821,
			duration: "52 hours",
			lessons: 178,
			difficulty: "Advanced",
			image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop",
			description: "Master machine learning algorithms and deep learning with TensorFlow.",
			features: ["Lifetime Access", "Certificate", "Jupyter Notebooks", "Dataset Access"],
			bestseller: false,
			updated: "2024-01-30"
		},
		{
			id: 7,
			title: "Mobile App Development with Flutter",
			instructor: "Carlos Rodriguez",
			price: 0,
			originalPrice: 179.99,
			category: "Mobile Development",
			rating: 4.7,
			students: 19456,
			duration: "35 hours",
			lessons: 124,
			difficulty: "Beginner",
			image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop",
			description: "Build beautiful cross-platform mobile apps with Flutter and Dart.",
			features: ["Lifetime Access", "Certificate", "Source Code", "Community Access"],
			bestseller: true,
			updated: "2024-02-12"
		},
		{
			id: 8,
			title: "Cloud Computing with AWS",
			instructor: "Jennifer Lee",
			price: 179.99,
			originalPrice: 349.99,
			category: "Cloud Computing",
			rating: 4.8,
			students: 9876,
			duration: "48 hours",
			lessons: 165,
			difficulty: "Intermediate",
			image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop",
			description: "Master AWS cloud services and prepare for certification exams.",
			features: ["Lifetime Access", "Certificate", "Practice Exams", "Lab Environment"],
			bestseller: false,
			updated: "2024-02-08"
		}
	]);

	// Computed values using $derived
	let filteredCourses: Course[] = $derived(() => {
		let filtered = allCourses.filter((course: Course) => {
			// Search filter
			if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
				!course.instructor.toLowerCase().includes(searchQuery.toLowerCase())) {
				return false;
			}

			// Category filter
			if (selectedCategories.length > 0 && !selectedCategories.includes(course.category)) {
				return false;
			}

			// Price filter
			if (course.price < priceRange.min || course.price > priceRange.max) {
				return false;
			}

			// Free only filter
			if (showFreeOnly && course.price > 0) {
				return false;
			}

			// Difficulty filter
			if (selectedDifficulty.length > 0 && !selectedDifficulty.includes(course.difficulty)) {
				return false;
			}

			// Rating filter
			if (selectedRating > 0 && course.rating < selectedRating) {
				return false;
			}

			return true;
		});

		// Sort courses
		switch (sortBy) {
			case 'price-low':
				filtered.sort((a: Course, b: Course) => a.price - b.price);
				break;
			case 'price-high':
				filtered.sort((a: Course, b: Course) => b.price - a.price);
				break;
			case 'rating':
				filtered.sort((a: Course, b: Course) => b.rating - a.rating);
				break;
			case 'students':
				filtered.sort((a: Course, b: Course) => b.students - a.students);
				break;
			case 'newest':
				filtered.sort((a: Course, b: Course) => new Date(b.updated).getTime() - new Date(a.updated).getTime());
				break;
			default: // popular
				filtered.sort((a: Course, b: Course) => b.students - a.students);
		}

		return filtered;
	});

	let paginatedCourses: Course[] = $derived(() => {
		const start: number = (currentPage - 1) * coursesPerPage;
		const end: number = start + coursesPerPage;
		return filteredCourses.slice(start, end);
	});

	let totalPages: number = $derived(() => Math.ceil(filteredCourses.length / coursesPerPage));

	// Categories for filter
	const categories: string[] = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business', 'Mobile Development', 'Cloud Computing'];
	const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

	function toggleCategory(category: string): void {
		if (selectedCategories.includes(category)) {
			selectedCategories = selectedCategories.filter((c: string) => c !== category);
		} else {
			selectedCategories = [...selectedCategories, category];
		}
	}

	function toggleDifficulty(difficulty: Difficulty): void {
		if (selectedDifficulty.includes(difficulty)) {
			selectedDifficulty = selectedDifficulty.filter((d: Difficulty) => d !== difficulty);
		} else {
			selectedDifficulty = [...selectedDifficulty, difficulty];
		}
	}

	function clearAllFilters(): void {
		selectedCategories = [];
		selectedDifficulty = [];
		priceRange = { min: 0, max: 500 };
		selectedRating = 0;
		showFreeOnly = false;
		searchQuery = '';
		currentPage = 1;
	}

	function formatPrice(price: number): string {
		return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
	}

	function getDiscountPercentage(price: number, originalPrice: number): number {
		if (price === 0 || originalPrice === 0) return 0;
		return Math.round(((originalPrice - price) / originalPrice) * 100);
	}

	function handleSortChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		sortBy = target.value as SortOption;
		currentPage = 1;
	}

	function handlePriceRangeChange(type: 'min' | 'max', event: Event): void {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value) || 0;

		if (type === 'min') {
			priceRange.min = value;
		} else {
			priceRange.max = value;
		}
		currentPage = 1;
	}

	function goToPage(page: number): void {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function previousPage(): void {
		goToPage(currentPage - 1);
	}

	function nextPage(): void {
		goToPage(currentPage + 1);
	}

	// Reset page when filters change
	$effect(() => {
		if (filteredCourses) {
			currentPage = 1;
		}
	});
</script>

<main class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-indigo-950">
	<!-- Floating background elements -->
	<div class="fixed top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
	<div class="fixed bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-indigo-400/5 to-cyan-500/5 rounded-full blur-2xl animate-pulse" style="animation-delay: 2s;"></div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Header Section -->
		<header class="text-center mb-12">
			<div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
				<span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
				Premium Learning Platform
			</div>
			<h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4">
				Master New Skills
			</h1>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				Discover world-class courses from industry experts and advance your career with hands-on learning
			</p>
		</header>

		<!-- Search and Controls -->
		<div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 mb-8">
			<div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
				<!-- Search Bar -->
				<div class="relative flex-1 max-w-md">
					<svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search courses..."
						class="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
					/>
				</div>

				<!-- Controls -->
				<div class="flex items-center gap-3">
					<!-- Sort Dropdown -->
					<select
						bind:value={sortBy}
						on:change={handleSortChange}
						class="px-4 py-3 bg-white/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
					>
						<option value="popular">Most Popular</option>
						<option value="newest">Newest</option>
						<option value="rating">Highest Rated</option>
						<option value="price-low">Price: Low to High</option>
						<option value="price-high">Price: High to Low</option>
						<option value="students">Most Students</option>
					</select>

					<!-- View Toggle -->
					<div class="flex items-center gap-1 p-1 bg-white/80 dark:bg-gray-700/80 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
						<button
							onclick={() => viewMode = 'grid'}
							class="p-2 rounded-xl transition-all duration-300 {viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
							</svg>
						</button>
						<button
							onclick={() => viewMode = 'list'}
							class="p-2 rounded-xl transition-all duration-300 {viewMode === 'list' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
							</svg>
						</button>
					</div>

					<!-- Filter Toggle -->
					<button
						onclick={() => showFilters = !showFilters}
						class="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
						</svg>
						Filters
					</button>
				</div>
			</div>
		</div>

		<div class="flex gap-8">
			<!-- Filters Sidebar -->
			{#if showFilters}
				<aside class="w-80 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-6 h-fit sticky top-8">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
						<button
							onclick={clearAllFilters}
							class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
						>
							Clear All
						</button>
					</div>

					<!-- Free Courses Toggle -->
					<div class="mb-6">
						<label class="flex items-center gap-3 cursor-pointer">
							<input
								type="checkbox"
								bind:checked={showFreeOnly}
								class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
							/>
							<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Show Free Courses Only</span>
						</label>
					</div>

					<!-- Price Range -->
					<div class="mb-6">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Price Range</h4>
						<div class="space-y-3">
							<div class="flex items-center gap-3">
								<input
									type="number"
									value={priceRange.min}
									on:input={(e) => handlePriceRangeChange('min', e)}
									placeholder="Min"
									class="w-full px-3 py-2 text-sm bg-white/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
								/>
								<span class="text-gray-400">-</span>
								<input
									type="number"
									value={priceRange.max}
									on:input={(e) => handlePriceRangeChange('max', e)}
									placeholder="Max"
									class="w-full px-3 py-2 text-sm bg-white/80 dark:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
								/>
							</div>
						</div>
					</div>

					<!-- Categories -->
					<div class="mb-6">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Categories</h4>
						<div class="space-y-2">
							{#each categories as category}
								<label class="flex items-center gap-3 cursor-pointer">
									<input
										type="checkbox"
										checked={selectedCategories.includes(category)}
										onchange={() => toggleCategory(category)}
										class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-700 dark:text-gray-300">{category}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Difficulty Level -->
					<div class="mb-6">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Difficulty Level</h4>
						<div class="space-y-2">
							{#each difficulties as difficulty}
								<label class="flex items-center gap-3 cursor-pointer">
									<input
										type="checkbox"
										checked={selectedDifficulty.includes(difficulty)}
										onchange={() => toggleDifficulty(difficulty)}
										class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
									/>
									<span class="text-sm text-gray-700 dark:text-gray-300">{difficulty}</span>
								</label>
							{/each}
						</div>
					</div>

					<!-- Rating Filter -->
					<div class="mb-6">
						<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h4>
						<div class="space-y-2">
							{#each [4.5, 4.0, 3.5, 3.0] as rating}
								<label class="flex items-center gap-3 cursor-pointer">
									<input
										type="radio"
										bind:group={selectedRating}
										value={rating}
										class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
									/>
									<div class="flex items-center gap-1">
										{#each Array(5) as _, i}
											<svg class="w-4 h-4 {i < rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
											</svg>
										{/each}
										<span class="text-sm text-gray-600 dark:text-gray-400 ml-1">& up</span>
									</div>
								</label>
							{/each}
						</div>
					</div>
				</aside>
			{/if}

			<!-- Main Content -->
			<div class="flex-1">
				<!-- Results Info -->
				<div class="flex items-center justify-between mb-6">
					<p class="text-gray-600 dark:text-gray-300">
						Showing {paginatedCourses.length} of {filteredCourses.length} courses
					</p>
				</div>

				<!-- Courses Grid/List -->
				<div class="courses-container {viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}">
					{#each paginatedCourses as course, index}
						<article
							class="course-card group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2"
							class:list-view={viewMode === 'list'}
							style="animation-delay: {index * 100}ms"
						>
							{#if viewMode === 'grid'}
								<!-- Grid View -->
								<div class="relative">
									<img src={course.image} alt={course.title} class="w-full h-48 object-cover" />
									{#if course.bestseller}
										<div class="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
											BESTSELLER
										</div>
									{/if}
									{#if course.price === 0}
										<div class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
											FREE
										</div>
									{:else if getDiscountPercentage(course.price, course.originalPrice) > 0}
										<div class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full">
											{getDiscountPercentage(course.price, course.originalPrice)}% OFF
										</div>
									{/if}
								</div>
								<div class="p-6">
									<div class="flex items-center gap-2 mb-3">
										<span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg">
											{course.category}
										</span>
										<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg">
											{course.difficulty}
										</span>
									</div>
									<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
										{course.title}
									</h3>
									<p class="text-sm text-gray-600 dark:text-gray-300 mb-3">By {course.instructor}</p>
									<p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{course.description}</p>

									<div class="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-300">
										<div class="flex items-center gap-1">
											<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
											</svg>
											<span>{course.rating}</span>
										</div>
										<span>•</span>
										<span>{course.students.toLocaleString()} students</span>
										<span>•</span>
										<span>{course.duration}</span>
									</div>

									<div class="flex items-center justify-between">
										<div class="flex items-center gap-2">
											<span class="text-2xl font-bold text-gray-900 dark:text-white">
												{formatPrice(course.price)}
											</span>
											{#if course.originalPrice > course.price && course.price > 0}
												<span class="text-sm text-gray-500 line-through">
													${course.originalPrice.toFixed(2)}
												</span>
											{/if}
										</div>
										<button class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
											{course.price === 0 ? 'Enroll Free' : 'Buy Now'}
										</button>
									</div>
								</div>
							{:else}
								<!-- List View -->
								<div class="flex flex-col md:flex-row">
									<div class="relative md:w-80 h-48 md:h-auto">
										<img src={course.image} alt={course.title} class="w-full h-full object-cover" />
										{#if course.bestseller}
											<div class="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
												BESTSELLER
											</div>
										{/if}
									</div>
									<div class="flex-1 p-6 flex flex-col justify-between">
										<div>
											<div class="flex items-center gap-2 mb-3">
												<span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg">
													{course.category}
												</span>
												<span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-lg">
													{course.difficulty}
												</span>
											</div>
											<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
												{course.title}
											</h3>
											<p class="text-sm text-gray-600 dark:text-gray-300 mb-2">By {course.instructor}</p>
											<p class="text-gray-500 dark:text-gray-400 mb-4">{course.description}</p>

											<div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
												<div class="flex items-center gap-1">
													<svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
														<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
													</svg>
													<span>{course.rating}</span>
												</div>
												<span>•</span>
												<span>{course.students.toLocaleString()} students</span>
												<span>•</span>
												<span>{course.duration}</span>
												<span>•</span>
												<span>{course.lessons} lessons</span>
											</div>
										</div>

										<div class="flex items-center justify-between mt-4">
											<div class="flex items-center gap-2">
												<span class="text-3xl font-bold text-gray-900 dark:text-white">
													{formatPrice(course.price)}
												</span>
												{#if course.originalPrice > course.price && course.price > 0}
													<span class="text-lg text-gray-500 line-through">
														${course.originalPrice.toFixed(2)}
													</span>
												{/if}
												{#if getDiscountPercentage(course.price, course.originalPrice) > 0}
													<span class="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg">
														{getDiscountPercentage(course.price, course.originalPrice)}% OFF
													</span>
												{/if}
											</div>
											<div class="flex items-center gap-3">
												<button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
													Preview
												</button>
												<button class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
													{course.price === 0 ? 'Enroll Free' : 'Buy Now'}
												</button>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</article>
					{/each}
				</div>

				<!-- Empty State -->
				{#if filteredCourses.length === 0}
					<div class="text-center py-16">
						<div class="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mb-6">
							<svg class="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0-3.314C7.832 8.146 9.863 7.314 12 7.314s4.168.832 5.657 2.343M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
							</svg>
						</div>
						<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
						<p class="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your filters or search terms</p>
						<button
							onclick={clearAllFilters}
							class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
						>
							Clear All Filters
						</button>
					</div>
				{/if}

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="flex items-center justify-center mt-12 gap-2">
						<button
							onclick={previousPage}
							disabled={currentPage === 1}
							class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
							</svg>
						</button>

						{#each Array(Math.min(5, totalPages)) as _, i}
							{@const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i}
							{#if page <= totalPages}
								<button
									onclick={() => goToPage(page)}
									class="flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-110 {page === currentPage ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'}"
								>
									{page}
								</button>
							{/if}
						{/each}

						<button
							onclick={nextPage}
							disabled={currentPage === totalPages}
							class="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-white/20 dark:border-gray-700/30 text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
							</svg>
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .course-card {
        opacity: 0;
        animation: fade-in-up 0.6s ease-out forwards;
    }

    .course-card.list-view {
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 768px) {
        .course-card.list-view {
            flex-direction: row;
        }
    }

    .courses-container:hover .course-card:not(:hover) {
        opacity: 0.7;
        transform: scale(0.98);
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }

    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #2563eb, #7c3aed);
    }
</style>