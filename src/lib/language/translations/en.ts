import type { Translations } from '$lib/types/translation';

export const en: Translations = {
	errors: {
		loading_data: 'Error loading data',
		loading_users: 'Error loading users',
		loading_categories: 'Error loading categories',
		loading_companies: 'Error loading companies',
		loading_courses: 'Error loading courses',
		loading_products: 'Error loading products',
		network_error: 'Network connection failed',
		server_error: 'Server error occurred',
		unauthorized: 'You are not authorized to access this resource',
		not_found: 'Resource not found'
	},
	loading: {
		default: 'Loading...',
		users: 'Loading users...',
		categories: 'Loading categories...',
		courses: 'Loading courses...',
		companies: 'Loading companies...',
		products: 'Loading products...',
		saving: 'Saving...',
		deleting: 'Deleting...',
		updating: 'Updating...'
	},
	buttons: {
		try_again: 'Try Again',
		retrying: 'Retrying...',
		cancel: 'Cancel',
		save: 'Save',
		delete: 'Delete',
		edit: 'Edit',
		create: 'Create',
		close: 'Close'
	},
	common: {
		success: 'Success',
		warning: 'Warning',
		info: 'Information',
		confirmation: 'Are you sure?',
		previous: 'Previous',
		next: 'Next'
	},
	action: {
		copyToClipboard: 'Copy to clipboard',
		view: 'View',
		details: 'Details',
		delete: 'Delete'
	}
};