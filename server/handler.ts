import {Request, Response} from 'express';

export const handler = (
	fn: (req: Request, res: Response) => Promise<unknown>
) => {
	return async function (request: Request, response: Response): Promise<void> {
		try {
			await fn(request, response);
		} catch (err) {
			console.log(err);
			const statusCode = err.status || 500;
			response.status(statusCode).json({
				success: false,
				error: err.message,
			});
		}
	};
};
