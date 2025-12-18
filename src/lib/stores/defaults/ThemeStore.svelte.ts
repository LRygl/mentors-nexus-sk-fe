import { BaseStoreSvelte } from '$lib/stores/BaseStore.svelte';
import { defaultTheme, type ThemeConfig } from '$lib/Config/theme.config';
import { themeAdminAPI, type ThemeAdminAPI } from '$lib/API/Admin/ThemeAdminAPI';


/**
 * Store for managing application themes
 * Handles theme CRUD, activation, preview, and CSS injection
 * Extends BaseStoreSvelte for standard operations
 */
export class ThemeStoreSvelte extends BaseStoreSvelte<
	ThemeConfig,
	Partial<ThemeConfig>,
	Partial<ThemeConfig>,
	ThemeAdminAPI
> {
	// Current active theme (applied to the application)
	private _activeTheme = $state<ThemeConfig>(defaultTheme);

	// Theme being previewed (temporary, not saved)
	private _previewTheme = $state<ThemeConfig | null>(null);

	// Preview mode flag
	private _isPreviewMode = $state(false);

	// Loading state for theme activation
	private _activating = $state(false);

	// Import/Export operations
	private _importing = $state(false);
	private _exporting = $state(false);

	constructor() {
		super(themeAdminAPI);

		// Load and apply active theme on initialization
		this.initializeTheme();
	}

	// ============================================================================
	// GETTERS
	// ============================================================================

	/**
	 * Get the currently active theme (what's actually applied)
	 */
	get activeTheme(): ThemeConfig {
		return this._activeTheme;
	}

	/**
	 * Get the theme currently being previewed (if any)
	 */
	get previewedTheme(): ThemeConfig | null {
		return this._previewTheme;
	}

	/**
	 * Check if in preview mode
	 */
	get isPreviewMode(): boolean {
		return this._isPreviewMode;
	}

	/**
	 * Get the theme that should be applied to the UI
	 * Returns preview theme if previewing, otherwise active theme
	 */
	get currentTheme(): ThemeConfig {
		return this._isPreviewMode && this._previewTheme ? this._previewTheme : this._activeTheme;
	}

	/**
	 * Check if activating a theme
	 */
	get activating(): boolean {
		return this._activating;
	}

	/**
	 * Check if importing/exporting
	 */
	get importing(): boolean {
		return this._importing;
	}

	get exporting(): boolean {
		return this._exporting;
	}

	// ============================================================================
	// INITIALIZATION
	// ============================================================================

	/**
	 * Initialize theme system - load and apply active theme
	 */
	private async initializeTheme(): Promise<void> {
		try {
			// Try to load active theme from backend
			const activeTheme = await this.apiService.getActiveTheme();
			this._activeTheme = activeTheme;
			this.applyTheme(activeTheme);
		} catch (error) {
			console.warn('[ThemeStore] Failed to load active theme, using default:', error);
			// Fallback to default theme
			this._activeTheme = defaultTheme;
			this.applyTheme(defaultTheme);
		}
	}

	// ============================================================================
	// BASIC DATA FETCHING
	// ============================================================================

	/**
	 * Fetch all themes (non-paginated)
	 */
	async fetchAll(): Promise<ThemeConfig[]> {
		this._loading = true;
		this._error = null;

		try {
			this._data = await this.apiService.getAllThemes();
			return this._data;
		} catch (error) {
			this._error = error instanceof Error ? error.message : 'Failed to load themes';
			console.error('[ThemeStore] Error fetching all themes:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	/**
	 * Fetch active theme from backend
	 */
	async fetchActiveTheme(): Promise<ThemeConfig> {
		this._loading = true;
		this._error = null;

		try {
			const theme = await this.apiService.getActiveTheme();
			this._activeTheme = theme;
			this.applyTheme(theme);
			return theme;
		} catch (error) {
			this._error = error instanceof Error ? error.message : 'Failed to load active theme';
			console.error('[ThemeStore] Error fetching active theme:', error);
			throw error;
		} finally {
			this._loading = false;
		}
	}

	/**
	 * Load a specific theme by ID
	 */
	async loadItem(id: string): Promise<ThemeConfig | null> {
		// Clear previous selection
		this._selectedItem = null;

		if (this._loadingItem) return null;

		this._loadingItem = true;
		this._itemError = null;

		try {
			const theme = await this.apiService.getThemeById(id);
			this._selectedItem = theme;
			console.log('[ThemeStore] Loaded theme:', theme.name);
			return theme;
		} catch (error) {
			this._itemError = error instanceof Error ? error.message : 'Failed to load theme';
			console.error('[ThemeStore] Error loading theme:', error);
			return null;
		} finally {
			this._loadingItem = false;
		}
	}

	// ============================================================================
	// BASIC CRUD (Required by BaseStoreSvelte)
	// ============================================================================

	async createItem(createData: Partial<ThemeConfig>): Promise<ThemeConfig> {
		return await this.apiService.createTheme(createData);
	}

	async updateItem(id: string, updateData: Partial<ThemeConfig>): Promise<ThemeConfig> {
		return await this.apiService.updateTheme(id, updateData);
	}

	async deleteItem(id: string): Promise<void> {
		await this.apiService.deleteTheme(id);
	}

	// ============================================================================
	// THEME ACTIVATION
	// ============================================================================

	/**
	 * Activate a theme (set as active for entire application)
	 * This persists to backend and applies to all users
	 */
	async activateTheme(id: string): Promise<boolean> {
		if (this._activating) return false;

		this._activating = true;
		this._error = null;

		try {
			// Call backend to activate theme
			const activatedTheme = await this.apiService.activateTheme(id);

			// Update local state
			this._activeTheme = activatedTheme;

			// Update all themes' active status in the data array
			this._data = this._data.map((theme) => ({
				...theme,
				isActive: theme.id === id
			}));

			// Apply the theme to the UI
			this.applyTheme(activatedTheme);

			// Exit preview mode if we were previewing
			this.exitPreview();

			console.log('[ThemeStore] Theme activated successfully:', activatedTheme.name);
			return true;
		} catch (error) {
			this._error = error instanceof Error ? error.message : 'Failed to activate theme';
			console.error('[ThemeStore] Error activating theme:', error);
			return false;
		} finally {
			this._activating = false;
		}
	}

	// ============================================================================
	// THEME PREVIEW (Temporary, not saved)
	// ============================================================================

	/**
	 * Preview a theme without activating it
	 * This is temporary and doesn't persist
	 * METHOD - not conflicting with getter anymore since getter is renamed
	 */
	setPreviewTheme(theme: ThemeConfig): void {
		this._previewTheme = theme;
		this._isPreviewMode = true;
		this.applyTheme(theme);
		console.log('[ThemeStore] Previewing theme:', theme.name);
	}

	/**
	 * Preview a theme by ID
	 */
	async previewThemeById(id: string): Promise<void> {
		try {
			const theme = await this.apiService.getThemeById(id);
			this.setPreviewTheme(theme); // Now calls setPreviewTheme method
		} catch (error) {
			console.error('[ThemeStore] Error loading theme for preview:', error);
			throw error;
		}
	}

	/**
	 * Exit preview mode and return to active theme
	 */
	exitPreview(): void {
		this._previewTheme = null;
		this._isPreviewMode = false;
		this.applyTheme(this._activeTheme);
		console.log('[ThemeStore] Exited preview mode');
	}
	// ============================================================================
	// THEME APPLICATION (CSS Injection)
	// ============================================================================

	/**
	 * Apply theme to the DOM by injecting CSS variables
	 * This is what actually changes the UI appearance
	 */
	private applyTheme(theme: ThemeConfig): void {
		if (typeof document === 'undefined') return;

		console.log('[ThemeStore] Applying theme:', theme.name);

		// Generate CSS variables
		const cssVars = this.generateCSSVariables(theme);

		// Inject or update style element
		let styleElement = document.getElementById('theme-variables');
		if (!styleElement) {
			styleElement = document.createElement('style');
			styleElement.id = 'theme-variables';
			document.head.appendChild(styleElement);
		}

		styleElement.textContent = cssVars;

		// Apply root-level styles - FIX: Access the sans property
		const root = document.documentElement;
		root.style.setProperty('--font-family-base', theme.typography.fontFamily.sans);

		// Store theme in localStorage for persistence across page reloads
		if (this._isPreviewMode) {
			// Don't persist preview themes
			sessionStorage.setItem('preview-theme', JSON.stringify(theme));
		} else {
			localStorage.setItem('active-theme-id', theme.id || '');
		}
	}

	/**
	 * Generate CSS variables from theme configuration
	 */
	private generateCSSVariables(theme: ThemeConfig): string {
		const vars: string[] = [':root {'];

		// Primary colors - use the full scale
		Object.entries(theme.colors.primary).forEach(([shade, color]) => {
			vars.push(`  --color-primary-${shade}: ${color};`);
		});

		// Secondary colors
		Object.entries(theme.colors.secondary).forEach(([shade, color]) => {
			vars.push(`  --color-secondary-${shade}: ${color};`);
		});

		// Accent colors
		Object.entries(theme.colors.accent).forEach(([shade, color]) => {
			vars.push(`  --color-accent-${shade}: ${color};`);
		});

		// Typography
		vars.push(`  --font-family: ${theme.typography.fontFamily.sans};`);
		vars.push(`  --font-weight-heading: ${theme.typography.headingWeight};`);
		vars.push(`  --font-weight-body: ${theme.typography.bodyWeight};`);

		// Component styles
		vars.push(`  --border-radius: ${this.getBorderRadiusValue(theme.components.borderRadius)};`);

		// Animation settings - now works with union type
		const speedMap: Record<ThemeConfig['animations']['duration'], string> = {
			fast: '150ms',
			normal: '300ms',
			slow: '500ms'
		};
		vars.push(`  --animation-speed: ${speedMap[theme.animations.duration]};`);

		vars.push('}');

		return vars.join('\n');
	}

	/**
	 * Convert border radius enum to CSS value
	 */
	private getBorderRadiusValue(size: ThemeConfig['components']['borderRadius']): string {
		const map: Record<ThemeConfig['components']['borderRadius'], string> = {
			none: '0',
			sm: '0.125rem',
			md: '0.375rem',
			lg: '0.5rem',
			xl: '0.75rem',
			'2xl': '1rem',
			'3xl': '1.5rem',
			full: '9999px'
		};
		return map[size];
	}

	// ============================================================================
	// UTILITY METHODS
	// ============================================================================

	/**
	 * Get gradient class string for use in components
	 */
	getGradientClass(
		type: keyof ThemeConfig['gradients'],
		direction: 'r' | 'l' | 'br' | 'bl' | 'tr' | 'tl' = 'r'
	): string {
		const theme = this.currentTheme;
		const gradient = theme.gradients[type];
		const via = gradient.via ? ` via-${gradient.via}` : '';
		return `bg-gradient-to-${direction} from-${gradient.from}${via} to-${gradient.to}`;
	}

	/**
	 * Get color value from current theme
	 */
	getColor(
		colorType: 'primary' | 'secondary' | 'accent',
		shade:
			| '50'
			| '100'
			| '200'
			| '300'
			| '400'
			| '500'
			| '600'
			| '700'
			| '800'
			| '900'
			| '950' = '500'
	): string {
		return this.currentTheme.colors[colorType][shade];
	}

	/**
	 * Check if a theme is currently active
	 */
	isThemeActive(themeId: string): boolean {
		return this._activeTheme.id === themeId;
	}

	// ============================================================================
	// DUPLICATE & IMPORT/EXPORT
	// ============================================================================

	/**
	 * Duplicate an existing theme
	 */
	async duplicateTheme(id: string, newName?: string): Promise<ThemeConfig | null> {
		this._creating = true;
		this._createError = null;

		try {
			const originalTheme = await this.apiService.getThemeById(id);
			const duplicateName = newName || `${originalTheme.name} (Copy)`;

			const duplicatedTheme = await this.apiService.duplicateTheme(id, duplicateName);

			// Add to data array
			this._data = [duplicatedTheme, ...this._data];
			this._totalElements += 1;

			console.log('[ThemeStore] Theme duplicated:', duplicatedTheme.name);
			return duplicatedTheme;
		} catch (error) {
			this._createError = error instanceof Error ? error.message : 'Failed to duplicate theme';
			console.error('[ThemeStore] Error duplicating theme:', error);
			return null;
		} finally {
			this._creating = false;
		}
	}

	/**
	 * Export theme as JSON file
	 */
	async exportTheme(id: string, filename?: string): Promise<void> {
		this._exporting = true;

		try {
			const blob = await this.apiService.exportTheme(id);
			const theme = this._data.find((t) => t.id === id);
			const downloadFilename = filename || `${theme?.name || 'theme'}-export.json`;

			// Create download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = downloadFilename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			console.log('[ThemeStore] Theme exported:', downloadFilename);
		} catch (error) {
			console.error('[ThemeStore] Error exporting theme:', error);
			throw error;
		} finally {
			this._exporting = false;
		}
	}

	/**
	 * Import theme from JSON file
	 */
	async importTheme(file: File): Promise<ThemeConfig | null> {
		this._importing = true;
		this._createError = null;

		try {
			const importedTheme = await this.apiService.importTheme(file);

			// Add to data array
			this._data = [importedTheme, ...this._data];
			this._totalElements += 1;

			console.log('[ThemeStore] Theme imported:', importedTheme.name);
			return importedTheme;
		} catch (error) {
			this._createError = error instanceof Error ? error.message : 'Failed to import theme';
			console.error('[ThemeStore] Error importing theme:', error);
			return null;
		} finally {
			this._importing = false;
		}
	}

	/**
	 * Validate theme configuration before saving
	 */
	async validateTheme(
		themeData: Partial<ThemeConfig>
	): Promise<{ valid: boolean; errors?: string[] }> {
		try {
			return await this.apiService.validateTheme(themeData);
		} catch (error) {
			console.error('[ThemeStore] Error validating theme:', error);
			return { valid: false, errors: ['Validation failed'] };
		}
	}

	// ============================================================================
	// OPTIMISTIC UPDATES
	// ============================================================================

	/**
	 * Update theme with optimistic UI update
	 * Updates UI immediately, rolls back on error
	 */
	async updateThemeOptimistic(
		id: string,
		updateData: Partial<ThemeConfig>
	): Promise<ThemeConfig | null> {
		return this.optimisticUpdate(
			id,
			(currentTheme) => ({ ...currentTheme, ...updateData }),
			async () => {
				const updatedTheme = await this.update(id, updateData);

				// If this is the active theme, reapply it
				if (this._activeTheme.id === id && updatedTheme) {
					this._activeTheme = updatedTheme;
					this.applyTheme(updatedTheme);
				}

				return updatedTheme;
			}
		);
	}

	// ============================================================================
	// RESET & CLEANUP
	// ============================================================================

	/**
	 * Reset to default theme
	 */
	resetToDefault(): void {
		this._activeTheme = defaultTheme;
		this.exitPreview();
		this.applyTheme(defaultTheme);
		console.log('[ThemeStore] Reset to default theme');
	}

	/**
	 * Clear all theme state
	 */
	override clear(): void {
		super.clear();
		this._previewTheme = null;
		this._isPreviewMode = false;
		// Don't reset active theme - keep current theme applied
	}
}

export const themeStoreSvelte = new ThemeStoreSvelte();