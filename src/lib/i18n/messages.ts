export const messages = {
	confirmation: {
		deleteSection: {
			title: 'Are you sure you want to delete this section??',
			description:
				'All lessons contained in this section will be automatically unlinked and available for other course.?'
		},
		unlinkLesson: {
			title: 'Are you sure you want to unlink this lesson?',
			description:
				'The unlinked lesson will be removed from the course curriculum and will be available to be linked to another course section'
		}
	},

	utils: {
		loading: 'Loading...'
	},

	course: {
		entity: 'Course',
		entityPlural: 'Courses',
		viewCourseDetail: 'Check Site',
		courseStudentCout: 'users',
		courseAuthor: 'Author',
		courseFeatured: 'Featured',
		courseReviews: 'Reviews',

		featured: {
			pill: 'Featured Stations',
			heading: 'Start Your ',
			headingHighlight: 'Travels',
			description:
				'Explore our most popular course designed by industry experts to accelerate your career growth',
			showAllCourses: 'View All stations'
		},

		admin: {
			heading: 'Stations',
			subHeading: 'Organize and manage application courses and their status',
			create: 'Create Terminal',
			actions: {
				viewLabel: 'View All',
				viewDescription: 'View All Stations',
				publishLabel: 'Publish',
				publishDescription: 'Publish',
				unpublishLabel: 'Unpublish',
				unpublishDescription: 'Unpublish',
				featureLabel: 'Feaure',
				featureDescription: 'Feaure',
				unfeatureLabel: 'Unfeature',
				unfeatureDescription: 'Unfeature',
				deleteLabel: 'Delete',
				deleteDescription: 'Delete',

			},
		},

		data: {
			emptyTitle: 'No Stations Found',
			emptyDescription:
				'Currently there are no stations created. To create a new station click on the button below and fill in the form to create your first station',
			emptyActionLabel: 'Create your first Station',
			loadingTitle: 'Loading Stations',
			loadingDescription: 'Please wait while we fetch your Stations...',
			searchPlaceholder: 'Search Stations...'
		},
		form: {}
	},

	courseCategory: {
		formGroup: {
			contentGroupTitle: 'Course Category details',
			contentGroupDescription: 'Provide basic information about the course category'
		},
		forms: {
			title: 'Create New Course Category',
			subTitle: 'Add a new course category to manage and organize your courses',
			submitLabel: 'Create Category',
			name: 'Category Name',
			nameHelpText: 'Provide the name for the category',
			namePlaceholder: 'MCP Server',
			description: 'Description',
			descriptionPlaceholder: 'AI and MCP Servers',
			descriptionHelpText: 'Provide catchy description for the course category'
		},
		modal: {

		},
		toast: {

		}
	},

	buttons: {
		default: {
			confirm: {
				confirm: 'Confirm',
				success: 'OK',
				error: 'OK',
				warning: 'Proceed',
				info: 'OK',
				delete: 'Delete',
				cancel: 'Cancel'
			}
		}
	},

	store: {
		clearFilters: 'Clear Filters',
		noCoursesFound: 'No stations found.'
	}
} as const;

export type MessageKey = typeof messages;