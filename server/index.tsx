import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {getFromCache, isInCache, saveToCache} from './cache';
import {handler} from './handler';
import {getImageType, getMimeType} from './image-types';
import {getImageHash} from './make-hash';

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
	`/:${Params.compositionname}.:${Params.format}(png|jpeg|jpg)`,
	handler(async (req, res) => {
		const inputProps = req.query;
		const compName = req.params[Params.compositionname];
		const imageFormat = getImageType(req.params[Params.format]);

		const hash = getImageHash(
			JSON.stringify({
				compName,
				imageFormat,
				inputProps,
			})
		);
		res.set('content-type', getMimeType(imageFormat));

		if (await isInCache(hash)) {
			const file = await getFromCache(hash);
			file.pipe(res).on('close', () => res.end());
			return;
		}

		const output = path.join(await tmpDir, hash);
		await renderStill({
			composition: await getComp(compName, inputProps),
			webpackBundle: await webpackBundle,
			output,
			inputProps,
			imageFormat,
		});

		await saveToCache(hash, fs.createReadStream(output));

		fs.createReadStream(output)
			.pipe(res)
			.on('close', () => {
				res.end();
			});

		await fs.promises.unlink(output);
	})
);

app.listen(port);
