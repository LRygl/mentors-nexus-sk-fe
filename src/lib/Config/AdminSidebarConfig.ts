import type { SidebarConfig } from '$lib/types/ui/AdminSidebar';

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
			href: "/admin"
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
					href: "/admin/users"
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
					href: "/admin/course",
				},
				{
					id: "course-category",
					label: "Stations Categories",
					href: "/admin/course-category",
				},
				{
					id: "lessons",
					label: "Terminals",
					href: "/admin/lesson",
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
					href: "/admin/faq-categories",
				},
				{
					id: "faq",
					label: "FAQs",
					href: "/admin/faq",
				}
			]
		},
		{
			id: "legal",
			label: "Legal",
			icon: "Section",
			href: "/admin/legal-topic"
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
					id: "security",
					label: "Security",
					href: "/admin/settings/security"
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