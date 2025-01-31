/* eslint-disable no-unused-vars */
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/HomePage";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import {useEffect, useState} from "react";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import {useCities, CitiesProvider} from "./Contexts/CitiesContext";
import {useAuth, AuthProvider} from "./Contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";
function App() {
    return (
        <AuthProvider>
            <CitiesProvider>
                <BrowserRouter>
                    <Routes>
                        <Route index element={<HomePage />} />
                        <Route path="product" element={<Product />} />
                        <Route path="pricing" element={<Pricing />} />
                        <Route path="login" element={<Login />} />
                        <Route path="app" element={<AppLayout />}>
                            <Route index element={<Navigate replace to="cities" />} />
                            <Route path="cities" element={<CityList />} />
                            <Route path="cities/:id" element={<City />} />
                            <Route path="countries" element={<CountryList />} />
                            <Route path="form" element={<Form />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CitiesProvider>
        </AuthProvider>
    );
}
export default App;
