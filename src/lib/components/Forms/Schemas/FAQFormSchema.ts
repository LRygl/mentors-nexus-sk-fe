import { FormBuilder } from '$lib/utils/formBuilder';
import type { FAQCreateFormData } from '$lib/types/entities/faq';
import type { FAQCategory } from '$lib/types/entities/faqCategory';
import type { FAQDetailedFormData, FAQFormType, FAQQuickFormData, GetFAQFormData } from '$lib/types/entities/faq-forms';
import type { FormSchema } from '$lib/types/entities/forms';

export function createFAQFormSchema<T extends FAQFormType>(
	formType: T,
	faqCategories: FAQCategory[] = [],
): FormSchema<GetFAQFormData<T>> {

	const categoryOptions = [
		{
			label: 'Select a category...',
			value: '',
			disabled: true
		},
		...faqCategories.map(cat => ({
			label: cat.name,
			value: cat.id,
			icon: cat.iconClass,
			color: cat.colorCode
		}))
	];

	// TODO Move to Priority enum where all should be listed
	const priorityOptions = [
		{ label: 'Low', value: 'low', color: '#10B981' },
		{ label: 'Medium', value: 'medium', color: '#F59E0B' },
		{ label: 'High', value: 'high', color: '#EF4444' },
		{ label: 'Critical', value: 'critical', color: '#DC2626' }
	];

	const visibilityOptions = [
		{ label: 'Public', value: 'public', icon: '🌍' },
		{ label: 'Members Only', value: 'members', icon: '👥' },
		{ label: 'Premium Only', value: 'premium', icon: '⭐' }
	];

	switch (formType) {
		case 'quick':
			return createQuickFAQSchema(categoryOptions) as FormSchema<GetFAQFormData<T>>;
		case 'standard':
			return createStandardFAQSchema(categoryOptions) as FormSchema<GetFAQFormData<T>>;
		case 'detailed':
			return createDetailedFAQSchema(categoryOptions, priorityOptions, visibilityOptions) as FormSchema<GetFAQFormData<T>>;
		default:
			throw new Error(`Unknown form type: ${formType}`);
	}
}

// Quick FAQ Form Schema
function createQuickFAQSchema(categoryOptions: any[]): FormSchema<FAQQuickFormData> {
	return new FormBuilder<FAQQuickFormData>({
		title: 'Quick FAQ Entry',
		description: 'Rapidly create a simple FAQ',
		layout: 'single',
		variant: 'minimal',
		size: 'lg'
	})
		.validation({
			validateOnChange: true,
			validateOnBlur: true
		})
		.actions({
			submitLabel: 'Create FAQ',
			showReset: false
		})

		.group('Quick Entry')
		.text('question', 'Question', {
			placeholder: 'What would you like to know?',
			required: true,
			minLength: 10,
			maxLength: 200,
			helpText: 'Keep it clear and concise',
			autoFocus: true
		})
		.textarea('answer', 'Answer', {
			placeholder: 'Provide a helpful answer...',
			required: true,
			minLength: 20,
			maxLength: 500,
			rows: 4,
			helpText: 'Give a complete but brief answer'
		})
		.checkbox('isPublished', 'Publish immediately', {
			helpText: 'Make this FAQ visible to users right away',
			defaultValue: false
		})
		.build();
}


