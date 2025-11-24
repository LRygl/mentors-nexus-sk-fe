export const messages = {

	confirmation: {

		deleteSection: {
			title: 'Are you sure you want to delete this section??',
			description: 'All lessons contained in this section will be automatically unlinked and available for other course.?',
		},
		unlinkLesson: {
			title: 'Are you sure you want to unlink this lesson?',
			description: "The unlinked lesson will be removed from the course curriculum and will be available to be linked to another course section"
		},
	},

	utils: {
		loading: 'Loading...',
	},

	course: {
		viewCourseDetail: 'Check Site',
		courseStudentCout: 'users',
		courseAuthor: 'Author',
		courseFeatured: 'Featured',
		courseReviews: 'Reviews',

		featured: {
			pill: 'Featured Stations',
			heading: 'Start Your ',
			headingHighlight: 'Travels',
			description: 'Explore our most popular course designed by industry experts to accelerate your career growth',
			showAllCourses: 'View All stations',
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
				cancel: 'Cancel',
			},
		},


	},

	store: {
		clearFilters: 'Clear Filters',
		noCoursesFound: 'No stations found.',
	}

} as const

export type MessageKey = typeof messages;