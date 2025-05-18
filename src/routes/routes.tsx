import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import LogTest from '../pages/LogTest';
import RegTest from '../pages/RegTest';
import NotFoundTest from '../pages/NotFoundTest';
import { Routes } from '../types/routes';
import MainPage from '../pages/MainPage';

export const routesArray: Routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'login',
        element: <LogTest />,
      },
      {
        path: 'registration',
        element: <RegTest />,
      },
      {
        path: '*',
        element: <NotFoundTest />,
      },
    ],
  },
];

export const routes = createBrowserRouter(routesArray);