// Standard FAQ Form Schema
function createStandardFAQSchema(categoryOptions: any[]): FormSchema<FAQCreateFormData> {
	return new FormBuilder<FAQCreateFormData>({
		title: 'Create New FAQ',
		description: 'Build comprehensive FAQ content with categorization',
		layout: 'two-column',
		variant: 'default',
		size: 'md'
	})
		.validation({
			validateOnChange: true,
			validateOnBlur: true
		})
		.actions({
			submitLabel: 'Create FAQ',
			showReset: true,
			resetLabel: 'Clear Form'
		})

		// Content Section
		.group('Content', {
			description: 'The main question and answer content',
			icon: '📝',
			variant: 'card'
		})
		.text('question', 'Question', {
			placeholder: 'e.g., How do I reset my password?',
			helpText: 'Write a clear, searchable question',
			required: true,
			minLength: 10,
			maxLength: 250,
			colSpan: 2,
			autoFocus: true
		})
		.textarea('answer', 'Answer', {
			placeholder: 'Provide a comprehensive, step-by-step answer...',
			helpText: 'Give detailed instructions that fully address the question',
			required: true,
			minLength: 20,
			maxLength: 1000,
			rows: 5,
			colSpan: 2
		})

		// Publishing Settings
		.group('Publishing Settings', {
			description: 'Control how and when this FAQ is displayed',
			icon: '🚀',
			variant: 'card'
		})
		.checkbox('isPublished', 'Publish Immediately', {
			helpText: 'Make this FAQ visible to users right away',
			defaultValue: false,
			colSpan: 1
		})
		.checkbox('isFeatured', 'Feature this FAQ', {
			helpText: 'Highlight this FAQ in featured sections',
			defaultValue: false,
			colSpan: 1
		})

		// Category Selection (conditional)
		.select('faqCategoryId', 'FAQ Category', categoryOptions, {
			placeholder: 'Choose the best category for this FAQ',
			helpText: 'Required when publishing - helps users find relevant content',
			searchable: true,
			clearable: true,
			colSpan: 2,
			dependencies: [{ field: 'isPublished', condition: 'truthy' }],
			conditionalValidation: [{
				when: { field: 'isPublished', condition: 'truthy' },
				rules: [{
					type: 'required',
					message: 'Please select a category when publishing the FAQ'
				}]
			}]
		})

		// Organization
		.group('Organization', {
			description: 'Help users find and understand this FAQ',
			icon: '🗂️',
			variant: 'minimal',
			collapsible: true,
			collapsed: true
		})
		.number('displayOrder', 'Display Order', {
			placeholder: '1',
			helpText: 'Lower numbers appear first in lists',
			min: 1,
			max: 9999,
			defaultValue: 1,
			colSpan: 1
		})
		.tags('tags', 'Keywords/Tags', {
			placeholder: 'Add relevant keywords...',
			helpText: 'Help users find this FAQ through search (press Enter to add)',
			colSpan: 2,
			maxTags: 10
		})
		.textarea('metaDescription', 'SEO Description', {
			placeholder: 'Brief description for search engines...',
			helpText: 'Optional: Improve how this FAQ appears in search results',
			maxLength: 160,
			rows: 2,
			colSpan: 2
		})

		.build();
}

// Detailed FAQ Form Schema
function createDetailedFAQSchema(
	categoryOptions: any[],
	priorityOptions: any[],
	visibilityOptions: any[]
): FormSchema<FAQDetailedFormData> {
	return new FormBuilder<FAQDetailedFormData>({
		title: 'Detailed FAQ Creation',
		description: 'Create comprehensive FAQ content with advanced features',
		layout: 'two-column',
		variant: 'bordered',
		size: 'md'
	})
		.validation({
			validateOnChange: true,
			validateOnBlur: true
		})
		.actions({
			submitLabel: 'Create Detailed FAQ',
			showReset: true,
			showCancel: true
		})

		// Main Content
		.group('Content Details', {
			description: 'Comprehensive question and answer content',
			icon: '📖',
			variant: 'card'
		})
		.text('question', 'Question Title', {
			required: true,
			minLength: 10,
			maxLength: 300,
			placeholder: 'Enter a detailed, searchable question...',
			colSpan: 2
		})
		.textarea('answer', 'Standard Answer', {
			required: true,
			minLength: 50,
			maxLength: 2000,
			rows: 6,
			placeholder: 'Provide a comprehensive answer...',
			colSpan: 2
		})
		.textarea('shortAnswer', 'Brief Answer', {
			maxLength: 200,
			rows: 2,
			placeholder: 'Optional: Short version for quick reference...',
			helpText: 'Displayed in search results and quick views',
			colSpan: 2
		})

		// Categorization & Classification
		.group('Categorization', {
			description: 'Organize and classify this FAQ',
			icon: '🏷️',
			variant: 'card'
		})
		.select('faqCategoryId', 'Primary Category', categoryOptions, {
			required: true,
			searchable: true,
			colSpan: 1,
			dependencies: [{ field: 'isPublished', condition: 'truthy' }],
			conditionalValidation: [{
				when: { field: 'isPublished', condition: 'truthy' },
				rules: [{ type: 'required', message: 'Category required for published FAQs' }]
			}]
		})
		.select('priority', 'Priority Level', priorityOptions, {
			defaultValue: 'medium',
			helpText: 'How important is this FAQ?',
			colSpan: 1
		})
		.select('secondaryCategories', 'Secondary Categories', categoryOptions, {
			multiple: true,
			searchable: true,
			helpText: 'Additional categories this FAQ belongs to',
			colSpan: 2
		})
		.tags('topics', 'Related Topics', {
			placeholder: 'Add related topics...',
			helpText: 'Broader topics this FAQ relates to',
			colSpan: 2
		})

		// Publishing & Visibility
		.group('Publishing Control', {
			description: 'Control publication and access',
			icon: '👁️',
			variant: 'card'
		})
		.checkbox('isPublished', 'Publish Now', {
			helpText: 'Make immediately visible to users',
			colSpan: 1
		})
		.checkbox('isFeatured', 'Featured FAQ', {
			helpText: 'Show in featured/highlighted sections',
			colSpan: 1
		})
		.select('visibility', 'Visibility Level', visibilityOptions, {
			defaultValue: 'public',
			helpText: 'Who can see this FAQ?',
			colSpan: 1
		})
		.date('publishDate', 'Publish Date', {
			helpText: 'Schedule when this FAQ becomes visible',
			colSpan: 1
		})

		// SEO & Metadata
		.group('SEO & Metadata', {
			description: 'Search engine optimization and metadata',
			icon: '🔍',
			variant: 'minimal',
			collapsible: true,
			collapsed: true
		})
		.text('slug', 'URL Slug', {
			placeholder: 'auto-generated-from-question',
			helpText: 'Custom URL path (auto-generated if empty)',
			pattern: '^[a-z0-9-]+$',
			colSpan: 2
		})
		.textarea('metaDescription', 'Meta Description', {
			maxLength: 160,
			rows: 2,
			helpText: 'Description for search engines (160 chars max)',
			colSpan: 2
		})
		.text('metaTitle', 'Meta Title', {
			maxLength: 60,
			helpText: 'Title for search engines (60 chars max)',
			colSpan: 2
		})
		.tags('metaKeywords', 'Meta Keywords', {
			helpText: 'SEO keywords for search engines',
			colSpan: 2
		})

		// Advanced Features
		.group('Advanced Options', {
			description: 'Additional features and settings',
			icon: '⚙️',
			variant: 'minimal',
			collapsible: true,
			collapsed: true
		})
		.checkbox('trackingEnabled', 'Enable Analytics', {
			helpText: 'Track views and interactions',
			colSpan: 1
		})
		.text('customAnalyticsId', 'Analytics ID', {
			placeholder: 'GA-XXXX-X',
			helpText: 'Custom tracking identifier',
			colSpan: 1,
			dependencies: [{ field: 'trackingEnabled', condition: 'truthy' }]
		})
		.date('reviewDate', 'Review Date', {
			helpText: 'When should this FAQ be reviewed for updates?',
			colSpan: 1
		})
		.checkbox('requiresUpdate', 'Requires Review', {
			helpText: 'Mark this FAQ as needing review',
			colSpan: 1
		})

		.build();
}

