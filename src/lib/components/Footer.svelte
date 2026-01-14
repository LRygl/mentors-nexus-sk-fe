<!-- Footer.svelte -->
<script lang="ts">
	interface FooterLink {
		label: string;
		href: string;
	}

	interface SocialLink {
		name: string;
		href: string;
		icon: string; // You can replace with actual icon component
	}

	const companyLinks: FooterLink[] = [
		{ label: 'About', href: '/about' },
		{ label: 'Careers', href: '/careers' },
		{ label: 'Blog', href: '/blog' },
		{ label: 'Press', href: '/press' }
	];

	const productLinks: FooterLink[] = [
		{ label: 'Features', href: '/features' },
		{ label: 'Pricing', href: '/pricing' },
		{ label: 'Documentation', href: '/docs' },
		{ label: 'API', href: '/API' }
	];

	const supportLinks: FooterLink[] = [
		{ label: 'Help Center', href: '/help' },
		{ label: 'Contact Us', href: '/contact' },
		{ label: 'Privacy Policy', href: '/privacy' },
		{ label: 'Terms of Service', href: '/terms' }
	];

	const socialLinks: SocialLink[] = [
		{ name: 'Twitter', href: 'https://twitter.com', icon: '𝕏' },
		{ name: 'LinkedIn', href: 'https://linkedin.com', icon: 'in' },
		{ name: 'GitHub', href: 'https://github.com', icon: '⚡' },
		{ name: 'Discord', href: 'https://discord.com', icon: '💬' }
	];

	const currentYear: number = new Date().getFullYear();

	// Props for customization
	interface Props {
		companyName?: string;
		backgroundColor?: string;
		textColor?: string;
		showNewsletter?: boolean;
	}

	let {
		companyName = 'Your Company',
		backgroundColor = 'bg-gray-900',
		textColor = 'text-gray-300',
		showNewsletter = true
	}: Props = $props();

	let email = $state('');

	function handleNewsletterSubmit(event: Event): void {
		event.preventDefault();
		console.log('Newsletter signup:', email);
		// Add your newsletter signup logic here
		email = '';
	}
</script>

<footer class="{backgroundColor} {textColor} pt-12 pb-4 border-t border-white/10">
	<div class="max-w-7xl mx-auto px-4">
		<!-- Main Footer Content -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
			<!-- Company Info -->
			<div class="lg:col-span-2 flex flex-col gap-4">
				<h3 class="text-2xl font-bold text-white mb-2">{companyName}</h3>
				<p class="text-sm leading-relaxed mb-4">
					Building the future with innovative solutions and exceptional user experiences.
				</p>

				<!-- Social Links -->
				<div class="flex gap-4">
					{#each socialLinks as social}
						<a
							href={social.href}
							class="flex items-center justify-center w-10 h-10 bg-white/10 rounded-lg text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
							aria-label={social.name}
							target="_blank"
							rel="noopener noreferrer"
						>
							{social.icon}
						</a>
					{/each}
				</div>
			</div>

			<!-- Company Links -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold text-white mb-2">Company</h4>
				<ul class="space-y-2">
					{#each companyLinks as link}
						<li>
							<a href={link.href} class="text-sm hover:text-white transition-colors duration-200">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Product Links -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold text-white mb-2">Product</h4>
				<ul class="space-y-2">
					{#each productLinks as link}
						<li>
							<a href={link.href} class="text-sm hover:text-white transition-colors duration-200">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Support Links -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold text-white mb-2">Support</h4>
				<ul class="space-y-2">
					{#each supportLinks as link}
						<li>
							<a href={link.href} class="text-sm hover:text-white transition-colors duration-200">{link.label}</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Newsletter Signup -->
			{#if showNewsletter}
				<div class="lg:col-span-5 xl:col-span-1 flex flex-col gap-4 mt-8 lg:mt-0">
					<h4 class="text-lg font-semibold text-white mb-2">Stay Updated</h4>
					<p class="text-sm leading-relaxed mb-4">
						Subscribe to our newsletter for the latest updates.
					</p>
					<form onsubmit={handleNewsletterSubmit} class="flex flex-col sm:flex-row gap-2">
						<input
							type="email"
							bind:value={email}
							placeholder="Enter your email"
							class="flex-1 px-3 py-3 border border-white/20 rounded-md bg-white/5 text-white text-sm placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors duration-200"
							required
						/>
						<button
							type="submit"
							class="px-6 py-3 bg-white text-gray-900 rounded-md font-semibold text-sm hover:bg-white/90 hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
						>
							Subscribe
						</button>
					</form>
				</div>
			{/if}
		</div>

		<!-- Footer Bottom -->
		<div class="border-t border-white/10 pt-6">
			<div class="flex flex-col sm:flex-row justify-between items-center gap-4">
				<p class="text-sm">
					© {currentYear} {companyName}. All rights reserved.
				</p>
				<div class="flex gap-6">
					<a href="/privacy" class="text-sm hover:text-white transition-colors duration-200">Privacy</a>
					<a href="/terms" class="text-sm hover:text-white transition-colors duration-200">Terms</a>
					<a href="/cookies" class="text-sm hover:text-white transition-colors duration-200">Cookies</a>
				</div>
			</div>
		</div>
	</div>
</footer>