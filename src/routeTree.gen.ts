/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createServerRootRoute } from '@tanstack/react-start/server'

import { Route as rootRouteImport } from './routes/__root'
import { Route as PublicRouteImport } from './routes/_public'
import { Route as PrivateRouteImport } from './routes/_private'
import { Route as PublicIndexRouteImport } from './routes/_public/index'
import { Route as PublicResetPasswordRouteImport } from './routes/_public/reset-password'
import { Route as PublicForgotPasswordRouteImport } from './routes/_public/forgot-password'
import { Route as PrivateDashboardRouteRouteImport } from './routes/_private/dashboard/route'
import { Route as PrivateAllRecipesRouteRouteImport } from './routes/_private/all-recipes/route'
import { Route as PrivateAddRecipeRouteRouteImport } from './routes/_private/add-recipe/route'
import { Route as PrivateEditRecipeRecipeIdRouteImport } from './routes/_private/edit-recipe/$recipeId'
import { Route as PrivateDetailsRecipeIdRouteImport } from './routes/_private/details/$recipeId'
import { ServerRoute as ApiAuthSplatServerRouteImport } from './routes/api/auth/$'

const rootServerRouteImport = createServerRootRoute()

const PublicRoute = PublicRouteImport.update({
  id: '/_public',
  getParentRoute: () => rootRouteImport,
} as any)
const PrivateRoute = PrivateRouteImport.update({
  id: '/_private',
  getParentRoute: () => rootRouteImport,
} as any)
const PublicIndexRoute = PublicIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => PublicRoute,
} as any)
const PublicResetPasswordRoute = PublicResetPasswordRouteImport.update({
  id: '/reset-password',
  path: '/reset-password',
  getParentRoute: () => PublicRoute,
} as any)
const PublicForgotPasswordRoute = PublicForgotPasswordRouteImport.update({
  id: '/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => PublicRoute,
} as any)
const PrivateDashboardRouteRoute = PrivateDashboardRouteRouteImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => PrivateRoute,
} as any)
const PrivateAllRecipesRouteRoute = PrivateAllRecipesRouteRouteImport.update({
  id: '/all-recipes',
  path: '/all-recipes',
  getParentRoute: () => PrivateRoute,
} as any)
const PrivateAddRecipeRouteRoute = PrivateAddRecipeRouteRouteImport.update({
  id: '/add-recipe',
  path: '/add-recipe',
  getParentRoute: () => PrivateRoute,
} as any)
const PrivateEditRecipeRecipeIdRoute =
  PrivateEditRecipeRecipeIdRouteImport.update({
    id: '/edit-recipe/$recipeId',
    path: '/edit-recipe/$recipeId',
    getParentRoute: () => PrivateRoute,
  } as any)
