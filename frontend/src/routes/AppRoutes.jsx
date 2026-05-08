import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Organizations from "../pages/dashboard/Organizations";
import Teams from "../pages/dashboard/Teams";
import Projects from "../pages/dashboard/Projects";
import Notifications from "../pages/dashboard/Notifications";
import Tasks from "../pages/dashboard/Tasks";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
  path: "/organizations",
  element: <Organizations />,
},
{
  path: "/teams",
  element: <Teams />,
},
{
  path: "/projects",
  element: <Projects />,
},
{
  path: "/notifications",
  element: <Notifications />,
},
{
  path: "/tasks",
  element: <Tasks />,
},
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}