// $lib/config/theme.config.ts

import type {
	ColorShade,
	ColorType,
	AnimationDuration,
	BorderRadius
} from '$lib/types/theme.types';

/**
 * Gradient configuration
 */
export interface GradientConfig {
	from: string;
	via?: string;
	to: string;
	direction?: 'r' | 'l' | 't' | 'b' | 'tr' | 'tl' | 'br' | 'bl';
}

/**
 * Color palette interface
 */
export interface ColorPalette {
	// Base colors
	primary: string;
	secondary: string;
	accent: string;

	// Semantic colors
	success: string;
	warning: string;
	error: string;
	info: string;

	// Neutral colors
	background: string;
	foreground: string;
	muted: string;
	border: string;
}

/**
 * Main theme configuration interface
 */
export interface ThemeConfig {
	// Theme metadata
	id?: string;
	name: string;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;

	// Brand identity
	brand: {
		name: string;
		logo: {
			light: string;
			dark: string;
		};
	};

	// Color system
	colors: {
		primary: Record<ColorShade, string>;
		secondary: Record<ColorShade, string>;
		accent: Record<ColorShade, string>;

		// Semantic colors (optional for backwards compatibility)
		success?: {
			main: string;
			light: string;
			dark: string;
		};
		warning?: {
			main: string;
			light: string;
			dark: string;
		};
		error?: {
			main: string;
			light: string;
			dark: string;
		};
		info?: {
			main: string;
			light: string;
			dark: string;
		};

		// Neutral scale
		neutral: Record<ColorShade, string>;
	};

	// Gradient presets
	gradients: {
		primary: GradientConfig;
		secondary: GradientConfig;
		accent: GradientConfig;
		success: GradientConfig;
		warning: GradientConfig;
		error: GradientConfig;
		hero: GradientConfig;
		card: GradientConfig;
		button: GradientConfig;
	};

	// Component-specific configurations
	components: {
		borderRadius: BorderRadius;
		navbar: {
			height: string;
			background: string;
			borderColor: string;
		};
		button: {
			borderRadius: string;
			padding: {
				sm: string;
				md: string;
				lg: string;
			};
		};
		card: {
			borderRadius: string;
			shadow: string;
		};
		badge: {
			borderRadius: string;
		};
		input: {
			borderRadius: string;
			borderColor: string;
		};
	};

	// Animation settings
	animations: {
		duration: AnimationDuration;
		easing: {
			default: string;
			smooth: string;
			bounce: string;
		};
	};

	// Spacing scale (8px base)
	spacing: {
		xs: string;
		sm: string;
		md: string;
		lg: string;
		xl: string;
		'2xl': string;
		'3xl': string;
		'4xl': string;
	};

	// Typography
	typography: {
		fontFamily: {
			sans: string;
			serif: string;
			mono: string;
		};
		fontSize: {
			xs: string;
			sm: string;
			base: string;
			lg: string;
			xl: string;
			'2xl': string;
			'3xl': string;
			'4xl': string;
			'5xl': string;
			'6xl': string;
			'7xl': string;
		};
		fontWeight: {
			light: number;
			normal: number;
			medium: number;
			semibold: number;
			bold: number;
			black: number;
		};
		headingWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900';
		bodyWeight: '300' | '400' | '500' | '600';
	};
}

/**
 * Default Theme Configuration
 */
