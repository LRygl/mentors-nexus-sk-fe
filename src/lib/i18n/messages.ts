export const messages = {

	confirmation: {

		deleteSection: {
			title: 'Are you sure you want to delete this section??',
			description: 'All lessons contained in this section will be automatically unlinked and available for other courses.?',
		},
		unlinkLesson: {
			title: 'Are you sure you want to unlink this lesson?',
			description: "The unlinked lesson will be removed from the course curriculum and will be available to be linked to another course section"
		},
	},

	utils: {
		loading: 'Loading...',
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


	}

} as const

export type MessageKey = typeof messages;