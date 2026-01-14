import type { BreadcrumbItem, PageMap, PageInfo} from '$lib/types/entities/breadcumb';

export const PAGE_MAP: PageMap = {
	'/': { title: 'Home' },
	'/about': { title: 'About' },
	'/admin': { title: 'Admin' },
	'/admin/users': {
		title: 'Application Users',
		parent: 'Admin',
		parentHref: '/admin',
	},
	'/admin/course': {
		title: 'Course',
		parent: 'Admin',
		parentHref: '/admin',
	},
	'/admin/category': {
		title: 'Category',
		parent: 'Admin',
		parentHref: '/admin',
	},
	'/admin/company': {
		title: 'Company',
		parent: 'Admin',
		parentHref: '/admin',
	},
	'/admin/lesson': {
		title: 'Lessons',
		parent: 'Admin',
		parentHref: '/admin',
	},
	'/admin/featured': {
		title: 'Featured Courses',
		parent: 'Admin',
		parentHref: '/admin',
	},
	'/admin/faq': {
		title: 'FAQ',
		parent: 'Admin',
		parentHref: '/admin',
	},
	'/admin/settings/notifications': {
	title: 'Notifications',
		parent: 'Settings',
		parentHref: '/settings',
}
};

export function formatSegmentName(segment: string): string {
	if (!segment) return '';

	return segment
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function formatPageName(pathname: string): string {
	const segments = pathname.split('/').filter(Boolean);
	const lastSegment = segments[segments.length - 1] || 'Home';

	return formatSegmentName(lastSegment);
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length === 0) {
		return [{ name: 'Home', href: '/', isLast: true }];
	}

	return segments.map((segment, index) => ({
		name: formatSegmentName(segment),
		href: '/' + segments.slice(0, index + 1).join('/'),
		isLast: index === segments.length - 1
	}));
}

export function getPageInfo(routeId: string | null, pathname: string): PageInfo {
	return PAGE_MAP[pathname] || {
		title: formatPageName(pathname)
	};
}