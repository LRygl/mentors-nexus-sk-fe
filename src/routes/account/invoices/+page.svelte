<script lang="ts">
	import {
		FileText,
		CheckCircle2,
		Clock,
		Loader2,
		ReceiptText,
		Wallet,
		ShoppingBag
	} from 'lucide-svelte';
	import AccountPageHeader from '$lib/components/UI/AccountPageHeader.svelte';
	import { invoicePublicAPI } from '$lib/API/Public/InvoicePublicAPI';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/Config/routes.config';
	import { toastService } from '$lib/Services/ToastService.svelte';
	import { onMount } from 'svelte';
	import type { InvoiceListItem } from '$lib/types/entities/Invoice';
	import UniversalDataTable from '$lib/components/Data Table/UniversalDataTable.svelte';
	import type { TableCallbacks } from '$lib/types/ui/table';
	import {
		invoiceTableConfig,
		invoiceTableColumns,
		getInvoiceActions,
		invoiceTableProps,
		formatPrice
	} from '$lib/components/Data Table/Configurations/InvoiceTableConfiguration';

	// ── State ─────────────────────────────────────────────────────────────────
	let invoices = $state<InvoiceListItem[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		await loadInvoices();
	});

	async function loadInvoices() {
		isLoading = true;
		error = null;
		try {
			invoices = await invoicePublicAPI.getMyInvoices();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load invoices';
			toastService.error('Error', error ?? 'Unknown error');
		} finally {
			isLoading = false;
		}
	}

	// ── Helpers ───────────────────────────────────────────────────────────────
	async function downloadPdf(invoiceId: string, invoiceNumber: string) {
		try {
			const blob = await invoicePublicAPI.downloadInvoicePdf(invoiceId);
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `invoice-${invoiceNumber}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch {
			toastService.error('Error', 'Failed to download invoice PDF');
		}
	}

	// ── Derived stats ─────────────────────────────────────────────────────────
	let totalInvoices    = $derived(invoices.length);
	let paidCount        = $derived(invoices.filter((i) => i.paid).length);
	let unpaidCount      = $derived(invoices.filter((i) => !i.paid).length);
	let outstandingTotal = $derived(
		invoices
			.filter((i) => !i.paid)
			.reduce((sum, i) => sum + i.totalAmount, 0)
	);
	// Use currency of first unpaid invoice (or CZK as default)
	let outstandingCurrency = $derived(
		invoices.find((i) => !i.paid)?.currency ?? 'CZK'
	);

	// ── Table callbacks (page-specific: navigate + download) ──────────────────
	const tableCallbacks: TableCallbacks<InvoiceListItem> = {
		onRowClick: (invoice) => {
			goto(ROUTES.USER.INVOICE_DETAIL(invoice.id));
		},
		onAction: async (actionId, invoice) => {
			switch (actionId) {
				case 'view':
					await goto(ROUTES.USER.INVOICE_DETAIL(invoice.id));
					break;
				case 'download-pdf':
					await downloadPdf(String(invoice.id), invoice.invoiceNumber);
					break;
			}
		},
		onRefresh: async () => {
			await loadInvoices();
		}
	};
</script>

<svelte:head>
	<title>My Invoices | My Account</title>
</svelte:head>

<div class="min-h-screen">

	<AccountPageHeader
		icon={ReceiptText}
		title="My Invoices"
		subtitle="View and download your purchase invoices."
	/>

	{#if isLoading && invoices.length === 0}
		<!-- Initial load spinner (table shows its own loader after data exists) -->
		<div class="flex flex-col items-center justify-center py-32 gap-4">
			<Loader2 class="w-10 h-10 animate-spin text-indigo-500" />
			<p class="text-sm text-gray-500 dark:text-slate-400">Loading your invoices…</p>
		</div>

	{:else if !isLoading && invoices.length === 0 && !error}
		<!-- ── Empty state ────────────────────────────────── -->
		<div class="rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur p-16 text-center">
			<div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
				<FileText class="w-8 h-8 text-indigo-400" />
			</div>
			<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No invoices yet</h2>
			<p class="text-gray-500 dark:text-slate-400 text-sm mb-7 max-w-xs mx-auto">
				Once you purchase a course, your invoices will appear here.
			</p>
			<button
				onclick={() => goto(ROUTES.PUBLIC.STORE)}
				class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5"
			>
				<ShoppingBag class="w-4 h-4" />
				Browse Courses
			</button>
		</div>

	{:else}
		<!-- ── Stats row ───────────────────────────────────── -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
			{#each [
				{
					label: 'Total Invoices',
					value: totalInvoices,
					icon: FileText,
					color: 'text-indigo-400',
					bg: 'bg-indigo-500/10 border-indigo-500/20'
				},
				{
					label: 'Paid',
					value: paidCount,
					icon: CheckCircle2,
					color: 'text-emerald-400',
					bg: 'bg-emerald-500/10 border-emerald-500/20'
				},
				{
					label: 'Unpaid',
					value: unpaidCount,
					icon: Clock,
					color: 'text-amber-400',
					bg: 'bg-amber-500/10 border-amber-500/20'
				},
				{
					label: 'Outstanding',
					value: formatPrice(outstandingTotal, outstandingCurrency),
					icon: Wallet,
					color: unpaidCount > 0 ? 'text-rose-400' : 'text-slate-400',
					bg: unpaidCount > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-slate-500/10 border-slate-500/20'
				}
			] as stat}
				<div class="rounded-xl border {stat.bg} bg-white/60 dark:bg-slate-900/60 backdrop-blur px-5 py-4 flex items-center gap-4">
					<div class="p-2 rounded-lg {stat.bg} border flex-shrink-0">
						<stat.icon class="w-5 h-5 {stat.color}" />
					</div>
					<div class="min-w-0">
						<div class="text-xl font-bold text-gray-900 dark:text-white truncate">{stat.value}</div>
						<div class="text-xs text-gray-500 dark:text-slate-400">{stat.label}</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- ── Data Table ─────────────────────────────────── -->
		<UniversalDataTable
			data={invoices}
			loading={isLoading}
			error={error}
			config={invoiceTableConfig}
			columns={invoiceTableColumns}
			callbacks={tableCallbacks}
			getActions={getInvoiceActions}
			{...invoiceTableProps}
		/>
	{/if}
</div>
