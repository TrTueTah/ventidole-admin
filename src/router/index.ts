import { createBrowserRouter } from "react-router-dom";
import { PATH } from "./path";
import PublicRoute from "@/layout/PublicRoute";
import PrivateRoute from "@/layout/PrivateRoute";
import Dashboard from "@/pages/dashboard/page";
import IdolManagementList from "@/pages/idol-management/idol-management-list/page";

const router = createBrowserRouter([
  {
    path: PATH.LOGIN,
    Component: PublicRoute,
  },
  {
    path: '/',
    Component: PrivateRoute,
    children: [
      { path: '/', Component: Dashboard },
      {
        path: PATH.IDOL_MANAGEMENT._,
        children: [
          { path: '', Component: IdolManagementList, index: true },
        ],
      },
    ]
  }
])

export default router;