export const defaultTheme: ThemeConfig = {
	id: 'default',
	name: 'Default Theme',
	isActive: true,

	brand: {
		name: 'EduPlatform',
		logo: {
			light: '/logo-light.png',
			dark: '/logo-dark.png'
		}
	},

	colors: {
		primary: {
			'50': '#eff6ff',
			'100': '#dbeafe',
			'200': '#bfdbfe',
			'300': '#93c5fd',
			'400': '#60a5fa',
			'500': '#3b82f6',
			'600': '#2563eb',
			'700': '#1d4ed8',
			'800': '#1e40af',
			'900': '#1e3a8a',
			'950': '#172554'
		},
		secondary: {
			'50': '#faf5ff',
			'100': '#f3e8ff',
			'200': '#e9d5ff',
			'300': '#d8b4fe',
			'400': '#c084fc',
			'500': '#a855f7',
			'600': '#9333ea',
			'700': '#7e22ce',
			'800': '#6b21a8',
			'900': '#581c87',
			'950': '#3b0764'
		},
		accent: {
			'50': '#ecfeff',
			'100': '#cffafe',
			'200': '#a5f3fc',
			'300': '#67e8f9',
			'400': '#22d3ee',
			'500': '#06b6d4',
			'600': '#0891b2',
			'700': '#0e7490',
			'800': '#155e75',
			'900': '#164e63',
			'950': '#083344'
		},
		success: {
			main: '#10b981',
			light: '#34d399',
			dark: '#059669'
		},
		warning: {
			main: '#f59e0b',
			light: '#fbbf24',
			dark: '#d97706'
		},
		error: {
			main: '#ef4444',
			light: '#f87171',
			dark: '#dc2626'
		},
		info: {
			main: '#3b82f6',
			light: '#60a5fa',
			dark: '#2563eb'
		},
		neutral: {
			'50': '#f8fafc',
			'100': '#f1f5f9',
			'200': '#e2e8f0',
			'300': '#cbd5e1',
			'400': '#94a3b8',
			'500': '#64748b',
			'600': '#475569',
			'700': '#334155',
			'800': '#1e293b',
			'900': '#0f172a',
			'950': '#020617'
		}
	},

	gradients: {
		primary: {
			from: 'blue-500',
			via: 'purple-500',
			to: 'indigo-600'
		},
		secondary: {
			from: 'purple-500',
			via: 'pink-500',
			to: 'rose-500'
		},
		accent: {
			from: 'cyan-500',
			via: 'teal-500',
			to: 'blue-500'
		},
		success: {
			from: 'emerald-500',
			via: 'green-500',
			to: 'teal-500'
		},
		warning: {
			from: 'orange-500',
			via: 'amber-500',
			to: 'yellow-500'
		},
		error: {
			from: 'red-500',
			via: 'rose-500',
			to: 'pink-500'
		},
		hero: {
			from: 'slate-900',
			via: 'blue-900',
			to: 'indigo-900'
		},
		card: {
			from: 'blue-50',
			via: 'purple-50',
			to: 'pink-50'
		},
		button: {
			from: 'blue-500',
			via: 'purple-500',
			to: 'indigo-500'
		}
	},

	components: {
		borderRadius: '2xl',
		navbar: {
			height: '80px',
			background: 'bg-white/95 dark:bg-slate-900/95',
			borderColor: 'border-gray-200 dark:border-slate-800'
		},
		button: {
			borderRadius: 'rounded-xl',
			padding: {
				sm: 'px-4 py-2',
				md: 'px-6 py-3',
				lg: 'px-8 py-4'
			}
		},
		card: {
			borderRadius: 'rounded-3xl',
			shadow: 'shadow-xl'
		},
		badge: {
			borderRadius: 'rounded-full'
		},
		input: {
			borderRadius: 'rounded-xl',
			borderColor: 'border-gray-200 dark:border-slate-700'
		}
	},

	animations: {
		duration: 'normal',
		easing: {
			default: 'cubic-bezier(0.4, 0, 0.2, 1)',
			smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
			bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
		}
	},

	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem',
		'2xl': '3rem',
		'3xl': '4rem',
		'4xl': '6rem'
	},

	typography: {
		fontFamily: {
			sans: 'Inter, system-ui, -apple-system, sans-serif',
			serif: 'Georgia, Cambria, serif',
			mono: 'Consolas, Monaco, monospace'
		},
		fontSize: {
			xs: '0.75rem',
			sm: '0.875rem',
			base: '1rem',
			lg: '1.125rem',
			xl: '1.25rem',
			'2xl': '1.5rem',
			'3xl': '1.875rem',
			'4xl': '2.25rem',
			'5xl': '3rem',
			'6xl': '3.75rem',
			'7xl': '4.5rem'
		},
		fontWeight: {
			light: 300,
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700,
			black: 900
		},
		headingWeight: '700',
		bodyWeight: '400'
	}
};

