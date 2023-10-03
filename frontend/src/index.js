import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter, //This function is used to create a router instance. A router is responsible for tracking the URL and rendering the appropriate component based on the current URL.
  createRoutesFromElements, //This function is used to create routes from JSX elements. 
  Route, //This is a component used to define a route. You use it to specify which component should be rendered when a particular URL is matched.
  RouterProvider //This is a component used to provide the routing context to your application. It wraps your entire application and makes routing functionality available to all components within its scope.
} from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Provider } from "react-redux"
import store from './store';
import "./assets/styles/bootstrap.custom.css"
import "./assets/styles/index.css";
import App from './App';
import HomePage from './pages/homePage';
import ProductPage from './pages/productPage';
import CartPage from './pages/cartPage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import ShippingPage from './pages/shippingPage';
import PrivateRoute from './pages/privateRoute';
import PaymentPage from './pages/paymentPage';
import PlaceOrderPage from './pages/placeOrderPage';
import OrderPage from './pages/orderPage';
import ProfilePage from './pages/profilePage';
import AdminRoute from './pages/adminRoute';
import OrderListPage from './pages/admin/orderListPage';
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import ProductListPage from './pages/admin/productListPage';
import ProductEditPage from './pages/admin/productEditPage';
import UserListPage from './pages/admin/userListPage';
import UserEditPage from './pages/admin/userEditPage';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} />
      <Route path='/page/:currPage' element={<HomePage />} />
      <Route path='/search/:keyword/page/:currPage' element={<HomePage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>


      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingPage />}></Route>
        <Route path="/payment" element={<PaymentPage />}></Route>
        <Route path="/placeorder" element={<PlaceOrderPage />}></Route>
        <Route path="/orders/:id" element={<OrderPage />}></Route>
        <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderListPage />}></Route>
        <Route path="/admin/productlist" element={<ProductListPage />}></Route>
        <Route path="/admin/productlist/:currPage" element={<ProductListPage />}></Route>
        <Route path="/admin/product/:id/edit" element={<ProductEditPage />}></Route>
        <Route path="/admin/userlist" element={<UserListPage />}></Route>
        <Route path="/admin/user/:id/edit" element={<UserEditPage />}></Route>
      </Route>

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router}></RouterProvider>
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);


