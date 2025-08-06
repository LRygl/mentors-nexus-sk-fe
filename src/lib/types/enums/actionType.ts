export enum ActionType {
	SUCCESS = 'success',
	WARNING = 'warning',
	DANGER = 'danger',
	DEFAULT = 'default',
}

export const ACTION_LABELS: Record<ActionType, string> = {
	[ActionType.DANGER]: 'Danger',
	[ActionType.DEFAULT]: 'Default',
	[ActionType.SUCCESS]: 'Success',
	[ActionType.WARNING]: 'Warning',
}

export const ACTION_STYLES: Record<ActionType, string> = {
	[ActionType.DANGER]: 'hover:bg-red-50 hover:text-red-700 group-hover:bg-red-100 group-hover:text-red-600',
	[ActionType.DEFAULT]: 'hover:bg-indigo-50 hover:text-indigo-700 group-hover:bg-indigo-100 group-hover:text-indigo-600',
	[ActionType.SUCCESS]: 'hover:bg-emerald-50 hover:text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-600',
	[ActionType.WARNING]: 'hover:bg-orange-50 hover:text-orange-700 group-hover:bg-orange-100 group-hover:text-orange-600',
}

export function getActionLabel(actionType?: ActionType): string {
	return actionType ? ACTION_LABELS[actionType] : ACTION_LABELS[ActionType.DEFAULT];
}

export function getActionStyle(actionType?: ActionType): string {
	return actionType ? ACTION_STYLES[actionType] : ACTION_STYLES[ActionType.DEFAULT];
}