/**
 * Theme presets
 */
export const themePresets: Record<string, ThemeConfig> = {
	default: defaultTheme,

	ocean: {
		...defaultTheme,
		id: 'ocean',
		name: 'Ocean Theme',
		isActive: false,
		colors: {
			...defaultTheme.colors,
			primary: {
				'50': '#f0f9ff',
				'100': '#e0f2fe',
				'200': '#bae6fd',
				'300': '#7dd3fc',
				'400': '#38bdf8',
				'500': '#0ea5e9',
				'600': '#0284c7',
				'700': '#0369a1',
				'800': '#075985',
				'900': '#0c4a6e',
				'950': '#082f49'
			},
			secondary: {
				'50': '#f0fdfa',
				'100': '#ccfbf1',
				'200': '#99f6e4',
				'300': '#5eead4',
				'400': '#2dd4bf',
				'500': '#14b8a6',
				'600': '#0d9488',
				'700': '#0f766e',
				'800': '#115e59',
				'900': '#134e4a',
				'950': '#042f2e'
			}
		},
		gradients: {
			...defaultTheme.gradients,
			primary: {
				from: 'sky-500',
				via: 'cyan-500',
				to: 'teal-500'
			},
			hero: {
				from: 'slate-900',
				via: 'cyan-900',
				to: 'teal-900'
			}
		}
	},

	sunset: {
		...defaultTheme,
		id: 'sunset',
		name: 'Sunset Theme',
		isActive: false,
		colors: {
			...defaultTheme.colors,
			primary: {
				'50': '#fff7ed',
				'100': '#ffedd5',
				'200': '#fed7aa',
				'300': '#fdba74',
				'400': '#fb923c',
				'500': '#f97316',
				'600': '#ea580c',
				'700': '#c2410c',
				'800': '#9a3412',
				'900': '#7c2d12',
				'950': '#431407'
			},
			secondary: {
				'50': '#fdf2f8',
				'100': '#fce7f3',
				'200': '#fbcfe8',
				'300': '#f9a8d4',
				'400': '#f472b6',
				'500': '#ec4899',
				'600': '#db2777',
				'700': '#be185d',
				'800': '#9d174d',
				'900': '#831843',
				'950': '#500724'
			}
		},
		gradients: {
			...defaultTheme.gradients,
			primary: {
				from: 'orange-500',
				via: 'pink-500',
				to: 'rose-500'
			},
			hero: {
				from: 'slate-900',
				via: 'orange-900',
				to: 'pink-900'
			}
		}
	}
};

/**
 * Helper Functions
 */

export function getGradientClass(gradient: GradientConfig): string {
	const direction = gradient.direction || 'r';
	const via = gradient.via ? ` ${gradient.via}` : '';
	return `bg-gradient-to-${direction} ${gradient.from}${via} ${gradient.to}`;
}

// Get current active theme
let activeTheme: ThemeConfig = defaultTheme;

export function getTheme(): ThemeConfig {
	return activeTheme;
}

export function setTheme(theme: ThemeConfig | keyof typeof themePresets) {
	if (typeof theme === 'string') {
		activeTheme = themePresets[theme];
	} else {
		activeTheme = theme;
	}

	// Optionally persist to localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem('app-theme', JSON.stringify(activeTheme));
	}
}

// Load theme from storage on initialization
if (typeof window !== 'undefined') {
	const stored = localStorage.getItem('app-theme');
	if (stored) {
		try {
			activeTheme = JSON.parse(stored);
		} catch (e) {
			console.error('Failed to parse stored theme:', e);
		}
	}
}
