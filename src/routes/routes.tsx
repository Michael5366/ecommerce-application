import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/registration';
import NotFoundPage from '../pages/NotFoundPage';
import { Routes } from '../types/routes';
import MainPage from '../pages/MainPage';
import ProfilePage from '../pages/ProfilePage';
import ProductPage from '../pages/product-page/ProductPage';
import fetchProductsData from '../loaders/catalogLoader';
import CatalogPage from '../pages/CatalogPage';
import { BasketPage } from '../pages/BasketPage';

export const routesArray: Routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'registration', element: <RegisterPage /> },
      { path: 'catalog/', element: <CatalogPage /> },
      { path: 'catalog/:categoryId', element: <CatalogPage /> },
      {
        path: 'catalog/:categoryId/product/:productSlug',
        element: <ProductPage />,
        loader: fetchProductsData,
      },
      { path: 'catalog/product/:productSlug', element: <ProductPage />, loader: fetchProductsData },
      // { path: 'catalog', element: <CatalogPage /> },
      // {
      //   path: 'catalog',
      //   element: <CatalogPage />,
      //   loader: fetchProductsData,
      //   children: [
      //     {
      //       path: 'product/:productName',
      //       element: <ProductPage />,
      //       loader: fetchProductsData,
      //     },
      //   ],
      // },
      // { path: 'catalog/product/:productName', element: <ProductPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
      { path: 'basket', element: <BasketPage /> },
    ],
  },
];

export const routes = createBrowserRouter(routesArray);
