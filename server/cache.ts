import fs, {createReadStream} from 'fs';
import os from 'os';
import path from 'path';
import {Readable} from 'stream';
import {getCacheMode} from './config';
import {existsOnS3, getOnS3, writeToS3} from './s3-cache';

const cacheDir = fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));

const getFileFromHash = async (imageHash: string) => {
	return path.join(await cacheDir, imageHash);
};

const cacheMode = getCacheMode();

export const isInCache = async (imageHash: string): Promise<boolean> => {
	if (cacheMode === 'none') {
		return false;
	}
	if (cacheMode === 's3-bucket') {
		return existsOnS3(imageHash);
	}

	return fs.existsSync(await getFileFromHash(imageHash));
};

export const getFromCache = async (imageHash: string): Promise<Readable> => {
	if (cacheMode === 'none') {
		throw new TypeError('No cache enabled');
	}

	if (cacheMode === 's3-bucket') {
		return getOnS3(imageHash);
	}

	return createReadStream(await getFileFromHash(imageHash));
};

export const saveToCache = async (imageHash: string, file: Readable) => {
	if (cacheMode === 'none') {
		return;
	}

	if (cacheMode === 's3-bucket') {
		return writeToS3(imageHash, file);
	}

	return fs.promises.writeFile(await getFileFromHash(imageHash), file);
};
