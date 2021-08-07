import crypto from 'crypto';

export const getServeUrlHash = (url: string): string => {
	return crypto.createHash('md5').update(url).digest('hex');
};
