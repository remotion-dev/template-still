import fs, {createReadStream} from 'fs';
import os from 'os';
import path from 'path';
import {Readable} from 'stream';

const cacheDir = fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));

const getFileFromHash = async (imageHash: string) => {
	return path.join(await cacheDir, imageHash);
};

export const isInCache = async (imageHash: string): Promise<boolean> => {
	return fs.existsSync(await getFileFromHash(imageHash));
};

export const getFromCache = async (imageHash: string): Promise<Readable> => {
	return createReadStream(await getFileFromHash(imageHash));
};

export const saveToCache = async (imageHash: string, file: Readable) => {
	return fs.promises.writeFile(await getFileFromHash(imageHash), file);
};
