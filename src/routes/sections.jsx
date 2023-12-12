import { lazy, Suspense } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import AuthenticatedRoute from './components/authenticated-route';
import DeviceDetailPage from 'src/sections/device/view/device-detail-view';
import UnansweredPage from 'src/sections/unanswered/view/dataset-view';

export const LoadingPage = lazy(() => import('src/pages/loading'));
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const DevicePage = lazy(() => import('src/pages/device'));
export const DatasetPage = lazy(() => import('src/pages/dataset'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const routes = createBrowserRouter([
  {
    element: (
      <AuthenticatedRoute>
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthenticatedRoute>
    ),
    children: [
      { element: <DevicePage />, index: true },
      { path: 'device', element: <DevicePage /> },
      { path: 'device/:id', element: <DeviceDetailPage /> },
      { path: 'dataset', element: <DatasetPage /> },
      {path: 'unanswered', element: <UnansweredPage />},
      { path: 'product', element: <ProductsPage /> },

    ],
  },
  {
    path: 'login',
    element: (
      <AuthenticatedRoute reverse={true}>
        <LoginPage />
      </AuthenticatedRoute>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default routes;
