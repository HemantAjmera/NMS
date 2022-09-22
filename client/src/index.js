import React from "react";
import ReactDOM from "react-dom/client";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.min.css";
import "./assets/css/index.css"
import { AppProvider } from "./context/appContext.js";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AppProvider>
        <App />
    </AppProvider>
);
