export default {
    common: {
        translation: {
            langs: {
                en: 'English',
                fr: 'Français',
            }
        }
    },
    en: {
        translation: {
			common: {
				appname: 'Example App',
				id: 'Id',
				todo: 'Todo',
				add: 'Add',
				name: 'Name',
				priority: 'Priority',
				actions: 'Actions',
				creationSuccess: 'Created successfully',
				deletionSuccess: 'Deleted successfully',
				updateSuccess: 'Updated successfully',
				enterNewValue: 'Enter new value',
				clickCount: 'You\'ve clicked {{ count }} time',
				clickCount_plural: 'You\'ve clicked {{ count }} times'
			},
            pages: {
				home: 'Home',
                todo: 'Todo List',
			},
			errors: {
				networkError: 'A network error has occurred',
				negative: 'Can\'t be negative',
			},
        }
    },
    fr: {
		translation: {
			common: {
				clickCount: 'Vous avez cliqué {{ count }} fois',
			},
            pages: {
				home: 'Accueil',
                todo: 'Liste de choses à faire',
			},
			errors: {
				networkError: 'Une erreur réseau s\'est produite',
			},
        }
    },
}