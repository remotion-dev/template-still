import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {getFromCache, isInCache, saveToCache} from './cache';
import {handler} from './handler';
import {helpText} from './help-text';
import {getImageType, getMimeType} from './image-types';
import {getImageHash} from './make-hash';
import {sendFile} from './send-file';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const webpackBundling = bundle(path.join(process.cwd(), 'src/index.ts'));
const tmpDir = fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));

enum Params {
	compositionname,
	format,
}

const getComp = async (
	compName: string,
	inputProps: Record<string, unknown>
) => {
	const comps = await getCompositions(await webpackBundling, {
		inputProps,
	});

	const comp = comps.find((c) => c.id === compName);
	if (!comp) {
		throw new Error(`No composition called ${compName}`);
	}

	return comp;
};

// This setting will reveal the real IP address of the user, so we can apply rate limiting.
app.set('trust proxy', 1);

// Not more than 20 requests per minute per user
app.use(
	rateLimit({
		windowMs: 1 * 60 * 1000,
		max: 20,
	})
);

// The image is rendered when /[CompositionName].[imageformat] is called.
// Props are passed via query string.
app.get(
	`/:${Params.compositionname}.:${Params.format}(png|jpe?g)`,
	handler(async (req, res) => {
		const inputProps = req.query;
		const compName = req.params[Params.compositionname];
		const imageFormat = getImageType(req.params[Params.format]);

		res.set('content-type', getMimeType(imageFormat));

		// Calculate a unique identifier for our image,
		// if it exists, return it from cache
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

		const webpackBundle = await webpackBundling;
		const composition = await getComp(compName, inputProps);
		await renderStill({
			composition,
			serveUrl: webpackBundle,
			output,
			inputProps,
			imageFormat,
		});

		await sendFile(res, fs.createReadStream(output));
		await saveToCache(hash, await fs.promises.readFile(output));
		await fs.promises.unlink(output);
	})
);

app.listen(port);
console.log(helpText(Number(port)));
