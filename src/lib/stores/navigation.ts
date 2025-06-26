import type { BreadcrumbItem } from '$lib/types/breadcumb';
import { generateBreadcrumbs } from '$lib/utils/breadcrumb';

export const currentPageInfo = derived(
	page,
	($page): PageInfo => getPageInfo($page.route.id, $page.url.pathname)
);

export const breadcrumbs = derived(
	page,
	($page): BreadcrumbItem[] => generateBreadcrumbs($page.url.pathname)
);

export const currentPageTitle = derived(
	currentPageInfo,
	($pageInfo): string => $pageInfo.title
);