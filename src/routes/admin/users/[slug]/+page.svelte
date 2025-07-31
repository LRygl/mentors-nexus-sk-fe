<script lang="ts">
	import { page } from '$app/state';
	import { users } from '$lib/stores/user-store';
	import type { User } from '$lib/types/user';
	import PrivacyToggle from '$lib/components/privacy-toggle.svelte';
	import { courseColumns } from '../../course/course-columns';
	import DataTable from '$lib/components/data-table.svelte';
	import DataTableAsyncWrapper from '$lib/components/data-table-async-wrapper.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { BookCheck } from 'lucide-svelte';

	// Get the slug from the URL
	$: slug = page.params.slug;

	// Convert slug to number if your User.id is a number
	$: userId = slug ? parseInt(slug) : null;

	// Load user data when slug changes
	$: if (slug) {
		users.loadUser(slug);
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatDateTime(dateString: string): string {
		return new Date(dateString).toLocaleString('en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			timeZoneName: 'short'
		});
	}

	function togglePrivacySetting(setting: 'personalDataProcessing' | 'personalDataPublishing' | 'marketing') {
		if (currentUser) {
			// This would trigger an API call to update the setting
			console.log(`Toggle ${setting} for user ${currentUser.id}`);
		}
	}


	// Get the specific user from the store data
	$: currentUser = userId ? $users.data.find(user => user.id === userId) : null;
</script>

