---
template: post.html
title: "From O(4G) to O(ffline) - Lessons learned from performance"
description: >
    One of our applications was slow, so we decided to invest time in performance.
date: 2018-08-09
author: Even Stensberg
tags: FrontEnd, Performance
excerpt_separator: <!--more-->
---

When shifting one of our applications towards Client Side Rendering from Server Side, performance became important. With Server Side Rendering, there was no thought around how the user percieved our application, as the browser wasn't rendering content on the fly, our server did.

Since then, we have moved towards a Client Side approach to make user experience better. The stack is now using ReactJS, Laravel and VueJS. The mixture between a Server Side Library and two Client Side Libraries, made it reasonable to think that the application had opportunities to improve.
 
When developing applications, many developers think that performance is a field of its own. It certainly is, and the majority of the time a developer spends on performance isn't necessarily around making optimizations. That being said, some of the optimizations we had were already in reach. Libraries themselves had embedded production settings.

To build our entire application, we use a combination of webpack, (PHP) composer and gulp. We chose webpack because it is stable. The tool is useful for optimizing code and abstracting source code into smaller pieces of code (chunks). To build global stylesheets, webpack wasn't as useful as gulp is. In addition to these two, a part of our stack is written in [Laravel](https://laravel.com/), which would need to use our generated chunks and CSS.

#### Performance budgets

