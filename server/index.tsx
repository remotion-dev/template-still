import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {handler} from './handler';
import {getImageType, getMimeType} from './image-types';
import {getServeUrlHash} from './make-hash';

const app = express();
const port = process.env.PORT || 8000;

const webpackBundle = bundle(path.join(__dirname, '../src/index.tsx'));

const tmpDir = fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));

enum Params {
	compositionname,
	format,
}

app.get(
	`/:${Params.compositionname}.:${Params.format}`,
	handler(async (req, res) => {
		const inputProps = req.query;
		const compName = req.params[Params.compositionname];
		const imageFormat = getImageType(req.params[Params.format]);
		const sendFile = (file: string) => {
			fs.createReadStream(file)
				.pipe(res)
				.on('close', () => {
					res.end();
				});
		};
		const comps = await getCompositions(await webpackBundle, {inputProps});
		const video = comps.find((c) => c.id === compName);
		if (!video) {
			throw new Error(`No video called ${compName}`);
		}
		res.set('content-type', getMimeType(imageFormat));

		const hash = getServeUrlHash(
			JSON.stringify({
				compName,
				imageFormat,
				inputProps,
			})
		);
		const output = path.join(await tmpDir, hash);
		await renderStill({
			composition: video,
			webpackBundle: await webpackBundle,
			output,
			inputProps,
			imageFormat,
		});
		sendFile(output);
	})
);

app.listen(port);
