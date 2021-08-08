# Remotion Still Image template

A template for designing still images with dynamic data with built-in server for deploying to the cloud.

<p align="center">
    <img src="https://remotion-still.herokuapp.com/PreviewCard.jpeg?title=Still%20image%20generator&description=Dynamic%20images%20generation%20service%20with%20full%20design%20freedom&slogan=Powered%20by%0ARemotion">
</p>

## Commands

**Design a still image**

```console
npm run dev
```

**Render still image**

```console
npm run render
```

**Upgrade Remotion**

```console
npm run upgrade
```

## Server

You can run a server that serves dynamic images based on it's URL. Run

```console
npm run server
```

And then visit `http://localhost:8000/PreviewCard.png?title=Hello+World` in your browser to render an image.

- Specify the ID of the composition you want to render after the `/`. You can edit the compositions in `src/Video.tsx`.
- Add either a `.png` or a `.jpeg` extension depending on which image format you want.
- You can add input props to your React component by adding query strings: `?title=Hello+World&description=foobar` will pass `{"title": "Hello World", "description": "foo bar"}` to the component.

### Caching

In `server/config.ts`, you can configure three types of caching:

- `"filesystem"`, the default, will cache generated images locally. This is a good way of caching if you host the server on a non-ephemereal platform and have enough storage.
- `"none"` will disable all caching and calculate all images on the fly.

- `"s3-bucket"` will cache images in a S3 bucket. If you choose this option, you need to provide `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables containing AWS credential which have permission of reading and writing to S3 as well as configure a bucket name and region in `server/config.ts`.

### Deploy to Heroku

To deploy the server to Heroku, you need to add the Google Chrome Buildpack. Go to the settings of your Heroku app and in the `Buildpacks` section, add `https://github.com/heroku/heroku-buildpack-google-chrome` as a buildpack.

### Deploy to DigitalOcean

The easiest way to deploy to DigitalOcean is to use the dockerized image and run it on the DigitalOcean App Platform. Go to https://cloud.digitalocean.com/apps/new and connect your Github repository and deploy the

### Serverless

Our serverless solution is a work in progress and will be released later in 2021.

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Notice that for some entities a company license is needed. Read [the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
