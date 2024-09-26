import type {
  FastifyInstance,
  HTTPMethods,
  RouteHandlerMethod,
  RouteOptions,
} from 'fastify'
import type { FastifyRouterPluginOptions } from 'lib/plugin'
import { readdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'

export type FastifyRouterOptions = Partial<
  Record<HTTPMethods, Partial<Pick<RouteOptions, 'schema' | 'config'>>>
>

const FILE_EXTENSIONS = ['.ts', '.js', '.mjs', '.mts', '.tsx', '.jsx']

const AVAILABLE_ROUTE_OPTION_NAMES = [
  'ROUTE_OPTIONS',
  'route_options',
  'routeOptions',
] as const

const AVAILABLE_METHODS: HTTPMethods[] = [
  'GET',
  'get',
  'POST',
  'post',
  'PUT',
  'put',
  'DELETE',
  'delete',
  'PATCH',
  'patch',
  'OPTIONS',
  'options',
  'HEAD',
  'head',
]

const REGEX = {
  RouterFileParam: /\[([A-z0-9]+)]/gi,
  RouterFileParamOptional: /\[([A-z0-9]+)~]/gi,
  FileExtension: /\.m?(ts|js)x?$/gi,
  getFileWithExtension: (fileName: string) =>
    new RegExp(`${fileName}.*\\.m?(ts|js)x?$`, 'gi'),
}

const IGNORED_PATTERNS = [
  (file: string) => file.startsWith('_'),
  (file: string) => file.startsWith('.'),
  (file: string) => file.endsWith('.map'),
  (file: string) => file.endsWith('.json'),
  (file: string) => file.endsWith('.d.ts'),
]

const sanitizePath = (path: string) => path.replace(/\\+/gi, '/')

const getBasePath = async (basePath?: string) => {
  const resolvedPath = basePath ?? 'routes'
  let path = resolve(process.cwd(), resolvedPath)

  try {
    await stat(path)
  } catch (error) {
    path = resolve(process.cwd(), join('src', resolvedPath))
  }

  try {
    await stat(path)
  } catch (error) {
    throw new Error(`Path ${resolvedPath} not found.`)
  }

  return sanitizePath(path)
}

const loadRoutesInDirectory = async (
  baseDirectory: string,
  directory: string,
  options: FastifyRouterPluginOptions,
) => {
  const files = await readdir(directory)
  const routes: Record<
    string,
    Array<[HTTPMethods, RouteHandlerMethod, any]>
  > = {}

  for (const file of files) {
    if (IGNORED_PATTERNS.some((pattern) => pattern(file))) continue
    const isFile = FILE_EXTENSIONS.some((ext) => file.endsWith(ext))

    if (!isFile) {
      const subDirRoutes = await loadRoutesInDirectory(
        baseDirectory,
        resolve(directory, file),
        options,
      )
      for (const route in subDirRoutes) {
        routes[route] = subDirRoutes[route]
      }
      continue
    }

    const filePath = sanitizePath(resolve(directory, file))
    const routePath = filePath
      .replace('[...]', '*')
      .replace(REGEX.getFileWithExtension('/index'), '')
      .replace(REGEX.FileExtension, '')
      .replace(REGEX.RouterFileParam, ':$1')
      .replace(REGEX.RouterFileParamOptional, ':$1?')
      .replace(sanitizePath(baseDirectory), '')

    const isDefaultPath = options.version
      ? routePath.includes(options.version)
      : false

    const route = await import(`file:${filePath}`)

    for (const method of AVAILABLE_METHODS) {
      if (!route[method]) continue

      const handler = route[method] as RouteHandlerMethod

      let routeOptions: null | FastifyRouterOptions = null
      for (const optionName of AVAILABLE_ROUTE_OPTION_NAMES) {
        if (route[optionName]) {
          routeOptions = route[optionName][method] ?? {}
          break
        }
      }

      routes[routePath] = [
        ...(routes[routePath] ?? []),
        [method as HTTPMethods, handler, routeOptions],
      ]

      if (options.onRouteLoaded) {
        options.onRouteLoaded({
          method,
          routePath,
        })
      }

      if (isDefaultPath) {
        const baseRoutePath = routePath.replace(`/${options.version}`, '')

        routes[baseRoutePath] = [
          ...(routes[baseRoutePath] ?? []),
          [method as HTTPMethods, handler, routeOptions],
        ]

        if (options.onRouteLoaded) {
          options.onRouteLoaded({
            method,
            routePath: baseRoutePath,
          })
        }
      }
    }
  }

  return routes
}

export const loadRoutes = async (
  fastify: FastifyInstance,
  options: FastifyRouterPluginOptions,
) => {
  const basePath = await getBasePath(options.routesBasePath)
  const routes = await loadRoutesInDirectory(basePath, basePath, options)

  for (const url in routes) {
    const methods = routes[url]
    for (const [method, handler] of methods) {
      fastify[method.toLowerCase() as Lowercase<typeof method>](url, handler)
    }
  }
}
