/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as TeacherDashboardImport } from './routes/teacher/dashboard'
import { Route as StudentDashboardImport } from './routes/student/dashboard'
import { Route as StudentAssignmentsIndexImport } from './routes/student/assignments/index'
import { Route as StudentAssignmentsAssignmentIdImport } from './routes/student/assignments/$assignmentId'
import { Route as TeacherAssignmentsAssignmentIdSubmissionsImport } from './routes/teacher/assignments/$assignmentId/submissions'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TeacherDashboardRoute = TeacherDashboardImport.update({
  id: '/teacher/dashboard',
  path: '/teacher/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const StudentDashboardRoute = StudentDashboardImport.update({
  id: '/student/dashboard',
  path: '/student/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const StudentAssignmentsIndexRoute = StudentAssignmentsIndexImport.update({
  id: '/student/assignments/',
  path: '/student/assignments/',
  getParentRoute: () => rootRoute,
} as any)

const StudentAssignmentsAssignmentIdRoute =
  StudentAssignmentsAssignmentIdImport.update({
    id: '/student/assignments/$assignmentId',
    path: '/student/assignments/$assignmentId',
    getParentRoute: () => rootRoute,
  } as any)

const TeacherAssignmentsAssignmentIdSubmissionsRoute =
  TeacherAssignmentsAssignmentIdSubmissionsImport.update({
    id: '/teacher/assignments/$assignmentId/submissions',
    path: '/teacher/assignments/$assignmentId/submissions',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/student/dashboard': {
      id: '/student/dashboard'
      path: '/student/dashboard'
      fullPath: '/student/dashboard'
      preLoaderRoute: typeof StudentDashboardImport
      parentRoute: typeof rootRoute
    }
    '/teacher/dashboard': {
      id: '/teacher/dashboard'
      path: '/teacher/dashboard'
      fullPath: '/teacher/dashboard'
      preLoaderRoute: typeof TeacherDashboardImport
      parentRoute: typeof rootRoute
    }
    '/student/assignments/$assignmentId': {
      id: '/student/assignments/$assignmentId'
      path: '/student/assignments/$assignmentId'
      fullPath: '/student/assignments/$assignmentId'
      preLoaderRoute: typeof StudentAssignmentsAssignmentIdImport
      parentRoute: typeof rootRoute
    }
    '/student/assignments/': {
      id: '/student/assignments/'
      path: '/student/assignments'
      fullPath: '/student/assignments'
      preLoaderRoute: typeof StudentAssignmentsIndexImport
      parentRoute: typeof rootRoute
    }
    '/teacher/assignments/$assignmentId/submissions': {
      id: '/teacher/assignments/$assignmentId/submissions'
      path: '/teacher/assignments/$assignmentId/submissions'
      fullPath: '/teacher/assignments/$assignmentId/submissions'
      preLoaderRoute: typeof TeacherAssignmentsAssignmentIdSubmissionsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/student/dashboard': typeof StudentDashboardRoute
  '/teacher/dashboard': typeof TeacherDashboardRoute
  '/student/assignments/$assignmentId': typeof StudentAssignmentsAssignmentIdRoute
  '/student/assignments': typeof StudentAssignmentsIndexRoute
  '/teacher/assignments/$assignmentId/submissions': typeof TeacherAssignmentsAssignmentIdSubmissionsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/student/dashboard': typeof StudentDashboardRoute
  '/teacher/dashboard': typeof TeacherDashboardRoute
  '/student/assignments/$assignmentId': typeof StudentAssignmentsAssignmentIdRoute
  '/student/assignments': typeof StudentAssignmentsIndexRoute
  '/teacher/assignments/$assignmentId/submissions': typeof TeacherAssignmentsAssignmentIdSubmissionsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/student/dashboard': typeof StudentDashboardRoute
  '/teacher/dashboard': typeof TeacherDashboardRoute
  '/student/assignments/$assignmentId': typeof StudentAssignmentsAssignmentIdRoute
  '/student/assignments/': typeof StudentAssignmentsIndexRoute
  '/teacher/assignments/$assignmentId/submissions': typeof TeacherAssignmentsAssignmentIdSubmissionsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/student/dashboard'
    | '/teacher/dashboard'
    | '/student/assignments/$assignmentId'
    | '/student/assignments'
    | '/teacher/assignments/$assignmentId/submissions'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/student/dashboard'
    | '/teacher/dashboard'
    | '/student/assignments/$assignmentId'
    | '/student/assignments'
    | '/teacher/assignments/$assignmentId/submissions'
  id:
    | '__root__'
    | '/'
    | '/student/dashboard'
    | '/teacher/dashboard'
    | '/student/assignments/$assignmentId'
    | '/student/assignments/'
    | '/teacher/assignments/$assignmentId/submissions'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  StudentDashboardRoute: typeof StudentDashboardRoute
  TeacherDashboardRoute: typeof TeacherDashboardRoute
  StudentAssignmentsAssignmentIdRoute: typeof StudentAssignmentsAssignmentIdRoute
  StudentAssignmentsIndexRoute: typeof StudentAssignmentsIndexRoute
  TeacherAssignmentsAssignmentIdSubmissionsRoute: typeof TeacherAssignmentsAssignmentIdSubmissionsRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  StudentDashboardRoute: StudentDashboardRoute,
  TeacherDashboardRoute: TeacherDashboardRoute,
  StudentAssignmentsAssignmentIdRoute: StudentAssignmentsAssignmentIdRoute,
  StudentAssignmentsIndexRoute: StudentAssignmentsIndexRoute,
  TeacherAssignmentsAssignmentIdSubmissionsRoute:
    TeacherAssignmentsAssignmentIdSubmissionsRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/student/dashboard",
        "/teacher/dashboard",
        "/student/assignments/$assignmentId",
        "/student/assignments/",
        "/teacher/assignments/$assignmentId/submissions"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/student/dashboard": {
      "filePath": "student/dashboard.tsx"
    },
    "/teacher/dashboard": {
      "filePath": "teacher/dashboard.tsx"
    },
    "/student/assignments/$assignmentId": {
      "filePath": "student/assignments/$assignmentId.tsx"
    },
    "/student/assignments/": {
      "filePath": "student/assignments/index.tsx"
    },
    "/teacher/assignments/$assignmentId/submissions": {
      "filePath": "teacher/assignments/$assignmentId/submissions.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
