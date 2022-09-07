import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./pages/App";
import Recipe from "./pages/Recipe";
import RecipeList from "./pages/RecipeList";

import "./css/style.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/recipe" element={<RecipeList />} />
                <Route path="/recipe/:id" element={<Recipe />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
