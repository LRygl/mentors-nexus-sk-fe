import type { FormContext } from '$lib/types/entities/forms';
import type { Component } from 'svelte';


export interface FAQCategoryFormDataBase {
	name: string;
	description: string;
}

export interface FAQCategoryQuickFormData extends FAQCategoryFormDataBase {
	isActive?: boolean;
	isVisible?: boolean;
}

export interface FAQCategoryStandardFormData extends FAQCategoryFormDataBase {
	colorCode: string;
	slug?: string;
	iconClass?: Component;
}

// Utility type for extracting form data based on form type
export type GetFAQCategoryFormData<T extends FormContext> =
	T extends 'quick' ? FAQCategoryQuickFormData :
		T extends 'standard' ? FAQCategoryStandardFormData :
				never;
