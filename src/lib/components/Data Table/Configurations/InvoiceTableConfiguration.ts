/**
 * Invoice table configuration for the user-facing My Invoices page.
 *
 * Exports:
 *  - invoiceTableConfig   → TableConfig passed to UniversalDataTable
 *  - invoiceTableColumns  → Column definitions (including custom renderers)
 *  - getInvoiceActions    → Per-row action groups (View, Download PDF)
 *  - invoiceTableProps    → Extra props forwarded to UniversalDataTable
 *  - formatPrice          → Re-exported for use in the stats block
 */

import { TableColumnBuilder } from '$lib/types/ui/table';
import type { TableConfig, TableColumn } from '$lib/types/ui/table';
import type { ActionGroup } from '$lib/types';
import { ActionType } from '$lib/types';
import type { InvoiceListItem } from '$lib/types/entities/Invoice';

// ── Shared helper ─────────────────────────────────────────────────────────────

export function formatPrice(amount: number, currency: string = 'CZK'): string {
	return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency }).format(amount);
}

// ── Table config ──────────────────────────────────────────────────────────────

export const invoiceTableConfig: TableConfig<InvoiceListItem> = {
	idField: 'id',
	titleField: 'invoiceNumber',
	actionsInline: true,
	loadingTitle: 'Loading Invoices',
	loadingDescription: 'Please wait while we fetch your invoices…'
};

// ── Column definitions ────────────────────────────────────────────────────────

const PAID_BADGE = `
	<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
		</svg>
		Paid
	</span>`.trim();

const UNPAID_BADGE = `
	<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
		<svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
		</svg>
		Unpaid
	</span>`.trim();

export const invoiceTableColumns: TableColumn<InvoiceListItem>[] = [
	TableColumnBuilder.text<InvoiceListItem>('invoiceNumber', 'Invoice #', {
		searchable: true,
		sortable: true,
		cellClassName: 'font-mono font-medium text-slate-800'
	}),

	// Paid / Unpaid status badge
	TableColumnBuilder.custom<InvoiceListItem>('paid', 'Status', {
		sortable: true,
		searchable: false,
		renderCustom: (invoice) => (invoice.paid ? PAID_BADGE : UNPAID_BADGE)
	}),

	// Amount formatted with locale currency
	TableColumnBuilder.custom<InvoiceListItem>('totalAmount', 'Amount', {
		sortable: true,
		searchable: false,
		renderCustom: (invoice) =>
			`<span class="font-semibold text-slate-900">${formatPrice(invoice.totalAmount, invoice.currency)}</span>`
	}),

	TableColumnBuilder.date<InvoiceListItem>('issuedDate', 'Issued', {
		format: 'short',
		sortable: true
	}),

];

// ── Row actions ───────────────────────────────────────────────────────────────

// Action IDs are handled by tableCallbacks in the page component.
export function getInvoiceActions(_invoice: InvoiceListItem): ActionGroup[] {
	return [
		{
			title: 'Actions',
			items: [
				{
					id: 'view',
					label: 'View Invoice',
					description: 'Open full invoice details',
					icon: 'Eye',
					variant: ActionType.DEFAULT
				},
				{
					id: 'download-pdf',
					label: 'Download PDF',
					description: 'Save invoice as PDF',
					icon: 'Download',
					variant: ActionType.SUCCESS
				}
			]
		}
	];
}

// ── Static UniversalDataTable props ──────────────────────────────────────────

export const invoiceTableProps = {
	searchable: true,
	selectable: false,
	sortable: true,
	emptyTitle: 'No invoices found',
	emptyDescription: 'Once you purchase a course, your invoices will appear here.',
	searchPlaceholder: 'Search by invoice number…'
} as const;