const PrivateDetailsRecipeIdRoute = PrivateDetailsRecipeIdRouteImport.update({
  id: '/details/$recipeId',
  path: '/details/$recipeId',
  getParentRoute: () => PrivateRoute,
} as any)
const ApiAuthSplatServerRoute = ApiAuthSplatServerRouteImport.update({
  id: '/api/auth/$',
  path: '/api/auth/$',
  getParentRoute: () => rootServerRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/add-recipe': typeof PrivateAddRecipeRouteRoute
  '/all-recipes': typeof PrivateAllRecipesRouteRoute
  '/dashboard': typeof PrivateDashboardRouteRoute
  '/forgot-password': typeof PublicForgotPasswordRoute
  '/reset-password': typeof PublicResetPasswordRoute
  '/': typeof PublicIndexRoute
  '/details/$recipeId': typeof PrivateDetailsRecipeIdRoute
  '/edit-recipe/$recipeId': typeof PrivateEditRecipeRecipeIdRoute
}
export interface FileRoutesByTo {
  '/add-recipe': typeof PrivateAddRecipeRouteRoute
  '/all-recipes': typeof PrivateAllRecipesRouteRoute
  '/dashboard': typeof PrivateDashboardRouteRoute
  '/forgot-password': typeof PublicForgotPasswordRoute
  '/reset-password': typeof PublicResetPasswordRoute
  '/': typeof PublicIndexRoute
  '/details/$recipeId': typeof PrivateDetailsRecipeIdRoute
  '/edit-recipe/$recipeId': typeof PrivateEditRecipeRecipeIdRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/_private': typeof PrivateRouteWithChildren
  '/_public': typeof PublicRouteWithChildren
  '/_private/add-recipe': typeof PrivateAddRecipeRouteRoute
  '/_private/all-recipes': typeof PrivateAllRecipesRouteRoute
  '/_private/dashboard': typeof PrivateDashboardRouteRoute
  '/_public/forgot-password': typeof PublicForgotPasswordRoute
  '/_public/reset-password': typeof PublicResetPasswordRoute
  '/_public/': typeof PublicIndexRoute
  '/_private/details/$recipeId': typeof PrivateDetailsRecipeIdRoute
  '/_private/edit-recipe/$recipeId': typeof PrivateEditRecipeRecipeIdRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/add-recipe'
    | '/all-recipes'
    | '/dashboard'
    | '/forgot-password'
    | '/reset-password'
    | '/'
    | '/details/$recipeId'
    | '/edit-recipe/$recipeId'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/add-recipe'
    | '/all-recipes'
    | '/dashboard'
    | '/forgot-password'
    | '/reset-password'
    | '/'
    | '/details/$recipeId'
    | '/edit-recipe/$recipeId'
  id:
    | '__root__'
    | '/_private'
    | '/_public'
    | '/_private/add-recipe'
    | '/_private/all-recipes'
    | '/_private/dashboard'
    | '/_public/forgot-password'
    | '/_public/reset-password'
    | '/_public/'
    | '/_private/details/$recipeId'
    | '/_private/edit-recipe/$recipeId'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  PrivateRoute: typeof PrivateRouteWithChildren
  PublicRoute: typeof PublicRouteWithChildren
}
export interface FileServerRoutesByFullPath {
  '/api/auth/$': typeof ApiAuthSplatServerRoute
}
export interface FileServerRoutesByTo {
  '/api/auth/$': typeof ApiAuthSplatServerRoute
}
export interface FileServerRoutesById {
  __root__: typeof rootServerRouteImport
  '/api/auth/$': typeof ApiAuthSplatServerRoute
}
export interface FileServerRouteTypes {
  fileServerRoutesByFullPath: FileServerRoutesByFullPath
  fullPaths: '/api/auth/$'
  fileServerRoutesByTo: FileServerRoutesByTo
  to: '/api/auth/$'
  id: '__root__' | '/api/auth/$'
  fileServerRoutesById: FileServerRoutesById
}
export interface RootServerRouteChildren {
  ApiAuthSplatServerRoute: typeof ApiAuthSplatServerRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_public': {
      id: '/_public'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PublicRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_private': {
      id: '/_private'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof PrivateRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_public/': {
      id: '/_public/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof PublicIndexRouteImport
      parentRoute: typeof PublicRoute
    }
    '/_public/reset-password': {
      id: '/_public/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof PublicResetPasswordRouteImport
      parentRoute: typeof PublicRoute
    }
    '/_public/forgot-password': {
      id: '/_public/forgot-password'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof PublicForgotPasswordRouteImport
      parentRoute: typeof PublicRoute
    }
    '/_private/dashboard': {
      id: '/_private/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof PrivateDashboardRouteRouteImport
      parentRoute: typeof PrivateRoute
    }
    '/_private/all-recipes': {
      id: '/_private/all-recipes'
      path: '/all-recipes'
      fullPath: '/all-recipes'
      preLoaderRoute: typeof PrivateAllRecipesRouteRouteImport
      parentRoute: typeof PrivateRoute
    }
    '/_private/add-recipe': {
      id: '/_private/add-recipe'
      path: '/add-recipe'
      fullPath: '/add-recipe'
      preLoaderRoute: typeof PrivateAddRecipeRouteRouteImport
      parentRoute: typeof PrivateRoute
    }
    '/_private/edit-recipe/$recipeId': {
      id: '/_private/edit-recipe/$recipeId'
      path: '/edit-recipe/$recipeId'
      fullPath: '/edit-recipe/$recipeId'
      preLoaderRoute: typeof PrivateEditRecipeRecipeIdRouteImport
      parentRoute: typeof PrivateRoute
    }
    '/_private/details/$recipeId': {
      id: '/_private/details/$recipeId'
      path: '/details/$recipeId'
      fullPath: '/details/$recipeId'
      preLoaderRoute: typeof PrivateDetailsRecipeIdRouteImport
      parentRoute: typeof PrivateRoute
    }
  }
}
declare module '@tanstack/react-start/server' {
  interface ServerFileRoutesByPath {
    '/api/auth/$': {
      id: '/api/auth/$'
      path: '/api/auth/$'
      fullPath: '/api/auth/$'
      preLoaderRoute: typeof ApiAuthSplatServerRouteImport
      parentRoute: typeof rootServerRouteImport
    }
  }
}

interface PrivateRouteChildren {
  PrivateAddRecipeRouteRoute: typeof PrivateAddRecipeRouteRoute
  PrivateAllRecipesRouteRoute: typeof PrivateAllRecipesRouteRoute
  PrivateDashboardRouteRoute: typeof PrivateDashboardRouteRoute
  PrivateDetailsRecipeIdRoute: typeof PrivateDetailsRecipeIdRoute
  PrivateEditRecipeRecipeIdRoute: typeof PrivateEditRecipeRecipeIdRoute
}

const PrivateRouteChildren: PrivateRouteChildren = {
  PrivateAddRecipeRouteRoute: PrivateAddRecipeRouteRoute,
  PrivateAllRecipesRouteRoute: PrivateAllRecipesRouteRoute,
  PrivateDashboardRouteRoute: PrivateDashboardRouteRoute,
  PrivateDetailsRecipeIdRoute: PrivateDetailsRecipeIdRoute,
  PrivateEditRecipeRecipeIdRoute: PrivateEditRecipeRecipeIdRoute,
}

const PrivateRouteWithChildren =
  PrivateRoute._addFileChildren(PrivateRouteChildren)

interface PublicRouteChildren {
  PublicForgotPasswordRoute: typeof PublicForgotPasswordRoute
  PublicResetPasswordRoute: typeof PublicResetPasswordRoute
  PublicIndexRoute: typeof PublicIndexRoute
}

const PublicRouteChildren: PublicRouteChildren = {
  PublicForgotPasswordRoute: PublicForgotPasswordRoute,
  PublicResetPasswordRoute: PublicResetPasswordRoute,
  PublicIndexRoute: PublicIndexRoute,
}

const PublicRouteWithChildren =
  PublicRoute._addFileChildren(PublicRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  PrivateRoute: PrivateRouteWithChildren,
  PublicRoute: PublicRouteWithChildren,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
const rootServerRouteChildren: RootServerRouteChildren = {
  ApiAuthSplatServerRoute: ApiAuthSplatServerRoute,
}
export const serverRouteTree = rootServerRouteImport
  ._addFileChildren(rootServerRouteChildren)
  ._addFileTypes<FileServerRouteTypes>()
