// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "../pages/auth/Login";
// import Register from "../pages/auth/Register";

// import Dashboard from "../pages/dashboard/Dashboard";
// import Organizations from "../pages/dashboard/Organizations";
// import Teams from "../pages/dashboard/Teams";
// import Projects from "../pages/dashboard/Projects";
// import Notifications from "../pages/dashboard/Notifications";
// import Tasks from "../pages/dashboard/Tasks";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Login />,
//   },
//   {
//     path: "/register",
//     element: <Register />,
//   },
//   {
//     path: "/dashboard",
//     element: <Dashboard />,
//   },
//   {
//   path: "/organizations",
//   element: <Organizations />,
// },
// {
//   path: "/teams",
//   element: <Teams />,
// },
// {
//   path: "/projects",
//   element: <Projects />,
// },
// {
//   path: "/notifications",
//   element: <Notifications />,
// },
// {
//   path: "/tasks",
//   element: <Tasks />,
// },
// ]);

// export default function AppRoutes() {
//   return <RouterProvider router={router} />;
// }

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Organizations from "../pages/dashboard/Organizations";
import Teams from "../pages/dashboard/Teams";
import Projects from "../pages/dashboard/Projects";
import Tasks from "../pages/dashboard/Tasks";
import Notifications from "../pages/dashboard/Notifications";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/organizations",
    element: (
      <ProtectedRoute>
        <Organizations />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teams",
    element: (
      <ProtectedRoute>
        <Teams />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects",
    element: (
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tasks",
    element: (
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <Notifications />
      </ProtectedRoute>
    ),
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}