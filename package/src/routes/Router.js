import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

/* ***Layouts**** */
const FullLayout = lazy(() => import("../layouts/full/FullLayout"));
const BlankLayout = lazy(() => import("../layouts/blank/BlankLayout"));

/* ****Pages***** */
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));
const TransactionPage = lazy(() =>
  import("../views/utilities/TransactionPage")
);
const Shadow = lazy(() => import("../views/utilities/Shadow"));
const Error = lazy(() => import("../views/authentication/Error"));
const Register = lazy(() => import("../views/authentication/Register"));
const Login = lazy(() => import("../views/authentication/Login"));

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "/dashboard", exact: true, element: <Dashboard /> },
      { path: "/ui/transactions", exact: true, element: <TransactionPage /> },
      { path: "/ui/shadow", exact: true, element: <Shadow /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "404", element: <Error /> },
      { path: "/auth/register", element: <Register /> },
      { path: "/auth/login", element: <Login /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
