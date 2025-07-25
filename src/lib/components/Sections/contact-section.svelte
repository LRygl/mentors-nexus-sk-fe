<script lang="ts">
	import { Mail, Phone, MessageCircle } from 'lucide-svelte';
</script>

<section class="py-24">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
		<h3 class="text-3xl lg:text-4xl font-bold text-center mb-16">
			Still need help?
		</h3>

		<div class="grid sm:grid-cols-3 gap-8">
			<!-- E-mail -->
			<a
				href="mailto:support@lms.com"
				class="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl
               shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
			>
				<div
					class="mb-4 p-4 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600
                 dark:text-blue-300 group-hover:scale-110 transition-transform"
				>
					<Mail size={32} />
				</div>
				<span class="font-semibold text-lg">E-mail us</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          support@lms.com
        </span>
			</a>

			<!-- Chat -->
			<a
				href="#"
				class="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl
               shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
			>
				<div
					class="mb-4 p-4 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600
                 dark:text-green-300 group-hover:scale-110 transition-transform"
				>
					<MessageCircle size={32} />
				</div>
				<span class="font-semibold text-lg">Live chat</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Usually replies in minutes
        </span>
			</a>

			<!-- Phone -->
			<a
				href="tel:+123456789"
				class="group flex flex-col items-center p-8 bg-white dark:bg-gray-800 rounded-2xl
               shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
			>
				<div
					class="mb-4 p-4 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600
                 dark:text-purple-300 group-hover:scale-110 transition-transform"
				>
					<Phone size={32} />
				</div>
				<span class="font-semibold text-lg">Call us</span>
				<span class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          +1 (234) 567-890
        </span>
			</a>
		</div>
	</div>
</section>