// Preset form creators for convenience
export class FAQFormPresets {
	static quick(categories: FAQCategory[] = []) {
		return createFAQFormSchema('quick', categories);
	}

	static standard(categories: FAQCategory[] = []) {
		return createFAQFormSchema('standard', categories);
	}

	static detailed(categories: FAQCategory[] = []) {
		return createFAQFormSchema('detailed', categories);
	}
}

// Form schema factory with validation
export function createTypedFAQFormSchema<T extends FAQFormType>(
	formType: T,
	options: {
		categories?: FAQCategory[];
		defaultData?: Partial<GetFAQFormData<T>>;
		customValidation?: Record<string, any>;
	} = {}
): FormSchema<GetFAQFormData<T>> {
	const { categories = [], defaultData, customValidation } = options;

	const schema = createFAQFormSchema(formType, categories);

	// Apply default data if provided
	if (defaultData) {
		schema.groups?.forEach(group => {
			group.fields.forEach(field => {
				if (defaultData[field.name as keyof GetFAQFormData<T>] !== undefined) {
					field.defaultValue = defaultData[field.name as keyof GetFAQFormData<T>];
				}
			});
		});
	}

	return schema;
}






















/*
export function createFAQFormSchema(faqCategories: FAQCategory[] = []) {
	return new FormBuilder<FAQCreateFormData>()

		.layout('two-column')

		.group(
			'FAQ Details'
			)

		.text('question', 'Question', {
			placeholder: 'e.g., How do you drink tea?',
			required: true,
			minLength: 2,
			maxLength: 250,
			colSpan: 1
		})
		.textarea('answer', 'Answer', {
			placeholder: 'With your mouth!',
			required: true,
			minLength: 1,
			maxLength: 500,
			rows: 3,
			colSpan: 2
		})

		// Visibility Settings
		.group('Settings')
		.checkbox('isPublished', 'Publish?', {
			helpText: 'Category will be marked as published when created. FAQ Category is required.',
			defaultValue: false,
			colSpan: 1
		})
		.checkbox('isFeatured', 'Featured?', {
			helpText: 'Featured FAQ',
			defaultValue: false,
			colSpan: 1
		})

		// Conditional FAQ Category select - only show when isPublished is true
		.select('faqCategoryId', 'FAQ Category',
			[
				{ label: 'Select a category...', value: '' },
				...faqCategories.map(cat => ({
					label: cat.name,
					value: cat.id
				}))
			], {
				placeholder: 'Choose FAQ Category',
				colSpan: 2,
				helpText: 'Required when FAQ is published',
				// Add dependency configuration
				dependencies: [{
					field: 'isPublished',
					condition: 'truthy'
				}],
				conditionalValidation: [{
					when: {
						field: 'isPublished',
						condition: 'truthy'
					},
					rules: [{ type: 'required', message: 'FAQ Category is required when publishing' }]
				}]
			})
		.build();
}

*/