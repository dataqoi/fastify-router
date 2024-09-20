# @naqoi/fastify-router

![CI](https://github.com/naqoi/fastify-router/workflows/CI/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@naqoi/fastify-router.svg?style=flat)](https://www.npmjs.com/package/@naqoi/fastify-router)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

A simple and easy-to-use file-based routing system for Fastify.

## Installation

```
npm i @naqoi/fastify-router
```

## Configuration

Autoload can be customised using the following options:

- `version` (optional) - If set, any route with the version prefix will be duplicated and loaded as default routes.

- `routesBasePath` (optional) - Default: "routes". The base directory to load routes from.


## Test Project

If you would like to see a sample API project using `@naqoi/fastify-router`:
1. Clone this repository.
2. Run `cd test` to navigate to the test project.
3. Run `npm install` to install the dependencies.
4. Run `npm start` to start the server.
5. Play with the API using some kind of client.

## Example

A simple fastify server setup with `@naqoi/fastify-router`:

```js
const fastify = require('fastify')
const router = require('@naqoi/fastify-router')

const app = fastify()

app.register(router, {
  version: 'v1', // optional
  routerBasePath: 'routes', // optional
})

app.listen({ port: 3000 })
```

or with ESM syntax:

```js
import fastify from 'fastify'
import router from '@naqoi/fastify-router'

const app = fastify()

app.register(router, {
  version: 'v1', // optional
  routerBasePath: 'routes', // optional
})

app.listen({ port: 3000 })
```

Folder structure:

```
├── routes
│   ├── v1
│   │   ├── versions.js
│   │   └── users
│   │       ├── [id]
│   │       │   └── index.js
│   │       ├── index.js
│   │       └── list.js
│   └── v2
│       ├── versions.js
│       └── users
│           ├── [id]
│           │   └── index.js
│           ├── index.js
│           └── list.js
├── package.json
└── app.js
```

Resulting routes:

```
GET /v1/versions
GET /v1/users
GET /v1/users/list
GET /v1/users/:id

GET /v2/versions
GET /v2/users
GET /v2/users/list
GET /v2/users/:id

# if version = 'v1' or 'v2'
GET /versions
GET /users
GET /users/list
GET /users/:id
```

## License

MIT