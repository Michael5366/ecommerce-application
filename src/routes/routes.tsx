import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/registration';
import NotFoundTest from '../pages/NotFoundTest';
import { Routes } from '../types/routes';
import MainPage from '../pages/MainPage';
// import CatalogPage from '../pages/CatalogPage';
import CartPage from '../pages/CartPage';
import ProfilePage from '../pages/ProfilePage';
import ProductPage from '../pages/product-page/ProductPage';
import fetchProductsData from '../loaders/catalogLoader';
import CatalogPageTest from '../pages/CatalogPageTest';
import CatalogPage from '../pages/CatalogPage';

export const routesArray: Routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'registration', element: <RegisterPage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:categoryId', element: <CatalogPage /> },
      { path: 'catalog/:categoryId/product/:productSlug', element: <CartPage /> },
      { path: 'catalog/product/:productSlug', element: <CartPage /> },
      // { path: 'catalog', element: <CatalogPage />, loader: fetchProductsData },
      {
        path: 'catalog',
        element: <CatalogPageTest />,
        loader: fetchProductsData,
        children: [
          {
            path: 'product/:productName',
            element: <ProductPage />,
            loader: fetchProductsData,
          },
        ],
      },
      // { path: 'catalog/product/:productName', element: <ProductPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundTest /> },
    ],
  },
];

export const routes = createBrowserRouter(routesArray);
