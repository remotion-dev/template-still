const CACHE_MODE: CacheMode = 's3-bucket';
export const AWS_BUCKET_NAME = 'remotion-image-cache';
export const AWS_REGION = 'eu-central-1';

type CacheMode = 'filesystem' | 's3-bucket' | 'none';
export const getCacheMode = (): CacheMode => {
	return CACHE_MODE;
};
