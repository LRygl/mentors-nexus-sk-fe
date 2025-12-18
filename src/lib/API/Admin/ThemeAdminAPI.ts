import { API_CONFIG } from '$lib/API/APIConfiguration';
import type { ThemeConfig } from '$lib/Config/theme.config';
import { BaseApiService } from '$lib/API/APIBase';

export class ThemeAdminAPI extends BaseApiService {
	protected readonly endpoint = API_CONFIG.ENDPOINTS.ADMIN.SETTINGS.THEME; // e.g., '/admin/themes'

	constructor() {
		super(API_CONFIG.BASE_URL);
	}

	/**
	 * Get all themes
	 */
	async getAllThemes(): Promise<ThemeConfig[]> {
		return this.get<ThemeConfig[]>(this.endpoint);
	}

	/**
	 * Get theme by ID
	 */
	async getThemeById(id: string): Promise<ThemeConfig> {
		return this.get<ThemeConfig>(`${this.endpoint}/${id}`);
	}

	/**
	 * Get currently active theme
	 */
	async getActiveTheme(): Promise<ThemeConfig> {
		return this.get<ThemeConfig>(`${this.endpoint}/active`);
	}

	/**
	 * Create new theme
	 */
	async createTheme(themeData: Partial<ThemeConfig>): Promise<ThemeConfig> {
		return this.post<ThemeConfig>(this.endpoint, themeData);
	}

	/**
	 * Update existing theme
	 */
	async updateTheme(id: string, themeData: Partial<ThemeConfig>): Promise<ThemeConfig> {
		return this.put<ThemeConfig>(`${this.endpoint}/${id}`, themeData);
	}

	/**
	 * Delete theme
	 */
	async deleteTheme(id: string): Promise<void> {
		return this.delete<void>(`${this.endpoint}/${id}`);
	}

	/**
	 * Activate theme (set as active for entire application)
	 */
	async activateTheme(id: string): Promise<ThemeConfig> {
		return this.post<ThemeConfig>(`${this.endpoint}/${id}/activate`, {});
	}

	/**
	 * Duplicate theme (clone with new name)
	 */
	async duplicateTheme(id: string, newName: string): Promise<ThemeConfig> {
		return this.post<ThemeConfig>(`${this.endpoint}/${id}/duplicate`, { name: newName });
	}

	/**
	 * Export theme as JSON
	 */
	async exportTheme(id: string): Promise<Blob> {
		const response = await fetch(`${this.buildUrl(`${this.endpoint}/${id}/export`)}`, {
			method: 'GET',
			credentials: 'include'
		});

		if (!response.ok) {
			throw new Error('Failed to export theme');
		}

		return response.blob();
	}

	/**
	 * Import theme from JSON
	 */
	async importTheme(file: File): Promise<ThemeConfig> {
		const formData = new FormData();
		formData.append('file', file);

		return this.postMultipart<ThemeConfig>(`${this.endpoint}/import`, formData);
	}

	/**
	 * Validate theme configuration
	 */
	async validateTheme(
		themeData: Partial<ThemeConfig>
	): Promise<{ valid: boolean; errors?: string[] }> {
		return this.post(`${this.endpoint}/validate`, themeData);
	}

	private buildUrl(path: string): string {
		return `${this.baseUrl}${path}`;
	}
}

export const themeAdminAPI = new ThemeAdminAPI();
