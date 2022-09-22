import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BillPrintComponent from "./components/BillPrintComponent.js";
import { Dashboard, Login, Nursery, ProtectedRoute, Error, StaffHome } from "./pages/index.js";
import { useAppContext } from "./context/appContext.js";
import {StaffManager, BillManager,TreeManager, DahsboardHome} from './components/index.js'
const App = () => {
    const { user } = useAppContext();
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                          {user && (user.role === "Owner" ? <Nursery /> : <StaffHome/>) }  
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/printbill"
                    element={
                        <ProtectedRoute>
                            {user && (user.role === "Owner" ? <BillPrintComponent /> : <Error/>) }  
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            {user && (user.role === "Owner" ? <Dashboard /> : <Error/>) }  
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<DahsboardHome/>} />
                    <Route path="tree" element={<TreeManager/>} />
                    <Route path="bill" element={<BillManager/>} />
                    <Route path="staff" element={<StaffManager />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
