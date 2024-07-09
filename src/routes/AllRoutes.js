import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import PublicRoute from './PublicRoute';

const Home = lazy(() => import('../features/home/pages/Home'));

const PageNotFound = () => 'Page Not Found';

function AllRoutes() {
  return (
    <Routes>
      {/* public router */}
      <Route element={<PublicRoute component={Home} />} path="/" />
      <Route element={<PageNotFound />} path="*" />
    </Routes>
  );
}

export default AllRoutes;
