<script lang="ts">
	import {
		FileText,
		Download,
		ArrowLeft,
		Loader2,
		CheckCircle,
		Clock,
		MapPin,
		User
	} from 'lucide-svelte';
	import { invoicePublicAPI } from '$lib/API/Public/InvoicePublicAPI';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/Config/routes.config';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { InvoiceDetail } from '$lib/types/entities/Invoice';

	let invoice = $state<InvoiceDetail | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	let invoiceId = $derived($page.params.id);

	onMount(async () => {
		try {
			invoice = await invoicePublicAPI.getInvoiceDetail(invoiceId);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load invoice';
			toastService.error('Error', error);
		} finally {
			isLoading = false;
		}
	});

	function formatPrice(amount: number, currency: string = 'CZK'): string {
		return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency }).format(amount);
	}

	function formatDate(dateStr: string): string {
		return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
	}

	async function downloadPdf() {
		if (!invoice) return;
		try {
			const blob = await invoicePublicAPI.downloadInvoicePdf(invoice.id);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `invoice-${invoice.invoiceNumber}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch {
			toastService.error('Error', 'Failed to download invoice PDF');
		}
	}
</script>

<svelte:head>
	<title>{invoice ? `Invoice #${invoice.invoiceNumber}` : 'Invoice'} | My Account</title>
</svelte:head>

<div class="">
	<!-- Back nav -->
	<button
		onclick={() => goto(ROUTES.USER.INVOICES)}
		class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
	>
		<ArrowLeft class="w-4 h-4" />
		Back to Invoices
	</button>

	{#if isLoading}
		<div class="flex items-center justify-center py-20">
			<Loader2 class="w-8 h-8 animate-spin text-blue-500" />
		</div>
	{:else if error}
		<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
			<p class="text-red-600 dark:text-red-400">{error}</p>
		</div>
	{:else if invoice}
		<!-- Invoice Card -->
		<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
			<!-- Header -->
			<div class="p-6 sm:p-8 border-b border-gray-200 dark:border-slate-800">
				<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div>
						<div class="flex items-center gap-3 mb-2">
							<div class="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0">
								<FileText class="w-5 h-5 text-indigo-400" />
							</div>
							<h1 class="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Invoice #{invoice.invoiceNumber}</h1>
						</div>
						{#if invoice.paid}
							<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
								<CheckCircle class="w-4 h-4" />
								Paid {invoice.paidDate ? `on ${formatDate(invoice.paidDate)}` : ''}
							</span>
						{:else}
							<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium">
								<Clock class="w-4 h-4" />
								Unpaid
							</span>
						{/if}
					</div>

					<button onclick={downloadPdf}
						class="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors self-start">
						<Download class="w-4 h-4" />
						Download PDF
					</button>
				</div>
			</div>

			<!-- Dates & Billing -->
			<div class="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-gray-200 dark:border-slate-800">
				<div>
					<h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Invoice Dates</h3>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Issued</span>
							<span class="font-medium text-gray-900 dark:text-white">{formatDate(invoice.issuedDate)}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Due</span>
							<span class="font-medium text-gray-900 dark:text-white">{formatDate(invoice.dueDate)}</span>
						</div>
						{#if invoice.paidDate}
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">Paid</span>
								<span class="font-medium text-green-600 dark:text-green-400">{formatDate(invoice.paidDate)}</span>
							</div>
						{/if}
					</div>
				</div>

				<div>
					<h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
						<User class="w-3 h-3" />
						Billed To
					</h3>
					<div class="text-sm text-gray-900 dark:text-white space-y-1">
						<p class="font-medium">{invoice.billingFirstName} {invoice.billingLastName}</p>
						<p class="text-gray-600 dark:text-gray-400">{invoice.billingEmail}</p>
						<div class="flex items-start gap-1 text-gray-600 dark:text-gray-400 mt-2">
							<MapPin class="w-3 h-3 mt-0.5 shrink-0" />
							<div>
								<p>{invoice.billingStreet}</p>
								<p>{invoice.billingCity}, {invoice.billingPostalCode}</p>
								<p>{invoice.billingCountry}</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Line Items -->
			<div class="p-6 sm:p-8">
				<h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Items</h3>

				<div class="hidden sm:grid sm:grid-cols-12 gap-4 pb-3 border-b border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
					<div class="col-span-6">Course</div>
					<div class="col-span-3 text-right">Original Price</div>
					<div class="col-span-3 text-right">Price Paid</div>
				</div>

				<div class="divide-y divide-gray-100 dark:divide-slate-800">
					{#each invoice.items as item}
						<div class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 py-4 text-sm">
							<div class="col-span-6 font-medium text-gray-900 dark:text-white">{item.courseName}</div>
							<div class="col-span-3 text-right text-gray-500 dark:text-gray-400">{formatPrice(item.originalPrice, invoice.currency)}</div>
							<div class="col-span-3 text-right font-semibold text-gray-900 dark:text-white">{formatPrice(item.pricePaid, invoice.currency)}</div>
						</div>
					{/each}
				</div>

				<div class="mt-4 pt-4 border-t-2 border-gray-200 dark:border-slate-700 flex justify-between items-center">
					<span class="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
					<span class="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(invoice.totalAmount, invoice.currency)}</span>
				</div>
			</div>
		</div>
	{/if}
</div>
