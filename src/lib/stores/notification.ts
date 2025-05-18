	import { writable, type Writable } from 'svelte/store';

	const NOTIFICATION_TIMEOUT = 300000

	type NotificationType = 'default' | 'danger' | 'warning' | 'info' | 'success';

	interface Notification {
		id: string;
		type: NotificationType;
		message: string;
		devMessage: string;
	}


	const createNotificationStore = () => {
		const timeouts = new Map<string, ReturnType<typeof setTimeout>>();
		const _notifications = writable<Notification[]>([]);

		const send = (message: string, type: string = 'default') => {
			const _id = generateId();
			console.log('Notification created with _id', _id);
			_notifications.update((state) => [...state, { id: _id, type, message }]);

			const timeout = setTimeout(() => {
				remove(_id);
			}, NOTIFICATION_TIMEOUT);

			timeouts.set(_id, timeout);
		};

		const remove = (id: string) => {

			console.log("removing notification", id);
			clearTimeout(timeouts.get(id));
			timeouts.delete(id);
			_notifications.update((state) => state.filter((n) => n.id !== id));
		};

		const { subscribe } = _notifications;

		return {
			subscribe,
			send,
			remove,
			danger: (msg: string) => send(msg, 'danger'),
			warning: (msg: string) => send(msg, 'warning'),
			info: (msg: string) => send(msg, 'info'),
			success: (msg: string) => send(msg, 'success')
		};

	};

	function generateId(): string {
		return '_' + Math.random().toString(36).substr(2, 9);
	}

	export const notifications = createNotificationStore()

