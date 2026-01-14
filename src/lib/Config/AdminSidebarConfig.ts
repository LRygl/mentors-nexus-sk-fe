import type { SidebarConfig } from '$lib/types/ui/AdminSidebar';
import { ROUTES } from './routes.config';

export const sidebarConfig: SidebarConfig = {
	logo: {
		src: "/logo.svg",
		alt: "Company Logo",
		title: "Admin Dashboard"
	},
	navigation: [
		{
			id: "dashboard",
			label: "Dashboard",
			icon: "LayoutDashboard",
			href: ROUTES.ADMIN.DASHBOARD
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: "BarChart3",
			href: "/admin/analytics"
		},
		{
			id: "users",
			label: "Users",
			icon: "Users",
			href: "/admin/users",
			children: [
				{
					id: "users",
					label: "Users",
					href: ROUTES.ADMIN.USERS
				}
			]
		},
		{
			id: "content",
			label: "Content",
			icon: "FolderClosed",
			href: "/admin/support",
			children: [
				{
					id: "courses",
					label: "Stations",
					href: ROUTES.ADMIN.COURSE
				},
				{
					id: "course-category",
					label: "Stations Categories",
					href: ROUTES.ADMIN.COURSE_CATEGORIES
				},
				{
					id: "lessons",
					label: "Terminals",
					href: ROUTES.ADMIN.LESSON
				}
			]
		},
		{
			id: "support",
			label: "Support",
			icon: "MessageCircleQuestionMark",
			href: "/admin/support",
			children: [
				{
					id: "faq-category",
					label: "FAQ Categories",
					href: ROUTES.ADMIN.FAQ_CATEGORIES
				},
				{
					id: "faq",
					label: "FAQs",
					href: ROUTES.ADMIN.FAQ
				}
			]
		},
		{
			id: "legal",
			label: "Legal",
			icon: "Section",
			href: ROUTES.ADMIN.LEGAL_TOPIC
		},
		{
			id: "settings",
			label: "Settings",
			icon: "Settings",
			href: "/admin/settings",
			children: [
				{
					id: "general",
					label: "General",
					href: "/admin/settings/general"
				},
				{
					id: "theme",
					label: "Themes",
					href: ROUTES.ADMIN.THEMES
				},
				{
					id: "integrations",
					label: "Integrations",
					href: "/admin/settings/integrations"
				}
			]
		}
	],
	userActions: [

	]
};