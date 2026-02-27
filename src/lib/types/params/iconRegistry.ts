// src/lib/utils/iconRegistry.ts
import {
	HelpCircle,
	MessageSquare,
	Settings,
	Shield,
	CreditCard,
	Users,
	User,
	BookOpen,
	Zap,
	Heart,
	Star,
	Gift,
	Truck,
	Phone,
	Mail,
	Globe,
	Lock,
	Key,
	Bell,
	Calendar,
	Camera,
	Music,
	Video,
	Image,
	Download,
	Upload,
	Folder,
	Archive,
	Database,
	Server,
	Wrench,
	Cog,
	Puzzle,
	Target,
	Award,
	Trophy,
	Flag,
	Hash,
	Eye,
	PencilLine,
	MapPin,
	FileText,
	Info,
	CheckCircle,
	AlertCircle,
	Building2,
	GraduationCap,
	Layers,
	LayoutDashboard,
	Package,
	Tag,
	Wallet,
} from '@lucide/svelte';
import type { Component, ComponentType } from 'svelte';

// Type definition for icon data
export interface IconData {
	name: string;
	displayName: string;
	component: Component;
	category?: string;
}

// Available icons with their Lucide names and display names
export const availableIcons: IconData[] = [
	// Help & Support
	{ name: 'HelpCircle', displayName: 'Help', component: HelpCircle, category: 'support' },
	{ name: 'MessageSquare', displayName: 'Messages', component: MessageSquare, category: 'support' },
	{ name: 'Heart', displayName: 'Support', component: Heart, category: 'support' },
	{ name: 'Phone', displayName: 'Contact', component: Phone, category: 'support' },
	{ name: 'Mail', displayName: 'Email', component: Mail, category: 'support' },
	{ name: 'Info', displayName: 'Info', component: Info, category: 'support' },
	{ name: 'AlertCircle', displayName: 'Alert', component: AlertCircle, category: 'support' },
	{ name: 'CheckCircle', displayName: 'Check', component: CheckCircle, category: 'support' },

	// People & Identity
	{ name: 'User', displayName: 'User', component: User, category: 'people' },
	{ name: 'Users', displayName: 'Users', component: Users, category: 'people' },
	{ name: 'GraduationCap', displayName: 'Education', component: GraduationCap, category: 'people' },
	{ name: 'Building2', displayName: 'Organisation', component: Building2, category: 'people' },

	// System & Settings
	{ name: 'Settings', displayName: 'Settings', component: Settings, category: 'system' },
	{ name: 'Shield', displayName: 'Security', component: Shield, category: 'system' },
	{ name: 'Lock', displayName: 'Privacy', component: Lock, category: 'system' },
	{ name: 'Key', displayName: 'Password', component: Key, category: 'system' },
	{ name: 'Bell', displayName: 'Notifications', component: Bell, category: 'system' },
	{ name: 'Cog', displayName: 'Configuration', component: Cog, category: 'system' },
	{ name: 'LayoutDashboard', displayName: 'Dashboard', component: LayoutDashboard, category: 'system' },
	{ name: 'Layers', displayName: 'Layers', component: Layers, category: 'system' },

	// Business & Commerce
	{ name: 'CreditCard', displayName: 'Payment', component: CreditCard, category: 'business' },
	{ name: 'Wallet', displayName: 'Wallet', component: Wallet, category: 'business' },
	{ name: 'Package', displayName: 'Package', component: Package, category: 'business' },
	{ name: 'Tag', displayName: 'Tag', component: Tag, category: 'business' },
	{ name: 'Truck', displayName: 'Shipping', component: Truck, category: 'business' },
	{ name: 'Gift', displayName: 'Rewards', component: Gift, category: 'business' },
	{ name: 'Target', displayName: 'Goals', component: Target, category: 'business' },
	{ name: 'MapPin', displayName: 'Location', component: MapPin, category: 'business' },

	// Content & Media
	{ name: 'BookOpen', displayName: 'Guides', component: BookOpen, category: 'content' },
	{ name: 'FileText', displayName: 'Document', component: FileText, category: 'content' },
	{ name: 'PencilLine', displayName: 'Edit', component: PencilLine, category: 'content' },
	{ name: 'Camera', displayName: 'Photos', component: Camera, category: 'content' },
	{ name: 'Music', displayName: 'Audio', component: Music, category: 'content' },
	{ name: 'Video', displayName: 'Videos', component: Video, category: 'content' },
	{ name: 'Image', displayName: 'Images', component: Image, category: 'content' },

	// Files & Data
	{ name: 'Folder', displayName: 'Files', component: Folder, category: 'files' },
	{ name: 'Archive', displayName: 'Archive', component: Archive, category: 'files' },
	{ name: 'Database', displayName: 'Data', component: Database, category: 'files' },
	{ name: 'Download', displayName: 'Downloads', component: Download, category: 'files' },
	{ name: 'Upload', displayName: 'Uploads', component: Upload, category: 'files' },

	// Technical & Tools
	{ name: 'Server', displayName: 'Technical', component: Server, category: 'technical' },
	{ name: 'Wrench', displayName: 'Maintenance', component: Wrench, category: 'technical' },
	{ name: 'Puzzle', displayName: 'Integration', component: Puzzle, category: 'technical' },
	{ name: 'Zap', displayName: 'Quick Start', component: Zap, category: 'technical' },

	// General
	{ name: 'Globe', displayName: 'Website', component: Globe, category: 'general' },
	{ name: 'Calendar', displayName: 'Events', component: Calendar, category: 'general' },
	{ name: 'Star', displayName: 'Features', component: Star, category: 'general' },
	{ name: 'Award', displayName: 'Achievement', component: Award, category: 'general' },
	{ name: 'Trophy', displayName: 'Success', component: Trophy, category: 'general' },
	{ name: 'Flag', displayName: 'Important', component: Flag, category: 'general' },
	{ name: 'Hash', displayName: 'Hash', component: Hash, category: 'general' },
	{ name: 'Eye', displayName: 'View', component: Eye, category: 'general' },
];

// Create icon map for quick lookups
export const iconMap: Record<string, Component> = availableIcons.reduce((map, icon) => {
	map[icon.name] = icon.component;
	return map;
}, {} as Record<string, Component>);

// Get icon component by name
export function getIconComponent(iconName: string): Component {
	return iconMap[iconName] || HelpCircle;
}

// Get icon display name
export function getIconDisplayName(iconName: string): string {
	const icon = availableIcons.find(i => i.name === iconName);
	return icon?.displayName || iconName;
}

// Filter icons by category
export function getIconsByCategory(category: string): IconData[] {
	return availableIcons.filter(icon => icon.category === category);
}

// Search icons
export function searchIcons(query: string): IconData[] {
	if (!query.trim()) return availableIcons;

	const lowerQuery = query.toLowerCase();
	return availableIcons.filter(icon =>
		icon.displayName.toLowerCase().includes(lowerQuery) ||
		icon.name.toLowerCase().includes(lowerQuery) ||
		icon.category?.toLowerCase().includes(lowerQuery)
	);
}