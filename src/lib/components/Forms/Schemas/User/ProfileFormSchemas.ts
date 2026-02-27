/**
 * ProfileFormSchemas.ts
 *
 * Form schemas for the user profile page.
 *
 * createFullProfileSchema() — single unified schema with three card groups:
 *   1. Personal Information  (firstName, lastName, telephoneNumber)
 *   2. Billing Information   (billingFirstName/LastName + address autocomplete)
 *   3. Privacy & Consent     (personalDataProcessing, personalDataPublishing, marketing)
 *
 * All groups render as profile-page cards via FormGroupRenderer (card variant).
 * The entire model is submitted as one flat object → single updateProfile() call.
 *
 * Legacy schemas (createPersonalInfoSchema, createBillingInfoSchema, createConsentSchema)
 * are kept for backwards-compatibility but are no longer used on the main profile page.
 */

import { FormBuilder } from '$lib/utils/formBuilder';
import type { FormSchema } from '$lib/types/entities/forms';

// ─── Country options ──────────────────────────────────────────────────────────
export const COUNTRY_OPTIONS = [
	{ value: 'CZ', label: 'Czech Republic' },
	{ value: 'SK', label: 'Slovakia' }
];

// ─── Unified profile schema ───────────────────────────────────────────────────
/**
 * Single schema covering all editable profile fields.
 * Renders three card-style groups via FormGroupRenderer.
 * Submit payload contains all fields so the parent can call
 * userPublicAPI.updateProfile(data) in one go.
 */
export function createFullProfileSchema(): FormSchema {
	return new FormBuilder({
		layout: 'two-column',
		variant: 'default',
	})
		// ── Group 1: Personal Information ────────────────────────────────────
		.group('Personal Information', {
			icon: 'User',
			description: 'Your name and contact details',
			collapsible: false,
		})
		.text('firstName', 'First Name', {
			placeholder: 'John',
			required: true,
			minLength: 2,
			maxLength: 150,
			colSpan: 1,
		})
		.text('lastName', 'Last Name', {
			placeholder: 'Doe',
			required: true,
			minLength: 2,
			maxLength: 150,
			colSpan: 1,
		})
		.phone('telephoneNumber', 'Phone Number', {
			colSpan: 1,
			helpText: 'Optional – used for order confirmations',
		})

		// ── Group 2: Billing Information ─────────────────────────────────────
		.group('Billing Information', {
			icon: 'CreditCard',
			description: 'Pre-filled automatically at checkout',
			collapsible: true,
			collapsed: false,
		})
		.text('billingFirstName', 'First Name', {
			placeholder: 'John',
			required: false,
			maxLength: 150,
			colSpan: 1,
			helpText: 'Name that will appear on your invoice',
		})
		.text('billingLastName', 'Last Name', {
			placeholder: 'Doe',
			required: false,
			maxLength: 150,
			colSpan: 1,
		})
		.address('billingStreet', 'Street & Number', {
			placeholder: 'Václavské náměstí 1',
			required: false,
			maxLength: 255,
			colSpan: 2,
			siblingFields: {
				city: 'billingCity',
				postalCode: 'billingPostalCode',
				country: 'billingCountry',
			},
		})
		.text('billingCity', 'City', {
			placeholder: 'Prague',
			required: false,
			maxLength: 100,
			colSpan: 1,
		})
		.text('billingPostalCode', 'Postal Code', {
			placeholder: '110 00',
			required: false,
			maxLength: 20,
			colSpan: 1,
		})
		.country('billingCountry', 'Country', COUNTRY_OPTIONS, {
			colSpan: 1,
			defaultValue: 'CZ',
		})

		// ── Group 3: Privacy & Consent ────────────────────────────────────────
		.group('Privacy & Consent', {
			icon: 'Shield',
			description: 'Control how your data is used',
			collapsible: true,
			collapsed: false,
		})
		.checkbox('personalDataProcessing', 'Personal Data Processing', {
			helpText: 'I consent to the processing of my personal data for the purpose of providing services.',
			colSpan: 2,
		})
		.checkbox('personalDataPublishing', 'Personal Data Publishing', {
			helpText: 'I consent to my name and profile information being visible to other users.',
			colSpan: 2,
		})
		.checkbox('marketing', 'Marketing Communications', {
			helpText: 'I agree to receive promotional emails, newsletters, and special offers.',
			colSpan: 2,
		})

		.build();
}

// ─── Legacy schemas (kept for backwards-compatibility) ────────────────────────

export function createPersonalInfoSchema(): FormSchema {
	return new FormBuilder({
		layout: 'two-column',
		variant: 'default',
	})
		.group('Personal Information', { variant: 'embedded', icon: 'User', collapsible: true, collapsed: false })
		.text('firstName', 'First Name', {
			placeholder: 'John',
			required: true,
			minLength: 2,
			maxLength: 150,
			colSpan: 1,
		})
		.text('lastName', 'Last Name', {
			placeholder: 'Doe',
			required: true,
			minLength: 2,
			maxLength: 150,
			colSpan: 1,
		})
		.phone('telephoneNumber', 'Phone Number', {
			colSpan: 1,
			helpText: 'Optional – used for order confirmations',
		})
		.build();
}

export function createBillingInfoSchema(): FormSchema {
	return new FormBuilder({
		layout: 'two-column',
		variant: 'default',
	})
		.group(undefined, { variant: 'embedded' })
		.text('billingFirstName', 'First Name', {
			placeholder: 'John',
			required: false,
			maxLength: 150,
			colSpan: 1,
			helpText: 'Name that will appear on your invoice',
		})
		.text('billingLastName', 'Last Name', {
			placeholder: 'Doe',
			required: false,
			maxLength: 150,
			colSpan: 1,
		})
		.address('billingStreet', 'Street & Number', {
			placeholder: 'Václavské náměstí 1',
			required: false,
			maxLength: 255,
			colSpan: 2,
			siblingFields: {
				city: 'billingCity',
				postalCode: 'billingPostalCode',
				country: 'billingCountry',
			},
		})
		.text('billingCity', 'City', {
			placeholder: 'Prague',
			required: false,
			maxLength: 100,
			colSpan: 1,
		})
		.text('billingPostalCode', 'Postal Code', {
			placeholder: '110 00',
			required: false,
			maxLength: 20,
			colSpan: 1,
		})
		.country('billingCountry', 'Country', COUNTRY_OPTIONS, {
			colSpan: 1,
			defaultValue: 'CZ',
		})
		.build();
}

export function createConsentSchema(): FormSchema {
	return new FormBuilder({
		layout: 'single',
		variant: 'default',
	})
		.group(undefined, { variant: 'embedded' })
		.checkbox('personalDataProcessing', 'Personal Data Processing', {
			helpText:
				'I consent to the processing of my personal data for the purpose of providing services.',
			colSpan: 2,
		})
		.checkbox('personalDataPublishing', 'Personal Data Publishing', {
			helpText: 'I consent to my name and profile information being visible to other users.',
			colSpan: 2,
		})
		.checkbox('marketing', 'Marketing Communications', {
			helpText: 'I agree to receive promotional emails, newsletters, and special offers.',
			colSpan: 2,
		})
		.build();
}
