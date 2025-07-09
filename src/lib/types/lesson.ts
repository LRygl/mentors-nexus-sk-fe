export interface Lesson {
	id: number;
	uuid: string | null;
	title: string | null;
	description: string | null;
	videoUrl: string | null;
	duration: string | null;
	orderIndex: number | null;
	course: {
		id: number;
		name: string;
		status: string | null;
		uuid: string;
		price: number | null;
	};
}


export interface LessonStoreState {
	data: Lesson[];
	loading: boolean;
	error: string | null;
	loaded: boolean;
}