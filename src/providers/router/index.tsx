import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "../../pages/login-page";
import { SignupPage } from "../../pages/signup-page";

const router = createBrowserRouter([
  // Auth pages
  {
    path: "/auth",
    lazy: async () => {
      const AuthRootPage = (await import("../../pages/auth-root-page"))
        .AuthRootPage;

      return {
        element: <AuthRootPage />,
      };
    },
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
    ],
  },

  // Protected pages
  {
    path: "/",
    lazy: async () => {
      const ProtectedRootPage = (
        await import("../../pages/protected-root-page")
      ).ProtectedRootPage;

      return {
        element: <ProtectedRootPage />,
      };
    },
    children: [
      // Plan management pages
      {
        path: "plan-management",
        children: [
          {
            path: "",
            lazy: async () => {
              const PlanManagementListPage = (
                await import("../../pages/plan-management-list")
              ).PlanManagementList;

              return {
                element: <PlanManagementListPage />,
              };
            },
          },
        ],
      },
    ],
  },
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
