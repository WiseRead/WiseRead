# WiseRead
Online/Offline web comic reader.

With WiseRead you can read your comic from any device in the browser.
<br>
Just drag files from your device and start to read,
or use it as an "online reader" to stream chapters from the cloud.

Read more in the [Docs](https://wiseread.github.io/about).
<br>
Try [Example Chapter](https://wiseread.github.io/?imode=separate&chapterNames=Spy+X+Family+-+Prologue&download=https://www.dropbox.com/s/j4tab4xsrd2tax6/Chapter%2000%20Prologue.cbz?dl=0).

## Main Technologies
* Nuxt.js
  > Nuxt is a progressive framework based on Vue.js to create modern web applications.<br/>
  Check out [Nuxt.js docs](https://nuxtjs.org).
* Tailwind CSS
  > Tailwind CSS is a highly customizable, low-level CSS framework that gives you all of the building blocks you need to build bespoke designs without any annoying opinionated styles you have to fight to override.<br/>
  Check out [Tailwind CSS docs](https://tailwindcss.com/docs/utility-first).

## Build Setup

### Installation
Install dependencies:
```bash
$ npm ci
```
Or install and update dependencies (update package-lock):
```bash
$ npm install
```

### Launch development server
Serve with hot reload at localhost:3000
```bash
$ npm run dev
```

### Lint
Find lint problems:
```bash
$ npm run lint
```

### Build and launch production
Build and launch production static server:
```bash
$ npm run generate
$ npm run start
```

## Development Tools
### VSCode extensions
Use the `Extensions: Show Recommended Extensions` command to see the recommended extensions in VSCode.

### Browser extension
[Vue.js devtools for chrome](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

## Contributing
### Branches
* `dev`: The main branch. All development code is merged into `dev` in sometime.
* `master`: Everything pushed to `master` updates the [real site](https://wiseread.github.io).
* `beta`: Everything pushed to `beta` updates the [beta site](https://wiseread.github.io/beta).
> **Tip:** To be sure the latest commit to `master` or `beta` has updated the site, open
the site in the browser and open the DevTools Console. You will see a logged message:
`LAST_COMMIT_SHA: <sha>`.</br>
Just compare the `<sha>` to the latest commit in the `master`/`beta` branch.
