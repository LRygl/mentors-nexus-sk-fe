export interface BreadcrumbItem {
	name: string;
	href: string;
	isLast: boolean;
}

export interface PageInfo {
	title: string;
	parent?: string;
	parentHref?: string;
}

export type PageMap = Record<string, PageInfo>;