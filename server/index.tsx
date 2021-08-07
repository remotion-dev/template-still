import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {getFromCache, isInCache, saveToCache} from './cache';
import {handler} from './handler';
import {getImageType, getMimeType} from './image-types';
import {getImageHash} from './make-hash';
import {sendFile} from './send-file';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const webpackBundle = bundle(path.join(__dirname, '../src/index.tsx'));
const tmpDir = fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));

enum Params {
	compositionname,
	format,
}

const getComp = async (compName: string, inputProps: unknown) => {
	const comps = await getCompositions(await webpackBundle, {
		inputProps: inputProps as null,
	});

	const comp = comps.find((c) => c.id === compName);
	if (!comp) {
		throw new Error(`No composition called ${compName}`);
	}

	return comp;
};

app.get(
	`/:${Params.compositionname}.:${Params.format}(png|jpe?g)`,
	handler(async (req, res) => {
		const inputProps = req.query;
		const compName = req.params[Params.compositionname];
		const imageFormat = getImageType(req.params[Params.format]);

		res.set('content-type', getMimeType(imageFormat));

		const hash = getImageHash(
			JSON.stringify({
				compName,
				imageFormat,
				inputProps,
			})
		);

		if (await isInCache(hash)) {
			const file = await getFromCache(hash);
			return sendFile(res, file);
		}

		const output = path.join(await tmpDir, hash);

		await renderStill({
			composition: await getComp(compName, inputProps),
			webpackBundle: await webpackBundle,
			output,
			inputProps,
			imageFormat,
		});

		await sendFile(res, fs.createReadStream(output));
		await saveToCache(hash, fs.createReadStream(output));
		await fs.promises.unlink(output);
	})
);

app.listen(port);
