const CACHE_MODE: CacheMode = 'filesystem';
export const AWS_BUCKET_NAME = 'remotion-image-cache';
export const AWS_REGION = 'us-east-1';

type CacheMode = 'filesystem' | 's3-bucket' | 'none';
export const getCacheMode = (): CacheMode => {
	return CACHE_MODE;
};
