export interface APIErrorResponse {
	httpTimestamp: string;
	httpStatusCode: number;
	httpStatus: string;
	applicationErrorCode: string;
	applicationErrorMessage: string;
}