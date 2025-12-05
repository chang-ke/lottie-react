# Development Guide

## Setup example

### Set workspaces in your `package.json` file:
```json
{
  "workspaces": [
    ".",
    "example"
  ]
}
```

### Create an example Next.js app:
```
mkdir example && cd example
yarn create next-app . --typescript
```

### Tell `example` the path to our library

Open `example/package.json` and add our library as a workspace dependency:

```diff
 {
   "name": "lottie-react-example",
   "private": true,
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start"
   },
   "dependencies": {
-    // …
+    "lottie-react": "workspace:*" 
   }
 }
```

The `"workspace:*"` specifier instructs Yarn to symlink our **root** package into `example/node_modules/lottie-react`.

### Re-install & link

Back at repo root:

```bash
yarn install
```

Yarn v4 will hoist shared deps and create a symlink so `example` "sees" our library as if it was published.

### One-command dev

Install `concurrently` as a dev dependency: `yarn add -D concurrently`

Then, add the following script to your root `package.json`:

```jsonc
"scripts": {
  "dev": "concurrently \"yarn build:watch\" \"yarn workspace lottie-react-example dev\""
}
```

Then simply:

```bash
yarn dev
```

✨Done, we are ready to develop and test! 


## TODO(s)

- [ ] Check the `lottie-web` [CHANGELOG](https://github.com/airbnb/lottie-web/blob/master/CHANGELOG.md#v-5102) from `5.10.2` to `latest` and make sure we add support for all changes / features.
- [ ] Add a library description in the README.
- [ ] Create the new website/documentation
- [ ] Look into **dotLottie** (`.lottie` files) support.
- [ ] Redesign the interaction API to be more intuitive, flexible and efficient.