{#if $users.loading}
	<div class="flex items-center justify-center h-64">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		<p class="ml-4 text-gray-600 dark:text-gray-300">Loading user...</p>
	</div>
{:else if $users.error}
	<div class="flex flex-col items-center justify-center h-64 space-y-4">
		<div class="text-red-600 text-center">
			<p class="text-lg font-semibold">Error loading user</p>
			<p class="text-sm">{$users.error}</p>
		</div>
		<button
			onclick={() => users.loadUser(slug)}
			class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
		>
			Retry
		</button>
	</div>
{:else if currentUser}
	<div class="flex flex-col w-full px-8 py-6 space-y-12 overflow-y-auto">

		<!-- Header & Avatar -->
		<div class="relative w-full h-40 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
			<img
				class="absolute bottom-0 left-6 -mb-12 w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 shadow-lg"
				src={currentUser.userProfileImageUrl || "https://i.pravatar.cc/100?img=8"}
				alt="User avatar"
			/>
		</div>

		<!-- User Details Form -->
		<form class="pt-16 space-y-10">

			<!-- Basic Info & Actions -->
			<div class="flex flex-col md:flex-row md:items-center md:justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
						{currentUser.firstName} {currentUser.lastName}
					</h1>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						<Badge>{currentUser.role}</Badge>
					</p>
				</div>
				<div class="flex gap-3 mt-4 md:mt-0">
					<button type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Edit</button>
					<button type="button" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm">Reset Password</button>
					<button type="button" class="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm">
						{!currentUser.accountNonLocked ? 'Disable' : 'Enable'}
					</button>
				</div>
			</div>

			<!-- Account Flags -->
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
				<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<p class="text-gray-500 dark:text-gray-400">Account Locked</p>
					<p class="text-xl font-bold {currentUser.isAccountNonLocked ? 'text-green-600' : 'text-red-600'}">
						{currentUser.isAccountNonLocked ? 'No' : 'Yes'}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<p class="text-gray-500 dark:text-gray-400">Account Expired</p>
					<p class="text-xl font-bold {currentUser.accountNonExpired ? 'text-green-600' : 'text-red-600'}">
						{currentUser.accountNonExpired ? 'No' : 'Yes'}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<p class="text-gray-500 dark:text-gray-400">Credentials Expired</p>
					<p class="text-xl font-bold {currentUser.credentialsNonExpired ? 'text-green-600' : 'text-red-600'}">
						{currentUser.credentialsNonExpired ? 'No' : 'Yes'}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
					<p class="text-gray-500 dark:text-gray-400">Joined Courses</p>
					<p class="text-xl font-bold">
						{currentUser.joinedCourses.length}
					</p>
				</div>
			</div>

			<!-- Authorities -->
			{#if currentUser.authorities && currentUser.authorities.length > 0}
				<div>
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Authorities</h3>
					<div class="flex flex-wrap gap-2 text-xs">
						{#each currentUser.authorities as authority}
              <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                {authority.authority || authority.name}
              </span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Contact & Account Info -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">

				<!-- Contact Info -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Contact Information</h3>

					<div>
						<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Email</label>
						<input
							type="email"
							value={currentUser.email}
							disabled
							class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
						/>
					</div>

					<div>
						<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Phone</label>
						<input
							type="tel"
							value={currentUser.telephoneNumber}
							disabled
							class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
						/>
					</div>

					<div>
						<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Username</label>
						<input
							type="text"
							value={currentUser.username || currentUser.email}
							disabled
							class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
						/>
					</div>

					<div>
						<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">UUID</label>
						<input
							type="text"
							value={currentUser.uuid}
							disabled
							class="w-full px-4 py-2 font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-xs text-gray-700 dark:text-white"
						/>
					</div>
				</div>

				<!-- Account Info -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Account Information</h3>

					<div>
						<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Registered</label>
						<input
							type="text"
							value={formatDate(currentUser.registerDate)}
							disabled
							class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
						/>
					</div>

					{#if currentUser.lastLoginDate}
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Last Login</label>
							<input
								type="text"
								value={currentUser.lastLoginDateDisplay || formatDateTime(currentUser.lastLoginDate)}
								disabled
								class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
							/>
						</div>
					{/if}

					{#if currentUser.lastUpdatedDate}
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
							<input
								type="text"
								value={formatDate(currentUser.lastUpdatedDate)}
								disabled
								class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
							/>
						</div>
					{/if}

					{#if currentUser.forcePasswordChangeOnLogin}
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Force Password Change</label>
							<input
								type="text"
								value={currentUser.forcePasswordChangeOnLogin ? 'Yes' : 'No'}
								disabled
								class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white"
							/>
						</div>
					{/if}
				</div>
			</div>
		</form>

		<!-- Password Reset Info -->
		{#if currentUser.passwordResetOperationUUID && currentUser.passwordResetExpiryDate}
			<div>
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">Password Reset Status</h3>
				<p class="text-sm text-gray-600 dark:text-gray-300">
					Reset token <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">{currentUser.passwordResetOperationUUID}</code>
					valid until <strong>{formatDate(currentUser.passwordResetExpiryDate)}</strong>
				</p>
			</div>
		{/if}

		<!-- Privacy Preferences with toggles -->
		<div>
			<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Privacy & Marketing Preferences</h3>

			<div class="space-y-4 text-sm text-gray-600 dark:text-gray-300">

				<div class="flex justify-between items-center">
						{#if currentUser}
						<PrivacyToggle
							userId={currentUser.id.toString()}
							setting="personalDataProcessing"
							label="Personal Data Processing"
							description="Allow processing of your personal data for service improvement"
						/>

						<PrivacyToggle
							userId={currentUser.id.toString()}
							setting="personalDataPublishing"
							label="Personal Data Publishing"
							description="Allow publishing of anonymized personal data for research"
						/>

						<PrivacyToggle
							userId={currentUser.id.toString()}
							setting="marketing"
							label="Marketing Communications"
							description="Receive marketing emails and promotional content"
						/>
					{/if}
				</div>
			</div>
		</div>

		<!-- Owned Courses -->
		{#if currentUser.ownedCourses && currentUser.ownedCourses.length > 0}
			<div>
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Owned Courses
				<Badge
					class="rounded-full"
				>
					<BookCheck />
					{currentUser.ownedCourses.length}
				</Badge>
				</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each currentUser.ownedCourses as course}
						<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
							<h4 class="font-medium text-gray-900 dark:text-white">{course.name}</h4>
							<p class="text-sm text-gray-500 dark:text-gray-400">Status:
								<span class="font-medium {course.status === 'PUBLISHED' ? 'text-green-600' : 'text-yellow-600'}">
                  {course.status}
                </span>
							</p>
							{#if course.price}
								<p class="text-sm text-gray-500 dark:text-gray-400">Price: €{course.price}</p>
							{/if}
							<p class="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">{course.uuid}</p>
						</div>
					{/each}
				</div>

				DATATABLE


				<section class="space-y-6">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Address</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Street Address</label>
							<input type="text" value="Main Street 123" disabled
										 class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white" />
						</div>
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">City</label>
							<input type="text" value="Berlin" disabled
										 class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white" />
						</div>
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">ZIP / Postal Code</label>
							<input type="text" value="10115" disabled
										 class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white" />
						</div>
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Country</label>
							<input type="text" value="Germany" disabled
										 class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white" />
						</div>
					</div>
				</section>

				<!-- 🧾 Invoices -->
				<section class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Invoice History</h3>
					<div class="overflow-auto">
						<table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
							<thead class="bg-gray-100 dark:bg-gray-800 text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
							<tr>
								<th class="px-4 py-3">Invoice #</th>
								<th class="px-4 py-3">Date</th>
								<th class="px-4 py-3">Amount</th>
								<th class="px-4 py-3">Status</th>
								<th class="px-4 py-3 text-right">Download</th>
							</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
							<tr class="bg-white dark:bg-gray-900">
								<td class="px-4 py-2">INV-2025-00123</td>
								<td class="px-4 py-2">2025-06-20</td>
								<td class="px-4 py-2">€89.00</td>
								<td class="px-4 py-2"><span class="text-green-600 font-medium">Paid</span></td>
								<td class="px-4 py-2 text-right">
									<a href="#" class="text-blue-600 hover:underline text-sm">Download PDF</a>
								</td>
							</tr>
							<tr class="bg-white dark:bg-gray-900">
								<td class="px-4 py-2">INV-2025-00124</td>
								<td class="px-4 py-2">2025-07-05</td>
								<td class="px-4 py-2">€129.00</td>
								<td class="px-4 py-2"><span class="text-yellow-600 font-medium">Pending</span></td>
								<td class="px-4 py-2 text-right">
									<a href="#" class="text-blue-600 hover:underline text-sm">Download PDF</a>
								</td>
							</tr>
							<!-- more rows -->
							</tbody>
						</table>
					</div>
				</section>

				<!-- 💳 Billing Details -->
				<section class="space-y-6">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white">Billing Details</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Company Name</label>
							<input type="text" value="Edusoft GmbH" disabled
										 class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white" />
						</div>
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">VAT / Tax ID</label>
							<input type="text" value="DE123456789" disabled
										 class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white" />
						</div>
						<div>
							<label class="block mb-1 font-medium text-gray-700 dark:text-gray-300">Billing Email</label>
							<input type="text" value="billing@edusoft.de" disabled
										 class="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-white" />
						</div>
					</div>
				</section>


				<!-- Event Log Table -->
				<div class="space-y-4">
					<h3 class="text-lg font-semibold text-gray-800 dark:text-white">User Events</h3>

					<div class="overflow-auto">
						<table class="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
							<thead class="bg-gray-100 dark:bg-gray-800 text-xs uppercase font-medium text-gray-500 dark:text-gray-400">
							<tr>
								<th class="px-4 py-3">UUID</th>
								<th class="px-4 py-3">Resource UUID</th>
								<th class="px-4 py-3">Name</th>
								<th class="px-4 py-3">Value</th>
								<th class="px-4 py-3">Category</th>
								<th class="px-4 py-3">Type</th>
								<th class="px-4 py-3">Origin</th>
								<th class="px-4 py-3">Timestamp</th>
							</tr>
							</thead>
							<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
							<!-- Example row -->
							<tr class="bg-white dark:bg-gray-900">
								<td class="px-4 py-2 font-mono text-xs">3fa85f64-5717-4562-b3fc-2c963f66afa6</td>
								<td class="px-4 py-2 font-mono text-xs">c14dca3a-7843-41c3-a999-125acf26b3b0</td>
								<td class="px-4 py-2">consent.marketing</td>
								<td class="px-4 py-2">true</td>
								<td class="px-4 py-2 text-blue-600 font-medium">USER</td>
								<td class="px-4 py-2 text-green-600 font-medium">CONSENT_UPDATE</td>
								<td class="px-4 py-2">admin-panel</td>
								<td class="px-4 py-2">2025-07-12T14:22:01Z</td>
							</tr>
							<!-- Repeat rows dynamically -->
							</tbody>
						</table>
					</div>
				</div>

			</div>
		{/if}

		<!-- Joined Courses -->
		{#if currentUser.joinedCourses && currentUser.joinedCourses.length > 0}
			<div>
				<h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Joined Courses</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each currentUser.joinedCourses as course}
						<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
							<h4 class="font-medium text-gray-900 dark:text-white">{course.name}</h4>
							<p class="text-sm text-gray-500 dark:text-gray-400">Status:
								<span class="font-medium {course.status === 'PUBLISHED' ? 'text-green-600' : 'text-yellow-600'}">
                  {course.status}
                </span>
							</p>
							{#if course.price}
								<p class="text-sm text-gray-500 dark:text-gray-400">Price: €{course.price}</p>
							{/if}
							<p class="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">{course.uuid}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="flex flex-col items-center justify-center h-64 space-y-4">
		<div class="text-gray-500 dark:text-gray-400 text-center">
			<p class="text-lg font-semibold">User not found</p>
			<p class="text-sm">The user with ID "{slug}" could not be found.</p>
		</div>
	</div>
{/if}