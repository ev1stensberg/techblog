# TechBlog

This site is built with [metalsmith](http://www.metalsmith.io/) and [yo ironsmith](https://github.com/eddywashere/generator-lo).

Features include

- simple layouts
- swig templating - includes ability to have templates in markdown (posts)
- default posts collection
- page collection
- tags - list page & individual tag pages
- posts collection in json available at `/posts/index.json`

Install dependencies

```
npm install gulp -g
npm install
```

Run local server on http://localhost:8000

```
gulp preview
```

Build files

```
gulp build
```

Deploy to github pages with

```
gulp build:prod
gulp deploy
```

**BEWARE: ** `publish` is broken if you use 2-factor authentication with GH as of
10/2015, see [issue #68](https://github.com/shinnn/gulp-gh-pages/issues/68). You can
still do this: `gulp deploy; cd .publish; git add .; git commit -am "Update <comment>"; git push; `

