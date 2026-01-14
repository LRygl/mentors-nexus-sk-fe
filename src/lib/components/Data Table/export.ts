
// Export utility
import type { FAQCategory } from '$lib/types/entities/faqCategory';

function exportToCSV(data: FAQCategory[], filename: string): void {
	if (data.length === 0) return;

	const csvData = data.map(item => ({
		ID: item.id,
		Name: item.name,
		'Display Order': item.displayOrder,
		'Color Code': item.colorCode,
		'FAQ Count': item.faqCount,
		Created: item.createdAt
	}));

	const headers = Object.keys(csvData[0]);
	const csvRows = [
		headers.join(','),
		...csvData.map(row =>
			headers.map(header => {
				const value = (row as any)[header] ?? '';
				return `"${String(value).replace(/"/g, '""')}"`;
			}).join(',')
		)
	];

	const csv = csvRows.join('\n');
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', filename);
	link.style.visibility = 'hidden';

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}