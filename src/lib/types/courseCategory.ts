
export class CourseCategory {
	id!: number;            // Corresponds to Long in Java
	uuid!: string;          // UUID as a string
	name!: string;          // String
	created!: Date;         // Instant in Java maps to Date
	updated!: Date;         // Instant in Java maps to Date

	constructor(init?: Partial<CourseCategory>) {
		Object.assign(this, init);
	}
}