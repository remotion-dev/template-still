import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import express from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';

const app = express();
const port = process.env.PORT || 8000;
const compositionId = 'PreviewCard';

const bundled = bundle(path.join(__dirname, './src/index.tsx'));

const tmpDir = fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));

app.get('/image.(png|jpeg|jpeg)', async (req, res) => {
	const sendFile = (file: string) => {
		fs.createReadStream(file)
			.pipe(res)
			.on('close', () => {
				res.end();
			});
	};
	const comps = await getCompositions(await bundled, {inputProps: req.query});
	try {
		const video = comps.find((c) => c.id === compositionId);
		if (!video) {
			throw new Error(`No video called ${compositionId}`);
		}
		res.set('content-type', 'image/png');

		// TODO:
		const hash = 'hihih';
		const output = path.join(await tmpDir, hash);
		await renderStill({
			composition: video,
			webpackBundle: await bundled,
			output,
			inputProps: req.query,
			imageFormat: 'png',
		});
		sendFile(output);
	} catch (err) {
		console.error(err);
		res.json({
			error: err,
		});
	}
});

app.listen(port);

console.log(
	[
		`The server has started on http://localhost:${port}!`,
		'You can render a video by passing props as URL parameters.',
		'',
		'If you are running Hello World, try this:',
		'',
		`http://localhost:${port}?titleText=Hello,+World!&titleColor=red`,
		'',
	].join('\n')
);
