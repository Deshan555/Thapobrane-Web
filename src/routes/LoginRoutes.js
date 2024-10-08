import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const CustomerLogin = Loadable(lazy(() => import('pages/authentication/CustomerLogin')));
const WelCome = Loadable(lazy(() => import('pages/vehicleModule/WelCome')));
// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: '/login/customer',
      element: <CustomerLogin />
    },
    {
      path: '/welcome',
      element: <WelCome />
    }
  ]
};

export default LoginRoutes;
