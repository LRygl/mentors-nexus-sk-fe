import type { ComponentType } from 'svelte';
import type { Icon } from 'lucide-svelte';
import {
	MessageSquare,
	Mail,
	Zap,
	CheckCircle2,
	Sparkles,
	ArrowRight,
	Phone,
	Send,
	Users,
	BookOpen
} from 'lucide-svelte';

// Button configuration interface
export interface ButtonConfig {
	text: string;
	icon?: ComponentType<Icon>;
	iconPosition?: 'left' | 'right';
	variant: 'primary' | 'secondary' | 'outline';
	href?: string;
	onClick?: () => void;
	type?: 'button' | 'submit';
}

// Form field interface
export interface FormField {
	id: string;
	name: string;
	type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
	label: string;
	placeholder?: string;
	required?: boolean;
	options?: string[];
	rows?: number;
}

// Complete preset interface with ALL properties
export interface CTABannerPreset {
	// Content
	title: string;
	description: string;
	icon?: ComponentType<Icon>;

	// Variant
	variant: 'simple' | 'detailed' | 'form';

	// Layout
	size: 'sm' | 'md' | 'lg';
	align: 'left' | 'center' | 'right';

	// Background styling
	gradientFrom: string;
	gradientVia: string;
	gradientTo: string;
	backgroundVariant?: 'gradient' | 'solid' | 'image';
	backgroundImage?: string;

	// Animation
	animated?: boolean;
	iconAnimation?: 'bounce' | 'pulse' | 'spin' | 'none';

	// Buttons (for simple & detailed variants)
	buttons?: ButtonConfig[];

	// Form configuration (for form variant)
	formTitle?: string;
	formFields?: FormField[];
	formButtonText?: string;

	// Decorative elements
	showParticles?: boolean;
	showGlowOrbs?: boolean;
}