With no prior work on performance, we did not have a estimated budget. When starting to optimize your application, an estimated bundle size and a goal to work towards is important. Not is it only motivational, but it also gives an indication of how small the application needs to be in order to be fast. U.S Web design system has a [primer website](https://designsystem.digital.gov/performance/how/) to get you started with perf budgets that makes sense.

#### Lighthouse, Performance Analyzer Tools

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) has helped the team to find out where performance optimizations were needed. It provided us insight on where and how to improve and has been a helpful tool for us. Another great resource is the opportunity to analyze generated JavaScript files - commonly referred to as bundles. By using [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer#webpack-bundle-analyzer) we found duplicate  code that we could have abstracted to chunks containing this code. 

We also used [webpagetest](https://webpagetest.org/) to measure speed index and general website stats in order to get an estimate of our performance budget. Snapshots of things like First Meaningful Paint and Time To First Byte became a valueable label for our measurements.

#### Lazy and dynamically loading components and routes 

Route based loading made it easier for us to provide a user interface that was friendly with respect to performance. By showing a loading spinner while the route component was fetching, we were able to reduce amount of code shipped to the user. We made use of a library in React, [`react-lodable`](https://github.com/jamiebuilds/react-loadable).

```js

import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import FidgetSpinner from './spinner';
import Landing from './landing';

const mountNode = document.getElementById('mypages');

const LoadableComponent = Loadable({
	loader: () => import('./auth'),
	loading: FidgetSpinner
});

ReactDOM.render(<LoadableComponent />, mountNode);

```

#### Managing non-JS frameworks with chunk splitting

Making sure that a PHP library complies with a JavaScript library wasn't as hard as one might think. The major blocker when using a PHP library with a JavaScript library was to make sure that performance wasn't suffering. A hybrid application, using server side rendering and client side rendering has the potential to scale well if done right. 

That might sound easy, but it wasn't. An issue we faced early was using webpack with chunk splitting to save loading times for assets compiled in JavaScript. Laravel has a built in library named laravel-mix, which did the same thing as webpack-manifest-plugin. The difference between the two is not that much, with the execption being Laravel setting defaults and a near production ready configuration. Laravel mix is easy to implement, but it does not scale well with advanced builds where you would want full control over resource management. Both libraries supported a key to value pair, mapping a bundle name to a hash for a new bundle, which is what we were trying to do.

Webpack as a stand alone build tool was preferable. For instance, Laravel used an older version of webpack (v3). Webpack v4 had some major performance improvements and that alone was a reason to make a custom build step for us. Laravel didn't allow Service Workers either, so offline first websites would have been harder to implement without having a direct access to a webpack configuration to set plugins and modifying assets. 

When auditing performance using lighthouse, the tradeoff between server response and Time To First Byte is essential. In our application, we did not have the landing page client-side, which would mean that performance and following the PRPL pattern did not follow best practise for performance.

This being said, switching to a hybrid application made room for us to gradually turn towards a more client-sided infrastructure while keeping performance within our performance budget. That is why performance budgets are good, with the intention of limiting your team to a goal that is not impossible; An application with a given stack might have a better starting point than another one with a legacy stack.


#### Font, CSS & Image loading

By gradually loading fonts without blocking the rendering path, performance optimizations were made. Previously, all of our fonts blocked the rendering path with no fallback font. That is bad user experience. 

By using `font-observer` we appended a className to display the fonts once they were done downloading. One major blocker for us was that our React Components had local font-families declared, and there seems like it's no obvious way of working around that issue without using some variation of a context manager. To learn more about font loading and how, [here's a reference](https://github.com/bramstein/fontfaceobserver).

#### CSS optimizations

When optimizing CSS, we made sure that we used built in optimizations for css. Webpack and its plugins had built in performance. Webpack 4 has a plugin named `mini-css-extract-plugin`, which makes it possible for us to convert scss back to css files.

#### Offline first and Workbox

We decided to cache JavaScript and CSS files using [workbox](https://developers.google.com/web/tools/workbox/). This was relatively easy and we got a simple service worker up quite quickly.


#### Upgrading Babel and polyfills

Babel is a great tool and has done great with respect to developer experience lately. We were able to add concepts like browser support through polyfills and tree shaking with the hardest thing being to install the correct dependency. With a full-configured front end build, we ended up with these babel packages.


```json
{
    "@babel/core": "^7.0.0-beta.51",
    "@babel/preset-env": "^7.0.0-beta.51",
    "@babel/preset-react": "^7.0.0-beta.51",
    "babel-core": "^7.0.0-bridge.0",
    "babel-jest": "^23.2.0",
    "babel-loader": "^8.0.0-beta.4",
    "babel-plugin-syntax-dynamic-import": "^6.18.0",
    "babel-preset-minify": "^0.5.0-alpha.a24dd066"
}
```

`.babelrc`

```json
{
  "presets": [["@babel/preset-env", {
    "modules": false,
    "useBuiltIns": "usage"
  }], "@babel/react"],
  "env": {
    "test": {
      "presets": [["@babel/preset-env"], "@babel/react"]
    },
    "production": {
      "presets": ["minify"]
    }
  },
  "plugins": ["syntax-dynamic-import", "react-hot-loader/babel"]
}
```

Our webpack configuration ended (roughly) up like this:


`webpack.base.js`

```js
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const { join } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	entry: [/* ... */],
	output: {
		filename: '[name].js',
		chunkFilename: '[contenthash].js',
		path: join(__dirname, 'dist'),
		publicPath: '/'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				main: {
					name: 'main',
					chunks: 'initial',
					minChunks: 2,
					maxInitialRequests: 5
				},
				vendor: {
					test: /node_modules/,
					name: 'vendor',
					priority: 10,
					enforce: true
				}
			}
		}
	},
	target: 'web',
	module: {
		rules: [
			{
				test: /\.(jpg|png|gif|svg)$/,
				loader: 'image-webpack-loader',
				enforce: 'pre'
			},
			{
				test: /\.(jpe?g|png)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10 * 1024
						}
					},
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]'
						}
					}
				]
			},
			{
				test: /\.css$|sass$|\.scss$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					{
						loader: 'css-loader',
						options: {
							minimize: true
						}
					},
					{ loader: 'postcss-loader' },
					{ loader: 'sass-loader' }
				]
			},

			{
				test: /\.(jpe?g|png)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10 * 1024
						}
					},
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]'
						}
					}
				]
			},
			{
				test: /\.svg$/,
				use: [
					{
						loader: 'svg-inline-loader',
						options: {
							limit: 10 * 1024,
							noquotes: true
						}
					},
					{
						loader: 'url-loader',
						options: {
							limit: 10 * 1024
						}
					},
					{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]'
						}
					}
				]
			},

			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: require.resolve('jquery'),
				use: [
					{
						loader: 'expose-loader',
						options: 'jQuery'
					},
					{
						loader: 'expose-loader',
						options: 'window.$'
					},
					{
						loader: 'expose-loader',
						options: '$'
					},
					{
						loader: 'expose-loader',
						options: 'jquery'
					},
					{
						loader: 'expose-loader',
						options: 'window.jQuery'
					},
					{
						loader: 'expose-loader',
						options: 'window.jquery'
					}
				]
			}
		]
	},
	plugins: [
		new WorkboxPlugin.GenerateSW({
			swDest: 'service-worker.js',
			clientsClaim: true,
			skipWaiting: true
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new VueLoaderPlugin(),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			Popper: ['popper.js', 'default'],
			Util: 'exports-loader?Util!bootstrap/js/dist/util'
		}),
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-gb/),
		new ManifestPlugin({
			writeToFileEmit: true,
		})
	],
	resolve: {
		extensions: ['*', '.js', '.vue', '.json', '.css', '.scss'],
		alias: {
			vue$: 'vue/dist/vue.esm.js'
		}
	}
};
```

`webpack.prod.js`

```js
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(webpackConfig, {
	mode: 'production',
	output: {
		filename: '[name].js',
		chunkFilename: '[chunkhash].js'
	},
	plugins: [
		new CleanWebpackPlugin(['public']),
		new MiniCssExtractPlugin({
			filename: '[id].[hash].css',
			chunkFilename: '[id].[hash].css'
		})
	],
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				cache: true,
				parallel: 4,
				sourceMap: false
			}),
			new OptimizeCSSAssetsPlugin()
		]
	}
});
```

#### Machine Learning and beyond

We are experimenting with intelligent fetching of assets using [GuessJS](https://blog.mgechev.com/2018/05/09/introducing-guess-js-data-driven-user-experiences-web/). It will allow us to load routes that we are confident a user will visit based on data from Google Analytics. 

#### Chunk splitting

We didn't quite get chunk splitting to work, as our application is written in PHP. Each of the initial chunks needs to be included as a script in the index.php file. Turns out chunksplitting with the default rules didn't help us that much.

#### Shorter CSS class names

As length of CSS classes might be large, one way to ensure that the css file remains slim is to audit CSS using the coverage tab in chrome and to shorten class and id names. 

#### Using Varnish to cache requests

The team has discussed using [Varnish](https://varnish-cache.org/) in order to reduce requests in PHP. 

#### Compression HTML files generated in PHP

[Brotli is a compression algorithm]((https://github.com/google/brotli#introduction)) developed by Google. It might be benefitial for us to switch our compression to Brotli and using gzip as a fallback algorithm. After investigation we found out that compressing assets using Brotli might lead to significant reduction in filesize. In addition to this, we are thinking of PHP compression and stripping away comments and how to make use of long term caching for our assets, using more fine-grained service workers in order to save us time used on the main thread.


#### Convert our Landing Page to React

One thing that throttles down First Meaningful Paint is the fact that our application is partly in React, Vue and Client-Sided frameworks, while our landing page is server-side. By converting the landing page to Client-Side, we would be able to follow best practises more in depth and gradually load content to the user following the [PRPL pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/).


### Summary

After spending some time trying to optimize our application, a lot of work was used in gathering information about best practises. Performance is well documented, but it might be harder in practise for different of reasons. Sometimes it is because your infrastructure isn't suited for a given optimization, and sometimes it might be a bottleneck optimization.

Fully configuring a site to follow best performance practise takes time, albeit it is worth investing time adding libraries that give you performance wins with "little-to-no hazzle". 


### Resources and Related Links   

- https://designsystem.digital.gov/performance/how/
- https://httpd.apache.org/docs/trunk/mod/mod_brotli.html
- https://webpagetest.org/
- https://v8project.blogspot.com/2015/07/code-caching.html
- https://medium.com/@addyosmani/a-tinder-progressive-web-app-performance-case-study-78919d98ece0
- https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4
- https://medium.com/dev-channel/a-pinterest-progressive-web-app-performance-case-study-3bd6ed2e6154
- https://github.com/thedaviddias/Front-End-Performance-Checklist#html
- https://murze.be/using-varnish-on-a-laravel-forge-provisioned-server 
- https://michalzalecki.com/optimize-react-build-for-production-with-webpack/
- https://jeremenichelli.io/2018/07/font-loading-strategy-single-page-applications/
- https://github.com/jeremenichelli/font-strategy-single-page-app/blob/master/src/font.js
- https://support.cloudflare.com/hc/en-us/articles/200168056-What-does-Rocket-Loader-do-

