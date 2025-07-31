import { buildApiUrl} from '$lib/config/api';
import type { User, UserListResponse } from '$lib/types/user';
import type { PrivacySetting } from '$lib/types/privacySetting';

// Mapping from frontend setting names to backend consent field names
const PRIVACY_SETTING_MAP: Record<PrivacySetting, string> = {
	personalDataProcessing: 'personalDataProcessingConsent',
	personalDataPublishing: 'personalDataPublishingConsent',
	marketing: 'marketingConsent'
};

export async function getAllUsers(): Promise<UserListResponse> {
	try {
		const response = await fetch(buildApiUrl(`/user/all`),{
			method: 'GET',
				headers: { 'Content-Type': 'application/json' },
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		const data = await response.json();
		return data as UserListResponse;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getUserById(id: string): Promise<User> {
	try {
		const response = await fetch(buildApiUrl(`/user/${id}`),{
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		});
		console.log('User ID For Lookup: '+ id)
		if (!response.ok) {
			throw new Error(response.statusText);
		}
		console.log(response.body);
		const data = await response.json();
		return data as User; // Return single User
	} catch(error) {
		console.error(error);
		throw error;
	}
}




export async function updateUserPrivacySetting(
	userId: string,
	setting: PrivacySetting,
	value: boolean
): Promise<void> {
	// Map the setting to the backend field name
	const backendFieldName = PRIVACY_SETTING_MAP[setting];

	// Construct the request body with only the specific setting
	const requestBody = {
		[backendFieldName]: value
	};
	console.log('Request body being sent:', requestBody); // Debug log
	const response = await fetch(buildApiUrl(`/user/${userId}/consent`), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(requestBody)
	});

	if (!response.ok) {
		throw new Error(`Failed to update ${setting}: ${response.statusText}`);
	}
}





export async function deleteUser(id: string): Promise<void> {
	console.log("API CALL To Delete User with ID " + id);
	const response = await fetch(buildApiUrl(`/user/${id}`), {
		method: 'DELETE'
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}