// Pre-configured CTA banner presets
export const ctaBannerPresets: Record<string, CTABannerPreset> = {
	// Support/Help CTA
	support: {
		title: 'Still Need Help?',
		description:
			"Can't find what you're looking for? Our support team is ready to assist you with any questions or issues.",
		icon: CheckCircle2,
		variant: 'detailed',
		size: 'md',
		align: 'center',
		gradientFrom: 'from-blue-600',
		gradientVia: 'via-purple-600',
		gradientTo: 'to-indigo-600',
		backgroundVariant: 'gradient',
		animated: true,
		iconAnimation: 'bounce',
		showParticles: true,
		showGlowOrbs: true,
		buttons: [
			{
				text: 'Start Live Chat',
				icon: MessageSquare,
				iconPosition: 'left',
				variant: 'primary',
				href: '/chat'
			},
			{
				text: 'Email Us',
				icon: Mail,
				iconPosition: 'left',
				variant: 'outline',
				href: 'mailto:support@example.com'
			}
		]
	},

	// General CTA
	general: {
		title: 'Join Us on This Journey',
		description: "Whether you're a learner, educator, or partner, we'd love to have you with us.",
		icon: Sparkles,
		variant: 'simple',
		size: 'md',
		align: 'center',
		gradientFrom: 'from-blue-600',
		gradientVia: 'via-purple-600',
		gradientTo: 'to-indigo-600',
		backgroundVariant: 'gradient',
		animated: true,
		iconAnimation: 'pulse',
		showParticles: true,
		showGlowOrbs: true,
		buttons: [
			{
				text: 'Get in Touch',
				icon: Sparkles,
				variant: 'primary',
				href: '/contact'
			}
		]
	},

	// Newsletter/Contact Form
	newsletter: {
		title: 'Stay Updated',
		description:
			'Subscribe to our newsletter and be the first to know about new courses, features, and exclusive offers.',
		icon: Mail,
		variant: 'form',
		size: 'md',
		align: 'center',
		gradientFrom: 'from-emerald-600',
		gradientVia: 'via-teal-600',
		gradientTo: 'to-cyan-600',
		backgroundVariant: 'gradient',
		animated: true,
		iconAnimation: 'pulse',
		showParticles: true,
		showGlowOrbs: true,
		formTitle: 'Subscribe Now',
		formButtonText: 'Subscribe',
		formFields: [
			{
				id: 'name',
				name: 'name',
				type: 'text',
				label: 'Full Name',
				placeholder: 'John Doe',
				required: true
			},
			{
				id: 'email',
				name: 'email',
				type: 'email',
				label: 'Email Address',
				placeholder: 'john@example.com',
				required: true
			}
		]
	},

	// Contact Form
	contact: {
		title: 'Get in Touch',
		description:
			'Have a question or want to learn more? Fill out the form and our team will get back to you within 24 hours.',
		icon: MessageSquare,
		variant: 'form',
		size: 'lg',
		align: 'left',
		gradientFrom: 'from-blue-600',
		gradientVia: 'via-purple-600',
		gradientTo: 'to-indigo-600',
		backgroundVariant: 'gradient',
		animated: true,
		iconAnimation: 'bounce',
		showParticles: true,
		showGlowOrbs: true,
		formTitle: 'Send us a message',
		formButtonText: 'Send Message',
		formFields: [
			{
				id: 'name',
				name: 'name',
				type: 'text',
				label: 'Full Name',
				placeholder: 'John Doe',
				required: true
			},
			{
				id: 'email',
				name: 'email',
				type: 'email',
				label: 'Email Address',
				placeholder: 'john@example.com',
				required: true
			},
			{
				id: 'subject',
				name: 'subject',
				type: 'select',
				label: 'Subject',
				placeholder: 'Select a subject',
				required: true,
				options: ['General Inquiry', 'Technical Support', 'Billing', 'Partnership', 'Other']
			},
			{
				id: 'message',
				name: 'message',
				type: 'textarea',
				label: 'Message',
				placeholder: 'Tell us more about your inquiry...',
				required: true,
				rows: 5
			}
		]
	},

	// Demo Request
	demoRequest: {
		title: 'See It In Action',
		description:
			'Request a personalized demo and discover how our platform can transform your learning experience.',
		icon: Users,
		variant: 'form',
		size: 'md',
		align: 'left',
		gradientFrom: 'from-orange-600',
		gradientVia: 'via-red-600',
		gradientTo: 'to-pink-600',
		backgroundVariant: 'gradient',
		animated: true,
		iconAnimation: 'pulse',
		showParticles: true,
		showGlowOrbs: true,
		formTitle: 'Request a Demo',
		formButtonText: 'Request Demo',
		formFields: [
			{
				id: 'name',
				name: 'name',
				type: 'text',
				label: 'Full Name',
				placeholder: 'John Doe',
				required: true
			},
			{
				id: 'email',
				name: 'email',
				type: 'email',
				label: 'Work Email',
				placeholder: 'john@company.com',
				required: true
			},
			{
				id: 'company',
				name: 'company',
				type: 'text',
				label: 'Company Name',
				placeholder: 'Acme Corp',
				required: true
			},
			{
				id: 'phone',
				name: 'phone',
				type: 'tel',
				label: 'Phone Number',
				placeholder: '+1 (555) 000-0000',
				required: false
			}
		]
	},

	// Call to Action - Start Learning
	startLearning: {
		title: 'Ready to Start Learning?',
		description:
			'Join thousands of learners already mastering new skills. Get started today with a 14-day free trial.',
		icon: BookOpen,
		variant: 'detailed',
		size: 'lg',
		align: 'center',
		gradientFrom: 'from-violet-600',
		gradientVia: 'via-purple-600',
		gradientTo: 'to-fuchsia-600',
		backgroundVariant: 'gradient',
		animated: true,
		iconAnimation: 'bounce',
		showParticles: true,
		showGlowOrbs: true,
		buttons: [
			{
				text: 'Start Free Trial',
				icon: Sparkles,
				variant: 'primary',
				href: '/signup'
			},
			{
				text: 'View Courses',
				icon: ArrowRight,
				variant: 'outline',
				href: '/courses'
			}
		]
	},

	// Enterprise CTA
	enterprise: {
		title: 'Enterprise Solutions',
		description:
			'Empower your entire organization with our enterprise-grade learning platform. Custom solutions for teams of all sizes.',
		icon: Users,
		variant: 'detailed',
		size: 'md',
		align: 'center',
		gradientFrom: 'from-slate-700',
		gradientVia: 'via-slate-800',
		gradientTo: 'to-slate-900',
		backgroundVariant: 'gradient',
		animated: true,
		iconAnimation: 'pulse', // Now this works!
		showParticles: true,
		showGlowOrbs: true,
		buttons: [
			{
				text: 'Contact Sales',
				icon: Phone,
				variant: 'primary',
				href: '/enterprise'
			},
			{
				text: 'View Pricing',
				icon: ArrowRight,
				variant: 'outline',
				href: '/pricing'
			}
		]
	},

	// Minimal CTA (clean, no decorations)
	minimal: {
		title: 'Simple & Clean',
		description: 'A minimalist call-to-action without any decorative elements.',
		variant: 'simple',
		size: 'sm',
		align: 'center',
		gradientFrom: 'from-gray-700',
		gradientVia: 'via-gray-800',
		gradientTo: 'to-gray-900',
		backgroundVariant: 'solid',
		animated: false,
		iconAnimation: 'none',
		showParticles: false,
		showGlowOrbs: false,
		buttons: [
			{
				text: 'Learn More',
				variant: 'primary',
				href: '/about'
			}
		]
	},

	// With Background Image
	imageBackground: {
		title: 'Experience the Difference',
		description: 'See how our platform can transform your learning journey.',
		icon: Sparkles,
		variant: 'detailed',
		size: 'lg',
		align: 'center',
		gradientFrom: 'from-blue-900',
		gradientVia: 'via-purple-900',
		gradientTo: 'to-indigo-900',
		backgroundVariant: 'image',
		backgroundImage: '/images/hero-bg.jpg', // Your image path
		animated: true,
		iconAnimation: 'bounce',
		showParticles: false, // Particles might be too busy with image
		showGlowOrbs: true,
		buttons: [
			{
				text: 'Get Started',
				icon: ArrowRight,
				variant: 'primary',
				href: '/signup'
			},
			{
				text: 'Watch Demo',
				icon: Sparkles,
				variant: 'outline',
				href: '/demo'
			}
		]
	}
};

// Helper function to get a preset
export function getCTABannerPreset(presetName: keyof typeof ctaBannerPresets): CTABannerPreset {
	return ctaBannerPresets[presetName];
}

// Helper to create a custom preset by extending an existing one
export function extendCTABannerPreset(
	basePreset: keyof typeof ctaBannerPresets,
	overrides: Partial<CTABannerPreset>
): CTABannerPreset {
	return {
		...ctaBannerPresets[basePreset],
		...overrides
	};
}
