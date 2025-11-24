<script lang="ts">
	import HeaderSection from '$lib/components/Sections/Public/header-section.svelte';
	import SubheadingSection from '$lib/components/Sections/Public/subheading-section.svelte';
	import {
		AlertTriangle,
		BookOpen,
		Clock,
		CreditCard,
		Mail,
		Phone,
		Scale,
		Shield,
		User
	} from 'lucide-svelte';

	const subHeading = 'Please read these terms carefully before using our services.';
	const showBadge = true;
	const badgeText = 'Legal';

	interface HeaderProps {
		heading: string;
		subHeading: string;
		showBadge: boolean;
		badgeText: string;
	}

	let { heading}: HeaderProps = $props();

	// Terms sections data
	const termsData = [
		{
			id: 'acceptance',
			title: 'Acceptance of Terms',
			icon: Scale,
			content: [
				'By accessing and using our Learning Management System (LMS), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.',
				'If you do not agree to these terms, please discontinue use of our services immediately.',
				'These terms apply to all users, including students, instructors, administrators, and visitors.'
			]
		},
		{
			id: 'user-accounts',
			title: 'User Accounts and Registration',
			icon: User,
			content: [
				'Users must provide accurate, current, and complete information during registration.',
				'You are responsible for maintaining the confidentiality of your account credentials.',
				'Users must notify us immediately of any unauthorized use of their account.',
				'We reserve the right to suspend or terminate accounts that violate these terms.'
			]
		},
		{
			id: 'course-access',
			title: 'Course Access and Content',
			icon: BookOpen,
			content: [
				'1. Access to course is granted based on enrollment and payment status.',
				'Course content is for personal, non-commercial use only unless otherwise specified.',
				'Users may not redistribute, modify, or resell course materials without explicit permission.',
				'We reserve the right to modify or discontinue course with reasonable notice.'
			]
		},
		{
			id: 'payment-terms',
			title: 'Payment and Billing',
			icon: CreditCard,
			content: [
				'All fees are due in advance and are non-refundable unless otherwise stated.',
				'Subscription fees are billed automatically on the renewal date.',
				'Users are responsible for maintaining current payment information.',
				'Late payments may result in service suspension or account termination.'
			]
		},
		{
			id: 'user-conduct',
			title: 'User Conduct and Responsibilities',
			icon: Shield,
			content: [
				'Users must conduct themselves professionally and respectfully at all times.',
				'Harassment, discrimination, or inappropriate behavior is strictly prohibited.',
				'Users may not share copyrighted materials without proper authorization.',
				'Any attempt to compromise system security will result in immediate termination.'
			]
		},
		{
			id: 'intellectual-property',
			title: 'Intellectual Property Rights',
			icon: AlertTriangle,
			content: [
				'All course content, materials, and platform features are protected by intellectual property laws.',
				'Users retain ownership of original content they create and upload.',
				'By uploading content, users grant us a license to use, display, and distribute such content.',
				'We respect intellectual property rights and will respond to valid takedown requests.'
			]
		}
	];

	const lastUpdated = 'January 15, 2025';
	const effectiveDate = 'February 1, 2025';


</script>

<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-gray-800 dark:text-gray-100">
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<HeaderSection
			heading="Terms & Conditions"
			subHeading="Please read these terms carefully before using our services"
			showBadge={true}
			badgeText="Legal"
		/>
	</div>
</section>

	<!-- Terms Content -->
	<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

		<!-- Date Information -->
		<div class="mb-12 grid md:grid-cols-2 gap-6">
			<div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
				<div class="flex items-center gap-3 mb-2">
					<Clock class="w-5 h-5 text-blue-600 dark:text-blue-400" />
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">Last Updated</h3>
				</div>
				<p class="text-gray-600 dark:text-gray-300">{lastUpdated}</p>
			</div>
			<div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
				<div class="flex items-center gap-3 mb-2">
					<Scale class="w-5 h-5 text-green-600 dark:text-green-400" />
					<h3 class="font-semibold text-gray-900 dark:text-gray-100">Effective Date</h3>
				</div>
				<p class="text-gray-600 dark:text-gray-300">{effectiveDate}</p>
			</div>
		</div>

		<!-- Terms Sections -->
		<div class="space-y-8">
			{#each termsData as section, sectionIndex}
				<div class="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
					<div class="p-8">
						<div class="flex items-start gap-4 mb-6">
							<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<svelte:component this={section.icon} class="w-6 h-6 text-white" />
							</div>
							<div>
								<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
									{sectionIndex + 1}. {section.title}
								</h2>
							</div>
						</div>

						<div class="space-y-4 ml-16">
							{#each section.content as paragraph, contentIndex}
								<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span class="font-semibold text-gray-800 dark:text-gray-200">
                    {sectionIndex + 1}.{contentIndex + 1} -
                  </span>
									{paragraph}
								</p>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Additional Terms -->
		<div class="mt-12 space-y-8">
			<!-- Privacy and Data Protection -->
			<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8">
				<div class="flex items-start gap-4 mb-6">
					<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
						<Shield class="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
							7. Privacy and Data Protection
						</h2>
					</div>
				</div>

				<div class="ml-16 space-y-4">
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
						We are committed to protecting your privacy and personal data in accordance with applicable data protection laws.
					</p>
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
						Our Privacy Policy, which forms part of these terms, details how we collect, use, and protect your information.
					</p>
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
						You have the right to access, modify, or delete your personal data subject to legal and contractual obligations.
					</p>
				</div>
			</div>

			<!-- Limitations and Disclaimers -->
			<div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 dark:border-gray-700/50 p-8">
				<div class="flex items-start gap-4 mb-6">
					<div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
						<AlertTriangle class="w-6 h-6 text-white" />
					</div>
					<div>
						<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
							8. Limitations of Liability
						</h2>
					</div>
				</div>

				<div class="ml-16 space-y-4">
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
						Our services are provided "as is" without warranties of any kind, either express or implied.
					</p>
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
						We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
					</p>
					<p class="text-gray-700 dark:text-gray-300 leading-relaxed">
						Our maximum liability shall not exceed the amount paid by you for our services in the twelve months preceding the claim.
					</p>
				</div>
			</div>
		</div>

		<!-- Contact Information -->
		<div class="mt-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 rounded-3xl p-8">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
				Questions About These Terms?
			</h2>
			<p class="text-gray-700 dark:text-gray-300 text-center mb-8 leading-relaxed">
				If you have any questions about these Terms and Conditions, please don't hesitate to contact us.
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<div class="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 px-6 py-3 rounded-2xl">
					<Mail class="w-5 h-5 text-blue-600 dark:text-blue-400" />
					<span class="text-gray-700 dark:text-gray-300">legal@lmsplatform.com</span>
				</div>
				<div class="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 px-6 py-3 rounded-2xl">
					<Phone class="w-5 h-5 text-green-600 dark:text-green-400" />
					<span class="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
				</div>
			</div>
		</div>

		<!-- Footer Note -->
		<div class="mt-12 text-center">
			<p class="text-sm text-gray-500 dark:text-gray-400">
				By continuing to use our Learning Management System, you acknowledge that you have read and agree to these Terms and Conditions.
			</p>
		</div>
	</section>