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
			id: "users",
			label: "Users",
			icon: "Users",
			href: "/admin/users",
			children: [
				{
					id: "users",
					label: "Users",
					href: "/admin/users"
				},
				{
					id: "members",
					label: "Members",
					href: "/admin/users"
				},
				{
					id: "company",
					label: "Company Customer",
					href: "/admin/users"
				},
				{
					id: "admins",
					label: "Administrators",
					href: "/admin/users"
				},
			]
		},
		{
			id: "content",
			label: "Content",
			icon: "FileText",
			href: "/admin/content",
			children: [
				{
					id: "posts",
					label: "Posts",
					href: "/admin/content/posts"
				},
				{
					id: "pages",
					label: "Pages",
					href: "/admin/content/pages"
				},
				{
					id: "media",
					label: "Media Library",
					href: "/admin/content/media"
				}
			]
		},
		{
			id: "analytics",
			label: "Analytics",
			icon: "BarChart3",
			href: "/admin/analytics"
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
		{
			id: "profile",
			label: "My Profile",
			icon: "User",
			href: "/admin/profile"
		},
		{
			id: "preferences",
			label: "Preferences",
			icon: "Settings",
			href: "/admin/preferences"
		},
		{
			id: "help",
			label: "Help & Support",
			icon: "HelpCircle",
			href: "/admin/help"
		},
		{
			id: "divider",
			type: "divider"
		},
		{
			id: "logout",
			label: "Logout",
			icon: "LogOut",
			action: "logout"
		}
	]
};