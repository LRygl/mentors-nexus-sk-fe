import {
	defineEntitySchema,
	type EntityFieldConfig,
	type EntityGroupConfig,
	FormSchemaFactory
} from '$lib/components/Forms/Schemas/FormSchemaFactory';
import type { User } from '$lib/types/entities/User';
import { Role } from '$lib/types/enums/Role';

export function createUserFields(): EntityFieldConfig[] {
	return [
		{
			name: 'firstName',
			label: 'First Name',
			type: 'text',
			group: 'basic',
			variants: { standard: true, embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'John',
			helpText: 'Please enter your first name',
			colSpan: 1
		},
		{
			name: 'lastName',
			label: 'Last Name',
			type: 'text',
			group: 'basic',
			variants: { standard: true, embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'Doe',
			helpText: 'Please enter your last name',
			colSpan: 1
		},
		{
			name: 'email',
			label: 'E-Mail',
			type: 'text',
			group: 'basic',
			variants: { standard: true, embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 1
		},
		{
			name: 'telephoneNumber',
			label: 'Phone Number',
			type: 'text',
			group: 'basic',
			variants: { embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 1
		},
		{
			name: 'password',
			label: 'Password',
			type: 'text',
			group: 'basic',
			variants: { standard: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 2
		},
		{
			name: 'company',
			label: 'Company',
			type: 'text',
			group: 'basic',
			variants: { embedded: true },
			required: false,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 1
		},
		{
			name: 'role',
			label: 'Role',
			type: 'select',
			group: 'basic',
			variants: { embedded: true },
			required: true,
			options: Object.values(Role).map(role => ({
				value: role,
				label: role,
			})),
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 1
		},
		// Address Information
		{
			name: 'street',
			label: 'Street',
			type: 'text',
			group: 'address',
			variants: { embedded: true },
			required: false,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 1
		},
		// Billing Address Information

		{
			name: 'billingStreet',
			label: 'Street',
			type: 'text',
			group: 'billing',
			variants: { embedded: true },
			required: false,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 1
		},

		// Consent Information
		{
			name: 'personalDataProcessing',
			label: 'Personal Data Processing',
			type: 'checkbox',
			group: 'consent',
			variants: { embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 2
		},
		{
			name: 'personalDataPublishing',
			label: 'Personal Data Publishing',
			type: 'checkbox',
			group: 'consent',
			variants: { embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 2
		},
		{
			name: 'marketing',
			label: 'Marketing Consent',
			type: 'checkbox',
			group: 'consent',
			variants: { embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Please enter your email address',
			colSpan: 2
		},
		{
			name: 'cookiePolicyConsent',
			label: 'Cookie Policy Consent',
			type: 'checkbox',
			group: 'consent',
			variants: { embedded: true },
			required: true,
			minLength: 2,
			maxLength: 150,
			placeholder: 'john.doe@gmail.com',
			helpText: 'Shows agreement with service Cookie Policy',
			colSpan: 2
		}
	];
}

const userFormGroup: EntityGroupConfig[] = [
	{
		id: 'basic',
		title: 'Basic Information',
		description: 'Basic user account information',
		icon: 'User',
		variant: 'card',
		variants: { standard: true, embedded: true }
	},
	{
		id: 'address',
		title: 'Address Information',
		description: 'Basic user account information',
		icon: 'Mail',
		collapsed: true,
		collapsible: true,
		variant: 'card',
		variants: { embedded: true }
	},
	{
		id: 'billing',
		title: 'Billing Address Information',
		description: 'Basic user account information',
		icon: '📝',
		variant: 'card',
		collapsed: true,
		collapsible: true,
		variants: { embedded: true }
	},
	{
		id: 'consent',
		title: 'Consent Informationa',
		description: 'Basic user account information',
		icon: '📝',
		variant: 'card',
		collapsed: true,
		collapsible: true,
		variants: { embedded: true }
	}
];


export function createUserSchemaFactory():FormSchemaFactory<User> {
	return defineEntitySchema<User>({
		entity: 'User',
		fields: createUserFields(),
		groups: userFormGroup,
		variantConfig: {
			standard: {
				title: 'Create User',
				submitLabel: 'Create User',
				showReset: true,
				showCancel: true
			},
			embedded: {
				title: 'Create User',
				submitLabel: 'Create User',
				showReset: true,
				showCancel: true
			}
		}
	});
}

export const UserFormPresets = {
	standard: () => {
		return createUserSchemaFactory().create('standard');
	},
	embedded: () => {
		return createUserSchemaFactory().create('embedded');
	}
}