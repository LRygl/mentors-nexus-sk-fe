<script lang="ts">
 export const trailingSlash = 'never';
 export const reset = true;
</script>

<div class="flex flex-col w-60 bg-orange-300 h-screen">
	<div class="flex flex-col w-60 bg-orange-300">
		<!-- Head Section with Logo and Tiny Text -->
		<div class="relative flex mt-8 items-center justify-center px-4">
			<!-- Application Logo -->
			<img src="your-logo.png" alt="App Logo" class="w-24 h-12">
		</div>
	</div>
	<div class="block w-full mt-5 overflow-hidden">
		<!-- Sidebar Item -->
		<div class="flex flex-row items-center w-4/5 gap-x-4 px-5 h-12 mx-auto transition-all duration-300 ease-in-out bg-amber-500 hover:bg-amber-600 relative">
			<!-- SVG Home Icon -->
			<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9m0 0l9 9m-9-9v18" />
			</svg>
			<a class="text-white text-sm relative z-10">Home</a>
		</div>

		<!-- Sidebar Item -->
		<div class="flex flex-row items-center w-4/5 gap-x-4 px-5 h-12 mx-auto transition-all duration-300 ease-in-out bg-amber-500 hover:bg-amber-600 relative">
			<!-- SVG Home Icon -->
			<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9m0 0l9 9m-9-9v18" />
			</svg>
			<a class="text-white text-sm relative z-10">Home</a>
		</div>

		<!-- Sidebar Item -->
		<div class="flex flex-row items-center w-4/5 gap-x-4 px-5 h-12 mx-auto transition-all duration-300 ease-in-out bg-amber-500 hover:bg-amber-600 relative">
			<!-- SVG Home Icon -->
			<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 12l9-9m0 0l9 9m-9-9v18" />
			</svg>
			<a class="text-white text-sm relative z-10">Home</a>
		</div>

	</div>
	<!-- Section Heading -->
	<div class="mt-5 pl-5 font-bold text-md text-amber-900">Section</div>

	<!-- Bottom Row of Buttons -->
	<div class="mt-auto flex flex-col space-y-3 p-4">
		<button class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">Profile</button>
		<button class="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none">Settings</button>
		<button class="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none">Logout</button>
	</div>
</div>

<slot/>