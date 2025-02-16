import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home/Home.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup/Signup.jsx';
import AddProduct from './components/Add Product/AddProduct.jsx';
import LikedProducts from './components/LikedProducts/LikedProducts.jsx';
import ProductDetail from './components/ProductDetails/ProductDetail.jsx';
import CategoryPage from './components/categorypage/categorypage.jsx';
// Create the router configuration
const router = createBrowserRouter([
  // default page
  {
    path: "/",
    element: (<Home />),
  },
  {
    path: "/category/:catName",
    element: (<CategoryPage />),
  },
// Login page
  {
    path: "/login",
    element: (<Login />),
  },
  // Signup page
  {
    path: "/Signup",
    element: (<Signup />),
  },
// About Section
  {
    path: "/about",
    element: (
      <div>
        <h1>About</h1>
        
      </div>
    ),
  },
  // add product page
  {
    path: "/add-product",
    element: (<AddProduct />),
  },

  {
    path: "/liked-products",
    element: (<LikedProducts />)
  },
  {
    path: "/product/:productId",
    element: (<ProductDetail/>)
  },
  
]);

// Mount the React app
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
