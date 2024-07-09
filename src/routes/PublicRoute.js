import { Navigate } from 'react-router-dom';

import FullPageLayout from "./../layouts/FullPageLayout";

function PublicRoute({ component: Component }) {
  const token = null;

  return token ? (
    <Navigate to="/" />
  ) : (
    <FullPageLayout>
      <Component />
    </FullPageLayout>
  );
}

export default PublicRoute;
